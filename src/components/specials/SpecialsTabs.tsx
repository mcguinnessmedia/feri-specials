import { useMemo, useState } from 'react';
import type { GroupedSpecials } from '../../lib/types';
import SpecialsSection from './SpecialsSection';

type TabKey = 'fridge' | 'freezer';

export default function SpecialsTabs({
  grouped,
}: {
  grouped: GroupedSpecials | null;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('fridge');

  const fridgeSections = useMemo(() => grouped?.fridge ?? [], [grouped]);
  const freezerSections = useMemo(() => grouped?.freezer ?? [], [grouped]);

  if (!grouped) {
    return null;
  }

  return (
    <>
      {/* Mobile / tablet tabs */}
      <div className='lg:hidden'>
        <div
          role='tablist'
          className='tabs tabs-box mb-4 w-full'
        >
          <button
            role='tab'
            type='button'
            className={`tab flex-1 ${activeTab === 'fridge' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('fridge')}
            aria-selected={activeTab === 'fridge'}
          >
            Fridge
          </button>

          <button
            role='tab'
            type='button'
            className={`tab flex-1 ${activeTab === 'freezer' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('freezer')}
            aria-selected={activeTab === 'freezer'}
          >
            Freezer
          </button>
        </div>

        {activeTab === 'fridge' ? (
          <SpecialsSection
            title='Fridge'
            sections={fridgeSections}
            emptyMessage='No fridge specials available.'
          />
        ) : (
          <SpecialsSection
            title='Freezer'
            sections={freezerSections}
            emptyMessage='No freezer specials available.'
          />
        )}
      </div>

      {/* Desktop two-column layout */}
      <div className='hidden gap-6 lg:grid lg:grid-cols-2'>
        <SpecialsSection
          title='Fridge'
          sections={fridgeSections}
          emptyMessage='No fridge specials available.'
        />

        <SpecialsSection
          title='Freezer'
          sections={freezerSections}
          emptyMessage='No freezer specials available.'
        />
      </div>
    </>
  );
}
