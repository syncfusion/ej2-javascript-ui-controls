
import { BaseEventArgs } from '@syncfusion/ej2-base';
import { AnnotationType } from './index';
import { ShapeLabelSettingsModel, DocumentTextCollectionSettingsModel } from '../pdfviewer-model';
/**
 * Exports types used by PDF viewer.
 */

/** 
 * This event arguments provides the necessary information about document load event.
 */
export interface LoadEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer.
     */
    documentName: string;
    /**
     * Defines the page details and page count of the PDF document.
     */
    // tslint:disable-next-line
    pageData: any;
}

/** 
 * This event arguments provides the necessary information about document unload event.
 */
export interface UnloadEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer.
     */
    documentName: string;
}

/** 
 * This event arguments provides the necessary information about document load failed event.
 */
export interface LoadFailedEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer.
     */
    documentName: string;
    /**
     * Defines the document password protected state.
     */
    isPasswordRequired: boolean;
    /**
     * In case of document load failed with incorrect password, this contain the incorrect password.
     */
    password: string;
}

/** 
 * This event arguments provides the necessary information about ajax request failure event.
 */
export interface AjaxRequestFailureEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer
     */
    documentName: string;
    /* Status code of error message */
    /**
     * Document name to be loaded into PdfViewer
     */
    errorStatusCode: number;
    /* Error message for ajax failure */
    /**
     * Document name to be loaded into PdfViewer
     */
    errorMessage: string;
    /**
     * Action name in which the failure is thrown.
     */
    action: string;
}

/** 
 * This event arguments provides the necessary information about form validation.
 */
export interface ValidateFormFieldsArgs extends BaseEventArgs {
    /** 
     * The form fields object from PDF document being loaded.
     */
    // tslint:disable-next-line
    formField: any;
    /**
     * Document name to be loaded into PdfViewer
     */
    documentName: string;
    /**
     * Defines the non-fillable form fields.
     */
    // tslint:disable-next-line
    nonFillableFields: any;
}

/** 
 * This event arguments provides the necessary information about page click event.
 */
export interface PageClickEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer
     */
    documentName: string;
    /**
     * Page number of the document in which click action is performed
     */
    pageNumber: number;
    /**
     * x co-ordinate of the click action location
     */
    x: number;
    /**
     * y co-ordinate of the click action location
     */
    y: number;
}

/** 
 * This event arguments provides the necessary information about page change event.
 */
export interface PageChangeEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer.
     */
    documentName: string;
    /**
     * Current Page number of the document.
     */
    currentPageNumber: number;
    /**
     * Previous Page number of the document.
     */
    previousPageNumber: number;
}

/** 
 * This event arguments provides the necessary information about zoom change event.
 */
export interface ZoomChangeEventArgs extends BaseEventArgs {
    /**
     * Defines the current zoom percentage value
     */
    zoomValue: number;
    /**
     * Defines the zoom value before change
     */
    previousZoomValue: number;
}

/**
 * This event arguments provides the necessary information about hyperlink click event.
 */
export interface HyperlinkClickEventArgs extends BaseEventArgs {
    /**
     * Defines the current clicked hyperlink
     */
    hyperlink: string;
    /**
     * Defines the current hyperlink element.
     */
    hyperlinkElement: HTMLAnchorElement;
}

/**
 * This event arguments provides the necessary information about hyperlink hover event.
 */
export interface HyperlinkMouseOverArgs extends BaseEventArgs {
    /**
     * Defines the current hyperlink element.
     */
    hyperlinkElement: HTMLAnchorElement;
}

/**
 * This event arguments provides the necessary information about annotation add event.
 */
export interface AnnotationAddEventArgs extends BaseEventArgs {
    /**
     * Defines the settings of the annotation added to the PDF document.
     */
    // tslint:disable-next-line
    annotationSettings: any;
    /**
     * Defines the bounds of the annotation added in the page of the PDF document.
     */
    // tslint:disable-next-line
    annotationBound: any;
    /**
     * Defines the id of the annotation added in the page of the PDF document.
     */
    annotationId: string;
    /**
     * Defines the page number in which the annotation is added.
     */
    pageIndex: number;
    /**
     * Define the type of the annotation added in the page of the PDF document.
     */
    annotationType: AnnotationType;
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string;
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number;
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number;
    /**
     * End index of text markup annotation in the page text content.
     */
    labelSettings?: ShapeLabelSettingsModel;
    /**
     * Defines the multi page annotation collections.
     */
    // tslint:disable-next-line
    multiplePageCollection?: any;
}

/**
 * This event arguments provides the necessary information about annotation remove event.
 */
