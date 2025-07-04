import type { Product, CartItem, InsertProduct, InsertCartItem } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItems(): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | null>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();

  constructor() {
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        description: "Experience premium sound quality with these wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals alike.",
        price: 299.99,
        originalPrice: 399.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.8,
        reviewCount: 127,
        badge: "Best Seller",
        features: ["Active Noise Cancellation", "30-Hour Battery Life", "Wireless Bluetooth 5.0", "Premium Comfort Design"],
        inStock: true,
      },
      {
        id: "2",
        name: "Designer Leather Handbag",
        description: "Elegant and spacious designer leather handbag crafted from premium materials. Features multiple compartments and a timeless design that complements any outfit.",
        price: 189.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.5,
        reviewCount: 89,
        features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap", "Timeless Design"],
        inStock: true,
      },
      {
        id: "3",
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity. Track your workouts, monitor your health, and stay connected on the go.",
        price: 249.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.9,
        reviewCount: 203,
        badge: "New",
        features: ["Heart Rate Monitor", "GPS Tracking", "Smartphone Connectivity", "Waterproof Design"],
        inStock: true,
      },
      {
        id: "4",
        name: "Modern Ceramic Vase",
        description: "Beautiful handcrafted ceramic vase that adds elegance to any home. Perfect for displaying fresh flowers or as a standalone decorative piece.",
        price: 79.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.3,
        reviewCount: 45,
        features: ["Handcrafted Ceramic", "Modern Design", "Multiple Sizes", "Easy to Clean"],
        inStock: true,
      },
      {
        id: "5",
        name: "Vintage Camera Collection",
        description: "Classic vintage camera perfect for photography enthusiasts and collectors. Features manual controls and timeless design that captures the essence of traditional photography.",
        price: 459.99,
        originalPrice: 599.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.7,
        reviewCount: 76,
        badge: "Sale",
        features: ["Manual Controls", "Vintage Design", "High Quality Lens", "Collector's Item"],
        inStock: true,
      },
      {
        id: "6",
        name: "Performance Running Shoes",
        description: "High-performance running shoes designed for comfort and speed. Features advanced cushioning technology and breathable materials for the ultimate running experience.",
        price: 129.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.6,
        reviewCount: 312,
        features: ["Advanced Cushioning", "Breathable Materials", "Lightweight Design", "Superior Grip"],
        inStock: true,
      },
      {
        id: "7",
        name: "Premium Coffee Maker",
        description: "Professional-grade coffee maker that brews the perfect cup every time. Features programmable settings, thermal carafe, and premium build quality.",
        price: 349.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.8,
        reviewCount: 156,
        features: ["Programmable Settings", "Thermal Carafe", "Premium Build", "Easy Cleaning"],
        inStock: true,
      },
      {
        id: "8",
        name: "Designer Sunglasses",
        description: "Stylish designer sunglasses with UV protection and premium frames. Perfect combination of fashion and function for the modern lifestyle.",
        price: 219.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rating: 4.4,
        reviewCount: 92,
        features: ["UV Protection", "Premium Frames", "Designer Style", "Lightweight"],
        inStock: true,
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = Date.now().toString();
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async getCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existingItem = Array.from(this.cartItems.values()).find(
      cartItem => cartItem.productId === item.productId && cartItem.variant === item.variant
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = Date.now().toString();
    const newItem = { ...item, id };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    const item = this.cartItems.get(id);
    if (!item) return null;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return null;
    }

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }
}

export const storage = new MemStorage();
