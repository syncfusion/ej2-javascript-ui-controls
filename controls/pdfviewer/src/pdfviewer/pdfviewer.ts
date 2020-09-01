// tslint:disable-next-line:max-line-length
import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex, isBlazor } from '@syncfusion/ej2-base';
import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType } from '@syncfusion/ej2-base';
// tslint:disable-next-line:max-line-length
import { PdfViewerModel, HighlightSettingsModel, UnderlineSettingsModel, StrikethroughSettingsModel, LineSettingsModel, ArrowSettingsModel, RectangleSettingsModel, CircleSettingsModel, PolygonSettingsModel, StampSettingsModel, StickyNotesSettingsModel, CustomStampSettingsModel, VolumeSettingsModel, RadiusSettingsModel, AreaSettingsModel, PerimeterSettingsModel, DistanceSettingsModel, MeasurementSettingsModel, FreeTextSettingsModel, AnnotationSelectorSettingsModel, TextSearchColorSettingsModel, DocumentTextCollectionSettingsModel, TextDataSettingsModel, RectangleBoundsModel } from './pdfviewer-model';
import { ToolbarSettingsModel, ShapeLabelSettingsModel } from './pdfviewer-model';
// tslint:disable-next-line:max-line-length
import { ServerActionSettingsModel, AjaxRequestSettingsModel, CustomStampModel, HandWrittenSignatureSettingsModel, AnnotationSettingsModel, TileRenderingSettingsModel, ScrollSettingsModel, FormFieldModel , InkAnnotationSettingsModel } from './pdfviewer-model';
import { PdfViewerBase } from './index';
import { Navigation } from './index';
import { Magnification } from './index';
import { Toolbar } from './index';
import { ToolbarItem } from './index';
// tslint:disable-next-line:max-line-length
import { LinkTarget, InteractionMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction, FontStyle, TextAlignment, AnnotationResizerShape, AnnotationResizerLocation, ZoomMode, PrintMode, CursorType, ContextMenuItem, DynamicStampItem, SignStampItem, StandardBusinessStampItem, FormFieldType, AllowedInteraction } from './base/types';
import { Annotation } from './index';
import { LinkAnnotation } from './index';
import { ThumbnailView } from './index';
import { BookmarkView } from './index';
import { TextSelection } from './index';
import { TextSearch } from './index';
import { FormFields } from './index';
import { Print, CalibrationUnit } from './index';
// tslint:disable-next-line:max-line-length
import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs, ImportStartEventArgs, ImportSuccessEventArgs, ImportFailureEventArgs, ExportStartEventArgs, ExportSuccessEventArgs, ExportFailureEventArgs, AjaxRequestInitiateEventArgs } from './index';
import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs, AnnotationMoveEventArgs, AnnotationDoubleClickEventArgs, AnnotationMouseoverEventArgs, PageMouseoverEventArgs, AnnotationMouseLeaveEventArgs } from './index';
// tslint:disable-next-line:max-line-length
import { TextSelectionStartEventArgs, TextSelectionEndEventArgs, DownloadStartEventArgs, DownloadEndEventArgs, ExtractTextCompletedEventArgs, PrintStartEventArgs, PrintEndEventArgs } from './index';
// tslint:disable-next-line:max-line-length
import { TextSearchStartEventArgs, TextSearchCompleteEventArgs, TextSearchHighlightEventArgs } from './index';
import { PdfAnnotationBase, ZOrderPageTable } from './drawing/pdf-annotation';
import { PdfAnnotationBaseModel } from './drawing/pdf-annotation-model';
import { Drawing, ClipBoardObject } from './drawing/drawing';
import { Selector } from './drawing/selector';
import { SelectorModel } from './drawing/selector-model';
import { PointModel, IElement, Rect } from '@syncfusion/ej2-drawings';
import { renderAdornerLayer } from './drawing/dom-util';
import { ThumbnailClickEventArgs } from './index';
import { ValidateFormFieldsArgs, BookmarkClickEventArgs } from './base';
// tslint:disable-next-line:max-line-length
import { AddSignatureEventArgs, RemoveSignatureEventArgs, MoveSignatureEventArgs, SignaturePropertiesChangeEventArgs, ResizeSignatureEventArgs, SignatureSelectEventArgs } from './base';
import { ContextMenuSettingsModel } from './pdfviewer-model';


/**
 * The `ToolbarSettings` module is used to provide the toolbar settings of PDF viewer.
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
}

/**
 * The `AjaxRequestSettings` module is used to set the ajax Request Headers of PDF viewer.
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
    headerName: string;

    /**
     * specifies the ajax Header Value of the PdfViewer.
     */
    headerValue: string;
}

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
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
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
 */
export class StrikethroughSettings extends ChildProperty<StrikethroughSettings> {
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
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked strikethrough annotations.
     * IsLock can be configured using strikethrough settings.
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `UnderlineSettings` module is used to provide the properties to Underline annotation.
 */
export class UnderlineSettings extends ChildProperty<UnderlineSettings> {
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
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked underline annotations.
     * IsLock can be configured using underline settings.
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `HighlightSettings` module is used to provide the properties to Highlight annotation.
 */
export class HighlightSettings extends ChildProperty<HighlightSettings> {
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
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using highlight settings.
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `LineSettings` module is used to provide the properties to line annotation.
 */
export class LineSettings extends ChildProperty<LineSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `ArrowSettings` module is used to provide the properties to arrow annotation.
 */
export class ArrowSettings extends ChildProperty<ArrowSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `RectangleSettings` module is used to provide the properties to rectangle annotation.
 */
export class RectangleSettings extends ChildProperty<RectangleSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `CircleSettings` module is used to provide the properties to circle annotation.
 */
export class CircleSettings extends ChildProperty<CircleSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `ShapeLabelSettings` module is used to provide the properties to rectangle annotation.
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
 */
export class PolygonSettings extends ChildProperty<PolygonSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `stampSettings` module is used to provide the properties to stamp annotation.
 */
export class StampSettings extends ChildProperty<StampSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `CustomStampSettings` module is used to provide the properties to customstamp annotation.
 */
export class CustomStampSettings extends ChildProperty<CustomStampSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `DistanceSettings` module is used to provide the properties to distance calibrate annotation.
 */
export class DistanceSettings extends ChildProperty<DistanceSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `PerimeterSettings` module is used to provide the properties to perimeter calibrate annotation.
 */
export class PerimeterSettings extends ChildProperty<PerimeterSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `AreaSettings` module is used to provide the properties to area calibrate annotation.
 */
export class AreaSettings extends ChildProperty<AreaSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `RadiusSettings` module is used to provide the properties to radius calibrate annotation.
 */
export class RadiusSettings extends ChildProperty<RadiusSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `VolumeSettings` module is used to provide the properties to volume calibrate annotation.
 */
export class VolumeSettings extends ChildProperty<VolumeSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}
/**
 * The `Ink` module is used to provide the properties to Ink annotation.
 */
export class InkAnnotationSettings extends ChildProperty<InkAnnotationSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}
/**
 * The `stickyNotesSettings` module is used to provide the properties to sticky notes annotation.
 */
export class StickyNotesSettings extends ChildProperty<StickyNotesSettings> {

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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `MeasurementSettings` module is used to provide the settings to measurement annotations.
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
 */
export class FreeTextSettings extends ChildProperty<FreeTextSettings> {
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
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `AnnotationSelectorSettings` module is used to provide the properties to annotation selectors.
 */
export class AnnotationSelectorSettings extends ChildProperty<AnnotationSelectorSettings> {
    /**
     * Specifies the selection border color.
     */
    @Property('')
    public selectionBorderColor: string;

