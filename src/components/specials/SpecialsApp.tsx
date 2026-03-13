import { useEffect, useState } from 'react';
import { SpecialsClient, type SpecialsState } from '../../lib/specials-client';
import { formatUpdatedTime } from '../../lib/format';
import SpecialsTabs from './SpecialsTabs';
import SpecialsSkeleton from './SpecialsSkeleton';
import SpecialsError from './SpecialsError';

const POLL_INTERVAL_MS = 5 * 60 * 1000;

const initialState: SpecialsState = {
  raw: null,
  grouped: null,
  loading: false,
  error: null,
  fromCache: false,
};

export default function SpecialsApp() {
  const [state, setState] = useState<SpecialsState>(initialState);

  useEffect(() => {
    const client = new SpecialsClient({
      pollIntervalMs: POLL_INTERVAL_MS,
      revalidateOnVisibility: true,
    });

    const unsubscribe = client.subscribe((nextState) => {
      setState(nextState);
    });

    void client.init();
    client.startPolling();

    return () => {
      unsubscribe();
      client.destroy();
    };
  }, []);

  const isInitialLoading = state.loading && !state.grouped;
  const hasData = !!state.grouped;

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6'>
      <header className='mb-4 sm:mb-6'>
        <div className='rounded-box border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-4 md:flex-row md:gap-4'>
            <div className='inline-flex items-center rounded-md border border-base-300 bg-[#edf3f2] pl-3 pr-2 py-2 w-fit'>
              <img
                src='/images/feedri-hopemarket-logo.png'
                alt='FeedRI Hope Market'
                className='h-10 w-auto sm:h-12'
              />
            </div>

            <div className='space-y-2'>
              <h1 className='text-2xl font-bold leading-tight sm:text-3xl'>
                Daily Fridge &amp; Freezer Specials
              </h1>

              <div className='flex flex-wrap items-center gap-2 text-sm opacity-80'>
                {state.raw?.lastUpdated ? (
                  <span>
                    Last updated {formatUpdatedTime(state.raw.lastUpdated)}
                  </span>
                ) : (
                  <span>&nbsp;</span>
                )}

                {state.loading && hasData ? (
                  <span className='badge badge-outline badge-sm'>
                    Updating…
                  </span>
                ) : null}

                {state.fromCache && hasData && !state.loading ? (
                  <span className='badge badge-ghost badge-sm'>Cached</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      {state.error ? <SpecialsError message={state.error} /> : null}

      <aside className='rounded-box bg-base-200 p-3 text-sm leading-relaxed mb-4 sm:mb-6'>
        Fridge &amp; freezer specials are available while supplies last. Limit 1
        of each item per customer unless otherwise noted.
      </aside>

      {isInitialLoading ? (
        <SpecialsSkeleton />
      ) : (
        <SpecialsTabs grouped={state.grouped} />
      )}

      <footer className='mt-4 rounded-box bg-base-200 p-4 text-sm sm:mt-6'>
        Learn more at{' '}
        <a
          className='font-semibold text-primary underline hover:no-underline'
          href='https://feedri.org'
          target='_blank'
          rel='noreferrer'
        >
          FeedRI.org
        </a>
        .
      </footer>
    </main>
  );
}
