/**
 * Calendar Multi selection Sample
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Calendar  } from '@syncfusion/ej2-calendars';


@Component({
    selector: 'app-multi-selection',
    templateUrl: 'multisselection.component.html',
    styleUrls: ['multiselection.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class MultiselectionComponent {
    public year: number = new Date().getFullYear();
    public month: number = new Date().getMonth();
    public multiSelection: boolean = true;
    @ViewChild('calendar')
    public calendarObj: Calendar;
    public dates: Date[] = [new Date(this.year, this.month, 10), new Date(this.year, this.month, 15), new Date(this.year, this.month, 25)];

    onValueChange(): void {
        let element: HTMLElement = document.getElementById('multiSelect');
        let tag: HTMLElement = document.createElement('br');
        element.innerHTML = '';
        element.appendChild(tag);
        for (let index: number = 0; index < this.calendarObj.values.length; index++) {
            element.insertBefore(document.createTextNode(this.calendarObj.values[index].toString()), element.children[0]);
            element.insertBefore(document.createElement('br'), element.childNodes[0]);
        }
    }
}