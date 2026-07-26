import { NextRequest, NextResponse } from 'next/server';
import { groqChatCompletion } from '@/lib/groq';
import { buildQuestionPrompt } from '@/lib/prompts';
import type { Level, Language, Model } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, level, language, previousQuestions, model } = body;

    if (!domain || !level) {
      return NextResponse.json(
        { error: 'Domain and level are required' },
        { status: 400 }
      );
    }

    const messages = buildQuestionPrompt(domain, level as Level, language as Language ?? 'English', previousQuestions ?? []);
    const question = await groqChatCompletion(messages, 0.7, model as Model);

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Generate question error:', error);
    return NextResponse.json(
      { error: 'Failed to generate question. Please try again.' },
      { status: 500 }
    );
  }
}
