/* eslint-disable */
import { FreeTextSettings, HighlightSettings, LineSettings, StickyNotesSettings, StrikethroughSettings, UnderlineSettings, RectangleSettings, CircleSettings, ArrowSettings, PerimeterSettings, DistanceSettings, AreaSettings, RadiusSettings, VolumeSettings, PolygonSettings, InkAnnotationSettings, StampSettings, CustomStampSettings } from './../pdfviewer';
import {
    // eslint-disable-next-line max-len
    PdfViewer, PdfViewerBase, AnnotationType, IShapeAnnotation, ITextMarkupAnnotation, TextMarkupAnnotation, ShapeAnnotation,
    StampAnnotation, StickyNotesAnnotation, IPopupAnnotation, ICommentsCollection, MeasureAnnotation, InkAnnotation, AllowedInteraction, DynamicStampItem,
    SignStampItem, StandardBusinessStampItem, PdfAnnotationType
} from '../index';
import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { NumericTextBox, Slider, ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DecoratorShapes, PointModel, processPathData, splitArrayCollection } from '@syncfusion/ej2-drawings';
import { isLineShapes, cloneObject } from '../drawing/drawing-util';
import { PdfAnnotationBaseModel, PdfFontModel } from '../drawing/pdf-annotation-model';
import { NodeDrawingTool, LineTool, MoveTool, ResizeTool, ConnectTool } from '../drawing/tools';
import { updateDistanceLabel, updateRadiusLabel, updatePerimeterLabel, updateCalibrateLabel } from '../drawing/connector-util';
import { AnnotationDataFormat, AnnotationPropertiesChangeEventArgs, ISize } from '../base';
import { FreeTextAnnotation } from './free-text-annotation';
import { InputElement } from './input-element';
import { InPlaceEditor } from '@syncfusion/ej2-inplace-editor';
import { ShapeLabelSettingsModel, AnnotationSelectorSettingsModel } from '../pdfviewer-model';
import { IFormField, IElement } from '../form-designer';
import { PdfAnnotationBase } from '../drawing';
/**
 * @hidden
 */
export interface IActionElements {
    pageIndex: number
    index: number
    // eslint-disable-next-line
    annotation: any;
    action: string
    // eslint-disable-next-line
    undoElement: any;
    // eslint-disable-next-line
    redoElement: any;
    // eslint-disable-next-line
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
 * Interface for a class Point
 *  @hidden
 */
export interface IAnnotationPoint {

    /**
     * Sets the x-coordinate of a position
     * @default 0
     */
    x: number;

    /**
     * Sets the y-coordinate of a position
     * @default 0
     */
    y: number;

    /**
     * Sets the x-coordinate of a position
     * @default 0
     */
    width: number;

    /**
     * Sets the y-coordinate of a position
     * @default 0
     */
    height: number;

}

/**
 * @hidden
 */
export interface IPageAnnotations {
    pageIndex: number
    // eslint-disable-next-line
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
    public inkAnnotationModule: InkAnnotation;
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
    private annotationSelected: boolean = true;
    private isAnnotDeletionApiCall: boolean = false;
    private removedDocumentAnnotationCollection: any = [];
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
    // eslint-disable-next-line
    private overlappedAnnotations: any = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public overlappedCollections: any = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public isFormFieldShape: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public removedAnnotationCollection: any = [];

