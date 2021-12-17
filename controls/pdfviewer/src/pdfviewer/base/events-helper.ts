import { BaseEventArgs } from '@syncfusion/ej2-base';
import { AnnotationType, CommentStatus } from './index';
import { ShapeLabelSettingsModel, DocumentTextCollectionSettingsModel, RectangleBoundsModel, FormFieldModel } from '../pdfviewer-model';
import { IFormField, IFormFieldBound } from '../form-designer';
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
    documentName: string
    /**
     * Defines the page details and page count of the PDF document.
     */
    // eslint-disable-next-line
    pageData: any;
}

/**
 * This event arguments provides the necessary information about formField event.
 */
export interface FormFieldFocusOutEventArgs extends BaseEventArgs {
    /**
     * specifies the name of field.
     */
    fieldName: string
    /**
     * specifies the value from formField.
     */
    value: string
}

/**
 * This event arguments provides the necessary information about document unload event.
 */
export interface UnloadEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer.
     */
    documentName: string
}

/**
 * This event arguments provides the necessary information about freeText event.
 */
export interface BeforeAddFreeTextEventArgs extends BaseEventArgs {
    /**
     * value of free text annotation.
     */
    value: string
}

/**
 * This event provide necessary information about button field.
 */
export interface ButtonFieldClickEventArgs extends BaseEventArgs {
    /**
     * specifies the form field value.
     */
    buttonFieldValue: string
    /**
     * specifies the form field name.
     */
    buttonFieldName: string
    /**
     * specifies the form field id.
     */
    id: string
}
/**
 * This event provide necessary information about form fields.
 */
export interface FormFieldClickArgs extends BaseEventArgs {
    /**
     * Gets the name of the event.
     */
    name: string
    /**
     * Gets the form field object.
     */
    field: FormFieldModel
    /**
     * If TRUE, signature panel does not open for the signature field. FALSE by default.
     */
    cancel: boolean
}
/**
 * This event arguments provides the necessary information about document load failed event.
 */
export interface LoadFailedEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer.
     */
    documentName: string
    /**
     * Defines the document password protected state.
     */
    isPasswordRequired: boolean
    /**
     * In case of document load failed with incorrect password, this contain the incorrect password.
     */
    password: string
}

/**
 * This event arguments provides the necessary information about ajax request failure event.
 */
export interface AjaxRequestFailureEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer
     */
    documentName: string
    /* Status code of error message */
    /**
     * Document name to be loaded into PdfViewer
     */
    errorStatusCode: number
    /* Error message for ajax failure */
    /**
     * Document name to be loaded into PdfViewer
     */
    errorMessage: string
    /**
     * Action name in which the failure is thrown.
     */
    action: string
    /**
     * Specifies the retry request for the failed requests.
     */
    retryCount?: boolean
}

/**
 * This class describes ajaxRequestSuccess event arguments.
 */
export interface AjaxRequestSuccessEventArgs extends BaseEventArgs {
    /**
     * Get the name of the Event.
     */
    name: string
    /**
     * Get the loaded PDF document name in the PDF viewer
     */
    documentName: string
    /**
     * Get the action name of the request.
     */
    action: string
    /**
     * Get the data as a JSON object from the request.
     */
    // eslint-disable-next-line
    data: any
    /**
     * If TRUE, the exportAnnotation methods returns base64 string. False by default.
     */
     cancel: boolean
}

/**
 * This event arguments provides the necessary information about form validation.
 */
export interface ValidateFormFieldsArgs extends BaseEventArgs {
    /**
     * The form fields object from PDF document being loaded.
     */
    // eslint-disable-next-line
    formField: any;
    /**
     * Document name to be loaded into PdfViewer
     */
    documentName: string
    /**
     * Defines the non-fillable form fields.
     */
    // eslint-disable-next-line
    nonFillableFields: any;
}

/**
 * This event arguments provides the necessary information about page click event.
 */
export interface PageClickEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer
     */
    documentName: string
    /**
     * Page number of the document in which click action is performed
     */
    pageNumber: number
    /**
     * x co-ordinate of the click action location
     */
    x: number
    /**
     * y co-ordinate of the click action location
     */
    y: number
}

/**
 * This event arguments provides the necessary information about page change event.
 */
