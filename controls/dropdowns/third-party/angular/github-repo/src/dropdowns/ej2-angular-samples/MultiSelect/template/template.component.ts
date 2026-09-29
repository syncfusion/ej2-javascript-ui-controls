import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'template.component.html',
    styleUrls: ['template.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TemplateMultiSelectComponent {
    constructor(private changeDetect: ChangeDetectorRef) {
    }
    ngAfterViewInit() {
        this.changeDetect.detectChanges();
    }
    // define the JSON of data
    public multidata: { [key: string]: Object }[] = [
        { Name: 'Andrew Fuller', Eimg: '7', Job: 'Team Lead', Country: 'England' },
        { Name: 'Anne Dodsworth', Eimg: '1', Job: 'Developer', Country: 'USA' },
        { Name: 'Janet Leverling', Eimg: '3', Job: 'HR', Country: 'USA' },
        { Name: 'Laura Callahan', Eimg: '2', Job: 'Product Manager', Country: 'USA' },
        { Name: 'Margaret Peacock', Eimg: '6', Job: 'Developer', Country: 'USA' },
        { Name: 'Michael Suyama', Eimg: '9', Job: 'Team Lead', Country: 'USA' },
        { Name: 'Nancy Davolio', Eimg: '4', Job: 'Product Manager', Country: 'USA' },
        { Name: 'Robert King', Eimg: '8', Job: 'Developer ', Country: 'England' },
        { Name: 'Steven Buchanan', Eimg: '10', Job: 'CEO', Country: 'England' }
    ];
    // maps the appropriate column to fields property
    public multifields: Object = { text: 'Name', value: 'Eimg' };
    //set the placeholder to MultiSelect input
    public multiwatermark: string = 'Select employees';
    // set the type of mode for how to visualized the selected items in input element.
    public box: string = 'Box';
}
