/**
 * TimePicker date range Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-time-range',
    templateUrl: 'timerange.component.html',
    styleUrls: ['timerange.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class TimerangeComponent {
    public min: Object = new Date('3/8/2017 9:00 AM');
    public max: Object = new Date('3/8/2017 11:30 AM');
    public value: Object = new Date('3/8/2017 11:00 AM');
    public placeholder: string = "Select a time";
}