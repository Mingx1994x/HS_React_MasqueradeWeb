import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/all.scss';
import { RouterProvider, createHashRouter } from 'react-router';
import routes from './routes';
const router = createHashRouter(routes);
// import App from './AppW2.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
);
