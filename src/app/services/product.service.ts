import { Injectable } from '@angular/core';
import { Produto, Rating, Categories } from './product.type.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
    
  }

  findCategories(): Observable<Categories[]> {
    return this.http.get<Categories[]>('https://fakestoreapi.com/products/categories');
  }

  findProducts(): Observable<Produto[]> {
    return this.http.get<Produto[]>('https://fakestoreapi.com/products');
  }  

}
