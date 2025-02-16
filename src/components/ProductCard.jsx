import { Link } from 'react-router';

const ProductCard = ({ product, addCarts }) => {
  const { id, title, imageUrl, origin_price, description, price, category } =
    product;
  return (
    <div className="productCard card">
      <span className="productCategory text-bg-warning rounded-2">
        {category}
      </span>
      <img
        src={imageUrl}
        className="card-img-top object-fit-cover"
        style={{
          height: '250px',
        }}
        alt={title}
      />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">
          <del>{`價格：${origin_price}`}</del>
        </p>
        <p className="card-text text-danger">{`特價：${price}`}</p>
        <p className="card-text text-truncate">{`商品描述：${description}`}</p>
      </div>
      <div className="card-footer d-flex justify-content-center">
        <Link className="btn btn-outline-primary rounded-end-0" to={id}>
          查看細節
        </Link>
        <button
          type="button"
          className="btn btn-outline-danger rounded-start-0"
          onClick={() => {
            addCarts(id);
          }}
        >
          加入購物車
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
