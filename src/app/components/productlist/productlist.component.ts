import { Component, OnInit } from '@angular/core';
import { Produto, Rating } from '../../services/product.type.js';
import { ProductService } from '../../services/product.service.js';
import { CapitalizeWordsPipe } from '../../helpers/capitalize.pipe.js';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service.js';
import { ProductCardComponent } from '../productcard/productcard.component';
import { CartService } from '../../services/cart.service.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CapitalizeWordsPipe,
    FormsModule,
    NgxMaskDirective,
    ProductCardComponent
  ],
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductListComponent implements OnInit {

  ratings: Rating[] = [];
  produtos: Produto[] = [];
  categorias: string[] = [];

  categoriaSelecionada: string = 'todas';
  precoMin: number | null = null;
  precoMax: number | null = null;
  textoBusca: string = '';

  produtosFiltrados: Produto[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.findProducts().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = produtos;
        this.categorias = Array.from(new Set(produtos.map(p => p.category)));
      },
      error: () => {
        this.produtos = [];
        this.produtosFiltrados = [];
      }
    });
  }

  filtrarProdutos() {
    const min = this.precoMin && this.precoMin.toString().trim() !== '' ? Number(this.precoMin) : null;
    const max = this.precoMax && this.precoMax.toString().trim() !== '' ? Number(this.precoMax) : null;
    const busca = this.textoBusca.toLowerCase().trim();

    this.produtosFiltrados = this.produtos.filter(p => {
      const categoriaOk = this.categoriaSelecionada === 'todas' || p.category === this.categoriaSelecionada;
      const precoOk = (min === null || p.price >= min) && (max === null || p.price <= max);
      const buscaOk = busca === '' ||
        p.title.toLowerCase().includes(busca) ||
        p.description.toLowerCase().includes(busca);

      return categoriaOk && precoOk && buscaOk;
    });
  }

  onProdutoSelecionado(event: { produto: Produto; quantidade: number }) {
    this.cartService.addToCart(event.produto, event.quantidade);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  adicionarAoCarrinho(event: { produto: Produto; quantidade: number }) {
    this.cartService.addToCart(event.produto, event.quantidade);
  }
    
}
