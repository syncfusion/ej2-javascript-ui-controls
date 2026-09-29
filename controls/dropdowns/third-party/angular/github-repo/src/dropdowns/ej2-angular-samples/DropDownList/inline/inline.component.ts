/**
 * DropDownList inline Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'inline.component.html',
    styleUrls: ['inline.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class InlineDropDownListComponent {
    // define the JSON of data
   public data: { [key: string]: Object }[] = [
        { Name: 'Andrew', Eimg: '7'},
        { Name: 'Anne', Eimg: '1' },
        { Name: 'Janet', Eimg: '3'},
        { Name: 'Laura', Eimg: '2'},
        { Name: 'Margaret', Eimg: '6'},
        { Name: 'Michael', Eimg: '9'},
        { Name: 'Nancy', Eimg: '4'},
        { Name: 'Robert', Eimg: '8'},
        { Name: 'Steven', Eimg: '10'}
    ];
    // maps the appropriate column to fields property
    public fields: Object = { text: 'Name'};
    // set the height of the popup element
    public height: string = '200px';
    public width: string = '63px';
    public popupWidth: string = '140px';
    // set the placeholder to DropDownList input element
    public value: string = 'Michael';
    // set the placeholder to DropDownList input element
    public watermark: string = 'Select an employee';
}
