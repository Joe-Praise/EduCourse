import { ReactNode } from 'react';

interface DashboardOverviewCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
}

const DashboardOverviewCard = ({
  label,
  value,
  icon,
  trend,
}: DashboardOverviewCardProps) => {
  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-4'>
      {icon && (
        <div className='w-10 h-10 rounded-lg bg-primary-color/10 flex items-center justify-center text-primary-color flex-shrink-0'>
          {icon}
        </div>
      )}
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-gray-500 mb-1'>{label}</p>
        <p className='text-2xl font-bold text-secondary-dark truncate'>{value}</p>
        {trend !== undefined && (
          <p
            className={`text-xs mt-1 font-medium ${
              isPositiveTrend ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {isPositiveTrend ? '↑' : '↓'} {Math.abs(trend)}% this month
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewCard;
