import type { GroupedSpecialsSection } from '../../lib/types';
import SpecialsItemRow from './SpecialsItemRow';

interface Props {
  title: string;
  sections: GroupedSpecialsSection[];
  emptyMessage: string;
}

export default function SpecialsSection({
  title,
  sections,
  emptyMessage,
}: Props) {
  return (
    <section className='card bg-base-200 shadow-sm'>
      <div className='card-body p-4 sm:p-6'>
        <h2 className='card-title text-xl sm:text-2xl'>{title}</h2>

        {sections.length === 0 ? (
          <p className='opacity-70'>{emptyMessage}</p>
        ) : (
          <div className='space-y-5'>
            {sections.map((section) => (
              <div key={section.key}>
                <h3 className='mb-3 text-base font-semibold sm:text-lg'>
                  {section.label}
                </h3>

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
