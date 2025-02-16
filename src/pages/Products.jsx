import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { Modal } from 'bootstrap';

import ProductCard from '../components/ProductCard';
import ProductCardModal from '../components/ProductCardModal';
import FullScreenLoading from '../components/FullScreenLoading';

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
const customerUrl = `${VITE_APP_BaseUrl}/api/${VITE_APP_API}`;

function Products() {
  const [products, setProducts] = useState([]);
  let defaultData = {
    category: '',
    content: '',
    description: '',
    id: '',
    is_enabled: '',
    origin_price: '',
    price: '',
    title: '',
    unit: '',
    num: '',
    imageUrl: '',
    imagesUrl: [],
  };
  const [tempProduct, setTempProduct] = useState(defaultData);
  const [selectState, setSelectState] = useState('');
  const [productsCategory, setProductsCategory] = useState([]);
  const [fullScreenLoadingState, setFullScreenLoadingState] = useState(false);

  //取得全部產品列表資料
  const getProductsAll = async () => {
    try {
      const res = await axios.get(`${customerUrl}/products/all`);
      setProducts(res.data.products);
      getCategory(res.data.products);
    } catch (error) {
      alert('系統出現問題，請洽管理人員');
    }
  };

  const getCategory = (products) => {
    let categories = [];
    products.forEach((product) => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    setProductsCategory(categories);
  };

  //取得特定產品列表資料
  const getProducts = async (category) => {
    try {
      const res = await axios.get(
        `${customerUrl}/products?category=${category}`
      );
      setProducts(res.data.products);
    } catch (error) {
      alert('系統出現問題，請洽管理人員');
    }
  };

  //新增購物車
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
    if (selectState === '') {
      getProductsAll();
    } else {
      getProducts(selectState);
    }
  }, [selectState]);

  return (
    <>
      <section className="section productDisplay">
        <h2 className="section-title text-center">商品列表</h2>
        <div className="my-2 row">
          <div className="col-md-3">
            <select
              name="selectCategory"
              className="form-select"
              value={selectState}
              onChange={(e) => setSelectState(e.target.value)}
            >
              <option value="">全部</option>
              {productsCategory.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ul className="row row-cols-2 row-cols-lg-3 g-2 g-lg-3">
          {products.map((product) => (
            <li className="col" key={product.id}>
              <ProductCard product={product} addCarts={addCarts} />
            </li>
          ))}
        </ul>
      </section>
      {fullScreenLoadingState && <FullScreenLoading />}
    </>
  );
}

export default Products;
