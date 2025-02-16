import axios from 'axios';

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
const customerUrl = `${VITE_APP_BaseUrl}/api/${VITE_APP_API}`;

const ShoppingCart = ({
  cartsData,
  cartStatus,
  listLoadingState,
  setListLoadingState,
  openDeleteModal,
  getCarts,
}) => {
  //更新購物車
  const updateCart = async (id, product_id, qty) => {
    setListLoadingState((prev) => [...prev, id]);
    try {
      const res = await axios.put(`${customerUrl}/cart/${id}`, {
        data: {
          product_id,
          qty,
        },
      });
      getCarts();
    } catch (error) {
      alert('系統出現問題，請洽管理人員');
    } finally {
      setListLoadingState((prev) => prev.filter((item) => item !== id));
    }
  };
  return (
    <section className="section shoppingCart">
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h2 className="section-title text-center">購物車</h2>
          <div className="d-flex">
            <button
              className="btn btn-danger ms-auto"
              onClick={() => {
                openDeleteModal('', 'all');
              }}
            >
              清空購物車
            </button>
          </div>
          <table className="shoppingCart-table table">
            <thead className="cartHead">
              <tr>
                <th width="25%" className="text-center">
                  品項
                </th>
                <th width="20%" className="text-center">
                  品名
                </th>
                <th width="30%" className="text-center">
                  數量/單位
                </th>
                <th width="15%">單價</th>
                <th width="10%"></th>
              </tr>
            </thead>
            {cartStatus ? (
              <>
                <tbody className="cartBody">
                  {cartsData?.carts?.map((cart) => {
                    const { id, product_id, product, qty } = cart;
                    return (
                      <tr key={id}>
                        <td>
                          <div className="d-flex">
                            <img
                              src={product.imageUrl}
                              className="object-fit-cover mx-auto"
                              style={{
                                height: '200px',
                              }}
                              alt={product.title}
                            />
                          </div>
                        </td>
                        <td className="text-center">{product.title}</td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary ms-3"
                            onClick={() => {
                              if (qty === 1) {
                                openDeleteModal(cart);
                              } else {
                                updateCart(id, product_id, qty - 1);
                              }
                            }}
                            disabled={listLoadingState.includes(id)}
                          >
                            {listLoadingState.includes(id) ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden" role="status">
                                  Loading...
                                </span>
                              </>
                            ) : (
                              <i className="bi bi-dash fs-6"></i>
                            )}
                          </button>
                          <span className="mx-2">{qty}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => {
                              updateCart(id, product_id, qty + 1);
                            }}
                            disabled={listLoadingState.includes(id)}
                          >
                            {listLoadingState.includes(id) ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden" role="status">
                                  Loading...
                                </span>
                              </>
                            ) : (
                              <i className="bi bi-plus fs-6"></i>
                            )}
                          </button>
                          <span className="ms-2">{`/${product.unit}`}</span>
                        </td>
                        <td>{product.price}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              openDeleteModal(cart);
                            }}
                            disabled={listLoadingState.includes(id)}
                          >
                            {listLoadingState.includes(id) ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden" role="status">
                                  Loading...
                                </span>
                              </>
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="cartFoot">
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-end">總計</td>
                    <td>{cartsData?.final_total}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </>
            ) : (
              <>
                <tbody className="cartBody">
                  <tr>
                    <td colSpan={5} className="text-center">
                      快去商城選購！！！
                    </td>
                  </tr>
                </tbody>
                <tfoot className="cartFoot">
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-end">總計</td>
                    <td>0</td>
                    <td></td>
                  </tr>
                </tfoot>
              </>
            )}
          </table>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
