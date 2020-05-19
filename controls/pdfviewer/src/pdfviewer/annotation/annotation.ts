import {
    // tslint:disable-next-line:max-line-length
    PdfViewer, PdfViewerBase, AnnotationType, IShapeAnnotation, ITextMarkupAnnotation, TextMarkupAnnotation, ShapeAnnotation,
    StampAnnotation, StickyNotesAnnotation, IPopupAnnotation, ICommentsCollection, MeasureAnnotation
} from '../index';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { NumericTextBox, Slider, ColorPicker, ColorPickerEventArgs, ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DecoratorShapes, PointModel } from '@syncfusion/ej2-drawings';
import { isLineShapes, cloneObject } from '../../diagram/drawing-util';
import { PdfAnnotationBaseModel, PdfFontModel } from '../../diagram/pdf-annotation-model';
import { NodeDrawingTool, LineTool, MoveTool, ResizeTool, ConnectTool } from '../../diagram/tools';
import { updateDistanceLabel, updateRadiusLabel, updatePerimeterLabel, updateCalibrateLabel } from '../../diagram/connector-util';
import { AnnotationPropertiesChangeEventArgs, ISize } from '../base';
import { FreeTextAnnotation } from './free-text-annotation';
import { InputElement } from './input-element';
import { InPlaceEditor } from '@syncfusion/ej2-inplace-editor';
import { ShapeLabelSettingsModel, AnnotationSelectorSettingsModel } from '../pdfviewer-model';

/**
 * @hidden
 */
export interface IActionElements {
    pageIndex: number;
    index: number;
    // tslint:disable-next-line
    annotation: any;
    action: string;
    // tslint:disable-next-line
    undoElement: any;
    // tslint:disable-next-line
    redoElement: any;
    // tslint:disable-next-line
    duplicate?: any;
    modifiedProperty: string;
}

/**
 * @hidden
 */
export interface IPoint {
    x: number;
    y: number;
}

/**
 * @hidden
 */
