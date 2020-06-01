import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product, Category, ProductService } from '../../../shared';
import { MdbTablePaginationComponent, MdbTableDirective } from 'ng-uikit-pro-standard';
import { ActivatedRoute } from '@angular/router';
import { DailyMenu } from '../../../shared/models/dailyMenu';
import { DailyMenuService } from '../../../shared/services/daily-menu.service';

@Component({
  selector: 'app-daily-menu-list',
  templateUrl: './daily-menu-list.component.html',
  styleUrls: ['./daily-menu-list.component.scss']
})
export class DailyMenuListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = 'Menu del dia';
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
  filteredDailyMenus: DailyMenu[];
  dailyMenus: DailyMenu[];
  _listFilter: string;
  _listFilterCod: string;
  _percentage: number;
  idProductDelete: any;
  categoriesOptions: Array<any> = [];
  selectedValue: string = '';
  previous: any;
  today = new Date();


  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective

  get listFilter(): string {
      return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredDailyMenus = this.listFilter ? this.performFilter(this.listFilter) : this.dailyMenus;
  }
  constructor(private dailyMenuService: DailyMenuService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.today.setHours(23,59,59,999);
    this.dailyMenus = this.route.snapshot.data['dailyMenus'];
    
    this.dailyMenus.forEach(dailyMenu => {
      dailyMenu.startDate = new Date(dailyMenu.startDate);
      dailyMenu.endDate = new Date(dailyMenu.endDate);
    });

    this.filteredDailyMenus = this.dailyMenus;    

    this.mdbTable.setDataSource(this.filteredDailyMenus);
    this.filteredDailyMenus = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  updateDates(dailyMenu){
    this.dailyMenuService.updateDates(dailyMenu)
      .subscribe(updatedDailyMenu => {
        this.getDailyMenus()
      })
  }

  performFilter(filterBy: string): DailyMenu[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.dailyMenus.filter((dailyMenu: DailyMenu) =>
           dailyMenu.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getDailyMenus(): void {
    this.dailyMenuService.getAll()
      .subscribe(dailyMenus => {
        this.dailyMenus = dailyMenus;
        this.filteredDailyMenus = this.dailyMenus;
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

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }
}