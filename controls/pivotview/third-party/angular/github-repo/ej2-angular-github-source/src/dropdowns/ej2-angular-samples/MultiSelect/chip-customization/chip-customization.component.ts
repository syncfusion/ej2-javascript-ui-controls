import { Component, ViewEncapsulation } from '@angular/core';
import { TaggingEventArgs } from '@syncfusion/ej2-angular-dropdowns';

@Component({
    selector: 'control-content',
    templateUrl: 'chip-customization.component.html',
    styleUrls: ['chip-customization.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ChipCustomizeMultiSelectComponent {
    // define the JSON of data
    public colorsData: { [key: string]: Object }[] = [
        { Color: 'Chocolate', Code: '#75523C' },
        { Color: 'CadetBlue', Code: '#3B8289' },
        { Color: 'DarkOrange', Code: '#FF843D' },
        { Color: 'DarkRed', Code: '#CA3832' },
        { Color: 'Fuchsia', Code: '#D44FA3' },
        { Color: 'HotPink', Code: '#F23F82' },
        { Color: 'Indigo', Code: '#2F5D81' },
        { Color: 'LimeGreen', Code: '#4CD242' },
        { Color: 'OrangeRed', Code: '#FE2A00' },
        { Color: 'Tomato', Code: '#FF745C' }
    ];

    // map the appropriate columns to fields property
    public fields: { [key: string]: string } = { text: 'Color', value: 'Code' };
    // set the value to MultiSelect
    public colorValues: string[] = [ '#75523C', '#4CD242', '#FF745C', '#3B8289', '#CA3832' ];
    // set the placeholder to MultiSelect input element
    public waterMark: string = 'Favorite Colors';
    // set the type of mode for how to visualized the selected items in input element.
    public box: string = 'Box';
    // bind the tagging event
    public onTagging = (e: TaggingEventArgs) => {
        // set the current selected item text as class to chip element.
        e.setClass((e.itemData as any)[this.fields.text].toLowerCase());
      }

}
