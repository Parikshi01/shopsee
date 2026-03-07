import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import ProductDetailsModal from "../components/ProductDetailsModal";
import { useAuth } from "../context/AuthContext";
import { addDemoOrder } from "../utils/demoOrders";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deals = useMemo(
    () =>
      products
        .filter((item) => (item.title || item.name || "").toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6),
    [products, query]
  );

  const handleBuy = (product) => {
    addDemoOrder({ product, user });
    setMessage(`Order placed for ${product.title || product.name}. ${isAuthenticated ? "" : "Login to track this order on your account."}`);
  };

  if (loading) return <div className="loader">Loading products...</div>;

  return (
    <section>
      <div className="hero-amz">
        <div>
          <p className="hero-kicker">Great Indian Savings</p>
          <h1>Shop daily essentials and gadgets at great prices</h1>
          <p>Discover top picks with fast delivery and best deals.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn-amz-buy">
              Start Shopping
            </Link>
            <Link to="/register" className="btn-amz-details">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <section className="section-block">
        <div className="section-head">
          <h2>Best Sellers</h2>
          <input
            type="text"
            className="inline-search"
            placeholder="Filter products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="deals-grid">
          {deals.map((item) => (
            <ProductCard product={item} onBuy={handleBuy} onView={setSelected} key={item._id || item.id} />
          ))}
        </div>
        {message && <p className="status">{message}</p>}
      </section>

      <ProductDetailsModal product={selected} onClose={() => setSelected(null)} onBuy={handleBuy} />
    </section>
  );
}
