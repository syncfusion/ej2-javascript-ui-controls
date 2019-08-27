import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex } from '@syncfusion/ej2-base';import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType } from '@syncfusion/ej2-base';import { PdfViewerBase } from './index';import { Navigation } from './index';import { Magnification } from './index';import { Toolbar } from './index';import { ToolbarItem } from './index';import { LinkTarget, InteractionMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction } from './base/types';import { Annotation } from './index';import { LinkAnnotation } from './index';import { ThumbnailView } from './index';import { BookmarkView } from './index';import { TextSelection } from './index';import { TextSearch } from './index';import { Print, CalibrationUnit } from './index';import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs } from './index';import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs } from './index';import { PdfAnnotationBase, ZOrderPageTable } from '../diagram/pdf-annotation';import { PdfAnnotationBaseModel } from '../diagram/pdf-annotation-model';import { Drawing, ClipBoardObject } from '../diagram/drawing';import { Selector } from '../diagram/selector';import { SelectorModel } from '../diagram/selector-model';import { PointModel, IElement, Rect } from '@syncfusion/ej2-drawings';import { renderAdornerLayer } from '../diagram/dom-util';
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
    toolbarItems?: ToolbarItem[];

}

/**
 * Interface for a class AjaxRequestSettings
 */
export interface AjaxRequestSettingsModel {

    /**
     * set the ajax Header values in the PdfViewer.
     */
    ajaxHeaders?: IAjaxHeaders[];

}

/**
 * Interface for a class CustomStampItem
 */
export interface CustomStampItemModel {

    /**
     * specifies the stamp Name of the PdfViewer.
     */
    customStampName?: string;

    /**
     * specifies the stamp ImageSource of the PdfViewer.
     */
    customStampImageSource?: string;

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

    /**
     * specifies the annotation comments action of PdfViewer.
     */
    renderComments?: string;

    /**
     * specifies the imports annotations action of PdfViewer.
     */
    importAnnotations?: string;

    /**
     * specifies the export annotations action of PdfViewer.
     */
    exportAnnotations?: string;

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
 * Interface for a class LineSettings
 */
export interface LineSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle?: LineHeadStyle;

    /**
     * specifies the line head end style of the annotation.
     */
    lineHeadEndStyle?: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray?: number;

}

/**
 * Interface for a class ArrowSettings
 */
export interface ArrowSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle?: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadEndStyle?: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray?: number;

}

/**
 * Interface for a class RectangleSettings
 */
export interface RectangleSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

}

/**
 * Interface for a class CircleSettings
 */
export interface CircleSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

}

/**
 * Interface for a class PolygonSettings
 */
export interface PolygonSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

}

/**
 * Interface for a class StampSettings
 */
export interface StampSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

    /**
     * specifies the modified date of the annotation.
     */
    modifiedDate?: string;

}

/**
 * Interface for a class CustomStampSettings
 */
export interface CustomStampSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

    /**
     * specifies the modified date of the annotation.
     */
    modifiedDate?: string;

    /**
     * specifies the width of the annotation.
     */
    width?: number;

    /**
     * specifies the height of the annotation.
     */
    height?: number;

    /**
     * specifies the left position of the annotation.
     */
    left?: number;

    /**
     * specifies the top position of the annotation.
     */
    top?: number;

    /**
     * Specifies to maintain the newly added custom stamp element in the menu items.
     */
    isAddToSubMenu?: boolean;

}

/**
 * Interface for a class DistanceSettings
 */
export interface DistanceSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle?: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadEndStyle?: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray?: number;

}

/**
 * Interface for a class PerimeterSettings
 */
export interface PerimeterSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle?: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadEndStyle?: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray?: number;

}

/**
 * Interface for a class AreaSettings
 */
export interface AreaSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

}

/**
 * Interface for a class RadiusSettings
 */
export interface RadiusSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

}

/**
 * Interface for a class VolumeSettings
 */
export interface VolumeSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

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

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

}

/**
 * Interface for a class StickyNotesSettings
 */
export interface StickyNotesSettingsModel {

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

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

}

/**
 * Interface for a class MeasurementSettings
 */
export interface MeasurementSettingsModel {

    /**
     * specifies the scale ratio of the annotation.
     */
    scaleRatio?: number;

    /**
     * specifies the unit of the annotation.
     */
    conversionUnit?: CalibrationUnit;

    /**
     * specifies the unit of the annotation.
     */
    displayUnit?: CalibrationUnit;

    /**
     * specifies the depth of the volume annotation.
     */
    depth?: number;

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
     * Specifies the state of the ContextMenu in the PDF document.
     * @default RightClick
     */
    contextMenuOption?: ContextMenuAction;

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
     * Enable or disables the Pinch zoom of PdfViewer.
     * @default true
     */
    enablePinchZoom?: boolean;

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
     * Enable or disables the shape annotation in the PdfViewer.
     * @default true
     */
    enableShapeAnnotation?: boolean;

    /**
     * Enable or disables the calibrate annotation in the PdfViewer.
     * @default true
     */
    enableMeasureAnnotation?: boolean;

    /**
     * Enables and disables the stamp annotations when the PDF viewer control is loaded initially.
     * @default true
     */
    enableStampAnnotations?: boolean;

