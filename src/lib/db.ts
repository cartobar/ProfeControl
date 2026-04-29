// src/lib/db.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Grado, Alumno, Tarea, Calificacion, Maestro, GradoNombre } from './types';

class ProfeControlDB extends Dexie {
  maestro!: Table<Maestro, string>;
  grados!: Table<Grado, string>;
  alumnos!: Table<Alumno, string>;
  tareas!: Table<Tarea, string>;
  calificaciones!: Table<Calificacion, string>;

  constructor() {
    super('ProfeControlDB');

    this.version(1).stores({
      maestro: 'id',
      grados: 'id, nombre, orden, nivel',
      alumnos: 'id, grado_id, num_lista, nombre_completo',
      tareas: 'id, grado_id, fecha_entrega, tipo',
      calificaciones: 'id, alumno_id, tarea_id, [alumno_id+tarea_id]',
    });

    // v2 agrega indice compuesto para validar num_lista por grado.
    this.version(2).stores({
      maestro: 'id',
      grados: 'id, nombre, orden, nivel',
      alumnos: 'id, grado_id, num_lista, nombre_completo, [grado_id+num_lista]',
      tareas: 'id, grado_id, fecha_entrega, tipo',
      calificaciones: 'id, alumno_id, tarea_id, [alumno_id+tarea_id]',
    });
  }
}

export const db = new ProfeControlDB();

const GRADOS_PREDEFINIDOS: Array<{ id: string; nombre: GradoNombre; nivel: string; orden: number }> = [
  { id: 'nursery', nombre: 'Nursery', nivel: 'Inicial', orden: 1 },
  { id: 'prepa', nombre: 'Prepa', nivel: 'Inicial', orden: 2 },
  { id: 'pre-kinder', nombre: 'Pre-kinder', nivel: 'Inicial', orden: 3 },
  { id: 'kinder', nombre: 'Kinder', nivel: 'Inicial', orden: 4 },
  { id: '1-primaria', nombre: '1° Primaria', nivel: 'Primaria', orden: 5 },
  { id: '2-primaria', nombre: '2° Primaria', nivel: 'Primaria', orden: 6 },
  { id: '3-primaria', nombre: '3° Primaria', nivel: 'Primaria', orden: 7 },
  { id: '4-primaria', nombre: '4° Primaria', nivel: 'Primaria', orden: 8 },
  { id: '5-primaria', nombre: '5° Primaria', nivel: 'Primaria', orden: 9 },
  { id: '6-primaria', nombre: '6° Primaria', nivel: 'Primaria', orden: 10 },
];

export const seedGradosIfEmpty = async (): Promise<void> => {
  const totalGrados = await db.grados.count();

  if (totalGrados === 0) {
    await db.grados.bulkAdd(GRADOS_PREDEFINIDOS);
  }
};

export const getGradosOrdenados = async (): Promise<Grado[]> => {
  return db.grados.orderBy('orden').toArray();
};

export const getAlumnosCountByGrado = async (gradoId: string): Promise<number> => {
  return db.alumnos.where('grado_id').equals(gradoId).count();
};

export const getAlumnosByGrado = async (gradoId: string): Promise<Alumno[]> => {
  return db.alumnos.where('grado_id').equals(gradoId).sortBy('num_lista');
};

const normalizeName = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();

export const createAlumno = async (params: {
  gradoId: string;
  numLista: number;
  nombreCompleto: string;
}): Promise<Alumno> => {
  const alreadyExists = await db.alumnos
    .where('[grado_id+num_lista]')
    .equals([params.gradoId, params.numLista])
    .first();

  if (alreadyExists) {
    throw new Error('El numero de lista ya existe en este grado.');
  }

  const normalizedNewName = normalizeName(params.nombreCompleto);
  const existingSameGrade = await db.alumnos.where('grado_id').equals(params.gradoId).toArray();
  const duplicateByName = existingSameGrade.find(
    (alumno) => normalizeName(alumno.nombre_completo) === normalizedNewName
  );

  if (duplicateByName) {
    throw new Error('Este alumno ya existe en este grado.');
  }

  const alumno: Alumno = {
    id: crypto.randomUUID(),
    grado_id: params.gradoId,
    num_lista: params.numLista,
    nombre_completo: params.nombreCompleto,
    created_at: new Date(),
  };

  await db.alumnos.add(alumno);
  return alumno;
};

export const createAlumnosBatch = async (
  gradoId: string,
  alumnosInput: Array<{ numLista: number; nombreCompleto: string }>
): Promise<number> => {
  if (alumnosInput.length === 0) {
    return 0;
  }

  const uniqueCheck = new Set<number>();
  const uniqueNameCheck = new Set<string>();
  for (const item of alumnosInput) {
    if (uniqueCheck.has(item.numLista)) {
      throw new Error(`El numero de lista ${item.numLista} esta repetido en la carga.`);
    }
    uniqueCheck.add(item.numLista);

    const normalizedName = normalizeName(item.nombreCompleto);
    if (uniqueNameCheck.has(normalizedName)) {
      throw new Error(`El alumno "${item.nombreCompleto}" esta repetido en la carga.`);
    }
    uniqueNameCheck.add(normalizedName);
  }

  const existing = await db.alumnos.where('grado_id').equals(gradoId).toArray();
  const existingNumList = new Set(existing.map((alumno) => alumno.num_lista));
  const existingNames = new Set(existing.map((alumno) => normalizeName(alumno.nombre_completo)));
  const duplicated = alumnosInput.find((item) => existingNumList.has(item.numLista));
  if (duplicated) {
    throw new Error(`El numero de lista ${duplicated.numLista} ya existe en este grado.`);
  }

  const duplicatedByName = alumnosInput.find((item) =>
    existingNames.has(normalizeName(item.nombreCompleto))
  );
  if (duplicatedByName) {
    throw new Error(`El alumno "${duplicatedByName.nombreCompleto}" ya existe en este grado.`);
  }

  const toInsert: Alumno[] = alumnosInput.map((item) => ({
    id: crypto.randomUUID(),
    grado_id: gradoId,
    num_lista: item.numLista,
    nombre_completo: item.nombreCompleto,
    created_at: new Date(),
  }));

  await db.alumnos.bulkAdd(toInsert);
  return toInsert.length;
};

export const updateAlumno = async (params: {
  alumnoId: string;
  gradoId: string;
  numLista: number;
  nombreCompleto: string;
}): Promise<void> => {
  const current = await db.alumnos.get(params.alumnoId);
  if (!current) {
    throw new Error('No se encontro el alumno a editar.');
  }

  const existingSameGrade = await db.alumnos.where('grado_id').equals(params.gradoId).toArray();
  const duplicateNum = existingSameGrade.find(
    (alumno) => alumno.id !== params.alumnoId && alumno.num_lista === params.numLista
  );
  if (duplicateNum) {
    throw new Error('El numero de lista ya existe en este grado.');
  }

  const normalizedNewName = normalizeName(params.nombreCompleto);
  const duplicateName = existingSameGrade.find(
    (alumno) =>
      alumno.id !== params.alumnoId &&
      normalizeName(alumno.nombre_completo) === normalizedNewName
  );
  if (duplicateName) {
    throw new Error('Este alumno ya existe en este grado.');
  }

  await db.alumnos.update(params.alumnoId, {
    num_lista: params.numLista,
    nombre_completo: params.nombreCompleto,
  });
};

export const deleteAlumno = async (alumnoId: string): Promise<void> => {
  await db.alumnos.delete(alumnoId);
};

// Funciones de ayuda para seguridad
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export default db;