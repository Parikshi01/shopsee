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
    price: 1299,
    stock: 60,
  },
  {
    keyword: "watch",
    name: "Smartwatch",
    category: "Wearables",
    image: "https://static1.xdaimages.com/wordpress/wp-content/uploads/2023/09/apple-watch-ultra-2-front.png",
    description: "1.8 inch display smartwatch with health tracking, Bluetooth calling and sport modes.",
    price: 1499,
    stock: 45,
  },
  {
    keyword: "shoe",
    name: "Running Shoes",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight running shoes with cushioned sole and breathable mesh upper.",
    price: 2199,
    stock: 40,
  },
  {
    keyword: "book",
    name: "Finance Book",
    category: "Books",
    image: "https://m.media-amazon.com/images/I/71WY7U5ir7L._SL1024_.jpg",
    description: "Bestselling personal finance book with practical money habits and long-term strategies.",
    price: 299,
    stock: 70,
  },
  {
    keyword: "coffee",
    name: "Premium Instant Coffee",
    category: "Grocery",
    image: "https://foto.wuestenigel.com/wp-content/uploads/api/coffee-cup-filled-with-coffee-beans.jpeg",
    description: "Rich aroma premium coffee blend for smooth taste in every cup.",
    price: 649,
    stock: 90,
  },
  {
    keyword: "keyboard",
    name: "Wireless Keyboard and Mouse",
    category: "Computers",
    image: "https://switchandclick.com/wp-content/uploads/2023/02/q1-pro-tn.jpg",
    description: "Compact wireless keyboard and mouse combo with ergonomic key layout.",
    price: 1799,
    stock: 55,
  },
  {
    keyword: "charger",
    name: "Samsung 25W USB-C Fast Charger",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
    description: "Compact fast charging adapter compatible with smartphones, earbuds, and tablets.",
    price: 999,
    stock: 80,
  },
  {
    keyword: "air fryer",
    name: "Philips Air Fryer 4.1L",
    category: "Home",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=900&q=80",
    description: "Oil-free air fryer with digital presets for fries, snacks, and quick meals.",
    price: 6999,
    stock: 22,
  },
  {
    keyword: "headphone",
    name: "Noise Cancelling Headphones",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Over-ear Bluetooth headphones with active noise cancellation and long battery life.",
    price: 3299,
    stock: 35,
  },
  {
    keyword: "bottle",
    name: "Stainless Steel Water Bottle",
    category: "Home",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
    description: "Double-wall insulated bottle that keeps drinks cold or hot for extended hours.",
    price: 499,
    stock: 120,
  },
  {
    keyword: "iphone case",
    name: "Apple iPhone 15 Silicone Case",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80",
    description: "Soft-touch silicone case with microfiber lining and precise cutouts for iPhone 15.",
    price: 1199,
    stock: 65,
  },
  {
    keyword: "buds",
    name: "OnePlus Nord Buds 2",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1631176093617-63490a3d785c?auto=format&fit=crop&w=900&q=80",
    description: "Dual-mic AI noise cancellation earbuds with deep bass and 36-hour playback.",
    price: 2499,
    stock: 38,
  },
  {
    keyword: "mouse",
    name: "Logitech MX Master Wireless Mouse",
    category: "Computers",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    description: "Premium productivity mouse with precision scroll wheel and multi-device pairing.",
    price: 7499,
    stock: 26,
  },
  {
    keyword: "backpack",
    name: "HP 15.6 Laptop Backpack",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=900&q=80",
    description: "Water-resistant laptop backpack with cushioned compartment and organizer pockets.",
    price: 1299,
    stock: 58,
  },
  {
    keyword: "cookware",
    name: "Prestige Non-Stick Cookware Set",
    category: "Home",
    image: "https://images.unsplash.com/photo-1584990347449-a6e59f6dbf98?auto=format&fit=crop&w=900&q=80",
    description: "3-piece non-stick cookware set with induction base and heat-resistant handles.",
    price: 2899,
    stock: 30,
  },
  {
    keyword: "lunch box",
    name: "Milton Insulated Lunch Box",
    category: "Home",
    image: "https://images.unsplash.com/photo-1543332164-6e82f355bad5?auto=format&fit=crop&w=900&q=80",
    description: "Leak-proof insulated lunch box set to keep meals fresh and warm for hours.",
    price: 799,
    stock: 77,
  },
  {
    keyword: "kettle",
    name: "Pigeon Electric Kettle 1.5L",
    category: "Home",
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=80",
    description: "Fast-boil electric kettle with auto shut-off and dry-boil protection.",
    price: 1099,
    stock: 42,
  },
  {
    keyword: "casio",
    name: "Casio Vintage Digital Watch",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
    description: "Classic unisex digital watch with alarm, stopwatch, and durable strap.",
    price: 1899,
    stock: 34,
  },
  {
    keyword: "sneakers",
    name: "Campus Casual Sneakers",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
    description: "Everyday sneakers with lightweight sole and cushioned footbed for long wear.",
    price: 1799,
    stock: 49,
  },
  {
    keyword: "jeans",
    name: "Levi's Men's Slim Fit Jeans",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80",
    description: "Stretch denim slim-fit jeans with classic five-pocket style and clean wash.",
    price: 2499,
    stock: 33,
  },
  {
    keyword: "noisefit",
    name: "NoiseFit Active 2 Smartwatch",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=900&q=80",
    description: "Fitness smartwatch with SpO2 tracking, Bluetooth calling, and custom watch faces.",
    price: 2299,
    stock: 41,
  },
  {
    keyword: "power bank",
    name: "MI Power Bank 20000mAh",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80",
    description: "High-capacity power bank with dual USB output and device protection layers.",
    price: 1999,
    stock: 64,
  },
  {
    keyword: "hdmi",
    name: "Amazon Basics HDMI Cable 2m",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80",
    description: "High-speed HDMI cable supporting 4K output for TVs, monitors, and consoles.",
    price: 399,
    stock: 110,
  },
  {
    keyword: "pen drive",
    name: "SanDisk 128GB USB 3.2 Pen Drive",
    category: "Computers",
    image: "https://images.unsplash.com/photo-1617483645731-7ceaa73f3f73?auto=format&fit=crop&w=900&q=80",
    description: "Compact high-speed pen drive for quick file transfer and backups.",
    price: 999,
    stock: 73,
  },
  {
    keyword: "router",
    name: "TP-Link Wi-Fi 6 Router",
    category: "Computers",
    image: "https://images.unsplash.com/photo-1649779124753-8ee31f8f58f6?auto=format&fit=crop&w=900&q=80",
    description: "Dual-band Wi-Fi 6 router with strong coverage and stable high-speed connectivity.",
    price: 4299,
    stock: 24,
  },
  {
    keyword: "bulb",
    name: "Syska LED Bulb 12W Pack of 2",
    category: "Home",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
    description: "Energy-efficient LED bulbs with bright output and long service life.",
    price: 299,
    stock: 150,
  },
  {
    keyword: "pillow",
    name: "Wakefit Orthopedic Pillow",
    category: "Home",
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80",
    description: "Memory foam pillow designed for neck support and comfortable sleeping posture.",
    price: 899,
    stock: 52,
  },
  {
    keyword: "monitor",
    name: "Samsung 24 Inch IPS Monitor",
    category: "Computers",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    description: "Full HD IPS monitor with eye-care mode and slim-bezel design.",
    price: 10499,
    stock: 18,
  },
  {
    keyword: "usb hub",
    name: "Portronics USB-C Hub 7-in-1",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
    description: "Multiport USB-C hub with HDMI, USB 3.0, card reader, and PD support.",
    price: 2799,
    stock: 29,
  },
  {
    keyword: "heater",
    name: "Havells Room Heater",
    category: "Home",
    image: "https://images.unsplash.com/photo-1570804372107-13f4a3f0a1ef?auto=format&fit=crop&w=900&q=80",
    description: "Compact room heater with overheat protection and adjustable heat settings.",
    price: 2299,
    stock: 21,
  },
  {
    keyword: "tshirt",
    name: "Nike Dri-FIT Training T-Shirt",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Sweat-wicking performance t-shirt for gym and active lifestyle.",
    price: 1499,
    stock: 46,
  },
  {
    keyword: "formal shirt",
    name: "Peter England Formal Shirt",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
    description: "Cotton blend slim-fit formal shirt suitable for office and events.",
    price: 1599,
    stock: 39,
  },
  {
    keyword: "storage container",
    name: "Borosil Glass Storage Containers Set",
    category: "Home",
    image: "https://images.unsplash.com/photo-1560693225-b8507d6f3aa8?auto=format&fit=crop&w=900&q=80",
    description: "Microwave-safe glass containers with airtight lids.",
    price: 1399,
    stock: 44,
  },
  {
    keyword: "noodles",
    name: "Maggi 2-Minute Noodles Family Pack",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80",
    description: "Quick-cook masala noodles family pack for snacks and meals.",
    price: 199,
    stock: 140,
  },
  {
    keyword: "tea",
    name: "Tata Tea Gold 1kg",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80",
    description: "Premium tea blend with rich aroma and strong flavor for daily brewing.",
    price: 599,
    stock: 88,
  },
  {
    keyword: "sunflower oil",
    name: "Fortune Sunflower Oil 1L",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
    description: "Refined sunflower oil suitable for everyday cooking and deep frying.",
    price: 189,
    stock: 98,
  },
  {
    keyword: "oats",
    name: "Saffola Oats Masala 1kg",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=80",
    description: "High-fiber masala oats for quick healthy breakfast and snacks.",
    price: 349,
    stock: 67,
  },
  {
    keyword: "infant formula",
    name: "Aptamil Infant Formula 400g",
    category: "Baby",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
    description: "Infant nutrition powder with essential vitamins and minerals.",
    price: 699,
    stock: 32,
  },
  {
    keyword: "diapers",
    name: "Mee Mee Baby Diapers Large Pack",
    category: "Baby",
    image: "https://images.unsplash.com/photo-1542382257-80dedb725088?auto=format&fit=crop&w=900&q=80",
    description: "Soft, breathable baby diapers with leak-lock channels for overnight comfort.",
    price: 899,
    stock: 56,
  },
  {
    keyword: "pen",
    name: "Flair Ball Pens Pack of 20",
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    description: "Smooth-writing ball pens with long-lasting ink for school and office.",
    price: 249,
    stock: 130,
  },
  {
    keyword: "notebook",
    name: "Classmate Long Notebook Set",
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
    description: "High-quality ruled notebooks for school notes and daily writing.",
    price: 399,
    stock: 95,
  },
  {
    keyword: "desk lamp",
    name: "LED Study Desk Lamp",
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "Eye-care LED desk lamp with touch controls and adjustable brightness levels.",
    price: 1299,
    stock: 47,
  },
  {
    keyword: "trimmer",
    name: "Philips Beard Trimmer",
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&w=900&q=80",
    description: "Cordless trimmer with skin-friendly blades and precision length settings.",
    price: 1899,
    stock: 37,
  },
  {
    keyword: "toothbrush",
    name: "Oral-B Electric Toothbrush",
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1559591935-c6ad1c561fd6?auto=format&fit=crop&w=900&q=80",
    description: "Rechargeable electric toothbrush for deeper cleaning and healthier gums.",
    price: 2499,
    stock: 31,
  },
  {
    keyword: "yoga mat",
    name: "Anti-Slip Yoga Mat",
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80",
    description: "High-grip yoga mat with extra cushioning for home workouts and stretches.",
    price: 999,
    stock: 62,
  },
  {
    keyword: "dumbbell",
    name: "Adjustable Dumbbell Pair 10kg",
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    description: "Durable adjustable dumbbells for strength training and home gym routines.",
    price: 3299,
    stock: 28,
  },
  {
    keyword: "protein",
    name: "Whey Protein Isolate 1kg",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=900&q=80",
    description: "High-protein isolate powder with fast absorption and low sugar formula.",
    price: 2999,
    stock: 36,
  },
  {
    keyword: "face wash",
    name: "Vitamin C Face Wash",
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=900&q=80",
    description: "Gentle foaming face wash with vitamin C for bright and refreshed skin.",
    price: 349,
    stock: 84,
  },
  {
    keyword: "sunscreen",
    name: "SPF 50 Sunscreen Gel",
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight broad-spectrum sunscreen gel with non-greasy matte finish.",
    price: 499,
    stock: 76,
  },
  {
    keyword: "gaming chair",
    name: "Ergonomic Gaming Chair",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80",
    description: "High-back gaming chair with lumbar support and adjustable armrests.",
    price: 8499,
    stock: 19,
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
      price: prev.price || String(template.price),
      stock: prev.stock || String(template.stock),
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
              Auto Fill Product Details
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
