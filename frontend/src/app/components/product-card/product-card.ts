import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { NgIf, CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService, LoggedInUser } from '../../services/auth.service';
import { ToastService } from '../../components/toast/toast-service';
import { environment } from '../../../environment/environment';
import { ProductImageComponent } from '../product-image/product-image';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIf, CommonModule, ProductImageComponent],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  @Input() product!: Product | null;

  /** Show remove button (used in wishlist page) */
  @Input() showRemove: boolean = false;

  /** Events to notify parent components */
  @Output() remove = new EventEmitter<number>();
  @Output() productClick = new EventEmitter<number>();  // ✅ Emits when card clicked
  public apiUrl = environment.apiUrl;

  private currentUser: LoggedInUser | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toast: ToastService
  ) {
    // Subscribe to current user
    this.authService.user$.subscribe((user: LoggedInUser | null) => {
      this.currentUser = user;
    });
  }

  /** Triggered when Add to Cart button is clicked */
  onAddToCart(event: MouseEvent): void {
    event.stopPropagation(); // ✅ prevent card click

    if (!this.product || !this.currentUser) {
      this.toast.show('⚠️ Please login to add items to cart');
      return;
    }

    this.cartService.addToCart(this.currentUser.userId, this.product, 1).subscribe({
      next: () => {
        this.toast.show('✅ Added to Cart');
      },
      error: () => {
        this.toast.show('❌ Failed to add item to Cart');
      }
    });
  }

  /** Triggered when Remove button is clicked (Wishlist mode) */
  onRemove(event: MouseEvent): void {
    event.stopPropagation(); // ✅ prevent card click
    if (this.product) {
      this.remove.emit(this.product.id);
      this.toast.show('❌ Removed from Wishlist');
    }
  }

  /** Triggered when the whole card is clicked */
  onProductClick(): void {
    if (this.product) {
      this.productClick.emit(this.product.id);
    }
  }
}
