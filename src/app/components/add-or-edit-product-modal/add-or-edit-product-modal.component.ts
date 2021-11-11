import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.scss']
})
export class AddOrEditProductModalComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  @Output() finish = new EventEmitter();
  productForm: FormGroup;
  categories: Category[];
  categorySubscription: Subscription;
  idCategory: number = 1;

  constructor(private formBuilder: FormBuilder, private categoryService: CategoriesService) {
    this.productForm = formBuilder.group({
      productInfos: formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required],
      }),
      illustration: formBuilder.group({
        image: ['', Validators.required],
      })
    })
   }

   get isProductInfosInvalid(): boolean {
    return  this.productForm.get('productInfos')!.invalid;
   }

   get isIllustrationInvalid(): boolean {
    return this.productForm.get('illustration')!.invalid;
   }

   handleCancel() {
    this.finish.emit();
    this.close();
   }

   handleFinish() {
    const product = {
      ...this.productForm.get('productInfos')?.value,
      ...this.productForm.get('illustration')?.value,
      category: this.idCategory
    }

    this.finish.emit(product);
    this.close();
   }

   close(): void {
    this.productForm.reset();
    this.idCategory = 1;
   }

   selectCategory(id: number) {
    this.idCategory = id;
   }

  ngOnInit(): void {
    this.categorySubscription = this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.result;
      },
      (error) => {
        console.log("Une erreur est survenue lors de la récupération des catégories.");
      }
    );
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
}