    /**
     * Specifies the border color of the resizer.
     * @ignore
     */
    @Property('black')
    public resizerBorderColor: string;

    /**
     * Specifies the fill color of the resizer.
     * @ignore
     */
    @Property('#FF4081')
    public resizerFillColor: string;

    /**
     * Specifies the size of the resizer.
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
    @Property(100)
    public width: number;

    /**
     * specified the height of the annotation.
     */
    @Property(100)
    public height: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

}

/**
 * The `AnnotationSettings` module is used to provide the properties to annotations.
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
     * @default 'false'
     */
    @Property()
    public isEmpty: boolean;
}

/**
 * The `TileRenderingSettings` module is used to provide the tile rendering settings of the PDF viewer.
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
}
/**
 * The `ContextMenuSettings` is used to show the context menu of PDF document.
 */
export class ContextMenuSettings extends ChildProperty<ContextMenuSettings> {
    /**
     * Defines the context menu action.
     * @default RightClick
     */
    @Property('RightClick')
    public contextMenuAction: ContextMenuAction;

    /**
     * Defines the context menu items should be visible in the PDF Viewer.
     *  @default []
     */
    @Property([])
    public contextMenuItems: ContextMenuItem[];
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
     */
    @Property()
    public serviceUrl: string;

    /**
     * gets the page count of the document loaded in the PdfViewer control.
     * @default 0
     */
    @Property(0)
    public pageCount: number;

    /**
     * Checks whether the PDF document is edited.
     * @asptype bool
     * @blazorType bool
     */
    @Property(false)
    public isDocumentEdited: boolean;

    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     * @default 0
     */
    @Property(0)
    public currentPageNumber: number;

    /**
     * Sets the PDF document path for initial loading.
     */
    @Property()
    public documentPath: string;

    /**
     * Returns the current zoom percentage of the PdfViewer control.
     * @asptype int
     * @blazorType int
     */
    public get zoomPercentage(): number {
        return this.magnificationModule.zoomFactor * 100;
    }

    /**
     * Get the Loaded document annotation Collections in the PdfViewer control.
     */
    // tslint:disable-next-line
    public annotationCollection: any[];

    /**
     * Get the Loaded document signature Collections in the PdfViewer control.
     */
    // tslint:disable-next-line
    public signatureCollection: any[] = [];

    /**
     * Gets or sets the document name loaded in the PdfViewer control.
     */
    public fileName: string = null;

    /**
     * Gets or sets the export annotations JSON file name in the PdfViewer control.
     */
    public exportAnnotationFileName: string = null;

    /**
     * Gets or sets the download file name in the PdfViewer control.
     */
    @Property()
    public downloadFileName: string;

    /**
     * Defines the scrollable height of the PdfViewer control.
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Defines the scrollable width of the PdfViewer control.
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**
     * Enable or disables the toolbar of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableToolbar: boolean;

    /**
     * Specifies the retry count for the failed requests.
     * @default 1
     */
    @Property(1)
    public retryCount: number;

    /**
     * If it is set as false then error message box is not displayed in PDF viewer control.
     * @default true
     */
    @Property(true)
    public showNotificationDialog: boolean;

    /**
     * Enable or disables the Navigation toolbar of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableNavigationToolbar: boolean;

    /**
     * Enable or disables the Comment Panel of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableCommentPanel: boolean;

    /**
     * If it set as true, then the command panel show at initial document loading in the PDF viewer
     * @default false
     */
    @Property(false)
    public isCommandPanelOpen: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Enable or disable the multi line text markup annotations in overlapping collections.
     * @default false
     */
    @Property(false)
    public enableMultiLineOverlap: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disables the download option of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableDownload: boolean;

    /**
     * Enable or disables the print option of PdfViewer.
     * @default true
     */
    @Property(true)
    public enablePrint: boolean;

    /**
     * Enables or disables the thumbnail view in the PDF viewer
     * @default true
     */
    @Property(true)
    public enableThumbnail: boolean;

    /**
     * If it set as true, then the thumbnail view show at initial document loading in the PDF viewer
     * @default false
     */
    @Property(false)
    public isThumbnailViewOpen: boolean;

    /**
     * Enables or disable saving Hand Written signature as editable in the PDF.
     * @default false
     */
    @Property(false)
    public isSignatureEditable: boolean;

    /**
     * Enables or disables the bookmark view in the PDF viewer
     * @default true
     */
    @Property(true)
    public enableBookmark: boolean;

    /**
     * Enables or disables the hyperlinks in PDF document.
     * @default true
     */
    @Property(true)
    public enableHyperlink: boolean;

    /**
     * Enables or disables the handwritten signature in PDF document.
     * @default true
     */
    @Property(true)
    public enableHandwrittenSignature: boolean;
    /**
     * If it is set as false, then the ink annotation support in the PDF Viewer will be disabled. By default it is true.
     * @default true
     */
    @Property(true)
    public enableInkAnnotation: boolean;
    /**
     * restrict zoom request.
     * @default false
     */
    @Property(false)
    public restrictZoomRequest: boolean;
    /**
     * Specifies the open state of the hyperlink in the PDF document.
     * @default CurrentTab
     */
    @Property('CurrentTab')
    public hyperlinkOpenState: LinkTarget;

    /**
     * Specifies the state of the ContextMenu in the PDF document.
     * @default RightClick
     */
    @Property('RightClick')
    public contextMenuOption: ContextMenuAction;

    /**
     * enable or disable context menu Items
     * @default []
     */
    @Property([])
    public disableContextMenuItems: ContextMenuItem[];

    /**
     * Gets the form fields present in the loaded PDF document. It used to get the form fields id, name, type and it's values.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ name: '', id: '', type: '', isReadOnly: false, value: '' })
    public formFieldCollections: FormFieldModel[];

    /**
     * Enable or disables the Navigation module of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableNavigation: boolean;

    /**
     * Enable or disables the auto complete option in form documents.
     * @default true
     */
    @Property(true)
    public enableAutoComplete: boolean;

    /**
     * Enable or disables the Magnification module of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableMagnification: boolean;

    /**
     * Enable or disables the Label for shapeAnnotations of PdfViewer.
     * @default false
     */
    @Property(false)
    public enableShapeLabel: boolean;

    /**
     * Enable or disables the customization of measure values in PdfViewer.
     * @default true
     */
    @Property(true)
    public enableImportAnnotationMeasurement: boolean;

    /**
     * Enable or disables the Pinch zoom of PdfViewer.
     * @default true
     */
    @Property(true)
    public enablePinchZoom: boolean;

    /**
     * Enable or disables the text selection in the PdfViewer.
     * @default true
     */
    @Property(true)
    public enableTextSelection: boolean;

    /**
     * Enable or disables the text search in the PdfViewer.
     * @default true
     */
    @Property(true)
    public enableTextSearch: boolean;

    /**
     * Enable or disable the annotation in the Pdfviewer.
     * @default true
     */
    @Property(true)
    public enableAnnotation: boolean;

    /**
     * Enable or disable the form fields in the Pdfviewer.
     * @default true
     */
    @Property(true)
    public enableFormFields: boolean;

    /**
     * Enable or disable the form fields validation.
     * @default false
     */
    @Property(false)
    public enableFormFieldsValidation: boolean;

    /**
     * Enable if the PDF document contains form fields.
     * @default false
     */
    @Property(false)
    public isFormFieldDocument: boolean;

