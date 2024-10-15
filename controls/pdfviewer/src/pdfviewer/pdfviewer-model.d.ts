import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex, isBlazor, Browser } from '@syncfusion/ej2-base';import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { IAnnotationPoint, IPoint, PdfViewerBase, PdfiumRunner, TextMarkupAnnotation } from './index';import { Navigation } from './index';import { Magnification } from './index';import { Toolbar } from './index';import { ToolbarItem } from './index';import { PdfRenderer } from './index';import { LinkTarget, InteractionMode, SignatureFitMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction, FontStyle, TextAlignment, AnnotationResizerShape, AnnotationResizerLocation, ZoomMode, PrintMode, CursorType, ContextMenuItem, DynamicStampItem, SignStampItem, StandardBusinessStampItem, FormFieldType, AllowedInteraction, AnnotationDataFormat, SignatureType, CommentStatus, SignatureItem, FormDesignerToolbarItem, DisplayMode, Visibility, FormFieldDataFormat, PdfKeys, ModifierKeys } from './base/types';import { Annotation } from './index';import { LinkAnnotation } from './index';import { ThumbnailView } from './index';import { BookmarkView } from './index';import { TextSelection } from './index';import { TextSearch } from './index';import { AccessibilityTags } from './index';import { FormFields } from './index';import { FormDesigner } from './index';import { Print, CalibrationUnit } from './index';import { PageOrganizer } from './index';import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs, ImportStartEventArgs, ImportSuccessEventArgs, ImportFailureEventArgs, ExportStartEventArgs, ExportSuccessEventArgs, ExportFailureEventArgs, AjaxRequestInitiateEventArgs, PageRenderInitiateEventArgs, AjaxRequestSuccessEventArgs, PageRenderCompleteEventArgs, PageOrganizerSaveAsEventArgs } from './index';import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs, AnnotationMoveEventArgs, AnnotationDoubleClickEventArgs, AnnotationMouseoverEventArgs, PageMouseoverEventArgs, AnnotationMouseLeaveEventArgs , ButtonFieldClickEventArgs} from './index';import { TextSelectionStartEventArgs, TextSelectionEndEventArgs, DownloadStartEventArgs, DownloadEndEventArgs, ExtractTextCompletedEventArgs, PrintStartEventArgs, PrintEndEventArgs } from './index';import { TextSearchStartEventArgs, TextSearchCompleteEventArgs, TextSearchHighlightEventArgs } from './index';import { CustomContextMenuSelectEventArgs, CustomContextMenuBeforeOpenEventArgs } from './index';import { PdfAnnotationBase, PdfFormFieldBase, ZOrderPageTable } from './drawing/pdf-annotation';import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './drawing/pdf-annotation-model';import { Drawing, ClipBoardObject } from './drawing/drawing';import { Selector } from './drawing/selector';import { SelectorModel } from './drawing/selector-model';import { PointModel, IElement, Rect, Point, Size } from '@syncfusion/ej2-drawings';import { renderAdornerLayer } from './drawing/dom-util';import { ThumbnailClickEventArgs } from './index';import { ValidateFormFieldsArgs, BookmarkClickEventArgs, AnnotationUnSelectEventArgs, BeforeAddFreeTextEventArgs, FormFieldFocusOutEventArgs, CommentEventArgs, FormFieldClickArgs, FormFieldAddArgs, FormFieldRemoveArgs, FormFieldPropertiesChangeArgs, FormFieldMouseLeaveArgs, FormFieldMouseoverArgs, FormFieldMoveArgs, FormFieldResizeArgs, FormFieldSelectArgs, FormFieldUnselectArgs, FormFieldDoubleClickArgs, AnnotationMovingEventArgs, KeyboardCustomCommandsEventArgs, ISize } from './base';import { AddSignatureEventArgs, RemoveSignatureEventArgs, MoveSignatureEventArgs, SignaturePropertiesChangeEventArgs, ResizeSignatureEventArgs, SignatureSelectEventArgs, SignatureUnselectEventArgs } from './base';import { IFormField, IFormFieldBound } from './form-designer/form-designer';import { ClickEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import {IAjaxHeaders,IPdfRectBounds} from "./pdfviewer";
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
    toolbarItems?: (CustomToolbarItemModel | ToolbarItem)[];

    /**
     * Provide option to customize the annotation toolbar of the PDF Viewer.
     */
    annotationToolbarItems?: AnnotationToolbarItem[];

    /**
     * Customize the tools to be exposed in the form designer toolbar.
     */
    formDesignerToolbarItems?: FormDesignerToolbarItem[];

}

/**
 * Interface for a class CustomToolbarItem
 */
export interface CustomToolbarItemModel {

    /**
     * Defines single/multiple classes separated by space used to specify an icon for the button.
     * The icon will be positioned before the text content if text is available, otherwise the icon alone will be rendered.
     */
    prefixIcon?: string;

    /**
     * Specifies the text to be displayed on the Toolbar button.
     */
    tooltipText?: string;

    /**
     * Specifies the unique ID to be used with button or input element of Toolbar items.
     */
    id?: string;

    /**
     * Specifies the text to be displayed on the Toolbar button.
     */
    text?: string;

    /**
     * Defines single/multiple classes (separated by space) to be used for customization of commands.
     */
    cssClass?: string;

    /**
     * Define which side(right/left) to use for customizing the icon.
     */
    align?: string;

    /**
     * Specifies the HTML element/element ID as a string that can be added as a Toolbar command.
     */
    template?: string | object | Function;

    /**
     * Specify the type or category of the Toolbar item.
     */
    type?: string;

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
 * Interface for a class CustomStamp
 */
export interface CustomStampModel {

    /**
     * Defines the custom stamp name to be added in stamp menu of the PDF Viewer toolbar.
     */
    customStampName?: string;

    /**
     * Defines the custom stamp images source to be added in stamp menu of the PDF Viewer toolbar.
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
 * Interface for a class FormDesignerToolbarSettings
 */
export interface FormDesignerToolbarSettingsModel {

    /**
     * Enable or disables the tooltip of the toolbar.
     */
    showTooltip?: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    formDesignerToolbarItem?: FormDesignerToolbarItem[];

}

/**
 * Interface for a class SignatureFieldSettings
 */
export interface SignatureFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    name?: string;

    /**
     * Specifies whether the signature field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * Get or set the boolean value to print the signature field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the thickness of the Signature field. Default value is 1. To hide the borders, set the value to 0 (zero).
     */
    thickness?: number;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Specifies the properties of the signature Dialog Settings in the signature field.
     */
    signatureDialogSettings?: SignatureDialogSettingsModel;

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    signatureIndicatorSettings?: SignatureIndicatorSettingsModel;

    /**
     * specifies the custom data of the form fields.
     */
    customData?: object;

    /**
     * Allows setting the font name for typed signatures at specific indices. The maximum number of font names is limited to 4, so the key values should range from 0 to 3.
     */
    typeSignatureFonts?: { [key: number]: string };

}

/**
 * Interface for a class InitialFieldSettings
 */
export interface InitialFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    name?: string;

    /**
     * Specifies whether the initial field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * Get or set the boolean value to print the initial field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the thickness of the Initial field. Default value is 1. To hide the borders, set the value to 0 (zero).
     */
    thickness?: number;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Gets or sets the initial field type of the signature field.
     */
    isInitialField?: boolean;

    /**
     * Get or set the signature dialog settings for initial field.
     */
    initialDialogSettings?: SignatureDialogSettingsModel;

    /**
     * Specifies the properties of the signature indicator in the initial field.
     */
    initialIndicatorSettings?: SignatureIndicatorSettingsModel;

    /**
     * specifies the custom data of the form fields.
     */
    customData?: object;

    /**
     * Allows setting the font name for typed initials at specific indices. The maximum number of font names is limited to 4, so the key values should range from 0 to 3.
     */
    typeInitialFonts?: { [key: number]: string };

}

/**
 * Interface for a class SignatureIndicatorSettings
 */
export interface SignatureIndicatorSettingsModel {

    /**
     * Specifies the opacity of the signature indicator.
     */
    opacity?: number;

    /**
     * Specifies the color of the signature indicator.
     */
    backgroundColor?: string;

    /**
     * Specifies the width of the signature indicator. Maximum width is half the width of the signature field.
     * Minimum width is the default value.
     */
    width?: number;

    /**
     * Specifies the height of the signature indicator. Maximum height is half the height of the signature field.
     * Minimum height is the default value.
     */
    height?: number;

    /**
     * Specifies the signature Indicator's font size. The maximum size of the font is half the height of the signature field.
     */
    fontSize?: number;

    /**
     * Specifies the text of the signature Indicator.
     */
    text?: string;

    /**
     * Specifies the color of the text of signature indicator.
     */
    color?: string;

}

/**
 * Interface for a class SignatureDialogSettings
 */
export interface SignatureDialogSettingsModel {

    /**
     * Get or set the required signature options will be enabled in the signature dialog.
     */
    displayMode?: DisplayMode;

    /**
     * Get or set a boolean value to show or hide the save signature check box option in the signature dialog. FALSE by default.
     */
    hideSaveSignature?: boolean;

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

    /**
     * Specifies the password validation action of PDF Viewer.
     */
    validatePassword?: string;

}

/**
 * Interface for a class StrikethroughSettings
 */
export interface StrikethroughSettingsModel {

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    enableMultiPageAnnotation?: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    enableTextMarkupResizer?: boolean;

    /**
     * Gets or sets the allowed interactions for the locked strikethrough annotations.
     * IsLock can be configured using strikethrough settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class UnderlineSettings
 */
export interface UnderlineSettingsModel {

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    enableMultiPageAnnotation?: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    enableTextMarkupResizer?: boolean;

