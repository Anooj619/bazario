import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SubcategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSubcategoriesByCategoryId(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Subcategory/GetSubcategoriesByCategoryId?categoryId=${categoryId}`);
  }
}
