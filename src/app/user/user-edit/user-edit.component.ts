import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User, UserService, UserRole } from '../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserEditPinComponent } from '../user-edit-pin/user-edit-pin.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @ViewChild('errorTemplate', {static: false}) errorTemplate: TemplateRef<any>;
  @ViewChild('editPin', {static: false}) editPin: UserEditPinComponent;
  private serviceErrorTitle: string;
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
  pinNotMatch: Boolean;
  showPinControls: Boolean = false;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _transalateService: TranslateService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.pinNotMatch = false;
    this._transalateService.get('Commons.serviceErrorTitle').subscribe((translation: string) => {
      this.serviceErrorTitle = translation;
    })

    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      roleId: ['', Validators.required],
      isGeneral: ['']
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
    if (this.user.isGeneral) {
      this.user.pin = null;
    }    
    let userUpdate = Object.assign({}, this.user, this.userForm.value);
    this._userService.updateUser(userUpdate).subscribe(
      user => {
        this.user = user;
        this.onBack();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message)
      }
    );
  }

  onUserRetrieved(user: User): void {
    this.user = user;
    this.userNameModified = this.user.username;
    this.userForm.patchValue({
      name: this.user.name,
      lastname: this.user.lastname,
      username: this.user.username,
      roleId: this.user.roleId,
      isGeneral: this.user.isGeneral
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

  clickIsGeneral() {
    this.user.isGeneral = this.userForm.get('isGeneral').value;    
    this.editPin.addPinControls(this.user.isGeneral);    
  }

  handlePinMatch(event) {
    this.pinNotMatch = !event;
  }
}
