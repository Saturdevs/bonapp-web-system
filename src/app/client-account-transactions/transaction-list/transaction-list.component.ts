import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ClientService } from '../../../shared/services/client.service';
import { Transaction } from '../../../shared/models/transaction';
import { Client } from '../../../shared/models/client';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  pageTitle: string = "Cuentas Corrientes";
  public modalRef: BsModalRef;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  errorMessage: string;  
  idClientTransactionDelete: any;
  idTransactionDelete: any;
  clientsWithTransactions: Client[];
  clientsSelect: Array<any> = [];
  selectedValue: string = '';

  constructor(private _clientService: ClientService,
              private route: ActivatedRoute,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.transactions = data['transactions'];
        this.filteredTransactions = this.transactions;
      }
    );  
    
    this.getClientsWithTransactions();    
  }

  getTransactions(): void {
    this._clientService.getTransactions()
      .subscribe(transactions => {
        this.transactions = transactions;
        this.filteredTransactions = this.transactions;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  getClientsWithTransactions(): void {
    this._clientService.getClientsWithTransactions()
      .subscribe(clients => {
        this.clientsWithTransactions = clients;        

        this.clientsSelect.push({ value: 'default', label: 'Todos', selected: true });
        this.clientsWithTransactions.map(client => {
          this.clientsSelect.push({value: client._id, label: client.name})
        });        
        this.selectedValue = 'default';        
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  getTransactionsByClient(clientId) {
    this._clientService.getTransactionsByClient(clientId)
      .subscribe(transactions => {
        this.filteredTransactions = transactions;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  filterTransactions(clientId): void {
    if (clientId === 'default') {
      this.getTransactions();
    }
    else {
      this.getTransactionsByClient(clientId);
    }    
  }

  showModalDelete(template: TemplateRef<any>, idClient: any, idTransaction: Number){
    this.idClientTransactionDelete = idClient;
    this.idTransactionDelete = idTransaction;
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
              return;             
            }
          })
          
          this._clientService.updateClient(client).subscribe(
            success=> {
              this.getTransactions();
            }
          )
        }
      );
    }
  }

  reloadItems(event) {
    this.getTransactions();
  }

}