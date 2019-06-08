import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { PaymentTypeService } from '../../../shared/services/payment-type.service';
import { PaymentType } from '../../../shared/models/payment-type';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-payment-type-list',
  templateUrl: './payment-type-list.component.html',
  styleUrls: ['./payment-type-list.component.scss']
})
export class PaymentTypeListComponent implements OnInit {

  pageTitle: string = "Formas de Pago";
  private serviceErrorTitle = 'Error de Servicio';
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
      });
    }
  }

  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  reloadItems(event) {
    this.getPaymentTypes();
  }

}
