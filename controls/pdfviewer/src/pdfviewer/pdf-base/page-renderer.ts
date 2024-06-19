import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';
import {AnnotationRenderer, ShapeAnnotationBase, PopupAnnotationBase, FreeTextAnnotationBase, MeasureShapeAnnotationBase, TextMarkupAnnotationBase, SignatureAnnotationBase, InkSignatureAnnotation, ImageStructureBase  } from './index';
import { PdfDocument, PdfPage, PdfRotationAngle, PdfSquareAnnotation, PdfAnnotationFlag, PdfPopupAnnotation, PdfFreeTextAnnotation, PdfRubberStampAnnotation, PdfTextMarkupAnnotation, PdfInkAnnotation, PdfLineAnnotation, PdfRectangleAnnotation, PdfCircleAnnotation, PdfEllipseAnnotation, PdfPolygonAnnotation, PdfPolyLineAnnotation , PdfAnnotation, PdfAnnotationCollection, PdfAngleMeasurementAnnotation, _PdfDictionary, PdfRubberStampAnnotationIcon, PdfAnnotationState, PdfAnnotationStateModel, _ContentParser, _stringToBytes, _PdfRecord, _encode, _PdfBaseStream, PdfPageSettings, PdfMargins, PdfTemplate } from '@syncfusion/ej2-pdf';
import { Matrix, Rect, Size } from '@syncfusion/ej2-drawings';

/**
 * PageRenderer
 *
 * @hidden
 */
export class PageRenderer{
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public shapeAnnotationList: ShapeAnnotationBase[] = [];
    /**
     * @private
     */
    public textMarkupAnnotationList: TextMarkupAnnotationBase [] = [];
    /**
     * @private
     */
    public measureAnnotationList: MeasureShapeAnnotationBase[] = [];
    /**
     * @private
     */
    public stickyAnnotationList: PopupAnnotationBase [] = [];
    /**
     * @private
     */
    public rubberStampAnnotationList: StampAnnotationBase[] = [];
    /**
     * @private
     */
    public freeTextAnnotationList: FreeTextAnnotationBase[] = [];
    /**
     * @private
     */
    public signatureAnnotationList: any[] = [];
    /**
     * @private
     */
    public signatureInkAnnotationList: InkSignatureAnnotation[] = [];
    /**
     * @private
     */
    public annotationOrder: any[] = [];
    /**
     * @private
     */
    public hyperlinks: any[] = [];
    /**
     * @private
     */
    public imageData: string = '';
    /**
     * @private
     */
    public isMaskedImage: boolean = false;
    /**
     * @private
     */
    public hyperlinkBounds: any[] = [];
    /**
     * @private
     */
    public annotationDestPage: any[] = [];
    /**
     * @private
     */
    public annotationList: any[] = [];
    /**
     * @private
     */
    public annotationYPosition: any[] = [];
    /**
     * @private
     */
    public digitalSignaturePresent: boolean = false;
    private annotationCount: number = 0;
    /**
     * @private
     */
    public isAnnotationPresent: boolean = false;
    /**
     *
     * @private
     */
    public htmldata: any[] = [];
    /**
     *
     * @private
     */
    public renderingMode: number = 0;
    private textString: string = '';
    private currentFont: string;
    private baseFont: string = '';
    private fontSize: number = 0;
    /**
     *
     * @private
     */
    public Imagedata: string;
    private IsMaskedImage: boolean;
    /**
     * @param {PdfViewer} pdfViewer - The PdfViewer.
     * @param {PdfViewerBase} pdfViewerBase - The PdfViewerBase.
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @param {number} pageNumber - pageNumber
     * @param {Size} pageSize - pageSize
     * @private
     * @returns {void}
     */
    public exportAnnotationComments(pageNumber: number, pageSize: Size): any{
        const page: PdfPage = this.pdfViewer.pdfRendererModule.loadedDocument.getPage(parseInt(pageNumber.toString(), 10));
        const pageRotation: PdfRotationAngle = page.rotation;
        return this.getAnnotationFromPDF(pageSize.height, pageSize.width, pageNumber, pageRotation);
    }

    private IsStampExist(subject: string): boolean {
        switch (subject.trim()) {
        case 'Approved':
        case 'Not Approved':
        case 'Confidential':
        case 'Draft':
        case 'Final':
        case 'Completed':
        case 'For Public Release':
        case 'Not For Public Release':
        case 'For Comment':
        case 'Void':
        case 'Preliminary Results':
        case 'Information Only':
        case 'Witness':
        case 'Initial Here':
        case 'Sign Here':
        case 'Accepted':
        case 'Rejected':
        case 'Revised':
        case 'Reviewed':
        case 'Received':
            return true;
        default:
            return false;
        }
    }

