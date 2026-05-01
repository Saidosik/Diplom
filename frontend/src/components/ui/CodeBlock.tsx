// components/ui/CodeBlock.tsx
import { createHighlighter, codeToHtml } from 'shiki';
import { CopyButton } from './CopyButton';
import { CodeBlockContent } from '@/features/publications/types';

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: [], // языки будем подгружать по мере необходимости
    });
  }
  return highlighter;
}

async function highlightCode(code: string, language: string) {
  const hl = await getHighlighter();
  if (!hl.getLoadedLanguages().includes(language)) {
    await hl.loadLanguage(language as any); // Shiki примет строку, которую динамически загрузит
  }
  return hl.codeToHtml(code, {
    lang: language,
    theme: 'github-dark',
  });
}

export async function CodeBlock({ block }: { block: CodeBlockContent }) {
  if (block.type !== 'code') return null;
  const { filename, language, code } = block.properties;

  const html = await highlightCode(code, language);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 bg-[#0d1117] shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-2 text-sm text-gray-300">
        <div className="flex items-center gap-3">
          {filename && <span className="font-mono text-xs">{filename}</span>}
          <span className="rounded bg-gray-700/50 px-2 py-0.5 text-xs uppercase">{language}</span>
        </div>
        <CopyButton code={code} />
      </div>
      <div className="overflow-x-auto p-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}