export interface PageChangeEventArgs extends BaseEventArgs {
    /**
     * Document name to be loaded into PdfViewer.
     */
    documentName: string
    /**
     * Current Page number of the document.
     */
    currentPageNumber: number
    /**
     * Previous Page number of the document.
     */
    previousPageNumber: number
}

/**
 * This event arguments provides the necessary information about zoom change event.
 */
export interface ZoomChangeEventArgs extends BaseEventArgs {
    /**
     * Defines the current zoom percentage value
     */
    zoomValue: number
    /**
     * Defines the zoom value before change
     */
    previousZoomValue: number
}

/**
 * This event arguments provides the necessary information about hyperlink click event.
 */
export interface HyperlinkClickEventArgs extends BaseEventArgs {
    /**
     * Get or set the URL to navigate.
     */
    hyperlink: string
    /**
     * Defines the current hyperlink element.
     */
    hyperlinkElement: HTMLAnchorElement
    /**
     * Hyperlink navigation will not work if it is set to TRUE. The value is set to FALSE by default.
     */
    cancel: boolean
}

/**
 * This event arguments provides the necessary information about hyperlink hover event.
 */
export interface HyperlinkMouseOverArgs extends BaseEventArgs {
    /**
     * Defines the current hyperlink element.
     */
    hyperlinkElement: HTMLAnchorElement
}

/**
 * This event arguments provides the necessary information about annotation add event.
 */
export interface AnnotationAddEventArgs extends BaseEventArgs {
    /**
     * Defines the settings of the annotation added to the PDF document.
     */
    // eslint-disable-next-line
    annotationSettings: any;
    /**
     * Defines the bounds of the annotation added in the page of the PDF document.
     */
    // eslint-disable-next-line
    annotationBound: any;
    /**
     * Defines the id of the annotation added in the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is added.
     */
    pageIndex: number
    /**
     * Define the type of the annotation added in the page of the PDF document.
     */
    annotationType: AnnotationType
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number
    /**
     * End index of text markup annotation in the page text content.
     */
    labelSettings?: ShapeLabelSettingsModel
    /**
     * Defines the multi page annotation collections.
     */
    // eslint-disable-next-line
    multiplePageCollection?: any;
    /**
     * Defines the name of the custom stamp added to the PDF page.
     */
    customStampName?: string;
}

/**
 * This event arguments provides the necessary information about annotation remove event.
 */
export interface AnnotationRemoveEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation removed from the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is removed.
     */
    pageIndex: number
    /**
     * Defines the type of the annotation removed from the page of the PDF document.
     */
    annotationType: AnnotationType
    /**
     * Defines the bounds of the annotation removed from the page of the PDF document.
     */
    // eslint-disable-next-line
    annotationBounds: any;
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number
    /**
     * Defines the multi page annotation collections.
     */
    // eslint-disable-next-line
    multiplePageCollection?: any;
}

/**
 * This event arguments provides the necessary information about comment event.
 */
export interface CommentEventArgs extends BaseEventArgs {
    /**
     * Specifies the id for the annotation comments
     */
    id: string
    /**
     * Gets the text
     */
    text: string
    /**
     * specifies the annotation for the comment.
     */
    annotation: string
    /**
     * specifies the status of the annotation
     */
    status?: CommentStatus
}

/**
 * This event arguments provides the necessary information about annotation properties change event.
 */
export interface AnnotationPropertiesChangeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation property is changed in the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation property is changed.
     */
    pageIndex: number
    /**
     * Defines the type of the annotation property is changed in the page of the PDF document.
     */
    annotationType: AnnotationType
    /**
     * Specifies that the color of the annotation is changed.
     */
    isColorChanged?: boolean
    /**
     * Specifies that the opacity of the annotation is changed.
     */
    isOpacityChanged: boolean
    /**
     * Specifies that the stroke color of the annotation is changed.
     */
    isStrokeColorChanged?: boolean
    /**
     * Specifies that the thickness of the annotation is changed.
     */
    isThicknessChanged?: boolean
    /**
     * Specifies that the line head start style of the annotation is changed.
     */
    isLineHeadStartStyleChanged?: boolean
    /**
     * Specifies that the line head end style of the annotation is changed.
     */
    isLineHeadEndStyleChanged?: boolean
    /**
     * Specifies that the border dash array of the annotation is changed.
     */
    isBorderDashArrayChanged?: boolean
    /**
     * Specifies that the Text of the annotation is changed.
     */
    isTextChanged?: boolean
    /**
     * Specifies that the comments of the annotation is changed.
     */
    isCommentsChanged?: boolean
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number
    /**
     * Defines the multi page annotation collections.
     */
    // eslint-disable-next-line
    multiplePageCollection?: any;
    /**
     * Specifies whether the text of the FreeText annotation is changed or not.
     */
    isFreeTextChanged?: boolean
    /**
     * Specifies the previous text of the freeText annotation.
     */
    previousText?: string
    /**
     * Specifies the current text of the freeText annotation.
     */
    currentText?: string
}

