import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User, UserService, UserRole } from '../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  user: User = new User();
  userForm: FormGroup;
  pageTitle: String = 'Nuevo Usuario';
  private saveButton: String = 'Guardar';
  private cancelButton: String = 'Cancelar';
  userRolesSelect: Array<any> = [];
  userRoles: Array<UserRole>;
  selectedValue: string;


  constructor(private _router: Router,
    private _userService: UserService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }

    ngOnInit() {
      this.userForm = this.formBuilder.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
        roleId: ['', Validators.required]
      });

      this.userRoles = this.route.snapshot.data['userRoles'];  
      this.buildUserRolesArray();
      
    }

    saveUser() {
      if (this.userForm.dirty && this.userForm.valid) {
        let user = Object.assign({}, this.userForm.value);
        this._userService.saveUser(user)
          .subscribe(
            user => {
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
  
    showModalCancel(template: TemplateRef<any>, idSize: any) {
      this.modalRef = this.modalService.show(template, { backdrop: true });
      this.modalCancelTitle = "Cancelar Cambios";
      this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
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

    passwordNotMatch(): boolean {
      return this.userForm.controls.password.value !== this.userForm.controls.passwordConfirm.value;
    }
}
