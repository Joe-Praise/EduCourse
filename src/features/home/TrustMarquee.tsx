import { Marquee } from '../../patterns/Marquee/Marquee';

const PLACEHOLDER_BRANDS: ReadonlyArray<string> = [
	'ATELIER',
	'NORTH STUDIO',
	'KOAN',
	'PROCESS&CO',
	'FIELD NOTES',
	'OREM LABS',
	'TYPE FOUNDRY',
	'HARBOUR',
];

export const TrustMarquee = () => (
	<section className='py-12 sm:py-16 border-y border-line-subtle'>
		<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8'>
			<p className='mb-8 text-center font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
				Trusted by teams at
			</p>
			<Marquee speed={40}>
				<div className='flex items-center gap-16'>
					{PLACEHOLDER_BRANDS.map((b) => (
						<span
							key={b}
							className='font-display italic font-medium text-2xl text-ink-tertiary/80 hover:text-ink-secondary transition-colors duration-base'
							style={{ fontVariationSettings: '"opsz" 96' }}
						>
							{b}
						</span>
					))}
				</div>
			</Marquee>
		</div>
	</section>
);
