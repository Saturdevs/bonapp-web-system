import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OrderService, Order } from '../../../shared';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  /**Labels and strings */
  public pageTitle: string = "Ventas";
  private serviceErrorTitle = 'Error de Servicio';   
  private modalErrorTittle: string;
  private modalErrorMessage: string; 

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;   
  public modalRef: BsModalRef;
  orders: Order[];
  filteredOrders: Order[];
  price: Number;
  previous: any = [];

  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective

  constructor(private orderService: OrderService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.price = 0;
    this.orders = this.route.snapshot.data['orders'];
    this.filteredOrders = this.orders;    

    this.mdbTable.setDataSource(this.filteredOrders);
    this.filteredOrders = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(9);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  getOrders() {
    this.orderService.getAll().subscribe(
      orders => {
        this.orders = orders;
        this.filteredOrders = this.orders;
      },
      error => { 
        this.showModalError(this.serviceErrorTitle, error.error.message);                             
      }
    )
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

  reloadItems(event) {
    this.getOrders();
  }

}
