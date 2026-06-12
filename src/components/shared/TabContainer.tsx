import { ElementType, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Iprop {
	buttonContainer?: ElementType;
	lecture?: boolean;
	buttons: ReactNode;
	children: ReactNode;
}

const TabContainer = ({
	children,
	buttons,
	buttonContainer: ButtonContainer = 'ul',
	lecture,
}: Iprop) => {
	return (
		<div className={cn('min-h-[40vh]', lecture && 'md:w-3/4 mx-auto')}>
			<ButtonContainer className='flex items-center gap-1 border-b border-line-subtle'>
				{buttons}
			</ButtonContainer>
			<div
				className={cn(
					'p-4 sm:p-6',
					!lecture && 'rounded-b-card border-x border-b border-line-subtle bg-bg-raised text-ink-primary',
				)}
			>
				{children}
			</div>
		</div>
	);
};

export default TabContainer;