    private getAnnotationFromPDF(height: number, width: number, pageNumber: number, pageRotation: number): any{
        const loadedPage: PdfPage = this.pdfViewer.pdfRendererModule.loadedDocument.getPage(parseInt(pageNumber.toString(), 10));
        const annotRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        const textLabelCollection: string[] = [];
        let loadedFreetextAnnotations: PdfFreeTextAnnotation[] = [];
        this.isAnnotationPresent = false;
        if (loadedPage != null ){
            loadedFreetextAnnotations = this.getAllFreeTextAnnotations(loadedPage.annotations);
            this.annotationCount = 0;
            if (loadedPage.annotations != null && loadedPage.annotations.count > 0){
                this.isAnnotationPresent = true;
                for (let i: number = 0; i < loadedPage.annotations.count; i++) {
                    const annotation: PdfAnnotation = loadedPage.annotations.at(i);
                    if (annotation instanceof PdfTextMarkupAnnotation) {
                        const textMarkup: TextMarkupAnnotationBase =
                        annotRenderer.loadTextMarkupAnnotation((annotation as PdfTextMarkupAnnotation), height,
                                                               width, pageRotation, loadedPage);
                        this.textMarkupAnnotationList[this.textMarkupAnnotationList.length] = textMarkup;
                        this.annotationOrder[this.annotationOrder.length] = textMarkup;
                        const name: string = this.textMarkupAnnotationList[this.textMarkupAnnotationList.length - 1].AnnotName;
                        if (isNullOrUndefined(name) || name === '') {
                            this.textMarkupAnnotationList[this.textMarkupAnnotationList.length - 1].AnnotName =
                            this.setAnnotationName(pageNumber);
                        }
                    }
                    else if (annotation instanceof PdfLineAnnotation) {
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfLineAnnotation).name,
                                                                                        loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        const shapes: ShapeAnnotationBase = annotRenderer.loadLineAnnotation(annotation as PdfLineAnnotation,
                                                                                             height, width, pageRotation, shapeLabel);
                        const name: string = shapes.AnnotName;
                        if (isNullOrUndefined(name) || name === '') {
                            shapes.AnnotName = this.setAnnotationName(pageNumber);
                        }
                        if (!isNullOrUndefined(shapes)) {
                            if (shapes instanceof MeasureShapeAnnotationBase) {
                                this.measureAnnotationList[this.measureAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                            else if (shapes instanceof ShapeAnnotationBase) {
                                this.shapeAnnotationList[this.shapeAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                        }

                    }
                    else if (annotation instanceof PdfSquareAnnotation || annotation instanceof PdfRectangleAnnotation) {
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfSquareAnnotation).name,
                                                                                        loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        const shapes: ShapeAnnotationBase = annotRenderer.loadSquareAnnotation(annotation as PdfSquareAnnotation,
                                                                                               height, width, pageRotation, shapeLabel);
                        const name: string = shapes.AnnotName;
                        if (isNullOrUndefined(name) || name === '') {
                            shapes.AnnotName = this.setAnnotationName(pageNumber);
                        }
                        if (!isNullOrUndefined(shapes)) {
                            if (shapes instanceof MeasureShapeAnnotationBase) {
                                this.measureAnnotationList[this.measureAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                            else if (shapes instanceof ShapeAnnotationBase) {
                                this.shapeAnnotationList[this.shapeAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                        }
                    }
                    else if (annotation instanceof PdfCircleAnnotation) {
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfCircleAnnotation).name,
                                                                                        loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        const shapes: ShapeAnnotationBase = annotRenderer.loadEllipseAnnotation(annotation as PdfCircleAnnotation,
                                                                                                height, width, pageRotation, shapeLabel);
                        if (!isNullOrUndefined(shapes)) {
                            if (shapes instanceof MeasureShapeAnnotationBase) {
                                this.measureAnnotationList[this.measureAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                            else if (shapes instanceof ShapeAnnotationBase) {
                                this.shapeAnnotationList[this.shapeAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                        }
                    }
                    else if (annotation instanceof PdfEllipseAnnotation) {
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfCircleAnnotation).name,
                                                                                        loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        const shapes: ShapeAnnotationBase = annotRenderer.loadEllipseAnnotation(annotation as PdfCircleAnnotation,
                                                                                                height, width, pageRotation, shapeLabel);
                        if (!isNullOrUndefined(shapes)) {
                            if (shapes instanceof MeasureShapeAnnotationBase) {
                                this.measureAnnotationList[this.measureAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                            else if (shapes instanceof ShapeAnnotationBase) {
                                this.shapeAnnotationList[this.shapeAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                        }
                    }
                    else if (annotation instanceof PdfPolygonAnnotation) {
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfPolygonAnnotation).name,
                                                                                        loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        const shapes: ShapeAnnotationBase = annotRenderer.loadPolygonAnnotation(annotation as PdfPolygonAnnotation,
                                                                                                height, width, pageRotation, shapeLabel);
                        const name: string = shapes.AnnotName;
                        if (isNullOrUndefined(name) || name === '') {
                            shapes.AnnotName = this.setAnnotationName(pageNumber);
                        }
                        if (!isNullOrUndefined(shapes)) {
                            if (shapes instanceof MeasureShapeAnnotationBase) {
                                this.measureAnnotationList[this.measureAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                            else if (shapes instanceof ShapeAnnotationBase) {
                                this.shapeAnnotationList[this.shapeAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                        }
                    }
                    else if (annotation instanceof PdfPolyLineAnnotation || annotation instanceof PdfAngleMeasurementAnnotation) {
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfPolyLineAnnotation).name,
                                                                                        loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        const shapes: ShapeAnnotationBase = annotRenderer.loadPolylineAnnotation(annotation as PdfPolyLineAnnotation,
                                                                                                 height, width, pageRotation, shapeLabel);
                        const name: string = shapes.AnnotName;
                        if (isNullOrUndefined(name) || name === '') {
                            shapes.AnnotName = this.setAnnotationName(pageNumber);
                        }
                        if (!isNullOrUndefined(shapes)) {
                            if (shapes instanceof MeasureShapeAnnotationBase) {
                                this.measureAnnotationList[this.measureAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                            else if (shapes instanceof ShapeAnnotationBase) {
                                this.shapeAnnotationList[this.shapeAnnotationList.length] = shapes;
                                this.annotationOrder[this.annotationOrder.length] = shapes;
                            }
                        }
                    }
                    if (annotation instanceof PdfRubberStampAnnotation) {
                        this.htmldata = [];
                        const stampAnnotation: PdfRubberStampAnnotation = annotation as PdfRubberStampAnnotation;
                        if (stampAnnotation._dictionary.has('T') && this.checkName(stampAnnotation)) {
                            this.signatureAnnotationList.push(annotRenderer.loadSignatureImage(stampAnnotation, pageNumber));
                        }
                        else if (stampAnnotation._dictionary.has('M') || (stampAnnotation._dictionary.has("NM") || stampAnnotation._dictionary.has("Name") && !stampAnnotation._dictionary.has("F") || (!stampAnnotation._dictionary.has("NM") && !stampAnnotation._dictionary.has("T")))) {
                            const rubberStampAnnotation: StampAnnotationBase = new StampAnnotationBase();
                            rubberStampAnnotation.Author = stampAnnotation.author;
                            rubberStampAnnotation.Subject = stampAnnotation.subject;
                            rubberStampAnnotation.AnnotName = stampAnnotation.name;
                            if (rubberStampAnnotation.AnnotName === '' || rubberStampAnnotation.AnnotName === null) {
                                rubberStampAnnotation.AnnotName = this.setAnnotationName(pageNumber);
                            }
                            if (annotation._dictionary.has('rotateAngle')) {
                                const rotateAngle: any = annotation._dictionary.get('rotateAngle');
                                if (rotateAngle !== undefined) {
                                    // The rotateAngle will get as 1, 2 and 3 To save in RotateAngle multiplying with 90.
                                    rubberStampAnnotation.RotateAngle = parseInt(rotateAngle[0], 10) * 90;
                                }
                            } else {
                                // If the rotate angle is not specified in the annotation dictionary, then calculate it based on the page rotation.
                                rubberStampAnnotation.RotateAngle = 360 - (Math.abs(stampAnnotation.rotate) - (pageRotation * 90));
                                const rubberStampAnnotationAngle: number = rubberStampAnnotation.RotateAngle;
                                if (rubberStampAnnotation.RotateAngle >= 360) {
                                    rubberStampAnnotation.RotateAngle = rubberStampAnnotationAngle - 360;
                                }
                            }
                            let isBoundsEqual: boolean = false;
                            if (rubberStampAnnotation.RotateAngle !== 0) {
                                isBoundsEqual = (
                                    Math.ceil(stampAnnotation._innerTemplateBounds.x * 100) / 100 ===
                                    Math.ceil(stampAnnotation.bounds.x * 100) / 100 &&
                                    Math.ceil(stampAnnotation._innerTemplateBounds.y * 100) / 100 ===
                                    Math.ceil(stampAnnotation.bounds.y * 100) / 100 &&
                                    Math.ceil(stampAnnotation._innerTemplateBounds.width * 100) / 100 ===
                                    Math.ceil(stampAnnotation.bounds.width * 100) / 100 &&
                                    Math.ceil(stampAnnotation._innerTemplateBounds.height * 100) / 100 ===
                                    Math.ceil(stampAnnotation.bounds.height * 100) / 100
                                );
                            }
                            if ((rubberStampAnnotation.RotateAngle !== 0 && isBoundsEqual) || (rubberStampAnnotation.RotateAngle === 0)) {
                                rubberStampAnnotation.Rect = this.getBounds(stampAnnotation.bounds, height, width, pageRotation);
                            }
                            else {
                                const bounds: Rect = this.getRubberStampBounds(stampAnnotation._innerTemplateBounds,
                                                                               stampAnnotation.bounds, height, width, pageRotation);
                                rubberStampAnnotation.Rect = bounds;
                            }
                            if (rubberStampAnnotation.Rect.y < 0) {
                                const cropRect: Rect = new Rect(rubberStampAnnotation.Rect.x,
                                                                loadedPage.cropBox[1] + rubberStampAnnotation.Rect.y,
                                                                rubberStampAnnotation.Rect.width,
                                                                rubberStampAnnotation.Rect.height);
                                rubberStampAnnotation.Rect = this.getBounds(cropRect, height, width, pageRotation);
                            }
                            rubberStampAnnotation.Icon = stampAnnotation.icon;
                            if (!isNullOrUndefined(stampAnnotation.modifiedDate)){
                                rubberStampAnnotation.ModifiedDate = this.formatDate(stampAnnotation.modifiedDate);
                            }
                            else{
                                rubberStampAnnotation.ModifiedDate = this.formatDate(new Date());
                            }
                            rubberStampAnnotation.Opacity = stampAnnotation.opacity;
                            rubberStampAnnotation.pageNumber = pageNumber;
                            const dictionary: _PdfDictionary = annotation._dictionary.get('AP');
                            this.pdfViewerBase.pngData.push(stampAnnotation);
                            rubberStampAnnotation.IsDynamic = false;
                            rubberStampAnnotation.AnnotType = 'stamp';
                            if (Object.prototype.hasOwnProperty.call(stampAnnotation._dictionary, 'iconName')) {
                                rubberStampAnnotation.IconName = stampAnnotation.getValues('iconName')[0];
                            } else if (stampAnnotation.subject !== null) {
                                rubberStampAnnotation.IconName = stampAnnotation.subject;
                            } else {
                                rubberStampAnnotation.IconName = '';
                            }
                            if (!isNullOrUndefined(stampAnnotation.text)) {
                                rubberStampAnnotation.Note = stampAnnotation.text;
                            }
                            else {
                                rubberStampAnnotation.Note = '';
                            }
                            if (stampAnnotation.flags === PdfAnnotationFlag.readOnly) {
                                rubberStampAnnotation.IsCommentLock = true;
                            } else {
                                rubberStampAnnotation.IsCommentLock = false;
                            }
                            if (stampAnnotation.flags === PdfAnnotationFlag.locked) {
                                rubberStampAnnotation.IsLocked = true;
                            } else {
                                rubberStampAnnotation.IsLocked = false;
                            }
                            if (!isNullOrUndefined(stampAnnotation.reviewHistory)) {
                                for (let i: number = 0; i < stampAnnotation.reviewHistory.count; i++) {
                                    rubberStampAnnotation.State =
                                    this.getStateString(stampAnnotation.reviewHistory.at(parseInt(i.toString(), 10)).state);
                                    rubberStampAnnotation.StateModel =
                                    this.getStateModelString(stampAnnotation.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
                                }
                            }
                            if (rubberStampAnnotation.State == null || rubberStampAnnotation.StateModel == null) {
                                rubberStampAnnotation.State = 'Unmarked';
                                rubberStampAnnotation.StateModel = 'None';
                            }
                            rubberStampAnnotation.Comments = new Array<PopupAnnotationBase>();
                            for (let i: number = 0; i < stampAnnotation.comments.count; i++) {
                                const annot: PopupAnnotationBase =
                                annotRenderer.loadPopupAnnotation(stampAnnotation.comments.at(i), height, width, pageRotation);
                                rubberStampAnnotation.Comments.push(annot);
                            }
                            if (annotation._dictionary.has('Name')) {
                                rubberStampAnnotation.Name = annotation._dictionary.get('Name');
                                if (annotation._dictionary.get('Name').name.includes('#23D') || annotation._dictionary.get('Name').name.includes('#D')) {
                                    rubberStampAnnotation.IsDynamic = true;
                                }
                                if (!isNullOrUndefined(rubberStampAnnotation.Subject) &&
                                !(this.IsStampExist(rubberStampAnnotation.Subject))) {
                                    rubberStampAnnotation.Subject = stampAnnotation.icon.toString();
                                }
                            }
                            rubberStampAnnotation.IsMaskedImage = this.isMaskedImage;
                            rubberStampAnnotation.Apperarance = this.htmldata;
                            if (stampAnnotation._dictionary.has('CustomData')) {
                                const customData: string = stampAnnotation._dictionary.get('CustomData');
                                if (!(!isNullOrUndefined(customData) && customData.trim())) {
                                    const ExistingCustomData: any = dictionary.get('CustomData');
                                    if (ExistingCustomData) {
                                        rubberStampAnnotation.CustomData = ExistingCustomData;
                                    }
                                }
                            }
                            this.rubberStampAnnotationList.push(rubberStampAnnotation);
                            this.annotationOrder.push(rubberStampAnnotation);
                            if (isNullOrUndefined(dictionary)) {
                                const pdfReference: any = annotation._dictionary.get('AP');
                                if (!isNullOrUndefined(pdfReference) && !isNullOrUndefined(pdfReference.dictionary) && (pdfReference.dictionary.has('N')) ) {
                                    const apDictionary: any = pdfReference.dictionary;
                                    if (!isNullOrUndefined(apDictionary)) {
                                        const template: PdfTemplate = annotation.createTemplate();
                                        if (template.size[0] === 0 || template.size[1] === 0 || isNullOrUndefined(template._appearance))
                                        {this.findStampImage(annotation); }
                                        else
                                        {this.findStampTemplate(annotation, rubberStampAnnotation, pageRotation,
                                                                this.annotationOrder.length - 1); }
                                    }
                                }
                            }
                            else if (dictionary.has('N')) {
                                const template: PdfTemplate = annotation.createTemplate();
                                if (template.size[0] === 0 || template.size[1] === 0 || isNullOrUndefined(template._appearance))
                                {this.findStampImage(annotation); }
                                else
                                {this.findStampTemplate(annotation, rubberStampAnnotation, pageRotation,
                                                        this.annotationOrder.length - 1); }
                            }
                        }

                    }
                    if (annotation instanceof PdfPopupAnnotation) {
                        if (!annotation._dictionary.has('IRT')) {
                            const stickyNote: PopupAnnotationBase =
                            annotRenderer.loadPopupAnnotation(annotation as PdfPopupAnnotation, height, width, pageRotation);
                            this.stickyAnnotationList[this.stickyAnnotationList.length] = stickyNote;
                            this.annotationOrder[this.annotationOrder.length] = stickyNote;
                            const name: string = stickyNote.AnnotName;
                            if (isNullOrUndefined(name) || name === '') {
                                stickyNote.AnnotName = this.setAnnotationName(pageNumber);
                            }
                        }
                    }
                    if (annotation instanceof PdfFreeTextAnnotation) {
                        const freeTextAnnot: PdfFreeTextAnnotation = annotation as PdfFreeTextAnnotation;
                        const isFreeTextAnnotation: boolean = this.isFreeTextAnnotationType(freeTextAnnot);
                        if (isFreeTextAnnotation) {
                            const isShapeLabelAnnot: boolean = textLabelCollection.some((s: string) => s === freeTextAnnot.name);
                            const freeText: FreeTextAnnotationBase =
                            annotRenderer.loadFreeTextAnnotation(freeTextAnnot, height, width, pageRotation, loadedPage);
                            if (!isShapeLabelAnnot) {
                                this.freeTextAnnotationList[this.freeTextAnnotationList.length] = freeText;
                                this.annotationOrder[this.annotationOrder.length] = freeText;
                            }
                        }
                        else {
                            const freeText: SignatureAnnotationBase =
                            annotRenderer.loadSignatureText(freeTextAnnot, pageNumber, height, width, pageRotation);
                            if (!freeTextAnnot._dictionary.has('T')) {
                                this.signatureAnnotationList[this.signatureAnnotationList.length] = freeText;
                                this.annotationOrder[this.annotationOrder.length] = freeText;
                            }
                        }
                    }
                    if (annotation instanceof PdfInkAnnotation) {
                        const inkAnnotation: PdfInkAnnotation = annotation as PdfInkAnnotation;
                        const signatureData: SignatureAnnotationBase =
                        annotRenderer.loadSignature(inkAnnotation, height, width, pageRotation, pageNumber, loadedPage);
                        const inkSignatureData: InkSignatureAnnotation =
                        annotRenderer.loadInkAnnotation(inkAnnotation, height, width, pageRotation, pageNumber, loadedPage);
                        if (!inkAnnotation._dictionary.has('T')) {
                            this.signatureAnnotationList.push(signatureData);
                            this.annotationOrder.push(signatureData);
                        }
                        else if (inkAnnotation._dictionary.has('NM')) {
                            this.signatureInkAnnotationList.push(inkSignatureData);
                            this.annotationOrder.push(inkSignatureData);
                        }
                        else if (inkAnnotation._dictionary.has('T')) {
                            if (inkAnnotation._dictionary.has('annotationSignature')) {
                                let canAdd: boolean = true;
                                canAdd = inkAnnotation.getValues('annotationSignature').length > 0 ? false : true;
                                if (canAdd) {
                                    this.signatureAnnotationList.push(signatureData);
                                    this.annotationOrder.push(signatureData);
                                }
                            }
                        }
                        if (!inkAnnotation._dictionary.has('NM') && !inkAnnotation._dictionary.has('annotationSignature')) {
                            this.signatureAnnotationList.push(signatureData);
                            this.annotationOrder.push(signatureData);
                        }
                    }
                }
            }
        }
        return {shapeAnnotation: this.shapeAnnotationList, textMarkupAnnotation : this.textMarkupAnnotationList,
            measureShapeAnnotation : this.measureAnnotationList, stampAnnotations : this.rubberStampAnnotationList,
            stickyNotesAnnotation : this.stickyAnnotationList, freeTextAnnotation: this.freeTextAnnotationList,
            signatureAnnotation: this.signatureAnnotationList, signatureInkAnnotation: this.signatureInkAnnotationList,
            annotationOrder: this.annotationOrder };
    }

    private formatDate(date: Date): string {
        const month: string = this.datePadding(date.getMonth() + 1); // Months are zero-based
        const day: string = this.datePadding(date.getDate());
        const year: number = date.getFullYear();
        const hours: string = this.datePadding(date.getHours());
        const minutes: string = this.datePadding(date.getMinutes());
        const seconds: string = this.datePadding(date.getSeconds());

        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // Pad the numbers with leading zeros if they are single digits
    private datePadding(number: number): string {
        return number < 10 ? ('0' + number) : number.toString();
    }

    /**
     * @private
     * @param {PdfAnnotation} annotation - annotation
     * @returns {void}
     */
    public findStampImage(annotation: PdfAnnotation): void {
        const stream: any = annotation._dictionary.get('AP').get('N');
        if (!isNullOrUndefined(stream)) {
            const appearance: _PdfBaseStream = stream as _PdfBaseStream;
            const data: string = appearance.getString();
            const content: number[] = _stringToBytes(data, true) as number[];
            const parser: _ContentParser = new _ContentParser(content);
            const result: _PdfRecord[] = parser._readContent();
            this.stampAnnoattionRender(result, stream);

        }
    }

    /**
     * @private
     * @param {PdfRubberStampAnnotation} annotation - annotation
     * @param {any} rubberStampAnnotation - rubberStampAnnotation
     * @param {number} pageRotation - pageRotation
     * @param {number} collectionOrder - Gets the collection order
     * @returns {void}
     */
    public findStampTemplate(annotation: PdfRubberStampAnnotation, rubberStampAnnotation: any, pageRotation: number,
                             collectionOrder: number): void {
        // Create a template from the appearance of rubber stamp annotation
        const template: PdfTemplate = annotation.createTemplate();
        //Store custom stamp model calss
        rubberStampAnnotation.template = template._appearance;
        rubberStampAnnotation.templateSize = template.size;
        const stampDocument: PdfDocument = new PdfDocument(this.readFromResources());
        // Add a new page with template size and no margins
        const pageSettings: PdfPageSettings = new PdfPageSettings();
        pageSettings.margins = new PdfMargins(0);
        // pageSettings.rotation = this.getPageRotation(annotation);
        pageSettings.rotation = pageRotation;
        pageSettings.size = template.size;
        const page: PdfPage = stampDocument.addPage(pageSettings);
        // Draw template into new page graphics
        page.graphics.drawTemplate(template, {x: 0, y: 0, width: template.size[0], height: template.size[1]});
        // Remove existing PDF page at index 0
        stampDocument.removePage(0);
        // Save the PDF document which have appearance template
        let data: string =  'data:application/pdf;base64,' + _encode(stampDocument.save());
        data = this.pdfViewerBase.checkDocumentData(data);
        const fileByteArray: any = this.pdfViewerBase.convertBase64(data);
        this.pdfViewerBase.pdfViewerRunner.postMessage({ uploadedFile: fileByteArray, message: 'LoadPageStampCollection', password: null, pageIndex: 0, zoomFactor: this.pdfViewer.magnificationModule.zoomFactor, isTextNeed: false, isZoomMode: false, AnnotName: rubberStampAnnotation.AnnotName, rubberStampAnnotationPageNumber: rubberStampAnnotation.pageNumber, annotationOrder: JSON.stringify(this.annotationOrder), collectionOrder: collectionOrder});
    }

    /**
     * @private
     * @param {any} data - data
     * @returns {void}
     */
    public initialPagesRendered(data: any): void {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const { value, width, height } = data;
        canvas.width = width;
        canvas.height = height;
        const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
        const imageData: ImageData = canvasContext.createImageData(width, height);
        imageData.data.set(value);
        canvasContext.putImageData(imageData, 0, 0);
        const imageUrl: string = canvas.toDataURL();
        this.pdfViewerBase.releaseCanvas(canvas);
        let base64string: string = this.pdfViewerBase.checkDocumentData(imageUrl);
        const Json: any = { imagedata: imageUrl };
        const id: any = data.annotName;
        let annotOrder: any = [];
        if (JSON.parse(data.annotationOrder).length > 0) {
            annotOrder = JSON.parse(data.annotationOrder);
        }
        else {
            if (this.pdfViewer.viewerBase.importedAnnotation &&
                this.pdfViewer.viewerBase.importedAnnotation[data.rubberStampAnnotationPageNumber]) {
                annotOrder = this.pdfViewer.viewerBase.importedAnnotation[data.rubberStampAnnotationPageNumber].annotationOrder;
            }
        }
        const currentAnnot: any = annotOrder.find((currentAnnotation: { AnnotName: any; }) => id === currentAnnotation.AnnotName);
        if (currentAnnot) {
            if (!isNullOrUndefined(currentAnnot.Apperarance)) {
                currentAnnot.Apperarance = [];
            }
            currentAnnot.Apperarance.push(Json);
            this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotImage(currentAnnot, 0, null, null, true, true,
                                                                                        data.collectionOrder);
        }
        this.Imagedata = imageUrl;
    }

    /**
     * @private
     * @returns {void}
     */
    public readFromResources(): string {
        const base64string: string = 'JVBERi0xLjUNCiWDkvr+DQo0IDAgb2JqDQo8PA0KL1R5cGUgL0NhdGFsb2cNCi9QYWdlcyA1IDAgUg0KL0Fjcm9Gb3JtIDYgMCBSDQo+Pg0KZW5kb2JqDQoxIDAgb2JqDQo8PA0KL0ZpbHRlciAvRmxhdGVEZWNvZGUNCi9MZW5ndGggMTINCj4+DQpzdHJlYW0NCnheUyhU4AIAAiEAvA0KZW5kc3RyZWFtDQplbmRvYmoNCjIgMCBvYmoNCjw8DQovRmlsdGVyIC9GbGF0ZURlY29kZQ0KL0xlbmd0aCAxMg0KPj4NCnN0cmVhbQ0KeF5TCFTgAgABwQCcDQplbmRzdHJlYW0NCmVuZG9iag0KMyAwIG9iag0KPDwNCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlDQovTGVuZ3RoIDEzNQ0KPj4NCnN0cmVhbQ0KeF5tjs0KwjAQhO8L+w578diYSlu9+wSC4DnUbRvIT0324ttrogiih2UYlm9mbggbOi4mzExjbGK62mCEKd+zsCeJ5HiSrcRVIbRKa1Lv+5hDtytCo69Zzq7kTZptyE+k0+XXvKRv++r2QyUSIywIFwoFPCcTsivdvzv+dn9F1/YTwgN6hTPqDQplbmRzdHJlYW0NCmVuZG9iag0KOSAwIG9iag0KPDwNCi9GaXJzdCAyNg0KL04gNA0KL1R5cGUgL09ialN0bQ0KL0ZpbHRlciAvRmxhdGVEZWNvZGUNCi9MZW5ndGggMTk2DQo+Pg0Kc3RyZWFtDQp4Xm1PTQuCQBC9L+x/mF+Qu34H4qHCSwRi3cTDYkMI4YauUP++WcVM6rA784b35r0JQHAWgpQ+ZxFIL+QsBlcIzpKEM+fyeiA4ubphT+jYXHsoIxBQVAT3emgNSOoK7PXQ1dhDkqQpZzQ64bVRO/2EciME2BdsA1ti36Vi9YU2yqANMGlGx6zBu3WpVtPF6l+ieE6Uqw6JF1i80i+qhRVNLNrdGsK0R9oJuOPvzTu/b7PiTtdnNFA6+SH7hPy55Q19a1EBDQplbmRzdHJlYW0NCmVuZG9iag0KMTAgMCBvYmoNCjw8DQovUm9vdCA0IDAgUg0KL0luZGV4IFswIDExXQ0KL1NpemUgMTENCi9UeXBlIC9YUmVmDQovVyBbMSAyIDFdDQovRmlsdGVyIC9GbGF0ZURlY29kZQ0KL0xlbmd0aCA0NA0KPj4NCnN0cmVhbQ0KeF4Vw0ENACAMALG77cVzBvCFUEShAkaTAlcWstFCimD89uipB3PyAFuGA3QNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCnN0YXJ0eHJlZg0KNzk4DQolJUVPRg0KJVBERi0xLjUNCiWDkvr+DQoxMSAwIG9iag0KPDwNCi9GaXJzdCA1DQovTiAxDQovVHlwZSAvT2JqU3RtDQovRmlsdGVyIC9GbGF0ZURlY29kZQ0KL0xlbmd0aCA3MQ0KPj4NCnN0cmVhbQ0KeF4zVzDg5bKx4eXSd84vzStRMOTl0g+pLEhV0A9ITE8tBvK8M1OKFaItFAwUgmKB3IDEolSgOlMQn5fLzo6Xi5cLAEOtEAkNCmVuZHN0cmVhbQ0KZW5kb2JqDQoxMiAwIG9iag0KPDwNCi9Sb290IDQgMCBSDQovSW5kZXggWzAgMSA3IDEgMTEgMl0NCi9TaXplIDEzDQovVHlwZSAvWFJlZg0KL1cgWzEgMiAxXQ0KL1ByZXYgNzk4DQovTGVuZ3RoIDI0DQovRmlsdGVyIC9GbGF0ZURlY29kZQ0KPj4NCnN0cmVhbQ0KeF5jYGD4z8TAzcDIwsLAyLKbAQAPSwHWDQplbmRzdHJlYW0NCmVuZG9iag0KDQpzdGFydHhyZWYNCjEyMTENCiUlRU9GDQo=';
        return base64string;
    }

    /**
     * @private
     * @param {PdfRubberStampAnnotation} annotation - annotation
     * @returns {void}
     */
    public getPageRotation(annotation: PdfRubberStampAnnotation): number {
        if (annotation.rotate === 0) {
            return 0;
        } else if (annotation.rotate === 90) {
            return 1;
        } else if (annotation.rotate === 180) {
            return 2;
        } else if (annotation.rotate === 270) {
            return 3;
        }
        return 0;
    }


    private stampAnnoattionRender(recordCollection: _PdfRecord[], dictionary: any): void {
        if (!isNullOrUndefined(recordCollection)) {
            for (let i: number = 0; i < recordCollection.length; i++) {
                const element: string[] = recordCollection[parseInt(i.toString(), 10)]._operands;
                switch (recordCollection[parseInt(i.toString(), 10)]._operator) {
                case 'q': {
                    const Json: any = { restorecanvas: false };
                    this.htmldata.push(Json);
                    break;
                }
                case 'Q': {
                    const Json: any = { restorecanvas: true };
                    this.htmldata.push(Json);
                    break;
                }
                case 'Tr': {
                    this.renderingMode = parseInt(element[0], 10);
                    break;
                }
                case 'TJ':
                case 'Tj': {
                    this.textString = recordCollection[parseInt(i.toString(), 10)]._operands[0];
                    const Json: any = { type: 'string', text: this.textString, currentFontname: this.currentFont, baseFontName: this.baseFont, fontSize: this.fontSize };
                    this.htmldata.push(Json);
                    break;
                }
                case '\'': {
                    this.textString = recordCollection[parseInt(i.toString(), 10)]._operands[0];
                    const Json: any = { type: 'string', text: this.textString, currentFontname: this.currentFont, baseFontName: this.baseFont, fontSize: this.fontSize };
                    this.htmldata.push(Json);
                    break;
                }
                case 'Tf': {
                    let j: number = 0;
                    for (j = 0; j < element.length; j++) {
                        if (element[parseInt(j.toString(), 10)].includes('/')) {
                            this.currentFont = element[parseInt(j.toString(), 10)].replace('/', '');
                            break;
                        }
                    }
                    this.fontSize = parseInt(element[j + 1], 10);
                    if (dictionary.dictionary.has('Resources')) {
                        const stdic: any = dictionary.dictionary.get('Resources');
                        if (!isNullOrUndefined(stdic)) {
                            const fontObject: any = stdic.get('Font');
                            if (!isNullOrUndefined(fontObject) && recordCollection[parseInt(i.toString(), 10)]._operator === 'Tf') {
                                const name: string = element[0].replace('/', '');
                                const refernceholder: any = fontObject.get(name);
                                if (!isNullOrUndefined(refernceholder) && !isNullOrUndefined(refernceholder.dictionary)) {
                                    const sub: any = refernceholder.dictionary;
                                    this.baseFont = sub.get('BaseFont');
                                }

                            }

                        }
                    }
                    break;
                }
                case 'Do': {
                    if (dictionary.dictionary.has('Resources')) {
                        const stdic: any = dictionary.dictionary.get('Resources');
                        if (!isNullOrUndefined(stdic)) {
                            const xObject: any = stdic.get('XObject');
                            if (!isNullOrUndefined(xObject) && recordCollection[parseInt(i.toString(), 10)]._operator === 'Do') {
                                const name: string = element[0].replace('/', '');
                                if (xObject.has(name)) {
                                    const refernceholder: _PdfBaseStream = xObject.get(name);
                                    if (!isNullOrUndefined(refernceholder) && !isNullOrUndefined(refernceholder.dictionary)) {
                                        const sub: _PdfBaseStream = refernceholder;
                                        if (sub.dictionary.get('Subtype').name === 'Image') {
                                            const imageStucture: ImageStructureBase = new ImageStructureBase(sub, sub.dictionary);
                                            if (!isNullOrUndefined(imageStucture)) {
                                                const imageStream: Uint8Array = imageStucture.getImageStream();
                                                const imageString: string = 'data:image/png;base64,' + _encode(imageStream);
                                                const Json: any = { imagedata: imageString };
                                                this.htmldata.push(Json);
                                                this.Imagedata = imageString;
                                            }
                                        }
                                        else if (sub.dictionary.get('Subtype').name === 'Form') {
                                            const appearance: _PdfBaseStream = sub as _PdfBaseStream;
                                            const data: string = appearance.getString();
                                            const content: number[] = _stringToBytes(data, true) as number[];
                                            const parser: _ContentParser = new _ContentParser(content);
                                            const result: _PdfRecord[] = parser._readContent();
                                            this.stampAnnoattionRender(result, sub);
                                        }
                                        this.IsMaskedImage = false;
                                        if (sub.dictionary.get('SMask')) {
                                            this.IsMaskedImage = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                }
            }
        }
    }


    private getStateModelString(stateModel: PdfAnnotationStateModel): string {
        switch (stateModel) {
        case PdfAnnotationStateModel.review:
            return 'Review';
        case PdfAnnotationStateModel.marked:
            return 'Marked';
        case PdfAnnotationStateModel.none:
            return 'None';
        default:
            return 'None';
        }
    }

    private getStateString(state: PdfAnnotationState): string {
        switch (state) {
        case PdfAnnotationState.accepted:
            return 'Accepted';
        case PdfAnnotationState.rejected:
            return 'Rejected';
        case PdfAnnotationState.cancel:
            return 'Cancelled';
        case PdfAnnotationState.completed:
            return 'Completed';
        case PdfAnnotationState.none:
            return 'None';
        case PdfAnnotationState.unmarked:
            return 'Unmarked';
        case PdfAnnotationState.marked:
            return 'Marked';
        case PdfAnnotationState.unknown:
            return 'Unknown';
        default:
            return null;
        }
    }

    private getBounds(bounds: any, pageHeight: number, pageWidth: number, pageRotation: number): Rect {
        let bound: Rect;
        if (pageRotation === 0) {
            bound = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        else if (pageRotation === 1) {
            bound = new Rect(this.convertPixelToPoint(pageWidth - this.convertPointToPixel(bounds.y) -
            this.convertPointToPixel(bounds.height)), bounds.x, bounds.height, bounds.width);
        }
        else if (pageRotation === 2) {
            bound = new Rect(this.convertPixelToPoint(pageWidth - this.convertPointToPixel(bounds.x) -
            this.convertPointToPixel(bounds.width)), this.convertPixelToPoint(pageHeight -
                this.convertPointToPixel(bounds.y) - this.convertPointToPixel(bounds.height)), bounds.width, bounds.height);
        }
        else if (pageRotation === 3) {
            bound = new Rect(bounds.y, this.convertPixelToPoint(pageHeight - this.convertPointToPixel(bounds.x) -
            this.convertPointToPixel(bounds.width)), bounds.height, bounds.width);
        }
        return bound;
    }

    private getRubberStampBounds(innerTemplateBounds: any, bounds: any, pageHeight: number, pageWidth: number, pageRotation: number): Rect {
        let bound: Rect = new Rect();
        let centerPointX: number = 0;
        let centerPointY: number = 0;
        if (pageRotation === 0) {
            centerPointX = bounds.x + (bounds.width / 2);
            centerPointY = bounds.y + (bounds.height / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY -
            (innerTemplateBounds.height / 2), innerTemplateBounds.width, innerTemplateBounds.height);
        } else if (pageRotation === 1) {
            const boundsX: number = this.convertPixelToPoint(pageWidth - this.convertPointToPixel(!isNullOrUndefined(bounds.Y) ?
                bounds.Y : bounds.y) - this.convertPointToPixel(bounds.height));
            const boundsY: number = !isNullOrUndefined(bounds.X) ? bounds.X : bounds.x;
            centerPointX = boundsX + (bounds.height / 2);
            centerPointY = boundsY + (bounds.width / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY - (innerTemplateBounds.height / 2),
                             innerTemplateBounds.width, innerTemplateBounds.height);
        } else if (pageRotation === 2) {
            const boundsX: number = this.convertPixelToPoint(pageWidth - this.convertPointToPixel(!isNullOrUndefined(bounds.X) ?
                bounds.X : bounds.x) - this.convertPointToPixel(bounds.width));
            const boundsY: number = this.convertPixelToPoint(pageHeight - this.convertPointToPixel(!isNullOrUndefined(bounds.Y) ?
                bounds.Y : bounds.y) - this.convertPointToPixel(bounds.height));
            centerPointX = boundsX + (bounds.width / 2);
            centerPointY = boundsY + (bounds.height / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY - (innerTemplateBounds.height / 2),
                             innerTemplateBounds.width, innerTemplateBounds.height);
        } else if (pageRotation === 3) {
            const boundsX: number = !isNullOrUndefined(bounds.Y) ? bounds.Y : bounds.y;
            const boundsY: number = this.convertPixelToPoint(pageHeight - this.convertPointToPixel(!isNullOrUndefined(bounds.X) ?
                bounds.X : bounds.x) - this.convertPointToPixel(bounds.width));
            centerPointX = boundsX + (bounds.height / 2);
            centerPointY = boundsY + (bounds.width / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY - (innerTemplateBounds.height / 2),
                             innerTemplateBounds.width, innerTemplateBounds.height);
        }
        return bound;

    }

    private convertPixelToPoint(value: number): number {
        return (value * 72 / 96);
    }

    private convertPointToPixel(value: number): number {
        return (value * 96 / 72);
    }

    private getRotateAngleString(angle: PdfRotationAngle): string {
        switch (angle) {
        case PdfRotationAngle.angle0:
            return 'RotateAngle0';
        case PdfRotationAngle.angle90:
            return 'RotateAngle90';
        case PdfRotationAngle.angle180:
            return 'RotateAngle180';
        case PdfRotationAngle.angle270:
            return 'RotateAngle270';
        default:
            return 'RotateAngle0';
        }
    }

    private checkName(stampAnnotation: PdfRubberStampAnnotation): boolean {
        // Check if the stamp annotation has a "Name" key in its dictionary.
        if ('Name' in stampAnnotation._dictionary) {
            // Get the custom data for the "Name" key.
            const customData: string[] = stampAnnotation.getValues('Name');
            // Check if the custom data is not null and contains a '#' character.
            if (!(isNullOrUndefined(customData)) && customData.indexOf('#') > -1) {
                // The stamp annotation has a name that contains a '#' character.
                return true;
            }
        }
        // The stamp annotation does not have a name that contains a '#' character.
        return false;
    }

    private getAllFreeTextAnnotations(annotations: PdfAnnotationCollection): PdfFreeTextAnnotation[] {
        const loadedFreetextAnnotations: PdfFreeTextAnnotation[] = [];
        for (let i: number = 0; i < annotations.count; i++) {
            const annotation: PdfAnnotation = annotations.at(i);
            if (annotation instanceof PdfFreeTextAnnotation){
                loadedFreetextAnnotations.push(annotation as PdfFreeTextAnnotation);
            }
        }
        return loadedFreetextAnnotations;
    }

    private getShapeFreeText(shapeName: string, loadedFreetextAnnotations: PdfFreeTextAnnotation[]): PdfFreeTextAnnotation {
        if (!isNullOrUndefined(shapeName) && shapeName !== ''){
            return loadedFreetextAnnotations.find((annot: PdfFreeTextAnnotation) => annot.name != undefined && annot.name.includes(shapeName));
        }
        return null;
    }

    private setAnnotationName(pageNumber: number): string {
        const annotationName: string = pageNumber + this.annotationCount.toString();
        this.annotationCount++;
        return annotationName;
    }

    private isFreeTextAnnotationType(freeTextAnnot: PdfFreeTextAnnotation): boolean {
        let isFreeTextAnnotation: boolean = true;
        if (freeTextAnnot._dictionary.has('AnnotationType')){
            const annotType: string[] = freeTextAnnot.getValues('AnnotationType');
            if (!isNullOrUndefined(annotType) && annotType[0] === 'Signature'){
                isFreeTextAnnotation = false;
            }
        }
        return isFreeTextAnnotation;
    }


}

/**
 *
 * @hidden
 */
export class StampAnnotationBase{
    public StampAnnotationtype: string;
    public Author: string;
    public pageNumber: number;
    public AnnotationSelectorSettings: any;
    public Matrix: Matrix;
    public ModifiedDate: string;
    public CreationDate: string;
    public ExistingCustomData: string;
    public IsCommentLock: boolean;
    public IsLocked: boolean;
    public Subject: string;
    public Note: string;
    public StrokeColor: string;
    public FillColor: string;
    public Opacity: number;
    public Apperarance: any[];
    public Rect: Rect;
    public RotateAngle: number;
    public Name: string;
    public IsDynamic: boolean;
    public AnnotName: string;
    public AnnotationSettings: any;
    public AllowedInteractions: string[];
    public CustomData: { [key: string]: any };
    public IsPrint: boolean;
    public IsMaskedImage: boolean;
    public AnnotType: string;
    public Icon: PdfRubberStampAnnotationIcon;
    public IconName: string;
    public State: string;
    public StateModel: any;
    public Comments: PopupAnnotationBase[];
}