    /**
     * Enable or disable the free text annotation in the Pdfviewer.
     * @default true
     */
    @Property(true)
    public enableFreeText: boolean;

    /**
     * Enable or disables the text markup annotation in the PdfViewer.
     * @default true
     */
    @Property(true)
    public enableTextMarkupAnnotation: boolean;

    /**
     * Enable or disables the shape annotation in the PdfViewer.
     * @default true
     */
    @Property(true)
    public enableShapeAnnotation: boolean;

    /**
     * Enable or disables the calibrate annotation in the PdfViewer.
     * @default true
     */
    @Property(true)
    public enableMeasureAnnotation: boolean;

    /**
     * Enables and disables the stamp annotations when the PDF viewer control is loaded initially.
     * @default true
     */
    @Property(true)
    public enableStampAnnotations: boolean;

    /**
     * Enables and disables the stickyNotes annotations when the PDF viewer control is loaded initially.
     * @default true
     */
    @Property(true)
    public enableStickyNotesAnnotation: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     * @default true
     */
    @Property(true)
    public enableAnnotationToolbar: boolean;

    /**
     * Sets the interaction mode of the PdfViewer
     * @default TextSelection
     */
    @Property('TextSelection')
    public interactionMode: InteractionMode;

    /**
     * Specifies the rendering mode in the PDF Viewer.
     * @default Default
     */
    @Property('Default')
    public zoomMode: ZoomMode;

    /**
     * Specifies the print mode in the PDF Viewer.
     * @default Default
     */
    @Property('Default')
    public printMode: PrintMode;

    /**
     * Sets the initial loading zoom value from 10 to 400 in PdfViewer Control.
     * @default 0
     */
    @Property(0)
    public zoomValue: number;

    /**
     *  Enable or disable the zoom optimization mode in PDF Viewer.
     * @default true
     */
    @Property(true)
    public enableZoomOptimization: boolean;

    /**
     * Enable or disables the get the document text collections.
     * @default false
     */
    @Property(false)
    public isExtractText: boolean;

    /**
     * Defines the settings of the PdfViewer toolbar.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ showTooltip: true, toolbarItems: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentTool', 'SubmitForm', 'AnnotationEditTool', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'], annotationToolbarItems: ['HighlightTool', 'UnderlineTool', 'StrikethroughTool', 'ColorEditTool', 'OpacityEditTool', 'AnnotationDeleteTool', 'StampAnnotationTool', 'HandWrittenSignatureTool', 'InkAnnotationTool', 'ShapeTool', 'CalibrateTool', 'StrokeColorEditTool', 'ThicknessEditTool', 'FreeTextAnnotationTool', 'FontFamilyAnnotationTool', 'FontSizeAnnotationTool', 'FontStylesAnnotationTool', 'FontAlignAnnotationTool', 'FontColorAnnotationTool', 'CommentPanelTool'] })
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Defines the ajax Request settings of the PdfViewer.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ ajaxHeaders: [], withCredentials: false })
    public ajaxRequestSettings: AjaxRequestSettingsModel;

    /**
     * Defines the stamp items of the PdfViewer.
     */
    // tslint:disable-next-line:max-line-length

    @Property({ customStampName: '', customStampImageSource: '' })
    public customStamp: CustomStampModel[];

    /**
     * Defines the settings of the PdfViewer service.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages', print: 'PrintImages', renderComments: 'RenderAnnotationComments', importAnnotations: 'ImportAnnotations', exportAnnotations: 'ExportAnnotations', importFormFields: 'ImportFormFields', exportFormFields: 'ExportFormFields', renderTexts: 'RenderPdfTexts' })
    public serverActionSettings: ServerActionSettingsModel;

    /**
     * Defines the settings of highlight annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, color: '#FFDF56', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'] })
    public highlightSettings: HighlightSettingsModel;

    /**
     * Defines the settings of strikethrough annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, color: '#ff0000', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'] })
    public strikethroughSettings: StrikethroughSettingsModel;

    /**
     * Defines the settings of underline annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, color: '#00ff00', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'] })
    public underlineSettings: UnderlineSettingsModel;

    /**
     * Defines the settings of line annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'None', lineHeadEndStyle: 'None', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'] })
    public lineSettings: LineSettingsModel;

    /**
     * Defines the settings of arrow annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'] })
    public arrowSettings: ArrowSettingsModel;

    /**
     * Defines the settings of rectangle annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'] })
    public rectangleSettings: RectangleSettingsModel;

    /**
     * Defines the settings of shape label.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ff0000', fontColor: '#000', fontSize: 16, labelHeight: 24.6, labelMaxWidth: 151, labelContent: 'Label' })
    public shapeLabelSettings: ShapeLabelSettingsModel;

    /**
     * Defines the settings of circle annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'] })
    public circleSettings: CircleSettingsModel;

    /**
     * Defines the settings of polygon annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'] })
    public polygonSettings: PolygonSettingsModel;

    /**
     * Defines the settings of stamp annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, dynamicStamps: [DynamicStampItem.Revised, DynamicStampItem.Reviewed, DynamicStampItem.Received, DynamicStampItem.Confidential, DynamicStampItem.Approved, DynamicStampItem.NotApproved], signStamps: [SignStampItem.Witness, SignStampItem.InitialHere, SignStampItem.SignHere, SignStampItem.Accepted, SignStampItem.Rejected], standardBusinessStamps: [StandardBusinessStampItem.Approved, StandardBusinessStampItem.NotApproved, StandardBusinessStampItem.Draft, StandardBusinessStampItem.Final, StandardBusinessStampItem.Completed, StandardBusinessStampItem.Confidential, StandardBusinessStampItem.ForPublicRelease, StandardBusinessStampItem.NotForPublicRelease, StandardBusinessStampItem.ForComment, StandardBusinessStampItem.Void, StandardBusinessStampItem.PreliminaryResults, StandardBusinessStampItem.InformationOnly], allowedInteractions: ['None'] })
    public stampSettings: StampSettingsModel;

    /**
     * Defines the settings of customStamp annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, author: 'Guest', width: 0, height: 0, left: 0, top: 0, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, enableCustomStamp: true, allowedInteractions: ['None'] })
    public customStampSettings: CustomStampSettingsModel;

    /**
     * Defines the settings of distance annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, leaderLength: 40, resizeCursorType: CursorType.move, allowedInteractions: ['None'] })
    public distanceSettings: DistanceSettingsModel;

    /**
     * Defines the settings of perimeter annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Open', lineHeadEndStyle: 'Open', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'] })
    public perimeterSettings: PerimeterSettingsModel;

    /**
     * Defines the settings of area annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'] })
    public areaSettings: AreaSettingsModel;

    /**
     * Defines the settings of radius annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'] })
    public radiusSettings: RadiusSettingsModel;

    /**
     * Defines the settings of volume annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'] })
    public volumeSettings: VolumeSettingsModel;

    /**
     * Defines the settings of stickyNotes annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ author: 'Guest', opacity: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'] })
    public stickyNotesSettings: StickyNotesSettingsModel;
    /**
     * Defines the settings of free text annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ffffff00', author: 'Guest', borderWidth: 1, width: 151, fontSize: 16, height: 24.6, fontColor: '#000', fontFamily: 'Helvetica', defaultText: 'Type Here', textAlignment: 'Left', fontStyle: FontStyle.None, allowTextOnly: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'] })
    public freeTextSettings: FreeTextSettingsModel;

    /**
     * Defines the settings of measurement annotation.
     */
    @Property({ conversionUnit: 'in', displayUnit: 'in', scaleRatio: 1, depth: 96 })
    public measurementSettings: MeasurementSettingsModel;

