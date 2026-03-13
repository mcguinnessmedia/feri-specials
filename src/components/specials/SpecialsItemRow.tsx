import type { SpecialsItem } from '../../lib/types';

export default function SpecialsItemRow({ item }: { item: SpecialsItem }) {
  return (
    <li className='rounded-box border border-base-300 bg-base-300 p-3 sm:p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='text-sm font-medium leading-tight sm:text-base'>
            {item.name}
          </div>

          <div className='mt-2 flex flex-wrap gap-2'>
            {item.special ? (
              <span className='badge badge-primary badge-sm sm:badge-md'>
                Special
              </span>
            ) : null}

            {item.unlimited ? (
              <span className='badge badge-outline badge-sm sm:badge-md'>
                No Limit
              </span>
            ) : null}
          </div>
        </div>

        <div className='shrink-0 text-base font-bold sm:text-lg'>
          {item.price}
        </div>
      </div>
    </li>
  );
}
