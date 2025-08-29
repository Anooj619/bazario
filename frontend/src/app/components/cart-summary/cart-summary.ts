import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../models/CartItem';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './cart-summary.html',
  styleUrls: ['./cart-summary.scss']
})
export class CartSummaryComponent {
  @Input() cartItems: CartItem[] = [];
  @Output() checkoutClicked = new EventEmitter<void>();

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalOldPrice(): number {
    return this.cartItems.reduce((total, item) => total + ((item.productPrice ?? 0) + 500) * item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.productPrice ?? 0) * item.quantity, 0);
  }

  getDiscountAmount(): number {
    return this.getTotalOldPrice() - this.getTotalPrice();
  }
  proceedToCheckout(): void {
    this.checkoutClicked.emit();
  }
}
