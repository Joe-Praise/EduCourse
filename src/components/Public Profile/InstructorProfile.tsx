import config from '../../../config';
import { publicProfileType } from '../../redux/actions/publicProfileAction';
import { UserCoursesSection } from '../My Learning';

interface Iprop {
	profileDetails: publicProfileType;
}
const InstructorProfile = (props: Iprop) => {
	const { courses, user }: any = props.profileDetails;
	const activeLayout = 'grid';

	return (
		<section>
			<div className='md:w-10/12 mx-auto md:flex justify-between items-center m-4 p-3'>
				<figure className='block md:w-5/12 h-full rounded-lg'>
					<img
						src={`${config.baseUrl}/img/${user?.userId?.photo}`}
						alt={`Instructor ${user?.userId?.name}'s cover image`}
						loading='lazy'
						className='w-full h-full rounded-lg'
					/>
				</figure>

				<div className='md:w-[45%] mt-9 md:mt-0'>
					<div>
						<h1>{user?.userId?.name}</h1>
						<span className='text-xs'>/{user?.expertise}</span>
					</div>

					<div className='my-5'>
						<p>{user?.description}</p>
					</div>

					<div className='my-5'>
						<h1>Contact</h1>

						<div className='flex my-2'>
							<p>Email:</p>
							<p className='font-medium'>{user?.userId.email}</p>
						</div>
					</div>
				</div>
			</div>
			<div className='w-10/12 mx-auto mt-8 md:mt-20'>
				<h1 className='text-center underline underline-offset-2'>Lectures</h1>
				<UserCoursesSection activeLayout={activeLayout} data={courses} />
			</div>
		</section>
	);
};

export default InstructorProfile;
