import { useEffect, useState } from 'react'
import axios from 'axios';

import Login from './LoginPage';
import Loading from './LoadingPage';

function AppW3() {
	const [isLogin, setIsLogin] = useState(false);
	const [account, setAccount] = useState(
		{
			username: "",
			password: ""
		}
	);
	const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
	const [products, setProducts] = useState([]);

	const getProductsData = async () => {
		try {
			const res = await axios.get(`${VITE_APP_BaseUrl}/v2/api/${VITE_APP_API}/admin/products/all`);
			setProducts(Object.values(res.data.products));
		} catch (error) {
			alert(error?.response.data.message ? `${error?.response.data.message}\n煩請洽管理人員` : "系統忙線中，請洽管理人員");
		}
	}

	const initProductsData = () => {
		setProducts(null);
	}

	const signin = async () => {
		if (!account.username || !account.password) return
		try {
			const res = await axios.post(`${VITE_APP_BaseUrl}/v2/admin/signin`, account);
			document.cookie = `HexToken=${res.data.token}; expires=${new Date(res.data.expired)}`;
			setAccount({
				username: '',
				password: ''
			});
			setIsLogin(true);
			checkStatus();
		} catch (error) {
			alert(error.response.data.error.message);
		}
	}

	const inputHandler = (e) => {
		const { name, value } = e.target;
		setAccount({
			...account,
			[name]: value
		})
	}

	const logout = async () => {
		try {
			await axios.post(`${VITE_APP_BaseUrl}/v2/logout`);
			document.cookie = "HexToken='';"
			checkStatus();
		} catch (error) {
			alert(`${error.response.data.message}\n煩請洽管理人員`)
		}
	}

	const checkStatus = async () => {
		let hexToken = document.cookie.replace(/(?:(?:^|.*;\s*)HexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
		axios.defaults.headers.common['Authorization'] = hexToken;
		try {
			await axios.post(`${VITE_APP_BaseUrl}/v2/api/user/check`);
			setIsLogin(true);
			getProductsData();
		} catch (error) {
			setIsLogin(false);
			initProductsData();
		}
	}

	useEffect(() => {
		checkStatus()
	}, []);

	return (
		<div className='container'>
			{isLogin ? (
				<div className="row mt-3 d-flex justify-content-center">
					<div className="col-md-10">
						<div className="d-flex justify-content-end mb-2">
							<button type="button" className='btn btn-warning me-3'>新增產品</button>
						</div>
						<table className="table">
							<thead>
								<tr className='table-secondary'>
									<th>產品名稱</th>
									<th>原價</th>
									<th>售價</th>
									<th>是否啟用</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								{
									products ?
										products.map(product => (
											<tr key={product.id}>
												<td>{product.title}</td>
												<td>{product.origin_price}</td>
												<td>{product.price}</td>
												<td>{product.is_enabled ? "是" : "否"}</td>
												<td>
													<button type="button" className='btn btn-primary me-2'>編輯</button>
													<button type="button" className='btn btn-danger'>刪除</button>
												</td>
											</tr>
										)) :
										<tr>
											<td colSpan="5" className='text-center'> <Loading /> </td>
										</tr>
								}
							</tbody>
						</table>
						<div className="d-flex">
							<button type="button" className='btn btn-danger ms-auto' onClick={logout}>登出</button>
						</div>
					</div>
				</div>
			) :
				(
					<Login account={account} login={signin} inputHandler={inputHandler} />
				)
			}
		</div>
	)
}

export default AppW3
