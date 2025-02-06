import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import HashLoader from "react-spinners/HashLoader"

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
const customerUrl = `${VITE_APP_BaseUrl}/api/${VITE_APP_API}`;

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
	const [cartsData, setCartsData] = useState({});
	const [cartStatus, setCartStatus] = useState(false);
	// const [productsCategory, setProductsCategory] = useState([]);
	const [fullScreenLoadingState, setFullScreenLoadingState] = useState(false);
	//取得產品列表資料
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

	// const getCategory = (products) => products.map(product => product.category);

	//取得購物車資料
	const getCarts = async () => {
		try {
			const res = await axios.get(`${customerUrl}/cart`);
			console.log(res);
			setCartsData(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	//新增購物車
	const addCarts = async (product_id, qty = 1) => {
		setFullScreenLoadingState(true);
		try {
			const res = await axios.post(`${customerUrl}/cart`, {
				data: {
					product_id,
					qty
				}
			});
			console.log(res);
			getCarts();
		} catch (error) {
			console.log(error);
		} finally {
			setFullScreenLoadingState(false);
		}
	}
	//刪除購物車產品
	const removeSingleCart = async (id) => {
		try {
			const res = await axios.delete(`${customerUrl}/cart/${id}`);
			console.log(res);
			getCarts();
		} catch (error) {
			console.log(error);
		}
	}

	//清空購物車
	const removeCarts = async () => {
		try {
			const res = await axios.delete(`${customerUrl}/carts`);
			console.log(res);
			getCarts();
		} catch (error) {
			console.log(error);
		}
	}

	//更新購物車
	const updateCart = async (id, product_id, qty) => {
		try {
			const res = await axios.put(`${customerUrl}/cart/${id}`, {
				data: {
					product_id,
					qty
				}
			});
			console.log(res);
			getCarts();
		} catch (error) {
			console.log(error);
		}
	}

	//Modal
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

	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		console.log(data);

	}


	useEffect(() => {
		getProducts();
		getCarts();
		// console.log(productsCategory);
	}, []);

	useEffect(() => {
		if (cartsData?.carts?.length !== 0) {
			setCartStatus(true);
		} else {
			setCartStatus(false);
		}
	}, [cartsData])

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
														<button type="button" className="btn btn-outline-danger rounded-start-0" onClick={() => {
															addCarts(id)
														}}>加入購物車</button>
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
											className="btn btn-danger" onClick={() => {
												addCarts(tempProduct.id, tempQty);
												closeModal()
											}}>加入購物車
										</button>
									</div>
								</div>
							</div>
						</div>
						{cartStatus ? (
							<section className="section shoppingCart">
								<div className="row d-flex justify-content-center">
									<div className="col-12">
										<h2 className="section-title text-center">我的購物車</h2>
										<div className="d-flex">
											<button className="btn btn-danger ms-auto" onClick={removeCarts}>清空購物車</button>
										</div>
										<table className="shoppingCart-table table">
											<thead className="cartHead">
												<tr>
													<th width="25%" className="text-center">品項</th>
													<th width="20%" className="text-center">品名</th>
													<th width="25%" className="text-center">數量/單位</th>
													<th width="15%">單價</th>
													<th width="15%"></th>
												</tr>
											</thead>
											<tbody className="cartBody">
												{cartsData?.carts?.map(cart => {
													const { id, product_id, product, qty } = cart;
													return (
														<tr key={id}>
															<td>
																<div className="d-flex">
																	<img src={product.imageUrl} className="object-fit-cover mx-auto" style={{
																		height: '200px'
																	}} alt={product.title} />
																</div>
															</td>
															<td className="text-center">{product.title}</td>
															<td className="text-center">
																<button type="button" className="btn btn-sm btn-outline-secondary ms-3" onClick={() => {
																	if (qty === 1) {
																		removeSingleCart(id)
																	} else {
																		updateCart(id, product_id, qty - 1);
																	}
																}}>-</button>
																<span className="mx-2">{qty}</span>
																<button type="button" className="btn btn-sm btn-outline-warning" onClick={() => {
																	updateCart(id, product_id, qty + 1)
																}}>+</button>
																<span className="ms-2">{`/${product.unit}`}</span>
															</td>
															<td>{product.price}</td>
															<td><button className="btn btn-danger" onClick={() => {
																removeSingleCart(id);
															}}>移除商品</button></td>
														</tr>
													)
												})}
											</tbody>
											<tfoot className="cartFoot">
												<tr>
													<td colSpan={2}></td>
													<td className="text-end">總計</td>
													<td>{cartsData?.final_total}</td>
													<td></td>
												</tr>
												{/* <tr>
												<td colSpan={3}></td>
												<td>折扣價</td>
												<td></td>
											</tr> */}
											</tfoot>
										</table>
									</div>
								</div>
							</section>
						) : ''}
						<section className="section orderInfo">
							<div className="row d-flex justify-content-center">
								<div className="col-6">
									<form onSubmit={handleSubmit(onSubmit)} className="orderInfo-form">
										<h2 className="section-title text-center">填寫預訂資料</h2>
										<div className="mb-3">
											<label htmlFor="customerEmail" className="form-label">
												Email
											</label>
											<input
												type="email"
												className={`form-control ${errors?.Email ? 'is-invalid' : ''}`}
												id="customerEmail"
												placeholder="請輸入 Email"
												name="Email"
												{...register('Email', {
													required: 'Email為必填欄位',
													pattern: {
														value: /^\S+@\S+$/i,
														message: 'Email欄位填寫格式錯誤'
													}
												})}
											/>
											{errors?.Email && (
												<div className='invalid-feedback'>{errors?.Email?.message}</div>
											)}
										</div>
										<div className="mb-3">
											<label htmlFor="customerName" className="form-label">
												姓名
											</label>
											<input
												type="text"
												className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
												id="customerName"
												placeholder="請輸入姓名"
												name="name"
												{...register('name', {
													required: '姓名為必填欄位',
												})}
											/>
											{errors?.name && (
												<div className="invalid-feedback">
													{errors.name.message}
												</div>
											)}
										</div>
										<div className="mb-3">
											<label htmlFor="customerPhone" className="form-label">
												手機
											</label>
											<input
												type="tel"
												className={`form-control ${errors?.phone ? 'is-invalid' : ''}`}
												id="customerPhone"
												placeholder="請輸入手機號碼"
												name="phone"
												{...register('phone', {
													required: '手機為必填欄位',
													pattern: {
														value: /^09\d{2}-\d{3}-\d{3}$/i,
														message: '手機欄位填寫格式錯誤'
													}
												})}
											/>
											{
												errors?.phone && (
													<div className="invalid-feedback">
														{errors.phone.message}
													</div>
												)
											}
										</div>
										<div className="mb-3">
											<label htmlFor="customerAddress" className="form-label">
												寄送地址
											</label>
											<input
												type="text"
												className={`form-control ${errors?.phone ? 'is-invalid' : ''}`}
												id="customerAddress"
												placeholder="請輸入寄送地址"
												name="address"
												{...register('address', {
													required: '地址為必填欄位'
												})}
											/>
											{
												errors?.address && (
													<div className="invalid-feedback">
														{errors.address.message}
													</div>
												)
											}
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
				{
					fullScreenLoadingState && (
						<div className="d-flex align-items-center justify-content-center"
							style={{
								position: "fixed",
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
								zIndex: 1000,
								backgroundColor: 'rgba(255,255,255,0.3)',
								backdropFilter: 'blur(3px)'
							}} >
							<HashLoader
								color={'#000'}
								size={80}
								aria-label="Loading Spinner"
								data-testid="loader"
							/>
						</div>
					)
				}
			</div>
		</>
	);
}

export default AppW5;
