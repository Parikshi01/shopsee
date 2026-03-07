const STORAGE_KEY = "shopshee_demo_orders";

const readOrders = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const addDemoOrder = ({ product, user }) => {
  const userKey = user?._id || user?.email || "guest";
  const title = product.title || product.name;
  const price = Number(product.price || 0);

  const newOrder = {
    id: `demo-${Date.now()}`,
    source: "demo",
    userKey,
    status: "placed",
    createdAt: new Date().toISOString(),
    totalAmount: price,
    items: [
      {
        product: {
          title,
          image: product.image || product.mainImg || "",
        },
        quantity: 1,
        price,
      },
    ],
  };

  const orders = readOrders();
  orders.unshift(newOrder);
  writeOrders(orders);

  return newOrder;
};

export const getDemoOrdersByUser = (user) => {
  const userKey = user?._id || user?.email || "guest";
  return readOrders().filter((order) => order.userKey === userKey);
};