    /**
     * Gets or sets the allowed interactions for the locked underline annotations.
     * IsLock can be configured using underline settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

    /**
     * specifies the locked action of the annotation.
     */
    isLock?: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    enableMultiPageAnnotation?: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    enableTextMarkupResizer?: boolean;

    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using highlight settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class LineSettings
 */
export interface LineSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using line settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class ArrowSettings
 */
export interface ArrowSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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
     * Gets or sets the allowed interactions for the locked arrow annotations.
     * IsLock can be configured using arrow settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class RectangleSettings
 */
export interface RectangleSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

    /**
     * specifies the width of the annotation.
     */
    width?: number;

    /**
     * specifies the height of the annotation.
     */
    height?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked rectangle annotations.
     * IsLock can be configured using rectangle settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class CircleSettings
 */
export interface CircleSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

    /**
     * specifies the width of the annotation.
     */
    width?: number;

    /**
     * specifies the height of the annotation.
     */
    height?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked circle annotations.
     * IsLock can be configured using circle settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

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

    /**
     * specifies the default content of the label.
     */
    notes?: string;

}

/**
 * Interface for a class PolygonSettings
 */
export interface PolygonSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked polygon annotations.
     * IsLock can be configured using polygon settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class StampSettings
 */
export interface StampSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

    /**
     * specifies the width of the annotation.
     */
    width?: number;

    /**
     * specifies the height of the annotation.
     */
    height?: number;

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

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
     * Provide option to define the required dynamic stamp items to be displayed in annotation toolbar menu.
     */
    dynamicStamps?: DynamicStampItem[];

    /**
     * Provide option to define the required sign stamp items to be displayed in annotation toolbar menu.
     */
    signStamps?: SignStampItem[];

    /**
     * Provide option to define the required standard business stamp items to be displayed in annotation toolbar menu.
     */
    standardBusinessStamps?: StandardBusinessStampItem[];

    /**
     * Gets or sets the allowed interactions for the locked stamp annotations.
     * IsLock can be configured using stamp settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class CustomStampSettings
 */
export interface CustomStampSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

    /**
     * specifies the opacity of the annotation.
     */
    opacity?: number;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

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
    isAddToMenu?: boolean;

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
     * Define the custom image path and it's name to be displayed in the menu items.
     */
    customStamps?: CustomStampModel[];

    /**
     * If it is set as false. then the custom stamp items won't be visible in the annotation toolbar stamp menu items.
     */
    enableCustomStamp?: boolean;

    /**
     * Gets or sets the allowed interactions for the locked custom stamp annotations.
     * IsLock can be configured using custom stamp settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class DistanceSettings
 */
export interface DistanceSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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

    /**
     * Defines the cursor type for distance annotation.
     */
    resizeCursorType?: CursorType;

    /**
     * Gets or sets the allowed interactions for the locked distance annotations.
     * IsLock can be configured using distance settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class PerimeterSettings
 */
export interface PerimeterSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked perimeter annotations.
     * IsLock can be configured using perimeter settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class AreaSettings
 */
export interface AreaSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked area annotations.
     * IsLock can be configured using area settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class RadiusSettings
 */
export interface RadiusSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

    /**
     * specifies the width of the annotation.
     */
    width?: number;

    /**
     * specifies the height of the annotation.
     */
    height?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked radius annotations.
     * IsLock can be configured using area settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class VolumeSettings
 */
export interface VolumeSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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

    /**
     * Gets or sets the allowed interactions for the locked volume annotations.
     * IsLock can be configured using volume settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class InkAnnotationSettings
 */
export interface InkAnnotationSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

    /**
     * specifies the width of the annotation.
     */
    width?: number;

    /**
     * specifies the height of the annotation.
     */
    height?: number;

    /**
     * Gets or sets the path of the ink annotation.
     */
    path?: string;

    /**
     * Sets the opacity value for ink annotation.By default value is 1. It range varies from 0 to 1.
     */
    opacity?: number;

    /**
     * Sets the stroke color for ink annotation.By default values is #FF0000.
     */
    strokeColor?: string;

    /**
     * Sets the thickness for the ink annotation. By default value is 1. It range varies from 1 to 10.
     */
    thickness?: number;

    /**
     * Define the default option to customize the selector for ink annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * If it is set as true, can't interact with annotation. Otherwise can interact the annotations. By default it is false.
     */
    isLock?: boolean;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

    /**
     * Gets or sets the allowed interactions for the locked ink annotations.
     * IsLock can be configured using ink settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies the custom data of the annotation
     */
    customData?: object;

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class StickyNotesSettings
 */
export interface StickyNotesSettingsModel {

    /**
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

    /**
     * specifies the author of the annotation.
     */
    author?: string;

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

    /**
     * Gets or sets the allowed interactions for the locked sticky notes annotations.
     * IsLock can be configured using sticky notes settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

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
     * Get or set offset of the annotation.
     */
    offset?: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    pageNumber?: number;

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
    allowEditTextOnly?: boolean;

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
     * Gets or sets the allowed interactions for the locked free text annotations.
     * IsLock can be configured using free text settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * Allow to edit the FreeText annotation. FALSE, by default.
     */
    isReadonly?: boolean;

    /**
     * Enable or disable auto fit mode for FreeText annotation in the Pdfviewer. FALSE by default.
     */
    enableAutoFit?: boolean;

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

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
     *
     * @ignore
     */
    resizerBorderColor?: string;

    /**
     * Specifies the fill color of the resizer.
     *
     * @ignore
     */
    resizerFillColor?: string;

    /**
     * Specifies the size of the resizer.
     *
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

    /**
     * specifies the cursor type of resizer
     */
    resizerCursorType?: CursorType;

}

/**
 * Interface for a class TextSearchColorSettings
 */
export interface TextSearchColorSettingsModel {

    /**
     * Gets or Sets the color of the current occurrence of the text searched string.
     */
    searchHighlightColor?: string;

    /**
     * Gets or Sets the color of the other occurrence of the text searched string.
     */
    searchColor?: string;

}

/**
 * Interface for a class PageData
 */
export interface PageDataModel {

    /**
     * The 0-based index of the page.
     */
    pageIndex?: number;

    /**
     * The width of the page in points.
     */
    width?: number;

    /**
     * The height of the page in points.
     */
    height?: number;

    /**
     * The rotation angle of the page in degrees.
     */
    rotation?: number;

    /**
     * The current zoom factor.
     */
    zoomFactor?: number;

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
     * Gets or sets the save signature limit of the signature. By default value is 1 and maximum limit is 5.
     */
    saveSignatureLimit?: number;

    /**
     * Gets or sets the save initial limit of the initial. By default value is 1 and maximum limit is 5.
     */
    saveInitialLimit?: number;

    /**
     * Provide option to define the required signature items to be displayed in signature menu.
     */
    signatureItem?: SignatureItem[];

    /**
     * Options to set the type signature font name with respective index and maximum font name limit is 4 so key value should be 0 to 3.
     */
    typeSignatureFonts?: { [key: number]: string };

    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * Get or set the Signature DialogSettings for Handwritten signature.
     */
    signatureDialogSettings?: SignatureDialogSettingsModel;

    /**
     * Get or set the initialDialogSettings for Handwritten initial.
     */
    initialDialogSettings?: SignatureDialogSettingsModel;

    /**
     * Gets or sets the signature offset.
     *
     * @default {x:0,y:0}
     */
    offset?: IPoint;

    /**
     * Gets or sets the signature page number.
     *
     * @default 1
     */
    pageNumber?: number;

    /**
     * Gets or sets the path of the signature.
     *
     * @default ''
     */
    path?: string;

    /**
     * Gets or sets the font family for text signature.
     *
     * @default 'Helvetica'
     */
    fontFamily?: string;

    /**
     * Allows saving of programmatically added signatures.
     *
     * @default false
     */
    canSave?: boolean;

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
    skipPrint?: boolean;

    /**
     * specifies whether the annotations are included or not in download actions.
     */
    skipDownload?: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

    /**
     * Gets or sets the allowed interactions for the locked annotations.
     * IsLock can be configured using annotation settings.
     *
     * @default ['None']
     */
    allowedInteractions?: AllowedInteraction[];

    /**
     * specifies the subject of the annotation.
     */
    subject?: string;

}

/**
 * Interface for a class DocumentTextCollectionSettings
 */
export interface DocumentTextCollectionSettingsModel {

    /**
     * specifies the text data of the document.
     */
    textData?: TextDataSettingsModel[];

    /**
     * specifies the page text of the document.
     */
    pageText?: string;

    /**
     * specifies the page size of the document.
     */
    pageSize?: number;

}

/**
 * Interface for a class TextDataSettings
 */
export interface TextDataSettingsModel {

    /**
     * specifies the bounds of the rectangle.
     */
    bounds?: RectangleBoundsModel;

    /**
     * specifies the text of the document.
     */
    text?: string;

}

/**
 * Interface for a class RectangleBounds
 */
export interface RectangleBoundsModel {

    /**
     * specifies the size of the rectangle.
     */
    size?: number;

    /**
     * specifies the x co-ordinate of the upper-left corner of the rectangle.
     */
    x?: number;

    /**
     * specifies the y co-ordinate of the upper-left corner of the rectangle.
     */
    y?: number;

    /**
     * specifies the width of the rectangle.
     */
    width?: number;

    /**
     * specifies the height of the rectangle.
     */
    height?: number;

    /**
     * specifies the left value of the rectangle.
     */
    left?: number;

    /**
     * specifies the top value of the rectangle.
     */
    top?: number;

    /**
     * specifies the right of the rectangle.
     */
    right?: number;

    /**
     * specifies the bottom value of the rectangle.
     */
    bottom?: number;

