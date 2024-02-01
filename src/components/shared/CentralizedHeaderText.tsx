import { FC } from 'react';
import WhiteBackground from './WhiteBackground';
import { bannerTextType } from '../../pages/Home/homePageType';
import LinkBtn from './LinkBtn';

const CentralizedHeaderText: FC<bannerTextType> = ({ title, body }) => {
	return (
		<div className='w-[85%] sm:w-[55%] lg:w-[40%] absolute top-28 left-8'>
			<WhiteBackground className='p-5'>
				<div className='  text-left'>
					<h1 className='bg-w text-secondary-dark pt-5 leading-8 tracking-wide text-2xl'>
						{title}
					</h1>
					<p className='text-left text-secondary-dark py-8'>{body}</p>

					<LinkBtn
						className='hover:text-effect-hover hover:border-effect-hover'
						value='Explore Courses'
						path='/courses'
					/>
				</div>
			</WhiteBackground>
		</div>
	);
};
export default CentralizedHeaderText;
