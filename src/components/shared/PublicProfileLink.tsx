import { ReactNode } from 'react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { getPublicProfileAction } from '../../redux/actions/publicProfileAction';

interface publicProfileType {
	children: ReactNode;
	userId: string;
}

const PublicProfileLink = (props: publicProfileType) => {
	const { children, userId } = props;
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	const linkToPublicProfile = (id: string) => {
		dispatch(getPublicProfileAction(id, navigate));
	};

	return (
		<Button type='button' onClick={() => linkToPublicProfile(userId)}>
			{children}
		</Button>
	);
};

export default PublicProfileLink;
