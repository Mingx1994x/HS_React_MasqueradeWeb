import { useState } from 'react'
import axios from 'axios';

import Login from './LoginPage';

function AppW2() {
  const [isLogin, setIsLogin] = useState(false);
  const [account, setAccount] = useState(
    {
      username: "",
      password: ""
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${VITE_APP_BaseUrl}/v2/api/${VITE_APP_API}/admin/products/all`);
      setProducts(Object.values(res.data.products));
    } catch (error) {
      alert(error?.response.data.message ? `${error?.response.data.message}\n煩請洽管理人員` : "系統忙線中，請洽管理人員");
    }
  }

  const initProductsData = () => {
    setProducts(null);
    setTempProduct(null);
  }

  const signin = async () => {
    if (!account.username || !account.password) return
    try {
      const res = await axios.post(`${VITE_APP_BaseUrl}/v2/admin/signin`, account)
      document.cookie = `HexToken=${res.data.token}; expires=${new Date(res.data.expired)}`;
      axios.defaults.headers.common['Authorization'] = res.data.token;
      setAccount({
        username: '',
        password: ''
      })
      getProductsData()
      setIsLogin(true);

    } catch (error) {
      alert(error.response.data.error.message)
    }
  }

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value
    })
  }

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${VITE_APP_BaseUrl}/v2/logout`);
      document.cookie = "HexToken='';"
      setIsLoading(false);
      setIsLogin(false);
      initProductsData();
    } catch (error) {
      alert(`${error.response.data.message}\n煩請洽管理人員`)
    }
  }

  const checkStatus = async () => {
    setIsLoading(true);
    let hexToken = document.cookie.replace(/(?:(?:^|.*;\s*)HexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
    try {
      await axios.post(`${VITE_APP_BaseUrl}/v2/api/user/check`, {}, {
        headers: {
          authorization: hexToken
        }
      });
      setIsLoading(false);
      alert('目前已登入了唷！')
    } catch (error) {
      alert("系統忙碌中，請重新登入");
      logout();
    }
  }

  return (
    <div className='container'>
      {isLogin ? (
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="d-flex mb-3">
              <h2>產品列表</h2>
              <div className="d-flex ms-auto">
                <button type="button" className='btn btn-success me-2' onClick={checkStatus} disabled={isLoading}>登入狀態</button>
                <button type="button" className='btn btn-danger me-2' onClick={logout} disabled={isLoading}>登出</button>
              </div>
            </div>
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
          <Login account={account} login={signin} inputHandler={inputHandler} />
        )
      }
    </div>
  )
}

export default AppW2
