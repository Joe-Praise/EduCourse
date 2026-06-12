import { useId, type HTMLAttributes, type ReactElement, cloneElement } from 'react';
import { cn } from '../../lib/cn';

interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	label?: string;
	helper?: string;
	error?: string;
	required?: boolean;
	hideLabel?: boolean;
	children: ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>;
}

export const Field = ({
	label,
	helper,
	error,
	required,
	hideLabel,
	className,
	children,
	...rest
}: FieldProps) => {
	const baseId = useId();
	const inputId = children.props.id ?? `${baseId}-input`;
	const helperId = helper ? `${baseId}-helper` : undefined;
	const errorId = error ? `${baseId}-error` : undefined;
	const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

	const enhancedChild = cloneElement(children, {
		id: inputId,
		'aria-describedby': describedBy,
		'aria-invalid': error ? true : undefined,
	});

	return (
		<div className={cn('flex flex-col gap-1.5', className)} {...rest}>
			{label && (
				<label
					htmlFor={inputId}
					className={cn(
						'font-body text-sm font-medium text-ink-secondary',
						hideLabel && 'sr-only',
					)}
				>
					{label}
					{required && <span className='ml-1 text-signal-danger'>*</span>}
				</label>
			)}
			{enhancedChild}
			{helper && !error && (
				<span id={helperId} className='font-body text-xs text-ink-tertiary'>
					{helper}
				</span>
			)}
			{error && (
				<span id={errorId} role='alert' className='font-body text-xs text-signal-danger'>
					{error}
				</span>
			)}
		</div>
	);
};
