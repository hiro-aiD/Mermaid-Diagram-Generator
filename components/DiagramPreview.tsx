
import React, { useEffect, useRef, useId, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../hooks/useTheme';
import LoadingSpinner from './LoadingSpinner';

interface DiagramPreviewProps {
  mermaidCode: string;
  isLoading: boolean;
  error: string | null;
}

const DiagramPreview = forwardRef<{ getSVG: () => SVGSVGElement | null }, DiagramPreviewProps>(
  ({ mermaidCode, isLoading, error }, ref) => {
    const mermaidContainerRef = useRef<HTMLDivElement>(null);
    const diagramId = `mermaid-diagram-${useId()}`;
    const [theme] = useTheme();

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'sans-serif'
        });
    }, [theme]);

    useEffect(() => {
      if (mermaidContainerRef.current && mermaidCode && !isLoading) {
        mermaidContainerRef.current.innerHTML = mermaidCode;
        mermaidContainerRef.current.removeAttribute('data-processed');
        try {
          mermaid.run({ nodes: [mermaidContainerRef.current] });
        } catch (e) {
            console.error(e);
        }
      }
    }, [mermaidCode, isLoading, theme]);

    useImperativeHandle(ref, () => ({
        getSVG: () => {
            if (mermaidContainerRef.current) {
                return mermaidContainerRef.current.querySelector('svg');
            }
            return null;
        }
    }), []);

    return (
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner p-4 overflow-hidden">
        <div className="flex-grow flex items-center justify-center w-full h-full overflow-auto p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <LoadingSpinner />
                <p className="mt-4 text-lg">図を生成しています...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p className="font-semibold">エラーが発生しました</p>
              <p>{error}</p>
            </div>
          ) : mermaidCode ? (
            <div ref={mermaidContainerRef} id={diagramId} className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full">
              {/* Mermaid will render here */}
            </div>
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500">
              <p className="text-xl">ここに図が表示されます</p>
              <p className="mt-2">左のパネルで作業内容を入力し、「図を生成する」をクリックしてください。</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default DiagramPreview;
