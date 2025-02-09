import { NavLink } from "react-router";

const navRoutes = [
  {
    title: "首頁",
    path: "/",
  },
  {
    title: "管理者登入",
    path: "/admin",
  },
];
const Navbar = () => {
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
              <li
                className={`nav-item ${
                  route.title === "管理者登入" ? "ms-auto" : ""
                }`}
                key={index}
              >
                <NavLink className="nav-link" to={route.path}>
                  {route.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
