import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { LoginStatus } from '../context/LoginContext';

const { VITE_APP_BaseUrl } = import.meta.env;

const Login = () => {
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });

  const { isLogin, setIsLogin } = useContext(LoginStatus);
  const navigate = useNavigate();

  const signin = async () => {
    if (!account.username || !account.password) {
      alert('欄位請輸入信箱與密碼喲');
      return;
    }
    try {
      const res = await axios.post(`${VITE_APP_BaseUrl}/admin/signin`, account);
      document.cookie = `HexToken=${res.data.token}; expires=${new Date(
        res.data.expired
      )}`;
      setAccount({
        username: '',
        password: '',
      });
      axios.defaults.headers.common['Authorization'] = res.data.token;
      setIsLogin(true);
      navigate('/admin');
    } catch (error) {
      alert(error.response.data.error.message);
    }
  };

  const accountInputHandler = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isLogin) {
      navigate('/admin');
    }
  }, [isLogin]);

  return (
    <div className="loginPhase">
      <div className="row">
        <div className="col-md-6 col-lg-8">
          <form
            className="card"
            onSubmit={(e) => {
              e.preventDefault();
              signin();
            }}
          >
            <div className="card-body">
              <div className="mb-3">
                <div className="form-floating">
                  <input
                    type="email"
                    name="username"
                    className="form-control"
                    id="floatingInput"
                    value={account?.username}
                    placeholder="name@example.com"
                    onChange={accountInputHandler}
                  />
                  <label htmlFor="floatingInput">Email</label>
                </div>
              </div>

              <div className="mb-3">
                <div className="form-floating">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="floatingPassword"
                    value={account?.password}
                    placeholder="Password"
                    onChange={accountInputHandler}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
              </div>
              <div className="d-flex mb-3">
                <button className="btn btn-primary mx-auto">登入</button>
              </div>
              <p className="text-center text-secondary">
                &copy; 2025~∞ - 六角學院
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
