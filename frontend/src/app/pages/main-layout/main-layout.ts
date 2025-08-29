import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../components/toast/toast';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, ToastComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {

  constructor(private router: Router) { }

  onSubcategorySelected(subcatId: number) {
    this.router.navigate(['/home'], { queryParams: { subcategory: subcatId } });
  }

  onLogoClick() {
    this.router.navigate(['/home']);
  }

  onSearchResults(products: any[]) {
    this.router.navigate(['/home'], { state: { searchResults: products } });
  }
}
