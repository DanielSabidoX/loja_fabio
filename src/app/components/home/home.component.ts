import { Component, OnInit } from '@angular/core';
import { Produto, Rating, Categories } from '../../services/product.type.js';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';
import { CapitalizeWordsPipe } from '../../helpers/capitalize.pipe';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, CapitalizeWordsPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ratings: Rating[] = [];
  produtos: Produto[] = [];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productService.findProducts().subscribe({
      next: (produtos) => {
        this.toastr.info('Produtos carregados com sucesso!', 'Informe', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing"
        });
        this.produtos = produtos;
      },
      error: () => {
        this.toastr.error(
          'Não foi possível carregar produtos. Atualize a página para carregar a lista de produtos.',
          'Atenção',
          { timeOut: 10000, progressBar: true, progressAnimation: "decreasing" }
        );
        this.produtos = [];
      }
    });
  }

}
