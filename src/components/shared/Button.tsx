import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
// import { BiLoaderCircle } from 'react-icons/bi';
import { TbLoader3 } from 'react-icons/tb';

interface IProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'> {
	value?: string;
	isLoading?: boolean;
	href?: string;
	type?: 'button' | 'submit' | 'reset' | undefined;
	variant?: 'outline' | 'contained' | 'text';
	color?: 'dark' | 'grey' | 'orange' | 'red' | 'transparent';
	children?: ReactNode;
	size?: string;
}

const Button = (props: IProps) => {
	const {
		value,
		className,
		isLoading,
		href,
		onClick,
		variant = 'contained',
		size,
		children,
		color,
		...restProps
	} = props;

	if (href) {
		return (
			<Link
				to={href}
				className={` w-100 ${variant} ${size} ${color} ${className}`}
			>
				{value || children}
			</Link>
		);
	}

	const spinner = (
		<div className='flex justify-center items-center absolute w-full'>
			{/* <div className='animate-spin h-5 w-5 mr-3' role='status'> */}
			<TbLoader3 className='animate-spin h-7 w-7' role='status'>
				<span className='sr-only'>Loading...</span>
			</TbLoader3>
			{/* </div> */}
		</div>
	);

	if (isLoading) {
		return (
			<button
				disabled={isLoading}
				type='submit'
				className={`w-100 relative ${variant} ${size} ${color || ''} ${
					className || ''
				}`}
				{...restProps}
			>
				{spinner}
				<span className='invisible'>{value || children}</span>
			</button>
		);
	}

	return (
		<button
			type={onClick ? 'button' : 'submit'}
			onClick={onClick}
			className={`w-100 ${variant} ${size} ${color} ${className}`}
			{...restProps}
		>
			{value || children}
		</button>
	);
};

export default Button;

// .app__submit__button {
// 	background-color: var(--brand);
// 	box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
// 	border-radius: 4px;
// 	color: var(--btn-lgt);
// 	height: 56px;
// 	font-family: 'Rubik', sans-serif;
//   }

// const Button: FC<{ className: string; value: string; onClick: () => void }> = (
// 	props
// ) => {
// 	return (
// 		<button className={` ${props.className}`} onClick={props.onClick}>
// 			{props.value}
// 		</button>
// 	);
// };

// export default Button;
