/**
 * ComboBox Defaut functionality Sample
 */
import { Component, NgModule } from '@angular/core';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
@Component({
    selector: 'control-content',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css'],
})
export class DefaultComboBoxComponent {
    public comboBoxObj: ComboBoxComponent;
    // define the JSON of data
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
    public fields: Object = { text: 'Game', value: 'Id' };
    // set the height of the popup element
    public height: string = '250px';
    // set the value to select an item based on mapped value at initial rendering
    public value: string = 'Game3';
    // set the placeholder to ComboBox input element
    public waterMark: string = 'Select a game';
   
}
