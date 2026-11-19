import { PdfViewer, FormFieldModel, FormFieldType, FormFieldPropertiesChangeArgs, FormFieldChangedEventArgs, FormFieldDataFormat, EditAction, IFormField, IFormFieldCollection, IFormFieldBound, PdfRenderedFields, FormFieldFont, FormFieldColor, ISize, TextAlignment, FontStyle, TextFieldSettings, PasswordFieldSettings, CheckBoxFieldSettings, DropdownFieldSettings, RadioButtonFieldSettings, ListBoxFieldSettings, SignatureFieldSettings, InitialFieldSettings, BarcodeFieldSettings, BarcodeSymbology, BarcodeValueFormat, Pdf417ErrorCorrectionLevel, QRErrorCorrectionLevel, TextItem, FormFieldAnnotationType, IRadiobuttonItem, SignatureType, ButtonRuntimeAction, ActionType, RGBA } from '../index';
import { FormFieldsBase } from '../pdf-base/index';
import { PdfViewerBase } from '../index';
import { Browser, isBlazor, isNullOrUndefined, initializeCSPTemplate, initializeTelemetryFeature } from '@syncfusion/ej2-base';
import { PdfAnnotationBaseModel, PdfBoundsModel, PdfFormFieldBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { splitArrayCollection, processPathData, cornersPointsBeforeRotation, Rect, PointModel, getPathString } from './../ej2-drawings/index';
import { DiagramHtmlElement } from '../drawing/html-element';
import { ActionModel, ActionsSettingsModel, GoToActionModel, ItemModel, SignatureIndicatorSettingsModel } from '../pdfviewer-model';
import { Tooltip } from '@syncfusion/ej2-popups';
import { PdfColor, PdfPage } from '@syncfusion/ej2-pdf';
import { applyKeystroke, applyMaskKeystroke, fieldConfig, formatValue, isSpecialPreset, shouldBlockKey, shouldRunFormat,
    specialMaxDigits, validateMaskOnCommit, validateSpecialValue, AfFormatConfig, AfKeystrokeResult, AfMaskCommit, AfSpecialCommit }
    from '../base/af-format';
import { getArialFontData } from '../pdf-base/fontData';
import { ensureCollaborationId } from '../collaboration/collaborative-editing-handler';
import { mountBarcodeGenerator, renderBarcodeField } from '../pdf-base/barcode-generator';

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
    private maintainTabIndex: Record<string, number>  = {};
    private maintanMinTabindex: Record<string, number> = {};
    private isSignatureField: boolean = false;
    private indicatorPaddingValue : number = 4;
    private isKeyDownCheck: boolean = false;
    /**
     * @private
     */
    public readOnlyCollection: string[] = [];
    /**
     * @private
     */
    public currentTarget: any;
    /**
     * @private
     */
    public isCollaborativeImport: boolean = false;
    private isSignatureRendered: boolean = false;
    /**
     * @private
     */
    public signatureFieldCollection: IFormFieldCollection[] = [];
    private data: string;
    /**
     * @private
     */
    public formFieldsData: PdfRenderedFields[] | string[] | string;
    private selectedIndex: number[] = [];
    /**
     * @private
     */
    public renderedPageList: number[] = [];
    /**
     * @private
     */
    public arialFontData: string = '';
    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} base - It describes about the base
     * @private
     * @returns {void}
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
        this.arialFontData = getArialFontData();
    }
    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isImportFormField - It describes about the isImportFormField
     * @private
     * @returns {void}
     */
    public renderFormFields(pageIndex: number, isImportFormField: boolean): void {
        if (this.pdfViewer.isFormFieldDocument || !isNullOrUndefined(this.pdfViewer.formFieldsModule.formFieldsData) &&
        this.pdfViewer.formFieldsModule.formFieldsData.length > 0) {
            initializeTelemetryFeature('Form Field Add/Edit', 'PDFViewer');
        }
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
            if (this.formFieldsData[0] === '[') {
                this.formFieldsData = JSON.parse(this.formFieldsData as string);
            }
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            let count : number;
            if (this.formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                let flag: boolean = false;
                for (let i: number = 0; i < this.formFieldsData.length; i++) {
                    const formField: PdfRenderedFields = this.formFieldsData[parseInt(i.toString(), 10)] as PdfRenderedFields;
                    if (!flag && isNullOrUndefined(formField.ActualFieldName) && formField.PageIndex === pageIndex) {
                        count = parseInt(formField.FieldName.slice(formField.FieldName.lastIndexOf('_') + 1), 10);
                        flag = true;
                    }
                }
                if (this.renderedPageList.indexOf(pageIndex) === -1){
                    this.renderedPageList.push(pageIndex);
                }
                for (let i: number = 0; i < this.formFieldsData.length; i++) {
                    const currentData: PdfRenderedFields = this.formFieldsData[parseInt(i.toString(), 10)] as PdfRenderedFields;
                    if (currentData.FieldName !== '') {
                        if (currentData.IsInitialField) {
                            currentData.Name = 'InitialField';
                        }
                        const font: FormFieldFont = currentData['Font'];
                        if (this.pdfViewer.formDesigner) {
                            if (currentData['PageIndex'] === pageIndex) {
                                const fontFamily: string = font && font.Name;
                                let fontStyle: string;
                                let fontSize: number;
                                if (!isNullOrUndefined(font) && font.Height) {
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
                                const backgroundColor: FormFieldColor = currentData['BackColor'];
                                const bounds: IFormFieldBound = currentData['LineBounds'];
                                let backColor: string = 'rgba(' + backgroundColor.R + ',' + backgroundColor.G + ',' + backgroundColor.B + ',' + 1 + ')';
                                if (currentData.IsTransparent === true) {
                                    backColor = 'rgba(0,0,0,0)';
                                }
                                backColor = this.rgbaToHex(backColor);
                                // set default color if field have black color as bg.
                                if (backColor === '#000000ff') {
                                    backColor = '#daeaf7ff';
                                }
                                const fontColor: FormFieldColor = currentData['FontColor'];
                                const left: number = this.ConvertPointToPixel(bounds.X);
                                const top: number = this.ConvertPointToPixel(bounds.Y);
                                const width: number = this.ConvertPointToPixel(bounds.Width);
                                const height: number = this.ConvertPointToPixel(bounds.Height);
                                let boundArray: PdfBoundsModel = {left: left, top: top, width: width, height: height};
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
                                const borderColor: FormFieldColor | PdfColor = currentData['BorderColor'] as FormFieldColor;
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
                                const indicatorSettings: SignatureIndicatorSettingsModel = (currentData['Name'] === 'SignatureField') ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings : this.pdfViewer.initialFieldSettings.initialIndicatorSettings;
                                const fieldProperties: PdfFormFieldBaseModel = {
                                    bounds: { X: boundArray.left, Y: boundArray.top, Width: boundArray.width,
                                        Height: boundArray.height } as PdfBoundsModel, pageNumber: currentData['PageIndex'] + 1,
                                    name: currentData['ActualFieldName'] ? currentData['ActualFieldName'] : currentData['FieldName'],
                                    tooltip: currentData['ToolTip'], value: elementValue, insertSpaces: currentData['InsertSpaces'],
                                    isChecked: currentData['Selected'], isSelected: currentData['Selected'], fontFamily: fontFamily,
                                    fontStyle: fontStyle, backgroundColor: backColor, color: foreColor, borderColor: borderRGB,
                                    thickness: borderWidth, fontSize: fontSize, isMultiline: currentData.Multiline,
                                    rotateAngle: rotateFieldAngle,
                                    // R2-FIX-04: propagate date markers so designer-mode rebuild
                                    // routes through the composite branch (text + trailing picker button).
                                    isDateField: currentData.IsDateField === true,
                                    isRequired: currentData['IsRequired'], alignment: textAlignment as TextAlignment,
                                    options: this.getListValues(currentData), selectedIndex: this.selectedIndex,
                                    maxLength: currentData.MaxLength, visibility: currentData.Visible  === 1 ? 'hidden' : 'visible',
                                    font: { isItalic: !isNullOrUndefined(font) ? font.Italic : false, isBold: !isNullOrUndefined(font) ?
                                        font.Bold : false, isStrikeout: !isNullOrUndefined(font) ? font.Strikeout : false,
                                    isUnderline: !isNullOrUndefined(font) ? font.Underline : false },
                                    isTransparent: currentData.IsTransparent,
                                    customData: !isNullOrUndefined(currentData['CustomData']) ? typeof currentData['CustomData'] === 'object'
                                        ? currentData['CustomData'] : (currentData['CustomData'] as string).trim() !== ''
                                            ? JSON.parse(currentData['CustomData']) : '' : '',
                                    signatureIndicatorSettings: indicatorSettings,
                                    isUnisonSelected: currentData['IsUnisonSelected'],
                                    actions: !isNullOrUndefined(currentData['Actions']) ? currentData['Actions'] : undefined
                                };
                                (fieldProperties as unknown as FormFieldModel).isReadOnly = currentData['IsReadonly'];
                                if (!(currentData as PdfRenderedFields & { id?: string }).id && this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)] && !isNullOrUndefined(currentData['ActualFieldName'])) {
                                    fieldProperties.id = this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)].id;
                                }
                                if (currentData.Name === 'DropDown' || currentData.Name === 'ListBox') {
                                    fieldProperties.value = currentData['SelectedValue'];
                                }
                                if (currentData.Name === 'Barcode') {
                                    (fieldProperties as BarcodeFieldSettings).symbology =
                                        !isNullOrUndefined(currentData['Symbology']) ? currentData['Symbology'] as BarcodeSymbology : BarcodeSymbology.PDF417;
                                    (fieldProperties as BarcodeFieldSettings).xDimension =
                                        !isNullOrUndefined(currentData['XDimension']) ? currentData['XDimension'] as number : 4;
                                    (fieldProperties as BarcodeFieldSettings).errorCorrectionLevel =
                                        !isNullOrUndefined(currentData['ErrorCorrectionLevel']) ? currentData['ErrorCorrectionLevel'] as Pdf417ErrorCorrectionLevel | QRErrorCorrectionLevel : Pdf417ErrorCorrectionLevel.Level5;
                                    (fieldProperties as BarcodeFieldSettings).valueFormat =
                                        !isNullOrUndefined(currentData['ValueFormat']) ? currentData['ValueFormat'] as BarcodeValueFormat : BarcodeValueFormat.TabDelimited;
                                    (fieldProperties as BarcodeFieldSettings).fields =
                                        !isNullOrUndefined(currentData['Fields']) ? currentData['Fields'] as string[] : [];
                                    (fieldProperties as BarcodeFieldSettings).includeFieldNames =
                                        !isNullOrUndefined(currentData['IncludeFieldNames']) ? currentData['IncludeFieldNames'] as boolean : true;
                                    (fieldProperties as BarcodeFieldSettings).compressData =
                                        !isNullOrUndefined(currentData['CompressData']) ? currentData['CompressData'] as boolean : false;
                                    (fieldProperties as BarcodeFieldSettings).customValue =
                                        !isNullOrUndefined(currentData['CustomValue']) ? currentData['CustomValue'] as string : '';
                                    (fieldProperties as BarcodeFieldSettings).caption =
                                        !isNullOrUndefined(currentData['Caption']) ? currentData['Caption'] as string : '';
                                }
                                const fieldType: string = this.getFormFieldType(currentData);
                                if (currentData.Name !== 'SignatureText' && currentData.Name !== 'SignatureImage') {
                                    if (!isNullOrUndefined(this.getFormFieldType(currentData))) {
                                        if (currentData.IsRequired){
                                            let thickness: number = fieldProperties.thickness;
                                            thickness = thickness > 0 ? thickness : 1;
                                            fieldProperties.thickness = thickness;
                                        }
                                        const addedElement1: HTMLElement = this.pdfViewer.formDesignerModule.
                                            addField(fieldType as FormFieldType, fieldProperties as TextFieldSettings |
                                            PasswordFieldSettings |
                                            CheckBoxFieldSettings |
                                            DropdownFieldSettings |
                                            RadioButtonFieldSettings |
                                            ListBoxFieldSettings |
                                            SignatureFieldSettings |
                                            InitialFieldSettings, false, fieldProperties.id);
                                        if (addedElement1 && addedElement1.parentElement) {
                                            (currentData as PdfRenderedFields & { id?: string }).id = addedElement1.parentElement.id.split('_')[0];
                                        }
                                        if (addedElement1 && addedElement1.style.visibility === 'hidden')
                                        {
                                            (addedElement1.childNodes[0] as HTMLInputElement).disabled = true;
                                        }
                                    }
                                }
                                if (fieldType === 'SignatureField' || fieldType === 'InitialField') {
                                    this.addSignaturePath(currentData, count);
                                    if (!isNullOrUndefined(currentData.Value) && currentData.Value !== '') {
                                        this.renderExistingAnnnot(currentData, currentData['PageIndex'] + 1, null, isFieldRotated);
                                        this.isSignatureRendered = true;
                                        count++;
                                    }
                                }
                                if (currentData.ActualFieldName == null && !isNullOrUndefined(currentData.FieldName) && (this.formFieldsData as PdfRenderedFields[]).filter((item: PdfRenderedFields) => !isNullOrUndefined(item.FieldName) && item.FieldName.includes(currentData.FieldName.replace(/_\d$/, ''))).filter((value: PdfRenderedFields) => value.Name !== 'ink').length === 0) {
                                    this.renderExistingAnnnot(currentData, currentData['PageIndex'] + 1, null, isFieldRotated);
                                    this.pdfViewerBase.signatureModule.storeSignatureData(pageIndex, currentData);
                                    this.isSignatureRendered = true;
                                    count++;
                                }
                                this.pdfViewerBase.isLoadedFormFieldAdded = true;
                            }
                        } else {
                            if (currentData['PageIndex'] === pageIndex) {
                                const field: {currentField: HTMLElement | HTMLInputElement | HTMLSelectElement; count: number; } = this.
                                    createFormFields(currentData, pageIndex, i, null, count);
                                const inputField : HTMLElement | HTMLInputElement | HTMLSelectElement = field.currentField;
                                const signCount : number = field.count;
                                let isFieldRotated : boolean = false;
                                if (currentData.ActualFieldName === null && !isNullOrUndefined(currentData.FieldName) && (this.formFieldsData as PdfRenderedFields[]).filter((item: PdfRenderedFields) => !isNullOrUndefined(item.FieldName) && item.FieldName.includes(currentData.FieldName.replace(/_\d$/, ''))).filter((value: PdfRenderedFields) => value.Name !== 'ink').length === 0) {
                                    this.renderExistingAnnnot(currentData, currentData['PageIndex'] + 1, null, isFieldRotated);
                                    this.pdfViewerBase.signatureModule.storeSignatureData( pageIndex, currentData);
                                    this.isSignatureRendered = true;
                                    count++;
                                }
                                if (inputField) {
                                    const divElement: HTMLDivElement = this.createParentElement(currentData, pageIndex);
                                    const bounds: IFormFieldBound = currentData['LineBounds'];
                                    const font: FormFieldFont = currentData['Font'];
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
                                    const isDateTimeComposite: boolean =
                                        !!(inputField as HTMLElement & { _pvDateTimeComposite?: boolean })._pvDateTimeComposite
                                        || (inputField.classList && inputField.classList.contains('e-pv-datetime-composite'));
                                    const dateTimeTextInput: HTMLInputElement | null = isDateTimeComposite
                                        ? (inputField.querySelector('.e-pv-formfield-input') as HTMLInputElement)
                                        : null;
                                    const valueTarget: HTMLInputElement = (dateTimeTextInput || inputField) as HTMLInputElement;
                                    (valueTarget as HTMLInputElement & { InsertSpaces?: boolean }).InsertSpaces = currentData.InsertSpaces;
                                    if ((valueTarget as HTMLInputElement & { InsertSpaces?: boolean }).InsertSpaces) {
                                        const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                                        const spacing: number = ((parseInt(inputField.style.width, 10) / (valueTarget as
                                                                                                        HTMLInputElement).maxLength)
                                         - (parseFloat(valueTarget.style.fontSize || inputField.style.fontSize) / 2)) - (0.6 * zoomFactor);
                                        valueTarget.style.letterSpacing = '' + spacing + 'px';
                                        valueTarget.style.fontFamily = 'monospace';
                                        valueTarget.style.paddingLeft = (spacing / 2) + 'px';
                                    }
                                    // I6/I7: Button widgets with shared FieldName get a FieldUniqueKey-based id.
                                    currentData['uniqueID'] = (currentData.Name === 'Button' && currentData.FieldUniqueKey) ?
                                        (this.pdfViewer.element.id + '_' +
                                            String(currentData.FieldUniqueKey).replace(/[^0-9a-zA-Z#_-]+/g, '') +
                                            '_input_' + pageIndex + '_' + i) :
                                        (this.pdfViewer.element.id + 'input_' + pageIndex + '_' + i);
                                    for (let j: number = 0; j < this.pdfViewer.formFieldCollections.length; j++) {
                                        if (((valueTarget as HTMLInputElement).type === 'text' || (valueTarget as HTMLInputElement).type === 'password' || (valueTarget as HTMLInputElement).type === 'textarea') && currentData.Name !== 'SignatureField') {
                                            if (currentData['uniqueID'] === this.pdfViewer.formFieldCollections[parseInt(j.toString(), 10)].id) {
                                                this.pdfViewer.formFieldCollections[parseInt(j.toString(), 10)].value = currentData['Text'];
                                            }
                                        }
                                    }
                                    if (isNullOrUndefined(currentData.Value)) {
                                        currentData.Value = currentData['Text'];
                                    }
                                    if (currentData.ToolTip) {
                                        this.setToolTip(currentData.ToolTip, dateTimeTextInput || inputField);
                                    }
                                    this.applyCommonProperties(inputField as HTMLInputElement, pageIndex, i, currentData, isFieldRotated);
                                    // Field id stays on text input for value/session maps; wrapper keeps layout id mirror.
                                    if (dateTimeTextInput) {
                                        const fieldId: string = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + i;
                                        inputField.id = fieldId + '_datetime';
                                        dateTimeTextInput.id = fieldId;
                                        dateTimeTextInput.setAttribute('aria-label', this.pdfViewer.element.id + 'input_' + pageIndex);
                                    }
                                    this.checkIsReadonly(currentData, inputField as HTMLInputElement);
                                    this.applyTabIndex(currentData, dateTimeTextInput || inputField, pageIndex);
                                    this.checkIsRequiredField(currentData, inputField as HTMLInputElement);
                                    this.applyDefaultColor(inputField as HTMLInputElement);
                                    this.pdfViewerBase.signatureModule.updateFormFieldsCollection(currentData);
                                    if (divElement) {
                                        divElement.appendChild(inputField);
                                        textLayer.appendChild(divElement);
                                    } else {
                                        inputField.style.position = 'absolute';
                                        textLayer.appendChild(inputField);
                                    }
                                    if (!isDateTimeComposite) {
                                        inputField.addEventListener('focus', this.focusFormFields.bind(this));
                                        inputField.addEventListener('blur', this.blurFormFields.bind(this));
                                        inputField.addEventListener('click', this.updateFormFields.bind(this));
                                        inputField.addEventListener('change', this.changeFormFields.bind(this));
                                        inputField.addEventListener('keydown', this.updateFormFieldsValue.bind(this));
                                        inputField.addEventListener('keyup', this.updateSameFieldsValue.bind(this));
                                        inputField.addEventListener('keydown', this.onAfKeyDown.bind(this));
                                        inputField.addEventListener('input', this.onAfInput.bind(this));
                                        this.paintAfDisplay(inputField as HTMLInputElement, currentData);
                                    }
                                    if ((inputField as HTMLInputElement).className === 'e-pv-buttonItem' ||
                                        (inputField as HTMLInputElement).type === 'button' ||
                                        (inputField as HTMLInputElement).type === 'image') {
                                        inputField.addEventListener('mouseenter', (ev: MouseEvent) => {
                                            this.triggerButtonSlotFromDom(ev.target as HTMLElement, 'mouseEnter');
                                        });
                                        inputField.addEventListener('mouseleave', (ev: MouseEvent) => {
                                            this.triggerButtonSlotFromDom(ev.target as HTMLElement, 'mouseLeave');
                                        });
                                        inputField.addEventListener('mousedown', (ev: MouseEvent) => {
                                            this.triggerButtonSlotFromDom(ev.target as HTMLElement, 'mouseDown');
                                        });
                                    }
                                    count = signCount;
                                }
                            }
                        }
                    }
                }
                if (!this.pdfViewer.formDesigner) {
                    this.pdfViewerBase.sessionStorageManager.removeItem(this.pdfViewerBase.documentId + '_formfields');
                    this.pdfViewerBase.setItemInSessionStorage(this.formFieldsData, '_formfields');
                }
            }
        }
        if (this.pdfViewerBase.isFocusField && this.pdfViewerBase.focusField) {
            const currentField: HTMLElement = document.getElementById(this.pdfViewerBase.focusField.id);
            if (currentField) {
                if ((this.pdfViewerBase.focusField.type === 'SignatureField' || this.pdfViewerBase.focusField.type === 'InitialField')  && this.pdfViewer.formDesignerModule) {
                    const y: number = (this.pdfViewerBase.focusField.bounds as PdfBoundsModel).y;
                    const height: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height;
                    const focusedIndex: number = this.pdfViewerBase.focusField.pageIndex;
                    this.pdfViewerBase.isFocusField = false;
                    this.pdfViewerBase.focusField = null;
                    this.pdfViewer.bookmark.goToBookmark(focusedIndex, height - y);
                } else {
                    currentField.focus();
                }
                this.pdfViewerBase.isFocusField = false;
                this.pdfViewerBase.focusField = null;
            }
        }
    }

    private setToolTip(tooltipContent: string, targetElement: HTMLElement): void {
        //initialize tooltip component
        const tooltip: Tooltip = new Tooltip({
            content:  initializeCSPTemplate(
                function (): string { return tooltipContent; }
            )
        });
        const target: Element = (targetElement && targetElement.closest && targetElement.closest('.foreign-object')) || targetElement;
        // render initialized tooltip
        tooltip.appendTo(target as HTMLElement);
    }

    private trim(str: string): string {
        return str.replace(/^\s+|\s+$/gm, '');
    }

    private rgbaToHex(rgba: string): string {
        const inParts: string[] = rgba.substring(rgba.indexOf('(')).split(',');
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

    private padHex(value: string): string {
        return value.length === 1 ? '0' + value : value;
    }

    private rgbaObjectToHex(color: { r: number; g: number; b: number; a: number }): string {
        const r: string = this.padHex(color.r.toString(16));
        const g: string = this.padHex(color.g.toString(16));
        const b: string = this.padHex(color.b.toString(16));
        const a: string = this.padHex(Math.round((color.a / 100) * 255).toString(16));

        return '#' + r + g + b + a;
    }

    private getListValues(currentData: PdfRenderedFields): ItemModel[] {
        let listItem: TextItem[] = currentData['TextList'];
        const options: ItemModel[] = [];
        if (this.getFormFieldType(currentData) === 'DropDown'){
            listItem = currentData['ComboBoxList'] as unknown as TextItem[];
            if (!isNullOrUndefined(listItem)) {
                for (let i: number = 0; i < listItem.length; i++) {
                    // Normalize inner values so itemName/itemValue are never undefined or null.
                    const itemValue: string = !isNullOrUndefined(listItem[parseInt(i.toString(), 10)].itemValue) ?
                        listItem[parseInt(i.toString(), 10)].itemValue :
                        !isNullOrUndefined((listItem[parseInt(i.toString(), 10)] as unknown as { ItemValue: string }).ItemValue) ?
                            (listItem[parseInt(i.toString(), 10)] as unknown as { ItemValue: string }).ItemValue : '';
                    const itemName: string = !isNullOrUndefined(listItem[parseInt(i.toString(), 10)].itemName) ?
                        listItem[parseInt(i.toString(), 10)].itemName :
                        !isNullOrUndefined((listItem[parseInt(i.toString(), 10)] as unknown as { ItemName: string }).ItemName) ?
                            (listItem[parseInt(i.toString(), 10)] as unknown as { ItemName: string }).ItemName : '';
                    if (itemName === currentData['SelectedValue']) {
                        this.selectedIndex.push(i);
                    }
                    options.push({ itemName: itemName, itemValue: itemValue });
                }
            }
        }
        else {
            for (let i: number = 0; i < listItem.length; i++) {
                if (listItem[parseInt(i.toString(), 10)].itemName === currentData['SelectedValue'])
                {this.selectedIndex.push(i); }
                const itemValue: string = listItem[parseInt(i.toString(), 10)].itemValue ?
                    listItem[parseInt(i.toString(), 10)].itemValue : (listItem[parseInt(i.toString(), 10)] as unknown as
                                                                      { ItemValue: string }).ItemValue;
                const itemName: string = listItem[parseInt(i.toString(), 10)].itemName ? listItem[parseInt(i.toString(), 10)].itemName
                    : (listItem[parseInt(i.toString(), 10)] as unknown as { ItemName: string }).ItemName;
                options.push({ itemName: itemName, itemValue: itemValue });
            }
        }
        if (this.getFormFieldType(currentData) === 'ListBox') {
            this.selectedIndex = currentData['SelectedList'];
        }
        return options;
    }

    private createParentElement(data: PdfRenderedFields, pageIndex: number): HTMLDivElement {
        let divElement: HTMLDivElement;
        if (data['Name'] === 'Textbox' || data['Name'] === 'Password') {
            divElement = document.createElement('div');
            if (data.IsTransparent === true) {
                divElement.style.background = 'transparent';
            }
            else {
                divElement.style.background = data['BackColor'] as unknown as string;
            }
            if (data.InsertSpaces) {
                divElement.style.background = 'transparent';
            }
            const bounds: IFormFieldBound = data['LineBounds'];
            const font: FormFieldFont = data['Font'];
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
     * @param {Object} data - Contains page rotation and page size details.
     * @param {number[]} data.pageRotation - Collection of page rotation values.
     * @param {ISize[]} data.pageSizes - Collection of page size information.
     * @private
     * @returns {number} - number
     */
    public getAngle(pageIndex: number, data?: { pageRotation: number[]; pageSizes: ISize[] }): number {
        let angle: number = 0;
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        let pageRotation: number;
        if (!pageDetails && data && data.pageSizes && data.pageSizes[parseInt(pageIndex.toString(), 10)]) {
            pageRotation = data.pageRotation[parseInt(pageIndex.toString(), 10)];
        } else if (pageDetails && pageDetails.rotation) {
            pageRotation = pageDetails.rotation;
        }
        if ((pageDetails || data.pageSizes[parseInt(pageIndex.toString(), 10)]) && pageRotation) {
            switch (pageRotation) {
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
        let signatureFields: IFormFieldCollection[] = this.signatureFieldCollection;
        const collectionData: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        if (signatureFields.length === 0) {
            signatureFields = this.pdfViewerBase.signatureModule.getSignField();
        }
        let currentField: FormFieldModel;
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
                    currentField = this.pdfViewer.formDesignerModule ? (signatureFields[parseInt(i.toString(), 10)].FormField as
                                                                        FormFieldModel) :
                        signatureFields[parseInt(i.toString(), 10)] as FormFieldModel;
                    if (this.currentTarget.id === (currentField as unknown as PdfRenderedFields).uniqueID) {
                        this.currentTarget = document.getElementById((currentField as unknown as PdfRenderedFields).uniqueID);
                        this.getSignatureIndex(i, signatureFields.length, isNextSignField);
                        break;
                    }
                }
            }
        } else {
            if (nextSign) {
                if (this.pdfViewer.formDesignerModule) {
                    currentField = signatureFields[0] as FormFieldModel;
                    if (currentField.id) {
                        this.currentTarget = document.getElementById(currentField.id);
                        this.getSignatureIndex(0, signatureFields.length, isNextSignField, true);
                    }
                }
                else {
                    currentField = signatureFields[0]  as FormFieldModel;
                    if ((currentField as unknown as PdfRenderedFields).uniqueID) {
                        this.currentTarget = document.getElementById((currentField as unknown as PdfRenderedFields).uniqueID);
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
        const signatureFields: IFormFieldCollection[] = this.signatureFieldCollection;
        const collectionData: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        let currentField: FormFieldModel;
        if (curSignIndex < collectionData.length) {
            for (let i: number = 0; i < collectionData.length; i++) {
                if (this.pdfViewer.formDesignerModule) {
                    const curSignIndexId: string = collectionData[parseInt(curSignIndex.toString(), 10)].id;
                    const signatureFieldData: FormFieldModel = collectionData[parseInt(i.toString(), 10)];
                    if (curSignIndexId === signatureFieldData.id) {
                        const pageIndex: number = signatureFieldData.pageIndex >= 0 ? signatureFieldData.pageIndex :
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
                        (signatureFields[parseInt(curSignIndex.toString(), 10)].FormField as { uniqueID: string }).uniqueID :
                        (signatureFields[parseInt(curSignIndex.toString(), 10)] as unknown as { uniqueID: string }).uniqueID;
                    const signatureFieldData: IFormFieldCollection | FormFieldModel | PdfFormFieldBaseModel | IFormField = this.pdfViewer.
                        formDesignerModule ? signatureFields[parseInt(i.toString(), 10)].FormField :
                        signatureFields[parseInt(i.toString(), 10)];
                    if (curSignIndexId === (signatureFieldData as unknown as PdfRenderedFields).uniqueID) {
                        const pageIndex: number = (signatureFieldData as unknown as PdfRenderedFields).PageIndex >= 0 ? (
                            signatureFieldData as unknown as PdfRenderedFields).PageIndex :
                            (signatureFieldData as FormFieldModel).pageNumber;
                        const isRender: boolean = this.pdfViewer.annotationModule.findRenderPageList(pageIndex);
                        if (!isRender) {
                            this.pdfViewer.navigation.goToPage(pageIndex + 1);
                            this.renderFormFields(pageIndex, false);
                        }
                        this.currentTarget = document.getElementById((signatureFieldData as unknown as PdfRenderedFields).uniqueID);
                        currentField = signatureFieldData as FormFieldModel;
                        break;
                    }
                }
            }
            if (this.currentTarget === null) {
                const pageIndex: number = (currentField as unknown as PdfRenderedFields).PageIndex >= 0 ? (
                    currentField as unknown as PdfRenderedFields).PageIndex : currentField.pageNumber;
                this.pdfViewer.navigation.goToPage(pageIndex);
                this.currentTarget = document.getElementById((currentField as unknown as PdfRenderedFields).uniqueID);
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
     *
     * @param {Object} pageData - Contains page rotation and page size details.
     * @param {number[]} pageData.pageRotation - Collection of page rotation values.
     * @param {ISize[]} pageData.pageSizes - Collection of page size information.
     * @private
     * @returns {void}
     */
    public formFieldCollections(pageData: { pageRotation: number[]; pageSizes: ISize[] }): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            const formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                const currentData: PdfRenderedFields = formFieldsData[parseInt(i.toString(), 10)];
                const type: FormFieldType = currentData['Name'] as FormFieldType;
                if (this.pdfViewer.formDesignerModule) {
                    if (currentData.Name !== 'ink' && currentData.Name !== 'SignatureImage' && currentData.Name !== 'SignatureText') {
                        this.retreiveFormFieldsData(currentData, true, pageData);
                    }
                    else {
                        const index: number = this.pdfViewer.formFieldCollections.findIndex(
                            (field: FormFieldModel) => (field.type === 'SignatureField' || field.type === 'InitialField') &&
                            currentData.FieldName && currentData.FieldName.includes(field.name) &&
                            currentData.FieldName.includes(field.name + '_'));
                        if (index >= 0) {
                            let value: string = currentData.Value;
                            if (currentData.Name === 'ink') {
                                const collectionData: object[] = processPathData(value);
                                const csData: object[] = splitArrayCollection(collectionData);
                                value = JSON.stringify(csData);
                            }
                            this.pdfViewer.formFieldCollections[parseInt(index.toString(), 10)].value = value;
                        }
                    }
                } else {
                    if (currentData.Name !== 'ink') {
                        let bounds: IFormFieldBound;
                        if (currentData.LineBounds) {
                            if (isNullOrUndefined(currentData.Bounds)) {
                                bounds = this.updateBoundsValue(currentData.LineBounds) as IFormFieldBound;
                            }
                            else {
                                bounds = currentData.Bounds;
                            }
                        }
                        // Public collection type: map internal PDF Name 'Button' → 'ButtonField' (I4).
                        const publicType: FormFieldType = currentData.IsInitialField ? 'InitialField' :
                            ((type as string) === 'Button' ? 'ButtonField' : type);
                        // I6/I7: prefer FieldUniqueKey so same-name button widgets stay distinct.
                        const collectionId: string = ((type as string) === 'Button' && currentData.FieldUniqueKey) ?
                            (this.pdfViewer.element.id + '_' +
                                String(currentData.FieldUniqueKey).replace(/[^0-9a-zA-Z#_-]+/g, '') +
                                '_input_' + currentData['PageIndex'] + '_' + i) :
                            (this.pdfViewer.element.id + 'input_' + currentData['PageIndex'] + '_' + i);
                        const formFieldCollection: FormFieldModel = {
                            name: this.pdfViewerBase.signatureModule.retriveFieldName(currentData),
                            id: collectionId,
                            isReadOnly: false, type: publicType,
                            value: this.retriveCurrentValue(currentData) as string, fontName: '', isRequired: currentData.IsRequired, bounds: bounds, pageIndex
                            : currentData.PageIndex,
                            symbology: currentData.Symbology as BarcodeSymbology, xDimension: currentData.XDimension,
                            errorCorrectionLevel: currentData.ErrorCorrectionLevel as Pdf417ErrorCorrectionLevel | QRErrorCorrectionLevel,
                            valueFormat: currentData.ValueFormat as BarcodeValueFormat,
                            fields: currentData.Fields ? currentData.Fields : [],
                            includeFieldNames: currentData.IncludeFieldNames, compressData: currentData.CompressData,
                            customValue: currentData.CustomValue, caption: currentData.Caption
                        };
                        this.pdfViewer.formFieldCollections.push(formFieldCollection);
                    }
                }
            }
        }
    }

    private retreiveFormFieldsData(currentData: PdfRenderedFields, isCollection: boolean,
                                   data: { pageRotation: number[]; pageSizes: ISize[] }): HTMLElement {
        let fontFamily: string;
        let fontStyle: string;
        let fontSize: number;
        if (currentData.FieldName !== '') {
            if (currentData.IsInitialField) {
                currentData.Name = 'InitialField';
            }
            const font: FormFieldFont = currentData['Font'];
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
            const backgroundColor: FormFieldColor = currentData['BackColor'];
            const bounds: IFormFieldBound = currentData['LineBounds'];
            let backColor: string = 'rgba(' + backgroundColor.R + ',' + backgroundColor.G + ',' + backgroundColor.B + ',' + 1 + ')';
            backColor = this.rgbaToHex(backColor);
            // set default color if field have black color as bg.
            if (currentData.IsTransparent === true) {
                backColor = 'rgba(0,0,0,0)';
            }
            else if (backColor === '#000000ff') {
                backColor = '#daeaf7ff';
            }
            const fontColor: FormFieldColor = currentData['FontColor'];
            const left: number = this.ConvertPointToPixel(bounds.X);
            const top: number = this.ConvertPointToPixel(bounds.Y);
            const width: number = this.ConvertPointToPixel(bounds.Width);
            const height: number = this.ConvertPointToPixel(bounds.Height);
            let foreColor: string = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
            foreColor = this.rgbaToHex(foreColor);
            const borderColor: FormFieldColor = currentData['BorderColor'] as FormFieldColor;
            let borderRGB: string = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
            borderRGB = this.rgbaToHex(borderRGB);
            if (currentData.IsTansparentBorderColor === true) {
                borderRGB = 'rgba(0,0,0,0)';
            }
            const borderWidth: number = currentData['BorderWidth'];
            this.selectedIndex = [];
            let boundArray: PdfBoundsModel = { left: left, top: top, width: width, height: height };
            let isFieldRotated: boolean = false;
            let rotateFieldAngle: number = 0;
            if (currentData['Rotation'] !== 0) {
                if (currentData['RotationAngle'] === -90 || currentData['RotationAngle'] === -270 || currentData['RotationAngle'] === -180) {
                    boundArray = this.getBounds(boundArray, currentData.PageIndex, 0, isFieldRotated, data);
                }
            } else {
                isFieldRotated = true;
                boundArray = this.getBounds(boundArray, currentData.PageIndex, 0, isFieldRotated, data);
                rotateFieldAngle = this.getAngle(currentData.PageIndex, data);
            }
            const fieldProperties: FormFieldModel = {
                bounds: { X: boundArray.left, Y: boundArray.top, Width: boundArray.width, Height: boundArray.height },
                pageNumber: currentData['PageIndex'] + 1, name: currentData['ActualFieldName'], id: currentData['Id'], tooltip: currentData['ToolTip'],
                value: currentData['Text'], isChecked: currentData['Selected'], isSelected: currentData['Selected'], fontFamily: fontFamily,
                fontStyle: fontStyle as unknown as FontStyle, backgroundColor: backColor, color: foreColor, borderColor: borderRGB,
                thickness: borderWidth,
                fontSize: fontSize, isMultiline: currentData.Multiline,
                isReadOnly: currentData['IsReadonly'], isRequired: currentData['IsRequired'], insertSpaces: currentData['InsertSpaces'],
                alignment: textAlignment as TextAlignment, options: this.getListValues(currentData), selectedIndex: this.selectedIndex,
                maxLength: currentData.MaxLength, visibility: currentData.Visible === 1 ? 'hidden' : 'visible',
                pageIndex : currentData['PageIndex'], isTransparent : currentData['IsTransparent'],
                rotateAngle : currentData['RotationAngle'], signatureType : currentData['SignatureType'] as unknown as SignatureType[] ? currentData['SignatureType'] as unknown as SignatureType[] : '' as unknown as SignatureType[],
                signatureIndicatorSettings : currentData['SignatureIndicatorSettings'], zIndex: currentData['zIndex'],
                customData: !isNullOrUndefined(currentData['CustomData']) ? typeof currentData['CustomData'] === 'object'
                    ? currentData['CustomData'] : (currentData['CustomData'] as unknown as string).trim() !== ''
                        ? JSON.parse(currentData['CustomData']) : '' : '',
                isPrint: currentData['IsPrint'] !== false,
                actions: !isNullOrUndefined(currentData['Actions']) ? currentData['Actions'] : undefined
            };
            (fieldProperties as unknown as PdfFormFieldBaseModel).font = { isItalic: !isNullOrUndefined(font) ? font.Italic : false,
                isBold: !isNullOrUndefined(font) ? font.Bold : false, isStrikeout: !isNullOrUndefined(font) ? font.Strikeout : false,
                isUnderline: !isNullOrUndefined(font) ? font.Underline : false };
            (fieldProperties as unknown as PdfFormFieldBaseModel).isUnisonSelected = currentData['IsUnisonSelected'];
            if (currentData.Name === 'Barcode') {
                (fieldProperties as BarcodeFieldSettings).symbology =
                    !isNullOrUndefined(currentData['Symbology']) ? currentData['Symbology'] as BarcodeSymbology : BarcodeSymbology.PDF417;
                (fieldProperties as BarcodeFieldSettings).xDimension =
                    !isNullOrUndefined(currentData['XDimension']) ? currentData['XDimension'] as number : 4;
                (fieldProperties as BarcodeFieldSettings).errorCorrectionLevel =
                    !isNullOrUndefined(currentData['ErrorCorrectionLevel']) ? currentData['ErrorCorrectionLevel'] as Pdf417ErrorCorrectionLevel | QRErrorCorrectionLevel : Pdf417ErrorCorrectionLevel.Level5;
                (fieldProperties as BarcodeFieldSettings).valueFormat =
                    !isNullOrUndefined(currentData['ValueFormat']) ? currentData['ValueFormat'] as BarcodeValueFormat : BarcodeValueFormat.TabDelimited;
                (fieldProperties as BarcodeFieldSettings).fields =
                    !isNullOrUndefined(currentData['Fields']) ? currentData['Fields'] as string[] : [];
                (fieldProperties as BarcodeFieldSettings).includeFieldNames =
                    !isNullOrUndefined(currentData['IncludeFieldNames']) ? currentData['IncludeFieldNames'] as boolean : true;
                (fieldProperties as BarcodeFieldSettings).compressData =
                    !isNullOrUndefined(currentData['CompressData']) ? currentData['CompressData'] as boolean : false;
                (fieldProperties as BarcodeFieldSettings).customValue =
                    !isNullOrUndefined(currentData['CustomValue']) ? currentData['CustomValue'] as string : '';
                (fieldProperties as BarcodeFieldSettings).caption =
                    !isNullOrUndefined(currentData['Caption']) ? currentData['Caption'] as string : '';
            }
            if (this.pdfViewer.enableCollaborativeEditing) {
                ensureCollaborationId(fieldProperties);
            }
            if (currentData.Name === 'DropDown' || currentData.Name === 'ListBox') {
                fieldProperties.value = currentData['SelectedValue'];
            }
            if (currentData.Name === 'RadioButton') {
                fieldProperties.value = currentData['Value'];
            }
            const fieldType: string = this.getFormFieldType(currentData);
            if (fieldType === 'SignatureField' || fieldType === 'InitialField') {
                this.addSignaturePath(currentData);
                if (this.isSignatureField) {
                    fieldProperties.value = currentData.Value;
                }
            }
            const addedElement: HTMLElement = this.pdfViewer.formDesignerModule.addField(fieldType as FormFieldType, fieldProperties,
                                                                                         isCollection, currentData['Id']);
            return addedElement;
        }
        return null;
    }

    private updateBoundsValue(lineBounds: IFormFieldBound): PdfBoundsModel | IFormFieldBound {
        const bounds: PdfBoundsModel = {
            x: this.ConvertPointToPixel(lineBounds.X), y: this.ConvertPointToPixel(lineBounds.Y),
            width: this.ConvertPointToPixel(lineBounds.Width), height: this.ConvertPointToPixel(lineBounds.Height)
        };
        return bounds;
    }

    /**
     * @param {any} formFields - It describes about the form fields
     * @deprecated - This API is obsolete. Use `updateFieldValues` instead.
     * @returns {void}
     */
    public updateFormFieldValues(formFields: any): void {
        // Only track true readonly fields. Pushing every id permanently forced
        // DateTime composites (and other fields) into the disabled path on re-render.
        if (formFields && formFields.isReadOnly) {
            this.readOnlyCollection.push(formFields.id);
        }
        if (formFields) {
            let currentElement: HTMLInputElement = document.getElementById(formFields.id) as HTMLInputElement;
            // Fill DateTime: canonical id is on the text input; wrapper id ends with _datetime.
            if (currentElement && currentElement.classList &&
                currentElement.classList.contains('e-pv-datetime-text') &&
                currentElement.parentElement &&
                currentElement.parentElement.classList.contains('e-pv-datetime-composite')) {
                (currentElement as HTMLElement) = currentElement.parentElement;
            } else if (!currentElement && typeof formFields.id === 'string') {
                (currentElement as HTMLElement) = document.getElementById(formFields.id + '_datetime') ||
                document.getElementById(formFields.id);
            }
            if (currentElement) {
                const isComposite: boolean = !!(currentElement.classList &&
                    (currentElement.classList.contains('e-pv-datetime-composite') ||
                        (typeof formFields.id === 'string' && formFields.id.indexOf('_datetime') !== -1)));
                const textTarget: HTMLElement = isComposite
                    ? (currentElement.querySelector
                        ? (currentElement.querySelector('.e-pv-formfield-input') || currentElement)
                        : currentElement)
                    : currentElement;
                const pickerBtn: HTMLButtonElement = isComposite && currentElement.querySelector
                    ? currentElement.querySelector('.e-pv-datetime-picker-btn')
                    : null;
                const chromeTarget: HTMLElement = isComposite ? currentElement : textTarget;
                if (formFields.isReadOnly) {
                    (textTarget as HTMLInputElement).disabled = true;
                    (textTarget as HTMLInputElement).readOnly = true;
                    textTarget.style.cursor = 'default';
                    textTarget.style.pointerEvents = 'none';
                    if (isComposite) {
                        chromeTarget.style.backgroundColor = '';
                        chromeTarget.style.cursor = 'default';
                        if (pickerBtn) {
                            pickerBtn.disabled = true;
                            pickerBtn.style.cursor = 'default';
                            pickerBtn.style.pointerEvents = 'none';
                        }
                    } else {
                        chromeTarget.style.backgroundColor = '';
                        chromeTarget.style.cursor = 'default';
                    }
                } else {
                    if (chromeTarget.style.backgroundColor === '') {
                        chromeTarget.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
                    }
                    (textTarget as HTMLInputElement).disabled = false;
                    (textTarget as HTMLInputElement).readOnly = false;
                    textTarget.style.cursor = 'text';
                    textTarget.style.pointerEvents = 'auto';
                    if (isComposite) {
                        chromeTarget.style.cursor = '';
                        chromeTarget.style.pointerEvents = 'auto';
                        if (pickerBtn) {
                            pickerBtn.disabled = false;
                            pickerBtn.style.cursor = 'pointer';
                            pickerBtn.style.pointerEvents = 'auto';
                        }
                        if (textTarget !== chromeTarget) {
                            textTarget.style.backgroundColor = 'transparent';
                        }
                    } else {
                        chromeTarget.style.cursor = '';
                    }
                }
            }
            // Prefer value-bearing text input for session writes when composite.
            const sessionTarget: HTMLElement = (currentElement && currentElement.classList &&
                currentElement.classList.contains('e-pv-datetime-composite') &&
                currentElement.querySelector)
                ? (currentElement.querySelector('.e-pv-formfield-input') || currentElement)
                : currentElement;
            this.pdfViewerBase.signatureModule.updateDataInSession(sessionTarget);
        }
    }

    /**
     * @param {FormFieldModel} formFields - It describes about the form fields
     *
     * @returns {void}
     */
    public updateFieldValues(formFields: FormFieldModel): void {
        // Only track true readonly fields. Pushing every id permanently forced
        // DateTime composites (and other fields) into the disabled path on re-render.
        if (formFields && formFields.isReadOnly) {
            this.readOnlyCollection.push(formFields.id);
        }
        if (formFields) {
            let currentElement: HTMLInputElement = document.getElementById(formFields.id) as HTMLInputElement;
            // Fill DateTime: canonical id is on the text input; wrapper id ends with _datetime.
            if (currentElement && currentElement.classList &&
                currentElement.classList.contains('e-pv-datetime-text') &&
                currentElement.parentElement &&
                currentElement.parentElement.classList.contains('e-pv-datetime-composite')) {
                (currentElement as HTMLElement) = currentElement.parentElement;
            } else if (!currentElement && typeof formFields.id === 'string') {
                (currentElement as HTMLElement) = document.getElementById(formFields.id + '_datetime') ||
                document.getElementById(formFields.id);
            }
            if (currentElement) {
                const isComposite: boolean = !!(currentElement.classList &&
                    (currentElement.classList.contains('e-pv-datetime-composite') ||
                        (typeof formFields.id === 'string' && formFields.id.indexOf('_datetime') !== -1)));
                const textTarget: HTMLElement = isComposite
                    ? (currentElement.querySelector
                        ? (currentElement.querySelector('.e-pv-formfield-input') || currentElement)
                        : currentElement)
                    : currentElement;
                const pickerBtn: HTMLButtonElement = isComposite && currentElement.querySelector
                    ? currentElement.querySelector('.e-pv-datetime-picker-btn')
                    : null;
                const chromeTarget: HTMLElement = isComposite ? currentElement : textTarget;
                if (formFields.isReadOnly) {
                    (textTarget as HTMLInputElement).disabled = true;
                    (textTarget as HTMLInputElement).readOnly = true;
                    textTarget.style.cursor = 'default';
                    textTarget.style.pointerEvents = 'none';
                    if (isComposite) {
                        chromeTarget.style.backgroundColor = '';
                        chromeTarget.style.cursor = 'default';
                        if (pickerBtn) {
                            pickerBtn.disabled = true;
                            pickerBtn.style.cursor = 'default';
                            pickerBtn.style.pointerEvents = 'none';
                        }
                    } else {
                        chromeTarget.style.backgroundColor = '';
                        chromeTarget.style.cursor = 'default';
                    }
                } else {
                    if (chromeTarget.style.backgroundColor === '') {
                        chromeTarget.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
                    }
                    (textTarget as HTMLInputElement).disabled = false;
                    (textTarget as HTMLInputElement).readOnly = false;
                    textTarget.style.cursor = 'text';
                    textTarget.style.pointerEvents = 'auto';
                    if (isComposite) {
                        chromeTarget.style.cursor = '';
                        chromeTarget.style.pointerEvents = 'auto';
                        if (pickerBtn) {
                            pickerBtn.disabled = false;
                            pickerBtn.style.cursor = 'pointer';
                            pickerBtn.style.pointerEvents = 'auto';
                        }
                        if (textTarget !== chromeTarget) {
                            textTarget.style.backgroundColor = 'transparent';
                        }
                    } else {
                        chromeTarget.style.cursor = '';
                    }
                }
            }
            // Prefer value-bearing text input for session writes when composite.
            const sessionTarget: HTMLElement = (currentElement && currentElement.classList &&
                currentElement.classList.contains('e-pv-datetime-composite') &&
                currentElement.querySelector)
                ? (currentElement.querySelector('.e-pv-formfield-input') || currentElement)
                : currentElement;
            this.pdfViewerBase.signatureModule.updateDataInSession(sessionTarget);
        }
    }

    /**
     * @param {PdfRenderedFields} currentData - It describes about the current data
     * @private
     * @returns {string} - string
     */
    public retriveFieldName(currentData: PdfRenderedFields): string {
        let currentField: string;
        switch (currentData['Name']) {
        case 'Textbox':
        case 'Password':
        case 'SignatureField':
        case 'InitialField':
            currentField = currentData.FieldName;
            break;
        case 'RadioButton':
        case 'CheckBox':
        case 'DropDown':
        case 'ListBox':
        case 'Button':
        case 'Barcode':
            currentField = currentData.ActualFieldName;
            break;
        }
        return currentField;
    }
    private retriveCurrentValue(currentData: PdfRenderedFields): string | boolean | number[] {
        let currentField: string | boolean | number[];
        switch (currentData['Name']) {
        case 'Textbox':
        case 'Password':
            currentField = currentData.Text;
            break;
        case 'SignatureField':
        case 'RadioButton':
            currentField = currentData.Value;
            break;
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

    private getSignatureBounds(LineBounds: IFormFieldBound, bounds: PdfBoundsModel, pageIndex: number): PdfBoundsModel {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        let bound: PdfBoundsModel;
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
     * @returns {string} - string
     */
    public downloadFormFieldsData(): string {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            const formFieldsData: any = JSON.parse(data);
            type DataValue = FieldData | string | boolean | number;
            const datas: Record<string, DataValue> = {};
            let fieldDatas: FieldData;
            for (let m: number = 0; m < formFieldsData.length; m++) {
                const currentData: PdfRenderedFields = formFieldsData[parseInt(m.toString(), 10)];
                if (this.pdfViewer.printModule && this.pdfViewer.printModule.canPrint && currentData.IsPrint === false) {
                    formFieldsData.splice(parseInt(m.toString(), 10), 1);
                    m--;
                    continue;
                }
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
                    if (isRequired && !currentData.Selected) {
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
                    const currentCheckBoxIndex: string = currentData.CheckBoxIndex ? currentData.CheckBoxIndex :
                        currentData.CheckBoxIndex ? currentData.CheckBoxIndex : null;
                    if (currentCheckBoxIndex && currentData.Selected) {
                        fieldDatas = {isSelected: currentCheckBoxIndex, isReadOnly: currentData.IsReadonly,
                            fieldValue: !isNullOrUndefined(currentData.Value) ? currentData.Value : ''};
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
                    const childItems: TextItem[] = currentData['TextList'];
                    const childItemsText: string[] = [];
                    for (let m: number = 0; m < currentData.SelectedList.length; m++) {
                        const currentElement: number = currentData.TextList.findIndex(
                            (item: TextItem) => (item.itemName || (item as unknown as { ItemName: string }).ItemName) === currentData.
                                SelectedValue);
                        childItemsText.push(`${childItems[parseInt(currentElement.toString(), 10)]}`);
                    }
                    fieldDatas = { fieldValue: JSON.stringify(childItemsText), isReadOnly: currentData.IsReadonly};
                    datas[currentData.Text] = fieldDatas;
                } else if (currentData.Name === 'SignatureField' || currentData.Name === 'InitialField') {
                    let csData: Object[] | string;
                    if (isRequired && (currentData.Value === null || currentData.Value === '')) {
                        this.addSignaturePath(currentData);
                    }
                    if (currentData.Value && currentData.Value !== '') {
                        csData = currentData.Value;
                        const fontFamily: string = (currentData as PdfRenderedFields & { fontFamily?: string }).fontFamily ? (
                            currentData as PdfRenderedFields & { fontFamily?: string }).fontFamily : currentData.FontFamily;
                        if (fontFamily) {
                            datas[currentData.FieldName + 'fontName'] = fontFamily;
                            datas[currentData.FieldName + 'fontSize'] = (currentData as PdfRenderedFields & { fontSize?: string }).fontSize ? (currentData as PdfRenderedFields & { fontSize?: string }).fontSize : currentData.FontSize;
                        } else if (currentData.Value.split('base64,')[1]) {
                            datas[currentData.FieldName + 'ImageData'] = true;
                        } else {
                            const collectionData: Object[] = processPathData(currentData.Value);
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
                        const bounds: PdfBoundsModel = this.getSignatureBounds(currentData.LineBounds, currentData.Bounds as PdfBoundsModel,
                                                                               currentData.PageIndex);
                        (currentData.Bounds  as PdfBoundsModel).x = bounds.x;
                        (currentData.Bounds  as PdfBoundsModel).y = bounds.y;
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(currentData.Bounds);
                    } else {
                        const lineBounds: IFormFieldBound = currentData.LineBounds;
                        const bounds: PdfBoundsModel = { x: this.ConvertPointToPixel(lineBounds.X),
                            y: this.ConvertPointToPixel(lineBounds.Y),
                            width: this.ConvertPointToPixel(lineBounds.Width), height: this.ConvertPointToPixel(lineBounds.Height) };
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(bounds);
                    }
                    datas[currentData.FieldName + 'isReadOnly'] = currentData.IsReadonly;
                }
            }
            return (JSON.stringify(datas));
        }
        return '';
    }

    private focusFormFields(event: MouseEvent): void {
        const currentTarget: HTMLElement = event.target as HTMLElement;
        if (currentTarget && (currentTarget.className !== 'e-pdfviewer-signatureformfields' && currentTarget.className !== 'e-pdfviewer-signatureformfields e-pv-signature-focus')) {
            // Number / percent / special fields show the formatted value only while not editing.
            // On focus the input goes back to the original unformatted value for easier editing.
            this.restoreAfDisplayOnFocus(currentTarget as HTMLInputElement);
            // DateTime composite: keep text chrome-less; put focus glow on wrapper only.
            const isDateTimeText: boolean = !!(currentTarget.classList &&
                currentTarget.classList.contains('e-pv-datetime-text'));
            const chromeTarget: HTMLElement = (isDateTimeText && currentTarget.parentElement &&
                currentTarget.parentElement.classList.contains('e-pv-datetime-composite'))
                ? currentTarget.parentElement
                : currentTarget;
            if (isDateTimeText) {
                // Ensure editable on focus after picker / re-render side effects.
                (currentTarget as HTMLInputElement).disabled = false;
                (currentTarget as HTMLInputElement).readOnly = false;
                currentTarget.style.pointerEvents = 'auto';
                currentTarget.style.border = 'none';
                currentTarget.style.outline = 'none';
                currentTarget.style.boxShadow = 'none';
                currentTarget.style.backgroundColor = 'transparent';
            } else {
                const backgroundcolor: string = currentTarget.style.backgroundColor;
                const currentIndex: number = backgroundcolor.lastIndexOf(',');
                const currentColor: string = backgroundcolor.slice(0, currentIndex + 1) + 0 + ')';
                currentTarget.style.backgroundColor = currentColor;
            }
            if ((currentTarget as HTMLInputElement).type === 'checkbox') {
                currentTarget.style.webkitAppearance = '';
            }
            const focusBorderColor: string = chromeTarget.style.borderColor || currentTarget.style.borderColor || '';
            chromeTarget.style.boxShadow = '0 0 5px ' + (focusBorderColor === 'transparent' || focusBorderColor === ''
                ? '#000000' : focusBorderColor);
            if (isDateTimeText) {
                const bg: string = chromeTarget.style.backgroundColor;
                if (bg && bg.lastIndexOf(',') !== -1) {
                    const idx: number = bg.lastIndexOf(',');
                    chromeTarget.style.backgroundColor = bg.slice(0, idx + 1) + 0 + ')';
                }
            }
        } else if (currentTarget) {
            if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus') {
                this.pdfViewerBase.signatureModule.setFocus(currentTarget.id);
            }
        }
        this.triggerButtonSlotFromDom(event.target as HTMLElement, 'gotFocus');
    }

    private blurFormFields(event: MouseEvent): void {
        const currentTarget: HTMLInputElement = event.target as HTMLInputElement;
        if ((currentTarget as HTMLInputElement & { InsertSpaces?: boolean }).InsertSpaces && this.isKeyDownCheck) {
            const font: number = parseInt(currentTarget.style.width, 10) - (parseInt(currentTarget.style.height, 10) / 2);
            currentTarget.style.width = '' + font + 'px';
            this.isKeyDownCheck = false;
        }
        // DateTime textbox (IsDateField): validate typed value on blur.
        if (currentTarget && currentTarget.classList && currentTarget.classList.contains('e-pv-datetime-text')) {
            this.validateDateTimeTextOnBlur(currentTarget);
        } else {
            this.applyAfFormatOnBlur(currentTarget as HTMLInputElement);
        }
        if (currentTarget.type === 'checkbox') {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.checked ? 'Yes' : 'No');
        } else if (currentTarget.type === 'radio') {
            const name: string = currentTarget.getAttribute('data-name');
            this.pdfViewer.fireFocusOutFormField(name, currentTarget.value);
        } else {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.value);
        }
        const isDateTimeText: boolean = !!(currentTarget.classList &&
            currentTarget.classList.contains('e-pv-datetime-text'));
        const chromeTarget: HTMLElement = (isDateTimeText && currentTarget.parentElement &&
            currentTarget.parentElement.classList.contains('e-pv-datetime-composite'))
            ? currentTarget.parentElement
            : currentTarget;
        if (isDateTimeText) {
            currentTarget.style.backgroundColor = 'transparent';
            currentTarget.style.boxShadow = 'none';
            currentTarget.style.border = 'none';
            currentTarget.style.outline = 'none';
            const bg: string = chromeTarget.style.backgroundColor;
            if (bg && bg.lastIndexOf(',') !== -1) {
                const idx: number = bg.lastIndexOf(',');
                chromeTarget.style.backgroundColor = bg.slice(0, idx + 1) + 0.2 + ')';
            }
            chromeTarget.style.boxShadow = 'none';
        } else {
            const backgroundcolor: string = currentTarget.style.backgroundColor;
            const currentIndex: number = backgroundcolor.lastIndexOf(',');
            const currentColor: string = backgroundcolor.slice(0, currentIndex + 1) + 0.2 + ')';
            currentTarget.style.backgroundColor = currentColor;
            currentTarget.style.boxShadow = 'none';
        }
        if ((currentTarget.type === 'checkbox') && !currentTarget.checked) {
            currentTarget.style.webkitAppearance = 'none';
        } else {
            currentTarget.style.webkitAppearance = '';
        }
        this.triggerButtonSlotFromDom(currentTarget, 'lostFocus');
    }

    /**
     * Resolves button field from DOM target and runs silent GoTo for non-mouseUp AA slots.
     *
     * @param {HTMLElement} target - DOM event target
     * @param {string} slot - ActionSettings slot name
     * @private
     * @returns {void}
     */
    public triggerButtonSlotFromDom(target: HTMLElement, slot: string): void {
        if (isNullOrUndefined(target)) {
            return;
        }
        const input: HTMLInputElement = target as HTMLInputElement;
        const isButtonClass: boolean = (input.className || '').indexOf('e-pv-buttonItem') !== -1;
        if (!(isButtonClass || input.type === 'button' || input.type === 'image')) {
            return;
        }
        const field: FormFieldModel = this.findButtonFieldByDomId(input.id);
        if (field) {
            this.executeButtonGoToAction(field, slot);
        }
    }

    /**
     * True when candidateId is fieldId or a safe designer/runtime child id (fieldId + '_…').
     * Rejects open-prefix collisions (e.g. field "btn" must not match "btn2").
     *
     * @param {string} fieldId - form field id prefix
     * @param {string} candidateId - DOM id or nameTable key
     * @returns {boolean} whether ids match exactly or with '_' boundary
     */
    private isButtonFieldIdMatch(fieldId: string, candidateId: string): boolean {
        if (isNullOrUndefined(fieldId) || isNullOrUndefined(candidateId) || fieldId === '' || candidateId === '') {
            return false;
        }
        return fieldId === candidateId || candidateId.indexOf(fieldId + '_') === 0;
    }

    /**
     * Resolves a button FormFieldModel from a DOM input id.
     * DOM ids are fully-qualified (e.g. "viewerId_input_0_3") while collection ids are
     * the prefix ("viewerId"). Matches by exact id first, then fieldId + '_' boundary only.
     *
     * @param {string} domId - HTMLInputElement.id at event time
     * @returns {FormFieldModel | undefined} button field or undefined
     */
    private findButtonFieldByDomId(domId: string): FormFieldModel | undefined {
        if (isNullOrUndefined(domId)) {
            return undefined;
        }
        const collections: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        for (let m: number = 0; m < collections.length; m++) {
            const field: FormFieldModel = collections[parseInt(m.toString(), 10)];
            if (!field || !this.isButtonFormField(field)) {
                continue;
            }
            if (this.isButtonFieldIdMatch(field.id, domId)) {
                return field;
            }
        }
        return undefined;
    }

    private isServerMode(): boolean {
        return !!(this.pdfViewer.serviceUrl);
    }

    /**
     * Keystroke filter for number, percent, and special format scripts.
     *
     * @param {Event} event - input event
     * @returns {void}
     * @private
     */
    public onAfKeyDown(event: KeyboardEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        if (!input || !shouldRunFormat(this.findAfField(input), this.isServerMode())) {
            return;
        }
        if (shouldBlockKey(fieldConfig(this.findAfField(input)), event.key)) {
            event.preventDefault();
        }
    }

    /**
     * Keystroke filter for number, percent, and special format scripts.
     *
     * @param {Event} event - input event
     * @returns {void}
     * @private
     */
    public onAfInput(event: Event): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        if (!input || input.dataset.skipKeystroke === '1') {
            return;
        }
        const field: any = this.findAfField(input);
        if (!shouldRunFormat(field, this.isServerMode())) {
            return;
        }
        const config: AfFormatConfig = fieldConfig(field);
        if (isSpecialPreset(config)) {
            // The preset mask is not applied while typing. Only the digits are kept
            // and the value is capped at the digit count the preset accepts.
            const digits: string = (input.value || '').replace(/\D/g, '').slice(0, specialMaxDigits(config));
            input.value = digits;
            input.dataset.afLast = digits;
            return;
        }
        if (config.mask) {
            this.onAfMaskInput(input, field, config);
            return;
        }
        const previous: string = input.dataset.afLast != null ? input.dataset.afLast : '';
        const result: { value: string, accepted: boolean, display?: string } = applyKeystroke(
            config, previous, 0, previous.length, input.value, false);
        if (!result.accepted) {
            input.value = result.display != null ? result.display : previous;
            return;
        }
        input.dataset.afLast = result.value;
        if (result.display != null) {
            input.value = result.display;
        }
        // "Use red text" for negative numbers must follow the value while editing.
        // The colour was set on focus/blur; recompute here so a typed non-negative
        // value clears the red without waiting for focus-out (and vice versa).
        const baseColor: string = (field.FontColor || field.fontColor || field.color || '') as string;
        const formattedColor: { color?: string } = formatValue(config, result.value);
        input.style.color = formattedColor.color || baseColor;
    }

    /**
     * Surfaces the arbitrary-mask validation popup. Mirrors the popup
     * pattern used by validateSpecialPresetOnBlur so the user sees a
     * consistent error for both AFSpecial preset and arbitrary-mask fields.
     *
     * @param {string} mask - the mask string the typed value failed to match
     * @returns {void}
     * @private
     */
    private showMaskValidationError(mask: string): void {
        this.pdfViewer.showNotificationDialog = false;
        this.pdfViewer.showNotificationPopup(
            `The value entered does not match the format of the field "${mask}".`);
        this.pdfViewer.showNotificationDialog = true;
    }

    /**
     * Applies an arbitrary mask to a keystroke of a formatted text box.
     *
     * The candidate is rebuilt from the logical value, the inserted text and the
     * selection range. A character that does not satisfy the placeholder of its
     * slot is rejected and the last accepted display is restored.
     *
     * @param {HTMLInputElement} input - text input
     * @param {any} field - field model
     * @param {AfFormatConfig} config - parsed AF config
     * @returns {void}
     * @private
     */
    private onAfMaskInput(input: HTMLInputElement, field: any, config: AfFormatConfig): void {
        const logical: string = input.dataset.afLast != null ? input.dataset.afLast : '';
        const display: string = input.dataset.afDisplay != null ? input.dataset.afDisplay : input.value;
        const result: AfKeystrokeResult = applyMaskKeystroke(
            config, logical, display, input.value, input.selectionStart, input.selectionEnd, false);
        if (!result.accepted) {
            this.showMaskValidationError(config.mask);
            input.value = result.display != null ? result.display : display;
            return;
        }
        input.dataset.afLast = result.value;
        input.dataset.afDisplay = result.display != null ? result.display : result.value;
        if (result.display != null) {
            input.value = result.display;
        }
        this.writeAfLogical(field, input, result.value);
    }

    /**
     * Restores the original unformatted value of a formatted text box on focus.
     *
     * Number, percent and special fields keep the logical value in `dataset.afLast` while
     * the input shows the formatted display string. The formatted string is the resting
     * state only, so focusing the field swaps the input back to the original value to
     * make editing easier. The value is display only - the field model and the logical
     * value are left untouched.
     *
     * @param {HTMLInputElement} input - text input
     * @returns {void}
     * @private
     */
    private restoreAfDisplayOnFocus(input: HTMLInputElement): void {
        if (!input || input.dataset.afLast == null) {
            return;
        }
        const field: any = this.findAfField(input);
        if (!shouldRunFormat(field, this.isServerMode())) {
            return;
        }
        const config: AfFormatConfig = fieldConfig(field);
        // The prior logical value is the value stored on the field before the
        // current edit session. A blur that fails validation restores to this
        // value so a half-typed edit never corrupts the stored value.
        input.dataset.afPrior = input.dataset.afLast;
        // An arbitrary mask has no unformatted view. The literals belong to the
        // field, so the masked display is restored instead of the logical value.
        input.value = config.mask
            ? (input.dataset.afDisplay != null ? input.dataset.afDisplay : input.dataset.afLast)
            : input.dataset.afLast;
        const baseColor: string = (field.FontColor || field.fontColor || field.color || '') as string;
        // The formatted display is replaced by the raw logical value on focus, but the color
        // belongs to the format and not to the display string. A "Use red text" format keeps
        // its red color while the field shows the logical value.
        const formatted: { color?: string } = formatValue(config, input.dataset.afLast);
        input.style.color = formatted.color || baseColor;
    }

    /**
     * Formats a text box on blur and keeps the logical value on the field model.
     *
     * For the AFSpecial presets the mask is applied here and not while typing. The
     * typed value is validated against the digit count of the preset first; when the
     * value does not match, a validation error is shown and the value is left as typed.
     *
     * @param {HTMLInputElement} input - text input
     * @returns {void}
     * @private
     */
    public applyAfFormatOnBlur(input: HTMLInputElement): void {
        if (!input) {
            return;
        }
        const field: any = this.findAfField(input);
        if (!shouldRunFormat(field, this.isServerMode())) {
            return;
        }
        const config: AfFormatConfig = fieldConfig(field);
        const logical: string = input.dataset.afLast != null ? input.dataset.afLast : input.value;
        if (isSpecialPreset(config)) {
            const commit: AfSpecialCommit = this.validateSpecialPresetOnBlur(input, config);
            if (!commit.valid) {
                return;
            }
            input.dataset.afLast = commit.logical;
            input.value = commit.text;
            const baseColor: string = (field.FontColor || field.fontColor || field.color || '') as string;
            input.style.color = baseColor;
            this.writeAfLogical(field, input, commit.logical);
            return;
        }
        if (config.mask) {
            // The arbitrary mask is applied while typing. On blur the masked display
            // stays and the logical value is committed to the field model. A value
            // that does not fill every placeholder of the mask must surface a
            // validation error so the user can correct it.
            const prior: string = input.dataset.afPrior != null
                ? input.dataset.afPrior
                : (input.dataset.afLast != null
                    ? input.dataset.afLast
                    : (field.value || ''));
            const commit: AfMaskCommit = validateMaskOnCommit(config, logical, prior);
            if (!commit.valid && !this.isAfValueCleared(input)) {
                this.showMaskValidationError(commit.expected);
                // The value is reverted to the value the field held before this
                // edit session, so a failed validation never leaves the wrong
                // input in the field.
                this.restoreAfPriorValue(input);
                return;
            }
            input.dataset.afLast = commit.logical != null ? commit.logical : logical;
            input.dataset.afDisplay = commit.text;
            input.value = commit.text;
            this.writeAfLogical(field, input, input.dataset.afLast);
            return;
        }
        const check: { accepted: boolean, value: string } = applyKeystroke(config, logical, logical.length, logical.length, '', true);
        const committed: string = check.accepted ? check.value : (input.dataset.afLast || '');
        const formatted: { text: string, color?: string, rejected?: boolean, logical: string } = formatValue(config, committed);
        if (formatted.rejected) {
            input.value = input.dataset.afLast || '';
            return;
        }
        input.dataset.afLast = formatted.logical;
        input.value = formatted.text;
        const baseColor: string = (field.FontColor || field.fontColor || field.color || '') as string;
        input.style.color = formatted.color || baseColor;
        this.writeAfLogical(field, input, formatted.logical);
    }

    /**
     * Validates the value of an AFSpecial preset field when it loses focus.
     *
     * The value keeps the digits the user typed while the field was focused. On blur
     * the digit count is validated against the preset (ZIP 5, ZIP+4 9, Phone 10 or 7,
     * SSN 9). A value that does not match raises a validation error and the typed
     * digits are kept so the user can correct the value.
     *
     * @param {HTMLInputElement} input - text input
     * @param {AfFormatConfig} config - parsed AF config
     * @returns {AfSpecialCommit} the commit result
     * @private
     */
    private validateSpecialPresetOnBlur(input: HTMLInputElement, config: AfFormatConfig): AfSpecialCommit {
        const typed: string = input.value == null ? '' : String(input.value);
        const commit: AfSpecialCommit = validateSpecialValue(config, typed);
        if (!commit.valid && !this.isAfValueCleared(input)) {
            // The mask is not applied. The value is reverted to the value the
            // field held before this edit session, so a failed validation never
            // leaves the wrong input in the field.
            this.restoreAfPriorValue(input);
            this.showSpecialValidationError(commit.expected);
        }
        return commit;
    }

    /**
     * Whether the user cleared the field. An empty value is a deliberate action
     * and not a format violation, so it is committed as an empty field and never
     * raises a validation error.
     *
     * @param {HTMLInputElement} input - text input
     * @returns {boolean} true when the field holds no value
     * @private
     */
    private isAfValueCleared(input: HTMLInputElement): boolean {
        if (!input) {
            return true;
        }
        const typed: string = input.value == null ? '' : String(input.value);
        if (typed.trim() === '') {
            return true;
        }
        // The preset keeps only the digits, so a value that holds no digit is a
        // cleared field even when the input still shows a separator.
        return !(/\d/.test(typed));
    }

    /**
     * Reverts a formatted text box to the value it held before the current edit
     * session. The prior value is captured on focus; when it is not available the
     * value stored on the field model is used. The input, the format cache and the
     * field model are restored together so the display and the stored value agree.
     *
     * @param {HTMLInputElement} input - text input
     * @returns {void}
     * @private
     */
    private restoreAfPriorValue(input: HTMLInputElement): void {
        if (!input) {
            return;
        }
        const field: any = this.findAfField(input);
        const prior: string = input.dataset.afPrior != null
            ? input.dataset.afPrior
            : (field && field.value != null ? String(field.value) : '');
        const config: AfFormatConfig = fieldConfig(field);
        // The prior value is the logical value. The display is rebuilt from it so
        // a masked field shows the mask again and a preset field shows its pattern.
        const display: { text: string, logical: string } = formatValue(config, prior);
        input.value = display.text;
        input.dataset.afLast = display.logical != null ? display.logical : prior;
        input.dataset.afDisplay = display.text;
        if (field) {
            this.writeAfLogical(field, input, input.dataset.afLast);
        }
    }

    /**
     * Shows the validation error for an AFSpecial preset value that does not match.
     *
     * @param {string} expected - description of the accepted digit count
     * @returns {void}
     * @private
     */
    private showSpecialValidationError(expected: string): void {
        this.pdfViewer.showNotificationDialog = false;
        this.pdfViewer.showNotificationPopup('The value entered does not match the format of the field [' + expected + '].');
        this.pdfViewer.showNotificationDialog = true;
    }

    private paintAfDisplayForName(fieldName: string, field: any): void {
        if (!fieldName || typeof document === 'undefined') {
            return;
        }
        const nodes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input.e-pv-formfield-input');
        for (let i: number = 0; i < nodes.length; i++) {
            const input: HTMLInputElement = nodes[parseInt(i.toString(), 10)];
            if (input.name === fieldName || (input.id && input.id.indexOf(field.id || field.uniqueID || '___') === 0)) {
                this.paintAfDisplay(input, field);
            }
        }
    }

    private paintAfDisplay(input: HTMLInputElement, field: any): void {
        if (!input || !shouldRunFormat(field, this.isServerMode())) {
            return;
        }
        const config: AfFormatConfig = fieldConfig(field);
        const logical: string = (field.Text != null ? field.Text : (field.Value != null ? field.Value : '')) + '';
        if (isSpecialPreset(config)) {
            // The preset mask is the resting state of the field. The digits are kept
            // as the logical value so focusing the field restores the unformatted value.
            const commit: AfSpecialCommit = validateSpecialValue(config, logical);
            input.dataset.afLast = commit.logical;
            input.dataset.afDisplay = commit.valid ? commit.text : logical;
            if (document.activeElement === input) {
                return;
            }
            input.value = commit.valid ? commit.text : logical;
            return;
        }
        input.dataset.afLast = logical;
        if (document.activeElement === input) {
            return;
        }
        const formatted: { text: string, color?: string } = formatValue(config, logical);
        input.value = formatted.text;
        input.dataset.afDisplay = formatted.text;
        if (formatted.color) {
            input.style.color = formatted.color;
        }
    }

    private findAfField(input: HTMLInputElement): any {
        if (!input || !this.formFieldsData) {
            return null;
        }
        const rows: PdfRenderedFields[] = this.formFieldsData as PdfRenderedFields[];
        for (let i: number = 0; i < rows.length; i++) {
            const row: any = rows[parseInt(i.toString(), 10)];
            const field: any = row && row.FormField ? row.FormField : row;
            if (!field) {
                continue;
            }
            const id: string = field.uniqueID || field.id || '';
            if (id && input.id && input.id.indexOf(id) === 0) {
                return field;
            }
            const name: string = field.FieldName || field.name || '';
            if (name && input.name && name === input.name) {
                return field;
            }
        }
        return null;
    }

    private writeAfLogical(field: any, input: HTMLInputElement, logical: string): void {
        if (field.Text !== undefined) {
            field.Text = logical;
        }
        if (field.Value !== undefined) {
            field.Value = logical;
        }
        field.value = logical;
        const collections: any[] = this.pdfViewer.formFieldCollections;
        if (collections) {
            for (let i: number = 0; i < collections.length; i++) {
                const item: any = collections[parseInt(i.toString(), 10)];
                if (item && (item.name === input.name || item.id === field.uniqueID || item.id === field.id)) {
                    item.value = logical;
                }
            }
        }
    }

    /**
     * Resolves the stable cache key used for DateTime "last valid value" recovery.
     *
     * The fill-mode DateTime `<input>` may sit inside a wrapper whose id ends in
     * `_datetime` while the inner text input id has the canonical form
     * `<viewerId>_input_<page>_<i>`. We resolve bottom-up: prefer inputField.id;
     * fall back to FieldName when available; finally to name so both designer
     * and viewer paths agree on a stable key even when the input element gets
     * recreated across paint/zoom/rerender/property updates.
     *
     * @param {HTMLInputElement} textInput - datetime text input
     * @private
     * @returns {string} - cache key ('' when no stable identity can be derived)
     */
    private resolveDateTimeFieldKey(textInput: HTMLInputElement): string {
        if (!textInput) {
            return '';
        }
        // Prefer the stable logical identity (FieldName / name) over the
        // page-indexed DOM id, which changes across renders / zooms. The
        // composite input's id pattern is `<viewerId>_input_<page>_<i>` plus
        // a `_content_html` wrapper in the designer — neither survives a
        // rerender or property update, while FieldName / name does.
        const name: string = textInput.name ? textInput.name.trim() : '';
        if (name) {
            return 'name:' + name;
        }
        const id: string = textInput.id || '';
        if (id) {
            return id;
        }
        return '';
    }

    /**
     * On blur of DateTime composite text:
     *  - empty: no-op
     *  - valid: commit as the field's latest valid value
     *  - invalid: notification + restore previous valid value when one exists,
     *             otherwise clear (new / previously empty field)
     * Package-visible so designer blur can reuse the same fill path.
     *
     * @param {HTMLInputElement} textInput - datetime text input
     * @private
     * @returns {void}
     */
    public validateDateTimeTextOnBlur(textInput: HTMLInputElement): void {
        if (!textInput) {
            return;
        }
        const raw: string = (textInput.value || '').trim();
        if (!raw) {
            return;
        }
        const pattern: string = this.resolveDateTimePatternForFill(textInput);
        if (this.isValidDateTimeText(raw, pattern)) {
            return;
        }
        this.pdfViewer.showNotificationDialog = false;
        this.pdfViewer.showNotificationPopup('Invalid date/time. The value entered does not match the required format: ' + pattern);
        this.pdfViewer.showNotificationDialog = true;
        textInput.value = '';
        const composite: HTMLElement = textInput.parentElement as HTMLElement;
        if (composite && composite.classList && composite.classList.contains('e-pv-datetime-composite')) {
            const nativePicker: HTMLInputElement =
                composite.querySelector('.e-pv-datetime-native-picker') as HTMLInputElement;
            if (nativePicker) {
                // Mirror the restored / cleared state on the native picker so subsequent
                // re-pick + sync keeps the displayed text and the stored value in agreement.
                nativePicker.value = (textInput.value || '').trim();
            }
        }
        this.pdfViewerBase.signatureModule.updateDataInSession(textInput);
    }

    /**
     * Validates whether `textInput` (a designer composite datetime text input)
     * currently holds a value matching its resolved AFDate/AFTime pattern.
     * Returns the pattern alongside the validity flag so callers can surface
     * user-facing errors without re-resolving it.
     *
     * @param {HTMLInputElement | null} textInput - datetime text input
     * @public
     * @returns {{ valid: boolean, pattern: string }} - validity + resolved pattern
     */
    public validateDateTimeChange(textInput: HTMLInputElement | null): { valid: boolean, pattern: string } {
        const defaultPattern: string = 'm/d/yy';
        if (!textInput) {
            return { valid: true, pattern: defaultPattern };
        }
        const raw: string = (textInput.value || '').trim();
        if (!raw) {
            return { valid: true, pattern: defaultPattern };
        }
        const pattern: string = this.resolveDateTimePatternForFill(textInput);
        return { valid: this.isValidDateTimeText(raw, pattern), pattern: pattern };
    }

    /**
     * Resolves AFDate/AFTime pattern for a fill-mode datetime text input.
     *
     * @param {HTMLInputElement} textInput - field text input
     * @private
     * @returns {string} - format pattern
     */
    private resolveDateTimePatternForFill(textInput: HTMLInputElement): string {
        const defaultPattern: string = 'm/d/yy';
        if (!textInput) {
            return defaultPattern;
        }
        const extractPattern: (script: string) => string = (script: string): string => {
            if (!script) {
                return '';
            }
            const match: RegExpMatchArray | null =
                script.match(/AF(?:Date|Time)_Format(?:Ex)?\s*\(\s*["']([^"']+)["']\s*\)/i);
            return (match && match[1]) ? match[1] : '';
        };
        // Helper: a session/designer row may be either a bare PdfRenderedFields /
        // PdfFormFieldBaseModel, or an IFormFieldCollection wrapper { Key, FormField }.
        // Resolve the inner record uniformly so designer-mode items match too.
        type DateTimeFieldRow = {
            isDateField?: boolean;
            IsDateField?: boolean;
            id?: string;
            name?: string;
            FieldName?: string;
            uniqueID?: string;
            actions?: { format?: { script?: string } };
            Actions?: { format?: { script?: string } };
        };
        const unwrapRow: (row: unknown) => DateTimeFieldRow | null = (row: unknown): DateTimeFieldRow | null => {
            if (!row || typeof row !== 'object') {
                return null;
            }
            const wrapper: { FormField?: DateTimeFieldRow } = row as { FormField?: DateTimeFieldRow };
            if (wrapper.FormField && typeof wrapper.FormField === 'object') {
                return wrapper.FormField;
            }
            return row as DateTimeFieldRow;
        };
        const isDateRow: (row: DateTimeFieldRow) => boolean = (row: DateTimeFieldRow): boolean => {
            return !!(row && (row.isDateField === true || row.IsDateField === true));
        };
        const readScript: (row: DateTimeFieldRow) => string = (row: DateTimeFieldRow): string => {
            const actions: object = row.Actions || row.actions;
            return this.pdfViewerBase.getActionsFormatScript(actions);
        };
        const matchesInput: (row: DateTimeFieldRow) => boolean = (row: DateTimeFieldRow): boolean => {
            const uniqueID: string = row.uniqueID || row.id || '';
            const fieldName: string = row.FieldName || row.name || '';
            if (uniqueID && (uniqueID === textInput.id
                || (textInput.id && textInput.id.indexOf(uniqueID) === 0))) {
                return true;
            }
            if (textInput.name && fieldName && fieldName === textInput.name) {
                return true;
            }
            return false;
        };
        // Prefer in-memory formFieldsData (same source as updateSameFieldsValue).
        if (this.formFieldsData && Array.isArray(this.formFieldsData)) {
            for (let i: number = 0; i < this.formFieldsData.length; i++) {
                const row: DateTimeFieldRow = unwrapRow(this.formFieldsData[parseInt(i.toString(), 10)]);
                if (!row || !isDateRow(row) || !matchesInput(row)) {
                    continue;
                }
                return extractPattern(readScript(row)) || defaultPattern;
            }
        }
        // Designer session fallback: items may be wrappers or bare models.
        try {
            const designerSession: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            if (designerSession) {
                const datas: unknown[] = JSON.parse(designerSession) as unknown[];
                for (let i: number = 0; i < datas.length; i++) {
                    const row: DateTimeFieldRow = unwrapRow(datas[parseInt(i.toString(), 10)]);
                    if (!row || !isDateRow(row) || !matchesInput(row)) {
                        continue;
                    }
                    return extractPattern(readScript(row)) || defaultPattern;
                }
            }
        } catch (e) {
            // Fall through.
        }
        try {
            const sessionData: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
            if (sessionData) {
                const datas: any[] = JSON.parse(sessionData);
                for (let i: number = 0; i < datas.length; i++) {
                    const row: DateTimeFieldRow = unwrapRow(datas[parseInt(i.toString(), 10)]);
                    if (!row || !isDateRow(row) || !matchesInput(row)) {
                        continue;
                    }
                    return extractPattern(readScript(row)) || defaultPattern;
                }
            }
        } catch (e) {
            // Fall through.
        }
        // Designer collection fallback.
        try {
            if (this.pdfViewer.formDesignerModule && this.pdfViewerBase.formFieldCollection) {
                const collection: IFormFieldCollection[] = this.pdfViewerBase.formFieldCollection;
                for (let j: number = 0; j < collection.length; j++) {
                    const item: DateTimeFieldRow = unwrapRow(collection[parseInt(j.toString(), 10)]);
                    if (!item || !isDateRow(item)) {
                        continue;
                    }
                    if (!matchesInput(item)) {
                        // Also accept the textInput.id without trailing _content suffix.
                        const strippedId: string = textInput.id ? textInput.id.replace(/_content$/, '') : '';
                        if (!item.id || !strippedId || item.id !== strippedId) {
                            continue;
                        }
                    }
                    return extractPattern(readScript(item)) || defaultPattern;
                }
            }
        } catch (e2) {
            // default
        }
        return defaultPattern;
    }

    /**
     * Best-effort validation of typed date/time against an Acrobat-like pattern.
     * Empty is valid (caller skips). Literal separators in pattern must match.
     *
     * @param {string} raw - trimmed user text
     * @param {string} pattern - format pattern
     * @private
     * @returns {boolean} - true when acceptable
     */
    private isValidDateTimeText(raw: string, pattern: string): boolean {
        if (!raw) {
            return true;
        }
        const pat: string = pattern || 'm/d/yy';
        // Build a loose regex from known tokens (order: longest first).
        let escaped: string = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const tokenSpecs: { token: string; regex: string }[] = [
            { token: 'mmmm', regex: '(January|February|March|April|May|June|July|August|September|October|November|December)' },
            { token: 'mmm', regex: '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)' },
            { token: 'yyyy', regex: '\\d{4}' },
            { token: 'yyy', regex: '\\d{3,4}' },
            { token: 'yy', regex: '\\d{2}' },
            { token: 'mm', regex: '\\d{1,2}' },
            { token: 'dd', regex: '\\d{1,2}' },
            { token: 'HH', regex: '\\d{1,2}' },
            { token: 'hh', regex: '\\d{1,2}' },
            { token: 'MM', regex: '\\d{1,2}' },
            { token: 'ss', regex: '\\d{1,2}' },
            { token: 'tt', regex: '(AM|PM|am|pm)' },
            { token: 'm', regex: '\\d{1,2}' },
            { token: 'd', regex: '\\d{1,2}' },
            { token: 'H', regex: '\\d{1,2}' },
            { token: 'h', regex: '\\d{1,2}' },
            { token: 's', regex: '\\d{1,2}' }
        ];
        // Replace case-sensitively where needed: MM minutes vs mm month handled by order after escape.
        // Work on original pattern with placeholders to avoid double-replace.
        let work: string = pat;
        const holders: string[] = [];
        for (let t: number = 0; t < tokenSpecs.length; t++) {
            const spec: { token: string; regex: string } = tokenSpecs[parseInt(t.toString(), 10)];
            const flags: string = (spec.token === 'mmm' || spec.token === 'mmmm' || spec.token === 'tt') ? 'gi' : 'g';
            // eslint-disable-next-line security/detect-non-literal-regexp
            const re: RegExp = new RegExp(spec.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
            work = work.replace(re, () => {
                const key: string = '@@' + holders.length + '@@';
                holders.push(spec.regex);
                return key;
            });
        }
        escaped = work.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        for (let h: number = 0; h < holders.length; h++) {
            escaped = escaped.replace('@@' + h + '@@', holders[parseInt(h.toString(), 10)]);
        }
        // Allow flexible whitespace around separators.
        escaped = escaped.replace(/\\\s+/g, '\\s*').replace(/\s+/g, '\\s*');
        try {
            // eslint-disable-next-line security/detect-non-literal-regexp
            const full: RegExp = new RegExp('^\\s*' + escaped + '\\s*$');
            return full.test(raw);
        } catch (e) {
            return false;
        }
    }

    public updateFormFields(event: MouseEvent): void {
        let currentTarget: HTMLInputElement = event.target as HTMLInputElement;
        if (this.pdfViewerBase.isDeviceiOS && currentTarget.type === 'checkbox') {
            currentTarget.focus();
        }
        if (currentTarget.className === 'e-pdfviewer-ListBox') {
            currentTarget = currentTarget.parentElement as HTMLInputElement;
            this.pdfViewerBase.signatureModule.updateDataInSession(currentTarget);
        } else if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus') {
            this.currentTarget = currentTarget;
        } else if (currentTarget.className === 'e-pv-buttonItem' || currentTarget.type === 'button' || currentTarget.type === 'image') {
            this.pdfViewer.fireButtonFieldClickEvent(currentTarget.value, currentTarget.name, currentTarget.id);
        }
        const field: FormFieldModel | undefined = this.findButtonFieldByDomId(currentTarget.id);
        if (field) {
            const isButton: boolean = this.isButtonFormField(field) && (currentTarget.className === 'e-pv-buttonItem' ||
                currentTarget.type === 'button' || currentTarget.type === 'image');
            if (this.pdfViewer.formDesignerModule || this.pdfViewer.annotationModule) {
                this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', field);
                if (isButton) {
                    this.executeButtonGoToAction(field, 'mouseUp');
                }
            } else if (isButton) {
                this.executeButtonGoToAction(field, 'mouseUp');
            }
        }
        for (let m: number = 0; m < this.pdfViewer.formFieldCollections.length; m++) {
            if (currentTarget.id === this.pdfViewer.formFieldCollections[parseInt(m.toString(), 10)].id) {
                if (currentTarget.className === 'e-pdfviewer-signatureformfields' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature' || currentTarget.className === 'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature  e-pv-signature-focus') {
                    this.pdfViewerBase.signatureModule.setFocus(currentTarget.id);
                }
            }
        }
    }

    /**
     * True when collection type is public ButtonField or legacy internal Button.
     *
     * @param {FormFieldModel} field - form field collection entry
     * @returns {boolean} whether field is a button
     */
    private isButtonFormField(field: FormFieldModel): boolean {
        if (isNullOrUndefined(field) || isNullOrUndefined(field.type)) {
            return false;
        }
        return field.type === 'ButtonField' || (field.type as string) === 'Button';
    }

    /**
     * Resolves 1-based destination page number from a GoTo payload.
     * Prefers `destinationPageNumber`; accepts legacy `destinationPageIndex` (0-based) as fallback.
     *
     * @param {GoToActionModel} goToAction - flat or nested GoTo payload
     * @returns {number} 1-based page number, or NaN when missing
     */
    private resolveGoToDestinationPageNumber(goToAction: GoToActionModel): number {
        if (isNullOrUndefined(goToAction)) {
            return NaN;
        }
        // Accept number or numeric string so designer/runtime payloads navigate consistently.
        if (!isNullOrUndefined(goToAction.destinationPageNumber)) {
            const pageNumber: number = Number(goToAction.destinationPageNumber);
            if (!isNaN(pageNumber) && isFinite(pageNumber)) {
                return pageNumber;
            }
        }
        return NaN;
    }

    /**
     * Executes button field GoTo action for the given AA slot.
     * Navigation mirrors LinkAnnotation.renderDocumentLink (source of truth).
     *
     * @param {FormFieldModel} field - button form field
     * @param {string} slot - AA action slot name
     * @returns {void}
     */
    private executeButtonGoToAction(field: FormFieldModel, slot: string): void {
        try {
            let actions: ActionsSettingsModel = !isNullOrUndefined(field.actions) ? field.actions :
                (field as unknown as PdfRenderedFields).Actions;
            if (isNullOrUndefined(actions) && field.id && this.pdfViewer.nameTable) {
                const table: Record<string, PdfFormFieldBaseModel> = this.pdfViewer.nameTable as Record<string, PdfFormFieldBaseModel>;
                const prefix: string = field.id;
                const keys: string[] = Object.keys(table);
                for (let i: number = 0; i < keys.length; i++) {
                    const key: string = keys[parseInt(i.toString(), 10)];
                    // Boundary-safe match only (exact or prefix + '_'); avoids "btn" → "btn2".
                    if (this.isButtonFieldIdMatch(prefix, key)) {
                        const candidate: PdfFormFieldBaseModel = table[`${key}`];
                        if (candidate) {
                            const candidateActions: PdfFormFieldBaseModel = !isNullOrUndefined(candidate.actions) ?
                                candidate.actions : (candidate as unknown as PdfRenderedFields).Actions;
                            if (!isNullOrUndefined(candidateActions)) {
                                actions = candidateActions as object;
                                break;
                            }
                        }
                    }
                }
            }
            if (isNullOrUndefined(actions) || isNullOrUndefined(actions[slot as keyof ActionsSettingsModel])) {
                return;
            }
            const action: ActionModel | ButtonRuntimeAction = actions[slot as keyof ActionsSettingsModel];
            const goToAction: ActionModel = (!isNullOrUndefined(action) && !isNullOrUndefined((action as ButtonRuntimeAction).goToAction))
                ? (action as ButtonRuntimeAction).goToAction : action;
            const kind: string = !isNullOrUndefined(action)
                ? (!isNullOrUndefined(action.action) ? action.action :
                    (!isNullOrUndefined((action as ButtonRuntimeAction).actionType) ? (action as ButtonRuntimeAction).actionType : '')) : '';
            const pageNumber: number = this.resolveGoToDestinationPageNumber(goToAction as GoToActionModel);
            if (isNullOrUndefined(goToAction) || (kind !== 'GoTo' && kind !== 'goto' && isNaN(pageNumber))) {
                return;
            }
            if (kind !== '' && kind !== 'GoTo' && kind !== 'goto') {
                return;
            }
            if (isNaN(pageNumber) || typeof pageNumber !== 'number') {
                return;
            }
            // Public API is 1-based page number; internal navigation uses 0-based page index.
            const pageIndex: number = pageNumber - 1;
            if (pageNumber < 1 || pageNumber > this.pdfViewer.pageCount || pageIndex < 0) {
                return;
            }
            // Parity with DocumentLink destinationLocation (top-down viewer pixels) →
            // pdf-link-annotation.renderLinkElement → LinkAnnotation.renderDocumentLink.
            // destinationLocation.y is top-down from page top (same as DocumentLinkSettings),
            // not PDF bottom-up. (0,0) → page top; (100,100) → 100px from top/left at 100% zoom.
            const zoomFactorRequested: number = !isNullOrUndefined((goToAction as GoToActionModel).zoomValue) ?
                (goToAction as GoToActionModel).zoomValue : 0;
            const destLocationX: number = (goToAction as GoToActionModel).destinationLocation &&
                !isNullOrUndefined((goToAction as GoToActionModel).destinationLocation.x) ?
                (goToAction as GoToActionModel).destinationLocation.x : 0;
            // Top-down Y in viewer page coordinates (matches DocumentLink.destinationLocation.y).
            const destLocationTopDown: number = (goToAction as GoToActionModel).destinationLocation &&
                !isNullOrUndefined((goToAction as GoToActionModel).destinationLocation.y) ?
                (goToAction as GoToActionModel).destinationLocation.y : 0;
            const pageSize: ISize = this.pdfViewerBase && this.pdfViewerBase.pageSize
                ? this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)] : null;
            if (!isNullOrUndefined(pageSize) && this.pdfViewerBase.viewerContainer) {
                let targetZoom: number = zoomFactorRequested > 0 ? zoomFactorRequested :
                    (this.pdfViewerBase.getZoomFactor ? this.pdfViewerBase.getZoomFactor() : 1);
                const currentZoom: number = this.pdfViewerBase.getZoomFactor
                    ? this.pdfViewerBase.getZoomFactor() : 1;
                if (this.pdfViewer.magnificationModule && zoomFactorRequested > 0 &&
                    zoomFactorRequested !== currentZoom) {
                    // zoomTo accepts percentage; values <= 4 treated as factors (DocumentLink parity).
                    const zoomPercent: number = targetZoom > 4 ? currentZoom * 100 : targetZoom * 100;
                    this.pdfViewer.magnificationModule.zoomTo(zoomPercent);
                    targetZoom = this.pdfViewerBase.getZoomFactor
                        ? this.pdfViewerBase.getZoomFactor() : targetZoom;
                }
                const appliedZoom: number = this.pdfViewerBase.getZoomFactor
                    ? this.pdfViewerBase.getZoomFactor() : targetZoom;
                // Top-down offset from page top (DocumentLink.destinationLocation parity).
                // scrollTop = pageTop*z + y*z; scrollLeft = x*z (viewer page pixels).
                const scrollTop: number = pageSize.top * appliedZoom +
                    (destLocationTopDown * appliedZoom);
                const scrollLeft: number = destLocationX * appliedZoom;
                this.pdfViewerBase.viewerContainer.scrollTop = scrollTop;
                this.pdfViewerBase.viewerContainer.scrollLeft = scrollLeft;
            } else if (this.pdfViewer.navigationModule) {
                this.pdfViewer.navigation.goToPage(pageNumber);
            }
        } catch (e) {
            // Fail-silent for invalid GoTo targets
        }
    }

    private updateSameFieldsValue(event: Event): void {
        if (this.formFieldsData) {
            for (let i: number = 0; i < this.formFieldsData.length; i++) {
                const currentField: PdfRenderedFields = this.formFieldsData[parseInt(i.toString(), 10)] as PdfRenderedFields;
                if ((event.target as HTMLInputElement).name === currentField.FieldName
                    && (event.target as HTMLInputElement).id !== currentField.uniqueID) {
                    const currentTarget: HTMLElement =
                        document.getElementById((this.formFieldsData[parseInt(i.toString(), 10)] as PdfRenderedFields).uniqueID);
                    if (currentTarget) {
                        (currentTarget as HTMLInputElement).value = (event.target as HTMLInputElement).value;
                    } else {
                        currentField.Text = (event.target as HTMLInputElement).value;
                        this.pdfViewerBase.signatureModule.updateDataInSession(currentField, null, null, null, null, true);
                    }
                }
            }
        }
    }

    private updateFormFieldsValue(event: MouseEvent | KeyboardEvent): void {
        const currentTarget: HTMLInputElement = event.target as HTMLInputElement;
        let fieldIndex: number;
        let nextFields: FormFieldModel;
        if ((currentTarget as HTMLInputElement & { InsertSpaces?: boolean }).InsertSpaces && !this.isKeyDownCheck) {
            const font: number = parseInt(currentTarget.style.width, 10) + (parseInt(currentTarget.style.height, 10) / 2);
            currentTarget.style.width = '' + font + 'px';
            this.isKeyDownCheck = true;
        }
        const isTab: boolean = (event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).code === 'Tab';
        if (isTab && currentTarget && (currentTarget.className === 'e-pdfviewer-formFields' || currentTarget.className ===
        'e-pdfviewer-signatureformfields e-pv-signature-focus' || currentTarget.className === 'e-pdfviewer-signatureformfields-signature')) {
            const id: string = currentTarget.id.split('input_')[1].split('_')[0];
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + parseInt(id, 10));
            const currentFields: HTMLCollectionOf<Element> = textLayer.getElementsByClassName('e-pdfviewer-formFields');
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
                    if ((currentFields[parseInt(l.toString(), 10)] as HTMLElement).tabIndex === (tabindex)) {
                        (currentFields[parseInt(l.toString(), 10)] as HTMLElement).focus();
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
            const nextField: FormFieldModel = fieldIndex > 0 ? this.pdfViewer.formFieldCollections[fieldIndex - 1] :
                this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.length - 1];
            this.pdfViewer.focusFormField(nextField);
            event.preventDefault();
        }
        if ((event.currentTarget as HTMLElement).classList.contains('e-pdfviewer-signatureformfields') ||
            (event.currentTarget as HTMLElement).classList.contains('e-pdfviewer-signatureformfields-signature')) {
            if ((event as KeyboardEvent).key === 'Enter') {
                const currentTarget: HTMLInputElement = event.target as HTMLInputElement;
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
        const currentTarget: HTMLInputElement = event.target as HTMLInputElement;
        if (currentTarget.type === 'checkbox') {
            const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
            if (data && !this.pdfViewer.formDesignerModule) {
                const FormFieldsData: any = JSON.parse(data);
                const groupCheckBoxSameName: PdfRenderedFields[] = FormFieldsData.filter((sameNameCheckboxField: PdfRenderedFields) => (sameNameCheckboxField.GroupName === currentTarget.name) && sameNameCheckboxField.Name === 'CheckBox');
                if (groupCheckBoxSameName.length > 1) {
                    const isChecked: boolean = currentTarget.checked;
                    for (let i: number = 0; i < groupCheckBoxSameName.length; i++) {
                        const currentCheckbox: PdfRenderedFields = groupCheckBoxSameName[parseInt(i.toString(), 10)];
                        const targetCheckBox: HTMLInputElement = document.getElementById(currentCheckbox.uniqueID) as HTMLInputElement;
                        if (targetCheckBox) {
                            let shouldCheck: boolean = isChecked;
                            if (isChecked && currentCheckbox.Value !== currentTarget.value) {
                                shouldCheck = false;
                            }
                            if (currentCheckbox.uniqueID === currentTarget.id) {
                                shouldCheck = currentTarget.checked;
                            }
                            targetCheckBox.checked = shouldCheck;
                            targetCheckBox.style.webkitAppearance = shouldCheck ? 'auto' : 'none';
                        }
                    }
                }
            }
        } else if (currentTarget.type === 'radio') {
            const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
            if (data && !this.pdfViewer.formDesignerModule) {
                const targetId: string = currentTarget.id;

                // Find the clicked radio button in the form field collections
                const matchedFields: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(
                    (field: FormFieldModel) => field.id === targetId
                );

                if (matchedFields.length > 0) {
                    const selectedName: string = matchedFields[0].name;
                    const selectedValue: string = matchedFields[0].value;
                    const FormFieldsData: any = JSON.parse(data);

                    // Get all radio buttons with the same name and value from UI collection
                    const groupRadioButtonsSameName: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(
                        (radioField: FormFieldModel) =>
                            radioField.name === selectedName &&
                            radioField.value === selectedValue &&
                            radioField.type === 'RadioButton'
                    );

                    if (groupRadioButtonsSameName.length > 0) {
                        // Update session storage data
                        FormFieldsData.forEach((field: PdfRenderedFields) => {
                            if (field.Name === 'RadioButton' &&
                                (field.GroupName === selectedName || field.FieldName === selectedName)) {

                                // Determine if this radio button should be selected
                                const shouldBeSelected: boolean = field.Value === selectedValue;
                                field.Selected = shouldBeSelected;

                                // Update UI only if element exists and state differs
                                if (!shouldBeSelected) {
                                    const radioElement: HTMLInputElement = document.getElementById(field.uniqueID) as HTMLInputElement;
                                    if (radioElement) {
                                        radioElement.checked = false;
                                    }
                                }
                            }
                        });

                        // Update UI for all radio buttons with same name and value
                        groupRadioButtonsSameName.forEach((currentRadioButton: FormFieldModel) => {
                            const targetRadioButton: HTMLInputElement = document.getElementById(currentRadioButton.id) as HTMLInputElement;
                            if (targetRadioButton) {
                                targetRadioButton.checked = true;
                            }
                        });

                        // Save updated data back to session storage
                        this.pdfViewerBase.setItemInSessionStorage(FormFieldsData, '_formfields');
                    }
                }
            }
        }
        this.pdfViewerBase.signatureModule.updateDataInSession(currentTarget);
    }

    /**
     * @private
     * @returns {void}
     */
    public removeExistingFormFields(): void{
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = !isNullOrUndefined(data) ? JSON.parse(data) : null;
        if (formFieldsData) {
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'RadioButton'){
                    let buttonItem: IRadiobuttonItem[] = [];
                    buttonItem = formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem;
                    const sameButtonItemId: string = formFieldsData[parseInt(i.toString(), 10)].FormField.id.split('_')[0];
                    for (let j: number = 0; j < buttonItem.length; j++) {
                        const otherButton: IRadiobuttonItem = buttonItem[parseInt(j.toString(), 10)];
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

    private applyCommonProperties(inputdiv: HTMLInputElement, pageIndex: number, index: number, currentData: PdfRenderedFields,
                                  isFieldRotated?: boolean): void {
        const inputField: HTMLElement = document.getElementById(this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
        if (inputField) {
            const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            if ((inputdiv.type === 'text' || inputdiv.type === 'password' || inputdiv.type === 'textarea') &&
                inputField.parentElement !== textLayer) {
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
            if ((inputdiv as HTMLElement).classList && (inputdiv as HTMLElement).classList.contains('e-pv-datetime-composite')) {
                (inputdiv as HTMLElement).className = 'e-pv-datetime-composite e-pdfviewer-formFields';
            } else {
                inputdiv.className = 'e-pdfviewer-formFields';
            }
        }
        // I6/I7: keep DOM id aligned with uniqueID / collections (FieldUniqueKey for buttons).
        inputdiv.id = currentData.uniqueID ? currentData.uniqueID :
            ((currentData.Name === 'Button' && currentData.FieldUniqueKey) ?
                (this.pdfViewer.element.id + '_' +
                    String(currentData.FieldUniqueKey).replace(/[^0-9a-zA-Z#_-]+/g, '') +
                    '_input_' + pageIndex + '_' + index) :
                (this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index));
        inputdiv.setAttribute('aria-label', this.pdfViewer.element.id + 'input_' + pageIndex);
        (inputdiv as HTMLElement).style.zIndex = (1000).toString();
    }

    /**
     * @param {PdfRenderedFields} currentData - It describes about the current data
     * @param {number} pageIndex - It describes about the page index
     * @param {number} index - It describes about the index
     * @param {HTMLElement} printContainer - It describes about the print container
     * @param {number} count - It describes about the count
     * @private
     * @returns {HTMLElement} - {currentData: HTMLElement | HTMLInputElement | HTMLSelectElement; count: number;}
     */
    public createFormFields(currentData: PdfRenderedFields, pageIndex: number, index?: number, printContainer?: HTMLElement,
                            count?: number): { currentField: HTMLElement | HTMLInputElement | HTMLSelectElement;
            count: number; } {
        let currentField: HTMLElement | HTMLInputElement | HTMLSelectElement;
        switch (currentData['Name']) {
        case 'Textbox':
            currentField = this.createTextBoxField(currentData, pageIndex, 'text', printContainer ? true : false) as HTMLElement;
            break;
        case 'Password':
            currentField = this.createTextBoxField(currentData, pageIndex, 'password', printContainer ? true : false) as HTMLElement;
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
        case 'Barcode':
            currentField = this.createBarcodeField(currentData, pageIndex);
            break;
        case 'ink':
            if (this.pdfViewer.formDesignerModule){
                if (currentData.Value && currentData.Value !== '' && !this.isSignatureRendered) {
                    this.renderExistingAnnnot(currentData, index, printContainer);
                }
            }
            break;
        case 'SignatureText':
        case 'SignatureImage': {
            const signatureBoundsPixels: IFormFieldBound = {
                X: this.ConvertPointToPixel(currentData.LineBounds.X),
                Y: this.ConvertPointToPixel(currentData.LineBounds.Y),
                Width: this.ConvertPointToPixel(currentData.LineBounds.Width),
                Height: this.ConvertPointToPixel(currentData.LineBounds.Height)
            };
            // Filter form field collections to only Signature and Initial fields
            const signatureFormFields: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter((field: FormFieldModel) =>
                field.type === 'SignatureField' || field.type === 'InitialField'
            );
            const belongsToFormField: boolean = signatureFormFields.some((field: FormFieldModel) =>
                field.pageIndex === pageIndex &&
                field.bounds && currentData.LineBounds &&
                (field.bounds as PdfBoundsModel).x <= signatureBoundsPixels.X &&
                (field.bounds as PdfBoundsModel).y <= signatureBoundsPixels.Y &&
                ((field.bounds as PdfBoundsModel).x + (field.bounds as PdfBoundsModel).width) >= (
                    signatureBoundsPixels.X + signatureBoundsPixels.Width) &&
                ((field.bounds as PdfBoundsModel).y + (field.bounds as PdfBoundsModel).height) >= (
                    signatureBoundsPixels.Y + signatureBoundsPixels.Height)
            );
            if (currentData.Value && currentData.Value !== '' && !this.isSignatureRendered && belongsToFormField) {
                this.renderExistingAnnnot(currentData, index, printContainer);
            }
            break;
        }
        }
        return {currentField, count};
    }

    private getFormFieldType(currentData: PdfRenderedFields): string {
        let currentField: string;
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
        case 'Button':
            currentField = 'ButtonField';
            break;
        case 'Barcode':
            currentField = 'Barcode';
            break;
        }
        return currentField;
    }

    private createButtonField(data: PdfRenderedFields, pageIndex: number): HTMLInputElement {
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
        } else if (data.Value && !(this.isBase64(data.Value) || this.isURL(data.Value))) {
            inputField.value = data.Value;
        } else {
            inputField.value = '';
        }
        inputField.name = data.FieldName;
        // Reload appearance: text alignment must match designer/PDF textAlignment (textbox path already does this).
        this.addAlignmentPropety(data, inputField);
        return inputField;
    }

    /**
     * Builds the read-only barcode element rendered for a loaded barcode field.
     *
     * @param {any} data - The rendered field data.
     * @param {number} pageIndex - The page the field belongs to.
     * @returns {HTMLElement} The barcode element.
     */
    private createBarcodeField(data: any, pageIndex: number): HTMLElement {
        const bounds: { width: number, height: number } = data.LineBounds
            ? { width: this.ConvertPointToPixel(data.LineBounds.Width), height: this.ConvertPointToPixel(data.LineBounds.Height) }
            : { width: 200, height: 60 };
        const payload: string = data.Text || data.Value || '';
        let barcode: HTMLElement;
        if (!isNullOrUndefined(payload)) {
            const symbology: string = (data && data.Symbology) ? data.Symbology : 'PDF417';
            barcode = renderBarcodeField(payload, bounds, {
                symbology: symbology,
                errorCorrection: data.ErrorCorrectionLevel
            });
            queueMicrotask((): void => {
                if (!barcode.isConnected) { return; }
                mountBarcodeGenerator(
                    barcode, payload, bounds, {
                        symbology: symbology,
                        errorCorrection: data.ErrorCorrectionLevel,
                        compressData: data.CompressData === true
                    });
            });
        } else {
            const placeholder: HTMLElement = document.createElement('div');
            placeholder.className = 'e-pv-formfield-barcode-placeholder';
            placeholder.style.width = '100%';
            placeholder.style.height = '100%';
            placeholder.setAttribute('data-barcode-placeholder', 'true');
            barcode = placeholder;
        }
        barcode.setAttribute('name', data.FieldName);
        barcode.setAttribute('data-page-index', pageIndex.toString());
        return barcode;
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

    private createTextBoxField(data: PdfRenderedFields, pageIndex: number, type: string, isPrint?: boolean): HTMLElement | void {
        let inputField: HTMLElement;
        if (data.Visible === 1) {
            return;
        }
        if (data.Multiline) {
            inputField = document.createElement('textarea');
            inputField.style.resize = 'none';
        } else if (data.IsDateField && type === 'text') {
            // Fill-mode composite: text + trailing picker (parity with designer isDateField).
            inputField = this.createDateTimeCompositeFillField(data, pageIndex);
            return inputField;
        } else {
            (inputField as HTMLInputElement) = document.createElement('input');
            (inputField as HTMLInputElement).type = type;
        }
        if (data.MaxLength > 0) {
            (inputField as HTMLInputElement).maxLength = data.MaxLength;
        }
        this.addAlignmentPropety(data, inputField);
        if (data.Text !== '') {
            (inputField as HTMLInputElement).value = data.Text;
        } else {
            (inputField as HTMLInputElement).value = '';
        }
        if (!this.pdfViewer.enableAutoComplete) {
            (inputField as HTMLInputElement).autocomplete = 'off';
        }
        (inputField as HTMLInputElement).name = data.FieldName;
        if (isPrint && data.BorderWidth !== 0) {
            inputField.style.boxSizing = 'border-box';
            inputField.style.borderWidth = data.BorderWidth + 'px';
        }
        return inputField;
    }
    /**
     * Builds date/time composite control for fill mode textboxes flagged IsDateField.
     *
     * @param {PdfRenderedFields} data - rendered field payload
     * @param {number} pageIndex - page index
     * @private
     * @returns {HTMLElement} - composite wrapper
     */
    private createDateTimeCompositeFillField(data: PdfRenderedFields, pageIndex: number): HTMLElement {
        const wrapper: HTMLElement = document.createElement('div');
        wrapper.className = 'e-pv-datetime-composite e-pdfviewer-formFields';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'row';
        wrapper.style.alignItems = 'stretch';
        wrapper.style.boxSizing = 'border-box';
        wrapper.style.overflow = 'hidden';
        wrapper.style.padding = '0';

        const textInput: HTMLInputElement = document.createElement('input');
        textInput.type = 'text';
        // Keep e-pdfviewer-formFields only on the wrapper so bulk readonly/disable
        // paths do not treat the text node as a second form field.
        textInput.className = 'e-pv-formfield-input e-pv-datetime-text';
        // R-FIX-DTP-02: surface the resolved format as placeholder when value is empty.
        const fillPattern: string = this.parseFillDateTimeFormatPattern(data) || 'm/d/yy';
        textInput.setAttribute('placeholder', fillPattern);
        textInput.name = data.FieldName;
        textInput.value = data.Text ? data.Text : '';
        if (data.MaxLength > 0) {
            textInput.maxLength = data.MaxLength;
        }
        if (!this.pdfViewer.enableAutoComplete) {
            textInput.autocomplete = 'off';
        }
        this.addAlignmentPropety(data, textInput);
        textInput.style.flex = '1 1 auto';
        textInput.style.minWidth = '0';
        textInput.style.width = 'auto';
        textInput.style.height = '100%';
        textInput.style.border = 'none';
        textInput.style.background = 'transparent';
        textInput.style.outline = 'none';
        textInput.style.boxShadow = 'none';
        // Allow caret/selection; viewer may apply e-disable-text-selection on ancestors.
        textInput.style.userSelect = 'text';
        (textInput.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = 'text';
        textInput.style.cursor = 'text';
        textInput.style.pointerEvents = 'auto';

        const fieldType: string = data.DateFieldType ? String(data.DateFieldType).toLowerCase() : 'date';
        const pickerBtn: HTMLButtonElement = document.createElement('button');
        pickerBtn.type = 'button';
        pickerBtn.className = 'e-pv-datetime-picker-btn';
        pickerBtn.setAttribute('aria-label', 'Open date time picker');
        pickerBtn.tabIndex = 0;
        pickerBtn.style.flex = '0 0 auto';
        // Width is finalized from the zoomed field height in scaleDateTimePickerIcon.
        pickerBtn.style.width = '28px';
        pickerBtn.style.minWidth = '0';
        pickerBtn.style.height = '100%';
        pickerBtn.style.padding = '0';
        pickerBtn.style.margin = '0';
        // Match designer composite: no divider chrome between text and picker.
        pickerBtn.style.border = 'none';
        pickerBtn.style.outline = 'none';
        pickerBtn.style.background = 'transparent';
        pickerBtn.style.cursor = 'pointer';
        pickerBtn.style.display = 'flex';
        pickerBtn.style.alignItems = 'center';
        pickerBtn.style.justifyContent = 'center';
        pickerBtn.style.boxSizing = 'border-box';

        const iconSpan: HTMLElement = document.createElement('span');
        iconSpan.className = fieldType === 'time'
            ? 'e-pv-datetime-clock-icon e-pv-icon'
            : 'e-pv-datetime-calendar-icon e-pv-icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.style.pointerEvents = 'none';
        iconSpan.style.display = 'inline-block';
        iconSpan.style.width = '16px';
        iconSpan.style.height = '16px';
        pickerBtn.appendChild(iconSpan);

        const nativeType: string = this.inferFillNativePickerType(data);
        const nativePicker: HTMLInputElement = document.createElement('input');
        nativePicker.type = nativeType as 'date' | 'time' | 'datetime-local';
        nativePicker.className = 'e-pv-datetime-native-picker';
        nativePicker.tabIndex = -1;
        nativePicker.setAttribute('aria-hidden', 'true');
        nativePicker.style.position = 'absolute';
        nativePicker.style.opacity = '0';
        nativePicker.style.width = '1px';
        nativePicker.style.height = '1px';
        // R-FIX-DTP-01: anchor hidden native picker at wrapper BOTTOM so the
        // browser's native popup opens BELOW the visible text input by default
        // (browser falls back to "above" only when space below is insufficient).
        nativePicker.style.top = 'auto';
        nativePicker.style.bottom = '0';
        nativePicker.style.left = '0';
        nativePicker.style.pointerEvents = 'none';
        nativePicker.style.border = '0';

        const openPicker: () => void = (): void => {
            if (data.IsReadonly) {
                return;
            }
            // Read nativePicker.type at click-time so the seed format stays in sync
            // even if the field type changes after initial render.
            const liveNativeType: string =
                (nativePicker.type === 'date' || nativePicker.type === 'time' || nativePicker.type === 'datetime-local')
                    ? nativePicker.type
                    : nativeType;
            // Seed native control from current text so the open picker reflects the field value.
            const seedIso: string = this.parseFillDateTimeTextToISO(textInput.value || '', liveNativeType);
            if (seedIso) {
                nativePicker.value = seedIso;
            } else {
                nativePicker.value = '';
            }
            try {
                const showPickerFn: (() => void) | undefined =
                    (nativePicker as HTMLInputElement & { showPicker?: () => void }).showPicker;
                if (typeof showPickerFn === 'function') {
                    showPickerFn.call(nativePicker);
                } else {
                    nativePicker.focus();
                    nativePicker.click();
                }
            } catch (e) {
                nativePicker.focus();
            }
        };
        pickerBtn.addEventListener('click', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            openPicker();
        });
        pickerBtn.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                openPicker();
            }
        });
        nativePicker.addEventListener('change', () => {
            // Format native picker ISO value with the field AFDate/AFTime pattern (designer parity).
            textInput.value = this.formatFillNativeDateTimeValue(nativePicker.value, data);
            // Keep controls interactive for a later click; do not auto-enter edit mode after pick.
            if (!data.IsReadonly) {
                textInput.disabled = false;
                textInput.readOnly = false;
                textInput.style.pointerEvents = 'auto';
                textInput.style.cursor = 'text';
                textInput.style.outline = 'none';
                textInput.style.boxShadow = 'none';
                textInput.style.background = 'transparent';
                wrapper.style.pointerEvents = 'auto';
                wrapper.style.boxShadow = 'none';
                pickerBtn.disabled = false;
                pickerBtn.style.pointerEvents = 'auto';
                pickerBtn.style.cursor = 'pointer';
            }
            const changeEvent: Event = document.createEvent('Event');
            changeEvent.initEvent('change', true, true);
            textInput.dispatchEvent(changeEvent);
            // Do not focus the text after picker commit (avoids fake focused/caret state).
            // Clear any residual focus chrome and leave the field unfocused until user clicks.
            if (!data.IsReadonly) {
                try {
                    if (document.activeElement === textInput || document.activeElement === nativePicker) {
                        textInput.blur();
                    }
                } catch (e) {
                    // ignore blur failures
                }
                textInput.style.boxShadow = 'none';
                textInput.style.outline = 'none';
                wrapper.style.boxShadow = 'none';
            }
        });

        // Bind fill events on the text input (value source), not the wrapper.
        textInput.addEventListener('focus', this.focusFormFields.bind(this));
        textInput.addEventListener('blur', this.blurFormFields.bind(this));
        textInput.addEventListener('click', this.updateFormFields.bind(this));
        textInput.addEventListener('change', this.changeFormFields.bind(this));
        textInput.addEventListener('keydown', this.updateFormFieldsValue.bind(this));
        textInput.addEventListener('keyup', this.updateSameFieldsValue.bind(this));
        textInput.addEventListener('keydown', this.onAfKeyDown.bind(this));
        textInput.addEventListener('input', this.onAfInput.bind(this));
        this.paintAfDisplay(textInput, data);
        textInput.addEventListener('dblclick', (e: Event) => {
            e.stopPropagation();
            textInput.select();
        });

        wrapper.appendChild(textInput);
        wrapper.appendChild(pickerBtn);
        wrapper.appendChild(nativePicker);
        // Avoid double-binding when renderFormFields attaches listeners to the returned root.
        (wrapper as HTMLElement & { _pvDateTimeComposite?: boolean })._pvDateTimeComposite = true;
        void pageIndex;
        return wrapper;
    }

    /**
     * Best-effort parse of fill field text to native picker ISO-like value.
     *
     * @param {string} text - current text value
     * @param {string} nativeType - date | time | datetime-local
     * @private
     * @returns {string} - ISO-like seed or empty
     */
    private parseFillDateTimeTextToISO(text: string, nativeType: string): string {
        const raw: string = (text || '').trim();
        if (!raw) {
            return '';
        }
        let date: Date = new Date(NaN);
        const parsedMs: number = Date.parse(raw);
        if (!isNaN(parsedMs)) {
            date = new Date(parsedMs);
        } else {
            // eslint-disable-next-line security/detect-unsafe-regex
            const slash: RegExpMatchArray = raw.match(/^(\d{1,4})[/\-.](\d{1,2})[/\-.](\d{1,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)?)?/);
            if (slash) {
                let year: number;
                let month: number;
                let day: number;
                const a: number = Number(slash[1]);
                const b: number = Number(slash[2]);
                const c: number = Number(slash[3]);
                if (String(slash[1]).length === 4) {
                    year = a; month = b; day = c;
                } else if (String(slash[3]).length === 4) {
                    year = c; month = a; day = b;
                } else {
                    year = c < 100 ? 2000 + c : c;
                    month = a; day = b;
                }
                let hours: number = slash[4] ? Number(slash[4]) : 0;
                const minutes: number = slash[5] ? Number(slash[5]) : 0;
                const seconds: number = slash[6] ? Number(slash[6]) : 0;
                const ampm: string = slash[7] ? String(slash[7]).toUpperCase() : '';
                if (ampm === 'PM' && hours < 12) {
                    hours += 12;
                }
                if (ampm === 'AM' && hours === 12) {
                    hours = 0;
                }
                date = new Date(year, month - 1, day, hours, minutes, seconds);
            } else {
                // eslint-disable-next-line security/detect-unsafe-regex
                const timeOnly: RegExpMatchArray = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)?$/);
                if (timeOnly) {
                    const today: Date = new Date();
                    let hours: number = Number(timeOnly[1]);
                    const minutes: number = Number(timeOnly[2]);
                    const seconds: number = timeOnly[3] ? Number(timeOnly[3]) : 0;
                    const ampm: string = timeOnly[4] ? String(timeOnly[4]).toUpperCase() : '';
                    if (ampm === 'PM' && hours < 12) {
                        hours += 12;
                    }
                    if (ampm === 'AM' && hours === 12) {
                        hours = 0;
                    }
                    date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
                }
            }
        }
        if (!date || isNaN(date.getTime())) {
            return '';
        }
        const pad: (n: number) => string = (n: number): string => (n < 10 ? '0' : '') + n;
        const yyyy: string = String(date.getFullYear());
        const mm: string = pad(date.getMonth() + 1);
        const dd: string = pad(date.getDate());
        const HH: string = pad(date.getHours());
        const MM: string = pad(date.getMinutes());
        if (nativeType === 'time') {
            return HH + ':' + MM;
        }
        if (nativeType === 'datetime-local') {
            return yyyy + '-' + mm + '-' + dd + 'T' + HH + ':' + MM;
        }
        return yyyy + '-' + mm + '-' + dd;
    }

    /**
     * Extracts the date/time format pattern from a fill-mode field's AFDate/AFTime script.
     *
     * @param {PdfRenderedFields} data - rendered field payload
     * @private
     * @returns {string} - format pattern or empty when absent
     */
    private parseFillDateTimeFormatPattern(data: PdfRenderedFields): string {
        const script: string = this.pdfViewerBase.getActionsFormatScript(data.Actions);
        if (!script) {
            return '';
        }
        const match: RegExpMatchArray | null =
            script.match(/AF(?:Date|Time)_Format(?:Ex)?\s*\(\s*["']([^"']+)["']\s*\)/i);
        return (match && match[1]) ? match[1] : '';
    }

    /**
     * Formats a native date/time picker value using the fill field AFDate/AFTime pattern.
     * Mirrors designer formatNativeDateTimeValue for FormFields-only mode.
     *
     * @param {string} nativeValue - value from native input
     * @param {PdfRenderedFields} data - fill field payload
     * @private
     * @returns {string} - display string
     */
    private formatFillNativeDateTimeValue(nativeValue: string, data: PdfRenderedFields): string {
        if (!nativeValue) {
            return '';
        }
        const pattern: string = this.parseFillDateTimeFormatPattern(data) || 'm/d/yy';
        let date: Date = null;
        if (nativeValue.indexOf('T') !== -1) {
            date = new Date(nativeValue);
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(nativeValue)) {
            const parts: string[] = nativeValue.split('-');
            date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        } else if (/^\d{2}:\d{2}/.test(nativeValue)) {
            const today: Date = new Date();
            const tParts: string[] = nativeValue.split(':');
            date = new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            Number(tParts[0]), Number(tParts[1]), tParts[2] ? Number(tParts[2]) : 0);
        } else {
            date = new Date(nativeValue);
        }
        if (!date || isNaN(date.getTime())) {
            return nativeValue.replace('T', ' ');
        }
        return this.applyFillDateTimePattern(date, pattern);
    }

    /**
     * Applies Acrobat-like date/time pattern tokens (designer applyDateTimePattern parity).
     *
     * @param {Date} date - date value
     * @param {string} pattern - format pattern
     * @private
     * @returns {string} - formatted string
     */
    private applyFillDateTimePattern(date: Date, pattern: string): string {
        const pad: (n: number, len?: number) => string = (n: number, len: number = 2): string => {
            let s: string = String(n);
            while (s.length < len) {
                s = '0' + s;
            }
            return s;
        };
        const monthsShort: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthsLong: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];
        const yyyy: number = date.getFullYear();
        const yy: string = pad(yyyy % 100);
        const m: number = date.getMonth() + 1;
        const d: number = date.getDate();
        const H: number = date.getHours();
        const M: number = date.getMinutes();
        const s: number = date.getSeconds();
        const h12: number = (H % 12) === 0 ? 12 : (H % 12);
        const tt: string = H < 12 ? 'AM' : 'PM';
        let result: string = pattern || 'm/d/yy';
        result = result.replace(/yyyy/g, String(yyyy));
        result = result.replace(/yyy/g, String(yyyy));
        result = result.replace(/yy/g, yy);
        result = result.replace(/mmmm/gi, monthsLong[date.getMonth()]);
        result = result.replace(/mmm/gi, monthsShort[date.getMonth()]);
        result = result.replace(/mm/g, pad(m));
        result = result.replace(/\bm\b/g, String(m));
        result = result.replace(/dd/g, pad(d));
        result = result.replace(/\bd\b/g, String(d));
        result = result.replace(/\bH\b/g, String(H));
        result = result.replace(/HH/g, pad(H));
        result = result.replace(/h:MM:ss tt/g, h12 + ':' + pad(M) + ':' + pad(s) + ' ' + tt);
        result = result.replace(/h:MM tt/g, h12 + ':' + pad(M) + ' ' + tt);
        result = result.replace(/HH:MM:ss/g, pad(H) + ':' + pad(M) + ':' + pad(s));
        result = result.replace(/HH:MM/g, pad(H) + ':' + pad(M));
        result = result.replace(/MM/g, pad(M));
        result = result.replace(/ss/g, pad(s));
        result = result.replace(/\btt\b/gi, tt);
        result = result.replace(/hh/g, pad(h12));
        result = result.replace(/\bh\b/g, String(h12));
        return result;
    }

    /**
     * Infers native picker type for fill-mode date fields.
     *
     * @param {PdfRenderedFields} data - field data
     * @private
     * @returns {string} - date | time | datetime-local
     */
    private inferFillNativePickerType(data: PdfRenderedFields): string {
        const fieldType: string = data.DateFieldType ? String(data.DateFieldType).toLowerCase() : 'date';
        if (fieldType === 'time') {
            return 'time';
        }
        const script: string = this.pdfViewerBase.getActionsFormatScript(data.Actions);
        const hasHour: boolean = /h{1,2}|H{1,2}|tt/i.test(script);
        if (hasHour) {
            return this.supportsDateTimeLocalFill() ? 'datetime-local' : 'date';
        }
        // Default DateTime format is date+time.
        if (!script && fieldType === 'date') {
            return this.supportsDateTimeLocalFill() ? 'datetime-local' : 'date';
        }
        return 'date';
    }

    /**
     * Caches datetime-local support on the viewer once.
     *
     * @private
     * @returns {boolean} - support flag
     */
    private supportsDateTimeLocalFill(): boolean {
        const viewerAny: { _supportsDateTimeLocal?: boolean } = this.pdfViewer as unknown as { _supportsDateTimeLocal?: boolean };
        if (typeof viewerAny._supportsDateTimeLocal === 'boolean') {
            return viewerAny._supportsDateTimeLocal;
        }
        let supported: boolean = false;
        try {
            const testInput: HTMLInputElement = document.createElement('input');
            testInput.setAttribute('type', 'datetime-local');
            supported = testInput.type === 'datetime-local';
        } catch (e) {
            supported = false;
        }
        viewerAny._supportsDateTimeLocal = supported;
        return supported;
    }

    private checkIsReadonly(data: PdfRenderedFields, inputField: HTMLInputElement): void {
        let isReadonly: boolean = false;
        const isComposite: boolean = !!(inputField as HTMLElement).classList
            && (inputField as HTMLElement).classList.contains('e-pv-datetime-composite');
        const textInput: HTMLInputElement = isComposite
            ? ((inputField as HTMLElement).querySelector('.e-pv-formfield-input') as HTMLInputElement) || inputField
            : inputField;
        const pickerBtn: HTMLButtonElement | null = isComposite
            ? ((inputField as HTMLElement).querySelector('.e-pv-datetime-picker-btn') as HTMLButtonElement)
            : null;
        for (let n: number = 0; n < this.readOnlyCollection.length; n++) {
            if (inputField.id === this.readOnlyCollection[parseInt(n.toString(), 10)]
                || textInput.id === this.readOnlyCollection[parseInt(n.toString(), 10)]) {
                isReadonly = true;
                break;
            }
        }
        if (!this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule && (data.IsInitialField || data.IsSignatureField)) {
            isReadonly = true;
        }
        if (data.IsReadonly || (!this.pdfViewer.enableFormFields) || isReadonly) {
            textInput.disabled = true;
            textInput.readOnly = true;
            textInput.style.cursor = 'default';
            textInput.style.pointerEvents = 'none';
            if (isComposite) {
                (inputField as HTMLElement).style.cursor = 'default';
                (inputField as HTMLElement).style.backgroundColor = 'transparent';
                (inputField as HTMLElement).style.pointerEvents = 'none';
                if (pickerBtn) {
                    pickerBtn.disabled = true;
                    pickerBtn.style.cursor = 'default';
                    pickerBtn.style.pointerEvents = 'none';
                }
            } else {
                inputField.disabled = true;
                inputField.style.cursor = 'default';
                inputField.style.backgroundColor = 'transparent';
            }
        } else {
            // Ensure editable when not readonly (clears stale disabled from prior collection hits).
            textInput.disabled = false;
            textInput.readOnly = false;
            textInput.style.pointerEvents = 'auto';
            textInput.style.cursor = '';
            if (isComposite) {
                (inputField as HTMLElement).style.pointerEvents = 'auto';
                (inputField as HTMLElement).style.cursor = '';
                if (pickerBtn) {
                    pickerBtn.disabled = false;
                    pickerBtn.style.cursor = 'pointer';
                    pickerBtn.style.pointerEvents = 'auto';
                }
            } else {
                inputField.disabled = false;
            }
        }
        if (data.Name === 'SignatureField' || data.Name === 'InitialField') {
            isReadonly = this.pdfViewer.signatureFieldSettings.isReadOnly;
        }
        // I1: Button read-only → transparent fill only; caption/border/font stay configured.
        // Non-button types keep legacy full transparent + disabled styling when read-only.
        const isButton: boolean = data.Name === 'Button';
        const isButtonReadOnly: boolean = isButton && (data.IsReadonly || isReadonly);
        if (!isButton && (data.IsReadonly || (!this.pdfViewer.enableFormFields) || isReadonly)) {
            inputField.disabled = true;
            inputField.style.cursor = 'default';
            inputField.style.backgroundColor = 'transparent';
        } else if (!isButtonReadOnly) {
            const borderColor: FormFieldColor = data.BackColor;
            if (!isButton) {
                if (isComposite) {
                    (inputField as HTMLElement).style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0.2 + ')';
                    textInput.style.backgroundColor = 'transparent';
                } else {
                    inputField.style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0.2 + ')';
                }
            }
            else if (data.IsTransparent) {
                inputField.style.backgroundColor = 'transparent';
            }
            else if (borderColor) {
                const opacity: number = data.Opacity;
                if (opacity) {
                    inputField.style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + opacity + ')';
                }
                else {
                    inputField.style.backgroundColor = 'rgb(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ')';
                }
            }
            const fontColor: FormFieldColor = data.FontColor;
            if (fontColor) {
                textInput.style.color = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
            }
        }
        if (isButtonReadOnly) {
            inputField.style.backgroundColor = 'transparent';
            inputField.disabled = true;
            inputField.style.cursor = 'default';
            const fontColor: FormFieldColor = data.FontColor;
            if (fontColor) {
                inputField.style.color = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
            }
        }
    }

    private applyTabIndex(data: PdfRenderedFields, inputField: HTMLElement, pageIndex: number): void {
        inputField.tabIndex = data.TabIndex;
        this.maxTabIndex = Math.max(this.maxTabIndex, inputField.tabIndex);
        if (this.minTabIndex === -1) {
            this.minTabIndex = inputField.tabIndex;
        }
        this.minTabIndex = Math.min(this.minTabIndex, inputField.tabIndex);
        this.maintainTabIndex[pageIndex.toString()] = this.maxTabIndex;
        this.maintanMinTabindex[pageIndex.toString()] = this.minTabIndex;
    }
    private checkIsRequiredField(data: PdfRenderedFields, inputField: HTMLInputElement): void {
        if (data.IsRequired) {
            inputField.required = true;
            inputField.style.border = '1px solid red';
        } else {
            const borderColor: FormFieldColor = data.BorderColor as FormFieldColor;
            inputField.style.border = data.BorderWidth.toString();
            inputField.style.borderColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
        }
        if (inputField.type !== 'checkbox' && inputField.type !== 'radio') {
            const borderStyle: number = data.BorderStyle;
            this.addBorderStylePropety(borderStyle, inputField);
        }
        const isComposite: boolean = !!(inputField as HTMLElement).classList
            && (inputField as HTMLElement).classList.contains('e-pv-datetime-composite');
        if (isComposite && !data.IsRequired) {
            // Revert the style changes applied to inputField
            inputField.style.border = 'none';
            inputField.style.borderStyle = 'none';
            const textInput: HTMLInputElement = ((inputField as HTMLElement).querySelector('.e-pv-formfield-input') as HTMLInputElement);
            const pickerBtn: HTMLButtonElement = ((inputField as HTMLElement).querySelector('.e-pv-datetime-picker-btn') as HTMLButtonElement);
            textInput.style.border = `${data.BorderWidth}`;
            textInput.style.borderWidth = 'revert';
            pickerBtn.style.borderWidth = 'revert';
            pickerBtn.style.border = `${data.BorderWidth}`;
            textInput.style.borderColor = 'rgba(' + (data.BorderColor as FormFieldColor).R + ',' + (data.BorderColor as FormFieldColor).G + ',' + (data.BorderColor as FormFieldColor) + ',' + 1 + ')';
            pickerBtn.style.borderColor = 'rgba(' + (data.BorderColor as FormFieldColor) + ',' + (data.BorderColor as FormFieldColor) + ',' + (data.BorderColor as FormFieldColor) + ',' + 1 + ')';
            this.addBorderStylePropety(data.BorderStyle, textInput);
            this.addBorderStylePropety(data.BorderStyle, pickerBtn as HTMLInputElement);
            textInput.style.borderRightStyle = 'none';
            pickerBtn.style.borderLeftStyle = 'none';
        }
    }
    private applyDefaultColor(inputField: HTMLInputElement): void {
        const isComposite: boolean = !!(inputField as HTMLElement).classList
            && (inputField as HTMLElement).classList.contains('e-pv-datetime-composite');
        const chromeTarget: HTMLElement = isComposite ? (inputField as HTMLElement) : inputField;
        const textInput: HTMLInputElement = isComposite
            ? ((inputField as HTMLElement).querySelector('.e-pv-formfield-input') as HTMLInputElement) || inputField
            : inputField;
        if ((!isComposite && inputField.type !== 'button') || isComposite) {
            if (chromeTarget.style.backgroundColor === 'rgba(255, 255, 255, 0.2)' || chromeTarget.style.backgroundColor === 'rgba(0, 0, 0, 0.2)' || chromeTarget.style.backgroundColor === 'rgba(218, 234, 247, 0.2)') {
                chromeTarget.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
            }
        }
        if (textInput.style.color === 'rgba(255, 255, 255, 0.2)') {
            textInput.style.color = 'black';
        }
    }
    private addAlignmentPropety(data: PdfRenderedFields, inputField: HTMLElement): void {
        const alignment: number = data.Alignment;
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
    private addBorderStylePropety(borderStyle: number, inputField: HTMLInputElement): void {
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
    private createRadioBoxField(data: PdfRenderedFields, pageIndex: number, type: string, printContainer?: HTMLElement): HTMLInputElement {
        const inputField: HTMLInputElement = document.createElement('input');
        inputField.type = type;
        if (data.Selected) {
            inputField.checked = true;
        }
        else if (type === 'checkbox' && !printContainer){
            inputField.style.webkitAppearance = 'none';
        }
        if (type === 'checkbox') {
            inputField.name = data.GroupName;
        } else {
            inputField.setAttribute('data-name', data.GroupName);
        }
        inputField.value = data.Value;
        return inputField;
    }
    private createDropDownField(data: PdfRenderedFields, pageIndex: number, index: number, printContainer: HTMLElement): HTMLSelectElement {
        let inputField: HTMLSelectElement = document.createElement('select');
        const childItems: TextItem[] | object[] = (data.Name === 'DropDown') ? data['ComboBoxList'] : data['TextList'];
        if (data.Selected && !printContainer) {
            const previousField: HTMLElement = document.getElementById('editableDropdown' + pageIndex + '_' + index);
            if (previousField) {
                previousField.remove();
            }
            const inputFields: HTMLInputElement = document.createElement('input');
            inputFields.id = 'editableDropdown' + pageIndex + '_' + index;
            inputFields.setAttribute('list', this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
            const bounds: IFormFieldBound = data['LineBounds'];
            const font: FormFieldFont = data['Font'];
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
            (inputField as HTMLElement) = document.createElement('DATALIST');
        }
        for (let j: number = 0; j < childItems.length; j++) {
            const option: HTMLOptionElement = document.createElement('option');
            option.className = 'e-dropdownSelect';
            // Normalize inner values so the rendered option never shows "undefined".
            const itemName: string = !isNullOrUndefined((childItems[parseInt(j.toString(), 10)] as TextItem).itemName) ?
                (childItems[parseInt(j.toString(), 10)] as TextItem).itemName :
                !isNullOrUndefined((childItems[parseInt(j.toString(), 10)] as unknown as { ItemName: string }).ItemName) ?
                    (childItems[parseInt(j.toString(), 10)] as unknown as { ItemName: string }).ItemName : '';
            const itemValue: string = !isNullOrUndefined((childItems[parseInt(j.toString(), 10)] as TextItem).itemValue) ?
                (childItems[parseInt(j.toString(), 10)] as TextItem).itemValue :
                !isNullOrUndefined((childItems[parseInt(j.toString(), 10)] as unknown as { ItemValue: string }).ItemValue) ?
                    (childItems[parseInt(j.toString(), 10)] as unknown as { ItemValue: string }).ItemValue : '';
            if (data.SelectedValue === itemName || data.selectedIndex === j) {
                option.selected = true;
            } else {
                option.selected = false;
            }
            option.value = itemValue;
            option.innerHTML = itemName;
            inputField.appendChild(option);
        }
        inputField.name = data.Text ? data.Text : data.FieldName;
        return inputField;
    }
    private createListBoxField(data: PdfRenderedFields, pageIndex: number): HTMLSelectElement {
        const inputField: HTMLSelectElement = document.createElement('select');
        const childItems: TextItem[] = data['TextList'];
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
            const item: TextItem = childItems[parseInt(j.toString(), 10)];
            option.innerHTML = typeof item === 'string' ? item : (item.itemName || (item as unknown as { ItemName: string }).ItemName || '');
            inputField.appendChild(option);
        }
        inputField.name = data.Text;
        return inputField;
    }

    private createSignatureField(data: PdfRenderedFields, pageIndex: number, index: number, printContainer: HTMLElement,
                                 count?: number): HTMLInputElement {
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
        const span: HTMLSpanElement = document.createElement('span');
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        const bounds: IFormFieldBound = data['LineBounds'];
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
        const annotBounds: PdfBoundsModel = { left: left, top: top, width: width, height: height };
        const fieldBounds: PdfBoundsModel = this.getBounds(annotBounds, pageIndex);
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
                this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity.toString() : '1') : '1';
        if (!isNullOrUndefined(textLayer)){
            textLayer.appendChild(span);
        }
        this.addSignaturePath(data, count);
        return inputField;
    }

    private addSignaturePath(signData: PdfRenderedFields, count?: number): boolean {
        this.isSignatureField = false;
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (data) {
            let formFieldsData: any = JSON.parse(data);
            if (typeof formFieldsData === 'string') {
                formFieldsData = JSON.parse(formFieldsData);
            }
            for (let m: number = 0; m < formFieldsData.length; m++) {
                const currentData: PdfRenderedFields = formFieldsData[parseInt(m.toString(), 10)];
                if (currentData.ActualFieldName === null && count && (currentData.Name === 'ink' || currentData.Name === 'SignatureField' || currentData.Name === 'SignatureImage' || currentData.Name === 'SignatureText') && (this.pdfViewer.formDesigner ? ((currentData.FieldName.split('_')[0] ) === (signData.ActualFieldName) || (currentData.FieldName.split('_')[0]) === (signData.FieldName)) : ((currentData.FieldName.split('_')[0] === (signData.FieldName )) && !isNullOrUndefined(signData.ActualFieldName)) && currentData.Value && currentData.Value !== '')) {
                    if (signData.PageIndex === currentData.PageIndex) {
                        signData.Value = currentData.Value;
                        signData.FontFamily = currentData.FontFamily;
                        signData.FontSize = currentData.FontSize;
                        this.isSignatureField = true;
                        signData.Bounds = currentData.LineBounds;
                    }
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

    private getBounds(bound: PdfBoundsModel, pageIndex: number, rotation?: number, isFieldRotated?: boolean,
                      data?: { pageRotation: number[]; pageSizes: ISize[] }): PdfBoundsModel {
        let pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        let pageRotation: number = rotation;
        if (pageDetails) {
            pageRotation = pageDetails.rotation;
        }
        if (!pageDetails && data && data.pageSizes && data.pageSizes[parseInt(pageIndex.toString(), 10)]) {
            const size: ISize = data.pageSizes[parseInt(pageIndex.toString(), 10)];
            pageDetails = {
                width: size.width,
                height: size.height,
                rotation: data.pageRotation[parseInt(pageIndex.toString(), 10)],
                top: this.pdfViewerBase.pageGap
            };
            pageRotation = data.pageRotation[parseInt(pageIndex.toString(), 10)];
        }
        let bounds: PdfBoundsModel;
        if (pageRotation > 0) {
            bounds = this.getBoundsPosition(pageRotation, bound, pageDetails, isFieldRotated);
        } else {
            bounds = this.getBoundsPosition(pageRotation, bound, pageDetails, isFieldRotated);
        }
        return bounds;
    }

    private getBoundsPosition(rotation: number, bound: PdfBoundsModel, pageDetails: ISize, isFieldRotated?: boolean): PdfBoundsModel {
        let bounds: PdfBoundsModel;
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

    private applyPosition(inputField: HTMLInputElement | HTMLDivElement | HTMLElement | HTMLSelectElement, bounds: IFormFieldBound,
                          font: FormFieldFont, pageIndex?: number, rotation?: number, isFieldRotated?: boolean): void {
        if (bounds) {
            const left: number = this.ConvertPointToPixel(bounds.X);
            const top: number = this.ConvertPointToPixel(bounds.Y);
            const width: number = this.ConvertPointToPixel(bounds.Width);
            const height: number = this.ConvertPointToPixel(bounds.Height);
            let fontHeight: number = 0;
            const fieldBounds: PdfBoundsModel = { left: left, top: top, width: width, height: height };
            const annotBounds: PdfBoundsModel = this.getBounds(fieldBounds, pageIndex, rotation, isFieldRotated);
            if (!isNullOrUndefined(font) && font.Height) {
                inputField.style.fontFamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                // Underline/strikeout from FontStyle dict (parsed on load) for text and button fields.
                if (font.Underline && font.Strikeout) {
                    inputField.style.textDecoration = 'underline line-through';
                } else if (font.Underline) {
                    inputField.style.textDecoration = 'underline';
                } else if (font.Strikeout) {
                    inputField.style.textDecoration = 'line-through';
                }
                fontHeight = this.ConvertPointToPixel(font.Size);
            }
            this.pdfViewerBase.setStyleToTextDiv(inputField, annotBounds.left, annotBounds.top, fontHeight, annotBounds.width,
                                                 annotBounds.height, false);
            const isDateTimeComposite: boolean = !!(inputField.classList &&
                inputField.classList.contains('e-pv-datetime-composite'));
            if (isDateTimeComposite) {
                // Font metrics are applied to the wrapper above. Copy them onto the
                // inner text input so fill-mode DateTime text matches the field font.
                const textAppearance: HTMLElement = inputField.querySelector('.e-pv-formfield-input') as HTMLElement;
                if (textAppearance) {
                    if (inputField.style.fontFamily) {
                        textAppearance.style.fontFamily = inputField.style.fontFamily;
                    }
                    if (inputField.style.fontStyle) {
                        textAppearance.style.fontStyle = inputField.style.fontStyle;
                    }
                    if (inputField.style.fontWeight) {
                        textAppearance.style.fontWeight = inputField.style.fontWeight;
                    }
                    if (inputField.style.fontSize) {
                        textAppearance.style.fontSize = inputField.style.fontSize;
                    }
                }
                const zoomValue: number = this.pdfViewerBase.getZoomFactor();
                const fieldHeightPx: number = annotBounds.height * zoomValue;
                this.pdfViewerBase.scaleDateTimePickerIcon(inputField as HTMLElement, fieldHeightPx);
            }
        }
    }

    private renderExistingAnnnot(data: PdfRenderedFields, index: number, printContainer: HTMLElement, isFieldRotated?: boolean): void {
        if (!printContainer) {
            let bounds: IFormFieldBound;
            if (data.Bounds && data.Name !== 'ink') {
                bounds = data.Bounds;
            } else {
                bounds = data.LineBounds;
            }
            let currentLeft: number;
            let currentTop: number;
            let currentWidth: number;
            let currentHeight: number;
            if ((bounds as PdfBoundsModel).x || (bounds as PdfBoundsModel).y || (bounds as PdfBoundsModel).width
                || (bounds as PdfBoundsModel).height) {
                currentLeft = (bounds as PdfBoundsModel).x;
                currentTop = (bounds as PdfBoundsModel).y;
                currentWidth = (bounds as PdfBoundsModel).width;
                currentHeight = (bounds as PdfBoundsModel).height;
            } else {
                currentLeft = this.ConvertPointToPixel(bounds.X);
                currentTop = this.ConvertPointToPixel(bounds.Y);
                currentWidth = this.ConvertPointToPixel(bounds.Width);
                currentHeight = this.ConvertPointToPixel(bounds.Height);
            }
            let bound: PdfBoundsModel;
            let newBounds: PdfBoundsModel;
            const currentPage: number = data['PageIndex'];
            if (this.pdfViewerBase.clientSideRendering && (data.Rotation === 1 || data.Rotation === 3)
                && (this.pdfViewerBase.isSignatureImageData(data.Value))) {
                bound = { left: currentLeft, top: currentTop, width: currentHeight, height: currentWidth };
                newBounds = this.updateSignatureImageBounds(bound, currentPage);
            }
            else{
                bound = { left: currentLeft, top: currentTop, width: currentWidth, height: currentHeight };
                newBounds = this.updateSignatureBounds(bound, currentPage, isFieldRotated);
            }
            let annot: PdfAnnotationBaseModel;
            const fontFamily: string = data.FontFamily ? data.FontFamily : (data as unknown as IFormField).fontFamily;
            if ((this.pdfViewerBase.isSignatureImageData(data.Value))) {
                annot = {
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: newBounds, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: isFieldRotated || (this.pdfViewerBase.clientSideRendering && (data.Rotation === 1 || data.Rotation === 2 || data.Rotation === 3)) ? this.getAngle(currentPage) : 0, annotName: 'SignatureField', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            } else if (this.pdfViewerBase.isSignaturePathData(data.Value)) {
                let bound: PdfBoundsModel = newBounds;
                const tempBounds: PdfBoundsModel = { left: newBounds.x, top: newBounds.y, width: newBounds.width,
                    height: newBounds.height };
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
                annot.fontSize = data.FontSize ? data.FontSize : (data as unknown as IFormField).fontSize;
            }
            if ((data.Name === 'SignatureField' || data.Name === 'InitialField') && !isNullOrUndefined((data as unknown as IFormField).id)) {
                const elementId: string = (data as unknown as IFormField).id;
                const signatureFieldElement: HTMLElement = document.getElementById(elementId + '_content_html_element');
                const signatureField: PdfAnnotationBase = (this.pdfViewer.nameTable[`${elementId}`]  as PdfAnnotationBase);
                if (signatureField) {
                    annot.id = signatureField.id + '_content';
                    const obj: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                    signatureField.wrapper.children.push(obj.wrapper);
                }
                if (!isNullOrUndefined(signatureFieldElement) && this.isSignatureField) {
                    const inputField: Element = signatureFieldElement.children[0].children[0];
                    (inputField as HTMLElement).style.pointerEvents = 'none';
                    inputField.className = 'e-pdfviewer-signatureformfields-signature';
                    inputField.parentElement.style.pointerEvents = 'none';
                }
                else if (!isNullOrUndefined(signatureFieldElement) && data.Value){
                    const inputField: Element = signatureFieldElement.children[0].children[0];
                    (inputField as HTMLElement).style.pointerEvents = 'none';
                    inputField.className = 'e-pdfviewer-signatureformfields-signature';
                    inputField.parentElement.style.pointerEvents = 'none';
                }
            } else {
                const target: HTMLElement = document.getElementById(annot.id);
                if (target && (target as HTMLElement).classList.contains('e-pdfviewer-signatureformfields-signature')) {
                    this.pdfViewer.annotation.deleteAnnotationById(annot.id);
                }
                this.pdfViewer.add(annot as PdfAnnotationBase);
                if (target) {
                    if (this.pdfViewerBase.signatureModule) {
                        this.pdfViewerBase.signatureModule.updateDataInSession(target, annot.data, annot.bounds);
                    }
                    this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType,
                                                    annot.bounds, annot.opacity, annot.strokeColor, annot.thickness, annot.data);
                }
            }
            data.Bounds = annot.bounds as IFormFieldBound;
            if (this.pdfViewer.formDesignerModule) {
                const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                annot.bounds = {x: currentLeft * zoomvalue, y: currentTop * zoomvalue, width: currentWidth * zoomvalue,
                    height : currentHeight * zoomvalue };
                if (this.pdfViewerBase.signatureModule) {
                    this.pdfViewerBase.signatureModule.updateSignatureDataInSession(annot, annot.id);
                }
            }
            const canvass: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', currentPage);
            const obj: PdfFormFieldBaseModel[] = this.pdfViewer.formFieldCollection.filter((field: PdfFormFieldBaseModel) => { return annot.id.split('_')[0] === field.id; });
            if (obj.length > 0 && obj[0].visibility !== 'hidden' || !this.pdfViewer.formDesignerModule) {
                this.pdfViewer.renderDrawing(canvass as HTMLCanvasElement, currentPage);
            }
        }
    }

    private updateSignatureImageBounds(bound: PdfBoundsModel, pageIndex: number): PdfBoundsModel {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { x: pageDetails.width - bound.top - bound.height - (bound.width / 2 - bound.height / 2),
                    y: bound.left - bound.width + (bound.width / 2 + bound.height / 2), width: bound.height, height: bound.width };
            }
            else if (pageDetails.rotation === 3) {
                return { x: bound.top + bound.width - (bound.width / 2 + bound.height / 2),
                    y: (pageDetails.height - bound.left - bound.width + (bound.width / 2 - bound.height / 2)),
                    width: bound.height, height: bound.width };
            } else {
                return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
            }
        }
        return { x: bound.left, y: bound.top, width: bound.width, height: bound.height };
    }
    /**
     * @param {PdfBoundsModel} bound - It describes about the bound
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isFieldRotated - It describes about the isFieldRotated
     * @private
     * @returns {{ x: number, y: number, width: number, height: number }} - { x: number, y: number, width: number, height: number }
     */
    public updateSignatureBounds(bound: PdfBoundsModel, pageIndex: number, isFieldRotated : boolean): { x: number, y: number, width: number,
        height: number } {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
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
                    this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget);
                }
            } else if (currentData.type === 'DropDown') {
                this.currentTarget.value = currentData.value;
            } else if (currentData.type === 'CheckBox') {
                this.currentTarget.checked = currentData.value;
            } else if (currentData.type === 'SignatureField') {
                const annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable[currentData.id]  as PdfAnnotationBaseModel);
                if (annotation) {
                    if (this.currentTarget && this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature') {
                        this.currentTarget.className = 'e-pdfviewer-signatureformfields';
                        this.currentTarget.style.pointerEvents = '';
                        this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget, '');
                    }
                    this.pdfViewer.remove(annotation);
                    this.pdfViewer.renderDrawing();
                }
            }
            if (currentData.type !== 'RadioButton' && currentData.type !== 'SignatureField') {
                this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clearFormFieldStorage(): void {
        const sessionSize: number = this.pdfViewerBase.sessionStorageManager.getWindowSessionStorageSize();
        let maxSessionSize: number = 4500;
        if (this.pdfViewerBase.isDeviceiOS || this.pdfViewerBase.isMacSafari){
            maxSessionSize = 2000;
        }
        if (this.pdfViewerBase.isStorageExceed) {
            const storageLength: number = this.pdfViewerBase.sessionStorageManager.getSessionLength();
            const formFieldsList: string[] = [];
            for (let i: number = 0; i < storageLength; i++) {
                if (this.pdfViewerBase.sessionStorageManager.getKey(i) && this.pdfViewerBase.sessionStorageManager.getKey(i).split('_')[3]) {
                    if (this.pdfViewerBase.sessionStorageManager.getKey(i).split('_')[3] === 'formfields') {
                        this.pdfViewerBase.formFieldStorage[this.pdfViewerBase.sessionStorageManager.getKey(i)] =
                        this.pdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.sessionStorageManager.getKey(i));
                        formFieldsList.push(this.pdfViewerBase.sessionStorageManager.getKey(i));
                    }
                    else if (this.pdfViewerBase.sessionStorageManager.getKey(i).split('_')[3] === 'formDesigner') {
                        this.pdfViewerBase.formFieldStorage[this.pdfViewerBase.sessionStorageManager.getKey(i)] =
                        this.pdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.sessionStorageManager.getKey(i));
                        formFieldsList.push(this.pdfViewerBase.sessionStorageManager.getKey(i));
                    }
                }
            }
            if (formFieldsList) {
                for (let i: number = 0; i < formFieldsList.length; i++) {
                    this.pdfViewerBase.sessionStorageManager.removeItem(formFieldsList[parseInt(i.toString(), 10)]);
                }
            }
        }
    }

    /**
     * @param {any} formField - It describes about the form field
     * @deprecated - This API is obsolete. Use `clearFormField` instead.
     * @returns {void}
     */
    public clearFormFields(formField?: any): void {
        let data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (isNullOrUndefined(data)) {
            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        }
        if (data) {
            let formFieldsData: any;
            if (formField) {
                formFieldsData = [formField];
            } else {
                formFieldsData = JSON.parse(data);
            }
            let isFirstRadio: boolean = true;
            for (let m: number = 0; m < formFieldsData.length; m++) {
                const currentData: PdfRenderedFields = formFieldsData[parseInt(m.toString(), 10)];
                if (formField) {
                    currentData.uniqueID = formField.id;
                    currentData.Name = formField.type;
                }
                this.currentTarget = document.getElementById(currentData.uniqueID);
                if (currentData.Name === 'Textbox' || currentData.Name === 'PasswordField') {
                    this.currentTarget.value = '';
                } else if (currentData.Name === 'RadioButton') {
                    if (isFirstRadio) {
                        this.currentTarget.checked = true;
                        this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget);
                        isFirstRadio = false;
                    }
                } else if (currentData.Name === 'DropDown' || currentData.Name === 'DropdownList' || currentData.Name === 'ListBox') {
                    this.currentTarget.options.length = 0;
                    const selectedItem: PdfAnnotationBaseModel = (this.pdfViewer.nameTable[this.currentTarget.id.split('_')[0]]  as PdfAnnotationBaseModel);
                    (selectedItem as PdfFormFieldBaseModel).options = [];
                } else if (currentData.Name === 'CheckBox') {
                    this.currentTarget.checked = false;
                } else if (currentData.Name === 'SignatureField' || currentData.Name === 'InitialField') {
                    let annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable[currentData.uniqueID]   as PdfAnnotationBaseModel);
                    if (!isNullOrUndefined(annotation) && (annotation as PdfAnnotationBaseModel & {propName?: string}).propName !== 'annotations') {
                        annotation = this.pdfViewer.nameTable[currentData.uniqueID + '_content'];
                    }
                    if (annotation) {
                        if (this.currentTarget && this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature') {
                            this.currentTarget.className = 'e-pdfviewer-signatureformfields';
                            this.currentTarget.style.pointerEvents = '';
                            this.currentTarget.parentElement.style.pointerEvents = '';
                            this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget, '');
                            if (formField) {
                                formField.value = '';
                                formField.signatureType = [formField.signatureType] as unknown as SignatureType[];
                                formField.signatureType[0] = '' as unknown as SignatureType;
                            }
                        }
                        this.pdfViewer.annotation.deleteAnnotationById(annotation.id);
                        this.currentTarget = null;
                    }
                }
                if (currentData.Name !== 'SignatureField' && currentData.Name !== 'ink' && currentData.Name !== 'RadioButton') {
                    this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget);
                }
            }
        }
    }

    /**
     * @param {FormFieldModel} formField - It describes about the form field
     *
     * @returns {void}
     */
    public clearFormField(formField?: FormFieldModel): void {
        let data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (isNullOrUndefined(data)) {
            data = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        }
        if (data) {
            let formFieldsData: any;
            if (formField) {
                formFieldsData = [formField];
            } else {
                formFieldsData = JSON.parse(data);
            }
            let isFirstRadio: boolean = true;
            for (let m: number = 0; m < formFieldsData.length; m++) {
                const currentData: PdfRenderedFields = formFieldsData[parseInt(m.toString(), 10)];
                if (formField) {
                    currentData.uniqueID = formField.id;
                    currentData.Name = formField.type;
                }
                this.currentTarget = document.getElementById(currentData.uniqueID);
                if (currentData.Name === 'Textbox' || currentData.Name === 'PasswordField') {
                    this.currentTarget.value = '';
                } else if (currentData.Name === 'RadioButton') {
                    if (isFirstRadio) {
                        this.currentTarget.checked = true;
                        this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget);
                        isFirstRadio = false;
                    }
                } else if (currentData.Name === 'DropDown' || currentData.Name === 'DropdownList' || currentData.Name === 'ListBox') {
                    this.currentTarget.options.length = 0;
                    const selectedItem: PdfAnnotationBaseModel = (this.pdfViewer.nameTable[this.currentTarget.id.split('_')[0]]  as PdfAnnotationBaseModel);
                    (selectedItem as PdfFormFieldBaseModel).options = [];
                } else if (currentData.Name === 'CheckBox') {
                    this.currentTarget.checked = false;
                } else if (currentData.Name === 'SignatureField' || currentData.Name === 'InitialField') {
                    let annotation: PdfAnnotationBaseModel = (this.pdfViewer.nameTable[currentData.uniqueID]   as PdfAnnotationBaseModel);
                    if (!isNullOrUndefined(annotation) && (annotation as PdfAnnotationBaseModel & {propName?: string}).propName !== 'annotations') {
                        annotation = this.pdfViewer.nameTable[currentData.uniqueID + '_content'];
                    }
                    if (annotation) {
                        if (this.currentTarget && this.currentTarget.className === 'e-pdfviewer-signatureformfields-signature') {
                            this.currentTarget.className = 'e-pdfviewer-signatureformfields';
                            this.currentTarget.style.pointerEvents = '';
                            this.currentTarget.parentElement.style.pointerEvents = '';
                            this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget, '');
                            if (formField) {
                                formField.value = '';
                                formField.signatureType = [formField.signatureType] as unknown as SignatureType[];
                                formField.signatureType[0] = '' as unknown as SignatureType;
                            }
                        }
                        this.pdfViewer.annotation.deleteAnnotationById(annotation.id);
                        this.currentTarget = null;
                    }
                }
                if (currentData.Name !== 'SignatureField' && currentData.Name !== 'ink' && currentData.Name !== 'RadioButton') {
                    this.pdfViewerBase.signatureModule.updateDataInSession(this.currentTarget);
                }
            }
        }
    }

    /**
     * @param {number} number - It describes about the number
     * @private
     * @returns {number} - number
     */
    public ConvertPointToPixel(number: number): number {
        return (number * (96 / 72));
    }

    /**
     * Normalizes bounds object to the format expected by addFormField/updateFormField.
     * Handles both lowercase (x, y, width, height) and uppercase (X, Y, Width, Height) property names.
     *
     * @private
     * @param {IFormFieldBound} bounds - The bounds object to normalize (can be any format)
     * @returns {IFormFieldBound} - Normalized bounds object with uppercase properties, or null if invalid
     */
    public normalizeBounds(bounds: IFormFieldBound): IFormFieldBound {
        if (!bounds) {
            return null;
        }
        // Handle both lowercase and uppercase property names
        const x: number = (bounds as PdfBoundsModel).x ? (bounds as PdfBoundsModel).x : bounds.X ? bounds.X : 0;
        const y: number = (bounds as PdfBoundsModel).y ? (bounds as PdfBoundsModel).y : bounds.Y ? bounds.Y : 0;
        const width: number = (bounds as PdfBoundsModel).width ? (bounds as PdfBoundsModel).width : bounds.Width ? bounds.Width : 100;
        const height: number = (bounds as PdfBoundsModel).height ? (bounds as PdfBoundsModel).height : bounds.Height ? bounds.Height : 20;
        // Validate that we have reasonable values
        if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
            console.warn('[FormDesigner] Invalid bounds values:', bounds);
            return null;
        }
        return {
            X: x,
            Y: y,
            Width: width,
            Height: height
        };
    }

    /**
     * Imports remote form field changes and applies them to the PDF viewer.
     * Handles add, update, and delete operations for form fields received from collaboration server.
     *
     * @param {string} formFieldsData - The user should provide a JSON string containing created, updated, and deleted form field changes.
     * @private
     * @returns {void} - Imports and applies the form field changes.
     */
    public importFormField(formFieldsData: FormFieldActionData): void {
        if (this.pdfViewer.annotation && formFieldsData) {
            this.pdfViewer.annotation.redoCollection = [];
            this.pdfViewer.annotation.actionCollection = [];
            this.pdfViewer.annotation.updateToolbar();
        }
        if (this.pdfViewer.formDesigner) {
            const data: FormFieldChanges = JSON.parse(formFieldsData.changes);
            if (!data || !data.created) {
                console.warn('[FormDesigner] importRemoteFormFields: No data or changes object');
                return;
            }
            try {
                const changes: FormFieldChanges = data;
                this.pdfViewer.formFieldsModule.isCollaborativeImport = true;
                // Handle created form fields
                if (changes.created && Array.isArray(changes.created)) {
                    for (const formField of changes.created) {
                        this.pdfViewer.formDesigner.addRemoteFormField(formField);
                    }
                }
                // Handle updated form fields
                if (changes.updated && Array.isArray(changes.updated)) {
                    for (const update of changes.updated) {
                        this.pdfViewer.formDesigner.updateRemoteFormField(update);
                    }
                }
                // Handle deleted form fields
                if (changes.deleted && Array.isArray(changes.deleted)) {
                    for (const formField of changes.deleted) {
                        this.pdfViewer.formDesigner.deleteRemoteFormField(formField);
                    }
                }
            } catch (error) {
                console.error('[FormDesigner] Error applying remote form fields:', error);
            } finally {
                this.pdfViewer.formFieldsModule.isCollaborativeImport = false;
            }
        } else {
            this.pdfViewer.formFieldsModule.isCollaborativeImport = true;
            this.importFormFieldsAsJson(formFieldsData.jsonData);
            this.pdfViewer.formFieldsModule.isCollaborativeImport = false;
        }
    }

    /**
     * Builds the form field details payload for a single operation.
     * Extracts and organizes form field changes without making the API call.
     *
     * @param {FormFieldModel} formField - The user should provide form field change information.
     * @param {string} action - The user should provide the action type (add, modify, or delete).
     * @private
     * @returns {string} - Serialized JSON string representing the form field change.
     */
    public exportFormField(formField: FormFieldModel, action?: EditAction): string {
        if (this.pdfViewer.formDesignerModule) {
            const changes: {
                created: FormFieldModel[];
                updated: FormFieldModel[];
                deleted: FormFieldModel[];
            } = {
                created: [],
                updated: [],
                deleted: []
            };
            const sanitizeFormField: FormFieldModel = this.sanitizeFormField(formField);
            if (!isNullOrUndefined(action)) {
                if (action === EditAction.Add) {
                    changes.created.push(sanitizeFormField);
                } else if (action === EditAction.Modify) {
                    changes.updated.push(sanitizeFormField);
                } else if (action === EditAction.Delete) {
                    changes.deleted.push(sanitizeFormField);
                }
                return JSON.stringify(changes);
            } else {
                return JSON.stringify(sanitizeFormField);
            }
        } else {
            const field: string = this.exportFormFieldAsJson(formField);
            return JSON.stringify(field);
        }
    }

    /**
     * Sanitizes a form field object by extracting only serializable properties.
     * Removes circular references and internal properties that cannot be JSON serialized.
     *
     * @param {FormFieldModel}formField - The form field object to sanitize
     * @returns {FormFieldModel} A clean object with only serializable properties
     */
    private sanitizeFormField(formField: FormFieldModel): FormFieldModel {
        if (!formField) {
            return null;
        }
        // Use FormDesigner's normalizeBounds to ensure bounds are properly extracted with fallback values
        const normalizedBounds: IFormFieldBound = this.normalizeBounds(formField.bounds);
        const type: string = (formField as unknown as PdfFormFieldBaseModel).formFieldAnnotationType ? (
            formField as unknown as PdfFormFieldBaseModel).formFieldAnnotationType : formField.type;
        const fieldId: string = formField.id && formField.id.indexOf('_content') !== -1 ? formField.id.split('_')[0] : formField.id;
        const sanitized: FormFieldModel = {
            id: fieldId,
            name: formField.name,
            type: type as FormFieldType,
            value: formField.value,
            pageNumber: formField.pageNumber || formField.pageIndex + 1,
            pageIndex: formField.pageIndex,
            bounds: (normalizedBounds ? {
                x: normalizedBounds.X,
                y: normalizedBounds.Y,
                width: normalizedBounds.Width,
                height: normalizedBounds.Height
            } : {
                x: 0,
                y: 0,
                width: 100,
                height: 20
            }) as unknown as IFormFieldBound,
            fontFamily: formField.fontFamily,
            fontSize: formField.fontSize,
            fontStyle: formField.fontStyle,
            color: formField.color,
            backgroundColor: typeof formField.backgroundColor === 'object' ? this.rgbaObjectToHex(formField.backgroundColor) : formField.backgroundColor,
            borderColor: typeof formField.borderColor === 'object' ? this.rgbaObjectToHex(formField.borderColor) : formField.borderColor,
            thickness: formField.thickness,
            alignment: formField.alignment,
            visibility: formField.visibility,
            isRequired: formField.isRequired,
            isPrint: formField.isPrint,
            tooltip: formField.tooltip,
            customData: formField.customData
        };
        (sanitized as unknown as PdfFormFieldBaseModel).formFieldAnnotationType = type as FormFieldAnnotationType;
        (sanitized as unknown as PdfFormFieldBaseModel).isReadonly = formField.isReadOnly;
        (sanitized as unknown as PdfFormFieldBaseModel).font = {
            isBold: (formField as unknown as PdfFormFieldBaseModel).font ?
                (formField as unknown as PdfFormFieldBaseModel).font.isBold : false,
            isItalic: (formField as unknown as PdfFormFieldBaseModel).font ?
                (formField as unknown as PdfFormFieldBaseModel).font.isItalic : false,
            isStrikeout: (formField as unknown as PdfFormFieldBaseModel).font ?
                (formField as unknown as PdfFormFieldBaseModel).font.isStrikeout : false,
            isUnderline: (formField as unknown as PdfFormFieldBaseModel).font ?
                (formField as unknown as PdfFormFieldBaseModel).font.isUnderline : false
        };
        (sanitized as unknown as IFormField).fontColor = formField.color as unknown as RGBA;
        // Add type-specific properties
        if (type === 'Textbox') {
            sanitized.isMultiline = formField.isMultiline || false;
            sanitized.maxLength = formField.maxLength;
            sanitized.insertSpaces = formField.insertSpaces;
        } else if (type === 'Password' || type === 'PasswordField') {
            sanitized.maxLength = formField.maxLength;
            sanitized.type = 'Password';
        } else if (type === 'ButtonField' || type === 'Button') {
            sanitized.type = 'ButtonField';
            sanitized.isPrint = formField.isPrint !== false;
            // I4: appearance properties must round-trip through sanitization so the
            // downloaded document preserves border, color, font, alignment, etc.
            if (!isNullOrUndefined(formField.fontFamily)) {
                sanitized.fontFamily = formField.fontFamily;
            }
            if (!isNullOrUndefined(formField.fontSize)) {
                sanitized.fontSize = formField.fontSize;
            }
            if (!isNullOrUndefined(formField.fontStyle)) {
                sanitized.fontStyle = formField.fontStyle;
            }
            if (!isNullOrUndefined(formField.color)) {
                sanitized.color = formField.color;
            }
            if (!isNullOrUndefined(formField.backgroundColor)) {
                sanitized.backgroundColor = formField.backgroundColor;
            }
            if (!isNullOrUndefined(formField.alignment)) {
                sanitized.alignment = formField.alignment;
            }
            if (!isNullOrUndefined(formField.borderColor)) {
                sanitized.borderColor = formField.borderColor;
            }
            if (!isNullOrUndefined(formField.tooltip)) {
                sanitized.tooltip = formField.tooltip;
            }
            if (!isNullOrUndefined(formField.customData)) {
                sanitized.customData = formField.customData;
            }
            const rawActions: ActionsSettingsModel = formField.actions;
            if (!isNullOrUndefined(rawActions)) {
                sanitized.actions = this.sanitizeButtonActions(rawActions);
            }
        } else if (type === 'DropdownList' || type === 'ListBox') {
            sanitized.options = (formField.options ? formField.options : (formField as unknown as IFormField).option) || [];
            sanitized.type = sanitized.type !== 'DropdownList' as FormFieldType ? sanitized.type : 'DropDown';
            sanitized.selectedIndex = formField.selectedIndex;
            (sanitized as unknown as IFormField & {selectedValue: string}).selectedValue = (formField as unknown as IFormField & {selectedValue: string}).selectedValue || '';
        } else if (type === 'Checkbox') {
            sanitized.isChecked = formField.isChecked || false;
            sanitized.type = 'CheckBox';
        } else if (type === 'RadioButton') {
            sanitized.isSelected = formField.isSelected || false;
            (sanitized as unknown as IFormField).radiobuttonItem = (formField as unknown as IFormField).radiobuttonItem;
        } else if (type === 'SignatureField' || type === 'InitialField') {
            sanitized.signatureType = formField.signatureType;
            (sanitized as unknown as IFormField).lineBound = (formField as unknown as IFormField).lineBound;
            (sanitized as unknown as IFormField).signatureBound = (formField as unknown as IFormField).signatureBound;
            sanitized.signatureIndicatorSettings = formField.signatureIndicatorSettings;
        }
        return sanitized;
    }

    /**
     * The updateFormFieldsData method updates a form field value based on the specified field name.
     *
     * @param {string} fieldName - The form field name
     * @param {string} fieldValue - The form field value
     * @param {any} data - field
     * @private
     * @returns {any} - upated field value
     */
    public updateFormFieldsData(fieldName: string, fieldValue: string, data: any): any {
        if (data) {
            const field: any = data.find(
                (item: any) => item.ActualFieldName === fieldName
            );
            if (!field) {
                return;
            }
            field.Value = fieldValue;
            switch (field.Name) {
            case 'Textbox':
            case 'Password': {
                field.Text = fieldValue;
                this.paintAfDisplayForName(fieldName, field);
                break;
            }
            case 'ListBox':
            case 'DropDown': {
                const selectedIndex: number = field.TextList.findIndex(
                    (item: any) => item.itemName === fieldValue
                );
                if (selectedIndex !== undefined && selectedIndex >= 0) {
                    field.SelectedValue = fieldValue;
                    field.SelectedList = [selectedIndex];
                }
                break;
            }
            case 'CheckBox':
                field.Selected = fieldValue === 'Yes';
                break;
            case 'RadioButton':
                // Keep existing behavior if needed
                field.Selected = true;
                break;
            }
        }
        return data;
    }

    /**
     * Keeps only GoTo AA slots for export/import JSON (§3.10).
     * Emits flat GoToAction shape: { action, destinationPageNumber, destinationLocation, zoomValue }.
     *
     * @param {object} actions - raw ActionsSettings
     * @returns {object} cleaned actions map or undefined when empty
     */
    private sanitizeButtonActions(actions: object): object {
        if (isNullOrUndefined(actions)) {
            return undefined;
        }
        const result: ActionsSettingsModel = {};
        const slots: string[] = ['mouseEnter', 'mouseLeave', 'mouseUp', 'mouseDown', 'gotFocus', 'lostFocus'];
        for (let i: number = 0; i < slots.length; i++) {
            const slot: string = slots[parseInt(i.toString(), 10)];
            const action: ActionModel | ButtonRuntimeAction = (actions as ActionsSettingsModel)[slot as keyof ActionsSettingsModel];
            if (isNullOrUndefined(action)) {
                continue;
            }
            const goTo: ActionModel = !isNullOrUndefined((action as ButtonRuntimeAction).goToAction) ?
                (action as ButtonRuntimeAction).goToAction : action;
            const kind: string = !isNullOrUndefined(action.action) ? action.action :
                (!isNullOrUndefined((action as ButtonRuntimeAction).actionType) ? (action as ButtonRuntimeAction).actionType : 'GoTo');
            const pageNumber: number = this.resolveGoToDestinationPageNumber(goTo as GoToActionModel);
            if ((kind !== 'GoTo' && kind !== 'goto') || isNullOrUndefined(goTo) || isNaN(pageNumber)) {
                continue;
            }
            const goToAction: GoToActionModel = {
                action: ActionType.GoTo,
                destinationPageNumber: pageNumber,
                destinationLocation: !isNullOrUndefined((goTo as GoToActionModel).destinationLocation)
                    ? { x: (goTo as GoToActionModel).destinationLocation.x || 0, y: (goTo as GoToActionModel).destinationLocation.y || 0 }
                    : { x: 0, y: 0 },
                zoomValue: !isNullOrUndefined((goTo as GoToActionModel).zoomValue) ? (goTo as GoToActionModel).zoomValue : 0
            };

            result[slot as keyof ActionsSettingsModel] = goToAction;
        }
        return Object.keys(result).length > 0 ? result : undefined;
    }

    /**
     * Exports a form field value as JSON for collaborative editing.
     * Returns a flat JSON object where the field name is the key and the field value is the value.
     *
     * JSON Format Example:
     * {
     *   "Password4": "asdsd"
     * }
     *
     * @param {FormFieldModel} field - Form field to export.
     * @returns {string} - JSON-formatted string (stringified object with field name as key and value as value)
     * @example
     * // Export a single form field value as JSON
     * const jsonData = formFieldsModule.exportFormFieldAsJson(modifiedField);
     */
    private exportFormFieldAsJson(field: FormFieldModel): string {
        const formFieldsData: Record<string, FormFieldModel['value']> = {};
        const fieldName: string = (field as FormFieldModel & {fieldName: string}).fieldName ? (field as FormFieldModel & {fieldName: string}).fieldName : (field.id ? field.id : '');
        if (fieldName) {
            // eslint-disable-next-line security/detect-object-injection
            formFieldsData[fieldName] = field.value;
            this.updateFormFieldsData(fieldName, field.value, this.formFieldsData);
        }
        return JSON.stringify(formFieldsData);
    }

    /**
     * Imports form field data in JSON format into the PDF Viewer.
     *
     * JSON Format Example:
     * {
     *   "Radio Button6": "Radio Button6"
     * }
     *
     * @param {string} data - JSON-formatted form field data (string or stringified JSON object)
     * @example
     * // Import form field data as JSON
     * const data = '{"Password4": "asdsd", "Check Box5": "Yes"}';
     * formFieldsModule.importFormFieldsAsJson(data);
     *
     * @returns {void}
     */
    private importFormFieldsAsJson(data: string): void {
        try {
            // Validate input
            if (!data) {
                console.warn('[FormFields] importFormFieldsAsJson called with empty data');
                return;
            }
            // Ensure the input is a valid JSON string
            let parsedData: any;
            if (typeof data === 'string') {
                // Validate JSON format
                try {
                    parsedData = JSON.parse(data);
                } catch (parseError) {
                    console.error('[FormFields] Invalid JSON data provided to importFormFieldsAsJson:', parseError);
                    throw new Error('Invalid JSON format for form field import');
                }
            } else {
                parsedData = data;
            }
            // Invoke the existing importFormFields method with Json format
            // This ensures consistent behavior and avoids duplicate implementation
            this.pdfViewerBase.importFormFields(parsedData,
                                                FormFieldDataFormat.Json
            );
        } catch (error) {
            console.error('[FormFields] Error importing form fields as JSON:', error);
            // Re-throw to allow caller to handle the error
            throw error;
        }
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
}

/**
 * Describes the FieldData
 *
 * @hidden
 */
interface FieldData {
    fieldValue: string;
    isReadOnly: boolean;
    isSelected?: string | boolean;
}

/**
 * Describes the FormFieldActionDatas
 *
 * @hidden
 */
interface FormFieldActionData {
    changes: string;
    action: string;
    jsonData?: string;
}

/**
 * Describes the FormFieldChanges
 *
 * @hidden
 */
interface FormFieldChanges {
    created?: FormFieldModel[];
    updated?: FormFieldModel[];
    deleted?: FormFieldModel[];
}
