export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export type Language = 'Roman Urdu' | 'English';

export type Model =
  | 'llama-3.3-70b-versatile'
  | 'llama-3.1-8b-instant'
  | 'openai/gpt-oss-120b'
  | 'openai/gpt-oss-20b';

export type View = 'welcome' | 'setup' | 'interview' | 'summary';

export type InterviewTurn = {
  question: string;
  answer: string | null;
  score: number | null;
  feedbackGood: string | null;
  feedbackImprove: string | null;
  modelAnswer: string | null;
};

export type SessionState = {
  domain: string;
  level: Level;
  language: Language;
  model: Model;
  turns: InterviewTurn[];
  view: View;
};

export type EvaluateResponse = {
  score: number;
  good: string;
  improve: string;
  modelAnswer: string;
};

export type SummaryResponse = {
  averageScore: number;
  strengths: string;
  weaknesses: string;
  encouragement: string;
};
