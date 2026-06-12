import { axiosInstance as API } from './utils';
import { handleApiError } from '../../util/helperFunctions/helper';

export interface CertificateCourse {
	_id: string;
	title: string;
	slug: string;
	imageCover?: string;
	instructors?: Array<{ _id: string; userId?: { _id: string; name: string } }>;
}

export interface CertificateData {
	_id: string;
	userId: string;
	courseId: CertificateCourse | string;
	createdAt: string;
	updatedAt?: string;
}

export const getMyCertificatesApi = async () => {
	try {
		const { data } = await API.get('/api/v1/certificates/me');
		return data as { status: string; data: CertificateData[] };
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCertificateApi = async (id: string) => {
	try {
		const { data } = await API.get(`/api/v1/certificates/${id}`);
		return data as { status: string; data: CertificateData };
	} catch (error) {
		return handleApiError(error);
	}
};
