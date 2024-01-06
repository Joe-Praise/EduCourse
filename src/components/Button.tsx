import { FC } from 'react';

const Button: FC<{ className: string; value: string }> = (props) => {
	return <button className={` ${props.className}`}>{props.value}</button>;
};

export default Button;
