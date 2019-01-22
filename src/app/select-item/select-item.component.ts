import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss']
})
export class SelectItemComponent implements OnInit {

  text: string = 'Seleccione un item de la lista';

  constructor() { }

  ngOnInit() {
  }

}
