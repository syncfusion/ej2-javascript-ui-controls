import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex } from '@syncfusion/ej2-base';
import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType } from '@syncfusion/ej2-base';
// tslint:disable-next-line:max-line-length
import { PdfViewerModel, HighlightSettingsModel, UnderlineSettingsModel, StrikethroughSettingsModel, LineSettingsModel, ArrowSettingsModel, RectangleSettingsModel, CircleSettingsModel, PolygonSettingsModel, StampSettingsModel, StickyNotesSettingsModel, CustomStampSettingsModel, VolumeSettingsModel, RadiusSettingsModel, AreaSettingsModel, PerimeterSettingsModel, DistanceSettingsModel, MeasurementSettingsModel, FreeTextSettingsModel } from './pdfviewer-model';
import { ToolbarSettingsModel, AnnotationToolbarSettingsModel, ShapeLabelSettingsModel } from './pdfviewer-model';
import { ServerActionSettingsModel, AjaxRequestSettingsModel, CustomStampItemModel } from './pdfviewer-model';
import { PdfViewerBase } from './index';
import { Navigation } from './index';
import { Magnification } from './index';
import { Toolbar } from './index';
import { ToolbarItem } from './index';
// tslint:disable-next-line:max-line-length
import { LinkTarget, InteractionMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction, FontStyle, TextAlignment } from './base/types';
import { Annotation } from './index';
import { LinkAnnotation } from './index';
import { ThumbnailView } from './index';
import { BookmarkView } from './index';
import { TextSelection } from './index';
import { TextSearch } from './index';
import { FormFields } from './index';
import { Print, CalibrationUnit } from './index';
// tslint:disable-next-line:max-line-length
import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs } from './index';
import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs } from './index';
import { PdfAnnotationBase, ZOrderPageTable } from '../diagram/pdf-annotation';
import { PdfAnnotationBaseModel } from '../diagram/pdf-annotation-model';
import { Drawing, ClipBoardObject } from '../diagram/drawing';
import { Selector } from '../diagram/selector';
import { SelectorModel } from '../diagram/selector-model';
import { PointModel, IElement, Rect } from '@syncfusion/ej2-drawings';
import { renderAdornerLayer } from '../diagram/dom-util';
import { ThumbnailClickEventArgs } from './index';

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

export class CustomStampItem extends ChildProperty<CustomStampItem> {
    /**
     * specifies the stamp Name of the PdfViewer.
     */
    @Property('')
    public customStampName: string;

    /**
     * specifies the stamp ImageSource of the PdfViewer.
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
     * specifies the subject of the annotation.
     */
    @Property('strikethrough')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;
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
     * specifies the subject of the annotation.
     */
    @Property('underline')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;
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
     * specifies the subject of the annotation.
     */
    @Property('highlight')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;
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
     * specifies the subject of the annotation.
     */
    @Property('Line')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

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
     * specifies the subject of the annotation.
     */
    @Property('Arrow')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

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
     * specifies the subject of the annotation.
     */
    @Property('Rectangle')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;
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
     * specifies the subject of the annotation.
     */
    @Property('Circle')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;
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
     * specifies the subject of the annotation.
     */
    @Property('Polygon')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;
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
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

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
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

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
    public isAddToSubMenu: boolean;
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
     * specifies the subject of the annotation.
     */
    @Property('Distance calculation')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

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
     * specifies the subject of the annotation.
     */
    @Property('Perimeter calculation')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

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
     * specifies the subject of the annotation.
     */
    @Property('Area calculation')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;
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
     * specifies the subject of the annotation.
     */
    @Property('Radius calculation')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;
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
     * specifies the subject of the annotation.
     */
    @Property('Volume calculation')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;
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
     * specifies the subject of the annotation.
     */
    @Property('Sticky Note')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

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
     * specifies the subject of the annotation.
     */
    @Property('Text Box')
    public subject: string;

    /**
     * specifies the modified date of the annotation.
     */
    @Property('')
    public modifiedDate: string;

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
     * Returns the page count of the document loaded in the PdfViewer control.
     * @asptype int
     * @blazorType int
     */
    public get pageCount(): number {
        return this.viewerBase.pageCount;
    }

