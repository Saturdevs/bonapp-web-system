import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../shared';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  /**Labels and strings */
  private pageTitle: string = "Detalle";

  order: Order;

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.order = this._route.snapshot.data['order'];
      }
    )
  }

}
