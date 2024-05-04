import { UserCoursesSection } from '../My Learning';
import config from '../../../config';
// import { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../redux/store';
// import { useParams } from 'react-router-dom';
// import { getPublicProfileAction } from '../../redux/actions/publicProfileAction';

interface Iprop {
	// figure out why the below line is giving type error
	// profileDetails: publicProfileType;

	profileDetails: any;
}

const UserProfile = (props: Iprop) => {
	const { courses, user } = props.profileDetails;

	return (
		<section>
			<div className='h-24 w-full flex items-center bg-black'>
				<h1 className='md:w-9/12 text-2xl mx-auto text-white'>{user?.name}</h1>
			</div>

			<div className='w-[90%] sm:w-[75%] mx-auto'>
				<div className='m-4'>
					<figure className='w-24 h-24 block'>
						<img
							src={`${config?.baseUrl}/img/${user?.photo}`}
							alt={`${user?.name}'s display image`}
							className='rounded-full'
						/>
					</figure>
				</div>
				<div>
					<p className='text-center underline underline-offset-2 cursor-pointer'>
						Learning
					</p>
					<UserCoursesSection activeLayout='grid' data={courses} />
				</div>
			</div>
		</section>
	);
};

export default UserProfile;

// const UserProfile = (props: Iprop) => {
// 	const { courses, user } = props.profileDetails;

// 	const publicProfile = useSelector(
// 		(state: RootState) => state.publicProfile.publicProfile
// 	);
// 	const { slug } = useParams<{ slug: string }>();
// 	const slugString: string = slug || '';
// 	const dispatch: AppDispatch = useDispatch();

// 	const initializeRef = useRef(true);

// 	useEffect(() => {
// 		// if (initializeRef.current) {
// 		// 	initializeRef.current = false;
// 		// 	return;
// 		// }

// 		dispatch(getPublicProfileAction(slugString, null));
// 	}, [dispatch, slugString]);
// 	console.log('public profile', publicProfile);
// 	return (
// 		<section>
// 			<div className='h-16 w-full flex items-center bg-black'>
// 				<h1 className='md:w-9/12 mx-auto text-white'>{user?.name}</h1>
// 			</div>

// 			<div className='w-[90%] sm:w-[75%] mx-auto'>
// 				<div className='m-4'>
// 					<figure className='w-24 h-24 block'>
// 						<img
// 							src={`${config?.baseUrl}/img/${user?.photo}`}
// 							alt={`${user?.name}'s display image`}
// 							className='rounded-full'
// 						/>
// 					</figure>
// 				</div>
// 				<div>
// 					<p className='text-center underline underline-offset-2'>Courses</p>
// 					<UserCoursesSection
// 						activeLayout='grid'
// 						data={publicProfile?.courses}
// 					/>
// 				</div>
// 			</div>
// 		</section>
// 	);
// };

// export default UserProfile;
