import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

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
  okButton: string = 'Ok'; 
  cancelButton: string = 'Cancelar';

  constructor() { }

  ngOnInit() {
  }

  deleteItem(){
    this.delete.emit('');    
  }

  closeModal(){   
    this.close.emit('');  
  }

}