    /**
     * Checks whether the PDF document is edited.
     * @asptype bool
     * @blazorType bool
     */
    public get isDocumentEdited(): boolean {
        return this.viewerBase.isDocumentEdited;
    }

    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     * @asptype int
     * @blazorType int
     */
    public get currentPageNumber(): number {
        return this.viewerBase.currentPageNumber;
    }

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
     * Gets or sets the document name loaded in the PdfViewer control.
     */
    public fileName: string = null;

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
     * Enable or disables the Navigation toolbar of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableNavigationToolbar: boolean;

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
     * Enable or disables the Navigation module of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableNavigation: boolean;

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
     * @default false
     */
    @Property(false)
    public enableAnnotationToolbar: boolean;

    /**
     * Sets the interaction mode of the PdfViewer
     * @default TextSelection
     */
    @Property('TextSelection')
    public interactionMode: InteractionMode;

    /**
     * Defines the settings of the PdfViewer toolbar.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ showTooltip: true, toolbarItems: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentTool', 'AnnotationEditTool', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'] })
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Defines the ajax Request settings of the PdfViewer.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ ajaxHeaders: [] })
    public ajaxRequestSettings: AjaxRequestSettingsModel;

    /**
     * Defines the stamp items of the PdfViewer.
     */
    // tslint:disable-next-line:max-line-length

    @Property({ customStampName: '', customStampImageSource: '' })
    public customStampItems: CustomStampItemModel[];

    /**
     * Defines the settings of the PdfViewer annotation toolbar.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ showTooltip: true, annotationToolbarItem: ['HighlightTool', 'UnderlineTool', 'StrikethroughTool', 'ColorEditTool', 'OpacityEditTool', 'AnnotationDeleteTool', 'StampAnnotationTool', 'ShapeTool', 'CalibrateTool', 'StrokeColorEditTool', 'ThicknessEditTool', 'FreeTextAnnotationTool', 'FontFamilyAnnotationTool', 'FontSizeAnnotationTool', 'FontStylesAnnotationTool', 'FontAlignAnnotationTool', 'FontColorAnnotationTool'] })
    public annotationToolbarSettings: AnnotationToolbarSettingsModel;

    /**
     * Defines the settings of the PdfViewer service.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages', print: 'PrintImages', renderComments: 'RenderAnnotationComments', importAnnotations: 'ImportAnnotations', exportAnnotations: 'ExportAnnotations', importFormFields: 'ImportFormFields', exportFormFields: 'ExportFormFields' })
    public serverActionSettings: ServerActionSettingsModel;

    /**
     * Defines the settings of highlight annotation.
     */
    @Property({ opacity: 1, color: '#FFDF56', author: 'Guest', subject: 'Highlight', modifiedDate: '' })
    public highlightSettings: HighlightSettingsModel;

    /**
     * Defines the settings of strikethrough annotation.
     */
    @Property({ opacity: 1, color: '#ff0000', author: 'Guest', subject: 'Strikethrough', modifiedDate: '' })
    public strikethroughSettings: StrikethroughSettingsModel;

    /**
     * Defines the settings of underline annotation.
     */
    @Property({ opacity: 1, color: '#00ff00', author: 'Guest', subject: 'Underline', modifiedDate: '' })
    public underlineSettings: UnderlineSettingsModel;

