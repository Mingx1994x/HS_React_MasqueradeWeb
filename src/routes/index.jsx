import AdminLayout from '../layout/AdminLayout';
import FrontLayout from '../layout/FrontLayout';
import AdminProducts from '../pages/AdminProducts';
import Login from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import Products from '../pages/Products';
import Carts from '../pages/Carts';
const routes = [
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      {
        index: true,
        element: <Products />,
      },
      {
        path: 'shoppingCart',
        element: <Carts />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminProducts />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
