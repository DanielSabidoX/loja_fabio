import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categories } from '../../services/product.type.js';
import { AuthService } from '../../services/auth.service.js';
import { CartService } from '../../services/cart.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  tema: string = 'light';
  modo_tema: string = 'Modo Claro';
  categorias: Categories[] = [];
  cartCount: number = 0;  

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Tema
    const savedTema = localStorage.getItem('tema');
    const savedModoTema = localStorage.getItem('modo_tema');
    if (savedTema) {
      this.tema = savedTema;
      this.modo_tema = savedModoTema || 'Modo Claro';
    }
    document.documentElement.setAttribute('data-bs-theme', this.tema);

    // 👇 escuta carrinho - Conta quantdade de itens diferentes
    /*this.cartService.items$.subscribe(items => {
      this.cartCount = items.length;
    });*/

    this.cartService.items$.subscribe(items => {
      // soma todas as quantidades de todos os itens
      this.cartCount = items.reduce((sum, item) => sum + item.quantidade, 0);
    });

  }

  toggleTheme(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.tema = checkbox.checked ? 'dark' : 'light';
    this.modo_tema = checkbox.checked ? 'Modo Escuro' : 'Modo Claro';

    document.documentElement.setAttribute('data-bs-theme', this.tema);
    localStorage.setItem('tema', this.tema);
    localStorage.setItem('modo_tema', this.modo_tema);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  login() {
    this.authService.login();
  }

  sair() {
    this.authService.logout();
  }
}
