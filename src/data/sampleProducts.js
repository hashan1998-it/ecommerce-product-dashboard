import { createProduct } from '../utils/productUtils';
import { CATEGORY_PLACEHOLDER_IMAGES } from '../utils/constants';

// Sample product data for development and testing
const sampleProductsData = [
  {
    name: 'iPhone 14 Pro',
    description: 'Latest Apple smartphone with advanced camera system and A16 Bionic chip.',
    price: 999.99,
    category: 'Electronics',
    stock: 15,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Electronics
  },
  {
    name: 'Samsung Galaxy S23',
    description: 'Premium Android smartphone with exceptional camera and display quality.',
    price: 899.99,
    category: 'Electronics',
    stock: 8,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Electronics
  },
  {
    name: 'MacBook Air M2',
    description: 'Ultra-thin laptop with M2 chip, perfect for productivity and creativity.',
    price: 1199.99,
    category: 'Electronics',
    stock: 12,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Electronics
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology for maximum comfort.',
    price: 149.99,
    category: 'Sports',
    stock: 25,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Sports
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Classic straight-fit jeans made from premium denim.',
    price: 79.99,
    category: 'Clothing',
    stock: 30,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Clothing
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald.',
    price: 12.99,
    category: 'Books',
    stock: 50,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Books
  },
  {
    name: 'KitchenAid Stand Mixer',
    description: 'Professional-grade stand mixer perfect for baking enthusiasts.',
    price: 379.99,
    category: 'Home',
    stock: 7,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Home
  },
  {
    name: 'Instant Pot Duo',
    description: '7-in-1 electric pressure cooker for quick and easy meals.',
    price: 89.99,
    category: 'Home',
    stock: 18,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Home
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'High-performance running shoes with Boost midsole technology.',
    price: 189.99,
    category: 'Sports',
    stock: 20,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Sports
  },
  {
    name: 'Harry Potter Complete Set',
    description: 'Complete collection of Harry Potter books by J.K. Rowling.',
    price: 59.99,
    category: 'Books',
    stock: 3,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Books
  },
  {
    name: 'Zara Wool Coat',
    description: 'Elegant wool coat perfect for winter fashion.',
    price: 129.99,
    category: 'Clothing',
    stock: 14,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Clothing
  },
  {
    name: 'Sony WH-1000XM4',
    description: 'Premium noise-canceling wireless headphones with exceptional sound quality.',
    price: 349.99,
    category: 'Electronics',
    stock: 0,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Electronics
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Premium non-slip yoga mat for all types of yoga practice.',
    price: 39.99,
    category: 'Sports',
    stock: 35,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Sports
  },
  {
    name: 'Coffee Table Book: Photography',
    description: 'Beautiful coffee table book featuring stunning photography from around the world.',
    price: 29.99,
    category: 'Books',
    stock: 12,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Books
  },
  {
    name: 'Smart Home Thermostat',
    description: 'Wi-Fi enabled smart thermostat for energy-efficient home heating and cooling.',
    price: 199.99,
    category: 'Home',
    stock: 9,
    imageUrl: CATEGORY_PLACEHOLDER_IMAGES.Home
  }
];

// Create sample products with proper structure
export const sampleProducts = sampleProductsData.map(productData => 
  createProduct(productData)
);

// Export individual categories for testing
export const electronicProducts = sampleProducts.filter(p => p.category === 'Electronics');
export const clothingProducts = sampleProducts.filter(p => p.category === 'Clothing');
export const bookProducts = sampleProducts.filter(p => p.category === 'Books');
export const homeProducts = sampleProducts.filter(p => p.category === 'Home');
export const sportsProducts = sampleProducts.filter(p => p.category === 'Sports');

// Export products by stock status for testing
export const inStockProducts = sampleProducts.filter(p => p.stock > 5);
export const lowStockProducts = sampleProducts.filter(p => p.stock > 0 && p.stock <= 5);
export const outOfStockProducts = sampleProducts.filter(p => p.stock === 0);

// Export default sample products
export default sampleProducts;