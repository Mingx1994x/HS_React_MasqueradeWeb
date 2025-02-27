import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import axios from 'axios';

import Navbar from '../components/Navbar';
import { LoginStatus } from '../context/LoginContext';

const { VITE_APP_BaseUrl } = import.meta.env;

export default function AdminLayout() {
  const { isLogin, setIsLogin } = useContext(LoginStatus);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin) {
      let hexToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)HexToken\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
      );
      if (hexToken) {
        axios.defaults.headers.common['Authorization'] = hexToken;
        (async () => {
          try {
            await axios.post(`${VITE_APP_BaseUrl}/api/user/check`);
            setIsLogin(true);
          } catch (error) {
            alert('請先登入唷');
            navigate('/login');
          }
        })();
      }
    }
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
