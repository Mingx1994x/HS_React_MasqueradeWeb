import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import FullScreenLoading from '../components/FullScreenLoading';

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
const customerUrl = `${VITE_APP_BaseUrl}/api/${VITE_APP_API}`;

const ProductDetail = () => {
  const [fullScreenLoadingState, setFullScreenLoadingState] = useState(false);
  const [tempProduct, setTempProduct] = useState(null);
  const [tempQty, setTempQty] = useState(1);
  const { id } = useParams();

  const addCarts = async (product_id, qty = 1) => {
    setFullScreenLoadingState(true);
    try {
      const res = await axios.post(`${customerUrl}/cart`, {
        data: {
          product_id,
          qty,
        },
      });
      alert(res.data.message);
    } catch (error) {
      alert('系統出現問題，請洽管理人員');
    } finally {
      setFullScreenLoadingState(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${customerUrl}/product/${id}`);
        setTempProduct(res.data.product);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <section className="section productDetail">
      <h2 className="section-title text-center mb-4">商品細節</h2>
      <div className="row">
        <div className="div">
          <Link to="/" className="btn btn-outline-primary ">
            <i className="bi bi-arrow-left"></i>返回
          </Link>
        </div>
        <div className="col-6">
          <img className="img-fluid" src={tempProduct?.imageUrl} alt="" />
          {tempProduct?.imagesUrl && (
            <>
              <h4>其他類似商品</h4>
              <div className="d-flex">
                <div>
                  {tempProduct.imagesUrl.map((image) => (
                    <img
                      className="object-fit-cover"
                      style={{
                        height: '150px',
                      }}
                      src={image}
                      alt=""
                      key={image}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="col-6">
          <h3>{tempProduct?.title}</h3>
          <p className="mt-3">{`商品類別：${tempProduct?.category}`}</p>
          <p className="mt-3">{`商品${tempProduct?.content}`}</p>
          <p className="mt-3">{`商品描述：${tempProduct?.description}`}</p>
          <p className="mt-3">{`商品原價：${tempProduct?.origin_price}`}</p>
          <p className="mt-3 text-danger">{`搶購特價：${tempProduct?.price}`}</p>
          <div className="d-flex align-items-center mt-3">
            購買數量：
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary ms-3"
              disabled={tempQty === 1 ? true : false}
              onClick={() => {
                setTempQty(tempQty - 1);
              }}
            >
              <i className="bi bi-dash fs-5"></i>
            </button>
            <span className="mx-2">{tempQty}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning"
              onClick={() => {
                setTempQty(tempQty + 1);
              }}
            >
              <i className="bi bi-plus fs-5"></i>
            </button>
            <button
              type="button"
              className="btn btn-danger ms-auto"
              onClick={() => {
                addCarts(id, tempQty);
              }}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
      {fullScreenLoadingState && <FullScreenLoading />}
    </section>
  );
};

export default ProductDetail;
