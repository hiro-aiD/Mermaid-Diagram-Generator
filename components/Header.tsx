
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons/ThemeIcons';

const Header: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md flex-shrink-0">
      <div className="flex items-center space-x-2">
        <svg
          className="w-8 h-8 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v18M3 12h18" />
          <path d="M12 21a9 9 0 1 0-9-9" />
          <path d="M12 3a9 9 0 1 1 9 9" />
        </svg>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">マーメイド図ジェネレーター</h1>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        aria-label="テーマを切り替える"
      >
        {theme === 'light' ? (
            <MoonIcon className="w-6 h-6" />
        ) : (
            <SunIcon className="w-6 h-6" />
        )}
      </button>
    </header>
  );
};

export default Header;