    /**
     * Defines the settings of line annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Line', modifiedDate: '', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'None', lineHeadEndStyle: 'None' })
    public lineSettings: LineSettingsModel;

    /**
     * Defines the settings of arrow annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Arrow', modifiedDate: '', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed' })
    public arrowSettings: ArrowSettingsModel;

    /**
     * Defines the settings of rectangle annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Rectangle', modifiedDate: '', thickness: 1 })
    public rectangleSettings: RectangleSettingsModel;

    /**
     * Defines the settings of shape label.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ff0000', fontColor: '#000', fontSize: 16, labelHeight: 24.6, labelMaxWidth: 151 })
    public shapeLabelSettings: ShapeLabelSettingsModel;

    /**
     * Defines the settings of circle annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Circle', modifiedDate: '', thickness: 1 })
    public circleSettings: CircleSettingsModel;

    /**
     * Defines the settings of polygon annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Polygon', modifiedDate: '', thickness: 1 })
    public polygonSettings: PolygonSettingsModel;

    /**
     * Defines the settings of stamp annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, author: 'Guest', modifiedDate: '' })
    public stampSettings: StampSettingsModel;

    /**
     * Defines the settings of customStamp annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, author: 'Guest', modifiedDate: '', width: 0, height: 0, left: 0, top: 0 })
    public customStampSettings: CustomStampSettingsModel;

    /**
     * Defines the settings of distance annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Distance calculation', modifiedDate: '', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed' })
    public distanceSettings: DistanceSettingsModel;

    /**
     * Defines the settings of perimeter annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Perimeter calculation', modifiedDate: '', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Open', lineHeadEndStyle: 'Open' })
    public perimeterSettings: PerimeterSettingsModel;

    /**
     * Defines the settings of area annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Area calculation', modifiedDate: '', thickness: 1 })
    public areaSettings: AreaSettingsModel;

    /**
     * Defines the settings of radius annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Radius calculation', modifiedDate: '', thickness: 1 })
    public radiusSettings: RadiusSettingsModel;

    /**
     * Defines the settings of volume annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', subject: 'Volume calculation', modifiedDate: '', thickness: 1 })
    public volumeSettings: VolumeSettingsModel;

    /**
     * Defines the settings of stickyNotes annotation.
     */
    @Property({ author: 'Guest', subject: 'Sticky Note', modifiedDate: '', opacity: 1 })
    public stickyNotesSettings: StickyNotesSettingsModel;
    /**
     * Defines the settings of free text annotation.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ffffff00', author: 'Guest', subject: 'Text Box', modifiedDate: '', borderWidth: 1, width: 151, fontSize: 16, height: 24.6, fontColor: '#000', fontFamily: 'Helvetica', defaultText: 'Type Here', textAlignment: 'Left', fontStyle: FontStyle.None })
    public freeTextSettings: FreeTextSettingsModel;

    /**
     * Defines the settings of measurement annotation.
     */
    @Property({ conversionUnit: 'in', displayUnit: 'in', scaleRatio: 1, depth: 96 })
    public measurementSettings: MeasurementSettingsModel;

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
     * Triggers when an annotation is selected over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationSelected'
     */
    @Event()
    public annotationSelect: EmitType<AnnotationSelectEventArgs>;

    /**
     * Triggers an event when the thumbnail is clicked in the thumbnail panel of PDF Viewer.
     * @event
     * @blazorProperty 'OnThumbnailClick'
     */
    @Event()
    public thumbnailClick: EmitType<ThumbnailClickEventArgs>;

    /**
     * @private
     */
    /**
     * Triggers when the property of the annotation is changed in the page of the PDF document.
     * @event
     * @private
     */
    @Collection<PdfAnnotationBaseModel>([], PdfAnnotationBase)
    public annotations: PdfAnnotationBaseModel[];

    /**
     * @private
     */
    /**
     * tool denots the current tool
     * @event
     * @private
     */
    @Property('')
    public tool: string;
    /**
     * @private
     */
    /**
     * the objects for drawing tool
     * @event
     * @private
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
                    if (this.toolbar.annotationToolbarModule.isToolbarHidden) {
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
                case 'customStampItems':
                    this.annotation.stampAnnotationModule.isStampAddMode = true;
                    this.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                    this.viewerBase.stampAdded = true;
                    this.viewerBase.isAlreadyAdded = false;
                    // tslint:disable-next-line:max-line-length
                    this.annotation.stampAnnotationModule.createCustomStampAnnotation(this.customStampItems[0].customStampImageSource);
                    break;
            }
        }
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
        'Create': 'Create',
        'Font family': 'Font Family',
        'Font size': 'Font Size',
        'Free Text': 'Free Text'
    };

    /**
     * Loads the given PDF document in the PDF viewer control
     * @param  {string} document - Specifies the document name for load
     * @param  {string} password - Specifies the Given document password
     * @returns void
     */
    public load(document: string, password: string): void {
        if (this.viewerBase.pageCount !== 0) {
            this.viewerBase.clear(true);
        } else {
            this.viewerBase.clear(false);
        }
        this.viewerBase.pageCount = 0;
        this.viewerBase.currentPageNumber = 0;
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
        this.viewerBase.pageCount = 0;
        this.toolbarModule.resetToolbar();
        this.magnificationModule.zoomTo(100);
    }

