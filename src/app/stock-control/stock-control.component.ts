import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { Product, ProductService } from '../../shared';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-stock-control',
  templateUrl: './stock-control.component.html',
  styleUrls: ['./stock-control.component.scss']
})
export class StockControlComponent implements OnInit, AfterViewInit {

  constructor(private productService: ProductService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef) { }

  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective
  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  filteredProducts: Product[] = [];
  pageTitle: string = "Control de Stock";
  private serviceErrorTitle = 'Error de Servicio';
  private filterLabel = 'Filtrar por Producto:';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
  products: Product[] = [];
  _listFilter: string;
  previous: any;

  ngOnInit() {
    this.products = this.route.snapshot.data['products'];

    this.filteredProducts = this.products;

    this.mdbTable.setDataSource(this.filteredProducts);
    this.filteredProducts = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }


  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  performFilter(filterBy: string): Product[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: Product) => product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  reloadItems(event){
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAll()
      .subscribe(products => {
        this.products = products;
        this.filteredProducts = this.products;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

}
