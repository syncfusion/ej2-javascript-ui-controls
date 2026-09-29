import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedColumnDirective, StackedColumnsDirective } from './stacked-column.directive';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { AggregateColumnDirective, AggregateColumnsDirective } from './aggregate-columns.directive';
import { AggregateDirective, AggregatesDirective } from './aggregates.directive';
import { GridComponent } from './grid.component';

const GRID_DIRECTIVES = [
    GridComponent,
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
 * NgModule definition for the Grid component.
 * Re-exports standalone Grid component and directives so existing apps can keep using:
 * `imports: [GridModule]`
 */
@NgModule({
    imports: [CommonModule, ...GRID_DIRECTIVES],
    exports: [...GRID_DIRECTIVES]
})
export class GridModule { }