import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Modal } from 'bootstrap';

import Login from './components/LoginPage';
import Loading from './components/LoadingPage';
import DeleteModal from './components/deleteModal';
import ProductModal from './components/productModal';
import Pagination from './components/Pagination';

function AppW3() {
	const [isLogin, setIsLogin] = useState(false);
	const [account, setAccount] = useState(
		{
			username: "",
			password: ""
		}
	);
	const { VITE_APP_BaseUrl, VITE_APP_API } = import.meta.env;
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

	const initProductsData = () => {
		setProducts(null);
		setTempData(defaultData);
	}

	const signin = async () => {
		if (!account.username || !account.password) return
		try {
			const res = await axios.post(`${VITE_APP_BaseUrl}/admin/signin`, account);
			document.cookie = `HexToken=${res.data.token}; expires=${new Date(res.data.expired)}`;
			setAccount({
				username: '',
				password: ''
			});
			setIsLogin(true);
			getProductsData();
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
			initProductsData();
		}
	}

	useEffect(() => {
		let hexToken = document.cookie.replace(/(?:(?:^|.*;\s*)HexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
		axios.defaults.headers.common['Authorization'] = hexToken;
		checkStatus()
	}, []);

	const productModalRef = useRef(null);
	const deleteModalRef = useRef(null);
	useEffect(() => {
		new Modal(productModalRef.current, {
			backdrop: 'static'
		});
		new Modal(deleteModalRef.current, {
			backdrop: 'static'
		});
	}, [])
	const [functionMode, setFunctionMode] = useState(null);
	const openProductModal = (mode, productData) => {
		if (mode === 'create') {
			setFunctionMode('create');
			setTempData(defaultData)
		} else {
			setFunctionMode('edit');
			setTempData({
				...tempData,
				...productData
			})
		}

		const productModal = Modal.getInstance(productModalRef.current);
		productModal.show();
	}

	const closeProductModal = () => {
		const productModal = Modal.getInstance(productModalRef.current);
		productModal.hide();
		setTempData(defaultData);
	}

	const openDeleteModal = (productData) => {
		setTempData({
			...tempData,
			...productData
		})

		const deleteModal = Modal.getInstance(deleteModalRef.current);
		deleteModal.show();
	}

	const closeDeleteModal = () => {
		const deleteModal = Modal.getInstance(deleteModalRef.current);
		deleteModal.hide();
		setTempData(defaultData);
	}

	const handleProductInput = (e) => {
		const { type, name, checked, value } = e.target;
		switch (type) {
			case 'checkbox':
				setTempData({
					...tempData,
					[name]: checked === true ? 1 : 0
				});
				break;
			case 'number':
				setTempData({
					...tempData,
					[name]: Number(value)
				});
				break;
			default:
				setTempData({
					...tempData,
					[name]: value
				});
		}
	}

	const handleProductImages = (index, value) => {
		let othersImages = [...tempData.imagesUrl];
		othersImages[index] = value;
		setTempData({
			...tempData,
			imagesUrl: [...othersImages]
		})

	}
	const addProductImage = () => {
		let othersImages = [...tempData?.imagesUrl];
		othersImages.push('');
		setTempData({
			...tempData,
			imagesUrl: [...othersImages]
		})
	}

	const removeProductImage = (mode, index = null) => {

		if (mode === 'main') {
			if (!tempData.imageUrl) {
				alert('沒有圖片可以刪除喔！');
				return
			}
			setTempData({
				...tempData,
				imageUrl: ''
			})
		} else {
			if (!tempData.imagesUrl[index]) {
				alert('沒有圖片可以刪除喔！');
				return
			}
			let othersImages = [...tempData.imagesUrl];
			othersImages.splice(index, 1);
			setTempData({
				...tempData,
				imagesUrl: [...othersImages]
			})
		}
	}

	const validateProductForm = (data) => {
		const { title, category, unit, price, origin_price, imageUrl, imagesUrl } = data;
		if (!title || !category || !unit || !price || !origin_price) {
			alert('產品資訊必填欄位未填寫，新增失敗');
			return false
		} else if (imageUrl === '') {
			alert('產品主圖不可以為空值唷')
			return false
		} else if (imagesUrl.includes('')) {
			alert('產品副圖不可以為空值唷')
			return false
		}

		return true
	}

	const createProduct = async (productData) => {
		try {
			const res = await axios.post(`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/product`, productData)
		} catch (error) {
		}
	}

	const updateProduct = async (productData) => {
		try {
			let productId = productData.data.id;
			await axios.put(`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/product/${productId}`, productData);
		} catch (error) {
		}
	}

	const manageProduct = async (data, mode) => {

		if (!validateProductForm(data)) return
		let productData = {
			data
		}
		const manageApiCall = mode === 'create' ? createProduct : updateProduct;
		await manageApiCall(productData);
		getProductsData();
		closeProductModal();
	}

	const deleteProduct = async (id) => {
		try {
			await axios.delete(`${VITE_APP_BaseUrl}/api/${VITE_APP_API}/admin/product/${id}`);
			getProductsData();
			closeDeleteModal();
		} catch (error) {
		}
	}

	//pagination
	const [pages, setPages] = useState(null);
	const [pageState, setPageState] = useState({})
	const [currentPage, setCurrentPage] = useState(1);

	const sortPage = (productQty, num) => setPages(Math.ceil(productQty / num));

	const switchCurrentPage = (mode) => {
		if (mode === 'next') {
			setCurrentPage(currentPage + 1)
		} else {
			setCurrentPage(currentPage - 1)
		}
	}

	useEffect(() => {
		if (currentPage === 1) {
			setPageState({
				previous: false,
				next: true,
			})
		} else if (currentPage === pages) {
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
								<button type="button" className='btn btn-warning me-3' onClick={() => openProductModal("create", defaultData)}>新增產品</button>
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
															openProductModal('edit', product);
														}}>編輯</button>
														<button type="button" className='btn btn-outline-danger' onClick={() => {
															openDeleteModal(product);
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
						switchCurrentPage={switchCurrentPage}
						setCurrentPage={setCurrentPage}
						pageState={pageState}
						pages={pages}
						currentPage={currentPage}
					/>
				</>
			) :
				(
					<Login account={account} login={signin} inputHandler={inputHandler} />
				)
			}
			{/* product modal */}
			<ProductModal
				modalRef={productModalRef}
				handleProductInput={handleProductInput}
				closeProductModal={closeProductModal}
				manageProduct={manageProduct}
				handleProductImages={handleProductImages}
				removeProductImage={removeProductImage}
				addProductImage={addProductImage}
				functionMode={functionMode}
				tempData={tempData}
				title={tempData.title}
				unit={tempData.unit}
				category={tempData.category}
				originPrice={tempData.origin_price}
				price={tempData.price}
				description={tempData.description}
				content={tempData.content}
				isEnabled={tempData.is_enabled}
				imageUrl={tempData.imageUrl}
				imagesUrl={tempData?.imagesUrl}
			/>
			{/* delete Modal */}
			<DeleteModal
				modalRef={deleteModalRef}
				closeDeleteModal={closeDeleteModal}
				deleteProduct={deleteProduct}
				title={tempData.title}
				id={tempData.id}
			/>
		</div>
	)
}

export default AppW3
