export default function useFormatText() {
	const formatText = (value: string): string[] => {
		let check = '\n';
		if (check.length >= value.length) {
			return [''];
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
		return newString;
	};

	return { formatText };
}
