import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CONFLICT } from 'http-status-codes';

import {
  UserRole,
  UserRoleService,
  User,
  AuthenticationService,
  RightsFunctions,
  Rights
} from '../../../shared/index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-roles-list',
  templateUrl: './user-roles-list.component.html',
  styleUrls: ['./user-roles-list.component.scss']
})
export class UserRolesListComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle: string;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  validationMessage: string;
  public modalRef: BsModalRef;
  userRoles: UserRole[];
  idUserRoleDelete: String;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  constructor(
    private _userRoleService: UserRoleService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _authenticationService: AuthenticationService,
    private _transalateService: TranslateService
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
        this.userRoles = data['userRoles'];
      }
    )

    this._transalateService.get('Commons.serviceErrorTitle').subscribe((translation: string) => {
      this.serviceErrorTitle = translation;
    })
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_USER_ROLE);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_USER_ROLE);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_USER_ROLE);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }

  getUserRoles(): void {
    this._userRoleService.getAll()
      .subscribe(userRoles => {
        this.userRoles = userRoles;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message)
        });
  }

  deleteUserRole() {
    if (this.closeModal()) {
      this._userRoleService.deleteUserRole(this.idUserRoleDelete).subscribe(success => {
        this.reloadItems();
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

  showModalDelete(template: TemplateRef<any>, idUserRole: String) {
    this._transalateService.stream(['UserRoles.modalDeleteTitle', 'UserRoles.modalDeleteMessage']).subscribe((translations) => {      
      this.modalDeleteTitle = translations['UserRoles.modalDeleteTitle'];
      this.modalDeleteMessage = translations['UserRoles.modalDeleteMessage'];
    })

    this.idUserRoleDelete = idUserRole;
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  reloadItems() {
    this.validationMessage = "";
    this.getUserRoles();
  }

}
