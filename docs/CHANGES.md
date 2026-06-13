# Frontend Changes

Running changelog of changes shipped to the EduCourse frontend during the app-wide optimization pass. Newest entries at the top.

Format per entry:
- **What**: one-line summary
- **Why**: the problem being solved
- **Files**: paths (+ line numbers when useful)
- **Verify**: how to confirm the fix works

---

## 2026-06-12 — Filter menu redesign (awards-grade) + stale instructor filter fix

### Instructor filter still showed course-less instructors
- **Cause** ([instructorApi.ts](src/redux/api/instructorApi.ts)): `getInstructors` cached the response in `sessionStorage` (`INSTRUCTOR_CONST`). After the backend started filtering to published-course instructors, the frontend kept serving the **old unfiltered list** from cache (survives reloads).
- **Fix**: removed the sessionStorage cache from `getInstructors` — the list (which changes as courses publish) is now always fetched fresh, so the filter reflects the backend's published-only set.

### Filter menu redesign — editorial, awards-grade
- [FilterActionMenu.tsx](src/components/shared/FilterActionMenu.tsx): each filter group is now a **collapsible accordion** — mono-caps header, a clay "active" dot when the group has a selection, a rotating chevron, and a `grid-rows` height animation (no magic max-height).
- [FilterActionList.tsx](src/components/shared/FilterActionList.tsx): rebuilt the option rows — custom clay check indicator (replaces react-icons `MdCheckBox`), subtle `bg-clay-500/10` active tint + hover (replaces the harsh `hover:bg-black`), **instructor rows now show the avatar + name** (via the resolver), refined lucide star rows for Review ("★★★★☆ & up"), and pill-cloud Tags. **Active state now reads from Redux** (`queryFilter`) so selections persist when you reopen the panel (the old local state reset every time).
- [Course.tsx](src/pages/Courses/Course.tsx): the Refine sheet gained an **"N active / Clear all"** header; filter sections sit flush with dividers.

### Filter sheet scrolls internally (not the page)
- [RefineSheet.tsx](src/patterns/RefineSheet/RefineSheet.tsx): the panel had `overflow-y-auto` but the app's **Lenis** smooth-scroll hijacked the wheel and scrolled the page behind it instead. Added `data-lenis-prevent` (opt the panel out of Lenis, like the menu overlay) + `overscroll-contain`, and a **body-scroll lock** while the sheet is open. The filter list now scrolls inside the panel; the page stays put.

### Verify
- Courses filter lists only instructors with a published course (hard refresh once to drop the old session cache).
- Open Refine → sections collapse/expand smoothly, selecting an option shows a clay check + group dot, reopening keeps your selections, "Clear all" resets.
- Scroll inside the open filter → only the panel scrolls, the page behind is locked.

---

## 2026-06-11 — Filter crash fix, menu image-trail scroll fix

### Filter button crash (courses + every other filter)
- **Cause**: `FilterActionList.tsx` rendered instructor options via `capitalizeFirstLetters(el?.userId?.name)` — for YouTube instructors `userId` is `undefined`, so `capitalizeFirstLetters(undefined)` ran `undefined.indexOf(...)` → TypeError → the filter (and page) crashed. Same class as the my-learning instructor bug.
- **Fix**:
  - [helper.ts](src/util/helperFunctions/helper.ts): `capitalizeFirstLetters` + `camelCase` are now **null-safe** (return `''` for nullish input). This hardens **every** filter/dropdown that uses them (courses, blog, my-learning, etc.) against the same crash.
  - [FilterActionList.tsx](src/components/shared/FilterActionList.tsx): instructor option labels now use `resolveInstructor(el).name`, so YouTube instructors show their channel name instead of nothing.
- Swept the codebase: no remaining unguarded `instructor.userId.name/photo` accesses (all go through the resolver).

### Menu hover image-trail drifts off when the menu is scrolled
- **Cause** ([MenuOverlay.tsx](src/widgets/LayoutHeader/MenuOverlay.tsx)): the floating cursor-image preview lives inside the scrollable panel and is positioned with viewport (`clientX/clientY`) coords. When the panel scrolls down, the image's absolute origin scrolls up with the content, so the image drifted up by `scrollTop` and disappeared off the top once you scrolled the menu.
- **Fix**: add `panelRef.scrollTop` back into the transform's Y, so the preview tracks the cursor regardless of how far the menu list is scrolled.

---

## 2026-06-11 — Instructor link fix (Tosin), lessons-menu scroll, scroll-reveal header

Three fixes.

