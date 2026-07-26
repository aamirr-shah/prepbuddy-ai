'use client';

import { Bot, User } from 'lucide-react';

type Props = {
  role: 'bot' | 'user';
  children: React.ReactNode;
};

export default function ChatBubble({ role, children }: Props) {
  const isBot = role === 'bot';

  return (
    <div
      className={`flex w-full gap-3 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
    >
      {isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[75%] ${
          isBot
            ? 'rounded-tl-sm bg-slate-100 text-slate-800'
            : 'rounded-tr-sm border border-slate-200 bg-white text-slate-800'
        }`}
      >
        {children}
      </div>
      {!isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
