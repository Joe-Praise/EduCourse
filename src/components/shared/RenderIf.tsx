import { Fragment, ReactNode } from 'react';

interface Iprops {
	children: ReactNode;
	condition: boolean;
}

const RenderIf = (props: Iprops) => {
	const { condition, children } = props;

	if (!condition) {
		return null;
	}

	return <Fragment>{children}</Fragment>;
};

export default RenderIf;
