import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  token = signal<string | null>(localStorage.getItem('token')); // ✅ novo signal do token
  private apiUrl = 'https://fakestoreapi.com/auth/login';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cartService: CartService,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated.set(true);
      this.token.set(token); // inicializa o signal do token
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', username);

          this.isAuthenticated.set(true);
          this.token.set(response.token); // atualiza o signal do token

          this.toastr.info('Login realizado com sucesso!', 'Informe', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: "decreasing",
            closeButton: true
          });
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('currentUser');

    this.isAuthenticated.set(false);
    this.token.set(null); // limpa o token do signal

    this.cartService.clearCart();
    this.router.navigate(['/login']);

    this.toastr.info('Logout realizado e carrinho esvaziado!', 'Informe', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: "decreasing",
      closeButton: true
    });
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
