import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService, LoggedInUser } from '../../services/auth.service';
import { ToastService } from '../../components/toast/toast-service';
import { environment } from '../../../environment/environment';
import { ProductImageComponent } from '..//../components/product-image/product-image';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ProductImageComponent],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  currentUser: LoggedInUser | null = null;

  isInWishlist: boolean = false;
  isInCart: boolean = false;
  public apiUrl = environment.apiUrl;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.authService.user$.subscribe((user: LoggedInUser | null) => this.currentUser = user);
  }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data: Product | undefined) => {
          this.product = data;
          this.checkWishlistStatus();
          this.checkCartStatus();
        },
        error: () => this.toast.show('⚠️ Failed to load product details')
      });
    }
  }

  addToCart(): void {
    if (!this.product || !this.currentUser) {
      this.toast.show('⚠️ Please log in to add products to your cart.');
      return;
    }

    if (this.isInCart) {
      // Already in cart → navigate
      this.router.navigate(['/cart']);
      return;
    }

    const userId = this.currentUser.userId;

    this.cartService.addToCart(userId, this.product, 1).subscribe({
      next: () => {
        this.isInCart = true;
        this.toast.show('✅ Product added to cart!');
      },
      error: () => this.toast.show('⚠️ Failed to add product to cart')
    });
  }

  toggleWishlist(): void {
    if (!this.product || !this.currentUser) {
      this.toast.show('⚠️ Please log in to manage your wishlist.');
      return;
    }

    const userId = this.currentUser.userId;

    if (this.isInWishlist) {
      // Already in wishlist → navigate
      this.router.navigate(['/wishlist']);
      return;
    }

    this.wishlistService.addToWishlist(this.product, userId).subscribe({
      next: () => {
        this.isInWishlist = true;
        this.toast.show('❤️ Added to Wishlist');
      },
      error: () => this.toast.show('⚠️ Error adding to Wishlist')
    });
  }

  private checkWishlistStatus(): void {
    if (!this.product || !this.currentUser) return;

    this.wishlistService.isInWishlist(this.currentUser.userId, this.product.id).subscribe({
      next: (inWishlist: boolean) => this.isInWishlist = inWishlist,
      error: () => this.isInWishlist = false
    });
  }

  private checkCartStatus(): void {
    if (!this.product || !this.currentUser) return;

    this.cartService.isInCart(this.currentUser.userId, this.product.id).subscribe({
      next: (inCart: boolean) => this.isInCart = inCart,
      error: () => this.isInCart = false
    });
  }
}
