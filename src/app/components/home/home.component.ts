import { Component, OnInit } from '@angular/core';
import { Produto, Rating } from '../../services/product.type.js';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { CapitalizeWordsPipe } from '../../helpers/capitalize.pipe';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service.js';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, CapitalizeWordsPipe, FormsModule, NgxMaskDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ratings: Rating[] = [];
  produtos: Produto[] = [];
  categorias: string[] = [];

  categoriaSelecionada: string = 'todas';
  precoMin: number | null = null;
  precoMax: number | null = null;
  textoBusca: string = '';   // 🔹 novo campo de busca

  produtosFiltrados: Produto[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.productService.findProducts().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = produtos;

        // Extrair categorias únicas
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
      const categoriaOk =
        this.categoriaSelecionada === 'todas' || p.category === this.categoriaSelecionada;

      const precoOk =
        (min === null || p.price >= min) &&
        (max === null || p.price <= max);

      const buscaOk =
        busca === '' ||
        p.title.toLowerCase().includes(busca) ||
        p.description.toLowerCase().includes(busca);

      return categoriaOk && precoOk && buscaOk;
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
  
}
