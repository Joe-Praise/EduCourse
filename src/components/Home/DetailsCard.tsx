import { FC } from 'react';
import WhiteBackground from '../shared/WhiteBackground';
import { detailCardType } from '../../pages/Home/types/homePageType';

const DetailsCard: FC<detailCardType> = (props) => {
	const extension = (role: string, total: string): string => {
		let digit = '';
		switch (role) {
			case 'students':
			case 'courses':
			case 'instructor':
				digit = +total > 1000 ? total.slice(0, 2) + 'K+' : total;
				if (+total > 1_000_000) {
					digit = total.slice(-0, -6) + 'M+';
				}
				return digit;
			case 'satisfaction':
				digit = total + '%';
				return digit;
		}

		return digit;
	};
	return (
		<WhiteBackground className='my-2 sm:my-0 h-[8rem] sm:h-[7rem] w-full px-0 shadow-lg hover:scale-105 duration-150 rounded-lg'>
			<div className='hover:text-effect-active flex flex-col items-center justify-center h-full'>
				<p className='text-3xl text-[#EF6024]'>
					{extension(props.role, props.total)}
				</p>
				<p className='text-sm my-1 font-bold'>{props.title}</p>
			</div>
		</WhiteBackground>
	);
};

export default DetailsCard;
