import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ClientService } from '../../../shared/services/client.service';
import { Transaction } from '../../../shared/models/transaction';
import { Client } from '../../../shared/models/client';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  pageTitle: string = "Cuentas Corrientes";
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  idClientTransactionDelete: any;
  idTransactionDelete: any;
  clientsWithTransactions: Client[];
  clientsSelect: Array<any> = [];
  selectedValue: string = '';
  selectedClientName: String;
  amount: number;
  cantTransactions: number;
  previous: any;

  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective
  
  constructor(private _clientService: ClientService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {    
    this.route.data.subscribe(
      data => {
        this.transactions = data['transactions'];
        this.filteredTransactions = this.transactions;
        this.clientsWithTransactions = data['clientsWithTransactions'];
        this.calculateAmountAndCantTransactions(this.filteredTransactions);
      }
    );  
    
    this.buildClientsSelectArray();
    
    this.mdbTable.setDataSource(this.filteredTransactions);
    this.filteredTransactions = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(7);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();    
  }

  getTransactions(): void {
    this._clientService.getTransactions()
      .subscribe(transactions => {
        this.transactions = transactions;
        this.filteredTransactions = this.transactions;
        this.calculateAmountAndCantTransactions(this.filteredTransactions);
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  buildClientsSelectArray(): void {
    this.clientsSelect.push({ value: 'default', label: 'Todos', selected: true });
    this.clientsWithTransactions.map(client => {
      this.clientsSelect.push({value: client._id, label: client.name})
    });        
    this.selectedValue = 'default';  
  }

  getTransactionsByClient(clientId) {
    this._clientService.getTransactionsByClient(clientId)
      .subscribe(transactions => {
        this.filteredTransactions = transactions;
        this.calculateAmountAndCantTransactions(this.filteredTransactions);
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  filterTransactions(clientId): void {    
    if (clientId === 'default') {
      this.getTransactions();
    }
    else {
      let selectedClient = this.clientsWithTransactions.find(c => c._id == clientId);
      this.selectedClientName = selectedClient.name;      
      this.getTransactionsByClient(clientId);
    }    
  }

  calculateAmountAndCantTransactions(transactions: Array<Transaction>) {
    this.amount = 0;
    this.cantTransactions = 0;
    transactions.map(t => {
      if (t.deleted === false) {
          this.amount += t.amount;
          this.cantTransactions += 1;
        }
      }
    )
  }

  showModalDelete(template: TemplateRef<any>, idClient: any, idTransaction: Number){
    this.idClientTransactionDelete = idClient;
    this.idTransactionDelete = idTransaction;
    this.modalDeleteTitle = "Eliminar Transacción";
    this.modalDeleteMessage = "¿Seguro desea eliminar esta Transacción?";
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deleteTransaction(){
    if (this.closeModal()){
      this._clientService.getClient(this.idClientTransactionDelete).subscribe( 
        client=> {
          client.transactions.map(transaction => {
            if (transaction._id === this.idTransactionDelete) 
            {
              transaction.deleted = true; 
              client.balance -= transaction.amount;              
              return;             
            }
          })
          
          this._clientService.updateClient(client).subscribe(
            success=> {
              this.getTransactions();
            },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          )
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  reloadItems(event) {
    this.getTransactions();
  }

}
