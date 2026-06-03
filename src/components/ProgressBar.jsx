// Barra de progreso reutilizable (porcentaje de entrenamientos completados)
export default function ProgressBar({ value = 0, accent = 'accent' }) {
  const colorMap = {
    accent: 'bg-accent',
    cardio: 'bg-cardio',
  };
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface2">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${colorMap[accent] || 'bg-accent'}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
