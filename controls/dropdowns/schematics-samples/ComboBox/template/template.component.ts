/**
 * ComboBox Template Sample
 */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'template.component.html',
    styleUrls: ['template.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TemplateComboBoxComponent {
    // define the JSON of employees data
    public data: { [key: string]: Object }[] = [
        { Name: 'Andrew Fuller', Eimg: '7', Designation: 'Team Lead', Country: 'England' },
        { Name: 'Anne Dodsworth', Eimg: '1', Designation: 'Developer', Country: 'USA' },
        { Name: 'Janet Leverling', Eimg: '3', Designation: 'HR', Country: 'USA' },
        { Name: 'Laura Callahan', Eimg: '2', Designation: 'Product Manager', Country: 'USA' },
        { Name: 'Margaret Peacock', Eimg: '6', Designation: 'Developer', Country: 'USA' },
        { Name: 'Michael Suyama', Eimg: '9', Designation: 'Team Lead', Country: 'USA' },
        { Name: 'Nancy Davolio', Eimg: '4', Designation: 'Product Manager', Country: 'USA' },
        { Name: 'Robert King', Eimg: '8', Designation: 'Developer ', Country: 'England' },
        { Name: 'Steven Buchanan', Eimg: '10', Designation: 'CEO', Country: 'England' }
    ];
    // maps the appropriate column to fields property
    public fields: Object = { text: 'Name', value: 'Eimg' };
    // set the height of the popup element
    public height: string = '250px';
    // set the placeholder to ComboBox input element
    public watermark: string = 'Select an employee';
}
