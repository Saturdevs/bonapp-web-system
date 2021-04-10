import { Injectable } from '@angular/core';
import { BusinessUnit } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {
  
  private _currentBusinessUnit: BusinessUnit;

  constructor(
    private apiService: ApiService
  ) { }

  public get currentBusinessUnit(): BusinessUnit {
    return this._currentBusinessUnit;
  }

  public set currentBusinessUnit(businessUnit: BusinessUnit) {
    this._currentBusinessUnit = businessUnit;
  }
}
