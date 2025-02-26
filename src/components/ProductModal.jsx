import { useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { useDispatch } from 'react-redux';
import { addToastMessage } from '../slice/bootstrapToast';

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;

const ProductModal = ({
  modalRef,
  getProductsData,
  functionMode,
  tempData,
  setTempData,
  defaultData,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    new Modal(modalRef.current, {
      backdrop: 'static',
    });
  }, []);

  const closeProductModal = () => {
    const productModal = Modal.getInstance(modalRef.current);
    productModal.hide();
    setTempData(defaultData);
  };

  const handleProductInput = (e) => {
    const { type, name, checked, value } = e.target;
    switch (type) {
      case 'checkbox':
        setTempData({
          ...tempData,
          [name]: checked === true ? 1 : 0,
        });
        break;
      case 'number':
        setTempData({
          ...tempData,
          [name]: Number(value),
        });
        break;
      default:
        setTempData({
          ...tempData,
          [name]: value,
        });
    }
  };

  const handleProductImages = (index, value) => {
    let othersImages = [...tempData.imagesUrl];
    othersImages[index] = value;
    setTempData({
      ...tempData,
      imagesUrl: [...othersImages],
    });
  };

  const addProductImage = () => {
    let othersImages = [...tempData?.imagesUrl];
    othersImages.push('');
    setTempData({
      ...tempData,
      imagesUrl: [...othersImages],
    });
  };

  const removeProductImage = (mode, index = null) => {
    if (mode === 'main') {
      if (!tempData.imageUrl) {
        alert('目前主圖欄位中沒有圖片可以刪除！');
        return;
      }
      setTempData({
        ...tempData,
        imageUrl: '',
      });
    } else {
      let othersImages = [...tempData.imagesUrl];
      othersImages.splice(index, 1);
      setTempData({
        ...tempData,
        imagesUrl: [...othersImages],
      });
    }
  };

  const createProduct = async (productData) => {
    try {
      await axios.post(
        `${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/product`,
        productData
      );
      dispatch(
        addToastMessage({
          status: 'success',
          mode: 'create',
          title: '新增成功',
          content: `新增產品"${productData.data.title}"成功`,
        })
      );
    } catch (error) {
      dispatch(
        addToastMessage({
          status: 'failed',
          mode: 'create',
          title: '新增失敗',
          content: '新增產品失敗，請聯繫管理人員',
        })
      );
    }
  };

  const updateProduct = async (productData) => {
    try {
      let productId = productData.data.id;
      await axios.put(
        `${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/product/${productId}`,
        productData
      );
      dispatch(
        addToastMessage({
          status: 'success',
          mode: 'edit',
          title: '編輯成功',
          content: `編輯產品"${productData.data.title}"成功`,
        })
      );
    } catch (error) {
      dispatch(
        addToastMessage({
          status: 'failed',
          mode: 'edit',
          title: '編輯失敗',
          content: '編輯產品失敗，請聯繫管理人員',
        })
      );
    }
  };

  const validateProductForm = (data) => {
    const { title, category, unit, price, origin_price, imageUrl, imagesUrl } =
      data;
    if (!title || !category || !unit || !price || !origin_price) {
      alert('產品資訊必填欄位未填寫，新增失敗');
      return false;
    } else if (imageUrl === '') {
      alert('產品主圖不可以為空值唷');
      return false;
    } else if (imagesUrl.includes('')) {
      alert('產品副圖不可以為空值唷');
      return false;
    }
    return true;
  };

  const manageProduct = async (data, mode) => {
    if (!validateProductForm(data)) return;
    let productData = {
      data,
    };
    const manageApiCall = mode === 'create' ? createProduct : updateProduct;
    await manageApiCall(productData);
    getProductsData();
    closeProductModal();
  };

  return (
    <div
      className="modal"
      ref={modalRef}
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fs-5" id="productModalLabel">
              {functionMode === 'create' ? '建立產品' : '編輯產品'}
            </h3>
            <button
              type="button"
              className="btn-close"
              onClick={closeProductModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-8">
                <div className="mb-3 row">
                  <label htmlFor="productTitle" className="col-md-10">
                    標題
                  </label>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      id="productTitle"
                      placeholder="請輸入標題"
                      name="title"
                      value={tempData.title}
                      onChange={handleProductInput}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="row">
                    <label htmlFor="productCategory" className="col-md-6">
                      分類
                    </label>
                    <label htmlFor="productUnit" className="col-md-6">
                      單位
                    </label>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        id="productCategory"
                        placeholder="請輸入分類"
                        name="category"
                        value={tempData.category}
                        onChange={handleProductInput}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        id="productUnit"
                        placeholder="請輸入單位"
                        name="unit"
                        value={tempData.unit}
                        onChange={handleProductInput}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="row">
                    <label htmlFor="productOriginPrice" className="col-md-6">
                      原價
                    </label>
                    <label htmlFor="productPrice" className="col-md-6">
                      售價
                    </label>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="form-control"
                        id="productOriginPrice"
                        placeholder="請輸入原價"
                        min={0}
                        name="origin_price"
                        value={tempData.origin_price}
                        onChange={handleProductInput}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="form-control"
                        id="productPrice"
                        placeholder="請輸入售價"
                        min={0}
                        name="price"
                        value={tempData.price}
                        onChange={handleProductInput}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="mb-3 row">
                  <label htmlFor="productDescription" className="col-12">
                    產品描述
                  </label>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      id="productDescription"
                      rows="2"
                      placeholder="請輸入產品描述"
                      name="description"
                      value={tempData.description}
                      onChange={handleProductInput}
                    ></textarea>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="productContent" className="col-12">
                    說明內容
                  </label>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      id="productContent"
                      rows="2"
                      placeholder="請輸入說明內容"
                      name="content"
                      value={tempData.content}
                      onChange={handleProductInput}
                    ></textarea>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="productActivate"
                    name="is_enabled"
                    checked={tempData.is_enabled == 1 ? true : false}
                    onChange={handleProductInput}
                  />
                  <label className="form-check-label" htmlFor="productActivate">
                    是否啟用
                  </label>
                </div>
              </div>
              <div className="col-4">
                <div className="row mb-3">
                  <div className="col-12 d-flex flex-column mb-2">
                    <p className="fs-5">主圖</p>
                    <img
                      src={tempData.imageUrl}
                      alt="主圖"
                      className="img-fluid"
                    />
                  </div>
                  <label htmlFor="productImageUrl" className="col-12">
                    新增主圖網址
                  </label>
                  <div className="col-12 mb-2">
                    <input
                      className="form-control"
                      id="productImageUrl"
                      placeholder="請貼上圖片網址"
                      name="imageUrl"
                      value={tempData.imageUrl}
                      onChange={handleProductInput}
                    />
                  </div>
                  {tempData?.imagesUrl?.length > 0 ? (
                    <div className="col-12 d-flex flex-column">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          removeProductImage('main');
                        }}
                      >
                        移除圖片
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="col-6 d-flex flex-column">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={addProductImage}
                        >
                          新增圖片
                        </button>
                      </div>
                      <div className="col-6 d-flex flex-column">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            removeProductImage('main');
                          }}
                        >
                          移除圖片
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {tempData?.imagesUrl?.map((image, index) => (
                  <div className="row mb-3" key={`${image}/${index}`}>
                    <div className="col-12 d-flex flex-column mb-2">
                      <p className="fs-5">{`副圖${index + 1}`}</p>
                      <img
                        src={image}
                        alt={`副圖${index + 1}`}
                        className="img-fluid"
                      />
                    </div>
                    <label htmlFor="productImageUrl" className="col-12">
                      新增副圖網址
                    </label>
                    <div className="col-12 mb-2">
                      <input
                        className="form-control"
                        id="productImageUrl"
                        placeholder="請貼上圖片網址"
                        value={image}
                        onChange={(e) => {
                          handleProductImages(index, e.target.value);
                        }}
                      />
                    </div>
                    {image === '' ||
                    index !== tempData.imagesUrl?.length - 1 ||
                    index === 4 ? (
                      <div className="col d-flex flex-column">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            removeProductImage('others', index);
                          }}
                        >
                          移除圖片
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="col-6 d-flex flex-column">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={addProductImage}
                          >
                            新增圖片
                          </button>
                        </div>
                        <div className="col-6 d-flex flex-column">
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => {
                              removeProductImage('others', index);
                            }}
                          >
                            移除圖片
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeProductModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                manageProduct(tempData, functionMode);
              }}
            >
              {functionMode === 'create' ? '新增' : '儲存修改'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
