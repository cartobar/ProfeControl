import type { Maestro } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';

type CalificacionesScreenProps = {
  maestro: Maestro;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onVolver: () => void;
};

export default function CalificacionesScreen({
  maestro,
  darkMode,
  onToggleDarkMode,
  onVolver,
}: CalificacionesScreenProps) {
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
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
              Seguimiento academico
            </p>
            <h2 className="text-3xl font-bold">Calificaciones</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Aqui podras visualizar notas, entregas y promedios por grado.
            </p>
          </div>

          <button
            onClick={onVolver}
            className="px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Volver
          </button>
        </div>

        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-8">
          <p className="text-gray-700 dark:text-gray-300">
            Pantalla lista para conectar modulo de calificaciones.
          </p>
        </section>
      </main>
    </div>
  );
}
