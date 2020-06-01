import { Inject, Component, OnInit, ElementRef, NgModule, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { DOCUMENT } from "@angular/common";
//import {} from '@types/googlemaps';

import { Client } from '../../shared/models/client';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent {

  /* public dataClientService: CompleterData;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public deliveryOrderForm: FormGroup;
  public zoom: number;
  public tipo: Array<any>;
  public horario: Array<any>;
  public steps: number;
  public clients: Array<Client>;
  
  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private _route: ActivatedRoute,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private completerService: CompleterService,
              private formBuilder: FormBuilder) { 
              this.deliveryOrderForm = this.formBuilder.group({
                      telephone: ['', Validators.required],      
                      client: ['', Validators.required],
                      floor: [''],
                      flat: [''],
                      searchControl: ['', Validators.required]  
                });
                
                this.steps = 1;
                    this.tipo = [
                            { value: '1', label: 'Delivery' },
                            { value: '2', label: 'Retira en el Local' }
                        ];
                    this.horario = [
                        { value: '1', label: 'Lo antes posible' },
                        { value: '2', label: 'Entre las 18:00 y las 18:30' },
                        { value: '3', label: 'Entre las 18:30 y las 19:00' },
                        { value: '4', label: 'Entre las 19:00 y las 19:30' },
                        { value: '5', label: 'Entre las 19:30 y las 20:00' },
                    ];
                this._route.data.subscribe(
                  data => {
                      this.clients = data['clients'];
                      console.log(this.clients)
                      this.dataClientService = completerService.local(this.clients, 'tel', 'tel');
                  });
               }

   ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;  
    this.longitude = -98.5795;
    
    //set current position
    this.setCurrentPosition();
    
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-32.9442, -60.6505));
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        bounds: defaultBounds,
        types:["address"],
        componentRestrictions: { country: "ar"}
      });                                
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  thisStep(newStep){
      this.steps = newStep;
  }
  
  fowardStep(newStep){
      this.steps = newStep + 1;
  }

  backStep(newStep){
      this.steps = newStep - 1;
  }

  validateClient(telClient){
    let foundClient: Client;
    if(telClient){
      foundClient = this.clients.find(x => x.tel === telClient);
      if(foundClient){
        this.deliveryOrderForm.patchValue({ client: foundClient.name,
                                            floor: foundClient.addressNumber,
                                            flat: foundClient.addressDpto,
                                            searchControl: foundClient.addressStreet
                                          })
      } else {
        //aca va la modal para preguntar si se quiere dar de alta el cliente al finalizar el pedido
      }

    }


    
  } */
}
