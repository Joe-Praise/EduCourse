/**
 * Shared types for the Course Builder wizard.
 * Kept loose by design — the live API will determine final shapes.
 */

export type CourseLevel = 'all-levels' | 'beginner' | 'intermediate' | 'advanced';

export interface BuilderModule {
	id: string;
	title: string;
	lessons: BuilderLesson[];
}

export interface BuilderLesson {
	id: string;
	title: string;
	url?: string;
	duration?: string;
	freePreview?: boolean;
}

export interface CourseDraft {
	// Step 1 — Basics
	title: string;
	slug: string;
	categoryId: string;
	level: CourseLevel;
	language: string;

	// Step 2 — Outcomes
	outcomes: string[];
	prerequisites: string;
	targetAudience: string;

	// Step 3 — Curriculum
	modules: BuilderModule[];

	// Step 4 — Pricing
	pricingType: 'free' | 'paid';
	currency: string;
	price: number;
	discountPrice: number | null;
	discountValidUntil: string | null;

	// Step 5 — Cover
	coverImage: string | null;
	promoVideoUrl: string;
	shortDescription: string;
	longDescription: string;
}

export const EMPTY_DRAFT: CourseDraft = {
	title: '',
	slug: '',
	categoryId: '',
	level: 'all-levels',
	language: 'English',
	outcomes: [''],
	prerequisites: '',
	targetAudience: '',
	modules: [],
	pricingType: 'free',
	currency: 'USD',
	price: 0,
	discountPrice: null,
	discountValidUntil: null,
	coverImage: null,
	promoVideoUrl: '',
	shortDescription: '',
	longDescription: '',
};

export type StepKey =
	| 'basics'
	| 'outcomes'
	| 'curriculum'
	| 'pricing'
	| 'cover'
	| 'review';

export interface BuilderStep {
	key: StepKey;
	number: string;
	label: string;
	description: string;
}

export const BUILDER_STEPS: ReadonlyArray<BuilderStep> = [
	{ key: 'basics', number: '01', label: 'The basics', description: 'Title, category, level' },
	{ key: 'outcomes', number: '02', label: 'Outcomes', description: 'What students will learn' },
	{ key: 'curriculum', number: '03', label: 'Curriculum', description: 'Modules and lessons' },
	{ key: 'pricing', number: '04', label: 'Pricing', description: 'Free, paid, discount' },
	{ key: 'cover', number: '05', label: 'Cover & marketing', description: 'Image, descriptions' },
	{ key: 'review', number: '06', label: 'Review & publish', description: 'Final checks' },
];

export const slugify = (s: string): string =>
	s
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);
