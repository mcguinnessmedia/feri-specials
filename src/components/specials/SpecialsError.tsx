export default function SpecialsError({ message }: { message: string }) {
  return (
    <div className='alert alert-error mb-4 sm:mb-6'>
      <span>{message}</span>
    </div>
  );
}
