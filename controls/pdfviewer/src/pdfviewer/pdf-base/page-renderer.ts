import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';
import {FormFieldsBase, AnnotationRenderer, ShapeAnnotationBase, PdfLayer, PopupAnnotationBase, FreeTextAnnotationBase, MeasureShapeAnnotationBase, AnnotBounds, TextMarkupAnnotationBase, SignatureAnnotationBase, InkSignatureAnnotation, ImageStructureBase  } from './index';
import { PdfAnnotationBorder, PdfDocument, PdfPage, PdfRotationAngle, PdfSquareAnnotation, PdfAnnotationFlag, PdfPopupAnnotation, PdfFreeTextAnnotation, PdfRubberStampAnnotation, PdfTextMarkupAnnotation, PdfInkAnnotation, PdfLineAnnotation, PdfRectangleAnnotation, PdfCircleAnnotation, PdfEllipseAnnotation, PdfPolygonAnnotation, PdfPolyLineAnnotation , PdfAnnotation, PdfFont, PdfAnnotationCollection, PdfAngleMeasurementAnnotation, _PdfCrossReference, _PdfDictionary, _PdfStream, PdfRubberStampAnnotationIcon, PdfAnnotationState, PdfAnnotationStateModel, _PdfReference, _ContentParser, _stringToBytes, _bytesToString, _PdfRecord, _encode, _PdfBaseStream } from '@syncfusion/ej2-pdf';
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

    private textString: string = "";

    private currentFont: string;

    private baseFont: string = "";

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
     * @param {number} pageNumber
     * @param {Size} pageSize
     * @private
     */
    public exportAnnotationComments(pageNumber: number, pageSize: Size): any{
        const page: PdfPage = this.pdfViewer.pdfRendererModule.loadedDocument.getPage(parseInt(pageNumber.toString(), 10));
        const pageRotation: PdfRotationAngle = page.rotation;
        return this.getAnnotationFromPDF(pageSize.height, pageSize.width, pageNumber, pageRotation);
    }

    private IsStampExist(subject: string): boolean {
        switch (subject.trim()) {
            case "Approved":
            case "Not Approved":
            case "Confidential":
            case "Draft":
            case "Final":
            case "Completed":
            case "For Public Release":
            case "Not For Public Release":
            case "For Comment":
            case "Void":
            case "Preliminary Results":
            case "Information Only":
            case "Witness":
            case "Initial Here":
            case "Sign Here":
            case "Accepted":
            case "Rejected":
            case "Revised":
            case "Reviewed":
            case "Received":
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
                        // eslint-disable-next-line max-len
                        const textMarkup: TextMarkupAnnotationBase = annotRenderer.loadTextMarkupAnnotation((annotation as PdfTextMarkupAnnotation), height, width, pageRotation, loadedPage);
                        this.textMarkupAnnotationList[this.textMarkupAnnotationList.length] = textMarkup;
                        this.annotationOrder[this.annotationOrder.length] = textMarkup;
                        const name: string = this.textMarkupAnnotationList[this.textMarkupAnnotationList.length - 1].AnnotName;
                        if (isNullOrUndefined(name) || name === '') {
                            // eslint-disable-next-line max-len
                            this.textMarkupAnnotationList[this.textMarkupAnnotationList.length - 1].AnnotName = this.setAnnotationName(pageNumber);
                        }
                    }
                    else if (annotation instanceof PdfLineAnnotation) {
                        // eslint-disable-next-line max-len
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfLineAnnotation).name, loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        // eslint-disable-next-line max-len
                        const shapes: ShapeAnnotationBase = annotRenderer.loadLineAnnotation(annotation as PdfLineAnnotation, height, width, pageRotation, shapeLabel);
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
                        // eslint-disable-next-line max-len
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfSquareAnnotation).name, loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        // eslint-disable-next-line max-len
                        const shapes: ShapeAnnotationBase = annotRenderer.loadSquareAnnotation(annotation as PdfSquareAnnotation, height, width, pageRotation, shapeLabel);
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
                    else if (annotation instanceof PdfRectangleAnnotation) {
                        //rectangle annotation
                    }
                    else if (annotation instanceof PdfCircleAnnotation) {
                        // eslint-disable-next-line max-len
                        let shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfCircleAnnotation).name, loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        // eslint-disable-next-line max-len
                        let shapes: ShapeAnnotationBase = annotRenderer.loadEllipseAnnotation(annotation as PdfCircleAnnotation, height, width, pageRotation, shapeLabel);
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
                        // eslint-disable-next-line max-len
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfCircleAnnotation).name, loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        // eslint-disable-next-line max-len
                        const shapes: ShapeAnnotationBase = annotRenderer.loadEllipseAnnotation(annotation as PdfCircleAnnotation, height, width, pageRotation, shapeLabel);
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
                        // eslint-disable-next-line max-len
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfPolygonAnnotation).name, loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        // eslint-disable-next-line max-len
                        const shapes: ShapeAnnotationBase = annotRenderer.loadPolygonAnnotation(annotation as PdfPolygonAnnotation, height, width, pageRotation, shapeLabel);
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
                        // eslint-disable-next-line max-len
                        const shapeLabel: PdfFreeTextAnnotation = this.getShapeFreeText((annotation as PdfPolyLineAnnotation).name, loadedFreetextAnnotations);
                        if (!isNullOrUndefined(shapeLabel)) {
                            textLabelCollection.push(shapeLabel.name);
                        }
                        // eslint-disable-next-line max-len
                        const shapes: ShapeAnnotationBase = annotRenderer.loadPolylineAnnotation(annotation as PdfPolyLineAnnotation, height, width, pageRotation, shapeLabel);
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
                        let stampAnnotation: PdfRubberStampAnnotation = annotation as PdfRubberStampAnnotation;

                        if (stampAnnotation._dictionary.has('T') && this.checkName(stampAnnotation)) {
                            this.signatureAnnotationList.push(annotRenderer.loadSignatureImage(stampAnnotation, pageNumber))
                        }
                        else if (stampAnnotation._dictionary.has("M")) {
                            let rubberStampAnnotation: StampAnnotationBase = new StampAnnotationBase();
                            rubberStampAnnotation.Author = stampAnnotation.author;
                            rubberStampAnnotation.Subject = stampAnnotation.subject;
                            rubberStampAnnotation.AnnotName = stampAnnotation.name;
                            if (rubberStampAnnotation.AnnotName === '' || rubberStampAnnotation.AnnotName === null) {
                                rubberStampAnnotation.AnnotName = this.setAnnotationName(pageNumber);
                            }
                            if (annotation._dictionary.has("rotateAngle")) {
                                const rotateAngle = annotation._dictionary.get("rotateAngle");
                                if (rotateAngle !== undefined) {
                                    // The rotateAngle will get as 1, 2 and 3 To save in RotateAngle multiplying with 90.
                                    rubberStampAnnotation.RotateAngle = parseInt(rotateAngle[0]) * 90;
                                }
                            } else {
                                // If the rotate angle is not specified in the annotation dictionary, then calculate it based on the page rotation.
                                rubberStampAnnotation.RotateAngle = 360 - (Math.abs(stampAnnotation.rotate * 90) - (pageRotation * 90));
                                let rubberStampAnnotationAngle: number = rubberStampAnnotation.RotateAngle;
                                if (rubberStampAnnotation.RotateAngle > 360) {
                                    rubberStampAnnotation.RotateAngle = rubberStampAnnotationAngle - 360;
                                }
                            }
                            if (rubberStampAnnotation.RotateAngle != 0) {

                                let bounds: Rect = this.getRubberStampBounds(stampAnnotation._innerTemplateBounds, stampAnnotation.bounds, height, width, pageRotation);
                                rubberStampAnnotation.Rect = bounds;
                            }
                            else {
                                rubberStampAnnotation.Rect = this.getBounds(stampAnnotation.bounds, height, width, pageRotation)
                            }
                            if (rubberStampAnnotation.Rect.y) {
                                let cropRect: Rect = new Rect(rubberStampAnnotation.Rect.x, loadedPage.cropBox[1] + rubberStampAnnotation.Rect.y, rubberStampAnnotation.Rect.width, rubberStampAnnotation.Rect.height);
                                rubberStampAnnotation.Rect = this.getBounds(cropRect, height, width, pageRotation);
                            }
                            rubberStampAnnotation.Icon = stampAnnotation.icon;
                            rubberStampAnnotation.ModifiedDate = stampAnnotation.modifiedDate.toString();
                            rubberStampAnnotation.Opacity = stampAnnotation.opacity;
                            rubberStampAnnotation.pageNumber = pageNumber;
                            let dictionary: _PdfDictionary = annotation._dictionary.get('AP');
                            this.pdfViewerBase.pngData.push(stampAnnotation);
                            rubberStampAnnotation.IsDynamic = false;
                            rubberStampAnnotation.AnnotType = 'stamp';
                            if (stampAnnotation._dictionary.hasOwnProperty("iconName")) { 
                                rubberStampAnnotation.IconName = stampAnnotation.getValues("iconName")[0];
                            } else if (stampAnnotation.subject !== null) {
                                rubberStampAnnotation.IconName = stampAnnotation.subject;
                            } else {
                                rubberStampAnnotation.IconName = "";
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
                                    rubberStampAnnotation.State = this.getStateString(stampAnnotation.reviewHistory.at(parseInt(i.toString(), 10)).state);
                                    rubberStampAnnotation.StateModel = this.getStateModelString(stampAnnotation.reviewHistory.at(parseInt(i.toString(), 10)).stateModel);
                                }
                            }
                            if (rubberStampAnnotation.State == null || rubberStampAnnotation.StateModel == null) {
                                rubberStampAnnotation.State = "Unmarked";
                                rubberStampAnnotation.StateModel = "None";
                            }
                            rubberStampAnnotation.Comments = new Array<PopupAnnotationBase>();
                            for (let i: number = 0; i < stampAnnotation.comments.count; i++) {
                                const annot: PopupAnnotationBase = annotRenderer.loadPopupAnnotation(stampAnnotation.comments.at(i), height, width, pageRotation);
                                rubberStampAnnotation.Comments.push(annot);
                            }
                            if (annotation._dictionary.has('Name')) {
                                rubberStampAnnotation.Name = annotation._dictionary.get('Name');
                                if (annotation._dictionary.get('Name').name.includes("#23D") || annotation._dictionary.get('Name').name.includes("#D")) {
                                    rubberStampAnnotation.IsDynamic = true;
                                }
                                if (!isNullOrUndefined(rubberStampAnnotation.Subject) && !(this.IsStampExist(rubberStampAnnotation.Subject))) {
                                    rubberStampAnnotation.Subject = stampAnnotation.icon.toString();
                                }
                            }
                            if (isNullOrUndefined(dictionary)) {
                                let pdfReference: any = annotation._dictionary.get('AP');
                                if (!isNullOrUndefined(pdfReference) && !isNullOrUndefined(pdfReference.dictionary) && (pdfReference.dictionary.has('N')) ) {
                                    let ap_dictionary: any = pdfReference.dictionary;
                                    if (!isNullOrUndefined(ap_dictionary)) {
                                        this.findStampImage(annotation);
                                    }
                                }
                            }
                            else if (dictionary.has('N')) {
                                this.findStampImage(annotation)
                            }
                            rubberStampAnnotation.IsMaskedImage = this.isMaskedImage;
                            rubberStampAnnotation.Apperarance = this.htmldata;
                            if (stampAnnotation._dictionary.has('CustomData')) {
                                let customData: string = stampAnnotation._dictionary.get('CustomData');
                                if (!(!isNullOrUndefined(customData) && customData.trim())) {
                                    let ExistingCustomData = dictionary.get('CustomData');
                                    if (ExistingCustomData) {
                                        rubberStampAnnotation.CustomData = ExistingCustomData;
                                    }
                                }
                            }
                            this.rubberStampAnnotationList.push(rubberStampAnnotation);
                            this.annotationOrder.push(rubberStampAnnotation);
                        }
                    
                    }
                    if (annotation instanceof PdfPopupAnnotation) {

                        if (!annotation._dictionary.has("IRT")) {
                            let stickyNote: PopupAnnotationBase = annotRenderer.loadPopupAnnotation(annotation as PdfPopupAnnotation, height, width, pageRotation);
                            this.stickyAnnotationList[this.stickyAnnotationList.length] = stickyNote;
                            this.annotationOrder[this.annotationOrder.length] = stickyNote;
                            const name: string = stickyNote.AnnotName;
                            if (isNullOrUndefined(name) || name === '') {
                                stickyNote.AnnotName = this.setAnnotationName(pageNumber);
                            }
                        }
                    }
                    if (annotation instanceof PdfFreeTextAnnotation) {
                        let freeTextAnnot: PdfFreeTextAnnotation = annotation as PdfFreeTextAnnotation;
                        let isFreeTextAnnotation: boolean = this.isFreeTextAnnotationType(freeTextAnnot);
                        if (isFreeTextAnnotation) {
                            let isShapeLabelAnnot: boolean = textLabelCollection.some((s: string) => s === freeTextAnnot.name);
                            let freeText: FreeTextAnnotationBase = annotRenderer.loadFreeTextAnnotation(freeTextAnnot, height, width, pageRotation, loadedPage);
                            if (!isShapeLabelAnnot) {
                                this.freeTextAnnotationList[this.freeTextAnnotationList.length] = freeText;
                                this.annotationOrder[this.annotationOrder.length] = freeText;
                            }
                        }
                        else {
                            let freeText: SignatureAnnotationBase = annotRenderer.loadSignatureText(freeTextAnnot, pageNumber, height, width, pageRotation);
                            if (!freeTextAnnot._dictionary.has('T')) {
                                this.signatureAnnotationList[this.signatureAnnotationList.length] = freeText;
                                this.annotationOrder[this.annotationOrder.length] = freeText;
                            }
                        }
                    }
                    if (annotation instanceof PdfInkAnnotation) {
                        let inkAnnotation = annotation as PdfInkAnnotation;
                        let signatureData: SignatureAnnotationBase = annotRenderer.loadSignature(inkAnnotation, height, width, pageRotation, pageNumber, loadedPage);
                        let inkSignatureData: InkSignatureAnnotation = annotRenderer.loadInkAnnotation(inkAnnotation, height, width, pageRotation, pageNumber, loadedPage);
                        if (!inkAnnotation._dictionary.has("T")) {
                            this.signatureAnnotationList.push(signatureData);
                            this.annotationOrder.push(signatureData);
                        }
                        else if (inkAnnotation._dictionary.has("NM")) {
                            this.signatureInkAnnotationList.push(inkSignatureData);
                            this.annotationOrder.push(inkSignatureData);
                        }
                        else if (inkAnnotation._dictionary.has("T")) {
                            if (inkAnnotation._dictionary.has("annotationSignature")) {
                                let canAdd: boolean = true;
                                canAdd = inkAnnotation.getValues("annotationSignature").length > 0 ? false : true;
                                if (canAdd) {
                                    this.signatureAnnotationList.push(signatureData);
                                    this.annotationOrder.push(signatureData);
                                }
                            }
                        }
                        if (!inkAnnotation._dictionary.has('NM') && !inkAnnotation._dictionary.has("annotationSignature")) {
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

    /**
     * @private
     * @param annotation 
     */
    public findStampImage(annotation: PdfAnnotation) {
        let stream: any = annotation._dictionary.get("AP").get("N");
        if (!isNullOrUndefined(stream)) {
            let appearance: _PdfBaseStream = stream as _PdfBaseStream;
            let data: string = _bytesToString(appearance.getBytes());
            let content: number[] = _stringToBytes(data, true) as number[];
            let parser: _ContentParser = new _ContentParser(content);
            let result: _PdfRecord[] = parser._readContent();
            this.stampAnnoattionRender(result, stream)

        }
    }
    
    private stampAnnoattionRender(recordCollection: _PdfRecord[], dictionary: any) {
        if (!isNullOrUndefined(recordCollection)) {
            for (let i = 0; i < recordCollection.length; i++) {
                let element: string[] = recordCollection[i]._operands;
                switch (recordCollection[i]._operator) {
                    case "q": {
                        let Json = { restorecanvas: false };
                        this.htmldata.push(Json);
                        break;
                    }
                    case "Q": {
                        let Json = { restorecanvas: true };
                        this.htmldata.push(Json);
                        break;
                    }
                    case "Tr": {
                        this.renderingMode = parseInt(element[0]);
                        break;
                    }
                    case "TJ":
                    case "Tj": {
                        this.textString = recordCollection[i]._operands[0];
                        let Json = { type: "string", text: this.textString, currentFontname: this.currentFont, baseFontName: this.baseFont, fontSize: this.fontSize };
                        this.htmldata.push(Json);
                        break;
                    }
                    case "'": {
                        this.textString = recordCollection[i]._operands[0];
                        let Json = { type: "string", text: this.textString, currentFontname: this.currentFont, baseFontName: this.baseFont, fontSize: this.fontSize };
                        this.htmldata.push(Json);
                        break;
                    }
                    case "Tf": {
                        let j: number = 0;
                        for (j = 0; j < element.length; j++) {
                            if (element[j].includes("/")) {
                                this.currentFont = element[j].replace("/", "");
                                break;
                            }
                        }
                        this.fontSize = parseInt(element[j + 1]);
                        if (dictionary.dictionary.has("Resources")) {
                            let stdic: any = dictionary.dictionary.get("Resources");
                            if (!isNullOrUndefined(stdic)) {
                                let fontObject: any = stdic.get("Font");
                                if (!isNullOrUndefined(fontObject) && recordCollection[i]._operator == "Tf") {
                                    let name: string = element[0].replace("/", "");
                                    let refernceholder: any = fontObject.get(name);
                                    if (!isNullOrUndefined(refernceholder) && !isNullOrUndefined(refernceholder.dictionary)) {
                                        let sub: any = refernceholder.dictionary;
                                        this.baseFont = sub.get("BaseFont");
                                    }

                                }

                            }
                        }
                        break
                    }
                    case "Do": {
                        if (dictionary.dictionary.has("Resources")) {
                            let stdic: any = dictionary.dictionary.get("Resources");
                            if (!isNullOrUndefined(stdic)) {
                                let xObject: any = stdic.get("XObject");
                                if (!isNullOrUndefined(xObject) && recordCollection[i]._operator == "Do") {
                                    let name: string = element[0].replace("/", "");
                                    if (xObject.has(name)) {
                                        let refernceholder: _PdfBaseStream = xObject.get(name);
                                        if (!isNullOrUndefined(refernceholder) && !isNullOrUndefined(refernceholder.dictionary)) {
                                            let sub: any = refernceholder;
                                            if (sub.dictionary.get("Subtype").name == "Image") {
                                                let imageStucture: ImageStructureBase = new ImageStructureBase(sub, sub.dictionary);
                                                if (!isNullOrUndefined(imageStucture)) {
                                                    let imageStream: Uint8Array = imageStucture.getImageStream();
                                                    const imageString = 'data:image/png;base64,' + _encode(imageStream);
                                                    let Json = { imagedata: imageString };
                                                    this.htmldata.push(Json);
                                                    this.Imagedata = imageString;
                                                }
                                            }
                                            else if (sub.dictionary.get("Subtype").name === "Form") {
                                                let appearance: _PdfBaseStream = sub as _PdfBaseStream;
                                                let data: string = _bytesToString(appearance.getBytes());
                                                let content: number[] = _stringToBytes(data, true) as number[];
                                                let parser: _ContentParser = new _ContentParser(content);
                                                let result: _PdfRecord[] = parser._readContent();
                                                this.stampAnnoattionRender(result, sub)
                                            }
                                            this.IsMaskedImage = false;
                                            if (sub.dictionary.get("SMask")) {
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

    private getBounds(bounds: any, pageWidth: number, pageHeight: number, pageRotation: number): Rect {
        let bound: Rect;
        if (pageRotation === 0) {
            // eslint-disable-next-line max-len
            bound = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        else if (pageRotation === 1) {
            // eslint-disable-next-line max-len
            bound = new Rect(this.convertPixelToPoint(pageWidth - this.convertPointToPixel(bounds.y)) - this.convertPointToPixel(bounds.height), bounds.x, bounds.height, bounds.width);
        }
        else if (pageRotation === 2) {
            // eslint-disable-next-line max-len
            bound = new Rect(this.convertPixelToPoint(pageWidth - this.convertPointToPixel(bounds.x)) - this.convertPointToPixel(bounds.width), this.convertPixelToPoint(pageHeight - this.convertPointToPixel(bounds.y)) - this.convertPointToPixel(bounds.height), this.convertPointToPixel(bounds.width), bounds.height);
        }
        else if (pageRotation === 3) {
            // eslint-disable-next-line max-len
            bound = new Rect(bounds.y, this.convertPixelToPoint(pageHeight - this.convertPointToPixel(bounds.x)) - this.convertPointToPixel(bounds.width), bounds.height, bounds.width);
        }
        return bound;
    }

    private getRubberStampBounds(innerTemplateBounds: any, bounds: any, pageHeight: number, pageWidth: number, pageRotation: number): Rect {
        let bound: Rect = new Rect();

        let centerPointX = 0;
        let centerPointY = 0;

        if (pageRotation === 0) {
            centerPointX = bounds.x + (bounds.width / 2);
            centerPointY = bounds.y + (bounds.height / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY - (innerTemplateBounds.height / 2), innerTemplateBounds.width, innerTemplateBounds.height);
        } else if (pageRotation === 1) {
            const boundsX = this.convertPixelToPoint(pageWidth - this.convertPointToPixel(bounds.Y) - this.convertPointToPixel(bounds.height));
            const boundsY = bounds.X;
            centerPointX = boundsX + (bounds.height / 2);
            centerPointY = boundsY + (bounds.width / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY - (innerTemplateBounds.height / 2), innerTemplateBounds.width, innerTemplateBounds.height);
        } else if (pageRotation === 2) {
            const boundsX = this.convertPixelToPoint(pageWidth - this.convertPointToPixel(bounds.X) - this.convertPointToPixel(bounds.width));
            const boundsY = this.convertPixelToPoint(pageHeight - this.convertPointToPixel(bounds.Y) - this.convertPointToPixel(bounds.height));
            centerPointX = boundsX + (bounds.width / 2);
            centerPointY = boundsY + (bounds.height / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY - (innerTemplateBounds.height / 2), innerTemplateBounds.width, innerTemplateBounds.height)
        } else if (pageRotation === 3) {
            const boundsX = bounds.Y;
            const boundsY = this.convertPixelToPoint(pageHeight - this.convertPointToPixel(bounds.X) - this.convertPointToPixel(bounds.width));
            centerPointX = boundsX + (bounds.height / 2);
            centerPointY = boundsY + (bounds.width / 2);
            bound = new Rect(centerPointX - (innerTemplateBounds.width / 2), centerPointY - (innerTemplateBounds.height / 2), innerTemplateBounds.width, innerTemplateBounds.height);
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

    private checkName(stampAnnotation: PdfRubberStampAnnotation) {
        // Check if the stamp annotation has a "Name" key in its dictionary.
        if ("Name" in stampAnnotation._dictionary) {
            // Get the custom data for the "Name" key.
            const customData = stampAnnotation.getValues("Name");

            // Check if the custom data is not null and contains a '#' character.
            if (!(isNullOrUndefined(customData)) && customData.indexOf("#") > -1) {
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
            return loadedFreetextAnnotations.find((annot: PdfFreeTextAnnotation) => annot.name.includes(shapeName));
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
        if(freeTextAnnot._dictionary.has('AnnotationType')){
            let annotType: string[] = freeTextAnnot.getValues('AnnotationType');
            if(!isNullOrUndefined(annotType) && annotType[0] === 'Signature'){
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
