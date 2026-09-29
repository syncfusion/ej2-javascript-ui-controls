import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { StackedHeaderDirective, StackedHeadersDirective } from './stackedheaders.directive';
import { KanbanComponent } from './kanban.component';

const KANBAN_DIRECTIVES = [
    KanbanComponent,
        ColumnDirective,
        ColumnsDirective,
        StackedHeaderDirective,
        StackedHeadersDirective
];

/**
 * NgModule definition for the Kanban component.
 * Re-exports standalone Kanban component and directives so existing apps can keep using:
 * `imports: [KanbanModule]`
 */
@NgModule({
    imports: [CommonModule, ...KANBAN_DIRECTIVES],
    exports: [...KANBAN_DIRECTIVES]
})
export class KanbanModule { }