/**
 * This event arguments provides the necessary information about annotation resize event.
 */
export interface AnnotationResizeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation resized in the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is resized.
     */
    pageIndex: number
    /**
     * Defines the settings of the annotation resized in the PDF document.
     */
    // eslint-disable-next-line
    annotationSettings: any;
    /**
     * Defines the bounds of the annotation resized in the page of the PDF document.
     */
    // eslint-disable-next-line
    annotationBound: any;
    /**
     * Defines the type of the annotation resized in the page of the PDF document.
     */
    annotationType: AnnotationType
    /**
     * Defines the selected text content in the text markup annotation.
     */
    textMarkupContent?: string
    /**
     * Starting index of text markup annotation in the page text content.
     */
    textMarkupStartIndex?: number
    /**
     * End index of text markup annotation in the page text content.
     */
    textMarkupEndIndex?: number
    /**
     * End index of text markup annotation in the page text content.
     */
    labelSettings?: ShapeLabelSettingsModel
    /**
     * Defines the multiple page annotation collections.
     */
    // eslint-disable-next-line
    multiplePageCollection?: any;
}

/**
 * This event arguments provides the necessary information about annotation move event.
 */
export interface AnnotationMoveEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation moved in the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is moved.
     */
    pageIndex: number
    /**
     * Defines the type of the annotation moved in the page of the PDF document.
     */
    annotationType: AnnotationType
    /**
     * Defines the settings of the annotation moved in the PDF document.
     */
    // eslint-disable-next-line
    annotationSettings: any;
    /**
     * Previous position of annotations in the page text content.
     */
    previousPosition: object
    /**
     * Current position of annotations in the page text content.
     */
    currentPosition: object
}

/**
 * Describes the event arguments of AnnotationMovingEventArgs.
 */
 export interface AnnotationMovingEventArgs extends BaseEventArgs {
    /**
     * Defines the annotation id moving in the PDF page.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is moving.
     */
    pageIndex: number
    /**
     * Defines the annotation type moving in the PDF page.
     */
    annotationType: AnnotationType
    /**
     * Defines the annotation setting moving in the PDF page.
     */
    // eslint-disable-next-line
    annotationSettings: any;
    /**
     * Previous position of annotations in the page text content.
     */
    previousPosition: object
    /**
     * Current position of annotations in the page text content.
     */
    currentPosition: object
}

/**
 * This event arguments provides the necessary information about signature add event.
 */
export interface AddSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the bounds of the signature added in the page of the PDF document.
     */
    // eslint-disable-next-line
    bounds: any;
    /**
     * Defines the id of the signature added in the page of the PDF document.
     */
    id: string
    /**
     * Defines the page number in which the signature is added.
     */
    pageIndex: number
    /**
     * Define the type of the signature added in the page of the PDF document.
     */
    // eslint-disable-next-line
    type: any;
    /**
     * Define the opacity of the signature added in the page of the PDF document.
     */
    opacity: number
    /**
     * Define the stroke color of the signature added in the page of the PDF document.
     */
    strokeColor?: string
    /**
     * Define the thickness of the signature added in the page of the PDF document.
     */
    thickness?: number
    /**
     * Gets the base64 string of the signature path
     */
    data?: string
}

/**
 * This event arguments provides the necessary information about signature remove event.
 */
export interface RemoveSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the bounds of the signature removed in the page of the PDF document.
     */
    // eslint-disable-next-line
    bounds: any;
    /**
     * Defines the id of the signature removed in the page of the PDF document.
     */
    id: string
    /**
     * Defines the page number in which the signature is removed.
     */
    pageIndex: number
    /**
     * Define the type of the signature removed in the page of the PDF document.
     */
    type: AnnotationType
}

/**
 * This event arguments provides the necessary information about signature move event.
 */