    /**
     * Returns true if height and width of the rectangle is zero.
     *
     * @default 'false'
     */
    isEmpty?: boolean;

}

/**
 * Interface for a class TileRenderingSettings
 */
export interface TileRenderingSettingsModel {

    /**
     * Enable or disables tile rendering mode in the PDF Viewer.
     */
    enableTileRendering?: boolean;

    /**
     * specifies the tileX count of the render Page.
     */
    x?: number;

    /**
     * specifies the tileY count of the render Page.
     */
    y?: number;

}

/**
 * Interface for a class ScrollSettings
 */
export interface ScrollSettingsModel {

    /**
     * Increase or decrease the delay time.
     */
    delayPageRequestTimeOnScroll?: number;

}

/**
 * Interface for a class FormField
 */
export interface FormFieldModel {

    /**
     * Gets the name of the form field.
     */
    name?: string;

    /**
     * Specifies whether the check box is in checked state or not.
     */
    isChecked?: boolean;

    /**
     * Specifies whether the radio button is in checked state or not.
     */
    isSelected?: boolean;

    /**
     * Gets the id of the form field.
     */
    id?: string;

    /**
     * Gets or sets the value of the form field.
     */
    value?: string;

    /**
     * Gets the type of the form field.
     */
    type?: FormFieldType;

    /**
     * If it is set as true, can't edit the form field in the PDF document. By default it is false.
     */
    isReadOnly?: boolean;

    /**
     * specifies the type of the signature.
     */
    signatureType?: SignatureType[];

    /**
     * specifies the fontName of the signature.
     */
    fontName?: string;

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the font family of the form field.
     */
    fontFamily?: string;

    /**
     * Get or set the font size of the form field.
     */
    fontSize?: number;

    /**
     * Get or set the font Style of form field.
     */
    fontStyle?: FontStyle;

    /**
     * Get or set the font color of the form field in hexadecimal string format.
     */
    color?: string;

    /**
     * Get or set the background color of the form field in hexadecimal string format.
     */
    backgroundColor?: string;

    /**
     * Get or set the text alignment of the form field.
     */
    alignment?: TextAlignment;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * Get or set the maximum character length.
     */
    maxLength?: number;

    /**
     * Gets or set the is Required of form field.
     */
    isRequired?: boolean;

    /**
     * Get or set the boolean value to print the form field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the form field items. This can be Dropdown items or Listbox items.
     */
    options?: ItemModel[];

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    signatureIndicatorSettings?: SignatureIndicatorSettingsModel;

    /**
     * Get or set the thickness of the form field.
     */
    thickness?: number;

    /**
     * Get or set the border color of the form field.
     */
    borderColor?: string;

    /**
     * Allows multiline input in the text field. FALSE, by default.
     */
    isMultiline?: boolean;

    /**
     * Meaningful only if the MaxLength property is set and the Multiline, Password properties are false.
     * If set, the field is automatically divided into as many equally spaced position, or  combs, as the value of MaxLength, and the text is laid out into the combs.
     *
     * @default false
     */
    insertSpaces?: boolean;

    /**
     * Get the pageIndex of the form field. Default value is -1.
     */
    pageIndex?: number;

    /**
     * Get the pageNumber of the form field. Default value is 1.
     */
    pageNumber?: number;

    /**
     * Get the isTransparent of the form field. Default value is false.
     */
    isTransparent?: boolean;

    /**
     * Get the rotateAngle of the form field. Default value is 0.
     */
    rotateAngle?: number;

    /**
     * Get the selectedIndex of the form field. Default value is null.
     */
    selectedIndex?: number[];

    /**
     * Get the zIndex of the form field. Default value is 0.
     */
    zIndex?: number;

    /**
     * specifies the custom data of the form field.
     */
    customData?: object;

}

/**
 * Interface for a class ContextMenuSettings
 */
export interface ContextMenuSettingsModel {

    /**
     * Defines the context menu action.
     *
     * @default RightClick
     */
    contextMenuAction?: ContextMenuAction;

    /**
     * Defines the context menu items should be visible in the PDF Viewer.
     *
     *  @default []
     */
    contextMenuItems?: ContextMenuItem[];

}

/**
 * Interface for a class TextFieldSettings
 */
export interface TextFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    name?: string;

    /**
     * Get or set the value of the form field.
     */
    value?: string;

    /**
     * Get or set the font family of the textbox field.
     */
    fontFamily?: string;

    /**
     * Get or set the font size of the textbox field.
     */
    fontSize?: number;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Get or set the font Style of textbox field.
     */
    fontStyle?: FontStyle;

    /**
     * Get or set the font color of the textbox in hexadecimal string format.
     */
    color?: string;

    /**
     * Get or set the background color of the textbox in hexadecimal string format.
     */
    backgroundColor?: string;

    /**
     * Get or set the alignment of the text.
     */
    alignment?: TextAlignment;

    /**
     * Specifies whether the textbox field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * Get or set the maximum character length.
     */
    maxLength?: number;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * Get or set the boolean value to print the textbox field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the thickness of the textbox field.
     */
    thickness?: number;

    /**
     * Get or set the border color of the textbox field.
     */
    borderColor?: string;

    /**
     * Allows multiline input in the text field. FALSE, by default.
     */
    isMultiline?: boolean;

    /**
     * specifies the custom data of the form fields.
     */
    customData?: object;

}

/**
 * Interface for a class PasswordFieldSettings
 */
export interface PasswordFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    name?: string;

    /**
     * Get or set the value of the form field.
     */
    value?: string;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Get or set the font family of the password field.
     */
    fontFamily?: string;

    /**
     * Get or set the font size of the password field.
     */
    fontSize?: number;

    /**
     * Get or set the font Style of password field.
     */
    fontStyle?: FontStyle;

    /**
     * Get or set the font color of the password field in hexadecimal string format.
     */
    color?: string;

    /**
     * Get or set the background color of the password field in hexadecimal string format.
     */
    backgroundColor?: string;

    /**
     * Get or set the alignment of the text.
     */
    alignment?: TextAlignment;

    /**
     * Specifies whether the password field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * Get or set the maximum character length.
     */
    maxLength?: number;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * Get or set the boolean value to print the password field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the thickness of the password field.
     */
    thickness?: number;

    /**
     * Get or set the border color of the password field.
     */
    borderColor?: string;

    /**
     * specifies the custom data of the form fields.
     */
    customData?: object;

}

/**
 * Interface for a class CheckBoxFieldSettings
 */
export interface CheckBoxFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the check box.
     */
    name?: string;

    /**
     * Get or set the value of the check box.
     */
    value?: string;

    /**
     * Specifies whether the check box is in checked state or not.
     */
    isChecked?: boolean;

    /**
     * Get or set the background color of the check box in hexadecimal string format.
     */
    backgroundColor?: string;

    /**
     * Specifies whether the check box field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * Get or set the boolean value to print the check box field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * Get or set the thickness of the check box field.
     */
    thickness?: number;

    /**
     * Get or set the border color of the check box field.
     */
    borderColor?: string;

    /**
     * specifies the custom data of the form fields.
     */
    customData?: object;

}

/**
 * Interface for a class RadioButtonFieldSettings
 */
export interface RadioButtonFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    name?: string;

    /**
     * Get or set the value of the form field element.
     */
    value?: string;

    /**
     * Specifies whether the radio button is in checked state or not.
     */
    isSelected?: boolean;

    /**
     * Get or set the background color of the radio button in hexadecimal string format.
     */
    backgroundColor?: string;

    /**
     * Specifies whether the radio button field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * Get or set the boolean value to print the radio button field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the thickness of the radio button field.
     */
    thickness?: number;

    /**
     * Get or set the border color of the radio button field.
     */
    borderColor?: string;

    /**
     * specifies the custom data of the form fields.
     */
    customData?: object;

}

/**
 * Interface for a class DropdownFieldSettings
 */
export interface DropdownFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the dropdown.
     */
    name?: string;

    /**
     * Get or set the value of the form field.
     */
    value?: string;

    /**
     * Get or set the font family of the dropdown field.
     */
    fontFamily?: string;

    /**
     * Get or set the font size of the dropdown field.
     */
    fontSize?: number;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Get or set the font style of dropdown field.
     */
    fontStyle?: FontStyle;

    /**
     * Get or set the font color of the dropdown in hexadecimal string format..
     */
    color?: string;

    /**
     * Get or set the background color of the dropdown in hexadecimal string format.
     */
    backgroundColor?: string;

    /**
     * Get or set the alignment of the text.
     */
    alignment?: TextAlignment;

    /**
     * Specifies whether the dropdown field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * Get or set the boolean value to print the dropdown field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the dropdown items.
     */
    options?: ItemModel[];

    /**
     * Get or set the thickness of the drop down field.
     */
    thickness?: number;

    /**
     * Get or set the border color of the drop down field.
     */
    borderColor?: string;

    /**
     * specifies the custom data of the form fields.
     */
    customData?: object;

}

/**
 * Interface for a class ListBoxFieldSettings
 */
export interface ListBoxFieldSettingsModel {

    /**
     * Get or set the form field bounds.
     */
    bounds?: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    name?: string;

    /**
     * Get or set the value of the form field.
     */
    value?: string;

    /**
     * Get or set the font family of the listbox field.
     */
    fontFamily?: string;

    /**
     * Get or set the font size of the listbox field.
     */
    fontSize?: number;

    /**
     * specifies the page number of the form field.
     */
    pageNumber?: number;

    /**
     * Get or set the font Style of listbox field.
     */
    fontStyle?: FontStyle;

    /**
     * Get or set the font color of the listbox in hexadecimal string format.
     */
    color?: string;

    /**
     * Get or set the background color of the listbox in hexadecimal string format.
     */
    backgroundColor?: string;

    /**
     * Get or set the alignment of the text.
     */
    alignment?: TextAlignment;

