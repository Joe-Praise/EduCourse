import { useSelector } from 'react-redux';
import { UserCoursesSection } from '../My Learning';
import { RootState } from '../../redux/reducers';
import config from '../../../config';

const UserProfile = () => {
	const userInfo = useSelector(
		(state: RootState) => state.publicProfile
	).publicProfile;
	console.log('user profile', userInfo.user.userId.photo);
	return (
		<section>
			<div className='h-16 w-full flex items-center bg-black'>
				<h1 className='md:w-9/12 mx-auto text-white'>{userInfo?.user?.name}</h1>
			</div>

			<div className='w-[90%] sm:w-[75%] mx-auto'>
				<div className='m-4'>
					<figure className='w-24 h-24 block'>
						<img
							src={`${config?.baseUrl}/img/${userInfo?.user?.userId?.photo}`}
							alt={`${userInfo?.user?.name}'s display image`}
							className='rounded-full'
						/>
					</figure>
				</div>
				<div>
					<p className='text-center underline underline-offset-2'>Courses</p>
					<UserCoursesSection activeLayout='grid' data={userInfo?.courses} />
				</div>
			</div>
		</section>
	);
};

export default UserProfile;
