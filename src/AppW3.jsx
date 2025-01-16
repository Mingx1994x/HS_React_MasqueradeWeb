import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Modal } from 'bootstrap';

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
		setTempData(defaultData);
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
			setTempData({
				...tempData,
				...defaultData
			})
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
		let othersImages = [...tempData.imagesUrl];
		othersImages.push('');
		setTempData({
			...tempData,
			imagesUrl: [...othersImages]
		})
	}

	const removeProductImage = (mode, index = null) => {
		if (mode === 'main') {
			setTempData({
				...tempData,
				imageUrl: ''
			})
		} else {
			let othersImages = [...tempData.imagesUrl];
			othersImages.splice(index, 1);
			setTempData({
				...tempData,
				imagesUrl: [...othersImages]
			})
		}
	}

	const manageProduct = async (data, mode) => {
		const { title, category, unit, price, origin_price } = data;
		if (!title || !category || !unit || !price || !origin_price) {
			alert('產品輸入格式錯誤，新增失敗');
			return
		}
		let productData = {
			data
		}

		try {
			if (mode === 'create') {
				await axios.post(`${VITE_APP_BaseUrl}/v2/api/${VITE_APP_API}/admin/product`, productData)
			} else {
				await axios.put(`${VITE_APP_BaseUrl}/v2/api/${VITE_APP_API}/admin/product/${data.id}`, productData);
			}
			getProductsData();
			closeProductModal();
		} catch (error) {
		}
	}

	const deleteProduct = async (id) => {
		try {
			await axios.delete(`${VITE_APP_BaseUrl}/v2/api/${VITE_APP_API}/admin/product/${id}`);
			getProductsData();
			closeDeleteModal();
		} catch (error) {
		}
	}

	return (
		<div className='container'>
			{isLogin ? (
				<div className="row mt-3 d-flex justify-content-center">
					<div className="col-md-10">
						<div className="d-flex justify-content-end mb-2">
							<button type="button" className='btn btn-warning me-3' onClick={() => openProductModal("create", defaultData)}>新增產品</button>
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
			{/* product modal */}
			<div className="modal" ref={productModalRef} tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-scrollable modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title fs-5" id="productModalLabel">{functionMode === 'create' ? '建立產品' : '編輯產品'}</h3>
							<button type="button" className="btn-close" onClick={closeProductModal} aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-8">
									<div className="mb-3 row">
										<label htmlFor="productTitle" className='col-md-10'>標題</label>
										<div className="col-12">
											<input type="text" className="form-control" id='productTitle' placeholder='請輸入標題' name='title' value={tempData.title} onChange={handleProductInput} />
										</div>
									</div>
									<div className="mb-3">
										<div className="row">
											<label htmlFor="productCategory" className='col-md-6'>分類</label>
											<label htmlFor="productUnit" className='col-md-6'>單位</label>
										</div>
										<div className="row">
											<div className="col-md-6">
												<input type="text" className="form-control" id='productCategory' placeholder='請輸入分類' name='category' value={tempData.category} onChange={handleProductInput} />
											</div>
											<div className="col-md-6">
												<input type="text" className="form-control" id='productUnit' placeholder='請輸入單位' name='unit' value={tempData.unit} onChange={handleProductInput} />
											</div>
										</div>
									</div>
									<div className="mb-3">
										<div className="row">
											<label htmlFor="productOriginPrice" className='col-md-6'>原價</label>
											<label htmlFor="productPrice" className='col-md-6'>售價</label>
										</div>
										<div className="row">
											<div className="col-md-6">
												<input type="number" className="form-control" id='productOriginPrice' placeholder='請輸入原價' name='origin_price' value={tempData.origin_price} onChange={handleProductInput} />
											</div>
											<div className="col-md-6">
												<input type="number" className="form-control" id='productPrice' placeholder='請輸入售價' name='price' value={tempData.price} onChange={handleProductInput} />
											</div>
										</div>
									</div>
									<hr />
									<div className="mb-3 row">
										<label htmlFor="productDescription" className='col-12'>產品描述</label>
										<div className="col-12">
											<textarea className="form-control" id="productDescription" rows="2" placeholder='請輸入產品描述' name='description' value={tempData.description} onChange={handleProductInput}></textarea>
										</div>
									</div>
									<div className="mb-3 row">
										<label htmlFor="productContent" className='col-12'>說明內容</label>
										<div className="col-12">
											<textarea className="form-control" id="productContent" rows="2" placeholder='請輸入說明內容' name='content' value={tempData.content} onChange={handleProductInput}></textarea>
										</div>
									</div>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id="productActivate" name='is_enabled' checked={tempData?.is_enabled == 1 ? true : false} onChange={handleProductInput} />
										<label className="form-check-label" htmlFor="productActivate">
											是否啟用
										</label>
									</div>
								</div>
								<div className="col-4">
									<div className="row mb-3">
										<div className="col-12 d-flex flex-column mb-2">
											<p className="fs-5">主圖</p>
											<img src={tempData.imageUrl} alt="主圖" className='img-fluid' />
										</div>
										<label htmlFor="productImageUrl" className='col-12'>新增主圖網址</label>
										<div className="col-12 mb-2">
											<input className="form-control" id="productImageUrl" placeholder='請輸入圖片網址' name='imageUrl' value={tempData.imageUrl} onChange={handleProductInput} />
										</div>
										{tempData.imageUrl ? (
											<>
												<div className={tempData.imagesUrl.length > 0 ? 'col-6 d-flex flex-column d-none' : 'col-6 d-flex flex-column'}>
													<button type="button" className='btn btn-outline-primary' onClick={addProductImage}>新增圖片</button>
												</div>
												<div className={tempData.imagesUrl.length > 0 ? 'col-12 d-flex flex-column' : 'col-6 d-flex flex-column'}>
													<button type="button" className='btn btn-outline-danger' onClick={() => {
														removeProductImage("main")
													}}>移除圖片</button>
												</div>
											</>
										) : (
											<div className='col-12 d-flex flex-column'>
												<button type="button" className='btn btn-outline-primary' onClick={addProductImage}>新增圖片</button>
											</div>
										)}
									</div>
									{tempData.imagesUrl?.map((image, index) => (
										<div className="row mb-3" key={`${image}/${index}`}>
											<div className="col-12 d-flex flex-column mb-2">
												<p className="fs-5">{`副圖${index + 1}`}</p>
												<img src={image} alt={`副圖${index + 1}`} className='img-fluid' />
											</div>
											<label htmlFor="productImageUrl" className='col-12'>新增副圖網址</label>
											<div className="col-12 mb-2">
												<input className="form-control" id="productImageUrl" placeholder='請輸入圖片網址' value={image} onChange={(e) => {
													handleProductImages(index, e.target.value)
												}} />
											</div>
											{index !== tempData.imagesUrl.length - 1 || index === 4 ? (
												<div className='col d-flex flex-column'>
													<button type="button" className='btn btn-outline-danger' onClick={() => {
														removeProductImage('others', index)
													}}>移除圖片</button>
												</div>
											) : (
												<>
													<div className='col-6 d-flex flex-column'>
														<button type="button" className='btn btn-outline-primary' onClick={addProductImage}>新增圖片</button>
													</div>
													<div className="col-6 d-flex flex-column">
														<button type="button" className='btn btn-outline-danger' onClick={() => {
															removeProductImage('others', index)
														}}>移除圖片</button>
													</div>
												</>
											)}
										</div>)
									)
									}
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" onClick={closeProductModal}>取消</button>
							<button type="button" className="btn btn-primary" onClick={() => {
								manageProduct(tempData, functionMode)
							}}>{functionMode === 'create' ? '新增' : '儲存修改'}</button>
						</div>
					</div>
				</div>
			</div>

			{/* delete Modal */}
			<div className="modal" ref={deleteModalRef} tabIndex="-1" aria-labelledby="deleteLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title fs-5" id="deleteLabel">刪除商品</h3>
							<button type="button" className="btn-close" onClick={closeDeleteModal} aria-label="Close"></button>
						</div>
						<div className="modal-body">
							{`確定刪除"${tempData.title}"嗎?`}
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>取消</button>
							<button type="button" className="btn btn-danger" onClick={() => {
								deleteProduct(tempData.id)
							}}>確定刪除</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AppW3
