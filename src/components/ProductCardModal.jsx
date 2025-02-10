import { useState } from "react";

const ProductCardModal = ({ tempProduct, modalRef, productCardModal, addCarts }) => {

	const [tempQty, setTempQty] = useState(1);

	const { id, title, imageUrl, category, content, description, origin_price, price } = tempProduct;

	const closeModal = () => {
		productCardModal.current.hide();
		setTempQty(1);
	}


	return (
		<div className="modal" tabIndex="-1" ref={modalRef}>
			<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
				<div className="modal-content">
					<div className="modal-header">
						<h3 className="modal-title">{title}</h3>
						<button
							type="button"
							className="btn-close"
							onClick={closeModal}
						></button>
					</div>
					<div className="modal-body">
						<img
							src={imageUrl}
							className="card-img-top img-fluid"
							alt={title}
						/>
						<p className="mt-3">{`商品類別：${category}`}</p>
						<p className="mt-3">{`商品${content}`}</p>
						<p className="mt-3">{`商品描述：${description}`}</p>
						<p className="mt-3">{`商品原價：${origin_price}`}</p>
						<p className="mt-3 text-danger">{`搶購特價：${price}`}</p>
						<div className="d-flex align-items-center mt-3">
							購買數量：
							<button
								type="button"
								className="btn btn-sm btn-outline-secondary ms-3"
								disabled={tempQty === 1 ? true : false}
								onClick={() => {
									setTempQty(tempQty - 1);
								}}
							>
								<i className="bi bi-dash fs-5"></i>
							</button>
							<span className="mx-2">{tempQty}</span>
							<button
								type="button"
								className="btn btn-sm btn-outline-warning"
								onClick={() => {
									setTempQty(tempQty + 1);
								}}
							>
								<i className="bi bi-plus fs-5"></i>
							</button>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={closeModal}
						>
							取消
						</button>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => {
								addCarts(id, tempQty);
								closeModal();
							}}
						>
							加入購物車
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductCardModal
