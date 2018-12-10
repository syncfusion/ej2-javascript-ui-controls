
import { BaseEventArgs } from '@syncfusion/ej2-base';
/**
 * Exports types used by PDF viewer.
 */

/** 
 * This event arguments provides the necessary information about document load event.
 */
export interface ILoadEventArgs extends BaseEventArgs {
    /* Document name to be loaded into PdfViewer */
    documentName: string;
}

/** 
 * This event arguments provides the necessary information about document unload event.
 */
export interface IUnloadEventArgs extends BaseEventArgs {
    /* Document name to be loaded into PdfViewer */
    documentName: string;
}

/** 
 * This event arguments provides the necessary information about document load failed event.
 */
export interface ILoadFailedEventArgs extends BaseEventArgs {
    /* Document name to be loaded into PdfViewer */
    documentName: string;
    /* Defines the document password protected state */
    isPasswordRequired: boolean;
    /* In case of document load failed with incorrect password, this contain the incorrect password.  */
    password: string;
}

/** 
 * This event arguments provides the necessary information about ajax request failure event.
 */
export interface IAjaxRequestFailureEventArgs extends BaseEventArgs {
    /* Document name to be loaded into PdfViewer */
    documentName: string;
    /* Status code of error message */
    errorStatusCode: number;
    /* Error message for ajax failure */
    errorMessage: string;
}

/** 
 * This event arguments provides the necessary information about page click event.
 */
export interface IPageClickEventArgs extends BaseEventArgs {
    /* Document name to be loaded into PdfViewer */
    documentName: string;
    /* Page number of the document in which click action is performed */
    pageNumber: number;
    /* x co-ordinate of the click action location */
    x: number;
    /* y co-ordinate of the click action location */
    y: number;
}

/** 
 * This event arguments provides the necessary information about page change event.
 */
export interface IPageChangeEventArgs extends BaseEventArgs {
    /* Document name to be loaded into PdfViewer */
    documentName: string;
    /* Current Page number of the document. */
    currentPageNumber: number;
    /* Previous Page number of the document. */
    previousPageNumber: number;
}

/** 
 * This event arguments provides the necessary information about zoom change event.
 */
export interface IZoomChangeEventArgs extends BaseEventArgs {
    /* Defines the current zoom percentage value  */
    zoomValue: number;
    /* Defines the zoom value before change */
    previousZoomValue: number;
}

/** 
 * This event arguments provides the necessary information about hyperlink click event.
 */
export interface IHyperlinkClickEventArgs extends BaseEventArgs {
    /* Defines the current clicked hyperlink  */
    hyperlink: string;
}