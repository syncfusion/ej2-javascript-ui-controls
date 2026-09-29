/**
 * AutoComplete Highlight Sample
 */
import { Component} from '@angular/core';
import { AutoCompleteComponent, ChangeEventArgs, FilterType} from '@syncfusion/ej2-angular-dropdowns';
@Component({
    selector: 'control-content',
    templateUrl: 'highlight.component.html',
    styleUrls: ['highlight.component.css'],
})
export class HighlightAutoCompleteComponent {
   
    public autoCompleteObj: AutoCompleteComponent;
    // defined the array of data
    public countriesData: { [key: string]: Object; }[] = [
        { Name: 'Australia', Code: 'AU' },
        { Name: 'Bermuda', Code: 'BM' },
        { Name: 'Canada', Code: 'CA' },
        { Name: 'Cameroon', Code: 'CM' },
        { Name: 'Denmark', Code: 'DK' },
        { Name: 'France', Code: 'FR' },
        { Name: 'Finland', Code: 'FI' },
        { Name: 'Germany', Code: 'DE' },
        { Name: 'Greenland', Code: 'GL' },
        { Name: 'Hong Kong', Code: 'HK' },
        { Name: 'India', Code: 'IN' },
        { Name: 'Italy', Code: 'IT' },
        { Name: 'Japan', Code: 'JP' },
        { Name: 'Mexico', Code: 'MX' },
        { Name: 'Norway', Code: 'NO' },
        { Name: 'Poland', Code: 'PL' },
        { Name: 'Switzerland', Code: 'CH' },
        { Name: 'United Kingdom', Code: 'GB' },
        { Name: 'United States', Code: 'US' }
    ];
    // maps the appropriate column to fields property
    public fields: Object = { value: 'Name' };
    // set width of DropDownList element.
    public width: string = '150px';
    // bind change event to modify the filter type of AutoComplete element.
   
}
