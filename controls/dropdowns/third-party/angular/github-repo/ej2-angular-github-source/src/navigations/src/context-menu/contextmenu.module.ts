import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './contextmenu.component';

const CONTEXTMENU_DIRECTIVES = [
    ContextMenuComponent
];

/**
 * NgModule definition for the ContextMenu component.
 * Re-exports standalone ContextMenu component and directives so existing apps can keep using:
 * `imports: [ContextMenuModule]`
 */
@NgModule({
    imports: [CommonModule, ...CONTEXTMENU_DIRECTIVES],
    exports: [...CONTEXTMENU_DIRECTIVES]
})
export class ContextMenuModule { }