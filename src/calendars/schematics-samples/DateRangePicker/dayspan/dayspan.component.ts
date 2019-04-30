/**
 * DateRangePicker day span Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-day-span',
    templateUrl: 'dayspan.component.html',
    styleUrls: ['dayspan.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DayspanComponent {
    public minDays: number = 5;
    public maxDays: number = 10;
    public placeholder: string = "Select a range";
}