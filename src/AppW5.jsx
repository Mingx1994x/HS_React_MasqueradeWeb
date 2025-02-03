import axios from "axios";
import { useEffect, useState } from "react";

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;

function AppW5() {
	const [products, setProducts] = useState([]);
	const [cartsData, setCartsData] = useState([]);
	const getProducts = async () => {
		try {
			const res = await axios.get(
				`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/products`
			);
			console.log(res);
			setProducts(res.data.products);
		} catch (error) {
			console.log(error);
		}
	};

	const getCarts = async () => {
		try {
			const res = await axios.get(
				`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/cart`
			);
			console.log(res);
			setCartsData(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getProducts();
		getCarts();
	}, []);

	return (
		<>
			<div className="container">
				<div className="row d-flex justify-content-center">
					<div className="col-md-10">
						<section className="section productDisplay">
							<h2 className="section-title text-center">商品列表</h2>
							{/* <select name="" class="productSelect">
								<option value="全部" selected>全部</option>
								<option value="床架">床架</option>
								<option value="收納">收納</option>
								<option value="窗簾">窗簾</option>
							</select> */}
							<ul className="row row-cols-2 row-cols-lg-3 g-2 g-lg-3">
								{
									products.map(product => {
										const { id, title, imageUrl, price, content, category } = product;
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
														<p className="card-text">{`價格：${price}`}</p>
														<p className="card-text">{content}</p>
													</div>
													<div className="card-footer d-flex justify-content-center">
														<button type="button" className="btn btn-outline-primary rounded-end-0">查看細節</button>
														<button type="button" className="btn btn-outline-danger rounded-start-0">加入購物車</button>
													</div>
												</div>
											</li>
										)
									})
								}
							</ul>
						</section>
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
