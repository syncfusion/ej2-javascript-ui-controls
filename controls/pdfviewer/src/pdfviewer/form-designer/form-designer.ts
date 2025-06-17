import { Browser, createElement, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { cornersPointsBeforeRotation, DrawingElement, PointModel, Rect, TextAlign, splitArrayCollection, processPathData, randomId } from '@syncfusion/ej2-drawings';
import { FormFieldAnnotationType, PdfAnnotationBase, PdfFormFieldBaseModel, PdfFontModel } from '../drawing';
import { DiagramHtmlElement } from '../drawing/html-element';
import { PdfAnnotationBaseModel, PdfViewer, PdfViewerBase, IPageAnnotations } from '../index';
import { CheckBoxFieldSettings, DropdownFieldSettings, PasswordFieldSettings, Item, ListBoxFieldSettings, RadioButtonFieldSettings, SignatureFieldSettings, TextFieldSettings, InitialFieldSettings, SignatureIndicatorSettings } from '../pdfviewer';
import { isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { FormFieldModel, ItemModel } from '../pdfviewer-model';
import { Dialog, Tooltip } from '@syncfusion/ej2-popups';
import { Tab } from '@syncfusion/ej2-navigations';
import { DropDownButton} from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, Slider, TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { DisplayMode, FontStyle, FormFieldType, Visibility } from '../base/types';
import { cloneObject } from '../drawing/drawing-util';
import { PdfBitmap } from '@syncfusion/ej2-pdf';
import { PdfViewerUtils } from '../base/pdfviewer-utlis';

/**
 * The `FormDesigner` module is used to handle form designer actions of PDF viewer.
 */
export class FormDesigner {
    private formFieldTooltips: any = [];
    private data: any;
    private previousBackgroundColor : any;
    private formFieldsData: any;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private isFormFieldExistingInCollection: boolean = false;
    private propertiesDialog: Dialog;
    private tabControl: Tab;
    private formFieldName: TextBox;
    private formFieldTooltip: TextBox;
    private formFieldValue: TextBox;
    private formFieldVisibility: DropDownList;
    private formFieldReadOnly: CheckBox;
    private formFieldChecked: CheckBox;
    private formFieldRequired: CheckBox;
    private formFieldPrinting: CheckBox;
    private formFieldMultiline: CheckBox;
    private formFieldFontFamily: DropDownList;
    private formFieldFontSize: DropDownList;
    private maxLengthItem: NumericTextBox;
    private fontColorDropDown: DropDownButton;
    private fontColorPalette: ColorPicker;
    private fontColorElement: HTMLElement;
    private colorDropDownElement: HTMLElement;
    private colorPalette: ColorPicker;
    private colorDropDown: DropDownButton;
    private strokeDropDownElement: HTMLElement;
    private strokeColorPicker: ColorPicker;
    private strokeDropDown: DropDownButton;
    private thicknessElement: HTMLElement;
    private thicknessDropDown: DropDownButton;
    private thicknessSlider: Slider;
    private thicknessIndicator: HTMLElement;
    private formFieldListItem: TextBox;
    private formFieldAddButton: Button;
    private formFieldDeleteButton: Button;
    private formFieldUpButton: Button;
    private formFieldDownButton: Button;
    private isBold: boolean;
    private isItalic: boolean;
    private isUnderline: boolean;
    private isStrikeThrough: boolean;
    private formFieldBold: string;
    private formFieldItalic: string;
    private formFieldUnderline: string;
    private formFieldStrikeOut: string;
    private formFieldAlign: string;
    private fontColorValue: string;
    private backgroundColorValue: string;
    private borderColorValue: string;
    private formFieldBorderWidth: string;
    private checkboxCheckedState: boolean;
    private multilineCheckboxCheckedState: boolean = false;
    private formFieldListItemCollection: string[] = [];
    private formFieldListItemDataSource: object[] = [];
    private isInitialField: boolean = false;
    private isSetFormFieldMode: boolean = false;
    private isAddFormFieldProgrammatically: boolean = false;
    private isAddFormFieldUi: boolean = false;
    private increasedSize: number = 5;
    private defaultZoomValue: number = 1;
    private defaultFontSize: number = 10;
    private signIndicatorPadding: number = 3;
    private signIndicatorMinimunFontSize: number = 1;
    private signatureFieldPropertyChanged: any =
    {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isVisibilityChanged: false,
        isNameChanged: false,
        isPrintChanged: false,
        isTooltipChanged: false,
        isThicknessChanged: false
    };
    private initialFieldPropertyChanged: any =
    {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isVisibilityChanged: false,
        isNameChanged: false,
        isPrintChanged: false,
        isTooltipChanged: false,
        isThicknessChanged: false
    };
    private textFieldPropertyChanged: any =
    {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isBackgroundColorChanged: false,
        isBorderColorChanged: false,
        isAlignmentChanged: false,
        isFontSizeChanged: false,
        isNameChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isVisibilityChanged: false,
        isPrintChanged: false,
        isSelected: false,
        isFontFamilyChanged: false,
        isFontStyle: false,
        isValueChanged: false,
        isMaXLength: false,
        isColorChanged: false,
        isMultilineChanged: false
    };
    private passwordFieldPropertyChanged: any = {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isBackgroundColorChanged: false,
        isBorderColorChanged: false,
        isAlignmentChanged: false,
        isFontSizeChanged: false,
        isNameChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isVisibilityChanged: false,
        isPrintChanged: false,
        isSelected: false,
        isFontFamilyChanged: false,
        isFontStyle: false,
        isValueChanged: false,
        isMaXLength: false,
        isColorChanged: false
    };
    private checkBoxFieldPropertyChanged: any = {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isBackgroundColorChanged: false,
        isBorderColorChanged: false,
        isNameChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isVisibilityChanged: false,
        isPrintChanged: false,
        isCheckedChanged: false,
        isValueChanged: false
    };
    private radioButtonFieldPropertyChanged: any = {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isBackgroundColorChanged: false,
        isBorderColorChanged: false,
        isNameChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isVisibilityChanged: false,
        isPrintChanged: false,
        isSelectedChanged: false,
        isValueChanged: false
    };
    private dropdownFieldPropertyChanged: any = {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isBackgroundColorChanged: false,
        isBorderColorChanged: false,
        isAlignmentChanged: false,
        isFontSizeChanged: false,
        isNameChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isVisibilityChanged: false,
        isPrintChanged: false,
        isSelected: false,
        isFontFamilyChanged: false,
        isFontStyle: false,
        isColorChanged: false,
        isOptionChanged: false
    };
    private listBoxFieldPropertyChanged: any = {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isBackgroundColorChanged: false,
        isBorderColorChanged: false,
        isAlignmentChanged: false,
        isFontSizeChanged: false,
        isNameChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isVisibilityChanged: false,
        isPrintChanged: false,
        isSelected: false,
        isFontFamilyChanged: false,
        isFontStyle: false,
        isColorChanged: false,
        isOptionChanged: false
    };
    /**
     * @private
     */
    public disableSignatureClickEvent: boolean = false;
    /**
     * @private
     */
    public formFieldIndex: number = 0;
    /**
     * @private
     */
    public formFieldIdIndex: number = 0;
    /**
     * @private
     */
    public isProgrammaticSelection: boolean = false;
    /**
     * @private
     */
    public isShapeCopied: boolean = false;
    /**
     * @private
     */
    public isFormFieldSizeUpdated: boolean = false;
    private isDrawHelper: boolean = false;
    private isFormFieldUpdated: boolean = false;
    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} base - It describes about the base
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    public isPropertyDialogOpen: boolean = false;

    /**
     * @param {string} formFieldAnnotationType - It describes about the form field annotation type
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {Event} event - It describes about the event
     * @private
     * @returns {void}
     */
    public drawHelper(formFieldAnnotationType: string, obj: PdfFormFieldBaseModel, event: Event): void {
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + this.pdfViewerBase.activeElements.activePageID);
        const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + this.pdfViewerBase.activeElements.activePageID);
        if (canvasElement !== null && textLayer !== null) {
            const zoomValue: number = this.pdfViewerBase.getZoomFactor();
            const HtmlElementAttribute: Object = {
                'id': 'FormField_helper_html_element',
                'class': 'foreign-object'
            };
            const bounds: any = this.updateFormFieldInitialSize(obj as DrawingElement, formFieldAnnotationType);
            const htmlElement: HTMLElement = this.createHtmlElement('div', HtmlElementAttribute);
            this.isDrawHelper = true;
            if (formFieldAnnotationType === 'SignatureField' || formFieldAnnotationType === 'InitialField') {
                htmlElement.appendChild(this.createSignatureDialog(this.pdfViewer, obj, bounds));
            } else if (formFieldAnnotationType === 'DropdownList') {
                const element: any = { id: 'dropdown_helper' };
                htmlElement.appendChild(this.createDropDownList(element, obj));
            } else if (formFieldAnnotationType === 'ListBox') {
                const element: any = { id: 'listbox_helper' };
                htmlElement.appendChild(this.createListBox(element, obj));
            } else {
                htmlElement.appendChild(this.createInputElement(formFieldAnnotationType, obj, bounds));
            }
            textLayer.appendChild(htmlElement);
            const point: PointModel = this.pdfViewerBase.getMousePosition(event as any);
            htmlElement.style.cssText = `height: ${bounds.height * zoomValue}px;width: ${bounds.width * zoomValue}px;
            left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;position: absolute;opacity: 0.5;`;
        }
    }

    /**
     * @param {string} formFieldAnnotationType - It describes about the form field annotation type
     * @param {DiagramHtmlElement} element - It describes about the diagram html element
     * @param {PdfFormFieldBaseModel} drawingObject - It describes about the drawing object
     * @param {number} pageIndex - It describes about the page index
     * @param {PdfViewer} commandHandler - It describes about the command handler
     * @param {string} fieldId - It describes about the field id
     * @param {boolean} isAddedProgrammatically - It describes about the isAddedProgrammatically
     * @param {boolean} action - It describes about the action
     * @private
     * @returns {HTMLElement} - html element
     */
    public drawHTMLContent(formFieldAnnotationType: string, element: DiagramHtmlElement,
                           drawingObject: PdfFormFieldBaseModel, pageIndex?: number,
                           commandHandler?: PdfViewer, fieldId?: string, isAddedProgrammatically?: boolean, action?: string): HTMLElement {
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
        const formFieldElement: HTMLElement = document.getElementById('form_field_' + element.id + '_html_element');
        if (formFieldElement === null && element !== null && canvasElement !== null && textLayer ){
            const zoomValue: number = this.pdfViewerBase.getZoomFactor();
            const parentHtmlElementAttribute: Object = {
                'id': 'form_field_' + element.id + '_html_element',
                'class': 'foreign-object'
            };
            const parentHtmlElement: HTMLElement = this.createHtmlElement('div', parentHtmlElementAttribute);
            const HtmlElementAttribute: Object = {
                'id': element.id + '_html_element',
                'class': 'foreign-object'
            };
            const htmlElement: HTMLElement = this.createHtmlElement('div', HtmlElementAttribute);
            if (drawingObject.fontFamily === 'TimesRoman') {
                drawingObject.fontFamily = 'Times New Roman';
            }
            if (formFieldAnnotationType === 'SignatureField' || formFieldAnnotationType === 'InitialField') {
                element.template = htmlElement.appendChild(this.createSignatureDialog(commandHandler, drawingObject));
            } else if (formFieldAnnotationType === 'DropdownList') {
                element.template = htmlElement.appendChild(this.createDropDownList(element, drawingObject));
            } else if (formFieldAnnotationType === 'ListBox') {
                element.template = htmlElement.appendChild(this.createListBox(element, drawingObject));
            } else {
                element.template = htmlElement.appendChild(this.createInputElement(formFieldAnnotationType, drawingObject));
            }
            const divElement: HTMLElement = document.createElement('div');
            divElement.id = drawingObject.id + '_designer_name';
            divElement.style.fontSize = this.defaultFontSize + 'px';
            divElement.className = 'e-pv-show-designer-name';
            if (this.pdfViewer.designerMode) {
                divElement.innerHTML = drawingObject.name;
                divElement.style.position = 'absolute';
            } else {
                divElement.innerHTML = '';
                divElement.style.position = 'initial';
            }
            if (formFieldAnnotationType === 'Checkbox' && (Browser.isDevice)) {
                //Creating outer div for checkbox in mobile device
                const bounds: any = drawingObject.bounds;
                const outerDivHeight: number = bounds.height + this.increasedSize;
                const outerDivWidth: number = bounds.width + this.increasedSize;
                const outerDivAttribute: Object = {
                    'id': drawingObject.id + '_outer_div',
                    'className': 'e-pv-checkbox-outer-div'
                };
                const outerDiv: HTMLElement = createElement('div', outerDivAttribute);
                outerDiv.style.cssText = `height: ${outerDivHeight * zoomValue}px;width: ${outerDivWidth * zoomValue}px;
                left: ${bounds.x * zoomValue}px;top: ${bounds.y * zoomValue}px;position: absolute;opacity: 1;`;
                htmlElement.appendChild(divElement);
                outerDiv.addEventListener('click', this.setCheckBoxState.bind(this));
                parentHtmlElement.appendChild(htmlElement);
                textLayer.appendChild(outerDiv);
                outerDiv.appendChild(parentHtmlElement);
            } else {
                htmlElement.appendChild(divElement);
                parentHtmlElement.appendChild(htmlElement);
                textLayer.appendChild(parentHtmlElement);
            }
            if (formFieldAnnotationType === 'RadioButton') {
                if (document.getElementsByClassName('e-pv-radiobtn-span').length > 0) {
                    const spanElement: HTMLCollectionOf<Element> = document.getElementsByClassName('e-pv-radiobtn-span');
                    for (let i: number = 0; i < spanElement.length; i++) {
                        if ((spanElement as any)[parseInt(i.toString(), 10)].id.split('_')[0] === drawingObject.id) {
                            const bounds: any = this.getCheckboxRadioButtonBounds(drawingObject);
                            (spanElement as any)[parseInt(i.toString(), 10)].style.width = (bounds.width / 2) + 'px';
                            (spanElement as any)[parseInt(i.toString(), 10)].style.height = (bounds.height / 2) + 'px';
                            if (parseInt((spanElement as any)[parseInt(i.toString(), 10)].style.width, 10) <= 1 ||
                             parseInt((spanElement as any)[parseInt(i.toString(), 10)].style.height, 10) <= 1) {
                                (spanElement as any)[parseInt(i.toString(), 10)].style.width = '1px';
                                (spanElement as any)[parseInt(i.toString(), 10)].style.height = '1px';
                                (spanElement as any)[parseInt(i.toString(), 10)].style.margin = '1px';
                            }
                        }
                    }
                }
            }
            const point: PointModel = cornersPointsBeforeRotation(element).topLeft;
            if (formFieldAnnotationType === 'Checkbox' && (Browser.isDevice)) {
                htmlElement.style.cssText = `height: ${element.actualSize.height * zoomValue}px;
                width: ${element.actualSize.width * zoomValue}px;left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;
                transform: rotate(${element.rotateAngle + element.parentTransform}deg);
                pointer-events: ${this.pdfViewer.designerMode ? 'none' : 'all'};visibility: ${element.visible ? 'visible' : 'hidden'};
                opacity: ${element.style.opacity};`;
            } else {
                htmlElement.style.cssText = `height: ${element.actualSize.height * zoomValue}px;
                width: ${element.actualSize.width * zoomValue}px;left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;
                position: absolute;transform: rotate(${element.rotateAngle + element.parentTransform}deg);
                pointer-events: ${this.pdfViewer.designerMode ? 'none' : 'all'};visibility: ${element.visible ? 'visible' : 'hidden'};
                opacity: ${element.style.opacity};`;
            }
            this.updateFormDesignerFieldInSessionStorage(point, element, formFieldAnnotationType, drawingObject);
            if (formFieldAnnotationType === 'SignatureField' || formFieldAnnotationType === 'InitialField'){
                if (drawingObject.value && action !== 'Addition') {
                    const elementId: string = this.pdfViewer.drawing.copiedElementID !== '' ? this.pdfViewer.drawing.copiedElementID + '_content' : element.id;
                    let value: any;
                    if (!isNullOrUndefined((this.pdfViewer.nameTable as any)[`${elementId}`])) {
                        value = (this.pdfViewer.nameTable as any)[`${elementId}`].value ? (this.pdfViewer.nameTable as any)[`${elementId}`].value : (this.pdfViewer.nameTable as any)[`${elementId}`].data;
                    }
                    else
                    {
                        value = drawingObject.value;
                    }
                    if (value && this.pdfViewer.formFieldsModule) {
                        let signatureType: 'Type' | 'Path' | 'Image' = (value.indexOf('base64')) > -1 ? 'Image' : ((value.startsWith('M') && value.split(',')[1].split(' ')[1].startsWith('L') || (value.startsWith('M') && value.split(' ')[3].startsWith('L'))) ? 'Path' : 'Type');
                        if (this.pdfViewerBase.isSignaturePathData(value))
                        {
                            signatureType = 'Path';
                        }
                        this.pdfViewer.formFieldsModule.drawSignature(signatureType, value, element.template, drawingObject.fontFamily);
                    }
                }
            }
            const field: any = this.getFormFieldAddEventArgs(drawingObject);
            if (!this.pdfViewer.isFormFieldsLoaded || isAddedProgrammatically) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
            }
            if (this.isSetFormFieldMode || isAddedProgrammatically) {
                const pageIndex: number = this.pdfViewerBase.activeElements.activePageID ?
                    this.pdfViewerBase.activeElements.activePageID : field.pageNumber - 1;
                this.pdfViewer.fireFormFieldAddEvent('formFieldAdd', field as IFormField , pageIndex);
            }
            this.isSetFormFieldMode = false;
        } else {
            const point: PointModel = cornersPointsBeforeRotation(element).topLeft;
            this.updateFormDesignerFieldInSessionStorage(point, element, formFieldAnnotationType, drawingObject);
            if (isAddedProgrammatically) {
                const field: any = this.getFormFieldAddEventArgs(drawingObject);
                this.pdfViewer.fireFormFieldAddEvent('formFieldAdd', field as IFormField, pageIndex);
            }
        }
        return element.template;
    }

    private getFormFieldAddEventArgs(drawingObject: PdfFormFieldBaseModel): any {
        const field: any = {
            name: drawingObject.name, id: drawingObject.id, value: drawingObject.value, fontFamily: drawingObject.fontFamily,
            fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle,
            color: drawingObject.color, backgroundColor: drawingObject.backgroundColor, alignment: drawingObject.alignment,
            isReadonly: drawingObject.isReadonly, visibility: drawingObject.visibility,
            maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint,
            rotation: drawingObject.rotateAngle, tooltip: drawingObject.tooltip,
            borderColor: drawingObject.borderColor, thickness: drawingObject.thickness, options: drawingObject.options,
            pageNumber: drawingObject.pageNumber, isChecked: drawingObject.isChecked,
            isSelected: drawingObject.isSelected, customData: drawingObject.customData, bounds: drawingObject.bounds,
            formFieldAnnotationType: drawingObject.formFieldAnnotationType, isMultiline: drawingObject.isMultiline,
            insertSpaces: drawingObject.insertSpaces
        };
        return field;
    }

    /**
     * @param {PointModel} point - It describes about the point
     * @param {DiagramHtmlElement} element - It describes about the element
     * @param {string} formFieldType - It describes about the form field type
     * @param {PdfFormFieldBaseModel} drawingObject - It describes about the drawing object
     * @private
     * @returns {void}
     */
    public updateFormDesignerFieldInSessionStorage(point: PointModel, element: DiagramHtmlElement, formFieldType: string,
                                                   drawingObject?: PdfFormFieldBaseModel): void {
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        const formDesignObj: IFormField = {
            id: element.id, lineBound: { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width * zoomValue,
                Height: element.actualSize.height * zoomValue },
            name: drawingObject.name, zoomValue: zoomValue, pageNumber: drawingObject.pageNumber, value: drawingObject.value,
            formFieldAnnotationType: formFieldType, isMultiline: drawingObject.isMultiline,
            signatureType: (drawingObject as any).signatureType, signatureBound: (drawingObject as any).signatureBound,
            fontFamily: drawingObject.fontFamily, fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle,
            fontColor: this.getRgbCode(drawingObject.color) as unknown as string,
            borderColor: this.getRgbCode(drawingObject.borderColor), thickness: drawingObject.thickness,
            backgroundColor: this.getRgbCode(drawingObject.backgroundColor) as unknown as string,
            textAlign: drawingObject.alignment, isChecked: drawingObject.isChecked, isSelected: drawingObject.isSelected,
            isReadonly: drawingObject.isReadonly, font: {
                isBold: drawingObject.font.isBold, isItalic: drawingObject.font.isItalic, isStrikeout: drawingObject.font.isStrikeout,
                isUnderline: drawingObject.font.isUnderline
            }, selectedIndex: drawingObject.selectedIndex, radiobuttonItem: null,
            option: drawingObject.options ? drawingObject.options : [], visibility: drawingObject.visibility,
            maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint,
            rotation: drawingObject.rotateAngle, tooltip: drawingObject.tooltip,
            insertSpaces: drawingObject.insertSpaces, customData: drawingObject.customData
        };
        if (formDesignObj.formFieldAnnotationType === 'RadioButton') {
            formDesignObj.radiobuttonItem = [];
            formDesignObj.radiobuttonItem.push({
                id: element.id, lineBound: { X: point.x * zoomValue, Y: point.y * zoomValue,
                    Width: element.actualSize.width * zoomValue, Height: element.actualSize.height * zoomValue },
                name: drawingObject.name, zoomValue: zoomValue, pageNumber: drawingObject.pageNumber,
                value: drawingObject.value, formFieldAnnotationType: formFieldType,
                fontFamily: drawingObject.fontFamily, fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle,
                fontColor: this.getRgbCode(drawingObject.color) as unknown as string,
                borderColor: this.getRgbCode(drawingObject.borderColor), thickness: drawingObject.thickness,
                backgroundColor: this.getRgbCode(drawingObject.backgroundColor) as unknown as string,
                textAlign: drawingObject.alignment, isChecked: drawingObject.isChecked, isSelected: drawingObject.isSelected,
                isReadonly: drawingObject.isReadonly, visibility: drawingObject.visibility,
                maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint,
                rotation: 0, tooltip: drawingObject.tooltip
            });
        }
        const isItemAdd: boolean = this.getRadioButtonItem(formDesignObj, drawingObject);
        if (!isItemAdd) {
            for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
                const formFieldElement: any = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)];
                if (formFieldElement['Key'] === formDesignObj.id) {
                    this.pdfViewerBase.formFieldCollection.splice(i, 1);
                    this.pdfViewerBase.formFieldCollection.push({ Key: element.id, FormField: formDesignObj });
                    this.isFormFieldExistingInCollection = true;
                }
            }
            if (!this.isFormFieldExistingInCollection) {
                this.pdfViewerBase.formFieldCollection.push({ Key: element.id, FormField: formDesignObj });
            }
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.isFormFieldExistingInCollection = false;
            if (this.pdfViewerBase.formFieldCollection.length > 0) {
                this.pdfViewerBase.enableFormFieldButton(true);
            } else {
                this.pdfViewerBase.enableFormFieldButton(false);
            }
        }
    }

    private getRadioButtonItem(radiobutton: any, formFieldProperty: any): boolean {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        let isItemAdd: boolean = false;
        if (data) {
            const formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                const currentData: any = formFieldsData[parseInt(i.toString(), 10)];
                let radiobuttonItem: IRadiobuttonItem;
                if (radiobutton.formFieldAnnotationType === 'RadioButton') {
                    if (radiobutton.radiobuttonItem && currentData.FormField.radiobuttonItem) {
                        for (let m: number = 0; m < currentData.FormField.radiobuttonItem.length; m++) {
                            if (currentData.FormField.radiobuttonItem[parseInt(m.toString(), 10)].id === radiobutton.id) {
                                radiobuttonItem = {
                                    lineBound: radiobutton.lineBound, id: radiobutton.id,
                                    name: radiobutton.name, zoomValue: radiobutton.zoomValue, pageNumber: radiobutton.pageNumber,
                                    value: radiobutton.value, formFieldAnnotationType: radiobutton.formFieldAnnotationType,
                                    fontFamily: radiobutton.fontFamily, fontSize: radiobutton.fontSize,
                                    fontStyle: radiobutton.fontStyle, fontColor: this.getRgbCode(formFieldProperty.color),
                                    borderColor: this.getRgbCode(formFieldProperty.borderColor),
                                    thickness: formFieldProperty.thickness,
                                    backgroundColor: this.getRgbCode(formFieldProperty.backgroundColor),
                                    textAlign: radiobutton.textAlign, isChecked: radiobutton.isChecked,
                                    isSelected: radiobutton.isSelected,
                                    isReadonly: radiobutton.isReadonly, visibility: radiobutton.visibility,
                                    maxLength: radiobutton.maxLength, isRequired: radiobutton.isRequired, isPrint: radiobutton.isPrint,
                                    rotation: 0, tooltip: radiobutton.tooltip
                                };
                                currentData.FormField.radiobuttonItem.splice(m, 1);
                                currentData.FormField.radiobuttonItem.push(radiobuttonItem);
                                if (!isNullOrUndefined(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)])) {
                                    if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.name ===
                                     currentData.FormField.name) {
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.radiobuttonItem =
                                         currentData.FormField.radiobuttonItem;
                                        isItemAdd = true;
                                    }
                                }
                                break;
                            }
                            else {
                                if (radiobutton.formFieldAnnotationType === currentData.FormField.formFieldAnnotationType &&
                                     radiobutton.name === currentData.FormField.name) {
                                    radiobuttonItem = {
                                        lineBound: radiobutton.lineBound, id: radiobutton.id,
                                        name: radiobutton.name, zoomValue: radiobutton.zoomValue, pageNumber: radiobutton.pageNumber,
                                        value: radiobutton.value, formFieldAnnotationType: radiobutton.formFieldAnnotationType,
                                        fontFamily: radiobutton.fontFamily, fontSize: radiobutton.fontSize,
                                        fontStyle: radiobutton.fontStyle, fontColor: this.getRgbCode(formFieldProperty.color),
                                        borderColor: this.getRgbCode(formFieldProperty.borderColor),
                                        thickness: formFieldProperty.thickness,
                                        backgroundColor: this.getRgbCode(formFieldProperty.backgroundColor),
                                        textAlign: radiobutton.textAlign, isChecked: radiobutton.isChecked,
                                        isSelected: radiobutton.isSelected,
                                        isReadonly: radiobutton.isReadonly, visibility: radiobutton.visibility,
                                        maxLength: radiobutton.maxLength, isRequired: radiobutton.isRequired,
                                        isPrint: radiobutton.isPrint, rotation: 0, tooltip: radiobutton.tooltip
                                    };
                                    let isContainsRadiobuttonItem: boolean = false;
                                    for (let i: number = 0; i < currentData.FormField.radiobuttonItem.length; i++) {
                                        if (currentData.FormField.radiobuttonItem[parseInt(i.toString(), 10)].id === radiobuttonItem.id) {
                                            currentData.FormField.radiobuttonItem[parseInt(i.toString(), 10)] = radiobuttonItem;
                                            isContainsRadiobuttonItem = true;
                                            break;
                                        }
                                    }
                                    if (!isContainsRadiobuttonItem) {
                                        currentData.FormField.radiobuttonItem.push(radiobuttonItem);
                                    }
                                    if (!isNullOrUndefined(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)])) {
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.radiobuttonItem =
                                         currentData.FormField.radiobuttonItem;
                                        isItemAdd = true;
                                        for (let l: number = 0; l < this.pdfViewerBase.formFieldCollection.length; l++) {
                                            const formFieldElement: any =
                                            this.pdfViewerBase.formFieldCollection[parseInt(l.toString(), 10)];
                                            if (formFieldElement['Key'] === radiobuttonItem.id) {
                                                this.pdfViewerBase.formFieldCollection.splice(l, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
            if (isItemAdd) {
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
        return isItemAdd;
    }

    private getRgbCode(colorString: string): object {
        // eslint-disable-next-line
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            const colorCode: string = this.nameToHash(colorString);
            if (colorCode !== '')
            {colorString = colorCode; }
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        const r: number = parseInt(stringArray[0].split('(')[1], 10);
        const g: number = parseInt(stringArray[1], 10);
        const b: number = parseInt(stringArray[2], 10);
        let a: number = parseFloat(stringArray[3]) * 100;
        if (isNaN(a)) {
            a = 0;
        }
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * @param {string} colour -It describes about the color
     * @private
     * @returns {string} - string
     */
    public nameToHash(colour: string): string {
        const colours: any = {
            'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff',
            'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff',
            'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'yellow': '#ffff00', 'yellowgreen': '#9acd32',
            'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50',
            'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c',
            'cyan': '#00ffff', 'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9',
            'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b',
            'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f', 'darkorange': '#ff8c00', 'darkorchid': '#9932cc',
            'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969',
            'dodgerblue': '#1e90ff', 'firebrick': '#b22222', 'floralwhite': '#fffaf0',
            'forestgreen': '#228b22', 'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff',
            'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080', 'green': '#008000',
            'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred ': '#cd5c5c',
            'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 'indigo': '#4b0082', 'ivory': '#fffff0',
            'navy': '#000080', 'oldlace': '#fdf5e6', 'olive': '#808000', 'khaki': '#f0e68c',
            'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd',
            'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff',
            'lightgoldenrodyellow': '#fafad2', 'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90',
            'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6',
            'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd',
            'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee', 'mediumspringgreen': '#00fa9a',
            'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970',
            'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead',
            'rebeccapurple': '#663399', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
            'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6',
            'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee',
            'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f',
            'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'pink': '#ffc0cb', 'plum': '#dda0dd',
            'steelblue': '#4682b4', 'violet': '#ee82ee', 'powderblue': '#b0e0e6', 'purple': '#800080',
            'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57',
            'seashell': '#fff5ee', 'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb',
            'slateblue': '#6a5acd', 'slategray': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f',
            'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0'
        };
        if (typeof colours[colour.toLowerCase()] !== 'undefined') {
            return colours[colour.toLowerCase()];
        }
        return '';
    }


    /**
     * @param {string} value - It describes about the value
     * @param {string} type - It describes about the type
     * @private
     * @returns {string} - string
     */
    public getValue(value?: string, type?: string): string {
        type = !type ? 'hex' : type.toLowerCase();
        if (value[0] === 'r') {
            const cValue: number[] = this.convertRgbToNumberArray(value);
            if (type === 'hex' || type === 'hexa') {
                const hex: string = this.rgbToHex(cValue);
                return type === 'hex' ? hex.slice(0, 7) : hex;
            } else {
                if (type === 'hsv') {
                    // eslint-disable-next-line
                    return this.convertToHsvString(this.rgbToHsv.apply(this, cValue.slice(0, 3)));
                } else {
                    if (type === 'hsva') {
                        // eslint-disable-next-line
                        return this.convertToHsvString(this.rgbToHsv.apply(this, cValue));
                    } else {
                        return 'null';
                    }
                }
            }
        } else {
            if (value[0] === 'h') {
                // eslint-disable-next-line
                const cValue: number[] = this.hsvToRgb.apply(this, this.convertRgbToNumberArray(value));
                if (type === 'rgba') {
                    return this.convertToRgbString(cValue);
                } else {
                    if (type === 'hex' || type === 'hexa') {
                        const hex: string = this.rgbToHex(cValue);
                        return type === 'hex' ? hex.slice(0, 7) : hex;
                    } else {
                        if (type === 'rgb') {
                            return this.convertToRgbString(cValue.slice(0, 3));
                        } else {
                            return 'null';
                        }
                    }
                }
            } else {
                value = this.roundValue(value);
                let rgb: number[] = this.hexToRgb(value);
                if (type === 'rgb' || type === 'hsv') {
                    rgb = rgb.slice(0, 3);
                }
                if (type === 'rgba' || type === 'rgb') {
                    return this.convertToRgbString(rgb);
                } else {
                    if (type === 'hsva' || type === 'hsv') {
                        // eslint-disable-next-line
                        return this.convertToHsvString(this.rgbToHsv.apply(this, rgb));
                    } else {
                        if (type === 'hex') {
                            return value.slice(0, 7);
                        } else {
                            if (type === 'a') {
                                return rgb[3].toString();
                            } else {
                                return 'null';
                            }
                        }
                    }
                }
            }
        }
    }

    private convertRgbToNumberArray(value: string): number[] {
        return (value.slice(value.indexOf('(') + 1, value.indexOf(')'))).split(',').map(
            (n: string, i: number) => {
                return (i !== 3) ? parseInt(n, 10) : parseFloat(n);
            });
    }

    private convertToRgbString(rgb: number[]): string {
        return rgb.length ? rgb.length === 4 ? 'rgba(' + rgb.join() + ')' : 'rgb(' + rgb.join() + ')' : '';
    }

    private convertToHsvString(hsv: number[]): string {
        return hsv.length === 4 ? 'hsva(' + hsv.join() + ')' : 'hsv(' + hsv.join() + ')';
    }

    private roundValue(value: string): string {
        if (!value) {
            return '';
        }
        if (value[0] !== '#') {
            value = '#' + value;
        }
        let len: number = value.length;
        if (len === 4) {
            value += 'f';
            len = 5;
        }
        if (len === 5) {
            let tempValue: string = '';
            for (let i: number = 1, len: number = value.length; i < len; i++) {
                tempValue += (value.charAt(i) + value.charAt(i));
            }
            value = '#' + tempValue;
            len = 9;
        }
        if (len === 7) {
            value += 'ff';
        }
        return value;
    }

    private hexToRgb(hex: string): number[] {
        if (!hex) {
            return [];
        }
        hex = hex.trim();
        if (hex.length !== 9) {
            hex = this.roundValue(hex);
        }
        const opacity: number = Number((parseInt(hex.slice(-2), 16) / 255).toFixed(2));
        hex = hex.slice(1, 7);
        const bigInt: number = parseInt(hex, 16); const h: number[] = [];
        h.push((bigInt >> 16) & 255);
        h.push((bigInt >> 8) & 255);
        h.push(bigInt & 255);
        h.push(opacity);
        return h;
    }

    private rgbToHsv(r: number, g: number, b: number, opacity?: number): number[] {
        r /= 255; g /= 255; b /= 255;
        const max: number = Math.max(r, g, b); const min: number = Math.min(r, g, b);
        let h: number; const v: number = max;
        const d: number = max - min;
        const s: number = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0;
        } else {
            switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        const hsv: number[] = [Math.round(h * 360), Math.round(s * 1000) / 10, Math.round(v * 1000) / 10];
        if (!isNullOrUndefined(opacity)) {
            hsv.push(opacity);
        }
        return hsv;
    }

    private hsvToRgb(h: number, s: number, v: number, opacity?: number): number[] {
        let r: number; let g: number; let b: number;
        s /= 100; v /= 100;
        if (s === 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), opacity];
        }
        h /= 60;
        const i: number = Math.floor(h);
        const f: number = h - i;
        const p: number = v * (1 - s);
        const q: number = v * (1 - s * f);
        const t: number = v * (1 - s * (1 - f));
        switch (i) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        default: r = v; g = p; b = q;
        }
        const rgb: number[] = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        if (!isNullOrUndefined(opacity)) {
            rgb.push(opacity);
        }
        return rgb;
    }

    private rgbToHex(rgb: number[]): string {
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).substr(-2) : '00') : '')) : '';
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {HTMLElement} canvas - It describes about the html element
     * @private
     * @returns {void}
     */
    public updateCanvas(pageNumber: number, canvas?: HTMLElement): void {
        if (isNullOrUndefined(canvas)) {
            canvas = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageNumber);
            const zoom: number = this.pdfViewerBase.getZoomFactor();
            const ratio: number = this.pdfViewerBase.getZoomRatio(zoom);
            if (canvas) {
                const width: number = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].width;
                const height: number = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].height;
                (canvas as HTMLCanvasElement).width = width * ratio;
                (canvas as HTMLCanvasElement).height = height * ratio;
                (canvas as any).style.width = width * zoom + 'px';
                (canvas as any).style.height = height * zoom + 'px';
            }
        }
        this.pdfViewer.drawing.refreshCanvasDiagramLayer(canvas as HTMLCanvasElement, pageNumber);
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {void}
     */
    public rerenderFormFields(pageIndex: number): void {
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        let signatureValueRender: boolean = false;
        if (data) {
            let formFieldsData: any = JSON.parse(data);
            if (formFieldsData[0] === '[') {
                formFieldsData = JSON.parse(formFieldsData);
            }
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            if (formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    const currentData: any = formFieldsData[parseInt(i.toString(), 10)].FormField;
                    if (currentData.pageNumber === pageIndex + 1) {
                        const domElementId: HTMLElement = document.getElementById('form_field_' + currentData.id + '_html_element');
                        if (!domElementId) {
                            let signatureField: PdfFormFieldBaseModel = (this.pdfViewer.nameTable as any)[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]];
                            let element: DiagramHtmlElement = signatureField.wrapper.children[0] as DiagramHtmlElement;
                            const obj: any = this.pdfViewer.formFieldCollections.filter((field: any) => { return currentData.id.split('_')[0] === field.id; });
                            if (element && obj.length > 0 && obj[0].visibility === 'visible') {
                                if (currentData.formFieldAnnotationType === 'RadioButton') {
                                    for (let j: number = 0; j < currentData.radiobuttonItem.length; j++) {
                                        signatureField = (this.pdfViewer.nameTable as any)[currentData.radiobuttonItem[parseInt(j.toString(), 10)].id.split('_')[0]];
                                        element = signatureField.wrapper.children[0] as DiagramHtmlElement;
                                        currentData.radiobuttonItem[parseInt(j.toString(), 10)] =
                                         this.renderFormFieldsInZooming(element,
                                                                        currentData.radiobuttonItem[parseInt(j.toString(), 10)],
                                                                        signatureField, zoomValue);
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                            FormField.radiobuttonItem[parseInt(j.toString(), 10)].lineBound =
                                         currentData.radiobuttonItem[parseInt(j.toString(), 10)].lineBound;
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                            FormField.radiobuttonItem[parseInt(j.toString(), 10)].zoomValue = zoomValue;
                                    }
                                } else {
                                    const filteredField: any = this.pdfViewerBase.formFieldCollection.filter(function (field: any): any {
                                        return field.FormField.id === currentData.id;
                                    });
                                    if (currentData && currentData.value === '') {
                                        currentData.value = filteredField[0] ? filteredField[0].FormField.value : '';
                                        currentData.signatureType = filteredField[0] ? filteredField[0].FormField.signatureType : '';
                                    }
                                    if (!isNullOrUndefined(currentData)) {
                                        currentData.visibility = obj[0].visibility;
                                        filteredField[0].FormField.visibility = obj[0].visibility;
                                    }
                                    const zoomCurrentData: any =
                                    this.renderFormFieldsInZooming(element, currentData, signatureField, zoomValue);
                                    if (currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') {
                                        // eslint-disable-next-line
                                        const proxy: any = this;
                                        formFieldsData.filter(function (item: any): void {
                                            if (item.FormField.name === currentData.name && item.FormField.id !== currentData.id && !isNullOrUndefined(proxy.pdfViewer.nameTable[item.FormField.id]) && proxy.pdfViewer.nameTable[item.FormField.id].value !== '') {
                                                currentData.value = proxy.pdfViewer.nameTable[item.FormField.id].value;
                                                currentData.signatureType = item.FormField.signatureType === 'Text' ? 'Type' : item.FormField.signatureType;
                                                if (currentData.value !== '') {
                                                    currentData.signatureBound = item.FormField.signatureBound;
                                                }
                                            }
                                        });
                                        if ((isNullOrUndefined(proxy.pdfViewer.nameTable[currentData.id])
                                            || proxy.pdfViewer.nameTable[currentData.id].value === '') && currentData.value !== '') {
                                            if (this.pdfViewer.formFieldsModule) {
                                                this.pdfViewer.formFieldsModule.drawSignature(currentData.signatureType,
                                                                                              currentData.value, currentData);
                                            }
                                            signatureValueRender = true;
                                        }
                                    }
                                    currentData.lineBound = zoomCurrentData.lineBound;
                                    if (currentData.signatureBound) {
                                        currentData.signatureBound = zoomCurrentData.signatureBound;
                                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureBound =
                                         currentData.signatureBound;
                                        if ((currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') && currentData.signatureType === 'Image' && signatureValueRender) {
                                            setTimeout(() => {
                                                if (!isNullOrUndefined((this.pdfViewer.nameTable as any)[element.id.split('_')[0] + '_content'])) {
                                                    (this.pdfViewer.nameTable as any)[element.id.split('_')[0] + '_content'].signatureBound = currentData.signatureBound;
                                                }
                                            }, 10);
                                        } else {
                                            if (!isNullOrUndefined((this.pdfViewer.nameTable as any)[element.id.split('_')[0] + '_content'])) {
                                                (this.pdfViewer.nameTable as any)[element.id.split('_')[0] + '_content'].signatureBound = currentData.signatureBound;
                                            }
                                        }
                                    }
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.lineBound =
                                     currentData.lineBound;
                                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.zoomValue = zoomValue;
                                }
                            }
                        }
                    }
                    if (this.pdfViewerBase.isFocusField && this.pdfViewerBase.focusField) {
                        const currentField: HTMLElement = document.getElementById(this.pdfViewerBase.focusField.id);
                        if (currentField) {
                            if ((this.pdfViewerBase.focusField.type === 'SignatureField' || this.pdfViewerBase.focusField.type === 'InitialField') && this.pdfViewer.formDesignerModule) {
                                currentField.parentElement.focus();
                            }
                            else {
                                currentField.focus();
                            }
                            this.pdfViewerBase.isFocusField = false;
                            this.pdfViewerBase.focusField = [];
                        }
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
    }

    private renderFormFieldsInZooming(element: DiagramHtmlElement, currentData: any, signatureField: PdfFormFieldBaseModel,
                                      zoomValue: number): any {
        if (element) {
            const parentHtmlElementAttribute: Object = {
                'id': 'form_field_' + element.id + '_html_element',
                'class': 'foreign-object'
            };
            const parentHtmlElement: HTMLElement = this.createHtmlElement('div', parentHtmlElementAttribute);
            const HtmlElementAttribute: Object = {
                'id': element.id + '_html_element',
                'class': 'foreign-object'
            };
            const htmlElement: HTMLElement = this.createHtmlElement('div', HtmlElementAttribute);
            if (!isNullOrUndefined(currentData)) {
                signatureField.visibility = currentData.visibility;
            }
            if (currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') {
                this.disableSignatureClickEvent = true;
                signatureField.value = currentData.value;
                (signatureField as any).signatureType = currentData.signatureType;
                (signatureField as any).signatureBound = currentData.signatureBound;
                element.template = htmlElement.appendChild(this.createSignatureDialog(this.pdfViewer, signatureField));
                this.disableSignatureClickEvent = false;
            } else if (currentData.formFieldAnnotationType === 'DropdownList') {
                element.template = htmlElement.appendChild(this.createDropDownList(element, signatureField));
            } else if (currentData.formFieldAnnotationType === 'ListBox') {
                element.template = htmlElement.appendChild(this.createListBox(element, signatureField));
            } else {
                element.template = htmlElement.appendChild(this.createInputElement(currentData.formFieldAnnotationType, signatureField));
            }
            const divElement: HTMLDivElement = document.createElement('div');
            divElement.id = signatureField.id + '_designer_name';
            if (zoomValue > 0.5) {
                divElement.style.fontSize = this.defaultFontSize + 'px';
            }
            else {
                divElement.style.fontSize = '6px';
            }
            divElement.className = 'e-pv-show-designer-name';
            if (this.pdfViewer.designerMode) {
                divElement.innerHTML = signatureField.name;
                divElement.style.position = 'absolute';
            } else {
                divElement.innerHTML = '';
                divElement.style.position = 'initial';
            }
            htmlElement.appendChild(divElement);
            parentHtmlElement.appendChild(htmlElement);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentData.pageNumber - 1));
            textLayer.appendChild(parentHtmlElement);
            if (signatureField.formFieldAnnotationType === 'RadioButton') {
                if (document.getElementsByClassName('e-pv-radiobtn-span').length > 0) {
                    // this.renderRadioButtonSpan(spanElement, bounds, zoomValue);
                }
            }
            const point: PointModel = cornersPointsBeforeRotation(signatureField.wrapper.children[0]).topLeft;
            if (currentData.formFieldAnnotationType === 'Checkbox' && (Browser.isDevice)) {
                //ReCreate outer div while zoom options
                const outerDivHeight: number = element.actualSize.height + this.increasedSize;
                const outerDivWidth: number = element.actualSize.width + this.increasedSize;
                const outerDivAttribute: Object = {
                    'id': element.id + '_outer_div',
                    'className': 'e-pv-checkbox-outer-div'
                };
                const outerDiv: HTMLElement = createElement('div', outerDivAttribute);
                outerDiv.style.cssText = `height: ${outerDivHeight * zoomValue}px;width: ${outerDivWidth * zoomValue}px;
                left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;position: absolute;opacity: 1;`;
                outerDiv.appendChild(parentHtmlElement);
                outerDiv.addEventListener('click', this.setCheckBoxState.bind(this));
                textLayer.appendChild(outerDiv);
                htmlElement.style.cssText = `height: ${element.actualSize.height * zoomValue}px;
                width: ${element.actualSize.width * zoomValue}px;left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;
                transform: rotate(${element.rotateAngle + element.parentTransform}deg);
                pointer-events: ${this.pdfViewer.designerMode ? 'none' : 'all'};visibility: ${element.visible ? 'visible' : 'hidden'};
                opacity: ${element.style.opacity};`;
            } else {
                htmlElement.style.cssText = `height: ${element.actualSize.height * zoomValue}px;
                width: ${element.actualSize.width * zoomValue}px;left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;
                position: absolute;transform: rotate(${element.rotateAngle + element.parentTransform}deg);
                pointer-events: ${this.pdfViewer.designerMode ? 'none' : 'all'};visibility: ${element.visible ? 'visible' : 'hidden'};
                opacity: ${element.style.opacity};`;
            }
            currentData.lineBound = { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width *
                 zoomValue, Height: element.actualSize.height * zoomValue };
            if (currentData.signatureBound && signatureField.wrapper.children[1]) {
                const signPoint: Rect = signatureField.wrapper.children[1].bounds;
                currentData.signatureBound.x = signPoint.x * zoomValue;
                currentData.signatureBound.y = signPoint.y * zoomValue;
                currentData.signatureBound.width = signPoint.width * zoomValue;
                currentData.signatureBound.height = signPoint.height * zoomValue;
            }
        }
        return currentData;
    }
    /* This method was commented for this task ID EJ2-61222, A method renderRadioButtonSpan was
        implemented and the values which was already taken from getCheckBoxRadioButtonBounds,
        are again calculated based on zoomValues and the size of the radio button was changed.
        This makes the radio button big in size. Refer previous task IDs EJ2-50668 and EJ2-57850 Where these lines were added. */

    /* private renderRadioButtonSpan(spanElement: HTMLCollectionOf<Element>, bounds: any, zoomValue: number): void {
        for (let i: number = 0; i < spanElement.length; i++) {
            (spanElement as any)[i].style.width = Math.floor(bounds.width - 10) + "px";
            (spanElement as any)[i].style.height = Math.floor(bounds.height - 10) + "px";
            if (bounds.width <= 14 && parseInt((spanElement as any)[i].style.width, 10) >= 2) {
                if (parseInt((spanElement as any)[i].style.width, 10) <= 5) {
                    if (bounds.width > 10) {
                        (spanElement as any)[i].style.width = Math.floor(bounds.width / (1 + zoomValue)) + "px";
                        (spanElement as any)[i].style.height = Math.floor(bounds.height / (1 + zoomValue)) + "px";
                        (spanElement as any)[i].style.margin = Math.round(bounds.width / 4) + "px";
                    }
                    else if (bounds.width < 10 && bounds.width > 5) {
                        (spanElement as any)[i].style.width = (bounds.width / 1.85) + "px";
                        (spanElement as any)[i].style.height = (bounds.height / 1.85) + "px";
                    }
                    else if (bounds.width <= 5) {
                        (spanElement as any)[i].style.width = (bounds.width / 1.85) + "px";
                        (spanElement as any)[i].style.height = (bounds.height / 1.85) + "px";
                        (spanElement as any)[i].style.margin = (bounds.width / 3.5) + "px";
                    }
                }
            }
            if (parseInt((spanElement as any)[i].style.width, 10) <= 1 || parseInt((spanElement as any)[i].style.height, 10) <= 1) {
                if ((bounds.width * zoomValue) >= 2) {
                    (spanElement as any)[i].style.width = Math.round(bounds.width / 1.65) + "px";
                    (spanElement as any)[i].style.height = Math.round(bounds.height / 1.65) + "px";
                    (spanElement as any)[i].style.margin = bounds.width / 3.8 + "px";;
                } else {
                    (spanElement as any)[i].style.width = "1px";
                    (spanElement as any)[i].style.height = "1px";
                    (spanElement as any)[i].style.margin = "1px";
                }
            }
            if (bounds.width > 14) {
                (spanElement as any)[i].style.width = (bounds.width / 2) + "px";
                (spanElement[i] as any).style.height = (bounds.height / 2) + "px";
            }
            if (zoomValue <= 1 && zoomValue > 0.70) {
                (spanElement as any)[i].style.width = (bounds.width / 1.85) + "px";
                (spanElement[i] as any).style.height = (bounds.height / 1.85) + "px";
            }

        }
    }
    */

    /**
     * @param {DrawingElement} obj - It describes about the object
     * @param {string} formFieldAnnotationType - It describes about the form field annotation type
     * @private
     * @returns {any} - any
     */
    public updateFormFieldInitialSize(obj: DrawingElement, formFieldAnnotationType: string): any {
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        switch (formFieldAnnotationType) {
        case 'Textbox':
            obj.width = 200 * zoomValue;
            obj.height = 24 * zoomValue;
            break;
        case 'PasswordField':
            obj.width = 200 * zoomValue;
            obj.height = 24 * zoomValue;
            break;
        case 'SignatureField':
        case 'InitialField':
            obj.width = 200 * zoomValue;
            obj.height = 63 * zoomValue;
            break;
        case 'Checkbox':
            obj.width = 20 * zoomValue;
            obj.height = 20 * zoomValue;
            break;
        case 'RadioButton':
            obj.width = 20 * zoomValue;
            obj.height = 20 * zoomValue;
            break;
        case 'DropdownList':
            obj.width = 200 * zoomValue;
            obj.height = 24 * zoomValue;
            break;
        case 'ListBox':
            obj.width = 198 * zoomValue;
            obj.height = 66 * zoomValue;
            break;
        }
        return { width: obj.width, height: obj.height };
    }

    /**
     * @param {PdfAnnotationBaseModel} actualObject - It describes about the actual object
     * @private
     * @returns {void}
     */
    public updateHTMLElement(actualObject: PdfAnnotationBaseModel): void {
        const element: DrawingElement = actualObject.wrapper.children[0];
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        if (element) {
            const htmlElement: HTMLElement = document.getElementById(element.id + '_html_element');
            if (!isNullOrUndefined(htmlElement)) {
                const point: PointModel = cornersPointsBeforeRotation(actualObject.wrapper.children[0]).topLeft;
                htmlElement.style.cssText = `height: ${element.actualSize.height * zoomValue}px;
                width: ${element.actualSize.width * zoomValue}px;left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;
                position: absolute;transform: rotate(${element.rotateAngle + element.parentTransform}deg);
                pointer-events: ${this.pdfViewer.designerMode ? 'none' : 'all'};visibility: ${element.visible ? 'visible' : 'hidden'};
                opacity: ${element.style.opacity};`;
                const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                if (actualObject.formFieldAnnotationType === 'RadioButton') {
                    const labelContainer: Element = htmlElement.firstElementChild.firstElementChild;
                    const spanElement: Element = htmlElement.firstElementChild.firstElementChild.lastElementChild;
                    if (element.actualSize.width > element.actualSize.height) {
                        (htmlElement.firstElementChild as any).style.display = 'inherit';
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.height * zoomValue) + 'px';
                        (spanElement as any).style.width = (spanElement as any).style.height = (element.actualSize.height / 2) + 'px';
                    } else {
                        (htmlElement.firstElementChild as any).style.display = 'flex';
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.width * zoomValue) + 'px';
                        (spanElement as any).style.width = (spanElement as any).style.height = (element.actualSize.width / 2) + 'px';
                    }
                    if (zoomValue < 1 && (labelContainer as any).style.width <= 20 && (labelContainer as any).style.height <= 20) {
                        (spanElement as any).style.margin = Math.round(parseInt((labelContainer as any).style.width, 10) / 3.5) + 'px';
                    }
                    else {
                        (spanElement as any).style.margin = Math.round(parseInt((labelContainer as any).style.width, 10) / 4) + 'px';
                    }
                }
                if (actualObject.formFieldAnnotationType === 'Checkbox') {
                    const minCheckboxWidth: number = 20;
                    const labelContainer: Element = htmlElement.firstElementChild.firstElementChild;
                    const spanElement: Element = htmlElement.firstElementChild.firstElementChild.lastElementChild.firstElementChild;
                    if (element.actualSize.width > element.actualSize.height) {
                        (htmlElement.firstElementChild as any).style.display = 'inherit';
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.height * zoomValue) + 'px';
                        (spanElement as any).style.width = ((element.actualSize.height / 5) * zoomValue) + 'px';
                        (spanElement as any).style.height = ((element.actualSize.height / 2.5) * zoomValue) + 'px';
                        (spanElement as any).style.left = ((element.actualSize.height / 2.5) * zoomValue) + 'px';
                        (spanElement as any).style.top = ((element.actualSize.height / 5) * zoomValue) + 'px';
                    } else {
                        (htmlElement.firstElementChild as any).style.display = 'flex';
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.width * zoomValue) + 'px';
                        (spanElement as any).style.width = ((element.actualSize.width / 5) * zoomValue) + 'px';
                        (spanElement as any).style.height = ((element.actualSize.width / 2.5) * zoomValue) + 'px';
                        (spanElement as any).style.left = ((element.actualSize.width / 2.5) * zoomValue) + 'px';
                        (spanElement as any).style.top = ((element.actualSize.width / 5) * zoomValue) + 'px';
                    }
                    if (spanElement.className.indexOf('e-pv-cb-checked') !== -1) {
                        const checkboxWidth: number = parseInt((labelContainer as any).style.width, 10);
                        if (checkboxWidth > minCheckboxWidth) {
                            (spanElement as any).style.borderWidth = '3px';
                        } else if (checkboxWidth <= 15) {
                            (spanElement as any).style.borderWidth = '1px';
                        } else {
                            (spanElement as any).style.borderWidth = '2px';
                        }
                    }
                }
                if (actualObject.formFieldAnnotationType === 'SignatureField'  || actualObject.formFieldAnnotationType === 'InitialField'){
                    const signatureDiv: HTMLElement = htmlElement.firstElementChild.firstElementChild as HTMLElement;
                    const indicatorSpan: HTMLElement = signatureDiv.nextElementSibling as HTMLElement;
                    const bounds: any = this.getBounds(indicatorSpan as HTMLElement);
                    const options : any = {
                        height: element.actualSize.height ,
                        width: element.actualSize.width,
                        signatureIndicatorSettings : {
                            text : indicatorSpan.textContent,
                            width : bounds.width,
                            height : bounds.height
                        },
                        initialIndicatorSettings : {
                            text : indicatorSpan.textContent,
                            width : bounds.width,
                            height : bounds.height
                        }
                    };
                    this.updateSignatureandInitialIndicator(actualObject as any, options, signatureDiv);
                }
                const formFieldsData: any = JSON.parse(data);
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    if (formFieldsData[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'RadioButton') {
                        for (let j: number = 0; j < formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem.length; j++) {
                            if (element.id === formFieldsData[parseInt(i.toString(), 10)].
                                FormField.radiobuttonItem[parseInt(j.toString(), 10)].id) {
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                    FormField.radiobuttonItem[parseInt(j.toString(), 10)].lineBound =
                                 { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width *
                                     zoomValue, Height: element.actualSize.height * zoomValue };
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                    FormField.radiobuttonItem[parseInt(j.toString(), 10)].zoomValue = zoomValue;
                                break;
                            }
                        }
                    } else {
                        if (formFieldsData[parseInt(i.toString(), 10)].Key === element.id) {
                            formFieldsData[parseInt(i.toString(), 10)].FormField.lineBound =
                             { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width *
                                 zoomValue, Height: element.actualSize.height * zoomValue };
                            if (formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound) {
                                let x: number = (point.x * zoomValue) + (element.actualSize.width * zoomValue) / 2;
                                x = x - formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound.width / 2;
                                let y: number = (point.y * zoomValue) + (element.actualSize.height * zoomValue) / 2;
                                y = y - formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound.height / 2;
                                formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound.x = x;
                                formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound.y = y;
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureBound =
                                 formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound;
                                (this.pdfViewer.nameTable as any)[element.id.split('_')[0] + '_content'].signatureBound = formFieldsData[parseInt(i.toString(), 10)].FormField.signatureBound;
                            }
                            this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.lineBound =
                             formFieldsData[parseInt(i.toString(), 10)].FormField.lineBound;
                        }

                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
    }

    private getCheckboxRadioButtonBounds(drawingObject: PdfFormFieldBaseModel, bounds?: any, isPrint?: boolean): any {
        const zoomValue: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
        let width: number = 0;
        let height: number = 0;
        let display: string = '';
        if (bounds) {
            if (bounds.width > bounds.height) {
                width = height = bounds.height * zoomValue;
                display = 'inherit';
            } else {
                width = height = bounds.width * zoomValue;
                display = 'flex';
            }
        } else if (drawingObject) {
            if (drawingObject.bounds.width > drawingObject.bounds.height) {
                width = height = drawingObject.bounds.height * zoomValue;
                display = 'inherit';
            } else {
                width = height = drawingObject.bounds.width * zoomValue;
                display = 'flex';
            }
        }
        return { width: width, height: height, display: display };
    }

    private updateSessionFormFieldProperties(updatedFormFields: PdfFormFieldBaseModel): void {
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        const element: DiagramHtmlElement = updatedFormFields.wrapper.children[0] as DiagramHtmlElement;
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        if (!isNullOrUndefined(element)) {
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'RadioButton') {
                    for (let j: number = 0; j < formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem.length; j++) {
                        if (element.id === formFieldsData[parseInt(i.toString(), 10)].
                            FormField.radiobuttonItem[parseInt(j.toString(), 10)].id) {
                            const radioButtonItemUpdate: IRadiobuttonItem = {
                                id: element.id, lineBound: {
                                    X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue,
                                    Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue
                                },
                                name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber,
                                value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                                fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize,
                                fontStyle: updatedFormFields.fontStyle,
                                fontColor: this.getRgbCode(updatedFormFields.color) as unknown as string,
                                backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor) as unknown as string,
                                borderColor: this.getRgbCode(updatedFormFields.borderColor) as unknown as string,
                                thickness: updatedFormFields.thickness, textAlign: updatedFormFields.alignment,
                                isChecked: updatedFormFields.isChecked, isSelected: updatedFormFields.isSelected,
                                isReadonly: updatedFormFields.isReadonly, visibility: updatedFormFields.visibility,
                                maxLength: updatedFormFields.maxLength, isRequired: updatedFormFields.isRequired,
                                isPrint: updatedFormFields.isPrint, rotation: 0, tooltip: updatedFormFields.tooltip,
                                isMultiline: updatedFormFields.isMultiline, insertSpaces: updatedFormFields.insertSpaces,
                                isTransparent: updatedFormFields.isTransparent,
                                zIndex: updatedFormFields.zIndex, customData: updatedFormFields.customData
                            };
                            formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem[parseInt(j.toString(), 10)] =
                                radioButtonItemUpdate;
                            if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)] &&
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField &&
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                    FormField.radiobuttonItem[parseInt(j.toString(), 10)]) {
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                    FormField.radiobuttonItem[parseInt(j.toString(), 10)] = radioButtonItemUpdate;
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                    FormField.tooltip = radioButtonItemUpdate.tooltip;
                            }
                            break;
                        }
                    }
                } else if (formFieldsData[parseInt(i.toString(), 10)].Key === element.id) {
                    const formDesignObj: IFormField = {
                        id: element.id, lineBound: {
                            X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue,
                            Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue
                        },
                        name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber,
                        value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                        fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize,
                        fontStyle: updatedFormFields.fontStyle, fontColor: this.getRgbCode(updatedFormFields.color) as unknown as string,
                        backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor) as unknown as string,
                        borderColor: this.getRgbCode(updatedFormFields.borderColor) as unknown as string,
                        thickness: updatedFormFields.thickness, textAlign: updatedFormFields.alignment,
                        isChecked: updatedFormFields.isChecked, isSelected: updatedFormFields.isSelected,
                        isReadonly: updatedFormFields.isReadonly, font: {
                            isBold: updatedFormFields.font.isBold,
                            isItalic: updatedFormFields.font.isItalic, isStrikeout: updatedFormFields.font.isStrikeout,
                            isUnderline: updatedFormFields.font.isUnderline
                        }, selectedIndex: updatedFormFields.selectedIndex,
                        radiobuttonItem: null, option: updatedFormFields.options ? updatedFormFields.options : [],
                        visibility: updatedFormFields.visibility, maxLength: updatedFormFields.maxLength,
                        isRequired: updatedFormFields.isRequired, isPrint: updatedFormFields.isPrint, rotation: 0,
                        tooltip: updatedFormFields.tooltip,
                        isMultiline: updatedFormFields.isMultiline, insertSpaces: updatedFormFields.insertSpaces,
                        isTransparent: updatedFormFields.isTransparent, zIndex: updatedFormFields.zIndex,
                        customData: updatedFormFields.customData
                    };
                    if (formFieldsData[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'SignatureField' || formFieldsData[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'InitialField') {
                        const updatedSignatureFormFields: any = updatedFormFields;
                        const formDesignObj: IFormField = {
                            id: element.id, lineBound: {
                                X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue,
                                Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue
                            },
                            name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber,
                            value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                            fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize,
                            fontStyle: updatedFormFields.fontStyle, fontColor: this.getRgbCode(updatedFormFields.color),
                            backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor),
                            borderColor: this.getRgbCode(updatedFormFields.borderColor), thickness: updatedFormFields.thickness,
                            textAlign: updatedFormFields.alignment, isChecked: updatedFormFields.isChecked,
                            isSelected: updatedFormFields.isSelected,
                            isReadonly: updatedFormFields.isReadonly, font: {
                                isBold: updatedFormFields.font.isBold,
                                isItalic: updatedFormFields.font.isItalic, isStrikeout: updatedFormFields.font.isStrikeout,
                                isUnderline: updatedFormFields.font.isUnderline
                            }, selectedIndex: updatedFormFields.selectedIndex,
                            radiobuttonItem: null, option: updatedFormFields.options ? updatedFormFields.options : [],
                            visibility: updatedFormFields.visibility, maxLength: updatedFormFields.maxLength,
                            isRequired: updatedFormFields.isRequired, isPrint: updatedFormFields.isPrint,
                            rotation: 0, tooltip: updatedFormFields.tooltip,
                            signatureType: updatedFormFields.signatureType, signatureBound: updatedSignatureFormFields.signatureBound,
                            isMultiline: updatedFormFields.isMultiline, insertSpaces: updatedFormFields.insertSpaces,
                            isTransparent: updatedFormFields.isTransparent, zIndex: updatedFormFields.zIndex,
                            customData: updatedFormFields.customData
                        };
                        formFieldsData[parseInt(i.toString(), 10)].FormField = formDesignObj;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField = formDesignObj;
                    } else {
                        formFieldsData[parseInt(i.toString(), 10)].FormField = formDesignObj;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField = formDesignObj;
                    }
                    break;
                }
            }
        }
        if (this.pdfViewerBase.formFieldCollection.length > 0) {
            this.pdfViewerBase.enableFormFieldButton(true);
        } else {
            this.pdfViewerBase.enableFormFieldButton(false);
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    /**
     * @param {any} commandHandler - It describes about the command handler
     * @param {any} signatureField - It describes about the signature field
     * @param {any} bounds - It describes about the bounds
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {HTMLElement} - html element
     */
    public createSignatureDialog(commandHandler: any, signatureField: any, bounds?: any, isPrint?: boolean): HTMLElement {
        this.isInitialField = isNullOrUndefined(signatureField.isInitialField) ? false : signatureField.isInitialField;
        this.pdfViewerBase.isInitialField = this.isInitialField;
        this.pdfViewerBase.isInitialField = signatureField.isInitialField;
        const element: HTMLElement = createElement('div');
        element.className = 'foreign-object';
        element.style.position = 'absolute';
        element.style.width = '100%';
        element.style.height = '100%';
        element.addEventListener('focus', this.focusFormFields.bind(this));
        element.addEventListener('blur', this.blurFormFields.bind(this));
        const divElement: HTMLElement = createElement('div');
        divElement.style.width = '100%';
        divElement.style.height = '100%';
        divElement.style.position = 'absolute';
        divElement.style.backgroundColor = 'transparent';
        if (!isNullOrUndefined(signatureField.thickness)) {
            divElement.className = 'e-pdfviewer-signatureformfields-signature';
            divElement.style.border = (signatureField.thickness) + 'px solid #303030';
        }
        if (!isNullOrUndefined(signatureField.value) && signatureField.value !== '') {
            divElement.className = 'e-pdfviewer-signatureformfields-signature';
            divElement.style.pointerEvents = 'none';
        } else {
            divElement.className = 'e-pdfviewer-signatureformfields';
            divElement.style.pointerEvents = '';
        }
        divElement.id = signatureField.id;
        (divElement as any).disabled = signatureField.isReadonly;
        element.appendChild(divElement);
        const signatureFieldSettings: any = this.pdfViewer.signatureFieldSettings;
        const initialFieldSettings: any = this.pdfViewer.initialFieldSettings;
        if (!signatureFieldSettings.signatureIndicatorSettings) {
            signatureFieldSettings.signatureIndicatorSettings = { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' };
        }
        if (!signatureFieldSettings.signatureDialogSettings) {
            signatureFieldSettings.signatureDialogSettings =
             { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false };
        }
        if (!initialFieldSettings.initialIndicatorSettings) {
            initialFieldSettings.initialIndicatorSettings = { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' };
        }
        if (!initialFieldSettings.initialDialogSettings) {
            initialFieldSettings.initialDialogSettings =
             { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false };
        }
        //check whether the width for sign indicator has default value or not and then set the default width value for initial field.
        let indicatorSettings: any;
        if (signatureField.isInitialField) {
            indicatorSettings = signatureField.signatureIndicatorSettings ?
                signatureField.signatureIndicatorSettings : initialFieldSettings.initialIndicatorSettings;
        }
        else {
            indicatorSettings = signatureField.signatureIndicatorSettings ?
                signatureField.signatureIndicatorSettings : signatureFieldSettings.signatureIndicatorSettings;
        }
        const defaultWidth: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width ===
         19 ? (signatureField.isInitialField ? 30 : 25) : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width;
        const signatureFieldIndicatorWidth: number = indicatorSettings.width ? indicatorSettings.width :
            (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.width) ?
                signatureField.signatureIndicatorSettings.width : defaultWidth;
        const defaultHeight: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height ===
         10 ? 13 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height;
        const signatureFieldIndicatorHeight: number = indicatorSettings.height ? indicatorSettings.height :
            (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.height) ?
                signatureField.signatureIndicatorSettings.height : defaultHeight;
        const signatureFieldIndicatorBG: string = indicatorSettings.backgroundColor ? (indicatorSettings.backgroundColor === 'orange' ? '#FFE48559' : indicatorSettings.backgroundColor) : (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.backgroundColor) ? signatureField.signatureIndicatorSettings.backgroundColor : '#FFE48559';
        const signatureFieldWidth: any = signatureField.bounds ? signatureField.bounds.width : bounds.width;
        const signatureFieldHeight: any = signatureField.bounds ? signatureField.bounds.height : bounds.height;
        const height: number = signatureFieldIndicatorHeight > signatureFieldHeight / 2 ? signatureFieldHeight / 2 :
            signatureFieldIndicatorHeight;
        const width: number = signatureFieldIndicatorWidth > signatureFieldWidth / 2 ? signatureFieldWidth / 2 :
            signatureFieldIndicatorWidth;
        let fontSize: number = 10;
        if (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.fontSize)
        {fontSize = signatureField.signatureIndicatorSettings.fontSize > height / 2 ? 10 :
            signatureField.signatureIndicatorSettings.fontSize; }
        else
        {fontSize = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize > height / 2 ?
            10 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize; }

        const spanElement: any = createElement('span');
        if (!initialFieldSettings.initialIndicatorSettings) {
            initialFieldSettings.initialIndicatorSettings = { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' };
        }
        if (!initialFieldSettings.initialDialogSettings) {
            initialFieldSettings.initialDialogSettings =
             { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false };
        }
        const fieldText: string = signatureField.signatureIndicatorSettings ? signatureField.signatureIndicatorSettings.text : null;
        if (signatureField.formFieldAnnotationType === 'InitialField') {
            spanElement.id = 'initialIcon_' + signatureField.pageIndex + '_' + this.setFormFieldIdIndex();
            spanElement.style.fontFamily = 'Helvetica';
            this.setIndicatorText(spanElement, fieldText, this.pdfViewer.initialFieldSettings.initialIndicatorSettings.text, 'Initial');
        } else {
            spanElement.style.height = '';
            spanElement.style.width = '';
            spanElement.id = 'signIcon_' + signatureField.pageIndex + '_' + this.setFormFieldIdIndex();
            spanElement.style.fontFamily = 'Helvetica';
            this.setIndicatorText(spanElement, fieldText, this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text, 'Sign');
        }
        spanElement.style.overflow = 'hidden';
        spanElement.style.whiteSpace =  'nowrap';
        spanElement.style.padding = '2px 3px 2px 1px';
        spanElement.style.boxSizing = 'border-box';
        const zoomValue : number = this.pdfViewerBase.getZoomFactor() as number;
        spanElement.style.textAlign = 'left';
        spanElement.style.fontSize = ((fontSize * zoomValue) as number) + 'px';
        const boundsOfSpan: any = this.getBounds(spanElement);
        //Set spanelement indicator property
        spanElement.style.backgroundColor = signatureFieldIndicatorBG;            spanElement.style.color = indicatorSettings.color;
        spanElement.style.opacity = indicatorSettings.opacity;
        spanElement.style.height = signatureFieldIndicatorHeight;
        spanElement.style.width = signatureFieldIndicatorWidth;
        spanElement.style.position = 'absolute';
        const widthNew : number = this.setHeightWidth(signatureFieldWidth, width, boundsOfSpan.width + fontSize, zoomValue);
        spanElement.style.width = widthNew + 'px';
        const heightNew : number = this.setHeightWidth(signatureFieldHeight, height, boundsOfSpan.height, zoomValue);
        spanElement.style.height = heightNew + 'px';
        if (zoomValue < 1) {
            const heightValue: number = parseInt(spanElement.style.height, 10);
            spanElement.style.fontSize = (heightValue - this.signIndicatorPadding) < this.signIndicatorMinimunFontSize ? this.signIndicatorMinimunFontSize + 'px' : heightValue - this.signIndicatorPadding + 'px';
        }
        if (!isPrint) {
            element.appendChild(spanElement);
        }
        this.updateSignInitialFieldProperties(signatureField, signatureField.isInitialField,
                                              this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        if (!isNullOrUndefined(signatureField.tooltip) && signatureField.tooltip !== '') {
            this.setToolTip(signatureField.tooltip, element.firstElementChild);
        }
        this.updateSignatureFieldProperties(signatureField, element, isPrint);
        return element;
    }


    private setIndicatorText(spanElement: any, fieldText: any, indicatorText: string, defaultText: string): void {
        spanElement.innerHTML = fieldText ? fieldText : indicatorText ? indicatorText : defaultText;
    }

    private getBounds(htmlElement : HTMLElement) : any {
        const clonedElement: HTMLElement = htmlElement.cloneNode(true) as HTMLElement;
        clonedElement.style.height = '';
        clonedElement.style.width = '';
        clonedElement.id = clonedElement.id + '_clonedElement';
        document.body.appendChild(clonedElement);
        const clone: HTMLElement = document.getElementById(clonedElement.id);
        const bounds: any = clone.getBoundingClientRect();
        document.body.removeChild(clonedElement);
        return bounds;
    }

    private updateSignatureandInitialIndicator(formFieldObject : any, options : any, htmlElement : any): any {
        if (htmlElement !== null){
            const fieldBounds: any = htmlElement.getBoundingClientRect();
            const zoomValue: number = this.pdfViewerBase.getZoomFactor();
            const spanElement: any = htmlElement.nextElementSibling;
            let objIndicatorSettings: SignatureIndicatorSettings;
            let indicatorSettings: SignatureIndicatorSettings;
            if (formFieldObject.formFieldAnnotationType === 'SignatureField'){
                objIndicatorSettings  = formFieldObject.signatureIndicatorSettings;
                indicatorSettings = options.signatureIndicatorSettings;
            }
            if (formFieldObject.formFieldAnnotationType === 'InitialField'){
                objIndicatorSettings = formFieldObject.signatureIndicatorSettings ?
                    formFieldObject.signatureIndicatorSettings : this.pdfViewer.initialFieldSettings.initialIndicatorSettings;
                indicatorSettings  = options.initialIndicatorSettings;
            }
            spanElement.style.width = '';
            spanElement.style.height = '';
            if (indicatorSettings && objIndicatorSettings){
                if (indicatorSettings.text !== undefined){
                    this.setIndicatorText(spanElement, indicatorSettings.text, indicatorSettings.text, 'Sign');
                    objIndicatorSettings.text = indicatorSettings.text;
                }
                if (indicatorSettings.fontSize){
                    spanElement.style.fontSize = indicatorSettings.fontSize >  formFieldObject.height / 2 ? 10 : indicatorSettings.fontSize * zoomValue + 'px';
                    objIndicatorSettings.fontSize = indicatorSettings.fontSize;
                }
                const bounds: any = this.getBounds(spanElement);
                if (indicatorSettings.color){
                    spanElement.style.color = indicatorSettings.color;
                    objIndicatorSettings.color = this.nameToHash(indicatorSettings.color);
                }
                if (indicatorSettings.backgroundColor){
                    spanElement.style.backgroundColor = indicatorSettings.backgroundColor;
                    objIndicatorSettings.backgroundColor = this.nameToHash(indicatorSettings.backgroundColor);
                }
                if (!isNullOrUndefined(indicatorSettings.opacity)) {
                    spanElement.style.opacity = indicatorSettings.opacity;
                    objIndicatorSettings.opacity = indicatorSettings.opacity;
                }
                if (indicatorSettings.width || options.width || indicatorSettings.text){
                    const width : number = this.setHeightWidth(fieldBounds.width, indicatorSettings.width, bounds.width, zoomValue);
                    spanElement.style.width = width + 'px';
                    objIndicatorSettings.width = width;
                }
                if (indicatorSettings.height || options.height || indicatorSettings.text){
                    const height : number = this.setHeightWidth(fieldBounds.height, indicatorSettings.height, bounds.height, zoomValue);
                    spanElement.style.height = height + 'px';
                    objIndicatorSettings.height = height;
                }
            }
            this.updateSignatureFieldProperties(formFieldObject, htmlElement, formFieldObject.isPrint);
            if (formFieldObject.signatureIndicatorSettings && objIndicatorSettings){
                formFieldObject.signatureIndicatorSettings = objIndicatorSettings;
            }
            return formFieldObject;
        }
    }

    private setHeightWidth(fieldBound : number, indicatorBound : number , referenceBound : number, zoomValue : number ) : number{
        let heightOrWidth : number;
        if (fieldBound / 2 > indicatorBound && referenceBound < indicatorBound){
            heightOrWidth = indicatorBound * zoomValue;
        }
        else if (referenceBound <= fieldBound / 2){
            heightOrWidth = referenceBound * zoomValue ;
        }
        else{
            heightOrWidth = fieldBound / 2 * zoomValue;
        }
        return heightOrWidth;
    }

    /**
     * @param {DiagramHtmlElement} dropdownElement -  It describes about the dropdown element
     * @param {PdfFormFieldBaseModel} drawingObject - It describes about the drawing object
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {HTMLElement} - html element
     */
    public createDropDownList(dropdownElement: DiagramHtmlElement, drawingObject: PdfFormFieldBaseModel, isPrint?: boolean): HTMLElement {
        const element: HTMLElement = createElement('div');
        element.className = 'foreign-object';
        element.style.position = 'absolute';
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.backgroundColor = drawingObject.backgroundColor;
        const select: HTMLSelectElement = document.createElement('select');
        select.addEventListener('change', this.dropdownChange.bind(this));
        select.addEventListener('focus', this.focusFormFields.bind(this));
        select.addEventListener('blur', this.blurFormFields.bind(this));
        select.id = drawingObject.id;
        select.name = 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + dropdownElement.id;
        select.setAttribute('aria-label', 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + dropdownElement.id );
        select.className = 'e-pv-formfield-dropdown';
        select.style.width = '100%';
        select.style.height = '100%';
        select.style.position = 'absolute';
        this.updateDropdownFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        const dropDownChildren: ItemModel[] = drawingObject.options ? drawingObject.options : [];
        this.updateDropdownListProperties(drawingObject, select, isPrint);
        for (let j: number = 0; j < dropDownChildren.length; j++) {
            const option: HTMLOptionElement = document.createElement('option');
            option.className = 'e-pv-formfield-dropdown';
            option.value = dropDownChildren[parseInt(j.toString(), 10)].itemValue;
            option.text = dropDownChildren[parseInt(j.toString(), 10)].itemName;
            this.updateDropdownListProperties(drawingObject, option);
            select.appendChild(option);
        }
        if (isNullOrUndefined((drawingObject as any).selectedIndex) || (drawingObject as any).selectedIndex.length === 0) {
            select.selectedIndex = -1;
        }
        else {
            select.selectedIndex = !isNullOrUndefined((drawingObject as any).selectedIndex) ? (drawingObject as any).selectedIndex : 0;
        }
        element.appendChild(select);
        if (!isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip !== '') {
            this.setToolTip(drawingObject.tooltip, element.firstElementChild);
        }
        return element;
    }

    /**
     * @param {DiagramHtmlElement} listBoxElement - It describes about the list box element
     * @param {PdfFormFieldBaseModel} drawingObject - It describes about the drawing object
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {HTMLElement} - html element
     */
    public createListBox(listBoxElement: DiagramHtmlElement, drawingObject: PdfFormFieldBaseModel, isPrint?: boolean): HTMLElement {
        const element: HTMLElement = createElement('div');
        element.className = 'foreign-object';
        element.style.position = 'absolute';
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.backgroundColor = drawingObject.backgroundColor;
        const select: HTMLSelectElement = document.createElement('select');
        select.addEventListener('click', this.listBoxChange.bind(this));
        select.addEventListener('focus', this.focusFormFields.bind(this));
        select.addEventListener('blur', this.blurFormFields.bind(this));
        select.id = drawingObject.id;
        select.name = 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + listBoxElement.id;
        select.setAttribute('aria-label', 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + listBoxElement.id );
        select.className = 'e-pv-formfield-listbox';
        select.style.width = '100%';
        select.style.height = '100%';
        select.style.position = 'absolute';
        select.multiple = true;
        this.updatelistBoxFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        const dropDownChildren: ItemModel[] = drawingObject.options ? drawingObject.options : [];
        this.updateListBoxProperties(drawingObject, select, isPrint);
        for (let j: number = 0; j < dropDownChildren.length; j++) {
            const option: HTMLOptionElement = document.createElement('option');
            option.className = 'e-pv-formfield-listbox';
            option.value = dropDownChildren[parseInt(j.toString(), 10)].itemValue;
            option.text = dropDownChildren[parseInt(j.toString(), 10)].itemName;
            if (!isNullOrUndefined((drawingObject as any).selectedIndex)) {
                for (let k: number = 0; k < (drawingObject as any).selectedIndex.length; k++) {
                    if (j === (drawingObject as any).selectedIndex[parseInt(k.toString(), 10)]) {
                        option.selected = true;
                    }
                }
            }
            select.appendChild(option);
        }
        element.appendChild(select);
        if (!isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip !== '') {
            this.setToolTip(drawingObject.tooltip, element.firstElementChild);
        }
        return element;
    }

    /**
     * @param {string} formFieldAnnotationType - It describes about the form field annotation type
     * @param {PdfFormFieldBaseModel} drawingObject - It describes about the drawing object
     * @param {any} formFieldBounds - It describes about the form field bounds
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {HTMLElement} - html element
     */
    public createInputElement(formFieldAnnotationType: string, drawingObject: PdfFormFieldBaseModel,
                              formFieldBounds?: any, isPrint?: boolean): HTMLElement {
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        const element: HTMLElement = createElement('div');
        element.className = 'foreign-object';
        element.style.position = 'absolute';
        element.style.width = '100%';
        element.style.height = '100%';
        let labelElement: HTMLElement;
        let checkboxDiv: HTMLElement;
        let innerSpan: HTMLElement;
        let inputElement: HTMLElement = createElement('input');
        let textArea: HTMLElement = createElement('textarea');
        inputElement.id = drawingObject.id;
        inputElement.setAttribute('aria-label', this.pdfViewer.element.id + 'formfilldesigner');
        inputElement.style.position = 'absolute';
        if (formFieldAnnotationType === 'Textbox') {
            if (drawingObject.isMultiline) {
                textArea = this.createTextAreaElement(inputElement.id);
                this.updateTextFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
                this.updateTextboxProperties(drawingObject, textArea, isPrint);
            } else {
                inputElement = this.createTextboxElement(inputElement.id);
                this.updateTextFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
                this.updateTextboxProperties(drawingObject, inputElement, isPrint);
            }
        } else if (formFieldAnnotationType === 'Checkbox') {
            const zoomLevel: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
            const minCheckboxWidth: number = 20;
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            const bounds: any = this.getCheckboxRadioButtonBounds(drawingObject, formFieldBounds, isPrint);
            element.style.display = bounds.display;
            labelElement = createElement('label', { className: 'e-pv-checkbox-container' });
            labelElement.style.width = drawingObject.bounds ? (drawingObject.bounds.width * zoomLevel) + 'px' : bounds.width + 'px';
            labelElement.style.height = drawingObject.bounds ? (drawingObject.bounds.height * zoomLevel) + 'px' : bounds.height + 'px' ;
            if (this.isDrawHelper)
            {labelElement.style.cursor = 'crosshair'; }
            else
            {labelElement.style.cursor = 'pointer'; }
            checkboxDiv = createElement('div', { className: 'e-pv-checkbox-div' });
            if (!Browser.isDevice) {
                checkboxDiv.addEventListener('click', this.setCheckBoxState.bind(this));
                checkboxDiv.addEventListener('focus', this.focusFormFields.bind(this));
                checkboxDiv.addEventListener('blur', this.blurFormFields.bind(this));
            }
            (checkboxDiv as HTMLElement).id = drawingObject.id + '_input';
            if (drawingObject.isChecked) {
                innerSpan = createElement('span', { className: 'e-pv-checkbox-span e-pv-cb-checked' });
            }
            else
            {innerSpan = createElement('span', { className: 'e-pv-checkbox-span e-pv-cb-unchecked' }); }
            innerSpan.id = drawingObject.id + '_input_span';
            labelElement.id = drawingObject.id + '_input_label';
            innerSpan.style.width = (bounds.width / 5) + 'px';
            innerSpan.style.height = (bounds.height / 2.5) + 'px';
            innerSpan.style.left = (bounds.width / 2.5) + 'px';
            innerSpan.style.top = (bounds.height / 5) + 'px';
            if (innerSpan.className.indexOf('e-pv-cb-checked') !== -1) {
                const checkboxWidth: number = parseInt(labelElement.style.width, 10);
                if (checkboxWidth > minCheckboxWidth) {
                    innerSpan.style.borderWidth = '3px';
                } else if (checkboxWidth <= 15) {
                    innerSpan.style.borderWidth = '1px';
                } else {
                    innerSpan.style.borderWidth = '2px';
                }
            }
            if (isPrint) {
                checkboxDiv.style.backgroundColor = 'rgb(218, 234, 247)';
                checkboxDiv.style.border = '1px solid #303030';
                checkboxDiv.style.visibility = 'visible';
                checkboxDiv.style.height = '100%';
                checkboxDiv.style.width = '100%';
                checkboxDiv.style.position = 'absolute';
                if (innerSpan.className.indexOf('e-pv-cb-checked') !== -1) {
                    innerSpan.style.border = 'solid #303030';
                    innerSpan.style.position = 'absolute';
                    innerSpan.style.borderLeft = 'transparent';
                    innerSpan.style.borderTop = 'transparent';
                    innerSpan.style.transform = 'rotate(45deg)';
                    const checkboxWidth: number = parseInt(labelElement.style.width, 10);
                    if (checkboxWidth > minCheckboxWidth) {
                        innerSpan.style.borderWidth = '3px';
                    }
                    else if (checkboxWidth <= 15) {
                        innerSpan.style.borderWidth = '1px';
                    }
                    else {
                        innerSpan.style.borderWidth = '2px';
                    }
                }
            }
            (inputElement as IElement).type = 'checkbox';
            inputElement.style.margin = '0px';
            inputElement.style.width = bounds.width + 'px';
            inputElement.style.height = bounds.height + 'px';
            if (!isPrint) {
                this.updateCheckBoxFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                           this.isSetFormFieldMode);
            }
            this.updateCheckboxProperties(drawingObject, checkboxDiv);
            inputElement.appendChild(labelElement);
            labelElement.appendChild(checkboxDiv);
            checkboxDiv.appendChild(innerSpan);
            if (isPrint) {
                inputElement.style.outlineWidth = drawingObject.thickness + 'px';
                inputElement.style.outlineColor = drawingObject.borderColor;
                inputElement.style.outlineStyle = 'solid';
                inputElement.style.background = drawingObject.backgroundColor;
            }
        } else if (formFieldAnnotationType === 'PasswordField') {
            (inputElement as IElement).type = 'password';
            inputElement.className = 'e-pv-formfield-input';
            inputElement.style.width = '100%';
            inputElement.style.height = '100%';
            inputElement.style.borderStyle = 'solid';
            inputElement.addEventListener('click', this.inputElementClick.bind(this));
            inputElement.addEventListener('focus', this.focusFormFields.bind(this));
            inputElement.addEventListener('blur', this.blurFormFields.bind(this));
            inputElement.addEventListener('change', this.getTextboxValue.bind(this));
            this.updatePasswordFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
            this.updatePasswordFieldProperties(drawingObject, inputElement, isPrint);
        } else {
            /*
            The below line have been commented for "EJ2-59941 bug"
            While setting the textAlign to center the radio button position moved from center to the parent element
            instead of left to the parent element
            element.style.textAlign = (Browser.info.name === "chrome") ? "-webkit-center" : "center";
            */
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            const bounds: any = this.getCheckboxRadioButtonBounds(drawingObject, formFieldBounds, isPrint);
            element.style.display = bounds.display;
            labelElement = createElement('label', { className: 'e-pv-radiobtn-container' });
            labelElement.style.width = bounds.width + 'px';
            labelElement.style.height = bounds.height + 'px';
            labelElement.style.display = 'table';
            labelElement.style.verticalAlign = 'middle';
            labelElement.style.borderWidth = drawingObject.thickness + 'px';
            labelElement.style.boxShadow = drawingObject.borderColor + ' 0px 0px 0px ' + drawingObject.thickness + 'px';
            labelElement.style.borderRadius = '50%';
            labelElement.style.visibility = drawingObject.visibility;
            if (this.isDrawHelper)
            {labelElement.style.cursor = 'crosshair'; }
            else
            {labelElement.style.cursor = 'pointer'; }
            labelElement.style.background = drawingObject.backgroundColor;
            innerSpan = createElement('span', { className: 'e-pv-radiobtn-span' });
            innerSpan.id = drawingObject.id + '_input_span';
            innerSpan.style.width = Math.floor(bounds.width / 2) + 'px';
            innerSpan.style.height = Math.floor(bounds.height / 2) + 'px';
            if (zoomValue < 1 && bounds.width <= 20 && bounds.height <= 20) {
                innerSpan.style.margin = Math.round(parseInt(labelElement.style.width, 10) / 3.5) + 'px';
            } else {
                innerSpan.style.margin = Math.round(parseInt(labelElement.style.width, 10) / 4) + 'px';
            }
            labelElement.addEventListener('click', this.setRadioButtonState.bind(this));
            labelElement.id = drawingObject.id + '_input_label';
            (inputElement as IElement).type = 'radio';
            if (!isPrint)
            {inputElement.className = 'e-pv-radio-btn'; }
            inputElement.style.margin = '0px';
            inputElement.addEventListener('click', function (event: any): void {
                event.stopPropagation();
            });
            inputElement.addEventListener('focus', this.focusFormFields.bind(this));
            inputElement.addEventListener('blur', this.blurFormFields.bind(this));
            inputElement.style.width = bounds.width + 'px';
            inputElement.style.height = bounds.height + 'px';
            this.updateRadioButtonFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                         this.isSetFormFieldMode);
            this.updateRadioButtonProperties(drawingObject, inputElement, labelElement);
            labelElement.appendChild(inputElement);
            labelElement.appendChild(innerSpan);
            if (drawingObject.isRequired) {
                labelElement.style.boxShadow = 'red 0px 0px 0px ' + drawingObject.thickness + 'px';
            }
            // if (isPrint) {
            //     inputElement.style.outlineWidth = drawingObject.thickness + 'px';
            //     inputElement.style.outlineColor = drawingObject.borderColor;
            //     inputElement.style.outlineStyle = 'solid';
            //     inputElement.style.background = drawingObject.backgroundColor;
            // }
        }
        if ((formFieldAnnotationType === 'Checkbox' || formFieldAnnotationType === 'RadioButton') && !isPrint) {
            element.appendChild(labelElement);
        }
        else if (formFieldAnnotationType === 'Checkbox' && isPrint) {
            element.appendChild(labelElement);
        }
        else {
            if (drawingObject.isMultiline) {
                element.appendChild(textArea);
            } else {
                element.appendChild(inputElement);
            }
        }
        if (!isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip !== '') {
            if (formFieldAnnotationType === 'RadioButton')
            {this.setToolTip(drawingObject.tooltip, labelElement); }
            else if (formFieldAnnotationType === 'Textbox' || formFieldAnnotationType === 'PasswordField') {
                this.setToolTip(drawingObject.tooltip, element.firstElementChild);
            }
            else if (formFieldAnnotationType === 'Checkbox') {
                this.setToolTip(drawingObject.tooltip, element.firstElementChild.lastElementChild);
            }
        }
        this.isDrawHelper = false;
        return element;
    }

    private listBoxChange(event: Event): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        let targetField: any = null;
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.currentTarget as Element).id.split('_')[0] ||
                (this.pdfViewer.nameTable as any)[(event.currentTarget as Element).id.split('_')[0]].name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.currentTarget as Element).id.split('_')[0]) {
                    const inputElement: Element = document.getElementById((formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_content_html_element')).firstElementChild.firstElementChild;
                    for (let k: number = 0; k < (event.currentTarget as IElement).options.length; k++) {
                        (inputElement as IElement).options[parseInt(k.toString(), 10)].selected =
                         (event.currentTarget as IElement).options[parseInt(k.toString(), 10)].selected;
                    }
                }
                formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex = [];
                const oldValues: any = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex;
                for (let j: number = 0; j < (event.currentTarget as IElement).selectedOptions.length; j++) {
                    const selectIndex: number = (event.currentTarget as IElement).selectedOptions[parseInt(j.toString(), 10)].index;
                    let oldValueIndex: number = 0;
                    if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex &&
                     this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex.length !== 0) {
                        if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex[0] >= 0){
                            oldValueIndex = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                FormField.selectedIndex.pop();
                        }
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex.push(oldValueIndex);
                    }
                    const oldValue: any = formFieldsData[parseInt(i.toString(), 10)].FormField.
                        option[parseInt(oldValueIndex.toString(), 10)].itemValue;
                    formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex.push(selectIndex);
                    (this.pdfViewer.nameTable as any)[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]].selectedIndex = formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex;
                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex =
                     formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex;
                    const newValue: any = formFieldsData[parseInt(i.toString(), 10)].FormField.
                        option[parseInt(selectIndex.toString(), 10)].itemValue;
                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = newValue;
                    this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField);
                    targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: any): any { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                    this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                      false, false, false, false, false, false, false, false,
                                                                      false, false, false, false, oldValue, newValue);
                }
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, 'FormField Value Change', '', oldValues, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        this.updateFormFieldSessions(targetField);
    }

    private dropdownChange(event: Event): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        let targetField: any = null;
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.target as Element).id.split('_')[0] ||
                (this.pdfViewer.nameTable as any)[(event.target as Element).id.split('_')[0]].name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex = [];
                const selectIndex: number = (document.getElementById((event.currentTarget as Element).id) as IElement).selectedIndex;
                let oldValueIndex: number = 0;
                if (formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex.length !== 0) {
                    oldValueIndex = formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex.pop();
                    formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex.push(oldValueIndex);
                }
                const oldValue: any = formFieldsData[parseInt(i.toString(), 10)].FormField.
                    option[parseInt(oldValueIndex.toString(), 10)].itemValue;
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex.push(selectIndex);
                formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex =
                 this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex;
                (this.pdfViewer.nameTable as any)[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]].selectedIndex = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex;
                const newValue: any = formFieldsData[parseInt(i.toString(), 10)].
                    FormField.option[parseInt(selectIndex.toString(), 10)].itemValue;
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = newValue;
                if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.target as Element).id.split('_')[0]) {
                    const inputElement: Element = document.getElementById((formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_content_html_element')).firstElementChild.firstElementChild;
                    (inputElement as IElement).selectedIndex = selectIndex;
                }
                this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField);
                targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: any): any { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                  false, false, false, false, false, false, false, false,
                                                                  false, false, false, false, oldValue, newValue);
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, 'FormField Value Change', '', oldValueIndex, selectIndex);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        this.updateFormFieldSessions(targetField);
    }

    public setCheckBoxState(event: Event): void {
        if ((Browser.isDevice) ? ((event.target as Element).classList.contains('') || (event.target as Element).classList.contains('e-pv-checkbox-outer-div') || (event.target as Element).classList.contains('e-pv-checkbox-div')) && (event.currentTarget as Element).classList.contains('e-pv-checkbox-outer-div') && !this.pdfViewer.designerMode : !this.pdfViewer.designerMode) {
            const minCheckboxWidth: number = 20;
            let isChecked: boolean = false;
            let checkTarget: Element;
            let targetField: any = null;
            if (Browser.isDevice) {
                checkTarget = document.getElementById((event.target as Element).id.split('_')[0] + '_input');
            } else {
                checkTarget = (event.target as Element);
            }
            if ((event.target as Element).id !== 'undefined_input' && !(this.pdfViewer.nameTable as any)[(event.target as Element).id.split('_')[0]].isReadonly && !this.pdfViewer.designerMode) {
                if (checkTarget && checkTarget.firstElementChild && checkTarget.firstElementChild.className === 'e-pv-checkbox-span e-pv-cb-checked') {
                    checkTarget.firstElementChild.classList.remove('e-pv-cb-checked');
                    checkTarget.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-unchecked');
                    isChecked = false;
                } else if (checkTarget.className === 'e-pv-checkbox-span e-pv-cb-checked') {
                    checkTarget.classList.remove('e-pv-cb-checked');
                    checkTarget.classList.add('e-pv-checkbox-span', 'e-pv-cb-unchecked');
                    isChecked = false;
                } else {
                    checkTarget.firstElementChild.classList.remove('e-pv-cb-unchecked');
                    checkTarget.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-checked');
                    isChecked = true;
                }
                const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                if (isChecked) {
                    if (checkTarget.firstElementChild.className.indexOf('e-pv-cb-checked') !== -1) {
                        const checkboxWidth: number = parseInt((event.target as any).parentElement.style.width, 10);
                        if (checkboxWidth > minCheckboxWidth) {
                            (checkTarget.firstElementChild as any).style.borderWidth = '3px';
                        } else if (checkboxWidth <= 15) {
                            (checkTarget.firstElementChild as any).style.borderWidth = '1px';
                        } else {
                            (checkTarget.firstElementChild as any).style.borderWidth = '2px';
                        }
                    }
                }
                const formFieldsData: any = JSON.parse(data);
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.target as Element).id.split('_')[0] ||
                        (this.pdfViewer.nameTable as any)[(event.target as Element).id.split('_')[0]].name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                        (this.pdfViewer.nameTable as any)[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]].isChecked = isChecked;
                        const oldValue: any = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.isChecked;
                        formFieldsData[parseInt(i.toString(), 10)].FormField.isChecked = isChecked;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.isChecked =
                         formFieldsData[parseInt(i.toString(), 10)].FormField.isChecked;
                        if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.target as Element).id.split('_')[0]) {
                            const checkboxElement: Element = document.getElementById(formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_input').firstElementChild;
                            if (isChecked) {
                                if (checkboxElement.classList.contains('e-pv-cb-unchecked'))
                                {checkboxElement.classList.remove('e-pv-cb-unchecked'); }
                                checkboxElement.classList.add('e-pv-cb-checked');
                            } else {
                                if (checkboxElement.classList.contains('e-pv-cb-checked'))
                                {checkboxElement.classList.remove('e-pv-cb-checked'); }
                                checkboxElement.classList.add('e-pv-cb-unchecked');
                            }
                        }
                        this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField);
                        targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: any): any { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                        this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                          false, false, false, false, false, false, false, false,
                                                                          false, false, false, false, oldValue, isChecked);
                        if (this.pdfViewer.annotation) {
                            this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, 'FormField Value Change', '', oldValue, isChecked);
                        }
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                this.updateFormFieldSessions(targetField);
            }
        }
    }

    private setCheckedValue(element: Element, isChecked?: boolean): void {
        if (isChecked) {
            element.firstElementChild.classList.remove('e-pv-cb-unchecked');
            element.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-checked');
        } else {
            element.firstElementChild.classList.remove('e-pv-cb-checked');
            element.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-unchecked');
        }
    }

    private setRadioButtonState(event: Event): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        let targetField: any = null;
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem != null) {
                let oldValue: any;
                let undoElement: any;
                let redoElement: any;
                for (let j: number = 0; j < formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem.length; j++) {
                    if (formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem[parseInt(j.toString(), 10)].id.split('_')[0] === (event.currentTarget as Element).id.split('_')[0]) {
                        if (!(this.pdfViewer.nameTable as any)[(event.currentTarget as Element).id.split('_')[0]].isReadonly) {
                            (this.pdfViewer.nameTable as any)[(event.currentTarget as Element).id.split('_')[0]].isSelected = true;
                            formFieldsData[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)].isSelected = true;
                            oldValue = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                FormField.radiobuttonItem[parseInt(j.toString(), 10)].isSelected;
                            if (!oldValue)
                            {undoElement = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                FormField.radiobuttonItem[parseInt(j.toString(), 10)]; }
                            this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)].isSelected = true;
                            this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                              false, false, false, false, false, false, false, false,
                                                                              false, false, false, false, false, true);
                        }
                    } else {
                        if ((this.pdfViewer.nameTable as any)[(event.currentTarget as Element).id.split('_')[0]].name === formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem[parseInt(j.toString(), 10)].name) {
                            (this.pdfViewer.nameTable as any)[formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem[parseInt(j.toString(), 10)].id.split('_')[0]].isSelected = false;
                            let oldValue: any = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)].isSelected;
                            formFieldsData[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)].isSelected = false;
                            oldValue = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                FormField.radiobuttonItem[parseInt(j.toString(), 10)].isSelected;
                            if (oldValue)
                            {redoElement = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                                FormField.radiobuttonItem[parseInt(j.toString(), 10)]; }
                            this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)].isSelected =
                             formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem[parseInt(j.toString(), 10)].isSelected;
                            this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                              false, false, false, false, false, false, false, false,
                                                                              false, false, false, false, true, false);
                        }
                    }
                    this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].
                        FormField.radiobuttonItem[parseInt(j.toString(), 10)]);
                    targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: any): any { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                }
                if ((undoElement != null || redoElement != null) && this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, 'FormField Value Change', '', undoElement, redoElement);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        this.updateFormFieldSessions(targetField);
    }

    private getTextboxValue(event: Event): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        let targetField: any = null;
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.target as Element).id.split('_')[0] ||
                (this.pdfViewer.nameTable as any)[(event.target as Element).id.split('_')[0]].name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                const oldValue: any = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value;
                formFieldsData[parseInt(i.toString(), 10)].FormField.value = (event.target as IElement).value;
                if (this.pdfViewer.enableHtmlSanitizer){
                    formFieldsData[parseInt(i.toString(), 10)].FormField.value =
                     SanitizeHtmlHelper.sanitize(formFieldsData[parseInt(i.toString(), 10)].FormField.value);
                }
                (this.pdfViewer.nameTable as any)[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]].value = formFieldsData[parseInt(i.toString(), 10)].FormField.value;
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value =
                 formFieldsData[parseInt(i.toString(), 10)].FormField.value;
                if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.target as Element).id.split('_')[0]) {
                    const element: Element = document.getElementById(formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_content_html_element');
                    if (element && element.firstElementChild && element.firstElementChild.firstElementChild) {
                        const inputElement: Element = element.firstElementChild.firstElementChild;
                        (inputElement as IElement).value = formFieldsData[parseInt(i.toString(), 10)].FormField.value;
                    }
                }
                this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField);
                targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: any): any { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                  false, false, false, false, false, false, false, false,
                                                                  false, false, false, false, oldValue, (event.target as IElement).value);
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, 'FormField Value Change', '', oldValue, (event.target as IElement).value);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        this.updateFormFieldSessions(targetField);
    }

    private inputElementClick(event: any): void {
        event.target.focus();
    }

    private updateFormFieldSessions(field: any): void {
        const fieldData: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        const formFieldsDatas: any = JSON.parse(fieldData);
        if (!isNullOrUndefined(formFieldsDatas) && !isNullOrUndefined(field)) {
            for (let x: number = 0; x < formFieldsDatas.length; x++) {
                if (formFieldsDatas[parseInt(x.toString(), 10)].ActualFieldName === field.name) {
                    if (field.type === 'Textbox' || field.type === 'PasswordField') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Value = field.value;
                    }
                    else if (field.type === 'Checkbox') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Selected = field.isChecked;
                    }
                    else if (field.type === 'RadioButton') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Selected = field.isSelected;
                    }
                    else if (field.type === 'DropdownList') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Value = field.value;
                    }
                    else if (field.type === 'ListBox') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Value = field.value;
                    }
                }
            }
            this.pdfViewerBase.setItemInSessionStorage(formFieldsDatas, '_formfields');
        }
    }

    public focusFormFields(event: any): void {
        const currentTarget: any = event.target;
        if (currentTarget || currentTarget.className === 'e-pv-checkbox-outer-div') {
            const colorBorder: any = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.style.boxShadow = '0 0 5px ' + colorBorder;
        }
        if (currentTarget && (currentTarget.className === 'e-pv-radiobtn-container' || currentTarget.className === 'e-pv-radio-btn' || currentTarget.className === 'e-pv-radiobtn-span') && currentTarget.style.borderColor === 'transparent') {
            const colorBorder: any = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0px 0px 5px ' + colorBorder;
        }
        if (currentTarget && (currentTarget.className === 'e-pv-radiobtn-container' || currentTarget.className === 'e-pv-radio-btn' || currentTarget.className === 'e-pv-radiobtn-span')) {
            currentTarget.parentElement.style.boxShadow = currentTarget.style.borderColor + '0px 0px 5px ' + currentTarget.style.borderWidth;
        }
    }

    public blurFormFields(event: any): void {
        const currentTarget: any = event.target;
        currentTarget.style.boxShadow = '';
        if (currentTarget.type === 'radio' && currentTarget.style.borderColor === 'transparent') {
            const colorBorder: any = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0px 0px 0px ' + colorBorder;
        }
        if (currentTarget.type === 'radio') {
            currentTarget.parentElement.style.boxShadow = currentTarget.style.borderColor + '0px 0px 0px ' + currentTarget.style.borderWidth;
        }
    }

    private setTextBoxFontStyle(fontStyle: FontStyle): any {
        return { isBold: (fontStyle & FontStyle.Bold) === FontStyle.Bold,
            isItalic: (fontStyle & FontStyle.Italic) === FontStyle.Italic,
            isStrikeout: (fontStyle & FontStyle.Strikethrough) === FontStyle.Strikethrough,
            isUnderline: (fontStyle & FontStyle.Underline) === FontStyle.Underline };
    }

    /**
     * Adds form field to the PDF page.
     *
     * @param {FormFieldType} formFieldType - It describes about the form field type
     * @param {TextFieldSettings} options - It describes about the options
     * @param {boolean} isCollection - It describes about the isCollection
     * @param {string} id - It describes about the id
     * @returns {HTMLElement} - html element
     */
    public addFormField(formFieldType: FormFieldType,
                        options?: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings |
                        DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings |
                        SignatureFieldSettings | InitialFieldSettings, isCollection?: boolean, id?: string): HTMLElement {
        const HTMLElement: any = this.addField(formFieldType, options, isCollection, id, true);
        return HTMLElement;
    }

    /**
     * Adds form field to the PDF page.
     *
     * @param {FormFieldType} formFieldType - It describes about the form field type
     * @param {TextFieldSettings} options - It describes about the options
     * @param {boolean} isCollection - It describes about the isCollection
     * @param {string} id - It describes about the id
     * @param {boolean} isAddedProgrammatically - It describes about the isAddedProgrammatically
     * @private
     * @returns {HTMLElement} - html element
     */
    public addField(formFieldType: FormFieldType,
                    options?: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings |
                    DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings |
                    SignatureFieldSettings | InitialFieldSettings, isCollection?: boolean, id?: string,
                    isAddedProgrammatically?: boolean): HTMLElement {
        const obj: PdfFormFieldBaseModel = {
            thickness: 1, bounds: { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height },
            fontFamily: !isNullOrUndefined((options as TextFieldSettings).fontFamily) ? (options as TextFieldSettings).fontFamily : 'Helvetica', fontSize: !isNullOrUndefined((options as TextFieldSettings).fontSize) ? (options as TextFieldSettings).fontSize : 10,
            color: !isNullOrUndefined((options as TextFieldSettings).color) ? (options as TextFieldSettings).color : 'black', backgroundColor: !isNullOrUndefined((options as TextFieldSettings).backgroundColor) ? (options as TextFieldSettings).backgroundColor : '#daeaf7ff',
            alignment: !isNullOrUndefined((options as TextFieldSettings).alignment) ? (options as TextFieldSettings).alignment : 'left', isReadonly: options.isReadOnly ? options.isReadOnly : false, rotateAngle: (options as PdfFormFieldBaseModel).rotateAngle ? (options as PdfFormFieldBaseModel).rotateAngle : (options as any).rotationAngle, isTransparent: (options as PdfFormFieldBaseModel).isTransparent, insertSpaces: (options as PdfFormFieldBaseModel).insertSpaces, isChecked: (options as PdfFormFieldBaseModel).isChecked, isMultiline: (options as PdfFormFieldBaseModel).isMultiline, isSelected: (options as PdfFormFieldBaseModel).isSelected, options: (options as PdfFormFieldBaseModel).options, selectedIndex: (options as PdfFormFieldBaseModel).selectedIndex, signatureIndicatorSettings: (options as PdfFormFieldBaseModel).signatureIndicatorSettings, signatureType: (options as PdfFormFieldBaseModel).signatureType, zIndex: (options as PdfFormFieldBaseModel).zIndex
        };
        (obj as any).customData = !isNullOrUndefined((options as TextFieldSettings).customData) ? (options as TextFieldSettings).customData : '';
        (obj as any).fontStyle = !isNullOrUndefined((options as TextFieldSettings).fontStyle) ? (options as TextFieldSettings).fontStyle : 'None';
        obj.visibility = !isNullOrUndefined(options.visibility) ? options.visibility : 'visible';
        obj.value = !isNullOrUndefined((options as TextFieldSettings).value) ? (options as TextFieldSettings).value : '';
        obj.isRequired = options.isRequired ? options.isRequired : false;
        obj.isPrint = options.isPrint ? options.isPrint : true;
        obj.pageNumber = !isNullOrUndefined(options.pageNumber) ? options.pageNumber : this.pdfViewerBase.currentPageNumber;
        obj.pageIndex = obj.pageNumber - 1;
        obj.font = (options as any).font;
        obj.id = id;
        if (isCollection || isNullOrUndefined(isCollection)) {
            this.setFormFieldIndex();
        }
        switch (formFieldType) {
        case 'Textbox':
            obj.formFieldAnnotationType = formFieldType;
            obj.isMultiline = (options as TextFieldSettings).isMultiline;
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Textbox' + this.formFieldIndex;
            obj.insertSpaces = (options as any).insertSpaces;
            obj.maxLength = (options as any).maxLength;
            obj.thickness = !isNullOrUndefined((options as TextFieldSettings).thickness) ? (options as TextFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as TextFieldSettings).borderColor) ? (options as TextFieldSettings).borderColor : '#303030';
            if ((options as any).font) {
                obj.font = (options as any).font;
            }
            else if (this.pdfViewer.textFieldSettings.fontStyle) {
                obj.font = this.setTextBoxFontStyle(this.pdfViewer.textFieldSettings.fontStyle);
            }
            break;
        case 'Password':
            obj.formFieldAnnotationType = 'PasswordField';
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Password' + this.formFieldIndex;
            obj.maxLength = (options as any).maxLength;
            obj.thickness = !isNullOrUndefined((options as PasswordFieldSettings).thickness) ?
                (options as PasswordFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as PasswordFieldSettings).borderColor) ? (options as PasswordFieldSettings).borderColor : '#303030';
            break;
        case 'DropDown':
            obj.formFieldAnnotationType = 'DropdownList';
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Dropdown' + this.formFieldIndex;
            obj.options = (options as DropdownFieldSettings).options ? (options as DropdownFieldSettings).options : [];
            for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                const formField: PdfFormFieldBaseModel =
                        this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
                if (formField.formFieldAnnotationType === 'DropdownList' && formField.name === obj.name) {
                    obj.options = formField.options;
                    break;
                }
            }
            obj.selectedIndex = !isNullOrUndefined((options as any).selectedIndex) ? (options as any).selectedIndex : [0];
            obj.thickness = !isNullOrUndefined((options as DropdownFieldSettings).thickness) ?
                (options as DropdownFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as DropdownFieldSettings).borderColor) ? (options as DropdownFieldSettings).borderColor : '#303030';
            if ((options as any).font) {
                obj.font = (options as any).font;
            }
            else if (this.pdfViewer.DropdownFieldSettings.fontStyle) {
                obj.font = this.setTextBoxFontStyle(this.pdfViewer.DropdownFieldSettings.fontStyle);
            }
            break;
        case 'ListBox':
            obj.formFieldAnnotationType = formFieldType;
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'List Box' + this.formFieldIndex;
            obj.options = (options as ListBoxFieldSettings).options ? (options as DropdownFieldSettings).options : [];
            for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                const formField: PdfFormFieldBaseModel =
                        this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
                if (formField.formFieldAnnotationType === formFieldType && formField.name === obj.name) {
                    obj.options = formField.options;
                    break;
                }
            }
            obj.selectedIndex = (options as any).selectedIndex;
            obj.thickness = !isNullOrUndefined((options as ListBoxFieldSettings).thickness) ?
                (options as ListBoxFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as ListBoxFieldSettings).borderColor) ? (options as ListBoxFieldSettings).borderColor : '#303030';
            if ((options as any).font) {
                obj.font = (options as any).font;
            }
            else if (this.pdfViewer.listBoxFieldSettings.fontStyle) {
                obj.font = this.setTextBoxFontStyle(this.pdfViewer.listBoxFieldSettings.fontStyle);
            }
            break;
        case 'CheckBox':
            obj.formFieldAnnotationType = 'Checkbox';
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            obj.backgroundColor = !isNullOrUndefined((options as CheckBoxFieldSettings).backgroundColor) ? (options as CheckBoxFieldSettings).backgroundColor : '#daeaf7ff';
            obj.isReadonly = options.isReadOnly ? options.isReadOnly : false;
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Check Box' + this.formFieldIndex;
            obj.isChecked = (options as CheckBoxFieldSettings).isChecked ? (options as CheckBoxFieldSettings).isChecked : false;
            obj.visibility = options.visibility ? options.visibility : 'visible';
            obj.isRequired = options.isRequired ? options.isRequired : false;
            obj.thickness = !isNullOrUndefined((options as CheckBoxFieldSettings).thickness) ?
                (options as CheckBoxFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as CheckBoxFieldSettings).borderColor) ? (options as CheckBoxFieldSettings).borderColor : '#303030';
            break;
        case 'RadioButton':
            obj.formFieldAnnotationType = formFieldType;
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            obj.backgroundColor = !isNullOrUndefined((options as RadioButtonFieldSettings).backgroundColor) ? (options as RadioButtonFieldSettings).backgroundColor : '#daeaf7ff';
            obj.isReadonly = options.isReadOnly ? options.isReadOnly : false;
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Radio Button' + this.formFieldIndex;
            obj.isSelected = (options as RadioButtonFieldSettings).isSelected ? (options as RadioButtonFieldSettings).isSelected : false;
            obj.visibility = options.visibility ? options.visibility : 'visible';
            obj.isRequired = options.isRequired ? options.isRequired : false;
            obj.thickness = !isNullOrUndefined((options as RadioButtonFieldSettings).thickness) ?
                (options as RadioButtonFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as RadioButtonFieldSettings).borderColor) ? (options as RadioButtonFieldSettings).borderColor : '#303030';
            break;
        case 'SignatureField': {
            obj.formFieldAnnotationType = formFieldType;
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            obj.isReadonly = this.pdfViewer.signatureFieldSettings.isReadOnly ? this.pdfViewer.signatureFieldSettings.isReadOnly :
                (options.isReadOnly ? options.isReadOnly : false);
            obj.backgroundColor = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).backgroundColor) ?
                PdfViewerUtils.setTransparencyToHex(this.colorNametoHashValue(
                    (options as unknown as SignatureIndicatorSettings).backgroundColor)) : obj.isReadonly ? 'trasnparent' : '#daeaf7ff';
            obj.borderColor = !isNullOrUndefined((options as TextFieldSettings).borderColor) ?
                (options as TextFieldSettings).borderColor : '#303030';
            obj.fontSize = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).fontSize) ?
                (options as unknown as SignatureIndicatorSettings).fontSize : 10;
            (obj as any).fontStyle = !isNullOrUndefined((options as TextFieldSettings).fontStyle) ? (options as TextFieldSettings).fontStyle : 'None';
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Signature' + this.formFieldIndex;
            obj.isRequired = options.isRequired ? options.isRequired : false;
            obj.thickness = !isNullOrUndefined((options as any).thickness) ? (options as any).thickness : 1;
            const indicatorSettings: any = (options as SignatureFieldSettings).signatureIndicatorSettings ?
                (options as SignatureFieldSettings).signatureIndicatorSettings :
                (options as InitialFieldSettings).initialIndicatorSettings;
            obj.signatureIndicatorSettings = indicatorSettings ? {opacity: indicatorSettings.opacity ? indicatorSettings.opacity : 1 ,
                backgroundColor: indicatorSettings.backgroundColor ? indicatorSettings.backgroundColor : 'orange',
                width: indicatorSettings.width ? indicatorSettings.width : 19,
                height: indicatorSettings.height ? indicatorSettings.height : 10, fontSize: indicatorSettings.fontSize ?
                    indicatorSettings.fontSize : 10,
                text: indicatorSettings.text ? indicatorSettings.text : null, color: indicatorSettings.color ? indicatorSettings.color : 'black'
            } : null;
            break;
        }
        case 'InitialField': {
            obj.formFieldAnnotationType = formFieldType;
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            (obj as any).isReadonly = this.pdfViewer.initialFieldSettings.isReadOnly ?
                this.pdfViewer.initialFieldSettings.isReadOnly : (options.isReadOnly ? options.isReadOnly : false);
            obj.backgroundColor = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).backgroundColor) ?
                PdfViewerUtils.setTransparencyToHex(this.colorNametoHashValue(
                    (options as unknown as SignatureIndicatorSettings).backgroundColor)) : (obj as any).isReadonly ? 'trasnparent' :
                    '#daeaf7ff';
            obj.borderColor = !isNullOrUndefined((options as TextFieldSettings).borderColor) ?
                (options as TextFieldSettings).borderColor : '#303030';
            obj.fontSize = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).fontSize) ?
                (options as unknown as SignatureIndicatorSettings).fontSize : 10;
            obj.thickness = !isNullOrUndefined((options as any).thickness) ? (options as any).thickness : 1;
            (obj as any).fontStyle = !isNullOrUndefined((options as TextFieldSettings).fontStyle) ? (options as TextFieldSettings).fontStyle : 'None';
            (obj as any).name = !isNullOrUndefined(options.name) ? options.name : 'Initial' + this.formFieldIndex;
            (obj as any).isRequired = options.isRequired ? options.isRequired : false;
            (obj as any).isInitialField = true;
            const indicatorSettingsInitial: any = (options as InitialFieldSettings).initialIndicatorSettings ?
                (options as InitialFieldSettings).initialIndicatorSettings :
                (options as SignatureFieldSettings).signatureIndicatorSettings;
            obj.signatureIndicatorSettings = indicatorSettingsInitial ? {
                opacity: indicatorSettingsInitial.opacity ?
                    indicatorSettingsInitial.opacity : 1,
                backgroundColor: indicatorSettingsInitial.backgroundColor ? indicatorSettingsInitial.backgroundColor : 'orange',
                width: indicatorSettingsInitial.width ? indicatorSettingsInitial.width : 19,
                height: indicatorSettingsInitial.height ? indicatorSettingsInitial.height : 10,
                fontSize: indicatorSettingsInitial.fontSize ? indicatorSettingsInitial.fontSize : 10,
                text: indicatorSettingsInitial.text ? indicatorSettingsInitial.text : null, color: indicatorSettingsInitial.color ? indicatorSettingsInitial.color : 'black' } : null;
            break;
        }
        }
        obj.tooltip = !isNullOrUndefined(options.tooltip) ? options.tooltip : '';
        this.setFormFieldIndex();
        let HTMLElement: any = null;
        if (isCollection) {
            this.addFieldCollection(obj);
        } else {
            HTMLElement = this.drawFormField(obj, isAddedProgrammatically);
        }
        return HTMLElement;
    }

    public addFieldCollection(node: any): void {
        const formField: FormFieldModel = {
            id: randomId(), name: (node as PdfFormFieldBaseModel).name, value: (node as PdfFormFieldBaseModel).value,
            type: node.formFieldAnnotationType as FormFieldType, isReadOnly: node.isReadonly, fontFamily: node.fontFamily,
            fontSize: node.fontSize, fontStyle: node.fontStyle as unknown as FontStyle, color: (node as PdfFormFieldBaseModel).color,
            backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, isMultiline: (node as PdfFormFieldBaseModel).isMultiline,
            alignment: (node as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (node as PdfFormFieldBaseModel).visibility,
            maxLength: (node as PdfFormFieldBaseModel).maxLength, isRequired: (node as PdfFormFieldBaseModel).isRequired,
            isPrint: node.isPrint, isSelected: (node as PdfFormFieldBaseModel).isSelected,
            insertSpaces: (node as PdfFormFieldBaseModel).insertSpaces, isChecked: (node as PdfFormFieldBaseModel).isChecked,
            tooltip: (node as PdfFormFieldBaseModel).tooltip, bounds: node.bounds as IFormFieldBound, thickness: node.thickness,
            pageIndex: node.pageIndex, borderColor: (node as PdfFormFieldBaseModel).borderColor,
            signatureIndicatorSettings: (node as PdfFormFieldBaseModel).signatureIndicatorSettings,
            rotateAngle: (node as PdfFormFieldBaseModel).rotateAngle, isTransparent: (node as PdfFormFieldBaseModel).isTransparent,
            options : (node as PdfFormFieldBaseModel).options, selectedIndex : (node as PdfFormFieldBaseModel).selectedIndex,
            signatureType : (node as any).signatureType, zIndex : (node as PdfFormFieldBaseModel).zIndex,
            pageNumber : node.pageNumber, customData: (node as PdfFormFieldBaseModel).customData
        };
        this.pdfViewer.formFieldCollections.push(formField);
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the pdf formfield base model
     * @param {boolean} isAddedProgrammatically - It describes about the isAddedProgrammatically
     * @param {boolean} action - It describes about the action
     * @private
     * @returns {void}
     */
    public drawFormField(obj: PdfFormFieldBaseModel, isAddedProgrammatically?: boolean, action?: string): HTMLElement {
        const node: PdfAnnotationBaseModel = this.pdfViewer.add(obj as PdfAnnotationBase);
        const index: number = this.pdfViewer.formFieldCollections.findIndex(function (el: any): boolean { return el.id === node.id; });
        let data: any;
        if (index > -1) {
            data = this.pdfViewer.formFieldCollections[parseInt(index.toString(), 10)];
            if (this.isFormFieldUpdated) {
                this.updateNodeBasedOnCollections(node, data);
            }
        }
        const formFieldIndex: number =
        this.pdfViewer.formFieldCollection.findIndex(function (el: any): boolean { return el.id === node.id; });
        if (formFieldIndex < 0) {
            this.pdfViewer.formFieldCollection.push(node);
        } else if (formFieldIndex > -1) {
            this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)] = node;
        }
        const formField: FormFieldModel = {
            id: node.id, name: (node as PdfFormFieldBaseModel).name, value: (node as PdfFormFieldBaseModel).value,
            type: node.formFieldAnnotationType as FormFieldType, isReadOnly: node.isReadonly, fontFamily: node.fontFamily,
            fontSize: node.fontSize, fontStyle: node.fontStyle as unknown as FontStyle, color: (node as PdfFormFieldBaseModel).color,
            backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, isMultiline: (node as PdfFormFieldBaseModel).isMultiline,
            alignment: (node as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (node as PdfFormFieldBaseModel).visibility,
            maxLength: (node as PdfFormFieldBaseModel).maxLength, isRequired: (node as PdfFormFieldBaseModel).isRequired,
            isPrint: node.isPrint, isSelected: (node as PdfFormFieldBaseModel).isSelected,
            isChecked: (node as PdfFormFieldBaseModel).isChecked, tooltip: (node as PdfFormFieldBaseModel).tooltip,
            bounds: node.bounds as IFormFieldBound, pageIndex: node.pageIndex, thickness: node.thickness,
            borderColor: (node as PdfFormFieldBaseModel).borderColor,
            signatureIndicatorSettings: (node as PdfFormFieldBaseModel).signatureIndicatorSettings,
            insertSpaces: (node as PdfFormFieldBaseModel).insertSpaces, rotateAngle: (node as PdfFormFieldBaseModel).rotateAngle,
            isTransparent: (node as PdfFormFieldBaseModel).isTransparent, options: (node as PdfFormFieldBaseModel).options,
            selectedIndex: (node as PdfFormFieldBaseModel).selectedIndex, signatureType: (node as any).signatureType,
            zIndex: (node as PdfFormFieldBaseModel).zIndex, pageNumber: (node as PdfFormFieldBaseModel).pageNumber,
            customData: (node as PdfFormFieldBaseModel).customData
        };
        if (index > -1) {
            this.pdfViewer.formFieldCollections[parseInt(index.toString(), 10)] = formField;
        } else {
            this.pdfViewer.formFieldCollections.push(formField);
        }
        const HTMLElement: HTMLElement = this.drawHTMLContent(node.formFieldAnnotationType, node.wrapper.children[0] as DiagramHtmlElement,
                                                              node, obj.pageNumber - 1, this.pdfViewer, null, isAddedProgrammatically,
                                                              action);
        return HTMLElement;
    }

    /**
     * Update the node value based on the collections
     *
     * @param {PdfFormFieldBaseModel} node - It describes about the node
     * @param {any} data - It describes about the data
     * @returns {void}
     */
    private updateNodeBasedOnCollections(node: PdfFormFieldBaseModel, data: any): void {
        (node as PdfFormFieldBaseModel).name = data.name;
        (node as PdfFormFieldBaseModel).value = data.value;
        (node as PdfFormFieldBaseModel).isReadonly = data.isReadOnly;
        (node as PdfFormFieldBaseModel).fontFamily = data.fontFamily;
        (node as PdfFormFieldBaseModel).fontSize = data.fontSize;
        (node as PdfFormFieldBaseModel).fontStyle = data.fontStyle.toString();
        (node as PdfFormFieldBaseModel).color = data.color;
        (node as PdfFormFieldBaseModel).backgroundColor = data.backgroundColor;
        (node as PdfFormFieldBaseModel).alignment = data.alignment;
        (node as PdfFormFieldBaseModel).visibility = data.visibility;
        (node as PdfFormFieldBaseModel).maxLength = data.maxLength;
        (node as PdfFormFieldBaseModel).isRequired = data.isRequired;
        (node as PdfFormFieldBaseModel).isPrint = data.isPrint;
        (node as PdfFormFieldBaseModel).isSelected = data.isSelected;
        (node as PdfFormFieldBaseModel).isChecked = data.isChecked;
        (node as PdfFormFieldBaseModel).tooltip = data.tooltip;
        (node as PdfFormFieldBaseModel).thickness = data.thickness;
        (node as PdfFormFieldBaseModel).borderColor = data.borderColor;
        (node as PdfFormFieldBaseModel).customData = data.customData;
    }

    /**
     * Set the form field mode to add the form field on user interaction.
     *
     * @param {FormFieldType} formFieldType - It describes about the form field Id
     * @param {Item} options - It describes about the options
     * @returns {void}
     */
    public setFormFieldMode(formFieldType: FormFieldType,
                            options?: Item[]): void {
        if (this.pdfViewer.selectedItems && !isNullOrUndefined((this.pdfViewer.selectedItems as any).annotations) &&
         (this.pdfViewer.selectedItems as any).annotations.length > 0 && this.pdfViewerBase.activeElements &&
          !isNullOrUndefined(this.pdfViewerBase.activeElements.activePageID)) {
            this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
        }
        const formFieldElement: HTMLElement = document.getElementById('FormField_helper_html_element');
        if (this.pdfViewer.isFormDesignerToolbarVisible && formFieldElement) {
            formFieldElement.remove();
        }
        this.isAddFormFieldUi = true;
        switch (formFieldType) {
        case 'Textbox':
            this.activateTextboxElement(formFieldType);
            this.isSetFormFieldMode = true;
            break;
        case 'Password': {
            const passwordType: FormFieldAnnotationType = 'PasswordField';
            this.activatePasswordField(passwordType);
            this.isSetFormFieldMode = true;
            break;
        }
        case 'CheckBox': {
            const checkboxType: FormFieldAnnotationType = 'Checkbox';
            this.activateCheckboxElement(checkboxType);
            this.isSetFormFieldMode = true;
            break;
        }
        case 'RadioButton':
            this.activateRadioButtonElement(formFieldType);
            this.isSetFormFieldMode = true;
            break;
        case 'DropDown': {
            const dropdownType: FormFieldAnnotationType = 'DropdownList';
            this.activateDropDownListElement(dropdownType, options);
            this.isSetFormFieldMode = true;
            break;
        }
        case 'ListBox':
            this.activateListboxElement(formFieldType, options);
            this.isSetFormFieldMode = true;
            break;
        case 'SignatureField':
        case 'InitialField':
            this.activateSignatureBoxElement(formFieldType);
            this.isSetFormFieldMode = true;
        }
    }

    /**
     * Reset the form fields into its original state.
     *
     * @param {string} formFieldId - It describes about the form field id
     * @returns {void}
     */
    public resetFormField(formFieldId: string | object): void {
        const formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        if (formField) {
            switch (formField.formFieldAnnotationType) {
            case 'Textbox':
                this.resetTextboxProperties(formField);
                break;
            case 'PasswordField':
                this.resetPasswordProperties(formField);
                break;
            case 'Checkbox':
                this.resetCheckboxProperties(formField);
                break;
            case 'RadioButton':
                this.resetRadioButtonProperties(formField);
                break;
            case 'DropdownList':
                this.resetDropdownListProperties(formField);
                break;
            case 'ListBox':
                this.resetListBoxProperties(formField);
                break;
            case 'SignatureField':
            case 'InitialField':
                this.resetSignatureTextboxProperties(formField);
                break;
            }
            this.updateSessionFormFieldProperties(formField);
        }
    }

    /**
     * Select the form field in the PDF Viewer.
     *
     * @param {string} formFieldId - It describes about the form field id
     * @returns {void}
     */
    public selectFormField(formFieldId: string | object): void {
        const formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        if (formField) {
            this.isProgrammaticSelection = true;
            this.pdfViewer.select([formField.id]);
            this.isProgrammaticSelection = false;
        }
    }

    /**
     * Update the form field with the given properties and value.
     *
     * @param {string} formFieldId - It describes about the form field Id
     * @param {TextFieldSettings} options - It describes about the options
     * @returns {void}
     */
    public updateFormField(formFieldId: string | object,
                           options: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings |
                           DropdownFieldSettings | RadioButtonFieldSettings | SignatureFieldSettings | InitialFieldSettings): void {
        const formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        this.isFormFieldUpdated = true;
        const selectedItem: any = this.pdfViewer.selectedItems.formFields[0];
        if (formField) {
            if (!formField.isReadonly || (!isNullOrUndefined(options.isReadOnly) && !options.isReadOnly)) {
                switch (formField.formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                case 'DropdownList':
                case 'ListBox':
                case 'SignatureField':
                case 'InitialField': {
                    let inputElement: Element = document.getElementById(formField.id + '_content_html_element');
                    if (inputElement) {
                        inputElement = inputElement.firstElementChild.firstElementChild;
                        this.isAddFormFieldProgrammatically = true;
                        this.formFieldPropertyChange(formField, options, inputElement as HTMLElement, selectedItem);
                    }
                    else {
                        this.updateFormFieldsInCollections(formFieldId, options);
                        this.updateDesignerSession(formFieldId, options);
                        this.rerenderFormFields((formFieldId as any).pageIndex);
                    }
                    break;
                }
                case 'RadioButton': {
                    let radioButtonDivDivElement: Element = document.getElementById(formField.id + '_content_html_element');
                    if (radioButtonDivDivElement) {
                        radioButtonDivDivElement = radioButtonDivDivElement.firstElementChild.firstElementChild.firstElementChild;
                        this.formFieldPropertyChange(formField, options, radioButtonDivDivElement as HTMLElement);
                    }
                    else {
                        this.updateFormFieldsInCollections(formFieldId, options);
                        this.updateDesignerSession(formFieldId, options);
                    }
                    break;
                }
                case 'Checkbox': {
                    let checkboxDivElement: Element = document.getElementById(formField.id + '_content_html_element');
                    if (checkboxDivElement) {
                        checkboxDivElement = checkboxDivElement.firstElementChild.firstElementChild.lastElementChild;
                        this.formFieldPropertyChange(formField, options, checkboxDivElement as HTMLElement);
                    }
                    else {
                        this.updateFormFieldsInCollections(formFieldId, options);
                        this.updateDesignerSession(formFieldId, options);
                    }
                    break;
                }
                }
            }
        }
        else {
            this.updateFormFieldsInCollections(formFieldId, options);
            this.updateFormFieldsInFieldsSession(formFieldId, options);
        }
    }

    /**
     * Update the form field in the form designer session.
     *
     * @param {any} formFieldId - It describes about the form field id
     * @param {any} options - It describes about the options
     * @returns {void}
     */
    private updateDesignerSession(formFieldId: any, options: any): void {
        const fieldId: any = (typeof formFieldId === 'object') ? formFieldId.id : formFieldId;
        const actualObject: any = (this.pdfViewer.nameTable as any)[`${fieldId}`];
        const bound: any = (actualObject as any).bounds;
        const wrapper: DiagramHtmlElement = actualObject.wrapper.children[0];
        const type : string = actualObject.formFieldAnnotationType;
        let isEdited: boolean = false;
        if (!isNullOrUndefined(options.customData) && (actualObject as any).customData !== options.customData) {
            (actualObject as any).customData = options.customData;
            isEdited = true;
        }
        if (!isNullOrUndefined(options.name) && (actualObject as any).name !== options.name) {
            (actualObject as any).name = options.name;
            isEdited = true;
        }
        if (!isNullOrUndefined(options.borderColor) && (actualObject as any).borderColor !== options.borderColor) {
            (actualObject as any).borderColor = options.borderColor;
            isEdited = true;
        }
        if (!isNullOrUndefined(options.backgroundColor) && (actualObject as any).backgroundColor !== options.backgroundColor) {
            (actualObject as any).backgroundColor = options.backgroundColor;
            isEdited = true;
        }
        if (!isNullOrUndefined(options.value) && (actualObject as any).value !== options.value) {
            (actualObject as any).value = options.value;
            isEdited = true;
        }
        if (!isNullOrUndefined(options.bounds) && actualObject.bounds.properties !== options.bounds) {
            const { X, Y, Width, Height } = options.bounds;
            const updatedBounds: any = { x: X, y: Y, width: Width, height: Height };
            if (
                actualObject.bounds.x !== updatedBounds.x ||
                actualObject.bounds.y !== updatedBounds.y ||
                actualObject.bounds.width !== updatedBounds.width ||
                actualObject.bounds.height !== updatedBounds.height
            ) {
                actualObject.bounds = updatedBounds;
            }
            updatedBounds.x = updatedBounds.x + updatedBounds.width * 0.5;
            updatedBounds.y = updatedBounds.y + updatedBounds.height * 0.5;
            options.bounds = updatedBounds;
            this.pdfViewer.drawing.nodePropertyChange(actualObject, options);
            isEdited = true;
        }
        if (isEdited) {
            this.pdfViewerBase.updateDocumentEditedProperty(isEdited);
        }
        this.updateFormDesignerFieldInSessionStorage(bound, wrapper, type, actualObject);
    }

    /**
     * Update the form field in the form field session.
     *
     * @param {any} formFieldId - It describes about the form field id
     * @param {any} options - It describes about the options
     * @returns {void}
     */
    private updateFormFieldsInFieldsSession(formFieldId: any, options: any): void {
        const fieldsData: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        let isEdited: boolean = false;
        if (!isNullOrUndefined(fieldsData)) {
            const data: any = JSON.parse(fieldsData);
            for (let x: number = 0; x < data.length; x++) {
                if (data[`${x}`].FieldName === formFieldId.name) {
                    if (!isNullOrUndefined(options.customData) && data[`${x}`].CustomData !== options.customData) {
                        data[`${x}`].CustomData = options.customData;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined(options.backgroundColor) && data[`${x}`].BackColor !== options.backgroundColor) {
                        data[`${x}`].BackColor = this.getRgbCode(options.backgroundColor);
                        isEdited = true;
                    }
                    if (!isNullOrUndefined(options.borderColor) && data[`${x}`].BorderColor !== options.borderColor) {
                        data[`${x}`].BorderColor = this.getRgbCode(options.borderColor);
                        isEdited = true;
                    }
                    if (!isNullOrUndefined(options.name) && data[`${x}`].Name !== options.name) {
                        data[`${x}`].Name = options.name;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined(options.value) && data[`${x}`].Value !== options.value) {
                        data[`${x}`].Value = options.value;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined(options.bounds)) {
                        const lineBounds: any = {
                            X: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data['' + x].LineBounds.X),
                            Y: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data['' + x].LineBounds.Y),
                            Width: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data['' + x].LineBounds.Width),
                            Height: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data['' + x].LineBounds.Height)
                        };
                        if (JSON.stringify(lineBounds) !== JSON.stringify(options.bounds)) {
                            const newLineBounds: any = {
                                X: PdfViewerUtils.convertPixelToPoint(options.bounds.X),
                                Y: PdfViewerUtils.convertPixelToPoint(options.bounds.Y),
                                Width: PdfViewerUtils.convertPixelToPoint(options.bounds.Width),
                                Height: PdfViewerUtils.convertPixelToPoint(options.bounds.Height)
                            };
                            data['' + x].LineBounds = newLineBounds;
                        }
                        isEdited = true;
                    }
                }
            }
            if (isEdited) {
                this.pdfViewerBase.updateDocumentEditedProperty(isEdited);
            }
            this.pdfViewerBase.setItemInSessionStorage(data, '_formfields');
        }
    }

    /**
     * Update the form field in the form field collections.
     *
     * @param {any} formFieldId - It describes about the form field id
     * @param {any} options - It describes about the options
     * @returns {void}
     */
    private updateFormFieldsInCollections(formFieldId: any, options: any): void {
        const formFieldCollection: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        for (let i: number = 0; i < formFieldCollection.length; i++) {
            const currentData: any = formFieldCollection[parseInt(i.toString(), 10)];
            const fieldId: any = (typeof formFieldId === 'object') ? formFieldId.id : formFieldId;
            if (currentData.id === fieldId) {
                this.updateFormFieldData(currentData, options);
                const formFieldIndex: number = this.pdfViewer.formFieldCollections.findIndex(function (el: any): boolean
                { return el.id === fieldId; });
                this.pdfViewer.formFieldCollections[parseInt(formFieldIndex.toString(), 10)] = currentData;
            }
        }
    }

    /**
     * Update the form field data based on the value
     *
     * @param {any} currentData - It describes about the current data
     * @param {any} options - It describes about the options
     * @returns {void}
     */
    private updateFormFieldData(currentData: any, options: any): void {
        if (options.name && currentData.name !== options.name) {
            currentData.name = options.name;
        }
        if (options.bounds) {
            const { X, Y, Width, Height } = options.bounds;
            const updatedBounds: any = { x: X, y: Y, width: Width, height: Height };
            if (
                currentData.bounds.x !== updatedBounds.x ||
                currentData.bounds.y !== updatedBounds.y ||
                currentData.bounds.width !== updatedBounds.width ||
                currentData.bounds.height !== updatedBounds.height
            ) {
                currentData.bounds = updatedBounds;
            }
        }
        if (currentData.type !== 'SignatureField' || currentData.type !== 'InitialField') {
            if (options.thickness && currentData.thickness !== options.thickness) {
                currentData.thickness = options.thickness;
            }
            if (options.borderColor) {
                const borderColor: string = this.colorNametoHashValue(options.borderColor);
                if (currentData.borderColor !== borderColor) {
                    currentData.borderColor = borderColor;
                }
            }
        }
        if (options.backgroundColor) {
            const backColor: string = this.colorNametoHashValue(options.backgroundColor);
            if (currentData.backgroundColor !== backColor) {
                currentData.backgroundColor = backColor;
                const id : string = currentData.id;
                if (!isNullOrUndefined((this.pdfViewer.nameTable as { [key: string]: { backgroundColor: string } })[`${id}`])) {
                    (this.pdfViewer.nameTable as { [key: string]: { backgroundColor: string } })[`${id}`].backgroundColor = backColor;
                }
            }
        }
        if (!isNullOrUndefined(options.customData) && currentData.customData !== options.customData) {
            currentData.customData = options.customData;
        }
        if (!isNullOrUndefined(options.isReadOnly) && currentData.isReadonly !== options.isReadOnly) {
            currentData.isReadOnly = options.isReadOnly;
        }
        if (!isNullOrUndefined(options.isRequired) && currentData.isRequired !== options.isRequired) {
            currentData.isRequired = options.isRequired;
        }
        if (!isNullOrUndefined(options.isPrint) && currentData.isPrint !== options.isPrint) {
            currentData.isPrint = options.isPrint;
        }
        if (options.visibility && currentData.visibility !== options.visibility) {
            currentData.visibility = options.visibility;
        }
        if (options.tooltip && currentData.tooltip !== options.tooltip) {
            currentData.tooltip = options.tooltip;
        }
        if (currentData.type === 'Checkbox' && (!isNullOrUndefined((options as any).isChecked) && currentData.isChecked === (options as any).isChecked)) {
            currentData.isChecked = (options as any).isChecked;
        }
        if (currentData.type === 'RadioButton' && (!isNullOrUndefined((options as any).isSelected) && currentData.isSelected === (options as any).isSelected)) {
            currentData.isSelected = (options as any).isSelected;
        }
        if ((currentData.type === 'DropdownList' || currentData.type === 'ListBox') && (options as any).options) {
            currentData.options = (options as any).options;
        }
        if (currentData.type === 'Textbox' || currentData.type === 'SignatureField' || currentData.type === 'InitialField' ||
            currentData.type === 'DropdownList' || currentData.type === 'ListBox' ||
            currentData.type === 'PasswordField') {
            if ((options as any).value && currentData.value !== (options as any).value) {
                currentData.value = (options as any).value;
            }
            if ((options as any).fontSize && currentData.fontSize !== (options as any).fontSize) {
                currentData.fontSize = (options as any).fontSize;
            }
            if ((options as any).color) {
                const color: string = this.colorNametoHashValue((options as any).color);
                if (currentData.color !== color) {
                    currentData.color = color;
                }
            }
            if (currentData.type !== 'SignatureField') {
                if ((options as any).alignment && currentData.alignment !== (options as any).alignment) {
                    currentData.alignment = (options as any).alignment;
                }
                if ((options as any).maxLength && currentData.maxLength !== (options as any).maxLength) {
                    currentData.maxLength = (options as any).maxLength;
                }
            }
            if (currentData.type !== 'PasswordField') {
                if ((options as any).fontFamily && currentData.fontFamily !== (options as any).fontFamily) {
                    currentData.fontFamily = (options as any).fontFamily;
                }
                if ((options as any).fontStyle && currentData.fontStyle !== (options as any).fontStyle) {
                    currentData.fontStyle = (options as any).fontStyle;
                }
            }
        }
    }

    private formFieldPropertyChange(formFieldObject: PdfFormFieldBaseModel,
                                    options: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings |
                                    DropdownFieldSettings | RadioButtonFieldSettings | SignatureFieldSettings |
                                    InitialFieldSettings, htmlElement: HTMLElement, selectedItem ?: any): void {
        let isValueChanged: boolean = false; let isFontFamilyChanged: boolean = false; let isFontSizeChanged: boolean = false;
        let isFontStyleChanged: boolean = false; let isColorChanged: boolean = false;
        let isBackgroundColorChanged: boolean = false; let isBorderColorChanged: boolean = false;
        let isBorderWidthChanged: boolean = false; let isAlignmentChanged: boolean = false;
        let isReadOnlyChanged: boolean = false;
        let isVisibilityChanged: boolean = false; let isMaxLengthChanged: boolean = false;
        let isRequiredChanged: boolean = false; let isPrintChanged: boolean = false; let isToolTipChanged: boolean = false;
        let isCustomDataChanged: boolean = false;
        let isNameChanged: boolean = false;
        let isBoundsChanged: boolean = false;
        let oldValue: any; let newValue: any;
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        if (options.name) {
            if (formFieldObject.name !== options.name) {
                isNameChanged = true;
            }
            formFieldObject.name = options.name;
            const designerName: HTMLElement = document.getElementById(formFieldObject.id + '_designer_name');
            designerName.innerHTML = formFieldObject.name;
            designerName.style.fontSize = formFieldObject.fontSize ? (formFieldObject.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
            (htmlElement as IElement).name = options.name;
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].name = formFieldObject.name;
            if (isNameChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue, isNameChanged);
            }
        }
        if (formFieldObject.formFieldAnnotationType) {
            if (!isNullOrUndefined(options.thickness)) {
                if (formFieldObject.thickness !== options.thickness) {
                    isBorderWidthChanged = true;
                    oldValue = formFieldObject.thickness;
                    newValue = options.thickness;
                }
                htmlElement.style.borderWidth = options.thickness.toString() + 'px';
                formFieldObject.thickness = options.thickness;
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].thickness = options.thickness;
                if (isBorderWidthChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                          false, false, false, false, isBorderWidthChanged, false, false,
                                                          false, false, false, false, false, false,  oldValue, newValue);
                }
            }
            if ((options as any).borderColor) {
                const borderColor: string = this.colorNametoHashValue((options as any).borderColor);
                if (formFieldObject.borderColor !== borderColor) {
                    isBorderColorChanged = true;
                    oldValue = formFieldObject.borderColor;
                    newValue = borderColor;
                }
                formFieldObject.borderColor = borderColor;
                htmlElement.style.borderColor = borderColor;
                if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                    (htmlElement as any).parentElement.style.boxShadow = borderColor + ' 0px 0px 0px ' + formFieldObject.thickness + 'px';
                    this.setToolTip(options.tooltip, (htmlElement as any).parentElement);
                }
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].borderColor = borderColor;
                if (isBorderColorChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                          false, false, false, isBorderColorChanged, false, false,
                                                          false, false, false, false, false, false, false, oldValue, newValue);
                }
            }
        }
        if ((options as any).backgroundColor) {
            let backColor: string = this.colorNametoHashValue((options as any).backgroundColor);
            backColor = formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType ===
                'InitialField' ? PdfViewerUtils.setTransparencyToHex(backColor) : PdfViewerUtils.removeAlphaValueFromHex(backColor);
            if (formFieldObject.backgroundColor !== backColor) {
                isBackgroundColorChanged = true;
                oldValue = formFieldObject.backgroundColor;
                newValue = backColor;
            }
            formFieldObject.backgroundColor = backColor;
            if (formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType === 'InitialField') {
                (htmlElement as any).parentElement.style.background = backColor;
            }
            else {
                htmlElement.style.background = backColor;
            }
            if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                (htmlElement as any).parentElement.style.background = formFieldObject.backgroundColor;
            }
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].backgroundColor = backColor;
            if (isBackgroundColorChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, isBackgroundColorChanged, false, false, false,
                                                      false, false, false, false, false, false, false, oldValue, newValue);
            }
        }
        if (options.bounds) {
            const formBounds: any = formFieldObject.bounds;
            const optionBounds: any = options.bounds;
            if (
                formBounds.x !== optionBounds.X ||
                formBounds.y !== optionBounds.Y ||
                formBounds.width !== optionBounds.Width ||
                formBounds.height !== optionBounds.Height
            ) {
                isBoundsChanged = true;
            }
            options.bounds.X = options.bounds.X + options.bounds.Width * 0.5;
            options.bounds.Y  = options.bounds.Y + options.bounds.Height * 0.5;
            formFieldObject.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width,
                height: options.bounds.Height };
            const formField: PdfFormFieldBaseModel = (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]];
            formField.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            formField.wrapper.bounds = new Rect(options.bounds.X, options.bounds.Y, options.bounds.Width, options.bounds.Height);
            this.pdfViewer.drawing.nodePropertyChange(formField, {
                bounds: {
                    x: formField.wrapper.bounds.x, y: formField.wrapper.bounds.y,
                    width: formField.wrapper.bounds.width, height: formField.wrapper.bounds.height
                }
            });
            const element: DrawingElement = formField.wrapper.children[0];
            const point: PointModel = cornersPointsBeforeRotation(formField.wrapper.children[0]).topLeft;
            const hEment: HTMLElement = document.getElementById(element.id + '_html_element');
            if (!isNullOrUndefined(hEment)) {
                hEment.style.cssText = `height: ${element.actualSize.height * zoomValue}px;
                width: ${element.actualSize.width * zoomValue}px;left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;
                position: absolute;transform: rotate(${element.rotateAngle + element.parentTransform}deg);
                pointer-events: ${this.pdfViewer.designerMode ? 'none' : 'all'};visibility: ${element.visible ? 'visible' : 'hidden'};
                opacity: ${element.style.opacity};`;
            }
            this.isFormFieldSizeUpdated = true;
            this.pdfViewer.select([formFieldObject.id]);
            if (formField.formFieldAnnotationType === 'RadioButton' || formField.formFieldAnnotationType === 'Checkbox') {
                this.updateHTMLElement(formFieldObject);
            }
        }
        if (!isNullOrUndefined(options.isRequired)) {
            if (formFieldObject.isRequired !== options.isRequired) {
                isRequiredChanged = true;
                oldValue = formFieldObject.isRequired;
                newValue = options.isRequired;
            }
            formFieldObject.isRequired = options.isRequired;
            this.setRequiredToElement(formFieldObject, htmlElement, options.isRequired);
            this.setRequiredToFormField(formFieldObject, options.isRequired);
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].isRequired = options.isRequired;
            if (isRequiredChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, isRequiredChanged, false, false, false, oldValue, newValue);
            }
        }
        if (options.visibility) {
            if (formFieldObject.visibility !== options.visibility) {
                isVisibilityChanged = true;
                oldValue = formFieldObject.visibility;
                newValue = options.visibility;
            }
            formFieldObject.visibility = options.visibility;
            htmlElement.style.visibility = options.visibility;
            if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                (htmlElement as any).parentElement.style.visibility = formFieldObject.visibility;
            }
            if (formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType === 'InitialField') {
                (htmlElement as any).parentElement.style.visibility = formFieldObject.visibility;
                const annotation: any = (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0] + '_content'];
                const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                const formFieldsData: any = JSON.parse(data);
                const index: number = this.getFormFiledIndex(formFieldObject.id.split('_')[0]);
                if (formFieldObject.visibility === 'hidden') {
                    if (annotation) {
                        this.hideSignatureValue(formFieldObject, annotation, index, formFieldsData);
                    }
                }
                else {
                    if (annotation) {
                        this.showSignatureValue(formFieldObject, oldValue, annotation, index, formFieldsData);
                    }
                }
            }
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].visibility = options.visibility;
            if (isVisibilityChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, false, isVisibilityChanged,
                                                      false, false, false, false, false, oldValue, newValue);
            }
        }
        if (!isNullOrUndefined(options.isPrint)) {
            if (formFieldObject.isPrint !== options.isPrint) {
                isPrintChanged = true;
                oldValue = formFieldObject.isPrint;
                newValue = options.isPrint;
            }
            formFieldObject.isPrint = options.isPrint;
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].isPrint = options.isPrint;
            if (isPrintChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, false, isPrintChanged, false, false, oldValue, newValue);
            }
        }
        if (!isNullOrUndefined(options.tooltip)) {
            if (formFieldObject.tooltip !== options.tooltip) {
                isToolTipChanged = true;
                oldValue = formFieldObject.tooltip;
                newValue = options.tooltip;
            }
            formFieldObject.tooltip = options.tooltip;
            if (!isNullOrUndefined(options.tooltip)) {
                if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                    this.setToolTip(options.tooltip, (htmlElement as any).parentElement);
                }
                else {
                    this.setToolTip(options.tooltip, htmlElement);
                }
            }
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].tooltip = options.tooltip;
            if (isToolTipChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, false, false, isToolTipChanged, false, oldValue, newValue);
            }
        }
        if (!isNullOrUndefined(options.customData)) {
            if (formFieldObject.customData !== options.customData) {
                isCustomDataChanged = true;
                oldValue = formFieldObject.customData;
                newValue = options.customData;
            }
            formFieldObject.customData = options.customData;
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].customData = options.customData;
            if (isCustomDataChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, isCustomDataChanged, oldValue, newValue);
            }
        }
        if ((formFieldObject.formFieldAnnotationType === 'Checkbox') && ((!isNullOrUndefined((options as CheckBoxFieldSettings).isChecked)) || (options as CheckBoxFieldSettings).isChecked || (options as CheckBoxFieldSettings).value)) {
            if (!isNullOrUndefined((options as CheckBoxFieldSettings).isChecked) && formFieldObject.isChecked !==
            this.checkboxCheckedState) {
                isValueChanged = true;
                oldValue = formFieldObject.isChecked;
                newValue = (options as CheckBoxFieldSettings).isChecked;
            }
            formFieldObject.isChecked = (options as CheckBoxFieldSettings).isChecked;
            (htmlElement as IElement).checked = (options as CheckBoxFieldSettings).isChecked;
            this.setCheckedValue(htmlElement, (options as CheckBoxFieldSettings).isChecked);
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].isChecked = (options as CheckBoxFieldSettings).isChecked;
            if ((options as CheckBoxFieldSettings).value || (options as CheckBoxFieldSettings).isChecked) {
                if (formFieldObject.value !== (options as CheckBoxFieldSettings).value) {
                    isValueChanged = true;
                    oldValue = formFieldObject.value;
                    newValue = (options as CheckBoxFieldSettings).value;
                }
                formFieldObject.value = (options as CheckBoxFieldSettings).value;
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].value = (options as CheckBoxFieldSettings).value;
                if (isValueChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, isValueChanged, false, false,
                                                          false, false, false, false, false, false, false, false,
                                                          false, false, false, false, false, oldValue, newValue);
                }
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'RadioButton' && ((!isNullOrUndefined((options as RadioButtonFieldSettings).isSelected)) || (options as RadioButtonFieldSettings).isSelected || (options as RadioButtonFieldSettings).value)) {
            if (!isNullOrUndefined((options as RadioButtonFieldSettings).isSelected) && formFieldObject.isSelected !==
            (options as RadioButtonFieldSettings).isSelected) {
                isValueChanged = true;
                oldValue = formFieldObject.isSelected;
                newValue = this.checkboxCheckedState;
            }
            formFieldObject.isSelected = (options as RadioButtonFieldSettings).isSelected;
            (htmlElement as IElement).checked = (options as RadioButtonFieldSettings).isSelected;
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].isSelected = (options as RadioButtonFieldSettings).isSelected;
            if ((options as RadioButtonFieldSettings).value || (options as RadioButtonFieldSettings).isSelected) {
                if (formFieldObject.value !== (options as RadioButtonFieldSettings).value) {
                    isValueChanged = true;
                    oldValue = formFieldObject.value;
                    newValue = (options as RadioButtonFieldSettings).value;
                }
                formFieldObject.value = (options as RadioButtonFieldSettings).value;
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].value = (options as RadioButtonFieldSettings).value;
                if (isValueChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, isValueChanged, false, false,
                                                          false, false, false, false, false, false, false, false, false,
                                                          false, false, false, false, oldValue, newValue);
                }
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox') {
            if ((options as DropdownFieldSettings).options) {
                formFieldObject.options = (options as DropdownFieldSettings).options;
                formFieldObject.selectedIndex = [];
                formFieldObject.selectedIndex.push(0);
                this.updateDropDownListDataSource(formFieldObject, htmlElement);
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].options = formFieldObject.options;
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'Textbox' || formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType === 'InitialField' ||
            formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox'
            || formFieldObject.formFieldAnnotationType === 'PasswordField') {
            if ((options as TextFieldSettings).value || (options as TextFieldSettings).isMultiline) {
                if (!isNullOrUndefined((options as TextFieldSettings).value) && formFieldObject.value !==
                (options as TextFieldSettings).value) {
                    isValueChanged = true;
                    oldValue = formFieldObject.value;
                    newValue = (options as TextFieldSettings).value;
                }
                formFieldObject.value = (options as TextFieldSettings).value ? (options as TextFieldSettings).value : formFieldObject.value;
                if (formFieldObject.formFieldAnnotationType === 'Textbox' && (options as TextFieldSettings).isMultiline){
                    this.addMultilineTextbox(formFieldObject, 'e-pv-formfield-input', true);
                    this.multilineCheckboxCheckedState = true;
                    if (document.getElementById(formFieldObject.id + '_content_html_element')) {
                        this.updateTextboxFormDesignerProperties(formFieldObject);
                    } else {
                        this.updateFormFieldPropertiesInCollections(formFieldObject);
                    }
                }
                if (!isNullOrUndefined((options as TextFieldSettings).isMultiline) && formFieldObject.isMultiline !==
                 (options as TextFieldSettings).isMultiline) {
                    isValueChanged = true;
                    formFieldObject.isMultiline = (options as TextFieldSettings).isMultiline;
                }
                if (!(formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox') && !isNullOrUndefined((options as TextFieldSettings).value)) {
                    (htmlElement as IElement).value = (options as TextFieldSettings).value;
                }
                else if ( formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox')
                {
                    formFieldObject.selectedIndex = [];
                    for (let i: number = 0 as number; i <  (htmlElement as IElement).options.length ; i++)
                    {
                        if ((htmlElement as IElement).options[parseInt(i.toString(), 10)].text === (options as TextFieldSettings).value){
                            (htmlElement as IElement).options.selectedIndex = i;
                            formFieldObject.selectedIndex.push(i);
                        }
                    }
                    if (!isNullOrUndefined((options as any).selectedIndex) && formFieldObject.selectedIndex !==
                     (options as any).selectedIndex) {
                        formFieldObject.selectedIndex = (options as any).selectedIndex;
                        (htmlElement as IElement).options.selectedIndex = (options as any).selectedIndex;
                    }
                }
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].value = (options as TextFieldSettings).value ? (options as TextFieldSettings).value : formFieldObject.value;
                if (isValueChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, isValueChanged, false, false,
                                                          false, false, false, false, false, false, false, false, false,
                                                          false, false, false, false, oldValue, newValue);
                }
            }
            else if (!isNullOrUndefined(options as TextFieldSettings) &&
             !isNullOrUndefined((options as TextFieldSettings).isMultiline) && !(options as TextFieldSettings).isMultiline) {
                this.renderTextbox(selectedItem);
                this.multilineCheckboxCheckedState = true;
                if (document.getElementById(selectedItem.id + '_content_html_element')) {
                    this.updateTextboxFormDesignerProperties(selectedItem);
                } else {
                    this.updateFormFieldPropertiesInCollections(selectedItem);
                }
            }
            if ((options as any).fontSize) {
                if (formFieldObject.fontSize !== (options as any).fontSize) {
                    isFontSizeChanged = true;
                    oldValue = formFieldObject.fontSize;
                    newValue = (options as any).fontSize;
                }
                formFieldObject.fontSize = (options as any).fontSize;
                htmlElement.style.fontSize = ((options as any).fontSize * zoomValue) + 'px';
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].fontSize = (options as any).fontSize;
                if (isFontSizeChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, isFontSizeChanged,
                                                          false, false, false, false, false, false, false,
                                                          false, false, false, false, false, false, oldValue, newValue);
                }
            }
            if ((options as any).color) {
                const color: string = this.colorNametoHashValue((options as any).color);
                if (formFieldObject.color !== color) {
                    isColorChanged = true;
                    oldValue = formFieldObject.color;
                    newValue = color;
                }
                formFieldObject.color = color;
                htmlElement.style.color = color;
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].color = color;
                if (isColorChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                          false, isColorChanged, false, false, false, false,
                                                          false, false, false, false, false, false, false, oldValue, newValue);
                }
            }
            if (formFieldObject.formFieldAnnotationType !== 'SignatureField') {
                if ((options as any).alignment) {
                    if (formFieldObject.alignment !== (options as any).alignment) {
                        isAlignmentChanged = true;
                        oldValue = formFieldObject.alignment;
                        newValue = (options as any).alignment;
                    }
                    formFieldObject.alignment = (options as any).alignment;
                    htmlElement.style.textAlign = (options as any).alignment;
                    (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].alignment = (options as any).alignment;
                    if (isAlignmentChanged) {
                        this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                              false, false, false, false, false, isAlignmentChanged, false, false,
                                                              false, false, false, false, false, oldValue, newValue);
                    }
                }
                if ((options as TextFieldSettings).maxLength) {
                    if (formFieldObject.maxLength !== (options as TextFieldSettings).maxLength) {
                        isMaxLengthChanged = true;
                        oldValue = formFieldObject.maxLength;
                        newValue = (options as TextFieldSettings).maxLength;
                    }
                    formFieldObject.maxLength = (options as TextFieldSettings).maxLength;
                    (htmlElement as HTMLInputElement).maxLength = (options as TextFieldSettings).maxLength;
                    (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].maxLength = (options as TextFieldSettings).maxLength;
                    if (isMaxLengthChanged) {
                        this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                              false, false, false, false, false, false, false, false,
                                                              isMaxLengthChanged, false, false, false, false, oldValue, newValue);
                    }
                }
            }
            if (formFieldObject.formFieldAnnotationType !== 'PasswordField') {
                if ((options as any).fontFamily) {
                    if (formFieldObject.fontFamily !== (options as any).fontFamily) {
                        isFontFamilyChanged = true;
                        oldValue = formFieldObject.fontFamily;
                        newValue = (options as any).fontFamily;
                    }
                    formFieldObject.fontFamily = (options as any).fontFamily;
                    htmlElement.style.fontFamily = (options as any).fontFamily;
                    (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].fontFamily = (options as any).fontFamily;
                    if (isFontFamilyChanged) {
                        this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, isFontFamilyChanged, false,
                                                              false, false, false, false, false, false, false, false, false,
                                                              false, false, false, false, oldValue, newValue);
                    }
                }
                let oldFontStyle: string = '';
                let newFontStyle: string = '';
                if (!isNullOrUndefined((options as any).fontStyle)) {
                    oldFontStyle += formFieldObject.font.isBold ? 'Bold' + ', ' : '';
                    oldFontStyle += formFieldObject.font.isItalic ? 'Italic' + ', ' : '';
                    oldFontStyle += formFieldObject.font.isStrikeout ? 'Strikethrough' + ', ' : '';
                    oldFontStyle += formFieldObject.font.isUnderline ? 'Underline' + ', ' : '';
                    if ((!isNullOrUndefined((options as any).fontStyle)) && ((options as any).fontStyle === FontStyle.None)) {
                        htmlElement.style.fontWeight = '';
                        htmlElement.style.fontStyle = '';
                        formFieldObject.fontStyle = '';
                        htmlElement.style.textDecoration = '';
                        formFieldObject.font.isBold = false;
                        formFieldObject.font.isItalic = false;
                        formFieldObject.font.isUnderline = false;
                        formFieldObject.font.isStrikeout = false;
                        this.setDropdownFontStyleValue(htmlElement, 'none', '');
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isBold = false;
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isItalic = false;
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isUnderline = false;
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isStrikeout = false;
                        newFontStyle = '';
                    }
                    else {
                        if (((options as any).fontStyle & FontStyle.Bold) !== 0) {
                            htmlElement.style.fontWeight = 'bold';
                            (formFieldObject as any).fontStyle = 'Bold';
                            formFieldObject.font.isBold = true;
                            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isBold = true;
                            this.setDropdownFontStyleValue(htmlElement, 'bold', 'bold');
                        }
                        newFontStyle += formFieldObject.font.isBold ? 'Bold' + ', ' : '';
                        if (((options as any).fontStyle & FontStyle.Italic) !== 0) {
                            htmlElement.style.fontStyle = 'italic';
                            (formFieldObject as any).fontStyle = 'Italic';
                            formFieldObject.font.isItalic = true;
                            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isItalic = true;
                        }
                        newFontStyle += formFieldObject.font.isItalic ? 'Italic' + ', ' : '';
                        if (((options as any).fontStyle & FontStyle.Strikethrough) !== 0) {
                            htmlElement.style.textDecoration = 'line-through';
                            formFieldObject.font.isStrikeout = true;
                            (formFieldObject as any).fontStyle = 'Strikethrough';
                            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isStrikeout = true;
                        }
                        newFontStyle += formFieldObject.font.isStrikeout ? 'Strikethrough' + ', ' : '';
                        if (((options as any).fontStyle & FontStyle.Underline) !== 0) {
                            htmlElement.style.textDecoration = 'underline';
                            (formFieldObject as any).fontStyle = 'Underline';
                            formFieldObject.font.isUnderline = true;
                            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isUnderline = true;
                        }
                        newFontStyle += formFieldObject.font.isUnderline ? 'Underline' + ', ' : '';
                    }
                    isFontStyleChanged = true;
                    if (isFontStyleChanged) {
                        this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                              isFontStyleChanged, false, false, false, false, false, false,
                                                              false, false, false, false, false, false, oldFontStyle, newFontStyle);
                    }
                }
            }
        }
        // EJ2-856550 - the multiline true and add value programmattically. after setting the multiline value below code works.
        if (!isNullOrUndefined(options.isReadOnly)) {
            if (formFieldObject.isReadonly !== options.isReadOnly) {
                isReadOnlyChanged = true;
                oldValue = formFieldObject.isReadonly;
                newValue = options.isReadOnly;
            }
            formFieldObject.isReadonly = options.isReadOnly;
            this.setReadOnlyProperty(formFieldObject, htmlElement);
            if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                htmlElement.parentElement.style.pointerEvents = options.isReadOnly ? 'none' : 'auto';
                const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                const formFieldsData: any = JSON.parse(data);
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    if (formFieldsData[parseInt(i.toString(), 10)].FormField.id.split('_')[0] === formFieldObject.id) {
                        for (let j: number = 0; j < formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem.length; j++) {
                            const radiobuttonItem: any = formFieldsData[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)];
                            const currentElement: Element = document.getElementById(radiobuttonItem.id + '_html_element').firstElementChild.firstElementChild.firstElementChild;
                            currentElement.parentElement.style.pointerEvents = options.isReadOnly ?  'none' : 'auto';
                            radiobuttonItem.isReadonly = formFieldObject.isReadonly;
                            this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)].isReadonly = formFieldObject.isReadonly;
                            this.setReadOnlyProperty(radiobuttonItem, currentElement);
                            this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.
                                radiobuttonItem[parseInt(j.toString(), 10)].backgroundColor = typeof radiobuttonItem.backgroundColor
                                    !== 'object' ? this.getRgbCode(radiobuttonItem.backgroundColor) as unknown as string :
                                    radiobuttonItem.backgroundColor;
                        }
                        formFieldsData[parseInt(i.toString(), 10)].FormField.isReadonly = formFieldObject.isReadonly;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.isReadonly =
                         formFieldObject.isReadonly;
                    }
                }
            }
            else {
                htmlElement.style.pointerEvents = options.isReadOnly ? ((options as any).isMultiline ? 'auto' : 'none') : 'auto';
            }
            if (isReadOnlyChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, isReadOnlyChanged, false,
                                                      false, false, false, false, false, oldValue, newValue);
            }
        }
        if ((formFieldObject.formFieldAnnotationType === 'SignatureField' && (options as any).signatureIndicatorSettings) || (formFieldObject.formFieldAnnotationType === 'InitialField' && (options as any).initialIndicatorSettings)){
            formFieldObject = this.updateSignatureandInitialIndicator(formFieldObject as any, options as any, htmlElement);
        }
        this.updateSessionFormFieldProperties(formFieldObject);
        const formField: FormFieldModel = {
            id: formFieldObject.id, name: (formFieldObject as PdfFormFieldBaseModel).name,
            value: (formFieldObject as PdfFormFieldBaseModel).value,
            type: formFieldObject.formFieldAnnotationType as FormFieldType, isReadOnly: formFieldObject.isReadonly,
            fontFamily: formFieldObject.fontFamily,
            fontSize: formFieldObject.fontSize, fontStyle: formFieldObject.fontStyle as unknown as FontStyle,
            color: (formFieldObject as PdfFormFieldBaseModel).color,
            backgroundColor: (formFieldObject as PdfFormFieldBaseModel).backgroundColor,
            alignment: (formFieldObject as PdfFormFieldBaseModel).alignment as TextAlign,
            visibility: (formFieldObject as PdfFormFieldBaseModel).visibility,
            maxLength: (formFieldObject as PdfFormFieldBaseModel).maxLength,
            isRequired: (formFieldObject as PdfFormFieldBaseModel).isRequired,
            isPrint: formFieldObject.isPrint, tooltip: (formFieldObject as PdfFormFieldBaseModel).tooltip,
            bounds: formFieldObject.bounds as IFormFieldBound, thickness: formFieldObject.thickness,
            borderColor: (formFieldObject as PdfFormFieldBaseModel).borderColor, pageIndex: formFieldObject.pageIndex,
            insertSpaces: (formFieldObject as PdfFormFieldBaseModel).insertSpaces,
            isTransparent: (formFieldObject as PdfFormFieldBaseModel).isTransparent,
            options: (formFieldObject as PdfFormFieldBaseModel).options,
            pageNumber: (formFieldObject as PdfFormFieldBaseModel).pageNumber,
            rotateAngle: (formFieldObject as PdfFormFieldBaseModel).rotateAngle,
            selectedIndex: (formFieldObject as PdfFormFieldBaseModel).selectedIndex,
            signatureIndicatorSettings: (formFieldObject as PdfFormFieldBaseModel).signatureIndicatorSettings,
            signatureType: (formFieldObject as any).signatureType, zIndex: (formFieldObject as PdfFormFieldBaseModel).zIndex,
            isChecked: (formFieldObject as PdfFormFieldBaseModel).isChecked,
            isMultiline: (formFieldObject as PdfFormFieldBaseModel).isMultiline,
            isSelected: (formFieldObject as PdfFormFieldBaseModel).isSelected,
            customData: (formFieldObject as PdfFormFieldBaseModel).customData
        };
        this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex((el: any) => el.id === formField.id)] = formField;
        this.pdfViewer.formFieldCollection[this.pdfViewer.formFieldCollection.
            findIndex(function (el: any): boolean { return el.id === formField.id; })] = formFieldObject;
        if (isValueChanged || isFontFamilyChanged || isFontSizeChanged || isFontStyleChanged || isColorChanged ||
            isBackgroundColorChanged || isBorderColorChanged || isBorderWidthChanged || isAlignmentChanged || isReadOnlyChanged
            || isVisibilityChanged || isRequiredChanged || isPrintChanged || isToolTipChanged || isCustomDataChanged ||
            isNameChanged || isMaxLengthChanged || isBoundsChanged) {
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
    }
    private colorNametoHashValue(colorString: string): string {
        let colorCode: string = colorString;
        // eslint-disable-next-line
        if (!colorCode.match(/#([a-z0-9]+)/gi) && !colorCode.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorCode = this.nameToHash(colorCode);
        }
        return colorCode !== '' ? colorCode : colorString;
    }

    /**
     * @param {string} formFieldId - It describes about the form field id
     * @private
     * @returns {PdfFormFieldBaseModel} - pdf formfiels base model
     */
    public getFormField(formFieldId: string | object): PdfFormFieldBaseModel {
        let formField: PdfFormFieldBaseModel;
        let formFieldCollectionObject: PdfFormFieldBaseModel;
        if (typeof formFieldId === 'object') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections((formFieldId as any).id);
            if (formFieldCollectionObject)
            {formField = (this.pdfViewer.nameTable as any)[formFieldCollectionObject.id]; }
        }
        if (typeof formFieldId === 'string') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections(formFieldId);
            if (formFieldCollectionObject)
            {formField = (this.pdfViewer.nameTable as any)[formFieldCollectionObject.id]; }
        }
        return formField;
    }

    private resetTextboxProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'textboxField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#daeaf7ff';
            obj.alignment = 'left';
            obj.visibility = 'visible';
            obj.isReadonly = false;
            obj.isRequired = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.borderColor = '#303030';
            obj.thickness = 1;
            obj.maxLength = 0;
            this.updateTextboxProperties(obj, inputElement as HTMLElement);
        }
    }

    private resetPasswordProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'passswordField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#daeaf7ff';
            obj.alignment = 'left';
            obj.visibility = 'visible';
            obj.isReadonly = false;
            obj.isRequired = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.borderColor = '#303030';
            obj.thickness = 1;
            obj.maxLength = 0;
            this.updatePasswordFieldProperties(obj, inputElement as HTMLElement);
        }
    }

    private resetCheckboxProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'checkboxField';
            obj.isChecked = false;
            obj.backgroundColor = '#daeaf7ff';
            obj.visibility = 'visible';
            obj.isReadonly = false;
            obj.isRequired = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.borderColor = '#303030';
            obj.thickness = 1;
            this.updateCheckboxProperties(obj, inputElement as HTMLElement);
        }
    }

    private resetRadioButtonProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'RadioButtonField';
            obj.isSelected = false;
            obj.backgroundColor = '#daeaf7ff';
            obj.visibility = 'visible';
            obj.isReadonly = false;
            obj.isRequired = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.borderColor = '#303030';
            obj.thickness = 1;
            this.updateRadioButtonProperties(obj, inputElement as HTMLElement);
        }
    }

    private resetDropdownListProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'dropDownField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#daeaf7ff';
            obj.alignment = 'left';
            obj.visibility = 'visible';
            obj.isReadonly = false;
            obj.isRequired = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.borderColor = '#303030';
            obj.thickness = 1;
            obj.options = [];
            this.updateDropdownListProperties(obj, inputElement as HTMLElement);
            if (obj.options) {
                this.updateDropDownListDataSource(obj, inputElement as HTMLElement);
            }
        }
    }

    private resetListBoxProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'listBoxField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#daeaf7ff';
            obj.alignment = 'left';
            obj.visibility = 'visible';
            obj.isReadonly = false;
            obj.isRequired = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.borderColor = '#303030';
            obj.thickness = 1;
            obj.options = [];
            this.updateListBoxProperties(obj, inputElement as HTMLElement);
            if (obj.options) {
                this.updateDropDownListDataSource(obj, inputElement as HTMLElement);
            }
        }
    }

    private resetSignatureTextboxProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'signatureField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#daeaf7ff';
            obj.isRequired = false;
            obj.isReadonly = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.visibility = 'visible';
            this.updateSignatureFieldProperties(obj, inputElement as HTMLElement);
        }
    }

    /**
     * Deletes the form field from the PDF page.
     *
     * @param {string} formFieldId - It describes about the form field id
     * @param {boolean} addAction - It describes about the addAction
     * @returns {void}
     */
    public deleteFormField(formFieldId: string | object, addAction: boolean = true): void {
        const formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        if (isNullOrUndefined(formField) && formFieldId) {
            const data: any = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
            const FormfieldsData: any = JSON.parse(data);
            this.pdfViewer.formFieldCollection =
            this.pdfViewer.formFieldCollection.filter((field: any) => (formFieldId as any).id !== field.id);
            for (let i: number = 0; i < this.pdfViewer.formFieldCollections.length; i++) {
                if ((formFieldId as { id: string }).id === this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)].id) {
                    for (let j: number = 0; j < FormfieldsData.length; j++) {
                        if ((formFieldId as { name: string }).name === FormfieldsData[parseInt(j.toString(), 10)].FieldName) {
                            FormfieldsData.splice(j, 1);
                            const field: any = this.pdfViewer.formFieldCollections[parseInt(j.toString(), 10)];
                            this.pdfViewer.formFieldCollections.splice(i, 1);
                            const stringify: any = JSON.stringify(FormfieldsData);
                            PdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_formfields', stringify);
                            this.pdfViewer.fireFormFieldRemoveEvent('formFieldRemove', field, field.pageIndex);
                            if (addAction && this.pdfViewer.annotation) {
                                this.pdfViewer.annotation.addAction(field.pageIndex, null, field, 'Delete', '', field, field);
                            }
                        }
                    }
                }
            }
        }
        if (formField) {
            this.clearSelection(formFieldId);
            this.pdfViewer.remove(formField);
            this.pdfViewer.renderDrawing();
            if (!isNullOrUndefined(this.pdfViewer.toolbar) && !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule))
            {this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(false); }
            if (this.pdfViewerBase.formFieldCollection.length > 0) {
                this.pdfViewerBase.enableFormFieldButton(true);
            } else {
                this.pdfViewerBase.enableFormFieldButton(false);
            }
            if (addAction && this.pdfViewer.annotation) {
                this.pdfViewer.annotation.addAction(this.pdfViewerBase.currentPageNumber, null, formField, 'Delete', '', formField, formField);
            }
        }
    }

    /**
     * Clears the selection of the form field in the PDF page.
     *
     * @param {string} formFieldId - It describes about the form field id
     * @returns {void}
     */
    public clearSelection(formFieldId: string | object): void {
        let formField: PdfFormFieldBaseModel;
        let formFieldCollectionObject: any;
        if (typeof formFieldId === 'object') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections((formFieldId as any).id);
            formField = (this.pdfViewer.nameTable as any)[formFieldCollectionObject.id];
        }
        if (typeof formFieldId === 'string') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections(formFieldId);
            formField = (this.pdfViewer.nameTable as any)[formFieldCollectionObject.id];
        }
        if (formField && (this.pdfViewer.selectedItems && !isNullOrUndefined((this.pdfViewer.selectedItems as any).
            properties.formFields) && (this.pdfViewer.selectedItems as any).properties.formFields.length > 0 &&
            (this.pdfViewer.selectedItems as any).properties.formFields[0].id === formField.id)) {
            const pageId: number = !isNullOrUndefined(this.pdfViewerBase.activeElements.activePageID) ?
                this.pdfViewerBase.activeElements.activePageID : formField.pageIndex;
            this.pdfViewer.clearSelection(pageId);
        }
    }

    /**
     * @param {string} mode - It describes about the mode
     * @private
     * @returns {void}
     */
    public setMode(mode: string): void {
        if (mode && mode.indexOf('designer') !== -1) {
            this.enableDisableFormFieldsInteraction(true);
            this.pdfViewerBase.disableTextSelectionMode();
        } else {
            this.enableDisableFormFieldsInteraction(false);
            if (this.pdfViewer.textSelectionModule) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
        }
    }

    private enableDisableFormFieldsInteraction(enableDesignerMode: boolean): void {
        const collections: any = this.pdfViewer.formFieldCollection;
        if (collections && collections.length > 0) {
            for (let i: number = 0; i < collections.length; i++) {
                const element: HTMLElement = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element');
                const designerName: HTMLElement = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_designer_name');
                if (element) {
                    if (enableDesignerMode) {
                        this.pdfViewer.designerMode = true;
                        element.style.pointerEvents = 'none';
                        designerName.innerHTML = collections[parseInt(i.toString(), 10)].name;
                        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
                        designerName.style.fontSize = this.defaultFontSize + 'px';
                        designerName.style.position = 'absolute';
                        switch (collections[parseInt(i.toString(), 10)].formFieldAnnotationType) {
                        case 'Textbox':
                        case 'PasswordField':
                        case 'DropdownList':
                        case 'ListBox':
                        case 'SignatureField':
                        case 'InitialField':
                        case 'RadioButton': {
                            const inputElement: any = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild;
                            inputElement.style.pointerEvents = 'none';
                            break;
                        }
                        case 'Checkbox': {
                            const checkboxDivElement: any = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
                            checkboxDivElement.style.pointerEvents = 'none';
                            break;
                        }
                        }
                    } else {
                        this.pdfViewer.designerMode = false;
                        element.style.pointerEvents = 'all';
                        designerName.innerHTML = '';
                        designerName.style.position = 'initial';
                        if (collections[parseInt(i.toString(), 10)].formFieldAnnotationType === 'RadioButton') {
                            this.updateRadioButtonDesignerProperties(collections[parseInt(i.toString(), 10)], true);
                        }
                        if (collections[parseInt(i.toString(), 10)].formFieldAnnotationType === 'Checkbox') {
                            this.updateCheckboxFormDesignerProperties(collections[parseInt(i.toString(), 10)], true);
                        }
                        switch (collections[parseInt(i.toString(), 10)].formFieldAnnotationType) {
                        case 'Textbox':
                        case 'PasswordField':
                        case 'DropdownList':
                        case 'ListBox':
                        case 'SignatureField':
                        case 'InitialField':
                        case 'RadioButton': {
                            const inputElement: any = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild;
                            inputElement.style.pointerEvents = collections[parseInt(i.toString(), 10)].isReadonly ? (collections[parseInt(i.toString(), 10)].isMultiline ? 'auto' : 'none') : 'auto';
                            break;
                        }
                        case 'Checkbox': {
                            const checkboxDivElement: any = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
                            checkboxDivElement.style.pointerEvents = collections[parseInt(i.toString(), 10)].isReadonly ? (collections[parseInt(i.toString(), 10)].isMultiline ? 'auto' : 'none') : 'auto';
                            break;
                        }
                        }
                        this.pdfViewer.clearSelection(collections[parseInt(i.toString(), 10)].pageIndex);
                    }
                }
            }
        }
    }

    private getAnnotationsFromAnnotationCollections(annotationId: string): any {
        const collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].id === annotationId) {
                    return collections[parseInt(i.toString(), 10)];
                }
            }
        }
    }

    /**
     * @param {string} formFieldId - It describes about the form field id
     * @private
     * @returns {void}
     */
    public updateSignatureValue(formFieldId: string): void {
        for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
            if (formFieldId === this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id) {
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id.split('_')[0]].value = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id].value = '';
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id.split('_')[0]].signatureType = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id].signatureType = '';
            }
        }
    }

    /**
     * @param {string} annotationId - It describes about the annotation id
     * @param {string} fieldName - It describes about the field name
     * @private
     * @returns {void}
     */
    public removeFieldsFromAnnotationCollections(annotationId: string, fieldName: string): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        const sessiondata : string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        let  sessionformFields: any;
        if (!isNullOrUndefined(sessiondata)) {
            sessionformFields = JSON.parse(sessiondata);
        }
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === annotationId) {
                formFieldsData.splice(i, 1);
                this.pdfViewerBase.formFieldCollection.splice(i, 1);
                break;
            }
        }
        if (!isNullOrUndefined(sessionformFields)) {
            for (let i: number = 0; i < sessionformFields.length; i++) {
                if (sessionformFields[parseInt(i.toString(), 10)].FieldName === fieldName) {
                    sessionformFields.splice(parseInt(i.toString(), 10), 1);
                    sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(sessionformFields));
                    break;
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        const storeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, this.pdfViewerBase.currentPageNumber - 1);
            if ( index != null && annotObject[parseInt(index.toString(), 10)]) {
                for (let m: number = 0; m < annotObject[parseInt(index.toString(), 10)].annotations.length; m++) {
                    if (annotationId === annotObject[parseInt(index.toString(), 10)].annotations[parseInt(m.toString(), 10)].id) {
                        annotObject[parseInt(index.toString(), 10)].annotations.splice(m, 1);
                        break;
                    }
                }
                const annotationStringified: string = JSON.stringify(annotObject);
                PdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_annotations_shape', annotationStringified);
            }
        }
        const collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].formFieldId === annotationId) {
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                }
            }
        }
    }

    /**
     * @private
     * @returns {number} - number
     */
    public setFormFieldIndex(): number {
        if (this.pdfViewer.formFieldCollections.length > 0) {
            const lastFormField: any = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.length - 1];
            // eslint-disable-next-line
            const lastFormFieldIndex: any = lastFormField && lastFormField.name ? (!isNaN(parseInt(lastFormField.name.match(/\d+/), 10)) ?
                parseInt(lastFormField.name.match(/\d+/), 10) : this.pdfViewer.formFieldCollections.length) : null;
            if (this.isAddFormFieldUi) {
                this.formFieldIndex = this.formFieldIndex > this.pdfViewer.formFieldCollections.length ?
                    lastFormFieldIndex + 1 : this.pdfViewer.formFieldCollections.length + 1;
            }
            else {
                this.formFieldIndex = isNaN(lastFormFieldIndex) ? this.formFieldIndex + 1 : lastFormFieldIndex + 1;
            }
        } else {
            this.formFieldIndex++;
        }
        return this.formFieldIndex;
    }

    private setFormFieldIdIndex(): number {
        this.formFieldIdIndex = this.formFieldIdIndex + 1;
        return this.formFieldIdIndex;
    }

    private activateTextboxElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Textbox' + this.setFormFieldIndex(), value: '', fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black',
            backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030', alignment: 'left', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', customData: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = 'DrawTool';
    }

    private activatePasswordField(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Password' + this.setFormFieldIndex(), value: '', fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black',
            alignment: 'left', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', customData: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateCheckboxElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Check Box' + this.setFormFieldIndex(), isChecked: false, fontSize: this.defaultFontSize, backgroundColor: '#daeaf7ff', color: 'black', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: 'visible', isPrint: true, rotateAngle: 0, tooltip: '', customData: ''
        };
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateRadioButtonElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Radio Button' + this.setFormFieldIndex(), isSelected: false, fontSize: this.defaultFontSize, backgroundColor: '#daeaf7ff', color: 'black', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: 'visible', isPrint: true, rotateAngle: 0, tooltip: '', customData: ''
        };
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateDropDownListElement(formFieldType: FormFieldAnnotationType, dropDownOptions: Item[]): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Dropdown' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030',
            alignment: 'left', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', customData: '',
            options: dropDownOptions, isMultiSelect: false, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateListboxElement(formFieldType: FormFieldAnnotationType, listBoxOptions: Item[]): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'List Box' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030',
            alignment: 'left', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', customData: '',
            options: listBoxOptions, isMultiSelect: true, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateSignatureBoxElement(formFieldType: FormFieldAnnotationType): void {
        let propertyValues: any = { opacity: 1, backgroundColor: 'rgba(255, 228, 133, 0.35)', width: 19, height: 10, fontSize: this.defaultFontSize, text: null, color: 'black' };
        switch (formFieldType){
        case 'SignatureField':
            if (!isNullOrUndefined(this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings)){
                propertyValues = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings;
            }
            break;
        case 'InitialField':
            if (!isNullOrUndefined(this.pdfViewer.initialFieldSettings.initialIndicatorSettings)){
                propertyValues = this.pdfViewer.initialFieldSettings.initialIndicatorSettings;
            }
            break;
        default:
            break;
        }
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: formFieldType === 'InitialField' || this.pdfViewer.isInitialFieldToolbarSelection ? 'Initial' + this.setFormFieldIndex() : 'Signature' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', alignment: 'left',
            isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', customData: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false },
            isInitialField: formFieldType === 'InitialField' || this.pdfViewer.isInitialFieldToolbarSelection , signatureIndicatorSettings: { opacity: propertyValues.opacity, backgroundColor: propertyValues.backgroundColor , width: propertyValues.width, height: propertyValues.height, fontSize: propertyValues.fontSize, text: propertyValues.text, color: propertyValues.color }
        };
        this.pdfViewer.tool = 'DrawTool';
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {HTMLElement} inputElement - It describes about the input element
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {void}
     */
    public updateTextboxProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement, isPrint?: boolean): void {
        const fillColor: string = '#daeaf7ff';
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Textbox' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        const zoomValue: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
        if (obj.insertSpaces){
            const font: number = ((obj.bounds.width * zoomValue / obj.maxLength) - (obj.fontSize * zoomValue / 2)) - (0.6 * zoomValue);
            inputElement.style.letterSpacing = '' + font + 'px';
            inputElement.style.fontFamily = 'monospace';
            inputElement.style.paddingLeft = (font / 2) + 'px';
        }else{
            inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        }
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = 'bold';
        }
        if (obj.font.isItalic) {
            inputElement.style.fontStyle = 'italic';
        }
        if (obj.font.isUnderline && obj.font.isStrikeout) {
            inputElement.style.textDecoration = 'underline line-through';
        }
        else if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = 'line-through';
        }
        else if (obj.font.isUnderline) {
            inputElement.style.textDecoration = 'underline';
        }
        if (obj.isTransparent && obj.borderColor === '#ffffffff') {
            inputElement.style.backgroundColor = 'transparent';
            inputElement.style.borderColor = 'transparent';
        }
        else {
            inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
            inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        }
        inputElement.style.color = obj.color ? obj.color : 'black';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.direction = this.pdfViewer.enableRtl ? 'rtl' : '';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? (obj.isMultiline ? 'default' : 'none') : 'default';
        inputElement.style.resize = obj.isMultiline && !this.pdfViewer.isFormDesignerToolbarVisible ?  'none' : 'default';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor : 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        if (!isNullOrUndefined(obj.maxLength)) {
            (inputElement as HTMLInputElement).maxLength = obj.maxLength === 0 ? 524288 : obj.maxLength;
        }
        inputElement.tabIndex = this.formFieldIndex;
        inputElement.setAttribute('aria-label', this.pdfViewer.element.id + 'formfilldesigner');
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {HTMLElement} inputElement - It describes about the input element
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {void}
     */
    public updatePasswordFieldProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement, isPrint?: boolean): void {
        const fillColor: string = '#daeaf7ff';
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Password' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        const zoomValue: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = 'bold';
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = 'italic';
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = 'line-through';
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = 'underline';
        }
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        inputElement.style.color = obj.color ? obj.color : 'black';
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.direction = this.pdfViewer.enableRtl ? 'rtl' : '';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor : 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        if (!isNullOrUndefined(obj.maxLength)) {
            (inputElement as HTMLInputElement).maxLength = obj.maxLength === 0 ? 524288 : obj.maxLength;
        }
        inputElement.tabIndex = this.formFieldIndex;
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {HTMLElement} inputElement - It describes about the input element
     * @private
     * @returns {void}
     */
    public updateCheckboxProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        const fillColor: string = '#daeaf7ff';
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Check Box' + this.setFormFieldIndex();
        (inputElement as IElement).checked = obj.isChecked ? true : false;
        if (obj.isTransparent && obj.borderColor === '#ffffffff') {
            inputElement.style.backgroundColor = 'transparent';
            inputElement.style.borderColor = 'transparent';
        }
        else {
            inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
            inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        }
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor : 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {HTMLElement} inputElement - It describes about the input element
     * @param {HTMLElement} labelElement - It describes about the label element
     * @private
     * @returns {void}
     */
    public updateRadioButtonProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement, labelElement?: HTMLElement): void {
        const fillColor: string = '#daeaf7ff';
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Radio Button' + this.setFormFieldIndex();
        (inputElement as IElement).checked = obj.isSelected ? true : false;
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        if (!isNullOrUndefined(labelElement)){
            labelElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        }
        else {
            inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        }
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor : 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {HTMLElement} inputElement - It describes about the input element
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {void}
     */
    public updateDropdownListProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement, isPrint?: boolean): void {
        const fillColor: string = '#daeaf7ff';
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Dropdown' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        const zoomValue: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = 'bold';
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = 'italic';
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = 'line-through';
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = 'underline';
        }
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        inputElement.style.color = obj.color ? obj.color : 'black';
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor : 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {HTMLElement} inputElement - It describes about the input element
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {void}
     */
    public updateListBoxProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement, isPrint?: boolean): void {
        const fillColor: string = '#daeaf7ff';
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'List Box' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        const zoomValue: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = 'bold';
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = 'italic';
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = 'line-through';
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = 'underline';
        }
        inputElement.style.color = obj.color ? obj.color : 'black';
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor : 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - It describes about the object
     * @param {HTMLElement} inputElement - It describes about the input element
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {void}
     */
    public updateSignatureFieldProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement, isPrint?: boolean): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Signature' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = 'bold';
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = 'italic';
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = 'line-through';
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = 'underline';
        }
        inputElement.style.color = obj.color ? obj.color : 'black';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        let background: string = obj.backgroundColor ? obj.backgroundColor : '#FFE48559';
        background = PdfViewerUtils.setTransparencyToHex(background);
        if (obj.isTransparent && obj.borderColor === '#ffffffff') {
            inputElement.style.backgroundColor = 'transparent';
            inputElement.style.borderColor = 'transparent';
            if (inputElement.firstElementChild) {
                (inputElement.firstElementChild as HTMLElement).style.borderColor = 'transparent';
            }
        }
        else {
            inputElement.style.backgroundColor = isPrint ? 'transparent' : background;
            inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
            if (inputElement.firstElementChild) {
                (inputElement.firstElementChild as HTMLElement).style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
            }
        }
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        if (obj.isReadonly) {
            if (!isNullOrUndefined(inputElement.firstElementChild)){
                (inputElement.firstElementChild as HTMLInputElement).disabled = true;
            }
            inputElement.style.cursor = 'default';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            if (inputElement.firstElementChild) {
                const thickness: number = (obj.thickness > 0) ? obj.thickness : 1;
                (inputElement.firstElementChild as HTMLElement).style.border = thickness + 'px solid red';
            }
            else {
                (inputElement as HTMLElement).style.border = '1px solid red';
            }
            inputElement.style.borderWidth = obj.thickness ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }

    /**
     * @param {string} elementType - It describes about the elementt type
     * @param {object} attribute - It describes about the attribut
     * @private
     * @returns {HTMLElement} - html element
     */
    public createHtmlElement(elementType: string, attribute: Object): HTMLElement {
        const element: HTMLElement = createElement(elementType);
        this.setAttributeHtml(element, attribute);
        return element;
    }

    private setAttributeHtml(element: HTMLElement, attributes: any): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[parseInt(i.toString(), 10)] !== 'style') {
                element.setAttribute(keys[parseInt(i.toString(), 10)], attributes[keys[parseInt(i.toString(), 10)]]);
            } else {
                this.applyStyleAgainstCsp(element, attributes[keys[parseInt(i.toString(), 10)]]);
            }
        }
    }

    private applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void {
        const keys: string[] = attributes.split(';');
        for (let i: number = 0; i < keys.length; i++) {
            const attribute: any[] = keys[parseInt(i.toString(), 10)].split(':');
            if (attribute.length === 2) {
                svg.style[attribute[0].trim()] = attribute[1].trim();
            }
        }
    }

    private getFieldBounds(bound: any, pageIndex: number): any {
        const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        bound = { X: bound.X ? bound.X : bound.x, Y: bound.Y ? bound.Y : bound.y, Width: bound.Width ? bound.Width : bound.width,
            Height: bound.Height ? bound.Height : bound.height };
        let bounds: any;
        if (pageDetails) {
            switch (pageDetails.rotation) {
            case 0:
                bounds = bound;
                break;
            case 1:
                bounds = { X: bound.Y - (bound.Width / 2 - bound.Height / 2), Y: pageDetails.width - bound.X - bound.Height -
                 (bound.Width / 2 - bound.Height / 2), Width: bound.Width, Height: bound.Height };
                break;
            case 2:
                bounds = { X: pageDetails.width - bound.X - bound.Width, Y: pageDetails.height - bound.Y - bound.Height,
                    Width: bound.Width, Height: bound.Height };
                break;
            case 3:
                bounds = { X: (pageDetails.height - bound.Y - bound.Width + (bound.Width / 2 - bound.Height / 2)),
                    Y: bound.X + (bound.Width / 2 - bound.Height / 2), Width: bound.Height, Height: bound.Width };
                break;
            }
        }
        if (!bounds) {
            bounds = bound;
        }
        return bounds;
    }

    /**
     * @private
     * @returns {string} - string
     */
    public downloadFormDesigner(): string {
        let data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        if (this.pdfViewer.formFieldCollections.length === 0) {
            data = '[]';
        }
        if (data || (this.pdfViewer.formDesignerModule && this.pdfViewer.formFieldCollections.length > 0)) {
            const formFieldsData: any = !isNullOrUndefined(data) ? JSON.parse(data) : [];
            // Get Formfields present in non rendered pages
            this.updateMissingFormFields(formFieldsData);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                const currentData: any = formFieldsData[parseInt(i.toString(), 10)].FormField;
                if (!isNullOrUndefined(currentData)) {
                    if ((currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') && (isNullOrUndefined(currentData.signatureBound))) {
                        const filteredField: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(function (field: any): any {
                            return field.id === currentData.id.split('_')[0];
                        });
                        if (!isNullOrUndefined(currentData.signatureType) && currentData.signatureType === '') {
                            currentData.signatureType = filteredField[0].signatureType;
                        }
                        if (!isNullOrUndefined(currentData.value) && currentData.value === '') {
                            currentData.value = filteredField[0].value;
                        }
                        if (currentData.signatureType === 'Image') {
                            const imageUrl: string = (currentData.value.toString()).split(',')[1];
                            let image: PdfBitmap = new PdfBitmap(imageUrl);
                            const boundsObjects: any = {
                                x: currentData.lineBound.X, y: currentData.lineBound.Y,
                                width: currentData.lineBound.Width, height: currentData.lineBound.Height
                            };
                            //Draw image in page graphics
                            if (this.pdfViewer.signatureFitMode === 'Default') {
                                const padding: number =
                                Math.min(boundsObjects.height / this.pdfViewer.formFieldsModule.paddingDifferenceValue,
                                         boundsObjects.width / this.pdfViewer.formFieldsModule.paddingDifferenceValue);
                                const maxHeight: number = boundsObjects.height - padding;
                                const maxWidth: number = boundsObjects.width - padding;
                                const imageWidth: number = image.width;
                                const imageHeight: number = image.height;
                                const beforeWidth: number = boundsObjects.width;
                                const beforeHeight: number = boundsObjects.height;
                                const ratio: number = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
                                boundsObjects.width = imageWidth * ratio;
                                boundsObjects.height = imageHeight * ratio;
                                boundsObjects.x = boundsObjects.x + (beforeWidth - boundsObjects.width) / 2;
                                boundsObjects.y = boundsObjects.y + (beforeHeight - boundsObjects.height) / 2;
                            }
                            currentData.signatureBound = boundsObjects;
                            image = null;
                        }
                        else if (currentData.signatureType === 'Path') {
                            let boundsObjects: any = {
                                x: currentData.lineBound.X, y: currentData.lineBound.Y,
                                width: currentData.lineBound.Width, height: currentData.lineBound.Height
                            };
                            if (this.pdfViewer.signatureFitMode === 'Default') {
                                const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                                currentData.LineBounds = {X: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.X),
                                    Y: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.Y),
                                    Width: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.Width),
                                    Height: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.Height)};

                                if (typeof filteredField[0].value === 'string' && filteredField[0].value.trim().startsWith('[')) {
                                    filteredField[0].value = this.pdfViewerBase.signatureValue(filteredField[0].value);
                                }
                                const signatureBounds: any = this.pdfViewerBase.signatureModule.
                                    updateSignatureAspectRatio(filteredField[0].value, false, null, currentData);
                                if (this.pdfViewer.formFieldsModule) {
                                    boundsObjects = this.pdfViewer.formFieldsModule.
                                        getSignBounds(i, currentData.rotation, currentData.pageNumber,
                                                      zoomvalue, currentData.lineBound.X, currentData.lineBound.Y,
                                                      signatureBounds.width, signatureBounds.height, true);
                                }
                                boundsObjects.x = boundsObjects.x + signatureBounds.left;
                                boundsObjects.y = boundsObjects.y + signatureBounds.top;
                            }
                            currentData.signatureBound = boundsObjects;
                            const collectionData: Object[] = processPathData(filteredField[0].value);
                            const csData: Object[] = splitArrayCollection(collectionData);
                            currentData.value = JSON.stringify(csData);
                        }
                        else if (currentData.signatureType === 'Type' || currentData.signatureType === 'Text') {
                            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                            if (this.pdfViewer.formFieldsModule) {
                                let bounds: any = this.pdfViewer.formFieldsModule.
                                    getSignBounds(i, currentData.rotation, currentData.pageNumber, zoomvalue, currentData.lineBound.X,
                                                  currentData.lineBound.Y, currentData.lineBound.Width, currentData.lineBound.Height);
                                if (this.pdfViewer.signatureFitMode === 'Default') {
                                    bounds = this.pdfViewer.formFieldsModule.getDefaultBoundsforSign(bounds);
                                }
                                currentData.signatureBound = bounds;
                                currentData.signatureType = 'Text';
                                const fontSize: number = bounds.height / this.pdfViewer.formFieldsModule.signatureFontSizeConstent;
                                const textWidth: number = this.pdfViewer.formFieldsModule.
                                    getTextWidth(currentData.value, fontSize, currentData.fontFamily);
                                let widthRatio: number = 1;
                                if (textWidth > bounds.width) {
                                    widthRatio = bounds.width / textWidth;
                                }
                                currentData.fontSize = this.pdfViewer.formFieldsModule.getFontSize(Math.floor((fontSize * widthRatio)));
                            }
                        }
                    }
                }
                currentData.Multiline = currentData.isMultiline;
                if (currentData.isRequired) {
                    if (currentData.formFieldAnnotationType === 'Textbox' || currentData.formFieldAnnotationType === 'PasswordField' || currentData.Multiline) {
                        if (currentData.value === null || currentData.value === '') {
                            this.pdfViewerBase.validateForm = true;
                            this.pdfViewerBase.nonFillableFields[currentData.name] = currentData.value;
                        } else {
                            delete (this.pdfViewerBase.nonFillableFields[currentData.name]);
                        }
                    } else if (currentData.formFieldAnnotationType === 'RadioButton') {
                        if (currentData.radiobuttonItem) {
                            let isSelected: boolean = false;
                            for (let j: number = 0; j < currentData.radiobuttonItem.length; j++) {
                                if (currentData.radiobuttonItem[parseInt(j.toString(), 10)].isSelected) {
                                    isSelected = true;
                                    break;
                                }
                            }
                            if (!isSelected) {
                                this.pdfViewerBase.validateForm = true;
                                this.pdfViewerBase.nonFillableFields[currentData.name] = isSelected;
                            } else {
                                delete (this.pdfViewerBase.nonFillableFields[currentData.name]);
                            }
                        }
                    } else if (currentData.formFieldAnnotationType === 'Checkbox') {
                        if (currentData.isChecked === false) {
                            this.pdfViewerBase.validateForm = true;
                            this.pdfViewerBase.nonFillableFields[currentData.name] = currentData.isChecked;
                        } else {
                            delete (this.pdfViewerBase.nonFillableFields[currentData.name]);
                        }
                    } else if (currentData.formFieldAnnotationType === 'DropdownList' || currentData.formFieldAnnotationType === 'ListBox') {
                        if (isNullOrUndefined(currentData.selectedIndex) || currentData.selectedIndex.length === 0) {
                            this.pdfViewerBase.validateForm = true;
                            this.pdfViewerBase.nonFillableFields[currentData.name] = currentData.selectedIndex;
                        } else {
                            delete (this.pdfViewerBase.nonFillableFields[currentData.name]);
                        }
                    } else if (currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') {
                        if (currentData.value === null || currentData.value === '') {
                            this.pdfViewerBase.validateForm = true;
                            this.pdfViewerBase.nonFillableFields[currentData.name] = currentData.value;
                        } else {
                            delete (this.pdfViewerBase.nonFillableFields[currentData.name]);
                        }
                    }
                }
                if (currentData) {
                    if (currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') {
                        if (currentData.signatureType === 'Text' && !this.pdfViewerBase.signatureModule.checkDefaultFont(currentData.fontFamily)) {
                            this.getTextToImage(currentData);
                        }
                    }
                }
            }
            return (JSON.stringify(formFieldsData));
        } else {
            return null;
        }
    }

    /**
     * @private
     * @param {any} formFieldsData - It describes about the fields in session
     * @returns {void}
     */
    public updateMissingFormFields(formFieldsData: { Key: string; FormField: any }[]): void {
        if (formFieldsData && formFieldsData.length !== this.pdfViewer.formFieldCollections.length) {
            const formFieldNotContains: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(
                ({ id: id1 }: { id: string }) =>
                    !this.pdfViewer.formFieldCollection.some(
                        ({ id: id2 }: { id: string }) => id2 === id1
                    )
            );
            for (let k: number = 0; k < formFieldNotContains.length; k++) {
                const items: any = this.pdfViewer.formDesignerModule.loadedFormFieldValue(
                    formFieldNotContains[parseInt(k.toString(), 10)]
                );
                if (items.formFieldAnnotationType === 'RadioButton') {
                    const index: number = formFieldsData.findIndex(
                        (field: any) => field.FormField.name === items.name
                    );
                    if (index && index >= 0) {
                        formFieldsData[parseInt(index.toString(), 10)].FormField.radiobuttonItem.push(items);
                    } else {
                        formFieldsData.push({ Key: items.id + '_content', FormField: items });
                    }
                } else {
                    formFieldsData.push({ Key: items.id + '_content', FormField: items });
                }
            }
        }
    }

    private getTextToImage(currentData: any): any {
        const signTypeCanvas: HTMLCanvasElement = createElement('canvas') as HTMLCanvasElement;
        signTypeCanvas.width = currentData.lineBound.Width / this.pdfViewerBase.getZoomFactor() || 150;
        signTypeCanvas.height = currentData.lineBound.Height / this.pdfViewerBase.getZoomFactor() || currentData.fontSize * 2;
        const canvasContext: CanvasRenderingContext2D = signTypeCanvas.getContext('2d');
        const x: number = signTypeCanvas.width / 2;
        const y: number = (signTypeCanvas.height / 2) + currentData.fontSize / 2 - 10;
        canvasContext.textAlign = 'center';
        canvasContext.font = currentData.fontSize + 'px ' + currentData.fontFamily;
        canvasContext.fillText(currentData.value, x, y);
        currentData.value = JSON.stringify(signTypeCanvas.toDataURL('image/png'));
        currentData.signatureType = 'Image';

    }

    /**
     * @param {any} currentData - It describes about the current data
     * @private
     * @returns {any} - any
     */
    public loadedFormFieldValue(currentData: any): any {
        const backgroundColor: any = this.getRgbCode(currentData.backgroundColor);
        const bounds: any = currentData.bounds;
        const backColor: any = currentData.backgroundColor ? { r: backgroundColor.r, g: backgroundColor.g,
            b: backgroundColor.b, a: backgroundColor.a } : { r: 218, g: 234, b: 247, a: 100 };
        const fontColor: number[] = this.hexToRgb(currentData.color);
        const foreColor: any = currentData.color ? { r: fontColor[0], g: fontColor[1], b: fontColor[2], a: 100 } :
            { r: 0, g: 0, b: 0, a: 100 };
        const borderColor: number[] = this.hexToRgb(currentData.borderColor);
        const borderRGB: any = currentData.borderColor ? { r: borderColor[0], g: borderColor[1], b: borderColor[2], a: 100 } :
            { r: 48, g: 48, b: 48, a: 100 };
        let value: string;
        const options: ItemModel[]  = [];
        let dropListoptions: any = [];
        const selectedIndex: any = [];
        let finalSignBounds : any;
        let signType: any = '';
        this.data = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (!isNullOrUndefined(this.data)) {
            this.formFieldsData = JSON.parse(this.data);
            if ((currentData.type === 'DropdownList' || currentData.type === 'ListBox')){
                const dropListData: any = this.formFieldsData.filter( (fieldData: any) => (currentData.name === fieldData.FieldName) );
                if (dropListData.length > 0) {
                    dropListoptions = dropListData[0].TextList;
                    if (!isNullOrUndefined(dropListData[0].selectedIndex)) {
                        selectedIndex.push(dropListData[0].selectedIndex);
                    }
                    else {
                        selectedIndex.push(dropListData[0].SelectedList[0]);
                    }
                    for (let i: number = 0; i < dropListoptions.length; i++) {
                        options.push({ itemName: dropListoptions[parseInt(i.toString(), 10)],
                            itemValue: dropListoptions[parseInt(i.toString(), 10)] });
                    }
                }
            }
            if ((currentData.type === 'InitialField' || currentData.type === 'SignatureField')) {
                this.formFieldsData = JSON.parse(this.data);
                if (this.formFieldsData[0] === '[') {
                    this.formFieldsData = JSON.parse(this.formFieldsData);
                }
                const signData: any = this.formFieldsData.filter((signfieldName: any) => (currentData.name === signfieldName.FieldName) );
                if (signData.length > 0) {
                    const boundsData: any = this.formFieldsData.filter((datafieldName: any) => (datafieldName.Name === 'ink' || datafieldName.Name === 'SignatureField' || datafieldName.Name === 'SignatureImage' || datafieldName.Name === 'SignatureText') && (signData[0].FieldName === datafieldName.FieldName.split('_')[0]) );
                    for (let i: number = 0; i < boundsData.length; i++){
                        if ((signData[0].FieldName !== boundsData[parseInt(i.toString(), 10)].FieldName)){
                            value = boundsData[parseInt(i.toString(), 10)].Value;
                            currentData.fontFamily = boundsData[parseInt(i.toString(), 10)].FontFamily;
                            currentData.fontSize = boundsData[parseInt(i.toString(), 10)].FontSize;
                            if (!signData.Bounds) {
                                const signBounds: any = boundsData[parseInt(i.toString(), 10)].LineBounds;
                                let currentLeft: number = void 0;
                                let currentTop: number = void 0;
                                let currentWidth: number = void 0;
                                let currentHeight: number = void 0;
                                const currentPage: number = parseFloat(boundsData[parseInt(i.toString(), 10)].PageIndex);
                                if (signBounds.x || signBounds.y || signBounds.width || signBounds.height) {
                                    currentLeft = signBounds.x;
                                    currentTop = signBounds.y;
                                    currentWidth = signBounds.width;
                                    currentHeight = signBounds.height;
                                }
                                else {
                                    if (this.pdfViewer.formFieldsModule) {
                                        currentLeft = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.X);
                                        currentTop = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.Y);
                                        currentWidth = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.Width);
                                        currentHeight = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.Height);
                                    }
                                }
                                const bound : any = { left: currentLeft, top: currentTop, width: currentWidth, height: currentHeight };
                                if (this.pdfViewer.formFieldsModule) {
                                    finalSignBounds = this.pdfViewer.formFieldsModule.updateSignatureBounds(bound, currentPage, false);
                                }
                            }
                            if (boundsData[parseInt(i.toString(), 10)].Name === 'SignatureImage'){
                                signType = 'Image';
                            }
                            if (boundsData[parseInt(i.toString(), 10)].Name === 'ink'){
                                signType = 'Path';
                            }
                            if (boundsData[parseInt(i.toString(), 10)].Name === 'SignatureText'){
                                signType = 'Text';
                            }
                            if (signType === 'Path') {
                                const collectionData: Object[] = processPathData(boundsData[parseInt(i.toString(), 10)].Value);
                                const csData: Object[] = splitArrayCollection(collectionData);
                                value = JSON.stringify(csData);
                            }
                            break;
                        }
                    }
                }
            }

        }
        const fieldProperties: any = {
            lineBound: { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height },
            pageNumber: parseFloat(currentData.pageIndex) + 1, name: currentData.name, tooltip: currentData.tooltip,
            value: value ? value : currentData.value, radiobuttonItem: [],
            signatureType: currentData.signatureType ? currentData.signatureType : signType, id: currentData.id,
            insertSpaces: currentData.insertSpaces ? currentData.insertSpaces : false,
            isChecked: currentData.isChecked ? currentData.isChecked : false,
            isPrint: currentData.isPrint ? currentData.isPrint : false,
            isSelected: currentData.isSelected ? currentData.isSelected : false, fontFamily: currentData.fontFamily,
            fontStyle: currentData.fontStyle, backgroundColor: backColor, fontColor: foreColor, borderColor: borderRGB,
            thickness: currentData.thickness,
            fontSize: currentData.fontSize, isMultiline: currentData.isMultiline ? currentData.isMultiline : false,
            rotation: currentData.rotateAngle, isReadOnly: currentData.isReadOnly ? currentData.isReadOnly : false,
            isRequired: currentData.isRequired ? currentData.isRequired : false, textAlign: currentData.alignment,
            formFieldAnnotationType: currentData.type,
            zoomValue: 1, option: options, maxLength: currentData.maxLength ? currentData.maxLength : 0,
            visibility: currentData.visibility, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false },
            customData: currentData.customData
        };
        if (finalSignBounds) {
            fieldProperties.signatureBound = finalSignBounds;
        }
        if (selectedIndex.length > 0 ) {
            fieldProperties.selectedIndex = selectedIndex;
        }
        if (currentData.type === 'RadioButton') {
            const field: any = {
                lineBound: { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height },
                pageNumber: parseFloat(currentData.pageIndex) + 1, name: currentData.name, tooltip: currentData.tooltip,
                value: currentData.value, signatureType: currentData.signatureType ? currentData.signatureType : '', id: currentData.id,
                isChecked: currentData.isChecked ? currentData.isChecked : false, isSelected: currentData.isSelected ?
                    currentData.isSelected : false,
                fontFamily: currentData.fontFamily, fontStyle: currentData.fontStyle, backgroundColor: backColor,
                fontColor: foreColor, borderColor: borderRGB, thickness: currentData.thickness, fontSize: currentData.fontSize, rotation: 0,
                isReadOnly: currentData.isReadOnly ? currentData.isReadOnly : false, isRequired: currentData.isRequired ?
                    currentData.isRequired : false,
                isPrint: currentData.isPrint ? currentData.isPrint : false,
                textAlign: currentData.alignment, formFieldAnnotationType: currentData.type, zoomValue: 1,
                maxLength: currentData.maxLength ? currentData.maxLength : 0, visibility: currentData.visibility,
                font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false },
                customData: currentData.customData
            };
            fieldProperties.radiobuttonItem.push(field);
        } else {
            fieldProperties.radiobuttonItem = [];
        }
        return fieldProperties;
    }

    /**
     * @param {HTMLElement} pageDiv - It describes about the pageDiv
     * @param {number} pageWidth - It describes about the pageWidth
     * @param {number} pageHeight - It describes about the pageHeight
     * @param {number} pageNumber - It describes about the pageNumber
     * @param {string} displayMode - It describes about the displayMode
     * @private
     * @returns {HTMLElement} - html element
     */
    public createAnnotationLayer(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number,
                                 displayMode: string): HTMLElement {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            this.updateAnnotationCanvas(canvas as any, pageWidth, pageHeight, pageNumber);
            return canvas;
        } else {
            const annotationCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' }) as HTMLCanvasElement;
            this.updateAnnotationCanvas(annotationCanvas as any, pageWidth, pageHeight, pageNumber);
            pageDiv.appendChild(annotationCanvas);
            return annotationCanvas;
        }
    }

    /**
     * @param {number} width - It describes about the width
     * @param {number} height - It describes about the height
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public resizeAnnotations(width: number, height: number, pageNumber: number): void {
        const canvas: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageNumber);
        if (canvas) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
        }
    }

    /**
     * @param {Event} event - It describes about the event
     * @private
     * @returns {number} - number
     */
    public getEventPageNumber(event: Event): number {
        let eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.classList.contains('e-pv-hyperlink')) {
            eventTarget = eventTarget.parentElement;
        }
        else if (eventTarget.parentElement.classList.contains('foreign-object') || (eventTarget.parentElement.classList.contains('e-pv-radiobtn-container'))) {
            eventTarget = (eventTarget as any).closest('.e-pv-text-layer');
        }
        let pageString: string = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
        if (isNaN(pageString as unknown as number)) {
            event = this.pdfViewerBase.annotationEvent;
            if (event) {
                eventTarget = event.target as HTMLElement;
                pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
            }
        }
        return parseInt(pageString, 10);
    }
    private getPropertyPanelHeaderContent(formFieldType: FormFieldAnnotationType): string {
        switch (formFieldType) {
        case 'Textbox':
            return this.pdfViewer.localeObj.getConstant('Textbox');
        case 'PasswordField':
            return this.pdfViewer.localeObj.getConstant('Password');
        case 'Checkbox':
            return this.pdfViewer.localeObj.getConstant('Check Box');
        case 'RadioButton':
            return this.pdfViewer.localeObj.getConstant('Radio Button');
        case 'DropdownList':
            return this.pdfViewer.localeObj.getConstant('Dropdown');
        case 'ListBox':
            return this.pdfViewer.localeObj.getConstant('List Box');
        case 'InitialField':
            return this.pdfViewer.localeObj.getConstant('Initial');
        case 'SignatureField':
            return this.pdfViewer.localeObj.getConstant('Signature');
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public createPropertiesWindow(): void {
        const elementID: string = this.pdfViewer.element.id;
        let propertyWinMinHeight: string;
        const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_properties_window', className: 'e-pv-properties-form-field-window' });
        const appearanceTab: HTMLElement = this.createAppearanceTab();
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'DropdownList' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'ListBox')
        {propertyWinMinHeight = '430px'; }
        else
        {propertyWinMinHeight = '505px'; }
        this.propertiesDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: '<div class="e-pv-form-field-property-header"> ' + this.getPropertyPanelHeaderContent(this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType) + ' ' + this.pdfViewer.localeObj.getConstant('Properties') + '</div>',
            minHeight: propertyWinMinHeight, target: this.pdfViewer.element, content: appearanceTab, beforeOpen: () => {
                this.isPropertyDialogOpen = true;
            }, allowDragging: true, close: () => {
                this.destroyPropertiesWindow();
                this.isPropertyDialogOpen = false;
            }
        });
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.propertiesDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        } else {
            this.propertiesDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.propertiesDialog.enableRtl = true;
        }
        const propertySpliterBottom: HTMLElement = createElement('div');
        propertySpliterBottom.className = 'e-pv-properties-bottom-spliter';
        dialogDiv.appendChild(propertySpliterBottom);
        this.propertiesDialog.appendTo(dialogDiv);
    }

    private onOkClicked(args: any): void {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        const clonedItem: Object = cloneObject(selectedItem);
        this.isAddFormFieldProgrammatically = false;
        if (selectedItem) {
            switch (selectedItem.formFieldAnnotationType) {
            case 'Textbox':
            case 'PasswordField': {
                if (this.formFieldMultiline && this.formFieldMultiline.checked && selectedItem.formFieldAnnotationType === 'Textbox' && this.multilineCheckboxCheckedState) {
                    this.renderMultilineText(selectedItem);
                } else if (selectedItem.formFieldAnnotationType === 'Textbox' && this.multilineCheckboxCheckedState) {
                    this.renderTextbox(selectedItem);
                }
                if (selectedItem.formFieldAnnotationType === 'PasswordField') {
                    this.updateTextboxFormDesignerProperties(selectedItem);
                }
                if (selectedItem.formFieldAnnotationType === 'Textbox') {
                    const textboxCollection: any = this.checkTextboxName(selectedItem);
                    if (textboxCollection && textboxCollection.length > 0) {
                        for (let i: number = 0; i < textboxCollection.length; i++) {
                            const item: any = textboxCollection[parseInt(i.toString(), 10)];
                            if (item.id === selectedItem.id) {
                                if (selectedItem.isMultiline) {
                                    this.renderMultilineText(item);
                                } else {
                                    this.renderTextbox(item);
                                }
                                if (document.getElementById(item.id + '_content_html_element')) {
                                    this.updateTextboxFormDesignerProperties(item);
                                } else {
                                    this.updateFormFieldPropertiesInCollections(item);
                                }
                            }
                        }
                    }
                }
                this.multilineCheckboxCheckedState = false;
                const point: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(point, selectedItem.wrapper.children[0] as DiagramHtmlElement,
                                                             selectedItem.formFieldAnnotationType, selectedItem);
                break;
            }
            case 'Checkbox': {
                this.updateCheckboxFormDesignerProperties(selectedItem, false);
                const point1: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(point1, selectedItem.wrapper.children[0] as DiagramHtmlElement,
                                                             selectedItem.formFieldAnnotationType, selectedItem);
                break;
            }
            case 'RadioButton': {
                this.updateRadioButtonDesignerProperties(selectedItem, false);
                const point2: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(point2, selectedItem.wrapper.children[0] as DiagramHtmlElement,
                                                             selectedItem.formFieldAnnotationType, selectedItem);
                break;
            }
            case 'SignatureField':
            case 'InitialField': {
                this.updateSignatureTextboxProperties(selectedItem);
                const point3: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(point3, selectedItem.wrapper.children[0] as DiagramHtmlElement,
                                                             selectedItem.formFieldAnnotationType, selectedItem);
                break;
            }
            case 'DropdownList': {
                this.updateDropdownFormDesignerProperties(selectedItem);
                const point4: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(point4, selectedItem.wrapper.children[0] as DiagramHtmlElement,
                                                             selectedItem.formFieldAnnotationType, selectedItem);
                break;
            }
            case 'ListBox': {
                this.updateListBoxFormDesignerProperties(selectedItem);
                const point5: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(point5, selectedItem.wrapper.children[0] as DiagramHtmlElement,
                                                             selectedItem.formFieldAnnotationType, selectedItem);
                break;
            }
            }
            this.updateFormFieldCollections(selectedItem);
            const cloneChangedNode: Object = cloneObject(selectedItem);
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.addAction(this.pdfViewerBase.currentPageNumber, null, selectedItem, 'FormDesigner Properties Change', '', clonedItem, cloneChangedNode);
            }
        }
        this.propertiesDialog.hide();
    }

    /**
     * Update the form fields properties to the collection while rendering the page
     *
     * @param {any} item - It describes about the item
     * @returns {void}
     */
    private updateFormFieldPropertiesInCollections(item: any): void {
        const formFieldCollection: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        for (let i: number = 0; i < formFieldCollection.length; i++) {
            const currentData: any = formFieldCollection[parseInt(i.toString(), 10)];
            if (currentData.id === item.id && currentData.name === item.name) {
                if (this.formFieldName && this.formFieldName.value) {
                    currentData.name = this.formFieldName.value;
                }
                if (this.formFieldValue && (item.value !== this.formFieldValue.value)) {
                    currentData.value = this.formFieldValue.value;
                }
                if (this.formFieldAlign && (item.alignment !== this.formFieldAlign)) {
                    currentData.alignment = this.formFieldAlign;
                }
                if (this.formFieldPrinting && (item.isPrint !== this.formFieldPrinting.checked)) {
                    currentData.isPrint = this.formFieldPrinting.checked;
                }
                if (this.formFieldTooltip && (item.tooltip !== this.formFieldTooltip.value)) {
                    currentData.tooltip = this.formFieldTooltip.value;
                }
                if (this.formFieldVisibility && (item.visibility !== this.formFieldVisibility.value)) {
                    currentData.visibility = this.formFieldVisibility;
                }
                if (this.formFieldFontFamily && this.formFieldFontFamily.value) {
                    currentData.fontFamily = this.formFieldFontFamily.value;
                }
                if (this.formFieldFontSize && this.formFieldFontSize.value) {
                    currentData.fontSize = parseInt(this.formFieldFontSize.value.toString(), 10);
                }
                if (this.fontColorValue && (item.color !== this.fontColorValue)) {
                    currentData.color = this.fontColorValue;
                }
                if (this.backgroundColorValue && (item.backgroundColor !== this.backgroundColorValue)) {
                    currentData.backgroundColor = this.backgroundColorValue;
                }
                if (this.borderColorValue && (item.borderColor !== this.borderColorValue)) {
                    currentData.borderColor = this.borderColorValue;
                }
                if (this.formFieldBorderWidth && item.thickness !== parseInt(this.formFieldBorderWidth, 10)) {
                    currentData.thickness = parseInt(this.formFieldBorderWidth, 10);
                }
                if (this.formFieldReadOnly && (item.isReadonly !== this.formFieldReadOnly.checked)) {
                    currentData.isReadOnly = this.formFieldReadOnly.checked;
                }
                if (this.formFieldRequired && (item.isRequired !== this.formFieldRequired.checked)) {
                    currentData.isRequired = this.formFieldRequired.checked;
                }
                if (i !== 0 && i < this.pdfViewer.formFieldCollection.length) {
                    currentData.fontStyle = this.pdfViewer.formFieldCollection[i - 1].fontStyle;
                } else {
                    currentData.fontStyle = this.pdfViewer.formFieldCollection[i + 1].fontStyle;
                }
                const formFieldIndex: number =
                this.pdfViewer.formFieldCollections.findIndex(function (el: any): boolean { return el.id === item.id; });
                this.pdfViewer.formFieldCollections[parseInt(formFieldIndex.toString(), 10)] = currentData;
            }

        }
    }

    private checkTextboxName(selectedItem: PdfFormFieldBaseModel): any {
        const textboxObjectCollection: any = [];
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            const item: any = this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)];
            if (item.name === selectedItem.name && item.formFieldAnnotationType === 'Textbox') {
                textboxObjectCollection.push(item);
            }
        }
        return textboxObjectCollection;
    }

    public renderMultilineText(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        if (isUndoRedo) {
            this.reRenderMultilineTextbox(selectedItem, 'e-pv-formfield-input');
        } else {
            this.addMultilineTextbox(selectedItem, 'e-pv-formfield-input', true);
        }
    }

    public renderTextbox(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        if (isUndoRedo) {
            this.reRenderMultilineTextbox(selectedItem, 'e-pv-formfield-textarea');
        } else {
            this.addMultilineTextbox(selectedItem, 'e-pv-formfield-textarea', false);
        }
    }

    private addMultilineTextbox(selectedItem: PdfFormFieldBaseModel, className: string, isMultiline: boolean): void {
        const wrapperElement: DiagramHtmlElement = selectedItem.wrapper.children[0] as DiagramHtmlElement;
        selectedItem.isMultiline = isMultiline;
        if (document.getElementById(wrapperElement.id + '_html_element')) {
            const htmlElement: Element = document.getElementById(wrapperElement.id + '_html_element').children[0];
            const textAreaId: string = htmlElement.children[0].id;
            document.getElementById(htmlElement.children[0].id).remove();
            if (className.indexOf('e-pv-formfield-textarea') !== -1) {
                const inputElement: HTMLElement = this.createTextboxElement(textAreaId);
                wrapperElement.template = htmlElement.appendChild(inputElement);
            } else {
                const textArea: any = this.createTextAreaElement(textAreaId);
                textArea.value = selectedItem.value;
                wrapperElement.template = htmlElement.appendChild(textArea);
            }
            const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isMultiline = selectedItem.isMultiline;
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isMultiline = selectedItem.isMultiline;
        }
    }

    private reRenderMultilineTextbox(selectedItem: PdfFormFieldBaseModel, className: string): void {
        const wrapperElement: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element');
        if (wrapperElement) {
            const textareaElement: Element = wrapperElement.firstElementChild.firstElementChild;
            const textareaId: string = textareaElement.id;
            textareaElement.remove();
            if (className.indexOf('e-pv-formfield-textarea') !== -1) {
                const textboxElement: any = this.createTextboxElement(textareaId);
                wrapperElement.firstElementChild.appendChild(textboxElement);
            } else {
                const textboxElement: any = this.createTextAreaElement(textareaId);
                wrapperElement.firstElementChild.appendChild(textboxElement);
            }
        }
    }

    private createTextAreaElement(id: string): any {
        const textArea: HTMLElement = createElement('textarea');
        textArea.id = id;
        textArea.className = 'e-pv-formfield-textarea';
        textArea.style.width = '100%';
        textArea.style.height = '100%';
        textArea.style.borderStyle = 'solid';
        textArea.addEventListener('click', this.inputElementClick.bind(this));
        textArea.addEventListener('change', this.getTextboxValue.bind(this));
        return textArea;
    }

    private createTextboxElement(id: string): HTMLElement {
        const inputElement: HTMLElement = createElement('input');
        inputElement.id = id;
        (inputElement as IElement).type = 'text';
        inputElement.className = 'e-pv-formfield-input';
        (inputElement as IElement).autocomplete = 'off';
        inputElement.style.width = '100%';
        inputElement.style.height = '100%';
        inputElement.style.position = 'absolute';
        inputElement.style.borderStyle = 'solid';
        inputElement.addEventListener('click', this.inputElementClick.bind(this));
        inputElement.addEventListener('change', this.getTextboxValue.bind(this));
        inputElement.addEventListener('focus', this.focusFormFields.bind(this));
        inputElement.addEventListener('blur', this.blurFormFields.bind(this));
        return inputElement;
    }

    /**
     * @param {PdfFormFieldBaseModel} formFieldObject - It describes about the form field object
     * @private
     * @returns {void}
     */
    public updateFormFieldCollections(formFieldObject: PdfFormFieldBaseModel): void {
        const formField: FormFieldModel = {
            id: formFieldObject.id.split('_')[0], name: (formFieldObject as PdfFormFieldBaseModel).name, value: (formFieldObject as PdfFormFieldBaseModel).value,
            type: (formFieldObject as any).type ? (formFieldObject as any).type :
                formFieldObject.formFieldAnnotationType as FormFieldType, isReadOnly: formFieldObject.isReadonly,
            fontFamily: formFieldObject.fontFamily, isMultiline: formFieldObject.isMultiline,
            fontSize: formFieldObject.fontSize, fontStyle: formFieldObject.fontStyle as unknown as FontStyle, color: (formFieldObject as PdfFormFieldBaseModel).color ? (formFieldObject as PdfFormFieldBaseModel).color : this.getRgbToHex((formFieldObject as any).fontColor), backgroundColor: typeof (formFieldObject as PdfFormFieldBaseModel).backgroundColor === 'string' ? (formFieldObject as PdfFormFieldBaseModel).backgroundColor : this.getRgbToHex((formFieldObject as PdfFormFieldBaseModel).backgroundColor),
            alignment: (formFieldObject as PdfFormFieldBaseModel).alignment ?
                (formFieldObject as PdfFormFieldBaseModel).alignment as TextAlign : (formFieldObject as any).textAlign,
            visibility: (formFieldObject as PdfFormFieldBaseModel).visibility,
            maxLength: (formFieldObject as PdfFormFieldBaseModel).maxLength,
            isRequired: (formFieldObject as PdfFormFieldBaseModel).isRequired,
            isPrint: formFieldObject.isPrint, isSelected: formFieldObject.isSelected, isChecked: formFieldObject.isChecked,
            tooltip: (formFieldObject as PdfFormFieldBaseModel).tooltip,
            bounds: formFieldObject.bounds as IFormFieldBound ? formFieldObject.bounds : (formFieldObject as any).lineBound,
            thickness: formFieldObject.thickness,
            borderColor: typeof (formFieldObject as PdfFormFieldBaseModel).borderColor === 'string' ?
                (formFieldObject as PdfFormFieldBaseModel).borderColor :
                this.getRgbToHex((formFieldObject as PdfFormFieldBaseModel).borderColor),
            pageIndex: !isNullOrUndefined(formFieldObject.pageNumber) ? formFieldObject.pageNumber - 1 : formFieldObject.pageIndex,
            insertSpaces: (formFieldObject as PdfFormFieldBaseModel).insertSpaces,
            isTransparent: (formFieldObject as PdfFormFieldBaseModel).isTransparent ?
                (formFieldObject as PdfFormFieldBaseModel).isTransparent : false,
            options: (formFieldObject as any).option ? (formFieldObject as any).option :
                (formFieldObject as PdfFormFieldBaseModel).options, pageNumber: (formFieldObject as PdfFormFieldBaseModel).pageNumber,
            rotateAngle: !isNullOrUndefined((formFieldObject as PdfFormFieldBaseModel).rotateAngle) ?
                (formFieldObject as PdfFormFieldBaseModel).rotateAngle : (formFieldObject as any).rotation,
            selectedIndex: (formFieldObject as PdfFormFieldBaseModel).selectedIndex,
            signatureIndicatorSettings: (formFieldObject as PdfFormFieldBaseModel).signatureIndicatorSettings,
            signatureType: (formFieldObject as any).signatureType,
            zIndex: (formFieldObject as PdfFormFieldBaseModel).zIndex,
            customData: (formFieldObject as PdfFormFieldBaseModel).customData
        };
        this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex((el: any) => el.id === formField.id)] = formField;
    }

    /**
     * Get the Hex value from the RGB value.
     *
     * @param {string} color - It describes about the color
     * @returns {void}
     */
    public getRgbToHex(color: any): string {
        return ('#' + this.hex(color.r) + this.hex(color.g) + this.hex(color.b));
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @private
     * @returns {void}
     */
    public updateDropdownFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        const dropdownElement: Element = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild;
        if (this.pdfViewer.designerMode || isUndoRedo) {
            const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            const formFieldsData: any = JSON.parse(data);
            const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
            selectedItem.options = this.createDropdownDataSource(selectedItem);
            this.updateDropDownListDataSource(selectedItem, dropdownElement);
            selectedItem.selectedIndex = [];
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.option = selectedItem.options;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.option = selectedItem.options;
                if (!isNullOrUndefined(selectedItem.options) && selectedItem.options.length > 0) {
                    if (formFieldsData[parseInt(index.toString(), 10)] &&
                        formFieldsData[parseInt(index.toString(), 10)].FormField.value) {
                        const selectedIndex: any = selectedItem.options.findIndex((x: any) =>
                            x.itemValue === formFieldsData[parseInt(index.toString(), 10)].FormField.value);
                        selectedItem.selectedIndex.push(selectedIndex);
                    } else {
                        selectedItem.selectedIndex.push(0);
                    }
                }
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].options = selectedItem.options;
            if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
                this.updateNamePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldValue && formFieldsData[parseInt(index.toString(), 10)] &&
             formFieldsData[parseInt(index.toString(), 10)].FormField.value || isUndoRedo) {
                this.updateValuePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldPrinting || isUndoRedo) {
                this.updateIsPrintPropertyChange(selectedItem, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldTooltip) || isUndoRedo) {
                this.updateTooltipPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldVisibility || isUndoRedo) {
                this.updateVisibilityPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldFontFamily && this.formFieldFontFamily.value) || isUndoRedo) {
                this.updateFontFamilyPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldFontSize && this.formFieldFontSize.value) || isUndoRedo) {
                this.updateFontSizePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            this.updateFontStylePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            if (this.formFieldAlign || isUndoRedo) {
                this.updateAlignmentPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.fontColorValue || isUndoRedo) {
                this.updateColorPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.backgroundColorValue || isUndoRedo) {
                this.updateBackgroundColorPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.borderColorValue || isUndoRedo) {
                this.updateBorderColorPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (!isNullOrUndefined (this.formFieldBorderWidth) || isUndoRedo) {
                this.updateBorderThicknessPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldReadOnly || isUndoRedo) {
                this.updateIsReadOnlyPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldRequired || isUndoRedo) {
                this.updateIsRequiredPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
        }
        if (isUndoRedo)
        {this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner'); }
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @private
     * @returns {void}
     */
    public updateListBoxFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        const dropdownElement: Element = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild;
        if (this.pdfViewer.designerMode || isUndoRedo) {
            const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            const formFieldsData: any = JSON.parse(data);
            const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
            selectedItem.options = this.createDropdownDataSource(selectedItem);
            this.updateDropDownListDataSource(selectedItem, dropdownElement);
            selectedItem.selectedIndex = [];
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.option = selectedItem.options;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.option = selectedItem.options;
                if (!isNullOrUndefined(selectedItem.options) && selectedItem.options.length > 0) {
                    if (formFieldsData[parseInt(index.toString(), 10)] && formFieldsData[parseInt(index.toString(), 10)].FormField.value) {
                        selectedItem.selectedIndex.push(selectedItem.options.findIndex(function (x: any): boolean {
                            return x.itemValue === formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                        }));
                    } else {
                        selectedItem.selectedIndex.push(0);
                    }
                }
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].options = selectedItem.options;
            if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
                this.updateNamePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldPrinting || isUndoRedo) {
                this.updateIsPrintPropertyChange(selectedItem, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldTooltip) || isUndoRedo) {
                this.updateTooltipPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldVisibility || isUndoRedo) {
                this.updateVisibilityPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldFontFamily && this.formFieldFontFamily.value) || isUndoRedo) {
                this.updateFontFamilyPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldFontSize && this.formFieldFontSize.value) || isUndoRedo) {
                this.updateFontSizePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            this.updateFontStylePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            if (this.formFieldAlign || isUndoRedo) {
                this.updateAlignmentPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.fontColorValue || isUndoRedo) {
                this.updateColorPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.backgroundColorValue || isUndoRedo) {
                this.updateBackgroundColorPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.borderColorValue || isUndoRedo) {
                this.updateBorderColorPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (!isNullOrUndefined (this.formFieldBorderWidth) || isUndoRedo) {
                this.updateBorderThicknessPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldReadOnly || isUndoRedo) {
                this.updateIsReadOnlyPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldRequired || isUndoRedo) {
                this.updateIsRequiredPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
        }
        if (isUndoRedo)
        {this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner'); }
    }

    private updateDropDownListDataSource(selectedItem: PdfFormFieldBaseModel, dropdownElement: any): void {
        while (dropdownElement.firstChild) {
            dropdownElement.firstChild.remove();
        }
        for (let j: number = 0; j < selectedItem.options.length; j++) {
            const option: HTMLOptionElement = document.createElement('option');
            option.className = 'e-pv-formfield-dropdown';
            option.value = selectedItem.options[parseInt(j.toString(), 10)].itemValue;
            option.text = selectedItem.options[parseInt(j.toString(), 10)].itemName;
            dropdownElement.appendChild(option);
        }
    }

    private createDropdownDataSource(selectedItem: PdfFormFieldBaseModel): object[] {
        const ulItem: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        this.formFieldListItemDataSource = [];
        if (ulItem && ulItem.children && ulItem.children.length > 0) {
            for (let i: number = 0; i < ulItem.children.length; i++) {
                const liItem: Element = ulItem.children[parseInt(i.toString(), 10)];
                this.formFieldListItemDataSource.push({ itemName: liItem.innerHTML, itemValue: liItem.innerHTML });
            }
        } else if (selectedItem && selectedItem.options.length > 0) {
            this.formFieldListItemDataSource = selectedItem.options;
        }
        return this.formFieldListItemDataSource;
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected Item
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @private
     * @returns {void}
     */
    public updateSignatureTextboxProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        const inputElement: Element = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild;
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
        if (this.pdfViewer.designerMode || isUndoRedo) {
            if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
                this.updateNamePropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldPrinting || isUndoRedo) {
                this.updateIsPrintPropertyChange(selectedItem, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldTooltip) || isUndoRedo) {
                this.updateTooltipPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (!isNullOrUndefined (this.formFieldBorderWidth) || isUndoRedo) {
                this.updateBorderThicknessPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldVisibility || isUndoRedo) {
                this.updateVisibilityPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldReadOnly || isUndoRedo) {
                this.updateIsReadOnlyPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldRequired || isUndoRedo) {
                this.updateIsRequiredPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
        }
        if (isUndoRedo)
        {this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner'); }
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {boolean} updateValue - It describes about the update value
     * @param {boolean} isUndoRedo - isUndoRedo
     * @private
     * @returns {void}
     */
    public updateCheckboxFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, updateValue?: boolean, isUndoRedo?: boolean): void {
        const checkBoxElement: Element = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
        if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
            this.updateNamePropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldValue || isUndoRedo) {
            this.updateValuePropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData, updateValue);
        }
        if (this.backgroundColorValue || isUndoRedo) {
            this.updateBackgroundColorPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.borderColorValue || isUndoRedo) {
            this.updateBorderColorPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (!isNullOrUndefined (this.formFieldBorderWidth) || isUndoRedo) {
            this.updateBorderThicknessPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldChecked) {
            this.checkboxCheckedState = this.formFieldChecked.checked;
        }
        if (this.formFieldPrinting || isUndoRedo) {
            this.updateIsPrintPropertyChange(selectedItem, isUndoRedo, index, formFieldsData);
        }
        if ((this.formFieldTooltip) || isUndoRedo) {
            this.updateTooltipPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldVisibility || isUndoRedo) {
            this.updateVisibilityPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if ( !isNullOrUndefined(this.checkboxCheckedState) || isUndoRedo) {
            this.updateIsCheckedPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if ((this.pdfViewer.designerMode && this.borderColorValue) || isUndoRedo) {
            this.updateBorderColorPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if ((this.pdfViewer.designerMode && this.formFieldBorderWidth) || isUndoRedo) {
            this.updateBorderThicknessPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldReadOnly || isUndoRedo) {
            this.updateIsReadOnlyPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldRequired || isUndoRedo) {
            this.updateIsRequiredPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (isUndoRedo)
        {this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner'); }
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {boolean} updateValue - It describes about the update value
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @private
     * @returns {void}
     */
    public updateRadioButtonDesignerProperties(selectedItem: PdfFormFieldBaseModel, updateValue?: boolean, isUndoRedo?: boolean): void {
        const radioButton: Element = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild.firstElementChild;
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
        if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
            this.updateNamePropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldValue || isUndoRedo) {
            this.updateValuePropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData, updateValue);
        }
        if (this.formFieldChecked) {
            this.checkboxCheckedState = this.formFieldChecked.checked;
        }
        if (this.formFieldPrinting || isUndoRedo) {
            this.updateIsPrintPropertyChange(selectedItem, isUndoRedo, index, formFieldsData);
        }
        if ((this.formFieldTooltip) || isUndoRedo) {
            this.updateTooltipPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldVisibility || isUndoRedo) {
            this.updateVisibilityPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if ((this.pdfViewer.designerMode && !isNullOrUndefined (this.formFieldBorderWidth)) || isUndoRedo) {
            this.updateBorderThicknessPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.backgroundColorValue || isUndoRedo) {
            this.updateBackgroundColorPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.borderColorValue || isUndoRedo) {
            this.updateBorderColorPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if ( !isNullOrUndefined(this.checkboxCheckedState) || isUndoRedo) {
            this.updateIsSelectedPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldReadOnly || isUndoRedo) {
            this.updateIsReadOnlyPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldRequired || isUndoRedo) {
            this.updateIsRequiredPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (isUndoRedo) {
            const formField: PdfFormFieldBaseModel = (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]];
            const point2: PointModel = cornersPointsBeforeRotation(formField.wrapper.children[0]).topLeft;
            this.updateFormDesignerFieldInSessionStorage(point2, formField.wrapper.children[0] as DiagramHtmlElement,
                                                         formField.formFieldAnnotationType, formField);
        }
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @private
     * @returns {void}
     */
    public updateTextboxFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        const inputElement: any = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild;
        let isMaxLengthChanged: boolean = false;
        let oldValue: any; let newValue: any;
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
        if (this.pdfViewer.designerMode || isUndoRedo || this.isAddFormFieldProgrammatically) {
            if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
                this.updateNamePropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.isAddFormFieldProgrammatically ? selectedItem.value : this.formFieldValue || isUndoRedo) {
                this.updateValuePropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldPrinting || isUndoRedo) {
                this.updateIsPrintPropertyChange(selectedItem, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldTooltip) || isUndoRedo) {
                this.updateTooltipPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldVisibility || isUndoRedo) {
                this.updateVisibilityPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.isAddFormFieldProgrammatically ? selectedItem.fontFamily : this.formFieldFontFamily &&
                 this.formFieldFontFamily.value) || isUndoRedo) {
                this.updateFontFamilyPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.isAddFormFieldProgrammatically ? selectedItem.fontSize : this.formFieldFontSize &&
                this.formFieldFontSize.value) || isUndoRedo) {
                this.updateFontSizePropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            this.updateFontStylePropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            if (this.formFieldAlign || isUndoRedo || this.multilineCheckboxCheckedState) {
                this.updateAlignmentPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.maxLengthItem || isUndoRedo) {
                if (this.maxLengthItem && (selectedItem.maxLength !== this.maxLengthItem.value)) {
                    isMaxLengthChanged = true;
                    oldValue = selectedItem.maxLength;
                    newValue = this.maxLengthItem.value;
                }
                if (!isNullOrUndefined(this.maxLengthItem)) {
                    const maxLength: number = this.maxLengthItem.value === 0 ? 524288 : this.maxLengthItem.value;
                    if (isUndoRedo && selectedItem.maxLength !== 0) {
                        inputElement.maxLength = selectedItem.maxLength;
                    } else {
                        inputElement.maxLength = maxLength;
                        selectedItem.maxLength = this.maxLengthItem.value;
                    }
                }
                if (index > -1) {
                    formFieldsData[parseInt(index.toString(), 10)].FormField.maxLength = selectedItem.maxLength;
                    this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.maxLength = selectedItem.maxLength;
                }
                (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].maxLength = selectedItem.maxLength;
                if (isMaxLengthChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                          false, false, false, false, false, false, false,
                                                          false, isMaxLengthChanged, false, false, false, false, oldValue, newValue);
                }
            }
            if (this.fontColorValue || isUndoRedo || this.multilineCheckboxCheckedState) {
                this.updateColorPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.backgroundColorValue || isUndoRedo || this.multilineCheckboxCheckedState) {
                this.updateBackgroundColorPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.borderColorValue || isUndoRedo || this.multilineCheckboxCheckedState) {
                this.updateBorderColorPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (!isNullOrUndefined (this.formFieldBorderWidth) || isUndoRedo) {
                this.updateBorderThicknessPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldReadOnly || isUndoRedo) {
                this.updateIsReadOnlyPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.isAddFormFieldProgrammatically || this.formFieldRequired || isUndoRedo) {
                this.updateIsRequiredPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
        }
        if (!this.pdfViewer.designerMode) {
            if (this.formFieldVisibility && this.formFieldVisibility.value) {
                selectedItem.visibility = this.formFieldVisibility.value as Visibility;
                const visibleItem: any = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild;
                visibleItem.style.visibility = selectedItem.visibility;
            }
        }
        this.updateFormFieldCollections(selectedItem);
        if (isUndoRedo)
        {this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner'); }
    }

    /**
     * @param {any} selectedItem - It describes about the selected item
     * @param {any} element - It describes about the element
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @param {number} index - It describes about the index
     * @param {any} formFieldsData - It describes about the form fields data
     * @private
     * @returns {void}
     */
    public updateIsCheckedPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        if (this.pdfViewer.designerMode || isUndoRedo) {
            let isValueChanged: boolean = false;
            let oldValue: any; let newValue: any;
            if (selectedItem.isChecked !== this.checkboxCheckedState) {
                isValueChanged = true;
                oldValue = selectedItem.isChecked;
                newValue = this.checkboxCheckedState;
            }
            if (!isUndoRedo) {
                selectedItem.isChecked = this.checkboxCheckedState;
            }
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.isChecked = selectedItem.isChecked;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isChecked = selectedItem.isChecked;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isChecked = selectedItem.isChecked;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, isValueChanged, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, false, false, false, false, oldValue, newValue);
            }
        }
        if (!this.pdfViewer.designerMode || isUndoRedo) {
            const checkboxElement: any = document.getElementById(selectedItem.id + '_input').firstElementChild;
            if (selectedItem.isChecked) {
                if (checkboxElement.classList.contains('e-pv-cb-unchecked'))
                {checkboxElement.classList.remove('e-pv-cb-unchecked'); }
                checkboxElement.classList.add('e-pv-cb-checked');
            } else {
                if (checkboxElement.classList.contains('e-pv-cb-checked'))
                {checkboxElement.classList.remove('e-pv-cb-checked'); }
                checkboxElement.classList.add('e-pv-cb-unchecked');
            }
        }
    }

    /**
     * @param {any} selectedItem - It describes about the selected item
     * @param {any} element - It describes about the element
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @param {number} index - It describes about the index
     * @param {any} formFieldsData - It describes about the form fields data
     * @private
     * @returns {void}
     */
    public updateIsSelectedPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        if (this.pdfViewer.designerMode || isUndoRedo) {
            let isValueChanged: boolean = false;
            let oldValue: any; let newValue: any;
            if (selectedItem.isSelected !== this.checkboxCheckedState) {
                isValueChanged = true;
                oldValue = selectedItem.isSelected;
                newValue = this.checkboxCheckedState;
            }
            if (!isUndoRedo) {
                selectedItem.isSelected = this.checkboxCheckedState;
            }
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.isSelected = selectedItem.isSelected;
                for (let i: number = 0; i < formFieldsData[parseInt(index.toString(), 10)].FormField.radiobuttonItem.length; i++) {
                    if (formFieldsData[parseInt(index.toString(), 10)].FormField.radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0] === selectedItem.id.split('_')[0]) {
                        formFieldsData[parseInt(index.toString(), 10)].
                            FormField.radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                        this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].
                            FormField.radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                    }
                }
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isSelected = selectedItem.isSelected;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, isValueChanged, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, false, false, false, false, oldValue, newValue);
            }
        }
        if (!this.pdfViewer.designerMode || isUndoRedo) {
            element.checked = selectedItem.isSelected;
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.isSelected = selectedItem.isSelected;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isSelected = selectedItem.isSelected;
                for (let i: number = 0; i < formFieldsData[parseInt(index.toString(), 10)].FormField.radiobuttonItem.length; i++) {
                    if (formFieldsData[parseInt(index.toString(), 10)].FormField.radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0] === selectedItem.id.split('_')[0]) {
                        formFieldsData[parseInt(index.toString(), 10)].FormField.
                            radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                        this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].
                            FormField.radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                    }
                }
            }
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isSelected = selectedItem.isSelected;
        }
    }

    /**
     * @param {any} selectedItem - It describes about the selected item
     * @param {any} element - It describes about the element
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @param {number} index - It describes about the index
     * @param {any} formFieldsData - It describes about the form fields data
     * @param {boolean} updateValue - It describes about the update value
     * @private
     * @returns {void}
     */
    public updateValuePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any,
                                     updateValue?: boolean): void {
        let isValueChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (selectedItem.formFieldAnnotationType !== 'DropdownList' && this.formFieldValue && (selectedItem.value !== this.formFieldValue.value)) {
            isValueChanged = true;
            oldValue = selectedItem.value;
            newValue = this.formFieldValue.value;
        }
        else if (selectedItem.formFieldAnnotationType === 'DropdownList' && this.formFieldValue && (selectedItem.value !== formFieldsData[parseInt(index.toString(), 10)].FormField.value)) {
            isValueChanged = true;
            oldValue = selectedItem.value;
            newValue = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
        }
        if (isUndoRedo) {
            element.value = selectedItem.value;
        } else {
            if (updateValue) {
                isValueChanged = false;
            } else if (!this.isAddFormFieldProgrammatically){
                if (selectedItem.formFieldAnnotationType === 'DropdownList') {
                    selectedItem.value = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                } else {
                    selectedItem.value = this.formFieldValue ? this.formFieldValue.value : selectedItem.value;
                }
                if (selectedItem.formFieldAnnotationType === 'DropdownList') {
                    element.value = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                } else {
                    element.value = this.formFieldValue ? this.formFieldValue.value : selectedItem.value;
                }
            }
            // EJ2-856550 - to get select item while add multiline programatically.
            else{
                if (selectedItem.formFieldAnnotationType === 'DropdownList') {
                    selectedItem.value = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                }
                if (selectedItem.formFieldAnnotationType === 'DropdownList') {
                    element.value = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                } else {
                    element.value = selectedItem.value;
                }
            }
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.value = selectedItem.value;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.value = selectedItem.value;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].value = selectedItem.value;
        if (isValueChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, isValueChanged, false, false,
                                                  false, false, false, false, false, false, false, false, false,
                                                  false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontStylePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isFontStyleChanged: boolean = false;
        let oldValue: string = '';
        let newValue: string = '';
        const result: any[] = this.updateFontStyle(element, selectedItem, isUndoRedo, index, formFieldsData);
        isFontStyleChanged = result[0];
        oldValue = result[1];
        newValue = result[2];
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.fontStyle = selectedItem.fontStyle;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.fontStyle = selectedItem.fontStyle;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].fontStyle = selectedItem.fontStyle;
        if (isFontStyleChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  isFontStyleChanged, false, false, false, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBorderThicknessPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number,
                                                formFieldsData: any): void {
        let isBorderWidthChanged: boolean = false;
        let oldValue: any; let newValue: any;
        const borderWidth: number = parseInt(this.formFieldBorderWidth, 10);
        if (selectedItem.thickness !== borderWidth) {
            isBorderWidthChanged = true;
            oldValue = selectedItem.thickness;
            newValue = borderWidth ? borderWidth : selectedItem.thickness;
        }
        if (isUndoRedo) {
            element.style.borderWidth = selectedItem.thickness.toString();
        } else {
            element.style.borderWidth = this.formFieldBorderWidth ? this.formFieldBorderWidth + 'px' : selectedItem.thickness + 'px';
            selectedItem.thickness = borderWidth;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.thickness = selectedItem.thickness;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.thickness = selectedItem.thickness;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].thickness = selectedItem.thickness;
        if (isBorderWidthChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, isBorderWidthChanged, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBorderColorPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number,
                                            formFieldsData: any): void {
        let isBorderColorChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (selectedItem.borderColor !== this.borderColorValue) {
            isBorderColorChanged = true;
            oldValue = selectedItem.borderColor;
            newValue = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
        }
        if (this.pdfViewer.enableHtmlSanitizer && this.borderColorValue){
            this.borderColorValue = SanitizeHtmlHelper.sanitize(this.borderColorValue);
        }
        if (isUndoRedo) {
            element.style.borderColor = selectedItem.borderColor;
        } else {
            element.style.borderColor = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
            selectedItem.borderColor = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
        }
        if (selectedItem.formFieldAnnotationType === 'RadioButton')
        {(element as any).parentElement.style.boxShadow = this.borderColorValue + ' 0px 0px 0px ' + selectedItem.thickness + 'px'; }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.borderColor = this.getRgbCode(selectedItem.borderColor);
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.borderColor =
            this.getRgbCode(selectedItem.borderColor);
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].borderColor = selectedItem.borderColor;
        if (isBorderColorChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, isBorderColorChanged, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBackgroundColorPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number,
                                                formFieldsData: any): void {
        let isBackgroundColorChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (selectedItem.backgroundColor !== this.backgroundColorValue) {
            isBackgroundColorChanged = true;
            oldValue = selectedItem.backgroundColor;
            newValue = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor;
        }
        if (this.pdfViewer.enableHtmlSanitizer && this.backgroundColorValue){
            this.backgroundColorValue = SanitizeHtmlHelper.sanitize(this.backgroundColorValue);
        }
        if (isUndoRedo) {
            if (selectedItem.formFieldAnnotationType === 'RadioButton')
            {(element as any).parentElement.style.background = selectedItem.backgroundColor; }
            else
            {element.style.background = selectedItem.backgroundColor; }
        } else {
            if (selectedItem.formFieldAnnotationType === 'RadioButton')
            {(element as any).parentElement.style.background = this.backgroundColorValue ?
                this.backgroundColorValue : selectedItem.backgroundColor; }
            else
            {element.style.background = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor; }
            selectedItem.backgroundColor = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.backgroundColor = this.getRgbCode(selectedItem.backgroundColor);
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.backgroundColor =
            this.getRgbCode(selectedItem.backgroundColor);
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].backgroundColor = selectedItem.backgroundColor;
        if (isBackgroundColorChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, isBackgroundColorChanged, false, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateColorPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isColorChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (selectedItem.color !== this.fontColorValue) {
            isColorChanged = true;
            oldValue = selectedItem.color;
            newValue = this.fontColorValue ? this.fontColorValue : selectedItem.color;
        }
        if (this.pdfViewer.enableHtmlSanitizer && this.fontColorValue){
            this.fontColorValue = SanitizeHtmlHelper.sanitize(this.fontColorValue);
        }
        if (isUndoRedo) {
            element.style.color = selectedItem.color;
        } else {
            element.style.color = this.fontColorValue ? this.fontColorValue : selectedItem.color;
            selectedItem.color = this.fontColorValue ? this.fontColorValue : selectedItem.color;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.color = this.getRgbCode(selectedItem.color);
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.color = this.getRgbCode(selectedItem.color);
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].color = selectedItem.color;
        if (isColorChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, isColorChanged, false, false, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateAlignmentPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isAlignmentChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (selectedItem.alignment !== this.formFieldAlign) {
            isAlignmentChanged = true;
            oldValue = selectedItem.alignment;
            newValue = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
        }
        if (isUndoRedo) {
            element.style.textAlign = selectedItem.alignment;
            if ((selectedItem.formFieldAnnotationType === 'ListBox' || selectedItem.formFieldAnnotationType === 'DropdownList') && element.children.length > 0) {
                element.style.textAlignLast = selectedItem.alignment;
                for (let i: number = 0; i < element.children.length; i++) {
                    const dropDownChild: any = element.children[parseInt(i.toString(), 10)];
                    dropDownChild.style.textAlignLast = selectedItem.alignment;
                    dropDownChild.style.textAlign = selectedItem.alignment;
                }
            }
        } else {
            element.style.textAlign = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
            selectedItem.alignment = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
            if ((selectedItem.formFieldAnnotationType === 'ListBox' || selectedItem.formFieldAnnotationType === 'DropdownList') && element.children.length > 0) {
                element.style.textAlignLast = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                for (let i: number = 0; i < element.children.length; i++) {
                    const dropDownChild: any = element.children[parseInt(i.toString(), 10)];
                    dropDownChild.style.textAlignLast = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                    dropDownChild.style.textAlign = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                }
            }
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.alignment = selectedItem.alignment;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.alignment = selectedItem.alignment;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].alignment = selectedItem.alignment;
        if (isAlignmentChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, isAlignmentChanged, false,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontSizePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isFontSizeChanged: boolean = false;
        let oldValue: any; let newValue: any;
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        const fontSize: number = this.formFieldFontSize ? parseInt(this.formFieldFontSize.value.toString(), 10) :
            (selectedItem && selectedItem.fontSize) ? parseInt(selectedItem.fontSize.toString(), 10) : 10;
        const selectedFontSize: number = parseInt(selectedItem.fontSize, 10);
        if (selectedFontSize !== fontSize) {
            isFontSizeChanged = true;
            oldValue = selectedItem.fontSize;
            newValue = fontSize;
        }
        if (isUndoRedo) {
            element.style.fontSize = (selectedItem.fontSize * zoomValue) + 'px'.toString();
        } else {
            selectedItem.fontSize = fontSize;
            element.style.fontSize = this.formFieldFontSize ? (parseInt(this.formFieldFontSize.value.toString(), 10)  + 'px') : parseInt(selectedItem.fontSize.toString(), 10) + 'px';
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.fontSize = selectedItem.fontSize;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.fontSize = selectedItem.fontSize;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].fontSize = selectedItem.fontSize;
        if (isFontSizeChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, isFontSizeChanged,
                                                  false, false, false, false, false, false, false,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontFamilyPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isFontFamilyChanged: boolean = false;
        let oldValue: any; let newValue: any;
        let fontFamily: string = this.pdfViewer.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(this.formFieldFontFamily ? this.formFieldFontFamily.value.toString() : '') : (this.formFieldFontFamily ? this.formFieldFontFamily.value.toString() : '');
        if (selectedItem.fontFamily !== fontFamily) {
            isFontFamilyChanged = true;
            oldValue = selectedItem.fontFamily;
            newValue = fontFamily;
        }
        if (isUndoRedo) {
            element.style.fontFamily = selectedItem.fontFamily;
        }
        // EJ2-856550 - to ge selectItem fontfamily when font family empty string in add multiline programattically.
        else if (fontFamily === '')
        {
            fontFamily = selectedItem.fontFamily;
            element.style.fontFamily = fontFamily;
        }
        else {
            selectedItem.fontFamily = fontFamily;
            element.style.fontFamily = fontFamily;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.fontFamily = selectedItem.fontFamily;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.fontFamily = selectedItem.fontFamily;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].fontFamily = selectedItem.fontFamily;
        if (isFontFamilyChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, isFontFamilyChanged, false,
                                                  false, false, false, false, false, false, false,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateVisibilityPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isVisibilityChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (this.formFieldVisibility && (selectedItem.visibility !== this.formFieldVisibility.value)) {
            isVisibilityChanged = true;
            oldValue = selectedItem.visibility;
            newValue = this.formFieldVisibility.value;
        }
        if (!isUndoRedo) {
            selectedItem.visibility = this.formFieldVisibility.value as Visibility;
        }
        element.style.visibility = selectedItem.visibility;
        if (selectedItem.formFieldAnnotationType === 'RadioButton') {
            element.parentElement.style.visibility = selectedItem.visibility;
        }
        if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
            const signElement: any = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.children[1];
            signElement.style.visibility = selectedItem.visibility;
            signElement.parentElement.style.visibility = selectedItem.visibility;
            const annotation: any = (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0] + '_content'];
            if (selectedItem.visibility as Visibility === 'hidden') {
                if (annotation) {
                    this.hideSignatureValue(selectedItem, annotation, index, formFieldsData);
                }
            } else {
                if (annotation) {
                    this.showSignatureValue(selectedItem, oldValue, annotation, index, formFieldsData);
                }
            }
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.visibility = selectedItem.visibility;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.visibility = selectedItem.visibility;
        }
        // selectedItem.visibility = this.formFieldVisibility.value;
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].visibility = selectedItem.visibility;
        if (isVisibilityChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false,
                                                  false, isVisibilityChanged, false, false, false, false, false, oldValue, newValue);
        }
    }

    private hideSignatureValue(selectedItem: any, annotation: any, index: number, formFieldsData: any): void {
        selectedItem.wrapper.children.splice(selectedItem.wrapper.children.indexOf(annotation.wrapper.children[0]), 1);
        this.pdfViewer.remove(annotation);
        this.pdfViewer.renderDrawing();
    }

    private showSignatureValue(selectedItem: any, oldValue: any, annotation: any, index: number, formFieldsData: any): void {
        if (annotation.shapeAnnotationType === 'SignatureText') {
            selectedItem.value = annotation.data;
            selectedItem.signatureType = 'Text';
            formFieldsData[parseInt(index.toString(), 10)].FormField.signatureType = 'Text';
            formFieldsData[parseInt(index.toString(), 10)].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.signatureType = 'Text';
        } else if (annotation.shapeAnnotationType === 'SignatureImage') {
            selectedItem.value = annotation.data;
            selectedItem.signatureType = 'Image';
            formFieldsData[parseInt(index.toString(), 10)].FormField.signatureType = 'Image';
            formFieldsData[parseInt(index.toString(), 10)].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.signatureType = 'Image';
        } else {
            formFieldsData[parseInt(index.toString(), 10)].FormField.signatureType = 'Path';
            selectedItem.signatureType = 'Path';
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.signatureType = 'Path';
            const collectionData: Object[] = processPathData(annotation.data);
            const csData: Object[] = splitArrayCollection(collectionData);
            selectedItem.value = JSON.stringify(csData);
            formFieldsData[parseInt(index.toString(), 10)].FormField.value = JSON.stringify(csData);
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.value = JSON.stringify(csData);
        }
        (selectedItem as any).signatureBound = annotation.signatureBound;
        if (oldValue === 'hidden') {
            this.pdfViewer.add(annotation);
            selectedItem.wrapper.children.push(annotation.wrapper);
            const canvass: any = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', selectedItem.pageIndex);
            this.pdfViewer.renderDrawing(canvass as any, selectedItem.pageIndex);
        }
        this.pdfViewer.renderDrawing();
    }

    private updateTooltipPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isToolTipChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (this.formFieldTooltip && (selectedItem.tooltip !== this.formFieldTooltip.value)) {
            isToolTipChanged = true;
            oldValue = selectedItem.tooltip;
            newValue = this.formFieldTooltip.value;
        }
        if (this.pdfViewer.enableHtmlSanitizer && !isNullOrUndefined(this.formFieldTooltip) && this.formFieldTooltip.value) {
            this.formFieldTooltip.value = SanitizeHtmlHelper.sanitize(this.formFieldTooltip.value);
        }
        if (isUndoRedo) {
            this.formFieldTooltip = new TextBox();
            this.formFieldTooltip.value = selectedItem.tooltip;
        } else {
            selectedItem.tooltip = this.formFieldTooltip ? this.formFieldTooltip.value : selectedItem.tooltip;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.tooltip = selectedItem.tooltip;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.tooltip = selectedItem.tooltip;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].tooltip = this.formFieldTooltip.value;
        if (!isNullOrUndefined(this.formFieldTooltip.value) && this.formFieldTooltip.value !== '') {
            this.setToolTip(this.formFieldTooltip.value, selectedItem.formFieldAnnotationType === 'RadioButton' ? (element as any).parentElement : element);
        }
        if (isToolTipChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false,
                                                  false, false, false, false, false, isToolTipChanged, false, oldValue, newValue);
        }
    }

    private updateNamePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        const designerName: HTMLElement = document.getElementById(selectedItem.id + '_designer_name');
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        if (this.pdfViewer.enableHtmlSanitizer && !isNullOrUndefined(this.formFieldName) && this.formFieldName.value) {
            this.formFieldName.value = SanitizeHtmlHelper.sanitize(this.formFieldName.value);
        }
        designerName.style.fontSize = this.defaultFontSize + 'px';
        if (isUndoRedo) {
            designerName.innerHTML = selectedItem.name;
        } else {
            selectedItem.name = this.formFieldName ? this.formFieldName.value : selectedItem.name;
            designerName.innerHTML = selectedItem.name;
        }
        if (index > -1) {
            let oldValue: any;
            let newValue: any;
            const optionsLength: any = selectedItem.options.length;
            oldValue = optionsLength > 1 ? selectedItem.options.slice(0, optionsLength - 1) : '';
            newValue = selectedItem.options[optionsLength - 1];
            if ((formFieldsData[parseInt(index.toString(), 10)].FormField.formFieldAnnotationType === 'DropdownList' || formFieldsData[parseInt(index.toString(), 10)].FormField.formFieldAnnotationType === 'ListBox') && (formFieldsData[parseInt(index.toString(), 10)].FormField.name === selectedItem.name) && formFieldsData[parseInt(index.toString(), 10)].FormField.option.length > 0) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue, true, formFieldsData[parseInt(index.toString(), 10)].FormField.name);
            }
            if (this.formFieldName && (selectedItem.name !== formFieldsData[parseInt(index.toString(), 10)].FormField.name )) {
                oldValue = formFieldsData[parseInt(index.toString(), 10)].FormField.name ;
                newValue = selectedItem.name;
            }
            if (formFieldsData[parseInt(index.toString(), 10)].FormField.name !== selectedItem.name) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue, true, formFieldsData[parseInt(index.toString(), 10)].FormField.name);
            }
            formFieldsData[parseInt(index.toString(), 10)].FormField.name = selectedItem.name;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.name = selectedItem.name;
        }
        element.name = selectedItem.name;
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].name = selectedItem.name;
        if (selectedItem.formFieldAnnotationType === 'DropdownList' || selectedItem.formFieldAnnotationType === 'ListBox') {
            for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                const formField: PdfFormFieldBaseModel =
                this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
                if ((formField.formFieldAnnotationType === 'DropdownList' || formField.formFieldAnnotationType === 'ListBox') && formField.name === selectedItem.name && formField.id !== selectedItem.id) {
                    selectedItem.options = formField.options;
                    this.updateDropDownListDataSource(selectedItem, element);
                    break;
                }
            }
        }
    }

    // Implemented this method to set the "ReadOnly" in the grouping elements. Task: 855079.
    private setReadOnlyProperty(selectedItem: any, element: any): void {
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isReadonly = selectedItem.isReadonly;
        this.setReadOnlyToElement(selectedItem, element, selectedItem.isReadonly);
        this.setReadOnlyToFormField(selectedItem, selectedItem.isReadonly);
    }

    private updateIsReadOnlyPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isReadOnlyChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (this.formFieldReadOnly && (selectedItem.isReadonly !== this.formFieldReadOnly.checked)) {
            isReadOnlyChanged = true;
            oldValue = selectedItem.isReadonly;
            newValue = this.formFieldReadOnly.checked;
        }
        if (isUndoRedo) {
            this.formFieldReadOnly = new CheckBox();
            this.formFieldReadOnly.checked = selectedItem.isReadonly;
        } else {
            selectedItem.isReadonly = this.formFieldReadOnly.checked;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.isReadonly = selectedItem.isReadonly;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isReadonly = selectedItem.isReadonly;
            if (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem) {
                for (let i: number = 0; i < this.pdfViewerBase.
                    formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem.length; i++) {
                    this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].
                        FormField.radiobuttonItem[parseInt(i.toString(), 10)].isReadonly = selectedItem.isReadonly;
                    (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0]].isReadonly = selectedItem.isReadonly;
                    const currentElement: HTMLElement = document.getElementById(this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0]);
                    const currentItem: any = this.pdfViewerBase.
                        formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem[parseInt(i.toString(), 10)];
                    this.setReadOnlyProperty(currentItem, currentElement);
                    if (isReadOnlyChanged) {
                        this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].
                            FormField.radiobuttonItem[parseInt(i.toString(), 10)].backgroundColor =
                            typeof(currentItem.backgroundColor) === 'string' ? this.getRgbCode(currentItem.backgroundColor) as unknown as string : currentItem.backgroundColor;
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
        this.setReadOnlyProperty(selectedItem, element);
        if (isReadOnlyChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false, isReadOnlyChanged,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateIsRequiredPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isRequiredChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (this.formFieldRequired && (selectedItem.isRequired !== this.formFieldRequired.checked)) {
            isRequiredChanged = true;
            oldValue = selectedItem.isRequired;
            newValue = this.formFieldRequired.checked;
        }
        if (isUndoRedo) {
            this.formFieldRequired = new CheckBox();
            this.formFieldRequired.checked = selectedItem.isRequired;
        } else {
            selectedItem.isRequired = this.formFieldRequired ? this.formFieldRequired.checked : selectedItem.isRequired;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.isRequired = selectedItem.isRequired;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isRequired = selectedItem.isRequired;
            if (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem) {
                for (let i: number = 0; i < this.pdfViewerBase.
                    formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem.length; i++) {
                    this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].
                        FormField.radiobuttonItem[parseInt(i.toString(), 10)].isRequired = selectedItem.isRequired;
                    (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0]].isRequired = selectedItem.isRequired;
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isRequired = selectedItem.isRequired;
        this.setRequiredToElement(selectedItem, element, selectedItem.isRequired);
        this.setRequiredToFormField(selectedItem, selectedItem.isRequired);
        if (isRequiredChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false, false,
                                                  false, false, isRequiredChanged, false, false, false, oldValue, newValue);
        }
    }

    private updateIsPrintPropertyChange(selectedItem: any, isUndoRedo: boolean, index: number, formFieldsData: any): void {
        let isPrintChanged: boolean = false;
        let oldValue: any; let newValue: any;
        if (this.formFieldPrinting && (selectedItem.isPrint !== this.formFieldPrinting.checked)) {
            isPrintChanged = true;
            oldValue = selectedItem.isPrint;
            newValue = this.formFieldPrinting.checked;
        }
        if (isUndoRedo) {
            this.formFieldPrinting = new CheckBox();
            this.formFieldPrinting.checked = selectedItem.isPrint;
        } else {
            selectedItem.isPrint = this.formFieldPrinting.checked;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.isPrint = selectedItem.isPrint;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isPrint = selectedItem.isPrint;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isPrint = selectedItem.isPrint;
        if (isPrintChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false, false,
                                                  false, false, false, isPrintChanged, false, false, oldValue, newValue);
        }
    }

    /**
     * @param {number} id - It describes about the id
     * @private
     * @returns {number} - number
     */
    public getFormFiledIndex(id: any): number {
        if (this.pdfViewerBase.formFieldCollection == null || this.pdfViewerBase.formFieldCollection.length === 0)
        {return -1; }
        const index: number = this.pdfViewerBase.formFieldCollection.findIndex((el: any) => el.Key.split('_')[0] === id);
        if (index > -1) {
            return index;
        } else {
            for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
                if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'RadioButton' && this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.radiobuttonItem) {
                    for (let k: number = 0; k < this.pdfViewerBase.
                        formFieldCollection[parseInt(i.toString(), 10)].FormField.radiobuttonItem.length; k++) {
                        if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.
                            radiobuttonItem[parseInt(k.toString(), 10)].id.split('_')[0] === id) {
                            return i;
                        }
                    }
                }
            }
        }
        return -1;
    }

    private updateFontStyle(inputElement: any, selectedItem: PdfFormFieldBaseModel, isUndoRedo: boolean, index: number,
                            formFieldsData: any): any[] {
        let isFontStyleChanged: boolean = false;
        let oldValue: string = '';
        let newValue: string = '';
        if (this.formFieldBold) {
            if (selectedItem.fontStyle !== 'Bold') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isBold ? 'Bold' + ', ' : '';
            }
            if (isUndoRedo) {
                if (selectedItem.font.isBold) {
                    this.setFontStyleValues(selectedItem, 'Bold', this.formFieldBold, inputElement, true, 'bold', index, formFieldsData);
                } else {
                    this.setFontStyleValues(selectedItem, 'None', this.formFieldBold, inputElement, false, '', index, formFieldsData);
                }
            } else if (this.formFieldBold === 'bold') {
                this.setFontStyleValues(selectedItem, 'Bold', this.formFieldBold, inputElement, true, 'bold', index, formFieldsData);
            } else {
                this.setFontStyleValues(selectedItem, 'None', 'bold', inputElement, false, '', index, formFieldsData);
            }
        }
        else if (selectedItem.font.isBold) {
            this.setFontStyleValues(selectedItem, 'None', 'bold', inputElement, false, '', index, formFieldsData);
        }
        newValue += selectedItem.font.isBold ? 'Bold' + ', ' : '';
        if (this.formFieldItalic) {
            if (selectedItem.fontStyle !== 'Italic') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isItalic ? 'Italic' + ', ' : '';
            }
            if (isUndoRedo) {
                if (selectedItem.font.isItalic) {
                    this.setFontStyleValues(selectedItem, 'Italic', this.formFieldItalic, inputElement, true, 'italic', index, formFieldsData);
                } else {
                    this.setFontStyleValues(selectedItem, 'None', this.formFieldItalic, inputElement, false, '', index, formFieldsData);
                }
            } else if (this.formFieldItalic === 'italic') {
                this.setFontStyleValues(selectedItem, 'Italic', this.formFieldItalic, inputElement, true, 'italic', index, formFieldsData);
            } else {
                this.setFontStyleValues(selectedItem, 'None', 'italic', inputElement, false, '', index, formFieldsData);
            }
        }
        else if (selectedItem.font.isItalic) {
            this.setFontStyleValues(selectedItem, 'None', 'italic', inputElement, false, '', index, formFieldsData);
        }
        newValue += selectedItem.font.isItalic ? 'Italic' + ', ' : '';
        if (this.formFieldUnderline) {
            if (selectedItem.fontStyle !== 'Underline') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isUnderline ? 'Underline' + ', ' : '';
            }
            if (isUndoRedo) {
                if (selectedItem.font.isUnderline) {
                    this.setFontStyleValues(selectedItem, 'Underline', this.formFieldUnderline, inputElement, true, 'underline', index, formFieldsData);
                } else {
                    this.setFontStyleValues(selectedItem, 'None', this.formFieldUnderline, inputElement, false, '', index, formFieldsData);
                }
            } else if (this.formFieldUnderline === 'underline') {
                this.setFontStyleValues(selectedItem, 'Underline', this.formFieldUnderline, inputElement, true, 'underline', index, formFieldsData);
            } else {
                this.setFontStyleValues(selectedItem, 'None', 'underline', inputElement, false, '', index, formFieldsData);
            }
        }
        else if (selectedItem.font.isUnderline) {
            this.setFontStyleValues(selectedItem, 'None', 'underline', inputElement, false, '', index, formFieldsData);
        }
        newValue += selectedItem.font.isUnderline ? 'Underline' + ', ' : '';
        if (this.formFieldStrikeOut) {
            if (selectedItem.fontStyle !== 'Strikethrough') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isStrikeout ? 'Strikethrough' + ', ' : '';
            }
            if (isUndoRedo) {
                if (selectedItem.font.isStrikeout) {
                    this.setFontStyleValues(selectedItem, 'Strikethrough', this.formFieldStrikeOut, inputElement, true, 'line-through', index, formFieldsData);
                } else {
                    this.setFontStyleValues(selectedItem, 'None', this.formFieldStrikeOut, inputElement, false, '', index, formFieldsData);
                }
            } else if (this.formFieldStrikeOut === 'line-through') {
                this.setFontStyleValues(selectedItem, 'Strikethrough', this.formFieldStrikeOut, inputElement, true, 'line-through', index, formFieldsData);
            } else {
                this.setFontStyleValues(selectedItem, 'None', 'line-through', inputElement, false, '', index, formFieldsData);
            }
        }
        else if (selectedItem.font.isStrikeout) {
            this.setFontStyleValues(selectedItem, 'None', 'line-through', inputElement, false, '', index, formFieldsData);
        }
        newValue += selectedItem.font.isStrikeout ? 'Strikethrough' + ', ' : '';
        return [isFontStyleChanged, oldValue, newValue];
    }

    private setFontStyleValues(selectedItem: PdfFormFieldBaseModel, selectedItemFontStyle: string, fontStyleType: string,
                               inputElement: any, isFontStyleEnabled: boolean, fontStyleValue: string, index: number,
                               formFieldsData: any): void {
        if (fontStyleType === 'bold') {
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isBold = isFontStyleEnabled;
            inputElement.style.fontWeight = fontStyleValue;
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.font.isBold = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.font.isBold = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isBold = isFontStyleEnabled;
        } else if (fontStyleType === 'italic') {
            inputElement.style.fontStyle = fontStyleValue;
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isItalic = isFontStyleEnabled;
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.font.isItalic = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.font.isItalic = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isItalic = isFontStyleEnabled;
        } else if (fontStyleType === 'underline') {
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            inputElement.style.textDecoration = fontStyleValue;
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isUnderline = isFontStyleEnabled;
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.font.isUnderline = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.font.isUnderline = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isUnderline = isFontStyleEnabled;
        } else if (fontStyleType === 'line-through') {
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            inputElement.style.textDecoration = fontStyleValue;
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isStrikeout = isFontStyleEnabled;
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.font.isStrikeout = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.font.isStrikeout = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isStrikeout = isFontStyleEnabled;
        }
    }

    private setDropdownFontStyleValue(dropdownElement: any, fontStyleType: string, value: string): void {
        if (dropdownElement.length > 0) {
            for (let i: number = 0; i < dropdownElement.length; i++) {
                if (fontStyleType === 'bold') {
                    dropdownElement[parseInt(i.toString(), 10)].style.fontWeight = value;
                } else if (fontStyleType === 'italic') {
                    dropdownElement[parseInt(i.toString(), 10)].style.fontStyle = value;
                } else if (fontStyleType === 'underline') {
                    dropdownElement[parseInt(i.toString(), 10)].style.textDecoration = value;
                } else if (fontStyleType === 'line-through') {
                    dropdownElement[parseInt(i.toString(), 10)].style.textDecoration = value;
                } else if (fontStyleType === 'none') {
                    dropdownElement[parseInt(i.toString(), 10)].style.fontWeight = value;
                }
            }
        }
    }

    /**
     * @param {string} name - It describes about the name
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {boolean} isValueChanged - It describes about the isValueChanged
     * @param {boolean} isFontFamilyChanged - It describes about the isFontFamilyChanged
     * @param {boolean} isFontSizeChanged - It describes about the isFontSizeChanged
     * @param {boolean} isFontStyleChanged - It describes about the isFontStyleChanged
     * @param {boolean} isColorChanged - It describes about the isColorChanged
     * @param {boolean} isBackgroundColorChanged - It describes about the isBackgroundColorChanged
     * @param {boolean} isBorderColorChanged - It describes about the isBorderColorChanged
     * @param {boolean} isBorderWidthChanged - It describes about the isBorderWidthChanged
     * @param {boolean} isAlignmentChanged - It describes about the isAlignmentChanged
     * @param {boolean} isReadOnlyChanged - It describes about the isReadOnlyChanged
     * @param {boolean} isVisibilityChanged - It describes about the isVisibilityChanged
     * @param {boolean} isMaxLengthChanged - It describes about the isMaxLengthChanged
     * @param {boolean} isRequiredChanged - It describes about the isRequiredChanged
     * @param {boolean} isPrintChanged - It describes about the isPrintChanged
     * @param {boolean} isToolTipChanged - It describes about the isToolTipChanged
     * @param {boolean} isCustomDataChanged - It describes about the isCustomDataChanged
     * @param {any} oldValue - It describes about the old value
     * @param {any} newValue - It describes about the new value
     * @param {boolean} isNamechanged - It describes about the isNameChanged
     * @param {string} previousName - It describes about the previous name
     * @private
     * @returns {void}
     */
    public updateFormFieldPropertiesChanges(name: string, selectedItem: PdfFormFieldBaseModel, isValueChanged: boolean,
                                            isFontFamilyChanged: boolean,
                                            isFontSizeChanged: boolean, isFontStyleChanged: boolean,
                                            isColorChanged: boolean, isBackgroundColorChanged: boolean,
                                            isBorderColorChanged: boolean,
                                            isBorderWidthChanged: boolean, isAlignmentChanged: boolean,
                                            isReadOnlyChanged: boolean, isVisibilityChanged: boolean, isMaxLengthChanged: boolean,
                                            isRequiredChanged: boolean, isPrintChanged: boolean, isToolTipChanged: boolean,
                                            isCustomDataChanged: boolean,
                                            oldValue: any, newValue: any, isNamechanged?: boolean, previousName?: string): void {
        const field: IFormField = {
            name: (selectedItem as any).name, id: (selectedItem as any).id, value: (selectedItem as any).value,
            fontFamily: (selectedItem as any).fontFamily, fontSize: (selectedItem as any).fontSize,
            fontStyle: (selectedItem as any).fontStyle,
            color: (selectedItem as any).color, backgroundColor: (selectedItem as any).backgroundColor,
            alignment: (selectedItem as any).alignment, isReadonly: (selectedItem as any).isReadonly,
            visibility: (selectedItem as any).visibility,
            maxLength: (selectedItem as any).maxLength, isRequired: (selectedItem as any).isRequired,
            isPrint: (selectedItem as any).isPrint, rotation: (selectedItem as any).rotateAngle,
            tooltip: (selectedItem as any).tooltip, options: (selectedItem as any).options,
            isChecked: (selectedItem as any).isChecked, isSelected: (selectedItem as any).isSelected,
            previousName: previousName, currentName: selectedItem.name, customData: (selectedItem as any).customData
        };
        this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', field, selectedItem.pageIndex, isValueChanged, isFontFamilyChanged, isFontSizeChanged,
                                                          isFontStyleChanged, isColorChanged, isBackgroundColorChanged,
                                                          isBorderColorChanged, isBorderWidthChanged, isAlignmentChanged,
                                                          isReadOnlyChanged, isVisibilityChanged,
                                                          isMaxLengthChanged, isRequiredChanged, isPrintChanged,
                                                          isToolTipChanged, isCustomDataChanged,
                                                          oldValue, newValue, isNamechanged);
    }

    private onCancelClicked(args: any): void {
        this.propertiesDialog.hide();
    }

    private select(e: any): void {
        if (e.isSwiped) {
            e.cancel = true; // Prevent swiping between tab items
        }
    }

    private createAppearanceTab(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const appearanceDiv: HTMLElement = createElement('div', { id: elementID + '_properties_appearance' });
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'DropdownList' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'ListBox') {
            appearanceDiv.style.height = '260px';
        } else {
            appearanceDiv.style.height = '336px';
        }
        const propertySpliter: HTMLElement = createElement('div');
        propertySpliter.className = 'e-pv-properties-header-spliter';
        appearanceDiv.appendChild(propertySpliter);
        const tabContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-tab-style-prop' });
        appearanceDiv.appendChild(tabContainer);
        // <div style="/* border-color: red; *//* border-width: 2px; *//* background: red; *//* height: 1px; */width: 100%;position: absolute;padding-top: 35px;/* border-bottom-color: black; *//* border-bottom-width: 2px; *//* border: solid; */border-bottom-style: solid;border-bottom-width: 1px;left: 0;border-bottom-color: #E0E0E0;"></div>
        if (this.pdfViewer.selectedItems && (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'ListBox' || this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'DropdownList')) {
            this.tabControl = new Tab({
                items: [
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Appearance') + '</div>' }, content: this.createAppearanceProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Options') + '</div>' }, content: this.createOptionProperties()
                    }
                ],
                selecting: this.select
            }, tabContainer);
        } else if (this.pdfViewer.selectedItems && (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'SignatureField' || this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'InitialField')) {
            this.tabControl = new Tab({
                items: [
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                    }
                ],
                selecting: this.select
            }, tabContainer);
        } else {
            this.tabControl = new Tab({
                items: [
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Appearance') + '</div>' }, content: this.createAppearanceProperties()
                    }
                ],
                selecting: this.select
            }, tabContainer);
        }
        (tabContainer.children[1] as HTMLElement).style.height = '100%';
        return appearanceDiv;
    }

    private createGeneralProperties(): HTMLElement {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields ?
            this.pdfViewer.selectedItems.formFields[0] : null;
        const visibilityItems: string[] = ['visible', 'hidden'];
        const elementID: string = this.pdfViewer.element.id;
        const generalPropertiesDiv: HTMLElement = createElement('div', { id: elementID + '_general_prop_appearance' });
        const textStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-text-edit-prop' });
        generalPropertiesDiv.appendChild(textStyleContainer);
        const formFieldNameMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-name-main-div' });
        const formFieldNameDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-name-edit-prop' });
        const formFieldNameContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-name-edit-input e-input' });
        formFieldNameDiv.appendChild(formFieldNameContainer);
        formFieldNameMainDiv.appendChild(formFieldNameDiv);
        this.formFieldName = new TextBox({ type: 'text', floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Name'), value: selectedItem.name, cssClass: 'e-pv-properties-formfield-name' }, (formFieldNameContainer as HTMLInputElement));
        textStyleContainer.appendChild(formFieldNameMainDiv);
        const formFieldTooltipMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-tooltip-main-div' });
        const formFieldTooltipDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-tooltip-edit-prop' });
        const formFieldTooltipContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-tooltip-prop-input e-input' });
        formFieldTooltipDiv.appendChild(formFieldTooltipContainer);
        formFieldTooltipMainDiv.appendChild(formFieldTooltipDiv);
        this.formFieldTooltip = new TextBox({ type: 'text', floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Tooltip'), value: selectedItem.tooltip, cssClass: 'e-pv-properties-formfield-tooltip' }, (formFieldTooltipContainer as HTMLInputElement));
        textStyleContainer.appendChild(formFieldTooltipMainDiv);
        const visibilityContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-visibility-style-prop' });
        generalPropertiesDiv.appendChild(visibilityContainer);
        const formFieldValueMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-value-main-div' });
        const formFieldValueDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-value-edit-prop' });
        const formFieldValueContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-value-input e-input' });
        formFieldValueDiv.appendChild(formFieldValueContainer);
        formFieldValueMainDiv.appendChild(formFieldValueDiv);
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'PasswordField'){
            this.formFieldValue = new TextBox({ type: 'password', floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Value'), value: selectedItem.value, cssClass: 'e-pv-properties-formfield-value' }, (formFieldValueContainer as HTMLInputElement));
        }else{
            this.formFieldValue = new TextBox({ type: 'text', floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Value'), value: selectedItem.value, cssClass: 'e-pv-properties-formfield-value' }, (formFieldValueContainer as HTMLInputElement));
        }
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'Textbox' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'PasswordField' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'RadioButton' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'Checkbox') {
            this.formFieldValue.enabled = false;
            this.formFieldValue.value = '';
        }
        visibilityContainer.appendChild(formFieldValueMainDiv);
        const formFieldVisibilityMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-visibility-main-div' });
        const formFieldVisibilityDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-visibility-edit-prop' });
        const formFieldVisibilityContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-formfield-visibility' });
        formFieldVisibilityDiv.appendChild(formFieldVisibilityContainer);
        formFieldVisibilityMainDiv.appendChild(formFieldVisibilityDiv);
        const selectedIndex: number = selectedItem.visibility === 'visible' ? 0 : 1;
        this.formFieldVisibility = new DropDownList({ dataSource: visibilityItems, floatLabelType: 'Always', index: selectedIndex, value: selectedItem.visibility, placeholder: this.pdfViewer.localeObj.getConstant('Form Field Visibility'), cssClass: 'e-pv-properties-formfield-visibility' }, formFieldVisibilityContainer);
        visibilityContainer.appendChild(formFieldVisibilityMainDiv);
        const checkboxMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-checkbox-main-div-prop' });
        const readOnly: HTMLElement = createElement('input', { className: 'e-pv-properties-checkbox-readonly-input e-input' });
        checkboxMainDiv.appendChild(readOnly);
        this.formFieldReadOnly = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Read Only'), checked: selectedItem.isReadonly, cssClass: 'e-pv-properties-form-field-checkbox' }, readOnly as HTMLInputElement);
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'Checkbox' || this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'RadioButton') {
            const checkedState: HTMLElement = createElement('input', { className: 'e-pv-properties-checkbox-checked-input e-input' });
            checkboxMainDiv.appendChild(checkedState);
            this.formFieldChecked = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Checked'), cssClass: 'e-pv-properties-form-field-checkbox', checked: selectedItem.isChecked || selectedItem.isSelected, change: this.checkBoxChange.bind(this) }, checkedState as HTMLInputElement);
        }
        const required: HTMLElement = createElement('input', { className: 'e-pv-properties-checkbox-required-input e-input' });
        checkboxMainDiv.appendChild(required);
        this.formFieldRequired = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Required'), checked: selectedItem.isRequired, cssClass: 'e-pv-properties-form-field-checkbox' }, required as HTMLInputElement);
        const showPrinting: HTMLElement = createElement('input', { className: 'e-pv-properties-checkbox-printing-input e-input' });
        checkboxMainDiv.appendChild(showPrinting);
        this.formFieldPrinting = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Show Printing'), checked: selectedItem.isPrint, cssClass: 'e-pv-properties-form-field-checkbox' }, showPrinting as HTMLInputElement);
        if (selectedItem.formFieldAnnotationType === 'Textbox') {
            const multilineTextbox: HTMLElement = createElement('input', { className: 'e-pv-properties-checkbox-multiline-input e-input' });
            checkboxMainDiv.appendChild(multilineTextbox);
            this.formFieldMultiline = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Multiline'), checked: selectedItem.isMultiline, cssClass: 'e-pv-properties-form-field-checkbox', change: this.multilineCheckboxChange.bind(this) }, multilineTextbox as HTMLInputElement);
        }
        generalPropertiesDiv.appendChild(checkboxMainDiv);
        return generalPropertiesDiv;
    }

    private checkBoxChange(args: any): void {
        this.checkboxCheckedState = args.checked;
    }

    private multilineCheckboxChange(args: any): void {
        this.multilineCheckboxCheckedState = true;
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
        tooltip.beforeOpen = this.tooltipBeforeOpen.bind(this);
        this.formFieldTooltips.push(tooltip);
    }

    private tooltipBeforeOpen(args: any): void {
        const currentFormField: any = (this.pdfViewer.nameTable as any)[args.target.id.split('_')[0] !== '' ? args.target.id.split('_')[0] : !isNullOrUndefined(args.target.firstElementChild) ? args.target.firstElementChild.id.split('_')[0] : ''];
        if (!isNullOrUndefined(currentFormField)) {
            args.element.children[0].innerHTML = currentFormField.tooltip;
            if (args.element.children[0].innerHTML !== ''){
                args.element.style.display = 'block';
            }
            else{
                args.element.style.display = 'none';
            }
        }
    }

    private createAppearanceProperties(): HTMLElement {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields ?
            this.pdfViewer.selectedItems.formFields[0] : null;
        const fontFamilyItems: string[] = ['Helvetica', 'Courier', 'Times New Roman', 'Symbol', 'ZapfDingbats'];
        const fontSizeItems: string[] = ['6px', '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px'];
        const elementID: string = this.pdfViewer.element.id;
        const appearancePropertiesDiv: HTMLElement = createElement('div', { id: elementID + '_formatting_text_prop_appearance' });
        const formatTextStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-format-text-style-prop' });
        appearancePropertiesDiv.appendChild(formatTextStyleContainer);
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Formatting'), formatTextStyleContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_formatting');
        const fontItemsContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-items-container' });
        const fontFamilyDropdownContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-family-container' });
        const formatdropdownContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-format-font-family-prop' });
        fontFamilyDropdownContainer.appendChild(formatdropdownContainer);
        fontItemsContainer.appendChild(fontFamilyDropdownContainer);
        this.formFieldFontFamily = new DropDownList({ dataSource: fontFamilyItems, value: this.getFontFamily(selectedItem.fontFamily) ? selectedItem.fontFamily : 'Helvetica', cssClass: 'e-pv-properties-formfield-fontfamily' }, formatdropdownContainer);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Font family'), fontFamilyDropdownContainer);
        const fontSizeContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-size-container' });
        const fontSizeDropdownContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-format-font-family-prop' });
        fontSizeContainer.appendChild(fontSizeDropdownContainer);
        fontItemsContainer.appendChild(fontSizeContainer);
        this.formFieldFontSize = new DropDownList({ dataSource: fontSizeItems, value: selectedItem.fontSize + 'px', cssClass: 'e-pv-properties-formfield-fontsize' }, fontSizeDropdownContainer);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Font size'), fontSizeContainer);
        const fontStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-font-style' });
        fontStyleContainer.onclick = this.fontStyleClicked.bind(this);
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_bold', 'e-pv-bold-icon', selectedItem.font.isBold));
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_italic', 'e-pv-italic-icon', selectedItem.font.isItalic));
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_underline_textinput', 'e-pv-underlinetext-icon', selectedItem.font.isUnderline));
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_strikeout', 'e-pv-strikeout-icon', selectedItem.font.isStrikeout));
        fontItemsContainer.appendChild(fontStyleContainer);
        this.getFontStyle(selectedItem.font);
        appearancePropertiesDiv.appendChild(fontItemsContainer);
        const fontColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-color-container' });
        const fontAlignContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-font-align' });
        fontAlignContainer.onclick = this.fontAlignClicked.bind(this);
        const alignment: string = selectedItem.alignment.toLowerCase();
        fontAlignContainer.appendChild(this.addClassFontItem('_formField_left_align', 'e-pv-left-align-icon', alignment === 'left' ? true : false));
        fontAlignContainer.appendChild(this.addClassFontItem('_formField_center_align', 'e-pv-center-align-icon', alignment === 'center' ? true : false));
        fontAlignContainer.appendChild(this.addClassFontItem('_formField_right_align', 'e-pv-right-align-icon', alignment === 'right' ? true : false));
        this.getAlignment(alignment);
        fontColorContainer.appendChild(fontAlignContainer);
        this.fontColorElement = createElement('div', { className: 'e-pv-formfield-textcolor-icon', id: this.pdfViewer.element.id + 'formField_textColor' });
        this.fontColorElement.setAttribute('role', 'combobox');
        this.fontColorPalette = this.createColorPicker(this.fontColorElement.id, selectedItem.color);
        if (selectedItem.color !== 'black') {
            this.fontColorValue = selectedItem.color;
        } else {
            this.fontColorValue = null;
        }
        this.fontColorPalette.change = this.onFontColorChange.bind(this);
        this.fontColorDropDown = this.createDropDownButton(this.fontColorElement, 'e-pv-annotation-textcolor-icon', this.fontColorPalette.element.parentElement);
        fontColorContainer.appendChild(this.fontColorElement);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Font color'), this.fontColorDropDown.element);
        this.updateColorInIcon(this.fontColorElement, this.pdfViewer.selectedItems.formFields[0].color);
        if (selectedItem.formFieldAnnotationType === 'Checkbox' || selectedItem.formFieldAnnotationType === 'RadioButton') {
            this.fontColorPalette.disabled = true;
            this.fontColorDropDown.disabled = true;
            this.fontColorElement.style.pointerEvents = 'none';
            this.fontColorElement.style.opacity = '0.5';
            fontAlignContainer.style.pointerEvents = 'none';
            fontAlignContainer.style.opacity = '0.5';
            this.formFieldFontSize.enabled = false;
            this.formFieldFontFamily.enabled = false;
            fontFamilyDropdownContainer.style.pointerEvents = 'none';
            fontSizeContainer.style.pointerEvents = 'none';
            fontStyleContainer.style.pointerEvents = 'none';
            fontStyleContainer.style.opacity = '0.5';
        }
        const maxLengthGroup: HTMLElement = createElement('div', { className: 'e-pv-formfield-maxlength-group', id: this.pdfViewer.element.id + 'formField_maxlength_group' });
        const maxLengthContainer: HTMLElement = createElement('div', { className: 'e-pv-formfield-maxlength-icon', id: this.pdfViewer.element.id + 'formField_maxlength' });
        maxLengthGroup.appendChild(maxLengthContainer);
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Max Length'), maxLengthContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_maxlength');
        const maxLengthDropdownContainer: HTMLElement = createElement('div', { className: 'e-pv-formfield-maxlength', id: this.pdfViewer.element.id + 'formField_maxlength_container' });
        const maxLengthItemDropdown: HTMLElement = createElement('input', { className: 'e-pv-formfield-maxlength-input e-input' });
        maxLengthItemDropdown.setAttribute('aria-label', 'Max Length');
        maxLengthDropdownContainer.appendChild(maxLengthItemDropdown);
        maxLengthGroup.appendChild(maxLengthDropdownContainer);
        // Render the Numeric Textbox
        this.maxLengthItem = new NumericTextBox({ format: 'n', value: selectedItem.maxLength !== 0 ? selectedItem.maxLength : 0, min: 0 }, maxLengthItemDropdown as HTMLInputElement);
        fontColorContainer.appendChild(maxLengthGroup);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Max Length'), this.maxLengthItem.element);
        if (selectedItem.formFieldAnnotationType !== 'Textbox' && selectedItem.formFieldAnnotationType !== 'PasswordField') {
            this.maxLengthItem.enabled = false;
            maxLengthContainer.style.pointerEvents = 'none';
        }
        appearancePropertiesDiv.appendChild(fontColorContainer);
        const colorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-color-container-style-prop' });
        const backgroundColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-fill-color-style-prop' });
        appearancePropertiesDiv.appendChild(backgroundColorContainer);
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Fill'), backgroundColorContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_fontcolor');
        this.colorDropDownElement = createElement('div', { className: 'e-pv-formfield-fontcolor-icon', id: this.pdfViewer.element.id + 'formField_fontColor' });
        this.colorDropDownElement.setAttribute('role', 'combobox');
        this.colorPalette = this.createColorPicker(this.colorDropDownElement.id, selectedItem.backgroundColor);
        this.colorPalette.change = this.onColorPickerChange.bind(this);
        this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Fill Color'), this.colorDropDown.element);
        backgroundColorContainer.appendChild(this.colorDropDownElement);
        colorContainer.appendChild(backgroundColorContainer);
        this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.selectedItems.formFields[0].backgroundColor);
        const strokeColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-stroke-color-style-prop' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Border'), strokeColorContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_strokecolor');
        this.strokeDropDownElement = createElement('div', { className: 'e-pv-formfield-strokecolor-icon', id: this.pdfViewer.element.id + 'formField_strokeColor' });
        this.strokeDropDownElement.setAttribute('role', 'combobox');
        this.strokeColorPicker = this.createColorPicker(this.strokeDropDownElement.id, selectedItem.borderColor);
        this.strokeColorPicker.change = this.onStrokePickerChange.bind(this);
        this.strokeDropDown = this.createDropDownButton(this.strokeDropDownElement, 'e-pv-annotation-stroke-icon', this.strokeColorPicker.element.parentElement);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Border Color'), this.strokeDropDown.element);
        strokeColorContainer.appendChild(this.strokeDropDownElement);
        colorContainer.appendChild(strokeColorContainer);
        this.updateColorInIcon(this.strokeDropDownElement, this.pdfViewer.selectedItems.formFields[0].borderColor);
        const strokeThicknessContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-stroke-thickness-style-prop' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Thickness'), strokeThicknessContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_strokethickness');
        this.thicknessElement = createElement('div', { className: 'e-pv-formfield-strokethickness-icon', id: this.pdfViewer.element.id + 'formField_strokethickness' });
        this.thicknessElement.setAttribute('role', 'combobox');
        const thicknessContainer: HTMLElement = this.createThicknessSlider(this.thicknessElement.id);
        this.thicknessDropDown = this.createDropDownButton(this.thicknessElement, 'e-pv-annotation-thickness-icon', thicknessContainer);
        this.thicknessDropDown.beforeOpen = this.thicknessDropDownBeforeOpen.bind(this);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Thickness'), this.thicknessDropDown.element);
        this.thicknessSlider.change = this.thicknessChange.bind(this);
        this.thicknessSlider.changed = this.thicknessChange.bind(this);
        strokeThicknessContainer.appendChild(this.thicknessElement);
        colorContainer.appendChild(strokeThicknessContainer);
        appearancePropertiesDiv.appendChild(colorContainer);
        return appearancePropertiesDiv;
    }

    private thicknessChange(args: any): void {
        if (this.pdfViewer.selectedItems.formFields.length === 1) {
            this.formFieldBorderWidth = args.value;
            this.updateThicknessIndicator();
        }
    }

    private thicknessDropDownBeforeOpen(): void {
        if (this.pdfViewer.selectedItems.formFields.length === 1) {
            this.formFieldBorderWidth = this.pdfViewer.selectedItems.formFields[0].thickness.toString();
            this.thicknessSlider.value = this.pdfViewer.selectedItems.formFields[0].thickness;
        }
        this.updateThicknessIndicator();
    }

    private updateThicknessIndicator(): void {
        this.thicknessIndicator.textContent = this.thicknessSlider.value + ' pt';
    }

    private createOptionProperties(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const optionPropertiesDiv: HTMLElement = createElement('div', { id: elementID + '_option_prop_appearance' });
        const listItemAddContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-list-add-div' });
        const formFieldListItemMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-list-item-main-div' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('List Item'), formFieldListItemMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_listitem');
        const formFieldListItemDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-list-item-edit-prop' });
        const formFieldListItemContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-list-item-input e-input' });
        formFieldListItemContainer.setAttribute('aria-label', 'Item Name');
        formFieldListItemContainer.addEventListener('keyup', (args: KeyboardEvent) => {
            this.formFieldAddButton.disabled = true;
            this.formFieldListItem.value = (args.target as any).value;
            if (args.target && (args.target as any).value) {
                if (this.formFieldListItemCollection.length > 0) {
                    for (let i: number = 0; i < this.formFieldListItemCollection.length; i++) {
                        const itemName: string = this.formFieldListItemCollection[parseInt(i.toString(), 10)];
                        if (itemName === (args.target as any).value) {
                            this.formFieldAddButton.disabled = true;
                            break;
                        } else {
                            this.formFieldAddButton.disabled = false;
                        }
                    }
                } else {
                    this.formFieldAddButton.disabled = false;
                }
            }
        });
        formFieldListItemDiv.appendChild(formFieldListItemContainer);
        formFieldListItemMainDiv.appendChild(formFieldListItemDiv);
        this.formFieldListItem = new TextBox({ type: 'text', cssClass: 'e-pv-properties-formfield-listitem' }, (formFieldListItemContainer as HTMLInputElement));
        listItemAddContainer.appendChild(formFieldListItemMainDiv);
        optionPropertiesDiv.appendChild(listItemAddContainer);
        const buttonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-list-btn-div' });
        const buttonAddInput: HTMLElement = createElement('button', { className: 'e-btn' });
        buttonAddInput.addEventListener('click', this.addListItemOnClick.bind(this));
        buttonDiv.appendChild(buttonAddInput);
        this.formFieldAddButton = new Button({ content: this.pdfViewer.localeObj.getConstant('Add'), disabled: true, cssClass: 'e-pv-properties-dropdown-btn' }, buttonAddInput as HTMLButtonElement);
        listItemAddContainer.appendChild(buttonDiv);
        const exportValueContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-export-value-div' });
        const formFieldexportValueMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-export-value-main-div' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Export Value'), formFieldexportValueMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_exportValue');
        const formFieldExportItemDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-export-value-edit-prop' });
        const formFieldExportItemContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-export-value-input e-input' });
        formFieldExportItemContainer.setAttribute('aria-label', 'Item Value');
        formFieldExportItemDiv.appendChild(formFieldExportItemContainer);
        formFieldexportValueMainDiv.appendChild(formFieldExportItemDiv);
        this.formFieldListItem = new TextBox({ type: 'text', cssClass: 'e-pv-properties-formfield-exportvalue' }, (formFieldExportItemContainer as HTMLInputElement));
        exportValueContainer.appendChild(formFieldexportValueMainDiv);
        optionPropertiesDiv.appendChild(exportValueContainer);
        const dropdownListItemContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-option-dropdown-list-div' });
        const formFieldDropdownListMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-option-dropdown-list-item-div' });
        const selectedElement: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        if (selectedElement.formFieldAnnotationType === 'DropdownList') {
            this.createLabelElement(this.pdfViewer.localeObj.getConstant('Dropdown Item List'), formFieldDropdownListMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_dropdown_listitem');
        } else {
            this.createLabelElement(this.pdfViewer.localeObj.getConstant('List Box Item List'), formFieldDropdownListMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_dropdown_listitem');
        }
        dropdownListItemContainer.appendChild(formFieldDropdownListMainDiv);
        const btnTextAreaContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-btn-textarea-container' });
        const textAreaContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-formfield-textarea', styles: 'width:300px;height:123px;border:1px solid #E0E0E0;margin-right:15px;overflow:auto' });
        const listElement: HTMLElement = createElement('ul', { id: this.pdfViewer.element.id + '_ul_list_item', className: 'e-pv-form-designer-ul-list-items' });
        const listCount: number = this.createListElement(listElement);
        textAreaContainer.appendChild(listElement);
        btnTextAreaContainer.appendChild(textAreaContainer);
        const buttonGroup: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-group-btn-div' });
        const deleteButtonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-delete-btn-div' });
        const buttonDeleteInput: HTMLElement = createElement('button', { className: 'e-btn' });
        buttonDeleteInput.addEventListener('click', this.deleteListItem.bind(this));
        deleteButtonDiv.appendChild(buttonDeleteInput);
        this.formFieldDeleteButton = new Button({ content: this.pdfViewer.localeObj.getConstant('Delete Item'), disabled: listCount > 0 ? false : true, cssClass: 'e-pv-properties-dropdown-btn' }, buttonDeleteInput as HTMLButtonElement);
        buttonGroup.appendChild(deleteButtonDiv);
        const upButtonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-up-btn-div' });
        const buttonUpInput: HTMLElement = createElement('button', { className: 'e-btn' });
        buttonUpInput.addEventListener('click', this.moveUpListItem.bind(this));
        upButtonDiv.appendChild(buttonUpInput);
        this.formFieldUpButton = new Button({ content: this.pdfViewer.localeObj.getConstant('Up'), disabled: listCount > 1 ? false : true, cssClass: 'e-pv-properties-dropdown-btn' }, buttonUpInput as HTMLButtonElement);
        buttonGroup.appendChild(upButtonDiv);
        const downButtonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-down-btn-div' });
        const buttonDownInput: HTMLElement = createElement('button', { className: 'e-btn' });
        buttonDownInput.addEventListener('click', this.moveDownListItem.bind(this));
        downButtonDiv.appendChild(buttonDownInput);
        this.formFieldDownButton = new Button({ content: this.pdfViewer.localeObj.getConstant('Down'), disabled: true, cssClass: 'e-pv-properties-dropdown-btn' }, buttonDownInput as HTMLButtonElement);
        buttonGroup.appendChild(downButtonDiv);
        btnTextAreaContainer.appendChild(buttonGroup);
        dropdownListItemContainer.appendChild(btnTextAreaContainer);
        optionPropertiesDiv.appendChild(dropdownListItemContainer);
        return optionPropertiesDiv;
    }

    private addListItemOnClick(): void {
        const dropdownValue: string = this.formFieldListItem.value;
        this.formFieldListItemCollection.push(dropdownValue);
        const ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                const element: Element = ulElement.children[parseInt(i.toString(), 10)];
                if (element.classList.contains('e-pv-li-select')) {
                    element.classList.remove('e-pv-li-select');
                }
            }
        }
        const createLiElement: HTMLElement = createElement('li', { className: 'e-pv-formfield-li-element' });
        createLiElement.addEventListener('click', this.listItemOnClick.bind(this));
        createLiElement.innerHTML = dropdownValue;
        createLiElement.classList.add('e-pv-li-select');
        ulElement.appendChild(createLiElement);
        this.formFieldDeleteButton.disabled = false;
        this.formFieldAddButton.disabled = true;
        if (createLiElement.previousElementSibling) {
            this.formFieldUpButton.disabled = false;
        }
        if (!createLiElement.nextElementSibling) {
            this.formFieldDownButton.disabled = true;
        }
    }

    private listItemOnClick(args: any): void {
        const ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                const element: Element = ulElement.children[parseInt(i.toString(), 10)];
                if (element.classList.contains('e-pv-li-select')) {
                    element.classList.remove('e-pv-li-select');
                }
            }
        }
        if (args.target) {
            args.target.classList.add('e-pv-li-select');
        }
        if (args.target.nextElementSibling) {
            this.formFieldDownButton.disabled = false;
        } else {
            this.formFieldDownButton.disabled = true;
        }
        if (args.target.previousElementSibling) {
            this.formFieldUpButton.disabled = false;
        } else {
            this.formFieldUpButton.disabled = true;
        }
    }

    private deleteListItem(): void {
        const ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                const element: Element = ulElement.children[parseInt(i.toString(), 10)];
                if (element.classList.contains('e-pv-li-select')) {
                    element.classList.remove('e-pv-li-select');
                    this.formFieldListItemCollection.splice(i, 1);
                    if (element.previousElementSibling) {
                        element.previousElementSibling.classList.add('e-pv-li-select');
                        if (!element.previousElementSibling.previousElementSibling) {
                            this.formFieldUpButton.disabled = true;
                        }
                    }
                    else if (element.nextElementSibling) {
                        element.nextElementSibling.classList.add('e-pv-li-select');
                        if (!element.nextElementSibling.nextElementSibling) {
                            this.formFieldDownButton.disabled = true;
                        }
                    }
                    element.remove();
                }
            }
        }
        if (ulElement.children && ulElement.children.length === 0) {
            this.formFieldDeleteButton.disabled = true;
            this.formFieldUpButton.disabled = true;
            this.formFieldDownButton.disabled = true;
        }
        if (ulElement.children && ulElement.children.length === 1) {
            this.formFieldDeleteButton.disabled = false;
            this.formFieldUpButton.disabled = true;
            this.formFieldDownButton.disabled = true;
        }
    }

    private moveUpListItem(): void {
        const ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                const element: Element = ulElement.children[parseInt(i.toString(), 10)];
                if (element.classList.contains('e-pv-li-select')) {
                    if (element.previousElementSibling) {
                        element.parentNode.insertBefore(element, element.previousElementSibling);
                        if (!element.previousElementSibling)
                        {this.formFieldUpButton.disabled = true; }
                    }
                    else {
                        this.formFieldUpButton.disabled = true;
                    }
                    if (element.nextElementSibling) {
                        this.formFieldDownButton.disabled = false;
                    }
                }
            }
        }
    }

    private moveDownListItem(): void {
        let element: any;
        const ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                element = ulElement.children[parseInt(i.toString(), 10)];
                if (element.classList.contains('e-pv-li-select')) {
                    if (element.nextElementSibling) {
                        element.parentNode.insertBefore(element.nextElementSibling, element);
                        break;
                    }
                    else {
                        this.formFieldDownButton.disabled = true;
                    }
                }
            }
        }
        if (!element.nextElementSibling) {
            this.formFieldDownButton.disabled = true;
        }
        if (element.previousElementSibling) {
            this.formFieldUpButton.disabled = false;
        }
    }

    private createListElement(ulElement: HTMLElement): number {
        const selectedElement: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        if (selectedElement) {
            if (selectedElement.options && selectedElement.options.length > 0) {
                for (let i: number = 0; i < selectedElement.options.length; i++) {
                    const dropdownValue: string = selectedElement.options[parseInt(i.toString(), 10)].itemName;
                    if (this.formFieldListItemCollection[parseInt(i.toString(), 10)] !==
                    selectedElement.options[parseInt(i.toString(), 10)].itemName) {
                        this.formFieldListItemCollection.push(dropdownValue);
                        const createLiElement: HTMLElement = createElement('li', { className: 'e-pv-formfield-li-element' });
                        createLiElement.addEventListener('click', this.listItemOnClick.bind(this));
                        createLiElement.addEventListener('focus', this.focusFormFields.bind(this));
                        createLiElement.addEventListener('blur', this.blurFormFields.bind(this));
                        createLiElement.innerHTML = dropdownValue;
                        ulElement.appendChild(createLiElement);
                    }
                }
                ulElement.children[ulElement.children.length - 1].classList.add('e-pv-li-select');
            }
        }
        return ulElement.children.length;
    }

    private createThicknessSlider(idString: string): HTMLElement {
        const outerContainer: HTMLElement = createElement('div', { className: 'e-pv-annotation-thickness-popup-container' });
        document.body.appendChild(outerContainer);
        const label: HTMLElement = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-thickness-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Line Thickness');
        const sliderElement: HTMLElement = createElement('div', { id: idString + '_slider' });
        this.thicknessSlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-annotation-thickness-slider', max: 12, min: 0 });
        this.thicknessIndicator = createElement('div', { id: idString + '_thickness_indicator', className: 'e-pv-annotation-thickness-indicator' });
        this.thicknessIndicator.textContent = '0 pt';
        if (!this.pdfViewer.enableRtl) {
            outerContainer.appendChild(label);
            outerContainer.appendChild(sliderElement);
            this.thicknessSlider.appendTo(sliderElement);
            outerContainer.appendChild(this.thicknessIndicator);
        } else {
            outerContainer.appendChild(this.thicknessIndicator);
            outerContainer.appendChild(sliderElement);
            this.thicknessSlider.enableRtl = true;
            this.thicknessSlider.appendTo(sliderElement);
            outerContainer.appendChild(label);
        }
        this.thicknessSlider.element.parentElement.classList.add('e-pv-annotation-thickness-slider-container');
        return outerContainer;
    }

    private createColorPicker(idString: string, color: string): ColorPicker {
        const inputElement: HTMLElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            inline: true, mode: 'Palette', cssClass: 'e-show-value', enableOpacity: false,
            value: color, showButtons: false, modeSwitcher: false
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    }

    private fontStyleClicked(args: any): void {
        if (args.target) {
            if (args.target.id.indexOf('formField_bold') !== -1) {
                const item: any = (args.target.id.indexOf('formField_bold_div') !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                {this.isBold = true; }
                this.isBold = !this.isBold;
                if (this.isBold) {
                    this.formFieldBold = 'bold';
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldBold = 'normal';
                    item.classList.remove('e-pv-li-select');
                }
            } else if (args.target.id.indexOf('formField_italic') !== -1) {
                const item: any = (args.target.id.indexOf('formField_italic_div') !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                {this.isItalic = true; }
                this.isItalic = !this.isItalic;
                if (this.isItalic) {
                    this.formFieldItalic = 'italic';
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldItalic = 'normal';
                    item.classList.remove('e-pv-li-select');
                }
            } else if (args.target.id.indexOf('formField_underline') !== -1) {
                const item: any = (args.target.id.indexOf('formField_underline_textinput_div') !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                {this.isUnderline = true; }
                this.isUnderline = !this.isUnderline;
                if (this.isUnderline) {
                    this.formFieldUnderline = 'underline';
                    this.isStrikeThrough = false;
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldUnderline = 'none';
                    item.classList.remove('e-pv-li-select');
                }
            } else if (args.target.id.indexOf('formField_strikeout') !== -1) {
                const item: any = (args.target.id.indexOf('formField_strikeout_div') !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                {this.isStrikeThrough = true; }
                this.isStrikeThrough = !this.isStrikeThrough;
                if (this.isStrikeThrough) {
                    this.formFieldStrikeOut = 'line-through';
                    this.isUnderline = false;
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldStrikeOut = 'none';
                    item.classList.remove('e-pv-li-select');
                }
            }
        }
    }

    private clearFontAlignIconSelection(currentElement: HTMLElement): void {
        for (let i: number = 0; i < currentElement.children.length; i++) {
            if (currentElement.children[parseInt(i.toString(), 10)].classList.contains('e-pv-li-select')) {
                currentElement.children[parseInt(i.toString(), 10)].classList.remove('e-pv-li-select');
            }
        }
    }

    private fontAlignClicked(args: any): void {
        if (args.target) {
            args.target.classList.remove('e-pv-li-select');
            if (args.target.id.indexOf('_formField_left_align') !== -1) {
                const item: any = (args.target.id.indexOf('_formField_left_align_div') !== -1) ? args.target : args.target.parentElement;
                this.formFieldAlign = 'left';
                this.clearFontAlignIconSelection(args.currentTarget);
                item.classList.add('e-pv-li-select');
            } else if (args.target.id.indexOf('_formField_right_align') !== -1) {
                const item: any = (args.target.id.indexOf('_formField_right_align_div') !== -1) ? args.target : args.target.parentElement;
                this.formFieldAlign = 'right';
                this.clearFontAlignIconSelection(args.currentTarget);
                item.classList.add('e-pv-li-select');
            } else {
                const item: any = (args.target.id.indexOf('_formField_center_align_div') !== -1) ? args.target : args.target.parentElement;
                this.formFieldAlign = 'center';
                this.clearFontAlignIconSelection(args.currentTarget);
                item.classList.add('e-pv-li-select');

            }
        }
    }

    private onFontColorChange(args: any): void {
        this.fontColorValue = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        this.updateColorInIcon(this.fontColorElement, this.fontColorValue);
        this.fontColorDropDown.toggle();
    }

    private onColorPickerChange(args: any): void {
        this.backgroundColorValue = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        this.updateColorInIcon(this.colorDropDownElement, this.backgroundColorValue);
        this.colorDropDown.toggle();
    }

    /**
     * @param {HTMLElement} element - It describes about the element
     * @param {string} color - It describes about the color
     * @private
     * @returns {void}
     */
    public updateColorInIcon(element: HTMLElement, color: string): void {
        (element.childNodes[0] as HTMLElement).style.borderBottomColor = color;
    }

    private onStrokePickerChange(args: any): void {
        this.borderColorValue = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        this.updateColorInIcon(this.strokeDropDownElement, this.borderColorValue);
        this.strokeDropDown.toggle();
    }

    private createDropDownButton(element: HTMLElement, iconClass: string, target: HTMLElement): DropDownButton {
        const popup: HTMLElement = document.getElementById(target.id + '-popup');
        if (popup){
            popup.remove();
        }
        const dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        return dropDownButton;
    }

    /**
     * @param {string} idString - It describes about the id string
     * @param {string} className - It describes about the class name
     * @param {boolean} isSelectedStyle - It describes about the isSelectedStyle
     * @private
     * @returns {HTMLElement} - html element
     */
    public addClassFontItem(idString: string, className: string, isSelectedStyle?: boolean): HTMLElement {
        const element: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + idString + '_div' });
        element.classList.add(className + '-div');
        const spanElement: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + idString + '_span' });
        spanElement.classList.add(className);
        spanElement.classList.add('e-pv-icon');
        switch (className) {
        case 'e-pv-bold-icon':
            this.setToolTip(this.pdfViewer.localeObj.getConstant('Bold'), element);
            break;
        case 'e-pv-italic-icon':
            this.setToolTip(this.pdfViewer.localeObj.getConstant('Italic'), element);
            break;
        case 'e-pv-underlinetext-icon':
            this.setToolTip(this.pdfViewer.localeObj.getConstant('Underlines'), element);
            break;
        case 'e-pv-strikeout-icon':
            this.setToolTip(this.pdfViewer.localeObj.getConstant('Strikethroughs'), element);
            break;
        case 'e-pv-left-align-icon':
            this.setToolTip(this.pdfViewer.localeObj.getConstant('Align left'), element);
            break;
        case 'e-pv-center-align-icon':
            this.setToolTip(this.pdfViewer.localeObj.getConstant('Center'), element);
            break;
        case 'e-pv-right-align-icon':
            this.setToolTip(this.pdfViewer.localeObj.getConstant('Align right'), element);
            break;
        }
        if (isSelectedStyle)
        {element.classList.add('e-pv-li-select'); }
        element.appendChild(spanElement);
        return element;
    }

    private createLabelElement(labelText: string, parentElement: HTMLElement, isLabelNeeded: boolean,
                               className: string, idString: string): void {
        const container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        let label: HTMLElement = null;
        if (isLabelNeeded) {
            label = createElement('div', { id: idString + '_label', className: className });
            label.textContent = labelText;
            container.appendChild(label);
        }
        parentElement.appendChild(label);
    }

    private setReadOnlyToFormField(selectedItem: PdfFormFieldBaseModel, isReadOnly: any): void {
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            const formField: PdfFormFieldBaseModel =
            this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
            if (formField.formFieldAnnotationType === selectedItem.formFieldAnnotationType &&
                formField.name === selectedItem.name && formField.id === selectedItem.id) {
                formField.isReadonly = isReadOnly;
                switch (formField.formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                case 'DropdownList':
                case 'ListBox':
                case 'SignatureField':
                case 'InitialField':
                case 'RadioButton': {
                    const inputElement: Element = document.getElementById(formField.id + '_content_html_element').firstElementChild.firstElementChild;
                    this.setReadOnlyToElement(formField, inputElement, isReadOnly);
                    break;
                }
                case 'Checkbox': {
                    const checkboxDivElement: Element = document.getElementById(formField.id + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
                    this.setReadOnlyToElement(formField, checkboxDivElement, isReadOnly);
                    break;
                }
                }
            }
        }
    }

    /**
     * @param {any} signatureFieldCollection - It describes about the signature field collection
     * @private
     * @returns {any} - any
     */
    public getFormDesignerSignField(signatureFieldCollection: any): any[] {
        const collectiondata: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        let dataCollection: any;
        for (let i: number = 0; i < collectiondata.length; i++) {
            dataCollection = collectiondata[parseInt(i.toString(), 10)].type;
            if (dataCollection === 'SignatureField' || dataCollection === 'InitialField') {
                signatureFieldCollection.push(collectiondata[parseInt(i.toString(), 10)]);
            }
        }
        return signatureFieldCollection;
    }

    private setRequiredToFormField(selectedItem: PdfFormFieldBaseModel, isRequired: boolean): void {
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            const formField: PdfFormFieldBaseModel =
            this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
            if (formField.formFieldAnnotationType === selectedItem.formFieldAnnotationType &&
                formField.name === selectedItem.name && formField.id === selectedItem.id) {
                formField.isRequired = isRequired;
                switch (formField.formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                case 'DropdownList':
                case 'SignatureField':
                case 'InitialField': {
                    const inputElement: Element = document.getElementById(formField.id + '_content_html_element').firstElementChild.firstElementChild;
                    this.setRequiredToElement(formField, inputElement, isRequired);
                    break;
                }
                case 'RadioButton': {
                    const radioButtonDivDivElement: Element = document.getElementById(formField.id + '_content_html_element').firstElementChild.firstElementChild.firstElementChild;
                    this.setRequiredToElement(formField, radioButtonDivDivElement, isRequired);
                    this.updateFormFieldCollections(formField);
                    break;
                }
                case 'Checkbox': {
                    const checkboxDivElement: Element = document.getElementById(formField.id + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
                    this.setRequiredToElement(formField, checkboxDivElement, isRequired);
                    break;
                }
                default:
                    break;
                }
            }
        }
    }

    // Implemented this method to verify the background color of the selected item. Task: 855151
    private isTransparentBackground(backgroundColor: any): boolean {
        if (typeof (backgroundColor) === 'object') {
            backgroundColor = JSON.stringify(backgroundColor);
        }
        return backgroundColor === '#00000000' || backgroundColor === 'transparent' || backgroundColor === 'rgba(0,0,0,0)' || backgroundColor === '{"r":0,"g":0,"b":0,"a":0}';
    }

    private setReadOnlyToElement(selectedItem: PdfFormFieldBaseModel, inputElement: any, isReadOnly: boolean): void {
        const fillColor: string = '#daeaf7ff';
        const color: any = {r: 218, g: 234, b: 247, a: 100};
        if (selectedItem.formFieldAnnotationType === 'DropdownList' || selectedItem.formFieldAnnotationType === 'ListBox') {
            (inputElement as any).parentElement.style.backgroundColor = (inputElement as any).style.backgroundColor;
        }
        if (!isReadOnly && (inputElement as any).disabled) {
            (inputElement as any).disabled = false;
        }
        if (isReadOnly) {
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                (inputElement as any).parentElement.style.cursor = 'default';
            }
            else if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
                const thickness: number = !isNullOrUndefined(selectedItem.thickness) ? 1 : selectedItem.thickness;
                inputElement.parentElement.style.borderWidth = thickness;
            }
            else {
                inputElement.style.cursor = 'default';
            }
        }
        if (isReadOnly && this.isAddFormFieldProgrammatically) {
            this.previousBackgroundColor = selectedItem.backgroundColor;
        }
        if (selectedItem.formFieldAnnotationType === 'RadioButton') {
            (inputElement as any).style.backgroundColor = selectedItem.isReadonly ? ((selectedItem.backgroundColor !== fillColor &&
                JSON.stringify(selectedItem.backgroundColor) !== JSON.stringify(color)) ? selectedItem.backgroundColor : 'transparent') :
                (this.isTransparentBackground(selectedItem.backgroundColor) ? fillColor : selectedItem.backgroundColor);
        }
        else if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
            if (!isNullOrUndefined(selectedItem) && selectedItem.value === '') {
                const background: string = selectedItem.backgroundColor ? selectedItem.backgroundColor : '#FFE48559';
                (inputElement as any).parentElement.style.backgroundColor = isReadOnly ?
                    background : PdfViewerUtils.setTransparencyToHex(background);
            }
        }
        else {
            inputElement.style.backgroundColor = selectedItem.isReadonly ? (selectedItem.backgroundColor !== fillColor ? selectedItem.backgroundColor : 'transparent') : (this.isTransparentBackground(selectedItem.backgroundColor) ? fillColor : (selectedItem.backgroundColor !== this.previousBackgroundColor) ? selectedItem.backgroundColor : this.previousBackgroundColor);
        }
        // Have configured the backgroundColor of the selectedItem to ensure that transparency is maintained when downloading and loading in the viewer. Task: 855151
        selectedItem.backgroundColor = selectedItem.isReadonly ?
            ((selectedItem.backgroundColor !== fillColor && JSON.stringify(selectedItem.backgroundColor) !== JSON.stringify(color)) ? selectedItem.backgroundColor : 'transparent') :
            (this.isTransparentBackground(selectedItem.backgroundColor) ?
                fillColor : (selectedItem.backgroundColor !== this.previousBackgroundColor) ?
                    selectedItem.backgroundColor : this.previousBackgroundColor);
    }

    private setRequiredToElement(selectedItem: PdfFormFieldBaseModel, inputElement: any, isRequired: boolean): void {
        if (isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                const thickness: number = selectedItem.thickness === 0 ? 1 : selectedItem.thickness;
                (inputElement as any).parentElement.style.boxShadow = 'red 0px 0px 0px ' + thickness + 'px';
            }
            else if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
                const thickness: number = (selectedItem.thickness > 0) ? selectedItem.thickness : 1;
                inputElement.style.border = thickness + 'px solid red';
            }
        } else {
            (inputElement as HTMLInputElement).required = false;
            if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
                inputElement.style.borderWidth = selectedItem.thickness;
            }
            else {
                inputElement.style.borderWidth = selectedItem.thickness + 'px';
            }
            inputElement.style.borderColor = selectedItem.borderColor;
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                (inputElement as any).parentElement.style.boxShadow = selectedItem.borderColor + ' 0px 0px 0px ' + selectedItem.thickness + 'px';
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroyPropertiesWindow(): void {
        this.formFieldListItemCollection = [];
        this.formFieldListItemDataSource = [];
        this.formFieldFontFamily = null;
        this.formFieldFontSize = null;
        this.formFieldAlign = null;
        this.fontColorValue = null;
        this.backgroundColorValue = null;
        this.borderColorValue = null;
        this.formFieldBorderWidth = null;
        this.formFieldName = null;
        this.formFieldChecked = null;
        this.formFieldReadOnly = null;
        this.formFieldRequired = null;
        this.formFieldTooltip = null;
        this.formFieldPrinting = null;
        this.formFieldMultiline = null;
        this.formFieldVisibility = null;
        if (this.strokeColorPicker) {
            this.strokeColorPicker.destroy();
            this.strokeColorPicker = null;
        }
        if (this.strokeDropDown) {
            this.strokeDropDown.destroy();
            this.strokeDropDown = null;
        }
        if (this.strokeDropDownElement) {
            this.strokeDropDownElement = null;
        }
        if (this.colorDropDownElement) {
            this.colorDropDownElement = null;
        }
        if (this.colorPalette) {
            this.colorPalette.destroy();
            this.colorPalette = null;
        }
        if (this.colorDropDown) {
            this.colorDropDown.destroy();
            this.colorDropDown = null;
        }
        if (this.thicknessElement) {
            this.thicknessElement = null;
        }
        if (this.thicknessDropDown) {
            this.thicknessDropDown.destroy();
            this.thicknessDropDown = null;
        }
        if (this.fontColorDropDown) {
            this.fontColorDropDown.destroy();
            this.fontColorDropDown = null;
        }
        if (this.fontColorPalette) {
            this.fontColorPalette.destroy();
            this.fontColorPalette = null;
        }
        if (this.maxLengthItem) {
            this.maxLengthItem.destroy();
            this.maxLengthItem = null;
        }
        const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_properties_window');
        if (dialogElement) {
            dialogElement.parentElement.removeChild(dialogElement);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.destroyPropertiesWindow();
        if (this.formFieldTooltips != null) {
            for (let i: number = 0; i < this.formFieldTooltips.length; i++) {
                this.formFieldTooltips[parseInt(i.toString(), 10)].destroy();
            }
            this.formFieldTooltips = [];
        }
    }

    private hex(x: number): string {
        return ('0' + x.toString(16)).slice(-2);
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'FormDesigner';
    }

    private updateAnnotationCanvas(canvas: any, pageWidth: number, pageHeight: number, pageNumber: number): void {
        const ratio: number = this.pdfViewerBase.getZoomRatio();
        canvas.width = pageWidth * ratio;
        canvas.height = pageHeight * ratio;
        canvas.style.width = pageWidth + 'px';
        canvas.style.height = pageHeight + 'px';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '1';
        this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
    }

    private getFontFamily(fontFamily: any): boolean {
        const fontFamilyNames: string[] = ['Helvetica', 'Courier', 'Times New Roman', 'Symbol', 'ZapfDingbats'];
        return fontFamilyNames.indexOf(fontFamily) > -1 ? true : false;
    }

    private updateTextFieldSettingProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean,
                                             isSetFormFieldMode: boolean): void {
        const textFieldSettings: any = this.pdfViewer.textFieldSettings;
        if (!isNullOrUndefined(textFieldSettings.isReadOnly) && this.textFieldPropertyChanged.isReadOnlyChanged) {
            drawingObject.isReadonly = textFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(textFieldSettings.isRequired) && this.textFieldPropertyChanged.isRequiredChanged) {
            drawingObject.isRequired = textFieldSettings.isRequired;
        }
        if (textFieldSettings.value && this.textFieldPropertyChanged.isValueChanged) {
            drawingObject.value = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(textFieldSettings.value) : textFieldSettings.value;
        }
        if ((textFieldSettings.backgroundColor && textFieldSettings.backgroundColor !== 'white') && this.textFieldPropertyChanged.isBackgroundColorChanged) {
            drawingObject.backgroundColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(textFieldSettings.backgroundColor) : textFieldSettings.backgroundColor;
        }
        if ((textFieldSettings.borderColor && textFieldSettings.borderColor !== 'black') && this.textFieldPropertyChanged.isBorderColorChanged) {
            drawingObject.borderColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(textFieldSettings.borderColor) : textFieldSettings.borderColor;
        }
        if ((textFieldSettings.alignment && textFieldSettings.alignment !== 'Left') && this.textFieldPropertyChanged.isAlignmentChanged) {
            drawingObject.alignment = textFieldSettings.alignment;
        }
        if ((textFieldSettings.color && textFieldSettings.color !== 'black') &&
        this.textFieldPropertyChanged.isColorChanged) {
            drawingObject.color = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(textFieldSettings.color) : textFieldSettings.color;
        }
        if ((textFieldSettings.fontFamily && textFieldSettings.fontFamily !== 'Helvetica') && this.textFieldPropertyChanged.isFontFamilyChanged) {
            drawingObject.fontFamily = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(textFieldSettings.fontFamily) : textFieldSettings.fontFamily;
        }
        if ((textFieldSettings.fontSize && textFieldSettings.fontSize !== 10) && this.textFieldPropertyChanged.isFontSizeChanged) {
            drawingObject.fontSize = textFieldSettings.fontSize;
        }
        if (textFieldSettings.fontStyle && this.textFieldPropertyChanged.isFontStyleChanged) {
            (drawingObject as any).fontStyle = this.getFontStyleName(textFieldSettings.fontStyle, drawingObject);
        }
        if (textFieldSettings.name && this.textFieldPropertyChanged.isNameChanged) {
            drawingObject.name = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(textFieldSettings.name) : textFieldSettings.name;
        }
        if (textFieldSettings.tooltip && this.textFieldPropertyChanged.isToolTipChanged) {
            drawingObject.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(textFieldSettings.tooltip) : textFieldSettings.tooltip;
        }
        if ((textFieldSettings.thickness && textFieldSettings.thickness !== 1) && this.textFieldPropertyChanged.isThicknessChanged) {
            drawingObject.thickness = textFieldSettings.thickness;
        }
        if (textFieldSettings.maxLength && this.textFieldPropertyChanged.isMaxLengthChanged) {
            drawingObject.maxLength = textFieldSettings.maxLength;
        }
        if (textFieldSettings.visibility && this.textFieldPropertyChanged.isVisibilityChanged) {
            drawingObject.visibility = textFieldSettings.visibility;
        }
        if (!isNullOrUndefined(textFieldSettings.isPrint) && this.textFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = textFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(textFieldSettings.isMultiline) && this.textFieldPropertyChanged.isMultilineChanged) {
            drawingObject.isMultiline = textFieldSettings.isMultiline;
        }
        if (!isNullOrUndefined(textFieldSettings.customData) && this.textFieldPropertyChanged.isCustomDataChanged) {
            drawingObject.customData = textFieldSettings.customData;
        }
    }

    private updatePasswordFieldSettingProperties(drawingObject: PdfFormFieldBaseModel,
                                                 isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const passwordFieldSettings: any = this.pdfViewer.passwordFieldSettings;
        if (!isNullOrUndefined(passwordFieldSettings.isReadOnly) && this.passwordFieldPropertyChanged.isReadOnlyChanged) {
            drawingObject.isReadonly = passwordFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(passwordFieldSettings.isRequired) && this.passwordFieldPropertyChanged.isRequiredChanged) {
            drawingObject.isRequired = passwordFieldSettings.isRequired;
        }
        if (passwordFieldSettings.value && this.passwordFieldPropertyChanged.isValueChanged) {
            drawingObject.value = passwordFieldSettings.value;
        }
        if ((passwordFieldSettings.backgroundColor && passwordFieldSettings.backgroundColor !== 'white') && this.passwordFieldPropertyChanged.isBackgroundColorChanged) {
            drawingObject.backgroundColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(passwordFieldSettings.backgroundColor) : passwordFieldSettings.backgroundColor;
        }
        if ((passwordFieldSettings.borderColor && passwordFieldSettings.borderColor !== 'black') && this.passwordFieldPropertyChanged.isBorderColorChanged) {
            drawingObject.borderColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(passwordFieldSettings.borderColor) : passwordFieldSettings.borderColor;
        }
        if ((passwordFieldSettings.alignment && passwordFieldSettings.alignment !== 'Left') && this.passwordFieldPropertyChanged.isAlignmentChanged) {
            drawingObject.alignment = passwordFieldSettings.alignment;
        }
        if ((passwordFieldSettings.color && passwordFieldSettings.color !== 'black') && this.passwordFieldPropertyChanged.isColorChanged) {
            drawingObject.color = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(passwordFieldSettings.color) : passwordFieldSettings.color;
        }
        if ((passwordFieldSettings.fontFamily && passwordFieldSettings.fontFamily !== 'Helvetica') && this.passwordFieldPropertyChanged.isFontFamilyChanged) {
            drawingObject.fontFamily = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(passwordFieldSettings.fontFamily) : passwordFieldSettings.fontFamily;
        }
        if ((passwordFieldSettings.fontSize && passwordFieldSettings.fontSize !== 10) &&
        this.passwordFieldPropertyChanged.isFontSizeChanged) {
            drawingObject.fontSize = passwordFieldSettings.fontSize;
        }
        if (passwordFieldSettings.fontStyle && this.passwordFieldPropertyChanged.isFontStyleChanged) {
            (drawingObject as any).fontStyle = this.getFontStyleName(passwordFieldSettings.fontStyle, drawingObject);
        }
        if (passwordFieldSettings.name && this.passwordFieldPropertyChanged.isNameChanged) {
            drawingObject.name = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(passwordFieldSettings.name) : passwordFieldSettings.name;
        }
        if (passwordFieldSettings.tooltip && this.passwordFieldPropertyChanged.isToolTipChanged) {
            drawingObject.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(passwordFieldSettings.tooltip) : passwordFieldSettings.tooltip;
        }
        if ((passwordFieldSettings.thickness && passwordFieldSettings.thickness !== 1) &&
        this.passwordFieldPropertyChanged.isThicknessChanged) {
            drawingObject.thickness = passwordFieldSettings.thickness;
        }
        if (passwordFieldSettings.maxLength && this.passwordFieldPropertyChanged.isMaxLengthChanged) {
            drawingObject.maxLength = passwordFieldSettings.maxLength;
        }
        if (passwordFieldSettings.visibility && this.passwordFieldPropertyChanged.isVisibilityChanged) {
            drawingObject.visibility = passwordFieldSettings.visibility;
        }
        if (!isNullOrUndefined(passwordFieldSettings.isPrint) && this.passwordFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = passwordFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(passwordFieldSettings.customData) && this.passwordFieldPropertyChanged.isCustomDataChanged) {
            drawingObject.customData = passwordFieldSettings.customData;
        }
    }

    private updateCheckBoxFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel,
                                                  isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const checkBoxFieldSettings: any = this.pdfViewer.checkBoxFieldSettings;
        if (!isNullOrUndefined(checkBoxFieldSettings.isReadOnly) && this.checkBoxFieldPropertyChanged.isReadOnlyChanged) {
            drawingObject.isReadonly = checkBoxFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.isRequired) && this.checkBoxFieldPropertyChanged.isRequiredChanged) {
            drawingObject.isRequired = checkBoxFieldSettings.isRequired;
        }
        if (checkBoxFieldSettings.value && this.checkBoxFieldPropertyChanged.isValueChanged) {
            drawingObject.value = checkBoxFieldSettings.value;
        }
        if ((checkBoxFieldSettings.backgroundColor && checkBoxFieldSettings.backgroundColor !== 'white') && this.checkBoxFieldPropertyChanged.isBackgroundColorChanged) {
            drawingObject.backgroundColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(checkBoxFieldSettings.backgroundColor) : checkBoxFieldSettings.backgroundColor;
        }
        if ((checkBoxFieldSettings.borderColor && checkBoxFieldSettings.borderColor !== 'black') && this.checkBoxFieldPropertyChanged.isBorderColorChanged) {
            drawingObject.borderColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(checkBoxFieldSettings.borderColor) : checkBoxFieldSettings.borderColor;
        }
        if (checkBoxFieldSettings.name && this.checkBoxFieldPropertyChanged.isNameChanged) {
            drawingObject.name = SanitizeHtmlHelper.sanitize(checkBoxFieldSettings.name);
        }
        if (checkBoxFieldSettings.tooltip && this.checkBoxFieldPropertyChanged.isToolTipChanged) {
            drawingObject.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(checkBoxFieldSettings.tooltip) : checkBoxFieldSettings.tooltip;
        }
        if ((checkBoxFieldSettings.thickness && checkBoxFieldSettings.thickness !== 1) &&
        this.checkBoxFieldPropertyChanged.isThicknessChanged) {
            drawingObject.thickness = checkBoxFieldSettings.thickness;
        }
        if (checkBoxFieldSettings.visibility && this.checkBoxFieldPropertyChanged.isVisibilityChanged) {
            drawingObject.visibility = checkBoxFieldSettings.visibility;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.isPrint) && this.checkBoxFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = checkBoxFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.isChecked) && this.checkBoxFieldPropertyChanged.isCheckedChanged) {
            drawingObject.isChecked = checkBoxFieldSettings.isChecked;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.customData) && this.checkBoxFieldPropertyChanged.isCustomDataChanged) {
            drawingObject.customData = checkBoxFieldSettings.customData;
        }
    }

    private updateRadioButtonFieldSettingProperties(drawingObject: PdfFormFieldBaseModel,
                                                    isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const radioButtonFieldSettings: any = this.pdfViewer.radioButtonFieldSettings;
        if (!isNullOrUndefined(radioButtonFieldSettings.isReadOnly) && this.radioButtonFieldPropertyChanged.isReadOnlyChanged) {
            drawingObject.isReadonly = radioButtonFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.isRequired) && this.radioButtonFieldPropertyChanged.isRequiredChanged) {
            drawingObject.isRequired = radioButtonFieldSettings.isRequired;
        }
        if (radioButtonFieldSettings.value && this.radioButtonFieldPropertyChanged.isValueChanged) {
            drawingObject.value = radioButtonFieldSettings.value;
        }
        if ((radioButtonFieldSettings.backgroundColor && radioButtonFieldSettings.backgroundColor !== 'white') &&
         this.radioButtonFieldPropertyChanged.isBackgroundColorChanged) {
            drawingObject.backgroundColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(radioButtonFieldSettings.backgroundColor) : radioButtonFieldSettings.backgroundColor;
        }
        if ((radioButtonFieldSettings.borderColor && radioButtonFieldSettings.borderColor !== 'black') &&
        this.radioButtonFieldPropertyChanged.isBorderColorChanged) {
            drawingObject.borderColor = this.pdfViewer.enableHtmlSanitizer ? SanitizeHtmlHelper.
                sanitize(radioButtonFieldSettings.borderColor) : radioButtonFieldSettings.borderColor;
        }
        if (radioButtonFieldSettings.name && this.radioButtonFieldPropertyChanged.isNameChanged) {
            drawingObject.name = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(radioButtonFieldSettings.name) : radioButtonFieldSettings.name;
        }
        if (radioButtonFieldSettings.tooltip && this.radioButtonFieldPropertyChanged.isToolTipChanged) {
            drawingObject.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(radioButtonFieldSettings.tooltip) : radioButtonFieldSettings.tooltip;
        }
        if ((radioButtonFieldSettings.thickness && radioButtonFieldSettings.thickness !== 1) &&
        this.radioButtonFieldPropertyChanged.isThicknessChanged) {
            drawingObject.thickness = radioButtonFieldSettings.thickness;
        }
        if (radioButtonFieldSettings.visibility && this.radioButtonFieldPropertyChanged.isVisibilityChanged) {
            drawingObject.visibility = radioButtonFieldSettings.visibility;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.isPrint) && this.radioButtonFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = radioButtonFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.isSelected) && this.radioButtonFieldPropertyChanged.isSelectedChanged) {
            drawingObject.isSelected = radioButtonFieldSettings.isSelected;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.customData) && this.radioButtonFieldPropertyChanged.isCustomDataChanged) {
            drawingObject.customData = radioButtonFieldSettings.customData;
        }
    }

    private updateDropdownFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel,
                                                  isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const dropdownFieldSettings: any = this.pdfViewer.DropdownFieldSettings;
        if (!isNullOrUndefined(dropdownFieldSettings.isReadOnly) && this.dropdownFieldPropertyChanged.isReadOnlyChanged) {
            drawingObject.isReadonly = dropdownFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(dropdownFieldSettings.isRequired) && this.dropdownFieldPropertyChanged.isRequiredChanged) {
            drawingObject.isRequired = dropdownFieldSettings.isRequired;
        }
        if ((dropdownFieldSettings.backgroundColor && dropdownFieldSettings.backgroundColor !== 'white') && this.dropdownFieldPropertyChanged.isBackgroundColorChanged) {
            drawingObject.backgroundColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(dropdownFieldSettings.backgroundColor) : dropdownFieldSettings.backgroundColor;
        }
        if ((dropdownFieldSettings.borderColor && dropdownFieldSettings.borderColor !== 'black') && this.dropdownFieldPropertyChanged.isBorderColorChanged) {
            drawingObject.borderColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(dropdownFieldSettings.borderColor) : dropdownFieldSettings.borderColor;
        }
        if ((dropdownFieldSettings.alignment && dropdownFieldSettings.alignment !== 'Left') && this.dropdownFieldPropertyChanged.isAlignmentChanged) {
            drawingObject.alignment = dropdownFieldSettings.alignment;
        }
        if ((dropdownFieldSettings.color && dropdownFieldSettings.color !== 'black') && this.dropdownFieldPropertyChanged.isColorChanged) {
            drawingObject.color = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(dropdownFieldSettings.color) : dropdownFieldSettings.color;
        }
        if ((dropdownFieldSettings.fontFamily && dropdownFieldSettings.fontFamily !== 'Helvetica') && this.dropdownFieldPropertyChanged.isFontFamilyChanged) {

            drawingObject.fontFamily = SanitizeHtmlHelper.sanitize(dropdownFieldSettings.fontFamily);
        }
        if ((dropdownFieldSettings.fontSize && dropdownFieldSettings.fontSize !== 10) &&
        this.dropdownFieldPropertyChanged.isFontSizeChanged) {
            drawingObject.fontSize = dropdownFieldSettings.fontSize;
        }
        if (dropdownFieldSettings.fontStyle && this.dropdownFieldPropertyChanged.isFontStyleChanged) {
            (drawingObject as any).fontStyle = this.getFontStyleName(dropdownFieldSettings.fontStyle, drawingObject);
        }
        if (dropdownFieldSettings.name && this.dropdownFieldPropertyChanged.isNameChanged) {
            drawingObject.name = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(dropdownFieldSettings.name) : dropdownFieldSettings.name;
        }
        if (dropdownFieldSettings.tooltip && this.dropdownFieldPropertyChanged.isToolTipChanged) {
            drawingObject.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(dropdownFieldSettings.tooltip) : dropdownFieldSettings.tooltip;
        }
        if ((dropdownFieldSettings && dropdownFieldSettings.thickness !== 1) && this.dropdownFieldPropertyChanged.isThicknessChanged) {
            drawingObject.thickness = dropdownFieldSettings.thickness;
        }
        if (dropdownFieldSettings.visibility && this.dropdownFieldPropertyChanged.isVisibilityChanged) {
            drawingObject.visibility = dropdownFieldSettings.visibility;
        }
        if (!isNullOrUndefined(dropdownFieldSettings.isPrint) && this.dropdownFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = dropdownFieldSettings.isPrint;
        }
        if (dropdownFieldSettings.options && this.dropdownFieldPropertyChanged.isOptionChanged) {
            drawingObject.options = drawingObject.options && drawingObject.options.length > 0 ?
                drawingObject.options : dropdownFieldSettings.options;
        }
        if (!isNullOrUndefined(dropdownFieldSettings.customData) && this.dropdownFieldPropertyChanged.isCustomDataChanged) {
            drawingObject.customData = dropdownFieldSettings.customData;
        }
    }

    private updatelistBoxFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel,
                                                 isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const listBoxFieldSettings: any = this.pdfViewer.listBoxFieldSettings;
        if (!isNullOrUndefined(listBoxFieldSettings.isReadOnly) && this.listBoxFieldPropertyChanged.isReadOnlyChanged) {
            drawingObject.isReadonly = listBoxFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(listBoxFieldSettings.isRequired) && this.listBoxFieldPropertyChanged.isRequiredChanged) {
            drawingObject.isRequired = listBoxFieldSettings.isRequired;
        }
        if ((listBoxFieldSettings.backgroundColor && listBoxFieldSettings.backgroundColor !== 'white') && this.listBoxFieldPropertyChanged.isBackgroundColorChanged) {
            drawingObject.backgroundColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(listBoxFieldSettings.backgroundColor) : listBoxFieldSettings.backgroundColor;
        }
        if ((listBoxFieldSettings.borderColor && listBoxFieldSettings.borderColor !== 'black') && this.listBoxFieldPropertyChanged.isBorderColorChanged) {
            drawingObject.borderColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(listBoxFieldSettings.borderColor) : listBoxFieldSettings.borderColor;
        }
        if ((listBoxFieldSettings.alignment && listBoxFieldSettings.alignment !== 'Left') && this.listBoxFieldPropertyChanged.isAlignmentChanged) {
            drawingObject.alignment = listBoxFieldSettings.alignment;
        }
        if ((listBoxFieldSettings.color && listBoxFieldSettings.color !== 'black') && this.listBoxFieldPropertyChanged.isColorChanged) {
            drawingObject.color = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(listBoxFieldSettings.color) : listBoxFieldSettings.color;
        }
        if ((listBoxFieldSettings.fontFamily && listBoxFieldSettings.fontFamily !== 'Helvetica') && this.listBoxFieldPropertyChanged.isFontFamilyChanged) {
            drawingObject.fontFamily = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(listBoxFieldSettings.fontFamily) : listBoxFieldSettings.fontFamily;
        }
        if ((listBoxFieldSettings.fontSize && listBoxFieldSettings.fontSize !== 10) && this.listBoxFieldPropertyChanged.isFontSizeChanged) {
            drawingObject.fontSize = listBoxFieldSettings.fontSize;
        }
        if (listBoxFieldSettings.fontStyle && this.listBoxFieldPropertyChanged.isFontStyleChanged) {
            (drawingObject as any).fontStyle = this.getFontStyleName(listBoxFieldSettings.fontStyle, drawingObject);
        }
        if (listBoxFieldSettings.name && this.listBoxFieldPropertyChanged.isNameChanged) {
            drawingObject.name = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(listBoxFieldSettings.name) : listBoxFieldSettings.name;
        }
        if (listBoxFieldSettings.tooltip && this.listBoxFieldPropertyChanged.isToolTipChanged) {
            drawingObject.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(listBoxFieldSettings.tooltip) : listBoxFieldSettings.tooltip;
        }
        if ((listBoxFieldSettings.thickness && listBoxFieldSettings.thickness !== 1) &&
        this.listBoxFieldPropertyChanged.isThicknessChanged) {
            drawingObject.thickness = listBoxFieldSettings.thickness;
        }
        if (listBoxFieldSettings.visibility && this.listBoxFieldPropertyChanged.isVisibilityChanged) {
            drawingObject.visibility = listBoxFieldSettings.visibility;
        }
        if (!isNullOrUndefined(listBoxFieldSettings.isPrint) && this.listBoxFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = listBoxFieldSettings.isPrint;
        }
        if (listBoxFieldSettings.options && this.listBoxFieldPropertyChanged.isOptionChanged) {
            drawingObject.options = drawingObject.options && drawingObject.options.length > 0 ?
                drawingObject.options : listBoxFieldSettings.options;
        }
        if (!isNullOrUndefined(listBoxFieldSettings.customData) && this.listBoxFieldPropertyChanged.isCustomDataChanged) {
            drawingObject.customData = listBoxFieldSettings.customData;
        }
    }

    private updateSignInitialFieldProperties(signatureField: any, isInitialField: boolean,
                                             isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const initialFieldSettings: any = this.pdfViewer.initialFieldSettings;
        const signatureFieldSettings: any = this.pdfViewer.signatureFieldSettings;
        if (isInitialField) {
            if (!isNullOrUndefined(initialFieldSettings.isReadOnly) && this.initialFieldPropertyChanged.isReadOnlyChanged) {
                signatureField.isReadonly = initialFieldSettings.isReadOnly;
            }
            if (!isNullOrUndefined(initialFieldSettings.isRequired) &&
            this.initialFieldPropertyChanged.isRequiredChanged && !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.isRequired = initialFieldSettings.isRequired;
            }
            if (initialFieldSettings.visibility && this.initialFieldPropertyChanged.isVisibilityChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.visibility = initialFieldSettings.visibility;
            }
            if (initialFieldSettings.tooltip && this.initialFieldPropertyChanged.isTooltipChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                    SanitizeHtmlHelper.sanitize(initialFieldSettings.tooltip) : initialFieldSettings.tooltip;
            }
            if ((!isNullOrUndefined(initialFieldSettings.thickness) && isSetFormFieldMode === true) &&
            this.initialFieldPropertyChanged.isThicknessChanged) {
                signatureField.thickness = initialFieldSettings.thickness;
            }
            if (initialFieldSettings.name && this.initialFieldPropertyChanged.isNameChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.name = this.pdfViewer.enableHtmlSanitizer ?
                    SanitizeHtmlHelper.sanitize(initialFieldSettings.name) : initialFieldSettings.name;
            }
            if (!isNullOrUndefined(initialFieldSettings.isPrint) &&
            this.initialFieldPropertyChanged.isPrintChanged && !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.isPrint = initialFieldSettings.isPrint;
            }
            if (!isNullOrUndefined(initialFieldSettings.customData) && this.initialFieldPropertyChanged.isCustomDataChanged) {
                signatureField.customData = initialFieldSettings.customData;
            }
        }
        else {
            if (!isNullOrUndefined(signatureFieldSettings.isReadOnly) && this.signatureFieldPropertyChanged.isReadOnlyChanged) {
                signatureField.isReadonly = signatureFieldSettings.isReadOnly;
            }
            if (!isNullOrUndefined(signatureFieldSettings.isRequired) &&
            this.signatureFieldPropertyChanged.isRequiredChanged && !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.isRequired = signatureFieldSettings.isRequired;
            }
            if (signatureFieldSettings.visibility && this.signatureFieldPropertyChanged.isVisibilityChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.visibility = signatureFieldSettings.visibility;
            }
            if (signatureFieldSettings.tooltip && this.signatureFieldPropertyChanged.isTooltipChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                    SanitizeHtmlHelper.sanitize(signatureFieldSettings.tooltip) : signatureFieldSettings.tooltip;
            }
            if ((!isNullOrUndefined(signatureFieldSettings.thickness) && isSetFormFieldMode === true) &&
            this.signatureFieldPropertyChanged.isThicknessChanged) {
                signatureField.thickness = signatureFieldSettings.thickness;
            }
            if (signatureFieldSettings.name && this.signatureFieldPropertyChanged.isNameChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.name = this.pdfViewer.enableHtmlSanitizer ?
                    SanitizeHtmlHelper.sanitize(signatureFieldSettings.name) : signatureFieldSettings.name;
            }
            if (!isNullOrUndefined(signatureFieldSettings.isPrint) && this.signatureFieldPropertyChanged.isPrintChanged &&
            !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
                signatureField.isPrint = signatureFieldSettings.isPrint;
            }
            if (!isNullOrUndefined(signatureFieldSettings.customData) && this.signatureFieldPropertyChanged.isCustomDataChanged) {
                signatureField.customData = signatureFieldSettings.customData;
            }
        }
    }

    /**
     * @param {any} newSignatureFieldSettings - It describes about the new signature field settings
     * @param {boolean} isInitialField - It describes about the isInitialField
     * @private
     * @returns {void}
     */
    public updateSignatureSettings(newSignatureFieldSettings: any, isInitialField : boolean): void {
        isInitialField = !isNullOrUndefined(isInitialField) ? isInitialField : false;
        if (isInitialField) {
            this.initialFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(newSignatureFieldSettings.isReadOnly);
            this.initialFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(newSignatureFieldSettings.isRequired);
            this.initialFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(newSignatureFieldSettings.visibility);
            this.initialFieldPropertyChanged.isTooltipChanged = !isNullOrUndefined(newSignatureFieldSettings.tooltip);
            this.initialFieldPropertyChanged.isNameChanged = !isNullOrUndefined(newSignatureFieldSettings.name);
            this.initialFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(newSignatureFieldSettings.isPrint);
            this.initialFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(newSignatureFieldSettings.thickness);
            this.initialFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(newSignatureFieldSettings.customData);
        }
        else {
            this.signatureFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(newSignatureFieldSettings.isReadOnly);
            this.signatureFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(newSignatureFieldSettings.isRequired);
            this.signatureFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(newSignatureFieldSettings.visibility);
            this.signatureFieldPropertyChanged.isTooltipChanged = !isNullOrUndefined(newSignatureFieldSettings.tooltip);
            this.signatureFieldPropertyChanged.isNameChanged = !isNullOrUndefined(newSignatureFieldSettings.name);
            this.signatureFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(newSignatureFieldSettings.isPrint);
            this.signatureFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(newSignatureFieldSettings.thickness);
            this.signatureFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(newSignatureFieldSettings.customData);
        }
    }

    /**
     * @param {any} textFieldSettings - It describes about the text field settings
     * @private
     * @returns {void}
     */
    public updateTextFieldSettings(textFieldSettings: any): void {
        this.textFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(textFieldSettings.isReadOnly);
        this.textFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(textFieldSettings.isRequired);
        this.textFieldPropertyChanged.isValueChanged = !isNullOrUndefined(textFieldSettings.value);
        this.textFieldPropertyChanged.isBackgroundColorChanged = !isNullOrUndefined(textFieldSettings.backgroundColor);
        this.textFieldPropertyChanged.isBorderColorChanged = !isNullOrUndefined(textFieldSettings.borderColor);
        this.textFieldPropertyChanged.isAlignmentChanged = !isNullOrUndefined(textFieldSettings.alignment);
        this.textFieldPropertyChanged.isColorChanged = !isNullOrUndefined(textFieldSettings.color);
        this.textFieldPropertyChanged.isFontFamilyChanged = !isNullOrUndefined(textFieldSettings.fontFamily);
        this.textFieldPropertyChanged.isFontSizeChanged = !isNullOrUndefined(textFieldSettings.fontSize);
        this.textFieldPropertyChanged.isFontStyleChanged = !isNullOrUndefined(textFieldSettings.fontStyle);
        this.textFieldPropertyChanged.isNameChanged = !isNullOrUndefined(textFieldSettings.name);
        this.textFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(textFieldSettings.tooltip);
        this.textFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(textFieldSettings.thickness);
        this.textFieldPropertyChanged.isMaxLengthChanged = !isNullOrUndefined(textFieldSettings.maxLength);
        this.textFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(textFieldSettings.visibility);
        this.textFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(textFieldSettings.isPrint);
        this.textFieldPropertyChanged.isMultilineChanged = !isNullOrUndefined(textFieldSettings.isMultiline);
        this.textFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(textFieldSettings.customData);
    }

    /**
     * @param {any} passwordFieldSettings - It describes about the password field settings
     * @private
     * @returns {void}
     */
    public updatePasswordFieldSettings(passwordFieldSettings: any): void {
        this.passwordFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(passwordFieldSettings.isReadOnly);
        this.passwordFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(passwordFieldSettings.isRequired);
        this.passwordFieldPropertyChanged.isValueChanged = !isNullOrUndefined(passwordFieldSettings.value);
        this.passwordFieldPropertyChanged.isBackgroundColorChanged = !isNullOrUndefined(passwordFieldSettings.backgroundColor);
        this.passwordFieldPropertyChanged.isBorderColorChanged = !isNullOrUndefined(passwordFieldSettings.borderColor);
        this.passwordFieldPropertyChanged.isAlignmentChanged = !isNullOrUndefined(passwordFieldSettings.alignment);
        this.passwordFieldPropertyChanged.isColorChanged = !isNullOrUndefined(passwordFieldSettings.color);
        this.passwordFieldPropertyChanged.isFontFamilyChanged = !isNullOrUndefined(passwordFieldSettings.fontFamily);
        this.passwordFieldPropertyChanged.isFontSizeChanged = !isNullOrUndefined(passwordFieldSettings.fontSize);
        this.passwordFieldPropertyChanged.isFontStyleChanged = !isNullOrUndefined(passwordFieldSettings.fontStyle);
        this.passwordFieldPropertyChanged.isNameChanged = !isNullOrUndefined(passwordFieldSettings.name);
        this.passwordFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(passwordFieldSettings.tooltip);
        this.passwordFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(passwordFieldSettings.thickness);
        this.passwordFieldPropertyChanged.isMaxLengthChanged = !isNullOrUndefined(passwordFieldSettings.maxLength);
        this.passwordFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(passwordFieldSettings.visibility);
        this.passwordFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(passwordFieldSettings.isPrint);
        this.passwordFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(passwordFieldSettings.customData);
    }

    /**
     * @param {any} checkBoxFieldSettings - It describes about the checkbox field settings
     * @private
     * @returns {void}
     */
    public updateCheckBoxFieldSettings(checkBoxFieldSettings: any): void {
        this.checkBoxFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(checkBoxFieldSettings.isReadOnly);
        this.checkBoxFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(checkBoxFieldSettings.isRequired);
        this.checkBoxFieldPropertyChanged.isBackgroundColorChanged = !isNullOrUndefined(checkBoxFieldSettings.backgroundColor);
        this.checkBoxFieldPropertyChanged.isBorderColorChanged = !isNullOrUndefined(checkBoxFieldSettings.borderColor);
        this.checkBoxFieldPropertyChanged.isNameChanged = !isNullOrUndefined(checkBoxFieldSettings.name);
        this.checkBoxFieldPropertyChanged.isValueChanged = !isNullOrUndefined(checkBoxFieldSettings.value);
        this.checkBoxFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(checkBoxFieldSettings.tooltip);
        this.checkBoxFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(checkBoxFieldSettings.thickness);
        this.checkBoxFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(checkBoxFieldSettings.visibility);
        this.checkBoxFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(checkBoxFieldSettings.isPrint);
        this.checkBoxFieldPropertyChanged.isCheckedChanged = !isNullOrUndefined(checkBoxFieldSettings.isChecked);
        this.checkBoxFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(checkBoxFieldSettings.customData);
    }

    /**
     * @param {any} radioButtonFieldSettings - It describes about the radio button field settings
     * @private
     * @returns {void}
     */
    public updateRadioButtonFieldSettings(radioButtonFieldSettings: any): void {
        this.radioButtonFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(radioButtonFieldSettings.isReadOnly);
        this.radioButtonFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(radioButtonFieldSettings.isRequired);
        this.radioButtonFieldPropertyChanged.isBackgroundColorChanged = !isNullOrUndefined(radioButtonFieldSettings.backgroundColor);
        this.radioButtonFieldPropertyChanged.isBorderColorChanged = !isNullOrUndefined(radioButtonFieldSettings.borderColor);
        this.radioButtonFieldPropertyChanged.isNameChanged = !isNullOrUndefined(radioButtonFieldSettings.name);
        this.radioButtonFieldPropertyChanged.isValueChanged = !isNullOrUndefined(radioButtonFieldSettings.value);
        this.radioButtonFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(radioButtonFieldSettings.tooltip);
        this.radioButtonFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(radioButtonFieldSettings.thickness);
        this.radioButtonFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(radioButtonFieldSettings.visibility);
        this.radioButtonFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(radioButtonFieldSettings.isPrint);
        this.radioButtonFieldPropertyChanged.isSelectedChanged = !isNullOrUndefined(radioButtonFieldSettings.isSelected);
        this.radioButtonFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(radioButtonFieldSettings.customData);
    }

    /**
     * @param {any} dropdownFieldSettings - It describes about the dropdown field settings
     * @private
     * @returns {void}
     */
    public updateDropDownFieldSettings(dropdownFieldSettings: any): void {
        this.dropdownFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(dropdownFieldSettings.isReadOnly);
        this.dropdownFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(dropdownFieldSettings.isRequired);
        this.dropdownFieldPropertyChanged.isValueChanged = !isNullOrUndefined(dropdownFieldSettings.value);
        this.dropdownFieldPropertyChanged.isBackgroundColorChanged = !isNullOrUndefined(dropdownFieldSettings.backgroundColor);
        this.dropdownFieldPropertyChanged.isBorderColorChanged = !isNullOrUndefined(dropdownFieldSettings.borderColor);
        this.dropdownFieldPropertyChanged.isAlignmentChanged = !isNullOrUndefined(dropdownFieldSettings.alignment);
        this.dropdownFieldPropertyChanged.isColorChanged = !isNullOrUndefined(dropdownFieldSettings.color);
        this.dropdownFieldPropertyChanged.isFontFamilyChanged = !isNullOrUndefined(dropdownFieldSettings.fontFamily);
        this.dropdownFieldPropertyChanged.isFontSizeChanged = !isNullOrUndefined(dropdownFieldSettings.fontSize);
        this.dropdownFieldPropertyChanged.isFontStyleChanged = !isNullOrUndefined(dropdownFieldSettings.fontStyle);
        this.dropdownFieldPropertyChanged.isNameChanged = !isNullOrUndefined(dropdownFieldSettings.name);
        this.dropdownFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(dropdownFieldSettings.tooltip);
        this.dropdownFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(dropdownFieldSettings.thickness);
        this.dropdownFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(dropdownFieldSettings.visibility);
        this.dropdownFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(dropdownFieldSettings.isPrint);
        this.dropdownFieldPropertyChanged.isOptionChanged = !isNullOrUndefined(dropdownFieldSettings.options);
        this.dropdownFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(dropdownFieldSettings.customData);
    }

    /**
     * @param {any} listBoxFieldSettings - It describes about the listBoxField settings
     * @private
     * @returns {void}
     */
    public updateListBoxFieldSettings(listBoxFieldSettings: any): void {
        this.listBoxFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(listBoxFieldSettings.isReadOnly);
        this.listBoxFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(listBoxFieldSettings.isRequired);
        this.listBoxFieldPropertyChanged.isBackgroundColorChanged = !isNullOrUndefined(listBoxFieldSettings.backgroundColor);
        this.listBoxFieldPropertyChanged.isBorderColorChanged = !isNullOrUndefined(listBoxFieldSettings.borderColor);
        this.listBoxFieldPropertyChanged.isAlignmentChanged = !isNullOrUndefined(listBoxFieldSettings.alignment);
        this.listBoxFieldPropertyChanged.isColorChanged = !isNullOrUndefined(listBoxFieldSettings.color);
        this.listBoxFieldPropertyChanged.isFontFamilyChanged = !isNullOrUndefined(listBoxFieldSettings.fontFamily);
        this.listBoxFieldPropertyChanged.isFontSizeChanged = !isNullOrUndefined(listBoxFieldSettings.fontSize);
        this.listBoxFieldPropertyChanged.isFontStyleChanged = !isNullOrUndefined(listBoxFieldSettings.fontStyle);
        this.listBoxFieldPropertyChanged.isNameChanged = !isNullOrUndefined(listBoxFieldSettings.name);
        this.listBoxFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(listBoxFieldSettings.tooltip);
        this.listBoxFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(listBoxFieldSettings.thickness);
        this.listBoxFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(listBoxFieldSettings.visibility);
        this.listBoxFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(listBoxFieldSettings.isPrint);
        this.listBoxFieldPropertyChanged.isOptionChanged = !isNullOrUndefined(listBoxFieldSettings.options);
        this.listBoxFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(listBoxFieldSettings.customData);
    }

    private getFontStyleName(fontStyle: any, drawingObject: PdfFormFieldBaseModel): any {
        let fontStyleName: any = 'None';
        if (fontStyle === 1) {
            drawingObject.font.isBold = true;
            fontStyleName = 'Bold';
        }
        if (fontStyle === 2) {
            drawingObject.font.isItalic = true;
            fontStyleName = 'Italic';
        }
        if (fontStyle === 3) {
            drawingObject.font.isBold = true;
            drawingObject.font.isItalic = true;
            fontStyleName = 'Bold Italic';
        }
        if (fontStyle === 4) {
            drawingObject.font.isUnderline = true;
            fontStyleName = 'Underline';
        }
        if (fontStyle === 5) {
            drawingObject.font.isBold = true;
            drawingObject.font.isUnderline = true;
            fontStyleName = 'Bold Underline';
        }
        if (fontStyle === 6) {
            drawingObject.font.isUnderline = true;
            drawingObject.font.isItalic = true;
            fontStyleName = 'Underline Italic';
        }
        if (fontStyle === 7) {
            drawingObject.font.isBold = true;
            drawingObject.font.isItalic = true;
            drawingObject.font.isUnderline = true;
            fontStyleName = 'Bold Italic Underline';
        }
        if (fontStyle === 8) {
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Strikethrough';
        }
        if (fontStyle === 9) {
            drawingObject.font.isBold = true;
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Bold Strikethrough';
        }
        if (fontStyle === 10) {
            drawingObject.font.isItalic = true;
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Italic Strikethrough';
        }
        if (fontStyle === 11) {
            drawingObject.font.isBold = true;
            drawingObject.font.isItalic = true;
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Bold Italic Strikethrough';
        }
        if (fontStyle === 12) {
            drawingObject.font.isUnderline = true;
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Underline Strikethrough';
        }
        if (fontStyle === 13) {
            drawingObject.font.isBold = true;
            drawingObject.font.isUnderline = true;
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Bold Underline Strikethrough';
        }
        if (fontStyle === 14) {
            drawingObject.font.isItalic = true;
            drawingObject.font.isUnderline = true;
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Italic Underline Strikethrough';
        }
        if (fontStyle === 15) {
            drawingObject.font.isBold = true;
            drawingObject.font.isItalic = true;
            drawingObject.font.isUnderline = true;
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Bold Italic Underline Strikethrough';
        }
        return fontStyleName;
    }

    private getAlignment(alignment: string): void {
        let align: string;
        if (alignment === 'left') {
            align = 'left';
        }
        else if (alignment === 'right') {
            align = 'right';
        }
        else if (alignment === 'center') {
            align = 'center';
        }
        this.formFieldAlign = align;
    }

    private getFontStyle(font: any): void {
        if (font.isBold) {
            this.formFieldBold = 'bold';
        }
        if (font.isItalic) {
            this.formFieldItalic = 'italic';
        }
        if (font.isUnderline) {
            this.formFieldUnderline = 'underline';
        }
        if (font.isStrikeout) {
            this.formFieldStrikeOut = 'line-through';
        }
    }
}

/**
 * Defines the common behavior of Form Fields
 *
 * @hidden
 */
interface IFormFieldProperty extends HTMLElement {
    name: string;
    value: string;
}
/**
 * Defines the common properties of Radiobutton Item
 *
 * @hidden
 */
export interface IRadiobuttonItem {
    id: string;
    lineBound: IFormFieldBound;
    pageNumber: number;
    formFieldAnnotationType: string;
    name: string;
    value: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: string;
    fontColor: any;
    backgroundColor: any;
    textAlign: string;
    isReadonly: boolean;
    visibility: string;
    maxLength: number;
    isRequired: boolean;
    isPrint: boolean;
    rotation: number;
    tooltip: string;
    isChecked: boolean;
    isSelected: boolean;
    zoomValue: number;
    borderColor?: any;
    thickness?: number;
    isMultiline?: boolean;
    isTransparent?: boolean;
    zIndex?: number;
    insertSpaces?: boolean;
    customData?: object;
}
/**
 * Defines the common properties of Form Fields Item
 *
 * @hidden
 */
export interface IFormField {
    id?: string;
    lineBound?: IFormFieldBound;
    pageNumber?: number;
    zoomValue?: number;
    formFieldAnnotationType?: string;
    name?: string;
    value?: string;
    option?: ItemModel[];
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    fontColor?: any;
    color?: any;
    backgroundColor: any;
    textAlign?: string;
    alignment?: string;
    isReadonly?: boolean;
    visibility?: string;
    maxLength?: number;
    isRequired?: boolean;
    isMultiline?: boolean;
    isPrint?: boolean;
    rotation?: number;
    tooltip?: string;
    isChecked?: boolean;
    isSelected?: boolean;
    radiobuttonItem?: IRadiobuttonItem[];
    selectedIndex?: number[];
    options?: ItemModel[];
    borderColor?: any;
    thickness?: number;
    font?: PdfFontModel;
    signatureBound?: any;
    signatureType?: string;
    type?: string;
    currentName?: string;
    previousName?: string;
    insertSpaces?: boolean;
    isTransparent?: boolean;
    zIndex?: number;
    customData?: object;

}
/**
 * Defines the FormFields Bound properties
 *
 * @hidden
 */
export interface IFormFieldBound {
    X: number;
    Y: number;
    Width: number;
    Height: number
}
/**
 * Defines the FormFields element attributes
 *
 * @hidden
 */
export interface IElement extends HTMLElement {
    options: any;
    name: string;
    value: string;
    checked: boolean;
    selectedIndex: number;
    selectedOptions: any;
    autocomplete: string;
    type: string;
}
