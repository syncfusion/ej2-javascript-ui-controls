/**
 * ComboBox Filtering Sample
 */
import { Component, ViewChild } from '@angular/core';
import { Query } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
    selector: 'control-content',
    styleUrls: ['custom-value.component.css'],
    templateUrl: 'custom-value.component.html'
})
export class CustomValueComboBoxComponent {
    // defined the JSON of data
    public data: { [key: string]: Object; }[] = [
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
        { Name: 'Italy', Code: 'IT' }
    ];
    // maps the appropriate column to fields property
    public fields: Object = { text: 'Name', value: 'Code' };
    // set the height of the popup element
    public height: string = '220px';
    // set the placeholder to ComboBox input element
    public watermark: string = 'Select a country';
    // bind the filtering event
    public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
        let query: Query = new Query();
        // frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
        // pass the filter data source, filter query to updateData method.
        e.updateData(this.data, query);
    }
    @ViewChild('sample')
    public comboObj: ComboBoxComponent;
    public addNewItem = () => {
        // get the typed characters
        let customValue: string = (this.comboObj.element.getElementsByClassName('e-input')[0] as HTMLInputElement).value;
        // make new object based on typed characters
        let newItem: { [key: string]: Object; } = {'Name': customValue, 'Code': customValue };
        // new object added to data source.
        (this.comboObj.dataSource as Object[]).push(newItem);
        // close the popup element.
        this.comboObj.hidePopup();
        // pass new object to addItem method.
        this.comboObj.addItem(newItem);
        // select the newly added item.
        this.comboObj.value = customValue;
    }
}
