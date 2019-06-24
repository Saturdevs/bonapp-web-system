import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { PaymentTypeService } from '../../../shared/services/payment-type.service';
import { PaymentType } from '../../../shared/models/payment-type';

@Component({
  selector: 'app-payment-type-list',
  templateUrl: './payment-type-list.component.html',
  styleUrls: ['./payment-type-list.component.scss']
})
export class PaymentTypeListComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = "Formas de Pago";
  private cantDeleteDefaultPaymentTypeLabel = 'El tipo de pago por defecto no puede ser eliminado.';
  private serviceErrorTitle = 'Error de Servicio';  
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string = "Eliminar Forma de Pago";
  private modalDeleteMessage: string = "¿Estas seguro que desea eliminar la Forma de Pago?";
  public modalRef: BsModalRef;
  paymentTypes: PaymentType[];
  filteredPaymentTypes: PaymentType[];
  _listFilter: string;
  idPaymentTypeDelete: any;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredPaymentTypes = this.listFilter ? this.performFilter(this.listFilter) : this.paymentTypes;
  }

  constructor(private paymentTypeService: PaymentTypeService,
              private route: ActivatedRoute,
              private modalService: BsModalService
            ) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.paymentTypes = data['paymentTypes'].map(paymentType => {
          if(paymentType.available) {
            paymentType.available = 'Si';
          } else {
            paymentType.available = 'No';
          }

          return paymentType;
        })
      }
    )
    
    this.filteredPaymentTypes = this.paymentTypes;
  }

  performFilter(filterBy: string): PaymentType[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.paymentTypes.filter((paymentType: PaymentType) =>
           paymentType.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getPaymentTypes(): void {
    this.paymentTypeService.getAll()
      .subscribe(paymentTypes => {
        this.paymentTypes = paymentTypes.map(paymentType => {
          if(paymentType.available) {
            paymentType.available = 'Si';
          } else {
            paymentType.available = 'No';
          }

          return paymentType;
        });
        this.filteredPaymentTypes = this.paymentTypes;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, <any>error);
      }
    )
  }

  showModalDelete(template: TemplateRef<any>, idPaymentType: any){
    this.idPaymentTypeDelete = idPaymentType;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deletePaymentType(){
    if (this.closeModal()){
      this.paymentTypeService.deletePaymentType(this.idPaymentTypeDelete).subscribe( success=> {
        this.getPaymentTypes();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, <any>error);
      });
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  reloadItems(event) {
    this.getPaymentTypes();
  }

}
