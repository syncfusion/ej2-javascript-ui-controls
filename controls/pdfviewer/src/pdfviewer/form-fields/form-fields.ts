/* eslint-disable */
import { PdfViewer, FormFieldModel, FormFieldType } from '../index';
import { PdfViewerBase } from '../index';
import { createElement, Browser, isBlazor } from '@syncfusion/ej2-base';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { splitArrayCollection, processPathData } from '@syncfusion/ej2-drawings';


/**
 * The `FormFields` module is to render formfields in the PDF document.
 *
 * @hidden
 */
export class FormFields {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private maxTabIndex: number;
    private minTabIndex: number;
    // eslint-disable-next-line
    private maintainTabIndex: any = {};
    // eslint-disable-next-line
    private maintanMinTabindex: any = {};
    private isSignatureField: boolean = false;
    private isKeyDownCheck: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public readOnlyCollection: any = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public currentTarget: any;
    /**
     * @private
     */
    // eslint-disable-next-line
    public nonFillableFields: any = {};
    private isSignatureRendered: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public signatureFieldCollection: any = [];
    // eslint-disable-next-line
    private data: any;
    // eslint-disable-next-line
    private formFieldsData: any;
    private rotateAngle: number;

    /**
     * @param viewer
     * @param base
     * @param viewer
     * @param base
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @param pageIndex
     * @private
     */
    public renderFormFields(pageIndex: number): void {
        this.maxTabIndex = 0;
        this.minTabIndex = -1;
        // eslint-disable-next-line
        this.data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        if (this.data !== null) {
            // eslint-disable-next-line
            this.formFieldsData = JSON.parse(this.data);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            if (this.formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                for (let i: number = 0; i < this.formFieldsData.length; i++) {
                    // eslint-disable-next-line
                    let currentData: any = this.formFieldsData[i];
                    // eslint-disable-next-line
                    if (parseFloat(currentData['PageIndex']) == pageIndex) {
                        // eslint-disable-next-line
                        let inputField: any = this.createFormFields(currentData, pageIndex, i);
                        if (inputField) {
                            // eslint-disable-next-line
                            let divElement: any = this.createParentElement(currentData, pageIndex);
                            // eslint-disable-next-line
                            let bounds: any = currentData['LineBounds'];
                            // eslint-disable-next-line
                            let font: any = currentData['Font'];
                            // eslint-disable-next-line
                            // eslint-disable-next-line
                            this.applyPosition(inputField, bounds, font, pageIndex, currentData['Rotation']);
                            inputField.InsertSpaces = currentData.InsertSpaces;
                            if (inputField.InsertSpaces) {
                                // eslint-disable-next-line
                                let font: number = ((parseInt(inputField.style.width) / inputField.maxLength) - (parseInt(inputField.style.fontSize) / 2)) - 0.5;
                                // eslint-disable-next-line
                                inputField.style.letterSpacing = '' + font + 'px';
                                inputField.style.fontFamily = 'monospace';
                            }
                            // eslint-disable-next-line
                            currentData['uniqueID'] = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + i;
                            this.applyCommonProperties(inputField, pageIndex, i, currentData);
                            this.checkIsReadonly(currentData, inputField);
                            this.applyTabIndex(currentData, inputField, pageIndex);
                            this.checkIsRequiredField(currentData, inputField);
                            this.applyDefaultColor(inputField);
                            // eslint-disable-next-line
                            if (currentData['Rotation'] === 0) {
                                const rotationAngle: number = this.getAngle(pageIndex);
                                if (divElement) {
                                    divElement.style.transform = 'rotate(' + rotationAngle + 'deg)';
                                } else {
                                    inputField.style.transform = 'rotate(' + rotationAngle + 'deg)';
                                }
                            }
                            if (divElement) {
                                divElement.appendChild(inputField);
                                textLayer.appendChild(divElement);
                            } else {
                                inputField.style.position = 'absolute';
                                textLayer.appendChild(inputField);
                            }
                            inputField.addEventListener('focus', this.focusFormFields.bind(this));
                            inputField.addEventListener('blur', this.blurFormFields.bind(this));
                            inputField.addEventListener('click', this.updateFormFields.bind(this));
                            inputField.addEventListener('change', this.changeFormFields.bind(this));
                            inputField.addEventListener('keydown', this.updateFormFieldsValue.bind(this));
                            inputField.addEventListener('keyup', this.updateSameFieldsValue.bind(this));
                        }
                    }
                }
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(this.formFieldsData));
            }
        }
    }
    // eslint-disable-next-line
    private createParentElement(data: any, pageIndex: number): any {
        // eslint-disable-next-line
        let divElement: any;
        // eslint-disable-next-line
        if (data['Name'] === 'Textbox' || data['Name'] === 'Password') {
            divElement = document.createElement('div');
            divElement.style.background = 'white';
            if (data.InsertSpaces) {
                divElement.style.background = 'transparent';
            }
            // eslint-disable-next-line
            let bounds: any = data['LineBounds'];
            // eslint-disable-next-line
            let font: any = data['Font'];
            // eslint-disable-next-line
            divElement.style.position = 'absolute';
            // eslint-disable-next-line
            this.applyPosition(divElement, bounds, font, pageIndex, data['Rotation']);
        }
        return divElement;
    }
    private getAngle(pageIndex: number): number {
        // eslint-disable-next-line
        let angle: any = 0;
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
        if (pageDetails.rotation) {
            switch (pageDetails.rotation) {
            case 0:
                angle = 0;
                break;
            case 1:
                angle = 90;
                break;
            case 2:
                angle = 180;
                break;
            case 3:
                angle = 270;
                break;
            }
        }
        return angle;
    }
    public nextField(): void {
        this.signatureFieldNavigate(true);
    }
    public previousField(): void {
        this.signatureFieldNavigate(false);
    }
    private signatureFieldNavigate(nextSign: boolean): void {
        const isNextSignField: boolean = nextSign;
        // eslint-disable-next-line
        let signatureFields: any[] = this.signatureFieldCollection;
        if (signatureFields.length === 0) {
            signatureFields = this.getSignField();
        }
        // eslint-disable-next-line
        let currentField: any;
        if (this.currentTarget) {
            for (let i: number = 0; i < signatureFields.length; i++) {
                currentField = signatureFields[i];
                if (this.currentTarget.id === currentField.uniqueID) {
                    this.currentTarget = document.getElementById(currentField.uniqueID);
                    this.getSignatureIndex(i, signatureFields.length, isNextSignField);
                    break;
                }
            }
        } else {
            if (nextSign) {
                currentField = signatureFields[0];
                if (currentField.uniqueID) {
                    this.currentTarget = document.getElementById(currentField.uniqueID);
                    this.getSignatureIndex(0, signatureFields.length, isNextSignField, true);
                }
            }
        }
    }
    private getSignatureIndex(currentSignatureIndex: number, signatureCount: number, isNextSign: boolean, isFirstNavigate?: boolean): void {
        let signatureIndex: number = currentSignatureIndex;
        if (!isFirstNavigate) {
            if (isNextSign) {
                signatureIndex++;
            } else {
                signatureIndex--;
            }
        }
        if (signatureCount === 1) {
            this.renderSignatureField(0);
        } else {
            if (signatureIndex < signatureCount && signatureIndex >= 0) {
                this.renderSignatureField(signatureIndex);
            } else {
                if (isNextSign) {
                    if (signatureIndex >= signatureCount) {
                        this.renderSignatureField(0);
                    }
                } else {
                    if (signatureIndex <= 0) {
                        this.renderSignatureField(signatureCount - 1);
                    }
                }
            }
        }
    }
    private renderSignatureField(currentSignIndex: number): void {
        const curSignIndex: number = currentSignIndex;
        // eslint-disable-next-line
        let signatureFields: any = this.signatureFieldCollection;
        // eslint-disable-next-line
        let currentField: any;
        if (curSignIndex < signatureFields.length) {
            for (let i: number = 0; i < signatureFields.length; i++) {
                if (signatureFields[curSignIndex].uniqueID === signatureFields[i].uniqueID) {
                    const isRender: boolean = this.pdfViewer.annotationModule.findRenderPageList(signatureFields[i].PageIndex);
                    if (!isRender) {
                        this.pdfViewer.navigation.goToPage(signatureFields[i].PageIndex);
                    }
                    this.currentTarget = document.getElementById(signatureFields[i].uniqueID);
                    currentField = signatureFields[i];
                    break;
                }
            }
            if (this.currentTarget === null) {
                this.pdfViewer.navigation.goToPage(currentField.PageIndex);
                this.currentTarget = document.getElementById(currentField.uniqueID);
            }
            if (this.currentTarget) {
                if (this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature') {
                    document.getElementById(this.currentTarget.id).focus();
                    this.pdfViewer.select([this.currentTarget.id], null);
                } else if (this.currentTarget.className === 'e-pdfviewer-signatureformfields') {
                    document.getElementById(this.currentTarget.id).focus();
                }
            }
        }
    }

    /**
     * @private
     */
     public setFocus(id?: string): void {
        if (!id) {
            if (this.currentTarget) {
                document.getElementById(this.currentTarget.id).focus();
            }
        } else {
            this.removeFocus();
            let signatureElement: HTMLElement = document.getElementById(id);
            signatureElement.classList.add('e-pv-signature-focus');
        }
    }

    /**
     * @private
     */
    public removeFocus(): void {
        if (this.signatureFieldCollection) {
            // eslint-disable-next-line
            let signatureFields: any[] = this.signatureFieldCollection;
            if (signatureFields.length === 0) {
                signatureFields = this.getSignField();
            }
            for (let i: number = 0; i < this.signatureFieldCollection.length; i++) {
                let signatureElement: HTMLElement = document.getElementById(this.signatureFieldCollection[i].uniqueID);
                if (signatureElement) {
                    signatureElement.classList.remove('e-pv-signature-focus');
                }
            }
        }
    }

    // eslint-disable-next-line
    private getSignField(): any[] {
        // eslint-disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // eslint-disable-next-line
        let currentData: any;
        if (data !== null) {
            // eslint-disable-next-line
            let formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                currentData = formFieldsData[i];
                if (currentData.Name === 'SignatureField') {
                    // eslint-disable-next-line
                    currentData['uniqueID'] = this.pdfViewer.element.id + 'input_' + currentData.PageIndex + '_' + i;
                    this.signatureFieldCollection.push(formFieldsData[i]);
                }
            }
        }
        return this.signatureFieldCollection;
    }

    /**
     * @private
     */
    public formFieldCollections(): void {
        // eslint-disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        if (data !== null) {
            // eslint-disable-next-line
            let formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                // eslint-disable-next-line
                let currentData: any = formFieldsData[i];
                // eslint-disable-next-line
                let type: FormFieldType = currentData['Name'];
                if (currentData.Name !== 'ink') {
                    // eslint-disable-next-line
                    let formFieldCollection: FormFieldModel = { name: this.retriveFieldName(currentData), id: this.pdfViewer.element.id + 'input_' + parseFloat(currentData['PageIndex']) + '_' + i, isReadOnly: false, type: type, value: this.retriveCurrentValue(currentData), signatureType: [], fontName: '' };
                    this.pdfViewer.formFieldCollections.push(formFieldCollection);
                }
            }
        }
    }
    // eslint-disable-next-line
    public updateFormFieldValues(formFields: any): void {
        this.readOnlyCollection.push(formFields.id);
        if (formFields) {
            // eslint-disable-next-line
            let currentElement: any = document.getElementById(formFields.id);
            if (currentElement) {
                if (formFields.isReadOnly) {
                    currentElement.disabled = true;
                    currentElement.style.backgroundColor = '';
                    currentElement.style.cursor = 'default';
                } else {
                    if (currentElement.style.backgroundColor === '') {
                        currentElement.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
                    }
                    currentElement.disabled = false;
                    currentElement.style.cursor = '';
                }
            }
        }
    }
    /**
     * @param currentData
     * @private
     */
    // eslint-disable-next-line
    public retriveFieldName(currentData: any): string {
        // eslint-disable-next-line
        let currentField: any;
        // eslint-disable-next-line
        switch (currentData['Name']) {
        case 'Textbox':
        case 'Password':
        case 'SignatureField':
            currentField = currentData.FieldName;
            break;
        case 'RadioButton':
        case 'CheckBox':
            currentField = currentData.GroupName;
            break;
        case 'DropDown':
        case 'ListBox':
            currentField = currentData.Text;
            break;
        }
        return currentField;
    }
    // eslint-disable-next-line
    private retriveCurrentValue(currentData: any): string {
        // eslint-disable-next-line
        let currentField: any;
        // eslint-disable-next-line
        switch (currentData['Name']) {
        case 'Textbox':
        case 'Password':
            currentField = currentData.Text;
            break;
        case 'SignatureField':
            currentField = currentData.Value;
            break;
        case 'RadioButton':
        case 'CheckBox':
            currentField = currentData.Selected;
            break;
        case 'DropDown':
            currentField = currentData.SelectedValue;
            break;
        case 'ListBox':
            currentField = currentData.SelectedList;
            break;
        }
        return currentField;
    }
    // eslint-disable-next-line
    private getSignatureBounds(LineBounds: any, bounds: any, pageIndex: any): any {
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
        // eslint-disable-next-line
        let bound: any = 0;
        switch (pageDetails.rotation) {
        case 0:
            bound = bounds;
            break;
        case 1:
            bound = { x: bounds.x + LineBounds.Width + (bounds.width / 3.5), y: pageDetails.width - LineBounds.X + (bounds.height / 4) };
            break;
        case 2:
            bound = { x: pageDetails.width - bounds.x - bounds.width, y: pageDetails.height - bounds.y - bounds.height };
            break;
        case 3:
            bound = { x: bounds.y - (bounds.width / 2) + bounds.height, y: bounds.x + (bounds.width / 3) };
            break;
        }
        return bound;
    }
    /**
     * @private
     */
    // eslint-disable-next-line
    public downloadFormFieldsData(): any {
        // eslint-disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // eslint-disable-next-line
        let formFieldsData: any = JSON.parse(data);
        // eslint-disable-next-line
        let datas: any = {};
        if (formFieldsData) {
            for (let m: number = 0; m < formFieldsData.length; m++) {
                // eslint-disable-next-line
                let currentData: any = formFieldsData[m];
                if (currentData.Name === 'Textbox' || currentData.Name === 'Password' || currentData.Multiline) {
                    if (currentData.Text === '' || currentData.Text === null) {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.FieldName] = currentData.Text;
                    } else {
                        delete (this.nonFillableFields[currentData.FieldName]);
                    }
                    datas[currentData.FieldName] = currentData.Text;
                } else if (currentData.Name === 'RadioButton' && currentData.Selected) {
                    if (currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.GroupName] = currentData.Value;
                    } else {
                        delete (this.nonFillableFields[currentData.GroupName]);
                    }
                    datas[currentData.GroupName] = currentData.Value;
                } else if (currentData.Name === 'CheckBox') {
                    if (currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                    }
                    if (currentData.CheckboxIndex && currentData.Selected) {
                        datas[currentData.GroupName] = currentData.CheckboxIndex;
                    } else if (datas[currentData.GroupName] === undefined || datas[currentData.GroupName] === null) {
                        datas[currentData.GroupName] = currentData.Selected;
                    }
                } else if (currentData.Name === 'DropDown') {
                    if (currentData.SelectedValue === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.Text] = currentData.SelectedValue;
                    } else {
                        delete (this.nonFillableFields[currentData.Text]);
                    }
                    datas[currentData.Text] = currentData.SelectedValue;
                } else if (currentData.Name === 'ListBox') {
                    // eslint-disable-next-line
                    let childItems: any = currentData['TextList'];
                    const childItemsText: string[] = [];
                    for (let m: number = 0; m < currentData.SelectedList.length; m++) {
                        // eslint-disable-next-line
                        let currentElement: any = currentData.SelectedList[m];
                        childItemsText.push(childItems[currentElement]);
                    }
                    datas[currentData.Text] = JSON.stringify(childItemsText);
                } else if (currentData.Name === 'SignatureField') {
                    // eslint-disable-next-line
                    let collectionData: any = processPathData(currentData.Value);
                    // eslint-disable-next-line
                    let csData: any;
                    if (currentData.Value && currentData.Value !== '' && (currentData.Value.split('base64,')[1] || collectionData.length === 0)) {
                        csData = currentData.Value;
                        if (currentData.fontFamily) {
                            datas[currentData.FieldName + 'fontName'] = currentData.fontFamily;
                        } else if (currentData.Value.split('base64,')[1]) {
                            datas[currentData.FieldName + 'ImageData'] = true;
                        }
                    } else {
                        csData = splitArrayCollection(collectionData);
                    }
                    if (currentData.Value === null || currentData.Value === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.FieldName] = JSON.stringify(csData);
                    } else {
                        delete (this.nonFillableFields[currentData.FieldName]);
                    }
                    datas[currentData.FieldName] = JSON.stringify(csData);
                    if (currentData.Bounds) {
                        // eslint-disable-next-line
                        let bounds: any = this.getSignatureBounds(currentData.LineBounds, currentData.Bounds, currentData.PageIndex)
                        currentData.Bounds.x = bounds.x;
                        currentData.Bounds.y = bounds.y;
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(currentData.Bounds);
                    } else {
                        // eslint-disable-next-line
                        let lineBounds: any = currentData.LineBounds;
                        // eslint-disable-next-line
                        let bounds: any = { x: this.ConvertPointToPixel(lineBounds.X), y: this.ConvertPointToPixel(lineBounds.Y), width: this.ConvertPointToPixel(lineBounds.Width), height: this.ConvertPointToPixel(lineBounds.Height) };
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(bounds);
                    }
                }
            }
        }
        return (JSON.stringify(datas));
    }
    private focusFormFields(event: MouseEvent): void {
        // eslint-disable-next-line
        let currentTarget: any = event.target;
        // eslint-disable-next-line
        if (currentTarget && (currentTarget.className !== 'e-pdfviewer-signatureformfields' && currentTarget.className !== 'e-pdfviewer-signatureformfields e-pv-signature-focus')) {
            // eslint-disable-next-line
            let backgroundcolor: any = currentTarget.style.backgroundColor;
            // eslint-disable-next-line
            let currentIndex: any = backgroundcolor.lastIndexOf(',');
            // eslint-disable-next-line
            let currentColor: any = backgroundcolor.slice(0, currentIndex + 1) + 0 + ')';
            if (currentTarget.type === 'checkbox') {
                currentTarget.style.webkitAppearance = '';
            }
            currentTarget.style.backgroundColor = currentColor;
        } else if (currentTarget) {
            // eslint-disable-next-line
            if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus' ) {
                this.setFocus(this.currentTarget.id);
            }
        }
    }
    private blurFormFields(event: MouseEvent): void {
        // eslint-disable-next-line
        let currentTarget: any = event.target;
        if (currentTarget.InsertSpaces && this.isKeyDownCheck) {
            // eslint-disable-next-line
            let font: number = parseInt(currentTarget.style.width) - (parseInt(currentTarget.style.height) / 2);
            currentTarget.style.width = '' + font + 'px';
            this.isKeyDownCheck = false;
        }
        if (currentTarget.type === 'checkbox') {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.checked);
        } else {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.value);
        }
        // eslint-disable-next-line
        let backgroundcolor: any = currentTarget.style.backgroundColor;
        // eslint-disable-next-line
        let currentIndex: any = backgroundcolor.lastIndexOf(',');
        // eslint-disable-next-line
        let currentColor: any = backgroundcolor.slice(0, currentIndex + 1) + 0.2 + ')';
        if ((currentTarget.type === 'checkbox') && !currentTarget.checked) {
            currentTarget.style.webkitAppearance = 'none';
        } else {
            currentTarget.style.webkitAppearance = '';
        }
        currentTarget.style.backgroundColor = currentColor;
    }
    private updateFormFields(event: MouseEvent): void {
        // eslint-disable-next-line
        let currentTarget: any = event.target;
        if (currentTarget.className === 'e-pdfviewer-ListBox') {
            currentTarget = currentTarget.parentElement;
            this.updateDataInSession(currentTarget);
        } else if (currentTarget.className === 'e-pdfviewer-signatureformfields') {
            this.currentTarget = currentTarget;
        } else if (currentTarget.className === 'e-pv-buttonItem' || currentTarget.type === 'button') {
            this.pdfViewer.fireButtonFieldClickEvent(currentTarget.value, currentTarget.name, currentTarget.id);
        }
        for (let m: number = 0; m < this.pdfViewer.formFieldCollections.length; m++) {
            if (currentTarget.id === this.pdfViewer.formFieldCollections[m].id) {
                this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', this.pdfViewer.formFieldCollections[m]);
                // eslint-disable-next-line
                if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus') {
                    this.setFocus(this.currentTarget.id);
                }
            }
        }
    }
    /**
     * @param signatureType
     * @param value
     * @param target
     * @param fontname
     * @param signatureType
     * @param value
     * @param target
     * @param fontname
     * @private
     */
    // eslint-disable-next-line
    public drawSignature(signatureType?: string, value?: string, target?: any, fontname?: string): void {
        let annot: PdfAnnotationBaseModel;
        // eslint-disable-next-line
        let bounds: any;
        // eslint-disable-next-line
        let currentField: any = this.currentTarget ? this.currentTarget : target;
        const currentValue: string = value ? value : this.pdfViewerBase.signatureModule.outputString;
        let currentFont: string = fontname ? fontname : this.pdfViewerBase.signatureModule.fontName;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        const currentWidth: number = parseFloat(currentField.style.width) / zoomvalue;
        const currentHeight: number = parseFloat(currentField.style.height) / zoomvalue;
        let currentLeft: number = parseFloat(currentField.style.left) / zoomvalue;
        let currentTop: number = parseFloat(currentField.style.top) / zoomvalue;
        const currentIndex: number = parseFloat(currentField.id.split('_')[2]);
        const currentPage: number = parseFloat(currentField.id.split('_')[1]);
        let signString: string = this.pdfViewerBase.signatureModule.saveImageString;
        let signatureFontFamily: string;
        let signatureFontSize: number;
        let rotateAngle: number = this.getAngle(currentPage);
        if (signatureType === 'Type') {
            if (!currentFont) {
                currentFont = 'Helvetica';
            }
            // eslint-disable-next-line
            bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, currentWidth, currentHeight);
            annot = {
                // eslint-disable-next-line max-len
                id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle:  this.rotateAngle, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: currentFont, fontSize: (bounds.height / 2)
            };
            signString = annot.data;
            signatureFontFamily = annot.fontFamily;
            signatureFontSize = annot.fontSize;
        } else if (signatureType === 'Image') {
            // eslint-disable-next-line
            bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, currentWidth, currentHeight);
            annot = {
                // eslint-disable-next-line max-len
                id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle:  this.rotateAngle, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
            };
            signString = annot.data;
        } else {
            if ((currentValue.indexOf('base64')) !== -1) {
                // eslint-disable-next-line
                bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, currentWidth, currentHeight);
                annot = {
                    // eslint-disable-next-line max-len
                    id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                    shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: this.rotateAngle, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
                signString = annot.data;
            } else {
                // eslint-disable-next-line
                if (this.pdfViewer.signatureFitMode === 'Default') {
                    // eslint-disable-next-line
                    let signatureBounds: any = this.updateSignatureAspectRatio(currentValue, false, currentField);
                    // eslint-disable-next-line
                    bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, signatureBounds.width, signatureBounds.height, true);
                    bounds.x = bounds.x + signatureBounds.left;
                    bounds.y = bounds.y + signatureBounds.top;
                } else {
                    bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, currentWidth, currentHeight);
                }
                annot = {
                    // eslint-disable-next-line max-len
                    id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                    shapeAnnotationType: 'Path', opacity: 1, rotateAngle:  this.rotateAngle, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            }
        }
        this.pdfViewer.add(annot as PdfAnnotationBase);
        if (annot && annot.shapeAnnotationType === 'Path' && currentValue !== '') {
            // eslint-disable-next-line
            let position: any = { currentHeight: currentHeight, currentWidth: currentWidth, currentLeft: currentLeft, currentTop: currentTop };
            this.pdfViewerBase.signatureModule.addSignatureCollection(bounds, position);
            signString = this.pdfViewerBase.signatureModule.saveImageString;
        }
        // eslint-disable-next-line
        let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
        // eslint-disable-next-line
        this.pdfViewer.renderDrawing(canvass as any, currentPage);
        this.pdfViewerBase.signatureModule.showSignatureDialog(false);
        if (currentField.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus') {
            currentField.className = 'e-pdfviewer-signatureformfields-signature e-pv-signature-focus';
        } else {
            currentField.className = 'e-pdfviewer-signatureformfields-signature';
        }
        this.updateDataInSession(currentField, annot.data, annot.bounds, signatureFontFamily, signatureFontSize);
        currentField.style.pointerEvents = 'none';
        this.pdfViewerBase.signatureModule.hideSignaturePanel();
        // eslint-disable-next-line
        this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType, annot.bounds, annot.opacity, null, null, signString);
        this.pdfViewer.fireFocusOutFormField(currentField.name, currentValue);
    }
    // eslint-disable-next-line
    private getSignBounds(currentIndex: number,rotateAngle: number, currentPage: number, zoomvalue: number, currentLeft: number, currentTop: number, currentWidth: number, currentHeight: number, isDraw?: boolean): any {
        // eslint-disable-next-line
        let bounds: any;
        let signIcon: HTMLElement = document.getElementById('signIcon' + currentPage + '_' + currentIndex);
        let signLeft: number = parseFloat(signIcon.style.left) * zoomvalue;
        let difference: number = (currentLeft * zoomvalue) - (signLeft / zoomvalue);
        if (rotateAngle === 90 || rotateAngle === 270) {
            this.rotateAngle = 0;
            if (isDraw) {
                return bounds = { x: currentLeft - (difference/zoomvalue) - zoomvalue, y: currentTop + (difference/zoomvalue) + zoomvalue, width: currentWidth, height: currentHeight };
            }
            else {
                return bounds = { x: currentLeft - (difference/zoomvalue) - zoomvalue, y: currentTop + (difference/zoomvalue) + zoomvalue, width: currentHeight, height: currentWidth };
            }
        }
        else {
            this.rotateAngle = 0;
            return bounds = { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight };
        }
    }
    // eslint-disable-next-line
    private updateSameFieldsValue(event: any) {
        if (this.formFieldsData) {
            for (let i: number = 0; i < this.formFieldsData.length; i++) {
                // eslint-disable-next-line
                let currentField: any = this.formFieldsData[i];
                if (event.target.name === currentField.FieldName && event.target.id !== currentField.uniqueID) {
                    // eslint-disable-next-line
                    let currentTarget: any = document.getElementById(this.formFieldsData[i].uniqueID);
                    if (currentTarget) {
                        currentTarget.value = event.target.value;
                    } else {
                        currentField.Text = event.target.value;
                        window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(this.formFieldsData));
                    }
                }
            }
        }
    }

    private updateFormFieldsValue(event: MouseEvent | KeyboardEvent): void {
        // eslint-disable-next-line
        let currentTarget: any = event.target;
        if (currentTarget.InsertSpaces && !this.isKeyDownCheck) {
            // eslint-disable-next-line
            let font: number = parseInt(currentTarget.style.width) + (parseInt(currentTarget.style.height) / 2);
            currentTarget.style.width = '' + font + 'px';
            this.isKeyDownCheck = true;
        }
        if (event.which === 9 && currentTarget && currentTarget.className === 'e-pdfviewer-formFields') {
            // eslint-disable-next-line
            let id: any = currentTarget.id.split('input_')[1].split('_')[0];
            if (this.maintainTabIndex[id] === currentTarget.tabIndex) {
                // eslint-disable-next-line
                let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (parseInt(id) + 1));
                if (textLayer) {
                    // eslint-disable-next-line
                    let currentFields: any = textLayer.getElementsByClassName('e-pdfviewer-formFields');
                    if (currentFields && currentFields.length > 0) {
                        currentFields[0].focus();
                        event.preventDefault();
                    }
                } else {
                    const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + 0);
                    // eslint-disable-next-line
                    let currentFields: any = textLayer.getElementsByClassName('e-pdfviewer-formFields');
                    for (let m: number = 0; m < currentFields.length; m++) {
                        if (currentFields[m].tabIndex === this.maintanMinTabindex['0']) {
                            currentFields[m].focus();
                            event.preventDefault();
                            break;
                        }
                    }
                }
            } else {
                // eslint-disable-next-line
                let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + parseInt(id));
                // eslint-disable-next-line
                let currentFields: any = textLayer.getElementsByClassName('e-pdfviewer-formFields');
                let istabindexed: boolean = true;
                for (let m: number = 0; m < currentFields.length; m++) {
                    istabindexed = false;
                    if (currentFields[m].tabIndex === (currentTarget.tabIndex + 1)) {
                        currentFields[m].focus();
                        istabindexed = true;
                        event.preventDefault();
                        break;
                    }
                }
                let tabindex: number = currentTarget.tabIndex + 1;
                while (!istabindexed) {
                    for (let l: number = 0; l < currentFields.length; l++) {
                        istabindexed = false;
                        if (currentFields[l].tabIndex === (tabindex)) {
                            currentFields[l].focus();
                            istabindexed = true;
                            event.preventDefault();
                            break;
                        }
                    }
                    if (this.maintainTabIndex[id] === tabindex) {
                        istabindexed = true;
                    }
                    tabindex = tabindex + 1;
                }
            }
        }
        if ((event.currentTarget as any).classList.contains('e-pdfviewer-signatureformfields') ||
            (event.currentTarget as any).classList.contains('e-pdfviewer-signatureformfields-signature')) {
            if ((event as KeyboardEvent).key === 'Enter') {
                // eslint-disable-next-line
                let currentTarget: any = event.target;
                for (let m: number = 0; m < this.pdfViewer.formFieldCollections.length; m++) {
                    if (currentTarget.id === this.pdfViewer.formFieldCollections[m].id) {
                        this.setFocus(currentTarget.id);
                        this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', this.pdfViewer.formFieldCollections[m]);
                    }
                }
            } else {
                event.preventDefault();
            }
        }
    }
    private changeFormFields(event: MouseEvent): void {
        // eslint-disable-next-line
        let currentTarget: any = event.target;
        this.updateDataInSession(currentTarget);
    }
    /**
     * @param data
     * @param isSignature
     * @param currentField
     * @param data
     * @param isSignature
     * @param currentField
     * @param data
     * @param isSignature
     * @param currentField
     * @private
     */
    // eslint-disable-next-line
    public updateSignatureAspectRatio(data: any, isSignature?: boolean, currentField?: any): any {
        // eslint-disable-next-line
        let collectionData: any = processPathData(data);
        // eslint-disable-next-line
        let csData: any = splitArrayCollection(collectionData);
        let minimumX: number = -1;
        let minimumY: number = -1;
        let maximumX: number = -1;
        let maximumY: number = -1;
        const signatureCanvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        let signatureCavasWidth: number = 0;
        let signatureCavasHeight: number = 0;
        for (let m: number = 0; m < csData.length; m++) {
            // eslint-disable-next-line
            let val: any = csData[m];
            if (minimumX === -1) {
                // eslint-disable-next-line
                minimumX = parseFloat(val['x'].toString());
                // eslint-disable-next-line
                maximumX = parseFloat(val['x'].toString());
                // eslint-disable-next-line
                minimumY = parseFloat(val['y'].toString());
                // eslint-disable-next-line
                maximumY = parseFloat(val['y'].toString());
            } else {
                // eslint-disable-next-line
                let point1: number = parseFloat(val['x'].toString());
                // eslint-disable-next-line
                let point2: number = parseFloat(val['y'].toString());
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
        signatureCavasWidth = signatureCanvas ? signatureCanvas.clientWidth : 650;
        signatureCavasHeight = signatureCanvas ? signatureCanvas.clientHeight : 300;
        const newdifferenceX: number = maximumX - minimumX;
        const newdifferenceY: number = maximumY - minimumY;
        const ratioX: number = newdifferenceX / signatureCavasWidth;
        const ratioY: number = newdifferenceY / signatureCavasHeight;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        let currentWidth: number = 0;
        let currentHeight: number = 0;
        if (isSignature) {
            currentWidth = this.pdfViewer.handWrittenSignatureSettings.width ? this.pdfViewer.handWrittenSignatureSettings.width : 150;
            currentHeight = this.pdfViewer.handWrittenSignatureSettings.height ? this.pdfViewer.handWrittenSignatureSettings.height : 100;
        } else {
            if (currentField.style.width > currentField.style.height) {
                // eslint-disable-next-line
                currentWidth = parseFloat(currentField.style.height) / zoomvalue;
                // eslint-disable-next-line
                currentHeight = parseFloat(currentField.style.width) / zoomvalue;
            } else {
                // eslint-disable-next-line
                currentWidth = parseFloat(currentField.style.width) / zoomvalue;
                // eslint-disable-next-line
                currentHeight = parseFloat(currentField.style.height) / zoomvalue;
            }
        }
        let currentLeftDiff: number = (signatureCavasWidth - newdifferenceX) / 2;
        let currentTopDiff: number = (signatureCavasHeight - newdifferenceY) / 2;
        currentLeftDiff = (currentLeftDiff / signatureCavasWidth) * currentWidth;
        currentTopDiff = (currentTopDiff / signatureCavasHeight) * currentHeight;
        currentWidth = currentWidth * ratioX;
        currentHeight = currentHeight * ratioY;
        if (isSignature) {
            const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            const currentLeft: number = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            // eslint-disable-next-line max-len
            const currentTop: number = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            return { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight };
        } else {
            return { left: currentLeftDiff, top: currentTopDiff, width: currentWidth, height: currentHeight };
        }
    }
    /**
     * @param target
     * @param signaturePath
     * @param signatureBounds
     * @param signatureFontFamily
     * @param signatureFontSize
     * @param target
     * @param signaturePath
     * @param signatureBounds
     * @param signatureFontFamily
     * @param signatureFontSize
     * @param target
     * @param signaturePath
     * @param signatureBounds
     * @param signatureFontFamily
     * @param signatureFontSize
     * @param target
     * @param signaturePath
     * @param signatureBounds
     * @param signatureFontFamily
     * @param signatureFontSize
     * @param target
     * @param signaturePath
     * @param signatureBounds
     * @param signatureFontFamily
     * @param signatureFontSize
     * @private
     */
    // eslint-disable-next-line
    public updateDataInSession(target: any, signaturePath?: any, signatureBounds?: any, signatureFontFamily?: string, signatureFontSize?: Number): void {
        this.pdfViewer.isDocumentEdited = true;
        // eslint-disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // eslint-disable-next-line
        let FormFieldsData: any = JSON.parse(data);
        for (let m: number = 0; m < FormFieldsData.length; m++) {
            // eslint-disable-next-line
            let currentData: any = FormFieldsData[m];
            if (currentData.uniqueID === target.id) {
                if (target.type === 'text' || target.type === 'password' || target.type === 'textarea') {
                    const signField: HTMLElement = target as HTMLElement;
                    if (signField.classList.contains('e-pdfviewer-signatureformfields') || signField.classList.contains('e-pdfviewer-signatureformfields-signature')) {
                        currentData.Value = signaturePath;
                        if (signatureBounds) {
                            currentData.Bounds = signatureBounds;
                        }
                        if (signatureFontFamily) {
                            currentData.fontFamily = signatureFontFamily;
                            currentData.fontSize = signatureFontSize;
                        } else {
                            currentData.fontFamily = null;
                        }
                    } else {
                        currentData.Text = target.value;
                    }
                } else if (target.type === 'radio') {
                    for (let l: number = 0; l < FormFieldsData.length; l++) {
                        // eslint-disable-next-line
                        let currentType: any = FormFieldsData[l];
                        if (FormFieldsData[l].GroupName === target.name) {
                            FormFieldsData[l].Selected = false;
                        }
                    }
                    currentData.Selected = true;
                } else if (target.type === 'checkbox') {
                    for (let l: number = 0; l < FormFieldsData.length; l++) {
                        // eslint-disable-next-line
                        let currentType: any = FormFieldsData[l];
                        if (FormFieldsData[l].GroupName === target.name) {
                            FormFieldsData[l].Selected = false;
                            // eslint-disable-next-line
                            let currentTarget: any = document.getElementById(FormFieldsData[l].uniqueID);
                            if (currentTarget) {
                                if ((currentData.GroupName === target.name) && (currentData.uniqueID !== currentTarget.id)) {
                                    currentData.Selected = false;
                                    currentTarget.checked = false;
                                    currentTarget.style.webkitAppearance = 'none';
                                }
                            }
                        }
                    }
                    if (target.checked) {
                        currentData.Selected = true;
                    } else {
                        currentData.Selected = false;
                    }
                } else if (target.type === 'select-one' && target.size === 0) {
                    // eslint-disable-next-line
                    let currentValue: any = target.options[target.selectedIndex].text;
                    // eslint-disable-next-line
                    let childrens: any = target.children;
                    const isChildElements: boolean = false;
                    for (let k: number = 0; k < childrens.length; k++) {
                        if (childrens[k].text === currentValue) {
                            currentData.SelectedValue = currentValue;
                        }
                    }
                } else if (target.type === 'select-multiple' || target.size > 0) {
                    // eslint-disable-next-line
                    let currentValue: any = target.selectedOptions;
                    currentData.SelectedList = [];
                    for (let z: number = 0; z < currentValue.length; z++) {
                        // eslint-disable-next-line
                        let childrens: any = target.children;
                        for (let k: number = 0; k < childrens.length; k++) {
                            if (childrens[k] === currentValue[z]) {
                                currentData.SelectedList.push(k);
                            }
                        }
                    }
                }
                break;
            } else if (target && target.getAttribute('list') != null && target.type === 'text' && currentData.uniqueID === target.list.id) {
                currentData.SelectedValue = target.value;
            }
        }
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
        window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(FormFieldsData));
    }
    // eslint-disable-next-line
    private applyCommonProperties(inputdiv: any, pageIndex: number, index: number, currentData: any): void {
        // eslint-disable-next-line
        let inputField: any = document.getElementById(this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
        if (inputField) {
            inputField.remove();
        }
        // eslint-disable-next-line
        let signIcon: HTMLElement = document.getElementById('signIcon' + pageIndex + '_' + pageIndex);
        let left: number = parseFloat(inputdiv.style.left);
        let top: number = parseInt(inputdiv.style.top);
        let width: number = parseFloat(inputdiv.style.width);
        let height: number = parseFloat(inputdiv.style.height);
        let signIconWidth: number;
        let signIconHeght: number;
        let hightDifference: number;
        let widthDifference: number;
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        if (signIcon) {
            signIconWidth = parseFloat(signIcon.style.width);
            signIconHeght = parseFloat(signIcon.style.height);
            if (signIcon.style.transform == 'rotate(90deg)') {
                signIcon.style.transform = 'rotate(0deg)';
                hightDifference = height / 2;
                widthDifference = signIconWidth * zoomvalue;
                signIcon.style.left = ((left - (hightDifference - (signIconWidth * zoomvalue))) + (widthDifference / 2)) + 'px';
            }
            if (signIcon.style.transform == 'rotate(180deg)') {
                signIcon.style.transform = 'rotate(0deg)';
                signIcon.style.left = left + 'px';
                signIcon.style.top = (top) + 'px';
            }
            if (signIcon.style.transform == 'rotate(270deg)') {
                signIcon.style.transform = 'rotate(0deg)';
                hightDifference = height / 2;
                widthDifference = signIconWidth * zoomvalue;
                signIcon.style.left = ((left - (hightDifference - widthDifference)) + (widthDifference / 2)) + 'px';
                signIcon.style.top = ((top + (width + (signIconHeght * zoomvalue)) + ((signIconHeght * zoomvalue) / 2))) + 'px';
            }
        }
        if (currentData.IsSignatureField && this.isSignatureField) {
            inputdiv.className = 'e-pdfviewer-signatureformfields-signature';
            inputdiv.style.pointerEvents = 'none';
        } else if (currentData.IsSignatureField) {
            inputdiv.className = 'e-pdfviewer-signatureformfields';
        } else if (currentData.Name !== 'Button') {
            inputdiv.className = 'e-pdfviewer-formFields';
        }
        inputdiv.id = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index;
        inputdiv.style.zIndex = 1000;
    }
    /**
     * @param currentData
     * @param pageIndex
     * @param index
     * @param printContainer
     * @param currentData
     * @param pageIndex
     * @param index
     * @param printContainer
     * @private
     */
    // eslint-disable-next-line
    public createFormFields(currentData: any, pageIndex: number, index?: number, printContainer?: any): void {
        // eslint-disable-next-line
        let currentField: any;
        // eslint-disable-next-line
        switch (currentData['Name']) {
        case 'Textbox':
            currentField = this.createTextBoxField(currentData, pageIndex, 'text');
            break;
        case 'Password':
            currentField = this.createTextBoxField(currentData, pageIndex, 'password');
            break;
        case 'RadioButton':
            currentField = this.createRadioBoxField(currentData, pageIndex, 'radio');
            break;
        case 'CheckBox':
            currentField = this.createRadioBoxField(currentData, pageIndex, 'checkbox', printContainer);
            break;
        case 'DropDown':
            currentField = this.createDropDownField(currentData, pageIndex, index, printContainer);
            break;
        case 'ListBox':
            currentField = this.createListBoxField(currentData, pageIndex);
            break;
        case 'SignatureField':
            currentField = this.createSignatureField(currentData, pageIndex, index, printContainer);
            if (currentData.Value && currentData.Value !== '') {
                this.renderExistingAnnnot(currentData, index, printContainer);
                this.isSignatureRendered = true;
            }
            break;
        case 'Button':
            currentField = this.createButtonField(currentData, pageIndex);
            break;
        case 'ink':
            if (currentData.Value && currentData.Value !== '' && !this.isSignatureRendered) {
                this.renderExistingAnnnot(currentData, index, printContainer);
            }
            break;
        }
        return currentField;
    }
    // eslint-disable-next-line
    private createButtonField(data: any, pageIndex: number): any {
        // eslint-disable-next-line
        let inputField: any = document.createElement('input');
        if (data.Value) {
            inputField.type = 'image';
            inputField.src = data.Value;
        } else {
            inputField.type = 'button';
        }
        inputField.className = 'e-pv-buttonItem';
        if (data.Text !== '') {
            inputField.value = data.Text;
        } else {
            inputField.value = '';
        }
        inputField.name = data.FieldName;
        return inputField;
    }
    // eslint-disable-next-line
    private createTextBoxField(data: any, pageIndex: number, type: string): any {
        // eslint-disable-next-line
        let inputField: any;
        if (data.Visible === 1) {
            return;
        }
        if (data.Multiline) {
            inputField = document.createElement('textarea');
            inputField.style.resize = 'none';
        } else {
            inputField = document.createElement('input');
            inputField.type = type;
        }
        if (data.MaxLength > 0) {
            inputField.maxLength = data.MaxLength;
        }
        this.addAlignmentPropety(data, inputField);
        if (data.Text !== '') {
            inputField.value = data.Text;
        } else {
            inputField.value = '';
        }
        if (!this.pdfViewer.enableAutoComplete) {
            inputField.autocomplete = 'off';
        }
        inputField.name = data.FieldName;
        return inputField;
    }
    // eslint-disable-next-line
    private checkIsReadonly(data: any, inputField: any): void {
        let isReadonly: boolean = false;
        for (let n: number = 0; n < this.readOnlyCollection.length; n++) {
            if (inputField.id === this.readOnlyCollection[n]) {
                isReadonly = true;
                break;
            }
        }
        if (data.IsReadonly || (!this.pdfViewer.enableFormFields) || isReadonly) {
            inputField.disabled = true;
            inputField.style.cursor = 'default';
            inputField.style.backgroundColor = 'transparent';
        } else {
            // eslint-disable-next-line
            let borderColor: any = data.BackColor;
            inputField.style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0.2 + ')';
            // eslint-disable-next-line
            let fontColor: any = data.FontColor;
            inputField.style.color = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
        }
    }
    /**
     * @param isReadonly
     * @private
     */
    // eslint-disable-next-line max-len
    public formFieldsReadOnly(isReadonly: boolean): void {
        // eslint-disable-next-line
        let formFields: any = document.getElementsByClassName('e-pdfviewer-formFields');
        this.makeformFieldsReadonly(formFields, isReadonly);
        // eslint-disable-next-line
        let signatureFields: any = document.getElementsByClassName('e-pdfviewer-signatureformfields');
        this.makeformFieldsReadonly(signatureFields, isReadonly);
    }
    // eslint-disable-next-line
    private makeformFieldsReadonly(formFields: any, isReadonly: boolean) {
        for (let i: number = 0; i < formFields.length; i++) {
            if (formFields[i]) {
                // eslint-disable-next-line
                let inputField: any = formFields[i];
                if (!isReadonly) {
                    inputField.disabled = true;
                    inputField.style.cursor = 'default';
                } else {
                    // eslint-disable-next-line
                    inputField.disabled = false;
                }
            }
        }
    }
    // eslint-disable-next-line
    private applyTabIndex(data: any, inputField: any, pageIndex: number): void {
        inputField.tabIndex = data.TabIndex;
        this.maxTabIndex = Math.max(this.maxTabIndex, inputField.tabIndex);
        if (this.minTabIndex === -1) {
            this.minTabIndex = inputField.tabIndex;
        }
        this.minTabIndex = Math.min(this.minTabIndex, inputField.tabIndex);
        this.maintainTabIndex[pageIndex.toString()] = this.maxTabIndex;
        this.maintanMinTabindex[pageIndex.toString()] = this.minTabIndex;
    }
    // eslint-disable-next-line
    private checkIsRequiredField(data: any, inputField: any): void {
        if (data.IsRequired) {
            inputField.required = true;
            inputField.style.border = '1px solid red';
        } else {
            // eslint-disable-next-line
            let borderColor: any = data.BorderColor;
            inputField.style.border = data.BorderWidth;
            inputField.style.borderColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
        }
        if (inputField.type !== 'checkbox' && inputField.type !== 'radio') {
            const borderStyle: number = data.BorderStyle;
            this.addBorderStylePropety(borderStyle, inputField);
        }
    }
    // eslint-disable-next-line
    private applyDefaultColor(inputField: any): void {
        // eslint-disable-next-line max-len
        if (inputField.type !== 'button' && (inputField.style.backgroundColor === 'rgba(255, 255, 255, 0.2)' || inputField.style.backgroundColor === 'rgba(0, 0, 0, 0.2)')) {
            inputField.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
        }
        if (inputField.style.color === 'rgba(255, 255, 255, 0.2)') {
            inputField.style.color = 'black';
        }
    }
    // eslint-disable-next-line
    private addAlignmentPropety(data: any, inputField: any): any {
        // eslint-disable-next-line
        let alignment: any = data.Alignment;
        switch (alignment) {
        case 0:
            inputField.style.textAlign = 'left';
            break;
        case 1:
            inputField.style.textAlign = 'center';
            break;
        case 2:
            inputField.style.textAlign = 'right';
            break;
        case 3:
            inputField.style.textAlign = 'justify';
            break;
        }
    }
    // eslint-disable-next-line
    private addBorderStylePropety(borderStyle: number, inputField: any): any {
        // eslint-disable-next-line
        switch (borderStyle) {
        case 0:
            inputField.style.borderStyle = 'solid';
            break;
        case 1:
            inputField.style.borderStyle = 'dashed';
            break;
        case 2:
            inputField.style.borderStyle = 'outset';
            break;
        case 3:
            inputField.style.borderStyle = 'inset';
            break;
        case 4:
            inputField.style.borderStyle = 'outset';
            break;
        case 5:
            inputField.style.borderStyle = 'dotted';
            break;
        case 6:
            inputField.style.borderStyle = 'inset';
            break;
        }
    }
    // eslint-disable-next-line
    private createRadioBoxField(data: any, pageIndex: number, type: string, printContainer?: any): any {
        // eslint-disable-next-line
        let inputField: any = document.createElement('input');
        inputField.type = type;
        if (data.Selected) {
            inputField.checked = true;
        } else if (type === 'checkbox' && !printContainer) {
            inputField.style.webkitAppearance = 'none';
        }
        inputField.name = data.GroupName;
        inputField.value = data.Value;
        return inputField;
    }
    // eslint-disable-next-line
    private createDropDownField(data: any, pageIndex: number, index: number, printContainer: any): any {
        // eslint-disable-next-line
        let inputField: any = document.createElement('select');
        // eslint-disable-next-line
        let childItems = data['TextList'];
        if (data.Selected && !printContainer) {
            // eslint-disable-next-line
            let previousField: any = document.getElementById('editableDropdown' + pageIndex + '_' + index);
            if (previousField) {
                previousField.remove();
            }
            // eslint-disable-next-line
            let inputFields: any = document.createElement('input');
            inputFields.id = 'editableDropdown' + pageIndex + '_' + index;
            inputFields.setAttribute('list', this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
            // eslint-disable-next-line
            let bounds: any = data['LineBounds'];
            // eslint-disable-next-line
            let font: any = data['Font'];
            inputFields.style.position = 'absolute';
            inputFields.style.border = '0px';
            // eslint-disable-next-line
            this.applyPosition(inputFields, bounds, font, pageIndex, data['Rotation']);
            inputFields.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
            inputFields.className = 'e-pdfviewer-formFields';
            if (data.selectedIndex === -1) {
                inputFields.value = data.SelectedValue;
            }
            if (printContainer) {
                printContainer.appendChild(inputFields);
            } else {
                const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
                textLayer.appendChild(inputFields);
            }
            inputFields.addEventListener('focus', this.focusFormFields.bind(this));
            inputFields.addEventListener('blur', this.blurFormFields.bind(this));
            inputFields.addEventListener('click', this.updateFormFields.bind(this));
            inputFields.addEventListener('change', this.changeFormFields.bind(this));
            inputFields.addEventListener('keydown', this.updateFormFieldsValue.bind(this));
            inputField = document.createElement('DATALIST');
        }
        for (let j: number = 0; j < childItems.length; j++) {
            // eslint-disable-next-line
            let option: any = document.createElement('option');
            option.className = 'e-dropdownSelect';
            if (data.SelectedValue === childItems[j] || data.selectedIndex === j) {
                option.selected = true;
            } else {
                option.selected = false;
            }
            option.innerHTML = childItems[j];
            inputField.appendChild(option);
        }
        inputField.name = data.Text;
        return inputField;
    }
    // eslint-disable-next-line
    private createListBoxField(data: any, pageIndex: number): any {
        // eslint-disable-next-line
        let inputField: any = document.createElement('select');
        // eslint-disable-next-line
        let childItems: any = data['TextList'];
        if (data.MultiSelect) {
            inputField.multiple = true;
        } else {
            inputField.multiple = false;
            inputField.size = childItems.length;
        }
        for (let j: number = 0; j < childItems.length; j++) {
            // eslint-disable-next-line
            let option: any = document.createElement('option');
            option.className = 'e-pdfviewer-ListBox';
            for (let k: number = 0; k < data.SelectedList.length; k++) {
                if (data.SelectedList[k] === j) {
                    option.selected = true;
                }
            }
            option.innerHTML = childItems[j];
            inputField.appendChild(option);
        }
        inputField.name = data.Text;
        return inputField;
    }
    // eslint-disable-next-line
    private createSignatureField(data: any, pageIndex: number, index: number, printContainer: any): any {
        // eslint-disable-next-line
        let inputField: any = document.createElement('input');
        inputField.type = 'text';
        inputField.name = data.FieldName;
        // eslint-disable-next-line
        let previousField: any = document.getElementById('signIcon' + pageIndex + '_' + index);
        if (previousField && !printContainer) {
            previousField.remove();
        }
        // eslint-disable-next-line
        let span: any = document.createElement('span');
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        // eslint-disable-next-line
        let bounds: any = data['LineBounds'];
        // eslint-disable-next-line
        let font: any = data['Font'];
        const left: number = this.ConvertPointToPixel(bounds.X);
        const top: number = this.ConvertPointToPixel(bounds.Y);
        // eslint-disable-next-line max-len
        const height: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height > bounds.Height / 2 ? bounds.Height / 2 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height;
        // eslint-disable-next-line max-len
        const width: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width > bounds.Width / 2 ? bounds.Width / 2 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width;
        // eslint-disable-next-line max-len
        const fontSize: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize > height / 2 ? 10 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize;
        span.style.position = 'absolute';
        span.id = 'signIcon' + pageIndex + '_' + index;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        const rotation: number = this.getAngle(pageIndex);
        // eslint-disable-next-line
        let annotBounds: any = { left: left, top: top, width: width, height: height };
        // eslint-disable-next-line
        let fieldBounds: any = this.getBounds(annotBounds, pageIndex);
        span.style.transform = 'rotate(' + rotation + 'deg)';
        span.style.left = fieldBounds.left * zoomvalue + 'px';
        span.style.top = fieldBounds.top * zoomvalue + 'px';
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            span.style.height = 5 + 'px';
            span.style.width = 10 + 'px';
            span.style.fontSize = '3px';
        } else {
            span.style.height = height + 'px';
            span.style.width = width + 'px';
            span.style.fontSize = fontSize + 'px';
            if (isBlazor()) {
                span.style.fontSize = (fontSize - 1) + 'px';
            }
        }
        span.style.padding = '2px';
        span.style.textAlign = 'center';
        span.style.boxSizing = 'content-box';
        // eslint-disable-next-line
        span.innerHTML = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text : 'Sign';
        span.style.color = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color : 'black';
        // eslint-disable-next-line
        span.style.backgroundColor = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor : 'orange';
        span.style.opacity = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity : 1;
        textLayer.appendChild(span);
        this.addSignaturePath(data);
        return inputField;
    }
    // eslint-disable-next-line
    private addSignaturePath(signData: any): boolean {
        this.isSignatureField = false;
        // eslint-disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // eslint-disable-next-line
        let formFieldsData: any = JSON.parse(data);
        for (let m: number = 0; m < formFieldsData.length; m++) {
            // eslint-disable-next-line
            let currentData: any = formFieldsData[m];
            // eslint-disable-next-line max-len
            if ((currentData.Name === 'ink' || currentData.Name === 'SignatureField' || currentData.Name === 'SignatureImage' || currentData.Name === 'SignatureText') && currentData.FieldName === signData.FieldName && currentData.Value && currentData.Value !== '') {
                signData.Value = currentData.Value;
                signData.Bounds = currentData.LineBounds;
                signData.FontFamily = currentData.FontFamily;
                signData.FontSize = currentData.FontSize;
                this.isSignatureField = true;
                break;
            }
        }
        return this.isSignatureField;
    }
    // eslint-disable-next-line
    private getBounds(bound: any, pageIndex: number, rotation?: any): any {
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
        // eslint-disable-next-line
        let bounds: any;
        if (rotation > 0) {
            bounds = this.getBoundsPosition(rotation, bound, pageDetails);
        } else {
            bounds = this.getBoundsPosition(pageDetails.rotation, bound, pageDetails);
        }
        return bounds;
    }
    // eslint-disable-next-line
    private getBoundsPosition(rotation: number, bound: any, pageDetails: any):void {
        // eslint-disable-next-line
        let bounds: any;
        switch (rotation) {
        case 90:
            // eslint-disable-next-line
                bounds = { left: pageDetails.width - bound.top - bound.height, top: bound.left, width: bound.height, height: bound.width };
            break;
        case 180:
            // eslint-disable-next-line
                bounds = { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
            break;
        case 270:
            // eslint-disable-next-line
                bounds = { left: bound.top, top: pageDetails.height - bound.left - bound.width, width: bound.height, height: bound.width };
            break;
        case 0:
            bounds = bound;
            break;
        case 1:
            // eslint-disable-next-line
                    bounds = { left: pageDetails.width - bound.top - bound.height - (bound.width / 2 - bound.height / 2), top: bound.left + (bound.width / 2 - bound.height / 2), width: bound.width, height: bound.height };
            break;
        case 2:
            // eslint-disable-next-line
                    bounds = { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
            break;
        case 3:
            // eslint-disable-next-line
                    bounds = { left: bound.top - (bound.width / 2 - bound.height / 2), top: (pageDetails.height - bound.left - bound.width + (bound.width / 2 - bound.height / 2)), width: bound.width, height: bound.height };
            break;
        }
        if (!bounds) {
            bounds = bound;
        }
        return bounds;
    }
    // eslint-disable-next-line
    private applyPosition(inputField: any, bounds: any, font: any, pageIndex?: number, rotation?: number): void {
        if (bounds) {
            const left: number = this.ConvertPointToPixel(bounds.X);
            const top: number = this.ConvertPointToPixel(bounds.Y);
            const width: number = this.ConvertPointToPixel(bounds.Width);
            const height: number = this.ConvertPointToPixel(bounds.Height);
            let fontHeight: number = 0;
            // eslint-disable-next-line
            let fieldBounds: any = { left: left, top: top, width: width, height: height };
            // eslint-disable-next-line
            let annotBounds: any = this.getBounds(fieldBounds, pageIndex, rotation);
            if (font !== null && font.Height) {
                inputField.style.fontfamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                fontHeight = this.ConvertPointToPixel(font.Size);
            }
            this.setStyleToTextDiv(inputField, annotBounds.left, annotBounds.top, fontHeight, annotBounds.width, annotBounds.height, false);
        }
    }
    /**
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @private
     */
    // eslint-disable-next-line max-len
    public setStyleToTextDiv(textDiv: HTMLElement, left: number, top: number, fontHeight: number, width: number, height: number, isPrint: boolean): void {
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        if (isPrint) {
            zoomvalue = 1;
            textDiv.style.position = 'absolute';
        }
        textDiv.style.left = left * zoomvalue + 'px';
        textDiv.style.top = top * zoomvalue + 'px';
        textDiv.style.height = height * zoomvalue + 'px';
        textDiv.style.width = width * zoomvalue + 'px';
        textDiv.style.margin = '0px';
        if (fontHeight > 0) {
            textDiv.style.fontSize = fontHeight * zoomvalue + 'px';
        }
    }

    // eslint-disable-next-line
    private renderExistingAnnnot(data: any, index: any, printContainer: any): any {
        if (!printContainer) {
            // eslint-disable-next-line
            let bounds: any;
            if (data.Bounds && data.Name !== 'ink') {
                bounds = data.Bounds;
            } else {
                bounds = data.LineBounds;
            }
            const currentLeft: number = this.ConvertPointToPixel(bounds.X);
            const currentTop: number = this.ConvertPointToPixel(bounds.Y);
            const currentWidth: number = this.ConvertPointToPixel(bounds.Width);
            const currentHeight: number = this.ConvertPointToPixel(bounds.Height);
            // eslint-disable-next-line
            let currentPage: number = parseFloat(data['PageIndex']);
            // eslint-disable-next-line
            let bound: any = { left : currentLeft, top : currentTop, width: currentWidth, height: currentHeight };
            // eslint-disable-next-line
            let newBounds : any = this.updateSignatureBounds(bound, currentPage);
            let annot: PdfAnnotationBaseModel;
            // eslint-disable-next-line
            let collectionData: any = processPathData(data.Value);
            // eslint-disable-next-line
            if ((data.Value.split('base64,')[1])) {
                annot = {
                    // eslint-disable-next-line max-len
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            } else if (collectionData.length === 0) {
                annot = {
                    // eslint-disable-next-line max-len
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: data.FontFamily, fontSize: data.FontSize
                };
                annot.fontFamily = data.FontFamily ? data.FontFamily : data.fontFamily;
                annot.fontSize = data.FontSize ? data.FontSize : data.fontSize;
            } else {
                annot = {
                    // eslint-disable-next-line max-len
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            }
            this.pdfViewer.add(annot as PdfAnnotationBase);
            data.Bounds = annot.bounds;
            // eslint-disable-next-line
            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
            // eslint-disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, currentPage);
        }
    }

    // eslint-disable-next-line
    private updateSignatureBounds(bound: any, pageIndex: number): any {
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { x: pageDetails.width - bound.top - bound.height, y: bound.left, width: bound.height, height: bound.width };
            } else if (pageDetails.rotation === 2) {
                // eslint-disable-next-line max-len
                return { x: pageDetails.width - bound.left - bound.width, y: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
            } else if (pageDetails.rotation === 3) {
                return { x: bound.top, y: pageDetails.height - bound.left - bound.width, width: bound.height, height: bound.width };
            } else {
                return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
            }
        } else {
            return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
        }
    }

    public resetFormFields(): void {
        const formFieldData: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        for (let i: number = 0; i < formFieldData.length; i++) {
            const currentData: FormFieldModel = formFieldData[i];
            this.currentTarget = document.getElementById(currentData.id);
            if (currentData.type === 'Textbox') {
                this.currentTarget.value = currentData.value;
            } else if (currentData.type === 'RadioButton') {
                this.currentTarget.checked = currentData.value;
                if (currentData.value) {
                    this.updateDataInSession(this.currentTarget);
                }
            } else if (currentData.type === 'DropDown') {
                this.currentTarget.value = currentData.value;
            } else if (currentData.type === 'CheckBox') {
                this.currentTarget.checked = currentData.value;
            } else if (currentData.type === 'SignatureField') {
                // eslint-disable-next-line
               let annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[currentData.id];
                if (annotation) {
                    if (this.currentTarget && this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature') {
                        this.currentTarget.className = 'e-pdfviewer-signatureformfields';
                        this.currentTarget.style.pointerEvents = '';
                        this.updateDataInSession(this.currentTarget, '');
                    }
                    this.pdfViewer.remove(annotation);
                    this.pdfViewer.renderDrawing();
                }
            }
            if (currentData.type !== 'RadioButton' && currentData.type !== 'SignatureField') {
                this.updateDataInSession(this.currentTarget);
            }
        }
    }

    // eslint-disable-next-line
    public clearFormFields(formField?: any): void {
        // eslint-disable-next-line
         let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // eslint-disable-next-line
         let formFieldsData: any;
        if (formField) {
            formFieldsData = [formField];
        } else {
            formFieldsData = JSON.parse(data);
        }
        let isFirstRadio: boolean = true;
        for (let m: number = 0; m < formFieldsData.length; m++) {
            // eslint-disable-next-line
            let currentData: any = formFieldsData[m];
            if (formField) {
                currentData.uniqueID = formField.id;
                currentData.Name = formField.type;
            }
            // eslint-disable-next-line
            this.currentTarget = document.getElementById(currentData.uniqueID);
            if (currentData.Name === 'Textbox') {
                this.currentTarget.value = '';
            }else if (currentData.Name === 'RadioButton') {
                if (isFirstRadio) {
                    this.currentTarget.checked = true;
                    this.updateDataInSession (this.currentTarget);
                    isFirstRadio = false;
                }
            }else if (currentData.Name === 'DropDown') {
                this.currentTarget.value = currentData.TextList[0];
            }else if (currentData.Name === 'CheckBox') {
                this.currentTarget.checked = false;
            } else if (currentData.Name === 'SignatureField') {
                // eslint-disable-next-line
                let annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[currentData.uniqueID];
                if (annotation) {
                    if (this.currentTarget && this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature') {
                        this.currentTarget.className = 'e-pdfviewer-signatureformfields';
                        this.currentTarget.style.pointerEvents = '';
                        this.currentTarget.parentElement.style.pointerEvents = '';
                        this.updateDataInSession(this.currentTarget, '');
                        if (formField) {
                            formField.value = '';
                            formField.signatureType = [formField.signatureType];
                            formField.signatureType[0] = '';
                        }
                    }
                    this.pdfViewer.remove(annotation);
                    this.pdfViewer.renderDrawing();
                }
            }
            if (currentData.Name !== 'SignatureField' && currentData.Name !== 'ink' && currentData.Name !== 'RadioButton') {
                this.updateDataInSession (this.currentTarget);
            }
        }
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
     * @private
     */
    public destroy(): void {
        this.currentTarget = null;
        this.readOnlyCollection = [];
    }

    /**
     * @private
     */
    public getModuleName(): string {
        return 'FormFields';
    }
}
