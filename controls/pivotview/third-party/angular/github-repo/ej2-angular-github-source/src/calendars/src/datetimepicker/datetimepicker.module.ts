import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePickerComponent } from './datetimepicker.component';

const DATETIMEPICKER_DIRECTIVES = [
    DateTimePickerComponent
];

/**
 * NgModule definition for the DateTimePicker component.
 * Re-exports standalone DateTimePicker component and directives so existing apps can keep using:
 * `imports: [DateTimePickerModule]`
 */
@NgModule({
    imports: [CommonModule, ...DATETIMEPICKER_DIRECTIVES],
    exports: [...DATETIMEPICKER_DIRECTIVES]
})
export class DateTimePickerModule { }