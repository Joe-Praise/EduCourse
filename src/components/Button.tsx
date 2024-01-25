import { FC } from 'react';

const Button: FC<{ className: string; value: string; onClick: () => void }> = (
	props
) => {
	return (
		<button className={` ${props.className}`} onClick={props.onClick}>
			{props.value}
		</button>
	);
};

export default Button;
