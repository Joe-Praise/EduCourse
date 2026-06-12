import { baseURL } from '../../redux/api/utils';

const CLOUDINARY_HOST = 'https://res.cloudinary.com';

export const TRANSFORMS = {
  avatarSm:        'w_150,h_150,c_fill,q_auto,f_auto',
  avatarLg:        'w_400,h_400,c_fill,q_auto,f_auto',
  courseCoverCard: 'w_600,h_340,c_fill,q_auto,f_auto',
  courseCoverHero: 'w_1200,h_675,c_fill,q_auto,f_auto',
  blogCoverCard:   'w_600,h_400,c_fill,q_auto,f_auto',
  blogCoverHero:   'w_1200,h_675,c_fill,q_auto,f_auto',
} as const;

export type TransformPreset = typeof TRANSFORMS[keyof typeof TRANSFORMS];

/**
 * Injects Cloudinary transform params into a Cloudinary URL.
 * If transforms are already present between /upload/ and the public_id, they are replaced.
 */
export const cl = (url: string, transforms: string): string =>
  url.replace('/upload/', `/upload/${transforms}/`);

/**
 * Returns a displayable image URL regardless of whether the stored value is:
 *   - A full Cloudinary URL (new records)   → adds transforms
 *   - A bare filename (legacy records)       → constructs the old backend path
 *
 * @param value       The stored photo/imageCover string from the API
 * @param legacyPath  The backend path for legacy filenames, e.g. '/img/', '/course/', '/blog/'
 * @param transforms  Cloudinary transform string, defaults to quality+format auto
 */
export const imgSrc = (
  value: string | undefined | null,
  legacyPath: '/img/' | '/course/' | '/blog/' | '/user/',
  transforms: string = 'q_auto,f_auto',
): string => {
  if (!value) return '';
  // Cloudinary URL → inject transforms.
  if (value.startsWith(CLOUDINARY_HOST)) {
    return value.replace('/upload/', `/upload/${transforms}/`);
  }
  // Any other absolute URL (e.g. a YouTube thumbnail https://i.ytimg.com/...
  // stored as imageCover on AI-imported courses) → use it verbatim. Without
  // this, the legacy-path branch below would mangle it into
  // `${baseURL}/course/https://i.ytimg.com/...` and the image would break.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  // Bare filename (legacy uploads) → construct the old backend path.
  return `${baseURL}${legacyPath}${value}`;
};
