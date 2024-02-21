import useFormatText from '../../hooks/UseFormatText';

interface Iprop {
	description: string;
}

const OverView = (props: Iprop) => {
	const { description } = props;
	const { formatText } = useFormatText();

	// const value =
	// 	'Lorem ipsum dolor, sit amet consectetur adipisicing elit./n Odit libero facere labore voluptatibus enim hic corrupti esse, eius dolore tempore eveniet quae, accusantium dolorum dicta velit?/n At qui, necessitatibus asperiores provident voluptatum sed aliquid et deserunt, nesciunt voluptas adipisci eos suscipit assumenda./n Adipisci aspernatur esse labore dignissimos quibusdam recusandae modi.';

	return (
		<div className='p-2'>
			{formatText(description)?.map((el, index) => (
				<p key={index} className='mt-3'>
					{el}
				</p>
			))}
		</div>
	);
};

export default OverView;
