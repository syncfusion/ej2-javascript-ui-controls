import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex } from '@syncfusion/ej2-base';import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType } from '@syncfusion/ej2-base';import { PdfViewerBase } from './index';import { Navigation } from './index';import { Magnification } from './index';import { Toolbar } from './index';import { ToolbarItem } from './index';import { LinkTarget, InteractionMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction, FontStyle, TextAlignment, AnnotationResizerShape, AnnotationResizerLocation, ZoomMode } from './base/types';import { Annotation } from './index';import { LinkAnnotation } from './index';import { ThumbnailView } from './index';import { BookmarkView } from './index';import { TextSelection } from './index';import { TextSearch } from './index';import { FormFields } from './index';import { Print, CalibrationUnit } from './index';import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs, ImportStartEventArgs, ImportSuccessEventArgs, ImportFailureEventArgs, ExportStartEventArgs, ExportSuccessEventArgs, ExportFailureEventArgs, AjaxRequestInitiateEventArgs } from './index';import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs, AnnotationMoveEventArgs, AnnotationDoubleClickEventArgs, AnnotationMouseoverEventArgs } from './index';import { TextSelectionStartEventArgs, TextSelectionEndEventArgs, DownloadStartEventArgs, DownloadEndEventArgs } from './index';import { PdfAnnotationBase, ZOrderPageTable } from '../diagram/pdf-annotation';import { PdfAnnotationBaseModel } from '../diagram/pdf-annotation-model';import { Drawing, ClipBoardObject } from '../diagram/drawing';import { Selector } from '../diagram/selector';import { SelectorModel } from '../diagram/selector-model';import { PointModel, IElement, Rect } from '@syncfusion/ej2-drawings';import { renderAdornerLayer } from '../diagram/dom-util';import { ThumbnailClickEventArgs } from './index';import { ValidateFormFieldsArgs } from './base';
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

    /**
     * set the ajax credentials for the pdfviewer.
     */
    withCredentials?: boolean;

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

    /**
     * specifies the imports action of PdfViewer.
     */
    importFormFields?: string;

    /**
     * specifies the export action of PdfViewer.
     */
    exportFormFields?: string;

    /**
     * specifies the export action of PdfViewer.
     */
    renderTexts?: string;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

}

/**
 * Interface for a class ShapeLabelSettings
 */
export interface ShapeLabelSettingsModel {

    /**
     * specifies the opacity of the label.
     */
    opacity?: number;

    /**
     * specifies the fill color of the label.
     */
    fillColor?: string;

    /**
     * specifies the border color of the label.
     */
    fontColor?: string;

    /**
     * specifies the font size of the label.
     */
    fontSize?: number;

    /**
     * specifies the max-width of the label.
     */
    fontFamily?: string;

    /**
     * specifies the default content of the label.
     */
    labelContent?: string;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

    /**
     * specifies the leader length of the annotation.
     */
    leaderLength?: number;

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

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

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

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

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

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

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

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

    /**
     * specifies the lock action of the annotation.
     */
    isLock?: boolean;

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
 * Interface for a class FreeTextSettings
 */
export interface FreeTextSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the border color of the annotation.
     */
    borderColor?: string;

    /**
     * specifies the border with of the annotation.
     */
    borderWidth?: number;

    /**
     * specifies the border style of the annotation.
     */
    borderStyle?: string;

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
     * specifies the background fill color of the annotation.
     */
    fillColor?: string;

    /**
     * specifies the text box font size of the annotation.
     */
    fontSize?: number;

    /**
     * specifies the width of the annotation.
     */
    width?: number;

    /**
     * specifies the height of the annotation.
     */
    height?: number;

    /**
     * specifies the text box font color of the annotation.
     */
    fontColor?: string;

    /**
     * specifies the text box font family of the annotation.
     */
    fontFamily?: string;

    /**
     * setting the default text for annotation.
     */
    defaultText?: string;

    /**
     * applying the font styles for the text.
     */
    fontStyle?: FontStyle;

    /**
     * Aligning the text in the annotation.
     */
    textAlignment?: TextAlignment;

    /**
     * specifies the allow text only action of the free text annotation.
     */
    allowTextOnly?: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

}

/**
 * Interface for a class AnnotationSelectorSettings
 */
export interface AnnotationSelectorSettingsModel {

