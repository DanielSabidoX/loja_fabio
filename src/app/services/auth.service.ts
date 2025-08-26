import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from '../types/user.type';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  token = signal<string | null>(localStorage.getItem('token'));
  user = signal<User | null>(null);   

  private apiUrl = 'https://fakestoreapi.com/auth/login';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cartService: CartService,
    private router: Router,
    private userService: UserService
  ) {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');

    if (token) {
      this.isAuthenticated.set(true);
      this.token.set(token);
    }

    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('token', response.token);

          this.userService.getUsers().subscribe({
            next: (users) => {
              const foundUser = users.find(u => u.username === username) || null;
              if (foundUser) {
                this.user.set(foundUser);              
                this.userService.setCurrentUser(foundUser);
              }
            }
          });

          this.isAuthenticated.set(true);
          this.token.set(response.token);

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
    this.token.set(null);
    this.user.set(null); 

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
    return this.user()?.username || null;
  }

}
