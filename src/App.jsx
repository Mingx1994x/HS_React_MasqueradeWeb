import { useState } from 'react'
import axios from 'axios';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [account, setAccount] = useState(
    {
      username: "",
      password: ""
    }
  );
  const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
  const getData = async () => {
    try {
      const res = await axios.get(`${VITE_APP_BaseUrl}/v2/api/${VITE_APP_API}/products/all`);
      console.log(res);
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  const signin = async () => {

    try {
      const res = await axios.post(`${VITE_APP_BaseUrl}/v2/admin/signin`, account)
      console.log(res);
      setAccount({
        username: '',
        password: ''
      })
      setIsLogin(true);

    } catch (error) {
      alert(error.response.data.message)
    }
  }

  const inputHandler = (name, value) => {
    setAccount({
      ...account,
      [name]: value
    })

    // console.log(account)
  }

  return (
    <div className='container'>
      {isLogin ? (
        <p>後台頁面</p>
      ) :
        (
          <div className="loginPhase">
            <div className="row">
              <div className="col-md-6 col-lg-8">
                <form className='card' onSubmit={(e) => {
                  e.preventDefault();
                  signin()
                }}>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="form-floating">
                        <input type="email" name='username' className="form-control" id="floatingInput"
                          value={account?.username}
                          placeholder="name@example.com" onChange={(e) => {
                            inputHandler(e.target.name, e.target.value)
                          }} />
                        <label htmlFor="floatingInput">Email</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input type="password" name='password' className="form-control" id="floatingPassword"
                          value={account?.password}
                          placeholder="Password" onChange={(e) => {
                            inputHandler(e.target.name, e.target.value)
                          }} />
                        <label htmlFor="floatingPassword">Password</label>
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <button className='btn btn-primary mx-auto'>登入</button>
                    </div>
                    <p className="text-center text-secondary">HexSchool</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default App