    /**
     * Destroys all managed resources used by this object.
     */
    public destroy(): void {
        super.destroy();
        if (this.toolbarModule) {
            this.toolbarModule.destroy();
        }
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
    public exportFormFields(): void {
        if (this.formFieldsModule) {
            this.viewerBase.exportFormFields();
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
     * @private
     */
    public fireDocumentLoad(): void {
        let eventArgs: LoadEventArgs = { name: 'documentLoad', documentName: this.fileName };
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
    public firePageClick(x: number, y: number, pageNumber: number): void {
        let eventArgs: PageClickEventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    }

    /**
     * @private
     */
    public firePageChange(previousPageNumber: number): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: PageChangeEventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.viewerBase.currentPageNumber, previousPageNumber: previousPageNumber };
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
    public fireAnnotationAdd(pageNumber: number, index: number, type: AnnotationType, bounds: any, settings: any): void {
        let eventArgs: AnnotationAddEventArgs = { name: 'annotationAdd', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        this.trigger('annotationAdd', eventArgs);
    }

    /**
     * @private
     */
    public fireAnnotationRemove(pageNumber: number, index: number, type: AnnotationType): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: AnnotationRemoveEventArgs = { name: 'annotationRemove', pageIndex: pageNumber, annotationId: index, annotationType: type };
        this.trigger('annotationRemove', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public fireAnnotationPropertiesChange(pageNumber: number, index: number, type: AnnotationType, isColorChanged: boolean, isOpacityChanged: boolean, isTextChanged: boolean, isCommentsChanged: boolean): void {
        let eventArgs: AnnotationPropertiesChangeEventArgs = { name: 'annotationPropertiesChange', pageIndex: pageNumber, annotationId: index, annotationType: type, isColorChanged: isColorChanged, isOpacityChanged: isOpacityChanged, isTextChanged: isTextChanged, isCommentsChanged: isCommentsChanged };
        this.trigger('annotationPropertiesChange', eventArgs);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public fireAnnotationSelect(id: string, pageNumber: number, annotation: any): void {
        let eventArgs: AnnotationSelectEventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationSelect', eventArgs);
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
    public fireAnnotationResize(pageNumber: number, index: number, type: AnnotationType, bounds: any, settings: any): void {
        let eventArgs: AnnotationResizeEventArgs = { name: 'annotationResize', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        this.trigger('annotationResize', eventArgs);
    }
    /**
     * @private
     */
    public fireThumbnailClick(pageNumber: number): void {
        let eventArgs: ThumbnailClickEventArgs = { name: 'thumbnailClick', pageNumber: pageNumber };
        this.trigger('thumbnailClick', eventArgs);
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
    public renderSelector(index: number): void {
        this.drawing.renderSelector(index);
    }
    /**
     * @private
     */
    public select(objArray: string[], multipleSelection?: boolean, preventUpdate?: boolean): void {
        let annotationSelect: number = this.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        if (annotationSelect) {
            this.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(annotationSelect, true);
        }
        this.drawing.select(objArray, multipleSelection, preventUpdate);
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
    public dragSelectedObjects(diffX: number, diffY: number, pageIndex: number, helper: PdfAnnotationBaseModel): boolean {
        return this.drawing.dragSelectedObjects(diffX, diffY, pageIndex, helper);
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
    public dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string): boolean {
        return this.drawing.dragConnectorEnds(endPoint, obj, point, segment, target);
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
    public rotate(angle: number): boolean {
        return this.drawing.rotate(this.selectedItems, angle);
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
                this.annotations = [];
                this.selectedItems.annotations = [];
                this.zIndexTable = [];
                this.renderDrawing();

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