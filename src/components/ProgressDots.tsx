'use client';

type Props = {
  current: number;
};

export default function ProgressDots({ current }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-slate-500">Question {current}</span>
      <div className="hidden gap-1 sm:flex">
        {Array.from({ length: Math.min(current, 8) }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current - 1 ? 'w-4 bg-blue-600' : 'w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
