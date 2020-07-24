import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, Table, OrderTypes } from '../../shared';
import { QrGeneratorService } from '../../shared/services/qr-generator.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss']
})
export class QrGeneratorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    private _authenticationService: AuthenticationService,
    private qrGeneratorService: QrGeneratorService,
    private settingsService: SettingsService) { }

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
  validationMessage: string;

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
      this.settingsService.getAll()
        .subscribe(settings => {
          let data = {
            tableNumber: table.number,
            restaurantId: settings[0].restaurantId,
            orderType: OrderTypes.RESTAURANT
          };
          this.qrGeneratorService.generateQR(data)
            .subscribe(result => {
              console.log(result);
              
              let fileName = "Mesa"+table.number+"QR";
              this.download(fileName,result.data)

              if(this.confirmationPath === ''){
                this.confirmationPath = result.path;
              }
            });
        });
    });
    this.modalRef = this.modalService.show(this.confirmationTemplate, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

    download(filename: string, qrBase64: string) {

      let element = document.createElement('a');
      element.setAttribute('href', qrBase64);
      element.setAttribute('download', filename);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }

}
