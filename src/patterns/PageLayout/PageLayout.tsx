import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type PageWidth = 'default' | 'readable' | 'bleed';

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
	width?: PageWidth;
	ambient?: boolean;
	children: ReactNode;
}

const widthClass: Record<PageWidth, string> = {
	default: 'max-w-container',
	readable: 'max-w-readable',
	bleed: 'max-w-none px-0',
};

export const PageLayout = ({
	width = 'default',
	ambient = false,
	className,
	children,
	...rest
}: PageLayoutProps) => (
	<div className={cn('relative isolate w-full', className)} {...rest}>
		{ambient && (
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'
			>
				<div
					className='absolute -left-20 -top-32 h-[480px] w-[480px] rounded-full blur-[120px]'
					style={{ background: 'rgba(139,92,246,0.14)' }}
				/>
				<div
					className='absolute right-0 top-1/2 h-[360px] w-[360px] rounded-full blur-[120px]'
					style={{ background: 'rgba(168,85,247,0.08)' }}
				/>
			</div>
		)}
		<div
			className={cn(
				'mx-auto',
				width !== 'bleed' && 'px-4 sm:px-6 lg:px-8',
				widthClass[width],
			)}
		>
			{children}
		</div>
	</div>
);
