import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProductDetailModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ productId, isOpen, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!productId && isOpen,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      return apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${quantity} ${product?.name} added to your cart.`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product?.name} ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  if (!product && !isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : product ? (
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="mb-4">
                  <img
                    src={product.images[selectedImage] || product.image}
                    alt={product.name}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 ${
                          selectedImage === index ? "border-primary" : "border-slate-200"
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-sm mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-slate-900 mr-3">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
                      <Badge className="bg-yellow-100 text-yellow-800 ml-3">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                <p className="text-slate-600 mb-6">{product.description}</p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Quantity</h4>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mb-8">
                  <Button
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button variant="outline" onClick={handleWishlistToggle}>
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                {/* Product Features */}
                {product.features && (
                  <div>
                    <h4 className="font-semibold mb-4">Key Features</h4>
                    <ul className="space-y-2 text-slate-600">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
