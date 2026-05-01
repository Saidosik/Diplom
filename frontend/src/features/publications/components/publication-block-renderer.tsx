// components/publication-block-renderer.tsx
import { CodeBlock } from '@/components/ui/CodeBlock';
import { MarkdownBlock } from '@/components/ui/MarkdownBlock';
import { VideoBlockClient } from '@/components/ui/VideoBlockClient';
import { PublicationBlockContent } from '../types';


export function PublicationBlockRenderer({ blocks }: { blocks: PublicationBlockContent[] }) {
    const sorted = [...blocks].sort((a, b) => a.sort_order - b.sort_order);

    return (
        <div className="space-y-6">
            {sorted.map((block) => {
                switch (block.type) {
                    case 'heading': {
                        const Tag = `h${block.properties.level}` as keyof JSX.IntrinsicElements;
                        return <Tag key={block.id}>{block.properties.text}</Tag>;
                    }
                    case 'paragraph':
                        return <p key={block.id}>{block.properties.text}</p>;
                    case 'markdown':
                        return <MarkdownBlock key={block.id} content={block.properties.text} />;
                    case 'image':
                        return (
                            <figure key={block.id}>
                                <img src={block.properties.src} alt={block.properties.alt} className="rounded-lg" />
                                {block.properties.caption && <figcaption>{block.properties.caption}</figcaption>}
                            </figure>
                        );
                    case 'code':
                        return <CodeBlock key={block.id} block={block} />;
                    case 'video':
                        return <VideoBlockClient key={block.id} url={block.properties.url} title={block.properties.title} />;
                    case 'important':
                        return (
                            <div key={block.id} className="rounded border-l-4 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 p-4">
                                <strong className="block font-semibold text-yellow-900 dark:text-yellow-100">
                                    {block.properties.title}
                                </strong>
                                <p className="mt-1 text-yellow-800 dark:text-yellow-200">
                                    {block.properties.text}
                                </p>
                            </div>
                        );

                    case 'warning':
                        return (
                            <div key={block.id} className="rounded border-l-4 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 p-4">
                                <strong className="block font-semibold text-red-900 dark:text-red-100">
                                    {block.properties.title}
                                </strong>
                                <p className="mt-1 text-red-800 dark:text-red-200">
                                    {block.properties.text}
                                </p>
                            </div>
                        );
                    case 'quote':
                        return (
                            <blockquote key={block.id} className="italic border-l-4 pl-4">
                                {block.properties.text}
                                {block.properties.author && <footer>— {block.properties.author}</footer>}
                            </blockquote>
                        );
                    
                    case 'link':
                        return (
                            <a key={block.id} href={block.properties.url} className="text-blue-600 underline">
                                {block.properties.title}
                            </a>
                        );
                    case 'divider':
                        const styleObj = typeof block.properties.style === 'object' ? block.properties.style : undefined;
                        return <hr key={block.id} style={styleObj} />;
                    default:
                        return <div key={block.id}>Неизвестный блок: {block.type}</div>;
                }
            })}
        </div>
    );
}