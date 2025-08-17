import { Routes } from '@angular/router';
import { ProductListComponent } from './components/productlist/productlist.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { ProductDetailComponent } from './components/productdetail/productdetail.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: ProductListComponent,
        title: 'Home'
    },
    {
        path: 'creditos',
        component: CreditosComponent,
        title: 'Créditos'
    },
    {
        path: 'product',
        component: ProductDetailComponent,
        title: 'Detalhes dos Produtos'
    },
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthGuard],
        title: 'Carrinho de Compras'
    },
    {
        path: 'product/:id',
        component: ProductDetailComponent,
        title: 'Detalhes do Produto'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    }
];
