import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { getDemoOrdersByUser } from "../utils/demoOrders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      const demoOrders = getDemoOrdersByUser(user);

      try {
        const { data } = await api.get("/orders/my");
        const apiOrders = Array.isArray(data) ? data : [];
        setOrders([...demoOrders, ...apiOrders]);
      } catch (err) {
        setOrders(demoOrders);
        if (!demoOrders.length) {
          setError(err.response?.data?.message || "Could not load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="loader">Loading orders...</div>;

  return (
    <section>
      <h2>My Orders</h2>
      {error && <p className="error">{error}</p>}
      <div className="stack">
        {orders.map((order) => (
          <article className="card" key={order._id || order.id}>
            <h3>Order #{(order._id || order.id).slice(-6)}</h3>
            <p>Status: {order.status}</p>
            <p>Total: Rs. {order.totalAmount}</p>
            <p>Items: {order.items?.length || 0}</p>
            {order.source === "demo" && <p className="muted">Demo order</p>}
          </article>
        ))}
      </div>
      {!orders.length && <p>No orders found.</p>}
    </section>
  );
}
