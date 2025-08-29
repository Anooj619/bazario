import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  inject,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { SubcategoryService } from '../../services/subcategory-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService, LoggedInUser } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgForOf, NgIf, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  selectedCategory: any = null;
  selectedSubcategories: any[] = [];
  private snackBar = inject(MatSnackBar);

  showCategoryDropdown: boolean = false;
  showProfileDropdown: boolean = false;

  @ViewChild('searchContainer') searchContainer!: ElementRef;
  searchQuery: string = '';
  suggestions: any[] = [];

  cartCount: number = 0;
  private subscription = new Subscription();

  private currentUser: LoggedInUser | null = null;

  @Output() subcategorySelected = new EventEmitter<number>();
  @Output() logoClick = new EventEmitter<void>();
  @Output() searchResults = new EventEmitter<any[]>(); // legacy, not used for nav

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // 🔹 Load categories
    this.categoryService.getCategories().subscribe({
      next: (data: any) => (this.categories = data),
      error: (err: any) => {
        console.error('Failed to load categories', err);
        this.snackBar.open(
          '⚠️ Failed to load categories. Please try again later.',
          'Close',
          { duration: 3000 }
        );
      }
    });

    // 🔹 Subscribe to user changes
    this.subscription.add(
      this.authService.user$.subscribe((user: LoggedInUser | null) => {
        this.currentUser = user;

        if (user) {
          // fetch bag count immediately when user logs in
          this.cartService.getCartItems(user.userId).subscribe();
        } else {
          this.cartCount = 0; // reset when logged out
        }
      })
    );

    // 🔹 Subscribe to cart count stream
    this.subscription.add(
      this.cartService.cartCount$.subscribe((count: number) => {
        this.cartCount = count;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showSubcategories(category: any) {
    this.selectedCategory = category;
    this.showCategoryDropdown = true;
    this.subcategoryService.getSubcategoriesByCategoryId(category.id).subscribe({
      next: (data: any) => (this.selectedSubcategories = data),
      error: (err: any) => {
        console.error('Failed to load subcategories', err);
        this.snackBar.open(
          '⚠️ Unable to load subcategories. Please try again.',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  selectSubcategory(subcat: any) {
    this.subcategorySelected.emit(subcat.id);
    this.showCategoryDropdown = false;
    this.selectedCategory = null;

    // Navigate with subcategory param
    this.router.navigate(['/home'], { queryParams: { subcategory: subcat.id } });
  }

  onLogoClick() {
    this.logoClick.emit();
    this.router.navigate(['/home']);
  }

  onSearchInput() {
    if (this.searchQuery.length > 2) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (data: any) => (this.suggestions = data),
        error: (err: any) => {
          console.error('Search failed', err);
          this.snackBar.open('⚠️ Something went wrong while searching.', 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(item: any) {
    this.suggestions = [];
    this.searchQuery = '';
    this.router.navigate(['/home'], { queryParams: { q: item.name } });
  }

  search() {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/home'], { queryParams: { q } });
    }
  }

  closeDropdown() {
    this.showProfileDropdown = false;
  }

  hideSuggestions() {
    this.searchQuery = '';
    this.suggestions = [];
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.searchContainer &&
      !this.searchContainer.nativeElement.contains(event.target)
    ) {
      this.hideSuggestions();
    }
    this.showCategoryDropdown = false;
    this.showProfileDropdown = false;
  }

  onNavOptionHover() {
    this.hideSuggestions();
  }
}
