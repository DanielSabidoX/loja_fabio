import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from './product.type';
import { CartItem } from './cart-item.type';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  private loadFromStorage() {
    const data = localStorage.getItem('cart');
    if (data) {
      this.items = JSON.parse(data);
      this.itemsSubject.next(this.items);
    }
  }

  addToCart(produto: Produto) {
    const existing = this.items.find(i => i.produto.id === produto.id);
    if (existing) {
      existing.quantidade += 1; // 🔹 aumenta quantidade
    } else {
      this.items.push({ produto, quantidade: 1 });
    }
    this.itemsSubject.next(this.items);
    this.saveToStorage();
  }

  removeFromCart(produtoId: number) {
    this.items = this.items.filter(i => i.produto.id !== produtoId);
    this.itemsSubject.next(this.items);
    this.saveToStorage();
  }

  updateQuantity(produtoId: number, quantidade: number) {
    const item = this.items.find(i => i.produto.id === produtoId);
    if (item) {
      item.quantidade = quantidade > 0 ? quantidade : 1;
    }
    this.itemsSubject.next(this.items);
    this.saveToStorage();
  }

  clearCart() {
    this.items = [];
    this.itemsSubject.next(this.items);
    this.saveToStorage();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getCount(): number {
    return this.items.reduce((sum, i) => sum + i.quantidade, 0);
  }
}
