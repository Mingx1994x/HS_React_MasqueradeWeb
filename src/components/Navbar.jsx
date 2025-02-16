import { NavLink } from 'react-router';
import { LoginStatus } from '../context/LoginContext';
import { useContext } from 'react';

const navRoutes = [
  {
    title: '商城',
    path: '/',
  },
  {
    title: '購物車',
    path: '/shoppingCart',
  },
];

const Navbar = () => {
  const { isLogin } = useContext(LoginStatus);
  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Masquerade
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav w-100 mb-2 mb-lg-0">
            {navRoutes.map((route, index) => (
              <li className="nav-item" key={index}>
                <NavLink className="nav-link" to={route.path}>
                  {route.title}
                </NavLink>
              </li>
            ))}
            {isLogin ? (
              <li className="nav-item ms-lg-auto">
                <NavLink className="adminNav nav-link" to="/admin">
                  管理者頁面
                </NavLink>
              </li>
            ) : (
              <li className="nav-item ms-lg-auto">
                <NavLink className="nav-link" to="/login">
                  管理者登入
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
