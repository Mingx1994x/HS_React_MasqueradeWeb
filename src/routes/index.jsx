import AdminLayout from "../layout/AdminLayout";
import FrontLayout from "../layout/FrontLayout";
import AdminProducts from "../pages/AdminProducts";
import Products from "../pages/Products";

const routes = [
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        index: true,
        element: <Products />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminProducts />,
      },
    ],
  },
];

export default routes;
