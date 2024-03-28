import { useCallback, useEffect, useState } from 'react';
import { metaData, paginateType } from '../../redux/sharedTypes';

interface Iprop {
	handlePagination: (_details: paginateType, _queryStr: string) => void;
	metaData: metaData;
	queryString: string;
}

const Pagination = (props: Iprop) => {
	const { metaData, handlePagination, queryString } = props;
	const [pages, setPages] = useState<number[]>([]);
	const [activePage, setActivePage] = useState(metaData?.page);

	const pageCount = metaData?.totalPages;
	const buildPages = useCallback(() => {
		let start = 1,
			end = pageCount > 5 ? pageCount / 2 : pageCount;

		if (activePage > 3 && activePage < pageCount - 3) {
			start = activePage - 2;
			end = activePage + 2;
		}

		if (pageCount > 5 && activePage > pageCount - 5) {
			start = pageCount - 5;
			end = pageCount - 1;
		}

		const newPages = [];
		for (let i = start; i <= end; i++) {
			newPages.push(i);
		}

		setPages(newPages);
	}, [activePage, pageCount]);

	// sets page and triggers pagination call
	const onChange = (page: number) => {
		setActivePage(page);
		const details = {
			page: page + '',
			limit: '6',
		};

		return handlePagination(details, queryString);
	};

	// const isActive = (page: number) => {
	// 	// console.log(page, activePage);
	// 	activePage === page ? 'active' : '';
	// };

	useEffect(() => buildPages(), [activePage, buildPages]);
	return (
		<div>
			<div className='flex gap-2 justify-center mt-5'>
				{activePage > 3 && (
					<button
						onClick={() => onChange(1)}
						className={`${
							activePage === 1 ? 'active' : ''
						}  w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white`}
					>
						{1}
					</button>
				)}
				{activePage >= 4 && <span>...</span>}
				{pages.map((page) => {
					return (
						<button
							key={page}
							className={`${
								activePage === page ? 'active' : ''
							} w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white`}
							onClick={() => onChange(page)}
						>
							{page}
						</button>
					);
				})}
				{activePage < pageCount - 2 && <span>...</span>}
				{pageCount > 5 && (
					<button
						className={`${
							activePage === pageCount ? 'active' : ''
						}  w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white`}
						onClick={() => onChange(pageCount)}
					>
						{pageCount}
					</button>
				)}
			</div>
		</div>
	);
};

export default Pagination;