export interface AnnotationRemoveEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation removed from the page of the PDF document.
     */
    annotationId: string;
    /**
     * Defines the page number in which the annotation is removed.
     */
    pageIndex: number;
    /**
     * Defines the type of the annotation removed from the page of the PDF document.
     */
    annotationType: AnnotationType;
    /**
     * Defines the bounds of the annotation removed from the page of the PDF document.
     */
    // tslint:disable-next-line
    annotationBounds: any;
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string;
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number;
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number;
    /**
     * Defines the multi page annotation collections.
     */
    // tslint:disable-next-line
    multiplePageCollection?: any;
}

/**
 * This event arguments provides the necessary information about annotation properties change event.
 */
export interface AnnotationPropertiesChangeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation property is changed in the page of the PDF document.
     */
    annotationId: string;
    /**
     * Defines the page number in which the annotation property is changed.
     */
    pageIndex: number;
    /**
     * Defines the type of the annotation property is changed in the page of the PDF document.
     */
    annotationType: AnnotationType;
    /**
     * Specifies that the color of the annotation is changed.
     */
    isColorChanged?: boolean;
    /**
     * Specifies that the opacity of the annotation is changed.
     */
    isOpacityChanged: boolean;
    /**
     * Specifies that the stroke color of the annotation is changed.
     */
    isStrokeColorChanged?: boolean;
    /**
     * Specifies that the thickness of the annotation is changed.
     */
    isThicknessChanged?: boolean;
    /**
     * Specifies that the line head start style of the annotation is changed.
     */
    isLineHeadStartStyleChanged?: boolean;
    /**
     * Specifies that the line head end style of the annotation is changed.
     */
    isLineHeadEndStyleChanged?: boolean;
    /**
     * Specifies that the border dash array of the annotation is changed.
     */
    isBorderDashArrayChanged?: boolean;
    /**
     * Specifies that the Text of the annotation is changed.
     */
    isTextChanged?: boolean;
    /**
     * Specifies that the comments of the annotation is changed.
     */
    isCommentsChanged?: boolean;
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string;
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number;
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number;
    /**
     * Defines the multi page annotation collections.
     */
    // tslint:disable-next-line
    multiplePageCollection?: any
}

/**
 * This event arguments provides the necessary information about annotation resize event.
 */
export interface AnnotationResizeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation resized in the page of the PDF document.
     */
    annotationId: string;
    /**
     * Defines the page number in which the annotation is resized.
     */
    pageIndex: number;
    /**
     * Defines the settings of the annotation resized in the PDF document.
     */
    // tslint:disable-next-line
    annotationSettings: any;
    /**
     * Defines the bounds of the annotation resized in the page of the PDF document.
     */
    // tslint:disable-next-line
    annotationBound: any;
    /**
     * Defines the type of the annotation resized in the page of the PDF document.
     */
    annotationType: AnnotationType;
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string;
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number;
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number;
    /**
     * End index of text markup annotation in the page text content.
     */
    labelSettings?: ShapeLabelSettingsModel;
    /**
     * Defines the multiple page annotation collections.
     */
    // tslint:disable-next-line
    multiplePageCollection?: any;
}

/**
 * This event arguments provides the necessary information about annotation move event.
 */
export interface AnnotationMoveEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation moved in the page of the PDF document.
     */
    annotationId: string;
    /**
     * Defines the page number in which the annotation is moved.
     */
    pageIndex: number;
    /**
     * Defines the type of the annotation moved in the page of the PDF document.
     */
    annotationType: AnnotationType;
    /**
     * Defines the settings of the annotation moved in the PDF document.
     */
    // tslint:disable-next-line
    annotationSettings: any;
    /**
     * Previous position of annotations in the page text content.
     */
    previousPosition: object;
    /**
     * Current position of annotations in the page text content.
     */
    currentPosition: object;
}

/**
 * This event arguments provides the necessary information about signature add event.
 */
export interface AddSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the bounds of the signature added in the page of the PDF document.
     */
    // tslint:disable-next-line
    bounds: any;
    /**
     * Defines the id of the signature added in the page of the PDF document.
     */
    id: string;
    /**
     * Defines the page number in which the signature is added.
     */
    pageIndex: number;
    /**
     * Define the type of the signature added in the page of the PDF document.
     */
    type: AnnotationType;
    /**
     * Define the opacity of the signature added in the page of the PDF document.
     */
    opacity: number;
    /**
     * Define the stroke color of the signature added in the page of the PDF document.
     */
    strokeColor: string;
    /**
     * Define the thickness of the signature added in the page of the PDF document.
     */
    thickness: number;
}

/**
 * This event arguments provides the necessary information about signature remove event.
 */
