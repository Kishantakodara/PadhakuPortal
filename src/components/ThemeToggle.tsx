
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-500 dark:text-gray-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-navy-950 group overflow-hidden"
      aria-label="Toggle Dark Mode"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-in-out transform ${
            theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-in-out transform ${
            theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
