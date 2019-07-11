
import { BaseEventArgs } from '@syncfusion/ej2-base';
import { AnnotationType } from './index';
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
    annotationId: number;
    /**
     * Defines the page number in which the annotation is added.
     */
    pageIndex: number;
    /**
     * Define the type of the annotation added in the page of the PDF document.
     */
    annotationType: AnnotationType;
}

/**
 * This event arguments provides the necessary information about annotation remove event.
 */
export interface AnnotationRemoveEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation removed from the page of the PDF document.
     */
    annotationId: number;
    /**
     * Defines the page number in which the annotation is removed.
     */
    pageIndex: number;
    /**
     * Defines the type of the annotation removed from the page of the PDF document.
     */
    annotationType: AnnotationType;
}

/**
 * This event arguments provides the necessary information about annotation properties change event.
 */
export interface AnnotationPropertiesChangeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation property is changed in the page of the PDF document.
     */
    annotationId: number;
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
}

/**
 * This event arguments provides the necessary information about annotation resize event.
 */
export interface AnnotationResizeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation resized in the page of the PDF document.
     */
    annotationId: number;
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
}