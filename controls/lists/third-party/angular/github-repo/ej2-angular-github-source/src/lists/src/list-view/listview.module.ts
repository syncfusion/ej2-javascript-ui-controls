import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './listview.component';

const LISTVIEW_DIRECTIVES = [
    ListViewComponent
];

/**
 * NgModule definition for the ListView component.
 * Re-exports standalone ListView component and directives so existing apps can keep using:
 * `imports: [ListViewModule]`
 */
@NgModule({
    imports: [CommonModule, ...LISTVIEW_DIRECTIVES],
    exports: [...LISTVIEW_DIRECTIVES]
})
export class ListViewModule { }