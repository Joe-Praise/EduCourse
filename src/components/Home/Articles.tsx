import { FC } from 'react';
import CardsPlaceholder from './CardsPlaceholder';
import ArticleCard from './ArticleCard';
import img from '../../assets/image/card2.jpg';

const Articles: FC = () => {
	interface cardProps {
		img: string;
		instructor: string;
		articleTitle: string;
		createdAt: string;
		summary: string;
	}

	const articles: cardProps[] = [
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
		},
	];
	return (
		<CardsPlaceholder
			title={'Articles'}
			description={'Explore our Free Articles'}
			path={`/articles`}
			btnValue={'All Articles'}
			className='grid-cols-1 sm:grid-cols-3 sm:gap-4 gap-y-8'
		>
			<>
				{articles.map((el, id) => {
					if (id <= 5) {
						return (
							<ArticleCard
								key={id}
								img={el.img}
								articleTitle={el.articleTitle}
								createdAt={el.createdAt}
								summary={el.summary}
							/>
						);
					}
				})}
			</>
		</CardsPlaceholder>
	);
};

export default Articles;
