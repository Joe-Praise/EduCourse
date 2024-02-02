import ReactDOM from 'react-dom/client';
import '../styles/index.css';
import AppContainer from './AppContainer.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// import createAppStore from '../redux/store.ts';
// import { store } from '@/store/store.ts';
import { store } from '../redux/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	<Provider store={store}>
		<BrowserRouter>
			<AppContainer />
		</BrowserRouter>
	</Provider>
	// </React.StrictMode>
);
