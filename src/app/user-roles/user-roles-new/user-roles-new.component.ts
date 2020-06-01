import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserRole, UserRoleService } from '../../../shared';

@Component({
  selector: 'app-user-roles-new',
  templateUrl: './user-roles-new.component.html',
  styleUrls: ['./user-roles-new.component.scss']
})
export class UserRolesNewComponent implements OnInit {

  @ViewChild('errorTemplate', {static: false}) errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  userRole: UserRole = new UserRole();
  userRoleForm: FormGroup;
  pageTitle: String = 'Nuevo Rol de Usuario';
  private saveButton: String = 'Guardar';
  private cancelButton: String = 'Cancelar';
  private checkboxIsWaiterText: String = 'Es mozo?';

  constructor(
    private _router: Router,
    private _userRoleService: UserRoleService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userRoleForm = this.formBuilder.group({
      name: ['', Validators.required],
      isWaiter: false
    });
  }

  saveUserRole() {
    if (this.userRoleForm.dirty && this.userRoleForm.valid) {
      let userRole = Object.assign({}, this.userRoleForm.value);

      this._userRoleService.saveUserRole(userRole)
        .subscribe(
          userRole => {
            this.onBack();
          },
          (error: any) => {
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        );
    }
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

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onBack() {
    this._router.navigate(['/settings/general-settings/roles-users', { outlets: { edit: ['selectItem'] } }])
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

}
