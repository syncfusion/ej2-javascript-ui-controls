import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { StackedHeaderDirective, StackedHeadersDirective } from './stackedheaders.directive';
import { KanbanComponent } from './kanban.component';
import { KanbanModule } from './kanban.module';





/**
 * NgModule definition for the Kanban component with providers.
 */
@NgModule({
    imports: [CommonModule, KanbanModule],
    exports: [
        KanbanModule
    ],
    providers:[
        
    ]
})
export class KanbanAllModule { }