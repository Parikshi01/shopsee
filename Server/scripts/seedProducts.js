require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const baseProducts = [
  {
    name: "boAt Airdopes 141 Bluetooth Earbuds",
    description: "42H playback, ENx call noise cancellation, ASAP charging.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 1299,
  },
  {
    name: "Fire-Boltt Ninja Call Pro Smartwatch",
    description: "1.83 inch display, Bluetooth calling, 100+ sports modes.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    category: "Wearables",
    price: 1499,
  },
  {
    name: "Samsung 25W USB-C Fast Charger",
    description: "Super fast charging adapter for Galaxy and USB-C devices.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    price: 999,
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    category: "Books",
    price: 299,
  },
  {
    name: "Philips Air Fryer 4.1L",
    description: "Rapid air technology with presets for healthy frying.",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 6999,
  },
  {
    name: "Puma Running Shoes",
    description: "SoftFoam comfort insole and lightweight upper.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    price: 2199,
  },
  {
    name: "Lenovo Wireless Keyboard and Mouse Combo",
    description: "2.4GHz wireless combo with ergonomic design.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    category: "Computers",
    price: 1799,
  },
  {
    name: "Nescafe Gold Blend Coffee 200g",
    description: "Rich aroma instant coffee for premium taste.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    category: "Grocery",
    price: 649,
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Deep bass, long battery, and clear calls.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 3299,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Vacuum insulated bottle keeps drinks cold and hot.",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 499,
  },
];

const buildProducts = () =>
  Array.from({ length: 100 }, (_, index) => {
    const base = baseProducts[index % baseProducts.length];
    const step = (index % 7) * 45;
    const price = base.price + step;
    const stock = 10 + ((index * 7) % 120);

    return {
      name: `${base.name} ${index + 1}`,
      description: base.description,
      image: base.image,
      category: base.category,
      price,
      stock,
    };
  });

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopshee";
  await mongoose.connect(mongoUri);

  const products = buildProducts();
  const ops = products.map((product) => ({
    updateOne: {
      filter: { name: product.name },
      update: { $set: product },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(ops, { ordered: false });
  const total = await Product.countDocuments();

  console.log(`Seed complete. Upserted: ${result.upsertedCount || 0}, Modified: ${result.modifiedCount || 0}`);
  console.log(`Total products in DB: ${total}`);
};

run()
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
