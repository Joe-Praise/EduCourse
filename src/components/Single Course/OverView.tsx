import { useEffect, useState } from 'react';

const OverView = (props: any) => {
	const { description } = props;
	const [curatedText, setCuratedText] = useState<string[]>([]);

	// const value =
	// 	'Lorem ipsum dolor, sit amet consectetur adipisicing elit./n Odit libero facere labore voluptatibus enim hic corrupti esse, eius dolore tempore eveniet quae, accusantium dolorum dicta velit?/n At qui, necessitatibus asperiores provident voluptatum sed aliquid et deserunt, nesciunt voluptas adipisci eos suscipit assumenda./n Adipisci aspernatur esse labore dignissimos quibusdam recusandae modi.';

	const formatText = (value: string) => {
		let check = '/n';
		if (check.length >= value.length) {
			return '';
		}

		let newString = [];
		let accumulatedStr = '';
		let skipIndex = [];

		for (let i = 0; i < value.length; i++) {
			// if current str and next str is /n
			if (value[i] + value[i + 1] === check) {
				// push existing string to newString as one paragraph
				newString.push(accumulatedStr);

				// check if index has passed last index of the last /n(new line) encountered
				if (i > skipIndex[0] || i > skipIndex[1]) {
					// if true, reset the variable
					skipIndex = [];
				}

				// push the index of / & n to array
				skipIndex.push(i);
				skipIndex.push(i + 1);

				// clear the existing paragraph accumulator
				accumulatedStr = '';
			}

			// if index gets to the /n index, skip them and dont add /n to the string accumulated str
			if (i === skipIndex[0] || i === skipIndex[1]) {
				continue;
			}

			// accumulate str that comes before /n(new line)
			accumulatedStr += value[i];
		}

		// if any string still exists in the accumulated str add it to arr
		if (accumulatedStr.length) {
			newString.push(accumulatedStr);
		}

		// set arr to description state.
		setCuratedText(newString);
	};

	useEffect(() => {
		formatText(description);
	}, [description]);

	return (
		<div className='p-2'>
			{curatedText.map((el, index) => (
				<p key={index} className='mt-3'>
					{el}
				</p>
			))}
		</div>
	);
};

export default OverView;
