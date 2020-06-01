import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Client,
  ClientService
} from '../../../shared';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string; 
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  client: Client;
  pageTitle: String = 'Editando cliente: ';
  private saveButton: String = 'Aceptar';
  private cancelButton: String = 'Cancelar';
  clientNameModified: String;
  checkboxText: String = 'Tiene Cta Cte';

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService,
              private _clientService: ClientService) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.client = data['client'];
        this.clientNameModified = this.client.name;
      }
    )
  }

  updateClient(client: Client) {
    this._clientService.updateClient(client).subscribe(
      client => { 
        this.client = client,
        this.onBack()
      },
      error => { 
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  onBack(): void {
    this._router.navigate(['/clients-module/clients', { outlets: { edit: ['selectItem'] } }]);
  }
  
  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {backdrop: false});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel(){
    this.onBack();
    this.closeModal();
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

}
