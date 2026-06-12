import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Iprops {
	question: string;
	answer: string;
}

const FaqAccordion = ({ question, answer }: Iprops) => {
	const [open, setOpen] = useState(false);

	return (
		<div className='rounded-card border border-line-subtle bg-bg-raised hover:border-line-base transition-colors overflow-hidden'>
			<button
				type='button'
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left'
			>
				<span className='font-display font-medium text-base sm:text-lg text-ink-primary tracking-[-0.01em]'>
					{question}
				</span>
				<ChevronDown
					size={18}
					strokeWidth={1.75}
					className={cn(
						'shrink-0 text-ink-tertiary transition-transform duration-base ease-out-quart',
						open && 'rotate-180 text-clay-400',
					)}
				/>
			</button>
			<div
				className={cn(
					'grid overflow-hidden transition-all duration-base ease-out-quart',
					open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
				)}
			>
				<div className='overflow-hidden'>
					<p className='px-5 pb-5 font-body text-sm text-ink-secondary leading-[1.6]'>
						{answer}
					</p>
				</div>
			</div>
		</div>
	);
};

export default FaqAccordion;
