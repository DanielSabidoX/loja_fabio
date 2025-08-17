import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categories } from '../../services/product.type.js';
import { AuthService } from '../../services/auth.service.js';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  tema: string = 'light';
  modo_tema: string = 'Modo Claro';
  categorias: Categories[] = [];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Carrega tema salvo
    const savedTema = localStorage.getItem('tema');
    const savedModoTema = localStorage.getItem('modo_tema');

    if (savedTema) {
      this.tema = savedTema;
      this.modo_tema = savedModoTema || 'Modo Claro';
    }

    // Aplica o tema
    document.documentElement.setAttribute('data-bs-theme', this.tema);

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
    this.authService.login(); // Atualiza o estado de autenticação
  }

  sair() {
    this.authService.logout();
  }

}
