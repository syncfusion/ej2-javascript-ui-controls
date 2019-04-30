/**
 * DateTimePicker views Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'views',
    templateUrl: 'views.component.html',
    styleUrls: ['views.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ViewsComponent {
    public placeholder: string ="Select a date and time";
    public start: string = "Decade";
    public depth: string = "Year";
}