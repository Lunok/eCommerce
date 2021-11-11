import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.scss']
})
export class ShowProductsComponent implements OnInit {

  @Input() products: Product[];
  public productModalOpen: boolean = false;
  public selectedProduct: Product;

  constructor() { }

  ngOnInit(): void {
  }

  onEdit(product: Product): void {
    this.productModalOpen = true;
    this.selectedProduct = product;
  }

  onDelete(product: Product): void {

  }

  addProduct(): void {
    this.productModalOpen = true;
  }

  handleFinish(product): void {
    if(product) {
      if(this.selectedProduct) {
        // Update a product

      } else {
        // Add a new product

      }
    }

    this.productModalOpen = false;
  }
}
