import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresetDirective, PresetsDirective } from './presets.directive';
import { DateRangePickerComponent } from './daterangepicker.component';
import { DateRangePickerModule } from './daterangepicker.module';





/**
 * NgModule definition for the DateRangePicker component with providers.
 */
@NgModule({
    imports: [CommonModule, DateRangePickerModule],
    exports: [
        DateRangePickerModule
    ],
    providers:[
        
    ]
})
export class DateRangePickerAllModule { }