    /**
     * Specifies whether the listbox field is in read-only or read-write mode. FALSE by default.
     */
    isReadOnly?: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    visibility?: Visibility;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    isRequired?: boolean;

    /**
     * Get or set the boolean value to print the listbox field. TRUE by default.
     */
    isPrint?: boolean;

    /**
     * Get or set the text to be displayed as tool tip. By default it is empty.
     */
    tooltip?: string;

    /**
     * Get or set the listbox items.
     */
    options?: ItemModel[];

    /**
     * Get or set the thickness of the list box field.
     */
    thickness?: number;

    /**
     * Get or set the border color of the list box field.
     */
    borderColor?: string;

}

/**
 * Interface for a class Item
 */
export interface ItemModel {

    /**
     * Get or set the name.
     */
    itemName?: string;

    /**
     * Get or set the value.
     */
    itemValue?: string;

}

/**
 * Interface for a class KeyGesture
 */
export interface KeyGestureModel {

    /**
     * Defines a collection of keys commonly used in Pdf-related operations.
     * * none - no key
     * * N0 = The 0 key
     * * N1 = The 1 key
     * * N2 = The 2 key
     * * N3 = The 3 key
     * * N4 = The 4 key
     * * N5 = The 5 key
     * * N6 = The 6 key
     * * N7 = The 7 key
     * * N8 = The 8 key
     * * N9 = The 9 key
     * * Number0 = The 0 in number pad key
     * * Number1 = The 1 in number pad key
     * * Number2 = The 2 in number pad key
     * * Number3 = The 3 in number pad key
     * * Number4 = The 4 in number pad key
     * * Number5 = The 5 in number pad key
     * * Number6 = The 6 in number pad key
     * * Number7 = The 7 in number pad key
     * * Number8 = The 8 in number pad key
     * * Number9 = The 9 in number pad key
     * * BackSpace = The BackSpace key
     * * F1 = The f1 key
     * * F2 = The f2 key
     * * F3 = The f3 key
     * * F4 = The f4 key
     * * F5 = The f5 key
     * * F6 = The f6 key
     * * F7 = The f7 key
     * * F8 = The f8 key
     * * F9 = The f9 key
     * * F10 = The f10 key
     * * F11 = The f11 key
     * * F12 = The f12 key
     * * A = The a key
     * * B = The b key
     * * C = The c key
     * * D = The d key
     * * E = The e key
     * * F = The f key
     * * G = The g key
     * * H = The h key
     * * I = The i key
     * * J = The j key
     * * K = The k key
     * * L = The l key
     * * M = The m key
     * * N = The n key
     * * O = The o key
     * * P = The p key
     * * Q = The q key
     * * R = The r key
     * * S = The s key
     * * T = The t key
     * * U = The u key
     * * V = The v key
     * * W = The w key
     * * X = The x key
     * * Y = The y key
     * * Z = The z key
     * * Left = The left key
     * * Right = The right key
     * * Top = The top key
     * * Bottom = The bottom key
     * * Escape = The Escape key
     * * Tab = The tab key
     * * Delete = The delete key
     * * Enter = The enter key
     * * The Space key
     * * The page up key
     * * The page down key
     * * The end key
     * * The home key
     * * The Minus key
     * * The Plus key
     * * The Star key
     *
     * @aspDefaultValueIgnore
     * @aspNumberEnum
     * @default undefined
     */
    pdfKeys?: PdfKeys;

    /**
     * Specifies a combination of key modifiers, on recognition of which the command will be executed.
     * * None - no modifiers are pressed
     * * Control - ctrl key
     * * Meta - meta key im mac
     * * Alt - alt key
     * * Shift - shift key
     *
     * @aspDefaultValueIgnore
     * @aspNumberEnum
     * @default undefined
     */
    modifierKeys?: ModifierKeys;

}

/**
 * Interface for a class KeyboardCommand
 */
export interface KeyboardCommandModel {

    /**
     * Defines the name of the command.
     *
     * @default ''
     */
    name?: string;

    /**
     * Defines a combination of keys and key modifiers, on recognition of which the command will be executed.
     *
     * ```html
     * <div id='pdfViewer'></div>
     * ```
     * ```typescript
     * let pdfViewer: PdfViewer = new PdfViewer({
     * ...
     * commandManager:{
     * commands:[{
     * name:'customCopy',
     * gesture:{
     * key:Keys.G, keyModifiers:KeyModifiers.Shift | KeyModifiers.Alt
     * }
     * }]
     * },
     * ...
     * });
     * pdfViewer.appendTo('#pdfViewer');
     * ```
     *
     * @default {}
     */
    gesture?: KeyGestureModel;

}

/**
 * Interface for a class CommandManager
 */
export interface CommandManagerModel {

    /**
     * Defines the multiple command names with the corresponding command objects.
     *
     * @default []
     */
    keyboardCommand?: KeyboardCommandModel[];

}

/**
 * Interface for a class PageOrganizerSettings
 */
export interface PageOrganizerSettingsModel {

    /**
     * Specifies whether the pages can be deleted.
     */
    canDelete?: boolean;

    /**
     * Specifies whether the pages can be inserted.
     */
    canInsert?: boolean;

    /**
     * Specifies whether the pages can be rotated.
     */
    canRotate?: boolean;

    /**
     * Specifies whether the pages can be copied.
     */
    canCopy?: boolean;

    /**
     * Specifies whether the pages can be rearranged.
     */
    canRearrange?: boolean;

    /**
     * Specifies whether the other PDF document can be imported.
     */
    canImport?: boolean;

}

/**
 * Interface for a class SearchResult
 */
export interface SearchResultModel {

    /**
     * Returns the page index of the search text.
     */
    pageIndex?: number;

    /**
     * Returns the bounds of the search text.
     */
    bounds?: IPdfRectBounds[];

}

/**
 * Interface for a class PdfViewer
 */
export interface PdfViewerModel extends ComponentModel{

    /**
     * Defines the service url of the PdfViewer control.
     *
     * {% codeBlock src='pdfviewer/serviceUrl/index.md' %}{% endcodeBlock %}
     *
     */
    serviceUrl?: string;

    /**
     * gets the page count of the document loaded in the PdfViewer control.
     *
     * {% codeBlock src='pdfviewer/pageCount/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    pageCount?: number;

    /**
     *Specifies the document printing quality. The default printing quality is set to 1.0. This limit varies from 0.5 to 5.0. If an invalid value is specified, the default value of 1.0 will be used. For documents with smaller page dimensions, a higher print quality is recommended.
     *
     *{% codeBlock src='pdfviewer/printScaleFactor/index.md' %}{% endBlock %}
     *
     * @default 1.0
     */
    printScaleFactor?: number;

