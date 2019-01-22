import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';

import { ComboValidators } from '../../../shared/functions/combo.validator';
import { UploadFile, UploadInput, UploadOutput } from 'ng-mdb-pro/pro/file-input';
import { humanizeBytes } from 'ng-mdb-pro/pro/file-input';




@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.css']
})
export class ProductNewComponent implements OnInit {

  productForm: FormGroup;
  product: Product = new Product();
  categories: Category[];
  errorMessage: string;
  categorySelect: Category;
  clickAceptar: Boolean;
  sizesArray: Array<string> = new Array("Chico", "Mediano", "Grande");
  pageTitle: string = "Nuevo Producto";
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  lastProductCode: string;

  get sizes(): FormArray{
    return <FormArray>this.productForm.get('sizes');
  }

  get options(): FormArray{
    return <FormArray>this.productForm.get('options');
  }

  constructor(private _router: Router,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      cod: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', ComboValidators.hasValue],
      picture: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      sizes: this.formBuilder.array([]),      
      options: this.formBuilder.array([]),
      available: true
    });

    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    
    this.getCategories();
    this.productForm.patchValue({
      category: "default"
    })

    this.clickAceptar = false;
  }

  buildProductSizes(): FormGroup {
    return this.formBuilder.group({
                name: ['default', ComboValidators.hasValue],
                price: ['', Validators.required]
              })
  }

  buildProductOptions(): FormGroup {
    return this.formBuilder.group({
                  name: ['', Validators.required],
                  price: ['', Validators.required]
                })
  }

  addProductSize(): void {
    this.sizes.push(this.buildProductSizes());
  }

  removeSize(index): void {
    this.sizes.removeAt(index);
  }

  addProductOption(): void {
    this.options.push(this.buildProductOptions());
  }

  removeOption(index): void {
    this.options.removeAt(index);
  }

  getCategories(){
    this._categoryService.getAll().subscribe(
      categories => {
        this.categories = categories;
      },
      error => this.errorMessage = <any>error
    );
  }

  saveProduct() {
    if (this.productForm.dirty && this.productForm.valid) {
      let p = Object.assign({}, this.productForm.value);

      this._productService.saveProduct(p)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
    } else if (!this.productForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete() {
    this.clickAceptar = true;
    this.onBack();
  }

  onBack(): void {
    this._router.navigate(['/restaurant/product']);
  }

  showFiles() {
    let files = "";
    for(let i = 0; i < this.files.length; i ++) {
      files += this.files[i].name
       if(!(this.files.length-1 == i)) {
         files += ", "
      }
    }
    return files;
 }

startUpload(): void {
    const event: UploadInput = {
    type: 'uploadAll',
    url: '/upload',
    method: 'POST',
    data: { foo: 'bar' },
    concurrency: 1
    }

    this.uploadInput.emit(event);
}

cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
}

onUploadOutput(output: UploadOutput | any): void {

    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file); // add file to array when added
    } else if (output.type === 'uploading') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    this.showFiles();

}


}