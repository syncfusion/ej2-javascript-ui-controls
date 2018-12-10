import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n } from '@syncfusion/ej2-base';import { ModuleDeclaration, Property, Event, EmitType } from '@syncfusion/ej2-base';import { PdfViewerBase } from './index';import { Navigation } from './index';import { Magnification } from './index';import { Toolbar } from './index';import { ToolbarItem } from './index';import { LinkTarget, InteractionMode } from './base/types';import { LinkAnnotation } from './index';import { ThumbnailView } from './index';import { BookmarkView } from './index';import { TextSelection } from './index';import { TextSearch } from './index';import { Print } from './index';import { IUnloadEventArgs, ILoadEventArgs, ILoadFailedEventArgs, IAjaxRequestFailureEventArgs, IPageChangeEventArgs, IPageClickEventArgs, IZoomChangeEventArgs, IHyperlinkClickEventArgs } from './index';
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
     * @default auto
     */
    height?: string | number;

    /**
     * Defines the scrollable width of the PdfViewer control.
     * @default auto
     */
    width?: string | number;

    /**
     * Enable or disables the toolbar of PdfViewer.
     * @default true
     */
    enableToolbar?: boolean;

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
     * Defines the settings of the PdfViewer service.
     */
    // tslint:disable-next-line:max-line-length
    serverActionSettings?: ServerActionSettingsModel;

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

}