import {  CodeBlockContent, PublicationBlockContent } from '@/features/publications/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeRender = ({ block }: { block:CodeBlockContent  }) => {
    return (
        <>
            <div className="code-wrapper">
                <div className="code-header">
                    <span>{block.properties.language || 'code'}</span>
                    <button onClick={() => navigator.clipboard.writeText(block.properties.code)} value="Copy"/>
                </div>
            </div>
            <SyntaxHighlighter
                language={block.properties.language}
                style={dracula}
                showLineNumbers={true}
            >
                {block.properties.code}
            </SyntaxHighlighter>
        </ >    
  );
};
