const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, image, category } = req.body;

  if (!name || price === undefined || stock === undefined) {
    res.status(400);
    throw new Error("name, price and stock are required");
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    image,
    category,
    createdBy: req.user?._id,
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const fields = ["name", "description", "price", "stock", "image", "category"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updated = await product.save();
  res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
