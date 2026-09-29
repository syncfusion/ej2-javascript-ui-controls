import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadedFilesDirective, FilesDirective } from './files.directive';
import { UploaderComponent } from './uploader.component';

const UPLOADER_DIRECTIVES = [
    UploaderComponent,
        UploadedFilesDirective,
        FilesDirective
];

/**
 * NgModule definition for the Uploader component.
 * Re-exports standalone Uploader component and directives so existing apps can keep using:
 * `imports: [UploaderModule]`
 */
@NgModule({
    imports: [CommonModule, ...UPLOADER_DIRECTIVES],
    exports: [...UPLOADER_DIRECTIVES]
})
export class UploaderModule { }