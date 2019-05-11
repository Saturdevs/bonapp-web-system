import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Section } from '../../../shared/models/section';

import { SectionService } from '../../../shared/services/section.service';

import { SectionNewComponent } from '../section-new/section-new.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})
export class SectionListComponent implements OnInit, AfterViewInit {

  @ViewChild(SectionNewComponent)
  private newSection: SectionNewComponent;

  private sections: Array<Section>;
  settingsActive: Boolean;
  ordersActive: Boolean;
  title: string;
  
  constructor(private _sectionService: SectionService,
              private _route: ActivatedRoute,
              private _router: Router ) { }

  ngOnInit() {
   // this.sections = this._route.snapshot.data['sections'];
    this._route.data.subscribe(
    data => { 
      this.sections = data['sections']; 
    });
   
    if(this.isSettingsActive()) {
      this.title = "Configuración de secciones y mesas";
			this.settingsActive = true;
		}
		
		if(this.isOrdersActive()) {
      this.title = "Nuevo Pedido"
			this.ordersActive = true;
		}    
  }
  
  ngAfterViewInit(): void {
    if (!isNullOrUndefined(document.getElementById("tab0").click()))
    {
      document.getElementById("tab0").click();
    }
  }

  isSettingsActive() {
		return this._router.isActive('/settings/section', true);
	}

	isOrdersActive() {
		return this._router.isActive('/orders/section', true);
  }
  
  reloadSections(closed: Boolean){
    if (closed === true){
      this._sectionService.getAll()
        .subscribe(
          data => {
            this.sections = data;
          });
      }
  }
}
