import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Client,
  ClientService
} from '../../../shared';

@Component({
  selector: 'app-client-new',
  templateUrl: './client-new.component.html',
  styleUrls: ['./client-new.component.scss']
})
export class ClientNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  pageTitle: String = 'Nuevo Cliente';
  private saveButton: String = 'Guardar';
  private cancelButton: String = 'Cancelar';
  newClient: Client;
  checkboxText: String = 'Tiene Cta Cte';
  
  constructor(private _clientService: ClientService,
              private _router: Router,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.newClient = new Client();
    this.newClient.enabledTransactions = true;
  }

  saveClient(){
    this._clientService.saveClient(this.newClient).subscribe(
      client =>
      { 
        this.onBack()
      },
      error => 
      { 
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>, idCashRegister: any){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;    
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

  onBack(): void {
    this._router.navigate(['/clients-module/clients', { outlets: { edit: ['selectItem'] } }]);
  }

}
