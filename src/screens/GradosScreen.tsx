import { useEffect, useMemo, useState } from 'react';
import type { Grado, Maestro } from '../lib/types';
import {
  getAlumnosCountByGrado,
  getGradosOrdenados,
  seedGradosIfEmpty,
} from '../lib/db';
import AppHeader from '../components/layout/AppHeader';
import GradosStats from '../components/grados/GradosStats';
import GradoCard from '../components/grados/GradoCard';

type GradosScreenProps = {
  maestro: Maestro;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onVolver: () => void;
  onIrAAlumnos: (grado: { id: string; nombre: string }) => void;
};

export default function GradosScreen({
  maestro,
  darkMode,
  onToggleDarkMode,
  onVolver,
  onIrAAlumnos,
}: GradosScreenProps) {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [alumnosByGrado, setAlumnosByGrado] = useState<Record<string, number>>({});
  const [gradoActivoId, setGradoActivoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGrados = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await seedGradosIfEmpty();
        const gradosOrdenados = await getGradosOrdenados();

        const alumnosCounts = await Promise.all(
          gradosOrdenados.map(async (grado) => ({
            gradoId: grado.id,
            total: await getAlumnosCountByGrado(grado.id),
          }))
        );

        const alumnosMap = alumnosCounts.reduce<Record<string, number>>((acc, item) => {
          acc[item.gradoId] = item.total;
          return acc;
        }, {});

        setGrados(gradosOrdenados);
        setAlumnosByGrado(alumnosMap);
        setGradoActivoId((prev) => prev ?? gradosOrdenados[0]?.id ?? null);
      } catch (loadError) {
        console.error('Error al cargar grados:', loadError);
        setError('No se pudieron cargar los grados. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGrados();
  }, []);

  const total = grados.length;
  const inicial = useMemo(
    () => grados.filter((grado) => grado.nivel === 'Inicial').length,
    [grados]
  );
  const primaria = useMemo(
    () => grados.filter((grado) => grado.nivel === 'Primaria').length,
    [grados]
  );

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
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
              Organizacion escolar
            </p>
            <h2 className="text-3xl font-bold">Gestionar Grados</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Administra los grados y organiza a tus alumnos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onVolver}
              className="px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Volver
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-md">
              Nuevo grado
            </button>
          </div>
        </div>

        <GradosStats total={total} inicial={inicial} primaria={primaria} />

        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 text-center text-gray-600 dark:text-gray-400">
            Cargando grados...
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-3xl p-8 text-center text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {grados.map((grado) => (
              <GradoCard
                key={grado.id}
                nombre={grado.nombre}
                nivel={grado.nivel}
                alumnos={alumnosByGrado[grado.id] ?? 0}
                isActive={gradoActivoId === grado.id}
                onSelect={() => setGradoActivoId(grado.id)}
                onGoToAlumnos={() => onIrAAlumnos({ id: grado.id, nombre: grado.nombre })}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}