export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;   // match backend
  productImageUrl?: string; // match backend
}
