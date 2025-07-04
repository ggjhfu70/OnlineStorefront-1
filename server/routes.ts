import express, { type Request, type Response } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { productFiltersSchema, insertCartItemSchema } from "@shared/schema";

const router = express.Router();

// Products routes
router.get("/api/products", async (req: Request, res: Response) => {
  try {
    const filters = productFiltersSchema.parse(req.query);
    let products = await storage.getProducts();

    // Apply filters
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice!);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          products.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
        default:
          // featured - no sorting needed
          break;
      }
    }

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: "Invalid filters provided" });
  }
});

router.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const product = await storage.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Cart routes
router.get("/api/cart", async (req: Request, res: Response) => {
  try {
    const cartItems = await storage.getCartItems();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

router.post("/api/cart", async (req: Request, res: Response) => {
  try {
    const itemData = insertCartItemSchema.parse(req.body);
    const cartItem = await storage.addToCart(itemData);
    res.status(201).json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

router.put("/api/cart/:id", async (req: Request, res: Response) => {
  try {
    const { quantity } = z.object({ quantity: z.number() }).parse(req.body);
    const cartItem = await storage.updateCartItem(req.params.id, quantity);
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

router.delete("/api/cart/:id", async (req: Request, res: Response) => {
  try {
    const success = await storage.removeFromCart(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

router.delete("/api/cart", async (req: Request, res: Response) => {
  try {
    await storage.clearCart();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
