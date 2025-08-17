import { Routes } from '@angular/router';
import { ProductListComponent } from './components/productlist/productlist.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { ProductDetailComponent } from './components/productdetail/productdetail.component';

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
    }
];
