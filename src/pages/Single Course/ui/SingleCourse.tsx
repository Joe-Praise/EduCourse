import Comment from '../../../components/Comment';
import Curriculum from '../../../components/Single Course/Curriculum';
import HeaderContainer from '../../../components/Single Course/HeaderContainer';
import Instructor from '../../../components/Single Course/Instructor';
import OverView from '../../../components/Single Course/OverView';
import Reviews from '../../../components/Single Course/Reviews';
import TabContainer from '../../../components/Single Course/TabContainer';

const SingleCourse = () => {
	const handleCourseComment = (commentText: string): void => {
		console.log(commentText);
	};

	return (
		<section>
			<HeaderContainer />
			<TabContainer
				children1={<OverView />}
				children2={<Curriculum />}
				children3={<Instructor />}
				children4={<Reviews />}
			/>
			<Comment onCommentvalue={handleCourseComment} />
		</section>
	);
};

export default SingleCourse;
