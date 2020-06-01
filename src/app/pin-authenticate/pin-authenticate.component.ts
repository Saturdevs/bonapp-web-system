import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, TemplateRef, Input } from '@angular/core';
import { UserService, OrderService, OrderTypes, TableService, Table, TableStatus, RightsFunctions, User } from '../../shared';
import { NOT_FOUND } from 'http-status-codes';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-pin-authenticate',
  templateUrl: './pin-authenticate.component.html',
  styleUrls: ['./pin-authenticate.component.scss']
})
export class PinAuthenticateComponent implements OnInit, AfterViewInit {

  @ViewChild('inputPin', {static: false}) inputPinElement: ElementRef;
  @ViewChild('errorTemplate', {static: false}) errorTemplate: TemplateRef<any>;
  @Output() close = new EventEmitter<string>();
  @Input() tableNumber: number;
  private serviceErrorTitle: string;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private selectedTable: Table;
  public userPin: String;
  public modalRef: BsModalRef;
  public errorPin: Boolean = false;
  public errorMsg: string;

  constructor(
    private _router: Router,
    private _transalateService: TranslateService,
    private _userService: UserService,
    private _orderService: OrderService,
    private _tableService: TableService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this._transalateService.get('Commons.serviceErrorTitle').subscribe((translation: string) => {
      this.serviceErrorTitle = translation;
    })

    this.errorPin = false;
  }

  ngAfterViewInit() {
    this.inputPinElement.nativeElement.focus();
  }

  userPinAuthenticate() {
    if (!this.userPin) {
      this.userPin = undefined;
      this.errorPin = true;
      this._transalateService.get('Commons.errorEmptyPin').subscribe((translation: string) => {
        this.errorMsg = translation;
      })
    } else {
      this._userService.authenticateByPin(this.userPin).subscribe(
        usr => {
          this.closeModal();
          this._tableService.getTableByNumber(this.tableNumber).subscribe(
            table => {
              this.selectedTable = table;
              this._orderService.getOrderOpenByTable(this.tableNumber).subscribe(
                order => {
                  if (isNullOrUndefined(order) && this.selectedTable.status === TableStatus.LIBRE) {
                    this.openNewOrder(usr)
                  }
                  else {
                    this.openExistingOrder(usr);
                  }
                },
                error => {
                  this.showModalError(this.serviceErrorTitle, error.error.message);
                }
              )
            },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          )
        },
        error => {
          if (error.status === NOT_FOUND) {
            this.errorPin = true;
            this.errorMsg = error.error.message;
          } else {
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        }
      )
    }
  }

  openNewOrder(user: User) {
    const order = this._orderService.createOrder(this.tableNumber, OrderTypes.RESTAURANT);
    this._orderService.saveOrder(order).subscribe(
      () => {
        this.openExistingOrder(user);
      }
    )
  }

  openExistingOrder(user: User) {
    this._orderService.employeeWhoAddedId = user._id;
    this._router.navigate(['./orders/orderNew', this.tableNumber]);
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  closeModal() {
    this.close.emit('');
    return true;
  }
}
