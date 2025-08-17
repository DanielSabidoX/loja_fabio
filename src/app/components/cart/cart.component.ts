import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../services/cart-item.type';
import { AuthService } from '../../services/auth.service';  
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService // 
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.calcularTotal();
    });
  }

  calcularTotal() {
    this.total = this.items.reduce(
      (sum, item) => sum + (item.produto.price * item.quantidade), 
      0
    );
  }

  removerProduto(produtoId: number) {
    this.cartService.removeFromCart(produtoId);
  }

  mudarQuantidade(produtoId: number, event: Event) {
    const valor = Number((event.target as HTMLInputElement).value);
    this.cartService.updateQuantity(produtoId, valor);
  }

  limparCarrinho() {
    this.cartService.clearCart();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated; // 
  }

  finalizarCompra() {
    if (!this.isAuthenticated) return; // segurança extra
    alert('Compra finalizada com sucesso!');
    this.limparCarrinho();
  }
}