    /**
     * Specifies the selection border color.
     */
    selectionBorderColor?: string;

    /**
     * Specifies the border color of the resizer.
     * @ignore
     */
    resizerBorderColor?: string;

    /**
     * Specifies the fill color of the resizer.
     * @ignore
     */
    resizerFillColor?: string;

    /**
     * Specifies the size of the resizer.
     * @ignore
     */
    resizerSize?: number;

    /**
     * Specifies the thickness of the border of selection.
     */
    selectionBorderThickness?: number;

    /**
     * Specifies the shape of the resizer.
     */
    resizerShape?: AnnotationResizerShape;

    /**
     * Specifies the border dash array of the selection.
     */
    selectorLineDashArray?: number[];

    /**
     * Specifies the location of the resizer.
     */
    resizerLocation?: AnnotationResizerLocation;

}

/**
 * Interface for a class TextSearchColorSettings
 */
export interface TextSearchColorSettingsModel {

    /**
     * Sets the color of the current occurrence of the text searched string.
     */
    currentOccurrence?: string;

    /**
     * Sets the color of the other occurrence of the text searched string.
     */
    otherOccurrence?: string;

}

/**
 * Interface for a class HandWrittenSignatureSettings
 */
export interface HandWrittenSignatureSettingsModel {

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor?: string;

    /**
     * specified the thickness of the annotation.
     */
    thickness?: number;

    /**
     * specified the width of the annotation.
     */
    width?: number;

    /**
     * specified the height of the annotation.
     */
    height?: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

}

/**
 * Interface for a class AnnotationSettings
 */
export interface AnnotationSettingsModel {

    /**
     * specifies the author of the annotation.
     */
    author?: string;

    /**
     * specifies the minHeight of the annotation.
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * specifies whether the annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies whether the annotations are included or not in download actions.
     */
    isDownload?: boolean;

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
     * Gets or sets the download file name in the PdfViewer control.
     */
    downloadFileName?: string;

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
     * Specifies the retry count for the failed requests.
     * @default 1
     */
    retryCount?: number;

    /**
     * If it is set as false then error message box is not displayed in PDF viewer control.
     * @default true
     */
    showNotificationDialog?: boolean;

    /**
     * Enable or disables the Navigation toolbar of PdfViewer.
     * @default true
     */
    enableNavigationToolbar?: boolean;

    /**
     * Enable or disables the Comment Panel of PdfViewer.
     * @default true
     */
    enableCommentPanel?: boolean;

    /**
     * If it set as true, then the command panel show at initial document loading in the PDF viewer
     * @default false
     */
    isCommandPanelOpen?: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    enableTextMarkupResizer?: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     * @default false
     */
    enableMultiPageAnnotation?: boolean;

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
     * If it set as true, then the thumbnail view show at initial document loading in the PDF viewer
     * @default false
     */
    isThumbnailViewOpen?: boolean;

    /**
     * Enables or disable saving Hand Written signature as editable in the PDF.
     * @default false
     */
    isSignatureEditable?: boolean;

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
     * Enables or disables the handwritten signature in PDF document.
     * @default true
     */
    enableHandwrittenSignature?: boolean;

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
     * Enable or disables the Label for shapeAnnotations of PdfViewer.
     * @default false
     */
    enableShapeLabel?: boolean;

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
     * Enable or disable the form fields in the Pdfviewer.
     * @default true
     */
    enableFormFields?: boolean;

    /**
     * Enable or disable the form fields validation.
     * @default false
     */
    enableFormFieldsValidation?: boolean;

    /**
     * Enable or disable the free text annotation in the Pdfviewer.
     * @default true
     */
    enableFreeText?: boolean;

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
     * Specifies the rendering mode in the PDF Viewer.
     * @default Default
     */
    zoomMode?: ZoomMode;

    /**
     * Enable or disables the get the document text collections.
     * @default false
     */
    isExtractText?: boolean;

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
    // tslint:disable-next-line:max-line-length
    highlightSettings?: HighlightSettingsModel;

    /**
     * Defines the settings of strikethrough annotation.
     */
    // tslint:disable-next-line:max-line-length
    strikethroughSettings?: StrikethroughSettingsModel;

