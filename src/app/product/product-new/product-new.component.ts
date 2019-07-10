import { Component, OnInit, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';
import { Size } from '../../../shared/models/size';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { SizeService } from '../../../shared/services/size.service';
import { SharedService } from '../../../shared/services/shared.service';

import { ComboValidators } from '../../../shared/functions/combo.validator';
import { UploadFile, UploadInput, UploadOutput } from 'ng-mdb-pro/pro/file-input';
import { humanizeBytes } from 'ng-mdb-pro/pro/file-input';
import { FileInputComponent } from '../../file-input/file-input.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Collections } from '../../../shared/enums/collections.enum';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.css']
})
export class ProductNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  private modalPriceNotMatchTitle: string;
  private modalPriceNotMatchMessage: string;
  private newProductPictureData: string;
  pictureTouched: boolean = false;
  productForm: FormGroup;
  product: Product = new Product();
  categories: Category[];
  categorySelect: Category;
  clickAceptar: Boolean;
  sizesArray: Size[];
  pageTitle: string = "Nuevo Producto";
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  lastProductCode: string;
  validPicture: string = '';
  lowestPrice: Number = 0;
  duplicatedSizesArray: string[] = []; 
  nameIsAvailable: boolean = false;
  currentCollection : string;
  
  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('priceNotMatch') priceNotMatchTemplate:TemplateRef<any>; 
  get sizes(): FormArray{
    return <FormArray>this.productForm.get('sizes');
  }

  get options(): FormArray{
    return <FormArray>this.productForm.get('options');
  }

  constructor(private _router: Router,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private _sizeService : SizeService,
              private _sharedService: SharedService,
              private modalService : BsModalService,
              private formBuilder: FormBuilder) { }
              
  ngOnInit() {
    this.productForm = this.formBuilder.group({
      cod: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', ComboValidators.hasValue],
      picture: ['',Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      sizes: this.formBuilder.array([]),      
      options: this.formBuilder.array([]),
      available: true
    });
    this.currentCollection = Collections.Product;
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    
    this.getCategories();
    this.getSizes();
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

  getSizes(){
    this._sizeService.getAll().subscribe(
      sizes => {
        this.sizesArray = sizes;
      },
      error => this.showModalError(this.serviceErrorTitle, error.error.message)
    );
  }

  getCategories(){
    this._categoryService.getAll().subscribe(
      categories => {
        this.categories = categories;
      },
      error => this.showModalError(this.serviceErrorTitle, error.error.message)
    );
  }
  
  validateSizes() {
    let product = Object.assign({}, this.productForm.value);
    if(product.sizes.length == 0) {
      this.validateName();
    }
    else{
      if(product.sizes.length > 1) {
        product.sizes.forEach(size => {
          let filteredNames = product.sizes.filter(x => x.name == size.name)
          if(filteredNames.length > 1){
            this.duplicatedSizesArray.push(size.name);
          }
        });
        if(this.duplicatedSizesArray.length > 0){
          let duplicatedSizeModalTitle = "Agregar Producto";
          let duplicatedSizeModalMessage = "Existen tamanos duplicados, por favor corrija e intente nuevamente.";
          this.showModalError(duplicatedSizeModalTitle, duplicatedSizeModalMessage);          
        }
        this.lowestPrice = product.sizes.reduce((min, p) => p.price < min ? p.price : min, product.sizes[0].price);
      } 
      else{
        console.log(product.sizes); 
        this.lowestPrice = product.sizes[0].price;
      }
      if(product.price != this.lowestPrice){
        this.modalPriceNotMatchTitle = "Agregar Producto";
        this.modalPriceNotMatchMessage = "El precio del producto no coincide con el precio del menor tamano. Se modificara el precio del producto para hacerlo coincidir.";
        this.modalRef = this.modalService.show(this.priceNotMatchTemplate, {backdrop: true});
      }
      else{
        if(this.duplicatedSizesArray.length == 0){
          this.validateName();
        }
      }
    }
  }

  closeModalAndContinue(){
    this.productForm.controls.price.setValue(this.lowestPrice);
    this.closeModal();
    this.saveProduct();
  }

  closeModal(){
    if(this.duplicatedSizesArray.length > 0){
      this.duplicatedSizesArray = [];
    }
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  validateName(){
    let p = Object.assign({}, this.productForm.value);
      this._sharedService.validateName(this.currentCollection,p.name)
        .subscribe(result => {
          this.nameIsAvailable = result;
          if(this.nameIsAvailable === true){
            this.saveProduct();
          }
          else{
            let nameInvalidModalTitle = "Agregar Producto";
            let nameInvalidModalMessage = "Ya existe un producto con ese nombre, por favor ingrese uno diferente.";
            this.showModalError(nameInvalidModalTitle, nameInvalidModalMessage);
          }
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        })
  }

  saveProduct() {
    if (this.productForm.dirty && this.productForm.valid) {
      let p = Object.assign({}, this.productForm.value);
      this.fileInputComponent.startUpload();
      this._productService.saveProduct(p)
          .subscribe(
            () => {
              this.onSaveComplete();
            },
            (error: any) => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          );
    } else if (!this.productForm.dirty) {
      this.onSaveComplete();
    }
  }

  onNotified(validator: Array<string>) {
    //console.log(validator);
    validator[0] != '' ? this.validPicture = validator[0]: this.validPicture = '';
    validator[1] != '' ? this.newProductPictureData = validator[1]: this.newProductPictureData = '';    
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.productForm.controls.picture.setValue(this.validPicture);
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onSaveComplete() {
    this.clickAceptar = true;
    this.onBack();
  }

  onBack(): void {
    this._router.navigate(['/restaurant/product']);
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }
}