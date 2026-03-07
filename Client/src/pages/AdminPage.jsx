import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PRODUCT_TEMPLATES = [
  {
    keyword: "earbud",
    name: "Wireless Earbuds",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    description: "Bluetooth 5.3 earbuds with ENC, 40+ hour battery backup and fast charging case.",
  },
  {
    keyword: "watch",
    name: "Smartwatch",
    category: "Wearables",
    image: "https://static1.xdaimages.com/wordpress/wp-content/uploads/2023/09/apple-watch-ultra-2-front.png",
    description: "1.8 inch display smartwatch with health tracking, Bluetooth calling and sport modes.",
  },
  {
    keyword: "shoe",
    name: "Running Shoes",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight running shoes with cushioned sole and breathable mesh upper.",
  },
  {
    keyword: "book",
    name: "Finance Book",
    category: "Books",
    image: "https://m.media-amazon.com/images/I/71WY7U5ir7L._SL1024_.jpg",
    description: "Bestselling personal finance book with practical money habits and long-term strategies.",
  },
  {
    keyword: "coffee",
    name: "Premium Instant Coffee",
    category: "Grocery",
    image: "https://foto.wuestenigel.com/wp-content/uploads/api/coffee-cup-filled-with-coffee-beans.jpeg",
    description: "Rich aroma premium coffee blend for smooth taste in every cup.",
  },
  {
    keyword: "keyboard",
    name: "Wireless Keyboard and Mouse",
    category: "Computers",
    image: "https://switchandclick.com/wp-content/uploads/2023/02/q1-pro-tn.jpg",
    description: "Compact wireless keyboard and mouse combo with ergonomic key layout.",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [dashboard, setDashboard] = useState({ totals: { users: 0, admins: 0 } });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [stockDraft, setStockDraft] = useState({});
  const [savingStockId, setSavingStockId] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, usersRes, productsRes, ordersRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/users"),
        api.get("/products"),
        api.get("/orders"),
      ]);
      setDashboard(dashRes.data || { totals: { users: 0, admins: 0 } });
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const lowStock = products.filter((p) => Number(p.stock || 0) <= 10).length;
    const totalSales = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return {
      totalProducts,
      totalOrders,
      lowStock,
      totalSales,
    };
  }, [products, orders]);

  const onProductInput = (e) => {
    setProductForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyProductTemplate = () => {
    const value = productForm.name.trim().toLowerCase();
    const template = PRODUCT_TEMPLATES.find(
      (item) => value.includes(item.keyword) || value === item.name.toLowerCase()
    );

    if (!template) return;

    setProductForm((prev) => ({
      ...prev,
      category: prev.category || template.category,
      image: prev.image || template.image,
      description: prev.description || template.description,
    }));
  };

  const onUserInput = (e) => {
    setUserForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/products", {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category,
        image: productForm.image,
      });
      setMessage("Product added successfully.");
      setProductForm({ name: "", description: "", price: "", stock: "", category: "", image: "" });
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add product");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/users", userForm);
      setMessage("User created successfully.");
      setUserForm({ name: "", email: "", password: "", role: "user" });
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create user");
    }
  };

  const promoteUser = async (userId) => {
    setMessage("");
    setError("");
    try {
      await api.patch(`/auth/promote/${userId}`);
      setMessage("User promoted to admin.");
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not promote user");
    }
  };

  const removeUser = async (userId) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/users/${userId}`);
      setMessage("User deleted.");
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete user");
    }
  };

  const removeProduct = async (productId) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/products/${productId}`);
      setMessage("Product deleted.");
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product");
    }
  };

  const updateStock = async (productId, currentStock) => {
    const nextStock = Number(stockDraft[productId] ?? currentStock);
    setSavingStockId(productId);
    setMessage("");
    setError("");
    try {
      await api.put(`/products/${productId}`, { stock: nextStock });
      setMessage("Stock updated.");
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update stock");
    } finally {
      setSavingStockId("");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setMessage("");
    setError("");
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setMessage("Order status updated.");
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order status");
    }
  };

  if (loading) return <div className="loader">Loading admin panel...</div>;

  return (
    <section className="admin-wrap">
      <div className="admin-head">
        <h2>Admin Panel</h2>
        <button className="btn-amz-details" type="button" onClick={loadAdminData}>
          Refresh
        </button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
          Products
        </button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Orders
        </button>
        <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
          Users
        </button>
      </div>

      {message && <p className="status">{message}</p>}
      {error && <p className="error">{error}</p>}

      {activeTab === "dashboard" && (
        <div className="admin-grid">
          <article className="card stat-card">
            <h3>Total Users</h3>
            <p>{dashboard.totals?.users ?? 0}</p>
          </article>
          <article className="card stat-card">
            <h3>Total Admins</h3>
            <p>{dashboard.totals?.admins ?? 0}</p>
          </article>
          <article className="card stat-card">
            <h3>Total Products</h3>
            <p>{metrics.totalProducts}</p>
          </article>
          <article className="card stat-card">
            <h3>Total Orders</h3>
            <p>{metrics.totalOrders}</p>
          </article>
          <article className="card stat-card">
            <h3>Low Stock Items</h3>
            <p>{metrics.lowStock}</p>
          </article>
          <article className="card stat-card">
            <h3>Total Sales</h3>
            <p>Rs. {metrics.totalSales.toLocaleString("en-IN")}</p>
          </article>
        </div>
      )}

      {activeTab === "products" && (
        <div className="admin-content">
          <form className="panel form-grid admin-product-form" onSubmit={addProduct}>
            <h3>Add Product</h3>
            <input
              name="name"
              value={productForm.name}
              onChange={onProductInput}
              onBlur={applyProductTemplate}
              placeholder="Name"
              list="product-name-options"
              required
            />
            <datalist id="product-name-options">
              {PRODUCT_TEMPLATES.map((item) => (
                <option key={item.keyword} value={item.name} />
              ))}
            </datalist>
            <input name="category" value={productForm.category} onChange={onProductInput} placeholder="Category" />
            <input type="number" min={0} name="price" value={productForm.price} onChange={onProductInput} placeholder="Price" required />
            <input type="number" min={0} name="stock" value={productForm.stock} onChange={onProductInput} placeholder="Stock" required />
            <input name="image" value={productForm.image} onChange={onProductInput} placeholder="Image URL" required />
            <textarea
              name="description"
              value={productForm.description}
              onChange={onProductInput}
              placeholder="Description"
              rows={2}
              required
            />
            <button className="btn-amz-details admin-action-btn" type="button" onClick={applyProductTemplate}>
              Auto Fill Image and Description
            </button>
            <button className="btn-amz-buy admin-action-btn" type="submit">Add Product</button>
          </form>

          <div className="panel table-wrap">
            <h3>Manage Products</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>Rs. {Number(product.price || 0).toLocaleString("en-IN")}</td>
                    <td>
                      <div className="stock-editor">
                        <input
                          type="number"
                          min={0}
                          value={stockDraft[product._id] ?? product.stock}
                          onChange={(e) =>
                            setStockDraft((prev) => ({ ...prev, [product._id]: e.target.value }))
                          }
                        />
                        <button
                          className="btn-amz-details"
                          type="button"
                          disabled={savingStockId === product._id}
                          onClick={() => updateStock(product._id, product.stock)}
                        >
                          Save
                        </button>
                      </div>
                    </td>
                    <td>{product.category || "General"}</td>
                    <td>
                      <button className="btn-danger" type="button" onClick={() => removeProduct(product._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="panel table-wrap">
          <h3>Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Items</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-8)}</td>
                  <td>{order.user?.email || "N/A"}</td>
                  <td>Rs. {Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                  <td>{order.items?.length || 0}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div className="admin-content">
          <form className="panel form-grid" onSubmit={createUser}>
            <h3>Create User</h3>
            <input name="name" value={userForm.name} onChange={onUserInput} placeholder="Full name" required />
            <input type="email" name="email" value={userForm.email} onChange={onUserInput} placeholder="Email" required />
            <input
              type="password"
              name="password"
              value={userForm.password}
              onChange={onUserInput}
              placeholder="Password"
              minLength={6}
              required
            />
            <select name="role" value={userForm.role} onChange={onUserInput}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <button className="btn-amz-buy admin-action-btn" type="submit">Create User</button>
          </form>

          <div className="panel table-wrap">
            <h3>Manage Users</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="row-actions">
                      {user.role !== "admin" && (
                        <button className="btn-amz-details" type="button" onClick={() => promoteUser(user._id)}>
                          Make Admin
                        </button>
                      )}
                      <button className="btn-danger" type="button" onClick={() => removeUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
