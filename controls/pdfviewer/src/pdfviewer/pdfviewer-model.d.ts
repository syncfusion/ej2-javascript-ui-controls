import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n } from '@syncfusion/ej2-base';import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType } from '@syncfusion/ej2-base';import { PdfViewerBase } from './index';import { Navigation } from './index';import { Magnification } from './index';import { Toolbar } from './index';import { ToolbarItem } from './index';import { LinkTarget, InteractionMode, AnnotationType, AnnotationToolbarItem } from './base/types';import { Annotation } from './index';import { LinkAnnotation } from './index';import { ThumbnailView } from './index';import { BookmarkView } from './index';import { TextSelection } from './index';import { TextSearch } from './index';import { Print } from './index';import { IUnloadEventArgs, ILoadEventArgs, ILoadFailedEventArgs, IAjaxRequestFailureEventArgs, IPageChangeEventArgs, IPageClickEventArgs, IZoomChangeEventArgs, IHyperlinkClickEventArgs } from './index';import { IAnnotationAddEventArgs, IAnnotationRemoveEventArgs, IAnnotationPropertiesChangeEventArgs } from './index';
import {IAjaxHeaders} from "./pdfviewer";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Enable or disables the toolbar of PdfViewer.
     */
    showTooltip?: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    toolbarItem?: ToolbarItem[];

}

/**
 * Interface for a class AjaxRequestSettings
 */
export interface AjaxRequestSettingsModel {

    /**
     * set the ajax Header values in the PdfViewer.
     */
    ajaxHeaders?: IAjaxHeaders [];

}

/**
 * Interface for a class AnnotationToolbarSettings
 */
export interface AnnotationToolbarSettingsModel {

    /**
     * Enable or disables the tooltip of the toolbar.
     */
    showTooltip?: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    annotationToolbarItem?: AnnotationToolbarItem[];

}

/**
 * Interface for a class ServerActionSettings
 */
export interface ServerActionSettingsModel {

    /**
     * specifies the load action of PdfViewer.
     */
    load?: string;

    /**
     * specifies the unload action of PdfViewer.
     */
    unload?: string;

    /**
     * specifies the render action of PdfViewer.
     */
    renderPages?: string;

    /**
     * specifies the print action of PdfViewer.
     */
    print?: string;

    /**
     * specifies the download action of PdfViewer.
     */
    download?: string;

    /**
     * specifies the download action of PdfViewer.
     */
    renderThumbnail?: string;

}

/**
 * Interface for a class StrikethroughSettings
 */
export interface StrikethroughSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the color of the annotation.
     */
    color?: string;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

    /**
     * specifies the modified date of the annotation.
     */
    modifiedDate?: string;

}

/**
 * Interface for a class UnderlineSettings
 */
export interface UnderlineSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the color of the annotation.
     */
    color?: string;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

    /**
     * specifies the modified date of the annotation.
     */
    modifiedDate?: string;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the color of the annotation.
     */
    color?: string;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

    /**
     * specifies the modified date of the annotation.
     */
    modifiedDate?: string;

}

/**
 * Interface for a class PdfViewer
 */
export interface PdfViewerModel extends ComponentModel{

    /**
     * Defines the service url of the PdfViewer control.
     */
    serviceUrl?: string;

    /**
     * Sets the PDF document path for initial loading.
     */
    documentPath?: string;

    /**
     * Defines the scrollable height of the PdfViewer control.
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Defines the scrollable width of the PdfViewer control.
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Enable or disables the toolbar of PdfViewer.
     * @default true
     */
    enableToolbar?: boolean;

    /**
     * Enable or disables the Navigation toolbar of PdfViewer.
     * @default true
     */
    enableNavigationToolbar?: boolean;

    /**
     * Enable or disables the download option of PdfViewer.
     * @default true
     */
    enableDownload?: boolean;

    /**
     * Enable or disables the print option of PdfViewer.
     * @default true
     */
    enablePrint?: boolean;

