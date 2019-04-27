import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';

import { Subscription }       from 'rxjs/Subscription';

import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';
import { ProductService } from '../../../shared/services/product.service';

import { ComboValidators } from '../../../shared/functions/combo.validator';
import { FileInputComponent } from '../../file-input/file-input.component';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-modify',
  templateUrl: './product-modify.component.html',
  styleUrls: ['./product-modify.component.css']
})
export class ProductModifyComponent implements OnInit {
  pictureTouched: boolean;
  validPicture: string;
  pageTitle: string = 'Product Modify';
  productForm: FormGroup;
  productOption: FormArray;
  product: Product = new Product();
  categories: Category[];
  productNameModified: string;
  productCategoryModified: string;
  productPicModified: string;
  errorMessage: string;
  idProduct: string;
  categorySelect: Category;  
  clickAceptar: Boolean;
  private sub: Subscription;
  sizesArr: Array<string> = new Array("Chico", "Mediano", "Grande");
  path: string = '../../../assets/img/products/';
  public modalRef: BsModalRef;
  
  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;
   
  @ViewChild('noModify') noModifyTemplate:TemplateRef<any>; 

  get sizes(): FormArray{
    return <FormArray>this.productForm.get('sizes');
  }
  
  get options(): FormArray{
    return <FormArray>this.productForm.get('options');
  }

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _productService: ProductService,
              private formBuilder: FormBuilder,
              private modalService: BsModalService) { }
              
  ngOnInit() {
    this.productForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', ComboValidators.hasValue],
      pictures: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      sizes: this.formBuilder.array([]),      
      options: this.formBuilder.array([]),
      available: ''   
    });
    
    this.onProductRetrieved(this._route.snapshot.data['product']);
    this.categories = this._route.snapshot.data['categories'];
    this.clickAceptar = false;

    this.validateProductsBeforeModify();
  }
  
  async validateProductsBeforeModify(){
    let canModify = this._productService.validateProductsBeforeChanges(this.product.code);
    if (await canModify.then(x => x == false)){
      this.modalRef = this.modalService.show(this.noModifyTemplate, {backdrop: true});
    }
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

  removeOption(index): void {
    this.options.removeAt(index);
  }

  addProductOption(): void {
    this.options.push(this.buildProductOptions());
  }

  onProductRetrieved(product: Product): void {
    this.product = product;
    this.productNameModified = this.product.name;
    this.productForm.patchValue({
      code: this.product.code,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      pictures: this.product.pictures,
      category: this.product.category,
      available: this.product.available
    });
    const prodOpt = this.product.options.map(options => this.formBuilder.group({
      name: [options.name, Validators.required],
      price: [options.price, Validators.required]
    }));
    const prodOptFormArray = this.formBuilder.array(prodOpt);
    this.productForm.setControl('options', prodOptFormArray);
    const prodSizes = this.product.sizes.map(sizes => this.formBuilder.group({
      name: [sizes.name, ComboValidators.hasValue],
      price: [sizes.price, Validators.required]
    }));
    const prodSizesFormArray = this.formBuilder.array(prodSizes);
    this.productForm.setControl('sizes', prodSizesFormArray);
    this.path = this.path + this.product.pictures;
  }

  updateProduct() {
    let prod = Object.assign({}, this.product, this.productForm.value);
    this.fileInputComponent.startUpload();
    this._productService.updateProduct(prod).subscribe(
      product => this.product = product,
      error => this.errorMessage = <any>error);
    this.clickAceptar = true;
    this.onBack();
  }

  onNotified(validator: string) {
    console.log(validator);
    validator != '' ? this.validPicture = validator: this.validPicture = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.productForm.controls.picture.setValue(this.validPicture);
    }
  }
  
  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }
  
  closeModalAndGoBack(){
    this.closeModal();
    this.onBack();
  }

  onBack(): void {
    this._router.navigate(['/restaurant/product']);
  }

}
