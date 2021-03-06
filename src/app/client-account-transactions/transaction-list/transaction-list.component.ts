import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Transaction,
  Client,
  TransactionService,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  pageTitle: string = "Cuentas Corrientes";
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  idTransactionDelete: any;
  clientsWithTransactionsEnabled: Client[];
  clientsSelect: Array<any> = [];
  selectedValue: string = '';
  selectedClientName: String;
  amount: number;
  cantTransactions: number;
  previous: any;
  currentUser: User;
  enableDelete: Boolean;
  enableDetail: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective,{static: true}) mdbTable: MdbTableDirective

  constructor(private _transactionService: TransactionService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private cdRef: ChangeDetectorRef,
    private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    this.route.data.subscribe(
      data => {
        this.transactions = data['transactions'];
        this.filteredTransactions = this.transactions;
        this.clientsWithTransactionsEnabled = data['clientsWithTransactionsEnabled'];
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

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar seg??n los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_TRANSACTION);
    this.enableDetail = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DETAIL_TRANSACTION);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_TRANSACTION);

    this.enableActionButtons = this.enableDelete || this.enableDetail;
  }

  getTransactions(): void {
    this._transactionService.getAll()
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
    this.clientsWithTransactionsEnabled.map(client => {
      this.clientsSelect.push({ value: client._id, label: client.name })
    });
    this.selectedValue = 'default';
  }

  getTransactionsByClient(clientId) {
    return this.transactions.filter(t => t.client._id === clientId);
  }

  filterTransactions(clientId): void {
    if (clientId === 'default') {
      this.filteredTransactions = this.transactions;
    }
    else {
      let selectedClient = this.clientsWithTransactionsEnabled.find(c => c._id == clientId);
      this.selectedClientName = selectedClient.name;
      this.filteredTransactions = this.getTransactionsByClient(clientId);
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

  showModalDelete(template: TemplateRef<any>, idTransaction: Number) {
    this.idTransactionDelete = idTransaction;
    this.modalDeleteTitle = "Eliminar Transacci??n";
    this.modalDeleteMessage = "??Seguro desea eliminar esta Transacci??n?";
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  deleteTransaction() {
    if (this.closeModal()) {
      this._transactionService.deleteTransaction(this.idTransactionDelete).subscribe(
        transaction => {
          this.getTransactions();
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
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  reloadItems(event) {
    this.getTransactions();
  }

}
