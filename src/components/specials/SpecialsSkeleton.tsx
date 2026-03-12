export default function SpecialsSkeleton() {
  return (
    <>
      <div className='mb-4 lg:hidden'>
        <div className='tabs tabs-box w-full'>
          <div className='tab flex-1'>Fridge</div>
          <div className='tab flex-1'>Freezer</div>
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-2 lg:gap-6'>
        <SectionSkeleton title='Fridge' />
        <SectionSkeleton title='Freezer' />
      </div>
    </>
  );
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className='card bg-base-200 shadow-sm'>
      <div className='card-body p-4 sm:p-6'>
        <h2 className='card-title text-xl sm:text-2xl'>{title}</h2>

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
      <div className='skeleton mb-3 h-5 w-32 sm:h-6 sm:w-36' />

      <div className='space-y-2'>
        <ItemRowSkeleton />
        <ItemRowSkeleton />
      </div>
    </div>
  );
}

function ItemRowSkeleton() {
  return (
    <div className='rounded-box border border-base-300 bg-base-100 p-3 sm:p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='skeleton h-4 w-3/4 sm:h-5' />
          <div className='mt-2 flex gap-2'>
            <div className='skeleton h-5 w-16' />
            <div className='skeleton h-5 w-20' />
          </div>
        </div>

        <div className='skeleton h-5 w-14 sm:h-6' />
      </div>
    </div>
  );
}
