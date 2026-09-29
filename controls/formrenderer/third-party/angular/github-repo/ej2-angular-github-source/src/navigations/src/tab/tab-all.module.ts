import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabItemDirective, TabItemsDirective } from './items.directive';
import { TabComponent } from './tab.component';
import { TabModule } from './tab.module';





/**
 * NgModule definition for the Tab component with providers.
 */
@NgModule({
    imports: [CommonModule, TabModule],
    exports: [
        TabModule
    ],
    providers:[
        
    ]
})
export class TabAllModule { }