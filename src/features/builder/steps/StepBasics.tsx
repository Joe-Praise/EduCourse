import { useEffect } from 'react';
import { TextField, SelectField } from './BuilderField';
import { slugify, type CourseDraft, type CourseLevel } from '../types';

interface StepBasicsProps {
	draft: CourseDraft;
	update: <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => void;
}

const LEVEL_OPTIONS: ReadonlyArray<{ value: CourseLevel; label: string }> = [
	{ value: 'all-levels', label: 'All levels' },
	{ value: 'beginner', label: 'Beginner' },
	{ value: 'intermediate', label: 'Intermediate' },
	{ value: 'advanced', label: 'Advanced' },
];

const LANGUAGE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
	{ value: 'English', label: 'English' },
	{ value: 'Spanish', label: 'Spanish' },
	{ value: 'French', label: 'French' },
	{ value: 'German', label: 'German' },
	{ value: 'Portuguese', label: 'Portuguese' },
	{ value: 'Other', label: 'Other' },
];

export const StepBasics = ({ draft, update }: StepBasicsProps) => {
	// Auto-generate slug from title until the user manually edits it
	useEffect(() => {
		if (!draft.slug || draft.slug === slugify(draft.title.slice(0, draft.slug.length).replace(/-/g, ' '))) {
			update('slug', slugify(draft.title));
		}
	}, [draft.title]);

	return (
		<div className='space-y-8 max-w-2xl'>
			<TextField
				label='Course title'
				display
				required
				value={draft.title}
				onChange={(e) => update('title', e.target.value)}
				placeholder='What is this course called?'
				hint='Give it a real name. Skip the buzzwords.'
			/>
			<TextField
				label='URL slug'
				value={draft.slug}
				onChange={(e) => update('slug', slugify(e.target.value))}
				placeholder='auto-generated-from-title'
				hint='Used in the course URL. Lowercase, hyphens.'
			/>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
				<SelectField
					label='Difficulty level'
					options={LEVEL_OPTIONS}
					value={draft.level}
					onChange={(e) => update('level', e.target.value as CourseLevel)}
				/>
				<SelectField
					label='Language'
					options={LANGUAGE_OPTIONS}
					value={draft.language}
					onChange={(e) => update('language', e.target.value)}
				/>
			</div>
		</div>
	);
};