export interface RemoveSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the bounds of the signature removed in the page of the PDF document.
     */
    // tslint:disable-next-line
    bounds: any;
    /**
     * Defines the id of the signature removed in the page of the PDF document.
     */
    id: string;
    /**
     * Defines the page number in which the signature is removed.
     */
    pageIndex: number;
    /**
     * Define the type of the signature removed in the page of the PDF document.
     */
    type: AnnotationType;
}

/**
 * This event arguments provides the necessary information about signature move event.
 */
export interface MoveSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation moved in the page of the PDF document.
     */
    id: string;
    /**
     * Defines the page number in which the annotation is moved.
     */
    pageIndex: number;
    /**
     * Defines the type of the signature moved in the page of the PDF document.
     */
    type: AnnotationType;
    /**
     * Define the opacity of the signature added in the page of the PDF document.
     */
    opacity: number;
    /**
     * Define the stroke color of the signature added in the page of the PDF document.
     */
    strokeColor: string;
    /**
     * Define the thickness of the signature added in the page of the PDF document.
     */
    thickness: number;
    /**
     * Previous position of signature in the page text content.
     */
    previousPosition: object;
    /**
     * Current position of signature in the page text content.
     */
    currentPosition: object;
}

/**
 * This event arguments provides the necessary information about signature properties change event.
 */
export interface SignaturePropertiesChangeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the signature property is changed in the page of the PDF document.
     */
    id: string;
    /**
     * Defines the page number in which the signature property is changed.
     */
    pageIndex: number;
    /**
     * Defines the type of the signature property is changed in the page of the PDF document.
     */
    type: AnnotationType;
    /**
     * Specifies that the stroke color of the signature is changed.
     */
    isStrokeColorChanged?: boolean;
    /**
     * Specifies that the opacity of the signature is changed.
     */
    isOpacityChanged: boolean;
    /**
     * Specifies that the thickness of the signature is changed.
     */
    isThicknessChanged?: boolean;
    /**
     * Defines the old property value of the signature.
     */
    // tslint:disable-next-line
    oldValue: any;
    /**
     * Defines the new property value of the signature.
     */
    // tslint:disable-next-line
    newValue: any;
}

/**
 * This event arguments provides the necessary information about signature resize event.
 */
export interface ResizeSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the signature added in the page of the PDF document.
     */
    id: string;
    /**
     * Defines the page number in which the signature is added.
     */
    pageIndex: number;
    /**
     * Define the type of the signature added in the page of the PDF document.
     */
    type: AnnotationType;
    /**
     * Define the opacity of the signature added in the page of the PDF document.
     */
    opacity: number;
    /**
     * Define the stroke color of the signature added in the page of the PDF document.
     */
    strokeColor: string;
    /**
     * Define the thickness of the signature added in the page of the PDF document.
     */
    thickness: number;
    /**
     * Defines the current Position of the signature added in the page of the PDF document.
     */
    // tslint:disable-next-line
    currentPosition: any;
    /**
     * Defines the previous position of the signature added in the page of the PDF document.
     */
    // tslint:disable-next-line
    previousPosition: any;
}

/**
 * This event arguments provides the necessary information about annotation mouseover event.
 */
export interface AnnotationMouseoverEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the mouse over annotation object in the page of the PDF document
     */
    annotationId: string;
    /**
     * Defines the page number in which the mouse over annotation object is rendered.
     */
    pageIndex: number;
    /**
     * Defines the type of the annotation during the mouse hover in the PDF document. 
     */
    annotationType: AnnotationType;
    /**
     * Defines the annotation object mouse hover in the PDF document.
     */
    // tslint:disable-next-line
    annotation: any;
    /**
     * Defines the bounds of the annotation resized in the page of the PDF document.
     */
    // tslint:disable-next-line
    annotationBounds: any;
    /**
     * Defines the mouseover x position with respect to page container.
     */
    pageX: number;
    /**
     * Defines the mouseover y position with respect to page container.
     */
    pageY: number;
    /**
     * Defines the mouseover x position with respect to viewer container.
     */
    X: number;
    /**
     * Defines the mouseover y position with respect to viewer container.
     */
    Y: number;
}

/**
 * This event arguments provides the necessary information about page mouseovers event.
 */
export interface PageMouseoverEventArgs extends BaseEventArgs {
    /**
     * Mouseover x position with respect to page container.
     */
    pageX: number;
    /**
     * Mouseover y position with respect to page container.
     */
    pageY: number;
    }

/**
 * This event arguments provides the necessary information about annotation select event.
 */
