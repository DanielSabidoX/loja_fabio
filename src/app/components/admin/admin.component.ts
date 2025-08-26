import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto, Categories } from '../../types/product.type';
import { ProductService } from '../../services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import interact from 'interactjs';

declare var bootstrap: any;

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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    const modalEl = document.getElementById('produtoModal');
    this.modal = new bootstrap.Modal(modalEl, { backdrop: 'static' });

    const deleteModalEl = document.getElementById('confirmDeleteModal');
    this.deleteModal = new bootstrap.Modal(deleteModalEl, { backdrop: 'static' });
  }

  ngAfterViewInit() {
    interact('.modal.draggable .modal-dialog').draggable({
      allowFrom: '.modal-header',
      listeners: {
        move(event) {
          const target = event.target as HTMLElement;
          const x = (parseFloat(target.getAttribute('data-x') || '0')) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y') || '0')) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
        }
      }
    });
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

  saveProduto(form: NgForm) {
    if (form.invalid) {
      return; 
    }

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
        this.closeModal();
      });
    } else {
      this.productService.createProduct(this.editProduto).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  edit(p: Produto) {
    this.editProduto = { ...p };
  }

  delete(p: Produto) {
    this.deleteProduto = p;
    this.deleteModal.show();
  }

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
