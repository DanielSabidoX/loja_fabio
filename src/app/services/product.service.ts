import { Injectable } from '@angular/core';
import { Produto, Categories } from './product.type.js';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private categoriasCache: Categories[] = [];
  private produtosCache: Produto[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService) {

  }

  findCategories(): Observable<Categories[]> {
    if (this.categoriasCache.length > 0) {
      return of(this.categoriasCache);
    }

    return this.http.get<Categories[]>('https://fakestoreapi.com/products/categories')
      .pipe(
        tap((categorias) => {

          this.categoriasCache = categorias;

          this.toastr.info('Categorias carregadas com sucesso!', 'Informe', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: "decreasing"
          });
        }),
        catchError((error) => {
          this.toastr.error(
            'Não foi possível carregar categorias. Atualize a página para tentar novamente.',
            'Atenção',
            { timeOut: 10000, progressBar: true, progressAnimation: "decreasing" }
          );
          return of([]); 
        })        
      );
  }

  findProducts(): Observable<Produto[]> {
    if (this.produtosCache.length > 0) {
      return of(this.produtosCache);
    }
    return this.http.get<Produto[]>('https://fakestoreapi.com/products')
      .pipe(
        tap(produtos => {

          // Ordena os produtos em ordem decrescente pelo id
          produtos.sort((a, b) => b.id - a.id);

          this.produtosCache = produtos;
          this.toastr.info('Produtos carregados com sucesso!', 'Informe', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: "decreasing"
          });
        }),
        catchError((error) => {
          this.toastr.error(
            'Não foi possível carregar categorias. Atualize a página para tentar novamente.',
            'Atenção',
            { timeOut: 10000, progressBar: true, progressAnimation: "decreasing" }
          );
          return of([]); 
        })        
      );
  }

}
