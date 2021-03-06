import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import {
  Product,
  Category,
  Size,
  ProductService
} from '../../../shared';

import { ComboValidators } from '../../../shared/functions/combo.validator';
import { FileInputComponent } from '../../file-input/file-input.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MdbTablePaginationComponent, MdbTableDirective } from 'ng-uikit-pro-standard';
import { DailyMenu } from '../../../shared/models/dailyMenu';
import { DailyMenuService } from '../../../shared/services/daily-menu.service';


@Component({
  selector: 'app-daily-menu-new',
  templateUrl: './daily-menu-new.component.html',
  styleUrls: ['./daily-menu-new.component.scss']
})
export class DailyMenuNewComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  private modalPriceNotMatchTitle: string;
  private modalPriceNotMatchMessage: string;
  newProductPictureData: string;
  pictureTouched: boolean = false;
  productForm: FormGroup;
  product: Product = new Product();
  dailyMenu: DailyMenu = new DailyMenu();
  clickAceptar: Boolean;
  productArray: Product[];
  pageTitle: string = "Nuevo Menu del dia";
  validPicture: string = '';
  relatedProducts: Array<string> = [];
  defaultPrice: Number = 0;
  _listFilter: string;

  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective,{static: true}) mdbTable: MdbTableDirective

  @ViewChild('priceNotMatch') priceNotMatchTemplate: TemplateRef<any>;
  filteredProductArray: any;
  previous: any;


  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProductArray = this.listFilter ? this.performFilter(this.listFilter) : this.productArray;
  }

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _dailyMenuService: DailyMenuService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.productArray = data['products'];
      }
    )
    this.filteredProductArray = this.productArray;



    this.mdbTable.setDataSource(this.filteredProductArray);
    this.filteredProductArray = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();

    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      pictures: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      products: [[], Validators.required]
    });

    
    this.clickAceptar = false;
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  clickAvailable(id) {
    if(this.relatedProducts.indexOf(id) === -1){
      this.relatedProducts.push(id);
    }else{
      this.relatedProducts.splice(this.relatedProducts.indexOf(id),1);
    }
    this.productForm.controls.products.setValue(this.relatedProducts);
  }

  performFilter(filterBy: string): Product[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.productArray.filter((product: Product) =>
      product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  } 

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  saveDailyMenu() {
    if (this.productForm.dirty && this.productForm.valid) {
      let p = Object.assign({}, this.productForm.value);
      this._dailyMenuService.save(p)
        .subscribe(dailyMenu => {
          this.onBack();
        })
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

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "??Est?? seguro que desea salir sin guardar los cambios?";
  }

  onSaveComplete() {
    this.clickAceptar = true;
    this.onBack();
  }

  onBack(): void {
    this._router.navigate(['/restaurant/dailyMenu']);
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }
}
