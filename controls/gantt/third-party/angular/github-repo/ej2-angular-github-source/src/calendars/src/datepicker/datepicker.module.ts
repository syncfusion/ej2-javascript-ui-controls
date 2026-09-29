import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './datepicker.component';

const DATEPICKER_DIRECTIVES = [
    DatePickerComponent
];

/**
 * NgModule definition for the DatePicker component.
 * Re-exports standalone DatePicker component and directives so existing apps can keep using:
 * `imports: [DatePickerModule]`
 */
@NgModule({
    imports: [CommonModule, ...DATEPICKER_DIRECTIVES],
    exports: [...DATEPICKER_DIRECTIVES]
})
export class DatePickerModule { }