    /**
     * Defines the settings of annotation selector.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null })
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Sets the settings for the color of the text search highlight.
     */
    @Property({ searchHighlightColor: '#fdd835', searchColor: '#8b4c12' })
    public textSearchColorSettings: TextSearchColorSettingsModel;

    /**
     * Defines the settings of handWrittenSignature.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, strokeColor: '#000000', width: 100, height: 100, thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'] })
    public handWrittenSignatureSettings: HandWrittenSignatureSettingsModel;

    /**
     * Defines the ink annotation settings for PDF Viewer.It used to customize the strokeColor, thickness, opacity of the ink annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ author: 'Guest', opacity: 1, strokeColor: '#ff0000', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'] })
    public inkAnnotationSettings: InkAnnotationSettingsModel;

    /**
     * Defines the settings of the annotations.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ author: 'Guest', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, skipPrint: false, skipDownload: false, allowedInteractions: ['None'] })
    public annotationSettings: AnnotationSettingsModel;

    /**
     * Defines the tile rendering settings.
     */
    @Property({ enableTileRendering: true, x: 0, y: 0 })
    public tileRenderingSettings: TileRenderingSettingsModel;

    /**
     * Defines the scroll settings.
     */
    @Property({ delayPageRequestTimeOnScroll: 100 })
    public scrollSettings: ScrollSettingsModel;

    /**
     * Defines the context menu settings.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ contextMenuAction: 'RightClick', contextMenuItems: [ ContextMenuItem.Comment, ContextMenuItem.Copy, ContextMenuItem.Cut, ContextMenuItem.Delete, ContextMenuItem.Highlight, ContextMenuItem.Paste, ContextMenuItem.Properties, ContextMenuItem.ScaleRatio, ContextMenuItem.Strikethrough, ContextMenuItem.Underline] })
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
     * Gets the bookmark view object of the pdf viewer.
     * @asptype BookmarkView
     * @blazorType BookmarkView
     * @returns { BookmarkView }
     */
    public get bookmark(): BookmarkView {
        return this.bookmarkViewModule;
    }

    /**
     * Gets the print object of the pdf viewer.
     * @asptype Print
     * @blazorType Print
     * @returns { Print }
     */
    public get print(): Print {
        return this.printModule;
    }

    /**
     * Gets the magnification object of the pdf viewer.
     * @asptype Magnification
     * @blazorType Magnification
     * @returns { Magnification }
     */
    public get magnification(): Magnification {
        return this.magnificationModule;
    }
    /**
     * Gets the navigation object of the pdf viewer.
     * @asptype Navigation
     * @blazorType Navigation
     * @returns { Navigation }
     */
    public get navigation(): Navigation {
        return this.navigationModule;
    }

    /**
     * Gets the text search object of the pdf viewer.
     * @asptype TextSearch
     * @blazorType TextSearch
     * @returns { TextSearch }
     */
    public get textSearch(): TextSearch {
        return this.textSearchModule;
    }

    /**
     * Gets the toolbar object of the pdf viewer.
     * @asptype Toolbar
     * @blazorType Toolbar
     * @returns { Toolbar }
     */
    public get toolbar(): Toolbar {
        return this.toolbarModule;
    }

    /**
     * Gets the thumbnail-view object of the pdf viewer.
     * @asptype ThumbnailView
     * @blazorType ThumbnailView
     * @returns { ThumbnailView }
     */
    public get thumbnailView(): ThumbnailView {
        return this.thumbnailViewModule;
    }

    /**
     * Gets the annotation object of the pdf viewer.
     * @asptype Annotation
     * @blazorType Annotation
     * @returns { Annotation }
     */
    public get annotation(): Annotation {
        return this.annotationModule;
    }

    /**
     * Gets the TextSelection object of the pdf viewer.
     * @asptype TextSelection
     * @blazorType TextSelection
     * @returns { TextSelection }
     */
    public get textSelection(): TextSelection {
        return this.textSelectionModule;
    }

    /**
     * Triggers while loading document into PdfViewer.
     * @event
     * @blazorProperty 'DocumentLoaded'
     */
    @Event()
    public documentLoad: EmitType<LoadEventArgs>;

    /**
     * Triggers while close the document
     * @event
     * @blazorProperty 'DocumentUnloaded'
     */
    @Event()
    public documentUnload: EmitType<UnloadEventArgs>;

    /**
     * Triggers while loading document got failed in PdfViewer.
     * @event
     * @blazorProperty 'DocumentLoadFailed'
     */
    @Event()
    public documentLoadFailed: EmitType<LoadFailedEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     * @blazorProperty 'AjaxRequestFailed'
     */
    @Event()
    public ajaxRequestFailed: EmitType<AjaxRequestFailureEventArgs>;

    /**
     * Triggers when validation is failed.
     * @event
     * @blazorProperty 'validateFormFields'
     */
    @Event()
    public validateFormFields: EmitType<ValidateFormFieldsArgs>;

    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     * @event
     * @blazorProperty 'OnPageClick'
     */
    @Event()
    public pageClick: EmitType<PageClickEventArgs>;

    /**
     * Triggers when there is change in current page number.
     * @event
     * @blazorProperty 'PageChanged'
     */
    @Event()
    public pageChange: EmitType<PageChangeEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is clicked
     * @event
     * @blazorProperty 'OnHyperlinkClick'
     */
    @Event()
    public hyperlinkClick: EmitType<HyperlinkClickEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is hovered
     * @event
     * @blazorProperty 'OnHyperlinkMouseOver'
     */
    @Event()
    public hyperlinkMouseOver: EmitType<HyperlinkMouseOverArgs>;

    /**
     * Triggers when there is change in the magnification value.
     * @event
     * @blazorProperty 'ZoomChanged'
     */
    @Event()
    public zoomChange: EmitType<ZoomChangeEventArgs>;

    /**
     * Triggers when an annotation is added over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationAdded'
     */
    @Event()
    public annotationAdd: EmitType<AnnotationAddEventArgs>;

    /**
     * Triggers when an annotation is removed from the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationRemoved'
     */
    @Event()
    public annotationRemove: EmitType<AnnotationRemoveEventArgs>;

    /**
     * Triggers when the property of the annotation is changed in the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationPropertiesChanged'
     */
    @Event()
    public annotationPropertiesChange: EmitType<AnnotationPropertiesChangeEventArgs>;

    /**
     * Triggers when an annotation is resized over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationResized'
     */
    @Event()
    public annotationResize: EmitType<AnnotationResizeEventArgs>;

    /**
     * Triggers when signature is added  over the page of the PDF document.
     * @event
     */
    @Event()
    public addSignature: EmitType<AddSignatureEventArgs>;

    /**
     * Triggers when signature is removed over the page of the PDF document.
     * @event
     */
    @Event()
    public removeSignature: EmitType<RemoveSignatureEventArgs>;

    /**
     * Triggers when an signature is moved over the page of the PDF document.
     * @event
     */
    @Event()
    public moveSignature: EmitType<MoveSignatureEventArgs>;

    /**
     * Triggers when the property of the signature is changed in the page of the PDF document.
     * @event
     */
    @Event()
    public signaturePropertiesChange: EmitType<SignaturePropertiesChangeEventArgs>;

