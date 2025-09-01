import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/CartItem';
import { NgIf, CommonModule } from '@angular/common';
import { ProductImageComponent } from '../product-image/product-image';
import { environment } from '../../../environment/environment';

@Component({ 
  selector: 'app-cart-item',
  standalone: true,
  imports: [NgIf, CommonModule, ProductImageComponent],
  templateUrl: './cart-item.html',
  styleUrls: ['./cart-item.scss']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  public imageBaseUrl = environment.imageBaseUrl;

  // Emit only the cartItem ID for removal
  @Output() remove = new EventEmitter<number>();

  // Emit quantity changes with item and change (+1/-1)
  @Output() quantityChange = new EventEmitter<{ item: CartItem; change: number }>();

  increaseQuantity() {
    this.quantityChange.emit({ item: this.item, change: 1 });
  }

  decreaseQuantity() {
    if (this.item.quantity > 1) {
      this.quantityChange.emit({ item: this.item, change: -1 });
    }
  }

  removeItem() {
    this.remove.emit(this.item.id); // emit id only
  }
}
