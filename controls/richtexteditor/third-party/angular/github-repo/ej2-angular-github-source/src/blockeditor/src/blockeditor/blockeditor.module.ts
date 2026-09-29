import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockEditorComponent } from './blockeditor.component';

const BLOCKEDITOR_DIRECTIVES = [
    BlockEditorComponent
];

/**
 * NgModule definition for the BlockEditor component.
 * Re-exports standalone BlockEditor component and directives so existing apps can keep using:
 * `imports: [BlockEditorModule]`
 */
@NgModule({
    imports: [CommonModule, ...BLOCKEDITOR_DIRECTIVES],
    exports: [...BLOCKEDITOR_DIRECTIVES]
})
export class BlockEditorModule { }