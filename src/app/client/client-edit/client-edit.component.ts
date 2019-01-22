import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Client } from '../../../shared/models/client';
import { ClientService } from '../../../shared/services/client.service';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  errorMessage: string;  
  client: Client;
  pageTitle: String = 'Editando cliente: ';
  clientNameModified: String;

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
        this.errorMessage = <any>error;
        this.showModalError(this.errorTemplate)
      }
    );
  }

  onBack(): void {
    this._router.navigate(['/clients-module/clients', { outlets: { edit: ['selectItem'] } }]);
  }
  
  showModalError(errorTemplate: TemplateRef<any>){
      this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  showModalCancel(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {backdrop: false});
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
