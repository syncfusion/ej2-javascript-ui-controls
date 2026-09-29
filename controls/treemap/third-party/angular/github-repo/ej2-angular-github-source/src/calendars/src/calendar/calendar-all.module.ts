import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { CalendarModule } from './calendar.module';
import {Islamic} from '@syncfusion/ej2-calendars'


export const IslamicService: ValueProvider = { provide: 'CalendarsIslamic', useValue: Islamic};

/**
 * NgModule definition for the Calendar component with providers.
 */
@NgModule({
    imports: [CommonModule, CalendarModule],
    exports: [
        CalendarModule
    ],
    providers:[
        IslamicService
    ]
})
export class CalendarAllModule { }