    /**
     * @param pdfViewer
     * @param viewerBase
     * @param pdfViewer
     * @param viewerBase
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
        this.inkAnnotationModule = new InkAnnotation(this.pdfViewer, this.pdfViewerBase);
    }

    /**
     * Set annotation type to be added in next user interaction in PDF Document.
     *
     * @param type
     * @param dynamicStampItem
     * @param signStampItem
     * @param standardBusinessStampItem
     * @returns void
     */
    // eslint-disable-next-line max-len
    public setAnnotationMode(type: AnnotationType, dynamicStampItem?: DynamicStampItem, signStampItem?: SignStampItem, standardBusinessStampItem?: StandardBusinessStampItem): void {
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        if (this.pdfViewer.tool === "Stamp" && this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateStampItems();
        }
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.resetFreeTextAnnot();
        }
        type !== 'None' ? this.triggerAnnotationUnselectEvent() : null;
        this.pdfViewer.tool = "";
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.deSelectCommentAnnotation();
        }
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
        } else if (type === 'Initial') {
            this.pdfViewerBase.signatureModule.setInitialMode();
        } else if (type === 'Ink') {
            this.inkAnnotationModule.setAnnotationMode();
        } else if (type === 'StickyNotes') {
            this.pdfViewerBase.isCommentIconAdded = true;
            this.pdfViewerBase.isAddComment = true;
            // eslint-disable-next-line max-len
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
                let stampName: any = DynamicStampItem[dynamicStampItem];
                this.pdfViewerBase.isDynamicStamp = true;
                this.stampAnnotationModule.retrieveDynamicStampAnnotation(stampName);
            } else if (signStampItem) {
                // eslint-disable-next-line
                let stampName: any = SignStampItem[signStampItem];
                this.pdfViewerBase.isDynamicStamp = false;
                this.stampAnnotationModule.retrievestampAnnotation(stampName);
            } else if (standardBusinessStampItem) {
                // eslint-disable-next-line
                let stampName: any = StandardBusinessStampItem[standardBusinessStampItem];
                this.pdfViewerBase.isDynamicStamp = false;
                this.stampAnnotationModule.retrievestampAnnotation(stampName);
            }
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
        this.pdfViewerBase.initiateTextSelection();
    }
    public deleteAnnotationById(annotationId: string | object): void {
        if (annotationId) {
            this.isAnnotDeletionApiCall = true;
            this.annotationSelected = false;
            this.selectAnnotation(annotationId);
            this.deleteAnnotation();
            this.isAnnotDeletionApiCall = false;
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
        if (this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    }

    public deleteAnnotation(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.deleteTextMarkupAnnotation();
        }
        let selectedAnnotation:any = this.pdfViewer.selectedItems.annotations[0];
        if(selectedAnnotation){
            let data : any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
            let formFieldsData : any = JSON.parse(data);
            let newFormFieldsData : any = [];
            if(formFieldsData){
                for(let x=0;x<formFieldsData.length;x++){
                    if(formFieldsData[x].uniqueID==selectedAnnotation.id){
                        formFieldsData[x].Value='';
                        for(let y=0;y<formFieldsData.length;y++){
                            if (formFieldsData[y].Name === 'ink') {
                                formFieldsData[y].Value = '';
                            }
                            if(formFieldsData[x].FieldName===formFieldsData[y].FieldName&&formFieldsData[y].Name==='ink'){
                                formFieldsData.splice(y,1);
                            }
                        }
                        newFormFieldsData.push(formFieldsData[x]);
                    }
                    else{
                        newFormFieldsData.push(formFieldsData[x]);
                    }
                }
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields',JSON.stringify(newFormFieldsData));    
            }
        }
        let isLock: boolean = false;
        let isReadOnly: boolean = false;
        if (this.pdfViewer.selectedItems.annotations.length > 0) {
            // eslint-disable-next-line
            let annotation: any = this.pdfViewer.selectedItems.annotations[0];
            let type: any = annotation.shapeAnnotationType;
            if (type === 'Path' || annotation.formFieldAnnotationType === 'SignatureField' || annotation.formFieldAnnotationType === 'InitialField' || type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') {
                let inputFields: any = document.getElementById(annotation.id);
                if (inputFields && inputFields.disabled) {
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
                // eslint-disable-next-line
                let shapeType: any = annotation.shapeAnnotationType;
                // eslint-disable-next-line
                let undoElement: any;
                if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                    // eslint-disable-next-line max-len
                    if (isNullOrUndefined(annotation.measureType) || annotation.measureType === '') {
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'shape');
                        this.updateImportAnnotationCollection(annotation, pageNumber, 'shapeAnnotation');
                    } else {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'measure');
                        // eslint-disable-next-line max-len
                        this.updateImportAnnotationCollection(annotation, pageNumber, 'measureShapeAnnotation');
                    }
                    undoElement = this.modifyInCollections(annotation, 'delete');
                } else if (shapeType === 'FreeText') {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'FreeText', 'delete');
                    undoElement = this.modifyInCollections(annotation, 'delete');
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'freeTextAnnotation');
                } else if (shapeType === 'HandWrittenSignature' || shapeType === 'SignatureImage' || shapeType === 'SignatureText') {
                    undoElement = this.modifyInCollections(annotation, 'delete');
                } else if (shapeType === 'Ink') {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(annotation, 'Ink', 'delete');
                    undoElement = this.modifyInCollections(annotation, 'delete');
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'signatureInkAnnotation');
                } else {
                    undoElement = this.pdfViewer.selectedItems.annotations[0];
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(undoElement, undoElement.shapeAnnotationType, 'delete');
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(annotation, null, 'delete');
                }
                if (shapeType === 'StickyNotes') {
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'stickyNotesAnnotation');
                }
                if (shapeType === 'Stamp' || 'Image') {
                    this.updateImportAnnotationCollection(annotation, pageNumber, 'stampAnnotations');
                }
                // eslint-disable-next-line max-len
                this.pdfViewer.annotation.addAction(pageNumber, null, annotation, 'Delete', '', undoElement, annotation);
                // eslint-disable-next-line
                let removeDiv: any;
                if (annotation.annotName !== '') {
                    removeDiv = document.getElementById(annotation.annotName);
                } else {
                    if (undoElement) {
                        if (undoElement.annotName !== '') {
                            removeDiv = document.getElementById(undoElement.annotName);
                        }
                    }
                }
                this.removeCommentPanelDiv(removeDiv);
                const selectedAnnot: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
                const annotationId: string = selectedAnnot.annotName;
                const annotType: AnnotationType = this.getAnnotationType(selectedAnnot.shapeAnnotationType, selectedAnnot.measureType);
                if (shapeType === 'Path' || selectedAnnot.formFieldAnnotationType === 'SignatureField' || selectedAnnot.formFieldAnnotationType === 'InitialField' || shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') {                    // eslint-disable-next-line
                    let formFieldCollection: any = this.pdfViewer.retrieveFormFields();
                    let index: number = formFieldCollection.findIndex((el: { id: any; }) => el.id === annotation.id);
                    let formFieldName: string;
                    if (index > -1) {
                        formFieldName = formFieldCollection[index].name;
                    }
                    for (var m = 0; m < formFieldCollection.length; m++) {
                        if (selectedAnnot.id === formFieldCollection[m].id || (isNullOrUndefined(formFieldName) && formFieldName === formFieldCollection[m].name)) {
                            formFieldCollection[m].value = '';
                            formFieldCollection[m].signatureType = '';
                            let annotation: any = this.getAnnotationsFromCollections(formFieldCollection[m].id);
                            this.updateInputFieldDivElement(annotation);
                            undoElement = this.modifyInCollections(annotation, 'delete');
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.addAction(annotation.pageIndex, null, annotation, 'Delete', '', undoElement, annotation);
                            if (this.pdfViewer.formDesignerModule && selectedAnnot.formFieldAnnotationType)
                                this.updateFormFieldCollection(annotation);
                            else
                                this.updateAnnotationCollection(annotation);
                            this.pdfViewer.remove(annotation);
                        }
                    }
                    if (this.pdfViewer.formDesignerModule && selectedAnnot.formFieldAnnotationType)
                        this.updateFormFieldCollection(annotation)
                    else
                        this.updateAnnotationCollection(annotation);
                }
                if (this.pdfViewer.formDesignerModule && selectedAnnot.formFieldAnnotationType)
                    this.updateFormFieldCollection(annotation)
                else
                    this.updateAnnotationCollection(annotation);
                let formFieldObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[annotation.id.split("_")[0]];
                if (formFieldObj != null && (formFieldObj.formFieldAnnotationType === 'SignatureField' || formFieldObj.formFieldAnnotationType === 'InitialField')) {
                    let index: number = this.pdfViewer.formFieldCollections.findIndex(el => el.id === annotation.id.split("_")[0]);
                    let formFieldName: string;
                    if (index > -1) {
                        formFieldName = this.pdfViewer.formFieldCollections[index].name;
                    }
                    for (var i = 0; i < this.pdfViewer.formFieldCollections.length; i++) {
                        if (formFieldName === this.pdfViewer.formFieldCollections[i].name) {
                            let formFieldsIndex: any = this.pdfViewer.formFieldCollections[i];
                            this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", formFieldsIndex, formFieldsIndex.pageIndex, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, formFieldsIndex.value, "");
                            formFieldsIndex.value = "";
                            formFieldsIndex.signatureType = "";
                            this.pdfViewer.formDesignerModule.updateFormFieldCollections(formFieldsIndex);
                            let annotation: any = this.getAnnotationsFromCollections(formFieldsIndex.id + '_content');
                            undoElement = this.modifyInCollections(annotation,'delete');
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.addAction(annotation.pageIndex, null, annotation, 'Delete', '', undoElement, annotation);
                            this.updateInputFieldDivElement(annotation);
                            let formFieldObject: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[annotation.id.split("_")[0]];
                            formFieldObject.wrapper.children.splice(formFieldObject.wrapper.children.indexOf(annotation.wrapper.children[0]), 1);
                            this.pdfViewer.remove(annotation);
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
                    // eslint-disable-next-line max-len
                    const bounds: object = { left: selectedAnnot.bounds.x, top: selectedAnnot.bounds.y, width: selectedAnnot.bounds.width, height: selectedAnnot.bounds.height };
                    // eslint-disable-next-line max-len
                    this.pdfViewer.fireSignatureRemove(pageNumber,selectedAnnot.id,selectedAnnot.shapeAnnotationType  as AnnotationType , bounds);
                } else if (this.pdfViewer.annotationModule) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.fireAnnotationRemove(pageNumber, annotationId, annotType, selectedAnnot.bounds);
                }
                if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.enableTextSelectionMode();
                }
            }
        }
        this.updateToolbar(true);
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule && !isLock) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(false, true);
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(false);
            }
        }
    }
    /**
     * @param annotationId
    */
   // eslint-disable-next-line max-len
    private getAnnotationsFromCollections(annotationId : string): any {
        let collections : any = this.pdfViewer.annotations;
        if (collections && annotationId) {
            for (var i = 0; i < collections.length; i++) {
                if (collections[i].id === annotationId) {
                    return collections[i];
                }
            }
        }
    };

    /**
     * @param annotation
    */
    private updateInputFieldDivElement(annotation: any): void {
        let inputFields: any = document.getElementById(annotation.id);
        let signatureFieldElement: any = document.getElementById(annotation.id + "_html_element");
        if (inputFields === null && !isNullOrUndefined(signatureFieldElement)) {
            inputFields = signatureFieldElement.children[0].children[0]
        }
        if (inputFields && inputFields.classList.contains('e-pdfviewer-signatureformfields-signature')) {
            inputFields.className = 'e-pdfviewer-signatureformfields';
            inputFields.style.pointerEvents = '';
            inputFields.parentElement.style.pointerEvents = '';
            if (this.pdfViewer.formDesignerModule) {
                this.pdfViewer.formDesignerModule.updateSignatureValue(annotation.id);
            } else {
                this.pdfViewer.formFieldsModule.updateDataInSession(inputFields, '');
            }
        }
    }
    /**
     * @param annotation
     * @param pageNumber
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public storeAnnotationCollections(annotation: any, pageNumber: number): void {
        if (this.isFormFieldShape) {
            let collectionDetails: any = this.checkFormDesignCollection(annotation);
            let selectAnnotation: any = cloneObject(annotation);
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

            // eslint-disable-next-line
            let collectionDetails: any = this.checkAnnotationCollection(annotation);
            // eslint-disable-next-line
            let selectAnnotation: any = cloneObject(annotation);
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
            // eslint-disable-next-line
            if (selectAnnotation.customData && annotation.customData && JSON.stringify(selectAnnotation.customData) !== JSON.stringify(annotation.customData)) {
                selectAnnotation.customData = annotation.customData;
            }
            if (collectionDetails.isExisting) {
                this.pdfViewer.annotationCollection.splice(collectionDetails.position, 0, selectAnnotation);
            } else {
                this.pdfViewer.annotationCollection.push(selectAnnotation);
            }
        }
    }
    public checkFormDesignCollection(annotation: any): any {
        // eslint-disable-next-line
        let collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].formFieldId === annotation.annotName) {
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                    return { isExisting: true, position: i };
                }
            }
        }
        return { isExisting: false, position: null };
    }
    public updateFormFieldCollection(annotation: any): void {
        // eslint-disable-next-line
        let collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].formFieldId === annotation.annotName) {
                    this.removedAnnotationCollection.push(collections[i]);
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
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
            customData = annotation.CustomData;
        }
        return customData;
    }

    /**
     * @param type
     * @param subject
     * @private
     */
    // eslint-disable-next-line
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
     * @param type
     * @private
     */
    // eslint-disable-next-line
    public getMeasureData(type: string): object {
        let customData: object;
        if ((type === 'Distance' || type === 'Distance calculation') && this.pdfViewer.distanceSettings.customData) {
            customData = this.pdfViewer.distanceSettings.customData;
        } else if ((type === 'Line' || type === 'Perimeter calculation') && this.pdfViewer.lineSettings.customData) {
            customData = this.pdfViewer.lineSettings.customData;
            // eslint-disable-next-line max-len
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
     * @param type
     * @private
     */
    // eslint-disable-next-line
    public getTextMarkupData(type: string): object {
        let customData: object;
        if (type === 'Highlight' && this.pdfViewer.highlightSettings.customData) {
            customData = this.pdfViewer.highlightSettings.customData;
        } else if (type === 'Underline' && this.pdfViewer.underlineSettings.customData) {
            customData = this.pdfViewer.underlineSettings.customData;
        } else if (type === 'Strikethrough' && this.pdfViewer.strikethroughSettings.customData) {
            customData = this.pdfViewer.strikethroughSettings.customData;
        } else if (this.pdfViewer.annotationSettings.customData) {
            customData = this.pdfViewer.annotationSettings.customData;
        }
        return customData;
    }
    /**
     * @param type
     * @private
     */
    // eslint-disable-next-line
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
     * @private
     */
    // eslint-disable-next-line
    public clearAnnotationStorage(): void {
        // eslint-disable-next-line
        let sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        const maxSessionSize: number = 4500;
        if (sessionSize > maxSessionSize) {
            const storageLength: number = window.sessionStorage.length;
            // eslint-disable-next-line
            let annotationList: any = [];
            for (let i: number = 0; i < storageLength; i++) {
                if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                    if (window.sessionStorage.key(i).split('_')[3] === 'annotations') {
                        // eslint-disable-next-line max-len
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
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public checkAnnotationCollection(annotation: any): any {
        // eslint-disable-next-line
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
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public updateAnnotationCollection(annotation: any): void {
        // eslint-disable-next-line
        let collections: any = this.pdfViewer.annotationCollection;
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].annotationId === annotation.annotName || collections[i].annotationId === annotation.annotationId) {
                    this.removedAnnotationCollection.push(collections[i]);
                    this.pdfViewer.annotationCollection.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param annotationType
     * @private
     */
    // eslint-disable-next-line
    public updateImportAnnotationCollection(annotation: any, pageNumber: number, annotationType: string): void {
        if (this.pdfViewerBase.isImportAction) {
            if (this.pdfViewerBase.importedAnnotation && this.pdfViewerBase.importedAnnotation[pageNumber]) {
                // eslint-disable-next-line
                let currentPageAnnotations: any = this.pdfViewerBase.importedAnnotation[pageNumber];
                if (currentPageAnnotations[annotationType]) {
                    for (let i: number = 0; i < currentPageAnnotations[annotationType].length; i++) {
                        // eslint-disable-next-line max-len
                        if (annotation.annotName === currentPageAnnotations[annotationType][i].AnnotName || annotation.annotName === currentPageAnnotations[annotationType][i].annotName) {
                            this.pdfViewerBase.importedAnnotation[pageNumber][annotationType].splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let documentcollections: any = this.pdfViewerBase.documentAnnotationCollections;
        if (documentcollections && documentcollections[pageNumber]) {
            // eslint-disable-next-line
            let documentPageCollections: any = documentcollections[pageNumber];
            if (documentPageCollections && documentPageCollections[annotationType]) {
                for (let i: number = 0; i < documentPageCollections[annotationType].length; i++) {
                    // eslint-disable-next-line max-len
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
     *
     * @param annotationId
     * @returns void
     */
    public selectAnnotation(annotationId: string | object): void {
        // eslint-disable-next-line
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
            let pageIndex: number = isNullOrUndefined(annotation.pageNumber) ? annotation.pageIndex : annotation.pageNumber;
            let isRender: boolean = false;
            isRender = this.findRenderPageList(pageIndex);
            const currentSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            //let pageIndex: number = this.getPageNumberFromAnnotationCollections(annotation);
            if (annotation && pageIndex >= 0) {
                if (annotation.shapeAnnotationType === 'textMarkup') {
                    if (annotation.rect || annotation.bounds) {
                        // eslint-disable-next-line max-len
                        const scrollValue: number = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + (this.getAnnotationTop(annotation)) * this.pdfViewerBase.getZoomFactor();
                        if (!this.isAnnotDeletionApiCall) {
                            const scroll: string = (scrollValue - 20).toString();
                            // eslint-disable-next-line radix
                            this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
                            this.pdfViewerBase.viewerContainer.scrollLeft = this.getAnnotationLeft(annotation) * this.pdfViewerBase.getZoomFactor();    
                        }
                    } else {
                        if (this.pdfViewer.navigation) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                        }
                    }
                } else {
                    if (annotation.bounds) {
                        // eslint-disable-next-line max-len
                        let scrollValue: number = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + (annotation.bounds.top) * this.pdfViewerBase.getZoomFactor();
                        let scrollLeft: number = annotation.bounds.left * this.pdfViewerBase.getZoomFactor();
                        if (annotation.shapeAnnotationType === 'Ink') {
                            // eslint-disable-next-line max-len
                            scrollValue = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + (annotation.bounds.y) * this.pdfViewerBase.getZoomFactor();
                            scrollLeft = annotation.bounds.x * this.pdfViewerBase.getZoomFactor();
                        }
                        if (!this.isAnnotDeletionApiCall) {
                            const scroll: string = (scrollValue - 20).toString();
                            // eslint-disable-next-line radix
                            this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
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
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageIndex, true);
                        // eslint-disable-next-line max-len
                        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
                        // eslint-disable-next-line
                        let textMarkupAnnotation: any = this.getTextMarkupAnnotations(pageIndex, annotation);
                        if (textMarkupAnnotation) {
                            this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                            this.textMarkupAnnotationModule.isSelectedAnnotation = true;
                            this.textMarkupAnnotationModule.showHideDropletDiv(true);
                            this.textMarkupAnnotationModule.annotationClickPosition = null;
                            this.textMarkupAnnotationModule.selectAnnotation(textMarkupAnnotation, canvas, pageIndex, null, true);
                            this.textMarkupAnnotationModule.currentTextMarkupAnnotation = textMarkupAnnotation;
                            this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageIndex;
                            this.textMarkupAnnotationModule.enableAnnotationPropertiesTool(true);
                            this.textMarkupAnnotationModule.isSelectedAnnotation = false;
                            if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                                // eslint-disable-next-line max-len
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
                    // eslint-disable-next-line max-len
                    const commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                    if (commentElement && commentElement.style.display === 'block') {
                        // eslint-disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // eslint-disable-next-line
                        let commentsDiv: any = document.getElementById(id);
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
                } 
                else if (annotation.uniqueKey || (annotation.shapeAnnotationType === "textMarkup" && annotation.annotationAddMode === "Imported Annotation")) {
                    this.selectAnnotationId = id;
                    this.isAnnotationSelected = true;
                    this.annotationPageIndex = pageIndex;
                    this.selectAnnotationFromCodeBehind();
                }
            }
            if (!isRender && !annotation.uniqueKey) {
                let collections: any = this.updateCollectionForNonRenderedPages(annotation, id, pageIndex);
                collections.pageIndex = pageIndex;
                this.pdfViewer.annotation.addAction(pageIndex, null, collections, 'Delete', '', collections, collections);
                this.undoCommentsElement.push(collections);
                let removeDiv: any = document.getElementById(annotation.annotationId);
                this.removeCommentPanelDiv(removeDiv);
            }
        }
    }
      // To update the collections for the non-rendered pages.
    private updateCollectionForNonRenderedPages(annotation: any, id: any, pageIndex: number): any{
        let collections: any;
        let annotationCollection: any = this.pdfViewer.annotationCollection;
        if (annotationCollection.length) {
            let collectionDetails: any = annotationCollection.filter(function (annotCollection: any) {
                return annotCollection.annotationId === id;
            })
            collections = collectionDetails[0];
            this.updateAnnotationCollection(collectionDetails[0]);
        }
        let annotationType: any = this.getTypeOfAnnotation(annotation);
        let collection: any = this.pdfViewerBase.documentAnnotationCollections[pageIndex];                    
        if (collection[annotationType].length) {
            for (let x = 0; x < collection[annotationType].length; x++) {
                if (collection[annotationType][x].AnnotName === annotation.annotationId) {
                    let type: any = collection[annotationType][x];
                    this.removedDocumentAnnotationCollection.push(type);
                    collection[annotationType].splice(x, 1);
                    break;
                }
            } 
        }
        return collections;
    }

    // To get the annotation type to update the document Annotation collections
    private getTypeOfAnnotation(annotation: any): any {
        let annotationType;
        if (annotation.id && annotation.id.toLowerCase() === "shape") {
            annotationType = "shapeAnnotation"
        }
        else if (annotation.id && annotation.id.toLowerCase() === "measure") {
            annotationType = "measureShapeAnnotation";
        }
        else if (annotation.id && annotation.id.toLowerCase() === "freetext") {
            annotationType = "freeTextAnnotation";
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === "textmarkup") {
            annotationType = "textMarkupAnnotation";
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === "stamp") {
            annotationType = "stampAnnotations";
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === "ink") {
            annotationType = "signatureInkAnnotation";
        }
        else if (annotation.shapeAnnotationType && annotation.shapeAnnotationType.toLowerCase() === "sticky") {
            annotationType = "stickyNotesAnnotation";
        }                    
        return annotationType;
    } 

    // To remove the commnet panel div
    private removeCommentPanelDiv(removeDiv: any): void {
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
     * @returns void
     */
    public clearSelection(): void {
        if (this.textMarkupAnnotationModule && this.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            this.textMarkupAnnotationModule.clearCurrentSelectedAnnotation();
            this.textMarkupAnnotationModule.clearCurrentAnnotationSelection(this.textMarkupAnnotationModule.selectTextMarkupCurrentPage);
        } else {
            if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.annotations[0]) {
                // eslint-disable-next-line
                let currentAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                this.pdfViewer.clearSelection(currentAnnotation.pageIndex);
            } else {
                this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
            }
        }
    }

    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
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
     * @param annotation 
     */
    // eslint-disable-next-line
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
     */
    public selectAnnotationFromCodeBehind(): void {
        if (this.isAnnotationSelected && this.selectAnnotationId) {
            // eslint-disable-next-line
            let annotation: any = this.getAnnotationsFromAnnotationCollections(this.selectAnnotationId);
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
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageIndex, true);
                    // eslint-disable-next-line max-len
                    const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
                    // eslint-disable-next-line
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
                            // eslint-disable-next-line max-len
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
                // eslint-disable-next-line max-len
                const commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                if (commentElement && commentElement.style.display === 'block') {
                    // eslint-disable-next-line
                    let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                    if (accordionExpand) {
                        accordionExpand.ej2_instances[0].expandItem(true);
                    }
                    // eslint-disable-next-line
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

    /**
     * @param pageIndex
     * @private
     */
    public findRenderPageList(pageIndex: number): boolean {
        let isRender: boolean = false;
        // eslint-disable-next-line
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

    // eslint-disable-next-line
    private getPageNumberFromAnnotationCollections(annotation: any): any {
        // eslint-disable-next-line
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

    // eslint-disable-next-line
    private getAnnotationsFromAnnotationCollections(annotationId: string): any {
        // eslint-disable-next-line
        let collections: any = this.pdfViewer.annotationCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].annotationId === annotationId) {
                    return collections[i];
                }
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 0)
            this.pdfViewer.selectedItems.annotations.push((this.pdfViewer.nameTable as any)[annotationId]);
    }

    // eslint-disable-next-line
    private getTextMarkupAnnotations(pageIndex: number, annotation: any): any {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_textMarkup'];
        }
        if (storeObject) {
            // eslint-disable-next-line
            let annotObject: any = JSON.parse(storeObject);
            const index: number = this.getPageCollection(annotObject, pageIndex);
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
     * @param type
     * @param measureType
     * @param type
     * @param measureType
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
                case 'Ink':
                    annotType = 'Ink';
                    break;
                case 'StickyNotes':
                    annotType = 'StickyNotes';
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
     * @param pageNumber
     * @param annotationId
     * @private
     */
    public getAnnotationIndex(pageNumber: number, annotationId: string): number {
        const pageAnnotationBases: PdfAnnotationBaseModel[] = this.pdfViewer.drawing.getPageObjects(pageNumber);
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
            const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentPanel) {
                if (commentPanel.style.display === 'none') {
                    commentPanel.style.display = 'block';
                    if (Browser.isDevice && !isBlazor()) {
                        // eslint:disable-next-line
                        let viewer: any = document.getElementById(this.pdfViewer.element.id + '_viewerMainContainer');
                        // eslint:disable-next-line
                        viewer.insertBefore(this.pdfViewerBase.navigationPane.commentPanelContainer, this.pdfViewer.toolbarModule.toolbarElement);
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
                        // eslint-disable-next-line max-len
                        viewerContainer.style.width = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - this.pdfViewerBase.navigationPane.getViewerContainerRight()) + 'px';
                        pageContainer.style.width = (viewerContainer.offsetWidth - this.pdfViewerBase.navigationPane.getViewerContainerScrollbarWidth()) + 'px';
                    }
                    this.pdfViewerBase.updateZoomValue();
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                        this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
                    }
                    if (Browser.isDevice && !isBlazor()) {
                        commentPanel.style.height = this.pdfViewerBase.viewerMainContainer.clientHeight + 'px';
                        if (this.pdfViewer.selectedItems.annotations.length > 0) {
                            // eslint:disable-next-line
                            let commentDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
                            if (commentDiv && commentDiv.lastElementChild.children[1] && commentDiv.lastElementChild.children[1].ej2_instances) {
                                commentDiv.lastElementChild.children[1].ej2_instances[0].enableEditMode = true;
                            } else if (commentDiv && commentDiv.lastElementChild.ej2_instances) {
                                commentDiv.lastElementChild.ej2_instances[0].enableEditMode = true;
                                commentDiv.lastElementChild.style.display = 'block';
                                commentDiv.lastElementChild.children[1] ? commentDiv.lastElementChild.children[1].style.display = 'block' : null;
                            }
                        }
                        if (this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.element.style.display = 'none';
                            if (this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar.element.style.display = 'none';
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param pageNumber
     * @param index
     * @param annotation
     * @param actionString
     * @param property
     * @param node
     * @param redo
     * @param pageNumber
     * @param index
     * @param annotation
     * @param actionString
     * @param property
     * @param node
     * @param redo
     * @private
     */
    // eslint-disable-next-line
    public addAction(
        // eslint-disable-next-line
        pageNumber: number, index: number, annotation: any, actionString: string, property: string, node?: any, redo?: any): void {
        const action: IActionElements = {
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
        const actionObject: IActionElements = this.actionCollection.pop();
        if (actionObject) {
            // eslint-disable-next-line
            let shapeType: any = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            this.isUndoAction = true;
            switch (actionObject.action) {
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // eslint-disable-next-line max-len
                        this.textMarkupAnnotationModule.undoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // eslint-disable-next-line max-len
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty, true);
                    }
                    break;
                case 'Drag':
                case 'Resize':
                    if (isLineShapes(actionObject.annotation)) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.undoElement.bounds, vertexPoints: actionObject.undoElement.vertexPoints, leaderHeight: actionObject.undoElement.leaderHeight });
                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.undoElement.bounds });
                    }
                    // eslint-disable-next-line max-len
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                        actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { notes: actionObject.undoElement.notes });
                        this.updateCalibrateValues(actionObject.annotation);
                    }
                    if (actionObject.annotation.formFieldAnnotationType) {
                        this.pdfViewer.formDesigner.updateHTMLElement(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.select([actionObject.annotation.id]);
                    // eslint-disable-next-line max-len
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead' ||
                        actionObject.annotation.shapeAnnotationType === 'Radius' || actionObject.annotation.shapeAnnotationType === 'FreeText' || actionObject.annotation.shapeAnnotationType === 'HandWrittenSignature' || actionObject.annotation.shapeAnnotationType === 'SignatureText' || actionObject.annotation.shapeAnnotationType === 'SignatureImage' || actionObject.annotation.shapeAnnotationType === 'Ink') {
                        this.modifyInCollections(actionObject.annotation, 'bounds');
                    }
                    break;
                case 'Addition':
                    if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                        this.pdfViewer.formDesigner.deleteFormField(actionObject.undoElement.id, false)
                    } else {
                        let isAnnotationUpdate: boolean = false;
                        // eslint-disable-next-line max-len
                        if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                            if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'shape');
                            } else {
                                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'measure');
                            }
                            isAnnotationUpdate = true;
                            // eslint-disable-next-line
                            let annotationObject: any = actionObject.annotation;
                            // eslint-disable-next-line
                            let wrapper: any = annotationObject.wrapper ? annotationObject.wrapper : null;
                            if (wrapper && wrapper.bounds) {
                                actionObject.annotation.bounds = wrapper.bounds;
                            }
                            actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                        }
                        if (shapeType === 'Stamp' || shapeType === 'Image') {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                            // eslint-disable-next-line max-len
                            this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                            isAnnotationUpdate = true;
                        }
                        if (shapeType === 'FreeText' || shapeType === 'HandWrittenSignature' || shapeType === 'SignatureImage' || shapeType === 'SignatureText' || shapeType === 'Ink') {
                            isAnnotationUpdate = true;
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                            actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                        }
                        if (!isAnnotationUpdate) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                        }
                        this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                        this.pdfViewer.remove(actionObject.annotation);
                        this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                        // eslint-disable-next-line
                        let removeDiv: any = document.getElementById(actionObject.annotation.annotName);
                        if (removeDiv) {
                            if (removeDiv.parentElement.childElementCount === 1) {
                                this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                            } else {
                                removeDiv.parentElement.removeChild(removeDiv);
                            }
                        }
                        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                            let mobileAnnotationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_propertyToolbar');
                            if (mobileAnnotationToolbar && mobileAnnotationToolbar.children.length > 0) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.toolbarCreated = false;
                                this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                            }
                        }
                    }
                    break;
                case 'Delete':
                    if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                        actionObject.undoElement.bounds.x = actionObject.undoElement.wrapper.bounds.x;
                        actionObject.undoElement.bounds.y = actionObject.undoElement.wrapper.bounds.y;
                        this.pdfViewer.formDesigner.drawFormField(actionObject.undoElement as any);
                    } else {
                        // eslint-disable-next-line max-len
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
                        }
                        let formFieldObj: PdfAnnotationBase;
                        if (actionObject.annotation.id) {
                            formFieldObj = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split("_")[0]];
                        }
                        if (formFieldObj != null && (formFieldObj.formFieldAnnotationType === 'SignatureField' || formFieldObj.formFieldAnnotationType === 'InitialField')) {
                            formFieldObj.wrapper.children.push(actionObject.annotation.wrapper.children[0]);
                            if (actionObject.annotation.shapeAnnotationType === "SignatureText")
                                formFieldObj.wrapper.children.push(actionObject.annotation.wrapper.children[1]);
                            let key: string = actionObject.annotation.id.split('_')[0] + '_content';
                            let data: any = null;
                            if (this.pdfViewer.formDesignerModule) {
                                data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                            }
                            if (data) {
                                var formFieldsData = JSON.parse(data);
                                for (let i: number = 0; i < formFieldsData.length; i++) {
                                    if (formFieldsData[i].Key === key) {
                                        if (actionObject.annotation.shapeAnnotationType === "SignatureText") {
                                            formFieldsData[i].FormField.signatureType = "Text";
                                            formFieldsData[i].FormField.value = actionObject.annotation.data;
                                            this.pdfViewerBase.formFieldCollection[i].FormField.value = actionObject.annotation.data;
                                            this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Text";
                                        } else if (actionObject.annotation.shapeAnnotationType === "SignatureImage") {
                                            formFieldsData[i].FormField.signatureType = "Image";
                                            formFieldsData[i].FormField.value = actionObject.annotation.data;
                                            this.pdfViewerBase.formFieldCollection[i].FormField.value = actionObject.annotation.data;
                                            this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Image";
                                        } else {
                                            formFieldsData[i].FormField.signatureType = "Path";
                                            this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Path";
                                            let collectionData: any = processPathData(actionObject.annotation.data);
                                            let csData: any = splitArrayCollection(collectionData);
                                            formFieldsData[i].FormField.value = JSON.stringify(csData);
                                            this.pdfViewerBase.formFieldCollection[i].FormField.value = JSON.stringify(csData);
                                        }
                                    }
                                }
                                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                            }
                        }

                        this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(actionObject.annotation.pageIndex, shapeType);
                        if (actionObject.annotation.annotationId) {
                            let removedAnnotationCollection: any = this.removedAnnotationCollection[this.removedAnnotationCollection.length - 1];
                            let annotationType: any = this.getTypeOfAnnotation(removedAnnotationCollection);
                            this.pdfViewer.annotationCollection.push(removedAnnotationCollection);
                            this.removedAnnotationCollection.splice(this.removedAnnotationCollection.length - 1);
                            let pageNumber: number = actionObject.annotation.pageNumber >= 0 ? actionObject.annotation.pageNumber : actionObject.annotation.pageIndex;
                            this.pdfViewerBase.documentAnnotationCollections[pageNumber][annotationType].push(this.removedDocumentAnnotationCollection[this.removedDocumentAnnotationCollection.length - 1]);
                            this.removedDocumentAnnotationCollection.splice(this.removedDocumentAnnotationCollection.length - 1);
                        }
                    }
                    break;
                case 'stampOpacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.undoElement.opacity });
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    actionObject.annotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
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
                        actionObject.annotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
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
                        // eslint-disable-next-line max-len
                        fillColor: actionObject.undoElement.fillColor, borderDashArray: actionObject.undoElement.borderDashArray, borderStyle: actionObject.undoElement.borderStyle,
                        // eslint-disable-next-line max-len
                        strokeColor: actionObject.undoElement.strokeColor, opacity: actionObject.undoElement.opacity, thickness: actionObject.undoElement.thickness,
                        sourceDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadStart), taregetDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadEnd)
                    });
                    this.updateCollectionForLineProperty(actionObject.annotation);
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Text Property Added':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    actionObject.annotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    break;
                case 'Comments Property Added':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Status Property Added':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Comments Reply Deleted':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'dynamicText Change':
                    this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                    actionObject.annotation.dynamicText = actionObject.undoElement.dynamicText;
                    if (this.pdfViewer.selectedItems.annotations[0]) {
                        this.pdfViewer.selectedItems.annotations[0].dynamicText = actionObject.undoElement.dynamicText;
                    }
                    // eslint-disable-next-line
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    this.modifyInCollections(actionObject.annotation, 'dynamicText');
                    if (this.pdfViewer.selectedItems.annotations[0]) {
                        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], {});
                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, {});
                    }
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
                    // eslint-disable-next-line max-len
                    this.pdfViewer.nodePropertyChange(actionObject.annotation.annotations[0], { bounds: actionObject.undoElement.bounds, rotateAngle: actionObject.undoElement.rotateAngle });
                    this.modifyInCollections(actionObject.annotation.annotations[0], 'bounds');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'FormDesigner Properties Change':
                    if (actionObject.undoElement && actionObject.undoElement.isMultiline !== actionObject.redoElement.isMultiline) {
                        this.undoRedoMultiline(actionObject.undoElement);
                    }
                    this.updateFormFieldPropertiesChanges(actionObject.undoElement.formFieldAnnotationType, actionObject.undoElement);
                    break;
                case 'FormField Value Change':
                    if (actionObject.annotation.formFieldAnnotationType) {
                        if (actionObject.annotation.formFieldAnnotationType == "RadioButton") {
                            this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.undoElement, false);
                            this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.redoElement, true);
                        }
                        else {
                            this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.annotation, actionObject.undoElement);
                        }
                    } else {
                        let spanElement: any = document.getElementById(actionObject.annotation.id + "_html_element").children[0].children[0];
                        spanElement.className = 'e-pdfviewer-signatureformfields';
                        let formFieldObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split("_")[0]];
                        let annotationObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id];
                        formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.indexOf(annotationObj.wrapper.children[0]), 1);
                        if (actionObject.annotation.shapeAnnotationType === "SignatureText")
                            formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.indexOf(annotationObj.wrapper.children[1]), 1);
                        let key: string = actionObject.annotation.id.split('_')[0] + '_content';
                        let data: any = null;
                        if (this.pdfViewer.formDesignerModule) {
                            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                        }
                        if (data) {
                            var formFieldsData = JSON.parse(data);
                            for (let i: number = 0; i < formFieldsData.length; i++) {
                                if (formFieldsData[i].Key === key) {
                                    formFieldsData[i].FormField.value = '';
                                    formFieldsData[i].FormField.signatureType = '';
                                    this.pdfViewerBase.formFieldCollection[i].FormField.value = '';
                                    this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = '';
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
        }
    }

    /**
     * @private
     */
    public redo(): void {
        const actionObject: IActionElements = this.redoCollection.pop();
        if (actionObject) {
            // eslint-disable-next-line
            let shapeType: any = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            switch (actionObject.action) {
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // eslint-disable-next-line max-len
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty);
                    }
                    break;
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // eslint-disable-next-line max-len
                        this.textMarkupAnnotationModule.redoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Drag':
                case 'Resize':
                    if (isLineShapes(actionObject.annotation)) {
                        this.pdfViewer.nodePropertyChange(
                            // eslint-disable-next-line max-len
                            actionObject.annotation, { bounds: actionObject.redoElement.bounds, vertexPoints: actionObject.redoElement.vertexPoints, leaderHeight: actionObject.redoElement.leaderHeight });

                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.redoElement.bounds });
                    }
                    // eslint-disable-next-line max-len
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                        actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { notes: actionObject.redoElement.notes });
                        this.updateCalibrateValues(actionObject.annotation);
                    }
                    if (actionObject.annotation.formFieldAnnotationType) {
                        this.pdfViewer.formDesigner.updateHTMLElement(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.select([actionObject.annotation.id]);
                    // eslint-disable-next-line max-len
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead'
                        || actionObject.annotation.shapeAnnotationType === 'Radius' || actionObject.annotation.shapeAnnotationType === 'FreeText' || actionObject.annotation.shapeAnnotationType === 'HandWrittenSignature' || actionObject.annotation.shapeAnnotationType === 'SignatureText' || actionObject.annotation.shapeAnnotationType === 'SignatureImage' || actionObject.annotation.shapeAnnotationType === 'Ink') {
                        this.modifyInCollections(actionObject.annotation, 'bounds');
                    }
                    break;
                case 'Addition':
                    if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                        actionObject.redoElement.bounds.x = actionObject.redoElement.wrapper.bounds.x;
                        actionObject.redoElement.bounds.y = actionObject.redoElement.wrapper.bounds.y;
                        this.pdfViewer.formDesigner.drawFormField(actionObject.redoElement as any);
                    } else {
                        // eslint-disable-next-line max-len
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
                        if (shapeType === 'Stamp' || shapeType === 'Image') {
                            this.stampAnnotationModule.updateDeleteItems(actionObject.annotation.pageIndex, actionObject.redoElement);
                        }
                        if (shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') {
                            this.pdfViewerBase.signatureModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        }
                        if (shapeType === 'Ink') {
                            this.inkAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        }
                        const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(actionObject.annotation);
                        this.pdfViewer.select([actionObject.annotation.id]);
                        if ((shapeType === 'FreeText' || addedAnnot.enableShapeLabel) && addedAnnot) {
                            this.pdfViewer.nodePropertyChange(addedAnnot, {});
                        }
                        this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(actionObject.annotation.pageIndex, shapeType);
                        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                            let mobileAnnotationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_propertyToolbar');
                            if (mobileAnnotationToolbar && mobileAnnotationToolbar.children.length > 0) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.toolbarCreated = false;
                                this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                            }
                        }
                    }
                    break;
                case 'Delete':
                    if (this.pdfViewer.formDesigner && actionObject.annotation.formFieldAnnotationType) {
                        this.pdfViewer.formDesigner.deleteFormField(actionObject.redoElement.id, false)
                    } else {
                        let isUpdate: boolean = false;
                        let sType: string = actionObject.annotation.shapeAnnotationType;
                        // eslint-disable-next-line max-len
                        if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                            if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                                sType = 'shape';
                            } else {
                                sType = 'measure';
                            }
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                            this.modifyInCollections(actionObject.annotation, 'delete');
                            isUpdate = true;
                        }
                        if (shapeType === 'Stamp' || shapeType === 'Image') {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                            this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                            isUpdate = true;
                        }
                        if (shapeType === 'FreeText' || shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                            this.modifyInCollections(actionObject.annotation, 'delete');
                        }
                        if (!isUpdate) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        }
                        let formFieldObj: PdfAnnotationBase;
                        if (actionObject.annotation.id) {
                            formFieldObj = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split("_")[0]];
                        }
                        if (formFieldObj != null && (formFieldObj.formFieldAnnotationType === 'SignatureField' || formFieldObj.formFieldAnnotationType === 'InitialField')) {
                            formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.indexOf(actionObject.annotation.wrapper.children[0]), 1);
                            if (actionObject.annotation.shapeAnnotationType === "SignatureText")
                                formFieldObj.wrapper.children.splice(formFieldObj.wrapper.children.indexOf(actionObject.annotation.wrapper.children[1]), 1);
                            let key: string = actionObject.annotation.id.split('_')[0] + '_content';
                            let data: any = null;
                            if (this.pdfViewer.formDesignerModule) {
                                data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                            }
                            if (data) {
                                var formFieldsData = JSON.parse(data);
                                for (let i: number = 0; i < formFieldsData.length; i++) {
                                    if (formFieldsData[i].Key === key) {
                                        formFieldsData[i].FormField.value = '';
                                        formFieldsData[i].FormField.signatureType = '';
                                        this.pdfViewerBase.formFieldCollection[i].FormField.value = '';
                                        this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = '';
                                    }
                                }
                                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                            }
                        }

                        this.pdfViewer.clearSelection(actionObject.annotation.pageIndex);
                        this.pdfViewer.remove(actionObject.annotation);
                        this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                        // eslint-disable-next-line
                        let id: any = actionObject.annotation.annotName ? actionObject.annotation.annotName : actionObject.annotation.annotationId;
                        let removeDiv: any = document.getElementById(id);
                        this.removeCommentPanelDiv(removeDiv);
                        if (actionObject.annotation.annotationId) {
                            let collections: any = this.updateCollectionForNonRenderedPages(actionObject.annotation, id, actionObject.annotation.pageIndex);
                            this.undoCommentsElement.push(collections);
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
                        // eslint-disable-next-line max-len
                        fillColor: actionObject.redoElement.fillColor, strokeColor: actionObject.redoElement.strokeColor, opacity: actionObject.redoElement.opacity, thickness: actionObject.redoElement.thickness,
                        sourceDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadStart), taregetDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadEnd),
                        borderDashArray: actionObject.redoElement.borderDashArray, borderStyle: actionObject.redoElement.borderStyle
                    });
                    this.updateCollectionForLineProperty(actionObject.annotation);
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Text Property Added':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    break;
                case 'Comments Property Added':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Status Property Added':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action);
                    break;
                case 'Comments Reply Deleted':
                    // eslint-disable-next-line max-len
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action);
                    break;
                case 'dynamicText Change':
                    this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                    actionObject.annotation.dynamicText = actionObject.redoElement.dynamicText;
                    // eslint-disable-next-line
                    let annotation: any = this.pdfViewer.selectedItems.annotations[0];
                    if (annotation) {
                        annotation.dynamicText = actionObject.redoElement.dynamicText;
                        annotation.bounds.height = actionObject.redoElement.bounds.height;
                    }
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    this.modifyInCollections(actionObject.annotation, 'dynamicText');
                    if (annotation) {
                        this.pdfViewer.nodePropertyChange(annotation, {});
                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, {});
                    }
                    this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.select([actionObject.annotation.id]);
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
                    // eslint-disable-next-line max-len
                    this.pdfViewer.nodePropertyChange(actionObject.annotation.annotations[0], { bounds: actionObject.redoElement.bounds, rotateAngle: actionObject.redoElement.rotateAngle });
                    this.modifyInCollections(actionObject.annotation.annotations[0], 'bounds');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'FormDesigner Properties Change':
                    if (actionObject.redoElement && actionObject.undoElement.isMultiline !== actionObject.redoElement.isMultiline) {
                        this.undoRedoMultiline(actionObject.redoElement)
                    }
                    this.updateFormFieldPropertiesChanges(actionObject.redoElement.formFieldAnnotationType, actionObject.redoElement);
                    break;
                case 'FormField Value Change':
                    if (actionObject.annotation.formFieldAnnotationType) {
                        if (actionObject.annotation.formFieldAnnotationType == "RadioButton") {
                            this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.undoElement, true);
                            this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.redoElement, false);
                        }
                        else {
                            this.updateFormFieldValueChange(actionObject.annotation.formFieldAnnotationType, actionObject.annotation, actionObject.redoElement);
                        }
                    } else {
                        let spanElement: any = document.getElementById(actionObject.annotation.id + "_html_element").children[0].children[0];
                        spanElement.className = 'e-pdfviewer-signatureformfields-signature';
                        let formFieldObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id.split("_")[0]];
                        let annotationObj: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[actionObject.annotation.id];
                        formFieldObj.wrapper.children.push(annotationObj.wrapper.children[0]);
                        if (actionObject.annotation.shapeAnnotationType === "SignatureText")
                            formFieldObj.wrapper.children.push(annotationObj.wrapper.children[1]);
                        let key: string = actionObject.annotation.id.split('_')[0] + '_content';
                        let data: any = null;
                        if (this.pdfViewer.formDesignerModule) {
                            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                        }
                        if (data) {
                            var formFieldsData = JSON.parse(data);
                            for (let i: number = 0; i < formFieldsData.length; i++) {
                                if (formFieldsData[i].Key === key) {
                                    if (actionObject.annotation.shapeAnnotationType === "SignatureText") {
                                        formFieldsData[i].FormField.signatureType = "Text";
                                        formFieldsData[i].FormField.value = actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[i].FormField.value = actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Text";
                                    } else if (actionObject.annotation.shapeAnnotationType === "SignatureImage") {
                                        formFieldsData[i].FormField.signatureType = "Image";
                                        formFieldsData[i].FormField.value = actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[i].FormField.value = actionObject.annotation.data;
                                        this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Image";
                                    } else {
                                        formFieldsData[i].FormField.signatureType = "Path";
                                        this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Path";
                                        let collectionData: any = processPathData(actionObject.annotation.data);
                                        let csData: any = splitArrayCollection(collectionData);
                                        formFieldsData[i].FormField.value = JSON.stringify(csData);
                                        this.pdfViewerBase.formFieldCollection[i].FormField.value = JSON.stringify(csData);
                                    }
                                }
                            }
                            this.pdfViewer.add(actionObject.annotation);
                            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + actionObject.pageIndex);
                            this.pdfViewer.renderDrawing(canvass as any, actionObject.pageIndex);
                            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                        }
                    }
            }
            if (actionObject.redoElement && actionObject.redoElement.modifiedDate !== undefined) {
                actionObject.annotation.modifiedDate = actionObject.redoElement.modifiedDate;
            }
            this.actionCollection.push(actionObject);
            this.updateToolbar();
            this.isUndoRedoAction = false;
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
        if (annotation) {
            var formFieldModel = this.pdfViewer.formDesigner.getFormField(annotation.id.split("_")[0]);
            let data: any = null;
            if (this.pdfViewer.formDesignerModule) {
                data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            }
            if (data) {
                var formFieldsData = JSON.parse(data);
                let index: number = this.pdfViewer.formDesigner.getFormFiledIndex(annotation.id.split('_')[0]);
                switch (formFieldAnnotationType) {
                    case 'Textbox':
                    case 'PasswordField':
                    case 'RadioButton':
                    case 'DropdownList':
                    case 'ListBox':
                        let inputElement: Element = document.getElementById(annotation.id.split("_")[0] + "_content_html_element").firstElementChild.firstElementChild;
                        if (formFieldAnnotationType == 'Textbox' || formFieldAnnotationType == 'PasswordField') {
                            formFieldModel.value = value;
                            this.pdfViewer.formDesigner.updateValuePropertyChange(formFieldModel, inputElement, true, index, formFieldsData);
                        }
                        else if (formFieldAnnotationType == 'RadioButton') {
                            formFieldModel.isSelected = value;
                            this.pdfViewer.formDesigner.updateIsSelectedPropertyChange(formFieldModel, inputElement.firstElementChild as IElement, true, index, formFieldsData);
                        }
                        else if (formFieldAnnotationType == 'DropdownList' || formFieldAnnotationType == 'ListBox') {
                            formFieldModel.selectedIndex = value;
                            formFieldsData[index].FormField.selectedIndex = value;
                            this.pdfViewerBase.formFieldCollection[index].FormField.selectedIndex = value;
                            (this.pdfViewer.nameTable as any)[formFieldsData[index].Key.split("_")[0]].selectedIndex = value;
                            if (formFieldAnnotationType == 'ListBox') {
                                for (let k: number = 0; k < (inputElement as IElement).options.length; k++) {
                                    (inputElement as IElement).options[k].selected = value.includes(k) ? true : false;
                                }
                            }
                            else {
                                (inputElement as IElement).selectedIndex = value;
                            }
                        }
                        break;
                    case 'Checkbox':
                        let checkboxDivElement: Element = document.getElementById(annotation.id.split("_")[0] + "_content_html_element").firstElementChild.firstElementChild.lastElementChild;
                        formFieldModel.isChecked = value;
                        this.pdfViewer.formDesigner.updateIsCheckedPropertyChange(formFieldModel, checkboxDivElement, true, index, formFieldsData);
                        break;
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
    }

    private updateFormFieldPropertiesChanges(formFieldAnnotationType: string, element: any): void {
        switch (formFieldAnnotationType) {
            case 'Textbox':
            case 'PasswordField':
                this.pdfViewer.formDesigner.updateTextboxFormDesignerProperties(element, true);
                break;
            case 'Checkbox':
                this.pdfViewer.formDesigner.updateCheckboxFormDesignerProperties(element, true);
                break;
            case 'RadioButton':
                this.pdfViewer.formDesigner.updateRadioButtonDesignerProperties(element, true);
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

    private updateToolbar(isAnnotationDelete?: boolean): void {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateUndoRedoButtons();
        }
        if (this.actionCollection && this.actionCollection.length == 0) {
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
        // eslint-disable-next-line max-len
        this.popupNote = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note', className: 'e-pv-annotation-note', styles: 'display:none' });
        this.popupNoteAuthor = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_author', className: 'e-pv-annotation-note-author' });
        this.popupNote.appendChild(this.popupNoteAuthor);
        // eslint-disable-next-line max-len
        this.popupNoteContent = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_content', className: 'e-pv-annotation-note-content' });
        this.popupNote.appendChild(this.popupNoteContent);
        this.pdfViewerBase.mainContainer.appendChild(this.popupNote);
    }

    /**
     * @param event
     * @param color
     * @param author
     * @param note
     * @param type
     * @param event
     * @param color
     * @param author
     * @param note
     * @param type
     * @private
     */
    // eslint-disable-next-line
    public showPopupNote(event: any, color: string, author: string, note: string, type: string): void {
        const mainContainerPosition: ClientRect = this.pdfViewerBase.mainContainer.getBoundingClientRect();
        const popupNoteClientRect: ClientRect = this.popupNote.getBoundingClientRect();
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
        if (this.popupNote) {
            this.popupNote.style.display = 'none';
        }
    }

    private createTextMarkupPopup(): void {
        const elementId: string = this.pdfViewer.element.id;
        // eslint-disable-next-line max-len
        this.popupElement = createElement('div', { id: elementId + '_popup_annotation_note', className: 'e-pv-annotation-popup-menu', styles: 'display:none' });
        const headerElement: HTMLElement = createElement('div', { id: elementId + '_popup_header', className: 'e-pv-annotation-popup-header' });
        // eslint-disable-next-line max-len
        this.authorPopupElement = createElement('div', { id: elementId + '_popup_author', className: 'e-pv-annotation-popup-author' });
        headerElement.appendChild(this.authorPopupElement);
        // eslint-disable-next-line max-len
        const closeBtn: HTMLElement = createElement('span', { id: elementId + '_popup_close', className: 'e-pv-annotation-popup-close e-pv-icon' });
        headerElement.appendChild(closeBtn);
        this.popupElement.appendChild(headerElement);
        // eslint-disable-next-line max-len
        this.modifiedDateElement = createElement('div', { id: elementId + '_popup_modified_time', className: 'e-pv-annotation-modified-time' });
        this.popupElement.appendChild(this.modifiedDateElement);
        // eslint-disable-next-line max-len
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

    // eslint-disable-next-line
    private onPopupElementMoveStart(event: any): void {
        if (event.type === 'touchstart') {
            event = event.changedTouches[0];
        }
        if ((event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            this.isPopupMenuMoved = true;
            const popupElementClientRect: ClientRect = this.popupElement.getBoundingClientRect();
            this.clientX = event.clientX - popupElementClientRect.left;
            // eslint-disable-next-line max-len
            this.clientY = (event.clientY - popupElementClientRect.top) + (this.pdfViewerBase.pageSize[this.currentAnnotPageNumber].top * this.pdfViewerBase.getZoomFactor());
        }
    }

    // eslint-disable-next-line
    private onPopupElementMove(event: any): void {
        if (event.type === 'touchmove') {
            event = event.changedTouches[0];
        }
        // eslint-disable-next-line max-len
        if (this.isPopupMenuMoved && (event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            const left: number = (event.clientX - this.clientX) + parseFloat(this.popupElement.style.left);
            const top: number = ((event.clientY - this.clientY) + parseFloat(this.popupElement.style.top));
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            const clientPosition: ClientRect = this.popupElement.getBoundingClientRect();
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
            // eslint-disable-next-line max-len
            if (left > parseFloat(pageDiv.style.left) && (left + clientPosition.width) < (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                this.popupElement.style.left = (left) + 'px';
            } else {
                this.popupElement.style.left = parseFloat(this.popupElement.style.left) + 'px';
            }
            // eslint-disable-next-line max-len
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
     * @param event
     * @private
     */
    // eslint-disable-next-line
    public showAnnotationPopup(event: any): void {
        if (this.textMarkupAnnotationModule) {
            this.currentAnnotPageNumber = this.getEventPageNumber(event);
            // eslint-disable-next-line max-len
            if (this.textMarkupAnnotationModule && (event.target !== (this.noteContentElement) || (event.target.contains(this.noteContentElement.childNodes[0])))) {
                this.hidePopupNote();
                if (!this.popupElement) {
                    this.createTextMarkupPopup();
                    this.popupElement.style.display = 'block';
                    this.authorPopupElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.author;
                    // eslint-disable-next-line max-len
                    this.modifiedDateElement.textContent = this.getProperDate(this.textMarkupAnnotationModule.currentTextMarkupAnnotation.modifiedDate);
                    this.noteContentElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.note;
                    const clientPosition: ClientRect = this.popupElement.getBoundingClientRect();
                    // eslint-disable-next-line max-len
                    const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
                    const canvasPosition: ClientRect = pageDiv.getBoundingClientRect();
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
     * @param args
     * @param isOpacity
     * @param args
     * @param isOpacity
     * @private
     */
    // eslint-disable-next-line
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
            if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureImage' || currentAnnotation.shapeAnnotationType === 'SignatureText') {
                // eslint-disable-next-line max-len
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, true, false, clonedObject.opacity, redoClonedObject.opacity);
            } else {
                this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
        }
    }

    /**
     * @param currentColor
     * @private
     */
    public modifyFontColor(currentColor: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontColor = currentColor;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { fontColor: currentColor });
        this.modifyInCollections(currentAnnotation, 'fontColor');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontColor', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param currentValue
     * @private
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
        this.modifyInCollections(currentAnnotation, 'fontFamily');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontFamily', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param currentValue
     * @private
     */
    public modifyFontSize(currentValue: number, isInteracted: boolean): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fontSize = currentValue;
        const freeTextAnnotation: FreeTextAnnotation = this.freeTextAnnotationModule;
        const x: number = currentAnnotation.bounds.x;
        const y: number = currentAnnotation.bounds.y;
        currentAnnotation.fontSize = currentValue;
        if (freeTextAnnotation && !freeTextAnnotation.isNewFreeTextAnnot && currentAnnotation.dynamicText !== '') {
            freeTextAnnotation.addInuptElemet({ x: x, y: y }, currentAnnotation);
            if (currentAnnotation) {
                if (currentAnnotation.previousFontSize > currentValue) {
                    freeTextAnnotation.inputBoxElement.style.height = 'auto';
                    if(isInteracted){
                        freeTextAnnotation.inputBoxElement.style.height = freeTextAnnotation.inputBoxElement.scrollHeight + 5 + 'px';
                    }
                    else{
                        if(freeTextAnnotation.inputBoxElement.scrollHeight + 5 > currentAnnotation.bounds.height){
                            freeTextAnnotation.inputBoxElement.style.height = freeTextAnnotation.inputBoxElement.scrollHeight + 5 + 'px';
                        }
                        else{
                            freeTextAnnotation.inputBoxElement.style.height = currentAnnotation.bounds.height + 'px';
                        }
                    }
                }
                let inputEleHeight: number = parseFloat(freeTextAnnotation.inputBoxElement.style.height);
                let inputEleWidth: number = parseFloat(freeTextAnnotation.inputBoxElement.style.width);
                const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
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
                // eslint-disable-next-line max-len
                this.pdfViewer.nodePropertyChange(currentAnnotation, { fontSize: currentValue, bounds: { width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height, y: y, x: x } });
                this.pdfViewer.renderSelector(currentAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
                currentAnnotation.previousFontSize = currentValue;
            }
            this.modifyInCollections(currentAnnotation, 'fontSize');
            this.modifyInCollections(currentAnnotation, 'bounds');
            this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'fontSize', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
        }
    }

    /**
     * @param currentValue
     * @private
     */
    public modifyTextAlignment(currentValue: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.textAlign = currentValue;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { textAlign: currentValue });
        this.modifyInCollections(currentAnnotation, 'textAlign');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'textAlign', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param fontInfo
     * @param action
     * @private
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
        this.pdfViewer.nodePropertyChange(currentAnnotation, { font: fontInfo });
        this.modifyInCollections(currentAnnotation, 'textPropertiesChange');
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'textPropertiesChange', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param thicknessValue
     * @private
     */
    public modifyThickness(thicknessValue: number): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        if (currentAnnotation.thickness !== thicknessValue) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            redoClonedObject.thickness = thicknessValue;
            this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: thicknessValue });
            this.modifyInCollections(currentAnnotation, 'thickness');
            if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
                // eslint-disable-next-line max-len
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, false, true, clonedObject.thickness, redoClonedObject.thickness);
            } else {
                this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
        }
    }

    /**
     * @param color
     * @private
     */
    public modifyStrokeColor(color: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.strokeColor = color;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: color });
        this.modifyInCollections(currentAnnotation, 'stroke');
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
            // eslint-disable-next-line max-len
            this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, true, false, false, clonedObject.strokeColor, redoClonedObject.strokeColor);
        } else {
            this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
        }
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param color
     * @private
     */
    public modifyFillColor(color: string): void {
        const currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fillColor = color;
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], { fillColor: color });
        this.modifyInCollections(currentAnnotation, 'fill');
        this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
        this.pdfViewer.renderDrawing();
    }

    /**
     * @param dynamicText
     * @param annotName
     * @private
     */
    public modifyDynamicTextValue(dynamicText: string, annotName: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = null;
        currentAnnotation = this.pdfViewer.annotations.filter((s: PdfAnnotationBaseModel) => s.annotName === annotName)[0];
        if (currentAnnotation) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            currentAnnotation.dynamicText = dynamicText;
            redoClonedObject.dynamicText = dynamicText;
            if (clonedObject.dynamicText === '') {
                clonedObject.dynamicText = this.freeTextAnnotationModule.previousText;
            }
            this.pdfViewer.nodePropertyChange(currentAnnotation, { dynamicText: dynamicText });
            this.pdfViewer.renderSelector(currentAnnotation.pageIndex, currentAnnotation.annotationSelectorSettings);
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'dynamicText Change', '', clonedObject, redoClonedObject);
            this.modifyInCollections(currentAnnotation, 'dynamicText');
            if (!isNullOrUndefined(this.freeTextAnnotationModule) && this.freeTextAnnotationModule.previousText !== 'Type Here' && this.freeTextAnnotationModule.previousText !== currentAnnotation.dynamicText) {
                this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false, false, false, false, true, this.freeTextAnnotationModule.previousText, currentAnnotation.dynamicText);
            }
            this.pdfViewer.renderDrawing();
        }
    }

    // eslint-disable-next-line
    private modifyInCollections(annotationBase: PdfAnnotationBaseModel, property: string): any {
        // eslint-disable-next-line
        let returnObj: any;
        if (annotationBase.measureType === '' || isNullOrUndefined(annotationBase.measureType)) {
            if (annotationBase.shapeAnnotationType === 'FreeText') {
                returnObj = this.freeTextAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'HandWrittenSignature' || annotationBase.shapeAnnotationType === 'SignatureText' || annotationBase.shapeAnnotationType === 'SignatureImage') {
                // eslint-disable-next-line max-len
                returnObj = this.pdfViewerBase.signatureModule.modifySignatureCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'Stamp') {
                returnObj = this.stampAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
            } else if (annotationBase.shapeAnnotationType === 'Ink') {
                // eslint-disable-next-line max-len
                returnObj = this.inkAnnotationModule.modifySignatureInkCollection(property, annotationBase.pageIndex, annotationBase);
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
                annotationBase.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
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
        if (!isBlazor()) {
            const elementID: string = this.pdfViewer.element.id;
            // eslint-disable-next-line max-len
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
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) },
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) }
                ];
            } else {
                this.propertiesDialog.buttons = [
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
                ];
            }
            if (this.pdfViewer.enableRtl) {
                this.propertiesDialog.enableRtl = true;
            }
            this.propertiesDialog.appendTo(dialogDiv);
            if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line') {
                // eslint-disable-next-line
                let fillColor: any = document.getElementById(this.pdfViewer.element.id + '_properties_fill_color');
                fillColor.disabled = true;
            }
            // eslint-disable-next-line max-len
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
            // eslint-disable-next-line
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
        } else {
            let opacityValue: number = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
            let lineStartElement: string = this.getArrowString(this.pdfViewer.selectedItems.annotations[0].sourceDecoraterShapes);
            let lineEndElement: string = this.getArrowString(this.pdfViewer.selectedItems.annotations[0].taregetDecoraterShapes);
            let lineStyleElement: string;
            // eslint-disable-next-line
            if (parseInt(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray) >= 3) {
                lineStyleElement = 'Dashed';
            } else if (this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray === '2') {
                lineStyleElement = 'Dotted';
            } else if (this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray === '0') {
                lineStyleElement = 'Solid';
            }
            this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenPropertiesDialog', opacityValue, lineStartElement, lineEndElement, lineStyleElement);
        }
    }

    private updatePropertiesWindowInBlazor(): void {
        // eslint-disable-next-line
        let thicknessElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_line_thickness');
        // eslint-disable-next-line
        let fillColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_fill_color_button');
        // eslint-disable-next-line
        let strokeColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_stroke_color_button');
        // eslint-disable-next-line
        let leaderLengthElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_leader_length');
        thicknessElement.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
        fillColorElement.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
        strokeColorElement.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        this.onStrokeColorChange(strokeColorElement.value);
        this.onFillColorChange(fillColorElement.value); 
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            // eslint-disable-next-line
            leaderLengthElement.value = parseInt(this.pdfViewer.selectedItems.annotations[0].leaderHeight.toString());
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
        // eslint-disable-next-line max-len
        const items: { [key: string]: Object }[] = [{ text: this.pdfViewer.localeObj.getConstant('None') }, { text: this.pdfViewer.localeObj.getConstant('Open Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Closed Arrow') },
        { text: this.pdfViewer.localeObj.getConstant('Round Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Square Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Diamond Arrow') }];
        // eslint-disable-next-line max-len
        const appearanceDiv: HTMLElement = createElement('div', { id: elementID + '_properties_appearance' });
        const lineStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-line-style-prop' });
        appearanceDiv.appendChild(lineStyleContainer);
        // eslint-disable-next-line max-len
        const lineHeadStartElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Start Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-start', elementID + '_properties_line_start');
        // eslint-disable-next-line max-len
        this.startArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-start', select: this.onStartArrowHeadStyleSelect.bind(this) }, (lineHeadStartElement as HTMLButtonElement));
        const lineHeadEndElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('End Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-end', elementID + '_properties_line_end');
        // eslint-disable-next-line max-len
        const borderStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-border-style' });
        appearanceDiv.appendChild(borderStyleContainer);
        // eslint-disable-next-line max-len
        this.endArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-end', select: this.onEndArrowHeadStyleSelect.bind(this) }, (lineHeadEndElement as HTMLButtonElement));
        const lineStyleElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Style'), borderStyleContainer, 'text', 'button', true, 'e-pv-properties-line-style', elementID + '_properties_line_style');
        const dropDownTarget: HTMLElement = this.createStyleList();
        // eslint-disable-next-line max-len
        this.lineStyleDropDown = new DropDownButton({ cssClass: 'e-pv-properties-line-style', target: dropDownTarget }, (lineStyleElement as HTMLButtonElement));
        // eslint-disable-next-line max-len
        const thicknessElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Thickness'), borderStyleContainer, 'text', 'input', true, 'e-pv-properties-line-thickness', elementID + '_properties_thickness');
        this.thicknessBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-thickness', min: 0, max: 12 }, (thicknessElement as HTMLInputElement));
        const colorStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-color-style' });
        appearanceDiv.appendChild(colorStyleContainer);
        // eslint-disable-next-line max-len
        const fillColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Fill Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-fill-color', elementID + '_properties_fill_color');
        this.fillColorPicker = this.createColorPicker(elementID + '_properties_fill_color', true);
        this.fillColorPicker.change = (args: ColorPickerEventArgs) => {
            const currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.fillDropDown.toggle();
            this.updateColorInIcon(this.fillDropDown.element, currentColor);
        };
        // eslint-disable-next-line max-len
        this.fillDropDown = this.createDropDownButton(fillColorElement, 'e-pv-properties-fill-color-icon', this.fillColorPicker.element.parentElement);
        this.fillDropDown.beforeOpen = this.onFillDropDownBeforeOpen.bind(this);
        this.fillDropDown.open = () => {
            this.fillColorPicker.refresh();
        };
        // eslint-disable-next-line max-len
        const strokeColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-stroke-color', elementID + '_properties_stroke_color');
        this.strokeColorPicker = this.createColorPicker(elementID + '_properties_stroke_color', false);
        this.strokeColorPicker.change = (args: ColorPickerEventArgs) => {
            const currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.strokeDropDown.toggle();
            this.updateColorInIcon(this.strokeDropDown.element, currentColor);
        };
        // eslint-disable-next-line max-len
        this.strokeDropDown = this.createDropDownButton(strokeColorElement, 'e-pv-properties-stroke-color-icon', this.strokeColorPicker.element.parentElement);
        this.strokeDropDown.beforeOpen = this.onStrokeDropDownBeforeOpen.bind(this);
        this.strokeDropDown.open = () => {
            this.strokeColorPicker.refresh();
        };
        const opacityContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-opacity-style' });
        appearanceDiv.appendChild(opacityContainer);
        // eslint-disable-next-line max-len
        const opacityElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Opacity'), opacityContainer, '', 'div', true, 'e-pv-properties-line-opacity', elementID + '_properties_opacity');
        this.opacitySlider = new Slider({
            type: 'MinRange', max: 100, min: 0, cssClass: 'e-pv-properties-line-opacity', change: () => {
                this.updateOpacityIndicator();
            }
        }, opacityElement);
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            // eslint-disable-next-line max-len
            const lineLengthElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Leader Length'), opacityContainer, 'text', 'input', true, 'e-pv-properties-line-leader-length', elementID + '_properties_leader_length');
            this.leaderLengthBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-leader-length', min: 0, max: 100 }, (lineLengthElement as HTMLInputElement));
        }
        return appearanceDiv;
    }

    private createContent(text: string): HTMLElement {
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
        // eslint-disable-next-line max-len
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

    /**
     * @param color
     * @private
     */
    public onFillColorChange(color: string): void {
        // eslint-disable-next-line
        let colorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_fill_color_button');
        if (color !== 'transparent') {
            (colorElement.children[0] as HTMLElement).style.borderBottomColor = color;
        }
    }

    /**
     * @param color
     * @private
     */
    public onStrokeColorChange(color: string): void {
        // eslint-disable-next-line
        let colorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_stroke_color_button');
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
        // eslint-disable-next-line max-len
        const spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-content', styles: 'border-bottom-style:' + style });
        divElement.appendChild(spanElement);
        return divElement;
    }

    private createListForStyle(style: string): HTMLElement {
        const liElement: HTMLElement = createElement('li', { className: 'e-menu-item' });
        const divElement: HTMLElement = createElement('div', { className: 'e-pv-line-styles-container' });
        // eslint-disable-next-line max-len
        const spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-item', styles: 'border-bottom-style:' + style });
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

    // eslint-disable-next-line max-len
    private createInputElement(labelText: string, parentElement: HTMLElement, inputType: string, input: string, isLabelNeeded: boolean, className: string, idString: string): HTMLElement {
        const container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        if (isLabelNeeded) {
            const label: HTMLElement = createElement('div', { id: idString + '_label', className: className + '-label' });
            label.textContent = labelText;
            container.appendChild(label);
        }
        if (this.pdfViewer.localeObj.getConstant('Opacity') === labelText) {
            this.opacityIndicator = createElement('span', { className: 'e-pv-properties-opacity-indicator' });
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

    /**
     * @private
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
            // eslint-disable-next-line max-len
            fillColor = (fillColor === '' || fillColor === '#transp' || this.fillColorPicker.value === '#ffffff00') ? '#ffffff00' : fillColor;
            opacity = (this.opacitySlider.value as number) / 100;
        } else {
            // eslint-disable-next-line
            let lineStartElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_line_start');
            // eslint-disable-next-line
            let lineEndElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_line_end');
            // eslint-disable-next-line
            let thicknessElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_line_thickness');
            // eslint-disable-next-line
            let lineStyleElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_style');
            // eslint-disable-next-line
            let fillColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_fill_color_button');
            // eslint-disable-next-line
            let strokeColorElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_stroke_color_button');
            // eslint-disable-next-line
            let opacityElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_opacity');
            startArrow = this.getArrowTypeFromDropDown(lineStartElement.value, true);
            endArrow = this.getArrowTypeFromDropDown(lineEndElement.value, true);
            // eslint-disable-next-line
            thickness = parseInt(thicknessElement.value);
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
        if (this.selectedLineDashArray !== currentAnnotation.wrapper.children[0].style.strokeDashArray) {
            newNode.borderDashArray = this.selectedLineDashArray;
            newNode.borderStyle = this.selectedLineStyle;
            redoClonedObject.borderDashArray = newNode.borderDashArray;
            redoClonedObject.borderStyle = newNode.borderStyle;
            isBorderDashArrayChanged = true;
        }
        if (!isBlazor()) {
            // eslint-disable-next-line max-len
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance' && this.leaderLengthBox.value !== this.pdfViewer.selectedItems.annotations[0].leaderHeight) {
                newNode.leaderHeight = this.leaderLengthBox.value;
            }
        } else {
            // eslint-disable-next-line
            let leaderLengthElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_properties_leader_length');
            // eslint-disable-next-line
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance' && parseInt(leaderLengthElement.value) !== this.pdfViewer.selectedItems.annotations[0].leaderHeight) {
                // eslint-disable-next-line
                newNode.leaderHeight = parseInt(leaderLengthElement.value);
            }
        }
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], newNode);
        this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill = fillColor;
        // eslint-disable-next-line max-len
        this.triggerAnnotationPropChange(this.pdfViewer.selectedItems.annotations[0], isColorChanged, isStrokeColorChanged, isThicknessChanged, isOpacityChanged, isLineHeadStartStyleChanged, isLineHeadEndStyleChanged, isBorderDashArrayChanged);
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'thickness');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'stroke');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'fill');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'opacity');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'dashArray');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'startArrow');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'endArrow');
        // eslint-disable-next-line max-len
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'leaderLength');
        }
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Line properties change', '', clonedObject, redoClonedObject);
        this.renderAnnotations(currentAnnotation.pageIndex, null, null, null);
        if (!isBlazor()) {
            this.propertiesDialog.hide();
        }
    }

    private onCancelClicked(): void {
        this.propertiesDialog.hide();
    }

    private getArrowTypeFromDropDown(arrowType: string, isBlazor?: boolean): DecoratorShapes {
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
     * @param arrow
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
            case 'Butt':
                arrowType = this.pdfViewer.localeObj.getConstant('Butt');
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
                if (!Browser.isDevice) {
                    this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
                }
            }
            this.pdfViewerBase.disableTextSelectionMode();
        } else {
            if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isPanMode && !this.pdfViewer.designerMode) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
            // eslint-disable-next-line max-len
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                // eslint-disable-next-line max-len
                const isSkip: boolean = this.pdfViewer.toolbar.annotationToolbarModule.inkAnnotationSelected;
                if (this.pdfViewer.annotation.freeTextAnnotationModule && !this.pdfViewer.annotation.freeTextAnnotationModule.isInuptBoxInFocus && !isSkip) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
                    this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(false);
                }
                this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(false);
            }
        }
    }

    /**
     * @param pdfAnnotationBase
     * @param event
     * @param pdfAnnotationBase
     * @param event
     * @private
     */
    // eslint-disable-next-line
    public onShapesMouseup(pdfAnnotationBase: PdfAnnotationBaseModel, event: any): void {
        // eslint-disable-next-line max-len
        pdfAnnotationBase = !isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0]) ? this.pdfViewer.selectedItems.annotations[0] : pdfAnnotationBase;
        if (pdfAnnotationBase) {
            if (this.textMarkupAnnotationModule && this.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
            }
            // eslint-disable-next-line max-len
            if ((this.pdfViewerBase.tool instanceof NodeDrawingTool || this.pdfViewerBase.tool instanceof LineTool) && !this.pdfViewerBase.tool.dragging) {
                // eslint-disable-next-line
                let setting: any = {
                    opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
                    thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
                    modifiedDate: pdfAnnotationBase.modifiedDate
                };
                const index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
                // eslint-disable-next-line
                let bounds: any = { left: pdfAnnotationBase.bounds.x, top: pdfAnnotationBase.bounds.y, width: pdfAnnotationBase.bounds.width, height: pdfAnnotationBase.bounds.height };
                if (this.pdfViewerBase.tool instanceof LineTool) {
                    setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
                    setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
                    setting.borderDashArray = pdfAnnotationBase.borderDashArray;
                }
                if (!this.pdfViewerBase.isAnnotationAdded || pdfAnnotationBase.measureType === 'Distance') {
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        // eslint-disable-next-line max-len
                        this.shapeAnnotationModule.renderShapeAnnotations(pdfAnnotationBase, this.pdfViewer.annotation.getEventPageNumber(event));
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' ||
                        pdfAnnotationBase.measureType === 'Radius') {
                        // eslint-disable-next-line max-len
                        this.measureAnnotationModule.renderMeasureShapeAnnotations(pdfAnnotationBase, this.pdfViewer.annotation.getEventPageNumber(event));
                    }
                }
                this.pdfViewerBase.updateDocumentEditedProperty(true);
            } else if (this.pdfViewerBase.tool instanceof MoveTool || this.pdfViewerBase.tool instanceof ResizeTool) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    if (pdfAnnotationBase.shapeAnnotationType === 'FreeText') {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotation.freeTextAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    } else if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText') {
                        // eslint-disable-next-line max-len
                        this.pdfViewerBase.signatureModule.modifySignatureCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    } else if (pdfAnnotationBase.shapeAnnotationType === 'Ink') {
                        // eslint-disable-next-line max-len
                        this.inkAnnotationModule.modifySignatureInkCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    } else if (pdfAnnotationBase.shapeAnnotationType === 'Stamp' || pdfAnnotationBase.shapeAnnotationType === 'Image') {
                        // eslint-disable-next-line max-len
                        this.stampAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    } else {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // eslint-disable-next-line max-len
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Radius' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                    this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                }
                if (this.pdfViewerBase.tool instanceof ResizeTool) {
                    if (!pdfAnnotationBase.formFieldAnnotationType) {
                        this.triggerAnnotationResize(pdfAnnotationBase);
                    }
                }
                if (this.pdfViewerBase.tool instanceof MoveTool) {
                    if (this.pdfViewerBase.action !== 'Select') {
                        if (!pdfAnnotationBase.formFieldAnnotationType) {
                            this.triggerAnnotationMove(pdfAnnotationBase);
                        }
                    }
                }
            } else if (this.pdfViewerBase.tool instanceof ConnectTool) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    // eslint-disable-next-line max-len
                    if ((pdfAnnotationBase.shapeAnnotationType === 'Line' || pdfAnnotationBase.shapeAnnotationType === 'LineWidthArrowHead' || pdfAnnotationBase.shapeAnnotationType === 'Polygon')) {
                        this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // eslint-disable-next-line max-len
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                    if (pdfAnnotationBase.measureType === 'Distance') {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('leaderLength', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                }
                this.triggerAnnotationResize(pdfAnnotationBase);
            }
            // eslint-disable-next-line max-len
            if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable && (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage')) {
                // eslint-disable-next-line max-len
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                // eslint-disable-next-line max-len
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], true);
            }
            if (this.pdfViewer.toolbarModule) {
                if (this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.clearTextMarkupMode();
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearMeasureMode();
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume' || pdfAnnotationBase.measureType === 'Radius') {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearShapeMode();
                    }
                    if (this.pdfViewer.selectedItems.annotations.length === 1 && this.pdfViewer.selectedItems.annotations[0].formFieldAnnotationType === null) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationPropertiesTools(true);
                    }
                    if (!isBlazor()) {
                        if (this.pdfViewer.selectedItems.annotations.length === 1 && !this.pdfViewer.designerMode) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(true);
                            this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                            this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                            // eslint-disable-next-line max-len
                            if(!this.pdfViewer.formDesignerModule && (pdfAnnotationBase as any).properties.id != '' && (pdfAnnotationBase as any).properties.id != null && (pdfAnnotationBase as any).properties.id.slice(0, 4) != 'sign'){
                                let id:any = document.getElementById((pdfAnnotationBase as any).properties.id) as any;
                                let isFieldReadOnly: boolean = id && id.disabled;                                
                                if(!isFieldReadOnly){
                                    this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                                }
                                else if(this.pdfViewer.annotation && isFieldReadOnly){
                                    this.pdfViewer.annotation.clearSelection();
                                }
                            }
                            else{
                                this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                            }                           
                            if (this.pdfViewer.isAnnotationToolbarVisible && this.pdfViewer.isFormDesignerToolbarVisible) {
                                let formDesignerMainDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + "_formdesigner_toolbar");
                                formDesignerMainDiv.style.display = "none";
                                if (this.pdfViewer.toolbarModule) {
                                    this.pdfViewer.toolbarModule.formDesignerToolbarModule.isToolbarHidden = false;
                                    this.pdfViewer.toolbarModule.formDesignerToolbarModule.showFormDesignerToolbar(this.pdfViewer.toolbarModule.formDesignerItem);
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
     * @param pdfAnnotationBase
     * @param isNewlyAdded
     * @param pdfAnnotationBase
     * @param isNewlyAdded
     * @private
     */
    public updateCalibrateValues(pdfAnnotationBase: PdfAnnotationBaseModel, isNewlyAdded?: boolean): void {
        if (pdfAnnotationBase.measureType === 'Distance') {
            pdfAnnotationBase.notes = updateDistanceLabel(pdfAnnotationBase, pdfAnnotationBase.vertexPoints, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Radius') {
            pdfAnnotationBase.notes = updateRadiusLabel(pdfAnnotationBase, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Perimeter') {
            pdfAnnotationBase.notes = updatePerimeterLabel(pdfAnnotationBase, pdfAnnotationBase.vertexPoints, this.measureAnnotationModule);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Area') {
            // eslint-disable-next-line max-len
            pdfAnnotationBase.notes = this.measureAnnotationModule.calculateArea(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
                updateCalibrateLabel(pdfAnnotationBase);
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Volume') {
            // eslint-disable-next-line max-len
            pdfAnnotationBase.notes = this.measureAnnotationModule.calculateVolume(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            if (pdfAnnotationBase.enableShapeLabel === true) {
                pdfAnnotationBase.labelContent = pdfAnnotationBase.notes;
                updateCalibrateLabel(pdfAnnotationBase);
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase, isNewlyAdded);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        }
    }

    /**
     * @private
     */
    public onAnnotationMouseDown(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1 && this.pdfViewer.selectedItems.annotations[0].formFieldAnnotationType === null) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                if (!isBlazor() && Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    let commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                    if (commentPanel.style.display === 'none') {
                        if (this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.toolbarModule.annotationToolbarModule.createPropertyTools("");
                        } else {
                            if (this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                                this.pdfViewer.toolbarModule.annotationToolbarModule.createPropertyTools(this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType);
                                let editIcon: any = document.getElementById(this.pdfViewer.element.id + '_annotationIcon');
                                if (editIcon && !editIcon.parentElement.classList.contains('e-pv-select')) {
                                    editIcon.parentElement.classList.add('e-pv-select');
                                }
                            }
                        }
                    }
                }
                this.enableBasedOnType();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
            }
        }
    }

    private enableBasedOnType(): void {
        let isLock: boolean = false;
        // eslint-disable-next-line
        let annotation: any = this.pdfViewer.selectedItems.annotations[0];
        if (annotation && annotation.annotationSettings) {
            // eslint-disable-next-line
            isLock = annotation.annotationSettings.isLock;
            if (isLock && this.checkAllowedInteractions('PropertyChange', annotation)) {
                isLock = false;
            }
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!isLock) {
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Path' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableFreeTextAnnotationPropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                } else {
                    if (this.pdfViewer.selectedItems.annotations.length === 1 && this.pdfViewer.selectedItems.annotations[0].formFieldAnnotationType === null) {
                        this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(true);
                    }
                }
            }
            // eslint-disable-next-line max-len
        } else if (!this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation && !((this.pdfViewer.selectedItems.annotations[0] as any).propName === 'annotations') && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.createMobileAnnotationToolbar(true, true);
        }
    }

    private getProperDate(date: string): string {
        let dateObject: Date = new Date(date.toString());
        if (isNaN(dateObject.getFullYear())) {
            let dateString: string = date.slice(2, 16);
            // eslint-disable-next-line max-len
            dateString = dateString.slice(0, 4) + '/' + dateString.slice(4, 6) + '/' + dateString.slice(6, 8) + ' ' + dateString.slice(8, 10) + ':' + dateString.slice(10, 12) + ':' + dateString.slice(12, 14);
            dateObject = new Date(dateString);
        }
        // eslint-disable-next-line max-len
        return (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    }

    /**
     * @param pageAnnotations
     * @param pageNumber
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
     * @param annotations
     * @param id
     * @param annotations
     * @param id
     * @private
     */
    // eslint-disable-next-line
    public getAnnotationWithId(annotations: any[], id: string): any {
        // eslint-disable-next-line
        let annotation: any;
        for (let i: number = 0; i < annotations.length; i++) {
            if (id === annotations[i].id) {
                annotation = annotations[i];
            }
        }
        return annotation;
    }

    /**
     * @param event
     * @private
     */
    // eslint-disable-next-line
    public getEventPageNumber(event: any): number {
        let eventTarget: HTMLElement = event.target as HTMLElement;
        let eventParentElement: HTMLElement = event.target.parentElement as HTMLElement;
        if (eventTarget.classList.contains('e-pv-hyperlink')) {
            eventTarget = eventParentElement;
        } else if (eventParentElement && eventParentElement.classList.contains('foreign-object') && eventParentElement.parentElement && eventParentElement.parentElement.parentElement && eventParentElement.parentElement.parentElement.parentElement) {
            eventTarget = eventParentElement.parentElement.parentElement.parentElement;
        }
        else if (eventTarget.classList.contains('e-pdfviewer-formFields')) {
            eventTarget = eventParentElement;
        }
        let pageString: any;
        if (eventTarget) {
            // eslint-disable-next-line
            pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
        }
        if (isNaN(pageString)) {
            event = this.pdfViewerBase.annotationEvent;
            if (event) {
                eventTarget = event.target as HTMLElement;
                // eslint-disable-next-line
                pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
            }
        }
        // eslint-disable-next-line
        return parseInt(pageString);
    }

    /**
     * @param commentsAnnotations
     * @param parentAnnotation
     * @param author
     * @param commentsAnnotations
     * @param parentAnnotation
     * @param author
     * @param commentsAnnotations
     * @param parentAnnotation
     * @param author
     * @private
     */
    // eslint-disable-next-line
    public getAnnotationComments(commentsAnnotations: any, parentAnnotation: any, author: string): any {
        const newArray: ICommentsCollection[] = [];
        let annotationObject: ICommentsCollection = null;
        if (commentsAnnotations) {
            if (commentsAnnotations.length > 0) {
                for (let i: number = 0; i < commentsAnnotations.length; i++) {
                    // eslint-disable-next-line
                    let annotation: any = commentsAnnotations[i];
                    annotationObject = {
                        // eslint-disable-next-line max-len
                        shapeAnnotationType: 'sticky', author: annotation.Author, modifiedDate: annotation.ModifiedDate, note: annotation.Note, state: annotation.state, stateModel: annotation.stateModel,
                        comments: [], review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                        annotName: annotation.AnnotName, parentId: parentAnnotation.AnnotName, subject: 'Comments',
                        isLock: annotation.IsLock
                    };
                    newArray[newArray.length] = annotationObject;
                }
            }
        }
        return newArray;
    }

    private getRandomNumber(): string {
        // eslint-disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any): string {
            // eslint-disable-next-line
            let random: any = Math.random() * 16 | 0, v = c == 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    }

    /**
     * @private
     */
    public createGUID(): string {
        // eslint-disable-next-line max-len
        return this.getRandomNumber();
    }

    /**
     * @param pageDiv
     * @param pageWidth
     * @param pageHeight
     * @param pageNumber
     * @param displayMode
     * @param pageDiv
     * @param pageWidth
     * @param pageHeight
     * @param pageNumber
     * @param displayMode
     * @private
     */
    // eslint-disable-next-line max-len
    public createAnnotationLayer(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number, displayMode: string): HTMLElement {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            this.updateCanvas(canvas as any, pageWidth, pageHeight, pageNumber);
            return canvas;
        } else {
            // eslint-disable-next-line max-len
            const annotationCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' }) as HTMLCanvasElement;
            this.updateCanvas(annotationCanvas as any, pageWidth, pageHeight, pageNumber);
            pageDiv.appendChild(annotationCanvas);
            return annotationCanvas;
        }

    }

    /**
     * @param width
     * @param height
     * @param pageNumber
     * @private
     */
    public resizeAnnotations(width: number, height: number, pageNumber: number): void {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
        }
    }

    /**
     * @param pageNumber
     * @private
     */
    public clearAnnotationCanvas(pageNumber: number): void {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        let zoom: number = this.pdfViewerBase.getZoomFactor();
        let ratio: number = this.pdfViewerBase.getZoomRatio(zoom);
        if (canvas) {
            let width: number = this.pdfViewerBase.pageSize[pageNumber].width;
            let height: number = this.pdfViewerBase.pageSize[pageNumber].height;
            (canvas as HTMLCanvasElement).width = width * ratio;
            (canvas as HTMLCanvasElement).height = height * ratio;
            (canvas as any).style.width = width * zoom + 'px';
            (canvas as any).style.height = height * zoom + 'px';
        }
    }

    /**
     * @param pageNumber
     * @param shapeAnnotation
     * @param measureShapeAnnotation
     * @param textMarkupAnnotation
     * @param canvas
     * @param isImportAnnotations
     * @param pageNumber
     * @param shapeAnnotation
     * @param measureShapeAnnotation
     * @param textMarkupAnnotation
     * @param canvas
     * @param isImportAnnotations
     * @param pageNumber
     * @param shapeAnnotation
     * @param measureShapeAnnotation
     * @param textMarkupAnnotation
     * @param canvas
     * @param isImportAnnotations
     * @private
     */
    // eslint-disable-next-line
    public renderAnnotations(pageNumber: number, shapeAnnotation: any, measureShapeAnnotation: any, textMarkupAnnotation: any, canvas?: any, isImportAnnotations?: boolean, isAnnotOrderAction?: boolean): void {
        this.clearAnnotationCanvas(pageNumber);
        if (this.shapeAnnotationModule) {
            if (isImportAnnotations) {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber, true);
            } else {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber, null, isAnnotOrderAction);
            }
        }
        if (this.measureAnnotationModule) {
            if (isImportAnnotations) {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber, true);
            } else {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber, null, isAnnotOrderAction);
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
                // eslint-disable-next-line
                this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber, true);
            } else {
                // eslint-disable-next-line
                this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber);
            }
        }
    }
    /**
     * @param pageNumber
     * @param annotation
     * @param annotationId
     * @param pageNumber
     * @param annotation
     * @param annotationId
     * @param pageNumber
     * @param annotation
     * @param annotationId
     * @private
     */
    // eslint-disable-next-line
    public storeAnnotations(pageNumber: number, annotation: any, annotationId: string): number {
        // let annotationId: string = '_annotations_textMarkup';
        // if (annotation is ITextMarkupAnnotation) {
        //     annotationId = '_annotations_textMarkup';
        // } else if (annotation as IShapeAnnotation) {
        //     annotationId = '_annotations_shape';
        // } else {
        //     annotationId = '_annotations_stamp';
        // }
        // eslint-disable-next-line
        let sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        if (sessionSize > 4500) {
            this.clearAnnotationStorage();
            this.pdfViewerBase.isStorageExceed = true;
            if(!(this.pdfViewerBase.isFormStorageExceed)){
                this.pdfViewer.formFieldsModule.clearFormFieldStorage();
            }
        }
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + annotationId);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + annotationId];
        }
        let index: number = 0;
        if (!storeObject) {
            this.storeAnnotationCollections(annotation, pageNumber);
            const pageAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            pageAnnotation.annotations.push(annotation);
            index = pageAnnotation.annotations.indexOf(annotation);
            const annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(pageAnnotation);
            const annotationStringified: string = JSON.stringify(annotationCollection);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + annotationId] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + annotationId, annotationStringified);
            }
        } else {
            this.storeAnnotationCollections(annotation, pageNumber);
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + annotationId);
            }
            const pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                (annotObject[pageIndex] as IPageAnnotations).annotations.filter(function (item, index) {
                    if (item.annotName === annotation.annotName) {
                        (annotObject[pageIndex] as IPageAnnotations).annotations.splice(index, 1)

                    }
                });
                (annotObject[pageIndex] as IPageAnnotations).annotations.push(annotation);
                index = (annotObject[pageIndex] as IPageAnnotations).annotations.indexOf(annotation);
            } else {
                const markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + annotationId] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + annotationId, annotationStringified);
            }
        }
        return index;
    }

    /**
     * @param type
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
                decoratorShapes = 'Butt';
                break;
            case 'Slash':
                // decoratorShapes = 'Slash';
                break;
        }
        return decoratorShapes;
    }

    /**
     * @param arrow
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
            case 'Butt':
                arrowType = 'Butt';
                break;
        }
        return arrowType;
    }

    /**
     * @param bound
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public getBounds(bound: any, pageIndex: number): any {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { left: bound.top, top: pageDetails.width - (bound.left + bound.width), width: bound.height, height: bound.width };
            } else if (pageDetails.rotation === 2) {
                // eslint-disable-next-line max-len
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
     * @param bound
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public getInkBounds(bound: any, pageIndex: number): any {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { x: bound.y, y: pageDetails.width - (bound.x + bound.width), width: bound.height, height: bound.width };
            } else if (pageDetails.rotation === 2) {
                // eslint-disable-next-line max-len
                return { x: pageDetails.width - bound.x - bound.width, y: pageDetails.height - bound.y - bound.height, width: bound.width, height: bound.height };
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
     * @param points
     * @param pageIndex
     * @param points
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public getVertexPoints(points: any[], pageIndex: number): any {
        if (points) {
            const pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
            if (pageDetails.rotation === 1) {
                const points1: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    const point: PointModel = { x: points[i].y, y: pageDetails.width - points[i].x };
                    points1.push(point);
                }
                return points1;
            } else if (pageDetails.rotation === 2) {
                const points2: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    const point: PointModel = { x: pageDetails.width - points[i].x, y: pageDetails.height - points[i].y };
                    points2.push(point);
                }
                return points2;
            } else if (pageDetails.rotation === 3) {
                const points3: PointModel[] = [];
                for (let i: number = 0; i < points.length; i++) {
                    const point: PointModel = { x: pageDetails.height - points[i].y, y: points[i].x };
                    points3.push(point);
                }
                return points3;
            } else {
                return points;
            }
        }
    }

    /**
     * @param pageIndex
     * @param shapeAnnotations
     * @param idString
     * @param pageIndex
     * @param shapeAnnotations
     * @param idString
     * @private
     */
    // eslint-disable-next-line
    public getStoredAnnotations(pageIndex: number, shapeAnnotations: any[], idString: string): any[] {
        // eslint-disable-next-line
        let annotationCollection: any[];
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + idString);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + idString];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
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
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @param pdfAnnotationBase
     * @param isColor
     * @param isStroke
     * @param isThickness
     * @param isOpacity
     * @param isLineStart
     * @param isLineEnd
     * @param isDashArray
     * @param isFreeText
     * @param previousText
     * @param currentText
     * @private
     */
    // eslint-disable-next-line max-len
    public triggerAnnotationPropChange(pdfAnnotationBase: PdfAnnotationBaseModel, isColor: boolean, isStroke: boolean, isThickness: boolean, isOpacity: boolean, isLineStart?: boolean, isLineEnd?: boolean, isDashArray?: boolean, isFreeText?: boolean, previousText?: string, currentText?: string): void {
        const index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        // eslint-disable-next-line max-len
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
     * @param pdfAnnotationBase
     * @private
     */
    public triggerAnnotationAdd(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        // eslint-disable-next-line
        let setting: any = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        // eslint-disable-next-line
        let bounds: any = { left: pdfAnnotationBase.wrapper.bounds.x, top: pdfAnnotationBase.wrapper.bounds.y, width: pdfAnnotationBase.wrapper.bounds.width, height: pdfAnnotationBase.wrapper.bounds.height };
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        let labelSettings: ShapeLabelSettingsModel;
        if (this.pdfViewer.enableShapeLabel) {
            labelSettings = {
                // eslint-disable-next-line max-len
                fontColor: pdfAnnotationBase.fontColor, fontSize: pdfAnnotationBase.fontSize, fontFamily: pdfAnnotationBase.fontFamily,
                opacity: pdfAnnotationBase.labelOpacity, labelContent: pdfAnnotationBase.labelContent, fillColor: pdfAnnotationBase.labelFillColor
            };
            // eslint-disable-next-line max-len
            this.pdfViewer.fireAnnotationAdd(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, bounds, setting, null, null, null, labelSettings);
        } else {
            // eslint-disable-next-line max-len
            this.pdfViewer.fireAnnotationAdd(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, bounds, setting);
        }
    }

    /**
     * @param pdfAnnotationBase
     * @private
     */
    public triggerAnnotationResize(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        // eslint-disable-next-line
        let setting: any = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        const index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
        // eslint-disable-next-line
        let annotationBounds: any = pdfAnnotationBase.bounds;
        const currentPosition: object = { left: annotationBounds.x, top: annotationBounds.y, x: annotationBounds.x, y: annotationBounds.y, width: annotationBounds.width, height: annotationBounds.height };
        // eslint-disable-next-line max-len
        const previousPosition: object = { left: annotationBounds.oldProperties.x, top: annotationBounds.oldProperties.y, width: annotationBounds.oldProperties.width, height: annotationBounds.oldProperties.height };
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        let labelSettings: ShapeLabelSettingsModel;
        if (this.pdfViewer.enableShapeLabel && (pdfAnnotationBase.shapeAnnotationType !== 'HandWrittenSignature')) {
            labelSettings = {
                // eslint-disable-next-line max-len
                fontColor: pdfAnnotationBase.fontColor, fontSize: pdfAnnotationBase.fontSize, fontFamily: pdfAnnotationBase.fontFamily,
                opacity: pdfAnnotationBase.labelOpacity, labelContent: pdfAnnotationBase.labelContent, fillColor: pdfAnnotationBase.labelFillColor, notes: pdfAnnotationBase.notes
            };
            // eslint-disable-next-line max-len
            this.pdfViewer.fireAnnotationResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, currentPosition, setting, null, null, null, labelSettings);
        } else {
            if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage') {
                // eslint-disable-next-line max-len
                this.pdfViewer.fireSignatureResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.signatureName, pdfAnnotationBase.shapeAnnotationType as AnnotationType, pdfAnnotationBase.opacity, pdfAnnotationBase.strokeColor, pdfAnnotationBase.thickness, currentPosition, previousPosition);
            } else {
                // eslint-disable-next-line max-len
                this.pdfViewer.fireAnnotationResize(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, currentPosition, setting);
            }
        }
    }

    /**
     * @param pdfAnnotationBase
     * @private
     */
    // eslint-disable-next-line
    public triggerAnnotationMove(pdfAnnotationBase: PdfAnnotationBaseModel, isMoving?: boolean): void {
        // eslint-disable-next-line
        let setting: any = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        // eslint-disable-next-line
        let annotationBounds: any = pdfAnnotationBase.bounds;
        const currentPosition: object = { left: annotationBounds.x, top: annotationBounds.y, x: annotationBounds.x, y: annotationBounds.y, width: annotationBounds.width, height: annotationBounds.height };
        // eslint-disable-next-line max-len
        const previousPosition: object = { left: annotationBounds.oldProperties.x ? annotationBounds.oldProperties.x : annotationBounds.x  , top: annotationBounds.oldProperties.y ? annotationBounds.oldProperties.y : annotationBounds.y , width: annotationBounds.width, height: annotationBounds.height };
        const type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        if (pdfAnnotationBase.shapeAnnotationType === 'HandWrittenSignature' || pdfAnnotationBase.shapeAnnotationType === 'SignatureText' || pdfAnnotationBase.shapeAnnotationType === 'SignatureImage') {
            // eslint-disable-next-line max-len
            this.pdfViewer.fireSignatureMove(pdfAnnotationBase.pageIndex, pdfAnnotationBase.signatureName, pdfAnnotationBase.shapeAnnotationType as AnnotationType, pdfAnnotationBase.opacity, pdfAnnotationBase.strokeColor, pdfAnnotationBase.thickness, previousPosition, currentPosition);
        } else {
            // eslint-disable-next-line max-len
            isMoving ? this.pdfViewer.fireAnnotationMoving(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, setting, previousPosition, currentPosition) : this.pdfViewer.fireAnnotationMove(pdfAnnotationBase.pageIndex, pdfAnnotationBase.annotName, type, setting, previousPosition, currentPosition);
        }
    }

    /**
     * @param annotationId
     * @param pageNumber
     * @param annotation
     * @param annotationCollection
     * @param isDblClick
     * @param isSelected
     * @private
     */
    // eslint-disable-next-line
    public annotationSelect(annotationId: any, pageNumber: number, annotation: any, annotationCollection?: any, isDblClick?: boolean, isSelected?: boolean): void {
        // eslint-disable-next-line
        let annotSettings: any;
        if (annotation.shapeAnnotationType === 'textMarkup') {
            // eslint-disable-next-line max-len
            annotSettings = { type: 'TextMarkup', subType: annotation.subject, opacity: annotation.opacity, color: annotation.color, textMarkupContent: annotation.textMarkupContent, textMarkupStartIndex: annotation.textMarkupStartIndex, textMarkupEndIndex: annotation.textMarkupEndIndex, customData: annotation.customData };
        } else if (annotation.shapeAnnotationType === 'StickyNotes') {
            annotSettings = { type: 'StickyNotes', opacity: annotation.opacity, customData: annotation.customData };
        } else if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
            annotSettings = { type: 'Stamp', opacity: annotation.opacity, customData: annotation.customData };
        } else if (annotation.shapeAnnotationType === 'Ink') {
            annotSettings = {
                // eslint-disable-next-line max-len
                type: 'Ink', opacity: annotation.opacity, strokeColor: annotation.strokeColor, thickness: annotation.thickness, modifiedDate: annotation.modifiedDate,
                width: annotation.bounds.width, height: annotation.bounds.height, left: annotation.bounds.x, top: annotation.bounds.y, data: annotation.data, customData: annotation.customData
            };
        } else if (annotation.shapeAnnotationType === 'FreeText') {
            annotSettings = {
                type: 'FreeText', opacity: annotation.opacity, fillColor: annotation.fillColor,
                // eslint-disable-next-line max-len
                strokeColor: annotation.strokeColor, thickness: annotation.thickness, content: annotation.dynamicText,
                // eslint-disable-next-line max-len
                fontFamily: annotation.fontFamily, fontSize: annotation.fontSize, fontColor: annotation.fontColor, textAlign: annotation.textAlign, fontStyle: this.updateFreeTextFontStyle(annotation.font), customData: annotation.customData
            };
        } else if (annotation.measureType === '') {
            if (annotation.shapeAnnotationType === 'Line') {
                // eslint-disable-next-line max-len
                annotSettings = { type: 'Shape', subType: 'Line', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes, customData: annotation.customData };
            } else if (annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead') {
                // eslint-disable-next-line max-len
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
                // eslint-disable-next-line max-len
                annotSettings = { type: 'Measure', subType: 'Distance', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes, customData: annotation.customData };
            } else if (annotation.measureType === 'Perimeter') {
                // eslint-disable-next-line max-len
                annotSettings = { type: 'Measure', subType: 'Perimeter', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray,lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes, customData: annotation.customData };
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
        // eslint-disable-next-line
        let overlappedCollection: any = [];
        // eslint-disable-next-line
        let overlappedAnnotations: any = this.getOverlappedAnnotations(annotation, pageNumber);
        if (overlappedAnnotations && this.overlappedCollections) {
            // eslint-disable-next-line
            let overlappedCollections: any = [];
            // eslint-disable-next-line
            for (let i: number = 0; i < overlappedAnnotations.length; i++) {
                if (overlappedAnnotations[i].shapeAnnotationType !== 'textMarkup' && this.overlappedCollections || isSelected) {
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
            // eslint-disable-next-line
            for (let i: number = 0; i < overlappedAnnotations.length; i++) {
                if (overlappedAnnotations[i].shapeAnnotationType === 'textMarkup') {
                    let isOverlapped: boolean = false;
                    for (let j: number = 0; j < overlappedAnnotations[i].bounds.length; j++) {
                        // eslint-disable-next-line
                        let bounds: any = this.orderTextMarkupBounds(overlappedAnnotations[i].bounds[j]);
                        // eslint-disable-next-line
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
            // eslint-disable-next-line
            for (let i: number = 0; i < annotationCollection.length; i++) {
                // eslint-disable-next-line
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
        const annotationAddMode: string = annotation.annotationAddMode;
        if (!isDblClick) {
            if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
                if (!this.pdfViewerBase.isNewStamp && this.annotationSelected) {
                    if (overlappedCollection) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, overlappedCollection, null, null, annotationAddMode);
                    } else {
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, null, null, null, annotationAddMode);
                    }
                }
            } else {
                let module:any = this.textMarkupAnnotationModule;
                let multiPageCollection: ITextMarkupAnnotation[] = module && module.multiPageCollectionList(annotation);
                if (multiPageCollection && multiPageCollection.length === 0) {
                    multiPageCollection = null;
                }
                if (this.annotationSelected) {
                    if (overlappedCollection) {
                        isSelected = false;
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, overlappedCollection, multiPageCollection, isSelected, annotationAddMode);
                    } else {
                        isSelected = true;
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings, null, multiPageCollection, isSelected, annotationAddMode);
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

    // eslint-disable-next-line
    public selectSignature(signatureId: string, pageNumber: number, signatureModule: any): void {
        // eslint-disable-next-line
        let annotBounds: any = signatureModule.bounds;
        // eslint-disable-next-line
        let bounds: any = { height: annotBounds.height, width: annotBounds.width, x: annotBounds.x, y: annotBounds.y };
        if (!this.pdfViewerBase.signatureAdded) {
            // eslint-disable-next-line max-len
            const signature: object = { bounds: bounds, opacity: signatureModule.opacity, thickness: signatureModule.thickness, strokeColor: signatureModule.strokeColor };
            this.pdfViewer.fireSignatureSelect(signatureId, pageNumber, signature);
        }
    }

    // eslint-disable-next-line
    public editSignature(signature: any): void {
        // eslint-disable-next-line
        let currentAnnotation: any;
        if (signature.uniqueKey) {
            // eslint-disable-next-line
            currentAnnotation = (this.pdfViewer.nameTable as any)[signature.uniqueKey];
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        const pageNumber: number = currentAnnotation.pageIndex;
        if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
            // eslint-disable-next-line
            let clonedObject: any = cloneObject(currentAnnotation);
            // eslint-disable-next-line
            let redoClonedObject: any = cloneObject(currentAnnotation);
            if (currentAnnotation.opacity !== signature.opacity) {
                redoClonedObject.opacity = signature.opacity;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: signature.opacity });
                // eslint-disable-next-line max-len
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, true, false, clonedObject.opacity, redoClonedObject.opacity);
                // eslint-disable-next-line max-len
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
            }
            if (currentAnnotation.strokeColor !== signature.strokeColor) {
                redoClonedObject.strokeColor = signature.strokeColor;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: signature.strokeColor });
                // eslint-disable-next-line max-len
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, true, false, false, clonedObject.strokeColor, redoClonedObject.strokeColor);
                // eslint-disable-next-line max-len
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
            }
            if (currentAnnotation.thickness !== signature.thickness) {
                redoClonedObject.thickness = signature.thickness;
                this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: signature.thickness });
                // eslint-disable-next-line max-len
                this.pdfViewer.fireSignaturePropertiesChange(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType as AnnotationType, false, false, true, clonedObject.thickness, redoClonedObject.thickness);
                // eslint-disable-next-line max-len
                this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
            }
            currentAnnotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.signatureModule.modifySignatureCollection(null, pageNumber, currentAnnotation, true);
        }
    }

    // eslint-disable-next-line
    private deletComment(commentDiv: any): void {
        if (commentDiv.parentElement.firstChild === commentDiv) {
            this.deleteAnnotation();
        } else {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.modifyCommentDeleteProperty(commentDiv.parentElement, commentDiv);
        }
    }

    // eslint-disable-next-line
    private addReplyComments(currentAnnotation: any, replyComment: string, commentType: string): void {
        if (commentType === 'add') {
            // eslint-disable-next-line
            let commentsMainDiv: any = document.getElementById(currentAnnotation.annotName);
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.createCommentDiv(commentsMainDiv);
            for (let j: number = 0; j < replyComment.length; j++) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveCommentDiv(commentsMainDiv, replyComment[j]);
            }
        } else if (commentType === 'next') {
            // eslint-disable-next-line
            let commentsMainDiv: any = document.getElementById(currentAnnotation.annotationId);
            this.selectAnnotation(currentAnnotation);
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveCommentDiv(commentsMainDiv, replyComment);

        }
    }

    private editComments(commentId: string, editComment: string): void {
        // eslint-disable-next-line
        let commentDiv: any = document.getElementById(commentId);
        commentDiv.childNodes[1].ej2_instances[0].value = editComment;
    }

    // eslint-disable-next-line
    public editAnnotation(annotation: any): void {
        // eslint-disable-next-line
        let currentAnnotation: any;
        let annotationId: string;
        let annotationType: string;
        let pageNumber: number;
        let isTextMarkupUpdate: boolean = false;
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
            // eslint-disable-next-line
            currentAnnotation = (this.pdfViewer.nameTable as any)[annotation.uniqueKey];
            currentAnnotation.annotationSettings.isLock = annotation.annotationSettings.isLock;
            annotationId = currentAnnotation.annotName;
            pageNumber = currentAnnotation.pageIndex;
            if (isBlazor()) {
                if (annotation.allowedInteractions) {
                    const allowedInteractionsCount: number = annotation.allowedInteractions.length;
                    for (let i: number = 0; i < allowedInteractionsCount; i++) {
                        if (annotation.allowedInteractions[i] === 0) {
                            annotation.allowedInteractions[i] = AllowedInteraction.Select;
                        }
                        if (annotation.allowedInteractions[i] === 1) {
                            annotation.allowedInteractions[i] = AllowedInteraction.Move;
                        }
                        if (annotation.allowedInteractions[i] === 2) {
                            annotation.allowedInteractions[i] = AllowedInteraction.Resize;
                        }
                        if (annotation.allowedInteractions[i] === 3) {
                            annotation.allowedInteractions[i] = AllowedInteraction.Delete;
                        }
                        if (annotation.allowedInteractions[i] === 4) {
                            annotation.allowedInteractions[i] = AllowedInteraction.PropertyChange;
                        }
                        if (annotation.allowedInteractions[i] === 5) {
                            annotation.allowedInteractions[i] = AllowedInteraction.None;
                        }
                    }
                }
            }
            // eslint-disable-next-line
            currentAnnotation.allowedInteractions = annotation.allowedInteractions ? annotation.allowedInteractions : this.updateAnnotationAllowedInteractions(annotation)
        }
        if (!currentAnnotation) {
            if (annotation.shapeAnnotationType === 'sticky' && annotation.annotationId !== undefined) {
                // eslint-disable-next-line
                currentAnnotation = (this.pdfViewer.nameTable as any)[annotation.annotationId];
                currentAnnotation.annotationSettings.isLock = annotation.annotationSettings.isLock;
                annotationId = currentAnnotation.annotName;
                pageNumber = currentAnnotation.pageIndex;
            }
        }
        if (annotation.shapeAnnotationType === 'textMarkup') {
            if (!this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                // eslint-disable-next-line max-len
                currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.getAnnotations(annotation.pageNumber, annotation);
                for (let i: number = 0; i < currentAnnotation.length; i++) {
                    if (annotation.annotationId === currentAnnotation[i].annotName) {
                        isTextMarkupUpdate = true;
                        currentAnnotation = currentAnnotation[i];
                        currentAnnotation.isPrint = annotation.isPrint;
                        this.textMarkupAnnotationModule.currentTextMarkupAnnotation = currentAnnotation;
                        this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = currentAnnotation.pageNumber;
                        currentAnnotation.allowedInteractions = annotation.allowedInteractions;
                        pageNumber = currentAnnotation.pageNumber;
                        annotationId = annotation.annotationId;
                        break;
                    }
                }
            }
        }
        if (currentAnnotation) {
            // eslint-disable-next-line
            let clonedObject: any = cloneObject(currentAnnotation);
            // eslint-disable-next-line
            let redoClonedObject: any = cloneObject(currentAnnotation);
            if (annotation.shapeAnnotationType === 'textMarkup') {
                annotationType = 'textMarkup';
            }
            if (annotation && annotation.isCommentLock === true) {
                currentAnnotation.isCommentLock = annotation.isCommentLock;
            }
            if (annotation.comments) {
                for (let j: number = 0; j < annotation.comments.length; j++) {
                    if (annotation.comments[j].isLock === true) {
                        if (annotationType) {
                            currentAnnotation.comments = annotation.comments;
                            currentAnnotation.comments[j].isLock = annotation.comments[j].isLock;
                        } else {
                            currentAnnotation.properties.comments = annotation.comments;
                            currentAnnotation.properties.comments[j].isLock = annotation.comments[j].isLock;
                        }
                    }
                }
            }
            if (annotation && annotation.note !== '' && annotation.note !== undefined) {
                if (annotationType) {
                    currentAnnotation.note = annotation.note;
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addTextToComments(currentAnnotation.annotName, currentAnnotation.note);
                } else {
                    currentAnnotation.notes = annotation.note;
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addTextToComments(currentAnnotation.annotName, currentAnnotation.notes);
                }
            } else {
                if (annotation && annotation.isCommentLock && ((annotation.type && annotation.type !== 'FreeText' )|| annotation.shapeAnnotationType !== 'FreeText')) {
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addTextToComments(currentAnnotation.annotName, '  ');
                }
            }
            if (annotation.commentId && annotation.editComment && annotation.commentType === 'edit') {
                this.editComments(annotation.commentId, annotation.editComment);
            }
            if (annotation.replyComment && annotation.commentType === 'add') {
                this.addReplyComments(currentAnnotation, annotation.replyComment, annotation.commentType);
                this.pdfViewer.annotationCollection[0].note = annotation.note;
            }
            if (annotation.nextComment && annotation.commentType === 'next') {
                this.addReplyComments(annotation, annotation.nextComment, annotation.commentType);
            }
            if (annotation.note === '' && annotation.commentType === 'delete') {
                // eslint-disable-next-line
                let commentDiv: any = document.getElementById(annotation.annotationId);
                this.deletComment(commentDiv);
            }
            if (annotation.comments) {
                for (let j: number = 0; j < annotation.comments.length; j++) {
                    if (annotation.comments[j].note === '' && annotation.commentType === 'delete') {
                        // eslint-disable-next-line
                        let commentDiv: any = document.getElementById(annotation.comments[j].annotName);
                        this.deletComment(commentDiv);
                    }
                }
            }
            if (annotation.type === 'TextMarkup' || annotation.shapeAnnotationType === 'textMarkup') {
                if (currentAnnotation.annotationSettings && annotation.annotationSettings) {
                    if (currentAnnotation.annotationSettings.isLock !== annotation.annotationSettings.isLock) {
                        // eslint-disable-next-line max-len
                        const pageAnnotations: ITextMarkupAnnotation[] = this.textMarkupAnnotationModule.modifyAnnotationProperty('AnnotationSettings', annotation.annotationSettings.isLock, null);
                        // eslint-disable-next-line max-len
                        this.textMarkupAnnotationModule.manageAnnotations(pageAnnotations, this.textMarkupAnnotationModule.selectTextMarkupCurrentPage);
                    }
                }
                if (currentAnnotation.opacity !== annotation.opacity) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(null, annotation.opacity);
                }
                if (currentAnnotation.color !== annotation.color) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(annotation.color);
                }
                annotationType = 'textMarkup';
                if (isTextMarkupUpdate) {
                    this.textMarkupAnnotationModule.currentTextMarkupAnnotation = null;
                    this.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                }
                // eslint-disable-next-line max-len
            } else if (annotation && annotation.stampAnnotationType === 'image' && annotation.shapeAnnotationType === 'stamp' && annotation.stampAnnotationPath) {
                annotationType = 'stamp';
                if (currentAnnotation.data !== annotation.stampAnnotationPath) {
                    currentAnnotation.data = annotation.stampAnnotationPath;
                    currentAnnotation.wrapper.children[0].imageSource = annotation.stampAnnotationPath;
                }
                if (annotation.opacity && currentAnnotation.opacity !== annotation.opacity) {
                    this.annotationPropertyChange(currentAnnotation, annotation.opacity, 'Shape Opacity', clonedObject, redoClonedObject);
                }
                this.calculateAnnotationBounds(currentAnnotation, annotation);
                // eslint-disable-next-line max-len
            } else if (annotation.type === 'StickyNotes' || annotation.type === 'Stamp' || annotation.shapeAnnotationType === 'sticky' || annotation.shapeAnnotationType === 'stamp') {
                if (annotation.opacity && currentAnnotation.opacity !== annotation.opacity) {
                    this.annotationPropertyChange(currentAnnotation, annotation.opacity, 'Shape Opacity', clonedObject, redoClonedObject);
                }
                this.calculateAnnotationBounds(currentAnnotation, annotation);
                if (annotation.type === 'StickyNotes' || annotation.shapeAnnotationType === 'sticky') {
                    annotationType = 'sticky';
                } else {
                    annotationType = 'stamp';
                }
                // eslint-disable-next-line max-len
            } else if (annotation.type === 'Ink' || annotation.type === 'Shape' || annotation.type === 'Measure' || annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Polygon' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Ink') {
                this.calculateAnnotationBounds(currentAnnotation, annotation);
                if (annotation.opacity && currentAnnotation.opacity !== annotation.opacity) {
                    this.annotationPropertyChange(currentAnnotation, annotation.opacity, 'Shape Opacity', clonedObject, redoClonedObject);
                }
                if (annotation.fillColor && currentAnnotation.fillColor !== annotation.fillColor) {
                    redoClonedObject.fillColor = annotation.fillColor;
                    if (annotation.labelSettings && annotation.labelSettings.fillColor) {
                        annotation.labelSettings.fillColor = annotation.fillColor;
                    }
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fillColor: annotation.fillColor });
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
                }
                if (annotation.strokeColor && currentAnnotation.strokeColor !== annotation.strokeColor) {
                    redoClonedObject.strokeColor = annotation.strokeColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: annotation.strokeColor });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
                }
                if (annotation.thickness && currentAnnotation.thickness !== annotation.thickness) {
                    redoClonedObject.thickness = annotation.thickness;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: annotation.thickness });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.author !== annotation.author) {
                    redoClonedObject.author = annotation.author;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { author: annotation.author });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                }
                if (currentAnnotation.modifiedDate !== annotation.modifiedDate) {
                    redoClonedObject.modifiedDate = annotation.modifiedDate;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { modifiedDate: annotation.modifiedDate });
                }
                if (currentAnnotation.subject !== annotation.subject) {
                    redoClonedObject.subject = annotation.subject;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { subject: annotation.subject });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
                }
                if (this.pdfViewer.enableShapeLabel && currentAnnotation.fontColor !== annotation.fontColor) {
                    redoClonedObject.fontColor = annotation.fontColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fontColor: annotation.fontColor });
                }
                if (this.pdfViewer.enableShapeLabel && annotation.labelSettings && annotation.labelSettings.fillColor) {
                    if (currentAnnotation.labelFillColor !== annotation.labelSettings.fillColor) {
                        redoClonedObject.labelFillColor = annotation.labelSettings.fillColor;
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { labelFillColor: annotation.labelSettings.fillColor });
                    }
                }
                // eslint-disable-next-line max-len
                if (annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Polygon') {
                    if (JSON.stringify(currentAnnotation.vertexPoints) !== JSON.stringify(annotation.vertexPoints)) {
                        currentAnnotation.vertexPoints = annotation.vertexPoints;
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { vertexPoints: annotation.vertexPoints });
                    }
                }
                // eslint-disable-next-line max-len
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
                    // eslint-disable-next-line max-len
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { sourceDecoraterShapes: annotation.lineHeadStartStyle, taregetDecoraterShapes: annotation.lineHeadEndStyle, borderDashArray: annotation.borderDashArray });
                    // eslint-disable-next-line max-len
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false, isSourceDecoraterShapesChanged, isTargetDecoraterShapesChanged, isBorderDashArrayChanged);
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Line properties change', '', clonedObject, redoClonedObject);
                }
                // eslint-disable-next-line max-len
                if (annotation.type === 'Shape' || annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Polygon') {
                    annotationType = 'shape';
                }
                if (annotation.type === 'Ink' || annotation.shapeAnnotationType === 'Ink') {
                    annotationType = 'ink';
                }
                // eslint-disable-next-line max-len
                if (annotation.type === 'Measure' || annotation.subject === 'Distance calculation' || annotation.subject === 'Perimeter calculation' || annotation.subject === 'Radius calculation' || annotation.subject === 'Area calculation' || annotation.subject === 'Volume calculation') {
                    annotationType = 'shape_measure';
                }
                if (annotation.labelSettings && this.pdfViewer.enableShapeLabel) {
                    this.updateFreeTextProperties(currentAnnotation);
                    this.pdfViewer.nodePropertyChange(currentAnnotation, {
                        // eslint-disable-next-line max-len
                        labelOpacity: annotation.labelSettings.opacity, fontColor: annotation.labelSettings.fontColor, fontSize: annotation.labelSettings.fontSize, fontFamily: annotation.labelSettings.fontFamily,
                        labelContent: currentAnnotation.notes, labelFillColor: annotation.labelSettings.fillColor
                    });
                }
                if (this.pdfViewer.enableShapeLabel && annotation.calibrate && annotation.calibrate.depth) {
                    if (this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth !== annotation.calibrate.depth) {
                        this.pdfViewer.annotationModule.measureAnnotationModule.volumeDepth = annotation.calibrate.depth;
                        // eslint-disable-next-line max-len
                        currentAnnotation.notes = this.pdfViewer.annotationModule.measureAnnotationModule.calculateVolume(currentAnnotation.vertexPoints,currentAnnotation.id,currentAnnotation.pageIndex);
                        currentAnnotation.labelContent = currentAnnotation.notes;
                        if (annotation.labelSettings && annotation.labelSettings.labelContent) {
                            annotation.labelSettings.labelContent = currentAnnotation.notes;
                        }
                        this.pdfViewer.nodePropertyChange(currentAnnotation, { labelContent: currentAnnotation.labelContent });
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addTextToComments(currentAnnotation.annotName, currentAnnotation.notes);
                    }
                }
            } else if (annotation.type === 'FreeText' || annotation.shapeAnnotationType === 'FreeText') {
                annotationType = 'freetext';
                if (this.pdfViewer.freeTextSettings.enableAutoFit && currentAnnotation.dynamicText !== annotation.content) {
                    // eslint-disable-next-line
                    const canvas: any = this.pdfViewerBase.getElement('_annotationCanvas_' + currentAnnotation.pageIndex);
                    let context: any = canvas.getContext("2d");
                    let fontSize: number = annotation.fontSize;
                    let font: any;
                    let fontFamily: any = annotation.fontFamily;
                    let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                    // eslint-disable-next-line
                    annotation.font.isBold ? font = 'bold' + ' ' + fontSize + 'px' + ' ' + fontFamily : font = fontSize + 'px' + ' ' + fontFamily;
                    context.font = font;
                    let characterLength: number = 8;
                    let highestTextNode: string = "";
                    // eslint-disable-next-line
                    let textNodes: any[] = [];
                    let textboxValue: string = annotation.content ? annotation.content : annotation.dynamicText;
                    if (textboxValue.indexOf('\n') > -1) {
                        textNodes = textboxValue.split('\n');
                        for (var j = 0; j < textNodes.length; j++) {
                            // eslint-disable-next-line
                            let textNodeData: any = context.measureText(textNodes[j]);
                            // eslint-disable-next-line
                            let highestTextNodeData: any = context.measureText(highestTextNode);
                            if (textNodeData.width > highestTextNodeData.width) {
                                highestTextNode = textNodes[j];
                            }
                        }
                    } else {
                        highestTextNode = textboxValue;
                    }
                    // eslint-disable-next-line
                    let textwidth: any = context.measureText(highestTextNode);
                    annotation.bounds.width = Math.ceil(textwidth.width + ((characterLength + 1) * 2));
                    const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (annotation.pageIndex));
                    let maxWidth: number = pageDiv.clientWidth - (annotation.bounds.left * zoomFactor);
                    if (annotation.bounds.width > maxWidth) {
                        annotation.bounds.width = maxWidth / zoomFactor;
                    }
                    let height: number = annotation.bounds.height;
                    annotation.bounds.height = height >= currentAnnotation.bounds.height ? height : currentAnnotation.bounds.height;
                }
                this.calculateAnnotationBounds(currentAnnotation, annotation);
                if (annotation.opacity && currentAnnotation.opacity !== annotation.opacity) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
                }
                if (annotation.fillColor && currentAnnotation.fillColor !== annotation.fillColor) {
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                }
                if (annotation.strokeColor && currentAnnotation.strokeColor !== annotation.strokeColor) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                }
                if (annotation.thickness && currentAnnotation.thickness !== annotation.thickness) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
                }
                annotation.content = annotation.content ? annotation.content : annotation.dynamicText;
                if (annotation.content && currentAnnotation.dynamicText !== annotation.content) {
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false, false, false, false, true, currentAnnotation.dynamicText, annotation.content);
                }
                this.pdfViewer.nodePropertyChange(currentAnnotation, {
                    // eslint-disable-next-line max-len
                    opacity: annotation.opacity, fontColor: annotation.fontColor, fontSize: annotation.fontSize, fontFamily: annotation.fontFamily,
                    // eslint-disable-next-line max-len
                    dynamicText: annotation.content, fillColor: annotation.fillColor, textAlign: annotation.textAlign, strokeColor: annotation.strokeColor, thickness: annotation.thickness,  font: annotation.fontStyle ? this.setFreeTextFontStyle(annotation.fontStyle) : this.setFreeTextFontStyle(annotation.font),
                    isReadonly: annotation.isReadonly
                });
                if (annotation.content && currentAnnotation) {
                    this.updateAnnotationComments(currentAnnotation.annotName, annotation.content);
                }
                // eslint-disable-next-line
                let newCommentDiv: any = document.getElementById(this.pdfViewer.element.id + '_commenttextbox_editor');
                // eslint-disable-next-line
                let commentObj: any = new InPlaceEditor({
                    value: annotation.content
                });
                commentObj.appendTo(newCommentDiv);
            }
            currentAnnotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            if (currentAnnotation.customData !== annotation.customData) {
                currentAnnotation.customData = annotation.customData;
            }
            currentAnnotation.isPrint = annotation.isPrint;
            if (annotation.type !== 'TextMarkup') {
                this.pdfViewer.renderDrawing();
                this.updateCollection(annotationId, pageNumber, annotation, annotationType);
            }
        }
    }
    // eslint-disable-next-line
    private annotationPropertyChange(currentAnnotation: any, opacity: any, actionString: string, clonedObject: any, redoClonedObject: any): void {
        this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: opacity });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, actionString, '', clonedObject, redoClonedObject);
    }
    // eslint-disable-next-line
    private calculateAnnotationBounds(currentAnnotation: any, annotation: any): void {
        // eslint-disable-next-line
        let bounds: any = this.pdfViewerBase.convertBounds(currentAnnotation.wrapper.bounds);
        // eslint-disable-next-line
        let annotBounds: any = this.pdfViewerBase.convertBounds(annotation.bounds);
        if (bounds && annotBounds) {
            // eslint-disable-next-line
            if (JSON.stringify(bounds) !== JSON.stringify(annotBounds) && (Math.abs(bounds.Y - annotBounds.Y) > 2) || (Math.abs(bounds.X - annotBounds.X) > 2) || (Math.abs(bounds.Width - annotBounds.Width) > 2) || (Math.abs(bounds.Height - annotBounds.Height) > 2)) {
                // eslint-disable-next-line
                let annotationBounds: any = { x: annotBounds.X + (annotBounds.Width / 2), y: annotBounds.Y + (annotBounds.Height / 2), width: annotBounds.Width, height: annotBounds.Height };
                this.pdfViewer.nodePropertyChange(currentAnnotation, { bounds: annotationBounds });
                this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false);
            }
        }
    }
    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
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
        // eslint-disable-next-line
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
     * @param annotation
     * @param currentAnnotation
     * @private
     */
    // eslint-disable-next-line
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
            // eslint-disable-next-line max-len
            const ratioString: string = '1 ' + this.pdfViewer.measurementSettings.conversionUnit + ' = ' + this.pdfViewer.measurementSettings.scaleRatio + ' ' + this.pdfViewer.measurementSettings.displayUnit;
            this.measureAnnotationModule.updateMeasureValues(ratioString, this.pdfViewer.measurementSettings.displayUnit, this.pdfViewer.measurementSettings.conversionUnit, this.pdfViewer.measurementSettings.depth);
        }
    }

    // eslint-disable-next-line
    private updateCollection(annotationId: any, pageNumber: number, annotation: any, annotationType: string): void {
        // eslint-disable-next-line
        let annotationCollection: any[];
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + annotationType];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
                if (annotationCollection !== null) {
                    for (let i: number = 0; i < annotationCollection.length; i++) {
                        if (annotationCollection[i].annotName === annotationId) {
                            // eslint-disable-next-line
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
                    const annotationStringified: string = JSON.stringify(annotObject);
                    if (this.pdfViewerBase.isStorageExceed) {
                        // eslint-disable-next-line max-len
                        this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + annotationType] = annotationStringified;
                    } else {
                        // eslint-disable-next-line max-len
                        window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType, annotationStringified);
                    }
                }
            }
        }
    }

    // eslint-disable-next-line
    private modifyAnnotationProperties(newAnnotation: any, annotation: any, annotationType: string): any {
        if (annotation && annotation.isCommentLock === true) {
            newAnnotation.isCommentLock = annotation.isCommentLock;
        }
        if (annotation.comments) {
            for (let j: number = 0; j < annotation.comments.length; j++) {
                if (annotation.comments[j].isLock === true) {
                    newAnnotation.comments[j].isLock = annotation.comments[j].isLock;
                }
            }
        }
        if (annotation && annotation.note !== '' && annotation.note !== undefined) {
            newAnnotation.note = annotation.note;
        }
        if (annotation.commentId && annotation.editComment && annotation.commentType === 'edit') {
            // eslint-disable-next-line
            let commentDiv: any = document.getElementById(annotation.commentId);
            if (annotation.annotationId === annotation.commentId) {
                newAnnotation.note = commentDiv.childNodes[1].ej2_instances[0].value;
            }
            for (let j: number = 0; j < annotation.comments.length; j++) {
                if (annotation.comments[j].annotName === annotation.commentId) {
                    newAnnotation.comments[j].note = commentDiv.childNodes[1].ej2_instances[0].value;
                }
            }
        }
        if (annotationType === 'textMarkup') {
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.color = annotation.color;
            newAnnotation.allowedInteractions = annotation.allowedInteractions;
        } else if (annotationType === 'sticky' || annotationType === 'stamp') {
            if (annotation.bounds) {
                newAnnotation.bounds = annotation.bounds;
            }
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.annotationSettings = annotation.annotationSettings;
            newAnnotation.allowedInteractions = annotation.allowedInteractions;
            if (annotation.stampAnnotationPath) {
                newAnnotation.stampAnnotationPath = annotation.stampAnnotationPath;
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
                            // eslint-disable-next-line max-len
                            newAnnotation.note = this.pdfViewer.annotationModule.measureAnnotationModule.calculateVolume(newAnnotation.vertexPoints);
                        }
                    }
                }
            }
            if (this.pdfViewer.enableShapeLabel && annotation.labelSettings) {
                const text: string = annotation.labelSettings.labelContent;
                newAnnotation.note = text;
                newAnnotation.fontSize = annotation.labelSettings.fontSize;
                newAnnotation.labelFillColor = annotation.labelSettings.fillColor
                if (newAnnotation.labelContent) {
                    newAnnotation.labelContent = text;
                }
                if (newAnnotation.labelSettings) {
                    newAnnotation.labelSettings = annotation.labelSettings;
                }
                this.updateAnnotationComments(newAnnotation.annotName, text);
            }
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
        newAnnotation.customData = annotation.customData;
        newAnnotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        newAnnotation.isPrint = annotation.isPrint;
        if (annotation.annotationSettings && !isNullOrUndefined(annotation.annotationSettings.isLock)) {
            newAnnotation.isLocked = annotation.annotationSettings.isLock;
        }
        return newAnnotation;
    }

    /**
     * @param annotationType
     * @param annotationSubType
     * @param annotationType
     * @param annotationSubType
     * @private
     */
    public updateAnnotationAuthor(annotationType: string, annotationSubType?: string): string {
        let annotationAuthor: string;
        if (annotationType === 'sticky') {
            // eslint-disable-next-line max-len
            annotationAuthor = (this.pdfViewer.stickyNotesSettings.author !== 'Guest') ? this.pdfViewer.stickyNotesSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
        } else if (annotationType === 'stamp') {
            // eslint-disable-next-line max-len
            annotationAuthor = (this.pdfViewer.stampSettings.author !== 'Guest') ? this.pdfViewer.stampSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
        } else if (annotationType === 'shape') {
            if (annotationSubType === 'Line') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.lineSettings.author !== 'Guest') ? this.pdfViewer.lineSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'LineWidthArrowHead' || annotationSubType === 'Arrow') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.arrowSettings.author !== 'Guest') ? this.pdfViewer.arrowSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Circle' || annotationSubType === 'Ellipse' || annotationSubType === 'Oval') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.circleSettings.author !== 'Guest') ? this.pdfViewer.circleSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Rectangle' || annotationSubType === 'Square') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.rectangleSettings.author !== 'Guest') ? this.pdfViewer.rectangleSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Polygon') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.polygonSettings.author !== 'Guest') ? this.pdfViewer.polygonSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            }
        } else if (annotationType === 'measure') {
            if (annotationSubType === 'Distance' || annotationSubType === 'Distance calculation') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.distanceSettings.author !== 'Guest') ? this.pdfViewer.distanceSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Perimeter' || annotationSubType === 'Perimeter calculation') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.perimeterSettings.author !== 'Guest') ? this.pdfViewer.perimeterSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Radius' || annotationSubType === 'Radius calculation') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.radiusSettings.author !== 'Guest') ? this.pdfViewer.radiusSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Area' || annotationSubType === 'Area calculation') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.areaSettings.author !== 'Guest') ? this.pdfViewer.areaSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Volume' || annotationSubType === 'Volume calculation') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.volumeSettings.author !== 'Guest') ? this.pdfViewer.volumeSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            }
        } else if (annotationType === 'textMarkup') {
            if (annotationSubType === 'Highlight') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.highlightSettings.author !== 'Guest') ? this.pdfViewer.highlightSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Underline') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.underlineSettings.author !== 'Guest') ? this.pdfViewer.underlineSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else if (annotationSubType === 'Strikethrough') {
                // eslint-disable-next-line max-len
                annotationAuthor = (this.pdfViewer.strikethroughSettings.author !== 'Guest') ? this.pdfViewer.strikethroughSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            } else {
                // eslint-disable-next-line max-len
                annotationAuthor = this.pdfViewer.annotationSettings.author;
            }
        } else if (annotationType === 'freeText') {
            // eslint-disable-next-line max-len
            annotationAuthor = (this.pdfViewer.freeTextSettings.author !== 'Guest') ? this.pdfViewer.freeTextSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
        } else if (annotationType === 'ink') {
            // eslint-disable-next-line max-len
            annotationAuthor = (this.pdfViewer.inkAnnotationSettings.author !== 'Guest') ? this.pdfViewer.inkAnnotationSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
        }
        if (!annotationAuthor) {
            // eslint-disable-next-line max-len
            annotationAuthor = this.pdfViewer.annotationSettings.author;
        }
        return annotationAuthor;
    }
    /**
     * @param colour
     * @private
     */
    // eslint-disable-next-line
    public nameToHash(colour: string): string {
        // eslint-disable-next-line
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
            'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0'
        };

        if (typeof colours[colour.toLowerCase()] !== 'undefined') {
            return colours[colour.toLowerCase()];
        }
        return '';
    }

    // eslint-disable-next-line
    private updateFreeTextFontStyle(font: any): number {
        // eslint-disable-next-line
        let fontStyle: any = 0;
        if (font.isBold === 1) {
            fontStyle = 1;
        } else if (font.isItalic === 2) {
            fontStyle = 2;
        } else if (font.isUnderline === 4) {
            fontStyle = 4;
        } else if (font.isStrikeout) {
            fontStyle = 8;
        } else {
            fontStyle = { isBold: font.isBold, isItalic: font.isItalic, isUnderline: font.isUnderline, isStrikeout: font.isUnderline };
        }
        return fontStyle;
    }

    // eslint-disable-next-line
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
            return { isBold: fontStyle.isBold, isItalic: fontStyle.isItalic, isUnderline: fontStyle.isUnderline, isStrikeout: fontStyle.isStrikeout};
        }
    }

    /**
     * @param annotation
     * @param isSettings
     * @private
     */
    // eslint-disable-next-line
    public findAnnotationSettings(annotation: any, isSettings?: boolean): any {
        // eslint-disable-next-line
        let annotSettings: any = this.pdfViewer.annotationSettings;
        if (annotation) {
            // eslint-disable-next-line
            let shapeType: any = annotation.shapeAnnotationType;
            if (shapeType === 'StickyNotes' && this.pdfViewer.stickyNotesSettings) {
                annotSettings = this.pdfViewer.stickyNotesSettings;
            } else if (shapeType === 'Stamp' || shapeType === 'Image') {
                annotSettings = this.pdfViewer.stampSettings;
                // eslint-disable-next-line max-len
                if ((shapeType === 'image' || shapeType === 'Image')) {
                    annotSettings = this.pdfViewer.customStampSettings;
                }
            } else if (shapeType === 'FreeText') {
                annotSettings = this.pdfViewer.freeTextSettings;
            } else if (annotation.measureType === '') {
                if (shapeType === 'Line') {
                    annotSettings = this.pdfViewer.lineSettings;
                    // eslint-disable-next-line max-len
                } else if ((shapeType === 'Arrow' || shapeType === 'LineWidthArrowHead')) {
                    annotSettings = this.pdfViewer.arrowSettings;
                } else if (shapeType === 'Rectangle') {
                    annotSettings = this.pdfViewer.rectangleSettings;
                    // eslint-disable-next-line max-len
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
        let settings: any = annotation ? annotation.annotationSettings : {};
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
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public updateAnnotationSettings(annotation: any): any {
        // eslint-disable-next-line
        let annotSettings: any = this.pdfViewer.annotationSettings;
        if (annotation.AnnotType === 'sticky') {
            annotSettings = this.pdfViewer.stickyNotesSettings;
        } else if (annotation.AnnotType === 'stamp' || annotation.AnnotType === 'image' || annotation.AnnotType === 'Image') {
            annotSettings = this.pdfViewer.stampSettings;
            // eslint-disable-next-line max-len
            if ((annotation.Subject === 'image' || annotation.Subject === 'Image')) {
                annotSettings = this.pdfViewer.customStampSettings;
            }
        } else if (annotation.AnnotType === 'freeText') {
            annotSettings = this.pdfViewer.freeTextSettings;
        } else if (annotation.AnnotType === 'shape') {
            if (annotation.Subject === 'Line') {
                annotSettings = this.pdfViewer.lineSettings;
                // eslint-disable-next-line max-len
            } else if ((annotation.Subject === 'Arrow' || annotation.Subject === 'LineWidthArrowHead')) {
                annotSettings = this.pdfViewer.arrowSettings;
                // eslint-disable-next-line max-len
            } else if ((annotation.Subject === 'Rectangle' || annotation.Subject === 'Square')) {
                annotSettings = this.pdfViewer.rectangleSettings;
                // eslint-disable-next-line max-len
            } else if ((annotation.Subject === 'Circle' || annotation.Subject === 'Ellipse' || annotation.Subject === 'Oval')) {
                annotSettings = this.pdfViewer.circleSettings;
            } else if (annotation.Subject === 'Polygon') {
                annotSettings = this.pdfViewer.polygonSettings;
            }
        } else if (annotation.AnnotType === 'shape_measure') {
            // eslint-disable-next-line max-len
            if ((annotation.Subject === 'Distance' || annotation.Subject === 'Distance calculation')) {
                annotSettings = this.pdfViewer.distanceSettings;
                // eslint-disable-next-line max-len
            } else if ((annotation.Subject === 'Perimeter' || annotation.Subject === 'Perimeter calculation')) {
                annotSettings = this.pdfViewer.perimeterSettings;
                // eslint-disable-next-line max-len
            } else if ((annotation.Subject === 'Area' || annotation.Subject === 'Area calculation')) {
                annotSettings = this.pdfViewer.areaSettings;
                // eslint-disable-next-line max-len
            } else if ((annotation.Subject === 'Radius' || annotation.Subject === 'Radius calculation')) {
                annotSettings = this.pdfViewer.radiusSettings;
                // eslint-disable-next-line max-len
            } else if ((annotation.Subject === 'Volume' || annotation.Subject === 'Volume calculation')) {
                annotSettings = this.pdfViewer.volumeSettings;
            }
        }
        return this.updateSettings(annotSettings);
    }

    /**
     * @param annotationSettings
     * @private
     */
    // eslint-disable-next-line
    public updateSettings(annotationSettings: any): any {
        let maxHeight: number = 0;
        let maxWidth: number = 0;
        let minHeight: number = 0;
        let minWidth: number = 0;
        let isLock: boolean = false;
        let isPrint: boolean = true;
        // eslint-disable-next-line
        let settings: any = this.pdfViewer.annotationSettings;
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
        isPrint = annotationSettings.isPrint;
        return { minWidth: minWidth, maxWidth: maxWidth, minHeight: minHeight, maxHeight: maxHeight, isLock: isLock, isPrint: isPrint };
    }
    // eslint-disable-next-line
    private getOverlappedAnnotations(annotation: any, pageNumber: number): any {
        // eslint-disable-next-line
        let pageCollections: any = this.getPageShapeAnnotations(pageNumber);
        // eslint-disable-next-line
        let selectedAnnotation: any;
        for (let i: number = 0; i < pageCollections.length; i++) {
            if (annotation.annotName === pageCollections[i].annotName) {
                selectedAnnotation = pageCollections[i];
                break;
            }
        }
        // eslint-disable-next-line
        let annotationCollection: any = this.findOverlappedAnnotations(selectedAnnotation, pageCollections);
        return annotationCollection;
    }

    // eslint-disable-next-line
    private getPageShapeAnnotations(pageNumber: number): any {
        // eslint-disable-next-line
        let pageCollections: any = [];
        // eslint-disable-next-line
        let inkObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        if (inkObject) {
            const inkAnnotObject: IPageAnnotations[] = JSON.parse(inkObject);
            if (inkAnnotObject) {
                const index: number = this.getPageCollection(inkAnnotObject, pageNumber);
                if (inkAnnotObject[index]) {
                    // eslint-disable-next-line
                    let inkAnnotations: any = inkAnnotObject[index].annotations;
                    if (inkAnnotations && inkAnnotations.length > 0) {
                        for (let i: number = 0; i < inkAnnotations.length; i++) {
                            pageCollections.push(inkAnnotations[i]);
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let shapeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (shapeObject) {
            const shapeAnnotObject: IPageAnnotations[] = JSON.parse(shapeObject);
            if (shapeAnnotObject) {
                const index: number = this.getPageCollection(shapeAnnotObject, pageNumber);
                if (shapeAnnotObject[index]) {
                    // eslint-disable-next-line
                    let shapeAnnotations: any = shapeAnnotObject[index].annotations;
                    if (shapeAnnotations && shapeAnnotations.length > 0) {
                        for (let i: number = 0; i < shapeAnnotations.length; i++) {
                            pageCollections.push(shapeAnnotations[i]);
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let measureObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (measureObject) {
            const measureAnnotationObject: IPageAnnotations[] = JSON.parse(measureObject);
            if (measureAnnotationObject) {
                const index: number = this.getPageCollection(measureAnnotationObject, pageNumber);
                if (measureAnnotationObject[index]) {
                    // eslint-disable-next-line
                    let measureAnnotations: any = measureAnnotationObject[index].annotations;
                    if (measureAnnotations && measureAnnotations.length > 0) {
                        for (let i: number = 0; i < measureAnnotations.length; i++) {
                            pageCollections.push(measureAnnotations[i]);
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let stampObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        if (stampObject) {
            const stampAnnotationObject: IPageAnnotations[] = JSON.parse(stampObject);
            if (stampAnnotationObject) {
                const index: number = this.getPageCollection(stampAnnotationObject, pageNumber);
                if (stampAnnotationObject[index]) {
                    // eslint-disable-next-line
                    let stampAnnotations: any = stampAnnotationObject[index].annotations;
                    if (stampAnnotations && stampAnnotations.length > 0) {
                        for (let i: number = 0; i < stampAnnotations.length; i++) {
                            pageCollections.push(stampAnnotations[i]);
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let freeTextObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (freeTextObject) {
            const freeTextAnnotationObject: IPageAnnotations[] = JSON.parse(freeTextObject);
            if (freeTextAnnotationObject) {
                const index: number = this.getPageCollection(freeTextAnnotationObject, pageNumber);
                if (freeTextAnnotationObject[index]) {
                    // eslint-disable-next-line
                    let freeTextAnnotations: any = freeTextAnnotationObject[index].annotations;
                    if (freeTextAnnotations && freeTextAnnotations.length > 0) {
                        for (let i: number = 0; i < freeTextAnnotations.length; i++) {
                            pageCollections.push(freeTextAnnotations[i]);
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let stickyObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (stickyObject) {
            const stickyNotesAnnotationObject: IPageAnnotations[] = JSON.parse(stickyObject);
            if (stickyNotesAnnotationObject) {
                const index: number = this.getPageCollection(stickyNotesAnnotationObject, pageNumber);
                if (stickyNotesAnnotationObject[index]) {
                    // eslint-disable-next-line
                    let stickyNotesAnnotations: any = stickyNotesAnnotationObject[index].annotations;
                    if (stickyNotesAnnotations && stickyNotesAnnotations.length > 0) {
                        for (let i: number = 0; i < stickyNotesAnnotations.length; i++) {
                            pageCollections.push(stickyNotesAnnotations[i]);
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let textMarkupObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (textMarkupObject) {
            const textMarkupAnnotationObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
            if (textMarkupAnnotationObject) {
                const index: number = this.getPageCollection(textMarkupAnnotationObject, pageNumber);
                if (textMarkupAnnotationObject[index]) {
                    // eslint-disable-next-line
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

    // eslint-disable-next-line
    private findOverlappedAnnotations(annotation: any, pageCollections: any): any {
        this.overlappedAnnotations = [];
        if (annotation && annotation.bounds) {
            if (annotation.shapeAnnotationType === 'textMarkup') {
                for (let i: number = 0; i < annotation.bounds.length; i++) {
                    // eslint-disable-next-line
                    let bounds: any = this.orderTextMarkupBounds(annotation.bounds[i]);
                    this.calculateOverlappedAnnotationBounds(annotation, bounds, pageCollections);
                }
            } else {
                this.calculateOverlappedAnnotationBounds(annotation, annotation.bounds, pageCollections);
            }
        }
        return this.overlappedAnnotations;
    }

    // eslint-disable-next-line
    private calculateOverlappedAnnotationBounds(annotation: any, bounds: any, pageCollections: any): void {
        // eslint-disable-next-line
        let selectBounds: any = bounds;
        if (annotation.shapeAnnotationType === 'Ink') {
            selectBounds = { left: bounds.x, top: bounds.y, height: bounds.height, width: bounds.width };
        }
        // eslint-disable-next-line
        let left: number = parseInt(selectBounds.left);
        // eslint-disable-next-line
        let top: number = parseInt(selectBounds.top);
        // eslint-disable-next-line
        let totalHeight: number = parseInt(selectBounds.top + selectBounds.height);
        // eslint-disable-next-line
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
                    // eslint-disable-next-line
                    let annotationBounds: any;
                    // eslint-disable-next-line
                    let annotationBoundsCollection: any = pageCollections[i].bounds;
                    if (pageCollections[i].shapeAnnotationType === 'Ink') {
                        // eslint-disable-next-line
                        annotationBoundsCollection = { left: annotationBoundsCollection.x, top: annotationBoundsCollection.y, height: annotationBoundsCollection.height, width: annotationBoundsCollection.width };
                    }
                    if (pageCollections[i].shapeAnnotationType !== 'textMarkup' && boundsCount === 1) {
                        annotationBounds = annotationBoundsCollection;
                    } else {
                        // eslint-disable-next-line
                        annotationBounds = this.orderTextMarkupBounds(annotationBoundsCollection[j]);
                    }
                    if (annotationBounds) {
                        let isOverlapped: boolean = false;
                        // eslint-disable-next-line
                        if (((left <= parseInt(annotationBounds.left)) && (totalWidth >= parseInt(annotationBounds.left))) || ((left <= parseInt(annotationBounds.left + annotationBounds.width)) && (totalWidth >= parseInt(annotationBounds.left + annotationBounds.width)))) {
                            isOverlapped = true;
                        }
                        if (isOverlapped) {
                            // eslint-disable-next-line
                            if (((top <= parseInt(annotationBounds.top)) && (totalHeight >= parseInt(annotationBounds.top))) || ((top <= parseInt(annotationBounds.top + annotationBounds.height)) && (totalHeight >= parseInt(annotationBounds.top + annotationBounds.height)))) {
                                isOverlapped = true;
                            } else {
                                isOverlapped = false;
                            }
                        }
                        if (isOverlapped) {
                            this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
                        } else {
                            // eslint-disable-next-line
                            if (((parseInt(annotationBounds.left) <= left) && (parseInt(annotationBounds.left + annotationBounds.width) >= left)) || ((totalWidth >= parseInt(annotationBounds.left)) && (totalWidth <= parseInt(annotationBounds.left + annotationBounds.width)))) {
                                isOverlapped = true;
                            }
                            if (isOverlapped) {
                                // eslint-disable-next-line
                                if (((parseInt(annotationBounds.top) <= top) && parseInt(annotationBounds.top + annotationBounds.height) >= top) || ((totalHeight >= parseInt(annotationBounds.top)) && (totalHeight <= parseInt(annotationBounds.top + annotationBounds.height)))) {
                                    isOverlapped = true;
                                } else {
                                    isOverlapped = false;
                                }
                            }
                            if (isOverlapped) {
                                this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
                            } else {
                                // eslint-disable-next-line
                                if (((left <= parseInt(annotationBounds.left)) && (totalWidth >= parseInt(annotationBounds.left))) || ((left <= parseInt(annotationBounds.left + annotationBounds.width)) && (totalWidth >= parseInt(annotationBounds.left + annotationBounds.width)))) {
                                    isOverlapped = true;
                                }
                                if (isOverlapped) {
                                    // eslint-disable-next-line
                                    if (((parseInt(annotationBounds.top) <= top) && parseInt(annotationBounds.top + annotationBounds.height) >= top) || ((totalHeight >= parseInt(annotationBounds.top)) && (totalHeight <= parseInt(annotationBounds.top + annotationBounds.height)))) {
                                        isOverlapped = true;
                                    } else {
                                        isOverlapped = false;
                                    }
                                }
                                if (isOverlapped) {
                                    this.checkOverlappedCollections(pageCollections[i], this.overlappedAnnotations);
                                } else {
                                    // eslint-disable-next-line
                                    if (((parseInt(annotationBounds.left) <= left) && (parseInt(annotationBounds.left + annotationBounds.width) >= left)) || ((totalWidth >= parseInt(annotationBounds.left)) && (totalWidth <= parseInt(annotationBounds.left + annotationBounds.width)))) {
                                        isOverlapped = true;
                                    }
                                    if (isOverlapped) {
                                        // eslint-disable-next-line
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
     * @param annotation
     * @param pageNumber
     * @param type
     * @param annotation
     * @param pageNumber
     * @param type
     * @private
     */
    // eslint-disable-next-line
    public findAnnotationMode(annotation: any, pageNumber: number, type: string): string {
        // eslint-disable-next-line
        let importCollection: any = this.pdfViewer.viewerBase.importedAnnotation[pageNumber];
        if (importCollection) {
            // eslint-disable-next-line
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
                    if (collection[i].AnnotName === annotation.AnnotName) {
                        return 'Imported Annotation';
                    }
                }
            }
        }
        return 'Existing Annotation';
    }
    // eslint-disable-next-line
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

    // eslint-disable-next-line
    private orderTextMarkupBounds(bounds: any): any {
        if (bounds.Left || bounds.Width) {
            return { left: bounds.Left, top: bounds.Top, height: bounds.Height, width: bounds.Width };
        } else {
            return { left: bounds.left, top: bounds.top, height: bounds.height, width: bounds.width };
        }
    }

    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public updateModifiedDate(annotation: any): any {
        if (annotation.modifiedDate) {
            annotation.modifiedDate = this.setAnnotationModifiedDate(annotation.modifiedDate);
        }
        if (annotation.comments && annotation.comments.length > 0) {
            for (let i: number = 0; i < annotation.comments.length; i++) {
                if (annotation.comments[i].modifiedDate) {
                    annotation.comments[i].modifiedDate = this.setAnnotationModifiedDate(annotation.comments[i].modifiedDate);
                    if (annotation.comments[i].review && annotation.comments[i].review.modifiedDate) {
                        // eslint-disable-next-line max-len
                        annotation.comments[i].review.modifiedDate = this.setAnnotationModifiedDate(annotation.comments[i].review.modifiedDate);
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
            // eslint-disable-next-line
            let time: number = parseInt(date.split(' ')[1].split(':')[0]);
            if (date.split(' ').length === 3) {
                // eslint-disable-next-line max-len
                modifiedTime = time + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' ' + date.split(' ')[2];
            } else {
                if (time >= 12) {
                    if (time === 12) {
                        modifiedTime = time + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' PM';
                    } else {
                        // eslint-disable-next-line max-len
                        modifiedTime = (time - 12) + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' PM';
                    }
                } else {
                    modifiedTime = time + ':' + date.split(' ')[1].split(':')[1] + ':' + date.split(' ')[1].split(':')[2] + ' AM';
                }
            }
            // eslint-disable-next-line
            let dateString: any = date.split(' ')[0];
            // eslint-disable-next-line
            let dateStringSpilt: any = date.split(',');
            if (dateStringSpilt.length > 1) {
                modifiedDateTime = dateString + (' ') + modifiedTime;
            } else {
                modifiedDateTime = dateString + (', ') + modifiedTime;
            }
        } else {
            return date;
        }
        const modifiedDateToUTC = new Date(modifiedDateTime);
        modifiedDateTime = modifiedDateToUTC.toISOString();
        return modifiedDateTime;
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
        // eslint-disable-next-line max-len
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
            this.pdfViewer.annotation.stampAnnotationModule.stampPageNumber = [];
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
            this.pdfViewer.annotation.freeTextAnnotationModule.freeTextPageNumbers = [];
            this.freeTextAnnotationModule.previousText = 'Type Here';
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.inkAnnotationModule) {
            this.pdfViewer.annotation.inkAnnotationModule.inkAnnotationindex = [];
        }
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sticky');
    }
    // eslint-disable-next-line
    public retrieveAnnotationCollection(): any[] {
        return this.pdfViewer.annotationCollection;
    }

    /**
     * @param interaction
     * @param annotation
     * @param interaction
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public checkAllowedInteractions(interaction: string, annotation: any): boolean {
        // eslint-disable-next-line
        let annotationInteraction: any = this.updateAnnotationAllowedInteractions(annotation);
        if (annotationInteraction && annotationInteraction.length > 0) {
            for (let i: number = 0; i < annotationInteraction.length; i++) {
                if (interaction === 'Select') {
                    // eslint-disable-next-line max-len
                    if (annotationInteraction[i] === 'Move' || annotationInteraction[i] === 'Resize' || annotationInteraction[i] === 'Delete' || annotationInteraction[i] === 'PropertyChange' || annotationInteraction[i] === 'Select') {
                        return true;
                    }
                } else {
                    if (annotationInteraction[i] === interaction) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * @param menuObj
     * @private
     */
    // eslint-disable-next-line
    public checkContextMenuDeleteItem(menuObj: any): void {
        // eslint-disable-next-line
        let annotation: any = this.findCurrentAnnotation();
        if (annotation && annotation.annotationSettings) {
            // eslint-disable-next-line
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
     */
    // eslint-disable-next-line
    public isEnableDelete(): boolean {
        // eslint-disable-next-line
        let annotation: any = this.findCurrentAnnotation();
        if (annotation && annotation.annotationSettings) {
            // eslint-disable-next-line
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
     */
    // eslint-disable-next-line
    public findCurrentAnnotation(): any {
        if (this.textMarkupAnnotationModule && this.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            return this.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        }
        if (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations[0]) {
            return this.pdfViewer.selectedItems.annotations[0];
        }
    }

    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public updateAnnotationAllowedInteractions(annotation: any): any {
        // eslint-disable-next-line
        let annotationInteraction: any = ['None'];
        if (annotation) {
            if (annotation.shapeAnnotationType === 'FreeText' && this.pdfViewer.freeTextSettings.allowedInteractions) {
                // eslint-disable-next-line max-len
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.freeTextSettings.allowedInteractions, annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'Ink' && this.pdfViewer.inkAnnotationSettings.allowedInteractions) {
                // eslint-disable-next-line max-len
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.inkAnnotationSettings.allowedInteractions, annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'StickyNotes' && this.pdfViewer.stickyNotesSettings.allowedInteractions) {
                // eslint-disable-next-line max-len
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.stickyNotesSettings.allowedInteractions, annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'Stamp' && this.pdfViewer.stampSettings.allowedInteractions) {
                // eslint-disable-next-line max-len
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.stampSettings.allowedInteractions, annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'Image' && this.pdfViewer.customStampSettings.allowedInteractions) {
                // eslint-disable-next-line max-len
                annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.customStampSettings.allowedInteractions, annotation.allowedInteractions);
            } else if (annotation.shapeAnnotationType === 'textMarkup') {
                if (annotation.textMarkupAnnotationType === 'Highlight' && this.pdfViewer.highlightSettings.allowedInteractions) {
                    // eslint-disable-next-line max-len
                    annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.highlightSettings.allowedInteractions, annotation.allowedInteractions);
                } else if (annotation.textMarkupAnnotationType === 'Underline' && this.pdfViewer.underlineSettings.allowedInteractions) {
                    // eslint-disable-next-line max-len
                    annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.underlineSettings.allowedInteractions, annotation.allowedInteractions);
                } else if (annotation.textMarkupAnnotationType === 'Strikethrough' && this.pdfViewer.strikethroughSettings.allowedInteractions) {
                    // eslint-disable-next-line max-len
                    annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.strikethroughSettings.allowedInteractions, annotation.allowedInteractions);
                }
            } else {
                if (annotation.measureType !== '') {
                    if (annotation.measureType === 'Distance' && this.pdfViewer.distanceSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.distanceSettings.allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Perimeter' && this.pdfViewer.perimeterSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.perimeterSettings.allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Radius' && this.pdfViewer.radiusSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.radiusSettings.allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Area' && this.pdfViewer.areaSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.areaSettings.allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.measureType === 'Volume' && this.pdfViewer.volumeSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.volumeSettings.allowedInteractions, annotation.allowedInteractions);
                    }
                } else {
                    if (annotation.shapeAnnotationType === 'Line' && this.pdfViewer.lineSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.lineSettings.allowedInteractions, annotation.allowedInteractions);
                        // eslint-disable-next-line max-len
                    } else if ((annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead') && this.pdfViewer.arrowSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.arrowSettings.allowedInteractions, annotation.allowedInteractions);
                        // eslint-disable-next-line max-len
                    } else if ((annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse' || annotation.shapeAnnotationType === 'Oval') && this.pdfViewer.circleSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.circleSettings.allowedInteractions, annotation.allowedInteractions);
                    } else if ((annotation.shapeAnnotationType === 'Rectangle' || annotation.shapeAnnotationType === 'Square') && this.pdfViewer.rectangleSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.rectangleSettings.allowedInteractions, annotation.allowedInteractions);
                    } else if (annotation.shapeAnnotationType === 'Polygon' && this.pdfViewer.polygonSettings.allowedInteractions) {
                        // eslint-disable-next-line max-len
                        annotationInteraction = this.checkAllowedInteractionSettings(this.pdfViewer.polygonSettings.allowedInteractions, annotation.allowedInteractions);
                    }
                }
            }
        }
        return annotationInteraction;
    }
    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public checkIsLockSettings(annotation: any): boolean {
        // eslint-disable-next-line
        let isLocked: boolean = false;
        if (annotation) {
            if (annotation.shapeAnnotationType === 'FreeText') {
                isLocked = this.checkLockSettings(this.pdfViewer.freeTextSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'Ink') {
                // eslint-disable-next-line max-len
                isLocked = this.checkLockSettings(this.pdfViewer.inkAnnotationSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'StickyNotes') {
                isLocked = this.checkLockSettings(this.pdfViewer.stickyNotesSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'Stamp') {
                isLocked = this.checkLockSettings(this.pdfViewer.stampSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'Image') {
                isLocked = this.checkLockSettings(this.pdfViewer.customStampSettings.isLock);
            } else if (annotation.shapeAnnotationType === 'textMarkup') {
                if (annotation.textMarkupAnnotationType === 'Highlight') {
                    // eslint-disable-next-line max-len
                    isLocked = this.checkLockSettings(this.pdfViewer.highlightSettings.isLock);
                } else if (annotation.textMarkupAnnotationType === 'Underline') {
                    // eslint-disable-next-line max-len
                    isLocked = this.checkLockSettings(this.pdfViewer.underlineSettings.isLock);
                } else if (annotation.textMarkupAnnotationType === 'Strikethrough') {
                    // eslint-disable-next-line max-len
                    isLocked = this.checkLockSettings(this.pdfViewer.strikethroughSettings.isLock);
                }
            } else {
                if (annotation.measureType !== '') {
                    if (annotation.measureType === 'Distance') {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.distanceSettings.isLock);
                    } else if (annotation.measureType === 'Perimeter') {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.perimeterSettings.isLock);
                    } else if (annotation.measureType === 'Radius') {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.radiusSettings.isLock);
                    } else if (annotation.measureType === 'Area') {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.areaSettings.isLock);
                    } else if (annotation.measureType === 'Volume') {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.volumeSettings.isLock);
                    }
                } else {
                    if (annotation.shapeAnnotationType === 'Line') {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.lineSettings.isLock);
                        // eslint-disable-next-line max-len
                    } else if ((annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead')) {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.arrowSettings.isLock);
                        // eslint-disable-next-line max-len
                    } else if ((annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse' || annotation.shapeAnnotationType === 'Oval')) {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.circleSettings.isLock);
                    } else if ((annotation.shapeAnnotationType === 'Rectangle' || annotation.shapeAnnotationType === 'Square')) {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.rectangleSettings.isLock);
                    } else if (annotation.shapeAnnotationType === 'Polygon') {
                        // eslint-disable-next-line max-len
                        isLocked = this.checkLockSettings(this.pdfViewer.polygonSettings.isLock);
                    }
                }
            }
        }
        return isLocked;
    }
    // eslint-disable-next-line
    private checkLockSettings(locked: boolean): boolean {
        let islock: boolean = false;
        if (locked || this.pdfViewer.annotationSettings.isLock) {
            islock = true;
        }
        return islock;
    }
    /**
     * @private
     */
    // eslint-disable-next-line
    public restrictContextMenu(): boolean {
        // eslint-disable-next-line
        let isRestrict: boolean = false;
        // eslint-disable-next-line
        let annotation: any = this.findCurrentAnnotation();
        if (annotation && this.checkIsLockSettings(annotation) && this.checkAllowedInteractions('Select', annotation)) {
            isRestrict = true;
        }
        return isRestrict;
    }
    // eslint-disable-next-line
    private checkAllowedInteractionSettings(annotationInteraction: any, annotationAllowedInteraction: any): any {
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
     * @param value
     * @param type
     * @param value
     * @param type
     * @private
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
                    return this.convertToHsvString(this.rgbToHsv.apply(this, cValue.slice(0, 3)));
                } else {
                    if (type === 'hsva') {
                        return this.convertToHsvString(this.rgbToHsv.apply(this, cValue));
                    } else {
                        return 'null';
                    }
                }
            }
        } else {
            if (value[0] === 'h') {
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
        // eslint-disable-next-line max-len
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
        let h: number; let s: number; const v: number = max;

        const d: number = max - min;
        s = max === 0 ? 0 : d / max;

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
        let i: number;
        let f: number; let p: number; let q: number; let t: number;
        s /= 100; v /= 100;
        if (s === 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), opacity];
        }
        h /= 60;
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
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
        // eslint-disable-next-line max-len
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).substr(-2) : '00') : '')) : '';
    }

    /**
     * @param dataFormat
     * @private
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
       if(!isNullOrUndefined(x))
        {
            return ('0' + x.toString(16)).slice(-2);
        }
        else{
            return '0';
        }
    }

    /**
     * @param obj
     * @private
     */
    // eslint-disable-next-line
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

    /**
     * Get vertex points properties 
     * @private
     */
    public getVertexPointsXY(points: any): any {
        let vertexPoints: any = [];
        //Converting points model into vertex property
        for (let j: number = 0; j < points.length; j++) {
            vertexPoints[j] = { X: points[j].x, Y: points[j].y };
        }
        return vertexPoints;
    }

    /**
     * Method used to add annotations using program.
     *
     * @param annotationType - It describes type of annotation object.
     * @param options -  It describes about the annotation objects and it's property.
     * @param dynamicStampItem - It describe which type of dynamic stamp.
     * @param signStampItem - It describe which type of sign stamp.
     * @param standardBusinessStampItem - It describe which type of standard business stamp.
     * @returns void
     */
    public addAnnotation(annotationType: AnnotationType, options?: FreeTextSettings | StickyNotesSettings | HighlightSettings | UnderlineSettings | LineSettings | StrikethroughSettings | RectangleSettings | CircleSettings | ArrowSettings | PolygonSettings | DistanceSettings | PerimeterSettings | AreaSettings | RadiusSettings | VolumeSettings | InkAnnotationSettings | StampSettings | CustomStampSettings, dynamicStampItem?: DynamicStampItem, signStampItem?: SignStampItem, standardBusinessStampItem?: StandardBusinessStampItem): void {
        //Initialize the bounds and pageNumber
        let offset: IPoint = { x: 1, y: 1 };
        let pageNumber: number = 0;
        if (options) {
            if (options.pageNumber && options.pageNumber > 0)
                pageNumber = options.pageNumber ? options.pageNumber - 1 : 0;
        }

        //Initialize the pdf annotation object array
        let annotationObject: any = null;
        let pdfAnnotation: any = [];
        this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
        //Seperate the annotation type with it's method
        if (annotationType == 'FreeText') {
            pdfAnnotation[pageNumber] = this.pdfViewer.annotation.freeTextAnnotationModule.updateAddAnnotationDetails(options as FreeTextSettings, offset);
            this.pdfViewer.annotation.freeTextAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType == 'StickyNotes') {
            pdfAnnotation[pageNumber] = this.pdfViewer.annotation.stickyNotesAnnotationModule.updateAddAnnotationDetails(options as StickyNotesSettings, offset);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType == 'Highlight' || annotationType == 'Underline' || annotationType == 'Strikethrough') {
            if (annotationType == 'Highlight')
                annotationObject = options as HighlightSettings;
            else if (annotationType == 'Underline')
                annotationObject = options as UnderlineSettings;
            else if (annotationType == 'Strikethrough')
                annotationObject = options as StrikethroughSettings;
            pdfAnnotation[pageNumber] = this.pdfViewer.annotation.textMarkupAnnotationModule.updateAddAnnotationDetails(annotationType, annotationObject);
            this.pdfViewer.annotation.textMarkupAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Line' || annotationType === 'Arrow' || annotationType === 'Rectangle' || annotationType === 'Circle' || annotationType === 'Polygon') {
            if (annotationType == 'Line')
                annotationObject = options as LineSettings;
            else if (annotationType == 'Arrow')
                annotationObject = options as ArrowSettings;
            else if (annotationType == 'Rectangle')
                annotationObject = options as RectangleSettings;
            else if (annotationType == 'Circle')
                annotationObject = options as CircleSettings;
            else if (annotationType == 'Polygon')
                annotationObject = options as PolygonSettings;
            pdfAnnotation[pageNumber] = this.pdfViewer.annotation.shapeAnnotationModule.updateAddAnnotationDetails(annotationType, annotationObject, offset);
            this.pdfViewer.annotation.shapeAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Distance' || annotationType === 'Perimeter' || annotationType === 'Area' || annotationType === 'Radius' || annotationType === 'Volume') {
            if (annotationType == 'Distance')
                annotationObject = options as DistanceSettings;
            else if (annotationType == 'Perimeter')
                annotationObject = options as PerimeterSettings;
            else if (annotationType == 'Area')
                annotationObject = options as AreaSettings;
            else if (annotationType == 'Radius')
                annotationObject = options as RadiusSettings;
            else if (annotationType == 'Volume')
                annotationObject = options as VolumeSettings;
            pdfAnnotation[pageNumber] = this.pdfViewer.annotation.measureAnnotationModule.updateAddAnnotationDetails(annotationType, annotationObject, offset);
            this.pdfViewer.annotation.measureAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Stamp') {
            if ((options as CustomStampSettings) && (options as CustomStampSettings).customStamps) {
                pdfAnnotation[pageNumber] = this.pdfViewer.annotation.stampAnnotationModule.updateAddAnnotationDetails(options as CustomStampSettings, offset, pageNumber, dynamicStampItem, signStampItem, standardBusinessStampItem);
            }
            else {
                pdfAnnotation[pageNumber] = this.pdfViewer.annotation.stampAnnotationModule.updateAddAnnotationDetails(options as StampSettings, offset, pageNumber, dynamicStampItem, signStampItem, standardBusinessStampItem);
            }
            this.pdfViewer.annotation.stampAnnotationModule.isAddAnnotationProgramatically = true;
        }
        else if (annotationType === 'Ink') {
            pdfAnnotation[pageNumber] = this.pdfViewer.annotation.inkAnnotationModule.updateAddAnnotationDetails(options as InkAnnotationSettings, offset, pageNumber);
            this.pdfViewer.annotation.inkAnnotationModule.isAddAnnotationProgramatically = true;
        }

        //Annotation rendering can be done with the import annotation method.
        let pdf: object = { pdfAnnotation };
        this.pdfViewerBase.isAddAnnotation = true;
        this.pdfViewerBase.importAnnotations(pdf);
        this.pdfViewerBase.isAddAnnotation = false;
    }

    /**
     * @param annotation
     * @private
     */
    public triggerAnnotationAddEvent(annotation: PdfAnnotationBaseModel): void {
        let annotationType: any = annotation.shapeAnnotationType;
        if (annotationType === 'Stamp' || annotationType === 'Image' || annotationType === 'Path' || annotationType === 'FreeText' || annotationType === 'StickyNotes' || annotationType === 'Ink') {
            let settings: any;
            if (annotationType === 'FreeText') {
                 settings = {
                    opacity: annotation.opacity, borderColor: annotation.strokeColor, borderWidth: annotation.thickness, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                    fillColor: annotation.fillColor, fontSize: annotation.fontSize, width: annotation.bounds.width, height: annotation.bounds.height, fontColor: annotation.fontColor, fontFamily: annotation.fontFamily, defaultText: annotation.dynamicText, fontStyle: annotation.font, textAlignment: annotation.textAlign
                };
            } else {
                settings = {
                    opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor,
                    thickness: annotation.thickness, author: annotation.author, subject: annotation.subject,
                    modifiedDate: annotation.modifiedDate, data: annotation.data
                };
            }
            // eslint-disable-next-line
            let bounds: any = { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width, height: annotation.bounds.height };
            const type: AnnotationType = this.getAnnotationType(annotation.shapeAnnotationType, annotation.measureType);
            // eslint-disable-next-line max-len
            this.pdfViewer.fireAnnotationAdd(annotation.pageIndex, annotation.annotName, type, bounds, settings);
        } else if (annotationType === 'SignatureText' || annotationType === 'SignatureImage' || annotationType === 'HandWrittenSignature') {
            // eslint-disable-next-line
            let bounds: any = { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width, height: annotation.bounds.height };
            // eslint-disable-next-line max-len
            this.pdfViewer.fireSignatureAdd(annotation.pageIndex, annotation.signatureName, annotation.shapeAnnotationType as AnnotationType, bounds, annotation.opacity, annotation.strokeColor, annotation.thickness, annotation.data);
        } else {
            // eslint-disable-next-line
            let setting: any = {
                opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor,
                thickness: annotation.thickness, author: annotation.author, subject: annotation.subject,
                modifiedDate: annotation.modifiedDate
            };
            let bounds: any = { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width, height: annotation.bounds.height };
            const type: AnnotationType = this.getAnnotationType(annotation.shapeAnnotationType, annotation.measureType);
            if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
                setting.lineHeadStartStyle = this.getArrowString(annotation.sourceDecoraterShapes);
                setting.lineHeadEndStyle = this.getArrowString(annotation.taregetDecoraterShapes);
                setting.borderDashArray = annotation.borderDashArray;
            }
            let labelSettings: ShapeLabelSettingsModel;
            if (this.pdfViewer.enableShapeLabel) {
                labelSettings = {
                    // eslint-disable-next-line max-len
                    fontColor: annotation.fontColor, fontSize: annotation.fontSize, fontFamily: annotation.fontFamily,
                    opacity: annotation.labelOpacity, labelContent: annotation.labelContent, fillColor: annotation.labelFillColor
                };
                // eslint-disable-next-line max-len
                this.pdfViewer.fireAnnotationAdd(annotation.pageIndex, annotation.annotName, type, bounds, setting, null, null, null, labelSettings);
            } else {
                // eslint-disable-next-line max-len
                this.pdfViewer.fireAnnotationAdd(annotation.pageIndex, annotation.annotName, type, bounds, setting);
            }
        }
    }
    /**
     * @private
     */
    public triggerAnnotationUnselectEvent(): void {
        if (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations[0]) {
            let annotation : any = this.pdfViewer.selectedItems.annotations[0];
            if(annotation.shapeAnnotationType !== 'HandWrittenSignature' && annotation.shapeAnnotationType !== 'SignatureText' && annotation.shapeAnnotationType !== 'SignatureImage' && annotation.shapeAnnotationType !== 'Path'){
            this.pdfViewer.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
            this.pdfViewer.clearSelection(annotation.pageIndex);
            }
        }
    }
    /**
     * @private
    */
      public updateFontFamilyRenderSize(currentAnnotation: PdfAnnotationBaseModel, currentValue: any ) : void{
        let freeTextAnnotation: any = this.freeTextAnnotationModule;
        freeTextAnnotation.inputBoxElement.style.fontFamily = currentValue;
        freeTextAnnotation.autoFitFreeText();
        let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
        let padding: number = parseFloat(freeTextAnnotation.inputBoxElement.style.paddingLeft);
        let inputEleHeight: number = currentAnnotation.bounds.height * zoomFactor;
        let characterLength : number = 8;
        let inputEleWidth: number = parseFloat(freeTextAnnotation.inputBoxElement.style.width) - characterLength;
        inputEleWidth = ((inputEleWidth) / zoomFactor);
        inputEleHeight = ((inputEleHeight) / zoomFactor);
        let heightDiff: number = (inputEleHeight - currentAnnotation.bounds.height);
        let y:number = undefined;
        if (heightDiff > 0) {
            y = currentAnnotation.wrapper.offsetY + (heightDiff / 2);
            y = y > 0 ? y : undefined;
        } else {
            heightDiff = Math.abs(heightDiff);
            y = currentAnnotation.wrapper.offsetY - (heightDiff / 2);
            y = y > 0 ? y: undefined;
        }
        let widthDiff : number= (inputEleWidth - currentAnnotation.bounds.width);
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
        this.pdfViewer.nodePropertyChange(currentAnnotation, { fontFamily: currentValue, bounds: { width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height, y: y, x:x } });
        this.pdfViewer.renderSelector(currentAnnotation.pageIndex, this.pdfViewer.annotationSelectorSettings);
        this.modifyInCollections(currentAnnotation, 'bounds');
    }

    private updateCanvas(canvas: any, pageWidth: number, pageHeight: number, pageNumber: number) {
        let ratio: number = this.pdfViewerBase.getZoomRatio();
        canvas.width = pageWidth * ratio;
        canvas.height = pageHeight * ratio;
        canvas.style.width = pageWidth  + 'px';
        canvas.style.height = pageHeight + 'px';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '1';
        this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
    }
}