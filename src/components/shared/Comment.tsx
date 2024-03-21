import React, { useRef } from 'react';
import { Button } from './';

type func = {
	onCommentvalue: (_: string) => void;
};
const Comment = (props: func) => {
	const { onCommentvalue } = props;

	const commentRef = useRef<HTMLTextAreaElement>(null);

	const handleComment = (event: React.FormEvent) => {
		event.preventDefault();
		const commentValue = commentRef.current!.value;
		if (commentValue?.trim().length === 0) {
			// TODO:throw err with toast
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
				<Button className={'btnStyle my-3'} value={'Post Comment'} />
			</form>
		</div>
	);
};

export default Comment;
