import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import { 
  CashFlow
} from '../../../shared/index';

@Component({
  selector: 'app-cash-flows-edit',
  templateUrl: './cash-flows-edit.component.html',
  styleUrls: ['./cash-flows-edit.component.scss']
})
export class CashFlowsEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  private pageTitle: string = "Detalle";
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  cashFlow: CashFlow;
  paymentTypeName: String;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.cashFlow = data['cashFlow'];
      }
    )
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  onBack(): void {
    this._router.navigate(['/sales/cash-flows', { outlets: { edit: null } }]);
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;
  }

}
