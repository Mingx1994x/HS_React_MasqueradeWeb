import axios from "axios";
import { useForm } from "react-hook-form";

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
const customerUrl = `${VITE_APP_BaseUrl}/api/${VITE_APP_API}`;

const OrderForm = ({ cartStatus, getCarts }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const submitOrder = async (orderInfo) => {
    if (!cartStatus) {
      alert("尊敬的用戶，您的購物車尚未新增商品項目！");
      return;
    }
    const { email, name, tel, address, message } = orderInfo;
    try {
      const res = await axios.post(`${customerUrl}/order`, {
        data: {
          user: {
            name,
            email,
            tel,
            address,
          },
          message,
        },
      });
      alert(res.data.message);
      reset();
      getCarts();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <section className="section orderInfo">
      <div className="row d-flex justify-content-center">
        <div className="col-6">
          <form onSubmit={handleSubmit(submitOrder)} className="orderInfo-form">
            <h2 className="section-title text-center">填寫預訂資料</h2>
            <div className="mb-3">
              <label htmlFor="customerEmail" className="form-label">
                信箱
              </label>
              <input
                type="email"
                className={`form-control ${errors?.email ? "is-invalid" : ""}`}
                id="customerEmail"
                placeholder="請輸入信箱"
                name="email"
                {...register("email", {
                  required: "信箱為必填欄位",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "信箱欄位填寫格式錯誤",
                  },
                })}
              />
              {errors?.email && (
                <div className="invalid-feedback">{errors?.email?.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="customerName" className="form-label">
                姓名
              </label>
              <input
                type="text"
                className={`form-control ${errors?.name ? "is-invalid" : ""}`}
                id="customerName"
                placeholder="請輸入姓名"
                name="name"
                {...register("name", {
                  required: "姓名為必填欄位",
                })}
              />
              {errors?.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="customerTel" className="form-label">
                手機(ex: 0912345678)
              </label>
              <input
                type="tel"
                className={`form-control ${errors?.tel ? "is-invalid" : ""}`}
                id="customerTel"
                placeholder="請輸入手機號碼"
                name="tel"
                {...register("tel", {
                  required: "手機為必填欄位",
                  pattern: {
                    value: /^09\d{8}$/i,
                    message: "手機欄位填寫格式錯誤",
                  },
                })}
              />
              {errors?.tel && (
                <div className="invalid-feedback">{errors.tel.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="customerAddress" className="form-label">
                寄送地址
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors?.address ? "is-invalid" : ""
                }`}
                id="customerAddress"
                placeholder="請輸入寄送地址"
                name="address"
                {...register("address", {
                  required: "地址為必填欄位",
                })}
              />
              {errors?.address && (
                <div className="invalid-feedback">{errors.address.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="customerMessage" className="form-label">
                留言
              </label>
              <textarea
                className={`form-control ${
                  errors?.message ? "is-invalid" : ""
                }`}
                id="customerMessage"
                rows="3"
                placeholder="留言區(留言請在30字以內)..."
                name="message"
                {...register("message", {
                  maxLength: {
                    value: 30,
                    message: "留言超過字數限制",
                  },
                })}
              ></textarea>
              {errors?.message && (
                <div className="invalid-feedback">{errors.message.message}</div>
              )}
            </div>
            <div className="d-flex justify-content-center">
              <input
                type="submit"
                value="送出預訂資料"
                className="btn btn-dark"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
