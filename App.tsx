
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DiagramType } from './types';
import { generateMermaidCode } from './services/geminiService';
import Header from './components/Header';
import Controls from './components/Controls';
import DiagramPreview from './components/DiagramPreview';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [diagramType, setDiagramType] = useState<DiagramType>(DiagramType.Flowchart);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const diagramPreviewRef = useRef<{ getSVG: () => SVGSVGElement | null }>(null);

  useEffect(() => {
    try {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const decodedString = atob(hash);
        const data = JSON.parse(decodedString);
        if (data.code && data.type) {
          setMermaidCode(data.code);
          setDiagramType(data.type);
        }
      }
    } catch (e) {
      console.error("Failed to parse hash:", e);
    }
  }, []);
  
  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) {
      setError('作業内容を入力してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const code = await generateMermaidCode(userInput, diagramType);
      setMermaidCode(code);
    } catch (err) {
      setError('図の生成に失敗しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, diagramType]);

  const handleCopyCode = useCallback(() => {
    if (!mermaidCode) return;
    navigator.clipboard.writeText(mermaidCode);
  }, [mermaidCode]);

  const handleShareLink = useCallback(() => {
    if (!mermaidCode) return;
    const data = JSON.stringify({ code: mermaidCode, type: diagramType });
    const hash = btoa(data);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    alert('共有リンクがクリップボードにコピーされました！');
  }, [mermaidCode, diagramType]);

  const exportDiagram = (format: 'svg' | 'png' | 'pdf') => {
    const svgElement = diagramPreviewRef.current?.getSVG();
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const download = (href: string, extension: string) => {
        const a = document.createElement('a');
        a.href = href;
        a.download = `diagram.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(href);
    }

    if (format === 'svg') {
      download(url, 'svg');
    } else if (format === 'png') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngUrl = canvas.toDataURL('image/png');
            download(pngUrl, 'png');
            URL.revokeObjectURL(url);
        };
        img.src = url;
    } else if (format === 'pdf') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');

          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height]
          });
          pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
          pdf.save('diagram.pdf');
          URL.revokeObjectURL(url);
        }
        img.src = url;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <Controls
          userInput={userInput}
          setUserInput={setUserInput}
          diagramType={diagramType}
          setDiagramType={setDiagramType}
          onGenerate={handleGenerate}
          onCopyCode={handleCopyCode}
          onShareLink={handleShareLink}
          onExport={exportDiagram}
          isLoading={isLoading}
        />
        <DiagramPreview
          ref={diagramPreviewRef}
          mermaidCode={mermaidCode}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
