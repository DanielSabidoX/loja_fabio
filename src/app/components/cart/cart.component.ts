import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
  private userService = inject(UserService);

  items = this.cartService.items;
  isAuthenticated = this.authService.isAuthenticated;

  total = computed(() =>
    this.items().reduce((sum, item) => sum + (item.produto.price * item.quantidade), 0)
  );

  // Modal
  showModal = signal(false);
  compraFinalizada = signal<{ produtos: any[], total: number, endereco: string, prazoEntrega: Date } | null>(null);

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

    const produtosComprados = this.items();
    const totalCompra = this.total();

    // Busca endereço do usuário logado
    let enderecoCliente = 'Rua Exemplo, 123, Cidade, Estado'; // padrão
    const currentUser = this.userService.getCurrentUser();
    if (currentUser?.address) {
      const addr = currentUser.address; 
      enderecoCliente = `${addr.street}, ${addr.number}, ${addr.city}, ${addr.zipcode}`;
    }

    // Prazo de entrega aleatório (1 a 7 dias a partir de hoje)
    const hoje = new Date();
    const diasEntrega = Math.floor(Math.random() * 7) + 1;
    const prazoEntrega = new Date(hoje);
    prazoEntrega.setDate(hoje.getDate() + diasEntrega);

    this.compraFinalizada.set({
      produtos: produtosComprados,
      total: totalCompra,
      endereco: enderecoCliente,
      prazoEntrega
    });

    this.showModal.set(true);

    this.limparCarrinho();
  }

  fecharModal() {
    this.showModal.set(false);
    this.compraFinalizada.set(null);
  }
}
