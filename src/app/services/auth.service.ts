import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './cart.service'; // importar CartService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();
  private apiUrl = 'https://fakestoreapi.com/auth/login';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cartService: CartService // injetar
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.authState.next(true);
    }
  }

  get isAuthenticated(): boolean {
    return this.authState.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', username);
          this.authState.next(true);

          this.toastr.info('Login realizado com sucesso!', 'Informe', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: "decreasing"
          });
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.authState.next(false);

    // Limpa o carrinho ao sair
    this.cartService.clearCart();

    this.toastr.info('Logout realizado e carrinho esvaziado!', 'Informe', {
      timeOut: 2000,
      progressBar: true
    });
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
