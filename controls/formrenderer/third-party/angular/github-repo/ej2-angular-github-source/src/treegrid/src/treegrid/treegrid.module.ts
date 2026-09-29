import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedColumnDirective, StackedColumnsDirective } from './stacked-column.directive';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { AggregateColumnDirective, AggregateColumnsDirective } from './aggregate-columns.directive';
import { AggregateDirective, AggregatesDirective } from './aggregates.directive';
import { TreeGridComponent } from './treegrid.component';

const TREEGRID_DIRECTIVES = [
    TreeGridComponent,
        StackedColumnDirective,
        StackedColumnsDirective,
        ColumnDirective,
        ColumnsDirective,
        AggregateColumnDirective,
        AggregateColumnsDirective,
        AggregateDirective,
        AggregatesDirective
];

/**
 * NgModule definition for the TreeGrid component.
 * Re-exports standalone TreeGrid component and directives so existing apps can keep using:
 * `imports: [TreeGridModule]`
 */
@NgModule({
    imports: [CommonModule, ...TREEGRID_DIRECTIVES],
    exports: [...TREEGRID_DIRECTIVES]
})
export class TreeGridModule { }