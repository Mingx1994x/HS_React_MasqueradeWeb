import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { Modal } from 'bootstrap';

import ShoppingCart from '../components/ShoppingCart';
import DeleteModal from '../components/DeleteModal';
import OrderForm from '../components/orderForm';
import FullScreenLoading from '../components/FullScreenLoading';

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
const customerUrl = `${VITE_APP_BaseUrl}/api/${VITE_APP_API}`;

const Carts = () => {
  const [cartsData, setCartsData] = useState({});
  const [tempCart, setTempCart] = useState(null);
  const [cartStatus, setCartStatus] = useState(false);
  const [fullScreenLoadingState, setFullScreenLoadingState] = useState(false);
  const [listLoadingState, setListLoadingState] = useState([]);

  //取得購物車資料
  const getCarts = async () => {
    try {
      const res = await axios.get(`${customerUrl}/cart`);
      setCartsData(res.data.data);
    } catch (error) {
      alert('系統出現問題，請洽管理人員');
    }
  };

  //刪除購物車產品
  const removeSingleCart = async (id) => {
    setFullScreenLoadingState(true);
    try {
      const res = await axios.delete(`${customerUrl}/cart/${id}`);
      alert(res.data.message);
      getCarts();
      closeDeleteModal();
    } catch (error) {
      alert('系統出現問題，請洽管理人員');
    } finally {
      setFullScreenLoadingState(false);
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
      alert('系統出現問題，請洽管理人員');
    } finally {
      setFullScreenLoadingState(false);
    }
  };

  //DeleteModal
  const deleteModal = useRef(null);
  const deleteModalRef = useRef(null);
  const [deleteMode, setDeleteMode] = useState('single');
  const openDeleteModal = (cart, mode = 'single') => {
    if (mode === 'all') {
      setDeleteMode('all');
    } else {
      setDeleteMode('single');
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
      <ShoppingCart
        cartsData={cartsData}
        cartStatus={cartStatus}
        listLoadingState={listLoadingState}
        setListLoadingState={setListLoadingState}
        openDeleteModal={openDeleteModal}
        getCarts={getCarts}
      />
      <DeleteModal
        modalRef={deleteModalRef}
        title={deleteMode === 'single' ? tempCart?.product?.title : '所有商品'}
        id={tempCart?.id}
        deleteMode={deleteMode}
        closeDeleteModal={closeDeleteModal}
        deleteMethod={
          deleteMode === 'single' ? removeSingleCart : removeAllCarts
        }
      />

      {/* 訂單表單 */}
      <OrderForm cartStatus={cartStatus} getCarts={getCarts} />

      {fullScreenLoadingState && <FullScreenLoading />}
    </>
  );
};

export default Carts;
