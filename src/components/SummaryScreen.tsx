'use client';

import { useEffect, useState } from 'react';
import { BarChart3, MessageSquareText, Sparkles, RotateCcw } from 'lucide-react';
import type { InterviewTurn, Language, Level, Model, SummaryResponse } from '@/types';
import ScoreBadge from './ScoreBadge';

type Props = {
  domain: string;
  level: Level;
  language: Language;
  model: Model;
  turns: InterviewTurn[];
  onNewSession: () => void;
};

export default function SummaryScreen({
  domain,
  level,
  language,
  model,
  turns,
  onNewSession,
}: Props) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const averageScore = turns.length > 0 ? turns.reduce((acc, t) => acc + (t.score ?? 0), 0) / turns.length : 0;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/session-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain,
            level,
            language,
            model,
            turns: turns.map((t) => ({
              question: t.question,
              answer: t.answer,
              score: t.score,
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Summary generation failed');
        }

        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [domain, level, language, model, turns]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Session Complete</h2>
            <p className="mt-1 text-sm text-slate-500">{domain} &middot; {level}</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{turns.length}</p>
              <p className="text-xs text-slate-500">Questions Answered</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {summary ? summary.averageScore.toFixed(1) : averageScore.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500">Average Score</p>
            </div>
          </div>

          {turns.map((turn, i) => (
            <div
              key={i}
              className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-slate-400">Question {i + 1}</p>
                {turn.score !== null && <ScoreBadge score={turn.score} />}
              </div>
              <p className="mb-1.5 text-sm font-medium text-slate-800">{turn.question}</p>
              {turn.answer && (
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-600">Your answer: </span>
                  {turn.answer}
                </p>
              )}
            </div>
          ))}

          {loading && (
            <div className="mb-6 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-6 shadow-sm">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-slate-500">Generating your session summary...</span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {summary && (
            <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Strengths
                </p>
                <p className="text-sm leading-relaxed text-slate-700">{summary.strengths}</p>
              </div>
              <div className="mb-5">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600">
                  Areas to Improve
                </p>
                <p className="text-sm leading-relaxed text-slate-700">{summary.weaknesses}</p>
              </div>
              <div className="rounded-lg bg-blue-50 px-4 py-3">
                <p className="text-sm font-medium text-blue-700">
                  {summary.encouragement}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl justify-center">
          <button
            onClick={onNewSession}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}
