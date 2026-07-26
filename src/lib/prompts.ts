import type { Level, Language } from '@/types';

export function buildQuestionPrompt(
  domain: string,
  level: Level,
  language: Language,
  previousQuestions: string[]
): { role: 'system' | 'user'; content: string }[] {
  const previousQuestionsList =
    previousQuestions.length > 0
      ? previousQuestions.map((q) => `- ${q}`).join('\n')
      : 'None yet -- this is the first question.';

  const langInstruction =
    language === 'Roman Urdu'
      ? 'Ask the question in Roman Urdu (casual Urdu written in English script).'
      : 'Ask the question in English.';

  const systemPrompt = `You are an experienced technical interviewer conducting a mock interview for a candidate applying in the field of ${domain}, at ${level} experience level.

${langInstruction}

Ask exactly ONE realistic interview question that a real employer would ask in this field and level. It should be clear, specific, and answerable in a few sentences to a short paragraph. Do not ask multiple questions. Do not include any preamble, numbering, or explanation -- return ONLY the question text itself.

Avoid repeating question themes already covered in this session:
${previousQuestionsList}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Ask me a ${level} level ${domain} interview question.` },
  ];
}

export function buildEvaluationPrompt(
  question: string,
  answer: string,
  language: Language
): { role: 'system' | 'user'; content: string }[] {
  const systemPrompt = `You are a friendly but honest interview coach. Respond in ${language} (if Roman Urdu, use casual Roman Urdu script, not formal Urdu script).

Evaluate the answer and return a JSON object with EXACTLY these fields:
{
  "score": <integer 1-10>,
  "good": "<1-2 sentences on what was good about the answer>",
  "improve": "<1-2 sentences on what was missing or could be improved>",
  "modelAnswer": "<a short 2-4 sentence example of a strong answer>"
}

Return ONLY valid JSON, no markdown code fences, no extra text.`;

  const userPrompt = `Interview Question: ${question}
Candidate's Answer: ${answer}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

export function buildSummaryPrompt(
  domain: string,
  level: Level,
  language: Language,
  turns: { question: string; answer: string | null; score: number | null }[]
): { role: 'system' | 'user'; content: string }[] {
  const transcript = turns
    .map(
      (t, i) =>
        `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer ?? '(no answer)'}\nScore: ${t.score ?? 'N/A'}`
    )
    .join('\n\n');

  const systemPrompt = `You are an interview coach reviewing a full mock interview session.
Domain: ${domain}, Level: ${level}.

Respond in ${language}. Return a JSON object with:
{
  "averageScore": <number>,
  "strengths": "<2-3 sentence summary of what the candidate did well overall>",
  "weaknesses": "<2-3 sentence summary of recurring gaps>",
  "encouragement": "<one warm, motivating closing line>"
}

Return ONLY valid JSON, no markdown code fences.`;

  const userPrompt = `Here are all questions, answers, and scores from the session:
${transcript}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}
