import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMyOptions, IMyDate } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  private currentDate: Date;
  private disabledSince : IMyDate;
  model: Date;
  @Input() dpName : string;
  @Input() dpPlaceHolder : string;
  @Output() onValueChanged = new EventEmitter<Date>();

  ngOnInit() {
    this.currentDate = new Date();
    this.disabledSince = {
      year: this.currentDate.getFullYear(),
      month: this.currentDate.getMonth(),
      day: this.currentDate.getDay()
    }
    this.model = this.currentDate;
  }

  onChange(newValue) {
    this.onValueChanged.emit(newValue);
  }

  public myDatePickerOptions: IMyOptions = {
    // Strings and translations
    dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'},
    dayLabelsFull: {su: "Domingo", mo: "Lunes", tu: "Martes", we: "Miércoles", th: "Jueves", fr: "Viernes", sa: "Sábado"},
    monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' },
    monthLabelsFull: { 1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre" },

    // Buttons
    todayBtnTxt: "Hoy",
    clearBtnTxt: "Limpiar",
    closeBtnTxt: "Cerrar",

    // Format
    dateFormat: 'dd/mm/yyyy',

    // First day of the week
    firstDayOfWeek: 'su',

    // Disable dates
    // disableUntil: undefined,
    //disableSince: this.disabledSince,
    // { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth(), day: this.currentDate.getDay() },
    // disableDays: undefined,
    // disableDateRanges: undefined,
    // disableWeekends: false,

    // Enable dates (when disabled)
    // enableDays: undefined,

  //   // Year limits
  //   minYear: 1000,
  //   maxYear: 9999,

  //   // Show Today button
  //   showTodayBtn: true,

  //   //Show Clear date button
  //   showClearDateBtn: true,

     markCurrentDay: true
  //   markDates: undefined,
  //   markWeekends: undefined,
  //   disableHeaderButtons: false,
  //   showWeekNumbers: false,
  //   height: '100px',
  //   width: '50%',
  //   selectionTxtFontSize: '15px'
  };

}