    /**
     * Checks whether the PDF document is edited.
     *
     * {% codeBlock src='pdfviewer/isDocumentEdited/index.md' %}{% endcodeBlock %}
     *
     * @asptype bool
     * @blazorType bool
     */
    isDocumentEdited?: boolean;

    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     *
     * {% codeBlock src='pdfviewer/currentPageNumber/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    currentPageNumber?: number;

    /**
     * Sets the PDF document path for initial loading.
     *
     * {% codeBlock src='pdfviewer/documentPath/index.md' %}{% endcodeBlock %}
     *
     */
    documentPath?: string;

    /**
     * Gets or sets the export annotations JSON file name in the PdfViewer control.
     *
     * {% codeBlock src='pdfviewer/exportAnnotationFileName/index.md' %}{% endcodeBlock %}
     *
     */
    exportAnnotationFileName?: string;

    /**
     * Gets or sets the download file name in the PdfViewer control.
     *
     * {% codeBlock src='pdfviewer/downloadFileName/index.md' %}{% endcodeBlock %}
     *
     */
    downloadFileName?: string;

    /**
     * Defines the scrollable height of the PdfViewer control.
     *
     * {% codeBlock src='pdfviewer/height/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Defines the scrollable width of the PdfViewer control.
     *
     * {% codeBlock src='pdfviewer/width/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Enable or disables the toolbar of PdfViewer.
     *
     * {% codeBlock src='pdfviewer/enableToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableToolbar?: boolean;

    /**
     * Specifies the retry count for the failed requests.
     *
     * {% codeBlock src='pdfviewer/retryCount/index.md' %}{% endcodeBlock %}
     *
     * @default 1
     */
    retryCount?: number;

    /**
     * Specifies the response status codes for retrying a failed request with a "3xx", "4xx", or "5xx" response status code.
     * The value can have multiple values, such as [500, 401, 400], and the default value is 500.
     *
     * {% codeBlock src='pdfviewer/retryStatusCodes/index.md' %}{% endcodeBlock %}
     *
     * @default [500]
     */
    retryStatusCodes?: number[];

    /**
     * Gets or sets the timeout for retries in seconds.
     *
     * {% codeBlock src='pdfviewer/retryTimeout/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    retryTimeout?: number;

    /**
     * Initially renders the first N pages of the PDF document when the document is loaded.
     *
     * {% codeBlock src='pdfviewer/initialRenderPages/index.md' %}{% endcodeBlock %}
     *
     * @default 2
     */
    initialRenderPages?: number;

    /**
     * If it is set as false then error message box is not displayed in PDF viewer control.
     *
     * {% codeBlock src='pdfviewer/showNotificationDialog/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    showNotificationDialog?: boolean;

    /**
     * Enable or disables the Navigation toolbar of PdfViewer.
     *
     * {% codeBlock src='pdfviewer/enableNavigationToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableNavigationToolbar?: boolean;

    /**
     * Enable or disables the Comment Panel of PdfViewer.
     *
     * {% codeBlock src='pdfviewer/enableCommentPanel/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableCommentPanel?: boolean;

    /**
     * If it set as true, then the command panel show at initial document loading in the PDF viewer
     *
     * {% codeBlock src='pdfviewer/isCommandPanelOpen/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isCommandPanelOpen?: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * {% codeBlock src='pdfviewer/enableTextMarkupResizer/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableTextMarkupResizer?: boolean;

    /**
     * Enable or disable the multi line text markup annotations in overlapping collections.
     *
     * {% codeBlock src='pdfviewer/enableMultiLineOverlap/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableMultiLineOverlap?: boolean;

    /**
     * Checks if the freeText value is valid or not.
     *
     * {% codeBlock src='pdfviewer/isValidFreeText/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isValidFreeText?: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     *
     * @deprecated This property renamed into "isAnnotationToolbarVisible"
     * @default false
     */
    isAnnotationToolbarOpen?: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially
     * and get the annotation Toolbar Visible status.
     *
     * {% codeBlock src='pdfviewer/isAnnotationToolbarVisible/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isAnnotationToolbarVisible?: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially
     * and get the annotation Toolbar Visible status.
     *
     * {% codeBlock src='pdfviewer/isFormDesignerToolbarVisible/index.md' %}{% endcodeBlock %}
     *
     * @public
     * @default false
     */
    isFormDesignerToolbarVisible?: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * {% codeBlock src='pdfviewer/enableMultiPageAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableMultiPageAnnotation?: boolean;

    /**
     * Enable or disables the download option of PdfViewer.
     *
     * {% codeBlock src='pdfviewer/enableDownload/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableDownload?: boolean;

    /**
     * Enable or disables the print option of PdfViewer.
     *
     * {% codeBlock src='pdfviewer/enablePrint/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enablePrint?: boolean;

    /**
     * If it is set as FALSE, will suppress the page rotation of Landscape document on print action. By default it is TRUE.
     *
     * {% codeBlock src='pdfviewer/enablePrintRotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enablePrintRotation?: boolean;

    /**
     * Enables or disables the thumbnail view in the PDF viewer
     *
     * {% codeBlock src='pdfviewer/enableThumbnail/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableThumbnail?: boolean;

    /**
     * Enable or disable the page organizer in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enablePageOrganizer/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enablePageOrganizer?: boolean;

    /**
     * Specifies whether the page organizer dialog will be displayed upon the initial document loading in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/isPageOrganizerOpen/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isPageOrganizerOpen?: boolean;

    /**
     * This property allows for control over various page management functionalities within the PDF Viewer. By setting it to `true`, users will be able to delete, insert, rotate pages, rearrange pages. Conversely, setting it to `false` will disable these actions.
     *
     * {% codeBlock src='pdfviewer/pageOrganizerSettings/index.md' %}{% endcodeBlock %}
     *
     */
    pageOrganizerSettings?: PageOrganizerSettingsModel;

    /**
     * If it set as true, then the thumbnail view show at initial document loading in the PDF Viewer
     *
     * {% codeBlock src='pdfviewer/isThumbnailViewOpen/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isThumbnailViewOpen?: boolean;

    /**
     * Enables or disable saving Hand Written signature as editable in the PDF.
     *
     * {% codeBlock src='pdfviewer/isSignatureEditable/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isSignatureEditable?: boolean;

    /**
     * Enables or disables the bookmark view in the PDF viewer
     *
     * {% codeBlock src='pdfviewer/enableBookmark/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableBookmark?: boolean;

    /**
     * Enables or disables the bookmark styles in the PDF viewer
     *
     * {% codeBlock src='pdfviewer/enableBookmarkStyles/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableBookmarkStyles?: boolean;

    /**
     * Enables or disables the hyperlinks in PDF document.
     *
     * {% codeBlock src='pdfviewer/enableHyperlink/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableHyperlink?: boolean;

    /**
     * Enables or disables the handwritten signature in PDF document.
     *
     * {% codeBlock src='pdfviewer/enableHandwrittenSignature/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableHandwrittenSignature?: boolean;

    /**
     * If it is set as false, then the ink annotation support in the PDF Viewer will be disabled. By default it is true.
     *
     * {% codeBlock src='pdfviewer/enableInkAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableInkAnnotation?: boolean;

    /**
     * restrict zoom request.
     *
     * {% codeBlock src='pdfviewer/restrictZoomRequest/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    restrictZoomRequest?: boolean;

    /**
     * Specifies the open state of the hyperlink in the PDF document.
     *
     * {% codeBlock src='pdfviewer/hyperlinkOpenState/index.md' %}{% endcodeBlock %}
     *
     * @default CurrentTab
     */
    hyperlinkOpenState?: LinkTarget;

    /**
     * Specifies the state of the ContextMenu in the PDF document.
     *
     * {% codeBlock src='pdfviewer/contextMenuOption/index.md' %}{% endcodeBlock %}
     *
     * @default RightClick
     */
    contextMenuOption?: ContextMenuAction;

    /**
     * Disables the menu items in the context menu.
     *
     * {% codeBlock src='pdfviewer/disableContextMenuItems/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    disableContextMenuItems?: ContextMenuItem[];

    /**
     * Gets the form fields present in the loaded PDF document. It used to get the form fields id, name, type and it's values.
     *
     * {% codeBlock src='pdfviewer/formFieldCollections/index.md' %}{% endcodeBlock %}
     *
     */

    formFieldCollections?: FormFieldModel[];

    /**
     * Enable or disable the Navigation module of PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableNavigation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableNavigation?: boolean;

    /**
     * Enable or disables the auto complete option in form documents.
     *
     * {% codeBlock src='pdfviewer/enableAutoComplete/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableAutoComplete?: boolean;

    /**
     * Enable or disable the Magnification module of PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableMagnification/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableMagnification?: boolean;

    /**
     * Enable or disable the Label for shapeAnnotations of PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableShapeLabel/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableShapeLabel?: boolean;

    /**
     * Enable or disable the customization of measure values in PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableImportAnnotationMeasurement/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableImportAnnotationMeasurement?: boolean;

    /**
     * Enable or disable the pinch zoom option in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enablePinchZoom/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enablePinchZoom?: boolean;

    /**
     * Enable or disable the text selection in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableTextSelection/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableTextSelection?: boolean;

    /**
     * Enable or disable the text search in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableTextSearch/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableTextSearch?: boolean;

    /**
     * Enable or disable the annotation in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableAnnotation?: boolean;

    /**
     * Enable or disable the form fields in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableFormFields/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableFormFields?: boolean;

    /**
     * Show or hide the form designer tool in the main toolbar of the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableFormDesigner/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableFormDesigner?: boolean;

    /**
     * Enable or disable the interaction of form fields in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/designerMode/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    designerMode?: boolean;

    /**
     * Enable or disable the form fields validation.
     *
     * {% codeBlock src='pdfviewer/enableFormFieldsValidation/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableFormFieldsValidation?: boolean;

    /**
     * Enable if the PDF document contains form fields.
     *
     * {% codeBlock src='pdfviewer/isFormFieldDocument/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isFormFieldDocument?: boolean;

    /**
     * Gets or sets a boolean value to show or hide desktop toolbar in mobile devices.
     *
     * {% codeBlock src='pdfviewer/enableDesktopMode/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableDesktopMode?: boolean;

    /**
     * Gets or sets a boolean value to show or hide the save signature check box option in the signature dialog.
     * FALSE by default
     *
     * @default false
     * @deprecated
     */
    hideSaveSignature?: boolean;

    /**
     * Enable or disable the free text annotation in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableFreeText/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableFreeText?: boolean;

    /**
     * Enable or disable the text markup annotation in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableTextMarkupAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableTextMarkupAnnotation?: boolean;

    /**
     * Enable or disable the shape annotation in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableShapeAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableShapeAnnotation?: boolean;

    /**
     * Enable or disable the calibrate annotation in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableMeasureAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableMeasureAnnotation?: boolean;

    /**
     * Enables and disable the stamp annotations when the PDF viewer control is loaded initially.
     *
     * {% codeBlock src='pdfviewer/enableStampAnnotations/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableStampAnnotations?: boolean;

    /**
     * Enables and disable the stickyNotes annotations when the PDF viewer control is loaded initially.
     *
     * {% codeBlock src='pdfviewer/enableStickyNotesAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableStickyNotesAnnotation?: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     *
     * {% codeBlock src='pdfviewer/enableAnnotationToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableAnnotationToolbar?: boolean;

    /**
     * Opens the form designer toolbar when the PDF document is loaded in the PDF Viewer control initially.
     *
     * {% codeBlock src='pdfviewer/enableFormDesignerToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableFormDesignerToolbar?: boolean;

    /**
     * Gets or sets a boolean value to show or hide the bookmark panel while loading a document.
     *
     * {% codeBlock src='pdfviewer/isBookmarkPanelOpen/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isBookmarkPanelOpen?: boolean;

    /**
     * Gets or sets a boolean value if initial field selected in form designer toolbar.
     *
     * @private
     * @default false
     */
    isInitialFieldToolbarSelection?: boolean;

    /**
     * Sets the interaction mode of the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/interactionMode/index.md' %}{% endcodeBlock %}
     *
     * @default TextSelection
     */
    interactionMode?: InteractionMode;

    /**
     * Specifies the rendering mode in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/zoomMode/index.md' %}{% endcodeBlock %}
     *
     * @default Default
     */
    zoomMode?: ZoomMode;

    /**
     * Specifies the signature mode in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/signatureFitMode/index.md' %}{% endcodeBlock %}
     *
     * @default Default
     */
    signatureFitMode?: SignatureFitMode;

    /**
     * Specifies the print mode in the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/printMode/index.md' %}{% endcodeBlock %}
     *
     * @default Default
     */
    printMode?: PrintMode;

    /**
     * Sets the initial loading zoom value from 10 to 400 in the PDF Viewer Control.
     *
     * {% codeBlock src='pdfviewer/zoomValue/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    zoomValue?: number;

    /**
     * Specifies the minimum acceptable zoom level for the control, with a default value of 10.
     *
     * {% codeBlock src='pdfviewer/minZoom/index.md' %}{% endcodeBlock %}
     *
     * @default 10
     */
    minZoom?: number;

    /**
     * Specifies the maximum allowable zoom level for the control, with a default value of 400.
     *
     * {% codeBlock src='pdfviewer/maxZoom/index.md' %}{% endcodeBlock %}
     *
     * @default 400
     */
    maxZoom?: number;

    /**
     *  Enable or disable the zoom optimization mode in PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/enableZoomOptimization/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableZoomOptimization?: boolean;

    /**
     * Enable or disable the text extract from the PDF viewer.
     *
     * {% codeBlock src='pdfviewer/isExtractText/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isExtractText?: boolean;

    /**
     * Maintain the selection of text markup annotation.
     *
     * {% codeBlock src='pdfviewer/isMaintainSelection/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    isMaintainSelection?: boolean;

    /**
     *  Get or set the flag to hide the digitally signed field on document loading.
     *
     * @private
     * @default false
     */
    hideEmptyDigitalSignatureFields?: boolean;

    /**
     *  Show or hide the digital signature appearance in the document.
     *
     * {% codeBlock src='pdfviewer/showDigitalSignatureAppearance/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    showDigitalSignatureAppearance?: boolean;

    /**
     *  Determines whether accessibility tags are enabled or disabled.
     *  Accessibility tags can help make web content more accessible to users with disabilities.
     *
     * {% codeBlock src='pdfviewer/enableAccessibilityTags/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableAccessibilityTags?: boolean;

    /**
     * Specifies whether to display or remove the untrusted HTML values in the PDF Viewer component.
     *
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @private
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Customize desired date and time format
     *
     * {% codeBlock src='pdfviewer/dateTimeFormat/index.md' %}{% endcodeBlock %}
     *
     */
    dateTimeFormat?: string;

    /**
     * Set the resource URL for assets or the public directory. The standalone PDF Viewer will load its custom resources from this URL.
     *
     * {% codeBlock src='pdfviewer/resourceUrl/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     *
     * Users incorporating custom assets, public directories, or routing setups into their
     * Standalone PDF Viewer applications may face challenges when loading the PDF Viewer
     * libraries from the default assets location. This property addresses these issues by allowing
     * resource URL customization, guaranteeing a smooth integration process for loading libraries
     * in the Standalone PDF Viewer.
     *
     * @default ''
     */
    resourceUrl?: string;

    /**
     * Defines the settings of the PDF Viewer toolbar.
     *
     * {% codeBlock src='pdfviewer/toolbarSettings/index.md' %}{% endcodeBlock %}
     *
     */

    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Defines the ajax Request settings of the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/ajaxRequestSettings/index.md' %}{% endcodeBlock %}
     *
     */

    ajaxRequestSettings?: AjaxRequestSettingsModel;

    /**
     * Defines the stamp items of the PDF Viewer.
     *
     * {% codeBlock src='pdfviewer/customStamp/index.md' %}{% endcodeBlock %}
     *
     */

    customStamp?: CustomStampModel[];

    /**
     * Defines the settings of the PDF Viewer service.
     *
     * {% codeBlock src='pdfviewer/serverActionSettings/index.md' %}{% endcodeBlock %}
     *
     */

    serverActionSettings?: ServerActionSettingsModel;

    /**
     * Get or set the signature field settings.
     *
     * {% codeBlock src='pdfviewer/signatureFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */

    signatureFieldSettings?: SignatureFieldSettingsModel;

    /**
     * Get or set the initial field settings.
     *
     * {% codeBlock src='pdfviewer/initialFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */

    initialFieldSettings?: InitialFieldSettingsModel;

    /**
     * Defines the settings of highlight annotation.
     *
     * {% codeBlock src='pdfviewer/highlightSettings/index.md' %}{% endcodeBlock %}
     *
     */

    highlightSettings?: HighlightSettingsModel;

    /**
     * Defines the settings of strikethrough annotation.
     *
     * {% codeBlock src='pdfviewer/strikethroughSettings/index.md' %}{% endcodeBlock %}
     *
     */

    strikethroughSettings?: StrikethroughSettingsModel;

    /**
     * Defines the settings of underline annotation.
     *
     * {% codeBlock src='pdfviewer/underlineSettings/index.md' %}{% endcodeBlock %}
     *
     */

    underlineSettings?: UnderlineSettingsModel;

    /**
     * Defines the settings of line annotation.
     *
     * {% codeBlock src='pdfviewer/lineSettings/index.md' %}{% endcodeBlock %}
     *
     */

    lineSettings?: LineSettingsModel;

    /**
     * Defines the settings of arrow annotation.
     *
     * {% codeBlock src='pdfviewer/arrowSettings/index.md' %}{% endcodeBlock %}
     *
     */

    arrowSettings?: ArrowSettingsModel;

    /**
     * Defines the settings of rectangle annotation.
     *
     * {% codeBlock src='pdfviewer/rectangleSettings/index.md' %}{% endcodeBlock %}
     *
     */

    rectangleSettings?: RectangleSettingsModel;

    /**
     * Defines the settings of shape label.
     *
     * {% codeBlock src='pdfviewer/shapeLabelSettings/index.md' %}{% endcodeBlock %}
     *
     */

    shapeLabelSettings?: ShapeLabelSettingsModel;

    /**
     * Defines the settings of circle annotation.
     *
     * {% codeBlock src='pdfviewer/circleSettings/index.md' %}{% endcodeBlock %}
     *
     */

    circleSettings?: CircleSettingsModel;

    /**
     * Defines the settings of polygon annotation.
     *
     * {% codeBlock src='pdfviewer/polygonSettings/index.md' %}{% endcodeBlock %}
     *
     */

    polygonSettings?: PolygonSettingsModel;

    /**
     * Defines the settings of stamp annotation.
     *
     * {% codeBlock src='pdfviewer/stampSettings/index.md' %}{% endcodeBlock %}
     *
     */

    stampSettings?: StampSettingsModel;

    /**
     * Defines the settings of customStamp annotation.
     *
     * {% codeBlock src='pdfviewer/customStampSettings/index.md' %}{% endcodeBlock %}
     *
     */

    customStampSettings?: CustomStampSettingsModel;

    /**
     * Defines the settings of distance annotation.
     *
     * {% codeBlock src='pdfviewer/distanceSettings/index.md' %}{% endcodeBlock %}
     *
     */

    distanceSettings?: DistanceSettingsModel;

    /**
     * Defines the settings of perimeter annotation.
     *
     * {% codeBlock src='pdfviewer/perimeterSettings/index.md' %}{% endcodeBlock %}
     *
     */

    perimeterSettings?: PerimeterSettingsModel;

    /**
     * Defines the settings of area annotation.
     *
     * {% codeBlock src='pdfviewer/areaSettings/index.md' %}{% endcodeBlock %}
     *
     */

    areaSettings?: AreaSettingsModel;

    /**
     * Defines the settings of radius annotation.
     *
     * {% codeBlock src='pdfviewer/radiusSettings/index.md' %}{% endcodeBlock %}
     *
     */

    radiusSettings?: RadiusSettingsModel;

    /**
     * Defines the settings of volume annotation.
     *
     * {% codeBlock src='pdfviewer/volumeSettings/index.md' %}{% endcodeBlock %}
     *
     */

    volumeSettings?: VolumeSettingsModel;

    /**
     * Defines the settings of stickyNotes annotation.
     *
     * {% codeBlock src='pdfviewer/stickyNotesSettings/index.md' %}{% endcodeBlock %}
     *
     */

    stickyNotesSettings?: StickyNotesSettingsModel;

    /**
     * Defines the settings of free text annotation.
     *
     * {% codeBlock src='pdfviewer/freeTextSettings/index.md' %}{% endcodeBlock %}
     *
     */

    freeTextSettings?: FreeTextSettingsModel;

    /**
     * Defines the settings of measurement annotation.
     *
     * {% codeBlock src='pdfviewer/measurementSettings/index.md' %}{% endcodeBlock %}
     *
     */
    measurementSettings?: MeasurementSettingsModel;

    /**
     * Defines the settings of annotation selector.
     *
     * {% codeBlock src='pdfviewer/annotationSelectorSettings/index.md' %}{% endcodeBlock %}
     *
     */

    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * Sets the settings for the color of the text search highlight.
     *
     * {% codeBlock src='pdfviewer/textSearchColorSettings/index.md' %}{% endcodeBlock %}
     *
     */
    textSearchColorSettings?: TextSearchColorSettingsModel;

    /**
     * Get or set the signature dialog settings for signature field.
     *
     * {% codeBlock src='pdfviewer/signatureDialogSettings/index.md' %}{% endcodeBlock %}
     *
     */
    signatureDialogSettings?: SignatureDialogSettingsModel;

    /**
     * Get or set the signature dialog settings for initial field.
     *
     * {% codeBlock src='pdfviewer/initialDialogSettings/index.md' %}{% endcodeBlock %}
     *
     */
    initialDialogSettings?: SignatureDialogSettingsModel;

    /**
     * Defines the settings of handWrittenSignature.
     *
     * {% codeBlock src='pdfviewer/handWrittenSignatureSettings/index.md' %}{% endcodeBlock %}
     *
     */

    handWrittenSignatureSettings?: HandWrittenSignatureSettingsModel;

    /**
     * Defines the ink annotation settings for PDF Viewer.It used to customize the strokeColor, thickness, opacity of the ink annotation.
     *
     * {% codeBlock src='pdfviewer/inkAnnotationSettings/index.md' %}{% endcodeBlock %}
     *
     */

    inkAnnotationSettings?: InkAnnotationSettingsModel;

    /**
     * Defines the settings of the annotations.
     *
     * {% codeBlock src='pdfviewer/annotationSettings/index.md' %}{% endcodeBlock %}
     *
     */

    annotationSettings?: AnnotationSettingsModel;

    /**
     * Defines the tile rendering settings.
     *
     * {% codeBlock src='pdfviewer/tileRenderingSettings/index.md' %}{% endcodeBlock %}
     *
     */
    tileRenderingSettings?: TileRenderingSettingsModel;

    /**
     * Defines the scroll settings.
     *
     * {% codeBlock src='pdfviewer/scrollSettings/index.md' %}{% endcodeBlock %}
     *
     */
    scrollSettings?: ScrollSettingsModel;

    /**
     * Get or set the text field settings.
     *
     * {% codeBlock src='pdfviewer/textFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */
    textFieldSettings?: TextFieldSettingsModel;

    /**
     * Get or set the password field settings.
     *
     * {% codeBlock src='pdfviewer/passwordFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */
    passwordFieldSettings?: PasswordFieldSettingsModel;

    /**
     * Get or set the check box field settings.
     *
     * {% codeBlock src='pdfviewer/checkBoxFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */
    checkBoxFieldSettings?: CheckBoxFieldSettingsModel;

    /**
     * Get or set the radio button field settings.
     *
     * {% codeBlock src='pdfviewer/radioButtonFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */
    radioButtonFieldSettings?: RadioButtonFieldSettingsModel;

    /**
     * Get or set the dropdown field settings.
     *
     * {% codeBlock src='pdfviewer/DropdownFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */
    DropdownFieldSettings?: DropdownFieldSettingsModel;

    /**
     * Get or set the listbox field settings.
     *
     * {% codeBlock src='pdfviewer/listBoxFieldSettings/index.md' %}{% endcodeBlock %}
     *
     */
    listBoxFieldSettings?: ListBoxFieldSettingsModel;

    /**
     * Defines the context menu settings.
     *
     * {% codeBlock src='pdfviewer/contextMenuSettings/index.md' %}{% endcodeBlock %}
     *
     */

    contextMenuSettings?: ContextMenuSettingsModel;

    /**
     * Defines the custom context menu items.
     *
     * @private
     */
    customContextMenuItems?: MenuItemModel[];

    /**
     * Defines the custom context menu items.
     *
     * @private
     */
    disableDefaultContextMenu?: boolean;

    /**
     * Defines the custom context menu items.
     *
     * @private
     */
    showCustomContextMenuBottom?: boolean;

    /**
     * Defines a set of custom commands and binds them with a set of desired key gestures.
     *
     * {% codeBlock src='pdfviewer/commandManager/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    commandManager?: CommandManagerModel;

    /**
     * Defines the collection of selected items, size and position of the selector
     *
     * @default {}
     */
    selectedItems?: SelectorModel;

    /**
     * Triggers during the creation of the PDF viewer component.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    created?: EmitType<void>;

    /**
     * Triggers while loading document into PDF viewer.
     *
     * @event documentLoad
     * @blazorProperty 'DocumentLoaded'
     */
    documentLoad?: EmitType<LoadEventArgs>;

    /**
     * Triggers while closing the document.
     *
     * @event documentUnload
     * @blazorProperty 'DocumentUnloaded'
     */
    documentUnload?: EmitType<UnloadEventArgs>;

    /**
     * Triggers while document loading failed in PdfViewer.
     *
     * @event documentLoadFailed
     * @blazorProperty 'DocumentLoadFailed'
     */
    documentLoadFailed?: EmitType<LoadFailedEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     *
     * @event ajaxRequestFailed
     * @blazorProperty 'AjaxRequestFailed'
     */
    ajaxRequestFailed?: EmitType<AjaxRequestFailureEventArgs>;

    /**
     * Triggers on successful AJAX request.
     *
     * @event ajaxRequestSuccess
     */
    ajaxRequestSuccess?: EmitType<AjaxRequestSuccessEventArgs>;

    /**
     * Triggers upon completion of page rendering.
     *
     * @event pageRenderComplete
     */
    pageRenderComplete?: EmitType<PageRenderCompleteEventArgs>;

    /**
     * Triggers when validation is failed.
     *
     * @event validateFormFields
     * @blazorProperty 'validateFormFields'
     */
    validateFormFields?: EmitType<ValidateFormFieldsArgs>;

    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     *
     * @event pageClick
     * @blazorProperty 'OnPageClick'
     */
    pageClick?: EmitType<PageClickEventArgs>;

    /**
     * Triggers when there is change in current page number.
     *
     * @event pageChange
     * @blazorProperty 'PageChanged'
     */
    pageChange?: EmitType<PageChangeEventArgs>;

    /**
     * Triggers when a hyperlink in a PDF document is clicked.
     *
     * @event hyperlinkClick
     * @blazorProperty 'OnHyperlinkClick'
     */
    hyperlinkClick?: EmitType<HyperlinkClickEventArgs>;

    /**
     * Triggers when hyperlink in a PDF document is hovered.
     *
     * @event hyperlinkMouseOver
     * @blazorProperty 'OnHyperlinkMouseOver'
     */
    hyperlinkMouseOver?: EmitType<HyperlinkMouseOverArgs>;

    /**
     * Triggers When the magnification value changes.
     *
     * @event zoomChange
     * @blazorProperty 'ZoomChanged'
     */
    zoomChange?: EmitType<ZoomChangeEventArgs>;

    /**
     * Triggers when an annotation is added to a PDF document's page.
     *
     * @event annotationAdd
     * @blazorProperty 'AnnotationAdded'
     */
    annotationAdd?: EmitType<AnnotationAddEventArgs>;

    /**
     * Triggers when an annotation is removed from a PDF document's page.
     *
     * @event annotationRemove
     * @blazorProperty 'AnnotationRemoved'
     */
    annotationRemove?: EmitType<AnnotationRemoveEventArgs>;

    /**
     * Triggers when the annotation's property is modified on a PDF document page.
     *
     * @event annotationPropertiesChange
     * @blazorProperty 'AnnotationPropertiesChanged'
     */
    annotationPropertiesChange?: EmitType<AnnotationPropertiesChangeEventArgs>;

    /**
     * Triggers when an annotation is resized over the page of a PDF document.
     *
     * @event annotationResize
     * @blazorProperty 'AnnotationResized'
     */
    annotationResize?: EmitType<AnnotationResizeEventArgs>;

    /**
     * Triggers when a signature is added to a page of a PDF document.
     *
     * @event addSignature
     */
    addSignature?: EmitType<AddSignatureEventArgs>;

    /**
     * Triggers when the signature is removed from the page of a PDF document.
     *
     * @event removeSignature
     */
    removeSignature?: EmitType<RemoveSignatureEventArgs>;

    /**
     * Triggers when a signature is moved across the page of a PDF document.
     *
     * @event moveSignature
     */
    moveSignature?: EmitType<MoveSignatureEventArgs>;

    /**
     * Triggers when the property of the signature is changed in the page of the PDF document.
     *
     * @event signaturePropertiesChange
     */
    signaturePropertiesChange?: EmitType<SignaturePropertiesChangeEventArgs>;

    /**
     * Triggers when the signature is resized and placed on a page of a PDF document.
     *
     * @event resizeSignature
     */
    resizeSignature?: EmitType<ResizeSignatureEventArgs>;

    /**
     * Triggers when signature is selected over the page of the PDF document.
     *
     * @event signatureSelect
     */
    signatureSelect?: EmitType<SignatureSelectEventArgs>;

    /**
     * Triggers when signature is unselected over the page of the PDF document.
     *
     * @event signatureUnselect
     */
    signatureUnselect?: EmitType<SignatureUnselectEventArgs>;

    /**
     * Triggers when an annotation is selected over the page of the PDF document.
     *
     * @event annotationSelect
     * @blazorProperty 'AnnotationSelected'
     */
    annotationSelect?: EmitType<AnnotationSelectEventArgs>;

    /**
     * Triggers when an annotation is unselected over the page of the PDF document.
     *
     * @event annotationUnSelect
     * @blazorProperty 'AnnotationUnSelect'
     */
    annotationUnSelect?: EmitType<AnnotationUnSelectEventArgs>;

    /**
     * Triggers when the annotation is double clicked.
     *
     * @event annotationDoubleClick
     * @blazorProperty 'OnAnnotationDoubleClick'
     */
    annotationDoubleClick?: EmitType<AnnotationDoubleClickEventArgs>;

    /**
     * Triggers when an annotation is moved over the page of the PDF document.
     *
     * @event annotationMove
     * @blazorProperty 'AnnotationMoved'
     */
    annotationMove?: EmitType<AnnotationMoveEventArgs>;

    /**
     * Triggers while moving an annotation.
     *
     * @event annotationMoving
     * @blazorProperty 'AnnotationMoving'
     */
    annotationMoving?: EmitType<AnnotationMovingEventArgs>;

    /**
     * Triggers when the mouse is moved over the annotation object.
     *
     * @event annotationMouseover
     */
    annotationMouseover?: EmitType<AnnotationMouseoverEventArgs>;

    /**
     * Triggers when the user mouse moves away from the annotation object.
     *
     * @event annotationMouseLeave
     */
    annotationMouseLeave?: EmitType<AnnotationMouseLeaveEventArgs>;

    /**
     * Triggers when moving the mouse over the page.
     *
     * @event pageMouseover
     */
    pageMouseover?: EmitType<PageMouseoverEventArgs>;

    /**
     * Triggers when an imported annotation started to appear in the PDF document.
     *
     * @event importStart
     * @blazorProperty 'ImportStarted'
     */
    importStart?: EmitType<ImportStartEventArgs>;

    /**
     * Triggers when an exported annotation started in the PDF Viewer.
     *
     * @event exportStart
     * @blazorProperty 'ExportStarted'
     */
    exportStart?: EmitType<ExportStartEventArgs>;

    /**
     * Triggers when the annotations in a PDF document are successfully imported.
     *
     * @event importSuccess
     * @blazorProperty 'ImportSucceed'
     */
    importSuccess?: EmitType<ImportSuccessEventArgs>;

    /**
     * Triggers when the annotations in a PDF document are successfully exported.
     *
     * @event exportSuccess
     * @blazorProperty 'ExportSucceed'
     */
    exportSuccess?: EmitType<ExportSuccessEventArgs>;

    /**
     * Triggers when the annotations imports in a PDF document fails.
     *
     * @event importFailed
     * @blazorProperty 'ImportFailed'
     */
    importFailed?: EmitType<ImportFailureEventArgs>;

    /**
     * Triggers when the annotations export in a PDF document fails.
     *
     * @event exportFailed
     * @blazorProperty 'ExportFailed'
     */
    exportFailed?: EmitType<ExportFailureEventArgs>;

    /**
     * Triggers when an text extraction is completed in the PDF Viewer.
     *
     * @event extractTextCompleted
     * @blazorProperty 'ExtractTextCompleted'
     */
    extractTextCompleted?: EmitType<ExtractTextCompletedEventArgs>;

    /**
     * Triggers when the thumbnail in the PDF Viewer's thumbnail panel is clicked.
     *
     * @event thumbnailClick
     * @blazorProperty 'OnThumbnailClick'
     */
    thumbnailClick?: EmitType<ThumbnailClickEventArgs>;

    /**
     * Triggers when the bookmark is clicked in the PDF Viewer's bookmark panel.
     *
     * @event bookmarkClick
     * @blazorProperty 'BookmarkClick'
     */
    bookmarkClick?: EmitType<BookmarkClickEventArgs>;

    /**
     * Triggers when custom toolbar item is clicked.
     *
     * @event toolbarClick
     * @blazorProperty 'ToolbarClick'
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers when the text selection is initiated.
     *
     * @event textSelectionStart
     * @blazorProperty 'OnTextSelectionStart'
     */
    textSelectionStart?: EmitType<TextSelectionStartEventArgs>;

    /**
     * Triggers when the text selection is complete.
     *
     * @event textSelectionEnd
     * @blazorProperty 'OnTextSelectionEnd'
     */
    textSelectionEnd?: EmitType<TextSelectionEndEventArgs>;

    /**
     * Triggers when the download action is initiated.
     *
     * @event downloadStart
     * @blazorProperty 'DownloadStart'
     */
    downloadStart?: EmitType<DownloadStartEventArgs>;

    /**
     * Triggers when the button is clicked.
     *
     * @deprecated This property renamed into "formFieldClick"
     * @event buttonFieldClick
     * @blazorProperty 'ButtonFieldClick'
     */
    buttonFieldClick?: EmitType<ButtonFieldClickEventArgs>;

    /**
     * Triggers when the form field is selected.
     *
     * @event formFieldClick
     * @blazorProperty 'FormFieldClick'
     */
    formFieldClick?: EmitType<FormFieldClickArgs>;

    /**
     * Triggers when the download actions are completed.
     *
     * @event downloadEnd
     * @blazorProperty 'DownloadEnd'
     */
    downloadEnd?: EmitType<DownloadEndEventArgs>;

    /**
     * Triggers when the print action is initiated.
     *
     * @event printStart
     * @blazorProperty 'PrintStart'
     */
    printStart?: EmitType<PrintStartEventArgs>;

    /**
     * Triggers when the print actions are completed.
     *
     * @event printEnd
     * @blazorProperty 'PrintEnd'
     */
    printEnd?: EmitType<PrintEndEventArgs>;

    /**
     * Triggers when the text search is initiated.
     *
     * @event textSearchStart
     * @blazorProperty 'OnTextSearchStart'
     */
    textSearchStart?: EmitType<TextSearchStartEventArgs>;

    /**
     * Triggers when the text search is completed.
     *
     * @event textSearchComplete
     * @blazorProperty 'OnTextSearchComplete'
     */
    textSearchComplete?: EmitType<TextSearchCompleteEventArgs>;

    /**
     * Triggers when the text search text is highlighted.
     *
     * @event textSearchHighlight
     * @blazorProperty 'OnTextSearchHighlight'
     */
    textSearchHighlight?: EmitType<TextSearchHighlightEventArgs>;

    /**
     * Triggers before the data is sent to the server.
     *
     * @event ajaxRequestInitiate
     */
    ajaxRequestInitiate?: EmitType<AjaxRequestInitiateEventArgs>;

    /**
     * Triggers upon the initiation of page rendering.
     *
     * @event pageRenderInitiate
     */
    pageRenderInitiate?: EmitType<PageRenderInitiateEventArgs>;

    /**
     * Triggers when a comment for the annotation is added to the comment panel.
     *
     * @event commentAdd
     * @blazorProperty 'commentAdd'
     */
    commentAdd?: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment for the annotation in the comment panel is edited.
     *
     * @event commentEdit
     * @blazorProperty 'commentEdit'
     */
    commentEdit?: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment for the annotation in the comment panel is deleted.
     *
     * @event commentDelete
     * @blazorProperty 'commentDelete'
     */
    commentDelete?: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment for the annotation in the comment panel is selected.
     *
     * @event commentSelect
     * @blazorProperty 'commentSelect
     */
    commentSelect?: EmitType<CommentEventArgs>;

    /**
     * Triggers when the annotation's comment for status is changed in the comment panel.
     *
     * @event commentStatusChanged
     * @blazorProperty 'commentStatusChanged'
     */
    commentStatusChanged?: EmitType<CommentEventArgs>;

    /**
     * Triggers before adding a text in the freeText annotation.
     *
     * @event beforeAddFreeText
     * @blazorProperty 'beforeAddFreeText'
     */
    beforeAddFreeText?: EmitType<BeforeAddFreeTextEventArgs>;

    /**
     * Triggers when focus out from the form fields.
     *
     * @event formFieldFocusOut
     * @blazorProperty 'formFieldFocusOut'
     */
    formFieldFocusOut?: EmitType<FormFieldFocusOutEventArgs>;

    /**
     * Triggers when a form field is added.
     *
     * @event formFieldAdd
     * @blazorProperty 'formFieldAdd'
     */
    formFieldAdd?: EmitType<FormFieldAddArgs>;

    /**
     * Triggers when a form field is removed.
     *
     * @event formFieldRemove
     * @blazorProperty 'formFieldRemove'
     */
    formFieldRemove?: EmitType<FormFieldRemoveArgs>;

    /**
     * Triggers when a property of form field is changed.
     *
     * @event formFieldPropertiesChange
     * @blazorProperty 'formFieldPropertiesChange'
     */
    formFieldPropertiesChange?: EmitType<FormFieldPropertiesChangeArgs>;

    /**
     * Triggers when the mouse cursor leaves the form field.
     *
     * @event formFieldMouseLeave
     * @blazorProperty 'formFieldMouseLeave'
     */
    formFieldMouseLeave?: EmitType<FormFieldMouseLeaveArgs>;

    /**
     * Triggers when the mouse cursor is over a form field.
     *
     * @event formFieldMouseover
     * @blazorProperty 'formFieldMouseover'
     */
    formFieldMouseover?: EmitType<FormFieldMouseoverArgs>;

    /**
     * Triggers when a form field is moved.
     *
     * @event formFieldMove
     * @blazorProperty 'formFieldMove'
     */
    formFieldMove?: EmitType<FormFieldMoveArgs>;

    /**
     * Triggers when a form field is resized.
     *
     * @event formFieldResize
     * @blazorProperty 'formFieldResize'
     */
    formFieldResize?: EmitType<FormFieldResizeArgs>;

    /**
     * Triggers when a form field is selected.
     *
     * @event formFieldSelect
     * @blazorProperty 'formFieldSelect'
     */
    formFieldSelect?: EmitType<FormFieldSelectArgs>;

    /**
     * Triggers when a form field is unselected.
     *
     * @event formFieldUnselect
     * @blazorProperty 'formFieldUnselect'
     */
    formFieldUnselect?: EmitType<FormFieldUnselectArgs>;

    /**
     * Triggers when the form field is double-clicked.
     *
     * @event formFieldDoubleClick
     * @blazorProperty 'formFieldDoubleClick'
     */
    formFieldDoubleClick?: EmitType<FormFieldDoubleClickArgs>;

    /**
     * Fires when a custom context menu option is selected.
     *
     * @event customContextMenuSelect
     */
    customContextMenuSelect?: EmitType<CustomContextMenuSelectEventArgs>

    /**
     * Fires before the custom context menu option is opened.
     *
     * @event customContextMenuBeforeOpen
     */
    customContextMenuBeforeOpen?: EmitType<CustomContextMenuBeforeOpenEventArgs>

    /**
     * Triggers when the customized keyboard command keys are pressed.
     *
     * @event keyboardCustomCommands
     */
    keyboardCustomCommands?: EmitType<KeyboardCustomCommandsEventArgs>;

    /**
     * Triggers when the page organizer save as triggered.
     *
     * @event pageOrganizerSaveAs
     */
    pageOrganizerSaveAs?: EmitType<PageOrganizerSaveAsEventArgs>;

    /**
     * PDF document annotation collection.
     *
     * @private
     * @deprecated
     */
    annotations?: PdfAnnotationBaseModel[];

    /**
     * PDF document form fields collection.
     *
     * @private
     * @deprecated
     */
    formFields?: PdfFormFieldBaseModel[];

    /**
     * store the drawing objects.
     *
     * @private
     * @deprecated
     */
    drawingObject?: PdfAnnotationBaseModel;

}