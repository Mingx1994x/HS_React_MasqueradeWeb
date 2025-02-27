import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

import Loading from '../components/LoadingPage';
import DeleteModal from '../components/DeleteModal';
import ProductModal from '../components/ProductModal';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router';
import { LoginStatus } from '../context/LoginContext';
import { useDispatch } from 'react-redux';
import { addToastMessage } from '../slice/bootstrapToast';
import BSToast from '../components/BSToast';

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;

function AdminProducts() {
  const { isLogin, setIsLogin } = useContext(LoginStatus);
  const [allProducts, setAllProducts] = useState([]);
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
  const [tempData, setTempData] = useState(defaultData);
  const listNum = 9;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //product
  const sortPage = (productQty, num) =>
    setTotalPages(Math.ceil(productQty / num));
  const getProductsData = async () => {
    try {
      const res = await axios.get(
        `${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/products/all`
      );
      let productList = Object.values(res.data.products).reverse();
      setAllProducts(productList);
      sortPage(productList.length, listNum);
      setProducts(sortProductsData(productList, currentPage));
    } catch (error) {
      alert(
        error?.response.data.message
          ? `${error?.response.data.message}`
          : '載入中，請稍候...'
      );
    }
  };

  const sortProductsData = (products, page) => {
    let productsGroup = [];
    for (let i = 0; i < products.length; i += listNum) {
      productsGroup.push([...products].splice(i, listNum));
    }
    return productsGroup[page - 1];
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/product/${id}`
      );
      getProductsData();
      dispatch(
        addToastMessage({
          status: 'success',
          mode: 'delete',
          title: '刪除成功',
          content: '刪除產品成功',
        })
      );
    } catch (error) {
      dispatch(
        addToastMessage({
          status: 'failed',
          mode: 'delete',
          title: '刪除失敗',
          content: '刪除商品失敗',
        })
      );
    } finally {
      closeDeleteModal(deleteModalRef);
    }
  };

  const initState = () => {
    setProducts(null);
    setTempData(defaultData);
    setCurrentPage(1);
    setPageState(null);
  };
  const logout = async () => {
    try {
      await axios.post(`${VITE_APP_BaseUrl}/logout`);
      initState();
      setIsLogin(false);
      navigate('/login');
    } catch (error) {
      alert(`${error.response.data.message}\n煩請洽管理人員`);
    }
  };

  useEffect(() => {
    if (isLogin) {
      getProductsData();
    }
  }, [isLogin]);

  //Modal
  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  const [functionMode, setFunctionMode] = useState(null);
  const openModal = (mode, productData, modalRef = productModalRef) => {
    setFunctionMode(mode);
    if (mode === 'create') {
      setTempData(defaultData);
    } else {
      setTempData({
        ...tempData,
        ...productData,
      });
    }

    const targetModal = Modal.getInstance(modalRef.current);
    targetModal.show();
  };

  const closeDeleteModal = () => {
    const deleteModal = Modal.getInstance(deleteModalRef.current);
    deleteModal.hide();
    setTempData(defaultData);
  };

  //pagination
  const [totalPages, setTotalPages] = useState(null);
  const [pageState, setPageState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setProducts(sortProductsData(allProducts, currentPage));
  }, [currentPage]);

  return (
    <>
      <div className="container">
        <BSToast />
        <div
          className="row mt-3 mb-5 d-flex justify-content-center"
          style={{ minHeight: '75vh' }}
        >
          <div className="col-md-10">
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex align-items-center me-auto">
                <h1 className="mb-0 me-2">產品列表</h1>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={logout}
                >
                  登出
                </button>
              </div>
              <button
                type="button"
                className="btn btn-warning me-3"
                onClick={() => openModal('create', defaultData)}
              >
                新增產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr className="table-secondary">
                  <th>
                    產品名稱
                    {`(第${(currentPage - 1) * 9 + 1}~${currentPage * 9}筆)`}
                  </th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {products ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>
                        {product.is_enabled === 1 ? (
                          <p className="text-success">已啟用</p>
                        ) : (
                          <p className="text-danger">未啟用</p>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-primary me-2"
                          onClick={() => {
                            openModal('edit', product);
                          }}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            openModal('delete', product, deleteModalRef);
                          }}
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      {' '}
                      <Loading />{' '}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* pagination */}
        <Pagination
          setCurrentPage={setCurrentPage}
          pageState={pageState}
          setPageState={setPageState}
          totalPages={totalPages}
          currentPage={currentPage}
        />
        {/* product modal */}
        <ProductModal
          modalRef={productModalRef}
          getProductsData={getProductsData}
          functionMode={functionMode}
          tempData={tempData}
          setTempData={setTempData}
          defaultData={defaultData}
        />
        {/* delete Modal */}
        <DeleteModal
          modalRef={deleteModalRef}
          title={tempData.title}
          id={tempData.id}
          deleteMode={'single'}
          closeDeleteModal={closeDeleteModal}
          deleteMethod={deleteProduct}
        />
      </div>
    </>
  );
}

export default AdminProducts;
