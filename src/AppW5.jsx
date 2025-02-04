import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { Modal } from "bootstrap";

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;

function AppW5() {
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
	const [tempQty, setTempQty] = useState(1);
	const [cartsData, setCartsData] = useState([]);
	const [productsCategory, setProductsCategory] = useState([]);

	const getProducts = async () => {
		try {
			const res = await axios.get(
				`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/products?page=2`
			);
			console.log(res);
			setProducts(res.data.products);
			getCategory(products)
			setProductsCategory(getCategory(products));
		} catch (error) {
			// console.log(error);
		}
	};

	const getCategory = (products) => products.map(product => product.category);

	const getCarts = async () => {
		try {
			const res = await axios.get(
				`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/cart`
			);
			// console.log(res);
			setCartsData(res.data.data);
		} catch (error) {
			// console.log(error);
		}
	};

	const productCardModal = useRef(null)
	const productCardModalRef = useRef(null);
	const openModal = (product) => {
		setTempProduct(product);
		productCardModal.current = new Modal(productCardModalRef.current);
		productCardModal.current.show();
	}

	const closeModal = () => {
		productCardModal.current.hide();
		setTempQty(1);
	}

	useEffect(() => {
		getProducts();
		getCarts();
		// console.log(productsCategory);
	}, []);

	return (
		<>
			<div className="container">
				<div className="row d-flex justify-content-center">
					<div className="col-md-10">
						<section className="section productDisplay">
							<h2 className="section-title text-center">商品列表</h2>
							<div className="my-2 row">
								<div className="col-md-3">
									{/* <select name="" className="form-select">
										<option value="全部" selected>全部</option>
										{
											productsCategory.map(category => (
												<option value="床架">{category}</option>
											))
										}
									</select> */}
								</div>
							</div>
							<ul className="row row-cols-2 row-cols-lg-3 g-2 g-lg-3">
								{
									products.map(product => {
										const { id, title, imageUrl, origin_price, description, price, category } = product;
										return (
											<li className="col productItem" key={id}>
												<span className="productCategory text-bg-warning rounded-2">{category}</span>
												<div className="card" style={{
													height: "100%"
												}}>
													<img
														src={imageUrl}
														className="card-img-top object-fit-cover" style={{
															height: "250px",
														}}
														alt={title} />
													<div className="card-body">
														<h3 className="card-title">{title}</h3>
														<p className="card-text"><del>{`價格：${origin_price}`}</del></p>
														<p className="card-text text-danger">{`特價：${price}`}</p>
														<p className="card-text text-truncate">{`商品描述：${description}`}</p>
													</div>
													<div className="card-footer d-flex justify-content-center">
														<button type="button" className="btn btn-outline-primary rounded-end-0" onClick={() => openModal(product)}>查看細節</button>
														<button type="button" className="btn btn-outline-danger rounded-start-0">加入購物車</button>
													</div>
												</div>
											</li>
										)
									})
								}
							</ul>
						</section>
						<div className="modal" tabIndex="-1" ref={productCardModalRef}>
							<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
								<div className="modal-content">
									<div className="modal-header">
										<h3 className="modal-title">{tempProduct.title}</h3>
										<button type="button" className="btn-close" onClick={closeModal}></button>
									</div>
									<div className="modal-body">
										<img
											src={tempProduct.imageUrl}
											className="card-img-top img-fluid"
											alt={tempProduct.title} />
										<p className="mt-3">{`商品類別：${tempProduct.category}`}</p>
										<p className="mt-3">{`商品${tempProduct.content}`}</p>
										<p className="mt-3">{`商品描述：${tempProduct.description}`}</p>
										<p className="mt-3">{`商品原價：${tempProduct.origin_price}`}</p>
										<p className="mt-3 text-danger">{`搶購特價：${tempProduct.price}`}</p>
										<div className="d-flex align-items-center mt-3">
											購買數量：
											<button type="button" className="btn btn-sm btn-outline-secondary ms-3" disabled={tempQty === 1 ? true : false} onClick={() => {
												setTempQty(tempQty - 1)
											}}>-</button>
											<span className="mx-2">{tempQty}</span>
											<button type="button" className="btn btn-sm btn-outline-warning" onClick={() => {
												setTempQty(tempQty + 1)
											}}>+</button>
										</div>
									</div>
									<div className="modal-footer">
										<button
											type="button"
											className="btn btn-secondary" onClick={closeModal}>取消
										</button>
										<button
											type="button"
											className="btn btn-danger">加入購物車
										</button>
									</div>
								</div>
							</div>
						</div>
						<section className="section shoppingCart">
							<div className="row d-flex justify-content-center">
								<div className="col-12">
									<h2 className="section-title text-center">我的購物車</h2>
									<table className="shoppingCart-table table">
										<thead className="cartHead">
											<tr>
												<th width="20%">品項</th>
												<th width="25%">數量/單位</th>
												<th width="25%">單價</th>
												<th width="30%"></th>
											</tr>
										</thead>
										<tbody className="cartBody"></tbody>
										<tfoot className="cartFoot">
											<tr>
												<td colSpan={3}></td>
												<td>總計</td>
											</tr>
											<tr>
												<td colSpan={3}></td>
												<td>折扣價</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</section>
						<section className="section orderInfo">
							<div className="row d-flex justify-content-center">
								<div className="col-6">
									<form action="" className="orderInfo-form">
										<h2 className="section-title text-center">填寫預訂資料</h2>
										<div className="mb-3">
											<label htmlFor="customerEmail" className="form-label">
												Email
											</label>
											<input
												type="email"
												className="form-control"
												id="customerEmail"
												placeholder="請輸入 Email"
												name="Email"
											/>
										</div>
										<div className="mb-3">
											<label htmlFor="customerName" className="form-label">
												姓名
											</label>
											<input
												type="text"
												className="form-control"
												id="customerName"
												placeholder="請輸入姓名"
												name="姓名"
											/>
										</div>
										<div className="mb-3">
											<label htmlFor="customerPhone" className="form-label">
												電話
											</label>
											<input
												type="tel"
												className="form-control"
												id="customerPhone"
												placeholder="請輸入電話"
												name="電話"
											/>
										</div>
										<div className="mb-3">
											<label htmlFor="customerAddress" className="form-label">
												寄送地址
											</label>
											<input
												type="text"
												className="form-control"
												id="customerAddress"
												placeholder="請輸入寄送地址"
												name="寄送地址"
											/>
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
					</div>
				</div>
			</div>
		</>
	);
}

export default AppW5;
