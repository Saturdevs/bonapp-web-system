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

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = "Clientes";
  private serviceErrorTitle = 'Error de Servicio';
  private filterLabel = 'Filtrar por Cliente:';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
  clients: Client[];
  filteredClients: Client[];
  idClientDelete: any;
  _listFilter: string;

  get listFilter(): string {
      return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredClients = this.listFilter ? this.performFilter(this.listFilter) : this.clients;
  }

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

  performFilter(filterBy: string): Client[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.clients.filter((client: Client) => client.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getClients(): void {
    this._clientService.getAll()
      .subscribe(clients => {
        this.clients = clients;
        this.filteredClients = this.clients;
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

  showModalDelete(template: TemplateRef<any>, idClient: any){
    this.idClientDelete = idClient;
    this.modalDeleteTitle = "Eliminar Cliente";
    this.modalDeleteMessage = "¿Seguro desea eliminar este Cliente?";
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
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
    }
  }

  reloadItems(event) {
    this.getClients();
  }

}
