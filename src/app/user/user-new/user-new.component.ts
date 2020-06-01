import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User, UserService, UserRole, ParamService } from '../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserEditPinComponent } from '../user-edit-pin/user-edit-pin.component';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {

  @ViewChild('errorTemplate', {static: false}) errorTemplate: TemplateRef<any>;
  @ViewChild('editPin', {static: false}) editPin: UserEditPinComponent;
  private serviceErrorTitle: string;
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  user: User;
  userForm: FormGroup;
  userRolesSelect: Array<any> = [];
  userRoles: Array<UserRole>;
  selectedValue: string;
  pinNotMatch: Boolean;
  showPinControls: Boolean = false;

  constructor(private _router: Router,
    private _userService: UserService,
    private _transalateService: TranslateService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.user = new User();
    this._transalateService.get('Commons.serviceErrorTitle').subscribe((translation: string) => {
      this.serviceErrorTitle = translation;
    })

    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      roleId: ['', Validators.required],
      isGeneral: [false]
    });

    this.userRoles = this.route.snapshot.data['userRoles'];
    this.buildUserRolesArray();

  }

  saveUser() {
    if (this.userForm.dirty && this.userForm.valid) {
      let user = Object.assign({}, this.user, this.userForm.value);
      if (this.user.isGeneral) {
        this.user.pin = null;
      } 
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

  showModalCancel(template: TemplateRef<any>) {
    this._transalateService.stream(['Commons.modalCancelTitle', 'Commons.modalCancelMessage']).subscribe((translations) => {
      this.modalCancelTitle = translations['Commons.modalCancelTitle'];
      this.modalCancelMessage = translations['Commons.modalCancelMessage'];
      this.modalRef = this.modalService.show(template, { backdrop: true });
    })
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

  selectUserRole(userRoleId) {
    this.userForm.controls.roleId.setValue(userRoleId);
  }

  passwordNotMatch(): boolean {
    return this.userForm.controls.password.value !== this.userForm.controls.passwordConfirm.value;
  }

  clickIsGeneral() {
    this.user.isGeneral = this.userForm.get('isGeneral').value;    
    this.editPin.addPinControls(this.user.isGeneral);  
  }

  handlePinMatch(event) {
    this.pinNotMatch = !event;
  }
}
