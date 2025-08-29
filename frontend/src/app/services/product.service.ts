import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Products/GetProducts`);
  }
  getProductsBySubcategoryId(subcategoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Products/GetProductsBySubcategoryId?subcategoryId=${subcategoryId}`);
  }
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Products/GetProductById/${productId}`);
  }
  searchProducts(keyword: string) {
    return this.http.get(`${this.apiUrl}/Products/SearchProducts`, { params: { keyword } });
  }
}
