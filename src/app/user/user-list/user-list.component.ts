import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User, UserService, AuthenticationService, RightsFunctions, Rights } from '../../../shared';
import { ActivatedRoute } from '@angular/router';
import { CONFLICT } from 'http-status-codes';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @ViewChild('errorTemplate', {static: false}) errorTemplate: TemplateRef<any>;
  pageTitle: string = "Usuarios";
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string = "Eliminar Usuario";
  private modalDeleteMessage: string = "¿Estas seguro que desea eliminar el usuario?";
  private validationMessage: string;
  public modalRef: BsModalRef;
  users: Array<User>;
  filteredUsers: Array<User>;
  _listFilter: string;
  idUserDelete: any;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  constructor(private usersService: UserService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );
    
    this.route.data.subscribe(
      data => {
        this.users = data['users'];
      }
    )

    this.filteredUsers = this.users;
  }

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.users;
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_PAYMENT_TYPE);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_PAYMENT_TYPE);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_PAYMENT_TYPE);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }

  performFilter(filterBy: string): User[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((user: User) =>
      user.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getUsers(): void {
    this.usersService.getAll()
      .subscribe(users => {
        this.users = users;
        this.filteredUsers = this.users;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      )
  }

  showModalDelete(template: TemplateRef<any>, idUser: any) {
    this.idUserDelete = idUser;
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  deleteUser() {    
    if (this.closeModal()) {
      this.usersService.deleteUser(this.idUserDelete).subscribe(success => {
        this.getUsers();
      },
        error => {
          if (error.status === CONFLICT) {
            this.validationMessage = error.error.message;
          }
          else {
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        });
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  reloadItems(event) {
    this.getUsers();
  }

}
