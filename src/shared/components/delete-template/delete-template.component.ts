import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-template',
  templateUrl: './delete-template.component.html',
  styleUrls: ['./delete-template.component.scss']
})
export class DeleteTemplateComponent implements OnInit {

  @Input() modalTitle: string;
  @Input() modalMessage: string;    
  @Output() delete = new EventEmitter<string>();  
  @Output() close = new EventEmitter<string>();  
  okButton: string; 
  cancelButton: string;

  constructor(
    private _transalateService: TranslateService
  ) { }

  ngOnInit() {
    this._transalateService.stream(['Commons.Buttons.ok', 'Commons.Buttons.cancel']).subscribe((translations) => {    
      this.okButton = translations['Commons.Buttons.ok'];
      this.cancelButton = translations['Commons.Buttons.cancel'];
    })
  }

  deleteItem(){
    this.delete.emit('');    
  }

  closeModal(){   
    this.close.emit('');  
  }

}
