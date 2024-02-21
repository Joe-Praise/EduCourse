import { FC, useCallback, useEffect, useState } from 'react';

interface Iprop {
	data: string[] | number[];
	// getData: (data: string[]) => void;
}

const Pagination: FC<Iprop> = (props) => {
	const { data } = props;
	const [pages, setPages] = useState<number[]>([]);
	const [activePage, setActivePage] = useState(0);
	const dataPerPage = 10;

	//saving the page count
	const pageCount = Math.ceil(data.length / dataPerPage);

	// this gets the total items viewed
	const itemsViewed = activePage * dataPerPage;

	// this uses the array method to limit the movie on dsiplay
	const displayData = data.slice(itemsViewed, itemsViewed + dataPerPage);
	console.log(displayData);

	const buildPages = useCallback(() => {
		let start = 0,
			end = pageCount < 5 ? pageCount : 5;

		if (activePage > 3 && activePage < pageCount - 3) {
			start = activePage - 2;
			end = activePage - 1 + 2;
		}

		if (pageCount > 5 && activePage > pageCount - 5) {
			start = pageCount - 5;
			end = pageCount - 1;
		}

		const newPages = [];
		for (let i = start; i < end; i++) {
			newPages.push(i);
		}

		setPages(newPages);
	}, [activePage, pageCount]);

	const onChange = (page: number) => setActivePage(page);

	const isActive = (page: number) => (activePage === page ? 'active' : '');

	useEffect(() => buildPages(), [activePage, buildPages]);
	return (
		<div>
			<div className='flex gap-2 justify-center mt-5'>
				{activePage >= 4 && <button onClick={() => onChange(0)}>{1}</button>}
				{activePage >= 4 && <span>...</span>}
				{pages.map((page) => (
					<button
						key={page}
						className={`${isActive(
							page
						)} w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white`}
						onClick={() => onChange(page)}
					>
						{page + 1}
					</button>
				))}
				{activePage < pageCount - 4 && <span>...</span>}
				{pageCount > 5 && (
					<button
						className={isActive(pageCount - 1)}
						onClick={() => onChange(pageCount - 1)}
					>
						{pageCount}
					</button>
				)}
			</div>
		</div>
	);
};

export default Pagination;