    /**
     * Triggers when signature is resized over the page of the PDF document.
     * @event
     */
    @Event()
    public resizeSignature: EmitType<ResizeSignatureEventArgs>;

    /**
     * Triggers when signature is selected over the page of the PDF document.
     * @event
     */
    @Event()
    public signatureSelect: EmitType<SignatureSelectEventArgs>;

    /**
     * Triggers when an annotation is selected over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationSelected'
     */
    @Event()
    public annotationSelect: EmitType<AnnotationSelectEventArgs>;

    /**
     * Triggers an event when the annotation is double click.
     * @event
     * @blazorProperty 'OnAnnotationDoubleClick'
     */
    @Event()
    public annotationDoubleClick: EmitType<AnnotationDoubleClickEventArgs>;

    /**
     * Triggers when an annotation is moved over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationMoved'
     */
    @Event()
    public annotationMove: EmitType<AnnotationMoveEventArgs>;

    /**
     * Triggers when mouse over the annotation object.
     * @event
     */
    @Event()
    public annotationMouseover: EmitType<AnnotationMouseoverEventArgs>;

    /**
     * Triggers when mouse over the annotation object.
     * @event
     */
    @Event()
    public annotationMouseLeave: EmitType<AnnotationMouseLeaveEventArgs>;

    /**
     * Triggers when mouse over the page.
     * @event
     */
    @Event()
    public pageMouseover: EmitType<PageMouseoverEventArgs>;

    /**
     * Triggers when an imported annotations started in the PDF document.
     * @event
     * @blazorProperty 'ImportStarted'
     */
    @Event()
    public importStart: EmitType<ImportStartEventArgs>;

    /**
     * Triggers when an exported annotations started in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportStarted'
     */
    @Event()
    public exportStart: EmitType<ExportStartEventArgs>;

    /**
     * Triggers when an imports annotations succeed in the PDF document.
     * @event
     * @blazorProperty 'ImportSucceed'
     */
    @Event()
    public importSuccess: EmitType<ImportSuccessEventArgs>;

    /**
     * Triggers when an export annotations succeed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportSucceed'
     */
    @Event()
    public exportSuccess: EmitType<ExportSuccessEventArgs>;

    /**
     * Triggers when an imports annotations failed in the PDF document.
     * @event
     * @blazorProperty 'ImportFailed'
     */
    @Event()
    public importFailed: EmitType<ImportFailureEventArgs>;

    /**
     * Triggers when an export annotations failed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportFailed'
     */
    @Event()
    public exportFailed: EmitType<ExportFailureEventArgs>;

    /**
     * Triggers when an text extraction is completed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExtractTextCompleted'
     */
    @Event()
    public extractTextCompleted: EmitType<ExtractTextCompletedEventArgs>;

    /**
     * Triggers an event when the thumbnail is clicked in the thumbnail panel of PDF Viewer.
     * @event
     * @blazorProperty 'OnThumbnailClick'
     */
    @Event()
    public thumbnailClick: EmitType<ThumbnailClickEventArgs>;

    /**
     * Triggers an event when the bookmark is clicked in the bookmark panel of PDF Viewer.
     * @event
     * @blazorProperty 'BookmarkClick'
     */
    @Event()
    public bookmarkClick: EmitType<BookmarkClickEventArgs>;

    /**
     * Triggers an event when the text selection is started.
     * @event
     * @blazorProperty 'OnTextSelectionStart'
     */
    @Event()
    public textSelectionStart: EmitType<TextSelectionStartEventArgs>;

    /**
     * Triggers an event when the text selection is finished.
     * @event
     * @blazorProperty 'OnTextSelectionEnd'
     */
    @Event()
    public textSelectionEnd: EmitType<TextSelectionEndEventArgs>;

    /**
     * Triggers an event when the download action is started.
     * @event
     * @blazorProperty 'DownloadStart'
     */
    @Event()
    public downloadStart: EmitType<DownloadStartEventArgs>;

    /**
     * Triggers an event when the download actions is finished.
     * @event
     * @blazorProperty 'DownloadEnd'
     */
    @Event()
    public downloadEnd: EmitType<DownloadEndEventArgs>;

    /**
     * Triggers an event when the print action is started.
     * @event
     * @blazorProperty 'PrintStart'
     */
    @Event()
    public printStart: EmitType<PrintStartEventArgs>;

    /**
     * Triggers an event when the print actions is finished.
     * @event
     * @blazorProperty 'PrintEnd'
     */
    @Event()
    public printEnd: EmitType<PrintEndEventArgs>;

    /**
     * Triggers an event when the text search is started.
     * @event
     * @blazorProperty 'OnTextSearchStart'
     */
    @Event()
    public textSearchStart: EmitType<TextSearchStartEventArgs>;

    /**
     * Triggers an event when the text search is completed.
     * @event
     * @blazorProperty 'OnTextSearchComplete'
     */
    @Event()
    public textSearchComplete: EmitType<TextSearchCompleteEventArgs>;

    /**
     * Triggers an event when the text search text is highlighted.
     * @event
     * @blazorProperty 'OnTextSearchHighlight'
     */
    @Event()
    public textSearchHighlight: EmitType<TextSearchHighlightEventArgs>;

    /**
     * Triggers before the data send in to the server.
     * @event
     * @deprecated
     */
    @Event()
    public ajaxRequestInitiate: EmitType<AjaxRequestInitiateEventArgs>;

    /**
     * PDF document annotation collection.
     * @private
     * @deprecated
     */
    @Collection<PdfAnnotationBaseModel>([], PdfAnnotationBase)
    public annotations: PdfAnnotationBaseModel[];

    /**
     * @private
     * @deprecated
     */
    public tool: string;

    /**
     * store the drawing objects.
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
    }

    protected render(): void {
        this.viewerBase.initializeComponent();
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
     * @returns void
     * @deprecated
     */
    // tslint:disable-next-line
    public setJsonData(jsonData: any): void {
        this.viewerBase.ajaxData = jsonData;
    }

