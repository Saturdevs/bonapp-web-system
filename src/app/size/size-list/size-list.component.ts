import { Component, OnInit, TemplateRef, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Size,
  SizeService
} from '../../../shared';

@Component({
  selector: 'app-size-list',
  templateUrl: './size-list.component.html',
  styleUrls: ['./size-list.component.scss']
})
export class SizeListComponent implements OnInit, OnChanges {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = "Tamaños";
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string = "Eliminar Tamaño";
  private modalDeleteMessage: string = "¿Estas seguro que desea eliminar este tamaño?";
  public modalRef: BsModalRef;
  sizes: Size[];
  filteredSizes: Size[];
  _listFilter: string;
  idSizeDelete: any;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredSizes = this.listFilter ? this.performFilter(this.listFilter) : this.sizes;
  }

  constructor(private sizeService: SizeService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
             ) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.sizes = data['sizes'];
      }
    )
    
    this.filteredSizes = this.sizes;
  }

  ngOnChanges() {
    this.getSizes();    
  }

  performFilter(filterBy: string): Size[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.sizes.filter((size: Size) =>
           size.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getSizes(): void {
    this.sizeService.getAll()
      .subscribe(sizes => {
        this.sizes = sizes;
        this.filteredSizes = this.sizes;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalDelete(template: TemplateRef<any>, idSize: any){
    this.idSizeDelete = idSize;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deleteSize(){
    if (this.closeModal()){
      this.sizeService.deleteSize(this.idSizeDelete).subscribe( success=> {
        this.getSizes();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
    }
  }

  reloadItems(event) {
    this.getSizes();
  }

}
