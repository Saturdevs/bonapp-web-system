import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, Table } from '../../shared';
import { QrGeneratorService } from '../../shared/services/qr-generator.service';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss']
})
export class QrGeneratorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    private _authenticationService: AuthenticationService,
    private qrGeneratorService: QrGeneratorService) { }

  pageTitle: string = "Generar QR";
  tables: Array<Table>;
  tablesToGenerateQR: Array<Table> = [];
  tablesText = "Mesas: "
  confirmationTitle = "QRs generados exitosamente";
  buttonOk = "OK!";
  confirmationPath = '';
  confirmationText = 'Podes encontrarlos en ';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  private validationMessage: string;

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;

  ngOnInit() {
    this.route.data.subscribe(
      data => {     
        this.tables = data['tables'];
      }
    )
  }

  addToGenerator(table: Table){
    if(this.tablesToGenerateQR.includes(table)){
      this.tablesToGenerateQR.splice(this.tablesToGenerateQR.indexOf(table),1);
      
    }else{ 
      this.tablesToGenerateQR.push(table);
    }
  }

  generateQR(){
    this.tablesToGenerateQR.forEach(table => {
      let data = {
        tableNumber: table.number,
        restaurantId: "lorenEsMedioGato"
      };
      this.qrGeneratorService.generateQR(data)
        .subscribe(result => {
          if(this.confirmationPath === ''){
            this.confirmationPath = result.path;
          }
        });
    });
    this.modalRef = this.modalService.show(this.confirmationTemplate, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

}
