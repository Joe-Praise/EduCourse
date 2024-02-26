import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import DataBadge from '../shared/DataBadge';
import { headerbadge } from '../Single Course/HeaderContainer';

interface Iprop {
	dataDisplay: headerbadge[];
	headerTitle: string;
}

const BlogHeader = (props: Iprop) => {
	const { dataDisplay, headerTitle } = props;
	return (
		<div>
			{/* <h1>React and Redux master class</h1> */}
			<h1>{capitalizeFirstLetters(headerTitle)}</h1>
			<div>
				<DataBadge dataDisplay={dataDisplay} />
			</div>
		</div>
	);
};

export default BlogHeader;
