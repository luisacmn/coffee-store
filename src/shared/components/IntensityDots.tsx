interface IntensityDotsProps {
  intensity: number;
  max?: number;
}

export function IntensityDots({ intensity, max = 5 }: IntensityDotsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Intensity ${intensity} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`inline-block h-2 w-2 rounded-full transition-colors ${
            i < intensity ? 'bg-coffee-medium' : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
}
