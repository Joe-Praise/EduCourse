import ReactDOM from 'react-dom/client';
import '../styles/index.css';
import AppContainer from './AppContainer.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store.ts';
import NotificationProvider from './NotificationProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	<Provider store={store}>
		<NotificationProvider>
			{/* <Toastify /> */}
			<BrowserRouter>
				<AppContainer />
			</BrowserRouter>
		</NotificationProvider>
	</Provider>
	// </React.StrictMode>
);
