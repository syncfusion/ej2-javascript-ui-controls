import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { MultiColumnComboBoxComponent } from './multicolumncombobox.component';
import { MultiColumnComboBoxModule } from './multicolumncombobox.module';





/**
 * NgModule definition for the MultiColumnComboBox component with providers.
 */
@NgModule({
    imports: [CommonModule, MultiColumnComboBoxModule],
    exports: [
        MultiColumnComboBoxModule
    ],
    providers:[
        
    ]
})
export class MultiColumnComboBoxAllModule { }