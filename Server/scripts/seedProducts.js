require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  {
    name: "boAt Airdopes 141 Bluetooth Earbuds",
    description: "Wireless earbuds with ENx noise cancellation, low-latency mode, and fast USB-C charging case.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 1299,
    stock: 60,
  },
  {
    name: "Fire-Boltt Ninja Call Pro Smartwatch",
    description: "1.83 inch display smartwatch with Bluetooth calling, heart-rate tracking, and 100+ sports modes.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    category: "Wearables",
    price: 1499,
    stock: 45,
  },
  {
    name: "Samsung 25W USB-C Fast Charger",
    description: "Compact fast charging adapter compatible with smartphones, earbuds, and USB-C tablets.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    price: 999,
    stock: 80,
  },
  {
    name: "The Psychology of Money",
    description: "Bestselling personal finance book with practical lessons on behavior, risk, and long-term wealth.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    category: "Books",
    price: 299,
    stock: 70,
  },
  {
    name: "Philips Air Fryer 4.1L",
    description: "Oil-free air fryer with digital presets for fries, snacks, and quick everyday meals.",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 6999,
    stock: 22,
  },
  {
    name: "Puma Running Shoes",
    description: "Lightweight running shoes with cushioned midsole and breathable mesh for daily training.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    price: 2199,
    stock: 40,
  },
  {
    name: "Lenovo Wireless Keyboard and Mouse Combo",
    description: "Full-size keyboard and ergonomic mouse combo with 2.4GHz USB receiver and silent clicks.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    category: "Computers",
    price: 1799,
    stock: 55,
  },
  {
    name: "Nescafe Gold Blend Coffee 200g",
    description: "Premium instant coffee blend with rich aroma and smooth balanced taste.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    category: "Grocery",
    price: 649,
    stock: 90,
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Over-ear Bluetooth headphones with active noise cancellation and all-day battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 3299,
    stock: 35,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-wall insulated bottle that keeps drinks cold or hot for extended hours.",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 499,
    stock: 120,
  },
  {
    name: "Apple iPhone 15 Silicone Case",
    description: "Soft-touch silicone case with microfiber lining and precise cutouts for iPhone 15.",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    price: 1199,
    stock: 65,
  },
  {
    name: "OnePlus Nord Buds 2",
    description: "Dual-mic AI noise cancellation earbuds with punchy bass and up to 36-hour playback.",
    image: "https://images.unsplash.com/photo-1631176093617-63490a3d785c?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 2499,
    stock: 38,
  },
  {
    name: "Logitech MX Master Wireless Mouse",
    description: "Premium productivity mouse with precision wheel, gesture controls, and multi-device support.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    category: "Computers",
    price: 7499,
    stock: 26,
  },
  {
    name: "HP 15.6 Laptop Backpack",
    description: "Water-resistant laptop backpack with cushioned compartment and organizer pockets.",
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    price: 1299,
    stock: 58,
  },
  {
    name: "Prestige Non-Stick Cookware Set",
    description: "3-piece non-stick cookware set with induction base and heat-resistant handles.",
    image: "https://images.unsplash.com/photo-1584990347449-a6e59f6dbf98?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 2899,
    stock: 30,
  },
  {
    name: "Milton Insulated Lunch Box",
    description: "Leak-proof insulated lunch box set to keep meals fresh and warm for hours.",
    image: "https://images.unsplash.com/photo-1543332164-6e82f355bad5?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 799,
    stock: 77,
  },
  {
    name: "Pigeon Electric Kettle 1.5L",
    description: "Fast-boil electric kettle with auto shut-off and dry-boil protection.",
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 1099,
    stock: 42,
  },
  {
    name: "Casio Vintage Digital Watch",
    description: "Classic unisex digital watch with alarm, stopwatch, and durable resin strap.",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
    category: "Wearables",
    price: 1899,
    stock: 34,
  },
  {
    name: "Campus Casual Sneakers",
    description: "Everyday sneakers with lightweight sole and cushioned footbed for long wear.",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    price: 1799,
    stock: 49,
  },
  {
    name: "Levi's Men's Slim Fit Jeans",
    description: "Stretch denim slim-fit jeans with classic five-pocket style and clean wash.",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    price: 2499,
    stock: 33,
  },
  {
    name: "NoiseFit Active 2 Smartwatch",
    description: "Fitness smartwatch with SpO2 tracking, Bluetooth calling, and custom watch faces.",
    image: "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=900&q=80",
    category: "Wearables",
    price: 2299,
    stock: 41,
  },
  {
    name: "MI Power Bank 20000mAh",
    description: "High-capacity power bank with dual USB output and advanced chip protection.",
    image: "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    price: 1999,
    stock: 64,
  },
  {
    name: "Amazon Basics HDMI Cable 2m",
    description: "High-speed HDMI cable supporting 4K output for TVs, monitors, and consoles.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    price: 399,
    stock: 110,
  },
  {
    name: "SanDisk 128GB USB 3.2 Pen Drive",
    description: "Compact high-speed pen drive for quick file transfer and backup.",
    image: "https://images.unsplash.com/photo-1617483645731-7ceaa73f3f73?auto=format&fit=crop&w=900&q=80",
    category: "Computers",
    price: 999,
    stock: 73,
  },
  {
    name: "TP-Link Wi-Fi 6 Router",
    description: "Dual-band Wi-Fi 6 router with strong coverage and stable high-speed performance.",
    image: "https://images.unsplash.com/photo-1649779124753-8ee31f8f58f6?auto=format&fit=crop&w=900&q=80",
    category: "Computers",
    price: 4299,
    stock: 24,
  },
  {
    name: "Syska LED Bulb 12W Pack of 2",
    description: "Energy-efficient LED bulbs with bright output and long service life.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 299,
    stock: 150,
  },
  {
    name: "Wakefit Orthopedic Pillow",
    description: "Memory foam pillow designed for neck support and comfortable sleeping posture.",
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 899,
    stock: 52,
  },
  {
    name: "Samsung 24 Inch IPS Monitor",
    description: "Full HD IPS monitor with eye-care mode and slim-bezel design for work and entertainment.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    category: "Computers",
    price: 10499,
    stock: 18,
  },
  {
    name: "Portronics USB-C Hub 7-in-1",
    description: "Multiport USB-C hub with HDMI, USB 3.0, card reader, and PD charging support.",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    price: 2799,
    stock: 29,
  },
  {
    name: "Havells Room Heater",
    description: "Compact room heater with overheat protection and adjustable heat settings.",
    image: "https://images.unsplash.com/photo-1570804372107-13f4a3f0a1ef?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 2299,
    stock: 21,
  },
];

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopshee";
  await mongoose.connect(mongoUri);

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
