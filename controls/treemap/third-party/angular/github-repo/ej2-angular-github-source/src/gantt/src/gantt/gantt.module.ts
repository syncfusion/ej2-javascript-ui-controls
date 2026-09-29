import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { AddDialogFieldDirective, AddDialogFieldsDirective } from './adddialogfields.directive';
import { EditDialogFieldDirective, EditDialogFieldsDirective } from './editdialogfields.directive';
import { DayWorkingTimeDirective, DayWorkingTimeCollectionDirective } from './dayworkingtime.directive';
import { WeekWorkingTimeDirective, WeekWorkingTimesDirective } from './weekworkingtime.directive';
import { HolidayDirective, HolidaysDirective } from './holidays.directive';
import { EventMarkerDirective, EventMarkersDirective } from './eventmarkers.directive';
import { GanttComponent } from './gantt.component';

const GANTT_DIRECTIVES = [
    GanttComponent,
        ColumnDirective,
        ColumnsDirective,
        AddDialogFieldDirective,
        AddDialogFieldsDirective,
        EditDialogFieldDirective,
        EditDialogFieldsDirective,
        DayWorkingTimeDirective,
        DayWorkingTimeCollectionDirective,
        WeekWorkingTimeDirective,
        WeekWorkingTimesDirective,
        HolidayDirective,
        HolidaysDirective,
        EventMarkerDirective,
        EventMarkersDirective
];

/**
 * NgModule definition for the Gantt component.
 * Re-exports standalone Gantt component and directives so existing apps can keep using:
 * `imports: [GanttModule]`
 */
@NgModule({
    imports: [CommonModule, ...GANTT_DIRECTIVES],
    exports: [...GANTT_DIRECTIVES]
})
export class GanttModule { }