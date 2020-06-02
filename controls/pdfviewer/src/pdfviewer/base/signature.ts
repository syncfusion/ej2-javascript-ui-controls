import { PdfViewer } from '../index';
import { PdfViewerBase, IPageAnnotations } from '../index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { PdfAnnotationBase } from '../../diagram/pdf-annotation';
import { splitArrayCollection, processPathData, getPathString } from '@syncfusion/ej2-drawings';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { cloneObject } from '../../diagram/drawing-util';

/**
 * @hidden
 */
export interface ISignAnnotation {
    strokeColor: string;
    opacity: number;
    bounds: IRectCollection;
    pageIndex: number;
    shapeAnnotationType: string;
    thickness: number;
    id: string;
    data: string;
    signatureName: string;
}
/**
 * @hidden
 */
interface IRectCollection {
    left: number;
    top: number;
    width: number;
    height: number;
}

/**
 * @hidden
 */
export class Signature {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private mouseDetection: boolean;
    private oldX: number;
    private mouseX: number;
    private oldY: number;
    private mouseY: number;
    // tslint:disable-next-line
    private newObject: any = [];
    /**
     * @private
     */
    public outputString: string = '';
    /**
     * @private
     */
    public signatureDialog: Dialog;

    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    public createSignaturePanel(): void {
        let elementID: string = this.pdfViewer.element.id;
        let dialogDiv: HTMLElement = createElement('div', { id: elementID + '_signature_window', className: 'e-pv-signature-window' });
        dialogDiv.style.display = 'block';
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        let appearanceTab: HTMLElement = this.createSignatureCanvas();
        if (this.signatureDialog) {
            this.signatureDialog.content = appearanceTab;
        } else {
            this.signatureDialog = new Dialog({
                showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Draw Signature'),
                target: this.pdfViewer.element, content: appearanceTab, width: '750px', visible: true,
                beforeClose: (): void => {
                    this.clearSignatureCanvas();
                    this.signatureDialog.destroy();
                    this.signatureDialog = null;
                    // tslint:disable-next-line
                    let signatureWindow: any = document.getElementById(this.pdfViewer.element.id + '_signature_window');
                    if (signatureWindow) {
                        signatureWindow.remove();
                    }
                }
            });
            this.signatureDialog.buttons = [
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Clear'), disabled: true, cssClass: 'e-pv-clearbtn' }, click: this.clearSignatureCanvas.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.closeSignaturePanel.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Create'), isPrimary: true, disabled: true, cssClass: 'e-pv-createbtn' }, click: this.addSignature.bind(this) },

            ];
            this.signatureDialog.appendTo(dialogDiv);
        }
    }
    private addSignature(): void {
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        let annot: PdfAnnotationBaseModel;
        if (this.pdfViewerBase.isToolbarSignClicked) {
            let annotationName: string = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            let currentLeft: number = 0;
            let currentTop: number = 0;
            // tslint:disable-next-line:max-line-length
            let currentWidth: number = this.pdfViewer.handWrittenSignatureSettings.width ? this.pdfViewer.handWrittenSignatureSettings.width : 100;
            // tslint:disable-next-line:max-line-length
            let currentHeight: number = this.pdfViewer.handWrittenSignatureSettings.height ? this.pdfViewer.handWrittenSignatureSettings.height : 100;
            // tslint:disable-next-line:max-line-length
            let thickness: number = this.pdfViewer.handWrittenSignatureSettings.thickness ? this.pdfViewer.handWrittenSignatureSettings.thickness : 1;
            // tslint:disable-next-line:max-line-length
            let opacity: number = this.pdfViewer.handWrittenSignatureSettings.opacity ? this.pdfViewer.handWrittenSignatureSettings.opacity : 1;
            // tslint:disable-next-line:max-line-length
            let strokeColor: string = this.pdfViewer.handWrittenSignatureSettings.strokeColor ? this.pdfViewer.handWrittenSignatureSettings.strokeColor : '#000000';
            currentLeft = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            // tslint:disable-next-line:max-line-length
            currentTop = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: this.outputString,
                shapeAnnotationType: 'HandWrittenSignature', opacity: opacity, strokeColor: strokeColor, thickness: thickness, signatureName: annotationName,
            };
            this.hideSignaturePanel();
            this.pdfViewerBase.currentSignatureAnnot = annot;
            this.pdfViewerBase.isToolbarSignClicked = false;
        } else {
            this.pdfViewer.formFieldsModule.drawSignature();
            this.hideSignaturePanel();
        }
    }

    private hideSignaturePanel(): void {
        if (this.signatureDialog) {
            this.signatureDialog.hide();
        }
    }
    // tslint:disable-next-line
    private createSignatureCanvas(): any {
        // tslint:disable-next-line
        let previousField: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // tslint:disable-next-line
        let field: any = document.getElementById(this.pdfViewer.element.id + 'Signature_appearance');
        if (previousField) {
            previousField.remove();
        }
        if (field) {
            field.remove();
        }
        // tslint:disable-next-line:max-line-length
        let appearanceDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'Signature_appearance', className: 'e-pv-signature-apperance' });
        // tslint:disable-next-line:max-line-length
        let canvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_signatureCanvas_', className: 'e-pv-signature-canvas' }) as HTMLCanvasElement;
        if (this.pdfViewer.element.offsetWidth > 750) {
            canvas.width = 715;
            canvas.style.width = '715px';
        } else {
            canvas.width = this.pdfViewer.element.offsetWidth - 35;
            canvas.style.width = canvas.width + 'px';
        }
        canvas.height = 335;
        canvas.style.height = '335px';
        canvas.style.border = '1px dotted #bdbdbd';
        canvas.style.backgroundColor = 'white';
        canvas.addEventListener('mousedown', this.signaturePanelMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.signaturePanelMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.signaturePanelMouseUp.bind(this));
        canvas.addEventListener('mouseleave', this.signaturePanelMouseUp.bind(this));
        canvas.addEventListener('touchstart', this.signaturePanelMouseDown.bind(this));
        canvas.addEventListener('touchmove', this.signaturePanelMouseMove.bind(this));
        canvas.addEventListener('touchend', this.signaturePanelMouseUp.bind(this));
        appearanceDiv.appendChild(canvas);
        // // tslint:disable-next-line
        // let input: any = document.createElement('input');
        // input.type = 'checkbox';
        // appearanceDiv.appendChild(input);
        // // tslint:disable-next-line
        // let checkBoxObj: any = new CheckBox({ label: 'Save signature', disabled: true, checked: false });
        // checkBoxObj.appendTo(input);
        return appearanceDiv;
    }
    /**
     * @private
     */
    public updateCanvasSize(): void {
        // tslint:disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        if (canvas && this.signatureDialog && this.signatureDialog.visible) {
            if (this.pdfViewer.element.offsetWidth > 750) {
                canvas.width = 715;
                canvas.style.width = '715px';
            } else {
                canvas.width = this.pdfViewer.element.offsetWidth - 35;
                canvas.style.width = canvas.width + 'px';
            }
        }
    }
    private signaturePanelMouseDown(e: MouseEvent | TouchEvent): void {
        if (e.type !== 'contextmenu') {
            e.preventDefault();
            this.findMousePosition(e);
            this.mouseDetection = true;
            this.oldX = this.mouseX;
            this.oldY = this.mouseY;
            this.newObject = [];
            this.enableCreateButton(false);
            this.drawMousePosition(e);
        }
    }
    private enableCreateButton(isEnable: boolean): void {
        // tslint:disable-next-line
        let createbtn: any = document.getElementsByClassName('e-pv-createbtn')[0];
        if (createbtn) {
            createbtn.disabled = isEnable;
        }
        // tslint:disable-next-line
        let clearbtn: any = document.getElementsByClassName('e-pv-clearbtn')[0];
        if (clearbtn) {
            clearbtn.disabled = isEnable;
        }
    }
    private signaturePanelMouseMove(e: MouseEvent | TouchEvent): void {
        if (this.mouseDetection) {
            this.findMousePosition(e);
            this.drawMousePosition(e);
        }
    }
    private findMousePosition(event: MouseEvent | TouchEvent): void {
        let offsetX: number;
        let offsetY: number;
        if (event.type.indexOf('touch') !== -1) {
            event = event as TouchEvent;
            let element: HTMLElement = event.target as HTMLElement;
            // tslint:disable-next-line
            let currentRect: any = element.getBoundingClientRect();
            this.mouseX = event.touches[0].pageX - currentRect.left;
            this.mouseY = event.touches[0].pageY - currentRect.top;
        } else {
            event = event as MouseEvent;
            this.mouseX = event.offsetX;
            this.mouseY = event.offsetY;
        }
    }
    private drawMousePosition(event: MouseEvent | TouchEvent): void {
        if (this.mouseDetection) {
            this.drawSignatureInCanvas();
            this.oldX = this.mouseX;
            this.oldY = this.mouseY;
        }
    }
    private drawSignatureInCanvas(): void {
        // tslint:disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // tslint:disable-next-line
        let context: any = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(this.oldX, this.oldY);
        context.lineTo(this.mouseX, this.mouseY);
        context.stroke();
        context.lineWidth = 2;
        context.arc(this.oldX, this.oldY, 2 / 2, 0, Math.PI * 2, true);
        context.closePath();
        this.newObject.push(this.mouseX, this.mouseY);
    }
    private signaturePanelMouseUp(): void {
        if (this.mouseDetection) {
            this.convertToPath(this.newObject);
        }
        this.mouseDetection = false;
    }
    // tslint:disable-next-line
    private convertToPath(newObject: any): void {
        this.movePath(newObject[0], newObject[1]);
        this.linePath(newObject[0], newObject[1]);
        for (let n: number = 2; n < newObject.length; n = n + 2) {
            this.linePath(newObject[n], newObject[n + 1]);
        }
    }
    private linePath(x: number, y: number): void {
        this.outputString += 'L' + x + ',' + y + ' ';
    }
    private movePath(x: number, y: number): void {
        this.outputString += 'M' + x + ',' + y + ' ';
    }
    private clearSignatureCanvas(): void {
        this.outputString = '';
        this.newObject = [];
        // tslint:disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // tslint:disable-next-line
        let context: any = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.enableCreateButton(true);
    }
    private closeSignaturePanel(): void {
        this.clearSignatureCanvas();
        this.signatureDialog.hide();
    }
    /**
     * @private
     */
    public saveSignature(): string {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        // tslint:disable-next-line
        let annotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: ISignAnnotation[] = [];
                let pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        let strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        // tslint:disable-next-line
                        let collectionData: any = processPathData(pageAnnotationObject.annotations[z].data);
                        // tslint:disable-next-line
                        let csData: any = splitArrayCollection(collectionData);
                        pageAnnotationObject.annotations[z].data = JSON.stringify(csData);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }
    // tslint:disable-next-line
    public getRgbCode(colorString: string): any {
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            let colorpick: ColorPicker = new ColorPicker();
            colorString = colorpick.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        // tslint:disable-next-line:radix
        let r: number = parseInt(stringArray[0].split('(')[1]);
        // tslint:disable-next-line:radix
        let g: number = parseInt(stringArray[1]);
        // tslint:disable-next-line:radix
        let b: number = parseInt(stringArray[2]);
        // tslint:disable-next-line:radix
        let a: number = parseInt(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * @private
     */
    public renderSignature(left: number, top: number): void {
        let annot: PdfAnnotationBaseModel;
        // tslint:disable-next-line
        let currentAnnotation: any = this.pdfViewerBase.currentSignatureAnnot;
        let annotationName: string = this.pdfViewer.annotation.createGUID();
        if (currentAnnotation) {
            annot = {
                // tslint:disable-next-line:max-line-length
                id: currentAnnotation.id, bounds: { x: left, y: top, width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height }, pageIndex: currentAnnotation.pageIndex, data: currentAnnotation.data,
                shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.opacity, strokeColor: currentAnnotation.strokeColor, thickness: currentAnnotation.thickness, signatureName: annotationName,
            };
            this.pdfViewer.add(annot as PdfAnnotationBase);
            // tslint:disable-next-line
            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, currentAnnotation.pageIndex);
            this.pdfViewerBase.signatureAdded = true;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireSignatureAdd(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType, currentAnnotation.bounds, currentAnnotation.opacity, currentAnnotation.strokeColor, currentAnnotation.thickness);
            this.storeSignatureData(currentAnnotation.pageIndex, annot);
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.signatureCount++;
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderExistingSignature(annotationCollection: any, pageIndex: number, isImport: boolean): void {
        let annot: PdfAnnotationBaseModel;
        for (let n: number = 0; n < annotationCollection.length; n++) {
            // tslint:disable-next-line
            let currentAnnotation: any = annotationCollection[n];
            //tslint:disable-next-line
            if (currentAnnotation) {
                // tslint:disable-next-line
                let bounds: any = currentAnnotation.Bounds;
                let currentLeft: number = bounds.X;
                let currentTop: number = bounds.Y;
                let currentWidth: number = bounds.Width;
                let currentHeight: number = bounds.Height;
                // tslint:disable-next-line
                let data: any = currentAnnotation.PathData;
                if (isImport) {
                    data = getPathString(JSON.parse(currentAnnotation.PathData));
                }
                annot = {
                    // tslint:disable-next-line:max-line-length
                    id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                    shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, signatureName: currentAnnotation.SignatureName,
                };
                this.pdfViewer.add(annot as PdfAnnotationBase);
                // tslint:disable-next-line
                let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
                // tslint:disable-next-line
                this.pdfViewer.renderDrawing(canvass as any, annot.pageIndex);
                this.storeSignatureData(annot.pageIndex, annot);
                this.pdfViewerBase.currentSignatureAnnot = null;
                this.pdfViewerBase.signatureCount++;
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public storeSignatureData(pageNumber: number, annotations: any): void {
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(annotations.pageIndex, null, annotations as PdfAnnotationBase, 'Addition', '', annotations as PdfAnnotationBase, annotations);
        let annotation: ISignAnnotation = null;
        let left: number = annotations.bounds.left ? annotations.bounds.left : annotations.bounds.x;
        let top: number = annotations.bounds.top ? annotations.bounds.top : annotations.bounds.y;
        if (annotations.wrapper && annotations.wrapper.bounds) {
            left = annotations.wrapper.bounds.left;
            top = annotations.wrapper.bounds.top;
        }
        annotation = {
            // tslint:disable-next-line:max-line-length
            id: annotations.id, bounds: { left: left, top: top, width: annotations.bounds.width, height: annotations.bounds.height }, shapeAnnotationType: 'Signature', opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data, signatureName: annotations.signatureName,
        };
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        let index: number = 0;
        if (!storeObject) {
            this.storeSignatureCollections(annotation, pageNumber);
            let shapeAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            let annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(shapeAnnotation);
            let annotationStringified: string = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        } else {
            this.storeSignatureCollections(annotation, pageNumber);
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sign');
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
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public modifySignatureCollection(property: string, pageNumber: number, annotationBase: any, isSignatureEdited?: boolean): ISignAnnotation {
        this.pdfViewerBase.isDocumentEdited = true;
        let currentAnnotObject: ISignAnnotation = null;
        let pageAnnotations: ISignAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].bounds = { left: annotationBase.wrapper.bounds.left, top: annotationBase.wrapper.bounds.top, width: annotationBase.bounds.width, height: annotationBase.bounds.height };
                    } else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    } else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                    } else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    } else if (property === 'delete') {
                        this.updateSignatureCollection(pageAnnotations[i]);
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    if (property && property !== 'delete') {
                        this.storeSignatureCollections(pageAnnotations[i], pageNumber);
                    }
                    if (isSignatureEdited) {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                        this.storeSignatureCollections(pageAnnotations[i], pageNumber);
                        break;
                    }
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public storeSignatureCollections(annotation: any, pageNumber: number): void {
        // tslint:disable-next-line
        let collectionDetails: any = this.checkSignatureCollection(annotation);
        // tslint:disable-next-line
        let selectAnnotation: any = cloneObject(annotation);
        selectAnnotation.annotationId = annotation.signatureName;
        selectAnnotation.pageNumber = pageNumber;
        delete selectAnnotation.annotName;
        if (annotation.id) {
            selectAnnotation.uniqueKey = annotation.id;
            delete selectAnnotation.id;
        }
        if (collectionDetails.isExisting) {
            this.pdfViewer.signatureCollection.splice(collectionDetails.position, 0, selectAnnotation);
        } else {
            this.pdfViewer.signatureCollection.push(selectAnnotation);
        }
    }

    // tslint:disable-next-line
    private checkSignatureCollection(signature: any): any {
        // tslint:disable-next-line
        let collections: any = this.pdfViewer.signatureCollection;
        if (collections && signature) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].annotationId === signature.signatureName) {
                    this.pdfViewer.signatureCollection.splice(i, 1);
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
    public updateSignatureCollection(signature: any): void {
        // tslint:disable-next-line
        let collections: any = this.pdfViewer.signatureCollection;
        if (collections && signature) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].annotationId === signature.signatureName) {
                    this.pdfViewer.signatureCollection.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public addInCollection(pageNumber: number, signature: any): void {
        if (signature) {
            this.storeSignatureCollections(signature, pageNumber);
            // tslint:disable-next-line
            let pageSignatures: any[] = this.getAnnotations(pageNumber, null);
            if (pageSignatures) {
                pageSignatures.push(signature);
            }
            this.manageAnnotations(pageSignatures, pageNumber);
        }
    }

    // tslint:disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
            } else {
                annotationCollection = shapeAnnotations;
            }
        } else {
            annotationCollection = shapeAnnotations;
        }
        return annotationCollection;
    }
    private manageAnnotations(pageAnnotations: ISignAnnotation[], pageNumber: number): void {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sign');
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        }
    }
    /**
     * @private
     */
    public showSignatureDialog(isShow: boolean): void {
        if (isShow) {
            this.createSignaturePanel();
        }
    }

    /**
     * @private
     */
    public setAnnotationMode(): void {
        this.pdfViewerBase.isToolbarSignClicked = true;
        this.showSignatureDialog(true);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public ConvertPointToPixel(number: any): any {
        return (number * (96 / 72));
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public updateSignatureCollections(signature: any, pageIndex: number, isImport?: boolean): any {
        let annot: PdfAnnotationBaseModel;
        //tslint:disable-next-line
        if (signature) {
            // tslint:disable-next-line
            let bounds: any = signature.Bounds;
            let currentLeft: number = bounds.X;
            let currentTop: number = bounds.Y;
            let currentWidth: number = bounds.Width;
            let currentHeight: number = bounds.Height;
            // tslint:disable-next-line
            let data: any = signature.PathData;
            if (isImport) {
                data = getPathString(JSON.parse(signature.PathData));
            }
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'sign' + signature.SignatureName, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                shapeAnnotationType: 'HandWrittenSignature', opacity: signature.Opacity, strokeColor: signature.StrokeColor, thickness: signature.Thickness, signatureName: signature.SignatureName,
            };
            return annot;
        }
    }

    /**
     * @private
     */
    public destroy(): void {
        window.sessionStorage.removeItem('_annotations_sign');
    }
}