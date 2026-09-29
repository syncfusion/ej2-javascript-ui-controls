import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './datepicker.component';
import { DatePickerModule } from './datepicker.module';
import {MaskedDateTime} from '@syncfusion/ej2-calendars'


export const MaskedDateTimeService: ValueProvider = { provide: 'CalendarsMaskedDateTime', useValue: MaskedDateTime};

/**
 * NgModule definition for the DatePicker component with providers.
 */
@NgModule({
    imports: [CommonModule, DatePickerModule],
    exports: [
        DatePickerModule
    ],
    providers:[
        MaskedDateTimeService
    ]
})
export class DatePickerAllModule { }