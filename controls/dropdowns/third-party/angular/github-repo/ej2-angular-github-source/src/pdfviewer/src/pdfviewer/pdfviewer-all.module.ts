import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerComponent } from './pdfviewer.component';
import { PdfViewerModule } from './pdfviewer.module';
import {LinkAnnotation, BookmarkView, Magnification, ThumbnailView, Toolbar, Navigation, Print, TextSelection, TextSearch, Annotation, FormDesigner, FormFields, PageOrganizer} from '@syncfusion/ej2-pdfviewer'


export const LinkAnnotationService: ValueProvider = { provide: 'PdfViewerLinkAnnotation', useValue: LinkAnnotation};
export const BookmarkViewService: ValueProvider = { provide: 'PdfViewerBookmarkView', useValue: BookmarkView};
export const MagnificationService: ValueProvider = { provide: 'PdfViewerMagnification', useValue: Magnification};
export const ThumbnailViewService: ValueProvider = { provide: 'PdfViewerThumbnailView', useValue: ThumbnailView};
export const ToolbarService: ValueProvider = { provide: 'PdfViewerToolbar', useValue: Toolbar};
export const NavigationService: ValueProvider = { provide: 'PdfViewerNavigation', useValue: Navigation};
export const PrintService: ValueProvider = { provide: 'PdfViewerPrint', useValue: Print};
export const TextSelectionService: ValueProvider = { provide: 'PdfViewerTextSelection', useValue: TextSelection};
export const TextSearchService: ValueProvider = { provide: 'PdfViewerTextSearch', useValue: TextSearch};
export const AnnotationService: ValueProvider = { provide: 'PdfViewerAnnotation', useValue: Annotation};
export const FormDesignerService: ValueProvider = { provide: 'PdfViewerFormDesigner', useValue: FormDesigner};
export const FormFieldsService: ValueProvider = { provide: 'PdfViewerFormFields', useValue: FormFields};
export const PageOrganizerService: ValueProvider = { provide: 'PdfViewerPageOrganizer', useValue: PageOrganizer};

/**
 * NgModule definition for the PdfViewer component with providers.
 */
@NgModule({
    imports: [CommonModule, PdfViewerModule],
    exports: [
        PdfViewerModule
    ],
    providers:[
        LinkAnnotationService,
        BookmarkViewService,
        MagnificationService,
        ThumbnailViewService,
        ToolbarService,
        NavigationService,
        PrintService,
        TextSelectionService,
        TextSearchService,
        AnnotationService,
        FormDesignerService,
        FormFieldsService,
        PageOrganizerService
    ]
})
export class PdfViewerAllModule { }