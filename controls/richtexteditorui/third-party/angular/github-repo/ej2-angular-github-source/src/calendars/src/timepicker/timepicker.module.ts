import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePickerComponent } from './timepicker.component';

const TIMEPICKER_DIRECTIVES = [
    TimePickerComponent
];

/**
 * NgModule definition for the TimePicker component.
 * Re-exports standalone TimePicker component and directives so existing apps can keep using:
 * `imports: [TimePickerModule]`
 */
@NgModule({
    imports: [CommonModule, ...TIMEPICKER_DIRECTIVES],
    exports: [...TIMEPICKER_DIRECTIVES]
})
export class TimePickerModule { }