import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Produto } from '../../services/product.type';
import { CartService } from '../../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, CurrencyPipe, NgxMaskDirective],
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductDetailComponent implements OnInit {

  produto!: Produto;
  quantidade: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.findProducts().subscribe(produtos => {
      this.produto = produtos.find(p => p.id === id)!;
    });
  }

  inc() { this.quantidade = Math.min(this.quantidade + 1, 9999); }
  dec() { this.quantidade = Math.max(this.quantidade - 1, 1); }

  onQuantidadeChange(val: string) {
    const n = Number(val);
    this.quantidade = Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }

  adicionarAoCarrinho() {
    this.cartService.addToCart(this.produto, this.quantidade);
  }
}
