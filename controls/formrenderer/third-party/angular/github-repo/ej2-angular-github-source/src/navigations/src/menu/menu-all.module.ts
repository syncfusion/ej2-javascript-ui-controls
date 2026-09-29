import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemDirective, MenuItemsDirective } from './items.directive';
import { MenuComponent } from './menu.component';
import { MenuModule } from './menu.module';





/**
 * NgModule definition for the Menu component with providers.
 */
@NgModule({
    imports: [CommonModule, MenuModule],
    exports: [
        MenuModule
    ],
    providers:[
        
    ]
})
export class MenuAllModule { }