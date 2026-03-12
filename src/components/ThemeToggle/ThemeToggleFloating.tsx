import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function ThemeToggleFloating() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className={[
        'fixed right-3 top-3 z-50 transition-all duration-200 ease-out sm:right-5 sm:top-5',
        isScrolled
          ? 'translate-y-[-4px] scale-95 opacity-80'
          : 'translate-y-0 scale-100 opacity-100',
      ].join(' ')}
      aria-label='Appearance settings'
    >
      <div className='rounded-full border border-base-300 bg-base-200/80 p-1 shadow-md backdrop-blur hover:bg-base-200/90'>
        <ThemeToggle />
      </div>
    </div>
  );
}
