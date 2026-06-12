export interface metaData {
	totalPages: number;
	totalDocuments: number;
	page: number;
	count: number;
	limit: number;
}

export interface obj {
	[key: string]: any;
}

export type paginateType = {
	limit: string;
	page: string;
};

export interface ApiResponse {
	data: obj[] | null;
	error: string;
}

export interface autocompleteType {
	_id?: string;
	title: string;
	slug: string;
	imageCover?: string;
	score?: number;
	/** 'importing' = an AI/YouTube import is still building this course. */
	publishedStatus?: string;
}
