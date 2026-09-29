import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multiselect.component';
import { MultiSelectModule } from './multiselect.module';
import {CheckBoxSelection} from '@syncfusion/ej2-dropdowns'


export const CheckBoxSelectionService: ValueProvider = { provide: 'DropDownsCheckBoxSelection', useValue: CheckBoxSelection};

/**
 * NgModule definition for the MultiSelect component with providers.
 */
@NgModule({
    imports: [CommonModule, MultiSelectModule],
    exports: [
        MultiSelectModule
    ],
    providers:[
        CheckBoxSelectionService
    ]
})
export class MultiSelectAllModule { }