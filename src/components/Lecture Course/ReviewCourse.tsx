import { useEffect, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import Button from '../shared/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/reducers';
import { getLocalStorage } from '../../util/helperFunctions/helper';
import { createCourseReviewAction } from '../../redux/actions/reviewAction';

const arr = [1, 2, 3, 4, 5];
const ReviewCourse = () => {
	const dispatch: AppDispatch = useDispatch();
	const lectureCourse = useSelector(
		(state: RootState) => state.course?.lectureCourse?.course?._id
	);
	const reviewTextRef = useRef<HTMLTextAreaElement>(null);
	const [activeRating, setActiveRating] = useState(3);
	const [loading, setLodaing] = useState(false);
	const [regards, setRegards] = useState(false);
	const user = getLocalStorage('profile')?.user?.name;

	/**
	 *
	 * @param rate the selected rating
	 * @returns sets the active rating, if already selected it sets it to default
	 */

	const handleRating = (rate: number) => {
		if (activeRating === rate) {
			return setActiveRating(0);
		}
		setActiveRating(rate);
	};

	const handleCreateReview = async () => {
		setLodaing(true);
		const details = {
			rating: activeRating + '',
			review: reviewTextRef.current!.value,
		};
		dispatch(createCourseReviewAction(details, lectureCourse));
		setLodaing(false);
		setTimeout(() => {
			setRegards(true);
		}, 1500);
	};

	const handleDisplayRegards = () => {
		return (
			<div
				className={`${
					regards ? 'top-0' : 'top-[200%]'
				} h-full w-full inset-0 bg-black text-white flex flex-col justify-around items-center absolute left-0 right-0 transition-all duration-500 `}
			>
				<div className=''>
					<h1>THANK YOU!</h1>
					<p className='dashP'>Your feedback was helpful, {user}.</p>
				</div>
			</div>
		);
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			setRegards(false);
		}, 2500);

		return () => clearTimeout(timeout);
	}, [regards]);

	return (
		<div className='relative'>
			<div className='text-center'>
				<h1>What Will You Rate This Course?</h1>
				<h3>Leave your rating</h3>
				<div className='flex items-center justify-center gap-[2px] mt-3 cursor-pointer'>
					{arr.map((rate, idx) => {
						return (
							<FaStar
								key={idx}
								className={`${
									rate <= activeRating ? 'fill-orange-400' : ''
								} h-10 w-10`}
								onClick={() => handleRating(rate)}
								onMouseEnter={() => setActiveRating(rate)}
							/>
						);
					})}
				</div>
			</div>
			<div className='p-5'>
				<textarea
					className='bg-slate-200 w-full h-[40vh] p-5 outline-none rounded-md resize-none'
					name='review'
					ref={reviewTextRef}
					placeholder='Write a comment'
				></textarea>
			</div>
			<div>
				<Button
					value='Submit'
					className='border p-2 border-color rounded-md bg-primary-color hover:bg-effect-hover active:bg-effect-active text-white transition-all outline-none'
					size='w-full h-14'
					onClick={() => handleCreateReview()}
					isLoading={loading}
				/>
			</div>
			{handleDisplayRegards()}
		</div>
	);
};

export default ReviewCourse;
