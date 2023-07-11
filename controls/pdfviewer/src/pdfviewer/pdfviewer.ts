/* eslint-disable */
// eslint-disable-next-line max-len
import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex, isBlazor, Browser } from '@syncfusion/ej2-base';
import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType } from '@syncfusion/ej2-base';
// eslint-disable-next-line max-len
import { PdfViewerModel, HighlightSettingsModel, UnderlineSettingsModel, StrikethroughSettingsModel, LineSettingsModel, ArrowSettingsModel, RectangleSettingsModel, CircleSettingsModel, PolygonSettingsModel, StampSettingsModel, StickyNotesSettingsModel, CustomStampSettingsModel, VolumeSettingsModel, RadiusSettingsModel, AreaSettingsModel, PerimeterSettingsModel, DistanceSettingsModel, MeasurementSettingsModel, FreeTextSettingsModel, AnnotationSelectorSettingsModel, TextSearchColorSettingsModel, DocumentTextCollectionSettingsModel, TextDataSettingsModel, RectangleBoundsModel, SignatureFieldSettingsModel, InitialFieldSettingsModel, SignatureIndicatorSettingsModel, TextFieldSettingsModel, PasswordFieldSettingsModel, CheckBoxFieldSettingsModel, RadioButtonFieldSettingsModel, DropdownFieldSettingsModel, ListBoxFieldSettingsModel, ItemModel, SignatureDialogSettingsModel } from './pdfviewer-model';
import { ToolbarSettingsModel, ShapeLabelSettingsModel } from './pdfviewer-model';
// eslint-disable-next-line max-len
import { ServerActionSettingsModel, AjaxRequestSettingsModel, CustomStampModel, HandWrittenSignatureSettingsModel, AnnotationSettingsModel, TileRenderingSettingsModel, ScrollSettingsModel, FormFieldModel, InkAnnotationSettingsModel } from './pdfviewer-model';
import { IAnnotationPoint, IPoint, PdfViewerBase } from './index';
import { Navigation } from './index';
import { Magnification } from './index';
import { Toolbar } from './index';
import { ToolbarItem } from './index';
// eslint-disable-next-line max-len
import { LinkTarget, InteractionMode, SignatureFitMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction, FontStyle, TextAlignment, AnnotationResizerShape, AnnotationResizerLocation, ZoomMode, PrintMode, CursorType, ContextMenuItem, DynamicStampItem, SignStampItem, StandardBusinessStampItem, FormFieldType, AllowedInteraction, AnnotationDataFormat, SignatureType, CommentStatus, SignatureItem, FormDesignerToolbarItem, DisplayMode, Visibility, FormFieldDataFormat } from './base/types';
import { Annotation } from './index';
import { LinkAnnotation } from './index';
import { ThumbnailView } from './index';
import { BookmarkView } from './index';
import { TextSelection } from './index';
import { TextSearch } from './index';
import { AccessibilityTags } from './index';
import { FormFields } from './index';
import { FormDesigner } from './index';
import { Print, CalibrationUnit } from './index';
// eslint-disable-next-line max-len
import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs, ImportStartEventArgs, ImportSuccessEventArgs, ImportFailureEventArgs, ExportStartEventArgs, ExportSuccessEventArgs, ExportFailureEventArgs, AjaxRequestInitiateEventArgs, AjaxRequestSuccessEventArgs } from './index';
import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs, AnnotationMoveEventArgs, AnnotationDoubleClickEventArgs, AnnotationMouseoverEventArgs, PageMouseoverEventArgs, AnnotationMouseLeaveEventArgs , ButtonFieldClickEventArgs} from './index';
// eslint-disable-next-line max-len
import { TextSelectionStartEventArgs, TextSelectionEndEventArgs, DownloadStartEventArgs, DownloadEndEventArgs, ExtractTextCompletedEventArgs, PrintStartEventArgs, PrintEndEventArgs } from './index';
// eslint-disable-next-line max-len
import { TextSearchStartEventArgs, TextSearchCompleteEventArgs, TextSearchHighlightEventArgs } from './index';
import { PdfAnnotationBase, PdfFormFieldBase, ZOrderPageTable } from './drawing/pdf-annotation';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './drawing/pdf-annotation-model';
import { Drawing, ClipBoardObject } from './drawing/drawing';
import { Selector } from './drawing/selector';
import { SelectorModel } from './drawing/selector-model';
import { PointModel, IElement, Rect, cornersPointsBeforeRotation, Point } from '@syncfusion/ej2-drawings';
import { renderAdornerLayer } from './drawing/dom-util';
import { ThumbnailClickEventArgs } from './index';
// eslint-disable-next-line max-len
import { ValidateFormFieldsArgs, BookmarkClickEventArgs, AnnotationUnSelectEventArgs, BeforeAddFreeTextEventArgs, FormFieldFocusOutEventArgs, CommentEventArgs, FormFieldClickArgs, FormFieldAddArgs, FormFieldRemoveArgs, FormFieldPropertiesChangeArgs, FormFieldMouseLeaveArgs, FormFieldMouseoverArgs, FormFieldMoveArgs, FormFieldResizeArgs, FormFieldSelectArgs, FormFieldUnselectArgs, FormFieldDoubleClickArgs, AnnotationMovingEventArgs } from './base';
// eslint-disable-next-line max-len
import { AddSignatureEventArgs, RemoveSignatureEventArgs, MoveSignatureEventArgs, SignaturePropertiesChangeEventArgs, ResizeSignatureEventArgs, SignatureSelectEventArgs } from './base';
import { ContextMenuSettingsModel } from './pdfviewer-model';
import { IFormField, IFormFieldBound } from './form-designer/form-designer';
import { PdfPageRotateAngle } from '@syncfusion/ej2-pdf-export'; 


/**
 * The `ToolbarSettings` module is used to provide the toolbar settings of PDF viewer.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the tool bar settings.
 *  viewer.toolbarSettings = {
 *      showTooltip: false,
 *      toolbarItems: [
 *          "OpenOption",
 *          "UndoRedoTool",
 *          "PageNavigationTool",
 *          "MagnificationTool",
 *          "PanTool",
 *          "SelectionTool",
 *          "CommentTool",
 *          "SubmitForm",
 *          "AnnotationEditTool",
 *          "FormDesignerEditTool",
 *          "FreeTextAnnotationOption",
 *          "InkAnnotationOption",
 *          "ShapeAnnotationOption",
 *          "StampAnnotation",
 *          "SignatureOption",
 *          "SearchOption",
 *          "PrintOption",
 *          "DownloadOption"
 *      ],
 *      annotationToolbarItems: [
 *          "HighlightTool",
 *          "UnderlineTool",
 *          "StrikethroughTool",
 *          "ColorEditTool",
 *          "OpacityEditTool",
 *          "AnnotationDeleteTool",
 *          "StampAnnotationTool",
 *          "HandWrittenSignatureTool",
 *          "InkAnnotationTool",
 *          "ShapeTool",
 *          "CalibrateTool",
 *          "StrokeColorEditTool",
 *          "ThicknessEditTool",
 *          "FreeTextAnnotationTool",
 *          "FontFamilyAnnotationTool",
 *          "FontSizeAnnotationTool",
 *          "FontStylesAnnotationTool",
 *          "FontAlignAnnotationTool",
 *          "FontColorAnnotationTool",
 *          "CommentPanelTool"
 *      ],
 *      formDesignerToolbarItems: [
 *          "TextboxTool",
 *          "PasswordTool",
 *          "CheckBoxTool",
 *          "RadioButtonTool",
 *          "DropdownTool",
 *          "ListboxTool",
 *          "DrawSignatureTool",
 *          "DeleteTool"
 *      ]
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 *
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Enable or disables the toolbar of PdfViewer.
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    @Property()
    public toolbarItems: ToolbarItem[];

    /**
     * Provide option to customize the annotation toolbar of the PDF Viewer.
     */
    @Property()
    public annotationToolbarItems: AnnotationToolbarItem[];

    /**
     * Customize the tools to be exposed in the form designer toolbar.
     */
    @Property()
    public formDesignerToolbarItems: FormDesignerToolbarItem[];
}

/**
 * The `AjaxRequestSettings` module is used to set the ajax Request Headers of PDF viewer.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // HTTP header "X-Custom-Header": "Custom header value" // Custom HTTP header
 *  viewer.ajaxRequestSettings = { 
 *      ajaxHeaders: [
 *          { 
 *              headerName : "Authorization", 
 *              headerValue : "Bearer" 
 *          } 
 *      ], 
 *      withCredentials: false 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class AjaxRequestSettings extends ChildProperty<AjaxRequestSettings> {

    /**
     * set the ajax Header values in the PdfViewer.
     */
    @Property()
    public ajaxHeaders: IAjaxHeaders[];

    /**
     * set the ajax credentials for the pdfviewer.
     */
    @Property(false)
    public withCredentials: boolean;
}

export interface IAjaxHeaders {

    /**
     * specifies the ajax Header Name of the PdfViewer.
     */
    headerName: string

    /**
     * specifies the ajax Header Value of the PdfViewer.
     */
    headerValue: string
}
/**
 * The `CustomStamp` module is used to provide the custom stamp added in stamp menu of the PDF Viewer toolbar.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Add your custom stamp image source as base64 image.
 *  viewer.customStamp = [
 *       { 
 *          customStampName: 'Sample', 
 *          customStampImageSource: "data:image/png;base64, Syncfusion pdf viewer"
 *      }
 *  ]; 
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class CustomStamp extends ChildProperty<CustomStamp> {
    /**
     * Defines the custom stamp name to be added in stamp menu of the PDF Viewer toolbar.
     */
    @Property('')
    public customStampName: string;

    /**
     * Defines the custom stamp images source to be added in stamp menu of the PDF Viewer toolbar.
     */
    @Property('')
    public customStampImageSource: string;
}

/**
 * The `AnnotationToolbarSettings` module is used to provide the annotation toolbar settings of the PDF viewer.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the annotation tool bar settings.
 *  viewer.toolbarSettings = {
 *      showTooltip: false,
 *      annotationToolbarItems: [
 *          "HighlightTool",
 *          "UnderlineTool",
 *          "StrikethroughTool",
 *          "ColorEditTool",
 *          "OpacityEditTool",
 *          "AnnotationDeleteTool",
 *          "StampAnnotationTool",
 *          "HandWrittenSignatureTool",
 *          "InkAnnotationTool",
 *          "ShapeTool",
 *          "CalibrateTool",
 *          "StrokeColorEditTool",
 *          "ThicknessEditTool",
 *          "FreeTextAnnotationTool",
 *          "FontFamilyAnnotationTool",
 *          "FontSizeAnnotationTool",
 *          "FontStylesAnnotationTool",
 *          "FontAlignAnnotationTool",
 *          "FontColorAnnotationTool",
 *          "CommentPanelTool"
 *      ],
 *  };
 * viewer.appendTo("#pdfViewer");
 * ```
 *
 */
export class AnnotationToolbarSettings extends ChildProperty<AnnotationToolbarSettings> {
    /**
     * Enable or disables the tooltip of the toolbar.
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    @Property()
    public annotationToolbarItem: AnnotationToolbarItem[];
}

/**
 * The `FormDesignerToolbarSettings` module is used to provide the Form designer toolbar settings of the PDF viewer.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the form field tool bar settings.
 *  viewer.toolbarSettings = {
 *      showTooltip: false,
 *      formDesignerToolbarItems: [
 *          "TextboxTool",
 *          "PasswordTool",
 *          "CheckBoxTool",
 *          "RadioButtonTool",
 *          "DropdownTool",
 *          "ListboxTool",
 *          "DrawSignatureTool",
 *          "DeleteTool"
 *      ]
 *  };
 * viewer.appendTo("#pdfViewer");
 * ```
 *
 */
 export class FormDesignerToolbarSettings extends ChildProperty<FormDesignerToolbarSettings> {
    /**
     * Enable or disables the tooltip of the toolbar.
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    @Property()
    public formDesignerToolbarItem: FormDesignerToolbarItem[];
}

/**
 * The `SignatureFieldSettings` module is used to set the properties of signature field in PDF Viewer
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the signature field settings.
 *  viewer.signatureFieldSettings = {
 *      name: "",
 *      isReadOnly: true,
 *      visibility: "visible",
 *      isRequired: true,
 *      isPrint: false,
 *      tooltip: "",
 *      thickness: 1,
 *      signatureIndicatorSettings: {
 *          opacity: 1,
 *          backgroundColor: "orange",
 *          width: 19,
 *          height: 10,
 *          fontSize: 10,
 *          text: null,
 *          color: "black"  
 *      },
 *      signatureDialogSettings: {
 *          displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload,
 *          hideSaveSignature: false
 *      }
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class SignatureFieldSettings extends ChildProperty<SignatureFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;
     
    /**
     * Specifies whether the signature field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;
     
    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;
     
    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;
    
    /**
     * Get or set the boolean value to print the signature field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;
     
    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

   /**
     * Get or set the thickness of the Signature field. Default value is 1. To hide the borders, set the value to 0 (zero).
     */
    @Property(1)
    public thickness: number;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Specifies the properties of the signature Dialog Settings in the signature field.
     */
    @Property()
    public signatureDialogSettings: SignatureDialogSettingsModel;

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    @Property()
    public signatureIndicatorSettings: SignatureIndicatorSettingsModel;
}

/**
 * The `InitialFieldSettings` module is used to set the properties of initial field in PDF Viewer
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Changes the initial field settings.
 *  viewer.initialFieldSettings = {
 *      name: "",
 *      isReadOnly: true,
 *      visibility: "visible",
 *      isRequired: true,
 *      isPrint: true,
 *      tooltip: "",
 *      thickness: 1,
 *      initialIndicatorSettings: {
 *          opacity: 1,
 *          backgroundColor: "orange",
 *          width: 19,
 *          height: 10,
 *          fontSize: 10,
 *          text: null,
 *          color: "black"
 *      },
 *      initialDialogSettings: {
 *         displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload,
 *          hideSaveSignature: false
 *      }
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class InitialFieldSettings extends ChildProperty<InitialFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the initial field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the initial field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

     /**
     * Get or set the thickness of the Initial field. Default value is 1. To hide the borders, set the value to 0 (zero).
     */
    @Property(1)
    public thickness: number;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Gets or sets the initial field type of the signature field.
     */
    @Property(false)
    public isInitialField: boolean;

    /**
     * Get or set the signature dialog settings for initial field.
     */
    @Property()
    public initialDialogSettings: SignatureDialogSettingsModel;

    /**
     * Specifies the properties of the signature indicator in the initial field.
     */
    @Property()
    public initialIndicatorSettings: SignatureIndicatorSettingsModel;
}

/**
 * The `SignatureIndicatorSettings` module is used to provide the properties of signature Indicator in the signature field.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the signature indicator settings.
 *  viewer.signatureFieldSettings = {
 *      signatureIndicatorSettings: {
 *          opacity: 1, 
 *          backgroundColor: 'orange', 
 *          width: 19, 
 *          height: 10, 
 *          fontSize: 10, 
 *          text: null, 
 *          color: 'black' 
 *      } 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class SignatureIndicatorSettings extends ChildProperty<SignatureIndicatorSettings> {

    /**
     * Specifies the opacity of the signature indicator.
     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies the color of the signature indicator.
     */
    @Property('orange')
    public backgroundColor: string;

    /**
     * Specifies the width of the signature indicator. Maximum width is half the width of the signature field.
     * Minimum width is the default value.
     */
    @Property(19)
    public width: number;

    /**
     * Specifies the height of the signature indicator. Maximum height is half the height of the signature field.
     * Minimum height is the default value.
     */
    @Property(10)
    public height: number;

    /**
     * Specifies the signature Indicator's font size. The maximum size of the font is half the height of the signature field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * Specifies the text of the signature Indicator.
     */
    @Property(null)
    public text: string;

    /**
     * Specifies the color of the text of signature indicator.
     */
    @Property('black')
    public color: string;

}

