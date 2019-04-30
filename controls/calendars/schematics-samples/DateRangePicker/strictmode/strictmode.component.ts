/**
 * DateRangePicker strict mode Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-strict-mode',
    templateUrl: 'strictmode.component.html',
    styleUrls: ['strictmode.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class StrictmodeComponent {
    public strictMode: boolean = true;
    public startDate: Object =  new Date('5/28/2017');
    public endDate: Object =  new Date('5/28/2017');
    public min: Object = new Date('5/5/2017',);
    public max: Object = new Date('5/10/2017');
    public placeholder: string = "Select a range";
}