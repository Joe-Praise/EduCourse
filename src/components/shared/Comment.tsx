import React, { useRef, useState } from 'react';

type func = {
	onCommentvalue: (_: string) => void;
};

const Comment = (props: func) => {
	const { onCommentvalue } = props;
	const commentRef = useRef<HTMLTextAreaElement>(null);
	const [value, setValue] = useState('');

	const handleComment = (event: React.FormEvent) => {
		event.preventDefault();
		const commentValue = commentRef.current!.value;
		if (commentValue?.trim().length === 0) return;
		onCommentvalue(commentValue);
		commentRef.current!.value = '';
		setValue('');
	};

	return (
		<section>
			<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400 block mb-3'>
				Add your voice
			</span>
			<h3
				className='font-display font-semibold text-ink-primary leading-tight mb-5'
				style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', fontVariationSettings: '"opsz" 72' }}
			>
				Leave a comment
			</h3>
			<form onSubmit={handleComment} className='flex flex-col gap-4'>
				<textarea
					name='comment'
					id='comment'
					ref={commentRef}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder='Share your thoughts…'
					className='w-full min-h-[140px] bg-bg-raised/60 border border-line-base rounded-card p-4 font-body text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-clay-500 transition-colors resize-y leading-[1.6]'
				/>
				<div className='flex items-center justify-between gap-3'>
					<p className='font-body text-2xs text-ink-tertiary'>
						Be kind. Be specific. No drive-bys.
					</p>
					<button
						type='submit'
						disabled={value.trim().length === 0}
						className='inline-flex items-center h-11 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 disabled:opacity-40 disabled:cursor-not-allowed text-ink-primary font-body font-medium text-sm transition-colors'
					>
						Post comment
					</button>
				</div>
			</form>
		</section>
	);
};

export default Comment;
