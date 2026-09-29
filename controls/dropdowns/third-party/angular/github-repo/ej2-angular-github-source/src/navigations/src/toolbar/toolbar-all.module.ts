import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDirective, ItemsDirective } from './items.directive';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';





/**
 * NgModule definition for the Toolbar component with providers.
 */
@NgModule({
    imports: [CommonModule, ToolbarModule],
    exports: [
        ToolbarModule
    ],
    providers:[
        
    ]
})
export class ToolbarAllModule { }