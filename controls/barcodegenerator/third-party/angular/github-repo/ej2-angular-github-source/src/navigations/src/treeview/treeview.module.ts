import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './treeview.component';

const TREEVIEW_DIRECTIVES = [
    TreeViewComponent
];

/**
 * NgModule definition for the TreeView component.
 * Re-exports standalone TreeView component and directives so existing apps can keep using:
 * `imports: [TreeViewModule]`
 */
@NgModule({
    imports: [CommonModule, ...TREEVIEW_DIRECTIVES],
    exports: [...TREEVIEW_DIRECTIVES]
})
export class TreeViewModule { }