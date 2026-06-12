import { useCallback, useRef, useState } from 'react';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadJob {
	id: string;
	file: File;
	progress: number;
	status: UploadStatus;
	url?: string;
	error?: string;
}

interface UseUploaderOptions {
	endpoint?: string; // POST URL
	fieldName?: string;
	headers?: Record<string, string>;
}

interface UseUploaderResult {
	jobs: ReadonlyArray<UploadJob>;
	enqueue: (files: ReadonlyArray<File>) => void;
	cancel: (id: string) => void;
	reset: () => void;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * XHR-backed upload hook with per-file progress.
 * If `endpoint` is omitted, jobs simulate progress (useful for UI dev / placeholder).
 */
export function useUploader({
	endpoint,
	fieldName = 'file',
	headers,
}: UseUploaderOptions = {}): UseUploaderResult {
	const [jobs, setJobs] = useState<UploadJob[]>([]);
	const xhrs = useRef<Map<string, XMLHttpRequest>>(new Map());

	const updateJob = (id: string, patch: Partial<UploadJob>) => {
		setJobs((js) => js.map((j) => (j.id === id ? { ...j, ...patch } : j)));
	};

	const startReal = (job: UploadJob) => {
		if (!endpoint) return;
		const xhr = new XMLHttpRequest();
		xhrs.current.set(job.id, xhr);
		xhr.open('POST', endpoint, true);
		if (headers) for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
		xhr.upload.onprogress = (e) => {
			if (!e.lengthComputable) return;
			updateJob(job.id, { progress: (e.loaded / e.total) * 100 });
		};
		xhr.onload = () => {
			xhrs.current.delete(job.id);
			if (xhr.status >= 200 && xhr.status < 300) {
				updateJob(job.id, { status: 'success', progress: 100, url: xhr.responseText });
			} else {
				updateJob(job.id, { status: 'error', error: `Server ${xhr.status}` });
			}
		};
		xhr.onerror = () => {
			xhrs.current.delete(job.id);
			updateJob(job.id, { status: 'error', error: 'Network error' });
		};
		const fd = new FormData();
		fd.append(fieldName, job.file);
		xhr.send(fd);
	};

	const startSimulated = (job: UploadJob) => {
		const tick = () => {
			setJobs((js) => {
				const target = js.find((j) => j.id === job.id);
				if (!target || target.status !== 'uploading') return js;
				const next = Math.min(100, target.progress + 8 + Math.random() * 16);
				const nextStatus: UploadStatus = next >= 100 ? 'success' : 'uploading';
				return js.map((j) =>
					j.id === job.id ? { ...j, progress: next, status: nextStatus } : j,
				);
			});
		};
		const interval = window.setInterval(() => {
			tick();
			setJobs((js) => {
				const target = js.find((j) => j.id === job.id);
				if (target && target.status !== 'uploading') {
					window.clearInterval(interval);
				}
				return js;
			});
		}, 220);
	};

	const enqueue = useCallback(
		(files: ReadonlyArray<File>) => {
			const newJobs: UploadJob[] = files.map((file) => ({
				id: newId(),
				file,
				progress: 0,
				status: 'uploading',
			}));
			setJobs((js) => [...js, ...newJobs]);
			newJobs.forEach((j) => (endpoint ? startReal(j) : startSimulated(j)));
		},
		[endpoint],
	);

	const cancel = useCallback((id: string) => {
		const xhr = xhrs.current.get(id);
		if (xhr) {
			xhr.abort();
			xhrs.current.delete(id);
		}
		setJobs((js) => js.filter((j) => j.id !== id));
	}, []);

	const reset = useCallback(() => {
		xhrs.current.forEach((xhr) => xhr.abort());
		xhrs.current.clear();
		setJobs([]);
	}, []);

	return { jobs, enqueue, cancel, reset };
}
