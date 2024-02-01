import { FC } from 'react';
import Comment from '../../components/shared/Comment';
import Curriculum from '../../components/Single Course/Curriculum';
import HeaderContainer from '../../components/Single Course/HeaderContainer';
import Instructor from '../../components/Single Course/Instructor';
import OverView from '../../components/Single Course/OverView';
import Reviews from '../../components/Single Course/Reviews';
import TabContainer from '../../components/Single Course/TabContainer';

const SingleCourse: FC = () => {
	const handleCourseComment = (commentText: string): void => {
		console.log(commentText);
	};

	return (
		<section>
			<HeaderContainer />
			<div className='layoutWidth flex mt-9'>
				<div className='mx-auto md:mx-0 basis-2/3'>
					<TabContainer
						children1={<OverView />}
						children2={<Curriculum />}
						children3={<Instructor />}
						children4={<Reviews />}
					/>
					<div className='mt-4'>
						<Comment onCommentvalue={handleCourseComment} />
					</div>
				</div>
				{/* <div></div> */}
			</div>
		</section>
	);
};

export default SingleCourse;
