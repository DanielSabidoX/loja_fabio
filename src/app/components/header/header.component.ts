import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Categories } from '../../services/product.type.js';
import { ToastrService } from 'ngx-toastr';
import { CapitalizeWordsPipe } from '../../helpers/capitalize.pipe';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CapitalizeWordsPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  tema: string = 'light';
  modo_tema: string = 'Modo Claro';
  categorias: Categories[] = [];

  isAuthenticated: boolean = false;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Carregar tema salvo
    const savedTema = localStorage.getItem('tema');
    const savedModoTema = localStorage.getItem('modo_tema');

    if (savedTema) {
      this.tema = savedTema;
      this.modo_tema = savedModoTema || 'Modo Claro';
    }
    document.documentElement.setAttribute('data-bs-theme', this.tema);

    // Buscar categorias
    this.productService.findCategories().subscribe({
      next: (categorias) => {
        this.toastr.info('Categorias carregadas com sucesso!', 'Informe', {
          timeOut: 3000, progressBar: true, progressAnimation: "decreasing"
        });
        this.categorias = categorias;
      },
      error: () => {
        this.toastr.error(
          'Não foi possível carregar categorias. Atualize a página para tentar novamente.',
          'Atenção',
          { timeOut: 10000, progressBar: true, progressAnimation: "decreasing" }
        );
        this.categorias = [];
      }
    });
  }

  toggleTheme(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.tema = checkbox.checked ? 'dark' : 'light';
    this.modo_tema = checkbox.checked ? 'Modo Escuro' : 'Modo Claro';
    document.documentElement.setAttribute('data-bs-theme', this.tema);

    localStorage.setItem('tema', this.tema);
    localStorage.setItem('modo_tema', this.modo_tema);
  }
}
