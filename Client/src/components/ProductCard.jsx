const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function ProductCard({ product, onBuy, buying, onView }) {
  const title = product.title || product.name;
  const price = product.price ?? 0;
  const mrp = product.mrp || Math.round(price * 1.45);
  const discount = Math.max(0, Math.round(((mrp - price) / mrp) * 100));

  return (
    <article className="amazon-card">
      <img
        src={product.mainImg || product.image || "https://via.placeholder.com/500x320?text=Product"}
        alt={title}
        className="amazon-card-image"
        onError={(e) => {
          e.currentTarget.src = `https://picsum.photos/seed/fallback-${encodeURIComponent(title)}/900/700`;
        }}
      />

      <div className="amazon-card-body">
        <h3>{title}</h3>
        <p className="muted">{product.description || "No details available."}</p>

        <p className="rating-row">
          <span>{(product.rating || 4.0).toFixed(1)} *</span>
          <span className="muted">({(product.reviews || 0).toLocaleString("en-IN")})</span>
        </p>

        <div className="price-row">
          <strong>{formatCurrency(price)}</strong>
          <span className="old-price">M.R.P: {formatCurrency(mrp)}</span>
        </div>
        <p className="save-text">Save {discount}%</p>

        <p className="muted">Category: {product.category || "General"}</p>
        <p className="muted">In stock: {product.stock ?? "-"}</p>
        <p className="prime">Eligible for FREE delivery</p>

        <div className="card-actions">
          <button className="btn-amz-buy" onClick={() => onBuy(product)} disabled={buying}>
            {buying ? "Processing..." : "Buy Now"}
          </button>
          <button className="btn-amz-details" type="button" onClick={() => onView(product)}>
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
