import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
			<TbLoader3 className='animate-spin h-7 w-7' role='status'>
				<span className='sr-only'>Loading...</span>
			</TbLoader3>
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
