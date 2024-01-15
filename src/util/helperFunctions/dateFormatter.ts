export const handleDateFormat = (string: string): string => {
	return new Date(string).toLocaleDateString();
};
