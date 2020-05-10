import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QrGeneratorService {

  constructor(private apiService: ApiService) { }


  generateQR(data) {
    return this.apiService.post('/qrGenerator', data)
      .map(data => data.result)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }
}
