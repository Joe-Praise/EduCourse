import { FC } from 'react';
import { Link } from 'react-router-dom';

interface linkBtnType {
	className: string;
	value: string;
	path: string;
}
const LinkBtn: FC<linkBtnType> = ({ className, value, path }) => {
	return (
		<Link to={path} className={`p-2 rounded-2xl border ${className}`}>
			{value}
		</Link>
	);
};

export default LinkBtn;
