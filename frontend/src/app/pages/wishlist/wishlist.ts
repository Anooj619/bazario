import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoggedInUser } from '../../services/auth.service';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { forkJoin, Observable } from 'rxjs';
import { ToastService } from '../../components/toast/toast-service';

interface WishlistItemResponse {
  id: number;
  userId: number;
  productId: number;
  createdAt?: string;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule, ProductCardComponent],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss']
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];
  private currentUser: LoggedInUser | null = null;

  // for undo
  private lastRemovedProduct: Product | null = null;

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: LoggedInUser | null) => {
      this.currentUser = user;
      if (this.currentUser) this.loadWishlist();
      else this.wishlist = [];
    });
  }

  loadWishlist(): void {
    if (!this.currentUser) return;

    this.wishlistService.getWishlist(this.currentUser.userId).subscribe({
      next: (items: WishlistItemResponse[]) => {
        const productObservables: Observable<Product>[] = items.map(item =>
          this.productService.getProductById(item.productId)
        );

        if (productObservables.length === 0) {
          this.wishlist = [];
          return;
        }

        forkJoin(productObservables).subscribe({
          next: (products: Product[]) => {
            this.wishlist = products;
          },
          error: () => this.toast.show('⚠️ Failed to load some products')
        });
      },
      error: () => this.toast.show('❌ Failed to load wishlist')
    });
  }

  removeFromWishlist(productId: number): void {
    if (!this.currentUser) return;

    // cache for undo
    this.lastRemovedProduct = this.wishlist.find(p => p.id === productId) || null;

    this.wishlistService.removeFromWishlist(productId, this.currentUser.userId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(p => p.id !== productId);
        this.toast.show('Removed from wishlist');
      },
      error: () => this.toast.show('❌ Failed to remove from wishlist')
    });
  }

  //moveToCart(product: Product): void {
  //  if (!this.currentUser) return;
  //  if (!this.isInCart(product.id)) {
  //    this.cartService.addToCart(product);
  //    // also remove from wishlist
  //    this.removeFromWishlist(product.id);
  //    this.toast.show('🛒 Moved to cart');
  //  }
  //}

  //isInCart(productId: number): boolean {
  //  return this.cartService.getCartItems().some(item => item.product.id === productId);
  //}
  onProductClick(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }
}