export interface MoveSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation moved in the page of the PDF document.
     */
    id: string
    /**
     * Defines the page number in which the annotation is moved.
     */
    pageIndex: number
    /**
     * Defines the type of the signature moved in the page of the PDF document.
     */
    type: AnnotationType
    /**
     * Define the opacity of the signature added in the page of the PDF document.
     */
    opacity: number
    /**
     * Define the stroke color of the signature added in the page of the PDF document.
     */
    strokeColor: string
    /**
     * Define the thickness of the signature added in the page of the PDF document.
     */
    thickness: number
    /**
     * Previous position of signature in the page text content.
     */
    previousPosition: object
    /**
     * Current position of signature in the page text content.
     */
    currentPosition: object
}

/**
 * This event arguments provides the necessary information about signature properties change event.
 */
export interface SignaturePropertiesChangeEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the signature property is changed in the page of the PDF document.
     */
    id: string
    /**
     * Defines the page number in which the signature property is changed.
     */
    pageIndex: number
    /**
     * Defines the type of the signature property is changed in the page of the PDF document.
     */
    type: AnnotationType
    /**
     * Specifies that the stroke color of the signature is changed.
     */
    isStrokeColorChanged?: boolean
    /**
     * Specifies that the opacity of the signature is changed.
     */
    isOpacityChanged: boolean
    /**
     * Specifies that the thickness of the signature is changed.
     */
    isThicknessChanged?: boolean
    /**
     * Defines the old property value of the signature.
     */
    // eslint-disable-next-line
    oldValue: any;
    /**
     * Defines the new property value of the signature.
     */
    // eslint-disable-next-line
    newValue: any;
}

/**
 * This event arguments provides the necessary information about signature resize event.
 */
export interface ResizeSignatureEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the signature added in the page of the PDF document.
     */
    id: string
    /**
     * Defines the page number in which the signature is added.
     */
    pageIndex: number
    /**
     * Define the type of the signature added in the page of the PDF document.
     */
    type: AnnotationType
    /**
     * Define the opacity of the signature added in the page of the PDF document.
     */
    opacity: number
    /**
     * Define the stroke color of the signature added in the page of the PDF document.
     */
    strokeColor: string
    /**
     * Define the thickness of the signature added in the page of the PDF document.
     */
    thickness: number
    /**
     * Defines the current Position of the signature added in the page of the PDF document.
     */
    // eslint-disable-next-line
    currentPosition: any;
    /**
     * Defines the previous position of the signature added in the page of the PDF document.
     */
    // eslint-disable-next-line
    previousPosition: any;
}

/**
 * This event arguments provides the necessary information about signature select event.
 */
export interface SignatureSelectEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the signature selected in the page of the PDF document.
     */
    id: string
    /**
     * Defines the page number in which the signature is selected.
     */
    pageIndex: number
    /**
     * Defines the properties of the selected signature.
     */
    signature: object
}
/**
 * This event arguments provides the necessary information about mouse leave event.
 */
export interface AnnotationMouseLeaveEventArgs extends BaseEventArgs {
    /**
     * Defines the page number in which the mouse over annotation object is rendered.
     */
    pageIndex: number
}

/**
 * This event arguments provides the necessary information about annotation mouseover event.
 */
export interface AnnotationMouseoverEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the mouse over annotation object in the page of the PDF document
     */
    annotationId: string
    /**
     * Defines the page number in which the mouse over annotation object is rendered.
     */
    pageIndex: number
    /**
     * Defines the type of the annotation during the mouse hover in the PDF document.
     */
    annotationType: AnnotationType
    /**
     * Defines the annotation object mouse hover in the PDF document.
     */
    // eslint-disable-next-line
    annotation: any;
    /**
     * Defines the bounds of the annotation resized in the page of the PDF document.
     */
    // eslint-disable-next-line
    annotationBounds: any;
    /**
     * Defines the mouseover x position with respect to page container.
     */
    pageX: number
    /**
     * Defines the mouseover y position with respect to page container.
     */
    pageY: number
    /**
     * Defines the mouseover x position with respect to viewer container.
     */
    X: number
    /**
     * Defines the mouseover y position with respect to viewer container.
     */
    Y: number
}

/**
 * This event arguments provides the necessary information about page mouseovers event.
 */
