import ThemeToggle from './ThemeToggle';

export default function ThemeToggleFloating() {
  return (
    <div className='fixed right-3 top-3 z-50 sm:right-5 sm:top-5'>
      <div className='rounded-full bg-base-200/80 p-1 shadow backdrop-blur'>
        <ThemeToggle />
      </div>
    </div>
  );
}
