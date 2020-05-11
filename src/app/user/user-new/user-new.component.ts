import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User, UserService, UserRole, ParamService, Constants, Params } from '../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;

  private serviceErrorTitle: string;
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  user: User = new User();
  userForm: FormGroup;
  userRolesSelect: Array<any> = [];
  userRoles: Array<UserRole>;
  selectedValue: string;
  pinNotMatch: Boolean = false;
  showPinControls: Boolean = false;

  constructor(private _router: Router,
    private _userService: UserService,
    private _paramService: ParamService,
    private _transalateService: TranslateService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
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

    this.addPinControls();

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
    this.userForm.get('isGeneral').value;
    if (this.userForm.get('isGeneral').value) {
      this.showPinControls = false;      
      this.pinNotMatch = false;
      this.userForm.removeControl(Constants.PIN);
      this.userForm.removeControl(Constants.PIN_CONFIRM);
      this.userForm.patchValue({
        pin: null
      })
    } else {
      this.addPinControls();
    }
  }

  userPinNotMatch(): Boolean {
    this.pinNotMatch = this.userForm.controls.pin.value !== this.userForm.controls.pinConfirm.value;
    return this.pinNotMatch;
  }

  addPinControls() {
    if (!isNullOrUndefined(this._paramService.params) && this._paramService.params.length > 0) {
      const askPinParam = this._paramService.params.find(param => param._id === Params.ASK_FOR_USER_PIN);
      if (!isNullOrUndefined(askPinParam) && askPinParam.value) {
        this.showPinControls = true;
        this.userForm.addControl(Constants.PIN, this.formBuilder.control(
          '', [Validators.required]
        ))

        this.userForm.addControl(Constants.PIN_CONFIRM, this.formBuilder.control(
          '', [Validators.required]
        ))        
      }
    }
  }
}
