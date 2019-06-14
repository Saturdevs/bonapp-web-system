import { Component, OnInit, DoCheck } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-error-template',
  templateUrl: './error-template.component.html',
  styleUrls: ['./error-template.component.scss']
})
export class ErrorTemplateComponent implements OnInit, DoCheck {

  errorTitle: string;
  errorMessage: string;  
  errorMessageDefault: string = 'Ocurrió un problema con la conexión a la base de datos. \n\rIntenté de nuevo, si el problema persiste comuniquese con Soporte de BonAPP.'
  buttonOk: string = 'Ok';  

  constructor(private modalRef: BsModalRef) { }

  ngOnInit() {}

  ngDoCheck() {
    if (isNullOrUndefined(this.errorMessage)) {      
      this.errorMessage = this.errorMessageDefault;
    }
  }

  closeModal(){   
    this.modalRef.hide()
  }

}
