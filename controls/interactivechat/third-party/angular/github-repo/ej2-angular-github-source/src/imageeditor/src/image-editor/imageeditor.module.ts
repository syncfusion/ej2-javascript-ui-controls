import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEditorComponent } from './imageeditor.component';

const IMAGEEDITOR_DIRECTIVES = [
    ImageEditorComponent
];

/**
 * NgModule definition for the ImageEditor component.
 * Re-exports standalone ImageEditor component and directives so existing apps can keep using:
 * `imports: [ImageEditorModule]`
 */
@NgModule({
    imports: [CommonModule, ...IMAGEEDITOR_DIRECTIVES],
    exports: [...IMAGEEDITOR_DIRECTIVES]
})
export class ImageEditorModule { }