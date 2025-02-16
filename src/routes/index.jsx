import AdminLayout from '../layout/AdminLayout';
import FrontLayout from '../layout/FrontLayout';
import AdminProducts from '../pages/AdminProducts';
import Login from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import Products from '../pages/Products';
import Carts from '../pages/Carts';
import ProductDetail from '../pages/ProductDetail';
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
        path: ':id',
        element: <ProductDetail />,
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