    /**
     * Defines the settings of underline annotation.
     */
    // tslint:disable-next-line:max-line-length
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
     * Defines the settings of shape label.
     */
    // tslint:disable-next-line:max-line-length
    shapeLabelSettings?: ShapeLabelSettingsModel;

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
    // tslint:disable-next-line:max-line-length
    stickyNotesSettings?: StickyNotesSettingsModel;

    /**
     * Defines the settings of free text annotation.
     */
    // tslint:disable-next-line:max-line-length
    freeTextSettings?: FreeTextSettingsModel;

    /**
     * Defines the settings of measurement annotation.
     */
    measurementSettings?: MeasurementSettingsModel;

    /**
     * Defines the settings of annotation selector.
     */
    // tslint:disable-next-line:max-line-length
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * Sets the settings for the color of the text search highlight.
     */
    textSearchColorSettings?: TextSearchColorSettingsModel;

    /**
     * Defines the settings of handWrittenSignature.
     */
    // tslint:disable-next-line:max-line-length
    handWrittenSignatureSettings?: HandWrittenSignatureSettingsModel;

    /**
     * Defines the settings of the annotations.
     */
    // tslint:disable-next-line:max-line-length
    annotationSettings?: AnnotationSettingsModel;

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
     * Triggers when validation is failed.
     * @event
     * @blazorProperty 'validateFormFields'
     */
    validateFormFields?: EmitType<ValidateFormFieldsArgs>;

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
     * Triggers an event when the annotation is double click.
     * @event
     * @blazorProperty 'OnAnnotationDoubleClick'
     */
    annotationDoubleClick?: EmitType<AnnotationDoubleClickEventArgs>;

    /**
     * Triggers when an annotation is moved over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationMoved'
     */
    annotationMove?: EmitType<AnnotationMoveEventArgs>;

    /**
     * Triggers when mouse over the annotation object.
     * @event
     */
    annotationMouseover?: EmitType<AnnotationMouseoverEventArgs>;

    /**
     * Triggers when an imported annotations started in the PDF document.
     * @event
     * @blazorProperty 'ImportStarted'
     */
    importStart?: EmitType<ImportStartEventArgs>;

    /**
     * Triggers when an exported annotations started in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportStarted'
     */
    exportStart?: EmitType<ExportStartEventArgs>;

    /**
     * Triggers when an imports annotations succeed in the PDF document.
     * @event
     * @blazorProperty 'ImportSucceed'
     */
    importSuccess?: EmitType<ImportSuccessEventArgs>;

    /**
     * Triggers when an export annotations succeed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportSucceed'
     */
    exportSuccess?: EmitType<ExportSuccessEventArgs>;

    /**
     * Triggers when an imports annotations failed in the PDF document.
     * @event
     * @blazorProperty 'ImportFailed'
     */
    importFailed?: EmitType<ImportFailureEventArgs>;

    /**
     * Triggers when an export annotations failed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportFailed'
     */
    exportFailed?: EmitType<ExportFailureEventArgs>;

    /**
     * Triggers an event when the thumbnail is clicked in the thumbnail panel of PDF Viewer.
     * @event
     * @blazorProperty 'OnThumbnailClick'
     */
    thumbnailClick?: EmitType<ThumbnailClickEventArgs>;

    /**
     * Triggers an event when the text selection is started.
     * @event
     * @blazorProperty 'OnTextSelectionStart'
     */
    textSelectionStart?: EmitType<TextSelectionStartEventArgs>;

    /**
     * Triggers an event when the text selection is finished.
     * @event
     * @blazorProperty 'OnTextSelectionEnd'
     */
    textSelectionEnd?: EmitType<TextSelectionEndEventArgs>;

    /**
     * Triggers an event when the download action is started.
     * @event
     * @blazorProperty 'DownloadStart'
     */
    downloadStart?: EmitType<DownloadStartEventArgs>;

    /**
     * Triggers an event when the download actions is finished.
     * @event
     * @blazorProperty 'DownloadEnd'
     */
    downloadEnd?: EmitType<DownloadEndEventArgs>;

    /**
     * Triggers before the data send in to the server.
     * @event
     * @deprecated
     */
    ajaxRequestInitiate?: EmitType<AjaxRequestInitiateEventArgs>;

    /**
     * PDF document annotation collection.
     * @private
     * @deprecated
     */
    annotations?: PdfAnnotationBaseModel[];

    /**
     * store the drawing objects.
     * @private
     * @deprecated
     */
    drawingObject?: PdfAnnotationBaseModel;

}