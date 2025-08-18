import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Produto } from '../../types/product.type';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, FormsModule, NgxMaskDirective],
  templateUrl: './productcard.component.html',
  styleUrls: ['./productcard.component.css']
})
export class ProductCardComponent {
  @Input() produto!: Produto;

  // Agora emitimos produto + quantidade
  @Output() selecionar = new EventEmitter<{ produto: Produto; quantidade: number }>();

  quantidade: number = 1;

  inc() { this.quantidade = Math.min(this.quantidade + 1, 9999); }
  dec() { this.quantidade = Math.max(this.quantidade - 1, 1); }

  onQuantidadeChange(val: string | number) {
    const n = Number(val);
    this.quantidade = Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }

  onSelecionar() {
    this.selecionar.emit({ produto: this.produto, quantidade: this.quantidade });
  }
}
