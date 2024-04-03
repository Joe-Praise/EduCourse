import { FC } from 'react';
import { FaqAccordion } from '../../components/Faq';

interface Iprop {
	question: string;
	answer: string;
}
const FrequentlyAsked: FC<{}> = () => {
	const faq: Iprop[] = [
		{
			question: 'How do I sign up for an account?',
			answer:
				'To create an account on our platform, simply click on the "Sign Up" button located at the top right corner of the homepage. You will be prompted to provide your email address and create a password. Once you have filled out the required information, click on the "Sign Up" button, and your account will be created.',
		},
		{
			question: 'How do I enroll in a course?',
			answer:
				'To enroll in a course, browse through our catalog of courses and select the one you\'re interested in. Click on the course title to view more details. If you decide to enroll, click on the "Enroll Now" button, and you will be directed to the payment page. Complete the payment process, and you will gain access to the course materials.',
		},
		{
			question: 'What payment methods do you accept?',
			answer:
				'We accept major credit cards, including Visa, Mastercard, American Express, and Discover. Additionally, we also support payments through PayPal for added convenience.',
		},
		{
			question: 'Can I access my courses on multiple devices?',
			answer:
				'Yes, you can access your courses on multiple devices, including desktop computers, laptops, tablets, and smartphones. Simply log in to your account from any device with an internet connection, and you will have access to your enrolled courses.',
		},
		{
			question: 'Are there any prerequisites for taking courses?',
			answer:
				'Prerequisites vary depending on the course. Some courses may have specific requirements or recommended knowledge levels listed in the course description. Make sure to review the course details before enrolling to ensure you meet any prerequisites.',
		},
		{
			question: 'How long do I have access to a course after enrolling?',
			answer:
				'Once you enroll in a course, you will have unlimited access to the course materials for as long as the course is available on our platform. You can learn at your own pace and revisit the content as often as you like.',
		},
		{
			question: 'Do you offer certificates upon course completion?',
			answer:
				"Yes, we offer certificates of completion for many of our courses. Upon finishing a course, you will be able to download or print a certificate to showcase your achievement. Certificates are provided for both free and paid courses, depending on the course's settings.",
		},
		{
			question: 'What if I have technical issues or need support?',
			answer:
				'If you encounter any technical issues or need assistance, our support team is here to help. You can reach out to us through our contact page or email us directly at support@example.com. We strive to respond to all inquiries promptly and provide solutions to any problems you may encounter.',
		},
	];

	return (
		<section className='flex justify-center items flex-col md:min-h-[75vh] my-[2rem] md:w-8/12 mx-auto'>
			<div className=''>
				<div>
					<h1>FAQ</h1>
					<p className='w-full md:w-90'>
						Here are some frequently asked questions on the platform
					</p>
				</div>
			</div>

			<div className='flex justify-between flex-wrap my-4'>
				<div className='basis-[48%]'>
					{faq.map((el, index) => {
						if (index <= 3) {
							return (
								<div key={index} className='my-3'>
									<FaqAccordion
										// key={index}
										question={el.question}
										answer={el.answer}
									/>
								</div>
							);
						}
					})}
				</div>
				<div className='basis-[48%]'>
					{faq.map((el, index) => {
						if (index > 3) {
							return (
								<div key={index} className='my-3'>
									<FaqAccordion
										// key={index}
										question={el.question}
										answer={el.answer}
									/>
								</div>
							);
						}
					})}
				</div>
			</div>
			{/* <div className={`grid my-3 ${props.className}`}>{props.children}</div> */}
		</section>
	);
};

export default FrequentlyAsked;
