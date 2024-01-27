import React, { useState } from 'react';
import RenderIf from '../shared/RenderIf';
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
			<div className='flex flex-col gap-1'>
				<RenderIf condition={!!label}>
					<label htmlFor={id} className='font-medium text-sm flex'>
						<>{label}</>
						<RenderIf condition={restProps.requiredfield === 'true'}>
							<LuAsterisk className='text-red-600' />
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
							hasError ? 'border border-[#dc3545]' : 'border-gray-300  '
						} border rounded w-full h-11 p-2 outline-none focus:border-primary-color text-sm`}
					/>

					{restProps.type === 'password' && (
						<span
							onClick={() => setShow((prev) => !prev)}
							className='cursor-pointer absolute right-3 top-1/2 bottom-0 m-auto -translate-y-1/2'
						>
							{show ? <Eye /> : <EyeOff />}
						</span>
					)}
				</div>
			</div>
			<RenderIf condition={hasError}>
				<div>
					<p className='text-xs text-[#dc3545]'>{errors[name]}</p>
				</div>
			</RenderIf>
		</div>
	);
};

export default InputField;

// style for select

// ${
//     restProps.type === 'select'
//         ? 'border border-[rgba(0,0,0,0.2)] rounded font-semibold text-xs text-[#4a4a4a]'
//         : ''
// }
