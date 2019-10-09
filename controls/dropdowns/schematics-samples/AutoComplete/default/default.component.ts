/**
 * AutoComplete Default functionality Sample
 */
import { Component} from '@angular/core';
import { AutoCompleteComponent } from '@syncfusion/ej2-angular-dropdowns';
@Component({
    selector: 'control-content',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css'],
})
export class DefaultAutoCompleteComponent {
    public AutoCompleteObj: AutoCompleteComponent;
    // defined the array of data
    public sportsData: Object[] = [
        { Id: 'Game1', Game: 'American Football' },
        { Id: 'Game2', Game: 'Badminton' },
        { Id: 'Game3', Game: 'Basketball' },
        { Id: 'Game4', Game: 'Cricket' },
        { Id: 'Game5', Game: 'Football' },
        { Id: 'Game6', Game: 'Golf' },
        { Id: 'Game7', Game: 'Hockey' },
        { Id: 'Game8', Game: 'Rugby' },
        { Id: 'Game9', Game: 'Snooker' },
        { Id: 'Game10', Game: 'Tennis' }
    ];
    // maps the appropriate column to fields property
    public fields: Object = { value: 'Game' };
    public value: string = '';
    // set the placeholder to AutoComplete input
    public waterMark: string = 'e.g. Basketball';
    // set the height of the popup element
    public height: string = '250px';
    // bind the change event

}
