import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto, Categories } from '../../types/product.type';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

declare var bootstrap: any; // para usar JS do Bootstrap

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  produtos: Produto[] = [];
  categorias: Categories[] = [];
  editProduto: Partial<Produto> = {};
  deleteProduto: Produto | null = null;

  private modal: any;
  private deleteModal: any;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    const modalEl = document.getElementById('produtoModal');
    this.modal = new bootstrap.Modal(modalEl, { backdrop: 'static' });

    const deleteModalEl = document.getElementById('confirmDeleteModal');
    this.deleteModal = new bootstrap.Modal(deleteModalEl, { backdrop: 'static' });

  }

  loadProducts() {
    this.productService.findProducts().subscribe(p => this.produtos = p);
  }

  loadCategories() {
    this.productService.findCategories().subscribe(c => this.categorias = c);
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    this.resetForm();
  }

  saveProduto() {
    if (this.editProduto.price != null) { 
      const numericPrice = Number(
        String(this.editProduto.price)   
          .replace(/\./g, '')           
          .replace(',', '.')            
          .replace('R$ ', '')           
      );
      this.editProduto.price = numericPrice;
    }

    if (this.editProduto.id) {
      this.productService.updateProduct(this.editProduto.id, this.editProduto).subscribe(() => {
        this.loadProducts();
      });
    } else {
      this.productService.createProduct(this.editProduto).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  edit(p: Produto) {
    this.editProduto = { ...p };
  }

  // Ao clicar no botão "Excluir"
  delete(p: Produto) {
    this.deleteProduto = p;
    this.deleteModal.show();
  }

  // Confirmação de exclusão
  confirmDelete() {
    if (this.deleteProduto) {
      this.productService.deleteProduct(this.deleteProduto.id).subscribe(() => {
        this.loadProducts();
        this.deleteModal.hide();
        this.deleteProduto = null;
      });
    }
  }

  resetForm() {
    this.editProduto = {};
  }
}
