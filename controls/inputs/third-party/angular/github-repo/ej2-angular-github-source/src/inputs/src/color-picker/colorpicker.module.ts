import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './colorpicker.component';

const COLORPICKER_DIRECTIVES = [
    ColorPickerComponent
];

/**
 * NgModule definition for the ColorPicker component.
 * Re-exports standalone ColorPicker component and directives so existing apps can keep using:
 * `imports: [ColorPickerModule]`
 */
@NgModule({
    imports: [CommonModule, ...COLORPICKER_DIRECTIVES],
    exports: [...COLORPICKER_DIRECTIVES]
})
export class ColorPickerModule { }