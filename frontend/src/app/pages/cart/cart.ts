import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartItemComponent } from '../../components/cart-item/cart-item';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary';
import { CartItem } from '../../models/CartItem';
import { CartService } from '../../services/cart.service';
import { AuthService, LoggedInUser } from '../../services/auth.service';
import { ToastService } from '../../components/toast/toast-service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  currentUser: LoggedInUser | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private WishlistService: WishlistService
  ) {
    this.authService.user$.subscribe((user: LoggedInUser | null) => this.currentUser = user);
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (!this.currentUser) {
      this.toast.show('⚠️ Please log in to view your cart.');
      return;
    }

    this.cartService.getCartItems(this.currentUser.userId).subscribe({
      next: (items: CartItem[]) => this.cartItems = items,
      error: () => this.toast.show('⚠️ Failed to load cart items')
    });
  }

  remove(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        this.toast.show('❌ Item removed from cart');
        this.loadCart();
      },
      error: () => this.toast.show('⚠️ Failed to remove item from cart')
    });
  }

  updateQuantity(event: { item: CartItem; change: number }): void {
    const newQuantity = event.item.quantity + event.change;
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(event.item.id, newQuantity).subscribe({
      next: () => {
        this.toast.show('🔄 Cart updated');
        this.loadCart();
      },
      error: () => this.toast.show('⚠️ Failed to update quantity')
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  checkout(): void {
    if (!this.currentUser) {
      this.toast.show('⚠️ Please log in to checkout.');
      return;
    }

    // ✅ Clear Cart
    const cartClearRequests = this.cartItems.map(item =>
      this.cartService.removeFromCart(item.id)
    );

    // ✅ Clear Wishlist
    const wishlistClearRequests = this.cartItems.map(item =>
      this.WishlistService.removeFromWishlist(item.productId, this.currentUser!.userId)
    );

    // Combine both requests
    Promise.all([
      ...cartClearRequests.map(req => req.toPromise()),
      ...wishlistClearRequests.map(req => req.toPromise())
    ])
      .then(() => {
        this.toast.show('✅ Payment Successful! 🎉');
        this.cartItems = []; // clear local cart
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.toast.show('⚠️ Failed to clear cart/wishlist after checkout');
      });
  }

}
