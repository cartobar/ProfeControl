// src/lib/db.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Grado, Alumno, Tarea, Calificacion, Maestro } from './types';

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
  }
}

export const db = new ProfeControlDB();

// Funciones de ayuda para seguridad
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export default db;