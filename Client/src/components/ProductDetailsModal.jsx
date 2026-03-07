const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function ProductDetailsModal({ product, onClose, onBuy, buying = false }) {
  if (!product) return null;

  const title = product.title || product.name;
  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || Math.round(price * 1.45));
  const discount = Math.max(0, Math.round(((mrp - price) / mrp) * 100));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <img
          src={product.mainImg || product.image}
          alt={title}
          className="modal-img large"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/modal-${encodeURIComponent(title)}/900/700`;
          }}
        />
        <div>
          <h3>{title}</h3>
          <p className="muted">{product.description || "No details available."}</p>
          <p>Category: {product.category || "General"}</p>
          <p>Price: {formatCurrency(price)}</p>
          <p className="old-price">M.R.P: {formatCurrency(mrp)}</p>
          <p className="save-text">Save {discount}%</p>
          <p>Stock: {product.stock ?? "-"}</p>
          <div className="card-actions">
            <button className="btn-amz-buy" onClick={() => onBuy(product)} disabled={buying}>
              {buying ? "Processing..." : "Buy Now"}
            </button>
            <button className="btn-amz-details" onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
