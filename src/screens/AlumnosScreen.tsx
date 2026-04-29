import { useEffect, useState } from 'react';
import {
  createAlumno,
  createAlumnosBatch,
  deleteAlumno,
  getAlumnosByGrado,
  sanitizeString,
  updateAlumno,
} from '../lib/db';
import type { Alumno, Maestro } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';

type AlumnosScreenProps = {
  maestro: Maestro;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onVolver: () => void;
  gradoActivo?: {
    id: string;
    nombre: string;
  } | null;
};

export default function AlumnosScreen({
  maestro,
  darkMode,
  onToggleDarkMode,
  onVolver,
  gradoActivo,
}: AlumnosScreenProps) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [numListaInput, setNumListaInput] = useState('');
  const [nombreInput, setNombreInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAlumnoId, setEditingAlumnoId] = useState<string | null>(null);
  const [editNumListaInput, setEditNumListaInput] = useState('');
  const [editNombreInput, setEditNombreInput] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const loadAlumnos = async (gradoId?: string) => {
    if (!gradoId) {
      setAlumnos([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getAlumnosByGrado(gradoId);
      setAlumnos(result);
    } catch (loadError) {
      console.error('Error al cargar alumnos:', loadError);
      setError('No se pudieron cargar los alumnos del grado activo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlumnos(gradoActivo?.id);
  }, [gradoActivo?.id]);

  const resetForm = () => {
    setNumListaInput('');
    setNombreInput('');
    setBulkInput('');
    setIsBulkMode(false);
    setFormError(null);
    setIsCreating(false);
  };

  const handleCreateAlumno = async () => {
    if (!gradoActivo?.id) {
      setFormError('Primero selecciona un grado desde Gestionar Grados.');
      return;
    }

    const numLista = Number(numListaInput);
    const nombreCompleto = sanitizeString(nombreInput);

    if (!Number.isInteger(numLista) || numLista <= 0) {
      setFormError('El numero de lista debe ser un entero mayor a 0.');
      return;
    }

    if (nombreCompleto.length < 3) {
      setFormError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      await createAlumno({
        gradoId: gradoActivo.id,
        numLista,
        nombreCompleto,
      });

      await loadAlumnos(gradoActivo.id);
      resetForm();
    } catch (createError) {
      console.error('Error al crear alumno:', createError);
      setFormError(
        createError instanceof Error
          ? createError.message
          : 'No se pudo crear el alumno. Intenta de nuevo.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAlumnosBatch = async () => {
    if (!gradoActivo?.id) {
      setFormError('Primero selecciona un grado desde Gestionar Grados.');
      return;
    }

    const rows = bulkInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (rows.length === 0) {
      setFormError('Ingresa al menos una linea con el formato: numero, nombre.');
      return;
    }

    const parsed: Array<{ numLista: number; nombreCompleto: string }> = [];

    for (const row of rows) {
      const [numRaw, ...nameParts] = row.split(',');
      const numLista = Number(numRaw?.trim());
      const nombreCompleto = sanitizeString(nameParts.join(',').trim());

      if (!Number.isInteger(numLista) || numLista <= 0) {
        setFormError(`Formato invalido en linea "${row}". Usa: numero, nombre.`);
        return;
      }

      if (nombreCompleto.length < 3) {
        setFormError(`Nombre invalido en linea "${row}".`);
        return;
      }

      parsed.push({ numLista, nombreCompleto });
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const inserted = await createAlumnosBatch(gradoActivo.id, parsed);
      await loadAlumnos(gradoActivo.id);
      resetForm();
      alert(`Se agregaron ${inserted} alumnos correctamente.`);
    } catch (createError) {
      console.error('Error en carga masiva de alumnos:', createError);
      setFormError(
        createError instanceof Error
          ? createError.message
          : 'No se pudieron agregar los alumnos. Intenta de nuevo.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const beginEditAlumno = (alumno: Alumno) => {
    setEditingAlumnoId(alumno.id);
    setEditNumListaInput(String(alumno.num_lista));
    setEditNombreInput(alumno.nombre_completo);
    setEditError(null);
  };

  const cancelEditAlumno = () => {
    setEditingAlumnoId(null);
    setEditNumListaInput('');
    setEditNombreInput('');
    setEditError(null);
  };

  const handleSaveAlumnoEdit = async () => {
    if (!gradoActivo?.id || !editingAlumnoId) return;

    const numLista = Number(editNumListaInput);
    const nombreCompleto = sanitizeString(editNombreInput);

    if (!Number.isInteger(numLista) || numLista <= 0) {
      setEditError('El numero de lista debe ser un entero mayor a 0.');
      return;
    }
    if (nombreCompleto.length < 3) {
      setEditError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      await updateAlumno({
        alumnoId: editingAlumnoId,
        gradoId: gradoActivo.id,
        numLista,
        nombreCompleto,
      });
      await loadAlumnos(gradoActivo.id);
      cancelEditAlumno();
    } catch (updateError) {
      setEditError(
        updateError instanceof Error
          ? updateError.message
          : 'No se pudo editar el alumno. Intenta de nuevo.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAlumno = async (alumno: Alumno) => {
    if (!gradoActivo?.id) return;
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar a ${alumno.nombre_completo}? Esta accion no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await deleteAlumno(alumno.id);
      await loadAlumnos(gradoActivo.id);
    } catch (deleteError) {
      alert(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el alumno.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AppHeader
        maestro={maestro}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
              Gestion academica
            </p>
            <h2 className="text-3xl font-bold">Mis Alumnos</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Aqui podras listar, agregar y editar alumnos por grado.
            </p>
            {gradoActivo ? (
              <p className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-sm font-medium">
                Grado activo: {gradoActivo.nombre}
              </p>
            ) : null}
          </div>

          <button
            onClick={onVolver}
            className="px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Volver
          </button>
        </div>

        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold">Listado de alumnos</h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating((prev) => !prev);
                setFormError(null);
              }}
              disabled={!gradoActivo}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Nuevo alumno
            </button>
          </div>

          {isCreating ? (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
              <div className="mb-4 inline-flex rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkMode(false);
                    setFormError(null);
                  }}
                  className={`px-4 py-2 text-sm font-medium ${
                    !isBulkMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkMode(true);
                    setFormError(null);
                  }}
                  className={`px-4 py-2 text-sm font-medium ${
                    isBulkMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Carga masiva
                </button>
              </div>

              {!isBulkMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Numero de lista
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={numListaInput}
                      onChange={(event) => setNumListaInput(event.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                      placeholder="Ej. 12"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre completo
                    </span>
                    <input
                      type="text"
                      value={nombreInput}
                      onChange={(event) => setNombreInput(event.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                      placeholder="Ej. Ana Sofia Perez"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pega varias lineas con formato: numero, nombre
                  </span>
                  <textarea
                    value={bulkInput}
                    onChange={(event) => setBulkInput(event.target.value)}
                    rows={6}
                    className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                    placeholder={'1, Ana Sofia Perez\n2, Luis Alberto Diaz\n3, Maria Fernanda Lopez'}
                  />
                </label>
              )}

              {formError ? (
                <p className="mt-3 text-sm text-red-700 dark:text-red-300">{formError}</p>
              ) : null}

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={isBulkMode ? handleCreateAlumnosBatch : handleCreateAlumno}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {isSaving
                    ? 'Guardando...'
                    : isBulkMode
                    ? 'Guardar lote'
                    : 'Guardar alumno'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}

          {!gradoActivo ? (
            <p className="text-gray-600 dark:text-gray-400">
              Selecciona un grado desde Gestionar Grados para ver sus alumnos.
            </p>
          ) : isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Cargando alumnos...</p>
          ) : error ? (
            <p className="text-red-700 dark:text-red-300">{error}</p>
          ) : alumnos.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              Aun no hay alumnos registrados en {gradoActivo.nombre}.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      # Lista
                    </th>
                    <th className="py-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      Nombre completo
                    </th>
                    <th className="py-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((alumno) => (
                    <tr
                      key={alumno.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-3 pr-4 text-gray-800 dark:text-gray-200">
                        {editingAlumnoId === alumno.id ? (
                          <input
                            type="number"
                            min={1}
                            value={editNumListaInput}
                            onChange={(event) => setEditNumListaInput(event.target.value)}
                            className="w-24 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                          />
                        ) : (
                          alumno.num_lista
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-800 dark:text-gray-200">
                        {editingAlumnoId === alumno.id ? (
                          <input
                            type="text"
                            value={editNombreInput}
                            onChange={(event) => setEditNombreInput(event.target.value)}
                            className="w-full max-w-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                          />
                        ) : (
                          alumno.nombre_completo
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {editingAlumnoId === alumno.id ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveAlumnoEdit}
                              disabled={isSaving}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditAlumno}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => beginEditAlumno(alumno)}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAlumno(alumno)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editError ? (
                <p className="mt-3 text-sm text-red-700 dark:text-red-300">{editError}</p>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
