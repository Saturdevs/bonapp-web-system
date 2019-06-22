import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-cancel-template',
  templateUrl: './cancel-template.component.html',
  styleUrls: ['./cancel-template.component.scss']
})
export class CancelTemplateComponent implements OnInit {

  @Input() modalTitle: string;
  @Input() modalMessage: string;    
  @Output() handleCancelButton = new EventEmitter<string>();  
  @Output() handleOkButton = new EventEmitter<string>();  
  okButton: string = 'Si'; 
  cancelButton: string = 'No';
  constructor() { }

  ngOnInit() {
  }

  handleOkButtonClick() {
    this.handleOkButton.emit('');    
  }

  handleCancelButtonClick() { 
    this.handleCancelButton.emit('');  
  }

}
