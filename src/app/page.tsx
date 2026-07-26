'use client';

import { useState, useCallback } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import SetupScreen from '@/components/SetupScreen';
import InterviewScreen from '@/components/InterviewScreen';
import SummaryScreen from '@/components/SummaryScreen';
import type { Level, Language, Model, InterviewTurn, SessionState } from '@/types';

const initialState: SessionState = {
  domain: '',
  level: 'Beginner',
  language: 'English',
  model: 'llama-3.3-70b-versatile',
  turns: [],
  view: 'welcome',
};

export default function Home() {
  const [state, setState] = useState<SessionState>(initialState);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(
    async (domain: string, level: Level, language: Language, model: Model, previousQuestions: string[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, level, language, model, previousQuestions }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate question');
        }

        setCurrentQuestion(data.question);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleStart = () => {
    setState((prev) => ({ ...prev, view: 'setup', turns: [] }));
  };

  const handleBegin = (domain: string, level: Level, language: Language, model: Model) => {
    setState((prev) => ({
      ...prev,
      domain,
      level,
      language,
      model,
      view: 'interview',
      turns: [],
    }));
    setCurrentQuestion(null);
    generateQuestion(domain, level, language, model, []);
  };

  const handleAnswerSubmit = (turn: InterviewTurn) => {
    setState((prev) => ({
      ...prev,
      turns: [...prev.turns, turn],
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(null);
    generateQuestion(state.domain, state.level, state.language, state.model, state.turns.map((t) => t.question));
  };

  const handleEndSession = () => {
    setState((prev) => ({ ...prev, view: 'summary' }));
    setCurrentQuestion(null);
  };

  const handleNewSession = () => {
    setState(initialState);
    setCurrentQuestion(null);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    generateQuestion(state.domain, state.level, state.language, state.model, state.turns.map((t) => t.question));
  };

  return (
    <div className="flex h-dvh items-center justify-center px-2 py-2 sm:px-4 sm:py-4">
      <div className="flex h-full min-h-[600px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50">
        {state.view === 'welcome' && <WelcomeScreen onStart={handleStart} />}

        {state.view === 'setup' && <SetupScreen onBegin={handleBegin} />}

        {state.view === 'interview' && (
          <InterviewScreen
            domain={state.domain}
            level={state.level}
            language={state.language}
            model={state.model}
            turns={state.turns}
            onAnswerSubmit={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
            onEndSession={handleEndSession}
            currentQuestion={currentQuestion}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        )}

        {state.view === 'summary' && (
          <SummaryScreen
            domain={state.domain}
            level={state.level}
            language={state.language}
            model={state.model}
            turns={state.turns}
            onNewSession={handleNewSession}
          />
        )}
      </div>
    </div>
  );
}
