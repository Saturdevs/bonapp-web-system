import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import {
  Product,
  Category,
  ProductService,  
  Size
} from '../../../shared';

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

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  private modalPriceNotMatchTitle: string;
  private modalPriceNotMatchMessage: string;
  private productPictureData: string;
  pictureTouched: boolean;
  validPicture: string;
  pageTitle: string = 'Product Modify';
  productForm: FormGroup;
  productOption: FormArray;
  product: Product = new Product();
  categories: Category[];
  productNameModified: string;
  clickAceptar: Boolean;
  private sub: Subscription;
  path: string = '../../../assets/img/products/';
  checkboxAvailableText: String = 'Disponible';
  duplicatedSizesArray: string[] = [];
  defaultSize: Number = -1;
  defaultPrice: Number = 0;
  sizesArray: Size[];

  @ViewChild('priceNotMatch') priceNotMatchTemplate: TemplateRef<any>;
  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  get sizes(): FormArray {
    return <FormArray>this.productForm.get('sizes');
  }

  get options(): FormArray {
    return <FormArray>this.productForm.get('options');
  }

  setDefaultSize(index) {
    this.defaultSize = index
  }

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService) { }

  ngOnInit() {    
    this.sizesArray = this._route.snapshot.data['sizes'];
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
  }

  buildProductSizes(checked): FormGroup {
    return this.formBuilder.group({
      sizeId: ['default', Validators.required],
      price: ['', Validators.required],
      default: [checked]
    })
  }

  buildProductOptions(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  addProductSize(): void {
    if (this.sizes.length === 0) {
      this.sizes.push(this.buildProductSizes(true));
      this.setDefaultSize(0);
    }
    else {
      this.sizes.push(this.buildProductSizes(false));
    }
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
    this.productPictureData = this.product.pictures;
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
      name: [{ value: options.name, disabled: true }, Validators.required],
      price: [options.price, Validators.required]
    }));
    const prodOptFormArray = this.formBuilder.array(prodOpt);
    this.productForm.setControl('options', prodOptFormArray);
    const prodSizes = this.product.sizes.map(sizes => this.formBuilder.group({
      sizeId: [sizes.sizeId, ComboValidators.hasValue],
      price: [sizes.price, Validators.required],
      default: [sizes.default]
    }));
    const prodSizesFormArray = this.formBuilder.array(prodSizes);
    this.productForm.setControl('sizes', prodSizesFormArray);
    this.path = this.path + this.product.pictures;
  }

  updateProduct() {
    let prod = Object.assign({}, this.product, this.productForm.value);
    this._productService.updateProduct(prod).subscribe(
      product => {
        this.product = product;
        this.clickAceptar = true;
        this.onBack();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  validateSizes() {
    let product = Object.assign({}, this.productForm.value);
    if (product.sizes.length == 0) {
      this.updateProduct();
    }
    else {
      if (product.sizes.length > 1) {
        product.sizes.forEach(size => {
          let filteredNames = product.sizes.filter(x => x.sizeId == size.sizeId)
          if (filteredNames.length > 1) {
            this.duplicatedSizesArray.push(size.sizeId);
          }
          if (product.sizes.indexOf(size) == this.defaultSize.valueOf()) {
            size.default = true;
          }
          else {
            size.default = false;
          }
        });
        if (this.duplicatedSizesArray.length > 0) {
          let duplicatedSizeModalTitle = "Agregar Producto";
          let duplicatedSizeModalMessage = "Existen tamanos duplicados, por favor corrija e intente nuevamente.";
          this.showModalError(duplicatedSizeModalTitle, duplicatedSizeModalMessage);
        }
        this.defaultPrice = product.sizes[this.defaultSize.valueOf()].price;
      }
      else {
        this.defaultPrice = product.sizes[this.defaultSize.valueOf()].price;
      }
      if (product.price != this.defaultPrice) {
        this.modalPriceNotMatchTitle = "Agregar Producto";
        this.modalPriceNotMatchMessage = "El precio del producto no coincide con el precio del tamaño por defecto. Se modificara el precio del producto para hacerlo coincidir.";
        this.modalRef = this.modalService.show(this.priceNotMatchTemplate, { backdrop: true });
      }
      else {
        if (this.duplicatedSizesArray.length == 0) {
          this.updateProduct();
        }
      }
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  onNotified(validator: Array<string>) {
    validator[0] != '' ? this.validPicture = validator[0] : this.validPicture = '';
    validator[1] != '' ? this.productPictureData = validator[1] : this.productPictureData = '';
    this.pictureTouched = true;
    if (this.validPicture != '') {
      this.product.pictures = this.productPictureData;
    }
  }

  closeModal() {
    if (this.duplicatedSizesArray.length > 0) {
      this.duplicatedSizesArray = [];
    }
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  closeModalAndContinue() {
    this.productForm.controls.price.setValue(this.defaultPrice);
    this.closeModal();
    this.updateProduct();
  }

  closeModalAndGoBack() {
    this.closeModal();
    this.onBack();
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

  onBack(): void {
    this._router.navigate(['/restaurant/product']);
  }
}
