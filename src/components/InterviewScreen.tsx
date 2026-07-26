'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Square, RotateCcw, Bot, CheckCircle2, Target, Lightbulb, ArrowRight, Mic, MicOff, History, X, MessageSquare } from 'lucide-react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import ScoreBadge from './ScoreBadge';
import ProgressDots from './ProgressDots';
import { useVoice } from './useVoice';
import type { InterviewTurn, Language, Level, Model, EvaluateResponse } from '@/types';

type Props = {
  domain: string;
  level: Level;
  language: Language;
  model: Model;
  turns: InterviewTurn[];
  onAnswerSubmit: (turn: InterviewTurn) => void;
  onNextQuestion: () => void;
  onEndSession: () => void;
  currentQuestion: string | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

function FeedbackCard({ turn }: { turn: InterviewTurn }) {
  if (turn.score === null) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="ml-11 flex items-center gap-3">
        <ScoreBadge score={turn.score} />
      </div>

      {turn.feedbackGood && (
        <div className="ml-11 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-4 py-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Strengths</span>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{turn.feedbackGood}</p>
            </div>
          </div>
        </div>
      )}

      {turn.feedbackImprove && (
        <div className="ml-11 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-4 py-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">To Improve</span>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{turn.feedbackImprove}</p>
            </div>
          </div>
        </div>
      )}

      {turn.modelAnswer && (
        <div className="ml-11 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-4 py-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Model Answer</span>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{turn.modelAnswer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryPanel({
  turns,
  activeIndex,
  onSelect,
  onCloseMobile,
  isMobileOpen,
}: {
  turns: InterviewTurn[];
  activeIndex: number | null;
  onSelect: (index: number | null) => void;
  onCloseMobile: () => void;
  isMobileOpen: boolean;
}) {
  return (
    <>
      <div
        className={`flex flex-col border-r border-slate-200 bg-white ${
          isMobileOpen
            ? 'absolute inset-0 z-30 sm:relative sm:inset-auto sm:w-60'
            : 'hidden sm:flex sm:w-60'
        }`}
      >
        <div className="relative flex items-center justify-center border-b border-slate-100 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-blue-600">History</span>
            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600">
              {turns.length}
            </span>
          </div>
          <button onClick={onCloseMobile} className="absolute right-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {turns.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <MessageSquare className="h-5 w-5 text-slate-200" />
              <p className="text-xs text-slate-400">No completed questions yet</p>
            </div>
          ) : (
            <div className="space-y-0.5 px-2">
              {turns.map((turn, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  className={`w-full rounded-lg text-left transition-all duration-200 ${
                    activeIndex === i
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-sm'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                        activeIndex === i
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {i + 1}
                      </div>
                      {turn.score !== null && (
                        <span className={`ml-auto text-xs font-semibold ${
                          turn.score >= 8 ? 'text-emerald-600' : turn.score >= 5 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {turn.score}/10
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{turn.question}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-2 border-t border-slate-100 px-3 py-3">
            <button
              onClick={() => onSelect(null)}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                activeIndex === null
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ArrowRight className="h-3 w-3" />
              Current Question
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm sm:hidden" onClick={onCloseMobile} />
      )}
    </>
  );
}

export default function InterviewScreen({
  domain,
  level,
  language,
  model,
  turns,
  onAnswerSubmit,
  onNextQuestion,
  onEndSession,
  currentQuestion,
  isLoading,
  error,
  onRetry,
}: Props) {
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluatedTurn, setEvaluatedTurn] = useState<InterviewTurn | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isRecording, startRecording, stopAndTranscribe, cancelRecording } = useVoice();

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [turns, currentQuestion, isLoading, evaluating, evaluatedTurn, activeTurnIndex, scrollToBottom]);

  useEffect(() => {
    if (!isLoading && currentQuestion && !evaluatedTurn && activeTurnIndex === null && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading, currentQuestion, evaluatedTurn, activeTurnIndex]);

  const handleSubmit = async () => {
    if (!answer.trim() || !currentQuestion) return;

    setEvaluating(true);
    setEvaluatedTurn(null);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, answer: answer.trim(), language, model }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      const evalData = data as EvaluateResponse;
      const turn: InterviewTurn = {
        question: currentQuestion,
        answer: answer.trim(),
        score: evalData.score,
        feedbackGood: evalData.good,
        feedbackImprove: evalData.improve,
        modelAnswer: evalData.modelAnswer,
      };

      setEvaluatedTurn(turn);
      onAnswerSubmit(turn);
      setAnswer('');
    } catch {
      const turn: InterviewTurn = {
        question: currentQuestion,
        answer: answer.trim(),
        score: null,
        feedbackGood: null,
        feedbackImprove: null,
        modelAnswer: null,
      };
      setEvaluatedTurn(turn);
      onAnswerSubmit(turn);
    } finally {
      setEvaluating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNextQuestion = () => {
    setEvaluatedTurn(null);
    setActiveTurnIndex(null);
    onNextQuestion();
  };

  const handleMicClick = async () => {
    if (isRecording) {
      setTranscribing(true);
      try {
        const text = await stopAndTranscribe();
        setAnswer((prev) => (prev ? prev + ' ' + text : text));
      } catch {
        cancelRecording();
      } finally {
        setTranscribing(false);
      }
    } else {
      try {
        await startRecording();
      } catch {
        // mic access denied
      }
    }
  };

  const handleHistorySelect = useCallback((index: number | null) => {
    setActiveTurnIndex(index);
    setHistoryOpen(false);
  }, []);

  const isViewingPast = activeTurnIndex !== null;
  const viewingTurn = isViewingPast && activeTurnIndex !== null && turns[activeTurnIndex] ? turns[activeTurnIndex] : null;
  const showInput = !evaluating && !isLoading && currentQuestion && !evaluatedTurn && !isViewingPast;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="mr-1 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:hidden"
            title="Toggle history"
          >
            <History className="h-4 w-4" />
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-sm font-medium text-slate-800">{domain}</span>
            <span className="ml-2 text-xs text-slate-400">{level}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isViewingPast && (
            <button
              onClick={() => handleHistorySelect(null)}
              className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:inline-flex"
            >
              <ArrowRight className="h-3 w-3" />
              Back to Current
            </button>
          )}
          <ProgressDots current={turns.length + 1} />
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <HistoryPanel
          turns={turns}
          activeIndex={activeTurnIndex}
          onSelect={handleHistorySelect}
          onCloseMobile={() => setHistoryOpen(false)}
          isMobileOpen={historyOpen}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          {isViewingPast && (
            <div className="border-b border-slate-200 bg-amber-50/80 px-4 py-2 sm:hidden">
              <button
                onClick={() => handleHistorySelect(null)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700"
              >
                <ArrowRight className="h-3 w-3" />
                Back to Current Question
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
              {isViewingPast && viewingTurn ? (
                <>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                      Q{activeTurnIndex !== null ? activeTurnIndex + 1 : ''}
                    </span>
                    {viewingTurn.score !== null && <ScoreBadge score={viewingTurn.score} />}
                  </div>
                  <ChatBubble role="bot">{viewingTurn.question}</ChatBubble>
                  {viewingTurn.answer && <ChatBubble role="user">{viewingTurn.answer}</ChatBubble>}
                  {viewingTurn.score !== null && <FeedbackCard turn={viewingTurn} />}
                </>
              ) : (
                <>
                  {turns.length === 0 && !isLoading && !currentQuestion && (
                    <div className="flex flex-1 items-center justify-center py-20">
                      <div className="text-center">
                        <Bot className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                        <p className="text-sm text-slate-400">Generating your first question...</p>
                      </div>
                    </div>
                  )}

                  {isLoading && turns.length === 0 && (
                    <div className="flex flex-col gap-3 pt-4">
                      <TypingIndicator />
                    </div>
                  )}

                  {isLoading && turns.length > 0 && !currentQuestion && (
                    <div className="flex flex-col gap-3 pt-4">
                      <TypingIndicator />
                    </div>
                  )}

                  {evaluating && !evaluatedTurn && (
                    <div className="flex flex-col gap-3">
                      <ChatBubble role="bot">{currentQuestion}</ChatBubble>
                      <ChatBubble role="user">{answer}</ChatBubble>
                      <TypingIndicator />
                    </div>
                  )}

                  {!evaluating && currentQuestion && !evaluatedTurn && (
                    <div className="flex flex-col gap-3">
                      <ChatBubble role="bot">{currentQuestion}</ChatBubble>
                    </div>
                  )}

                  {evaluatedTurn && (
                    <div className="flex flex-col gap-3">
                      <ChatBubble role="bot">{evaluatedTurn.question}</ChatBubble>
                      {evaluatedTurn.answer && (
                        <ChatBubble role="user">{evaluatedTurn.answer}</ChatBubble>
                      )}
                      {evaluatedTurn.score !== null && <FeedbackCard turn={evaluatedTurn} />}
                    </div>
                  )}

                  {error && (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-center">
                      <p className="text-sm text-red-600">{error}</p>
                      <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Try Again
                      </button>
                    </div>
                  )}

                  {evaluatedTurn && evaluatedTurn.score === null && !isLoading && !error && (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-center">
                      <p className="text-sm text-red-600">Could not process that response. Please try again.</p>
                      <button
                        onClick={() => {
                          setEvaluatedTurn(null);
                          setAnswer(evaluatedTurn.answer || '');
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Retry Evaluation
                      </button>
                    </div>
                  )}

                </>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {evaluatedTurn && evaluatedTurn.score !== null && !isViewingPast && (
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-4xl items-center justify-center gap-3">
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                >
                  Next Question
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onEndSession}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
                >
                  <Square className="h-3.5 w-3.5" />
                  End Session
                </button>
              </div>
            </div>
          )}

          {showInput && (
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-4xl gap-2">
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer... (Enter to submit, Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleMicClick}
                    disabled={transcribing}
                    title={isRecording ? 'Stop recording' : 'Start recording'}
                    className={`flex items-center justify-center rounded-xl p-3 text-sm shadow-sm transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-500 text-white shadow-red-200 hover:bg-red-600'
                        : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                    } disabled:opacity-40`}
                  >
                    {transcribing ? (
                      <span className="flex h-4 w-4 items-center justify-center">
                        <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
                      </span>
                    ) : isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim()}
                    className="flex items-center justify-center rounded-xl bg-blue-600 p-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
