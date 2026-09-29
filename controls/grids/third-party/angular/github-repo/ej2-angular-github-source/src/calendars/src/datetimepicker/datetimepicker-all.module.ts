import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePickerComponent } from './datetimepicker.component';
import { DateTimePickerModule } from './datetimepicker.module';





/**
 * NgModule definition for the DateTimePicker component with providers.
 */
@NgModule({
    imports: [CommonModule, DateTimePickerModule],
    exports: [
        DateTimePickerModule
    ],
    providers:[
        
    ]
})
export class DateTimePickerAllModule { }