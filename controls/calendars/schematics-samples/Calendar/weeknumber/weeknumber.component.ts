/**
 * Calendar Week number Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-week-number',
    templateUrl: 'weeknumber.component.html',
    styleUrls: ['weeknumber.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class WeeknumberComponent {
    public weeknumber: boolean = true;
    onValueChange(args: any):void {
        /*Displays selected date in the label*/
        (<HTMLInputElement>document.getElementById('selectedweek')).textContent = 'Selected Value: ' + args.value.toLocaleDateString();
    }
}