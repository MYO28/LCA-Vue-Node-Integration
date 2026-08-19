require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", price: 1299.99, category: "Audio" },
  { id: 2, name: "Mechanical Gaming Keyboard", price: 899.5, category: "Peripherals" },
  { id: 3, name: 'Ultra-Wide Curved Monitor 27"', price: 3499.0, category: "Displays" },
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Name, price, and category are required fields." });
  }

  const newProduct = {
    id: Date.now(),
    name,
    price: parseFloat(price),
    category,
  };

  products.push(newProduct);
  res.status(201).json(products);
});

app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  products = products.filter((product) => product.id !== productId);
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`TechVibe API server running on http://localhost:${PORT}`);
});
