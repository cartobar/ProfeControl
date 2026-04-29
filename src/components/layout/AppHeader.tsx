import type { Maestro } from '../../lib/types';
import { GraduationCap, Settings, Sun, Moon } from 'lucide-react';

type AppHeaderProps = {
  maestro: Maestro;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export default function AppHeader({
  maestro,
  darkMode,
  onToggleDarkMode,
}: AppHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <GraduationCap className="w-9 h-9 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ProfeControl
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestion de clases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Bienvenido,{' '}
            <span className="text-blue-600 dark:text-blue-400">
              {maestro.nombre}
            </span>
          </span>

          <button
            onClick={onToggleDarkMode}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}