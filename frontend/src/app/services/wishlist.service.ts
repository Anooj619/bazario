import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environment/environment';
import { map } from 'rxjs/operators';

export interface WishlistItemResponse {
  id: number;
  userId: number;
  productId: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ✅ Get Wishlist by User
  getWishlist(userId: number): Observable<WishlistItemResponse[]> {
    return this.http.get<WishlistItemResponse[]>(`${this.apiUrl}/Wishlist/GetWishlist`, {
      params: { userId: userId.toString() }
    });
  }

  // ✅ Add Product to Wishlist
  addToWishlist(product: Product, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Wishlist/AddToWishlist`, {
      userId: userId,
      productId: product.id
    });
  }

  // ✅ Remove product from Wishlist
  removeFromWishlist(productId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Wishlist/Delete/${productId}?userId=${userId}`);
  }

  // ✅ Clear all wishlist items of a User
  clearWishlist(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Wishlist/Clear/${userId}`);
  }

  // ✅ Check if product is in wishlist (client-side helper)
  isInWishlist(userId: number, productId: number): Observable<boolean> {
    return this.http.get<{ isInWishlist: boolean }>(`${this.apiUrl}/Wishlist/IsInWishlist`, {
      params: {
        userId: userId.toString(),
        productId: productId.toString()
      }
    }).pipe(
      map((response: { isInWishlist: any; }) => response.isInWishlist) // extract the boolean
    );
  }

}
