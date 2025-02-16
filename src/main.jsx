// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router';
import routes from './routes';
import LoginStatusProvider from './context/LoginContext';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/all.scss';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <LoginStatusProvider>
    <RouterProvider router={router} />
  </LoginStatusProvider>
  // </StrictMode>
);
