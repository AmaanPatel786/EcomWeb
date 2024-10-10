import React, { useState, useEffect } from 'react';
import axios from 'axios';
import box from './box.png';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [minprice, setMinPrice] = useState(0);
  const [maxprice, setMaxPrice] = useState(5000);
  const [categories, setCategories] = useState("");  // Single string for selected category
  const [brands, setBrands] = useState("");  // Single string for selected brand
  const [allCategories, setAllCategories] = useState([]); // Array for all available categories
  const [allBrands, setAllBrands] = useState([]); // Array for all available brands

  // Fetch products from backend API with filters
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/listProducts', {
        params: { 
          brand: brands,  // Single string sent
          category: categories,  // Single string sent
          minprice,
          maxprice
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch categories and brands from the products table
  useEffect(() => {
    axios.get('http://localhost:3001/filters')
      .then(response => {
        // The response format will be { categories: [...], brands: [...] }
        setAllCategories(response.data.categories || []);  // Set all available categories
        setAllBrands(response.data.brands || []);  // Set all available brands
      })
      .catch(error => {
        console.error('Error fetching filters:', error);
      });
  
    // Fetch initial products
    fetchProducts();
  }, []); // No dependencies here since we're fetching filters initially

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [minprice, maxprice, categories, brands]); // Include fetchProducts in the dependency array here

  // Define styles inline
  const styles = {
    container: {
      textAlign: 'center',
      padding: '20px',
    },
    filtersContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
    },
    filter: {
      margin: '10px',
    },
    productCard: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px',
      width: '275px',
      overflow: 'hidden',  // Prevents content from overflowing
    },
    productsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    productImage: {
      maxWidth: '100%',  // Ensures the image does not exceed the card width
      maxHeight: '150px', // Sets a maximum height for the image
      objectFit: 'contain', // Ensures the image maintains its aspect ratio
      marginBottom: '10px', // Adds space below the image
    },
  };
  
  return (
    <div style={styles.container}>
      <h1>Product Dashboard</h1>
  
      <div style={styles.filtersContainer}>
        {/* Price Range Filter */}
        <div style={styles.filter}>
          <label>Price Range: {minprice} - {maxprice}</label>
          <input
            type="range"
            min="0"
            max="5000"
            value={minprice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            type="range"
            min="0"
            max="5000"
            value={maxprice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>
  
        {/* Category Filter */}
        <div style={styles.filter}>
          <label>Category</label>
          <select value={categories} onChange={e => setCategories(e.target.value)}>
            <option value="">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
  
        {/* Brand Filter */}
        <div style={styles.filter}>
          <label>Brand</label>
          <select value={brands} onChange={e => setBrands(e.target.value)}>
            <option value="">All Brands</option>
            {allBrands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
  
      {/* Product Cards */}
      <div style={styles.productsGrid}>
        {products.map(product => (
          <div key={product.id} style={styles.productCard}>
            <img src={box} alt={product.name} style={styles.productImage} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Brand: {product.brand}</p>
            <p>Category: {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Dashboard;
