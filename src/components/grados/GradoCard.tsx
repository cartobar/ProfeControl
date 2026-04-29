type GradoCardProps = {
  nombre: string;
  nivel: string;
  alumnos: number;
  isActive?: boolean;
  onSelect?: () => void;
  onGoToAlumnos?: () => void;
};

export default function GradoCard({
  nombre,
  nivel,
  alumnos,
  isActive = false,
  onSelect,
  onGoToAlumnos,
}: GradoCardProps) {
  return (
    <div
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.();
        }
      }}
      role="button"
      tabIndex={0}
      className={`w-full text-left bg-white dark:bg-gray-900 border rounded-3xl p-8 transition-all ${
        isActive
          ? 'border-blue-500 dark:border-blue-400 shadow-xl -translate-y-1'
          : 'border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {nombre}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{nivel}</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium whitespace-nowrap">
          {alumnos} alumnos
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onGoToAlumnos?.();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Ver alumnos
        </button>

        <span className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
          Editar
        </span>
      </div>
    </div>
  );
}