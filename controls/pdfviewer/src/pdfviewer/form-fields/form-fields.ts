/* eslint-disable */
import { PdfViewer, FormFieldModel, FormFieldType } from '../index';
import { PdfViewerBase } from '../index';
import { createElement, Browser, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
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
    // eslint-disable-next-line
    private maintainTabIndex: any = {};
    // eslint-disable-next-line
    private maintanMinTabindex: any = {};
    private isSignatureField: boolean = false;
    private  paddingDifferenceValue : number = 10;
    private indicatorPaddingValue : number = 4;
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
    private selectedIndex: number[] = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public renderedPageList: number[] = [];
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
     public renderFormFields(pageIndex: number, isImportFormField: boolean): void {
        this.maxTabIndex = 0;
        this.minTabIndex = -1;
        // eslint-disable-next-line        
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
            // eslint-disable-next-line
            this.formFieldsData = JSON.parse(this.data);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            let count : number;
            if (this.formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                let flag: boolean = false;
                for (var i = 0; i < this.formFieldsData.length; i++) {
                    let formField: any = this.formFieldsData[i];
                    if (!flag && isNullOrUndefined(formField.ActualFieldName) && formField.PageIndex === pageIndex) {
                        count = parseInt(formField.FieldName.slice(formField.FieldName.lastIndexOf("_")+1));
                        flag = true;
                    }
                }
                if(this.renderedPageList.indexOf(pageIndex) === -1){
                    this.renderedPageList.push(pageIndex);
                }
                for (let i: number = 0; i < this.formFieldsData.length; i++) {
                    // eslint-disable-next-line
                    let currentData: any = this.formFieldsData[i]; 
                    if (currentData.FieldName !== '') {
                        if (currentData.IsInitialField) {
                            currentData.Name = 'InitialField';
                        }
                        // eslint-disable-next-line
                        let font: any = currentData['Font'];
                        if (this.pdfViewer.formDesigner) {
                          if (parseFloat(currentData['PageIndex']) == pageIndex) {
                            
                            let fontFamily: string;
                            let fontStyle: string;
                            let fontSize: number;
    
                            if (font !== null && font.Height) {
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
                            let textAlignment: string = currentData.Alignment === 2 ? 'right' : (currentData.Alignment === 1 ? 'center' : 'left');
                            let backgroundColor: any = currentData['BackColor'];
                            let bounds: any = currentData['LineBounds'];
                            let backColor: string = 'rgba(' + backgroundColor.R + ',' + backgroundColor.G + ',' + backgroundColor.B + ',' + 1 + ')';
                            if (currentData.IsTransparent === true) {
                                backColor = "rgba(0,0,0,0)";
                            }
                            backColor = this.rgbaToHex(backColor);
                            // set default color if field have black color as bg.
                            if (backColor === '#000000ff') {
                                backColor = '#daeaf7ff';
                            }
                            // eslint-disable-next-line
                            let fontColor: any = currentData['FontColor'];
                            const left: number = this.ConvertPointToPixel(bounds.X);
                            const top: number = this.ConvertPointToPixel(bounds.Y);
                            const width: number = this.ConvertPointToPixel(bounds.Width);
                            const height: number = this.ConvertPointToPixel(bounds.Height);
                            let boundArray: any = {left: left, top: top, width: width, height: height};
                            let isFieldRotated : boolean = false;
                            let rotateFieldAngle : number = 0;
                            if (currentData["Rotation"] !== 0) {
                                if (currentData["RotationAngle"] === -90 || currentData["RotationAngle"] === -270 || currentData["RotationAngle"] === -180) {
                                    boundArray = this.getBounds(boundArray, pageIndex, 0, isFieldRotated);
                                }
                            } else {
                                isFieldRotated = true;
                                boundArray = this.getBounds(boundArray, pageIndex, 0, isFieldRotated);
                                rotateFieldAngle = this.getAngle(pageIndex);
                            }
                            let foreColor: string = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
                            foreColor = this.rgbaToHex(foreColor);
                            let borderColor: any = currentData['BorderColor'];
                            let borderRGB: string = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
                            borderRGB = this.rgbaToHex(borderRGB);
                            let borderWidth: number = currentData['BorderWidth'];
                            this.selectedIndex = [];
 
                            var elementValue = "";
                            if (currentData.Name === 'RadioButton') {
                                elementValue = currentData['Text'] ? currentData['Text'] : currentData['Value'];
                            }
                            else {
                                elementValue = currentData['Text'];
                            } 
                            let fieldProperties: any = {
                                bounds: { X: boundArray.left, Y: boundArray.top, Width: boundArray.width, Height: boundArray.height }, pageNumber: parseFloat(currentData['PageIndex']) + 1, name: currentData['ActualFieldName'], tooltip: currentData['ToolTip'],
                                value: elementValue,insertSpaces: currentData['InsertSpaces'], isChecked: currentData['Selected'], isSelected: currentData['Selected'], fontFamily: fontFamily, fontStyle: fontStyle, backgroundColor: backColor, color: foreColor, borderColor: borderRGB, thickness: borderWidth, fontSize: fontSize, isMultiline: currentData.Multiline, rotateAngle: rotateFieldAngle,
                                isReadOnly: currentData['IsReadonly'], isRequired: currentData['IsRequired'], alignment: textAlignment, options: this.getListValues(currentData), selectedIndex: this.selectedIndex, maxLength: currentData.MaxLength, visibility: currentData.Visible  === 1 ? "hidden" : "visible", font: { isItalic: !isNullOrUndefined(font) ? font.Italic : false, isBold: !isNullOrUndefined(font) ? font.Bold : false, isStrikeout: !isNullOrUndefined(font) ? font.Strikeout : false, isUnderline: !isNullOrUndefined(font) ? font.Underline : false }, isTransparent: currentData.IsTransparent
                            };
                              if (!currentData.id && this.pdfViewer.formFieldCollections[i] && !isNullOrUndefined(currentData['ActualFieldName'])) {
                                  fieldProperties.id = this.pdfViewer.formFieldCollections[i].id;
                              }
                            if (currentData.Name === 'DropDown' || currentData.Name === 'ListBox') {
                                fieldProperties.value = currentData['SelectedValue']
                            }
                             // eslint-disable-next-line
                            let fieldType: any = this.getFormFieldType(currentData)
                            if (currentData.Name !== 'SignatureText' || currentData.Name !== 'SignatureImage') {
                                if (!isNullOrUndefined(this.getFormFieldType(currentData))) {
                                    if(currentData.IsRequired){
                                        let thickness: number = fieldProperties.thickness;
                                        thickness = thickness > 0 ? thickness : 1;
                                        fieldProperties.thickness = thickness;
                                    }
                                    let addedElement1: any = this.pdfViewer.formDesignerModule.addFormField(fieldType, fieldProperties, false, fieldProperties.id) as any;
                                    if (addedElement1 && addedElement1.parentElement) {
                                        currentData.id = addedElement1.parentElement.id.split('_')[0];
                                    }
                                    if(addedElement1 &&addedElement1.style.visibility === "hidden")
                                            {
                                              addedElement1.childNodes[0].disabled = true;
                                            }
                                }
                            } 
                            if (fieldType === 'SignatureField' || fieldType === 'InitialField') {
                                this.addSignaturePath(currentData, count);
                                if (!isNullOrUndefined(currentData.Value)) {
                                    this.renderExistingAnnnot(currentData, parseFloat(currentData['PageIndex']) + 1, null, isFieldRotated);
                                    this.isSignatureRendered = true;
                                    count++;
                                }
                            }
                            if(currentData.ActualFieldName===null &&  this.formFieldsData.filter((item:any)=> item.FieldName.includes(currentData.FieldName.replace(/_\d$/, ''))).filter((value:any)=>value.Name!='ink').length===0){
                                this.renderExistingAnnnot(currentData, parseFloat(currentData['PageIndex']) + 1, null, isFieldRotated);
                                this.pdfViewerBase.signatureModule.storeSignatureData( pageIndex, currentData);
                                this.isSignatureRendered = true;
                                count++;
                            }
                                this.pdfViewerBase.isLoadedFormFieldAdded = true; 
                          }
                        } else {
                            // eslint-disable-next-line
                            if (parseFloat(currentData['PageIndex']) == pageIndex) {
                                // eslint-disable-next-line
                                let field: any = this.createFormFields(currentData, pageIndex, i, null, count);
                                let inputField : any = field.currentField;
                                let signCount : number = field.count;
                                let isFieldRotated : boolean = false;
                                if(currentData.ActualFieldName===null &&  this.formFieldsData.filter((item:any)=> item.FieldName.includes(currentData.FieldName.replace(/_\d$/, ''))).filter((value:any)=>value.Name!='ink').length===0){
                                    this.renderExistingAnnnot(currentData, parseFloat(currentData['PageIndex']) + 1, null, isFieldRotated);
                                    this.pdfViewerBase.signatureModule.storeSignatureData( pageIndex, currentData);
                                    this.isSignatureRendered = true;
                                    count++;
                                }
                                if (inputField) {
                                    // eslint-disable-next-line
                                    let divElement: any = this.createParentElement(currentData, pageIndex);
                                    // eslint-disable-next-line
                                    let bounds: any = currentData['LineBounds'];
                                    // eslint-disable-next-line
                                    let font: any = currentData['Font'];
                                    // eslint-disable-next-line
                                    var rotateAngle : number= 0;
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
                                        let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                                        // eslint-disable-next-line
                                        let font: number = ((parseInt(inputField.style.width) / inputField.maxLength) - (parseFloat(inputField.style.fontSize) / 2)) - (0.6 * zoomFactor);
                                        // eslint-disable-next-line
                                        inputField.style.letterSpacing = '' + font + 'px';
                                        inputField.style.fontFamily = 'monospace';
                                        inputField.style.paddingLeft = (font / 2) + 'px';
                                    }
                                    // eslint-disable-next-line
                                    currentData['uniqueID'] = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + i;
                                    for (let j: number = 0; j < this.pdfViewer.formFieldCollections.length; j++) {
                                        if ((inputField.type === 'text' || inputField.type === 'password' || inputField.type === 'textarea') && currentData.Name !== 'SignatureField') {
                                            if (currentData['uniqueID'] === this.pdfViewer.formFieldCollections[j].id) {
                                                this.pdfViewer.formFieldCollections[j].value = currentData['Text']; 
                                            }
                                        }
                                    }
                                    if (isNullOrUndefined(currentData.Value)) {
                                        currentData.Value = currentData['Text']
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
            let currentField: any = document.getElementById(this.pdfViewerBase.focusField.id);
            if (currentField) {
                if ((this.pdfViewerBase.focusField.type === "SignatureField" || this.pdfViewerBase.focusField.type === "InitialField")  && this.pdfViewer.formDesignerModule) {
                    let y: number = this.pdfViewerBase.focusField.bounds.y;
                    let height: number = this.pdfViewerBase.pageSize[pageIndex].height;
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
        let tooltip: Tooltip = new Tooltip({
            content: tooltipContent
        });
        // render initialized tooltip
        tooltip.appendTo(targetElement);
    }
    
    private trim(str: string): string {
        return str.replace(/^\s+|\s+$/gm, '');
    }

    private rgbaToHex(rgba: string): string {
        let inParts: any = rgba.substring(rgba.indexOf("(")).split(",");
        let r: number = parseInt(this.trim(inParts[0].substring(1)), 10);
        let g: number = parseInt(this.trim(inParts[1]), 10);
        let b: number = parseInt(this.trim(inParts[2]), 10);
        let a: number = parseFloat(parseFloat(this.trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2));
        var outParts = [
            r.toString(16),
            g.toString(16),
            b.toString(16),
            Math.round(a * 255).toString(16).substring(0, 2)
        ];

        // Pad single-digit output values
        outParts.forEach(function (part, i) {
            if (part.length === 1) {
                outParts[i] = '0' + part;
            }
        })

        return ('#' + outParts.join(''));
    }

    private getListValues(currentData: any): any {
        let listItem: any = currentData['TextList'];
        let options: ItemModel[] = [];
        for (let i: number = 0; i < listItem.length; i++) {
            if (listItem[i] === currentData['SelectedValue'])
                this.selectedIndex.push(i);
            options.push({ itemName: listItem[i], itemValue: listItem[i] })
        }
        if (this.getFormFieldType(currentData) === 'ListBox') {
            this.selectedIndex = currentData['SelectedList'];
        }
        return options;
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
            let isFieldRotated: boolean = false;
            if(data['Rotation'] === 0){
                isFieldRotated = true;
            }
            this.applyPosition(divElement, bounds, font, pageIndex, 0, isFieldRotated);
        }
        return divElement;
    }

    /**
     * @private
     */
     public getAngle(pageIndex: number): number {
        // eslint-disable-next-line
        let angle: any = 0;
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
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
        // eslint-disable-next-line
        let signatureFields: any[] = this.signatureFieldCollection;
        let collectionData: any = this.pdfViewer.formFieldCollections;
        if (signatureFields.length === 0) {
            signatureFields = this.getSignField();
        }
        // eslint-disable-next-line
        let currentField: any;
        if (this.currentTarget) {
            if (this.pdfViewer.formDesignerModule) {
                for (let i: number = 0; i < collectionData.length; i++) {
                    currentField = collectionData[i];
                    if (this.currentTarget.id === currentField.id) {
                        this.currentTarget = document.getElementById(currentField.id);
                        this.getSignatureIndex(i, collectionData.length, isNextSignField);
                        break;
                    }
                }
            }
            else {
                for (let i: number = 0; i < signatureFields.length; i++) {
                    currentField = this.pdfViewer.formDesignerModule ? signatureFields[i].FormField : signatureFields[i];
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
                    currentField = signatureFields[0]
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
        // eslint-disable-next-line
        let signatureFields: any = this.signatureFieldCollection;
        let collectionData: any = this.pdfViewer.formFieldCollections;
        // eslint-disable-next-line
        let currentField: any;
        if (curSignIndex < collectionData.length) {
            for (let i: number = 0; i < collectionData.length; i++) {
                if (this.pdfViewer.formDesignerModule) {
                    let curSignIndexId: any = collectionData[curSignIndex].id;
                    let signatureFieldData: any = collectionData[i];
                    if (curSignIndexId === signatureFieldData.id) {
                        var pageIndex = signatureFieldData.pageIndex >= 0 ? signatureFieldData.pageIndex : signatureFieldData.pageNumber;
                        var isRender = this.pdfViewer.annotationModule.findRenderPageList(pageIndex);
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
                    let curSignIndexId: string = this.pdfViewer.formDesignerModule ? signatureFields[curSignIndex].FormField.uniqueID : signatureFields[curSignIndex].uniqueID
                    let signatureFieldData: any = this.pdfViewer.formDesignerModule ? signatureFields[i].FormField : signatureFields[i];
                    if (curSignIndexId === signatureFieldData.uniqueID) {
                        let pageIndex: number = signatureFieldData.PageIndex >= 0 ? signatureFieldData.PageIndex : signatureFieldData.pageNumber;
                        const isRender: boolean = this.pdfViewer.annotationModule.findRenderPageList(pageIndex);
                        if (!isRender) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                            this.renderFormFields(pageIndex, false)
                        }
                        this.currentTarget = document.getElementById(signatureFieldData.uniqueID);
                        currentField = signatureFieldData;
                        break;
                    }
                }
            }
            if (this.currentTarget === null) {
                let pageIndex: number = currentField.PageIndex >= 0 ? currentField.PageIndex : currentField.pageNumber;
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
                let signatureFieldId: string = this.pdfViewer.formDesignerModule?this.signatureFieldCollection[i].FormField.uniqueID: this.signatureFieldCollection[i].uniqueID;
                let signatureElement: HTMLElement = document.getElementById(signatureFieldId);
                if (signatureElement) {
                    signatureElement.classList.remove('e-pv-signature-focus');
                }
            }
            if(this.pdfViewer.formFieldsModule.currentTarget){
                this.pdfViewer.formFieldsModule.currentTarget.classList.remove('e-pv-signature-focus');
            }        
		}
    }

    // eslint-disable-next-line
    private getSignField(): any[] {
        if (this.pdfViewer.formDesignerModule) {
            this.signatureFieldCollection =
            this.pdfViewer.formDesignerModule.getFormDesignerSignField(this.signatureFieldCollection);
        } else {
            this.signatureFieldCollection = this.getFormFieldSignField();
        } 
        return this.signatureFieldCollection;
    }

    private getFormFieldSignField(): any[] {
        // eslint-disable-next-line
        let data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        // eslint-disable-next-line
        let currentData: any;
        if (data) {
            // eslint-disable-next-line
            let formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                currentData = formFieldsData[i];
                if (currentData.Name === 'SignatureField' || currentData.Name === 'InitialField') {
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
        let data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            // eslint-disable-next-line
            let formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                // eslint-disable-next-line
                let currentData: any = formFieldsData[i];
                // eslint-disable-next-line
                let type: FormFieldType = currentData['Name'];
                if (this.pdfViewer.formDesignerModule) {
                    if (currentData.Name !== 'ink' && currentData.Name !== 'SignatureImage' && currentData.Name !== 'SignatureText') {
                        this.retreiveFormFieldsData(currentData, true);
                    }
                } else {
                    if (currentData.Name !== 'ink') {
                        // eslint-disable-next-line
                        let formFieldCollection: FormFieldModel = { name: this.retriveFieldName(currentData), id: this.pdfViewer.element.id + 'input_' + parseFloat(currentData['PageIndex']) + '_' + i, isReadOnly: false, type: currentData.IsInitialField ? 'InitialField' : type, value: this.retriveCurrentValue(currentData), fontName: '', isRequired: currentData.IsRequired };
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
            // eslint-disable-next-line
            let font: any = currentData['Font'];
            if (font !== null && font.Height) {
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
            let textAlignment: string = currentData.Alignment === 2 ? 'right' : (currentData.Alignment === 1 ? 'center' : 'left');
            let backgroundColor: any = currentData['BackColor'];
            let bounds: any = currentData['LineBounds'];
            let backColor: string = 'rgba(' + backgroundColor.R + ',' + backgroundColor.G + ',' + backgroundColor.B + ',' + 1 + ')';
            backColor = this.rgbaToHex(backColor);
            // set default color if field have black color as bg.
            if (currentData.IsTransparent === true) {
                backColor = "rgba(0,0,0,0)";
            }
            else if (backColor === '#000000ff') {
                backColor = '#daeaf7ff';
            }
            // eslint-disable-next-line
            let fontColor: any = currentData['FontColor'];
            const left: number = this.ConvertPointToPixel(bounds.X);
            const top: number = this.ConvertPointToPixel(bounds.Y);
            const width: number = this.ConvertPointToPixel(bounds.Width);
            const height: number = this.ConvertPointToPixel(bounds.Height);
            let boundArray: any = { left: left, top: top, width: width, height: height };
            let foreColor: string = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
            foreColor = this.rgbaToHex(foreColor);
            let borderColor: any = currentData['BorderColor'];
            let borderRGB: string = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
            borderRGB = this.rgbaToHex(borderRGB);
            let borderWidth: number = currentData['BorderWidth'];
            this.selectedIndex = [];
            let fieldProperties: any = {
                bounds: { X: boundArray.left, Y: boundArray.top, Width: boundArray.width, Height: boundArray.height }, pageNumber: parseFloat(currentData['PageIndex']) + 1, name: currentData['ActualFieldName'], tooltip: currentData['ToolTip'],
                value: currentData['Text'], isChecked: currentData['Selected'], isSelected: currentData['Selected'], fontFamily: fontFamily, fontStyle: fontStyle, backgroundColor: backColor, color: foreColor, borderColor: borderRGB, thickness: borderWidth, fontSize: fontSize, isMultiline: currentData.Multiline,
                isReadOnly: currentData['IsReadonly'], isRequired: currentData['IsRequired'],insertSpaces: currentData['InsertSpaces'], alignment: textAlignment, options: this.getListValues(currentData), selectedIndex: this.selectedIndex, maxLength: currentData.MaxLength, visibility: currentData.Visible === 1 ? "hidden" : "visible", font: { isItalic: !isNullOrUndefined(font) ? font.Italic : false, isBold: !isNullOrUndefined(font) ? font.Bold : false, isStrikeout: !isNullOrUndefined(font) ? font.Strikeout : false, isUnderline: !isNullOrUndefined(font) ? font.Underline : false }
            };
            if (currentData.Name === 'DropDown' || currentData.Name === 'ListBox') {
                fieldProperties.value = currentData['SelectedValue']
            }
            // eslint-disable-next-line
            let fieldType: any = this.getFormFieldType(currentData);
            if (fieldType === 'SignatureField' || fieldType === 'InitialField') {
                this.addSignaturePath(currentData);
                if (this.isSignatureField) {
                    fieldProperties.value = currentData.Value;
                }
            }
            let addedElement: any = this.pdfViewer.formDesignerModule.addFormField(fieldType, fieldProperties,isCollection) as any;
            return addedElement;
        }
        return null;
    }
    /**
     * @param formField
     * @private
     */
    public updateFormFieldsCollection(formField: any): void {
        let type: FormFieldType = formField['Name'];
        let formFieldCollection: FormFieldModel = {
            name: this.retriveFieldName(formField), id: formField.uniqueID, isReadOnly: formField.IsReadonly, isRequired: formField.IsRequired, isSelected: type === 'CheckBox' ? false : formField.Selected,
            isChecked: type === 'RadioButton' ? false : formField.Selected, type: type, value: type === 'ListBox' || type === 'DropDown' ? formField.SelectedValue : formField.Value, fontName: formField.FontFamily ? formField.FontFamily : ''
        };
        this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(el => el.id === formFieldCollection.id)] = formFieldCollection;
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
            this.updateDataInSession(currentElement);
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
        let data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
             // eslint-disable-next-line
            let formFieldsData: any = JSON.parse(data);
            // eslint-disable-next-line
            let datas: any = {};
            let fieldDatas: any = [];
            for (let m: number = 0; m < formFieldsData.length; m++) {
                // eslint-disable-next-line
                let currentData: any = formFieldsData[m];
                let isRequired: boolean = currentData.IsRequired;
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
                        fieldDatas={fieldValue: currentData.CheckboxIndex, isReadOnly: currentData.IsReadonly};
                        datas[currentData.GroupName] = fieldDatas;
                        
                    } else if (datas[currentData.GroupName] === undefined || datas[currentData.GroupName] === null) {
                        fieldDatas={fieldValue: currentData.Selected, isReadOnly: currentData.IsReadonly};
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
                    datas[currentData.Text] = fieldDatas;
                   
                } else if (currentData.Name === 'ListBox') {
                    // eslint-disable-next-line
                    let childItems: any = currentData['TextList'];
                    const childItemsText: string[] = [];
                    for (let m: number = 0; m < currentData.SelectedList.length; m++) {
                        // eslint-disable-next-line
                        let currentElement: any = currentData.SelectedList[m];
                        childItemsText.push(childItems[currentElement]);
                    }
                    fieldDatas = { fieldValue: JSON.stringify(childItemsText), isReadOnly: currentData.IsReadonly};
                    datas[currentData.Text] = fieldDatas;
                    
                } else if (currentData.Name === 'SignatureField' || currentData.Name === 'InitialField') {
                    // eslint-disable-next-line
                    let csData: any;
                    if (currentData.Value === null || currentData.Value === '') {
                        this.addSignaturePath(currentData);
                    }
                    if (currentData.Value && currentData.Value !== '') {
                        csData = currentData.Value;
                        let fontFamily: any = currentData.fontFamily ? currentData.fontFamily : currentData.FontFamily;
                        if (fontFamily) {
                            datas[currentData.FieldName + 'fontName'] = fontFamily;
                            datas[currentData.FieldName + 'fontSize'] = currentData.fontSize ? currentData.fontSize : currentData.FontSize;
                        } else if (currentData.Value.split('base64,')[1]) {
                            datas[currentData.FieldName + 'ImageData'] = true;
                        } else {
                            // eslint-disable-next-line
                            let collectionData: any = processPathData(currentData.Value);
                            csData = splitArrayCollection(collectionData);
                        }
                    }
                    if (isRequired && currentData.Value === null || currentData.Value === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.pdfViewerBase.nonFillableFields[currentData.FieldName] = JSON.stringify(csData);
                    } else {
                        delete (this.pdfViewerBase.nonFillableFields[currentData.FieldName]);
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
                    datas[currentData.FieldName + 'isReadOnly'] = currentData.IsReadonly;
                }
            }
            return (JSON.stringify(datas));
        }
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
            currentTarget.style.backgroundColor = currentColor;
            if (currentTarget.type === 'checkbox') {
                currentTarget.style.webkitAppearance = '';
            }
            currentTarget.style.boxShadow = "0 0 5px " +( currentTarget.style.borderColor === 'transparent' ? '#000000': currentTarget.style.borderColor);
        } else if (currentTarget) {
            // eslint-disable-next-line
            if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus') {
                this.setFocus(currentTarget.id);
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
        currentTarget.style.backgroundColor = currentColor;
        currentTarget.style.boxShadow = 'none';
        if ((currentTarget.type === 'checkbox') && !currentTarget.checked) {
            currentTarget.style.webkitAppearance = 'none';
        } else {
               currentTarget.style.webkitAppearance = '';
        }
    }
    public updateFormFields(event: MouseEvent): void {
        // eslint-disable-next-line
        let currentTarget: any = event.target;
        if (currentTarget.className === 'e-pdfviewer-ListBox') {
            currentTarget = currentTarget.parentElement;
            this.updateDataInSession(currentTarget);
        } else if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus') {
            this.currentTarget = currentTarget;
        } else if (currentTarget.className === 'e-pv-buttonItem' || currentTarget.type === 'button') {
            this.pdfViewer.fireButtonFieldClickEvent(currentTarget.value, currentTarget.name, currentTarget.id);
        }
        for (let m: number = 0; m < this.pdfViewer.formFieldCollections.length; m++) {
            if (currentTarget.id === this.pdfViewer.formFieldCollections[m].id) {
                if (this.pdfViewer.formDesignerModule || this.pdfViewer.annotationModule) {
                    this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', this.pdfViewer.formFieldCollections[m]);
                }
                // eslint-disable-next-line
                if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus') {
                    this.setFocus(currentTarget.id);
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
        let proxy: any = this;
        let bounds: any;
        let targetBounds: Rect;
        let parentElementBounds: Rect;
        let data: any;
        if (this.pdfViewer.formDesigner) {
            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        } else {
            data = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        }
        var formFieldsData = JSON.parse(data);
        if (this.pdfViewer.formDesignerModule) {
            var targetName = this.currentTarget && this.currentTarget.offsetParent? this.currentTarget.offsetParent.name : this.currentTarget ? this.currentTarget.name: target.name ? target.name : target.offsetParent.name;
        }
        else {
            var targetName = this.currentTarget ? this.currentTarget.name : target.name ? target.name : target.offsetParent.name;
        }
        for (var i = 0; i < formFieldsData.length; i++) {
            let fieldName: string = this.pdfViewer.formDesigner ? formFieldsData[i].FormField.name : formFieldsData[i].FieldName;
            if (this.pdfViewer.formDesigner ? fieldName === targetName : fieldName === targetName && (!isNullOrUndefined(formFieldsData[i].ActualFieldName))) {
                target = this.pdfViewer.formDesigner ? document.getElementById(formFieldsData[i].Key.split("_")[0]) : document.getElementById(formFieldsData[i].uniqueID);
                // eslint-disable-next-line
                let currentField: any = target;
                let elementId: string = currentField.offsetParent.offsetParent.id.split("_")[0];
                let signatureField: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[elementId];
                if (target && target.offsetParent && signatureField) {
                    targetBounds = target.getBoundingClientRect();
                    parentElementBounds = target.offsetParent.offsetParent.offsetParent.getBoundingClientRect();
                    this.pdfViewerBase.drawSignatureWithTool = true;
                    if (target.nextSibling && target.nextSibling.id.indexOf("initial") !== -1) {
                        this.pdfViewer.isInitialFieldToolbarSelection = true;
                    }
                }
                const currentValue: string = value ? value : this.pdfViewerBase.signatureModule.outputString;
                let currentFont: string = fontname ? fontname : this.pdfViewerBase.signatureModule.fontName;
                const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                const currentWidth: number = this.pdfViewerBase.drawSignatureWithTool ? targetBounds.width / zoomvalue : parseFloat(currentField.style.width) / zoomvalue;
                const currentHeight: number = this.pdfViewerBase.drawSignatureWithTool ? targetBounds.height / zoomvalue : parseFloat(currentField.style.height) / zoomvalue;
                const currentLeft: number = this.pdfViewerBase.drawSignatureWithTool ? ((targetBounds.left - parentElementBounds.left)) / zoomvalue : parseFloat(currentField.style.left) / zoomvalue;
                const currentTop: number = this.pdfViewerBase.drawSignatureWithTool ? ((targetBounds.top - parentElementBounds.top)) / zoomvalue : parseFloat(currentField.style.top) / zoomvalue;
                const currentPage: number = this.pdfViewerBase.drawSignatureWithTool ? target.nextElementSibling ? parseFloat(target.nextElementSibling.id.split("_")[1]) : parseFloat(currentField.id.split('_')[1]) : parseFloat(currentField.id.split('_')[1]);
                const currentIndex: number = this.pdfViewerBase.drawSignatureWithTool ? target.nextElementSibling ? parseFloat(target.nextElementSibling.id.split('_')[2]) : parseFloat(currentField.id.split('_')[2]) : parseFloat(currentField.id.split('_')[2]);
                let signString: string = this.pdfViewerBase.signatureModule.saveImageString;
                let signatureFontFamily: string;
                let signatureFontSize: number;
                let rotateAngleString: string = currentField.offsetParent.offsetParent.style.transform ? currentField.offsetParent.offsetParent.style.transform : currentField.style.transform;
                rotateAngleString = rotateAngleString.substring(rotateAngleString.indexOf("(") + 1, rotateAngleString.indexOf("d"));
                let rotateAngle: number = rotateAngleString ? parseInt(rotateAngleString) : 0;
                if (signatureType === 'Type') {
                    if (!currentFont) {
                        currentFont = 'Helvetica';
                    }
                    // eslint-disable-next-line
                    bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, currentWidth, currentHeight);
                    if (this.pdfViewer.signatureFitMode === 'Default') {
                        bounds = this.getDefaultBoundsforSign(bounds);
                    }
                    annot = {
                        // eslint-disable-next-line max-len
                        id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                        shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureText', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: currentFont, fontSize: rotateAngle === 90 || rotateAngle === 270 ? (bounds.width / 1.35) : (bounds.height / 1.35)
                    };
                    if (annot.shapeAnnotationType === 'SignatureText') {
                        let textWidth: number = this.getTextWidth(annot.data, annot.fontSize, annot.fontFamily); 
                        let widthRatio: number = 1;
                        if (textWidth > bounds.width)
                           widthRatio =  bounds.width / textWidth;
                        annot.fontSize = this.getFontSize(Math.floor((annot.fontSize * widthRatio))); 
                    }
                    signString = annot.data;
                    signatureFontFamily = annot.fontFamily;
                    signatureFontSize = annot.fontSize;
                } else if (signatureType === 'Image') {
                    // eslint-disable-next-line
                    bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, currentWidth, currentHeight);
                    let image: HTMLImageElement = new Image();
                    image.src = currentValue;
                    image.onload = function(){
                        proxy.imageOnLoad(bounds, image, currentValue, currentPage, rotateAngle, currentField, signatureField, signString, signatureFontFamily, signatureFontSize, target)
                    }
                }
                    else {
                    if ((currentValue.indexOf('base64')) !== -1) {
                        // eslint-disable-next-line
                        bounds = this.getSignBounds(currentIndex, rotateAngle, currentPage, zoomvalue, currentLeft, currentTop, currentWidth, currentHeight);
                        if (this.pdfViewer.signatureFitMode === 'Default') {
                            bounds = this.getDefaultBoundsforSign(bounds);
                        }
                        annot = {
                            // eslint-disable-next-line max-len
                            id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                            shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
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
                            shapeAnnotationType: 'Path', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                        };
                    }
                }
                if (this.pdfViewerBase.drawSignatureWithTool && signatureField && signatureType !== 'Image' ) {
                    annot.id = signatureField.id + "_content";
                    let obj: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                    signatureField.wrapper.children.push(obj.wrapper);
                } else if(signatureType !== 'Image'){
                    this.pdfViewer.add(annot as PdfAnnotationBase);
                }
                if (annot && annot.shapeAnnotationType === 'Path' && currentValue !== '') {
                    this.pdfViewerBase.currentSignatureAnnot = annot;
                    // eslint-disable-next-line
                    let position: any = { currentHeight: currentHeight, currentWidth: currentWidth, currentLeft: currentLeft, currentTop: currentTop };
                    this.pdfViewerBase.signatureModule.addSignatureCollection(bounds, position);
                    signString = this.pdfViewerBase.signatureModule.saveImageString;
                    this.pdfViewerBase.currentSignatureAnnot = null;
                }
                if (signatureType !== 'Image'){
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

                if (this.pdfViewerBase.drawSignatureWithTool && signatureField) {
                    let key: string = target.offsetParent.offsetParent.id.split('_')[0] + '_content';
                    annot.bounds = {x: bounds.x * zoomvalue, y:bounds.y * zoomvalue,width: bounds.width * zoomvalue, height : bounds.height * zoomvalue };
                    this.updateSignatureDataInSession(annot, key);
                } else {
                    this.updateDataInSession(currentField, annot.data, annot.bounds, signatureFontFamily, signatureFontSize);
                }
                
                currentField.style.pointerEvents = 'none';

                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(annot.pageIndex, null, annot, 'FormField Value Change', '', annot, annot);
                }
                // eslint-disable-next-line
                if(annot.shapeAnnotationType === 'Path' || annot.shapeAnnotationType === "SignatureText"){
                    this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType, annot.bounds, annot.opacity, null, null, signString);
                }
                this.pdfViewer.fireFocusOutFormField(currentField.name, currentValue);
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
    private imageOnLoad(bounds: any, image: HTMLImageElement, currentValue: string, currentPage: number, rotateAngle: number, currentField: any, signatureField: PdfAnnotationBase, signString: string, signatureFontFamily: string, signatureFontSize: number, target: any) {
        if (target && target.offsetParent && signatureField) {
            this.pdfViewerBase.drawSignatureWithTool = true;
            if (target.nextSibling && target.nextSibling.id.indexOf("initial") !== -1) {
                this.pdfViewer.isInitialFieldToolbarSelection = true;
            }
        }
        let annot: PdfAnnotationBaseModel;
        if (this.pdfViewer.signatureFitMode === 'Default'){
            {
                let padding = Math.min(bounds.height /this. paddingDifferenceValue, bounds.width / this.paddingDifferenceValue);
                let maxHeight = bounds.height - padding;
                let maxWidth = bounds.width - padding;
                let imageWidth = image.width;
                let imageHeight = image.height;
                let beforeWidth = bounds.width;
                let beforeHeight = bounds.height;
                let ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
                bounds.width = imageWidth * ratio;
                bounds.height = imageHeight * ratio;
                bounds.x = bounds.x + (beforeWidth - bounds.width) / 2;
                bounds.y = bounds.y + (beforeHeight - bounds.height) / 2;
            }
        annot = {
            // eslint-disable-next-line max-len
            id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
            shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: rotateAngle, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
        };
        signString = annot.data;
        if (this.pdfViewerBase.drawSignatureWithTool && signatureField) {
            annot.id = signatureField.id + "_content";
            let obj: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
            signatureField.wrapper.children.push(obj.wrapper);
        } else {
            this.pdfViewer.add(annot as PdfAnnotationBase);
        }
        let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
                // eslint-disable-next-line
                this.pdfViewer.renderDrawing(canvass as any, currentPage);
                this.pdfViewerBase.signatureModule.showSignatureDialog(false);
                if (currentField.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus') {
                    currentField.className = 'e-pdfviewer-signatureformfields-signature e-pv-signature-focus';
                } else {
                    currentField.className = 'e-pdfviewer-signatureformfields-signature';
                }
                if (this.pdfViewerBase.drawSignatureWithTool && signatureField) {
                    let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                    let key: string = target.offsetParent.offsetParent.id.split('_')[0] + '_content';
                    annot.bounds = {x: bounds.x * zoomvalue, y:bounds.y * zoomvalue,width: bounds.width * zoomvalue, height : bounds.height * zoomvalue };
                    this.updateSignatureDataInSession(annot, key);
                } else {
                    this.updateDataInSession(currentField, annot.data, annot.bounds, signatureFontFamily, signatureFontSize);
                }
                currentField.style.pointerEvents = 'none';
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(annot.pageIndex, null, annot, 'FormField Value Change', '', annot, annot);
                }
                // eslint-disable-next-line
                if( annot.shapeAnnotationType === "SignatureImage"){                   
                    this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id,annot.shapeAnnotationType, annot.bounds, annot.opacity, null, null, signString);                  
                }
                this.pdfViewer.fireFocusOutFormField(currentField.name, currentValue);
    }
        this.pdfViewerBase.signatureModule.hideSignaturePanel();
        this.pdfViewerBase.drawSignatureWithTool = false;
        this.pdfViewer.isInitialFieldToolbarSelection = false;
    }
    private updateSignatureDataInSession(annot: any, key: string) {
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        if(!isNullOrUndefined(formFieldsData)){
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[i].Key === key) {
                    let formFieldIndex: number = this.pdfViewer.formFieldCollection.findIndex(el => el.id === formFieldsData[i].FormField.id.split('_')[0]);
                    if (annot.shapeAnnotationType === "SignatureText") {
                        formFieldsData[i].FormField.signatureType = "Text";
                        this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Text";
                        (this.pdfViewer.nameTable as any)[key].signatureType = "Text";
                        formFieldsData[i].FormField.fontFamily = annot.fontFamily === "TimesRoman" ? "Times New Roman" : annot.fontFamily;
                        this.pdfViewerBase.formFieldCollection[i].FormField.fontFamily = annot.fontFamily;
                        (this.pdfViewer.nameTable as any)[key].fontFamily = annot.fontFamily;
                        formFieldsData[i].FormField.fontSize = annot.fontSize;
                        this.pdfViewerBase.formFieldCollection[i].FormField.fontSize = annot.fontSize;
                        (this.pdfViewer.nameTable as any)[key].fontSize = annot.fontSize;
                        formFieldIndex > -1 ? this.pdfViewer.formFieldCollection[formFieldIndex].signatureType = "Text" : null;
                    } else if (annot.shapeAnnotationType === "SignatureImage") {
                        formFieldsData[i].FormField.signatureType = "Image";
                        this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Image";
                        (this.pdfViewer.nameTable as any)[key].signatureType = "Image";
                        formFieldIndex > -1 ? this.pdfViewer.formFieldCollection[formFieldIndex].signatureType = "Image" : null;
                    } else {
                        formFieldsData[i].FormField.signatureType = "Path";
                        this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = "Path";
                        (this.pdfViewer.nameTable as any)[key].signatureType = "Path";
                        formFieldIndex > -1 ? this.pdfViewer.formFieldCollection[formFieldIndex].signatureType = "Path" : null;
                    }
                    formFieldsData[i].FormField.signatureBound = annot.bounds;
                    this.pdfViewerBase.formFieldCollection[i].FormField.signatureBound = annot.bounds;
                    (this.pdfViewer.nameTable as any)[key].signatureBound = annot.bounds;
                    formFieldIndex > -1 ? this.pdfViewer.formFieldCollection[formFieldIndex].signatureBound = annot.bounds : null;
                    if (annot.shapeAnnotationType === "Path") {
                        let collectionData: any = processPathData(annot.data);
                        let csData: any = splitArrayCollection(collectionData);
                        formFieldsData[i].FormField.value = JSON.stringify(csData);
                        (this.pdfViewer.nameTable as any)[key].value = annot.data;
                        (this.pdfViewer.nameTable as any)[key.split('_')[0]].value = annot.data;
                        this.pdfViewerBase.formFieldCollection[i].FormField.value = JSON.stringify(csData);
                        formFieldIndex > -1 ? this.pdfViewer.formFieldCollection[formFieldIndex].value = JSON.stringify(csData) : null;
                    } else {
                        formFieldsData[i].FormField.value = annot.data;
                        this.pdfViewerBase.formFieldCollection[i].FormField.value = annot.data;
                        (this.pdfViewer.nameTable as any)[key.split('_')[0]].value = annot.data;
                        (this.pdfViewer.nameTable as any)[key].value = annot.data;
                        formFieldIndex > -1 ? this.pdfViewer.formFieldCollection[formFieldIndex].value = annot.data : null;
                    }
                    this.pdfViewer.formDesigner.updateFormFieldCollections(formFieldsData[i].FormField);
                    this.pdfViewer.formDesigner.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldsData[i].FormField, true, false, false,
                        false, false, false, false, false, false, false, false, false, false, false, false, "", formFieldsData[i].FormField.value);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(formFieldsData, '_formDesigner');
    }

    /**
     * @private
     */
    public getDefaultBoundsforSign(bounds:any):any{
        return { x: bounds.x + 4, y: bounds.y + 4, width: bounds.width - 8, height: bounds.height - 8 };
    }
    /**
     * @private
      */
    // eslint-disable-next-line
    public getSignBounds(currentIndex: number, rotateAngle: number, currentPage: number, zoomvalue: number, currentLeft: number, currentTop: number, currentWidth: number, currentHeight: number, isDraw?: boolean): any {
        // eslint-disable-next-line
        let bounds: any;
        let signatureId: string = this.pdfViewer.isInitialFieldToolbarSelection ? 'initialIcon' : 'signIcon';
        let signIcon: HTMLElement = document.getElementById(signatureId + '_' + currentPage + '_' + currentIndex);
        let signLeft: number = signIcon ? parseFloat(signIcon.style.left) * zoomvalue : 0;
        let difference: number = (currentLeft * zoomvalue) - (signLeft / zoomvalue);
        if (rotateAngle === 90 || rotateAngle === 270) {
        this.rotateAngle = 0;
            if (signIcon.style.left !== '') {
                if (isDraw) {
                    return bounds = { x: currentLeft - (difference / zoomvalue) - zoomvalue, y: currentTop + (difference / zoomvalue) + zoomvalue, width: currentWidth, height: currentHeight };
                }
                else {
                    return bounds = { x: currentLeft - (difference / zoomvalue) - zoomvalue, y: currentTop + (difference / zoomvalue) + zoomvalue, width: currentHeight, height: currentWidth };
                }
            }
            else {
                difference = 10;
                if (isDraw) {
                    return bounds = { x: currentLeft - currentWidth, y: currentTop + currentWidth, width: currentHeight, height: currentWidth };
                } else {
                    return bounds = { x: currentLeft - currentWidth - difference / 2, y: currentTop + currentWidth + difference, width: currentHeight, height: currentWidth };
                }
            }
        } else {
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
                        this.pdfViewerBase.setItemInSessionStorage(this.formFieldsData, '_formfields');                      
                    }
                }
            }
        }
    }

    private updateFormFieldsValue(event: MouseEvent | KeyboardEvent): void {
        // eslint-disable-next-line
        let currentTarget: any = event.target;
        let fieldIndex: any;
        let nextFields: any;
        if (currentTarget.InsertSpaces && !this.isKeyDownCheck) {
            // eslint-disable-next-line
            let font: number = parseInt(currentTarget.style.width) + (parseInt(currentTarget.style.height) / 2);
            currentTarget.style.width = '' + font + 'px';
            this.isKeyDownCheck = true;
        }
        if (event.which === 9 && currentTarget && (currentTarget.className === 'e-pdfviewer-formFields' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature')) {
            // eslint-disable-next-line
            let id: any = currentTarget.id.split('input_')[1].split('_')[0];
            // eslint-disable-next-line
            let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + parseInt(id));
            // eslint-disable-next-line
            let currentFields: any = textLayer.getElementsByClassName('e-pdfviewer-formFields');
            let istabindexed: boolean = true;
            fieldIndex = this.pdfViewer.formFieldCollections.findIndex(field => field.id === currentTarget.id);
            if ((!event.shiftKey && (event as KeyboardEvent).key === "Tab")) {
                nextFields = fieldIndex + 1 < this.pdfViewer.formFieldCollections.length ? this.pdfViewer.formFieldCollections[fieldIndex + 1] : this.pdfViewer.formFieldCollections[0];
            }
            this.pdfViewer.focusFormField(nextFields);
            istabindexed = true;
            event.preventDefault();
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
        if ((event.shiftKey && (event as KeyboardEvent).key === "Tab")) {
            let fieldIndex = this.pdfViewer.formFieldCollections.findIndex(field => field.id === currentTarget.id);
            let nextField = fieldIndex > 0 ? this.pdfViewer.formFieldCollections[fieldIndex - 1] : this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.length - 1];
            this.pdfViewer.focusFormField(nextField);
            event.preventDefault();
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

    private calculateSignatureBounds(signatureCavasWidth: number, signatureCavasHeight: number, newdifferenceX: number, newdifferenceY: number, isSignature: boolean, currentField: any, currentData?: any): any {
        const ratioX: number = newdifferenceX / signatureCavasWidth;
        const ratioY: number = newdifferenceY / signatureCavasHeight;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        let currentWidth: number = 0;
        let currentHeight: number = 0;
        let isSignatureStretched: boolean = false;
        let isHeightStretched: boolean = false;
        let leftDifference: number = 0;
        let topDifference: number = 0;
        if (isSignature) {
            currentWidth = this.pdfViewer.handWrittenSignatureSettings.width ? this.pdfViewer.handWrittenSignatureSettings.width : 150;
            currentHeight = this.pdfViewer.handWrittenSignatureSettings.height ? this.pdfViewer.handWrittenSignatureSettings.height : 100;
        } else {
            let fieldWidth: number = currentField ? currentField.style.width === '100%' ? currentField.clientWidth : parseFloat(currentField.style.width) : this.ConvertPointToPixel(currentData.LineBounds.Width);
            let fieldHeight: number = currentField ? currentField.style.height === '100%' ? currentField.clientHeight : parseFloat(currentField.style.height) : this.ConvertPointToPixel(currentData.LineBounds.Height);
            let fieldWidthRatio: number = fieldWidth / fieldHeight;
            let fieldHeightRatio: number = fieldHeight / fieldWidth;
            let canvasWidthRatio: number = signatureCavasWidth / signatureCavasHeight;
            let canvasHeightRatio: number = signatureCavasHeight / signatureCavasWidth;
            let fieldRotation: string = currentField ? currentField.offsetParent.offsetParent.style.transform ?  currentField.offsetParent.offsetParent.style.transform : currentField.style.transform : currentData.RotationAngle;
            if ((fieldWidthRatio > canvasWidthRatio) || (fieldHeightRatio > canvasWidthRatio) || ((Math.abs(fieldWidthRatio - fieldHeightRatio)) <= 1)) {
                let ratioDifference: number = 0;
                if ((fieldHeightRatio > canvasWidthRatio) || ((Math.abs(fieldWidthRatio - fieldHeightRatio)) <= 1)) {
                    isHeightStretched = true;
                    ratioDifference = fieldHeightRatio / canvasHeightRatio;
                } else {
                    isSignatureStretched = true;
                    ratioDifference = fieldWidthRatio / canvasWidthRatio;
                }
                if (fieldRotation === 'rotate(90deg)' || fieldRotation === 'rotate(270deg)') {
                    // eslint-disable-next-line
                    currentWidth = fieldHeight / zoomvalue;
                    // eslint-disable-next-line
                    currentHeight = fieldWidth / zoomvalue;
                }
                else {
                    if (isSignatureStretched) {
                        // eslint-disable-next-line
                        leftDifference = fieldWidth / zoomvalue;
                        // eslint-disable-next-line
                        currentWidth = (fieldWidth / ratioDifference) / zoomvalue;
                        // eslint-disable-next-line
                        currentHeight = fieldHeight / zoomvalue;
                    }
                    if (isHeightStretched) {
                        // eslint-disable-next-line
                        topDifference = fieldHeight / zoomvalue;
                        // eslint-disable-next-line
                        currentWidth = fieldWidth / zoomvalue;
                        // eslint-disable-next-line
                        currentHeight = (fieldHeight / ratioDifference) / zoomvalue;
                    }
                }
            } else {
                if (fieldRotation === 'rotate(90deg)' || fieldRotation === 'rotate(270deg)') {
                    // eslint-disable-next-line
                    currentWidth = fieldHeight / zoomvalue;
                    // eslint-disable-next-line
                    currentHeight = fieldWidth / zoomvalue;
                } else {
                    // eslint-disable-next-line
                    currentWidth = fieldWidth / zoomvalue;
                    // eslint-disable-next-line
                    currentHeight = fieldHeight / zoomvalue;
                }
            }
        }
        let currentLeftDiff: number = (signatureCavasWidth - newdifferenceX) / 2;
        let currentTopDiff: number = (signatureCavasHeight - newdifferenceY) / 2;
        if (isSignatureStretched) {
            currentLeftDiff = (currentLeftDiff / signatureCavasWidth) * leftDifference;
            let leftValueDiff: number = ((leftDifference * ratioX) - (currentWidth * ratioX)) / 2;
            currentLeftDiff = currentLeftDiff + leftValueDiff;
            currentTopDiff = (currentTopDiff / signatureCavasHeight) * currentHeight;
        } else if (isHeightStretched) {
            currentLeftDiff = (currentLeftDiff / signatureCavasWidth) * currentWidth;
            currentTopDiff = (currentTopDiff / signatureCavasHeight) * topDifference;
            let topValueDiff: number = ((topDifference * ratioY) - (currentHeight * ratioY)) / 2;
            currentTopDiff = currentTopDiff + topValueDiff;
        } else {
            currentLeftDiff = (currentLeftDiff / signatureCavasWidth) * currentWidth;
            currentTopDiff = (currentTopDiff / signatureCavasHeight) * currentHeight;
        }
        currentWidth = currentWidth * ratioX;
        currentHeight = currentHeight * ratioY;
        return { currentLeftDiff: currentLeftDiff, currentTopDiff: currentTopDiff, currentWidth: currentWidth, currentHeight: currentHeight };
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
    public updateSignatureAspectRatio(data: any, isSignature?: boolean, currentField?: any, currentData?: any): any {
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
        let signBounds: any = this.calculateSignatureBounds(signatureCavasWidth, signatureCavasHeight, newdifferenceX, newdifferenceY, isSignature, currentField, currentData);
        if (isSignature) {
            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
            const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            const currentLeft: number = ((parseFloat(pageDiv.style.width) / 2) - (signBounds.currentWidth / 2)) / zoomvalue;
            // eslint-disable-next-line max-len
            const currentTop: number = ((parseFloat(pageDiv.style.height) / 2) - (signBounds.currentHeight / 2)) / zoomvalue;
            return { x: currentLeft, y: currentTop, width: signBounds.currentWidth, height: signBounds.currentHeight };
        } else {
            return { left: signBounds.currentLeftDiff, top: signBounds.currentTopDiff, width: signBounds.currentWidth, height: signBounds.currentHeight };
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
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        // eslint-disable-next-line
        let filterFields = [];
        let fieldsByName = " ";
        let filterFieldName = [];
        let filterArrayLength = 0;
        let data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if(data && !this.pdfViewer.formDesignerModule){
            // eslint-disable-next-line
            let FormFieldsData: any = JSON.parse(data);
            filterFields = FormFieldsData.filter((item: any) => item.uniqueID === target.id);
                    if(filterFields.length > 0){
                        fieldsByName = filterFields[0].FieldName;
                        filterFieldName = FormFieldsData.filter((item: any)=> item.FieldName === fieldsByName);
                        filterArrayLength = filterFieldName.length;
                }
            for (let m: number = 0; m < FormFieldsData.length; m++) {
                // eslint-disable-next-line
                let currentData: any = FormFieldsData[m];
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
                        }
                    } else if (target.type === 'radio') {
                        if(target.checked){
                           for (let l: number = 0; l < FormFieldsData.length; l++) {
                               // eslint-disable-next-line
                               let currentType: any = FormFieldsData[l];
                               if (FormFieldsData[l].GroupName === target.name) {
                                   FormFieldsData[l].Selected = false;
                               }
                            }
                            if (target.value == currentData.Value) {
                               currentData.Selected = true;
                               break;
                            }
                            else {
                                currentData.Selected = false;
                            }
                        }
                    } else if (target.type === 'checkbox') {
                        let targetCheckBox : any = target.id;
                        let filterCheckBoxSameName : any = FormFieldsData.filter((sameNameCheckboxField: any) => (sameNameCheckboxField.GroupName === target.name) && sameNameCheckboxField.Name == 'CheckBox')
                        for (let l: number = 0; l < filterCheckBoxSameName.length; l++) {
                            // eslint-disable-next-line
                            let currentType: any = filterCheckBoxSameName[l];                            
                            currentType.Selected = false;
                            currentType.checked = false;
                            // eslint-disable-next-line
                            let currentTarget: any = document.getElementById(currentType.uniqueID);
                            if (currentTarget) {
                                if (targetCheckBox !== currentTarget.id) {
                                    currentTarget.Selected = false;
                                    currentTarget.checked = false;
                                    currentTarget.style.webkitAppearance = 'none';
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
                        currentData.SelectedValue = target.value;
                        let index: number = currentData.TextList? currentData.TextList.indexOf(target.value) : 0
                        currentData.selectedIndex = index > -1? index : 0;
                        currentData.SelectedList = [currentData.selectedIndex];
                    }
                    if(target.disabled) {
                        currentData.IsReadonly = true;
                    }
                    this.updateFormFieldsCollection(currentData);
                    filterArrayLength--;
                    if (filterArrayLength == 0)
                    break;
                } else if (target && target.getAttribute('list') != null && target.type === 'text' && currentData.uniqueID === target.list.id) {
                    currentData.SelectedValue = target.value;
                }
                this.updateFormFieldsCollection(currentData);
            }
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
            this.pdfViewerBase.setItemInSessionStorage(FormFieldsData, '_formfields');
        } 
        if (this.pdfViewer.formDesignerModule && target && target.id) {
            let selectedItem: any = (this.pdfViewer.nameTable as any)[target.id.split('_')[0]];
            if (selectedItem && selectedItem.wrapper && selectedItem.wrapper.children[0]) {
                selectedItem.value = target.value;
                let point: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.pdfViewer.formDesignerModule.updateFormDesignerFieldInSessionStorage(point, selectedItem.wrapper.children[0] as DiagramHtmlElement, selectedItem.formFieldAnnotationType, selectedItem);
            }
        }
    }
    /**
     * @private
     */
    public removeExistingFormFields():void{
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        if (formFieldsData) {
            for (let i = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[i].FormField.formFieldAnnotationType === "RadioButton"){
                    let buttonItem: any = [];
                    buttonItem = formFieldsData[i].FormField.radiobuttonItem;
                    let sameButtonItemId: string = formFieldsData[i].FormField.id.split('_')[0];
                    for (var j = 0; j < buttonItem.length; j++) {
                        let otherButton: any = buttonItem[j];
                        if (otherButton.id.split('_')[0] !== sameButtonItemId) {
                            this.pdfViewer.formDesignerModule.deleteFormField(otherButton.id.split('_')[0]);
                        }
                    }
                }
                if (formFieldsData[i].Key) {
                    this.pdfViewer.formDesignerModule.deleteFormField(formFieldsData[i].Key.split('_')[0]);
                }
            }
        }
    }
    // eslint-disable-next-line
    private applyCommonProperties(inputdiv: any, pageIndex: number, index: number, currentData: any, isFieldRotated?: boolean): void {
        // eslint-disable-next-line
        let inputField: any = document.getElementById(this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
        if (inputField) {
            let textLayer: any = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            if (inputdiv.type === 'text' && inputField.parentElement !== textLayer) {
                inputField.parentElement.remove();
            }
            if(!(inputField.className === "e-pdfviewer-signatureformfields e-pv-signature-focus")){
                inputField.remove();
            }   
        }
        // eslint-disable-next-line
        let signIcon: HTMLElement = document.getElementById('signIcon_' + pageIndex + '_' + index);
        let left: number = parseFloat(inputdiv.style.left);
        let top: number = parseInt(inputdiv.style.top);
        let width: number = parseFloat(inputdiv.style.width);
        let height: number = parseFloat(inputdiv.style.height);
        let signIconWidth: number;
        let signIconHeght: number;
        let hightDifference: number;
        let widthDifference: number;
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        if (signIcon && !isFieldRotated) {
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
    public createFormFields(currentData: any, pageIndex: number, index?: number, printContainer?: any, count?: number): any {
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
            case 'InitialField':				
            case 'SignatureField':
                currentField = this.createSignatureField(currentData, pageIndex, index, printContainer, count);
                let isFieldRotated: boolean = false;
                if(currentData['Rotation'] === 0){
                    isFieldRotated = true;
                }
                if (currentData.Value && currentData.Value !== '') {
                    this.renderExistingAnnnot(currentData, index, printContainer, isFieldRotated);
                    this.isSignatureRendered = true;
                    count++;
                }
                break;
            case 'Button':
                currentField = this.createButtonField(currentData, pageIndex);
                break;
            case 'ink':
                if(this.pdfViewer.formDesignerModule){
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
        // eslint-disable-next-line
        let currentField: any;
        // eslint-disable-next-line
        switch (currentData['Name']) {
            case 'Textbox':
                currentField = 'Textbox';
                break;
            case 'Password':
                currentField = 'Password';
                break;
            case 'RadioButton':
                currentField = 'RadioButton'
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

    // eslint-disable-next-line
    private createButtonField(data: any, pageIndex: number): any {
        // eslint-disable-next-line
        let inputField: any = document.createElement('input');
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
     * 
     * @returns {boolean}
     */
    
    private isBase64(imageSrc: string): boolean {
        return /^data:([a-zA-Z]*\/[a-zA-Z+.-]*);base64,/.test(imageSrc);
    }
    
    /**
     * Returns the boolean value based on the imgae source URL
     * 
     * @param {string} imageSrc - Passing the image source.
     * 
     * @returns {boolean}
     */
    
    private isURL(imageSrc: string): boolean {
        try {
             new URL(imageSrc);
             return true;
         } catch {
            return false;
         }
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
        if (!this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule && (data.IsInitialField || data.IsSignatureField)) {
            isReadonly = true;
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
        if (inputField.type !== 'button' && (inputField.style.backgroundColor === 'rgba(255, 255, 255, 0.2)' || inputField.style.backgroundColor === 'rgba(0, 0, 0, 0.2)') || inputField.style.backgroundColor === 'rgba(218, 234, 247, 0.2)') {
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
        }
        else if(type === 'checkbox' && !printContainer){
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
    private createSignatureField(data: any, pageIndex: number, index: number, printContainer: any, count?: number): any {
        // eslint-disable-next-line
        let inputField: any = document.createElement('input');
        inputField.type = 'text';
        inputField.name = data.FieldName;
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        // eslint-disable-next-line
        let previousField: any = document.getElementById('signIcon_' + pageIndex + '_' + index);
        if (previousField && !printContainer) {
            previousField.remove();
        }
        this.pdfViewerBase.isInitialField = data.IsInitialField;
        let signIndicator: string = this.pdfViewerBase.isInitialField ? "Initial" : "Sign";
        //check whether the width for sign indicator has default value or not and then set the default width value for initial field.
        let signatureFieldIndicatorWidth: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width === 19 ? (this.pdfViewerBase.isInitialField ? 27 : 19) : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width) : 19;
        // eslint-disable-next-line
        let span: any = document.createElement('span');
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        // eslint-disable-next-line
        let bounds: any = data['LineBounds'];
        // eslint-disable-next-line
        let font: any = data['Font'];
        const left: number = this.ConvertPointToPixel(bounds.X);
        const top: number = this.ConvertPointToPixel(bounds.Y);
        const indicatorWidth : number =this.ConvertPointToPixel(bounds.Width);
        const indicatorHeight : number =this.ConvertPointToPixel(bounds.Height);
        // eslint-disable-next-line max-len
        const height: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height > indicatorHeight * zoomvalue / 2 ? indicatorHeight * zoomvalue / 2 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height) : indicatorHeight * zoomvalue / 2;
        // eslint-disable-next-line max-len
        const width: number = signatureFieldIndicatorWidth > indicatorWidth * zoomvalue / 2 ? indicatorWidth * zoomvalue / 2 : signatureFieldIndicatorWidth;
        // eslint-disable-next-line max-len
        const size: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize > height / 2 ? 10 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize) : 10;
        const fontSize : number = size > width ? width /2 : (size > height? height/2: size);
        span.style.position = 'absolute';
        span.id = 'signIcon_' + pageIndex + '_' + index;
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
        if(!((height + this.indicatorPaddingValue) > indicatorHeight * zoomvalue) && !((width + this.indicatorPaddingValue) > indicatorWidth * zoomvalue)){
            span.style.padding = '2px';
        }
        span.style.textAlign = 'center';
        span.style.boxSizing = 'content-box';
        // eslint-disable-next-line
        span.innerHTML = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text : signIndicator) : signIndicator;
        span.style.color = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color : 'black') : 'black';
        // eslint-disable-next-line
        span.style.backgroundColor = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor : 'orange') : 'orange';
        span.style.opacity = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings ? (this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity : 1) : 1;
        if(!isNullOrUndefined(textLayer)){
            textLayer.appendChild(span);
        }
        this.addSignaturePath(data, count);
        return inputField;
    }
    // eslint-disable-next-line
    private addSignaturePath(signData: any, count?: number): boolean {
        this.isSignatureField = false;
        // eslint-disable-next-line
        let data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            // eslint-disable-next-line
            let formFieldsData: any = JSON.parse(data);
            for (let m: number = 0; m < formFieldsData.length; m++) {
                // eslint-disable-next-line
                let currentData: any = formFieldsData[m];
                // eslint-disable-next-line max-len
                if (currentData.ActualFieldName === null && count && (currentData.Name === 'ink' || currentData.Name === 'SignatureField' || currentData.Name === 'SignatureImage' || currentData.Name === 'SignatureText') && (this.pdfViewer.formDesigner ? ((currentData.FieldName.split('_')[0] ) === (signData.ActualFieldName) || (currentData.FieldName.split('_')[0]) === (signData.FieldName)) : ((currentData.FieldName.split('_')[0] === (signData.FieldName)) && !isNullOrUndefined(signData.ActualFieldName)) && currentData.Value && currentData.Value !== '')) {
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
    // eslint-disable-next-line
    private getBounds(bound: any, pageIndex: number, rotation?: any, isFieldRotated? : boolean): any {
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
        // eslint-disable-next-line
        let bounds: any;
        if (rotation > 0) {
            bounds = this.getBoundsPosition(rotation, bound, pageDetails, isFieldRotated);
        } else {
            bounds = this.getBoundsPosition(pageDetails.rotation, bound, pageDetails, isFieldRotated);
        }
        return bounds;
    }
    // eslint-disable-next-line
    private getBoundsPosition(rotation: number, bound: any, pageDetails: any, isFieldRotated?: boolean): void {
        // eslint-disable-next-line
        let bounds: any;
        if (!isFieldRotated) {
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
                    // eslint-disable-next-line
                    bounds = bound;
                    break;
                case 1:
                    // eslint-disable-next-line
                    bounds = { left: pageDetails.width - bound.top - bound.height, top: bound.left, width: bound.height, height: bound.width };
                    break;
                case 2:
                    // eslint-disable-next-line
                    bounds = { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
                    break;
                case 3:
                    // eslint-disable-next-line
                    bounds = { left: bound.top, top: pageDetails.height - bound.left - bound.width, width: bound.height, height: bound.width };
                    break;
            }
            if (!bounds) {
                bounds = bound;
            }
        } else {
            switch (rotation) {
                case 0:
                    // eslint-disable-next-line
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
        }
        return bounds;
    }
    // eslint-disable-next-line
    private applyPosition(inputField: any, bounds: any, font: any, pageIndex?: number, rotation?: number, isFieldRotated?: boolean): void {
        if (bounds) {
            const left: number = this.ConvertPointToPixel(bounds.X);
            const top: number = this.ConvertPointToPixel(bounds.Y);
            const width: number = this.ConvertPointToPixel(bounds.Width);
            const height: number = this.ConvertPointToPixel(bounds.Height);
            let fontHeight: number = 0;
            // eslint-disable-next-line
            let fieldBounds: any = { left: left, top: top, width: width, height: height };
            // eslint-disable-next-line
            let annotBounds: any = this.getBounds(fieldBounds, pageIndex, rotation, isFieldRotated);
            if (font !== null && font.Height) {
                inputField.style.fontFamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                fontHeight = this.ConvertPointToPixel(font.Size);
            }
            this.pdfViewerBase.setStyleToTextDiv(inputField, annotBounds.left, annotBounds.top, fontHeight, annotBounds.width, annotBounds.height, false);
        }
    }
   
    // eslint-disable-next-line
    private renderExistingAnnnot(data: any, index: any, printContainer: any, isFieldRotated?: boolean): any {
        if (!printContainer) {
            // eslint-disable-next-line
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
            // eslint-disable-next-line
            let currentPage: number = parseFloat(data['PageIndex']);
            // eslint-disable-next-line
            let bound: any = { left: currentLeft, top: currentTop, width: currentWidth, height: currentHeight };
            // eslint-disable-next-line
            let newBounds: any = this.updateSignatureBounds(bound, currentPage, isFieldRotated);
            let annot: PdfAnnotationBaseModel;
            let fontFamily: any = data.FontFamily ? data.FontFamily : data.fontFamily;
            // eslint-disable-next-line
            if ((this.pdfViewerBase.isSignatureImageData(data.Value))) {
                annot = {
                    // eslint-disable-next-line max-len
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: isFieldRotated ? this.getAngle(currentPage) : 0, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            } else if (this.pdfViewerBase.isSignaturePathData(data.Value)) {
                let bound: any = newBounds;
                let tempBounds: any = { left: newBounds.x, top: newBounds.y, width: newBounds.width, height: newBounds.height };
                bound = this.updateSignatureBounds(tempBounds, currentPage, false);
                annot = {
                    // eslint-disable-next-line max-len
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: bound, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            }
            else {
                annot = {
                    // eslint-disable-next-line max-len
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle: isFieldRotated ? this.getAngle(currentPage) : 0, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: data.FontFamily, fontSize: data.FontSize
                };
                annot.fontFamily = fontFamily === "TimesRoman" ? "Times New Roman" : fontFamily;
                annot.fontSize = data.FontSize ? data.FontSize : data.fontSize;
            }
            if ((data.Name === 'SignatureField' || data.Name === 'InitialField') && !isNullOrUndefined(data.id)) {
                let elementId: string = data.id;
                let signatureFieldElement: HTMLElement = document.getElementById(elementId + '_content_html_element');
                let signatureField: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[elementId];
                annot.id = signatureField.id + "_content";
                let obj: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                signatureField.wrapper.children.push(obj.wrapper);
                if (!isNullOrUndefined(signatureFieldElement) && this.isSignatureField) {
                    let inputField: any = signatureFieldElement.children[0].children[0];
                    inputField.style.pointerEvents = 'none';
                    inputField.className = 'e-pdfviewer-signatureformfields-signature';
                    inputField.parentElement.style.pointerEvents = 'none';
                }
                else if(!isNullOrUndefined(signatureFieldElement) && data.Value){
                    let inputField: any = signatureFieldElement.children[0].children[0];
                    inputField.style.pointerEvents = 'none';
                    inputField.className = 'e-pdfviewer-signatureformfields-signature';
                    inputField.parentElement.style.pointerEvents = 'none';
                }
            } else {
                let target: any = document.getElementById(annot.id);
                if (target && (target as any).classList.contains('e-pdfviewer-signatureformfields-signature')) {
                    this.pdfViewer.annotation.deleteAnnotationById(annot.id);
                }
                this.pdfViewer.add(annot as PdfAnnotationBase);
                if (target) {
                    this.updateDataInSession(target, annot.data, annot.bounds);
                    this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType, annot.bounds, annot.opacity, annot.strokeColor, annot.thickness, annot.data);
                }
            }
            data.Bounds = annot.bounds;
            if (this.pdfViewer.formDesignerModule) {
                let zoomvalue =this.pdfViewerBase.getZoomFactor();
                annot.bounds = {x: currentLeft * zoomvalue, y:currentTop* zoomvalue,width: currentWidth * zoomvalue, height : currentHeight * zoomvalue };
                this.updateSignatureDataInSession(annot, annot.id);
            }
            // eslint-disable-next-line
            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
            // eslint-disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, currentPage);
        }
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public updateSignatureBounds(bound: any, pageIndex: number, isFieldRotated : boolean): any {
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
        if (pageDetails) {
            if(!isFieldRotated){
            if (pageDetails.rotation === 1) {
                // eslint-disable-next-line max-len
                return { x: pageDetails.width - bound.top - bound.height, y: bound.left, width: bound.height, height: bound.width };
            } else if (pageDetails.rotation === 2) {
                // eslint-disable-next-line max-len
                return { x: pageDetails.width - bound.left - bound.width, y: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
            } else if (pageDetails.rotation === 3) {
                // eslint-disable-next-line max-len
                return { x: bound.top, y: (pageDetails.height - bound.left - bound.width), width: bound.height, height: bound.width };
            } else {
                 // eslint-disable-next-line max-len
                return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
            }}
            else {
                if (pageDetails.rotation === 1) {
                     // eslint-disable-next-line max-len
                    return { x: pageDetails.width - bound.top - bound.height - (bound.width / 2 - bound.height / 2), y: bound.left + (bound.width / 2 - bound.height / 2), width: bound.width, height: bound.height };
                } else if (pageDetails.rotation === 2) {
                    // eslint-disable-next-line max-len
                    return { x: pageDetails.width - bound.left - bound.width, y: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
                } else if (pageDetails.rotation === 3) {
                     // eslint-disable-next-line max-len
                    return { x: bound.top - (bound.width / 2 - bound.height / 2), y: (pageDetails.height - bound.left - bound.width + (bound.width / 2 - bound.height / 2)), width: bound.width, height: bound.height };
                } else {
                     // eslint-disable-next-line max-len
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

    /**
     * @private
     */
    // eslint-disable-next-line
    public clearFormFieldStorage(): void {
        // eslint-disable-next-line
        let sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        const maxSessionSize: number = 4500;
        if (this.pdfViewerBase.isStorageExceed) {
            const storageLength: number = window.sessionStorage.length;
            // eslint-disable-next-line
            let formFieldsList: any = [];
            for (let i: number = 0; i < storageLength; i++) {
                if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                    if (window.sessionStorage.key(i).split('_')[3] === 'formfields') {
                        // eslint-disable-next-line max-len
                        this.pdfViewerBase.formFieldStorage[window.sessionStorage.key(i)] = window.sessionStorage.getItem(window.sessionStorage.key(i));
                        formFieldsList.push(window.sessionStorage.key(i));
                    }
                    else if (window.sessionStorage.key(i).split('_')[3] === 'formDesigner') {
                        this.pdfViewerBase.formFieldStorage[window.sessionStorage.key(i)] = window.sessionStorage.getItem(window.sessionStorage.key(i));
                        formFieldsList.push(window.sessionStorage.key(i));
                    }
                }
            }
            if (formFieldsList) {
                for (let i: number = 0; i < formFieldsList.length; i++) {
                    window.sessionStorage.removeItem(formFieldsList[i]);
                }
            }
        }
    }

    // eslint-disable-next-line
    public clearFormFields(formField?: any): void {
        // eslint-disable-next-line
        let data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if(data) {
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
                    // eslint-disable-next-line
                    let annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[currentData.uniqueID];
                    if((annotation as any).propName!=='annotations'){
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
        if (this.pdfViewerBase && this.pdfViewerBase.signatureModule)
            this.pdfViewerBase.signatureModule.destroy();
    }

    /**
     * @private
     */
    public getModuleName(): string {
        return 'FormFields';
    }

    /**
     * @private
     * Get the text wdith
     * @param text
     * @param font
     * @param fontFamily
    */
    public getTextWidth(text: any, font: any, fontFamily: any): number {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let fontName: any;
        if (font) {
            fontName = font + 'px' + ' ' + fontFamily;
        }
        context.font = fontName || getComputedStyle(document.body).font;
        return context.measureText(text).width;
    }

    /**
     * @private
     * @param {number} fontSize - Font size.
     * @returns {number} - Returns the font size.
    */
     public getFontSize(fontSize: number): number {
        return fontSize ;;
    }
}
