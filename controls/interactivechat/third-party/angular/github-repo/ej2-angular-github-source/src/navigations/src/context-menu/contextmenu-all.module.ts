import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './contextmenu.component';
import { ContextMenuModule } from './contextmenu.module';





/**
 * NgModule definition for the ContextMenu component with providers.
 */
@NgModule({
    imports: [CommonModule, ContextMenuModule],
    exports: [
        ContextMenuModule
    ],
    providers:[
        
    ]
})
export class ContextMenuAllModule { }