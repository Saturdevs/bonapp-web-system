import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ClientService } from '../../../shared/services/client.service';
import { Client } from '../../../shared/models/client';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  pageTitle: string = "Clientes";
  public modalRef: BsModalRef;
  clients: Client[];
  filteredClients: Client[];
  errorMessage: string;  
  idClientDelete: any;

  constructor(private _clientService: ClientService,
              private route: ActivatedRoute,
              private modalService: BsModalService
            ) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.clients = data['clients'];
        this.filteredClients = this.clients;
      }
    )
  }

  getClients(): void {
    this._clientService.getAll()
      .subscribe(clients => {
        this.clients = clients;
        this.filteredClients = this.clients;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  showModalDelete(template: TemplateRef<any>, idClient: any){
    this.idClientDelete = idClient;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deleteClient(){
    if (this.closeModal()){
      this._clientService.deleteClient(this.idClientDelete).subscribe( 
        success=> {
          this.getClients();
        }
      );
    }
  }

  reloadItems(event) {
    this.getClients();
  }

}