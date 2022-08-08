/* eslint-disable */
import { Browser, createElement, select } from "@syncfusion/ej2-base";
import { cornersPointsBeforeRotation, DrawingElement, PointModel, Rect, TextAlign, splitArrayCollection, processPathData, randomId } from "@syncfusion/ej2-drawings";
import { FormFieldAnnotationType, PdfAnnotationBase, PdfFormFieldBaseModel, PdfFontModel } from "../drawing";
import { DiagramHtmlElement } from "../drawing/html-element";
import { PdfAnnotationBaseModel, PdfViewer, PdfViewerBase, IPageAnnotations } from "../index";
import { CheckBoxFieldSettings, DropdownFieldSettings, PasswordFieldSettings, Item, ListBoxFieldSettings, RadioButtonFieldSettings, SignatureFieldSettings, TextFieldSettings, InitialFieldSettings, SignatureIndicatorSettings } from "../pdfviewer";
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormFieldModel, ItemModel } from "../pdfviewer-model";
import { Dialog, Tooltip } from "@syncfusion/ej2-popups";
import { Tab } from "@syncfusion/ej2-navigations";
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, Slider, TextBox, NumericTextBox } from "@syncfusion/ej2-inputs";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import { Button, ChangeEventArgs, CheckBox } from "@syncfusion/ej2-buttons";
import { DisplayMode, FontStyle, FormFieldType, Visibility } from '../base/types';
import { cloneObject } from '../drawing/drawing-util';

/* eslint-disable */
/**
 * The `FormDesigner` module is used to handle form designer actions of PDF viewer.
 */
export class FormDesigner {
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
    private isDrawHelper: boolean = false;
    private isFormFieldUpdated: boolean = false;

