import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return getSystemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const stored = window.localStorage.getItem('theme');

      if (stored === 'light' || stored === 'dark') return;

      const nextTheme = mediaQuery.matches ? 'dark' : 'light';
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

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
        className={theme === 'light' ? '' : 'opacity-40'}
      />

      <input
        type='checkbox'
        className='toggle toggle-sm sm:toggle-md'
        checked={theme === 'dark'}
        onChange={toggleTheme}
        aria-label='Toggle dark mode'
      />

      <Moon
        size={18}
        strokeWidth={1.75}
        className={theme === 'dark' ? '' : 'opacity-40'}
      />
    </label>
  );
}