export interface PageMouseoverEventArgs extends BaseEventArgs {
    /**
     * Mouseover x position with respect to page container.
     */
    pageX: number
    /**
     * Mouseover y position with respect to page container.
     */
    pageY: number
}

/**
 * This event arguments provides the necessary information about annotation select event.
 */
export interface AnnotationSelectEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation selected in the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is selected.
     */
    pageIndex: number
    /**
     * Defines the annotation selected in the PDF document.
     */
    // eslint-disable-next-line
    annotation: any;
    /**
     * Defines the overlapped annotations of the selected annotation.
     */
    // eslint-disable-next-line
    annotationCollection?: any;
    /**
     * Defines the multi page annotation collections.
     */
    // eslint-disable-next-line
    multiplePageCollection?: any;

    /**
     * Defines the annotation selection by mouse.
     */
    isProgrammaticSelection?: boolean

    /**
     * Defines the annotation add mode.
     */
    annotationAddMode?: string


}
/**
 * This event arguments provides the necessary information about annotation UnSelect event.
 */
export interface AnnotationUnSelectEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation unselected in the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is unselected.
     */
    pageIndex: number
    /**
     * Defines the annotation unselected in the PDF document.
     */
    // eslint-disable-next-line
    annotation: any;
}

/**
 * This event arguments provides the necessary information about annotation double click event.
 */
export interface AnnotationDoubleClickEventArgs extends BaseEventArgs {
    /**
     * Defines the id of the annotation double clicked in the page of the PDF document.
     */
    annotationId: string
    /**
     * Defines the page number in which the annotation is double clicked.
     */
    pageIndex: number
    /**
     * Defines the annotation double clicked in the PDF document.
     */
    // eslint-disable-next-line
    annotation: any;
}

/**
 * This event arguments provides the necessary information about thumbnail click event.
 */
export interface ThumbnailClickEventArgs extends BaseEventArgs {
    /**
     * Page number of the thumbnail in which click action is performed
     */
    pageNumber: number
}

/**
 * This event arguments provides the necessary information about bookmark click event.
 */
export interface BookmarkClickEventArgs extends BaseEventArgs {
    /**
     * Page number of the bookmark in which click action is performed
     */
    pageNumber: number
    /**
     * Position of the bookmark content
     */
    position: number
    /**
     * Title of the bookmark
     */
    text: string
    /**
     * Get the fileName from Launch action
     */
    fileName: string
}
/**
 * This event arguments provide the necessary information about text selection start event.
 */
export interface TextSelectionStartEventArgs extends BaseEventArgs {
    /**
     * Defines the page number in which the text selection is started.
     */
    pageIndex: number
}

/**
 * This event arguments provide the necessary information about text selection end event.
 */
export interface TextSelectionEndEventArgs extends BaseEventArgs {
    /**
     * Defines the page number in which the text selection is finished.
     */
    pageIndex: number
    /**
     * Defines the text content selected in the page.
     */
    textContent: string
    /**
     * Defines the bounds of the selected text in the page.
     */
    // eslint-disable-next-line
    textBounds: any;
}

/**
 * This event arguments provides the necessary information about import annotations start event.
 */
export interface ImportStartEventArgs extends BaseEventArgs {
    /**
     * json annotation Data to be imported into PdfViewer.
     */
    // eslint-disable-next-line
    importData: any;
    /**
     * json form field data to be imported into PdfViewer.
     */
    // eslint-disable-next-line
    formFieldData: any;

}

/**
 * This event arguments provides the necessary information about export annotations start event.
 */
export interface ExportStartEventArgs extends BaseEventArgs {
    /**
     * specifies the annotation data exported from the loaded document.
     */
    // eslint-disable-next-line
    exportData: any;
    /**
     * Specifies the form field data exported from the loaded document..
     */
    // eslint-disable-next-line
    formFieldData: any;

}

/**
 * This event arguments provides the necessary information about import annotations success event.
 */
export interface ImportSuccessEventArgs extends BaseEventArgs {
    /**
     * Specifies the annotation data to be imported in loaded document.
     */
    // eslint-disable-next-line
    importData: any;
    /**
     * Specifies the form field data to be imported in loaded document.
     */
    // eslint-disable-next-line
    formFieldData: any;

}

/**
 * This event arguments provides the necessary information about export annotations success event.
 */