export interface AnnotationSelectEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation selected in the page of the PDF document.
     */
    annotationId: string;
    /**
     * Defines the page number in which the annotation is selected.
     */
    pageIndex: number;
    /**
     * Defines the annotation selected in the PDF document.
     */
    // tslint:disable-next-line
    annotation: any;
    /**
     * Defines the overlapped annotations of the selected annotation.
     */
    // tslint:disable-next-line
    annotationCollection?: any;
    /**
     * Defines the multi page annotation collections.
     */
    // tslint:disable-next-line
    multiplePageCollection?: any;

    /**
     * Defines the annotation selection by mouse.
     */
    isProgrammaticSelection?: boolean;

}

/**
 * This event arguments provides the necessary information about annotation double click event.
 */
export interface AnnotationDoubleClickEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation double clicked in the page of the PDF document.
     */
    annotationId: string;
    /**
     * Defines the page number in which the annotation is double clicked.
     */
    pageIndex: number;
    /**
     * Defines the annotation double clicked in the PDF document.
     */
    // tslint:disable-next-line
    annotation: any;
}

/** 
 * This event arguments provides the necessary information about thumbnail click event.
 */
export interface ThumbnailClickEventArgs extends BaseEventArgs {
    /**
     * Page number of the thumbnail in which click action is performed
     */
    pageNumber: number;
}

/**
 * This event arguments provide the necessary information about text selection start event.
 */
export interface TextSelectionStartEventArgs extends BaseEventArgs {
    /**
     * Defines the page number in which the text selection is started.
     */
    pageIndex: number;
}

/**
 * This event arguments provide the necessary information about text selection end event.
 */
export interface TextSelectionEndEventArgs extends BaseEventArgs {
    /**
     * Defines the page number in which the text selection is finished.
     */
    pageIndex: number;
    /**
     * Defines the text content selected in the page.
     */
    textContent: string;
    /**
     * Defines the bounds of the selected text in the page.
     */
    // tslint:disable-next-line
    textBounds: any;
}

/** 
 * This event arguments provides the necessary information about import annotations start event.
 */
export interface ImportStartEventArgs extends BaseEventArgs {
    /**
     * json Data to be imported into PdfViewer.
     */
    // tslint:disable-next-line
    importData: any;
}

/** 
 * This event arguments provides the necessary information about export annotations start event.
 */
export interface ExportStartEventArgs extends BaseEventArgs {
    /**
     * Specifies the loaded document annotation details.
     */
    // tslint:disable-next-line
    exportData: any;
}

/** 
 * This event arguments provides the necessary information about import annotations success event.
 */
export interface ImportSuccessEventArgs extends BaseEventArgs {
    /**
     * Specified the data to be imported in loaded document.
     */
    // tslint:disable-next-line
    importData: any;
}

/** 
 * This event arguments provides the necessary information about export annotations success event.
 */
export interface ExportSuccessEventArgs extends BaseEventArgs {
    /**
     * Specifies the data exported from the loaded documents.
     */
    // tslint:disable-next-line
    exportData: any;
    /**
     * Specifies the exported annotations json file name.
     */
    fileName: string;
}

/** 
 * This event arguments provides the necessary information about import annotations failure event.
 */
export interface ImportFailureEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer
     */
    // tslint:disable-next-line
    importData: any;
    /**
     * Error details for import annotations.
     */
    errorDetails: string;
}

/** 
 * This event arguments provides the necessary information about export annotations failure event.
 */
export interface ExportFailureEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer
     */
    // tslint:disable-next-line
    exportData: any;
    /**
     * Error details for export annotations.
     */
    errorDetails: string;
}

/** 
 * This event arguments provides the necessary information about text extraction completed in the PDF Viewer.
 */
export interface ExtractTextCompletedEventArgs extends BaseEventArgs {
    /**
     * Returns the extracted text collection
     */
    // tslint:disable-next-line
    documentTextCollection: DocumentTextCollectionSettingsModel[][];
}
/** 
 * This event arguments provides the necessary information about data.
 */
export interface AjaxRequestInitiateEventArgs extends BaseEventArgs {
    /**
     * Specified the data to be sent in to server.
     */
    // tslint:disable-next-line
    JsonData: any;
}

/**
 * This event arguments provide the necessary information about download start event.
 */
export interface DownloadStartEventArgs extends BaseEventArgs {
    /**
     * File name of the currently loaded PDF document in the PDF Viewer.
     */
    fileName: string;
}

/**
 * This event arguments provide the necessary information about download end event.
 */
export interface DownloadEndEventArgs extends BaseEventArgs {
    /**
     * File name of the currently loaded PDF document in the PDF Viewer.
     */
    fileName: string;
    /**
     * Defines the base 64 string of the loaded PDF document data.
     */
    downloadDocument: string;
}