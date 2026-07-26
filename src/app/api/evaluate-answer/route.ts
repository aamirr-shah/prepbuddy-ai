import { NextRequest, NextResponse } from 'next/server';
import { groqChatCompletion } from '@/lib/groq';
import { buildEvaluationPrompt } from '@/lib/prompts';
import type { EvaluateResponse, Model } from '@/types';

function safeParseJSON(text: string): EvaluateResponse | null {
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    cleaned = jsonMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, language, model } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const messages = buildEvaluationPrompt(question, answer, language ?? 'English');
    const raw = await groqChatCompletion(messages, 0.3, model as Model);

    const parsed = safeParseJSON(raw);
    if (!parsed) {
      return NextResponse.json(
        { error: "Couldn't process that, try again" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Evaluate answer error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer. Please try again.' },
      { status: 500 }
    );
  }
}
