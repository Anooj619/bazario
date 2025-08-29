import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { CartComponent } from './pages/cart/cart';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { WishlistComponent } from './pages/wishlist/wishlist';
import { MainLayoutComponent } from './pages/main-layout/main-layout'; // ✅ import MainLayout

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // default to login
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,  // ✅ main layout wrapper
    children: [
      { path: 'home', component: HomeComponent },      
      { path: 'wishlist', component: WishlistComponent },
      { path: 'product-detail/:id', component: ProductDetailComponent }
    ]
  },
  { path: 'cart', component: CartComponent }
];
