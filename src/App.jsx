import { useEffect, useState } from 'react'
import axios from 'axios';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [account, setAccount] = useState(
    {
      username: "",
      password: ""
    }
  );
  const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const getData = async () => {
    try {
      const res = await axios.get(`${VITE_APP_BaseUrl}/v2/api/${VITE_APP_API}/products/all`);
      setProducts([
        ...products,
        ...res.data.products
      ]);
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  const signin = async () => {
    if (!account) return
    try {
      const res = await axios.post(`${VITE_APP_BaseUrl}/v2/admin/signin`, account)
      // console.log(res);
      setAccount({
        username: '',
        password: ''
      })
      setIsLogin(true);
      getData();
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  const inputHandler = (name, value) => {
    setAccount({
      ...account,
      [name]: value
    })
  }

  return (
    <div className='container'>
      {isLogin ? (
        <div className="row mt-5">
          <div className="col-md-6">
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr className='table-secondary'>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>查看細節</th>
                </tr>
              </thead>
              <tbody>
                {
                  products?.map(product =>
                  (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? "是" : "否"}</td>
                      <td><button type="button" className={tempProduct?.id === product.id ? 'btn btn-primary-700' : 'btn btn-primary'} onClick={() => {
                        setTempProduct(product)
                      }}>查看細節</button></td>
                    </tr>
                  )
                  )
                }
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h2>單一產品細節</h2>
            {
              tempProduct ?
                (
                  <div className="singleProduct card mb-3">
                    <img src={tempProduct.imageUrl} className='card-img-top primary-image' alt="main images" />
                    <div className="card-body">
                      <h5 className="card-title">
                        {tempProduct.title} <span className="badge bg-primary ms-2">{tempProduct.category}</span>
                      </h5>
                      <p className="card-text">商品描述：{tempProduct.description}</p>
                      <p className="card-text">商品{tempProduct.content}</p>
                      <div className="d-flex">
                        <p className="card-text">
                          商品價格：<del>{tempProduct.origin_price}</del>元 / {tempProduct.price}元
                        </p>
                      </div>
                      <h5 className="mt-3">其他類似商品：</h5>
                      <div className="d-flex flex-wrap">
                        {tempProduct?.imagesUrl ? tempProduct.imagesUrl.map((url, index) => (<img className='otherImages' src={url} key={index} alt="other images" />)) : <p>倉庫找不到啦！</p>}
                      </div>
                    </div>
                  </div>
                )
                : (<p className="text-secondary">請選擇一個商品</p>)
            }
          </div>
        </div>
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
                    <p className="text-center text-secondary">&copy; 2025~∞ - 六角學院</p>
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
