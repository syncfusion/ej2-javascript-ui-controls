import { PdfViewer } from '../index';
import { PdfViewerBase, IPageAnnotations } from '../index';
import { createElement, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { splitArrayCollection, processPathData, getPathString } from '@syncfusion/ej2-drawings';
import { TextBox } from '@syncfusion/ej2-inputs';
import { cloneObject } from '../drawing/drawing-util';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { Tab, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { PdfAnnotationType } from '../drawing';
import { DisplayMode } from './types';

/**
 * @hidden
 */
export interface ISignAnnotation {
    strokeColor: string
    opacity: number
    bounds: IRectCollection
    pageIndex: number
    shapeAnnotationType: string
    thickness: number
    id: string
    data: string
    signatureName: string
    fontFamily?: string
    fontSize?: string
}
/**
 * @hidden
 */
interface IRectCollection {
    left: number
    top: number
    width: number
    height: number
}

/**
 * @hidden
 */
export class Signature {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private mouseDetection: boolean;
    private mouseMoving: boolean = true;
    private canvasTouched: boolean = false;
    private signatureImageWidth : number;
    private signatureImageHeight: number;
    private oldX: number;
    private mouseX: number;
    private oldY: number;
    private mouseY: number;
    // eslint-disable-next-line
    private newObject: any = [];
    /**
     * @private
     */
    public outputString: string = '';
    /**
     * @private
     */
     public drawOutputString: string = '';
     /**
     * @private
     */
    public imageOutputString: string = '';
    /**
     * @private
     */
    public signatureDialog: Dialog;
    /**
     * @private
     */
    // eslint-disable-next-line
    public signaturecollection: any = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public outputcollection: any = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public signAnnotationIndex: any = [];
    /**
     * @private
    */
    public fontName: string;
    // eslint-disable-next-line
    private fontsign: any = [];
    // eslint-disable-next-line
    private signfontStyle: any = [];
    private signtypevalue: string;
    private signfont: string;
    private signHeight: string;
    private signWidth: string;
    private signaturetype: string;
    private tabObj: Tab;
    private isSaveSignature: boolean = false;
    private isSaveInitial: boolean = false;
    private isInitialFiledSaveSignature: boolean = false;
    private isSignatureFieldsSaveSignature: boolean = false;
    // eslint-disable-next-line
    private saveSignatureString: string = '';
    // eslint-disable-next-line
    private saveInitialString : string = '';
    /**
     * @private
     */
    // eslint-disable-next-line
    public saveImageString: string = '';
    private signatureImageString: string = '';
    private initialImageString: string = '';
    /**
     * @private
     */
    // eslint-disable-next-line
    public maxSaveLimit: number = 5;


    /**
     * Initialize the constructor of blazorUIadapater.
     * @private
     * @param { PdfViewer } pdfViewer - Specified PdfViewer class.
     * @param { PdfViewerBase } pdfViewerBase - The pdfViewerBase.
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     * @returns {void}
     */
    public createSignaturePanel(): void {
        let maximumWidth: number = 750;
        if (!isBlazor()) {
            const elementID: string = this.pdfViewer.element.id;
            const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_signature_window', className: 'e-pv-signature-window' });
            dialogDiv.style.display = 'block';
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            const appearanceTab: HTMLElement = this.createSignatureCanvas();
            let signaturePanelHeader: string;
            if(!this.pdfViewerBase.isToolbarSignClicked) {
                if(this.pdfViewerBase.isInitialField) {
                    signaturePanelHeader = this.pdfViewer.localeObj.getConstant('HandwrittenInitialDialogHeaderText');
                } else {
                    signaturePanelHeader = this.pdfViewer.localeObj.getConstant('HandwrittenSignatureDialogHeaderText');
                }
            } else {
                if(this.pdfViewerBase.isInitialField) {
                    signaturePanelHeader = this.pdfViewer.localeObj.getConstant('InitialFieldDialogHeaderText');
                } else {
                    signaturePanelHeader = this.pdfViewer.localeObj.getConstant('SignatureFieldDialogHeaderText');
                }
            }
            if (this.signatureDialog) {
                this.signatureDialog.content = appearanceTab;
            } else {
                this.signatureDialog = new Dialog({
                    // eslint-disable-next-line max-len
                    showCloseIcon: true, closeOnEscape: false, isModal: true, header: signaturePanelHeader, cssClass: 'e-pv-signature-dialog-height',
                    target: this.pdfViewer.element, content: appearanceTab, width: '750px', visible: true, allowDragging: true,
                    beforeClose: (): void => {
                        this.clearSignatureCanvas();
                        this.signatureDialog.destroy();
                        this.signatureDialog = null;
                        if (this.tabObj) {
                            this.tabObj.destroy();
                        }
                        // eslint-disable-next-line
                        let signatureWindow: any = document.getElementById(this.pdfViewer.element.id + '_signature_window');
                        if (signatureWindow) {
                            // eslint-disable-next-line
                            signatureWindow.parentNode ? signatureWindow.parentNode.removeChild(signatureWindow) : signatureWindow.parentElement.removeChild(signatureWindow);
                        }
                        // eslint-disable-next-line max-len
                        if (!this.pdfViewerBase.isToolbarSignClicked && !this.pdfViewerBase.drawSignatureWithTool && !isNullOrUndefined(this.pdfViewer.formFieldsModule.currentTarget)) {
                            this.pdfViewer.fireFocusOutFormField(this.pdfViewer.formFieldsModule.currentTarget.name, '');
                        }
                        this.pdfViewerBase.isToolbarSignClicked = false;
                        this.pdfViewer.formFieldsModule.setFocus();
                    }
                });

                this.signatureDialog.buttons = [
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Clear'), disabled: true, cssClass: 'e-pv-clearbtn' }, click: this.clearSignatureCanvas.bind(this) },
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel'), cssClass: 'e-pv-cancelbtn' }, click: this.closeSignaturePanel.bind(this) },
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Create'), isPrimary: true, disabled: true, cssClass: 'e-pv-createbtn' }, click: this.addSignatureInPage.bind(this) }
                ];
                this.signatureDialog.appendTo(dialogDiv);
            }
            if (this.pdfViewer.element.offsetWidth < maximumWidth)
                this.updateCanvasSize();
            if(this.pdfViewer.enableRtl){
                this.signatureDialog.enableRtl = this.pdfViewer.enableRtl;
            }
            let checkboxItem: any = (this.signatureDialog.content as any).ej2_instances[0].items[0];
            if(checkboxItem.header.label === 'DRAW') {
                let drawCheckbox: HTMLElement = document.getElementById("checkbox");
                this.hideSignatureCheckbox(drawCheckbox);
            } else if(checkboxItem.header.label === 'TYPE') {
                let typeCheckbox: HTMLElement = document.getElementById("checkbox1");
                this.hideSignatureCheckbox(typeCheckbox);
            } else {
                let imageCheckbox: HTMLElement = document.getElementById("checkbox2");
                this.hideSignatureCheckbox(imageCheckbox);
            }
        } else {
            // eslint-disable-next-line
            let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
            if (canvas) {
                if (!this.pdfViewerBase.pageContainer.querySelector('.e-pv-signature-window')) {
                    const elementID: string = this.pdfViewer.element.id;
                    // eslint-disable-next-line max-len
                    const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_signature_window', className: 'e-pv-signature-window' });
                    dialogDiv.style.display = 'block';
                    this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
                }
                canvas.addEventListener('mousedown', this.signaturePanelMouseDown.bind(this));
                canvas.addEventListener('mousemove', this.signaturePanelMouseMove.bind(this));
                canvas.addEventListener('mouseup', this.signaturePanelMouseUp.bind(this));
                canvas.addEventListener('mouseleave', this.signaturePanelMouseUp.bind(this));
                canvas.addEventListener('touchstart', this.signaturePanelMouseDown.bind(this));
                canvas.addEventListener('touchmove', this.signaturePanelMouseMove.bind(this));
                canvas.addEventListener('touchend', this.signaturePanelMouseUp.bind(this));
                this.clearSignatureCanvas();
            }
            this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenSignaturePanel', this.pdfViewerBase.isToolbarSignClicked);
        }
        this.drawSavedSignature();
    }
    private drawSavedSignature(): void {
        if (!this.pdfViewerBase.isToolbarSignClicked && (this.isSaveSignature || this.isSaveInitial))  {
            if(!this.pdfViewerBase.isInitialField && this.isSaveSignature){
                this.outputString = this.saveSignatureString;
            }
            else if (this.pdfViewerBase.isInitialField && this.isSaveInitial){
                this.outputString = this.saveInitialString;
            }
            // eslint-disable-next-line
            let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
            // eslint-disable-next-line
            let context: any = canvas.getContext('2d');
            // eslint-disable-next-line
            let image: any = new Image();
            image.onload = (): void => {
                context.drawImage(image, 0, 0);
            };
            if(!this.pdfViewerBase.isInitialField && this.isSaveSignature){
                image.src = this.signatureImageString;
            }
            else if(this.pdfViewerBase.isInitialField && this.isSaveInitial){
                image.src = this.initialImageString;
            }
            // eslint-disable-next-line
            let checkbox: any = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
            if (checkbox) {
                checkbox.checked = true;
            }
            this.enableCreateButton(false);
            this.enableClearbutton(false);
        }
    }
    private hideSignatureCheckbox(checkbox: any): void {
        if(this.pdfViewerBase.isToolbarSignClicked) {
            if(this.pdfViewerBase.isInitialField) {
                if(this.pdfViewer.handWrittenSignatureSettings.initialDialogSettings.hideSaveSignature) {
                   this.hideCheckboxParent(checkbox);
                }
            } else if(this.pdfViewer.handWrittenSignatureSettings.signatureDialogSettings.hideSaveSignature) {
                this.hideCheckboxParent(checkbox);
            }
        } else {
            if(this.pdfViewerBase.isInitialField) {
                if (this.pdfViewer.initialFieldSettings.initialDialogSettings.hideSaveSignature) {
                    this.hideCheckboxParent(checkbox);
                }
            } else {
                if (this.pdfViewer.signatureFieldSettings.signatureDialogSettings.hideSaveSignature) {
                   this.hideCheckboxParent(checkbox);
                }
            }
        }
    }

    private saveSignatureCheckbox(): boolean {
        if (this.pdfViewerBase.isToolbarSignClicked) {
            return false;
        } else {
            if (this.pdfViewerBase.isInitialField) {
                if (this.pdfViewer.initialFieldSettings.initialDialogSettings.hideSaveSignature) {
                    return false;
                } else {
                    return this.isInitialFiledSaveSignature;
                }
            } else {
                if (this.pdfViewer.signatureFieldSettings.signatureDialogSettings.hideSaveSignature) {
                    return false;
                } else {
                    return this.isSignatureFieldsSaveSignature;
                }
            }
        }
    }

    private hideCheckboxParent(checkbox: any): void {
        if(checkbox) {
            checkbox.parentElement.style.display = 'none';
        }
    }

    private saveSignatureImage(): void {
        // eslint-disable-next-line
        let checkbox: any = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
        if (checkbox && checkbox.checked) {
            if (this.outputString !== '') {
                if(!this.pdfViewerBase.isInitialField){
                    this.isSaveSignature = true;
                    this.saveSignatureString = this.outputString;
                }
                else{
                    this.isSaveInitial = true;
                    this.saveInitialString = this.outputString;
                }
                // eslint-disable-next-line
                let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
                this.saveImageString = canvas.toDataURL();
                if(!this.pdfViewerBase.isInitialField){
                    this.signatureImageString = this.saveImageString;
                }
                else{
                    this.initialImageString = this.saveImageString;
                }
            }
        } else {
            if (this.isSaveSignature && !this.pdfViewerBase.isInitialField) {
                this.isSaveSignature = false;
                this.saveSignatureString = '';
                this.saveImageString = '';
                this.signatureImageString = '';
            }
            else if(this.isSaveInitial && this.pdfViewerBase.isInitialField){
                this.isSaveInitial = false;
                this.saveInitialString = '';
                this.saveImageString = '';
                this.initialImageString = '';
            }
            this.clearSignatureCanvas();
        }
    }
    /**
     * @param type
     * @private
     */
    // eslint-disable-next-line
    public addSignature(type?: any): void {
        let annot: PdfAnnotationBaseModel;
        if (this.pdfViewerBase.isToolbarSignClicked) {
            const annotationName: string = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            // eslint-disable-next-line max-len
            const thickness: number = this.pdfViewer.handWrittenSignatureSettings.thickness ? this.pdfViewer.handWrittenSignatureSettings.thickness : 1;
            // eslint-disable-next-line max-len
            const opacity: number = this.pdfViewer.handWrittenSignatureSettings.opacity ? this.pdfViewer.handWrittenSignatureSettings.opacity : 1;
            // eslint-disable-next-line max-len
            const strokeColor: string = this.pdfViewer.handWrittenSignatureSettings.strokeColor ? this.pdfViewer.handWrittenSignatureSettings.strokeColor : '#000000';
            const fontSize:  number =  16;
            const fontFamily: string = 'Helvetica';
            let signatureBounds: any = this.pdfViewer.formFieldsModule.updateSignatureAspectRatio(this.outputString, true);
            // eslint-disable-next-line
            let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
            this.saveImageString = canvas.toDataURL();
            if(!this.pdfViewerBase.isInitialField){
                this.signatureImageString = this.saveImageString;
            }
            else{
                this.initialImageString = this.saveImageString;
            }
            annot = {
                // eslint-disable-next-line max-len
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: signatureBounds, pageIndex: pageIndex, data: this.outputString,fontFamily: fontFamily, fontSize:fontSize,
                shapeAnnotationType: 'HandWrittenSignature', opacity: opacity, strokeColor: strokeColor, thickness: thickness, signatureName: annotationName
            };
            this.pdfViewerBase.currentSignatureAnnot = annot;
            // eslint-disable-next-line
            let checkbox: any;
            if (isBlazor()) {
                checkbox = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
            } else {
                checkbox = document.getElementById('checkbox');
            }
            if (checkbox && checkbox.checked) {
                this.addSignatureCollection();
            }
            this.hideSignaturePanel();

            this.pdfViewerBase.isToolbarSignClicked = false;
        } else {
            // eslint-disable-next-line
            let checkbox: any;
            if (isBlazor()) {
                checkbox = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
            } else {
                checkbox = document.getElementById('checkbox');
            }
            let isSignatureAdded: boolean = false;
            if (isBlazor() && type) {
                if (type[0] === 'Image') {
                    this.imageAddSignature();
                    isSignatureAdded = true;
                    this.outputString = '';
                } else if (type[0] === 'Type') {
                    this.typeAddSignature();
                    isSignatureAdded = true;
                    this.outputString = '';
                }
            }
            if (!isSignatureAdded) {
                // eslint-disable-next-line
                let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
                this.saveImageString = canvas.toDataURL();
                if (checkbox && checkbox.checked) {
                    if(!this.pdfViewerBase.isInitialField){
                        this.isSaveSignature = true;
                        this.signatureImageString = this.saveImageString;
                        this.saveSignatureString = this.outputString;
                    }
                    else{
                        this.isSaveInitial = true;
                        this.initialImageString = this.saveImageString;
                        this.saveInitialString = this.outputString;
                    }
                    this.checkSaveFiledSign(this.pdfViewerBase.isInitialField, true);
                } else {
                    if(!this.pdfViewerBase.isInitialField){
                        this.isSaveSignature = false;
                        this.saveSignatureString = '';
                    }
                    else{
                        this.isSaveInitial = false;
                        this.saveInitialString = '';
                    }
                    this.checkSaveFiledSign(this.pdfViewerBase.isInitialField, false);
                }
                if(!this.pdfViewerBase.isInitialField){
                    this.signatureImageString = this.saveImageString;
                }
                else{
                    this.initialImageString = this.saveImageString;
                }
                this.pdfViewer.formFieldsModule.drawSignature(null, null, this.pdfViewerBase.currentTarget, null);
                isSignatureAdded = true;
            }
        }
    }

    private checkSaveFiledSign(initialField: boolean, saveSign: boolean) {
        if (initialField) {
            this.isInitialFiledSaveSignature = saveSign;
        } else {
            this.isSignatureFieldsSaveSignature = saveSign;
        }
    }

    private addSignatureInPage(): void {
        if (this.signaturetype === 'Draw') {
            this.addSignature();
        } else if (this.signaturetype === 'Type') {
            this.typeAddSignature();
        } else {
            this.imageAddSignature();
        }
        this.drawOutputString = '';
        this.imageOutputString = '';
    }
    private typeAddSignature(): void {
        if (this.pdfViewerBase.isToolbarSignClicked) {
            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
            // eslint-disable-next-line
            let annot: any = null;
            const annotationName: string = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            const thickness: number = this.pdfViewer.handWrittenSignatureSettings.thickness ? this.pdfViewer.handWrittenSignatureSettings.thickness : 1;
            const opacity: number = this.pdfViewer.handWrittenSignatureSettings.opacity ? this.pdfViewer.handWrittenSignatureSettings.opacity : 1;
            const strokeColor: string = this.pdfViewer.handWrittenSignatureSettings.strokeColor ? this.pdfViewer.handWrittenSignatureSettings.strokeColor : '#000000';
            const fontSize:  number =  16;
            let currentLeft: number = 0;
            let currentTop: number = 0;
            const currentHeight: number = 65;
            const currentWidth: number = 200;
            currentLeft = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            currentTop = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
            if (!this.signtypevalue) {
                this.updateSignatureTypeValue(true);
            }
            const inputValue: string = this.signtypevalue;
            annot = {
                // eslint-disable-next-line max-len
                id: 'Typesign' + this.pdfViewerBase.signatureCount, bounds: {
                    left: currentLeft / zoomFactor, top: currentTop / zoomFactor, x: currentLeft / zoomFactor,
                    // eslint-disable-next-line max-len
                    y: currentTop / zoomFactor, width: currentWidth, height: currentHeight
                }, pageIndex: pageIndex, dynamicText: inputValue, data: this.pdfViewerBase.signatureModule.outputString, shapeAnnotationType: 'SignatureText',
                opacity: opacity, strokeColor: strokeColor, thickness: thickness, fontSize:fontSize,fontFamily: this.fontName, signatureName: annotationName
            };
            this.pdfViewerBase.currentSignatureAnnot = annot;
            // eslint-disable-next-line
            let checkbox: any;
            if (isBlazor()) {
                checkbox = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
            } else {
                checkbox = document.getElementById('checkbox1');
            }
            if (checkbox && checkbox.checked) {
                this.addSignatureCollection();
            }
            this.signtypevalue = '';
            this.hideSignaturePanel();
            this.pdfViewerBase.isToolbarSignClicked = false;
        } else {
            if (this.outputString === '') {
                this.updateSignatureTypeValue();
            }
            this.pdfViewer.formFieldsModule.drawSignature('Type', '', this.pdfViewerBase.currentTarget);
            this.hideSignaturePanel();
        }
    }
    private imageAddSignature(): void {
        if (this.pdfViewerBase.isToolbarSignClicked) {
            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
            // eslint-disable-next-line
            let annot: any = null;
            const annotationName: string = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            const thickness: number = this.pdfViewer.handWrittenSignatureSettings.thickness ? this.pdfViewer.handWrittenSignatureSettings.thickness : 1;
            const opacity: number = this.pdfViewer.handWrittenSignatureSettings.opacity ? this.pdfViewer.handWrittenSignatureSettings.opacity : 1;
            const strokeColor: string = this.pdfViewer.handWrittenSignatureSettings.strokeColor ? this.pdfViewer.handWrittenSignatureSettings.strokeColor : '#000000';
            const fontSize:  number =  16;
            let currentLeft: number = 0;
            let currentTop: number = 0;
            let standardImageRatio:number = 100;
            let currentHeight: number = 0; 
            let currentWidth: number = 0;
             // eslint-disable-next-line max-len
            if(this.signatureImageHeight >= this.signatureImageWidth)
            {
              currentHeight = ((this.signatureImageHeight/this.signatureImageHeight)*standardImageRatio);
              currentWidth = ((this.signatureImageWidth/this.signatureImageHeight)*standardImageRatio);
            }
            else 
            {
              currentHeight = ((this.signatureImageHeight/this.signatureImageWidth)*standardImageRatio);
              currentWidth = ((this.signatureImageWidth/this.signatureImageWidth)*standardImageRatio);
            }
            currentLeft = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            currentTop = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
            const inputValue: string = this.signtypevalue;
            annot = {
                // eslint-disable-next-line max-len
                id: 'Typesign' + this.pdfViewerBase.signatureCount, bounds: {
                    left: currentLeft / zoomFactor, top: currentTop / zoomFactor, x: currentLeft / zoomFactor,
                    // eslint-disable-next-line max-len
                    y: currentTop / zoomFactor, width: currentWidth, height: currentHeight
                }, pageIndex: pageIndex, dynamicText: inputValue, data: this.pdfViewerBase.signatureModule.outputString, shapeAnnotationType: 'SignatureImage',
                opacity: opacity, strokeColor: strokeColor, thickness: thickness, fontSize:fontSize, fontFamily: this.fontName, signatureName: annotationName
            };
            this.pdfViewerBase.currentSignatureAnnot = annot;
            // eslint-disable-next-line
            let checkbox: any;
            if (isBlazor()) {
                checkbox = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
            } else {
                checkbox = document.getElementById('checkbox2');
            }
            if (checkbox && checkbox.checked) {
                this.addSignatureCollection();
            }
            this.hideSignaturePanel();
            this.pdfViewerBase.isToolbarSignClicked = false;
        } else {
            this.pdfViewer.formFieldsModule.drawSignature('Image', '', this.pdfViewerBase.currentTarget);
            this.hideSignaturePanel();
        }
    }

    private updateSignatureTypeValue(isType?: boolean): void {
        // eslint-disable-next-line
        let fontElements: any = document.querySelectorAll('.e-pv-font-sign');
        if (fontElements) {
            for (let j: number = 0; j < fontElements.length; j++) {
                if (fontElements[j] && fontElements[j].style.borderColor === 'red') {
                    if (isType) {
                        this.signtypevalue = fontElements[j].textContent;
                        this.outputString = fontElements[j].textContent;
                    } else {
                        this.outputString = fontElements[j].textContent;
                    }
                    try {
                        this.fontName = JSON.parse(fontElements[j].style.fontFamily);
                    } catch (e) {
                        this.fontName = fontElements[j].style.fontFamily;
                    }
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public hideSignaturePanel(): void {
        if (this.signatureDialog) {
            this.signatureDialog.hide();
        }
    }

    private bindTypeSignatureClickEvent(): void {
        if (isBlazor()) {
            for (let i: number = 0; i < 4; i++) {
                // eslint-disable-next-line
                let fontElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_font_signature' + i);
                if (fontElement) {
                    fontElement.addEventListener('click', this.typeSignatureclicked.bind(this));
                }
            }
        }
    }

    private bindDrawSignatureClickEvent(): void {
        // eslint-disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        if (canvas) {
            canvas.addEventListener('mousedown', this.signaturePanelMouseDown.bind(this));
            canvas.addEventListener('mousemove', this.signaturePanelMouseMove.bind(this));
            canvas.addEventListener('mouseup', this.signaturePanelMouseUp.bind(this));
            canvas.addEventListener('mouseleave', this.signaturePanelMouseUp.bind(this));
            canvas.addEventListener('touchstart', this.signaturePanelMouseDown.bind(this));
            canvas.addEventListener('touchmove', this.signaturePanelMouseMove.bind(this));
            canvas.addEventListener('touchend', this.signaturePanelMouseUp.bind(this));
        }
    }

    // eslint-disable-next-line
    private typeSignatureclicked(event: any): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget) {
            for (let i: number = 0; i < 4; i++) {
                // eslint-disable-next-line
                let fontElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_font_signature' + i);
                if (fontElement) {
                    fontElement.style.borderColor = '';
                }
            }
            eventTarget.style.borderColor = 'red';
            this.outputString = eventTarget.textContent;
            try {
                this.fontName = JSON.parse(eventTarget.style.fontFamily);
            } catch (e) {
                this.fontName = eventTarget.style.fontFamily;
            }
            this.enableCreateButton(false);
        }
    }

    // eslint-disable-next-line
    private createSignatureCanvas(): any {
        // eslint-disable-next-line
        let previousField: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // eslint-disable-next-line
        let field: any = document.getElementById(this.pdfViewer.element.id + 'Signature_appearance');
        if (previousField) {
            previousField.remove();
        }
        if (field) {
            field.remove();
        }
        // eslint-disable-next-line max-len
        const appearanceDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'Signature_appearance', className: 'e-pv-signature-apperance', styles:'margin-top:30px' });
        // eslint-disable-next-line max-len
        const canvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_signatureCanvas_', className: 'e-pv-signature-canvas' }) as HTMLCanvasElement;
        if (this.pdfViewer.element.offsetWidth > 750) {
            canvas.width = 714; 
        } else {
            canvas.width = this.pdfViewer.element.offsetWidth - 35;
        }
        canvas.classList.add('e-pv-canvas-signature');
        canvas.height = 305;
        canvas.style.height = '305px';
        canvas.style.border = '1px dotted #bdbdbd';
        canvas.style.backgroundColor = 'white';
        canvas.style.boxSizing = 'border-box';
        canvas.style.borderRadius = '2px';
        canvas.addEventListener('mousedown', this.signaturePanelMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.signaturePanelMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.signaturePanelMouseUp.bind(this));
        canvas.addEventListener('mouseleave', this.signaturePanelMouseLeave.bind(this));
        canvas.addEventListener('touchstart', this.signaturePanelMouseDown.bind(this));
        canvas.addEventListener('touchmove', this.signaturePanelMouseMove.bind(this));
        canvas.addEventListener('touchend', this.signaturePanelMouseUp.bind(this));
        appearanceDiv.appendChild(canvas);
        // eslint-disable-next-line
        let checkBoxObj: any;
        // eslint-disable-next-line
        let input: any;
        let saveCheckBoxContent: string;
        if (this.pdfViewerBase.isToolbarSignClicked && !this.pdfViewerBase.isInitialField) {
            saveCheckBoxContent = this.pdfViewer.localeObj.getConstant('Save Signature');
        } else {
            saveCheckBoxContent = this.pdfViewerBase.isInitialField ? this.pdfViewer.localeObj.getConstant('Save Initial') : this.pdfViewer.localeObj.getConstant('Save Signature');
        }
        if (!this.pdfViewer.hideSaveSignature) {
            // eslint-disable-next-line
            input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'checkbox';
            appearanceDiv.appendChild(input);
            checkBoxObj = new CheckBox({ label: saveCheckBoxContent, disabled: false, checked: false });
            checkBoxObj.appendTo(input);
        }
        if(!this.pdfViewerBase.isInitialField){
            this.isSaveSignature = this.saveSignatureCheckbox();
        }
        else{
            this.isSaveInitial = this.saveSignatureCheckbox();
        }
        if (this.isSaveSignature && !this.pdfViewerBase.isInitialField) {
            checkBoxObj.checked = true;
        }
        else if(this.isSaveInitial && this.pdfViewerBase.isInitialField){
            checkBoxObj.checked = true;
        }
        //if (!this.pdfViewerBase.isToolbarSignClicked) {
        // eslint-disable-next-line
        let typeDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'type_appearance', className: 'e-pv-signature-apperance', styles:'margin-top:6px' });
        // eslint-disable-next-line
        let inputText: any = document.createElement('input');
        inputText.type = 'text';
        inputText.id = this.pdfViewer.element.id + '_e-pv-Signtext-box';
        typeDiv.appendChild(inputText);
        // eslint-disable-next-line
        let inputobj: any = new TextBox({
            placeholder: this.pdfViewer.localeObj.getConstant('Enter Signature as Name'),
            floatLabelType: 'Auto'
        });
        inputobj.appendTo(inputText);
        // eslint-disable-next-line
        let fontDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_font_appearance', className: 'e-pv-font-appearance-style' });
        fontDiv.classList.add('e-pv-canvas-signature');
        fontDiv.style.height = '270px';
        fontDiv.style.border = '1px dotted #bdbdbd';
        fontDiv.style.boxSizing = 'border-box';
        fontDiv.style.borderRadius = '2px';
        fontDiv.style.backgroundColor = 'white';
        fontDiv.style.color = 'black';
        fontDiv.style.marginTop = '8px'
        typeDiv.appendChild(fontDiv);
        input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'checkbox1';
        typeDiv.appendChild(input);
        checkBoxObj = new CheckBox({ label: saveCheckBoxContent, disabled: false, checked: false });
        checkBoxObj.appendTo(input);
        inputobj.addEventListener('input', this.renderSignatureText.bind(this));
        this.enableCreateButton(true);

        // eslint-disable-next-line
        let tab: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'Signature_tab' });
        const uploadDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'upload_appearance', className: 'e-pv-signature-apperance', styles:'padding-top:30px' });

        // eslint-disable-next-line
        let button: any = document.createElement('div');
        button.id = this.pdfViewer.element.id + '_e-pv-upload-button';
        uploadDiv.appendChild(button);
        // eslint-disable-next-line
        let uploadButton: any = new Button({ cssClass: 'e-pv-sign-upload', content: this.pdfViewer.localeObj.getConstant('Browse Signature Image') });
        uploadButton.appendTo(button);
        uploadButton.element.style.position = 'absolute';
      
        // eslint-disable-next-line max-len
        const uploadCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_signatureuploadCanvas_', className: 'e-pv-signature-uploadcanvas' }) as HTMLCanvasElement;
        if (this.pdfViewer.element.offsetWidth > 750) {
            uploadCanvas.width = 714;
        } else {
            uploadCanvas.width = this.pdfViewer.element.offsetWidth - 35; 
        }
        uploadCanvas.classList.add('e-pv-canvas-signature');
        uploadCanvas.height = 305;
        uploadCanvas.style.height = '305px';
        uploadButton.element.style.left = ((uploadCanvas.width / 2) - 50) + 'px';
        uploadButton.element.style.top = ((parseFloat(uploadCanvas.style.height) / 2) + 20) + 'px';
        uploadCanvas.style.border = '1px dotted #bdbdbd';
        uploadCanvas.style.backgroundColor = 'white';
        uploadCanvas.style.boxSizing = 'border-box';
        uploadCanvas.style.borderRadius = '2px';
        uploadCanvas.style.zIndex = '0';
        uploadDiv.appendChild(uploadCanvas);
        input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'checkbox2';
        uploadDiv.appendChild(input);
        checkBoxObj = new CheckBox({ label: saveCheckBoxContent, disabled: false, checked: false });
        checkBoxObj.appendTo(input);
        button.addEventListener('click', this.uploadSignatureImage.bind(this));

        // eslint-disable-next-line max-len
        this.signfontStyle = [{ FontName: 'Helvetica' }, { FontName: 'Times New Roman' }, { FontName: 'Courier' }, { FontName: 'Symbol' }];
        // eslint-disable-next-line
        let fontSignature: any = [];
        if (this.pdfViewerBase.isToolbarSignClicked && !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.typeSignatureFonts)) {
            for (let j: number = 0; j < 4; j++) {
                if (!isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.typeSignatureFonts[j])) {
                    this.signfontStyle[j].FontName = this.pdfViewer.handWrittenSignatureSettings.typeSignatureFonts[j];
                }
            }
        }
        for (let i: number = 0; i < this.signfontStyle.length; i++) {
            fontSignature[i] = document.createElement('div');
            fontSignature[i].id = '_font_signature' + i + '';
            fontSignature[i].classList.add('e-pv-font-sign');
        }
        this.fontsign = fontSignature;
        // eslint-disable-next-line
        let proxy: any = this;
        let items: any = [];
        if (this.pdfViewerBase.isToolbarSignClicked) {
            if(this.pdfViewerBase.isInitialField) {
                items = this.showHideSignatureTab(this.pdfViewer.handWrittenSignatureSettings.initialDialogSettings.displayMode, appearanceDiv, typeDiv, uploadDiv);
            } else {
                items = this.showHideSignatureTab(this.pdfViewer.handWrittenSignatureSettings.signatureDialogSettings.displayMode, appearanceDiv, typeDiv, uploadDiv);
            }
        } else {
            if(this.pdfViewerBase.isInitialField) {
                items = this.showHideSignatureTab(this.pdfViewer.initialFieldSettings.initialDialogSettings.displayMode, appearanceDiv, typeDiv, uploadDiv);
            } else {
                items = this.showHideSignatureTab(this.pdfViewer.signatureFieldSettings.signatureDialogSettings.displayMode, appearanceDiv, typeDiv, uploadDiv);
            }
        }
        // eslint-disable-next-line
        this.tabObj = new Tab({
            selected: (args: SelectEventArgs): void => {
                proxy.handleSelectEvent(args);
            },
            selecting: (args: SelectEventArgs): void => {
                proxy.select(args);
            },
            items: items
        });
        this.tabObj.appendTo(tab);
        if(tab && tab.lastElementChild) {
            (tab.lastElementChild as any).style.overflow = 'hidden';
        }
        if(items[0].header.label === 'DRAW') {
            this.signaturetype = 'Draw';
        } else if(items[0].header.label === 'TYPE') {
            this.signaturetype = 'Type';
        } else {
            this.signaturetype = 'Image';
        }
        
        return tab;
        // } else {
        //     return appearanceDiv;
        // }
    }
    private select = function (e: SelectEventArgs): void {
        if (this.canvasTouched) {
            this.mouseMoving = true;
            this.canvasTouched = false;
        }
        if (e.isSwiped && this.signaturetype == 'Draw' && this.mouseMoving) {
            e.cancel = true;
            this.mouseMoving = false;
        }
    }
    private handleSelectEvent(e: SelectEventArgs): void {
        // eslint-disable-next-line
        let headerText: string = '';
        let maximumWidth: number = 750;
        let tabInstance = (document.getElementById(this.pdfViewer.element.id + 'Signature_tab') as any).ej2_instances[0];
        if(tabInstance) {
            if (tabInstance.items.length > 0) {
                for (let i: number = 0; i < tabInstance.items.length; i++) {
                     let headerValue = tabInstance.items[i].header.text;
                     if (headerValue === e.selectedItem.textContent) {
                         headerText = tabInstance.items[i].header.label;
                     }
                }
            }
        }
        let checkbox: any = document.getElementById('checkbox');
        if (checkbox && checkbox.checked) {
            if (e.previousIndex === 0 && this.outputString !== '') {
                if(!this.pdfViewerBase.isInitialField){
                    this.isSaveSignature = true;
                    this.saveSignatureString = this.outputString;
                }
                else{
                    this.isSaveInitial = true;
                    this.saveInitialString = this.outputString;
                }
                // eslint-disable-next-line
                let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
                this.saveImageString = canvas.toDataURL();
                if(!this.pdfViewerBase.isInitialField){
                    this.signatureImageString = this.saveImageString;
                }
                else{
                    this.initialImageString = this.saveImageString;
                }
            }
        } else {
            if (this.isSaveSignature && !this.pdfViewerBase.isInitialField) {
                this.isSaveSignature = false;
                this.saveSignatureString = '';
                this.saveImageString = '';
                this.signatureImageString = '';
            }
            else if(this.isSaveInitial && this.pdfViewerBase.isInitialField){
                this.isSaveInitial = false;
                this.saveInitialString = '';
                this.saveImageString = '';
                this.initialImageString = '';
            }
        }
        this.clearSignatureCanvas(e);
        // eslint-disable-next-line
        if (headerText.toLocaleLowerCase() === 'draw') {
            this.signaturetype = 'Draw';
            this.enableCreateSignatureButton();
            let drawCheckbox = document.getElementById("checkbox");
            this.hideSignatureCheckbox(drawCheckbox);
        } else if (headerText.toLocaleLowerCase() === 'type') {
            this.updateSignatureTypeValue();
            this.signaturetype = 'Type';
            this.enableCreateSignatureButton();
            let typeCheckbox = document.getElementById("checkbox1");
            this.hideSignatureCheckbox(typeCheckbox);
        } else if (headerText.toLocaleLowerCase() === 'upload') {
            this.signaturetype = 'Image';
            this.enableCreateSignatureButton();
            let imageCheckbox = document.getElementById("checkbox2");
            this.hideSignatureCheckbox(imageCheckbox);
        } 
        if (this.pdfViewer.element.offsetWidth < maximumWidth)
            this.updateCanvasSize();
    }
    private enableCreateSignatureButton(): void {
        if (this.outputString !== "") {
            this.enableCreateButton(false);
        } else {
            this.enableCreateButton(true);
        }
    }
    private showHideSignatureTab(displayMode: DisplayMode, appearanceDiv: HTMLElement, typeDiv: HTMLElement, uploadDiv: HTMLElement): any {
        let items: any = [];
        if(displayMode & DisplayMode.Draw) {
            items.push({
                header: { 'text': this.pdfViewer.localeObj.getConstant('Draw-hand Signature'), 'label': 'DRAW' },
                content: appearanceDiv
            })
        }
        if(displayMode & DisplayMode.Text) {
            items.push({
                header: { 'text': this.pdfViewer.localeObj.getConstant('Type Signature'), 'label': 'TYPE' },
                content: typeDiv
            })
        }
        if(displayMode & DisplayMode.Upload) {
            items.push({
                header: { 'text': this.pdfViewer.localeObj.getConstant('Upload Signature'), 'label': 'UPLOAD' },
                content: uploadDiv
            })
        }
        return items;
    }
    /**
     * @private
     * @returns {void}
     */
    public createSignatureFileElement(): void {
        // eslint-disable-next-line
        let signImage: any = createElement('input', { id: this.pdfViewer.element.id + '_signElement', attrs: { 'type': 'file' } });
        signImage.setAttribute('accept', '.jpg,.jpeg,.png');
        signImage.style.position = 'absolute';
        signImage.style.left = '0px';
        signImage.style.top = '0px';
        signImage.style.visibility = 'hidden';
        document.body.appendChild(signImage);
        signImage.addEventListener('change', this.addStampImage);
    }
    private uploadSignatureImage(): void {
        // eslint-disable-next-line
        let signImage: any = document.getElementById(this.pdfViewer.element.id + '_signElement'); 
        if (signImage) {
            signImage.click();
        }
    }
    // eslint-disable-next-line
    private addStampImage = (args: any): void => {
        // eslint-disable-next-line
        let proxy: any = this;
        // eslint-disable-next-line
        let upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            const uploadedFile: File = upoadedFiles[0];
            if (uploadedFile.type.split('/')[0] === 'image') {
                const reader: FileReader = new FileReader();
                // eslint-disable-next-line
                reader.onload = (e: any): void => {
                    // eslint-disable-next-line
                    let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureuploadCanvas_');
                    // eslint-disable-next-line
                    let context: any = canvas.getContext('2d');
                    // eslint-disable-next-line
                    let image: any = new Image();
                    // eslint-disable-next-line
                    let proxy: any = this;
                    image.onload = (): void => {
                        // eslint-disable-next-line
                        let signbutton: any = document.getElementById(this.pdfViewer.element.id + '_e-pv-upload-button');
                        signbutton.style.visibility = 'hidden';
                        context.drawImage(image, 0, 0, canvas.width, canvas.height);
                        proxy.enableCreateButton(false);
                        proxy.outputString = image.src;
                        proxy.signatureImageHeight = image.naturalHeight;
                        proxy.signatureImageWidth = image.naturalWidth;
                    };
                    image.src = e.currentTarget.result;
                    proxy.outputString =  e.currentTarget.result;
                };
                reader.readAsDataURL(uploadedFile);
            }
        }
        args.target.value = '';
        args.currentTarget.value = '';
    };
    private renderSignatureText(): void {
        let maximumWidth: number = 750;
        // eslint-disable-next-line
        let fontDiv: any = document.getElementById(this.pdfViewer.element.id + '_font_appearance');
        // eslint-disable-next-line
        let textBox: any = document.getElementById(this.pdfViewer.element.id + '_e-pv-Signtext-box');
        for (let i: number = 0; i < this.signfontStyle.length; i++) {
            this.fontsign[i].innerHTML = textBox.value;
            this.fontsign[i].style.fontFamily = this.signfontStyle[i].FontName;
            if (this.signfontStyle[i].FontName === 'Helvetica') {
                this.fontsign[i].style.borderColor = 'red';
            }
            fontDiv.appendChild(this.fontsign[i]);
        }
        for (let i: number = 0; i < this.signfontStyle.length; i++) {
            // eslint-disable-next-line
            let clickSign: any = document.getElementById('_font_signature' + i + '');
            clickSign.addEventListener('click', this.typeSignatureclick.bind(this));
        }
        this.enableCreateButton(false);
        this.enableClearbutton(false);
        if (this.pdfViewer.element.offsetWidth < maximumWidth)
           this.updateCanvasSize();
    }
    private typeSignatureclick(): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        // eslint-disable-next-line
        let createButton: any = document.getElementsByClassName('e-pv-createbtn')[0];
        createButton.disabled = false;
        for (let i: number = 0; i < 4; i++) {
            // eslint-disable-next-line
            let fontElement: any = document.getElementById('_font_signature' + i + '');
            if (fontElement) {
                fontElement.style.borderColor = '';
            }
        }
        eventTarget.style.borderColor = 'red';
        this.outputString = eventTarget.textContent;
        try {
            this.fontName = JSON.parse(eventTarget.style.fontFamily);
        } catch (e) {
            this.fontName = eventTarget.style.fontFamily;
        }
    }
    /**
     * @param bounds
     * @param position
     * @private
     */
    // eslint-disable-next-line
    public addSignatureCollection(bounds?: any, position?: any): void {
        let minimumX: number = -1;
        let minimumY: number = -1;
        let maximumX: number = -1;
        let maximumY: number = -1;
        // eslint-disable-next-line
        let collectionData: any = processPathData(this.outputString);
        // eslint-disable-next-line
        let newCanvas: any = document.createElement('canvas');
        // eslint-disable-next-line
        let context: any = newCanvas.getContext('2d');
        // eslint-disable-next-line
        let imageString: any;
        const signatureType: string = this.pdfViewerBase.currentSignatureAnnot.shapeAnnotationType;
        if (signatureType === 'HandWrittenSignature') {
            if (collectionData.length !== 0) {
                // eslint-disable-next-line
                for (let k = 0; k < collectionData.length; k++) {
                    // eslint-disable-next-line
                    let val = collectionData[k];
                    if (minimumX === -1) {
                        // eslint-disable-next-line
                        minimumX = (val['x']);
                        // eslint-disable-next-line
                        maximumX = (val['x']);
                        // eslint-disable-next-line
                        minimumY = (val['y']);
                        // eslint-disable-next-line
                        maximumY = (val['y']);
                    } else {
                        // eslint-disable-next-line
                        let point1 = (val['x']);
                        // eslint-disable-next-line
                        let point2 = (val['y']);
                        if (minimumX >= point1) {
                            minimumX = point1;
                        }
                        if (minimumY >= point2) {
                            minimumY = point2;
                        }
                        if (maximumX <= point1) {
                            maximumX = point1;
                        }
                        if (maximumY <= point2) {
                            maximumY = point2;
                        }
                    }
                }
                const newdifferenceX: number = maximumX - minimumX;
                const newdifferenceY: number = maximumY - minimumY;

                let differenceX: number = newdifferenceX / 100;
                let differenceY: number = newdifferenceY / 100;
                let left: number = 0;
                let top: number = 0;
                if (bounds) {
                    newCanvas.width = position.currentWidth;
                    newCanvas.height = position.currentHeight;
                    differenceX = newdifferenceX / (bounds.width);
                    differenceY = newdifferenceY / (bounds.height);
                    left = bounds.x - position.currentLeft;
                    top = bounds.y - position.currentTop;
                } else {
                    newCanvas.width = 100;
                    newCanvas.height = 100;
                }

                context.beginPath();
                for (let n: number = 0; n < collectionData.length; n++) {
                    // eslint-disable-next-line
                    let val: any = collectionData[n];
                    // eslint-disable-next-line
                    let point1: number = ((val['x'] - minimumX) / differenceX) + left;
                    // eslint-disable-next-line
                    let point2: number = ((val['y'] - minimumY) / differenceY) + top;
                    // eslint-disable-next-line
                    if (val['command'] === 'M') {
                        context.moveTo(point1, point2);
                        // eslint-disable-next-line
                    } else if (val['command'] === 'L') {
                        context.lineTo(point1, point2);
                    }
                }
                context.stroke();
                context.closePath();
                imageString = newCanvas.toDataURL();
            }
        }
        else if (signatureType === 'SignatureText') {
            imageString = this.outputString;
        } else {
            imageString = this.outputString;
        }


        if (bounds) {
            this.saveImageString = imageString;
        } else {
            // eslint-disable-next-line
            let signCollection: any = {};
            signCollection['sign_' + this.pdfViewerBase.imageCount] = this.outputString;
            this.outputcollection.push(signCollection);
            // eslint-disable-next-line
            let signature: any = [];
            signature.push({ id: 'sign_' + this.pdfViewerBase.imageCount, imageData: imageString, signatureType: signatureType, fontFamily: this.pdfViewerBase.currentSignatureAnnot.fontFamily });
            this.signaturecollection.push({ image: signature, isInitial: this.pdfViewerBase.isInitialField });
            this.pdfViewerBase.imageCount++;
        }
    }

    /**
     * @private]
     * @param {number} limit - The limit.
     * @returns {number} - Returns number.
     */
    public getSaveLimit(limit: number): number {
        if (limit > this.maxSaveLimit) {
            limit = this.maxSaveLimit;
        } else if (limit < 1) {
            limit = 1;
        }
        return limit;
    }
    /**
     * @private
     * @returns {void}
     */
    public RenderSavedSignature(): void {
        this.pdfViewerBase.signatureCount++;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        let annot: PdfAnnotationBaseModel;
        if (this.pdfViewerBase.isAddedSignClicked) {
            const annotationName: string = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            let currentLeft: number = 0;
            let currentTop: number = 0;
            // eslint-disable-next-line max-len
            let currentWidth: number = this.pdfViewer.handWrittenSignatureSettings.width ? this.pdfViewer.handWrittenSignatureSettings.width : 100;
            // eslint-disable-next-line max-len
            let currentHeight: number = this.pdfViewer.handWrittenSignatureSettings.height ? this.pdfViewer.handWrittenSignatureSettings.height : 100;
            // eslint-disable-next-line max-len
            const thickness: number = this.pdfViewer.handWrittenSignatureSettings.thickness ? this.pdfViewer.handWrittenSignatureSettings.thickness : 1;
            // eslint-disable-next-line max-len
            const opacity: number = this.pdfViewer.handWrittenSignatureSettings.opacity ? this.pdfViewer.handWrittenSignatureSettings.opacity : 1;
            // eslint-disable-next-line max-len
            const strokeColor: string = this.pdfViewer.handWrittenSignatureSettings.strokeColor ? this.pdfViewer.handWrittenSignatureSettings.strokeColor : '#000000';
            currentLeft = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            // eslint-disable-next-line max-len
            currentTop = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            let keyString: string = '';
            let signatureType: PdfAnnotationType;
            let signatureFontFamily: string;
            for (let collection: number = 0; collection < this.outputcollection.length; collection++) {
                // eslint-disable-next-line
                let collectionAddedsign: any = this.outputcollection[collection];
                // eslint-disable-next-line
                let eventTarget: HTMLElement = event.target as HTMLElement;
                // eslint-disable-next-line max-len
                if (eventTarget && eventTarget.id === 'sign_' + collection || eventTarget && eventTarget.id === 'sign_border' + collection) {
                    keyString = collectionAddedsign['sign_' + collection];
                    break;
                }
            }
            for (let signatureIndex: number = 0; signatureIndex < this.signaturecollection.length; signatureIndex++) {
                const eventTarget: HTMLElement = event.target as HTMLElement;
                const signatureId: string = this.signaturecollection[signatureIndex].image[0].id.split('_')[1];
                if (eventTarget && eventTarget.id === 'sign_' + signatureId || eventTarget && eventTarget.id === 'sign_border' + signatureId) {
                    signatureType = this.signaturecollection[signatureIndex].image[0].signatureType;
                    signatureFontFamily = this.signaturecollection[signatureIndex].image[0].fontFamily;
                    break;
                }
            }
            if (signatureType === 'HandWrittenSignature') {
                // eslint-disable-next-line
                const signatureBounds: any = this.pdfViewer.formFieldsModule.updateSignatureAspectRatio(keyString, true);
                // eslint-disable-next-line max-len
                currentWidth = signatureBounds.width ? signatureBounds.width : currentWidth;
                // eslint-disable-next-line max-len
                currentHeight = signatureBounds.height ? signatureBounds.height : currentHeight;
            } else {
                currentWidth = currentWidth === 150 ? 200 : this.pdfViewer.handWrittenSignatureSettings.width;
                // eslint-disable-next-line max-len
                currentHeight = currentHeight === 100 ? 65 : this.pdfViewer.handWrittenSignatureSettings.height;
            }
            annot = {
                // eslint-disable-next-line max-len
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: keyString,
                // eslint-disable-next-line max-len
                shapeAnnotationType: signatureType, opacity: opacity, fontFamily: signatureFontFamily, strokeColor: strokeColor, thickness: thickness, signatureName: annotationName
            };

            this.pdfViewerBase.currentSignatureAnnot = annot;
            this.pdfViewerBase.isAddedSignClicked = false;
        } else {
            this.pdfViewer.formFieldsModule.drawSignature();

        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateCanvasSize(): void {
        // eslint-disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        this.setTabItemWidth(canvas);
        let uploadCanvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureuploadCanvas_');
        this.setTabItemWidth(uploadCanvas);
        let fontAppearance: any = document.getElementById(this.pdfViewer.element.id + '_font_appearance')
        this.setTabItemWidth(fontAppearance);
    }

    private setTabItemWidth(canvas: any): void {
        let padding: number = 2;
        let maximumWidth: number = 750;
        let canvasWidth: number = 714;
        let margin: number = 50;
        let elem: any = document.querySelector('.e-dlg-content');
        if (elem) {
           let style: any = getComputedStyle(elem);
           padding = padding + parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
        }
        if (canvas && this.signatureDialog && this.signatureDialog.visible) {
            if (this.pdfViewer.element.offsetWidth > maximumWidth) {
                canvas.width = canvasWidth;
                canvas.style.width =  canvasWidth + 'px';
            } else {
                canvas.width = this.pdfViewer.element.offsetWidth - padding;
                canvas.style.width = canvas.width + 'px';
            }
        }
        let fontInnerDiv: any = document.getElementsByClassName('e-pv-font-sign');
        if (canvas && fontInnerDiv && fontInnerDiv.length > 0) {
            for (let i: number = 0; i < fontInnerDiv.length; i++) {
                let fontDiv: any = fontInnerDiv[i];
                fontDiv.style.width = ((canvas.width / 2) - margin) + 'px';
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
            this.drawMousePosition(e);
            this.mouseMoving = true;
        }
    }
    private enableCreateButton(isEnable: boolean): void {
        // eslint-disable-next-line
        let createbtn: any = document.getElementsByClassName('e-pv-createbtn')[0];
        if (createbtn) {
            createbtn.disabled = isEnable;
        }
        this.enableClearbutton(isEnable);
    }
    private enableClearbutton(isEnable: boolean): void {
        // eslint-disable-next-line
        let clearbtn: any = document.getElementsByClassName('e-pv-clearbtn')[0];
        if (clearbtn) {
            clearbtn.disabled = isEnable;
        }
    }
    private signaturePanelMouseMove(e: MouseEvent | TouchEvent): void {
        if (this.mouseDetection && this.signaturetype === 'Draw') {
            this.findMousePosition(e);
            this.enableCreateButton(false);
            this.drawMousePosition(e);
        }
    }
    private findMousePosition(event: MouseEvent | TouchEvent): void {
        let offsetX: number;
        let offsetY: number;
        if (event.type.indexOf('touch') !== -1) 
        {
            event = event as TouchEvent;
            const element: HTMLElement = event.target as HTMLElement;
            // eslint-disable-next-line
            let currentRect: any = element.getBoundingClientRect();
            this.mouseX = event.changedTouches[0].clientX - currentRect.left;
            this.mouseY = event.changedTouches[0].clientY - currentRect.top;
        }
        else {
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
        // eslint-disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // eslint-disable-next-line
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
        if(event.type == 'touchend'){
            this.canvasTouched = true;
        }
    }
    private signaturePanelMouseLeave(): void {
        if (this.mouseDetection) {
            this.convertToPath(this.newObject);
        }
        this.mouseDetection = false;
        this.mouseMoving = false;
    };
    // eslint-disable-next-line
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
    /**
     * @private
     * @returns {void}
     */
    public clearSignatureCanvas(type?: any): void {
        let isCanvasClear: boolean = true;
        let drawObject: any = [];
        if (type && !isNullOrUndefined(type.previousIndex) && !isNullOrUndefined(type.selectedIndex)) {
            isCanvasClear = false;
            if (type.previousIndex === 0) {
                this.drawOutputString = this.outputString;
                drawObject = this.newObject;
            }
            else if (type.previousIndex === 2) {
                this.imageOutputString = this.outputString;
            }
            this.outputString = '';
            this.newObject = [];
            if (type.selectedIndex === 0) {
                this.outputString = this.drawOutputString;
                this.newObject = drawObject;
            }
            else if (type.selectedIndex === 2) {
                this.outputString = this.imageOutputString;
            }
        }  else {
            this.outputString = '';
            this.newObject = [];
        }
        let isClearDrawTab: boolean = false;
        let isClearTypeTab: boolean = false;
        let isClearImageTab: boolean = false;
        if (type && type.currentTarget && type.currentTarget.classList.contains("e-pv-clearbtn")) {
            isCanvasClear = false;
            if (this.signaturetype === 'Draw') {
                isClearDrawTab = true;
            } else if (this.signaturetype === 'Type') {
                isClearTypeTab = true;
            } else {
                isClearImageTab = true;
            }
        }
        // eslint-disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // eslint-disable-next-line
        if ((canvas && isCanvasClear) || (isClearDrawTab)) {
            // eslint-disable-next-line
            let context: any = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        // eslint-disable-next-line
        let imageCanvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureuploadCanvas_');
        if (imageCanvas && isCanvasClear|| (isClearImageTab)) {
            // eslint-disable-next-line
            let context: any = imageCanvas.getContext('2d');
            context.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            // eslint-disable-next-line
            let signbutton: any = document.getElementById(this.pdfViewer.element.id + '_e-pv-upload-button');
            if (signbutton) {
                signbutton.style.visibility = '';
            }
        }
        // eslint-disable-next-line
        let fontdiv: any = document.getElementById(this.pdfViewer.element.id + '_font_appearance');
        // eslint-disable-next-line
        let textbox: any = document.getElementById(this.pdfViewer.element.id + '_e-pv-Signtext-box');
        if ((fontdiv && textbox && isCanvasClear)|| (isClearTypeTab)) {
            textbox.value = '';
            if (!isBlazor()) {
                fontdiv.innerHTML = '';
            }
        }
        this.enableCreateButton(true);
    }
    /**
     * @private
     * @returns {void}
     */
    public closeSignaturePanel(): void {
        if (this.pdfViewerBase.currentTarget) {
            this.pdfViewerBase.drawSignatureWithTool = true;
        }
        this.clearSignatureCanvas();
        if (!isBlazor()) {
            this.signatureDialog.hide();
        }
        this.pdfViewerBase.isToolbarSignClicked = false;
        this.pdfViewerBase.drawSignatureWithTool = false;
        this.drawOutputString = '';
        this.imageOutputString = '';
    }
    /**
     * @private
     * @returns {string} - Returns the string.
     */
    public saveSignature(): string {
        // eslint-disable-next-line
        let storeObject: string = null;
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sign'];
        } else {
            storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        }

        // eslint-disable-next-line
        let annotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            const annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: ISignAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // eslint-disable-next-line max-len
                        const strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor ? pageAnnotationObject.annotations[z].strokeColor: "black";
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        // eslint-disable-next-line max-len
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        if (pageAnnotationObject.annotations[z].shapeAnnotationType === 'HandWrittenSignature') {
                            // eslint-disable-next-line
                            let collectionData: any = processPathData(pageAnnotationObject.annotations[z].data);
                            // eslint-disable-next-line
                            let csData: any = splitArrayCollection(collectionData);
                            pageAnnotationObject.annotations[z].data = JSON.stringify(csData);
                        } else {
                            if (pageAnnotationObject.annotations[z].shapeAnnotationType === 'SignatureText' && !this.checkDefaultFont(pageAnnotationObject.annotations[z].fontFamily)) {
                                const signTypeCanvas: HTMLCanvasElement = createElement('canvas') as HTMLCanvasElement;
                                const bounds= JSON.parse(pageAnnotationObject.annotations[z].bounds);
                                signTypeCanvas.width = (bounds && bounds.width)||150;
                                signTypeCanvas.height = (bounds && bounds.height) || pageAnnotationObject.annotations[z].fontSize * 2;
                                // eslint-disable-next-line
                                const canvasContext: any = signTypeCanvas.getContext('2d');
                                const x: number = signTypeCanvas.width / 2;
                                const y: number = (signTypeCanvas.height / 2) + pageAnnotationObject.annotations[z].fontSize / 2- 10;
                                canvasContext.textAlign = 'center';
                                canvasContext.font = pageAnnotationObject.annotations[z].fontSize + 'px ' + pageAnnotationObject.annotations[z].fontFamily;
                                canvasContext.fillText(pageAnnotationObject.annotations[z].data, x, y);
                                pageAnnotationObject.annotations[z].data = JSON.stringify(signTypeCanvas.toDataURL('image/png'));
                                pageAnnotationObject.annotations[z].shapeAnnotationType = 'SignatureImage';
                            } else {
                                pageAnnotationObject.annotations[z].data = JSON.stringify(pageAnnotationObject.annotations[z].data);
                            }
                        }
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }

    private checkDefaultFont(fontName: string): boolean {
        // eslint-disable-next-line
        [{ FontName: 'Helvetica' }, { FontName: 'Times New Roman' }, { FontName: 'Courier' }, { FontName: 'Symbol' }];
        if (fontName === 'Helvetica' || fontName === 'Times New Roman' || fontName === 'Courier' || fontName === 'Symbol') {
            return true;
        }
        return false;
    }
    /**
     * @param colorString
     * @private
     */
    // eslint-disable-next-line
    public getRgbCode(colorString: string): any {
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        // eslint-disable-next-line radix
        const r: number = parseInt(stringArray[0].split('(')[1]);
        // eslint-disable-next-line radix
        const g: number = parseInt(stringArray[1]);
        // eslint-disable-next-line radix
        const b: number = parseInt(stringArray[2]);
        // eslint-disable-next-line radix
        const a: number = parseInt(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * @private
     * @param {number} left - The left.
     * @param {number} top - The top.
     * @returns {void}
     */
    public renderSignature(left: number, top: number): void {
        let annot: PdfAnnotationBaseModel;
        // eslint-disable-next-line
        let currentAnnotation: any = this.pdfViewerBase.currentSignatureAnnot;
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        if (currentAnnotation) {
            if (this.pdfViewerBase.currentSignatureAnnot.shapeAnnotationType === 'HandWrittenSignature') {
                annot = {
                    // eslint-disable-next-line max-len
                    id: currentAnnotation.id, bounds: { x: left, y: top, width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height }, pageIndex: currentAnnotation.pageIndex, data: currentAnnotation.data,
                    shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.opacity,fontFamily: currentAnnotation.fontFamily, fontSize:currentAnnotation.fontSize, strokeColor: currentAnnotation.strokeColor, thickness: currentAnnotation.thickness, signatureName: annotationName
                };
            }
            if (this.pdfViewerBase.currentSignatureAnnot.shapeAnnotationType === 'SignatureText') {
                annot = {
                    // eslint-disable-next-line max-len
                    id: currentAnnotation.id, bounds: { x: left, y: top, width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height }, pageIndex: currentAnnotation.pageIndex, data: currentAnnotation.data,
                    shapeAnnotationType: 'SignatureText', opacity: currentAnnotation.opacity, fontFamily: currentAnnotation.fontFamily, fontSize:currentAnnotation.fontSize, strokeColor: currentAnnotation.strokeColor, thickness: currentAnnotation.thickness, signatureName: annotationName
                };
            }
            else if (this.pdfViewerBase.currentSignatureAnnot.shapeAnnotationType === 'SignatureImage') {
                annot = {
                    // eslint-disable-next-line max-len
                    id: currentAnnotation.id, bounds: { x: left, y: top, width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height }, pageIndex: currentAnnotation.pageIndex, data: currentAnnotation.data,
                    shapeAnnotationType: 'SignatureImage', opacity: currentAnnotation.opacity, fontFamily: currentAnnotation.fontFamily, fontSize:currentAnnotation.fontSize, strokeColor: currentAnnotation.strokeColor, thickness: currentAnnotation.thickness, signatureName: annotationName
                };
            }
            this.pdfViewer.add(annot as PdfAnnotationBase);
            // eslint-disable-next-line
            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
            // eslint-disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, currentAnnotation.pageIndex);
            this.pdfViewerBase.signatureAdded = true;
            // eslint-disable-next-line max-len
            this.storeSignatureData(currentAnnotation.pageIndex, annot);
            this.pdfViewer.fireSignatureAdd(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType, currentAnnotation.bounds, currentAnnotation.opacity, currentAnnotation.strokeColor, currentAnnotation.thickness);
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.signatureCount++;
        }
    }
    /**
     * @param annotationCollection
     * @param pageIndex
     * @param isImport
     * @private
     */
    // eslint-disable-next-line
    public renderExistingSignature(annotationCollection: any, pageIndex: number, isImport: boolean): void {
        let annot: PdfAnnotationBaseModel;
        let isAnnotationAdded: boolean = false;
        if (!isImport){
            for (let p: number = 0; p < this.signAnnotationIndex.length; p++){
                if (this.signAnnotationIndex[p] === pageIndex){
                    isAnnotationAdded = true;
                    break;
                }
            }
        }
        if (annotationCollection && !isAnnotationAdded) {
            if (annotationCollection.length > 0 && this.signAnnotationIndex.indexOf(pageIndex) === -1) {
                this.signAnnotationIndex.push(pageIndex);
            }
            for (let n: number = 0; n < annotationCollection.length; n++) {
                // eslint-disable-next-line
                let currentAnnotation: any = annotationCollection[n];
                if (currentAnnotation) {
                    // eslint-disable-next-line
                    let data: any = currentAnnotation.PathData;
                    if (isImport) {
                        if (currentAnnotation.IsSignature) {
                            data = currentAnnotation.PathData;
                        }
                        else if (currentAnnotation.AnnotationType === 'SignatureImage' || currentAnnotation.AnnotationType === 'SignatureText') {
                            data = JSON.parse(JSON.stringify(currentAnnotation.PathData));
                        }
                        else {
                             if (data.includes('command')) {
                                data = getPathString(JSON.parse(currentAnnotation.PathData));
                            }
                            else {
                                data = currentAnnotation.PathData;
                            }
                        }
                    }
                    this.outputString = data;
                    this.outputString = '';
                    let rectDiff = 0;
                    let rectDifference = 1;
                    let bounds = currentAnnotation.Bounds;
                    let currentLeft = !isNullOrUndefined(bounds.X) ? bounds.X + (rectDiff / 2) : bounds.x + (rectDiff / 2);
                    let currentTop = !isNullOrUndefined(bounds.Y) ? bounds.Y + (rectDiff / 2) : bounds.y + (rectDiff / 2);
                    let currentWidth = bounds.Width ? bounds.Width - (rectDifference - 1) : bounds.width - (rectDifference - 1);
                    let currentHeight = bounds.Height ? bounds.Height - (rectDifference - 1) : bounds.height - (rectDifference - 1);
                    if (currentAnnotation.AnnotationType === 'SignatureText') {
                        annot = {
                            id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data, fontFamily: currentAnnotation.FontFamily, fontSize: currentAnnotation.FontSize,
                            shapeAnnotationType: 'SignatureText', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, signatureName: currentAnnotation.SignatureName
                        };
                    }
                    else if(currentAnnotation.AnnotationType === 'SignatureImage') {
                        annot = {
                            id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,shapeAnnotationType: 'SignatureImage', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, signatureName: currentAnnotation.SignatureName
                        };
                    }
                    else{
                        annot = {
                            id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data:data,shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, signatureName: currentAnnotation.SignatureName
                        };
                    }
                }
                this.pdfViewer.add(annot as PdfAnnotationBase);
                // eslint-disable-next-line
                let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
                // eslint-disable-next-line
                this.pdfViewer.renderDrawing(canvass as any, annot.pageIndex);
                this.storeSignatureData(annot.pageIndex, annot);
                this.pdfViewerBase.currentSignatureAnnot = null;
                this.pdfViewerBase.signatureCount++;
                // eslint-disable-next-line max-len
                if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable) {
                    // eslint-disable-next-line max-len
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                    // eslint-disable-next-line max-len
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], true);
                }
            }
        }
    }
    /**
     * @param pageNumber
     * @param annotations
     * @private
     */
    // eslint-disable-next-line
    public storeSignatureData(pageNumber: number, annotations: any): void {
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(annotations.pageIndex, null, annotations as PdfAnnotationBase, 'Addition', '', annotations as PdfAnnotationBase, annotations);
        let annotation: ISignAnnotation = null;
        let left: number = annotations.bounds.left ? annotations.bounds.left : annotations.bounds.x;
        let top: number = annotations.bounds.top ? annotations.bounds.top : annotations.bounds.y;
        if (annotations.wrapper && annotations.wrapper.bounds) {
            left = annotations.wrapper.bounds.left;
            top = annotations.wrapper.bounds.top;
        }
        annotation = {
            // eslint-disable-next-line max-len
            id: annotations.id, bounds: { left: left, top: top, width: annotations.bounds.width, height: annotations.bounds.height }, shapeAnnotationType: annotations.shapeAnnotationType, opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data, fontSize: annotations.fontSize, fontFamily: annotations.fontFamily, signatureName: annotations.signatureName
        };
        // eslint-disable-next-line
        const sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        // eslint-disable-next-line
        const currentAnnotation: any = Math.round(JSON.stringify(annotation).length / 1024);
        if ((sessionSize + currentAnnotation) > 4500) {
            this.pdfViewerBase.isStorageExceed = true;
            this.pdfViewer.annotationModule.clearAnnotationStorage();
        }

        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        let index: number = 0;
        if (!storeObject) {
            this.storeSignatureCollections(annotation, pageNumber);
            const shapeAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            const annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(shapeAnnotation);
            const annotationStringified: string = JSON.stringify(annotationCollection);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sign'] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
            }
        } else {
            this.storeSignatureCollections(annotation, pageNumber);
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sign');
            const pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
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
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sign'] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
            }
        }
    }

    /**
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @param isSignatureEdited
     * @private
     */
    // eslint-disable-next-line
    public modifySignatureCollection(property: string, pageNumber: number, annotationBase: any, isSignatureEdited?: boolean): ISignAnnotation {
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        let currentAnnotObject: ISignAnnotation = null;
        const pageAnnotations: ISignAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // eslint-disable-next-line max-len
                        pageAnnotations[i].bounds = { left: annotationBase.wrapper.bounds.left, top: annotationBase.wrapper.bounds.top, width: annotationBase.bounds.width, height: annotationBase.bounds.height };
                        pageAnnotations[i].fontSize = annotationBase.fontSize;
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
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public storeSignatureCollections(annotation: any, pageNumber: number): void {
        // eslint-disable-next-line
        let collectionDetails: any = this.checkSignatureCollection(annotation);
        // eslint-disable-next-line
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

    // eslint-disable-next-line
    private checkSignatureCollection(signature: any): any {
        // eslint-disable-next-line
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
     * @param signature
     * @private
     */
    // eslint-disable-next-line
    public updateSignatureCollection(signature: any): void {
        // eslint-disable-next-line
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
     * @param pageNumber
     * @param signature
     * @private
     */
    // eslint-disable-next-line
    public addInCollection(pageNumber: number, signature: any): void {
        if (signature) {
            this.storeSignatureCollections(signature, pageNumber);
            // eslint-disable-next-line
            let pageSignatures: any[] = this.getAnnotations(pageNumber, null);
            if (pageSignatures) {
                pageSignatures.push(signature);
            }
            this.manageAnnotations(pageSignatures, pageNumber);
        }
    }

    // eslint-disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // eslint-disable-next-line
        let annotationCollection: any[];
        // eslint-disable-next-line
        let storeObject: string = null;
        if (this.pdfViewerBase.isStorageExceed){
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sign'];
        } else {
            storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        }

        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
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
        // eslint-disable-next-line
        let storeObject: string = null;
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sign'];
        } else {
            storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sign');
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sign'] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
            }
        }
    }
    /**
     * @private
     * @param {boolean} isShow - Returns the true or false.
     * @returns {void}
     */
    public showSignatureDialog(isShow: boolean): void {
        if (isShow) {
            this.createSignaturePanel();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public setAnnotationMode(): void {
        this.pdfViewerBase.isToolbarSignClicked = true;
        this.showSignatureDialog(true);
    }

    /**
     * @private
     * @returns {void}
     */
    public setInitialMode(): void {
        this.pdfViewerBase.isToolbarSignClicked = true;
        this.pdfViewerBase.isInitialField = true;
        this.showSignatureDialog(true);
    }

    /**
     * @param number
     * @private
     */
    // eslint-disable-next-line
    public ConvertPointToPixel(number: any): any {
        return (number * (96 / 72));
    }

    /**
     * @param signature
     * @param pageIndex
     * @param isImport
     * @private
     */
    // eslint-disable-next-line
    public updateSignatureCollections(signature: any, pageIndex: number, isImport?: boolean): any {
        let annot: PdfAnnotationBaseModel;
        // eslint-disable-next-line
        if (signature) {
            // eslint-disable-next-line
            let bounds: any = signature.Bounds;
            const currentLeft: number = bounds.X;
            const currentTop: number = bounds.Y;
            const currentWidth: number = bounds.Width;
            const currentHeight: number = bounds.Height;
            // eslint-disable-next-line
            let data: any = signature.PathData;
            if (isImport) {
                data = getPathString(JSON.parse(signature.PathData));
            }
            annot = {
                // eslint-disable-next-line max-len
                id: 'sign' + signature.SignatureName, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                shapeAnnotationType: 'HandWrittenSignature', opacity: signature.Opacity, strokeColor: signature.StrokeColor, thickness: signature.Thickness, signatureName: signature.SignatureName
            };
            return annot;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        window.sessionStorage.removeItem('_annotations_sign');
        // eslint-disable-next-line
        let signImage: any = document.getElementById(this.pdfViewer.element.id + '_signElement');
        if (signImage) {
            signImage.removeEventListener('change', this.addStampImage);
            if (signImage.parentElement)
                signImage.parentElement.removeChild(signImage);
        }
        if (this.signatureDialog)
            this.signatureDialog.destroy();
    }
}
