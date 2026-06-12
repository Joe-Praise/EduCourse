import React, { useState } from 'react';
import { RenderIf } from './';
import Eye from '../svg/eye';
import EyeOff from '../svg/eye-off';
import { LuAsterisk } from 'react-icons/lu';

interface IProps extends React.HTMLProps<HTMLInputElement> {
	type?: React.HTMLInputTypeAttribute;
	errors?: any;
	touched?: any;
	className?: string;
	requiredfield?: string;
}

const InputField = (props: IProps) => {
	const {
		name = 'name',
		id,
		errors = {},
		touched = {},
		className,
		label,
		...restProps
	} = props;

	const hasError = (errors[name] && touched[name]) || false;

	const [show, setShow] = useState(false);

	return (
		<div className={`${className || 'my-2'}`}>
			<div className='flex flex-col gap-1.5'>
				<RenderIf condition={!!label}>
					<label htmlFor={id} className='font-body font-medium text-sm flex items-center gap-0.5 text-ink-secondary'>
						<>{label}</>
						<RenderIf condition={restProps.requiredfield === 'true'}>
							<LuAsterisk className='text-signal-danger w-3 h-3' />
						</RenderIf>
					</label>
				</RenderIf>

				<div className='relative'>
					<input
						{...{
							...restProps,
							type: show ? 'text' : restProps.type,
							id,
							name,
						}}
						className={`${
							hasError ? 'border-signal-danger/60' : 'border-line-base'
						} border rounded-card w-full h-11 px-3.5 py-2 outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 font-body text-sm bg-bg-overlay/40 text-ink-primary placeholder-ink-tertiary transition-colors`}
					/>

					{restProps.type === 'password' && (
						<span
							onClick={() => setShow((prev) => !prev)}
							className='cursor-pointer absolute right-3 top-1/2 m-auto -translate-y-1/2 text-ink-tertiary hover:text-ink-primary transition-colors'
						>
							{show ? <Eye /> : <EyeOff />}
						</span>
					)}
				</div>
			</div>
			<RenderIf condition={hasError}>
				<div>
					<p className='font-body text-xs text-signal-danger mt-1.5'>{errors[name]}</p>
				</div>
			</RenderIf>
		</div>
	);
};

export default InputField;
