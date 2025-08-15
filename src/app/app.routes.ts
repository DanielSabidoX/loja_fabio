import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path: 'creditos',
        component: CreditosComponent,
        title: 'Créditos'
    },
    {
        path: 'produtos',
        component: ProductComponent,
        title: 'Produtos'
    }
];
