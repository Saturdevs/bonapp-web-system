import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-close',
  templateUrl: './order-close.component.html',
  styleUrls: ['./order-close.component.scss']
})
export class OrderCloseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClick():void {
    console.log("close order");
  }

}
