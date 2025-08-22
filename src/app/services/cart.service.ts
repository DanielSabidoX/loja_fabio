import { Injectable, signal } from '@angular/core';
import { CartItem } from '../types/cart-item.type';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);

  addToCart(produto: any, quantidade: number = 1) {
    const current = this.items();
    const existing = current.find(item => item.produto.id === produto.id);

    if (existing) {
      this.items.update(items =>
        items.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      );
    } else {
      this.items.update(items => [...items, { produto, quantidade }]);
    }
  }

  updateQuantity(produtoId: number, quantidade: number) {
    this.items.update(items =>
      items.map(item =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      )
    );
  }

  removeFromCart(produtoId: number) {
    this.items.update(items => items.filter(item => item.produto.id !== produtoId));
  }

  clearCart() {
    this.items.set([]);
  }
}
