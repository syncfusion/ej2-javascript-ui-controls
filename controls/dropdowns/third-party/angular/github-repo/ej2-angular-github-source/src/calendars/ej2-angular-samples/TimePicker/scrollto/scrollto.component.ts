/**
 * TimePicker scrollto Sample
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { TimePicker } from '@syncfusion/ej2-calendars';

@Component({
    selector: 'app-scroll-to',
    templateUrl: 'scrollto.component.html',
    styleUrls: ['scrollto.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ScrolltoComponent {
    @ViewChild('timepicker')
    public timeObject: TimePicker;
    public value: Date = new Date();
    public placeholder: string = "Select a time";
    public onOpen(): void {
      // scrollTo value will be assigned only if the timepicker value is not null or undefined and is a valid value.
      if (this.timeObject.value && !isNaN(+this.timeObject.value)) {
        // assign the current value as the scrollTo value
        this.timeObject.scrollTo = this.timeObject.value;
      }
    }
}