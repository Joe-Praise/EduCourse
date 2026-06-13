interface StatBadgeProps {
  value: string | number;
  label: string;
}

const StatBadge = ({ value, label }: StatBadgeProps) => (
  <div
    className='flex flex-col items-center px-4 py-3 bg-white rounded-xl text-center'
    style={{ boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-card)' }}
  >
    <span className='text-xl font-bold text-secondary-dark'>{value}</span>
    <span className='text-xs text-gray-500 mt-0.5'>{label}</span>
  </div>
);

export default StatBadge;
