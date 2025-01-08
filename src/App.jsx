import { useState } from 'react'
import axios from 'axios';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
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
    <>
      <div className='container'>
        <div className="row">
          <div className="col-md-8">
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
            <h1>Vite + React</h1>
            <div className="card">
              <button className='btn btn-warning' onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>

          </div>
        </div>
      </div>
    </>
  )
}

export default App
