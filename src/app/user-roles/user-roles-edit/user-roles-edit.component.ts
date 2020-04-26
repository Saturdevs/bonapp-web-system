import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CONFLICT } from 'http-status-codes';

import {
  UserRoleService,
  UserRole,
  IRight,
  IUserRoleDTO
} from '../../../shared/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-roles-edit',
  templateUrl: './user-roles-edit.component.html',
  styleUrls: ['./user-roles-edit.component.scss']
})
export class UserRolesEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle: string;
  public modalRef: BsModalRef;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private rightsToEnable: Array<IRight>;
  private rightsToDisable: Array<IRight>;
  userRole: UserRole;
  userRoleNameModified: String;
  userRoleForm: FormGroup;
  errorUserRole: Boolean = false;
  errorMsg: string;  

  get rightsByMenuArray(): FormArray {
    return <FormArray>this.userRoleForm.get('rightsByMenu');
  }

  get rightsArray(): FormArray {
    return <FormArray>this.rightsByMenuArray.get('rights');
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _transalateService: TranslateService,
    private _userRoleService: UserRoleService
  ) { }

  ngOnInit() {
    this.rightsToEnable = [];
    this.rightsToDisable = [];

    this._transalateService.get('Commons.serviceErrorTitle').subscribe((translation: string) => {
      this.serviceErrorTitle = translation;
    })

    this.userRoleForm = this.formBuilder.group({
      name: ['', Validators.required],
      isWaiter: '',
      rightsByMenu: this.formBuilder.array([
        this.formBuilder.group({
          name: '',
          rights: this.formBuilder.array([])
        })
      ])
    });

    this._route.data.subscribe(
      data => {
        this.userRole = data['userRole'];
        this.onUserRoleRetrieved();
      }
    )
  }

  onUserRoleRetrieved(): void {
    this.errorUserRole = false;
    this.errorMsg = '';
    this.userRoleNameModified = this.userRole.name;
    this.userRoleForm.patchValue({
      name: this.userRole.name,
      isWaiter: this.userRole.isWaiter
    });

    const rightsByMenu = this.userRole.rightsByMenu.map(menu => this.formBuilder.group({
      name: menu.menuId,
      rights: this.mapToRights(menu.rights)
    }));
    const rightsByMenuArray = this.formBuilder.array(rightsByMenu);
    this.userRoleForm.setControl('rightsByMenu', rightsByMenuArray);
  }

  mapToRights(rights): FormArray {
    return this.formBuilder.array(rights.map((right) => {
      return this.formBuilder.group({
        _id: right._id,
        active: right.active
      });
    }));
  }

  /**
   * @description Busca el permiso dado como parametro dentro de los permisos del usuario para determinar
   * si el mismo debe ser actualizado o no. Si la propiedad active es igual devuelve false, sino true.
   * @param right permiso que se quiere determinar si se debe actualizar o no.
   */
  rightShouldBeUpdated(right: IRight): Boolean {
    for (let i = 0; i < this.userRole.rightsByMenu.length; i++) {
      const menu = this.userRole.rightsByMenu[i];
      
      for (let j = 0; j < menu.rights.length; j++) {
        const userRight = menu.rights[j];
        
        if (userRight._id === right._id) {
          return userRight.active !== right.active;
        }
      }
    }
    
    return true;
  }

  changeRight(changeRight): void {
    let rightFoundIndex: number;
    let right: IRight = {
      _id: changeRight.get('_id').value,
      active: changeRight.get('active').value
    };

    if (!right.active) {
      rightFoundIndex = this.rightsToEnable.findIndex(r => r._id === right._id);
      if (rightFoundIndex !== -1) {
        this.rightsToEnable.splice(rightFoundIndex, 1);
      }
      if (this.rightShouldBeUpdated(right)) {
        this.rightsToDisable.push(right);
      }
    } else {
      rightFoundIndex = this.rightsToDisable.findIndex(r => r._id === right._id);
      if (rightFoundIndex !== -1) {
        this.rightsToDisable.splice(rightFoundIndex, 1);
      }
      if (this.rightShouldBeUpdated(right)) {
        this.rightsToEnable.push(right);
      }
    }
  }

  updateUserRole(): void {
    const userRole = Object.assign({}, this.userRole, this.userRoleForm.value);    
    const userRoleDTO: IUserRoleDTO = {
      _id: userRole._id,
      isWaiter: userRole.isWaiter,
      name: userRole.name,
      rights: new Array()
    };    
    const data = {
      userRole: userRoleDTO,
      rightsToEnable: this.rightsToEnable,
      rightsToDisable: this.rightsToDisable
    }
    
    this._userRoleService.updateUserRole(data).subscribe(
      userRole => {
        this.onBack();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
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
    this._router.navigate(['/settings/general-settings//roles-users', { outlets: { edit: ['selectItem'] } }]);
  }

}
