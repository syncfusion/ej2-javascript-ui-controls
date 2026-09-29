import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEditorComponent } from './imageeditor.component';
import { ImageEditorModule } from './imageeditor.module';





/**
 * NgModule definition for the ImageEditor component with providers.
 */
@NgModule({
    imports: [CommonModule, ImageEditorModule],
    exports: [
        ImageEditorModule
    ],
    providers:[
        
    ]
})
export class ImageEditorAllModule { }