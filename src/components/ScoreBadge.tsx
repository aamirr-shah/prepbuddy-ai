'use client';

import { useEffect, useState } from 'react';

type Props = {
  score: number;
};

export default function ScoreBadge({ score }: Props) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const config =
    score >= 8
      ? { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', label: 'Excellent' }
      : score >= 5
        ? { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', label: 'Good' }
        : { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Needs work' };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
        config.bg
      } ${config.text} ${config.border} ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
    >
      <span>{score}/10</span>
      <span className="font-normal opacity-70">{config.label}</span>
    </div>
  );
}
