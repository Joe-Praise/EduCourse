import React, { FC, useRef } from 'react';
import Button from './Button';

type func = {
	onCommentvalue: (commentText: string) => void;
};
const Comment: FC<func> = ({ onCommentvalue }) => {
	const commentRef = useRef<HTMLTextAreaElement>(null);
	const handleComment = (event: React.FormEvent) => {
		event.preventDefault();
		const commentValue = commentRef.current!.value;
		if (commentValue?.trim().length === 0) {
			// throw err with toast
			return;
		}
		onCommentvalue(commentValue);
		commentRef.current!.value = '';
	};

	return (
		<div>
			<h1>Leave A Comment </h1>
			<form onSubmit={handleComment}>
				<textarea
					name='comment'
					id='comment'
					className='border w-full h-[10vh] rounded-md p-2'
					placeholder='Comment...'
					ref={commentRef}
				></textarea>
				<Button
					className={
						'border p-2 rounded-full hover:text-effect-hover hover:border-effect-hover active:bg-effect-active active:text-white'
					}
					value={'Post Comment'}
				/>
			</form>
		</div>
	);
};

export default Comment;
