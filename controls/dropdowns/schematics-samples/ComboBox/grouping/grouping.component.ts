/**
 * ComboBox Grouping & Icons Samples
 */
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'grouping.component.html',
    styleUrls: ['grouping.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class GroupAndIconComboBoxComponent {
    //define the JSON of data with category
    public vegetableData: { [key: string]: Object }[] = [
        { Vegetable: 'Cabbage', Category: 'Leafy and Salad', Id: 'item1' },
        { Vegetable: 'Chickpea', Category: 'Beans', Id: 'item2' },
        { Vegetable: 'Garlic', Category: 'Bulb and Stem', Id: 'item3' },
        { Vegetable: 'Green bean', Category: 'Beans', Id: 'item4' },
        { Vegetable: 'Horse gram', Category: 'Beans', Id: 'item5' },
        { Vegetable: 'Nopal', Category: 'Bulb and Stem', Id: 'item6' },
        { Vegetable: 'Onion', Category: 'Bulb and Stem', Id: 'item7' },
        { Vegetable: 'Pumpkins', Category: 'Leafy and Salad', Id: 'item8' },
        { Vegetable: 'Spinach', Category: 'Leafy and Salad', Id: 'item9' },
        { Vegetable: 'Wheat grass', Category: 'Leafy and Salad', Id: 'item10' },
        { Vegetable: 'Yarrow', Category: 'Leafy and Salad', Id: 'item11' }
    ];
    // map the groupBy field with Category column
    public groupFields: Object = { groupBy: 'Category', text: 'Vegetable', value: 'Id' };
    // set the height of the popup element
    public height: string = '200px';
    // set the placeholder to ComboBox input element
    public groupWaterMark: string = 'Select a vegetable';
    //define the data with icon class
}
