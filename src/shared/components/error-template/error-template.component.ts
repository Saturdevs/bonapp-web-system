import { Component, OnInit, DoCheck, Input, Output, EventEmitter } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error-template',
  templateUrl: './error-template.component.html',
  styleUrls: ['./error-template.component.scss']
})
export class ErrorTemplateComponent implements OnInit, DoCheck {

  @Input() errorTitle: string;
  @Input() errorMessage: string;  
  @Output() close = new EventEmitter<string>();  
  errorMessageDefault: string;
  buttonOk: string;  

  constructor(
    private _transalateService: TranslateService
  ) { }

  ngOnInit() {
    this._transalateService.stream(['Commons.Buttons.ok', 'Commons.errorMessageDefault']).subscribe((translations) => {    
      this.buttonOk = translations['Commons.Buttons.ok'];
      this.errorMessageDefault = translations['Commons.errorMessageDefault'];
    })
  }

  ngDoCheck() {
    if (isNullOrUndefined(this.errorMessage)) {      
      this.errorMessage = this.errorMessageDefault;
    }
  }

  closeModal(){   
    this.close.emit('');
  }

}
