import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemDirective, MenuItemsDirective } from './items.directive';
import { MenuComponent } from './menu.component';

const MENU_DIRECTIVES = [
    MenuComponent,
        MenuItemDirective,
        MenuItemsDirective
];

/**
 * NgModule definition for the Menu component.
 * Re-exports standalone Menu component and directives so existing apps can keep using:
 * `imports: [MenuModule]`
 */
@NgModule({
    imports: [CommonModule, ...MENU_DIRECTIVES],
    exports: [...MENU_DIRECTIVES]
})
export class MenuModule { }