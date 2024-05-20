import { ReactNode } from 'react';

interface IProps {
	children: ReactNode;
	formDiv: string;
	imgDiv: string;
	img: string;
}

const FormLayout = (props: IProps) => {
	const { children, formDiv, imgDiv, img } = props;
	return (
		<section className='flex w-full h-full gap-[0] m-0 '>
			<div className={`flex-1 flex justify-center items-center ${formDiv}`}>
				{children}
			</div>
			<figure
				className={`bg-black md:w-1/2 lg:basis-[45%] hidden md:block ${imgDiv}`}
			>
				<img
					src={img}
					alt='Signin banner picture'
					className='hidden md:block h-screen w-screen object'
				/>
			</figure>
		</section>
	);
};

export default FormLayout;