export interface ExportSuccessEventArgs extends BaseEventArgs {
    /**
     * Specifies the annotation data exported from the loaded documents.
     */
    // eslint-disable-next-line
    exportData: any;
    /**
     * Specifies the exported annotations json file name.
     */
    fileName: string
    /**
     * Specifies the form field data exported from the loaded documents.
     */
    // eslint-disable-next-line
    formFieldData: any;

}

/**
 * This event arguments provides the necessary information about import annotations failure event.
 */
export interface ImportFailureEventArgs extends BaseEventArgs {
    /**
     * specifies the annotation data to be imported in loaded document.
     */
    // eslint-disable-next-line
    importData: any;
    /**
     * Error details for import annotations.
     */
    errorDetails: string
    /**
     * specifies the form field data to be imported in loaded document.
     */
    // eslint-disable-next-line
    formFieldData: any;

}

/**
 * This event arguments provides the necessary information about export annotations failure event.
 */
export interface ExportFailureEventArgs extends BaseEventArgs {
    /**
     * specifies the annotation data to be exported from the loaded document.
     */
    // eslint-disable-next-line
    exportData: any;
    /**
     * Error details for export annotations.
     */
    errorDetails: string
    /**
     * specifies the form field data to be exported from the loaded document.
     */
    // eslint-disable-next-line
    formFieldData: any;

}

/**
 * This event arguments provides the necessary information about text extraction completed in the PDF Viewer.
 */
export interface ExtractTextCompletedEventArgs extends BaseEventArgs {
    /**
     * Returns the extracted text collection
     */
    documentTextCollection: DocumentTextCollectionSettingsModel[][];
}
/**
 * This event arguments provides the necessary information about data.
 */
export interface AjaxRequestInitiateEventArgs extends BaseEventArgs {
    /**
     * Specified the data to be sent in to server.
     */
    // eslint-disable-next-line
    JsonData: any;
}

/**
 * This event arguments provide the necessary information about download start event.
 */
export interface DownloadStartEventArgs extends BaseEventArgs {
    /**
     * File name of the currently loaded PDF document in the PDF Viewer.
     */
    fileName: string
}

/**
 * This event arguments provide the necessary information about download end event.
 */
export interface DownloadEndEventArgs extends BaseEventArgs {
    /**
     * File name of the currently loaded PDF document in the PDF Viewer.
     */
    fileName: string
    /**
     * Defines the base 64 string of the loaded PDF document data.
     */
    downloadDocument: string
}

/**
 * This event arguments provide the necessary information about print start event.
 */
export interface PrintStartEventArgs extends BaseEventArgs {
    /**
     * File name of the currently loaded PDF document in the PDF Viewer.
     */
    fileName: string
    /**
     * If it is true then the print operation will not work.
     */
    cancel: boolean
}

/**
 * This event arguments provide the necessary information about print end event.
 */
export interface PrintEndEventArgs extends BaseEventArgs {
    /**
     * File name of the currently loaded PDF document in the PDF Viewer.
     */
    fileName: string
}

/**
 * This event arguments provides the necessary information about text search start event.
 */
export interface TextSearchStartEventArgs extends BaseEventArgs {
    /**
     * Specifies the searchText content in the PDF Viewer.
     */
    searchText: string
    /**
     * Specifies the match case of the searched text.
     */
    matchCase: boolean
}

/**
 * This event arguments provides the necessary information about text search highlight event.
 */
export interface TextSearchHighlightEventArgs extends BaseEventArgs {
    /**
     * Specifies the searchText content in the PDF Viewer.
     */
    searchText: string
    /**
     * Specifies the match case of the searched text.
     */
    matchCase: boolean
    /**
     * Specifies the bounds of the highlighted searched text.
     */
    bounds: RectangleBoundsModel
    /**
     * Specifies the page number of the highlighted search text.
     */
    pageNumber: number
}

/**
 * This event arguments provides the necessary information about text search end event.
 */
export interface TextSearchCompleteEventArgs extends BaseEventArgs {
    /**
     * Specifies the searchText content in the PDF Viewer.
     */
    searchText: string
    /**
     * Specifies the match case of the searched text.
     */
    matchCase: boolean
}

/**
 * This event arguments provides the necessary information about form field add event.
 */
export interface FormFieldAddArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field add event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
}

/**
 * This event arguments provides the necessary information about form field remove event.
 */
