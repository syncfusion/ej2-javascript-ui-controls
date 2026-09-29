/**
 * DateRangePicker format Sample
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Calendar } from '@syncfusion/ej2-calendars';

@Component({
    selector: 'app-format',
    templateUrl: 'format.component.html',
    styleUrls: ['format.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class FormatComponent {
  public placeholder: string = "Select a range";
  public date: Object = new Date();
  public format: string = 'dd-MMM-yy';
  @ViewChild('daterange')
  public daterangeObj: Calendar;
  changeFormat() {
    let dateFormat: string = (document.getElementById('dateformats') as HTMLSelectElement).value;
    this.format = dateFormat;
    this.daterangeObj.dataBind();
  }
}