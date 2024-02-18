export interface metaData {
	totalPages: numberType;
	totalDocuments: numberType;
	page: numberType;
	count: numberType;
	limit: numberType;
}

interface numberType {
	[key: string]: number;
}
