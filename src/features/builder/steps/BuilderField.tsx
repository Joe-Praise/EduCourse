import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '../../../lib/cn';

interface BaseFieldProps {
	label: string;
	hint?: string;
	error?: string;
	required?: boolean;
	className?: string;
}

const labelClass = 'block font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary mb-2';
const hintClass = 'mt-1.5 font-body text-xs text-ink-tertiary';
const errorClass = 'mt-1.5 font-body text-xs text-signal-danger';

const inputBase =
	'w-full bg-bg-raised border border-line-base focus:border-line-strong text-ink-primary placeholder:text-ink-tertiary font-body outline-none focus:shadow-focus-ring rounded-card transition-[border-color,box-shadow] duration-base';

interface TextFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
	display?: boolean;
}

export const TextField = ({ label, hint, error, required, className, display, ...rest }: TextFieldProps) => (
	<div className={className}>
		<label className={labelClass}>
			{label}
			{required && <span className='ml-1 text-clay-400'>*</span>}
		</label>
		<input
			{...rest}
			className={cn(
				inputBase,
				display ? 'h-auto py-3 px-5 text-2xl font-display font-semibold tracking-[-0.02em]' : 'h-11 px-4 text-sm',
			)}
		/>
		{error ? <p className={errorClass}>{error}</p> : hint ? <p className={hintClass}>{hint}</p> : null}
	</div>
);

interface TextAreaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {}

export const TextAreaField = ({ label, hint, error, required, className, rows = 4, ...rest }: TextAreaFieldProps) => (
	<div className={className}>
		<label className={labelClass}>
			{label}
			{required && <span className='ml-1 text-clay-400'>*</span>}
		</label>
		<textarea {...rest} rows={rows} className={cn(inputBase, 'py-3 px-4 text-sm leading-[1.55] resize-none')} />
		{error ? <p className={errorClass}>{error}</p> : hint ? <p className={hintClass}>{hint}</p> : null}
	</div>
);

interface SelectFieldProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
	options: ReadonlyArray<{ value: string; label: string }>;
}

export const SelectField = ({ label, hint, error, required, className, options, ...rest }: SelectFieldProps) => (
	<div className={className}>
		<label className={labelClass}>
			{label}
			{required && <span className='ml-1 text-clay-400'>*</span>}
		</label>
		<select {...rest} className={cn(inputBase, 'h-11 px-4 text-sm appearance-none')}>
			{options.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</select>
		{error ? <p className={errorClass}>{error}</p> : hint ? <p className={hintClass}>{hint}</p> : null}
	</div>
);
