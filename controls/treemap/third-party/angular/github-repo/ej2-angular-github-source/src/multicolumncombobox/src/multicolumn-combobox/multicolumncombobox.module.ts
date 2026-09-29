import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { MultiColumnComboBoxComponent } from './multicolumncombobox.component';

const MULTICOLUMNCOMBOBOX_DIRECTIVES = [
    MultiColumnComboBoxComponent,
        ColumnDirective,
        ColumnsDirective
];

/**
 * NgModule definition for the MultiColumnComboBox component.
 * Re-exports standalone MultiColumnComboBox component and directives so existing apps can keep using:
 * `imports: [MultiColumnComboBoxModule]`
 */
@NgModule({
    imports: [CommonModule, ...MULTICOLUMNCOMBOBOX_DIRECTIVES],
    exports: [...MULTICOLUMNCOMBOBOX_DIRECTIVES]
})
export class MultiColumnComboBoxModule { }