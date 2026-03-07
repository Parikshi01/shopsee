import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import ProductDetailsModal from "../components/ProductDetailsModal";
import { useAuth } from "../context/AuthContext";
import catalog from "../data/catalog";
import { addDemoOrder } from "../utils/demoOrders";

export default function ProductsPage() {
  const [backendProducts, setBackendProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [buyingId, setBuyingId] = useState("");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const selectedCategory = searchParams.get("category") || "";

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setBackendProducts(Array.isArray(data) ? data : []);
    } catch {
      setBackendProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const mergedProducts = useMemo(() => {
    const mappedBackend = backendProducts.map((item) => ({ ...item, source: "api" }));
    const mappedDemo = catalog.map((item) => ({ ...item, source: "demo" }));
    const all = [...mappedBackend, ...mappedDemo];

    return all.filter((item) => {
      const productName = (item.title || item.name || "").toLowerCase();
      const productCategory = (item.category || "").toLowerCase();
      const qMatch = productName.includes(query.toLowerCase());
      const cMatch = !selectedCategory || productCategory === selectedCategory.toLowerCase();
      return qMatch && cMatch;
    });
  }, [backendProducts, query, selectedCategory]);

  const handleBuy = async (product) => {
    if (!isAuthenticated || product.source === "demo" || !product._id) {
      addDemoOrder({ product, user });
      setMessage(`Order placed for ${product.title || product.name}. ${isAuthenticated ? "" : "Please login to track orders on your account."}`);
      return;
    }

    setBuyingId(product._id);
    setMessage("");

    try {
      await api.post("/orders", { items: [{ product: product._id, quantity: 1 }] });
      setMessage(`Order placed for ${product.title || product.name}`);
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not place order");
    } finally {
      setBuyingId("");
    }
  };

  if (loading) return <div className="loader">Loading products...</div>;

  return (
    <section className="section-block">
      <div className="section-head">
        <h2>Today's Deals</h2>
        <input
          type="text"
          className="inline-search"
          placeholder="Search in products"
          value={query}
          onChange={(e) => {
            const nextQuery = e.target.value;
            setQuery(nextQuery);
            const nextParams = new URLSearchParams(searchParams);
            if (nextQuery) nextParams.set("q", nextQuery);
            else nextParams.delete("q");
            setSearchParams(nextParams);
          }}
        />
      </div>

      {message && <p className="status">{message}</p>}

      <div className="amazon-grid">
        {mergedProducts.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            onBuy={handleBuy}
            onView={setSelected}
            buying={buyingId === product._id}
          />
        ))}
      </div>

      <ProductDetailsModal
        product={selected}
        onClose={() => setSelected(null)}
        onBuy={handleBuy}
        buying={selected && selected._id ? buyingId === selected._id : false}
      />
    </section>
  );
}
