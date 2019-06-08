import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Client } from '../../../shared/models/client';
import { ClientService } from '../../../shared/services/client.service';
import { ArqueoCaja } from '../../../shared/models/arqueo-caja';
import { ArqueoCajaService } from '../../../shared/services/arqueo-caja.service';
import { CashRegister } from '../../../shared/models/cash-register';
import { PaymentType } from '../../../shared/models/payment-type';
import { isNullOrUndefined } from 'util';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-transaction-new',
  templateUrl: './transaction-new.component.html',
  styleUrls: ['./transaction-new.component.scss']
})
export class TransactionNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  paymentTypes: PaymentType[];
  cashRegisters: CashRegister[];
  clients: Client[];
  pageTitle: String = 'Nueva Transacción';
  newTransaction;
  hasCashRegister = true;
  showMessageCashRegister = false;
  hasPaymentType = true;
  showMessagePaymentType = false;
  hasClient = true;
  showMessageClient = false;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _clientService: ClientService,
              private _arqueoService: ArqueoCajaService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.newTransaction = {};
    this.newTransaction.cashRegister = "default";
    this.newTransaction.client = "default";
    this.newTransaction.paymentType = "default";

    this._route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters']
      }
    )

    this._route.data.subscribe(
      data => {
        this.paymentTypes = data['paymentTypes']
      }
    )

    this._route.data.subscribe(
      data => {
        this.clients = data['clients']
      }
    )

  }

  saveTransaction(){
    this._clientService.getClient(this.newTransaction.client).subscribe(
      client => {
        if (client.enabledTransactions) {
          let transact = {
            amount: this.newTransaction.amount,
            paymentMethod: this.newTransaction.paymentType,
            cashRegister: this.newTransaction.cashRegister,
            comment: this.newTransaction.comment,
            deleted: false
          };
  
          client.transactions.push(transact);
          if (isNullOrUndefined(client.balance)) {
            client.balance = 0;
          }
          client.balance = client.balance + transact.amount;
          client.dateOfLastTransaction = new Date();
  
          this._clientService.updateClient(client).subscribe(
            success => { 
              this._arqueoService.getArqueoOpenByCashRegister(this.newTransaction.cashRegister).subscribe(
                arqueo => {
                  if (!isNullOrUndefined(arqueo)) {
                    let ingreso = {
                      paymentType: this.newTransaction.paymentType,
                      desc: 'Cobros clientes cta. cte',
                      amount: this.newTransaction.amount
                    };

                    arqueo.ingresos.push(ingreso);

                    this._arqueoService.updateArqueo(arqueo).subscribe(
                      success => {},
                      error => {
                        this.showModalError(this.serviceErrorTitle, <any>error);
                      }
                    );
                  }
                }
              )
              this.onBack();
            },
            error => { 
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          );
        } else {
          let errorMessage = "El cliente seleccionado no tiene una cuenta corriente habilitada. Por favor habilite la opción cuenta corriente en la configuración del Cliente.";
          let errorTitle = "Cta Cte Inhabilitada"
          this.showModalError(errorTitle, errorMessage)
        }        
      },
      error => 
      { 
        this.showModalError(this.serviceErrorTitle, <any>error);
      }
    );        
  }

  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }


  onBack(): void {
    this._router.navigate(['/clients-module/accountTransactions', { outlets: { edit: ['selectItem'] } }]);
  }

  validateCashRegister(value) {   
    if (value === 'default') {
      this.hasCashRegister = true;
      this.showMessageCashRegister = true;
    } else {
      this.hasCashRegister = false;
      this.showMessageCashRegister = false;
    }
  }

  validatePaymentType(value) { 
    if (value === 'default') {
      this.hasPaymentType = true;
      this.showMessagePaymentType = true;
    } else {
      this.hasPaymentType = false;
      this.showMessagePaymentType = false;
    }
  }

  validateClient(value) {   
    if (value === 'default') {
      this.hasClient = true;
      this.showMessageClient = true;
    } else {
      this.hasClient = false;
      this.showMessageClient = false;
    }
  }

}
