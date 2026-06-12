import ReactDOM from 'react-dom/client';
import '../styles/index.css';
import AppContainer from './AppContainer.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store.ts';
import { initSentry, Sentry } from '../lib/sentry';

// Initialise Sentry before anything renders — a render-time crash should
// still get captured. No-ops in dev unless VITE_SENTRY_DSN is set.
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	<Sentry.ErrorBoundary
		fallback={({ resetError }) => (
			<div className='min-h-svh grid place-items-center bg-bg-base px-6 text-center'>
				<div className='max-w-md flex flex-col items-center gap-5'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						Something broke
					</span>
					<h1
						className='font-display font-semibold text-3xl sm:text-4xl text-ink-primary tracking-[-0.03em]'
						style={{ fontVariationSettings: '"opsz" 96' }}
					>
						An unexpected error occurred.
					</h1>
					<p className='font-body text-sm text-ink-secondary'>
						We&apos;ve been notified. Try refreshing the page, or head back home.
					</p>
					<div className='flex gap-3 mt-2'>
						<button
							type='button'
							onClick={resetError}
							className='inline-flex items-center h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Try again
						</button>
						<a
							href='/'
							className='inline-flex items-center h-11 px-5 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Go home
						</a>
					</div>
				</div>
			</div>
		)}
	>
		<Provider store={store}>
			<BrowserRouter>
				<AppContainer />
			</BrowserRouter>
		</Provider>
	</Sentry.ErrorBoundary>
	// </React.StrictMode>
);
