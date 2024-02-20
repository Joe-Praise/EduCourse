import { FC } from 'react';
import CardsPlaceholder from '../Home/CardsPlaceholder';
import BlogCard from './BlogCard';
import img from '../../assets/image/card2.jpg';
import { blogCardType } from '../../pages/Home/homePageType';

const Blogs: FC = () => {
	// interface cardProps {
	// 	img: string;
	// 	instructor: string;
	// 	articleTitle: string;
	// 	createdAt: string;
	// 	summary: string;
	// }

	const articles: blogCardType[] = [
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout: 'grid',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout: 'grid',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout: 'grid',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout: 'grid',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout: 'grid',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout: 'grid',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout: 'grid',
		},
	];

	return (
		<CardsPlaceholder
			title={'Articles'}
			description={'Explore our Free Articles'}
			path={`/articles`}
			btnValue={'All Articles'}
			className='grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'
		>
			<>
				{articles.map((el, id) => {
					if (id <= 5) {
						return (
							<BlogCard
								key={id}
								img={el.img}
								instructor={el.instructor}
								articleTitle={el.articleTitle}
								createdAt={el.createdAt}
								summary={el.summary}
								activeLayout={el.activeLayout}
							/>
						);
					}
				})}
			</>
		</CardsPlaceholder>
	);
};

export default Blogs;
