import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Modal } from 'bootstrap';

import Login from './pages/LoginPage';
import Loading from './components/LoadingPage';
import DeleteModal from './components/deleteModal';
import ProductModal from './components/productModal';
import Pagination from './components/Pagination';

const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;

function AppW3() {
	const [isLogin, setIsLogin] = useState(false);
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
		imagesUrl: []
	}
	const [tempData, setTempData] = useState(defaultData);
	const listNum = 9;

	const getProductsData = async () => {
		try {
			const res = await axios.get(`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/products/all`);
			let productList = Object.values(res.data.products).reverse();
			setAllProducts(productList);
			sortPage(productList.length, listNum);
			setProducts(sortProductsData(productList, currentPage))
		} catch (error) {
			alert(error?.response.data.message ? `${error?.response.data.message}\n煩請洽管理人員` : "系統忙線中，請洽管理人員");
		}
	}

	const sortProductsData = (products, page) => {
		let productsGroup = [];
		for (let i = 0; i < products.length; i += listNum) {
			productsGroup.push([...products].splice(i, listNum))
		}
		return (productsGroup[page - 1]);
	}

	const initState = () => {
		setProducts(null);
		setTempData(defaultData);
		setCurrentPage(1);
		setPageState(null);
	}

	const logout = async () => {
		try {
			await axios.post(`${VITE_APP_BaseUrl}/logout`);
			document.cookie = "HexToken='';"
			checkStatus();
		} catch (error) {
			alert(`${error.response.data.message}\n煩請洽管理人員`)
		}
	}

	const checkStatus = async () => {
		try {
			await axios.post(`${VITE_APP_BaseUrl}/api/user/check`);
			setIsLogin(true);
			getProductsData();
		} catch (error) {
			setIsLogin(false);
			initState();
		}
	}

	useEffect(() => {
		let hexToken = document.cookie.replace(/(?:(?:^|.*;\s*)HexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
		axios.defaults.headers.common['Authorization'] = hexToken;
		checkStatus()
	}, []);

	const productModalRef = useRef(null);
	const deleteModalRef = useRef(null);

	const [functionMode, setFunctionMode] = useState(null);
	const openModal = (mode, productData, modalRef = productModalRef) => {
		setFunctionMode(mode);
		if (mode === 'create') {
			setTempData(defaultData)
		} else {
			setTempData({
				...tempData,
				...productData
			})
		}

		const targetModal = Modal.getInstance(modalRef.current);
		targetModal.show();
	}

	//pagination
	const [totalPages, setTotalPages] = useState(null);
	const [pageState, setPageState] = useState({})
	const [currentPage, setCurrentPage] = useState(1);

	const sortPage = (productQty, num) => setTotalPages(Math.ceil(productQty / num));

	useEffect(() => {
		if (currentPage === 1) {
			setPageState({
				previous: false,
				next: true,
			})
		} else if (currentPage === totalPages) {
			setPageState({
				previous: true,
				next: false,
			})
		} else {
			setPageState({
				previous: true,
				next: true,
			})
		}
		setProducts(sortProductsData(allProducts, currentPage))
	}, [currentPage])

	return (
		<div className='container'>
			{isLogin ? (
				<>
					<div className="row mt-3 d-flex justify-content-center">
						<div className="col-md-10">
							<div className="d-flex align-items-center mb-2">
								<div className="d-flex align-items-center me-auto">
									<h1 className='mb-0 me-2'>產品列表</h1>
									<button type="button" className='btn btn-danger' onClick={logout}>登出</button>
								</div>
								<button type="button" className='btn btn-warning me-3' onClick={() => openModal("create", defaultData)}>新增產品</button>
							</div>
							<table className="table">
								<thead>
									<tr className='table-secondary'>
										<th>產品名稱{`(第${(currentPage - 1) * 9 + 1}~${currentPage * 9}筆)`}</th>
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
													<td>{product.is_enabled === 1 ? <p className='text-success'>已啟用</p> : <p className='text-danger'>未啟用</p>}</td>
													<td>
														<button type="button" className='btn btn-outline-primary me-2' onClick={() => {
															openModal('edit', product);
														}}>編輯</button>
														<button type="button" className='btn btn-outline-danger' onClick={() => {
															openModal('delete', product, deleteModalRef);
														}}>刪除</button>
													</td>
												</tr>
											)) :
											<tr>
												<td colSpan="5" className='text-center'> <Loading /> </td>
											</tr>
									}
								</tbody>
							</table>
						</div>
					</div>
					{/* pagination */}
					<Pagination
						setCurrentPage={setCurrentPage}
						pageState={pageState}
						totalPages={totalPages}
						currentPage={currentPage}
					/>
				</>
			) :
				(
					<Login
						setIsLogin={setIsLogin}
						getProductsData={getProductsData}
					/>
				)
			}
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
				setTempData={setTempData}
				defaultData={defaultData}
				getProductsData={getProductsData}
			/>
		</div>
	)
}

export default AppW3
