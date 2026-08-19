<template>
  <div class="container">
    <header>
      <h1>TechVibe Catalogue</h1>
      <p>Manage store inventory via Express API integration</p>
    </header>

    <section class="card form-card">
      <h2>Add New Product</h2>
      <form @submit.prevent="addProduct">
        <div class="form-group">
          <label for="name">Product Name</label>
          <input id="name" v-model="form.name" type="text" placeholder="e.g. Wireless Mouse" required />
        </div>

        <div class="form-group">
          <label for="price">Price (R)</label>
          <input id="price" v-model="form.price" type="number" step="0.01" placeholder="e.g. 499.99" required />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <input id="category" v-model="form.category" type="text" placeholder="e.g. Accessories" required />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Adding..." : "Add Product" }}
        </button>
      </form>
    </section>

    <section class="card list-card">
      <h2>Product Inventory</h2>

      <p v-if="loading" class="info-text">Loading product catalogue...</p>
      <p v-if="error" class="error-text">{{ error }}</p>

      <div v-if="!loading && products.length === 0" class="info-text">No products available in the catalogue.</div>

      <ul v-if="products.length > 0" class="product-list">
        <li v-for="product in products" :key="product.id" class="product-item">
          <div class="product-details">
            <h3>{{ product.name }}</h3>
            <p>
              <span class="badge">{{ product.category }}</span> — R{{ Number(product.price).toFixed(2) }}
            </p>
          </div>
          <button @click="deleteProduct(product.id)" class="btn btn-danger">Delete</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3000/products";

const products = ref([]);
const loading = ref(false);
const error = ref("");

const form = reactive({
  name: "",
  price: "",
  category: "",
});

const fetchProducts = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await axios.get(API_URL);
    products.value = response.data;
  } catch (err) {
    error.value = "Failed to load products from API server.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const addProduct = async () => {
  if (!form.name || !form.price || !form.category) return;

  loading.value = true;
  try {
    const response = await axios.post(API_URL, { ...form });
    products.value = response.data;
    form.name = "";
    form.price = "";
    form.category = "";
  } catch (err) {
    error.value = "Failed to add product.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (id) => {
  loading.value = true;
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    products.value = response.data;
  } catch (err) {
    error.value = "Failed to delete product.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #2c3e50;
  margin-bottom: 5px;
}

header p {
  color: #7f8c8d;
}

.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e8ed;
}

.card h2 {
  color: #34495e;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.product-list {
  list-style: none;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #ecf0f1;
}

.product-item:last-child {
  border-bottom: none;
}

.product-details h3 {
  font-size: 16px;
  color: #2c3e50;
}

.badge {
  background: #e8f4fd;
  color: #2980b9;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.info-text {
  color: #7f8c8d;
  font-style: italic;
}

.error-text {
  color: #e74c3c;
  font-weight: bold;
}
</style>
