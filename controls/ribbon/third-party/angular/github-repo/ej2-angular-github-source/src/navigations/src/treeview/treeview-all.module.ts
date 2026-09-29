import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './treeview.component';
import { TreeViewModule } from './treeview.module';





/**
 * NgModule definition for the TreeView component with providers.
 */
@NgModule({
    imports: [CommonModule, TreeViewModule],
    exports: [
        TreeViewModule
    ],
    providers:[
        
    ]
})
export class TreeViewAllModule { }