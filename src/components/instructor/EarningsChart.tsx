interface MonthData {
  month: string;
  total: number;
}

interface EarningsChartProps {
  data: MonthData[];
}

const EarningsChart = ({ data }: EarningsChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className='flex items-center justify-center h-40 font-body text-sm text-ink-tertiary italic'>
        No earnings data yet
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className='flex items-end gap-3 h-40 px-2'>
      {data.map((item) => {
        const heightPercent = Math.max((item.total / maxValue) * 100, 4);
        return (
          <div key={item.month} className='flex-1 flex flex-col items-center gap-2 group'>
            {/* Tooltip */}
            <div className='opacity-0 group-hover:opacity-100 transition-opacity font-mono text-2xs uppercase tracking-[0.12em] bg-bg-overlay border border-line-base text-ink-primary rounded-pill px-2 py-0.5 whitespace-nowrap tabular-nums'>
              ${item.total.toFixed(0)}
            </div>
            {/* Bar */}
            <div
              className='w-full rounded-t-md bg-gradient-to-t from-clay-600 to-clay-400 transition-[height,filter] duration-base ease-out-quart group-hover:brightness-110'
              style={{ height: `${heightPercent}%` }}
            />
            {/* Label */}
            <p className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary truncate w-full text-center'>
              {item.month.slice(5)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default EarningsChart;
