import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { Modal } from "bootstrap";

import ProductCard from "../components/ProductCard";
import ProductCardModal from "../components/ProductCardModal";
import DeleteModal from "../components/DeleteModal";
import OrderForm from "../components/orderForm";
import ShoppingCart from "../components/ShoppingCart";
import FullScreenLoading from "../components/FullScreenLoading";

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
const customerUrl = `${VITE_APP_BaseUrl}/api/${VITE_APP_API}`;

function Products() {
  const [products, setProducts] = useState([]);
  let defaultData = {
    category: "",
    content: "",
    description: "",
    id: "",
    is_enabled: "",
    origin_price: "",
    price: "",
    title: "",
    unit: "",
    num: "",
    imageUrl: "",
    imagesUrl: [],
  };
  const [tempProduct, setTempProduct] = useState(defaultData);
  const [tempCart, setTempCart] = useState(null);
  const [cartsData, setCartsData] = useState({});
  const [cartStatus, setCartStatus] = useState(false);
  const [selectState, setSelectState] = useState("");
  const [productsCategory, setProductsCategory] = useState([]);
  const [fullScreenLoadingState, setFullScreenLoadingState] = useState(false);
  const [listLoadingState, setListLoadingState] = useState([]);

  //取得全部產品列表資料
  const getProductsAll = async () => {
    try {
      const res = await axios.get(`${customerUrl}/products/all`);
      setProducts(res.data.products);
      getCategory(res.data.products);
    } catch (error) {
      alert("系統出現問題，請洽管理人員");
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
      alert("系統出現問題，請洽管理人員");
    }
  };

  //取得購物車資料
  const getCarts = async () => {
    try {
      const res = await axios.get(`${customerUrl}/cart`);
      setCartsData(res.data.data);
    } catch (error) {
      alert("系統出現問題，請洽管理人員");
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
      getCarts();
    } catch (error) {
      alert("系統出現問題，請洽管理人員");
    } finally {
      setFullScreenLoadingState(false);
    }
  };
  //刪除購物車產品
  const removeSingleCart = async (id) => {
    setListLoadingState((prev) => [...prev, id]);
    try {
      const res = await axios.delete(`${customerUrl}/cart/${id}`);
      alert(res.data.message);
      getCarts();
      closeDeleteModal();
    } catch (error) {
      alert("系統出現問題，請洽管理人員");
    } finally {
      setListLoadingState((prev) => prev.filter((item) => item !== id));
    }
  };

  //清空購物車
  const removeAllCarts = async () => {
    setFullScreenLoadingState(true);
    try {
      const res = await axios.delete(`${customerUrl}/carts`);
      alert(res.data.message);
      closeDeleteModal();
      getCarts();
    } catch (error) {
      alert("系統出現問題，請洽管理人員");
    } finally {
      setFullScreenLoadingState(false);
    }
  };

  //Modal
  const productCardModal = useRef(null);
  const productCardModalRef = useRef(null);
  const openModal = (product) => {
    setTempProduct(product);
    productCardModal.current = new Modal(productCardModalRef.current);
    productCardModal.current.show();
  };

  //DeleteModal
  const deleteModal = useRef(null);
  const deleteModalRef = useRef(null);
  const [deleteMode, setDeleteMode] = useState("single");
  const openDeleteModal = (cart, mode = "single") => {
    if (mode === "all") {
      setDeleteMode("all");
    } else {
      setDeleteMode("single");
      setTempCart(cart);
    }
    deleteModal.current = new Modal(deleteModalRef.current);
    deleteModal.current.show();
  };

  const closeDeleteModal = () => {
    deleteModal.current.hide();
    setTempCart(null);
  };

  useEffect(() => {
    if (selectState === "") {
      getProductsAll();
    } else {
      getProducts(selectState);
    }
  }, [selectState]);

  useEffect(() => {
    getCarts();
  }, []);

  useEffect(() => {
    if (cartsData?.carts?.length !== 0) {
      setCartStatus(true);
    } else {
      setCartStatus(false);
    }
  }, [cartsData]);

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-10">
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
                    <ProductCard
                      product={product}
                      openModal={openModal}
                      addCarts={addCarts}
                    />
                  </li>
                ))}
              </ul>
            </section>
            <ProductCardModal
              tempProduct={tempProduct}
              modalRef={productCardModalRef}
              productCardModal={productCardModal}
              addCarts={addCarts}
            />
            {/* 購物車 */}
            {cartStatus && (
              <ShoppingCart
                cartsData={cartsData}
                listLoadingState={listLoadingState}
                setListLoadingState={setListLoadingState}
                openDeleteModal={openDeleteModal}
                getCarts={getCarts}
              />
            )}
            <DeleteModal
              modalRef={deleteModalRef}
              title={
                deleteMode === "single" ? tempCart?.product?.title : "所有商品"
              }
              id={tempCart?.id}
              deleteMode={deleteMode}
              closeDeleteModal={closeDeleteModal}
              deleteMethod={
                deleteMode === "single" ? removeSingleCart : removeAllCarts
              }
            />
            {/* 訂單表單 */}
            <OrderForm getCarts={getCarts} />
          </div>
        </div>
        {fullScreenLoadingState && <FullScreenLoading />}
      </div>
    </>
  );
}

export default Products;