    /**
     * Enables or disables the thumbnail view in the PDF viewer
     * @default true
     */
    enableThumbnail?: boolean;

    /**
     * Enables or disables the bookmark view in the PDF viewer
     * @default true
     */
    enableBookmark?: boolean;

    /**
     * Enables or disables the hyperlinks in PDF document.
     * @default true
     */
    enableHyperlink?: boolean;

    /**
     * Specifies the open state of the hyperlink in the PDF document.
     * @default CurrentTab
     */
    hyperlinkOpenState?: LinkTarget;

    /**
     * Enable or disables the Navigation module of PdfViewer.
     * @default true
     */
    enableNavigation?: boolean;

    /**
     * Enable or disables the Magnification module of PdfViewer.
     * @default true
     */
    enableMagnification?: boolean;

    /**
     * Enable or disables the text selection in the PdfViewer.
     * @default true
     */
    enableTextSelection?: boolean;

    /**
     * Enable or disables the text search in the PdfViewer.
     * @default true
     */
    enableTextSearch?: boolean;

    /**
     * Enable or disable the annotation in the Pdfviewer.
     * @default true
     */
    enableAnnotation?: boolean;

    /**
     * Enable or disables the text markup annotation in the PdfViewer.
     * @default true
     */
    enableTextMarkupAnnotation?: boolean;

    /**
     * Sets the interaction mode of the PdfViewer
     * @default TextSelection
     */
    interactionMode?: InteractionMode;

    /**
     * Defines the settings of the PdfViewer toolbar.
     */
    // tslint:disable-next-line:max-line-length
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Defines the ajax Request settings of the PdfViewer.
     */
    // tslint:disable-next-line:max-line-length
    ajaxRequestSettings?: AjaxRequestSettingsModel;

    /**
     * Defines the settings of the PdfViewer annotation toolbar.
     */
    // tslint:disable-next-line:max-line-length
    annotationToolbarSettings?: AnnotationToolbarSettingsModel;

    /**
     * Defines the settings of the PdfViewer service.
     */
    // tslint:disable-next-line:max-line-length
    serverActionSettings?: ServerActionSettingsModel;

    /**
     * Defines the settings of highlight annotation.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Defines the settings of strikethrough annotation.
     */
    strikethroughSettings?: StrikethroughSettingsModel;

    /**
     * Defines the settings of underline annotation.
     */
    underlineSettings?: UnderlineSettingsModel;

    /**
     * Triggers while loading document into PdfViewer.
     * @event
     */
    documentLoad?: EmitType<ILoadEventArgs>;

    /**
     * Triggers while close the document
     * @event
     */
    documentUnload?: EmitType<IUnloadEventArgs>;

    /**
     * Triggers while loading document got failed in PdfViewer.
     * @event
     */
    documentLoadFailed?: EmitType<ILoadFailedEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     */
    ajaxRequestFailed?: EmitType<IAjaxRequestFailureEventArgs>;

    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     * @event
     */
    pageClick?: EmitType<IPageClickEventArgs>;

    /**
     * Triggers when there is change in current page number.
     * @event
     */
    pageChange?: EmitType<IPageChangeEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is clicked
     * @event
     */
    hyperlinkClick?: EmitType<IHyperlinkClickEventArgs>;

    /**
     * Triggers when there is change in the magnification value.
     * @event
     */
    zoomChange?: EmitType<IZoomChangeEventArgs>;

    /**
     * Triggers when an annotation is added over the page of the PDF document.
     * @event
     */
    annotationAdd?: EmitType<IAnnotationAddEventArgs>;

    /**
     * Triggers when an annotation is removed from the page of the PDF document.
     * @event 
     */
    annotationRemove?: EmitType<IAnnotationRemoveEventArgs>;

    /**
     * Triggers when the property of the annotation is changed in the page of the PDF document.
     * @event
     */
    annotationPropertiesChange?: EmitType<IAnnotationPropertiesChangeEventArgs>;

}