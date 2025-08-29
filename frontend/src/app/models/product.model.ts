export interface Product {
  id: number;
  name: string;
  description?: string; // Optional field for product description
  price: number;
  imageUrl: string;
  category: string;
  subcategory: string;
  rating?: number; // Optional field for product rating
}
