import { Outlet, useNavigate } from 'react-router';

import Navbar from '../components/Navbar';

export default function AdminLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
