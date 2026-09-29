import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadedFilesDirective, FilesDirective } from './files.directive';
import { UploaderComponent } from './uploader.component';
import { UploaderModule } from './uploader.module';





/**
 * NgModule definition for the Uploader component with providers.
 */
@NgModule({
    imports: [CommonModule, UploaderModule],
    exports: [
        UploaderModule
    ],
    providers:[
        
    ]
})
export class UploaderAllModule { }