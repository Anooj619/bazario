import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [NgClass],
  templateUrl: './product-image.html',
  styleUrl: '/product-image.scss'
})
export class ProductImageComponent {
  @Input() imageUrl: string | null = null;   // API image
  @Input() alt: string = '';                 // accessibility
  @Input() type: 'card' | 'cart' | 'wishlist' | 'detail' = 'card'; // context

  baseUrl = environment.apiUrl.replace('/api', '');
  fallbackUrl = 'assets/bazrario.png'; // put one safe default in assets

  // compute the image src
  get src(): string {
    return this.imageUrl ? this.baseUrl + this.imageUrl : this.fallbackUrl;
  }

  // if image fails to load → fallback
  onError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackUrl;
  }
}
