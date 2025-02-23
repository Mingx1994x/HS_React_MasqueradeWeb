import { Outlet, useLocation } from 'react-router';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';

export default function FrontLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    console.log(pathname);

    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-10">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
