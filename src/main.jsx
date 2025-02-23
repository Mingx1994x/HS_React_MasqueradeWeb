// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router';
import routes from './routes';
import LoginStatusProvider from './context/LoginContext';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/all.scss';
import { Provider } from 'react-redux';
import { store } from './store';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <LoginStatusProvider>
      <RouterProvider router={router} />
    </LoginStatusProvider>
  </Provider>
  // </StrictMode>
);
