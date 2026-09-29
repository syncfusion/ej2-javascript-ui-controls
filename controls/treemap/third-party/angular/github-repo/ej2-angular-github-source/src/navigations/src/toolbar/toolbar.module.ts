import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDirective, ItemsDirective } from './items.directive';
import { ToolbarComponent } from './toolbar.component';

const TOOLBAR_DIRECTIVES = [
    ToolbarComponent,
        ItemDirective,
        ItemsDirective
];

/**
 * NgModule definition for the Toolbar component.
 * Re-exports standalone Toolbar component and directives so existing apps can keep using:
 * `imports: [ToolbarModule]`
 */
@NgModule({
    imports: [CommonModule, ...TOOLBAR_DIRECTIVES],
    exports: [...TOOLBAR_DIRECTIVES]
})
export class ToolbarModule { }