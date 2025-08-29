import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgForOf, NgIf, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  products: any[] = [];
  showBanner: boolean = true;

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // React to changes in query params: subcategory or search q
    this.route.queryParams.subscribe((params: Params) => {
      const subcatId = params['subcategory'];
      const q = params['q'];

      if (subcatId) {
        this.loadProductsBySubcategory(Number(subcatId));
      } else if (q) {
        this.loadSearchResults(q);
      } else {
        this.loadAllProducts();
      }
    });
  }

  private loadAllProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.showBanner = true;
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.snackBar.open('Something went wrong while loading products.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private loadProductsBySubcategory(subcatId: number) {
    this.productService.getProductsBySubcategoryId(subcatId).subscribe({
      next: (data: any) => {
        this.products = data;
        this.showBanner = false;
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.snackBar.open('Something went wrong while loading products.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private loadSearchResults(q: string) {
    this.productService.searchProducts(q).subscribe({
      next: (data: any) => {
        this.products = data;
        this.showBanner = false;
      },
      error: (err: any) => {
        console.error('Search failed', err);
        this.snackBar.open('⚠️ Search failed. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  onProductClick(productId: number) {
    this.router.navigate(['/product-detail', productId]);
  }
}
