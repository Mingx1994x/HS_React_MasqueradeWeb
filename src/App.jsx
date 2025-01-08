import { useState } from 'react'
import axios from 'axios';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [isLogin, setLogin] = useState(false);
  const [count, setCount] = useState(0);
  const baseUrl = 'https://ec-course-api.hexschool.io';
  const api = 'yameow2024';
  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${api}/products/all`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  getData();

  return (
    <div className='container'>
      {isLogin ? (
        <p>後台頁面</p>
      ) :
        (
          <div className="loginPhase">
            <div className="row">
              <div className="col-md-6 col-lg-8">
                <form className='card'>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Email</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
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
