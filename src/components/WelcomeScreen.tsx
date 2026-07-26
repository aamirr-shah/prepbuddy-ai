'use client';

import { MessageSquareText, ArrowRight, Zap, BarChart3, Lightbulb } from 'lucide-react';

type Props = {
  onStart: () => void;
};

export default function WelcomeScreen({ onStart }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
        <MessageSquareText className="h-10 w-10 text-white" />
      </div>

      <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        PrepBuddy AI
      </h1>

      <p className="mb-2 max-w-md text-lg text-slate-600">
        Your personal AI interview coach. Practice mock interviews for any tech field, at any level.
      </p>

      <p className="mb-10 max-w-sm text-sm text-slate-400">
        No sign-up needed. Just pick your domain and start.
      </p>

      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]"
      >
        Start Interview
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="mt-16 grid grid-cols-3 gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-slate-500">Live AI questions</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-slate-500">Instant scoring</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Lightbulb className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-slate-500">Smart feedback</span>
        </div>
      </div>
    </div>
  );
}
