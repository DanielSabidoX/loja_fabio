import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service.js';
import { CartService } from '../../services/cart.service.js';
import { CapitalizeWordsPipe } from '../../helpers/capitalize.pipe.js';
import { UserService } from '../../services/user.service.js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, CapitalizeWordsPipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  tema: string = 'light';
  modo_tema: string = 'Modo Claro';
  cartCount: number = 0;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const savedTema = localStorage.getItem('tema');
    const savedModoTema = localStorage.getItem('modo_tema');
    if (savedTema) {
      this.tema = savedTema;
      this.modo_tema = savedModoTema || 'Modo Claro';
    }
    document.documentElement.setAttribute('data-bs-theme', this.tema);

    this.cartService.items$.subscribe(items => {
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

  get username(): string {
    return this.authService.getUsername() || '';
  }

  sair() {
    this.authService.logout();
  }

}
