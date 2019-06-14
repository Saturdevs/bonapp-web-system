import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Client } from '../../../shared/models/client';
import { ClientService } from '../../../shared/services/client.service';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-client-new',
  templateUrl: './client-new.component.html',
  styleUrls: ['./client-new.component.scss']
})
export class ClientNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  pageTitle: String = 'Nuevo Cliente';
  newClient: Client;

  constructor(private _clientService: ClientService,
              private _route: ActivatedRoute,
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
        this.showModalError(<any>error)
      }
    );
  }

  showModalError(errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = this.serviceErrorTitle;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  onBack(): void {
    this._router.navigate(['/clients-module/clients', { outlets: { edit: ['selectItem'] } }]);
  }

}
