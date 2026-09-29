/**
 * DateRangePicker disabled dates Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-disabled-dates',
    templateUrl: 'disableddates.component.html',
    styleUrls: ['disableddates.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DisableddatesComponent {
    public placeholder: string = "Select a range";
    onLoad(args: any) {
        /*Date need to be disabled*/
        if (args.date.getDay() === 0 || args.date.getDay() === 6) {
          args.isDisabled = true;
        }
      }
}