import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
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
export class AddOrEditProductModalComponent implements OnInit, OnDestroy, OnChanges {

  @Input() product: Product;
  @Output() finish = new EventEmitter();
  productForm: FormGroup;
  categories: Category[];
  categorySubscription: Subscription;
  idCategory: number = 1;
  file: File;

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
    if(this.product) {
      return false;
    }

    return this.productForm.get('illustration')!.invalid;
   }

   updateForm(product: Product) {
     this.productForm.patchValue({
      productInfos: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }
     });
     product.oldImage = product.image;
     this.selectCategory(product.Category);
   }

   handleCancel() {
    this.finish.emit();
    this.close();
   }

  handleFinish(){
    let product = {
      ...this.productForm.get('productInfos')?.value,
      ...this.productForm.get('illustration')?.value,
      category: this.idCategory,
      oldImage: null
    }

    if(this.product){
      product.oldImage = this.product.oldImage;
    }

    if(this.file){
      product.image = this.file.name;
    }else{
      product.image = this.product.oldImage;
    }

    this.finish.emit({product: product, file: this.file ? this.file : null});
    this.close();
  }

   close(): void {
    this.productForm.reset();
    this.idCategory = 1;
   }

   detectFile(image): void {
    this.file = image.target.files[0];
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

  ngOnChanges(): void {
    if(this.product) {
      // edit product
      this.updateForm(this.product);
    }
  }
}
