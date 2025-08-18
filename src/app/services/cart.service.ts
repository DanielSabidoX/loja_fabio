import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from '../types/product.type';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from '../types/cart-item.type';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  constructor(private toastr: ToastrService) {
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

  addToCart(produto: Produto, quantidade: number = 1) {
    const existente = this.items.find(i => i.produto.id === produto.id);

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      this.items.push({ produto, quantidade });
    }

    this.itemsSubject.next(this.items);
    this.saveToStorage();

    this.toastr.success('Produto adicionado ao carrinho com sucesso!', 'Informe', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: "decreasing"
    });

  }

  removeFromCart(produtoId: number) {
    this.items = this.items.filter(i => i.produto.id !== produtoId);
    this.itemsSubject.next(this.items);
    this.saveToStorage();

    this.toastr.info('Produto removido do carrinho com sucesso!', 'Informe', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: "decreasing"
    });

  }

  clearCart() {
    this.items = [];
    this.itemsSubject.next(this.items);
    this.saveToStorage();

    this.toastr.success('Produtos removidos do carrinho com sucesso!', 'Informe', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: "decreasing"
    });

  }

  getItems(): CartItem[] {
    return this.items;
  }

  /** Retorna a soma total de itens */
  getCount(): number {
    return this.items.reduce((total, item) => total + item.quantidade, 0);
  }

  updateQuantity(produtoId: number, quantidade: number) {
    const item = this.items.find(i => i.produto.id === produtoId);
    if (item) {
      item.quantidade = Math.max(1, quantidade); // evita zero ou negativo
      this.itemsSubject.next(this.items);
      this.saveToStorage();
    }
  }

}