    /**
    * @param viewer
    * @param base
    * @private
    */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    public drawHelper(formFieldAnnotationType: string, obj: PdfFormFieldBaseModel, event: Event): void {
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + this.pdfViewerBase.activeElements.activePageID);
        const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + this.pdfViewerBase.activeElements.activePageID);
        if (canvasElement !== null && textLayer !== null) {
            let zoomValue: number = this.pdfViewerBase.getZoomFactor();
            let htmlElement: HTMLElement;
            const HtmlElementAttribute: Object = {
                'id': 'FormField_helper_html_element',
                'class': 'foreign-object'
            };
            let bounds = this.updateFormFieldInitialSize(obj as DrawingElement, formFieldAnnotationType);
            htmlElement = this.createHtmlElement('div', HtmlElementAttribute);
            this.isDrawHelper = true;
            if (formFieldAnnotationType === "SignatureField" || formFieldAnnotationType === "InitialField") {
                htmlElement.appendChild(this.createSignatureDialog(this.pdfViewer, obj, bounds));
            } else if (formFieldAnnotationType === "DropdownList") {
                let element: any = { id: "dropdown_helper" };
                htmlElement.appendChild(this.createDropDownList(element, obj));
            } else if (formFieldAnnotationType === "ListBox") {
                let element: any = { id: "listbox_helper" };
                htmlElement.appendChild(this.createListBox(element, obj));
            } else {
                htmlElement.appendChild(this.createInputElement(formFieldAnnotationType, obj, bounds));
            }
            textLayer.appendChild(htmlElement);
            let point = this.pdfViewerBase.getMousePosition(event as any);
            htmlElement.setAttribute(
                'style', 'height:' + bounds.height * zoomValue + 'px; width:' + bounds.width * zoomValue + 'px;left:' + point.x * zoomValue + 'px; top:' + point.y * zoomValue + 'px;' +
            'position:absolute;opacity: 0.5;'
            );
        }
    }
    /**
     * @private
     */
    public drawHTMLContent(formFieldAnnotationType: string, element: DiagramHtmlElement, drawingObject: PdfFormFieldBaseModel, pageIndex?: number, commandHandler?: PdfViewer): HTMLElement {
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
        if (element !== null && canvasElement !== null && textLayer !== null) {
            let zoomValue: number = this.pdfViewerBase.getZoomFactor();
            let htmlElement: HTMLElement; let parentHtmlElement: HTMLElement;
            const parentHtmlElementAttribute: Object = {
                'id': "form_field_" + element.id + '_html_element',
                'class': 'foreign-object'
            };
            parentHtmlElement = this.createHtmlElement('div', parentHtmlElementAttribute);
            const HtmlElementAttribute: Object = {
                'id': element.id + '_html_element',
                'class': 'foreign-object'
            };
            htmlElement = this.createHtmlElement('div', HtmlElementAttribute);
            if (formFieldAnnotationType === "SignatureField" || formFieldAnnotationType === "InitialField") {
                element.template = htmlElement.appendChild(this.createSignatureDialog(commandHandler, drawingObject));
            } else if (formFieldAnnotationType === "DropdownList") {
                element.template = htmlElement.appendChild(this.createDropDownList(element, drawingObject));
            } else if (formFieldAnnotationType === "ListBox") {
                element.template = htmlElement.appendChild(this.createListBox(element, drawingObject));
            } else {
                element.template = htmlElement.appendChild(this.createInputElement(formFieldAnnotationType, drawingObject));
            }
            this.isSetFormFieldMode = false;
            let divElement = document.createElement("div");
            divElement.id = drawingObject.id + '_designer_name';
            divElement.style.fontSize = drawingObject.fontSize ? (drawingObject.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
            divElement.className = "e-pv-show-designer-name";
            if (this.pdfViewer.designerMode) {
                divElement.innerHTML = drawingObject.name;
                divElement.style.position = 'absolute';
            } else {
                divElement.innerHTML = "";
                divElement.style.position = 'initial';
            }
            htmlElement.appendChild(divElement);
            parentHtmlElement.appendChild(htmlElement);
            textLayer.appendChild(parentHtmlElement);
            if (formFieldAnnotationType === "RadioButton") {
                if (document.getElementsByClassName("e-pv-radiobtn-span").length > 0) {
                    let spanElement = document.getElementsByClassName("e-pv-radiobtn-span");
                    for (let i: number = 0; i < spanElement.length; i++) {
                        let bounds: any = this.getCheckboxRadioButtonBounds(drawingObject);
                        (spanElement as any)[i].style.width = (bounds.width - 10) + "px";
                        (spanElement as any)[i].style.height = (bounds.height - 10) + "px";
                        if (parseInt((spanElement as any)[i].style.width, 10) <= 1 || parseInt((spanElement as any)[i].style.height, 10) <= 1) {
                            (spanElement as any)[i].style.width = "1px";
                            (spanElement as any)[i].style.height = "1px";
                            (spanElement as any)[i].style.margin = "1px";
                        }
                    }
                }
            }
            const point: PointModel = cornersPointsBeforeRotation(element).topLeft;
            htmlElement.setAttribute(
                'style', 'height:' + (element.actualSize.height * zoomValue) + 'px; width:' + (element.actualSize.width * zoomValue) +
                'px;left:' + point.x * zoomValue + 'px; top:' + point.y * zoomValue + 'px;' +
                'position:absolute;transform:rotate(' + (element.rotateAngle + element.parentTransform) + 'deg);' +
                'pointer-events:' + ((this.pdfViewer.designerMode) ? 'none' : 'all')
                + ';visibility:' + ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';'
            );
            this.updateFormDesignerFieldInSessionStorage(point, element, formFieldAnnotationType, drawingObject);
            let field: IFormField = {
                name: drawingObject.name, id: drawingObject.id, value: drawingObject.value, fontFamily: drawingObject.fontFamily, fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle,
                color: drawingObject.color, backgroundColor: drawingObject.backgroundColor, alignment: drawingObject.alignment, isReadonly: drawingObject.isReadonly, visibility: drawingObject.visibility,
                maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint, rotation: drawingObject.rotateAngle, tooltip: drawingObject.tooltip,
                borderColor: drawingObject.borderColor, thickness: drawingObject.thickness, options: drawingObject.options, pageNumber: drawingObject.pageNumber, isChecked: drawingObject.isChecked, isSelected: drawingObject.isSelected
            };
            this.pdfViewer.fireFormFieldAddEvent("formFieldAdd", field, this.pdfViewerBase.activeElements.activePageID);
        } else {
            const point: PointModel = cornersPointsBeforeRotation(element).topLeft;
            this.updateFormDesignerFieldInSessionStorage(point, element, formFieldAnnotationType, drawingObject);
        }
        return element.template;
    }
    /**
     * @private
    */
    public updateFormDesignerFieldInSessionStorage(point: PointModel, element: DiagramHtmlElement, formFieldType: string, drawingObject?: PdfFormFieldBaseModel): void {
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        let formDesignObj: IFormField = {
            id: element.id, lineBound: { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width * zoomValue, Height: element.actualSize.height * zoomValue },
            name: drawingObject.name, zoomValue: zoomValue, pageNumber: drawingObject.pageNumber, value: drawingObject.value, formFieldAnnotationType: formFieldType, isMultiline: drawingObject.isMultiline,
            signatureType: (drawingObject as any).signatureType, signatureBound: (drawingObject as any).signatureBound,
            fontFamily: drawingObject.fontFamily, fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle, fontColor: this.getRgbCode(drawingObject.color) as unknown as string,
            borderColor: this.getRgbCode(drawingObject.borderColor), thickness: drawingObject.thickness, backgroundColor: this.getRgbCode(drawingObject.backgroundColor) as unknown as string,
            textAlign: drawingObject.alignment, isChecked: drawingObject.isChecked, isSelected: drawingObject.isSelected, isReadonly: drawingObject.isReadonly, font: {
                isBold: drawingObject.font.isBold, isItalic: drawingObject.font.isItalic, isStrikeout: drawingObject.font.isStrikeout, isUnderline: drawingObject.font.isUnderline
            }, selectedIndex: drawingObject.selectedIndex, radiobuttonItem: null, option: drawingObject.options ? drawingObject.options : [], visibility: drawingObject.visibility, maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint, rotation: drawingObject.rotateAngle, tooltip: drawingObject.tooltip
        };
        if (formDesignObj.formFieldAnnotationType === "RadioButton") {
            formDesignObj.radiobuttonItem = [];
            formDesignObj.radiobuttonItem.push({
                id: element.id, lineBound: { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width * zoomValue, Height: element.actualSize.height * zoomValue },
                name: drawingObject.name, zoomValue: zoomValue, pageNumber: drawingObject.pageNumber, value: drawingObject.value, formFieldAnnotationType: formFieldType,
                fontFamily: drawingObject.fontFamily, fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle, fontColor: this.getRgbCode(drawingObject.color) as unknown as string,
                borderColor: this.getRgbCode(drawingObject.borderColor), thickness: drawingObject.thickness, backgroundColor: this.getRgbCode(drawingObject.backgroundColor) as unknown as string,
                textAlign: drawingObject.alignment, isChecked: drawingObject.isChecked, isSelected: drawingObject.isSelected, isReadonly: drawingObject.isReadonly, visibility: drawingObject.visibility,
                maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint, rotation: 0, tooltip: drawingObject.tooltip
            });
        }
        let isItemAdd: boolean = this.getRadioButtonItem(formDesignObj, drawingObject);
        if (!isItemAdd) {
            for (var i = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
                let formFieldElement: any = this.pdfViewerBase.formFieldCollection[i];
                if (formFieldElement["Key"] === formDesignObj.id) {
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
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        if (data) {
            var formFieldsData = JSON.parse(data);
            var isItemAdd: boolean = false;
            for (let i: number = 0; i < formFieldsData.length; i++) {
                let currentData: any = formFieldsData[i];
                let radiobuttonItem: IRadiobuttonItem;
                if (radiobutton.formFieldAnnotationType === "RadioButton") {
                    if (radiobutton.radiobuttonItem && currentData.FormField.radiobuttonItem) {
                        for (let m: number = 0; m < currentData.FormField.radiobuttonItem.length; m++) {
                            if (currentData.FormField.radiobuttonItem[m].id === radiobutton.id) {
                                radiobuttonItem = {
                                    lineBound: radiobutton.lineBound, id: radiobutton.id,
                                    name: radiobutton.name, zoomValue: radiobutton.zoomValue, pageNumber: radiobutton.pageNumber, value: radiobutton.value, formFieldAnnotationType: radiobutton.formFieldAnnotationType,
                                    fontFamily: radiobutton.fontFamily, fontSize: radiobutton.fontSize, fontStyle: radiobutton.fontStyle, fontColor: this.getRgbCode(formFieldProperty.color),
                                    borderColor: this.getRgbCode(formFieldProperty.borderColor), thickness: formFieldProperty.thickness, backgroundColor: this.getRgbCode(formFieldProperty.backgroundColor), textAlign: radiobutton.textAlign, isChecked: radiobutton.isChecked, isSelected: radiobutton.isSelected,
                                    isReadonly: radiobutton.isReadonly, visibility: radiobutton.visibility, maxLength: radiobutton.maxLength, isRequired: radiobutton.isRequired, isPrint: radiobutton.isPrint, rotation: 0, tooltip: radiobutton.tooltip
                                }
                                currentData.FormField.radiobuttonItem.splice(m, 1);
                                currentData.FormField.radiobuttonItem.push(radiobuttonItem);
                                if (!isNullOrUndefined(this.pdfViewerBase.formFieldCollection[i])) {
                                    if (this.pdfViewerBase.formFieldCollection[i].FormField.name === currentData.FormField.name) {
                                        this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem = currentData.FormField.radiobuttonItem;
                                        isItemAdd = true;
                                    }
                                }
                                break;
                            }
                            else {
                                if (radiobutton.formFieldAnnotationType === currentData.FormField.formFieldAnnotationType && radiobutton.name === currentData.FormField.name) {
                                    radiobuttonItem = {
                                        lineBound: radiobutton.lineBound, id: radiobutton.id,
                                        name: radiobutton.name, zoomValue: radiobutton.zoomValue, pageNumber: radiobutton.pageNumber, value: radiobutton.value, formFieldAnnotationType: radiobutton.formFieldAnnotationType,
                                        fontFamily: radiobutton.fontFamily, fontSize: radiobutton.fontSize, fontStyle: radiobutton.fontStyle, fontColor: this.getRgbCode(formFieldProperty.color),
                                        borderColor: this.getRgbCode(formFieldProperty.borderColor), thickness: formFieldProperty.thickness, backgroundColor: this.getRgbCode(formFieldProperty.backgroundColor), textAlign: radiobutton.textAlign, isChecked: radiobutton.isChecked, isSelected: radiobutton.isSelected,
                                        isReadonly: radiobutton.isReadonly, visibility: radiobutton.visibility, maxLength: radiobutton.maxLength, isRequired: radiobutton.isRequired, isPrint: radiobutton.isPrint, rotation: 0, tooltip: radiobutton.tooltip
                                    }

                                    let isContainsRadiobuttonItem: boolean = false;
                                    for (let i: number = 0; i < currentData.FormField.radiobuttonItem.length; i++) {
                                        if (currentData.FormField.radiobuttonItem[i].id === radiobuttonItem.id) {
                                            currentData.FormField.radiobuttonItem[i] = radiobuttonItem;
                                            isContainsRadiobuttonItem = true;
                                            break;
                                        }
                                    }
                                    if (!isContainsRadiobuttonItem) {
                                        currentData.FormField.radiobuttonItem.push(radiobuttonItem);
                                    }
                                    if (!isNullOrUndefined(this.pdfViewerBase.formFieldCollection[i])) {
                                        this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem = currentData.FormField.radiobuttonItem;
                                        isItemAdd = true;
                                        for (let l: number = 0; l < this.pdfViewerBase.formFieldCollection.length; l++) {
                                            var formFieldElement = this.pdfViewerBase.formFieldCollection[l];
                                            if (formFieldElement["Key"] === radiobuttonItem.id) {
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

    // eslint-disable-next-line
    private getRgbCode(colorString: string): object {
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            let colorCode: string = this.nameToHash(colorString);
            if (colorCode != "")
                colorString = colorCode;
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        // eslint-disable-next-line radix
        const r: number = parseInt(stringArray[0].split('(')[1]);
        // eslint-disable-next-line radix
        const g: number = parseInt(stringArray[1]);
        // eslint-disable-next-line radix
        const b: number = parseInt(stringArray[2]);
        // eslint-disable-next-line radix
        let a: number = parseFloat(stringArray[3]) * 100;
        if (isNaN(a)) {
            a = 0;
        }
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * @param colour
     * @private
     */
    // eslint-disable-next-line
    public nameToHash(colour: string): string {
        // eslint-disable-next-line
        let colours: any = {
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
     * @param value
     * @param type
     * @param value
     * @param type
     * @private
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
                    return this.convertToHsvString(this.rgbToHsv.apply(this, cValue.slice(0, 3)));
                } else {
                    if (type === 'hsva') {
                        return this.convertToHsvString(this.rgbToHsv.apply(this, cValue));
                    } else {
                        return 'null';
                    }
                }
            }
        } else {
            if (value[0] === 'h') {
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
        // eslint-disable-next-line max-len
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
        let h: number; let s: number; const v: number = max;

        const d: number = max - min;
        s = max === 0 ? 0 : d / max;

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
        let i: number;
        let f: number; let p: number; let q: number; let t: number;
        s /= 100; v /= 100;
        if (s === 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), opacity];
        }
        h /= 60;
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
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
        // eslint-disable-next-line max-len
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).substr(-2) : '00') : '')) : '';
    }

    /**
     * @private
     */
    public updateCanvas(pageNumber: number, canvas?: HTMLElement) {
        if (canvas !== null && canvas !== undefined) {
            canvas = canvas;
        }
        else {
            canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            let zoom: number = this.pdfViewerBase.getZoomFactor();
            let ratio: number = this.pdfViewerBase.getZoomRatio(zoom);
            if (canvas) {
                let width: number = this.pdfViewerBase.pageSize[pageNumber].width;
                let height: number = this.pdfViewerBase.pageSize[pageNumber].height;
                (canvas as HTMLCanvasElement).width = width * ratio;
                (canvas as HTMLCanvasElement).height = height * ratio;
                (canvas as any).style.width = width * zoom + 'px';
                (canvas as any).style.height = height * zoom + 'px';
            }
        }
        this.pdfViewer.drawing.refreshCanvasDiagramLayer(canvas as HTMLCanvasElement, pageNumber);
    }

    /**
     * @private
    */
    public rerenderFormFields(pageIndex: number): void {
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        var data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        if (data) {
            var formFieldsData = JSON.parse(data);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            if (formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    // eslint-disable-next-line
                    let currentData: any = formFieldsData[i].FormField;

                    if (currentData.pageNumber === pageIndex + 1) {
                        let domElementId: HTMLElement = document.getElementById('form_field_' + currentData.id + '_html_element');
                        if (!domElementId) {
                            let signatureField: PdfFormFieldBaseModel = (this.pdfViewer.nameTable as any)[formFieldsData[i].Key.split("_")[0]];
                            let element: DiagramHtmlElement = signatureField.wrapper.children[0] as DiagramHtmlElement;
                            if (element) {
                                if (currentData.formFieldAnnotationType === "RadioButton") {
                                    for (let j: number = 0; j < currentData.radiobuttonItem.length; j++) {
                                        signatureField = (this.pdfViewer.nameTable as any)[currentData.radiobuttonItem[j].id.split("_")[0]];
                                        element = signatureField.wrapper.children[0] as DiagramHtmlElement;
                                        currentData.radiobuttonItem[j] = this.renderFormFieldsInZooming(element, currentData.radiobuttonItem[j], signatureField, zoomValue);
                                        this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].lineBound = currentData.radiobuttonItem[j].lineBound;
                                        this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].zoomValue = zoomValue;
                                    }
                                } else {
                                    currentData.lineBound = this.renderFormFieldsInZooming(element, currentData, signatureField, zoomValue).lineBound;
                                    this.pdfViewerBase.formFieldCollection[i].FormField.lineBound = currentData.lineBound;
                                    this.pdfViewerBase.formFieldCollection[i].FormField.zoomValue = zoomValue;
                                }
                                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                            }
                        }
                    }
                }
            }
        }
    }
    private renderFormFieldsInZooming(element: DiagramHtmlElement, currentData: any, signatureField: PdfFormFieldBaseModel, zoomValue: number): any {
        if (element) {
            let htmlElement: HTMLElement; let parentHtmlElement: HTMLElement;
            const parentHtmlElementAttribute: Object = {
                'id': "form_field_" + element.id + '_html_element',
                'class': 'foreign-object'
            };
            parentHtmlElement = this.createHtmlElement('div', parentHtmlElementAttribute);
            const HtmlElementAttribute: Object = {
                'id': element.id + '_html_element',
                'class': 'foreign-object'
            };
            htmlElement = this.createHtmlElement('div', HtmlElementAttribute);
            if (currentData.formFieldAnnotationType === "SignatureField" || currentData.formFieldAnnotationType === "InitialField") {
                this.disableSignatureClickEvent = true;
                signatureField.value = currentData.value;
                (signatureField as any).signatureType = currentData.signatureType;
                (signatureField as any).signatureBound = currentData.signatureBound;
                element.template = htmlElement.appendChild(this.createSignatureDialog(this.pdfViewer, signatureField));
                this.disableSignatureClickEvent = false;
            } else if (currentData.formFieldAnnotationType === "DropdownList") {
                element.template = htmlElement.appendChild(this.createDropDownList(element, signatureField));
            } else if (currentData.formFieldAnnotationType === "ListBox") {
                element.template = htmlElement.appendChild(this.createListBox(element, signatureField));
            } else {
                element.template = htmlElement.appendChild(this.createInputElement(currentData.formFieldAnnotationType, signatureField));
            }
            let divElement = document.createElement("div");
            divElement.id = signatureField.id + '_designer_name';
            divElement.style.fontSize = signatureField.fontSize ? (signatureField.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
            divElement.className = "e-pv-show-designer-name";
            if (this.pdfViewer.designerMode) {
                divElement.innerHTML = signatureField.name;
                divElement.style.position = 'absolute';
            } else {
                divElement.innerHTML = "";
                divElement.style.position = 'initial';
            }
            htmlElement.appendChild(divElement);
            parentHtmlElement.appendChild(htmlElement);
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentData.pageNumber - 1));
            textLayer.appendChild(parentHtmlElement);
            if (signatureField.formFieldAnnotationType === "RadioButton") {
                if (document.getElementsByClassName("e-pv-radiobtn-span").length > 0) {
                    let bounds: any = this.getCheckboxRadioButtonBounds(signatureField);
                    let spanElement = document.getElementsByClassName("e-pv-radiobtn-span");
                    // this.renderRadioButtonSpan(spanElement, bounds, zoomValue);
                }
            }
            const point: PointModel = cornersPointsBeforeRotation(signatureField.wrapper.children[0]).topLeft;
            htmlElement.setAttribute(
                'style', 'height:' + (element.actualSize.height * zoomValue) + 'px; width:' + (element.actualSize.width * zoomValue) +
                'px;left:' + point.x * zoomValue + 'px; top:' + point.y * zoomValue + 'px;' +
                'position:absolute;transform:rotate(' + (element.rotateAngle + element.parentTransform) + 'deg);' +
                'pointer-events:' + ((this.pdfViewer.designerMode) ? 'none' : 'all')
                + ';visibility:' + ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';'
            );
            currentData.lineBound = { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width * zoomValue, Height: element.actualSize.height * zoomValue };
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
     * @private
     */
    public updateFormFieldInitialSize(obj: DrawingElement, formFieldAnnotationType: string): any {
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
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
     * @private
    */
    public updateHTMLElement(actualObject: PdfAnnotationBaseModel) {
        let element = actualObject.wrapper.children[0];
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        if (element) {
            let htmlElement = document.getElementById(element.id + "_html_element");
            if (!isNullOrUndefined(htmlElement)) {
                const point: PointModel = cornersPointsBeforeRotation(actualObject.wrapper.children[0]).topLeft;
                htmlElement.setAttribute(
                    'style', 'height:' + (element.actualSize.height * zoomValue) + 'px; width:' + (element.actualSize.width * zoomValue) +
                    'px;left:' + point.x * zoomValue + 'px; top:' + point.y * zoomValue + 'px;' +
                    'position:absolute;transform:rotate(' + (element.rotateAngle + element.parentTransform) + 'deg);' +
                    'pointer-events:' + ((this.pdfViewer.designerMode) ? 'none' : 'all')
                    + ';visibility:' + ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';'
                );
                var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                if (actualObject.formFieldAnnotationType === "RadioButton") {
                    let labelContainer: Element = htmlElement.firstElementChild.firstElementChild;
                    let spanElement: Element = htmlElement.firstElementChild.firstElementChild.lastElementChild;
                    if (element.actualSize.width > element.actualSize.height) {
                        (htmlElement.firstElementChild as any).style.display = "inherit";
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.height * zoomValue) + "px";
                        (spanElement as any).style.width = (spanElement as any).style.height = (element.actualSize.height - 10) + "px";
                    } else {
                        (htmlElement.firstElementChild as any).style.display = "flex";
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.width * zoomValue) + "px";
                        (spanElement as any).style.width = (spanElement as any).style.height = (element.actualSize.width - 10) + "px";
                    }
                }
                if (actualObject.formFieldAnnotationType === "Checkbox") {
                    let minCheckboxWidth: number = 20;
                    let labelContainer: Element = htmlElement.firstElementChild.firstElementChild;
                    let spanElement: Element = htmlElement.firstElementChild.firstElementChild.lastElementChild.firstElementChild;
                    if (element.actualSize.width > element.actualSize.height) {
                        (htmlElement.firstElementChild as any).style.display = "inherit";
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.height * zoomValue) + "px";
                        (spanElement as any).style.width = ((element.actualSize.height / 5) * zoomValue) + "px";
                        (spanElement as any).style.height = ((element.actualSize.height / 2.5) * zoomValue) + "px";
                        (spanElement as any).style.left = ((element.actualSize.height / 2.5) * zoomValue) + "px";
                        (spanElement as any).style.top = ((element.actualSize.height / 5) * zoomValue) + "px";
                    } else {
                        (htmlElement.firstElementChild as any).style.display = "flex";
                        (labelContainer as any).style.width = (labelContainer as any).style.height = (element.actualSize.width * zoomValue) + "px";
                        (spanElement as any).style.width = ((element.actualSize.width / 5) * zoomValue) + "px";
                        (spanElement as any).style.height = ((element.actualSize.width / 2.5) * zoomValue) + "px";
                        (spanElement as any).style.left = ((element.actualSize.width / 2.5) * zoomValue) + "px";
                        (spanElement as any).style.top = ((element.actualSize.width / 5) * zoomValue) + "px";
                    }
                    if (spanElement.className.indexOf("e-pv-cb-checked") !== -1) {
                        let checkboxWidth = parseInt((labelContainer as any).style.width, 10)
                        if (checkboxWidth > minCheckboxWidth) {
                            (spanElement as any).style.borderWidth = "3px";
                        } else if (checkboxWidth <= 15) {
                            (spanElement as any).style.borderWidth = "1px";
                        } else {
                            (spanElement as any).style.borderWidth = "2px";
                        }
                    }
                }
                if (actualObject.formFieldAnnotationType === "SignatureField"){
                    let signatureDiv = htmlElement.firstElementChild.firstElementChild as HTMLElement;
                    let indicatorSpan = signatureDiv.nextElementSibling as HTMLElement;
                    let bounds = this.getBounds(indicatorSpan as HTMLElement);
                    var options : any= {
                        height: element.actualSize.height , 
                        width: element.actualSize.width,
                        signatureIndicatorSettings : {
                            text : indicatorSpan.textContent,
                            width : bounds.width,
                            height : bounds.height,
                        }
                    }
                    this.updateSignatureIndicator(actualObject as any,options,signatureDiv);
                }
                var formFieldsData = JSON.parse(data);
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    if (formFieldsData[i].FormField.formFieldAnnotationType === "RadioButton") {
                        for (let j: number = 0; j < formFieldsData[i].FormField.radiobuttonItem.length; j++) {
                            if (element.id === formFieldsData[i].FormField.radiobuttonItem[j].id) {
                                this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].lineBound = { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width * zoomValue, Height: element.actualSize.height * zoomValue };
                                this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].zoomValue = zoomValue;
                                break;
                            }
                        }
                    } else {
                        if (formFieldsData[i].Key === element.id) {
                            formFieldsData[i].FormField.lineBound = { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width * zoomValue, Height: element.actualSize.height * zoomValue };
                            let x = (point.x * zoomValue) + (element.actualSize.width * zoomValue)/2;
                            x=  x - formFieldsData[i].FormField.signatureBound.width/2;
                            let y = (point.y * zoomValue) + (element.actualSize.height * zoomValue)/2;
                            y = y - formFieldsData[i].FormField.signatureBound.height/2;
                            formFieldsData[i].FormField.signatureBound.x =  x;
                            formFieldsData[i].FormField.signatureBound.y =  y;
                            this.pdfViewerBase.formFieldCollection[i].FormField.lineBound = formFieldsData[i].FormField.lineBound;
                            this.pdfViewerBase.formFieldCollection[i].FormField.signatureBound = formFieldsData[i].FormField.signatureBound;
                        }

                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
    }

    private getCheckboxRadioButtonBounds(drawingObject: PdfFormFieldBaseModel, bounds?: any): any {
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        let width: number = 0;
        let height: number = 0;
        let display: string = '';
        if (bounds) {
            if (bounds.width > bounds.height) {
                width = height = bounds.height * zoomValue;
                display = "inherit";
            } else {
                width = height = bounds.width * zoomValue;
                display = "flex";
            }
        } else if (drawingObject) {
            if (drawingObject.bounds.width > drawingObject.bounds.height) {
                width = height = drawingObject.bounds.height * zoomValue;
                display = "inherit";
            } else {
                width = height = drawingObject.bounds.width * zoomValue;
                display = "flex";
            }
        }
        return { width: width, height: height, display: display };
    }

    private updateSessionFormFieldProperties(updatedFormFields: PdfFormFieldBaseModel): void {
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        let element: DiagramHtmlElement = updatedFormFields.wrapper.children[0] as DiagramHtmlElement;
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[i].FormField.formFieldAnnotationType === "RadioButton") {
                for (var j = 0; j < formFieldsData[i].FormField.radiobuttonItem.length; j++) {
                    if (element.id === formFieldsData[i].FormField.radiobuttonItem[j].id) {
                        let radioButtonItemUpdate: IRadiobuttonItem = {
                            id: element.id, lineBound: { X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue, Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue },
                            name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber, value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                            fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize, fontStyle: updatedFormFields.fontStyle, fontColor: this.getRgbCode(updatedFormFields.color) as unknown as string,
                            backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor) as unknown as string, borderColor: this.getRgbCode(updatedFormFields.borderColor) as unknown as string, thickness: updatedFormFields.thickness, textAlign: updatedFormFields.alignment, isChecked: updatedFormFields.isChecked, isSelected: updatedFormFields.isSelected,
                            isReadonly: updatedFormFields.isReadonly, visibility: updatedFormFields.visibility, maxLength: updatedFormFields.maxLength, isRequired: updatedFormFields.isRequired, isPrint: updatedFormFields.isPrint, rotation: 0, tooltip: updatedFormFields.tooltip
                        };
                        formFieldsData[i].FormField.radiobuttonItem[j] = radioButtonItemUpdate;
                        if (this.pdfViewerBase.formFieldCollection[i] && this.pdfViewerBase.formFieldCollection[i].FormField && this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j]) {
                            this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j] = radioButtonItemUpdate;
                        }
                        break;
                    }
                }
            } else if (formFieldsData[i].Key === element.id) {
                let formDesignObj: IFormField = {
                    id: element.id, lineBound: { X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue, Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue },
                    name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber, value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                    fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize, fontStyle: updatedFormFields.fontStyle, fontColor: this.getRgbCode(updatedFormFields.color) as unknown as string,
                    backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor) as unknown as string, borderColor: this.getRgbCode(updatedFormFields.borderColor) as unknown as string, thickness: updatedFormFields.thickness, textAlign: updatedFormFields.alignment, isChecked: updatedFormFields.isChecked, isSelected: updatedFormFields.isSelected,
                    isReadonly: updatedFormFields.isReadonly, font: { isBold: updatedFormFields.font.isBold, isItalic: updatedFormFields.font.isItalic, isStrikeout: updatedFormFields.font.isStrikeout, isUnderline: updatedFormFields.font.isUnderline }, selectedIndex: [], radiobuttonItem: null, option: updatedFormFields.options ? updatedFormFields.options : [], visibility: updatedFormFields.visibility, maxLength: updatedFormFields.maxLength, isRequired: updatedFormFields.isRequired, isPrint: updatedFormFields.isPrint, rotation: 0, tooltip: updatedFormFields.tooltip
                };
                if (formFieldsData[i].FormField.formFieldAnnotationType === "SignatureField" || formFieldsData[i].FormField.formFieldAnnotationType === "InitialField") {
                    let updatedSignatureFormFields: any = updatedFormFields;
                    let formDesignObj: IFormField = {
                        id: element.id, lineBound: { X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue, Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue },
                        name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber, value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                        fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize, fontStyle: updatedFormFields.fontStyle, fontColor: this.getRgbCode(updatedFormFields.color),
                        backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor), borderColor: this.getRgbCode(updatedFormFields.borderColor), thickness: updatedFormFields.thickness, textAlign: updatedFormFields.alignment, isChecked: updatedFormFields.isChecked, isSelected: updatedFormFields.isSelected,
                        isReadonly: updatedFormFields.isReadonly, font: { isBold: updatedFormFields.font.isBold, isItalic: updatedFormFields.font.isItalic, isStrikeout: updatedFormFields.font.isStrikeout, isUnderline: updatedFormFields.font.isUnderline }, selectedIndex: [], radiobuttonItem: null, option: updatedFormFields.options ? updatedFormFields.options : [], visibility: updatedFormFields.visibility, maxLength: updatedFormFields.maxLength, isRequired: updatedFormFields.isRequired, isPrint: updatedFormFields.isPrint, rotation: 0, tooltip: updatedFormFields.tooltip,
                        signatureType: updatedFormFields.signatureType, signatureBound: updatedSignatureFormFields.signatureBound
                    };
                    formFieldsData[i].FormField = formDesignObj;
                    this.pdfViewerBase.formFieldCollection[i].FormField = formDesignObj;
                } else {
                    formFieldsData[i].FormField = formDesignObj;
                    this.pdfViewerBase.formFieldCollection[i].FormField = formDesignObj;
                }
                break;
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
     * @private
     */
    public createSignatureDialog(commandHandler: any, signatureField: any, bounds?: any, isPrint?: boolean): HTMLElement {
        this.isInitialField = isNullOrUndefined(signatureField.isInitialField) ? false : signatureField.isInitialField;
        this.pdfViewerBase.isInitialField = this.isInitialField;
        this.pdfViewerBase.isInitialField = signatureField.isInitialField;
        const element: HTMLElement = createElement("div");
        element.className = "foreign-object";
        element.style.position = "absolute";
        element.style.width = "100%";
        element.style.height = "100%";
        const divElement: HTMLElement = createElement("div");
        divElement.style.width = "100%";
        divElement.style.height = "100%";
        divElement.style.position = "absolute";
        divElement.style.backgroundColor = "transparent";
        divElement.style.border = "1px solid #303030";
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
        let signatureFieldSettings: any = this.pdfViewer.signatureFieldSettings;
        if (!signatureFieldSettings.signatureIndicatorSettings) {
            signatureFieldSettings.signatureIndicatorSettings = { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' };
        }
        if (!signatureFieldSettings.signatureDialogSettings) {
            signatureFieldSettings.signatureDialogSettings = { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false }
        }
        //check whether the width for sign indicator has default value or not and then set the default width value for initial field.
        let defaultWidth = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width === 19 ? (signatureField.isInitialField ? 30 : 25) : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width;
        let signatureFieldIndicatorWidth: number = (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.width) ? signatureField.signatureIndicatorSettings.width : defaultWidth;
        let defaultHeight = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height === 10 ? 13 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height;
        let signatureFieldIndicatorHeight: number = (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.height) ? signatureField.signatureIndicatorSettings.height : defaultHeight;
        let signatureFieldIndicatorBG: string = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor === 'orange' ? '#FFE48559' : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor;
        let signIndicator: string = signatureField.isInitialField ? "Initial" : "Sign";
        const signatureFieldWidth = signatureField.bounds ? signatureField.bounds.width : bounds.width;
        const signatureFieldHeight = signatureField.bounds ? signatureField.bounds.height : bounds.height;
        // eslint-disable-next-line max-len
        const height: number = signatureFieldIndicatorHeight > signatureFieldHeight / 2 ? signatureFieldHeight / 2 : signatureFieldIndicatorHeight;
        // eslint-disable-next-line max-len
        const width: number = signatureFieldIndicatorWidth > signatureFieldWidth / 2 ? signatureFieldWidth / 2 : signatureFieldIndicatorWidth;
        let fontSize: number = 10;
        if (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.fontSize)
            // eslint-disable-next-line max-len
            fontSize = signatureField.signatureIndicatorSettings.fontSize > height / 2 ? 10 : signatureField.signatureIndicatorSettings.fontSize;
        else
            // eslint-disable-next-line max-len
            fontSize = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize > height / 2 ? 10 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize;

        const spanElement: any = createElement("span");
        let initialFieldSettings: any = this.pdfViewer.initialFieldSettings;
        if (!initialFieldSettings.initialIndicatorSettings) {
            initialFieldSettings.initialIndicatorSettings = { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' };
        }
        if (!initialFieldSettings.initialDialogSettings) {
            initialFieldSettings.initialDialogSettings = { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false }
        }
        let fieldText: string = signatureField.signatureIndicatorSettings ? signatureField.signatureIndicatorSettings.text : null;
        if (signatureField.isInitialField) {
            spanElement.id = "initialIcon" + signatureField.pageIndex + "_" + this.setFormFieldIdIndex();
            this.setIndicatorText(spanElement, fieldText, this.pdfViewer.initialFieldSettings.initialIndicatorSettings.text, "Initial");
        } else {
            spanElement.style.height = '';
            spanElement.style.width = '';
            spanElement.id = "signIcon" + signatureField.pageIndex + "_" + this.setFormFieldIdIndex();
            this.setIndicatorText(spanElement, fieldText, this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text, "Sign");
        }
        spanElement.style.overflow = "hidden";
        spanElement.style.whiteSpace =  "nowrap";
        spanElement.style.padding = "2px 3px 2px 1px";
        spanElement.style.boxSizing = "border-box";
        let zoomValue : number = this.pdfViewerBase.getZoomFactor() as number;
        spanElement.style.textAlign = "left";
        spanElement.style.fontSize = ((fontSize * zoomValue) as number) + 'px';
        let boundsOfSpan = this.getBounds(spanElement);
        spanElement.style.color = (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.color) ? signatureField.signatureIndicatorSettings.color : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color;
        // eslint-disable-next-line
        spanElement.style.backgroundColor = (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.backgroundColor) ? signatureField.signatureIndicatorSettings.backgroundColor : signatureFieldIndicatorBG;
        spanElement.style.background = (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.background) ? signatureField.signatureIndicatorSettings.background : spanElement.style.backgroundColor;
        spanElement.style.opacity = (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.opacity) ? signatureField.signatureIndicatorSettings.opacity : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity;
        spanElement.style.position = "absolute";
        spanElement.style.width = width * zoomValue + 'px';
        spanElement.style.height = height * zoomValue + 'px';
        let widthNew : number = this.setHeightWidth(signatureFieldWidth,width,boundsOfSpan.width+fontSize,zoomValue);
        spanElement.style.width = widthNew + (fontSize * zoomValue) + "px";
        let heightNew : number = this.setHeightWidth(signatureFieldHeight,height,boundsOfSpan.height,zoomValue);
        spanElement.style.height = heightNew + "px";
        if (!isPrint) {
            element.appendChild(spanElement);
        }
        this.updateSignInitialFieldProperties(signatureField, signatureField.isInitialField, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        if (!isNullOrUndefined(signatureField.tooltip) && signatureField.tooltip != "") {
            this.setToolTip(signatureField.tooltip, element);
        }
        this.updateSignatureFieldProperties(signatureField, element, isPrint);
        return element;
    }

    // eslint-disable-next-line
    private setIndicatorText(spanElement: any, fieldText: any, indicatorText: string, defaultText: string): void {
        spanElement.innerHTML = fieldText ? fieldText : indicatorText ? indicatorText : defaultText;
    }
    private getBounds(htmlElement : HTMLElement) : any {
        let clonedElement = htmlElement.cloneNode(true) as HTMLElement;
        clonedElement.style.height = '';
        clonedElement.style.width = '';
        clonedElement.id = clonedElement.id +"_clonedElement";
        document.body.appendChild(clonedElement);
        let clone = document.getElementById(clonedElement.id);
        let bounds = clone.getBoundingClientRect();
        document.body.removeChild(clonedElement);
        return bounds;
    }
    private updateSignatureIndicator(formFieldObject : any, options : any, htmlElement : any){
        if (htmlElement !== null){
            var fieldBounds = htmlElement.getBoundingClientRect();
            var zoomValue = this.pdfViewerBase.getZoomFactor();
            let spanElement = htmlElement.nextElementSibling;
            let objIndicatorSettings: SignatureIndicatorSettings = formFieldObject.signatureIndicatorSettings;
            let indicatorSettings : SignatureIndicatorSettings = options.signatureIndicatorSettings;
            spanElement.style.width = '';
            spanElement.style.height = '';
            if(indicatorSettings.text !== undefined){
                this.setIndicatorText(spanElement, indicatorSettings.text, indicatorSettings.text, "Sign");
                objIndicatorSettings.text = indicatorSettings.text;
            }
            if(indicatorSettings.fontSize){
                spanElement.style.fontSize = indicatorSettings.fontSize >  formFieldObject.height / 2 ? 10 : indicatorSettings.fontSize * zoomValue + "px"; 
                objIndicatorSettings.fontSize = indicatorSettings.fontSize;
        }
            let bounds = this.getBounds(spanElement);
            if(indicatorSettings.color){
                spanElement.style.color = indicatorSettings.color;
                objIndicatorSettings.color = this.nameToHash(indicatorSettings.color);
            }
            if(indicatorSettings.backgroundColor){
                spanElement.style.backgroundColor = indicatorSettings.backgroundColor;
                objIndicatorSettings.backgroundColor = this.nameToHash(indicatorSettings.backgroundColor);
            }
            if(indicatorSettings.opacity){
                spanElement.style.opacity = indicatorSettings.opacity;
                objIndicatorSettings.opacity = indicatorSettings.opacity;
            }
            if(indicatorSettings.width || options.width || indicatorSettings.text){
                let width :number = this.setHeightWidth(fieldBounds.width,indicatorSettings.width,bounds.width,zoomValue);
                spanElement.style.width = width +(objIndicatorSettings.fontSize*zoomValue)+ "px";
                objIndicatorSettings.width = width;
            }
            if(indicatorSettings.height || options.height|| indicatorSettings.text){
                let height : number = this.setHeightWidth(fieldBounds.height,indicatorSettings.height,bounds.height, zoomValue);
                spanElement.style.height = height + "px";
                objIndicatorSettings.height = height;
            }   
            this.updateSignatureFieldProperties(formFieldObject, htmlElement, formFieldObject.isPrint);
            formFieldObject.signatureIndicatorSettings = objIndicatorSettings;
            return formFieldObject;
        }
    }
    private setHeightWidth(fieldBound : number, indicatorBound :number , referenceBound :number, zoomValue :number ) :number{
        let heightOrWidth :number;
        if(fieldBound / 2 > indicatorBound && referenceBound < indicatorBound){
            heightOrWidth = indicatorBound * zoomValue;
         }
         else if (referenceBound <= fieldBound / 2){
            heightOrWidth = referenceBound * zoomValue ;
         }
         else{
            heightOrWidth = fieldBound/2 * zoomValue;
         }
         return heightOrWidth;
     }  
    /**
     * @private
     */
    public createDropDownList(dropdownElement: DiagramHtmlElement, drawingObject: PdfFormFieldBaseModel): HTMLElement {
        const element: HTMLElement = createElement("div");
        element.className = "foreign-object";
        element.style.position = "absolute";
        element.style.width = "100%";
        element.style.height = "100%";
        let select = document.createElement("select");
        select.addEventListener('change', this.dropdownChange.bind(this));
        select.id = drawingObject.id;
        select.name = "editabledropdown" + this.pdfViewerBase.activeElements.activePageID + dropdownElement.id;
        select.className = "e-pv-formfield-dropdown";
        select.style.width = "100%";
        select.style.height = "100%";
        select.style.position = "absolute";
        this.updateDropdownFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        let dropDownChildren: ItemModel[] = drawingObject.options ? drawingObject.options : [];
        this.updateDropdownListProperties(drawingObject, select);
        for (let j: number = 0; j < dropDownChildren.length; j++) {
            var option = document.createElement("option");
            option.className = "e-pv-formfield-dropdown";
            option.value = dropDownChildren[j].itemValue;
            option.text = dropDownChildren[j].itemName;
            this.updateDropdownListProperties(drawingObject, option);
            select.appendChild(option);
        }
        select.selectedIndex = !isNullOrUndefined((drawingObject as any).selectedIndex) ? (drawingObject as any).selectedIndex : 0;
        element.appendChild(select);
        if (!isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip != "") {
            this.setToolTip(drawingObject.tooltip, element);
        }
        return element;
    }

    /**
     * @private
     */
    public createListBox(listBoxElement: DiagramHtmlElement, drawingObject: PdfFormFieldBaseModel): HTMLElement {
        const element: HTMLElement = createElement("div");
        element.className = "foreign-object";
        element.style.position = "absolute";
        element.style.width = "100%";
        element.style.height = "100%";
        let select = document.createElement("select");
        select.addEventListener('click', this.listBoxChange.bind(this));
        select.id = drawingObject.id;
        select.name = "editabledropdown" + this.pdfViewerBase.activeElements.activePageID + listBoxElement.id;
        select.className = "e-pv-formfield-listbox";
        select.style.width = "100%";
        select.style.height = "100%";
        select.style.position = "absolute";
        select.multiple = true;
        this.updatelistBoxFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        let dropDownChildren: ItemModel[] = drawingObject.options ? drawingObject.options : [];
        this.updateListBoxProperties(drawingObject, select);
        for (let j: number = 0; j < dropDownChildren.length; j++) {
            var option = document.createElement("option");
            option.className = "e-pv-formfield-listbox";
            option.value = dropDownChildren[j].itemValue;
            option.text = dropDownChildren[j].itemName;
            if (!isNullOrUndefined((drawingObject as any).selectedIndex)) {
                for (let k: number = 0; k < (drawingObject as any).selectedIndex.length; k++) {
                    if (j === (drawingObject as any).selectedIndex[k]) {
                        option.selected = true;
                    }
                }
            }
            select.appendChild(option);
        }
        element.appendChild(select);
        if (!isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip != "") {
            this.setToolTip(drawingObject.tooltip, element);
        }
        return element;
    }

    /**
     * @private
     */
    public createInputElement(formFieldAnnotationType: string, drawingObject: PdfFormFieldBaseModel, formFieldBounds?: any, isPrint?: boolean): HTMLElement {
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        const element: HTMLElement = createElement("div");
        element.className = "foreign-object";
        element.style.position = "absolute";
        element.style.width = "100%";
        element.style.height = "100%";
        let labelElement: HTMLElement;
        let checkboxDiv: HTMLElement;
        let innerSpan: HTMLElement;
        let inputElement: HTMLElement = createElement("input");
        let textArea: HTMLElement = createElement('textarea');
        inputElement.id = drawingObject.id;
        inputElement.style.position = "absolute";
        if (formFieldAnnotationType === "Textbox") {
            if (drawingObject.isMultiline) {
                textArea = this.createTextAreaElement(inputElement.id);
                this.updateTextFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
                this.updateTextboxProperties(drawingObject, textArea);
            } else {
                inputElement = this.createTextboxElement(inputElement.id);
                this.updateTextFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
                this.updateTextboxProperties(drawingObject, inputElement);
            }
        } else if (formFieldAnnotationType == "Checkbox") {
            let minCheckboxWidth: number = 20;
            element.style.textAlign = (Browser.info.name === "chrome") ? "-webkit-center" : "center";
            element.style.display = "flex";
            element.style.alignItems = "center";
            let bounds: any = this.getCheckboxRadioButtonBounds(drawingObject, formFieldBounds);
            element.style.display = bounds.display;
            labelElement = createElement("label", { className: "e-pv-checkbox-container" });
            labelElement.style.width = bounds.width + "px";
            labelElement.style.height = bounds.height + "px";
            if (this.isDrawHelper)
                labelElement.style.cursor = 'crosshair';
            else
                labelElement.style.cursor = 'pointer';
            checkboxDiv = createElement("div", { className: "e-pv-checkbox-div" });
            checkboxDiv.addEventListener('click', this.setCheckBoxState.bind(this));
            (checkboxDiv as HTMLElement).id = drawingObject.id + "_input";
            if (drawingObject.isChecked) {
                innerSpan = createElement("span", { className: "e-pv-checkbox-span e-pv-cb-checked" });
            }
            else
                innerSpan = createElement("span", { className: "e-pv-checkbox-span e-pv-cb-unchecked" });
            innerSpan.id = drawingObject.id + "_input_span";
            labelElement.id = drawingObject.id + "_input_label";
            innerSpan.style.width = (bounds.width / 5) + "px";
            innerSpan.style.height = (bounds.height / 2.5) + "px";
            innerSpan.style.left = (bounds.width / 2.5) + "px";
            innerSpan.style.top = (bounds.height / 5) + "px";
            if (innerSpan.className.indexOf("e-pv-cb-checked") !== -1) {
                let checkboxWidth = parseInt(labelElement.style.width, 10)
                if (checkboxWidth > minCheckboxWidth) {
                    innerSpan.style.borderWidth = "3px";
                } else if (checkboxWidth <= 15) {
                    innerSpan.style.borderWidth = "1px";
                } else {
                    innerSpan.style.borderWidth = "2px";
                }
            }
            (inputElement as IElement).type = "checkbox";
            inputElement.style.margin = "0px";
            inputElement.style.width = bounds.width + "px";
            inputElement.style.height = bounds.height + "px";
            if (isPrint) {
                this.updateCheckboxProperties(drawingObject, inputElement);
            } else {
                this.updateCheckBoxFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
                this.updateCheckboxProperties(drawingObject, checkboxDiv);
            }
            labelElement.appendChild(inputElement);
            labelElement.appendChild(checkboxDiv);
            checkboxDiv.appendChild(innerSpan);
            if (isPrint) {
                inputElement.style.outlineWidth = drawingObject.thickness + 'px';
                inputElement.style.outlineColor = drawingObject.borderColor;
                inputElement.style.outlineStyle = 'solid';
                inputElement.style.background = drawingObject.backgroundColor;
            }
        } else if (formFieldAnnotationType == "PasswordField") {
            (inputElement as IElement).type = "password";
            inputElement.className = "e-pv-formfield-input";
            inputElement.style.width = '100%';
            inputElement.style.height = '100%';
            inputElement.addEventListener('click', this.inputElementClick.bind(this));
            inputElement.addEventListener('change', this.getTextboxValue.bind(this));
            this.updatePasswordFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
            this.updatePasswordFieldProperties(drawingObject, inputElement);
        } else {
            /*
            The below line have been commented for "EJ2-59941 bug"
            While setting the textAlign to center the radio button position moved from center to the parent element 
            instead of left to the parent element
            element.style.textAlign = (Browser.info.name === "chrome") ? "-webkit-center" : "center";
            */
            element.style.display = "flex";
            element.style.alignItems = "center";
            let bounds: any = this.getCheckboxRadioButtonBounds(drawingObject, formFieldBounds);
            element.style.display = bounds.display;
            labelElement = createElement("label", { className: "e-pv-radiobtn-container" });
            labelElement.style.width = bounds.width + "px";
            labelElement.style.height = bounds.height + "px";
            labelElement.style.display = "table";
            labelElement.style.verticalAlign = "middle";
            labelElement.style.boxShadow = drawingObject.borderColor + ' 0px 0px 0px ' + drawingObject.thickness + 'px';
            labelElement.style.borderRadius = '50%';
            labelElement.style.visibility = drawingObject.visibility;
            if (this.isDrawHelper)
                labelElement.style.cursor = 'crosshair';
            else
                labelElement.style.cursor = 'pointer';
            labelElement.style.background = drawingObject.backgroundColor;
            innerSpan = createElement("span", { className: "e-pv-radiobtn-span" });
            innerSpan.id = drawingObject.id;
            innerSpan.style.width = Math.floor(bounds.width / 2) + "px";
            innerSpan.style.height = Math.floor(bounds.height / 2) + "px";
            if (zoomValue < 1 && bounds.width <= 20 && bounds.height <= 20) {
                innerSpan.style.margin = Math.round(parseInt(labelElement.style.width) / 3.5) + "px";
            } else {
                innerSpan.style.margin = Math.round(parseInt(labelElement.style.width) / 4) + "px";
            }
            labelElement.addEventListener('click', this.setRadioButtonState.bind(this));
            labelElement.id = drawingObject.id + "_input_label";
            (inputElement as IElement).type = "radio";
            if (!isPrint)
                inputElement.className = "e-pv-radio-btn";
            inputElement.style.margin = "0px";
            inputElement.addEventListener('click', function (event) {
                event.stopPropagation();
            });
            inputElement.style.width = bounds.width + "px";
            inputElement.style.height = bounds.height + "px";
            this.updateRadioButtonFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
            this.updateRadioButtonProperties(drawingObject, inputElement);
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
        if ((formFieldAnnotationType === "Checkbox" || formFieldAnnotationType === "RadioButton") && !isPrint) {
            element.appendChild(labelElement);
        } else {
            if (drawingObject.isMultiline) {
                element.appendChild(textArea);
            } else {
                element.appendChild(inputElement);
            }
        }
        if (!isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip != "") {
            if (formFieldAnnotationType === 'RadioButton')
                this.setToolTip(drawingObject.tooltip, labelElement);
            else
                this.setToolTip(drawingObject.tooltip, element);
        }
        this.isDrawHelper = false;
        return element;
    }

    private listBoxChange(event: Event) {
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[i].Key.split("_")[0] === (event.currentTarget as Element).id.split("_")[0] ||
                (this.pdfViewer.nameTable as any)[(event.currentTarget as Element).id.split("_")[0]].name === formFieldsData[i].FormField.name) {
                if (formFieldsData[i].Key.split("_")[0] !== (event.currentTarget as Element).id.split("_")[0]) {
                    let inputElement: Element = document.getElementById((formFieldsData[i].Key.split("_")[0] + "_content_html_element")).firstElementChild.firstElementChild;
                    for (let k: number = 0; k < (event.currentTarget as IElement).options.length; k++) {
                        (inputElement as IElement).options[k].selected = (event.currentTarget as IElement).options[k].selected;
                    }
                }
                formFieldsData[i].FormField.selectedIndex = [];
                var oldValues = this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex;

                for (let j: number = 0; j < (event.currentTarget as IElement).selectedOptions.length; j++) {
                    let selectIndex: number = (event.currentTarget as IElement).selectedOptions[j].index;
                    let oldValueIndex: number = 0;
                    if (this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex && this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex.length !== 0) {
                        oldValueIndex = this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex.pop();
                        this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex.push(oldValueIndex);
                    }
                    let oldValue = formFieldsData[i].FormField.option[oldValueIndex].itemValue;
                    formFieldsData[i].FormField.selectedIndex.push(selectIndex);
                    (this.pdfViewer.nameTable as any)[formFieldsData[i].Key.split("_")[0]].selectedIndex = formFieldsData[i].FormField.selectedIndex;
                    this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex = formFieldsData[i].FormField.selectedIndex;
                    let newValue = formFieldsData[i].FormField.option[selectIndex].itemValue;
                    this.pdfViewerBase.formFieldCollection[i].FormField.value = newValue;
                    this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[i].FormField);
                    this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", formFieldsData[i].FormField, this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, true, false, false,
                        false, false, false, false, false, false, false, false,
                        false, false, false, false, oldValue, newValue);
                }
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[i].FormField, 'FormField Value Change', '', oldValues, this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }
    private dropdownChange(event: Event) {
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[i].Key.split("_")[0] === (event.target as Element).id.split("_")[0] ||
                (this.pdfViewer.nameTable as any)[(event.target as Element).id.split("_")[0]].name === formFieldsData[i].FormField.name) {
                this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex = [];
                let selectIndex: number = (document.getElementById((event.currentTarget as Element).id) as IElement).selectedIndex;
                let oldValueIndex: number = 0;
                if (formFieldsData[i].FormField.selectedIndex.length !== 0) {
                    oldValueIndex = formFieldsData[i].FormField.selectedIndex.pop();
                    formFieldsData[i].FormField.selectedIndex.push(oldValueIndex);
                }
                let oldValue = formFieldsData[i].FormField.option[oldValueIndex].itemValue;
                formFieldsData[i].FormField.selectedIndex.push(selectIndex);
                (this.pdfViewer.nameTable as any)[formFieldsData[i].Key.split("_")[0]].selectedIndex = selectIndex;
                this.pdfViewerBase.formFieldCollection[i].FormField.selectedIndex.push(selectIndex);
                let newValue = formFieldsData[i].FormField.option[selectIndex].itemValue;
                this.pdfViewerBase.formFieldCollection[i].FormField.value = newValue;
                if (formFieldsData[i].Key.split("_")[0] !== (event.target as Element).id.split("_")[0]) {
                    let inputElement: Element = document.getElementById((formFieldsData[i].Key.split("_")[0] + "_content_html_element")).firstElementChild.firstElementChild;
                    (inputElement as IElement).selectedIndex = selectIndex;
                }
                this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[i].FormField);
                this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", formFieldsData[i].FormField, this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, true, false, false,
                    false, false, false, false, false, false, false, false,
                    false, false, false, false, oldValue, newValue);
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[i].FormField, 'FormField Value Change', '', oldValueIndex, selectIndex);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    private setCheckBoxState(event: Event) {
        let minCheckboxWidth: number = 20;
        let isChecked: boolean = false;
        if (!(this.pdfViewer.nameTable as any)[(event.target as Element).id.split("_")[0]].isReadonly) {
            if (event.target && (event.target as Element).firstElementChild && (event.target as any).firstElementChild.className === "e-pv-checkbox-span e-pv-cb-checked") {
                (event.target as Element).firstElementChild.classList.remove("e-pv-cb-checked");
                (event.target as Element).firstElementChild.classList.add("e-pv-checkbox-span", "e-pv-cb-unchecked");
                isChecked = false;
            } else if ((event.target as Element).className === "e-pv-checkbox-span e-pv-cb-checked") {
                (event.target as Element).classList.remove("e-pv-cb-checked");
                (event.target as Element).classList.add("e-pv-checkbox-span", "e-pv-cb-unchecked");
                isChecked = false;
            } else {
                (event.target as Element).firstElementChild.classList.remove("e-pv-cb-unchecked");
                (event.target as Element).firstElementChild.classList.add("e-pv-checkbox-span", "e-pv-cb-checked");
                isChecked = true;
            }
            var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            if (isChecked) {
                if ((event.target as Element).firstElementChild.className.indexOf("e-pv-cb-checked") !== -1) {
                    let checkboxWidth = parseInt((event.target as any).parentElement.style.width, 10)
                    if (checkboxWidth > minCheckboxWidth) {
                        (event.target as any).firstElementChild.style.borderWidth = "3px";
                    } else if (checkboxWidth <= 15) {
                        (event.target as any).firstElementChild.style.borderWidth = "1px";
                    } else {
                        (event.target as any).firstElementChild.style.borderWidth = "2px";
                    }
                }
            }
            var formFieldsData = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[i].Key.split("_")[0] === (event.target as Element).id.split("_")[0] ||
                    (this.pdfViewer.nameTable as any)[(event.target as Element).id.split("_")[0]].name === formFieldsData[i].FormField.name) {
                    (this.pdfViewer.nameTable as any)[formFieldsData[i].Key.split("_")[0]].isChecked = isChecked;
                    let oldValue = this.pdfViewerBase.formFieldCollection[i].FormField.isChecked;
                    formFieldsData[i].FormField.isChecked = isChecked;
                    this.pdfViewerBase.formFieldCollection[i].FormField.isChecked = formFieldsData[i].FormField.isChecked;
                    if (formFieldsData[i].Key.split("_")[0] !== (event.target as Element).id.split("_")[0]) {
                        let checkboxElement: Element = document.getElementById(formFieldsData[i].Key.split("_")[0] + "_input").firstElementChild;
                        if (isChecked) {
                            if (checkboxElement.classList.contains('e-pv-cb-unchecked'))
                                checkboxElement.classList.remove('e-pv-cb-unchecked');
                            checkboxElement.classList.add("e-pv-cb-checked");
                        } else {
                            if (checkboxElement.classList.contains('e-pv-cb-checked'))
                                checkboxElement.classList.remove('e-pv-cb-checked');
                            checkboxElement.classList.add("e-pv-cb-unchecked");
                        }
                    }
                    this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[i].FormField);
                    this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", formFieldsData[i].FormField, this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, true, false, false,
                        false, false, false, false, false, false, false, false,
                        false, false, false, false, oldValue, isChecked);
                    if (this.pdfViewer.annotation) {
                        this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[i].FormField, 'FormField Value Change', '', oldValue, isChecked);
                    }
                }
            }
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        }
    }

    private setCheckedValue(element: Element, isChecked?: boolean): void {
        if (isChecked) {
            element.firstElementChild.classList.remove("e-pv-cb-unchecked");
            element.firstElementChild.classList.add("e-pv-checkbox-span", "e-pv-cb-checked");
        } else {
            element.firstElementChild.classList.remove("e-pv-cb-checked");
            element.firstElementChild.classList.add("e-pv-checkbox-span", "e-pv-cb-unchecked");
        }
    }

    private setRadioButtonState(event: Event) {
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[i].FormField.radiobuttonItem != null) {
                let oldValue;
                let undoElement;
                let redoElement;
                for (let j: number = 0; j < formFieldsData[i].FormField.radiobuttonItem.length; j++) {
                    if (formFieldsData[i].FormField.radiobuttonItem[j].id.split("_")[0] === (event.currentTarget as Element).id.split("_")[0]) {
                        (this.pdfViewer.nameTable as any)[(event.currentTarget as Element).id.split("_")[0]].isSelected = true;
                        formFieldsData[i].FormField.radiobuttonItem[j].isSelected = true;
                        oldValue = this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].isSelected;
                        if (!oldValue)
                            undoElement = this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j];
                        this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].isSelected = true;
                        this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", formFieldsData[i].FormField, this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, true, false, false,
                            false, false, false, false, false, false, false, false,
                            false, false, false, false, false, true);
                    } else {
                        if ((this.pdfViewer.nameTable as any)[(event.currentTarget as Element).id.split("_")[0]].name === formFieldsData[i].FormField.radiobuttonItem[j].name) {
                            (this.pdfViewer.nameTable as any)[formFieldsData[i].FormField.radiobuttonItem[j].id.split("_")[0]].isSelected = false;
                            let oldValue = this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].isSelected;
                            formFieldsData[i].FormField.radiobuttonItem[j].isSelected = false;
                            oldValue = this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].isSelected;
                            if (oldValue)
                                redoElement = this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j];
                            this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j].isSelected = formFieldsData[i].FormField.radiobuttonItem[j].isSelected;
                            this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", formFieldsData[i].FormField, this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, true, false, false,
                                false, false, false, false, false, false, false, false,
                                false, false, false, false, true, false);
                        }
                    }
                    this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[j]);
                }
                if ((undoElement != null || redoElement != null) && this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[i].FormField, 'FormField Value Change', '', undoElement, redoElement);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    private getTextboxValue(event: Event): void {
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[i].Key.split("_")[0] === (event.target as Element).id.split("_")[0] ||
                (this.pdfViewer.nameTable as any)[(event.target as Element).id.split("_")[0]].name === formFieldsData[i].FormField.name) {
                let oldValue = this.pdfViewerBase.formFieldCollection[i].FormField.value;
                formFieldsData[i].FormField.value = (event.target as IElement).value;
                (this.pdfViewer.nameTable as any)[formFieldsData[i].Key.split("_")[0]].value = formFieldsData[i].FormField.value;
                this.pdfViewerBase.formFieldCollection[i].FormField.value = formFieldsData[i].FormField.value;
                if (formFieldsData[i].Key.split("_")[0] !== (event.target as Element).id.split("_")[0]) {
                    let element: Element = document.getElementById(formFieldsData[i].Key.split("_")[0] + "_content_html_element");
                    if (element && element.firstElementChild && element.firstElementChild.firstElementChild) {
                        let inputElement: Element = element.firstElementChild.firstElementChild;
                        (inputElement as IElement).value = formFieldsData[i].FormField.value;
                    }
                }
                this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[i].FormField);
                this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", this.pdfViewerBase.formFieldCollection[i].FormField, this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, true, false, false,
                    false, false, false, false, false, false, false, false,
                    false, false, false, false, oldValue, (event.target as IElement).value);
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[i].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[i].FormField, 'FormField Value Change', '', oldValue, (event.target as IElement).value);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    private inputElementClick(event: any): void {
        event.target.focus();
    }

    /**
     * Adds form field to the PDF page.
     * 
     * @param formFieldType
     * @param options
     * @returns HTMLElement
     */
    public addFormField(formFieldType: FormFieldType,
        options?: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings | DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings | SignatureFieldSettings | InitialFieldSettings, isCollection?: boolean, id?: string): HTMLElement {
        let obj: PdfFormFieldBaseModel = {
            thickness: 0, bounds: { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height },
            fontFamily: !isNullOrUndefined((options as TextFieldSettings).fontFamily) ? (options as TextFieldSettings).fontFamily : "Helvetica", fontSize: !isNullOrUndefined((options as TextFieldSettings).fontSize) ? (options as TextFieldSettings).fontSize : 10,
            color: !isNullOrUndefined((options as TextFieldSettings).color) ? (options as TextFieldSettings).color : "black", backgroundColor: !isNullOrUndefined((options as TextFieldSettings).backgroundColor) ? (options as TextFieldSettings).backgroundColor : "#daeaf7ff",
            alignment: !isNullOrUndefined((options as TextFieldSettings).alignment) ? (options as TextFieldSettings).alignment : "left", isReadonly: options.isReadOnly ? options.isReadOnly : false, rotateAngle: (options as any).rotateAngle
        };
        (obj as any).fontStyle = !isNullOrUndefined((options as TextFieldSettings).fontStyle) ? (options as TextFieldSettings).fontStyle : "None";
        obj.visibility = !isNullOrUndefined(options.visibility) ? options.visibility : "visible";
        obj.value = !isNullOrUndefined((options as TextFieldSettings).value) ? (options as TextFieldSettings).value : "";
        obj.isRequired = options.isRequired ? options.isRequired : false;
        obj.isPrint = options.isPrint;
        obj.pageNumber = !isNullOrUndefined(options.pageNumber) ? options.pageNumber : this.pdfViewerBase.currentPageNumber;
        obj.pageIndex = obj.pageNumber - 1;
        obj.font = (options as any).font;
        obj.id = id;
        if (isCollection) {
            this.setFormFieldIndex();
        }
        switch (formFieldType) {
            case 'Textbox':
                obj.formFieldAnnotationType = formFieldType;
                obj.isMultiline = (options as TextFieldSettings).isMultiline;
                obj.name = !isNullOrUndefined(options.name) ? options.name : 'Textbox' + this.formFieldIndex;
                obj.maxLength = (options as any).maxLength;
                obj.thickness = !isNullOrUndefined((options as TextFieldSettings).thickness) ? (options as TextFieldSettings).thickness : 1;
                obj.borderColor = !isNullOrUndefined((options as TextFieldSettings).borderColor) ? (options as TextFieldSettings).borderColor : '#303030';
                break;
            case 'Password':
                obj.formFieldAnnotationType = 'PasswordField';
                obj.name = !isNullOrUndefined(options.name) ? options.name : 'Password' + this.formFieldIndex;
                obj.maxLength = (options as any).maxLength;
                obj.thickness = !isNullOrUndefined((options as PasswordFieldSettings).thickness) ? (options as PasswordFieldSettings).thickness : 1;
                obj.borderColor = !isNullOrUndefined((options as PasswordFieldSettings).borderColor) ? (options as PasswordFieldSettings).borderColor : '#303030';
                break;
            case 'DropDown':
                obj.formFieldAnnotationType = 'DropdownList';
                obj.name = !isNullOrUndefined(options.name) ? options.name : 'Dropdown' + this.formFieldIndex;
                obj.options = (options as DropdownFieldSettings).options ? (options as DropdownFieldSettings).options : [];
                for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                    let formField = this.pdfViewer.formFieldCollection[i] as PdfFormFieldBaseModel;
                    if (formField.formFieldAnnotationType === 'DropdownList' && formField.name === obj.name) {
                        obj.options = formField.options;
                        break;
                    }
                }
                obj.selectedIndex = (options as any).selectedIndex;
                obj.thickness = !isNullOrUndefined((options as DropdownFieldSettings).thickness) ? (options as DropdownFieldSettings).thickness : 1;
                obj.borderColor = !isNullOrUndefined((options as DropdownFieldSettings).borderColor) ? (options as DropdownFieldSettings).borderColor : '#303030';
                break;
            case 'ListBox':
                obj.formFieldAnnotationType = formFieldType;
                obj.name = !isNullOrUndefined(options.name) ? options.name : 'List Box' + this.formFieldIndex;
                obj.options = (options as ListBoxFieldSettings).options ? (options as DropdownFieldSettings).options : [];
                for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                    let formField = this.pdfViewer.formFieldCollection[i] as PdfFormFieldBaseModel;
                    if (formField.formFieldAnnotationType === formFieldType && formField.name === obj.name) {
                        obj.options = formField.options;
                        break;
                    }
                }
                obj.selectedIndex = (options as any).selectedIndex;
                obj.thickness = !isNullOrUndefined((options as ListBoxFieldSettings).thickness) ? (options as ListBoxFieldSettings).thickness : 1;
                obj.borderColor = !isNullOrUndefined((options as ListBoxFieldSettings).borderColor) ? (options as ListBoxFieldSettings).borderColor : '#303030';
                break;
            case 'CheckBox':
                obj.formFieldAnnotationType = 'Checkbox';
                obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
                obj.backgroundColor = !isNullOrUndefined((options as CheckBoxFieldSettings).backgroundColor) ? (options as CheckBoxFieldSettings).backgroundColor : "#daeaf7ff";
                obj.isReadonly = options.isReadOnly ? options.isReadOnly : false;
                obj.name = !isNullOrUndefined(options.name) ? options.name : 'Check Box' + this.formFieldIndex;
                obj.isChecked = (options as CheckBoxFieldSettings).isChecked ? (options as CheckBoxFieldSettings).isChecked : false;
                obj.visibility = options.visibility ? options.visibility : "visible";
                obj.isRequired = options.isRequired ? options.isRequired : false;
                obj.thickness = !isNullOrUndefined((options as CheckBoxFieldSettings).thickness) ? (options as CheckBoxFieldSettings).thickness : 1;
                obj.borderColor = !isNullOrUndefined((options as CheckBoxFieldSettings).borderColor) ? (options as CheckBoxFieldSettings).borderColor : '#303030';
                break;
            case 'RadioButton':
                obj.formFieldAnnotationType = formFieldType;
                obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
                obj.backgroundColor = !isNullOrUndefined((options as RadioButtonFieldSettings).backgroundColor) ? (options as RadioButtonFieldSettings).backgroundColor : "#daeaf7ff";
                obj.isReadonly = options.isReadOnly ? options.isReadOnly : false;
                obj.name = !isNullOrUndefined(options.name) ? options.name : 'Radio Button' + this.formFieldIndex;
                obj.isSelected = (options as RadioButtonFieldSettings).isSelected ? (options as RadioButtonFieldSettings).isSelected : false;
                obj.visibility = options.visibility ? options.visibility : "visible";
                obj.isRequired = options.isRequired ? options.isRequired : false;
                obj.thickness = !isNullOrUndefined((options as RadioButtonFieldSettings).thickness) ? (options as RadioButtonFieldSettings).thickness : 1;
                obj.borderColor = !isNullOrUndefined((options as RadioButtonFieldSettings).borderColor) ? (options as RadioButtonFieldSettings).borderColor : '#303030';
                break;
            case 'SignatureField':
                obj.formFieldAnnotationType = formFieldType;
                obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
                obj.backgroundColor = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).backgroundColor) ? (options as unknown as SignatureIndicatorSettings).backgroundColor : "#daeaf7ff";
                obj.fontSize = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).fontSize) ? (options as unknown as SignatureIndicatorSettings).fontSize : 10;
                (obj as any).fontStyle = !isNullOrUndefined((options as TextFieldSettings).fontStyle) ? (options as TextFieldSettings).fontStyle : "None";
                obj.name = !isNullOrUndefined(options.name) ? options.name : 'Signature' + this.formFieldIndex;
                obj.isRequired = options.isRequired ? options.isRequired : false;
                obj.isReadonly = options.isReadOnly ? options.isReadOnly : false;
                obj.signatureIndicatorSettings = (options as SignatureFieldSettings).signatureIndicatorSettings ? {opacity: (options as SignatureFieldSettings).signatureIndicatorSettings.opacity ? (options as SignatureFieldSettings).signatureIndicatorSettings.opacity: 1 ,
                    backgroundColor: (options as SignatureFieldSettings).signatureIndicatorSettings.backgroundColor ? (options as SignatureFieldSettings).signatureIndicatorSettings.backgroundColor : 'orange', width: (options as SignatureFieldSettings).signatureIndicatorSettings.width ? (options as SignatureFieldSettings).signatureIndicatorSettings.width : 19,
                    height: (options as SignatureFieldSettings).signatureIndicatorSettings.height ? (options as SignatureFieldSettings).signatureIndicatorSettings.height : 10, fontSize: (options as SignatureFieldSettings).signatureIndicatorSettings.fontSize ? (options as SignatureFieldSettings).signatureIndicatorSettings.fontSize : 10,
                    text: (options as SignatureFieldSettings).signatureIndicatorSettings.text? (options as SignatureFieldSettings).signatureIndicatorSettings.text: null,  color: (options as SignatureFieldSettings).signatureIndicatorSettings.color? (options as SignatureFieldSettings).signatureIndicatorSettings.color: 'black'  }: null;
                break;
            case 'InitialField':
                obj.formFieldAnnotationType = formFieldType;
                obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
                obj.backgroundColor = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).backgroundColor) ? (options as unknown as SignatureIndicatorSettings).backgroundColor : "#daeaf7ff";
                obj.fontSize = !isNullOrUndefined((options as unknown as SignatureIndicatorSettings).fontSize) ? (options as unknown as SignatureIndicatorSettings).fontSize : 10;
                (obj as any).fontStyle = !isNullOrUndefined((options as TextFieldSettings).fontStyle) ? (options as TextFieldSettings).fontStyle : "None";
                (obj as any).name = !isNullOrUndefined(options.name) ? options.name : 'Initial' + this.formFieldIndex;
                (obj as any).isRequired = options.isRequired ? options.isRequired : false;
                (obj as any).isReadonly = options.isReadOnly ? options.isReadOnly : false;
                (obj as any).isInitialField = true;
                obj.signatureIndicatorSettings = (options as SignatureFieldSettings).signatureIndicatorSettings ? {opacity: (options as SignatureFieldSettings).signatureIndicatorSettings.opacity ? (options as SignatureFieldSettings).signatureIndicatorSettings.opacity: 1 ,
                    backgroundColor: (options as SignatureFieldSettings).signatureIndicatorSettings.backgroundColor ? (options as SignatureFieldSettings).signatureIndicatorSettings.backgroundColor : 'orange', width: (options as SignatureFieldSettings).signatureIndicatorSettings.width ? (options as SignatureFieldSettings).signatureIndicatorSettings.width : 19,
                    height: (options as SignatureFieldSettings).signatureIndicatorSettings.height ? (options as SignatureFieldSettings).signatureIndicatorSettings.height : 10, fontSize: (options as SignatureFieldSettings).signatureIndicatorSettings.fontSize ? (options as SignatureFieldSettings).signatureIndicatorSettings.fontSize : 10,
                    text: (options as SignatureFieldSettings).signatureIndicatorSettings.text? (options as SignatureFieldSettings).signatureIndicatorSettings.text: null,  color: (options as SignatureFieldSettings).signatureIndicatorSettings.color? (options as SignatureFieldSettings).signatureIndicatorSettings.color: 'black'  }: null;
                break;
        }
        obj.tooltip = !isNullOrUndefined(options.tooltip) ? options.tooltip : '';
        let HTMLElement = null;
        if (isCollection) {
            this.addFieldCollection(obj);
        } else {
            this.pdfViewerBase.disableTextSelectionMode();
            HTMLElement = this.drawFormField(obj);
        }
        return HTMLElement;
    }

    public addFieldCollection(node: any): void {
        let formField: FormFieldModel = {
            id: randomId(), name: (node as PdfFormFieldBaseModel).name, value: (node as PdfFormFieldBaseModel).value,
            type: node.formFieldAnnotationType as FormFieldType, isReadOnly: node.isReadonly, fontFamily: node.fontFamily,
            fontSize: node.fontSize, fontStyle: node.fontStyle as unknown as FontStyle, color: (node as PdfFormFieldBaseModel).color, backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, isMultiline: (node as PdfFormFieldBaseModel).isMultiline,
            alignment: (node as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (node as PdfFormFieldBaseModel).visibility, maxLength: (node as PdfFormFieldBaseModel).maxLength, isRequired: (node as PdfFormFieldBaseModel).isRequired,
            isPrint: node.isPrint, isSelected: (node as PdfFormFieldBaseModel).isSelected, isChecked: (node as PdfFormFieldBaseModel).isChecked, tooltip: (node as PdfFormFieldBaseModel).tooltip, bounds: node.bounds as IFormFieldBound, thickness: node.thickness, pageIndex: node.pageIndex, borderColor: (node as PdfFormFieldBaseModel).borderColor, signatureIndicatorSettings: (node as PdfFormFieldBaseModel).signatureIndicatorSettings
        };
        this.pdfViewer.formFieldCollections.push(formField);
    }

    /**
     * @private
     */
    public drawFormField(obj: PdfFormFieldBaseModel) {
        let node = this.pdfViewer.add(obj as PdfAnnotationBase);
        let index: number = this.pdfViewer.formFieldCollections.findIndex(function (el) { return el.id === node.id; });
        // eslint-disable-next-line
        let data: any
        if (index > -1) {
            data = this.pdfViewer.formFieldCollections[index];
            if (this.isFormFieldUpdated) {
                this.updateNodeBasedOnCollections(node, data);
            }
        }
        let formFieldIndex: number = this.pdfViewer.formFieldCollection.findIndex(function (el) { return el.id === node.id; });
        if (formFieldIndex < 0) {
            this.pdfViewer.formFieldCollection.push(node);
        } else if (formFieldIndex > -1) {
            this.pdfViewer.formFieldCollection[formFieldIndex] = node;
        }
        let formField: FormFieldModel = {
            id: node.id, name: (node as PdfFormFieldBaseModel).name, value: (node as PdfFormFieldBaseModel).value,
            type: node.formFieldAnnotationType as FormFieldType, isReadOnly: node.isReadonly, fontFamily: node.fontFamily,
            fontSize: node.fontSize, fontStyle: node.fontStyle as unknown as FontStyle, color: (node as PdfFormFieldBaseModel).color, backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, isMultiline: (node as PdfFormFieldBaseModel).isMultiline,
            alignment: (node as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (node as PdfFormFieldBaseModel).visibility, maxLength: (node as PdfFormFieldBaseModel).maxLength, isRequired: (node as PdfFormFieldBaseModel).isRequired,
            isPrint: node.isPrint, isSelected: (node as PdfFormFieldBaseModel).isSelected, isChecked: (node as PdfFormFieldBaseModel).isChecked, tooltip: (node as PdfFormFieldBaseModel).tooltip, bounds: node.bounds as IFormFieldBound, pageIndex: node.pageIndex, thickness: node.thickness, borderColor: (node as PdfFormFieldBaseModel).borderColor, signatureIndicatorSettings: (node as PdfFormFieldBaseModel).signatureIndicatorSettings
        };
        if (index > -1) {
            this.pdfViewer.formFieldCollections[index] = formField;
        } else {
            this.pdfViewer.formFieldCollections.push(formField);
        }
        let HTMLElement = this.drawHTMLContent(node.formFieldAnnotationType, node.wrapper.children[0] as DiagramHtmlElement, node, obj.pageNumber - 1, this.pdfViewer);
        return HTMLElement;
    }

    /**
    * Update the node value based on the collections
    * 
    * @param node
    * @param data
    * @returns void
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
    }
    /**
     * Set the form field mode to add the form field on user interaction.
     * 
     * @param formFieldId
     * @param options
     * @returns void
     */
    public setFormFieldMode(formFieldType: FormFieldType,
        options?: Item[]): void {
        switch (formFieldType) {
            case 'Textbox':
                this.activateTextboxElement(formFieldType);
                this.isSetFormFieldMode = true;
                break;
            case 'Password':
                let passwordType: FormFieldAnnotationType = 'PasswordField';
                this.activatePasswordField(passwordType);
                this.isSetFormFieldMode = true;
                break;
            case 'CheckBox':
                let checkboxType: FormFieldAnnotationType = 'Checkbox';
                this.activateCheckboxElement(checkboxType);
                this.isSetFormFieldMode = true;
                break;
            case 'RadioButton':
                this.activateRadioButtonElement(formFieldType);
                this.isSetFormFieldMode = true;
                break;
            case 'DropDown':
                let dropdownType: FormFieldAnnotationType = 'DropdownList';
                this.activateDropDownListElement(dropdownType, options);
                this.isSetFormFieldMode = true;
                break;
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
     * @param formFieldId
     * @returns void
     */
    public resetFormField(formFieldId: string | object): void {
        let formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
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
     * @param formFieldId
     * @returns void
     */
    public selectFormField(formFieldId: string | object): void {
        let formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        if (formField) {
            this.isProgrammaticSelection = true;
            this.pdfViewer.select([formField.id]);
            this.isProgrammaticSelection = false;
        }
    }

    /**
     * Update the form field with the given properties and value.
     * 
     * @param formFieldId
     * @param options
     * @returns void
     */
    public updateFormField(formFieldId: string | object,
        options: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings | DropdownFieldSettings | RadioButtonFieldSettings): void {
        let formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        this.isFormFieldUpdated = true;
        if (formField) {
            switch (formField.formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                case 'DropdownList':
                case 'ListBox':
                case 'SignatureField':
                case 'InitialField':
                    let inputElement: Element = document.getElementById(formField.id + "_content_html_element");
                    if (inputElement) {
                        inputElement = inputElement.firstElementChild.firstElementChild;
                        this.formFieldPropertyChange(formField, options, inputElement as HTMLElement);
                    }
                    else {
                        this.updateFormFieldsInCollections(formFieldId, options);
                    }
                    break;
                case 'RadioButton':
                    let radioButtonDivDivElement: Element = document.getElementById(formField.id + "_content_html_element");
                    if (radioButtonDivDivElement) {
                        radioButtonDivDivElement = radioButtonDivDivElement.firstElementChild.firstElementChild.firstElementChild;
                        this.formFieldPropertyChange(formField, options, radioButtonDivDivElement as HTMLElement);
                    }
                    else {
                        this.updateFormFieldsInCollections(formFieldId, options);
                    }
                    break;
                case 'Checkbox':
                    let checkboxDivElement: Element = document.getElementById(formField.id + "_content_html_element");
                    if (checkboxDivElement) {
                        checkboxDivElement = checkboxDivElement.firstElementChild.firstElementChild.lastElementChild;
                        this.formFieldPropertyChange(formField, options, checkboxDivElement as HTMLElement);
                    }
                    else {
                        this.updateFormFieldsInCollections(formFieldId, options);
                    }
                    break;
            }
        }
        else {
            this.updateFormFieldsInCollections(formFieldId, options);
        }
    }

    /**
    * Update the form field in the form field collections.
    * @param formFieldId
    * @param options
    * @returns void
    */
    private updateFormFieldsInCollections(formFieldId: any, options: any): void {
        let formFieldCollection: any = this.pdfViewer.formFieldCollections;
        for (let i: number = 0; i < formFieldCollection.length; i++) {
            let currentData: any = formFieldCollection[i];
            if (currentData.id === formFieldId) {
                this.updateFormFieldData(currentData, options);
                let formFieldIndex: number = this.pdfViewer.formFieldCollections.findIndex(function (el) { return el.id === formFieldId; });
                this.pdfViewer.formFieldCollections[formFieldIndex] = currentData;
            }
        }
    }

    /**
    * Update the form field data based on the value
    * @param currentData
    * @param options
    * @returns void
    */
    private updateFormFieldData(currentData: any, options: any): void {
        if (options.name && currentData.name !== options.name) {
            currentData.name = options.name;
        }
        if (currentData.type !== 'SignatureField' || currentData.type !== 'InitialField') {
            if (options.thickness && currentData.thickness !== options.thickness) {
                currentData.thickness = options.thickness;
            }
            if (options.borderColor) {
                var borderColor = this.colorNametoHashValue(options.borderColor);
                if (currentData.borderColor !== borderColor) {
                    currentData.borderColor = borderColor;
                }
            }
        }
        if (options.backgroundColor) {
            var backColor = this.colorNametoHashValue(options.backgroundColor);
            if (currentData.backgroundColor !== backColor) {
                currentData.backgroundColor = backColor;
            }
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
                var color = this.colorNametoHashValue((options as any).color);
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
    public getSignatureBackground(color: string) {
        if (color.includes('#')) {
            if (color.length > 8) {
                color = color.slice(0, -2) + '60';
            }
            else {
                color += '60'
            }
        }
        return color;
    }
    private formFieldPropertyChange(formFieldObject: PdfFormFieldBaseModel,
        options: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings | DropdownFieldSettings | RadioButtonFieldSettings, htmlElement: HTMLElement): void {
        let isValueChanged: boolean = false, isFontFamilyChanged: boolean = false, isFontSizeChanged: boolean = false, isFontStyleChanged: boolean = false, isColorChanged: boolean = false,
            isBackgroundColorChanged: boolean = false, isBorderColorChanged: boolean = false, isBorderWidthChanged: boolean = false, isAlignmentChanged: boolean = false, isReadOnlyChanged: boolean = false,
            isVisibilityChanged: boolean = false, isMaxLengthChanged: boolean = false, isRequiredChanged: boolean = false, isPrintChanged: boolean = false, isToolTipChanged: boolean = false, isNameChanged: boolean = false;
        let oldValue: any, newValue: any;
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        if (options.name) {
            if (formFieldObject.name !== options.name) {
                isNameChanged = true;
            }
            formFieldObject.name = options.name;
            let designerName = document.getElementById(formFieldObject.id + "_designer_name");
            designerName.innerHTML = formFieldObject.name;
            designerName.style.fontSize = formFieldObject.fontSize ? (formFieldObject.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
            (htmlElement as IElement).name = options.name;
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].name = formFieldObject.name;
            if (isNameChanged) {
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue, isNameChanged);
            }
        }
        if (formFieldObject.formFieldAnnotationType !== 'SignatureField') {
            if (options.thickness) {
                if (formFieldObject.thickness !== options.thickness) {
                    isBorderWidthChanged = true;
                    oldValue = formFieldObject.thickness;
                    newValue = options.thickness;
                }
                htmlElement.style.borderWidth = options.thickness.toString() + 'px';
                formFieldObject.thickness = options.thickness;
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].thickness = options.thickness;
                if (isBorderWidthChanged) {
                    this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                        false, false, false, false, isBorderWidthChanged, false, false, false, false, false, false, false, oldValue, newValue);
                }
            }
            if (options.borderColor) {
                let borderColor = this.colorNametoHashValue(options.borderColor);
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
                    this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                        false, false, false, isBorderColorChanged, false, false, false, false, false, false, false, false, oldValue, newValue);
                }
            }
        }
        if (options.backgroundColor) {
            let backColor = this.colorNametoHashValue(options.backgroundColor);
            backColor = this.getSignatureBackground(backColor);
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
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                    false, false, isBackgroundColorChanged, false, false, false, false, false, false, false, false, false, oldValue, newValue);
            }
        }
        if (options.bounds) {
            formFieldObject.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            let formField: PdfFormFieldBaseModel = (this.pdfViewer.nameTable as any)[formFieldObject.id.split("_")[0]];
            formField.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            formField.wrapper.bounds = new Rect(options.bounds.X, options.bounds.Y, options.bounds.Width, options.bounds.Height);
            this.pdfViewer.drawing.nodePropertyChange(formField, {
                bounds: {
                    x: formField.wrapper.bounds.x, y: formField.wrapper.bounds.y,
                    width: formField.wrapper.bounds.width, height: formField.wrapper.bounds.height
                }
            });
            var element = formField.wrapper.children[0];
            var point = cornersPointsBeforeRotation(formField.wrapper.children[0]).topLeft;
            let hEment = document.getElementById(element.id + "_html_element");
            if (!isNullOrUndefined(hEment)) {
                hEment.setAttribute(
                    'style', 'height:' + (element.actualSize.height * zoomValue) + 'px; width:' + (element.actualSize.width * zoomValue) +
                    'px;left:' + point.x * zoomValue + 'px; top:' + point.y * zoomValue + 'px;' +
                    'position:absolute;transform:rotate(' + (element.rotateAngle + element.parentTransform) + 'deg);' +
                    'pointer-events:' + ((this.pdfViewer.designerMode) ? 'none' : 'all')
                    + ';visibility:' + ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';'
                );
            }
        }
        if (!isNullOrUndefined(options.isReadOnly)) {
            if (formFieldObject.isReadonly !== options.isReadOnly) {
                isReadOnlyChanged = true;
                oldValue = formFieldObject.isReadonly;
                newValue = options.isReadOnly;
            }
            formFieldObject.isReadonly = options.isReadOnly;
            this.setReadOnlyToElement(formFieldObject, htmlElement, options.isReadOnly);
            this.setReadOnlyToFormField(formFieldObject, options.isReadOnly);
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].isReadonly = options.isReadOnly;
            if (isReadOnlyChanged) {
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                    false, false, false, false, false, false, isReadOnlyChanged, false, false, false, false, false, oldValue, newValue);
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
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                    false, false, false, false, false, false, false, false, false, isRequiredChanged, false, false, oldValue, newValue);
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
                let annotation: any = (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0] + "_content"];
                var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                var formFieldsData = JSON.parse(data);
                let index: number = this.getFormFiledIndex(formFieldObject.id.split('_')[0]);
                if (formFieldObject.visibility === "hidden") {
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
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                    false, false, false, false, false, false, false, isVisibilityChanged, false, false, false, false, oldValue, newValue);
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
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                    false, false, false, false, false, false, false, false, false, false, isPrintChanged, false, oldValue, newValue);
            }
        }
        if (options.tooltip) {
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
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                    false, false, false, false, false, false, false, false, false, false, false, isToolTipChanged, oldValue, newValue);
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'Checkbox' && (!isNullOrUndefined((options as CheckBoxFieldSettings).isChecked)) || (options as CheckBoxFieldSettings).isChecked) {
            if (formFieldObject.isChecked !== this.checkboxCheckedState) {
                isValueChanged = true;
                oldValue = formFieldObject.isChecked;
                newValue = (options as CheckBoxFieldSettings).isChecked;
            }
            formFieldObject.isChecked = (options as CheckBoxFieldSettings).isChecked;
            (htmlElement as IElement).checked = (options as CheckBoxFieldSettings).isChecked;
            this.setCheckedValue(htmlElement, (options as CheckBoxFieldSettings).isChecked);
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].isChecked = (options as CheckBoxFieldSettings).isChecked;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, isValueChanged, false, false,
                    false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'RadioButton' && (!isNullOrUndefined((options as RadioButtonFieldSettings).isSelected)) || (options as RadioButtonFieldSettings).isSelected) {
            if (formFieldObject.isSelected !== (options as RadioButtonFieldSettings).isSelected) {
                isValueChanged = true;
                oldValue = formFieldObject.isSelected;
                newValue = this.checkboxCheckedState;
            }
            formFieldObject.isSelected = (options as RadioButtonFieldSettings).isSelected;
            (htmlElement as IElement).checked = (options as RadioButtonFieldSettings).isSelected;
            (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].isSelected = (options as RadioButtonFieldSettings).isSelected;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, isValueChanged, false, false,
                    false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox') {
            if ((options as DropdownFieldSettings).options) {
                formFieldObject.options = (options as DropdownFieldSettings).options;
                this.updateDropDownListDataSource(formFieldObject, htmlElement);
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].options = formFieldObject.options;
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'Textbox' || formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType === 'InitialField' ||
            formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox'
            || formFieldObject.formFieldAnnotationType === 'PasswordField') {
            if ((options as TextFieldSettings).value) {
                if (formFieldObject.value !== (options as TextFieldSettings).value) {
                    isValueChanged = true;
                    oldValue = formFieldObject.value;
                    newValue = (options as TextFieldSettings).value;
                }
                formFieldObject.value = (options as TextFieldSettings).value;
                if (!(formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox')) {
                    (htmlElement as IElement).value = (options as TextFieldSettings).value;
                }
                else if( formFieldObject.formFieldAnnotationType === "DropdownList" || formFieldObject.formFieldAnnotationType === "ListBox")
                {
                    for(let i = 0 as number; i <  (htmlElement as IElement).options.length ; i++)
                    {
                        if((htmlElement as IElement).options[i].text === (options as TextFieldSettings).value){
                            (htmlElement as IElement).options.selectedIndex = i;
                        }                        
                    }
                }
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].value = (options as TextFieldSettings).value;
                if (isValueChanged) {
                    this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, isValueChanged, false, false,
                        false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
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
                    this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, isFontSizeChanged,
                        false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
                }
            }
            if ((options as any).color) {
                let color = this.colorNametoHashValue((options as any).color);
                if (formFieldObject.color !== color) {
                    isColorChanged = true;
                    oldValue = formFieldObject.color;
                    newValue = color;
                }
                formFieldObject.color = color;
                htmlElement.style.color = color;
                (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].color = color;
                if (isColorChanged) {
                    this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                        false, isColorChanged, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
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
                        this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                            false, false, false, false, false, isAlignmentChanged, false, false, false, false, false, false, oldValue, newValue);
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
                        this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                            false, false, false, false, false, false, false, false, isMaxLengthChanged, false, false, false, oldValue, newValue);
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
                        this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, isFontFamilyChanged, false,
                            false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
                    }
                }
                let oldFontStyle: string = '';
                let newFontStyle: string = '';
                if ((options as any).fontStyle) {
                    oldFontStyle += formFieldObject.font.isBold ? 'Bold' + ", " : '';
                    oldFontStyle += formFieldObject.font.isItalic ? 'Italic' + ", " : '';
                    oldFontStyle += formFieldObject.font.isStrikeout ? 'Strikethrough' + ", " : '';
                    oldFontStyle += formFieldObject.font.isUnderline ? 'Underline' + ", " : '';
                    if (((options as any).fontStyle & FontStyle.Bold) !== 0) {
                        htmlElement.style.fontWeight = "bold";
                        (formFieldObject as any).fontStyle = "Bold";
                        formFieldObject.font.isBold = true;
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isBold = true;
                    }
                    newFontStyle += formFieldObject.font.isBold ? 'Bold' + ", " : '';
                    if (((options as any).fontStyle & FontStyle.Italic) !== 0) {
                        htmlElement.style.fontStyle = "italic";
                        (formFieldObject as any).fontStyle = "Italic";
                        formFieldObject.font.isItalic = true;
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isItalic = true;
                    }
                    newFontStyle += formFieldObject.font.isItalic ? 'Italic' + ", " : '';
                    if (((options as any).fontStyle & FontStyle.Strikethrough) !== 0) {
                        htmlElement.style.textDecoration = "line-through";
                        formFieldObject.font.isStrikeout = true;
                        (formFieldObject as any).fontStyle = "Strikethrough";
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isStrikeout = true;
                    }
                    newFontStyle += formFieldObject.font.isStrikeout ? 'Strikethrough' + ", " : '';
                    if (((options as any).fontStyle & FontStyle.Underline) !== 0) {
                        htmlElement.style.textDecoration = "underline";
                        (formFieldObject as any).fontStyle = "Underline";
                        formFieldObject.font.isUnderline = true;
                        (this.pdfViewer.nameTable as any)[formFieldObject.id.split('_')[0]].font.isUnderline = true;
                    }
                    newFontStyle += formFieldObject.font.isUnderline ? 'Underline' + ", " : '';
                    isFontStyleChanged = true;
                    if (isFontStyleChanged) {
                        this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", formFieldObject, false, false, false,
                            isFontStyleChanged, false, false, false, false, false, false, false, false, false, false, false, oldFontStyle, newFontStyle);
                    }
                }
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'SignatureField' && (options as any).signatureIndicatorSettings){
            formFieldObject = this.updateSignatureIndicator(formFieldObject as any,options as any, htmlElement);
        }
        this.updateSessionFormFieldProperties(formFieldObject);
        let formField: FormFieldModel = {
            id: formFieldObject.id, name: (formFieldObject as PdfFormFieldBaseModel).name, value: (formFieldObject as PdfFormFieldBaseModel).value,
            type: formFieldObject.formFieldAnnotationType as FormFieldType, isReadOnly: formFieldObject.isReadonly, fontFamily: formFieldObject.fontFamily,
            fontSize: formFieldObject.fontSize, fontStyle: formFieldObject.fontStyle as unknown as FontStyle, color: (formFieldObject as PdfFormFieldBaseModel).color, backgroundColor: (formFieldObject as PdfFormFieldBaseModel).backgroundColor,
            alignment: (formFieldObject as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (formFieldObject as PdfFormFieldBaseModel).visibility, maxLength: (formFieldObject as PdfFormFieldBaseModel).maxLength, isRequired: (formFieldObject as PdfFormFieldBaseModel).isRequired,
            isPrint: formFieldObject.isPrint, tooltip:  (formFieldObject as PdfFormFieldBaseModel).tooltip, bounds: formFieldObject.bounds as IFormFieldBound, thickness: formFieldObject.thickness, borderColor: (formFieldObject as PdfFormFieldBaseModel).borderColor };
        this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(el => el.id === formField.id)] = formField;
    }
    private colorNametoHashValue(colorString: string): string {
        let colorCode: string = colorString;
        if (!colorCode.match(/#([a-z0-9]+)/gi) && !colorCode.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorCode = this.nameToHash(colorCode);
        }
        return colorCode !== '' ? colorCode : colorString;
    }

    /**
     * @private
     */
    public getFormField(formFieldId: string | object): PdfFormFieldBaseModel {
        let formField: PdfFormFieldBaseModel;
        let formFieldCollectionObject: PdfFormFieldBaseModel;
        if (typeof formFieldId === 'object') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections((formFieldId as any).id);
            if (formFieldCollectionObject)
                formField = (this.pdfViewer.nameTable as any)[formFieldCollectionObject.id];
        }
        if (typeof formFieldId === 'string') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections(formFieldId);
            if (formFieldCollectionObject)
                formField = (this.pdfViewer.nameTable as any)[formFieldCollectionObject.id];
        }
        return formField;
    }

    private resetTextboxProperties(obj: PdfFormFieldBaseModel): void {
        let inputElement: Element = document.getElementById(obj.id + "_content_html_element").firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'textboxField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = "None";
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
        let inputElement: Element = document.getElementById(obj.id + "_content_html_element").firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'passswordField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = "None";
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
        let inputElement: Element = document.getElementById(obj.id + "_content_html_element").firstElementChild.firstElementChild;
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
        let inputElement: Element = document.getElementById(obj.id + "_content_html_element").firstElementChild.firstElementChild;
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
        let inputElement: Element = document.getElementById(obj.id + "_content_html_element").firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'dropDownField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = "None";
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
        let inputElement: Element = document.getElementById(obj.id + "_content_html_element").firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'listBoxField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = "None";
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
        let inputElement: Element = document.getElementById(obj.id + "_content_html_element").firstElementChild.firstElementChild;
        if (inputElement) {
            obj.name = 'signatureField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = "None";
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
     * @param formFieldId
     * @param addAction
     * @returns void
     */
    public deleteFormField(formFieldId: string | object, addAction: boolean = true): void {
        let formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        if (formField) {
            this.clearSelection(formFieldId);
            this.pdfViewer.remove(formField);
            this.pdfViewer.renderDrawing();
            if (!isNullOrUndefined(this.pdfViewer.toolbar) && !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule))
                this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(false)
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
     * @param formFieldId
     * @returns void
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
        if (formField && (this.pdfViewer.selectedItems && !isNullOrUndefined((this.pdfViewer.selectedItems as any).properties.formFields) && (this.pdfViewer.selectedItems as any).properties.formFields.length > 0 &&
            (this.pdfViewer.selectedItems as any).properties.formFields[0].id === formField.id)) {
            this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
        }
    }

    /**
     * @private
     */
    public setMode(mode: string): void {
        if (mode && mode.indexOf("designer") !== -1) {
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
        let collections = this.pdfViewer.formFieldCollection;
        if (collections && collections.length > 0) {
            for (let i: number = 0; i < collections.length; i++) {
                let element = document.getElementById(collections[i].id + "_content_html_element");
                let designerName = document.getElementById(collections[i].id + "_designer_name");
                if (element) {
                    if (enableDesignerMode) {
                        this.pdfViewer.designerMode = true;
                        element.style.pointerEvents = "none";
                        designerName.innerHTML = collections[i].name;
                        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
                        designerName.style.fontSize = collections[i].fontSize ? (collections[i].fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
                        designerName.style.position = 'absolute';
                    } else {
                        this.pdfViewer.designerMode = false;
                        element.style.pointerEvents = "all";
                        designerName.innerHTML = "";
                        designerName.style.position = 'initial';
                        if (collections[i].formFieldAnnotationType === 'RadioButton') {
                            this.updateRadioButtonDesignerProperties(collections[i]);
                        }
                        if (collections[i].formFieldAnnotationType === 'Checkbox') {
                            this.updateCheckboxFormDesignerProperties(collections[i]);
                        }
                        this.pdfViewer.clearSelection(collections[i].pageIndex);
                    }
                }
            }
        }
    }

    // eslint-disable-next-line
    private getAnnotationsFromAnnotationCollections(annotationId: string): any {
        // eslint-disable-next-line
        let collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].id === annotationId) {
                    return collections[i];
                }
            }
        }
    }
    /**
     * @private
     */
    public updateSignatureValue(formFieldId: string): void {
        for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
            if (formFieldId === this.pdfViewerBase.formFieldCollection[i].FormField.id) {
                this.pdfViewerBase.formFieldCollection[i].FormField.value = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[i].FormField.id.split('_')[0]].value = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[i].FormField.id].value = '';
                this.pdfViewerBase.formFieldCollection[i].FormField.signatureType = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[i].FormField.id.split('_')[0]].signatureType = '';
                (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[i].FormField.id].signatureType = '';
            }
        }
    }

    /**
     * @private
     */
    public removeFieldsFromAnnotationCollections(annotationId: string): any {
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[i].Key.split("_")[0] === annotationId) {
                formFieldsData.splice(i, 1);
                this.pdfViewerBase.formFieldCollection.splice(i, 1);
                break;
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        let storeObject: string = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, this.pdfViewerBase.currentPageNumber - 1);
            if (annotObject[index]) {
                for (let m: number = 0; m < annotObject[index].annotations.length; m++) {
                    if (annotationId === annotObject[index].annotations[m].id) {
                        annotObject[index].annotations.splice(m, 1);
                        break;
                    }
                }
                const annotationStringified: string = JSON.stringify(annotObject);
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_shape', annotationStringified);
            }
        }
        // eslint-disable-next-line
        let collections: any = this.pdfViewer.formFieldCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[i].formFieldId === annotationId) {
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                }
            }
        }
    }
    
    /**
     * @private
    */
    public setFormFieldIndex(): number {
        this.formFieldIndex = this.formFieldIndex + 1;
        return this.formFieldIndex;
    }

    private setFormFieldIdIndex(): number {
        this.formFieldIdIndex = this.formFieldIdIndex + 1;
        return this.formFieldIdIndex;
    }


    private activateTextboxElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Textbox' + this.setFormFieldIndex(), value: '', fontFamily: 'Helvetica', fontSize: 10 * this.pdfViewerBase.getZoomFactor(), fontStyle: 'None', color: 'black',
            backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030', alignment: 'left', isReadonly: false, visibility: "visible", isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = "DrawTool";
    }

    private activatePasswordField(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Password' + this.setFormFieldIndex(), value: '', fontFamily: 'Helvetica', fontSize: 10 * this.pdfViewerBase.getZoomFactor(), fontStyle: 'None', color: 'black',
            alignment: 'left', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: "visible", isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = "DrawTool";
    }

    private activateCheckboxElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Check Box' + this.setFormFieldIndex(), isChecked: false, fontSize: 10 * this.pdfViewerBase.getZoomFactor(), backgroundColor: '#daeaf7ff', color: 'black', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: "visible", isPrint: true, rotateAngle: 0, tooltip: ''
        };
        this.pdfViewer.tool = "DrawTool";
    }

    private activateRadioButtonElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Radio Button' + this.setFormFieldIndex(), isSelected: false, fontSize: 10 * this.pdfViewerBase.getZoomFactor(), backgroundColor: '#daeaf7ff', color: 'black', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: "visible", isPrint: true, rotateAngle: 0, tooltip: ''
        };
        this.pdfViewer.tool = "DrawTool";
    }

    private activateDropDownListElement(formFieldType: FormFieldAnnotationType, dropDownOptions: Item[]): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'Dropdown' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: 10 * this.pdfViewerBase.getZoomFactor(), fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030',
            alignment: 'left', isReadonly: false, visibility: "visible", isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '',
            options: dropDownOptions, isMultiSelect: false, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = "DrawTool";
    }
    private activateListboxElement(formFieldType: FormFieldAnnotationType, listBoxOptions: Item[]): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: 'List Box' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: 10 * this.pdfViewerBase.getZoomFactor(), fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030',
            alignment: 'left', isReadonly: false, visibility: "visible", isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '',
            options: listBoxOptions, isMultiSelect: true, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.tool = "DrawTool";
    }

    private activateSignatureBoxElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as any) = {
            formFieldAnnotationType: formFieldType,
            name: formFieldType === 'InitialField' || this.pdfViewer.isInitialFieldToolbarSelection ? 'Initial' + this.setFormFieldIndex() : 'Signature' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: 10 * this.pdfViewerBase.getZoomFactor(), fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', alignment: 'left',
            isReadonly: false, visibility: "visible", isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false },
            isInitialField: formFieldType === 'InitialField' || this.pdfViewer.isInitialFieldToolbarSelection ? true : false,signatureIndicatorSettings : { opacity: 1, backgroundColor: 'rgba(255, 228, 133, 0.35)', width: 19, height: 10, fontSize: 10, text: null, color: 'black' }
        };
        this.pdfViewer.tool = "DrawTool";
    }
    /**
     * @private
    */
    public updateTextboxProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Textbox' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily && this.getFontFamily(obj.fontFamily) ? obj.fontFamily : 'Helvetica';
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = "bold";
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = "italic";
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = "line-through";
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = "underline";
        }
        inputElement.style.color = obj.color ? obj.color : 'black';
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        if (obj.maxLength != undefined) {
            (inputElement as HTMLInputElement).maxLength = obj.maxLength === 0 ? 524288 : obj.maxLength;
        }
        inputElement.tabIndex = this.formFieldIndex;
    }
    /**
     * @private
    */
    public updatePasswordFieldProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Password' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = "bold";
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = "italic";
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = "line-through";
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = "underline";
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
            inputElement.style.backgroundColor = 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        if (obj.maxLength != undefined) {
            (inputElement as HTMLInputElement).maxLength = obj.maxLength === 0 ? 524288 : obj.maxLength;
        }
        inputElement.tabIndex = this.formFieldIndex;
    }
    /**
     * @private
    */
    public updateCheckboxProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Check Box' + this.setFormFieldIndex();
        (inputElement as IElement).checked = obj.isChecked ? true : false;
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }
    /**
     * @private
    */
    public updateRadioButtonProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Radio Button' + this.setFormFieldIndex();
        (inputElement as IElement).checked = obj.isSelected ? true : false;
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor : '#303030';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }
    /**
     * @private
    */
    public updateDropdownListProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Dropdown' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = "bold";
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = "italic";
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = "line-through";
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = "underline";
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
            inputElement.style.backgroundColor = 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }
    /**
     * @private
    */
    public updateListBoxProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'List Box' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = "bold";
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = "italic";
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = "line-through";
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = "underline";
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
            inputElement.style.backgroundColor = 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }
    /**
     * @private
    */
    public updateSignatureFieldProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement, isPrint?: boolean): void {
        (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Signature' + this.setFormFieldIndex();
        (inputElement as IFormFieldProperty).value = obj.value ? obj.value : '';
        inputElement.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        inputElement.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (obj.font.isBold) {
            inputElement.style.fontWeight = "bold";
        } if (obj.font.isItalic) {
            inputElement.style.fontStyle = "italic";
        } if (obj.font.isStrikeout) {
            inputElement.style.textDecoration = "line-through";
        } if (obj.font.isUnderline) {
            inputElement.style.textDecoration = "underline";
        }
        inputElement.style.color = obj.color ? obj.color : 'black';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        let background = obj.backgroundColor ? obj.backgroundColor : '#FFE48559';
        background = this.getSignatureBackground(background);
        inputElement.style.backgroundColor = isPrint ? 'transparent' : background;
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = 'transparent';
        }
        if (obj.isRequired) {
            (inputElement as HTMLInputElement).required = true;
            (inputElement.firstElementChild as HTMLElement).style.border = '1px solid red';
            inputElement.style.borderWidth = obj.thickness ? obj.thickness + 'px' : '1px';
        }
        inputElement.tabIndex = this.formFieldIndex;
    }

    /**
     * @private
     */
    public createHtmlElement(elementType: string, attribute: Object): HTMLElement {
        const element: HTMLElement = createElement(elementType);
        this.setAttributeHtml(element, attribute);
        return element;
    }
    private setAttributeHtml(element: HTMLElement, attributes: any): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[i] !== 'style') {
                element.setAttribute(keys[i], attributes[keys[i]]);
            } else {
                this.applyStyleAgainstCsp(element, attributes[keys[i]]);
            }
        }
    }
    private applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void {
        const keys: string[] = attributes.split(';');
        for (let i: number = 0; i < keys.length; i++) {
            const attribute: any[] = keys[i].split(':');
            if (attribute.length === 2) {
                svg.style[attribute[0].trim()] = attribute[1].trim();
            }
        }
    }
    // eslint-disable-next-line
    private getFieldBounds(bound: any, pageIndex: number): any {
        // eslint-disable-next-line
        let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
        // eslint-disable-next-line max-len
        bound = { X: bound.X ? bound.X : bound.x, Y: bound.Y ? bound.Y : bound.y, Width: bound.Width ? bound.Width : bound.width, Height: bound.Height ? bound.Height : bound.height };
        // eslint-disable-next-line
        let bounds: any;
        if (pageDetails) {
            switch (pageDetails.rotation) {
                case 0:
                    bounds = bound;
                    break;
                case 1:
                    bounds = { X: bound.Y - (bound.Width / 2 - bound.Height / 2), Y: pageDetails.width - bound.X - bound.Height - (bound.Width / 2 - bound.Height / 2), Width: bound.Width, Height: bound.Height };
                    break;
                case 2:
                    bounds = { X: pageDetails.width - bound.X - bound.Width, Y: pageDetails.height - bound.Y - bound.Height, Width: bound.Width, Height: bound.Height };
                    break;
                case 3:
                    bounds = { X: (pageDetails.height - bound.Y - bound.Width + (bound.Width / 2 - bound.Height / 2)), Y: bound.X + (bound.Width / 2 - bound.Height / 2), Width: bound.Height, Height: bound.Width };
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
     */
    // eslint-disable-next-line
    public downloadFormDesigner(): string {
        let data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        if (data) {
            let formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                let currentData: any = formFieldsData[i].FormField;
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
                                if (currentData.radiobuttonItem[j].isSelected) {
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
            }
            return (JSON.stringify(formFieldsData));
        } else {
            return null;
        }
    }
    /**
     * @private
     */
    // eslint-disable-next-line max-len
    public createAnnotationLayer(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number, displayMode: string): HTMLElement {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            this.updateAnnotationCanvas(canvas as any, pageWidth, pageHeight, pageNumber);
            return canvas;
        } else {
            // eslint-disable-next-line max-len
            const annotationCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' }) as HTMLCanvasElement;
            this.updateAnnotationCanvas(annotationCanvas as any, pageWidth, pageHeight, pageNumber);
            pageDiv.appendChild(annotationCanvas);
            return annotationCanvas;
        }
    }

    /**
     * @private
    */
    public resizeAnnotations(width: number, height: number, pageNumber: number): void {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
        }
    }
    /**
     * @private
    */
    public getEventPageNumber(event: Event): number {
        let eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.classList.contains('e-pv-hyperlink')) {
            eventTarget = eventTarget.parentElement;
        } else if (eventTarget.parentElement.classList.contains('foreign-object')) {
            eventTarget = eventTarget.parentElement.parentElement.parentElement.parentElement;
        }
        // eslint-disable-next-line
        let pageString: string = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
        if (isNaN(pageString as unknown as number)) {
            event = this.pdfViewerBase.annotationEvent;
            if (event) {
                eventTarget = event.target as HTMLElement;
                // eslint-disable-next-line
                pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
            }
        }
        // eslint-disable-next-line
        return parseInt(pageString);
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
    */
    public createPropertiesWindow(): void {
        const elementID: string = this.pdfViewer.element.id;
        let propertyWinMinHeight: string;
        // eslint-disable-next-line max-len
        const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_properties_window', className: 'e-pv-properties-form-field-window' });
        const appearanceTab: HTMLElement = this.createAppearanceTab();
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'DropdownList' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'ListBox')
            propertyWinMinHeight = '430px';
        else
            propertyWinMinHeight = '505px';
        this.propertiesDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: '<div class="e-pv-form-field-property-header"> ' + this.getPropertyPanelHeaderContent(this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType) + ' ' + this.pdfViewer.localeObj.getConstant('Properties') + '</div>',
            minHeight: propertyWinMinHeight, target: this.pdfViewer.element, content: appearanceTab, allowDragging: true, close: () => {
                this.destroyPropertiesWindow();
            }
        });

        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.propertiesDialog.buttons = [
                // eslint-disable-next-line max-len
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        } else {
            this.propertiesDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                // eslint-disable-next-line max-len
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.propertiesDialog.enableRtl = true;
        }
        let propertySpliterBottom: HTMLElement = createElement('div');
        propertySpliterBottom.className = 'e-pv-properties-bottom-spliter';
        dialogDiv.appendChild(propertySpliterBottom);
        this.propertiesDialog.appendTo(dialogDiv);
    }

    private onOkClicked(args: any): void {
        let selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        let clonedItem: any = cloneObject(selectedItem);
        if (selectedItem) {
            switch (selectedItem.formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                    if (this.formFieldMultiline && this.formFieldMultiline.checked && selectedItem.formFieldAnnotationType === 'Textbox' && this.multilineCheckboxCheckedState) {
                        this.renderMultilineText(selectedItem);
                    } else if (selectedItem.formFieldAnnotationType === 'Textbox' && this.multilineCheckboxCheckedState) {
                        this.renderTextbox(selectedItem);
                    }
                    if (selectedItem.formFieldAnnotationType === 'PasswordField') {
                        this.updateTextboxFormDesignerProperties(selectedItem);
                    }
                    if (selectedItem.formFieldAnnotationType === 'Textbox') {
                        let textboxCollection: any = this.checkTextboxName(selectedItem);
                        if (textboxCollection && textboxCollection.length > 0) {
                            for (let i: number = 0; i < textboxCollection.length; i++) {
                                let item: any = textboxCollection[i];
                                if (selectedItem.isMultiline) {
                                    this.renderMultilineText(item);
                                } else {
                                    this.renderTextbox(item);
                                }
                                document.getElementById(item.id + "_content_html_element") ? this.updateTextboxFormDesignerProperties(item) : this.updateFormFieldPropertiesInCollections(item);
                            }
                        }
                    }
                    this.multilineCheckboxCheckedState = false;
                    let point: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                    this.updateFormDesignerFieldInSessionStorage(point, selectedItem.wrapper.children[0] as DiagramHtmlElement, selectedItem.formFieldAnnotationType, selectedItem);
                    break;
                case 'Checkbox':
                    this.updateCheckboxFormDesignerProperties(selectedItem);
                    const point1: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                    this.updateFormDesignerFieldInSessionStorage(point1, selectedItem.wrapper.children[0] as DiagramHtmlElement, selectedItem.formFieldAnnotationType, selectedItem);
                    break;
                case 'RadioButton':
                    this.updateRadioButtonDesignerProperties(selectedItem);
                    const point2: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                    this.updateFormDesignerFieldInSessionStorage(point2, selectedItem.wrapper.children[0] as DiagramHtmlElement, selectedItem.formFieldAnnotationType, selectedItem);
                    break;
                case 'SignatureField':
                case 'InitialField':
                    this.updateSignatureTextboxProperties(selectedItem);
                    const point3: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                    this.updateFormDesignerFieldInSessionStorage(point3, selectedItem.wrapper.children[0] as DiagramHtmlElement, selectedItem.formFieldAnnotationType, selectedItem);
                    break;
                case 'DropdownList':
                    this.updateDropdownFormDesignerProperties(selectedItem);
                    const point4: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                    this.updateFormDesignerFieldInSessionStorage(point4, selectedItem.wrapper.children[0] as DiagramHtmlElement, selectedItem.formFieldAnnotationType, selectedItem);
                    break;
                case 'ListBox':
                    this.updateListBoxFormDesignerProperties(selectedItem);
                    const point5: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                    this.updateFormDesignerFieldInSessionStorage(point5, selectedItem.wrapper.children[0] as DiagramHtmlElement, selectedItem.formFieldAnnotationType, selectedItem);
                    break;
            }
            this.updateFormFieldCollections(selectedItem);
            let cloneChangedNode: any = cloneObject(selectedItem);
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.addAction(this.pdfViewerBase.currentPageNumber, null, selectedItem, 'FormDesigner Properties Change', '', clonedItem, cloneChangedNode);
            }
        }
        this.propertiesDialog.hide();
    }

    /**
     * Update the form fields properties to the collection while rendering the page
    */
    private updateFormFieldPropertiesInCollections(item: any) {
        let formFieldCollection: any = this.pdfViewer.formFieldCollections;
        for (let i: number = 0; i < formFieldCollection.length; i++) {
            let currentData: any = formFieldCollection[i];
            if (currentData.id === item.id && currentData.name === item.name) {
                this.formFieldName && this.formFieldName.value ? currentData.name = this.formFieldName.value : null;
                this.formFieldValue && (item.value !== this.formFieldValue.value) ? currentData.value = this.formFieldValue.value : null;
                this.formFieldAlign && (item.alignment !== this.formFieldAlign) ? currentData.alignment = this.formFieldAlign : null;
                this.formFieldPrinting && (item.isPrint !== this.formFieldPrinting.checked) ? currentData.isPrint = this.formFieldPrinting.checked : null;
                this.formFieldTooltip && (item.tooltip !== this.formFieldTooltip.value) ? currentData.tooltip = this.formFieldTooltip.value : null;
                this.formFieldVisibility && (item.visibility !== this.formFieldVisibility.value) ? currentData.visibility = this.formFieldVisibility : null;
                this.formFieldFontFamily && this.formFieldFontFamily.value ? currentData.fontFamily = this.formFieldFontFamily.value : null;
                this.formFieldFontSize && this.formFieldFontSize.value ? currentData.fontSize = parseInt(this.formFieldFontSize.value.toString()) : null;
                this.fontColorValue && (item.color !== this.fontColorValue) ? currentData.color = this.fontColorValue : null;
                this.backgroundColorValue && (item.backgroundColor !== this.backgroundColorValue) ? currentData.backgroundColor = this.backgroundColorValue : null;
                this.borderColorValue && (item.borderColor !== this.borderColorValue) ? currentData.borderColor = this.borderColorValue : null;
                this.formFieldBorderWidth && item.thickness !== parseInt(this.formFieldBorderWidth) ? currentData.thickness = parseInt(this.formFieldBorderWidth) : null;
                this.formFieldReadOnly && (item.isReadonly !== this.formFieldReadOnly.checked) ? currentData.isReadOnly = this.formFieldReadOnly.checked : null;
                this.formFieldRequired && (item.isRequired !== this.formFieldRequired.checked) ? currentData.isRequired = this.formFieldRequired.checked : null;
                i !== 0 && i < this.pdfViewer.formFieldCollection.length ? currentData.fontStyle = this.pdfViewer.formFieldCollection[i - 1].fontStyle : currentData.fontStyle = this.pdfViewer.formFieldCollection[i + 1].fontStyle;
                let formFieldIndex: number = this.pdfViewer.formFieldCollections.findIndex(function (el) { return el.id === item.id; });
                this.pdfViewer.formFieldCollections[formFieldIndex] = currentData;
            }

        }
    }

    private checkTextboxName(selectedItem: PdfFormFieldBaseModel): any {
        let textboxObjectCollection: any = [];
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            let item = this.pdfViewer.formFieldCollection[i];
            if (item.name === selectedItem.name && item.formFieldAnnotationType === 'Textbox') {
                textboxObjectCollection.push(item);
            }
        }
        return textboxObjectCollection;
    }

    public renderMultilineText(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        if (isUndoRedo) {
            this.reRenderMultilineTextbox(selectedItem, "e-pv-formfield-input");
        } else {
            this.addMultilineTextbox(selectedItem, "e-pv-formfield-input", true);
        }
    }

    public renderTextbox(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        if (isUndoRedo) {
            this.reRenderMultilineTextbox(selectedItem, "e-pv-formfield-textarea");
        } else {
            this.addMultilineTextbox(selectedItem, "e-pv-formfield-textarea", false);
        }
    }

    private addMultilineTextbox(selectedItem: PdfFormFieldBaseModel, className: string, isMultiline: boolean): void {
        let wrapperElement: DiagramHtmlElement = selectedItem.wrapper.children[0] as DiagramHtmlElement;
        selectedItem.isMultiline = isMultiline;
        if (document.getElementById(wrapperElement.id + '_html_element')) {
            let htmlElement = document.getElementById(wrapperElement.id + '_html_element').children[0];
            let textAreaId: string = htmlElement.children[0].id;
            document.getElementById(htmlElement.children[0].id).remove();
            if (className.indexOf("e-pv-formfield-textarea") !== -1) {
                let inputElement: any = this.createTextboxElement(textAreaId);
                wrapperElement.template = htmlElement.appendChild(inputElement);
            } else {
                let textArea = this.createTextAreaElement(textAreaId);
                wrapperElement.template = htmlElement.appendChild(textArea);
            }
            let index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
            this.pdfViewerBase.formFieldCollection[index].FormField.isMultiline = selectedItem.isMultiline;
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isMultiline = selectedItem.isMultiline;
        }
    }

    private reRenderMultilineTextbox(selectedItem: PdfFormFieldBaseModel, className: string): void {
        let wrapperElement = document.getElementById(selectedItem.id + "_content_html_element");
        if (wrapperElement) {
            let textareaElement = wrapperElement.firstElementChild.firstElementChild;
            let textareaId = textareaElement.id;
            textareaElement.remove();
            if (className.indexOf('e-pv-formfield-textarea') !== -1) {
                let textboxElement = this.createTextboxElement(textareaId);
                wrapperElement.firstElementChild.appendChild(textboxElement);
            } else {
                let textboxElement = this.createTextAreaElement(textareaId);
                wrapperElement.firstElementChild.appendChild(textboxElement);
            }
        }
    }

    private createTextAreaElement(id: string): any {
        let textArea: HTMLElement = createElement('textarea');
        textArea.id = id;
        textArea.className = 'e-pv-formfield-textarea';
        textArea.style.width = '100%';
        textArea.style.height = '100%';
        textArea.addEventListener('click', this.inputElementClick.bind(this));
        textArea.addEventListener('change', this.getTextboxValue.bind(this));
        return textArea;
    }

    private createTextboxElement(id: string): any {
        let inputElement: HTMLElement = createElement('input');
        inputElement.id = id;
        (inputElement as IElement).type = "text";
        inputElement.className = "e-pv-formfield-input";
        (inputElement as IElement).autocomplete = "off";
        inputElement.style.width = '100%';
        inputElement.style.height = '100%';
        inputElement.style.position = "absolute";
        inputElement.addEventListener('click', this.inputElementClick.bind(this));
        inputElement.addEventListener('change', this.getTextboxValue.bind(this));
        return inputElement;
    }

    /**
     * @private
     */
    public updateFormFieldCollections(formFieldObject: PdfFormFieldBaseModel): void {
        let formField: FormFieldModel = {
            id: formFieldObject.id.split('_')[0], name: (formFieldObject as PdfFormFieldBaseModel).name, value: (formFieldObject as PdfFormFieldBaseModel).value,
            type: (formFieldObject as any).type  ? (formFieldObject as any).type : formFieldObject.formFieldAnnotationType as FormFieldType, isReadOnly: formFieldObject.isReadonly, fontFamily: formFieldObject.fontFamily, isMultiline: formFieldObject.isMultiline,
            fontSize: formFieldObject.fontSize, fontStyle: formFieldObject.fontStyle as unknown as FontStyle, color: (formFieldObject as PdfFormFieldBaseModel).color ? (formFieldObject as PdfFormFieldBaseModel).color : this.getRgbToHex((formFieldObject as any).fontColor), backgroundColor: typeof (formFieldObject as PdfFormFieldBaseModel).backgroundColor === 'string' ? (formFieldObject as PdfFormFieldBaseModel).backgroundColor : this.getRgbToHex((formFieldObject as PdfFormFieldBaseModel).backgroundColor),
            alignment: (formFieldObject as PdfFormFieldBaseModel).alignment ? (formFieldObject as PdfFormFieldBaseModel).alignment as TextAlign : (formFieldObject as any).textAlign, visibility: (formFieldObject as PdfFormFieldBaseModel).visibility, maxLength: (formFieldObject as PdfFormFieldBaseModel).maxLength, isRequired: (formFieldObject as PdfFormFieldBaseModel).isRequired,
            isPrint: formFieldObject.isPrint, isSelected: formFieldObject.isSelected, isChecked: formFieldObject.isChecked, tooltip: (formFieldObject as PdfFormFieldBaseModel).tooltip, bounds: formFieldObject.bounds as IFormFieldBound ? formFieldObject.bounds : (formFieldObject as any).lineBound, thickness: formFieldObject.thickness, borderColor: typeof (formFieldObject as PdfFormFieldBaseModel).borderColor === 'string' ? (formFieldObject as PdfFormFieldBaseModel).borderColor : this.getRgbToHex((formFieldObject as PdfFormFieldBaseModel).borderColor), pageIndex: !isNullOrUndefined(formFieldObject.pageNumber) ? formFieldObject.pageNumber : formFieldObject.pageIndex
        };
        this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(el => el.id === formField.id)] = formField;
    }

    /**
    * Get the Hex value from the RGB value.
    */
    private getRgbToHex(color: any): string {
        return ('#' + this.hex(color.r) + this.hex(color.g) + this.hex(color.b));
    }

    /**
     * @private
     */
    public updateDropdownFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        let dropdownElement: any = document.getElementById(selectedItem.id + "_content_html_element").firstElementChild.firstElementChild;
        if (this.pdfViewer.designerMode || isUndoRedo) {
            var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            var formFieldsData = JSON.parse(data);
            let index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
            selectedItem.options = this.createDropdownDataSource(selectedItem);
            this.updateDropDownListDataSource(selectedItem, dropdownElement);
            selectedItem.selectedIndex = [];
            if (index > -1) {
                formFieldsData[index].FormField.option = selectedItem.options;
                this.pdfViewerBase.formFieldCollection[index].FormField.option = selectedItem.options;
                if (!isNullOrUndefined(selectedItem.options) && selectedItem.options.length > 0) {
                    formFieldsData[index] && formFieldsData[index].FormField.value ? selectedItem.selectedIndex.push(selectedItem.options.findIndex(x => x.itemValue === formFieldsData[index].FormField.value)) : selectedItem.selectedIndex.push(0);
                }
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].options = selectedItem.options;
            if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
                this.updateNamePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldValue && formFieldsData[index] && formFieldsData[index].FormField.value || isUndoRedo) {
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
            if (this.formFieldBorderWidth || isUndoRedo) {
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
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    /**
     * @private
     */
    public updateListBoxFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        let dropdownElement: any = document.getElementById(selectedItem.id + "_content_html_element").firstElementChild.firstElementChild;
        if (this.pdfViewer.designerMode || isUndoRedo) {
            var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            var formFieldsData = JSON.parse(data);
            let index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
            selectedItem.options = this.createDropdownDataSource(selectedItem);
            this.updateDropDownListDataSource(selectedItem, dropdownElement);
            selectedItem.selectedIndex = [];
            if (index > -1) {
                formFieldsData[index].FormField.option = selectedItem.options;
                this.pdfViewerBase.formFieldCollection[index].FormField.option = selectedItem.options;
                if (!isNullOrUndefined(selectedItem.options) && selectedItem.options.length > 0) {
                    formFieldsData[index] && formFieldsData[index].FormField.value ? selectedItem.selectedIndex.push(selectedItem.options.findIndex(function (x) { return x.itemValue === formFieldsData[index].FormField.value; })) : selectedItem.selectedIndex.push(0);
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
            if (this.formFieldBorderWidth || isUndoRedo) {
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
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    private updateDropDownListDataSource(selectedItem: PdfFormFieldBaseModel, dropdownElement: any): void {
        while (dropdownElement.firstChild) {
            dropdownElement.firstChild.remove()
        }
        for (let j: number = 0; j < selectedItem.options.length; j++) {
            var option = document.createElement("option");
            option.className = "e-pv-formfield-dropdown";
            option.value = selectedItem.options[j].itemValue;
            option.text = selectedItem.options[j].itemName;
            dropdownElement.appendChild(option);
        }
    }

    private createDropdownDataSource(selectedItem: PdfFormFieldBaseModel): any {
        let ulItem: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        this.formFieldListItemDataSource = [];
        if (ulItem && ulItem.children && ulItem.children.length > 0) {
            for (let i: number = 0; i < ulItem.children.length; i++) {
                let liItem: Element = ulItem.children[i];
                this.formFieldListItemDataSource.push({ itemName: liItem.innerHTML, itemValue: liItem.innerHTML });
            }
        } else if (selectedItem && selectedItem.options.length > 0) {
            this.formFieldListItemDataSource = selectedItem.options;
        }
        return this.formFieldListItemDataSource;
    }

    /**
     * @private
     */
    public updateSignatureTextboxProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        let inputElement: any = document.getElementById(selectedItem.id + "_content_html_element").firstElementChild.firstElementChild;
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        let index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
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
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    /**
     * @private
     */
    public updateCheckboxFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        let checkBoxElement: any = document.getElementById(selectedItem.id + "_content_html_element").firstElementChild.firstElementChild.lastElementChild;
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        let index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
        if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
            this.updateNamePropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.backgroundColorValue || isUndoRedo) {
            this.updateBackgroundColorPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.borderColorValue || isUndoRedo) {
            this.updateBorderColorPropertyChange(selectedItem, checkBoxElement, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldBorderWidth || isUndoRedo) {
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
        if (this.checkboxCheckedState != undefined || isUndoRedo) {
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
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    /**
     * @private
     */
    public updateRadioButtonDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        let radioButton: any = document.getElementById(selectedItem.id + "_content_html_element").firstElementChild.firstElementChild.firstElementChild;
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        let index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
        if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
            this.updateNamePropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
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
        if ((this.pdfViewer.designerMode && this.formFieldBorderWidth) || isUndoRedo) {
            this.updateBorderThicknessPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.backgroundColorValue || isUndoRedo) {
            this.updateBackgroundColorPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.borderColorValue || isUndoRedo) {
            this.updateBorderColorPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.checkboxCheckedState != undefined || isUndoRedo) {
            this.updateIsSelectedPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldReadOnly || isUndoRedo) {
            this.updateIsReadOnlyPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (this.formFieldRequired || isUndoRedo) {
            this.updateIsRequiredPropertyChange(selectedItem, radioButton, isUndoRedo, index, formFieldsData);
        }
        if (isUndoRedo) {
            let formField: PdfFormFieldBaseModel = (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]];
            const point2: PointModel = cornersPointsBeforeRotation(formField.wrapper.children[0]).topLeft;
            this.updateFormDesignerFieldInSessionStorage(point2, formField.wrapper.children[0] as DiagramHtmlElement, formField.formFieldAnnotationType, formField);
        }
    }

    /**
     * @private
     */
    public updateTextboxFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        let inputElement: any = document.getElementById(selectedItem.id + "_content_html_element").firstElementChild.firstElementChild;
        let isMaxLengthChanged: boolean = false;
        let oldValue: any, newValue: any;
        var data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        var formFieldsData = JSON.parse(data);
        let index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
        if (this.pdfViewer.designerMode || isUndoRedo) {
            if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
                this.updateNamePropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldValue || isUndoRedo) {
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
            if ((this.formFieldFontFamily && this.formFieldFontFamily.value) || isUndoRedo) {
                this.updateFontFamilyPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.formFieldFontSize && this.formFieldFontSize.value) || isUndoRedo) {
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
                let maxLength: number = this.maxLengthItem.value === 0 ? 524288 : this.maxLengthItem.value;
                if (isUndoRedo && selectedItem.maxLength !== 0) {
                    inputElement.maxLength = selectedItem.maxLength;
                } else {
                    inputElement.maxLength = maxLength;
                    selectedItem.maxLength = this.maxLengthItem.value;
                }
                if (index > -1) {
                    formFieldsData[index].FormField.maxLength = selectedItem.maxLength;
                    this.pdfViewerBase.formFieldCollection[index].FormField.maxLength = selectedItem.maxLength;
                }
                (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].maxLength = selectedItem.maxLength;
                if (isMaxLengthChanged) {
                    this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                        false, false, false, false, false, false, false, false, isMaxLengthChanged, false, false, false, oldValue, newValue);
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
            if (this.formFieldBorderWidth || isUndoRedo) {
                this.updateBorderThicknessPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldReadOnly || isUndoRedo) {
                this.updateIsReadOnlyPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldRequired || isUndoRedo) {
                this.updateIsRequiredPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
        }
        if (!this.pdfViewer.designerMode) {
            if (this.formFieldVisibility && this.formFieldVisibility.value) {
                selectedItem.visibility = this.formFieldVisibility.value as Visibility;
                let visibleItem: any = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild;
                visibleItem.style.visibility = selectedItem.visibility;
            }
        }
        this.updateFormFieldCollections(selectedItem);
        if (isUndoRedo)
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
    }

    /**
     * @private
     */
    public updateIsCheckedPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        if (this.pdfViewer.designerMode || isUndoRedo) {
            let isValueChanged: boolean = false
            let oldValue: any, newValue: any;
            if (selectedItem.isChecked !== this.checkboxCheckedState) {
                isValueChanged = true;
                oldValue = selectedItem.isChecked;
                newValue = this.checkboxCheckedState;
            }
            if (!isUndoRedo) {
                selectedItem.isChecked = this.checkboxCheckedState;
            }
            if (index > -1) {
                formFieldsData[index].FormField.isChecked = selectedItem.isChecked;
                this.pdfViewerBase.formFieldCollection[index].FormField.isChecked = selectedItem.isChecked;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isChecked = selectedItem.isChecked;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, isValueChanged, false, false,
                    false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
            }
        }

        if (!this.pdfViewer.designerMode || isUndoRedo) {
            let checkboxElement: any = document.getElementById(selectedItem.id + "_input").firstElementChild;
            if (selectedItem.isChecked) {
                if (checkboxElement.classList.contains('e-pv-cb-unchecked'))
                    checkboxElement.classList.remove('e-pv-cb-unchecked');
                checkboxElement.classList.add("e-pv-cb-checked");
            } else {
                if (checkboxElement.classList.contains('e-pv-cb-checked'))
                    checkboxElement.classList.remove('e-pv-cb-checked');
                checkboxElement.classList.add("e-pv-cb-unchecked");
            }
        }
    }

    /**
    * @private
    */
    public updateIsSelectedPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        if (this.pdfViewer.designerMode || isUndoRedo) {
            let isValueChanged: boolean = false
            let oldValue: any, newValue: any;
            if (selectedItem.isSelected !== this.checkboxCheckedState) {
                isValueChanged = true;
                oldValue = selectedItem.isSelected;
                newValue = this.checkboxCheckedState;
            }
            if (!isUndoRedo) {
                selectedItem.isSelected = this.checkboxCheckedState;
            }
            if (index > -1) {
                formFieldsData[index].FormField.isSelected = selectedItem.isSelected;
                this.pdfViewerBase.formFieldCollection[index].FormField.isSelected = selectedItem.isSelected;
                for (let i: number = 0; i < formFieldsData[index].FormField.radiobuttonItem.length; i++) {
                    if (formFieldsData[index].FormField.radiobuttonItem[i].id.split("_")[0] === selectedItem.id.split("_")[0]) {
                        formFieldsData[index].FormField.radiobuttonItem[i].isSelected = selectedItem.isSelected;
                        this.pdfViewerBase.formFieldCollection[index].FormField.radiobuttonItem[i].isSelected = selectedItem.isSelected;
                    }
                }
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isSelected = selectedItem.isSelected;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, isValueChanged, false, false,
                    false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
            }
        }

        if (!this.pdfViewer.designerMode || isUndoRedo) {
            element.checked = selectedItem.isSelected;
            if (index > -1) {
                formFieldsData[index].FormField.isSelected = selectedItem.isSelected;
                this.pdfViewerBase.formFieldCollection[index].FormField.isSelected = selectedItem.isSelected;
                for (let i: number = 0; i < formFieldsData[index].FormField.radiobuttonItem.length; i++) {
                    if (formFieldsData[index].FormField.radiobuttonItem[i].id.split("_")[0] === selectedItem.id.split("_")[0]) {
                        formFieldsData[index].FormField.radiobuttonItem[i].isSelected = selectedItem.isSelected;
                        this.pdfViewerBase.formFieldCollection[index].FormField.radiobuttonItem[i].isSelected = selectedItem.isSelected;
                    }
                }
            }
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isSelected = selectedItem.isSelected;
        }
    }

    /**
     * @private
     */
    public updateValuePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isValueChanged: boolean = false
        let oldValue: any, newValue: any;
        if (selectedItem.formFieldAnnotationType !== "DropdownList" && this.formFieldValue && (selectedItem.value !== this.formFieldValue.value)) {
            isValueChanged = true;
            oldValue = selectedItem.value;
            newValue = this.formFieldValue.value;
        }
        else if (selectedItem.formFieldAnnotationType === "DropdownList" && this.formFieldValue && (selectedItem.value !== formFieldsData[index].FormField.value)) {
            isValueChanged = true;
            oldValue = selectedItem.value;
            newValue = formFieldsData[index].FormField.value;
        }
        if (isUndoRedo) {
            element.value = selectedItem.value;
        } else {
            selectedItem.formFieldAnnotationType === "DropdownList" ? selectedItem.value = formFieldsData[index].FormField.value : selectedItem.value = this.formFieldValue.value;
            selectedItem.formFieldAnnotationType === "DropdownList" ? element.value = formFieldsData[index].FormField.value : element.value = this.formFieldValue.value;
        }
        if (index > -1) {
            formFieldsData[index].FormField.value = selectedItem.value;
            this.pdfViewerBase.formFieldCollection[index].FormField.value = selectedItem.value;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].value = selectedItem.value;
        if (isValueChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, isValueChanged, false, false,
                false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontStylePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isFontStyleChanged: boolean = false;
        let oldValue: string = '';
        let newValue: string = '';
        let result = this.updateFontStyle(element, selectedItem, isUndoRedo, index, formFieldsData);
        isFontStyleChanged = result[0];
        oldValue = result[1];
        newValue = result[2];
        if (index > -1) {
            formFieldsData[index].FormField.fontStyle = selectedItem.fontStyle;
            this.pdfViewerBase.formFieldCollection[index].FormField.fontStyle = selectedItem.fontStyle;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].fontStyle = selectedItem.fontStyle;
        if (isFontStyleChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                isFontStyleChanged, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBorderThicknessPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isBorderWidthChanged: boolean = false
        let oldValue: any, newValue: any;
        let borderWidth = parseInt(this.formFieldBorderWidth);
        if (selectedItem.thickness !== borderWidth) {
            isBorderWidthChanged = true;
            oldValue = selectedItem.thickness;
            newValue = borderWidth ? borderWidth : selectedItem.thickness;
        }
        if (isUndoRedo) {
            element.style.borderWidth = selectedItem.thickness.toString();
        } else {
            element.style.borderWidth = this.formFieldBorderWidth ? this.formFieldBorderWidth : selectedItem.thickness;
            selectedItem.thickness = borderWidth;
        }
        if (index > -1) {
            formFieldsData[index].FormField.thickness = selectedItem.thickness;
            this.pdfViewerBase.formFieldCollection[index].FormField.thickness = selectedItem.thickness;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].thickness = selectedItem.thickness;
        if (isBorderWidthChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, false, isBorderWidthChanged, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBorderColorPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isBorderColorChanged: boolean = false
        let oldValue: any, newValue: any;
        if (selectedItem.borderColor !== this.borderColorValue) {
            isBorderColorChanged = true;
            oldValue = selectedItem.borderColor;
            newValue = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
        }
        if (isUndoRedo) {
            element.style.borderColor = selectedItem.borderColor;
        } else {
            element.style.borderColor = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
            selectedItem.borderColor = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
        }
        if (selectedItem.formFieldAnnotationType == "RadioButton")
            (element as any).parentElement.style.boxShadow = this.borderColorValue + ' 0px 0px 0px ' + selectedItem.thickness + 'px';
        if (index > -1) {
            formFieldsData[index].FormField.borderColor = this.getRgbCode(selectedItem.borderColor);
            this.pdfViewerBase.formFieldCollection[index].FormField.borderColor = this.getRgbCode(selectedItem.borderColor);
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].borderColor = selectedItem.borderColor;
        if (isBorderColorChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, isBorderColorChanged, false, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBackgroundColorPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isBackgroundColorChanged: boolean = false
        let oldValue: any, newValue: any;
        if (selectedItem.backgroundColor !== this.backgroundColorValue) {
            isBackgroundColorChanged = true;
            oldValue = selectedItem.backgroundColor;
            newValue = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor;
        }
        if (isUndoRedo) {
            if (selectedItem.formFieldAnnotationType == "RadioButton")
                (element as any).parentElement.style.background = selectedItem.backgroundColor;
            else
                element.style.background = selectedItem.backgroundColor;
        } else {
            if (selectedItem.formFieldAnnotationType == "RadioButton")
                (element as any).parentElement.style.background = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor;
            else
                element.style.background = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor;
            selectedItem.backgroundColor = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor;
        }
        if (index > -1) {
            formFieldsData[index].FormField.backgroundColor = this.getRgbCode(selectedItem.backgroundColor);
            this.pdfViewerBase.formFieldCollection[index].FormField.backgroundColor = this.getRgbCode(selectedItem.backgroundColor);
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].backgroundColor = selectedItem.backgroundColor;
        if (isBackgroundColorChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, isBackgroundColorChanged, false, false, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateColorPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isColorChanged: boolean = false
        let oldValue: any, newValue: any;
        if (selectedItem.color !== this.fontColorValue) {
            isColorChanged = true;
            oldValue = selectedItem.color;
            newValue = this.fontColorValue ? this.fontColorValue : selectedItem.color;
        }
        if (isUndoRedo) {
            element.style.color = selectedItem.color;
        } else {
            element.style.color = this.fontColorValue ? this.fontColorValue : selectedItem.color;
            selectedItem.color = this.fontColorValue ? this.fontColorValue : selectedItem.color;
        }
        if (index > -1) {
            formFieldsData[index].FormField.color = this.getRgbCode(selectedItem.color);
            this.pdfViewerBase.formFieldCollection[index].FormField.color = this.getRgbCode(selectedItem.color);
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].color = selectedItem.color;
        if (isColorChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, isColorChanged, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateAlignmentPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isAlignmentChanged: boolean = false
        let oldValue: any, newValue: any;
        if (selectedItem.alignment !== this.formFieldAlign) {
            isAlignmentChanged = true;
            oldValue = selectedItem.alignment;
            newValue = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
        }
        if (isUndoRedo) {
            element.style.textAlign = selectedItem.alignment;
            if ((selectedItem.formFieldAnnotationType == "ListBox" || selectedItem.formFieldAnnotationType == "DropdownList") && element.children.length > 0) {
                element.style.textAlignLast = selectedItem.alignment;
                for (let i: number = 0; i < element.children.length; i++) {
                    let dropDownChild: any = element.children[i];
                    dropDownChild.style.textAlignLast = selectedItem.alignment;
                    dropDownChild.style.textAlign = selectedItem.alignment;
                }
            }
        } else {
            element.style.textAlign = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
            selectedItem.alignment = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
            if ((selectedItem.formFieldAnnotationType == "ListBox" || selectedItem.formFieldAnnotationType == "DropdownList") && element.children.length > 0) {
                element.style.textAlignLast = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                for (let i: number = 0; i < element.children.length; i++) {
                    let dropDownChild: any = element.children[i];
                    dropDownChild.style.textAlignLast = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                    dropDownChild.style.textAlign = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                }
            }
        }
        if (index > -1) {
            formFieldsData[index].FormField.alignment = selectedItem.alignment;
            this.pdfViewerBase.formFieldCollection[index].FormField.alignment = selectedItem.alignment;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].alignment = selectedItem.alignment;
        if (isAlignmentChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, false, false, isAlignmentChanged, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontSizePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isFontSizeChanged: boolean = false
        let oldValue: any, newValue: any;
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        let fontSize = this.formFieldFontSize ? parseInt(this.formFieldFontSize.value.toString()) : null;
        let selectedFontSize: number = parseInt(selectedItem.fontSize);
        if (selectedFontSize !== fontSize) {
            isFontSizeChanged = true;
            oldValue = selectedItem.fontSize;
            newValue = fontSize;
        }
        if (isUndoRedo) {
            element.style.fontSize = (selectedItem.fontSize * zoomValue) + 'px'.toString();
        } else {
            selectedItem.fontSize = fontSize;
            element.style.fontSize = parseInt(this.formFieldFontSize.value.toString()) * zoomValue + 'px';
        }
        if (index > -1) {
            formFieldsData[index].FormField.fontSize = selectedItem.fontSize;
            this.pdfViewerBase.formFieldCollection[index].FormField.fontSize = selectedItem.fontSize;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].fontSize = selectedItem.fontSize;
        if (isFontSizeChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, isFontSizeChanged,
                false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontFamilyPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isFontFamilyChanged: boolean = false
        let oldValue: any, newValue: any;
        let fontFamily = this.formFieldFontFamily ? this.formFieldFontFamily.value.toString() : "";
        if (selectedItem.fontFamily !== fontFamily) {
            isFontFamilyChanged = true;
            oldValue = selectedItem.fontFamily;
            newValue = fontFamily;
        }
        if (isUndoRedo) {
            element.style.fontFamily = selectedItem.fontFamily;
        } else {
            selectedItem.fontFamily = fontFamily
            element.style.fontFamily = fontFamily;
        }
        if (index > -1) {
            formFieldsData[index].FormField.fontFamily = selectedItem.fontFamily;
            this.pdfViewerBase.formFieldCollection[index].FormField.fontFamily = selectedItem.fontFamily;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].fontFamily = selectedItem.fontFamily;
        if (isFontFamilyChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, isFontFamilyChanged, false,
                false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateVisibilityPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isVisibilityChanged: boolean = false
        let oldValue: any, newValue: any;
        if (this.formFieldVisibility && (selectedItem.visibility !== this.formFieldVisibility.value)) {
            isVisibilityChanged = true;
            oldValue = selectedItem.visibility;
            newValue = this.formFieldVisibility.value;
        }

        if (!isUndoRedo) {
            selectedItem.visibility = this.formFieldVisibility.value as Visibility;
        }

        element.style.visibility = selectedItem.visibility;
        if (selectedItem.formFieldAnnotationType === "RadioButton") {
            element.parentElement.style.visibility = selectedItem.visibility;
        }
        if (selectedItem.formFieldAnnotationType === "SignatureField" || selectedItem.formFieldAnnotationType === "InitialField") {
            let signElement: any = document.getElementById(selectedItem.id + "_content_html_element").firstElementChild.children[1];
            signElement.style.visibility = selectedItem.visibility;
            signElement.parentElement.style.visibility = selectedItem.visibility;
            let annotation: any = (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0] + "_content"];
            if (selectedItem.visibility as Visibility === "hidden") {
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
            formFieldsData[index].FormField.visibility = selectedItem.visibility;
            this.pdfViewerBase.formFieldCollection[index].FormField.visibility = selectedItem.visibility;
        }
        // selectedItem.visibility = this.formFieldVisibility.value;
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].visibility = selectedItem.visibility;
        if (isVisibilityChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, false, false, false, false, isVisibilityChanged, false, false, false, false, oldValue, newValue);
        }
    }

    private hideSignatureValue(selectedItem: any, annotation: any, index: number, formFieldsData: any) {
        selectedItem.wrapper.children.splice(selectedItem.wrapper.children.indexOf(annotation.wrapper.children[0]), 1);
        selectedItem.value = '';
        selectedItem.signatureType = '';
        formFieldsData[index].FormField.value = '';
        formFieldsData[index].FormField.signatureType = '';
        this.pdfViewerBase.formFieldCollection[index].FormField.value = '';
        this.pdfViewerBase.formFieldCollection[index].FormField.signatureType = '';
        this.pdfViewer.remove(annotation);
        this.pdfViewer.renderDrawing();
    }

    private showSignatureValue(selectedItem: any, oldValue: any, annotation: any, index: number, formFieldsData: any) {
        if (annotation.shapeAnnotationType === "SignatureText") {
            selectedItem.value = annotation.data;
            selectedItem.signatureType = "Text";
            formFieldsData[index].FormField.signatureType = "Text";
            formFieldsData[index].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[index].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[index].FormField.signatureType = "Text";
        } else if (annotation.shapeAnnotationType === "SignatureImage") {
            selectedItem.value = annotation.data;
            selectedItem.signatureType = "Image";
            formFieldsData[index].FormField.signatureType = "Image";
            formFieldsData[index].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[index].FormField.value = annotation.data;
            this.pdfViewerBase.formFieldCollection[index].FormField.signatureType = "Image";
        } else {
            formFieldsData[index].FormField.signatureType = "Path";
            selectedItem.signatureType = "Path";
            this.pdfViewerBase.formFieldCollection[index].FormField.signatureType = "Path";
            let collectionData: any = processPathData(annotation.data);
            let csData: any = splitArrayCollection(collectionData);
            selectedItem.value = JSON.stringify(csData);
            formFieldsData[index].FormField.value = JSON.stringify(csData);
            this.pdfViewerBase.formFieldCollection[index].FormField.value = JSON.stringify(csData);
        }
        (selectedItem as any).signatureBound = annotation.signatureBound;
        if (oldValue === 'hidden') {
            this.pdfViewer.add(annotation);
            selectedItem.wrapper.children.push(annotation.wrapper);
            let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + selectedItem.pageIndex);
            this.pdfViewer.renderDrawing(canvass as any, selectedItem.pageIndex);
        };
        this.pdfViewer.renderDrawing();
    }

    private updateTooltipPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isToolTipChanged: boolean = false
        let oldValue: any, newValue: any;
        if (this.formFieldTooltip && (selectedItem.tooltip !== this.formFieldTooltip.value)) {
            isToolTipChanged = true;
            oldValue = selectedItem.tooltip;
            newValue = this.formFieldTooltip.value;
        }
        if (isUndoRedo) {
            this.formFieldTooltip = new TextBox();
            this.formFieldTooltip.value = selectedItem.tooltip;
        } else {
            selectedItem.tooltip = this.formFieldTooltip ? this.formFieldTooltip.value : selectedItem.tooltip;
        }
        if (index > -1) {
            formFieldsData[index].FormField.tooltip = selectedItem.tooltip;
            this.pdfViewerBase.formFieldCollection[index].FormField.tooltip = selectedItem.tooltip;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].tooltip = this.formFieldTooltip.value;
        if (!isNullOrUndefined(this.formFieldTooltip.value) && this.formFieldTooltip.value !== '') {
            this.setToolTip(this.formFieldTooltip.value, selectedItem.formFieldAnnotationType == "RadioButton" || selectedItem.formFieldAnnotationType == "DropdownList" ? (element as any).parentElement : element);
        }
        if (isToolTipChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, false, false, false, false, false, false, false, false, isToolTipChanged, oldValue, newValue);
        }
    }

    private updateNamePropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let designerName = document.getElementById(selectedItem.id + "_designer_name");
        let zoomValue: number = this.pdfViewerBase.getZoomFactor();
        designerName.style.fontSize = selectedItem.fontSize ? (selectedItem.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (isUndoRedo) {
            designerName.innerHTML = selectedItem.name;
        } else {
            selectedItem.name = this.formFieldName ? this.formFieldName.value : selectedItem.name;
            designerName.innerHTML = selectedItem.name;
        }
        if (index > -1) {
            if (formFieldsData[index].FormField.name !== selectedItem.name) {
                this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                    false, false, false, false, false, false, false, false, false, false, false, false, null, null, true, formFieldsData[index].FormField.name);
            }
            formFieldsData[index].FormField.name = selectedItem.name;
            this.pdfViewerBase.formFieldCollection[index].FormField.name = selectedItem.name;
        }

        element.name = selectedItem.name;
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].name = selectedItem.name;
        if (selectedItem.formFieldAnnotationType == "DropdownList" || selectedItem.formFieldAnnotationType == "ListBox") {
            for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                let formField = this.pdfViewer.formFieldCollection[i] as PdfFormFieldBaseModel;
                if ((formField.formFieldAnnotationType === "DropdownList" || formField.formFieldAnnotationType === "ListBox") && formField.name === selectedItem.name && formField.id !== selectedItem.id) {
                    selectedItem.options = formField.options;
                    this.updateDropDownListDataSource(selectedItem, element);
                    break;
                }
            }
        }
    }

    private updateIsReadOnlyPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isReadOnlyChanged: boolean = false
        let oldValue: any, newValue: any;
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
            formFieldsData[index].FormField.isReadonly = selectedItem.isReadonly;
            this.pdfViewerBase.formFieldCollection[index].FormField.isReadonly = selectedItem.isReadonly;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isReadonly = selectedItem.isReadonly;
        this.setReadOnlyToElement(selectedItem, element, selectedItem.isReadonly);
        this.setReadOnlyToFormField(selectedItem, selectedItem.isReadonly);
        if (isReadOnlyChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, false, false, false, isReadOnlyChanged, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateIsRequiredPropertyChange(selectedItem: any, element: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isRequiredChanged: boolean = false
        let oldValue: any, newValue: any;
        if (this.formFieldRequired && (selectedItem.isRequired !== this.formFieldRequired.checked)) {
            isRequiredChanged = true;
            oldValue = selectedItem.isRequired;
            newValue = this.formFieldRequired.checked;
        }
        if (isUndoRedo) {
            this.formFieldRequired = new CheckBox();
            this.formFieldRequired.checked = selectedItem.isRequired;
        } else {
            selectedItem.isRequired = this.formFieldRequired.checked;
        }
        if (index > -1) {
            formFieldsData[index].FormField.isRequired = selectedItem.isRequired;
            this.pdfViewerBase.formFieldCollection[index].FormField.isRequired = selectedItem.isRequired;
            if (this.pdfViewerBase.formFieldCollection[index].FormField.radiobuttonItem) {
                for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection[index].FormField.radiobuttonItem.length; i++) {
                    this.pdfViewerBase.formFieldCollection[index].FormField.radiobuttonItem[i].isRequired = selectedItem.isRequired;
                    (this.pdfViewer.nameTable as any)[this.pdfViewerBase.formFieldCollection[index].FormField.radiobuttonItem[i].id.split('_')[0]].isRequired = selectedItem.isRequired;
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isRequired = selectedItem.isRequired;
        this.setRequiredToElement(selectedItem, element, selectedItem.isRequired);
        this.setRequiredToFormField(selectedItem, selectedItem.isRequired);
        if (isRequiredChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, false, false, false, false, false, false, isRequiredChanged, false, false, oldValue, newValue);
        }
    }

    private updateIsPrintPropertyChange(selectedItem: any, isUndoRedo: boolean, index: number, formFieldsData: any) {
        let isPrintChanged: boolean = false
        let oldValue: any, newValue: any;
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
            formFieldsData[index].FormField.isPrint = selectedItem.isPrint;
            this.pdfViewerBase.formFieldCollection[index].FormField.isPrint = selectedItem.isPrint;
        }
        (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].isPrint = selectedItem.isPrint;
        if (isPrintChanged) {
            this.updateFormFieldPropertiesChanges("formFieldPropertiesChange", selectedItem, false, false, false,
                false, false, false, false, false, false, false, false, false, false, isPrintChanged, false, oldValue, newValue);
        }
    }
    /**
     * @private
     */
    public getFormFiledIndex(id: any): number {
        if (this.pdfViewerBase.formFieldCollection == null || this.pdfViewerBase.formFieldCollection.length == 0)
            return -1;
        let index: number = this.pdfViewerBase.formFieldCollection.findIndex(el => el.Key.split('_')[0] === id);
        if (index > -1) {
            return index;
        } else {
            for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
                if (this.pdfViewerBase.formFieldCollection[i].FormField.formFieldAnnotationType === 'RadioButton' && this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem) {
                    for (let k: number = 0; k < this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem.length; k++) {
                        if (this.pdfViewerBase.formFieldCollection[i].FormField.radiobuttonItem[k].id.split("_")[0] === id) {
                            return i;
                        }
                    }
                }
            }
        }
        return -1;
    }

    private updateFontStyle(inputElement: any, selectedItem: PdfFormFieldBaseModel, isUndoRedo: boolean, index: number, formFieldsData: any): any[] {
        let isFontStyleChanged = false;
        let oldValue: string = '';
        let newValue: string = '';
        if (this.formFieldBold) {
            if (selectedItem.fontStyle !== 'Bold') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isBold ? 'Bold' + ", " : '';
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
        newValue += selectedItem.font.isBold ? 'Bold' + ", " : '';
        if (this.formFieldItalic) {
            if (selectedItem.fontStyle !== 'Italic') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isItalic ? 'Italic' + ", " : '';
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
        newValue += selectedItem.font.isItalic ? 'Italic' + ", " : '';
        if (this.formFieldUnderline) {
            if (selectedItem.fontStyle !== 'Underline') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isUnderline ? 'Underline' + ", " : '';
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
        newValue += selectedItem.font.isUnderline ? 'Underline' + ", " : '';
        if (this.formFieldStrikeOut) {
            if (selectedItem.fontStyle !== 'Strikethrough') {
                isFontStyleChanged = true;
                oldValue += selectedItem.font.isStrikeout ? 'Strikethrough' + ", " : '';
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
        newValue += selectedItem.font.isStrikeout ? 'Strikethrough' + ", " : '';
        return [isFontStyleChanged, oldValue, newValue];
    }

    private setFontStyleValues(selectedItem: PdfFormFieldBaseModel, selectedItemFontStyle: string, fontStyleType: string, inputElement: any, isFontStyleEnabled: boolean, fontStyleValue: string, index: number, formFieldsData: any): void {
        if (fontStyleType === 'bold') {
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isBold = isFontStyleEnabled;
            inputElement.style.fontWeight = fontStyleValue;
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            if (index > -1) {
                formFieldsData[index].FormField.font.isBold = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[index].FormField.font.isBold = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isBold = isFontStyleEnabled;
        } else if (fontStyleType === 'italic') {
            inputElement.style.fontStyle = fontStyleValue;
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isItalic = isFontStyleEnabled;
            if (index > -1) {
                formFieldsData[index].FormField.font.isItalic = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[index].FormField.font.isItalic = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isItalic = isFontStyleEnabled;

        } else if (fontStyleType === 'underline') {
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            inputElement.style.textDecoration = fontStyleValue;
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isUnderline = isFontStyleEnabled;
            if (index > -1) {
                formFieldsData[index].FormField.font.isUnderline = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[index].FormField.font.isUnderline = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isUnderline = isFontStyleEnabled;

        } else if (fontStyleType === 'line-through') {
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            inputElement.style.textDecoration = fontStyleValue;
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isStrikeout = isFontStyleEnabled;
            if (index > -1) {
                formFieldsData[index].FormField.font.isStrikeout = isFontStyleEnabled;
                this.pdfViewerBase.formFieldCollection[index].FormField.font.isStrikeout = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable as any)[selectedItem.id.split('_')[0]].font.isStrikeout = isFontStyleEnabled;
        }
    }

    private setDropdownFontStyleValue(dropdownElement: any, fontStyleType: string, value: string): void {
        if (dropdownElement.length > 0) {
            for (let i = 0; i < dropdownElement.length; i++) {
                if (fontStyleType === 'bold') {
                    dropdownElement[i].style.fontWeight = value;
                } else if (fontStyleType === 'italic') {
                    dropdownElement[i].style.fontStyle = value;
                } else if (fontStyleType === 'underline') {
                    dropdownElement[i].style.textDecoration = value;
                } else if (fontStyleType === 'line-through') {
                    dropdownElement[i].style.textDecoration = value;
                }
            }
        }
    }
    /**
     * @private
     */
    public updateFormFieldPropertiesChanges(name: string, selectedItem: PdfFormFieldBaseModel, isValueChanged: boolean, isFontFamilyChanged: boolean,
        isFontSizeChanged: boolean, isFontStyleChanged: boolean, isColorChanged: boolean, isBackgroundColorChanged: boolean, isBorderColorChanged: boolean,
        isBorderWidthChanged: boolean, isAlignmentChanged: boolean, isReadOnlyChanged: boolean, isVisibilityChanged: boolean, isMaxLengthChanged: boolean,
        isRequiredChanged: boolean, isPrintChanged: boolean, isToolTipChanged: boolean, oldValue: any, newValue: any, isNamechanged?: boolean, previousName?: string): void {
        let field: IFormField = {
            name: (selectedItem as any).name, id: (selectedItem as any).id, value: (selectedItem as any).value, fontFamily: (selectedItem as any).fontFamily, fontSize: (selectedItem as any).fontSize, fontStyle: (selectedItem as any).fontStyle,
            color: (selectedItem as any).color, backgroundColor: (selectedItem as any).backgroundColor, alignment: (selectedItem as any).alignment, isReadonly: (selectedItem as any).isReadonly, visibility: (selectedItem as any).visibility,
            maxLength: (selectedItem as any).maxLength, isRequired: (selectedItem as any).isRequired, isPrint: (selectedItem as any).isPrint, rotation: (selectedItem as any).rotateAngle, tooltip: (selectedItem as any).tooltip, options: (selectedItem as any).options,
            isChecked: (selectedItem as any).isChecked, isSelected: (selectedItem as any).isSelected, previousName: previousName, currentName: selectedItem.name
        };
        this.pdfViewer.fireFormFieldPropertiesChangeEvent("formFieldPropertiesChange", field, selectedItem.pageIndex, isValueChanged, isFontFamilyChanged, isFontSizeChanged,
            isFontStyleChanged, isColorChanged, isBackgroundColorChanged, isBorderColorChanged, isBorderWidthChanged, isAlignmentChanged, isReadOnlyChanged, isVisibilityChanged,
            isMaxLengthChanged, isRequiredChanged, isPrintChanged, isToolTipChanged, oldValue, newValue, isNamechanged);
    }

    private onCancelClicked(args: any): void {
        this.propertiesDialog.hide();
    }

    private createAppearanceTab(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        // eslint-disable-next-line max-len
        let appearanceDiv: HTMLElement = createElement('div', { id: elementID + '_properties_appearance' });
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'DropdownList' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'ListBox') {
            appearanceDiv.style.height = '260px';
        } else {
            appearanceDiv.style.height = '336px'
        }
        let propertySpliter: HTMLElement = createElement('div');
        propertySpliter.className = 'e-pv-properties-header-spliter';
        appearanceDiv.appendChild(propertySpliter);
        const tabContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-tab-style-prop' });
        appearanceDiv.appendChild(tabContainer);
        // <div style="/* border-color: red; *//* border-width: 2px; *//* background: red; *//* height: 1px; */width: 100%;position: absolute;padding-top: 35px;/* border-bottom-color: black; *//* border-bottom-width: 2px; *//* border: solid; */border-bottom-style: solid;border-bottom-width: 1px;left: 0;border-bottom-color: #E0E0E0;"></div>
        if (this.pdfViewer.selectedItems && (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'ListBox' || this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'DropdownList')) {
            // eslint-disable-next-line max-len
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
                    },
                ],
            }, tabContainer)
        } else if (this.pdfViewer.selectedItems && (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'SignatureField' || this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'InitialField')) {
            // eslint-disable-next-line max-len
            this.tabControl = new Tab({
                items: [
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                    }
                ],
            }, tabContainer)
        } else {
            // eslint-disable-next-line max-len
            this.tabControl = new Tab({
                items: [
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Appearance') + '</div>' }, content: this.createAppearanceProperties()
                    }
                ],
            }, tabContainer)
        }
        (tabContainer.children[1] as HTMLElement).style.height = '100%';
        return appearanceDiv;
    }

    private createGeneralProperties(): any {
        let selectedItem = this.pdfViewer.selectedItems.formFields ? this.pdfViewer.selectedItems.formFields[0] : null;
        const visibilityItems: string[] = ['visible', 'hidden'];
        // eslint-disable-next-line max-len
        const elementID: string = this.pdfViewer.element.id;
        const generalPropertiesDiv: HTMLElement = createElement('div', { id: elementID + '_general_prop_appearance' });
        const textStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-text-edit-prop' });
        generalPropertiesDiv.appendChild(textStyleContainer);

        let formFieldNameMainDiv = createElement('div', { className: 'e-pv-properties-form-field-name-main-div' });
        // eslint-disable-next-line max-len
        let formFieldNameDiv = createElement('div', { className: 'e-pv-properties-name-edit-prop' });
        let formFieldNameContainer = createElement('input', { className: 'e-pv-properties-name-edit-input e-input' });
        formFieldNameDiv.appendChild(formFieldNameContainer);
        formFieldNameMainDiv.appendChild(formFieldNameDiv);
        // eslint-disable-next-line max-len
        this.formFieldName = new TextBox({ type: "text", floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Name'), value: selectedItem.name, cssClass: 'e-pv-properties-formfield-name' }, (formFieldNameContainer as HTMLInputElement));
        textStyleContainer.appendChild(formFieldNameMainDiv);
        let formFieldTooltipMainDiv = createElement('div', { className: 'e-pv-properties-form-field-tooltip-main-div' });
        let formFieldTooltipDiv = createElement('div', { className: 'e-pv-properties-tooltip-edit-prop' });
        let formFieldTooltipContainer = createElement('input', { className: 'e-pv-properties-tooltip-prop-input e-input' });
        formFieldTooltipDiv.appendChild(formFieldTooltipContainer);
        formFieldTooltipMainDiv.appendChild(formFieldTooltipDiv);
        // eslint-disable-next-line max-len
        this.formFieldTooltip = new TextBox({ type: "text", floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Tooltip'), value: selectedItem.tooltip, cssClass: 'e-pv-properties-formfield-tooltip' }, (formFieldTooltipContainer as HTMLInputElement));
        textStyleContainer.appendChild(formFieldTooltipMainDiv);

        const visibilityContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-visibility-style-prop' });
        generalPropertiesDiv.appendChild(visibilityContainer);

        let formFieldValueMainDiv = createElement('div', { className: 'e-pv-properties-form-field-value-main-div' });
        let formFieldValueDiv = createElement('div', { className: 'e-pv-properties-value-edit-prop' });
        let formFieldValueContainer = createElement('input', { className: 'e-pv-properties-value-input e-input' });
        formFieldValueDiv.appendChild(formFieldValueContainer);
        formFieldValueMainDiv.appendChild(formFieldValueDiv);
        // eslint-disable-next-line max-len
        this.formFieldValue = new TextBox({ type: "text", floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Value'), value: selectedItem.value, cssClass: 'e-pv-properties-formfield-value' }, (formFieldValueContainer as HTMLInputElement));
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'Textbox') {
            this.formFieldValue.enabled = false;
            this.formFieldValue.value = '';
        }
        visibilityContainer.appendChild(formFieldValueMainDiv);

        let formFieldVisibilityMainDiv = createElement('div', { className: 'e-pv-properties-form-field-visibility-main-div' });
        let formFieldVisibilityDiv = createElement('div', { className: 'e-pv-properties-visibility-edit-prop' });
        let formFieldVisibilityContainer = createElement('div', { className: 'e-pv-properties-formfield-visibility' });
        formFieldVisibilityDiv.appendChild(formFieldVisibilityContainer);
        formFieldVisibilityMainDiv.appendChild(formFieldVisibilityDiv);
        let selectedIndex: number = selectedItem.visibility === 'visible' ? 0 : 1;
        this.formFieldVisibility = new DropDownList({ dataSource: visibilityItems, floatLabelType: 'Always', index: selectedIndex, value: selectedItem.visibility, placeholder: this.pdfViewer.localeObj.getConstant('Form Field Visibility'), cssClass: 'e-pv-properties-formfield-visibility' }, formFieldVisibilityContainer);
        visibilityContainer.appendChild(formFieldVisibilityMainDiv);

        let checkboxMainDiv = createElement('div', { className: 'e-pv-properties-checkbox-main-div-prop' });
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
        let tooltip: Tooltip = new Tooltip({
            content: tooltipContent
        });
        // render initialized tooltip
        tooltip.appendTo(targetElement);
        tooltip.beforeOpen = this.tooltipBeforeOpen.bind(this);
    }
    private tooltipBeforeOpen(args: any) {
        let currentFormField: any = (this.pdfViewer.nameTable as any)[args.target.id.split('_')[0]];
        if (!isNullOrUndefined(currentFormField)) {
            args.element.children[0].innerHTML = currentFormField.tooltip;
        }
    }
    private createAppearanceProperties(): any {
        let selectedItem = this.pdfViewer.selectedItems.formFields ? this.pdfViewer.selectedItems.formFields[0] : null;
        const fontFamilyItems: string[] = ['Helvetica', 'Courier', 'Times New Roman', 'Symbol', 'ZapfDingbats'];
        const fontSizeItems: string[] = ['6px', '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px'];
        const elementID: string = this.pdfViewer.element.id;
        const appearancePropertiesDiv: HTMLElement = createElement('div', { id: elementID + '_formatting_text_prop_appearance' });

        const formatTextStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-format-text-style-prop' });
        appearancePropertiesDiv.appendChild(formatTextStyleContainer);

        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Formatting'), formatTextStyleContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_formatting');
        const fontItemsContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-items-container' });

        const fontFamilyDropdownContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-family-container' });
        const formatdropdownContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-format-font-family-prop' });
        fontFamilyDropdownContainer.appendChild(formatdropdownContainer);
        fontItemsContainer.appendChild(fontFamilyDropdownContainer);
        this.formFieldFontFamily = new DropDownList({ dataSource: fontFamilyItems, value: this.getFontFamily(selectedItem.fontFamily) ? selectedItem.fontFamily : 'Helvetica', cssClass: 'e-pv-properties-formfield-fontfamily' }, formatdropdownContainer);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Font family'), fontFamilyDropdownContainer);
        const fontSizeContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-size-container' });
        const fontSizeDropdownContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-format-font-family-prop' });
        fontSizeContainer.appendChild(fontSizeDropdownContainer);
        fontItemsContainer.appendChild(fontSizeContainer);
        this.formFieldFontSize = new DropDownList({ dataSource: fontSizeItems, value: selectedItem.fontSize + 'px', cssClass: 'e-pv-properties-formfield-fontsize' }, fontSizeDropdownContainer);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Font size'), fontSizeContainer);
        let fontStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-font-style' });
        fontStyleContainer.onclick = this.fontStyleClicked.bind(this);
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_bold', 'e-pv-bold-icon', selectedItem.font.isBold));
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_italic', 'e-pv-italic-icon', selectedItem.font.isItalic));
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_underline_textinput', 'e-pv-underlinetext-icon', selectedItem.font.isUnderline));
        // eslint-disable-next-line max-len
        fontStyleContainer.appendChild(this.addClassFontItem('_formField_strikeout', 'e-pv-strikeout-icon', selectedItem.font.isStrikeout));
        fontItemsContainer.appendChild(fontStyleContainer);
        this.getFontStyle(selectedItem.font);
        appearancePropertiesDiv.appendChild(fontItemsContainer);

        const fontColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-font-color-container' });
        let fontAlignContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-font-align' });
        fontAlignContainer.onclick = this.fontAlignClicked.bind(this);
        let alignment = selectedItem.alignment.toLowerCase();
        fontAlignContainer.appendChild(this.addClassFontItem('_formField_left_align', 'e-pv-left-align-icon', alignment === 'left' ? true : false));
        fontAlignContainer.appendChild(this.addClassFontItem('_formField_center_align', 'e-pv-center-align-icon', alignment === 'center' ? true : false));
        fontAlignContainer.appendChild(this.addClassFontItem('_formField_right_align', 'e-pv-right-align-icon', alignment === 'right' ? true : false));
        this.getAlignment(alignment);
        fontColorContainer.appendChild(fontAlignContainer);

        this.fontColorElement = createElement('div', { className: 'e-pv-formfield-textcolor-icon', id: this.pdfViewer.element.id + 'formField_textColor' });
        this.fontColorPalette = this.createColorPicker(this.fontColorElement.id, selectedItem.color);
        selectedItem.color !== 'black' ? this.fontColorValue = selectedItem.color : null;
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
        let maxLengthGroup: HTMLElement = createElement('div', { className: 'e-pv-formfield-maxlength-group', id: this.pdfViewer.element.id + 'formField_maxlength_group' })
        let maxLengthContainer: HTMLElement = createElement('div', { className: 'e-pv-formfield-maxlength-icon', id: this.pdfViewer.element.id + 'formField_maxlength' });
        maxLengthGroup.appendChild(maxLengthContainer);
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Max Length'), maxLengthContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_maxlength');
        let maxLengthDropdownContainer: HTMLElement = createElement('div', { className: 'e-pv-formfield-maxlength', id: this.pdfViewer.element.id + 'formField_maxlength_container' });
        let maxLengthItemDropdown: any = createElement('input', { className: 'e-pv-formfield-maxlength-input e-input' });
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

        let colorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-color-container-style-prop' });
        let backgroundColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-fill-color-style-prop' });
        appearancePropertiesDiv.appendChild(backgroundColorContainer);
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Fill'), backgroundColorContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_fontcolor');
        this.colorDropDownElement = createElement('div', { className: 'e-pv-formfield-fontcolor-icon', id: this.pdfViewer.element.id + 'formField_fontColor' });
        this.colorPalette = this.createColorPicker(this.colorDropDownElement.id, selectedItem.backgroundColor);
        this.colorPalette.change = this.onColorPickerChange.bind(this);
        // eslint-disable-next-line max-len
        this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Fill Color'), this.colorDropDown.element);
        backgroundColorContainer.appendChild(this.colorDropDownElement);
        colorContainer.appendChild(backgroundColorContainer);
        this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.selectedItems.formFields[0].backgroundColor);
        let strokeColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-stroke-color-style-prop' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Border'), strokeColorContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_strokecolor');

        this.strokeDropDownElement = createElement('div', { className: 'e-pv-formfield-strokecolor-icon', id: this.pdfViewer.element.id + 'formField_strokeColor' });
        this.strokeColorPicker = this.createColorPicker(this.strokeDropDownElement.id, selectedItem.borderColor);
        this.strokeColorPicker.change = this.onStrokePickerChange.bind(this);
        // eslint-disable-next-line max-len
        this.strokeDropDown = this.createDropDownButton(this.strokeDropDownElement, 'e-pv-annotation-stroke-icon', this.strokeColorPicker.element.parentElement);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Border Color'), this.strokeDropDown.element);
        strokeColorContainer.appendChild(this.strokeDropDownElement);
        colorContainer.appendChild(strokeColorContainer);
        this.updateColorInIcon(this.strokeDropDownElement, this.pdfViewer.selectedItems.formFields[0].borderColor);
        let strokeThicknessContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-stroke-thickness-style-prop' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Thickness'), strokeThicknessContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_strokethickness');

        this.thicknessElement = createElement('div', { className: 'e-pv-formfield-strokethickness-icon', id: this.pdfViewer.element.id + 'formField_strokethickness' });;
        const thicknessContainer: HTMLElement = this.createThicknessSlider(this.thicknessElement.id);
        // eslint-disable-next-line max-len
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

    private createOptionProperties(): any {
        const elementID: string = this.pdfViewer.element.id;
        const optionPropertiesDiv: HTMLElement = createElement('div', { id: elementID + '_option_prop_appearance' });

        let listItemAddContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-list-add-div' });
        let formFieldListItemMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-list-item-main-div' });
        // eslint-disable-next-line max-len
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('List Item'), formFieldListItemMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_listitem');
        let formFieldListItemDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-list-item-edit-prop' });
        let formFieldListItemContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-list-item-input e-input' });
        formFieldListItemContainer.addEventListener('keyup', (args) => {
            this.formFieldAddButton.disabled = true;
            this.formFieldListItem.value = (args.target as any).value;
            if (args.target && (args.target as any).value) {
                if (this.formFieldListItemCollection.length > 0) {
                    for (let i: number = 0; i < this.formFieldListItemCollection.length; i++) {
                        let itemName: string = this.formFieldListItemCollection[i];
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
        // eslint-disable-next-line max-len
        this.formFieldListItem = new TextBox({ type: "text", cssClass: 'e-pv-properties-formfield-listitem' }, (formFieldListItemContainer as HTMLInputElement));
        listItemAddContainer.appendChild(formFieldListItemMainDiv);
        optionPropertiesDiv.appendChild(listItemAddContainer);

        let buttonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-list-btn-div' });
        let buttonAddInput = createElement('button', { className: 'e-btn' });
        buttonAddInput.addEventListener('click', this.addListItemOnClick.bind(this))
        buttonDiv.appendChild(buttonAddInput);
        this.formFieldAddButton = new Button({ content: this.pdfViewer.localeObj.getConstant('Add'), disabled: true, cssClass: 'e-pv-properties-dropdown-btn' }, buttonAddInput as HTMLButtonElement);
        listItemAddContainer.appendChild(buttonDiv);

        let exportValueContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-export-value-div' });
        let formFieldexportValueMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-export-value-main-div' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Export Value'), formFieldexportValueMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_exportValue');
        let formFieldExportItemDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-export-value-edit-prop' });
        let formFieldExportItemContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-export-value-input e-input' });
        formFieldExportItemDiv.appendChild(formFieldExportItemContainer);
        formFieldexportValueMainDiv.appendChild(formFieldExportItemDiv);
        // eslint-disable-next-line max-len
        this.formFieldListItem = new TextBox({ type: "text", cssClass: 'e-pv-properties-formfield-exportvalue' }, (formFieldExportItemContainer as HTMLInputElement));
        exportValueContainer.appendChild(formFieldexportValueMainDiv);
        optionPropertiesDiv.appendChild(exportValueContainer);

        let dropdownListItemContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-option-dropdown-list-div' });
        let formFieldDropdownListMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-option-dropdown-list-item-div' });
        let selectedElement: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        if (selectedElement.formFieldAnnotationType === 'DropdownList') {
            // eslint-disable-next-line max-len
            this.createLabelElement(this.pdfViewer.localeObj.getConstant('Dropdown Item List'), formFieldDropdownListMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_dropdown_listitem');
        } else {
            // eslint-disable-next-line max-len
            this.createLabelElement(this.pdfViewer.localeObj.getConstant('List Box Item List'), formFieldDropdownListMainDiv, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_dropdown_listitem');
        }
        dropdownListItemContainer.appendChild(formFieldDropdownListMainDiv);

        let btnTextAreaContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-btn-textarea-container' });
        let textAreaContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-formfield-textarea', styles: 'width:300px;height:123px;border:1px solid #E0E0E0;margin-right:15px;overflow:auto' });
        let listElement: HTMLElement = createElement('ul', { id: this.pdfViewer.element.id + '_ul_list_item', className: 'e-pv-form-designer-ul-list-items' });
        let listCount = this.createListElement(listElement);
        textAreaContainer.appendChild(listElement);
        btnTextAreaContainer.appendChild(textAreaContainer);

        let buttonGroup: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-group-btn-div' });
        let deleteButtonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-delete-btn-div' });
        let buttonDeleteInput = createElement('button', { className: 'e-btn' });
        buttonDeleteInput.addEventListener('click', this.deleteListItem.bind(this));
        deleteButtonDiv.appendChild(buttonDeleteInput);
        this.formFieldDeleteButton = new Button({ content: this.pdfViewer.localeObj.getConstant('Delete Item'), disabled: listCount > 0 ? false : true, cssClass: 'e-pv-properties-dropdown-btn' }, buttonDeleteInput as HTMLButtonElement);
        buttonGroup.appendChild(deleteButtonDiv);

        let upButtonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-up-btn-div' });
        let buttonUpInput = createElement('button', { className: 'e-btn' });
        buttonUpInput.addEventListener('click', this.moveUpListItem.bind(this));
        upButtonDiv.appendChild(buttonUpInput);
        this.formFieldUpButton = new Button({ content: this.pdfViewer.localeObj.getConstant('Up'), disabled: listCount > 1 ? false : true, cssClass: 'e-pv-properties-dropdown-btn' }, buttonUpInput as HTMLButtonElement);
        buttonGroup.appendChild(upButtonDiv);

        let downButtonDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-down-btn-div' });
        let buttonDownInput = createElement('button', { className: 'e-btn' });
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
        let dropdownValue: string = this.formFieldListItem.value;
        this.formFieldListItemCollection.push(dropdownValue);
        let ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                let element: Element = ulElement.children[i];
                if (element.classList.contains('e-pv-li-select')) {
                    element.classList.remove('e-pv-li-select');
                }
            }
        }
        let createLiElement = createElement('li', { className: 'e-pv-formfield-li-element' });
        createLiElement.addEventListener('click', this.listItemOnClick.bind(this))
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
        let ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                let element: Element = ulElement.children[i];
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
        let ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                let element: Element = ulElement.children[i];
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
        let ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                let element: Element = ulElement.children[i];
                if (element.classList.contains('e-pv-li-select')) {
                    if (element.previousElementSibling) {
                        element.parentNode.insertBefore(element, element.previousElementSibling);
                        if (!element.previousElementSibling)
                            this.formFieldUpButton.disabled = true;
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
        let ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (var i = 0; i < ulElement.children.length; i++) {
                element = ulElement.children[i];
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
        let selectedElement: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        if (selectedElement) {
            if (selectedElement.options && selectedElement.options.length > 0) {
                for (let i: number = 0; i < selectedElement.options.length; i++) {
                    let dropdownValue: string = selectedElement.options[i].itemName;
                    if (this.formFieldListItemCollection[i] !== selectedElement.options[i].itemName) {
                        this.formFieldListItemCollection.push(dropdownValue);
                        let createLiElement = createElement('li', { className: 'e-pv-formfield-li-element' });
                        createLiElement.addEventListener('click', this.listItemOnClick.bind(this));
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
        // eslint-disable-next-line max-len
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
            if (args.target.id.indexOf("formField_bold") !== -1) {
                let item = (args.target.id.indexOf("formField_bold_div") !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                    this.isBold = true;
                this.isBold = !this.isBold;
                if (this.isBold) {
                    this.formFieldBold = "bold";
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldBold = "normal";
                    item.classList.remove('e-pv-li-select');
                }

            } else if (args.target.id.indexOf("formField_italic") !== -1) {
                let item = (args.target.id.indexOf("formField_italic_div") !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                    this.isItalic = true;
                this.isItalic = !this.isItalic;
                if (this.isItalic) {
                    this.formFieldItalic = "italic";
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldItalic = "normal";
                    item.classList.remove('e-pv-li-select');
                }
            } else if (args.target.id.indexOf("formField_underline") !== -1) {
                let item = (args.target.id.indexOf("formField_underline_textinput_div") !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                    this.isUnderline = true;
                this.isUnderline = !this.isUnderline;
                if (this.isUnderline) {
                    this.formFieldUnderline = "underline";
                    this.isStrikeThrough = false;
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldUnderline = "none";
                    item.classList.remove('e-pv-li-select');
                }
            } else if (args.target.id.indexOf("formField_strikeout") !== -1) {
                let item = (args.target.id.indexOf("formField_strikeout_div") !== -1) ? args.target : args.target.parentElement;
                if (item.classList.contains('e-pv-li-select'))
                    this.isStrikeThrough = true;
                this.isStrikeThrough = !this.isStrikeThrough;
                if (this.isStrikeThrough) {
                    this.formFieldStrikeOut = "line-through";
                    this.isUnderline = false;
                    item.classList.add('e-pv-li-select');
                } else {
                    this.formFieldStrikeOut = "none";
                    item.classList.remove('e-pv-li-select');
                }
            }
        }
    }
    private clearFontAlignIconSelection(currentElement: HTMLElement): void {
        for (let i: number = 0; i < currentElement.children.length; i++) {
            if (currentElement.children[i].classList.contains('e-pv-li-select')) {
                currentElement.children[i].classList.remove('e-pv-li-select');
            }
        }
    }
    private fontAlignClicked(args: any): void {
        if (args.target) {
            args.target.classList.remove('e-pv-li-select');
            if (args.target.id.indexOf("_formField_left_align") !== -1) {
                let item = (args.target.id.indexOf("_formField_left_align_div") !== -1) ? args.target : args.target.parentElement;
                this.formFieldAlign = "left";
                this.clearFontAlignIconSelection(args.currentTarget);
                item.classList.add('e-pv-li-select');
            } else if (args.target.id.indexOf("_formField_right_align") !== -1) {
                let item = (args.target.id.indexOf("_formField_right_align_div") !== -1) ? args.target : args.target.parentElement;
                this.formFieldAlign = "right";
                this.clearFontAlignIconSelection(args.currentTarget);
                item.classList.add('e-pv-li-select');
            } else {
                let item = (args.target.id.indexOf("_formField_center_align_div") !== -1) ? args.target : args.target.parentElement;
                this.formFieldAlign = "center";
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
     * @private
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
        // eslint-disable-next-line max-len
        const dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        return dropDownButton;
    }
    /**
     * @private
    */
    public addClassFontItem(idString: string, className: string, isSelectedStyle?: boolean): HTMLElement {
        const element: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + idString + '_div' })
        element.classList.add(className + "-div");
        const spanElement: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + idString + '_span' });
        spanElement.classList.add(className);
        spanElement.classList.add("e-pv-icon");
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
            element.classList.add('e-pv-li-select');
        element.appendChild(spanElement);
        return element;
    }

    // eslint-disable-next-line max-len
    private createLabelElement(labelText: string, parentElement: HTMLElement, isLabelNeeded: boolean, className: string, idString: string): void {
        const container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        let label: HTMLElement = null;
        if (isLabelNeeded) {
            label = createElement('div', { id: idString + '_label', className: className });
            label.textContent = labelText;
            container.appendChild(label);
        }
        parentElement.appendChild(label);
    }

    private setReadOnlyToFormField(selectedItem: PdfFormFieldBaseModel, isReadOnly: any) {
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            let formField = this.pdfViewer.formFieldCollection[i] as PdfFormFieldBaseModel;
            if (formField.formFieldAnnotationType === selectedItem.formFieldAnnotationType && formField.name === selectedItem.name && formField.id === selectedItem.id) {
                formField.isReadonly = isReadOnly;
                switch (formField.formFieldAnnotationType) {
                    case 'Textbox':
                    case 'PasswordField':
                    case 'DropdownList':
                    case 'ListBox':
                    case 'SignatureField':
                    case 'InitialField':
                        let inputElement: Element = document.getElementById(formField.id + "_content_html_element").firstElementChild.firstElementChild;
                        this.setReadOnlyToElement(formField, inputElement, isReadOnly);
                        break;
                    case 'RadioButton':
                        let radioButtonDivDivElement: Element = document.getElementById(formField.id + "_content_html_element").firstElementChild.firstElementChild.firstElementChild;
                        this.setReadOnlyToElement(formField, radioButtonDivDivElement, isReadOnly);
                        break;
                    case 'Checkbox':
                        let checkboxDivElement: Element = document.getElementById(formField.id + "_content_html_element").firstElementChild.firstElementChild.lastElementChild;
                        this.setReadOnlyToElement(formField, checkboxDivElement, isReadOnly);
                        break;
                }
            }
        }
    }

    /**
     * @private
    */
    public getFormDesignerSignField(signatureFieldCollection: any): any[] {
        let formDesignerData: any = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        // eslint-disable-next-line
        let currentData: any;
        if (formDesignerData) {
            // eslint-disable-next-line
            let formFieldsObject: any = JSON.parse(formDesignerData);
            for (let i: number = 0; i < formFieldsObject.length; i++) {
                currentData = formFieldsObject[i].FormField;
                if (currentData.formFieldAnnotationType === 'SignatureField') {
                    // eslint-disable-next-line
                    currentData['uniqueID'] = currentData.id.replace("_content", "");
                    signatureFieldCollection.push(formFieldsObject[i]);
                }
            }
        }
        return signatureFieldCollection;
    }

    private setRequiredToFormField(selectedItem: PdfFormFieldBaseModel, isRequired: boolean) {
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            let formField = this.pdfViewer.formFieldCollection[i] as PdfFormFieldBaseModel;
            if (formField.formFieldAnnotationType === selectedItem.formFieldAnnotationType && formField.name === selectedItem.name && formField.id === selectedItem.id) {
                formField.isRequired = isRequired;
                switch (formField.formFieldAnnotationType) {
                    case 'Textbox':
                    case 'PasswordField':
                    case 'DropdownList':
                    case 'SignatureField':
                    case 'InitialField':
                        let inputElement: Element = document.getElementById(formField.id + "_content_html_element").firstElementChild.firstElementChild;
                        this.setRequiredToElement(formField, inputElement, isRequired);
                        break;
                    case 'RadioButton':
                        let radioButtonDivDivElement: Element = document.getElementById(formField.id + "_content_html_element").firstElementChild.firstElementChild.firstElementChild;
                        this.setRequiredToElement(formField, radioButtonDivDivElement, isRequired);
                        this.updateFormFieldCollections(formField);
                        break;
                    case 'Checkbox':
                        let checkboxDivElement: Element = document.getElementById(formField.id + "_content_html_element").firstElementChild.firstElementChild.lastElementChild;
                        this.setRequiredToElement(formField, checkboxDivElement, isRequired);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private setReadOnlyToElement(selectedItem: PdfFormFieldBaseModel, inputElement: any, isReadOnly: boolean) {
        if (isReadOnly) {
            (inputElement as HTMLInputElement).disabled = true;
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                (inputElement as any).parentElement.style.cursor = 'default';
                (inputElement as any).parentElement.style.backgroundColor = 'transparent';
            }
            else {
                inputElement.style.cursor = 'default';
                inputElement.style.backgroundColor = 'transparent';
            }
        } else {
            (inputElement as HTMLInputElement).disabled = false;
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                (inputElement as any).parentElement.style.backgroundColor = selectedItem.backgroundColor;
            } else if (selectedItem.formFieldAnnotationType == "SignatureField" || selectedItem.formFieldAnnotationType == "InitialField") {
                inputElement.style.backgroundColor = 'transparent';
            } else {
                inputElement.style.backgroundColor = selectedItem.backgroundColor;
            }
        }
    }

    private setRequiredToElement(selectedItem: PdfFormFieldBaseModel, inputElement: any, isRequired: boolean) {
        if (isRequired) {
            (inputElement as HTMLInputElement).required = true;
            inputElement.style.border = '1px solid red';
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                let thickness: number = selectedItem.thickness === 0 ? 1 : selectedItem.thickness;
                (inputElement as any).parentElement.style.boxShadow = 'red 0px 0px 0px ' + thickness + 'px';
            }
        } else {
            (inputElement as HTMLInputElement).required = false;
            inputElement.style.borderWidth = selectedItem.thickness;
            inputElement.style.borderColor = selectedItem.borderColor;
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                (inputElement as any).parentElement.style.boxShadow = selectedItem.borderColor + ' 0px 0px 0px ' + selectedItem.thickness + 'px';
            }
        }
    }

    /**
     * @private
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
        const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_properties_window');
        if (dialogElement) {
            dialogElement.parentElement.removeChild(dialogElement);
        }
    }

    /**
     * @private
    */
    public destroy(): void {
        this.destroyPropertiesWindow();
    }


    private hex(x: number): string {
        return ('0' + x.toString(16)).slice(-2);
    }
    /**
     * @private
    */
    public getModuleName(): string {
        return 'FormDesigner';
    }

    private updateAnnotationCanvas(canvas: any, pageWidth: number, pageHeight: number, pageNumber: number): void {
        let ratio: number = this.pdfViewerBase.getZoomRatio();
        canvas.width = pageWidth * ratio;
        canvas.height = pageHeight * ratio;
        canvas.style.width = pageWidth + 'px';
        canvas.style.height = pageHeight + 'px';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '1';
        this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
    }

    private getFontFamily(fontFamily: any): boolean {
        let fontFamilyNames: String[] = ['Helvetica', 'Courier', 'TimesRoman', 'Symbol', 'ZapfDingbats'];
        return fontFamilyNames.indexOf(fontFamily) > -1 ? true : false;
    }

    private updateTextFieldSettingProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        let textFieldSettings: any = this.pdfViewer.textFieldSettings;
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(textFieldSettings.isReadOnly)) {
            drawingObject.isReadonly = textFieldSettings.isReadOnly;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(textFieldSettings.isRequired)) {
            drawingObject.isRequired = textFieldSettings.isRequired;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.value) {
            drawingObject.value = textFieldSettings.value;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.backgroundColor !== 'white') {
            drawingObject.backgroundColor = textFieldSettings.backgroundColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.borderColor !== 'black') {
            drawingObject.borderColor = textFieldSettings.borderColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.alignment !== 'Left') {
            drawingObject.alignment = textFieldSettings.alignment;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.color !== 'black') {
            drawingObject.color = textFieldSettings.color;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.fontFamily !== 'Helvetica') {
            drawingObject.fontFamily = textFieldSettings.fontFamily;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.fontSize !== 10) {
            drawingObject.fontSize = textFieldSettings.fontSize;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.fontStyle) {
            (drawingObject as any).fontStyle = this.getFontStyleName(textFieldSettings.fontStyle, drawingObject);;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.name) {
            drawingObject.name = textFieldSettings.name;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.tooltip) {
            drawingObject.tooltip = textFieldSettings.tooltip;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.thickness !== 1) {
            drawingObject.thickness = textFieldSettings.thickness;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.maxLength) {
            drawingObject.maxLength = textFieldSettings.maxLength;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && textFieldSettings.visibility) {
            drawingObject.visibility = textFieldSettings.visibility;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(textFieldSettings.isPrint)) {
            drawingObject.isPrint = textFieldSettings.isPrint;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(textFieldSettings.isMultiline)) {
            drawingObject.isMultiline = textFieldSettings.isMultiline;
        }
    }

    private updatePasswordFieldSettingProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        let passwordFieldSettings: any = this.pdfViewer.passwordFieldSettings;
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(passwordFieldSettings.isReadOnly)) {
            drawingObject.isReadonly = passwordFieldSettings.isReadOnly;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(passwordFieldSettings.isRequired)) {
            drawingObject.isRequired = passwordFieldSettings.isRequired;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.value) {
            drawingObject.value = passwordFieldSettings.value;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.backgroundColor !== 'white') {
            drawingObject.backgroundColor = passwordFieldSettings.backgroundColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.borderColor !== 'black') {
            drawingObject.borderColor = passwordFieldSettings.borderColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.alignment !== 'Left') {
            drawingObject.alignment = passwordFieldSettings.alignment;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.color !== 'black') {
            drawingObject.color = passwordFieldSettings.color;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.fontFamily !== 'Helvetica') {
            drawingObject.fontFamily = passwordFieldSettings.fontFamily;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.fontSize !== 10) {
            drawingObject.fontSize = passwordFieldSettings.fontSize;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.fontStyle) {
            (drawingObject as any).fontStyle = this.getFontStyleName(passwordFieldSettings.fontStyle, drawingObject);
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.name) {
            drawingObject.name = passwordFieldSettings.name;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.tooltip) {
            drawingObject.tooltip = passwordFieldSettings.tooltip;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.thickness !== 1) {
            drawingObject.thickness = passwordFieldSettings.thickness;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.maxLength) {
            drawingObject.maxLength = passwordFieldSettings.maxLength;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && passwordFieldSettings.visibility) {
            drawingObject.visibility = passwordFieldSettings.visibility;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(passwordFieldSettings.isPrint)) {
            drawingObject.isPrint = passwordFieldSettings.isPrint;
        }
    }

    private updateCheckBoxFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean) {
        let checkBoxFieldSettings: any = this.pdfViewer.checkBoxFieldSettings;
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(checkBoxFieldSettings.isReadOnly)) {
            drawingObject.isReadonly = checkBoxFieldSettings.isReadOnly;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(checkBoxFieldSettings.isRequired)) {
            drawingObject.isRequired = checkBoxFieldSettings.isRequired;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && checkBoxFieldSettings.backgroundColor !== 'white') {
            drawingObject.backgroundColor = checkBoxFieldSettings.backgroundColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && checkBoxFieldSettings.borderColor !== 'black') {
            drawingObject.borderColor = checkBoxFieldSettings.borderColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && checkBoxFieldSettings.name) {
            drawingObject.name = checkBoxFieldSettings.name;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && checkBoxFieldSettings.tooltip) {
            drawingObject.tooltip = checkBoxFieldSettings.tooltip;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && checkBoxFieldSettings.thickness !== 1) {
            drawingObject.thickness = checkBoxFieldSettings.thickness;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && checkBoxFieldSettings.visibility) {
            drawingObject.visibility = checkBoxFieldSettings.visibility;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(checkBoxFieldSettings.isPrint)) {
            drawingObject.isPrint = checkBoxFieldSettings.isPrint;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(checkBoxFieldSettings.isChecked)) {
            drawingObject.isChecked = checkBoxFieldSettings.isChecked;
        }
    }

    private updateRadioButtonFieldSettingProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean) {
        let radioButtonFieldSettings: any = this.pdfViewer.radioButtonFieldSettings;
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(radioButtonFieldSettings.isReadOnly)) {
            drawingObject.isReadonly = radioButtonFieldSettings.isReadOnly;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(radioButtonFieldSettings.isRequired)) {
            drawingObject.isRequired = radioButtonFieldSettings.isRequired;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && radioButtonFieldSettings.backgroundColor !== 'white') {
            drawingObject.backgroundColor = radioButtonFieldSettings.backgroundColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && radioButtonFieldSettings.borderColor !== 'black') {
            drawingObject.borderColor = radioButtonFieldSettings.borderColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && radioButtonFieldSettings.name) {
            drawingObject.name = radioButtonFieldSettings.name;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && radioButtonFieldSettings.tooltip) {
            drawingObject.tooltip = radioButtonFieldSettings.tooltip;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && radioButtonFieldSettings.thickness !== 1) {
            drawingObject.thickness = radioButtonFieldSettings.thickness;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && radioButtonFieldSettings.visibility) {
            drawingObject.visibility = radioButtonFieldSettings.visibility;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(radioButtonFieldSettings.isPrint)) {
            drawingObject.isPrint = radioButtonFieldSettings.isPrint;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(radioButtonFieldSettings.isSelected)) {
            drawingObject.isSelected = radioButtonFieldSettings.isSelected;
        }
    }

    private updateDropdownFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean) {
        let dropdownFieldSettings: any = this.pdfViewer.DropdownFieldSettings;
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(dropdownFieldSettings.isReadOnly)) {
            drawingObject.isReadonly = dropdownFieldSettings.isReadOnly;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(dropdownFieldSettings.isRequired)) {
            drawingObject.isRequired = dropdownFieldSettings.isRequired;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.backgroundColor !== 'white') {
            drawingObject.backgroundColor = dropdownFieldSettings.backgroundColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.borderColor !== 'black') {
            drawingObject.borderColor = dropdownFieldSettings.borderColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.alignment !== 'Left') {
            drawingObject.alignment = dropdownFieldSettings.alignment;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.color !== 'black') {
            drawingObject.color = dropdownFieldSettings.color;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.fontFamily !== 'Helvetica') {
            drawingObject.fontFamily = dropdownFieldSettings.fontFamily;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.fontSize !== 10) {
            drawingObject.fontSize = dropdownFieldSettings.fontSize;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.fontStyle) {
            (drawingObject as any).fontStyle = this.getFontStyleName(dropdownFieldSettings.fontStyle, drawingObject);;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.name) {
            drawingObject.name = dropdownFieldSettings.name;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.tooltip) {
            drawingObject.tooltip = dropdownFieldSettings.tooltip;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.thickness !== 1) {
            drawingObject.thickness = dropdownFieldSettings.thickness;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.visibility) {
            drawingObject.visibility = dropdownFieldSettings.visibility;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(dropdownFieldSettings.isPrint)) {
            drawingObject.isPrint = dropdownFieldSettings.isPrint;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && dropdownFieldSettings.options) {
            drawingObject.options = drawingObject.options && drawingObject.options.length > 0 ? drawingObject.options : dropdownFieldSettings.options;
        }
    }

    private updatelistBoxFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean) {
        let listBoxFieldSettings: any = this.pdfViewer.listBoxFieldSettings;
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(listBoxFieldSettings.isReadOnly)) {
            drawingObject.isReadonly = listBoxFieldSettings.isReadOnly;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(listBoxFieldSettings.isRequired)) {
            drawingObject.isRequired = listBoxFieldSettings.isRequired;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.backgroundColor !== 'white') {
            drawingObject.backgroundColor = listBoxFieldSettings.backgroundColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.borderColor !== 'black') {
            drawingObject.borderColor = listBoxFieldSettings.borderColor;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.alignment !== 'Left') {
            drawingObject.alignment = listBoxFieldSettings.alignment;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.color !== 'black') {
            drawingObject.color = listBoxFieldSettings.color;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.fontFamily !== 'Helvetica') {
            drawingObject.fontFamily = listBoxFieldSettings.fontFamily;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.fontSize !== 10) {
            drawingObject.fontSize = listBoxFieldSettings.fontSize;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.fontStyle) {
            (drawingObject as any).fontStyle = this.getFontStyleName(listBoxFieldSettings.fontStyle, drawingObject);;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.name) {
            drawingObject.name = listBoxFieldSettings.name;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.tooltip) {
            drawingObject.tooltip = listBoxFieldSettings.tooltip;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.thickness !== 1) {
            drawingObject.thickness = listBoxFieldSettings.thickness;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.visibility) {
            drawingObject.visibility = listBoxFieldSettings.visibility;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(listBoxFieldSettings.isPrint)) {
            drawingObject.isPrint = listBoxFieldSettings.isPrint;
        }
        if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && listBoxFieldSettings.options) {
            drawingObject.options = drawingObject.options && drawingObject.options.length > 0 ? drawingObject.options : listBoxFieldSettings.options;
        }
    }

    private updateSignInitialFieldProperties(signatureField: any, isInitialField: boolean, isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean) {
        let initialFieldSettings: any = this.pdfViewer.initialFieldSettings;
        let signatureFieldSettings: any = this.pdfViewer.signatureFieldSettings;
        if (isInitialField) {
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(initialFieldSettings.isReadOnly)) {
                signatureField.isReadonly = initialFieldSettings.isReadOnly;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(initialFieldSettings.isRequired)) {
                signatureField.isRequired = initialFieldSettings.isRequired;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && initialFieldSettings.visibility) {
                signatureField.visibility = initialFieldSettings.visibility;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && initialFieldSettings.tooltip) {
                signatureField.tooltip = initialFieldSettings.tooltip;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && initialFieldSettings.name) {
                signatureField.name = initialFieldSettings.name;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(initialFieldSettings.isPrint)) {
                signatureField.isPrint = initialFieldSettings.isPrint;
            }
        }
        else {
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(signatureFieldSettings.isReadOnly)) {
                signatureField.isReadonly = signatureFieldSettings.isReadOnly;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(signatureFieldSettings.isRequired)) {
                signatureField.isRequired = signatureFieldSettings.isRequired;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && signatureFieldSettings.visibility) {
                signatureField.visibility = signatureFieldSettings.visibility;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && signatureFieldSettings.tooltip) {
                signatureField.tooltip = signatureFieldSettings.tooltip;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && signatureFieldSettings.name) {
                signatureField.name = signatureFieldSettings.name;
            }
            if ((isFormDesignerToolbarVisible || isSetFormFieldMode) && !isNullOrUndefined(signatureFieldSettings.isPrint)) {
                signatureField.isPrint = signatureFieldSettings.isPrint;
            }
        }
    }

    private getFontStyleName(fontStyle: any, drawingObject: PdfFormFieldBaseModel): any {
        let fontStyleName: any = 'None'
        if (fontStyle === 1) {
            drawingObject.font.isBold = true;
            fontStyleName = 'Bold';
        }
        if (fontStyle === 2) {
            drawingObject.font.isItalic = true;
            fontStyleName = 'Italic';
        }
        if (fontStyle === 8) {
            drawingObject.font.isStrikeout = true;
            fontStyleName = 'Strikethrough';
        }
        if (fontStyle === 4) {
            drawingObject.font.isUnderline = true;
            fontStyleName = 'Underline';
        }
        return fontStyleName
    }

    private getAlignment(alignment: string) {
        let align: string;
        if (alignment === 'left') {
            align = 'left';
        }
        else if (alignment === 'right') {
            align = 'right';
        }
        else if (alignment === 'center') {
            align = 'center'
        }
        this.formFieldAlign = align;
    }

    private getFontStyle(font: any) {
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