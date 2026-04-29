import type { Maestro } from '../lib/types';
import AppHeader from '../components/layout/AppHeader';
import DashboardCard from '../components/dashboard/DashboardCard';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Download,
} from 'lucide-react';

type DashboardProps = {
  maestro: Maestro;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (actionKey: DashboardActionKey) => void;
};

type DashboardActionKey =
  | 'grados'
  | 'alumnos'
  | 'tareas'
  | 'calificaciones'
  | 'exportar';

const cards: Array<{
  title: string;
  desc: string;
  icon: typeof GraduationCap;
  iconWrapperClassName: string;
  iconClassName: string;
  actionKey: DashboardActionKey;
}> = [
  {
    title: 'Gestionar Grados',
    desc: 'Nursery hasta 6° Primaria',
    icon: GraduationCap,
    iconWrapperClassName: 'bg-blue-100 dark:bg-blue-900/30',
    iconClassName: 'text-blue-600 dark:text-blue-400',
    actionKey: 'grados',
  },
  {
    title: 'Mis Alumnos',
    desc: 'Lista y gestion por grado',
    icon: Users,
    iconWrapperClassName: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconClassName: 'text-emerald-600 dark:text-emerald-400',
    actionKey: 'alumnos',
  },
  {
    title: 'Crear Tareas',
    desc: 'Asignar y revisar entregas',
    icon: BookOpen,
    iconWrapperClassName: 'bg-amber-100 dark:bg-amber-900/30',
    iconClassName: 'text-amber-600 dark:text-amber-400',
    actionKey: 'tareas',
  },
  {
    title: 'Calificaciones',
    desc: 'Notas y promedios',
    icon: Award,
    iconWrapperClassName: 'bg-purple-100 dark:bg-purple-900/30',
    iconClassName: 'text-purple-600 dark:text-purple-400',
    actionKey: 'calificaciones',
  },
  {
    title: 'Exportar a Excel',
    desc: 'Generar reportes',
    icon: Download,
    iconWrapperClassName: 'bg-rose-100 dark:bg-rose-900/30',
    iconClassName: 'text-rose-600 dark:text-rose-400',
    actionKey: 'exportar',
  },
];

export default function Dashboard({
  maestro,
  darkMode,
  onToggleDarkMode,
  onNavigate,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AppHeader
        maestro={maestro}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-10">¿Que deseas hacer hoy?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((item) => (
            <DashboardCard
              key={item.title}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              iconWrapperClassName={item.iconWrapperClassName}
              iconClassName={item.iconClassName}
              onClick={() => onNavigate(item.actionKey)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}