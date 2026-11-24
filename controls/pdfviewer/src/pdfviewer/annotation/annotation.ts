import { FreeTextSettings, HighlightSettings, LineSettings, StickyNotesSettings, StrikethroughSettings, UnderlineSettings, SquigglySettings, RectangleSettings, CircleSettings, ArrowSettings, PerimeterSettings, DistanceSettings, AreaSettings, RadiusSettings, VolumeSettings, PolygonSettings, InkAnnotationSettings, StampSettings, CustomStampSettings, HandWrittenSignatureSettings, RedactionSettings, CommentFilterSettings, WebLinkSettings, DocumentLinkSettings, CloudSettings, CalloutSettings } from './../pdfviewer';
import {
    PdfViewer, PdfViewerBase, AnnotationType, ITextMarkupAnnotation, TextMarkupAnnotation, ShapeAnnotation,
    StampAnnotation, StickyNotesAnnotation, IPopupAnnotation, ICommentsCollection, MeasureAnnotation, InkAnnotation,
    AllowedInteraction, DynamicStampItem, SignStampItem, StandardBusinessStampItem, IReviewCollection,
    AnnotationRenderer, RectBounds, PdfLinkAnnotation, AnnotBounds,
    AnnotationsType
} from '../index';
import { createElement, Browser, isNullOrUndefined, isBlazor, SanitizeHtmlHelper, initializeTelemetryFeature } from '@syncfusion/ej2-base';
import { NumericTextBox, Slider, ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DecoratorShapes, PointModel, processPathData, Size, splitArrayCollection } from '../ej2-drawings/index';
import { isLineShapes, cloneObject } from '../drawing/drawing-util';
import { PdfAnnotationBaseModel, PdfBoundsModel, PdfFontModel, PdfFormFieldBaseModel } from '../drawing/pdf-annotation-model';
import { NodeDrawingTool, LineTool, MoveTool, ResizeTool, ConnectTool, PolygonDrawingTool } from '../drawing/tools';
import { updateDistanceLabel, updateRadiusLabel, updatePerimeterLabel, updateCalibrateLabel } from '../drawing/connector-util';
import { AnnotationCollectionType, AnnotationPropertiesChangeEventArgs, IRectBounds, IRectangleBounds, ISize, BorderStyle } from '../base';
import { AnnotationDataFormat, EditAction } from '../base/types';
import { TaskPriorityLevel } from '../base/pdfviewer-utlis';
import { FreeTextAnnotation } from './free-text-annotation';
import { InputElement } from './input-element';
import { InPlaceEditor } from '@syncfusion/ej2-inplace-editor';
import { ShapeLabelSettingsModel, AnnotationSelectorSettingsModel, FormFieldModel, AnnotationSettingsModel, RedactionSettingsModel } from '../pdfviewer-model';
import { IElement, IFormFieldSessionData } from '../form-designer';
import { PdfAnnotationBase, SelectorModel, PdfAnnotationType } from '../drawing';
import { renderAdornerLayer } from '../drawing/dom-util';
import { Redaction } from './redaction-annotation';
import { RedactionOverlayText } from './redaction-overlay-text';
import { buildFilterPredicates, isFilterEmpty } from './comment-filter-predicates';
import { getArialFontData } from '../pdf-base/fontData';
import { DataFormat, PdfDocument, PdfFreeTextAnnotation, PdfInkAnnotation, PdfPage, PdfRubberStampAnnotation, PdfTextMarkupAnnotation } from '@syncfusion/ej2-pdf';
import { AnnotationStatus } from '../base/pdfviewer-utlis';
/**
 * @hidden
 */
export interface IActionElements {
    pageIndex: number
    index: number
    annotation: any;
    action: string
    undoElement: any;
    redoElement: any;
    duplicate?: any;
    modifiedProperty: string
}

/**
 * @hidden
 */
export interface IPoint {
    x: number
    y: number
}

/**
 * @hidden
 */
export interface IAppearanceCacheEntry {
    hasAP: boolean;
    isTemplateAppearance: boolean;
    appearanceSource: 'isolated-render' | 'none';
    appearanceImage?: HTMLImageElement | ImageBitmap;
    imageWidth?: number;
    imageHeight?: number;
    bounds?: { x: number; y: number; width: number; height: number };
    subtype?: string;
    annotIndex?: number;
    pageIndex?: number;
    annotName?: string;
}

/**
 * Interface for a class Point
 *
 *  @hidden
 */
export interface IAnnotationPoint {
    /**
     * Sets the x-coordinate of a position
     *
     * @default 0
     */
    x: number;

    /**
     * Sets the y-coordinate of a position
     *
     * @default 0
     */
    y: number;

    /**
     * Sets the x-coordinate of a position
     *
     * @default 0
     */
    width: number;

    /**
     * Sets the y-coordinate of a position
     *
     * @default 0
     */
    height: number;

}

/**
 * @hidden
 */
export interface IPageAnnotations {
    pageIndex: number
    annotations: any[];
}

/**
 * @hidden
 */

export interface IAnnotation {
    shapeAnnotationType: string
    annotationIndex?: number
    author?: string
    modifiedDate?: string
    subject: string
    note?: string
    opacity?: number
    strokeColor?: string
    fillColor?: string
    comments?: ICommentsCollection[]
    review?: IReviewCollection
    annotName: string
    annotationSelectorSettings?: AnnotationSelectorSettingsModel
    annotationSettings?: any
    isCommentLock?: boolean
    status?: AnnotationStatus
    originalName?: string
    hasPdfAppearance?: boolean
    templateAppearanceImage?: HTMLImageElement
    templateAppearanceId?: string
    isAppearanceStale?: boolean
}

/**
 * The `Annotation` module is used to handle annotation actions of PDF viewer.
 */
export class Annotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public arialFontData: string = '';
    /**
     * @private
     */
    public redactionAnnotationModule: Redaction;
    /**
     * @private
     */
    public redactionOverlayTextModule: RedactionOverlayText;
    /**
     * @private
     */
    public textMarkupAnnotationModule: TextMarkupAnnotation;
    /**
     * @private
     */
    public shapeAnnotationModule: ShapeAnnotation;
    /**
     * @private
     */
    public PdfLinkAnnotationModule: PdfLinkAnnotation;
    /**
     * @private
     */
    public measureAnnotationModule: MeasureAnnotation;
    /**
     * @private
     */
    public stampAnnotationModule: StampAnnotation;
    /**
     * @private
     */
    public freeTextAnnotationModule: FreeTextAnnotation;
    /**
     * @private
     */
    public inputElementModule: InputElement;
    /**
     * @private
     */
    public inkAnnotationModule: InkAnnotation;
    /**
     * @private
     */
    public isUndoActionImageLoad: boolean = false;
    /**
     * @private
     */
    public stickyNotesAnnotationModule: StickyNotesAnnotation;
    /**
     * @private
     * Runtime cache for isolated PDFium appearance images. Keyed by stable id
     * (`annotName` when present, otherwise `pageIndex:annotIndex`). Not exported.
     */
    public appearanceCache: { [key: string]: IAppearanceCacheEntry } = {};
    /**
     * Names of imported annotations that must render with the default geometry.
     *
     * @private
     */
    public importedNoAppearance: { [key: string]: boolean } = {};
    /**
     * Prevents an imported annotation from picking its cached PDF appearance image again.
     *
     * @private
     * @param {string} annotName - annotation name.
     * @returns {void}
     */
    public skipAppearanceForImport(annotName: string): void {
        if (annotName && this.pdfViewerBase.isImportAction) {
            this.importedNoAppearance[`${annotName}`] = true;
            delete this.appearanceCache[`${annotName}`];
        }
    }

    private popupNote: HTMLElement;
    private popupNoteAuthor: HTMLElement;
    private popupNoteContent: HTMLElement;
    private popupElement: HTMLElement;
    private authorPopupElement: HTMLElement;
    private noteContentElement: HTMLElement;
    private modifiedDateElement: HTMLElement;
    private opacityIndicator: HTMLElement;
    private startArrowDropDown: DropDownButton;
    private endArrowDropDown: DropDownButton;
    private lineStyleDropDown: DropDownButton;
    private thicknessBox: NumericTextBox;
    private leaderLengthBox: NumericTextBox;
    private fillColorPicker: ColorPicker;
    private strokeColorPicker: ColorPicker;
    private fillDropDown: DropDownButton;
    private strokeDropDown: DropDownButton;
    private opacitySlider: Slider;
    private propertiesDialog: Dialog;
    private currentAnnotPageNumber: number;
    private clientX: number;
    private clientY: number;
    private isPopupMenuMoved: boolean;
    private boundsChanged: boolean = false;
    private selectedLineStyle: string;
    private selectedLineDashArray: string;
    /**
     * @private
     * Stores the current comment filter settings
     */
    private currentFilterState: CommentFilterSettings | null = null;
    /**
     * @private
     * Stores annotation names that were added while filter was active.
     * These annotations bypass filtering to ensure they are always visible.
     */
    private newlyAddedAnnotations: Set<string> = new Set();
    /**
     * @private
     * Stores annotation IDs that are currently hidden due to applied filters.
     * This collection is updated whenever filters are applied or cleared.
     * Contains annotationId values from annotations that do not satisfy the active filter conditions.
     */
    private hiddenAnnotationIds: Set<string> = new Set();
    /**
     * @private
     */
    public isUndoRedoAction: boolean = false;
    /**
     * The undo/redo snapshot of the annotation currently being restored. It carries the
     * `isAppearanceStale` value from before the edit so that undo can bring the cached
     * appearance image back and redo can take it away again.
     *
     * @private
     */
    public currentUndoElement: any;
    /**
     * The action currently being undone or redone. It tells a move apart from a
     * resize, because both are restored through the 'bounds' property but only a
     * resize invalidates the cached PDF appearance image.
     *
     * @private
     */
    public currentAppearanceAction: string;
    /**
     * The redo snapshot of the annotation currently being restored.
     *
     * @private
     */
    public currentRedoElement: any;
    /**
     * @private
     */
    public isApplyingRemoteUpdate: boolean = false;
    /**
     * @private
     */
    public isFreeTextFontsizeChanged: boolean = false;

    /**
     * @private
     */
    public isAddedFromUI: boolean = false;
    /**
     * @private
     */
    public isUndoAction: boolean = false;
    /**
     * @private
     */
    public isSkipLastAction: boolean = false;
    private annotationSelected: boolean = true;
    private isAnnotDeletionApiCall: boolean = false;
    private removedDocumentAnnotationCollection: any = [];
    /**
     * @private
     * It is used to store the non render page selected annotation.
     */
    private nonRenderSelectedAnnotation: any = null;
    /**
     * @private
     */
    public isShapeCopied: boolean = false;
    /**
     * @private
     */
    public actionCollection: IActionElements[] = [];
    /**
     * @private
     */
    public redoCollection: IActionElements[] = [];
    /**
     * @private
     */
    public isPopupNoteVisible: boolean = false;
    /**
     * @private
     */
    public undoCommentsElement: IPopupAnnotation[] = [];
    /**
     * @private
     */
    public redoCommentsElement: IPopupAnnotation[] = [];
    /**
     * @private
     */
    public selectAnnotationId: string = null;
    /**
     * @private
     */
    public isAnnotationSelected: boolean = false;
    /**
     * @private
     */
    public annotationPageIndex: number = null;
    private previousIndex: number = null;
    /**
     * @private
     */
    public annotationType: string = null;
    private overlappedAnnotations: any = [];
    /**
     * @private
     */
    public overlappedCollections: any = [];
    /**
     * @private
     */
    public isFormFieldShape: boolean = false;
    /**
     * @private
     */
    public removedAnnotationCollection: any = [];

    private isEdited: boolean = false;
    /**
     * @private
     */
    public lastActionCollection: {
        action: EditAction;
        annotation: PdfAnnotationBaseModel;
    };
    /**
     * @private
     * Stores preserved positions for annotations during collaborative modify operations.
     * Maps annotName -> position index in collection.
     * Used when modifying existing annotations: delete removes from collection,
     * then re-import should restore at same position instead of appending to end.
     */
    public storedAnnotationIndexes: Map<string, number> = new Map();
    /**
     * @private
     */
    public isModifyAction: boolean = false;
    /**
     * @private
     */
    public isRedactPrevent: boolean = false;
    /**
     * @private
     */
    private readonly xfdfNamespace: string = 'http://ns.adobe.com/xfdf/';

    /**
     * @param {PdfViewer} pdfViewer - pdfViewer
     * @param {PdfViewerBase} viewerBase - viewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        this.arialFontData = getArialFontData();
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.textMarkupAnnotationModule = new TextMarkupAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        if (this.pdfViewer.enableShapeAnnotation) {
            this.shapeAnnotationModule = new ShapeAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        if (this.pdfViewer.enableLinkAnnotation  && (isNullOrUndefined(this.pdfViewer.serviceUrl) ||
            this.pdfViewer.serviceUrl === '')) {
            this.PdfLinkAnnotationModule = new PdfLinkAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        if (this.pdfViewer.enableMeasureAnnotation) {
            this.measureAnnotationModule = new MeasureAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        this.stampAnnotationModule = new StampAnnotation(this.pdfViewer, this.pdfViewerBase);
        this.redactionAnnotationModule = new Redaction(this.pdfViewer, this.pdfViewerBase);
        this.redactionOverlayTextModule = new RedactionOverlayText(this.pdfViewer, this.pdfViewerBase);
        this.stickyNotesAnnotationModule = new StickyNotesAnnotation(this.pdfViewer, this.pdfViewerBase);
        this.freeTextAnnotationModule = new FreeTextAnnotation(this.pdfViewer, this.pdfViewerBase);
        this.inputElementModule = new InputElement(this.pdfViewer, this.pdfViewerBase);
        this.inkAnnotationModule = new InkAnnotation(this.pdfViewer, this.pdfViewerBase);
    }

    /**
     *
     * @param {any} data - Render-page appearance data containing image bytes,
     * bounds, annotation metadata, and page information.
     * @private
     * @returns {void}
     * * Returns true when the stored cache says the annotation should draw its
     * isolated appearance image instead of the per-type geometry renderer.
     */
    public storeAppearanceFromRenderPage(data: any): void {
        const cachedKey: string = data.cacheKey ? data.cacheKey : data.annotName;
        try {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = data.width;
            canvas.height = data.height;
            const ctx: any = canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            const imageData: ImageData = ctx.createImageData(data.width, data.height);
            imageData.data.set(data.value);
            ctx.putImageData(imageData, 0, 0);
            const image: HTMLImageElement = new Image();
            // eslint-disable-next-line security/detect-object-injection
            let entry: any = this.appearanceCache[cachedKey];
            if (!entry) {
                entry = {
                    hasAP: true,
                    isTemplateAppearance: false,
                    appearanceSource: 'render-page'
                };
                // eslint-disable-next-line security/detect-object-injection
                this.appearanceCache[cachedKey] = entry;
            }
            entry.annotName = data.annotName;
            entry.bounds = data.bounds;
            entry.subtype = data.subtype;
            entry.annotIndex = data.annotIndex;
            entry.pageIndex = data.pageIndex;
            entry.imageWidth = data.width;
            entry.imageHeight = data.height;
            image.onload = (): void => {
                entry.appearanceImage = image;
                entry.isTemplateAppearance = true;
                const annotation: any = this.pdfViewer.annotationCollection.find((annot: any) =>
                    annot.templateAppearanceId === data.annotName || annot.annotName === data.annotName);
                if (annotation && !annotation.templateAppearanceImage) {
                    annotation.templateAppearanceImage = image;
                    annotation.hasPdfAppearance = true;
                    annotation.isAppearanceStale = false;
                    annotation.pageIndex = annotation.pageNumber;
                    annotation.id = annotation.uniqueKey;
                    const drawingObject: any = this.pdfViewer.nameTable[annotation.uniqueKey];
                    if (drawingObject) {
                        drawingObject.templateAppearanceImage = image;
                        drawingObject.hasPdfAppearance = annotation.hasPdfAppearance;
                        drawingObject.isAppearanceStale = annotation.isAppearanceStale;
                    }
                }
                this.pdfViewer.drawing.refreshCanvasDiagramLayer(null, data.pageIndex);
            };
            image.onerror = (): void => {
                entry.isTemplateAppearance = false;
                entry.appearanceImage = null;
            };
            image.src = canvas.toDataURL('image/png');
        } catch (error) {
            console.error(
                'storeAppearanceFromRenderPage failed',
                error
            );
        }
    }

    /**
     * Mark the cached PDF appearance image of an annotation as stale.
     *
     * The appearance image is a raster of the annotation as it was loaded from the
     * PDF appearance stream. Once the user edits the annotation content (colour,
     * thickness, text, geometry), that raster no longer represents the annotation
     * and the renderer falls back to the default geometry.
     *
     * @private
     * @param {any} annotation - The annotation whose appearance image should be invalidated.
     * @returns {void}
     */
    public invalidateAppearanceImage(annotation: any): void {
        if (isNullOrUndefined(annotation)) {
            return;
        }
        if (this.isUndoRedoAction) {
            // Undo restores the pre-edit state and redo keeps the annotation stale, so apply the recorded
            // value to every copy (viewer, session and annotation collections) that print/download serialize.
            const snapshot: any = this.isUndoAction ? this.currentUndoElement : this.currentRedoElement;
            if (snapshot && !isNullOrUndefined(snapshot.isAppearanceStale)) {
                annotation.isAppearanceStale = snapshot.isAppearanceStale;
                return;
            }
        }
        if (annotation.hasPdfAppearance || annotation.templateAppearanceImage) {
            annotation.isAppearanceStale = true;
        }
    }

    /**
     * Set annotation type to be added in next user interaction in PDF Document.
     *
     * @param {AnnotationType} type - type
     * @param {DynamicStampItem} dynamicStampItem - dynamicStampItem
     * @param {SignStampItem} signStampItem - signStampItem
     * @param {StandardBusinessStampItem} standardBusinessStampItem - standardBusinessStampItem.
     * @returns {void}
     */
    public setAnnotationMode(type: AnnotationType, dynamicStampItem?: DynamicStampItem, signStampItem?: SignStampItem,
                             standardBusinessStampItem?: StandardBusinessStampItem): void {
        if (this.pdfViewer.readOnlySettings.comments && type === 'StickyNotes') {
            return;
        }
        if (this.pdfViewer.readOnlySettings.annotations && type !== 'None') {
            return;
        }
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        // R-4 / R-3: Any annotation tool selection that does not land on the
        // FreehandHighlightTool resets enableInkHighlight = false AND restores the
        // plain Ink defaults (thickness 1, opacity 1, subject 'Ink'). The
        // FreehandHighlightTool onToolbarClicked case sets the flag and the
        // Freehand Highlight defaults explicitly after this call, so the reset
        // here is safe for that path too — it just runs twice (cheap no-op
        // on the second call).
        if (this.pdfViewer.inkAnnotationSettings) {
            this.pdfViewer.inkAnnotationSettings.enableInkHighlight = false;
            this.pdfViewer.inkAnnotationSettings.subject = 'Ink';
        }
        if (this.pdfViewer.tool === 'Stamp' && this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateStampItems();
        }
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.resetFreeTextAnnot();
        }
        if (type !== 'None') {
            this.triggerAnnotationUnselectEvent();
        }
        this.pdfViewer.tool = '';
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.deSelectCommentAnnotation();
        }
        if (type === 'None') {
            this.clearAnnotationMode();
        } else if (type === 'Highlight' || type === 'Strikethrough' || type === 'Underline' || type === 'Squiggly') {
            if (this.textMarkupAnnotationModule) {
                this.textMarkupAnnotationModule.isSelectionMaintained = false;
                this.textMarkupAnnotationModule.drawTextMarkupAnnotations(type.toString());
            }
        } else if (type === 'Line' || type === 'Arrow' || type === 'Rectangle' || type === 'Circle' || type === 'Polygon' || type === 'Cloud') {
            if (this.shapeAnnotationModule) {
                this.shapeAnnotationModule.setAnnotationType(type);
            }
        } else if (type === 'Distance' || type === 'Perimeter' || type === 'Area' || type === 'Radius' || type === 'Volume') {
            if (this.measureAnnotationModule) {
                this.measureAnnotationModule.setAnnotationType(type);
            }
        } else if (type === 'FreeText' && this.freeTextAnnotationModule) {
            this.freeTextAnnotationModule.setAnnotationType('FreeText');
            this.freeTextAnnotationModule.isNewFreeTextAnnot = true;
            this.freeTextAnnotationModule.isNewAddedAnnot = true;
        } else if (type === 'Callout' && this.freeTextAnnotationModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.handleCalloutEditor();
        } else if (type === 'HandWrittenSignature') {
            this.pdfViewerBase.signatureModule.setAnnotationMode();
        } else if (type === 'Initial') {
            this.pdfViewerBase.signatureModule.setInitialMode();
        } else if (type === 'CustomTextStamp') {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.openCustomTextStampDialog();
            }
            this.stampAnnotationModule.isTextStampAddMode = true;
        } else if (type === 'Ink') {
            this.inkAnnotationModule.setAnnotationMode();
        } else if (type === 'Redaction') {
            if (this.redactionAnnotationModule && this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule) {
                this.pdfViewer.toolbarModule.redactionToolbarModule.isTextRedactMode = true;
                this.redactionAnnotationModule.setAnnotationType(type);
                this.pdfViewer.toolbarModule.annotationToolbarModule.onRedactionDrawSelection();
            }
        } else if (type === 'StickyNotes') {
            this.pdfViewerBase.isCommentIconAdded = true;
            this.pdfViewerBase.isAddComment = true;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
            if (pageDiv) {
                pageDiv.addEventListener('mousedown', this.pdfViewer.annotationModule.stickyNotesAnnotationModule.drawIcons.bind(this));
            }
        } else if (type === 'Stamp') {
            this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
            this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
            this.pdfViewerBase.stampAdded = true;
            if (dynamicStampItem) {
                // eslint-disable-next-line
                const stampName: any = DynamicStampItem[dynamicStampItem];
                this.pdfViewerBase.isDynamicStamp = true;
                this.stampAnnotationModule.retrieveDynamicStampAnnotation(stampName);
            } else if (signStampItem) {
                // eslint-disable-next-line
                const stampName: any = SignStampItem[signStampItem];
                this.pdfViewerBase.isDynamicStamp = false;
                this.stampAnnotationModule.retrievestampAnnotation(stampName);
            } else if (standardBusinessStampItem) {
                // eslint-disable-next-line
                const stampName: any = StandardBusinessStampItem[standardBusinessStampItem];
                this.pdfViewerBase.isDynamicStamp = false;
                this.stampAnnotationModule.retrievestampAnnotation(stampName);
            }
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
        this.pdfViewerBase.initiateTextSelection();
    }

    /**
     * Get shape annotation module.
     *
     * @private
     * @returns {ShapeAnnotation} The shape annotation module instance for the PDF viewer.
     */
    public getShapeAnnotationModule(): ShapeAnnotation {
        return new ShapeAnnotation(this.pdfViewer, this.pdfViewerBase);
    }

    /**
     * Get measure annotation module.
     *
     * @private
     * @returns {MeasureAnnotation} The measure annotation module instance for the PDF viewer.
     */
    public getMeasureAnnotationModule(): MeasureAnnotation {
        return new MeasureAnnotation(this.pdfViewer, this.pdfViewerBase);
    }

    /**
     * Get text markup annotation module.
     *
     * @private
     * @returns {TextMarkupAnnotation} The text markup annotation module instance for the PDF viewer.
     */
    public getTextmarkAnnotationModule(): TextMarkupAnnotation {
        return new TextMarkupAnnotation(this.pdfViewer, this.pdfViewerBase);
    }

    public deleteAnnotationById(annotationId: string | object): void {
        if (annotationId) {
            this.isAnnotDeletionApiCall = true;
            this.annotationSelected = false;
            let annotation: any;
            let id: string;
            if (typeof annotationId === 'object') {
                annotation = annotationId;
                id = annotation.annotationId;
                annotation = this.pdfViewer.annotationModule.getAnnotationsFromAnnotationCollections(id, annotationId);
            }
            if (typeof annotationId === 'string') {
                annotation = this.pdfViewer.annotationModule.getAnnotationsFromAnnotationCollections(annotationId);
                id = annotationId;
            }
            if (this.pdfViewer.annotationModule && this.PdfLinkAnnotationModule && annotation &&
                annotation.shapeAnnotationType === 'Link') {
                if (!isNullOrUndefined(annotation.uniqueKey)) {
                    const annotationBase: any = (this.pdfViewer.nameTable as any)[`${annotation.uniqueKey}`];
                    if (!isNullOrUndefined(annotationBase)) {
                        this.PdfLinkAnnotationModule.deleteLinkAnnotationById(annotationBase);
                    }
                }
                else if (annotation && annotation.annotationId && this.isAnnotDeletionApiCall) {
                    const annotationId: string = annotation.annotationId;
                    const pageIndex: number = annotation.pageNumber ? annotation.pageNumber :
                        annotation.pageIndex;
                    const collections: any = this.updateCollectionForNonRenderedPages(annotation, annotationId, pageIndex);
                    collections.pageIndex = pageIndex;
                    this.pdfViewer.annotation.addAction(pageIndex, null, collections, 'Link Delete', '', collections, collections);
                    this.undoCommentsElement.push(collections);
                }
            }
            else {
                this.selectAnnotation(annotationId);
                this.deleteAnnotation();
            }
            this.isAnnotDeletionApiCall = false;
            if (this.pdfViewer.textSelectionModule) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
            }
        }
    }
    private clearAnnotationMode(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        if (this.redactionAnnotationModule) {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule) {
                this.pdfViewer.toolbarModule.redactionToolbarModule.clear();
            }
        }
        if (this.freeTextAnnotationModule) {
            this.freeTextAnnotationModule.isNewFreeTextAnnot = false;
            this.freeTextAnnotationModule.isNewAddedAnnot = false;
        }
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
        }
        if (this.pdfViewerBase.isShapeAnnotationModule()) {
            this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode = '';
        }
        if (this.pdfViewerBase.isCalibrateAnnotationModule()) {
            this.pdfViewer.annotation.measureAnnotationModule.currentAnnotationMode = '';
        }
        if (this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    }

    public deleteAnnotation(): void {
        const selectedSign: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        if (this.pdfViewer.readOnlySettings.annotations && !(selectedSign && this.pdfViewerBase.checkSignatureFormField(selectedSign.id))) {
            return;
        }
        if (this.textMarkupAnnotationModule) {
            if (this.textMarkupAnnotationModule.currentTextMarkupAnnotation &&
                this.textMarkupAnnotationModule.currentTextMarkupAnnotation.shapeAnnotationType !== 'Redaction') {
                this.textMarkupAnnotationModule.deleteTextMarkupAnnotation();
            }
            if (this.redactionAnnotationModule) {
                this.redactionAnnotationModule.deleteTextRedactAnnotation();
            }
        }
        const selectedAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        if (selectedAnnotation){
            const data : string = this.pdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_formfields');
            const formFieldsData : any = JSON.parse(data);
            const newFormFieldsData : string[] = [];
            if (formFieldsData){
                for (let x: number = 0; x < formFieldsData.length; x++){
                    // eslint-disable-next-line
                    if (formFieldsData[parseInt(x.toString(), 10)].uniqueID == selectedAnnotation.id){
                        formFieldsData[parseInt(x.toString(), 10)].Value = '';
                        for (let y: number = 0; y < formFieldsData.length; y++){
                            if (formFieldsData[parseInt(y.toString(), 10)].Name === 'ink') {
                                formFieldsData[parseInt(y.toString(), 10)].Value = '';
                            }
                            if (formFieldsData[parseInt(x.toString(), 10)].FieldName === formFieldsData[parseInt(y.toString(), 10)].FieldName && formFieldsData[parseInt(y.toString(), 10)].Name === 'ink'){
                                formFieldsData.splice(y, 1);
                            }
                        }
                        newFormFieldsData.push(formFieldsData[parseInt(x.toString(), 10)]);
                    }
                    else{
                        newFormFieldsData.push(formFieldsData[parseInt(x.toString(), 10)]);
                    }
                }
                this.pdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(newFormFieldsData));
            }
        }
        let isLock: boolean = false;
        let isReadOnly: boolean = false;
        if (this.pdfViewer.selectedItems.annotations.length > 0 && this.pdfViewer.selectedItems.annotations[0]) {
            const annotation: any = this.pdfViewer.selectedItems.annotations[0];
            const type: PdfAnnotationType = annotation.shapeAnnotationType;
            if (type === 'Path' || annotation.formFieldAnnotationType === 'SignatureField' || annotation.formFieldAnnotationType === 'InitialField' || type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') {
                const inputFields: HTMLElement = document.getElementById(annotation.id);
                if (inputFields && (inputFields as HTMLInputElement).disabled) {
                    isReadOnly = true;
                }
                if (this.pdfViewer.readOnlySettings.formFields) {
                    isReadOnly = true;
                }
            }
            if (annotation.annotationSettings) {
                isLock = annotation.annotationSettings.isLock;
                if (isLock && this.checkAllowedInteractions('Delete', annotation)) {
                    isLock = false;
                }
            }
            if (!isLock && !isReadOnly) {
                const pageNumber: number = annotation.pageIndex;
                const shapeType: PdfAnnotationType = annotation.shapeAnnotationType;
                let undoElement: any;
                if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                    if (isNullOrUndefined(annotation.measureType) || annotation.measureType === '') {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'shape');
                        this.updateImportAnnotationCollection(annotation, pageNumber, 'shapeAnnotation');
                    } else {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'measure');
                        this.updateImportAnnotationCollection(annotation, pageNumber, 'measureShapeAnnotation');
                    }
                    undoElement = this.modifyInCollections(annotation, 'delete');
                } else if (shapeType === 'Redaction') {
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'Redaction', 'delete');
                    undoElement = this.modifyInCollections(annotation, 'delete');
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'redactionAnnotation');
                } else if (shapeType === 'FreeText') {
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'FreeText', 'delete');
                    undoElement = this.modifyInCollections(annotation, 'delete');
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'freeTextAnnotation');
                } else if (shapeType === 'HandWrittenSignature' || shapeType === 'SignatureImage' || shapeType === 'SignatureText') {
                    undoElement = this.modifyInCollections(annotation, 'delete');
                } else if (shapeType === 'Ink') {
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'Ink', 'delete');
                    undoElement = this.modifyInCollections(annotation, 'delete');
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'signatureInkAnnotation');
                } else {
                    undoElement = this.pdfViewer.selectedItems.annotations[0];
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(undoElement, undoElement.shapeAnnotationType, 'delete');
                    this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(annotation, null, 'delete');
                }
                if (shapeType === 'StickyNotes') {
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'stickyNotesAnnotation');
                }
                if (shapeType === 'Stamp' || shapeType === 'Image') {
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'stampAnnotations');
                }
                const formFieldObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[annotation.id.split('_')[0]];
                if (isNullOrUndefined(formFieldObj) || !(formFieldObj.formFieldAnnotationType === 'SignatureField' || formFieldObj.formFieldAnnotationType === 'InitialField')) {
                    if (!this.isApplyingRemoteUpdate) {
                        this.pdfViewer.annotation.addAction(pageNumber, null, annotation, 'Delete', '', undoElement, annotation);
                    }
                }
                let removeDiv: HTMLElement;
                if (annotation.annotName !== '') {
                    removeDiv = document.getElementById(annotation.annotName);
                } else {
                    if (undoElement) {
                        if (undoElement.annotName !== '') {
                            removeDiv = document.getElementById(undoElement.annotName);
                        }
                    }
                }
                if (!this.isApplyingRemoteUpdate || !this.isModifyAction) {
                    this.removeCommentPanelDiv(removeDiv);
                    this.removeAnnotationsInLoadedDocument(annotation);
                }
                const selectedAnnot: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
                const annotationId: string = selectedAnnot.annotName;
                const annotType: AnnotationType = this.getAnnotationType(selectedAnnot.shapeAnnotationType, selectedAnnot.measureType);
                if (shapeType === 'Path' || selectedAnnot.formFieldAnnotationType === 'SignatureField' || selectedAnnot.formFieldAnnotationType === 'InitialField' || shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') {
                    const formFieldCollection: any = this.pdfViewer.retrieveFormFields();
                    const index: number = formFieldCollection.findIndex((el: { id: any; }) => el.id === annotation.id);
                    let formFieldName: string;
                    if (index > -1) {
                        formFieldName = formFieldCollection[parseInt(index.toString(), 10)].name;
                    }
                    for (let m: number = 0; m < formFieldCollection.length; m++) {
                        if (selectedAnnot.id === formFieldCollection[parseInt(m.toString(), 10)].id ||
                        (isNullOrUndefined(formFieldName) && formFieldName === formFieldCollection[parseInt(m.toString(), 10)].name)) {
                            formFieldCollection[parseInt(m.toString(), 10)].value = '';
                            formFieldCollection[parseInt(m.toString(), 10)].signatureType = '';
                            const annotation: PdfAnnotationBaseModel =
                            this.getAnnotationsFromCollections(formFieldCollection[parseInt(m.toString(), 10)].id);
                            if (!isNullOrUndefined(annotation)) {
                                this.updateInputFieldDivElement(annotation);
                                undoElement = this.modifyInCollections(annotation, 'delete');
                                this.pdfViewer.annotation.addAction(annotation.pageIndex, null, annotation, 'Delete', '', undoElement, annotation);
                                if (this.pdfViewer.formDesignerModule && selectedAnnot.formFieldAnnotationType) {
                                    this.updateFormFieldCollection(annotation);
                                }
                                else { this.updateAnnotationCollection(annotation); }
                                this.pdfViewer.remove(annotation);
                            }
                        }
                    }
                    if (this.pdfViewer.formDesignerModule && selectedAnnot.formFieldAnnotationType)
                    {this.updateFormFieldCollection(annotation); }
                    else
                    {this.updateAnnotationCollection(annotation); }
                }
                if (this.pdfViewer.formDesignerModule && selectedAnnot.formFieldAnnotationType)
                {this.updateFormFieldCollection(annotation); }
                else
                {this.updateAnnotationCollection(annotation); }
                if (formFieldObj != null && (formFieldObj.formFieldAnnotationType === 'SignatureField' || formFieldObj.formFieldAnnotationType === 'InitialField')) {
                    const index: number = this.pdfViewer.formFieldCollections.findIndex((el: FormFieldModel) => el.id === annotation.id.split('_')[0]);
                    let formFieldName: string;
                    if (index > -1) {
                        formFieldName = this.pdfViewer.formFieldCollections[parseInt(index.toString(), 10)].name;
                    }
                    for (let i: number = 0; i < this.pdfViewer.formFieldCollections.length; i++) {
                        if (formFieldName === this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)].name) {
                            const formFieldsIndex: any = this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)];
                            this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsIndex, formFieldsIndex.pageIndex, true, false, false,
                                                                              false, false, false, false, false, false, false, false,
                                                                              false, false, false, false, formFieldsIndex.value, '');
                            formFieldsIndex.value = '';
                            formFieldsIndex.signatureType = '';
                            this.pdfViewer.formDesignerModule.updateFormFieldCollections(formFieldsIndex);
                            if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                                this.pdfViewer.fireFormFieldChangedEvent(EditAction.Modify, formFieldsIndex);
                            }
                            const annotation: any = this.getAnnotationsFromCollections(formFieldsIndex.id + '_content');
                            if (!isNullOrUndefined(annotation)) {
                                undoElement = this.modifyInCollections(annotation, 'delete');
                                this.pdfViewer.annotation.addAction(annotation.pageIndex, null, annotation, 'Delete', '', undoElement, annotation);
                                this.updateInputFieldDivElement(annotation);
                                const formFieldObject: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[annotation.id.split('_')[0]];
                                formFieldObject.wrapper.children.splice(formFieldObject.wrapper.children.
                                    indexOf(annotation.wrapper.children[0]), 1);
                                this.pdfViewer.remove(annotation);
                            }
                        }
                    }
                }
                this.pdfViewer.remove(annotation);
                this.pdfViewer.renderDrawing();
                this.pdfViewer.clearSelection(pageNumber);
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                this.pdfViewerBase.tool = null;
                this.pdfViewer.tool = null;
                if (selectedAnnot.shapeAnnotationType === 'HandWrittenSignature' || selectedAnnot.shapeAnnotationType === 'SignatureText' || selectedAnnot.shapeAnnotationType === 'SignatureImage' || selectedAnnot.shapeAnnotationType === 'Path') {
                    const bounds: object = { left: selectedAnnot.bounds.x, top: selectedAnnot.bounds.y,
                        width: selectedAnnot.bounds.width, height: selectedAnnot.bounds.height };
                    this.pdfViewer.fireSignatureRemove(pageNumber, selectedAnnot.signatureName,
                                                       selectedAnnot.shapeAnnotationType  as AnnotationType , bounds);
                } else if (this.pdfViewer.annotationModule) {
                    this.pdfViewer.fireAnnotationRemove(pageNumber, annotationId, annotType, selectedAnnot.bounds);
                }
                if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.enableTextSelectionMode();
                }
            }
        }
        else if (this.nonRenderSelectedAnnotation && this.nonRenderSelectedAnnotation.annotationId && this.isAnnotDeletionApiCall) {
            const annotationId: string = this.nonRenderSelectedAnnotation.annotationId;
            const pageIndex: number = this.nonRenderSelectedAnnotation.pageNumber ? this.nonRenderSelectedAnnotation.pageNumber :
                this.nonRenderSelectedAnnotation.pageIndex;
            const collections: any = this.updateCollectionForNonRenderedPages(this.nonRenderSelectedAnnotation, annotationId, pageIndex);
            collections.pageIndex = pageIndex;
            this.pdfViewer.annotation.addAction(pageIndex, null, collections, 'Delete', '', collections, collections);
            this.undoCommentsElement.push(collections);
            const removeDiv: HTMLElement = document.getElementById(annotationId);
            this.removeCommentPanelDiv(removeDiv);
            this.nonRenderSelectedAnnotation = null;
        }
        this.updateToolbar(true);
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule && !isLock) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(false, true);
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(false);
            }
            if (this.pdfViewer.toolbarModule.redactionToolbarModule && !isLock) {
                this.pdfViewer.toolbarModule.redactionToolbarModule.showHideDeleteIcon(false);
                const annotationsArray: any = this.pdfViewer.annotationCollection;
                const hasRedaction: boolean = annotationsArray.some(
                    (annot: any) => annot.shapeAnnotationType === 'Redaction'
                );
                if (!hasRedaction) {
                    this.pdfViewer.toolbarModule.redactionToolbarModule.showHideRedactIcon(false);
                }
            }
        }
    }

    /**
     * @param {string} annotationId - annotationId
     * @returns {void}
     */
    private getAnnotationsFromCollections(annotationId : string): PdfAnnotationBaseModel {
        const collections :  PdfAnnotationBaseModel[] = this.pdfViewer.annotations;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].id === annotationId) {
                    return collections[parseInt(i.toString(), 10)];
                }
            }
        }
        return null;
    }

    /**
     * @param {any} annotation - annotation
     * @returns {void}
     */
    private updateInputFieldDivElement(annotation: PdfAnnotationBaseModel): void {
        let inputFields: Element = document.getElementById(annotation.id);
        const signatureFieldElement: HTMLElement = document.getElementById(annotation.id + '_html_element');
        if (inputFields === null && !isNullOrUndefined(signatureFieldElement)) {
            inputFields = signatureFieldElement.children[0].children[0];
        }
        if (inputFields && inputFields.classList.contains('e-pdfviewer-signatureformfields-signature')) {
            inputFields.className = 'e-pdfviewer-signatureformfields';
            (inputFields as HTMLElement).style.pointerEvents = '';
            inputFields.parentElement.style.pointerEvents = '';
        }
        if (this.pdfViewer.formDesignerModule) {
            this.pdfViewer.formDesignerModule.updateSignatureValue(annotation.id);
        } else {
            if (this.pdfViewerBase.signatureModule) {
                this.pdfViewerBase.signatureModule.updateDataInSession(inputFields, '');
            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @param {number} pageNumber - pageNumber
     * @param {boolean} isNeedToReorderCollection - Ensures whether need to reorder the collection or not
     * @param {number} orderNumber - Gets the order number
     * @param {boolean} isImportAnnotations - skip annotation changed event
     * @private
     * @returns {void}
     */
    public storeAnnotationCollections(annotation: any, pageNumber: number, isNeedToReorderCollection?: boolean,
                                      orderNumber?: number, isImportAnnotations?: boolean): void {
        if (this.isFormFieldShape) {
            const collectionDetails: any = this.checkFormDesignCollection(annotation);
            const selectAnnotation: any = cloneObject(annotation);
            selectAnnotation.formFieldId = annotation.annotName;
            selectAnnotation.pageNumber = pageNumber;
            delete selectAnnotation.annotName;
            if (annotation.id) {
                selectAnnotation.uniqueKey = annotation.id;
                delete selectAnnotation.id;
            }
            if (collectionDetails.isExisting) {
                this.pdfViewer.formFieldCollection.splice(collectionDetails.position, 0, selectAnnotation);
            } else {
                this.pdfViewer.formFieldCollection.push(selectAnnotation);
            }
        } else {
            const collectionDetails: any = this.checkAnnotationCollection(annotation);
            const selectAnnotation: any = cloneObject(annotation);
            selectAnnotation.annotationId = annotation.annotName;
            selectAnnotation.pageNumber = pageNumber;
            delete selectAnnotation.annotName;
            if (annotation.shapeAnnotationType === 'stamp') {
                selectAnnotation.uniqueKey = annotation.randomId;
                delete selectAnnotation.randomId;
            }
            if (annotation.shapeAnnotationType === 'sticky') {
                selectAnnotation.uniqueKey = annotation.annotName;
            }
            if (annotation.id) {
                selectAnnotation.uniqueKey = annotation.id;
                delete selectAnnotation.id;
            }
            if (selectAnnotation.customData && annotation.customData && JSON.stringify(selectAnnotation.customData) !==
             JSON.stringify(annotation.customData)) {
                selectAnnotation.customData = annotation.customData;
            }
            // Check if position was preserved from delete operation (collaborative modify scenario)
            const preservedPosition: number = this.storedAnnotationIndexes.get(annotation.annotName);
            if (!isNullOrUndefined(preservedPosition)) {
                // Restore annotation at original position (preserves order in collaborative scenarios)
                this.pdfViewer.annotationCollection.splice(preservedPosition, 0, selectAnnotation);
                if (!this.isSkipLastAction && !this.isApplyingRemoteUpdate  && !this.pdfViewerBase.isInitialLoad &&
                    !this.pdfViewerBase.isImportAction) {
                    this.fireAnnotationChangedEvent(this.cloneObject(selectAnnotation), EditAction.Modify);
                }
                this.isSkipLastAction = false;
                this.storedAnnotationIndexes.delete(annotation.annotName); // Clean up position mapping
            } else if (collectionDetails.isExisting && !isNeedToReorderCollection) {
                this.pdfViewer.annotationCollection.splice(collectionDetails.position, 0, selectAnnotation);
                if (!this.isSkipLastAction && !this.isApplyingRemoteUpdate && !this.pdfViewerBase.isInitialLoad &&
                    !this.pdfViewerBase.isImportAction && !this.pdfViewerBase.isOrganizePageSaveAction &&
                    !isImportAnnotations && !this.pdfViewerBase.isProcessingDocument) {
                    this.fireAnnotationChangedEvent(this.cloneObject(selectAnnotation), EditAction.Modify);
                }
                this.isSkipLastAction = false;
            }  else if (!isNullOrUndefined(isNeedToReorderCollection) && isNeedToReorderCollection) {
                const annotationPosition: number = orderNumber + this.pdfViewer.annotationCollection.filter(
                    (annot: any) => annot.pageNumber < pageNumber).length;
                this.pdfViewer.annotationCollection.splice(annotationPosition, 0, selectAnnotation);
            } else {
                this.pdfViewer.annotationCollection.push(selectAnnotation);
                if ((!this.isApplyingRemoteUpdate && !this.pdfViewerBase.isInitialLoad && !this.pdfViewerBase.isImportAction) ||
                     this.pdfViewerBase.isAddAnnotation) {
                    this.fireAnnotationChangedEvent(this.cloneObject(selectAnnotation), EditAction.Add);
                }
            }
        }
    }
    public checkFormDesignCollection(annotation: any): any {
        const collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].formFieldId === annotation.annotName) {
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                    return { isExisting: true, position: i };
                }
            }
        }
        return { isExisting: false, position: null };
    }
    public updateFormFieldCollection(annotation: any): void {
        const collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].formFieldId === annotation.annotName) {
                    this.removedAnnotationCollection.push(collections[parseInt(i.toString(), 10)]);
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {void}
     */
    public getCustomData(annotation: any): object {
        let customData: object;
        if (annotation.ExistingCustomData && !annotation.CustomData) {
            customData = JSON.parse(annotation.ExistingCustomData);
        }
        else if (annotation.CustomData === null) {
            if (annotation.shapeAnnotationType === 'sticky') {
                customData = this.pdfViewer.stickyNotesSettings.customData;
            }
            if (annotation.shapeAnnotationType === 'Stamp') {
                customData = this.pdfViewer.stampSettings.customData;
            }
            if (annotation.shapeAnnotationType === 'FreeText') {
                customData = this.pdfViewer.freeTextSettings.customData;
            }
            if (annotation.id === 'shape') {
                customData = this.getShapeData(annotation.ShapeAnnotationType, annotation.subject);
            }
            if (annotation.id === 'measure') {
                customData = this.getMeasureData(annotation.Subject);
            }
            if (annotation.shapeAnnotationType === 'textMarkup') {
                customData = this.getTextMarkupData(annotation.subject);
            }
            if (annotation.shapeAnnotationType === 'Ink') {
                customData = this.pdfViewer.inkAnnotationSettings.customData;
            }
        } else {
            const data: any = annotation.CustomData ? annotation.CustomData : annotation.customData;
            if (!isNullOrUndefined(data)) {
                customData = typeof data === 'string' ? JSON.parse(data) : data;
            }
        }
        return customData;
    }

    /**
     * @param {string} type - type
     * @param {string} subject - subject
     * @private
     * @returns {void}
     */
    public getShapeData(type: string, subject: string): object {
        let customData: object;
        if (type === 'Line' && subject !== 'Arrow' && this.pdfViewer.lineSettings.customData) {
            customData = this.pdfViewer.lineSettings.customData;
        } else if ((type === 'LineWidthArrowHead' || subject === 'Arrow') && this.pdfViewer.arrowSettings.customData) {
            customData = this.pdfViewer.arrowSettings.customData;
        } else if ((type === 'Rectangle' || type === 'Square') && this.pdfViewer.rectangleSettings.customData) {
            customData = this.pdfViewer.rectangleSettings.customData;
        } else if ((type === 'Ellipse' || type === 'Circle') && this.pdfViewer.circleSettings.customData) {
            customData = this.pdfViewer.circleSettings.customData;
        } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.customData) {
            customData = this.pdfViewer.polygonSettings.customData;
        } else if (this.pdfViewer.annotationSettings.customData) {
            customData = this.pdfViewer.annotationSettings.customData;
        }
        return customData;
    }

    /**
     * @param {string} type - type
     * @private
     * @returns {void}
     */
    public getMeasureData(type: string): object {
        let customData: object;
        if ((type === 'Distance' || type === 'Distance calculation') && this.pdfViewer.distanceSettings.customData) {
            customData = this.pdfViewer.distanceSettings.customData;
        } else if ((type === 'Line' || type === 'Perimeter calculation') && this.pdfViewer.lineSettings.customData) {
            customData = this.pdfViewer.lineSettings.customData;
        } else if ((type === 'Polygon' || type === 'Area calculation' || type === 'Volume calculation') && this.pdfViewer.polygonSettings.customData) {
            customData = this.pdfViewer.polygonSettings.customData;
        } else if ((type === 'Radius' || type === 'Radius calculation') && this.pdfViewer.radiusSettings.customData) {
            customData = this.pdfViewer.radiusSettings.customData;
        } else if (this.pdfViewer.annotationSettings.customData) {
            customData = this.pdfViewer.annotationSettings.customData;
        }
        return customData;
    }

    /**
     * @param {string} type - type
     * @private
     * @returns {void}
     */
    public getTextMarkupData(type: string): object {
        let customData: object;
        if (type === 'Highlight' && this.pdfViewer.highlightSettings.customData) {
            customData = this.pdfViewer.highlightSettings.customData;
        } else if (type === 'Underline' && this.pdfViewer.underlineSettings.customData) {
            customData = this.pdfViewer.underlineSettings.customData;
        } else if (type === 'Strikethrough' && this.pdfViewer.strikethroughSettings.customData) {
            customData = this.pdfViewer.strikethroughSettings.customData;
        } else if (type === 'Squiggly' && this.pdfViewer.squigglySettings.customData) {
            customData = this.pdfViewer.squigglySettings.customData;
        } else if (this.pdfViewer.annotationSettings.customData) {
            customData = this.pdfViewer.annotationSettings.customData;
        }
        return customData;
    }

    /**
     * @param {string} type - type
     * @private
     * @returns {void}
     */
    public getData(type: string): object {
        let customData: object;
        if (type === 'FreeText' && this.pdfViewer.freeTextSettings.customData) {
            customData = this.pdfViewer.freeTextSettings.customData;
        } else if ((type === 'image' || type === 'Stamp') && this.pdfViewer.stampSettings.customData) {
            customData = this.pdfViewer.stampSettings.customData;
        } else if (type === 'sticky' && this.pdfViewer.stickyNotesSettings.customData) {
            customData = this.pdfViewer.stickyNotesSettings.customData;
        } else if (this.pdfViewer.annotationSettings.customData) {
            customData = this.pdfViewer.annotationSettings.customData;
        }
        return customData;
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {Object} - Object
     */
    public checkAnnotationCollection(annotation: any): Object {
        const collections: any = this.pdfViewer.annotationCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].annotationId === annotation.annotName &&
                    (collections[parseInt(i.toString(), 10)].pageNumber === annotation.pageNumber ||
                    collections[parseInt(i.toString(), 10)].pageNumber === annotation.pageIndex)) {
                    this.pdfViewer.annotationCollection.splice(i, 1);
                    return { isExisting: true, position: i };
                }
            }
        }
        return { isExisting: false, position: null };
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {void}
     */
    public updateAnnotationCollection(annotation: any): void {
        const collections: any = this.pdfViewer.annotationCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].annotationId ===
                    annotation.annotName || collections[parseInt(i.toString(), 10)].annotationId === annotation.annotationId &&
                    collections[parseInt(i.toString(), 10)].pageNumber === annotation.pageNumber) {
                    this.removedAnnotationCollection.push(collections[parseInt(i.toString(), 10)]);
                    if (!this.isApplyingRemoteUpdate) {
                        this.lastActionCollection = { action: EditAction.Delete,
                            annotation: this.cloneObject(collections[parseInt(i.toString(), 10)]) };
                        this.fireAnnotationChangedEvent(this.cloneObject(collections[parseInt(i.toString(), 10)]), EditAction.Delete);
                    }
                    this.pdfViewer.annotationCollection.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @param {number} pageNumber - pageNumber
     * @param {string} annotationType - annotationType
     * @private
     * @returns {void}
     */
    public updateImportAnnotationCollection(annotation: any, pageNumber: number, annotationType: string): void {
        if (this.pdfViewerBase.isImportAction) {
            if (this.pdfViewerBase.importedAnnotation && this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)]) {
                const currentPageAnnotations: any = this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)];
                if (currentPageAnnotations[`${annotationType}`] &&
                     !isNullOrUndefined(this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)].annotationOrder)) {
                    this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)].annotationOrder =
                    this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)].annotationOrder.filter(
                        (currentAnnotation: any) => {
                            return !(annotation.annotName === currentAnnotation.AnnotName
                                     || annotation.annotName === currentAnnotation.annotName);
                        }
                    );
                }
                if (!isNullOrUndefined(this.pdfViewerBase.importedAnnotation) &&
                    !isNullOrUndefined(this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)]) &&
                    !isNullOrUndefined(
                        this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)][annotationType as AnnotationsType])) {
                    const importedPageAnnotations: any =
                        this.pdfViewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)];
                    importedPageAnnotations[annotationType as AnnotationsType] =
                        importedPageAnnotations[annotationType as AnnotationsType].filter(
                            (currentAnnotation: any) => {
                                return annotation.annotName !== currentAnnotation.AnnotName;
                            });
                }
            }
        }
        const documentcollections: any = this.pdfViewerBase.documentAnnotationCollections;
        if (documentcollections && documentcollections[parseInt(pageNumber.toString(), 10)]) {
            const documentPageCollections: any = documentcollections[parseInt(pageNumber.toString(), 10)];
            if (documentPageCollections && documentPageCollections[`${annotationType}`]) {
                for (let i: number = 0; i < documentPageCollections[`${annotationType}`].length; i++) {
                    if (annotation.annotName
                        === documentPageCollections[`${annotationType}`][parseInt(i.toString(), 10)].AnnotName) {
                        this.pdfViewerBase.documentAnnotationCollections[
                            parseInt(pageNumber.toString(), 10)][annotationType as AnnotationCollectionType].splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Select the annotations using annotation object or annotation Id.
     *
     * @param {string | object} annotationId - annptationId
     * @returns {void}
     */
    public selectAnnotation(annotationId: string | object): void {
        let annotation: any;
        let id: string;
        if (typeof annotationId === 'object') {
            annotation = annotationId;
            id = annotation.annotationId;
            annotation = this.getAnnotationsFromAnnotationCollections(id, annotationId);
        }
        if (typeof annotationId === 'string') {
            annotation = this.getAnnotationsFromAnnotationCollections(annotationId);
            id = annotationId;
        }
        let isLinkAnnotationSelectFromContextMenu: boolean = false;
        if (annotation && annotation.shapeAnnotationType === 'Link' &&
            this.PdfLinkAnnotationModule && !isNullOrUndefined(this.PdfLinkAnnotationModule.currentContextMenuLinkAnnotName) &&
            this.PdfLinkAnnotationModule.currentContextMenuLinkAnnotName === annotation.uniqueKey) {
            isLinkAnnotationSelectFromContextMenu = true;
            // Consume the context-menu state so it doesn't leak into later selects.
            this.PdfLinkAnnotationModule.currentContextMenuLinkAnnotName = null;
            this.PdfLinkAnnotationModule.currentContextMenuLinkPageIndex = -1;
        }
        if (annotation) {
            const pageIndex: number = isNullOrUndefined(annotation.pageNumber) ? annotation.pageIndex : annotation.pageNumber;
            let isRender: boolean = false;
            isRender = this.findRenderPageList(pageIndex);
            const currentSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            //let pageIndex: number = this.getPageNumberFromAnnotationCollections(annotation);
            if (annotation && pageIndex >= 0) {
                if (annotation.shapeAnnotationType === 'textMarkup') {
                    if (annotation.rect || annotation.bounds) {
                        let scrollValue: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].top *
                        this.pdfViewerBase.getZoomFactor() + (this.getAnnotationTop(annotation)) * this.pdfViewerBase.getZoomFactor();
                        const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                        if (zoomFactor >= 2) {
                            const boundingBox: any = this.getTextMarkupBounds(annotation);
                            if (boundingBox) {
                                scrollValue = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].top *
                                    zoomFactor + (boundingBox.top * zoomFactor);
                            }
                        }
                        if (!this.isAnnotDeletionApiCall) {
                            const scroll: string = (scrollValue - 20).toString();
                            this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll, 10);
                            this.pdfViewerBase.viewerContainer.scrollLeft = (annotation.bounds[0]).Left *
                            this.pdfViewerBase.getZoomFactor() - 20;
                        }
                    } else {
                        if (this.pdfViewer.navigation) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                        }
                    }
                } else {
                    if (annotation.bounds) {
                        let scrollValue: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].top *
                        this.pdfViewerBase.getZoomFactor() + ((annotation.bounds as AnnotBoundsRect).top) *
                        this.pdfViewerBase.getZoomFactor();
                        let scrollLeft: number = ((annotation.bounds as AnnotBoundsRect).left * this.pdfViewerBase.getZoomFactor()) - 20;
                        if (annotation.shapeAnnotationType === 'Ink') {
                            scrollValue = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].top *
                            this.pdfViewerBase.getZoomFactor() + ((annotation.bounds as IRect).y) *
                            this.pdfViewerBase.getZoomFactor();
                            scrollLeft = ((annotation.bounds as IRect).x * this.pdfViewerBase.getZoomFactor()) - 20;
                        }
                        if (!this.isAnnotDeletionApiCall && annotation.shapeAnnotationType !== 'Link') {
                            const scroll: string = (scrollValue - 20).toString();
                            this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll, 10);
                            this.pdfViewerBase.viewerContainer.scrollLeft = scrollLeft;
                        }
                    } else {
                        if (this.pdfViewer.navigation) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                        }
                    }
                }
                if (isRender) {
                    if (this.previousIndex) {
                        this.pdfViewer.clearSelection(this.previousIndex);
                    }
                    this.pdfViewer.clearSelection(pageIndex);
                    this.previousIndex = pageIndex;
                    if (annotation.shapeAnnotationType === 'textMarkup') {
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageIndex, true);
                        const canvasId: string = annotation.textMarkupAnnotationType === 'Highlight' ? '_blendAnnotationsIntoCanvas_' : '_annotationCanvas_';
                        const canvas: HTMLElement = (canvasId === '_blendAnnotationsIntoCanvas_') ? this.pdfViewerBase.getElement(canvasId + pageIndex) :
                            this.pdfViewerBase.getAnnotationCanvas(canvasId, pageIndex);
                        const textMarkupAnnotation: any = this.getTextMarkupAnnotations(pageIndex, annotation);
                        if (textMarkupAnnotation) {
                            this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                            this.textMarkupAnnotationModule.isSelectedAnnotation = true;
                            this.textMarkupAnnotationModule.showHideDropletDiv(true);
                            this.textMarkupAnnotationModule.annotationClickPosition = null;
                            this.textMarkupAnnotationModule.selectAnnotation(textMarkupAnnotation, canvas,
                                                                             pageIndex, null, true);
                            this.textMarkupAnnotationModule.currentTextMarkupAnnotation = textMarkupAnnotation;
                            this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageIndex;
                            this.textMarkupAnnotationModule.enableAnnotationPropertiesTool(true);
                            this.textMarkupAnnotationModule.isSelectedAnnotation = false;
                            if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                                this.pdfViewer.toolbarModule.annotationToolbarModule.
                                    showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                            }
                        }
                    } else if (annotation.shapeAnnotationType === 'stamp' || annotation.ShapeAnnotationType === 'stamp') {
                        this.pdfViewer.select([annotation.uniqueKey], currentSelector);
                        this.pdfViewer.annotation.onAnnotationMouseDown();
                    } else if (annotation.shapeAnnotationType === 'sticky' || annotation.ShapeAnnotationType === 'sticky') {
                        this.pdfViewer.select([annotation.annotationId], currentSelector);
                        this.pdfViewer.annotation.onAnnotationMouseDown();
                    } else if (annotation.uniqueKey &&
                        (annotation.shapeAnnotationType !== 'Link' || !this.hasLinkAnnotationDetails(annotation) || isLinkAnnotationSelectFromContextMenu)) {
                        this.pdfViewer.select([annotation.uniqueKey], currentSelector);
                        this.pdfViewer.annotation.onAnnotationMouseDown();
                    }
                    else {
                        this.selectAnnotationId = id;
                        this.isAnnotationSelected = true;
                        this.annotationPageIndex = pageIndex;
                        this.annotationType = annotation.stampAnnotationType;
                    }
                    const commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                    if (commentElement && commentElement.style.display === 'block') {
                        const accordionExpand: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            (accordionExpand as any).ej2_instances[0].expandItem(true);
                        }
                        const commentsDiv: any = (this.pdfViewer.element as HTMLElement).querySelector('[id="' + id + '"]');
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
                }
                else if (annotation.uniqueKey || (annotation.shapeAnnotationType === 'textMarkup' && annotation.annotationAddMode === 'Imported Annotation') || !this.isAnnotDeletionApiCall) {
                    this.selectAnnotationId = id;
                    this.isAnnotationSelected = true;
                    this.annotationPageIndex = pageIndex;
                    this.annotationType = annotation.stampAnnotationType;
                    if (annotation.uniqueKey || (annotation.shapeAnnotationType === 'textMarkup' && annotation.annotationAddMode === 'Imported Annotation')) {
                        this.selectAnnotationFromCodeBehind();
                    }
                }
                else if (!isRender && !annotation.uniqueKey && this.isAnnotDeletionApiCall) {
                    this.nonRenderSelectedAnnotation = annotation;
                }
            }
        }
    }

    /**
     * Returns true when a Link annotation has a usable navigation target — a non-empty
     * `url` (WebLink) or a defined, non-negative `destinationPageIndex` (DocumentLink).
     * Link annotations without either are considered "incomplete" and behave like a
     * regular shape annotation (Rectangle) so they can still be selected / moved /
     * resized / edited.
     *
     * @param {any} annotation - Annotation model to inspect.
     * @returns {boolean} - True when the link has at least one navigation target.
     * @private
     */
    public hasLinkAnnotationDetails(annotation: any): boolean {
        if (!annotation || annotation.shapeAnnotationType !== 'Link') {
            return false;
        }
        const hasUrl: boolean = !isNullOrUndefined(annotation.url) &&
            (annotation.url as string).toString().trim() !== '';
        const hasDestination: boolean = !isNullOrUndefined(annotation.destinationPageIndex) &&
            (annotation.destinationPageIndex as number) >= 0;
        return hasUrl || hasDestination;
    }

    /**
     * It returns the text markup annotation bounds.
     * @param {any} markup - annotation
     * @private
     * @returns {any} - any
     */
    public getTextMarkupBounds(markup: any): any {
        const segments: any = Array.isArray(markup.bounds) ? markup.bounds
            : Array.isArray(markup.rect) ? markup.rect
                : null;
        if (segments && segments.length) {
            let minLeft: number = Number.POSITIVE_INFINITY;
            let minTop: number = Number.POSITIVE_INFINITY;
            let maxRight: number = Number.NEGATIVE_INFINITY;
            let maxBottom: number = Number.NEGATIVE_INFINITY;

            for (const seg of segments) {
                const left: number = !isNullOrUndefined(seg.Left) ? seg.Left : !isNullOrUndefined(seg.left) ?
                    seg.left : !isNullOrUndefined(seg.x) ? seg.x : 0;
                const top: number = !isNullOrUndefined(seg.Top) ? seg.Top : !isNullOrUndefined(seg.top) ?
                    seg.top : !isNullOrUndefined(seg.y) ? seg.y : 0;
                const right: number = !isNullOrUndefined(seg.Right) ? seg.Right :
                    (left + (!isNullOrUndefined(seg.Width) ? seg.Width : (!isNullOrUndefined(seg.width) ? seg.width : 0)));
                const bottom: number = !isNullOrUndefined(seg.Bottom) ? seg.Bottom :
                    (top + (!isNullOrUndefined(seg.Height) ? seg.Height : (!isNullOrUndefined(seg.height) ? seg.height : 0)));

                minLeft = Math.min(minLeft, left);
                minTop = Math.min(minTop, top);
                maxRight = Math.max(maxRight, right);
                maxBottom = Math.max(maxBottom, bottom);
            }
            return { left: minLeft, top: minTop, width: Math.max(0, maxRight - minLeft), height: Math.max(0, maxBottom - minTop) };
        }
        return { left: 0, top: 0, width: 0, height: 0 };
    }

    // To update the collections for the non-rendered pages.
    private updateCollectionForNonRenderedPages(annotation: AnnotationsInternal, id: string, pageIndex: number): AnnotationsInternal{
        let collections: AnnotationsInternal;
        const annotationCollection: AnnotationsInternal[] = this.pdfViewer.annotationCollection;
        if (annotationCollection.length) {
            const collectionDetails: AnnotationsInternal[] = annotationCollection.filter(function (annotCollection: any): boolean {
                return annotCollection.annotationId === id;
            });
            collections = collectionDetails[0];
            this.updateAnnotationCollection(collectionDetails[0]);
        }
        const annotationType: string = this.getTypeOfAnnotation(annotation);
        const collection: any = this.pdfViewerBase.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)];
        if (collection[`${annotationType}`].length) {
            for (let x: number = 0; x < collection[`${annotationType}`].length; x++) {
                if (collection[`${annotationType}`][parseInt(x.toString(), 10)].AnnotName === annotation.annotationId) {
                    const type: any = collection[`${annotationType}`][parseInt(x.toString(), 10)];
                    this.removedDocumentAnnotationCollection.push(type);
                    collection[`${annotationType}`].splice(x, 1);
                    break;
                }
            }
        }
        return collections;
    }

    // To get the annotation type to update the document Annotation collections
    private getTypeOfAnnotation(annotation: AnnotationsInternal): string {
        let annotationType: string;
        if (annotation.id && annotation.id.toLowerCase() === 'shape') {
            annotationType = 'shapeAnnotation';
        }
        else if (annotation.id && annotation.id.toLowerCase() === 'measure') {
            annotationType = 'measureShapeAnnotation';
        }
        else if (annotation.id && annotation.id.toLowerCase() === 'freetext') {
            annotationType = 'freeTextAnnotation';
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === 'textmarkup') {
            annotationType = 'textMarkupAnnotation';
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === 'stamp') {
            annotationType = 'stampAnnotations';
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === 'ink') {
            annotationType = 'signatureInkAnnotation';
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === 'link') {
            annotationType = 'linkAnnotation';
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === 'sticky') {
            annotationType = 'stickyNotesAnnotation';
        }
        return annotationType;
    }

    // To remove the commnet panel div
    private removeCommentPanelDiv(removeDiv: HTMLElement): void {
        if (removeDiv) {
            if (removeDiv.parentElement.childElementCount === 1) {
                this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
            }
            else {
                removeDiv.remove();
            }
        }
    }

    /**
     * Clear the annotation selection.
     *
     * @returns {void}
     */
    public clearSelection(): void {
        if (this.textMarkupAnnotationModule && this.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            this.textMarkupAnnotationModule.clearCurrentSelectedAnnotation();
            this.textMarkupAnnotationModule.clearCurrentAnnotationSelection(this.textMarkupAnnotationModule.selectTextMarkupCurrentPage);
        } else {
            if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.annotations[0]) {
                const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
                this.pdfViewer.clearSelection(currentAnnotation.pageIndex);
            } else {
                this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {number} - number
     */
    public getAnnotationTop(annotation: any): number {
        if (annotation.rect && (annotation.rect.Top || annotation.rect.top)) {
            return annotation.rect.Top || annotation.rect.top;
        } else {
            return annotation.bounds[0].Top || annotation.bounds[0].top;
        }
    }

    /**
     * @param {any} annotation - annotation
     * @returns {number} - number
     */
    private getAnnotationLeft(annotation: any): number {
        if (annotation.rect) {
            if (annotation.rect.Left) {
                return annotation.rect.Left;
            } else {
                return annotation.rect.left;
            }
        } else {
            if (annotation.bounds[0].Left) {
                return annotation.bounds[0].Left;
            } else {
                return annotation.bounds[0].left;
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public selectAnnotationFromCodeBehind(): void {
        if (this.isAnnotationSelected && this.selectAnnotationId) {
            const annotation: AnnotationsInternal = this.getAnnotationsFromAnnotationCollections(this.selectAnnotationId);
            const id: string = this.selectAnnotationId;
            const pageIndex: number = annotation.pageNumber;
            const currentSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            if (annotation && (this.annotationPageIndex >= 0) && this.annotationPageIndex === pageIndex) {
                if (this.previousIndex) {
                    this.pdfViewer.clearSelection(this.previousIndex);
                }
                this.pdfViewer.clearSelection(pageIndex);
                this.previousIndex = pageIndex;
                if (annotation.shapeAnnotationType === 'textMarkup') {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageIndex, true);
                    const canvasId: string = annotation.textMarkupAnnotationType === 'Highlight' ? '_blendAnnotationsIntoCanvas_' : '_annotationCanvas_';
                    const canvas: HTMLElement = (canvasId === '_blendAnnotationsIntoCanvas_') ? this.pdfViewerBase.getElement(canvasId + pageIndex) :
                        this.pdfViewerBase.getAnnotationCanvas(canvasId, pageIndex);
                    const textMarkupAnnotation: any = this.getTextMarkupAnnotations(pageIndex, annotation);
                    if (textMarkupAnnotation) {
                        this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                        this.textMarkupAnnotationModule.isSelectedAnnotation = true;
                        this.textMarkupAnnotationModule.showHideDropletDiv(true);
                        this.textMarkupAnnotationModule.annotationClickPosition = null;
                        this.textMarkupAnnotationModule.selectAnnotation(textMarkupAnnotation as ITextMarkupAnnotation, canvas, pageIndex);
                        this.textMarkupAnnotationModule.currentTextMarkupAnnotation = textMarkupAnnotation as ITextMarkupAnnotation;
                        this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageIndex;
                        this.textMarkupAnnotationModule.enableAnnotationPropertiesTool(true);
                        this.textMarkupAnnotationModule.isSelectedAnnotation = false;
                        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                            this.pdfViewer.toolbarModule.annotationToolbarModule.
                                showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                        }
                    }
                } else if (annotation.shapeAnnotationType === 'stamp' || annotation.ShapeAnnotationType === 'stamp') {
                    this.pdfViewer.select([annotation.uniqueKey], currentSelector);
                    this.pdfViewer.annotation.onAnnotationMouseDown();
                } else if (annotation.shapeAnnotationType === 'sticky' || annotation.ShapeAnnotationType === 'sticky') {
                    this.pdfViewer.select([annotation.annotationId], currentSelector);
                    this.pdfViewer.annotation.onAnnotationMouseDown();
                } else if (annotation.uniqueKey) {
                    this.pdfViewer.select([annotation.uniqueKey], currentSelector);
                    this.pdfViewer.annotation.onAnnotationMouseDown();
                } else {
                    this.pdfViewer.select([annotation.annotationId], currentSelector);
                    this.pdfViewer.annotation.onAnnotationMouseDown();
                }
                const commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                if (commentElement && commentElement.style.display === 'block') {
                    const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                    if (accordionExpand) {
                        accordionExpand.ej2_instances[0].expandItem(true);
                    }
                    const commentsDiv: any = (this.pdfViewer.element as HTMLElement).querySelector('[id="' + id + '"]');
                    if (commentsDiv) {
                        if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                            commentsDiv.firstChild.click();
                        }
                    }
                }
            }
            this.isAnnotationSelected = false;
            this.selectAnnotationId = null;
            this.annotationPageIndex = null;
        }
    }

    /**
     * Applies or clears comment filters on the annotations.
     * When filters are applied, comments in the panel and/or document are hidden based on the filter criteria.
     * Pass null to clear all active filters and restore visibility of all comments.
     * @param {CommentFilterSettings | null} filterSettings - The filter configuration, or null to clear filters
     * @returns {void}
     * @example
     * // Apply filters
     * pdfViewer.annotation.applyCommentFilter({
     *   type: ['sticky'],
     *   status: 'Answered',
     *   author: ['John Doe']
     * });
     * // Clear filters
     * pdfViewer.annotation.applyCommentFilter(null);
     */
    public applyCommentFilter(filterSettings: CommentFilterSettings | null): void {
        //clear the selector in the annotations
        if (this.pdfViewer && this.pdfViewer.clearSelection) {
            for (let i : number = 0; i < this.pdfViewer.viewerBase.pageCount; i++) {
                this.pdfViewer.clearSelection(i);
            }
        }

        // Clear filters if null
        if (filterSettings === null) {
            this.currentFilterState = null;
            this.newlyAddedAnnotations.clear();
            this.hiddenAnnotationIds.clear();
            this.refreshAllComments();
            for (let i: number = 0; i < this.pdfViewer.viewerBase.pageCount; i++) {
                this.renderAnnotations(i, null, null, null);
            }
            return;
        }

        // If filter is empty (no criteria set), treat it as clearing filters
        if (isFilterEmpty(filterSettings)) {
            this.currentFilterState = null;
            this.newlyAddedAnnotations.clear();
            this.hiddenAnnotationIds.clear();
            this.refreshAllComments();
            for (let i: number = 0; i < this.pdfViewer.viewerBase.pageCount; i++) {
                this.renderAnnotations(i, null, null, null);
            }
            return;
        }

        // Store filter state
        this.currentFilterState = filterSettings;

        // Apply filters to rendering paths
        this.refreshFilteredComments();
        for (let i: number = 0; i < this.pdfViewer.viewerBase.pageCount; i++) {
            this.renderAnnotations(i, null, null, null);
        }
    }

    /**
     * @private
     * Gets the currently active filter settings, or null if no filter is applied.
     * @returns {CommentFilterSettings | null} - The current filter state
     */
    public getCurrentFilterState(): CommentFilterSettings | null {
        return this.currentFilterState;
    }

    /**
     * @private
     * Gets the collection of annotation IDs that are currently hidden due to applied filters.
     * This collection is automatically maintained and updated whenever filters are applied or cleared.
     * When no filters are active, this collection will be empty.
     * @returns {string[]} - Array of annotation IDs for annotations that do not satisfy the active filter conditions
     * ```
     */
    public getHiddenAnnotationIds(): string[] {
        return Array.from(this.hiddenAnnotationIds);
    }

    /**
     * @private
     * Registers an annotation as newly added while filter is active.
     * New annotations bypass filtering to ensure they are always visible.
     * @param {string} annotationName - The annotation name to register
     * @returns {void}
     */
    public registerNewAnnotation(annotationName: string): void {
        if (this.currentFilterState && !isFilterEmpty(this.currentFilterState)) {
            this.newlyAddedAnnotations.add(annotationName);
        }
    }

    /**
     * @private
     * Unregisters an annotation from the newly added set.
     * Called when the annotation is no longer considered "new".
     * @param {string} annotationName - The annotation name to unregister
     * @returns {void}
     */
    public unregisterNewAnnotation(annotationName: string): void {
        this.newlyAddedAnnotations.delete(annotationName);
    }

    /**
     * @private
     * Checks if an annotation was added while filter was active.
     * @param {string} annotationName - The annotation name to check
     * @returns {boolean} - True if the annotation is newly added
     */
    public isNewlyAddedAnnotation(annotationName: string): boolean {
        return this.newlyAddedAnnotations.has(annotationName);
    }

    /**
     * @private
     * Refreshes the filtered view of comments based on current filter state
     * @returns {void}
     */
    private refreshFilteredComments(): void {
        if (!this.currentFilterState) {
            return;
        }
        const predicates: any = buildFilterPredicates(this.currentFilterState);

        // Apply filter to comment panel (CSS-based visibility)
        if (this.pdfViewerBase.annotationComments && this.pdfViewerBase.annotationComments.length > 0) {
            this.applyCommentPanelFilter(predicates.commentPredicate);
        }

        // Update the collection of hidden annotation IDs (also clears previous state at the start)
        this.updateHiddenAnnotationIds(predicates.documentPredicate);
    }

    /**
     * @private
     * Restores visibility of all comments (clears filters)
     *  @returns {void}
     */
    private refreshAllComments(): void {
        // Restore all comments in panel
        if (this.pdfViewerBase.annotationComments && this.pdfViewerBase.annotationComments.length > 0) {
            this.applyCommentPanelFilter(() => true); // All pass the filter
        }

        // Clear the collection of hidden annotation IDs when filters are removed
        this.hiddenAnnotationIds.clear();
    }

    /**
     * @private
     * Applies CSS-based filtering to comments in the panel
     * @param {Function} predicate - Function used to determine whether an annotation passes the filter
     * @returns {void}
     */
    private applyCommentPanelFilter(predicate: (annotation: any) => boolean): void {
        // Delegate to StickyNotesAnnotation module for CSS-based filtering
        if (this.stickyNotesAnnotationModule) {
            if (this.currentFilterState && !isFilterEmpty(this.currentFilterState)) {
                this.stickyNotesAnnotationModule.updateCommentPanelWithFilter(this.currentFilterState);
            } else {
                this.stickyNotesAnnotationModule.updateCommentPanelWithoutFilter();
            }
        }
    }

    /**
     * @private
     * Updates the collection of hidden annotation IDs based on the current filter predicate.
     * Iterates through all annotations in the annotationCollection and identifies those
     * that do not satisfy the active filter conditions.
     * @param {function(any): boolean} predicate - The filter predicate function
     * @returns {void}
     */
    private updateHiddenAnnotationIds(predicate: (annotation: any) => boolean): void {
        // Clear previous hidden annotation IDs
        this.hiddenAnnotationIds.clear();

        // Get the complete annotation collection
        const allAnnotations : any[] = this.pdfViewer.annotationCollection;
        if (!allAnnotations || allAnnotations.length === 0) {
            return;
        }

        // Iterate through all annotations and identify hidden ones
        for (let i : number = 0; i < allAnnotations.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const annotation : any = allAnnotations[i];

            // Skip newly added annotations (they should remain visible)
            if (annotation && annotation.annotationId && this.isNewlyAddedAnnotation(annotation.annotationId)) {
                continue;
            }
            // Check if annotation satisfies the filter predicate
            // If it doesn't satisfy the predicate, add it to hidden collection
            if (annotation && annotation.annotationId && !predicate(annotation)) {
                this.hiddenAnnotationIds.add(annotation.annotationId);
            }
        }
    }

    /**
     *
     * @param {number} pageIndex - pageIndex
     * @private
     * @returns {boolean} - boolean
     */
    public findRenderPageList(pageIndex: number): boolean {
        let isRender: boolean = false;
        const pageList: number[] = this.pdfViewerBase.renderedPagesList;
        if (pageList) {
            for (let i: number = 0; i < pageList.length; i++) {
                if (pageList[parseInt(i.toString(), 10)] === pageIndex) {
                    isRender = true;
                    return isRender;
                }
            }
        }
        return isRender;
    }

    private getAnnotationIdFromSignatureCollections(annotationId: string): string {
        const signature: any = this.pdfViewer.signatureCollection.find(
            (item: any) => annotationId === item.annotationId
        );
        return signature ? signature.uniqueKey : annotationId;
    }

    private getAnnotationsFromAnnotationCollections(annotationId: string, annotation?: any): any {
        const collections: AnnotationsInternal[] = this.pdfViewer.annotationCollection;
        if (collections && annotationId) {
            const hasAnnotation: boolean = !isNullOrUndefined(annotation) && typeof annotation === 'object';
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].annotationId === annotationId) {
                    if (!hasAnnotation || collections[parseInt(i.toString(), 10)].pageNumber === annotation.pageNumber) {
                        return collections[parseInt(i.toString(), 10)];
                    }
                }
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 0 && (isNullOrUndefined(annotation) ||
            annotation.shapeAnnotationType !== 'Link')) {
            if (isNullOrUndefined((this.pdfViewer.nameTable as any)[`${annotationId}`])) {
                annotationId = this.getAnnotationIdFromSignatureCollections(annotationId);
            }
            this.pdfViewer.selectedItems.annotations.push((this.pdfViewer.nameTable as any)[`${annotationId}`]);
        }
    }

    private getTextMarkupAnnotations(pageIndex: number, annotation: AnnotationsInternal): IPageAnnotations {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (storeObject) {
            const index: number = this.getPageCollection(storeObject, pageIndex);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                for (let i: number = 0; i < storeObject[parseInt(index.toString(), 10)].annotations.length; i++) {
                    if (storeObject[parseInt(index.toString(), 10)].annotations[parseInt(i.toString(), 10)].annotName ===
                     annotation.annotationId) {
                        return storeObject[parseInt(index.toString(), 10)].annotations[parseInt(i.toString(), 10)];
                    }
                }
                return null;
            }
            return null;
        } else {
            return null;
        }
    }

    /**
     * @param {string} type -string
     * @param {string} measureType - measureType
     * @private
     * @returns {AnnotationType} - type
     */
    public getAnnotationType(type: string, measureType: string): AnnotationType {
        let annotType: AnnotationType;
        if (measureType === '' || isNullOrUndefined(measureType)) {
            switch (type) {
            case 'Line':
                annotType = 'Line';
                break;
            case 'LineWidthArrowHead':
                annotType = 'Arrow';
                break;
            case 'Rectangle':
                annotType = 'Rectangle';
                break;
            case 'Redaction':
                annotType = 'Redaction';
                break;
            case 'Ellipse':
                annotType = 'Circle';
                break;
            case 'Polygon':
                annotType = 'Polygon';
                break;
            case 'Stamp':
                annotType = 'Stamp';
                break;
            case 'Image':
                annotType = 'Image';
                break;
            case 'FreeText':
                annotType = 'FreeText';
                break;
            case 'Ink':
                annotType = 'Ink';
                break;
            case 'StickyNotes':
                annotType = 'StickyNotes';
                break;
            case 'Link':
                annotType = 'Link';
                break;
            }
        } else {
            switch (measureType) {
            case 'Distance':
                annotType = 'Distance';
                break;
            case 'Perimeter':
                annotType = 'Perimeter';
                break;
            case 'Area':
                annotType = 'Area';
                break;
            case 'Radius':
                annotType = 'Radius';
                break;
            case 'Volume':
                annotType = 'Volume';
                break;
            }
        }
        return annotType;
    }

    /**
     * Returns the list of annotation types that support the Cloud border style
     * (`BorderStyle.Cloud`).
     *
     * Cloud borders are applicable only to standalone, shape-based annotations.
     * The supported types are: Rectangle, Polygon, FreeText, Radius, Area,
     * Volume, Perimeter, and the new Cloud annotation type (which is internally
     * represented as a Polygon annotation).
     * @private
     * @returns {AnnotationType[]} - Array of annotation types that support the
     *                                Cloud border style.
     */
    public getSupportedAnnotationTypesForCloudBorder(): AnnotationType[] {
        const supportedTypes: AnnotationType[] = [
            'Rectangle',
            'Polygon',
            'FreeText',
            'Circle',
            'Radius',
            'Area',
            'Volume',
            'Cloud'
        ];
        return supportedTypes;
    }

    /**
     * Returns whether the given annotation type supports the Cloud border style
     * (`BorderStyle.Cloud`).
     *
     * @param {AnnotationType} annotationType - The annotation type to check.
     * @private
     * @returns {boolean} - True if the annotation type supports the Cloud border
     *                      style; otherwise false.
     */
    public isCloudBorderSupported(annotationType: AnnotationType): boolean {
        return this.getSupportedAnnotationTypesForCloudBorder()
            .indexOf(annotationType) !== -1;
    }

    /**
     * Returns the list of annotation types that support the border dash array
     * (`BorderStyle.Dashed`).
     *
     * Cloud borders are applicable only to standalone, shape-based annotations.
     * The supported types are: Rectangle, Polygon, FreeText, Radius, Area,
     * Volume, Perimeter, and the new Cloud annotation type (which is internally
     * represented as a Polygon annotation).
     * @private
     * @returns {AnnotationType[]} - Array of annotation types that support the
     *                                Cloud border style.
     */
    public getSupportedAnnotationTypesForBorderStyle(): AnnotationType[] {
        const supportedTypes: AnnotationType[] = [
            'Line',
            'Arrow',
            'Rectangle',
            'Polygon',
            'Circle',
            'FreeText',
            'Radius',
            'Area',
            'Distance',
            'Volume',
            'Perimeter',
            'Cloud'
        ];
        return supportedTypes;
    }

    /**
     * Returns whether the given annotation type supports the border style
     *
     * @param {AnnotationType} annotationType - The annotation type to check.
     * @private
     * @returns {boolean} - True if the annotation type supports the border style
     *                      style; otherwise false.
     */
    public isBorderStyleSupported(annotationType: AnnotationType): boolean {
        return this.getSupportedAnnotationTypesForBorderStyle()
            .indexOf(annotationType) !== -1;
    }

    /**
     * @param {number} pageNumber - pageNumber
     * @param {string} annotationId - annotationId
     * @private
     * @returns {number} - number
     */
    public getAnnotationIndex(pageNumber: number, annotationId: string): number {
        const pageAnnotationBases: PdfAnnotationBaseModel[] = this.pdfViewer.drawing.getPageObjects(pageNumber);
        let index: number = null;
        for (let i: number = 0; i < pageAnnotationBases.length; i++) {
            if (pageAnnotationBases[parseInt(i.toString(), 10)].id === annotationId) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * @private
     * @returns {void}
     */
    public initializeCollection(): void {
        this.actionCollection = [];
        this.redoCollection = [];
        if (!this.popupNote) {
            this.createNote();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public showCommentsPanel(): void {
        if (this.pdfViewer.enableCommentPanel) {
            const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentPanel) {
                if (commentPanel.style.display === 'none') {
                    commentPanel.style.display = 'block';
                    if (Browser.isDevice && !isBlazor()) {
                        const viewer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerMainContainer');
                        viewer.insertBefore(this.pdfViewerBase.navigationPane.commentPanelContainer,
                                            this.pdfViewer.toolbarModule.toolbarElement);
                    }
                    if (this.pdfViewerBase.navigationPane.commentPanelResizer) {
                        this.pdfViewerBase.navigationPane.commentPanelResizer.style.display = 'block';
                    }
                    this.pdfViewerBase.navigationPane.setCommentPanelResizeIconTop();
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelTextTop();
                    const viewerContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
                    const pageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
                    if (viewerContainer) {
                        if (this.pdfViewer.enableRtl) {
                            viewerContainer.style.left = this.pdfViewerBase.navigationPane.getViewerContainerRight() + 'px';
                        } else {
                            viewerContainer.style.right = this.pdfViewerBase.navigationPane.getViewerContainerRight() + 'px';
                        }
                        viewerContainer.style.width = ((this.pdfViewer.element.clientWidth > 0 ? this.pdfViewer.element.clientWidth : this.pdfViewer.element.offsetWidth) - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - this.pdfViewerBase.navigationPane.getViewerContainerRight()) + 'px';
                        pageContainer.style.width = (viewerContainer.offsetWidth - this.pdfViewerBase.navigationPane.getViewerContainerScrollbarWidth()) + 'px';
                    }
                    this.pdfViewerBase.updateZoomValue();
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                        this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
                    }
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && !isBlazor()) {
                        commentPanel.style.height = this.pdfViewerBase.viewerMainContainer.clientHeight + 'px';
                        if (this.pdfViewer.selectedItems.annotations.length > 0) {
                            const commentDiv: any = (this.pdfViewer.element as HTMLElement).querySelector('[id="' + this.pdfViewer.selectedItems.annotations[0].annotName + '"]');
                            if (commentDiv && commentDiv.lastElementChild.children[1] &&
                                commentDiv.lastElementChild.children[1].ej2_instances) {
                                commentDiv.lastElementChild.children[1].ej2_instances[0].enableEditMode = true;
                                commentDiv.lastElementChild.children[1].ej2_instances[0].dataBind();
                            } else if (commentDiv && commentDiv.lastElementChild.ej2_instances) {
                                commentDiv.lastElementChild.ej2_instances[0].enableEditMode = true;
                                commentDiv.lastElementChild.ej2_instances[0].dataBind();
                                commentDiv.lastElementChild.style.display = 'block';
                                if (commentDiv.lastElementChild.children[1]) {
                                    commentDiv.lastElementChild.children[1].style.display = 'block';
                                }
                            }
                        }
                        if (this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.element.style.display = 'none';
                            if (this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar.element.style.display = 'none';
                            }
                        }
                        if (this.pdfViewer.toolbarModule.redactionToolbarModule &&
                            this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar) {
                            this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar.element.style.display = 'none';
                        }
                    }
                    if (!isNullOrUndefined(this.pdfViewerBase.navigationPane)) {
                        this.pdfViewerBase.navigationPane.calculateCommentPanelWidth();
                    }
                }
            }
        }
    }

    private isRedactionAnnotation(): boolean {
        return this.pdfViewer.annotationCollection.some(
            (annotation: any) => annotation && annotation.shapeAnnotationType === 'Redaction'
        );
    }

    /**
     * @param {number} pageNumber - This is pageNumber
     * @param {number} index - index
     * @param {any} annotation - annotation
     * @param {string} actionString - actionString
     * @param {string} property - property
     * @param {any} node - node
     * @param {any} redo - redo
     * @private
     * @returns {void}
     */
    public addAction(
        pageNumber: number, index: number, annotation: any, actionString: string, property: string,
        node?: any, redo?: any): void {
        // Skip undo/redo for remote updates
        if (this.isApplyingRemoteUpdate) {
            return;
        }
        // A new user action invalidates any pending redo history (unless we are inside undo/redo).
        if (!this.isUndoRedoAction && this.redoCollection && this.redoCollection.length > 0) {
            this.redoCollection = [];
        }
        // The cached appearance image is a raster of the annotation as it was loaded. A style edit
        // invalidates it, so the action snapshot records whether the image was still valid before
        // the edit. The undo snapshot is cloned before the edit, so it already holds the pre-edit
        // value; the redo snapshot is cloned before the edit too, so it is stamped with the
        // current (post-edit) state here.
        if (redo && !isNullOrUndefined(annotation) && isNullOrUndefined(annotation.formFieldAnnotationType)) {
            redo.isAppearanceStale = annotation.isAppearanceStale ? true : false;
        }
        const action: IActionElements = {
            pageIndex: pageNumber, index: index, annotation: annotation,
            action: actionString, modifiedProperty: property, undoElement: node, redoElement: redo
        };
        this.actionCollection.push(action);
        this.updateToolbar();
    }

    /**
     * @private
     * @returns {void}
     */
    public undo(): void {
        const actionObject: IActionElements = this.actionCollection.pop();
        if (actionObject) {
            let shapeType: string = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            this.isUndoAction = true;
            this.isUndoActionImageLoad = true;
            this.currentUndoElement = actionObject.undoElement;
            this.currentRedoElement = actionObject.redoElement;
            this.currentAppearanceAction = actionObject.action;
            switch (actionObject.action) {
            case 'InkPathModified':
                if (this.pdfViewer.annotation.inkAnnotationModule) {
                    const inkModule: InkAnnotation = this.pdfViewer.annotation.inkAnnotationModule;
                    inkModule.restoreInkPathData(
                        actionObject.undoElement as {
                            id: string;
                            data: string;
                            bounds?: any;
                        },
                        actionObject.pageIndex as number
                    );
                }
                break;
            case 'Text Markup Added':
            case 'Text Markup Deleted':
                if (this.textMarkupAnnotationModule) {
                    this.textMarkupAnnotationModule.undoTextMarkupAction(actionObject.annotation, actionObject.pageIndex,
                                                                         actionObject.index, actionObject.action);
                }
                if (!isNullOrUndefined(this.textMarkupAnnotationModule) && this.textMarkupAnnotationModule.isTextMarkupAnnotationMode) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(true);
                }
                else {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(false);
                }
                break;
            case 'Text Markup Property modified':
                if (this.textMarkupAnnotationModule) {
                    actionObject.annotation =
                    this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex,
                                                                           actionObject.index, actionObject.modifiedProperty, true);
                    this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                }
                break;
            case 'Drag':
            case 'Resize':
                if (actionObject.action === 'Resize' && actionObject.undoElement && actionObject.annotation.hasPdfAppearance) {
                    actionObject.annotation.isAppearanceStale = actionObject.undoElement.isAppearanceStale;
                }
                if (!isNullOrUndefined(actionObject.modifiedProperty) && actionObject.modifiedProperty === 'pageNumber') {
                    this.moveAnnotationAcrossPages(actionObject.annotation, actionObject.undoElement, true, false);
                } else {
                    if (!isNullOrUndefined((actionObject.annotation as any).calloutLinesWrapper) && shapeType === 'FreeText') {
                        this.pdfViewerBase.isCalloutResizeAnnotation = true;
                        if (actionObject.action === 'Resize' && !isNullOrUndefined(actionObject.undoElement.vertexPoints)) {
                            this.pdfViewerBase.isCalloutResizeAnnotation = false;
                        }
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                            bounds: actionObject.undoElement.bounds,
                            vertexPoints: actionObject.undoElement.vertexPoints
                        });
                    } else if (isLineShapes(actionObject.annotation)) {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                            bounds: actionObject.undoElement.bounds,
                            vertexPoints: actionObject.undoElement.vertexPoints, leaderHeight: actionObject.undoElement.leaderHeight
                        });
                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.undoElement.bounds });
                    }
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                            actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { notes: actionObject.undoElement.notes });
                        this.isSkipLastAction = true;
                        this.updateCalibrateValues(actionObject.annotation);
                    }
                    if (actionObject.annotation.formFieldAnnotationType) {
                        this.pdfViewer.formDesigner.updateHTMLElement(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    // eslint-disable-next-line no-case-declarations
                    const annotationSelectorSettings: any = cloneObject(actionObject.annotation.annotationSelectorSettings);
                    this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
                    this.pdfViewer.select([actionObject.annotation.id], annotationSelectorSettings);
                    this.isSkipLastAction = false;
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead' ||
                            actionObject.annotation.shapeAnnotationType === 'Radius' || actionObject.annotation.shapeAnnotationType === 'FreeText' || actionObject.annotation.shapeAnnotationType === 'HandWrittenSignature' || actionObject.annotation.shapeAnnotationType === 'SignatureText' || actionObject.annotation.shapeAnnotationType === 'SignatureImage' || actionObject.annotation.shapeAnnotationType === 'Ink' || actionObject.annotation.shapeAnnotationType === 'Stamp') {
                        this.modifyInCollections(actionObject.annotation, 'bounds');
                    }
                    if (actionObject.annotation.shapeAnnotationType === 'Link' && this.PdfLinkAnnotationModule) {
                        // Keep the link store and rendered <a> anchors in sync with the reverted bounds.
                        this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'bounds');
                    }
                    if (actionObject.annotation.shapeAnnotationType === 'Ink' && this.inkAnnotationModule) {
                        const inkNode: any = (this.pdfViewer.nameTable as any)[actionObject.annotation.id];
                        if (inkNode && inkNode.wrapper) {
                            const bounds: any = actionObject.undoElement.bounds;
                            inkNode.wrapper.offsetX = bounds.x;
                            inkNode.wrapper.offsetY = bounds.y;
                            inkNode.wrapper.desiredSize = inkNode.wrapper.actualSize;
                            inkNode.wrapper.bounds.x = bounds.x;
                            inkNode.wrapper.bounds.y = bounds.y;
                            inkNode.wrapper.bounds.width = bounds.width;
                            inkNode.wrapper.bounds.height = bounds.height;
                            inkNode.wrapper.width = bounds.width;
                            inkNode.wrapper.height = bounds.height;
                            inkNode.wrapper.actualSize.width = bounds.width;
                            inkNode.wrapper.actualSize.height = bounds.height;
                            inkNode.wrapper.measure(bounds);
                            inkNode.wrapper.arrange(inkNode.wrapper.desiredSize);
                            this.pdfViewer.drawing.refreshCanvasDiagramLayer(null, inkNode.pageIndex);
                            this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                            this.pdfViewer.select([actionObject.annotation.id], annotationSelectorSettings);
                        }
                    }
                }
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Addition':
                if (this.pdfViewer.readOnlySettings.formFields && actionObject.annotation.formFieldAnnotationType) {
                    break;
                }
                if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                    this.pdfViewer.formDesigner.deleteFormField(actionObject.undoElement.id, false);
                } else {
                    let isAnnotationUpdate: boolean = false;
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' ||
                            shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'shape', null, true);
                        } else {
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'measure', null, true);
                        }
                        isAnnotationUpdate = true;
                        const annotationObject: any = actionObject.annotation;
                        const wrapper: any = annotationObject.wrapper ? annotationObject.wrapper : null;
                        if (wrapper && wrapper.bounds) {
                            actionObject.annotation.bounds = wrapper.bounds;
                        }
                        actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (shapeType === 'Redaction' || shapeType === 'redaction') {
                        isAnnotationUpdate = true;
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(
                            actionObject.annotation, 'Redaction', 'delete', true);
                        actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if ((shapeType === 'Link' || shapeType === 'link') && this.PdfLinkAnnotationModule) {
                        isAnnotationUpdate = true;
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(
                            actionObject.annotation, 'Link', 'delete', true);
                        actionObject.duplicate = this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'delete');
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete', true);
                        this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                        actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                        isAnnotationUpdate = true;
                    }
                    if (shapeType === 'FreeText' || shapeType === 'HandWrittenSignature' ||
                            shapeType === 'SignatureImage' || shapeType === 'SignatureText' || shapeType === 'Ink') {
                        isAnnotationUpdate = true;
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete', true);
                        actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (!isAnnotationUpdate) {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete', true);
                    }
                    this.pdfViewer.clearSelection((!isNullOrUndefined(this.pdfViewerBase.activeElements.activePageID) &&
                    !isNaN(this.pdfViewerBase.activeElements.activePageID)) ?
                        this.pdfViewerBase.activeElements.activePageID : actionObject.annotation.pageIndex);
                    this.pdfViewer.remove(actionObject.annotation);
                    const filteredAnnotations: any = this.pdfViewer.annotationCollection.filter((annotation: any) => {
                        const excludeAnnotation: boolean = annotation.annotationId !== actionObject.annotation.annotName;
                        if (excludeAnnotation) {
                            const removeDiv: HTMLElement = document.getElementById(annotation.annotName);
                            if (removeDiv) {
                                if (removeDiv.parentElement.childElementCount === 1) {
                                    this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                                } else {
                                    removeDiv.parentElement.removeChild(removeDiv);
                                }
                            }
                        }
                        return !excludeAnnotation;
                    });
                    // Trigger annotationRemove event for undo of addition
                    const annotType: AnnotationType = this.getAnnotationType(
                        actionObject.annotation.shapeAnnotationType,
                        actionObject.annotation.measureType
                    );
                    this.pdfViewer.fireAnnotationRemove(
                        actionObject.annotation.pageIndex,
                        actionObject.annotation.annotName,
                        annotType,
                        actionObject.annotation.bounds
                    );
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    this.hideAnnotationPropertiesToolbar();
                    this.showOrHideRedactionIcon();
                    if ((shapeType === 'Link' || shapeType === 'link') && this.PdfLinkAnnotationModule) {
                        this.PdfLinkAnnotationModule.refreshLinkElements(actionObject.annotation.pageIndex);
                    }
                    const removeDiv: HTMLElement = document.getElementById(actionObject.annotation.annotName);
                    if (removeDiv) {
                        if (removeDiv.parentElement.childElementCount === 1) {
                            this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                        } else {
                            removeDiv.parentElement.removeChild(removeDiv);
                        }
                    }
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                        const mobileAnnotationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_propertyToolbar');
                        if (mobileAnnotationToolbar && mobileAnnotationToolbar.children.length > 0) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.toolbarCreated = false;
                            this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                        }
                    }
                }
                break;
            case 'Delete':
                if (this.pdfViewer.readOnlySettings.formFields && actionObject.annotation.formFieldAnnotationType) {
                    break;
                }
                if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                    actionObject.undoElement.bounds.x = actionObject.undoElement.wrapper.bounds.x;
                    actionObject.undoElement.bounds.y = actionObject.undoElement.wrapper.bounds.y;
                    this.pdfViewer.formDesigner.drawFormField(actionObject.undoElement as any);
                } else {
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            shapeType = 'shape';
                            this.shapeAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                        } else {
                            shapeType = 'shape_measure';
                            this.measureAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                        }
                    }
                    if (shapeType === 'Redaction' || shapeType === 'redaction') {
                        this.redactionAnnotationModule.addInCollection(actionObject.annotation.pageIndex,
                                                                       actionObject.undoElement);
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        this.stampAnnotationModule.updateDeleteItems(actionObject.annotation.pageIndex, actionObject.annotation, null,
                                                                     actionObject.action);
                    } else if (shapeType === 'FreeText') {
                        this.freeTextAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                    } else if (shapeType === 'Ink') {
                        this.inkAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                    }
                    else if (shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') {
                        this.pdfViewerBase.signatureModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                    }
                    if (!actionObject.annotation.annotationId) {
                        const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(actionObject.annotation);
                        if ((shapeType === 'FreeText' || addedAnnot.enableShapeLabel) && addedAnnot) {
                            this.pdfViewer.nodePropertyChange(addedAnnot, {});
                        }
                        // Trigger annotationAdd event for undo of deletion
                        const annotationType: string = addedAnnot.shapeAnnotationType;
                        if (addedAnnot && (annotationType !== 'SignatureText' && annotationType !== 'SignatureImage' && annotationType !== 'HandWrittenSignature')) {
                            // this.triggerAnnotationAdd(addedAnnot);
                            this.pdfViewer.annotationModule.triggerAnnotationAddEvent(addedAnnot);
                        }
                    }
                    let formFieldObj: PdfAnnotationBase;
                    if (actionObject.annotation.id) {
                        formFieldObj = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split('_')[0]];
                    }
                    if (formFieldObj != null && (formFieldObj.formFieldAnnotationType === 'SignatureField' || formFieldObj.formFieldAnnotationType === 'InitialField')) {
                        formFieldObj.wrapper.children.push(actionObject.annotation.wrapper.children[0]);
                        if (actionObject.annotation.shapeAnnotationType === 'SignatureText') { formFieldObj.wrapper.children.push(actionObject.annotation.wrapper.children[1]); }
                        const spanElement: Element = document.getElementById(actionObject.annotation.id + '_html_element').children[0].children[0];
                        spanElement.className = 'e-pdfviewer-signatureformfields-signature';
                        const key: string = actionObject.annotation.id.split('_')[0] + '_content';
                        let data: any = null;
                        if (this.pdfViewer.formDesignerModule) {
                            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                        }
                        if (data) {
                            const formFieldsData : any = JSON.parse(data);
                            for (let i: number = 0; i < formFieldsData.length; i++) {
                                if (formFieldsData[parseInt(i.toString(), 10)].Key === key) {
                                    if (actionObject.annotation.shapeAnnotationType === 'SignatureText') {
                                        formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Text';
                                        formFieldsData[parseInt(i.toString(), 10)].FormField.value = actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value =
                                                actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Text';
                                        (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id.split('_')[0]].value = actionObject.annotation.data;
                                        (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)]
                                            .FormField.id].value = actionObject.annotation.data;
                                    } else if (actionObject.annotation.shapeAnnotationType === 'SignatureImage') {
                                        formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Image';
                                        formFieldsData[parseInt(i.toString(), 10)].FormField.value = actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value =
                                                actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Image';
                                        (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id.split('_')[0]].value = actionObject.annotation.data;
                                        (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)]
                                            .FormField.id].value = actionObject.annotation.data;
                                    } else {
                                        formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Path';
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Path';
                                        const collectionData: Object[] = processPathData(actionObject.annotation.data);
                                        const csData: Object[] = splitArrayCollection(collectionData);
                                        formFieldsData[parseInt(i.toString(), 10)].FormField.value = JSON.stringify(csData);
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value =
                                                JSON.stringify(csData);
                                        (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id.split('_')[0]].value = JSON.stringify(csData);
                                        (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)]
                                            .FormField.id].value = JSON.stringify(csData);
                                    }
                                }
                            }
                            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                        }
                    }

                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    this.hideAnnotationPropertiesToolbar();
                    this.showOrHideRedactionIcon();
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                        addAnnotationComments(actionObject.annotation.pageIndex, shapeType, true);
                    if (actionObject.annotation.annotationId) {
                        const removedAnnotationCollection: any =
                        this.removedAnnotationCollection[this.removedAnnotationCollection.length - 1];
                        const annotationType: any = this.getTypeOfAnnotation(removedAnnotationCollection);
                        this.pdfViewer.annotationCollection.push(removedAnnotationCollection);
                        this.removedAnnotationCollection.splice(this.removedAnnotationCollection.length - 1);
                        const pageNumber: number = actionObject.annotation.pageNumber >= 0 ? actionObject.annotation.pageNumber :
                            actionObject.annotation.pageIndex;
                        const restoredDocument: any =
                            this.removedDocumentAnnotationCollection[this.removedDocumentAnnotationCollection.length - 1];
                        this.pdfViewerBase.documentAnnotationCollections[parseInt(pageNumber.toString(), 10)][
                            annotationType as AnnotationCollectionType].push(restoredDocument);
                        this.removedDocumentAnnotationCollection.splice(this.removedDocumentAnnotationCollection.length - 1);
                    }
                }
                break;
            case 'Link Delete':
                // Undo a link annotation deletion: restore the snapshot back into the store and DOM
                if (this.pdfViewer.annotationModule && this.PdfLinkAnnotationModule && actionObject.undoElement) {
                    this.PdfLinkAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                    if (!actionObject.annotation.annotationId) {
                        const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(actionObject.annotation);
                    }
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    this.hideAnnotationPropertiesToolbar();
                    this.showOrHideRedactionIcon();
                    if (!actionObject.annotation.annotationId) {
                        const poppedItem: IPopupAnnotation = this.pdfViewer.annotation.undoCommentsElement.pop();
                        if (poppedItem && poppedItem.shapeAnnotationType === 'Link') {
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateUndoRedoCollections(
                                poppedItem, actionObject.annotation.pageIndex, shapeType);
                            this.pdfViewer.annotationModule.storeAnnotationCollections(poppedItem, actionObject.annotation.pageIndex);
                        }
                    }
                    if (actionObject.annotation.annotationId) {
                        const removeIndex: number = this.removedAnnotationCollection.findIndex(
                            (annotCollection: any) =>
                                annotCollection.annotationId === actionObject.annotation.annotationId
                        );
                        if (removeIndex !== -1) {
                            const annotationType: string = this.getTypeOfAnnotation(this.removedAnnotationCollection[
                                parseInt(removeIndex.toString(), 10)]);
                            this.pdfViewer.annotationCollection.push(this.removedAnnotationCollection[parseInt(
                                removeIndex.toString(), 10)]);
                            this.removedAnnotationCollection.splice(removeIndex, 1);
                            const pageNumber: number = actionObject.annotation.pageNumber >= 0 ?
                                actionObject.annotation.pageNumber : actionObject.annotation.pageIndex;
                            const removedDocumentAnnotationIndex: number =
                                this.removedDocumentAnnotationCollection.findIndex(
                                    (annotCollection: any) => annotCollection.AnnotName === actionObject.annotation.annotationId);
                            if (removedDocumentAnnotationIndex !== -1) {
                                const restoredDocument: any =
                                    this.removedDocumentAnnotationCollection[
                                        parseInt(removedDocumentAnnotationIndex.toString(), 10)];
                                this.pdfViewerBase.documentAnnotationCollections[parseInt(pageNumber.toString(), 10)][
                                    annotationType as AnnotationCollectionType].push(restoredDocument);
                                this.removedDocumentAnnotationCollection.splice(removedDocumentAnnotationIndex, 1);
                            }
                        }
                    }
                    // Re-render the clickable <a> link elements after restoring the annotation;
                    const pageDiv: HTMLElement = document.getElementById(
                        this.pdfViewer.element.id + '_pageDiv_' + actionObject.annotation.pageIndex);
                    if (pageDiv && this.PdfLinkAnnotationModule) {
                        this.PdfLinkAnnotationModule.refreshLinkElements(actionObject.annotation.pageIndex);
                    }
                }
                break;
            case 'Link url':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { url: actionObject.undoElement.url });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'url');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'Link DestinationPageIndex':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { destinationPageIndex:
                    actionObject.undoElement.destinationPageIndex });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'destinationPageIndex');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'Link zoomValue':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { zoomValue: actionObject.undoElement.zoomValue });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'zoomValue');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'Link DestinationLocation':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { destinationLocation:
                    actionObject.undoElement.destinationLocation });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'destinationLocation');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'RedactionPropertyChange':
                if (actionObject.undoElement && actionObject.undoElement.shapeAnnotationType === 'Redaction') {
                    if (this.pdfViewer.annotationModule) {
                        this.pdfViewer.annotationModule.editAnnotation(actionObject.undoElement);
                    }
                }
                break;
            case 'AddRedactPages':
            {
                this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                const duplicateAnotations: PdfAnnotationBase[] = [];
                for (let i: number = actionObject.annotation.length - 1; i >= 0; i--) {
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(
                        actionObject.annotation[i as number], 'Redaction', 'delete', true);
                }
                for (let i: number = 0; i < actionObject.annotation.length; i++) {
                    const newAnnotationObject: PdfAnnotationBase = actionObject.annotation[i as number];
                    const pageIndex: number = newAnnotationObject.pageIndex !== undefined ?
                        newAnnotationObject.pageIndex : 0;
                    duplicateAnotations.push(this.modifyInCollections(newAnnotationObject, 'delete'));
                    this.pdfViewer.remove(newAnnotationObject);
                    this.showOrHideRedactionIcon();
                    this.pdfViewer.renderDrawing(null, pageIndex);
                }
                actionObject.duplicate = duplicateAnotations;
                for (let i: number = actionObject.annotation.length - 1; i >= 0; i--) {
                    const removeDiv: HTMLElement = document.getElementById(actionObject.annotation[i as number].annotName);
                    if (removeDiv) {
                        if (removeDiv.parentElement.childElementCount === 1) {
                            this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                        } else {
                            removeDiv.parentElement.removeChild(removeDiv);
                        }
                    }
                }
                break;
            }
            case 'stampOpacity':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.undoElement.opacity });
                this.modifyInCollections(actionObject.annotation, 'opacity');
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, true);
                break;
            case 'Shape Stroke':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { strokeColor: actionObject.undoElement.strokeColor });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'stroke');
                }
                else{
                    this.modifyInCollections(actionObject.annotation, 'stroke');
                }
                this.triggerAnnotationPropChange(actionObject.annotation, false, true, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Shape Fill':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { fillColor: actionObject.undoElement.fillColor });
                this.modifyInCollections(actionObject.annotation, 'fill');
                this.triggerAnnotationPropChange(actionObject.annotation, true, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Shape Opacity':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.undoElement.opacity });
                if (actionObject.annotation.shapeAnnotationType === 'StickyNotes') {
                    this.stickyNotesAnnotationModule.updateOpacityValue(actionObject.annotation);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    actionObject.annotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                }else if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'opacity');
                }else {
                    this.modifyInCollections(actionObject.annotation, 'opacity');
                }
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, true);
                this.pdfViewer.renderDrawing();
                break;
            case 'Shape Thickness':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { thickness: actionObject.undoElement.thickness });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'thickness');
                }
                else {
                    this.modifyInCollections(actionObject.annotation, 'thickness');
                }
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, true, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Border Style':
            case 'Border DashArray':
            case 'Cloud Intensity':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                    borderStyle: actionObject.undoElement.borderStyle,
                    borderDashArray: actionObject.undoElement.borderDashArray,
                    cloudIntensity: actionObject.undoElement.cloudIntensity
                });
                this.modifyInCollections(actionObject.annotation, 'borderStyle');
                this.modifyInCollections(actionObject.annotation, 'dashArray');
                this.modifyInCollections(actionObject.annotation, 'cloudIntensity');
                this.pdfViewer.renderDrawing();
                break;
            case 'Line properties change':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                    fillColor: actionObject.undoElement.fillColor, borderDashArray: actionObject.undoElement.borderDashArray,
                    borderStyle: actionObject.undoElement.borderStyle,
                    strokeColor: actionObject.undoElement.strokeColor, opacity: actionObject.undoElement.opacity,
                    thickness: actionObject.undoElement.thickness,
                    sourceDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadStart),
                    taregetDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadEnd)
                });
                this.updateCollectionForLineProperty(actionObject.annotation);
                this.triggerAnnotationPropChange(actionObject.annotation, true, true, true, true, true, true, true);
                this.pdfViewer.renderDrawing();
                break;
            case 'Text Property Added':
                actionObject.annotation = this.pdfViewer.annotationModule.
                    stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                actionObject.annotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Comments Property Added':
                actionObject.annotation = this.pdfViewer.annotationModule.
                    stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Status Property Added':
                actionObject.annotation = this.pdfViewer.annotationModule.
                    stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Comments Reply Deleted':
                actionObject.annotation = this.pdfViewer.annotationModule.
                    stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'dynamicText Change':
                this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                actionObject.annotation.dynamicText = actionObject.undoElement.dynamicText;
                if (this.pdfViewer.selectedItems.annotations[0]) {
                    this.pdfViewer.selectedItems.annotations[0].dynamicText = actionObject.undoElement.dynamicText;
                }
                this.pdfViewer.annotationModule.
                    stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                this.modifyInCollections(actionObject.annotation, 'dynamicText');
                if (this.pdfViewer.selectedItems.annotations[0]) {
                    this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], {});
                } else {
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, {});
                }
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                break;
            case 'fontColor':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { fontColor: actionObject.undoElement.fontColor });
                this.modifyInCollections(actionObject.annotation, 'fontColor');
                this.triggerAnnotationPropChange(actionObject.annotation, true, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'fontSize':
                this.isFreeTextFontsizeChanged = true;
                this.modifyFontSize(actionObject.undoElement.fontSize, false, actionObject.annotation);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'fontFamily':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { fontFamily: actionObject.undoElement.fontFamily });
                this.modifyInCollections(actionObject.annotation, 'fontFamily');
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'textAlign':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { textAlign: actionObject.undoElement.textAlign });
                this.modifyInCollections(actionObject.annotation, 'textAlign');
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'textPropertiesChange':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { font: actionObject.undoElement.font });
                this.modifyInCollections(actionObject.annotation, 'textPropertiesChange');
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Rotate':
                this.pdfViewer.nodePropertyChange(actionObject.annotation,
                                                  {
                                                      bounds: actionObject.undoElement.bounds,
                                                      rotateAngle: actionObject.undoElement.rotateAngle
                                                  });
                this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                // eslint-disable-next-line no-case-declarations
                const stampAnnotationSelectorSettings: any = cloneObject(actionObject.annotation.annotationSelectorSettings);
                this.pdfViewerBase.updateSelector(stampAnnotationSelectorSettings, shapeType);
                this.pdfViewer.select([actionObject.annotation.id], stampAnnotationSelectorSettings);
                this.modifyInCollections(actionObject.annotation, 'bounds');
                this.pdfViewer.renderDrawing();
                break;
            case 'FormDesigner Properties Change':
                if (this.pdfViewer.readOnlySettings.formFields) {
                    break;
                }
                // I5: per-slot button action delta — replay only the slot that changed, not
                // the entire field. The modifiedProperty carries 'buttonAction:<slot>' and the
                // undoElement holds the previous per-slot snapshot.
                if (actionObject.modifiedProperty &&
                    actionObject.modifiedProperty.indexOf('buttonAction:') === 0 &&
                    this.pdfViewer.formDesignerModule) {
                    this.pdfViewer.formDesignerModule.applyButtonActionSlotDelta(
                        actionObject.annotation,
                        actionObject.undoElement
                    );
                    break;
                }
                if (actionObject.undoElement && actionObject.undoElement.isMultiline !== actionObject.redoElement.isMultiline) {
                    this.undoRedoMultiline(actionObject.undoElement);
                }
                this.updateFormFieldPropertiesChanges(actionObject.undoElement.formFieldAnnotationType, actionObject.undoElement);
                break;
            case 'FormField Value Change':
                if (this.pdfViewer.readOnlySettings.formFields) {
                    break;
                }
                if (actionObject.annotation.formFieldAnnotationType) {
                    if (actionObject.annotation.formFieldAnnotationType === 'RadioButton') {
                        this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.undoElement, false);
                        this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.redoElement, true);
                    }
                    else {
                        this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType,
                                                        actionObject.annotation, actionObject.undoElement);
                    }
                } else {
                    const spanElement: Element = document.getElementById(actionObject.annotation.id + '_html_element').children[0].children[0];
                    spanElement.className = 'e-pdfviewer-signatureformfields';
                    const formFieldObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split('_')[0]];
                    const annotationObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id];
                    if (actionObject.annotation.annotName === 'SignatureField' || actionObject.annotation.annotName === 'SignatureText') {
                        actionObject.annotation.bounds = annotationObj.wrapper.bounds;
                    }
                    formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.indexOf(annotationObj.wrapper.children[0]), 1);
                    if (actionObject.annotation.shapeAnnotationType === 'SignatureText') { formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.indexOf(annotationObj.wrapper.children[1]), 1); }
                    const key: string = actionObject.annotation.id.split('_')[0] + '_content';
                    let data: any = null;
                    if (this.pdfViewer.formDesignerModule) {
                        data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                    }
                    if (data) {
                        const formFieldsData: any = JSON.parse(data);
                        for (let i: number = 0; i < formFieldsData.length; i++) {
                            if (formFieldsData[parseInt(i.toString(), 10)].Key === key) {
                                formFieldsData[parseInt(i.toString(), 10)].FormField.value = '';
                                formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = '';
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = '';
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = '';
                            }
                        }

                        this.pdfViewer.remove(actionObject.annotation);
                        this.pdfViewer.renderDrawing();
                        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                    }
                }
            }
            this.redoCollection.push(actionObject);
            this.updateToolbar();
            this.isUndoRedoAction = false;
            this.isUndoAction = false;
            this.pdfViewerBase.isCalloutResizeAnnotation = false;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public redo(): void {
        const actionObject: IActionElements = this.redoCollection.pop();
        if (actionObject) {
            const annotationObject : any = (this.pdfViewer.nameTable as any)[actionObject.annotation.id];
            let shapeType: string = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            this.currentUndoElement = actionObject.undoElement;
            this.currentRedoElement = actionObject.redoElement;
            this.currentAppearanceAction = actionObject.action;
            switch (actionObject.action) {
            case 'InkPathModified':
                if (this.pdfViewer.annotation.inkAnnotationModule) {
                    const inkModule: InkAnnotation = this.pdfViewer.annotation.inkAnnotationModule;
                    inkModule.restoreInkPathData(
                        actionObject.redoElement as {
                            id: string;
                            data: string;
                            bounds?: any;
                        },
                        actionObject.pageIndex as number
                    );
                }
                break;
            case 'Text Markup Property modified':
                if (this.textMarkupAnnotationModule) {
                    actionObject.annotation = this.textMarkupAnnotationModule.
                        undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex,
                                               actionObject.index, actionObject.modifiedProperty);
                    this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                }
                break;
            case 'Text Markup Added':
            case 'Text Markup Deleted':
                if (this.textMarkupAnnotationModule) {
                    this.textMarkupAnnotationModule.
                        redoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                }
                if (actionObject.action === 'Text Markup Deleted') {
                    this.modifyInCollections(actionObject.annotation, 'delete');
                }
                this.pdfViewer.toolbar.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(false);
                break;
            case 'Drag':
            case 'Resize':
                if (actionObject.action === 'Resize' && actionObject.redoElement && actionObject.annotation.hasPdfAppearance) {
                    actionObject.annotation.isAppearanceStale = actionObject.redoElement.isAppearanceStale;
                }
                if (!isNullOrUndefined(actionObject.modifiedProperty) && actionObject.modifiedProperty === 'pageNumber') {
                    this.moveAnnotationAcrossPages(actionObject.annotation, actionObject.redoElement, true, false);
                } else {
                    if (!isNullOrUndefined((annotationObject as any).calloutLinesWrapper) && shapeType === 'FreeText') {
                        this.pdfViewerBase.isCalloutResizeAnnotation = true;
                        if (actionObject.action === 'Resize' && !isNullOrUndefined(actionObject.redoElement.vertexPoints)) {
                            this.pdfViewerBase.isCalloutResizeAnnotation = false;
                        }
                        this.pdfViewer.nodePropertyChange(annotationObject, {
                            bounds: actionObject.redoElement.bounds,
                            vertexPoints: actionObject.redoElement.vertexPoints
                        });
                    } else if (isLineShapes(actionObject.annotation)) {
                        this.pdfViewer.nodePropertyChange(
                            annotationObject, { bounds: actionObject.redoElement.bounds, vertexPoints:
                                actionObject.redoElement.vertexPoints, leaderHeight: actionObject.redoElement.leaderHeight });
                    } else {
                        this.pdfViewer.nodePropertyChange(annotationObject, { bounds: actionObject.redoElement.bounds });
                    }
                    if (annotationObject && ((annotationObject.type === 'Redaction') || (annotationObject.shapeAnnotationType === 'Redaction'))) {
                        this.pdfViewer.annotationModule.redactionOverlayTextModule.removeRedactionOverlayText(
                            annotationObject);
                    }
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                            actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(annotationObject, { notes: actionObject.redoElement.notes });
                        this.isSkipLastAction = true;
                        this.updateCalibrateValues(annotationObject);
                    }
                    if (actionObject.annotation.formFieldAnnotationType) {
                        this.pdfViewer.formDesigner.updateHTMLElement(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    // eslint-disable-next-line no-case-declarations
                    const annotationSelectorSettings: any = cloneObject(actionObject.annotation.annotationSelectorSettings);
                    this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
                    this.pdfViewer.select([annotationObject.id], annotationSelectorSettings);
                    this.isSkipLastAction = false;
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead'
                            || actionObject.annotation.shapeAnnotationType === 'Radius' || actionObject.annotation.shapeAnnotationType === 'FreeText' || actionObject.annotation.shapeAnnotationType === 'HandWrittenSignature' || actionObject.annotation.shapeAnnotationType === 'SignatureText' || actionObject.annotation.shapeAnnotationType === 'SignatureImage' || actionObject.annotation.shapeAnnotationType === 'Ink' || actionObject.annotation.shapeAnnotationType === 'Stamp') {
                        this.modifyInCollections(annotationObject, 'bounds');
                    }
                    if (actionObject.annotation.shapeAnnotationType === 'Link' && this.PdfLinkAnnotationModule) {
                        // Keep the link store and rendered <a> anchors in sync with the redone bounds.
                        this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'bounds');
                    }
                }
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Addition':
                if (this.pdfViewer.readOnlySettings.formFields && actionObject.annotation.formFieldAnnotationType) {
                    break;
                }
                if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                    actionObject.redoElement.bounds.x = actionObject.redoElement.wrapper.bounds.x;
                    actionObject.redoElement.bounds.y = actionObject.redoElement.wrapper.bounds.y;
                    this.pdfViewer.formDesigner.drawFormField(actionObject.redoElement as any, null, 'Addition');
                } else {
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            shapeType = 'shape';
                            this.shapeAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        } else {
                            shapeType = 'shape_measure';
                            this.measureAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        }
                    }
                    if (shapeType === 'Redaction' || shapeType === 'redaction') {
                        this.redactionAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                    }
                    if (shapeType === 'FreeText') {
                        this.freeTextAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                    }
                    if (shapeType === 'Link' && this.PdfLinkAnnotationModule) {
                        this.PdfLinkAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        this.pdfViewer.annotationModule.storeAnnotationCollections(actionObject.duplicate,
                                                                                   actionObject.annotation.pageIndex);
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        this.stampAnnotationModule.updateDeleteItems(actionObject.annotation.pageIndex, actionObject.redoElement, null,
                                                                     actionObject.action);
                    }
                    if (shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') {
                        this.pdfViewerBase.signatureModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                    }
                    if (shapeType === 'Ink') {
                        this.inkAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                    }
                    const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(actionObject.annotation);
                    const annotationSelectorSettings: any = cloneObject(actionObject.annotation.annotationSelectorSettings);
                    this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
                    if (shapeType !== 'Link' && shapeType !== 'link') {
                        this.pdfViewer.select([actionObject.annotation.id], annotationSelectorSettings);
                    }
                    if (shapeType === 'FreeText' && addedAnnot
                        && !isNullOrUndefined((addedAnnot as any).calloutLinesWrapper)) {
                        this.pdfViewerBase.isCalloutResizeAnnotation = true;
                        this.pdfViewer.nodePropertyChange(addedAnnot, { vertexPoints: addedAnnot.vertexPoints });
                    } else if ((shapeType === 'FreeText' || addedAnnot.enableShapeLabel) && addedAnnot) {
                        this.pdfViewer.nodePropertyChange(addedAnnot, {});
                    }
                    // Trigger annotationAdd event for redo of addition
                    const annotationType: string = addedAnnot.shapeAnnotationType;
                    if (addedAnnot && (annotationType !== 'SignatureText' && annotationType !== 'SignatureImage' && annotationType !== 'HandWrittenSignature')) {
                        // this.triggerAnnotationAdd(addedAnnot);
                        this.pdfViewer.annotationModule.triggerAnnotationAddEvent(addedAnnot);
                    }
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    if (this.pdfViewer.selectedItems.annotations.length > 0) {
                        this.pdfViewer.viewerBase.showAnnotationPropertiesToolbar(true);
                    } else {
                        this.hideAnnotationPropertiesToolbar();
                    }
                    this.showOrHideRedactionIcon();
                    if ((shapeType === 'Link' || shapeType === 'link') && this.PdfLinkAnnotationModule) {
                        this.PdfLinkAnnotationModule.refreshLinkElements(actionObject.annotation.pageIndex);
                    }
                    if (actionObject.annotation.annotName && shapeType !== 'Link') {
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                            addAnnotationComments(actionObject.annotation.pageIndex, shapeType, false);
                    }
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                        const mobileAnnotationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_propertyToolbar');
                        if (mobileAnnotationToolbar && mobileAnnotationToolbar.children.length > 0) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.toolbarCreated = false;
                            this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                        }
                    }
                }
                break;
            case 'Delete':
                if (this.pdfViewer.readOnlySettings.formFields && actionObject.annotation.formFieldAnnotationType) {
                    break;
                }
                if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                    this.pdfViewer.formDesigner.deleteFormField(actionObject.redoElement.id, false);
                } else {
                    let isUpdate: boolean = false;
                    let sType: string = actionObject.annotation.shapeAnnotationType;
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            sType = 'shape';
                        } else {
                            sType = 'measure';
                        }
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                        isUpdate = true;
                    }
                    if (shapeType === 'Redaction' || shapeType === 'redaction') {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, shapeType, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                        isUpdate = true;
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                        isUpdate = true;
                    }
                    if (shapeType === 'FreeText' || shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (shapeType === 'Ink') {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (!isUpdate) {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                    }
                    let formFieldObj: PdfAnnotationBase;
                    if (actionObject.annotation.id) {
                        formFieldObj = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split('_')[0]];
                    }
                    if (formFieldObj != null && (formFieldObj.formFieldAnnotationType === 'SignatureField' || formFieldObj.formFieldAnnotationType === 'InitialField')) {
                        formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.
                            indexOf(actionObject.annotation.wrapper.children[0]), 1);
                        if (actionObject.annotation.shapeAnnotationType === 'SignatureText')
                        {formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.
                            indexOf(actionObject.annotation.wrapper.children[1]), 1); }
                        const key: string = actionObject.annotation.id.split('_')[0] + '_content';
                        let data: string = null;
                        if (this.pdfViewer.formDesignerModule) {
                            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                        }
                        if (data) {
                            const formFieldsData: any = JSON.parse(data);
                            for (let i: number = 0; i < formFieldsData.length; i++) {
                                if (formFieldsData[parseInt(i.toString(), 10)].Key === key) {
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.value = '';
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = '';
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = '';
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = '';
                                }
                            }
                            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                        }
                    }
                    this.pdfViewer.clearSelection(actionObject.annotation.pageIndex);
                    this.pdfViewer.remove(actionObject.annotation);
                    // Trigger annotationRemove event for redo of deletion
                    const annotType: AnnotationType = this.getAnnotationType(
                        actionObject.annotation.shapeAnnotationType,
                        actionObject.annotation.measureType
                    );
                    this.pdfViewer.fireAnnotationRemove(
                        actionObject.annotation.pageIndex,
                        actionObject.annotation.annotName,
                        annotType,
                        actionObject.annotation.bounds
                    );
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    if (this.pdfViewer.selectedItems.annotations.length > 0) {
                        this.pdfViewer.viewerBase.showAnnotationPropertiesToolbar(true);
                    } else {
                        this.hideAnnotationPropertiesToolbar();
                    }
                    this.showOrHideRedactionIcon();
                    const id: any = actionObject.annotation.annotName ? actionObject.annotation.
                        annotName : actionObject.annotation.annotationId;
                    const removeDiv: HTMLElement = document.getElementById(id);
                    this.removeCommentPanelDiv(removeDiv);
                    if (actionObject.annotation.annotationId) {
                        const collections: any = this.
                            updateCollectionForNonRenderedPages(actionObject.annotation, id, actionObject.annotation.pageIndex);
                        this.undoCommentsElement.push(collections);
                    }
                }
                break;
            case 'Link Delete':
                // Redo a link annotation deletion: re-delete using the stored annotName
                if (this.pdfViewer.annotationModule && this.PdfLinkAnnotationModule && actionObject.annotation) {
                    const id: string = actionObject.annotation.annotName ? actionObject.annotation.
                        annotName : actionObject.annotation.annotationId;
                    let collections: any;
                    const annotationCollection: any = this.pdfViewer.annotationCollection;
                    if (annotationCollection.length) {
                        const collectionDetails: any = annotationCollection.filter((annotCollection: any) =>
                            annotCollection.annotationId === id);
                        collections = collectionDetails[0];
                        this.updateAnnotationCollection(collectionDetails[0]);
                    }
                    if (collections) {
                        this.undoCommentsElement.push(collections);
                    }
                    this.PdfLinkAnnotationModule.modifyInCollection(actionObject.annotation, 'delete');
                    this.pdfViewer.clearSelection(actionObject.annotation.pageIndex);
                    this.pdfViewer.remove(actionObject.annotation);
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    this.hideAnnotationPropertiesToolbar();
                    this.showOrHideRedactionIcon();
                }
                break;
            case 'Link url':
                this.pdfViewer.nodePropertyChange(annotationObject, { url: actionObject.redoElement.url });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'url');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'Link DestinationPageIndex':
                this.pdfViewer.nodePropertyChange(annotationObject, { destinationPageIndex:
                    actionObject.redoElement.destinationPageIndex });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'destinationPageIndex');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'Link zoomValue':
                this.pdfViewer.nodePropertyChange(annotationObject, { zoomValue: actionObject.redoElement.zoomValue });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'zoomValue');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'Link DestinationLocation':
                this.pdfViewer.nodePropertyChange(annotationObject, { destinationLocation: actionObject.redoElement.destinationLocation });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'destinationLocation');
                }
                this.pdfViewer.renderDrawing();
                break;
            case 'RedactionPropertyChange':
                if (actionObject.redoElement && actionObject.redoElement.shapeAnnotationType === 'Redaction') {
                    if (this.pdfViewer.annotationModule) {
                        this.pdfViewer.annotationModule.editAnnotation(actionObject.redoElement);
                    }
                }
                break;
            case 'AddRedactPages':
                for (let i: number = 0; i < actionObject.annotation.length; i++) {
                    const pageIndex: number = actionObject.annotation[i as number].pageIndex !== undefined ?
                        actionObject.annotation[i as number].pageIndex : actionObject.annotation[i as number].pageNumber;
                    const newAnnotationObject: PdfAnnotationBase = actionObject.annotation[i as number];
                    this.redactionAnnotationModule.addInCollection(pageIndex, actionObject.duplicate[i as number]);
                    const addedAnnot: any = this.pdfViewer.add(newAnnotationObject);
                    this.pdfViewer.select([newAnnotationObject.id ]);
                    this.showOrHideRedactionIcon(true);
                    this.pdfViewer.renderDrawing(null, pageIndex);
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                        addAnnotationComments(pageIndex, shapeType, false);
                }
                break;
            case 'stampOpacity':
                this.pdfViewer.nodePropertyChange(annotationObject, { opacity: actionObject.redoElement.opacity });
                this.modifyInCollections(annotationObject, 'opacity');
                this.triggerAnnotationPropChange(annotationObject, false, false, false, true);
                break;
            case 'Shape Stroke':
                this.pdfViewer.nodePropertyChange(annotationObject, { strokeColor: actionObject.redoElement.strokeColor });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'stroke');
                }
                else{
                    this.modifyInCollections(annotationObject, 'stroke');
                }
                this.triggerAnnotationPropChange(annotationObject, false, true, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Shape Fill':
                this.pdfViewer.nodePropertyChange(annotationObject, { fillColor: actionObject.redoElement.fillColor });
                this.modifyInCollections(annotationObject, 'fill');
                this.triggerAnnotationPropChange(annotationObject, true, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Shape Opacity':
                this.pdfViewer.nodePropertyChange(annotationObject, { opacity: actionObject.redoElement.opacity });
                if (actionObject.annotation.shapeAnnotationType === 'StickyNotes') {
                    this.stickyNotesAnnotationModule.updateOpacityValue(annotationObject);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationObject, null, true);
                }
                else if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'opacity');
                }else {
                    this.modifyInCollections(annotationObject, 'opacity');
                }
                this.triggerAnnotationPropChange(annotationObject, false, false, false, true);
                this.pdfViewer.renderDrawing();
                break;
            case 'Shape Thickness':
                this.pdfViewer.nodePropertyChange(annotationObject, { thickness: actionObject.redoElement.thickness });
                if (this.PdfLinkAnnotationModule && actionObject.annotation.shapeAnnotationType === 'Link') {
                    this.PdfLinkAnnotationModule.modifyInCollection(annotationObject, 'thickness');
                }
                else {
                    this.modifyInCollections(annotationObject, 'thickness');
                }
                this.triggerAnnotationPropChange(annotationObject, false, false, true, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Border Style':
            case 'Border DashArray':
            case 'Cloud Intensity':
                this.pdfViewer.nodePropertyChange(annotationObject, {
                    borderStyle: actionObject.redoElement.borderStyle,
                    borderDashArray: actionObject.redoElement.borderDashArray,
                    cloudIntensity: actionObject.redoElement.cloudIntensity
                });
                this.modifyInCollections(annotationObject, 'borderStyle');
                this.modifyInCollections(annotationObject, 'dashArray');
                this.modifyInCollections(annotationObject, 'cloudIntensity');
                this.pdfViewer.renderDrawing();
                break;
            case 'Line properties change':
                this.pdfViewer.nodePropertyChange(annotationObject, {
                    fillColor: actionObject.redoElement.fillColor, strokeColor: actionObject.redoElement.strokeColor,
                    opacity: actionObject.redoElement.opacity, thickness: actionObject.redoElement.thickness,
                    sourceDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadStart),
                    taregetDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadEnd),
                    borderDashArray: actionObject.redoElement.borderDashArray, borderStyle: actionObject.redoElement.borderStyle
                });
                this.updateCollectionForLineProperty(annotationObject);
                this.triggerAnnotationPropChange(annotationObject, true, true, true, true, true, true, true);
                this.pdfViewer.renderDrawing();
                break;
            case 'Text Property Added':
                actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Comments Property Added':
                actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Status Property Added':
                actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    redoAction(actionObject.annotation, actionObject.action);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'Comments Reply Deleted':
                actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    redoAction(actionObject.annotation, actionObject.action);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            case 'dynamicText Change': {
                this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                annotationObject.dynamicText = actionObject.redoElement.dynamicText;
                const annotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
                if (annotation) {
                    annotation.dynamicText = actionObject.redoElement.dynamicText;
                    annotation.bounds.height = actionObject.redoElement.bounds.height;
                }
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationObject, null, true);
                this.modifyInCollections(annotationObject, 'dynamicText');
                if (annotation) {
                    this.pdfViewer.nodePropertyChange(annotation, {});
                } else {
                    this.pdfViewer.nodePropertyChange(annotationObject, {});
                }
                this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                this.pdfViewer.select([annotationObject.id]);
                this.triggerAnnotationPropChange(actionObject.annotation, false, false, false, false);
                break;
            }
            case 'fontColor':
                this.pdfViewer.nodePropertyChange(annotationObject, { fontColor: actionObject.redoElement.fontColor });
                this.modifyInCollections(annotationObject, 'fontColor');
                this.triggerAnnotationPropChange(annotationObject, true, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'fontSize':
                this.isFreeTextFontsizeChanged = true;
                this.modifyFontSize(actionObject.redoElement.fontSize, false, annotationObject);
                this.triggerAnnotationPropChange(annotationObject, false, false, false, false);
                break;
            case 'fontFamily':
                this.pdfViewer.nodePropertyChange(annotationObject, { fontFamily: actionObject.redoElement.fontFamily });
                this.modifyInCollections(annotationObject, 'fontFamily');
                this.triggerAnnotationPropChange(annotationObject, false, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'textAlign':
                this.pdfViewer.nodePropertyChange(annotationObject, { textAlign: actionObject.redoElement.textAlign });
                this.modifyInCollections(annotationObject, 'textAlign');
                this.triggerAnnotationPropChange(annotationObject, false, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'textPropertiesChange':
                this.pdfViewer.nodePropertyChange(annotationObject, { font: actionObject.redoElement.font });
                this.modifyInCollections(annotationObject, 'textPropertiesChange');
                this.triggerAnnotationPropChange(annotationObject, false, false, false, false);
                this.pdfViewer.renderDrawing();
                break;
            case 'Rotate':
                this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.redoElement.bounds,
                    rotateAngle: actionObject.redoElement.rotateAngle });
                this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                // eslint-disable-next-line no-case-declarations
                const stampAnnotationSelectorSettings: any = cloneObject(actionObject.annotation.annotationSelectorSettings);
                this.pdfViewerBase.updateSelector(stampAnnotationSelectorSettings, shapeType);
                this.pdfViewer.select([annotationObject.id], stampAnnotationSelectorSettings);
                this.modifyInCollections(actionObject.annotation, 'bounds');
                this.pdfViewer.renderDrawing();
                break;
            case 'FormDesigner Properties Change':
                if (this.pdfViewer.readOnlySettings.formFields) {
                    break;
                }
                // I5: per-slot button action redo — replay only the slot that changed.
                if (actionObject.modifiedProperty &&
                    actionObject.modifiedProperty.indexOf('buttonAction:') === 0 &&
                    this.pdfViewer.formDesignerModule) {
                    (this.pdfViewer.formDesignerModule as any).applyButtonActionSlotDelta(
                        actionObject.annotation,
                        actionObject.redoElement
                    );
                    break;
                }
                if (actionObject.redoElement && actionObject.undoElement.isMultiline !== actionObject.redoElement.isMultiline) {
                    this.undoRedoMultiline(actionObject.redoElement);
                }
                this.updateFormFieldPropertiesChanges(actionObject.redoElement.formFieldAnnotationType, actionObject.redoElement);
                break;
            case 'FormField Value Change':
                if (this.pdfViewer.readOnlySettings.formFields) {
                    break;
                }
                if (actionObject.annotation.formFieldAnnotationType) {
                    if (actionObject.annotation.formFieldAnnotationType === 'RadioButton') {
                        this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.undoElement, true);
                        this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.redoElement, false);
                    }
                    else {
                        this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType,
                                                        actionObject.annotation, actionObject.redoElement);
                    }
                } else {
                    const spanElement: any = document.getElementById(actionObject.annotation.id + '_html_element').children[0].children[0];
                    spanElement.className = 'e-pdfviewer-signatureformfields-signature';
                    const formFieldObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split('_')[0]];
                    const annotationObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id];
                    formFieldObj.wrapper.children.push(annotationObj.wrapper.children[0]);
                    if (actionObject.annotation.shapeAnnotationType === 'SignatureText')
                    {formFieldObj.wrapper.children.push(annotationObj.wrapper.children[1]); }
                    const key: string = actionObject.annotation.id.split('_')[0] + '_content';
                    let data: any = null;
                    if (this.pdfViewer.formDesignerModule) {
                        data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                    }
                    if (data) {
                        const formFieldsData: any = JSON.parse(data);
                        for (let i: number = 0; i < formFieldsData.length; i++) {
                            if (formFieldsData[parseInt(i.toString(), 10)].Key === key) {
                                if (actionObject.annotation.shapeAnnotationType === 'SignatureText') {
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Text';
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.value = actionObject.annotation.data;
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                        FormField.value = actionObject.annotation.data;
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Text';
                                } else if (actionObject.annotation.shapeAnnotationType === 'SignatureImage') {
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Image';
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.value = actionObject.annotation.data;
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                        FormField.value = actionObject.annotation.data;
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Image';
                                } else {
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Path';
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Path';
                                    const collectionData: Object[] = processPathData(actionObject.annotation.data);
                                    const csData: Object[] = splitArrayCollection(collectionData);
                                    formFieldsData[parseInt(i.toString(), 10)].FormField.value = JSON.stringify(csData);
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                        FormField.value = JSON.stringify(csData);
                                }
                            }
                        }
                        this.pdfViewer.add(actionObject.annotation);
                        const canvass: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', actionObject.pageIndex);
                        this.pdfViewer.renderDrawing(canvass as HTMLCanvasElement, actionObject.pageIndex);
                        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                    }
                }
            }
            if (actionObject.redoElement && actionObject.redoElement.modifiedDate !== undefined &&
                actionObject.annotation && actionObject.annotation.modifiedDate !== undefined) {
                actionObject.annotation.modifiedDate = actionObject.redoElement.modifiedDate;
            }
            this.actionCollection.push(actionObject);
            this.updateToolbar();
            this.isUndoRedoAction = false;
            this.pdfViewerBase.isCalloutResizeAnnotation = false;
        }
    }

    private showOrHideRedactionIcon(isDisable ?: boolean): void {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule) {
            if (this.pdfViewer.selectedItems.annotations.length === 0) {
                this.pdfViewer.toolbarModule.redactionToolbarModule.showHideDeleteIcon(isDisable ? isDisable : false);
            }
            if (this.isRedactionAnnotation() || (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.annotations &&
                this.pdfViewer.selectedItems.annotations.length > 0 &&
                this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Redaction')) {
                this.pdfViewer.toolbarModule.redactionToolbarModule.showHideRedactIcon(true);
            } else {
                this.pdfViewer.toolbarModule.redactionToolbarModule.showHideRedactIcon(false);
            }
        }
    }

    private hideAnnotationPropertiesToolbar(): void {
        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
            this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
            this.pdfViewer.toolbar.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(false);
            this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(false);
            this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(false);
            this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(false);
        }
    }

    private undoRedoMultiline(element: any): void {
        if (element.isMultiline && element.formFieldAnnotationType === 'Textbox') {
            this.pdfViewer.formDesignerModule.renderMultilineText(element, true);
        } else if (element.formFieldAnnotationType === 'Textbox') {
            this.pdfViewer.formDesignerModule.renderTextbox(element, true);
        }
    }

    private updateFormFieldValueChange(formFieldAnnotationType: any, annotation: any, value: any): void {
        //undo redo
        if (Array.isArray(annotation)) {
            annotation.forEach((item: any) => {
                this.updateFormFieldValueChange(formFieldAnnotationType, item, value);
            });
            return;
        }
        if (annotation) {
            const formFieldModel: PdfFormFieldBaseModel = this.pdfViewer.formDesigner.getFormField(annotation.id.split('_')[0]);
            let data: string = null;
            if (this.pdfViewer.formDesignerModule) {
                data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            }
            if (data) {
                const formFieldsData: any = JSON.parse(data);
                const index: number = this.pdfViewer.formDesigner.getFormFiledIndex(annotation.id.split('_')[0]);
                switch (formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                case 'RadioButton':
                case 'DropdownList':
                case 'ListBox': {
                    let inputElement: Element = null;
                    if (document.getElementById(annotation.id.split('_')[0] + '_content_html_element')) {
                        inputElement = document.getElementById(annotation.id.split('_')[0] + '_content_html_element').firstElementChild.firstElementChild;
                    }
                    if (formFieldAnnotationType === 'Textbox' || formFieldAnnotationType === 'PasswordField') {
                        formFieldModel.value = value;
                        this.pdfViewer.formDesigner.updateValuePropertyChange(formFieldModel, inputElement, true, index, formFieldsData);
                    }
                    else if (formFieldAnnotationType === 'RadioButton') {
                        formFieldModel.isSelected = value;
                        if (inputElement) {
                            this.pdfViewer.formDesigner.updateIsSelectedPropertyChange(formFieldModel, inputElement.firstElementChild as
                             IElement, true, index, formFieldsData);
                        }
                    }
                    else if (formFieldAnnotationType === 'DropdownList' || formFieldAnnotationType === 'ListBox') {
                        formFieldModel.selectedIndex = value;
                        formFieldsData[parseInt(index.toString(), 10)].FormField.selectedIndex = value;
                        this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.selectedIndex = value;
                        (this.pdfViewer.nameTable as any)[formFieldsData[parseInt(index.toString(), 10)].Key.split('_')[0]].selectedIndex = value;
                        if (formFieldAnnotationType === 'ListBox') {
                            for (let k: number = 0; k < (inputElement as IElement).options.length; k++) {
                                if (value) {
                                    (inputElement as IElement).options[parseInt(k.toString(), 10)].selected = value.includes(k) ?
                                        true : false;
                                }
                            }
                        }
                        else {
                            (inputElement as IElement).selectedIndex = value;
                        }
                    }
                    break;
                }
                case 'Checkbox': {
                    if (Array.isArray(value)) {
                        for (let s: number = 0; s < value.length; s++) {
                            const fieldItem: any = value[parseInt(s.toString(), 10)];
                            const fieldIndex: number = formFieldsData.findIndex((f: any) => f.Key === fieldItem.Key);
                            if (fieldIndex > -1) {
                                const fieldModel: PdfFormFieldBaseModel = this.pdfViewer.formDesigner.getFormField(fieldItem.id);
                                const checkboxDivElement: any = document.getElementById(fieldItem.id + '_input');
                                if (fieldModel) {
                                    fieldModel.isChecked = fieldItem.isChecked;
                                    this.pdfViewer.formDesigner.updateIsCheckedPropertyChange(
                                        fieldModel,
                                        checkboxDivElement,
                                        true,
                                        fieldIndex,
                                        formFieldsData
                                    );
                                }
                            }
                        }
                    } else {
                        const checkboxDivElement: Element = document.getElementById(annotation.id.split('_')[0] + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
                        formFieldModel.isChecked = value;
                        this.pdfViewer.formDesigner.updateIsCheckedPropertyChange(
                            formFieldModel,
                            checkboxDivElement,
                            true,
                            index,
                            formFieldsData
                        );
                    }
                    break;
                }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                if (this.pdfViewer.formDesignerModule) {
                    this.pdfViewer.formDesignerModule.radioButtonStatus(formFieldModel as IFormFieldSessionData, value, JSON.parse(data));
                }
            }
        }
    }

    private updateFormFieldPropertiesChanges(formFieldAnnotationType: string, element: any): void {
        switch (formFieldAnnotationType) {
        case 'Textbox':
        case 'PasswordField':
            this.pdfViewer.formDesigner.updateTextboxFormDesignerProperties(element, true);
            break;
        case 'Button':
            this.pdfViewer.formDesigner.updateButtonFormDesignerProperties(element, true);
            break;
        case 'Checkbox':
            this.pdfViewer.formDesigner.updateCheckboxFormDesignerProperties(element, true, true);
            break;
        case 'RadioButton':
            this.pdfViewer.formDesigner.updateRadioButtonDesignerProperties(element, true, true);
            break;
        case 'DropdownList':
            this.pdfViewer.formDesigner.updateDropdownFormDesignerProperties(element, true);
            break;
        case 'ListBox':
            this.pdfViewer.formDesigner.updateListBoxFormDesignerProperties(element, true);
            break;
        case 'SignatureField':
        case 'InitialField':
            this.pdfViewer.formDesigner.updateSignatureTextboxProperties(element, true);
            break;
        case 'BarcodeField':
            this.pdfViewer.formDesigner.updateBarcodeFormDesignerProperties(element, true);
            break;
        }
    }

    private updateCollectionForLineProperty(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        this.modifyInCollections(pdfAnnotationBase, 'fill');
        this.modifyInCollections(pdfAnnotationBase, 'stroke');
        this.modifyInCollections(pdfAnnotationBase, 'opacity');
        this.modifyInCollections(pdfAnnotationBase, 'thickness');
        this.modifyInCollections(pdfAnnotationBase, 'dashArray');
        this.modifyInCollections(pdfAnnotationBase, 'startArrow');
        this.modifyInCollections(pdfAnnotationBase, 'endArrow');
    }

    /**
     * @param {boolean} isAnnotationDelete - isAnnotationDelete
     * @private
     * @returns {void}
     */
    public updateToolbar(isAnnotationDelete?: boolean): void {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateUndoRedoButtons();
        }
        if (this.actionCollection && this.actionCollection.length === 0) {
            this.pdfViewerBase.updateDocumentEditedProperty(false);
        } else {
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        if (isAnnotationDelete) {
            //This below lines are commented for the below task -EJ2-61754-IsDocumentEdited API is not Properly working for delete annotations
            //Also refer EJ2-55205-The isDocumentEdited property is False on adding handwritten signature
            // let isEdited: boolean = false;
            // if (this.pdfViewer.annotationCollection && this.pdfViewer.annotationCollection.length > 0 && this.pdfViewer.signatureCollection && this.pdfViewer.signatureCollection.length > 0) {
            //     isEdited = true;
            // }
            // if (!isEdited && this.pdfViewer.isDocumentEdited) {
            this.pdfViewerBase.updateDocumentEditedProperty(true);
            // }
        }
    }

    private createNote(): void {
        this.popupNote = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note', className: 'e-pv-annotation-note', styles: 'display:none' });
        this.popupNoteAuthor = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_author', className: 'e-pv-annotation-note-author' });
        this.popupNote.appendChild(this.popupNoteAuthor);
        this.popupNoteContent = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_content', className: 'e-pv-annotation-note-content' });
        this.popupNote.appendChild(this.popupNoteContent);
        if (this.pdfViewerBase.mainContainer){
            this.pdfViewerBase.mainContainer.appendChild(this.popupNote);
        }
    }

    /**
     * @param {any} event - event
     * @param {string} color - color
     * @param {string} author - author
     * @param {string} note - note
     * @param {string} type - type
     * @private
     * @returns {void}
     */
    public showPopupNote(event: any, color: string, author: string, note: string, type: string): void {
        const mainContainerPosition: DOMRect = this.pdfViewerBase.mainContainer.getBoundingClientRect() as DOMRect;
        const popupNoteClientRect: DOMRect = this.popupNote.getBoundingClientRect() as DOMRect;
        if (author) {
            this.popupNoteAuthor.textContent = author;
        }
        this.popupNoteContent.textContent = note;
        if (type === 'Highlight') {
            this.popupNote.style.backgroundColor = 'rgb(237, 232, 177)';
        } else if (type === 'Underline') {
            this.popupNote.style.backgroundColor = 'rgb(187, 241, 191)';
        } else if (type === 'Strikethrough') {
            this.popupNote.style.backgroundColor = 'rgb(242, 188, 207)';
        } else if (type === 'Squiggly') {
            this.popupNote.style.backgroundColor = 'rgb(242, 188, 207)';
        }
        this.popupNote.style.display = 'block';
        let topPosition: number = (event.pageY - mainContainerPosition.top + 5);
        let leftPosition: number = (event.pageX - mainContainerPosition.left + 5);
        if (leftPosition + popupNoteClientRect.width > mainContainerPosition.width) {
            leftPosition = leftPosition - popupNoteClientRect.width;
        }
        if (topPosition + popupNoteClientRect.height > mainContainerPosition.height) {
            topPosition = topPosition - popupNoteClientRect.height;
        }
        this.popupNote.style.top = topPosition + 'px';
        this.popupNote.style.left = leftPosition + 'px';
    }

    /**
     * @private
     * @returns {void}
     */
    public hidePopupNote(): void {
        if (this.popupNote) {
            this.popupNote.style.display = 'none';
        }
    }

    private createTextMarkupPopup(): void {
        const elementId: string = this.pdfViewer.element.id;
        this.popupElement = createElement('div', { id: elementId + '_popup_annotation_note', className: 'e-pv-annotation-popup-menu', styles: 'display:none' });
        const headerElement: HTMLElement = createElement('div', { id: elementId + '_popup_header', className: 'e-pv-annotation-popup-header' });
        this.authorPopupElement = createElement('div', { id: elementId + '_popup_author', className: 'e-pv-annotation-popup-author' });
        headerElement.appendChild(this.authorPopupElement);
        const closeBtn: HTMLElement = createElement('span', { id: elementId + '_popup_close', className: 'e-pv-annotation-popup-close e-pv-icon' });
        headerElement.appendChild(closeBtn);
        this.popupElement.appendChild(headerElement);
        this.modifiedDateElement = createElement('div', { id: elementId + '_popup_modified_time', className: 'e-pv-annotation-modified-time' });
        this.popupElement.appendChild(this.modifiedDateElement);
        const contentContainer: HTMLElement = createElement('div', { id: elementId + '_popup_content_container', className: 'e-pv-annotation-popup-note-container' });
        this.noteContentElement = createElement('div', { id: elementId + '_popup_content', className: 'e-pv-annotation-popup-content' });
        (this.noteContentElement as HTMLDivElement).contentEditable = 'true';
        contentContainer.appendChild(this.noteContentElement);
        this.popupElement.appendChild(contentContainer);
        this.pdfViewerBase.viewerContainer.appendChild(this.popupElement);
        closeBtn.addEventListener('click', this.saveClosePopupMenu.bind(this));
        closeBtn.addEventListener('touchend', this.saveClosePopupMenu.bind(this));
        this.popupElement.addEventListener('mousedown', this.onPopupElementMoveStart.bind(this));
        this.popupElement.addEventListener('mousemove', this.onPopupElementMove.bind(this));
        window.addEventListener('mouseup', this.onPopupElementMoveEnd.bind(this));
        this.popupElement.addEventListener('touchstart', this.onPopupElementMoveStart.bind(this));
        this.popupElement.addEventListener('touchmove', this.onPopupElementMove.bind(this));
        window.addEventListener('touchend', this.onPopupElementMoveEnd.bind(this));
        this.noteContentElement.addEventListener('mousedown', () => {
            this.noteContentElement.focus();
        });
    }

    private onPopupElementMoveStart(event: any): void {
        if (event.type === 'touchstart') {
            event = event.changedTouches[0];
        }
        if ((event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            this.isPopupMenuMoved = true;
            const popupElementClientRect: DOMRect = this.popupElement.getBoundingClientRect() as DOMRect;
            this.clientX = event.clientX - popupElementClientRect.left;
            this.clientY = (event.clientY - popupElementClientRect.top) +
            (this.pdfViewerBase.pageSize[this.currentAnnotPageNumber].top * this.pdfViewerBase.getZoomFactor());
        }
    }

    private onPopupElementMove(event: any): void {
        if (event.type === 'touchmove') {
            event = event.changedTouches[0];
        }
        if (this.isPopupMenuMoved && (event.target.id !== (this.noteContentElement.id) ||
        !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            const left: number = (event.clientX - this.clientX) + parseFloat(this.popupElement.style.left);
            const top: number = ((event.clientY - this.clientY) + parseFloat(this.popupElement.style.top));
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            const clientPosition: DOMRect = this.popupElement.getBoundingClientRect() as DOMRect;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
            if (left > parseFloat(pageDiv.style.left) && (left + clientPosition.width) <
            (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                this.popupElement.style.left = (left) + 'px';
            } else {
                this.popupElement.style.left = parseFloat(this.popupElement.style.left) + 'px';
            }
            if (top > parseFloat(pageDiv.style.top) && (top + clientPosition.height) <
            (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
                this.popupElement.style.top = (top) + 'px';
            } else {
                this.popupElement.style.top = parseFloat(this.popupElement.style.top) + 'px';
            }
        }
    }

    private onPopupElementMoveEnd(): void {
        this.isPopupMenuMoved = false;
    }

    private saveClosePopupMenu(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.saveNoteContent(this.currentAnnotPageNumber, this.noteContentElement.innerText);
        }
        this.closePopupMenu();
    }

    /**
     * @private
     * @returns {void}
     */
    public closePopupMenu(): void {
        if (this.popupElement) {
            this.popupElement.parentElement.removeChild(this.popupElement);
            this.popupElement = null;
            this.isPopupNoteVisible = false;
        }
    }

    /**
     * @param {any} event - event
     * @private
     * @returns {void}
     */
    public showAnnotationPopup(event: any): void {
        if (this.textMarkupAnnotationModule) {
            this.currentAnnotPageNumber = this.getEventPageNumber(event);
            if (this.textMarkupAnnotationModule && (event.target !== (this.noteContentElement) ||
            (event.target.contains(this.noteContentElement.childNodes[0])))) {
                this.hidePopupNote();
                if (!this.popupElement) {
                    this.createTextMarkupPopup();
                    this.popupElement.style.display = 'block';
                    this.authorPopupElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.author;
                    this.modifiedDateElement.textContent = this.getProperDate(this.textMarkupAnnotationModule.currentTextMarkupAnnotation.
                        modifiedDate);
                    this.noteContentElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.note;
                    const clientPosition: DOMRect = this.popupElement.getBoundingClientRect() as DOMRect;
                    const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
                    const canvasPosition: DOMRect = pageDiv.getBoundingClientRect() as DOMRect;
                    const topPosition: number = ((event.clientY) - canvasPosition.top) + parseFloat(pageDiv.style.top);
                    const leftPosition: number = (event.clientX);
                    if ((leftPosition + clientPosition.width) > (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                        this.popupElement.style.left = (leftPosition - clientPosition.width) + 'px';
                    } else {
                        this.popupElement.style.left = leftPosition + 'px';
                    }
                    if ((topPosition + clientPosition.height) > (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
                        this.popupElement.style.top = (topPosition - clientPosition.height) + 'px';
                    } else {
                        this.popupElement.style.top = topPosition + 'px';
                    }
                    this.isPopupNoteVisible = true;
                }
            }
        }
    }

    /**
     * @param {any} args - args
     * @param {boolean} isOpacity - isOpacity
     * @private
     * @returns {void}
     */
    public modifyOpacity(args: any, isOpacity?: boolean): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let opacityValue: number = 1;
        if (isOpacity) {
            opacityValue = args / 100;
        } else {
            opacityValue = args.value / 100;
        }
        if (currentAnnotation.opacity !== opacityValue) {
            redoClonedObject.opacity = opacityValue;
            this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: opacityValue });
            if (currentAnnotation.shapeAnnotationType === 'StickyNotes') {
                this.stickyNotesAnnotationModule.updateOpacityValue(currentAnnotation);
            } else {
                this.modifyInCollections(currentAnnotation, 'opacity');
            }
            if (currentAnnotation.status !== 'NewlyAdded') {
                currentAnnotation.status = AnnotationStatus.ExistingModified;
            }
            if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureImage' || currentAnnotation.shapeAnnotationType === 'SignatureText') {
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName,
                                                             currentAnnotation.shapeAnnotationType as AnnotationType, false,
                                                             true, false, clonedObject.opacity, redoClonedObject.opacity);
            } else {
                this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
            }
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
        }
    }

    /**
     * @param {string} currentColor - currentColor
     * @private
     * @returns {void}
     */
    public modifyFontColor(currentColor: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontColor = currentColor;
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.pdfViewer.nodePropertyChange(currentAnnotation, { fontColor: currentColor });
        this.modifyInCollections(currentAnnotation, 'fontColor');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontColor', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param {string} borderStyle - borderStyle
     * @param {number[]} borderDashArray - borderDashArray
     * @param {number} cloudIntensity - cloudIntensity
     * @private
     * @returns {void}
     */
    public modifyBorderStyle(borderStyle: string, borderDashArray: number[], cloudIntensity: number): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        if (borderStyle === 'Cloud') {
            if (clonedObject.borderStyle !== borderStyle) {
                redoClonedObject.borderStyle = 'Cloud';
            }
            if (clonedObject.cloudIntensity !== cloudIntensity) {
                redoClonedObject.cloudIntensity = cloudIntensity;
            }
            redoClonedObject.borderDashArray = [];
        }
        else if (borderStyle === 'Dashed') {
            if (clonedObject.borderStyle !== borderStyle) {
                redoClonedObject.borderStyle = 'Dashed';
            }
            redoClonedObject.cloudIntensity = 0;
            redoClonedObject.borderDashArray = borderDashArray;
        }
        else if (borderStyle === 'Solid') {
            if (clonedObject.borderStyle !== borderStyle) {
                redoClonedObject.borderStyle = 'Solid';
            }
            redoClonedObject.cloudIntensity = 0;
            redoClonedObject.borderDashArray = [];
        }
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.pdfViewer.nodePropertyChange(currentAnnotation, { borderStyle, borderDashArray, cloudIntensity });
        this.modifyInCollections(currentAnnotation, 'dashArray');
        this.modifyInCollections(currentAnnotation, 'borderStyle');
        this.modifyInCollections(currentAnnotation, 'cloudIntensity');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
        if (JSON.stringify(clonedObject.borderDashArray) !== JSON.stringify(redoClonedObject.borderDashArray)
            || clonedObject.borderStyle !== redoClonedObject.borderStyle
            || clonedObject.cloudIntensity !== redoClonedObject.cloudIntensity) {
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Border DashArray', '', clonedObject, redoClonedObject);
        }
        if (currentAnnotation.shapeAnnotationType === 'FreeText' && (currentAnnotation as any).calloutLinesWrapper) {
            const dashString: string = (borderDashArray && borderDashArray.length > 0) ? borderDashArray.toString() : '0';
            const calloutWrapper: any = (currentAnnotation as any).calloutLinesWrapper;
            if (calloutWrapper.children && calloutWrapper.children[0]) {
                calloutWrapper.children[0].style.strokeDashArray = dashString;
            }
            if (currentAnnotation.wrapper && currentAnnotation.wrapper.children && currentAnnotation.wrapper.children[0]) {
                currentAnnotation.wrapper.children[0].style.strokeDashArray = dashString;
            }
            if (this.pdfViewer.drawing && typeof this.pdfViewer.drawing.updateConnector === 'function') {
                this.pdfViewer.drawing.updateConnector(currentAnnotation, currentAnnotation.vertexPoints);
            }
        }
        this.pdfViewer.renderDrawing();
    }

    /**
     * Applies a new Start Arrow style to a Callout annotation. Triggered by the annotation
     * toolbar's Start Arrow dropdown (which is only visible for Callout annotations). Mirrors
     * the dialog `onOkClickedForCallout` apply path for `sourceDecoraterShapes`.
     * @param {DecoratorShapes} newArrow - the picked arrow head style.
     * @private
     * @returns {void}
     */
    public modifyCalloutStartArrow(newArrow: DecoratorShapes): void {
        if (!this.pdfViewer.selectedItems.annotations ||
            this.pdfViewer.selectedItems.annotations.length === 0) {
            return;
        }
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        if (!currentAnnotation || currentAnnotation.shapeAnnotationType !== 'FreeText' ||
            !(currentAnnotation as any).calloutLinesWrapper ||
            !(currentAnnotation as any).calloutLines ||
            (currentAnnotation as any).calloutLines.length === 0) {
            return;
        }
        if (newArrow === currentAnnotation.sourceDecoraterShapes) {
            return;
        }
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const newNode: PdfAnnotationBaseModel = {};
        newNode.sourceDecoraterShapes = newArrow;
        const arrowString: string = this.getArrowString(newArrow);
        redoClonedObject.lineHeadStart = arrowString;
        currentAnnotation.lineHeadStart = arrowString;
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.pdfViewer.nodePropertyChange(currentAnnotation, newNode);
        if (this.pdfViewer.drawing && typeof this.pdfViewer.drawing.updateConnector === 'function') {
            this.pdfViewer.drawing.updateConnector(currentAnnotation, currentAnnotation.vertexPoints);
        }
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false,
                                         true, false, false);
        this.modifyInCollections(currentAnnotation, 'startArrow');
        // Sync the dialog's Start Arrow dropdown so the two surfaces stay in lockstep.
        if (this.startArrowDropDown) {
            const arrowString: string = this.getArrowString(newArrow);
            this.startArrowDropDown.content = this.createContent(arrowString).outerHTML;
        }
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation,
                                            'Line properties change', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param {string} currentValue - currentValue
     * @private
     * @returns {void}
     */
    public modifyFontFamily(currentValue: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontFamily = currentValue;
        if (this.pdfViewer.freeTextSettings.enableAutoFit) {
            this.updateFontFamilyRenderSize(currentAnnotation, currentValue);
        } else {
            this.pdfViewer.nodePropertyChange(currentAnnotation, { fontFamily: currentValue });
        }
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.modifyInCollections(currentAnnotation, 'fontFamily');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontFamily', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param {number} currentValue - currentValue
     * @param {boolean} isInteracted - isInteracted
     * @param {PdfAnnotationBaseModel} annotation annotation object when programmatically updating font size
     * @private
     * @returns {void}
     */
    public modifyFontSize(currentValue: number, isInteracted: boolean, annotation?: PdfAnnotationBaseModel): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        if (isNullOrUndefined(currentAnnotation) && !isNullOrUndefined(annotation)) {
            currentAnnotation = annotation;
        }
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontSize = currentValue;
        const freeTextAnnotation: FreeTextAnnotation = this.freeTextAnnotationModule;
        const x: number = currentAnnotation.bounds.x;
        const y: number = currentAnnotation.bounds.y;
        currentAnnotation.fontSize = currentValue;
        const previousText: string = currentAnnotation.dynamicText;
        if (freeTextAnnotation && !freeTextAnnotation.isNewFreeTextAnnot && currentAnnotation.dynamicText !== '') {
            freeTextAnnotation.addInuptElemet({ x: x, y: y }, currentAnnotation);
            if (currentAnnotation) {
                const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                if (currentAnnotation.previousFontSize !== currentValue) {
                    const previousHeight: number = freeTextAnnotation.inputBoxElement.getBoundingClientRect().height;
                    if (!freeTextAnnotation.inputBoxElement.readOnly) {
                        freeTextAnnotation.inputBoxElement.style.height = freeTextAnnotation.defaultHeight + 'px';
                    }
                    const currentHeight: number = freeTextAnnotation.inputBoxElement.getBoundingClientRect().height;
                    const difference: number = currentHeight - previousHeight;
                    const fontSize: number = parseFloat(freeTextAnnotation.inputBoxElement.style.fontSize);
                    if (((freeTextAnnotation.defaultHeight * zoomFactor) < freeTextAnnotation.inputBoxElement.scrollHeight) &&
                        (Math.ceil(freeTextAnnotation.inputBoxElement.clientHeight) < freeTextAnnotation.inputBoxElement.scrollHeight)) {
                        freeTextAnnotation.inputBoxElement.style.height = freeTextAnnotation.inputBoxElement.readOnly ? freeTextAnnotation.inputBoxElement.style.height : freeTextAnnotation.inputBoxElement.scrollHeight + (fontSize / 2) + 'px';
                        if (parseFloat(freeTextAnnotation.inputBoxElement.style.borderWidth) >= 1) {
                            freeTextAnnotation.inputBoxElement.style.height = parseFloat(freeTextAnnotation.inputBoxElement.style.height) + (parseFloat(freeTextAnnotation.inputBoxElement.style.borderWidth) * 2) + 'px';
                        }
                    }
                } else {
                    freeTextAnnotation.inputBoxElement.style.height = currentAnnotation.bounds.height + 'px';
                }
                let inputEleHeight: number = parseFloat(freeTextAnnotation.inputBoxElement.style.height);
                let inputEleWidth: number = parseFloat(freeTextAnnotation.inputBoxElement.style.width);
                inputEleWidth = ((inputEleWidth) / zoomFactor);
                inputEleHeight = ((inputEleHeight) / zoomFactor);
                let heightDiff: number = (inputEleHeight - currentAnnotation.bounds.height);
                let y: number = undefined;
                if (heightDiff > 0) {
                    y = currentAnnotation.wrapper.offsetY + (heightDiff / 2);
                    y = y > 0 ? y : undefined;
                } else {
                    heightDiff = Math.abs(heightDiff);
                    y = currentAnnotation.wrapper.offsetY - (heightDiff / 2);
                    y = y > 0 ? y : undefined;
                }
                let widthDiff: number = (inputEleWidth - currentAnnotation.bounds.width);
                let x: number = undefined;
                if (widthDiff > 0) {
                    x = currentAnnotation.wrapper.offsetX + (widthDiff / 2);
                    x = x > 0 ? x : undefined;
                } else {
                    widthDiff = Math.abs(widthDiff);
                    x = currentAnnotation.wrapper.offsetX - (widthDiff / 2);
                }
                currentAnnotation.bounds.width = inputEleWidth;
                currentAnnotation.bounds.height = inputEleHeight;
                currentAnnotation.dynamicText = previousText;
                this.pdfViewerBase.isCalloutResizeAnnotation = true;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { fontSize: currentValue, bounds:
                    { width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height, y: y, x: x } });
                this.pdfViewerBase.isCalloutResizeAnnotation = false;
                this.pdfViewer.renderSelector(currentAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
                currentAnnotation.previousFontSize = currentValue;
            }
            if (currentAnnotation.status !== 'NewlyAdded') {
                currentAnnotation.status = AnnotationStatus.ExistingModified;
            }
            this.modifyInCollections(currentAnnotation, 'fontSize');
            this.modifyInCollections(currentAnnotation, 'bounds');
            this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
            if (isInteracted) {
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontSize', '', clonedObject, redoClonedObject);
            }
            freeTextAnnotation.inputBoxElement.blur();
        }
        const canvas: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', currentAnnotation.pageIndex);
        this.pdfViewer.renderDrawing(canvas as HTMLCanvasElement, currentAnnotation.pageIndex);
    }

    /**
     * @param {number} fontSize - font size
     * @private
     * @returns {void}
     */
    public handleFontSizeUpdate(fontSize: number): void {
        // const fontSize: number = parseFloat(size);
        if (this.pdfViewer.selectedItems.annotations.length === 1 && fontSize) {
            if (this.isUndoRedoAction) {
                this.modifyFontSize(fontSize, false);
            }
            else {
                this.modifyFontSize(fontSize, true);
            }
        }
        else if (this.freeTextAnnotationModule) {
            this.pdfViewer.freeTextSettings.fontSize = fontSize;
            this.freeTextAnnotationModule.updateTextProperties();
        }
    }

    /**
     * @param {string} currentValue - currentValue
     * @private
     * @returns {void}
     */
    public modifyTextAlignment(currentValue: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        this.pdfViewer.nodePropertyChange(currentAnnotation, { textAlign: currentValue });
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.modifyInCollections(currentAnnotation, 'textAlign');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param {PdfFontModel} fontInfo - fontInfo
     * @param {string} action - action
     * @private
     * @returns {void}
     */
    public modifyTextProperties(fontInfo: PdfFontModel, action: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        if (action === 'bold') {
            redoClonedObject.font.isBold = fontInfo.isBold;
        } else if (action === 'italic') {
            redoClonedObject.font.isItalic = fontInfo.isItalic;
        } else if (action === 'underline') {
            redoClonedObject.font.isUnderline = fontInfo.isUnderline;
            if (redoClonedObject.font.isUnderline && redoClonedObject.font.isStrikeout) {
                redoClonedObject.font.isStrikeout = false;
            }
        } else if (action === 'strikeout') {
            redoClonedObject.font.isStrikeout = fontInfo.isStrikeout;
            if (redoClonedObject.font.isUnderline && redoClonedObject.font.isStrikeout) {
                redoClonedObject.font.isUnderline = false;
            }
        }
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.pdfViewer.nodePropertyChange(currentAnnotation, { font: fontInfo });
        this.modifyInCollections(currentAnnotation, 'textPropertiesChange');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'textPropertiesChange', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param {number} thicknessValue - thicknessValue
     * @private
     * @returns {void}
     */
    public modifyThickness(thicknessValue: number): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        if (currentAnnotation.thickness !== thicknessValue) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            redoClonedObject.thickness = thicknessValue;
            if (currentAnnotation.status !== 'NewlyAdded') {
                currentAnnotation.status = AnnotationStatus.ExistingModified;
            }
            this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: thicknessValue });
            this.modifyInCollections(currentAnnotation, 'thickness');
            if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName,
                                                             currentAnnotation.shapeAnnotationType as AnnotationType, false, false, true,
                                                             clonedObject.thickness, redoClonedObject.thickness);
            } else {
                this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
            }
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
        }
    }

    /**
     * @param {string} color - color
     * @private
     * @returns {void}
     */
    public modifyStrokeColor(color: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.strokeColor = color;
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: color });
        this.modifyInCollections(currentAnnotation, 'stroke');
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
            this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex,
                                                         currentAnnotation.signatureName,
                                                         currentAnnotation.shapeAnnotationType as AnnotationType,
                                                         true, false, false, clonedObject.strokeColor, redoClonedObject.strokeColor);
        } else {
            this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
        }
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param {string} color -color
     * @private
     * @returns {void}
     */
    public modifyFillColor(color: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fillColor = color;
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], { fillColor: color });
        this.modifyInCollections(currentAnnotation, 'fill');
        this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param {string} dynamicText - dynamicText
     * @param {string} annotName - annotName
     * @param {any} previousValue - gets the previous value of the freetext
     * @private
     * @returns {void}
     */
    public modifyDynamicTextValue(dynamicText: string, annotName: string, previousValue: any): void {
        let currentAnnotation: PdfAnnotationBaseModel = null;
        currentAnnotation = this.pdfViewer.annotations.filter((s: PdfAnnotationBaseModel) => s.annotName === annotName)[0];
        if (currentAnnotation) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            currentAnnotation.dynamicText = dynamicText;
            if (currentAnnotation.status !== 'NewlyAdded') {
                currentAnnotation.status = AnnotationStatus.ExistingModified;
            }
            redoClonedObject.dynamicText = dynamicText;
            if (clonedObject.dynamicText === '') {
                clonedObject.dynamicText = this.freeTextAnnotationModule.previousText;
            }
            this.pdfViewer.nodePropertyChange(currentAnnotation, { dynamicText: dynamicText });
            this.pdfViewer.renderSelector(currentAnnotation.pageIndex, currentAnnotation.annotationSelectorSettings);
            if (clonedObject.dynamicText !== redoClonedObject.dynamicText)
            {
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'dynamicText Change', '', clonedObject, redoClonedObject);
                this.modifyInCollections(currentAnnotation, 'dynamicText');
            }
            const previousText: any = previousValue ? previousValue : this.freeTextAnnotationModule ?
                this.freeTextAnnotationModule.previousText : 'Type Here';
            if (previousText !== currentAnnotation.dynamicText) {
                this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false, false, false, false,
                                                 true, previousText, currentAnnotation.dynamicText);
            }
            this.pdfViewer.renderDrawing();
        }
    }

    /**
     * @param {PdfAnnotationBaseModel} annotationBase - annotationBase
     * @param {string} property - property
     * @private
     * @returns {any} - any
     */
    public modifyInCollections(annotationBase: PdfAnnotationBaseModel, property: string): any {
        let returnObj: any;
        if (annotationBase.measureType === '' || isNullOrUndefined(annotationBase.measureType)) {
            if (annotationBase.shapeAnnotationType === 'FreeText') {
                returnObj = this.freeTextAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'HandWrittenSignature' || annotationBase.shapeAnnotationType === 'SignatureText' || annotationBase.shapeAnnotationType === 'SignatureImage') {
                returnObj = this.pdfViewerBase.signatureModule.
                    modifySignatureCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'Stamp' || annotationBase.shapeAnnotationType === 'Image') {
                returnObj = this.stampAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase, null);
            } else if (annotationBase.shapeAnnotationType === 'Ink') {
                returnObj = this.inkAnnotationModule.modifySignatureInkCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'Redaction') {
                returnObj = this.redactionAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
            } else {
                returnObj = this.shapeAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase, null);
            }
        } else if (annotationBase.measureType === 'Distance' || annotationBase.measureType === 'Perimeter' ||
            annotationBase.measureType === 'Radius' || annotationBase.measureType === 'Area' || annotationBase.measureType === 'Volume') {
            returnObj = this.measureAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
        }
        if (this.isUndoRedoAction) {
            this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, null, true);
            if (this.isUndoAction) {
                annotationBase.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            }
        } else {
            if (property !== 'bounds') {
                this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase);
            }
        }
        if (this.isUndoRedoAction && property !== 'bounds') {
            // Undo restores the pre-edit appearance image, redo keeps the annotation stale.
            const snapshot: any = this.isUndoAction ? this.currentUndoElement : this.currentRedoElement;
            if (snapshot && !isNullOrUndefined(snapshot.isAppearanceStale)) {
                annotationBase.isAppearanceStale = snapshot.isAppearanceStale;
            }
        }
        if (this.isUndoRedoAction && property === 'bounds' && this.currentAppearanceAction === 'Resize') {
            // A resize invalidates the cached appearance image, a move keeps it. Both go
            // through the 'bounds' property, so the recorded action tells them apart.
            const snapshot: any = this.isUndoAction ? this.currentUndoElement : this.currentRedoElement;
            if (snapshot && !isNullOrUndefined(snapshot.isAppearanceStale)) {
                annotationBase.isAppearanceStale = snapshot.isAppearanceStale;
            }
        }
        if (this.isUndoRedoAction && property === 'delete') {
            this.updateAnnotationCollection(annotationBase);
        }
        return returnObj;
    }

    /**
     * @private
     * @returns {void}
     */
    public createPropertiesWindow(): void {
        if (!isBlazor()) {
            const elementID: string = this.pdfViewer.element.id;
            const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_properties_window', className: 'e-pv-properties-window' });
            const appearanceTab: HTMLElement = this.createAppearanceTab();
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            this.propertiesDialog = new Dialog({
                showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Line Properties'),
                target: this.pdfViewer.element, content: appearanceTab, close: () => {
                    this.destroyPropertiesWindow();
                }
            });
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.propertiesDialog.buttons = [
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) },
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) }
                ];
            } else {
                this.propertiesDialog.buttons = [
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
                ];
            }
            if (this.pdfViewer.enableRtl) {
                this.propertiesDialog.enableRtl = true;
            }
            this.propertiesDialog.appendTo(dialogDiv);
            if (this.pdfViewer.selectedItems.annotations[0] &&
                (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' ||
                this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance')) {
                const fillColor: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_properties_fill_color');
                const enableFillColor: boolean = this.isLineAnnotationFillColorEnabled();
                (fillColor as HTMLInputElement).disabled = !enableFillColor;
            }
            this.startArrowDropDown.content = this.
                createContent(this.getArrowString(this.pdfViewer.selectedItems.annotations[0].sourceDecoraterShapes)).outerHTML;
            this.endArrowDropDown.content = this.
                createContent(this.getArrowString(this.pdfViewer.selectedItems.annotations[0].taregetDecoraterShapes)).outerHTML;
            this.thicknessBox.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
            if (this.pdfViewer.selectedItems.annotations[0].measureType !== 'Perimeter') {
                this.fillColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
            }
            else {
                if (this.pdfViewer.selectedItems.annotations[0].wrapper.children[2]) {
                    this.fillColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[2].style.fill;
                }
                else {
                    this.fillColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
                }
            }
            this.refreshColorPicker(this.fillColorPicker);
            this.strokeColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
            this.refreshColorPicker(this.strokeColorPicker);
            this.updateColorInIcon(this.fillDropDown.element, this.fillColorPicker.value);
            this.updateColorInIcon(this.strokeDropDown.element, this.strokeColorPicker.value);
            this.opacitySlider.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
            this.updateOpacityIndicator();
            const strokeDashArray: string | number[] =
                this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray;
            const dashValue: number[] = this.getBorderDashArray(strokeDashArray);
            if (dashValue.toString() === '') {
                this.lineStyleDropDown.content = this.createDropDownContent('solid').outerHTML;
            } else if (dashValue.toString() === '2') {
                this.lineStyleDropDown.content = this.createDropDownContent('dotted').outerHTML;
            }
            else if (!isNullOrUndefined(dashValue.toString())) {
                this.lineStyleDropDown.content = this.createDropDownContent('dashed').outerHTML;
            }
            this.selectedLineStyle = this.pdfViewer.selectedItems.annotations[0].borderStyle;
            this.selectedLineDashArray = dashValue.toString();
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
                this.leaderLengthBox.value = this.pdfViewer.selectedItems.annotations[0].leaderHeight;
            }
        } else {
            const opacityValue: number = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
            const lineStartElement: string = this.getArrowString(this.pdfViewer.selectedItems.annotations[0].sourceDecoraterShapes);
            const lineEndElement: string = this.getArrowString(this.pdfViewer.selectedItems.annotations[0].taregetDecoraterShapes);
            let lineStyleElement: string;
            const strokeDashArray: string | number[] =
                this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray;

            const dashValue: number = Array.isArray(strokeDashArray)
                ? strokeDashArray[0]
                : parseInt(strokeDashArray || '0', 10);
            if (dashValue >= 3) {
                lineStyleElement = 'Dashed';
            } else if (dashValue === 2) {
                lineStyleElement = 'Dotted';
            } else if (dashValue === 0) {
                lineStyleElement = 'Solid';
            }
            this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenPropertiesDialog', opacityValue, lineStartElement, lineEndElement, lineStyleElement);
        }
    }

    /**
     * Resolves the effective border style for an annotation by combining the
     * stored `borderStyle` and `borderDashArray` settings.
     *
     * The `borderDashArray` may arrive as either a `string` (e.g. the
     * canvas-wrapper style value `style.strokeDashArray`, which is the raw
     * CSS-formatted string coming back from the DOM) or a `number[]`
     * (the canonical `BorderDashArray` setting exposed on every `*Settings`
     * class). Both forms are accepted and treated as "dashed" because the
     * caller only needs to know which bucket the border falls into, not the
     * exact pattern.
     *
     * The classifier is intentionally order-sensitive, which is why the
     * conditions short-circuit instead of being aggregated:
     * - Any non-empty `borderDashArray` wins and yields `"Dashed"` so a
     *   single annotation cannot be both Cloud and Dashed at the same time
     *   (per the Cloud Border spec, which marks that combination as out of
     *   scope).
     * - Otherwise the stored `borderStyle` value is inspected. Recognised
     *   values are `"Cloud"` -> `"Cloud"`; anything else falls back to
     *   `"Solid"` so unknown / corrupt values keep the default rendering
     *   rather than producing a blank border.
     *
     * @param {string} borderStyle - Raw value persisted on the annotation.
     * @param {string | number[]} [borderDashArray] - Optional dash pattern.
     *        Empty / missing strings and empty arrays do not force a dashed
     *        border; any non-empty value does.
     * @private
     * @returns {'Solid' | 'Dashed' | 'Cloud'} - The border style to render.
     */
    public getBorderStyle(borderStyle?: string, borderDashArray?: string | number[]): string {
        const hasDash: boolean = (typeof borderDashArray === 'string' && borderDashArray.length > 0) ||
            (Array.isArray(borderDashArray) && borderDashArray.length > 0);
        if (hasDash) {
            return 'Dashed';
        }
        if (borderStyle === 'Cloud') {
            return 'Cloud';
        }
        return 'Solid';
    }

    /**
     * Coerces an incoming `cloudIntensity` value into the supported range
     * used by the Cloud border renderer.
     *
     * Per spec, the published range is `1..2`, but this method defensively
     * snaps arbitrary inputs to a sensible value rather than rejecting them,
     * so callers (settings UI, programmatic `addAnnotation`, undo/redo,
     * import) never end up with an out-of-range value that the renderer has
     * to special-case:
     * - `null` / `undefined` / NaN / negative values are clamped to the
     *   lower bound (`1`).
     * - Values that exceed the upper bound are clamped back to the upper
     *   bound (`2`).
     * - Any value inside `[1, 2]` is passed through unchanged so that the
     *   caller's intent is preserved.
     *
     * @param {number} intensity - Raw `cloudIntensity` value from settings
     *                              or from a programmatic `addAnnotation` call.
     * @private
     * @returns {number} - A valid intensity in the range `[1, 2]`.
     */
    public getCloudIntensity(intensity: number): number {
        if (isNullOrUndefined(intensity) || isNaN(intensity) || intensity < 1) {
            return 1;
        }
        if (intensity > 2) {
            return 2;
        }
        return intensity;
    }

    /**
     * Normalizes a `BorderDashArray` value into a representation suitable for
     * persistence and downstream rendering.
     *
     * This is the inverse direction of `getBorderStyle`'s input handling:
     * while `getBorderStyle` accepts either shape and only cares about
     * "is it dashed", this method returns the canonical on-the-wire form so
     * callers don't have to special-case the two shapes themselves.
     *
     * Behaviour by input shape:
     * - `string` - parsed as a base-10 integer. This matches the
     *   canvas-wrapper `style.strokeDashArray` flow, where the selected line
     *   style is persisted as a single string token (`"0"`, `"2"` for dotted,
     *   `"3"` for dashed, etc.).
     * - non-empty `number[]` - returned as-is, since the array is already in
     *   its canonical form.
     * - empty `number[]`, `null`, `undefined` - returns the `0` default
     *   (no dash), which the renderer interprets as a solid border.
     *
     * @param {number[] | number | string} dashArray - Raw value read from the
     *        annotation wrapper, the selected line style token, or a
     *        programmatic settings payload.
     * @private
     * @returns {number | number[]} - `number[]` when an array was supplied,
     *                                otherwise the parsed `number`. Callers
     *                                that allow non-numeric strings should
     *                                guard against `NaN` via
     *                                `Number.isFinite`.
     */
    public getBorderDashArray(
        dashArray?: number[] | number | string
    ): number[] {
        if (typeof dashArray === 'string') {
            return dashArray
                .trim()
                .replace(/^\[/, '')
                .replace(/\]$/, '')
                .split(/[,\s]+/)
                .filter((value: string): boolean => value.length > 0)
                .map((value: string): number => Number(value))
                .filter((value: number): boolean => Number.isFinite(value));
        }
        if (Array.isArray(dashArray)) {
            return dashArray
                .map((value: number): number => Number(value))
                .filter((value: number): boolean => Number.isFinite(value));
        }
        if (typeof dashArray === 'number' && Number.isFinite(dashArray)) {
            return [dashArray];
        }
        return [];
    }

    //Commented unused method - 878987
    // private updatePropertiesWindowInBlazor(): void {
    //     const thicknessElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_line_thickness');
    //     const fillColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_fill_color_button');
    //     const strokeColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_stroke_color_button');
    //     const leaderLengthElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_leader_length');
    //     thicknessElement.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
    //     fillColorElement.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
    //     strokeColorElement.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
    //     this.onStrokeColorChange(strokeColorElement.value);
    //     this.onFillColorChange(fillColorElement.value);
    //     if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
    //         leaderLengthElement.value = parseInt(this.pdfViewer.selectedItems.annotations[0].leaderHeight.toString(), 10);
    //     }
    // }

    private destroyPropertiesWindow(): void {
        if (this.strokeColorPicker) {
            this.strokeColorPicker.destroy();
            this.strokeColorPicker = null;
        }
        if (this.fillColorPicker) {
            this.fillColorPicker.destroy();
            this.fillColorPicker = null;
        }
        if (this.endArrowDropDown) {
            this.endArrowDropDown.destroy();
            this.endArrowDropDown = null;
        }
        if (this.startArrowDropDown) {
            this.startArrowDropDown.destroy();
            this.startArrowDropDown = null;
        }
        if (this.opacitySlider) {
            this.opacitySlider.destroy();
            this.opacitySlider = null;
        }
        if (this.thicknessBox) {
            this.thicknessBox.destroy();
            this.thicknessBox = null;
        }
        if (this.lineStyleDropDown) {
            this.lineStyleDropDown.destroy();
            this.lineStyleDropDown = null;
        }
        if (this.leaderLengthBox) {
            this.leaderLengthBox.destroy();
            this.leaderLengthBox = null;
        }
        if (this.propertiesDialog) {
            this.propertiesDialog.destroy();
            this.propertiesDialog = null;
        }
        const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_properties_window');
        if (dialogElement) {
            dialogElement.parentElement.removeChild(dialogElement);
        }
    }

    private refreshColorPicker(colorPick: ColorPicker): void {
        colorPick.setProperties({ 'value': colorPick.value }, true);
        colorPick.refresh();
    }

    private createAppearanceTab(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const items: { [key: string]: Object }[] = [{ text: this.pdfViewer.localeObj.getConstant('None') }, { text: this.pdfViewer.localeObj.getConstant('Open Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Closed Arrow') },
            { text: this.pdfViewer.localeObj.getConstant('Round Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Square Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Diamond Arrow') }];
        const appearanceDiv: HTMLElement = createElement('div', { id: elementID + '_properties_appearance' });
        const lineStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-line-style-prop' });
        appearanceDiv.appendChild(lineStyleContainer);
        const lineHeadStartElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Start Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-start', elementID + '_properties_line_start');
        this.startArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-start', select: this.onStartArrowHeadStyleSelect.bind(this) }, (lineHeadStartElement as HTMLButtonElement));
        const lineHeadEndElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('End Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-end', elementID + '_properties_line_end');
        this.endArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-end', select: this.onEndArrowHeadStyleSelect.bind(this) }, (lineHeadEndElement as HTMLButtonElement));
        const borderStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-border-style' });
        appearanceDiv.appendChild(borderStyleContainer);
        const lineStyleElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Style'), borderStyleContainer, 'text', 'button', true, 'e-pv-properties-line-style', elementID + '_properties_line_style');
        const dropDownTarget: HTMLElement = this.createStyleList();
        this.lineStyleDropDown = new DropDownButton({ cssClass: 'e-pv-properties-line-style', target: dropDownTarget }, (lineStyleElement as HTMLButtonElement));
        const thicknessElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Thickness'), borderStyleContainer, 'text', 'input', true, 'e-pv-properties-line-thickness', elementID + '_properties_thickness');
        this.thicknessBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-thickness', min: 0, max: 12 }, (thicknessElement as HTMLInputElement));
        const colorStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-color-style' });
        appearanceDiv.appendChild(colorStyleContainer);
        const fillColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Fill Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-fill-color', elementID + '_properties_fill_color');
        this.fillColorPicker = this.createColorPicker(elementID + '_properties_fill_color', true);
        this.fillColorPicker.change = (args: ColorPickerEventArgs) => {
            const currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.fillDropDown.toggle();
            this.updateColorInIcon(this.fillDropDown.element, currentColor);
        };
        this.fillDropDown = this.createDropDownButton(fillColorElement, 'e-pv-properties-fill-color-icon', this.fillColorPicker.element.parentElement);
        this.fillDropDown.beforeOpen = this.onFillDropDownBeforeOpen.bind(this);
        this.fillDropDown.open = () => {
            this.fillColorPicker.refresh();
        };
        const strokeColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-stroke-color', elementID + '_properties_stroke_color');
        this.strokeColorPicker = this.createColorPicker(elementID + '_properties_stroke_color', false);
        this.strokeColorPicker.change = (args: ColorPickerEventArgs) => {
            const currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.strokeDropDown.toggle();
            this.updateColorInIcon(this.strokeDropDown.element, currentColor);
        };
        this.strokeDropDown = this.createDropDownButton(strokeColorElement, 'e-pv-properties-stroke-color-icon', this.strokeColorPicker.element.parentElement);
        this.strokeDropDown.beforeOpen = this.onStrokeDropDownBeforeOpen.bind(this);
        this.strokeDropDown.open = () => {
            this.strokeColorPicker.refresh();
        };
        const opacityContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-opacity-style' });
        appearanceDiv.appendChild(opacityContainer);
        const opacityElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Opacity'), opacityContainer, '', 'div', true, 'e-pv-properties-line-opacity', elementID + '_properties_opacity');
        this.opacitySlider = new Slider({
            type: 'MinRange', max: 100, min: 0, cssClass: 'e-pv-properties-line-opacity', change: () => {
                this.updateOpacityIndicator();
            }
        }, opacityElement);
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            const lineLengthElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Leader Length'), opacityContainer, 'text', 'input', true, 'e-pv-properties-line-leader-length', elementID + '_properties_leader_length');
            this.leaderLengthBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-leader-length', min: 0, max: 100 }, (lineLengthElement as HTMLInputElement));
        }
        return appearanceDiv;
    }

    /**
     * Creates a content element with the given text.
     *
     * @param {string} text - The content text.
     * @private
     * @returns {HTMLElement} The created content element.
     */
    public createContent(text: string): HTMLElement {
        const divElement: HTMLElement = createElement('div', { className: 'e-pv-properties-line-style-content' });
        divElement.textContent = text;
        return divElement;
    }

    private onStrokeDropDownBeforeOpen(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.strokeColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        }
        this.strokeColorPicker.refresh();
    }

    private onFillDropDownBeforeOpen(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.fillColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        }
        this.fillColorPicker.refresh();
    }

    private createStyleList(): HTMLElement {
        const ulElement: HTMLElement = createElement('ul');
        document.body.appendChild(ulElement);
        const solidLi: HTMLElement = this.createListForStyle('solid');
        solidLi.addEventListener('click', () => {
            this.setThickness('0', 'solid');
        });
        ulElement.appendChild(solidLi);
        const dottedLi: HTMLElement = this.createListForStyle('dotted');
        dottedLi.addEventListener('click', () => {
            this.setThickness('2', 'dotted');
        });
        ulElement.appendChild(dottedLi);
        const dashedLi: HTMLElement = this.createListForStyle('dashed');
        dashedLi.addEventListener('click', () => {
            this.setThickness('3', 'dashed');
        });
        ulElement.appendChild(dashedLi);
        return ulElement;
    }

    private createColorPicker(idString: string, isNoColor: boolean): ColorPicker {
        const inputElement: HTMLElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            inline: true, mode: 'Palette', enableOpacity: false, value: '#000000', showButtons: false, modeSwitcher: false,
            noColor: isNoColor
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    }

    private createDropDownButton(element: HTMLElement, iconClass: string, target: HTMLElement): DropDownButton {
        const dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        return dropDownButton;
    }

    private updateColorInIcon(element: HTMLElement, color: string): void {
        (element.childNodes[0] as HTMLElement).style.borderBottomColor = color;
    }

    public isLineAnnotationFillColorEnabled(): boolean {
        const selectedAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
        if (selectedAnnotation) {
            if (selectedAnnotation.shapeAnnotationType === 'Line' || selectedAnnotation.shapeAnnotationType === 'LineWidthArrowHead' || selectedAnnotation.measureType === 'Distance') {
                if ((selectedAnnotation.sourceDecoraterShapes === 'None' || selectedAnnotation.sourceDecoraterShapes === 'OpenArrow') && (selectedAnnotation.taregetDecoraterShapes === 'None' || selectedAnnotation.taregetDecoraterShapes === 'OpenArrow')) {
                    return false;
                }
                return true;
            } else if (selectedAnnotation.shapeAnnotationType === 'Rectangle' || selectedAnnotation.shapeAnnotationType === 'Ellipse' || selectedAnnotation.shapeAnnotationType === 'Radius' || selectedAnnotation.shapeAnnotationType === 'Polygon') {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @param {string} color - color
     * @private
     * @returns {void}
     */
    public onFillColorChange(color: string): void {
        const colorElement: HTMLDivElement = document.querySelector('#' + this.pdfViewer.element.id + '_properties_fill_color_button');
        if (color !== 'transparent') {
            (colorElement.children[0] as HTMLElement).style.borderBottomColor = color;
        }
    }

    /**
     * @param {string} color - color
     * @private
     * @returns {void}
     */
    public onStrokeColorChange(color: string): void {
        const colorElement: HTMLDivElement = document.querySelector('#' + this.pdfViewer.element.id + '_properties_stroke_color_button');
        if (color !== 'transparent') {
            (colorElement.children[0] as HTMLElement).style.borderBottomColor = color;
        }
    }

    private setThickness(value: string, style: string, isBlazor?: boolean): void {
        if (!isBlazor) {
            this.lineStyleDropDown.content = this.createDropDownContent(style).outerHTML;
        }
        this.selectedLineDashArray = value;
        if (value === '0') {
            this.selectedLineStyle = 'Solid';
        } else if (value === '2' || value === '3') {
            this.selectedLineStyle = 'Dashed';
        }
    }

    private createDropDownContent(style: string): HTMLElement {
        const divElement: HTMLElement = createElement('div', { className: 'e-pv-line-styles-content-container' });
        const spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-content', styles: 'border-bottom-style:' + style });
        divElement.appendChild(spanElement);
        return divElement;
    }

    private createListForStyle(style: string): HTMLElement {
        const liElement: HTMLElement = createElement('li', { className: 'e-menu-item' });
        const divElement: HTMLElement = createElement('div', { className: 'e-pv-line-styles-container' });
        const spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-item', styles: 'border-bottom-style:' + style });
        divElement.appendChild(spanElement);
        liElement.appendChild(divElement);
        return liElement;
    }

    private onStartArrowHeadStyleSelect(args: MenuEventArgs): void {
        this.startArrowDropDown.content = this.createContent(args.item.text).outerHTML;
        this.updateFillColor();
        // Sync the toolbar's Start Arrow dropdown so the two surfaces stay in lockstep.
        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule &&
            typeof this.pdfViewer.toolbar.annotationToolbarModule.updateStartArrowInIcon === 'function' &&
            this.pdfViewer.selectedItems.annotations &&
            this.pdfViewer.selectedItems.annotations[0]) {
            this.pdfViewer.toolbar.annotationToolbarModule.updateStartArrowInIcon(
                this.pdfViewer.selectedItems.annotations[0]);
        }
    }

    private onEndArrowHeadStyleSelect(args: MenuEventArgs): void {
        this.endArrowDropDown.content = this.createContent(args.item.text).outerHTML;
        this.updateFillColor();
    }


    private createInputElement(labelText: string, parentElement: HTMLElement,
                               inputType: string, input: string, isLabelNeeded: boolean, className: string, idString: string): HTMLElement {
        const container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        if (isLabelNeeded) {
            const label: HTMLElement = createElement('div', { id: idString + '_label', className: className + '-label' });
            label.textContent = labelText;
            container.appendChild(label);
        }
        if (this.pdfViewer.localeObj.getConstant('Opacity') === labelText) {
            this.opacityIndicator = createElement('div', { className: 'e-pv-properties-opacity-indicator' });
            container.appendChild(this.opacityIndicator);
        }
        const textBoxInput: HTMLElement = createElement(input, { id: idString });
        if (input === 'input') {
            (textBoxInput as HTMLInputElement).type = inputType;
        }
        container.appendChild(textBoxInput);
        parentElement.appendChild(container);
        return textBoxInput;
    }

    private updateOpacityIndicator(): void {
        this.opacityIndicator.textContent = this.opacitySlider.value + '%';
    }

    private updateFillColor(): void {
        const selectedAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
        const fillColorButton: HTMLInputElement = document.getElementById(this.pdfViewer.element.id + '_properties_fill_color') as HTMLInputElement;
        const startArrow: DecoratorShapes = this.getArrowTypeFromDropDown(this.startArrowDropDown.content);
        const endArrow: DecoratorShapes = this.getArrowTypeFromDropDown(this.endArrowDropDown.content);
        if ((startArrow === 'None' || startArrow === 'OpenArrow') && (endArrow === 'None' || endArrow === 'OpenArrow')) {
            fillColorButton.disabled = true;
        } else if (fillColorButton.disabled){
            fillColorButton.disabled = false;
        }
    }

    /**
     * @param {number} opacityValue - opacityValue
     * @private
     * @returns {void}
     */
    public onOkClicked(opacityValue?: number): void {
        let startArrow: DecoratorShapes;
        let endArrow: DecoratorShapes;
        let thickness: number;
        let strokeColor: string;
        let fillColor: string;
        let opacity: number;
        if (!isBlazor()) {
            startArrow = this.getArrowTypeFromDropDown(this.startArrowDropDown.content);
            endArrow = this.getArrowTypeFromDropDown(this.endArrowDropDown.content);
            thickness = this.thicknessBox.value;
            strokeColor = this.strokeColorPicker.getValue(this.strokeColorPicker.value, 'hex');
            strokeColor = (strokeColor === '') ? '#ffffff00' : strokeColor;
            fillColor = this.fillColorPicker.getValue(this.fillColorPicker.value, 'hex');
            fillColor = (fillColor === '' || fillColor === '#transp' || this.fillColorPicker.value === '#ffffff00') ? '#ffffff00' : fillColor;
            opacity = (this.opacitySlider.value as number) / 100;
        } else {
            const lineStartElement: HTMLInputElement = document.querySelector('#' + this.pdfViewer.element.id + '_properties_line_start');
            const lineEndElement: HTMLInputElement = document.querySelector('#' + this.pdfViewer.element.id + '_properties_line_end');
            const thicknessElement: HTMLInputElement = document.querySelector('#' + this.pdfViewer.element.id + '_line_thickness');
            const lineStyleElement: HTMLInputElement = document.querySelector('#' + this.pdfViewer.element.id + '_properties_style');
            const fillColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_fill_color_button');
            const strokeColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_stroke_color_button');
            const opacityElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_opacity');
            startArrow = this.getArrowTypeFromDropDown(lineStartElement.value, true);
            endArrow = this.getArrowTypeFromDropDown(lineEndElement.value, true);
            thickness = parseInt(thicknessElement.value, 10);
            strokeColor = this.getValue(strokeColorElement.children[0].style.borderBottomColor, 'hex');
            strokeColor = (strokeColor === '') ? '#ffffff00' : strokeColor;
            fillColor = this.getValue(fillColorElement.children[0].style.borderBottomColor, 'hex');
            fillColor = (fillColor === '') ? '#ffffff00' : fillColor;
            if (opacityValue) {
                opacity = (opacityValue) / 100;
            } else {
                opacity = (opacityElement.value as number) / 100;
            }
            if (lineStyleElement.value) {
                if (lineStyleElement.value === 'Solid') {
                    this.setThickness('0', 'solid', true);
                } else if (lineStyleElement.value === 'Dotted') {
                    this.setThickness('2', 'dotted', true);
                } else if (lineStyleElement.value === 'Dashed') {
                    this.setThickness('3', 'dashed', true);
                }
            }
        }
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const newNode: PdfAnnotationBaseModel = {};
        let isColorChanged: boolean = false;
        let isStrokeColorChanged: boolean = false;
        let isThicknessChanged: boolean = false;
        let isOpacityChanged: boolean = false;
        let isLineHeadStartStyleChanged: boolean = false;
        let isLineHeadEndStyleChanged: boolean = false;
        let isBorderDashArrayChanged: boolean = false;
        if (startArrow !== currentAnnotation.sourceDecoraterShapes) {
            newNode.sourceDecoraterShapes = startArrow;
            redoClonedObject.lineHeadStart = this.getArrowString(startArrow);
            isLineHeadStartStyleChanged = true;
        }
        if (endArrow !== currentAnnotation.taregetDecoraterShapes) {
            newNode.taregetDecoraterShapes = endArrow;
            redoClonedObject.lineHeadEnd = this.getArrowString(endArrow);
            isLineHeadEndStyleChanged = true;
        }
        if (thickness !== currentAnnotation.wrapper.children[0].style.strokeWidth) {
            newNode.thickness = thickness;
            redoClonedObject.thickness = thickness;
            isThicknessChanged = true;
        }
        if (strokeColor !== currentAnnotation.wrapper.children[0].style.strokeColor) {
            newNode.strokeColor = strokeColor;
            redoClonedObject.strokeColor = strokeColor;
            isStrokeColorChanged = true;
        }
        if (fillColor !== currentAnnotation.wrapper.children[0].style.fill) {
            newNode.fillColor = fillColor;
            redoClonedObject.fillColor = fillColor;
            isColorChanged = true;
        }
        if (opacity !== currentAnnotation.wrapper.children[0].style.opacity) {
            newNode.opacity = opacity;
            redoClonedObject.opacity = opacity;
            isOpacityChanged = true;
        }
        const oldBorderDashArray: number[] = this.getBorderDashArray(currentAnnotation.wrapper.children[0].style.strokeDashArray);
        const newBorderDashArray: number[] = this.getBorderDashArray(this.selectedLineDashArray === '0' ? '' : this.selectedLineDashArray);
        if (newBorderDashArray.toString() !== oldBorderDashArray.toString()) {
            newNode.borderDashArray = newBorderDashArray;
            const borderStyle: string = this.getBorderStyle(undefined, newBorderDashArray);
            newNode.borderStyle = borderStyle;
            redoClonedObject.borderDashArray = newNode.borderDashArray;
            redoClonedObject.borderStyle = borderStyle;
            isBorderDashArrayChanged = true;
        }
        if (!isBlazor()) {
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance' && this.leaderLengthBox.value !== this.pdfViewer.selectedItems.annotations[0].leaderHeight) {
                newNode.leaderHeight = this.leaderLengthBox.value;
            }
        } else {
            const leaderLengthElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_leader_length');
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance' && parseInt(leaderLengthElement.value, 10) !== this.pdfViewer.selectedItems.annotations[0].leaderHeight) {
                newNode.leaderHeight = parseInt(leaderLengthElement.value, 10);
            }
        }
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], newNode);
        if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations[0].measureType !== 'Perimeter') {
            this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill = fillColor;
        }
        this.triggerAnnotationPropChange(this.pdfViewer.selectedItems.annotations[0], isColorChanged,
                                         isStrokeColorChanged, isThicknessChanged, isOpacityChanged, isLineHeadStartStyleChanged,
                                         isLineHeadEndStyleChanged, isBorderDashArrayChanged);
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'thickness');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'stroke');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'fill');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'opacity');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'dashArray');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'borderStyle');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'startArrow');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'endArrow');
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'leaderLength');
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule && this.pdfViewer.selectedItems.annotations[0]
                && (isLineHeadStartStyleChanged || isLineHeadEndStyleChanged)) {
                this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(true);
            }
        }
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation,
                                            'Line properties change', '', clonedObject, redoClonedObject);
        this.renderAnnotations(currentAnnotation.pageIndex, null, null, null);
        if (!isBlazor()) {
            this.propertiesDialog.hide();
        }
    }

    private onCancelClicked(): void {
        this.propertiesDialog.hide();
    }

    public getArrowTypeFromDropDown(arrowType: string, isBlazor?: boolean): DecoratorShapes {
        if (!isBlazor) {
            arrowType = arrowType.split('</div>')[0].split('">')[1];
        }
        let arrow: DecoratorShapes = 'None';
        switch (arrowType) {
        case this.pdfViewer.localeObj.getConstant('None'):
            arrow = 'None';
            break;
        case this.pdfViewer.localeObj.getConstant('Open Arrow'):
            arrow = 'OpenArrow';
            break;
        case this.pdfViewer.localeObj.getConstant('Closed Arrow'):
            arrow = 'Arrow';
            break;
        case this.pdfViewer.localeObj.getConstant('Round Arrow'):
            arrow = 'Circle';
            break;
        case this.pdfViewer.localeObj.getConstant('Square Arrow'):
            arrow = 'Square';
            break;
        case this.pdfViewer.localeObj.getConstant('Diamond Arrow'):
            arrow = 'Diamond';
            break;
        case this.pdfViewer.localeObj.getConstant('Butt'):
            arrow = 'Butt';
            break;
        }
        return arrow;
    }



    /**
     * @param {DecoratorShapes} arrow - arrow
     * @private
     * @returns {string}- string
     */
    public getArrowString(arrow: DecoratorShapes): string {
        let arrowType: string = this.pdfViewer.localeObj.getConstant('None');
        switch (arrow) {
        case 'Arrow':
            arrowType = this.pdfViewer.localeObj.getConstant('Closed');
            break;
        case 'OpenArrow':
            arrowType = this.pdfViewer.localeObj.getConstant('Open Arrow');
            break;
        case 'Circle':
            arrowType = this.pdfViewer.localeObj.getConstant('Round');
            break;
        case 'None':
        case 'Square':
        case 'Diamond':
            arrowType = this.pdfViewer.localeObj.getConstant(arrow);
            break;
        case 'Butt':
            arrowType = this.pdfViewer.localeObj.getConstant('Butt');
            break;
        }
        return arrowType;
    }

    /**
     * @private
     * @returns {void}
     */
    public onAnnotationMouseUp(): void {
        if (this.pdfViewer.readOnlySettings.annotations) {
            return;
        }
        if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0] &&
            this.pdfViewer.selectedItems.annotations[0].annotationSettings &&
            (!((this.pdfViewer.selectedItems.annotations[0].annotationSettings as any).isLock) ||
                this.checkAllowedInteractions('Delete', this.pdfViewer.selectedItems.annotations[0]) ||
                this.checkAllowedInteractions('PropertyChange', this.pdfViewer.selectedItems.annotations[0]))) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                this.enableBasedOnType();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
                if (!Browser.isDevice) {
                    this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
                }
            }
            if (this.pdfViewer.textSelectionModule && !this.pdfViewer.textSelectionModule.isTextSelection) {
                this.pdfViewerBase.disableTextSelectionMode();
            }
        } else {
            if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isPanMode && !this.pdfViewer.designerMode) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule &&
                (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                const isSkip: boolean = this.pdfViewer.toolbar.annotationToolbarModule.inkAnnotationSelected;
                if (this.pdfViewer.annotation.freeTextAnnotationModule &&
                    !this.pdfViewer.annotation.freeTextAnnotationModule.isInuptBoxInFocus && !isSkip) {
                    const tmModule: any = this.pdfViewer.annotationModule ?
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule : null;
                    const isTextMarkupContext: boolean = !!(tmModule && (tmModule.currentTextMarkupAnnotation ||
                        tmModule.isTextMarkupAnnotationMode));
                    if (!(this.pdfViewerBase.tool instanceof PolygonDrawingTool) && !isTextMarkupContext) {
                        this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
                        this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(false);
                    }
                }
                this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(false);
            }
        }
    }

    /**
     * @param {PdfAnnotationBaseModel} pdfAnnotationBase - pdfAnnotationBase
     * @param {any} event - event
     * @private
     * @returns {void}
     */
    public onShapesMouseup(pdfAnnotationBase: PdfAnnotationBaseModel, event: any): void {
        pdfAnnotationBase = !isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0]) ?
            this.pdfViewer.selectedItems.annotations[0] : pdfAnnotationBase;
        let isToolMoved: boolean = false;
        if (this.pdfViewerBase.prevPosition.x !== this.pdfViewerBase.currentPosition.x ||
             this.pdfViewerBase.prevPosition.y !== this.pdfViewerBase.currentPosition.y){
            isToolMoved = true;
        }
        if (pdfAnnotationBase) {
            if (this.textMarkupAnnotationModule && this.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
            }
            if ((this.pdfViewerBase.tool instanceof NodeDrawingTool ||
                 this.pdfViewerBase.tool instanceof LineTool) && !this.pdfViewerBase.tool.dragging) {
                const setting: AnnotationBaseSettings = {
                    opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
                    thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
                    modifiedDate: pdfAnnotationBase.modifiedDate
                };
                const index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
                if (this.pdfViewerBase.tool instanceof LineTool) {
                    setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
                    setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
                    setting.borderDashArray = pdfAnnotationBase.borderDashArray;
                }
                if (!this.pdfViewerBase.isAnnotationAdded || pdfAnnotationBase.measureType === 'Distance') {
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        if (pdfAnnotationBase.shapeAnnotationType === 'Link' && this.PdfLinkAnnotationModule) {
                            this.PdfLinkAnnotationModule.renderLinkAnnotations(
                                pdfAnnotationBase,
                                pdfAnnotationBase.pageIndex);
                        }
                        else if (pdfAnnotationBase.shapeAnnotationType === 'Redaction') {
                            this.redactionAnnotationModule.renderRedactionAnnotations(pdfAnnotationBase, pdfAnnotationBase.pageIndex);
                            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.isnewlyAddedAnnot = true;
                            }
                        }
                        else {
                            this.shapeAnnotationModule.renderShapeAnnotations(pdfAnnotationBase, pdfAnnotationBase.pageIndex);
                        }
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' ||
                        pdfAnnotationBase.measureType === 'Radius') {
                        this.measureAnnotationModule.
                            renderMeasureShapeAnnotations(pdfAnnotationBase, pdfAnnotationBase.pageIndex);
                    }
                }
                this.pdfViewerBase.updateDocumentEditedProperty(true);
            } else if (this.pdfViewerBase.tool instanceof MoveTool || this.pdfViewerBase.tool instanceof ResizeTool) {
                if (isToolMoved) {
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                }
                if (this.pdfViewerBase.action !== 'Select') {
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        if (pdfAnnotationBase.shapeAnnotationType === 'FreeText') {
                            this.pdfViewer.annotation.freeTextAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                        } else if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText') {
                            this.pdfViewerBase.signatureModule.modifySignatureCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                        } else if (pdfAnnotationBase.shapeAnnotationType === 'Ink') {
                            this.inkAnnotationModule.modifySignatureInkCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                        } else if (pdfAnnotationBase.shapeAnnotationType === 'Stamp' || pdfAnnotationBase.shapeAnnotationType === 'Image') {
                            this.stampAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase, isToolMoved);
                        } else if (pdfAnnotationBase.shapeAnnotationType === 'Redaction') {
                            this.redactionAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                        } else if (pdfAnnotationBase.shapeAnnotationType === 'Link' && this.PdfLinkAnnotationModule) {
                            this.PdfLinkAnnotationModule.modifyInCollection(pdfAnnotationBase, 'bounds', this.pdfViewer.annotation.getEventPageNumber(event));
                        } else {
                            this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase, isToolMoved);
                        }
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Radius' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                        this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                }
                if (this.pdfViewerBase.tool instanceof ResizeTool) {
                    if (!pdfAnnotationBase.formFieldAnnotationType) {
                        this.triggerAnnotationResize(pdfAnnotationBase);
                        if (pdfAnnotationBase.shapeAnnotationType !== 'HandWrittenSignature' && pdfAnnotationBase.shapeAnnotationType !== 'SignatureImage' &&
                            pdfAnnotationBase.shapeAnnotationType !== 'SignatureText'
                        ) {
                            this.triggerAnnotationPropChange(pdfAnnotationBase, false, false, false, false);
                        }

                    }
                }
                if (this.pdfViewerBase.tool instanceof MoveTool) {
                    if (this.pdfViewerBase.action !== 'Select') {
                        if (!pdfAnnotationBase.formFieldAnnotationType) {
                            this.triggerAnnotationMove(pdfAnnotationBase);
                            if (pdfAnnotationBase.shapeAnnotationType !== 'HandWrittenSignature' && pdfAnnotationBase.shapeAnnotationType !== 'SignatureImage' &&
                                pdfAnnotationBase.shapeAnnotationType !== 'SignatureText'
                            ) {
                                this.triggerAnnotationPropChange(pdfAnnotationBase, false, false, false, false);
                            }                        }
                    }
                }
            } else if (this.pdfViewerBase.tool instanceof ConnectTool) {
                if (isToolMoved) {
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                }
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    if ((pdfAnnotationBase.shapeAnnotationType === 'Line' || pdfAnnotationBase.shapeAnnotationType === 'LineWidthArrowHead' || pdfAnnotationBase.shapeAnnotationType === 'Polygon')) {
                        this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase, isToolMoved);
                    } else if (pdfAnnotationBase.shapeAnnotationType === 'FreeText') {
                        this.pdfViewer.annotation.freeTextAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                    if (pdfAnnotationBase.measureType === 'Distance') {
                        this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('leaderLength', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                }
                this.triggerAnnotationResize(pdfAnnotationBase);
                this.triggerAnnotationPropChange(pdfAnnotationBase, false, false, false, false);
            }
            if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable && (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage')) {
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], true);
            }
            if (this.pdfViewer.toolbarModule) {
                if (this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.clearTextMarkupMode();
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearMeasureMode();
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume' || pdfAnnotationBase.measureType === 'Radius') {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearShapeMode();
                    }
                    if (pdfAnnotationBase.shapeAnnotationType === 'Link' && this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule.primaryToolbar) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.primaryToolbar.deSelectItem(
                            this.pdfViewer.toolbarModule.annotationToolbarModule.linkAnnotationItem);
                    }
                    if (this.pdfViewer.selectedItems.annotations.length === 1 && this.pdfViewerBase.action !== 'Drag' &&
                         this.pdfViewer.selectedItems.annotations[0].formFieldAnnotationType === null && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Link') {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationPropertiesTools(true);
                    }
                    if (!isBlazor()) {
                        if (this.pdfViewer.selectedItems.annotations.length === 1 && !this.pdfViewer.designerMode) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(true);
                            this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                            this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                            this.pdfViewer.toolbarModule.redactionToolbarModule.isToolbarHidden = true;
                            // eslint-disable-next-line
                            if (!this.pdfViewer.formDesignerModule && pdfAnnotationBase.id != '' && pdfAnnotationBase.id != null && pdfAnnotationBase.id.slice(0, 4) != 'sign'){
                                const id: HTMLElement = document.getElementById(pdfAnnotationBase.id);
                                const isFieldReadOnly: boolean = id && (id as HTMLInputElement).disabled;
                                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Redaction' &&
                                    (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                                    this.pdfViewer.toolbarModule.annotationToolbarModule.manageRedcationToolbarShow(true);
                                } else {
                                    if (!isFieldReadOnly) {
                                        if (this.pdfViewer.isRedactionToolbarVisible) {
                                            this.pdfViewer.toolbarModule.redactionToolbarModule.isToolbarHidden = false;
                                            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                                                this.pdfViewer.toolbarModule.redactionToolbarModule.showRedactionToolbar(
                                                    this.pdfViewer.toolbarModule.redactionItem);
                                            }
                                        }
                                        this.pdfViewer.toolbarModule.annotationToolbarModule.
                                            showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                                    }
                                    else if (this.pdfViewer.annotation && isFieldReadOnly){
                                        this.pdfViewer.annotation.clearSelection();
                                    }
                                }
                            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Redaction') {
                                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                                    this.pdfViewer.toolbarModule.annotationToolbarModule.manageRedcationToolbarShow(true);
                                } else {
                                    this.pdfViewer.toolbarModule.redactionToolbarModule.
                                        showRedactionToolbar(this.pdfViewer.toolbarModule.redactionItem, null, true);
                                }
                            } else {
                                if (this.pdfViewer.isRedactionToolbarVisible) {
                                    this.pdfViewer.toolbarModule.redactionToolbarModule.isToolbarHidden = false;
                                    this.pdfViewer.toolbarModule.redactionToolbarModule.showRedactionToolbar(
                                        this.pdfViewer.toolbarModule.redactionItem);
                                }
                                this.pdfViewer.toolbarModule.annotationToolbarModule.
                                    showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                            }
                            if (this.pdfViewer.isAnnotationToolbarVisible && this.pdfViewer.isFormDesignerToolbarVisible) {
                                const formDesignerMainDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_formdesigner_toolbar');
                                formDesignerMainDiv.style.display = 'none';
                                if (this.pdfViewer.toolbarModule) {
                                    this.pdfViewer.toolbarModule.formDesignerToolbarModule.isToolbarHidden = false;
                                    this.pdfViewer.toolbarModule.formDesignerToolbarModule.
                                        showFormDesignerToolbar(this.pdfViewer.toolbarModule.formDesignerItem);
                                    this.pdfViewer.toolbarModule.annotationToolbarModule.adjustViewer(true);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {PdfAnnotationBaseModel} pdfAnnotationBase - pdfAnnotationBase
     * @param {boolean} isNewlyAdded - isNewlyAdded
     * @private
     * @returns {void}
     */
    public updateCalibrateValues(pdfAnnotationBase: PdfAnnotationBaseModel, isNewlyAdded?: boolean): void {
        if (pdfAnnotationBase.measureType === 'Distance') {
            pdfAnnotationBase.notes = updateDistanceLabel(pdfAnnotationBase, pdfAnnotationBase.vertexPoints, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Radius') {
            pdfAnnotationBase.notes = updateRadiusLabel(pdfAnnotationBase, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Perimeter') {
            pdfAnnotationBase.notes = updatePerimeterLabel(pdfAnnotationBase, pdfAnnotationBase.vertexPoints, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Area') {
            pdfAnnotationBase.notes = this.measureAnnotationModule.
                calculateArea(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
                updateCalibrateLabel(pdfAnnotationBase);
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Volume') {
            pdfAnnotationBase.notes = this.measureAnnotationModule.
                calculateVolume(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
                updateCalibrateLabel(pdfAnnotationBase);
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        }
    }

    /**
     * @private
     * @param {string} str - The RGBA string to be converted to HEX string
     * @returns {string} The HEX value of given RGBA string
     */
    public rgbaToHex(str: string): string {
        if (!isNullOrUndefined(str) && str.includes('rgba')) {
            // eslint-disable-next-line security/detect-unsafe-regex
            const match: RegExpMatchArray = str.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
            if (!match) {
                return str;
            }
            const r: number = parseInt(match[1], 10);
            const g: number = parseInt(match[2], 10);
            const b: number = parseInt(match[3], 10);
            let a: number = match[4] !== undefined ? parseFloat(match[4]) : 1;
            // Clamp alpha to [0, 1] range if input uses 0–255 scale
            if (a > 1) {
                a = Math.min(a / 255, 1);
            }
            // Manual padding for hex
            const toHex: any = (num: number): string => {
                const hex: string = num.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            const rHex: any = toHex(r);
            const gHex: any = toHex(g);
            const bHex: any = toHex(b);
            const aHex: any = toHex(Math.round(a * 255));
            return `#${rHex}${gHex}${bHex}${aHex}`;
        }
        return str; // return original if not rgba
    }

    /**
     * @private
     * @returns {any} - any
     */
    public getRedactionSettings(): any {
        // Check if any annotation is selected
        if (this.pdfViewer.selectedItems &&
            this.pdfViewer.selectedItems.annotations &&
            this.pdfViewer.selectedItems.annotations.length > 0) {

            const selectedAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];

            // Verify the selected annotation is a redaction annotation
            if (selectedAnnotation && selectedAnnotation.shapeAnnotationType === 'Redaction') {
                // Extract properties from the selected redaction annotation
                return {
                    fillColor: this.rgbaToHex(selectedAnnotation.fillColor as any) || 'rgba(0, 0, 0, 1)',
                    markerBorderColor: this.rgbaToHex(selectedAnnotation.markerBorderColor as any) || 'rgba(255, 0, 0, 1)',
                    markerFillColor: this.rgbaToHex(selectedAnnotation.markerFillColor as any) || 'rgba(255, 255, 255, 1)',
                    markerOpacity: selectedAnnotation.markerOpacity || 1,
                    fontFamily: selectedAnnotation.fontFamily || 'Helvetica',
                    fontSize: selectedAnnotation.fontSize || 14,
                    fontColor: this.rgbaToHex(selectedAnnotation.fontColor as any) || 'rgba(255, 0, 0, 1)',
                    textAlign: selectedAnnotation.textAlign || 'Center',
                    isRepeat: selectedAnnotation.isRepeat || false,
                    overlayText: selectedAnnotation.overlayText || ''
                };
            }
        }

        // Return default values if no redaction annotation is selected
        return null;
    }


    /**
     * @private
     * @returns {void}
     */
    public onAnnotationMouseDown(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1 && this.pdfViewer.selectedItems.annotations[0] &&
            this.pdfViewer.selectedItems.annotations[0].formFieldAnnotationType === null &&
            this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Redaction' &&
            this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].annotationSettings &&
            (!(this.pdfViewer.selectedItems.annotations[0].annotationSettings as any).isLock)  ||
                this.checkAllowedInteractions('Delete', this.pdfViewer.selectedItems.annotations[0]) ||
                this.checkAllowedInteractions('PropertyChange', this.pdfViewer.selectedItems.annotations[0])) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                if (!isBlazor() && Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                    if (commentPanel.style.display === 'none') {
                        if (this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar &&
                            (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule) &&
                                this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.createPropertyTools('');
                        } else {
                            if (this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar &&
                                !this.pdfViewerBase.isAddComment) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                                if (this.PdfLinkAnnotationModule &&
                                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Link') {
                                    let isCalloutEnable: boolean = false;
                                    if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText'
                                        && this.pdfViewer.selectedItems.annotations[0].subject === 'Callout') {
                                        isCalloutEnable = true;
                                    }
                                    this.pdfViewer.toolbarModule.annotationToolbarModule.
                                        createPropertyTools(this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType,
                                                            isCalloutEnable);
                                }
                                const editIcon: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationIcon');
                                if (editIcon && !editIcon.parentElement.classList.contains('e-pv-select')) {
                                    editIcon.parentElement.classList.add('e-pv-select');
                                }
                            }
                        }
                        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule &&
                            this.pdfViewer.toolbar.annotationToolbarModule.menuItems) {
                            this.pdfViewer.toolbar.annotationToolbarModule.menuItems.close();
                        }
                    }
                }
                // 796761 - Freetext double tab issue on iPad device.
                if (!this.pdfViewerBase.isDeviceiOS) {
                    this.enableBasedOnType();
                    this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
                }
            }
        } else if (this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar && this.pdfViewer.annotationModule &&
                                (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule) &&
                                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) {
            this.enableBasedOnType();
            this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
        } else {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule &&
                this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar &&
                this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar.element.style.display !== 'none') {
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar.element.style.display = 'none';
                    const editIcon: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationIcon');
                    if (editIcon && editIcon.parentElement.classList.contains('e-pv-select')) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                    }
                }
            }
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule &&
                this.pdfViewer.toolbar.annotationToolbarModule.menuItems) {
                this.pdfViewer.toolbar.annotationToolbarModule.menuItems.close();
            }
        }
    }

    /**
     * Converts a hex color string to an RGBA color string.
     *
     * This function takes a hex color string as input and attempts to parse it into
     * an RGBA color string format. The conversion works by extracting the red, green,
     * blue, and alpha (transparency) values from the hex string, then formatting
     * these into a standard CSS rgba() string.
     *
     * If the input string is not a valid hex color, the function will catch the error
     * and return the original input string. This serves as a fallback for non-hex colors.
     *
     * @param {string} hex - The color in hexadecimal format (#RRGGBB or #RRGGBBAA).
     * @returns {string} - The color in 'rgba(r, g, b, a)' format or the input raw hex
     *                     string if the conversion fails.
     */
    public hexToRgba(hex: string): string {
        try {
            const [r, g, b, a] = this.parseHexToRgbaValues(hex);
            const alpha: string = (a / 255).toFixed(2);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } catch {
            return hex; // fallback for non-hex colors
        }
    }


    // Internal helper to convert hex to RGBA numeric values
    private parseHexToRgbaValues(hex: string): number[] {
        if (!hex || !hex.startsWith('#')) {
            throw new Error('Invalid hex color');
        }
        hex = hex.replace('#', '').trim();

        // Expand shorthand hex like #abc or #abcd
        if (hex.length === 3 || hex.length === 4) {
            hex = hex.split('').map((c: string) => c + c).join('');
        }

        if (hex.length !== 6 && hex.length !== 8) {
            throw new Error('Invalid hex length');
        }

        const r: number = parseInt(hex.slice(0, 2), 16);
        const g: number = parseInt(hex.slice(2, 4), 16);
        const b: number = parseInt(hex.slice(4, 6), 16);
        const a: number = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;

        return [r, g, b, a];
    }

    private enableBasedOnType(): void {
        if (this.pdfViewer.readOnlySettings.annotations) {
            return;
        }
        let isLock: boolean = false;
        const annotation: any = this.pdfViewer.selectedItems.annotations[0];
        if (annotation && annotation.annotationSettings) {
            isLock = annotation.annotationSettings.isLock;
            if (isLock && this.checkAllowedInteractions('PropertyChange', annotation)) {
                isLock = false;
            }
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!isLock && this.pdfViewer.selectedItems.annotations[0]) {
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Path' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText'
                    && this.pdfViewer.selectedItems.annotations[0].subject === 'Callout') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(true, true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                } else {
                    if (this.pdfViewer.selectedItems.annotations.length === 1 &&
                        this.pdfViewer.selectedItems.annotations[0].formFieldAnnotationType === null &&
                        this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Redaction' &&
                        this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Link') {
                        this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(true);
                    }
                }
            }
            else if (this.pdfViewer.annotationModule && (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule)
                && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)
                && (Browser.isDevice && this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(true);
            }
        }
    }

    private getProperDate(date: string): string {
        let dateObject: Date = new Date(date.toString());
        if (isNaN(dateObject.getFullYear())) {
            let dateString: string = date.slice(2, 16);
            dateString = dateString.slice(0, 4) + '/' + dateString.slice(4, 6) + '/' + dateString.slice(6, 8) + ' ' + dateString.slice(8, 10) + ':' + dateString.slice(10, 12) + ':' + dateString.slice(12, 14);
            dateObject = new Date(dateString);
        }
        return (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    }

    /**
     * @param {IPageAnnotations} pageAnnotations - pageAnnotations
     * @param {number} pageNumber - pageNumber
     * @private
     * @returns {number} - number
     */
    public getPageCollection(pageAnnotations: IPageAnnotations[], pageNumber: number): number {
        let index: number = null;
        for (let i: number = 0; i < pageAnnotations.length; i++) {
            if (pageAnnotations[parseInt(i.toString(), 10)].pageIndex === pageNumber) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * @param {any} annotations - annotations
     * @param {string} id - id
     * @private
     * @returns {any} - any
     */
    public getAnnotationWithId(annotations: any[], id: string): any {
        let annotation: any;
        for (let i: number = 0; i < annotations.length; i++) {
            if (id === annotations[parseInt(i.toString(), 10)].id || id === annotations[parseInt(i.toString(), 10)].annotationId) {
                annotation = annotations[parseInt(i.toString(), 10)];
            }
        }
        return annotation;
    }

    /**
     * @param {any} event - event
     * @private
     * @returns {number} - number
     */
    public getEventPageNumber(event: any): number {
        let eventTarget: HTMLElement = event.target as HTMLElement;
        const eventParentElement: HTMLElement = event.target.parentElement as HTMLElement;
        if (eventTarget.classList.contains('e-pv-hyperlink')) {
            eventTarget = eventParentElement;
        } else if (eventParentElement && eventParentElement.classList.contains('foreign-object') && eventParentElement.parentElement && eventParentElement.parentElement.parentElement && eventParentElement.parentElement.parentElement.parentElement) {
            const targetElement: HTMLElement = eventParentElement.parentElement.parentElement.parentElement;
            eventTarget = ['text', 'textLayer', 'annotationCanvas', 'pageDiv'].some((v: string) => targetElement.id.includes(v)) ? targetElement : eventParentElement.parentElement.parentElement;
        }
        else if (eventTarget.classList.contains('e-pdfviewer-formFields')) {
            eventTarget = eventParentElement;
        }
        let pageString: string;
        if (eventTarget) {
            pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
        }
        if (isNaN(parseInt(pageString, 10))) {
            event = this.pdfViewerBase.annotationEvent && eventTarget && this.pdfViewerBase.annotationEvent.target.id === eventTarget.id ?
                this.pdfViewerBase.annotationEvent : event;
            eventTarget = event.target as HTMLElement;
            if (eventTarget && eventTarget.id) {
                pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
            }
            if (!isNullOrUndefined(this.pdfViewerBase.annotationEvent) &&
            (!isNullOrUndefined(this.pdfViewerBase.annotationEvent.target)) && (isNullOrUndefined(pageString))) {
                // eslint-disable-next-line
                pageString = this.pdfViewerBase.annotationEvent.target.id.split('_textLayer_')[1]
            }
        }
        return parseInt(pageString, 10);
    }

    /**
     * @param {any} commentsAnnotations - commentsAnnotations
     * @param {any} parentAnnotation - parentAnnotation
     * @param {string} author - author
     * @private
     * @returns {any} - any
     */
    public getAnnotationComments(commentsAnnotations: any, parentAnnotation: any, author: string): ICommentsCollection[] {
        const newArray: ICommentsCollection[] = [];
        let annotationObject: ICommentsCollection = null;
        if (commentsAnnotations) {
            if (commentsAnnotations.length > 0) {
                for (let i: number = 0; i < commentsAnnotations.length; i++) {
                    const annotation: any = commentsAnnotations[parseInt(i.toString(), 10)];
                    annotationObject = {
                        shapeAnnotationType: 'sticky', author: annotation.Author, modifiedDate: annotation.ModifiedDate, note: annotation.Note, state: annotation.state, stateModel: annotation.stateModel,
                        comments: [], review: { state: annotation.State, stateModel: annotation.StateModel,
                            modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                        annotName: annotation.AnnotName, parentId: parentAnnotation.AnnotName, subject: annotation.Subject,
                        isLock: annotation.IsLock, commentsIndex: annotation.CommentsIndex
                    };
                    newArray[newArray.length] = annotationObject;
                }
            }
        }
        return newArray;
    }

    private getRandomNumber(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any): string {
            const random: number = Math.random() * 16 | 0;
            const v: number = c === 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    }

    /**
     * @private
     * @returns {string} - string
     */
    public createGUID(): string {
        return this.getRandomNumber();
    }

    /**
     * Generates a canvas element with mix-blend mode to highlight annotations.
     * @param {HTMLElement} pageDiv - pageDiv
     * @param {number} pageWidth - pageWidth
     * @param {number} pageHeight - pageHeight
     * @param {number} pageNumber - pageNumber
     * @param {string} displayMode - displayMode
     * @private
     * @returns {HTMLElement} - htmlelement
     */
    public createBlendAnnotationsIntoCanvas(pageDiv: HTMLElement, pageWidth: number,
                                            pageHeight: number, pageNumber: number, displayMode?: string): HTMLElement {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_blendAnnotationsIntoCanvas_' + pageNumber);
        if (canvas) {
            this.pdfViewerBase.updateCanvas(canvas as HTMLCanvasElement, pageWidth, pageHeight, pageNumber);
            return canvas;
        } else {
            const annotationCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_blendAnnotationsIntoCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' }) as HTMLCanvasElement;
            this.pdfViewerBase.updateCanvas(annotationCanvas, pageWidth, pageHeight, pageNumber);
            (annotationCanvas.style as any)['mixBlendMode'] = 'multiply';
            pageDiv.appendChild(annotationCanvas);
            return annotationCanvas;
        }
    }

    /**
     * @param {number} width - width
     * @param {number} height - height
     * @param {number} pageNumber - pageNumber
     * @private
     * @returns {void}
     */
    public resizeAnnotations(width: number, height: number, pageNumber: number): void {
        // Styles need to be applied to both canvases. The 'blendAnnotationsIntoCanvas' is used for highlight annotations.
        // Keep backing-store size in sync (capped) so large pages / high zoom do not leave a mismatched bitmap.
        const pageDetails: ISize = this.pdfViewerBase.pageSize[Number.parseInt(String(pageNumber), 10)];
        const metrics: any = pageDetails ?
            this.pdfViewerBase.getAnnotationCanvasMetrics(pageDetails.width, pageDetails.height) : null;
        ['_annotationCanvas_', '_blendAnnotationsIntoCanvas_'].forEach((id: string) => {
            const canvas: HTMLElement = this.pdfViewerBase.getElement(id + pageNumber);
            if (canvas) {
                if (metrics) {
                    canvas.style.width = metrics.styleWidth + 'px';
                    canvas.style.height = metrics.styleHeight + 'px';
                } else {
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                }
                this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
            }
        });
    }

    /**
     * @param {number} pageNumber - pageNumber
     * @private
     * @returns {void}
     */
    public clearAnnotationCanvas(pageNumber: number): void {
        if (isNullOrUndefined(pageNumber)) {
            return;
        }
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        const pageDetails: ISize = this.pdfViewerBase.pageSize[Number.parseInt(String(pageNumber), 10)];
        if (!pageDetails) {
            return;
        }
        const metrics: any = this.pdfViewerBase.getAnnotationCanvasMetrics(pageDetails.width, pageDetails.height, zoom);
        // Styles need to be applied to both canvases. The 'blendAnnotationsIntoCanvas' is used for highlight annotations.
        const canvasIds: string[] = ['_annotationCanvas_', '_blendAnnotationsIntoCanvas_'];
        canvasIds.forEach((id: string) => {
            const canvas: HTMLElement = this.pdfViewerBase.getElement(id + pageNumber) as HTMLCanvasElement;
            if (canvas) {
                (canvas as HTMLCanvasElement).width = metrics.canvasWidth;
                (canvas as HTMLCanvasElement).height = metrics.canvasHeight;
                (canvas as HTMLCanvasElement).style.width = metrics.styleWidth + 'px';
                (canvas as HTMLCanvasElement).style.height = metrics.styleHeight + 'px';
            }
        });
    }

    /**
     * @param {number} pageNumber - pageNumber
     * @param {any} shapeAnnotation - shapeAnnotation
     * @param {any} measureShapeAnnotation - measureShapeAnnotation
     * @param {any} textMarkupAnnotation - textMarkupAnnotation
     * @param {any} canvas - canvas
     * @param {boolean} isImportAnnotations - isImportAnnotations
     * @param {boolean} isAnnotOrderAction - isAnnotOrderAction
     * @param {any} freeTextAnnotation - freeTextAnnotation
     * @param {any} inkAnnotation - inkAnnotation
     * @param {boolean} isLastAnnot - last annotation in document
     * @param {any} redactionAnnotation - redaction annotation in document
     * @param {any} linkAnnotation - link annotation in document
     * @private
     * @returns {void}
     */
    public renderAnnotations(pageNumber: number, shapeAnnotation: any, measureShapeAnnotation: any,
                             textMarkupAnnotation: any, canvas?: any, isImportAnnotations?: boolean, isAnnotOrderAction?: boolean,
                             freeTextAnnotation?: any, inkAnnotation?: any, isLastAnnot?: boolean,
                             redactionAnnotation?: any, linkAnnotation?: any): void {
        if (this.pdfViewer.annotationCollection.length > 0) {
            initializeTelemetryFeature('Annotation Add/Edit', 'PDFViewer');
        }
        if (isNullOrUndefined(isLastAnnot) || isLastAnnot) {
            this.clearAnnotationCanvas(pageNumber);
        }
        if (this.shapeAnnotationModule && shapeAnnotation) {
            if (isImportAnnotations) {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber, true);
            } else {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber, null, isAnnotOrderAction);
            }
        }
        if (this.measureAnnotationModule && measureShapeAnnotation) {
            if (isImportAnnotations) {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber, true);
            } else {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber, null, isAnnotOrderAction);
            }
        }
        // Add this new block for redaction annotations
        if (this.redactionAnnotationModule) {
            if (isNullOrUndefined(redactionAnnotation) || (redactionAnnotation[0] && redactionAnnotation[0].RedactionType !== 'textRedact')) {
                if (isImportAnnotations) {
                    this.redactionAnnotationModule.renderRedactionAnnotations(redactionAnnotation, pageNumber, true);
                } else {
                    this.redactionAnnotationModule.renderRedactionAnnotations(redactionAnnotation, pageNumber, null, isAnnotOrderAction);
                }
            }
        }
        if (this.freeTextAnnotationModule && freeTextAnnotation) {
            if (isImportAnnotations) {
                this.freeTextAnnotationModule.renderFreeTextAnnotations(freeTextAnnotation, pageNumber, true, null, true);
            }
            else {
                this.freeTextAnnotationModule.renderFreeTextAnnotations(freeTextAnnotation, pageNumber, null, isAnnotOrderAction);
            }
        }
        if (this.inkAnnotationModule && inkAnnotation) {
            if (isImportAnnotations) {
                this.inkAnnotationModule.renderExistingInkSignature(inkAnnotation, pageNumber, true, null, true);
            }
            else {
                this.inkAnnotationModule.renderExistingInkSignature(inkAnnotation, pageNumber, null, isAnnotOrderAction);
            }
        }
        if (this.PdfLinkAnnotationModule && linkAnnotation) {
            if (isImportAnnotations) {
                this.PdfLinkAnnotationModule.renderLinkAnnotations(linkAnnotation, pageNumber, true);
            } else {
                this.PdfLinkAnnotationModule.renderLinkAnnotations(linkAnnotation, pageNumber, null, isAnnotOrderAction);
            }
        }
        // R-18 / Phase 3 fix: Freehand Highlight per-wrapper routing lives in
        // drawing.ts:refreshCanvasDiagramLayer (drawing.ts:1361-1393). The
        // per-wrapper guard checks each uniqueObject.enableInkHighlight flag and
        // routes FH wrappers to _blendAnnotationsIntoCanvas_ with a synced
        // transform, while plain Ink wrappers continue on _annotationCanvas_
        // (the diagramLayer argument). This replaces the earlier page-level
        // routing at the bottom of this function (commit a0db91599), which
        // was redundant because refreshCanvasDiagramLayer defaults
        // diagramLayer to _annotationCanvas_ when undefined (line 1247-1248)
        // and so the canvas argument from this caller was never used.
        if (isNullOrUndefined(isLastAnnot) || isLastAnnot) {
            this.pdfViewer.drawing.refreshCanvasDiagramLayer(canvas as HTMLCanvasElement, pageNumber);
        }
        if (!this.pdfViewerBase.isInkAdded && this.pdfViewer.tool === 'Ink' && this.pdfViewer.currentPageNumber - 1 === pageNumber) {
            const currentcanvas: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', (this.pdfViewer.currentPageNumber - 1));
            const zoom: number = this.pdfViewerBase.getZoomFactor();
            const ratio: number = this.pdfViewerBase.getWindowDevicePixelRatio();
            const context: CanvasRenderingContext2D  = (currentcanvas as HTMLCanvasElement).getContext('2d');
            const thickness: number = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
            const opacity: number = !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.opacity)
                ? this.pdfViewer.inkAnnotationSettings.opacity : 1;
            const strokeColor: string = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
            if (!Browser.isDevice || (Browser.isDevice && zoom <= 0.7)) {
                context.setTransform(ratio, 0, 0, ratio, 0, 0);
            }
            context.beginPath();
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = thickness * zoom > 1 ? thickness * zoom : thickness;
            context.strokeStyle = strokeColor;
            context.globalAlpha = opacity;
            const collectionData: Object[] = processPathData(this.pdfViewer.annotationModule.inkAnnotationModule.updateInkDataWithZoom());
            const csData: Object[] = splitArrayCollection(collectionData);
            for (let j: number = 0; j < csData.length; j++) {
                const pathValue: any = csData[parseInt(j.toString(), 10)];
                switch (pathValue.command) {
                case 'M':
                    context.moveTo(pathValue.x, pathValue.y);
                    break;
                case 'L':
                    context.lineTo(pathValue.x, pathValue.y);
                    break;
                default:
                    break;
                }
            }
            context.stroke();
            context.closePath();
            if (!isNullOrUndefined(this.pdfViewer.toolbarModule) &&
             !isNullOrUndefined(this.pdfViewer.toolbarModule.annotationToolbarModule)) {
                this.pdfViewer.toolbar.annotationToolbarModule.inkAnnotationSelected = true;
            }
        }
        if (this.textMarkupAnnotationModule && (isNullOrUndefined(isLastAnnot) || isLastAnnot ||
        (isImportAnnotations && textMarkupAnnotation))) {
            if (isImportAnnotations) {
                this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber, true);
            } else {
                this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber);
            }
        }
        if (this.redactionAnnotationModule && (isNullOrUndefined(isLastAnnot) || isLastAnnot ||
        (isImportAnnotations && redactionAnnotation))) {
            if (isImportAnnotations) {
                this.redactionAnnotationModule.renderTextRedactAnnotationsInPage(redactionAnnotation, pageNumber, true);
            } else {
                this.redactionAnnotationModule.renderTextRedactAnnotationsInPage(redactionAnnotation, pageNumber);
            }
        }
    }

    /**
     * @param {number} pageNumber - pageNumber
     * @param {any} annotation - annotation
     * @param {string} annotationId - annotationId
     * @param {boolean} isImportAnnotations - isImportAnnotations
     * @private
     * @returns {number} - number
     */
    public storeAnnotations(pageNumber: number, annotation: IAnnotation, annotationId: string, isImportAnnotations?: boolean): number {
        // let annotationId: string = '_annotations_textMarkup';
        // if (annotation is ITextMarkupAnnotation) {
        //     annotationId = '_annotations_textMarkup';
        // } else if (annotation as IShapeAnnotation) {
        //     annotationId = '_annotations_shape';
        // } else {
        //     annotationId = '_annotations_stamp';
        // }
        const sessionSize: number = this.pdfViewerBase.sessionStorageManager.getWindowSessionStorageSize();
        if (sessionSize > 4500) {
            this.pdfViewerBase.isStorageExceed = true;
            if (!(this.pdfViewerBase.isFormStorageExceed)){
                if (this.pdfViewer.formFieldsModule) {
                    this.pdfViewer.formFieldsModule.clearFormFieldStorage();
                }
            }
        }
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + annotationId);
        let index: number = 0;
        if (!storeObject) {
            this.storeAnnotationCollections(annotation, pageNumber, undefined, undefined, isImportAnnotations);
            const pageAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            pageAnnotation.annotations.push(annotation);
            index = pageAnnotation.annotations.indexOf(annotation);
            const annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(pageAnnotation);
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + annotationId, annotationCollection);
        } else {
            this.storeAnnotationCollections(annotation, pageNumber, undefined, undefined, isImportAnnotations);
            this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + annotationId);
            const pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
            if (pageIndex != null && storeObject[parseInt(pageIndex.toString(), 10)]) {
                (storeObject[parseInt(pageIndex.toString(), 10)] as IPageAnnotations).
                    annotations.filter(function (item: any, index: number): void {
                        if (item.annotName === annotation.annotName) {
                            (storeObject[parseInt(pageIndex.toString(), 10)] as IPageAnnotations).annotations.splice(index, 1);
                        }
                    });
                (storeObject[parseInt(pageIndex.toString(), 10)] as IPageAnnotations).annotations.push(annotation);
                index = (storeObject[parseInt(pageIndex.toString(), 10)] as IPageAnnotations).annotations.indexOf(annotation);
            } else {
                const markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                storeObject.push(markupAnnotation);
            }
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + annotationId, storeObject);
        }
        return index;
    }

    /**
     * @param {string} type - type
     * @private
     * @returns {DecoratorShapes}- decorateshapes
     */
    public getArrowType(type: string): DecoratorShapes {
        let decoratorShapes: DecoratorShapes = 'None';
        switch (type) {
        case 'ClosedArrow':
        case 'Closed':
            decoratorShapes = 'Arrow';
            break;
        case 'OpenArrow':
        case 'Open':
            decoratorShapes = 'OpenArrow';
            break;
        case 'Square':
            decoratorShapes = 'Square';
            break;
        case 'Circle':
        case 'Round':
            decoratorShapes = 'Circle';
            break;
        case 'Diamond':
            decoratorShapes = 'Diamond';
            break;
        case 'Butt':
            decoratorShapes = 'Butt';
            break;
        case 'Slash':
            // decoratorShapes = 'Slash';
            break;
        }
        return decoratorShapes;
    }

    /**
     * @param {DecoratorShapes} arrow - arrow
     * @private
     * @returns {string}- string
     */
    public getArrowTypeForCollection(arrow: DecoratorShapes): string {
        let arrowType: string;
        switch (arrow) {
        case 'Arrow':
            arrowType = 'ClosedArrow';
            break;
        case 'OpenArrow':
        case 'Square':
        case 'Circle':
        case 'Diamond':
        case 'None':
            arrowType = arrow.toString();
            break;
        case 'Butt':
            arrowType = 'Butt';
            break;
        }
        return arrowType;
    }

    /**
     * @param {any} bound - bound
     * @param {number} pageIndex - pageIndex
     * @private
     * @returns {any} - any
     */
    public getBounds(bound: any, pageIndex: number): any {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        bound.top = bound.top ? bound.top : 0;
        bound.left = bound.left ? bound.left : 0;
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { left: bound.top, top: pageDetails.width - (bound.left + bound.width), width: bound.height, height: bound.width };
            } else if (pageDetails.rotation === 2) {
                return { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height,
                    width: bound.width, height: bound.height };
            } else if (pageDetails.rotation === 3) {
                return { left: pageDetails.height - bound.top - bound.height, top: bound.left, width: bound.height, height: bound.width };
            } else {
                return bound;
            }
        } else {
            return bound;
        }
    }

    /**
     * @param {IPoint} location - location
     * @param {number} pageIndex - pageIndex
     * @private
     * @returns {IPoint} - IPoint
     */
    public getLocation(location: IPoint, pageIndex: number): IPoint {
        const pageDetails: ISize =
            this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];

        location.x = !isNullOrUndefined(location.x) ? location.x : 0;
        location.y = !isNullOrUndefined(location.y) ? location.y : 0;

        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return {
                    x: location.y,
                    y: pageDetails.width - location.x
                };
            } else if (pageDetails.rotation === 2) {
                return {
                    x: pageDetails.width - location.x,
                    y: pageDetails.height - location.y
                };
            } else if (pageDetails.rotation === 3) {
                return {
                    x: pageDetails.height - location.y,
                    y: location.x
                };
            } else {
                return location;
            }
        }

        return location;
    }

    /**
     * @param {any} bound - bound
     * @param {number} pageIndex - pageIndex
     * @private
     * @returns {any} - any
     */
    public getInkBounds(bound: any, pageIndex: number): any {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { x: bound.y, y: pageDetails.width - (bound.x + bound.width), width: bound.height, height: bound.width };
            } else if (pageDetails.rotation === 2) {
                return { x: pageDetails.width - bound.x - bound.width, y: pageDetails.height - bound.y - bound.height,
                    width: bound.width, height: bound.height };
            } else if (pageDetails.rotation === 3) {
                return { x: pageDetails.height - bound.y - bound.height, y: bound.x, width: bound.height, height: bound.width };
            } else {
                return bound;
            }
        } else {
            return bound;
        }
    }

    /**
     * @param {any} points - points
     * @param {number} pageIndex - pageIndex
     * @private
     * @returns {any} - any
     */
    public getVertexPoints(points: any[], pageIndex: number): any {
        if (points) {
            const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
            if (pageDetails.rotation === 1) {
                const points1: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    const point: PointModel = { x: points[parseInt(i.toString(), 10)].y,
                        y: pageDetails.width - points[parseInt(i.toString(), 10)].x };
                    points1.push(point);
                }
                return points1;
            } else if (pageDetails.rotation === 2) {
                const points2: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    const point: PointModel = { x: pageDetails.width - points[parseInt(i.toString(), 10)].x,
                        y: pageDetails.height - points[parseInt(i.toString(), 10)].y };
                    points2.push(point);
                }
                return points2;
            } else if (pageDetails.rotation === 3) {
                const points3: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    const point: PointModel = { x: pageDetails.height - points[parseInt(i.toString(), 10)].y,
                        y: points[parseInt(i.toString(), 10)].x };
                    points3.push(point);
                }
                return points3;
            } else {
                return points;
            }
        }
    }

    /**
     * @param {number} pageIndex - pageIndex
     * @param {any} shapeAnnotations - shapeAnnotations
     * @param {string} idString - idString
     * @private
     * @returns {any} - any
     */
    public getStoredAnnotations(pageIndex: number, shapeAnnotations: any[], idString: string): any[] {
        let annotationCollection: any[];
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + idString);
        if (storeObject) {
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageIndex);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                annotationCollection = storeObject[parseInt(index.toString(), 10)].annotations;
            } else {
                annotationCollection = null;
            }
        } else {
            annotationCollection = null;
        }
        return annotationCollection;
    }

    /**
     * @param {PdfAnnotationBaseModel} pdfAnnotationBase - pdfAnnotationBase
     * @param {boolean} isColor - isColor
     * @param {boolean} isStroke - isStroke
     * @param {boolean} isThickness - isThickness
     * @param {boolean} isOpacity - isOpacity
     * @param {boolean} isLineStart - isLineStart
     * @param {boolean} isLineEnd - isLineEnd
     * @param {boolean} isDashArray - isDashArray
     * @param {boolean} isFreeText - isFreeText
     * @param {string} previousText - previousText
     * @param {string} currentText - currentText
     * @private
     * @returns {void}
     */
    public triggerAnnotationPropChange(pdfAnnotationBase: PdfAnnotationBaseModel, isColor: boolean,
                                       isStroke: boolean, isThickness: boolean, isOpacity: boolean, isLineStart?: boolean,
                                       isLineEnd?: boolean, isDashArray?: boolean, isFreeText?: boolean, previousText?: string,
                                       currentText?: string): void {
        const index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        const eventArgs: AnnotationPropertiesChangeEventArgs = { name: 'annotationPropertiesChange', pageIndex: pdfAnnotationBase.pageIndex, annotationId: pdfAnnotationBase.annotName, annotationType: type, isColorChanged: isColor, isOpacityChanged: isOpacity, isThicknessChanged: isThickness, isStrokeColorChanged: isStroke };
        if (isFreeText) {
            eventArgs.isFreeTextChanged = isFreeText;
            eventArgs.previousText = previousText;
            eventArgs.currentText = currentText;
        }
        if (isLineStart) {
            eventArgs.isLineHeadStartStyleChanged = isLineStart;
        }
        if (isLineEnd) {
            eventArgs.isLineHeadEndStyleChanged = isLineEnd;
        }
        if (isDashArray) {
            eventArgs.isBorderDashArrayChanged = isDashArray;
        }
        this.pdfViewer.trigger('annotationPropertiesChange', eventArgs);
    }

    /**
     * @param {PdfAnnotationBaseModel} pdfAnnotationBase - It describes about the pdf annotation base
     * @private
     * @returns {void}
     */
    public triggerAnnotationAdd(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        const setting: AnnotationBaseSettings = {
            fillColor: pdfAnnotationBase.fillColor, thickness: pdfAnnotationBase.thickness,
            author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        const bounds: AnnotBoundsRect = { left: pdfAnnotationBase.wrapper.bounds.x, top: pdfAnnotationBase.wrapper.bounds.y,
            width: pdfAnnotationBase.wrapper.bounds.width, height: pdfAnnotationBase.wrapper.bounds.height };
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        if (type === 'Redaction') {
            setting.markerBorderColor = pdfAnnotationBase.markerBorderColor;
            setting.markerFillColor = pdfAnnotationBase.markerFillColor;
            setting.markerOpacity = pdfAnnotationBase.markerOpacity;
            setting.overlayText = pdfAnnotationBase.overlayText;
            setting.textAlignment = pdfAnnotationBase.textAlign;
            setting.isRepeat = pdfAnnotationBase.isRepeat;
            setting.fontColor = pdfAnnotationBase.fontColor;
            setting.fontFamily = pdfAnnotationBase.fontFamily;
            setting.fontSize = pdfAnnotationBase.fontSize;
        } else {
            setting.opacity = pdfAnnotationBase.opacity;
            setting.strokeColor = pdfAnnotationBase.strokeColor;
        }
        let labelSettings: ShapeLabelSettingsModel;
        if (this.pdfViewer.enableShapeLabel) {
            labelSettings = {
                fontColor: pdfAnnotationBase.fontColor, fontSize: pdfAnnotationBase.fontSize, fontFamily: pdfAnnotationBase.fontFamily,
                opacity: pdfAnnotationBase.labelOpacity, labelContent: pdfAnnotationBase.labelContent,
                fillColor: pdfAnnotationBase.labelFillColor
            };
            this.pdfViewer.fireAnnotationAdd(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type,
                                             bounds, setting, null, null, null, labelSettings);
        } else {
            this.pdfViewer.fireAnnotationAdd(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, bounds, setting);
        }
    }

    /**
     * @param {PdfAnnotationBaseModel} pdfAnnotationBase - pdfAnnotationBase
     * @private
     * @returns {void}
     */
    public triggerAnnotationResize(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        const setting: AnnotationBaseSettings = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        const annotationBounds: any = pdfAnnotationBase.bounds;
        const currentPosition: object = { left: annotationBounds.x, top: annotationBounds.y, x: annotationBounds.x,
            y: annotationBounds.y, width: annotationBounds.width, height: annotationBounds.height };
        const previousPosition: object = { left: annotationBounds.oldProperties.x, top: annotationBounds.oldProperties.y,
            width: annotationBounds.oldProperties.width, height: annotationBounds.oldProperties.height };
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        let labelSettings: ShapeLabelSettingsModel;
        if (this.pdfViewer.enableShapeLabel && (pdfAnnotationBase.shapeAnnotationType !== 'HandWrittenSignature')) {
            labelSettings = {
                fontColor: pdfAnnotationBase.fontColor, fontSize: pdfAnnotationBase.fontSize, fontFamily: pdfAnnotationBase.fontFamily,
                opacity: pdfAnnotationBase.labelOpacity, labelContent: pdfAnnotationBase.labelContent,
                fillColor: pdfAnnotationBase.labelFillColor, notes: pdfAnnotationBase.notes
            };
            this.pdfViewer.fireAnnotationResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName,
                                                type, currentPosition, setting, null, null, null, labelSettings);
        } else {
            if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage') {
                this.pdfViewer.fireSignatureResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.signatureName,
                                                   pdfAnnotationBase.shapeAnnotationType as AnnotationType, pdfAnnotationBase.opacity,
                                                   pdfAnnotationBase.strokeColor, pdfAnnotationBase.thickness,
                                                   currentPosition, previousPosition);
            } else {
                this.pdfViewer.fireAnnotationResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName,
                                                    type, currentPosition, setting);
            }
        }
    }

    /**
     * @param {PdfAnnotationBaseModel} pdfAnnotationBase - pdfAnnotationBase
     * @param {boolean} isMoving - isMoving
     * @private
     * @returns {void}
     */
    public triggerAnnotationMove(pdfAnnotationBase: PdfAnnotationBaseModel, isMoving?: boolean): void {
        const setting: AnnotationBaseSettings = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        const annotationBounds: any = pdfAnnotationBase.bounds;
        const currentPosition: object = { left: annotationBounds.x, top: annotationBounds.y,
            x: annotationBounds.x, y: annotationBounds.y, width: annotationBounds.width, height: annotationBounds.height };
        const previousPosition: object = { left: annotationBounds.oldProperties.x ?
            annotationBounds.oldProperties.x : annotationBounds.x  , top: annotationBounds.oldProperties.y ?
            annotationBounds.oldProperties.y : annotationBounds.y , width: annotationBounds.width, height: annotationBounds.height };
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage') {
            this.pdfViewer.fireSignatureMove(pdfAnnotationBase.pageIndex, pdfAnnotationBase.signatureName,
                                             pdfAnnotationBase.shapeAnnotationType as AnnotationType, pdfAnnotationBase.opacity,
                                             pdfAnnotationBase.strokeColor, pdfAnnotationBase.thickness, previousPosition, currentPosition);
        } else {
            if (isMoving) {
                this.pdfViewer.fireAnnotationMoving(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, setting,
                                                    previousPosition, currentPosition);
            } else {
                this.pdfViewer.fireAnnotationMove(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, setting,
                                                  previousPosition, currentPosition);
            }

        }
    }

    /**
     * @param {any} annotationId - annotationId
     * @param {number} pageNumber - pageNumber
     * @param {any} annotation - annotation
     * @param {any} annotationCollection - annotationCollection
     * @param {boolean} isDblClick - isDblClick
     * @param {boolean} isSelected - isSelected
     * @private
     * @returns {void}
     */
    public annotationSelect(annotationId: any, pageNumber: number, annotation: any,
                            annotationCollection?: any, isDblClick?: boolean, isSelected?: boolean): void {
        let annotSettings: any;
        if (annotation.shapeAnnotationType === 'textMarkup') {
            annotSettings = { type: 'TextMarkup', subType: annotation.subject, opacity: annotation.opacity, color: annotation.color, textMarkupContent: annotation.textMarkupContent, textMarkupStartIndex: annotation.textMarkupStartIndex, textMarkupEndIndex: annotation.textMarkupEndIndex, customData: annotation.customData };
        } else if (annotation.shapeAnnotationType === 'StickyNotes') {
            annotSettings = { type: 'StickyNotes', opacity: annotation.opacity, customData: annotation.customData };
        } else if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
            annotSettings = { type: 'Stamp', opacity: annotation.opacity, customData: annotation.customData };
        } else if (annotation.shapeAnnotationType === 'Ink') {
            annotSettings = {
                type: 'Ink', opacity: annotation.opacity, strokeColor: annotation.strokeColor, thickness: annotation.thickness, modifiedDate: annotation.modifiedDate,
                width: annotation.bounds.width, height: annotation.bounds.height, left: annotation.bounds.x,
                top: annotation.bounds.y, data: annotation.data, customData: annotation.customData
            };
        } else if (annotation.shapeAnnotationType === 'FreeText') {
            annotSettings = {
                type: 'FreeText', opacity: annotation.opacity, fillColor: annotation.fillColor,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness, content: annotation.dynamicText,
                fontFamily: annotation.fontFamily, fontSize: annotation.fontSize, fontColor: annotation.fontColor,
                textAlign: annotation.textAlign, fontStyle: this.updateFreeTextFontStyle(annotation.font),
                customData: annotation.customData
            };
        } else if (annotation.shapeAnnotationType === 'Link') {
            annotSettings = {
                type: 'Link', destinationLocation: annotation.destinationLocation, destinationPageIndex: annotation.destinationPageIndex,
                url: annotation.url, opacity: annotation.opacity,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness,
                customData: annotation.customData
            };
        } else if (annotation.measureType === '') {
            if (annotation.shapeAnnotationType === 'Line') {
                annotSettings = { type: 'Shape', subType: 'Line', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes, customData: annotation.customData };
            } else if (annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead') {
                annotSettings = { type: 'Shape', subType: 'Arrow', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes, customData: annotation.customData };
            } else if (annotation.shapeAnnotationType === 'Rectangle') {
                annotSettings = {
                    type: 'Shape', subType: 'Rectangle', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness, customData: annotation.customData
                };
            } else if (annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse') {
                annotSettings = {
                    type: 'Shape', subType: 'Circle', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness, customData: annotation.customData
                };
            } else if (annotation.shapeAnnotationType === 'Polygon') {
                annotSettings = {
                    type: 'Shape', subType: 'Polygon', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness, customData: annotation.customData
                };
            }
        } else if (annotation.measureType !== '') {
            if (annotation.measureType === 'Distance') {
                annotSettings = { type: 'Measure', subType: 'Distance', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes, customData: annotation.customData };
            } else if (annotation.measureType === 'Perimeter') {
                annotSettings = { type: 'Measure', subType: 'Perimeter', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes, customData: annotation.customData };
            } else if (annotation.measureType === 'Area') {
                annotSettings = {
                    type: 'Measure', subType: 'Area', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness, customData: annotation.customData
                };
            } else if (annotation.measureType === 'Radius') {
                annotSettings = {
                    type: 'Measure', subType: 'Radius', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness, customData: annotation.customData
                };
            } else if (annotation.measureType === 'Volume') {
                annotSettings = {
                    type: 'Measure', subType: 'Volume', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness, calibrate: annotation.calibrate,
                    annotationId: annotation.annotName, customData: annotation.customData
                };
            }
        }
        let overlappedCollection: any = [];
        let overlappedAnnotations: any = this.getOverlappedAnnotations(annotation, pageNumber);
        if (overlappedAnnotations && this.overlappedCollections) {
            const overlappedCollections: any = [];
            for (let i: number = 0; i < overlappedAnnotations.length; i++) {
                if ((overlappedAnnotations[parseInt(i.toString(), 10)].shapeAnnotationType !== 'textMarkup' && this.overlappedCollections && this.overlappedCollections.length > 0) || isSelected) {
                    for (let j: number = 0; j < this.overlappedCollections.length; j++) {
                        if (overlappedAnnotations[parseInt(i.toString(), 10)].annotName ===
                         this.overlappedCollections[parseInt(j.toString(), 10)].annotName) {
                            overlappedCollections.push(overlappedAnnotations[parseInt(i.toString(), 10)]);
                            break;
                        }
                    }
                } else {
                    overlappedCollections.push(overlappedAnnotations[parseInt(i.toString(), 10)]);
                }
            }
            overlappedAnnotations = overlappedCollections;
        }
        if (this.pdfViewer.enableMultiLineOverlap) {
            for (let i: number = 0; i < overlappedAnnotations.length; i++) {
                if (overlappedAnnotations[parseInt(i.toString(), 10)].shapeAnnotationType === 'textMarkup') {
                    let isOverlapped: boolean = false;
                    for (let j: number = 0; j < overlappedAnnotations[parseInt(i.toString(), 10)].bounds.length; j++) {
                        const bounds: any =
                         this.orderTextMarkupBounds(overlappedAnnotations[parseInt(i.toString(), 10)].bounds[parseInt(j.toString(), 10)]);
                        const clickedPosition: any = this.textMarkupAnnotationModule.annotationClickPosition;
                        if (clickedPosition && (clickedPosition.x || clickedPosition.y)) {
                            if (bounds.left <= clickedPosition.x && (bounds.left + bounds.width) >= clickedPosition.x) {
                                if (bounds.top <= clickedPosition.y && (bounds.top + bounds.height) >= clickedPosition.y) {
                                    isOverlapped = true;
                                }
                            }
                        } else {
                            isOverlapped = true;
                        }
                    }
                    if (!isOverlapped) {
                        overlappedAnnotations.splice(i, 1);
                    }
                }
            }
        }
        if (overlappedAnnotations && overlappedAnnotations.length > 0) {
            annotationCollection = overlappedAnnotations;
            for (let i: number = 0; i < annotationCollection.length; i++) {
                const overlappedObject: any = cloneObject(annotationCollection[parseInt(i.toString(), 10)]);
                overlappedObject.annotationId = annotationCollection[parseInt(i.toString(), 10)].annotName;
                if (annotationId === annotationCollection[parseInt(i.toString(), 10)].annotName && annotation.measureType && annotation.measureType === 'Volume') {
                    annotSettings.calibrate = annotationCollection[parseInt(i.toString(), 10)].calibrate;
                }
                delete overlappedObject.annotName;
                overlappedCollection.push(overlappedObject);
            }
        } else {
            overlappedCollection = null;
        }
        this.addFreeTextProperties(annotation, annotSettings);
        const annotationAddMode: string = annotation.annotationAddMode;
        if (!isDblClick) {
            if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
                if (!this.pdfViewerBase.isNewStamp && this.annotationSelected) {
                    if (overlappedCollection) {
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, overlappedCollection, null,
                                                            null, annotationAddMode);
                    } else {
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, null, null, null, annotationAddMode);
                    }
                }
            } else {
                const module: TextMarkupAnnotation = this.textMarkupAnnotationModule;
                let multiPageCollection: ITextMarkupAnnotation[] = module && module.multiPageCollectionList(annotation);
                if (multiPageCollection && multiPageCollection.length === 0) {
                    multiPageCollection = null;
                }
                if (this.annotationSelected) {
                    if (overlappedCollection) {
                        isSelected = false;
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, overlappedCollection,
                                                            multiPageCollection, isSelected, annotationAddMode);
                    } else {
                        isSelected = true;
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, null, multiPageCollection,
                                                            isSelected, annotationAddMode);
                    }
                    if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.redactionToolbarModule) {
                        this.pdfViewer.toolbar.redactionToolbarModule.showHideDeleteIcon(true);
                    }
                }
            }
        } else {
            if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
                if (!this.pdfViewerBase.isNewStamp) {
                    this.pdfViewer.fireAnnotationDoubleClick(annotationId, pageNumber, annotSettings);
                }
            } else {
                this.pdfViewer.fireAnnotationDoubleClick(annotationId, pageNumber, annotSettings);
            }
        }
        this.annotationSelected = true;
    }

    public selectSignature(signatureId: string, pageNumber: number, signatureModule: PdfAnnotationBaseModel): void {
        const annotBounds: PdfBoundsModel = signatureModule.bounds;
        const bounds: any = { height: annotBounds.height, width: annotBounds.width, x: annotBounds.x, y: annotBounds.y };
        if (!this.pdfViewerBase.signatureAdded && signatureModule.signatureName !== 'ink') {
            const signature: object = { bounds: bounds, opacity: signatureModule.opacity, thickness: signatureModule.thickness,
                strokeColor: signatureModule.strokeColor };
            this.pdfViewer.fireSignatureSelect(signatureId, pageNumber, signature);
        }
    }

    /**
     *
     * @param {string} signatureId - Gets the id of the signature
     * @param {number} pageNumber - Gets the page number value
     * @param {any} signatureModule - It describes about the signature module
     * @private
     * @returns {void}
     */
    public unselectSignature(signatureId: string, pageNumber: number, signatureModule: any): void {
        const annotBounds: any = signatureModule.bounds;
        const bounds: any = { height: annotBounds.height, width: annotBounds.width, x: annotBounds.x, y: annotBounds.y };
        if (!this.pdfViewerBase.signatureAdded) {
            const signature: object = { bounds: bounds, opacity: signatureModule.opacity, thickness: signatureModule.thickness,
                strokeColor: signatureModule.strokeColor };
            this.pdfViewer.fireSignatureUnselect(signatureId, pageNumber, signature);
        }
    }

    public editSignature(signature: any): void {
        let currentAnnotation: any;
        if (signature.uniqueKey) {
            currentAnnotation = (this.pdfViewer.nameTable as any)[signature.uniqueKey];
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        let pageNumber: number = currentAnnotation.pageIndex;
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
            const clonedObject: any = cloneObject(currentAnnotation);
            const redoClonedObject: any = cloneObject(currentAnnotation);
            if (!(isNullOrUndefined(signature.opacity)) || currentAnnotation.opacity !== signature.opacity) {
                redoClonedObject.opacity = signature.opacity;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: signature.opacity });
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName,
                                                             currentAnnotation.shapeAnnotationType as AnnotationType, false, true,
                                                             false, clonedObject.opacity,
                                                             redoClonedObject.opacity);
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
            }
            if (currentAnnotation.strokeColor !== signature.strokeColor) {
                redoClonedObject.strokeColor = signature.strokeColor;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: signature.strokeColor });
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName,
                                                             currentAnnotation.shapeAnnotationType as AnnotationType, true, false,
                                                             false, clonedObject.strokeColor,
                                                             redoClonedObject.strokeColor);
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
            }
            if (currentAnnotation.thickness !== signature.thickness) {
                redoClonedObject.thickness = signature.thickness;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: signature.thickness });
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName,
                                                             currentAnnotation.shapeAnnotationType as AnnotationType, false, false,
                                                             true, clonedObject.thickness,
                                                             redoClonedObject.thickness);
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
            }
            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
            if (currentAnnotation.shapeAnnotationType === 'SignatureText' && currentAnnotation.wrapper && currentAnnotation.wrapper.children && currentAnnotation.wrapper.children.length > 1 && currentAnnotation.wrapper.children[1]) {
                currentAnnotation.wrapper.bounds.x = currentAnnotation.bounds.x + currentAnnotation.wrapper.pivot.x +
                (this.pdfViewerBase.signatureModule.signatureTextContentLeft - (this.pdfViewerBase.signatureModule.signatureTextContentTop *
                    (zoomvalue - (zoomvalue / this.pdfViewerBase.signatureModule.signatureTextContentLeft))));

                currentAnnotation.wrapper.bounds.y = currentAnnotation.bounds.y + ((currentAnnotation.wrapper.children[1].bounds.y -
                    currentAnnotation.bounds.y) - (currentAnnotation.wrapper.children[1].bounds.y - currentAnnotation.bounds.y) / 3) +
                    currentAnnotation.wrapper.pivot.y + (this.pdfViewerBase.signatureModule.signatureTextContentTop * zoomvalue);
            }
            this.calculateAnnotationBounds(currentAnnotation, signature);
            if (currentAnnotation.shapeAnnotationType === 'SignatureText') {
                const oldObjectWidth: number = (clonedObject.bounds && clonedObject.bounds.width) ?
                    clonedObject.bounds.width : clonedObject.width;
                const boundsRatio: number = signature.bounds.width / oldObjectWidth;
                currentAnnotation.fontSize = signature.fontSize * boundsRatio;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { fontSize: currentAnnotation.fontSize });
            }
            currentAnnotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            if (currentAnnotation.status !== 'NewlyAdded') {
                currentAnnotation.status = AnnotationStatus.ExistingModified;
            }
            if (!isNullOrUndefined(signature.pageNumber) && signature.pageNumber !== currentAnnotation.pageNumber) {
                const movePerformed: boolean = this.moveAnnotationAcrossPages(currentAnnotation, signature, false, true);
                pageNumber = currentAnnotation.pageNumber;
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName,
                                                             currentAnnotation.shapeAnnotationType as AnnotationType, true, false,
                                                             false, clonedObject.strokeColor, redoClonedObject.strokeColor);
                if (movePerformed) {
                    // Cross-page move completed successfully
                    this.isEdited = false;
                }
            }
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.signatureModule.modifySignatureCollection(null, pageNumber, currentAnnotation, true);
        }
    }

    private deletComment(commentDiv: HTMLElement): void {
        if (this.pdfViewer.readOnlySettings.comments) {
            return;
        }
        if (commentDiv.parentElement.firstChild === commentDiv) {
            this.deleteAnnotation();
        } else {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.modifyCommentDeleteProperty(commentDiv.parentElement, commentDiv);
        }
    }

    private addReplyComments(currentAnnotation: any, replyComment: string[], commentType: string): void {
        if (commentType === 'add') {
            const commentsMainDiv: HTMLElement = document.getElementById(currentAnnotation.annotName);
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.createCommentDiv(commentsMainDiv);
            for (let j: number = 0; j < replyComment.length; j++) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    saveCommentDiv(commentsMainDiv, replyComment[parseInt(j.toString(), 10)]);
            }
        } else if (commentType === 'next') {
            const commentsMainDiv: HTMLElement = document.getElementById(currentAnnotation.annotationId);
            this.selectAnnotation(currentAnnotation);
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveCommentDiv(commentsMainDiv, replyComment);

        }
    }

    private editComments(commentId: string, editComment: string): void {
        const commentDiv: any = (this.pdfViewer.element as HTMLElement).querySelector('[id="' + commentId + '"]');
        if (commentDiv && commentDiv.childNodes[1] && commentDiv.childNodes[1].ej2_instances) {
            commentDiv.childNodes[1].ej2_instances[0].value = editComment;
        }
    }

    private isSameAnnotationForMove(annotation: any, currentAnnotation: any): boolean {
        if (isNullOrUndefined(annotation) || isNullOrUndefined(currentAnnotation)) {
            return false;
        }
        // Primary: annotationId <-> annotName / annotationId (all annotation types)
        const incomingId: string = annotation.annotationId;
        if (!isNullOrUndefined(incomingId) && incomingId !== '') {
            return incomingId === currentAnnotation.annotName ||
                incomingId === currentAnnotation.annotationId;
        }
        // Fallback: uniqueKey <-> id (types that carry uniqueKey)
        if (!isNullOrUndefined(annotation.uniqueKey) && !isNullOrUndefined(currentAnnotation.id)) {
            return annotation.uniqueKey === currentAnnotation.id;
        }
        return false;
    }

    /**
     * Updates the existing properties of the specified annotation object.
     *
     * @param {any} annotation - The annotation object that contains the properties to be updated.
     * The object should include valid annotation properties such as type, bounds, color, opacity, etc.
     * Modifying these properties will update the annotation in the PDF Viewer accordingly.
     *
     * @remarks
     * This method will apply the changes to the annotation and refresh the viewer to reflect the updated properties.
     */

    public editAnnotation(annotation: any): void {
        if (this.pdfViewer.readOnlySettings.annotations) {
            return;
        }
        let currentAnnotation: any;
        let annotationId: string;
        let annotationType: string;
        let pageNumber: number;
        let isTextMarkupUpdate: boolean = false;
        let textMarkupAnnotation: any;
        if (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule) &&
        !isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) {
            textMarkupAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        }
        if ((textMarkupAnnotation && (!annotation.annotationId || !annotation.uniqueKey) &&
         (annotation.annotationId === textMarkupAnnotation.annotName))) {
            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
            annotationId = currentAnnotation.annotName;
            pageNumber = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        } else {
            if (this.pdfViewer.selectedItems.annotations[0]) {
                currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
                annotationId = currentAnnotation.annotName;
                pageNumber = currentAnnotation.pageIndex;
            }
        }
        if (annotation.uniqueKey !== undefined) {
            currentAnnotation = (this.pdfViewer.nameTable as any)[annotation.uniqueKey];
            if (currentAnnotation && currentAnnotation.annotationSettings &&
                !isNullOrUndefined(currentAnnotation.annotationSettings.isLock)) {
                currentAnnotation.annotationSettings.isLock = annotation.annotationSettings ? annotation.annotationSettings.isLock : false;
                if (currentAnnotation.annotationSettings.isLock && !isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0])) {
                    if ((annotation.allowedInteractions.includes('Select') || annotation.allowedInteractions.includes('Move') || annotation.allowedInteractions.includes('Delete') || annotation.allowedInteractions.includes('PropertyChange'))) {
                        this.pdfViewer.renderSelector(currentAnnotation.pageIndex, currentAnnotation.annotationSelectorSettings);
                    }
                    if (annotation.allowedInteractions.length === 1 && annotation.allowedInteractions.includes('None')) {
                        this.pdfViewer.clearSelection(currentAnnotation.pageIndex);
                    }
                    if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                        if (!annotation.allowedInteractions.includes('PropertyChange')) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.resetFreeTextAnnot();
                        }
                        if (!annotation.allowedInteractions.includes('Delete')) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(false, true);
                        }
                    }
                }
                this.isEdited = true;
            }
            annotationId = currentAnnotation.annotName;
            pageNumber = currentAnnotation.pageIndex;
            if (isBlazor()) {
                if (annotation.allowedInteractions) {
                    const allowedInteractionsCount: number = annotation.allowedInteractions.length;
                    for (let i: number = 0; i < allowedInteractionsCount; i++) {
                        if (annotation.allowedInteractions[parseInt(i.toString(), 10)] === 0) {
                            annotation.allowedInteractions[parseInt(i.toString(), 10)] = AllowedInteraction.Select;
                        }
                        if (annotation.allowedInteractions[parseInt(i.toString(), 10)] === 1) {
                            annotation.allowedInteractions[parseInt(i.toString(), 10)] = AllowedInteraction.Move;
                        }
                        if (annotation.allowedInteractions[parseInt(i.toString(), 10)] === 2) {
                            annotation.allowedInteractions[parseInt(i.toString(), 10)] = AllowedInteraction.Resize;
                        }
                        if (annotation.allowedInteractions[parseInt(i.toString(), 10)] === 3) {
                            annotation.allowedInteractions[parseInt(i.toString(), 10)] = AllowedInteraction.Delete;
                        }
                        if (annotation.allowedInteractions[parseInt(i.toString(), 10)] === 4) {
                            annotation.allowedInteractions[parseInt(i.toString(), 10)] = AllowedInteraction.PropertyChange;
                        }
                        if (annotation.allowedInteractions[parseInt(i.toString(), 10)] === 5) {
                            annotation.allowedInteractions[parseInt(i.toString(), 10)] = AllowedInteraction.None;
                        }
                    }
                }
            }
            if (annotation.allowedInteractions &&  currentAnnotation.allowedInteractions !== annotation.allowedInteractions)
            {
                this.isEdited = true;
            }
            currentAnnotation.allowedInteractions = annotation.allowedInteractions ?
                annotation.allowedInteractions : this.updateAnnotationAllowedInteractions(annotation);
        }
        if (!currentAnnotation) {
            if (annotation.shapeAnnotationType === 'sticky' && annotation.annotationId !== undefined) {
                currentAnnotation = (this.pdfViewer.nameTable as any)[annotation.annotationId];
                if (currentAnnotation) {
                    currentAnnotation.annotationSettings.isLock = annotation.annotationSettings.isLock;
                    annotationId = currentAnnotation.annotName;
                    pageNumber = currentAnnotation.pageIndex;
                    this.isEdited = true;
                }
            }
        }
        if (annotation.shapeAnnotationType === 'textMarkup') {
            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                getAnnotations(annotation.pageNumber, annotation);
            for (let i: number = 0; i < currentAnnotation.length; i++) {
                if (annotation.annotationId === currentAnnotation[parseInt(i.toString(), 10)].annotName) {
                    isTextMarkupUpdate = true;
                    currentAnnotation = currentAnnotation[parseInt(i.toString(), 10)];
                    currentAnnotation.isPrint = annotation.isPrint;
                    this.textMarkupAnnotationModule.currentTextMarkupAnnotation = currentAnnotation;
                    this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = currentAnnotation.pageNumber;
                    currentAnnotation.allowedInteractions = annotation.allowedInteractions;
                    pageNumber = currentAnnotation.pageNumber;
                    annotationId = annotation.annotationId;
                    this.isEdited = true;
                    break;
                }
            }
        }
        if (annotation.shapeAnnotationType === 'Redaction' && annotation.annotationAddMode === 'TextRedaction') {
            const annotationKeys: string[] = Object.keys(this.pdfViewer.nameTable);
            let annotObject: any;
            for (let i: number = 0; i < annotationKeys.length; i++) {
                annotObject = (this.pdfViewer.nameTable as any)[annotationKeys[parseInt(i.toString(), 10)]];
                if (!isNullOrUndefined(annotObject) && annotation.annotName === annotObject.annotName) {
                    currentAnnotation = (this.pdfViewer.nameTable as any)[annotationKeys[parseInt(i.toString(), 10)]];
                    annotationId = currentAnnotation.annotName;
                    pageNumber = currentAnnotation.pageIndex;
                    break;
                }
            }
        }
        if (currentAnnotation) {
            const clonedObject: any = cloneObject(currentAnnotation);
            const redoClonedObject: any = cloneObject(currentAnnotation);
            // Handle cross-page annotation move via pageNumber property update
            const currentAnnotationPageNumber: number = !isNullOrUndefined(currentAnnotation.pageNumber) ?
                currentAnnotation.pageNumber : currentAnnotation.pageIndex;
            const isSameAnnotation: boolean = this.isSameAnnotationForMove(annotation, currentAnnotation);
            const isCrossPageMove: boolean = isSameAnnotation &&
                !isNullOrUndefined(annotation.pageNumber) &&
                annotation.pageNumber !== currentAnnotationPageNumber;
            if (isCrossPageMove) {
                const movePerformed: boolean = this.moveAnnotationAcrossPages(currentAnnotation, annotation, false, true);
                pageNumber = currentAnnotationPageNumber;
                if (movePerformed) {
                    // Cross-page move completed successfully
                    this.isEdited = false;
                }
            }
            if (annotation.shapeAnnotationType === 'textMarkup') {
                annotationType = 'textMarkup';
            }
            if (annotation && annotation.isCommentLock === true) {
                currentAnnotation.isCommentLock = annotation.isCommentLock;
                this.isEdited = true;
            }
            if (annotation && annotation.shapeAnnotationType !== 'Link' && JSON.stringify(currentAnnotation.annotationSelectorSettings) !== JSON.stringify(annotation.annotationSelectorSettings) && ((!isNullOrUndefined(annotation.type) && annotation.type !== 'TextMarkup') || (!isNullOrUndefined(annotation.shapeAnnotationType) && annotation.shapeAnnotationType !== 'textMarkup'))) {
                currentAnnotation.annotationSelectorSettings = annotation.annotationSelectorSettings;
                redoClonedObject.annotationSelectorSettings = annotation.annotationSelectorSettings;
                this.isEdited = true;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { annotationSelectorSettings: annotation.annotationSelectorSettings });
                this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
            }
            if (annotation.comments) {
                for (let j: number = 0; j < annotation.comments.length; j++) {
                    if (annotation.comments[parseInt(j.toString(), 10)].isLock === true) {
                        if (annotationType) {
                            currentAnnotation.comments = annotation.comments;
                            currentAnnotation.comments[parseInt(j.toString(), 10)].isLock =
                             annotation.comments[parseInt(j.toString(), 10)].isLock;
                        } else {
                            currentAnnotation.properties.comments = annotation.comments;
                            currentAnnotation.properties.comments[parseInt(j.toString(), 10)].isLock =
                             annotation.comments[parseInt(j.toString(), 10)].isLock;
                        }
                        this.isEdited = true;
                    }
                }
            }
            if (!this.pdfViewer.readOnlySettings.comments && annotation && annotation.note !== '' && annotation.note !== undefined) {
                if (annotationType) {
                    currentAnnotation.note = annotation.note;
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                        addTextToComments(currentAnnotation.annotName, currentAnnotation.note);
                } else {
                    currentAnnotation.notes = annotation.note;
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                        addTextToComments(currentAnnotation.annotName, currentAnnotation.notes);
                }
                if (annotation.labelSettings && annotation.labelSettings.labelContent !== annotation.note) {
                    annotation.labelSettings.labelContent = annotation.note;
                }
                this.isEdited = true;
            } else {
                if (annotation && annotation.isCommentLock && ((annotation.type && annotation.type !== 'FreeText' ) || annotation.shapeAnnotationType !== 'FreeText')) {
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addTextToComments(currentAnnotation.annotName, '  ');
                    this.isEdited = true;
                }
            }
            if (!this.pdfViewer.readOnlySettings.comments && annotation.commentId && annotation.editComment && annotation.commentType === 'edit') {
                this.editComments(annotation.commentId, annotation.editComment);
                this.isEdited = true;
            }
            if (!this.pdfViewer.readOnlySettings.comments && annotation.replyComment && annotation.commentType === 'add') {
                this.addReplyComments(currentAnnotation, annotation.replyComment, annotation.commentType);
                this.pdfViewer.annotationCollection[0].note = annotation.note;
                this.isEdited = true;
            }
            if (!this.pdfViewer.readOnlySettings.comments && annotation.nextComment && annotation.commentType === 'next') {
                this.addReplyComments(annotation, annotation.nextComment, annotation.commentType);
                this.isEdited = true;
            }
            if (!this.pdfViewer.readOnlySettings.comments && isNullOrUndefined(annotation.commentId) && annotation.commentType === 'delete') {
                const repliesDiv: any = (this.pdfViewer.element as HTMLElement).querySelectorAll('.e-pv-more-options-button');
                for (let i: number = 0; i < repliesDiv.length; i++) {
                    if (repliesDiv[parseInt(i.toString(), 10)].style.visibility === 'visible') {
                        const activeReplyDiv: any = repliesDiv[parseInt(i.toString(), 10)].parentElement.nextSibling;
                        const isLocked: boolean = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                            checkIslockProperty(activeReplyDiv);
                        if (activeReplyDiv && !isLocked) {
                            this.deletComment(activeReplyDiv.parentElement);
                            this.isEdited = true;
                        }
                        break;
                    }
                }
            }
            if (!this.pdfViewer.readOnlySettings.comments && annotation.comments && annotation.commentType === 'delete') {
                const repliesDiv: any = (this.pdfViewer.element as HTMLElement).querySelectorAll('.e-pv-more-options-button');
                if (repliesDiv && annotation.commentId) {
                    for (let i: number = 0; i < annotation.comments.length; i++) {
                        if (annotation.comments[parseInt(i.toString(), 10)].annotName === annotation.commentId) {
                            const activeReplyDiv: any = repliesDiv[parseInt((i + 1).toString(), 10)].parentElement.parentElement;
                            const isLocked: boolean = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                                checkIslockProperty(activeReplyDiv);
                            if (activeReplyDiv && !isLocked) {
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule
                                    .modifyCommentDeleteProperty(activeReplyDiv.parentElement, activeReplyDiv);
                                this.isEdited = true;
                            }
                            break;
                        }
                    }
                }
            }
            if (annotation.type === 'TextMarkup' || annotation.shapeAnnotationType === 'textMarkup') {
                if (currentAnnotation.annotationSettings && annotation.annotationSettings) {
                    if (currentAnnotation.annotationSettings.isLock !== annotation.annotationSettings.isLock) {
                        const pageAnnotations: ITextMarkupAnnotation[] = this.textMarkupAnnotationModule.modifyAnnotationProperty('AnnotationSettings', annotation.annotationSettings.isLock, null);
                        this.isEdited = true;
                        this.textMarkupAnnotationModule.manageAnnotations(pageAnnotations,
                                                                          this.textMarkupAnnotationModule.selectTextMarkupCurrentPage);
                    }
                }
                if (annotation && JSON.stringify(currentAnnotation.annotationSelectorSettings) !==
                JSON.stringify(annotation.annotationSelectorSettings)) {
                    const pageAnnotations: ITextMarkupAnnotation[] = this.textMarkupAnnotationModule.modifyAnnotationProperty('AnnotationSelectorSettings', annotation.annotationSelectorSettings, null);
                    this.isEdited = true;
                    this.textMarkupAnnotationModule.manageAnnotations(pageAnnotations,
                                                                      this.textMarkupAnnotationModule.selectTextMarkupCurrentPage);
                }
                if (currentAnnotation.opacity !== annotation.opacity) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(null, annotation.opacity);
                    this.isEdited = true;
                }
                if (currentAnnotation.color !== annotation.color) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(annotation.color);
                    this.isEdited = true;
                }
                if (JSON.stringify(currentAnnotation.bounds) !== JSON.stringify(annotation.bounds)) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyBoundsProperty(annotation.bounds);
                    this.isEdited = true;
                }
                annotationType = 'textMarkup';
                if (isTextMarkupUpdate) {
                    this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                }
            } else if (annotation && annotation.stampAnnotationType === 'image' && annotation.shapeAnnotationType === 'stamp' && annotation.stampAnnotationPath) {
                annotationType = 'stamp';
                if (currentAnnotation.data !== annotation.stampAnnotationPath) {
                    currentAnnotation.data = annotation.stampAnnotationPath;
                    currentAnnotation.wrapper.children[0].imageSource = annotation.stampAnnotationPath;
                    this.pdfViewer.renderDrawing(null, pageNumber);
                    this.isEdited = true;
                }
                if (!(isNullOrUndefined(annotation.opacity)) && currentAnnotation.opacity !== annotation.opacity) {
                    redoClonedObject.opacity = annotation.opacity;
                    this.annotationPropertyChange(currentAnnotation, annotation.opacity, 'Shape Opacity', clonedObject, redoClonedObject);
                    this.isEdited = true;
                }
                this.calculateAnnotationBounds(currentAnnotation, annotation);
            } else if (annotation.type === 'StickyNotes' || annotation.type === 'Stamp' || annotation.shapeAnnotationType === 'sticky' || annotation.shapeAnnotationType === 'stamp') {
                if (!(isNullOrUndefined(annotation.opacity))  && currentAnnotation.opacity !== annotation.opacity) {
                    redoClonedObject.opacity = annotation.opacity;
                    this.annotationPropertyChange(currentAnnotation, annotation.opacity, 'Shape Opacity', clonedObject, redoClonedObject);
                    this.isEdited = true;
                }
                this.calculateAnnotationBounds(currentAnnotation, annotation);
                if (annotation.type === 'StickyNotes' || annotation.shapeAnnotationType === 'sticky') {
                    annotationType = 'sticky';
                } else {
                    annotationType = 'stamp';
                }
            } else if (annotation.type === 'Ink' || annotation.type === 'Shape' || annotation.type === 'Measure' || annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Polygon' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Ink' || annotation.shapeAnnotationType === 'Link') {
                if (annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Radius' || annotation.shapeAnnotationType === 'Ink' || annotation.shapeAnnotationType === 'Link') {
                    this.calculateAnnotationBounds(currentAnnotation, annotation);
                    if (annotation.indent === 'PolygonRadius') {
                        this.updateCalibrateValues(currentAnnotation);
                        annotation.note = currentAnnotation.notes;
                    }
                }
                if (!(isNullOrUndefined(annotation.opacity)) && currentAnnotation.opacity !== annotation.opacity) {
                    redoClonedObject.opacity = annotation.opacity;
                    this.annotationPropertyChange(currentAnnotation, annotation.opacity, 'Shape Opacity', clonedObject, redoClonedObject);
                    this.isEdited = true;
                }
                if (annotation.fillColor && currentAnnotation.fillColor !== annotation.fillColor) {
                    redoClonedObject.fillColor = annotation.fillColor;
                    this.isEdited = true;
                    if (annotation.labelSettings && annotation.labelSettings.fillColor) {
                        annotation.labelSettings.fillColor = annotation.fillColor;
                    }
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fillColor: annotation.fillColor });
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
                }
                if (annotation.strokeColor && currentAnnotation.strokeColor !== annotation.strokeColor) {
                    redoClonedObject.strokeColor = annotation.strokeColor;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: annotation.strokeColor });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
                }
                if (annotation.leaderLength && currentAnnotation.leaderHeight !== annotation.leaderLength) {
                    redoClonedObject.leaderHeight = annotation.leaderLength;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, {leaderHeight: annotation.leaderLength});
                }
                if (annotation.thickness && currentAnnotation.thickness !== annotation.thickness) {
                    redoClonedObject.thickness = annotation.thickness;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: annotation.thickness });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.subject !== annotation.subject) {
                    redoClonedObject.subject = annotation.subject;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { subject: annotation.subject });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                }
                if (annotation.shapeAnnotationType !== 'Link' && currentAnnotation.modifiedDate !== annotation.modifiedDate) {
                    redoClonedObject.modifiedDate = annotation.modifiedDate;
                    if (!this.isUndoRedoAction || annotationType !== 'redaction') {
                        this.isEdited = true;
                    }
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { modifiedDate: annotation.modifiedDate });
                }
                if (currentAnnotation.subject !== annotation.subject) {
                    redoClonedObject.subject = annotation.subject;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { subject: annotation.subject });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
                }
                if (this.pdfViewer.enableShapeLabel && currentAnnotation.fontColor !== annotation.fontColor) {
                    redoClonedObject.fontColor = annotation.fontColor;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fontColor: annotation.fontColor });
                }
                if (this.pdfViewer.enableShapeLabel && annotation.labelSettings && annotation.labelSettings.fillColor) {
                    if (currentAnnotation.labelFillColor !== annotation.labelSettings.fillColor) {
                        redoClonedObject.labelFillColor = annotation.labelSettings.fillColor;
                        this.isEdited = true;
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { labelFillColor: annotation.labelSettings.fillColor });
                    }
                    if (currentAnnotation.labelContent !== annotation.labelSettings.labelContent) {
                        redoClonedObject.labelContent = annotation.labelSettings.labelContent;
                        this.isEdited = true;
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { labelContent: annotation.labelSettings.labelContent });
                    }
                }
                if (annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Polygon') {
                    if (JSON.stringify(currentAnnotation.vertexPoints) !== JSON.stringify(annotation.vertexPoints)) {
                        currentAnnotation.vertexPoints = annotation.vertexPoints;
                        this.isEdited = true;
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { vertexPoints: annotation.vertexPoints });
                        if (annotation.indent === 'LineDimension' || annotation.indent === 'PolyLineDimension' || annotation.indent === 'PolygonDimension' || annotation.indent === 'PolygonVolume') {
                            this.updateCalibrateValues(currentAnnotation);
                            annotation.note = currentAnnotation.notes;
                        }
                        this.pdfViewer.renderSelector(currentAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
                    }
                }
                if (annotation.subType === 'Line' || annotation.subType === 'Arrow' || annotation.subType === 'Distance' || annotation.subType === 'Perimeter') {
                    let isSourceDecoraterShapesChanged: boolean = false;
                    let isTargetDecoraterShapesChanged: boolean = false;
                    let isBorderDashArrayChanged: boolean = false;
                    clonedObject.lineHeadStart = currentAnnotation.sourceDecoraterShapes;
                    clonedObject.lineHeadEnd = currentAnnotation.taregetDecoraterShapes;
                    redoClonedObject.lineHeadStart = annotation.lineHeadStartStyle;
                    redoClonedObject.lineHeadEnd = annotation.lineHeadEndStyle;
                    redoClonedObject.borderDashArray = annotation.borderDashArray;
                    this.isEdited = true;
                    if (currentAnnotation.taregetDecoraterShapes !== annotation.lineHeadEndStyle) {
                        isTargetDecoraterShapesChanged = true;
                    }
                    if (currentAnnotation.sourceDecoraterShapes !== annotation.lineHeadStartStyle) {
                        isSourceDecoraterShapesChanged = true;
                    }
                    if (currentAnnotation.borderDashArray !== annotation.borderDashArray) {
                        isBorderDashArrayChanged = true;
                    }
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { sourceDecoraterShapes: annotation.lineHeadStartStyle,
                        taregetDecoraterShapes: annotation.lineHeadEndStyle, borderDashArray: annotation.borderDashArray });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false,
                                                     isSourceDecoraterShapesChanged, isTargetDecoraterShapesChanged,
                                                     isBorderDashArrayChanged);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Line properties change', '', clonedObject, redoClonedObject);
                }
                if (annotation.type === 'Shape' || annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Polygon') {
                    annotationType = 'shape';
                }
                if (annotation.shapeAnnotationType === 'Link') {
                    annotationType = 'link';
                }
                if (annotation.type === 'Ink' || annotation.shapeAnnotationType === 'Ink') {
                    annotationType = 'ink';
                }
                if (annotation.type === 'Measure' || annotation.indent === 'LineDimension' || annotation.indent === '1' || annotation.indent === 'PolyLineDimension' || annotation.indent === 'PolygonDimension' || annotation.indent === 'PolygonRadius' || annotation.indent === 'PolygonVolume') {
                    annotationType = 'shape_measure';
                }
                if (annotation.labelSettings && this.pdfViewer.enableShapeLabel) {
                    this.updateFreeTextProperties(currentAnnotation);
                    this.pdfViewer.nodePropertyChange(currentAnnotation, {
                        labelOpacity: annotation.labelSettings.opacity, fontColor: annotation.labelSettings.fontColor,
                        fontSize: annotation.labelSettings.fontSize, fontFamily: annotation.labelSettings.fontFamily,
                        labelContent: currentAnnotation.notes, labelFillColor: annotation.labelSettings.fillColor
                    });
                    this.isEdited = true;
                }
                if (this.pdfViewer.enableShapeLabel && annotation.calibrate && annotation.calibrate.depth) {
                    if (this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth !== annotation.calibrate.depth) {
                        this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth = annotation.calibrate.depth;
                        currentAnnotation.notes = this.pdfViewer.annotationModule.measureAnnotationModule.
                            calculateVolume(currentAnnotation.vertexPoints, currentAnnotation.id, currentAnnotation.pageIndex);
                        currentAnnotation.labelContent = currentAnnotation.notes;
                        this.isEdited = true;
                        if (annotation.labelSettings && annotation.labelSettings.labelContent) {
                            annotation.labelSettings.labelContent = currentAnnotation.notes;
                        }
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { labelContent: currentAnnotation.labelContent });
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                            addTextToComments(currentAnnotation.annotName, currentAnnotation.notes);
                    }
                }
            } else if (annotation.type === 'Redaction' || annotation.shapeAnnotationType === 'Redaction') {
                annotationType = 'redaction';
                // Calculate bounds if needed
                this.calculateAnnotationBounds(currentAnnotation, annotation);
                if (this.boundsChanged) {
                    this.pdfViewer.drawing.select([annotation.uniqueKey], this.pdfViewer.annotationSelectorSettings);
                    this.modifyInCollections(currentAnnotation, 'bounds');
                    this.boundsChanged = false;
                }
                // Handle fillColor changes
                if (annotation.fillColor && currentAnnotation.fillColor !== annotation.fillColor) {
                    redoClonedObject.fillColor = annotation.fillColor;
                    currentAnnotation.fillColor = annotation.fillColor;
                    this.modifyInCollections(currentAnnotation, 'fillColor');
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                }
                // Handle markerFillColor changes
                if (annotation.markerFillColor && currentAnnotation.markerFillColor !== annotation.markerFillColor) {
                    redoClonedObject.markerFillColor = annotation.markerFillColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { markerFillColor: annotation.markerFillColor });
                    this.modifyInCollections(currentAnnotation, 'fill');
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                }
                // Handle markerBorderColor changes
                if (annotation.markerBorderColor && currentAnnotation.markerBorderColor !== annotation.markerBorderColor) {
                    redoClonedObject.markerBorderColor = annotation.markerBorderColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { markerBorderColor: annotation.markerBorderColor });
                    this.modifyInCollections(currentAnnotation, 'stroke');
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                }
                // Handle markerOpacity changes
                if (!isNullOrUndefined(annotation.markerOpacity) && currentAnnotation.markerOpacity !== annotation.markerOpacity) {
                    redoClonedObject.markerOpacity = annotation.markerOpacity;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { markerOpacity: annotation.markerOpacity });
                    this.modifyInCollections(currentAnnotation, 'opacity');
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                }
                // Handle overlayText changes
                if (!isNullOrUndefined(annotation.overlayText) && currentAnnotation.overlayText !== annotation.overlayText) {
                    redoClonedObject.overlayText = annotation.overlayText;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { overlayText: annotation.overlayText });
                    this.modifyInCollections(currentAnnotation, 'overlayText');
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                }
                // Handle fontColor changes
                if (annotation.fontColor && currentAnnotation.fontColor !== annotation.fontColor) {
                    currentAnnotation.fontColor = annotation.fontColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fontColor: annotation.fontColor });
                    this.modifyInCollections(currentAnnotation, 'fontColor');
                }
                // Handle fontSize changes
                if (!isNullOrUndefined(annotation.fontSize) && currentAnnotation.fontSize !== annotation.fontSize) {
                    currentAnnotation.fontSize = annotation.fontSize;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fontSize: annotation.fontSize });
                    this.modifyInCollections(currentAnnotation, 'fontSize');
                }
                // Handle fontFamily changes
                if (annotation.fontFamily && currentAnnotation.fontFamily !== annotation.fontFamily) {
                    currentAnnotation.fontFamily = annotation.fontFamily;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fontFamily: annotation.fontFamily });
                    this.modifyInCollections(currentAnnotation, 'fontFamily');
                }
                // Handle textAlign changes
                if (annotation.textAlign && currentAnnotation.textAlign !== annotation.textAlign) {
                    currentAnnotation.textAlign = annotation.textAlign;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { textAlign: annotation.textAlign });
                    this.modifyInCollections(currentAnnotation, 'textAlign');
                }
                if (!isNullOrUndefined(annotation.isRepeat) && currentAnnotation.isRepeat !== annotation.isRepeat) {
                    currentAnnotation.isRepeat = annotation.isRepeat;
                    this.modifyInCollections(currentAnnotation, 'isRepeat');
                }
                // Handle useOverlayText changes
                if (!isNullOrUndefined(annotation.useOverlayText) && currentAnnotation.useOverlayText !== annotation.useOverlayText) {
                    currentAnnotation.useOverlayText = annotation.useOverlayText;
                    this.modifyInCollections(currentAnnotation, 'useOverlayText');
                }
                // Handle isPrint changes
                if (currentAnnotation.isPrint !== annotation.isPrint) {
                    currentAnnotation.isPrint = annotation.isPrint;
                    this.modifyInCollections(currentAnnotation, 'isPrint');
                }
                // Handle isLock changes
                if (currentAnnotation.isLock !== annotation.isLock) {
                    currentAnnotation.isLock = annotation.isLock;
                    currentAnnotation.annotationSettings.isLock = annotation.isLock;
                    this.modifyInCollections(currentAnnotation, 'isLock');
                }
            } else if (annotation.type === 'FreeText' || annotation.shapeAnnotationType === 'FreeText') {
                annotationType = 'freetext';
                if (this.pdfViewer.freeTextSettings.enableAutoFit && currentAnnotation.dynamicText !== annotation.content) {
                    const canvas: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', currentAnnotation.pageIndex);
                    const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
                    const fontSize: number = annotation.fontSize;
                    let font: string;
                    const fontFamily: string = annotation.fontFamily;
                    const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                    if (annotation.font.isBold) {
                        font = 'bold' + ' ' + fontSize + 'px' + ' ' + fontFamily;
                    } else {
                        font = fontSize + 'px' + ' ' + fontFamily;
                    }
                    context.font = font;
                    const characterLength: number = 8;
                    let highestTextNode: string = '';
                    let textNodes: any[] = [];
                    const textboxValue: string = annotation.content ? annotation.content : annotation.dynamicText;
                    if (textboxValue.indexOf('\n') > -1) {
                        textNodes = textboxValue.split('\n');
                        for (let j: number = 0; j < textNodes.length; j++) {
                            const textNodeData: TextMetrics = context.measureText(textNodes[parseInt(j.toString(), 10)]);
                            const highestTextNodeData: TextMetrics = context.measureText(highestTextNode);
                            if (textNodeData.width > highestTextNodeData.width) {
                                highestTextNode = textNodes[parseInt(j.toString(), 10)];
                            }
                        }
                    } else {
                        highestTextNode = textboxValue;
                    }
                    const textwidth: TextMetrics = context.measureText(highestTextNode);
                    annotation.bounds.width = Math.ceil(textwidth.width + ((characterLength + 1) * 2));
                    const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (annotation.pageIndex));
                    const maxWidth: number = pageDiv.clientWidth - (annotation.bounds.left * zoomFactor);
                    if (annotation.bounds.width > maxWidth) {
                        annotation.bounds.width = maxWidth / zoomFactor;
                    }
                    const height: number = annotation.bounds.height;
                    annotation.bounds.height = height >= currentAnnotation.bounds.height ? height : currentAnnotation.bounds.height;
                }
                if (currentAnnotation.bounds.left !== annotation.bounds.left || currentAnnotation.bounds.top !== annotation.bounds.top) {
                    annotation.bounds.x = annotation.bounds.left;
                    annotation.bounds.y = annotation.bounds.top;
                }
                this.calculateAnnotationBounds(currentAnnotation, annotation);
                if (annotation.opacity && currentAnnotation.opacity !== annotation.opacity) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
                }
                if (annotation.fillColor && currentAnnotation.fillColor !== annotation.fillColor) {
                    redoClonedObject.fillColor = annotation.fillColor;
                    this.isEdited = true;
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                }
                if (annotation.fontColor && currentAnnotation.fontColor !== annotation.fontColor) {
                    redoClonedObject.fontColor = annotation.fontColor;
                    this.isEdited = true;
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontColor', '', clonedObject, redoClonedObject);
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
                }
                if (annotation.strokeColor && currentAnnotation.strokeColor !== annotation.strokeColor) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                }
                if (annotation.thickness && currentAnnotation.thickness !== annotation.thickness) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
                }
                let isCurrentAnnotationLock: any = currentAnnotation.isLock;
                if (!isNullOrUndefined(annotation.isLock)) {
                    isCurrentAnnotationLock = annotation.isLock;
                    this.isEdited = true;
                }
                else if (!isNullOrUndefined(annotation.annotationSettings.isLock)) {
                    isCurrentAnnotationLock = annotation.annotationSettings.isLock;
                    this.isEdited = true;
                }
                currentAnnotation.annotationSettings.isLock = isCurrentAnnotationLock;
                currentAnnotation.isLock = isCurrentAnnotationLock;
                annotation.content = (annotation.content && annotation.content === annotation.dynamicText) ?
                    annotation.content : annotation.dynamicText;
                if (annotation.content && currentAnnotation.dynamicText !== annotation.content) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false, false,
                                                     false, false, true, currentAnnotation.dynamicText, annotation.content);
                }
                if (!isNullOrUndefined(annotation.fontSize) && currentAnnotation.fontSize !== annotation.fontSize) {
                    this.modifyFontSize(annotation.fontSize, true, currentAnnotation);
                    annotation.bounds.width = currentAnnotation.bounds.width;
                    annotation.bounds.height = currentAnnotation.bounds.height;
                }
                this.isFreeTextFontsizeChanged = true;
                this.pdfViewer.nodePropertyChange(currentAnnotation, {
                    opacity: annotation.opacity, fontColor: annotation.fontColor, fontSize: annotation.fontSize,
                    fontFamily: annotation.fontFamily,
                    dynamicText: annotation.content, fillColor: annotation.fillColor, textAlign: annotation.textAlign,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness,
                    font: annotation.fontStyle ? this.setFreeTextFontStyle(annotation.fontStyle) :
                        this.setFreeTextFontStyle(annotation.font),
                    isReadonly: annotation.isReadonly
                });
                if (annotation.content && currentAnnotation) {
                    this.updateAnnotationComments(currentAnnotation.annotName, annotation.content);
                }
                const newCommentDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commenttextbox_editor');
                const commentObj: any = new InPlaceEditor({
                    value: annotation.content,
                    enableHtmlSanitizer: this.pdfViewer.enableHtmlSanitizer,
                    enableHtmlParse: this.pdfViewer.enableHtmlSanitizer
                });
                commentObj.appendTo(newCommentDiv);
            }
            if (annotation.shapeAnnotationType !== 'Link') {
                currentAnnotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            }
            if (annotation.shapeAnnotationType !== 'Link' && currentAnnotation.customData !== annotation.customData) {
                currentAnnotation.customData = annotation.customData;
                this.isEdited = true;
            }
            if (annotation.shapeAnnotationType !== 'Link' && currentAnnotation.isPrint !== annotation.isPrint)
            {
                currentAnnotation.isPrint = annotation.isPrint;
                this.isEdited = true;
            }
            const shapeAnnotationType: AnnotationType = annotation.shapeAnnotationType === 'Square' ? 'Rectangle' : annotation.shapeAnnotationType;
            if (currentAnnotation.borderStyle !== annotation.borderStyle && (this.isCloudBorderSupported(shapeAnnotationType))) {
                let borderDashArray: number[] = this.getBorderDashArray(annotation.borderDashArray);
                if (annotation.borderStyle === 'Cloud' && currentAnnotation.borderStyle !== 'Cloud') {
                    borderDashArray = [];
                }
                const borderStyle: string = this.getBorderStyle(annotation.borderStyle, borderDashArray);
                const cloudIntensity: number = this.getCloudIntensity(annotation.cloudIntensity);
                currentAnnotation.wrapper.children[0].borderStyle = borderStyle;
                currentAnnotation.borderStyle = borderStyle;
                redoClonedObject.borderStyle = borderStyle;
                redoClonedObject.cloudIntensity = cloudIntensity;
                currentAnnotation.wrapper.children[0].cloudIntensity = cloudIntensity;
                currentAnnotation.cloudIntensity = cloudIntensity;
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Border Style', '', clonedObject, redoClonedObject);
                this.isEdited = true;
            }
            const borderDashArray: number[] = this.getBorderDashArray(annotation.borderDashArray);
            if (annotation.borderStyle === 'Cloud' && !this.isCloudBorderSupported(shapeAnnotationType)) {
                annotation.borderStyle = borderDashArray && borderDashArray.length > 0 ? 'Dashed' : 'Solid';
            }
            if (JSON.stringify(this.getBorderDashArray(currentAnnotation.borderDashArray)) !== JSON.stringify(borderDashArray)) {
                redoClonedObject.borderDashArray = borderDashArray;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { borderDashArray: annotation.borderDashArray });
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Border DashArray', '', clonedObject, redoClonedObject);
                this.isEdited = true;
            }
            if (annotation.type !== 'TextMarkup' && annotation.shapeAnnotationType !== 'textMarkup') {
                this.pdfViewer.renderDrawing();
            }
            if (annotation.shapeAnnotationType !== 'Link' && currentAnnotation.author !== annotation.author) {
                redoClonedObject.author = annotation.author;
                currentAnnotation.author = annotation.author;
                this.isEdited = true;
                this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                const commentDiv: any = document.getElementById(annotation.annotationId).firstChild.firstChild.childNodes[1];
                if (commentDiv instanceof Element && commentDiv.classList.contains('e-pv-comment-title')) {
                    commentDiv.children[0].textContent = annotation.author;
                    const modifiedDate: string = this.pdfViewer.annotation.stickyNotesAnnotationModule
                        .getLocalizedModifiedDate(this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime());
                    commentDiv.children[1].textContent = ' - ' + modifiedDate;
                }
            }
            if (!isNullOrUndefined(annotation.setState) && (currentAnnotation.review.state  !== annotation.setState)) {
                currentAnnotation.review.state = annotation.setState;
                annotation.review.state = annotation.setState;
                this.isEdited = true;
                this.selectAnnotation(annotation.annotationId);
                const args: any = {item : { text : annotation.setState }};
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.commentMenuItemSelect(args);
            }
            if (currentAnnotation.shapeAnnotationType === 'Link') {
                if (!isNullOrUndefined(annotation.url) && currentAnnotation.url !== annotation.url) {
                    redoClonedObject.url = annotation.url;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { url: annotation.url });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Link url', '', clonedObject, redoClonedObject);
                }
                if (!isNullOrUndefined(annotation.destinationPageIndex) && currentAnnotation.destinationPageIndex !==
                    annotation.destinationPageIndex) {
                    redoClonedObject.destinationPageIndex = annotation.destinationPageIndex;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { destinationPageIndex: annotation.destinationPageIndex });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Link DestinationPageIndex', '', clonedObject, redoClonedObject);
                }
                if (annotation.destinationLocation && currentAnnotation.destinationLocation !== annotation.destinationLocation) {
                    const annotBounds: IPoint = annotation.destinationLocation;
                    const x: number = annotBounds.x ? annotBounds.x : 0;
                    const y: number = annotBounds.y ? annotBounds.y : 0;
                    const annotationBounds: IPoint = {
                        x: x,
                        y: y
                    };
                    if (annotation.destinationLocation.x !== x) {
                        annotation.destinationLocation.x = x;
                    }
                    if (annotation.destinationLocation.x !== y) {
                        annotation.destinationLocation.x = y;
                    }
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { destinationLocation: annotationBounds });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
                    this.isEdited = true;
                }
                if (!isNullOrUndefined(annotation.zoomValue) && currentAnnotation.zoomValue !== annotation.zoomValue) {
                    redoClonedObject.zoomValue = annotation.zoomValue;
                    this.isEdited = true;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { zoomValue: annotation.zoomValue });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Link zoomValue', '', clonedObject, redoClonedObject);
                }
            }
            if (annotation.shapeAnnotationType !== 'Link') {
                for (let j: number = 0; j < annotation.comments.length; j++) {
                    const annotComment: any = annotation.comments[parseInt(j.toString(), 10)];
                    if (!isNullOrUndefined(annotComment) && currentAnnotation.comments[parseInt(j.toString(), 10)].annotName
                        === annotation.commentId && annotation.commentId) {
                        if (currentAnnotation.comments[parseInt(j.toString(), 10)].author !== annotComment.author) {
                            const replyDiv: any = document.getElementById(annotation.commentId).firstChild.childNodes[0];
                            replyDiv.textContent = annotComment.author + ' - ' + this.pdfViewer.annotationModule.
                                stickyNotesAnnotationModule.getDateAndTime();
                            currentAnnotation.comments[parseInt(j.toString(), 10)].author = annotComment.author;
                            annotation.comments[parseInt(j.toString(), 10)].review.author = annotComment.author;
                            this.isEdited = true;
                            break;
                        }
                        if (currentAnnotation.comments[parseInt(j.toString(), 10)].review.state !== annotComment.review.state) {
                            currentAnnotation.comments[parseInt(j.toString(), 10)].review.state = annotComment.review.state;
                            const args: any = { item: { text: annotComment.review.state } };
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.commentMenuItemSelect(args);
                            this.isEdited = true;
                            break;
                        }
                    }
                }
            }
            this.updateCollection(annotationId, pageNumber, annotation, annotationType);
            // After store is updated, refresh the <a> DOM element for link annotations
            if (annotationType === 'link' &&
                this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.PdfLinkAnnotationModule) {
                this.pdfViewer.annotationModule.PdfLinkAnnotationModule.refreshLinkElements(pageNumber);
            }
            if (this.isEdited)
            {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
            }
        } else {
            const updated: boolean = this.updateNonRenderedStates(annotation);
            if (updated) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
            }
        }
        this.isEdited = false;
    }

    private updateNonRenderedStates(annotation: any): boolean {
        const pageIndex: number = !isNullOrUndefined(annotation.pageNumber) ? annotation.pageNumber : annotation.pageIndex;
        const pages: any = this.pdfViewerBase.documentAnnotationCollections;
        if (!pages || isNullOrUndefined(pages[pageIndex as number])) { return false; }
        const pageStore: any = pages[pageIndex as number];
        const key: string = (() => {
            const t: string = String(annotation.shapeAnnotationType || annotation.type || '').toLowerCase();
            if (t === 'freetext') { return 'freeTextAnnotation'; }
            if (t === 'textmarkup') { return 'textMarkupAnnotation'; }
            if (t === 'ink') { return 'signatureInkAnnotation'; }
            if (t === 'link') { return 'linkAnnotation'; }
            if (t === 'stamp' || t === 'image') { return 'stampAnnotations'; }
            if (t === 'sticky') { return 'stickyNotesAnnotation'; }
            if (annotation.subject === 'Volume calculation' || annotation.subject === 'Radius calculation' ||
                annotation.subject === 'Area calculation' || annotation.subject === 'Perimeter calculation' ||
                annotation.subject === 'Distance calculation') {
                return 'measureShapeAnnotation';
            }
            return 'shapeAnnotation';
        })();
        const list: any[] = pageStore[key as string];
        if (!list || !list.length) { return false; }
        const targetAnnotName: string = annotation.annotationId || annotation.annotName;
        for (let i: number = 0; i < list.length; i++) {
            const annoatations: any = list[i as number];
            if (!annoatations) {
                continue;
            }
            if (annoatations.AnnotName === targetAnnotName && annotation.shapeAnnotationType !== 'Link') {
                if (annoatations.IsLocked !== annotation.annotationSettings.isLock) {
                    annoatations.IsLocked = annotation.annotationSettings.isLock;
                    if (annoatations.AnnotationSettings) {
                        annoatations.AnnotationSettings.isLock = annotation.annotationSettings.isLock;
                    }
                }
                if (annoatations.IsCommentLock !== annotation.isCommentLock) {
                    annoatations.IsCommentLock = annotation.isCommentLock;
                }
                return true;
            }
        }
        return false;
    }

    private annotationPropertyChange(currentAnnotation: any, opacity: any, actionString: string, clonedObject: any,
                                     redoClonedObject: any): void {
        if (currentAnnotation.status !== 'NewlyAdded') {
            currentAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: opacity });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, actionString, '', clonedObject, redoClonedObject);
    }

    /**
     * @private
     * Handles cross-page annotation move via pageNumber property update.
     * Recalculates bounds using normalized coordinates and updates collections.
     * @param {any} originalAnnotation - The annotation being moved
     * @param {any} modifiedAnnotation - The updated annotation object with new pageNumber
     * @param {boolean} updateBounds - Whether to recalculate bounds after the move
     * @param {boolean} isUndoRedoUpdate - Whether the move is triggered by undo/redo
     * @returns {boolean} - true if cross-page move was performed, false otherwise
     */
    public moveAnnotationAcrossPages(originalAnnotation: any, modifiedAnnotation: any, updateBounds?: boolean,
                                     isUndoRedoUpdate?: boolean): boolean {
        const clonedAnnotation: any = cloneObject(originalAnnotation);
        const newPageNumber: number = modifiedAnnotation.pageNumber || (modifiedAnnotation.pageIndex);
        const currentPageNumber: number = originalAnnotation.pageNumber || (originalAnnotation.pageIndex);
        // Cross-page move is annotation-only: form fields (and signatures
        // rendered inside a form field) are page-bound and must never migrate.
        if (!isNullOrUndefined((originalAnnotation as PdfFormFieldBaseModel).formFieldAnnotationType) ||
            originalAnnotation.annotName === 'SignatureField' || originalAnnotation.annotName === 'InitialField') {
            return false;
        }
        // If pageNumber hasn't changed, return false (no cross-page move needed)
        if (newPageNumber === currentPageNumber) {
            return false;
        }
        // Validate destination page exists
        if (isNullOrUndefined(newPageNumber) || newPageNumber < 0) {
            return false;
        }
        // Check if destination page index is valid
        if (newPageNumber >= this.pdfViewerBase.pageSize.length) {
            return false;
        }
        originalAnnotation.pageIndex = newPageNumber;
        originalAnnotation.pageNumber = newPageNumber;
        // Remove from source page collection
        const sourcePageObjects: any[] = this.pdfViewer.drawing.getPageObjects(currentPageNumber);
        if (sourcePageObjects) {
            const index: number = sourcePageObjects.indexOf(originalAnnotation);
            if (index >= 0) {
                sourcePageObjects.splice(index, 1);
            }
        }
        // Add to destination page collection
        const destPageObjects: any[] = this.pdfViewer.drawing.getPageObjects(newPageNumber);
        if (destPageObjects) {
            destPageObjects.push(originalAnnotation);
        }
        if (originalAnnotation.status && originalAnnotation.status !== 'NewlyAdded') {
            originalAnnotation.status = AnnotationStatus.ExistingModified;
        }
        this.updateAllAnnotationCollection(originalAnnotation, originalAnnotation.status, currentPageNumber, newPageNumber);
        this.isEdited = true;
        // Update the comment panel: move the annotation's comment container to the destination page accordion
        this.updateCommentPanelForCrossPageMove(originalAnnotation, currentPageNumber, newPageNumber);
        if (updateBounds) {
            this.calculateAnnotationBounds(originalAnnotation, modifiedAnnotation);
            if (this.boundsChanged) {
                //this.pdfViewer.drawing.select([currentAnnotation.id], this.pdfViewer.annotationSelectorSettings);
                this.modifyInCollections(originalAnnotation, 'bounds');
                this.boundsChanged = false;
            }
        }
        if (this.pdfViewer.drawing && typeof this.pdfViewer.drawing.refreshCanvasDiagramLayer === 'function') {
            this.pdfViewer.clearSelection(currentPageNumber);
            this.pdfViewer.drawing.refreshCanvasDiagramLayer(undefined, currentPageNumber);
        }
        if (this.pdfViewer.drawing && typeof this.pdfViewer.drawing.refreshCanvasDiagramLayer === 'function') {
            this.pdfViewer.drawing.refreshCanvasDiagramLayer(undefined, newPageNumber);
        }
        // For link annotations, the per-page <a> anchor elements live inside each pageDiv,
        // independent of the drawing model, so they do not follow the annotation when it
        // changes page: the source page keeps an orphaned <a> and the destination page has
        // none, which silently breaks hyperlink interaction.
        // refreshLinkElements() rebuilds a single page and therefore cannot relocate an
        // anchor across pages, so the link module relocates the moved anchor itself.
        // (Bug #272683, R9 — link interaction regression after cross-page move.)
        if (originalAnnotation.shapeAnnotationType === 'Link' && this.PdfLinkAnnotationModule &&
            typeof this.PdfLinkAnnotationModule.relocateLinkElement === 'function') {
            this.PdfLinkAnnotationModule.relocateLinkElement(currentPageNumber, newPageNumber, originalAnnotation);
        }
        this.triggerAnnotationMove(originalAnnotation);
        // Store redo object
        const redoClonedAnnotation: any = cloneObject(originalAnnotation);
        if (isUndoRedoUpdate) {
            this.pdfViewer.annotation.addAction(currentPageNumber, null, originalAnnotation, 'Drag',
                                                'pageNumber', clonedAnnotation, redoClonedAnnotation);
        }
        return true;
    }
    private updateAllAnnotationCollection(originalAnnotation: any, status: AnnotationStatus, currentPageNumber: number,
                                          newPageNumber: number) : void {
        let collections: any = this.pdfViewer.annotationCollection;
        let isSignatureAnnotation: boolean = false;
        if (originalAnnotation.shapeAnnotationType === 'HandWrittenSignature' ||
            originalAnnotation.shapeAnnotationType === 'SignatureText' ||
            originalAnnotation.shapeAnnotationType === 'SignatureImage') {
            collections = this.pdfViewer.signatureCollection;
            isSignatureAnnotation = true;
        }
        let collectionIndex: number = -1;
        let annotationID: string;
        let annotationType: string;
        let annotType: string = '';
        if (collections && originalAnnotation) {
            for (let annotIndex: number = 0; annotIndex < collections.length; annotIndex++) {
                if (isSignatureAnnotation) {
                    if (collections[parseInt(annotIndex.toString(), 10)].uniqueKey === originalAnnotation.id) {
                        collections[parseInt(annotIndex.toString(), 10)].pageNumber = newPageNumber;
                        collections[parseInt(annotIndex.toString(), 10)].pageIndex = newPageNumber;
                        annotationID = collections[parseInt(annotIndex.toString(), 10)].annotationId;
                        annotType = 'Signature';
                    }
                } else if (collections[parseInt(annotIndex.toString(), 10)].annotationId === originalAnnotation.annotName ||
                    collections[parseInt(annotIndex.toString(), 10)].annotationId === originalAnnotation.annotationId) {
                    collections[parseInt(annotIndex.toString(), 10)].pageNumber = newPageNumber;
                    collections[parseInt(annotIndex.toString(), 10)].pageIndex = newPageNumber;
                    collections[parseInt(annotIndex.toString(), 10)].previousPageNumer = currentPageNumber;
                    if (status) {
                        collections[parseInt(annotIndex.toString(), 10)].status = status;
                    } else {
                        originalAnnotation.status = collections[parseInt(annotIndex.toString(), 10)].status;
                        status = originalAnnotation.status;
                    }
                    annotationID = collections[parseInt(annotIndex.toString(), 10)].annotationId;
                    annotationType = collections[parseInt(annotIndex.toString(), 10)].shapeAnnotationType;
                    annotType = annotationType;
                    if (annotType === 'Line' || annotType === 'Square' || annotType === 'Circle' ||
                        annotType === 'Polygon' || annotType === 'Polyline' ) {
                        annotationType = collections[parseInt(annotIndex.toString(), 10)].subject;
                        annotationType = annotType = (annotationType === 'Line' || annotationType === 'Rectangle' || annotationType === 'Circle' ||
                            annotationType === 'Polygon' || annotationType === 'Arrow') ? 'Shape' : annotationType;
                        annotType = (annotationType === 'Distance calculation' || annotationType === 'Perimeter calculation' ||
                            annotationType === 'Area calculation' || annotationType === 'Radius calculation' ||
                            annotationType === 'Volume calculation') ? 'Measure' : annotationType;
                    }
                    collectionIndex = annotIndex;
                    break;
                }
            }
        }
        let sourceDocCollection: any;
        let docCollections: any;
        if (this.pdfViewerBase.documentAnnotationCollections) {
            docCollections = this.pdfViewerBase.documentAnnotationCollections;
            if (docCollections[parseInt(currentPageNumber.toString(), 10)]) {
                sourceDocCollection = docCollections[parseInt(currentPageNumber.toString(), 10)];
            }
        }
        if (!sourceDocCollection) {
            return;
        }
        // Map each annotation type to its per-page slice in documentAnnotationCollections
        // and to its runtime per-type store. The previous implementation used
        // `shapeAnnotation` for every type, which left Ink/Stamp/Sticky/FreeText/
        // Signature/Measure/Redact annotations stranded on the source page slice
        // after a cross-page move (Bug #272683, R9 regression).
        let docCollectionSliceKey: string = '';
        if (annotType === 'Shape') {
            docCollectionSliceKey = 'shapeAnnotation';
        } else if (annotType === 'Measure') {
            docCollectionSliceKey = 'measureShapeAnnotation';
        } else if (annotType === 'stamp') {
            docCollectionSliceKey = 'stampAnnotations';
        } else if (annotType === 'Sticky') {
            docCollectionSliceKey = 'stickyNotesAnnotation';
        } else if (annotType === 'FreeText') {
            docCollectionSliceKey = 'freeTextAnnotation';
        } else if (annotType === 'Signature') {
            docCollectionSliceKey = 'signatureAnnotation';
        } else if (annotType === 'Ink') {
            docCollectionSliceKey = 'signatureInkAnnotation';
        } else if (annotType === 'Redact') {
            docCollectionSliceKey = 'redactionAnnotation';
        } else if (annotType === 'Link') {
            docCollectionSliceKey = 'linkAnnotation';
        }
        let runtimeStoreKey: string = '';
        if (annotType === 'Shape') {
            runtimeStoreKey = '_annotations_shape';
        } else if (annotType === 'Measure') {
            runtimeStoreKey = '_annotations_shape_measure';
        } else if (annotType === 'stamp') {
            runtimeStoreKey = '_annotations_stamp';
        } else if (annotType === 'Sticky') {
            runtimeStoreKey = '_annotations_sticky';
        } else if (annotType === 'FreeText') {
            runtimeStoreKey = '_annotations_freetext';
        } else if (annotType === 'Signature') {
            runtimeStoreKey = '_annotations_sign';
        } else if (annotType === 'Ink') {
            runtimeStoreKey = '_annotations_ink';
        } else if (annotType === 'Redact') {
            runtimeStoreKey = '_annotations_redaction';
        } else if (annotType === 'Link') {
            runtimeStoreKey = '_annotations_link';
        }
        if (annotType === 'FreeText') {
            const annotationCollection: any = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + runtimeStoreKey);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                const pageAnnotations: any = annotationCollection[parseInt(i.toString(), 10)];
                if (pageAnnotations.annotations && pageAnnotations.annotations.length > 0) {
                    for (let j: number = 0; j < pageAnnotations.annotations.length; j++) {
                        status = pageAnnotations.annotations[parseInt(j.toString(), 10)].status;
                    }
                }
            }
        }
        // eslint-disable-next-line security/detect-object-injection
        if (docCollectionSliceKey && sourceDocCollection[docCollectionSliceKey]) {
            // eslint-disable-next-line security/detect-object-injection
            const srcIndex: number = sourceDocCollection[docCollectionSliceKey]
                .findIndex((anno: any) => anno.AnnotName === annotationID);
            if (srcIndex >= 0) {
                // eslint-disable-next-line security/detect-object-injection
                const sourceSlice: any[] = sourceDocCollection[docCollectionSliceKey];
                const foundAnnotation: any = sourceSlice[parseInt(srcIndex.toString(), 10)];
                sourceSlice.splice(srcIndex, 1);
                const destPage: any = docCollections[parseInt(newPageNumber.toString(), 10)];
                if (destPage) {
                    // eslint-disable-next-line security/detect-object-injection
                    if (!destPage[docCollectionSliceKey]) {
                        // eslint-disable-next-line security/detect-object-injection
                        destPage[docCollectionSliceKey] = [];
                    }
                    // eslint-disable-next-line security/detect-object-injection
                    destPage[docCollectionSliceKey].push(foundAnnotation);
                }
            }
        }
        if (runtimeStoreKey) {
            const runtimeObject: IPageAnnotations[] = this.pdfViewerBase.getOriginalAnnotation(runtimeStoreKey);
            this.updatePageAnnotationCollection(runtimeObject, annotationID, currentPageNumber, newPageNumber, status, annotType);
        }
    }
    /**
     * @private
     * @param {IPageAnnotations[]} annotationObject - The runtime annotation store for the type
     * @param {string} annotationID - The annotation id to relocate
     * @param {number} currentPageNumber - Source page number
     * @param {number} newPageNumber - Destination page number
     * @param {AnnotationStatus} status - Status to apply to the moved annotation
     * @param {string} annotType - Provide the type annotatio moved
     * @returns {void}
     */
    private updatePageAnnotationCollection(annotationObject: IPageAnnotations[], annotationID: string, currentPageNumber: number,
                                           newPageNumber: number, status: AnnotationStatus, annotType: string): void {
        if (!annotationObject || annotationObject.length === 0) {
            return;
        }
        // Relocate the annotation between the per-page wrappers of the runtime store.
        // The wrappers are sparse and looked up by getPageCollection() (which scans on
        // pageIndex), so the entry has to actually move between wrappers. The previous
        // implementation only rewrote pageNumber/pageIndex in place, which left the entry
        // inside the source page's annotations array and made that array report a
        // pageNumber it no longer owns — the destination page then resolved no
        // annotations at all and the annotation's data was lost on reload/export.
        const sourceIndex: number = this.getPageCollection(annotationObject, currentPageNumber);
        if (isNullOrUndefined(sourceIndex) || !annotationObject[parseInt(sourceIndex.toString(), 10)]) {
            return;
        }
        const sourceWrapper: IPageAnnotations = annotationObject[parseInt(sourceIndex.toString(), 10)];
        let annotIndex: number = sourceWrapper.annotations.findIndex((anno: any) => anno.annotName === annotationID);
        if (annotType === 'Signature') {
            annotIndex = sourceWrapper.annotations.findIndex((anno: any) => anno.signatureName === annotationID);
        }
        if (annotIndex < 0) {
            return;
        }
        const movedAnnotation: any = sourceWrapper.annotations[parseInt(annotIndex.toString(), 10)];
        movedAnnotation.status = status;
        movedAnnotation.previousPageNumer = currentPageNumber;
        movedAnnotation.pageNumber = newPageNumber;
        movedAnnotation.pageIndex = newPageNumber;
        sourceWrapper.annotations.splice(annotIndex, 1);
        // Reuse the destination wrapper when it already exists, otherwise append a new one.
        const destinationIndex: number = this.getPageCollection(annotationObject, newPageNumber);
        if (!isNullOrUndefined(destinationIndex) && annotationObject[parseInt(destinationIndex.toString(), 10)]) {
            annotationObject[parseInt(destinationIndex.toString(), 10)].annotations.push(movedAnnotation);
        } else {
            annotationObject.push({ pageIndex: newPageNumber, annotations: [movedAnnotation] });
        }
    }
    /**
     * Moves the annotation's comment panel entry from the source page accordion to the destination page accordion.
     * The comment panel uses 1-based page numbers in accordion element IDs.
     * @param {any} currentAnnotation - The annotation being moved
     * @param {number} sourcePageIndex - Source page index (0-based)
     * @param {number} destinationPageIndex - Destination page index (0-based)
     * @returns {void}
     * @private
     */
    private updateCommentPanelForCrossPageMove(currentAnnotation: any, sourcePageIndex: number, destinationPageIndex: number): void {
        try {
            // Comment panel uses 1-based page numbers in accordion IDs
            const sourcePanelPageNum: number = sourcePageIndex + 1;
            const destPanelPageNum: number = destinationPageIndex + 1;
            // Locate the annotation's comment container by its annotName (used as the element id)
            const annotName: string = currentAnnotation.annotName || currentAnnotation.annotationId;
            if (!annotName) {
                return;
            }
            const commentContainer: HTMLElement = document.getElementById(annotName);
            if (!commentContainer) {
                return;
            }
            // Ensure the destination page accordion exists; create it if not
            const stickyModule: any = this.stickyNotesAnnotationModule;
            if (stickyModule && typeof stickyModule.createPageAccordion === 'function') {
                stickyModule.createPageAccordion(destPanelPageNum);
            }
            // Get destination accordion content container
            const destAccordionContent: HTMLElement =
                document.getElementById(this.pdfViewer.element.id + '_accordioncontent' + destPanelPageNum);
            if (!destAccordionContent) {
                return;
            }
            // Update the accessKey to reflect the new page (format: '{pageNum}_{commentsCount}')
            const currentAccessKey: string = commentContainer.accessKey || '';
            const accessKeyParts: string[] = currentAccessKey.split('_');
            if (accessKeyParts.length >= 2) {
                commentContainer.accessKey = destPanelPageNum.toString() + '_' + accessKeyParts[1];
            }
            // Move the comment container DOM element to the destination page accordion content
            destAccordionContent.appendChild(commentContainer);
            // Update scroll position to the destination page in the comment panel
            if (stickyModule && typeof stickyModule.updateCommentPanelScrollTop === 'function') {
                stickyModule.updateCommentPanelScrollTop(destPanelPageNum);
            }
            // Hide source page accordion if it is now empty
            const sourceAccordionContent: HTMLElement =
                document.getElementById(this.pdfViewer.element.id + '_accordioncontent' + sourcePanelPageNum);
            if (sourceAccordionContent && sourceAccordionContent.childElementCount === 0) {
                const sourceAccordionContainer: HTMLElement =
                    document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + sourcePanelPageNum);
                if (sourceAccordionContainer) {
                    sourceAccordionContainer.remove();
                }
            }
        } catch (e) {
            // Fail-safe: comment panel update is non-critical
        }
    }
    private calculateAnnotationBounds(currentAnnotation: any, annotation: any): void {
        const bounds: IRectangleBounds | IRectBounds = this.pdfViewerBase.convertBounds(currentAnnotation.wrapper.bounds);
        const annotBounds: IRectangleBounds | IRectBounds = this.pdfViewerBase.convertBounds(annotation.bounds);
        if (bounds && annotBounds) {
            if (JSON.stringify(bounds) !== JSON.stringify(annotBounds) && (Math.abs((bounds as IRectBounds).Y -
            (annotBounds as IRectBounds).Y) > 2) ||
             (Math.abs((bounds as IRectBounds).X - (annotBounds as IRectBounds).X) > 2) ||
             (Math.abs((bounds as IRectBounds).Width - (annotBounds as IRectBounds).Width) > 2) ||
              (Math.abs((bounds as IRectBounds).Height - (annotBounds as IRectBounds).Height) > 2)) {
                // Preserve stamp/image aspect ratio when editing bounds
                let newWidth: number = (annotBounds as IRectBounds).Width;
                let newHeight: number = (annotBounds as IRectBounds).Height;
                try {
                    const isStamp: boolean = annotation && ((annotation.shapeAnnotationType &&
                        annotation.shapeAnnotationType.toLowerCase() === 'stamp') || annotation.stampAnnotationType === 'image' ||
                        annotation.stampAnnotationType === 'path');
                    if (isStamp) {
                        // Derive default size from templateSize (if present) or from stamp collections
                        let defaultWidth: number = null;
                        let defaultHeight: number = null;
                        if ((!defaultWidth || !defaultHeight) && annotation.icon) {
                            // Try to retrieve stamp collection info
                            let stampCollection: any = null;
                            try {
                                if (annotation.isDynamicStamp || annotation.IsDynamic) {
                                    if (this.stampAnnotationModule && this.stampAnnotationModule.retrieveDynamicStampAnnotation) {
                                        stampCollection = this.stampAnnotationModule.retrieveDynamicStampAnnotation(annotation.icon);
                                    }
                                }
                                if (!stampCollection && this.stampAnnotationModule && this.stampAnnotationModule.retrievestampAnnotation) {
                                    stampCollection = this.stampAnnotationModule.retrievestampAnnotation(annotation.icon);
                                }
                            } catch (e) {
                                stampCollection = null;
                            }
                            if (stampCollection) {
                                defaultWidth = stampCollection.width;
                                defaultHeight = stampCollection.height;
                            }
                        }

                        // If defaults are available, compute new sizes preserving aspect ratio
                        if (defaultWidth && defaultHeight) {
                            const stampWidth: number = (annotBounds as IRectBounds).Width;
                            const stampHeight: number = (annotBounds as IRectBounds).Height;
                            const stampModule: any = this.stampAnnotationModule;
                            const metrics: { width: number, height: number } = stampModule.calculateStampWidthAndHeight(
                                stampWidth, stampHeight, defaultWidth, defaultHeight);
                            newWidth = metrics.width;
                            newHeight = metrics.height;
                        }
                    }
                } catch (e) {
                    // Fail-safe: fallback to provided annot bounds
                    newWidth = (annotBounds as IRectBounds).Width;
                    newHeight = (annotBounds as IRectBounds).Height;
                }
                const annotationBounds: IRect = { x: (annotBounds as IRectBounds).X + ((annotBounds as IRectBounds).Width / 2),
                    y: (annotBounds as IRectBounds).Y + ((annotBounds as IRectBounds).Height / 2),
                    width: newWidth, height: newHeight };
                if (annotation.bounds.left !== (annotBounds as IRectBounds).X) {
                    annotation.bounds.left = (annotBounds as IRectBounds).X;
                }
                if (annotation.bounds.top !== (annotBounds as IRectBounds).Y) {
                    annotation.bounds.top = (annotBounds as IRectBounds).Y;
                }
                // For line shapes (Line, Arrow, Distance, Polygon) the rendered path
                // is driven by vertexPoints, not wrapper.offsetX/Y alone.
                // nodePropertyChange({ bounds }) updates the wrapper center but leaves
                // vertexPoints at the source-page coordinates, so the line snaps back or
                // renders at the wrong position after a cross-page drop.
                // Fix: translate vertexPoints by the same delta before updating bounds,
                // then call nodePropertyChange({ vertexPoints }) so updateConnector()
                // rebuilds the path data from the corrected points.
                if (isLineShapes(currentAnnotation) &&
                    currentAnnotation.vertexPoints && currentAnnotation.vertexPoints.length) {
                    const vdx: number = annotationBounds.x - currentAnnotation.wrapper.offsetX;
                    const vdy: number = annotationBounds.y - currentAnnotation.wrapper.offsetY;
                    if (vdx !== 0 || vdy !== 0) {
                        for (let pi: number = 0; pi < currentAnnotation.vertexPoints.length; pi++) {
                            currentAnnotation.vertexPoints[parseInt(pi.toString(), 10)].x += vdx;
                            currentAnnotation.vertexPoints[parseInt(pi.toString(), 10)].y += vdy;
                        }
                        this.pdfViewer.nodePropertyChange(currentAnnotation,
                                                          { vertexPoints: currentAnnotation.vertexPoints } as any);
                    }
                }
                const isCallout: boolean =
                    currentAnnotation.shapeAnnotationType === 'FreeText' &&
                    Array.isArray(currentAnnotation.calloutLines) &&
                    currentAnnotation.calloutLines.length > 0 &&
                    Array.isArray((currentAnnotation).vertexPoints) &&
                    currentAnnotation.vertexPoints.length >= 3;
                if (isCallout) {
                    const vp: any[] = (currentAnnotation as any).vertexPoints;
                    const origin: any = vp[0];
                    const knee: any = vp[1];
                    const newBounds: any = annotation.bounds;
                    const cx: number = newBounds.left + newBounds.width / 2;
                    const cy: number = newBounds.top + newBounds.height / 2;
                    const theta: number = Math.atan2(cy - knee.y, cx - knee.x) * 180 / Math.PI;
                    const thetaNorm: number = (theta + 360) % 360;
                    const bx: number = newBounds.left;
                    const by: number = newBounds.top;
                    const candidates: { point: { x: number; y: number }; normal: number }[] = [
                        { point: { x: bx + newBounds.width, y: by + newBounds.height / 2 }, normal: 0 }, // Right
                        { point: { x: bx + newBounds.width / 2, y: by + newBounds.height }, normal: 90 }, // Bottom
                        { point: { x: bx, y: by + newBounds.height / 2 }, normal: 180 }, // Left
                        { point: { x: bx + newBounds.width / 2, y: by }, normal: 270 }  // Top
                    ];
                    let bestPoint: { x: number; y: number } = candidates[0].point;
                    let bestDelta: number = 360;
                    for (const c of candidates) {
                        let delta: number = Math.abs(c.normal - thetaNorm);
                        if (delta > 180) { delta = 360 - delta; }
                        if (delta < bestDelta) { bestDelta = delta; bestPoint = c.point; }
                    }
                    const newVertexPoints: any[] = [origin, knee, bestPoint];
                    currentAnnotation.vertexPoints = newVertexPoints;
                    currentAnnotation.calloutLines = newVertexPoints;
                    this.pdfViewerBase.isCalloutResizeAnnotation = true;
                }
                this.pdfViewer.nodePropertyChange(currentAnnotation, { bounds: annotationBounds });
                this.pdfViewerBase.isCalloutResizeAnnotation = false;
                annotation.bounds.width = newWidth;
                annotation.bounds.height = newHeight;
                if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
                    this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName,
                                                                 currentAnnotation.shapeAnnotationType as AnnotationType, false, false,
                                                                 false, currentAnnotation.wrapper.bounds,
                                                                 annotation.bounds);
                }
                else {
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
                }
                if (annotation.shapeAnnotationType !== 'Link') {
                    this.pdfViewer.renderSelector(currentAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
                }
                this.isEdited = true;
                this.boundsChanged = true;

            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {void}
     */
    public updateFreeTextProperties(annotation: any): void {
        if (annotation.labelSettings) {
            if (annotation.labelSettings.fillColor) {
                annotation.labelFillColor = annotation.labelSettings.fillColor;
            }
            if (annotation.labelSettings.fontColor) {
                annotation.fontColor = annotation.labelSettings.fontColor;
            }
            if (annotation.labelSettings.fontSize) {
                annotation.fontSize = annotation.labelSettings.fontSize;
            }
            if (annotation.labelSettings.fontFamily) {
                annotation.fontFamily = annotation.labelSettings.fontFamily;
            }
            if (annotation.labelSettings.opacity) {
                annotation.labelOpacity = annotation.labelSettings.opacity;
            }
            if (annotation.labelSettings.labelContent) {
                annotation.labelContent = annotation.labelSettings.labelContent;
            }
        }
    }

    private updateAnnotationComments(annotationId: string, noteContent: string): void {
        const commentsDiv: any = document.getElementById(annotationId);
        if (commentsDiv && commentsDiv.childNodes) {
            if (commentsDiv.childNodes[0].ej2_instances) {
                commentsDiv.childNodes[0].ej2_instances[0].value = noteContent;
            } else if (commentsDiv.childNodes[0].childNodes && commentsDiv.childNodes[0].childNodes[1].ej2_instances) {
                commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].value = noteContent;
            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @param {any} currentAnnotation - currentAnnotation
     * @private
     * @returns {void}
     */
    public addFreeTextProperties(annotation: any, currentAnnotation: any): void {
        if (this.pdfViewer.enableShapeLabel && annotation && currentAnnotation) {
            currentAnnotation.labelSettings = {
                fontColor: annotation.fontColor, fontSize: annotation.fontSize, fontFamily: annotation.fontFamily,
                opacity: annotation.labelOpacity, labelContent: annotation.labelContent, fillColor: annotation.labelFillColor
            };
        }
    }
    public updateMeasurementSettings(): void {
        if (this.pdfViewer.enableAnnotation && this.pdfViewer.enableMeasureAnnotation) {
            const ratioString: string = '1 ' + this.pdfViewer.measurementSettings.conversionUnit + ' = ' + this.pdfViewer.measurementSettings.scaleRatio + ' ' + this.pdfViewer.measurementSettings.displayUnit;
            this.measureAnnotationModule.updateMeasureValues(ratioString, this.pdfViewer.measurementSettings.displayUnit,
                                                             this.pdfViewer.measurementSettings.conversionUnit,
                                                             this.pdfViewer.measurementSettings.depth);
        }
    }

    private updateCollection(annotationId: any, pageNumber: number, annotation: any, annotationType: string): void {
        let annotationCollection: any[];
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_' + annotationType);
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(JSON.stringify(storeObject)) as IPageAnnotations[];
            const index: number = this.getPageCollection(annotObject, pageNumber);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotationCollection = annotObject[parseInt(index.toString(), 10)].annotations;
                if (annotationCollection !== null) {
                    for (let i: number = 0; i < annotationCollection.length; i++) {
                        if (annotationCollection[parseInt(i.toString(), 10)].annotName === annotationId) {
                            const newAnnot: any = this.modifyAnnotationProperties(annotationCollection[parseInt(i.toString(), 10)],
                                                                                  annotation, annotationType);
                            if (newAnnot.status !== 'NewlyAdded') {
                                newAnnot.status = AnnotationStatus.ExistingModified;
                            }
                            annotationCollection[parseInt(i.toString(), 10)] = newAnnot;
                            this.storeAnnotationCollections(newAnnot, pageNumber);
                        }
                    }
                    this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_' + annotationType);
                    if (annotObject[parseInt(index.toString(), 10)]) {
                        annotObject[parseInt(index.toString(), 10)].annotations = annotationCollection;
                    }
                    this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_' + annotationType, annotObject);
                }
            }
            annotObject = null;
        }
    }

    private modifyAnnotationProperties(newAnnotation: any, annotation: any, annotationType: string): any {
        let isModifyStatus: Boolean = false;
        if (annotation && annotation.isCommentLock === true) {
            newAnnotation.isCommentLock = annotation.isCommentLock;
        }
        if (!isNullOrUndefined(annotation) && !isNullOrUndefined(annotation.annotationSettings) &&
            annotation.annotationSettings.isLock === true && annotation.isCommentLock === true)
        {
            isModifyStatus = true;
        }
        if (annotation.comments) {
            for (let j: number = 0; j < annotation.comments.length; j++) {
                if (!isNullOrUndefined(annotation.comments[parseInt(j.toString(), 10)].isLock) &&
                !isNullOrUndefined(newAnnotation.comments[parseInt(j.toString(), 10)])) {
                    newAnnotation.comments[parseInt(j.toString(), 10)].isLock = annotation.comments[parseInt(j.toString(), 10)].isLock;
                }
            }
        }
        if (annotation && annotation.note !== '' && annotation.note !== undefined) {
            newAnnotation.note = annotation.note;
        }
        if (annotation.review) {
            newAnnotation.review = annotation.review;
        }
        if (annotation.commentId && annotation.editComment && annotation.commentType === 'edit') {
            const commentDiv: any = (this.pdfViewer.element as HTMLElement).querySelector('[id="' + annotation.commentId + '"]');
            if (annotation.annotationId === annotation.commentId) {
                newAnnotation.note = commentDiv.childNodes[1].ej2_instances[0].value;
            }
            for (let j: number = 0; j < annotation.comments.length; j++) {
                if (annotation.comments[parseInt(j.toString(), 10)].annotName === annotation.commentId) {
                    newAnnotation.comments[parseInt(j.toString(), 10)].note = commentDiv.childNodes[1].ej2_instances[0].value;
                }
            }
        }
        if (annotation.comments) {
            for (let j: number = 0; j < annotation.comments.length; j++) {
                const annotComment: any = annotation.comments[parseInt(j.toString(), 10)];
                if (!isNullOrUndefined(annotComment) && annotation.commentId && annotComment.annotName === annotation.commentId) {
                    newAnnotation.comments[parseInt(j.toString(), 10)].author = annotComment.author;
                    newAnnotation.comments[parseInt(j.toString(), 10)].review.author = annotComment.author;
                    newAnnotation.comments[parseInt(j.toString(), 10)].review.state = annotComment.review.state;
                    break;
                }
            }
        }
        if (annotationType === 'textMarkup') {
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.color = annotation.color;
            newAnnotation.allowedInteractions = annotation.allowedInteractions;
            newAnnotation.annotationSettings = annotation.annotationSettings;
        } else if (annotationType === 'sticky' || annotationType === 'stamp') {
            if (annotation.bounds) {
                newAnnotation.bounds = annotation.bounds;
            }
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.annotationSettings = annotation.annotationSettings;
            newAnnotation.allowedInteractions = annotation.allowedInteractions;
            if (annotation.stampAnnotationPath && newAnnotation.stampAnnotationPath !== annotation.stampAnnotationPath) {
                newAnnotation.stampAnnotationPath = annotation.stampAnnotationPath;
                newAnnotation.template = '';
            }
        } else if (annotationType === 'ink') {
            if (annotation.bounds) {
                newAnnotation.bounds = annotation.bounds;
            }
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.strokeColor = annotation.strokeColor;
            newAnnotation.thickness = annotation.thickness;
            newAnnotation.annotationSettings = annotation.annotationSettings;
            newAnnotation.allowedInteractions = annotation.allowedInteractions;
        } else if (annotationType === 'shape' || annotationType === 'shape_measure') {
            if (annotation.subType === 'Line' || annotation.subType === 'Arrow' || annotation.subType === 'Distance' ||
                annotation.subType === 'Perimeter') {
                if (annotation.bounds) {
                    newAnnotation.bounds = annotation.bounds;
                }
                if (annotation.vertexPoints) {
                    newAnnotation.vertexPoints = annotation.vertexPoints;
                }
                newAnnotation.opacity = annotation.opacity;
                newAnnotation.fillColor = annotation.fillColor;
                newAnnotation.strokeColor = annotation.strokeColor;
                newAnnotation.thickness = annotation.thickness;
                newAnnotation.borderDashArray = annotation.borderDashArray;
                newAnnotation.lineHeadStart = this.getArrowTypeForCollection(annotation.lineHeadStartStyle);
                newAnnotation.lineHeadEnd = this.getArrowTypeForCollection(annotation.lineHeadEndStyle);
                newAnnotation.annotationSettings = annotation.annotationSettings;
                newAnnotation.allowedInteractions = annotation.allowedInteractions;
            } else {
                if (annotation.bounds) {
                    newAnnotation.bounds = annotation.bounds;
                }
                if (annotation.vertexPoints) {
                    newAnnotation.vertexPoints = annotation.vertexPoints;
                }
                newAnnotation.opacity = annotation.opacity;
                newAnnotation.fillColor = annotation.fillColor;
                newAnnotation.strokeColor = annotation.strokeColor;
                newAnnotation.thickness = annotation.thickness;
                newAnnotation.annotationSettings = annotation.annotationSettings;
                newAnnotation.allowedInteractions = annotation.allowedInteractions;
                if (annotation.calibrate) {
                    if (newAnnotation.annotName === annotation.annotationId) {
                        if (newAnnotation.calibrate.depth !== annotation.calibrate.depth) {
                            newAnnotation.calibrate.depth = annotation.calibrate.depth;
                            this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth = annotation.calibrate.depth;
                            newAnnotation.note = this.pdfViewer.annotationModule.measureAnnotationModule.
                                calculateVolume(newAnnotation.vertexPoints);
                        }
                    }
                }
            }
            if (this.pdfViewer.enableShapeLabel && annotation.labelSettings) {
                const text: string = annotation.labelSettings.labelContent;
                newAnnotation.note = text;
                newAnnotation.fontSize = annotation.labelSettings.fontSize;
                newAnnotation.labelFillColor = annotation.labelSettings.fillColor;
                if (newAnnotation.labelContent) {
                    newAnnotation.labelContent = text;
                }
                if (newAnnotation.labelSettings) {
                    newAnnotation.labelSettings = annotation.labelSettings;
                }
                this.updateAnnotationComments(newAnnotation.annotName, text);
            }
        } else if (annotationType === 'link') {
            if (annotation.bounds) {
                newAnnotation.bounds = annotation.bounds;
            }
            if (!isNullOrUndefined(annotation.url)) {
                newAnnotation.url = annotation.url;
            }
            if (!isNullOrUndefined(annotation.destinationPageIndex)) {
                newAnnotation.destinationPageIndex = annotation.destinationPageIndex;
            }
            if (!isNullOrUndefined(annotation.destinationLocation)) {
                newAnnotation.destinationLocation = annotation.destinationLocation;
            }
            if (!isNullOrUndefined(annotation.zoomValue)) {
                newAnnotation.zoomValue = annotation.zoomValue;
            }
            newAnnotation.strokeColor = annotation.strokeColor;
            newAnnotation.thickness = annotation.thickness;
            newAnnotation.subject = annotation.subject;
        } else if (annotationType === 'redaction') {
            if (annotation.bounds) {
                newAnnotation.bounds.left = annotation.bounds.x ? annotation.bounds.x : annotation.bounds.left;
                newAnnotation.bounds.top = annotation.bounds.y ? annotation.bounds.y : annotation.bounds.top;
                newAnnotation.bounds.width = annotation.bounds.width;
                newAnnotation.bounds.height = annotation.bounds.height;
            }
            newAnnotation.markerOpacity = annotation.markerOpacity;
            newAnnotation.markerBorderColor = annotation.markerBorderColor;
            newAnnotation.markerFillColor = annotation.markerFillColor;
            newAnnotation.fontFamily = annotation.fontFamily;
            newAnnotation.fontSize = annotation.fontSize;
            newAnnotation.fontColor = annotation.fontColor;
            newAnnotation.fillColor = annotation.fillColor;
            newAnnotation.font = annotation.font ? annotation.font : annotation.fontStyle;
            newAnnotation.textAlign = annotation.textAlign;
            newAnnotation.annotationSettings = annotation.annotationSettings;
            newAnnotation.allowedInteractions = annotation.allowedInteractions;
            newAnnotation.isRepeat = annotation.isRepeat;
            newAnnotation.overlayText = annotation.overlayText;
        } else if (annotationType === 'freetext') {
            if (annotation.bounds) {
                newAnnotation.bounds = annotation.bounds;
            }
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.strokeColor = annotation.strokeColor;
            newAnnotation.thickness = annotation.thickness;
            if (annotation.content) {
                newAnnotation.dynamicText = annotation.content;
            }
            newAnnotation.fontFamily = annotation.fontFamily;
            newAnnotation.fontSize = annotation.fontSize;
            newAnnotation.fontColor = annotation.fontColor;
            newAnnotation.fillColor = annotation.fillColor;
            newAnnotation.font = annotation.font ? annotation.font : annotation.fontStyle;
            newAnnotation.textAlign = annotation.textAlign;
            newAnnotation.annotationSettings = annotation.annotationSettings;
            newAnnotation.allowedInteractions = annotation.allowedInteractions;
            newAnnotation.isReadonly = annotation.isReadonly;
        }
        newAnnotation.author = annotation.author;
        newAnnotation.customData = annotation.customData;
        newAnnotation.subject = annotation.subject;
        newAnnotation.borderStyle = annotation.borderStyle;
        newAnnotation.borderDashArray = annotation.borderDashArray;
        if (isModifyStatus) {
            newAnnotation.modifiedDate = annotation.modifiedDate;
        }
        else {
            newAnnotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        }
        newAnnotation.isPrint = annotation.isPrint;
        if (annotation.annotationSettings && !isNullOrUndefined(annotation.annotationSettings.isLock)) {
            newAnnotation.isLocked = annotation.annotationSettings.isLock;
        }
        if (!isNullOrUndefined(annotation.annotationSelectorSettings) && (newAnnotation.annotationSelectorSettings !==
             annotation.annotationSelectorSettings)) {
            newAnnotation.annotationSelectorSettings = annotation.annotationSelectorSettings;
        }
        if (newAnnotation.status !== 'NewlyAdded') {
            newAnnotation.status = AnnotationStatus.ExistingModified;
        }
        return newAnnotation;
    }

    /**
     * @param {string} annotationType - annotationType
     * @param {string} annotationSubType - annotationSubType
     * @param {any} annotation - It gets the annotation details
     * @private
     * @returns {string} - string
     */
    public updateAnnotationAuthor(annotationType: string, annotationSubType?: string, annotation?: any): string {
        let annotationAuthor: string;
        if (annotationType === 'sticky') {
            annotationAuthor = (this.pdfViewer.stickyNotesSettings.author !== 'Guest') ? this.pdfViewer.stickyNotesSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
            }
        } else if (annotationType === 'stamp') {
            annotationAuthor = (this.pdfViewer.stampSettings.author !== 'Guest') ? this.pdfViewer.stampSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
            }
        } else if (annotationType === 'customStamp') {
            annotationAuthor = (this.pdfViewer.customStampSettings.author !== 'Guest') ? this.pdfViewer.customStampSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
            }
        } else if (annotationType === 'shape') {
            if (annotationSubType === 'Line') {
                annotationAuthor = (this.pdfViewer.lineSettings.author !== 'Guest') ? this.pdfViewer.lineSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'LineWidthArrowHead' || annotationSubType === 'Arrow') {
                annotationAuthor = (this.pdfViewer.arrowSettings.author !== 'Guest') ? this.pdfViewer.arrowSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Circle' || annotationSubType === 'Ellipse' || annotationSubType === 'Oval') {
                annotationAuthor = (this.pdfViewer.circleSettings.author !== 'Guest') ? this.pdfViewer.circleSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Rectangle' || annotationSubType === 'Square') {
                annotationAuthor = (this.pdfViewer.rectangleSettings.author !== 'Guest') ? this.pdfViewer.rectangleSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Polygon') {
                annotationAuthor = (this.pdfViewer.polygonSettings.author !== 'Guest') ? this.pdfViewer.polygonSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            }
        } else if (annotationType === 'measure') {
            if (annotationSubType === 'Distance' || annotationSubType === 'Distance calculation') {
                annotationAuthor = (this.pdfViewer.distanceSettings.author !== 'Guest') ? this.pdfViewer.distanceSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Perimeter' || annotationSubType === 'Perimeter calculation') {
                annotationAuthor = (this.pdfViewer.perimeterSettings.author !== 'Guest') ? this.pdfViewer.perimeterSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Radius' || annotationSubType === 'Radius calculation') {
                annotationAuthor = (this.pdfViewer.radiusSettings.author !== 'Guest') ? this.pdfViewer.radiusSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Area' || annotationSubType === 'Area calculation') {
                annotationAuthor = (this.pdfViewer.areaSettings.author !== 'Guest') ? this.pdfViewer.areaSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Volume' || annotationSubType === 'Volume calculation') {
                annotationAuthor = (this.pdfViewer.volumeSettings.author !== 'Guest') ? this.pdfViewer.volumeSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            }
        } else if (annotationType === 'textMarkup') {
            if (annotationSubType === 'Highlight') {
                annotationAuthor = (this.pdfViewer.highlightSettings.author !== 'Guest') ? this.pdfViewer.highlightSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Underline') {
                annotationAuthor = (this.pdfViewer.underlineSettings.author !== 'Guest') ? this.pdfViewer.underlineSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Strikethrough') {
                annotationAuthor = (this.pdfViewer.strikethroughSettings.author !== 'Guest') ? this.pdfViewer.strikethroughSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else if (annotationSubType === 'Squiggly') {
                annotationAuthor = (this.pdfViewer.squigglySettings.author !== 'Guest') ? this.pdfViewer.squigglySettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                    annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
                }
            } else {
                annotationAuthor = this.pdfViewer.annotationSettings.author;
            }
        } else if (annotationType === 'freeText') {
            annotationAuthor = (this.pdfViewer.freeTextSettings.author !== 'Guest') ? this.pdfViewer.freeTextSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
            }
        } else if (annotationType === 'ink') {
            annotationAuthor = (this.pdfViewer.inkAnnotationSettings.author !== 'Guest') ? this.pdfViewer.inkAnnotationSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            if ( annotationAuthor !== 'Guest' && this.pdfViewer.enableHtmlSanitizer ){
                annotationAuthor = SanitizeHtmlHelper.sanitize(annotationAuthor);
            }
        }
        if (annotation && annotation.Author !== annotationAuthor) {
            annotationAuthor = annotation.Author;
        }
        if (!annotationAuthor) {
            annotationAuthor = this.pdfViewer.annotationSettings.author;
        }
        return annotationAuthor;
    }

    /**
     * @param {string} colour - colour
     * @private
     * @returns {string} - string
     */
    public nameToHash(colour: string): string {
        const colours  : { [key: string]: string } = {
            'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff',
            'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff',
            'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'yellow': '#ffff00', 'yellowgreen': '#9acd32',
            'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50',
            'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c',
            'cyan': '#00ffff', 'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9',
            'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b',
            'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f', 'darkorange': '#ff8c00', 'darkorchid': '#9932cc',
            'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969',
            'dodgerblue': '#1e90ff', 'firebrick': '#b22222', 'floralwhite': '#fffaf0',
            'forestgreen': '#228b22', 'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff',
            'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080', 'green': '#008000',
            'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred ': '#cd5c5c',
            'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 'indigo': '#4b0082', 'ivory': '#fffff0',
            'navy': '#000080', 'oldlace': '#fdf5e6', 'olive': '#808000', 'khaki': '#f0e68c',
            'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd',
            'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff',
            'lightgoldenrodyellow': '#fafad2', 'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90',
            'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6',
            'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd',
            'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee', 'mediumspringgreen': '#00fa9a',
            'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970',
            'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead',
            'rebeccapurple': '#663399', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
            'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6',
            'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee',
            'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f',
            'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'pink': '#ffc0cb', 'plum': '#dda0dd',
            'steelblue': '#4682b4', 'violet': '#ee82ee', 'powderblue': '#b0e0e6', 'purple': '#800080',
            'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57',
            'seashell': '#fff5ee', 'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb',
            'slateblue': '#6a5acd', 'slategray': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f',
            'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0',
            'transparent': '#ffffff00'
        };
        if (typeof colours[colour.toLowerCase()] !== 'undefined') {
            return colours[colour.toLowerCase()];
        }
        return '';
    }

    private updateFreeTextFontStyle(font: any): number | Object {
        let fontStyle: number | Object = 0;
        if (font.isBold === 1) {
            fontStyle = 1;
        } else if (font.isItalic === 2) {
            fontStyle = 2;
        } else if (font.isUnderline === 4) {
            fontStyle = 4;
        } else if (font.isStrikeout === 8) {
            fontStyle = 8;
        } else {
            fontStyle = { isBold: font.isBold, isItalic: font.isItalic, isUnderline: font.isUnderline, isStrikeout: font.isStrikeout };
        }
        return fontStyle;
    }

    private setFreeTextFontStyle(fontStyle: any): any {
        if (fontStyle === 1) {
            return { isBold: true };
        } else if (fontStyle === 2) {
            return { isItalic: true };
        } else if (fontStyle === 4) {
            return { isUnderline: true };
        } else if (fontStyle === 8) {
            return { isStrikeout: true };
        } else {
            return { isBold: fontStyle.isBold, isItalic: fontStyle.isItalic, isUnderline: fontStyle.isUnderline,
                isStrikeout: fontStyle.isStrikeout};
        }
    }

    /**
     * Validates and normalizes min/max width and height constraints for common annotation settings.
     * @private
     * @param {AnnotationSettingsModel} settings - represents the common annotation settings
     * @returns {void}
     */
    public validateCommonAnnotationSettings(settings?: AnnotationSettingsModel): void {
        const annotation: AnnotationSettingsModel = !isNullOrUndefined(settings) ?
            settings : this.pdfViewer.annotationSettings;
        if (annotation && (annotation.minHeight || annotation.minWidth || annotation.maxHeight || annotation.maxWidth)) {
            this.pdfViewerBase.normalizeMinMaxPair(annotation, 'minWidth', 'maxWidth');
            this.pdfViewerBase.normalizeMinMaxPair(annotation, 'minHeight', 'maxHeight');
        }
    }

    /**
     * @param {any} annotation - annotation
     * @param {boolean} isSettings - isSettings
     * @private
     * @returns {any} - any
     */
    public findAnnotationSettings(annotation: any, isSettings?: boolean): AnnotationSettingsModel {
        let annotSettings: AnnotationSettingsModel = this.pdfViewer.annotationSettings;
        if (annotation) {
            const shapeType: string = annotation.shapeAnnotationType;
            if (shapeType === 'StickyNotes' && this.pdfViewer.stickyNotesSettings) {
                annotSettings = this.pdfViewer.stickyNotesSettings;
            } else if (shapeType === 'Stamp' || shapeType === 'Image') {
                annotSettings = this.pdfViewer.annotationModule.stampAnnotationModule.getStampSettings(annotation);
                if ((shapeType === 'Image')) {
                    annotSettings = this.pdfViewer.customStampSettings;
                }
            } else if (shapeType === 'FreeText') {
                annotSettings = this.pdfViewer.freeTextSettings;
            } else if (shapeType === 'Redaction') {
                annotSettings = this.pdfViewer.redactionSettings;
            } else if (annotation.measureType === '') {
                if (shapeType === 'Line') {
                    annotSettings = this.pdfViewer.lineSettings;
                } else if ((shapeType === 'Arrow' || shapeType === 'LineWidthArrowHead')) {
                    annotSettings = this.pdfViewer.arrowSettings;
                } else if (shapeType === 'Rectangle') {
                    annotSettings = this.pdfViewer.rectangleSettings;
                } else if ((shapeType === 'Circle' || shapeType === 'Ellipse')) {
                    annotSettings = this.pdfViewer.circleSettings;
                } else if (shapeType === 'Polygon' && this.pdfViewer.polygonSettings) {
                    annotSettings = this.pdfViewer.polygonSettings;
                }
            } else if (annotation.measureType !== '') {
                if (annotation.measureType === 'Distance') {
                    annotSettings = this.pdfViewer.distanceSettings;
                } else if (annotation.measureType === 'Perimeter') {
                    annotSettings = this.pdfViewer.perimeterSettings;
                } else if (annotation.measureType === 'Area') {
                    annotSettings = this.pdfViewer.areaSettings;
                } else if (annotation.measureType === 'Radius') {
                    annotSettings = this.pdfViewer.radiusSettings;
                } else if (annotation.measureType === 'Volume') {
                    annotSettings = this.pdfViewer.volumeSettings;
                }
            }
        }
        const settings: any = annotation ? annotation.annotationSettings : {};
        if (settings && (settings.minWidth || settings.maxWidth || settings.minHeight || settings.maxHeight)) {
            return this.updateSettings(settings);
        }
        else if (isSettings) {
            return this.updateSettings(annotSettings);
        } else {
            return annotSettings;
        }
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {any} - any
     */
    public updateAnnotationSettings(annotation: any): any {
        let annotSettings: AnnotationSettingsModel = this.pdfViewer.annotationSettings;
        if (annotation.AnnotType === 'sticky') {
            annotSettings = this.pdfViewer.stickyNotesSettings;
        } else if (annotation.AnnotType === 'stamp' || annotation.AnnotType === 'image' || annotation.AnnotType === 'Image') {
            annotSettings = this.pdfViewer.stampSettings;
            if ((annotation.Subject === 'image' || annotation.Subject === 'Image')) {
                annotSettings = this.pdfViewer.customStampSettings;
            }
        } else if (annotation.AnnotType === 'freeText') {
            annotSettings = this.pdfViewer.freeTextSettings;
        } else if (annotation.AnnotType === 'redaction') {
            annotSettings = this.pdfViewer.redactionSettings;
        } else if (annotation.AnnotType === 'ink' || annotation.AnnotationType === 'Ink'){
            annotSettings = this.pdfViewer.inkAnnotationSettings;
        } else if (annotation.AnnotType === 'shape') {
            if (annotation.Subject === 'Line') {
                annotSettings = this.pdfViewer.lineSettings;
            } else if ((annotation.Subject === 'Arrow' || annotation.Subject === 'LineWidthArrowHead')) {
                annotSettings = this.pdfViewer.arrowSettings;
            } else if ((annotation.Subject === 'Rectangle' || annotation.Subject === 'Square')) {
                annotSettings = this.pdfViewer.rectangleSettings;
            } else if ((annotation.Subject === 'Circle' || annotation.Subject === 'Ellipse' || annotation.Subject === 'Oval')) {
                annotSettings = this.pdfViewer.circleSettings;
            } else if (annotation.Subject === 'Polygon') {
                annotSettings = this.pdfViewer.polygonSettings;
            }
        } else if (annotation.AnnotType === 'shape_measure') {
            if ((annotation.Subject === 'Distance' || annotation.Subject === 'Distance calculation')) {
                annotSettings = this.pdfViewer.distanceSettings;
            } else if ((annotation.Subject === 'Perimeter' || annotation.Subject === 'Perimeter calculation')) {
                annotSettings = this.pdfViewer.perimeterSettings;
            } else if ((annotation.Subject === 'Area' || annotation.Subject === 'Area calculation')) {
                annotSettings = this.pdfViewer.areaSettings;
            } else if ((annotation.Subject === 'Radius' || annotation.Subject === 'Radius calculation')) {
                annotSettings = this.pdfViewer.radiusSettings;
            } else if ((annotation.Subject === 'Volume' || annotation.Subject === 'Volume calculation')) {
                annotSettings = this.pdfViewer.volumeSettings;
            }
        } else if (annotation.shapeAnnotationType === 'textMarkup'){
            if (annotation.subject === 'Highlight') {
                annotSettings = this.pdfViewer.highlightSettings;
            }
            else if (annotation.subject === 'Underline') {
                annotSettings = this.pdfViewer.underlineSettings;
            }
            else if (annotation.subject === 'Strikethrough') {
                annotSettings = this.pdfViewer.strikethroughSettings;
            }
            else if (annotation.subject === 'Squiggly') {
                annotSettings = this.pdfViewer.squigglySettings;
            }
        }
        return this.updateSettings(annotSettings);
    }

    /**
     * @param {any} annotationSettings - annotationSettings
     * @private
     * @returns {any} - any
     */
    public updateSettings(annotationSettings: any): any {
        let maxHeight: number = 0;
        let maxWidth: number = 0;
        let minHeight: number = 0;
        let minWidth: number = 0;
        let isLock: boolean = false;
        let isPrint: boolean = true;
        const settings: AnnotationSettingsModel = this.pdfViewer.annotationSettings;
        if (annotationSettings.minWidth || annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            maxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            maxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            minHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            minWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        } else if (settings.minWidth || settings.maxWidth || settings.minHeight || settings.maxHeight) {
            maxHeight = settings.maxHeight ? settings.maxHeight : 2000;
            maxWidth = settings.maxWidth ? settings.maxWidth : 2000;
            minHeight = settings.minHeight ? settings.minHeight : 0;
            minWidth = settings.minWidth ? settings.minWidth : 0;
        }
        isLock = annotationSettings.isLock ? annotationSettings.isLock : settings.isLock ? settings.isLock : false;
        isPrint = !isNullOrUndefined(annotationSettings.isPrint) ? annotationSettings.isPrint : true;
        return { minWidth: minWidth, maxWidth: maxWidth, minHeight: minHeight, maxHeight: maxHeight, isLock: isLock, isPrint: isPrint };
    }

    private getOverlappedAnnotations(annotation: any, pageNumber: number): any {
        const pageCollections: any = this.getPageShapeAnnotations(pageNumber);
        let selectedAnnotation: any;
        for (let i: number = 0; i < pageCollections.length; i++) {
            if (annotation.annotName === pageCollections[parseInt(i.toString(), 10)].annotName) {
                selectedAnnotation = pageCollections[parseInt(i.toString(), 10)];
                break;
            }
        }
        const annotationCollection: any = this.findOverlappedAnnotations(selectedAnnotation, pageCollections);
        return annotationCollection;
    }

    private getPageShapeAnnotations(pageNumber: number): any {
        const pageCollections: any = [];
        const inkAnnotObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_ink');
        if (inkAnnotObject) {
            const index: number = this.getPageCollection(inkAnnotObject, pageNumber);
            if (index != null && inkAnnotObject[parseInt(index.toString(), 10)]) {
                const inkAnnotations: IPageAnnotations[] = inkAnnotObject[parseInt(index.toString(), 10)].annotations;
                if (inkAnnotations && inkAnnotations.length > 0) {
                    for (let i: number = 0; i < inkAnnotations.length; i++) {
                        pageCollections.push(inkAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        const shapeAnnotObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_shape');
        if (shapeAnnotObject) {
            const index: number = this.getPageCollection(shapeAnnotObject, pageNumber);
            if (index != null && shapeAnnotObject[parseInt(index.toString(), 10)]) {
                const shapeAnnotations: IPageAnnotations[] = shapeAnnotObject[parseInt(index.toString(), 10)].annotations;
                if (shapeAnnotations && shapeAnnotations.length > 0) {
                    for (let i: number = 0; i < shapeAnnotations.length; i++) {
                        pageCollections.push(shapeAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        // Add this new block for redaction annotations
        const redactionObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_redaction');
        if (redactionObject) {
            const index: number = this.getPageCollection(redactionObject, pageNumber);
            if (index != null && redactionObject[index as number]) {
                const redactionAnnotations: IPageAnnotations[] = redactionObject[index as number].annotations;
                if (redactionAnnotations && redactionAnnotations.length > 0) {
                    for (let i: number = 0; i < redactionAnnotations.length; i++) {
                        pageCollections.push(redactionAnnotations[i as number]);
                    }
                }
            }
        }
        const measureAnnotationObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (measureAnnotationObject) {
            const index: number = this.getPageCollection(measureAnnotationObject, pageNumber);
            if (index != null && measureAnnotationObject[parseInt(index.toString(), 10)]) {
                const measureAnnotations: IPageAnnotations[] = measureAnnotationObject[parseInt(index.toString(), 10)].annotations;
                if (measureAnnotations && measureAnnotations.length > 0) {
                    for (let i: number = 0; i < measureAnnotations.length; i++) {
                        pageCollections.push(measureAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        const stampAnnotationObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_stamp');
        if (stampAnnotationObject) {
            const index: number = this.getPageCollection(stampAnnotationObject, pageNumber);
            if (index != null && stampAnnotationObject[parseInt(index.toString(), 10)]) {
                const stampAnnotations: IPageAnnotations[] = stampAnnotationObject[parseInt(index.toString(), 10)].annotations;
                if (stampAnnotations && stampAnnotations.length > 0) {
                    for (let i: number = 0; i < stampAnnotations.length; i++) {
                        pageCollections.push(stampAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        const freeTextAnnotationObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (freeTextAnnotationObject) {
            const index: number = this.getPageCollection(freeTextAnnotationObject, pageNumber);
            if (index != null && freeTextAnnotationObject[parseInt(index.toString(), 10)]) {
                const freeTextAnnotations: IPageAnnotations[] = freeTextAnnotationObject[parseInt(index.toString(), 10)].annotations;
                if (freeTextAnnotations && freeTextAnnotations.length > 0) {
                    for (let i: number = 0; i < freeTextAnnotations.length; i++) {
                        pageCollections.push(freeTextAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        const stickyNotesAnnotationObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (stickyNotesAnnotationObject) {
            const index: number = this.getPageCollection(stickyNotesAnnotationObject, pageNumber);
            if (index != null && stickyNotesAnnotationObject[parseInt(index.toString(), 10)]) {
                const stickyNotesAnnotations: IPageAnnotations[] =
                    stickyNotesAnnotationObject[parseInt(index.toString(), 10)].annotations;
                if (stickyNotesAnnotations && stickyNotesAnnotations.length > 0) {
                    for (let i: number = 0; i < stickyNotesAnnotations.length; i++) {
                        pageCollections.push(stickyNotesAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        const textMarkupAnnotationObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (textMarkupAnnotationObject) {
            const index: number = this.getPageCollection(textMarkupAnnotationObject, pageNumber);
            if (index != null && textMarkupAnnotationObject[parseInt(index.toString(), 10)]) {
                const textMarkupAnnotations: IPageAnnotations[] =
                    textMarkupAnnotationObject[parseInt(index.toString(), 10)].annotations;
                if (textMarkupAnnotations && textMarkupAnnotations.length > 0) {
                    for (let i: number = 0; i < textMarkupAnnotations.length; i++) {
                        pageCollections.push(textMarkupAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        return pageCollections;
    }

    private findOverlappedAnnotations(annotation: any, pageCollections: any): any {
        this.overlappedAnnotations = [];
        if (annotation && annotation.bounds) {
            if (annotation.shapeAnnotationType === 'textMarkup') {
                for (let i: number = 0; i < annotation.bounds.length; i++) {
                    const bounds: Object = this.orderTextMarkupBounds(annotation.bounds[parseInt(i.toString(), 10)]);
                    this.calculateOverlappedAnnotationBounds(annotation, bounds, pageCollections);
                }
            } else {
                this.calculateOverlappedAnnotationBounds(annotation, annotation.bounds, pageCollections);
            }
        }
        return this.overlappedAnnotations;
    }

    private calculateOverlappedAnnotationBounds(annotation: any, bounds: any, pageCollections: any): void {
        let selectBounds: any = bounds;
        if (annotation.shapeAnnotationType === 'Ink') {
            selectBounds = { left: bounds.x, top: bounds.y, height: bounds.height, width: bounds.width };
        }
        const left: number = parseInt(selectBounds.left, 10);
        const top: number = parseInt(selectBounds.top, 10);
        const totalHeight: number = parseInt(selectBounds.top + selectBounds.height, 10);
        const totalWidth: number = parseInt(selectBounds.left + selectBounds.width, 10);
        for (let i: number = 0; i < pageCollections.length; i++) {
            if (annotation.annotName === pageCollections[parseInt(i.toString(), 10)].annotName) {
                this.checkOverlappedCollections(pageCollections[parseInt(i.toString(), 10)], this.overlappedAnnotations);
            } else {
                let boundsCount: number = 1;
                if (pageCollections[parseInt(i.toString(), 10)].shapeAnnotationType === 'textMarkup') {
                    boundsCount = pageCollections[parseInt(i.toString(), 10)].bounds.length;
                }
                for (let j: number = 0; j < boundsCount; j++) {
                    let annotationBounds: any;
                    let annotationBoundsCollection: any = pageCollections[parseInt(i.toString(), 10)].bounds;
                    if (pageCollections[parseInt(i.toString(), 10)].shapeAnnotationType === 'Ink') {
                        annotationBoundsCollection = { left: annotationBoundsCollection.x, top: annotationBoundsCollection.y,
                            height: annotationBoundsCollection.height, width: annotationBoundsCollection.width };
                    }
                    if (pageCollections[parseInt(i.toString(), 10)].shapeAnnotationType !== 'textMarkup' && boundsCount === 1) {
                        annotationBounds = annotationBoundsCollection;
                    } else {
                        annotationBounds = this.orderTextMarkupBounds(annotationBoundsCollection[parseInt(j.toString(), 10)]);
                    }
                    if (annotationBounds) {
                        let isOverlapped: boolean = false;
                        if (((left <= parseInt(annotationBounds.left, 10)) && (totalWidth >= parseInt(annotationBounds.left, 10))) ||
                         ((left <= parseInt(annotationBounds.left + annotationBounds.width, 10)) &&
                          (totalWidth >= parseInt(annotationBounds.left + annotationBounds.width, 10)))) {
                            isOverlapped = true;
                        }
                        if (isOverlapped) {
                            if (((top <= parseInt(annotationBounds.top, 10)) && (totalHeight >= parseInt(annotationBounds.top, 10))) ||
                             ((top <= parseInt(annotationBounds.top + annotationBounds.height, 10)) &&
                              (totalHeight >= parseInt(annotationBounds.top + annotationBounds.height, 10)))) {
                                isOverlapped = true;
                            } else {
                                isOverlapped = false;
                            }
                        }
                        if (isOverlapped) {
                            this.checkOverlappedCollections(pageCollections[parseInt(i.toString(), 10)], this.overlappedAnnotations);
                        } else {
                            if (((parseInt(annotationBounds.left, 10) <= left) &&
                             (parseInt(annotationBounds.left + annotationBounds.width, 10) >= left)) ||
                              ((totalWidth >= parseInt(annotationBounds.left, 10)) &&
                               (totalWidth <= parseInt(annotationBounds.left + annotationBounds.width, 10)))) {
                                isOverlapped = true;
                            }
                            if (isOverlapped) {
                                if (((parseInt(annotationBounds.top, 10) <= top) &&
                                parseInt(annotationBounds.top + annotationBounds.height, 10) >= top) ||
                                 ((totalHeight >= parseInt(annotationBounds.top, 10)) &&
                                  (totalHeight <= parseInt(annotationBounds.top + annotationBounds.height, 10)))) {
                                    isOverlapped = true;
                                } else {
                                    isOverlapped = false;
                                }
                            }
                            if (isOverlapped) {
                                this.checkOverlappedCollections(pageCollections[parseInt(i.toString(), 10)], this.overlappedAnnotations);
                            } else {
                                if (((left <= parseInt(annotationBounds.left, 10)) &&
                                (totalWidth >= parseInt(annotationBounds.left, 10))) ||
                                 ((left <= parseInt(annotationBounds.left + annotationBounds.width, 10)) &&
                                  (totalWidth >= parseInt(annotationBounds.left + annotationBounds.width, 10)))) {
                                    isOverlapped = true;
                                }
                                if (isOverlapped) {
                                    if (((parseInt(annotationBounds.top, 10) <= top) &&
                                     parseInt(annotationBounds.top + annotationBounds.height, 10) >= top) ||
                                      ((totalHeight >= parseInt(annotationBounds.top, 10)) &&
                                       (totalHeight <= parseInt(annotationBounds.top + annotationBounds.height, 10)))) {
                                        isOverlapped = true;
                                    } else {
                                        isOverlapped = false;
                                    }
                                }
                                if (isOverlapped) {
                                    this.checkOverlappedCollections(pageCollections[parseInt(i.toString(), 10)],
                                                                    this.overlappedAnnotations);
                                } else {
                                    if (((parseInt(annotationBounds.left, 10) <= left) &&
                                    (parseInt(annotationBounds.left + annotationBounds.width, 10) >= left)) ||
                                    ((totalWidth >= parseInt(annotationBounds.left, 10)) &&
                                    (totalWidth <= parseInt(annotationBounds.left + annotationBounds.width, 10)))) {
                                        isOverlapped = true;
                                    }
                                    if (isOverlapped) {
                                        if (((top <= parseInt(annotationBounds.top, 10)) &&
                                        (totalHeight >= parseInt(annotationBounds.top, 10))) ||
                                        ((top <= parseInt(annotationBounds.top + annotationBounds.height, 10)) &&
                                        (totalHeight >= parseInt(annotationBounds.top + annotationBounds.height, 10)))) {
                                            isOverlapped = true;
                                        } else {
                                            isOverlapped = false;
                                        }
                                    }
                                    if (isOverlapped) {
                                        this.checkOverlappedCollections(pageCollections[parseInt(i.toString(), 10)],
                                                                        this.overlappedAnnotations);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @param {number} pageNumber - pageNumber
     * @param {string} type - type
     * @private
     * @returns {string} - string
     */
    public findAnnotationMode(annotation: any, pageNumber: number, type: string): string {
        const importCollection: any = this.pdfViewer.viewerBase.importedAnnotation &&
        this.pdfViewer.viewerBase.importedAnnotation[parseInt(pageNumber.toString(), 10)];
        if (importCollection) {
            let collection: any[];
            if (type === 'shape') {
                collection = importCollection.shapeAnnotation;
            } else if (type === 'shape_measure') {
                collection = importCollection.measureShapeAnnotation;
            } else if (type === 'freeText') {
                collection = importCollection.freeTextAnnotation;
            } else if (type === 'stamp') {
                collection = importCollection.stampAnnotations;
            } else if (type === 'sticky') {
                collection = importCollection.stickyNotesAnnotation;
            } else if (type === 'textMarkup') {
                collection = importCollection.textMarkupAnnotation;
            }
            if (collection) {
                for (let i: number = 0; i < collection.length; i++) {
                    if (collection[parseInt(i.toString(), 10)].AnnotName === annotation.AnnotName) {
                        return 'Imported Annotation';
                    }
                }
            }
        }
        return 'Existing Annotation';
    }

    private checkOverlappedCollections(annotation: any, overlappedCollections: any): void {
        if (overlappedCollections.length > 0) {
            let isAdded: boolean = false;
            for (let i: number = 0; i < overlappedCollections.length; i++) {
                if (annotation.annotName === overlappedCollections[parseInt(i.toString(), 10)].annotName &&
                annotation.bounds === overlappedCollections[parseInt(i.toString(), 10)].bounds) {
                    isAdded = true;
                    break;
                }
            }
            if (!isAdded) {
                overlappedCollections.push(annotation);
            }
        } else {
            overlappedCollections.push(annotation);
        }
    }

    private orderTextMarkupBounds(bounds: any): Object {
        if (bounds.Left || bounds.Width) {
            return { left: bounds.Left, top: bounds.Top, height: bounds.Height, width: bounds.Width };
        } else {
            return { left: bounds.left, top: bounds.top, height: bounds.height, width: bounds.width };
        }
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {void}
     */
    public updateModifiedDate(annotation: any): void {
        if (annotation.modifiedDate) {
            annotation.modifiedDate = this.setAnnotationModifiedDate(annotation.modifiedDate);
        }
        if (annotation.comments && annotation.comments.length > 0) {
            for (let i: number = 0; i < annotation.comments.length; i++) {
                if (annotation.comments[parseInt(i.toString(), 10)].modifiedDate) {
                    annotation.comments[parseInt(i.toString(), 10)].modifiedDate =
                    this.setAnnotationModifiedDate(annotation.comments[parseInt(i.toString(), 10)].modifiedDate);
                    if (annotation.comments[parseInt(i.toString(), 10)].review &&
                    annotation.comments[parseInt(i.toString(), 10)].review.modifiedDate) {
                        annotation.comments[parseInt(i.toString(), 10)].review.modifiedDate =
                        this.setAnnotationModifiedDate(annotation.comments[parseInt(i.toString(), 10)].review.modifiedDate);
                    }
                }
            }
        }
        if (annotation.review && annotation.review.modifiedDate) {
            annotation.review.modifiedDate = this.setAnnotationModifiedDate(annotation.review.modifiedDate);
        }
    }

    private setAnnotationModifiedDate(date: string): string {
        let modifiedTime: string;
        let modifiedDateTime: string;
        if (date !== '') {
            const time: number = parseInt(date.split(' ')[1].split(':')[0], 10);
            if (date.split(' ').length === 3) {
                modifiedTime = time + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' ' + date.split(' ')[2];
            } else {
                if (time >= 12) {
                    if (time === 12) {
                        modifiedTime = time + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' PM';
                    } else {
                        modifiedTime = (time - 12) + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' PM';
                    }
                } else {
                    modifiedTime = time + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' AM';
                }
            }
            const dateString: string = date.split(' ')[0];
            const dateStringSpilt: string[] = date.split(',');
            if (dateStringSpilt.length > 1) {
                modifiedDateTime = dateString + (' ') + modifiedTime;
            } else {
                modifiedDateTime = dateString + (', ') + modifiedTime;
            }
        } else {
            return date;
        }

        const isTwelveHourFormat: boolean = /\u0041\u004D|\u0050\u004D/i.test(modifiedDateTime);
        if (isTwelveHourFormat) {
            const modifiedDateToUTC: Date = new Date(modifiedDateTime);
            modifiedDateTime = modifiedDateToUTC.toISOString();
        }
        return modifiedDateTime;
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        if (this.shapeAnnotationModule) {
            this.shapeAnnotationModule.shapeCount = 0;
        }
        if (this.measureAnnotationModule) {
            this.measureAnnotationModule.measureShapeCount = 0;
        }
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.clear();
        }
        if (this.stickyNotesAnnotationModule) {
            this.stickyNotesAnnotationModule.clear();
        }
        this.pdfViewer.isViewerRefresh = true;
        this.pdfViewer.refresh();
        this.pdfViewer.isViewerRefresh = false;
        this.undoCommentsElement = [];
        this.redoCommentsElement = [];
        this.overlappedAnnotations = [];
        this.previousIndex = null;
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
            this.pdfViewer.annotation.stampAnnotationModule.stampPageNumber = [];
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.redactionAnnotationModule) {
            this.pdfViewer.annotation.redactionAnnotationModule.redactionPageNumbers = [];
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
            this.pdfViewer.annotation.freeTextAnnotationModule.freeTextPageNumbers = [];
            this.freeTextAnnotationModule.previousText = 'Type Here';
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.inkAnnotationModule) {
            this.pdfViewer.annotation.inkAnnotationModule.inkAnnotationindex = [];
        }
        this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_shape');
        this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_stamp');
        this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_sticky');

        // Clear comment filter state when loading a new document
        this.currentFilterState = null;
        this.newlyAddedAnnotations.clear();
        this.hiddenAnnotationIds.clear();
    }
    public retrieveAnnotationCollection(): any[] {
        return this.pdfViewer.annotationCollection;
    }

    /**
     * @param {string} interaction - interaction
     * @param {any} annotation - annotation
     * @private
     * @returns {boolean} - boolean
     */
    public checkAllowedInteractions(interaction: string, annotation: any): boolean {
        const annotationInteraction: string[] = this.updateAnnotationAllowedInteractions(annotation);
        if (annotationInteraction && annotationInteraction.length > 0) {
            for (let i: number = 0; i < annotationInteraction.length; i++) {
                if (interaction === 'Select') {
                    if (annotationInteraction[parseInt(i.toString(), 10)] === 'Move' || annotationInteraction[parseInt(i.toString(), 10)] === 'Resize' || annotationInteraction[parseInt(i.toString(), 10)] === 'Delete' || annotationInteraction[parseInt(i.toString(), 10)] === 'PropertyChange' || annotationInteraction[parseInt(i.toString(), 10)] === 'Select') {
                        return true;
                    }
                } else {
                    if (annotationInteraction[parseInt(i.toString(), 10)] === interaction) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * @param {any} menuObj - menuObj
     * @private
     * @returns {void}
     */
    public checkContextMenuDeleteItem(menuObj: any): void {
        const annotation: PdfAnnotationBaseModel | AnnotationsInternal = this.findCurrentAnnotation();
        if (annotation && annotation.annotationSettings) {
            if (annotation.annotationSettings.isLock) {
                if (this.checkAllowedInteractions('Delete', annotation)) {
                    menuObj.enableItems([this.pdfViewer.localeObj.getConstant('Delete Context')], true);
                } else {
                    menuObj.enableItems([this.pdfViewer.localeObj.getConstant('Delete Context')], false);
                }
            } else {
                menuObj.enableItems([this.pdfViewer.localeObj.getConstant('Delete Context')], true);
            }
        }
    }

    /**
     * @private
     * @returns {boolean} - boolean
     */
    public isEnableDelete(): boolean {
        const annotation: PdfAnnotationBaseModel | AnnotationsInternal = this.findCurrentAnnotation();
        if (annotation && annotation.annotationSettings) {
            if (annotation.annotationSettings.isLock) {
                if (this.checkAllowedInteractions('Delete', annotation)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
        return false;
    }

    /**
     * @private
     * @returns {ITextMarkupAnnotation | PdfAnnotationBaseModel} - ITextMarkupAnnotation | PdfAnnotationBaseModel
     */
    public findCurrentAnnotation(): AnnotationsInternal | PdfAnnotationBaseModel {
        if (this.textMarkupAnnotationModule && this.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            return this.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        }
        if (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations[0]) {
            return this.pdfViewer.selectedItems.annotations[0];
        }
        return null;
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {string[]} - return string array
     */
    public updateAnnotationAllowedInteractions(annotation: any): string[] {
        let annotationInteraction: string[] = ['None'];
        if (annotation) {
            if (annotation.shapeAnnotationType === 'FreeText' && this.pdfViewer.freeTextSettings.allowedInteractions) {
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.freeTextSettings.allowedInteractions,
                                                                             annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'Ink' && this.pdfViewer.inkAnnotationSettings.allowedInteractions) {
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.inkAnnotationSettings.allowedInteractions,
                                                                             annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'StickyNotes' && this.pdfViewer.stickyNotesSettings.allowedInteractions) {
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.stickyNotesSettings.allowedInteractions,
                                                                             annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'Stamp' && this.pdfViewer.stampSettings.allowedInteractions) {
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.stampSettings.allowedInteractions,
                                                                             annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'Image' && this.pdfViewer.customStampSettings.allowedInteractions) {
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.customStampSettings.allowedInteractions,
                                                                             annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'textMarkup') {
                if (annotation.textMarkupAnnotationType === 'Highlight' && this.pdfViewer.highlightSettings.allowedInteractions) {
                    annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.highlightSettings.allowedInteractions,
                                                                                 annotation.allowedInteractions);
                } else if (annotation.textMarkupAnnotationType === 'Underline' && this.pdfViewer.underlineSettings.allowedInteractions) {
                    annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.underlineSettings.allowedInteractions,
                                                                                 annotation.allowedInteractions);
                } else if (annotation.textMarkupAnnotationType === 'Strikethrough' && this.pdfViewer.strikethroughSettings.allowedInteractions) {
                    annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.strikethroughSettings.allowedInteractions,
                                                                                 annotation.allowedInteractions);
                } else if (annotation.textMarkupAnnotationType === 'Squiggly' && this.pdfViewer.squigglySettings.allowedInteractions) {
                    annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.squigglySettings.allowedInteractions,
                                                                                 annotation.allowedInteractions);
                }
            } else {
                if (annotation.measureType !== '') {
                    if (annotation.measureType === 'Distance' && this.pdfViewer.distanceSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.distanceSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Perimeter' && this.pdfViewer.perimeterSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.perimeterSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Radius' && this.pdfViewer.radiusSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.radiusSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Area' && this.pdfViewer.areaSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.areaSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Volume' && this.pdfViewer.volumeSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.volumeSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    }
                } else {
                    if (annotation.shapeAnnotationType === 'Line' && this.pdfViewer.lineSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.lineSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if ((annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead') && this.pdfViewer.arrowSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.arrowSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if ((annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse' || annotation.shapeAnnotationType === 'Oval') && this.pdfViewer.circleSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.circleSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if ((annotation.shapeAnnotationType === 'Rectangle' || annotation.shapeAnnotationType === 'Square') && this.pdfViewer.rectangleSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.rectangleSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.shapeAnnotationType === 'Polygon' && this.pdfViewer.polygonSettings.allowedInteractions) {
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.polygonSettings.
                            allowedInteractions, annotation.allowedInteractions);
                    }
                }
            }
        }
        return annotationInteraction;
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {boolean} -boolean
     */
    public checkIsLockSettings(annotation: any): boolean {
        let isLocked: boolean = false;
        if (annotation) {
            if (annotation.shapeAnnotationType === 'FreeText') {
                isLocked = this.checkLockSettings(this.pdfViewer.freeTextSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'Ink') {
                isLocked = this.checkLockSettings(this.pdfViewer.inkAnnotationSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'StickyNotes') {
                isLocked = this.checkLockSettings(this.pdfViewer.stickyNotesSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'Stamp') {
                isLocked = this.checkLockSettings(this.pdfViewer.stampSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'Image') {
                isLocked = this.checkLockSettings(this.pdfViewer.customStampSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'textMarkup') {
                if (annotation.textMarkupAnnotationType === 'Highlight') {
                    isLocked = this.checkLockSettings(this.pdfViewer.highlightSettings.isLock);
                } else if (annotation.textMarkupAnnotationType === 'Underline') {
                    isLocked = this.checkLockSettings(this.pdfViewer.underlineSettings.isLock);
                } else if (annotation.textMarkupAnnotationType === 'Strikethrough') {
                    isLocked = this.checkLockSettings(this.pdfViewer.strikethroughSettings.isLock);
                } else if (annotation.textMarkupAnnotationType === 'Squiggly') {
                    isLocked = this.checkLockSettings(this.pdfViewer.squigglySettings.isLock);
                }
            } else {
                if (annotation.measureType !== '') {
                    if (annotation.measureType === 'Distance') {
                        isLocked = this.checkLockSettings(this.pdfViewer.distanceSettings.isLock);
                    } else if (annotation.measureType === 'Perimeter') {
                        isLocked = this.checkLockSettings(this.pdfViewer.perimeterSettings.isLock);
                    } else if (annotation.measureType === 'Radius') {
                        isLocked = this.checkLockSettings(this.pdfViewer.radiusSettings.isLock);
                    } else if (annotation.measureType === 'Area') {
                        isLocked = this.checkLockSettings(this.pdfViewer.areaSettings.isLock);
                    } else if (annotation.measureType === 'Volume') {
                        isLocked = this.checkLockSettings(this.pdfViewer.volumeSettings.isLock);
                    }
                } else {
                    if (annotation.shapeAnnotationType === 'Line') {
                        isLocked = this.checkLockSettings(this.pdfViewer.lineSettings.isLock);
                    } else if ((annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead')) {
                        isLocked = this.checkLockSettings(this.pdfViewer.arrowSettings.isLock);
                    } else if ((annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse' || annotation.shapeAnnotationType === 'Oval')) {
                        isLocked = this.checkLockSettings(this.pdfViewer.circleSettings.isLock);
                    } else if ((annotation.shapeAnnotationType === 'Rectangle' || annotation.shapeAnnotationType === 'Square')) {
                        isLocked = this.checkLockSettings(this.pdfViewer.rectangleSettings.isLock);
                    } else if (annotation.shapeAnnotationType === 'Polygon') {
                        isLocked = this.checkLockSettings(this.pdfViewer.polygonSettings.isLock);
                    }
                }
            }
        }
        return isLocked;
    }

    /**
     * @private
     * @param {boolean} locked - locked
     * @returns {boolean} - boolean
     */
    public checkLockSettings(locked: boolean): boolean {
        let islock: boolean = false;
        if (locked || this.pdfViewer.annotationSettings.isLock) {
            islock = true;
        }
        return islock;
    }

    /**
     * @private
     * @returns {boolean} - boolean
     */
    public restrictContextMenu(): boolean {
        let isRestrict: boolean = false;
        const annotation: AnnotationsInternal | PdfAnnotationBaseModel = this.findCurrentAnnotation();
        if (annotation && this.checkIsLockSettings(annotation) && this.checkAllowedInteractions('Select', annotation)) {
            isRestrict = true;
        }
        return isRestrict;
    }

    private checkAllowedInteractionSettings(annotationInteraction: AllowedInteraction[],
                                            annotationAllowedInteraction: string[]): string[] | AllowedInteraction[] {
        if (annotationAllowedInteraction) {
            if (annotationAllowedInteraction.length === 1) {
                if (annotationAllowedInteraction[0] !== 'None') {
                    return annotationAllowedInteraction;
                }
            } else {
                return annotationAllowedInteraction;
            }
        }
        if (annotationInteraction) {
            if (annotationInteraction.length === 1) {
                if (annotationInteraction[0] !== 'None') {
                    return annotationInteraction;
                }
            } else {
                return annotationInteraction;
            }
        }
        if (this.pdfViewer.annotationSettings.allowedInteractions) {
            return this.pdfViewer.annotationSettings.allowedInteractions;
        }
        return ['None'];
    }

    /**
     * @param {string} value - value
     * @param {string} type - type
     * @private
     * @returns {string} - string
     */
    public getValue(value?: string, type?: string): string {
        type = !type ? 'hex' : type.toLowerCase();
        if (value[0] === 'r') {
            const cValue: number[] = this.convertRgbToNumberArray(value);
            if (type === 'hex' || type === 'hexa') {
                const hex: string = this.rgbToHex(cValue);
                return type === 'hex' ? hex.slice(0, 7) : hex;
            } else {
                if (type === 'hsv') {
                    // eslint-disable-next-line
                    return this.convertToHsvString(this.rgbToHsv.apply(this, cValue.slice(0, 3)));
                } else {
                    if (type === 'hsva') {
                        // eslint-disable-next-line
                        return this.convertToHsvString(this.rgbToHsv.apply(this, cValue));
                    } else {
                        return 'null';
                    }
                }
            }
        } else {
            if (value[0] === 'h') {
                // eslint-disable-next-line
                const cValue: number[] = this.hsvToRgb.apply(this, this.convertRgbToNumberArray(value));
                if (type === 'rgba') {
                    return this.convertToRgbString(cValue);
                } else {
                    if (type === 'hex' || type === 'hexa') {
                        const hex: string = this.rgbToHex(cValue);
                        return type === 'hex' ? hex.slice(0, 7) : hex;
                    } else {
                        if (type === 'rgb') {
                            return this.convertToRgbString(cValue.slice(0, 3));
                        } else {
                            return 'null';
                        }
                    }
                }
            } else {
                value = this.roundValue(value);
                let rgb: number[] = this.hexToRgb(value);
                if (type === 'rgb' || type === 'hsv') {
                    rgb = rgb.slice(0, 3);
                }
                if (type === 'rgba' || type === 'rgb') {
                    return this.convertToRgbString(rgb);
                } else {
                    if (type === 'hsva' || type === 'hsv') {
                        // eslint-disable-next-line
                        return this.convertToHsvString(this.rgbToHsv.apply(this, rgb));
                    } else {
                        if (type === 'hex') {
                            return value.slice(0, 7);
                        } else {
                            if (type === 'a') {
                                return rgb[3].toString();
                            } else {
                                return 'null';
                            }
                        }
                    }
                }
            }
        }
    }

    private convertRgbToNumberArray(value: string): number[] {
        return (value.slice(value.indexOf('(') + 1, value.indexOf(')'))).split(',').map(
            (n: string, i: number) => {
                return (i !== 3) ? parseInt(n, 10) : parseFloat(n);
            });
    }

    private convertToRgbString(rgb: number[]): string {
        return rgb.length ? rgb.length === 4 ? 'rgba(' + rgb.join() + ')' : 'rgb(' + rgb.join() + ')' : '';
    }

    private convertToHsvString(hsv: number[]): string {
        return hsv.length === 4 ? 'hsva(' + hsv.join() + ')' : 'hsv(' + hsv.join() + ')';
    }

    private roundValue(value: string): string {
        if (!value) {
            return '';
        }
        if (value[0] !== '#') {
            value = '#' + value;
        }
        let len: number = value.length;
        if (len === 4) {
            value += 'f';
            len = 5;
        }
        if (len === 5) {
            let tempValue: string = '';
            for (let i: number = 1, len: number = value.length; i < len; i++) {
                tempValue += (value.charAt(i) + value.charAt(i));
            }
            value = '#' + tempValue;
            len = 9;
        }
        if (len === 7) {
            value += 'ff';
        }
        return value;
    }

    private hexToRgb(hex: string): number[] {
        if (!hex) {
            return [];
        }
        hex = hex.trim();
        if (hex.length !== 9) {
            hex = this.roundValue(hex);
        }
        const opacity: number = Number((parseInt(hex.slice(-2), 16) / 255).toFixed(2));
        hex = hex.slice(1, 7);
        const bigInt: number = parseInt(hex, 16); const h: number[] = [];
        h.push((bigInt >> 16) & 255);
        h.push((bigInt >> 8) & 255);
        h.push(bigInt & 255);
        h.push(opacity);
        return h;
    }

    private rgbToHsv(r: number, g: number, b: number, opacity?: number): number[] {
        r /= 255; g /= 255; b /= 255;
        const max: number = Math.max(r, g, b); const min: number = Math.min(r, g, b);
        let h: number; const v: number = max;
        const d: number = max - min;
        const s: number = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0;
        } else {
            switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        const hsv: number[] = [Math.round(h * 360), Math.round(s * 1000) / 10, Math.round(v * 1000) / 10];
        if (!isNullOrUndefined(opacity)) {
            hsv.push(opacity);
        }
        return hsv;
    }

    private hsvToRgb(h: number, s: number, v: number, opacity?: number): number[] {
        let r: number; let g: number; let b: number;
        s /= 100; v /= 100;
        if (s === 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), opacity];
        }
        h /= 60;
        const i: number = Math.floor(h);
        const f: number = h - i;
        const p: number = v * (1 - s);
        const q: number = v * (1 - s * f);
        const t: number = v * (1 - s * (1 - f));
        switch (i) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        default: r = v; g = p; b = q;
        }
        const rgb: number[] = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        if (!isNullOrUndefined(opacity)) {
            rgb.push(opacity);
        }
        return rgb;
    }

    private rgbToHex(rgb: number[]): string {
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).slice(-2) : '00') : '')) : '';
    }

    /**
     * @param {AnnotationDataFormat} dataFormat - dataFormat
     * @private
     * @returns {Promise} - promise
     */
    public exportAnnotationsAsStream(dataFormat: AnnotationDataFormat): Promise<object> {
        if (this.pdfViewer.annotationModule) {
            const isAnnotations: boolean = this.pdfViewer.viewerBase.updateExportItem();
            if (isAnnotations) {
                return new Promise((resolve: Function, reject: Function) => {
                    this.pdfViewer.viewerBase.createRequestForExportAnnotations(true, dataFormat, true).then((value: string) => {
                        resolve(value);
                    });
                });
            }
        }
        return null;
    }

    private hex(x: number): string {
        if (!isNullOrUndefined(x))
        {
            return ('0' + x.toString(16)).slice(-2);
        }
        else{
            return '0';
        }
    }

    /**
     * @private
     * @param {any} annotationObject - annotation object for which the changed event is fired
     * @param {EditAction} action - last action performed on the annotation
     * @param {boolean} isRedactionApplied - indicates whether the event is triggered by a redaction apply action
     * @returns {void}
     */
    public fireAnnotationChangedEvent(annotationObject: any, action: EditAction, isRedactionApplied?: boolean): void {
        let annotation : any;
        let annotationType: string;
        if (!isNullOrUndefined(annotationObject) && !isNullOrUndefined(annotationObject)) {
            annotation = this.updateAnnotationNameIndex(annotationObject);
            if (annotation.shapeAnnotationType === 'textMarkup' || annotation.shapeAnnotationType === 'textmarkup') {
                annotationType = annotation.textMarkupAnnotationType;
            }
            else if (!isNullOrUndefined(annotation.calibrate)) {
                annotationType = this.measureAnnotationModule.getMeasureType(annotation);
            }
            else {
                const type: string = (this.pdfViewer.nameTable as any)[annotation.uniqueKey] ?
                    (this.pdfViewer.nameTable as any)[annotation.uniqueKey].shapeAnnotationType : annotation.shapeAnnotationType;
                annotationType = this.getAnnotationType(type, '');
            }
        }
        if (isRedactionApplied) {
            const eventArgs: any = {
                action: action,
                annotationId: '',
                pageIndex: null,
                annotationType: '',
                isRedacted: isRedactionApplied
            };
            this.pdfViewer.trigger('annotationChanged', eventArgs);
            // Trigger the unified documentChanged event for collaboration only if enabled
            if (this.pdfViewer.enableCollaborativeEditing) {
                this.pdfViewer.trigger('documentChanged', eventArgs);
            }
        }
        else {
            const eventArgs: any = {
                action: action,
                annotationId: annotation ? annotation.annotName : null,
                pageIndex: annotation ? annotation.pageIndex : null,
                annotationType: annotationType,
                isRedacted: false
            };
            this.pdfViewer.trigger('annotationChanged', eventArgs);
            // Trigger the unified documentChanged event for collaboration only if enabled
            if (this.pdfViewer.enableCollaborativeEditing) {
                this.pdfViewer.trigger('documentChanged', eventArgs);
            }
        }
    }

    /**
     * @param {any} annotation - last action annotation
     * @returns {any} - the annotation with normalized field names
     */
    private updateAnnotationNameIndex(annotation: any): any {
        annotation.annotName = annotation.annotationId;
        delete annotation.annotationId;
        annotation.pageIndex = annotation.pageNumber;
        delete annotation.pageNumber;
        return annotation;
    }

    /**
     * Exports a single annotation as XFDF.
     *
     * Behavior:
     * - If `action` is omitted, returns the annotation's pure XFDF.
     * - If `action` is provided, wraps the XFDF in the corresponding
     * action tag (`add`, `modify`, or `delete`).
     * Annotation source:
     * - `Delete`: uses `lastActionCollection.annotation`.
     * - `Add` / `Modify` / undefined: finds the annotation in
     * `annotationCollection` by `annotationId` or `annotName`.
     *
     * For delete actions, only the annotation id and page information
     * are included. For add and modify actions, the full annotation XFDF is exported.
     *
     * Returns an empty wrapped XFDF when the annotation cannot be found
     * or the required collection is unavailable. Throws only if the page
     * cannot be resolved or XFDF generation fails.
     *
     * @private
     * @param {string} annotationId - Annotation identifier.
     * @param {EditAction} [action] - Optional action (`Add`, `Modify`, or `Delete`).
     * @returns {string} Exported XFDF string.
     */
    public exportAnnotationById(annotationId: string, action?: EditAction): string {
        let actionObject: any;
        // For delete action, use annotation from lastActionCollection
        if (action === EditAction.Delete) {
            if (isNullOrUndefined(this.lastActionCollection) || isNullOrUndefined(this.lastActionCollection.annotation)) {
                return this.createWrappedXfdf('add', [], []);
            }
            actionObject = this.cloneObject(this.lastActionCollection.annotation);
            return this.buildDeleteActionXfdf(actionObject);
        }
        // For add or modify actions, retrieve from annotationCollection
        const annotationsArray: any = this.pdfViewer.annotationCollection;
        if (isNullOrUndefined(annotationsArray) || annotationsArray.length === 0) {
            return this.createWrappedXfdf('add', [], []);
        }
        const foundAnnotations: any[] = annotationsArray.filter(
            (annot: any) => annot.annotationId === annotationId || annot.annotName === annotationId
        );
        if (foundAnnotations.length === 0) {
            return this.createWrappedXfdf('add', [], []);
        }
        actionObject = this.updateAnnotationNameIndex(this.cloneObject(foundAnnotations[0]));
        if (actionObject) {
            const pageNumber: number = !isNullOrUndefined(actionObject.pageNumber) ? actionObject.pageNumber :
                actionObject.pageIndex;
            const page: PdfPage = this.pdfViewer.pdfRendererModule.loadedDocument.getPage(pageNumber);
            if (isNullOrUndefined(page)) {
                throw new Error('Page reference not found for export');
            }
            const annotRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewer.viewerBase);
            // Export individual annotation to XFDF
            const xfdfByteArray: Uint8Array = this.exportSpecificAnnotation(actionObject, annotRenderer, page);
            const pureXfdfString: string = new TextDecoder('utf-8').decode(xfdfByteArray);
            if (isNullOrUndefined(action)) {
                return pureXfdfString;
            }
            // Wrap XFDF with action tags
            return this.wrapXfdfWithAction(pureXfdfString, action, actionObject);
        }
        return this.createWrappedXfdf('add', [], []);
    }

    /**
     * Imports an annotation command from the given XFDF data string and applies the
     * corresponding changes (add, modify, or delete) to the PDF Viewer.
     *
     * The input must be a non-empty XFDF string that contains either:
     *  - an `<annots>` element with supported annotation elements (treated as an add/import), or
     *  - a changeset with `<add>`, `<modify>`, and/or `<delete>` action tags.
     *
     * For modify and delete changesets, the method removes the referenced annotations
     * from the viewer before importing the new XFDF content. While applying the remote
     * update, the `isApplyingRemoteUpdate` flag is set to suppress local change events.
     *
     * @private
     * @param {string} data - XFDF data string describing the annotation action to apply
     * @returns {void}
     * @throws {Error} When the input is not a valid string, the XML cannot be parsed,
     * or the XFDF structure is unrecognized.
     */
    public importAnnotationData(data: string): void {
        if (typeof data !== 'string' || data.trim() === '') {
            throw new Error('Unrecognized XFDF structure');
        }
        let xmlDocument: XMLDocument;
        try {
            xmlDocument = this.parseXfdfDocument(data, 'importAnnotationCommand');
        } catch (error) {
            const detail: string = error instanceof Error ? error.message : error.toString();
            // eslint-disable-next-line no-console
            console.error('[PdfViewer][importAnnotationCommand] Invalid XFDF format: ' + detail);
            throw error;
        }
        this.isApplyingRemoteUpdate = true;  // ← SET FLAG
        this.redoCollection = [];
        this.actionCollection = [];
        this.updateToolbar();
        const xfdfElement: Element = xmlDocument.documentElement;
        const annotsElement: Element = this.getDirectChildElement(xfdfElement, 'annots');
        const addElement: Element = this.getDirectChildElement(xfdfElement, 'add');
        const modifyElement: Element = this.getDirectChildElement(xfdfElement, 'modify');
        const deleteElement: Element = this.getDirectChildElement(xfdfElement, 'delete');
        const isChangeset: boolean = !isNullOrUndefined(addElement) || !isNullOrUndefined(modifyElement) ||
        !isNullOrUndefined(deleteElement);
        if (isNullOrUndefined(annotsElement) && !isChangeset) {
            throw new Error('Unrecognized XFDF structure');
        }
        if (!isNullOrUndefined(modifyElement) && modifyElement.children.length > 0) {
            const modifyIds: string[] = this.getAnnotationIdsFromContainer(modifyElement);
            this.isModifyAction = modifyIds.length > 0;
            this.deleteImportedAnnotations(modifyIds);
        } else if (!isNullOrUndefined(deleteElement) && deleteElement.children.length > 0) {
            this.isModifyAction = false;
            this.deleteImportedAnnotations(this.getDeletedAnnotationIds(deleteElement));
        }
        let pureXfdf: string = null;
        if (!isNullOrUndefined(annotsElement) && !isChangeset) {
            if (this.getSupportedAnnotationElements(annotsElement).length > 0) {
                pureXfdf = data;
            }
        } else {
            const annotationElements: Element[] = [];
            if (!isNullOrUndefined(addElement)) {
                annotationElements.push(...this.getSupportedAnnotationElements(addElement));
            }
            if (!isNullOrUndefined(modifyElement)) {
                annotationElements.push(...this.getSupportedAnnotationElements(modifyElement));
            }
            if (annotationElements.length > 0) {
                pureXfdf = this.createPureXfdf(annotationElements.map((element: Element) => this.serializeXmlNode(element)));
            }
        }
        if (!isNullOrUndefined(pureXfdf)) {
            this.pdfViewer.importAnnotation(pureXfdf, AnnotationDataFormat.Xfdf);
        }
        this.isApplyingRemoteUpdate = false;  // ← SET FLAG
    }

    private buildDeleteActionXfdf(annotation: PdfAnnotationBaseModel): string {
        const annotationId: string = this.getActionAnnotationId(annotation);
        const pageNumber: number = this.getActionAnnotationPage(annotation);
        if (isNullOrUndefined(annotationId)) {
            throw new Error('Unsupported annotation type for export: ' + annotation.shapeAnnotationType);
        }
        // Use DOM API to create delete element instead of hardcoding XML
        const xmlDoc: XMLDocument = this.createBlankXfdfDocument();
        const idElement: Element = xmlDoc.createElement('id');
        idElement.setAttribute('page', pageNumber.toString());
        idElement.textContent = annotationId;
        const deleteElementStr: string = this.serializeXmlNode(idElement);
        return this.createWrappedXfdf('delete', [], [deleteElementStr]);
    }

    private getActionAnnotationId(annotation: PdfAnnotationBaseModel): string {
        const annotationObject: any = annotation;
        return annotationObject.annotationId || annotationObject.annotName || annotationObject.id;
    }

    private getActionAnnotationPage(annotation: PdfAnnotationBaseModel): number {
        const annotationObject: any = annotation;
        if (!isNullOrUndefined(annotationObject.pageNumber)) {
            return annotationObject.pageNumber;
        }
        if (!isNullOrUndefined(annotationObject.pageIndex)) {
            return annotationObject.pageIndex;
        }
        return 0;
    }

    private createWrappedXfdf(action: 'add' | 'modify' | 'delete', actionElements: string[], deleteElements: string[]): string {
        // Use DOM API instead of hardcoded XML strings
        const xmlDoc: XMLDocument = this.createBlankXfdfDocument();
        const rootElement: Element = xmlDoc.documentElement;
        const fieldsElement: Element = xmlDoc.createElementNS(this.xfdfNamespace, 'fields');
        rootElement.appendChild(fieldsElement);
        const addElement: Element = xmlDoc.createElementNS(this.xfdfNamespace, 'add');
        const modifyElement: Element = xmlDoc.createElementNS(this.xfdfNamespace, 'modify');
        const deleteElement: Element = xmlDoc.createElementNS(this.xfdfNamespace, 'delete');
        if (action === 'add' && actionElements.length > 0) {
            this.appendElementsToParent(xmlDoc, addElement, actionElements);
        }
        if (action === 'modify' && actionElements.length > 0) {
            this.appendElementsToParent(xmlDoc, modifyElement, actionElements);
        }
        if (action === 'delete' && deleteElements.length > 0) {
            this.appendElementsToParent(xmlDoc, deleteElement, deleteElements);
        }
        rootElement.appendChild(addElement);
        rootElement.appendChild(modifyElement);
        rootElement.appendChild(deleteElement);
        return new XMLSerializer().serializeToString(xmlDoc);
    }

    private appendElementsToParent(xmlDoc: XMLDocument, parentElement: Element, elementStrings: string[]): void {
        for (const elementStr of elementStrings) {
            try {
                // Use proper DOM API to parse XML fragments safely
                const parser: DOMParser = new DOMParser();
                // Parse the element string directly - it should be a valid XML element
                const tempDoc: XMLDocument = parser.parseFromString(elementStr, 'text/xml');
                // Check for parse errors
                if (tempDoc.documentElement && tempDoc.documentElement.nodeName !== 'parsererror') {
                    const element: Element = tempDoc.documentElement;
                    const importedNode: Node = xmlDoc.importNode(element, true);
                    parentElement.appendChild(importedNode);
                }
            } catch (error) {
                // Skip invalid elements
            }
        }
    }

    private createBlankXfdfDocument(): XMLDocument {
        // Create a proper XML document with XFDF namespace
        const xmlDoc: XMLDocument = document.implementation.createDocument(this.xfdfNamespace, 'xfdf', null);
        const rootElement: Element = xmlDoc.documentElement;
        rootElement.setAttribute('xml:space', 'preserve');
        return xmlDoc;
    }

    private exportSpecificAnnotation(annotation: any, annotRenderer: AnnotationRenderer, page: PdfPage): Uint8Array {
        const clonedAnnotation: PdfAnnotationBaseModel = this.cloneObject(annotation);
        let annotationType: string = annotation.shapeAnnotationType;
        if (Object.prototype.hasOwnProperty.call(annotation, 'calibrate') && (annotation['shapeAnnotationType'] === 'Circle' || annotation['shapeAnnotationType'] === 'Line' || annotation['shapeAnnotationType'] === 'Polygon' || annotation['shapeAnnotationType'] === 'Polyline')) {
            annotationType = 'measureShapes';
        }
        else if (!(Object.prototype.hasOwnProperty.call(annotation, 'calibrate')) && (annotation['shapeAnnotationType'] === 'Line' || annotation['shapeAnnotationType'] === 'Circle' || annotation['shapeAnnotationType'] === 'Polygon' || annotation['shapeAnnotationType'] === 'Square' || annotation['shapeAnnotationType'] === 'Polyline')) {
            annotationType = 'shapeAnnotation';
        }
        this.updateModifiedDate(clonedAnnotation);
        if (annotationType === 'textMarkup') {
            return this.exportTextMarkupAnnotation(clonedAnnotation, annotRenderer);
        } else if (annotationType === 'shapeAnnotation') {
            return this.exportShapeAnnotation(clonedAnnotation, annotRenderer, page);
        } else if (annotationType === 'measureShapes') {
            return this.exportMeasureAnnotation(clonedAnnotation, annotRenderer, page);
        } else if (annotationType === 'stamp') {
            return this.exportStampAnnotation(clonedAnnotation, annotRenderer, page);
        } else if (annotationType === 'FreeText') {
            return this.exportFreeTextAnnotation(clonedAnnotation, annotRenderer, page);
        } else if (annotationType === 'Ink') {
            return this.exportInkAnnotation(clonedAnnotation, annotRenderer, page);
        } else if (annotationType === 'Redaction') {
            return this.exportRedactAnnotation(clonedAnnotation, annotRenderer, page);
        } else if (annotationType === 'sticky') {
            return this.exportStickyAnnotation(clonedAnnotation, annotRenderer, page);
        }
        return new Uint8Array(0);
    }

    private exportTextMarkupAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer): Uint8Array {
        if (!isNullOrUndefined(this.textMarkupAnnotationModule)) {
            this.textMarkupAnnotationModule.stringifyTextMarkUpAnnotation(annotation);
            const textMarkupAnnot: PdfTextMarkupAnnotation =
            annotationRenderer.addTextMarkup(annotation, this.pdfViewer.pdfRendererModule.loadedDocument, true);
            const specificAnnotData: Uint8Array = textMarkupAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private exportShapeAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer, page: PdfPage): Uint8Array {
        if (!isNullOrUndefined(this.shapeAnnotationModule)) {
            this.shapeAnnotationModule.stringifyShapeAnnotation(annotation);
            const shapeAnnot: any = annotationRenderer.addShape(annotation, page, true);
            const specificAnnotData: Uint8Array = shapeAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private exportMeasureAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer, page: PdfPage): Uint8Array {
        if (!isNullOrUndefined(this.measureAnnotationModule)) {
            this.measureAnnotationModule.stringifyMeasureAnnotation(annotation);
            const measureAnnot: any = annotationRenderer.addMeasure(annotation, page, true);
            const specificAnnotData: Uint8Array = measureAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private exportStampAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer, page: PdfPage): Uint8Array {
        if (!isNullOrUndefined(this.stampAnnotationModule)) {
            this.stampAnnotationModule.stringifyStampAnnotation(annotation);
            const stampAnnot: PdfRubberStampAnnotation = annotationRenderer.addCustomStampAnnotation(annotation, page, true);
            const specificAnnotData: Uint8Array = stampAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private exportFreeTextAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer,
                                     page: PdfPage): Uint8Array {
        if (!isNullOrUndefined(this.freeTextAnnotationModule)) {
            this.freeTextAnnotationModule.stringifyFreeTextAnnotation(annotation);
            let freeTextAnnot: PdfFreeTextAnnotation;
            const defaultFonts: string[] = ['Helvetica', 'Times New Roman', 'Courier', 'Symbol', 'ZapfDingbats'];
            if (!isNullOrUndefined(this.pdfViewer.pdfRendererModule.FallbackFontCollection) &&
                Object.keys(this.pdfViewer.pdfRendererModule.FallbackFontCollection).length !== 0 &&
                defaultFonts.indexOf(annotation.fontFamily) === -1) {
                freeTextAnnot = annotationRenderer.addFreeText(annotation, page, this.pdfViewer.pdfRendererModule.FallbackFontCollection,
                                                               true);
            }
            else {
                freeTextAnnot = annotationRenderer.addFreeText(annotation, page, undefined, true);
            }
            const specificAnnotData: Uint8Array = freeTextAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private exportInkAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer, page: PdfPage): Uint8Array {
        if (!isNullOrUndefined(this.inkAnnotationModule)) {
            this.inkAnnotationModule.stringifyInkAnnotation(annotation);
            const inkAnnot: PdfInkAnnotation = annotationRenderer.saveInkSignature(annotation, page, true);
            const specificAnnotData: Uint8Array = inkAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private exportRedactAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer, page: PdfPage): Uint8Array {
        if (!isNullOrUndefined(this.redactionAnnotationModule)) {
            this.redactionAnnotationModule.stringifyRedactionAnnotation(annotation);
            const redactAnnot: any = annotationRenderer.addRedact(annotation, page, this.pdfViewerBase.canRedact, true);
            const specificAnnotData: Uint8Array = redactAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private exportStickyAnnotation(annotation: PdfAnnotationBaseModel, annotationRenderer: AnnotationRenderer, page: PdfPage): Uint8Array {
        if (!isNullOrUndefined(this.stickyNotesAnnotationModule)) {
            this.stickyNotesAnnotationModule.stringifyStickyNotesAnnotation(annotation);
            const stickyAnnot: any = annotationRenderer.addStickyNotes(annotation, page, true);
            const specificAnnotData: Uint8Array = stickyAnnot._export(DataFormat.xfdf);
            this.removeAnnotationsInLoadedDocument(annotation);
            return specificAnnotData;
        }
        return new Uint8Array(0);
    }

    private removeAnnotationsInLoadedDocument(annotation: any): void {
        const loadedDocument: PdfDocument = this.pdfViewer.pdfRendererModule.loadedDocument;
        if (loadedDocument) {
            const page: PdfPage = loadedDocument.getPage(annotation.pageIndex);
            if (page && page.annotations && page.annotations.count > 0) {
                // Iterate in reverse to safely remove items
                for (let j: number = page.annotations.count - 1; j >= 0; j--) {
                    const annotationObject: any = page.annotations.at(j);
                    if (annotationObject && annotationObject.name === annotation.annotName) {
                        page.annotations.removeAt(j);
                        break; // Remove only the matching annotation
                    }
                }
            }
        }
    }

    private wrapXfdfWithAction(pureXfdf: string, action: EditAction, annotation: any): string {
        try {
            const sourceDoc: XMLDocument = this.parseXfdfDocument(pureXfdf, 'wrapXfdfWithAction');
            const annotsElement: Element = this.getDirectChildElement(sourceDoc.documentElement, 'annots');
            if (isNullOrUndefined(annotsElement)) {
                // No annots element found, return wrapped structure
                return this.createWrappedXfdf('add', [], []);
            }
            // Create target XFDF document using DOM API
            const targetDoc: XMLDocument = this.createBlankXfdfDocument();
            const targetRoot: Element = targetDoc.documentElement;
            const fieldsElement: Element = targetDoc.createElementNS(this.xfdfNamespace, 'fields');
            targetRoot.appendChild(fieldsElement);
            const addElement: Element = targetDoc.createElementNS(this.xfdfNamespace, 'add');
            const modifyElement: Element = targetDoc.createElementNS(this.xfdfNamespace, 'modify');
            const deleteElement: Element = targetDoc.createElementNS(this.xfdfNamespace, 'delete');
            // Copy annotation elements to appropriate action tag
            const annotationElements: Element[] = Array.from(annotsElement.children);
            for (const elem of annotationElements) {
                const importedNode: Node = targetDoc.importNode(elem, true);
                if (action === EditAction.Add) {
                    addElement.appendChild(importedNode);
                } else if (action === EditAction.Modify) {
                    modifyElement.appendChild(importedNode);
                } else if (action === EditAction.Delete) {
                    deleteElement.appendChild(importedNode);
                }
            }
            targetRoot.appendChild(addElement);
            targetRoot.appendChild(modifyElement);
            targetRoot.appendChild(deleteElement);
            return new XMLSerializer().serializeToString(targetDoc);
        } catch (error) {
            // Fallback: use createWrappedXfdf
            const annotId: string = this.getActionAnnotationId(annotation);
            return annotId;
        }
    }

    private parseXfdfDocument(data: string, commandName: string): XMLDocument {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(data, 'application/xml');
        const parseErrors: HTMLCollectionOf<Element> = xmlDocument.getElementsByTagName('parsererror');
        if (parseErrors && parseErrors.length > 0) {
            const parseError: Element = parseErrors[0];
            throw new Error(commandName + ': ' + (parseError.textContent || 'Malformed XML'));
        }
        return xmlDocument;
    }

    private getDirectChildElement(parent: Element, elementName: string): Element {
        if (isNullOrUndefined(parent)) {
            return null;
        }
        for (let i: number = 0; i < parent.childNodes.length; i++) {
            const childNode: Node = parent.childNodes[parseInt(i.toString(), 10)];
            if (childNode.nodeType === 1 && this.getNodeName(childNode as Element) === elementName) {
                return childNode as Element;
            }
        }
        return null;
    }

    private getNodeName(element: Element): string {
        const localName: string = element.localName ? element.localName : element.nodeName;
        return localName.toLowerCase();
    }

    private serializeXmlNode(node: Node): string {
        return new XMLSerializer().serializeToString(node);
    }

    private indentMultilineString(value: string, indentSize: number): string {
        const padding: string = new Array(indentSize + 1).join(' ');
        return value.split('\n').map((line: string) => padding + line).join('\n');
    }

    private deleteImportedAnnotations(annotationIds: string[]): void {
        const processedIds: Set<string> = new Set<string>();
        for (let i: number = 0; i < annotationIds.length; i++) {
            const annotationId: string = annotationIds[parseInt(i.toString(), 10)];
            if (!processedIds.has(annotationId)) {
                processedIds.add(annotationId);
                this.deleteAnnotationById(annotationId);
            }
        }
        processedIds.clear();
    }

    private getAnnotationIdsFromContainer(container: Element): string[] {
        const annotationIds: string[] = [];
        const elements: Element[] = this.getSupportedAnnotationElements(container);
        for (let i: number = 0; i < elements.length; i++) {
            const annotationId: string = this.getElementAttribute(elements[parseInt(i.toString(), 10)], ['name']);
            if (!isNullOrUndefined(annotationId)) {
                annotationIds.push(annotationId);
            }
        }
        return annotationIds;
    }

    private getSupportedAnnotationElements(container: Element): Element[] {
        const elements: Element[] = [];
        for (let i: number = 0; i < container.childNodes.length; i++) {
            const childNode: Node = container.childNodes[parseInt(i.toString(), 10)];
            if (childNode.nodeType !== 1) {
                continue;
            }
            const element: Element = childNode as Element;
            if (this.isSupportedAnnotationElement(element)) {
                elements.push(element);
            } else {
                // eslint-disable-next-line no-console
                console.warn('Skipping unsupported annotation type: ' + this.getNodeName(element));
            }
        }
        return elements;
    }

    private getElementAttribute(element: Element, attributeNames: string[]): string {
        for (let i: number = 0; i < attributeNames.length; i++) {
            const attributeName: string = attributeNames[parseInt(i.toString(), 10)];
            const attributeValue: string = element.getAttribute(attributeName);
            if (!isNullOrUndefined(attributeValue)) {
                return attributeValue;
            }
        }
        return null;
    }

    private isSupportedAnnotationElement(element: Element): boolean {
        const supportedAnnotationTypes: string[] = ['highlight', 'underline', 'strikeout', 'squiggly', 'square', 'circle', 'line',
            'polygon', 'polyline', 'freetext', 'ink', 'stamp', 'text', 'redact'];
        return supportedAnnotationTypes.indexOf(this.getNodeName(element)) !== -1;
    }

    private getDeletedAnnotationIds(container: Element): string[] {
        const annotationIds: string[] = [];
        for (let i: number = 0; i < container.childNodes.length; i++) {
            const childNode: Node = container.childNodes[parseInt(i.toString(), 10)];
            if (childNode.nodeType === 1 && this.getNodeName(childNode as Element) === 'id') {
                const value: string = (childNode.textContent || '').trim();
                if (value !== '') {
                    annotationIds.push(value);
                }
            }
        }
        return annotationIds;
    }

    private createPureXfdf(annotationElements: string[]): string {
        // Use DOM API instead of hardcoded XML strings
        const xmlDoc: XMLDocument = this.createBlankXfdfDocument();
        const rootElement: Element = xmlDoc.documentElement;
        const annotsElement: Element = xmlDoc.createElementNS(this.xfdfNamespace, 'annots');
        // Parse and append annotation elements safely using proper DOM Parser
        for (const elementStr of annotationElements) {
            try {
                const parser: DOMParser = new DOMParser();
                const tempDoc: XMLDocument = parser.parseFromString(elementStr, 'text/xml');
                // Check for parse errors
                if (tempDoc.documentElement && tempDoc.documentElement.nodeName !== 'parsererror') {
                    const element: Element = tempDoc.documentElement;
                    const importedNode: Node = xmlDoc.importNode(element, true);
                    annotsElement.appendChild(importedNode);
                }
            } catch (error) {
                // Skip invalid elements
            }
        }
        rootElement.appendChild(annotsElement);
        return new XMLSerializer().serializeToString(xmlDoc);
    }

    /**
     * @param {any} obj - obj
     * @private
     * @returns {Object} - Object
     */
    public cloneObject(obj: Object): Object {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        if (pageDiv) {
            pageDiv.removeEventListener('mousedown', this.pdfViewer.annotationModule.stickyNotesAnnotationModule.drawIcons.bind(this));
        }
        const closeBtn: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_popup_close');
        if (closeBtn) {
            closeBtn.removeEventListener('click', this.saveClosePopupMenu.bind(this));
            closeBtn.removeEventListener('touchend', this.saveClosePopupMenu.bind(this));
        }
        if (this.popupElement) {
            this.popupElement.removeEventListener('mousedown', this.onPopupElementMoveStart.bind(this));
            this.popupElement.removeEventListener('mousemove', this.onPopupElementMove.bind(this));
            this.popupElement.removeEventListener('touchstart', this.onPopupElementMoveStart.bind(this));
            this.popupElement.removeEventListener('touchmove', this.onPopupElementMove.bind(this));
        }
        if (this.noteContentElement) {
            this.noteContentElement.removeEventListener('mousedown', () => {
                this.noteContentElement.focus();
            });
        }
        window.removeEventListener('mouseup', this.onPopupElementMoveEnd.bind(this));
        window.removeEventListener('touchend', this.onPopupElementMoveEnd.bind(this));
        this.destroyPropertiesWindow();
        if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.commentFilterDialog) {
            this.pdfViewerBase.navigationPane.commentFilterDialog.destroy();
            this.pdfViewerBase.navigationPane.commentFilterDialog = null;
        }
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.clear();
        }
        this.textMarkupAnnotationModule = null;
        this.redactionAnnotationModule = null;
        this.shapeAnnotationModule = null;
        this.measureAnnotationModule = null;
        this.stampAnnotationModule = null;
        this.freeTextAnnotationModule = null;
        this.inputElementModule = null;
        this.inkAnnotationModule = null;
        this.stickyNotesAnnotationModule = null;
        this.popupNote = null;
        this.popupNoteAuthor = null;
        this.popupNoteContent = null;
        this.popupElement = null;
        this.authorPopupElement = null;
        this.noteContentElement = null;
        this.modifiedDateElement = null;
        this.opacityIndicator = null;
        this.startArrowDropDown = null;
        this.endArrowDropDown = null;
        this.lineStyleDropDown = null;
        this.thicknessBox = null;
        this.leaderLengthBox = null;
        this.fillColorPicker = null;
        this.strokeColorPicker = null;
        this.fillDropDown = null;
        this.strokeDropDown = null;
        this.opacitySlider = null;
        this.propertiesDialog = null;
        this.currentAnnotPageNumber = null;
        this.clientX = null;
        this.clientY = null;
        this.isPopupMenuMoved = null;
        this.selectedLineStyle = null;
        this.selectedLineDashArray = null;
        this.isUndoRedoAction = null;
        this.isFreeTextFontsizeChanged = null;
        this.isUndoAction = null;
        this.annotationSelected = null;
        this.isAnnotDeletionApiCall = null;
        this.removedDocumentAnnotationCollection = null;
        this.nonRenderSelectedAnnotation = null;
        this.isShapeCopied = null;
        this.actionCollection = null;
        this.redoCollection = null;
        this.isPopupNoteVisible = null;
        this.undoCommentsElement = null;
        this.redoCommentsElement = null;
        this.selectAnnotationId = null;
        this.isAnnotationSelected = null;
        this.annotationPageIndex = null;
        this.previousIndex = null;
        this.annotationType = null;
        this.overlappedAnnotations = null;
        this.overlappedCollections = null;
        this.isFormFieldShape = null;
        this.removedAnnotationCollection = null;
        this.isEdited = null;
        this.lastActionCollection = null;
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'Annotation';
    }

    /**
     * Get vertex points properties
     *
     * @param {IPoint[]} points - points
     * @private
     * @returns {IPointBase[]} - IPointBase[]
     */
    public getVertexPointsXY(points: IPoint[]): IPointBase[] {
        const vertexPoints: IPointBase[] = [];
        //Converting points model into vertex property
        for (let j: number = 0; j < points.length; j++) {
            vertexPoints[parseInt(j.toString(), 10)] = { X: points[parseInt(j.toString(), 10)].x, Y: points[parseInt(j.toString(), 10)].y };
        }
        return vertexPoints;
    }

    /**
     * Adds redaction annotations that cover the entire content of the specified pages in the PDF document.
     * This redaction customization feature shall be available only when the PDF Viewer is operating in Standalone Mode.
     *
     * @param {number[]} pages - pages
     * @returns {void}
     */
    public addPageRedactions(pages: number[]): void {
        if (pages.length > 0 && this.pdfViewerBase.clientSideRendering) {
            let updatedPageCollection: any = [];
            for (let i: number = 0; i < pages.length; i++) {
                updatedPageCollection.push(pages[i as number] - 1);
            }
            this.pdfViewerBase.redactPages(updatedPageCollection);
            updatedPageCollection = [];
        }
    }

    /**
     * Applies redaction to all Redaction annotations in the PDF document.
     * This redaction customization feature shall be available only when the PDF Viewer is operating in Standalone Mode.
     *
     * @returns {void}
     */
    public redact(): void {
        if (this.pdfViewerBase.clientSideRendering) {
            this.handleRedact();
        }
    }

    /**
     * @private
     * @param {any} args - args
     * @returns {void}
     */
    public handleRedact(args?: any): void {
        let pdfBlob: Blob;
        this.pdfViewerBase.isDocumentModified = true;
        this.pdfViewerBase.canRedact = true;
        this.pdfViewer.saveAsBlob().then((blob: Blob) => {
            pdfBlob = blob;
            this.pdfViewerBase.blobToBase64(pdfBlob).then((base64: string) => {
                if (!isNullOrUndefined(base64) && base64 !== '') {
                    const fileName: string = this.pdfViewer.fileName;
                    const downloadFileName: string = this.pdfViewer.downloadFileName;
                    const jsonDocumentId: string = this.pdfViewerBase.jsonDocumentId;
                    this.pdfViewer.loadDocInternally(base64, null, false);
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                    this.pdfViewer.fileName = fileName;
                    if (!isNullOrUndefined(downloadFileName)) {
                        this.pdfViewer.downloadFileName = downloadFileName;
                    }
                    else {
                        this.pdfViewer.downloadFileName = fileName;
                    }
                    this.pdfViewerBase.jsonDocumentId = jsonDocumentId;
                }
                this.pdfViewerBase.canRedact = false;
            });
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule) {
                this.pdfViewer.toolbarModule.redactionToolbarModule.showHideRedactIcon(false);
                this.pdfViewer.toolbarModule.redactionToolbarModule.showHideDeleteIcon(false);
            }
        });
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule &&
            this.pdfViewer.toolbarModule.redactionToolbarModule.redactDialogObj) {
            this.pdfViewer.toolbarModule.redactionToolbarModule.redactDialogObj.hide();
        }
        if (!this.isRedactPrevent) {
            this.pdfViewer.annotation.fireAnnotationChangedEvent(null, EditAction.Delete, true);
        }
    }

    /**
     * Method used to add annotations using program.
     *
     * @param {AnnotationType} annotationType - It describes type of annotation object.
     * @param {FreeTextSettings} options -  It describes about the annotation objects and it's property.
     * @param {DynamicStampItem} dynamicStampItem - It describe which type of dynamic stamp.
     * @param {SignStampItem} signStampItem - It describe which type of sign stamp.
     * @param {StandardBusinessStampItem} standardBusinessStampItem - It describe which type of standard business stamp.
     * @returns {void}
     */
    public addAnnotation(annotationType: AnnotationType, options?: FreeTextSettings | StickyNotesSettings |
    HighlightSettings | UnderlineSettings | SquigglySettings | LineSettings | StrikethroughSettings | RectangleSettings |
    CircleSettings | ArrowSettings | PolygonSettings | DistanceSettings | PerimeterSettings | AreaSettings | RedactionSettings |
    RadiusSettings | VolumeSettings | InkAnnotationSettings| HandWrittenSignatureSettings | StampSettings |
    CustomStampSettings |WebLinkSettings| DocumentLinkSettings | CloudSettings | CalloutSettings,
                         dynamicStampItem?: DynamicStampItem, signStampItem?: SignStampItem,
                         standardBusinessStampItem?: StandardBusinessStampItem): void {
        if (this.pdfViewer.readOnlySettings.annotations) {
            return;
        }
        initializeTelemetryFeature('Annotation Add/Edit', 'PDFViewer');
        //Initialize the bounds and pageNumber
        const offset: IPoint = { x: 1, y: 1 };
        let pageNumber: number = 0;
        if (options) {
            if (options.pageNumber && options.pageNumber > 0)
            {pageNumber = options.pageNumber ? options.pageNumber - 1 : 0; }
        }
        //Initialize the pdf annotation object array
        let annotationObject: any = null;
        const pdfAnnotation: any = [];
        this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
        //Seperate the annotation type with it's method
        if (annotationType === 'FreeText') {
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
             this.pdfViewer.annotation.freeTextAnnotationModule.updateAddAnnotationDetails(options as FreeTextSettings, offset);
            this.pdfViewer.annotation.freeTextAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Callout') {
            // Callout is stored as FreeText internally (PDF 32000-1:2008 § 12.5.6.6) but carries
            // extra `calloutLines` + `lineEndingStyle` metadata consumed downstream.
            const calloutSettings: CalloutSettings = (options as CalloutSettings) || {} as CalloutSettings;
            this.pdfViewer.annotation.freeTextAnnotationModule.isAddAnnotationProgramatically = !this.isAddedFromUI;
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
                this.pdfViewer.annotation.freeTextAnnotationModule.updateAddAnnotationDetails(
                    calloutSettings, offset);
        }
        else if (annotationType === 'StickyNotes') {
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
             this.pdfViewer.annotation.stickyNotesAnnotationModule.updateAddAnnotationDetails(options as StickyNotesSettings, offset);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Highlight' || annotationType === 'Underline' || annotationType === 'Strikethrough' || annotationType === 'Squiggly') {
            if (annotationType === 'Highlight')
            {annotationObject = options as HighlightSettings; }
            else if (annotationType === 'Underline')
            {annotationObject = options as UnderlineSettings; }
            else if (annotationType === 'Strikethrough')
            {annotationObject = options as StrikethroughSettings; }
            else if (annotationType === 'Squiggly')
            {annotationObject = options as SquigglySettings; }
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
             this.pdfViewer.annotation.textMarkupAnnotationModule.updateAddAnnotationDetails(annotationType, annotationObject);
            this.pdfViewer.annotation.textMarkupAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Line' || annotationType === 'Arrow' || annotationType === 'Rectangle' || annotationType === 'Circle' || annotationType === 'Polygon' || annotationType === 'Cloud') {
            if (annotationType === 'Line')
            {annotationObject = options as LineSettings; }
            else if (annotationType === 'Arrow')
            {annotationObject = options as ArrowSettings; }
            else if (annotationType === 'Rectangle')
            {annotationObject = options as RectangleSettings; }
            else if (annotationType === 'Circle')
            {annotationObject = options as CircleSettings; }
            else if (annotationType === 'Polygon')
            {annotationObject = options as PolygonSettings; }
            else if (annotationType === 'Cloud')
            {annotationObject = options as CloudSettings; }
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
             this.pdfViewer.annotation.shapeAnnotationModule.updateAddAnnotationDetails(annotationType, annotationObject, offset);
            this.pdfViewerBase.updateFreeTextProperties(pdfAnnotation[parseInt(pageNumber.toString(), 10)]);
            this.pdfViewer.annotation.shapeAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Distance' || annotationType === 'Perimeter' || annotationType === 'Area' || annotationType === 'Radius' || annotationType === 'Volume') {
            if (annotationType === 'Distance')
            {annotationObject = options as DistanceSettings; }
            else if (annotationType === 'Perimeter')
            {annotationObject = options as PerimeterSettings; }
            else if (annotationType === 'Area')
            {annotationObject = options as AreaSettings; }
            else if (annotationType === 'Radius')
            {annotationObject = options as RadiusSettings; }
            else if (annotationType === 'Volume')
            {annotationObject = options as VolumeSettings; }
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
             this.pdfViewer.annotation.measureAnnotationModule.updateAddAnnotationDetails(annotationType, annotationObject, offset);
            this.pdfViewer.annotation.measureAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Stamp') {
            if ((options as CustomStampSettings) && (options as CustomStampSettings).customStamps) {
                pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
                 this.pdfViewer.annotation.stampAnnotationModule.updateAddAnnotationDetails(options as CustomStampSettings, offset,
                                                                                            pageNumber, dynamicStampItem,
                                                                                            signStampItem, standardBusinessStampItem);
            }
            else if ((options as CustomStampSettings) && (options as CustomStampSettings).customTextStamps) {
                pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
                 this.pdfViewer.annotation.stampAnnotationModule.updateAddAnnotationDetails(options as CustomStampSettings, offset,
                                                                                            pageNumber, dynamicStampItem,
                                                                                            signStampItem, standardBusinessStampItem);
            }
            else {
                pdfAnnotation[parseInt(pageNumber.toString(), 10)] = this.pdfViewer.annotation.
                    stampAnnotationModule.updateAddAnnotationDetails(options as StampSettings, offset, pageNumber, dynamicStampItem,
                                                                     signStampItem, standardBusinessStampItem);
            }
            this.pdfViewer.annotation.stampAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Ink') {
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] = this.pdfViewer.annotation.inkAnnotationModule.
                updateAddAnnotationDetails(options as InkAnnotationSettings, offset, pageNumber);
            this.pdfViewer.annotation.inkAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Redaction') {
            if (this.pdfViewerBase.clientSideRendering) {
                pdfAnnotation[pageNumber as number] = this.pdfViewer.annotation.redactionAnnotationModule.updateAddAnnotationDetails(
                    options as RedactionSettingsModel, offset);
                this.pdfViewer.annotation.redactionAnnotationModule.isAddAnnotationProgramatically = true;
            }
        }
        else if (annotationType === 'Link' && this.pdfViewer.annotation.PdfLinkAnnotationModule) {
            const isDocumentLink: boolean = !isNullOrUndefined((options as DocumentLinkSettings).destinationPageIndex) ||
                !isNullOrUndefined((options as DocumentLinkSettings).destinationLocation) ||
                !isNullOrUndefined((options as DocumentLinkSettings).zoomValue);
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] =
                this.pdfViewer.annotation.PdfLinkAnnotationModule.updateAddAnnotationDetails(
                    isDocumentLink ? (options as DocumentLinkSettings) : (options as WebLinkSettings), offset);
            this.pdfViewer.annotation.PdfLinkAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'HandWrittenSignature' || annotationType === 'Initial') {
            pdfAnnotation[parseInt(pageNumber.toString(), 10)] = this.pdfViewerBase.signatureModule.
                updateSignatureDetails(options as HandWrittenSignatureSettings, offset, pageNumber);
            this.pdfViewerBase.signatureModule.isAddAnnotationProgramatically = true;
        }

        //Annotation rendering can be done with the import annotation method.
        const pdf: object = { pdfAnnotation };
        this.pdfViewerBase.isAddAnnotation = true;

        // Register newly added annotations to bypass filter while active
        if (this.currentFilterState && !isFilterEmpty(this.currentFilterState)) {
            for (const pageKey in pdfAnnotation) {
                if (pdfAnnotation[pageKey as any]) {
                    const annotations: any = pdfAnnotation[pageKey as any];
                    if (Array.isArray(annotations)) {
                        for (const annot of annotations) {
                            if (annot.annotName) {
                                this.newlyAddedAnnotations.add(annot.annotName);
                            }
                        }
                    } else if (annotations.annotName) {
                        this.newlyAddedAnnotations.add(annotations.annotName);
                    }
                }
            }

        }

        this.pdfViewerBase.importAnnotations(pdf);
        this.pdfViewerBase.isAddAnnotation = false;
    }

    /**
     * @param {PdfAnnotationBaseModel} annotation - annotation
     * @private
     * @returns {void}
     */
    public triggerAnnotationAddEvent(annotation: PdfAnnotationBaseModel): void {
        const annotationType: PdfAnnotationType = annotation.shapeAnnotationType;
        if (annotationType === 'Stamp' || annotationType === 'Image' || annotationType === 'Path' || annotationType === 'FreeText' || annotationType === 'StickyNotes' || annotationType === 'Ink') {
            let settings: any;
            if (annotationType === 'FreeText') {
                settings = {
                    opacity: annotation.opacity, borderColor: annotation.strokeColor, borderWidth: annotation.thickness,
                    author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                    fillColor: annotation.fillColor, fontSize: annotation.fontSize, width: annotation.bounds.width,
                    height: annotation.bounds.height, fontColor: annotation.fontColor, fontFamily: annotation.fontFamily,
                    defaultText: annotation.dynamicText, fontStyle: annotation.font, textAlignment: annotation.textAlign
                };
            } else {
                settings = {
                    opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor,
                    thickness: annotation.thickness, author: annotation.author, subject: annotation.subject,
                    modifiedDate: annotation.modifiedDate, data: annotation.data
                };
            }
            const bounds: IRectangle = { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width,
                height: annotation.bounds.height };
            const type: AnnotationType = this.getAnnotationType(annotation.shapeAnnotationType, annotation.measureType);
            this.pdfViewer.fireAnnotationAdd(annotation.pageIndex, annotation.annotName, type, bounds, settings);
        } else if (annotationType === 'SignatureText' || annotationType === 'SignatureImage' || annotationType === 'HandWrittenSignature') {
            const bounds: IRectangle = { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width,
                height: annotation.bounds.height };
            this.pdfViewer.fireSignatureAdd(annotation.pageIndex, annotation.signatureName,
                                            annotation.shapeAnnotationType as AnnotationType, bounds, annotation.opacity,
                                            annotation.strokeColor, annotation.thickness, annotation.data);
        } else {
            const setting: any = {
                opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor,
                thickness: annotation.thickness, author: annotation.author, subject: annotation.subject,
                modifiedDate: annotation.modifiedDate
            };
            const bounds: IRectangle = { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width,
                height: annotation.bounds.height };
            const type: AnnotationType = this.getAnnotationType(annotation.shapeAnnotationType, annotation.measureType);
            if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
                setting.lineHeadStartStyle = this.getArrowString(annotation.sourceDecoraterShapes);
                setting.lineHeadEndStyle = this.getArrowString(annotation.taregetDecoraterShapes);
                setting.borderDashArray = annotation.borderDashArray;
            }
            let labelSettings: ShapeLabelSettingsModel;
            if (this.pdfViewer.enableShapeLabel) {
                labelSettings = {
                    fontColor: annotation.fontColor, fontSize: annotation.fontSize, fontFamily: annotation.fontFamily,
                    opacity: annotation.labelOpacity, labelContent: annotation.labelContent, fillColor: annotation.labelFillColor
                };
                this.pdfViewer.fireAnnotationAdd(annotation.pageIndex, annotation.annotName, type, bounds, setting,
                                                 null, null, null, labelSettings);
            } else {
                this.pdfViewer.fireAnnotationAdd(annotation.pageIndex, annotation.annotName, type, bounds, setting);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public triggerAnnotationUnselectEvent(): void {
        if (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations[0]) {
            const annotation : PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
            if (annotation.shapeAnnotationType !== 'HandWrittenSignature' && annotation.shapeAnnotationType !== 'SignatureText' && annotation.shapeAnnotationType !== 'SignatureImage' && annotation.shapeAnnotationType !== 'Path'){
                this.pdfViewer.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                this.pdfViewer.clearSelection(annotation.pageIndex);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public triggerSignatureUnselectEvent(): void {
        if (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations[0]) {
            const selectorModel : SelectorModel = this.pdfViewer.selectedItems;
            if (selectorModel.annotations.length) {
                for (let j : number = 0; j < selectorModel.annotations.length; j++) {
                    const node : PdfAnnotationBaseModel = selectorModel.annotations[parseInt(j.toString(), 10)];
                    this.pdfViewer.annotationModule.unselectSignature(node.signatureName, node.pageIndex, node);
                    this.pdfViewer.clearSelection(node.pageIndex);
                }
            }
        }
    }

    /**
     * @param {PdfAnnotationBaseModel} currentAnnotation - currentAnnotation
     * @param {any} currentValue - currentValue
     * @private
     * @returns {void}
     */
    public updateFontFamilyRenderSize(currentAnnotation: PdfAnnotationBaseModel, currentValue: string ) : void{
        const freeTextAnnotation: FreeTextAnnotation = this.freeTextAnnotationModule;
        freeTextAnnotation.inputBoxElement.style.fontFamily = currentValue;
        freeTextAnnotation.autoFitFreeText();
        const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
        const padding: number = parseFloat(freeTextAnnotation.inputBoxElement.style.paddingLeft);
        let inputEleHeight: number = currentAnnotation.bounds.height * zoomFactor;
        const characterLength : number = 8;
        let inputEleWidth: number = parseFloat(freeTextAnnotation.inputBoxElement.style.width) - characterLength;
        inputEleWidth = ((inputEleWidth) / zoomFactor);
        inputEleHeight = ((inputEleHeight) / zoomFactor);
        let heightDiff: number = (inputEleHeight - currentAnnotation.bounds.height);
        let y: number = undefined;
        if (heightDiff > 0) {
            y = currentAnnotation.wrapper.offsetY + (heightDiff / 2);
            y = y > 0 ? y : undefined;
        } else {
            heightDiff = Math.abs(heightDiff);
            y = currentAnnotation.wrapper.offsetY - (heightDiff / 2);
            y = y > 0 ? y : undefined;
        }
        let widthDiff : number = (inputEleWidth - currentAnnotation.bounds.width);
        let x: number = undefined;
        if (widthDiff > 0) {
            x = currentAnnotation.wrapper.offsetX + (widthDiff / 2);
            x = x > 0 ? x : undefined;
        } else {
            widthDiff = Math.abs(widthDiff);
            x = currentAnnotation.wrapper.offsetX - (widthDiff / 2);
        }
        currentAnnotation.bounds.width = inputEleWidth;
        currentAnnotation.bounds.height = inputEleHeight;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { fontFamily: currentValue,
            bounds: { width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height, y: y, x: x } });
        this.pdfViewer.renderSelector(currentAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
        this.modifyInCollections(currentAnnotation, 'bounds');
    }

    /**
     * @param {string} text - text
     * @param {number} rectangle - rectangle
     * @param {boolean} isDynamic - isDynamic
     * @private
     * @returns {number} - fontSize
     */
    public calculateFontSize(text: string, rectangle: { width: number, height: number }, isDynamic?: boolean): number {
        const canvasElement: HTMLElement  = document.createElement('canvas');
        const context: CanvasRenderingContext2D = (canvasElement as HTMLCanvasElement).getContext('2d');
        let fontSize: number = 0;
        let contextWidth: number = 0;
        let rectangleWidth: number = rectangle.width;
        if (isDynamic === true) {
            if (text === 'REVISED' || text === 'REVIEWED' || text === 'RECEIVED' || text === 'APPROVED') {
                rectangleWidth = rectangleWidth / 2;
            }
            else if (text === 'CONFIDENTIAL' || text === 'NOT APPROVED') {
                rectangleWidth = rectangleWidth * (3 / 4);
            }
        }
        while (rectangleWidth > contextWidth) {
            context.font = fontSize + 'px' + ' ' + 'Helvetica';
            contextWidth = context.measureText(text).width;
            fontSize += 0.1;
        }
        return fontSize;
    }
}

/**
 *
 * @hidden
 */
interface IRectangle {
    height: number
    left: number
    top: number
    width: number
}

/**
 *
 * @hidden
 */
interface IRectangleAnnotation {
    bottom: number
    height: number
    left: number
    right: number
    rotation: number
    top: number
    width: number
}

/**
 *
 * @hidden
 */
export interface IPointBase {
    X: number
    Y: number
}

/**
 *
 * @hidden
 */
export interface IRect {
    x: number
    y: number
    width: number
    height: number
}

/**
 *
 * @hidden
 */
export class AnnotationBaseSettings {
    public opacity?: number;
    public fillColor?: string;
    public strokeColor?: string;
    public thickness?: number;
    public author?: string;
    public subject?: string;
    public modifiedDate?: string;
    public lineHeadStartStyle?: string;
    public lineHeadEndStyle?: string;
    public borderDashArray?: string | number[];
    public borderColor?: string;
    public borderWidth?: number;
    public fontSize?: number;
    public bounds?: AnnotBoundsRect;
    public width?: number;
    public height?: number;
    public fontColor?: string;
    public fontFamily?: string;
    public defaultText?: string;
    public fontStyle?: PdfFontModel;
    public textAlignment?: string;
    public isRepeat?: boolean;
    public overlayText?: string;
    public markerOpacity?: number;
    public markerFillColor?: string;
    public markerBorderColor?: string;
}

/**
 *
 * @hidden
 */
export class AnnotBoundsRect {
    public left: number;
    public top: number;
    public width: number;
    public height: number;
}

/**
 *
 * @hidden
 */
export class AnnotBoundsBase {
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;
}

/**
 *
 * @hidden
 */
export class AnnotRectBase {
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;
    x: number
    y: number
    width: number
    height: number
}

/**
 *
 * @hidden
 */
export class AnnotFontBase {
    public Bold?: boolean;
    public Italic?: boolean;
    public Strikeout?: boolean;
    public Underline?: boolean;
}

/**
 *
 * @hidden
 */
export class IBounds {
    public Right: number;
    public Bottom: number;
}

/**
 *
 * @hidden
 */
export class AnnotationsInternal {
    public annotationId?: string;
    public pageNumber?: number;
    public pageIndex?: number;
    public shapeAnnotationType?: string;
    public bounds?: AnnotBoundsRect | IRect | IBounds;
    public uniqueKey?: string;
    public id? : string;
    public textMarkupAnnotationType: string;
    public author?: string;
    public subject: string;
    public modifiedDate?: string;
    public note?: string;
    public color: any;
    public rect?: any;
    public opacity?: number;
    public comments?: ICommentsCollection[];
    public review?: IReviewCollection;
    public annotName: string;
    public position?: string;
    public textMarkupContent: string;
    public textMarkupStartIndex: number;
    public textMarkupEndIndex: number;
    public annotationSelectorSettings?: AnnotationSelectorSettingsModel;
    public customData: object;
    public isMultiSelect?: boolean;
    public annotNameCollection?: any[];
    public annotpageNumbers?: any[];
    public annotationSettings?: any;
    public allowedInteractions?: AllowedInteraction;
    public isLocked: boolean;
    public isPrint: boolean;
    public isCommentLock?: boolean;
    public isAnnotationRotated: boolean;
    public annotationRotation?: number;
    public ShapeAnnotationType?: string;
    public annotationAddMode?: string;
    public rotateAngle?: number;
    public pageRotation?: number;
}

/**
 *
 * @hidden
 */
export class AnnotationsBase {
    public isMultiSelect?: boolean;
    public AnnotationIndex: number;
    public isAddAnnotationProgramatically? : boolean;
    public annotationAddMode?: string;
    public AllowedInteractions?: AllowedInteraction[];
    public allowedInteractions?: AllowedInteraction[];
    public Bounds?: AnnotBoundsBase | IRect | IBounds;
    public AnnotType?: string;
    public VertexPoints?: IPointBase[];
    public AnnotationSettings?: AnnotationSettingsModel;
    public IsLocked?: boolean;
    public PageRotation?: number;
    public author?: string;
    public subject?: string;
    public modifiedDate?: string;
    public Rotate?: number;
    public Author?: string;
    public ModifiedDate?: string;
    public Subject?: string;
    public Thickness?: number;
    public MarkupText?: string;
    public StrokeColor?: string;
    public FillColor?: string;
    public FontSize?: number;
    public Font?: AnnotFontBase;
    public AnnotName?: string;
    public Opacity?: number;
    public FontColor?: string;
    public IsPrint?: boolean;
    public IsCommentLock?: boolean;
    public AnnotationSelectorSettings?: AnnotationSelectorSettingsModel;
    public rotateAngle?: number;
    public pageRotation?: number;
    public IsReadonly?: boolean;
    public IsTransparentSet?: boolean;
    public rect?: any;
    public ShapeAnnotationType?: string;
    public FontFamily?: string;
    public TextAlign?: string;
    public Comments?: ICommentsCollection[];
    public State?: string;
    public StateModel?: string;
    public annotationId?: string;
    public pageNumber?: number;
    public pageIndex?: number;
    public shapeAnnotationType?: string;
    public bounds?: AnnotBoundsRect | IRect;
    public uniqueKey?: string;
    public id? : string;
}
