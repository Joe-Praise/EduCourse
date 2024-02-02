import { FC } from 'react';
import { NotFoundPage } from '../../assets/Svg';
import Button from '../../components/shared/Button';

const NotFound: FC = () => {
	return (
		<section className='overflow-hidden flex justify-between flex-wrap items-center'>
			<div className='flex justify-center  basis-full py-5 h-[23rem] items-center lg:basis-1/2 lg:h-screen'>
				<div className='text-center'>
					<p className='text-[3rem] md:text-[4rem] font-bold text-NotFound'>
						Opppssss...
					</p>

					<p className='text-[3rem] md:text-[4rem] font-bold text-NotFound'>
						Page Not Found!
					</p>

					<div className='mt-8'>
						<Button
							href='/'
							className='border border-NotFound rounded-sm px-5 py-3 '
						>
							Home
						</Button>
					</div>
				</div>
			</div>
			<NotFoundPage className='w-screen lg:w-1/2 lg:h-[100vh]' />
		</section>
	);
};

export default NotFound;
