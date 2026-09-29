import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';

const CALENDAR_DIRECTIVES = [
    CalendarComponent
];

/**
 * NgModule definition for the Calendar component.
 * Re-exports standalone Calendar component and directives so existing apps can keep using:
 * `imports: [CalendarModule]`
 */
@NgModule({
    imports: [CommonModule, ...CALENDAR_DIRECTIVES],
    exports: [...CALENDAR_DIRECTIVES]
})
export class CalendarModule { }