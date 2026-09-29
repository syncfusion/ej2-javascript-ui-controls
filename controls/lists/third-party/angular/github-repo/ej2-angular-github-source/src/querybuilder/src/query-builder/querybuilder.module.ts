import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { QueryBuilderComponent } from './querybuilder.component';

const QUERYBUILDER_DIRECTIVES = [
    QueryBuilderComponent,
        ColumnDirective,
        ColumnsDirective
];

/**
 * NgModule definition for the QueryBuilder component.
 * Re-exports standalone QueryBuilder component and directives so existing apps can keep using:
 * `imports: [QueryBuilderModule]`
 */
@NgModule({
    imports: [CommonModule, ...QUERYBUILDER_DIRECTIVES],
    exports: [...QUERYBUILDER_DIRECTIVES]
})
export class QueryBuilderModule { }