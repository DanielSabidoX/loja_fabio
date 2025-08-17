import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();

  // Getter rápido
  get isAuthenticated(): boolean {
    return this.authState.value;
  }

  login() {
    this.authState.next(true);
  }

  logout() {
    this.authState.next(false);
  }
}