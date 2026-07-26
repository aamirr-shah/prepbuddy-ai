'use client';

import { useState, useRef, useEffect } from 'react';
import { Cpu, Zap, Sparkles, ChevronDown } from 'lucide-react';
import type { Level, Language, Model } from '@/types';

const DOMAINS = [
  'AI / Machine Learning',
  'Web Development',
  'Data Science',
  'Networking',
  'Cybersecurity',
  'DevOps',
  'General CS Fundamentals',
];

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];

const MODELS: { value: Model; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', desc: 'Best quality reasoning', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', desc: 'Fastest responses', icon: <Zap className="h-4 w-4" /> },
  { value: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', desc: 'OpenAI-grade reasoning', icon: <Cpu className="h-4 w-4" /> },
  { value: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B', desc: 'Fast & capable', icon: <Cpu className="h-4 w-4" /> },
];

function CustomSelect({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm shadow-sm transition-all duration-200 ${
          value
            ? 'border-slate-300 bg-white text-slate-800'
            : 'border-slate-300 bg-white text-slate-400'
        } hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100`}
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                value === opt
                  ? 'bg-blue-50 font-medium text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  onBegin: (domain: string, level: Level, language: Language, model: Model) => void;
};

export default function SetupScreen({ onBegin }: Props) {
  const [domain, setDomain] = useState('');
  const [otherDomain, setOtherDomain] = useState('');
  const [level, setLevel] = useState<Level | null>(null);
  const [language, setLanguage] = useState<Language>('English');
  const [model, setModel] = useState<Model>('llama-3.3-70b-versatile');
  const [error, setError] = useState('');

  const selectedDomain = domain === 'Other' ? otherDomain.trim() : domain;

  const handleBegin = () => {
    if (!selectedDomain || !level) {
      setError('Please select a domain and experience level.');
      return;
    }
    onBegin(selectedDomain, level, language, model);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-10">
      <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
        Configure Your Interview
      </h2>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Field / Domain
        </label>
        <CustomSelect
          value={domain}
          options={[...DOMAINS, 'Other']}
          placeholder="Select your field..."
          onChange={(v) => { setDomain(v); setError(''); }}
        />
        {domain === 'Other' && (
          <input
            type="text"
            value={otherDomain}
            onChange={(e) => { setOtherDomain(e.target.value); setError(''); }}
            placeholder="Enter your field..."
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        )}
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Experience Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); setError(''); }}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                level === l
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Language
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['English', 'Roman Urdu'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                language === l
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          AI Model
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map((m) => (
            <button
              key={m.value}
              onClick={() => setModel(m.value)}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                model === m.value
                  ? 'border-2 border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="shrink-0 text-blue-500">{m.icon}</span>
              <div>
                <span className="block font-medium">{m.label}</span>
                <span className="block text-xs opacity-60">{m.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-4 text-center text-sm text-red-500">{error}</p>
      )}

      <button
        onClick={handleBegin}
        className="w-full rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]"
      >
        Begin Interview
      </button>
    </div>
  );
}
