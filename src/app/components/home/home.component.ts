import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Response } from 'src/app/models/response';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public products: Product[];
  public productSub: Subscription;

  constructor(private productServices: ProductsService) { }

  ngOnInit(): void {
    this.productSub = this.productServices.getProducts().subscribe(
      (products: Response) => {
        this.products = products.result;
      },
      (error) => {
        console.log("Une erreur est survenue lors de la récupération des produits.");
      }
    );
  }

}
