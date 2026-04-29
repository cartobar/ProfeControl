type GradosStatsProps = {
    total: number;
    inicial: number;
    primaria: number;
  };
  
  export default function GradosStats({
    total,
    inicial,
    primaria,
  }: GradosStatsProps) {
    const stats = [
      { label: 'Total de grados', value: total },
      { label: 'Nivel inicial', value: inicial },
      { label: 'Primaria', value: primaria },
    ];
  
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-6"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
          </div>
        ))}
      </section>
    );
  }