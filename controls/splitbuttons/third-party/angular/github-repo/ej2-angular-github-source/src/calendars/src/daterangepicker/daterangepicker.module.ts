import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresetDirective, PresetsDirective } from './presets.directive';
import { DateRangePickerComponent } from './daterangepicker.component';

const DATERANGEPICKER_DIRECTIVES = [
    DateRangePickerComponent,
        PresetDirective,
        PresetsDirective
];

/**
 * NgModule definition for the DateRangePicker component.
 * Re-exports standalone DateRangePicker component and directives so existing apps can keep using:
 * `imports: [DateRangePickerModule]`
 */
@NgModule({
    imports: [CommonModule, ...DATERANGEPICKER_DIRECTIVES],
    exports: [...DATERANGEPICKER_DIRECTIVES]
})
export class DateRangePickerModule { }