import { Injectable, signal } from '@angular/core';
import { CartItem } from '../types/cart-item.type';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);

  constructor(
    private toastr: ToastrService
  ) { }

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
      this.toastr.info('Carrinho atualizado com sucesso!', 'Informe', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: "decreasing",
        closeButton: true
      });      
    } else {
      this.items.update(items => [...items, { produto, quantidade }]);
      this.toastr.info('Carrinho atualizado com sucesso!', 'Informe', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: "decreasing",
        closeButton: true
      });      
    }
  }

  updateQuantity(produtoId: number, quantidade: number) {
    this.items.update(items =>
      items.map(item =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      )
    );
    this.toastr.info('Carrinho atualizado com sucesso!', 'Informe', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: "decreasing",
      closeButton: true
    });
  }

  removeFromCart(produtoId: number) {
    this.items.update(items => items.filter(item => item.produto.id !== produtoId));
    this.toastr.info('Carrinho atualizado com sucesso!', 'Informe', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: "decreasing",
      closeButton: true
    });    
  }

  clearCart() {
    this.items.set([]);
  }
}
