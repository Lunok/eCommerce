import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.scss']
})
export class ShowProductsComponent implements OnInit {

  @Input() products: Product[];
  public productModalOpen: boolean = false;
  public selectedProduct: Product;
  public file: File;
  public progress: number = 0;
  public baseUrlImage = `${environment.api_image}`;

  constructor(private productService: ProductsService, private fileService: FileUploadService) { }

  ngOnInit(): void {
  }

  onEdit(product: Product): void {
    this.productModalOpen = true;
    this.selectedProduct = product;
  }

  onDelete(product: Product): void {

  }

  addProduct(): void {
    this.selectedProduct = undefined!;
    this.productModalOpen = true;
  }

  handleFinish(event): void {

    if(event) {
      let product = event.product ? event.product : null;
      this.file = event.file;

      if(product) {
        if(this.selectedProduct) {
          // Update a product
          product.idProduct = this.selectedProduct.idProduct;
          this.editProductToServer(product);
        } else {
          // Add a new product
          this.addProductToServer(product);
        }
      }
    }

    this.productModalOpen = false;
  }

  addProductToServer(product: Product) {
    this.productService.addProduct(product).subscribe(
      (data) => {
        if(data.status == 200) {
          // Update frontend
          if(this.file) {
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>) => {
                this.uploadImage(event);
              }
            );
          }

          product.idProduct = data.args.lastInsertId;
          this.products.push(product);
        }
    },
    (error) => {
      console.log("Une erreur est survenue lors de l'enregistrement des données du nouveau produit.")
    });
  }

  editProductToServer(product: Product) {
    this.productService.editProduct(product).subscribe(
      (data) => {
        if(data.status == 200) {
          if(this.file) {
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>) => {
               this.uploadImage(event);
              }
            );

            this.fileService.deleteImage(product.oldImage).subscribe(
              (data: Response) => {
                console.log(data);
              }
            );
          }

          // Update frontend
          const index = this.products.findIndex(p => p.idProduct == product.idProduct);
          this.products = [
            ...this.products.slice(0, index),
            product,
            ...this.products.slice(index+1)
          ]
        } else {
          console.log("Une erreur est survenue lors de l'édition du produit.");
        }
      }
    )
  }

  uploadImage(event) {
    switch(event.type) {
      case HttpEventType.Sent:
        console.log("Requête envoyée avec succès.");
      break;
      case HttpEventType.UploadProgress:
        this.progress = (event.total! > 0 ? Math.round(event.loaded / event.total! * 100) : 0);
      break;
      case HttpEventType.Response:
        console.log(event.body);

        setTimeout(() => {
          this.progress = 0;
        }, 1500);
      break;
    }
  }
}
