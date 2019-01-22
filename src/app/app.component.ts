import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title: string = 'Web Bar';
  subtitle: string = 'by Los Pibes';
  myDate: Date;

  ngOnInit(){    
    this.getTime();
  }

  getTime() : void{
    this.myDate = new Date();
    setInterval(() => {    
      this.myDate = new Date();
    }, 1000);
  };

}
