import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User, UserService, UserRole } from '../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  private pageTitle: String = 'Editando';
  private cancelButton: String = 'Cancelar';
  private saveButton: String = 'Aceptar';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  user: User;
  userNameModified: String;
  userForm: FormGroup;
  userRoles: UserRole[];
  userRolesSelect: Array<any> = [];
  selectedValue: string;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      roleId: ['', Validators.required]
    });

    this._route.data.subscribe(
      data => {
        this.userRoles = data['userRoles'];
        this.user = data['user']; 
        this.onUserRetrieved(this.user);
      }
    );
    this.buildUserRolesArray();
  }

  updateUser() {
    let userUpdate = Object.assign({}, this.user, this.userForm.value);
    this._userService.updateUser(userUpdate).subscribe(
      user => {
        this.user = user;        
        this.onBack();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message)
      });
  }

  onUserRetrieved(user: User): void {
    this.user = user;
    this.userNameModified = this.user.name;
    this.userForm.patchValue({
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
      roleId: this.user.roleId,
    });
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

  showModalCancel(template: TemplateRef<any>, idSize: any) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }
  
  onBack() {
    this._router.navigate(['/settings/general-settings/users', { outlets: { edit: ['selectItem'] } }]);
  }

  buildUserRolesArray(): void {
    this.userRolesSelect.push({ value: 'default', label: 'Todos', selected: true });
    this.userRoles.map(userRole => {
      this.userRolesSelect.push({ value: userRole._id, label: userRole.name })
    });
    this.selectedValue = 'default';
  }

  selectUserRole(userRoleId){
    this.userForm.controls.roleId.setValue(userRoleId);
  }

}
