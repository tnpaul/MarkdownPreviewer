import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    fontFamily?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
    content, 
    className = '', 
    fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
}) => {
    const isDarkMode = document.documentElement.classList.contains('dark');

    const components: Components = {
        h1: ({ children, ...props }) => (
            <h1
                className="text-3xl font-semibold leading-tight mt-3 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                {...props}
            >
                {children}
            </h1>
        ),
        h2: ({ children, ...props }) => (
            <h2
                className="text-2xl font-semibold leading-tight mt-3 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                {...props}
            >
                {children}
            </h2>
        ),
        h3: ({ children, ...props }) => (
            <h3
                className="text-xl font-semibold leading-tight mt-3 mb-4 text-gray-900 dark:text-gray-100"
                {...props}
            >
                {children}
            </h3>
        ),
        h4: ({ children, ...props }) => (
            <h4
                className="text-base font-semibold leading-tight mt-3 mb-4 text-gray-900 dark:text-gray-100"
                {...props}
            >
                {children}
            </h4>
        ),
        h5: ({ children, ...props }) => (
            <h5
                className="text-sm font-semibold leading-tight mt-3 mb-4 text-gray-900 dark:text-gray-100"
                {...props}
            >
                {children}
            </h5>
        ),
        h6: ({ children, ...props }) => (
            <h6
                className="text-xs font-semibold leading-tight mt-3 mb-4 text-gray-600 dark:text-gray-400"
                {...props}
            >
                {children}
            </h6>
        ),
        p: ({ children, ...props }) => (
            <p className="mb-4 leading-relaxed text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </p>
        ),
        ul: ({ children, ...props }) => (
            <ul className="mb-4 ml-6 list-disc space-y-1" {...props}>
                {children}
            </ul>
        ),
        ol: ({ children, ...props }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-1" {...props}>
                {children}
            </ol>
        ),
        li: ({ children, ...props }) => (
            <li className="leading-relaxed text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </li>
        ),
        blockquote: ({ children, ...props }) => (
            <blockquote 
                className="mb-4 ml-0 pl-4 border-l-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800 py-2"
                {...props}
            >
                {children}
            </blockquote>
        ),
        hr: ({ ...props }) => (
            <hr className="my-8 border-0 border-t border-gray-200 dark:border-gray-700" {...props} />
        ),
        a: ({ children, href, ...props }) => (
            <a
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-1 underline-offset-2 hover:decoration-2"
                {...props}
            >
                {children}
            </a>
        ),
        strong: ({ children, ...props }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </strong>
        ),
        em: ({ children, ...props }) => (
            <em className="italic text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </em>
        ),
        del: ({ children, ...props }) => (
            <del className="line-through text-gray-600 dark:text-gray-400" {...props}>
                {children}
            </del>
        ),
        code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const inline = !match;
            
            return !inline && match ? (
                <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        {match[1]}
                    </div>
                    <SyntaxHighlighter
                        style={isDarkMode ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0 }}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm" {...props}>
                    {children}
                </code>
            );
        },
        table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                    {children}
                </table>
            </div>
        ),
        th: ({ children, ...props }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold" {...props}>
                {children}
            </th>
        ),
        td: ({ children, ...props }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
                {children}
            </td>
        ),
        img: ({ src, alt, title, ...props }) => (
            <img 
                src={src} 
                alt={alt || ''}
                title={title}
                className="max-w-full h-auto rounded-md border border-gray-200 dark:border-gray-700 my-4"
                loading="lazy"
                {...props}
            />
        ),
    };

    return (
        <div 
            className={`prose prose-gray dark:prose-invert max-w-none ml-8 ${className}`}
            style={{ fontFamily }}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;