import { Component, OnInit, DoCheck, Input, Output, EventEmitter } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-error-template',
  templateUrl: './error-template.component.html',
  styleUrls: ['./error-template.component.scss']
})
export class ErrorTemplateComponent implements OnInit, DoCheck {

  @Input() errorTitle: string;
  @Input() errorMessage: string;  
  @Output() close = new EventEmitter<string>();  
  errorMessageDefault: string = 'Ocurrió un problema con la conexión a la base de datos. \n\rIntenté de nuevo, si el problema persiste comuniquese con Soporte de BonAPP.'
  buttonOk: string = 'Ok';  

  constructor() { }

  ngOnInit() {}

  ngDoCheck() {
    if (isNullOrUndefined(this.errorMessage)) {      
      this.errorMessage = this.errorMessageDefault;
    }
  }

  closeModal(){   
    this.close.emit('');
  }

}
