import { PdfViewer, FormFieldModel, FormFieldType } from '../index';
import { PdfViewerBase } from '../index';
import { Browser, isBlazor, isNullOrUndefined, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { splitArrayCollection, processPathData, cornersPointsBeforeRotation, Rect, PointModel } from '@syncfusion/ej2-drawings';
import { DiagramHtmlElement } from '../drawing/html-element';
import { ItemModel } from '../pdfviewer-model';
import { Tooltip } from '@syncfusion/ej2-popups';

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
    private maintainTabIndex: any = {};
    private maintanMinTabindex: any = {};
    private isSignatureField: boolean = false;
    /**
     * @private
     */
    public paddingDifferenceValue : number = 10;
    private indicatorPaddingValue : number = 4;
    private isKeyDownCheck: boolean = false;
    private signatureFontSizeConstent: number = 1.35;
    /**
     * @private
     */
    public readOnlyCollection: any = [];
    /**
     * @private
     */
    public currentTarget: any;
    private isSignatureRendered: boolean = false;
    /**
     * @private
     */
    public signatureFieldCollection: any = [];
    private data: any;
    private formFieldsData: any;
    private rotateAngle: number;
    private selectedIndex: number[] = [];
    /**
     * @private
     */
    public renderedPageList: number[] = [];
    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} base - It describes about the base
     * @private
     * @returns {void}
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isImportFormField - It describes about the isImportFormField
     * @private
     * @returns {void}
     */
    public renderFormFields(pageIndex: number, isImportFormField: boolean): void {
        this.maxTabIndex = 0;
        this.minTabIndex = -1;
        if (this.renderedPageList.indexOf(pageIndex) !== -1 && !isImportFormField) {
            this.data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            if (!this.data || this.data === '[]') {
                this.data = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
            }
        }
        else {
            this.data = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        }
        if (this.data) {
            this.formFieldsData = JSON.parse(this.data);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            let count : number;
            if (this.formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                let flag: boolean = false;
                for (let i: number = 0; i < this.formFieldsData.length; i++) {
                    const formField: any = this.formFieldsData[parseInt(i.toString(), 10)];
                    if (!flag && isNullOrUndefined(formField.ActualFieldName) && formField.PageIndex === pageIndex) {
                        count = parseInt(formField.FieldName.slice(formField.FieldName.lastIndexOf('_') + 1), 10);
                        flag = true;
                    }
                }
                if (this.renderedPageList.indexOf(pageIndex) === -1){
                    this.renderedPageList.push(pageIndex);
                }
                for (let i: number = 0; i < this.formFieldsData.length; i++) {
                    const currentData: any = this.formFieldsData[parseInt(i.toString(), 10)];
                    if (currentData.FieldName !== '') {
                        if (currentData.IsInitialField) {
                            currentData.Name = 'InitialField';
                        }
                        const font: any = currentData['Font'];
                        if (this.pdfViewer.formDesigner) {
                            if (parseFloat(currentData['PageIndex']) === pageIndex) {
                                let fontFamily: string;
                                let fontStyle: string;
                                let fontSize: number;
                                if (!isNullOrUndefined(font) && font.Height) {
                                    fontFamily = font.Name;
                                    if (font.Italic) {
                                        fontStyle = 'Italic';
                                    }
                                    if (font.Bold) {
                                        fontStyle = 'Bold';
                                    }
                                    if (font.Strikeout) {
                                        fontStyle = 'Strikethrough';
                                    }
                                    if (font.Underline) {
                                        fontStyle = 'Underline';
                                    }
                                    fontSize = this.ConvertPointToPixel(font.Size);
                                }
                                const textAlignment: string = currentData.Alignment === 2 ? 'right' : (currentData.Alignment === 1 ? 'center' : 'left');
                                const backgroundColor: any = currentData['BackColor'];
                                const bounds: any = currentData['LineBounds'];
                                let backColor: string = 'rgba(' + backgroundColor.R + ',' + backgroundColor.G + ',' + backgroundColor.B + ',' + 1 + ')';
                                if (currentData.IsTransparent === true) {
                                    backColor = 'rgba(0,0,0,0)';
                                }
                                backColor = this.rgbaToHex(backColor);
                                // set default color if field have black color as bg.
                                if (backColor === '#000000ff') {
                                    backColor = '#daeaf7ff';
                                }
                                const fontColor: any = currentData['FontColor'];
                                const left: number = this.ConvertPointToPixel(bounds.X);
                                const top: number = this.ConvertPointToPixel(bounds.Y);
                                const width: number = this.ConvertPointToPixel(bounds.Width);
                                const height: number = this.ConvertPointToPixel(bounds.Height);
                                let boundArray: any = {left: left, top: top, width: width, height: height};
                                let isFieldRotated : boolean = false;
                                let rotateFieldAngle : number = 0;
                                if (currentData['Rotation'] !== 0) {
                                    if (currentData['RotationAngle'] === -90 || currentData['RotationAngle'] === -270 || currentData['RotationAngle'] === -180) {
                                        boundArray = this.getBounds(boundArray, pageIndex, 0, isFieldRotated);
                                    }
                                } else {
                                    isFieldRotated = true;
                                    boundArray = this.getBounds(boundArray, pageIndex, 0, isFieldRotated);
                                    rotateFieldAngle = this.getAngle(pageIndex);
                                }
                                let foreColor: string = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
                                foreColor = this.rgbaToHex(foreColor);
                                const borderColor: any = currentData['BorderColor'];
                                let borderRGB: string;
                                if (currentData.IsTansparentBorderColor) {
                                    borderRGB = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0 + ')';
                                }
                                else {
                                    borderRGB = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
                                }
                                borderRGB = this.rgbaToHex(borderRGB);
                                const borderWidth: number = currentData['BorderWidth'];
                                this.selectedIndex = [];
                                let elementValue: string = '';
                                if (currentData.Name === 'RadioButton' || currentData.Name === 'CheckBox') {
                                    elementValue = currentData['Text'] ? currentData['Text'] : currentData['Value'];
                                }
                                else {
                                    elementValue = currentData['Text'];
                                }
                                const fieldProperties: any = {
                                    bounds: { X: boundArray.left, Y: boundArray.top, Width: boundArray.width, Height: boundArray.height }, pageNumber: parseFloat(currentData['PageIndex']) + 1, name: currentData['ActualFieldName'], tooltip: currentData['ToolTip'],
                                    value: elementValue, insertSpaces: currentData['InsertSpaces'], isChecked: currentData['Selected'], isSelected: currentData['Selected'], fontFamily: fontFamily, fontStyle: fontStyle, backgroundColor: backColor, color: foreColor, borderColor: borderRGB, thickness: borderWidth, fontSize: fontSize, isMultiline: currentData.Multiline, rotateAngle: rotateFieldAngle,
                                    isReadOnly: currentData['IsReadonly'], isRequired: currentData['IsRequired'], alignment: textAlignment, options: this.getListValues(currentData), selectedIndex: this.selectedIndex, maxLength: currentData.MaxLength, visibility: currentData.Visible  === 1 ? 'hidden' : 'visible', font: { isItalic: !isNullOrUndefined(font) ? font.Italic : false, isBold: !isNullOrUndefined(font) ? font.Bold : false, isStrikeout: !isNullOrUndefined(font) ? font.Strikeout : false, isUnderline: !isNullOrUndefined(font) ? font.Underline : false }, isTransparent: currentData.IsTransparent, customData: !isNullOrUndefined(currentData.CustomData) || !isNullOrUndefined(currentData.customData) ? (this.pdfViewerBase.clientSideRendering ? currentData.CustomData ? currentData.CustomData : currentData.customData : JSON.parse(currentData.CustomData)) : ""
                                };
                                if (!currentData.id && this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)] && !isNullOrUndefined(currentData['ActualFieldName'])) {
                                    fieldProperties.id = this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)].id;
                                }
                                if (currentData.Name === 'DropDown' || currentData.Name === 'ListBox') {
                                    fieldProperties.value = currentData['SelectedValue'];
                                }
                                const fieldType: any = this.getFormFieldType(currentData);
                                if (currentData.Name !== 'SignatureText' || currentData.Name !== 'SignatureImage') {
                                    if (!isNullOrUndefined(this.getFormFieldType(currentData))) {
                                        if (currentData.IsRequired){
                                            let thickness: number = fieldProperties.thickness;
                                            thickness = thickness > 0 ? thickness : 1;
                                            fieldProperties.thickness = thickness;
                                        }
                                        const addedElement1: any = this.pdfViewer.formDesignerModule.
                                            addFormField(fieldType, fieldProperties, false, fieldProperties.id) as any;
                                        if (addedElement1 && addedElement1.parentElement) {
                                            currentData.id = addedElement1.parentElement.id.split('_')[0];
                                        }
                                        if (addedElement1 && addedElement1.style.visibility === 'hidden')
                                        {
                                            addedElement1.childNodes[0].disabled = true;
                                        }
                                    }
                                }
                                if (fieldType === 'SignatureField' || fieldType === 'InitialField') {
                                    this.addSignaturePath(currentData, count);
                                    if (!isNullOrUndefined(currentData.Value) && currentData.Value !== '') {
                                        this.renderExistingAnnnot(currentData, parseFloat(currentData['PageIndex']) + 1, null, isFieldRotated);
                                        this.isSignatureRendered = true;
                                        count++;
                                    }
                                }
                                if (currentData.ActualFieldName == null &&  this.formFieldsData.filter((item: any) => item.FieldName.includes(currentData.FieldName.replace(/_\d$/, ''))).filter((value: any) => value.Name !== 'ink').length === 0){
                                    this.renderExistingAnnnot(currentData, parseFloat(currentData['PageIndex']) + 1, null, isFieldRotated);
                                    this.pdfViewerBase.signatureModule.storeSignatureData( pageIndex, currentData);
                                    this.isSignatureRendered = true;
                                    count++;
                                }
                                this.pdfViewerBase.isLoadedFormFieldAdded = true;
                            }
                        } else {
                            if (parseFloat(currentData['PageIndex']) === pageIndex) {
                                const field: any = this.createFormFields(currentData, pageIndex, i, null, count);
                                const inputField : any = field.currentField;
                                const signCount : number = field.count;
                                let isFieldRotated : boolean = false;
                                if (currentData.ActualFieldName === null &&  this.formFieldsData.filter((item: any) => item.FieldName.includes(currentData.FieldName.replace(/_\d$/, ''))).filter((value: any) => value.Name !== 'ink').length === 0){
                                    this.renderExistingAnnnot(currentData, parseFloat(currentData['PageIndex']) + 1, null, isFieldRotated);
                                    this.pdfViewerBase.signatureModule.storeSignatureData( pageIndex, currentData);
                                    this.isSignatureRendered = true;
                                    count++;
                                }
                                if (inputField) {
                                    const divElement: any = this.createParentElement(currentData, pageIndex);
                                    const bounds: any = currentData['LineBounds'];
                                    const font: any = currentData['Font'];
                                    let rotateAngle : number = 0;
                                    if (currentData['Rotation'] === 0) {
                                        isFieldRotated = true;
                                        rotateAngle = this.getAngle(pageIndex);
                                        if (divElement) {
                                            divElement.style.transform = 'rotate(' + rotateAngle + 'deg)';
                                        } else {
                                            inputField.style.transform = 'rotate(' + rotateAngle + 'deg)';
                                        }
                                    } else {
                                        if (divElement) {
                                            divElement.style.transform = 'rotate(' + rotateAngle + 'deg)';
                                        } else {
                                            inputField.style.transform = 'rotate(' + rotateAngle + 'deg)';
                                        }
                                    }
                                    this.applyPosition(inputField, bounds, font, pageIndex, 0, isFieldRotated);
                                    inputField.InsertSpaces = currentData.InsertSpaces;
                                    if (inputField.InsertSpaces) {
                                        const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                                        const font: number = ((parseInt(inputField.style.width, 10) / inputField.maxLength)
                                         - (parseFloat(inputField.style.fontSize) / 2)) - (0.6 * zoomFactor);
                                        inputField.style.letterSpacing = '' + font + 'px';
                                        inputField.style.fontFamily = 'monospace';
                                        inputField.style.paddingLeft = (font / 2) + 'px';
                                    }
                                    currentData['uniqueID'] = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + i;
                                    for (let j: number = 0; j < this.pdfViewer.formFieldCollections.length; j++) {
                                        if ((inputField.type === 'text' || inputField.type === 'password' || inputField.type === 'textarea') && currentData.Name !== 'SignatureField') {
                                            if (currentData['uniqueID'] === this.pdfViewer.formFieldCollections[parseInt(j.toString(), 10)].id) {
                                                this.pdfViewer.formFieldCollections[parseInt(j.toString(), 10)].value = currentData['Text'];
                                            }
                                        }
                                    }
                                    if (isNullOrUndefined(currentData.Value)) {
                                        currentData.Value = currentData['Text'];
                                    }
                                    if (currentData.ToolTip) {
                                        this.setToolTip(currentData.ToolTip, inputField);
                                    }
                                    this.applyCommonProperties(inputField, pageIndex, i, currentData, isFieldRotated);
                                    this.checkIsReadonly(currentData, inputField);
                                    this.applyTabIndex(currentData, inputField, pageIndex);
                                    this.checkIsRequiredField(currentData, inputField);
                                    this.applyDefaultColor(inputField);
                                    this.updateFormFieldsCollection(currentData);
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
                                    count = signCount;
                                }
                            }
                        }
                    }
                }
                if (!this.pdfViewer.formDesigner) {
                    window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
                    this.pdfViewerBase.setItemInSessionStorage(this.formFieldsData, '_formfields');
                }
            }
        }
        if (this.pdfViewerBase.isFocusField && this.pdfViewerBase.focusField) {
            const currentField: HTMLElement = document.getElementById(this.pdfViewerBase.focusField.id);
            if (currentField) {
                if ((this.pdfViewerBase.focusField.type === 'SignatureField' || this.pdfViewerBase.focusField.type === 'InitialField')  && this.pdfViewer.formDesignerModule) {
                    const y: number = this.pdfViewerBase.focusField.bounds.y;
                    const height: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height;
                    this.pdfViewer.bookmark.goToBookmark(this.pdfViewerBase.focusField.pageIndex, height - y);
                } else {
                    currentField.focus();
                }
                this.pdfViewerBase.isFocusField = false;
                this.pdfViewerBase.focusField = [];
            }
        }
    }

    private setToolTip(tooltipContent: string, targetElement: any): void {
        //initialize tooltip component
        const tooltip: Tooltip = new Tooltip({
            content:  initializeCSPTemplate(
                function (): string { return tooltipContent; }
            )
        });
        // render initialized tooltip
        tooltip.appendTo(targetElement);
    }

    private trim(str: string): string {
        return str.replace(/^\s+|\s+$/gm, '');
    }

    private rgbaToHex(rgba: string): string {
        const inParts: any = rgba.substring(rgba.indexOf('(')).split(',');
        const r: number = parseInt(this.trim(inParts[0].substring(1)), 10);
        const g: number = parseInt(this.trim(inParts[1]), 10);
        const b: number = parseInt(this.trim(inParts[2]), 10);
        const a: number = parseFloat(parseFloat(this.trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2));
        const outParts: string[] = [
            r.toString(16),
            g.toString(16),
            b.toString(16),
            Math.round(a * 255).toString(16).substring(0, 2)
        ];
        // Pad single-digit output values
        outParts.forEach(function (part: string, i: number): void {
            if (part.length === 1) {
                outParts[parseInt(i.toString(), 10)] = '0' + part;
            }
        });
        return ('#' + outParts.join(''));
    }

    private getListValues(currentData: any): ItemModel[] {
        const listItem: any = currentData['TextList'];
        const options: ItemModel[] = [];
        for (let i: number = 0; i < listItem.length; i++) {
            if (listItem[parseInt(i.toString(), 10)] === currentData['SelectedValue'])
            {this.selectedIndex.push(i); }
            options.push({ itemName: listItem[parseInt(i.toString(), 10)], itemValue: listItem[parseInt(i.toString(), 10)] });
        }
        if (this.getFormFieldType(currentData) === 'ListBox') {
            this.selectedIndex = currentData['SelectedList'];
        }
        return options;
    }

    private createParentElement(data: any, pageIndex: number): HTMLDivElement {
        let divElement: HTMLDivElement;
        if (data['Name'] === 'Textbox' || data['Name'] === 'Password') {
            divElement = document.createElement('div');
            divElement.style.background = 'white';
            if (data.InsertSpaces) {
                divElement.style.background = 'transparent';
            }
            const bounds: any = data['LineBounds'];
            const font: any = data['Font'];
            divElement.style.position = 'absolute';
            let isFieldRotated: boolean = false;
            if (data['Rotation'] === 0){
                isFieldRotated = true;
            }
            this.applyPosition(divElement, bounds, font, pageIndex, 0, isFieldRotated);
        }
        return divElement;
    }

    /**
     * @param {number} pageIndex -  It describes about the page index
     * @private
     * @returns {number} - number
     */
    public getAngle(pageIndex: number): number {
        let angle: any = 0;
        const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        if (pageDetails && pageDetails.rotation) {
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
        let signatureFields: any[] = this.signatureFieldCollection;
        const collectionData: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        if (signatureFields.length === 0) {
            signatureFields = this.pdfViewerBase.signatureModule.getSignField();
        }
        let currentField: any;
        if (this.currentTarget) {
            if (this.pdfViewer.formDesignerModule) {
                for (let i: number = 0; i < collectionData.length; i++) {
                    currentField = collectionData[parseInt(i.toString(), 10)];
                    if (this.currentTarget.id === currentField.id) {
                        this.currentTarget = document.getElementById(currentField.id);
                        this.getSignatureIndex(i, collectionData.length, isNextSignField);
                        break;
                    }
                }
            }
            else {
                for (let i: number = 0; i < signatureFields.length; i++) {
                    currentField = this.pdfViewer.formDesignerModule ? signatureFields[parseInt(i.toString(), 10)].
                        FormField : signatureFields[parseInt(i.toString(), 10)];
                    if (this.currentTarget.id === currentField.uniqueID) {
                        this.currentTarget = document.getElementById(currentField.uniqueID);
                        this.getSignatureIndex(i, signatureFields.length, isNextSignField);
                        break;
                    }
                }
            }
        } else {
            if (nextSign) {
                if (this.pdfViewer.formDesignerModule) {
                    currentField = signatureFields[0];
                    if (currentField.id) {
                        this.currentTarget = document.getElementById(currentField.id);
                        this.getSignatureIndex(0, signatureFields.length, isNextSignField, true);
                    }
                }
                else {
                    currentField = signatureFields[0];
                    if (currentField.uniqueID) {
                        this.currentTarget = document.getElementById(currentField.uniqueID);
                        this.getSignatureIndex(0, signatureFields.length, isNextSignField, true);
                    }
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
        const signatureFields: any = this.signatureFieldCollection;
        const collectionData: any = this.pdfViewer.formFieldCollections;
        let currentField: any;
        if (curSignIndex < collectionData.length) {
            for (let i: number = 0; i < collectionData.length; i++) {
                if (this.pdfViewer.formDesignerModule) {
                    const curSignIndexId: any = collectionData[parseInt(curSignIndex.toString(), 10)].id;
                    const signatureFieldData: any = collectionData[parseInt(i.toString(), 10)];
                    if (curSignIndexId === signatureFieldData.id) {
                        const pageIndex: any = signatureFieldData.pageIndex >= 0 ? signatureFieldData.pageIndex :
                            signatureFieldData.pageNumber;
                        const isRender: boolean = this.pdfViewer.annotationModule.findRenderPageList(pageIndex);
                        if (!isRender) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                            this.renderFormFields(pageIndex, false);
                        }
                        this.currentTarget = document.getElementById(signatureFieldData.id);
                        currentField = signatureFieldData;
                        break;
                    }
                }
                else {
                    const curSignIndexId: string = this.pdfViewer.formDesignerModule ?
                        signatureFields[parseInt(curSignIndex.toString(), 10)].FormField.uniqueID :
                        signatureFields[parseInt(curSignIndex.toString(), 10)].uniqueID;
                    const signatureFieldData: any = this.pdfViewer.formDesignerModule ? signatureFields[parseInt(i.toString(), 10)].
                        FormField : signatureFields[parseInt(i.toString(), 10)];
                    if (curSignIndexId === signatureFieldData.uniqueID) {
                        const pageIndex: number = signatureFieldData.PageIndex >= 0 ? signatureFieldData.PageIndex :
                            signatureFieldData.pageNumber;
                        const isRender: boolean = this.pdfViewer.annotationModule.findRenderPageList(pageIndex);
                        if (!isRender) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                            this.renderFormFields(pageIndex, false);
                        }
                        this.currentTarget = document.getElementById(signatureFieldData.uniqueID);
                        currentField = signatureFieldData;
                        break;
                    }
                }
            }
            if (this.currentTarget === null) {
                const pageIndex: number = currentField.PageIndex >= 0 ? currentField.PageIndex : currentField.pageNumber;
                this.pdfViewer.navigation.goToPage(pageIndex);
                this.currentTarget = document.getElementById(currentField.uniqueID);
            }
            if (this.currentTarget) {
                if (this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature' && !(this.pdfViewer.formDesignerModule)) {
                    document.getElementById(this.currentTarget.id).focus();
                    this.pdfViewer.select([this.currentTarget.id], null);
                } else if (this.currentTarget.className === 'e-pdfviewer-signatureformfields' || this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature') {
                    if (this.pdfViewer.formDesignerModule) {
                        document.getElementById(this.currentTarget.id).parentElement.focus();
                    } else {
                        document.getElementById(this.currentTarget.id).focus();
                    }
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public formFieldCollections(): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            const formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                const currentData: any = formFieldsData[parseInt(i.toString(), 10)];
                const type: FormFieldType = currentData['Name'];
                if (this.pdfViewer.formDesignerModule) {
                    if (currentData.Name !== 'ink' && currentData.Name !== 'SignatureImage' && currentData.Name !== 'SignatureText') {
                        this.retreiveFormFieldsData(currentData, true);
                    }
                } else {
                    if (currentData.Name !== 'ink') {
                        const formFieldCollection: FormFieldModel = { name: this.retriveFieldName(currentData), id: this.pdfViewer.element.id + 'input_' + parseFloat(currentData['PageIndex']) + '_' + i, isReadOnly: false, type: currentData.IsInitialField ? 'InitialField' : type, value: this.retriveCurrentValue(currentData), fontName: '', isRequired: currentData.IsRequired };
                        this.pdfViewer.formFieldCollections.push(formFieldCollection);
                    }
                }
            }
        }
    }

    private retreiveFormFieldsData(currentData: any, isCollection: boolean): void {
        let fontFamily: string;
        let fontStyle: string;
        let fontSize: number;
        if (currentData.FieldName !== '') {
            if (currentData.IsInitialField) {
                currentData.Name = 'InitialField';
            }
            const font: any = currentData['Font'];
            if (!isNullOrUndefined(font) && font.Height) {
                fontFamily = font.Name;
                if (font.Italic) {
                    fontStyle = 'Italic';
                }
                if (font.Bold) {
                    fontStyle = 'Bold';
                }
                if (font.Strikeout) {
                    fontStyle = 'Strikethrough';
                }
                if (font.Underline) {
                    fontStyle = 'Underline';
                }
                fontSize = this.ConvertPointToPixel(font.Size);
            }
            const textAlignment: string = currentData.Alignment === 2 ? 'right' : (currentData.Alignment === 1 ? 'center' : 'left');
            const backgroundColor: any = currentData['BackColor'];
            const bounds: any = currentData['LineBounds'];
            let backColor: string = 'rgba(' + backgroundColor.R + ',' + backgroundColor.G + ',' + backgroundColor.B + ',' + 1 + ')';
            backColor = this.rgbaToHex(backColor);
            // set default color if field have black color as bg.
            if (currentData.IsTransparent === true) {
                backColor = 'rgba(0,0,0,0)';
            }
            else if (backColor === '#000000ff') {
                backColor = '#daeaf7ff';
            }
            const fontColor: any = currentData['FontColor'];
            const left: number = this.ConvertPointToPixel(bounds.X);
            const top: number = this.ConvertPointToPixel(bounds.Y);
            const width: number = this.ConvertPointToPixel(bounds.Width);
            const height: number = this.ConvertPointToPixel(bounds.Height);
            const boundArray: any = { left: left, top: top, width: width, height: height };
            let foreColor: string = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
            foreColor = this.rgbaToHex(foreColor);
            const borderColor: any = currentData['BorderColor'];
            let borderRGB: string = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
            borderRGB = this.rgbaToHex(borderRGB);
            if (currentData.IsTansparentBorderColor === true) {
                borderRGB = 'rgba(0,0,0,0)';
            }
            else if (borderRGB === '#000000ff') {
                borderRGB = '#daeaf7ff';
            }
            const borderWidth: number = currentData['BorderWidth'];
            this.selectedIndex = [];
            const fieldProperties: any = {
                bounds: { X: boundArray.left, Y: boundArray.top, Width: boundArray.width, Height: boundArray.height }, pageNumber: parseFloat(currentData['PageIndex']) + 1, name: currentData['ActualFieldName'], tooltip: currentData['ToolTip'],
                value: currentData['Text'], isChecked: currentData['Selected'], isSelected: currentData['Selected'], fontFamily: fontFamily, fontStyle: fontStyle, backgroundColor: backColor, color: foreColor, borderColor: borderRGB, thickness: borderWidth, fontSize: fontSize, isMultiline: currentData.Multiline,
                isReadOnly: currentData['IsReadonly'], isRequired: currentData['IsRequired'], insertSpaces: currentData['InsertSpaces'], alignment: textAlignment, options: this.getListValues(currentData), selectedIndex: this.selectedIndex, maxLength: currentData.MaxLength, visibility: currentData.Visible === 1 ? 'hidden' : 'visible', font: { isItalic: !isNullOrUndefined(font) ? font.Italic : false, isBold: !isNullOrUndefined(font) ? font.Bold : false, isStrikeout: !isNullOrUndefined(font) ? font.Strikeout : false, isUnderline: !isNullOrUndefined(font) ? font.Underline : false }, pageIndex : currentData['PageIndex'], isTransparent : currentData['IsTransparent'], rotationAngle : currentData['RotationAngle'], signatureType : currentData['SignatureType'] ? currentData['SignatureType'] : '', signatureIndicatorSettings : currentData['SignatureIndicatorSettings'], zIndex: currentData['zIndex'], customData: currentData['customData'] ? currentData['customData'] : this.pdfViewerBase.clientSideRendering ? currentData['CustomData'] : JSON.parse(currentData['CustomData'])
            };
            if (currentData.Name === 'DropDown' || currentData.Name === 'ListBox') {
                fieldProperties.value = currentData['SelectedValue'];
            }
            const fieldType: any = this.getFormFieldType(currentData);
            if (fieldType === 'SignatureField' || fieldType === 'InitialField') {
                this.addSignaturePath(currentData);
                if (this.isSignatureField) {
                    fieldProperties.value = currentData.Value;
                }
            }
            const addedElement: any = this.pdfViewer.formDesignerModule.addFormField(fieldType, fieldProperties, isCollection) as any;
            return addedElement;
        }
        return null;
    }

    /**
     * @param {any} formField - It describes about the form field
     * @private
     * @returns {void}
     */
    public updateFormFieldsCollection(formField: any): void {
        const type: FormFieldType = formField['Name'];
        const formFieldCollection: FormFieldModel = {
            name: this.retriveFieldName(formField), id: formField.uniqueID, isReadOnly: formField.IsReadonly, isRequired: formField.IsRequired, isSelected: type === 'CheckBox' ? false : formField.Selected,
            isChecked: type === 'RadioButton' ? false : formField.Selected, type: type, value: type === 'ListBox' || type === 'DropDown' ? formField.SelectedValue : formField.Value, fontName: formField.FontFamily ? formField.FontFamily : '', pageIndex: formField.PageIndex, pageNumber: formField.PageIndex + 1, isMultiline: formField.isMultiline ? formField.isMultiline : formField.Multiline, insertSpaces: formField.insertSpaces ? formField.insertSpaces : formField.InsertSpaces, isTransparent: formField.isTransparent ? formField.isTransparent : formField.IsTransparent, rotateAngle: formField.rotateAngle ? formField.rotateAngle : formField.RotationAngle,
            selectedIndex: formField.selectedIndex ? formField.selectedIndex : formField.SelectedList,
            options: formField.options ? formField.options : formField.TextList ? formField.TextList : [],
            signatureType: formField.signatureType ? formField.signatureType : '', zIndex: formField.zIndex, tooltip: formField.tooltip ? formField.tooltip : formField.ToolTip ? formField.ToolTip : '', signatureIndicatorSettings: formField.signatureIndicatorSettings ? formField.signatureIndicatorSettings : ''
        };
        this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.
            findIndex((el: FormFieldModel) => el.id === formFieldCollection.id)] = formFieldCollection;
    }

    public updateFormFieldValues(formFields: any): void {
        this.readOnlyCollection.push(formFields.id);
        if (formFields) {
            const currentElement: any = document.getElementById(formFields.id);
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
            this.updateDataInSession(currentElement);
        }
    }

    /**
     * @param {any} currentData - It describes about the current data
     * @private
     * @returns {string} - string
     */
    public retriveFieldName(currentData: any): string {
        let currentField: any;
        switch (currentData['Name']) {
        case 'Textbox':
        case 'Password':
        case 'SignatureField':
        case 'InitialField':
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

    private retriveCurrentValue(currentData: any): string {
        let currentField: any;
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

    private getSignatureBounds(LineBounds: any, bounds: any, pageIndex: any): any {
        const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
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
     * @returns {any} - any
     */
    public downloadFormFieldsData(): any {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            const formFieldsData: any = JSON.parse(data);
            const datas: any = {};
            let fieldDatas: any = [];
            for (let m: number = 0; m < formFieldsData.length; m++) {
                const currentData: any = formFieldsData[parseInt(m.toString(), 10)];
                const isRequired: boolean = currentData.IsRequired;
                if (currentData.Name === 'Textbox' || currentData.Name === 'Password' || currentData.Multiline) {
                    if (isRequired && (currentData.Text === '' || currentData.Text === null)) {
                        this.pdfViewerBase.validateForm = true;
                        this.pdfViewerBase.nonFillableFields[currentData.FieldName] = currentData.Text;
                    } else {
                        delete (this.pdfViewerBase.nonFillableFields[currentData.FieldName]);
                    }
                    fieldDatas = {fieldValue: currentData.Text, isReadOnly: currentData.IsReadonly};
                    datas[currentData.FieldName] = fieldDatas;
                } else if (currentData.Name === 'RadioButton' && currentData.Selected) {
                    if (isRequired && currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                        this.pdfViewerBase.nonFillableFields[currentData.GroupName] = currentData.Value;
                    } else {
                        delete (this.pdfViewerBase.nonFillableFields[currentData.GroupName]);
                    }
                    fieldDatas = {fieldValue: currentData.Value, isReadOnly: currentData.IsReadonly};
                    datas[currentData.GroupName] = fieldDatas;
                } else if (currentData.Name === 'CheckBox') {
                    if (isRequired && currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                        this.pdfViewerBase.nonFillableFields[currentData.GroupName] = currentData.Selected;
                    } else {
                        delete (this.pdfViewerBase.nonFillableFields[currentData.GroupName]);
                    }
                    if (currentData.CheckboxIndex && currentData.Selected) {
                        fieldDatas = {isSelected: currentData.CheckboxIndex, isReadOnly: currentData.IsReadonly,
                            fieldValue: !isNullOrUndefined(currentData.Value) ? currentData.Value : ""};
                        datas[currentData.GroupName] = fieldDatas;
                    } else if (datas[currentData.GroupName] === undefined || datas[currentData.GroupName] === null) {
                        fieldDatas = {isSelected: currentData.Selected, isReadOnly: currentData.IsReadonly, fieldValue: currentData.Value};
                        datas[currentData.GroupName] = fieldDatas;
                    }
                } else if (currentData.Name === 'DropDown') {
                    if (isRequired && currentData.SelectedValue === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.pdfViewerBase.nonFillableFields[currentData.Text] = currentData.SelectedValue;
                    } else {
                        delete (this.pdfViewerBase.nonFillableFields[currentData.Text]);
                    }
                    fieldDatas = {fieldValue: currentData.SelectedValue, isReadOnly: currentData.IsReadonly};
                    datas[currentData.FieldName] = fieldDatas;
                } else if (currentData.Name === 'ListBox') {
                    const childItems: any = currentData['TextList'];
                    const childItemsText: string[] = [];
                    for (let m: number = 0; m < currentData.SelectedList.length; m++) {
                        const currentElement: any = currentData.SelectedList[parseInt(m.toString(), 10)];
                        childItemsText.push(childItems[`${currentElement}`]);
                    }
                    fieldDatas = { fieldValue: JSON.stringify(childItemsText), isReadOnly: currentData.IsReadonly};
                    datas[currentData.Text] = fieldDatas;
                } else if (currentData.Name === 'SignatureField' || currentData.Name === 'InitialField') {
                    let csData: any;
                    if (isRequired && (currentData.Value === null || currentData.Value === '')) {
                        this.addSignaturePath(currentData);
                    }
                    if (currentData.Value && currentData.Value !== '') {
                        csData = currentData.Value;
                        const fontFamily: any = currentData.fontFamily ? currentData.fontFamily : currentData.FontFamily;
                        if (fontFamily) {
                            datas[currentData.FieldName + 'fontName'] = fontFamily;
                            datas[currentData.FieldName + 'fontSize'] = currentData.fontSize ? currentData.fontSize : currentData.FontSize;
                        } else if (currentData.Value.split('base64,')[1]) {
                            datas[currentData.FieldName + 'ImageData'] = true;
                        } else {
                            const collectionData: any = processPathData(currentData.Value);
                            csData = splitArrayCollection(collectionData);
                        }
                    }
                    if (isRequired && (currentData.Value === null || currentData.Value === '')) {
                        this.pdfViewerBase.validateForm = true;
                        this.pdfViewerBase.nonFillableFields[currentData.FieldName] = JSON.stringify(csData);
                    } else {
                        delete (this.pdfViewerBase.nonFillableFields[currentData.FieldName]);
                    }
                    datas[currentData.FieldName] = JSON.stringify(csData);
                    if (currentData.Bounds) {
                        const bounds: any = this.getSignatureBounds(currentData.LineBounds, currentData.Bounds, currentData.PageIndex);
                        currentData.Bounds.x = bounds.x;
                        currentData.Bounds.y = bounds.y;
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(currentData.Bounds);
                    } else {
                        const lineBounds: any = currentData.LineBounds;
                        const bounds: any = { x: this.ConvertPointToPixel(lineBounds.X), y: this.ConvertPointToPixel(lineBounds.Y),
                            width: this.ConvertPointToPixel(lineBounds.Width), height: this.ConvertPointToPixel(lineBounds.Height) };
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(bounds);
                    }
                    datas[currentData.FieldName + 'isReadOnly'] = currentData.IsReadonly;
                }
            }
            return (JSON.stringify(datas));
        }
    }

    private focusFormFields(event: MouseEvent): void {
        const currentTarget: any = event.target;
        if (currentTarget && (currentTarget.className !== 'e-pdfviewer-signatureformfields' && currentTarget.className !== 'e-pdfviewer-signatureformfields e-pv-signature-focus')) {
            const backgroundcolor: any = currentTarget.style.backgroundColor;
            const currentIndex: any = backgroundcolor.lastIndexOf(',');
            const currentColor: any = backgroundcolor.slice(0, currentIndex + 1) + 0 + ')';
            currentTarget.style.backgroundColor = currentColor;
            if (currentTarget.type === 'checkbox') {
                currentTarget.style.webkitAppearance = '';
            }
            currentTarget.style.boxShadow = '0 0 5px ' + ( currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
        } else if (currentTarget) {
            if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus') {
                this.pdfViewerBase.signatureModule.setFocus(currentTarget.id);
            }
        }
    }

    private blurFormFields(event: MouseEvent): void {
        const currentTarget: any = event.target;
        if (currentTarget.InsertSpaces && this.isKeyDownCheck) {
            const font: number = parseInt(currentTarget.style.width, 10) - (parseInt(currentTarget.style.height, 10) / 2);
            currentTarget.style.width = '' + font + 'px';
            this.isKeyDownCheck = false;
        }
        if (currentTarget.type === 'checkbox') {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.checked);
        } else {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.value);
        }
        const backgroundcolor: any = currentTarget.style.backgroundColor;
        const currentIndex: any = backgroundcolor.lastIndexOf(',');
        const currentColor: any = backgroundcolor.slice(0, currentIndex + 1) + 0.2 + ')';
        currentTarget.style.backgroundColor = currentColor;
        currentTarget.style.boxShadow = 'none';
        if ((currentTarget.type === 'checkbox') && !currentTarget.checked) {
            currentTarget.style.webkitAppearance = 'none';
        } else {
            currentTarget.style.webkitAppearance = '';
        }
    }

    public updateFormFields(event: MouseEvent): void {
        let currentTarget: any = event.target;
        if (this.pdfViewerBase.isDeviceiOS && currentTarget.type === 'checkbox') {
            currentTarget.focus();
        }
        if (currentTarget.className === 'e-pdfviewer-ListBox') {
            currentTarget = currentTarget.parentElement;
            this.updateDataInSession(currentTarget);
        } else if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus') {
            this.currentTarget = currentTarget;
        } else if (currentTarget.className === 'e-pv-buttonItem' || currentTarget.type === 'button') {
            this.pdfViewer.fireButtonFieldClickEvent(currentTarget.value, currentTarget.name, currentTarget.id);
        }
        for (let m: number = 0; m < this.pdfViewer.formFieldCollections.length; m++) {
            if (currentTarget.id === this.pdfViewer.formFieldCollections[parseInt(m.toString(), 10)].id) {
                if (this.pdfViewer.formDesignerModule || this.pdfViewer.annotationModule) {
                    this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', this.pdfViewer.formFieldCollections[parseInt(m.toString(), 10)]);
                }
                if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus') {
                    this.pdfViewerBase.signatureModule.setFocus(currentTarget.id);
                }
            }
        }
    }

    /**
     * @param {string} signatureType - It describes about the signature type
     * @param {string} value - It describes about the value
     * @param {any} target - It describes about the target
     * @param {string} fontname - It describes about the font name
     * @private
     * @returns {void}
     */
    public drawSignature(signatureType?: string, value?: string, target?: any, fontname?: string): void {
        let annot: PdfAnnotationBaseModel;
        // eslint-disable-next-line
        const proxy: any = this;
        let bounds: any;
        let targetBounds: Rect;
        let parentElementBounds: Rect;
        let data: any;
        if (this.pdfViewer.formDesigner) {
            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        } else {
            data = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        }
        const formFieldsData: any = JSON.parse(data);
        let targetName: any;
        if (this.pdfViewer.formDesignerModule) {
            targetName = this.currentTarget && this.currentTarget.offsetParent ? this.currentTarget.offsetParent.name :
                this.currentTarget ? this.currentTarget.name : target.name ? target.name : target.offsetParent.name;
        }
        else {
            targetName = this.currentTarget ? this.currentTarget.name : target.name ? target.name : target.offsetParent.name;
        }
        for (let i: number = 0; i < formFieldsData.length; i++) {
            const fieldName: string = this.pdfViewer.formDesigner ? formFieldsData[parseInt(i.toString(), 10)].
                FormField.name : formFieldsData[parseInt(i.toString(), 10)].FieldName;
            if (this.pdfViewer.formDesigner ? fieldName === targetName : fieldName === targetName &&
                (!isNullOrUndefined(formFieldsData[parseInt(i.toString(), 10)].ActualFieldName))) {
                target = this.pdfViewer.formDesigner ? document.getElementById(formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]) : document.getElementById(formFieldsData[parseInt(i.toString(), 10)].uniqueID);
                const currentField: any = target;
                let signatureAdd: boolean = true;
                this.pdfViewer.annotations.filter(function (item: PdfAnnotationBase): void {
                    if (!isNullOrUndefined(currentField) && item.id === target.id + '_content') {
                        signatureAdd = false;
                    }
                });
                if (!isNullOrUndefined(currentField)) {
                    const elementId: string = currentField.offsetParent.offsetParent.id.split('_')[0];
                    const signatureField: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[`${elementId}`];
                    if (target && target.offsetParent && signatureField) {
                        targetBounds = target.getBoundingClientRect();
                        parentElementBounds = target.offsetParent.offsetParent.offsetParent.getBoundingClientRect();
                        this.pdfViewerBase.drawSignatureWithTool = true;
                        if (target.nextSibling && target.nextSibling.id.indexOf('initial') !== -1) {
                            this.pdfViewer.isInitialFieldToolbarSelection = true;
                        }
                    }
                    const currentValue: string = value ? value : this.pdfViewerBase.signatureModule.outputString;
                    let currentFont: string = fontname ? fontname : this.pdfViewerBase.signatureModule.fontName;
                    const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                    const currentWidth: number = this.pdfViewerBase.drawSignatureWithTool ?
                        targetBounds.width / zoomvalue : parseFloat(currentField.style.width) / zoomvalue;
                    const currentHeight: number = this.pdfViewerBase.drawSignatureWithTool ?
                        targetBounds.height / zoomvalue : parseFloat(currentField.style.height) / zoomvalue;
                    const currentLeft: number = this.pdfViewerBase.drawSignatureWithTool ?
                        ((targetBounds.left - parentElementBounds.left)) / zoomvalue : parseFloat(currentField.style.left) / zoomvalue;
                    const currentTop: number = this.pdfViewerBase.drawSignatureWithTool ?
                        ((targetBounds.top - parentElementBounds.top)) / zoomvalue : parseFloat(currentField.style.top) / zoomvalue;
                    const currentPage: number = this.pdfViewerBase.drawSignatureWithTool ? target.nextElementSibling ? parseFloat(target.nextElementSibling.id.split('_')[1]) : parseFloat(currentField.id.split('_')[1]) : parseFloat(currentField.id.split('_')[1]);
                    const currentIndex: number = this.pdfViewerBase.drawSignatureWithTool ? target.nextElementSibling ? parseFloat(target.nextElementSibling.id.split('_')[2]) : parseFloat(currentField.id.split('_')[2]) : parseFloat(currentField.id.split('_')[2]);
                    let signString: string = this.pdfViewerBase.signatureModule.saveImageString;
                    let signatureFontFamily: string;
                    let signatureFontSize: number;
                    let rotateAngleString: string = currentField.offsetParent.offsetParent.style.transform ?
                        currentField.offsetParent.offsetParent.style.transform : currentField.style.transform;
                    rotateAngleString = rotateAngleString.substring(rotateAngleString.indexOf('(') + 1, rotateAngleString.indexOf('d'));
                    const rotateAngle: number = rotateAngleString ? parseInt(rotateAngleString, 10) : 0;
                    if (signatureType === 'Type') {
                        if (!currentFont) {
                            currentFont = 'Helvetica';
                        }
                        bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft,
                                                    currentTop, currentWidth, currentHeight);
                        if (this.pdfViewer.signatureFitMode === 'Default') {
                            bounds = this.getDefaultBoundsforSign(bounds);
                        }
                        annot = {
                            id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                            shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureText', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: currentFont, fontSize: bounds.height / this.signatureFontSizeConstent
                        };
                        if (annot.shapeAnnotationType === 'SignatureText') {
                            const textWidth: number = this.getTextWidth(annot.data, annot.fontSize, annot.fontFamily);
                            let widthRatio: number = 1;
                            if (textWidth > bounds.width)
                            {widthRatio = bounds.width / textWidth; }
                            annot.fontSize = this.getFontSize(Math.floor((annot.fontSize * widthRatio)));
                        }
                        signString = annot.data;
                        signatureFontFamily = annot.fontFamily;
                        signatureFontSize = annot.fontSize;
                    } else if (signatureType === 'Image') {
                        bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue,
                                                    currentLeft, currentTop, currentWidth, currentHeight);
                        const image: HTMLImageElement = new Image();
                        const currentTarget: any = target;
                        image.src = currentValue;
                        image.onload = function (): void {
                            proxy.imageOnLoad(bounds, image, currentValue, currentPage, rotateAngle,
                                              currentField, signatureField, signString, signatureFontFamily,
                                              signatureFontSize, currentTarget);
                        };
                    }
                    else {
                        if ((currentValue.indexOf('base64')) !== -1) {
                            bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue,
                                                        currentLeft, currentTop, currentWidth, currentHeight);
                            if (this.pdfViewer.signatureFitMode === 'Default') {
                                bounds = this.getDefaultBoundsforSign(bounds);
                            }
                            annot = {
                                id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                                shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                            };
                            signString = annot.data;
                        } else {
                            if (this.pdfViewer.signatureFitMode === 'Default') {
                                const signatureBounds: any = this.pdfViewerBase.signatureModule.
                                    updateSignatureAspectRatio(currentValue, false, currentField);
                                bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue,
                                                            currentLeft, currentTop, signatureBounds.width, signatureBounds.height, true);
                                bounds.x = bounds.x + signatureBounds.left;
                                bounds.y = bounds.y + signatureBounds.top;
                            } else {
                                bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue,
                                                            currentLeft, currentTop, currentWidth, currentHeight);
                            }
                            annot = {
                                id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                                shapeAnnotationType: 'Path', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                            };
                        }
                    }
                    if (this.pdfViewerBase.drawSignatureWithTool && signatureField && signatureType !== 'Image') {
                        annot.id = signatureField.id + '_content';
                        const obj: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                        signatureField.wrapper.children.push(obj.wrapper);
                    } else if (signatureType !== 'Image') {
                        this.pdfViewer.add(annot as PdfAnnotationBase);
                    }
                    if (annot && annot.shapeAnnotationType === 'Path' && currentValue !== '') {
                        this.pdfViewerBase.currentSignatureAnnot = annot;
                        const position: any = { currentHeight: currentHeight, currentWidth: currentWidth,
                            currentLeft: currentLeft, currentTop: currentTop };
                        this.pdfViewerBase.signatureModule.addSignatureCollection(bounds, position);
                        signString = this.pdfViewerBase.signatureModule.saveImageString;
                        this.pdfViewerBase.currentSignatureAnnot = null;
                    }
                    if (signatureType !== 'Image') {
                        const canvass: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
                        this.pdfViewer.renderDrawing(canvass as any, currentPage);
                        this.pdfViewerBase.signatureModule.showSignatureDialog(false);
                        if (currentField.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus') {
                            currentField.className = 'e-pdfviewer-signatureformfields-signature e-pv-signature-focus';
                        } else {
                            currentField.className = 'e-pdfviewer-signatureformfields-signature';
                        }
                        if (this.pdfViewerBase.drawSignatureWithTool && signatureField) {
                            const key: string = target.offsetParent.offsetParent.id.split('_')[0] + '_content';
                            annot.bounds = { x: bounds.x * zoomvalue, y: bounds.y * zoomvalue,
                                width: bounds.width * zoomvalue, height: bounds.height * zoomvalue };
                            this.updateSignatureDataInSession(annot, key);
                        } else {
                            this.updateDataInSession(currentField, annot.data, annot.bounds, signatureFontFamily, signatureFontSize);
                        }
                        currentField.style.pointerEvents = 'none';
                        if (this.pdfViewer.annotation) {
                            this.pdfViewer.annotation.addAction(annot.pageIndex, null, annot, 'FormField Value Change', '', annot, annot);
                        }
                        if (annot.shapeAnnotationType === 'Path' || annot.shapeAnnotationType === 'SignatureText') {
                            this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType,
                                                            annot.bounds, annot.opacity, null, null, signString);
                        }
                        this.pdfViewer.fireFocusOutFormField(currentField.name, currentValue);
                    }
                }
            }
        }
        if (signatureType !== 'Image'){
            this.pdfViewerBase.signatureModule.hideSignaturePanel();
            this.pdfViewerBase.drawSignatureWithTool = false;
            this.pdfViewer.isInitialFieldToolbarSelection = false;
        }
    }

    //  EJ2-62918- Image signature width is wrong while adding programmatically and it is fixed by adding an onload event.
    //  A function was added and it was called
    private imageOnLoad(bounds: any, image: HTMLImageElement, currentValue: string, currentPage: number,
                        rotateAngle: number, currentField: any, signatureField: PdfAnnotationBase,
                        signString: string, signatureFontFamily: string,
                        signatureFontSize: number, target: any): void {
        if (target && target.offsetParent && signatureField) {
            this.pdfViewerBase.drawSignatureWithTool = true;
            if (target.nextSibling && target.nextSibling.id.indexOf('initial') !== -1) {
                this.pdfViewer.isInitialFieldToolbarSelection = true;
            }
        }
        if (this.pdfViewer.signatureFitMode === 'Default'){
            const padding: number = Math.min(bounds.height / this. paddingDifferenceValue, bounds.width / this.paddingDifferenceValue);
            const maxHeight: number = bounds.height - padding;
            const maxWidth: number = bounds.width - padding;
            const imageWidth: number = image.width;
            const imageHeight: number = image.height;
            const beforeWidth: any = bounds.width;
            const beforeHeight: any = bounds.height;
            const ratio: number = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
            bounds.width = imageWidth * ratio;
            bounds.height = imageHeight * ratio;
            bounds.x = bounds.x + (beforeWidth - bounds.width) / 2;
            bounds.y = bounds.y + (beforeHeight - bounds.height) / 2;
        }
        const annot: PdfAnnotationBaseModel = {
            id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
            shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
        };
        signString = annot.data;
        if (this.pdfViewerBase.drawSignatureWithTool && signatureField) {
            annot.id = signatureField.id + '_content';
            const obj: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
            signatureField.wrapper.children.push(obj.wrapper);
        } else {
            this.pdfViewer.add(annot as PdfAnnotationBase);
        }
        const canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
        this.pdfViewer.renderDrawing(canvass as any, currentPage);
        this.pdfViewerBase.signatureModule.showSignatureDialog(false);
        if (currentField.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus') {
            currentField.className = 'e-pdfviewer-signatureformfields-signature e-pv-signature-focus';
        } else {
            currentField.className = 'e-pdfviewer-signatureformfields-signature';
        }
        if (this.pdfViewerBase.drawSignatureWithTool && signatureField) {
            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
            const key: string = target.offsetParent.offsetParent.id.split('_')[0] + '_content';
            annot.bounds = {x: bounds.x * zoomvalue, y: bounds.y * zoomvalue, width: bounds.width * zoomvalue,
                height : bounds.height * zoomvalue };
            this.updateSignatureDataInSession(annot, key);
        } else {
            this.updateDataInSession(currentField, annot.data, annot.bounds, signatureFontFamily, signatureFontSize);
        }
        currentField.style.pointerEvents = 'none';
        if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.addAction(annot.pageIndex, null, annot, 'FormField Value Change', '', annot, annot);
        }
        if ( annot.shapeAnnotationType === 'SignatureImage'){
            this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType, annot.bounds,
                                            annot.opacity, null, null, signString);
        }
        this.pdfViewer.fireFocusOutFormField(currentField.name, currentValue);
        this.pdfViewerBase.signatureModule.hideSignaturePanel();
        this.pdfViewerBase.drawSignatureWithTool = false;
        this.pdfViewer.isInitialFieldToolbarSelection = false;
    }

    private updateSignatureDataInSession(annot: any, key: string): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        if (!isNullOrUndefined(formFieldsData)){
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[parseInt(i.toString(), 10)].Key === key) {
                    const formFieldIndex: number = this.pdfViewer.formFieldCollection.findIndex((el: any) => el.id === formFieldsData[parseInt(i.toString(), 10)].FormField.id.split('_')[0]);
                    if (annot.shapeAnnotationType === 'SignatureText') {
                        formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Text';
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Text';
                        (this.pdfViewer.nameTable as any)[`${key}`].signatureType = 'Text';
                        formFieldsData[parseInt(i.toString(), 10)].FormField.fontFamily = annot.fontFamily === 'TimesRoman' ? 'Times New Roman' : annot.fontFamily;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.fontFamily = annot.fontFamily;
                        (this.pdfViewer.nameTable as any)[`${key}`].fontFamily = annot.fontFamily;
                        formFieldsData[parseInt(i.toString(), 10)].FormField.fontSize = annot.fontSize;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.fontSize = annot.fontSize;
                        (this.pdfViewer.nameTable as any)[`${key}`].fontSize = annot.fontSize;
                        if (formFieldIndex > -1) {
                            this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)].signatureType = 'Text';
                        }
                    } else if (annot.shapeAnnotationType === 'SignatureImage') {
                        formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Image';
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Image';
                        (this.pdfViewer.nameTable as any)[`${key}`].signatureType = 'Image';
                        if (formFieldIndex > -1) {
                            this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)].signatureType = 'Image';
                        }
                    } else {
                        formFieldsData[parseInt(i.toString(), 10)].FormField.signatureType = 'Path';
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = 'Path';
                        (this.pdfViewer.nameTable as any)[`${key}`].signatureType = 'Path';
                        if (formFieldIndex > -1) {
                            this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)].signatureType = 'Path';
                        }
                    }
                    formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound = annot.bounds;
                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureBound = annot.bounds;
                    (this.pdfViewer.nameTable as any)[`${key}`].signatureBound = annot.bounds;
                    if (formFieldIndex > -1) {
                        this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)].signatureBound = annot.bounds;
                    }
                    if (annot.shapeAnnotationType === 'Path') {
                        const collectionData: any = processPathData(annot.data);
                        const csData: any = splitArrayCollection(collectionData);
                        formFieldsData[parseInt(i.toString(), 10)].FormField.value = JSON.stringify(csData);
                        (this.pdfViewer.nameTable as any)[`${key}`].value = annot.data;
                        (this.pdfViewer.nameTable as any)[key.split('_')[0]].value = annot.data;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = JSON.stringify(csData);
                        if (formFieldIndex > -1) {
                            this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)].value = JSON.stringify(csData);
                        }
                    } else {
                        formFieldsData[parseInt(i.toString(), 10)].FormField.value = annot.data;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = annot.data;
                        (this.pdfViewer.nameTable as any)[key.split('_')[0]].value = annot.data;
                        (this.pdfViewer.nameTable as any)[`${key}`].value = annot.data;
                        if (formFieldIndex > -1) {
                            this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)].value = annot.data;
                        }
                    }
                    this.pdfViewer.formDesigner.updateFormFieldCollections(formFieldsData[parseInt(i.toString(), 10)].FormField);
                    this.pdfViewer.formDesigner.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField, true, false, false,
                                                                                 false, false, false, false, false, false, false, false, false, false, false, false, false,  '', formFieldsData[parseInt(i.toString(), 10)].FormField.value);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(formFieldsData, '_formDesigner');
    }

    /**
     * @param {any} bounds - It describes about the bounds
     * @private
     * @returns {any} - any
     */
    public getDefaultBoundsforSign(bounds: any): any{
        return { x: bounds.x + 4, y: bounds.y + 4, width: bounds.width - 8, height: bounds.height - 8 };
    }

    /**
     * @param {number} currentIndex - It describes about the current index
     * @param {number} rotateAngle - It describes about the rorate angle
     * @param {number} currentPage - It describes about the current page
     * @param {number} zoomvalue - It describes about the zoom value
     * @param {number} currentLeft - It describes about the current left
     * @param {number} currentTop - It describes about the current top
     * @param {number} currentWidth - It describes about the current width
     * @param {number} currentHeight - It describes about the current height
     * @param {boolean} isDraw - It describes about the isDraw
     * @private
     * @returns {any} - any
     */
    public getSignBounds(currentIndex: number, rotateAngle: number, currentPage: number, zoomvalue: number,
                         currentLeft: number, currentTop: number, currentWidth: number, currentHeight: number, isDraw?: boolean): any {
        let bounds: any;
        const signatureId: string = this.pdfViewer.isInitialFieldToolbarSelection ? 'initialIcon' : 'signIcon';
        const signIcon: HTMLElement = document.getElementById(signatureId + '_' + currentPage + '_' + currentIndex);
        const signLeft: number = signIcon ? parseFloat(signIcon.style.left) * zoomvalue : 0;
        let difference: number = (currentLeft * zoomvalue) - (signLeft / zoomvalue);
        if (rotateAngle === 90 || rotateAngle === 270) {
            this.rotateAngle = 0;
            if (signIcon.style.left !== '') {
                if (isDraw) {
                    return bounds = { x: currentLeft - (difference / zoomvalue) - zoomvalue,
                        y: currentTop + (difference / zoomvalue) + zoomvalue, width: currentWidth, height: currentHeight };
                }
                else {
                    return bounds = { x: currentLeft - (difference / zoomvalue) - zoomvalue,
                        y: currentTop + (difference / zoomvalue) + zoomvalue, width: currentHeight, height: currentWidth };
                }
            }
            else {
                difference = 10;
                if (isDraw) {
                    return bounds = { x: currentLeft - currentWidth, y: currentTop + currentWidth,
                        width: currentHeight, height: currentWidth };
                } else {
                    return bounds = { x: currentLeft - currentWidth - difference / 2, y: currentTop + currentWidth + difference,
                        width: currentHeight, height: currentWidth };
                }
            }
        } else {
            this.rotateAngle = 0;
            return bounds = { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight };
        }
    }

    private updateSameFieldsValue(event: any): void {
        if (this.formFieldsData) {
            for (let i: number = 0; i < this.formFieldsData.length; i++) {
                const currentField: any = this.formFieldsData[parseInt(i.toString(), 10)];
                if (event.target.name === currentField.FieldName && event.target.id !== currentField.uniqueID) {
                    const currentTarget: any = document.getElementById(this.formFieldsData[parseInt(i.toString(), 10)].uniqueID);
                    if (currentTarget) {
                        currentTarget.value = event.target.value;
                    } else {
                        currentField.Text = event.target.value;
                        this.pdfViewerBase.setItemInSessionStorage(this.formFieldsData, '_formfields');
                    }
                }
            }
        }
    }

    private updateFormFieldsValue(event: MouseEvent | KeyboardEvent): void {
        const currentTarget: any = event.target;
        let fieldIndex: any;
        let nextFields: any;
        if (currentTarget.InsertSpaces && !this.isKeyDownCheck) {
            const font: number = parseInt(currentTarget.style.width, 10) + (parseInt(currentTarget.style.height, 10) / 2);
            currentTarget.style.width = '' + font + 'px';
            this.isKeyDownCheck = true;
        }
        if (event.which === 9 && currentTarget && (currentTarget.className === 'e-pdfviewer-formFields' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature')) {
            const id: any = currentTarget.id.split('input_')[1].split('_')[0];
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + parseInt(id, 10));
            const currentFields: any = textLayer.getElementsByClassName('e-pdfviewer-formFields');
            let istabindexed: boolean = true;
            fieldIndex = this.pdfViewer.formFieldCollections.findIndex((field: FormFieldModel) => field.id === currentTarget.id);
            if ((!event.shiftKey && (event as KeyboardEvent).key === 'Tab')) {
                nextFields = fieldIndex + 1 < this.pdfViewer.formFieldCollections.length ?
                    this.pdfViewer.formFieldCollections[fieldIndex + 1] : this.pdfViewer.formFieldCollections[0];
            }
            this.pdfViewer.focusFormField(nextFields);
            istabindexed = true;
            event.preventDefault();
            let tabindex: number = currentTarget.tabIndex + 1;
            while (!istabindexed) {
                for (let l: number = 0; l < currentFields.length; l++) {
                    istabindexed = false;
                    if (currentFields[parseInt(l.toString(), 10)].tabIndex === (tabindex)) {
                        currentFields[parseInt(l.toString(), 10)].focus();
                        istabindexed = true;
                        event.preventDefault();
                        break;
                    }
                }
                if (this.maintainTabIndex[`${id}`] === tabindex) {
                    istabindexed = true;
                }
                tabindex = tabindex + 1;
            }
        }
        if ((event.shiftKey && (event as KeyboardEvent).key === 'Tab')) {
            const fieldIndex: number =
            this.pdfViewer.formFieldCollections.findIndex((field: FormFieldModel) => field.id === currentTarget.id);
            const nextField: any = fieldIndex > 0 ? this.pdfViewer.formFieldCollections[fieldIndex - 1] :
                this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.length - 1];
            this.pdfViewer.focusFormField(nextField);
            event.preventDefault();
        }
        if ((event.currentTarget as any).classList.contains('e-pdfviewer-signatureformfields') ||
            (event.currentTarget as any).classList.contains('e-pdfviewer-signatureformfields-signature')) {
            if ((event as KeyboardEvent).key === 'Enter') {
                const currentTarget: any = event.target;
                for (let m: number = 0; m < this.pdfViewer.formFieldCollections.length; m++) {
                    if (currentTarget.id === this.pdfViewer.formFieldCollections[parseInt(m.toString(), 10)].id) {
                        this.pdfViewerBase.signatureModule.setFocus(currentTarget.id);
                        this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', this.pdfViewer.formFieldCollections[parseInt(m.toString(), 10)]);
                    }
                }
            } else {
                event.preventDefault();
            }
        }
    }

    private changeFormFields(event: MouseEvent): void {
        const currentTarget: any = event.target;
        this.updateDataInSession(currentTarget);
    }

    /**
     * @param {any} target - It describes about the target
     * @param {any} signaturePath - It describes about the signature path
     * @param {any} signatureBounds - It describes about the signature bounds
     * @param {string} signatureFontFamily - It describes about the signature font family
     * @param {number} signatureFontSize   - It describes about the signature font size
     * @private
     * @returns {void}
     */
    public updateDataInSession(target: any, signaturePath?: any, signatureBounds?: any, signatureFontFamily?: string,
                               signatureFontSize?: number): void {
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        let filterFields: any[] = [];
        let fieldsByName: string = ' ';
        let filterFieldName: any[] = [];
        let filterArrayLength: number = 0;
        const data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data && !this.pdfViewer.formDesignerModule){
            const FormFieldsData: any = JSON.parse(data);
            filterFields = FormFieldsData.filter((item: any) => item.uniqueID === target.id);
            if (filterFields.length > 0){
                fieldsByName = filterFields[0].FieldName;
                filterFieldName = FormFieldsData.filter((item: any) => item.FieldName === fieldsByName);
                filterArrayLength = filterFieldName.length;
            }
            for (let m: number = 0; m < FormFieldsData.length; m++) {
                const currentData: any = FormFieldsData[parseInt(m.toString(), 10)];
                if (currentData.uniqueID === target.id || fieldsByName === currentData.FieldName ) {
                    if (target && target.type === 'text' || target.type === 'password' || target.type === 'textarea') {
                        const signField: HTMLElement = target as HTMLElement;
                        if (signField.classList.contains('e-pdfviewer-signatureformfields') || signField.classList.contains('e-pdfviewer-signatureformfields-signature')) {
                            if (signaturePath) {
                                currentData.Value = signaturePath;
                            }
                            if (signatureBounds) {
                                currentData.Bounds = signatureBounds;
                            }
                            if (signatureFontFamily) {
                                currentData.FontFamily = signatureFontFamily;
                                currentData.FontSize = signatureFontSize;
                            }
                        } else {
                            currentData.Text = target.value;
                            currentData.Value = target.value;
                            currentData.Multiline = target.multiline;
                        }
                    } else if (target.type === 'radio') {
                        if (target.checked){
                            for (let l: number = 0; l < FormFieldsData.length; l++) {
                                if (FormFieldsData[parseInt(l.toString(), 10)].GroupName === target.name) {
                                    FormFieldsData[parseInt(l.toString(), 10)].Selected = false;
                                }
                            }
                            if (target.value === currentData.Value) {
                                currentData.Selected = true;
                                break;
                            }
                            else {
                                currentData.Selected = false;
                            }
                        }
                        if (target.selected) {
                            currentData.Selected = true;
                        }
                        if (currentData.Value === '' || currentData.Value !== target.value) {
                            currentData.Value = target.value;
                        }
                    } else if (target.type === 'checkbox') {
                        const targetCheckBox : any = target.id;
                        const filterCheckBoxSameName : any = FormFieldsData.filter((sameNameCheckboxField: any) => (sameNameCheckboxField.GroupName === target.name) && sameNameCheckboxField.Name === 'CheckBox');
                        for (let l: number = 0; l < filterCheckBoxSameName.length; l++) {
                            const currentType: any = filterCheckBoxSameName[parseInt(l.toString(), 10)];
                            if (currentType.uniqueID !== targetCheckBox) {
                                currentType.Selected = false;
                                currentType.checked = false;
                            }
                            const currentTarget: any = document.getElementById(currentType.uniqueID);
                            if (currentTarget) {
                                if (targetCheckBox !== currentTarget.id) {
                                    currentTarget.Selected = false;
                                    currentTarget.checked = false;
                                    currentTarget.style.webkitAppearance = 'none';
                                }
                            }
                        }
                        if (target.checked && target.id === currentData.uniqueID) {
                            currentData.Selected = true;
                        } else {
                            currentData.Selected = false;
                        }
                        if (currentData.Value === ''){
                            currentData.Value = target.value;
                        }
                    } else if (target.type === 'select-one' && target.size === 0) {
                        if (target.selectedIndex < 0) {
                            target.selectedIndex = currentData.selectedIndex;
                        }
                        const currentValue: any = target.options[target.selectedIndex].text;
                        const childrens: any = target.children;
                        for (let k: number = 0; k < childrens.length; k++) {
                            if (childrens[parseInt(k.toString(), 10)].text === currentValue) {
                                currentData.SelectedValue = currentValue;
                                currentData.selectedIndex = target.selectedIndex;
                            }
                        }
                    } else if (target.type === 'select-multiple' || target.size > 0) {
                        const currentValue: any = target.selectedOptions;
                        currentData.SelectedList = [];
                        for (let z: number = 0; z < currentValue.length; z++) {
                            const childrens: any = target.children;
                            for (let k: number = 0; k < childrens.length; k++) {
                                if (childrens[parseInt(k.toString(), 10)] === currentValue[parseInt(z.toString(), 10)]) {
                                    currentData.SelectedList.push(k);
                                }
                            }
                        }
                        currentData.SelectedValue = target.value;
                        const index: number = currentData.TextList ? currentData.TextList.indexOf(target.value) : 0;
                        currentData.selectedIndex = index > -1 ? index : 0;
                        currentData.SelectedList = [currentData.selectedIndex];
                    }
                    if (target.disabled) {
                        currentData.IsReadonly = true;
                    }
                    currentData.IsRequired = target.Required ? target.Required : (target.required ? target.required : false);
                    currentData.ToolTip = target.tooltip ? target.tooltip : '';
                    this.updateFormFieldsCollection(currentData);
                    filterArrayLength--;
                    if (filterArrayLength === 0)
                    {break; }
                } else if (target && target.getAttribute('list') != null && target.type === 'text' && currentData.uniqueID === target.list.id) {
                    currentData.SelectedValue = target.value;
                }
                this.updateFormFieldsCollection(currentData);
            }
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
            this.pdfViewerBase.setItemInSessionStorage(FormFieldsData, '_formfields');
        }
        if (this.pdfViewer.formDesignerModule && target && target.id) {
            const selectedItem: any = (this.pdfViewer.nameTable as any)[target.id.split('_')[0]];
            if (selectedItem && selectedItem.wrapper && selectedItem.wrapper.children[0]) {
                selectedItem.value = target.value;
                const point: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.pdfViewer.formDesignerModule.
                    updateFormDesignerFieldInSessionStorage(point, selectedItem.wrapper.children[0] as DiagramHtmlElement,
                                                            selectedItem.formFieldAnnotationType, selectedItem);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public removeExistingFormFields(): void{
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        if (formFieldsData) {
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'RadioButton'){
                    let buttonItem: any = [];
                    buttonItem = formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem;
                    const sameButtonItemId: string = formFieldsData[parseInt(i.toString(), 10)].FormField.id.split('_')[0];
                    for (let j: number = 0; j < buttonItem.length; j++) {
                        const otherButton: any = buttonItem[parseInt(j.toString(), 10)];
                        if (otherButton.id.split('_')[0] !== sameButtonItemId) {
                            this.pdfViewer.formDesignerModule.deleteFormField(otherButton.id.split('_')[0]);
                        }
                    }
                }
                if (formFieldsData[parseInt(i.toString(), 10)].Key) {
                    this.pdfViewer.formDesignerModule.deleteFormField(formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]);
                }
            }
        }
    }

    private applyCommonProperties(inputdiv: any, pageIndex: number, index: number, currentData: any, isFieldRotated?: boolean): void {
        const inputField: HTMLElement = document.getElementById(this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
        if (inputField) {
            const textLayer: any = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            if (inputdiv.type === 'text' && inputField.parentElement !== textLayer) {
                inputField.parentElement.remove();
            }
            if (!(inputField.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus')){
                inputField.remove();
            }
        }
        const signIcon: HTMLElement = document.getElementById('signIcon_' + pageIndex + '_' + index);
        const left: number = parseFloat(inputdiv.style.left);
        const top: number = parseInt(inputdiv.style.top, 10);
        const width: number = parseFloat(inputdiv.style.width);
        const height: number = parseFloat(inputdiv.style.height);
        let signIconWidth: number;
        let signIconHeght: number;
        let hightDifference: number;
        let widthDifference: number;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        if (signIcon && !isFieldRotated) {
            signIconWidth = parseFloat(signIcon.style.width);
            signIconHeght = parseFloat(signIcon.style.height);
            if (signIcon.style.transform === 'rotate(90deg)') {
                signIcon.style.transform = 'rotate(0deg)';
                hightDifference = height / 2;
                widthDifference = signIconWidth * zoomvalue;
                signIcon.style.left = ((left - (hightDifference - (signIconWidth * zoomvalue))) + (widthDifference / 2)) + 'px';
            }
            if (signIcon.style.transform === 'rotate(180deg)') {
                signIcon.style.transform = 'rotate(0deg)';
                signIcon.style.left = left + 'px';
                signIcon.style.top = (top) + 'px';
            }
            if (signIcon.style.transform === 'rotate(270deg)') {
                signIcon.style.transform = 'rotate(0deg)';
                hightDifference = height / 2;
                widthDifference = signIconWidth * zoomvalue;
                signIcon.style.left = ((left - (hightDifference - widthDifference)) + (widthDifference / 2)) + 'px';
                signIcon.style.top = (top) + 'px';
            }
        }
        if (currentData.IsSignatureField && this.isSignatureField) {
            inputdiv.className = 'e-pdfviewer-signatureformfields-signature';
            inputdiv.style.pointerEvents = 'none';
        } else if (currentData.IsSignatureField) {
            if (currentData.Value) {
                inputdiv.className = 'e-pdfviewer-signatureformfields-signature';
                inputdiv.style.pointerEvents = 'none';
            } else {
                inputdiv.className = 'e-pdfviewer-signatureformfields';
            }
        } else if (currentData.Name !== 'Button') {
            inputdiv.className = 'e-pdfviewer-formFields';
        }
        inputdiv.id = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index;
        inputdiv.ariaLabel = this.pdfViewer.element.id + 'input_' + pageIndex;
        inputdiv.style.zIndex = 1000;
    }

    /**
     * @param {any} currentData - It describes about the current data
     * @param {number} pageIndex - It describes about the page index
     * @param {number} index - It describes about the index
     * @param {any} printContainer - It describes about the print container
     * @param {number} count - It describes about the count
     * @private
     * @returns {any} - any
     */
    public createFormFields(currentData: any, pageIndex: number, index?: number, printContainer?: any, count?: number): any {
        let currentField: any;
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
        case 'InitialField':
        case 'SignatureField': {
            currentField = this.createSignatureField(currentData, pageIndex, index, printContainer, count);
            let isFieldRotated: boolean = false;
            if (currentData['Rotation'] === 0){
                isFieldRotated = true;
            }
            if (currentData.Value && currentData.Value !== '') {
                this.renderExistingAnnnot(currentData, index, printContainer, isFieldRotated);
                this.isSignatureRendered = true;
                count++;
            }
            break;
        }
        case 'Button':
            currentField = this.createButtonField(currentData, pageIndex);
            break;
        case 'ink':
            if (this.pdfViewer.formDesignerModule){
                if (currentData.Value && currentData.Value !== '' && !this.isSignatureRendered) {
                    this.renderExistingAnnnot(currentData, index, printContainer);
                }
            }
            break;
        case 'SignatureText':
        case 'SignatureImage':
            if (currentData.Value && currentData.Value !== '' && !this.isSignatureRendered) {
                this.renderExistingAnnnot(currentData, index, printContainer);
            }
            break;
        }
        return {currentField, count};
    }

    private getFormFieldType(currentData: any): any {
        let currentField: any;
        switch (currentData['Name']) {
        case 'Textbox':
            currentField = 'Textbox';
            break;
        case 'Password':
            currentField = 'Password';
            break;
        case 'RadioButton':
            currentField = 'RadioButton';
            break;
        case 'CheckBox':
            currentField = 'CheckBox';
            break;
        case 'DropDown':
            currentField = 'DropDown';
            break;
        case 'ListBox':
            currentField = 'ListBox';
            break;
        case 'SignatureField':
            currentField = 'SignatureField';
            if (currentData.IsInitialField) {
                currentField = 'InitialField';
            }
            break;
        case 'InitialField':
            currentField = 'InitialField';
            break;
        }
        return currentField;
    }

    private createButtonField(data: any, pageIndex: number): HTMLInputElement {
        const inputField: HTMLInputElement = document.createElement('input');
        if (data.Value && (this.isBase64(data.Value) || this.isURL(data.Value))) {
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

    /**
     * Returns the boolean value based on the imgae source base64
     *
     * @param {string} imageSrc - Passing the image source.
     * @returns {boolean} - boolean
     */
    private isBase64(imageSrc: string): boolean {
        return /^data:([a-zA-Z]*\/[a-zA-Z+.-]*);base64,/.test(imageSrc);
    }

    /**
     * Returns the boolean value based on the imgae source URL
     *
     * @param {string} imageSrc - Passing the image source.
     * @returns {boolean} - boolean
     */
    private isURL(imageSrc: string): boolean {
        try {
            new URL(imageSrc);
            return true;
        } catch {
            return false;
        }
    }

    private createTextBoxField(data: any, pageIndex: number, type: string): any {
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

    private checkIsReadonly(data: any, inputField: any): void {
        let isReadonly: boolean = false;
        for (let n: number = 0; n < this.readOnlyCollection.length; n++) {
            if (inputField.id === this.readOnlyCollection[parseInt(n.toString(), 10)]) {
                isReadonly = true;
                break;
            }
        }
        if (!this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule && (data.IsInitialField || data.IsSignatureField)) {
            isReadonly = true;
        }
        if (data.IsReadonly || (!this.pdfViewer.enableFormFields) || isReadonly) {
            inputField.disabled = true;
            inputField.style.cursor = 'default';
            inputField.style.backgroundColor = 'transparent';
        } else {
            const borderColor: any = data.BackColor;
            inputField.style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0.2 + ')';
            const fontColor: any = data.FontColor;
            inputField.style.color = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
        }
    }

    /**
     * @param {boolean} isReadonly - It describes about the isReadOnly value
     * @private
     * @returns {void}
     */
    public formFieldsReadOnly(isReadonly: boolean): void {
        const formFields: HTMLCollectionOf<Element> = document.getElementsByClassName('e-pdfviewer-formFields');
        this.makeformFieldsReadonly(formFields, isReadonly);
        const signatureFields: HTMLCollectionOf<Element> = document.getElementsByClassName('e-pdfviewer-signatureformfields');
        this.makeformFieldsReadonly(signatureFields, isReadonly);
    }

    private makeformFieldsReadonly(formFields: any, isReadonly: boolean): void {
        for (let i: number = 0; i < formFields.length; i++) {
            if (formFields[parseInt(i.toString(), 10)]) {
                const inputField: any = formFields[parseInt(i.toString(), 10)];
                if (!isReadonly) {
                    inputField.disabled = true;
                    inputField.style.cursor = 'default';
                } else {
                    inputField.disabled = false;
                }
            }
        }
    }

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
    private checkIsRequiredField(data: any, inputField: any): void {
        if (data.IsRequired) {
            inputField.required = true;
            inputField.style.border = '1px solid red';
        } else {
            const borderColor: any = data.BorderColor;
            inputField.style.border = data.BorderWidth;
            inputField.style.borderColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
        }
        if (inputField.type !== 'checkbox' && inputField.type !== 'radio') {
            const borderStyle: number = data.BorderStyle;
            this.addBorderStylePropety(borderStyle, inputField);
        }
    }
    private applyDefaultColor(inputField: any): void {
        if (inputField.type !== 'button' && (inputField.style.backgroundColor === 'rgba(255, 255, 255, 0.2)' || inputField.style.backgroundColor === 'rgba(0, 0, 0, 0.2)') || inputField.style.backgroundColor === 'rgba(218, 234, 247, 0.2)') {
            inputField.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
        }
        if (inputField.style.color === 'rgba(255, 255, 255, 0.2)') {
            inputField.style.color = 'black';
        }
    }
    private addAlignmentPropety(data: any, inputField: any): void {
        const alignment: any = data.Alignment;
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
    private addBorderStylePropety(borderStyle: number, inputField: any): void {
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
    private createRadioBoxField(data: any, pageIndex: number, type: string, printContainer?: any): HTMLInputElement {
        const inputField: HTMLInputElement = document.createElement('input');
        inputField.type = type;
        if (data.Selected) {
            inputField.checked = true;
        }
        else if (type === 'checkbox' && !printContainer){
            inputField.style.webkitAppearance = 'none';
        }
        inputField.name = data.GroupName;
        inputField.value = data.Value;
        return inputField;
    }
    private createDropDownField(data: any, pageIndex: number, index: number, printContainer: any): any {
        let inputField: any = document.createElement('select');
        const childItems: any = data['TextList'];
        if (data.Selected && !printContainer) {
            const previousField: any = document.getElementById('editableDropdown' + pageIndex + '_' + index);
            if (previousField) {
                previousField.remove();
            }
            const inputFields: any = document.createElement('input');
            inputFields.id = 'editableDropdown' + pageIndex + '_' + index;
            inputFields.setAttribute('list', this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
            const bounds: any = data['LineBounds'];
            const font: any = data['Font'];
            inputFields.style.position = 'absolute';
            inputFields.style.border = '0px';
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
            const option: HTMLOptionElement = document.createElement('option');
            option.className = 'e-dropdownSelect';
            if (data.SelectedValue === childItems[parseInt(j.toString(), 10)] || data.selectedIndex === j) {
                option.selected = true;
            } else {
                option.selected = false;
            }
            option.innerHTML = childItems[parseInt(j.toString(), 10)];
            inputField.appendChild(option);
        }
        inputField.name = data.Text;
        return inputField;
    }
    private createListBoxField(data: any, pageIndex: number): HTMLSelectElement {
        const inputField: HTMLSelectElement = document.createElement('select');
        const childItems: any = data['TextList'];
        if (data.MultiSelect) {
            inputField.multiple = true;
        } else {
            inputField.multiple = false;
            inputField.size = childItems.length;
        }
        for (let j: number = 0; j < childItems.length; j++) {
            const option: HTMLOptionElement = document.createElement('option');
            option.className = 'e-pdfviewer-ListBox';
            for (let k: number = 0; k < data.SelectedList.length; k++) {
                if (data.SelectedList[parseInt(k.toString(), 10)] === j) {
                    option.selected = true;
                }
            }
            option.innerHTML = childItems[parseInt(j.toString(), 10)];
            inputField.appendChild(option);
        }
        inputField.name = data.Text;
        return inputField;
    }

    private createSignatureField(data: any, pageIndex: number, index: number, printContainer: any, count?: number): HTMLInputElement {
        const inputField: HTMLInputElement = document.createElement('input');
        inputField.type = 'text';
        inputField.name = data.FieldName;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        const previousField: HTMLElement = document.getElementById('signIcon_' + pageIndex + '_' + index);
        if (previousField && !printContainer) {
            previousField.remove();
        }
        this.pdfViewerBase.isInitialField = data.IsInitialField;
        const signIndicator: string = this.pdfViewerBase.isInitialField ? 'Initial' : 'Sign';
        //check whether the width for sign indicator has default value or not and then set the default width value for initial field.
        const signatureFieldIndicatorWidth: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ?
            (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width === 19 ?
                (this.pdfViewerBase.isInitialField ? 27 : 19) :
                this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width) : 19;
        const span: any = document.createElement('span');
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        const bounds: any = data['LineBounds'];
        const left: number = this.ConvertPointToPixel(bounds.X);
        const top: number = this.ConvertPointToPixel(bounds.Y);
        const indicatorWidth : number = this.ConvertPointToPixel(bounds.Width);
        const indicatorHeight : number = this.ConvertPointToPixel(bounds.Height);
        const height: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ?
            (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height > indicatorHeight * zoomvalue / 2 ?
                indicatorHeight * zoomvalue / 2 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height) :
            indicatorHeight * zoomvalue / 2;
        const width: number = signatureFieldIndicatorWidth > indicatorWidth * zoomvalue / 2 ? indicatorWidth * zoomvalue / 2 :
            signatureFieldIndicatorWidth;
        const size: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ?
            (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize > height / 2 ? 10 :
                this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize) : 10;
        const fontSize : number = size > width ? width / 2 : (size > height ? height / 2 : size);
        span.style.position = 'absolute';
        span.id = 'signIcon_' + pageIndex + '_' + index;
        const rotation: number = this.getAngle(pageIndex);
        const annotBounds: any = { left: left, top: top, width: width, height: height };
        const fieldBounds: any = this.getBounds(annotBounds, pageIndex);
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
        if (!((height + this.indicatorPaddingValue) > indicatorHeight * zoomvalue) &&
         !((width + this.indicatorPaddingValue) > indicatorWidth * zoomvalue)){
            span.style.padding = '2px';
        }
        span.style.textAlign = 'center';
        span.style.boxSizing = 'content-box';
        span.innerHTML = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ?
            (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text ?
                this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text : signIndicator) : signIndicator;
        span.style.color = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color : 'black') : 'black';
        span.style.backgroundColor = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor : 'orange') : 'orange';
        span.style.opacity = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ?
            (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity ?
                this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity : 1) : 1;
        if (!isNullOrUndefined(textLayer)){
            textLayer.appendChild(span);
        }
        this.addSignaturePath(data, count);
        return inputField;
    }

    private addSignaturePath(signData: any, count?: number): boolean {
        this.isSignatureField = false;
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            const formFieldsData: any = JSON.parse(data);
            for (let m: number = 0; m < formFieldsData.length; m++) {
                const currentData: any = formFieldsData[parseInt(m.toString(), 10)];
                if (currentData.ActualFieldName === null && count && (currentData.Name === 'ink' || currentData.Name === 'SignatureField' || currentData.Name === 'SignatureImage' || currentData.Name === 'SignatureText') && (this.pdfViewer.formDesigner ? ((currentData.FieldName.split('_')[0] ) === (signData.ActualFieldName) || (currentData.FieldName.split('_')[0]) === (signData.FieldName)) : ((currentData.FieldName.split('_')[0] === (signData.FieldName )) && !isNullOrUndefined(signData.ActualFieldName)) && currentData.Value && currentData.Value !== '')) {
                    signData.Value = currentData.Value;
                    signData.FontFamily = currentData.FontFamily;
                    signData.FontSize = currentData.FontSize;
                    this.isSignatureField = true;
                    signData.Bounds = currentData.LineBounds;
                }
                if (currentData.ActualFieldName === null && count && (currentData.Name === 'ink' || currentData.Name === 'SignatureField' || currentData.Name === 'SignatureImage' || currentData.Name === 'SignatureText') && this.pdfViewer.formDesigner ? currentData.FieldName === signData.ActualFieldName + '_' + count || currentData.FieldName === signData.FieldName + '_' + count : ((currentData.FieldName === signData.FieldName + '_' + count || currentData.FieldName === signData.ActualFieldName + '_' + count) && !isNullOrUndefined(signData.ActualFieldName)) && currentData.Value && currentData.Value !== '') {
                    signData.Value = currentData.Value;
                    signData.FontFamily = currentData.FontFamily;
                    signData.FontSize = currentData.FontSize;
                    this.isSignatureField = true;
                    if (!signData.Bounds) {
                        signData.Bounds = currentData.LineBounds;
                    }
                    break;
                }
            }
        }
        return this.isSignatureField;
    }

    private getBounds(bound: any, pageIndex: number, rotation?: any, isFieldRotated? : boolean): any {
        const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        let bounds: any;
        if (rotation > 0) {
            bounds = this.getBoundsPosition(rotation, bound, pageDetails, isFieldRotated);
        } else {
            bounds = this.getBoundsPosition(pageDetails.rotation, bound, pageDetails, isFieldRotated);
        }
        return bounds;
    }

    private getBoundsPosition(rotation: number, bound: any, pageDetails: any, isFieldRotated?: boolean): void {
        let bounds: any;
        if (!isFieldRotated) {
            switch (rotation) {
            case 90:
                bounds = { left: pageDetails.width - bound.top - bound.height, top: bound.left, width: bound.height, height: bound.width };
                break;
            case 180:
                bounds = { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height,
                    width: bound.width, height: bound.height };
                break;
            case 270:
                bounds = { left: bound.top, top: pageDetails.height - bound.left - bound.width, width: bound.height, height: bound.width };
                break;
            case 0:
                bounds = bound;
                break;
            case 1:
                bounds = { left: pageDetails.width - bound.top - bound.height, top: bound.left, width: bound.height, height: bound.width };
                break;
            case 2:
                bounds = { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height,
                    width: bound.width, height: bound.height };
                break;
            case 3:
                bounds = { left: bound.top, top: pageDetails.height - bound.left - bound.width, width: bound.height, height: bound.width };
                break;
            }
            if (!bounds) {
                bounds = bound;
            }
        } else {
            switch (rotation) {
            case 0:
                bounds = bound;
                break;
            case 1:
                bounds = { left: pageDetails.width - bound.top - bound.height - (bound.width / 2 - bound.height / 2),
                    top: bound.left + (bound.width / 2 - bound.height / 2), width: bound.width, height: bound.height };
                break;
            case 2:
                bounds = { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height,
                    width: bound.width, height: bound.height };
                break;
            case 3:
                bounds = { left: bound.top - (bound.width / 2 - bound.height / 2), top: (pageDetails.height - bound.left -
                    bound.width + (bound.width / 2 - bound.height / 2)), width: bound.width, height: bound.height };
                break;
            }
            if (!bounds) {
                bounds = bound;
            }
        }
        return bounds;
    }

    private applyPosition(inputField: any, bounds: any, font: any, pageIndex?: number, rotation?: number, isFieldRotated?: boolean): void {
        if (bounds) {
            const left: number = this.ConvertPointToPixel(bounds.X);
            const top: number = this.ConvertPointToPixel(bounds.Y);
            const width: number = this.ConvertPointToPixel(bounds.Width);
            const height: number = this.ConvertPointToPixel(bounds.Height);
            let fontHeight: number = 0;
            const fieldBounds: any = { left: left, top: top, width: width, height: height };
            const annotBounds: any = this.getBounds(fieldBounds, pageIndex, rotation, isFieldRotated);
            if (!isNullOrUndefined(font) && font.Height) {
                inputField.style.fontFamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                fontHeight = this.ConvertPointToPixel(font.Size);
            }
            this.pdfViewerBase.setStyleToTextDiv(inputField, annotBounds.left, annotBounds.top, fontHeight, annotBounds.width,
                                                 annotBounds.height, false);
        }
    }

    private renderExistingAnnnot(data: any, index: any, printContainer: any, isFieldRotated?: boolean): void {
        if (!printContainer) {
            let bounds: any;
            if (data.Bounds && data.Name !== 'ink') {
                bounds = data.Bounds;
            } else {
                bounds = data.LineBounds;
            }
            let currentLeft: number;
            let currentTop: number;
            let currentWidth: number;
            let currentHeight: number;
            if (bounds.x || bounds.y || bounds.width || bounds.height) {
                currentLeft = bounds.x;
                currentTop = bounds.y;
                currentWidth = bounds.width;
                currentHeight = bounds.height;
            } else {
                currentLeft = this.ConvertPointToPixel(bounds.X);
                currentTop = this.ConvertPointToPixel(bounds.Y);
                currentWidth = this.ConvertPointToPixel(bounds.Width);
                currentHeight = this.ConvertPointToPixel(bounds.Height);
            }
            const currentPage: number = parseFloat(data['PageIndex']);
            const bound: any = { left: currentLeft, top: currentTop, width: currentWidth, height: currentHeight };
            const newBounds: any = this.updateSignatureBounds(bound, currentPage, isFieldRotated);
            let annot: PdfAnnotationBaseModel;
            const fontFamily: any = data.FontFamily ? data.FontFamily : data.fontFamily;
            if ((this.pdfViewerBase.isSignatureImageData(data.Value))) {
                annot = {
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: isFieldRotated ? this.getAngle(currentPage) : 0, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            } else if (this.pdfViewerBase.isSignaturePathData(data.Value)) {
                let bound: any = newBounds;
                const tempBounds: any = { left: newBounds.x, top: newBounds.y, width: newBounds.width, height: newBounds.height };
                bound = this.updateSignatureBounds(tempBounds, currentPage, false);
                annot = {
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: bound, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            }
            else {
                annot = {
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle: isFieldRotated ? this.getAngle(currentPage) : 0, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: data.FontFamily, fontSize: data.FontSize
                };
                annot.fontFamily = fontFamily === 'TimesRoman' ? 'Times New Roman' : fontFamily;
                annot.fontSize = data.FontSize ? data.FontSize : data.fontSize;
            }
            if ((data.Name === 'SignatureField' || data.Name === 'InitialField') && !isNullOrUndefined(data.id)) {
                const elementId: string = data.id;
                const signatureFieldElement: HTMLElement = document.getElementById(elementId + '_content_html_element');
                const signatureField: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[`${elementId}`];
                annot.id = signatureField.id + '_content';
                const obj: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                signatureField.wrapper.children.push(obj.wrapper);
                if (!isNullOrUndefined(signatureFieldElement) && this.isSignatureField) {
                    const inputField: any = signatureFieldElement.children[0].children[0];
                    inputField.style.pointerEvents = 'none';
                    inputField.className = 'e-pdfviewer-signatureformfields-signature';
                    inputField.parentElement.style.pointerEvents = 'none';
                }
                else if (!isNullOrUndefined(signatureFieldElement) && data.Value){
                    const inputField: any = signatureFieldElement.children[0].children[0];
                    inputField.style.pointerEvents = 'none';
                    inputField.className = 'e-pdfviewer-signatureformfields-signature';
                    inputField.parentElement.style.pointerEvents = 'none';
                }
            } else {
                const target: HTMLElement = document.getElementById(annot.id);
                if (target && (target as any).classList.contains('e-pdfviewer-signatureformfields-signature')) {
                    this.pdfViewer.annotation.deleteAnnotationById(annot.id);
                }
                this.pdfViewer.add(annot as PdfAnnotationBase);
                if (target) {
                    this.updateDataInSession(target, annot.data, annot.bounds);
                    this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType,
                                                    annot.bounds, annot.opacity, annot.strokeColor, annot.thickness, annot.data);
                }
            }
            data.Bounds = annot.bounds;
            if (this.pdfViewer.formDesignerModule) {
                const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                annot.bounds = {x: currentLeft * zoomvalue, y: currentTop * zoomvalue, width: currentWidth * zoomvalue,
                    height : currentHeight * zoomvalue };
                this.updateSignatureDataInSession(annot, annot.id);
            }
            const canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
            this.pdfViewer.renderDrawing(canvass as any, currentPage);
        }
    }

    /**
     * @param {any} bound - It describes about the bound
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isFieldRotated - It describes about the isFieldRotated
     * @private
     * @returns {any} - any
     */
    public updateSignatureBounds(bound: any, pageIndex: number, isFieldRotated : boolean): any {
        const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        if (pageDetails) {
            if (!isFieldRotated){
                if (pageDetails.rotation === 1) {
                    return { x: pageDetails.width - bound.top - bound.height, y: bound.left, width: bound.height, height: bound.width };
                } else if (pageDetails.rotation === 2) {
                    return { x: pageDetails.width - bound.left - bound.width, y: pageDetails.height - bound.top - bound.height,
                        width: bound.width, height: bound.height };
                } else if (pageDetails.rotation === 3) {
                    return { x: bound.top, y: (pageDetails.height - bound.left - bound.width), width: bound.height, height: bound.width };
                } else {
                    return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
                }}
            else {
                if (pageDetails.rotation === 1) {
                    return { x: pageDetails.width - bound.top - bound.height - (bound.width / 2 - bound.height / 2),
                        y: bound.left + (bound.width / 2 - bound.height / 2), width: bound.width, height: bound.height };
                } else if (pageDetails.rotation === 2) {
                    return { x: pageDetails.width - bound.left - bound.width, y: pageDetails.height - bound.top - bound.height,
                        width: bound.width, height: bound.height };
                } else if (pageDetails.rotation === 3) {
                    return { x: bound.top - (bound.width / 2 - bound.height / 2), y: (pageDetails.height - bound.left - bound.width +
                        (bound.width / 2 - bound.height / 2)), width: bound.width, height: bound.height };
                } else {
                    return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
                }
            }
        } else {
            return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
        }
    }

    public resetFormFields(): void {
        const formFieldData: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        for (let i: number = 0; i < formFieldData.length; i++) {
            const currentData: FormFieldModel = formFieldData[parseInt(i.toString(), 10)];
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
                const annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[currentData.id];
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

    /**
     * @private
     * @returns {void}
     */
    public clearFormFieldStorage(): void {
        const sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        let maxSessionSize: number = 4500;
        if (this.pdfViewerBase.isDeviceiOS || this.pdfViewerBase.isMacSafari){
            maxSessionSize = 2000;
        }
        if (this.pdfViewerBase.isStorageExceed) {
            const storageLength: number = window.sessionStorage.length;
            const formFieldsList: any = [];
            for (let i: number = 0; i < storageLength; i++) {
                if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                    if (window.sessionStorage.key(i).split('_')[3] === 'formfields') {
                        this.pdfViewerBase.formFieldStorage[window.sessionStorage.key(i)] =
                        window.sessionStorage.getItem(window.sessionStorage.key(i));
                        formFieldsList.push(window.sessionStorage.key(i));
                    }
                    else if (window.sessionStorage.key(i).split('_')[3] === 'formDesigner') {
                        this.pdfViewerBase.formFieldStorage[window.sessionStorage.key(i)] =
                        window.sessionStorage.getItem(window.sessionStorage.key(i));
                        formFieldsList.push(window.sessionStorage.key(i));
                    }
                }
            }
            if (formFieldsList) {
                for (let i: number = 0; i < formFieldsList.length; i++) {
                    window.sessionStorage.removeItem(formFieldsList[parseInt(i.toString(), 10)]);
                }
            }
        }
    }

    public clearFormFields(formField?: any): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            let formFieldsData: any;
            if (formField) {
                formFieldsData = [formField];
            } else {
                formFieldsData = JSON.parse(data);
            }
            let isFirstRadio: boolean = true;
            for (let m: number = 0; m < formFieldsData.length; m++) {
                const currentData: any = formFieldsData[parseInt(m.toString(), 10)];
                if (formField) {
                    currentData.uniqueID = formField.id;
                    currentData.Name = formField.type;
                }
                this.currentTarget = document.getElementById(currentData.uniqueID);
                if (currentData.Name === 'Textbox') {
                    this.currentTarget.value = '';
                } else if (currentData.Name === 'RadioButton') {
                    if (isFirstRadio) {
                        this.currentTarget.checked = true;
                        this.updateDataInSession(this.currentTarget);
                        isFirstRadio = false;
                    }
                } else if (currentData.Name === 'DropDown') {
                    this.currentTarget.value = currentData.TextList[0];
                } else if (currentData.Name === 'CheckBox') {
                    this.currentTarget.checked = false;
                } else if (currentData.Name === 'SignatureField' || currentData.Name === 'InitialField') {
                    let annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[currentData.uniqueID];
                    if ((annotation as any).propName !== 'annotations'){
                        annotation = (this.pdfViewer.nameTable as any)[currentData.uniqueID + '_content'];
                    }
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
                        this.pdfViewer.annotation.deleteAnnotationById(annotation.id);
                    }
                }
                if (currentData.Name !== 'SignatureField' && currentData.Name !== 'ink' && currentData.Name !== 'RadioButton') {
                    this.updateDataInSession(this.currentTarget);
                }
            }
        }
    }

    /**
     * @param {any} number - It describes about the number
     * @private
     * @returns {number} - number
     */
    public ConvertPointToPixel(number: number): number {
        return (number * (96 / 72));
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.currentTarget = null;
        this.readOnlyCollection = [];
        if (this.pdfViewerBase && this.pdfViewerBase.signatureModule)
        {this.pdfViewerBase.signatureModule.destroy(); }
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'FormFields';
    }

    /**
     * @private
     * @param {any} text - It describes about the text
     * @param {any} font - It describes about the font
     * @param {any} fontFamily - It describes about the font family
     * @returns {number} - number
     */
    public getTextWidth(text: any, font: any, fontFamily: any): number {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        let fontName: string;
        if (font) {
            fontName = font + 'px' + ' ' + fontFamily;
        }
        context.font = fontName || getComputedStyle(document.body).font;
        const textWidth: number = context.measureText(text).width;
        this.pdfViewerBase.releaseCanvas(canvas);
        return textWidth;
    }

    /**
     * @private
     * @param {number} fontSize - Font size.
     * @returns {number} - Returns the font size.
     */
    public getFontSize(fontSize: number): number {
        return fontSize ;
    }
}