export interface IPageAnnotations {
    pageIndex: number;
    // tslint:disable-next-line
    annotations: any[];
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
    public textMarkupAnnotationModule: TextMarkupAnnotation;
    /**
     * @private
     */
    public shapeAnnotationModule: ShapeAnnotation;
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
    public stickyNotesAnnotationModule: StickyNotesAnnotation;
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
    private selectedLineStyle: string;
    private selectedLineDashArray: string;
    private isUndoRedoAction: boolean = false;
    private isUndoAction: boolean = false;
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
    // tslint:disable-next-line
    private overlappedAnnotations: any = [];
    /**
     * @private
     */
    // tslint:disable-next-line
    public overlappedCollections : any = null;

    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.textMarkupAnnotationModule = new TextMarkupAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        if (this.pdfViewer.enableShapeAnnotation) {
            this.shapeAnnotationModule = new ShapeAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        if (this.pdfViewer.enableMeasureAnnotation) {
            this.measureAnnotationModule = new MeasureAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        this.stampAnnotationModule = new StampAnnotation(this.pdfViewer, this.pdfViewerBase);
        this.stickyNotesAnnotationModule = new StickyNotesAnnotation(this.pdfViewer, this.pdfViewerBase);
        this.freeTextAnnotationModule = new FreeTextAnnotation(this.pdfViewer, this.pdfViewerBase);
        this.inputElementModule = new InputElement(this.pdfViewer, this.pdfViewerBase);
    }

    /**
     * Set annotation type to be added in next user interaction in PDF Document.
     * @param type
     * @returns void
     */
    public setAnnotationMode(type: AnnotationType): void {
        if (type === 'None') {
            this.clearAnnotationMode();
        } else if (type === 'Highlight' || type === 'Strikethrough' || type === 'Underline') {
            if (this.textMarkupAnnotationModule) {
                this.textMarkupAnnotationModule.isSelectionMaintained = false;
                this.textMarkupAnnotationModule.drawTextMarkupAnnotations(type.toString());
            }
        } else if (type === 'Line' || type === 'Arrow' || type === 'Rectangle' || type === 'Circle' || type === 'Polygon') {
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
        } else if (type === 'HandWrittenSignature') {
            this.pdfViewerBase.signatureModule.setAnnotationMode();
        }
    }

    private clearAnnotationMode(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
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
    }

    public deleteAnnotation(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.deleteTextMarkupAnnotation();
        }
        if (this.pdfViewer.selectedItems.annotations.length !== 0) {
            let pageNumber: number = this.pdfViewer.selectedItems.annotations[0].pageIndex;
            // tslint:disable-next-line
            let shapeType: any = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType;
            // tslint:disable-next-line
            let undoElement: any;
            if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                // tslint:disable-next-line:max-line-length
                if (isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0].measureType) || this.pdfViewer.selectedItems.annotations[0].measureType === '') {
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(this.pdfViewer.selectedItems.annotations[0], 'shape');
                    this.updateImportAnnotationCollection(this.pdfViewer.selectedItems.annotations[0], pageNumber, 'shapeAnnotation');
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(this.pdfViewer.selectedItems.annotations[0], 'measure');
                    // tslint:disable-next-line:max-line-length
                    this.updateImportAnnotationCollection(this.pdfViewer.selectedItems.annotations[0], pageNumber, 'measureShapeAnnotation');
                }
                undoElement = this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'delete');
            } else if (shapeType === 'FreeText') {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(this.pdfViewer.selectedItems.annotations[0], 'FreeText', 'delete');
                undoElement = this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'delete');
                this.updateImportAnnotationCollection(this.pdfViewer.selectedItems.annotations[0], pageNumber, 'freeTextAnnotation');
            } else if (shapeType === 'HandWrittenSignature') {
                undoElement = this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'delete');
            } else {
                undoElement = this.pdfViewer.selectedItems.annotations[0];
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(undoElement, undoElement.shapeAnnotationType, 'delete');
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(this.pdfViewer.selectedItems.annotations[0], null, 'delete');
            }
            if (shapeType === 'StickyNotes') {
                this.updateImportAnnotationCollection(this.pdfViewer.selectedItems.annotations[0], pageNumber, 'stickyNotesAnnotation');
            }
            if (shapeType === 'Stamp' || 'Image') {
                this.updateImportAnnotationCollection(this.pdfViewer.selectedItems.annotations[0], pageNumber, 'stampAnnotations');
            }

            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotation.addAction(pageNumber, null, this.pdfViewer.selectedItems.annotations[0], 'Delete', '', undoElement, this.pdfViewer.selectedItems.annotations[0]);
            // tslint:disable-next-line
            let removeDiv: any;
            if (this.pdfViewer.selectedItems.annotations[0].annotName !== '') {
                removeDiv = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
            } else {
                if (undoElement) {
                    if (undoElement.annotName !== '') {
                        removeDiv = document.getElementById(undoElement.annotName);
                    }
                }
            }
            if (removeDiv) {
                if (removeDiv.parentElement.childElementCount === 1) {
                    this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                } else {
                    removeDiv.remove();
                }
            }
            let selectedAnnot: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
            let annotationId: string = selectedAnnot.annotName;
            let annotType: AnnotationType = this.getAnnotationType(selectedAnnot.shapeAnnotationType, selectedAnnot.measureType);
            if (shapeType === 'Path') {
                // tslint:disable-next-line
                let inputFields: any = document.getElementById(selectedAnnot.id);
                if (inputFields && inputFields.className === 'e-pdfviewer-signatureformFields signature') {
                    inputFields.className = 'e-pdfviewer-signatureformFields';
                    inputFields.style.pointerEvents = '';
                    this.pdfViewer.formFieldsModule.updateDataInSession(inputFields, '');
                }
            }
            this.updateAnnotationCollection(this.pdfViewer.selectedItems.annotations[0]);
            this.pdfViewer.remove(this.pdfViewer.selectedItems.annotations[0]);
            this.pdfViewer.renderDrawing();
            this.pdfViewer.clearSelection(pageNumber);
            this.pdfViewerBase.isDocumentEdited = true;
            if (selectedAnnot.shapeAnnotationType === 'HandWrittenSignature') {
                // tslint:disable-next-line:max-line-length
                let bounds: object = { left: selectedAnnot.bounds.x, top: selectedAnnot.bounds.y, width: selectedAnnot.bounds.width, height: selectedAnnot.bounds.height };
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireSignatureRemove(pageNumber, selectedAnnot.signatureName, selectedAnnot.shapeAnnotationType as AnnotationType, bounds);
            } else {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireAnnotationRemove(pageNumber, annotationId, annotType, selectedAnnot.bounds);
            }
            if (this.pdfViewer.textSelectionModule) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
        }
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(false);
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(false);
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public storeAnnotationCollections(annotation: any, pageNumber: number): void {
        // tslint:disable-next-line
        let collectionDetails: any = this.checkAnnotationCollection(annotation);
        // tslint:disable-next-line
        let selectAnnotation: any = cloneObject(annotation);
        selectAnnotation.annotationId = annotation.annotName;
        selectAnnotation.pageNumber = pageNumber;
        delete selectAnnotation.annotName;
        if (annotation.shapeAnnotationType === 'stamp') {
            selectAnnotation.uniqueKey = annotation.randomId;
            delete selectAnnotation.randomId;
        }
        if (annotation.id) {
            selectAnnotation.uniqueKey = annotation.id;
            delete selectAnnotation.id;
        }
        if (collectionDetails.isExisting) {
            this.pdfViewer.annotationCollection.splice(collectionDetails.position, 0, selectAnnotation);
        } else {
            this.pdfViewer.annotationCollection.push(selectAnnotation);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getCustomData(annotation: any): object {
        let customData: object;
        if (annotation.CustomData === null) {
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
        } else {
            customData = annotation.CustomData;
        }
        return customData;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getShapeData(type: string, subject: string): object {
        let customData: object;
        if (type === 'Line' && subject !== 'Arrow') {
                customData = this.pdfViewer.lineSettings.customData;
         } else if ((type === 'LineWidthArrowHead' || subject === 'Arrow')) {
                customData = this.pdfViewer.arrowSettings.customData;
         } else if ((type === 'Rectangle' || type === 'Square')) {
               customData = this.pdfViewer.rectangleSettings.customData;
        } else if ((type === 'Ellipse' || type === 'Circle')) {
               customData = this.pdfViewer.circleSettings.customData;
        } else if (type === 'Polygon') {
               customData = this.pdfViewer.polygonSettings.customData;
        }
        return customData;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getMeasureData( type: string) : object {
        let customData: object;
        if (type === 'Distance' || type === 'Distance calculation') {
                customData = this.pdfViewer.distanceSettings.customData;
        } else if (type === 'Line' || type === 'Perimeter calculation') {
                customData = this.pdfViewer.lineSettings.customData;
        } else if (type === 'Polygon' || type === 'Area calculation' || type === 'Volume calculation') {
                customData = this.pdfViewer.polygonSettings.customData;
        } else if (type === 'Radius' || type === 'Radius calculation') {
                customData = this.pdfViewer.radiusSettings.customData;
        }
        return customData;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getTextMarkupData(type: string) : object {
        let customData: object;
        if (type === 'Highlight') {
             customData = this.pdfViewer.highlightSettings.customData;
        } else if (type === 'Underline') {
             customData = this.pdfViewer.underlineSettings.customData;
        } else if (type === 'Strikethrough') {
           customData = this.pdfViewer.strikethroughSettings.customData;
        }
        return customData;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public clearAnnotationStorage(): void {
        // tslint:disable-next-line
        let sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        let maxSessionSize: number = 4500;
        if (sessionSize > maxSessionSize) {
            let storageLength: number = window.sessionStorage.length;
            // tslint:disable-next-line
            let annotationList: any = [];
            for (let i: number = 0; i < storageLength; i++) {
                if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                    if (window.sessionStorage.key(i).split('_')[3] === 'annotations') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.annotationStorage[window.sessionStorage.key(i)] = window.sessionStorage.getItem(window.sessionStorage.key(i));
                        annotationList.push(window.sessionStorage.key(i));
                    }
                }
            }
            if (annotationList) {
                for (let i: number = 0; i < annotationList.length; i++) {
                    window.sessionStorage.removeItem(annotationList[i]);
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public checkAnnotationCollection(annotation: any): any {
        // tslint:disable-next-line
        let collections: any = this.pdfViewer.annotationCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].annotationId === annotation.annotName) {
                    this.pdfViewer.annotationCollection.splice(i, 1);
                    return { isExisting: true, position: i };
                }
            }
        }
        return { isExisting: false, position: null };
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public updateAnnotationCollection(annotation: any): void {
        // tslint:disable-next-line
        let collections: any = this.pdfViewer.annotationCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].annotationId === annotation.annotName) {
                    this.pdfViewer.annotationCollection.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public updateImportAnnotationCollection(annotation: any, pageNumber: number, annotationType: string): void {
        if (this.pdfViewerBase.isImportAction) {
            if (this.pdfViewerBase.importedAnnotation && this.pdfViewerBase.importedAnnotation[pageNumber]) {
                // tslint:disable-next-line
                let currentPageAnnotations: any = this.pdfViewerBase.importedAnnotation[pageNumber];
                if (currentPageAnnotations[annotationType]) {
                    for (let i: number = 0; i < currentPageAnnotations[annotationType].length; i++) {
                        // tslint:disable-next-line:max-line-length
                        if (annotation.annotName === currentPageAnnotations[annotationType][i].AnnotName || annotation.annotName === currentPageAnnotations[annotationType][i].annotName) {
                            this.pdfViewerBase.importedAnnotation[pageNumber][annotationType].splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        // tslint:disable-next-line
        let documentcollections: any = this.pdfViewerBase.documentAnnotationCollections;
        if (documentcollections && documentcollections[pageNumber]) {
            // tslint:disable-next-line
            let documentPageCollections: any = documentcollections[pageNumber];
            if (documentPageCollections && documentPageCollections[annotationType]) {
                for (let i: number = 0; i < documentPageCollections[annotationType].length; i++) {
                    // tslint:disable-next-line:max-line-length
                    if (annotation.annotName === documentPageCollections[annotationType][i].AnnotName) {
                        this.pdfViewerBase.documentAnnotationCollections[pageNumber][annotationType].splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Select the annotations using annotation object or annotation Id.
     * @param annotationId
     * @returns void
     */
    public selectAnnotation(annotationId: string | object): void {
        // tslint:disable-next-line
        let annotation: any;
        let id: string;
        if (typeof annotationId === 'object') {
            annotation = annotationId;
            id = annotation.annotationId;
            annotation = this.getAnnotationsFromAnnotationCollections(id);
        }
        if (typeof annotationId === 'string') {
            annotation = this.getAnnotationsFromAnnotationCollections(annotationId);
            id = annotationId;
        }
        if (annotation) {
            let pageIndex: number = annotation.pageNumber;
            let isRender: boolean = false;
            isRender = this.findRenderPageList(pageIndex);
            let currentSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            //let pageIndex: number = this.getPageNumberFromAnnotationCollections(annotation);
            if (annotation && pageIndex >= 0) {
                if (annotation.shapeAnnotationType === 'textMarkup') {
                    if (annotation.rect || annotation.bounds) {
                        // tslint:disable-next-line:max-line-length
                        let scrollValue: number = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + (this.getAnnotationTop(annotation)) * this.pdfViewerBase.getZoomFactor();
                        let scroll: string = (scrollValue - 20).toString();
                        // tslint:disable-next-line:radix
                        this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
                    } else {
                        if (this.pdfViewer.navigation) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                        }
                    }
                } else {
                    if (annotation.bounds) {
                        // tslint:disable-next-line:max-line-length
                        let scrollValue: number = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + (annotation.bounds.top) * this.pdfViewerBase.getZoomFactor();
                        let scroll: string = (scrollValue - 20).toString();
                        // tslint:disable-next-line:radix
                        this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
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
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageIndex, true);
                        // tslint:disable-next-line:max-line-length
                        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
                        // tslint:disable-next-line
                        let textMarkupAnnotation: any = this.getTextMarkupAnnotations(pageIndex, annotation);
                        if (textMarkupAnnotation) {
                            this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                            this.textMarkupAnnotationModule.isSelectedAnnotation = true;
                            this.textMarkupAnnotationModule.showHideDropletDiv(true);
                            this.textMarkupAnnotationModule.annotationClickPosition = null;
                            this.textMarkupAnnotationModule.selectAnnotation(textMarkupAnnotation, canvas, pageIndex);
                            this.textMarkupAnnotationModule.currentTextMarkupAnnotation = textMarkupAnnotation;
                            this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageIndex;
                            this.textMarkupAnnotationModule.enableAnnotationPropertiesTool(true);
                            this.textMarkupAnnotationModule.isSelectedAnnotation = false;
                            if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                            }
                        }
                    } else if (annotation.shapeAnnotationType === 'stamp' || annotation.ShapeAnnotationType === 'stamp') {
                        this.pdfViewer.select([annotation.uniqueKey], currentSelector);
                        this.pdfViewer.annotation.onAnnotationMouseDown();
                    } else if (annotation.shapeAnnotationType === 'sticky' || annotation.ShapeAnnotationType === 'sticky') {
                        this.pdfViewer.select([annotation.annotationId], currentSelector);
                        this.pdfViewer.annotation.onAnnotationMouseDown();
                    } else {
                        this.pdfViewer.select([annotation.uniqueKey], currentSelector);
                        this.pdfViewer.annotation.onAnnotationMouseDown();
                    }
                    // tslint:disable-next-line:max-line-length
                    let commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                    if (commentElement && commentElement.style.display === 'block') {
                        // tslint:disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // tslint:disable-next-line
                        let commentsDiv: any = document.getElementById(id);
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
                } else {
                    this.selectAnnotationId = id;
                    this.isAnnotationSelected = true;
                    this.annotationPageIndex = pageIndex;
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getAnnotationTop(annotation: any): number {
        if (annotation.rect) {
            if (annotation.rect.Top) {
                return annotation.rect.Top;
            } else {
                return annotation.rect.top;
            }
        } else {
            if (annotation.bounds[0].Top) {
                return annotation.bounds[0].Top;
            } else {
                return annotation.bounds[0].top;
            }
        }
    }

    /**
     * @private
     */
    public selectAnnotationFromCodeBehind(): void {
        if (this.isAnnotationSelected && this.selectAnnotationId) {
            // tslint:disable-next-line
            let annotation: any = this.getAnnotationsFromAnnotationCollections(this.selectAnnotationId);
            let id: string = this.selectAnnotationId;
            let pageIndex: number = annotation.pageNumber;
            let currentSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            if (annotation && (this.annotationPageIndex >= 0) && this.annotationPageIndex === pageIndex) {
                if (this.previousIndex) {
                    this.pdfViewer.clearSelection(this.previousIndex);
                }
                this.pdfViewer.clearSelection(pageIndex);
                this.previousIndex = pageIndex;
                if (annotation.shapeAnnotationType === 'textMarkup') {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageIndex, true);
                    // tslint:disable-next-line:max-line-length
                    let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
                    // tslint:disable-next-line
                    let textMarkupAnnotation: any = this.getTextMarkupAnnotations(pageIndex, annotation);
                    if (textMarkupAnnotation) {
                        this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                        this.textMarkupAnnotationModule.isSelectedAnnotation = true;
                        this.textMarkupAnnotationModule.showHideDropletDiv(true);
                        this.textMarkupAnnotationModule.annotationClickPosition = null;
                        this.textMarkupAnnotationModule.selectAnnotation(textMarkupAnnotation, canvas, pageIndex);
                        this.textMarkupAnnotationModule.currentTextMarkupAnnotation = textMarkupAnnotation;
                        this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageIndex;
                        this.textMarkupAnnotationModule.enableAnnotationPropertiesTool(true);
                        this.textMarkupAnnotationModule.isSelectedAnnotation = false;
                        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
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
                // tslint:disable-next-line:max-line-length
                let commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                if (commentElement && commentElement.style.display === 'block') {
                    // tslint:disable-next-line
                    let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                    if (accordionExpand) {
                        accordionExpand.ej2_instances[0].expandItem(true);
                    }
                    // tslint:disable-next-line
                    let commentsDiv: any = document.getElementById(id);
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

    private findRenderPageList(pageIndex: number): boolean {
        let isRender: boolean = false;
        // tslint:disable-next-line
        let pageList: any = this.pdfViewerBase.renderedPagesList;
        if (pageList) {
            for (let i: number = 0; i < pageList.length; i++) {
                if (pageList[i] === pageIndex) {
                    isRender = true;
                    return isRender;
                }
            }
        }
        return isRender;
    }

    // tslint:disable-next-line
    private getPageNumberFromAnnotationCollections(annotation: any): any {
        // tslint:disable-next-line
        let collections: any = this.pdfViewer.annotations;
        if (annotation) {
            if (annotation.shapeAnnotationType === 'textMarkup') {
                return annotation.pageNumber;
            } else {
                if (collections) {
                    for (let i: number = 0; i < collections.length; i++) {
                        if (collections[i].annotName === annotation.annotationId) {
                            return collections[i].pageIndex;
                        }
                    }
                }
            }
        }
    }

    // tslint:disable-next-line
    private getAnnotationsFromAnnotationCollections(annotationId: string): any {
        // tslint:disable-next-line
        let collections: any = this.pdfViewer.annotationCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].annotationId === annotationId) {
                    return collections[i];
                }
            }
        }
    }

    // tslint:disable-next-line
    private getTextMarkupAnnotations(pageIndex: number, annotation: any): any {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_textMarkup'];
        }
        if (storeObject) {
            // tslint:disable-next-line
            let annotObject: any = JSON.parse(storeObject);
            let index: number = this.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                for (let i: number = 0; i < annotObject[index].annotations.length; i++) {
                    if (annotObject[index].annotations[i].annotName === annotation.annotationId) {
                        return annotObject[index].annotations[i];
                    }
                }
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * @private
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
     * @private
     */
    public getAnnotationIndex(pageNumber: number, annotationId: string): number {
        let pageAnnotationBases: PdfAnnotationBaseModel[] = this.pdfViewer.drawing.getPageObjects(pageNumber);
        let index: number = null;
        for (let i: number = 0; i < pageAnnotationBases.length; i++) {
            if (pageAnnotationBases[i].id === annotationId) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * @private
     */
    public initializeCollection(): void {
        this.actionCollection = [];
        this.redoCollection = [];
        this.pdfViewerBase.customStampCollection = [];
        if (!this.popupNote) {
            this.createNote();
        }
    }

    /**
     * @private
     */
    public showCommentsPanel(): void {
        if (this.pdfViewer.enableCommentPanel) {
            let commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentPanel) {
                if (commentPanel.style.display === 'none') {
                    commentPanel.style.display = 'block';
                    this.pdfViewerBase.navigationPane.commentPanelResizer.style.display = 'block';
                    this.pdfViewerBase.navigationPane.setCommentPanelResizeIconTop();
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelTextTop();
                    let viewerContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
                    let pageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
                    if (viewerContainer) {
                        if (this.pdfViewer.enableRtl) {
                            viewerContainer.style.left = this.pdfViewerBase.navigationPane.getViewerContainerRight() + 'px';
                        } else {
                            viewerContainer.style.right = this.pdfViewerBase.navigationPane.getViewerContainerRight() + 'px';
                        }
                        // tslint:disable-next-line:max-line-length
                        viewerContainer.style.width = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - this.pdfViewerBase.navigationPane.getViewerContainerRight()) + 'px';
                        pageContainer.style.width = (viewerContainer.offsetWidth - this.pdfViewerBase.navigationPane.getViewerContainerScrollbarWidth()) + 'px';
                    }
                    this.pdfViewerBase.updateZoomValue();
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                        this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public addAction(
        // tslint:disable-next-line
        pageNumber: number, index: number, annotation: any, actionString: string, property: string, node?: any, redo?: any): void {
        let action: IActionElements = {
            pageIndex: pageNumber, index: index, annotation: annotation,
            action: actionString, modifiedProperty: property, undoElement: node, redoElement: redo
        };
        this.actionCollection.push(action);
        this.updateToolbar();
    }

    /**
     * @private
     */
    public undo(): void {
        let actionObject: IActionElements = this.actionCollection.pop();
        if (actionObject) {
            // tslint:disable-next-line
            let shapeType: any = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            this.isUndoAction = true;
            switch (actionObject.action) {
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        this.textMarkupAnnotationModule.undoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty, true);
                    }
                    break;
                case 'Drag':
                case 'Resize':
                    if (isLineShapes(actionObject.annotation)) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.undoElement.bounds, vertexPoints: actionObject.undoElement.vertexPoints, leaderHeight: actionObject.undoElement.leaderHeight });
                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.undoElement.bounds });
                    }
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                        actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { notes: actionObject.undoElement.notes });
                        this.updateCalibrateValues(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.select([actionObject.annotation.id]);
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead' ||
                        actionObject.annotation.shapeAnnotationType === 'Radius' || actionObject.annotation.shapeAnnotationType === 'FreeText' || actionObject.annotation.shapeAnnotationType === 'HandWrittenSignature') {
                        this.modifyInCollections(actionObject.annotation, 'bounds');
                    }
                    break;
                case 'Addition':
                    let isAnnotationUpdate: boolean = false;
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'shape');
                        } else {
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'measure');
                        }
                        isAnnotationUpdate = true;
                        actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                        // tslint:disable-next-line:max-line-length
                        this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                        isAnnotationUpdate = true;
                    }
                    if (shapeType === 'FreeText' || shapeType === 'HandWrittenSignature') {
                        isAnnotationUpdate = true;
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                        actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (!isAnnotationUpdate) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.remove(actionObject.annotation);
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line
                    let removeDiv: any = document.getElementById(actionObject.annotation.annotName);
                    if (removeDiv) {
                        if (removeDiv.parentElement.childElementCount === 1) {
                            this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                        } else {
                            removeDiv.remove();
                        }
                    }
                    break;
                case 'Delete':
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            shapeType = 'shape';
                            this.shapeAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                        } else {
                            shapeType = 'shape_measure';
                            this.measureAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                        }
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        this.stampAnnotationModule.updateDeleteItems(actionObject.annotation.pageIndex, actionObject.annotation);
                    } else if (shapeType === 'FreeText') {
                        this.freeTextAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                    }
                    let addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(actionObject.annotation);
                    if ((shapeType === 'FreeText' || addedAnnot.enableShapeLabel) && addedAnnot) {
                        this.pdfViewer.nodePropertyChange(addedAnnot, {});
                    }
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(actionObject.annotation.pageIndex, shapeType);
                    break;
                case 'stampOpacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.undoElement.opacity });
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    actionObject.annotation.modifiedDate = new Date().toLocaleString();
                    break;
                case 'Shape Stroke':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { strokeColor: actionObject.undoElement.strokeColor });
                    this.modifyInCollections(actionObject.annotation, 'stroke');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Fill':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fillColor: actionObject.undoElement.fillColor });
                    this.modifyInCollections(actionObject.annotation, 'fill');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Opacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.undoElement.opacity });
                    if (actionObject.annotation.shapeAnnotationType === 'StickyNotes') {
                        this.stickyNotesAnnotationModule.updateOpacityValue(actionObject.annotation);
                        this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                        actionObject.annotation.modifiedDate = new Date().toLocaleString();
                    } else {
                        this.modifyInCollections(actionObject.annotation, 'opacity');
                    }
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Thickness':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { thickness: actionObject.undoElement.thickness });
                    this.modifyInCollections(actionObject.annotation, 'thickness');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Line properties change':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                        // tslint:disable-next-line:max-line-length
                        fillColor: actionObject.undoElement.fillColor, borderDashArray: actionObject.undoElement.borderDashArray, borderStyle: actionObject.undoElement.borderStyle,
                        // tslint:disable-next-line:max-line-length
                        strokeColor: actionObject.undoElement.strokeColor, opacity: actionObject.undoElement.opacity, thickness: actionObject.undoElement.thickness,
                        sourceDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadStart), taregetDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadEnd)
                    });
                    this.updateCollectionForLineProperty(actionObject.annotation);
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Text Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    actionObject.annotation.modifiedDate = new Date().toLocaleString();
                    break;
                case 'Comments Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Status Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Comments Reply Deleted':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'dynamicText Change':
                    this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                    actionObject.annotation.dynamicText = actionObject.undoElement.dynamicText;
                    // tslint:disable-next-line
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    this.modifyInCollections(actionObject.annotation, 'dynamicText');
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, {});
                    this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    break;
                case 'fontColor':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fontColor: actionObject.undoElement.fontColor });
                    this.modifyInCollections(actionObject.annotation, 'fontColor');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'fontSize':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fontSize: actionObject.undoElement.fontSize });
                    this.modifyInCollections(actionObject.annotation, 'fontSize');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'fontFamily':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fontFamily: actionObject.undoElement.fontFamily });
                    this.modifyInCollections(actionObject.annotation, 'fontFamily');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'textAlign':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { textAlign: actionObject.undoElement.textAlign });
                    this.modifyInCollections(actionObject.annotation, 'textAlign');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'textPropertiesChange':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { font: actionObject.undoElement.font });
                    this.modifyInCollections(actionObject.annotation, 'textPropertiesChange');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Rotate':
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.nodePropertyChange(actionObject.annotation.annotations[0], {bounds: actionObject.undoElement.bounds, rotateAngle: actionObject.undoElement.rotateAngle});
                    this.modifyInCollections(actionObject.annotation.annotations[0], 'bounds');
                    this.pdfViewer.renderDrawing();
            }
            this.redoCollection.push(actionObject);
            this.updateToolbar();
            this.isUndoRedoAction = false;
            this.isUndoAction = false;
        }
    }

    /**
     * @private
     */
    public redo(): void {
        let actionObject: IActionElements = this.redoCollection.pop();
        if (actionObject) {
            // tslint:disable-next-line
            let shapeType: any = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            switch (actionObject.action) {
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty);
                    }
                    break;
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        this.textMarkupAnnotationModule.redoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Drag':
                case 'Resize':
                    if (isLineShapes(actionObject.annotation)) {
                        this.pdfViewer.nodePropertyChange(
                            // tslint:disable-next-line:max-line-length
                            actionObject.annotation, { bounds: actionObject.redoElement.bounds, vertexPoints: actionObject.redoElement.vertexPoints, leaderHeight: actionObject.redoElement.leaderHeight });

                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.redoElement.bounds });
                    }
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                        actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { notes: actionObject.redoElement.notes });
                        this.updateCalibrateValues(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.select([actionObject.annotation.id]);
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead'
                        || actionObject.annotation.shapeAnnotationType === 'Radius' || actionObject.annotation.shapeAnnotationType === 'FreeText' || actionObject.annotation.shapeAnnotationType === 'HandWrittenSignature') {
                        this.modifyInCollections(actionObject.annotation, 'bounds');
                    }
                    break;
                case 'Addition':
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            shapeType = 'shape';
                            this.shapeAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        } else {
                            shapeType = 'shape_measure';
                            this.measureAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        }
                    }
                    if (shapeType === 'FreeText') {
                        this.freeTextAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                    }
                    if (shapeType === 'Stamp') {
                        this.stampAnnotationModule.updateDeleteItems(actionObject.annotation.pageIndex, actionObject.redoElement);
                    }
                    if (shapeType === 'HandWrittenSignature') {
                        this.pdfViewerBase.signatureModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                    }
                    let addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(actionObject.annotation);
                    this.pdfViewer.select([actionObject.annotation.id]);
                    if ((shapeType === 'FreeText' || addedAnnot.enableShapeLabel) && addedAnnot) {
                        this.pdfViewer.nodePropertyChange(addedAnnot, {});
                    }
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(actionObject.annotation.pageIndex, shapeType);
                    break;
                case 'Delete':
                    let isUpdate: boolean = false;
                    let sType: string = actionObject.annotation.shapeAnnotationType;
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            sType = 'shape';
                        } else {
                            sType = 'measure';
                        }
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                        isUpdate = true;
                    }
                    if (shapeType === 'Stamp') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                        isUpdate = true;
                    }
                    if (shapeType === 'FreeText' || shapeType === 'HandWrittenSignature') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (!isUpdate) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                    }
                    this.pdfViewer.clearSelection(actionObject.annotation.pageIndex);
                    this.pdfViewer.remove(actionObject.annotation);
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line
                    let removeDiv: any = document.getElementById(actionObject.annotation.annotName);
                    if (removeDiv) {
                        if (removeDiv.parentElement.childElementCount === 1) {
                            this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                        } else {
                            removeDiv.remove();
                        }
                    }
                    break;
                case 'stampOpacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.redoElement.opacity });
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    break;
                case 'Shape Stroke':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { strokeColor: actionObject.redoElement.strokeColor });
                    this.modifyInCollections(actionObject.annotation, 'stroke');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Fill':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fillColor: actionObject.redoElement.fillColor });
                    this.modifyInCollections(actionObject.annotation, 'fill');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Opacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.redoElement.opacity });
                    if (actionObject.annotation.shapeAnnotationType === 'StickyNotes') {
                        this.stickyNotesAnnotationModule.updateOpacityValue(actionObject.annotation);
                        this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    } else {
                        this.modifyInCollections(actionObject.annotation, 'opacity');
                    }
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Thickness':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { thickness: actionObject.redoElement.thickness });
                    this.modifyInCollections(actionObject.annotation, 'thickness');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Line properties change':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                        // tslint:disable-next-line:max-line-length
                        fillColor: actionObject.redoElement.fillColor, strokeColor: actionObject.redoElement.strokeColor, opacity: actionObject.redoElement.opacity, thickness: actionObject.redoElement.thickness,
                        sourceDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadStart), taregetDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadEnd),
                        borderDashArray: actionObject.redoElement.borderDashArray, borderStyle: actionObject.redoElement.borderStyle
                    });
                    this.updateCollectionForLineProperty(actionObject.annotation);
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Text Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    break;
                case 'Comments Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Status Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action);
                    break;
                case 'Comments Reply Deleted':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action);
                    break;
                case 'dynamicText Change':
                    this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                    actionObject.annotation.dynamicText = actionObject.redoElement.dynamicText;
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    this.modifyInCollections(actionObject.annotation, 'dynamicText');
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, {});
                    this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                    break;
                case 'fontColor':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fontColor: actionObject.redoElement.fontColor });
                    this.modifyInCollections(actionObject.annotation, 'fontColor');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'fontSize':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fontSize: actionObject.redoElement.fontSize });
                    this.modifyInCollections(actionObject.annotation, 'fontSize');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'textAlign':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { textAlign: actionObject.redoElement.textAlign });
                    this.modifyInCollections(actionObject.annotation, 'textAlign');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'textPropertiesChange':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { font: actionObject.redoElement.font });
                    this.modifyInCollections(actionObject.annotation, 'textPropertiesChange');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Rotate':
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.nodePropertyChange(actionObject.annotation.annotations[0], {bounds: actionObject.redoElement.bounds, rotateAngle: actionObject.redoElement.rotateAngle});
                    this.modifyInCollections(actionObject.annotation.annotations[0], 'bounds');
                    this.pdfViewer.renderDrawing();
            }
            if (actionObject.redoElement && actionObject.redoElement.modifiedDate !== undefined) {
                actionObject.annotation.modifiedDate = actionObject.redoElement.modifiedDate;
            }
            this.actionCollection.push(actionObject);
            this.updateToolbar();
            this.isUndoRedoAction = false;
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

    private updateToolbar(): void {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateUndoRedoButtons();
        }
    }

    private createNote(): void {
        // tslint:disable-next-line:max-line-length
        this.popupNote = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note', className: 'e-pv-annotation-note', styles: 'display:none' });
        this.popupNoteAuthor = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_author', className: 'e-pv-annotation-note-author' });
        this.popupNote.appendChild(this.popupNoteAuthor);
        // tslint:disable-next-line:max-line-length
        this.popupNoteContent = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_content', className: 'e-pv-annotation-note-content' });
        this.popupNote.appendChild(this.popupNoteContent);
        this.pdfViewerBase.mainContainer.appendChild(this.popupNote);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public showPopupNote(event: any, color: string, author: string, note: string, type: string): void {
        let mainContainerPosition: ClientRect = this.pdfViewerBase.mainContainer.getBoundingClientRect();
        let popupNoteClientRect: ClientRect = this.popupNote.getBoundingClientRect();
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
     */
    public hidePopupNote(): void {
        this.popupNote.style.display = 'none';
    }

    private createTextMarkupPopup(): void {
        let elementId: string = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        this.popupElement = createElement('div', { id: elementId + '_popup_annotation_note', className: 'e-pv-annotation-popup-menu', styles: 'display:none' });
        let headerElement: HTMLElement = createElement('div', { id: elementId + '_popup_header', className: 'e-pv-annotation-popup-header' });
        // tslint:disable-next-line:max-line-length
        this.authorPopupElement = createElement('div', { id: elementId + '_popup_author', className: 'e-pv-annotation-popup-author' });
        headerElement.appendChild(this.authorPopupElement);
        // tslint:disable-next-line:max-line-length
        let closeBtn: HTMLElement = createElement('span', { id: elementId + '_popup_close', className: 'e-pv-annotation-popup-close e-pv-icon' });
        headerElement.appendChild(closeBtn);
        this.popupElement.appendChild(headerElement);
        // tslint:disable-next-line:max-line-length
        this.modifiedDateElement = createElement('div', { id: elementId + '_popup_modified_time', className: 'e-pv-annotation-modified-time' });
        this.popupElement.appendChild(this.modifiedDateElement);
        // tslint:disable-next-line:max-line-length
        let contentContainer: HTMLElement = createElement('div', { id: elementId + '_popup_content_container', className: 'e-pv-annotation-popup-note-container' });
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
        this.noteContentElement.addEventListener('mousedown', () => { this.noteContentElement.focus(); });
    }

    // tslint:disable-next-line
    private onPopupElementMoveStart(event: any): void {
        if (event.type === 'touchstart') {
            event = event.changedTouches[0];
        }
        if ((event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            this.isPopupMenuMoved = true;
            let popupElementClientRect: ClientRect = this.popupElement.getBoundingClientRect();
            this.clientX = event.clientX - popupElementClientRect.left;
            // tslint:disable-next-line:max-line-length
            this.clientY = (event.clientY - popupElementClientRect.top) + (this.pdfViewerBase.pageSize[this.currentAnnotPageNumber].top * this.pdfViewerBase.getZoomFactor());
        }
    }

    // tslint:disable-next-line
    private onPopupElementMove(event: any): void {
        if (event.type === 'touchmove') {
            event = event.changedTouches[0];
        }
        // tslint:disable-next-line:max-line-length
        if (this.isPopupMenuMoved && (event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            let left: number = (event.clientX - this.clientX) + parseFloat(this.popupElement.style.left);
            let top: number = ((event.clientY - this.clientY) + parseFloat(this.popupElement.style.top));
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            let clientPosition: ClientRect = this.popupElement.getBoundingClientRect();
            let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
            // tslint:disable-next-line:max-line-length
            if (left > parseFloat(pageDiv.style.left) && (left + clientPosition.width) < (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                this.popupElement.style.left = (left) + 'px';
            } else {
                this.popupElement.style.left = parseFloat(this.popupElement.style.left) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            if (top > parseFloat(pageDiv.style.top) && (top + clientPosition.height) < (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
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
     */
    public closePopupMenu(): void {
        if (this.popupElement) {
            this.popupElement.parentElement.removeChild(this.popupElement);
            this.popupElement = null;
            this.isPopupNoteVisible = false;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public showAnnotationPopup(event: any): void {
        if (this.textMarkupAnnotationModule) {
            this.currentAnnotPageNumber = this.getEventPageNumber(event);
            // tslint:disable-next-line:max-line-length
            if (this.textMarkupAnnotationModule && (event.target !== (this.noteContentElement) || (event.target.contains(this.noteContentElement.childNodes[0])))) {
                this.hidePopupNote();
                if (!this.popupElement) {
                    this.createTextMarkupPopup();
                    this.popupElement.style.display = 'block';
                    this.authorPopupElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.author;
                    // tslint:disable-next-line:max-line-length
                    this.modifiedDateElement.textContent = this.getProperDate(this.textMarkupAnnotationModule.currentTextMarkupAnnotation.modifiedDate);
                    this.noteContentElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.note;
                    let clientPosition: ClientRect = this.popupElement.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
                    let canvasPosition: ClientRect = pageDiv.getBoundingClientRect();
                    let topPosition: number = ((event.clientY) - canvasPosition.top) + parseFloat(pageDiv.style.top);
                    let leftPosition: number = (event.clientX);
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
     * @private
     */
    public modifyOpacity(args: ChangeEventArgs): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let opacityValue: number = args.value / 100;
        redoClonedObject.opacity = opacityValue;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: opacityValue });
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature') {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, true, false, clonedObject.opacity, redoClonedObject.opacity );
        } else {
            this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
        if (currentAnnotation.shapeAnnotationType === 'StickyNotes') {
            this.stickyNotesAnnotationModule.updateOpacityValue(currentAnnotation);
        } else {
            this.modifyInCollections(currentAnnotation, 'opacity');
        }
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyFontColor(currentColor: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontColor = currentColor;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { fontColor: currentColor });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontColor', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'fontColor');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyFontFamily(currentValue: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontFamily = currentValue;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { fontFamily: currentValue });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontFamily', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'fontFamily');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyFontSize(currentValue: number): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontSize = currentValue;
        let freeTextAnnotation: FreeTextAnnotation = this.freeTextAnnotationModule;
        let x: number = currentAnnotation.bounds.x;
        let y: number = currentAnnotation.bounds.y;
        currentAnnotation.fontSize = currentValue;
        freeTextAnnotation.addInuptElemet({x: x, y: y}, currentAnnotation);
        if (currentAnnotation) {
            if (currentAnnotation.previousFontSize > currentValue) {
                freeTextAnnotation.inputBoxElement.style.height = 'auto';
                freeTextAnnotation.inputBoxElement.style.height = freeTextAnnotation.inputBoxElement.scrollHeight + 5 + 'px';
            }
            let inputEleHeight: number = parseFloat(freeTextAnnotation.inputBoxElement.style.height);
            let inputEleWidth: number = parseFloat(freeTextAnnotation.inputBoxElement.style.width);
            let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
            inputEleWidth = ((inputEleWidth - 1) / zoomFactor);
            inputEleHeight = ((inputEleHeight - 1) / zoomFactor);
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
            currentAnnotation.bounds.width = inputEleWidth;
            currentAnnotation.bounds.height = inputEleHeight;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.nodePropertyChange(currentAnnotation, { fontSize: currentValue, bounds: {width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height, y: y}});
            this.pdfViewer.renderSelector(currentAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
            currentAnnotation.previousFontSize = currentValue;
        }
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontSize', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'fontSize');
        this.modifyInCollections(currentAnnotation, 'bounds');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyTextAlignment(currentValue: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.textAlign = currentValue;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { textAlign: currentValue });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'textAlign', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'textAlign');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyTextProperties(fontInfo: PdfFontModel, action: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        if (action === 'bold') {
            redoClonedObject.font.isBold = fontInfo.isBold;
        } else if (action === 'italic') {
            redoClonedObject.font.isItalic = fontInfo.isItalic;
        } else if (action === 'underline') {
            redoClonedObject.font.isUnderline = fontInfo.isUnderline;
        } else if (action === 'strikeout') {
            redoClonedObject.font.isStrikeout = fontInfo.isStrikeout;
        }
        this.pdfViewer.nodePropertyChange(currentAnnotation, { font: fontInfo });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'textPropertiesChange', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'textPropertiesChange');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyThickness(thicknessValue: number): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.thickness = thicknessValue;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: thicknessValue });
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature') {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, false, true, clonedObject.thickness, redoClonedObject.thickness );
        } else {
            this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'thickness');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyStrokeColor(color: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.strokeColor = color;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: color });
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature') {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, true, false, false, clonedObject.strokeColor, redoClonedObject.strokeColor );
        } else {
            this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'stroke');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyFillColor(color: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fillColor = color;
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], { fillColor: color });
        this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'fill');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyDynamicTextValue(dynamicText: string, annotName: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = null;
        currentAnnotation = this.pdfViewer.selectedItems.annotations.filter((s: PdfAnnotationBaseModel) => s.annotName === annotName)[0];
        if (currentAnnotation) {
            let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            currentAnnotation.dynamicText = dynamicText;
            redoClonedObject.dynamicText = dynamicText;
            this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], { dynamicText: dynamicText });
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'dynamicText Change', '', clonedObject, redoClonedObject);
            this.modifyInCollections(currentAnnotation, 'dynamicText');
            this.pdfViewer.renderDrawing();
        }
    }

    // tslint:disable-next-line
    private modifyInCollections(annotationBase: PdfAnnotationBaseModel, property: string): any {
        // tslint:disable-next-line
        let returnObj: any;
        if (annotationBase.measureType === '' || isNullOrUndefined(annotationBase.measureType)) {
            if (annotationBase.shapeAnnotationType === 'FreeText') {
                returnObj = this.freeTextAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'HandWrittenSignature') {
                // tslint:disable-next-line:max-line-length
                returnObj = this.pdfViewerBase.signatureModule.modifySignatureCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'Stamp') {
                returnObj = this.stampAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
            } else {
                returnObj = this.shapeAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
            }
        } else if (annotationBase.measureType === 'Distance' || annotationBase.measureType === 'Perimeter' ||
            annotationBase.measureType === 'Radius' || annotationBase.measureType === 'Area' || annotationBase.measureType === 'Volume') {
            returnObj = this.measureAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
        }
        if (this.isUndoRedoAction) {
            this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, null, true);
            if (this.isUndoAction) {
                annotationBase.modifiedDate = new Date().toLocaleString();
            }
        } else {
            if (property !== 'bounds') {
                this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase);
            }
        }
        return returnObj;
    }

    /**
     * @private
     */
    public createPropertiesWindow(): void {
        let elementID: string = this.pdfViewer.element.id;
        let dialogDiv: HTMLElement = createElement('div', { id: elementID + '_properties_window', className: 'e-pv-properties-window' });
        let appearanceTab: HTMLElement = this.createAppearanceTab();
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        this.propertiesDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Line Properties'),
            target: this.pdfViewer.element, content: appearanceTab, close: () => {
                this.destroyPropertiesWindow();
            }
        });
        if (!Browser.isDevice) {
            this.propertiesDialog.buttons = [
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) }
            ];
        } else {
            this.propertiesDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.propertiesDialog.enableRtl = true;
        }
        this.propertiesDialog.appendTo(dialogDiv);
        // tslint:disable-next-line:max-line-length
        this.startArrowDropDown.content = this.createContent(this.getArrowString(this.pdfViewer.selectedItems.annotations[0].sourceDecoraterShapes)).outerHTML;
        this.endArrowDropDown.content = this.createContent(this.getArrowString(this.pdfViewer.selectedItems.annotations[0].taregetDecoraterShapes)).outerHTML;
        this.thicknessBox.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
        this.fillColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
        this.refreshColorPicker(this.fillColorPicker);
        this.strokeColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        this.refreshColorPicker(this.strokeColorPicker);
        this.updateColorInIcon(this.fillDropDown.element, this.fillColorPicker.value);
        this.updateColorInIcon(this.strokeDropDown.element, this.strokeColorPicker.value);
        this.opacitySlider.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
        this.updateOpacityIndicator();
        // tslint:disable-next-line
        if (parseInt(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray) >= 3) {
            this.lineStyleDropDown.content = this.createDropDownContent('dashed').outerHTML;
        } else if (this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray === '2') {
            this.lineStyleDropDown.content = this.createDropDownContent('dotted').outerHTML;
        } else if (this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray === '0') {
            this.lineStyleDropDown.content = this.createDropDownContent('solid').outerHTML;
        }
        this.selectedLineStyle = this.pdfViewer.selectedItems.annotations[0].borderStyle;
        this.selectedLineDashArray = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray;
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            this.leaderLengthBox.value = this.pdfViewer.selectedItems.annotations[0].leaderHeight;
        }
    }

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
        let dialogElement: HTMLElement = this.pdfViewerBase.getElement('_properties_window');
        if (dialogElement) {
            dialogElement.parentElement.removeChild(dialogElement);
        }
    }

    private refreshColorPicker(colorPick: ColorPicker): void {
        colorPick.setProperties({ 'value': colorPick.value }, true);
        colorPick.refresh();
    }

    private createAppearanceTab(): HTMLElement {
        let elementID: string = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        let items: { [key: string]: Object }[] = [{ text: this.pdfViewer.localeObj.getConstant('None') }, { text: this.pdfViewer.localeObj.getConstant('Open Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Closed Arrow') },
        { text: this.pdfViewer.localeObj.getConstant('Round Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Square Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Diamond Arrow') }];
        // tslint:disable-next-line:max-line-length
        let appearanceDiv: HTMLElement = createElement('div', { id: elementID + '_properties_appearance' });
        let lineStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-line-style-prop' });
        appearanceDiv.appendChild(lineStyleContainer);
        // tslint:disable-next-line:max-line-length
        let lineHeadStartElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Start Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-start', elementID + '_properties_line_start');
        // tslint:disable-next-line:max-line-length
        this.startArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-start', select: this.onStartArrowHeadStyleSelect.bind(this) }, (lineHeadStartElement as HTMLButtonElement));
        let lineHeadEndElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('End Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-end', elementID + '_properties_line_end');
        // tslint:disable-next-line:max-line-length
        let borderStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-border-style' });
        appearanceDiv.appendChild(borderStyleContainer);
        // tslint:disable-next-line:max-line-length
        this.endArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-end', select: this.onEndArrowHeadStyleSelect.bind(this) }, (lineHeadEndElement as HTMLButtonElement));
        let lineStyleElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Style'), borderStyleContainer, 'text', 'button', true, 'e-pv-properties-line-style', elementID + '_properties_line_style');
        let dropDownTarget: HTMLElement = this.createStyleList();
        // tslint:disable-next-line:max-line-length
        this.lineStyleDropDown = new DropDownButton({ cssClass: 'e-pv-properties-line-style', target: dropDownTarget }, (lineStyleElement as HTMLButtonElement));
        // tslint:disable-next-line:max-line-length
        let thicknessElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Thickness'), borderStyleContainer, 'text', 'input', true, 'e-pv-properties-line-thickness', elementID + '_properties_thickness');
        this.thicknessBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-thickness', min: 0, max: 12 }, (thicknessElement as HTMLInputElement));
        let colorStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-color-style' });
        appearanceDiv.appendChild(colorStyleContainer);
        // tslint:disable-next-line:max-line-length
        let fillColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Fill Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-fill-color', elementID + '_properties_fill_color');
        this.fillColorPicker = this.createColorPicker(elementID + '_properties_fill_color', true);
        this.fillColorPicker.change = (args: ColorPickerEventArgs) => {
            let currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.fillDropDown.toggle();
            this.updateColorInIcon(this.fillDropDown.element, currentColor);
        };
        // tslint:disable-next-line:max-line-length
        this.fillDropDown = this.createDropDownButton(fillColorElement, 'e-pv-properties-fill-color-icon', this.fillColorPicker.element.parentElement);
        this.fillDropDown.beforeOpen = this.onFillDropDownBeforeOpen.bind(this);
        this.fillDropDown.open = () => { this.fillColorPicker.refresh(); };
        // tslint:disable-next-line:max-line-length
        let strokeColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-stroke-color', elementID + '_properties_stroke_color');
        this.strokeColorPicker = this.createColorPicker(elementID + '_properties_stroke_color', false);
        this.strokeColorPicker.change = (args: ColorPickerEventArgs) => {
            let currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.strokeDropDown.toggle();
            this.updateColorInIcon(this.strokeDropDown.element, currentColor);
        };
        // tslint:disable-next-line:max-line-length
        this.strokeDropDown = this.createDropDownButton(strokeColorElement, 'e-pv-properties-stroke-color-icon', this.strokeColorPicker.element.parentElement);
        this.strokeDropDown.beforeOpen = this.onStrokeDropDownBeforeOpen.bind(this);
        this.strokeDropDown.open = () => { this.strokeColorPicker.refresh(); };
        let opacityContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-opacity-style' });
        appearanceDiv.appendChild(opacityContainer);
        // tslint:disable-next-line:max-line-length
        let opacityElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Opacity'), opacityContainer, '', 'div', true, 'e-pv-properties-line-opacity', elementID + '_properties_opacity');
        this.opacitySlider = new Slider({ type: 'MinRange', max: 100, min: 0, cssClass: 'e-pv-properties-line-opacity', change: () => { this.updateOpacityIndicator(); } }, opacityElement);
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            // tslint:disable-next-line:max-line-length
            let lineLengthElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Leader Length'), opacityContainer, 'text', 'input', true, 'e-pv-properties-line-leader-length', elementID + '_properties_leader_length');
            this.leaderLengthBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-leader-length', min: 0, max: 100 }, (lineLengthElement as HTMLInputElement));
        }
        return appearanceDiv;
    }

    private createContent(text: string): HTMLElement {
        let divElement: HTMLElement = createElement('div', { className: 'e-pv-properties-line-style-content' });
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
        let ulElement: HTMLElement = createElement('ul');
        document.body.appendChild(ulElement);
        let solidLi: HTMLElement = this.createListForStyle('solid');
        solidLi.addEventListener('click', () => { this.setThickness('0', 'solid'); });
        ulElement.appendChild(solidLi);
        let dottedLi: HTMLElement = this.createListForStyle('dotted');
        dottedLi.addEventListener('click', () => { this.setThickness('2', 'dotted'); });
        ulElement.appendChild(dottedLi);
        let dashedLi: HTMLElement = this.createListForStyle('dashed');
        dashedLi.addEventListener('click', () => { this.setThickness('3', 'dashed'); });
        ulElement.appendChild(dashedLi);
        return ulElement;
    }

    private createColorPicker(idString: string, isNoColor: boolean): ColorPicker {
        let inputElement: HTMLElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        let colorPicker: ColorPicker = new ColorPicker({
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
        // tslint:disable-next-line:max-line-length
        let dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        return dropDownButton;
    }

    private updateColorInIcon(element: HTMLElement, color: string): void {
        (element.childNodes[0] as HTMLElement).style.borderBottomColor = color;
    }

    private setThickness(value: string, style: string): void {
        this.lineStyleDropDown.content = this.createDropDownContent(style).outerHTML;
        this.selectedLineDashArray = value;
        if (value === '0') {
            this.selectedLineStyle = 'Solid';
        } else if (value === '2' || value === '3') {
            this.selectedLineStyle = 'Dashed';
        }
    }

    private createDropDownContent(style: string): HTMLElement {
        let divElement: HTMLElement = createElement('div', { className: 'e-pv-line-styles-content-container' });
        // tslint:disable-next-line:max-line-length
        let spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-content', styles: 'border-bottom-style:' + style });
        divElement.appendChild(spanElement);
        return divElement;
    }

    private createListForStyle(style: string): HTMLElement {
        let liElement: HTMLElement = createElement('li', { className: 'e-menu-item' });
        let divElement: HTMLElement = createElement('div', { className: 'e-pv-line-styles-container' });
        // tslint:disable-next-line:max-line-length
        let spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-item', styles: 'border-bottom-style:' + style });
        divElement.appendChild(spanElement);
        liElement.appendChild(divElement);
        return liElement;
    }

    private onStartArrowHeadStyleSelect(args: MenuEventArgs): void {
        this.startArrowDropDown.content = this.createContent(args.item.text).outerHTML;
    }

    private onEndArrowHeadStyleSelect(args: MenuEventArgs): void {
        this.endArrowDropDown.content = this.createContent(args.item.text).outerHTML;
    }

    // tslint:disable-next-line:max-line-length
    private createInputElement(labelText: string, parentElement: HTMLElement, inputType: string, input: string, isLabelNeeded: boolean, className: string, idString: string): HTMLElement {
        let container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        if (isLabelNeeded) {
            let label: HTMLElement = createElement('div', { id: idString + '_label', className: className + '-label' });
            label.textContent = labelText;
            container.appendChild(label);
        }
        if (this.pdfViewer.localeObj.getConstant('Opacity') === labelText) {
            this.opacityIndicator = createElement('span', { className: 'e-pv-properties-opacity-indicator' });
            container.appendChild(this.opacityIndicator);
        }
        let textBoxInput: HTMLElement = createElement(input, { id: idString });
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

    private onOkClicked(): void {
        let startArrow: DecoratorShapes = this.getArrowTypeFromDropDown(this.startArrowDropDown.content);
        let endArrow: DecoratorShapes = this.getArrowTypeFromDropDown(this.endArrowDropDown.content);
        let thickness: number = this.thicknessBox.value;
        let strokeColor: string = this.strokeColorPicker.getValue(this.strokeColorPicker.value, 'hex');
        strokeColor = (strokeColor === '') ? '#ffffff00' : strokeColor;
        let fillColor: string = this.fillColorPicker.getValue(this.fillColorPicker.value, 'hex');
        fillColor = (fillColor === '' || this.fillColorPicker.value === '#ffffff00') ? '#ffffff00' : fillColor;
        let opacity: number = (this.opacitySlider.value as number) / 100;
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let newNode: PdfAnnotationBaseModel = {};
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
        if (this.selectedLineDashArray !== currentAnnotation.wrapper.children[0].style.strokeDashArray) {
            newNode.borderDashArray = this.selectedLineDashArray;
            newNode.borderStyle = this.selectedLineStyle;
            redoClonedObject.borderDashArray = newNode.borderDashArray;
            redoClonedObject.borderStyle = newNode.borderStyle;
            isBorderDashArrayChanged = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance' && this.leaderLengthBox.value !== this.pdfViewer.selectedItems.annotations[0].leaderHeight) {
            newNode.leaderHeight = this.leaderLengthBox.value;
        }
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], newNode);
        // tslint:disable-next-line:max-line-length
        this.triggerAnnotationPropChange(this.pdfViewer.selectedItems.annotations[0], isColorChanged, isStrokeColorChanged, isThicknessChanged, isOpacityChanged, isLineHeadStartStyleChanged, isLineHeadEndStyleChanged, isBorderDashArrayChanged);
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'thickness');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'stroke');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'fill');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'opacity');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'dashArray');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'startArrow');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'endArrow');
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'leaderLength');
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Line properties change', '', clonedObject, redoClonedObject);
        this.renderAnnotations(currentAnnotation.pageIndex, null, null, null);
        this.propertiesDialog.hide();
    }

    private onCancelClicked(): void {
        this.propertiesDialog.hide();
    }

    private getArrowTypeFromDropDown(arrowType: string): DecoratorShapes {
        arrowType = arrowType.split('</div>')[0].split('">')[1];
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
        }
        return arrow;
    }

    /**
     * @private
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
        }
        return arrowType;
    }

    /**
     * @private
     */
    public onAnnotationMouseUp(): void {
        if (this.pdfViewer.selectedItems.annotations.length !== 0) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                this.enableBasedOnType();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
                this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
            }
            this.pdfViewerBase.disableTextSelectionMode();
        } else {
            if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isPanMode) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule && !Browser.isDevice) {
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.annotation.freeTextAnnotationModule && !this.pdfViewer.annotation.freeTextAnnotationModule.isInuptBoxInFocus) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
                    this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(false);
                }
                this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(false);
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public onShapesMouseup(pdfAnnotationBase: PdfAnnotationBaseModel, event: any): void {
        // tslint:disable-next-line:max-line-length
        pdfAnnotationBase = isNullOrUndefined(pdfAnnotationBase) ? this.pdfViewer.selectedItems.annotations[0] : pdfAnnotationBase;
        if (pdfAnnotationBase) {
            // tslint:disable-next-line:max-line-length
            if ((this.pdfViewerBase.tool instanceof NodeDrawingTool || this.pdfViewerBase.tool instanceof LineTool) && !this.pdfViewerBase.tool.dragging) {
                // tslint:disable-next-line
                let setting: any = {
                    opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
                    thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
                    modifiedDate: pdfAnnotationBase.modifiedDate
                };
                let index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
                // tslint:disable-next-line
                let bounds: any = { left: pdfAnnotationBase.bounds.x, top: pdfAnnotationBase.bounds.y, width: pdfAnnotationBase.bounds.width, height: pdfAnnotationBase.bounds.height };
                if (this.pdfViewerBase.tool instanceof LineTool) {
                    setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
                    setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
                    setting.borderDashArray = pdfAnnotationBase.borderDashArray;
                }
                if (!this.pdfViewerBase.isAnnotationAdded) {
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        // tslint:disable-next-line:max-line-length
                        this.shapeAnnotationModule.renderShapeAnnotations(pdfAnnotationBase, this.pdfViewer.annotation.getEventPageNumber(event));
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' ||
                        pdfAnnotationBase.measureType === 'Radius') {
                        // tslint:disable-next-line:max-line-length
                        this.measureAnnotationModule.renderMeasureShapeAnnotations(pdfAnnotationBase, this.pdfViewer.annotation.getEventPageNumber(event));
                    }
                }
                this.pdfViewerBase.isDocumentEdited = true;
            } else if (this.pdfViewerBase.tool instanceof MoveTool || this.pdfViewerBase.tool instanceof ResizeTool) {
                this.pdfViewerBase.isDocumentEdited = true;
                if (this.pdfViewerBase.tool instanceof ResizeTool) {
                    this.triggerAnnotationResize(pdfAnnotationBase);
                }
                if (this.pdfViewerBase.tool instanceof MoveTool) {
                    if (this.pdfViewerBase.action !== 'Select') {
                        this.triggerAnnotationMove(pdfAnnotationBase);
                    }
                }
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    if (pdfAnnotationBase.shapeAnnotationType === 'FreeText') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.freeTextAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    } else if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.signatureModule.modifySignatureCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    } else {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    // tslint:disable-next-line:max-line-length
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Radius' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                    this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                }
            } else if (this.pdfViewerBase.tool instanceof ConnectTool) {
                this.pdfViewerBase.isDocumentEdited = true;
                this.triggerAnnotationResize(pdfAnnotationBase);
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    // tslint:disable-next-line:max-line-length
                    if ((pdfAnnotationBase.shapeAnnotationType === 'Line' || pdfAnnotationBase.shapeAnnotationType === 'LineWidthArrowHead' || pdfAnnotationBase.shapeAnnotationType === 'Polygon')) {
                        this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // tslint:disable-next-line:max-line-length
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                    if (pdfAnnotationBase.measureType === 'Distance') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('leaderLength', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable && pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature') {
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
            }
            if (this.pdfViewer.toolbarModule) {
                if (this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.clearTextMarkupMode();
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearMeasureMode();
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume' || pdfAnnotationBase.measureType === 'Radius') {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearShapeMode();
                    }
                    this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationPropertiesTools(true);
                    this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(true);
                    this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                    this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                    this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                }
            }
        }
    }

    /**
     * @private
     */
    public updateCalibrateValues(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        if (pdfAnnotationBase.measureType === 'Distance') {
            pdfAnnotationBase.notes = updateDistanceLabel(pdfAnnotationBase, pdfAnnotationBase.vertexPoints, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Radius') {
            pdfAnnotationBase.notes = updateRadiusLabel(pdfAnnotationBase, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Perimeter') {
            pdfAnnotationBase.notes = updatePerimeterLabel(pdfAnnotationBase, pdfAnnotationBase.vertexPoints, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Area') {
            // tslint:disable-next-line:max-line-length
            pdfAnnotationBase.notes = this.measureAnnotationModule.calculateArea(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
                updateCalibrateLabel(pdfAnnotationBase);
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Volume') {
            // tslint:disable-next-line:max-line-length
            pdfAnnotationBase.notes = this.measureAnnotationModule.calculateVolume(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
                updateCalibrateLabel(pdfAnnotationBase);
            }
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        }
    }

    /**
     * @private
     */
    public onAnnotationMouseDown(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                this.enableBasedOnType();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
            }
        }
    }

    private enableBasedOnType(): void {
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp' ||
            this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image') {
            this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
            this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Path') {
            if (Browser.isDevice) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.createMobileAnnotationToolbar(true, true);
            } else {
                this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
            }
        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
            this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(true);
        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
            this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
        } else {
            this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(true);
        }
    }

    private getProperDate(date: string): string {
        let dateObject: Date = new Date(date.toString());
        if (isNaN(dateObject.getFullYear())) {
            let dateString: string = date.slice(2, 16);
            // tslint:disable-next-line:max-line-length
            dateString = dateString.slice(0, 4) + '/' + dateString.slice(4, 6) + '/' + dateString.slice(6, 8) + ' ' + dateString.slice(8, 10) + ':' + dateString.slice(10, 12) + ':' + dateString.slice(12, 14);
            dateObject = new Date(dateString);
        }
        // tslint:disable-next-line:max-line-length
        return (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    }

    /**
     * @private
     */
    public getPageCollection(pageAnnotations: IPageAnnotations[], pageNumber: number): number {
        let index: number = null;
        for (let i: number = 0; i < pageAnnotations.length; i++) {
            if (pageAnnotations[i].pageIndex === pageNumber) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getAnnotationWithId(annotations: any[], id: string): any {
        // tslint:disable-next-line
        let annotation: any;
        for (let i: number = 0; i < annotations.length; i++) {
            if (id === annotations[i].id) {
                annotation = annotations[i];
            }
        }
        return annotation;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getEventPageNumber(event: any): number {
        let eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.classList.contains('e-pv-hyperlink')) {
            eventTarget = eventTarget.parentElement;
        }
        // tslint:disable-next-line
        let pageString: any = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
        if (isNaN(pageString)) {
            event = this.pdfViewerBase.annotationEvent;
            if (event) {
                eventTarget = event.target as HTMLElement;
                // tslint:disable-next-line
                pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
            }
        }
        // tslint:disable-next-line
        return parseInt(pageString);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getAnnotationComments(commentsAnnotations: any, parentAnnotation: any, author: string): any {
        let newArray: ICommentsCollection[] = [];
        let annotationObject: ICommentsCollection = null;
        if (commentsAnnotations) {
            if (commentsAnnotations.length > 0) {
                for (let i: number = 0; i < commentsAnnotations.length; i++) {
                    // tslint:disable-next-line
                    let annotation: any = commentsAnnotations[i];
                    annotationObject = {
                        // tslint:disable-next-line:max-line-length
                        shapeAnnotationType: 'sticky', author: annotation.Author, modifiedDate: annotation.ModifiedDate, note: annotation.Note, state: annotation.state, stateModel: annotation.stateModel,
                        comments: [], review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                        annotName: annotation.AnnotName, parentId: parentAnnotation.AnnotName, subject: 'Comments'
                    };
                    newArray[newArray.length] = annotationObject;
                }
            }
        }
        return newArray;
    }

    private getRandomNumber(): string {
        // tslint:disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any): string {
            // tslint:disable-next-line
            let random: any = Math.random() * 16 | 0, v = c == 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    }

    /**
     * @private
     */
    public createGUID(): string {
        // tslint:disable-next-line:max-line-length
        return this.getRandomNumber();
    }

    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public createAnnotationLayer(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number, displayMode: string): HTMLElement {
        // tslint:disable-next-line:max-line-length
        let annotationCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' }) as HTMLCanvasElement;
        annotationCanvas.width = pageWidth;
        annotationCanvas.height = pageHeight;
        annotationCanvas.style.display = displayMode;
        this.pdfViewerBase.applyElementStyles(annotationCanvas, pageNumber);
        pageDiv.appendChild(annotationCanvas);
        return annotationCanvas;
    }

    /**
     * @private
     */
    public resizeAnnotations(width: number, height: number, pageNumber: number): void {
        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
        }
    }

    /**
     * @private
     */
    public clearAnnotationCanvas(pageNumber: number): void {
        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            (canvas as HTMLCanvasElement).width = this.pdfViewerBase.pageSize[pageNumber].width * this.pdfViewerBase.getZoomFactor();
            (canvas as HTMLCanvasElement).height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor();
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public renderAnnotations(pageNumber: number, shapeAnnotation: any, measureShapeAnnotation: any, textMarkupAnnotation: any, canvas?: any, isImportAnnotations?: boolean): void {
        this.clearAnnotationCanvas(pageNumber);
        if (this.shapeAnnotationModule) {
            if (isImportAnnotations) {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber, true);
            } else {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber);
            }
        }
        if (this.measureAnnotationModule) {
            if (isImportAnnotations) {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber, true);
            } else {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber);
            }
        }
        if (canvas !== null && canvas !== undefined) {
            canvas = canvas;
        } else {
            canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        }
        this.pdfViewer.drawing.refreshCanvasDiagramLayer(canvas as HTMLCanvasElement, pageNumber);
        if (this.textMarkupAnnotationModule) {
            if (isImportAnnotations) {
                // tslint:disable-next-line
                this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber, true);
            } else {
                // tslint:disable-next-line
                this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber);
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public storeAnnotations(pageNumber: number, annotation: any, annotationId: string): number {
        // let annotationId: string = '_annotations_textMarkup';
        // if (annotation is ITextMarkupAnnotation) {
        //     annotationId = '_annotations_textMarkup';
        // } else if (annotation as IShapeAnnotation) {
        //     annotationId = '_annotations_shape';
        // } else {
        //     annotationId = '_annotations_stamp';
        // }
        // tslint:disable-next-line
        let sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        if (sessionSize > 4500) {
            this.clearAnnotationStorage();
            this.pdfViewerBase.isStorageExceed = true;
        }
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + annotationId);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + annotationId];
        }
        let index: number = 0;
        if (!storeObject) {
            this.storeAnnotationCollections(annotation, pageNumber);
            let pageAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            pageAnnotation.annotations.push(annotation);
            index = pageAnnotation.annotations.indexOf(annotation);
            let annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(pageAnnotation);
            let annotationStringified: string = JSON.stringify(annotationCollection);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + annotationId] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + annotationId, annotationStringified);
            }
        } else {
            this.storeAnnotationCollections(annotation, pageNumber);
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + annotationId);
            }
            let pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                (annotObject[pageIndex] as IPageAnnotations).annotations.push(annotation);
                index = (annotObject[pageIndex] as IPageAnnotations).annotations.indexOf(annotation);
            } else {
                let markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + annotationId] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + annotationId, annotationStringified);
            }
        }
        return index;
    }

    /**
     * @private
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
                // decoratorShapes = 'Butt';
                break;
            case 'Slash':
                // decoratorShapes = 'Slash';
                break;
        }
        return decoratorShapes;
    }

    /**
     * @private
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
        }
        return arrowType;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getBounds(bound: any, pageIndex: number): any {
        let pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { left: bound.top, top: pageDetails.width - (bound.left + bound.width), width: bound.height, height: bound.width };
            } else if (pageDetails.rotation === 2) {
                // tslint:disable-next-line:max-line-length
                return { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
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
     * @private
     */
    // tslint:disable-next-line
    public getVertexPoints(points: any[], pageIndex: number): any {
        if (points) {
            let pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
            if (pageDetails.rotation === 1) {
                let points1: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    let point: PointModel = { x: points[i].y, y: pageDetails.width - points[i].x };
                    points1.push(point);
                }
                return points1;
            } else if (pageDetails.rotation === 2) {
                let points2: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    let point: PointModel = { x: pageDetails.width - points[i].x, y: pageDetails.height - points[i].y };
                    points2.push(point);
                }
                return points2;
            } else if (pageDetails.rotation === 3) {
                let points3: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    let point: PointModel = { x: pageDetails.height - points[i].y, y: points[i].x };
                    points3.push(point);
                }
                return points3;
            } else {
                return points;
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getStoredAnnotations(pageIndex: number, shapeAnnotations: any[], idString: string): any[] {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + idString);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + idString];
        }
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
            } else {
                annotationCollection = null;
            }
        } else {
            annotationCollection = null;
        }
        return annotationCollection;
    }

    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public triggerAnnotationPropChange(pdfAnnotationBase: PdfAnnotationBaseModel, isColor: boolean, isStroke: boolean, isThickness: boolean, isOpacity: boolean, isLineStart?: boolean, isLineEnd?: boolean, isDashArray?: boolean): void {
        let index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
        let type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        // tslint:disable-next-line:max-line-length
        let eventArgs: AnnotationPropertiesChangeEventArgs = { name: 'annotationPropertiesChange', pageIndex: pdfAnnotationBase.pageIndex, annotationId: pdfAnnotationBase.annotName, annotationType: type, isColorChanged: isColor, isOpacityChanged: isOpacity, isThicknessChanged: isThickness, isStrokeColorChanged: isStroke };
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
     * @private
     */
    public triggerAnnotationAdd(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        // tslint:disable-next-line
        let setting: any = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        // tslint:disable-next-line
        let bounds: any = { left: pdfAnnotationBase.wrapper.bounds.x, top: pdfAnnotationBase.wrapper.bounds.y, width: pdfAnnotationBase.wrapper.bounds.width, height: pdfAnnotationBase.wrapper.bounds.height };
        let type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        let labelSettings: ShapeLabelSettingsModel;
        if (this.pdfViewer.enableShapeLabel) {
            labelSettings = {
                // tslint:disable-next-line:max-line-length
                fontColor: pdfAnnotationBase.fontColor, fontSize: pdfAnnotationBase.fontSize, fontFamily: pdfAnnotationBase.fontFamily,
                opacity: pdfAnnotationBase.labelOpacity, labelContent: pdfAnnotationBase.labelContent, fillColor: pdfAnnotationBase.labelFillColor
            };
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationAdd(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, bounds, setting, null, null, null, labelSettings);
        } else {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationAdd(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, bounds, setting);
        }
    }

    /**
     * @private
     */
    public triggerAnnotationResize(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        // tslint:disable-next-line
        let setting: any = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        let index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
        // tslint:disable-next-line
        let annotationBounds: any = pdfAnnotationBase.bounds;
        let currentPosition: object = { left: annotationBounds.x, top: annotationBounds.y, width: annotationBounds.width, height: annotationBounds.height };
        // tslint:disable-next-line:max-line-length
        let previousPosition: object = { left: annotationBounds.oldProperties.x, top: annotationBounds.oldProperties.y, width: annotationBounds.oldProperties.width, height: annotationBounds.oldProperties.height };
        let type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        let labelSettings: ShapeLabelSettingsModel;
        if (this.pdfViewer.enableShapeLabel && pdfAnnotationBase.shapeAnnotationType !== 'HandWrittenSignature') {
            labelSettings = {
                // tslint:disable-next-line:max-line-length
                fontColor: pdfAnnotationBase.fontColor, fontSize: pdfAnnotationBase.fontSize, fontFamily: pdfAnnotationBase.fontFamily,
                opacity: pdfAnnotationBase.labelOpacity, labelContent: pdfAnnotationBase.labelContent, fillColor: pdfAnnotationBase.labelFillColor, notes: pdfAnnotationBase.notes
            };
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, currentPosition, setting, null, null, null, labelSettings);
        } else {
            if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature') {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireSignatureResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.signatureName, pdfAnnotationBase.shapeAnnotationType as AnnotationType, pdfAnnotationBase.opacity, pdfAnnotationBase.strokeColor, pdfAnnotationBase.thickness, currentPosition, previousPosition);
            } else {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireAnnotationResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, currentPosition, setting);
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public triggerAnnotationMove(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        // tslint:disable-next-line
        let setting: any = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        // tslint:disable-next-line
        let annotationBounds: any = pdfAnnotationBase.bounds;
        let currentPosition: object = { left: annotationBounds.x, top: annotationBounds.y, width: annotationBounds.width, height: annotationBounds.height };
        // tslint:disable-next-line:max-line-length
        let previousPosition: object = { left: annotationBounds.oldProperties.x, top: annotationBounds.oldProperties.y, width: annotationBounds.width, height: annotationBounds.height };
        let type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature') {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireSignatureMove(pdfAnnotationBase.pageIndex, pdfAnnotationBase.signatureName, pdfAnnotationBase.shapeAnnotationType as AnnotationType, pdfAnnotationBase.opacity, pdfAnnotationBase.strokeColor, pdfAnnotationBase.thickness, previousPosition, currentPosition);
        } else {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationMove(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, setting, previousPosition, currentPosition);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public annotationSelect(annotationId: any, pageNumber: number, annotation: any, annotationCollection?: any, isDblClick?: boolean, isSelected?: boolean): void {
        // tslint:disable-next-line
        let annotSettings: any;
        if (annotation.shapeAnnotationType === 'textMarkup') {
            // tslint:disable-next-line:max-line-length
            annotSettings = { type: 'TextMarkup', subType: annotation.subject, opacity: annotation.opacity, color: annotation.color, textMarkupContent: annotation.textMarkupContent, textMarkupStartIndex: annotation.textMarkupStartIndex, textMarkupEndIndex: annotation.textMarkupEndIndex };
        } else if (annotation.shapeAnnotationType === 'StickyNotes') {
            annotSettings = { type: 'StickyNotes', opacity: annotation.opacity };
        } else if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
            annotSettings = { type: 'Stamp', opacity: annotation.opacity };
        } else if (annotation.shapeAnnotationType === 'FreeText') {
            annotSettings = {
                type: 'FreeText', opacity: annotation.opacity, fillColor: annotation.fillColor,
                // tslint:disable-next-line:max-line-length
                strokeColor: annotation.strokeColor, thickness: annotation.thickness, content: annotation.dynamicText,
                // tslint:disable-next-line:max-line-length
                fontFamily: annotation.fontFamily, fontSize: annotation.fontSize, fontColor: annotation.fontColor, textAlign: annotation.textAlign, fontStyle: this.updateFreeTextFontStyle(annotation.font)
            };
        } else if (annotation.measureType === '') {
            if (annotation.shapeAnnotationType === 'Line') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Shape', subType: 'Line', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Shape', subType: 'Arrow', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.shapeAnnotationType === 'Rectangle') {
                annotSettings = {
                    type: 'Shape', subType: 'Rectangle', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness
                };
            } else if (annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse') {
                annotSettings = {
                    type: 'Shape', subType: 'Circle', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness
                };
            } else if (annotation.shapeAnnotationType === 'Polygon') {
                annotSettings = {
                    type: 'Shape', subType: 'Polygon', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness
                };
            }
        } else if (annotation.measureType !== '') {
            if (annotation.measureType === 'Distance') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Measure', subType: 'Distance', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.measureType === 'Perimeter') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Measure', subType: 'Perimeter', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.measureType === 'Area') {
                annotSettings = {
                    type: 'Measure', subType: 'Area', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness
                };
            } else if (annotation.measureType === 'Radius') {
                annotSettings = {
                    type: 'Measure', subType: 'Radius', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness
                };
            } else if (annotation.measureType === 'Volume') {
                annotSettings = {
                    type: 'Measure', subType: 'Volume', opacity: annotation.opacity, fillColor: annotation.fillColor,
                    strokeColor: annotation.strokeColor, thickness: annotation.thickness, calibrate: annotation.calibrate,
                    annotationId: annotation.annotName
                };
            }
        }
        // tslint:disable-next-line
        let overlappedCollection: any = [];
        // tslint:disable-next-line
        let overlappedAnnotations: any = this.getOverlappedAnnotations(annotation, pageNumber);
        if (overlappedAnnotations) {
            // tslint:disable-next-line
            let overlappedCollections: any = [];
            // tslint:disable-next-line
            for (let i: number = 0; i < overlappedAnnotations.length; i++) {
                if (overlappedAnnotations[i].shapeAnnotationType !== 'textMarkup' && this.overlappedCollections) {
                    for (let j: number = 0; j < this.overlappedCollections.length; j++) {
                        if (overlappedAnnotations[i].annotName === this.overlappedCollections[j].annotName) {
                            overlappedCollections.push(overlappedAnnotations[i]);
                            break;
                        }
                    }
                } else {
                    overlappedCollections.push(overlappedAnnotations[i]);
                }
            }
            overlappedAnnotations = overlappedCollections;
        }
        if (this.pdfViewer.enableMultiLineOverlap) {
            // tslint:disable-next-line
            for (let i: number = 0; i < overlappedAnnotations.length; i++) {
                if (overlappedAnnotations[i].shapeAnnotationType === 'textMarkup') {
                    let isOverlapped : boolean = false;
                    for (let j: number = 0; j < overlappedAnnotations[i].bounds.length; j++) {
                        // tslint:disable-next-line
                        let bounds: any = this.orderTextMarkupBounds(overlappedAnnotations[i].bounds[j]);
                        // tslint:disable-next-line
                        let clickedPosition: any = this.textMarkupAnnotationModule.annotationClickPosition;
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
            // tslint:disable-next-line
            for (let i: number = 0; i < annotationCollection.length; i++) {
                // tslint:disable-next-line
                let overlappedObject: any = cloneObject(annotationCollection[i]);
                overlappedObject.annotationId = annotationCollection[i].annotName;
                if (annotationId === annotationCollection[i].annotName && annotation.measureType && annotation.measureType === 'Volume') {
                    annotSettings.calibrate = annotationCollection[i].calibrate;
                }
                delete overlappedObject.annotName;
                overlappedCollection.push(overlappedObject);
            }
        } else {
            overlappedCollection = null;
        }
        this.addFreeTextProperties(annotation, annotSettings);
        let annotationAddMode: string = annotation.annotationAddMode;
        if (!isDblClick) {
            if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
                if (!this.pdfViewerBase.isNewStamp) {
                    if (overlappedCollection) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, overlappedCollection, null, null, annotationAddMode);
                    } else {
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, null, null, null, annotationAddMode);
                    }
                }
            } else {
                let multiPageCollection: ITextMarkupAnnotation[] = this.textMarkupAnnotationModule.multiPageCollectionList(annotation);
                if (multiPageCollection.length === 0) {
                    multiPageCollection = null;
                }
                if (overlappedCollection) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, overlappedCollection, multiPageCollection, isSelected, annotationAddMode);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, null, multiPageCollection, isSelected, annotationAddMode);
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
    }

    // tslint:disable-next-line
    public selectSignature ( signatureId: string, pageNumber: number, signatureModule: any): void {
        // tslint:disable-next-line
        let annotBounds: any = signatureModule.bounds;
        // tslint:disable-next-line
        let bounds: any = { height: annotBounds.height, width: annotBounds.width, x: annotBounds.x, y: annotBounds.y};
        if (!this.pdfViewerBase.signatureAdded) {
            // tslint:disable-next-line:max-line-length
            let signature: object = { bounds: bounds, opacity: signatureModule.opacity, thickness: signatureModule.thickness, strokeColor: signatureModule.strokeColor };
            this.pdfViewer.fireSignatureSelect(signatureId, pageNumber, signature);
        }
    }

    // tslint:disable-next-line
    public editSignature(signature: any): void {
        // tslint:disable-next-line
        let currentAnnotation: any;
        if (signature.uniqueKey) {
            // tslint:disable-next-line
            currentAnnotation = (this.pdfViewer.nameTable as any)[signature.uniqueKey];
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        let pageNumber: number = currentAnnotation.pageIndex;
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature') {
            // tslint:disable-next-line
            let clonedObject: any = cloneObject(currentAnnotation);
            // tslint:disable-next-line
            let redoClonedObject: any = cloneObject(currentAnnotation);
            if (currentAnnotation.opacity !== signature.opacity) {
                redoClonedObject.opacity = signature.opacity;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: signature.opacity });
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, true, false, clonedObject.opacity, redoClonedObject.opacity);
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
            }
            if (currentAnnotation.strokeColor !== signature.strokeColor) {
                redoClonedObject.strokeColor = signature.strokeColor;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: signature.strokeColor });
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, true, false, false, clonedObject.strokeColor, redoClonedObject.strokeColor);
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
            }
            if (currentAnnotation.thickness !== signature.thickness) {
                redoClonedObject.thickness = signature.thickness;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: signature.thickness });
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, false, true, clonedObject.thickness, redoClonedObject.thickness);
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
            }
            let date: Date = new Date();
            currentAnnotation.modifiedDate = date.toLocaleString();
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.signatureModule.modifySignatureCollection(null, pageNumber, currentAnnotation, true);
        }
    }

    // tslint:disable-next-line
    public editAnnotation(annotation: any): void {
        // tslint:disable-next-line
        let currentAnnotation: any;
        let annotationId: string;
        let annotationType: string;
        let pageNumber: number;
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
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
            // tslint:disable-next-line
            currentAnnotation = (this.pdfViewer.nameTable as any)[annotation.uniqueKey];
            currentAnnotation.annotationSettings.isLock = annotation.annotationSettings.isLock;
            annotationId = currentAnnotation.annotName;
            pageNumber = currentAnnotation.pageIndex;
         }
        if (annotation.shapeAnnotationType === 'textMarkup') {
        if (! this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            // tslint:disable-next-line:max-line-length
            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.getAnnotations(annotation.pageNumber, annotation);
            for (let i: number = 0; i < currentAnnotation.length; i++) {
                if (annotation.annotationId === currentAnnotation[i].annotName) {
                    currentAnnotation = currentAnnotation[i];
                    this.textMarkupAnnotationModule.currentTextMarkupAnnotation = currentAnnotation;
                    this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = currentAnnotation.pageNumber;
                    break;
                }
            }
        }
    }
        if (currentAnnotation) {
            // tslint:disable-next-line
            let clonedObject: any = cloneObject(currentAnnotation);
            // tslint:disable-next-line
            let redoClonedObject: any = cloneObject(currentAnnotation);
            if (annotation.shapeAnnotationType === 'textMarkup') {
                annotationType = 'textMarkup';
            }
            if (annotation.type === 'TextMarkup' || annotation.shapeAnnotationType === 'textMarkup') {
                if (currentAnnotation.opacity !== annotation.opacity) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(null, annotation.opacity);
                }
                if (currentAnnotation.color !== annotation.color) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(annotation.color);
                }
                annotationType = 'textMarkup';
                // tslint:disable-next-line:max-line-length
            } else if (annotation.type === 'StickyNotes' || annotation.type === 'Stamp' || annotation.shapeAnnotationType === 'sticky' || annotation.shapeAnnotationType === 'stamp') {
                if (currentAnnotation.opacity !== annotation.opacity) {
                    redoClonedObject.opacity = annotation.opacity;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: annotation.opacity });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
                }
                if (annotation.type === 'StickyNotes' || annotation.shapeAnnotationType === 'sticky') {
                    annotationType = 'sticky';
                } else {
                    annotationType = 'stamp';
                }
                 // tslint:disable-next-line:max-line-length
            } else if (annotation.type === 'Shape' || annotation.type === 'Measure' || annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Polygon' || annotation.shapeAnnotationType === 'Polyline') {
                if (currentAnnotation.opacity !== annotation.opacity) {
                    redoClonedObject.opacity = annotation.opacity;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: annotation.opacity });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.fillColor !== annotation.fillColor) {
                    redoClonedObject.fillColor = annotation.fillColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fillColor: annotation.fillColor });
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.strokeColor !== annotation.strokeColor) {
                    redoClonedObject.strokeColor = annotation.strokeColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: annotation.strokeColor });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.thickness !== annotation.thickness) {
                    redoClonedObject.thickness = annotation.thickness;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: annotation.thickness });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
                }
                if (this.pdfViewer.enableShapeLabel && currentAnnotation.fontColor !== annotation.fontColor) {
                    redoClonedObject.fontColor = annotation.fontColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fontColor: annotation.fontColor });
                }
                // tslint:disable-next-line:max-line-length
                if (annotation.subType === 'Line' || annotation.subType === 'Arrow' || annotation.subType === 'Distance' || annotation.subType === 'Perimeter') {
                    let isSourceDecoraterShapesChanged: boolean = false;
                    let isTargetDecoraterShapesChanged: boolean = false;
                    let isBorderDashArrayChanged: boolean = false;
                    clonedObject.lineHeadStart = currentAnnotation.sourceDecoraterShapes;
                    clonedObject.lineHeadEnd = currentAnnotation.taregetDecoraterShapes;
                    redoClonedObject.lineHeadStart = annotation.lineHeadStartStyle;
                    redoClonedObject.lineHeadEnd = annotation.lineHeadEndStyle;
                    redoClonedObject.borderDashArray = annotation.borderDashArray;
                    if (currentAnnotation.taregetDecoraterShapes !== annotation.lineHeadEndStyle) {
                        isTargetDecoraterShapesChanged = true;
                    }
                    if (currentAnnotation.sourceDecoraterShapes !== annotation.lineHeadStartStyle) {
                        isSourceDecoraterShapesChanged = true;
                    }
                    if (currentAnnotation.borderDashArray !== annotation.borderDashArray) {
                        isBorderDashArrayChanged = true;
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { sourceDecoraterShapes: annotation.lineHeadStartStyle, taregetDecoraterShapes: annotation.lineHeadEndStyle, borderDashArray: annotation.borderDashArray });
                    // tslint:disable-next-line:max-line-length
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false, isSourceDecoraterShapesChanged, isTargetDecoraterShapesChanged, isBorderDashArrayChanged);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Line properties change', '', clonedObject, redoClonedObject);
                }
                // tslint:disable-next-line:max-line-length
                if (annotation.type === 'Shape' || annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Polygon') {
                    annotationType = 'shape';
                }
                // tslint:disable-next-line:max-line-length
                if (annotation.type === 'Measure' || annotation.subject === 'Distance calculation' || annotation.subject === 'Perimeter calculation' || annotation.subject === 'Radius calculation' || annotation.subject === 'Area calculation' || annotation.subject === 'Volume calculation') {
                    annotationType = 'shape_measure';
                }
                if (annotation.labelSettings && this.pdfViewer.enableShapeLabel) {
                    this.updateFreeTextProperties(currentAnnotation);
                    this.pdfViewer.nodePropertyChange(currentAnnotation, {
                        // tslint:disable-next-line:max-line-length
                        labelOpacity: annotation.labelSettings.opacity, fontColor: annotation.labelSettings.fontColor, fontSize: annotation.labelSettings.fontSize, fontFamily: annotation.labelSettings.fontFamily,
                        labelContent: annotation.labelSettings.labelContent, labelFillColor: annotation.labelSettings.fillColor
                    });
                }
                if (this.pdfViewer.enableShapeLabel && annotation.calibrate && annotation.calibrate.depth) {
                    if (this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth !== annotation.calibrate.depth) {
                        this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth = annotation.calibrate.depth;
                        // tslint:disable-next-line:max-line-length
                        currentAnnotation.notes = this.pdfViewer.annotationModule.measureAnnotationModule.calculateVolume(currentAnnotation.vertexPoints);
                        currentAnnotation.labelContent = currentAnnotation.notes;
                        if (annotation.labelSettings && annotation.labelSettings.labelContent) {
                            annotation.labelSettings.labelContent = currentAnnotation.notes;
                        }
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { labelContent: currentAnnotation.labelContent });
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addTextToComments(currentAnnotation.annotName, currentAnnotation.notes);
                    }
                }
            } else if (annotation.type === 'FreeText' || annotation.shapeAnnotationType === 'FreeText') {
                annotationType = 'freetext';
                this.pdfViewer.nodePropertyChange(currentAnnotation, {
                    // tslint:disable-next-line:max-line-length
                    opacity: annotation.opacity, fontColor: annotation.fontColor, fontSize: annotation.fontSize, fontFamily: annotation.fontFamily,
                    // tslint:disable-next-line:max-line-length
                    dynamicText: annotation.content, fillColor: annotation.fillColor, textAlign: annotation.textAlign, strokeColor: annotation.strokeColor, thickness: annotation.thickness, font: this.setFreeTextFontStyle(annotation.fontStyle)
                });
                if (annotation.content) {
                    this.updateAnnotationComments(this.pdfViewer.selectedItems.annotations[0].annotName, annotation.content);
                }
                // tslint:disable-next-line
                let newCommentDiv: any = document.getElementById(this.pdfViewer.element.id + '_commenttextbox_editor');
                // tslint:disable-next-line
                let commentObj: any = new InPlaceEditor({
                    value: annotation.content,
                });
                commentObj.appendTo(newCommentDiv);
            }
            let date: Date = new Date();
            currentAnnotation.modifiedDate = date.toLocaleString();
            if (annotation.type !== 'TextMarkup') {
                this.pdfViewer.renderDrawing();
                this.updateCollection(annotationId, pageNumber, annotation, annotationType);
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
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
        // tslint:disable-next-line
        let commentsDiv: any = document.getElementById(annotationId);
        if (commentsDiv && commentsDiv.childNodes) {
            if (commentsDiv.childNodes[0].ej2_instances) {
                commentsDiv.childNodes[0].ej2_instances[0].value = noteContent;
            } else if (commentsDiv.childNodes[0].childNodes && commentsDiv.childNodes[0].childNodes[1].ej2_instances) {
                commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].value = noteContent;
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
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
            // tslint:disable-next-line:max-line-length
            let ratioString: string = '1 ' + this.pdfViewer.measurementSettings.conversionUnit + ' = ' + this.pdfViewer.measurementSettings.scaleRatio + ' ' + this.pdfViewer.measurementSettings.displayUnit;
            this.measureAnnotationModule.updateMeasureValues(ratioString, this.pdfViewer.measurementSettings.displayUnit, this.pdfViewer.measurementSettings.conversionUnit, this.pdfViewer.measurementSettings.depth);
        }
    }

    // tslint:disable-next-line
    private updateCollection(annotationId: any, pageNumber: number, annotation: any, annotationType: string): void {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + annotationType];
        }
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            let index: number = this.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
                if (annotationCollection !== null) {
                    for (let i: number = 0; i < annotationCollection.length; i++) {
                        if (annotationCollection[i].annotName === annotationId) {
                            // tslint:disable-next-line
                            let newAnnot: any = this.modifyAnnotationProperties(annotationCollection[i], annotation, annotationType);
                            annotationCollection[i] = newAnnot;
                        }
                    }
                    if (!this.pdfViewerBase.isStorageExceed) {
                        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType);
                    }
                    if (annotObject[index]) {
                        annotObject[index].annotations = annotationCollection;
                    }
                    let annotationStringified: string = JSON.stringify(annotObject);
                    if (this.pdfViewerBase.isStorageExceed) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + annotationType] = annotationStringified;
                    } else {
                        // tslint:disable-next-line:max-line-length
                        window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType, annotationStringified);
                    }
                }
            }
        }
    }

    // tslint:disable-next-line
    private modifyAnnotationProperties(newAnnotation: any, annotation: any, annotationType: string): any {
        if (annotationType === 'textMarkup') {
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.color = annotation.color;
        } else if (annotationType === 'sticky' || annotationType === 'stamp') {
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.annotationSettings = annotation.annotationSettings;
        } else if (annotationType === 'shape' || annotationType === 'shape_measure') {
            if (annotation.subType === 'Line' || annotation.subType === 'Arrow' || annotation.subType === 'Distance' ||
                annotation.subType === 'Perimeter') {
                newAnnotation.opacity = annotation.opacity;
                newAnnotation.fillColor = annotation.fillColor;
                newAnnotation.strokeColor = annotation.strokeColor;
                newAnnotation.thickness = annotation.thickness;
                newAnnotation.borderDashArray = annotation.borderDashArray;
                newAnnotation.lineHeadStart = annotation.lineHeadStartStyle;
                newAnnotation.lineHeadEnd = annotation.lineHeadEndStyle;
                newAnnotation.annotationSettings = annotation.annotationSettings;
            } else {
                newAnnotation.opacity = annotation.opacity;
                newAnnotation.fillColor = annotation.fillColor;
                newAnnotation.strokeColor = annotation.strokeColor;
                newAnnotation.thickness = annotation.thickness;
                newAnnotation.annotationSettings = annotation.annotationSettings;
                if (annotation.calibrate) {
                    if (newAnnotation.annotName === annotation.annotationId) {
                        if (newAnnotation.calibrate.depth !== annotation.calibrate.depth) {
                            newAnnotation.calibrate.depth = annotation.calibrate.depth;
                            this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth = annotation.calibrate.depth;
                            // tslint:disable-next-line:max-line-length
                            newAnnotation.note = this.pdfViewer.annotationModule.measureAnnotationModule.calculateVolume(newAnnotation.vertexPoints);
                        }
                    }
                }
            }
            if (this.pdfViewer.enableShapeLabel && annotation.labelSettings) {
                let text: string = annotation.labelSettings.labelContent;
                newAnnotation.note = text;
                if (newAnnotation.labelContent) {
                   newAnnotation.labelContent =  text;
                }
                if (newAnnotation.labelSettings) {
                    newAnnotation.labelSettings = annotation.labelSettings;
                }
                this.updateAnnotationComments(newAnnotation.annotName, text);
            }
        } else if (annotationType === 'freetext') {
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
            newAnnotation.textAlign = annotation.textAlign;
            newAnnotation.annotationSettings = annotation.annotationSettings;
        }
        newAnnotation.customData = annotation.customData;
        let date: Date = new Date();
        newAnnotation.modifiedDate = date.toLocaleString();
        return newAnnotation;
    }

    /**
     * @private
     */
    public updateAnnotationAuthor(annotationType: string, annotationSubType?: string): string {
        let annotationAuthor: string;
        if (annotationType === 'sticky') {
            // tslint:disable-next-line:max-line-length
            annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stickyNotesSettings.author ? this.pdfViewer.stickyNotesSettings.author : 'Guest';
        } else if (annotationType === 'stamp') {
            // tslint:disable-next-line:max-line-length
            annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stampSettings.author ? this.pdfViewer.stampSettings.author : 'Guest';
        } else if (annotationType === 'shape') {
            if (annotationSubType === 'Line') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.lineSettings.author ? this.pdfViewer.lineSettings.author : 'Guest';
            } else if (annotationSubType === 'LineWidthArrowHead' || annotationSubType === 'Arrow') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.arrowSettings.author ? this.pdfViewer.arrowSettings.author : 'Guest';
            } else if (annotationSubType === 'Circle' || annotationSubType === 'Ellipse' || annotationSubType === 'Oval') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.circleSettings.author ? this.pdfViewer.circleSettings.author : 'Guest';
            } else if (annotationSubType === 'Rectangle' || annotationSubType === 'Square') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.rectangleSettings.author ? this.pdfViewer.rectangleSettings.author : 'Guest';
            } else if (annotationSubType === 'Polygon') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.polygonSettings.author ? this.pdfViewer.polygonSettings.author : 'Guest';
            }
        } else if (annotationType === 'measure') {
            if (annotationSubType === 'Distance' || annotationSubType === 'Distance calculation') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.distanceSettings.author ? this.pdfViewer.distanceSettings.author : 'Guest';
            } else if (annotationSubType === 'Perimeter' || annotationSubType === 'Perimeter calculation') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.perimeterSettings.author ? this.pdfViewer.perimeterSettings.author : 'Guest';
            } else if (annotationSubType === 'Radius' || annotationSubType === 'Radius calculation') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.radiusSettings.author ? this.pdfViewer.radiusSettings.author : 'Guest';
            } else if (annotationSubType === 'Area' || annotationSubType === 'Area calculation') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.areaSettings.author ? this.pdfViewer.areaSettings.author : 'Guest';
            } else if (annotationSubType === 'Volume' || annotationSubType === 'Volume calculation') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.volumeSettings.author ? this.pdfViewer.volumeSettings.author : 'Guest';
            }
        } else if (annotationType === 'textMarkup') {
            if (annotationSubType === 'Highlight') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.highlightSettings.author ? this.pdfViewer.highlightSettings.author : 'Guest';
            } else if (annotationSubType === 'Underline') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.underlineSettings.author ? this.pdfViewer.underlineSettings.author : 'Guest';
            } else if (annotationSubType === 'Strikethrough') {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.strikethroughSettings.author ? this.pdfViewer.strikethroughSettings.author : 'Guest';
            } else {
                // tslint:disable-next-line:max-line-length
                annotationAuthor = this.pdfViewer.annotationSettings.author;
            }
        } else if (annotationType === 'freeText') {
            // tslint:disable-next-line:max-line-length
            annotationAuthor = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.freeTextSettings.author ? this.pdfViewer.freeTextSettings.author : 'Guest';
        }
        if (!annotationAuthor) {
            // tslint:disable-next-line:max-line-length
            annotationAuthor = this.pdfViewer.annotationSettings.author;
        }
        return annotationAuthor;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public nameToHash(colour: string): string {
        // tslint:disable-next-line
            let colours: any = {
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
            'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0' };

            if (typeof colours[colour.toLowerCase()] !== 'undefined')  {
                 return colours[colour.toLowerCase()];
            }
            return '';
        }

    // tslint:disable-next-line
    private updateFreeTextFontStyle(font: any): number {
        let fontStyle: number = 0;
        if (font.isBold === 1) {
            fontStyle = 1;
        } else if (font.isItalic === 2) {
            fontStyle = 2;
        } else if (font.isUnderline === 4) {
            fontStyle = 4;
        } else if (font.isStrikeout) {
            fontStyle = 8;
        }
        return fontStyle;
    }

    // tslint:disable-next-line
    private setFreeTextFontStyle(fontStyle: number): any {
        if (fontStyle === 1) {
            return { isBold: true };
        } else if (fontStyle === 2) {
            return { isItalic: true };
        } else if (fontStyle === 4) {
            return { isUnderline: true };
        } else if (fontStyle === 8) {
            return { isStrikeout: true };
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public findAnnotationSettings(annotation: any, isSettings?: boolean): any {
        // tslint:disable-next-line
        let annotSettings: any = this.pdfViewer.annotationSettings;
        if (annotation.shapeAnnotationType === 'StickyNotes' && this.pdfViewer.stickyNotesSettings) {
            annotSettings = this.pdfViewer.stickyNotesSettings;
        } else if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
            annotSettings = this.pdfViewer.stampSettings;
            // tslint:disable-next-line:max-line-length
            if ((annotation.stampAnnotationType === 'image' || annotation.shapeAnnotationType === 'Image')) {
                annotSettings = this.pdfViewer.customStampSettings;
            }
        } else if (annotation.shapeAnnotationType === 'FreeText') {
            annotSettings = this.pdfViewer.freeTextSettings;
        } else if (annotation.measureType === '') {
            if (annotation.shapeAnnotationType === 'Line') {
                annotSettings = this.pdfViewer.lineSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead')) {
                annotSettings = this.pdfViewer.arrowSettings;
            } else if (annotation.shapeAnnotationType === 'Rectangle') {
                annotSettings = this.pdfViewer.rectangleSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse')) {
                annotSettings = this.pdfViewer.circleSettings;
            } else if (annotation.shapeAnnotationType === 'Polygon' && this.pdfViewer.polygonSettings) {
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
        if (isSettings) {
            return this.updateSettings(annotSettings);
        } else {
            return  annotSettings;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public updateAnnotationSettings(annotation: any): any {
        // tslint:disable-next-line
        let annotSettings: any = this.pdfViewer.annotationSettings;
        if (annotation.AnnotType === 'sticky') {
            annotSettings = this.pdfViewer.stickyNotesSettings;
        } else if (annotation.AnnotType === 'stamp' || annotation.AnnotType === 'image' || annotation.AnnotType === 'Image') {
            annotSettings = this.pdfViewer.stampSettings;
            // tslint:disable-next-line:max-line-length
            if ((annotation.Subject === 'image' || annotation.Subject === 'Image')) {
                annotSettings = this.pdfViewer.customStampSettings;
            }
        } else if (annotation.AnnotType === 'freeText') {
            annotSettings = this.pdfViewer.freeTextSettings;
        } else if (annotation.AnnotType === 'shape') {
            if (annotation.Subject === 'Line') {
                annotSettings = this.pdfViewer.lineSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.Subject === 'Arrow' || annotation.Subject === 'LineWidthArrowHead')) {
                annotSettings = this.pdfViewer.arrowSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.Subject === 'Rectangle' || annotation.Subject === 'Square')) {
                annotSettings = this.pdfViewer.rectangleSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.Subject === 'Circle' || annotation.Subject === 'Ellipse' || annotation.Subject === 'Oval')) {
                annotSettings = this.pdfViewer.circleSettings;
            } else if (annotation.Subject === 'Polygon') {
                annotSettings = this.pdfViewer.polygonSettings;
            }
        } else if (annotation.AnnotType === 'shape_measure') {
            // tslint:disable-next-line:max-line-length
            if ((annotation.Subject === 'Distance' || annotation.Subject === 'Distance calculation')) {
                annotSettings = this.pdfViewer.distanceSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.Subject === 'Perimeter' || annotation.Subject === 'Perimeter calculation')) {
                annotSettings = this.pdfViewer.perimeterSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.Subject === 'Area' || annotation.Subject === 'Area calculation')) {
                annotSettings = this.pdfViewer.areaSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.Subject === 'Radius' || annotation.Subject === 'Radius calculation')) {
                annotSettings = this.pdfViewer.radiusSettings;
                // tslint:disable-next-line:max-line-length
            } else if ((annotation.Subject === 'Volume' || annotation.Subject === 'Volume calculation')) {
                annotSettings = this.pdfViewer.volumeSettings;
            }
        }
        return this.updateSettings(annotSettings);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public updateSettings(annotationSettings: any): any {
        let maxHeight: number = 0;
        let maxWidth: number  = 0;
        let minHeight: number = 0;
        let minWidth: number = 0;
        let isLock: boolean = false;
        if (annotationSettings.minWidth ||  annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            maxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            maxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            minHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            minWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        }
        isLock = annotationSettings.isLock ? annotationSettings.isLock : false;
        return { minWidth: minWidth, maxWidth: maxWidth, minHeight: minHeight, maxHeight: maxHeight, isLock: isLock };
    }
    // tslint:disable-next-line
    private getOverlappedAnnotations(annotation: any, pageNumber: number): any {
        // tslint:disable-next-line
        let pageCollections: any = this.getPageShapeAnnotations(pageNumber);
        // tslint:disable-next-line
        let selectedAnnotation: any;
        for (let i: number = 0; i < pageCollections.length; i++) {
            if (annotation.annotName === pageCollections[i].annotName) {
                selectedAnnotation = pageCollections[i];
                break;
            }
        }
        // tslint:disable-next-line
        let annotationCollection: any = this.findOverlappedAnnotations(selectedAnnotation, pageCollections);
        return annotationCollection;
    }

    // tslint:disable-next-line
    private getPageShapeAnnotations(pageNumber: number): any {
        // tslint:disable-next-line
        let pageCollections: any = [];
        // tslint:disable-next-line
        let shapeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (shapeObject) {
            let shapeAnnotObject: IPageAnnotations[] = JSON.parse(shapeObject);
            if (shapeAnnotObject) {
                let index: number = this.getPageCollection(shapeAnnotObject, pageNumber);
                if (shapeAnnotObject[index]) {
                    // tslint:disable-next-line
                    let shapeAnnotations: any = shapeAnnotObject[index].annotations;
                    if (shapeAnnotations && shapeAnnotations.length > 0) {
                        for (let i: number = 0; i < shapeAnnotations.length; i++) {
                            pageCollections.push(shapeAnnotations[i]);
                        }
                    }
                }
            }
        }
        // tslint:disable-next-line
        let measureObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (measureObject) {
            let measureAnnotationObject: IPageAnnotations[] = JSON.parse(measureObject);
            if (measureAnnotationObject) {
                let index: number = this.getPageCollection(measureAnnotationObject, pageNumber);
                if (measureAnnotationObject[index]) {
                    // tslint:disable-next-line
                    let measureAnnotations: any = measureAnnotationObject[index].annotations;
                    if (measureAnnotations && measureAnnotations.length > 0) {
                        for (let i: number = 0; i < measureAnnotations.length; i++) {
                            pageCollections.push(measureAnnotations[i]);
                        }
                    }
                }
            }
        }
        // tslint:disable-next-line
        let stampObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        if (stampObject) {
            let stampAnnotationObject: IPageAnnotations[] = JSON.parse(stampObject);
            if (stampAnnotationObject) {
                let index: number = this.getPageCollection(stampAnnotationObject, pageNumber);
                if (stampAnnotationObject[index]) {
                    // tslint:disable-next-line
                    let stampAnnotations: any = stampAnnotationObject[index].annotations;
                    if (stampAnnotations && stampAnnotations.length > 0) {
                        for (let i: number = 0; i < stampAnnotations.length; i++) {
                            pageCollections.push(stampAnnotations[i]);
                        }
                    }
                }
            }
        }
        // tslint:disable-next-line
        let freeTextObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (freeTextObject) {
            let freeTextAnnotationObject: IPageAnnotations[] = JSON.parse(freeTextObject);
            if (freeTextAnnotationObject) {
                let index: number = this.getPageCollection(freeTextAnnotationObject, pageNumber);
                if (freeTextAnnotationObject[index]) {
                    // tslint:disable-next-line
                    let freeTextAnnotations: any = freeTextAnnotationObject[index].annotations;
                    if (freeTextAnnotations && freeTextAnnotations.length > 0) {
                        for (let i: number = 0; i < freeTextAnnotations.length; i++) {
                            pageCollections.push(freeTextAnnotations[i]);
                        }
                    }
                }
            }
        }
        // tslint:disable-next-line
        let stickyObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (stickyObject) {
            let stickyNotesAnnotationObject: IPageAnnotations[] = JSON.parse(stickyObject);
            if (stickyNotesAnnotationObject) {
                let index: number = this.getPageCollection(stickyNotesAnnotationObject, pageNumber);
                if (stickyNotesAnnotationObject[index]) {
                    // tslint:disable-next-line
                    let stickyNotesAnnotations: any = stickyNotesAnnotationObject[index].annotations;
                    if (stickyNotesAnnotations && stickyNotesAnnotations.length > 0) {
                        for (let i: number = 0; i < stickyNotesAnnotations.length; i++) {
                            pageCollections.push(stickyNotesAnnotations[i]);
                        }
                    }
                }
            }
        }
        // tslint:disable-next-line
        let textMarkupObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (textMarkupObject) {
            let textMarkupAnnotationObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
            if (textMarkupAnnotationObject) {
                let index: number = this.getPageCollection(textMarkupAnnotationObject, pageNumber);
                if (textMarkupAnnotationObject[index]) {
                    // tslint:disable-next-line
                    let textMarkupAnnotations: any = textMarkupAnnotationObject[index].annotations;
                    if (textMarkupAnnotations && textMarkupAnnotations.length > 0) {
                        for (let i: number = 0; i < textMarkupAnnotations.length; i++) {
                            pageCollections.push(textMarkupAnnotations[i]);
                        }
                    }
                }
            }
        }
        return pageCollections;
    }

    // tslint:disable-next-line
    private findOverlappedAnnotations(annotation: any, pageCollections: any): any {
        this.overlappedAnnotations = [];
        if (annotation && annotation.bounds) {
            if (annotation.shapeAnnotationType === 'textMarkup') {
                for (let i: number = 0; i < annotation.bounds.length; i++) {
                    // tslint:disable-next-line
                    let bounds: any = this.orderTextMarkupBounds(annotation.bounds[i]);
                    this.calculateOverlappedAnnotationBounds(annotation, bounds, pageCollections);
                }
            } else {
                this.calculateOverlappedAnnotationBounds(annotation, annotation.bounds, pageCollections);
            }
        }
        return this.overlappedAnnotations;
    }

    // tslint:disable-next-line
    private calculateOverlappedAnnotationBounds(annotation: any, bounds: any, pageCollections: any): void {
        // tslint:disable-next-line
        let selectBounds: any = bounds;
        // tslint:disable-next-line
        let left: number = parseInt(selectBounds.left);
        // tslint:disable-next-line
        let top: number = parseInt(selectBounds.top);
        // tslint:disable-next-line
        let totalHeight: number = parseInt(selectBounds.top + selectBounds.height);
        // tslint:disable-next-line
        let totalWidth: number = parseInt(selectBounds.left + selectBounds.width);
        for (let i: number = 0; i < pageCollections.length; i++) {
            if (annotation.annotName === pageCollections[i].annotName) {
                this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
            } else {
                let boundsCount: number = 1;
                if (pageCollections[i].shapeAnnotationType === 'textMarkup') {
                    boundsCount = pageCollections[i].bounds.length;
                }
                for (let j: number = 0; j < boundsCount; j++) {
                    // tslint:disable-next-line
                    let annotationBounds: any;
                    if (pageCollections[i].shapeAnnotationType !== 'textMarkup' && boundsCount === 1) {
                        annotationBounds = pageCollections[i].bounds;
                    } else {
                        // tslint:disable-next-line
                        annotationBounds = this.orderTextMarkupBounds(pageCollections[i].bounds[j]);
                    }
                    if (annotationBounds) {
                        let isOverlapped: boolean = false;
                        // tslint:disable-next-line
                        if (((left <= parseInt(annotationBounds.left)) && (totalWidth >= parseInt(annotationBounds.left))) || ((left <= parseInt(annotationBounds.left + annotationBounds.width)) && (totalWidth >= parseInt(annotationBounds.left + annotationBounds.width)))) {
                            isOverlapped = true;
                        }
                        if (isOverlapped) {
                            // tslint:disable-next-line
                            if (((top <= parseInt(annotationBounds.top)) && (totalHeight >= parseInt(annotationBounds.top))) || ((top <= parseInt(annotationBounds.top + annotationBounds.height)) && (totalHeight >= parseInt(annotationBounds.top + annotationBounds.height)))) {
                                isOverlapped = true;
                            } else {
                                isOverlapped = false;
                            }
                        }
                        if (isOverlapped) {
                            this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
                        } else {
                            // tslint:disable-next-line
                            if (((parseInt(annotationBounds.left) <= left) && (parseInt(annotationBounds.left + annotationBounds.width) >= left)) || ((totalWidth >= parseInt(annotationBounds.left)) && (totalWidth <= parseInt(annotationBounds.left + annotationBounds.width)))) {
                                isOverlapped = true;
                            }
                            if (isOverlapped) {
                                // tslint:disable-next-line
                                if (((parseInt(annotationBounds.top) <= top) && parseInt(annotationBounds.top + annotationBounds.height) >= top) || ((totalHeight >= parseInt(annotationBounds.top)) && (totalHeight <= parseInt(annotationBounds.top + annotationBounds.height)))) {
                                    isOverlapped = true;
                                } else {
                                    isOverlapped = false;
                                }
                            }
                            if (isOverlapped) {
                                this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
                            } else {
                                // tslint:disable-next-line
                                if (((left <= parseInt(annotationBounds.left)) && (totalWidth >= parseInt(annotationBounds.left))) || ((left <= parseInt(annotationBounds.left + annotationBounds.width)) && (totalWidth >= parseInt(annotationBounds.left + annotationBounds.width)))) {
                                    isOverlapped = true;
                                }
                                if (isOverlapped) {
                                    // tslint:disable-next-line
                                    if (((parseInt(annotationBounds.top) <= top) && parseInt(annotationBounds.top + annotationBounds.height) >= top) || ((totalHeight >= parseInt(annotationBounds.top)) && (totalHeight <= parseInt(annotationBounds.top + annotationBounds.height)))) {
                                        isOverlapped = true;
                                    } else {
                                        isOverlapped = false;
                                    }
                                }
                                if (isOverlapped) {
                                    this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
                                } else {
                                    // tslint:disable-next-line
                                    if (((parseInt(annotationBounds.left) <= left) && (parseInt(annotationBounds.left + annotationBounds.width) >= left)) || ((totalWidth >= parseInt(annotationBounds.left)) && (totalWidth <= parseInt(annotationBounds.left + annotationBounds.width)))) {
                                        isOverlapped = true;
                                    }
                                    if (isOverlapped) {
                                        // tslint:disable-next-line
                                        if (((top <= parseInt(annotationBounds.top)) && (totalHeight >= parseInt(annotationBounds.top))) || ((top <= parseInt(annotationBounds.top + annotationBounds.height)) && (totalHeight >= parseInt(annotationBounds.top + annotationBounds.height)))) {
                                            isOverlapped = true;
                                        } else {
                                            isOverlapped = false;
                                        }
                                    }
                                    if (isOverlapped) {
                                        this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
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
     * @private
     */
    // tslint:disable-next-line
    public findAnnotationMode (annotation: any, pageNumber: number, type: string) : string {
            // tslint:disable-next-line
            let importCollection: any = this.pdfViewer.viewerBase.importedAnnotation[pageNumber];
            if (importCollection) {
            // tslint:disable-next-line
            let collection: any[] ;
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
                  if (collection[i].AnnotName === annotation.AnnotName) {
                      return 'Imported Annotation';
                  }
               }
            }
        }
            return 'Existing Annotation';
    }
    // tslint:disable-next-line
    private checkOverlappedCollections(annotation: any, overlappedCollections: any): void {
        if (overlappedCollections.length > 0) {
            let isAdded: boolean = false;
            for (let i: number = 0; i < overlappedCollections.length; i++) {
                if (annotation.annotName === overlappedCollections[i].annotName && annotation.bounds === overlappedCollections[i].bounds) {
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

    // tslint:disable-next-line
    private orderTextMarkupBounds(bounds: any): any {
        if (bounds.Left || bounds.Width) {
            return { left: bounds.Left, top: bounds.Top, height: bounds.Height, width: bounds.Width };
        } else {
            return { left: bounds.left, top: bounds.top, height: bounds.height, width: bounds.width };
        }
    }

    /**
     * @private
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
        this.pdfViewer.refresh();
        this.undoCommentsElement = [];
        this.redoCommentsElement = [];
        this.overlappedAnnotations = [];
        this.previousIndex = null;
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
            this.pdfViewer.annotation.stampAnnotationModule.stampPageNumber = [];
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
            this.pdfViewer.annotation.freeTextAnnotationModule.freeTextPageNumbers = [];
        }
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sticky');
    }
    // tslint:disable-next-line
    public retrieveAnnotationCollection(): any[] {
        return this.pdfViewer.annotationCollection;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public cloneObject(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * @private
     */
    public destroy(): void {
        this.destroyPropertiesWindow();
        this.textMarkupAnnotationModule.clear();
    }

    /**
     * @private
     */
    public getModuleName(): string {
        return 'Annotation';
    }
}