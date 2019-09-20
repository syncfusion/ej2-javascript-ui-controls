import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { createElement } from '@syncfusion/ej2-base';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfAnnotationBase } from '../../diagram/pdf-annotation';
import { splitArrayCollection, processPathData } from '@syncfusion/ej2-drawings';
import { CheckBox } from '@syncfusion/ej2-buttons';


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
    private signatureDialog: Dialog;
    private mouseDetection: boolean;
    private oldX: number;
    private mouseX: number;
    private oldY: number;
    private mouseY: number;
    // tslint:disable-next-line
    private newObject: any = [];
    private outputString: string = '';
    // tslint:disable-next-line
    private currentTarget: any;
    private isSignatureField: boolean = false;
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
        let data: any = window.sessionStorage.getItem('formfields');
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
                window.sessionStorage.removeItem('formfields');
                window.sessionStorage.setItem('formfields', JSON.stringify(formFieldsData));
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public downloadFormFieldsData(): any {
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem('formfields');
        // tslint:disable-next-line
        let formFieldsData: any = JSON.parse(data);
        // tslint:disable-next-line
        let datas: any = {};
        for (let m: number = 0; m < formFieldsData.length; m++) {
            // tslint:disable-next-line
            let currentData: any = formFieldsData[m];
            if (currentData.Name === 'Textbox' || currentData.Name === 'Password' || currentData.Multiline) {
                datas[currentData.FieldName] = currentData.Text;
            } else if (currentData.Name === 'RadioButton' && currentData.Selected) {
                datas[currentData.GroupName] = currentData.Value;
            } else if (currentData.Name === 'CheckBox') {
                datas[currentData.GroupName] = currentData.Selected;
            } else if (currentData.Name === 'DropDown') {
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
                datas[currentData.FieldName] = JSON.stringify(csData);
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
            this.signatureDialog.show();
        }
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
    /**
     * @private
     */
    // tslint:disable-next-line
    public updateDataInSession(target: any, signaturePath?: any): void {
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem('formfields');
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
        window.sessionStorage.removeItem('formfields');
        window.sessionStorage.setItem('formfields', JSON.stringify(FormFieldsData));
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
        inputField.name = data.FieldName;
        return inputField;
    }
    // tslint:disable-next-line
    private checkIsReadonly(data: any, inputField: any): void {
        if (data.IsReadonly) {
            inputField.disabled = true;
            inputField.style.cursor = 'default';
            inputField.style.backgroundColor = 'none';
        } else {
            // tslint:disable-next-line
            let borderColor: any = data.BackColor;
            inputField.style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0.2 + ')';
            inputField.style.color = 'black';
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
            inputField.style.borderStyle = 'solid';
        }
    }
    // tslint:disable-next-line
    private applyDefaultColor(inputField: any): void {
        if (inputField.style.backgroundColor === 'rgba(255, 255, 255, 0.2)' || inputField.style.backgroundColor === 'rgba(0, 0, 0, 0.2)') {
            inputField.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
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
            if (data.SelectedValue === childItems[j]) {
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
        span.style.height = 10 + 'px';
        span.style.width = 19 + 'px';
        span.style.padding = '2px';
        span.style.textAlign = 'center';
        span.style.boxSizing = 'content-box';
        span.innerHTML = 'Sign';
        span.style.backgroundColor = 'red';
        span.style.fontSize = '8px';
        textLayer.appendChild(span);
        this.addSignaturePath(data);
        return inputField;
    }
    // tslint:disable-next-line
    private addSignaturePath(signData: any): boolean {
        this.isSignatureField = false;
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem('formfields');
        // tslint:disable-next-line
        let formFieldsData: any = JSON.parse(data);
        for (let m: number = 0; m < formFieldsData.length; m++) {
            // tslint:disable-next-line
            let currentData: any = formFieldsData[m];
            if (currentData.Name === 'ink' && currentData.FieldName === signData.FieldName && signData.Value !== '') {
                signData.Value = currentData.Value;
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
                target: this.pdfViewer.element, content: appearanceTab, width: '750px', visible: false,
                close: () => {
                    this.clearSignatureCanvas();
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
    // tslint:disable-next-line
    private renderExistingAnnnot(data: any, index: any, printContainer: any): any {
        if (!printContainer) {
            // tslint:disable-next-line
            let bounds: any = data['LineBounds'];
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

    private addSignature(): void {
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        let currentWidth: number = parseFloat(this.currentTarget.style.width) / zoomvalue;
        let currentHeight: number = parseFloat(this.currentTarget.style.height) / zoomvalue;
        let currentLeft: number = parseFloat(this.currentTarget.style.left) / zoomvalue;
        let currentTop: number = parseFloat(this.currentTarget.style.top) / zoomvalue;
        let currentPage: number = parseFloat(this.currentTarget.id.split('_')[1]);
        let annot: PdfAnnotationBaseModel;
        annot = {
            // tslint:disable-next-line:max-line-length
            id: this.currentTarget.id, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: currentPage, data: this.outputString, modifiedDate: '',
            shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
        };
        this.pdfViewer.add(annot as PdfAnnotationBase);
        // tslint:disable-next-line
        let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
        // tslint:disable-next-line
        this.pdfViewer.renderDrawing(canvass as any, currentPage);
        this.signatureDialog.hide();
        this.currentTarget.className = 'e-pdfviewer-signatureformFields signature';
        this.updateDataInSession(this.currentTarget, annot.data);
        this.currentTarget.style.pointerEvents = 'none';
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
    // tslint:disable-next-line
    public ConvertPointToPixel(number: any): any {
        return (number * (96 / 72));
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.signatureDialog) {
            this.signatureDialog.destroy();
        }
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'FormFields';
    }
}
