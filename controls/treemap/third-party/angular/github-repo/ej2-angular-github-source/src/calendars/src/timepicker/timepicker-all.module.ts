import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePickerComponent } from './timepicker.component';
import { TimePickerModule } from './timepicker.module';





/**
 * NgModule definition for the TimePicker component with providers.
 */
@NgModule({
    imports: [CommonModule, TimePickerModule],
    exports: [
        TimePickerModule
    ],
    providers:[
        
    ]
})
export class TimePickerAllModule { }