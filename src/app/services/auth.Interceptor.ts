import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  // Defina aqui a base URL da sua API protegida
  private protectedApiBaseUrl = 'https://fakestoreapi.com/';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token();

    // Só adiciona o header se a URL começar com a base da API protegida
    if (token && req.url.startsWith(this.protectedApiBaseUrl)) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    // Caso contrário, envia a requisição normalmente
    return next.handle(req);
  }
}
