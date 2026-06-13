import { useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/cn';

interface EditorialInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
	label: string;
	error?: string | false;
	touched?: boolean;
}

/**
 * Underline-style input — no boxed field, no rounded card.
 * The label sits as a mono uppercase eyebrow above the line.
 * Focus pulls a clay underline. Error pulls a danger underline.
 * Password fields get a show/hide affordance.
 */
export const EditorialInput = ({
	label,
	error,
	touched,
	type = 'text',
	id,
	required,
	...rest
}: EditorialInputProps) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const isPassword = type === 'password';
	const [revealed, setRevealed] = useState<boolean>(false);
	const effectiveType = isPassword ? (revealed ? 'text' : 'password') : type;
	const showError = !!(touched && error);

	return (
		<div className='relative pt-6'>
			<label
				htmlFor={inputId}
				className={cn(
					'block font-mono text-2xs uppercase tracking-[0.22em] mb-1.5 transition-colors duration-base',
					showError ? 'text-signal-danger' : 'text-ink-tertiary',
				)}
			>
				{label}
				{required && <span className='ml-1 text-clay-400'>*</span>}
			</label>
			<div className='relative'>
				<input
					{...rest}
					id={inputId}
					type={effectiveType}
					required={required}
					aria-invalid={showError || undefined}
					className={cn(
						'peer w-full bg-transparent outline-none border-0 border-b text-ink-primary placeholder:text-ink-muted font-body',
						'py-2.5 pr-8 text-base',
						'transition-[border-color] duration-base',
						showError
							? 'border-signal-danger focus:border-signal-danger'
							: 'border-line-base focus:border-clay-500 hover:border-line-strong',
					)}
				/>
				{/* Animated thicker underline on focus — clay */}
				<span
					aria-hidden
					className={cn(
						'pointer-events-none absolute left-0 right-0 -bottom-px h-[2px] origin-left bg-clay-500',
						'scale-x-0 peer-focus:scale-x-100 transition-transform duration-base ease-out-quart',
						showError && 'bg-signal-danger',
					)}
				/>
				{isPassword && (
					<button
						type='button'
						onClick={() => setRevealed((r) => !r)}
						tabIndex={-1}
						aria-label={revealed ? 'Hide password' : 'Show password'}
						className='absolute right-1 top-1/2 -translate-y-1/2 inline-grid place-items-center h-7 w-7 text-ink-tertiary hover:text-ink-primary transition-colors'
					>
						{revealed ? <EyeOff size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
					</button>
				)}
			</div>
			<p
				role={showError ? 'alert' : undefined}
				className={cn(
					'mt-2 font-body text-xs leading-tight min-h-[1.2em]',
					showError ? 'text-signal-danger' : 'text-transparent',
				)}
			>
				{showError ? error : '·'}
			</p>
		</div>
	);
};
