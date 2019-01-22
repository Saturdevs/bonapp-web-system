import { Component, OnInit, TemplateRef, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { SizeService } from '../../../shared/services/size.service';
import { Size } from '../../../shared/models/size';

@Component({
  selector: 'app-size-list',
  templateUrl: './size-list.component.html',
  styleUrls: ['./size-list.component.scss']
})
export class SizeListComponent implements OnInit, OnChanges {
  pageTitle: string = "Tamaños";
  public modalRef: BsModalRef;
  sizes: Size[];
  errorMessage: string;
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
        this.sizes = data['sizes'].map(size => {
          if(size.available) {
            size.available = 'Si';
          } else {
            size.available = 'No';
          }

          return size;
        })
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
        this.sizes = sizes.map(size => {
          if(size.available) {
            size.available = 'Si';
          } else {
            size.available = 'No';
          }

          return size;
        });
        this.filteredSizes = this.sizes;
      },
      error => this.errorMessage = <any>error);
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
      });
    }
  }

  reloadItems(event) {
    this.getSizes();
  }

}
