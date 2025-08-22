import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const username = localStorage.getItem('username');

    // Permite acesso apenas se o usuário estiver autenticado e for 'johnd' (administrador)
    // Feito assim para simplificar o exemplo, em um sistema real, 
    // usariamos as roles/permissions fornecidas pela API no lugar do username
    // Já que a API FakeStore não fornece roles/permissions
    if (this.authService.isAuthenticated() && username === 'johnd') {
      return true;
    }

    // Salva a URL de destino para redirecionar depois do login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
