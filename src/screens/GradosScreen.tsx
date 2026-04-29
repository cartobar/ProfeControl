import type { Maestro } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';
import GradosStats from '../components/grados/GradosStats';
import GradoCard from '../components/grados/GradoCard';

type GradosScreenProps = {
  maestro: Maestro;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onVolver: () => void;
};

const gradosMock = [
  { nombre: 'Nursery', nivel: 'Inicial', alumnos: 18 },
  { nombre: 'Prepa', nivel: 'Inicial', alumnos: 22 },
  { nombre: 'Pre-kinder', nivel: 'Inicial', alumnos: 19 },
  { nombre: 'Kinder', nivel: 'Inicial', alumnos: 20 },
  { nombre: '1° Primaria', nivel: 'Primaria', alumnos: 24 },
  { nombre: '2° Primaria', nivel: 'Primaria', alumnos: 26 },
  { nombre: '3° Primaria', nivel: 'Primaria', alumnos: 21 },
  { nombre: '4° Primaria', nivel: 'Primaria', alumnos: 23 },
  { nombre: '5° Primaria', nivel: 'Primaria', alumnos: 25 },
  { nombre: '6° Primaria', nivel: 'Primaria', alumnos: 20 },
];

export default function GradosScreen({
  maestro,
  darkMode,
  onToggleDarkMode,
  onVolver,
}: GradosScreenProps) {
  const total = gradosMock.length;
  const inicial = gradosMock.filter((grado) => grado.nivel === 'Inicial').length;
  const primaria = gradosMock.filter((grado) => grado.nivel === 'Primaria').length;

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

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {gradosMock.map((grado) => (
            <GradoCard
              key={grado.nombre}
              nombre={grado.nombre}
              nivel={grado.nivel}
              alumnos={grado.alumnos}
            />
          ))}
        </section>
      </main>
    </div>
  );
}