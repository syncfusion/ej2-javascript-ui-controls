import { PdfViewer, FormFieldModel, FormFieldType} from '../index';
import { PdfViewerBase } from '../index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { splitArrayCollection, processPathData } from '@syncfusion/ej2-drawings';


/**
 * The `FormFields` module is to render formfields in the PDF document.
 * @hidden
 */
export class FormFields {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private maxTabIndex: number;
    private minTabIndex: number;
    // tslint:disable-next-line
    private maintainTabIndex: any = {};
    // tslint:disable-next-line
    private maintanMinTabindex: any = {};
    private isSignatureField: boolean = false;
    /**
     * @private
     */
    // tslint:disable-next-line
    public readOnlyCollection: any = [];
    // tslint:disable-next-line
    private currentTarget: any;
    /**
     * @private
     */
    // tslint:disable-next-line
    public nonFillableFields: any = {};



    /**
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    public renderFormFields(pageIndex: number): void {
        this.maxTabIndex = 0;
        this.minTabIndex = -1;
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        if (data !== null) {
            // tslint:disable-next-line
            let formFieldsData: any = JSON.parse(data);
            let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            let canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            if (formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    // tslint:disable-next-line
                    let currentData: any = formFieldsData[i];
                    // tslint:disable-next-line
                    if (parseFloat(currentData['PageIndex']) == pageIndex) {
                        // tslint:disable-next-line
                        let inputField: any = this.createFormFields(currentData, pageIndex, i);
                        if (inputField) {
                            // tslint:disable-next-line
                            let bounds: any = currentData['LineBounds'];
                            // tslint:disable-next-line
                            let font: any = currentData['Font'];
                            this.applyPosition(inputField, bounds, font);
                            // tslint:disable-next-line
                            currentData['uniqueID'] = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + i;
                            this.applyCommonProperties(inputField, pageIndex, i, currentData);
                            this.checkIsReadonly(currentData, inputField);
                            this.applyTabIndex(currentData, inputField, pageIndex);
                            this.checkIsRequiredField(currentData, inputField);
                            this.applyDefaultColor(inputField);
                            textLayer.appendChild(inputField);
                            inputField.addEventListener('focus', this.focusFormFields.bind(this));
                            inputField.addEventListener('blur', this.blurFormFields.bind(this));
                            inputField.addEventListener('click', this.updateFormFields.bind(this));
                            inputField.addEventListener('change', this.changeFormFields.bind(this));
                            inputField.addEventListener('keydown', this.updateFormFieldsValue.bind(this));
                        }
                    }
                }
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(formFieldsData));
            }
        }
    }
    /**
     * @private
     */
    public formFieldCollections(): void {
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        if (data !== null) {
            // tslint:disable-next-line
            let formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                // tslint:disable-next-line
                let currentData: any = formFieldsData[i];
                // tslint:disable-next-line
                let type: FormFieldType = currentData['Name'];
                // tslint:disable-next-line
                let formFieldCollection: FormFieldModel = { name: this.retriveFieldName(currentData), id: this.pdfViewer.element.id + 'input_' + parseFloat(currentData['PageIndex']) + '_' + i, isReadOnly: false, type: type, value: this.retriveCurrentValue(currentData) };
                this.pdfViewer.formFieldCollections.push(formFieldCollection);
            }
        }
    }
    // tslint:disable-next-line
    public updateFormFieldValues(formFields: any): void {
        this.readOnlyCollection.push(formFields.id);
        if (formFields) {
            // tslint:disable-next-line
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
     * @private
     */
    // tslint:disable-next-line
    public retriveFieldName(currentData: any): string {
        // tslint:disable-next-line
        let currentField: any;
        // tslint:disable-next-line
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
    // tslint:disable-next-line
    private retriveCurrentValue(currentData: any): string {
        // tslint:disable-next-line
        let currentField: any;
        // tslint:disable-next-line
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
    /**
     * @private
     */
    // tslint:disable-next-line
    public downloadFormFieldsData(): any {
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        let formFieldsData: any = JSON.parse(data);
        // tslint:disable-next-line
        let datas: any = {};
        if (formFieldsData) {
            for (let m: number = 0; m < formFieldsData.length; m++) {
                // tslint:disable-next-line
                let currentData: any = formFieldsData[m];
                if (currentData.Name === 'Textbox' || currentData.Name === 'Password' || currentData.Multiline) {
                    if (currentData.Text === '' || currentData.Text === null) {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.FieldName] = currentData.Text;
                    } else {
                        delete(this.nonFillableFields[currentData.FieldName]);
                    }
                    datas[currentData.FieldName] = currentData.Text;
                } else if (currentData.Name === 'RadioButton' && currentData.Selected) {
                    if (currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.GroupName] = currentData.Value;
                    } else {
                        delete(this.nonFillableFields[currentData.GroupName]);
                    }
                    datas[currentData.GroupName] = currentData.Value;
                } else if (currentData.Name === 'CheckBox') {
                    if (currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                    }
                    datas[currentData.GroupName] = currentData.Selected;
                } else if (currentData.Name === 'DropDown') {
                    if (currentData.SelectedValue === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.Text] = currentData.SelectedValue;
                    } else {
                        delete(this.nonFillableFields[currentData.Text]);
                    }
                    datas[currentData.Text] = currentData.SelectedValue;
                } else if (currentData.Name === 'ListBox') {
                    // tslint:disable-next-line
                    let childItems: any = currentData['TextList'];
                    let childItemsText: string[] = [];
                    for (let m: number = 0; m < currentData.SelectedList.length; m++) {
                        // tslint:disable-next-line
                        let currentElement: any = currentData.SelectedList[m];
                        childItemsText.push(childItems[currentElement]);
                    }
                    datas[currentData.Text] = JSON.stringify(childItemsText);
                } else if (currentData.Name === 'SignatureField') {
                    // tslint:disable-next-line
                    let collectionData: any = processPathData(currentData.Value);
                    // tslint:disable-next-line
                    let csData: any = splitArrayCollection(collectionData);
                    if (currentData.Value === null || currentData.Value === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.FieldName] = JSON.stringify(csData);
                    } else {
                        delete(this.nonFillableFields[currentData.FieldName]);
                    }
                    datas[currentData.FieldName] = JSON.stringify(csData);
                    if (currentData.Bounds) {
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(currentData.Bounds);
                    } else {
                        // tslint:disable-next-line
                        let lineBounds: any = currentData.LineBounds;
                        // tslint:disable-next-line
                        let bounds: any = { x: this.ConvertPointToPixel(lineBounds.X), y: this.ConvertPointToPixel(lineBounds.Y), width: this.ConvertPointToPixel(lineBounds.Width), height: this.ConvertPointToPixel(lineBounds.Height)};
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(bounds);
                    }
                }
            }
        }
        return (JSON.stringify(datas));
    }
    private focusFormFields(event: MouseEvent): void {
        // tslint:disable-next-line
        let currentTarget: any = event.target;
        if (currentTarget && currentTarget.className !== 'e-pdfviewer-signatureformFields') {
            // tslint:disable-next-line
            let backgroundcolor: any = currentTarget.style.backgroundColor;
            // tslint:disable-next-line
            let currentIndex: any = backgroundcolor.lastIndexOf(',');
            // tslint:disable-next-line
            let currentColor: any = backgroundcolor.slice(0, currentIndex + 1) + 0 + ')';
            if (currentTarget.type === 'checkbox') {
                currentTarget.style.webkitAppearance = '';
            }
            currentTarget.style.backgroundColor = currentColor;
        } else if (currentTarget) {
            currentTarget.blur();
        }
    }
    private blurFormFields(event: MouseEvent): void {
        // tslint:disable-next-line
        let currentTarget: any = event.target;
        // tslint:disable-next-line
        let backgroundcolor: any = currentTarget.style.backgroundColor;
        // tslint:disable-next-line
        let currentIndex: any = backgroundcolor.lastIndexOf(',');
        // tslint:disable-next-line
        let currentColor: any = backgroundcolor.slice(0, currentIndex + 1) + 0.2 + ')';
        if ((currentTarget.type === 'checkbox') && !currentTarget.checked) {
            currentTarget.style.webkitAppearance = 'none';
        } else {
            currentTarget.style.webkitAppearance = '';
        }
        currentTarget.style.backgroundColor = currentColor;
    }
    private updateFormFields(event: MouseEvent): void {
        // tslint:disable-next-line
        let currentTarget: any = event.target;
        if (currentTarget.className === 'e-pdfviewer-ListBox') {
            currentTarget = currentTarget.parentElement;
            this.updateDataInSession(currentTarget);
        } else if (currentTarget.className === 'e-pdfviewer-signatureformFields') {
            this.currentTarget = currentTarget;
            this.pdfViewerBase.signatureModule.showSignatureDialog(true);
        }
    }
    /**
     * @private
     */
    public drawSignature(): void {
        let annot: PdfAnnotationBaseModel;
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        let currentWidth: number = parseFloat(this.currentTarget.style.width) / zoomvalue;
        let currentHeight: number = parseFloat(this.currentTarget.style.height) / zoomvalue;
        let currentLeft: number = parseFloat(this.currentTarget.style.left) / zoomvalue;
        let currentTop: number = parseFloat(this.currentTarget.style.top) / zoomvalue;
        let currentPage: number = parseFloat(this.currentTarget.id.split('_')[1]);
        // tslint:disable-next-line
        let signatureBounds: any = this.checkSignatureWidth(this.pdfViewerBase.signatureModule.outputString);
        annot = {
            // tslint:disable-next-line:max-line-length
            id: this.currentTarget.id, bounds: { x: currentLeft + signatureBounds.left, y: currentTop + signatureBounds.top, width: signatureBounds.width, height: signatureBounds.height }, pageIndex: currentPage, data: this.pdfViewerBase.signatureModule.outputString, modifiedDate: '',
            shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
        };
        this.pdfViewer.add(annot as PdfAnnotationBase);
        // tslint:disable-next-line
        let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
        // tslint:disable-next-line
        this.pdfViewer.renderDrawing(canvass as any, currentPage);
        this.pdfViewerBase.signatureModule.showSignatureDialog(false);
        this.currentTarget.className = 'e-pdfviewer-signatureformFields signature';
        this.updateDataInSession(this.currentTarget, annot.data, annot.bounds);
        this.currentTarget.style.pointerEvents = 'none';
    }
    private updateFormFieldsValue(event: MouseEvent): void {
        // tslint:disable-next-line
        let currentTarget: any = event.target;
        if (event.which === 9 && currentTarget && currentTarget.className === 'e-pdfviewer-formFields') {
            // tslint:disable-next-line
            let id: any = currentTarget.id.split('input_')[1].split('_')[0];
            if (this.maintainTabIndex[id] === currentTarget.tabIndex) {
                // tslint:disable-next-line
                let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (parseInt(id) + 1));
                if (textLayer) {
                    // tslint:disable-next-line
                    let currentFields: any = textLayer.getElementsByClassName('e-pdfviewer-formFields');
                    if (currentFields && currentFields.length > 0) {
                        currentFields[0].focus();
                        event.preventDefault();
                    }
                } else {
                    let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + 0);
                    // tslint:disable-next-line
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
                // tslint:disable-next-line
                let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + parseInt(id));
                // tslint:disable-next-line
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
    }
    private changeFormFields(event: MouseEvent): void {
        // tslint:disable-next-line
        let currentTarget: any = event.target;
        this.updateDataInSession(currentTarget);
    }
    // tslint:disable-next-line
    private checkSignatureWidth(data: any): any {
        // tslint:disable-next-line
        let collectionData: any = processPathData(data);
        // tslint:disable-next-line
        let csData: any = splitArrayCollection(collectionData);
        let minimumX: number = -1;
        let minimumY: number = -1;
        let maximumX: number = -1;
        let maximumY: number = -1;
        for (let m: number = 0; m < csData.length; m++) {
            // tslint:disable-next-line
            let val: any = csData[m];
            if (minimumX === -1) {
                // tslint:disable-next-line
                minimumX = parseFloat(val['x'].toString());
                // tslint:disable-next-line
                maximumX = parseFloat(val['x'].toString());
                // tslint:disable-next-line
                minimumY = parseFloat(val['y'].toString());
                // tslint:disable-next-line
                maximumY = parseFloat(val['y'].toString());
            } else {
                // tslint:disable-next-line
                let point1: number = parseFloat(val['x'].toString());
                // tslint:disable-next-line
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
        let newdifferenceX: number = maximumX - minimumX;
        let newdifferenceY: number = maximumY - minimumY;
        let ratioX: number = newdifferenceX / 650;
        let ratioY: number = newdifferenceY / 300;
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        // tslint:disable-next-line
        let currentWidth: number = parseFloat(this.currentTarget.style.width) / zoomvalue;
        // tslint:disable-next-line
        let currentHeight: number = parseFloat(this.currentTarget.style.height) / zoomvalue;
        let currentLeftDiff : number = (650 - newdifferenceX) / 2;
        let currentTopDiff : number = (300 - newdifferenceY) / 2;
        currentLeftDiff = (currentLeftDiff / 650) * currentWidth;
        currentTopDiff = (currentTopDiff  / 300) * currentHeight;
        currentWidth = currentWidth * ratioX;
        currentHeight = currentHeight * ratioY;
        return { left : currentLeftDiff, top : currentTopDiff, width: currentWidth, height: currentHeight };
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public updateDataInSession(target: any, signaturePath?: any, signatureBounds?: any): void {
        this.pdfViewer.isDocumentEdited = true;
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        let FormFieldsData: any = JSON.parse(data);
        for (let m: number = 0; m < FormFieldsData.length; m++) {
            // tslint:disable-next-line
            let currentData: any = FormFieldsData[m];
            if (currentData.uniqueID === target.id) {
                if (target.type === 'text' || target.type === 'password' || target.type === 'textarea') {
                    let signField: HTMLElement = target as HTMLElement;
                    if (signField.classList.contains('e-pdfviewer-signatureformFields')) {
                        currentData.Value = signaturePath;
                        if (signatureBounds) {
                            currentData.Bounds = signatureBounds;
                        }
                    } else {
                        currentData.Text = target.value;
                    }
                } else if (target.type === 'radio') {
                    for (let l: number = 0; l < FormFieldsData.length; l++) {
                        // tslint:disable-next-line
                        let currentType: any = FormFieldsData[l];
                        if (FormFieldsData[l].GroupName === target.name) {
                            FormFieldsData[l].Selected = false;
                        }
                    }
                    currentData.Selected = true;
                } else if (target.type === 'checkbox') {
                    if (target.checked) {
                        currentData.Selected = true;
                    } else {
                        currentData.Selected = false;
                    }
                } else if (target.type === 'select-one') {
                    // tslint:disable-next-line
                    let currentValue: any = target.options[target.selectedIndex].text;
                    // tslint:disable-next-line
                    let childrens: any = target.children;
                    let isChildElements: boolean = false;
                    for (let k: number = 0; k < childrens.length; k++) {
                        if (childrens[k].text === currentValue) {
                            currentData.SelectedValue = currentValue;
                        }
                    }
                } else if (target.type === 'select-multiple') {
                    // tslint:disable-next-line
                    let currentValue: any = target.selectedOptions;
                    currentData.SelectedList = [];
                    for (let z: number = 0; z < currentValue.length; z++) {
                        // tslint:disable-next-line
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
    // tslint:disable-next-line
    private applyCommonProperties(inputdiv: any, pageIndex: number, index: number, currentData: any): void {
        // tslint:disable-next-line
        let inputField: any = document.getElementById(this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
        if (inputField) {
            inputField.remove();
        }
        if (currentData.IsSignatureField && this.isSignatureField) {
            inputdiv.className = 'e-pdfviewer-signatureformFields signature';
            inputdiv.style.pointerEvents = 'none';
        } else if (currentData.IsSignatureField) {
            inputdiv.className = 'e-pdfviewer-signatureformFields';
        } else {
            inputdiv.className = 'e-pdfviewer-formFields';
        }
        inputdiv.id = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index;
        inputdiv.style.zIndex = 1000;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public createFormFields(currentData: any, pageIndex: number, index?: number, printContainer?: any): void {
        // tslint:disable-next-line
        let currentField: any;
        // tslint:disable-next-line
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
                }
                break;
        }
        return currentField;
    }
    // tslint:disable-next-line
    private createTextBoxField(data: any, pageIndex: number, type: string): any {
        // tslint:disable-next-line
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
    // tslint:disable-next-line
    private checkIsReadonly(data: any, inputField: any): void {
        let isReadonly: Boolean = false;
        for (let n: number = 0; n < this.readOnlyCollection.length; n++) {
            if (inputField.id === this.readOnlyCollection[n]) {
                isReadonly = true;
                break;
            }
        }
        if (data.IsReadonly || (!this.pdfViewer.enableFormFields) || isReadonly) {
            inputField.disabled = true;
            inputField.style.cursor = 'default';
            inputField.style.backgroundColor = 'none';
        } else {
            // tslint:disable-next-line
            let borderColor: any = data.BackColor;
            inputField.style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0.2 + ')';
            // tslint:disable-next-line
            let fontColor: any = data.FontColor;
            inputField.style.color = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public formFieldsReadOnly(isReadonly: boolean): void {
        // tslint:disable-next-line
        let formFields: any = document.getElementsByClassName('e-pdfviewer-formFields');
        this.makeformFieldsReadonly(formFields, isReadonly);
        // tslint:disable-next-line
        let signatureFields: any = document.getElementsByClassName('e-pdfviewer-signatureformFields');
        this.makeformFieldsReadonly(signatureFields, isReadonly);
    }
    // tslint:disable-next-line
    private makeformFieldsReadonly(formFields: any, isReadonly: boolean) {
        for (let i: number = 0; i < formFields.length; i++) {
            if (formFields[i]) {
                // tslint:disable-next-line
                let inputField: any = formFields[i];
                if (!isReadonly) {
                    inputField.disabled = true;
                    inputField.style.cursor = 'default';
                } else {
                    // tslint:disable-next-line
                    inputField.disabled = false;
                }
            }
        }
    }
    // tslint:disable-next-line
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
    // tslint:disable-next-line
    private checkIsRequiredField(data: any, inputField: any): void {
        if (data.IsRequired) {
            inputField.required = true;
            inputField.style.border = '1px solid red';
        } else {
            // tslint:disable-next-line
            let borderColor: any = data.BorderColor;
            inputField.style.border = data.BorderWidth;
            inputField.style.borderColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
        }
        if (inputField.type !== 'checkbox' && inputField.type !== 'radio') {
            let borderStyle: number = data.BorderStyle;
            this.addBorderStylePropety(borderStyle, inputField);
        }
    }
    // tslint:disable-next-line
    private applyDefaultColor(inputField: any): void {
        if (inputField.style.backgroundColor === 'rgba(255, 255, 255, 0.2)' || inputField.style.backgroundColor === 'rgba(0, 0, 0, 0.2)') {
            inputField.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
        }
        if (inputField.style.color === 'rgba(255, 255, 255, 0.2)') {
            inputField.style.color = 'black';
        }
    }
    // tslint:disable-next-line
    private addAlignmentPropety(data: any, inputField: any): any {
        // tslint:disable-next-line
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
    // tslint:disable-next-line
    private addBorderStylePropety(borderStyle: number, inputField: any): any {
        // tslint:disable-next-line
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
    // tslint:disable-next-line
    private createRadioBoxField(data: any, pageIndex: number, type: string, printContainer?: any): any {
        // tslint:disable-next-line
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
    // tslint:disable-next-line
    private createDropDownField(data: any, pageIndex: number, index: number, printContainer: any): any {
        // tslint:disable-next-line
        let inputField: any = document.createElement('select');
        // tslint:disable-next-line
        let childItems = data['TextList'];
        if (data.Selected && !printContainer) {
            // tslint:disable-next-line
            let previousField: any = document.getElementById('editableDropdown' + pageIndex + '_' + index);
            if (previousField) {
                previousField.remove();
            }
            // tslint:disable-next-line
            let inputFields: any = document.createElement('input');
            inputFields.id = 'editableDropdown' + pageIndex + '_' + index;
            inputFields.setAttribute('list', this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
            // tslint:disable-next-line
            let bounds: any = data['LineBounds'];
            // tslint:disable-next-line
            let font: any = data['Font'];
            this.applyPosition(inputFields, bounds, font);
            inputFields.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
            inputFields.className = 'e-pdfviewer-formFields';
            if (data.selectedIndex === -1) {
                inputFields.value = data.SelectedValue;
            }
            if (printContainer) {
                printContainer.appendChild(inputFields);
            } else {
                let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
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
            // tslint:disable-next-line
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
    // tslint:disable-next-line
    private createListBoxField(data: any, pageIndex: number): any {
        // tslint:disable-next-line
        let inputField: any = document.createElement('select');
        inputField.multiple = true;
        // tslint:disable-next-line
        let childItems: any = data['TextList'];
        for (let j: number = 0; j < childItems.length; j++) {
            // tslint:disable-next-line
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
    // tslint:disable-next-line
    private createSignatureField(data: any, pageIndex: number, index: number, printContainer: any): any {
        // tslint:disable-next-line
        let inputField: any = document.createElement('input');
        inputField.type = 'text';
        inputField.name = data.FieldName;
        // tslint:disable-next-line
        let previousField: any = document.getElementById('signIcon' + pageIndex + '_' + index);
        if (previousField && !printContainer) {
            previousField.remove();
        }
        // tslint:disable-next-line
        let span: any = document.createElement('span');
        let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        // tslint:disable-next-line
        let bounds: any = data['LineBounds'];
        // tslint:disable-next-line
        let font: any = data['Font'];
        let left: number = this.ConvertPointToPixel(bounds.X);
        let top: number = this.ConvertPointToPixel(bounds.Y);
        span.style.position = 'absolute';
        span.id = 'signIcon' + pageIndex + '_' + index;
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        span.style.left = left * zoomvalue + 'px';
        span.style.top = top * zoomvalue + 'px';
        if (Browser.isDevice) {
            span.style.height = 5 + 'px';
            span.style.width = 10 + 'px';
            span.style.fontSize = '3px';
        } else {
            span.style.height = 10 + 'px';
            span.style.width = 19 + 'px';
            span.style.fontSize = '8px';
        }
        span.style.padding = '2px';
        span.style.textAlign = 'center';
        span.style.boxSizing = 'content-box';
        span.innerHTML = 'Sign';
        span.style.backgroundColor = 'red';
        textLayer.appendChild(span);
        this.addSignaturePath(data);
        return inputField;
    }
    // tslint:disable-next-line
    private addSignaturePath(signData: any): boolean {
        this.isSignatureField = false;
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        let formFieldsData: any = JSON.parse(data);
        for (let m: number = 0; m < formFieldsData.length; m++) {
            // tslint:disable-next-line
            let currentData: any = formFieldsData[m];
            if ((currentData.Name === 'ink' || currentData.Name === 'SignatureField') && currentData.FieldName === signData.FieldName && currentData.Value && currentData.Value !== '') {
                signData.Value = currentData.Value;
                signData.Bounds = currentData.LineBounds;
                this.isSignatureField = true;
                break;
            }
        }
        return this.isSignatureField;
    }
    // tslint:disable-next-line
    private applyPosition(inputField: any, bounds: any, font: any): void {
        if (bounds) {
            let left: number = this.ConvertPointToPixel(bounds.X);
            let top: number = this.ConvertPointToPixel(bounds.Y);
            let width: number = this.ConvertPointToPixel(bounds.Width);
            let height: number = this.ConvertPointToPixel(bounds.Height);
            let fontHeight: number = 0;
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
            this.setStyleToTextDiv(inputField, left, top, fontHeight, width, height, false);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public setStyleToTextDiv(textDiv: HTMLElement, left: number, top: number, fontHeight: number, width: number, height: number, isPrint: boolean): void {
        textDiv.style.position = 'absolute';
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        if (isPrint) {
            zoomvalue = 1;
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

    // tslint:disable-next-line
    private renderExistingAnnnot(data: any, index: any, printContainer: any): any {
        if (!printContainer) {
            // tslint:disable-next-line
            let bounds: any;
            if (data.Bounds) {
                bounds = data.Bounds;
            } else {
                bounds = data.LineBounds;
            }
            let currentLeft: number = this.ConvertPointToPixel(bounds.X);
            let currentTop: number = this.ConvertPointToPixel(bounds.Y);
            let currentWidth: number = this.ConvertPointToPixel(bounds.Width);
            let currentHeight: number = this.ConvertPointToPixel(bounds.Height);
            // tslint:disable-next-line
            let currentPage: number = parseFloat(data['PageIndex']);
            let annot: PdfAnnotationBaseModel;
            annot = {
                // tslint:disable-next-line:max-line-length
                id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
            };
            this.pdfViewer.add(annot as PdfAnnotationBase);
            // tslint:disable-next-line
            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, currentPage);
        }
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
