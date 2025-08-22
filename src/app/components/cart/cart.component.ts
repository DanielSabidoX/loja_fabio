import { Component, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';  

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  items = this.cartService.items;
  isAuthenticated = this.authService.isAuthenticated;

  total = computed(() =>
    this.items().reduce((sum, item) => sum + (item.produto.price * item.quantidade), 0)
  );

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

  finalizarCompra() {
    if (!this.isAuthenticated()) return;
    alert('Compra finalizada com sucesso!');
    this.limparCarrinho();
  }
}