    public onPropertyChanged(newProp: PdfViewerModel, oldProp: PdfViewerModel): void {
        let requireRefresh: boolean = false;
        if (this.isDestroyed) { return; }
        let properties: string[] = Object.keys(newProp);
        for (let prop of properties) {
            switch (prop) {
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
                    this.load(newProp.documentPath, null);
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
                    if (this.toolbar.annotationToolbarModule && this.toolbar.annotationToolbarModule.isToolbarHidden) {
                        this.toolbar.annotationToolbarModule.adjustViewer(false);
                    } else {
                        this.toolbar.annotationToolbarModule.adjustViewer(true);
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
                    this.renderCustomerStamp(this.customStampSettings.customStamps[0]);
                    break;
                case 'enableFormFields':
                    if (this.enableFormFields && this.formFieldsModule) {
                        for (let m: number = 0; m < this.pageCount; m++) {
                            this.formFieldsModule.renderFormFields(m);
                        }
                    } else {
                        this.formFieldsModule = new FormFields(this, this.viewerBase);
                        this.formFieldsModule.formFieldsReadOnly(this.enableFormFields);
                    }
                    break;
                case 'highlightSettings':
                case 'underlineSettings':
                case 'strikethroughSettings':
                    if (this.annotationModule && this.annotationModule.textMarkupAnnotationModule) {
                        this.annotationModule.textMarkupAnnotationModule.updateTextMarkupSettings(prop);
                    }
                    break;
            }
        }
    }

    // tslint:disable-next-line
    private renderCustomerStamp(customStamp: any) {
        this.annotation.stampAnnotationModule.isStampAddMode = true;
        this.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
        this.viewerBase.stampAdded = true;
        this.viewerBase.isAlreadyAdded = false;
        // tslint:disable-next-line:max-line-length
        this.annotation.stampAnnotationModule.createCustomStampAnnotation(customStamp.customStampImageSource, customStamp.customStampName);
    }

    public getPersistData(): string {
        return 'PdfViewer';
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
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
        if (this.enableToolbar || this.enableNavigationToolbar) {
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
        // tslint:disable-next-line:max-line-length
        'No matches': 'Viewer has finished searching the document. No more matches were found',
        'No Text Found': 'No Text Found',
        'Undo': 'Undo',
        'Redo': 'Redo',
        'Annotation': 'Add or Edit annotations',
        'Highlight': 'Highlight Text',
        'Underline': 'Underline Text',
        'Strikethrough': 'Strikethrough Text',
        'Delete': 'Delete annotation',
        'Opacity': 'Opacity',
        'Color edit': 'Change Color',
        'Opacity edit': 'Change Opacity',
        'Highlight context': 'Highlight',
        'Underline context': 'Underline',
        'Strikethrough context': 'Strike through',
        // tslint:disable-next-line:max-line-length
        'Server error': 'Web-service is not listening. PDF Viewer depends on web-service for all it\'s features. Please start the web service to continue.',
        // tslint:disable-next-line:max-line-length
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
        'Import Annotations': 'Import Annotations',
        'Export Annotations': 'Export Annotations',
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
        'Draw Signature': 'Draw Signature',
        'Draw Ink': 'Draw Ink',
        'Create': 'Create',
        'Font family': 'Font Family',
        'Font size': 'Font Size',
        'Free Text': 'Free Text',
        'Import Failed': 'Invalid JSON file type or file name; please select a valid JSON file',
        'File not found': 'Imported JSON file is not found in the desired location',
        'Export Failed': 'Export annotations action has failed; please ensure annotations are added properly'
    };

    /**
     * Loads the given PDF document in the PDF viewer control
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
        if (this.toolbarModule) {
            this.toolbarModule.resetToolbar();
        }
        this.viewerBase.initiatePageRender(document, password);
    }

    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    public download(): void {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    }

    /**
     * Saves the PDF document being loaded in the PDF Viewer control as blob.
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
     * @returns void
     */
    public updateViewerContainer(): void {
        this.viewerBase.updateViewerContainer();
    }

    /**
     * Perform undo action for the edited annotations
     * @returns void
     */
    public undo(): void {
        if (this.annotationModule) {
            this.annotationModule.undo();
        }
    }

    /**
     * Perform redo action for the edited annotations
     * @returns void
     */
    public redo(): void {
        if (this.annotationModule) {
            this.annotationModule.redo();
        }
    }

    /**
     * Unloads the PDF document being displayed in the PDF viewer.
     * @returns void
     */
    public unload(): void {
        this.viewerBase.clear(true);
        this.pageCount = 0;
        this.toolbarModule.resetToolbar();
        this.magnificationModule.zoomTo(100);
    }

    /**
     * Destroys all managed resources used by this object.
     */
    public destroy(): void {
        super.destroy();
        if (!isNullOrUndefined(this.element)) {
            this.element.classList.remove('e-pdfviewer');
            this.element.innerHTML = '';
        }
        this.viewerBase.destroy();
    }

    // tslint:disable-next-line
    /**
     * Perform imports annotations action in the PDF Viewer
     * @param  {any} importData - Specifies the data for annotation imports
     * @returns void
     */
    // tslint:disable-next-line
    public importAnnotations(importData: any): void {
        if (this.annotationModule) {
            this.viewerBase.importAnnotations(importData);
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     * @returns void
     */
    public exportAnnotations(): void {
        if (this.annotationModule) {
            this.viewerBase.exportAnnotations();
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     * @returns Promise<object>
     */
    public exportAnnotationsAsObject(): Promise<object> {
        if (this.annotationModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.exportAnnotationsAsObject().then((value: object) => {
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    // tslint:disable-next-line
    /**
     * Perform  action in the PDF Viewer
     * @returns void
     */
    // tslint:disable-next-line
    public importFormFields(formFields: any): void {
        if (this.formFieldsModule) {
            this.viewerBase.importFormFields(formFields);
        }
    }

    /**
     * Perform export action in the PDF Viewer
     * @returns void
     */
    public exportFormFields(path?: string): void {
        if (this.formFieldsModule) {
            this.viewerBase.exportFormFields(path);
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     * @returns Promise<object>
     */
    public exportFormFieldsAsObject(): Promise<object> {
        if (this.formFieldsModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.exportFormFieldsAsObject().then((value: object) => {
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    /**
     * To delete the annotation Collections in the PDF Document.
     * @returns void
     */
    public deleteAnnotations(): void {
        if (this.annotationModule) {
            this.viewerBase.deleteAnnotations();
        }
    }

    /**
     * To retrieve the form fields in the PDF Document.
     * @returns void
     */
    public retrieveFormFields(): FormFieldModel[] {
        return this.formFieldCollections;
    }

    /**
     * To update the form fields in the PDF Document.
     * @returns void
     */
    // tslint:disable-next-line
    public updateFormFields(formFields: any): void {
        this.formFieldsModule.updateFormFieldValues(formFields);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAjaxRequestInitiate(JsonData: any): void {
        let eventArgs: AjaxRequestInitiateEventArgs = { name: 'ajaxRequestInitiate', JsonData: JsonData };
        this.trigger('ajaxRequestInitiate', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireDocumentLoad(pageData: any): void {
        let eventArgs: LoadEventArgs = { name: 'documentLoad', documentName: this.fileName, pageData: pageData };
        this.trigger('documentLoad', eventArgs);
    }

    /**
     * @private
     */
    public fireDocumentUnload(fileName: string): void {
        let eventArgs: UnloadEventArgs = { name: 'documentUnload', documentName: fileName };
        this.trigger('documentUnload', eventArgs);
    }

    /**
     * @private
     */
    public fireDocumentLoadFailed(isPasswordRequired: boolean, password: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: LoadFailedEventArgs = { name: 'documentLoadFailed', documentName: this.fileName, isPasswordRequired: isPasswordRequired, password: password };
        this.trigger('documentLoadFailed', eventArgs);
    }

    /**
     * @private
     */
    public fireAjaxRequestFailed(errorStatusCode: number, errorMessage: string, action: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: AjaxRequestFailureEventArgs = { name: 'ajaxRequestFailed', documentName: this.fileName, errorStatusCode: errorStatusCode, errorMessage: errorMessage, action: action };
        this.trigger('ajaxRequestFailed', eventArgs);
    }

    /**
     * @private
     */
    public fireValidatedFailed(action: string): void {
        if (!isBlazor()) {
            // tslint:disable-next-line:max-line-length
            let eventArgs: ValidateFormFieldsArgs = { formField: this.viewerBase.createFormfieldsJsonData(), documentName: this.fileName, nonFillableFields: this.formFieldsModule.nonFillableFields };
            this.trigger('validateFormFields', eventArgs);
        }   else {
            // tslint:disable-next-line
            let eventArgs: any = {};
            eventArgs.documentName = this.fileName;
            eventArgs.formFields = this.formFieldCollections;
            eventArgs.nonFillableFields = this.formFieldsModule.nonFillableFields;
            this.trigger('validateFormFields', eventArgs);
        }
    }

    /**
     * @private
     */
    public firePageClick(x: number, y: number, pageNumber: number): void {
        let eventArgs: PageClickEventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    }

    /**
     * @private
     */
    public firePageChange(previousPageNumber: number): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: PageChangeEventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.currentPageNumber, previousPageNumber: previousPageNumber };
        this.trigger('pageChange', eventArgs);
    }

    /**
     * @private
     */
    public fireZoomChange(): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: ZoomChangeEventArgs = { name: 'zoomChange', zoomValue: this.magnificationModule.zoomFactor * 100, previousZoomValue: this.magnificationModule.previousZoomFactor * 100 };
        this.trigger('zoomChange', eventArgs);
    }

    /**
     * @private
     */
    public fireHyperlinkClick(hyperlink: string, hyperlinkElement: HTMLAnchorElement): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: HyperlinkClickEventArgs = { name: 'hyperlinkClick', hyperlink: hyperlink, hyperlinkElement: hyperlinkElement };
        this.trigger('hyperlinkClick', eventArgs);
    }

    /**
     * @private
     */
    public fireHyperlinkHover(hyperlinkElement: HTMLAnchorElement): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: HyperlinkMouseOverArgs = { name: 'hyperlinkMouseOver', hyperlinkElement: hyperlinkElement };
        this.trigger('hyperlinkMouseOver', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationAdd(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any): void {
        let eventArgs: AnnotationAddEventArgs = { name: 'annotationAdd', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
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
        this.viewerBase.isAnnotationSelect = false;
        this.trigger('annotationAdd', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: AnnotationRemoveEventArgs = { name: 'annotationRemove', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBounds: bounds };
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
     * @private
     */
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line
    public fireAnnotationPropertiesChange(pageNumber: number, index: string, type: AnnotationType, isColorChanged: boolean, isOpacityChanged: boolean, isTextChanged: boolean, isCommentsChanged: boolean, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: AnnotationPropertiesChangeEventArgs = { name: 'annotationPropertiesChange', pageIndex: pageNumber, annotationId: index, annotationType: type, isColorChanged: isColorChanged, isOpacityChanged: isOpacityChanged, isTextChanged: isTextChanged, isCommentsChanged: isCommentsChanged };
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
     * @private
     */
    // tslint:disable-next-line
    public fireSignatureAdd(pageNumber: number, index: string, type: AnnotationType, bounds: any, opacity: number, strokeColor: string, thickness: number): void {
        let eventArgs: AddSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds, opacity: opacity, strokeColor: strokeColor, thickness: thickness };
        this.trigger('addSignature', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireSignatureRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any): void {
        let eventArgs: RemoveSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds };
        this.trigger('removeSignature', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireSignatureMove(pageNumber: number, id: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, previousPosition: object, currentPosition: object): void {
        let eventArgs: MoveSignatureEventArgs = { pageIndex: pageNumber, id: id, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('moveSignature', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireSignaturePropertiesChange(pageNumber: number, index: string, type: AnnotationType, isStrokeColorChanged: boolean, isOpacityChanged: boolean, isThicknessChanged: boolean, oldProp: any, newProp: any): void {
        let eventArgs: SignaturePropertiesChangeEventArgs = { pageIndex: pageNumber, id: index, type: type, isStrokeColorChanged: isStrokeColorChanged, isOpacityChanged: isOpacityChanged, isThicknessChanged: isThicknessChanged, oldValue: oldProp, newValue: newProp };
        this.trigger('signaturePropertiesChange', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireSignatureResize(pageNumber: number, index: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, currentPosition: any, previousPosition: any): void {
        let eventArgs: ResizeSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, currentPosition: currentPosition, previousPosition: previousPosition };
        this.trigger('resizeSignature', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireSignatureSelect(id: string, pageNumber: number, signature: object) {
        let eventArgs: SignatureSelectEventArgs = { id: id, pageIndex: pageNumber, signature: signature };
        this.trigger('signatureSelect', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationSelect(id: string, pageNumber: number, annotation: any, annotationCollection?: any, multiPageCollection?: any, isSelected?: boolean, annotationAddMode?: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: AnnotationSelectEventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        if (annotationCollection) {
            // tslint:disable-next-line:max-line-length
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
                // tslint:disable-next-line
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
        }
        this.trigger('annotationSelect', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationDoubleClick(id: string, pageNumber: number, annotation: any): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: AnnotationDoubleClickEventArgs = { name: 'annotationDblClick', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationDoubleClick', eventArgs);
    }

    /**
     * @private
     */
    public fireTextSelectionStart(pageNumber: number): void {
        let eventArgs: TextSelectionStartEventArgs = { pageIndex: pageNumber };
        this.trigger('textSelectionStart', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireTextSelectionEnd(pageNumber: number, text: string, bound: any[]): void {
        let eventArgs: TextSelectionEndEventArgs = { pageIndex: pageNumber, textContent: text, textBounds: bound };
        this.trigger('textSelectionEnd', eventArgs);
    }

    /**
     * @private
     */
    public renderDrawing(canvas?: HTMLCanvasElement, index?: number): void {
        if (!index && this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        if (this.annotation) {
            this.annotation.renderAnnotations(index, null, null, null, canvas);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationResize(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any): void {
        let eventArgs: AnnotationResizeEventArgs = { name: 'annotationResize', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
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
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationMove(pageNumber: number, id: string, type: AnnotationType, annotationSettings: any, previousPosition: object, currentPosition: object): void {
        let eventArgs: AnnotationMoveEventArgs = { name: 'annotationMove', pageIndex: pageNumber, annotationId: id, annotationType: type, annotationSettings: annotationSettings, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('annotationMove', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationMouseover(id: string, pageNumber: number, annotationType: AnnotationType, bounds: any, annotation: any, currentPosition: any, mousePosition: any) {
        let eventArgs: AnnotationMouseoverEventArgs = { name: 'annotationMouseover', annotationId: id, pageIndex: pageNumber, annotationType: annotationType, annotationBounds: bounds, annotation: annotation, pageX: currentPosition.left, pageY: currentPosition.top, X: mousePosition.left, Y: mousePosition.top };
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
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationMouseLeave(pageNumber: number) {
        let eventArgs: AnnotationMouseLeaveEventArgs = { name: 'annotationMouseLeave', pageIndex: pageNumber };
        this.trigger('annotationMouseLeave', eventArgs);
    }
    /**
     * @private
     */
    public firePageMouseover(pageX: number, pageY: number): void {
        let eventArgs: PageMouseoverEventArgs = { pageX: pageX, pageY: pageY };
        this.trigger('pageMouseover', eventArgs);
    }
    /**
     * @private
     */
    public fireDownloadStart(fileName: string): void {
        let eventArgs: DownloadStartEventArgs = { fileName: fileName };
        this.trigger('downloadStart', eventArgs);
    }
    /**
     * @private
     */
    public fireDownloadEnd(fileName: string, downloadData: string): void {
        let eventArgs: DownloadEndEventArgs = { fileName: fileName, downloadDocument: downloadData };
        this.trigger('downloadEnd', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
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
     * @private
     */
    public firePrintEnd(fileName: string): void {
        let eventArgs: PrintEndEventArgs = { fileName: fileName };
        this.trigger('printEnd', eventArgs);
    }
    /**
     * @private
     */
    public fireThumbnailClick(pageNumber: number): void {
        let eventArgs: ThumbnailClickEventArgs = { name: 'thumbnailClick', pageNumber: pageNumber };
        this.trigger('thumbnailClick', eventArgs);
    }

    /**
     * 
     * @private
     */
    public fireBookmarkClick(pageNumber: number, position: number): void {
        let eventArgs: BookmarkClickEventArgs = { name: 'bookmarkClick', pageNumber: pageNumber , position: position};
        this.trigger('bookmarkClick', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireImportStart(importData: any): void {
        let eventArgs: ImportStartEventArgs = { name: 'importAnnotationsStart', importData: importData, formFieldData: null};
        this.trigger('importStart', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireExportStart(exportData: any): void {
        let eventArgs: ExportStartEventArgs = { name: 'exportAnnotationsStart', exportData: exportData, formFieldData: null};
        this.trigger('exportStart', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireImportSuccess(importData: any): void {
        let eventArgs: ImportSuccessEventArgs = { name: 'importAnnotationsSuccess', importData: importData, formFieldData: null };
        this.trigger('importSuccess', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireExportSuccess(exportData: any, fileName: string): void {
        let eventArgs: ExportSuccessEventArgs = { name: 'exportAnnotationsSuccess', exportData: exportData, fileName: fileName, formFieldData: null };
        this.trigger('exportSuccess', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireImportFailed(data: any, errorDetails: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: ImportFailureEventArgs = { name: 'importAnnotationsFailed', importData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('importFailed', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireExportFailed(data: any, errorDetails: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: ExportFailureEventArgs = { name: 'exportAnnotationsFailed', exportData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('exportFailed', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireFormImportStarted(data: any): void {
        let eventArgs: ImportStartEventArgs = { name: 'importFormFieldsStart', importData: null, formFieldData: data };
        this.trigger('importStart', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireFormExportStarted(data: any): void {
        let eventArgs: ExportStartEventArgs = { name: 'exportFormFieldsStart', exportData: null, formFieldData: data };
        this.trigger('exportStart', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireFormImportSuccess(data: any): void {
        let eventArgs: ImportSuccessEventArgs = { name: 'importFormFieldsSuccess', importData: null, formFieldData: data };
        this.trigger('importSuccess', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireFormExportSuccess(data: any, fileName: string): void {
        let eventArgs: ExportSuccessEventArgs = { name: 'exportFormFieldsSuccess', exportData: null, fileName: fileName, formFieldData: data };
        this.trigger('exportSuccess', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireFormImportFailed(data: any, errorDetails: string): void {
        //tslint:disable-next-line:max-line-length
        let eventArgs: ImportFailureEventArgs = {name: 'importFormFieldsfailed', importData: null, errorDetails: errorDetails, formFieldData: data };
        this.trigger('importFailed', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireFormExportFailed(data: any, errorDetails: string) : void {
        //tslint:disable-next-line:max-line-length
        let eventArgs: ExportFailureEventArgs = { name: 'exportFormFieldsFailed', exportData: null, errorDetails: errorDetails, formFieldData: data };
        this.trigger('exportFailed', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireTextExtractionCompleted(documentCollection: DocumentTextCollectionSettingsModel[][]): void {
        let eventArgs: ExtractTextCompletedEventArgs = { documentTextCollection: documentCollection };
        this.trigger('extractTextCompleted', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireTextSearchStart(searchText: string, isMatchcase: boolean): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: TextSearchStartEventArgs = { name: 'textSearchStart', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchStart', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireTextSearchComplete(searchText: string, isMatchcase: boolean): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: TextSearchCompleteEventArgs = { name: 'textSearchComplete', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchComplete', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public fireTextSearchHighlight(searchText: string, isMatchcase: boolean, bounds: RectangleBoundsModel, pageNumber: number): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: TextSearchHighlightEventArgs = { name: 'textSearchHighlight', searchText: searchText, matchCase: isMatchcase, bounds: bounds, pageNumber: pageNumber };
        this.trigger('textSearchHighlight', eventArgs);
    }
    /**
     * @private
     */
    public renderAdornerLayer(bounds: ClientRect, commonStyle: string, cavas: HTMLElement, index: number): void {
        renderAdornerLayer(bounds, commonStyle, cavas, index, this);
    }
    /**
     * @private
     */
    public renderSelector(index: number, currentSelector?: AnnotationSelectorSettingsModel): void {
        this.drawing.renderSelector(index, currentSelector);
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public select(objArray: string[], currentSelector?: AnnotationSelectorSettingsModel, multipleSelection?: boolean, preventUpdate?: boolean): void {
        let annotationSelect: number = this.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        if (annotationSelect) {
            this.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(annotationSelect, true);
        }
        if (!multipleSelection) {
            if (this.viewerBase.activeElements && this.viewerBase.activeElements.activePageID >= 0) {
                this.clearSelection(this.viewerBase.activeElements.activePageID);
            }
        }
        this.drawing.select(objArray, currentSelector, multipleSelection, preventUpdate);
    }
    /**
     * @private
     */
    public getPageTable(pageId: number): ZOrderPageTable {
        return this.drawing.getPageTable(pageId);
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public dragSelectedObjects(diffX: number, diffY: number, pageIndex: number, currentSelector?: AnnotationSelectorSettingsModel, helper?: PdfAnnotationBaseModel): boolean {
        return this.drawing.dragSelectedObjects(diffX, diffY, pageIndex, currentSelector, helper);
    }
    /**
     * @private
     */
    public scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean {
        return this.drawing.scaleSelectedItems(sx, sy, pivot);
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string, currentSelector?: AnnotationSelectorSettingsModel): boolean {
        return this.drawing.dragConnectorEnds(endPoint, obj, point, segment, target, null, currentSelector);
    }
    /**
     * @private
     */
    public clearSelection(pageId: number): void {
        let selectormodel: SelectorModel = this.selectedItems;
        if (selectormodel.annotations.length > 0) {
            selectormodel.offsetX = 0;
            selectormodel.offsetY = 0;
            selectormodel.width = 0;
            selectormodel.height = 0;
            selectormodel.rotateAngle = 0;
            selectormodel.annotations = [];
            selectormodel.wrapper = null;
        }
        this.drawing.clearSelectorLayer(pageId);
        this.viewerBase.isAnnotationSelect = false;
    }
    /**
     * @private
     */
    public add(obj: PdfAnnotationBase): PdfAnnotationBaseModel {
        return this.drawing.add(obj);
    }
    /**
     * @private
     */
    public remove(obj: PdfAnnotationBaseModel): void {
        return this.drawing.remove(obj);
    }
    /**
     * @private
     */
    public copy(): Object {
        this.annotation.isShapeCopied = true;
        return this.drawing.copy();
    }
    /**
     * @private
     */
    public rotate(angle: number, currentSelector?: AnnotationSelectorSettingsModel): boolean {
        return this.drawing.rotate(this.selectedItems, angle, null, currentSelector);
    }
    /**
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
                let notFound: boolean = true;
                for (let i: number = 0; i < this.zIndexTable.length; i++) {
                    let objects: (PdfAnnotationBaseModel)[] = this.zIndexTable[i].objects;
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
        this.annotation.isShapeCopied = true;
        return this.drawing.cut(index || 0);
    }
    /**
     * @private
     */
    public nodePropertyChange(
        actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel): void {
        this.drawing.nodePropertyChange(actualObject, node);
    }
    /**
     * @private
     */
    public checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect, isStamp?: boolean): boolean {
        return this.drawing.checkBoundaryConstraints(tx, ty, pageIndex, nodeBounds, isStamp);
    }

}