export interface FormFieldRemoveArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field remove event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
}

/**
 * Triggers an event when the form field is double-clicked.
 */
export interface FormFieldDoubleClickArgs extends BaseEventArgs {
    /**
     * Returns the event name.
     */
    name: string
    /**
     * If TRUE, property panel of the form field does not open. FALSE by default.
     */
    cancel: boolean
    /**
     * Returns the double-clicked form field object.
     */
    field: IFormField
}

/**
 * This event arguments provides the necessary information about form field properties change event.
 */
export interface FormFieldPropertiesChangeArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field properties change event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
    /**
     * Specifies whether the form field value is changed or not.
     */
    isValueChanged?: boolean
    /**
     * Specifies whether the font family of the form field is changed or not.
     */
    isFontFamilyChanged?: boolean
    /**
     * Specifies whether the font size of the form field is changed or not.
     */
    isFontSizeChanged?: boolean
    /**
     * Specifies whether the font style of the form field is changed or not.
     */
    isFontStyleChanged?: boolean
    /**
     * Specifies whether the font color of the form field is changed or not.
     */
    isColorChanged?: boolean
    /**
     * Specifies whether the background color of the form field is changed or not.
     */
    isBackgroundColorChanged?: boolean
    /**
     * Specifies whether the border color of the form field is changed or not.
     */
    isBorderColorChanged?: boolean
    /**
     * Specifies whether the border width of the form field is changed or not.
     */
    isBorderWidthChanged?: boolean
    /**
     * Specifies whether the text alignment of the form field is changed or not.
     */
    isAlignmentChanged?: boolean
    /**
     * Specifies the Read Only of Form field is changed or not.
     */
    isReadOnlyChanged?: boolean
    /**
     * Specifies whether the form field visibility is changed or not.
     */
    isVisibilityChanged?: boolean
    /**
     * Specifies whether the max length of the form field is changed or not.
     */
    isMaxLengthChanged?: boolean
    /**
     * Specifies whether the is required option of the form field is changed or not.
     */
    isRequiredChanged?: boolean
    /**
     * Specifies whether the print option of the form field is changed or not.
     */
    isPrintChanged?: boolean
    /**
     * Specifies whether the tool tip property is changed or not.
     */
    isToolTipChanged?: boolean
    /**
     * Specifies the old value of the form field.
     */
    // eslint-disable-next-line
    oldValue?: any;
    /**
     * Specifies the new value of the form field.
     */
    // eslint-disable-next-line
    newValue?: any;
}

/**
 * This event arguments provides the necessary information about form field mouse leave event.
 */
export interface FormFieldMouseLeaveArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field mouse leave event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
}

/**
 * This event arguments provides the necessary information about form field mouse over event.
 */
export interface FormFieldMouseoverArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field mouse over event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
    /**
     * Get the mouse over x position with respect to the page container.
     */
    pageX: number
    /**
     * Get the mouse over y position with respect to the page container.
     */
    pageY: number
    /**
     * Specifies the mouse over x position with respect to the viewer container.
     */
    X: number
    /**
     * Specifies the mouse over y position with respect to the viewer container.
     */
    Y: number
}

/**
 * This event arguments provides the necessary information about form field move event.
 */
export interface FormFieldMoveArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field move event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
    /**
     * Get the previous position of the form field in the page.
     */
    previousPosition: IFormFieldBound
    /**
     * Current position of form field in the page.
     */
    currentPosition: IFormFieldBound
}

/**
 * This event arguments provides the necessary information about form field resize event.
 */
export interface FormFieldResizeArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field resize event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
    /**
     * Get the previous position of the form field in the page.
     */
    previousPosition: IFormFieldBound
    /**
     * Current position of form field in the page.
     */
    currentPosition: IFormFieldBound
}

/**
 * This event arguments provides the necessary information about form field select event.
 */
export interface FormFieldSelectArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field select event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
    /**
     * Specifies whether the the form field is selected programmatically or by UI.
     */
    isProgrammaticSelection: boolean
}

/**
 * This event arguments provides the necessary information about form field un select event.
 */
export interface FormFieldUnselectArgs extends BaseEventArgs {
    /**
     * Get the name of the event.
     */
    name: string
    /**
     * Event arguments for the form field unselect event.
     */
    field: IFormField
    /**
     * Get the page number.
     */
    pageIndex: number
}
