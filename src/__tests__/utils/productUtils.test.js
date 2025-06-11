import {
  createProduct,
  updateProduct,
  getStockStatus,
  filterProducts,
  validateProductData,
} from "../../utils/productUtils";
import { STOCK_STATUS } from "../../utils/constants";
import { describe, it, expect } from "@jest/globals";

describe("productUtils", () => {
  const mockProductData = {
    name: "Test Product",
    description: "Test description",
    price: 99.99,
    category: "Electronics",
    stock: 10,
    imageUrl: "https://example.com/image.jpg",
  };

  describe("createProduct", () => {
    it("should create a product with all required fields", () => {
      const product = createProduct(mockProductData);

      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("createdAt");
      expect(product).toHaveProperty("updatedAt");
      expect(product.name).toBe(mockProductData.name);
      expect(product.price).toBe(mockProductData.price);
      expect(product.category).toBe(mockProductData.category);
      expect(product.stock).toBe(mockProductData.stock);
    });

    it("should handle missing optional fields", () => {
      const minimalData = {
        name: "Minimal Product",
        price: 50,
        category: "Books",
        stock: 5,
      };

      const product = createProduct(minimalData);
      expect(product.description).toBe("");
      expect(product.imageUrl).toBeDefined();
    });
  });

  describe("updateProduct", () => {
    it("should update existing product with new data", () => {
      const existingProduct = createProduct(mockProductData);
      const updates = {
        name: "Updated Product",
        price: 149.99,
      };

      const updatedProduct = updateProduct(existingProduct, updates);

      expect(updatedProduct.name).toBe(updates.name);
      expect(updatedProduct.price).toBe(updates.price);
      expect(updatedProduct.category).toBe(existingProduct.category);
      expect(updatedProduct.id).toBe(existingProduct.id);
      expect(updatedProduct.updatedAt).not.toBe(existingProduct.updatedAt);
    });
  });

  describe("getStockStatus", () => {
    it("should return OUT_OF_STOCK for zero stock", () => {
      expect(getStockStatus(0)).toBe(STOCK_STATUS.OUT_OF_STOCK);
    });

    it("should return LOW_STOCK for stock <= 5", () => {
      expect(getStockStatus(3)).toBe(STOCK_STATUS.LOW_STOCK);
      expect(getStockStatus(5)).toBe(STOCK_STATUS.LOW_STOCK);
    });

    it("should return IN_STOCK for stock > 5", () => {
      expect(getStockStatus(10)).toBe(STOCK_STATUS.IN_STOCK);
    });
  });

  describe("filterProducts", () => {
    const products = [
      createProduct({
        ...mockProductData,
        name: "iPhone",
        category: "Electronics",
        price: 999,
      }),
      createProduct({
        ...mockProductData,
        name: "Book",
        category: "Books",
        price: 20,
      }),
      createProduct({
        ...mockProductData,
        name: "Shirt",
        category: "Clothing",
        price: 50,
      }),
    ];

    it("should filter by search term", () => {
      const filtered = filterProducts(products, { search: "iPhone" });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("iPhone");
    });

    it("should filter by category", () => {
      const filtered = filterProducts(products, { category: "Books" });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe("Books");
    });

    it("should filter by price range", () => {
      const filtered = filterProducts(products, {
        minPrice: 30,
        maxPrice: 100,
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].price).toBe(50);
    });
  });

  describe("validateProductData", () => {
    it("should validate correct product data", () => {
      const result = validateProductData(mockProductData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("should return errors for invalid data", () => {
      const invalidData = {
        name: "",
        price: -10,
        category: "",
        stock: -5,
      };

      const result = validateProductData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.price).toBeDefined();
      expect(result.errors.category).toBeDefined();
      expect(result.errors.stock).toBeDefined();
    });
  });
});
