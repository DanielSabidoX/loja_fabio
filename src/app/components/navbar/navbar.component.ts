import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CapitalizeWordsPipe } from '../../helpers/capitalize.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, CapitalizeWordsPipe, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  tema: string = 'light';
  modo_tema: string = 'Modo Claro';

  private cartService = inject(CartService);
  authService = inject(AuthService);

  // carrinho reativo
  cartCount = computed(() =>
    this.cartService.items().reduce((sum, item) => sum + item.quantidade, 0)
  );

  constructor(private translate: TranslateService) {
    const savedTema = localStorage.getItem('tema');
    const savedModoTema = localStorage.getItem('modo_tema');
    if (savedTema) {
      this.tema = savedTema;
      this.modo_tema = savedModoTema || 'Modo Claro';
    }
    document.documentElement.setAttribute('data-bs-theme', this.tema);

    // idiomas suportados
    translate.addLangs(['en', 'pt']);
    translate.setDefaultLang('pt');

    const savedLang = localStorage.getItem('lang');
    const browserLang = translate.getBrowserLang();

    translate.use(
      savedLang && ['pt', 'en'].includes(savedLang)
        ? savedLang
        : browserLang && ['pt', 'en'].includes(browserLang)
          ? browserLang
          : 'pt'
    );
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
    return this.authService.isAuthenticated();
  }

  // ✅ pega o nome completo do usuário logado do signal
  get displayName(): string {
    const user = this.authService.user();
    if (!user) return '';
    return `${user.name.firstname} ${user.name.lastname}`;
  }

  sair() {
    this.authService.logout();
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
