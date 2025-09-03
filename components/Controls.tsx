
import React, { useState } from 'react';
import { DiagramType } from '../types';
import { CopyIcon, ShareIcon, DownloadIcon } from './icons/ActionIcons';

interface ControlsProps {
  userInput: string;
  setUserInput: (value: string) => void;
  diagramType: DiagramType;
  setDiagramType: (type: DiagramType) => void;
  onGenerate: () => void;
  onCopyCode: () => void;
  onShareLink: () => void;
  onExport: (format: 'svg' | 'png' | 'pdf') => void;
  isLoading: boolean;
}

const DiagramTypeButton: React.FC<{ type: DiagramType; label: string; activeType: DiagramType; onClick: (type: DiagramType) => void; }> = ({ type, label, activeType, onClick }) => (
  <button
    onClick={() => onClick(type)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 ${
      activeType === type
        ? 'bg-blue-600 text-white shadow'
        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);


const Controls: React.FC<ControlsProps> = ({
  userInput,
  setUserInput,
  diagramType,
  setDiagramType,
  onGenerate,
  onCopyCode,
  onShareLink,
  onExport,
  isLoading,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 overflow-y-auto">
      <div>
        <label htmlFor="userInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          作業内容
        </label>
        <textarea
          id="userInput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="例：
1. ユーザーがログインページを開く
2. IDとパスワードを入力して送信
3. サーバーが認証情報を検証
4. 認証成功ならダッシュボードにリダイレクト"
          className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
          rows={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          図の種類
        </label>
        <div className="flex space-x-2">
          <DiagramTypeButton type={DiagramType.Flowchart} label="フローチャート" activeType={diagramType} onClick={setDiagramType} />
          <DiagramTypeButton type={DiagramType.Sequence} label="シーケンス図" activeType={diagramType} onClick={setDiagramType} />
          <DiagramTypeButton type={DiagramType.Gantt} label="ガントチャート" activeType={diagramType} onClick={setDiagramType} />
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </>
        ) : (
          '図を生成する'
        )}
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center space-x-2">
        <button onClick={onCopyCode} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition">
            <CopyIcon className="w-4 h-4" />
            <span>コードをコピー</span>
        </button>
        <button onClick={onShareLink} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition">
            <ShareIcon className="w-4 h-4" />
            <span>共有</span>
        </button>
        <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition">
                <DownloadIcon className="w-4 h-4" />
                <span>エクスポート</span>
            </button>
            {isExportOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        <a href="#" onClick={(e) => { e.preventDefault(); onExport('svg'); setIsExportOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">SVG</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onExport('png'); setIsExportOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">PNG</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onExport('pdf'); setIsExportOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">PDF</a>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Controls;
