import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerComponent } from './pdfviewer.component';

const PDFVIEWER_DIRECTIVES = [
    PdfViewerComponent
];

/**
 * NgModule definition for the PdfViewer component.
 * Re-exports standalone PdfViewer component and directives so existing apps can keep using:
 * `imports: [PdfViewerModule]`
 */
@NgModule({
    imports: [CommonModule, ...PDFVIEWER_DIRECTIVES],
    exports: [...PDFVIEWER_DIRECTIVES]
})
export class PdfViewerModule { }