// src/components/specials/SpecialsApp.tsx
import { useEffect, useState } from 'react';
import { SpecialsClient, type SpecialsState } from '../../lib/specials-client';
import { formatUpdatedTime } from '../../lib/format';
import type { GroupedSpecialsSection, SpecialsItem } from '../../lib/types';

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
    <main className='container mx-auto px-4 py-6 md:px-6'>
      <header className='mb-6'>
        <h1 className='text-3xl font-bold'>Hope Market Specials</h1>

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
        <div className='grid gap-6 lg:grid-cols-2'>
          <SpecialsSection
            title='Fridge'
            sections={state.grouped?.fridge ?? []}
            emptyMessage='No fridge specials available.'
          />

          <SpecialsSection
            title='Freezer'
            sections={state.grouped?.freezer ?? []}
            emptyMessage='No freezer specials available.'
          />
        </div>
      )}
    </main>
  );
}

function SpecialsSection({
  title,
  sections,
  emptyMessage,
}: {
  title: string;
  sections: GroupedSpecialsSection[];
  emptyMessage: string;
}) {
  return (
    <section className='card bg-base-200 shadow-sm'>
      <div className='card-body'>
        <h2 className='card-title text-2xl'>{title}</h2>

        {sections.length === 0 ? (
          <p className='opacity-70'>{emptyMessage}</p>
        ) : (
          <div className='space-y-6'>
            {sections.map((section) => (
              <div key={section.key}>
                <h3 className='mb-3 text-lg font-semibold'>{section.label}</h3>

                <ul className='space-y-2'>
                  {section.items.map((item, index) => (
                    <SpecialsItemRow
                      key={`${section.key}-${item.name}-${index}`}
                      item={item}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SpecialsItemRow({ item }: { item: SpecialsItem }) {
  return (
    <li className='rounded-box border border-base-300 bg-base-100 p-3'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <div className='font-medium leading-tight'>{item.name}</div>

          <div className='mt-2 flex flex-wrap gap-2'>
            {item.special ? (
              <span className='badge badge-primary'>Special</span>
            ) : null}
            {item.unlimited ? (
              <span className='badge badge-outline'>No Limit</span>
            ) : null}
          </div>
        </div>

        <div className='shrink-0 text-lg font-bold'>{item.price}</div>
      </div>
    </li>
  );
}

function SpecialsError({ message }: { message: string }) {
  return (
    <div className='alert alert-error mb-6'>
      <span>{message}</span>
    </div>
  );
}

function SpecialsSkeleton() {
  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <SectionSkeleton title='Fridge' />
      <SectionSkeleton title='Freezer' />
    </div>
  );
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className='card bg-base-200 shadow-sm'>
      <div className='card-body'>
        <h2 className='card-title text-2xl'>{title}</h2>

        <div className='space-y-5'>
          <LocationBlockSkeleton />
          <LocationBlockSkeleton />
          <LocationBlockSkeleton />
        </div>
      </div>
    </section>
  );
}

function LocationBlockSkeleton() {
  return (
    <div>
      <div className='skeleton mb-3 h-6 w-36' />

      <div className='space-y-2'>
        <ItemRowSkeleton />
        <ItemRowSkeleton />
        <ItemRowSkeleton />
      </div>
    </div>
  );
}

function ItemRowSkeleton() {
  return (
    <div className='rounded-box border border-base-300 bg-base-100 p-3'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <div className='skeleton h-5 w-3/4' />
          <div className='mt-2 flex gap-2'>
            <div className='skeleton h-5 w-16' />
            <div className='skeleton h-5 w-20' />
          </div>
        </div>

        <div className='skeleton h-6 w-14 shrink-0' />
      </div>
    </div>
  );
}