### 1. Instructor links open the instructor view, not the learner profile
- [instructorDisplay.ts](src/util/helperFunctions/instructorDisplay.ts): `resolveInstructor().profilePath` now always returns `/instructors/:id` (the page that shows the instructor's taught courses) for **every** instructor — previously real-user instructors routed to `/user/:id`, the learner profile showing "currently learning across 0 courses" (the Tosin bug). Works for user + YouTube instructors alike.

### 2. Lessons (curriculum) menu scrolls properly when long
- [CurriculumDotRail.tsx](src/features/lecture/CurriculumDotRail.tsx): the slide-in panel was a fixed-height block with the list at `h-[calc(100%-72px)]` — a magic number that assumed a 72px header. The two-line header is taller, so long lists overflowed the panel bottom and the last lessons were clipped. Rebuilt the panel as a **flex column** (`flex flex-col`; header/underline `shrink-0`; list `flex-1 min-h-0 overflow-y-auto overscroll-contain`) so the list fills the real remaining space and scrolls internally on every viewport (desktop + mobile).

### 3. Scroll-reveal header (jitter.video style) — GSAP, scroll-direction aware
- [LayoutHeader.tsx](src/widgets/LayoutHeader/LayoutHeader.tsx): GSAP + scroll-direction logic. Scrolling **down** past 90px slides the header up out of view (`gsap.to yPercent: -140`, `power3.out`) and pops in a floating **editorial "Menu" pill** (matching the header's own menu button, `back.out` ease); scrolling **up** brings the header straight back and tucks the pill away (`power2.in`); clicking the pill reveals it on demand; returning to the top restores the transparent chrome. rAF-throttled, `MIN_DELTA` jitter guard, honors `prefers-reduced-motion`. GSAP owns `transform`; Tailwind only animates bg/border/blur.
- **Root-cause fix** ([Layout.tsx](src/App/Layout/Layout.tsx)): the wrapper used `overflow-x-hidden`, which creates a scroll container and **silently breaks `position: sticky`** on the header — so the header scrolled away naturally and `gsap yPercent: 0` returned it to its document-top position (off-screen), i.e. clicking the reveal button did nothing visible. Switched to **`overflow-x-clip`** (still prevents horizontal scroll, but does not create a scroll container) so the sticky header pins correctly and the reveal animation works.

### Verify
- Click any instructor (e.g. Tosin) → lands on `/instructors/:id` showing their course grid, not a learner profile.
- Open a course with many lessons → the curriculum panel scrolls; the last lesson is reachable (no footer clipping), desktop + mobile.
- Scroll **down** → header slides up + hamburger pops in; scroll **up** → header slides back; click the hamburger anytime → header reveals.

---

## 2026-06-10 — Courses grid auto-refreshes when an AI import completes

- **What** ([Course.tsx](src/pages/Courses/Course.tsx)): added `refreshCourses()` (re-dispatches `getCoursesAction` for the active filter); the build-from-YouTube poll calls it the moment the import reaches `published`, so the new course (sorted newest-first) appears in the grid without a manual refresh. Backend pairs this with `removePattern('cache:course*')` invalidation on import.
- **Verify**: On `/courses`, search a non-existent course → "Build from YouTube" → wait ~30s → the new course shows up in the grid automatically (and the dropdown shows "✓ ready").

---

## 2026-06-10 — YouTube-channel-as-instructor: fix broken instructor section + AI badge + profile page

AI-imported courses had a broken instructor section ("undefined's display image") because YouTube instructors have no linked platform `User` — components read `instructor.userId.name/photo` which was `undefined`.

### What changed
- **Resolver** ([instructorDisplay.ts](src/util/helperFunctions/instructorDisplay.ts), new): `resolveInstructor()` is the single source of truth for an instructor's display fields. Resolves name = `userId.name ?? channelName ?? title`, photo = `userId.photo ?? channelThumbnailUrl`, bio = `description`, and `profilePath` = `/user/:id` for real users (keeps the rich PublicProfile) or `/instructors/:id` for YouTube channels.
- **Types loosened**: `userId` is now optional + channel fields (`source`, `channelName`, `channelThumbnailUrl`, `channelUrl`, `subscriberCount`) added on `instructorApi.InstructorType`, `courseAPI.Instructor`, `sharedTypes.autocompleteType`. `SingleCourseType` + `CourseCardData` gained `youtubePlaylistId`/`channelId`.
- **Fixed all `userId.*` accesses** via the resolver: [Instructor.tsx](src/components/Single%20Course/Instructor.tsx) (the broken screenshot section — now real avatar, linked name, channel link, AI badge), [SingleCourse.tsx](src/pages/Single%20Course/SingleCourse.tsx) header byline, [CourseCard.tsx](src/features/course/CourseCard.tsx), [InstructorCard.tsx](src/components/instructor/InstructorCard.tsx), [Instructors.tsx](src/pages/Instructors/Instructors.tsx) + [InstructorPortraitCard.tsx](src/features/instructor/InstructorPortraitCard.tsx), and [InstructorSpotlightGrid.tsx](src/features/home/InstructorSpotlightGrid.tsx) (home page).
- **Image source**: every instructor-avatar render site routes through `imgSrc()`, which (since the 2026-06-09 fix) returns absolute `http(s)://` URLs verbatim — so YouTube avatars (`https://yt3.ggpht.com/...`) render, not just Cloudinary uploads. Audited: `InstructorPortraitCard`, `InstructorCard`, `Instructor.tsx`, `CourseCard`, `SingleInstructor`, `InstructorSpotlightGrid` all confirmed. (`HeroCollage` renders only course covers, no instructor image.)
- **New `/instructors/:id` page** ([SingleInstructor.tsx](src/pages/Single%20Instructor/SingleInstructor.tsx) + route in [Routes.tsx](src/Routes.tsx)): editorial profile for any instructor (avatar, bio, subscriber count, channel link, AI-Compiled badge) + a grid of their courses (fetched via `GET /courses?instructors=:id`). This is where user-less YouTube instructors link to.
- **AI-Compiled badge**: course cards show a "✨ AI" cover pill, SingleCourse + instructor pages show an "AI-Compiled" `Badge`, gated on `course.youtubePlaylistId` / `instructor.source === 'youtube'`.

### Files
New: `src/util/helperFunctions/instructorDisplay.ts`, `src/pages/Single Instructor/SingleInstructor.tsx`. Modified: `instructorApi.ts`, `courseAPI.ts`, `sharedTypes.ts`, `Routes.tsx`, `Instructor.tsx`, `SingleCourse.tsx`, `CourseCard.tsx`, `InstructorCard.tsx`, `Instructors.tsx`, `InstructorPortraitCard.tsx`.

### Verify
- Open an AI-imported course → instructor shows a real YouTube avatar + name + "AI-Compiled" badge + working "YouTube channel" link; clicking the instructor opens `/instructors/:id` with their course grid.
- Course cards for imported courses show the "✨ AI" cover pill.
- Real (user) instructors still link to `/user/:id` (unchanged rich profile).

---

## 2026-06-08 — Editorial toast system (replaces react-toastify)

Rebuilt the toast/notification rendering as a custom editorial component instead of the default `react-toastify` chrome.

### What changed
- New `components/shared/Toastify.tsx`:
  - Reads the same Redux `state.notification.notification[]` queue everyone else already dispatches into, so **zero upstream changes** required. `addNotification({ message, type })` still works.
  - Each toast is a fixed-width card (320/360px) with: persona-color **left stripe** (3px), Lucide icon (`CheckCircle2` / `AlertOctagon` / `AlertTriangle` / `Info`), mono caps **eyebrow + timestamp** ("SUCCESS · 12:34"), body message in Inter Tight, X dismiss button, and a thin **persona-color progress strip** at the bottom that depletes over the toast's duration.
  - Tone tokens: `success` → signal-success, `error` → signal-danger, `warning` → signal-warning, `info` → clay, `default` → ink-tertiary. Each tone sets icon color, stripe color, ring color, and ARIA role (`status` vs `alert`) + `aria-live` (`polite` vs `assertive`).
  - Per-type durations: success 3.5s, info 4s, warning 5s, error 6.5s.
  - **Hover pauses** the timer (the progress strip pauses too — implemented by remounting it via key swap so the CSS animation restarts cleanly).
  - **Click dismisses** immediately; explicit X button doesn't bubble (stopPropagation) so the user can hit it cleanly.
  - Slide-in from the right (`translate-x-[calc(100%+2rem)] opacity-0` → `translate-x-0 opacity-100`) via Tailwind transition tokens (`duration-slow ease-out-quart`), with a 16ms double-rAF before flipping the target style so the initial paint actually happens.
  - **Stack cap of 4** — when a 5th arrives, the oldest gets marked `leaving` (slides out) to free room.
  - Portal to `document.body` so it sits above all z-indices.
  - Self-contained `@keyframes toast-deplete` injected via a `<style>` tag so no global CSS changes needed.
- Deleted `src/App/NotificationProvider.tsx` — its logic (drain Redux queue, dispatch clear) is absorbed into the new Toastify.
- Removed the `<NotificationProvider>` wrap from `App/main.tsx`.
- Uninstalled `react-toastify` (and its `dist/ReactToastify.css` import).

### Why it's better
- **Brand-consistent** — same Fraunces/Inter Tight + clay/sienna/ivory tokens as the rest of the site. The previous react-toastify boxes looked like default Bootstrap.
- **Restraint** — minimal chrome, generous typographic detail (mono caps eyebrow, tabular timestamp), single persona-color accent. Magazine-feel rather than utility-feel.
- **Smarter durations** — errors stay longer than successes; users have time to read them.
- **Better a11y** — error/warning toasts are role="alert" + aria-live="assertive" (announced immediately by screen readers); success/info are polite (queued).
- **No upstream change required** — every existing `addNotification` / `dispatchSuccessHandler` / `dispatchErrorHandler` call works unchanged.

### Files
- New: `src/components/shared/Toastify.tsx` (full rewrite)
- Deleted: `src/App/NotificationProvider.tsx`
- Modified: `src/App/main.tsx`, `package.json` (react-toastify removed)

### Verify
- Trigger any action that dispatches a notification (e.g. add to wishlist, fail a login, save profile). Editorial card slides in from the top-right with the matching tone + icon + progress strip.
- Hover one → progress strip pauses, dismissal timer pauses.
- Click anywhere on the card → it slides out and unmounts.
- Stack 5+ toasts quickly → oldest one auto-leaves once the cap is hit.
- Verify screen-reader behavior with error toast → announced immediately (role="alert").

---

## 2026-06-08 — Refresh-token flow + 30min idle logout

Paired with the backend `/refresh` + `/logout` endpoints — short-lived access tokens are now invisible to users because the client transparently refreshes them, and a 30min inactivity window logs people out.

### Axios response interceptor ([utils.ts](src/redux/api/utils.ts))
- On 401, calls `POST /users/refresh` (browser sends the httpOnly `rt` cookie automatically via `withCredentials: true`), persists the new token to localStorage, retries the original request with `Authorization: Bearer <new>`.
- Coalesces concurrent refreshes — if 5 requests fire and all 401, a single `/refresh` call is made and all 5 wait on the same promise.
- Tags each retried request with `_retry: true` so we never loop. If `/refresh` itself 401s, the failure propagates and the AuthGuard / idle timer kicks in.
- Explicitly excludes `/login`, `/refresh`, and `/signup` from the retry logic — those legitimately return 401 for bad credentials and shouldn't trigger a refresh.

### Idle timer ([hooks/useIdleTimer.ts](src/hooks/useIdleTimer.ts))
- New `useIdleTimer({ idleMs, onIdle, enabled })` hook. Listens to `mousemove`, `mousedown`, `keydown`, `touchstart`, `scroll`, `wheel` with `{ passive: true }` so the scroll thread isn't blocked.
- Throttles re-arming to once per second (avoids setting/clearing the timer 60×/s during heavy mouse movement).
- Wired into `PrivateRoutes` with `idleMs: 30 * 60 * 1000` and `onIdle: () => dispatch(logoutAction(navigate))`. Pauses automatically when the user is signed out.

### Logout flow ([authAction.ts](src/redux/actions/authAction.ts), [authApi.ts](src/redux/api/authApi.ts))
- New `logoutApi()` calls `POST /users/logout` to revoke the refresh token server-side and clear the cookies.
- `logoutAction` now fires `logoutApi()` fire-and-forget BEFORE clearing local state — if the network is down the user still gets logged out client-side immediately, and the backend will clean up the orphaned token on its next TTL sweep.

### Files
- New: `src/hooks/useIdleTimer.ts`
- Modified: `src/redux/api/utils.ts` (response interceptor), `src/redux/api/authApi.ts` (logout endpoint), `src/redux/actions/authAction.ts` (logout dispatch), `src/App/PrivateRoutes.tsx` (idle timer)

### Verify
- Sign in → wait > 15min → trigger any authenticated request (Wishlist, Profile, etc) → the request succeeds with no perceptible delay (silently refreshed).
- Open dev tools network tab → observe the `/refresh` round-trip happening invisibly when the access JWT expires.
- Sit idle for 30 min → automatic logout + redirect to `/signin`.
- Click "Log out" → both cookies cleared, refresh token revoked server-side.

---

## 2026-06-08 — Sentry-flagged removeChild guard (NotesDrawer + FloatingEnrollmentPill)

- **Bug**: `NotFoundError: Failed to execute 'removeChild' on 'Node'` on the lecture page. Classic React/GSAP/portal race: GSAP `onComplete: () => setRender(false)` fires AFTER the component has already unmounted (e.g. user navigates away mid-close-animation), React's reconciler then tries to remove a node that's no longer where it expects.
- **Fix**: Added a `mountedRef` to both `NotesDrawer.tsx` and `FloatingEnrollmentPill.tsx` (same close-animation pattern). The GSAP `onComplete` callback now checks `mountedRef.current` before calling `setRender(false)`, eliminating the post-unmount state update that triggered the reconciler crash.
- **Files**: `src/features/lecture/NotesDrawer.tsx`, `src/features/course/FloatingEnrollmentPill.tsx`
- **Verify**: open the lecture page → open notes → start closing the drawer → quickly navigate to another page mid-animation. Previously crashed in dev; should no-op cleanly now.

---

## 2026-06-09 — AI course-import UX: broken thumbnail fix + search "build it" feedback

Two issues from testing the YouTube import on the course page.

### 1. Broken image on AI-imported courses
- **Cause**: AI-imported courses store `imageCover` as a full YouTube thumbnail URL (`https://i.ytimg.com/vi/.../hqdefault.jpg`). `imgSrc()` only passed through Cloudinary URLs — everything else fell to the legacy branch, mangling it into `${baseURL}/course/https://i.ytimg.com/...`.
- **Fix** ([cloudinary.ts](src/util/helperFunctions/cloudinary.ts)): `imgSrc` now returns any absolute `http(s)://` URL verbatim (Cloudinary URLs still get transform injection; bare filenames still get the legacy path).

### 2. No feedback when searching for a course that doesn't exist
- **Cause**: The course-page search box only hit the autocomplete endpoint (`/courses/autocomplete?q=`), which never triggered an import and didn't surface the `importing` status of in-progress AI drafts. A user searching "introduction to rust" saw nothing happen — even though the backend *can* build it on demand.
- **Fix**:
  - **Backend** ([courseController.ts](src/Controllers/courseController.ts) `atlasAutocomplete`): the autocomplete projection now includes `publishedStatus`, so the UI can tell which results are still being built.
  - **Frontend** ([courseAPI.ts](src/redux/api/courseAPI.ts)): new `triggerCourseImport(query)` → `GET /courses?search=<q>` (the backend creates an `importing` draft + fires the youtube-course-discovery agent on zero results).
  - **Frontend** ([Course.tsx](src/pages/Courses/Course.tsx)): the search dropdown is now a full affordance for ≥3-char queries:
    - Matching results render as before; any `importing` result is badged "⏳ Building" and is non-navigable.
    - A **"Build &lt;query&gt; from YouTube"** CTA (sparkle icon, "AI imports a course in ~30s") appears when there's no published match — explicit click, so we never auto-spam imports on every keystroke.
    - On click → fires the import, shows a live **"Building…"** banner with the backend's `discoveryMessage`, then **polls every 7s (up to ~3 min)** until the course is `published`, flipping to a **"✓ &lt;title&gt; is ready →"** link that navigates to the course. Poll cleans up on unmount and resets when the query changes.

### Files
- Frontend: `src/util/helperFunctions/cloudinary.ts`, `src/redux/api/courseAPI.ts`, `src/redux/sharedTypes.ts` (+`publishedStatus` on `autocompleteType`), `src/pages/Courses/Course.tsx`
- Backend: `src/Controllers/courseController.ts` (autocomplete projection)

### Verify
- Open an AI-imported course → cover image renders (no broken icon).
- Search a course that doesn't exist (e.g. "intro to rust") → dropdown shows the "Build … from YouTube" CTA → click → "Building…" → ~30s later "✓ ready →".
- While building, the same term in autocomplete shows the "⏳ Building" badge and isn't clickable.

---

## 2026-06-08 — Phase 5: real-time notifications, preferences, feature flags, e2e tests

Four long-term items shipped:

### Phase 5.1 — Real-time notification delivery via SSE
- **Backend** ([notificationController.ts](src/Controllers/notificationController.ts)): new `GET /api/v1/notifications/stream` SSE endpoint. Sets standard SSE headers (incl. `X-Accel-Buffering: no` for nginx-proxied envs), pushes `data: {type:'notification.created', data:...}` on every matching `appEvents` emission, sends a heartbeat `: ping` every 25s, cleans up listener + interval on `req.close`.
- **Frontend** (`src/hooks/useNotificationStream.ts`): new hook opens an `EventSource` with `withCredentials: true` (auth via JWT cookie since EventSource can't set custom headers). Parses incoming events, dispatches `RECEIVE_LIVE_NOTIFICATION`. Reducer prepends the notification, bumps unread count, dedupes by `_id` so a race with a manual refetch doesn't double-insert.
- **Wired** into `PrivateRoutes` — opens for any authenticated user, tears down on sign-out.
- Gated behind the `liveNotifications` feature flag (see 5.3) — env var can kill-switch real-time delivery.

### Phase 5.2 — Notification preferences
- **Backend**: new `NotificationPreference` model (per-user, one doc, unique on `userId`). Seven channel pairs (`inApp`/`email`) for each notification type — `enrollment`, `review`, `review_alert`, `course_published`, `earning`, `progress_nudge`, `system` — plus a master `enabled` switch. Defaults: every type in-app, none email. `pre(/^find/)` filters inactive.
- **API**: `GET /api/v1/notifications/preferences` upserts a default doc if missing, returns it. `PATCH` accepts a partial body and writes only known fields with dotted-path `$set` so unset channels keep their defaults. Both protected; routes precede `/:id` so "preferences" isn't matched as an id.
- **Frontend**: `NotificationPreferencesForm` component with editorial toggle switches, optimistic updates, per-type description copy, master switch that dims/disables the per-type rows when off, save-state indicator ("Saving…" / "Saved" / "Couldn't save"). Mounted as a new "Notifications" tab on `/profile`.

### Phase 5.3 — Lightweight feature-flag system
- New `src/lib/featureFlags.ts` — env-driven flags with TypeScript discriminated union of known names. Each flag reads `import.meta.env.VITE_FF_<name>` and falls back to a default. `useFeatureFlag(name)` for React, `getFlag(name)` for non-React contexts.
- Initial flags: `liveNotifications`, `aiRecommendations`, `aiLearningPaths`, `aiQuizzes`, `searchPage`, `certificates`. AI flags default `false` because the agent service isn't wired in dev; rest default `true`.
- `.env.example` documents the env-prefix pattern.
- Applied first to `useNotificationStream` — operators can disable SSE delivery via env var without a code change.

### Phase 5.4 — Playwright smoke tests + CI integration
- Installed `@playwright/test`, added `playwright.config.ts` with chromium-only matrix (keeps CI fast). `webServer` auto-boots `npm run dev` against `localhost:5173` if `PLAYWRIGHT_BASE_URL` isn't set.
- Two test files under `e2e/`:
  - `home.spec.ts` — header wordmark renders, menu opens with primary nav (Home / Courses / Search / FAQ), 404 page shows the editorial "Off the page" copy.
  - `auth.spec.ts` — sign-in form renders email + password inputs; visiting `/profile` while logged out redirects to `/signin`.
- New scripts in `package.json`: `npm run test:e2e` and `npm run test:e2e:install`.
- GitHub Actions workflow (`.github/workflows/ci.yml`) now runs an `e2e` job after `verify` succeeds — installs Playwright chromium, runs the suite, uploads `playwright-report/` on failure for debugging.

- **Files**: 
  - Backend: `src/Controllers/notificationController.ts`, `src/Routes/notificationRoutes.ts`, `src/models/notificationPreferenceModel.ts` (new)
  - Frontend: `src/hooks/useNotificationStream.ts` (new), `src/App/PrivateRoutes.tsx`, `src/redux/api/notificationPreferencesApi.ts` (new), `src/components/Profile/NotificationPreferencesForm.tsx` (new), `src/pages/Profile/ProfileSettings.tsx`, `src/redux/{constants,reducers}/notificationApp*`, `src/lib/featureFlags.ts` (new), `.env.example`, `playwright.config.ts` (new), `e2e/home.spec.ts` (new), `e2e/auth.spec.ts` (new), `package.json`, `.github/workflows/ci.yml`
- **Verify**:
  - `npm run test:e2e` — both smoke tests pass.
  - Sign in → trigger any notification creation on the backend → it should appear in the bell within ~1s without a page refresh.
  - Profile → Notifications tab → toggle "Enrollment / In-app" off → state persists across reload.
  - Set `VITE_FF_liveNotifications=false` → SSE doesn't open.

- **What's intentionally NOT done** (the original Phase 5 list also included a staging environment — that's largely DevOps / infra config outside the codebase, deferred to deploy work).

---

## 2026-06-08 — Mobile lecture page: floating dock + lessons access + de-clutter

Screenshot showed `LearningStreakWidget` + `NotesDrawer` trigger overlapping the body text on mobile, and there was no way to see the lesson list (rail's edge tab is `hidden lg:block`).

- `LearningStreakWidget` wrapper in `LectureCourse.tsx` got `hidden lg:block`.
- `NotesDrawer` now accepts controlled `open` + `onOpenChange`; built-in trigger pill is `hidden lg:inline-flex` (desktop only).
- `CurriculumDotRail` same controlled-state treatment so a mobile button can drive its panel. Fixed an internal `setOpen` callsite still using the old updater form.
- **New mobile dock**: bottom-right vertical cluster (`right-4 bottom-4 lg:hidden`) with two 48×48 icon buttons — Lessons (`ListChecks`) opens the curriculum panel, Notes (`NotebookPen`) opens the notes drawer. Both use editorial `glass` chrome, single tidy footprint replacing two overlapping floating widgets.

- **Files**: `src/pages/Main Course/LectureCourse.tsx`, `src/features/lecture/NotesDrawer.tsx`, `src/features/lecture/CurriculumDotRail.tsx`
- **Verify**: On mobile only the two bottom-right icon buttons appear — no overlapping streak widget, no fat "Notes" pill. Lessons opens the curriculum sheet; Notes opens the drawer from the bottom. Desktop unchanged.

---

## 2026-06-08 — Watch-course follow-ups (rail rebuild, completion tracking, modals)

### 1. Rail was floating ~40px from the viewport edge
- **Root cause**: outer wrapper `fixed right-0 flex items-center` + the dot column's `px-4` padding pushed the dots ~16-32px inside the parent's right edge. Visible dots were nowhere near the actual edge, AND the wrapper still caught hover across its full footprint.
- **Fix**: Total redesign. Dots concept replaced with an **always-visible edge tab** ([CurriculumDotRail.tsx](src/features/lecture/CurriculumDotRail.tsx)):
  - Sits flush at `right: 0` (28px × 200px, vertically centered)
  - Doubles as a progress meter — vertical clay fill bar, `N/M` numeric on top, rotated "LESSONS" label on bottom
  - Click OR hover opens; outside-click / ESC / close button closes
  - Outer container `pointer-events-none` so Next button stays clickable

### 2. Lessons weren't marked complete on video end
- **Root cause**: `onEnded` advanced the active index but didn't update `CompletedCourse.lessonsCompleted` on the server. Progress ring stayed at 0% forever.
- **Fix**:
  - Backend `getLectureCourse` now returns `completedCourseId` so the frontend can target the existing PATCH `/completed-courses/:id` endpoint.
  - Added `markLessonComplete()` API + `MARK_LESSON_COMPLETE_LOCAL` reducer (optimistic toggle) + `markLessonCompleteAction` thunk.
  - `LectureCourse.tsx` `onEnded` now dispatches completion (skipping if already done to avoid the backend's toggle-off behavior) then advances.
- **Result**: video ends → that lesson gets a clay-bordered check in the rail; header ring + under-header strip advance; certificate state unlocks at 100%.

### 3. Modals were plain v0
- **Share** ([LectureHeader.tsx](src/components/Lecture%20Course/LectureHeader.tsx)): replaced legacy `<Modal>` + `<CopyText>` with inline editorial `DialogShell` (portal, ESC, backdrop-click, body scroll lock). URL input pill + Copy button that flips to green Check + "Copied" for 1.8s.
- **Rate** ([ReviewCourse.tsx](src/components/Lecture%20Course/ReviewCourse.tsx)): full rewrite. Lucide Star icons in clay (filled when active), hover-preview rating, dynamic label ("Disappointing" → "Exceptional"), editorial textarea, Cancel + Submit pills, personalized success state ("Thank you, {firstName}") with green Check before auto-close. Submit disabled until a rating is picked.

- **Files**: `src/features/lecture/CurriculumDotRail.tsx`, `src/components/Lecture Course/{LectureHeader,ReviewCourse}.tsx`, `src/pages/Main Course/LectureCourse.tsx`, `src/redux/{api,constants,actions,reducers}/course*`, plus `Building Safety Project/src/Controllers/courseController.ts`.
- **Verify**:
  - Right edge of lecture page → clay-progressed tab visible. Click it → panel slides in.
  - Watch a video to the end → that lesson gets a Check, ring fills.
  - Share button → editorial URL dialog, Copy flips to Copied briefly.
  - Rate button → star hover preview, dynamic label, success animation on submit.

---

## 2026-06-07 — Watch-course page overhaul (header, rail, video, autoplay)

User flagged that the lecture page (`/courses/:slug/lecture/:courseId`) had three real problems left:

1. **Lecture header was invisible / fake data**:
   - `LectureHeader.tsx` was `bg-white` (invisible on the dark editorial background), used `rc-progress` + react-icons, and showed a **fake** progress `completed: Math.round(total/2)` that always reported "halfway".
   - Rewrote the whole component:
     - Editorial chrome (`bg-bg-base/85 backdrop-blur-xl`), sticky top, line-subtle bottom border.
     - Lucide icons throughout (ChevronLeft, Trophy, Share2, Star, ChevronDown).
     - **Real progress**: `completedLessons.length / totalLessons` derived from the lecture course state. Animated SVG ring + thin under-header progress strip, both switch from clay → signal-success when 100%.
     - Click the pill to open a popover showing `N of M complete` with the same color-coded bar; when complete, the copy links to `/certificates`.
     - Removed the legacy `onWindowSize` prop logic in favor of Tailwind responsive breakpoints (`hidden sm:` / `hidden md:` / `hidden lg:`).
2. **Video didn't change when a lesson was selected**:
   - Root cause: `state.course.videoId` was set ONCE from `modules[0].lessons[0].url` (`courseSlice.ts:117`), and selecting another lesson didn't update it. `VideoSection` only read from that single Redux value.
   - Fix: `VideoSection` now accepts a `videoId?: string` prop. `LectureCourse` passes `currentLesson?.url` directly. Falls back to the Redux value for older callers.
   - Also added a `extractYouTubeId()` helper so the field can be either a raw id, a `watch?v=...` URL, a `youtu.be/...` short URL, or an `/embed/...` embed URL.
   - Added `key={id}` on `<YouTube>` so the player remounts cleanly when switching videos (avoids stale state in the iframe).
3. **Autoplay**:
   - Added `playerVars: { autoplay: 1, rel: 0 }` to the YT player. The first lesson may require a user click due to browser autoplay policies, but every subsequent lesson change (manual nav OR auto-advance on `onEnded`) will start playing immediately.
4. **CurriculumDotRail still blocking the Next button** (follow-up to the earlier `w-16 → w-4` fix):
   - The OUTER wrapper was `fixed right-0 top-0 bottom-0 flex items-center` which sized to its dot column (~48px) AND caught `onMouseEnter` over its entire footprint. Even though the dots were narrow, the wrapper's bounding box still blocked clicks on the Next button when the lecture content overflowed into that strip.
   - Fix: outer wrapper is now `pointer-events-none`. Only three children opt back in: (a) a 6px sliver at the absolute viewport edge (`absolute right-0 w-1.5 pointer-events-auto`) that triggers expansion on hover, (b) the dot column itself (clickable + keeps panel open while hovered), (c) the expanded panel when visible. Net result: the Next button is fully clickable; the rail is only "armed" when the cursor reaches the actual viewport edge.

- **Files**: `src/components/Lecture Course/LectureHeader.tsx`, `src/components/Lecture Course/VideoSection.tsx`, `src/pages/Main Course/LectureCourse.tsx`, `src/features/lecture/CurriculumDotRail.tsx`
- **Verify**:
  - Open any lecture → header shows a clay progress ring matching `state.course.lectureCourse.course.completedLessons.length`. Click pill → popover with real numbers.
  - Click a different lesson in the rail → video changes AND auto-plays.
  - Watch a video to the end → next lesson loads and auto-plays.
  - Hover near (but not at) the right edge → rail stays collapsed. Click Next button at the right edge of the content area → it works.
  - Move cursor to the absolute right edge → rail expands.

---

## 2026-06-07 — Six pre-Phase-5 fixes

User flagged six gaps after the Phase 4 wrap:

1. **Video auto-advance** — `VideoSection.tsx` was ignoring YT player end events (all handlers commented out). Added `onEnded?: () => void` prop wired through `onStateChange` (state 0 = ENDED). `LectureCourse.tsx` passes `() => setActiveLessonIdx(i => min(i+1, last))`. End-of-video now loads the next lesson.
2. **Narrowed CurriculumDotRail hover catch** — was `w-16` (64px), overlapping the Next button. Now `w-4` (16px) at the actual edge.
3. **Nav entries for Search + Certificates** — added `Search` to `PRIMARY_LINKS` (public) and `Certificates` to `SECONDARY_LINKS` (auth-only) in `MenuOverlay.tsx`.
4. **Search filters to active + published only** — Atlas `$search` bypasses Mongoose pre-find middleware, so soft-deleted and draft courses leaked. Added `$match` stage in `searchController.ts`.
5. **URL ↔ filter pill two-way sync** — was one-way (URL → state). Added state → URL with a `skipNextUrlSyncRef` to avoid loops. Removing the Category chip now clears `?category=...` from the URL; refresh resurrects the right state.
6. **Completed-lesson UI in CurriculumDotRail** — added `completedIds` prop. Collapsed dots get a half-clay tint when completed; expanded panel shows Check icon + clay ring instead of lesson number, title tints to ink-tertiary. Header shows "N of M · K done".

- **Files**: `src/components/Lecture Course/VideoSection.tsx`, `src/pages/Main Course/LectureCourse.tsx`, `src/features/lecture/CurriculumDotRail.tsx`, `src/widgets/LayoutHeader/MenuOverlay.tsx`, `src/pages/Courses/Course.tsx`, plus `Building Safety Project/src/Controllers/searchController.ts`.
- **Verify**:
  - Watch a YT lesson to the end → next lesson loads.
  - Hover the right viewport edge → rail expands. Hover the Next button → rail stays closed.
  - Hamburger menu → Search + Certificates both visible.
  - `/search?q=draftCourseSlug` → no match.
  - `/courses?category=X` → click X on the chip → URL becomes `/courses`.
  - Lecture rail shows Check icons on completed lessons.

---

## 2026-06-07 — Legacy v0-token cleanup (high-impact surfaces)

- **What**: Rewrote 3 of the ~18 audit-flagged files: `NotificationBell.tsx` (header bell + dropdown), `FaqAccordion.tsx` (FAQ page), `TabContainer.tsx` (lecture page tab chrome). All three now use editorial tokens, Lucide icons, mono caps section headers, clay accents. NotificationBell also fixed the unread badge's a11y label.
- **Why**: Audit flagged ~18 files using legacy v0 tokens. The three rewritten are the highest-traffic. Remaining files are mostly dead code (old Home/Course components replaced by `features/`) or low-visibility surfaces — cleanup deferred to incremental work.
- **Files**: `src/components/shared/NotificationBell.tsx`, `src/components/Faq/FaqAccordion.tsx`, `src/components/shared/TabContainer.tsx`
- **Verify**: Bell in the header now uses Lucide + editorial styling. FAQ page accordions tint clay on open. Lecture tabs use line-subtle borders.

---

## 2026-06-07 — Search results page (`/search?q=...`)

- **What**: Built `src/redux/api/searchApi.ts` + `src/pages/Search/Search.tsx`. Reads `?q=...` from URL, debounces typing (350ms), syncs the URL back as the user edits (bookmarkable), groups results into Courses + Articles sections. Handles loading/error/empty/prompt states. Registered as a public route.
- **Why**: Audit flagged "no dedicated search results page — autocomplete only".
- **Files**: `src/redux/api/searchApi.ts` (new), `src/pages/Search/Search.tsx` (new), `src/Routes.tsx`
- **Verify**: Visit `/search?q=safety`. Pre-filled query, results loading, two sections.

---

## 2026-06-07 — Course resume in LectureCourse

- **What**: Backend `getLectureCourse` now returns `completedLessons: string[]` alongside the course payload. `LectureCourse.tsx` reads it, computes the first non-completed lesson, and `setActiveLessonIdx` there on initial load (once per course-load via a key'd ref so manual nav is respected).
- **Why**: Audit flagged "course-resume — progress is tracked but not used".
- **Files**: `Building Safety Project/src/Controllers/courseController.ts`, `src/pages/Main Course/LectureCourse.tsx`
- **Verify**: Complete lesson 2, navigate away, return — should land on lesson 3.

---

## 2026-06-07 — Certificate viewing UI (My Certificates + single printable certificate)

- **What**:
  - Backend `GET /api/v1/certificates/me` returns the auth'd user's certificates with `courseId` populated (title, slug, imageCover, instructors.userId.name).
  - Frontend API: `getMyCertificatesApi()` + `getCertificateApi(id)`.
  - `MyCertificates.tsx` at `/certificates` — editorial grid with awarded-date stamps. Empty / error / loading states.
  - `Certificate.tsx` at `/certificates/:id` — printable A4-landscape certificate (cream paper-tone with sienna/clay radial wash, italic Fraunces user name, instructor signature row, sealed mark, certificate number derived from `_id`). `Print` button hidden in print via `print:hidden`.
  - "Certificates" quick-link card added to the Profile overview.
  - Both routes registered as protected.
- **Why**: Audit flagged "certificate viewing UI missing — backend modeled, no user-facing view".
- **Files**: `Building Safety Project/src/Controllers/certificateController.ts`, `Building Safety Project/src/Routes/certificateRoutes.ts`, `src/redux/api/certificateApi.ts` (new), `src/pages/Certificates/MyCertificates.tsx` (new), `src/pages/Certificates/Certificate.tsx` (new), `src/Routes.tsx`, `src/pages/Profile/ProfileSettings.tsx`
- **Verify**: After completing a course, visit `/certificates`. Open one — Print produces the certificate alone.

---

## 2026-06-07 — Confirmation dialogs on destructive actions

- **What**:
  - Built `src/components/shared/ConfirmDialog.tsx` — portal-based dialog with ESC-to-cancel, backdrop-click cancel, focus moves to confirm button on open, focus restored on close, body scroll lock. Supports `tone='danger'`.
  - Wired into `Wishlist.tsx` (remove from collection) and `NotificationsPage.tsx` (dismiss notification).
  - Exported via `components/shared` barrel.
- **Why**: Audit flagged "no confirmation dialogs on destructive actions". NOT added to the courses-listing heart toggle — speed matters more than friction in that context.
- **Files**: `src/components/shared/ConfirmDialog.tsx` (new), `src/components/shared/index.tsx`, `src/pages/Wishlist/Wishlist.tsx`, `src/pages/Notifications/NotificationsPage.tsx`
- **Verify**: Click the heart on a wishlist card → dialog appears. ESC cancels, [Enter] confirms. Focus returns to trigger after close.

---

## 2026-06-07 — Memoized hot list components (BlogCard, InstructorPortraitCard, NotificationListItem)

- **What**: Wrapped three list-row components in `React.memo` (CourseCard was already memoized — audit was wrong on that). NotificationListItem also got a full editorial-token rewrite (was `bg-primary-color/5`, `text-secondary-dark`, `text-gray-*`, `bg-white`, FontAwesome trash) → editorial tokens + Lucide Trash2. Added explicit unread dot indicator + `aria-current='true'` to fix the audit's color-only-signaling finding.
- **Why**: Listing pages were re-rendering all items on any unrelated state change. Memo + stable selectors avoid wasted reconciliation work.
- **Files**: `src/features/blog/BlogCard.tsx`, `src/features/instructor/InstructorPortraitCard.tsx`, `src/components/Notifications/NotificationListItem.tsx`
- **Verify**: React DevTools profiler — open Courses page, change an unrelated state, list rows should not show as re-renders.

---

## 2026-06-07 — Error states + retry on SingleCourse, SingleBlog

- **What**:
  - Added `RESET_SINGLE_COURSE` / `RESET_SINGLE_BLOG` constants and reducer cases (clear data + error, no FAIL signal).
  - Fixed `getSingleCourseAction` and `getSingleBlogAction` — both were pre-dispatching `*_FAIL` at start of every load (which incorrectly signaled failure during loading) AND had their real catch FAIL dispatches commented out (genuinely silent failures except for a toast). Now they dispatch RESET upfront and FAIL with the error in the catch.
  - Reducers clear `*Error` on SUCCESS and store the error message on FAIL.
  - `SingleCourse.tsx` and `SingleBlog.tsx` now render an editorial "We couldn't load …" screen with **Try again** + **Browse / Back to archive** CTAs when the relevant error is present.
  - Pre-existing typo fix: `useDispatch(;` → `useDispatch();` in `Course.tsx` + escaped apostrophe.
- **Why**: Audit flagged "no error states on detail-page fetch failures — SingleCourse and SingleBlog show the loader forever if the API errors".
- **Files**: `src/redux/{constants,actions,reducers}/{course,blog}*`, `src/pages/Single Course/SingleCourse.tsx`, `src/pages/Single Blog/SingleBlog.tsx`, `src/pages/Courses/Course.tsx`
- **Verify**: Navigate to `/courses/this-does-not-exist`. Error screen appears with two CTAs; "Try again" re-fires the action.

---

## 2026-06-06 — Sentry error tracking + ErrorBoundary

- **What**:
  - Installed `@sentry/react`.
  - Created `src/lib/sentry.ts` — `initSentry()` no-op when `VITE_SENTRY_DSN` is empty so dev works zero-config. Includes browser tracing + replay (replay on error only).
  - Wired `initSentry()` into `src/App/main.tsx` BEFORE the React tree renders.
  - Wrapped the entire app in `<Sentry.ErrorBoundary>` with an editorial-style fallback ("Something broke / An unexpected error occurred." + "Try again" + "Go home" CTAs). Render-time crashes now produce a branded screen instead of a blank page, AND get sent to Sentry.
  - Created `.env.example` documenting `VITE_SENTRY_DSN`.
- **Why**: Audit flagged "no error tracking" — render-time crashes were silent. The ErrorBoundary fallback doubles as the missing-error-state for the whole app.
- **Files**: `src/lib/sentry.ts` (new), `src/App/main.tsx`, `.env.example` (new), `package.json`
- **Verify**: Set `VITE_SENTRY_DSN` in `.env.local`, throw in any component render — the editorial error screen appears AND the error lands in Sentry.

---

## 2026-06-06 — CI workflow (`.github/workflows/ci.yml`)

- **What**: Added `.github/workflows/ci.yml` running `npm ci → typecheck → lint → build` on every PR + push to main. Added `typecheck` script to `package.json` (matches the backend).
- **Why**: Audit flagged "no CI/CD pipeline". Frontend lint + tsc were already manual.
- **Files**: `.github/workflows/ci.yml`, `package.json`
- **Verify**: Push branch, open PR — CI run appears under Actions tab.

---

## 2026-06-06 — Bundle visualizer (`rollup-plugin-visualizer`)

- **What**: Installed `rollup-plugin-visualizer` (dev dep) and wired it into `vite.config.ts`. Every `npm run build` now writes a treemap to `dist/stats.html` with gzip + brotli sizes.
- **Why**: Audit flagged "no bundle analyzer — bundle size is a black box". Open `dist/stats.html` after a production build to see exactly which deps eat the bundle. Baseline for the legacy-token cleanup + lazy-loading work in later phases.
- **Files**: `vite.config.ts`, `package.json`
- **Verify**: `npm run build && open dist/stats.html` shows the treemap.

---

## 2026-06-06 — LectureCourse error state + fixed broken FAIL dispatch

- **What**:
  - Fixed `GET_LECTURE_COURSE_FAIL` reducer ([courseSlice.ts:110-115](src/redux/reducers/courseSlice.ts#L110)) — was setting `loading: true` on FAIL (wrong direction), and the matching action ([courseAction.ts:154-161](src/redux/actions/courseAction.ts#L154)) had its FAIL dispatch commented out. Now the reducer stores the error message on `state.course.courseError` and clears it on SUCCESS.
  - Added a proper "Locked" empty state to [LectureCourse.tsx](src/pages/Main%20Course/LectureCourse.tsx) — displayed when the backend rejects with "Register for course to get access" (403). Editorial layout with "View the course" + "My learning" CTAs; matches the NotFound design language.
- **Why**: Previously, an unauthorized lecture URL just showed the loading spinner forever because the FAIL action was commented out and `lectureCourse?.course?._id` was never set. Users had no feedback. The audit flagged this as "no error state on detail-page fetch failures".
- **Files**: `src/redux/reducers/courseSlice.ts`, `src/redux/actions/courseAction.ts`, `src/pages/Main Course/LectureCourse.tsx`
- **Verify**: Navigate to `/courses/anything/lecture/<courseId-you're-not-enrolled-in>`. Should now show the "Locked" screen with the two CTAs, not an infinite spinner.

---

## 2026-06-05 — Documentation scaffolding

- **What**: Created `docs/CHANGES.md` (this file).
- **Why**: Source of truth for "what shipped" during the optimization pass so the work is auditable.
- **Files**: `docs/CHANGES.md`
- **Verify**: File exists and is populated.
