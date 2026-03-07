require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const categoryKeywords = {
  electronics: "electronics,gadget",
  wearables: "smartwatch,wearable",
  accessories: "mobile-accessories,charger",
  books: "books,reading",
  home: "home-appliances,kitchen",
  fashion: "fashion,shoes",
  computers: "keyboard,laptop-accessories",
  grocery: "grocery,coffee,food",
  general: "shopping,product",
};

const nameTemplates = {
  electronics: ["Wireless Earbuds", "Bluetooth Speaker", "Portable Audio Device", "Noise Cancellation Headset"],
  wearables: ["Smartwatch", "Fitness Band", "Health Tracker", "Calling Watch"],
  accessories: ["Fast Charger", "Phone Cable", "Power Adapter", "USB Hub"],
  books: ["Finance Book", "Self Growth Book", "Business Guide", "Learning Handbook"],
  home: ["Kitchen Appliance", "Home Utility Item", "Air Fryer", "Bottle and Storage"],
  fashion: ["Running Shoes", "Casual Sneakers", "Sportswear Item", "Comfort Footwear"],
  computers: ["Wireless Keyboard", "Gaming Mouse", "Laptop Stand", "Desk Accessory"],
  grocery: ["Premium Coffee", "Healthy Snacks", "Daily Grocery Pack", "Organic Food Item"],
  general: ["Featured Product", "Trending Item", "Popular Product", "Value Pack"],
};

const categoryKey = (category) => {
  const c = String(category || "General").trim().toLowerCase();
  return categoryKeywords[c] ? c : "general";
};

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopshee";
  await mongoose.connect(mongoUri);

  const products = await Product.find().sort({ createdAt: 1 });
  const seenNames = new Set();
  const bulkOps = [];

  products.forEach((product, index) => {
    const cKey = categoryKey(product.category);
    const templates = nameTemplates[cKey];
    const base = templates[index % templates.length];
    let name = `${base} ${String(index + 1).padStart(3, "0")}`;
    while (seenNames.has(name)) {
      name = `${name}A`;
    }
    seenNames.add(name);

    const imageKeyword = categoryKeywords[cKey];
    const image = `https://source.unsplash.com/900x700/?${encodeURIComponent(imageKeyword)}&sig=${index + 1}`;

    bulkOps.push({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            name,
            image,
            description:
              product.description && product.description.trim().length > 0
                ? product.description
                : `High quality ${base.toLowerCase()} with reliable performance for daily usage.`,
          },
        },
      },
    });
  });

  if (bulkOps.length > 0) {
    await Product.bulkWrite(bulkOps, { ordered: false });
  }

  const updatedProducts = await Product.find().select("name image");
  const nameCount = new Map();
  const imageCount = new Map();
  updatedProducts.forEach((p) => {
    nameCount.set(p.name, (nameCount.get(p.name) || 0) + 1);
    imageCount.set(p.image, (imageCount.get(p.image) || 0) + 1);
  });
  const duplicateNameGroups = [...nameCount.values()].filter((count) => count > 1).length;
  const duplicateImageGroups = [...imageCount.values()].filter((count) => count > 1).length;

  console.log(`Updated ${updatedProducts.length} products.`);
  console.log(`Duplicate name groups: ${duplicateNameGroups}`);
  console.log(`Duplicate image groups: ${duplicateImageGroups}`);
};

run()
  .catch((error) => {
    console.error(`normalize-products failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
