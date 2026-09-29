import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDirective, ItemsDirective } from './items.directive';
import { TimelineComponent } from './timeline.component';

const TIMELINE_DIRECTIVES = [
    TimelineComponent,
        ItemDirective,
        ItemsDirective
];

/**
 * NgModule definition for the Timeline component.
 * Re-exports standalone Timeline component and directives so existing apps can keep using:
 * `imports: [TimelineModule]`
 */
@NgModule({
    imports: [CommonModule, ...TIMELINE_DIRECTIVES],
    exports: [...TIMELINE_DIRECTIVES]
})
export class TimelineModule { }