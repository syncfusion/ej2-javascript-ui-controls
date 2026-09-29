/**
 * DatePicker views Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'views',
    templateUrl: 'views.component.html',
    styleUrls: ['views.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ViewsComponent {
    public start: string = "Decade";
    public depth: string = "Year";
    public placeholder: string ="Select a date";
}