import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'hopemarket-light' | 'hopemarket-dark';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'hopemarket-light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'hopemarket-dark'
    : 'hopemarket-light';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'hopemarket-light';

  const stored = window.localStorage.getItem('theme');
  if (stored === 'hopemarket-light' || stored === 'hopemarket-dark') {
    return stored;
  }

  return getSystemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('hopemarket-light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const stored = window.localStorage.getItem('theme');

      if (stored === 'hopemarket-light' || stored === 'hopemarket-dark') return;

      const nextTheme = mediaQuery.matches
        ? 'hopemarket-dark'
        : 'hopemarket-light';
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  function toggleTheme() {
    const nextTheme: Theme =
      theme === 'hopemarket-light' ? 'hopemarket-dark' : 'hopemarket-light';

    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
  }

  if (!mounted) {
    return null;
  }

  return (
    <label className='flex cursor-pointer items-center gap-2'>
      <Sun
        size={18}
        strokeWidth={1.75}
        className={theme === 'hopemarket-light' ? '' : 'opacity-40'}
      />

      <input
        type='checkbox'
        className='toggle toggle-sm sm:toggle-md'
        checked={theme === 'hopemarket-dark'}
        onChange={toggleTheme}
        aria-label='Toggle dark mode'
      />

      <Moon
        size={18}
        strokeWidth={1.75}
        className={theme === 'hopemarket-dark' ? '' : 'opacity-40'}
      />
    </label>
  );
}
