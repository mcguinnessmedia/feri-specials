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
        <h1 className='text-2xl font-bold sm:text-3xl'>Hope Market Specials</h1>

        <div className='mt-2 flex flex-wrap items-center gap-2 text-sm opacity-80'>
          {state.raw?.lastUpdated ? (
            <span>Updated {formatUpdatedTime(state.raw.lastUpdated)}</span>
          ) : (
            <span>&nbsp;</span>
          )}

          {state.loading && hasData ? (
            <span className='badge badge-outline badge-sm'>Updating…</span>
          ) : null}

          {state.fromCache && hasData && !state.loading ? (
            <span className='badge badge-ghost badge-sm'>Cached</span>
          ) : null}
        </div>
      </header>

      {state.error ? <SpecialsError message={state.error} /> : null}

      {isInitialLoading ? (
        <SpecialsSkeleton />
      ) : (
        <SpecialsTabs grouped={state.grouped} />
      )}
    </main>
  );
}
