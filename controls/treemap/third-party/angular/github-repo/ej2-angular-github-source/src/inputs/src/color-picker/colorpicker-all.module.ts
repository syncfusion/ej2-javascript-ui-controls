import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './colorpicker.component';
import { ColorPickerModule } from './colorpicker.module';





/**
 * NgModule definition for the ColorPicker component with providers.
 */
@NgModule({
    imports: [CommonModule, ColorPickerModule],
    exports: [
        ColorPickerModule
    ],
    providers:[
        
    ]
})
export class ColorPickerAllModule { }