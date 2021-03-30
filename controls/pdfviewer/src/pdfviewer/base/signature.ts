/* eslint-disable */
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
    // eslint-disable-next-line
    private saveSignatureString: string = '';
    /**
     * @private
     */
    // eslint-disable-next-line
    public saveImageString: string = '';
    private signatureImageString: string = '';
    /**
     * @param pdfViewer
     * @param pdfViewerBase
     * @param pdfViewer
     * @param pdfViewerBase
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
        if (!isBlazor()) {
            const elementID: string = this.pdfViewer.element.id;
            const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_signature_window', className: 'e-pv-signature-window' });
            dialogDiv.style.display = 'block';
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            const appearanceTab: HTMLElement = this.createSignatureCanvas();
            if (this.signatureDialog) {
                this.signatureDialog.content = appearanceTab;
            } else {
                this.signatureDialog = new Dialog({
                    // eslint-disable-next-line max-len
                    showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Draw Signature'),
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
                            signatureWindow.remove();
                        }
                        if (!this.pdfViewerBase.isToolbarSignClicked) {
                            this.pdfViewer.fireFocusOutFormField(this.pdfViewer.formFieldsModule.currentTarget.name, '');
                        }
                        this.pdfViewerBase.isToolbarSignClicked = false;
                    }
                });
                this.signatureDialog.buttons = [
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Clear'), disabled: true, cssClass: 'e-pv-clearbtn' }, click: this.clearSignatureCanvas.bind(this) },
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.closeSignaturePanel.bind(this) },
                    // eslint-disable-next-line max-len
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Create'), isPrimary: true, disabled: true, cssClass: 'e-pv-createbtn' }, click: this.addSignatureInPage.bind(this) }
                ];
                this.signatureDialog.appendTo(dialogDiv);
                this.signaturetype = 'Draw';
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
        if (!this.pdfViewerBase.isToolbarSignClicked && this.isSaveSignature) {
            this.outputString = this.saveSignatureString;
            // eslint-disable-next-line
            let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
            // eslint-disable-next-line
            let context: any = canvas.getContext('2d');
            // eslint-disable-next-line
            let image: any = new Image();
            image.onload = (): void => {
                context.drawImage(image, 0, 0);
            };
            image.src = this.signatureImageString;
            // eslint-disable-next-line
            let checkbox: any = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
            if (checkbox) {
                checkbox.checked = true;
            }
            this.enableCreateButton(false);
            this.enableClearbutton(false);
        }
    }
    private saveSignatureImage(): void {
        // eslint-disable-next-line
        let checkbox: any = document.getElementById(this.pdfViewer.element.id + '_signatureCheckBox');
        if (checkbox && checkbox.checked) {
            if (this.outputString !== '') {
                this.isSaveSignature = true;
                this.saveSignatureString = this.outputString;
                // eslint-disable-next-line
                let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
                this.saveImageString = canvas.toDataURL();
                this.signatureImageString = this.saveImageString;
            }
        } else {
            if (this.isSaveSignature) {
                this.isSaveSignature = false;
                this.saveSignatureString = '';
                this.saveImageString = '';
                this.signatureImageString = '';
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
            // eslint-disable-next-line
            let signatureBounds: any = this.pdfViewer.formFieldsModule.updateSignatureAspectRatio(this.outputString, true);
            // eslint-disable-next-line
            let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
            this.saveImageString = canvas.toDataURL();
            this.signatureImageString = this.saveImageString;
            annot = {
                // eslint-disable-next-line max-len
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: signatureBounds, pageIndex: pageIndex, data: this.outputString,
                shapeAnnotationType: 'HandWrittenSignature', opacity: opacity, strokeColor: strokeColor, thickness: thickness, signatureName: annotationName
            };
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
            this.pdfViewerBase.currentSignatureAnnot = annot;
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
                } else if (type[0] === 'Type') {
                    this.typeAddSignature();
                    isSignatureAdded = true;
                }
            }
            if (!isSignatureAdded) {
                // eslint-disable-next-line
                let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
                this.saveImageString = canvas.toDataURL();
                if (checkbox.checked) {
                    this.isSaveSignature = true;
                    this.saveSignatureString = this.outputString;
                } else {
                    this.isSaveSignature = false;
                    this.saveSignatureString = '';
                }
                this.signatureImageString = this.saveImageString;
                this.pdfViewer.formFieldsModule.drawSignature();
                isSignatureAdded = true;
            }
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
    }
    private typeAddSignature(): void {
        if (this.pdfViewerBase.isToolbarSignClicked) {
            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
            // eslint-disable-next-line
            let annot: any;
            const annotationName: string = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            let currentLeft: number = 0;
            let currentTop: number = 0;
            const currentHeight: number = parseFloat(this.signHeight);
            const currentWidth: number = parseFloat(this.signWidth);
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
                }, pageIndex: pageIndex, dynamicText: inputValue, shapeAnnotationType: 'TypeText',
                fontFamily: this.signfont, signatureName: annotationName
            };
            this.pdfViewerBase.currentSignatureAnnot = annot;
            this.hideSignaturePanel();
            this.pdfViewerBase.isToolbarSignClicked = false;
        } else {
            this.pdfViewer.formFieldsModule.drawSignature('Type');
            this.hideSignaturePanel();
        }
    }
    private imageAddSignature(): void {
        this.pdfViewer.formFieldsModule.drawSignature('Image');
        this.hideSignaturePanel();
    }

    /**
     * @private
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
                let fontElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_font_signature'+ i);
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
                let fontElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_font_signature'+ i);
                if (fontElement) {
                    fontElement.style.borderColor = '';
                }
            }
            eventTarget.style.borderColor = 'red';
            this.outputString = eventTarget.textContent;
            this.fontName = eventTarget.style.fontFamily;
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
        const appearanceDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'Signature_appearance', className: 'e-pv-signature-apperance' });
        // eslint-disable-next-line max-len
        const canvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_signatureCanvas_', className: 'e-pv-signature-canvas' }) as HTMLCanvasElement;
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
        // eslint-disable-next-line
        let checkBoxObj: any;
        if (!this.pdfViewer.hideSaveSignature) {
            // eslint-disable-next-line
            let input: any = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'checkbox';
            appearanceDiv.appendChild(input);
            checkBoxObj = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Save Signature'), disabled: false, checked: false });
            checkBoxObj.appendTo(input);
        }
        if (this.isSaveSignature) {
            checkBoxObj.checked = true;
        }
        if (!this.pdfViewerBase.isToolbarSignClicked) {
            // eslint-disable-next-line
            let typeDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'type_appearance', className: 'e-pv-signature-apperance' });
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
            let fontDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_font_appearance' });
            fontDiv.style.width = '715px';
            fontDiv.style.height = '270px';
            fontDiv.style.border = '1px dotted #bdbdbd';
            fontDiv.style.backgroundColor = 'white';
            typeDiv.appendChild(fontDiv);
            // eslint-disable-next-line
            let tab: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'Signature_tab' });
            const uploadDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'upload_appearance' });
            uploadDiv.style.width = '715px';
            uploadDiv.style.height = '335px';
            uploadDiv.style.border = '1px dotted #bdbdbd';
            uploadDiv.style.backgroundColor = 'white';
            // eslint-disable-next-line
            let button: any = document.createElement('div');
            button.id = this.pdfViewer.element.id + '_e-pv-upload-button';
            uploadDiv.appendChild(button);
            // eslint-disable-next-line
            let uploadButton: any = new Button({ cssClass: 'e-pv-sign-upload', content: this.pdfViewer.localeObj.getConstant('Browse Signature Image') });
            uploadButton.appendTo(button);
            uploadButton.element.style.position = 'absolute';
            uploadButton.element.style.left = ((parseFloat(uploadDiv.style.width) / 2) - 50) + 'px';
            uploadButton.element.style.top = parseFloat(uploadDiv.style.height) / 2 + 'px';
            // eslint-disable-next-line max-len
            const uploadCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_signatureuploadCanvas_', className: 'e-pv-signature-uploadcanvas' }) as HTMLCanvasElement;
            if (this.pdfViewer.element.offsetWidth > 750) {
                uploadCanvas.width = 715;
                uploadCanvas.style.width = '715px';
            } else {
                uploadCanvas.width = this.pdfViewer.element.offsetWidth - 35;
                uploadCanvas.style.width = canvas.width + 'px';
            }
            uploadCanvas.height = 335;
            uploadCanvas.style.height = '335px';
            uploadCanvas.style.border = '1px dotted #bdbdbd';
            uploadCanvas.style.backgroundColor = 'white';
            uploadCanvas.style.zIndex = '0';
            uploadDiv.appendChild(uploadCanvas);
            // eslint-disable-next-line max-len
            this.signfontStyle = [{FontName: 'Helvetica'}, { FontName: 'Times New Roman' }, { FontName: 'Courier' }, { FontName: 'Symbol' }];
            // eslint-disable-next-line
            let fontSignature: any = [];
            for (let i: number = 0; i < this.signfontStyle.length; i++) {
                fontSignature[i] = document.createElement('div');
                fontSignature[i].id = '_font_signature' + i + '';
                fontSignature[i].classList.add('e-pv-font-sign');
            }
            this.fontsign = fontSignature;
            // eslint-disable-next-line
            let proxy: any = this;
            // eslint-disable-next-line
            this.tabObj = new Tab({
                selected: (args: SelectEventArgs): void => {
                    proxy.handleSelectEvent(args);
                },
                items: [
                    {
                        header: { 'text': this.pdfViewer.localeObj.getConstant('Draw-hand Signature') },
                        content: appearanceDiv
                    },
                    {
                        header: { 'text': this.pdfViewer.localeObj.getConstant('Type Signature') },
                        content: typeDiv
                    },
                    {
                        header: { 'text': this.pdfViewer.localeObj.getConstant('Upload Signature') },
                        content: uploadDiv
                    }
                ]
            });
            this.tabObj.appendTo(tab);
            return tab;
        } else {
            return appearanceDiv;
        }
    }
    private handleSelectEvent(e: SelectEventArgs): void {
        // eslint-disable-next-line
        let checkbox: any = document.getElementById('checkbox');
        if (checkbox && checkbox.checked) {
            if (e.previousIndex === 0 && this.outputString !== '') {
                this.isSaveSignature = true;
                this.saveSignatureString = this.outputString;
                // eslint-disable-next-line
                let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
                this.saveImageString = canvas.toDataURL();
                this.signatureImageString = this.saveImageString;
            }
        } else {
            if (this.isSaveSignature) {
                this.isSaveSignature = false;
                this.saveSignatureString = '';
                this.saveImageString = '';
                this.signatureImageString = '';
            }
            this.clearSignatureCanvas();
        }
        // eslint-disable-next-line
        if (e.selectedIndex === 0) {
            this.signaturetype = 'Draw';
            if (this.isSaveSignature) {
                this.enableCreateButton(false);
            }
        } else if (e.selectedIndex === 1) {
            this.signaturetype = 'Type';
            // eslint-disable-next-line
            let textBox: any = document.getElementById(this.pdfViewer.element.id + '_e-pv-Signtext-box');
            textBox.addEventListener('input', this.renderSignatureText.bind(this));
            this.enableCreateButton(true);
        } else if (e.selectedIndex === 2) {
            this.signaturetype = 'Image';
            this.enableCreateButton(true);
            // eslint-disable-next-line
            let signbutton: any = document.getElementById(this.pdfViewer.element.id + '_e-pv-upload-button');
            signbutton.addEventListener('click', this.uploadSignatureImage.bind(this));
        }
    }
    private uploadSignatureImage(): void {
        // eslint-disable-next-line
        let signImage: any = createElement('input', { id: this.pdfViewer.element.id + '_signElement', attrs: { 'type': 'file' } });
        signImage.setAttribute('accept', '.jpg,.jpeg');
        signImage.style.position = 'absolute';
        signImage.style.left = '0px';
        signImage.style.top = '0px';
        signImage.style.visibility = 'hidden';
        document.body.appendChild(signImage);
        signImage.click();
        signImage.addEventListener('change', this.addStampImage);
        document.body.removeChild(signImage);
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
                        this.outputString = image.src;
                    };
                    image.src = e.currentTarget.result;
                };
                reader.readAsDataURL(uploadedFile);
            }
        }
    };
    private renderSignatureText(): void {
        // eslint-disable-next-line
        let fontDiv: any = document.getElementById(this.pdfViewer.element.id + '_font_appearance');
        // eslint-disable-next-line
        let textBox: any = document.getElementById(this.pdfViewer.element.id + '_e-pv-Signtext-box');
        for (let i: number = 0; i < this.signfontStyle.length; i++) {
            this.fontsign[i].innerHTML = textBox.value;
            this.fontsign[i].style.fontFamily = this.signfontStyle[i].FontName;
            fontDiv.appendChild(this.fontsign[i]);
        }
        for (let i: number = 0; i < this.signfontStyle.length; i++) {
            // eslint-disable-next-line
            let clickSign: any = document.getElementById('_font_signature' + i + '');
            clickSign.addEventListener('click', this.typeSignatureclick.bind(this));
        }
        this.enableClearbutton(false);
    }
    private typeSignatureclick(): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        // eslint-disable-next-line
        let createButton: any = document.getElementsByClassName('e-pv-createbtn')[0];
        createButton.disabled = false;
        eventTarget.style.borderColor = 'red';
        this.outputString = eventTarget.textContent;
        this.fontName = eventTarget.style.fontFamily;
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
        // eslint-disable-next-line
        let newCanvas: any = document.createElement('canvas');
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
        // eslint-disable-next-line
        let context: any = newCanvas.getContext('2d');
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
        // eslint-disable-next-line
        let imageString: any = newCanvas.toDataURL();
        if (bounds) {
            this.saveImageString = imageString;
        } else {
            // eslint-disable-next-line
            let signCollection: any = {};
            signCollection['sign_' + this.pdfViewerBase.imageCount] = this.outputString;
            this.outputcollection.push(signCollection);
            // eslint-disable-next-line
            let signature: any = {};
            signature['sign_' + this.pdfViewerBase.imageCount] = imageString;
            this.signaturecollection.push(signature);
            this.pdfViewerBase.imageCount++;
        }
    }

    /**
     * @private
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
            let signatureBounds: any = this.pdfViewer.formFieldsModule.updateSignatureAspectRatio(keyString, true);
            // eslint-disable-next-line max-len
            currentWidth = signatureBounds.width ? signatureBounds.width : currentWidth;
            // eslint-disable-next-line max-len
            currentHeight = signatureBounds.height ? signatureBounds.height : currentHeight;
            annot = {
                // eslint-disable-next-line max-len
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: keyString,
                // eslint-disable-next-line max-len
                shapeAnnotationType: 'HandWrittenSignature', opacity: opacity, strokeColor: strokeColor, thickness: thickness, signatureName: annotationName
            };

            this.pdfViewerBase.currentSignatureAnnot = annot;
            this.pdfViewerBase.isAddedSignClicked = false;
        } else {
            this.pdfViewer.formFieldsModule.drawSignature();

        }
    }

    /**
     * @private
     */
    public updateCanvasSize(): void {
        // eslint-disable-next-line
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
            const element: HTMLElement = event.target as HTMLElement;
            // eslint-disable-next-line
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
    }
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
     */
    public clearSignatureCanvas(): void {
        this.outputString = '';
        this.newObject = [];
        // eslint-disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // eslint-disable-next-line
        if (canvas) {
            // eslint-disable-next-line
            let context: any = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        // eslint-disable-next-line
        let imageCanvas: any = document.getElementById(this.pdfViewer.element.id + '_signatureuploadCanvas_');
        if (imageCanvas) {
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
        if (fontdiv && textbox) {
            textbox.value = '';
            if (!isBlazor()) {
                fontdiv.innerHTML = '';
            }
        }
        this.enableCreateButton(true);
    }
    /**
     * @private
     */
    public closeSignaturePanel(): void {
        this.clearSignatureCanvas();
        if (!isBlazor()) {
            this.signatureDialog.hide();
        }
        this.pdfViewerBase.isToolbarSignClicked = false;
    }
    /**
     * @private
     */
    public saveSignature(): string {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
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
                        const strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        // eslint-disable-next-line max-len
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        // eslint-disable-next-line
                        let collectionData: any = processPathData(pageAnnotationObject.annotations[z].data);
                        // eslint-disable-next-line
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
     * @param left
     * @param top
     * @param left
     * @param top
     * @private
     */
    public renderSignature(left: number, top: number): void {
        let annot: PdfAnnotationBaseModel;
        // eslint-disable-next-line
        let currentAnnotation: any = this.pdfViewerBase.currentSignatureAnnot;
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        if (currentAnnotation) {
            annot = {
                // eslint-disable-next-line max-len
                id: currentAnnotation.id, bounds: { x: left, y: top, width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height }, pageIndex: currentAnnotation.pageIndex, data: currentAnnotation.data,
                shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.opacity, strokeColor: currentAnnotation.strokeColor, thickness: currentAnnotation.thickness, signatureName: annotationName
            };
            this.pdfViewer.add(annot as PdfAnnotationBase);
            // eslint-disable-next-line
            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
            // eslint-disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, currentAnnotation.pageIndex);
            this.pdfViewerBase.signatureAdded = true;
            // eslint-disable-next-line max-len
            this.pdfViewer.fireSignatureAdd(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType, currentAnnotation.bounds, currentAnnotation.opacity, currentAnnotation.strokeColor, currentAnnotation.thickness);
            this.storeSignatureData(currentAnnotation.pageIndex, annot);
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.signatureCount++;
        }
    }
    /**
     * @param annotationCollection
     * @param pageIndex
     * @param isImport
     * @param annotationCollection
     * @param pageIndex
     * @param isImport
     * @param annotationCollection
     * @param pageIndex
     * @param isImport
     * @private
     */
    // eslint-disable-next-line
    public renderExistingSignature(annotationCollection: any, pageIndex: number, isImport: boolean): void {
        let annot: PdfAnnotationBaseModel;
        for (let n: number = 0; n < annotationCollection.length; n++) {
            // eslint-disable-next-line
            let currentAnnotation: any = annotationCollection[n];
            // eslint-disable-next-line
            if (currentAnnotation) {
                // eslint-disable-next-line
                let bounds: any = currentAnnotation.Bounds;
                const currentLeft: number = bounds.X;
                const currentTop: number = bounds.Y;
                const currentWidth: number = bounds.Width;
                const currentHeight: number = bounds.Height;
                // eslint-disable-next-line
                let data: any = currentAnnotation.PathData;
                if (isImport) {
                    if (currentAnnotation.IsSignature) {
                        data = currentAnnotation.PathData;
                    } else {
                        data = getPathString(JSON.parse(currentAnnotation.PathData));
                    }
                }
                annot = {
                    // eslint-disable-next-line max-len
                    id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                    shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, signatureName: currentAnnotation.SignatureName
                };
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
                }
            }
        }
    }

    /**
     * @param pageNumber
     * @param annotations
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
            id: annotations.id, bounds: { left: left, top: top, width: annotations.bounds.width, height: annotations.bounds.height }, shapeAnnotationType: 'Signature', opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data, signatureName: annotations.signatureName
        };
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
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
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
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        }
    }

    /**
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @param isSignatureEdited
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @param isSignatureEdited
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @param isSignatureEdited
     * @private
     */
    // eslint-disable-next-line
    public modifySignatureCollection(property: string, pageNumber: number, annotationBase: any, isSignatureEdited?: boolean): ISignAnnotation {
        this.pdfViewer.isDocumentEdited = true;
        let currentAnnotObject: ISignAnnotation = null;
        const pageAnnotations: ISignAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // eslint-disable-next-line max-len
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
     * @param annotation
     * @param pageNumber
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
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
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
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sign');
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        }
    }
    /**
     * @param isShow
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
     */
    public destroy(): void {
        window.sessionStorage.removeItem('_annotations_sign');
    }
}
