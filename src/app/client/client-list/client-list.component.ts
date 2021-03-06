import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Client,
  ClientService,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  pageTitle: string = "Clientes";
  private serviceErrorTitle = 'Error de Servicio';
  filterLabel = 'Filtrar por Cliente:';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
  clients: Client[];
  filteredClients: Client[];
  idClientDelete: any;
  _listFilter: string;
  previous: any;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective,{static: true}) mdbTable: MdbTableDirective

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredClients = this.listFilter ? this.performFilter(this.listFilter) : this.clients;
  }

  constructor(private _clientService: ClientService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private cdRef: ChangeDetectorRef,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    this.route.data.subscribe(
      data => {
        this.clients = data['clients'];
        this.filteredClients = this.clients;
      }
    )
    this.mdbTable.setDataSource(this.filteredClients);
    this.filteredClients = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar seg??n los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_CLIENT);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_CLIENT);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_CLIENT);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
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
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalDelete(template: TemplateRef<any>, idClient: any) {
    this.idClientDelete = idClient;
    this.modalDeleteTitle = "Eliminar Cliente";
    this.modalDeleteMessage = "??Seguro desea eliminar este Cliente?";
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  deleteClient() {
    if (this.closeModal()) {
      this._clientService.deleteClient(this.idClientDelete).subscribe(
        success => {
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
    this.mdbTable.setDataSource(this.filteredClients);
    this.filteredClients = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

}