/**
 * The `SignatureDialogSettings` module is used to customize the signature dialog box.
 * 
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the signature dialog settings.
 *  viewer.signatureDialogSettings = { 
 *      displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, 
 *      hideSaveSignature: true
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class SignatureDialogSettings extends ChildProperty<SignatureDialogSettings> {
    /**
     * Get or set the required signature options will be enabled in the signature dialog.
     */
    @Property(DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload)
    public displayMode: DisplayMode;

    /**
     * Get or set a boolean value to show or hide the save signature check box option in the signature dialog. FALSE by default.
     */
    @Property(false)
    public hideSaveSignature: boolean;
}
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the server action settings.
 *  viewer.serverActionSettings = {
 *      load: "Load",
 *      renderPages: "RenderPdfPages",
 *      unload: "Unload",
 *      download: "Download",
 *      renderThumbnail: "RenderThumbnailImages",
 *      print: "PrintImages",
 *      renderComments: "RenderAnnotationComments",
 *      importAnnotations: "ImportAnnotations",
 *      exportAnnotations: "ExportAnnotations",
 *      importFormFields: "ImportFormFields",
 *      exportFormFields: "ExportFormFields",
 *      renderTexts: "RenderPdfTexts"
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class ServerActionSettings extends ChildProperty<ServerActionSettings> {
    /**
     * specifies the load action of PdfViewer.
     */
    @Property('Load')
    public load: string;

    /**
     * specifies the unload action of PdfViewer.
     */
    @Property('Unload')
    public unload: string;

    /**
     * specifies the render action of PdfViewer.
     */
    @Property('RenderPdfPages')
    public renderPages: string;

    /**
     * specifies the print action of PdfViewer.
     */
    @Property('RenderPdfPages')
    public print: string;

    /**
     * specifies the download action of PdfViewer.
     */
    @Property('Download')
    public download: string;

    /**
     * specifies the download action of PdfViewer.
     */
    @Property('RenderThumbnailImages')
    public renderThumbnail: string;

    /**
     * specifies the annotation comments action of PdfViewer.
     */
    @Property('RenderAnnotationComments')
    public renderComments: string;

    /**
     * specifies the imports annotations action of PdfViewer.
     */
    @Property('ImportAnnotations')
    public importAnnotations: string;

    /**
     * specifies the export annotations action of PdfViewer.
     */
    @Property('ExportAnnotations')
    public exportAnnotations: string;

    /**
     * specifies the imports action of PdfViewer.
     */
    @Property('ImportFormFields')
    public importFormFields: string;

    /**
     * specifies the export action of PdfViewer.
     */
    @Property('ExportFormFields')
    public exportFormFields: string;

    /**
     * specifies the export action of PdfViewer.
     */
    @Property('RenderPdfTexts')
    public renderTexts: string;

}

/**
 * The `StrikethroughSettings` module is used to provide the properties to Strikethrough annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the strike through annotation settings.
 *  viewer.strikethroughSettings = { 
 *      opacity: 1, 
 *      color: '#ff0000', 
 *      author: 'Guest', 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges 
 *      }, 
 *      isLock: false, 
 *      enableMultiPageAnnotation: false, 
 *      enableTextMarkupResizer: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class StrikethroughSettings extends ChildProperty<StrikethroughSettings> {

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;
    
    /**
     * Get or set bounds of the annotation.
     *
     * @default []
     */
    public bounds: IAnnotationPoint[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the color of the annotation.
     */
    @Property('#ff0000')
    public color: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked strikethrough annotations.
     * IsLock can be configured using strikethrough settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `UnderlineSettings` module is used to provide the properties to Underline annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the underline annotation settings.
 *  viewer.underlineSettings = { 
 *      opacity: 1, 
 *      color: '#9c2592', 
 *      author: 'Guest', 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges 
 *      }, 
 *      isLock: false, 
 *      enableMultiPageAnnotation: false, 
 *      enableTextMarkupResizer: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class UnderlineSettings extends ChildProperty<UnderlineSettings> {

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set bounds of the annotation.
     *
     * @default []
     */
     public bounds: IAnnotationPoint[];
    
    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the color of the annotation.
     */
    @Property('#00ff00')
    public color: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked underline annotations.
     * IsLock can be configured using underline settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `HighlightSettings` module is used to provide the properties to Highlight annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the highlight annotation settings.
 *  viewer.highlightSettings = { 
 *      opacity: 1, 
 *      color: '#ff0000', 
 *      author: 'Guest', 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges 
 *      }, 
 *      isLock: false, 
 *      enableMultiPageAnnotation: false, 
 *      enableTextMarkupResizer: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class HighlightSettings extends ChildProperty<HighlightSettings> {

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set bounds of the annotation.
     *
     * @default []
     */
     public bounds: IAnnotationPoint[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the color of the annotation.
     */
    @Property('#ffff00')
    public color: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using highlight settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `LineSettings` module is used to provide the properties to line annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the line annotation settings.
 *  viewer.lineSettings = { 
 *      opacity: 1, 
 *      color: '#9c2592', 
 *      author: 'Guest', 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges 
 *      }, 
 *      isLock: false, 
 *      enableMultiPageAnnotation: false, 
 *      enableTextMarkupResizer: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class LineSettings extends ChildProperty<LineSettings> {
    /**
     * Get or set offset of the annotation.
     */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    @Property(1)
    public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head end style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using line settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `ArrowSettings` module is used to provide the properties to arrow annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the arrow annotation settings.
 *  viewer.arrowSettings = { 
 *      opacity: 1, 
 *      fillColor: '#9c2592', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      borderDashArray: 0, 
 *      lineHeadStartStyle: 'Closed', 
 *      lineHeadEndStyle: 'Closed', 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '',
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class ArrowSettings extends ChildProperty<ArrowSettings> {
    /**
     * Get or set offset of the annotation.
     */
    @Property({ x: 0, y: 0})
    public offset: IPoint;
 
    /**
      * Get or set page number of the annotation.
      */
    @Property(1)
    public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked arrow annotations.
     * IsLock can be configured using arrow settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `RectangleSettings` module is used to provide the properties to rectangle annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the rectangle annotation settings.
 *  viewer.rectangleSettings = { 
 *      opacity: 1, 
 *      fillColor: '#9c2592', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class RectangleSettings extends ChildProperty<RectangleSettings> {
    /**
     * Get or set offset of the annotation.
     */
     @Property({ x: 0, y: 0})
     public offset: IPoint;
 
     /**
      * Get or set page number of the annotation.
      */
     @Property(1)
     public pageNumber: number;
 
     /**
      * specifies the width of the annotation.
      */
     @Property(100)
     public width: number;
  
     /**
      * specifies the height of the annotation.
      */
     @Property(50)
     public height: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked rectangle annotations.
     * IsLock can be configured using rectangle settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `CircleSettings` module is used to provide the properties to circle annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the circle annotation settings.
 *  viewer.circleSettings = { 
 *      opacity: 1, 
 *      fillColor: '#9c2592', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class CircleSettings extends ChildProperty<CircleSettings> {
    /**
     * Get or set offset of the annotation.
     */
     @Property({ x: 0, y: 0})
     public offset: IPoint;
 
     /**
      * Get or set page number of the annotation.
      */
     @Property(1)
     public pageNumber: number;
 
     /**
      * specifies the width of the annotation.
      */
     @Property(100)
     public width: number;
  
     /**
      * specifies the height of the annotation.
      */
     @Property(100)
     public height: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked circle annotations.
     * IsLock can be configured using circle settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `ShapeLabelSettings` module is used to provide the properties to rectangle annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the shape label settings.
 *  viewer.shapeLabelSettings = { 
 *      opacity: 1, 
 *      fillColor: '#9c2592', 
 *      borderColor: '#ff0000', 
 *      fontColor: '#000', 
 *      fontSize: 16, 
 *      labelHeight: 24.6, 
 *      labelMaxWidth: 151, 
 *      labelContent: 'Label' 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class ShapeLabelSettings extends ChildProperty<ShapeLabelSettings> {
    /**
     * specifies the opacity of the label.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the label.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the border color of the label.
     */
    @Property('#000')
    public fontColor: string;
    /**
     * specifies the font size of the label.
     */
    @Property(16)
    public fontSize: number;
    /**
     * specifies the max-width of the label.
     */
    @Property('Helvetica')
    public fontFamily: string;
    /**
     * specifies the default content of the label.
     */
    @Property('Label')
    public labelContent: string;
    /**
     * specifies the default content of the label.
     */
    @Property('')
    public notes: string;
}

/**
 * The `PolygonSettings` module is used to provide the properties to polygon annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the polygon annotation settings.
 *  viewer.polygonSettings = { 
 *      opacity: 1, 
 *      fillColor: '#4070FF', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class PolygonSettings extends ChildProperty<PolygonSettings> {
    /**
     * Get or set offset of the annotation.
     */
     @Property({ x: 0, y: 0})
     public offset: IPoint;
 
     /**
      * Get or set page number of the annotation.
      */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked polygon annotations.
     * IsLock can be configured using polygon settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `stampSettings` module is used to provide the properties to stamp annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the stamp annotation settings.
 *  viewer.stampSettings = { 
 *      opacity: 1, 
 *      author: 'Guest', 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'red', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 5, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      dynamicStamps: [
 *          DynamicStampItem.Revised, 
 *          DynamicStampItem.Reviewed, 
 *          DynamicStampItem.Received, 
 *          DynamicStampItem.Confidential, 
 *          DynamicStampItem.Approved, 
 *          DynamicStampItem.NotApproved
 *      ], 
 *      signStamps: [
 *          SignStampItem.Witness, 
 *          SignStampItem.InitialHere, 
 *          SignStampItem.SignHere, 
 *          SignStampItem.Accepted, 
 *          SignStampItem.Rejected
 *      ], 
 *      standardBusinessStamps: [
 *          StandardBusinessStampItem.Approved, 
 *          StandardBusinessStampItem.NotApproved, 
 *          StandardBusinessStampItem.Draft, 
 *          StandardBusinessStampItem.Final, 
 *          StandardBusinessStampItem.Completed, 
 *          StandardBusinessStampItem.Confidential, 
 *          StandardBusinessStampItem.ForPublicRelease, 
 *          StandardBusinessStampItem.NotForPublicRelease, 
 *          StandardBusinessStampItem.ForComment, 
 *          StandardBusinessStampItem.Void, 
 *          StandardBusinessStampItem.PreliminaryResults, 
 *          StandardBusinessStampItem.InformationOnly
 *      ], 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class StampSettings extends ChildProperty<StampSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    @Property(1)
    public pageNumber: number;

    /**
     * specifies the width of the annotation.
     */
    @Property(150)
    public width: number;
 
    /**
     * specifies the height of the annotation.
     */
    @Property(50)
    public height: number;
     
    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Provide option to define the required dynamic stamp items to be displayed in annotation toolbar menu.
     */
    @Property([])
    public dynamicStamps: DynamicStampItem[];

    /**
     * Provide option to define the required sign stamp items to be displayed in annotation toolbar menu.
     */
    @Property([])
    public signStamps: SignStampItem[];

    /**
     * Provide option to define the required standard business stamp items to be displayed in annotation toolbar menu.
     */
    @Property([])
    public standardBusinessStamps: StandardBusinessStampItem[];

    /**
     * Gets or sets the allowed interactions for the locked stamp annotations.
     * IsLock can be configured using stamp settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `CustomStampSettings` module is used to provide the properties to customstamp annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 * 
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the custom stamp annotation settings.
 *  viewer.customStampSettings = { 
 *      opacity: 1, 
 *      author: 'Guest', 
 *      width: 0, 
 *      height: 0, 
 *      left: 0, 
 *      top: 0, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      enableCustomStamp: true, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class CustomStampSettings extends ChildProperty<CustomStampSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    @Property(1)
    public pageNumber: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the width of the annotation.
     */
    @Property(0)
    public width: number;

    /**
     * specifies the height of the annotation.
     */
    @Property(0)
    public height: number;

    /**
     * specifies the left position of the annotation.
     */
    @Property(0)
    public left: number;
    /**
     * specifies the top position of the annotation.
     */
    @Property(0)
    public top: number;
    /**
     * Specifies to maintain the newly added custom stamp element in the menu items.
     */
    @Property(false)
    public isAddToMenu: boolean;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Define the custom image path and it's name to be displayed in the menu items.
     */
    @Property('')
    public customStamps: CustomStampModel[];

    /**
     * If it is set as false. then the custom stamp items won't be visible in the annotation toolbar stamp menu items.
     */
    @Property(true)
    public enableCustomStamp: boolean;

    /**
     * Gets or sets the allowed interactions for the locked custom stamp annotations.
     * IsLock can be configured using custom stamp settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `DistanceSettings` module is used to provide the properties to distance calibrate annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 * 
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the distance annotation settings.
 *  viewer.distanceSettings = { 
 *      opacity: 1, 
 *      fillColor: '#4070FF', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      borderDashArray: 0, 
 *      lineHeadStartStyle: 'Closed',
 *      lineHeadEndStyle: 'Closed', 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Square', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      leaderLength: 40, 
 *      resizeCursorType: CursorType.move, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class DistanceSettings extends ChildProperty<DistanceSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ff0000')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the leader length of the annotation.
     */
    @Property(40)
    public leaderLength: number;

    /**
     * Defines the cursor type for distance annotation.
     */
    @Property(CursorType.move)
    public resizeCursorType: CursorType;

    /**
     * Gets or sets the allowed interactions for the locked distance annotations.
     * IsLock can be configured using distance settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `PerimeterSettings` module is used to provide the properties to perimeter calibrate annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the perimeter annotation settings.
 *  viewer.perimeterSettings = { 
 *      opacity: 1, 
 *      fillColor: '#4070FF', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      borderDashArray: 0, 
 *      lineHeadStartStyle: 'Open', 
 *      lineHeadEndStyle: 'Open', 
 *      minHeight: 0, minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#4070FF', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class PerimeterSettings extends ChildProperty<PerimeterSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Gets or sets the allowed interactions for the locked perimeter annotations.
     * IsLock can be configured using perimeter settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `AreaSettings` module is used to provide the properties to area calibrate annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the area annotation settings.
 *  viewer.areaSettings = { 
 *      opacity: 1, 
 *      fillColor: '#4070FF', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#4070FF', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class AreaSettings extends ChildProperty<AreaSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Gets or sets the allowed interactions for the locked area annotations.
     * IsLock can be configured using area settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `RadiusSettings` module is used to provide the properties to radius calibrate annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the radius annotation settings.
 *  viewer.radiusSettings = { 
 *      opacity: 1, 
 *      fillColor: '#4070FF', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'red', 
 *          resizerFillColor: '#4070FF', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class RadiusSettings extends ChildProperty<RadiusSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the width of the annotation.
     */
     @Property(100)
     public width: number;
 
     /**
      * specifies the height of the annotation.
      */
     @Property(90)
     public height: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked radius annotations.
     * IsLock can be configured using area settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `VolumeSettings` module is used to provide the properties to volume calibrate annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the volume annotation settings.
 *  viewer.volumeSettings = { 
 *      opacity: 1,
 *      fillColor: '#4070FF', 
 *      strokeColor: '#ff0000', 
 *      author: 'Guest', 
 *      thickness: 1,
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#4070FF', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class VolumeSettings extends ChildProperty<VolumeSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;
    
    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Gets or sets the allowed interactions for the locked volume annotations.
     * IsLock can be configured using volume settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}
/**
 * The `Ink` module is used to provide the properties to Ink annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the ink annotation settings.
 *  viewer.inkAnnotationSettings = { 
 *      author: 'Guest', 
 *      opacity: 1, 
 *      strokeColor: '#ff0000', 
 *      thickness: 1, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class InkAnnotationSettings extends ChildProperty<InkAnnotationSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the width of the annotation.
     */
     @Property(0)
     public width: number;
 
     /**
      * specifies the height of the annotation.
      */
     @Property(0)
     public height: number;

    /**
      * Gets or sets the path of the ink annotation.
      */
     @Property(0)
     public path: string;

    /**
     * Sets the opacity value for ink annotation.By default value is 1. It range varies from 0 to 1.
     */
    @Property(1)
    public opacity: number;

    /**
     * Sets the stroke color for ink annotation.By default values is #FF0000.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * Sets the thickness for the ink annotation. By default value is 1. It range varies from 1 to 10.
     */
    @Property(1)
    public thickness: number;

    /**
     * Define the default option to customize the selector for ink annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * If it is set as true, can't interact with annotation. Otherwise can interact the annotations. By default it is false.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * Gets or sets the allowed interactions for the locked ink annotations.
     * IsLock can be configured using ink settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
    /**
     * specifies the custom data of the annotation
     */
    @Property(null)
    public customData: object;

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;

}
/**
 * The `stickyNotesSettings` module is used to provide the properties to sticky notes annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the sticky notes annotation settings.
 *  viewer.stickyNotesSettings = { 
 *      author: 'Guest', 
 *      opacity: 1, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'red', 
 *          resizerFillColor: '#4070FF', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class StickyNotesSettings extends ChildProperty<StickyNotesSettings> {

    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the lock action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Gets or sets the allowed interactions for the locked sticky notes annotations.
     * IsLock can be configured using sticky notes settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `MeasurementSettings` module is used to provide the settings to measurement annotations.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the measurement annotation settings.
 *  viewer.measurementSettings = { 
 *      conversionUnit: 'cm', 
 *      displayUnit: 'cm', 
 *      scaleRatio: 1, 
 *      depth: 96 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class MeasurementSettings extends ChildProperty<MeasurementSettings> {
    /**
     * specifies the scale ratio of the annotation.
     */
    @Property(1)
    public scaleRatio: number;

    /**
     * specifies the unit of the annotation.
     */
    @Property('in')
    public conversionUnit: CalibrationUnit;

    /**
     * specifies the unit of the annotation.
     */
    @Property('in')
    public displayUnit: CalibrationUnit;

    /**
     * specifies the depth of the volume annotation.
     */
    @Property(96)
    public depth: number;
}

/**
 * The `FreeTextSettings` module is used to provide the properties to free text annotation.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the free text annotation settings.
 *  viewer.freeTextSettings = { 
 *      opacity: 1, 
 *      fillColor: '#4070FF', 
 *      borderColor: '#4070FF', 
 *      author: 'Guest', 
 *      borderWidth: 1, 
 *      width: 151, 
 *      fontSize: 16, 
 *      height: 24.6, 
 *      fontColor: '#000', 
 *      fontFamily: 'Courier', 
 *      defaultText: 'Type Here', 
 *      textAlignment: 'Right', 
 *      fontStyle: FontStyle.Italic, 
 *      allowTextOnly: false, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      allowedInteractions: ['None'], 
 *      isPrint: true, 
 *      isReadonly: false, 
 *      enableAutoFit: false 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class FreeTextSettings extends ChildProperty<FreeTextSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the border color of the annotation.
     */
    @Property('#ffffff00')
    public borderColor: string;

    /**
     * specifies the border with of the annotation.
     */
    @Property(1)
    public borderWidth: number;

    /**
     * specifies the border style of the annotation.
     */
    @Property('solid')
    public borderStyle: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the background fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the text box font size of the annotation.
     */
    @Property(16)
    public fontSize: number;
    /**
     * specifies the width of the annotation.
     */
    @Property(151)
    public width: number;

    /**
     * specifies the height of the annotation.
     */
    @Property(24.6)
    public height: number;

    /**
     * specifies the text box font color of the annotation.
     */
    @Property('#000')
    public fontColor: string;

    /**
     * specifies the text box font family of the annotation.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * setting the default text for annotation.
     */
    @Property('TypeHere')
    public defaultText: string;

    /**
     * applying the font styles for the text.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Aligning the text in the annotation.
     */
    @Property('Left')
    public textAlignment: TextAlignment;

    /**
     * specifies the allow text only action of the free text annotation.
     */
    @Property(false)
    public allowEditTextOnly: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked free text annotations.
     * IsLock can be configured using free text settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;

    /**
     * Allow to edit the FreeText annotation. FALSE, by default.
     */
    @Property(false)
    public isReadonly: boolean;

    /**
     * Enable or disable auto fit mode for FreeText annotation in the Pdfviewer. FALSE by default.
     */
    @Property(false)
    public enableAutoFit: boolean;

}

/**
 * The `AnnotationSelectorSettings` module is used to provide the properties to annotation selectors.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the annotation selector settings.
 *  viewer.annotationSelectorSettings = { 
 *      selectionBorderColor: '', 
 *      resizerBorderColor: 'Circle', 
 *      resizerFillColor: '#4070FF',
 *      resizerSize: 8, 
 *      selectionBorderThickness: 1, 
 *      resizerShape: 'Square', 
 *      selectorLineDashArray: [], 
 *      resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *      resizerCursorType: null 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class AnnotationSelectorSettings extends ChildProperty<AnnotationSelectorSettings> {
    /**
     * Specifies the selection border color.
     */
    @Property('')
    public selectionBorderColor: string;

    /**
     * Specifies the border color of the resizer.
     *
     * @ignore
     */
    @Property('black')
    public resizerBorderColor: string;

    /**
     * Specifies the fill color of the resizer.
     *
     * @ignore
     */
    @Property('#FF4081')
    public resizerFillColor: string;

    /**
     * Specifies the size of the resizer.
     *
     * @ignore
     */
    @Property(8)
    public resizerSize: number;

    /**
     * Specifies the thickness of the border of selection.
     */
    @Property(1)
    public selectionBorderThickness: number;

    /**
     * Specifies the shape of the resizer.
     */
    @Property('Square')
    public resizerShape: AnnotationResizerShape;

    /**
     * Specifies the border dash array of the selection.
     */
    @Property('')
    public selectorLineDashArray: number[];

    /**
     * Specifies the location of the resizer.
     */
    @Property(AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges)
    public resizerLocation: AnnotationResizerLocation;

    /**
     * specifies the cursor type of resizer
     */
    @Property(null)
    public resizerCursorType: CursorType;
}

/**
 * The `TextSearchColorSettings` module is used to set the settings for the color of the text search highlight.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the text search color settings.
 *  viewer.textSearchColorSettings = { 
 *      searchHighlightColor: '#4070FF', 
 *      searchColor: '#FF4081' 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class TextSearchColorSettings extends ChildProperty<TextSearchColorSettings> {
    /**
     * Gets or Sets the color of the current occurrence of the text searched string.
     */
    @Property('#fdd835')
    public searchHighlightColor: string;

    /**
     * Gets or Sets the color of the other occurrence of the text searched string.
     */
    @Property('#8b4c12')
    public searchColor: string;
}

/**
 * The `HandWrittenSignatureSettings` module is used to provide the properties to handwritten signature.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the hand written signature settings.
 *  viewer.handWrittenSignatureSettings = { 
 *      signatureItem: [
 *          'Signature', 
 *          'Initial'
 *      ], 
 *      saveSignatureLimit: 1, 
 *      saveInitialLimit: 1, 
 *      opacity: 1, 
 *      strokeColor: '#000000', 
 *      width: 150, 
 *      height: 100, 
 *      thickness: 1, 
 *      annotationSelectorSettings: { 
 *          selectionBorderColor: '', 
 *          resizerBorderColor: 'black', 
 *          resizerFillColor: '#FF4081', 
 *          resizerSize: 8, 
 *          selectionBorderThickness: 1, 
 *          resizerShape: 'Circle', 
 *          selectorLineDashArray: [], 
 *          resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, 
 *          resizerCursorType: null 
 *      }, 
 *      allowedInteractions: ['None'], 
 *      signatureDialogSettings: {
 *          displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false 
 *      }, 
 *      initialDialogSettings: {
 *          displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, 
 *      hideSaveSignature: false
 *      } 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class HandWrittenSignatureSettings extends ChildProperty<HandWrittenSignatureSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#000000')
    public strokeColor: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property(1)
    public thickness: number;

    /**
     * specified the width of the annotation.
     */
    @Property(150)
    public width: number;

    /**
     * specified the height of the annotation.
     */
    @Property(100)
    public height: number;

    /**
     * Gets or sets the save signature limit of the signature. By default value is 1 and maximum limit is 5.
     */
    @Property(1)
    public saveSignatureLimit: number;

    /**
     * Gets or sets the save initial limit of the initial. By default value is 1 and maximum limit is 5.
     */
    @Property(1)
    public saveInitialLimit: number;

    /** 
     * Provide option to define the required signature items to be displayed in signature menu.
     */
    @Property([])
    public signatureItem: SignatureItem[];

    /** 
     * Options to set the type signature font name with respective index and maximum font name limit is 4 so key value should be 0 to 3.
     */
    @Property()
    public typeSignatureFonts: { [key: number]: string };

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Get or set the Signature DialogSettings for Handwritten signature.
     */
    @Property()
    public signatureDialogSettings: SignatureDialogSettingsModel;
    
    /**
     * Get or set the initialDialogSettings for Handwritten initial.
     */
    @Property()
    public initialDialogSettings: SignatureDialogSettingsModel;

}

/**
 * The `AnnotationSettings` module is used to provide the properties to annotations.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the annotation settings.
 *  viewer.annotationSettings = { 
 *      author: 'Guest', 
 *      minHeight: 0, 
 *      minWidth: 0, 
 *      maxWidth: 0, 
 *      maxHeight: 0, 
 *      isLock: false, 
 *      skipPrint: false, 
 *      skipDownload: false, 
 *      allowedInteractions: ['None'] 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class AnnotationSettings extends ChildProperty<AnnotationSettings> {
    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies whether the annotations are included or not in print actions.
     */
    @Property(false)
    public skipPrint: boolean;

    /**
     * specifies whether the annotations are included or not in download actions.
     */
    @Property(false)
    public skipDownload: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked annotations.
     * IsLock can be configured using annotation settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `DocumentTextCollectionSettings` module is used to provide the properties to DocumentTextCollection.
 */
export class DocumentTextCollectionSettings extends ChildProperty<DocumentTextCollectionSettings> {
    /**
     * specifies the text data of the document.
     */
    @Property()
    public textData: TextDataSettingsModel[];
    /**
     * specifies the page text of the document.
     */
    @Property()
    public pageText: string;
    /**
     * specifies the page size of the document.
     */
    @Property()
    public pageSize: number;
}

/**
 * The `TextDataSettings` module is used to provide the properties of text data.
 */
export class TextDataSettings extends ChildProperty<TextDataSettings> {
    /**
     * specifies the bounds of the rectangle.
     */
    @Property()
    public bounds: RectangleBoundsModel;
    /**
     * specifies the text of the document.
     */
    @Property()
    public text: string;
}

/**
 * The `RectangleBounds` module is used to provide the properties of rectangle bounds.
 */
export class RectangleBounds extends ChildProperty<RectangleBounds> {
    /**
     * specifies the size of the rectangle.
     */
    @Property()
    public size: number;
    /**
     * specifies the x co-ordinate of the upper-left corner of the rectangle.
     */
    @Property()
    public x: number;
    /**
     * specifies the y co-ordinate of the upper-left corner of the rectangle.
     */
    @Property()
    public y: number;
    /**
     * specifies the width of the rectangle.
     */
    @Property()
    public width: number;
    /**
     * specifies the height of the rectangle.
     */
    @Property()
    public height: number;
    /**
     * specifies the left value of the rectangle.
     */
    @Property()
    public left: number;
    /**
     * specifies the top value of the rectangle.
     */
    @Property()
    public top: number;
    /**
     * specifies the right of the rectangle.
     */
    @Property()
    public right: number;
    /**
     * specifies the bottom value of the rectangle.
     */
    @Property()
    public bottom: number;
    /**
     * Returns true if height and width of the rectangle is zero.
     *
     * @default 'false'
     */
    @Property()
    public isEmpty: boolean;
}

/**
 * The `TileRenderingSettings` module is used to provide the tile rendering settings of the PDF viewer.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the tile rendering settings.
 *  viewer.tileRenderingSettings = { 
 *      enableTileRendering: false, 
 *      x: 0, 
 *      y: 0
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class TileRenderingSettings extends ChildProperty<TileRenderingSettings> {
    /**
     * Enable or disables tile rendering mode in the PDF Viewer.
     */
    @Property(true)
    public enableTileRendering: boolean;

    /**
     * specifies the tileX count of the render Page.
     */
    @Property(0)
    public x: number;

    /**
     * specifies the tileY count of the render Page.
     */
    @Property(0)
    public y: number;
}
/**
 * The `ScrollSettings` module is used to provide the settings of the scroll of the PDF viewer.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the scroll settings.
 *  viewer.scrollSettings = { 
 *      delayPageRequestTimeOnScroll: 150 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class ScrollSettings extends ChildProperty<ScrollSettings> {
    /**
     * Increase or decrease the delay time.
     */
    @Property(100)
    public delayPageRequestTimeOnScroll: number;
}
/**
 * The `FormField` is used to store the form fields of PDF document.
 */
export class FormField extends ChildProperty<FormField> {
    /**
     * Gets the name of the form field.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the check box is in checked state or not.
     */
    @Property(false)
    public isChecked: boolean;
    
    /**
     * Specifies whether the radio button is in checked state or not.
     */
    @Property(false)
    public isSelected: boolean;

    /**
     * Gets the id of the form field.
     */
    @Property('')
    public id: string;

    /**
     * Gets or sets the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Gets the type of the form field.
     */
    @Property('')
    public type: FormFieldType;

    /**
     * If it is set as true, can't edit the form field in the PDF document. By default it is false.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * specifies the type of the signature.
     */
    @Property([''])
    public signatureType: SignatureType[];

    /**
     * specifies the fontName of the signature.
     */
    @Property('')
    public fontName: string;

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the font family of the form field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the form field.
     */
    @Property(10)
    public fontSize: number;
   
    /**
     * Get or set the font Style of form field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the form field in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the form field in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the text alignment of the form field.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * Get or set the maximum character length.
     */
    @Property(0)
    public maxLength: number;

    /**
     * Gets or set the is Required of form field.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the form field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the form field items. This can be Dropdown items or Listbox items.
     */
    @Property('')
    public options: ItemModel[];

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    @Property()
    public signatureIndicatorSettings: SignatureIndicatorSettingsModel;

    /**
     * Get or set the thickness of the form field.
     */
    @Property(1)
    public thickness: number;
     
    /**
     * Get or set the border color of the form field.
     */
    @Property('#303030')
    public borderColor: string;

    /**
     * Allows multiline input in the text field. FALSE, by default.
     */
    @Property(false)
    public isMultiline: boolean;

    /**
     * Meaningful only if the MaxLength property is set and the Multiline, Password properties are false. 
     * If set, the field is automatically divided into as many equally spaced position, or  combs, as the value of MaxLength, and the text is laid out into the combs.
     * 
     * @default false
     */
    @Property(false)
    private insertSpaces: boolean;

    /**
     * Get the pageIndex of the form field. Default value is -1.
     */
    @Property(-1)
    public pageIndex: number;
}
/**
 * The `ContextMenuSettings` is used to show the context menu of PDF document.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the settings of the context menu option.
 *  viewer.contextMenuSettings = { 
 *      contextMenuAction: 'RightClick', 
 *      contextMenuItems: [
 *          ContextMenuItem.Comment, 
 *          ContextMenuItem.Copy, 
 *          ContextMenuItem.Cut, 
 *          ContextMenuItem.Delete, 
 *          ContextMenuItem.Highlight, 
 *          ContextMenuItem.Paste, 
 *          ContextMenuItem.Properties, 
 *          ContextMenuItem.ScaleRatio, 
 *          ContextMenuItem.Strikethrough, 
 *          ContextMenuItem.Underline
 *         ] 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class ContextMenuSettings extends ChildProperty<ContextMenuSettings> {
    /**
     * Defines the context menu action.
     *
     * @default RightClick
     */
    @Property('RightClick')
    public contextMenuAction: ContextMenuAction;

    /**
     * Defines the context menu items should be visible in the PDF Viewer.
     *
     *  @default []
     */
    @Property([])
    public contextMenuItems: ContextMenuItem[];
}

/**
 * The `TextFieldSettings` is used to to show and customize the appearance of text box HTML element.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the text field settings.
 *  viewer.textFieldSettings = { 
 *      name: '', 
 *      value: '', 
 *      fontFamily: 'Courier', 
 *      fontSize: 10, 
 *      fontStyle: 'None', 
 *      color: 'black', 
 *      borderColor: 'black', 
 *      backgroundColor: 'white', 
 *      alignment: 'Right', 
 *      isReadOnly: false, 
 *      visibility: 'visible', 
 *      maxLength: 0, 
 *      isRequired: false, 
 *      isPrint: true, 
 *      tooltip: '', 
 *      thickness: 1, 
 *      isMultiline: false 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class TextFieldSettings extends ChildProperty<TextFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Get or set the font family of the textbox field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the textbox field.
     */
    @Property(10)
    public fontSize: number;
    
    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font Style of textbox field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the textbox in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the textbox in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the textbox field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * Get or set the maximum character length.
     */
    @Property(0)
    public maxLength: number;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the textbox field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the thickness of the textbox field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the textbox field.
     */
    @Property('#303030')
    public borderColor: string;

    /**
     * Allows multiline input in the text field. FALSE, by default.
     */
     @Property(false)
     public isMultiline: boolean;
}

/**
 * The `PasswordFieldSettings` is used to to show and customize the appearance of password input HTML element.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the password field settings.
 *  viewer.passwordFieldSettings = { 
 *      name: '', 
 *      value: '', 
 *      fontFamily: 'Courier', 
 *      fontSize: 10, 
 *      fontStyle: 'None', 
 *      color: 'black', 
 *      borderColor: 'black', 
 *      backgroundColor: 'white', 
 *      alignment: 'Right',
 *      isReadOnly: false, 
 *      visibility: 'visible', 
 *      maxLength: 0, 
 *      isRequired: false, 
 *      isPrint: true, 
 *      tooltip: '', 
 *      thickness: 1 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
 export class PasswordFieldSettings extends ChildProperty<PasswordFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font family of the password field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the password field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * Get or set the font Style of password field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the password field in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the password field in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the password field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * Get or set the maximum character length.
     */
    @Property(0)
    public maxLength: number;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the password field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the thickness of the password field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the password field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `CheckBoxFieldSettings` is used to to show and customize the appearance of check box element.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the check box field settings.
 *  viewer.checkBoxFieldSettings = { 
 *      name: '', 
 *      isChecked: true, 
 *      backgroundColor: 'white', 
 *      isReadOnly: false, 
 *      visibility: 'visible',  
 *      isPrint: true, 
 *      tooltip: '', 
 *      isRequired: false, 
 *      thickness: 5, 
 *      borderColor: 'black' 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
 export class CheckBoxFieldSettings extends ChildProperty<CheckBoxFieldSettings> {
    
    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the check box.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the check box is in checked state or not.
     */
    @Property(false)
    public isChecked: boolean;

    /**
     * Get or set the background color of the check box in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Specifies whether the check box field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * Get or set the boolean value to print the check box field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the thickness of the check box field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the check box field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `RadioButtonFieldSettings` is used to to show and customize the appearance of radio button element.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the radio button field settings.
 *  viewer.radioButtonFieldSettings = { 
 *      name: '',
 *      isSelected: false, 
 *      backgroundColor: 'white', 
 *      isReadOnly: false, 
 *      visibility: 'visible',  
 *      isPrint: true, 
 *      tooltip: '', 
 *      isRequired: false, 
 *      thickness: 1, 
 *      borderColor: 'black' 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
 export class RadioButtonFieldSettings extends ChildProperty<RadioButtonFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the radio button is in checked state or not.
     */
    @Property(false)
    public isSelected: boolean;

    /**
     * Get or set the background color of the radio button in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Specifies whether the radio button field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * Get or set the boolean value to print the radio button field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the thickness of the radio button field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the radio button field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `DropdownFieldSettings` is used to to show and customize the appearance of drop down element.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the drop down field settings.
 *  viewer.DropdownFieldSettings = { 
 *      name: '', 
 *      isSelected: false, 
 *      backgroundColor: 'white', 
 *      isReadOnly: true, 
 *      visibility: 'visible', 
 *      isPrint: true,  
 *      tooltip: '', 
 *      isRequired: false, 
 *      thickness: 5, 
 *      borderColor: 'blue' 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
 export class DropdownFieldSettings extends ChildProperty<DropdownFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the dropdown.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Get or set the font family of the dropdown field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the dropdown field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font style of dropdown field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the dropdown in hexadecimal string format..
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the dropdown in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the dropdown field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the dropdown field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the dropdown items.
     */
    @Property('')
    public options: ItemModel[];

    /**
     * Get or set the thickness of the drop down field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the drop down field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `ListBoxFieldSettings` is used to to show and customize the appearance of list box element.
 * 
 * ```html
 * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
 * ```
 * ```ts
 *  let viewer: PdfViewer = new PdfViewer();
 *  // Change the list box field settings.
 *  viewer.listBoxFieldSettings = { 
 *      name: '', 
 *      fontFamily: 'Courier', 
 *      fontSize: 5, 
 *      fontStyle: 'None', 
 *      color: 'black', 
 *      backgroundColor: 'white', 
 *      alignment: 'Right', 
 *      isReadOnly: false, 
 *      visibility: 'visible', 
 *      isRequired: false, 
 *      isPrint: false, 
 *      tooltip: '', 
 *      options: [], 
 *      thickness: 1, 
 *      borderColor: 'black' 
 *  };
 *  viewer.appendTo("#pdfViewer");
 * ```
 * 
 */
export class ListBoxFieldSettings extends ChildProperty<ListBoxFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Get or set the font family of the listbox field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the listbox field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font Style of listbox field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the listbox in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the listbox in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the listbox field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: Visibility;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the listbox field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tool tip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the listbox items.
     */
    @Property([])
    public options: ItemModel[];

    /**
     * Get or set the thickness of the list box field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the list box field.
     */
    @Property('#303030')
    public borderColor: string;
}

export class Item extends ChildProperty<Item> {
    /**
     * Get or set the name.
     */
     @Property('')
     public itemName: string;

    /**
     * Get or set the value.
     */
      @Property('')
      public itemValue: string;
}

/**
 * Represents the PDF viewer component.
 * ```html
 * <div id="pdfViewer"></div>
 * <script>
 *  var pdfViewerObj = new PdfViewer();
 *  pdfViewerObj.appendTo("#pdfViewer");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class PdfViewer extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the service url of the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/serviceUrl/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property()
    public serviceUrl: string;

    /**
     * gets the page count of the document loaded in the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/pageCount/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public pageCount: number;

    /**
     * Checks whether the PDF document is edited.
     * 
     * {% codeBlock src='pdfviewer/isDocumentEdited/index.md' %}{% endcodeBlock %}
     *
     * @asptype bool
     * @blazorType bool
     */
    @Property(false)
    public isDocumentEdited: boolean;

    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/currentPageNumber/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public currentPageNumber: number;

    /**
     * Sets the PDF document path for initial loading.
     * 
     * {% codeBlock src='pdfviewer/documentPath/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property()
    public documentPath: string;

    /**
     * Returns the current zoom percentage of the PdfViewer control.
     *
     * @asptype int
     * @blazorType int
     */
    public get zoomPercentage(): number {
        return this.magnificationModule.zoomFactor * 100;
    }

    /**
     * Get the Loaded document annotation Collections in the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/annotationCollection/index.md' %}{% endcodeBlock %}
     *
     */
    // eslint-disable-next-line
    public annotationCollection: any[];

    /**
     * Get the Loaded document formField Collections in the PdfViewer control.
     * 
     * @private
     */
    // eslint-disable-next-line
    public formFieldCollection: any[];


    /**
     * Get the Loaded document signature Collections in the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/signatureCollection/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line
    public signatureCollection: any[] = [];

    /**
     * Gets or sets the document name loaded in the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/fileName/index.md' %}{% endcodeBlock %}
     * 
     */
    public fileName: string = null;

    /**
     * Gets or sets the export annotations JSON file name in the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/exportAnnotationFileName/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property(null)
    public exportAnnotationFileName: string;

    /**
     * Gets or sets the download file name in the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/downloadFileName/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property()
    public downloadFileName: string;

    /**
     * Defines the scrollable height of the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/height/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Defines the scrollable width of the PdfViewer control.
     * 
     * {% codeBlock src='pdfviewer/width/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**
     * Enable or disables the toolbar of PdfViewer.
     * 
     * {% codeBlock src='pdfviewer/enableToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableToolbar: boolean;

    /**
     * Specifies the retry count for the failed requests.
     * 
     * {% codeBlock src='pdfviewer/retryCount/index.md' %}{% endcodeBlock %}
     *
     * @default 1
     */
    @Property(1)
    public retryCount: number;

    /**
     * Specifies the response status codes for retrying a failed request with a "3xx", "4xx", or "5xx" response status code.
     * The value can have multiple values, such as [500, 401, 400], and the default value is 500.
     * 
     * {% codeBlock src='pdfviewer/retryStatusCodes/index.md' %}{% endcodeBlock %}
     *
     * @default [500]
     */
    @Property([500])
    public retryStatusCodes: number[];

    /**
     * Gets or sets the timeout for retries in seconds.
     * 
     * {% codeBlock src='pdfviewer/retryTimeout/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public retryTimeout: number;

    /**
     * Initially renders the first N pages of the PDF document when the document is loaded.
     * 
     * {% codeBlock src='pdfviewer/initialRenderPages/index.md' %}{% endcodeBlock %}
     *
     * @default 2
     */
    @Property(2)
    public initialRenderPages: number;

    /**
     * If it is set as false then error message box is not displayed in PDF viewer control.
     * 
     * {% codeBlock src='pdfviewer/showNotificationDialog/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public showNotificationDialog: boolean;

    /**
     * Enable or disables the Navigation toolbar of PdfViewer.
     * 
     * {% codeBlock src='pdfviewer/enableNavigationToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableNavigationToolbar: boolean;

    /**
     * Enable or disables the Comment Panel of PdfViewer.
     * 
     * {% codeBlock src='pdfviewer/enableCommentPanel/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableCommentPanel: boolean;

    /**
     * If it set as true, then the command panel show at initial document loading in the PDF viewer
     * 
     * {% codeBlock src='pdfviewer/isCommandPanelOpen/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isCommandPanelOpen: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * 
     * {% codeBlock src='pdfviewer/enableTextMarkupResizer/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Enable or disable the multi line text markup annotations in overlapping collections.
     * 
     * {% codeBlock src='pdfviewer/enableMultiLineOverlap/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableMultiLineOverlap: boolean;

    /**
     * Checks if the freeText value is valid or not.
     * 
     * {% codeBlock src='pdfviewer/isValidFreeText/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isValidFreeText: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     *
     * @deprecated This property renamed into "isAnnotationToolbarVisible"
     * @default false
     */
    @Property(false)
    public isAnnotationToolbarOpen: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially
     * and get the annotation Toolbar Visible status.
     * 
     * {% codeBlock src='pdfviewer/isAnnotationToolbarVisible/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isAnnotationToolbarVisible: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially
     * and get the annotation Toolbar Visible status.
     * 
     * {% codeBlock src='pdfviewer/isFormDesignerToolbarVisible/index.md' %}{% endcodeBlock %}
     *
     * @public
     * @default false
     */
    @Property(false)
    public isFormDesignerToolbarVisible: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     * 
     * {% codeBlock src='pdfviewer/enableMultiPageAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disables the download option of PdfViewer.
     * 
     * {% codeBlock src='pdfviewer/enableDownload/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableDownload: boolean;

    /**
     * Enable or disables the print option of PdfViewer.
     * 
     * {% codeBlock src='pdfviewer/enablePrint/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enablePrint: boolean;

    /**
     * If it is set as FALSE, will suppress the page rotation of Landscape document on print action. By default it is TRUE.
     *
     * {% codeBlock src='pdfviewer/enablePrintRotation/index.md' %}{% endcodeBlock %}
     * 
     * @default true
     */
    @Property(true)
    public enablePrintRotation: boolean;

    /**
     * Enables or disables the thumbnail view in the PDF viewer
     * 
     * {% codeBlock src='pdfviewer/enableThumbnail/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableThumbnail: boolean;

    /**
     * If it set as true, then the thumbnail view show at initial document loading in the PDF viewer
     * 
     * {% codeBlock src='pdfviewer/isThumbnailViewOpen/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isThumbnailViewOpen: boolean;

    /**
     * Enables or disable saving Hand Written signature as editable in the PDF.
     * 
     * {% codeBlock src='pdfviewer/isSignatureEditable/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isSignatureEditable: boolean;

    /**
     * Enables or disables the bookmark view in the PDF viewer
     * 
     * {% codeBlock src='pdfviewer/enableBookmark/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableBookmark: boolean;

    /**
     * Enables or disables the bookmark styles in the PDF viewer
     * 
     * {% codeBlock src='pdfviewer/enableBookmarkStyles/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableBookmarkStyles: boolean;

    /**
     * Enables or disables the hyperlinks in PDF document.
     * 
     * {% codeBlock src='pdfviewer/enableHyperlink/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableHyperlink: boolean;

    /**
     * Enables or disables the handwritten signature in PDF document.
     * 
     * {% codeBlock src='pdfviewer/enableHandwrittenSignature/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableHandwrittenSignature: boolean;
    /**
     * If it is set as false, then the ink annotation support in the PDF Viewer will be disabled. By default it is true.
     *
     * {% codeBlock src='pdfviewer/enableInkAnnotation/index.md' %}{% endcodeBlock %}
     * 
     * @default true
     */
    @Property(true)
    public enableInkAnnotation: boolean;
    /**
     * restrict zoom request.
     * 
     * {% codeBlock src='pdfviewer/restrictZoomRequest/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public restrictZoomRequest: boolean;
    /**
     * Specifies the open state of the hyperlink in the PDF document.
     * 
     * {% codeBlock src='pdfviewer/hyperlinkOpenState/index.md' %}{% endcodeBlock %}
     *
     * @default CurrentTab
     */
    @Property('CurrentTab')
    public hyperlinkOpenState: LinkTarget;

    /**
     * Specifies the state of the ContextMenu in the PDF document.
     * 
     * {% codeBlock src='pdfviewer/contextMenuOption/index.md' %}{% endcodeBlock %}
     * 
     * @default RightClick
     */
    @Property('RightClick')
    public contextMenuOption: ContextMenuAction;

    /**
     * Disables the menu items in the context menu.
     * 
     * {% codeBlock src='pdfviewer/disableContextMenuItems/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public disableContextMenuItems: ContextMenuItem[];

    /**
     * Gets the form fields present in the loaded PDF document. It used to get the form fields id, name, type and it's values.
     * 
     * {% codeBlock src='pdfviewer/formFieldCollections/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ name: '', id: '', type: '', isReadOnly: false, isSelected: false, isChecked: false, value: '', signatureType: [''], fontName: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', backgroundColor: 'white', alignment: 'Left', visibility: 'visible', maxLength: 0, isRequired: false, isPrint: false, tooltip: '', pageIndex: -1, options: [], signatureIndicatorSettings: { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' } })
    public formFieldCollections: FormFieldModel[];

    /**
     * Enable or disable the Navigation module of PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableNavigation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableNavigation: boolean;

    /**
     * Enable or disables the auto complete option in form documents.
     * 
     * {% codeBlock src='pdfviewer/enableAutoComplete/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableAutoComplete: boolean;

    /**
     * Enable or disable the Magnification module of PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableMagnification/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableMagnification: boolean;

    /**
     * Enable or disable the Label for shapeAnnotations of PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableShapeLabel/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableShapeLabel: boolean;

    /**
     * Enable or disable the customization of measure values in PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableImportAnnotationMeasurement/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableImportAnnotationMeasurement: boolean;

    /**
     * Enable or disable the pinch zoom option in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enablePinchZoom/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enablePinchZoom: boolean;

    /**
     * Enable or disable the text selection in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableTextSelection/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableTextSelection: boolean;

    /**
     * Enable or disable the text search in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableTextSearch/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableTextSearch: boolean;

    /**
     * Enable or disable the annotation in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableAnnotation: boolean;

    /**
     * Enable or disable the form fields in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableFormFields/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableFormFields: boolean;

    /**
     * Show or hide the form designer tool in the main toolbar of the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableFormDesigner/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableFormDesigner: boolean;

    /**
     * Enable or disable the interaction of form fields in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/designerMode/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public designerMode: boolean;

    /**
     * Enable or disable the form fields validation.
     * 
     * {% codeBlock src='pdfviewer/enableFormFieldsValidation/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableFormFieldsValidation: boolean;

    /**
     * Enable if the PDF document contains form fields.
     * 
     * {% codeBlock src='pdfviewer/isFormFieldDocument/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isFormFieldDocument: boolean;

    /**
     * Gets or sets a boolean value to show or hide desktop toolbar in mobile devices.
     *
     * {% codeBlock src='pdfviewer/enableDesktopMode/index.md' %}{% endcodeBlock %}
     * 
     * @default false
     */
    @Property(false)
    public enableDesktopMode: boolean;

    /**
     * Gets or sets a boolean value to show or hide the save signature check box option in the signature dialog.
     * FALSE by default
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public hideSaveSignature: boolean;

    /**
     * Enable or disable the free text annotation in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableFreeText/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableFreeText: boolean;

    /**
     * Enable or disable the text markup annotation in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableTextMarkupAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableTextMarkupAnnotation: boolean;

    /**
     * Enable or disable the shape annotation in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableShapeAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableShapeAnnotation: boolean;

    /**
     * Enable or disable the calibrate annotation in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableMeasureAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableMeasureAnnotation: boolean;

    /**
     * Enables and disable the stamp annotations when the PDF viewer control is loaded initially.
     * 
     * {% codeBlock src='pdfviewer/enableStampAnnotations/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableStampAnnotations: boolean;

    /**
     * Enables and disable the stickyNotes annotations when the PDF viewer control is loaded initially.
     * 
     * {% codeBlock src='pdfviewer/enableStickyNotesAnnotation/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableStickyNotesAnnotation: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     * 
     * {% codeBlock src='pdfviewer/enableAnnotationToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableAnnotationToolbar: boolean;

    /**
     * Opens the form designer toolbar when the PDF document is loaded in the PDF Viewer control initially.
     * 
     * {% codeBlock src='pdfviewer/enableFormDesignerToolbar/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableFormDesignerToolbar: boolean;

    /**
     * Gets or sets a boolean value to show or hide the bookmark panel while loading a document.
     * 
     * {% codeBlock src='pdfviewer/isBookmarkPanelOpen/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isBookmarkPanelOpen: boolean;

    /**
     * Gets or sets a boolean value if initial field selected in form designer toolbar.
     *
     * @private
     * @default false
     */
    @Property(false)
    public isInitialFieldToolbarSelection: boolean;

    /**
     * Sets the interaction mode of the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/interactionMode/index.md' %}{% endcodeBlock %}
     *
     * @default TextSelection
     */
    @Property('TextSelection')
    public interactionMode: InteractionMode;

    /**
     * Specifies the rendering mode in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/zoomMode/index.md' %}{% endcodeBlock %}
     *
     * @default Default
     */
    @Property('Default')
    public zoomMode: ZoomMode;

    /**
     * Specifies the signature mode in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/signatureFitMode/index.md' %}{% endcodeBlock %}
     *
     * @default Default
     */
    @Property('Default')
    public signatureFitMode: SignatureFitMode;

    /**
     * Specifies the print mode in the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/printMode/index.md' %}{% endcodeBlock %}
     *
     * @default Default
     */
    @Property('Default')
    public printMode: PrintMode;

    /**
     * Sets the initial loading zoom value from 10 to 400 in the PDF Viewer Control.
     * 
     * {% codeBlock src='pdfviewer/zoomValue/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public zoomValue: number;

    /**
     *  Enable or disable the zoom optimization mode in PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/enableZoomOptimization/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableZoomOptimization: boolean;

    /**
     * Enable or disable the text extract from the PDF viewer.
     * 
     * {% codeBlock src='pdfviewer/isExtractText/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isExtractText: boolean;

    /**
     * Maintain the selection of text markup annotation.
     * 
     * {% codeBlock src='pdfviewer/isMaintainSelection/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public isMaintainSelection: boolean;

     /**
     *  Get or set the flag to hide the digitally signed field on document loading.
     *
     * @private
     * @default false
     */
    @Property(false)
    public hideEmptyDigitalSignatureFields: boolean;

     /**
     *  Show or hide the digital signature appearance in the document.
     * 
     * {% codeBlock src='pdfviewer/showDigitalSignatureAppearance/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public showDigitalSignatureAppearance: boolean;

    /**
     *  Determines whether accessibility tags are enabled or disabled. 
     *  Accessibility tags can help make web content more accessible to users with disabilities.
     * 
     * {% codeBlock src='pdfviewer/enableAccessibilityTags/index.md' %}{% endcodeBlock %}
     * 
     * @default true
     */
    @Property(true)
    public enableAccessibilityTags: boolean;

    /**
     * Customize desired date and time format
     * 
     * {% codeBlock src='pdfviewer/dateTimeFormat/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property('M/d/yyyy h:mm:ss a')
    public dateTimeFormat: string;

    /**
     * Defines the settings of the PDF Viewer toolbar.
     * 
     * {% codeBlock src='pdfviewer/toolbarSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ showTooltip: true, toolbarItems: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentTool', 'SubmitForm', 'AnnotationEditTool', 'FormDesignerEditTool', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'], annotationToolbarItems: ['HighlightTool', 'UnderlineTool', 'StrikethroughTool', 'ColorEditTool', 'OpacityEditTool', 'AnnotationDeleteTool', 'StampAnnotationTool', 'HandWrittenSignatureTool', 'InkAnnotationTool', 'ShapeTool', 'CalibrateTool', 'StrokeColorEditTool', 'ThicknessEditTool', 'FreeTextAnnotationTool', 'FontFamilyAnnotationTool', 'FontSizeAnnotationTool', 'FontStylesAnnotationTool', 'FontAlignAnnotationTool', 'FontColorAnnotationTool', 'CommentPanelTool'], formDesignerToolbarItems: ['TextboxTool', 'PasswordTool', 'CheckBoxTool', 'RadioButtonTool', 'DropdownTool', 'ListboxTool', 'DrawSignatureTool', 'DeleteTool'] })
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Defines the ajax Request settings of the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/ajaxRequestSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ ajaxHeaders: [], withCredentials: false })
    public ajaxRequestSettings: AjaxRequestSettingsModel;

    /**
     * Defines the stamp items of the PDF Viewer.
     * 
     * {% codeBlock src='pdfviewer/customStamp/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ customStampName: '', customStampImageSource: '' })
    public customStamp: CustomStampModel[];

    /**
     * Defines the settings of the PDF Viewer service.
     * 
     * {% codeBlock src='pdfviewer/serverActionSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages', print: 'PrintImages', renderComments: 'RenderAnnotationComments', importAnnotations: 'ImportAnnotations', exportAnnotations: 'ExportAnnotations', importFormFields: 'ImportFormFields', exportFormFields: 'ExportFormFields', renderTexts: 'RenderPdfTexts' })
    public serverActionSettings: ServerActionSettingsModel;

    /**
     * Get or set the signature field settings.
     * 
     * {% codeBlock src='pdfviewer/signatureFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ name: '', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: true, tooltip: '', thickness: 1, signatureIndicatorSettings: { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' }, signatureDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false } })
    public signatureFieldSettings: SignatureFieldSettingsModel;

    /**
     * Get or set the initial field settings.
     * 
     * {% codeBlock src='pdfviewer/initialFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ name: '', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: true, tooltip: '', thickness: 1, initialIndicatorSettings: { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' }, initialDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false } })
    public initialFieldSettings: InitialFieldSettingsModel;

    /**
     * Defines the settings of highlight annotation.
     * 
     * {% codeBlock src='pdfviewer/highlightSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, color: '#FFDF56', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    public highlightSettings: HighlightSettingsModel;

    /**
     * Defines the settings of strikethrough annotation.
     * 
     * {% codeBlock src='pdfviewer/strikethroughSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, color: '#ff0000', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    public strikethroughSettings: StrikethroughSettingsModel;

    /**
     * Defines the settings of underline annotation.
     * 
     * {% codeBlock src='pdfviewer/underlineSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, color: '#00ff00', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    public underlineSettings: UnderlineSettingsModel;

    /**
     * Defines the settings of line annotation.
     * 
     * {% codeBlock src='pdfviewer/lineSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'None', lineHeadEndStyle: 'None', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public lineSettings: LineSettingsModel;

    /**
     * Defines the settings of arrow annotation.
     * 
     * {% codeBlock src='pdfviewer/arrowSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public arrowSettings: ArrowSettingsModel;

    /**
     * Defines the settings of rectangle annotation.
     * 
     * {% codeBlock src='pdfviewer/rectangleSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public rectangleSettings: RectangleSettingsModel;

    /**
     * Defines the settings of shape label.
     * 
     * {% codeBlock src='pdfviewer/shapeLabelSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ff0000', fontColor: '#000', fontSize: 16, labelHeight: 24.6, labelMaxWidth: 151, labelContent: 'Label' })
    public shapeLabelSettings: ShapeLabelSettingsModel;

    /**
     * Defines the settings of circle annotation.
     * 
     * {% codeBlock src='pdfviewer/circleSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public circleSettings: CircleSettingsModel;

    /**
     * Defines the settings of polygon annotation.
     * 
     * {% codeBlock src='pdfviewer/polygonSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public polygonSettings: PolygonSettingsModel;

    /**
     * Defines the settings of stamp annotation.
     * 
     * {% codeBlock src='pdfviewer/stampSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, dynamicStamps: [DynamicStampItem.Revised, DynamicStampItem.Reviewed, DynamicStampItem.Received, DynamicStampItem.Confidential, DynamicStampItem.Approved, DynamicStampItem.NotApproved], signStamps: [SignStampItem.Witness, SignStampItem.InitialHere, SignStampItem.SignHere, SignStampItem.Accepted, SignStampItem.Rejected], standardBusinessStamps: [StandardBusinessStampItem.Approved, StandardBusinessStampItem.NotApproved, StandardBusinessStampItem.Draft, StandardBusinessStampItem.Final, StandardBusinessStampItem.Completed, StandardBusinessStampItem.Confidential, StandardBusinessStampItem.ForPublicRelease, StandardBusinessStampItem.NotForPublicRelease, StandardBusinessStampItem.ForComment, StandardBusinessStampItem.Void, StandardBusinessStampItem.PreliminaryResults, StandardBusinessStampItem.InformationOnly], allowedInteractions: ['None'], isPrint: true })
    public stampSettings: StampSettingsModel;

    /**
     * Defines the settings of customStamp annotation.
     * 
     * {% codeBlock src='pdfviewer/customStampSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, author: 'Guest', width: 0, height: 0, left: 0, top: 0, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, enableCustomStamp: true, allowedInteractions: ['None'], isPrint: true })
    public customStampSettings: CustomStampSettingsModel;

    /**
     * Defines the settings of distance annotation.
     * 
     * {% codeBlock src='pdfviewer/distanceSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, leaderLength: 40, resizeCursorType: CursorType.move, allowedInteractions: ['None'], isPrint: true })
    public distanceSettings: DistanceSettingsModel;

    /**
     * Defines the settings of perimeter annotation.
     * 
     * {% codeBlock src='pdfviewer/perimeterSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Open', lineHeadEndStyle: 'Open', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    public perimeterSettings: PerimeterSettingsModel;

    /**
     * Defines the settings of area annotation.
     * 
     * {% codeBlock src='pdfviewer/areaSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    public areaSettings: AreaSettingsModel;

    /**
     * Defines the settings of radius annotation.
     * 
     * {% codeBlock src='pdfviewer/radiusSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public radiusSettings: RadiusSettingsModel;

    /**
     * Defines the settings of volume annotation.
     * 
     * {% codeBlock src='pdfviewer/volumeSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    public volumeSettings: VolumeSettingsModel;

    /**
     * Defines the settings of stickyNotes annotation.
     * 
     * {% codeBlock src='pdfviewer/stickyNotesSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ author: 'Guest', opacity: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public stickyNotesSettings: StickyNotesSettingsModel;
    /**
     * Defines the settings of free text annotation.
     * 
     * {% codeBlock src='pdfviewer/freeTextSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ffffff00', author: 'Guest', borderWidth: 1, width: 151, fontSize: 16, height: 24.6, fontColor: '#000', fontFamily: 'Helvetica', defaultText: 'Type Here', textAlignment: 'Left', fontStyle: FontStyle.None, allowTextOnly: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true, isReadonly: false, enableAutoFit: false })
    public freeTextSettings: FreeTextSettingsModel;

    /**
     * Defines the settings of measurement annotation.
     * 
     * {% codeBlock src='pdfviewer/measurementSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ conversionUnit: 'in', displayUnit: 'in', scaleRatio: 1, depth: 96 })
    public measurementSettings: MeasurementSettingsModel;

    /**
     * Defines the settings of annotation selector.
     * 
     * {% codeBlock src='pdfviewer/annotationSelectorSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null })
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Sets the settings for the color of the text search highlight.
     * 
     * {% codeBlock src='pdfviewer/textSearchColorSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ searchHighlightColor: '#fdd835', searchColor: '#8b4c12' })
    public textSearchColorSettings: TextSearchColorSettingsModel;

    /**
     * Get or set the signature dialog settings for signature field.
     * 
     * {% codeBlock src='pdfviewer/signatureDialogSettings/index.md' %}{% endcodeBlock %}
     * 
     */
     @Property({ displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false })
    public signatureDialogSettings: SignatureDialogSettingsModel;

    /**
     * Get or set the signature dialog settings for initial field.
     * 
     * {% codeBlock src='pdfviewer/initialDialogSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false })
    public initialDialogSettings: SignatureDialogSettingsModel;

    /**
     * Defines the settings of handWrittenSignature.
     * 
     * {% codeBlock src='pdfviewer/handWrittenSignatureSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ signatureItem: ['Signature', 'Initial'], saveSignatureLimit: 1, saveInitialLimit: 1, opacity: 1, strokeColor: '#000000', width: 150, height: 100, thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], signatureDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false }, initialDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false} })
    public handWrittenSignatureSettings: HandWrittenSignatureSettingsModel;

    /**
     * Defines the ink annotation settings for PDF Viewer.It used to customize the strokeColor, thickness, opacity of the ink annotation.
     * 
     * {% codeBlock src='pdfviewer/inkAnnotationSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ author: 'Guest', opacity: 1, strokeColor: '#ff0000', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public inkAnnotationSettings: InkAnnotationSettingsModel;

    /**
     * Defines the settings of the annotations.
     * 
     * {% codeBlock src='pdfviewer/annotationSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ author: 'Guest', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, skipPrint: false, skipDownload: false, allowedInteractions: ['None'] })
    public annotationSettings: AnnotationSettingsModel;

    /**
     * Defines the tile rendering settings.
     * 
     * {% codeBlock src='pdfviewer/tileRenderingSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ enableTileRendering: true, x: 0, y: 0 })
    public tileRenderingSettings: TileRenderingSettingsModel;

    /**
     * Defines the scroll settings.
     * 
     * {% codeBlock src='pdfviewer/scrollSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ delayPageRequestTimeOnScroll: 100 })
    public scrollSettings: ScrollSettingsModel;

    /**
     * Get or set the text field settings.
     * 
     * {% codeBlock src='pdfviewer/textFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ name: '', value: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', borderColor: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', maxLength: 0, isRequired: false, isPrint: true, tooltip: '', thickness: 1, isMultiline: false })
    public textFieldSettings: TextFieldSettingsModel;

    /**
     * Get or set the password field settings.
     * 
     * {% codeBlock src='pdfviewer/passwordFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ name: '', value: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', borderColor: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', maxLength: 0, isRequired: false, isPrint: true, tooltip: '', thickness: 1 })
    public passwordFieldSettings: PasswordFieldSettingsModel;

    /**
     * Get or set the check box field settings.
     * 
     * {% codeBlock src='pdfviewer/checkBoxFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ name: '', isChecked: false, backgroundColor: 'white', isReadOnly: false, visibility: 'visible', isPrint: true, tooltip: '', isRequired: false, thickness: 1, borderColor: 'black' })
    public checkBoxFieldSettings: CheckBoxFieldSettingsModel;

    /**
     * Get or set the radio button field settings.
     * 
     * {% codeBlock src='pdfviewer/radioButtonFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ name: '', isSelected: false, backgroundColor: 'white', isReadOnly: false, visibility: 'visible', isPrint: true, tooltip: '', isRequired: false, thickness: 1, borderColor: 'black' })
    public radioButtonFieldSettings: RadioButtonFieldSettingsModel;

    /**
     * Get or set the dropdown field settings.
     * 
     * {% codeBlock src='pdfviewer/DropdownFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ name: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: true, tooltip: '', options: [], thickness: 1, borderColor: 'black' })
    public DropdownFieldSettings: DropdownFieldSettingsModel;

    /**
     * Get or set the listbox field settings.
     * 
     * {% codeBlock src='pdfviewer/listBoxFieldSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    @Property({ name: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: false, tooltip: '', options: [], thickness: 1, borderColor: 'black' })
    public listBoxFieldSettings: ListBoxFieldSettingsModel;

    /**
     * Defines the context menu settings.
     * 
     * {% codeBlock src='pdfviewer/contextMenuSettings/index.md' %}{% endcodeBlock %}
     * 
     */
    // eslint-disable-next-line max-len
    @Property({ contextMenuAction: 'RightClick', contextMenuItems: [ContextMenuItem.Comment, ContextMenuItem.Copy, ContextMenuItem.Cut, ContextMenuItem.Delete, ContextMenuItem.Highlight, ContextMenuItem.Paste, ContextMenuItem.Properties, ContextMenuItem.ScaleRatio, ContextMenuItem.Strikethrough, ContextMenuItem.Underline] })
    public contextMenuSettings: ContextMenuSettingsModel;

    /**
     * @private
     */
    public viewerBase: PdfViewerBase;
    /**
     * @private
     */
    public drawing: Drawing;
    /**
     * @private
     */
    /**
     * Defines the collection of selected items, size and position of the selector
     *
     * @default {}
     */
    @Complex<SelectorModel>({}, Selector)
    public selectedItems: SelectorModel;
    /**
     * @private
     */
    public adornerSvgLayer: SVGSVGElement;

    /**
     * @private
     */
    public zIndex: number = -1;
    /**
     * @private
     */
    public nameTable: {} = {};
    /**   @private  */
    public clipboardData: ClipBoardObject = {};

    /**
     * @private
     */
    public zIndexTable: ZOrderPageTable[] = [];

    /**
     * @private
     */
    public navigationModule: Navigation;
    /**
     * @private
     */
    public toolbarModule: Toolbar;
    /**
     * @private
     */
    public magnificationModule: Magnification;
    /**
     * @private
     */
    public linkAnnotationModule: LinkAnnotation;
    /** @hidden */
    public localeObj: L10n;
    /**
     * @private
     */
    public thumbnailViewModule: ThumbnailView;
    /**
     * @private
     */
    public bookmarkViewModule: BookmarkView;
    /**
     * @private
     */
    public textSelectionModule: TextSelection;
    /**
     * @private
     */
    public textSearchModule: TextSearch;
    /**
     * @private
     */
    public printModule: Print;
    /**
     * @private
     */
    public annotationModule: Annotation;
    /**
     * @private
     */
    public formFieldsModule: FormFields;
    /**
     * @private
     */
    public formDesignerModule: FormDesigner;
     /**
     * @private
     */
    public accessibilityTagsModule: AccessibilityTags;
    private isTextSelectionStarted: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public _dotnetInstance: any;
    /**
     * Gets the bookmark view object of the pdf viewer.
     *
     * @asptype BookmarkView
     * @blazorType BookmarkView
     * @returns { BookmarkView }
     */
    public get bookmark(): BookmarkView {
        return this.bookmarkViewModule;
    }

    /**
     * Gets the print object of the pdf viewer.
     *
     * @asptype Print
     * @blazorType Print
     * @returns { Print }
     */
    public get print(): Print {
        return this.printModule;
    }

    /**
     * Gets the magnification object of the pdf viewer.
     *
     * @asptype Magnification
     * @blazorType Magnification
     * @returns { Magnification }
     */
    public get magnification(): Magnification {
        return this.magnificationModule;
    }
    /**
     * Gets the navigation object of the pdf viewer.
     *
     * @asptype Navigation
     * @blazorType Navigation
     * @returns { Navigation }
     */
    public get navigation(): Navigation {
        return this.navigationModule;
    }

    /**
     * Gets the text search object of the pdf viewer.
     *
     * @asptype TextSearch
     * @blazorType TextSearch
     * @returns { TextSearch }
     */
    public get textSearch(): TextSearch {
        return this.textSearchModule;
    }

    /**
     * Gets the toolbar object of the pdf viewer.
     *
     * @asptype Toolbar
     * @blazorType Toolbar
     * @returns { Toolbar }
     */
    public get toolbar(): Toolbar {
        return this.toolbarModule;
    }

    /**
     * Gets the thumbnail-view object of the pdf viewer.
     *
     * @asptype ThumbnailView
     * @blazorType ThumbnailView
     * @returns { ThumbnailView }
     */
    public get thumbnailView(): ThumbnailView {
        return this.thumbnailViewModule;
    }

    /**
     * Gets the annotation object of the pdf viewer.
     *
     * @asptype Annotation
     * @blazorType Annotation
     * @returns { Annotation }
     */
    public get annotation(): Annotation {
        return this.annotationModule;
    }
    /**
     * Gets the FormDesigner object of the pdf viewer.
     *
     * @asptype FormDesigner
     * @blazorType FormDesigner
     * @returns { FormDesigner }
     */
    public get formDesigner(): FormDesigner {
        return this.formDesignerModule;
    }

    /**
     * Gets the TextSelection object of the pdf viewer.
     *
     * @asptype TextSelection
     * @blazorType TextSelection
     * @returns { TextSelection }
     */
    public get textSelection(): TextSelection {
        return this.textSelectionModule;
    }

    /**
     * Gets the Accessibility Tags object of the pdf viewer.
     *
     * @asptype AccessibilityTags
     * @blazorType AccessibilityTags
     * @returns { AccessibilityTags }
     */
    public get accessibilityTags(): AccessibilityTags {
        return this.accessibilityTagsModule;
    }

    /**
     * Triggers during the creation of the PDF viewer component.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<void>;

    /**
     * Triggers while loading document into PDF viewer.
     *
     * @event documentLoad
     * @blazorProperty 'DocumentLoaded'
     */
    @Event()
    public documentLoad: EmitType<LoadEventArgs>;

    /**
     * Triggers while closing the document.
     *
     * @event documentUnload
     * @blazorProperty 'DocumentUnloaded'
     */
    @Event()
    public documentUnload: EmitType<UnloadEventArgs>;

    /**
     * Triggers while document loading failed in PdfViewer.
     *
     * @event documentLoadFailed
     * @blazorProperty 'DocumentLoadFailed'
     */
    @Event()
    public documentLoadFailed: EmitType<LoadFailedEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     *
     * @event ajaxRequestFailed
     * @blazorProperty 'AjaxRequestFailed'
     */
    @Event()
    public ajaxRequestFailed: EmitType<AjaxRequestFailureEventArgs>;

    /**
     * Triggers on successful AJAX request.
     * 
     * @event ajaxRequestSuccess
     */
     @Event()
     public ajaxRequestSuccess: EmitType<AjaxRequestSuccessEventArgs>;
     
    /**
     * Triggers when validation is failed.
     *
     * @event validateFormFields
     * @blazorProperty 'validateFormFields'
     */
    @Event()
    public validateFormFields: EmitType<ValidateFormFieldsArgs>;

    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     *
     * @event pageClick
     * @blazorProperty 'OnPageClick'
     */
    @Event()
    public pageClick: EmitType<PageClickEventArgs>;

    /**
     * Triggers when there is change in current page number.
     *
     * @event pageChange
     * @blazorProperty 'PageChanged'
     */
    @Event()
    public pageChange: EmitType<PageChangeEventArgs>;

    /**
     * Triggers when a hyperlink in a PDF document is clicked.
     *
     * @event hyperlinkClick
     * @blazorProperty 'OnHyperlinkClick'
     */
    @Event()
    public hyperlinkClick: EmitType<HyperlinkClickEventArgs>;

    /**
     * Triggers when hyperlink in a PDF document is hovered.
     *
     * @event hyperlinkMouseOver
     * @blazorProperty 'OnHyperlinkMouseOver'
     */
    @Event()
    public hyperlinkMouseOver: EmitType<HyperlinkMouseOverArgs>;

    /**
     * Triggers When the magnification value changes.
     *
     * @event zoomChange
     * @blazorProperty 'ZoomChanged'
     */
    @Event()
    public zoomChange: EmitType<ZoomChangeEventArgs>;

    /**
     * Triggers when an annotation is added to a PDF document's page.
     *
     * @event annotationAdd
     * @blazorProperty 'AnnotationAdded'
     */
    @Event()
    public annotationAdd: EmitType<AnnotationAddEventArgs>;

    /**
     * Triggers when an annotation is removed from a PDF document's page.
     *
     * @event annotationRemove
     * @blazorProperty 'AnnotationRemoved'
     */
    @Event()
    public annotationRemove: EmitType<AnnotationRemoveEventArgs>;

    /**
     * Triggers when the annotation's property is modified on a PDF document page.
     *
     * @event annotationPropertiesChange
     * @blazorProperty 'AnnotationPropertiesChanged'
     */
    @Event()
    public annotationPropertiesChange: EmitType<AnnotationPropertiesChangeEventArgs>;

    /**
     * Triggers when an annotation is resized over the page of a PDF document.
     *
     * @event annotationResize
     * @blazorProperty 'AnnotationResized'
     */
    @Event()
    public annotationResize: EmitType<AnnotationResizeEventArgs>;

    /**
     * Triggers when a signature is added to a page of a PDF document.
     *
     * @event addSignature
     */
    @Event()
    public addSignature: EmitType<AddSignatureEventArgs>;

    /**
     * Triggers when the signature is removed from the page of a PDF document.
     *
     * @event removeSignature
     */
    @Event()
    public removeSignature: EmitType<RemoveSignatureEventArgs>;

    /**
     * Triggers when a signature is moved across the page of a PDF document.
     *
     * @event moveSignature
     */
    @Event()
    public moveSignature: EmitType<MoveSignatureEventArgs>;

    /**
     * Triggers when the property of the signature is changed in the page of the PDF document.
     *
     * @event signaturePropertiesChange
     */
    @Event()
    public signaturePropertiesChange: EmitType<SignaturePropertiesChangeEventArgs>;

    /**
     * Triggers when the signature is resized and placed on a page of a PDF document.
     *
     * @event resizeSignature
     */
    @Event()
    public resizeSignature: EmitType<ResizeSignatureEventArgs>;

    /**
     * Triggers when signature is selected over the page of the PDF document.
     *
     * @event signatureSelect
     */
    @Event()
    public signatureSelect: EmitType<SignatureSelectEventArgs>;

    /**
     * Triggers when an annotation is selected over the page of the PDF document.
     *
     * @event annotationSelect
     * @blazorProperty 'AnnotationSelected'
     */
    @Event()
    public annotationSelect: EmitType<AnnotationSelectEventArgs>;

    /**
     * Triggers when an annotation is unselected over the page of the PDF document.
     *
     * @event annotationUnSelect
     * @blazorProperty 'AnnotationUnSelect'
     */
    @Event()
    public annotationUnSelect: EmitType<AnnotationUnSelectEventArgs>;

    /**
     * Triggers when the annotation is double clicked.
     *
     * @event annotationDoubleClick
     * @blazorProperty 'OnAnnotationDoubleClick'
     */
    @Event()
    public annotationDoubleClick: EmitType<AnnotationDoubleClickEventArgs>;

    /**
     * Triggers when an annotation is moved over the page of the PDF document.
     *
     * @event annotationMove
     * @blazorProperty 'AnnotationMoved'
     */
    @Event()
    public annotationMove: EmitType<AnnotationMoveEventArgs>;

    /**
     * Triggers while moving an annotation.
     *
     * @event annotationMoving
     * @blazorProperty 'AnnotationMoving'
     */
     @Event()
     public annotationMoving: EmitType<AnnotationMovingEventArgs>;
 
    /**
     * Triggers when the mouse is moved over the annotation object.
     *
     * @event annotationMouseover
     */
    @Event()
    public annotationMouseover: EmitType<AnnotationMouseoverEventArgs>;

    /**
     * Triggers when the user mouse moves away from the annotation object.
     *
     * @event annotationMouseLeave
     */
    @Event()
    public annotationMouseLeave: EmitType<AnnotationMouseLeaveEventArgs>;

    /**
     * Triggers when moving the mouse over the page.
     *
     * @event pageMouseover
     */
    @Event()
    public pageMouseover: EmitType<PageMouseoverEventArgs>;

    /**
     * Triggers when an imported annotation started to appear in the PDF document.
     *
     * @event importStart
     * @blazorProperty 'ImportStarted'
     */
    @Event()
    public importStart: EmitType<ImportStartEventArgs>;

    /**
     * Triggers when an exported annotation started in the PDF Viewer.
     *
     * @event exportStart
     * @blazorProperty 'ExportStarted'
     */
    @Event()
    public exportStart: EmitType<ExportStartEventArgs>;

    /**
     * Triggers when the annotations in a PDF document are successfully imported.
     *
     * @event importSuccess
     * @blazorProperty 'ImportSucceed'
     */
    @Event()
    public importSuccess: EmitType<ImportSuccessEventArgs>;

    /**
     * Triggers when the annotations in a PDF document are successfully exported.
     *
     * @event exportSuccess
     * @blazorProperty 'ExportSucceed'
     */
    @Event()
    public exportSuccess: EmitType<ExportSuccessEventArgs>;

    /**
     * Triggers when the annotations imports in a PDF document fails.
     *
     * @event importFailed
     * @blazorProperty 'ImportFailed'
     */
    @Event()
    public importFailed: EmitType<ImportFailureEventArgs>;

    /**
     * Triggers when the annotations export in a PDF document fails.
     *
     * @event exportFailed
     * @blazorProperty 'ExportFailed'
     */
    @Event()
    public exportFailed: EmitType<ExportFailureEventArgs>;

    /**
     * Triggers when an text extraction is completed in the PDF Viewer.
     *
     * @event extractTextCompleted
     * @blazorProperty 'ExtractTextCompleted'
     */
    @Event()
    public extractTextCompleted: EmitType<ExtractTextCompletedEventArgs>;

    /**
     * Triggers when the thumbnail in the PDF Viewer's thumbnail panel is clicked.
     *
     * @event thumbnailClick
     * @blazorProperty 'OnThumbnailClick'
     */
    @Event()
    public thumbnailClick: EmitType<ThumbnailClickEventArgs>;

    /**
     * Triggers when the bookmark is clicked in the PDF Viewer's bookmark panel.
     *
     * @event bookmarkClick
     * @blazorProperty 'BookmarkClick'
     */
    @Event()
    public bookmarkClick: EmitType<BookmarkClickEventArgs>;

    /**
     * Triggers when the text selection is initiated.
     *
     * @event textSelectionStart
     * @blazorProperty 'OnTextSelectionStart'
     */
    @Event()
    public textSelectionStart: EmitType<TextSelectionStartEventArgs>;

    /**
     * Triggers when the text selection is complete.
     *
     * @event textSelectionEnd
     * @blazorProperty 'OnTextSelectionEnd'
     */
    @Event()
    public textSelectionEnd: EmitType<TextSelectionEndEventArgs>;

    /**
     * Triggers when the download action is initiated.
     *
     * @event downloadStart
     * @blazorProperty 'DownloadStart'
     */
    @Event()
    public downloadStart: EmitType<DownloadStartEventArgs>;

    /**
     * Triggers when the button is clicked.
     *
     * @deprecated This property renamed into "formFieldClick"
     * @event buttonFieldClick
     * @blazorProperty 'ButtonFieldClick'
     */
    @Event()
    public buttonFieldClick: EmitType<ButtonFieldClickEventArgs>;

    /**
     * Triggers when the form field is selected.
     *
     * @event formFieldClick
     * @blazorProperty 'FormFieldClick'
     */
    @Event()
    public formFieldClick: EmitType<FormFieldClickArgs>;

    /**
     * Triggers when the download actions are completed.
     *
     * @event downloadEnd
     * @blazorProperty 'DownloadEnd'
     */
    @Event()
    public downloadEnd: EmitType<DownloadEndEventArgs>;

    /**
     * Triggers when the print action is initiated.
     *
     * @event printStart
     * @blazorProperty 'PrintStart'
     */
    @Event()
    public printStart: EmitType<PrintStartEventArgs>;

    /**
     * Triggers when the print actions are completed.
     *
     * @event printEnd
     * @blazorProperty 'PrintEnd'
     */
    @Event()
    public printEnd: EmitType<PrintEndEventArgs>;

    /**
     * Triggers when the text search is initiated.
     *
     * @event textSearchStart
     * @blazorProperty 'OnTextSearchStart'
     */
    @Event()
    public textSearchStart: EmitType<TextSearchStartEventArgs>;

    /**
     * Triggers when the text search is completed.
     *
     * @event textSearchComplete
     * @blazorProperty 'OnTextSearchComplete'
     */
    @Event()
    public textSearchComplete: EmitType<TextSearchCompleteEventArgs>;

    /**
     * Triggers when the text search text is highlighted.
     *
     * @event textSearchHighlight
     * @blazorProperty 'OnTextSearchHighlight'
     */
    @Event()
    public textSearchHighlight: EmitType<TextSearchHighlightEventArgs>;

    /**
     * Triggers before the data is sent to the server.
     *
     * @event ajaxRequestInitiate
     */
    @Event()
    public ajaxRequestInitiate: EmitType<AjaxRequestInitiateEventArgs>;

    /**
     * Triggers when a comment for the annotation is added to the comment panel.
     *
     * @event commentAdd
     * @blazorProperty 'commentAdd'
     */
    @Event()
    public commentAdd: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment for the annotation in the comment panel is edited.
     *
     * @event commentEdit
     * @blazorProperty 'commentEdit'
     */
    @Event()
    public commentEdit: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment for the annotation in the comment panel is deleted.
     *
     * @event commentDelete
     * @blazorProperty 'commentDelete'
     */
    @Event()
    public commentDelete: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment for the annotation in the comment panel is selected.
     *
     * @event commentSelect
     * @blazorProperty 'commentSelect
     */
    @Event()
    public commentSelect: EmitType<CommentEventArgs>;

    /**
     * Triggers when the annotation's comment for status is changed in the comment panel.
     *
     * @event commentStatusChanged
     * @blazorProperty 'commentStatusChanged'
     */
    @Event()
    public commentStatusChanged: EmitType<CommentEventArgs>;

    /**
     * Triggers before adding a text in the freeText annotation.
     *
     * @event beforeAddFreeText
     * @blazorProperty 'beforeAddFreeText'
     */
    @Event()
    public beforeAddFreeText: EmitType<BeforeAddFreeTextEventArgs>;

    /**
     * Triggers when focus out from the form fields.
     *
     * @event formFieldFocusOut
     * @blazorProperty 'formFieldFocusOut'
     */
    @Event()
    public formFieldFocusOut: EmitType<FormFieldFocusOutEventArgs>;

    /**
     * Triggers when a form field is added.
     *
     * @event formFieldAdd
     * @blazorProperty 'formFieldAdd'
     */
    @Event()
    public formFieldAdd: EmitType<FormFieldAddArgs>;

    /**
     * Triggers when a form field is removed.
     *
     * @event formFieldRemove
     * @blazorProperty 'formFieldRemove'
     */
     @Event()
     public formFieldRemove: EmitType<FormFieldRemoveArgs>;

    /**
     * Triggers when a property of form field is changed.
     *
     * @event formFieldPropertiesChange
     * @blazorProperty 'formFieldPropertiesChange'
     */
    @Event()
    public formFieldPropertiesChange: EmitType<FormFieldPropertiesChangeArgs>;

    /**
     * Triggers when the mouse cursor leaves the form field.
     *
     * @event formFieldMouseLeave
     * @blazorProperty 'formFieldMouseLeave'
     */
    @Event()
    public formFieldMouseLeave: EmitType<FormFieldMouseLeaveArgs>;

    /**
     * Triggers when the mouse cursor is over a form field.
     *
     * @event formFieldMouseover
     * @blazorProperty 'formFieldMouseover'
     */
     @Event()
     public formFieldMouseover: EmitType<FormFieldMouseoverArgs>;

    /**
     * Triggers when a form field is moved.
     *
     * @event formFieldMove
     * @blazorProperty 'formFieldMove'
     */
     @Event()
     public formFieldMove: EmitType<FormFieldMoveArgs>;

    /**
     * Triggers when a form field is resized.
     *
     * @event formFieldResize
     * @blazorProperty 'formFieldResize'
     */
     @Event()
     public formFieldResize: EmitType<FormFieldResizeArgs>;

    /**
     * Triggers when a form field is selected.
     *
     * @event formFieldSelect
     * @blazorProperty 'formFieldSelect'
     */
     @Event()
     public formFieldSelect: EmitType<FormFieldSelectArgs>;

    /**
     * Triggers when a form field is unselected.
     *
     * @event formFieldUnselect
     * @blazorProperty 'formFieldUnselect'
     */
    @Event()
    public formFieldUnselect: EmitType<FormFieldUnselectArgs>;

    /**
     * Triggers when the form field is double-clicked.
     *
     * @event formFieldDoubleClick
     * @blazorProperty 'formFieldDoubleClick'
     */
    @Event()
    public formFieldDoubleClick: EmitType<FormFieldDoubleClickArgs>;

    /**
     * PDF document annotation collection.
     *
     * @private
     * @deprecated
     */
    @Collection<PdfAnnotationBaseModel>([], PdfAnnotationBase)
    public annotations: PdfAnnotationBaseModel[];

    /**
     * PDF document form fields collection.
     * 
     * @private
     * @deprecated
     */
    @Collection<PdfFormFieldBaseModel>([], PdfFormFieldBase)
    public formFields: PdfFormFieldBaseModel[];

    /**
     * @private
     * @deprecated
     */
    public tool: string;

    /**
     * @private
     */
     public touchPadding: number = 10;

    /**
     * @private
     */
    public paddingDifferenceValue: number = 10;

    /**
     * store the drawing objects.
     *
     * @private
     * @deprecated
     */
    @Property()
    public drawingObject: PdfAnnotationBaseModel;


    constructor(options?: PdfViewerModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.viewerBase = new PdfViewerBase(this);
        this.drawing = new Drawing(this);
    }

    protected preRender(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        if(!isNullOrUndefined(this.element) && this.element.id == ""){
            //Set unique id, if id is empty
            this.element.id = this.getUniqueElementId();
        }
        if(Browser.isDevice){
            //EJ2-63562 - Reduced the touchPadding of mobile devices to 16 to improve selection of fields without affecting resizing ability.
            this.touchPadding = 16;
        }
    }
    private getUniqueElementId(): string{
        return 'pdfViewer_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    protected render(): void {
        this.viewerBase.initializeComponent();
        if(!this.enableFormFields){
            this.formFieldsModule = new FormFields(this, this.viewerBase);
            this.formFieldsModule.formFieldsReadOnly(this.enableFormFields);
        }
        if (this.enableTextSelection && this.textSelectionModule) {
            this.textSelectionModule.enableTextSelectionMode();
        } else {
            this.viewerBase.disableTextSelectionMode();
        }
        this.drawing.renderLabels(this);
        this.renderComplete();
    }

    public getModuleName(): string {
        return 'PdfViewer';
    }

    /**
     * @private
     */
    public getLocaleConstants(): Object {
        return this.defaultLocale;
    }

    /**
     * To modify the Json Data in ajax request.
     *
     * @param jsonData
     * @returns void
     */
    // eslint-disable-next-line
    public setJsonData(jsonData: any): void {
        this.viewerBase.ajaxData = jsonData;
    }

    public onPropertyChanged(newProp: PdfViewerModel, oldProp: PdfViewerModel): void {
        let requireRefresh: boolean = false;
        if (this.isDestroyed) {
            return;
        }
        const properties: string[] = Object.keys(newProp);
        for (const prop of properties) {
            switch (prop) {
            case 'locale':
                if (this.viewerBase.loadedData) {
                    // eslint-disable-next-line
                    let data: any = null;
                    if (this.formFieldsModule) {
                        data = this.viewerBase.getItemFromSessionStorage('_formfields');
                    }
                    if (data) {
                        this.viewerBase.formfieldvalue = JSON.parse(data);
                        // eslint-disable-next-line
                        let annotCollection: any[] = this.annotationCollection;
                        const filename: string = this.viewerBase.jsonDocumentId;
                        super.refresh();
                        this.load(this.viewerBase.loadedData, null);
                        this.addAnnotation(annotCollection);
                        this.viewerBase.loadedData = null;
                        this.downloadFileName = filename;
                        this.fileName = filename;
                    }
                }
                break;
            case 'toolbarSettings':
                if (!Browser.isDevice|| this.enableDesktopMode){
                    this.toolbar.applyToolbarSettings();
                    this.toolbar.annotationToolbarModule.applyAnnotationToolbarSettings();  
                    this.toolbar.formDesignerToolbarModule.applyFormDesignerToolbarSettings();
                }
                else{
                    this.toolbar.applyToolbarSettingsForMobile();
                    this.toolbar.annotationToolbarModule.applyMobileAnnotationToolbarSettings();
                }
                break;
            case 'enableToolbar':
                this.notify('', { module: 'toolbar', enable: this.enableToolbar });
                requireRefresh = true;
                break;
            case 'enableCommentPanel':
                this.notify('', { module: 'annotation', enable: this.enableCommentPanel });
                requireRefresh = true;
                if (this.toolbarModule && this.toolbarModule.annotationToolbarModule) {
                    this.toolbarModule.annotationToolbarModule.enableCommentPanelTool(this.enableCommentPanel);
                }
                if (!this.enableCommentPanel) {
                    if (this.viewerBase.navigationPane) {
                        this.viewerBase.navigationPane.closeCommentPanelContainer();
                    }
                }
                break;
            case 'documentPath':
                if (!isBlazor()) {
                    this.load(newProp.documentPath, null);
                }
                else {
                    this._dotnetInstance.invokeMethodAsync('LoadDocumentFromClient', newProp.documentPath);
                }
                break;
            case 'interactionMode':
                this.interactionMode = newProp.interactionMode;
                if (newProp.interactionMode === 'Pan') {
                    this.viewerBase.initiatePanning();
                    if (this.toolbar) {
                        this.toolbar.updateInteractionTools(false);
                    }
                } else if (newProp.interactionMode === 'TextSelection') {
                    this.viewerBase.initiateTextSelectMode();
                    if (this.toolbar) {
                        this.toolbar.updateInteractionTools(true);
                    }
                }
                break;
            case 'height':
                this.height = newProp.height;
                this.viewerBase.updateHeight();
                this.viewerBase.onWindowResize();
                if (this.toolbar && this.toolbar.annotationToolbarModule) {
                    if (this.toolbar.annotationToolbarModule.isToolbarHidden) {
                        this.toolbar.annotationToolbarModule.adjustViewer(false);
                    } else {
                        this.toolbar.annotationToolbarModule.adjustViewer(true);
                    }
                }
                break;
            case 'width':
                this.width = newProp.width;
                this.viewerBase.updateWidth();
                this.viewerBase.onWindowResize();
                break;
            case 'customStamp':
                this.renderCustomerStamp(this.customStamp[0]);
                break;
            case 'customStampSettings':
                if (newProp.customStampSettings.customStamps) {
                    this.renderCustomerStamp(this.customStampSettings.customStamps[0]);
                }
                break;
            case 'enableFormFields':
                if (this.enableFormFields && this.formFieldsModule) {
                    for (let m: number = 0; m < this.pageCount; m++) {
                        this.formFieldsModule.renderFormFields(m, false);
                    }
                } else {
                    this.formFieldsModule = new FormFields(this, this.viewerBase);
                    this.formFieldsModule.formFieldsReadOnly(this.enableFormFields);
                }
                break;
            case 'designerMode':
                if(this.designerMode) {
                    this.formDesignerModule.setMode('designer');
                } else {
                    this.formDesignerModule.setMode('edit');
                }
                break;
            case 'highlightSettings':
            case 'underlineSettings':
            case 'strikethroughSettings':
                if (this.annotationModule && this.annotationModule.textMarkupAnnotationModule) {
                    this.annotationModule.textMarkupAnnotationModule.updateTextMarkupSettings(prop);
                }
                break;
            case 'signatureFieldSettings':
            case 'initialFieldSettings':
                    if (this.formDesignerModule) {
                        let isInitialField : boolean =(prop === "initialFieldSettings");
                        this.formDesignerModule.updateSignatureSettings(newProp[prop], isInitialField);
                    }
                    break;
                case 'textFieldSettings':
                    if (this.formDesignerModule) {
                        this.formDesignerModule.updateTextFieldSettings(newProp[prop]);
                    }
                    break;
                case 'passwordFieldSettings':
                    if (this.formDesignerModule) {
                        this.formDesignerModule.updatePasswordFieldSettings(newProp[prop]);
                    }
                    break;
                case 'checkBoxFieldSettings':
                    if (this.formDesignerModule) {
                        this.formDesignerModule.updateCheckBoxFieldSettings(newProp[prop]);
                    }
                    break;
                case 'radioButtonFieldSettings':
                    if (this.formDesignerModule) {
                        this.formDesignerModule.updateRadioButtonFieldSettings(newProp[prop]);
                    }
                    break;
                case 'DropdownFieldSettings':
                    if (this.formDesignerModule) {
                        this.formDesignerModule.updateDropDownFieldSettings(newProp[prop]);
                    }
                    break;
                case 'listBoxFieldSettings':
                    if (this.formDesignerModule) {
                        this.formDesignerModule.updateListBoxFieldSettings(newProp[prop]);
                    }
                    break;
                case 'isFormDesignerToolbarVisible':
                    if (!Browser.isDevice || this.enableDesktopMode) {
                        if (this.toolbarModule && this.formDesignerModule && !oldProp.isFormDesignerToolbarVisible && newProp.isFormDesignerToolbarVisible) {
                            if (this.toolbarModule.annotationToolbarModule && this.isAnnotationToolbarVisible) {
                                this.isAnnotationToolbarVisible = false;
                                this.toolbarModule.annotationToolbarModule.showAnnotationToolbar();
                            }
                            this.toolbarModule.formDesignerToolbarModule.resetFormDesignerToolbar();
                        }
                        else {
                            if (!isNullOrUndefined(this.toolbarModule) && !isNullOrUndefined(this.formDesignerModule) && this.toolbarModule.formDesignerToolbarModule && !this.isFormDesignerToolbarVisible) {
                                this.isFormDesignerToolbarVisible = false;
                                this.formDesignerModule.setMode('edit');
                                this.toolbarModule.formDesignerToolbarModule.resetFormDesignerToolbar();
                            }
                        }
                    }
                    break;
                case 'isAnnotationToolbarVisible':
                    if (!Browser.isDevice || this.enableDesktopMode) {
                        if (this.toolbarModule && this.annotationModule && !oldProp.isAnnotationToolbarVisible && newProp.isAnnotationToolbarVisible) {
                            if (this.toolbarModule.formDesignerToolbarModule && this.isFormDesignerToolbarVisible) {
                                this.isFormDesignerToolbarVisible = false;
                                this.toolbarModule.formDesignerToolbarModule.showFormDesignerToolbar();
                            }
                            this.toolbarModule.annotationToolbarModule.resetToolbar();
                        }
                    }
                    break;
            }
        }
    }

    // eslint-disable-next-line
    private renderCustomerStamp(customStamp: any) {
        this.annotation.stampAnnotationModule.isStampAddMode = true;
        this.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
        this.viewerBase.stampAdded = true;
        this.viewerBase.isAlreadyAdded = false;
        // eslint-disable-next-line max-len
        this.annotation.stampAnnotationModule.createCustomStampAnnotation(customStamp.customStampImageSource, customStamp.customStampName);
    }

    public getPersistData(): string {
        return 'PdfViewer';
    }

    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.enableMagnification) {
            modules.push({
                member: 'Magnification', args: [this, this.viewerBase]
            });
        }
        if (this.enableNavigation) {
            modules.push({
                member: 'Navigation', args: [this, this.viewerBase]
            });
        }
        if (this.enableToolbar || this.enableNavigationToolbar || this.enableAnnotationToolbar || this.enableFormDesignerToolbar) {
            modules.push({
                member: 'Toolbar', args: [this, this.viewerBase]
            });
        }
        if (this.enableHyperlink) {
            modules.push({
                member: 'LinkAnnotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableThumbnail) {
            modules.push({
                member: 'ThumbnailView', args: [this, this.viewerBase]
            });
        }
        if (this.enableBookmark) {
            modules.push({
                member: 'BookmarkView', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSelection) {
            modules.push({
                member: 'TextSelection', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSearch) {
            modules.push({
                member: 'TextSearch', args: [this, this.viewerBase]
            });
        }
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: [this, this.viewerBase]
            });
        }
        if (this.enableAnnotation) {
            modules.push({
                member: 'Annotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableFormFields) {
            modules.push({
                member: 'FormFields', args: [this, this.viewerBase]
            });
        }
        if (this.enableFormDesigner && !isBlazor()) {
            modules.push({
                member: 'FormDesigner', args: [this, this.viewerBase]
            });
        }
        modules.push({
            member: 'AccessibilityTags', args: [this, this.viewerBase]
        });
        
        return modules;
    }
    /** @hidden */
    public defaultLocale: Object = {
        'PdfViewer': 'PDF Viewer',
        'Cancel': 'Cancel',
        'Download file': 'Download file',
        'Download': 'Download',
        'Enter Password': 'This document is password protected. Please enter a password.',
        'File Corrupted': 'File Corrupted',
        'File Corrupted Content': 'The file is corrupted and cannot be opened.',
        'Fit Page': 'Fit Page',
        'Fit Width': 'Fit Width',
        'Automatic': 'Automatic',
        'Go To First Page': 'Show first page',
        'Invalid Password': 'Incorrect Password. Please try again.',
        'Next Page': 'Show next page',
        'OK': 'OK',
        'Open': 'Open file',
        'Page Number': 'Current page number',
        'Previous Page': 'Show previous page',
        'Go To Last Page': 'Show last page',
        'Zoom': 'Zoom',
        'Zoom In': 'Zoom in',
        'Zoom Out': 'Zoom out',
        'Page Thumbnails': 'Page thumbnails',
        'Bookmarks': 'Bookmarks',
        'Print': 'Print file',
        'Password Protected': 'Password Required',
        'Copy': 'Copy',
        'Text Selection': 'Text selection tool',
        'Panning': 'Pan mode',
        'Text Search': 'Find text',
        'Find in document': 'Find in document',
        'Match case': 'Match case',
        'Apply': 'Apply',
        'GoToPage': 'Go to Page',
        // eslint-disable-next-line max-len
        'No matches': 'Viewer has finished searching the document. No more matches were found',
        'No Text Found': 'No Text Found',
        'Undo': 'Undo',
        'Redo': 'Redo',
        'Annotation': 'Add or Edit annotations',
        'FormDesigner': 'Add and Edit Form Fields',
        'Highlight': 'Highlight Text',
        'Underline': 'Underline Text',
        'Strikethrough': 'Strikethrough Text',
        'Delete': 'Delete annotation',
        'Opacity': 'Opacity',
        'Color edit': 'Change Color',
        'Opacity edit': 'Change Opacity',
        'Highlight context': 'Highlight',
        'Underline context': 'Underline',
        'Strikethrough context': 'Strikethrough',
        // eslint-disable-next-line max-len
        'Server error': 'Web-service is not listening. PDF Viewer depends on web-service for all it\'s features. Please start the web service to continue.',
        // eslint-disable-next-line max-len
        'Client error': 'Client-side error is found. Please check the custom headers provided in the AjaxRequestSettings property and web action methods in the ServerActionSettings property.',
        'Open text': 'Open',
        'First text': 'First Page',
        'Previous text': 'Previous Page',
        'Next text': 'Next Page',
        'Last text': 'Last Page',
        'Zoom in text': 'Zoom In',
        'Zoom out text': 'Zoom Out',
        'Selection text': 'Selection',
        'Pan text': 'Pan',
        'Print text': 'Print',
        'Search text': 'Search',
        'Annotation Edit text': 'Edit Annotation',
        'FormDesigner Edit text': 'Add and Edit Form Fields',
        'Line Thickness': 'Line Thickness',
        'Line Properties': 'Line Properties',
        'Start Arrow': 'Start Arrow',
        'End Arrow': 'End Arrow',
        'Line Style': 'Line Style',
        'Fill Color': 'Fill Color',
        'Line Color': 'Line Color',
        'None': 'None',
        'Open Arrow': 'Open',
        'Closed Arrow': 'Closed',
        'Round Arrow': 'Round',
        'Square Arrow': 'Square',
        'Diamond Arrow': 'Diamond',
        'Butt': 'Butt',
        'Cut': 'Cut',
        'Paste': 'Paste',
        'Delete Context': 'Delete',
        'Properties': 'Properties',
        'Add Stamp': 'Add Stamp',
        'Add Shapes': 'Add Shapes',
        'Stroke edit': 'Change Stroke Color',
        'Change thickness': 'Change Border Thickness',
        'Add line': 'Add Line',
        'Add arrow': 'Add Arrow',
        'Add rectangle': 'Add Rectangle',
        'Add circle': 'Add Circle',
        'Add polygon': 'Add Polygon',
        'Add Comments': 'Add Comments',
        'Comments': 'Comments',
        'SubmitForm': 'Submit Form',
        'No Comments Yet': 'No Comments Yet',
        'Accepted': 'Accepted',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled',
        'Rejected': 'Rejected',
        'Leader Length': 'Leader Length',
        'Scale Ratio': 'Scale Ratio',
        'Calibrate': 'Calibrate',
        'Calibrate Distance': 'Calibrate Distance',
        'Calibrate Perimeter': 'Calibrate Perimeter',
        'Calibrate Area': 'Calibrate Area',
        'Calibrate Radius': 'Calibrate Radius',
        'Calibrate Volume': 'Calibrate Volume',
        'Depth': 'Depth',
        'Closed': 'Closed',
        'Round': 'Round',
        'Square': 'Square',
        'Diamond': 'Diamond',
        'Edit': 'Edit',
        'Comment': 'Comment',
        'Comment Panel': 'Comment Panel',
        'Set Status': 'Set Status',
        'Post': 'Post',
        'Page': 'Page',
        'Add a comment': 'Add a comment',
        'Add a reply': 'Add a reply',
        'Import Annotations': 'Import annotations from JSON file',
        'Export Annotations': 'Export annotation to JSON file',
        'Export XFDF': 'Export annotation to XFDF file',
        'Import XFDF': 'Import annotations from XFDF file',
        'Add': 'Add',
        'Clear': 'Clear',
        'Bold': 'Bold',
        'Italic': 'Italic',
        'Strikethroughs': 'Strikethrough',
        'Underlines': 'Underline',
        'Superscript': 'Superscript',
        'Subscript': 'Subscript',
        'Align left': 'Align Left',
        'Align right': 'Align Right',
        'Center': 'Center',
        'Justify': 'Justify',
        'Font color': 'Font Color',
        'Text Align': 'Text Align',
        'Text Properties': 'Font Style',
        'SignatureFieldDialogHeaderText': 'Add Signature',
        'HandwrittenSignatureDialogHeaderText': 'Add Signature',
        'InitialFieldDialogHeaderText': 'Add Initial',
        'HandwrittenInitialDialogHeaderText': 'Add Initial',
        'Draw Ink': 'Draw Ink',
        'Create': 'Create',
        'Font family': 'Font Family',
        'Font size': 'Font Size',
        'Free Text': 'Free Text',
        'Import Failed': 'Invalid JSON file type or file name; please select a valid JSON file',
        'Import PDF Failed': 'Invalid PDF file type or PDF file not found. Please select a valid PDF file',
        'File not found': 'Imported JSON file is not found in the desired location',
        'Export Failed': 'Export annotations action has failed; please ensure annotations are added properly',
        'of': 'of ',
        'Dynamic': 'Dynamic',
        'Standard Business': 'Standard Business',
        'Sign Here': 'Sign Here',
        'Custom Stamp': 'Custom Stamp',
        'Enter Signature as Name': 'Enter your name',
        'Draw-hand Signature': 'DRAW',
        'Type Signature': 'TYPE',
        'Upload Signature': 'UPLOAD',
        'Browse Signature Image': 'BROWSE',
        'Save Signature': 'Save Signature',
        'Save Initial': 'Save Initial',
        'Textbox': 'Textbox',
        'Password': 'Password',
        'Check Box': 'Checkbox',
        'Radio Button': 'Radio Button',
        'Dropdown': 'Drop Down',
        'List Box': 'List Box',
        'Signature': 'Signature',
        'Delete FormField': 'Delete Form Field',
        'Textbox Properties': 'Textbox Properties',
        'Name': 'Name',
        'Tooltip': 'Tooltip',
        'Value': 'Value',
        'Form Field Visibility': 'Form Field Visibility',
        'Read Only': 'Read Only',
        'Required': 'Required',
        'Checked': 'Checked',
        'Show Printing': 'Show Printing',
        'Formatting': 'Format',
        'Fill': 'Fill',
        'Border': 'Border',
        'Border Color': 'Border Color',
        'Thickness': 'Thickness',
        'Max Length': 'Max Length',
        'List Item': 'Item Name',
        'Export Value': 'Item Value',
        'Dropdown Item List': 'Dropdown Item List',
        'List Box Item List': 'List Box Item List',
        'General': 'GENERAL',
        'Appearance': 'APPEARANCE',
        'Options': 'OPTIONS',
        'Delete Item': 'Delete',
        'Up': 'Up',
        'Down': 'Down',
        'Multiline': 'Multiline',
        'Revised': 'Revised',
        'Reviewed': 'Reviewed',
        'Received': 'Received',
        'Confidential': 'Confidential',
        'Approved': 'Approved',
        'Not Approved': 'Not Approved',
        'Witness': 'Witness',
        'Initial Here': 'Initial Here',
        'Draft': 'Draft',
        'Final': 'Final',
        'For Public Release': 'For Public Release',
        'Not For Public Release': 'Not For Public Release',
        'For Comment': 'For Comment',
        'Void': 'Void',
        'Preliminary Results': 'Preliminary Results',
        'Information Only': 'Information Only',
        'in': 'in',
        'm': 'm',
        'ft_in': 'ft_in',
        'ft': 'ft',
        'p': 'p',
        'cm': 'cm',
        'mm': 'mm',
        'pt': 'pt',
        'cu': 'cu',
        'sq': 'sq',
        'Initial': 'Initial'
    };

    /**
     * Loads the given PDF document in the PDF viewer control
     *
     * @param  {string} document - Specifies the document name for load
     * @param  {string} password - Specifies the Given document password
     * @returns void
     */
    public load(document: string, password: string): void {
        if (this.pageCount !== 0) {
            this.viewerBase.clear(true);
        } else {
            this.viewerBase.clear(false);
        }
        this.pageCount = 0;
        this.currentPageNumber = 0;
        if (!isBlazor()) {
            if (this.toolbarModule) {
                this.toolbarModule.resetToolbar();
            }
        } else {
            this.viewerBase.blazorUIAdaptor.resetToolbar();
        }
        this.viewerBase.initiatePageRender(document, password);
    }

    /**
     * Loads the given PDF document in the PDF viewer control
     * @private
     */
     public loadDocument(documentId: string, isFileName: boolean, fileName: string): void {
        if (this.pageCount !== 0) {
            this.viewerBase.clear(true);
        } else {
            this.viewerBase.clear(false);
        }
        this.pageCount = 0;
        this.currentPageNumber = 0;
        this.viewerBase.blazorUIAdaptor.resetToolbar();
        this.fileName = fileName;
        this.viewerBase.initiateLoadDocument(documentId, isFileName, fileName);
    }

    /**
     * Loads the PDF document with the document details in the PDF viewer control
    * @private
    */
    public loadSuccess(documentDetails: any, password?: string): void {
        this.viewerBase.loadSuccess(documentDetails, password);
    }

    /**
     * Set the focus of the given element
    * @private
    */
    public focusElement(elementId: string): void {
        let element: HTMLElement = document.getElementById(elementId);
        if (element != null) {
            element.focus();
        }
    }

    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     *
     * @returns void
     */
    public download(): void {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    }

    /**
     * Saves the PDF document being loaded in the PDF Viewer control as blob.
     *
     * @returns Promise<Blob>
     */
    public saveAsBlob(): Promise<Blob> {
        if (this.enableDownload) {
            return new Promise((resolve: Function, reject: Function) => {
                resolve(this.viewerBase.saveAsBlob());
            });
        } else {
            return null;
        }
    }

    /**
     * updates the PDF Viewer container width and height from externally.
     *
     * @returns void
     */
    public updateViewerContainer(): void {
        this.viewerBase.updateViewerContainer();
    }

    /**
     * Specifies the message to be displayed  in the popup.
     *
     * @param errorString
     * @returns void
     */
    public showNotificationPopup(errorString: string): void {
        this.viewerBase.showNotificationPopup(errorString);
    }

    /**
     * Focus a form field in a document by its field name or the field object.
     *
     * @param field
     * @returns void
     */
    public focusFormField(field: any): void {
        if (typeof (field) === "string") {
            let fieldCollections: any = this.retrieveFormFields();
            for (let i: number = 0; i < fieldCollections.length; i++) {
                if (fieldCollections[i].name === field) {
                    field = fieldCollections[i];
                }
            }
        }
        if (field) {
            this.viewerBase.isFocusField = true;
            this.viewerBase.focusField = field;
            if (this.formDesignerModule) {
                this.navigationModule.goToPage(field.pageIndex + 1);
            } else {
                let pageIndex: number = parseFloat(field.id.split('_')[1]);
                this.navigationModule.goToPage(pageIndex + 1);
            }
            setTimeout(() => {
                let currentField: any = document.getElementById(field.id);
                if (this.formDesignerModule && field.type === "Checkbox") {
                    currentField = document.getElementById(field.id + "_input");
                }
                if (currentField) {
                    if (this.formDesignerModule && (field.type === "SignatureField" || field.type === "InitialField")) {
                        currentField.parentElement.focus();
                    }
                    else {
                        currentField.focus();
                        this.viewerBase.isFocusField = false;
                        this.viewerBase.focusField = [];
                    }
                }
            }, 100);
        }
    }

    /**
     * Update the form field values from externally.
     *
     * @param fieldValue
     * @returns void
     */
    // eslint-disable-next-line
    public updateFormFieldsValue(fieldValue: any): void {
        // eslint-disable-next-line
        let target: any = document.getElementById(fieldValue.id);
        let isformDesignerModuleListBox: boolean = false;
        if (target) {
            target = target ? target : document.getElementById(fieldValue.id + '_content_html_element').children[0].children[0];
            if (target && fieldValue.type === 'Textbox' || fieldValue.type === 'Password' || fieldValue.type === 'PasswordField') {
                target.value = fieldValue.value;
            } else if (fieldValue.type === 'Checkbox' || fieldValue.type === 'RadioButton' || fieldValue.type === 'CheckBox') {
                if (fieldValue.type === 'CheckBox') {
                    target.style.appearance = 'auto';
                }
                if (this.formDesignerModule) {
                    if (fieldValue.type === 'RadioButton') {
                        let radioButtonOption: any = { isSelected: fieldValue.isSelected };
                        this.formDesignerModule.updateFormField(fieldValue, radioButtonOption);
                    } else {
                        let checkBoxOption: any = { isChecked: fieldValue.isChecked };
                        this.formDesignerModule.updateFormField(fieldValue, checkBoxOption);
                    }
                } else {
                    if (fieldValue.type === 'RadioButton') {
                        target.selected = fieldValue.isSelected
                    }
                    else {
                        target.checked = fieldValue.isChecked;
                    }
                }
            } else if (fieldValue.type === 'DropDown' || fieldValue.type === 'ListBox' || fieldValue.type === 'DropdownList') {
                if (this.formDesignerModule) {
                    isformDesignerModuleListBox = true;
                    let dropDownListOption: any = { options: fieldValue.value };
                    this.formDesignerModule.updateFormField(fieldValue, dropDownListOption);
                } else {
                    target.value = fieldValue.value;
                }
            }
            if (fieldValue.type === 'SignatureField' || fieldValue.type === 'InitialField') {
                if(fieldValue.signatureType || fieldValue.initialType){
                    if (typeof fieldValue.signatureType === 'string') {
                        fieldValue.signatureType = fieldValue.signatureType;
                    }
                    else {
                        fieldValue.signatureType = fieldValue.initialType;
                    }
                }
                fieldValue.fontName = fieldValue.fontName ? fieldValue.fontName : fieldValue.fontFamily;
                let currentValue = fieldValue.value;
                let signatureField = this.getFormFieldByID(fieldValue.id);
                let isSameValue = this.formDesignerModule ? signatureField.value === fieldValue.value : signatureField.Value === fieldValue.value;
                if ((target as any).classList.contains('e-pdfviewer-signatureformfields-signature') && !isSameValue) {
                    if (this.formDesignerModule)
                        this.annotation.deleteAnnotationById(fieldValue.id.split('_')[0] + '_content');
                    else
                        this.annotation.deleteAnnotationById(fieldValue.id);
                }
                if (!fieldValue.signatureType || !fieldValue.value) {
                    fieldValue.value = currentValue;
                    if (this.viewerBase.isSignaturePathData(fieldValue.value)) {
                        fieldValue.signatureType = 'Path';
                    }
                    else if (this.viewerBase.isSignatureImageData(fieldValue.value)) {
                        fieldValue.signatureType = 'Image';
                    }
                    else {
                        fieldValue.signatureType = 'Type';
                    }
                }
                if(!isSameValue)
                    this.formFieldsModule.drawSignature(fieldValue.signatureType, fieldValue.value, target, fieldValue.fontName);
            } else {
                if (!isformDesignerModuleListBox) {
                    this.formFieldsModule.updateDataInSession(target);
                }
            }
        } else {
            let data: any = this.viewerBase.getItemFromSessionStorage('_formfields');
            if (data) {
                var FormFieldsData = JSON.parse(data);
                for (var m = 0; m < FormFieldsData.length; m++) {
                    let currentData: any = FormFieldsData[m];
                    let fieldName: string;
                    if (fieldValue.type === 'Checkbox' || fieldValue.type === 'RadioButton' || fieldValue.type === 'CheckBox') {
                        fieldName = currentData.GroupName;
                    } else if (fieldValue.type === 'DropDown' || fieldValue.type === 'ListBox' || fieldValue.type === 'DropdownList') {
                        fieldName = currentData.Text;
                    } else {
                        fieldName = currentData.FieldName;
                    }
                    //map the signature field and its data object to find the signature field name.
                    let fieldData: any = FormFieldsData.filter(function (item: any) { return item.FieldName === currentData.FieldName.split('_')[0];});
                    if (!isNullOrUndefined(fieldData) && !isNullOrUndefined(fieldData[0])) {
                        if (fieldData[0].Name === "SignatureField" || fieldData[0].Name === "InitialField") {
                            fieldName = currentData.FieldName.split('_')[0];
                            currentData.LineBounds = FormFieldsData.filter(function (item: any) { return item.FieldName === fieldName; })[0].LineBounds;
                        }
                    }
                    if (fieldName === fieldValue.name) {
                        if (fieldValue.type === 'Textbox' || fieldValue.type === 'Password' || fieldValue.type === 'PasswordField') {
                            if (fieldValue.value) {
                                currentData.Text = fieldValue.value;
                                currentData.Value = fieldValue.value;
                            }
                        }
                        else if (fieldValue.type === 'Checkbox' || fieldValue.type === 'RadioButton' || fieldValue.type === 'CheckBox') {
                            fieldValue.isSelected || fieldValue.isChecked ? currentData.Selected = true : currentData.Selected = false;
                        }
                        else if (fieldValue.type === 'DropDown' || fieldValue.type === 'ListBox' || fieldValue.type === 'DropdownList') {
                            currentData.SelectedValue = fieldValue.value;
                            let index: number = currentData.TextList ? currentData.TextList.indexOf(fieldValue.value) : 0
                            currentData.selectedIndex = index > -1 ? index : 0;
                            fieldValue.type === 'ListBox' ? currentData.SelectedListed = [currentData.selectedIndex] : [];
                        }
                        else if (fieldValue.type === 'SignatureField' || fieldValue.type === 'InitialField') {
                            if (fieldValue.value) {
                                currentData.Value = fieldValue.value;
                                currentData = this.updateSignatureValue(currentData, fieldValue);
                            }
                        }
                        this.formFieldsModule.updateFormFieldsCollection(currentData);
                    }
                }
            }
            window.sessionStorage.removeItem(this.viewerBase.documentId + '_formfields');
            this.viewerBase.setItemInSessionStorage(FormFieldsData, '_formfields');
        }
    }
    // eslint-disable-next-line
    private getFormFieldByID(id : string): any {
        if(this.formDesignerModule){
            return (this.nameTable as any)[id.split('_')[0]];
        }
        let data = window.sessionStorage.getItem(this.viewerBase.documentId + '_formfields');
        let formFieldsData = JSON.parse(data);
        return formFieldsData[formFieldsData.findIndex((el: { uniqueID: any; }) => el.uniqueID === id)];
    }

    /**
     * @param number
     */
    // eslint-disable-next-line
    private ConvertPointToPixel(number: any): any {
        return (number * (96 / 72));
    }

    /**
     * @param currentData - Current form field data.
     * @param fieldValue - Form Field.
     * @returns - Returns the updated the current Data.
     */
    // eslint-disable-next-line
    private updateSignatureValue(currentData: any, fieldValue: any): any {
        if (!fieldValue.signatureType) {
            fieldValue.signatureType = this.viewerBase.isSignatureImageData(fieldValue.value) ? 'Image' :(this.viewerBase.isSignaturePathData(fieldValue.value) ? 'Path' : 'Type');
        }
        let bound: any = currentData.LineBounds;
        const left: any = this.ConvertPointToPixel(bound.X);
        const top: any = this.ConvertPointToPixel(bound.Y);
        const width: any = this.ConvertPointToPixel(bound.Width);
        const height: any = this.ConvertPointToPixel(bound.Height);
        let bounds: any;
        if (fieldValue.signatureType === 'Type') {
            if (!currentData.FontFamily) {
                currentData.FontFamily = 'Helvetica';
            }
            // eslint-disable-next-line
            bounds = this.formFieldsModule.getSignBounds(currentData.pageIndex, currentData.RotationAngle, currentData.pageIndex, this.viewerBase.getZoomFactor(), left, top, width, height);
            if (this.signatureFitMode === 'Default') {
                bounds = this.formFieldsModule.getDefaultBoundsforSign(bounds);
            }
            currentData.Bounds = bounds;
            var fontSize: number = bounds.height / 1.35;
            let textWidth: number = this.formFieldsModule.getTextWidth(currentData.value, fontSize, currentData.FontFamily);
            let widthRatio: number = 1;
            if (textWidth > bounds.width)
                widthRatio = bounds.width / textWidth;
            currentData.FontSize = this.formFieldsModule.getFontSize(Math.floor((fontSize * widthRatio)));
        }
        else if (fieldValue.signatureType === 'Image') {
            // eslint-disable-next-line
            bounds = this.formFieldsModule.getSignBounds(currentData.pageIndex, currentData.RotationAngle, currentData.pageIndex, this.viewerBase.getZoomFactor(), left, top, width, height);
            let image: HTMLImageElement = new Image();
            image.src = currentData.Value;
            let proxy: any = this;
            image.onload = function(){
               proxy.imageOnLoad(bounds,image,currentData);
            }
        } else {
            if ((currentData.Value.indexOf('base64')) !== -1) {
                // eslint-disable-next-line
                bounds = this.formFieldsModule.getSignBounds(currentData.pageIndex, currentData.RotationAngle, currentData.pageIndex, this.viewerBase.getZoomFactor(), left, top, width, height);
                if (this.signatureFitMode === 'Default') {
                    bounds = this.formFieldsModule.getDefaultBoundsforSign(bounds);
                }
            } else {
                if (this.signatureFitMode === 'Default') {
                    // eslint-disable-next-line
                    let signBounds: any = this.formFieldsModule.updateSignatureAspectRatio(currentData.Value, false, null, currentData);
                    // eslint-disable-next-line
                    bounds = this.formFieldsModule.getSignBounds(currentData.pageIndex, currentData.RotationAngle, currentData.pageIndex, this.viewerBase.getZoomFactor(), left, top, signBounds.width, signBounds.height, true);
                    bounds.x = bounds.x + signBounds.left;
                    bounds.y = bounds.y + signBounds.top;
                } else {
                    bounds = this.formFieldsModule.getSignBounds(currentData.pageIndex, currentData.RotationAngle, currentData.pageIndex, this.viewerBase.getZoomFactor(), left, top, width, height);
                }
            }
            currentData.Bounds = bounds;
        }
        return currentData;
    }

    private imageOnLoad(bounds: any , image:HTMLImageElement, currentData: any){
        if (this.signatureFitMode === 'Default') {
            let padding = Math.min(bounds.height /this. paddingDifferenceValue, bounds.width / this.paddingDifferenceValue);
            let maxHeight = bounds.height - padding;
            let maxWidth = bounds.width - padding;
            let imageWidth = image.width;
            let imageHeight = image.height;
            let beforeWidth = bounds.width;
            let beforeHeight = bounds.height;
            let ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
            bounds.width = imageWidth * ratio;
            bounds.height = imageHeight * ratio;
            bounds.x = bounds.x + (beforeWidth - bounds.width) / 2;
            bounds.y = bounds.y + (beforeHeight - bounds.height) / 2;
           var data = this.viewerBase.getItemFromSessionStorage('_formfields');
           if (data) {
               var FormFieldsData = JSON.parse(data);
               for(var i=0; i<FormFieldsData.length; i++){
                   if(FormFieldsData[i].FieldName == currentData.FieldName){
                       FormFieldsData[i].Bounds = bounds;
                       this.formFieldsModule.updateFormFieldsCollection(FormFieldsData[i]);
                   }
                }
                window.sessionStorage.removeItem(this.viewerBase.documentId + '_formfields');
               this.viewerBase.setItemInSessionStorage(FormFieldsData , '_formfields');
            }
         }
    }
    /**
     * Perform undo action for the edited annotations
     *
     * @returns void
     */
    public undo(): void {
        if (this.annotationModule) {
            this.annotationModule.undo();
        }
    }

    /**
     * Perform redo action for the edited annotations
     *
     * @returns void
     */
    public redo(): void {
        if (this.annotationModule) {
            this.annotationModule.redo();
        }
    }

    /**
     * Unloads the PDF document being displayed in the PDF viewer.
     *
     * @returns void
     */
    public unload(): void {
        this.viewerBase.clear(true);
        this.pageCount = 0;
        if (!isBlazor()) {
            if (this.toolbarModule) {
                this.viewerBase.pageCount = 0;
                this.toolbarModule.resetToolbar();
            }
        } else {
            this.viewerBase.blazorUIAdaptor.resetToolbar();
        }
        this.magnificationModule.zoomTo(100);    
    }

    /**
     * Destroys all managed resources used by this object.
     * 
     * @returns void
     */
    public destroy(): void {
        super.destroy();
        if (!isNullOrUndefined(this.element)) {
            if (!this.refreshing) {
                this.element.classList.remove('e-pdfviewer');
            }
            this.element.innerHTML = '';
        }
        if(this.viewerBase.navigationPane){
        this.viewerBase.navigationPane.restrictUpdateZoomValue = false;
        }
        this.viewerBase.destroy();
        if(this.viewerBase.navigationPane){
        this.viewerBase.navigationPane.restrictUpdateZoomValue = true;
        }
    }

    // eslint-disable-next-line
    /**
     * Perform imports annotations action in the PDF Viewer
     * @param  {any} importData - Specifies the data for annotation imports
     * @returns void
     */
    // eslint-disable-next-line
    public importAnnotation(importData: any, annotationDataFormat?: AnnotationDataFormat): void {
        if (this.annotationModule) {
            if (typeof (importData) === 'string') {
                let isXfdfFile: boolean = ((importData.indexOf('.xfdf') > -1) || (annotationDataFormat.indexOf('Xfdf') > -1)) ? true : false;
                if (annotationDataFormat) {
                    if (importData.indexOf('</xfdf>') > -1) {
                        this.viewerBase.importAnnotations(importData, annotationDataFormat, false);
                    } else {
                        if (annotationDataFormat == 'Json') {
                            if (importData.includes('pdfAnnotation')) {
                                this.importAnnotationsAsJson(importData);
                            } else if (importData.split('.')[1] === 'json') {
                                this.viewerBase.isPDFViewerJson = true;
                                this.viewerBase.importAnnotations(importData, annotationDataFormat, isXfdfFile);
                            } else {
                                let newImportData: any = importData.split(',')[1] ? importData.split(',')[1] : importData.split(',')[0];
                                importData = decodeURIComponent(escape(atob(newImportData)));
                                this.importAnnotationsAsJson(importData);
                            }
                        } else {
                            this.viewerBase.importAnnotations(importData, annotationDataFormat, isXfdfFile);
                        }
                    }
                } else {
                    if (importData.split('.')[1] === 'json') {
                        if (importData.includes('pdfAnnotation')) {
                            this.importAnnotationsAsJson(importData);
                        } else {
                            let newImportData: any = importData.split(',')[1] ? importData.split(',')[1] : importData.split(',')[0];
                            importData = decodeURIComponent(escape(atob(newImportData)));
                            this.importAnnotationsAsJson(importData);
                        }
                    } else {
                        this.viewerBase.importAnnotations(importData, AnnotationDataFormat.Xfdf, isXfdfFile);
                    }
                }
            } else {
                let imporedAnnotation: any = importData.pdfAnnotation;
                if (typeof (importData) === 'object' && !isNullOrUndefined(imporedAnnotation) && !isNullOrUndefined(Object.keys(imporedAnnotation)) && !isNullOrUndefined(Object.keys(imporedAnnotation)[0]) && Object.keys(imporedAnnotation[Object.keys(imporedAnnotation)[0]]).length > 1) {
                    this.viewerBase.importAnnotations(importData);
                } else {
                    importData = JSON.stringify(importData);
                    this.viewerBase.isPDFViewerJson = false;
                    this.viewerBase.importAnnotations(btoa(importData), AnnotationDataFormat.Json);
                }
            }
        }
    }

     // eslint-disable-next-line
    private importAnnotationsAsJson(importData: any): void {
        let jsonData: any = JSON.parse(importData);
        let firstAnnotation: any = jsonData.pdfAnnotation[Object.keys(jsonData.pdfAnnotation)[0]];
        if ((Object.keys(jsonData.pdfAnnotation).length >= 1) && (firstAnnotation.textMarkupAnnotation || firstAnnotation.measureShapeAnnotation || firstAnnotation.freeTextAnnotation || firstAnnotation.stampAnnotations || firstAnnotation.signatureInkAnnotation || (firstAnnotation.shapeAnnotation && firstAnnotation.shapeAnnotation[0].Bounds))) {
            this.viewerBase.isPDFViewerJson = true;
            this.viewerBase.importAnnotations(jsonData, AnnotationDataFormat.Json);
        } else {
            this.viewerBase.isPDFViewerJson = false;
            this.viewerBase.importAnnotations(btoa(importData), AnnotationDataFormat.Json);
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     *
     * @param annotationDataFormat
     * @returns void
     */
    public exportAnnotation(annotationDataFormat?: AnnotationDataFormat): void {
        if (this.annotationModule) {
            if (annotationDataFormat && annotationDataFormat === 'Xfdf') {
                this.viewerBase.exportAnnotations(AnnotationDataFormat.Xfdf);
            } else {
                this.viewerBase.exportAnnotations(AnnotationDataFormat.Json);
            }
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     * 
     *@param {AnnotationDataFormat} annotationDataFormat - Export the annotation based on the format.
     
     * @returns Promise<object>
     */
    public exportAnnotationsAsObject(annotationDataFormat: AnnotationDataFormat = AnnotationDataFormat.Json): Promise<object> {
        if (this.annotationModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.exportAnnotationsAsObject(annotationDataFormat).then((value: object) => {
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    /**
     * Export annotations and returns a base64 string for both Json and XFDF formats
     *
     * @param {AnnotationDataFormat} annotationDataFormat
     * @returns Promise<string>
     */
    public exportAnnotationsAsBase64String(annotationDataFormat: AnnotationDataFormat): Promise<string> {
        if (this.annotationModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.createRequestForExportAnnotations(false, annotationDataFormat, true).then((value: string) => { 
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    /**
     * Perform to add annotations in the PDF Viewer
     *
     * @param annotation
     * @returns void
     */
    // eslint-disable-next-line
    public addAnnotation(annotation: any): void {
        if (this.viewerBase) {
            this.viewerBase.addAnnotation(annotation);
        }
    }


    // eslint-disable-next-line
    /**
     * Imports the form fields data into the current PDF document.
     * 
     * @param {string} data - The path for importing the fields.
     * @param {FormFieldDataFormat} formFieldDataFormat
     * @returns void
     */
    // eslint-disable-next-line
    public importFormFields(data?: string, formFieldDataFormat?: FormFieldDataFormat): void {
        if (this.formFieldsModule) {
            if(isNullOrUndefined(formFieldDataFormat)){
                formFieldDataFormat = FormFieldDataFormat.Json;
            }
            this.viewerBase.importFormFields(data, formFieldDataFormat);
        }
    }

    /**
     * Exports the form field data in the specified data format.
     *
     * @param {string} data - The path for exporting the fields.
     * @param {FormFieldDataFormat} formFieldDataFormat
     * @returns void
     */
     public exportFormFields(data?: string, formFieldDataFormat?: FormFieldDataFormat): void {
        if (this.formFieldsModule) {
            this.viewerBase.exportFormFields(data, formFieldDataFormat);
        }
    }

    /**
     * Returns an object which represents the form field data in the specified data format.
     *
     * @param {FormFieldDataFormat} formFieldDataFormat
     * @returns Promise<object>
     */
     public exportFormFieldsAsObject(formFieldDataFormat: FormFieldDataFormat = FormFieldDataFormat.Json): Promise<object> {
        if (this.formFieldsModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.exportFormFieldsAsObject(formFieldDataFormat).then((value: object) => {
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    /**
     * reset all form fields data
     *
     * @returns void
     */
    public resetFormFields(): void {
        this.formFieldsModule.resetFormFields();
    }
    /**
     * Clears data from the form fields.
     * Parameter - Specifies the form field object.
     *
     * @param formField
     * @returns void
     */
    // eslint-disable-next-line
    public clearFormFields(formField?: any): void {
        this.formFieldsModule.clearFormFields(formField);
    }
    /**
     * To delete the annotation Collections in the PDF Document.
     *
     * @returns void
     */
    public deleteAnnotations(): void {
        if (this.annotationModule) {
            this.viewerBase.deleteAnnotations();
        }
    }

    /**
     * To retrieve the form fields in the PDF Document.
     *
     * @returns void
     */
    public retrieveFormFields(): FormFieldModel[] {
        return this.formFieldCollections;
    }

    /**
     * To update the form fields in the PDF Document.
     *
     * @param formFields
     * @returns void
     */
    // eslint-disable-next-line
    public updateFormFields(formFields: any): void {
        this.updateFormFieldsValue(formFields);
        this.formFieldsModule.updateFormFieldValues(formFields);
    }

    /**
     * @param JsonData
     * @private
     */
    // eslint-disable-next-line
    public fireAjaxRequestInitiate(JsonData: any): void {
        const eventArgs: AjaxRequestInitiateEventArgs = { name: 'ajaxRequestInitiate', JsonData: JsonData };
        this.trigger('ajaxRequestInitiate', eventArgs);
    }
    /**
     * @param value
     * @param fieldName
     * @param id
     * @private
     */
    // eslint-disable-next-line
    public fireButtonFieldClickEvent(value: string, fieldName: string, id: string): void {
        const eventArgs: ButtonFieldClickEventArgs = { name: 'buttonFieldClicked', buttonFieldValue: value, buttonFieldName: fieldName, id: id };
        this.trigger('buttonFieldClick', eventArgs);
    }

    /**
     * @param name
     * @param field
     * @param cancel
     * @param isLeftClick - becomes true on signature panel left click.
     * @private
     */
    public async fireFormFieldClickEvent(name: string, field: FormFieldModel, cancel?: boolean, isLeftClick?: boolean): Promise<void> {
        let eventArgs: FormFieldClickArgs = { name: name, field: field, cancel: cancel };
        if (isBlazor()) {
            eventArgs = await this.triggerEvent('formFieldClick', eventArgs) as FormFieldClickArgs || eventArgs;
            eventArgs.field.type = field.type;
        } else {
            this.triggerEvent('formFieldClick', eventArgs);
        }
        if (field.type === 'SignatureField' || field.type === 'InitialField') {
            if (field.type === 'InitialField')
                this.viewerBase.isInitialField = true;
            else
                this.viewerBase.isInitialField = false;
            let target: any = document.getElementById(field.id);
            if (target.style.visibility === "hidden") {
                target.disabled = true;
            }
            target = target ? target : (document.getElementById(field.id + '_content_html_element') ? document.getElementById(field.id + '_content_html_element').children[0].children[0] : null);
            let formFieldCollectionsValue: any = this.formFieldCollections.filter(function (item) { return item.id === field.id; });
            if (formFieldCollectionsValue) {
                let readOnly: boolean = formFieldCollectionsValue[0].isReadOnly;
                if ((!readOnly) && !eventArgs.cancel && target && !target.disabled && (target as any).classList.contains('e-pdfviewer-signatureformfields') && (isLeftClick || isNullOrUndefined(isLeftClick))) {
                    this.viewerBase.signatureModule.showSignatureDialog(true);
                }
                else if (readOnly) {
                    target.disabled = true;
                }
            }
        }
    }
    
    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field add event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldAddEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldAddArgs = { name: name, field: field, pageIndex: pageIndex };
        this.viewerBase.isFormFieldSelect = false;
        this.trigger('formFieldAdd', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field remove event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldRemoveEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldRemoveArgs = { name: name, field: field, pageIndex: pageIndex };
        this.trigger('formFieldRemove', eventArgs);
    }

    /**
     * @param name - Returns the event name.
     * @param field - Returns the double-clicked form field object.
     * @param cancel - If TRUE, property panel of the form field does not open. FALSE by default.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldDoubleClickEvent(eventArgs: FormFieldDoubleClickArgs): FormFieldDoubleClickArgs {
        this.trigger('formFieldDoubleClick', eventArgs);
        return eventArgs;
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field properties change event.
     * @param pageIndex - Get the page number.
     * @param isAlignmentChanged - Specifies whether the text alignment of the form field is changed or not.
     * @param isBackgroundColorChanged - Specifies whether the background color of the form field is changed or not.
     * @param isBorderColorChanged - Specifies whether the border color of the form field is changed or not.
     * @param isBorderWidthChanged - Specifies whether the border width of the form field is changed or not.
     * @param isColorChanged - Specifies whether the font color of the form field is changed or not.
     * @param isFontFamilyChanged - Specifies whether the font family of the form field is changed or not.
     * @param isFontSizeChanged - Specifies whether the font size of the form field is changed or not.
     * @param isFontStyleChanged - Specifies whether the font style of the form field is changed or not.
     * @param isMaxLengthChanged - Specifies whether the max length of the form field is changed or not.
     * @param isPrintChanged - Specifies whether the print option of the form field is changed or not.
     * @param isReadOnlyChanged - Specifies the Read Only of Form field is changed or not.
     * @param isRequiredChanged - Specifies whether the is required option of the form field is changed or not.
     * @param isToolTipChanged - Specifies whether the tool tip property is changed or not.
     * @param isValueChanged - Specifies whether the form field value is changed or not.
     * @param isVisibilityChanged - Specifies whether the form field visibility is changed or not.
     * @param newValue - Specifies the new value of the form field.
     * @param oldValue - Specifies the old value of the form field.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldPropertiesChangeEvent(name: string, field: IFormField, pageIndex: number, isValueChanged: boolean, isFontFamilyChanged: boolean,
        isFontSizeChanged: boolean, isFontStyleChanged: boolean, isColorChanged: boolean, isBackgroundColorChanged: boolean, isBorderColorChanged: boolean, 
        isBorderWidthChanged: boolean, isAlignmentChanged: boolean, isReadOnlyChanged: boolean, isVisibilityChanged: boolean, isMaxLengthChanged: boolean, 
        isRequiredChanged: boolean, isPrintChanged: boolean, isToolTipChanged: boolean, oldValue?: any, newValue?: any, isNamechanged?: any): void {
        const eventArgs: FormFieldPropertiesChangeArgs = {
            name: name, field: field, pageIndex: pageIndex, isValueChanged: isValueChanged, isFontFamilyChanged: isFontFamilyChanged, isFontSizeChanged: isFontSizeChanged,
            isFontStyleChanged: isFontStyleChanged, isColorChanged: isColorChanged, isBackgroundColorChanged: isBackgroundColorChanged, isBorderColorChanged: isBorderColorChanged, 
            isBorderWidthChanged: isBorderWidthChanged, isAlignmentChanged: isAlignmentChanged, isReadOnlyChanged: isReadOnlyChanged, isVisibilityChanged: isVisibilityChanged, 
            isMaxLengthChanged: isMaxLengthChanged, isRequiredChanged: isRequiredChanged, isPrintChanged: isPrintChanged,
            isToolTipChanged: isToolTipChanged, oldValue: oldValue, newValue: newValue, isNameChanged: !isNullOrUndefined(isNamechanged) ? isNamechanged: false
        };
        this.trigger('formFieldPropertiesChange', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field mouse leave event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldMouseLeaveEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldMouseLeaveArgs = { name: name, field: field, pageIndex: pageIndex };
        this.trigger('formFieldMouseLeave', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field mouse over event.
     * @param pageIndex - Get the page number.
     * @param pageX - Get the mouse over x position with respect to the page container.
     * @param pageY - Get the mouse over y position with respect to the page container.
     * @param X - Specifies the mouse over x position with respect to the viewer container.
     * @param Y - Specifies the mouse over y position with respect to the viewer container.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldMouseoverEvent(name: string, field: IFormField, pageIndex: number, pageX: number, pageY: number, X: number, Y: number): void {
        const eventArgs: FormFieldMouseoverArgs = { name: name, field: field, pageIndex: pageIndex, pageX: pageX, pageY: pageY, X: X, Y: Y };
        this.trigger('formFieldMouseover', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field move event.
     * @param pageIndex - Get the page number.
     * @param previousPosition - Get the previous position of the form field in the page.
     * @param currentPosition - Current position of form field in the page.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldMoveEvent(name: string, field: IFormField, pageIndex: number, previousPosition: IFormFieldBound, currentPosition: IFormFieldBound): void {
        const eventArgs: FormFieldMoveArgs = { name: name, field: field, pageIndex: pageIndex, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('formFieldMove', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field resize event.
     * @param pageIndex - Get the page number.
     * @param previousPosition - Get the previous position of the form field in the page.
     * @param currentPosition - Current position of form field in the page.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldResizeEvent(name: string, field: IFormField, pageIndex: number, previousPosition: IFormFieldBound, currentPosition: IFormFieldBound): void {
        const eventArgs: FormFieldResizeArgs = { name: name, field: field, pageIndex: pageIndex, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('formFieldResize', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field select event.
     * @param pageIndex - Get the page number.
     * @param isProgrammaticSelection - Specifies whether the the form field is selected programmatically or by UI.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldSelectEvent(name: string, field: IFormField, pageIndex: number, isProgrammaticSelection: boolean): void {
        const eventArgs: FormFieldSelectArgs = { name: name, field: field, pageIndex: pageIndex, isProgrammaticSelection: isProgrammaticSelection };
        this.trigger('formFieldSelect', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field unselect event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldUnselectEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldUnselectArgs = { name: name, field: field, pageIndex: pageIndex };
        this.trigger('formFieldUnselect', eventArgs);
    }

    /**
     * @param pageData
     * @private
     */
    // eslint-disable-next-line
    public fireDocumentLoad(pageData: any): void {
        const eventArgs: LoadEventArgs = { name: 'documentLoad', documentName: this.fileName, pageData: pageData };
        this.trigger('documentLoad', eventArgs);
        if (isBlazor()) {
            this._dotnetInstance.invokeMethodAsync('LoadDocument', null);
            this.viewerBase.blazorUIAdaptor.loadDocument();
        }
    }

    /**
     * @param fileName
     * @private
     */
    public fireDocumentUnload(fileName: string): void {
        const eventArgs: UnloadEventArgs = { name: 'documentUnload', documentName: fileName };
        this.trigger('documentUnload', eventArgs);
    }

    /**
     * @param isPasswordRequired
     * @param password
     * @private
     */
    public fireDocumentLoadFailed(isPasswordRequired: boolean, password: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: LoadFailedEventArgs = { name: 'documentLoadFailed', documentName: this.fileName, isPasswordRequired: isPasswordRequired, password: password };
        this.trigger('documentLoadFailed', eventArgs);
    }

    /**
     * @param errorStatusCode
     * @param errorMessage
     * @param action
     * @param retryCount
     * @private
     */
    public fireAjaxRequestFailed(errorStatusCode: number, errorMessage: string, action: string, retryCount?: boolean): void {
        // eslint-disable-next-line max-len
        const eventArgs: AjaxRequestFailureEventArgs = { name: 'ajaxRequestFailed', documentName: this.fileName, errorStatusCode: errorStatusCode, errorMessage: errorMessage, action: action };
        if (retryCount) {
            eventArgs.retryCount = true;
        }
        this.trigger('ajaxRequestFailed', eventArgs);
    }

    /**
     * @param action
     * @param data
     * @private
     */
    public fireAjaxRequestSuccess(action: string, data: any): any {
        const eventArgs: AjaxRequestSuccessEventArgs = { name: 'ajaxRequestSuccess', documentName: this.fileName, action: action, data: data, cancel: false };
        this.trigger('ajaxRequestSuccess', eventArgs);
        if(eventArgs.cancel){
            return true;
        } else {
           return false;
        }
    }
    /**
     * @param action
     * @private
     */
    public fireValidatedFailed(action: string): void {
        if (!isBlazor()) {
            // eslint-disable-next-line max-len
            const eventArgs: ValidateFormFieldsArgs = { formField: this.formFieldCollections, documentName: this.fileName, nonFillableFields: this.viewerBase.nonFillableFields };
            this.trigger('validateFormFields', eventArgs);
        }   else {
            // eslint-disable-next-line
            let eventArgs: any = {};
            eventArgs.documentName = this.fileName;
            eventArgs.formFields = this.formFieldCollections;
            eventArgs.nonFillableFields = this.viewerBase.nonFillableFields;
            this.trigger('validateFormFields', eventArgs);
        }
    }

    /**
     * @param x
     * @param y
     * @param pageNumber
     * @private
     */
    public firePageClick(x: number, y: number, pageNumber: number): void {
        const eventArgs: PageClickEventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    }

    /**
     * @param previousPageNumber
     * @private
     */
    public firePageChange(previousPageNumber: number): void {
        // eslint-disable-next-line max-len
        const eventArgs: PageChangeEventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.currentPageNumber, previousPageNumber: previousPageNumber };
        this.trigger('pageChange', eventArgs);
        if (isBlazor()) {
            //this._dotnetInstance.invokeMethodAsync('OnPageChanged', this.currentPageNumber);
            this.viewerBase.blazorUIAdaptor.pageChanged(this.currentPageNumber);
        }
    }

    /**
     * @private
     */
    public fireZoomChange(): void {
        // eslint-disable-next-line max-len
        const eventArgs: ZoomChangeEventArgs = { name: 'zoomChange', zoomValue: this.magnificationModule.zoomFactor * 100, previousZoomValue: this.magnificationModule.previousZoomFactor * 100 };
        this.trigger('zoomChange', eventArgs);
    }

    /**
     * @param hyperlink
     * @param hyperlinkElement
     * @private
     */
    public async fireHyperlinkClick(hyperlink: string, hyperlinkElement: HTMLAnchorElement): Promise<boolean> {
        // eslint-disable-next-line max-len
        let eventArgs: HyperlinkClickEventArgs = { name: 'hyperlinkClick', hyperlink: hyperlink, hyperlinkElement: hyperlinkElement, cancel:false};
        if (isBlazor()) {
            eventArgs = await this.triggerEvent('hyperlinkClick', eventArgs) as HyperlinkClickEventArgs || eventArgs;
        } else { 
            this.triggerEvent('hyperlinkClick', eventArgs);
        }
        if(eventArgs.hyperlinkElement.href != eventArgs.hyperlink){
            hyperlinkElement.href = eventArgs.hyperlink;
        }
        if(eventArgs.cancel){
            return false;
        }else{
           return true;
        }
    }

    /**
     * @param hyperlinkElement
     * @private
     */
    public fireHyperlinkHover(hyperlinkElement: HTMLAnchorElement): void {
        // eslint-disable-next-line max-len
        const eventArgs: HyperlinkMouseOverArgs = { name: 'hyperlinkMouseOver', hyperlinkElement: hyperlinkElement };
        this.trigger('hyperlinkMouseOver', eventArgs);
    }

    /**
     * @param fieldName
     * @param value
     * @private
     */
    public fireFocusOutFormField(fieldName: string, value: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: FormFieldFocusOutEventArgs = { name: 'formFieldFocusOut', fieldName: fieldName, value: value};
        // eslint-disable-next-line
        this.trigger('formFieldFocusOut', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationAdd(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any, customStampName?: string): void {
        const eventArgs: AnnotationAddEventArgs = { name: 'annotationAdd', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        if (textMarkupContent) {
            if (isBlazor()) {
                eventArgs.annotationSettings.textMarkupContent = textMarkupContent;
                eventArgs.annotationSettings.textMarkupStartIndex = tmStartIndex;
                eventArgs.annotationSettings.textMarkupEndIndex = tmEndIndex;
            } else {
                eventArgs.textMarkupContent = textMarkupContent;
                eventArgs.textMarkupStartIndex = tmStartIndex;
                eventArgs.textMarkupEndIndex = tmEndIndex;
            }
        }
        if (labelSettings) {
            eventArgs.labelSettings = labelSettings;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        if (type === 'Image') {
            eventArgs.customStampName = customStampName;
        }
        this.viewerBase.isAnnotationSelect = false;
        this.trigger('annotationAdd', eventArgs);
        if (isBlazor()) {
            // this._dotnetInstance.invokeMethodAsync('AnnotationAdd', null);
            this.viewerBase.blazorUIAdaptor.annotationAdd();
        }
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationRemoveEventArgs = { name: 'annotationRemove', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBounds: bounds };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationRemove', eventArgs);
    }

    /**
     * @param value
     * @private
     */
    // eslint-disable-next-line
    public fireBeforeAddFreeTextAnnotation(value: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: BeforeAddFreeTextEventArgs = { name: 'beforeAddFreeText', value: value };
        // eslint-disable-next-line
        this.trigger('beforeAddFreeText', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentAdd(id: string, text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentAdd', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentAdd', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentEdit(id: string, text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentEdit', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentEdit', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentDelete(id: string, text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentDelete', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentDelete', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentSelect(id: string ,text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentSelect', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentSelect', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @param statusChange
     * @private
     */
    // eslint-disable-next-line
    public fireCommentStatusChanged(id: string, text: string, annotation: any, statusChange: CommentStatus): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentStatusChanged', id: id, text: text, annotation: annotation, status: statusChange};
        // eslint-disable-next-line
        this.trigger('commentStatusChanged', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param isColorChanged
     * @param isOpacityChanged
     * @param isTextChanged
     * @param isCommentsChanged
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line max-len
    // eslint-disable-next-line
    public fireAnnotationPropertiesChange(pageNumber: number, index: string, type: AnnotationType, isColorChanged: boolean, isOpacityChanged: boolean, isTextChanged: boolean, isCommentsChanged: boolean, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationPropertiesChangeEventArgs = { name: 'annotationPropertiesChange', pageIndex: pageNumber, annotationId: index, annotationType: type, isColorChanged: isColorChanged, isOpacityChanged: isOpacityChanged, isTextChanged: isTextChanged, isCommentsChanged: isCommentsChanged };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationPropertiesChange', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureAdd(pageNumber: number, index: string, type: any, bounds: any, opacity: number, strokeColor?: string, thickness?: number, data?: string): void {
        const eventArgs: AddSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds, opacity: opacity };
        if (thickness) {
            eventArgs.thickness = thickness;
        }
        if (strokeColor) {
            eventArgs.strokeColor = strokeColor;
        }
        if (data) {
            eventArgs.data = data;
        }
        this.trigger('addSignature', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any): void {
        const eventArgs: RemoveSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds };
        this.trigger('removeSignature', eventArgs);
    }

    /**
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureMove(pageNumber: number, id: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, previousPosition: object, currentPosition: object): void {
        const eventArgs: MoveSignatureEventArgs = { pageIndex: pageNumber, id: id, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('moveSignature', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param isStrokeColorChanged
     * @param isOpacityChanged
     * @param isThicknessChanged
     * @param oldProp
     * @param newProp
     * @private
     */
    // eslint-disable-next-line
    public fireSignaturePropertiesChange(pageNumber: number, index: string, type: AnnotationType, isStrokeColorChanged: boolean, isOpacityChanged: boolean, isThicknessChanged: boolean, oldProp: any, newProp: any): void {
        const eventArgs: SignaturePropertiesChangeEventArgs = { pageIndex: pageNumber, id: index, type: type, isStrokeColorChanged: isStrokeColorChanged, isOpacityChanged: isOpacityChanged, isThicknessChanged: isThicknessChanged, oldValue: oldProp, newValue: newProp };
        this.trigger('signaturePropertiesChange', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param currentPosition
     * @param previousPosition
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureResize(pageNumber: number, index: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, currentPosition: any, previousPosition: any): void {
        const eventArgs: ResizeSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, currentPosition: currentPosition, previousPosition: previousPosition };
        this.trigger('resizeSignature', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param signature
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureSelect(id: string, pageNumber: number, signature: object) {
        const eventArgs: SignatureSelectEventArgs = { id: id, pageIndex: pageNumber, signature: signature };
        this.trigger('signatureSelect', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param annotation
     * @param annotationCollection
     * @param multiPageCollection
     * @param isSelected
     * @param annotationAddMode
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationSelect(id: string, pageNumber: number, annotation: any, annotationCollection?: any, multiPageCollection?: any, isSelected?: boolean, annotationAddMode?: string): void {
        // eslint-disable-next-line max-len
        let eventArgs: AnnotationSelectEventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        if (annotationCollection) {
            // eslint-disable-next-line max-len
            eventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation, annotationCollection: annotationCollection };
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        if (isSelected) {
            eventArgs.isProgrammaticSelection = isSelected;
        }
        if (annotationAddMode) {
            eventArgs.annotationAddMode = annotationAddMode;
        }

        if (isBlazor()) {
            if (annotation.type === 'FreeText' ) {
                // eslint-disable-next-line
                let fontStyle: any  = { isBold : false, isItalic : false, isStrikeout : false, isUnderline : false };
                if (annotation.fontStyle === 1 ) {
                    fontStyle.isBold = true;
                } else if (annotation.fontStyle === 2) {
                    fontStyle.isItalic = true;
                } else if (annotation.fontStyle === 3) {
                    fontStyle.isStrikeout = true;
                } else if (annotation.fontStyle === 4) {
                    fontStyle.isUnderline = true;
                }
                annotation.fontStyle = fontStyle;
            }
            //this._dotnetInstance.invokeMethodAsync('AnnotationSelect', annotation.type);
            this.viewerBase.blazorUIAdaptor.annotationSelect(annotation.type);
        }
        this.trigger('annotationSelect', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationUnSelect(id: string, pageNumber: number, annotation: any): void {
        if (isBlazor()) {
            this.viewerBase.blazorUIAdaptor.annotationUnSelect();
        }
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationUnSelectEventArgs = { name: 'annotationUnSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationUnSelect', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationDoubleClick(id: string, pageNumber: number, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationDoubleClickEventArgs = { name: 'annotationDblClick', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationDoubleClick', eventArgs);
    }

    /**
     * @param pageNumber
     * @private
     */
    public fireTextSelectionStart(pageNumber: number): void {
        this.isTextSelectionStarted = true;
        const eventArgs: TextSelectionStartEventArgs = { pageIndex: pageNumber };
        this.trigger('textSelectionStart', eventArgs);
    }

    /**
     * @param pageNumber
     * @param text
     * @param bound
     * @private
     */
    // eslint-disable-next-line
    public fireTextSelectionEnd(pageNumber: number, text: string, bound: any[]): void {
        if (this.isTextSelectionStarted) {
            const eventArgs: TextSelectionEndEventArgs = { pageIndex: pageNumber, textContent: text, textBounds: bound };
            this.trigger('textSelectionEnd', eventArgs);
            this.isTextSelectionStarted = false;
        }
    }

    /**
     * @param canvas
     * @param index
     * @private
     */
    public renderDrawing(canvas?: HTMLCanvasElement, index?: number): void {
        if (isNullOrUndefined(index) && this.viewerBase.activeElements.activePageID && !this.viewerBase.isPrint) {
            index = this.viewerBase.activeElements.activePageID;
        }
        if (this.annotation) {
            this.annotation.renderAnnotations(index, null, null, null, canvas);
        } else if(this.formDesignerModule){
            this.formDesignerModule.updateCanvas(index, canvas);
        }
    }
    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationResize(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any): void {
        const eventArgs: AnnotationResizeEventArgs = { name: 'annotationResize', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (labelSettings) {
            eventArgs.labelSettings = labelSettings;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationResize', eventArgs);
    }
    /**
     * @param pageNumber
     * @param id
     * @param type
     * @param annotationSettings
     * @param previousPosition
     * @param currentPosition
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMoving(pageNumber: number, id: string, type: AnnotationType, annotationSettings: any, previousPosition: object, currentPosition: object): void {
        const eventArgs: AnnotationMovingEventArgs = { name: 'annotationMoving', pageIndex: pageNumber, annotationId: id, annotationType: type, annotationSettings: annotationSettings, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('annotationMoving', eventArgs);
    }

     /**
     * @param pageNumber
     * @param id
     * @param type
     * @param annotationSettings
     * @param previousPosition
     * @param currentPosition
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMove(pageNumber: number, id: string, type: AnnotationType, annotationSettings: any, previousPosition: object, currentPosition: object): void {
        const eventArgs: AnnotationMoveEventArgs = { name: 'annotationMove', pageIndex: pageNumber, annotationId: id, annotationType: type, annotationSettings: annotationSettings, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('annotationMove', eventArgs);
    }
    /**
     * @param id
     * @param pageNumber
     * @param annotationType
     * @param bounds
     * @param annotation
     * @param currentPosition
     * @param mousePosition
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMouseover(id: string, pageNumber: number, annotationType: AnnotationType, bounds: any, annotation: any, currentPosition: any, mousePosition: any) {
        const eventArgs: AnnotationMouseoverEventArgs = { name: 'annotationMouseover', annotationId: id, pageIndex: pageNumber, annotationType: annotationType, annotationBounds: bounds, annotation: annotation, pageX: currentPosition.left, pageY: currentPosition.top, X: mousePosition.left, Y: mousePosition.top };
        if (isBlazor()) {
            if (annotation.subject === 'Perimeter calculation') {
                eventArgs.annotationType = 'Perimeter';
            } else if (annotation.subject === 'Area calculation') {
                eventArgs.annotationType = 'Area';
            } else if (annotation.subject === 'Volume calculation') {
                eventArgs.annotationType = 'Volume';
            } else if (annotation.subject === 'Arrow') {
                eventArgs.annotationType = 'Arrow';
            } else if (annotation.subject === 'Circle') {
                eventArgs.annotationType = 'Circle';
            }
        }
        this.trigger('annotationMouseover', eventArgs);
    }
    /**
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMouseLeave(pageNumber: number) {
        const eventArgs: AnnotationMouseLeaveEventArgs = { name: 'annotationMouseLeave', pageIndex: pageNumber };
        this.trigger('annotationMouseLeave', eventArgs);
    }
    /**
     * @param pageX
     * @param pageY
     * @private
     */
    public firePageMouseover(pageX: number, pageY: number): void {
        const eventArgs: PageMouseoverEventArgs = { pageX: pageX, pageY: pageY };
        this.trigger('pageMouseover', eventArgs);
    }
    /**
     * @param fileName
     * @private
     */
    public fireDownloadStart(fileName: string): void {
        const eventArgs: DownloadStartEventArgs = { fileName: fileName };
        this.trigger('downloadStart', eventArgs);
    }
    /**
     * @param fileName
     * @param downloadData
     * @private
     */
    public fireDownloadEnd(fileName: string, downloadData: string): void {
        const eventArgs: DownloadEndEventArgs = { fileName: fileName, downloadDocument: downloadData };
        this.trigger('downloadEnd', eventArgs);
    }
    /**
     * @private
     */
    // eslint-disable-next-line
    public async firePrintStart(): Promise<void> {
        let eventArgs: PrintStartEventArgs = { fileName: this.downloadFileName, cancel: false };
        if (isBlazor) {
            eventArgs = await this.triggerEvent('printStart', eventArgs) as PrintStartEventArgs || eventArgs;
        } else {
            this.triggerEvent('printStart', eventArgs);
        }
        if (!eventArgs.cancel) {
            this.printModule.print();
        }
    }
    /**
     * @param eventName
     * @param args
     * @param eventName
     * @param args
     * @private
     */
    public async triggerEvent(eventName: string, args: object): Promise<void | object> {
        let eventArgs: void | object = await this.trigger(eventName, args);
        if (isBlazor && typeof eventArgs === 'string') {
            eventArgs = JSON.parse(eventArgs as string);
        }
        return eventArgs;
    }
    /**
     * @param fileName
     * @private
     */
    public firePrintEnd(fileName: string): void {
        const eventArgs: PrintEndEventArgs = { fileName: fileName };
        this.trigger('printEnd', eventArgs);
    }
    /**
     * @param pageNumber
     * @private
     */
    public fireThumbnailClick(pageNumber: number): void {
        const eventArgs: ThumbnailClickEventArgs = { name: 'thumbnailClick', pageNumber: pageNumber };
        this.trigger('thumbnailClick', eventArgs);
    }

    /**
     * @param pageNumber
     * @param position
     * @param text
     * @param fileName
     * @private
     */
    public fireBookmarkClick(pageNumber: number, position: number, text: string, fileName: string ): void {
        // eslint-disable-next-line
        let eventArgs: BookmarkClickEventArgs = { name: 'bookmarkClick', pageNumber: pageNumber , position: position, text: text, fileName: fileName};
        this.trigger('bookmarkClick', eventArgs);
    }
    /**
     * @param importData
     * @private
     */
    // eslint-disable-next-line
    public fireImportStart(importData: any): void {
        const eventArgs: ImportStartEventArgs = { name: 'importAnnotationsStart', importData: importData, formFieldData: null};
        this.trigger('importStart', eventArgs);
    }
    /**
     * @param exportData
     * @private
     */
    // eslint-disable-next-line
    public fireExportStart(exportData: any): any {
        const eventArgs: ExportStartEventArgs = { name: 'exportAnnotationsStart', exportData: exportData, formFieldData: null, cancel: false };
        this.trigger('exportStart', eventArgs);
        if (eventArgs.cancel) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * @param importData
     * @private
     */
    // eslint-disable-next-line
    public fireImportSuccess(importData: any): void {
        const eventArgs: ImportSuccessEventArgs = { name: 'importAnnotationsSuccess', importData: importData, formFieldData: null };
        this.trigger('importSuccess', eventArgs);
    }
    /**
     * @param exportData
     * @param fileName
     * @private
     */
    // eslint-disable-next-line
    public fireExportSuccess(exportData: any, fileName: string): void {
        const eventArgs: ExportSuccessEventArgs = { name: 'exportAnnotationsSuccess', exportData: exportData, fileName: fileName, formFieldData: null };
        this.trigger('exportSuccess', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireImportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ImportFailureEventArgs = { name: 'importAnnotationsFailed', importData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('importFailed', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireExportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ExportFailureEventArgs = { name: 'exportAnnotationsFailed', exportData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('exportFailed', eventArgs);
    }
    /**
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireFormImportStarted(data: any): void {
        const eventArgs: ImportStartEventArgs = { name: 'importFormFieldsStart', importData: null, formFieldData: data };
        this.trigger('importStart', eventArgs);
    }
    /**
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireFormExportStarted(data: any): any {
        const eventArgs: ExportStartEventArgs = { name: 'exportFormFieldsStart', exportData: null, formFieldData: data, cancel: false };
        this.trigger('exportStart', eventArgs);
        if (eventArgs.cancel) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireFormImportSuccess(data: any): void {
        const eventArgs: ImportSuccessEventArgs = { name: 'importFormFieldsSuccess', importData: data, formFieldData: data };
        this.trigger('importSuccess', eventArgs);
    }
    /**
     * @param data
     * @param fileName
     * @private
     */
    // eslint-disable-next-line
    public fireFormExportSuccess(data: any, fileName: string): void {
        const eventArgs: ExportSuccessEventArgs = { name: 'exportFormFieldsSuccess', exportData: data, fileName: fileName, formFieldData: data };
        this.trigger('exportSuccess', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireFormImportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ImportFailureEventArgs = { name: 'importFormFieldsfailed', importData: data, errorDetails: errorDetails, formFieldData: data };
        this.trigger('importFailed', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireFormExportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ExportFailureEventArgs = { name: 'exportFormFieldsFailed', exportData: data, errorDetails: errorDetails, formFieldData: data };
        this.trigger('exportFailed', eventArgs);
    }

    /**
     * @param documentCollection
     * @private
     */
    // eslint-disable-next-line
    public fireTextExtractionCompleted(documentCollection: DocumentTextCollectionSettingsModel[][]): void {
        const eventArgs: ExtractTextCompletedEventArgs = { documentTextCollection: documentCollection };
        this.trigger('extractTextCompleted', eventArgs);
    }
    /**
     * @param searchText
     * @param isMatchcase
     * @private
     */
    // eslint-disable-next-line
    public fireTextSearchStart(searchText: string, isMatchcase: boolean): void {
        // eslint-disable-next-line max-len
        const eventArgs: TextSearchStartEventArgs = { name: 'textSearchStart', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchStart', eventArgs);
    }
    /**
     * @param searchText
     * @param isMatchcase
     * @private
     */
    // eslint-disable-next-line
    public fireTextSearchComplete(searchText: string, isMatchcase: boolean): void {
        // eslint-disable-next-line max-len
        const eventArgs: TextSearchCompleteEventArgs = { name: 'textSearchComplete', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchComplete', eventArgs);
    }
    /**
     * @param searchText
     * @param isMatchcase
     * @param bounds
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public fireTextSearchHighlight(searchText: string, isMatchcase: boolean, bounds: RectangleBoundsModel, pageNumber: number): void {
        // eslint-disable-next-line max-len
        const eventArgs: TextSearchHighlightEventArgs = { name: 'textSearchHighlight', searchText: searchText, matchCase: isMatchcase, bounds: bounds, pageNumber: pageNumber };
        this.trigger('textSearchHighlight', eventArgs);
    }
    /**
     * @param bounds
     * @param commonStyle
     * @param cavas
     * @param index
     * @private
     */
    public renderAdornerLayer(bounds: ClientRect, commonStyle: string, cavas: HTMLElement, index: number): void {
        renderAdornerLayer(bounds, commonStyle, cavas, index, this);
    }
    /**
     * @param index
     * @param currentSelector
     * @private
     */
    public renderSelector(index: number, currentSelector?: AnnotationSelectorSettingsModel): void {
        this.drawing.renderSelector(index, currentSelector);
    }
    /**
     * @param objArray
     * @param currentSelector
     * @param multipleSelection
     * @param preventUpdate
     * @private
     */
    // eslint-disable-next-line max-len
    public select(objArray: string[], currentSelector?: AnnotationSelectorSettingsModel, multipleSelection?: boolean, preventUpdate?: boolean): void {
        let allowServerDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        if (this.annotationModule) {
            let module: any = this.annotationModule.textMarkupAnnotationModule;
            const annotationSelect: number = module && module.selectTextMarkupCurrentPage;
            // eslint-disable-next-line
            let annotation: any = this.selectedItems.annotations[0];
            if (annotationSelect) {
                // eslint-disable-next-line
                let currentAnnot: any = this.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                this.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(annotationSelect, true);
                this.fireAnnotationUnSelect(currentAnnot.annotName, currentAnnot.pageNumber, currentAnnot);
            }
            if (!multipleSelection) {
                if (this.viewerBase.activeElements && this.viewerBase.activeElements.activePageID >= 0) {
                    if (!this.viewerBase.isNewStamp && annotation && annotation.shapeAnnotationType !== 'HandWrittenSignature' && annotation.shapeAnnotationType !== 'SignatureText' && annotation.shapeAnnotationType !== 'SignatureImage') {
                        this.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                    }
                }
            }
        }
        if (this.formDesignerModule) {
            let formField: any = this.selectedItems.formFields[0];
            if (formField) {
                if (this.formDesignerModule && formField && formField.formFieldAnnotationType) {
                    let field: IFormField = {
                        name: (formField as any).name, id: (formField as any).id, value: (formField as any).value, fontFamily: formField.fontFamily, fontSize: formField.fontSize, fontStyle: (formField as any).fontStyle,
                        color: (formField as PdfFormFieldBaseModel).color, backgroundColor: (formField as PdfFormFieldBaseModel).backgroundColor, borderColor: (formField as PdfFormFieldBaseModel).borderColor,
                        thickness: (formField as PdfFormFieldBaseModel).thickness, alignment: (formField as PdfFormFieldBaseModel).alignment, isReadonly: (formField as any).isReadonly, visibility: (formField as any).visibility,
                        maxLength: (formField as any).maxLength, isRequired: (formField as any).isRequired, isPrint: formField.isPrint, rotation: (formField as any).rotateAngle, tooltip: (formField as any).tooltip, options: (formField as any).options,
                        isChecked: (formField as any).isChecked, isSelected: (formField as any).isSelected
                    };
                    this.fireFormFieldUnselectEvent("formFieldUnselect", field, formField.pageIndex);
                }
            }
        }
        let proxy: any = this;
        this.viewerBase.renderedPagesList.forEach(function (item) {
            proxy.clearSelection(item);
        });
        this.drawing.select(objArray, currentSelector, multipleSelection, preventUpdate);
        this.enableServerDataBinding(allowServerDataBind, true);
    }
    /**
     * @param pageId
     * @private
     */
    public getPageTable(pageId: number): ZOrderPageTable {
        return this.drawing.getPageTable(pageId);
    }
    /**
     * @param diffX
     * @param diffY
     * @param pageIndex
     * @param currentSelector
     * @param helper
     * @private
     */
    // eslint-disable-next-line max-len
    public dragSelectedObjects(diffX: number, diffY: number, pageIndex: number, currentSelector?: AnnotationSelectorSettingsModel, helper?: PdfAnnotationBaseModel): boolean {
        return this.drawing.dragSelectedObjects(diffX, diffY, pageIndex, currentSelector, helper);
    }
    /**
     * @param sx
     * @param sy
     * @param pivot
     * @private
     */
    public scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean {
        return this.drawing.scaleSelectedItems(sx, sy, pivot);
    }
    /**
     * @param endPoint
     * @param obj
     * @param point
     * @param segment
     * @param target
     * @param targetPortId
     * @param currentSelector
     * @private
     */
    // eslint-disable-next-line max-len
    public dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string, currentSelector?: AnnotationSelectorSettingsModel): boolean {
        return this.drawing.dragConnectorEnds(endPoint, obj, point, segment, target, null, currentSelector);
    }
    /**
     * @param pageId
     * @private
     */
    public clearSelection(pageId: number): void {
        let allowServerDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        const selectormodel: SelectorModel = this.selectedItems;
        const node: PdfAnnotationBaseModel | PdfFormFieldBaseModel = selectormodel.annotations.length > 0 ? this.selectedItems.annotations[0]: this.selectedItems.formFields[0];
        if (selectormodel.annotations.length > 0) {
            selectormodel.offsetX = 0;
            selectormodel.offsetY = 0;
            selectormodel.width = 0;
            selectormodel.height = 0;
            selectormodel.rotateAngle = 0;
            selectormodel.annotations = [];
            selectormodel.wrapper = null;
        } else if(selectormodel.formFields.length > 0) {
            selectormodel.offsetX = 0;
            selectormodel.offsetY = 0;
            selectormodel.width = 0;
            selectormodel.height = 0;
            selectormodel.rotateAngle = 0;
            selectormodel.formFields = [];
            selectormodel.wrapper = null;
        }
        this.drawing.clearSelectorLayer(pageId);
        this.viewerBase.isAnnotationSelect = false;
        this.viewerBase.isFormFieldSelect = false;
        if(this.annotationModule){
            let module: any = this.annotationModule.textMarkupAnnotationModule;
            if (module) {
                const annotationSelect: number = module.selectTextMarkupCurrentPage;
                this.annotationModule.textMarkupAnnotationModule.clearCurrentSelectedAnnotation();
                this.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(annotationSelect);
            }
        }
        this.enableServerDataBinding(allowServerDataBind, true);
    } 

    /**
     * Get page number from the user coordinates x and y.
     *
     * @param {Point} clientPoint - The user will provide a x, y coordinates.
     * @returns number
     */

    public getPageNumberFromClientPoint(clientPoint: Point): number {
        let pageNumber: number = this.viewerBase.getPageNumberFromClientPoint(clientPoint);
        return pageNumber;
    }

    /**
     * Convert user coordinates to the PDF page coordinates.
     *
     * @param {Point} clientPoint - The user should provide a x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns Point
     */

    public convertClientPointToPagePoint(clientPoint: Point, pageNumber: number): Point {
        let pagePoint: any = this.viewerBase.convertClientPointToPagePoint(clientPoint, pageNumber);
        return pagePoint;
    }

    /**
     * Convert page coordinates to the user coordinates.
     *
     * @param {Point} pagePoint - The user should provide a page x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns Point
     */

    public convertPagePointToClientPoint(pagePoint: Point, pageNumber: number): Point {
        let clientPoint: any = this.viewerBase.convertPagePointToClientPoint(pagePoint, pageNumber);
        return clientPoint;
    }

    /**
     * Convert page coordinates to the scrolling coordinates.
     *
     * @param {Point} pagePoint - The user should provide a page x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns Point
     */

    public convertPagePointToScrollingPoint(pagePoint: Point, pageNumber: number): Point {
        let scrollingPoint: any = this.viewerBase.convertPagePointToScrollingPoint(pagePoint, pageNumber);
        return scrollingPoint;
    }

    /**
     * Brings the given rectangular region to view and zooms in the document to fit the region in client area (view port).
     *
     * @param {Rect} rectangle - Specifies the region in client coordinates that is to be brought to view.
     */
    public zoomToRect(rectangle: Rect) : void {
        this.magnificationModule.zoomToRect(rectangle);   
    }

    /**
     * @param obj
     * @private
     */
    public add(obj: PdfAnnotationBase): PdfAnnotationBaseModel {
        return this.drawing.add(obj);
    }
    /**
     * @param obj
     * @private
     */
    public remove(obj: PdfAnnotationBaseModel): void {
        return this.drawing.remove(obj);
    }
    /**
     * @private
     */
    public copy(): Object {
        if(this.annotation)
          this.annotation.isShapeCopied = true;
        else if(this.formDesigner && this.designerMode)
          this.formDesigner.isShapeCopied = true;
        return this.drawing.copy();
    }
    /**
     * @param angle
     * @param currentSelector
     * @private
     */
    public rotate(angle: number, currentSelector?: AnnotationSelectorSettingsModel): boolean {
        return this.drawing.rotate(this.selectedItems, angle, null, currentSelector);
    }
    /**
     * @param obj
     * @private
     */
    public paste(obj?: PdfAnnotationBaseModel[]): void {
        let index: number;
        if (this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        return this.drawing.paste(obj, index || 0);
    }
    /**
     * @private
     */
    public refresh(): void {
        for (let i: number = 0; i < this.annotations.length; i++) {
            if (this.zIndexTable.length !== undefined) {
                const notFound: boolean = true;
                for (let i: number = 0; i < this.zIndexTable.length; i++) {
                    const objects: (PdfAnnotationBaseModel)[] = this.zIndexTable[i].objects;
                    for (let j: number = 0; j < objects.length; j++) {
                        objects.splice(j, 1);
                    }
                    delete this.zIndexTable[i];
                }
                if (this.annotations[i]) {
                    delete this.annotations[i];
                }
                if (this.selectedItems.annotations && this.selectedItems.annotations[i]) {
                    delete this.selectedItems.annotations[i];
                }
                this.zIndexTable = [];
                this.renderDrawing();
            }
            if (this.annotations && this.annotations.length !== 0) {
                this.annotations.length = 0;
                this.selectedItems.annotations.length = 0;
            }
        }
    }
    /**
     * @private
     */
    public cut(): void {
        let index: number;
        if (this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        if(this.annotation)
          this.annotation.isShapeCopied = true;
        else if(this.formDesigner && this.designerMode)
          this.formDesigner.isShapeCopied = true;
        return this.drawing.cut(index || 0);
    }
    /**
     * @param actualObject
     * @param node
     * @private
     */
    public nodePropertyChange(
        actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel): void {
        this.drawing.nodePropertyChange(actualObject, node);
    }

    /**
     * enableServerDataBinding method 
     *
     * @returns { void }  enableServerDataBinding method.
     * @param {boolean} enable - provide the node value.
     *
     * @private
     */
    public enableServerDataBinding(enable: boolean, clearBulkChanges: boolean = false): void {
        if (isBlazor()) {
            this.allowServerDataBinding = enable;
            if (clearBulkChanges) {
                this.bulkChanges = {};
            }
        }
    }

    /**
     * @param tx
     * @param ty
     * @param pageIndex
     * @param nodeBounds
     * @param isStamp
     * @param isSkip
     * @private
     */
    // eslint-disable-next-line max-len
    public checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect, isStamp?: boolean, isSkip?: boolean): boolean {
        return this.drawing.checkBoundaryConstraints(tx, ty, pageIndex, nodeBounds, isStamp, isSkip);
    }

}
