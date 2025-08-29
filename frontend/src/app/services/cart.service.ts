import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/CartItem';
import { environment } from '../../environment/environment';
import { map, tap } from 'rxjs/operators';
import { AuthService, LoggedInUser } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl: string = environment.apiUrl;

  // Bag count subject
  private cartCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartCount$: Observable<number> = this.cartCountSubject.asObservable();

  private currentUser: LoggedInUser | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // ✅ Use user$ (observable) instead of getLoggedInUser()
    this.authService.user$.subscribe((user: LoggedInUser | null) => {
      if (user) {
        this.currentUser = user;
        this.refreshCartCount(user.userId); // ✅ use userId
      } else {
        this.currentUser = null;
        this.cartCountSubject.next(0); // Reset count on logout
      }
    });
  }

  /** Get all cart items for a user */
  getCartItems(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/Cart/GetCartItems`, {
      params: { userId: userId.toString() }
    });
  }

  /** Add product to cart */
  addToCart(userId: number, product: Product, quantity: number = 1): Observable<any> {
    const payload: { userId: number; productId: number; quantity: number } = {
      userId,
      productId: product.id,
      quantity
    };
    return this.http.post(`${this.apiUrl}/Cart/AddToCart`, payload).pipe(
      tap(() => this.refreshCartCount(userId))
    );
  }

  /** Update quantity */
  updateQuantity(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Cart/UpdateQuantity/${cartItemId}`, quantity).pipe(
      tap(() => {
        if (this.currentUser) {
          this.refreshCartCount(this.currentUser.userId);
        }
      })
    );
  }

  /** Remove item */
  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Cart/RemoveItem/${cartItemId}`).pipe(
      tap(() => {
        if (this.currentUser) {
          this.refreshCartCount(this.currentUser.userId);
        }
      })
    );
  }

  /** Check if a product is already in cart */
  isInCart(userId: number, productId: number): Observable<boolean> {
    return this.getCartItems(userId).pipe(
      map((items: CartItem[]) => items.some((item: CartItem) => item.productId === productId))
    );
  }

  /** 🔹 Refreshes the bag/cart count */
  private refreshCartCount(userId: number): void {
    this.getCartItems(userId).subscribe((items: CartItem[]) => {
      const totalCount: number = items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      this.cartCountSubject.next(totalCount);
    });
  }
}
