import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ParamService, User, Params, Constants } from '../../../shared';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-user-edit-pin',
  templateUrl: './user-edit-pin.component.html',
  styleUrls: ['./user-edit-pin.component.scss']
})
export class UserEditPinComponent implements OnInit {

  @Input() user: User;
  @Output() handlePinMatch = new EventEmitter<Boolean>();
  pinForm: FormGroup;
  showPinControls: Boolean = true;
  enterPin: Boolean = false;
  pinNotMatch: Boolean = false;

  constructor(
    private _paramService: ParamService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.pinForm = this.formBuilder.group({
      pin: ['', Validators.required],
      pinConfirm: ['', Validators.required]
    });

    this.addPinControls(this.user.isGeneral);
  }

  addPinControls(isGeneral) {
    this.showPinControls = false;
    if (!isNullOrUndefined(this._paramService.params) && this._paramService.params.length > 0) {
      const askPinParam = this._paramService.params.find(param => param._id === Params.ASK_FOR_USER_PIN);
      if (!isNullOrUndefined(askPinParam) && askPinParam.value) {
        if (isGeneral) {
          this.enterPin = false;
          this.pinForm.removeControl(Constants.PIN);
          this.pinForm.removeControl(Constants.PIN_CONFIRM);
          this.handlePinMatch.emit(true);
        } else {
          this.showPinControls = true;
          if (this.user.pin !== null && this.user.pin !== undefined) {
            this.handlePinMatch.emit(true);
          } else {
            this.handlePinMatch.emit(false);
          }        
          this.pinForm.addControl(Constants.PIN, this.formBuilder.control(
            '', [Validators.required]
          ))

          this.pinForm.addControl(Constants.PIN_CONFIRM, this.formBuilder.control(
            '', [Validators.required]
          ))
        }
      }
    }
  }

  enterPinControls() {
    this.handlePinMatch.emit(false);
    this.enterPin = true;
  }

  checkPinMatch(): void {
    this.pinNotMatch = this.pinForm.controls.pin.value !== this.pinForm.controls.pinConfirm.value;

    if (!this.pinNotMatch && this.pinForm.valid) {
      this.user.pin = this.pinForm.controls.pin.value;
      this.handlePinMatch.emit(true);
    } else {
      this.handlePinMatch.emit(false);
    }
  }
}
