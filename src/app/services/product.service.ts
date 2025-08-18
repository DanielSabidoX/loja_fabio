import { Injectable } from '@angular/core';
import { Produto, Categories } from '../types/product.type.js';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private categoriasCache: Categories[] = [];
  private produtosCache: Produto[] = [];

  private readonly apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  // ---------- CATEGORIAS ----------
  findCategories(): Observable<Categories[]> {
    if (this.categoriasCache.length > 0) return of(this.categoriasCache);

    return this.http.get<Categories[]>('https://fakestoreapi.com/products/categories').pipe(
      tap((categorias) => {
        this.categoriasCache = categorias;
        this.toastr.info('Categorias carregadas com sucesso!', 'Informe', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
      }),
      catchError(err => {
        this.toastr.error('Não foi possível carregar categorias. Atualize a página e tente novamente. Verifique se a API https://fakestoreapi.com/products/categories está disponível.', 'Atenção', {
          timeOut: 20000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
        return of([]);
      })
    );
  }

  // ---------- PRODUTOS ----------
  findProducts(): Observable<Produto[]> {
    if (this.produtosCache.length > 0) return of(this.produtosCache);

    return this.http.get<Produto[]>(this.apiUrl).pipe(
      tap(produtos => {
        produtos.sort((a, b) => b.id - a.id);
        this.produtosCache = produtos;
        this.toastr.info('Produtos carregados com sucesso!', 'Informe', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
      }),
      catchError(err => {
        this.toastr.error('Não foi possível carregar produtos. Atualize a página e tente novamente. Verifique se a API https://fakestoreapi.com/products/ está disponível.', 'Atenção', {
          timeOut: 20000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });        
        return of([]);
      })
    );
  }

  // ---------- CRIAR PRODUTO ----------
  createProduct(produto: Partial<Produto>): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto).pipe(
      tap(p => {
        this.produtosCache.unshift(p);
        this.toastr.success('Produto criado com sucesso!', 'Sucesso', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
      }),
      catchError(err => {
        this.toastr.error('Erro ao criar produto.', 'Atenção', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
        return of(null as any);
      })
    );
  }

  // ---------- ATUALIZAR PRODUTO ----------
  updateProduct(id: number, produto: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto).pipe(
      tap(updated => {
        const index = this.produtosCache.findIndex(p => p.id === id);
        if (index !== -1) this.produtosCache[index] = updated;
        this.toastr.success('Produto atualizado com sucesso!', 'Sucesso', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
      }),
      catchError(err => {
        this.toastr.error('Erro ao atualizar produto.', 'Atenção', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
        return of(null as any);
      })
    );
  }

  // ---------- DELETAR PRODUTO ----------
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.produtosCache = this.produtosCache.filter(p => p.id !== id);
        this.toastr.success('Produto removido com sucesso!', 'Sucesso', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
      }),
      catchError(err => {
        this.toastr.error('Erro ao remover produto.', 'Atenção', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: "decreasing",
          closeButton: true
        });
        return of(undefined);
      })
    );
  }
}
