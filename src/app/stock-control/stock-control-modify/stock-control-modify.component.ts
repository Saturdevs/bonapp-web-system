import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Product, ProductService } from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-stock-control-modify',
  templateUrl: './stock-control-modify.component.html',
  styleUrls: ['./stock-control-modify.component.scss']
})
export class StockControlModifyComponent implements OnInit {
  productNameModified: string;
  product: Product;
  stockControlText = "Controla Stock";
  pageTitle = "Modificando stock para: ";
  cancelButton = "Cancelar";
  saveButton = "Guardar";
  stockControl: Boolean = false;
  minStock: number = 0;
  currentStock: number = 0;

  @ViewChild('errorTemplate', {static: false}) errorTemplate: TemplateRef<any>;

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;


  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private modalService: BsModalService,
    private productService: ProductService) { }

  ngOnInit() {
    this.product = this._route.snapshot.data['product'];
    this.productNameModified = this.product.name;
    this.stockControl = this.product.stockControl;
    this.minStock = this.product.stock.min;
    this.currentStock = this.product.stock.current;
  }

  onBack(): void {
    this._router.navigate(['/restaurant/stockControl']);
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: false });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  updateStock() {
    this.product.stockControl = this.stockControl;
    this.product.stock.min = this.minStock;
    this.product.stock.current = this.currentStock;

    this.productService.updateProduct(this.product)
      .subscribe(product => {
        this.product = product;
        this.onBack(); 
      })
  }

}
