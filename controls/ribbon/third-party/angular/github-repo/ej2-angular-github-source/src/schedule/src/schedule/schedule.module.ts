import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDirective, ViewsDirective } from './views.directive';
import { ResourceDirective, ResourcesDirective } from './resources.directive';
import { HeaderRowDirective, HeaderRowsDirective } from './headerrows.directive';
import { ToolbarItemDirective, ToolbarItemsDirective } from './toolbaritems.directive';
import { ScheduleComponent } from './schedule.component';

const SCHEDULE_DIRECTIVES = [
    ScheduleComponent,
        ViewDirective,
        ViewsDirective,
        ResourceDirective,
        ResourcesDirective,
        HeaderRowDirective,
        HeaderRowsDirective,
        ToolbarItemDirective,
        ToolbarItemsDirective
];

/**
 * NgModule definition for the Schedule component.
 * Re-exports standalone Schedule component and directives so existing apps can keep using:
 * `imports: [ScheduleModule]`
 */
@NgModule({
    imports: [CommonModule, ...SCHEDULE_DIRECTIVES],
    exports: [...SCHEDULE_DIRECTIVES]
})
export class ScheduleModule { }