import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { User } from '../types/user.type';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://fakestoreapi.com/users';

  // Cache do usuário logado
  private currentUserCache: User | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    // Carrega usuário do localStorage, se houver
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserCache = JSON.parse(savedUser);
    }
  }

  // Retorna usuário logado do cache
  getCurrentUser(): User | null {
    return this.currentUserCache;
  }

  // Salva usuário logado no cache e localStorage
  setCurrentUser(user: User): void {
    this.currentUserCache = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Limpa cache do usuário logado
  clearCurrentUser(): void {
    this.currentUserCache = null;
    localStorage.removeItem('currentUser');
  }

  // Buscar todos os usuários
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(err => {
        this.toastr.error('Erro ao buscar usuários.', 'Atenção', { timeOut: 5000 });
        return of([]);
      })
    );
  }

  // Buscar um usuário por ID (com cache opcional)
  getUserById(id: number): Observable<User> {
    if (this.currentUserCache?.id === id) {
      return of(this.currentUserCache);
    }

    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        this.toastr.error('Erro ao buscar usuário.', 'Atenção', { timeOut: 5000 });
        return of(null as any);
      })
    );
  }

  // Criar usuário
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(err => {
        this.toastr.error('Erro ao criar usuário.', 'Atenção', { timeOut: 5000 });
        return of(null as any);
      })
    );
  }

  // Atualizar usuário
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      tap(updated => {
        // Atualiza cache se for o usuário logado
        if (this.currentUserCache?.id === id && updated) {
          this.setCurrentUser(updated);
        }
      }),
      catchError(err => {
        this.toastr.error('Erro ao atualizar usuário.', 'Atenção', { timeOut: 5000 });
        return of(null as any);
      })
    );
  }

  // Deletar usuário
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (this.currentUserCache?.id === id) {
          this.clearCurrentUser();
        }
      }),
      catchError(err => {
        this.toastr.error('Erro ao deletar usuário.', 'Atenção', { timeOut: 5000 });
        return of(undefined);
      })
    );
  }
}
