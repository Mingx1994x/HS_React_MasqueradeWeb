import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

export default function FrontLayout() {
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
