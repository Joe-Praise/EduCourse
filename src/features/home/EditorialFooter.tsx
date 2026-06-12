import { Link } from 'react-router-dom';

interface FooterColumn {
	heading: string;
	links: ReadonlyArray<{ label: string; href: string }>;
}

const COLS: ReadonlyArray<FooterColumn> = [
	{
		heading: 'Learn',
		links: [
			{ label: 'Courses', href: '/courses' },
			{ label: 'Instructors', href: '/instructors' },
			{ label: 'Categories', href: '/courses' },
			{ label: 'Pricing', href: '/courses' },
		],
	},
	{
		heading: 'Create',
		links: [
			{ label: 'Become an instructor', href: '/instructor/dashboard' },
			{ label: 'Course Builder', href: '/instructor/courses/new' },
			{ label: 'Creator stories', href: '/blogs' },
			{ label: 'Payout', href: '/instructor/dashboard' },
		],
	},
	{
		heading: 'Company',
		links: [
			{ label: 'About', href: '/' },
			{ label: 'Journal', href: '/blogs' },
			{ label: 'Press', href: '/' },
			{ label: 'Careers', href: '/' },
		],
	},
	{
		heading: 'Support',
		links: [
			{ label: 'Help center', href: '/faqs' },
			{ label: 'Community', href: '/' },
			{ label: 'Contact', href: '/' },
			{ label: 'Status', href: '/' },
		],
	},
];

export const EditorialFooter = () => (
	<footer className='border-t border-line-subtle bg-bg-base'>
		<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-20 sm:py-24'>
			<div className='grid grid-cols-1 lg:grid-cols-[1.4fr_3fr] gap-12 lg:gap-16'>
				<div>
					<Link
						to='/'
						className='inline-block font-display italic font-semibold text-ink-primary'
						style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontVariationSettings: '"opsz" 144', letterSpacing: '-0.03em' }}
					>
						EduCourse
					</Link>
					<p className='mt-4 max-w-sm font-body text-sm text-ink-tertiary leading-[1.6]'>
						A premium learning ecosystem. Built quietly, kept human.
					</p>
				</div>

				<div className='grid grid-cols-2 sm:grid-cols-4 gap-8'>
					{COLS.map((col) => (
						<div key={col.heading}>
							<h4 className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary mb-4'>
								{col.heading}
							</h4>
							<ul className='space-y-2.5'>
								{col.links.map((link) => (
									<li key={link.label}>
										<Link
											to={link.href}
											className='font-body text-sm text-ink-secondary hover:text-ink-primary transition-colors'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className='mt-16 pt-8 border-t border-line-subtle flex flex-wrap items-center justify-between gap-4'>
				<p className='font-body text-xs text-ink-tertiary'>
					© {new Date().getFullYear()} EduCourse — All work is licensed.
				</p>
				<div className='flex items-center gap-6 text-xs text-ink-tertiary'>
					<Link to='/' className='hover:text-ink-secondary transition-colors'>Privacy</Link>
					<Link to='/' className='hover:text-ink-secondary transition-colors'>Terms</Link>
					<Link to='/' className='hover:text-ink-secondary transition-colors'>Cookies</Link>
				</div>
			</div>
		</div>
	</footer>
);
