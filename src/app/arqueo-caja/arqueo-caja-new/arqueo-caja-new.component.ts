import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ArqueoCaja } from '../../../shared/models/arqueo-caja';
import { ArqueoCajaService } from '../../../shared/services/arqueo-caja.service';
import { CashRegister } from '../../../shared/models/cash-register';
import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { isNullOrUndefined, error } from 'util';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-arqueo-caja-new',
  templateUrl: './arqueo-caja-new.component.html',
  styleUrls: ['./arqueo-caja-new.component.scss']
})
export class ArqueoCajaNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  cashRegisters: CashRegister[];
  newArqueo: ArqueoCaja;
  errorMsg: string;
  errorTitle: string;
  errorDateArqueoCurrentDateMsg = "La fecha de apertura del arqueo es mayor a la fecha actual";
  errorDateLastArqueoMsg = "La fecha de apertura del arqueo es menor a la fecha de cierre de un arqueo posterior de la misma caja";
  errorArqueoOpen = "Ya existe un arqueo de caja abierto";
  serviceErrorTitle: string = 'Error de Servicio';
  pageTitle: String = 'Nuevo Arqueo de Caja';
  hasCashRegister = true;
  showMessageCashRegister = false;
  lengthCashRegister: Boolean;
  dateCreated_at: Date;
  hourCreated_at: Date;
  arqueoOpen: ArqueoCaja;
  errorArqueo: Boolean = false;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _arqueoService: ArqueoCajaService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.newArqueo = new ArqueoCaja();
    this.newArqueo.cashRegisterId = "default";  
    this.errorArqueo = false;  
    
    this._route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters'];
      }
    ) 
    
    if (this.cashRegisters.length != 0)
    {
      if (this.cashRegisters.length > 1) {
        this.lengthCashRegister = true;        
      } else {
        this.newArqueo.cashRegisterId = this.cashRegisters[0]._id;
        this.lengthCashRegister = false;
        this.hasCashRegister = false;
      }
    } else {
      this.lengthCashRegister = false
      this.hasCashRegister = false;
    }        
  }

  saveArqueo(){    
    console.log('save')
    let stringDate = this.dateCreated_at.toString().concat(' ').concat(this.hourCreated_at.toString());
    let dateCreatedAt = new Date(stringDate);
    this.newArqueo.createdAt = dateCreatedAt;
    this._arqueoService.getCashMovementsByDate(this.newArqueo.cashRegisterId, dateCreatedAt).subscribe(
      data => {
        data.ingresos.forEach(ingreso => {
          this.newArqueo.ingresos.push(ingreso);
        });
        data.egresos.forEach(egreso => {
          this.newArqueo.egresos.push(egreso);
        });
        this._arqueoService.saveArqueo(this.newArqueo).subscribe(
          arqueo =>
          { 
            this.newArqueo = arqueo,
            this.onBack()
          },
          error => 
          { 
            this.showModalError(<any>error);
          }
        );
      },
      error => {
        this.showModalError(<any>error);
      }
    )                                                                             
  }

  validate() {
    this.errorArqueo = false;

    this._arqueoService.getArqueoOpenByCashRegister(this.newArqueo.cashRegisterId)
      .subscribe(arqueo => {        
        if (!isNullOrUndefined(arqueo))
        {
          this.errorArqueo = true;
          this.errorMsg = this.errorArqueoOpen;
        } else {          
          let stringDate = this.dateCreated_at.toString().concat(' ').concat(this.hourCreated_at.toString());
          let dateCreatedAt = new Date(stringDate);
          let currentDate = new Date();

          if (dateCreatedAt > currentDate) {  
            this.errorArqueo = true;
            this.errorMsg = this.errorDateArqueoCurrentDateMsg;
          } else {
            this._arqueoService.getLastArqueoByCashRegister(this.newArqueo.cashRegisterId)
              .subscribe(lastArqueo => {
                if (!isNullOrUndefined(lastArqueo)) {
                  console.log("c")
                  let stringDate = this.dateCreated_at.toString().concat(' ').concat(this.hourCreated_at.toString());
                  let dateCreatedAt = new Date(stringDate);
                  let lastDate = new Date(lastArqueo.closedAt)

                  if (dateCreatedAt < lastDate) {
                    this.errorArqueo = true;
                    this.errorMsg = this.errorDateLastArqueoMsg;
                  } else {
                    this.saveArqueo();
                  }
                } else {
                  this.saveArqueo();
                }            
              },
              error => {                
                this.showModalError(<any>error);
              }
            );
          }
        }             
      },
      error => {
        this.showModalError(<any>error);
      }
    );
  }

  showModalError(errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = this.serviceErrorTitle;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  onBack(): void {
    this.errorArqueo = false;
    this._router.navigate(['/sales/cash-counts', { outlets: { edit: ['selectItem'] } }]);
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

}
