import { NextRequest, NextResponse } from 'next/server';
import { groqChatCompletion } from '@/lib/groq';
import { buildSummaryPrompt } from '@/lib/prompts';
import type { SummaryResponse, Model } from '@/types';

function safeParseJSON(text: string): SummaryResponse | null {
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
    const { domain, level, language, turns, model } = body;

    if (!domain || !level || !turns || turns.length === 0) {
      return NextResponse.json(
        { error: 'Domain, level, and at least one turn are required' },
        { status: 400 }
      );
    }

    const messages = buildSummaryPrompt(domain, level, language ?? 'English', turns);
    const raw = await groqChatCompletion(messages, 0.5, model as Model);

    const parsed = safeParseJSON(raw);
    if (!parsed) {
      return NextResponse.json(
        { error: "Couldn't process the summary, try again" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Session summary error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}
