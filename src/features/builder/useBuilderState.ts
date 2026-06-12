import { useCallback, useEffect, useRef, useState } from 'react';
import { EMPTY_DRAFT, type CourseDraft } from './types';
import { loadEditDraft } from './loadEditDraft';

const STORAGE_KEY = (id: string) => `educourse:builder-draft:${id}`;
const SAVE_DEBOUNCE_MS = 1500;

export type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error';

interface UseBuilderStateResult {
	draft: CourseDraft;
	update: <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => void;
	merge: (patch: Partial<CourseDraft>) => void;
	reset: () => void;
	saveStatus: SaveStatus;
	loading: boolean;
}

export function useBuilderState(id: string = 'new'): UseBuilderStateResult {
	const isEdit = id !== 'new';

	const [draft, setDraft] = useState<CourseDraft>(() => {
		// Edit mode: always start empty — the API fetch below will populate the form.
		// We cannot trust localStorage here: it may contain a stale EMPTY_DRAFT written
		// on a previous visit before this fetch logic existed.
		if (isEdit) return EMPTY_DRAFT;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY(id));
			if (raw) return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
		} catch {
			/* ignore */
		}
		return EMPTY_DRAFT;
	});
	const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
	// Edit mode starts in loading state so CourseBuilder shows a loading screen
	// instead of a blank form while the API fetch is in flight.
	const [loading, setLoading] = useState<boolean>(isEdit);
	const timer = useRef<number | null>(null);

	// Edit mode: always fetch from the API to hydrate the draft.
	// localStorage is NOT used as a cache here — a stale entry would prevent the
	// fetch from running and leave the form blank.
	useEffect(() => {
		if (!isEdit) return;
		let cancelled = false;
		// Clear any stale localStorage entry from previous visits so it can't
		// pollute the initial state on future renders.
		try { window.localStorage.removeItem(STORAGE_KEY(id)); } catch { /* ignore */ }
		loadEditDraft(id).then((loaded) => {
			if (cancelled) return;
			if (loaded) {
				setDraft(loaded);
			} else {
				console.warn('[useBuilderState] loadEditDraft returned null for id', id);
			}
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => { cancelled = true; };
	}, [id, isEdit]);

	useEffect(() => {
		setSaveStatus('unsaved');
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			try {
				window.localStorage.setItem(STORAGE_KEY(id), JSON.stringify(draft));
				setSaveStatus('saved');
			} catch {
				setSaveStatus('error');
			}
		}, SAVE_DEBOUNCE_MS);
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, [draft, id]);

	const update = useCallback(<K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => {
		setDraft((d) => ({ ...d, [key]: value }));
	}, []);

	const merge = useCallback((patch: Partial<CourseDraft>) => {
		setDraft((d) => ({ ...d, ...patch }));
	}, []);

	const reset = useCallback(() => {
		setDraft(EMPTY_DRAFT);
		try {
			window.localStorage.removeItem(STORAGE_KEY(id));
		} catch {
			/* ignore */
		}
	}, [id]);

	return { draft, update, merge, reset, saveStatus, loading };
}
