/**
 * Calendar Views Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-views',
    templateUrl: 'views.component.html',
    styleUrls: ['views.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ViewsComponent {
    public start: string = "Decade";
    public depth: string = "Year";
    onValueChange(args: any):void {
        /*Displays selected date in the label*/
        (<HTMLInputElement>document.getElementById('selectedviews')).textContent = 'Selected Value: ' + args.value.toLocaleDateString();
    }
}