    /**
     * Enables and disables the stickyNotes annotations when the PDF viewer control is loaded initially.
     * @default true
     */
    enableStickyNotesAnnotation?: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     * @default false
     */
    enableAnnotationToolbar?: boolean;

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
     * Defines the stamp items of the PdfViewer.
     */
    // tslint:disable-next-line:max-line-length

    customStampItems?: CustomStampItemModel[];

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
     * Defines the settings of line annotation.
     */
    // tslint:disable-next-line:max-line-length
    lineSettings?: LineSettingsModel;

    /**
     * Defines the settings of arrow annotation.
     */
    // tslint:disable-next-line:max-line-length
    arrowSettings?: ArrowSettingsModel;

    /**
     * Defines the settings of rectangle annotation.
     */
    // tslint:disable-next-line:max-line-length
    rectangleSettings?: RectangleSettingsModel;

    /**
     * Defines the settings of circle annotation.
     */
    // tslint:disable-next-line:max-line-length
    circleSettings?: CircleSettingsModel;

    /**
     * Defines the settings of polygon annotation.
     */
    // tslint:disable-next-line:max-line-length
    polygonSettings?: PolygonSettingsModel;

    /**
     * Defines the settings of stamp annotation.
     */
    // tslint:disable-next-line:max-line-length
    stampSettings?: StampSettingsModel;

    /**
     * Defines the settings of customStamp annotation.
     */
    // tslint:disable-next-line:max-line-length
    customStampSettings?: CustomStampSettingsModel;

    /**
     * Defines the settings of distance annotation.
     */
    // tslint:disable-next-line:max-line-length
    distanceSettings?: DistanceSettingsModel;

    /**
     * Defines the settings of perimeter annotation.
     */
    // tslint:disable-next-line:max-line-length
    perimeterSettings?: PerimeterSettingsModel;

    /**
     * Defines the settings of area annotation.
     */
    // tslint:disable-next-line:max-line-length
    areaSettings?: AreaSettingsModel;

    /**
     * Defines the settings of radius annotation.
     */
    // tslint:disable-next-line:max-line-length
    radiusSettings?: RadiusSettingsModel;

    /**
     * Defines the settings of volume annotation.
     */
    // tslint:disable-next-line:max-line-length
    volumeSettings?: VolumeSettingsModel;

    /**
     * Defines the settings of stickyNotes annotation.
     */
    stickyNotesSettings?: StickyNotesSettingsModel;

    /**
     * Defines the settings of measurement annotation.
     */
    measurementSettings?: MeasurementSettingsModel;

    /**
     * Defines the collection of selected items, size and position of the selector
     * @default {}
     */
    selectedItems?: SelectorModel;

    /**
     * Triggers while loading document into PdfViewer.
     * @event
     * @blazorProperty 'DocumentLoaded'
     */
    documentLoad?: EmitType<LoadEventArgs>;

    /**
     * Triggers while close the document
     * @event
     * @blazorProperty 'DocumentUnloaded'
     */
    documentUnload?: EmitType<UnloadEventArgs>;

    /**
     * Triggers while loading document got failed in PdfViewer.
     * @event
     * @blazorProperty 'DocumentLoadFailed'
     */
    documentLoadFailed?: EmitType<LoadFailedEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     * @blazorProperty 'AjaxRequestFailed'
     */
    ajaxRequestFailed?: EmitType<AjaxRequestFailureEventArgs>;

    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     * @event
     * @blazorProperty 'OnPageClick'
     */
    pageClick?: EmitType<PageClickEventArgs>;

    /**
     * Triggers when there is change in current page number.
     * @event
     * @blazorProperty 'PageChanged'
     */
    pageChange?: EmitType<PageChangeEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is clicked
     * @event
     * @blazorProperty 'OnHyperlinkClick'
     */
    hyperlinkClick?: EmitType<HyperlinkClickEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is hovered
     * @event
     * @blazorProperty 'OnHyperlinkMouseOver'
     */
    hyperlinkMouseOver?: EmitType<HyperlinkMouseOverArgs>;

    /**
     * Triggers when there is change in the magnification value.
     * @event
     * @blazorProperty 'ZoomChanged'
     */
    zoomChange?: EmitType<ZoomChangeEventArgs>;

    /**
     * Triggers when an annotation is added over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationAdded'
     */
    annotationAdd?: EmitType<AnnotationAddEventArgs>;

    /**
     * Triggers when an annotation is removed from the page of the PDF document.
     * @event 
     * @blazorProperty 'AnnotationRemoved'
     */
    annotationRemove?: EmitType<AnnotationRemoveEventArgs>;

    /**
     * Triggers when the property of the annotation is changed in the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationPropertiesChanged'
     */
    annotationPropertiesChange?: EmitType<AnnotationPropertiesChangeEventArgs>;

    /**
     * Triggers when an annotation is resized over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationResized'
     */
    annotationResize?: EmitType<AnnotationResizeEventArgs>;

    /**
     * Triggers when an annotation is selected over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationSelected'
     */
    annotationSelect?: EmitType<AnnotationSelectEventArgs>;

    /**
     * Triggers when the property of the annotation is changed in the page of the PDF document.
     * @event
     */
    annotations?: PdfAnnotationBaseModel[];

    /**
     * tool denots the current tool
     * @event
     * @private
     */
    tool?: string;

    /**
     * the objects for drawing tool
     * @event
     * @private
     */
    drawingObject?: PdfAnnotationBaseModel;

}