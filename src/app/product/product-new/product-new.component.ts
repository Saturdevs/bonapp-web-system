import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import {
  Product,
  Category,
  Size,
  ProductService,
  RightsFunctions,
  Rights,
  AuthenticationService,
  User
} from '../../../shared';

import { ComboValidators } from '../../../shared/functions/combo.validator';
import { FileInputComponent } from '../../file-input/file-input.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.css']
})
export class ProductNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
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
  clickAceptar: Boolean;
  sizesArray: Size[];
  pageTitle: string = "Nuevo Producto";
  validPicture: string = '';
  defaultPrice: Number = 0;
  duplicatedSizesArray: string[] = [];
  nameIsAvailable: boolean = false;
  defaultSize: Number = -1;
  checkboxAvailableText: String = 'Disponible';
  stockControlText = "Controla Stock";
  currentUser: User;

  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('priceNotMatch') priceNotMatchTemplate: TemplateRef<any>;
  enableStock: any;
  get sizes(): FormArray {
    return <FormArray>this.productForm.get('sizes');
  }

  get options(): FormArray {
    return <FormArray>this.productForm.get('options');
  }

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.categories = data['categories'];
        this.sizesArray = data['sizes'];
      }
    )
    this.productForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', ComboValidators.hasValue],
      pictures: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      sizes: this.formBuilder.array([]),
      options: this.formBuilder.array([]),
      available: true,
      stockControl: false,
      stock: this.formBuilder.group({
        min: ['0'],
        current: ['0']
      })
    });


    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableStockControl();
      }
    );

    this.productForm.patchValue({
      category: "default"
    })

    this.clickAceptar = false;
  }

  buildProductSizes(checked): FormGroup {
    return this.formBuilder.group({
      sizeId: ['default', ComboValidators.hasValue],
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

  addProductOption(): void {
    this.options.push(this.buildProductOptions());
  }

  removeOption(index): void {
    this.options.removeAt(index);
  }

  validateSizes() {
    let product = Object.assign({}, this.productForm.value);
    if (product.sizes.length == 0) {
      this.saveProduct();
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
          this.saveProduct();
        }
      }
    }
  }

  closeModalAndContinue() {
    this.productForm.controls.price.setValue(this.defaultPrice);
    this.closeModal();
    this.saveProduct();
  }

  closeModal() {
    if (this.duplicatedSizesArray.length > 0) {
      this.duplicatedSizesArray = [];
    }
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  saveProduct() {
    if (this.productForm.dirty && this.productForm.valid) {
      let p = Object.assign({}, this.productForm.value);
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
    validator[0] != '' ? this.validPicture = validator[0] : this.validPicture = '';
    validator[1] != '' ? this.newProductPictureData = validator[1] : this.newProductPictureData = '';
    this.pictureTouched = true;
    if (this.validPicture != '') {
      this.productForm.controls.pictures.setValue(this.newProductPictureData);
    }
  }

   /**
   * Habilita/Deshabilita las opciones stock
   */
  enableStockControl(): void {
    this.enableStock = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.STOCK_CONTROL);
  }


  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
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

  setDefaultSize(index) {
    this.defaultSize = index
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }
}