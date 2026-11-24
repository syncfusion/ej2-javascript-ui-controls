import { Browser, createElement, initializeCSPTemplate, initializeTelemetryFeature } from '@syncfusion/ej2-base';
import { cornersPointsBeforeRotation, DrawingElement, PointModel, Rect, TextAlign, splitArrayCollection, processPathData, randomId } from '../ej2-drawings/index';
import { FormFieldAnnotationType, PdfAnnotationBase, PdfFormFieldBaseModel, PdfFontModel, PdfBoundsModel, SelectorModel } from '../drawing';
import { FormFieldsBase } from '../pdf-base/index';
import { DiagramHtmlElement } from '../drawing/html-element';
import { PdfAnnotationBaseModel, PdfViewer, PdfViewerBase, IPageAnnotations } from '../index';
import { IRect, FormFields } from '../index';
import { ButtonFieldSettings, BarcodeFieldSettings, CheckBoxFieldSettings, DropdownFieldSettings, PasswordFieldSettings, Item, ListBoxFieldSettings, RadioButtonFieldSettings, SignatureFieldSettings, TextFieldSettings, InitialFieldSettings, SignatureIndicatorSettings, JavaScriptAction } from '../pdfviewer';
import { isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { ActionModel, ActionsSettingsModel, ButtonFieldSettingsModel, BarcodeFieldSettingsModel, CheckBoxFieldSettingsModel, DropdownFieldSettingsModel, FormFieldModel, GoToActionModel, InitialFieldSettingsModel, ItemModel, ListBoxFieldSettingsModel, PasswordFieldSettingsModel, RadioButtonFieldSettingsModel, SignatureFieldSettingsModel, SignatureIndicatorSettingsModel, TextFieldSettingsModel, JavaScriptActionModel } from '../pdfviewer-model';
import { Dialog, Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { SelectEventArgs, Tab } from '@syncfusion/ej2-navigations';
import { DropDownButton} from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, Slider, TextBox, NumericTextBox, ChangeEventArgs, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Button, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';
import { ActionType, BarcodeSymbology, BarcodeValueFormat, DisplayMode, EditAction, FontStyle, FormFieldType, Pdf417ErrorCorrectionLevel, QRErrorCorrectionLevel, SignatureType, TextAlignment, Visibility } from '../base/types';
import { applyKeystroke, applyMaskKeystroke, buildScripts, CURRENCY_LOCATION_CATALOG, CURRENCY_SYMBOL_CATALOG,
    currencyIdOf, currencyLocationIdOf, currencyLocationOf, currencyTextOf, DEFAULT_DECIMALS, fieldConfig, formatValue,
    inferActionPair, isSpecialPreset, previewSampleValue, readActionScript, SEPARATOR_STYLE_CATALOG,
    separatorIdOf, separatorValueOf, shouldBlockKey, shouldRunFormat, SPECIAL_TYPE_CATALOG, specialIdOf, specialInfoOf,
    specialMaxDigits, validateMaskOnCommit, validateSpecialValue, AfCurrencyLocation, AfCurrencySymbolId, AfFormatConfig,
    AfFormatKind, AfKeystrokeResult, AfMaskCommit, AfSeparatorStyle, AfSpecialCommit } from '../base/af-format';
import { cloneObject } from '../drawing/drawing-util';
import { PdfBitmap, PdfPage, Rectangle } from '@syncfusion/ej2-pdf';
import { PdfViewerUtils } from '../base/pdfviewer-utlis';
import { getArialFontData } from '../pdf-base/fontData';
import { OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { FormFieldColor, PdfRenderedFields } from '../pdf-base';
import { IFormFieldCollection, ISize } from '../base';
import { RGBA } from '../annotation';
import { ensureCollaborationId, applyCustomData } from '../collaboration/collaborative-editing-handler';
import { IBarcodeRenderOptions, isBarcodeRenderableAt, mountBarcodeGenerator, renderBarcodeField } from '../pdf-base/barcode-generator';

/**
 * The `FormDesigner` module is used to handle form designer actions of PDF viewer.
 */
export class FormDesigner {
    private formFieldTooltips: Tooltip[] = [];
    private data: string;
    private previousBackgroundColor : string;
    private formFieldsData: PdfRenderedFields[] | string[] | string;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public arialFontData: string = '';
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
    /** DateTime Format tab — Format catalog / Custom dropdown. */
    private formFieldDateTimeFormat: DropDownList;
    /** DateTime Format tab — Custom pattern textbox. */
    private formFieldDateTimeCustom: TextBox;
    /** DateTime Format tab — Custom pattern validation message (rendered next to the input). */
    private formFieldDateTimeCustomError: HTMLElement;
    /** DateTime Format tab — maxLength group host for UI disable. */
    private formFieldMaxLengthGroup: HTMLElement;
    /** DateTime Format tab — tracks whether the active Custom pattern is valid. */
    private isDateTimeCustomFormatValid: boolean = true;
    /** Set when applyDateTimeFormatFromDialog blocks a commit so onOkClicked
     *  can keep the dialog open instead of hiding it. */
    private isDateTimeCustomFormatCommitBlocked: boolean = false;
    /**
     * Format tab — last Format Type the dialog rendered for. Used by `onFormatTypeChanged`
     * to detect an actual Date↔Time switch without re-reading `formFieldFormatType.value`,
     * which Syncfusion updates BEFORE the `change` event fires (so the live read inside the
     * handler always reflects the new value, never the previous one).
     */
    private previousFormatTypeKind: AfFormatKind | null = null;
    /** Format tab — top-level Format Type dropdown (None / Number / Percentage / Date / Time / Special). */
    private formFieldFormatType: DropDownList;
    /** Format tab — Number subsection Decimal Places dropdown (0..10). */
    private formFieldNumberDecimals: DropDownList;
    /** Format tab — Number subsection Separator Style dropdown. */
    private formFieldNumberSeparator: DropDownList;
    /** Format tab — Number subsection Currency Symbol dropdown. */
    private formFieldNumberCurrency: DropDownList;
    /** Format tab — Number subsection Symbol Location dropdown. */
    private formFieldNumberLocation: DropDownList;
    /** Format tab — Number subsection Show parens checkbox. */
    private formFieldNumberParens: CheckBox;
    /** Format tab — Number subsection Use red text checkbox. */
    private formFieldNumberRed: CheckBox;
    /** Format tab — Percentage subsection Decimal Places dropdown (0..10). */
    private formFieldPercentDecimals: DropDownList;
    /** Format tab — Percentage subsection Separator Style dropdown. */
    private formFieldPercentSeparator: DropDownList;
    /** Format tab — Special subsection Special Type dropdown. */
    private formFieldSpecialType: DropDownList;
    /** Format tab — Special subsection Arbitrary Mask textbox. */
    private formFieldSpecialMask: TextBox;
    /** Format tab — readonly Preview textbox reflecting the current UI selection. */
    private formFieldFormatPreview: TextBox;
    /** Format tab — wrapper that hosts the Preview textbox; hidden when Format Type is 'None'. */
    private formFieldFormatPreviewWrapper: HTMLElement;
    /** Format tab — wrapper that hosts all subsection content; toggled by Format Type. */
    private formFieldFormatSubsection: HTMLElement;
    /** Format tab — Number subsection host. */
    private formFieldNumberSubsection: HTMLElement;
    /** Format tab — Percentage subsection host. */
    private formFieldPercentSubsection: HTMLElement;
    /** Format tab — Special subsection host. */
    private formFieldSpecialSubsection: HTMLElement;
    /** Format tab — DateTime subsection host (delegates to existing date/time controls). */
    private formFieldFormatDateTimeSubsection: HTMLElement;
    private buttonDestinationPageItem: NumericTextBox;
    private buttonDestinationXItem: TextBox;
    private buttonDestinationYItem: TextBox;
    private buttonZoomValueItem: DropDownList;
    private buttonActionSlotDropDown: DropDownList;
    private buttonActionTypeDropDown: DropDownList;
    private buttonActionEditorHost: HTMLElement;
    private buttonActionSelectedSlot: string = 'mouseUp';
    // I3: last-modified slot — drives the default selection when the Actions tab is opened
    // so the user lands on the slot they most recently configured instead of always mouseUp.
    private lastButtonActionSlot: string = 'mouseUp';
    private buttonActionSelectedType: string = 'GoTo';
    private buttonActionPanelField: PdfFormFieldBaseModel;
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
    private formFieldListItemName: TextBox;
    private formFieldExportValueBox: TextBox;
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
     * When true, Textbox placement from DateTimeTool applies date-field defaults
     * (isDateField, type date, locked AFDate format). Cleared after drop / non-date tools.
     *
     * @private
     */
    public isDateTimeToolPlacement: boolean = false;
    private isAddFormFieldProgrammatically: boolean = false;
    private isAddFormFieldUi: boolean = false;
    /** Default format script for DateTimeTool-placed textboxes (SoT locked default). */
    private static readonly defaultDateTimeFormatScript: string = 'AFDate_FormatEx("m/d/yy")';
    private barcodeSymbologyDropDown: DropDownList;
    private barcodeCaptionTextBox: TextBox;
    private barcodeXDimensionInput: NumericTextBox;
    private barcodeErrorCorrectionDropDown: DropDownList;
    private barcodeValueFormatDropDown: DropDownList;
    private barcodeIncludeFieldNamesCheck: CheckBox;
    private barcodeCompressDataCheck: CheckBox;
    private barcodeCustomValueTextBox: TextBox;
    private barcodeCustomValueHost: HTMLElement;
    private barcodeValueTextBox: TextBox;
    private barcodeSourceFieldsMultiSelect: MultiSelect;
    private barcodeSourceFieldsHost: HTMLElement;
    private barcodeValueFormatHost: HTMLElement;
    private barcodeIncludeFieldNamesHost: HTMLElement;
    /** Locked Date catalog for Format tab (UI only — 23 items). */
    private static readonly dateFormatCatalog: string[] = [
        'm/d', 'm/d/yy', 'm/d/yyyy', 'mm/dd/yy', 'mm/dd/yyyy', 'mm/yy', 'mm/yyyy',
        'd-mmm', 'd-mmm-yy', 'd-mmm-yyyy', 'dd-mmm-yy', 'dd-mmm-yyyy',
        'yy-mm-dd', 'yyyy-mm-dd', 'mmm-yy', 'mmm-yyy', 'mmm-yyyy',
        'mmm d , yyyy', 'mmmm d, yyyy',
        'm/d/yy h:MM tt', 'm/d/yyyy h:MM tt', 'm/d/yy HH:MM', 'm/d/yyyy HH:MM'
    ];
    /** Locked Time catalog for Format tab (UI only — 4 items). */
    private static readonly timeFormatCatalog: string[] = [
        'HH:MM', 'h:MM tt', 'HH:MM:ss', 'h:MM:ss tt'
    ];
    private static readonly customFormatLabel: string = 'Custom';
    /** Cached once: host supports input type datetime-local. */
    private _supportsDateTimeLocal: boolean | undefined;
    private increasedSize: number = 5;
    private defaultZoomValue: number = 1;
    private defaultFontSize: number = 10;
    private signIndicatorPadding: number = 3;
    private signIndicatorMinimunFontSize: number = 1;
    private signatureFieldPropertyChanged: SignatureFieldPropertyChanged =
    {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isVisibilityChanged: false,
        isNameChanged: false,
        isPrintChanged: false,
        isTooltipChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isCustomDataChanged: false
    };
    private initialFieldPropertyChanged: SignatureFieldPropertyChanged =
    {
        isReadOnlyChanged: false,
        isRequiredChanged: false,
        isVisibilityChanged: false,
        isNameChanged: false,
        isPrintChanged: false,
        isTooltipChanged: false,
        isToolTipChanged: false,
        isThicknessChanged: false,
        isCustomDataChanged: false
    };
    private textFieldPropertyChanged: TextFieldPropertyChanged =
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
        isMultilineChanged: false,
        isCustomDataChanged: false,
        isMaxLengthChanged: false,
        isFontStyleChanged: false
    };
    private passwordFieldPropertyChanged: TextFieldPropertyChanged = {
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
        isCustomDataChanged: false,
        isMaxLengthChanged: false,
        isFontStyleChanged: false
    };
    private checkBoxFieldPropertyChanged: CheckBoxFieldPropertyChanged = {
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
        isCustomDataChanged: false,
        isValueChanged: false
    };
    private radioButtonFieldPropertyChanged: RadioButtonFieldPropertyChanged = {
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
        isCustomDataChanged: false,
        isValueChanged: false
    };
    private dropdownFieldPropertyChanged: ChoiceFieldPropertyChanged = {
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
        isOptionChanged: false,
        isCustomDataChanged: false,
        isFontStyleChanged: false,
        isValueChanged: false
    };
    private listBoxFieldPropertyChanged: ChoiceFieldPropertyChanged = {
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
        isOptionChanged: false,
        isCustomDataChanged: false,
        isFontStyleChanged: false,
        isValueChanged: false
    };
    private barcodeFieldPropertyChanged: BarcodeFieldPropertyChanged = {
        isNameChanged: false,
        isToolTipChanged: false,
        isSymbologyChanged: false,
        isXDimensionChanged: false,
        isErrorCorrectionLevelChanged: false,
        isValueFormatChanged: false,
        isFieldsChanged: false,
        isIncludeFieldNamesChanged: false,
        isCompressDataChanged: false,
        isCustomValueChanged: false,
        isCaptionChanged: false
    };
    private buttonFieldPropertyChanged: ButtonFieldPropertyChanged = {
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
        isFontFamilyChanged: false,
        isValueChanged: false,
        isColorChanged: false,
        isCustomDataChanged: false,
        isFontStyleChanged: false,
        isActionsChanged: false
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
    private barcodeResizeStartState: IBarcodeResizeState | null = null;
    private barcodeLastRenderableState: IBarcodeResizeState | null = null;
    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} base - It describes about the base
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
        this.arialFontData = getArialFontData();
    }
    /**
     * @private
     */
    public isPropertyDialogOpen: boolean = false;
    private isRerender: boolean = false;

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
            const bounds: { width: number; height: number } =
                this.updateFormFieldInitialSize(obj as DrawingElement, formFieldAnnotationType);
            const htmlElement: HTMLElement = this.createHtmlElement('div', HtmlElementAttribute);
            this.isDrawHelper = true;
            if (formFieldAnnotationType === 'SignatureField' || formFieldAnnotationType === 'InitialField') {
                htmlElement.appendChild(this.createSignatureDialog(this.pdfViewer, obj, bounds));
            } else if (formFieldAnnotationType === 'DropdownList') {
                const element: DiagramHtmlElement = { id: 'dropdown_helper' } as DiagramHtmlElement;
                htmlElement.appendChild(this.createDropDownList(element, obj));
            } else if (formFieldAnnotationType === 'ListBox') {
                const element: DiagramHtmlElement = { id: 'listbox_helper' } as DiagramHtmlElement;
                htmlElement.appendChild(this.createListBox(element, obj));
            } else {
                htmlElement.appendChild(this.createInputElement(formFieldAnnotationType, obj, bounds));
            }
            textLayer.appendChild(htmlElement);
            const point: PointModel = this.pdfViewerBase.getMousePosition(event as MouseEvent | PointerEvent | TouchEvent);
            htmlElement.style.cssText = `height: ${bounds.height * zoomValue}px;width: ${bounds.width * zoomValue}px;
            left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;position: absolute;opacity: 0.5;`;
            // DateTime tool helper only. Other tools share this path and must keep their own sizing.
            if (obj && obj.isDateField) {
                const helperComposite: HTMLElement = htmlElement.querySelector('.e-pv-datetime-composite') as HTMLElement;
                if (helperComposite) {
                    this.pdfViewerBase.scaleDateTimePickerIcon(helperComposite, bounds.height * zoomValue);
                }
            }
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
        if ((formFieldElement === null || (this.pdfViewer.formFieldsModule && this.pdfViewer.formFieldsModule.isCollaborativeImport)) &&
            element !== null && canvasElement !== null && textLayer ){
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
                const bounds: PdfBoundsModel = drawingObject.bounds;
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
                        const currentSpanElement: HTMLElement = spanElement[parseInt(i.toString(), 10)] as HTMLElement;
                        if (currentSpanElement.id.split('_')[0] === drawingObject.id) {
                            const bounds: { width: number; height: number; display: string } =
                                this.getCheckboxRadioButtonBounds(drawingObject);
                            currentSpanElement.style.width = (bounds.width / 2) + 'px';
                            currentSpanElement.style.height = (bounds.height / 2) + 'px';
                            if (parseInt(currentSpanElement.style.width, 10) <= 1 ||
                             parseInt(currentSpanElement.style.height, 10) <= 1) {
                                currentSpanElement.style.width = '1px';
                                currentSpanElement.style.height = '1px';
                                currentSpanElement.style.margin = '1px';
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
                    let value: string;
                    if (!isNullOrUndefined(this.pdfViewer.nameTable[`${elementId}`])) {
                        value = (this.pdfViewer.nameTable[`${elementId}`] as PdfFormFieldBaseModel).value ? (this.pdfViewer.nameTable[`${elementId}`] as PdfFormFieldBaseModel).value : (this.pdfViewer.nameTable[`${elementId}`] as PdfAnnotationBaseModel).data;
                    }
                    else
                    {
                        value = drawingObject.value;
                    }
                    if (value && this.pdfViewer.formFieldsModule) {
                        let signatureType: 'Type' | 'Path' | 'Image' = (value.indexOf('base64')) > -1 ? 'Image' : ((value.startsWith('M') && value.split(',')[1] && value.split(',')[1].split(' ')[1].startsWith('L') || (value.startsWith('M') && value.split(' ')[3].startsWith('L'))) ? 'Path' : 'Type');
                        if (this.pdfViewerBase.isSignaturePathData(value))
                        {
                            signatureType = 'Path';
                        }
                        if (this.pdfViewerBase.signatureModule) {
                            this.pdfViewerBase.signatureModule.drawSignature(signatureType, value, element.template,
                                                                             drawingObject.fontFamily);
                        }
                    }
                }
            }
            let field: FormFieldModel | IFormField = this.getFormFieldAddEventArgs(drawingObject);
            if (!this.pdfViewer.isFormFieldsLoaded || isAddedProgrammatically) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
            }
            if (this.isSetFormFieldMode || isAddedProgrammatically) {
                this.isDateTimeToolPlacement = false;
                const pageIndex: number = this.pdfViewerBase.activeElements.activePageID ?
                    this.pdfViewerBase.activeElements.activePageID : field.pageNumber - 1;
                this.pdfViewer.fireFormFieldAddEvent('formFieldAdd', field as IFormField , pageIndex);
                if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                    if ((field as IFormField).formFieldAnnotationType === 'RadioButton') {
                        field = this.updateRadioButtonItem(field as FormFieldModel);
                    }
                    // Fire formFieldChanged event for collaborative editing (only on add action)
                    this.pdfViewer.fireFormFieldChangedEvent(EditAction.Add, field as FormFieldModel);
                }
            }
            this.isSetFormFieldMode = false;
        } else {
            const point: PointModel = cornersPointsBeforeRotation(element).topLeft;
            this.updateFormDesignerFieldInSessionStorage(point, element, formFieldAnnotationType, drawingObject);
            if (isAddedProgrammatically) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                let field: FormFieldModel | IFormField = this.getFormFieldAddEventArgs(drawingObject);
                this.pdfViewer.fireFormFieldAddEvent('formFieldAdd', field as IFormField, pageIndex);
                if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                    if ((field as IFormField).formFieldAnnotationType === 'RadioButton') {
                        field = this.updateRadioButtonItem(field as FormFieldModel);
                    }
                    // Fire formFieldChanged event for collaborative editing (only on add action)
                    this.pdfViewer.fireFormFieldChangedEvent(EditAction.Add, field as FormFieldModel);
                }
            }
        }
        return element.template;
    }

    private updateRadioButtonItem(field: FormFieldModel): FormFieldModel {
        if ((field as unknown as IFormField).formFieldAnnotationType === 'RadioButton' || (field as any).type === 'RadioButton') {
            const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            const formFileds: any = JSON.parse(data);
            for (let z: number = 0; z < formFileds.length; z++) {
                if (field.id === formFileds[z as number].Key.split('_')[0] || field.id === formFileds[z as number].Key) {
                    (field as unknown as IFormField).radiobuttonItem = formFileds[z as number].FormField.radiobuttonItem;
                }
            }
        }
        return field;
    }

    private getFormFieldAddEventArgs(drawingObject: PdfFormFieldBaseModel): FormFieldModel | IFormField {
        const field: FormFieldModel | IFormField = {
            name: drawingObject.name, id: drawingObject.id, value: drawingObject.value, fontFamily: drawingObject.fontFamily,
            isDateField: drawingObject.isDateField,
            actions: drawingObject.actions,
            fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle,
            color: drawingObject.color, backgroundColor: drawingObject.backgroundColor as RGBA, alignment: drawingObject.alignment,
            isReadonly: drawingObject.isReadonly, visibility: drawingObject.visibility,
            maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint,
            rotation: drawingObject.rotateAngle, tooltip: drawingObject.tooltip,
            borderColor: drawingObject.borderColor as RGBA, thickness: drawingObject.thickness, options: drawingObject.options,
            pageNumber: drawingObject.pageNumber, isChecked: drawingObject.isChecked,
            isSelected: drawingObject.isSelected, customData: drawingObject.customData, bounds: drawingObject.bounds as Rectangle,
            formFieldAnnotationType: drawingObject.formFieldAnnotationType, isMultiline: drawingObject.isMultiline,
            insertSpaces: drawingObject.insertSpaces,
            symbology: drawingObject.symbology || BarcodeSymbology.PDF417,
            xDimension: !isNullOrUndefined(drawingObject.xDimension) ? drawingObject.xDimension : 4,
            errorCorrectionLevel: drawingObject.errorCorrectionLevel || 'Level5',
            valueFormat: drawingObject.valueFormat || 'TabDelimited',
            includeFieldNames: drawingObject.includeFieldNames !== false,
            fields: Array.isArray(drawingObject.fields) ? drawingObject.fields : [],
            caption: drawingObject.caption || '',
            compressData: drawingObject.compressData === true,
            customValue: drawingObject.customValue || ''
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
            signatureType: (drawingObject as PdfFormFieldBaseModel & IFormField).signatureType,
            signatureBound: (drawingObject as PdfFormFieldBaseModel & IFormField).signatureBound,
            fontFamily: drawingObject.fontFamily, fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle,
            isDateField: drawingObject.isDateField, actions: drawingObject.actions,
            fontColor: this.getRgbCode(drawingObject.color) as RGBA,
            borderColor: this.getRgbCode(drawingObject.borderColor as string) as RGBA, thickness: drawingObject.thickness,
            backgroundColor: this.getRgbCode(drawingObject.backgroundColor as string) as RGBA,
            textAlign: drawingObject.alignment, isChecked: drawingObject.isChecked, isSelected: drawingObject.isSelected,
            isReadonly: drawingObject.isReadonly, font: {
                isBold: drawingObject.font.isBold, isItalic: drawingObject.font.isItalic, isStrikeout: drawingObject.font.isStrikeout,
                isUnderline: drawingObject.font.isUnderline
            }, selectedIndex: drawingObject.selectedIndex, radiobuttonItem: null,
            option: drawingObject.options ? drawingObject.options : [], visibility: drawingObject.visibility,
            maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint,
            rotation: drawingObject.rotateAngle, tooltip: drawingObject.tooltip,
            insertSpaces: drawingObject.insertSpaces, customData: drawingObject.customData,
            isUnisonSelected: drawingObject.isUnisonSelected,
            symbology: drawingObject.symbology || BarcodeSymbology.PDF417,
            xDimension: !isNullOrUndefined(drawingObject.xDimension) ? drawingObject.xDimension : 4,
            errorCorrectionLevel: drawingObject.errorCorrectionLevel || Pdf417ErrorCorrectionLevel.Level5,
            valueFormat: drawingObject.valueFormat || BarcodeValueFormat.TabDelimited,
            includeFieldNames: drawingObject.includeFieldNames !== false,
            fields: Array.isArray(drawingObject.fields) ? drawingObject.fields : [],
            caption: drawingObject.caption || '',
            compressData: drawingObject.compressData === true,
            customValue: drawingObject.customValue || ''
        };
        if (formFieldType === 'Button' || formFieldType === 'ButtonField') {
            const buttonDrawing: PdfFormFieldBaseModel = drawingObject as PdfFormFieldBaseModel;
            formDesignObj.actions = !isNullOrUndefined(buttonDrawing.actions) ? buttonDrawing.actions : formDesignObj.actions;
        }
        if (formDesignObj.formFieldAnnotationType === 'RadioButton') {
            formDesignObj.radiobuttonItem = [];
            formDesignObj.radiobuttonItem.push({
                id: element.id, lineBound: { X: point.x * zoomValue, Y: point.y * zoomValue,
                    Width: element.actualSize.width * zoomValue, Height: element.actualSize.height * zoomValue },
                name: drawingObject.name, zoomValue: zoomValue, pageNumber: drawingObject.pageNumber,
                value: drawingObject.value, formFieldAnnotationType: formFieldType,
                fontFamily: drawingObject.fontFamily, fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle,
                fontColor: this.getRgbCode(drawingObject.color as string) as RGBA,
                borderColor: this.getRgbCode(drawingObject.borderColor as string) as RGBA, thickness: drawingObject.thickness,
                backgroundColor: this.getRgbCode(drawingObject.backgroundColor as string) as RGBA,
                textAlign: drawingObject.alignment, isChecked: drawingObject.isChecked, isSelected: drawingObject.isSelected,
                isReadonly: drawingObject.isReadonly, visibility: drawingObject.visibility,
                maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired, isPrint: drawingObject.isPrint,
                rotation: 0, tooltip: drawingObject.tooltip, isUnisonSelected: drawingObject.isUnisonSelected,
                customData: drawingObject.customData
            });
        }
        const isItemAdd: boolean = this.getRadioButtonItem(formDesignObj, drawingObject);
        if (!isItemAdd) {
            for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
                const formFieldElement: IFormFieldCollection = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)];
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

    private getRadioButtonItem(radiobutton: IFormField, formFieldProperty: PdfFormFieldBaseModel): boolean {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        let isItemAdd: boolean = false;
        if (data) {
            const formFieldsData: any = JSON.parse(data);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                const currentData: IFormFieldCollection = formFieldsData[parseInt(i.toString(), 10)];
                let radiobuttonItem: IRadiobuttonItem;
                if (radiobutton.formFieldAnnotationType === 'RadioButton') {
                    if (radiobutton.radiobuttonItem && (currentData.FormField as IFormField).radiobuttonItem) {
                        for (let m: number = 0; m < (currentData.FormField as IFormField).radiobuttonItem.length; m++) {
                            if ((currentData.FormField as IFormField).radiobuttonItem[parseInt(m.toString(), 10)].id === radiobutton.id) {
                                radiobuttonItem = {
                                    lineBound: radiobutton.lineBound, id: radiobutton.id,
                                    name: radiobutton.name, zoomValue: radiobutton.zoomValue, pageNumber: radiobutton.pageNumber,
                                    value: radiobutton.value, formFieldAnnotationType: radiobutton.formFieldAnnotationType,
                                    fontFamily: radiobutton.fontFamily, fontSize: radiobutton.fontSize,
                                    fontStyle: radiobutton.fontStyle, fontColor: this.getRgbCode(formFieldProperty.color as string) as RGBA,
                                    borderColor: this.getRgbCode(formFieldProperty.borderColor as string) as RGBA,
                                    thickness: formFieldProperty.thickness,
                                    backgroundColor: this.getRgbCode(formFieldProperty.backgroundColor as string) as RGBA,
                                    textAlign: radiobutton.textAlign, isChecked: radiobutton.isChecked,
                                    isSelected: radiobutton.isSelected,
                                    isReadonly: radiobutton.isReadonly, visibility: radiobutton.visibility,
                                    maxLength: radiobutton.maxLength, isRequired: radiobutton.isRequired, isPrint: radiobutton.isPrint,
                                    rotation: 0, tooltip: radiobutton.tooltip, isUnisonSelected: radiobutton.isUnisonSelected
                                };
                                (currentData.FormField as IFormField).radiobuttonItem.splice(m, 1);
                                (currentData.FormField as IFormField).radiobuttonItem.push(radiobuttonItem);
                                if (!isNullOrUndefined(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)])) {
                                    if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.name ===
                                     currentData.FormField.name) {
                                        (this.pdfViewerBase.formFieldCollection[i as number].FormField as IFormField).radiobuttonItem =
                                         (currentData.FormField as IFormField).radiobuttonItem;
                                        isItemAdd = true;
                                    }
                                }
                                break;
                            }
                            else {
                                if (radiobutton.formFieldAnnotationType === (currentData.FormField as IFormField).formFieldAnnotationType &&
                                     radiobutton.name === currentData.FormField.name) {
                                    radiobuttonItem = {
                                        lineBound: radiobutton.lineBound, id: radiobutton.id,
                                        name: radiobutton.name, zoomValue: radiobutton.zoomValue, pageNumber: radiobutton.pageNumber,
                                        value: radiobutton.value, formFieldAnnotationType: radiobutton.formFieldAnnotationType,
                                        fontFamily: radiobutton.fontFamily, fontSize: radiobutton.fontSize,
                                        fontStyle: radiobutton.fontStyle, fontColor: this.getRgbCode(
                                            formFieldProperty.color as string) as RGBA,
                                        borderColor: this.getRgbCode(formFieldProperty.borderColor as string) as RGBA,
                                        thickness: formFieldProperty.thickness,
                                        backgroundColor: this.getRgbCode(formFieldProperty.backgroundColor as string) as RGBA,
                                        textAlign: radiobutton.textAlign, isChecked: radiobutton.isChecked,
                                        isSelected: radiobutton.isSelected,
                                        isReadonly: radiobutton.isReadonly, visibility: radiobutton.visibility,
                                        maxLength: radiobutton.maxLength, isRequired: radiobutton.isRequired,
                                        isPrint: radiobutton.isPrint, rotation: 0, tooltip: radiobutton.tooltip
                                    };
                                    let isContainsRadiobuttonItem: boolean = false;
                                    for (let i: number = 0; i < (currentData.FormField as IFormField).radiobuttonItem.length; i++) {
                                        if ((currentData.FormField as IFormField).radiobuttonItem[parseInt(i.toString(),
                                                                                                           10)].id ===
                                                                                                           radiobuttonItem.id) {
                                            (currentData.FormField as IFormField).radiobuttonItem[parseInt(i.toString(),
                                                                                                           10)] = radiobuttonItem;
                                            isContainsRadiobuttonItem = true;
                                            break;
                                        }
                                    }
                                    if (!isContainsRadiobuttonItem) {
                                        (currentData.FormField as IFormField).radiobuttonItem.push(radiobuttonItem);
                                    }
                                    if (!isNullOrUndefined(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)])) {
                                        (this.pdfViewerBase.formFieldCollection[i as number].FormField as IFormField).radiobuttonItem =
                                         (currentData.FormField as IFormField).radiobuttonItem;
                                        isItemAdd = true;
                                        for (let l: number = 0; l < this.pdfViewerBase.formFieldCollection.length; l++) {
                                            const formFieldElement: IFormFieldCollection =
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
        const colours: Record<string, string> = {
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
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).slice(-2) : '00') : '')) : '';
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
                canvas.style.width = width * zoom + 'px';
                canvas.style.height = height * zoom + 'px';
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
                    const currentData: IFormField = formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField;
                    let isRadioButtonItem: boolean;
                    if (currentData) {
                        isRadioButtonItem = this.isRadioButton(currentData, pageIndex);
                    }
                    if (currentData.pageNumber === pageIndex + 1 || isRadioButtonItem) {
                        const domElementId: HTMLElement = document.getElementById('form_field_' + currentData.id + '_html_element');
                        if (!domElementId) {
                            let signatureField: PdfFormFieldBaseModel = this.pdfViewer.nameTable[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]];
                            let element: DiagramHtmlElement = signatureField.wrapper.children[0] as DiagramHtmlElement;
                            const currentVisibility: string = !isNullOrUndefined(signatureField.visibility) ? signatureField.visibility : 'visible';
                            if (element) {
                                if (currentData.formFieldAnnotationType === 'RadioButton') {
                                    for (let j: number = 0; j < currentData.radiobuttonItem.length; j++) {
                                        signatureField = this.pdfViewer.nameTable[currentData.radiobuttonItem[parseInt(j.toString(), 10)].id.split('_')[0]];
                                        element = signatureField.wrapper.children[0] as DiagramHtmlElement;
                                        currentData.radiobuttonItem[parseInt(j.toString(), 10)] =
                                         this.renderFormFieldsInZooming(element,
                                                                        currentData.radiobuttonItem[parseInt(j.toString(), 10)],
                                                                        signatureField, zoomValue) as IRadiobuttonItem;
                                        (this.pdfViewerBase.formFieldCollection[i as number].FormField as IFormField).
                                            radiobuttonItem[j as number].lineBound =
                                        currentData.radiobuttonItem[parseInt(j.toString(), 10)].lineBound;
                                        (this.pdfViewerBase.formFieldCollection[i as number].FormField as IFormField).
                                            radiobuttonItem[j as number].zoomValue = zoomValue;
                                    }
                                } else {
                                    const filteredField: IFormFieldCollection[] = this.pdfViewerBase.formFieldCollection.filter(function (
                                        field: IFormFieldCollection): boolean {
                                        return field.FormField.id === currentData.id;
                                    });
                                    if (currentData && currentData.value === '') {
                                        currentData.value = filteredField[0] ? filteredField[0].FormField.value : '';
                                        currentData.signatureType = filteredField[0] ? filteredField[0].FormField.signatureType as string : '';
                                    }
                                    if (!isNullOrUndefined(currentData)) {
                                        currentData.visibility = currentVisibility;
                                        filteredField[0].FormField.visibility = currentVisibility;
                                    }
                                    const zoomCurrentData: IFormField =
                                    this.renderFormFieldsInZooming(element, currentData, signatureField, zoomValue);
                                    if (currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') {
                                        // eslint-disable-next-line
                                        const proxy: FormDesigner = this;
                                        formFieldsData.filter(function (item: IFormFieldCollection): void {
                                            if (item.FormField.name === currentData.name && item.FormField.id !== currentData.id && !isNullOrUndefined(proxy.pdfViewer.nameTable[item.FormField.id]) && (proxy.pdfViewer.nameTable[item.FormField.id] as PdfFormFieldBaseModel).value !== '') {
                                                currentData.value = (proxy.pdfViewer.nameTable[item.FormField.id] as PdfFormFieldBaseModel).
                                                    value;
                                                currentData.signatureType = item.FormField.signatureType === 'Text' ? 'Type' : (item.FormField as IFormField).signatureType;
                                                if (currentData.value !== '') {
                                                    currentData.signatureBound = (item.FormField as IFormField).signatureBound;
                                                }
                                            }
                                        });
                                        if ((isNullOrUndefined(proxy.pdfViewer.nameTable[currentData.id])
                                            || (proxy.pdfViewer.nameTable[currentData.id] as PdfFormFieldBaseModel).value === '') && currentData.value !== '') {
                                            if (this.pdfViewerBase.signatureModule) {
                                                this.pdfViewerBase.signatureModule.drawSignature(currentData.signatureType,
                                                                                                 currentData.value, currentData);
                                            }
                                            signatureValueRender = true;
                                        }
                                    }
                                    currentData.lineBound = zoomCurrentData.lineBound;
                                    if (currentData.signatureBound) {
                                        currentData.signatureBound = zoomCurrentData.signatureBound;
                                        (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                                        IFormField).signatureBound = currentData.signatureBound;
                                        if ((currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') && currentData.signatureType === 'Image' && signatureValueRender) {
                                            setTimeout(() => {
                                                if (!isNullOrUndefined(this.pdfViewer.nameTable[element.id.split('_')[0] + '_content'])) {
                                                    (this.pdfViewer.nameTable[element.id.split('_')[0] + '_content'] as PdfFormFieldBaseModel & IFormField).signatureBound = currentData.signatureBound;
                                                }
                                            }, 10);
                                        } else {
                                            if (!isNullOrUndefined(this.pdfViewer.nameTable[element.id.split('_')[0] + '_content'])) {
                                                (this.pdfViewer.nameTable[element.id.split('_')[0] + '_content'] as PdfFormFieldBaseModel & IFormField).signatureBound = currentData.signatureBound;
                                            }
                                        }
                                    }
                                    (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).lineBound =
                                     currentData.lineBound;
                                    (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                                    IFormField).zoomValue = zoomValue;
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
                            this.pdfViewerBase.focusField = null;
                        }
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
    }

    private isRadioButton(currentData: IFormField, currentPageIndex: number): boolean {
        if (currentData && currentData.formFieldAnnotationType === 'RadioButton' &&
            Array.isArray(currentData.radiobuttonItem) &&
            currentData.radiobuttonItem.length > 0) {
            for (let i: number = 0; i < currentData.radiobuttonItem.length; i++) {
                if (currentData.radiobuttonItem[parseInt(i.toString(), 10)].pageNumber === currentPageIndex + 1) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }

    private renderFormFieldsInZooming(element: DiagramHtmlElement, currentData: IFormField | IRadiobuttonItem,
                                      signatureField: PdfFormFieldBaseModel,
                                      zoomValue: number): IFormField {
        if (element) {
            this.isRerender = true;
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
                signatureField.visibility = currentData.visibility as Visibility;
            }
            if (currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') {
                this.disableSignatureClickEvent = true;
                signatureField.value = currentData.value;
                (signatureField as PdfFormFieldBaseModel & IFormField).signatureType = (currentData as IFormField).signatureType;
                (signatureField as PdfFormFieldBaseModel & IFormField).signatureBound = (currentData as IFormField).signatureBound;
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
            if (textLayer) {
                textLayer.appendChild(parentHtmlElement);
            }
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
            if ((currentData as IFormField).signatureBound && signatureField.wrapper.children[1]) {
                const signPoint: Rect = signatureField.wrapper.children[1].bounds;
                (currentData as IFormField).signatureBound.x = signPoint.x * zoomValue;
                (currentData as IFormField).signatureBound.y = signPoint.y * zoomValue;
                (currentData as IFormField).signatureBound.width = signPoint.width * zoomValue;
                (currentData as IFormField).signatureBound.height = signPoint.height * zoomValue;
            }
        }
        this.isRerender = false;
        return currentData as IFormField;
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
     * @returns {{ width: number, height: number }} - { width: number, height: number }
     */
    public updateFormFieldInitialSize(obj: DrawingElement, formFieldAnnotationType: string): { width: number, height: number } {
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
        case 'Button':
            // Product lock DEFAULT-100x40: place/ghost size when bounds not rubber-banded.
            obj.width = 100 * zoomValue;
            obj.height = 40 * zoomValue;
            break;
        case 'BarcodeField':
            obj.width = 200 * zoomValue;
            obj.height = 80 * zoomValue;
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
                    (htmlElement.firstElementChild as HTMLElement).style.display = 'flex';
                    (htmlElement.firstElementChild as HTMLElement).style.justifyContent = 'center';
                    (htmlElement.firstElementChild as HTMLElement).style.alignItems = 'center';
                    const minDimension: number = Math.min(element.actualSize.width * zoomValue, element.actualSize.height * zoomValue);
                    (labelContainer as HTMLElement).style.width = (labelContainer as HTMLElement).style.height = minDimension + 'px';
                    (spanElement as HTMLElement).style.width = (spanElement as HTMLElement).style.height = (minDimension / 2) + 'px';
                    if (zoomValue < 1 && parseInt((labelContainer as HTMLElement).style.width,
                                                  10) <= 20 && parseInt((labelContainer as HTMLElement).style.height, 10) <= 20) {
                        (spanElement as HTMLElement).style.margin = Math.round(parseInt((labelContainer as HTMLElement).style.width, 10) / 3.5) + 'px';
                    }
                    else {
                        (spanElement as HTMLElement).style.margin = Math.round(parseInt((labelContainer as HTMLElement).style.width, 10) / 4) + 'px';
                    }
                }
                if (actualObject.formFieldAnnotationType === 'Checkbox') {
                    const labelContainer: Element = htmlElement.firstElementChild.firstElementChild;
                    if (element.actualSize.width > element.actualSize.height) {
                        (htmlElement.firstElementChild as HTMLElement).style.display = 'inherit';
                        (labelContainer as HTMLElement).style.width = (labelContainer as HTMLElement).style.height = '100%';
                    } else {
                        (htmlElement.firstElementChild as HTMLElement).style.display = 'flex';
                        (labelContainer as HTMLElement).style.width = (labelContainer as HTMLElement).style.height = '100%';
                    }
                }
                if (actualObject.formFieldAnnotationType === 'BarcodeField') {
                    const barcodeField: PdfFormFieldBaseModel = actualObject as PdfFormFieldBaseModel;
                    if (barcodeField.bounds && element.actualSize) {
                        barcodeField.bounds.width = element.actualSize.width;
                        barcodeField.bounds.height = element.actualSize.height;
                    }
                    const glyphHost: HTMLElement = htmlElement.firstElementChild as HTMLElement;
                    if (glyphHost && glyphHost.hasAttribute('data-barcode-symbology')) {
                        this.refreshBarcodeGlyph(barcodeField, glyphHost);
                    } else {
                        this.refreshBarcodeGlyph(barcodeField);
                    }
                }
                if (actualObject.formFieldAnnotationType === 'SignatureField'  || actualObject.formFieldAnnotationType === 'InitialField'){
                    const signatureDiv: HTMLElement = htmlElement.firstElementChild.firstElementChild as HTMLElement;
                    const indicatorSpan: HTMLElement = signatureDiv.nextElementSibling as HTMLElement;
                    const bounds: DOMRect = this.getBounds(indicatorSpan as HTMLElement);
                    const options : ISignatureIndicatorOptions = {
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
                    this.updateSignatureandInitialIndicator(actualObject as PdfFormFieldBaseModel, options, signatureDiv);
                }
                const formFieldsData: any = JSON.parse(data);
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    if ((formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).formFieldAnnotationType === 'RadioButton') {
                        for (let j: number = 0; j < (formFieldsData[parseInt(i.toString(), 10)].FormField as
                        IFormField).radiobuttonItem.length; j++) {
                            if (element.id === (formFieldsData[parseInt(i.toString(), 10)].FormField as
                            IFormField).radiobuttonItem[parseInt(j.toString(), 10)].id) {
                                (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                                IFormField).radiobuttonItem[parseInt(j.toString(), 10)].lineBound =
                                 { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width *
                                     zoomValue, Height: element.actualSize.height * zoomValue };
                                (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                                IFormField).radiobuttonItem[parseInt(j.toString(), 10)].zoomValue = zoomValue;
                                break;
                            }
                        }
                    } else {
                        if (formFieldsData[parseInt(i.toString(), 10)].Key === element.id) {
                            (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).lineBound =
                             { X: point.x * zoomValue, Y: point.y * zoomValue, Width: element.actualSize.width *
                                 zoomValue, Height: element.actualSize.height * zoomValue };
                            if ((formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).signatureBound) {
                                let x: number = (point.x * zoomValue) + (element.actualSize.width * zoomValue) / 2;
                                x = x - (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).signatureBound.width / 2;
                                let y: number = (point.y * zoomValue) + (element.actualSize.height * zoomValue) / 2;
                                y = y - (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).signatureBound.height / 2;
                                (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).signatureBound.x = x;
                                (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).signatureBound.y = y;
                                (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                                IFormField).signatureBound =
                                 (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).signatureBound;
                                (this.pdfViewer.nameTable[element.id.split('_')[0] + '_content'] as PdfFormFieldBaseModel & IFormField).signatureBound = (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).signatureBound;
                            }
                            (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).lineBound =
                             (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).lineBound;
                        }

                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
            // DateTime only: field resize updates the diagram wrapper, not the picker glyph.
            // Reuse the zoom scaler so the icon tracks the live height the same way zoom does.
            if ((actualObject as PdfFormFieldBaseModel).isDateField) {
                const dateTimeComposite: HTMLElement = htmlElement.querySelector('.e-pv-datetime-composite') as HTMLElement;
                if (dateTimeComposite) {
                    const fieldHeightPx: number = element.actualSize.height * zoomValue;
                    this.pdfViewerBase.scaleDateTimePickerIcon(dateTimeComposite, fieldHeightPx);
                }
            }
        }
    }

    private getCheckboxRadioButtonBounds(drawingObject: PdfFormFieldBaseModel, bounds?: { width: number; height: number },
                                         isPrint?: boolean): { width: number, height: number, display: string } {
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
                if ((formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).formFieldAnnotationType === 'RadioButton') {
                    for (let j: number = 0; j < (formFieldsData[parseInt(i.toString(), 10)].FormField  as
                    IFormField).radiobuttonItem.length; j++) {
                        if (element.id === (formFieldsData[parseInt(i.toString(), 10)].FormField  as
                        IFormField).radiobuttonItem[parseInt(j.toString(), 10)].id) {
                            const radioButtonItemUpdate: IRadiobuttonItem = {
                                id: element.id, lineBound: {
                                    X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue,
                                    Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue
                                },
                                name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber,
                                value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                                fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize,
                                fontStyle: updatedFormFields.fontStyle,
                                fontColor: this.getRgbCode(updatedFormFields.color as string) as RGBA,
                                backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor as string) as RGBA,
                                borderColor: this.getRgbCode(updatedFormFields.borderColor as string) as RGBA,
                                thickness: updatedFormFields.thickness, textAlign: updatedFormFields.alignment,
                                isChecked: updatedFormFields.isChecked, isSelected: updatedFormFields.isSelected,
                                isReadonly: updatedFormFields.isReadonly, visibility: updatedFormFields.visibility,
                                maxLength: updatedFormFields.maxLength, isRequired: updatedFormFields.isRequired,
                                isPrint: updatedFormFields.isPrint, rotation: 0, tooltip: updatedFormFields.tooltip,
                                isMultiline: updatedFormFields.isMultiline, insertSpaces: updatedFormFields.insertSpaces,
                                isTransparent: updatedFormFields.isTransparent,
                                zIndex: updatedFormFields.zIndex, customData: updatedFormFields.customData
                            };
                            (formFieldsData[parseInt(i.toString(), 10)].FormField  as
                            IFormField).radiobuttonItem[parseInt(j.toString(), 10)] = radioButtonItemUpdate;
                            if (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)] &&
                                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField &&
                                (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                                IFormField).radiobuttonItem[parseInt(j.toString(), 10)]) {
                                (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                                IFormField).radiobuttonItem[parseInt(j.toString(), 10)] = radioButtonItemUpdate;
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
                        fontStyle: updatedFormFields.fontStyle, fontColor: this.getRgbCode(updatedFormFields.color as string) as RGBA,
                        backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor as string) as RGBA,
                        borderColor: this.getRgbCode(updatedFormFields.borderColor as string) as RGBA,
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
                        customData: updatedFormFields.customData,
                        symbology: updatedFormFields.symbology || BarcodeSymbology.PDF417,
                        xDimension: !isNullOrUndefined(updatedFormFields.xDimension) ? updatedFormFields.xDimension : 4,
                        errorCorrectionLevel: updatedFormFields.errorCorrectionLevel || Pdf417ErrorCorrectionLevel.Level5,
                        valueFormat: updatedFormFields.valueFormat || BarcodeValueFormat.TabDelimited,
                        includeFieldNames: updatedFormFields.includeFieldNames !== false,
                        fields: Array.isArray(updatedFormFields.fields) ? updatedFormFields.fields : [],
                        caption: updatedFormFields.caption || '',
                        compressData: updatedFormFields.compressData === true,
                        customValue: updatedFormFields.customValue || ''
                    };
                    // Preserve ButtonField AA (GoTo) across designer property-session rewrites.
                    // Designer annotation type is 'Button'; public API type is 'ButtonField'.
                    if (updatedFormFields.formFieldAnnotationType === 'Button' ||
                        !isNullOrUndefined(updatedFormFields.actions)) {
                        formDesignObj.actions = !isNullOrUndefined(updatedFormFields.actions) ?
                            updatedFormFields.actions :
                            (formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField).actions;
                    }
                    if ((formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).formFieldAnnotationType === 'SignatureField' || (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).formFieldAnnotationType === 'InitialField') {
                        const updatedSignatureFormFields: PdfFormFieldBaseModel = updatedFormFields;
                        const formDesignObj: IFormField = {
                            id: element.id, lineBound: {
                                X: element.bounds.x * zoomValue, Y: element.bounds.y * zoomValue,
                                Width: element.bounds.width * zoomValue, Height: element.bounds.height * zoomValue
                            },
                            name: updatedFormFields.name, zoomValue: zoomValue, pageNumber: updatedFormFields.pageNumber,
                            value: updatedFormFields.value, formFieldAnnotationType: updatedFormFields.formFieldAnnotationType,
                            fontFamily: updatedFormFields.fontFamily, fontSize: updatedFormFields.fontSize,
                            fontStyle: updatedFormFields.fontStyle, fontColor: this.getRgbCode(updatedFormFields.color as string) as RGBA,
                            backgroundColor: this.getRgbCode(updatedFormFields.backgroundColor as string) as RGBA,
                            borderColor: this.getRgbCode(updatedFormFields.borderColor as string) as RGBA,
                            thickness: updatedFormFields.thickness,
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
                            signatureType: updatedFormFields.signatureType, signatureBound: (
                                updatedSignatureFormFields as PdfFormFieldBaseModel & IFormField).signatureBound,
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
     * @param {PdfViewer} commandHandler - It describes about the command handler
     * @param {PdfFormFieldBaseModel} signatureField - It describes about the signature field
     * @param {Object} bounds - It describes about the form field bounds
     * @param {number} bounds.width - It describes about the form field bounds width
     * @param {number} bounds.height - It describes about the form field bounds height
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {HTMLElement} - html element
     */
    public createSignatureDialog(commandHandler: PdfViewer, signatureField: PdfFormFieldBaseModel,
                                 bounds?: { width: number; height: number }, isPrint?: boolean): HTMLElement {
        this.isInitialField = isNullOrUndefined((signatureField as InitialFieldSettings).isInitialField) ? false : (
            signatureField as InitialFieldSettings).isInitialField;
        this.pdfViewerBase.isInitialField = this.isInitialField;
        this.pdfViewerBase.isInitialField = (signatureField as InitialFieldSettings).isInitialField;
        const element: HTMLElement = createElement('div');
        element.className = 'foreign-object';
        element.style.position = 'absolute';
        element.style.width = '100%';
        element.style.height = '100%';
        element.addEventListener('focus', this.focusFormField.bind(this));
        element.addEventListener('blur', this.blurFormField.bind(this));
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
        (divElement as HTMLInputElement).disabled = signatureField.isReadonly;
        element.appendChild(divElement);
        const signatureFieldSettings: SignatureFieldSettingsModel = this.pdfViewer.signatureFieldSettings;
        const initialFieldSettings: InitialFieldSettingsModel = this.pdfViewer.initialFieldSettings;
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
        let indicatorSettings: SignatureIndicatorSettingsModel;
        if ((signatureField as InitialFieldSettings).isInitialField) {
            indicatorSettings = signatureField.signatureIndicatorSettings ?
                signatureField.signatureIndicatorSettings : initialFieldSettings.initialIndicatorSettings;
        }
        else {
            indicatorSettings = signatureField.signatureIndicatorSettings ?
                signatureField.signatureIndicatorSettings : signatureFieldSettings.signatureIndicatorSettings;
        }
        const defaultWidth: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width ===
         19 ? ((signatureField as InitialFieldSettings).isInitialField ? 30 : 25) : this.pdfViewer.signatureFieldSettings.
                signatureIndicatorSettings.width;
        const signatureFieldIndicatorWidth: number = indicatorSettings.width ? indicatorSettings.width :
            (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.width) ?
                signatureField.signatureIndicatorSettings.width : defaultWidth;
        const defaultHeight: number = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height ===
         10 ? 13 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height;
        const signatureFieldIndicatorHeight: number = indicatorSettings.height ? indicatorSettings.height :
            (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.height) ?
                signatureField.signatureIndicatorSettings.height : defaultHeight;
        const signatureFieldIndicatorBG: string = indicatorSettings.backgroundColor ? (indicatorSettings.backgroundColor === 'orange' ? '#FFE48559' : indicatorSettings.backgroundColor) : (signatureField.signatureIndicatorSettings && signatureField.signatureIndicatorSettings.backgroundColor) ? signatureField.signatureIndicatorSettings.backgroundColor : '#FFE48559';
        const signatureFieldWidth: number = signatureField.bounds ? signatureField.bounds.width : bounds.width;
        const signatureFieldHeight: number = signatureField.bounds ? signatureField.bounds.height : bounds.height;
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

        const spanElement: HTMLElement = createElement('span');
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
        const boundsOfSpan: DOMRect = this.getBounds(spanElement);
        //Set spanelement indicator property
        spanElement.style.backgroundColor = signatureFieldIndicatorBG;
        spanElement.style.color = indicatorSettings.color;
        spanElement.style.opacity = indicatorSettings.opacity.toString();
        spanElement.style.height = `${signatureFieldIndicatorHeight}px`;
        spanElement.style.width = `${signatureFieldIndicatorWidth}px`;
        spanElement.style.position = 'absolute';
        const widthNew : number = this.setHeightWidth(signatureFieldWidth, width, boundsOfSpan.width + fontSize, zoomValue);
        spanElement.style.width = widthNew + 'px';
        const heightNew : number = this.setHeightWidth(signatureFieldHeight, height, boundsOfSpan.height, zoomValue);
        spanElement.style.height = heightNew + 'px';
        if (zoomValue < 1 && fontSize <= 10 && fontSize > heightNew) {
            const heightValue: number = parseInt(spanElement.style.height, 10);
            spanElement.style.fontSize = (heightValue - this.signIndicatorPadding) < this.signIndicatorMinimunFontSize ? this.signIndicatorMinimunFontSize + 'px' : heightValue - this.signIndicatorPadding + 'px';
        }
        if (!isPrint) {
            element.appendChild(spanElement);
        }
        this.updateSignatureSettings(this.pdfViewer.initialFieldSettings as InitialFieldSettings, this.isInitialField);
        this.updateSignInitialFieldProperties(signatureField, (signatureField as InitialFieldSettings).isInitialField,
                                              this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        if (!this.isDrawHelper && !isNullOrUndefined(signatureField.tooltip) && signatureField.tooltip !== '') {
            this.setToolTip(signatureField.tooltip, element.firstElementChild);
        }
        this.updateSignatureSettings(this.pdfViewer.signatureFieldSettings as SignatureFieldSettings, this.isInitialField);
        this.updateSignatureFieldProperties(signatureField, element, isPrint);
        this.isDrawHelper = false;
        return element;
    }


    private setIndicatorText(spanElement: HTMLElement, fieldText: string, indicatorText: string, defaultText: string): void {
        spanElement.innerHTML = fieldText ? fieldText : indicatorText ? indicatorText : defaultText;
    }

    private getBounds(htmlElement : HTMLElement) : DOMRect {
        const clonedElement: HTMLElement = htmlElement.cloneNode(true) as HTMLElement;
        clonedElement.style.height = '';
        clonedElement.style.width = '';
        clonedElement.id = clonedElement.id + '_clonedElement';
        document.body.appendChild(clonedElement);
        const clone: HTMLElement = document.getElementById(clonedElement.id);
        const bounds: DOMRect | ClientRect = clone.getBoundingClientRect();
        document.body.removeChild(clonedElement);
        return bounds as DOMRect;
    }

    private updateSignatureandInitialIndicator(formFieldObject : PdfFormFieldBaseModel,
                                               options : ISignatureIndicatorOptions | InitialFieldSettings,
                                               htmlElement : HTMLElement): PdfFormFieldBaseModel | null {
        if (htmlElement !== null){
            const fieldBounds: DOMRect | ClientRect = htmlElement.getBoundingClientRect();
            const zoomValue: number = this.pdfViewerBase.getZoomFactor();
            const spanElement: HTMLElement = htmlElement.nextElementSibling as HTMLElement;
            let objIndicatorSettings: SignatureIndicatorSettingsModel;
            let indicatorSettings: SignatureIndicatorSettingsModel;
            if (formFieldObject.formFieldAnnotationType === 'SignatureField'){
                objIndicatorSettings  = formFieldObject.signatureIndicatorSettings;
                indicatorSettings = (options as ISignatureIndicatorOptions).signatureIndicatorSettings;
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
                    spanElement.style.fontSize = `${indicatorSettings.fontSize > (formFieldObject as { height: number }).height / 2 ? 10 : indicatorSettings.fontSize * zoomValue}px`;
                    objIndicatorSettings.fontSize = indicatorSettings.fontSize;
                }
                const bounds: DOMRect = this.getBounds(spanElement);
                if (indicatorSettings.color){
                    spanElement.style.color = indicatorSettings.color;
                    objIndicatorSettings.color = this.nameToHash(indicatorSettings.color);
                }
                if (indicatorSettings.backgroundColor){
                    spanElement.style.backgroundColor = indicatorSettings.backgroundColor;
                    objIndicatorSettings.backgroundColor = this.nameToHash(indicatorSettings.backgroundColor);
                }
                if (!isNullOrUndefined(indicatorSettings.opacity)) {
                    spanElement.style.opacity = indicatorSettings.opacity.toString();
                    objIndicatorSettings.opacity = indicatorSettings.opacity;
                }
                if (indicatorSettings.width || (options as ISignatureIndicatorOptions).width || indicatorSettings.text){
                    const width: number = this.setHeightWidth(fieldBounds.width, indicatorSettings.width, bounds.width
                        + formFieldObject.signatureIndicatorSettings.fontSize, zoomValue);
                    spanElement.style.width = width + 'px';
                    objIndicatorSettings.width = width;
                }
                if (indicatorSettings.height || (options as ISignatureIndicatorOptions).height || indicatorSettings.text){
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
        return null;
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
        element.style.visibility = drawingObject.visibility;
        const select: HTMLSelectElement = document.createElement('select');
        select.addEventListener('change', this.dropdownChange.bind(this));
        select.addEventListener('focus', this.focusFormField.bind(this));
        select.addEventListener('blur', this.blurFormField.bind(this));
        select.id = drawingObject.id;
        select.name = 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + dropdownElement.id;
        select.setAttribute('aria-label', 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + dropdownElement.id );
        select.className = 'e-pv-formfield-dropdown';
        select.style.width = '100%';
        select.style.height = '100%';
        select.style.position = 'absolute';
        this.updateDropDownFieldSettings(this.pdfViewer.DropdownFieldSettings as DropdownFieldSettings);
        this.updateDropdownFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        if (drawingObject && drawingObject.isReadonly) {
            element.style.background = 'transparent';
        }
        else {
            element.style.background = drawingObject.backgroundColor as string;
        }
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
        if (isNullOrUndefined(drawingObject.selectedIndex) || drawingObject.selectedIndex.length === 0) {
            select.selectedIndex = -1;
        }
        else {
            select.selectedIndex = !isNullOrUndefined(drawingObject.selectedIndex) ? drawingObject.selectedIndex[0] : 0;
        }
        element.appendChild(select);
        if (!this.isDrawHelper && !isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip !== '') {
            this.setToolTip(drawingObject.tooltip, element.firstElementChild);
        }
        this.isDrawHelper = false;
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
        element.style.visibility = drawingObject.visibility;
        const select: HTMLSelectElement = document.createElement('select');
        select.addEventListener('click', this.listBoxChange.bind(this));
        select.addEventListener('focus', this.focusFormField.bind(this));
        select.addEventListener('blur', this.blurFormField.bind(this));
        select.id = drawingObject.id;
        select.name = 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + listBoxElement.id;
        select.setAttribute('aria-label', 'editabledropdown' + this.pdfViewerBase.activeElements.activePageID + listBoxElement.id );
        select.className = 'e-pv-formfield-listbox';
        select.style.width = '100%';
        select.style.height = '100%';
        select.style.position = 'absolute';
        select.multiple = true;
        this.updateListBoxFieldSettings(this.pdfViewer.listBoxFieldSettings as ListBoxFieldSettings);
        this.updatelistBoxFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible, this.isSetFormFieldMode);
        if (drawingObject && drawingObject.isReadonly) {
            element.style.background = 'transparent';
        }
        else {
            element.style.background = drawingObject.backgroundColor as string;
        }
        const dropDownChildren: ItemModel[] = drawingObject.options ? drawingObject.options : [];
        this.updateListBoxProperties(drawingObject, select, isPrint);
        for (let j: number = 0; j < dropDownChildren.length; j++) {
            const option: HTMLOptionElement = document.createElement('option');
            option.className = 'e-pv-formfield-listbox';
            option.value = dropDownChildren[parseInt(j.toString(), 10)].itemValue;
            option.text = dropDownChildren[parseInt(j.toString(), 10)].itemName;
            if (!isNullOrUndefined(drawingObject.selectedIndex)) {
                for (let k: number = 0; k < drawingObject.selectedIndex.length; k++) {
                    if (j === drawingObject.selectedIndex[parseInt(k.toString(), 10)]) {
                        option.selected = true;
                    }
                }
            }
            select.appendChild(option);
        }
        element.appendChild(select);
        if (!this.isDrawHelper && !isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip !== '') {
            this.setToolTip(drawingObject.tooltip, element.firstElementChild);
        }
        this.isDrawHelper = false;
        return element;
    }

    /**
     * @param {string} formFieldAnnotationType - It describes about the form field annotation type
     * @param {PdfFormFieldBaseModel} drawingObject - It describes about the drawing object
     * @param {Object} formFieldBounds - It describes about the form field bounds
     * @param {number} formFieldBounds.width - It describes about the form field bounds width
     * @param {number} formFieldBounds.height - It describes about the form field bounds height
     * @param {boolean} isPrint - It describes about the isPrint
     * @private
     * @returns {HTMLElement} - html element
     */
    public createInputElement(formFieldAnnotationType: string, drawingObject: PdfFormFieldBaseModel,
                              formFieldBounds?: { width: number; height: number }, isPrint?: boolean): HTMLElement {
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
        if (!this.isRerender) {
            this.updateTextFieldSettings(this.pdfViewer.textFieldSettings as TextFieldSettings);
        }
        if (formFieldAnnotationType === 'Textbox') {
            if (drawingObject.isMultiline) {
                textArea = this.createTextAreaElement(inputElement.id);
                if (!this.isRerender) {
                    this.updateTextFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                          this.isSetFormFieldMode);
                }

                this.updateTextboxProperties(drawingObject, textArea, isPrint);
            } else if (drawingObject.isDateField) {
                inputElement = this.createDateTimeCompositeElement(inputElement.id, drawingObject);
                if (!this.isRerender) {
                    this.updateTextFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                          this.isSetFormFieldMode);
                }
                // Pass composite wrapper so chrome (border/bg) applies as one field.
                this.updateTextboxProperties(drawingObject, inputElement, isPrint);
            } else {
                inputElement = this.createTextboxElement(inputElement.id);
                if (!this.isRerender) {
                    this.updateTextFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                          this.isSetFormFieldMode);
                }

                this.updateTextboxProperties(drawingObject, inputElement, isPrint);
            }
        } else if (formFieldAnnotationType === 'Checkbox') {
            const zoomLevel: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            const bounds: { width: number, height: number, display: string } = this.getCheckboxRadioButtonBounds(drawingObject,
                                                                                                                 formFieldBounds, isPrint);
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
                checkboxDiv.addEventListener('focus', this.focusFormField.bind(this));
                checkboxDiv.addEventListener('blur', this.blurFormField.bind(this));
            }
            (checkboxDiv as HTMLElement).id = drawingObject.id + '_input';
            if (drawingObject.isChecked) {
                innerSpan = createElement('span', { className: 'e-pv-checkbox-span e-pv-cb-check' });
            }
            else
            {innerSpan = createElement('span', { className: 'e-pv-checkbox-span e-pv-cb-uncheck' }); }
            innerSpan.id = drawingObject.id + '_input_span';
            innerSpan.style.pointerEvents = 'none';
            labelElement.id = drawingObject.id + '_input_label';
            const svgNs: string = 'http://www.w3.org/2000/svg';
            const tickSvg: SVGSVGElement = document.createElementNS(svgNs, 'svg') as SVGSVGElement;
            tickSvg.setAttribute('class', 'e-pv-checkbox-tick-svg');
            tickSvg.setAttribute('viewBox', '0 0 24 24');
            tickSvg.setAttribute('fill', 'none');
            tickSvg.setAttribute('stroke', '#111827');
            tickSvg.setAttribute('stroke-width', '2.5');
            tickSvg.setAttribute('stroke-linecap', 'round');
            tickSvg.setAttribute('stroke-linejoin', 'round');
            tickSvg.setAttribute('aria-hidden', 'true');
            tickSvg.style.width = '100%';
            tickSvg.style.height = '100%';
            const tickPath: SVGPathElement = document.createElementNS(svgNs, 'path') as SVGPathElement;
            tickPath.setAttribute('d', 'M4.5 12.5L9.5 17.5L19.5 6.5');
            tickSvg.appendChild(tickPath);
            tickSvg.style.display = drawingObject.isChecked ? 'block' : 'none';
            if (isPrint) {
                checkboxDiv.style.backgroundColor = 'rgb(218, 234, 247)';
                checkboxDiv.style.border = '1px solid #303030';
                checkboxDiv.style.visibility = 'visible';
                checkboxDiv.style.height = '100%';
                checkboxDiv.style.width = '100%';
                checkboxDiv.style.position = 'absolute';
                tickSvg.style.display = drawingObject.isChecked ? 'block' : 'none';
                inputElement.style.outlineWidth = drawingObject.thickness + 'px';
                inputElement.style.outlineColor = drawingObject.borderColor as string;
                inputElement.style.outlineStyle = 'solid';
                inputElement.style.background = drawingObject.backgroundColor as string;
            }
            (inputElement as IElement).type = 'checkbox';
            inputElement.style.margin = '0px';
            inputElement.style.width = bounds.width + 'px';
            inputElement.style.height = bounds.height + 'px';
            this.updateCheckBoxFieldSettings(this.pdfViewer.checkBoxFieldSettings as CheckBoxFieldSettings);
            if (!isPrint) {
                this.updateCheckBoxFieldSettingsProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                           this.isSetFormFieldMode);
            }
            this.updateCheckboxProperties(drawingObject, checkboxDiv);
            inputElement.appendChild(labelElement);
            labelElement.appendChild(checkboxDiv);
            checkboxDiv.appendChild(innerSpan);
            innerSpan.appendChild(tickSvg);
        } else if (formFieldAnnotationType === 'PasswordField') {
            (inputElement as IElement).type = 'password';
            inputElement.className = 'e-pv-formfield-input';
            inputElement.style.width = '100%';
            inputElement.style.height = '100%';
            inputElement.style.borderStyle = 'solid';
            inputElement.addEventListener('click', this.inputElementClick.bind(this));
            inputElement.addEventListener('focus', this.focusFormField.bind(this));
            inputElement.addEventListener('blur', this.blurFormField.bind(this));
            inputElement.addEventListener('change', this.getTextboxValue.bind(this));
            this.updatePasswordFieldSettings(this.pdfViewer.passwordFieldSettings as PasswordFieldSettings);
            this.updatePasswordFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                      this.isSetFormFieldMode);
            this.updatePasswordFieldProperties(drawingObject, inputElement, isPrint);
        } else if (formFieldAnnotationType === 'Button') {
            // Product lock NO-IMAGE-CAPTION: text caption only (no img/imageSource render path).
            (inputElement as HTMLInputElement).type = 'button';
            inputElement.className = 'e-pv-formfield-input e-pv-buttonItem';
            inputElement.style.width = '100%';
            inputElement.style.height = '100%';
            inputElement.style.borderStyle = 'solid';
            inputElement.style.cursor = this.isDrawHelper ? 'crosshair' : 'pointer';
            (inputElement as HTMLInputElement).value = !isNullOrUndefined(drawingObject.value) ?
                drawingObject.value as string : '';
            // Wire AA event listeners so designer-added buttons dispatch GoTo actions.
            // Mirrors the listener set used by the server-loaded renderFormFields path.
            // Focus/blur reuse designer chrome (same as Text Box) without changing Tab order navigation.
            if (!isPrint) {
                const formFields: FormFields = this.pdfViewer.formFieldsModule;
                (inputElement as HTMLInputElement).addEventListener('click', (ev: MouseEvent) => {
                    formFields.updateFormFields(ev);
                });
                (inputElement as HTMLInputElement).addEventListener('mouseenter', (ev: MouseEvent) => {
                    formFields.triggerButtonSlotFromDom(ev.target as HTMLElement, 'mouseEnter');
                });
                (inputElement as HTMLInputElement).addEventListener('mouseleave', (ev: MouseEvent) => {
                    formFields.triggerButtonSlotFromDom(ev.target as HTMLElement, 'mouseLeave');
                });
                (inputElement as HTMLInputElement).addEventListener('mousedown', (ev: MouseEvent) => {
                    formFields.triggerButtonSlotFromDom(ev.target as HTMLElement, 'mouseDown');
                });
                (inputElement as HTMLInputElement).addEventListener('focus', (ev: FocusEvent) => {
                    this.focusFormField(ev);
                    formFields.triggerButtonSlotFromDom(ev.target as HTMLElement, 'gotFocus');
                });
                (inputElement as HTMLInputElement).addEventListener('blur', (ev: FocusEvent) => {
                    this.blurFormField(ev);
                    formFields.triggerButtonSlotFromDom(ev.target as HTMLElement, 'lostFocus');
                });
            }
            // Keep Button focusable like other designer inputs (native tab cycle; no custom Tab walk).
            inputElement.tabIndex = this.formFieldIndex;
            inputElement.style.background = !isNullOrUndefined(drawingObject.backgroundColor) ?
                drawingObject.backgroundColor as string : '#daeaf7';
            inputElement.style.color = !isNullOrUndefined(drawingObject.color) ? drawingObject.color as string : 'black';
            inputElement.style.borderColor = !isNullOrUndefined(drawingObject.borderColor) ?
                drawingObject.borderColor as string : '#303030';
            inputElement.style.borderWidth = (!isNullOrUndefined(drawingObject.thickness) ? drawingObject.thickness : 1) + 'px';
            inputElement.style.fontFamily = !isNullOrUndefined(drawingObject.fontFamily) ? drawingObject.fontFamily : 'Helvetica';
            inputElement.style.fontSize = (!isNullOrUndefined(drawingObject.fontSize) ? drawingObject.fontSize : 10) + 'px';
            inputElement.style.textAlign = !isNullOrUndefined(drawingObject.alignment) ?
                (drawingObject.alignment as string).toLowerCase() : 'center';
            // Reload appearance: apply font flags (same pattern as textbox update*Properties).
            this.applyButtonFontStyleFromModel(inputElement, drawingObject);
            if (!isNullOrUndefined(drawingObject.visibility)) {
                inputElement.style.visibility = drawingObject.visibility as string;
            }
            if (drawingObject.isReadonly) {
                (inputElement as HTMLInputElement).disabled = true;
            }
            if (!this.isRerender) {
                this.updateButtonFieldSettings(this.pdfViewer.buttonFieldSettings as ButtonFieldSettings);
                this.updateButtonFieldSettingProperties(drawingObject, this.pdfViewer.isFormDesignerToolbarVisible,
                                                        this.isSetFormFieldMode);
            }
            // Re-apply caption/style after global buttonFieldSettings may have updated the drawing object.
            (inputElement as HTMLInputElement).value = !isNullOrUndefined(drawingObject.value) ?
                drawingObject.value as string : '';
            inputElement.tabIndex = this.formFieldIndex;
            inputElement.style.background = !isNullOrUndefined(drawingObject.backgroundColor) ?
                drawingObject.backgroundColor as string : '#daeaf7';
            inputElement.style.color = !isNullOrUndefined(drawingObject.color) ? drawingObject.color as string : 'black';
            inputElement.style.borderColor = !isNullOrUndefined(drawingObject.borderColor) ?
                drawingObject.borderColor as string : '#303030';
            inputElement.style.borderWidth = (!isNullOrUndefined(drawingObject.thickness) ? drawingObject.thickness : 1) + 'px';
            inputElement.style.fontFamily = !isNullOrUndefined(drawingObject.fontFamily) ? drawingObject.fontFamily : 'Helvetica';
            inputElement.style.fontSize = (!isNullOrUndefined(drawingObject.fontSize) ? drawingObject.fontSize : 10) + 'px';
            inputElement.style.textAlign = !isNullOrUndefined(drawingObject.alignment) ?
                (drawingObject.alignment as string).toLowerCase() : 'center';
            this.applyButtonFontStyleFromModel(inputElement, drawingObject);
            if (!isNullOrUndefined(drawingObject.visibility)) {
                inputElement.style.visibility = drawingObject.visibility as string;
            }
            if (drawingObject.isReadonly) {
                (inputElement as HTMLInputElement).disabled = true;
            }
        } else if (formFieldAnnotationType === 'BarcodeField') {
            const bounds: { width: number, height: number } = formFieldBounds ? {
                width: formFieldBounds.width || (formFieldBounds as any).Width,
                height: formFieldBounds.height || (formFieldBounds as any).Height
            } : (drawingObject.bounds ? {
                width: drawingObject.bounds.width,
                height: drawingObject.bounds.height
            } : { width: 200, height: 80 });
            const glyphBounds: { width: number, height: number } =
                this.getZoomedBarcodeBounds(bounds, zoomValue);
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.backgroundColor = (drawingObject.backgroundColor as string) || '#ffffffff';
            element.style.boxSizing = 'border-box';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
            element.style.padding = '0';
            element.style.margin = '0';
            element.style.overflow = 'hidden';
            element.style.cursor = this.isDrawHelper ? 'crosshair' : 'default';
            element.style.visibility = drawingObject.visibility || 'visible';
            let value: string = drawingObject.value as string;
            if (value === '') {
                const resolved: string | null = this.resolveBarcodeValue(drawingObject);
                value = (resolved === null || resolved === undefined) ? '' : resolved;
            }
            if (value === '' && this.isDrawHelper) {
                const placeholder: HTMLElement = createElement('div', { className: 'e-pv-formfield-barcode-placeholder' });
                placeholder.style.width = '100%';
                placeholder.style.height = '100%';
                placeholder.style.pointerEvents = 'none';
                placeholder.setAttribute('data-barcode-placeholder', 'true');
                element.appendChild(placeholder);
            } else {
                const barcode: HTMLElement = renderBarcodeField(
                    value, {
                        width: glyphBounds.width,
                        height: glyphBounds.height
                    }, {
                        symbology: drawingObject.symbology || 'QRCode',
                        errorCorrection: drawingObject.errorCorrectionLevel
                    });
                barcode.style.pointerEvents = 'none';
                element.appendChild(barcode);
                queueMicrotask((): void => {
                    if (!barcode.isConnected) { return; }
                    mountBarcodeGenerator(
                        barcode,
                        value, {
                            width: glyphBounds.width,
                            height: glyphBounds.height
                        }, {
                            symbology: drawingObject.symbology || 'QRCode',
                            errorCorrection: drawingObject.errorCorrectionLevel,
                            caption: drawingObject.caption,
                            xDimension: drawingObject.xDimension,
                            compressData: drawingObject.compressData === true
                        });
                });
            }
        } else {
            element.style.display = 'flex';
            element.style.justifyContent = 'center';
            element.style.alignItems = 'center';
            const bounds: { width: number, height: number, display: string } = this.getCheckboxRadioButtonBounds(drawingObject,
                                                                                                                 formFieldBounds, isPrint);
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
            if (drawingObject && drawingObject.isReadonly) {
                labelElement.style.background = 'transparent';
            }
            else {
                labelElement.style.background = drawingObject.backgroundColor as string;
            }
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
            inputElement.addEventListener('click', function (event: Event): void {
                event.stopPropagation();
            });
            inputElement.addEventListener('focus', this.focusFormField.bind(this));
            inputElement.addEventListener('blur', this.blurFormField.bind(this));
            inputElement.style.width = bounds.width + 'px';
            inputElement.style.height = bounds.height + 'px';
            this.updateRadioButtonFieldSettings(this.pdfViewer.radioButtonFieldSettings as RadioButtonFieldSettings);
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
        else if (formFieldAnnotationType !== 'BarcodeField') {
            if (drawingObject.isMultiline) {
                element.appendChild(textArea);
            } else {
                element.appendChild(inputElement);
            }
        }
        if (!this.isDrawHelper && !isNullOrUndefined(drawingObject.tooltip) && drawingObject.tooltip !== '') {
            if (formFieldAnnotationType === 'RadioButton')
            {this.setToolTip(drawingObject.tooltip, labelElement); }
            else if (formFieldAnnotationType === 'Textbox' || formFieldAnnotationType === 'PasswordField') {
                const tipTarget: Element = drawingObject.isDateField && element.firstElementChild &&
                    (element.firstElementChild as HTMLElement).classList.contains('e-pv-datetime-composite')
                    ? (element.firstElementChild.querySelector('.e-pv-formfield-input') || element.firstElementChild)
                    : element.firstElementChild;
                this.setToolTip(drawingObject.tooltip, tipTarget);
            }
            else if (formFieldAnnotationType === 'Checkbox') {
                this.setToolTip(drawingObject.tooltip, element.firstElementChild.lastElementChild);
            }
            else if (formFieldAnnotationType === 'BarcodeField') {
                this.setToolTip(drawingObject.tooltip, element.firstElementChild);
            }
        }
        this.isDrawHelper = false;
        return element;
    }

    private listBoxChange(event: Event): void {
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        let targetField: FormFieldModel = null;
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.currentTarget as Element).id.split('_')[0] ||
                (this.pdfViewer.nameTable[(event.currentTarget as Element).id.split('_')[0]] as PdfFormFieldBaseModel).name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.currentTarget as Element).id.split('_')[0]) {
                    const inputElement: Element = document.getElementById((formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_content_html_element')).firstElementChild.firstElementChild;
                    for (let k: number = 0; k < (event.currentTarget as IElement).options.length; k++) {
                        (inputElement as IElement).options[parseInt(k.toString(), 10)].selected =
                         (event.currentTarget as IElement).options[parseInt(k.toString(), 10)].selected;
                    }
                }
                formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex = [];
                const oldValues: number[] = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex;
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
                    const oldValue: string = (formFieldsData[parseInt(i.toString(), 10)].FormField.
                        option)[parseInt(oldValueIndex.toString(), 10)].itemValue;
                    formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex.push(selectIndex);
                    (this.pdfViewer.nameTable[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]] as PdfFormFieldBaseModel).selectedIndex = formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex;
                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex =
                     formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex;
                    const newValue: string = formFieldsData[parseInt(i.toString(), 10)].FormField.option[parseInt(selectIndex.toString(),
                                                                                                                  10)].itemValue;
                    this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = newValue;
                    this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                    PdfFormFieldBaseModel);
                    targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: FormFieldModel): boolean { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                    this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                      false, false, false, false, false, false, false, false,
                                                                      false, false, false, false, false, oldValue, newValue);
                    if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                        formFieldsData[parseInt(i.toString(), 10)].FormField.bounds =
                            (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).lineBound;
                        formFieldsData[parseInt(i.toString(), 10)].FormField.value = newValue;
                        this.pdfViewer.fireFormFieldChangedEvent(EditAction.Modify, formFieldsData[parseInt(i.toString(), 10)].FormField as
                        FormFieldModel);
                    }
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
        if (this.pdfViewer.readOnlySettings.formFields) {
            event.preventDefault();
            return;
        }
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        let targetField: FormFieldModel = null;
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.target as Element).id.split('_')[0] ||
                (this.pdfViewer.nameTable[(event.target as Element).id.split('_')[0]] as PdfFormFieldBaseModel).name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex = [];
                const selectIndex: number = (document.getElementById((event.currentTarget as Element).id) as IElement).selectedIndex;
                let oldValueIndex: number = 0;
                const selectedIndex: number[] | number = formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex;
                if ((selectedIndex as number[]).length !== 0) {
                    oldValueIndex = isNullOrUndefined((selectedIndex as number[]).length) ? (
                        selectedIndex as number[]).pop() : selectedIndex as number;
                    formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex.push(oldValueIndex);
                }
                const oldValue: string = oldValueIndex !== -1 ? (formFieldsData[parseInt(i.toString(), 10)].FormField.
                    option)[parseInt(oldValueIndex.toString(), 10)].itemValue : '';
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex.push(selectIndex);
                formFieldsData[parseInt(i.toString(), 10)].FormField.selectedIndex =
                 this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex;
                (this.pdfViewer.nameTable[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]] as PdfFormFieldBaseModel).selectedIndex = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.selectedIndex;
                const newValue: string = (formFieldsData[parseInt(i.toString(), 10)].
                    FormField.option)[parseInt(selectIndex.toString(), 10)].itemValue;
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value = newValue;
                if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.target as Element).id.split('_')[0]) {
                    const inputElement: Element = document.getElementById((formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_content_html_element')).firstElementChild.firstElementChild;
                    (inputElement as IElement).selectedIndex = selectIndex;
                }
                this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                PdfFormFieldBaseModel);
                targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: FormFieldModel): boolean { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                  false, false, false, false, false, false, false, false,
                                                                  false, false, false, false, false, oldValue, newValue);
                if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                    formFieldsData[parseInt(i.toString(), 10)].FormField.bounds =
                        (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).lineBound;
                    formFieldsData[parseInt(i.toString(), 10)].FormField.value = newValue;
                    this.pdfViewer.fireFormFieldChangedEvent(EditAction.Modify, formFieldsData[parseInt(i.toString(), 10)].FormField as
                    FormFieldModel);
                }
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, null, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, 'FormField Value Change', '', oldValueIndex, selectIndex);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        this.updateFormFieldSessions(targetField);
    }

    public setCheckBoxState(event: Event): void {
        if (this.pdfViewer.readOnlySettings.formFields) {
            return;
        }
        if ((Browser.isDevice) ? ((event.target as Element).classList.contains('') || (event.target as Element).classList.contains('e-pv-checkbox-outer-div') || (event.target as Element).classList.contains('e-pv-checkbox-div')) && (event.currentTarget as Element).classList.contains('e-pv-checkbox-outer-div') && !this.pdfViewer.designerMode : !this.pdfViewer.designerMode) {
            let isChecked: boolean = false;
            let checkTarget: Element;
            let targetField: FormFieldModel = null;
            if (Browser.isDevice) {
                checkTarget = document.getElementById((event.target as Element).id.split('_')[0] + '_input');
            } else {
                checkTarget = (event.target as Element);
            }
            if ((event.target as Element).id !== 'undefined_input' && !(this.pdfViewer.nameTable[(event.target as Element).id.split('_')[0]] as PdfFormFieldBaseModel).isReadonly && !this.pdfViewer.designerMode) {
                if (checkTarget && checkTarget.firstElementChild && checkTarget.firstElementChild.className === 'e-pv-checkbox-span e-pv-cb-check') {
                    checkTarget.firstElementChild.classList.remove('e-pv-cb-check');
                    checkTarget.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-uncheck');
                    const tickSvg: HTMLElement | null = checkTarget.firstElementChild ?
                        checkTarget.firstElementChild.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null :
                        null;
                    if (tickSvg) {
                        tickSvg.style.display = 'none';
                    }
                    isChecked = false;
                } else if (checkTarget.className === 'e-pv-checkbox-span e-pv-cb-check') {
                    checkTarget.classList.remove('e-pv-cb-check');
                    checkTarget.classList.add('e-pv-checkbox-span', 'e-pv-cb-uncheck');
                    const tickSvg: HTMLElement | null = checkTarget.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null;
                    if (tickSvg) {
                        tickSvg.style.display = 'none';
                    }
                    isChecked = false;
                } else {
                    checkTarget.firstElementChild.classList.remove('e-pv-cb-uncheck');
                    checkTarget.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-check');
                    const tickSvg: HTMLElement | null = checkTarget.firstElementChild ?
                        checkTarget.firstElementChild.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null :
                        null;
                    if (tickSvg) {
                        tickSvg.style.display = 'block';
                    }
                    isChecked = true;
                }
                const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                const formFieldsData: any = JSON.parse(data);
                const targetId: string = (event.target as Element).id.split('_')[0];
                const table: Record<string, PdfAnnotationBaseModel | PdfFormFieldBaseModel> = this.pdfViewer.nameTable;
                let entryName: PdfAnnotationBaseModel | PdfFormFieldBaseModel | undefined;
                if (table && Object.prototype.hasOwnProperty.call(table, targetId)) {
                    // Safe access: key existence verified by hasOwnProperty check above
                    // eslint-disable-next-line security/detect-object-injection
                    entryName = table[targetId];
                }
                const groupName: string | undefined = entryName ? (entryName as PdfFormFieldBaseModel).name : undefined;
                const preSnapshot: { Key: string; id: string; value: string; isChecked: boolean }[] = this.pdfViewerBase.formFieldCollection
                    .filter((f: IFormFieldCollection) => f.FormField.name === groupName && (f.FormField as PdfFormFieldBaseModel).formFieldAnnotationType === 'Checkbox')
                    .map((f: IFormFieldCollection) => ({ Key: f.Key, id: f.Key.split('_')[0], value: f.FormField.value as string, isChecked: !!f.FormField.isChecked }));
                let targetIndexForAction: number = -1;
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.target as Element).id.split('_')[0] ||
                        (this.pdfViewer.nameTable[(event.target as Element).id.split('_')[0]] as PdfFormFieldBaseModel).name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                        let targetChecked: boolean = isChecked;
                        if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.target as Element).id.split('_')[0] &&
                            (this.pdfViewer.nameTable[(event.target as Element).id.split('_')[0]] as PdfFormFieldBaseModel).name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                            if (isChecked && (this.pdfViewer.nameTable[(event.target as Element).id.split('_')[0]] as PdfFormFieldBaseModel).value !== formFieldsData[parseInt(i.toString(), 10)].FormField.value) {
                                targetChecked = false;
                            }
                        }
                        (this.pdfViewer.nameTable[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]] as PdfFormFieldBaseModel).isChecked = targetChecked;
                        (this.pdfViewer.nameTable[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]] as PdfFormFieldBaseModel).isSelected = targetChecked;
                        const oldValue: boolean = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.isChecked;
                        formFieldsData[parseInt(i.toString(), 10)].FormField.isChecked = targetChecked;
                        formFieldsData[parseInt(i.toString(), 10)].FormField.isSelected = targetChecked;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.isChecked =
                         formFieldsData[parseInt(i.toString(), 10)].FormField.isChecked;
                        this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.isSelected =
                         formFieldsData[parseInt(i.toString(), 10)].FormField.isChecked;
                        if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.target as Element).id.split('_')[0]) {
                            const checkboxDivElement: Element = document.getElementById(formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_input');
                            if (checkboxDivElement) {
                                const checkboxElement: Element = checkboxDivElement.firstElementChild;
                                if (targetChecked) {
                                    if (checkboxElement.classList.contains('e-pv-cb-uncheck')) { checkboxElement.classList.remove('e-pv-cb-uncheck'); }
                                    checkboxElement.classList.add('e-pv-cb-check');
                                    const tickSvg: HTMLElement | null = checkboxElement.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null;
                                    if (tickSvg) {
                                        tickSvg.style.display = 'block';
                                    }
                                } else {
                                    if (checkboxElement.classList.contains('e-pv-cb-check')) { checkboxElement.classList.remove('e-pv-cb-check'); }
                                    checkboxElement.classList.add('e-pv-cb-uncheck');
                                    const tickSvg: HTMLElement | null = checkboxElement.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null;
                                    if (tickSvg) {
                                        tickSvg.style.display = 'none';
                                    }
                                }
                            }
                        }
                        this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                        PdfFormFieldBaseModel);
                        if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.target as Element).id.split('_')[0]) {
                            targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: FormFieldModel): boolean { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                            targetIndexForAction = parseInt(i.toString(), 10);
                        }
                        this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField, (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber as number), true, false, false,
                                                                          false, false, false, false, false, false, false, false,
                                                                          false, false, false, false, false , oldValue.toString(), '', targetChecked);
                        if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                            formFieldsData[parseInt(i.toString(), 10)].FormField.bounds =
                                (formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField).lineBound;
                            this.pdfViewer.fireFormFieldChangedEvent(EditAction.Modify,
                                                                     formFieldsData[parseInt(i.toString(),
                                                                                             10)].FormField as
                                                                                             FormFieldModel);
                        }
                    }
                }
                const postSnapshot: { Key: string; id: string; value: string; isChecked: boolean }[] = this.pdfViewerBase.
                    formFieldCollection
                    .filter((f: IFormFieldCollection) => f.FormField.name === groupName && (f.FormField as PdfFormFieldBaseModel).formFieldAnnotationType === 'Checkbox')
                    .map((f: IFormFieldCollection) => ({ Key: f.Key, id: f.Key.split('_')[0], value: f.FormField.value as string, isChecked: !!f.FormField.isChecked }));
                if (this.pdfViewer.annotation && targetIndexForAction > -1) {
                    const collectionItem: IFormFieldCollection = this.pdfViewerBase.formFieldCollection.find(function (
                        _f: IFormFieldCollection, idx: number): boolean {
                        return idx === targetIndexForAction;
                    });
                    if (collectionItem && collectionItem.FormField) {
                        const actionAnnotation: IFormField = collectionItem.FormField as IFormField;
                        this.pdfViewer.annotation.addAction(actionAnnotation.pageNumber, null, actionAnnotation, 'FormField Value Change', '', preSnapshot, postSnapshot);
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                this.updateFormFieldSessions(targetField);
            }
        }
    }

    private setCheckedValue(element: Element, isChecked?: boolean): void {
        if (isChecked) {
            element.firstElementChild.classList.remove('e-pv-cb-uncheck');
            element.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-check');
            const tickSvg: HTMLElement | null = element.firstElementChild ? element.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null : null;
            if (tickSvg) {
                tickSvg.style.display = 'block';
            }
        } else {
            element.firstElementChild.classList.remove('e-pv-cb-check');
            element.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-uncheck');
            const tickSvg: HTMLElement | null = element.firstElementChild ? element.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null : null;
            if (tickSvg) {
                tickSvg.style.display = 'none';
            }
        }
    }

    private setRadioButtonState(event: Event): void {
        if (this.pdfViewer.readOnlySettings.formFields) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        const storedData: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(storedData || '[]');
        const clickedKey: string = ((event.currentTarget as HTMLElement) && (event.currentTarget as HTMLElement).id || '').split('_')[0];
        const viewer: PdfViewer = this.pdfViewer;
        const base: PdfViewerBase = this.pdfViewerBase;
        let targetField: FormFieldModel = null;
        let clicked: IFormFieldSessionData | null = null;
        const getElement: (id: string) => HTMLInputElement | null = (id: string): HTMLInputElement | null => {
            const cut: number = id.indexOf('_');
            const baseId: string = cut > -1 ? id.substring(0, cut) : id;
            return document.getElementById(baseId) as HTMLInputElement | null;
        };
        const fireChangeEvent: (formField: IFormField, page: number) => void = (formField: IFormField, page: number): void => {
            viewer.fireFormFieldPropertiesChangeEvent(
                'formFieldPropertiesChange',
                formField, page,
                true, false, false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false, true
            );
        };
        const fireChangedEvent: (updatedField: IRadiobuttonItem | FormFieldModel) => void =
        (updatedField: IRadiobuttonItem | FormFieldModel): void => {
            if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                if ((updatedField as IRadiobuttonItem).formFieldAnnotationType === 'RadioButton') {
                    updatedField = this.updateRadioButtonItem(updatedField as FormFieldModel);
                }
                if (updatedField) {
                    updatedField.bounds = (updatedField as IRadiobuttonItem).lineBound;
                    this.pdfViewer.fireFormFieldChangedEvent(EditAction.Modify, updatedField as unknown as FormFieldModel);
                }
            }
        };
        const updateForm: (item: IRadiobuttonItem) => void = (item: IRadiobuttonItem): void => this.updateFormFieldCollections(item as
            PdfFormFieldBaseModel);
        formFieldsData.forEach((data: IFormFieldCollection, index: number) => {
            const formField: IFormField = data.FormField as IFormField;
            const radioItems: IRadiobuttonItem[] = formField.radiobuttonItem;
            if (!radioItems) { return; }
            const localClickedItem: IRadiobuttonItem = radioItems.find(
                (it: IRadiobuttonItem): boolean => it.id.split('_')[0] === clickedKey
            );
            if (!clicked && localClickedItem) {
                clicked = { name: localClickedItem.name, value: localClickedItem.value };
            }

            const undoElements: IRadiobuttonItem[] = [];
            const redoElements: IRadiobuttonItem[] = [];
            const groupIndex: number = viewer.formFieldCollections.findIndex(
                (el: FormFieldModel): boolean => el.id + '_content' === formField.id
            );
            const clickedFieldIndex: number = viewer.formFieldCollections.findIndex(
                (el: FormFieldModel): boolean =>
                    el.id === (localClickedItem ? localClickedItem.id : undefined) ||
                    el.id === clickedKey ||
                    el.id + '_content' === formField.id
            );
            const clickedIsUnison: boolean = clickedFieldIndex > -1 &&
                !!(viewer.formFieldCollections[clickedFieldIndex as number] as FormFieldModel & { isUnisonSelected?: boolean }).
                    isUnisonSelected;
            if (clickedIsUnison && localClickedItem) {
                radioItems.forEach((item: IRadiobuttonItem, j: number) => {
                    const itemKey: string = item.id.split('_')[0];
                    const itemFcIndex: number = viewer.formFieldCollections.findIndex((el: FormFieldModel) => {
                        return el.id === item.id ||
                            el.id === itemKey ||
                            el.id + '_content' === item.id;
                    });
                    const itemIsUnison: boolean = itemFcIndex > -1 &&
                        !!(viewer.formFieldCollections[itemFcIndex as number] as FormFieldModel & { isUnisonSelected?: boolean }).
                            isUnisonSelected;
                    const itemNameEntry: PdfAnnotationBaseModel | PdfFormFieldBaseModel = viewer.nameTable[itemKey as string];
                    if (!itemNameEntry || (itemNameEntry as PdfFormFieldBaseModel).isReadonly) { return; }

                    const formCollectionItem: IRadiobuttonItem = (base.formFieldCollection[index as number].FormField as IFormField).
                        radiobuttonItem[j as number];
                    const element: HTMLInputElement | null = getElement(item.id);
                    const sameGroup: boolean = item.name === localClickedItem.name;

                    if (itemIsUnison && sameGroup && item.value === localClickedItem.value) {
                        const previouslySelectedA: boolean = formCollectionItem.isSelected;
                        if (!previouslySelectedA) { undoElements.push(formCollectionItem); }
                        (itemNameEntry as PdfFormFieldBaseModel).isSelected = true;
                        item.isSelected = true;
                        if (element) { element.checked = true; }
                        formCollectionItem.isSelected = true;
                        fireChangeEvent(formField, formField.pageNumber);
                        fireChangedEvent(formCollectionItem);
                        updateForm(formCollectionItem);
                    } else if (itemIsUnison && sameGroup && item.value !== localClickedItem.value) {
                        const previouslySelectedB: boolean = formCollectionItem.isSelected;
                        if (previouslySelectedB) { redoElements.push(formCollectionItem); }
                        (itemNameEntry as PdfFormFieldBaseModel).isSelected = false;
                        item.isSelected = false;
                        if (element) { element.checked = false; }
                        formCollectionItem.isSelected = false;
                        fireChangeEvent(formField, formField.pageNumber);
                        fireChangedEvent(formCollectionItem);
                        updateForm(formCollectionItem);
                    }
                });
                if ((undoElements.length || redoElements.length) && viewer.annotation) {
                    viewer.annotation.addAction(
                        formField.pageNumber, null,
                        base.formFieldCollection[index as number].FormField,
                        'FormField Value Change', '',
                        undoElements, redoElements
                    );
                }
                if (groupIndex > -1) {
                    targetField = viewer.formFieldCollections[groupIndex as number];
                }
                return;
            }
            const clickedEntry: PdfAnnotationBaseModel | PdfFormFieldBaseModel = viewer.nameTable[`${clickedKey}`];
            radioItems.forEach((item: IRadiobuttonItem, j: number)  => {
                const itemKey: string = item.id.split('_')[0];
                const isClicked: boolean = itemKey === clickedKey;
                const itemEntry: PdfAnnotationBaseModel | PdfFormFieldBaseModel = viewer.nameTable[itemKey as string];
                if (!itemEntry) { return; }
                const formCollectionItem: IRadiobuttonItem = (base.formFieldCollection[index as number].FormField as IFormField).
                    radiobuttonItem[j as number];
                const element: HTMLInputElement | null = getElement(item.id);
                if (isClicked) {
                    if (!clicked) { clicked = { name: item.name, Value: item.value }; }
                    if (!itemEntry.isReadonly) {
                        const previouslySelected: boolean = formCollectionItem.isSelected;
                        (itemEntry as PdfFormFieldBaseModel).isSelected = true;
                        item.isSelected = true;
                        if (element) { element.checked = true; }
                        if (!previouslySelected) { undoElements.push(formCollectionItem); }
                        formCollectionItem.isSelected = true;
                        fireChangeEvent(formField, formField.pageNumber);
                        fireChangedEvent(formCollectionItem);
                    }
                } else {
                    if (clickedEntry && (clickedEntry as PdfFormFieldBaseModel).name === item.name) {
                        const previouslySelected2: boolean = formCollectionItem.isSelected;
                        (itemEntry as PdfFormFieldBaseModel).isSelected = false;
                        item.isSelected = false;
                        if (element) { element.checked = false; }
                        if (previouslySelected2) { redoElements.push(formCollectionItem); }
                        formCollectionItem.isSelected = false;
                        fireChangeEvent(formField, formField.pageNumber);
                        fireChangedEvent(formCollectionItem);
                    }
                }
                updateForm(formCollectionItem);
                const idx: number = viewer.formFieldCollections.findIndex(
                    (el: FormFieldModel): boolean => el.id + '_content' === formField.id
                );
                if (idx > -1) {
                    targetField = viewer.formFieldCollections[idx as number];
                }
            });

            if ((undoElements.length || redoElements.length) && viewer.annotation) {
                viewer.annotation.addAction(
                    formField.pageNumber, null,
                    base.formFieldCollection[index as number].FormField,
                    'FormField Value Change', '',
                    undoElements, redoElements
                );
            }
        });
        base.setItemInSessionStorage(base.formFieldCollection, '_formDesigner');
        this.updateFormFieldSessions(targetField);
        if (clicked) {
            this.radioButtonStatus(clicked);
        }

        //to get the isSelected and isUnisonSelected property in formfieldCollections
        const radioFields: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(
            (item: FormFieldModel) => item.type === 'RadioButton');
        const firstPart: string = (event.target as Element).id.split('_')[0];
        const currentItem: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(
            (item: FormFieldModel) => item.type === 'RadioButton' && item.id === firstPart);

        for (let k: number = 0; k < radioFields.length; k++) {
            if (radioFields[k as number].name === currentItem[0].name) {

                if (radioFields[k as number].value === currentItem[0].value) {
                    radioFields[k as number].isSelected = currentItem[0].isSelected;
                    (radioFields[k as number] as FormFieldModel & { isUnisonSelected?: boolean }).isUnisonSelected = (
                        currentItem[0] as FormFieldModel & { isUnisonSelected?: boolean }).isUnisonSelected;
                } else {
                    radioFields[k as number].isSelected = false;
                }
            }
        }
    }

    /**
     * @param {any} clickedItem - It describes about the form fields clicked item
     * @param {boolean} value - It describes about the form fields value
     * @param {any} formFields - It describes about the form fields
     * @deprecated - This API is obsolete. Use `radioButtonStatus` instead.
     * @returns {void}
     */
    public radioButtonState(clickedItem: any, value?: boolean, formFields?: any): void {
        let formFieldsData: IFormFieldSessionData[] = [];
        const data: string = (this.pdfViewerBase.getItemFromSessionStorage('_formfields') || '[]');
        if (!data) {
            formFieldsData = [];
        } else if (data.trim().startsWith('"[')) {
            formFieldsData = JSON.parse(JSON.parse(data));
        } else if (data.trim().startsWith('[')) {
            formFieldsData = JSON.parse(data);
        }
        const targetName: string = clickedItem.name;
        const targetValue: string = clickedItem.value;
        if (!targetName) { return; }
        formFieldsData.forEach((field: IFormFieldSessionData) => {
            if (!field) { return; }
            const btn: IFormFieldSessionData = field;
            const btnName: string = btn.ActualFieldName;
            const btnValue: string = btn.Value;
            const isUnison: boolean = btn.IsUnisonSelected === true || btn.isUnisonSelected === true;
            if (isUnison && btnName === targetName) {
                if (btnValue === targetValue) {
                    btn.Selected = true;
                }
                else {
                    btn.Selected = false;
                }
                if (!isNullOrUndefined(value)) {
                    btn.Selected = value;
                }
            }
        });

        this.pdfViewerBase.setItemInSessionStorage(formFieldsData, '_formfields');
        if (formFields) {
            for (let i: number = 0; i < formFields.length; i++) {
                if ((formFields[i as number].FormField as IFormField).formFieldAnnotationType === 'RadioButton') {
                    for (let j: number = 0; j < (formFields[i as number].FormField as IFormField).radiobuttonItem.length; j++) {
                        if ((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].name === targetName &&
                            (formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].value === targetValue) {
                            const formFieldModel: PdfFormFieldBaseModel = this.getFormField((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0]);
                            let inputElement: Element;
                            if (document.getElementById((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0] + '_content_html_element')) {
                                inputElement = document.getElementById((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0] + '_content_html_element').firstElementChild.firstElementChild;
                            }
                            const index: number = this.getFormFiledIndex((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0]);
                            if ((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].name === targetName &&
                                (formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].value === targetValue
                                    && inputElement &&
                                (formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].isUnisonSelected === true) {
                                formFieldModel.isSelected = value;
                                this.updateIsSelectedPropertyChange(formFieldModel, inputElement.firstElementChild, true,
                                                                    index, formFields);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {IFormFieldSessionData} clickedItem - It describes about the form fields clicked item
     * @param {boolean} value - It describes about the form fields value
     * @param {IFormFieldCollection[]} formFields - It describes about the form fields
     *
     * @returns {void}
     */
    public radioButtonStatus(clickedItem: IFormFieldSessionData, value?: boolean, formFields?: IFormFieldCollection[]): void {
        let formFieldsData: IFormFieldSessionData[] = [];
        const data: string = (this.pdfViewerBase.getItemFromSessionStorage('_formfields') || '[]');
        if (!data) {
            formFieldsData = [];
        } else if (data.trim().startsWith('"[')) {
            formFieldsData = JSON.parse(JSON.parse(data));
        } else if (data.trim().startsWith('[')) {
            formFieldsData = JSON.parse(data);
        }
        const targetName: string = clickedItem.name;
        const targetValue: string = clickedItem.value;
        if (!targetName) { return; }
        formFieldsData.forEach((field: IFormFieldSessionData) => {
            if (!field) { return; }
            const btn: IFormFieldSessionData = field;
            const btnName: string = btn.ActualFieldName;
            const btnValue: string = btn.Value;
            const isUnison: boolean = btn.IsUnisonSelected === true || btn.isUnisonSelected === true;
            if (isUnison && btnName === targetName) {
                if (btnValue === targetValue) {
                    btn.Selected = true;
                }
                else {
                    btn.Selected = false;
                }
                if (!isNullOrUndefined(value)) {
                    btn.Selected = value;
                }
            }
        });

        this.pdfViewerBase.setItemInSessionStorage(formFieldsData, '_formfields');
        if (formFields) {
            for (let i: number = 0; i < formFields.length; i++) {
                if ((formFields[i as number].FormField as IFormField).formFieldAnnotationType === 'RadioButton') {
                    for (let j: number = 0; j < (formFields[i as number].FormField as IFormField).radiobuttonItem.length; j++) {
                        if ((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].name === targetName &&
                            (formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].value === targetValue) {
                            const formFieldModel: PdfFormFieldBaseModel = this.getFormField((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0]);
                            let inputElement: Element;
                            if (document.getElementById((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0] + '_content_html_element')) {
                                inputElement = document.getElementById((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0] + '_content_html_element').firstElementChild.firstElementChild;
                            }
                            const index: number = this.getFormFiledIndex((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].id.split('_')[0]);
                            if ((formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].name === targetName &&
                                (formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].value === targetValue
                                    && inputElement &&
                                (formFields[i as number].FormField as IFormField).radiobuttonItem[j as number].isUnisonSelected === true) {
                                formFieldModel.isSelected = value;
                                this.updateIsSelectedPropertyChange(formFieldModel, inputElement.firstElementChild, true,
                                                                    index, formFields);
                            }
                        }
                    }
                }
            }
        }
    }

    private getTextboxValue(event: Event): void {
        if (this.pdfViewer.readOnlySettings.formFields) {
            event.preventDefault();
            return;
        }
        const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
        const formFieldsData: any = JSON.parse(data);
        let targetField: FormFieldModel = null;
        // R-FIX-DTP-02-c: detect whether this change event came from a
        // designer DateTime text input so we can validate before writing.
        const targetEl: HTMLInputElement = event.target as HTMLInputElement;
        const isDateTimeTextInput: boolean = !!(targetEl && targetEl.classList &&
            targetEl.classList.contains('e-pv-datetime-text'));
        for (let i: number = 0; i < formFieldsData.length; i++) {
            if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === (event.target as Element).id.split('_')[0] ||
                (this.pdfViewer.nameTable[(event.target as Element).id.split('_')[0]] as PdfFormFieldBaseModel).name === formFieldsData[parseInt(i.toString(), 10)].FormField.name) {
                const oldValue: string = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value;
                // R-FIX-DTP-02-c: short-circuit invalid DateTime values so the
                // element reverts to the previous valid baseline (collection +
                // session unchanged) and the blur handler sees a value pattern,
                // so it does not clear the field. Picker commit goes through
                // applyDateTimePattern output, so it always produces a valid
                // value and never trips this guard.
                if (isDateTimeTextInput && this.pdfViewer.formFieldsModule) {
                    const check: { valid: boolean, pattern: string } =
                        this.pdfViewer.formFieldsModule.validateDateTimeChange(targetEl);
                    if (!check.valid) {
                        this.pdfViewer.showNotificationDialog = false;
                        this.pdfViewer.showNotificationPopup(
                            'Invalid date/time. The value entered does not match the required format: ' + check.pattern);
                        this.pdfViewer.showNotificationDialog = true;
                        targetEl.value = oldValue !== undefined && oldValue !== null ? oldValue : '';
                        const composite: HTMLElement = targetEl.parentElement as HTMLElement;
                        if (composite && composite.classList && composite.classList.contains('e-pv-datetime-composite')) {
                            const nativePicker: HTMLInputElement =
                                composite.querySelector('.e-pv-datetime-native-picker') as HTMLInputElement;
                            if (nativePicker) {
                                nativePicker.value = (targetEl.value || '').trim();
                            }
                        }
                        return;
                    }
                }
                // A formatted text box keeps the logical value on the field model while
                // the input shows the masked display string. The session and the
                // collection store the logical value, never the display.
                const committedValue: string = this.commitAfValue(targetEl);
                formFieldsData[parseInt(i.toString(), 10)].FormField.value = committedValue;
                if (this.pdfViewer.enableHtmlSanitizer){
                    formFieldsData[parseInt(i.toString(), 10)].FormField.value =
                     SanitizeHtmlHelper.sanitize(formFieldsData[parseInt(i.toString(), 10)].FormField.value);
                }
                (this.pdfViewer.nameTable[formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]] as PdfFormFieldBaseModel).value = formFieldsData[parseInt(i.toString(), 10)].FormField.value;
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.value =
                 formFieldsData[parseInt(i.toString(), 10)].FormField.value;
                if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] !== (event.target as Element).id.split('_')[0]) {
                    const element: Element = document.getElementById(formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] + '_content_html_element');
                    if (element && element.firstElementChild && element.firstElementChild.firstElementChild) {
                        let inputElement: Element = element.firstElementChild.firstElementChild;
                        // Composite datetime: resolve the real text input inside the wrapper.
                        if (inputElement && (inputElement as HTMLElement).classList &&
                            (inputElement as HTMLElement).classList.contains('e-pv-datetime-composite')) {
                            inputElement = (inputElement as HTMLElement).querySelector('.e-pv-formfield-input') || inputElement;
                        } else if (inputElement && !(inputElement as HTMLInputElement).value &&
                            (inputElement as HTMLElement).querySelector) {
                            const nested: Element = (inputElement as HTMLElement).querySelector('.e-pv-formfield-input');
                            if (nested) {
                                inputElement = nested;
                            }
                        }
                        (inputElement as IElement).value = formFieldsData[parseInt(i.toString(), 10)].FormField.value;
                    }
                }
                this.updateFormFieldCollections(this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as
                PdfFormFieldBaseModel);
                targetField = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(function (el: FormFieldModel): boolean { return (el.id + '_content' === formFieldsData[parseInt(i.toString(), 10)].FormField.id); })];
                this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField), this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber, true, false, false,
                                                                  false, false, false, false, false, false, false, false,
                                                                  false, false, false, false, false , oldValue,
                                                                  committedValue);
                if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                    const bounds: IFormFieldBound | undefined = (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(),
                                                                                                                 10)].FormField as
                                                                                                                 IFormField).lineBound;
                    (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as PdfFormFieldBaseModel).bounds = {
                        x: bounds ? bounds.X : undefined,
                        y: bounds ? bounds.Y : undefined,
                        width: bounds ? bounds.Width : undefined,
                        height: bounds ? bounds.Height : undefined
                    };
                    this.pdfViewer.fireFormFieldChangedEvent(EditAction.Modify,
                                                             (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(),
                                                                                                              10)].FormField as
                                                                                                              FormFieldModel));
                }
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.addAction((this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.pageNumber as number), null, this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField, 'FormField Value Change', '', oldValue, committedValue);
                }
            }
        }
        this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        this.updateFormFieldSessions(targetField);
    }

    private inputElementClick(event: Event): void {
        if (!this.pdfViewer.readOnlySettings.formFields) {
            (event.target as HTMLElement).focus();
        }
    }

    private updateFormFieldSessions(field: FormFieldModel | PdfFormFieldBaseModel): void {
        const fieldData: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        const formFieldsDatas: IFormFieldSessionData[] = JSON.parse(fieldData);
        if (!isNullOrUndefined(formFieldsDatas) && !isNullOrUndefined(field)) {
            for (let x: number = 0; x < formFieldsDatas.length; x++) {
                if (formFieldsDatas[parseInt(x.toString(), 10)].ActualFieldName === field.name) {
                    if ((field as FormFieldModel).type === 'Textbox' || (field as FormFieldModel).type === 'Password') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Value = field.value;
                    }
                    else if ((field as IFormField).type === 'Checkbox' || (field as IFormField).formFieldAnnotationType === 'Checkbox') {
                        const groupedCheckbox: IFormFieldSessionData[] = formFieldsDatas.filter((sameNameCheckboxField: IFormFieldSessionData) => (sameNameCheckboxField.ActualFieldName === field.name) && sameNameCheckboxField.Name === 'CheckBox');
                        if (groupedCheckbox.length > 1) {
                            for (let i: number = 0; i < groupedCheckbox.length; i++) {
                                const currentFieldData: IFormFieldSessionData = groupedCheckbox[parseInt(i.toString(), 10)];
                                let currentChecked: boolean = field.isChecked;
                                if (field.isChecked && currentFieldData.Value !== field.value) {
                                    currentChecked = false;
                                }
                                currentFieldData.Selected = currentChecked;
                            }
                        }
                        else {
                            formFieldsDatas[parseInt(x.toString(), 10)].Selected = field.isChecked;
                        }
                    }
                    else if ((field as FormFieldModel).type === 'RadioButton') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Selected = field.isSelected;
                    }
                    else if ((field as FormFieldModel).type === 'DropDown') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Value = field.value;
                    }
                    else if ((field as FormFieldModel).type === 'ListBox') {
                        formFieldsDatas[parseInt(x.toString(), 10)].Value = field.value;
                    }
                }
            }
            this.pdfViewerBase.setItemInSessionStorage(formFieldsDatas, '_formfields');
        }
    }

    /**
     * @param {any} event - It describes about the form fields event
     * @deprecated - This API is obsolete. Use `focusFormField` instead.
     * @returns {void}
     */
    public focusFormFields(event: any): void {
        const currentTarget: HTMLElement = event.target as HTMLElement;
        // Number / percent / special fields show the formatted value only while not editing.
        // On focus the input goes back to the original unformatted value for easier editing.
        this.restoreAfDisplayOnFocus(currentTarget as HTMLInputElement);
        if (currentTarget || currentTarget.className === 'e-pv-checkbox-outer-div') {
            const colorBorder: string = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.style.boxShadow = '0 0 5px ' + colorBorder;
        }
        if (currentTarget && (currentTarget.className === 'e-pv-radiobtn-container' || currentTarget.className === 'e-pv-radio-btn' || currentTarget.className === 'e-pv-radiobtn-span') && currentTarget.style.borderColor === 'transparent') {
            const colorBorder: string = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0px 0px 5px ' + colorBorder;
        }
        if (currentTarget && (currentTarget.className === 'e-pv-radiobtn-container' || currentTarget.className === 'e-pv-radio-btn' || currentTarget.className === 'e-pv-radiobtn-span')) {
            currentTarget.parentElement.style.boxShadow = currentTarget.style.borderColor + '0px 0px 5px ' + currentTarget.style.borderWidth;
        }
        if (currentTarget.classList.contains('e-pv-datetime-text')) {
            currentTarget.style.boxShadow = 'none';
            const colorBorder: string = (currentTarget.parentElement.style.borderColor === 'transparent' ? '#000000' : currentTarget.parentElement.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0 0 5px ' + colorBorder;
        }
    }

    /**
     * @param {Event} event - It describes about the form fields event
     *
     * @returns {void}
     */
    public focusFormField(event: Event): void {
        const currentTarget: HTMLElement = event.target as HTMLElement;
        // Number / percent / special fields show the formatted value only while not editing.
        // On focus the input goes back to the original unformatted value for easier editing.
        this.restoreAfDisplayOnFocus(currentTarget as HTMLInputElement);
        if (currentTarget || currentTarget.className === 'e-pv-checkbox-outer-div') {
            const colorBorder: string = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.style.boxShadow = '0 0 5px ' + colorBorder;
        }
        if (currentTarget && (currentTarget.className === 'e-pv-radiobtn-container' || currentTarget.className === 'e-pv-radio-btn' || currentTarget.className === 'e-pv-radiobtn-span') && currentTarget.style.borderColor === 'transparent') {
            const colorBorder: string = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0px 0px 5px ' + colorBorder;
        }
        if (currentTarget && (currentTarget.className === 'e-pv-radiobtn-container' || currentTarget.className === 'e-pv-radio-btn' || currentTarget.className === 'e-pv-radiobtn-span')) {
            currentTarget.parentElement.style.boxShadow = currentTarget.style.borderColor + '0px 0px 5px ' + currentTarget.style.borderWidth;
        }
        if (currentTarget.classList.contains('e-pv-datetime-text')) {
            currentTarget.style.boxShadow = 'none';
            const colorBorder: string = (currentTarget.parentElement.style.borderColor === 'transparent' ? '#000000' : currentTarget.parentElement.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0 0 5px ' + colorBorder;
        }
    }

    /**
     * @param {any} event - It describes about the form fields event
     * @deprecated - This API is obsolete. Use `blurFormField` instead.
     * @returns {void}
     */
    public blurFormFields(event: any): void {
        const currentTarget: HTMLElement = event.target as HTMLElement;
        currentTarget.style.boxShadow = '';
        if ((currentTarget as HTMLInputElement).type === 'radio' && currentTarget.style.borderColor === 'transparent') {
            const colorBorder: string = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0px 0px 0px ' + colorBorder;
        }
        if ((currentTarget as HTMLInputElement).type === 'radio') {
            currentTarget.parentElement.style.boxShadow = currentTarget.style.borderColor + '0px 0px 0px ' + currentTarget.style.borderWidth;
        }
        // DateTime composite typed-input validation (designer fill state).
        if (currentTarget && currentTarget.classList && currentTarget.classList.contains('e-pv-datetime-text') &&
            this.pdfViewer.formFieldsModule) {
            currentTarget.parentElement.style.boxShadow = '';
            this.pdfViewer.formFieldsModule.validateDateTimeTextOnBlur(currentTarget as HTMLInputElement);
        } else {
            this.applyAfFormatOnBlur(currentTarget as HTMLInputElement);
        }
    }

    private isServerMode(): boolean {
        return !!(this.pdfViewer.serviceUrl);
    }
    private fieldModelForInput(input: HTMLInputElement): any {
        if (!input || !input.id) {
            return null;
        }
        const id: string = input.id.split('_')[0];
        const table: any = this.pdfViewer.nameTable as any;
        return table && table[`${id}`] ? table[`${id}`] : null;
    }
    private normalizeTextBoxActions(sourceActions: any): any {
        if (!sourceActions) {
            return null;
        }
        const pair: { format: string, keyPressed: string } = inferActionPair(
            readActionScript(sourceActions, 'format'), readActionScript(sourceActions, 'keyPressed'));
        const actions: any = {};
        if (pair.format) {
            actions.format = sourceActions.format && sourceActions.format.script
                ? { ...sourceActions.format, action: sourceActions.format.action || 'JavaScript', script: pair.format }
                : { action: 'JavaScript', script: pair.format };
        } else if (sourceActions.format) {
            actions.format = sourceActions.format;
        }
        if (pair.keyPressed) {
            actions.keyPressed = sourceActions.keyPressed && sourceActions.keyPressed.script
                ? { ...sourceActions.keyPressed, action: sourceActions.keyPressed.action || 'JavaScript', script: pair.keyPressed }
                : { action: 'JavaScript', script: pair.keyPressed };
        } else if (sourceActions.keyPressed) {
            actions.keyPressed = sourceActions.keyPressed;
        }
        return actions;
    }
    private onAfKeyDown(event: KeyboardEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        if (!input || !shouldRunFormat(this.fieldModelForInput(input), this.isServerMode())) {
            return;
        }
        if (shouldBlockKey(fieldConfig(this.fieldModelForInput(input)), event.key)) {
            event.preventDefault();
        }
    }
    private onAfInput(event: Event): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        if (!input || input.dataset.skipKeystroke === '1') {
            return;
        }
        const field: any = this.fieldModelForInput(input);
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
            field.value = digits;
            return;
        }
        if (config.mask) {
            this.onAfMaskInput(input, field, config);
            return;
        }
        const previous: string = input.dataset.afLast != null ? input.dataset.afLast : (field.value || '');
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
        field.value = result.value;
        // "Use red text" for negative numbers must follow the value while editing.
        // The colour was set on focus/blur; recompute here so a typed non-negative
        // value clears the red without waiting for focus-out (and vice versa).
        const baseColor: string = (field.color || field.FontColor || field.fontColor || '') as string;
        const formattedColor: { color?: string } = formatValue(config, result.value);
        input.style.color = formattedColor.color || baseColor;
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
        const logical: string = input.dataset.afLast != null ? input.dataset.afLast : (field.value || '');
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
        field.value = result.value;
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
        const field: any = this.fieldModelForInput(input);
        if (!shouldRunFormat(field, this.isServerMode())) {
            return;
        }
        const config: AfFormatConfig = fieldConfig(field);
        // The prior logical value is the value stored on the field before the
        // current edit session. A blur that fails validation restores to this
        // value so a half-typed edit never corrupts the stored value.
        input.dataset.afMaskPrior = input.dataset.afLast;
        // An arbitrary mask has no unformatted view. The literals belong to the
        // field, so the masked display is restored instead of the logical value.
        input.value = config.mask
            ? (input.dataset.afDisplay != null ? input.dataset.afDisplay : input.dataset.afLast)
            : input.dataset.afLast;
        const baseColor: string = (field.color || field.FontColor || field.fontColor || '') as string;
        // The formatted display is replaced by the raw logical value on focus, but the color
        // belongs to the format and not to the display string. A "Use red text" format keeps
        // its red color while the field shows the logical value.
        const formatted: { color?: string } = formatValue(config, input.dataset.afLast);
        input.style.color = formatted.color || baseColor;
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
    private applyAfFormatOnBlur(input: HTMLInputElement): void {
        if (!input) {
            return;
        }
        const field: any = this.fieldModelForInput(input);
        if (!shouldRunFormat(field, this.isServerMode())) {
            return;
        }
        const config: AfFormatConfig = fieldConfig(field);
        if (isSpecialPreset(config)) {
            const commit: AfSpecialCommit = this.validateSpecialPresetOnBlur(input, config);
            if (!commit.valid) {
                return;
            }
            input.dataset.afLast = commit.logical;
            input.value = commit.text;
            field.value = commit.logical;
            input.style.color = (field.color as string) || '';
            return;
        }
        const logical: string = input.dataset.afLast != null ? input.dataset.afLast : input.value;
        if (config.mask) {
            // The arbitrary mask is applied while typing. On blur the masked display
            // stays and the logical value is committed to the field model. A value
            // that does not fill every placeholder of the mask must surface a
            // validation error so the user can correct it.
            const prior: string = input.dataset.afMaskPrior != null
                ? input.dataset.afMaskPrior
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
            field.value = input.dataset.afLast;
            return;
        }
        const check: { accepted: boolean, value: string } = applyKeystroke(config, logical, logical.length, logical.length, '', true);
        const committed: string = check.accepted ? check.value : (input.dataset.afLast || '');
        const formatted: { text: string, color?: string, rejected?: boolean, logical: string } = formatValue(config, committed);
        if (formatted.rejected) {
            input.value = input.dataset.afLast || '';
            field.value = input.dataset.afLast || '';
            return;
        }
        input.dataset.afLast = formatted.logical != null ? formatted.logical : committed;
        input.value = formatted.text;
        field.value = input.dataset.afLast;
        input.style.color = formatted.color || (field.color as string) || '';
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
        if (!commit.valid) {
            // The mask is not applied. The value is reverted to the value the
            // field held before this edit session, so a failed validation never
            // leaves the wrong input in the field.
            this.restoreAfPriorValue(input);
            this.pdfViewer.showNotificationDialog = false;
            this.pdfViewer.showNotificationPopup(
                'The value entered does not match the format of the field [' + commit.expected + '].');
            this.pdfViewer.showNotificationDialog = true;
        }
        return commit;
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
        const field: any = this.fieldModelForInput(input);
        const prior: string = input.dataset.afMaskPrior != null
            ? input.dataset.afMaskPrior
            : (field && field.value != null ? String(field.value) : '');
        const config: AfFormatConfig = fieldConfig(field);
        // The prior value is the logical value. The display is rebuilt from it so
        // a masked field shows the mask again and a preset field shows its pattern.
        const display: { text: string, logical: string } = formatValue(config, prior);
        input.value = display.text;
        input.dataset.afLast = display.logical != null ? display.logical : prior;
        input.dataset.afDisplay = display.text;
        if (field) {
            field.value = input.dataset.afLast;
        }
    }
    private commitAfValue(input: HTMLInputElement): string {
        if (!input) {
            return '';
        }
        const field: any = this.fieldModelForInput(input);
        if (field && shouldRunFormat(field, this.isServerMode()) && input.dataset.afLast != null) {
            return input.dataset.afLast;
        }
        return input.value;
    }
    private applyProgrammaticAfValue(inputElement: HTMLElement, field: any): void {
        if (!inputElement || !field || !shouldRunFormat(field, this.isServerMode())) {
            return;
        }
        const input: HTMLInputElement = inputElement as HTMLInputElement;
        const config: AfFormatConfig = fieldConfig(field);
        const logical: string = field.value == null ? '' : String(field.value);
        input.dataset.afLast = logical;
        input.dataset.afDisplay = logical;
        input.dataset.skipKeystroke = '1';
        if (typeof document !== 'undefined' && document.activeElement !== input) {
            if (isSpecialPreset(config)) {
                // The preset mask is the resting state of the field.
                const commit: AfSpecialCommit = validateSpecialValue(config, logical);
                input.dataset.afLast = commit.logical;
                input.value = commit.valid ? commit.text : logical;
            } else {
                const formatted: { text: string, color?: string } = formatValue(config, logical);
                input.value = formatted.text;
                input.style.color = formatted.color || (field.color as string) || '';
            }
            input.dataset.afDisplay = input.value;
        }
        input.dataset.skipKeystroke = '';
    }

    /**
     * @param {Event} event - It describes about the form fields event
     *
     * @returns {void}
     */
    public blurFormField(event: Event): void {
        const currentTarget: HTMLElement = event.target as HTMLElement;
        currentTarget.style.boxShadow = '';
        if ((currentTarget as HTMLInputElement).type === 'radio' && currentTarget.style.borderColor === 'transparent') {
            const colorBorder: string = (currentTarget.style.borderColor === 'transparent' ? '#000000' : currentTarget.style.borderColor);
            currentTarget.parentElement.style.boxShadow = '0px 0px 0px ' + colorBorder;
        }
        if ((currentTarget as HTMLInputElement).type === 'radio') {
            currentTarget.parentElement.style.boxShadow = currentTarget.style.borderColor + '0px 0px 0px ' + currentTarget.style.borderWidth;
        }
        // DateTime composite typed-input validation (designer fill state).
        if (currentTarget && currentTarget.classList && currentTarget.classList.contains('e-pv-datetime-text') &&
            this.pdfViewer.formFieldsModule) {
            currentTarget.parentElement.style.boxShadow = '';
            this.pdfViewer.formFieldsModule.validateDateTimeTextOnBlur(currentTarget as HTMLInputElement);
        } else {
            // AF format commit (Number / Percentage / Special). The DateTime composite owns
            // its own commit, so every other field type commits the AF format here.
            // Mirrors the viewer-fill path in form-fields.ts.
            this.applyAfFormatOnBlur(currentTarget as HTMLInputElement);
        }
    }

    private setTextBoxFontStyle(fontStyle: FontStyle): PdfFontModel {
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
                        SignatureFieldSettings | InitialFieldSettings | ButtonFieldSettings | BarcodeFieldSettings | FormFieldModel,
                        isCollection?: boolean, id?: string): HTMLElement {
        if (this.pdfViewer.readOnlySettings.formFields) {
            return null;
        }
        const HTMLElement: HTMLElement = this.addField(formFieldType, options, isCollection, id, true);
        initializeTelemetryFeature('Form Field Add/Edit', 'PDFViewer');
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
                    SignatureFieldSettings | InitialFieldSettings | ButtonFieldSettings | BarcodeFieldSettings | FormFieldModel,
                    isCollection?: boolean, id?: string,
                    isAddedProgrammatically?: boolean): HTMLElement {
        if (this.pdfViewer.readOnlySettings.formFields && isAddedProgrammatically) {
            return null;
        }
        const obj: PdfFormFieldBaseModel = {
            thickness: 1, bounds: { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height },
            fontFamily: !isNullOrUndefined((options as TextFieldSettings).fontFamily) ? (options as TextFieldSettings).fontFamily : 'Helvetica', fontSize: !isNullOrUndefined((options as TextFieldSettings).fontSize) ? (options as TextFieldSettings).fontSize : 10,
            color: !isNullOrUndefined((options as TextFieldSettings).color) ? (options as TextFieldSettings).color : 'black', backgroundColor: !isNullOrUndefined((options as TextFieldSettings).backgroundColor) ? (options as TextFieldSettings).backgroundColor : '#daeaf7ff',
            alignment: !isNullOrUndefined((options as TextFieldSettings).alignment) ? (options as TextFieldSettings).alignment : 'left', isReadonly: (options as TextFieldSettings).isReadOnly ? (options as TextFieldSettings).isReadOnly : false, rotateAngle: (options as PdfFormFieldBaseModel).rotateAngle ? (options as PdfFormFieldBaseModel).rotateAngle : (options as PdfAnnotationBaseModel & { rotationAngle?: number }).rotationAngle, isTransparent: (options as PdfFormFieldBaseModel).isTransparent, insertSpaces: (options as PdfFormFieldBaseModel).insertSpaces, isChecked: (options as PdfFormFieldBaseModel).isChecked, isMultiline: (options as PdfFormFieldBaseModel).isMultiline, isSelected: (options as PdfFormFieldBaseModel).isSelected, options: (options as PdfFormFieldBaseModel).options, selectedIndex: (options as PdfFormFieldBaseModel).selectedIndex, signatureIndicatorSettings: (options as PdfFormFieldBaseModel).signatureIndicatorSettings, signatureType: (options as PdfFormFieldBaseModel).signatureType, zIndex: (options as PdfFormFieldBaseModel).zIndex
        };
        (obj as PdfFormFieldBaseModel).customData = !isNullOrUndefined((options as PdfFormFieldBaseModel).customData) ? (
            options as PdfFormFieldBaseModel).customData : {};
        (obj as PdfFormFieldBaseModel).fontStyle = !isNullOrUndefined((options as PdfFormFieldBaseModel).fontStyle) ? (options as PdfFormFieldBaseModel).fontStyle : 'None';
        obj.visibility = !isNullOrUndefined((options as PdfFormFieldBaseModel).visibility) ? (options as PdfFormFieldBaseModel).visibility : 'visible';
        obj.value = !isNullOrUndefined((options as PdfFormFieldBaseModel).value) ? (options as PdfFormFieldBaseModel).value : '';
        obj.isRequired = (options as TextFieldSettings).isRequired ? (options as TextFieldSettings).isRequired : false;
        obj.isPrint = !isNullOrUndefined((options as TextFieldSettings).isPrint) ? (options as TextFieldSettings).isPrint : true;
        obj.pageNumber = !isNullOrUndefined(options.pageNumber) ? options.pageNumber : this.pdfViewerBase.currentPageNumber;
        obj.pageIndex = obj.pageNumber - 1;
        obj.font = (options as PdfFormFieldBaseModel).font;
        obj.id = id;
        if (isCollection || isNullOrUndefined(isCollection)) {
            this.setFormFieldIndex();
        }
        switch (formFieldType) {
        case 'Textbox':
            obj.formFieldAnnotationType = formFieldType;
            obj.isMultiline = (options as TextFieldSettings).isMultiline;
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Textbox' + this.formFieldIndex;
            obj.insertSpaces = (options as PdfFormFieldBaseModel).insertSpaces;
            obj.maxLength = (options as PdfFormFieldBaseModel).maxLength;
            obj.thickness = !isNullOrUndefined((options as TextFieldSettings).thickness) ? (options as TextFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as TextFieldSettings).borderColor) ? (options as TextFieldSettings).borderColor : '#303030';
            // eslint-disable-next-line no-case-declarations
            const textOpts: TextFieldSettings = options as TextFieldSettings;
            // eslint-disable-next-line no-case-declarations
            const isDateField: boolean = !isNullOrUndefined(textOpts.isDateField) ? textOpts.isDateField :
                (!isNullOrUndefined((options as PdfFormFieldBaseModel).isDateField) ?
                    (options as PdfFormFieldBaseModel).isDateField : false);
            obj.isDateField = isDateField;
            if (isDateField) {
                const sourceActions: any = !isNullOrUndefined(textOpts.actions) ? textOpts.actions :
                    (options as PdfFormFieldBaseModel).actions;
                const sourceScript: string = this.pdfViewerBase.getActionsFormatScript(sourceActions);
                // Derive date/time sub-type from the format script only;
                // the legacy `type` field has been removed.
                const isTimeField: boolean = !!(sourceScript && /AFTime_Format(?:Ex)?\s*\(/i.test(sourceScript));
                obj.isMultiline = false;
                if (sourceScript !== '') {
                    const normalizedFormat: any = sourceActions && sourceActions.format
                        ? { ...sourceActions.format,
                            action: sourceActions.format.action || 'JavaScript',
                            script: sourceScript }
                        : { script: sourceScript };
                    const keyScript: string = this.pdfViewerBase.getActionsKeyPressedScript(sourceActions);
                    obj.actions = {
                        format: normalizedFormat,
                        keyPressed: keyScript ? { action: 'JavaScript', script: keyScript } : (sourceActions && sourceActions.keyPressed)
                    };
                } else {
                    const defaultScript: string = isTimeField ?
                        'AFTime_FormatEx("h:MM tt")' : FormDesigner.defaultDateTimeFormatScript;
                    obj.actions = {
                        format: { script: defaultScript } as JavaScriptActionModel
                    };
                }
            } else {
                if (!isNullOrUndefined(textOpts.actions) || !isNullOrUndefined((options as PdfFormFieldBaseModel).actions)) {
                    const sourceActions: any = !isNullOrUndefined(textOpts.actions) ? textOpts.actions :
                        (options as PdfFormFieldBaseModel).actions;
                    obj.actions = this.normalizeTextBoxActions(sourceActions);
                } else {
                    obj.actions = null;
                }
            }
            if ((options as PdfFormFieldBaseModel).font) {
                obj.font = (options as PdfFormFieldBaseModel).font;
            }
            else if (this.pdfViewer.textFieldSettings.fontStyle) {
                obj.font = this.setTextBoxFontStyle(this.pdfViewer.textFieldSettings.fontStyle);
            }
            if (!isNullOrUndefined((options as PdfFormFieldBaseModel).value) || !isNullOrUndefined(obj.value)) {
                const maxLen: number = (obj as PdfFormFieldBaseModel).maxLength as number;
                const val: string = !isNullOrUndefined((options as PdfFormFieldBaseModel).value) ? (
                    options as PdfFormFieldBaseModel).value : (obj.value as string);
                obj.value = (!isNullOrUndefined(maxLen) && maxLen > 0) ? val.substring(0, maxLen) : val;
            }
            break;
        case 'Password':
            obj.formFieldAnnotationType = 'PasswordField';
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Password' + this.formFieldIndex;
            obj.maxLength = (options as PdfFormFieldBaseModel).maxLength;
            obj.thickness = !isNullOrUndefined((options as PasswordFieldSettings).thickness) ?
                (options as PasswordFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as PasswordFieldSettings).borderColor) ? (options as PasswordFieldSettings).borderColor : '#303030';
            if (!isNullOrUndefined((options as PdfFormFieldBaseModel).value) || !isNullOrUndefined(obj.value)) {
                const maxLenPwd: number = (obj as PdfFormFieldBaseModel).maxLength as number;
                const pwdVal: string = !isNullOrUndefined((options as PdfFormFieldBaseModel).value) ? (
                    options as PdfFormFieldBaseModel).value : (obj.value as string);
                obj.value = (!isNullOrUndefined(maxLenPwd) && maxLenPwd > 0) ? pwdVal.substring(0, maxLenPwd) : pwdVal;
            }
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
            obj.selectedIndex = !isNullOrUndefined((options as PdfFormFieldBaseModel).selectedIndex) ? (
                options as PdfFormFieldBaseModel).selectedIndex : [0];
            obj.thickness = !isNullOrUndefined((options as DropdownFieldSettings).thickness) ?
                (options as DropdownFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as DropdownFieldSettings).borderColor) ? (options as DropdownFieldSettings).borderColor : '#303030';
            if ((options as PdfFormFieldBaseModel).font) {
                obj.font = (options as PdfFormFieldBaseModel).font;
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
            obj.selectedIndex = (options as PdfFormFieldBaseModel).selectedIndex;
            obj.thickness = !isNullOrUndefined((options as ListBoxFieldSettings).thickness) ?
                (options as ListBoxFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as ListBoxFieldSettings).borderColor) ? (options as ListBoxFieldSettings).borderColor : '#303030';
            if ((options as PdfFormFieldBaseModel).font) {
                obj.font = (options as PdfFormFieldBaseModel).font;
            }
            else if (this.pdfViewer.listBoxFieldSettings.fontStyle) {
                obj.font = this.setTextBoxFontStyle(this.pdfViewer.listBoxFieldSettings.fontStyle);
            }
            break;
        case 'Barcode': {
            obj.formFieldAnnotationType = 'BarcodeField';
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Barcode' + this.formFieldIndex;
            obj.tooltip = !isNullOrUndefined(options.tooltip) ? options.tooltip : '';
            obj.symbology = !isNullOrUndefined((options as BarcodeFieldSettings).symbology) ?
                (options as BarcodeFieldSettings).symbology : BarcodeSymbology.PDF417;
            obj.xDimension = !isNullOrUndefined((options as BarcodeFieldSettings).xDimension) ?
                (options as BarcodeFieldSettings).xDimension : 4;
            obj.errorCorrectionLevel = !isNullOrUndefined((options as BarcodeFieldSettings).errorCorrectionLevel) ?
                (options as BarcodeFieldSettings).errorCorrectionLevel : Pdf417ErrorCorrectionLevel.Level5;
            obj.valueFormat = !isNullOrUndefined((options as BarcodeFieldSettings).valueFormat) ?
                (options as BarcodeFieldSettings).valueFormat : BarcodeValueFormat.TabDelimited;
            obj.fields = !isNullOrUndefined((options as BarcodeFieldSettings).fields) ?
                (options as BarcodeFieldSettings).fields : [];
            obj.includeFieldNames = !isNullOrUndefined((options as BarcodeFieldSettings).includeFieldNames) ?
                (options as BarcodeFieldSettings).includeFieldNames : true;
            obj.compressData = !isNullOrUndefined((options as BarcodeFieldSettings).compressData) ?
                (options as BarcodeFieldSettings).compressData : false;
            obj.customValue = !isNullOrUndefined((options as BarcodeFieldSettings).customValue) ?
                (options as BarcodeFieldSettings).customValue : '';
            obj.caption = !isNullOrUndefined((options as BarcodeFieldSettings).caption) ?
                (options as BarcodeFieldSettings).caption : '';
            break;
        }
        case 'CheckBox':
            obj.formFieldAnnotationType = 'Checkbox';
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            obj.backgroundColor = !isNullOrUndefined((options as CheckBoxFieldSettings).backgroundColor) ? (options as CheckBoxFieldSettings).backgroundColor : '#daeaf7ff';
            obj.isReadonly = (options as CheckBoxFieldSettings).isReadOnly ? (options as CheckBoxFieldSettings).isReadOnly : false;
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Check Box' + this.formFieldIndex;
            obj.isChecked = (options as CheckBoxFieldSettings).isChecked ? (options as CheckBoxFieldSettings).isChecked : false;
            obj.visibility = (options as CheckBoxFieldSettings).visibility ? (options as CheckBoxFieldSettings).visibility : 'visible';
            obj.isRequired = (options as CheckBoxFieldSettings).isRequired ? (options as CheckBoxFieldSettings).isRequired : false;
            obj.thickness = !isNullOrUndefined((options as CheckBoxFieldSettings).thickness) ?
                (options as CheckBoxFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as CheckBoxFieldSettings).borderColor) ? (options as CheckBoxFieldSettings).borderColor : '#303030';
            if (isAddedProgrammatically) {
                const groupFields: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter((f: FormFieldModel): boolean => {
                    return (f.type === 'CheckBox' || (f as unknown as IFormField).type === 'Checkbox') && f.name === obj.name && f.value === obj.value;
                });
                groupFields.forEach((f: FormFieldModel): void => {
                    if (f.isChecked) {
                        obj.isChecked = true;
                    }
                    else if (obj.isChecked) {
                        f.isChecked = true;
                        const checkboxElement: Element = document.getElementById(f.id + '_input');
                        checkboxElement.firstElementChild.classList.remove('e-pv-cb-uncheck');
                        checkboxElement.firstElementChild.classList.add('e-pv-checkbox-span', 'e-pv-cb-check');
                        const tickSvg: HTMLElement | null = checkboxElement.firstElementChild ?
                            checkboxElement.firstElementChild.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null :
                            null;
                        if (tickSvg) {
                            tickSvg.style.display = 'block';
                        }
                    }
                    const base: IFormFieldCollection = this.pdfViewerBase.formFieldCollection.find((ff: IFormFieldCollection) => (ff.FormField && ff.FormField.id.split('_')[0] === f.id));
                    if (base && base.FormField) {
                        base.FormField.isChecked = f.isChecked;
                        this.updateFormFieldCollections(base.FormField as PdfFormFieldBaseModel);
                        (this.pdfViewer.nameTable[f.id] as PdfFormFieldBaseModel).isChecked = f.isChecked;
                        (this.pdfViewer.nameTable[f.id] as PdfFormFieldBaseModel).isSelected = f.isChecked;
                    }
                });
            }
            break;
        case 'RadioButton':
            obj.formFieldAnnotationType = formFieldType;
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            obj.backgroundColor = !isNullOrUndefined((options as RadioButtonFieldSettings).backgroundColor) ? (options as RadioButtonFieldSettings).backgroundColor : '#daeaf7ff';
            obj.isReadonly = (options as RadioButtonFieldSettings).isReadOnly ? (options as RadioButtonFieldSettings).isReadOnly : false;
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Radio Button' + this.formFieldIndex;
            obj.isSelected = (options as RadioButtonFieldSettings).isSelected ? (options as RadioButtonFieldSettings).isSelected : false;
            obj.visibility = (options as RadioButtonFieldSettings).visibility ? (options as RadioButtonFieldSettings).visibility : 'visible';
            obj.isRequired = (options as RadioButtonFieldSettings).isRequired ? (options as RadioButtonFieldSettings).isRequired : false;
            obj.thickness = !isNullOrUndefined((options as RadioButtonFieldSettings).thickness) ?
                (options as RadioButtonFieldSettings).thickness : 1;
            obj.borderColor = !isNullOrUndefined((options as RadioButtonFieldSettings).borderColor) ? (options as RadioButtonFieldSettings).borderColor : '#303030';
            (obj as PdfFormFieldBaseModel).isUnisonSelected = (options as PdfFormFieldBaseModel).isUnisonSelected;
            break;
        case 'SignatureField': {
            obj.formFieldAnnotationType = formFieldType;
            obj.bounds = { x: options.bounds.X, y: options.bounds.Y, width: options.bounds.Width, height: options.bounds.Height };
            obj.isReadonly = this.pdfViewer.signatureFieldSettings.isReadOnly ? this.pdfViewer.signatureFieldSettings.isReadOnly :
                ((options as TextFieldSettings).isReadOnly ? (options as TextFieldSettings).isReadOnly : false);
            obj.backgroundColor = !isNullOrUndefined((options as PdfFormFieldBaseModel).backgroundColor) ?
                PdfViewerUtils.setTransparencyToHex(this.colorNametoHashValue(
                    (options as PdfFormFieldBaseModel).backgroundColor  as string)) : obj.isReadonly ? 'trasnparent' : '#daeaf7ff';
            obj.borderColor = !isNullOrUndefined((options as TextFieldSettings).borderColor) ?
                (options as TextFieldSettings).borderColor : '#303030';
            obj.fontSize = !isNullOrUndefined((options as PdfFormFieldBaseModel).fontSize) ?
                (options as PdfFormFieldBaseModel).fontSize : 10;
            (obj as PdfFormFieldBaseModel).fontStyle = !isNullOrUndefined((options as PdfFormFieldBaseModel).fontStyle) ? (options as PdfFormFieldBaseModel).fontStyle : 'None';
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Signature' + this.formFieldIndex;
            obj.isRequired = (options as TextFieldSettings).isRequired ? (options as TextFieldSettings).isRequired : false;
            obj.thickness = !isNullOrUndefined((options as PdfFormFieldBaseModel).thickness) ? (
                options as PdfFormFieldBaseModel).thickness : 1;
            const indicatorSettings: SignatureIndicatorSettingsModel = (options as SignatureFieldSettings).signatureIndicatorSettings ?
                (options as SignatureFieldSettings).signatureIndicatorSettings :
                ((options as InitialFieldSettings).initialIndicatorSettings ?
                    (options as InitialFieldSettings).initialIndicatorSettings : this.pdfViewer.signatureFieldSettings.
                        signatureIndicatorSettings);
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
            (obj as PdfFormFieldBaseModel).isReadonly = this.pdfViewer.initialFieldSettings.isReadOnly ?
                this.pdfViewer.initialFieldSettings.isReadOnly : ((options as TextFieldSettings).isReadOnly ?
                    (options as TextFieldSettings).isReadOnly : false);
            obj.backgroundColor = !isNullOrUndefined((options as PdfFormFieldBaseModel).backgroundColor) ?
                PdfViewerUtils.setTransparencyToHex(this.colorNametoHashValue(
                    (options as PdfFormFieldBaseModel).backgroundColor as string)) : (obj as PdfFormFieldBaseModel).isReadonly ? 'trasnparent' :
                    '#daeaf7ff';
            obj.borderColor = !isNullOrUndefined((options as TextFieldSettings).borderColor) ?
                (options as TextFieldSettings).borderColor : '#303030';
            obj.fontSize = !isNullOrUndefined((options as PdfFormFieldBaseModel).fontSize) ?
                (options as PdfFormFieldBaseModel).fontSize : 10;
            obj.thickness = !isNullOrUndefined((options as PdfFormFieldBaseModel).thickness) ? (
                options as PdfFormFieldBaseModel).thickness : 1;
            (obj as PdfFormFieldBaseModel).fontStyle = !isNullOrUndefined((options as PdfFormFieldBaseModel).fontStyle) ? (options as PdfFormFieldBaseModel).fontStyle : 'None';
            (obj as PdfFormFieldBaseModel).name = !isNullOrUndefined(options.name) ? options.name : 'Initial' + this.formFieldIndex;
            (obj as PdfFormFieldBaseModel).isRequired = (options as TextFieldSettings).isRequired ?
                (options as TextFieldSettings).isRequired : false;
            (obj as InitialFieldSettings).isInitialField = true;
            const indicatorSettingsInitial: SignatureIndicatorSettingsModel = (options as InitialFieldSettings).initialIndicatorSettings ?
                (options as InitialFieldSettings).initialIndicatorSettings :
                ((options as SignatureFieldSettings).signatureIndicatorSettings ?
                    (options as SignatureFieldSettings).signatureIndicatorSettings : this.pdfViewer.initialFieldSettings.
                        initialIndicatorSettings);
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
        case 'ButtonField': {
            const buttonOptions: ButtonFieldSettings = options as ButtonFieldSettings;
            const buttonDefaults: ButtonFieldSettingsModel = this.pdfViewer.buttonFieldSettings;
            obj.formFieldAnnotationType = 'Button';
            obj.name = !isNullOrUndefined(options.name) ? options.name : 'Button' + this.formFieldIndex;
            // Product lock DEFAULT-100x40: unset/non-positive width/height → 100×40 (Property default stays 0,0,0,0).
            {
                const b: PdfBoundsModel = obj.bounds || {};
                const w: number = !isNullOrUndefined(b.width) ? b.width : (!isNullOrUndefined((b as IFormFieldBound).Width) ?
                    (b as IFormFieldBound).Width : 0);
                const h: number = !isNullOrUndefined(b.height) ? b.height : (!isNullOrUndefined((b as IFormFieldBound).Height) ?
                    (b as IFormFieldBound).Height : 0);
                const x: number = !isNullOrUndefined(b.x) ? b.x : (!isNullOrUndefined((b as IFormFieldBound).X) ?
                    (b as IFormFieldBound).X : 0);
                const y: number = !isNullOrUndefined(b.y) ? b.y : (!isNullOrUndefined((b as IFormFieldBound).Y) ?
                    (b as IFormFieldBound).Y : 0);
                obj.bounds = {
                    x: x,
                    y: y,
                    width: (w > 0) ? w : 100,
                    height: (h > 0) ? h : 40
                };
            }
            const caption: string = !isNullOrUndefined(buttonOptions.text) ? buttonOptions.text :
                (!isNullOrUndefined(buttonOptions.value) ? buttonOptions.value :
                    (!isNullOrUndefined(obj.value) && obj.value !== '' ? obj.value as string :
                        (!isNullOrUndefined(obj.name) ? obj.name as string : '')));
            obj.value = caption;
            obj.fontFamily = !isNullOrUndefined(buttonOptions.fontFamily) ? buttonOptions.fontFamily :
                (!isNullOrUndefined(buttonDefaults.fontFamily) ? buttonDefaults.fontFamily : 'Helvetica');
            obj.fontSize = !isNullOrUndefined(buttonOptions.fontSize) ? buttonOptions.fontSize :
                (!isNullOrUndefined(buttonDefaults.fontSize) ? buttonDefaults.fontSize : 10);
            obj.color = !isNullOrUndefined(buttonOptions.color) ? buttonOptions.color :
                (!isNullOrUndefined(buttonDefaults.color) ? buttonDefaults.color : 'black');
            obj.backgroundColor = !isNullOrUndefined(buttonOptions.backgroundColor) ? buttonOptions.backgroundColor :
                (!isNullOrUndefined(buttonDefaults.backgroundColor) ? buttonDefaults.backgroundColor : '#daeaf7ff');
            obj.alignment = !isNullOrUndefined(buttonOptions.alignment) ? buttonOptions.alignment :
                (!isNullOrUndefined(buttonDefaults.alignment) ? buttonDefaults.alignment : 'Center');
            obj.thickness = !isNullOrUndefined(buttonOptions.thickness) ? buttonOptions.thickness :
                (!isNullOrUndefined(buttonDefaults.thickness) ? buttonDefaults.thickness : 1);
            obj.borderColor = !isNullOrUndefined(buttonOptions.borderColor) ? buttonOptions.borderColor :
                (!isNullOrUndefined(buttonDefaults.borderColor) ? buttonDefaults.borderColor : '#303030');
            obj.isPrint = !isNullOrUndefined((options as ButtonFieldSettings).isPrint) ? (options as ButtonFieldSettings).isPrint :
                (!isNullOrUndefined(buttonDefaults.isPrint) ? buttonDefaults.isPrint : true);
            if ((buttonOptions as ButtonFieldSettings & { font?: PdfFontModel }).font) {
                obj.font = (buttonOptions as ButtonFieldSettings & { font?: PdfFontModel }).font;
            } else if (buttonOptions.fontStyle || buttonDefaults.fontStyle) {
                obj.font = this.setTextBoxFontStyle((buttonOptions.fontStyle || buttonDefaults.fontStyle) as FontStyle);
            }
            obj.actions =
                !isNullOrUndefined(buttonOptions.actions) ? buttonOptions.actions :
                    (!isNullOrUndefined(buttonDefaults.actions) ? buttonDefaults.actions : null);
            break;
        }
        }
        obj.tooltip = !isNullOrUndefined(options.tooltip) ? options.tooltip : '';
        if (this.pdfViewer.enableCollaborativeEditing) {
            ensureCollaborationId(obj as unknown as FormFieldModel);
        }
        this.setFormFieldIndex();
        let HTMLElement: HTMLElement = null;
        if (isCollection) {
            this.addFieldsCollection(obj);
        } else {
            HTMLElement = this.drawFormField(obj, isAddedProgrammatically);
        }
        return HTMLElement;
    }

    /**
     * @param {any} node - It describes about the pdf formfield base model
     * @deprecated - This API is obsolete. Use `addFieldsCollection` instead.
     * @returns {void}
     */
    public addFieldCollection(node: any): void {
        if (!Array.isArray(this.pdfViewer.formFieldCollections)) {
            this.pdfViewer.formFieldCollections = [];
        }
        const formField: FormFieldModel = {
            id: randomId(), name: (node as PdfFormFieldBaseModel).name, value: (node as PdfFormFieldBaseModel).value,
            type: this.getPublicFormFieldType(node.formFieldAnnotationType), isReadOnly: node.isReadonly, fontFamily: node.fontFamily,
            fontSize: node.fontSize, fontStyle: node.fontStyle as unknown as FontStyle, color: (node as PdfFormFieldBaseModel).color,
            backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor as string,
            isMultiline: (node as PdfFormFieldBaseModel).isMultiline,
            alignment: (node as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (node as PdfFormFieldBaseModel).visibility,
            maxLength: (node as PdfFormFieldBaseModel).maxLength, isRequired: (node as PdfFormFieldBaseModel).isRequired,
            isPrint: node.isPrint, isSelected: (node as PdfFormFieldBaseModel).isSelected,
            insertSpaces: (node as PdfFormFieldBaseModel).insertSpaces, isChecked: (node as PdfFormFieldBaseModel).isChecked,
            tooltip: (node as PdfFormFieldBaseModel).tooltip, bounds: node.bounds as IFormFieldBound, thickness: node.thickness,
            pageIndex: node.pageIndex, borderColor: (node as PdfFormFieldBaseModel).borderColor as string,
            signatureIndicatorSettings: (node as PdfFormFieldBaseModel).signatureIndicatorSettings,
            rotateAngle: (node as PdfFormFieldBaseModel).rotateAngle, isTransparent: (node as PdfFormFieldBaseModel).isTransparent,
            options : (node as PdfFormFieldBaseModel).options, selectedIndex : (node as PdfFormFieldBaseModel).selectedIndex,
            signatureType: (node as IFormField).signatureType as unknown as SignatureType[],
            zIndex : (node as PdfFormFieldBaseModel).zIndex,
            pageNumber : node.pageNumber, customData: (node as PdfFormFieldBaseModel).customData
        };
        this.applyButtonCollectionExtras(formField, node);
        this.applyBarcodeCollectionExtras(formField, node);
        if (this.pdfViewer.enableCollaborativeEditing) {
            ensureCollaborationId(formField);
            (node as PdfFormFieldBaseModel).customData = formField.customData;
        }
        if (this.pdfViewer.isClearCollections) {
            this.pdfViewer.formFieldCollections = [];
        }
        this.pdfViewer.formFieldCollections.push(formField);
    }

    /**
     * @param {PdfFormFieldBaseModel} node - It describes about the pdf formfield base model
     *
     * @returns {void}
     */
    public addFieldsCollection(node: PdfFormFieldBaseModel): void {
        if (!Array.isArray(this.pdfViewer.formFieldCollections)) {
            this.pdfViewer.formFieldCollections = [];
        }
        const formField: FormFieldModel = {
            id: randomId(), name: (node as PdfFormFieldBaseModel).name, value: (node as PdfFormFieldBaseModel).value,
            type: this.getPublicFormFieldType(node.formFieldAnnotationType), isReadOnly: node.isReadonly, fontFamily: node.fontFamily,
            fontSize: node.fontSize, fontStyle: node.fontStyle as unknown as FontStyle, color: (node as PdfFormFieldBaseModel).color,
            backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor as string,
            isMultiline: (node as PdfFormFieldBaseModel).isMultiline,
            alignment: (node as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (node as PdfFormFieldBaseModel).visibility,
            maxLength: (node as PdfFormFieldBaseModel).maxLength, isRequired: (node as PdfFormFieldBaseModel).isRequired,
            isPrint: node.isPrint, isSelected: (node as PdfFormFieldBaseModel).isSelected,
            insertSpaces: (node as PdfFormFieldBaseModel).insertSpaces, isChecked: (node as PdfFormFieldBaseModel).isChecked,
            tooltip: (node as PdfFormFieldBaseModel).tooltip, bounds: node.bounds as IFormFieldBound, thickness: node.thickness,
            pageIndex: node.pageIndex, borderColor: (node as PdfFormFieldBaseModel).borderColor as string,
            signatureIndicatorSettings: (node as PdfFormFieldBaseModel).signatureIndicatorSettings,
            rotateAngle: (node as PdfFormFieldBaseModel).rotateAngle, isTransparent: (node as PdfFormFieldBaseModel).isTransparent,
            options : (node as PdfFormFieldBaseModel).options, selectedIndex : (node as PdfFormFieldBaseModel).selectedIndex,
            signatureType: (node as IFormField).signatureType as unknown as SignatureType[],
            zIndex : (node as PdfFormFieldBaseModel).zIndex,
            pageNumber : node.pageNumber, customData: (node as PdfFormFieldBaseModel).customData
        };
        this.applyButtonCollectionExtras(formField, node);
        this.applyBarcodeCollectionExtras(formField, node);
        if (this.pdfViewer.enableCollaborativeEditing) {
            ensureCollaborationId(formField);
            node.customData = formField.customData;
        }
        if (this.pdfViewer.isClearCollections) {
            this.pdfViewer.formFieldCollections = [];
        }
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
        if (!Array.isArray(this.pdfViewer.formFieldCollections)) {
            this.pdfViewer.formFieldCollections = [];
        }
        if (!Array.isArray(this.pdfViewer.formFieldCollection)) {
            this.pdfViewer.formFieldCollection = [];
        }
        const node: PdfAnnotationBaseModel = this.pdfViewer.add(obj as PdfAnnotationBase);
        const index: number = this.pdfViewer.formFieldCollections.findIndex(function (
            el: FormFieldModel): boolean { return el.id === node.id; });
        let data: FormFieldModel;
        if (index > -1) {
            data = this.pdfViewer.formFieldCollections[parseInt(index.toString(), 10)];
            if (this.isFormFieldUpdated) {
                this.updateNodeBasedOnCollections(node, data);
            }
        }
        const formFieldIndex: number =
        this.pdfViewer.formFieldCollection.findIndex(function (el: PdfAnnotationBaseModel): boolean { return el.id === node.id; });
        if (formFieldIndex < 0) {
            this.pdfViewer.formFieldCollection.push(node);
        } else if (formFieldIndex > -1) {
            this.pdfViewer.formFieldCollection[parseInt(formFieldIndex.toString(), 10)] = node;
        }
        const formField: FormFieldModel | IFormField = {
            id: node.id, name: (node as PdfFormFieldBaseModel).name, value: (node as PdfFormFieldBaseModel).value,
            type: this.getPublicFormFieldType(node.formFieldAnnotationType), isReadOnly: node.isReadonly, fontFamily: node.fontFamily,
            fontSize: node.fontSize, fontStyle: node.fontStyle as unknown as FontStyle, color: (node as PdfFormFieldBaseModel).color,
            backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor as string,
            isMultiline: (node as PdfFormFieldBaseModel).isMultiline,
            alignment: (node as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (node as PdfFormFieldBaseModel).visibility,
            maxLength: (node as PdfFormFieldBaseModel).maxLength, isRequired: (node as PdfFormFieldBaseModel).isRequired,
            isPrint: node.isPrint, isSelected: (node as PdfFormFieldBaseModel).isSelected,
            isChecked: (node as PdfFormFieldBaseModel).isChecked, tooltip: (node as PdfFormFieldBaseModel).tooltip,
            bounds: node.bounds as IFormFieldBound, pageIndex: node.pageIndex, thickness: node.thickness,
            borderColor: (node as PdfFormFieldBaseModel).borderColor as string,
            signatureIndicatorSettings: (node as PdfFormFieldBaseModel).signatureIndicatorSettings,
            insertSpaces: (node as PdfFormFieldBaseModel).insertSpaces, rotateAngle: (node as PdfFormFieldBaseModel).rotateAngle,
            isTransparent: (node as PdfFormFieldBaseModel).isTransparent, options: (node as PdfFormFieldBaseModel).options,
            selectedIndex: (node as PdfFormFieldBaseModel).selectedIndex, signatureType: (
                node as PdfFormFieldBaseModel).signatureType as unknown as SignatureType[],
            zIndex: (node as PdfFormFieldBaseModel).zIndex, pageNumber: (node as PdfFormFieldBaseModel).pageNumber,
            customData: (node as PdfFormFieldBaseModel).customData
        };
        // Prefer original designer obj (actions may be dropped when wrapping node via add())
        this.applyButtonCollectionExtras(formField as FormFieldModel, obj);
        this.applyButtonCollectionExtras(formField as FormFieldModel, node as PdfFormFieldBaseModel);
        this.applyBarcodeCollectionExtras(formField as FormFieldModel, node as PdfFormFieldBaseModel);
        if (this.pdfViewer.enableCollaborativeEditing) {
            ensureCollaborationId(formField as FormFieldModel);
            (node as PdfFormFieldBaseModel).customData = formField.customData;
            obj.customData = formField.customData;
        }
        (formField as unknown as IFormField).isUnisonSelected = (node as PdfFormFieldBaseModel).isUnisonSelected;
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
     * @param {FormFieldModel} data - It describes about the data
     * @returns {void}
     */
    private updateNodeBasedOnCollections(node: PdfFormFieldBaseModel, data: FormFieldModel): void {
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
        (node as PdfFormFieldBaseModel).customData = applyCustomData(
            node as unknown as FormFieldModel, data.customData, this.pdfViewer.enableCollaborativeEditing);
        // Keep designer node AA in sync with formFieldCollections (ButtonField GoTo).
        if (data.type === 'ButtonField' || (node as PdfFormFieldBaseModel).formFieldAnnotationType === 'Button') {
            if (!isNullOrUndefined(data.actions)) {
                (node as PdfFormFieldBaseModel).actions = data.actions;
            }
        }
        if (node.formFieldAnnotationType === 'BarcodeField') {
            (node as PdfFormFieldBaseModel).symbology = data.symbology;
            (node as PdfFormFieldBaseModel).xDimension = data.xDimension;
            (node as PdfFormFieldBaseModel).errorCorrectionLevel = data.errorCorrectionLevel;
            (node as PdfFormFieldBaseModel).valueFormat = data.valueFormat;
            (node as PdfFormFieldBaseModel).fields = data.fields;
            (node as PdfFormFieldBaseModel).includeFieldNames = data.includeFieldNames;
            (node as PdfFormFieldBaseModel).compressData = data.compressData;
            (node as PdfFormFieldBaseModel).customValue = data.customValue;
            (node as PdfFormFieldBaseModel).caption = data.caption;
        }
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
        if (this.pdfViewer.readOnlySettings.formFields) {
            this.isSetFormFieldMode = false;
            return;
        }
        initializeTelemetryFeature('Form Field Add/Edit', 'PDFViewer');
        if (this.pdfViewer.selectedItems && !isNullOrUndefined(this.pdfViewer.selectedItems.annotations) &&
         this.pdfViewer.selectedItems.annotations.length > 0 && this.pdfViewerBase.activeElements &&
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
        case 'ButtonField': {
            const buttonType: FormFieldAnnotationType = 'Button';
            this.activateButtonElement(buttonType);
            this.isSetFormFieldMode = true;
            break;
        }
        case 'Barcode': {
            const barcodeType: FormFieldAnnotationType = 'BarcodeField';
            this.activateBarcodeElement(barcodeType);
            this.isSetFormFieldMode = true;
            break;
        }
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
            case 'Button':
                this.resetButtonProperties(formField);
                break;
            case 'BarcodeField':
                this.resetBarcodeProperties(formField);
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
                           DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings | BarcodeFieldSettings |
                           SignatureFieldSettings | InitialFieldSettings | ButtonFieldSettings | FormFieldModel): void {
        if (this.pdfViewer.readOnlySettings.formFields) {
            return;
        }
        const formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        this.isFormFieldUpdated = true;
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        if (formField) {
            if (!formField.isReadonly || (!isNullOrUndefined((options as TextFieldSettings).isReadOnly) &&
                !(options as TextFieldSettings).isReadOnly) || formField.formFieldAnnotationType === 'BarcodeField') {
                switch (formField.formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                case 'DropdownList':
                case 'ListBox':
                case 'SignatureField':
                case 'InitialField':
                case 'BarcodeField':
                case 'Button': {
                    let inputElement: Element = document.getElementById(formField.id + '_content_html_element');
                    if (inputElement) {
                        inputElement = inputElement.firstElementChild.firstElementChild;
                        this.isAddFormFieldProgrammatically = true;
                        this.formFieldPropertyChange(formField, options, inputElement as HTMLElement, selectedItem);
                    }
                    else {
                        this.updateFormFieldsInCollections(formFieldId, options);
                        this.updateDesignerSession(formFieldId, options);
                        this.rerenderFormFields((formFieldId as { pageIndex: number }).pageIndex);
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
        this.isFormFieldUpdated = false;
    }

    /**
     * Update the form field in the form designer session.
     *
     * @param {string} formFieldId - It describes about the form field id
     * @param {TextFieldSettings} options - It describes about the options
     * @returns {void}
     */
    private updateDesignerSession(formFieldId: string | object, options: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings |
    DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings |
    SignatureFieldSettings | InitialFieldSettings | ButtonFieldSettings | FormFieldModel): void {
        const fieldId: string = (typeof formFieldId === 'object') ? (formFieldId as { id: string }).id : formFieldId;
        const actualObject: PdfFormFieldBaseModel = this.pdfViewer.nameTable[`${fieldId}`];
        const bound: PdfBoundsModel = actualObject.bounds;
        const wrapper: DiagramHtmlElement = actualObject.wrapper.children[0] as DiagramHtmlElement;
        const type : string = actualObject.formFieldAnnotationType;
        let isEdited: boolean = false;
        if (!isNullOrUndefined((options as PdfFormFieldBaseModel).customData) && actualObject.customData !== (
            options as PdfFormFieldBaseModel).customData) {
            applyCustomData(actualObject as unknown as FormFieldModel, (options as PdfFormFieldBaseModel).customData,
                            this.pdfViewer.enableCollaborativeEditing);
            isEdited = true;
        }
        if (!isNullOrUndefined(options.name) && actualObject.name !== options.name) {
            actualObject.name = options.name;
            isEdited = true;
        }
        if (!isNullOrUndefined((options as PdfFormFieldBaseModel).borderColor) && actualObject.borderColor !== (
            options as PdfFormFieldBaseModel).borderColor) {
            actualObject.borderColor = (options as PdfFormFieldBaseModel).borderColor;
            isEdited = true;
        }
        if (!isNullOrUndefined((options as PdfFormFieldBaseModel).backgroundColor)
            && actualObject.backgroundColor !== (options as PdfFormFieldBaseModel).backgroundColor) {
            actualObject.backgroundColor = (options as PdfFormFieldBaseModel).backgroundColor;
            isEdited = true;
        }
        if (!isNullOrUndefined((options as PdfFormFieldBaseModel).value) && actualObject.value !== (
            options as PdfFormFieldBaseModel).value) {
            actualObject.value = (options as PdfFormFieldBaseModel).value;
            isEdited = true;
        }
        if ((type === 'Button' || type === 'ButtonField') &&
            !isNullOrUndefined((options as ButtonFieldSettings).actions)) {
            actualObject.actions = (options as ButtonFieldSettings).actions as ActionsSettingsModel;
            isEdited = true;
        }
        if (!isNullOrUndefined((options as PdfFormFieldBaseModel).isChecked) && (actualObject as
            PdfFormFieldBaseModel & { Selected?: boolean }).Selected !== (options as PdfFormFieldBaseModel).isChecked) {
            (actualObject as PdfFormFieldBaseModel & { Selected?: boolean }).Selected = (options as PdfFormFieldBaseModel).isChecked;
            isEdited = true;
        }
        if (!isNullOrUndefined(options.bounds) && (actualObject.bounds as PdfBoundsModel & { properties: unknown; }).properties !== options.
            bounds) {
            const { X, Y, Width, Height } = options.bounds;
            const updatedBounds: { x: number, y: number, width: number, height: number } = { x: X, y: Y, width: Width, height: Height };
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
            (options as PdfFormFieldBaseModel).bounds = updatedBounds;
            this.pdfViewer.drawing.nodePropertyChange(actualObject, (options as PdfFormFieldBaseModel));
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
     * @param {string} formFieldId - It describes about the form field id
     * @param {TextFieldSettings} options - It describes about the options
     * @returns {void}
     */
    private updateFormFieldsInFieldsSession(formFieldId: string | object, options: TextFieldSettings |
    PasswordFieldSettings | CheckBoxFieldSettings |
    DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings |
    SignatureFieldSettings | InitialFieldSettings | ButtonFieldSettings | BarcodeFieldSettings | FormFieldModel): void {
        const fieldsData: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        let isEdited: boolean = false;
        if (!isNullOrUndefined(fieldsData)) {
            const data: PdfRenderedFields[] = JSON.parse(fieldsData);
            const formFieldCollection: FormFieldModel[] = this.pdfViewer.formFieldCollections;
            if (typeof formFieldId !== 'object') {
                for (let i: number = 0; i < formFieldCollection.length; i++) {
                    const currentData: FormFieldModel = formFieldCollection[parseInt(i.toString(), 10)];
                    if (currentData.id === formFieldId) {
                        formFieldId = currentData;
                    }
                }
            }
            for (let x: number = 0; x < data.length; x++) {
                if (data[parseInt(x.toString(), 10)].FieldName === (formFieldId as { name: string }).name) {
                    if (!isNullOrUndefined((options as PdfFormFieldBaseModel).customData)
                        && data[parseInt(x.toString(), 10)].CustomData !== (options as PdfFormFieldBaseModel).customData) {
                        data[parseInt(x.toString(), 10)].CustomData = applyCustomData(
                            { customData: data[parseInt(x.toString(), 10)].CustomData } as unknown as FormFieldModel,
                            (options as PdfFormFieldBaseModel).customData,
                            this.pdfViewer.enableCollaborativeEditing);
                        isEdited = true;
                    }
                    if (!isNullOrUndefined((options as PdfFormFieldBaseModel).backgroundColor)
                        && data[parseInt(x.toString(), 10)].BackColor !== (options as
                    PdfFormFieldBaseModel).backgroundColor as unknown as FormFieldColor) {
                        const rgbaObj: { r: number, g: number, b: number, a: number } = this.getRgbCode((
                            options as PdfFormFieldBaseModel).backgroundColor as string) as { r: number; g: number; b: number, a: number };
                        const rgbaValue: { R: number; G: number; B: number, A: number } = { R: rgbaObj.r, G: rgbaObj.g, B: rgbaObj.b,
                            A: rgbaObj.a};
                        data[parseInt(x.toString(), 10)].BackColor = rgbaValue;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined((options as PdfFormFieldBaseModel).borderColor)
                        && data[parseInt(x.toString(), 10)].BorderColor !== (options as
                    PdfFormFieldBaseModel).borderColor as unknown as FormFieldColor) {
                        data[parseInt(x.toString(), 10)].BorderColor = this.getRgbCode((options as PdfFormFieldBaseModel).borderColor as
                                                              string)  as unknown as FormFieldColor;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined(options.name) && data[parseInt(x.toString(), 10)].Name !== options.name) {
                        data[parseInt(x.toString(), 10)].Name = options.name;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined((options as PdfFormFieldBaseModel).value) && ((formFieldId as { type: string }).type === 'PasswordField' || (formFieldId as { type: string }).type === 'Textbox')
                        && data[parseInt(x.toString(), 10)].Text !== (options as PdfFormFieldBaseModel).value) {
                        data[parseInt(x.toString(), 10)].Text = (options as PdfFormFieldBaseModel).value;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined((options as PdfFormFieldBaseModel).value) && (formFieldId as { type: string }).type !== 'PasswordField' && (formFieldId as { type: string }).type !== 'Textbox'
                        && data[parseInt(x.toString(), 10)].Value !== (options as PdfFormFieldBaseModel).value) {
                        data[parseInt(x.toString(), 10)].Value = (options as PdfFormFieldBaseModel).value;
                        isEdited = true;
                    }
                    // ButtonField: keep dual-case actions on _formfields for save/download AA parity.
                    // PdfRenderedFields.Name is internal 'Button'; public type is 'ButtonField'.
                    if (!isNullOrUndefined((options as ButtonFieldSettings).actions) &&
                        ((formFieldId as { type: string }).type === 'ButtonField' ||
                            (formFieldId as { type: string }).type === 'Button' || data[parseInt(x.toString(), 10)].Name === 'Button')) {
                        const buttonActions: ActionsSettingsModel = (options as ButtonFieldSettings).actions;
                        data[parseInt(x.toString(), 10)].Actions = buttonActions;
                        (data[parseInt(x.toString(), 10)] as { actions?: ActionsSettingsModel }).actions = buttonActions;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined((options as ButtonFieldSettings).text) &&
                        ((formFieldId as { type: string }).type === 'ButtonField' ||
                            (formFieldId as { type: string }).type === 'Button' || data[parseInt(x.toString(), 10)].Name === 'Button') &&
                        (data[parseInt(x.toString(), 10)].Value !== (options as ButtonFieldSettings).text)) {
                        data[parseInt(x.toString(), 10)].Value = (options as ButtonFieldSettings).text;
                        data[parseInt(x.toString(), 10)].Text = (options as ButtonFieldSettings).text;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined((options as PdfFormFieldBaseModel).isChecked)
                        && data[parseInt(x.toString(), 10)].Selected !== (options as PdfFormFieldBaseModel).isChecked) {
                        data[parseInt(x.toString(), 10)].Selected = (options as PdfFormFieldBaseModel).isChecked;
                        isEdited = true;
                    }
                    if (!isNullOrUndefined(options.bounds)) {
                        const lineBounds: IFormFieldBound = {
                            X: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data[x as number].LineBounds.X),
                            Y: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data[x as number].LineBounds.Y),
                            Width: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data[x as number].LineBounds.Width),
                            Height: this.pdfViewer.formFieldsModule.ConvertPointToPixel(data[x as number].LineBounds.Height)
                        };
                        if (JSON.stringify(lineBounds) !== JSON.stringify(options.bounds)) {
                            const newLineBounds: IFormFieldBound = {
                                X: PdfViewerUtils.convertPixelToPoint(options.bounds.X),
                                Y: PdfViewerUtils.convertPixelToPoint(options.bounds.Y),
                                Width: PdfViewerUtils.convertPixelToPoint(options.bounds.Width),
                                Height: PdfViewerUtils.convertPixelToPoint(options.bounds.Height)
                            };
                            data[x as number].LineBounds = newLineBounds;
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
     * @param {string} formFieldId - It describes about the form field id
     * @param {TextFieldSettings} options - It describes about the options
     * @returns {void}
     */
    private updateFormFieldsInCollections(formFieldId: string | object, options: TextFieldSettings | PasswordFieldSettings |
    CheckBoxFieldSettings |
    DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings |
    SignatureFieldSettings | InitialFieldSettings | ButtonFieldSettings | BarcodeFieldSettings | FormFieldModel): void {
        const formFieldCollection: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        for (let i: number = 0; i < formFieldCollection.length; i++) {
            const currentData: FormFieldModel = formFieldCollection[parseInt(i.toString(), 10)];
            const fieldId: string = (typeof formFieldId === 'object') ? (formFieldId as { id: string }).id : formFieldId;
            if (currentData.id === fieldId) {
                this.updateFormFieldData(currentData, options);
                const formFieldIndex: number = this.pdfViewer.formFieldCollections.findIndex(function (el: FormFieldModel): boolean
                { return el.id === fieldId; });
                this.pdfViewer.formFieldCollections[parseInt(formFieldIndex.toString(), 10)] = currentData;
            }
        }
    }

    /**
     * Update the form field data based on the value
     *
     * @param {FormFieldModel} currentData - It describes about the current data
     * @param {TextFieldSettings} options - It describes about the options
     * @returns {void}
     */
    private updateFormFieldData(currentData: FormFieldModel, options: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings |
    DropdownFieldSettings | RadioButtonFieldSettings | ListBoxFieldSettings |
    SignatureFieldSettings | InitialFieldSettings | ButtonFieldSettings | BarcodeFieldSettings | FormFieldModel): void {
        if (options.name && currentData.name !== options.name) {
            currentData.name = options.name;
        }
        if (options.bounds) {
            const { X, Y, Width, Height } = options.bounds;
            const updatedBounds: PdfBoundsModel = { x: X, y: Y, width: Width, height: Height };
            if (
                (currentData.bounds as PdfBoundsModel).x !== updatedBounds.x ||
                (currentData.bounds as PdfBoundsModel).y !== updatedBounds.y ||
                (currentData.bounds as PdfBoundsModel).width !== updatedBounds.width ||
                (currentData.bounds as PdfBoundsModel).height !== updatedBounds.height
            ) {
                (currentData.bounds as PdfBoundsModel) = updatedBounds;
            }
        }
        if (currentData.type !== 'SignatureField' && currentData.type !== 'InitialField') {
            if ((options as TextFieldSettings).thickness && currentData.thickness !== (options as TextFieldSettings).thickness) {
                currentData.thickness = (options as TextFieldSettings).thickness;
            }
            if ((options as PdfFormFieldBaseModel).borderColor) {
                const borderColor: string = this.colorNametoHashValue((options as PdfFormFieldBaseModel).borderColor as string);
                if (currentData.borderColor !== borderColor) {
                    currentData.borderColor = borderColor;
                }
            }
        }
        if ((options as PdfFormFieldBaseModel).backgroundColor) {
            const backColor: string = this.colorNametoHashValue((options as PdfFormFieldBaseModel).backgroundColor as string);
            if (currentData.backgroundColor !== backColor) {
                currentData.backgroundColor = backColor;
                const id : string = currentData.id;
                if (!isNullOrUndefined((this.pdfViewer.nameTable as { [key: string]: { backgroundColor: string } })[`${id}`])) {
                    (this.pdfViewer.nameTable as { [key: string]: { backgroundColor: string } })[`${id}`].backgroundColor = backColor;
                }
            }
        }
        if (!isNullOrUndefined((options as PdfFormFieldBaseModel).customData) && currentData.customData !== (
            options as PdfFormFieldBaseModel).customData) {
            applyCustomData(currentData, (options as PdfFormFieldBaseModel).customData,
                            this.pdfViewer.enableCollaborativeEditing);
        }
        if (!isNullOrUndefined((options as TextFieldSettings).isReadOnly) &&
            currentData.isReadOnly !== (options as TextFieldSettings).isReadOnly) {
            currentData.isReadOnly = (options as TextFieldSettings).isReadOnly;
        }
        if (!isNullOrUndefined((options as TextFieldSettings).isRequired) &&
            currentData.isRequired !== (options as TextFieldSettings).isRequired) {
            currentData.isRequired = (options as TextFieldSettings).isRequired;
        }
        if (!isNullOrUndefined((options as TextFieldSettings).isPrint) &&
            currentData.isPrint !== (options as TextFieldSettings).isPrint) {
            currentData.isPrint = (options as TextFieldSettings).isPrint;
        }
        if ((options as TextFieldSettings).visibility && currentData.visibility !== (options as TextFieldSettings).visibility) {
            currentData.visibility = (options as TextFieldSettings).visibility;
        }
        if (options.tooltip && currentData.tooltip !== options.tooltip) {
            currentData.tooltip = options.tooltip;
        }
        if (currentData.type === 'CheckBox' && (!isNullOrUndefined((options as PdfFormFieldBaseModel).isChecked) && currentData.isChecked !== (options as PdfFormFieldBaseModel).isChecked)) {
            currentData.isChecked = (options as PdfFormFieldBaseModel).isChecked;
        }
        if (currentData.type === 'RadioButton' && (!isNullOrUndefined((options as PdfFormFieldBaseModel).isSelected) && currentData.isSelected !== (options as PdfFormFieldBaseModel).isSelected)) {
            currentData.isSelected = (options as PdfFormFieldBaseModel).isSelected;
        }
        if ((currentData.type === 'DropDown' || currentData.type === 'ListBox') && (options as PdfFormFieldBaseModel).options) {
            currentData.options = (options as PdfFormFieldBaseModel).options;
        }
        if (currentData.type === 'Textbox' || currentData.type === 'SignatureField' || currentData.type === 'InitialField' ||
            currentData.type === 'DropDown' || currentData.type === 'ListBox' ||
            currentData.type === 'Password' || currentData.type === 'ButtonField') {
            if ((options as PdfFormFieldBaseModel).value && currentData.value !== (options as PdfFormFieldBaseModel).value) {
                currentData.value = (options as PdfFormFieldBaseModel).value;
            }
            if (!isNullOrUndefined((options as ButtonFieldSettings).text) && currentData.value !== (options as ButtonFieldSettings).text) {
                currentData.value = (options as ButtonFieldSettings).text;
            }
            if (!isNullOrUndefined((options as ButtonFieldSettings).actions)) {
                currentData.actions = (options as ButtonFieldSettings).actions;
            }
            if ((options as PdfFormFieldBaseModel).fontSize && currentData.fontSize !== (options as PdfFormFieldBaseModel).fontSize) {
                currentData.fontSize = (options as PdfFormFieldBaseModel).fontSize;
            }
            if ((options as PdfFormFieldBaseModel).color) {
                const color: string = this.colorNametoHashValue((options as PdfFormFieldBaseModel).color);
                if (currentData.color !== color) {
                    currentData.color = color;
                }
            }
            if (currentData.type !== 'SignatureField') {
                if ((options as PdfFormFieldBaseModel).alignment && currentData.alignment !== (
                    options as PdfFormFieldBaseModel).alignment) {
                    currentData.alignment = (options as PdfFormFieldBaseModel).alignment as TextAlignment;
                }
                if ((options as PdfFormFieldBaseModel).maxLength && currentData.maxLength !== (
                    options as PdfFormFieldBaseModel).maxLength) {
                    currentData.maxLength = (options as PdfFormFieldBaseModel).maxLength;
                }
            }
            if (currentData.type !== 'Password') {
                if ((options as PdfFormFieldBaseModel).fontFamily && currentData.fontFamily !== (
                    options as PdfFormFieldBaseModel).fontFamily) {
                    currentData.fontFamily = (options as PdfFormFieldBaseModel).fontFamily;
                }
                if ((options as PdfFormFieldBaseModel).fontStyle && currentData.fontStyle !== ((
                    options as PdfFormFieldBaseModel).fontStyle as unknown as FontStyle)) {
                    currentData.fontStyle = (options as PdfFormFieldBaseModel).fontStyle as unknown as FontStyle;
                }
            }
        }
    }

    private formFieldPropertyChange(formFieldObject: PdfFormFieldBaseModel,
                                    options: TextFieldSettings | PasswordFieldSettings | CheckBoxFieldSettings |
                                    DropdownFieldSettings | RadioButtonFieldSettings | SignatureFieldSettings |
                                    InitialFieldSettings | BarcodeFieldSettings | ButtonFieldSettings | FormFieldModel,
                                    htmlElement: HTMLElement, selectedItem ?: PdfFormFieldBaseModel): void {
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
        let oldValue: string | number | boolean | string[] | number[] | object;
        let newValue: string | number | boolean | string[] | number[] | object;
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
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).name = formFieldObject.name;
            if (isNameChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue, isNameChanged);
            }
        }
        if (formFieldObject.formFieldAnnotationType) {
            if (!isNullOrUndefined((options as TextFieldSettings).thickness)) {
                if (formFieldObject.thickness !== (options as TextFieldSettings).thickness) {
                    isBorderWidthChanged = true;
                    oldValue = formFieldObject.thickness;
                    newValue = (options as TextFieldSettings).thickness;
                }
                htmlElement.style.borderWidth = (options as TextFieldSettings).thickness.toString() + 'px';
                formFieldObject.thickness = (options as TextFieldSettings).thickness;
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).thickness = (options as TextFieldSettings).thickness;
                if (isBorderWidthChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                          false, false, false, false, isBorderWidthChanged, false, false,
                                                          false, false, false, false, false, false,  oldValue, newValue);
                }
            }
            if ((options as PdfFormFieldBaseModel).borderColor) {
                const borderColor: string = this.colorNametoHashValue((options as PdfFormFieldBaseModel).borderColor as string);
                if (formFieldObject.borderColor !== borderColor) {
                    isBorderColorChanged = true;
                    oldValue = formFieldObject.borderColor;
                    newValue = borderColor;
                }
                formFieldObject.borderColor = borderColor;
                htmlElement.style.borderColor = borderColor;
                if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                    (htmlElement.parentElement as HTMLElement).style.boxShadow = borderColor + ' 0px 0px 0px ' + formFieldObject.thickness + 'px';
                    this.setToolTip(options.tooltip, (htmlElement.parentElement as HTMLElement));
                }
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).borderColor = borderColor;
                if (isBorderColorChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                          false, false, false, isBorderColorChanged, false, false,
                                                          false, false, false, false, false, false, false, oldValue, newValue);
                }
            }
        }
        if ((options as PdfFormFieldBaseModel).backgroundColor) {
            let backColor: string = this.colorNametoHashValue((options as PdfFormFieldBaseModel).backgroundColor as string);
            backColor = formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType ===
                'InitialField' ? PdfViewerUtils.setTransparencyToHex(backColor) : PdfViewerUtils.removeAlphaValueFromHex(backColor);
            if (formFieldObject.backgroundColor !== backColor) {
                isBackgroundColorChanged = true;
                oldValue = formFieldObject.backgroundColor;
                newValue = backColor;
            }
            formFieldObject.backgroundColor = backColor;
            if (formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType === 'InitialField') {
                (htmlElement.parentElement as HTMLElement).style.background = backColor;
            }
            else {
                htmlElement.style.background = backColor;
            }
            if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                (htmlElement.parentElement as HTMLElement).style.background = formFieldObject.backgroundColor;
            }
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).backgroundColor = backColor;
            if (isBackgroundColorChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, isBackgroundColorChanged, false, false, false,
                                                      false, false, false, false, false, false, false, oldValue, newValue);
            }
        }
        if (options.bounds) {
            const formBounds: PdfBoundsModel = formFieldObject.bounds;
            const optionBounds: IFormFieldBound = options.bounds;
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
            const formField: PdfFormFieldBaseModel = this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]];
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
            if (formField.formFieldAnnotationType === 'BarcodeField') {
                this.refreshBarcodeGlyph(formField);
            }
        }
        if (!isNullOrUndefined((options as TextFieldSettings).isRequired)) {
            if (formFieldObject.isRequired !== (options as TextFieldSettings).isRequired) {
                isRequiredChanged = true;
                oldValue = formFieldObject.isRequired;
                newValue = (options as TextFieldSettings).isRequired;
            }
            formFieldObject.isRequired = (options as TextFieldSettings).isRequired;
            this.setRequiredToElement(formFieldObject, htmlElement, (options as TextFieldSettings).isRequired);
            this.setRequiredToFormField(formFieldObject, (options as TextFieldSettings).isRequired);
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).isRequired = (options as TextFieldSettings).isRequired;
            if (isRequiredChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, isRequiredChanged, false, false, false, oldValue, newValue);
            }
        }
        if ((options as TextFieldSettings).visibility) {
            if (formFieldObject.visibility !== (options as TextFieldSettings).visibility) {
                isVisibilityChanged = true;
                oldValue = formFieldObject.visibility;
                newValue = (options as TextFieldSettings).visibility;
            }
            formFieldObject.visibility = (options as TextFieldSettings).visibility;
            htmlElement.style.visibility = (options as TextFieldSettings).visibility;
            if (formFieldObject.formFieldAnnotationType === 'RadioButton' || formFieldObject.formFieldAnnotationType === 'ListBox' ||
                formFieldObject.formFieldAnnotationType === 'DropdownList') {
                (htmlElement as IElement).parentElement.style.visibility = formFieldObject.visibility;
            }
            if (formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType === 'InitialField') {
                (htmlElement as IElement).parentElement.style.visibility = formFieldObject.visibility;
                const annotation: PdfAnnotationBaseModel = this.pdfViewer.nameTable[formFieldObject.id.split('_')[0] + '_content'] as PdfAnnotationBaseModel;
                const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                const formFieldsData: any = JSON.parse(data);
                const index: number = this.getFormFiledIndex(formFieldObject.id.split('_')[0]);
                if (formFieldObject.visibility === 'hidden') {
                    if (annotation) {
                        this.hideSignatureValue(formFieldObject, annotation, index, formFieldsData as unknown as IFormFieldCollection[]);
                    }
                }
                else {
                    if (annotation) {
                        this.showSignatureValue(formFieldObject, oldValue, annotation, index,
                                                formFieldsData as unknown as IFormFieldCollection[]);
                    }
                }
            }
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).visibility = (options as TextFieldSettings).visibility;
            if (isVisibilityChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, false, isVisibilityChanged,
                                                      false, false, false, false, false, oldValue, newValue);
            }
        }
        if (!isNullOrUndefined((options as TextFieldSettings).isPrint)) {
            if (formFieldObject.isPrint !== (options as TextFieldSettings).isPrint) {
                isPrintChanged = true;
                oldValue = formFieldObject.isPrint;
                newValue = (options as TextFieldSettings).isPrint;
            }
            formFieldObject.isPrint = (options as TextFieldSettings).isPrint;
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).isPrint = (options as TextFieldSettings).isPrint;
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
                    this.setToolTip(options.tooltip, (htmlElement as IElement).parentElement);
                }
                else {
                    this.setToolTip(options.tooltip, htmlElement);
                }
            }
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).tooltip = options.tooltip;
            if (isToolTipChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, false, false, isToolTipChanged, false, oldValue, newValue);
            }
        }
        if (!isNullOrUndefined((options as TextFieldSettings).customData)) {
            if (formFieldObject.customData !== (options as TextFieldSettings).customData) {
                isCustomDataChanged = true;
                oldValue = formFieldObject.customData;
                newValue = (options as TextFieldSettings).customData;
            }
            const mergedCustomData: object = applyCustomData(formFieldObject as unknown as FormFieldModel,
                                                             options.customData, this.pdfViewer.enableCollaborativeEditing);
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).customData = mergedCustomData;
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
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).isChecked = (options as CheckBoxFieldSettings).isChecked;
            if ((options as CheckBoxFieldSettings).value || (options as CheckBoxFieldSettings).isChecked) {
                if (formFieldObject.value !== (options as CheckBoxFieldSettings).value) {
                    isValueChanged = true;
                    oldValue = formFieldObject.value;
                    newValue = (options as CheckBoxFieldSettings).value;
                }
                formFieldObject.value = (options as CheckBoxFieldSettings).value;
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).value = (options as CheckBoxFieldSettings).value;
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
            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).isSelected =
                (options as RadioButtonFieldSettings).isSelected;
            if ((options as RadioButtonFieldSettings).isSelected) {
                const radioKids: FormFieldModel[] = (this.pdfViewer.formFieldCollections || []).filter(
                    (item: FormFieldModel) => item.type === 'RadioButton' && item.name === formFieldObject.name);
                for (let k: number = 0; k < radioKids.length; k++) {
                    if (radioKids[parseInt(k.toString(), 10)].id !== formFieldObject.id) {
                        radioKids[parseInt(k.toString(), 10)].isSelected = false;
                    }
                }
                const nameTableKeys: string[] = Object.keys(this.pdfViewer.nameTable || {});
                for (let k: number = 0; k < nameTableKeys.length; k++) {
                    const kid: PdfFormFieldBaseModel = (this.pdfViewer.nameTable as
                        { [key: string]: PdfFormFieldBaseModel })[nameTableKeys[parseInt(k.toString(), 10)]];
                    if (kid && kid.formFieldAnnotationType === 'RadioButton' && kid.name === formFieldObject.name &&
                        kid.id !== formFieldObject.id) {
                        kid.isSelected = false;
                    }
                }
            }
            if ((options as RadioButtonFieldSettings).value || (options as RadioButtonFieldSettings).isSelected) {
                if (formFieldObject.value !== (options as RadioButtonFieldSettings).value) {
                    isValueChanged = true;
                    oldValue = formFieldObject.value;
                    newValue = (options as RadioButtonFieldSettings).value;
                }
                formFieldObject.value = (options as RadioButtonFieldSettings).value;
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).value = (options as RadioButtonFieldSettings).value;
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
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).options = formFieldObject.options;
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'Textbox' || formFieldObject.formFieldAnnotationType === 'SignatureField' || formFieldObject.formFieldAnnotationType === 'InitialField' ||
            formFieldObject.formFieldAnnotationType === 'DropdownList' || formFieldObject.formFieldAnnotationType === 'ListBox'
            || formFieldObject.formFieldAnnotationType === 'PasswordField' || formFieldObject.formFieldAnnotationType === 'Button') {
            const buttonOptions: ButtonFieldSettings = options as ButtonFieldSettings;
            if (formFieldObject.formFieldAnnotationType === 'Button') {
                const caption: string = !isNullOrUndefined(buttonOptions.text) ? buttonOptions.text :
                    (!isNullOrUndefined(buttonOptions.value) ? buttonOptions.value : undefined);
                if (!isNullOrUndefined(caption) && formFieldObject.value !== caption) {
                    isValueChanged = true;
                    oldValue = formFieldObject.value;
                    newValue = caption;
                    formFieldObject.value = caption;
                    if (htmlElement.tagName === 'INPUT' || htmlElement.tagName === 'BUTTON') {
                        (htmlElement as HTMLInputElement).value = caption;
                    } else {
                        htmlElement.textContent = caption;
                    }
                    (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).value = caption;
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, isValueChanged, false, false,
                                                          false, false, false, false, false, false, false, false, false,
                                                          false, false, false, false, oldValue, newValue);
                }
                if (!isNullOrUndefined(buttonOptions.actions)) {
                    const buttonModel: PdfFormFieldBaseModel = formFieldObject as PdfFormFieldBaseModel;
                    oldValue = buttonModel.actions as object;
                    newValue = buttonOptions.actions as object;
                    buttonModel.actions = buttonOptions.actions;
                    (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).actions =
                        buttonOptions.actions;
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                          false, false, false, false, false, false, false, false, false,
                                                          false, false, false, false, oldValue, newValue);
                }
            }
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
                    if (!isNullOrUndefined((options as PdfFormFieldBaseModel).selectedIndex) && formFieldObject.selectedIndex !==
                     (options as PdfFormFieldBaseModel).selectedIndex) {
                        formFieldObject.selectedIndex = (options as PdfFormFieldBaseModel).selectedIndex;
                        (htmlElement as IElement).options.selectedIndex = (options as PdfFormFieldBaseModel).selectedIndex;
                    }
                }
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).value = (options as TextFieldSettings).value ? (options as TextFieldSettings).value : formFieldObject.value;
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
                if (selectedItem) {
                    if (document.getElementById(selectedItem.id + '_content_html_element')) {
                        this.updateTextboxFormDesignerProperties(selectedItem);
                    } else {
                        this.updateFormFieldPropertiesInCollections(selectedItem);
                    }
                }
            }
            if ((options as PdfFormFieldBaseModel).fontSize) {
                if (formFieldObject.fontSize !== (options as PdfFormFieldBaseModel).fontSize) {
                    isFontSizeChanged = true;
                    oldValue = formFieldObject.fontSize;
                    newValue = (options as PdfFormFieldBaseModel).fontSize;
                }
                formFieldObject.fontSize = (options as PdfFormFieldBaseModel).fontSize;
                htmlElement.style.fontSize = ((options as PdfFormFieldBaseModel).fontSize * zoomValue) + 'px';
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).fontSize = (options as PdfFormFieldBaseModel).fontSize;
                if (isFontSizeChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, isFontSizeChanged,
                                                          false, false, false, false, false, false, false,
                                                          false, false, false, false, false, false, oldValue, newValue);
                }
            }
            if ((options as PdfFormFieldBaseModel).color) {
                const color: string = this.colorNametoHashValue((options as PdfFormFieldBaseModel).color);
                if (formFieldObject.color !== color) {
                    isColorChanged = true;
                    oldValue = formFieldObject.color;
                    newValue = color;
                }
                formFieldObject.color = color;
                htmlElement.style.color = color;
                (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).color = color;
                if (isColorChanged) {
                    this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                          false, isColorChanged, false, false, false, false,
                                                          false, false, false, false, false, false, false, oldValue, newValue);
                }
            }
            if (formFieldObject.formFieldAnnotationType !== 'SignatureField') {
                if ((options as PdfFormFieldBaseModel).alignment) {
                    if (formFieldObject.alignment !== (options as PdfFormFieldBaseModel).alignment) {
                        isAlignmentChanged = true;
                        oldValue = formFieldObject.alignment;
                        newValue = (options as PdfFormFieldBaseModel).alignment;
                    }
                    formFieldObject.alignment = (options as PdfFormFieldBaseModel).alignment;
                    htmlElement.style.textAlign = (options as PdfFormFieldBaseModel).alignment;
                    (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).alignment = (options as PdfFormFieldBaseModel).alignment;
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
                    (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).maxLength = (options as TextFieldSettings).maxLength;
                    if (isMaxLengthChanged) {
                        this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                              false, false, false, false, false, false, false, false,
                                                              isMaxLengthChanged, false, false, false, false, oldValue, newValue);
                    }
                }
            }
            if (formFieldObject.formFieldAnnotationType !== 'PasswordField') {
                if ((options as PdfFormFieldBaseModel).fontFamily) {
                    if (formFieldObject.fontFamily !== (options as PdfFormFieldBaseModel).fontFamily) {
                        isFontFamilyChanged = true;
                        oldValue = formFieldObject.fontFamily;
                        newValue = (options as PdfFormFieldBaseModel).fontFamily;
                    }
                    formFieldObject.fontFamily = (options as PdfFormFieldBaseModel).fontFamily;
                    htmlElement.style.fontFamily = (options as PdfFormFieldBaseModel).fontFamily;
                    (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).fontFamily = (options as PdfFormFieldBaseModel).fontFamily;
                    if (isFontFamilyChanged) {
                        this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, isFontFamilyChanged, false,
                                                              false, false, false, false, false, false, false, false, false,
                                                              false, false, false, false, oldValue, newValue);
                    }
                }
                let oldFontStyle: string = '';
                let newFontStyle: string = '';
                if (!isNullOrUndefined((options as PdfFormFieldBaseModel).fontStyle)) {
                    oldFontStyle += formFieldObject.font.isBold ? 'Bold' + ', ' : '';
                    oldFontStyle += formFieldObject.font.isItalic ? 'Italic' + ', ' : '';
                    oldFontStyle += formFieldObject.font.isStrikeout ? 'Strikethrough' + ', ' : '';
                    oldFontStyle += formFieldObject.font.isUnderline ? 'Underline' + ', ' : '';
                    if ((!isNullOrUndefined((options as PdfFormFieldBaseModel).fontStyle))
                        && ((options as FormFieldModel).fontStyle === FontStyle.None)) {
                        htmlElement.style.fontWeight = '';
                        htmlElement.style.fontStyle = '';
                        formFieldObject.fontStyle = '';
                        htmlElement.style.textDecoration = '';
                        formFieldObject.font.isBold = false;
                        formFieldObject.font.isItalic = false;
                        formFieldObject.font.isUnderline = false;
                        formFieldObject.font.isStrikeout = false;
                        this.setDropdownFontStyleValue(htmlElement, 'none', '');
                        (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isBold = false;
                        (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isItalic = false;
                        (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isUnderline = false;
                        (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isStrikeout = false;
                        newFontStyle = '';
                    }
                    else {
                        if ((((options as PdfFormFieldBaseModel).fontStyle as unknown as FontStyle) & FontStyle.Bold) !== 0) {
                            htmlElement.style.fontWeight = 'bold';
                            formFieldObject.fontStyle = 'Bold';
                            formFieldObject.font.isBold = true;
                            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isBold = true;
                            this.setDropdownFontStyleValue(htmlElement, 'bold', 'bold');
                        }
                        newFontStyle += formFieldObject.font.isBold ? 'Bold' + ', ' : '';
                        if ((((options as PdfFormFieldBaseModel).fontStyle as unknown as FontStyle) & FontStyle.Italic) !== 0) {
                            htmlElement.style.fontStyle = 'italic';
                            formFieldObject.fontStyle = 'Italic';
                            formFieldObject.font.isItalic = true;
                            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isItalic = true;
                        }
                        newFontStyle += formFieldObject.font.isItalic ? 'Italic' + ', ' : '';
                        if ((((options as PdfFormFieldBaseModel).fontStyle as unknown as FontStyle) & FontStyle.Strikethrough) !== 0) {
                            htmlElement.style.textDecoration = 'line-through';
                            formFieldObject.font.isStrikeout = true;
                            formFieldObject.fontStyle = 'Strikethrough';
                            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isStrikeout = true;
                        }
                        newFontStyle += formFieldObject.font.isStrikeout ? 'Strikethrough' + ', ' : '';
                        if ((((options as PdfFormFieldBaseModel).fontStyle as unknown as FontStyle) & FontStyle.Underline) !== 0) {
                            htmlElement.style.textDecoration = 'underline';
                            formFieldObject.fontStyle = 'Underline';
                            formFieldObject.font.isUnderline = true;
                            (this.pdfViewer.nameTable[formFieldObject.id.split('_')[0]] as PdfFormFieldBaseModel).font.isUnderline = true;
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
        if (!isNullOrUndefined((options as TextFieldSettings).isReadOnly)) {
            if (formFieldObject.isReadonly !== (options as TextFieldSettings).isReadOnly) {
                isReadOnlyChanged = true;
                oldValue = formFieldObject.isReadonly;
                newValue = (options as TextFieldSettings).isReadOnly;
                if (htmlElement.parentElement && (options as TextFieldSettings).isReadOnly === true) {
                    htmlElement.parentElement.style.backgroundColor = 'transparent';
                }
            }
            formFieldObject.isReadonly = (options as TextFieldSettings).isReadOnly;
            this.setReadOnlyProperty(formFieldObject, htmlElement);
            if (formFieldObject.formFieldAnnotationType === 'RadioButton') {
                htmlElement.parentElement.style.pointerEvents = (options as TextFieldSettings).isReadOnly ? 'none' : 'auto';
                const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
                const formFieldsData: any = JSON.parse(data);
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    if (formFieldsData[parseInt(i.toString(), 10)].FormField.id.split('_')[0] === formFieldObject.id) {
                        for (let j: number = 0; j < (formFieldsData[parseInt(i.toString(), 10)].FormField as
                        IFormField).radiobuttonItem.length; j++) {
                            const radiobuttonItem: IRadiobuttonItem = (formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField).
                                radiobuttonItem[parseInt(j.toString(), 10)];
                            const currentElement: Element = document.getElementById(radiobuttonItem.id + '_html_element').firstElementChild.firstElementChild.firstElementChild;
                            currentElement.parentElement.style.pointerEvents = (options as TextFieldSettings).isReadOnly ?  'none' : 'auto';
                            radiobuttonItem.isReadonly = formFieldObject.isReadonly;
                            (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).
                                radiobuttonItem[parseInt(j.toString(), 10)].isReadonly = formFieldObject.isReadonly;
                            this.setReadOnlyProperty(radiobuttonItem as IFormField, currentElement);
                            (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).
                                radiobuttonItem[parseInt(j.toString(), 10)].backgroundColor = typeof radiobuttonItem.backgroundColor
                                    !== 'object' ? this.getRgbCode(radiobuttonItem.backgroundColor) as unknown as RGBA :
                                    radiobuttonItem.backgroundColor;
                        }
                        (formFieldsData[parseInt(i.toString(), 10)].FormField  as IFormField).isReadonly = formFieldObject.isReadonly;
                        (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).isReadonly =
                         formFieldObject.isReadonly;
                    }
                }
            }
            else {
                htmlElement.style.pointerEvents = (options as TextFieldSettings).isReadOnly ? ((options as PdfFormFieldBaseModel).isMultiline ? 'auto' : 'none') : 'auto';
            }
            if (isReadOnlyChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', formFieldObject, false, false, false,
                                                      false, false, false, false, false, false, isReadOnlyChanged, false,
                                                      false, false, false, false, false, oldValue, newValue);
            }
        }
        if (formFieldObject.formFieldAnnotationType === 'BarcodeField') {
            this.applyBarcodeFieldSettings(formFieldObject, options as BarcodeFieldSettings, htmlElement);
        }
        if ((formFieldObject.formFieldAnnotationType === 'SignatureField' && (options as PdfFormFieldBaseModel).signatureIndicatorSettings) || (formFieldObject.formFieldAnnotationType === 'InitialField' && (options as InitialFieldSettings).initialIndicatorSettings)){
            formFieldObject = this.updateSignatureandInitialIndicator(formFieldObject, options as InitialFieldSettings, htmlElement);
        }
        this.updateSessionFormFieldProperties(formFieldObject);
        const formField: FormFieldModel = {
            id: formFieldObject.id, name: (formFieldObject as PdfFormFieldBaseModel).name,
            value: (formFieldObject as PdfFormFieldBaseModel).value,
            type: this.getPublicFormFieldType(formFieldObject.formFieldAnnotationType as string),
            isReadOnly: formFieldObject.isReadonly,
            fontFamily: formFieldObject.fontFamily,
            fontSize: formFieldObject.fontSize, fontStyle: formFieldObject.fontStyle as unknown as FontStyle,
            color: (formFieldObject as PdfFormFieldBaseModel).color,
            backgroundColor: (formFieldObject as PdfFormFieldBaseModel).backgroundColor as string,
            alignment: (formFieldObject as PdfFormFieldBaseModel).alignment as TextAlign,
            visibility: (formFieldObject as PdfFormFieldBaseModel).visibility,
            maxLength: (formFieldObject as PdfFormFieldBaseModel).maxLength,
            isRequired: (formFieldObject as PdfFormFieldBaseModel).isRequired,
            isPrint: formFieldObject.isPrint, tooltip: (formFieldObject as PdfFormFieldBaseModel).tooltip,
            bounds: formFieldObject.bounds as IFormFieldBound, thickness: formFieldObject.thickness,
            borderColor: (formFieldObject as PdfFormFieldBaseModel).borderColor as string, pageIndex: formFieldObject.pageIndex,
            insertSpaces: (formFieldObject as PdfFormFieldBaseModel).insertSpaces,
            isTransparent: (formFieldObject as PdfFormFieldBaseModel).isTransparent,
            options: (formFieldObject as PdfFormFieldBaseModel).options,
            pageNumber: (formFieldObject as PdfFormFieldBaseModel).pageNumber,
            rotateAngle: (formFieldObject as PdfFormFieldBaseModel).rotateAngle,
            selectedIndex: (formFieldObject as PdfFormFieldBaseModel).selectedIndex,
            signatureIndicatorSettings: (formFieldObject as PdfFormFieldBaseModel).signatureIndicatorSettings,
            signatureType: (formFieldObject as PdfFormFieldBaseModel).signatureType as unknown as SignatureType[],
            zIndex: (formFieldObject as PdfFormFieldBaseModel).zIndex,
            isChecked: (formFieldObject as PdfFormFieldBaseModel).isChecked,
            isMultiline: (formFieldObject as PdfFormFieldBaseModel).isMultiline,
            isSelected: (formFieldObject as PdfFormFieldBaseModel).isSelected,
            customData: (formFieldObject as PdfFormFieldBaseModel).customData
        };
        // Keep ButtonField GoTo AA on collection rebuild after property changes.
        this.applyButtonCollectionExtras(formField, formFieldObject as PdfFormFieldBaseModel);
        this.applyBarcodeCollectionExtras(formField, formFieldObject as PdfFormFieldBaseModel);
        let collectionsIdx: number = this.pdfViewer.formFieldCollections.findIndex((el: FormFieldModel) => el.id === formField.id);
        if (collectionsIdx < 0 && formField.id) {
            const formFieldPrefix: string = formField.id.split('_')[0];
            collectionsIdx = this.pdfViewer.formFieldCollections.findIndex((el: FormFieldModel) => el.id ===
            formFieldPrefix);
            if (collectionsIdx > -1) {
                formField.id = formFieldPrefix;
            }
        }
        if (collectionsIdx > -1) {
            this.pdfViewer.formFieldCollections[collectionsIdx as number] = formField;
        }
        let designerCollectionIdx: number = this.pdfViewer.formFieldCollection.
            findIndex(function (el: PdfFormFieldBaseModel): boolean { return el.id === formFieldObject.id; });
        if (designerCollectionIdx < 0 && formFieldObject.id) {
            const designerPrefix: string = formFieldObject.id.split('_')[0];
            designerCollectionIdx = this.pdfViewer.formFieldCollection.
                findIndex(function (el: PdfFormFieldBaseModel): boolean { return el.id === designerPrefix; });
        }
        if (designerCollectionIdx > -1) {
            this.pdfViewer.formFieldCollection[designerCollectionIdx as number] = formFieldObject;
        }
        const isActionsChanged: boolean = formFieldObject.formFieldAnnotationType === 'Button' &&
            !isNullOrUndefined((options as ButtonFieldSettings).actions);
        if (isValueChanged || isFontFamilyChanged || isFontSizeChanged || isFontStyleChanged || isColorChanged ||
            isBackgroundColorChanged || isBorderColorChanged || isBorderWidthChanged || isAlignmentChanged || isReadOnlyChanged
            || isVisibilityChanged || isRequiredChanged || isPrintChanged || isToolTipChanged || isCustomDataChanged ||
            isNameChanged || isMaxLengthChanged || isBoundsChanged || isActionsChanged) {
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
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections((formFieldId as { id: string }).id);
            if (formFieldCollectionObject)
            {formField = this.pdfViewer.nameTable[formFieldCollectionObject.id]; }
        }
        if (typeof formFieldId === 'string') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections(formFieldId);
            if (formFieldCollectionObject)
            {formField = this.pdfViewer.nameTable[formFieldCollectionObject.id]; }
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

    /**
     * Resets button designer field to default caption/style (I5). Clears AA actions.
     *
     * @param {PdfFormFieldBaseModel} obj - button form field node
     * @returns {void}
     */
    private resetButtonProperties(obj: PdfFormFieldBaseModel): void {
        const host: HTMLElement = document.getElementById(obj.id + '_content_html_element') ||
            document.getElementById(obj.id + '_html_element');
        const inputElement: HTMLElement = host &&
            (host.querySelector('input.e-pv-buttonItem, input[type="button"]') as HTMLElement);
        if (inputElement) {
            obj.name = 'buttonField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#daeaf7ff';
            obj.alignment = 'center';
            obj.visibility = 'visible';
            obj.isReadonly = false;
            obj.isRequired = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.borderColor = '#303030';
            obj.thickness = 1;
            obj.actions = undefined;
            this.updateTextboxProperties(obj, inputElement);
            const nameKey: string = obj.id ? obj.id.split('_')[0] : '';
            if (nameKey && this.pdfViewer.nameTable[nameKey as string]) {
                (this.pdfViewer.nameTable[nameKey as string] as PdfFormFieldBaseModel).actions = undefined;
            }
            const collectionIndex: number = this.pdfViewer.formFieldCollections.findIndex(
                (field: FormFieldModel) => field.id === nameKey || field.id === obj.id);
            if (collectionIndex > -1) {
                this.pdfViewer.formFieldCollections[collectionIndex as number].actions = undefined;
            }
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
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild;
        if (inputElement) {
            obj.name = 'signatureField';
            obj.value = '';
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#daeaf7ff';
            obj.borderColor = '#303030';
            obj.thickness = 1;
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
        if (this.pdfViewer.readOnlySettings.formFields) {
            return;
        }
        const formField: PdfFormFieldBaseModel = this.getFormField(formFieldId);
        if (isNullOrUndefined(formField) && formFieldId) {
            const data: string = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
            const FormfieldsData: any = JSON.parse(data);
            this.pdfViewer.formFieldCollection =
            this.pdfViewer.formFieldCollection.filter((field: PdfFormFieldBaseModel) => (formFieldId as { id: string }).id !== field.id);
            for (let i: number = 0; i < this.pdfViewer.formFieldCollections.length; i++) {
                if ((formFieldId as { id: string }).id === this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)].id) {
                    for (let j: number = 0; j < FormfieldsData.length; j++) {
                        if ((formFieldId as { name: string }).name === FormfieldsData[parseInt(j.toString(), 10)].FieldName) {
                            FormfieldsData.splice(j, 1);
                            const field: FormFieldModel = this.pdfViewer.formFieldCollections[parseInt(j.toString(), 10)];
                            this.pdfViewer.formFieldCollections.splice(i, 1);
                            const stringify: string = JSON.stringify(FormfieldsData);
                            this.pdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_formfields', stringify);
                            this.pdfViewer.fireFormFieldRemoveEvent('formFieldRemove', (field as unknown as IFormField), field.pageIndex);
                            if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                                // Fire formFieldChanged event for collaborative editing
                                this.pdfViewer.fireFormFieldChangedEvent(EditAction.Delete, field);
                            }
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
            if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
                // Fire formFieldChanged event for collaborative editing
                this.pdfViewer.fireFormFieldChangedEvent(EditAction.Delete, formField as unknown as FormFieldModel);
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
        let formFieldCollectionObject: PdfFormFieldBaseModel;
        if (typeof formFieldId === 'object') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections((formFieldId as { id: string }).id);
            formField = this.pdfViewer.nameTable[formFieldCollectionObject.id];
        }
        if (typeof formFieldId === 'string') {
            formFieldCollectionObject = this.getAnnotationsFromAnnotationCollections(formFieldId);
            formField = this.pdfViewer.nameTable[formFieldCollectionObject.id];
        }
        if (formField && (this.pdfViewer.selectedItems && !isNullOrUndefined((this.pdfViewer.selectedItems as
            SelectorModel & { properties: { formFields: PdfFormFieldBaseModel[] } }).properties.formFields)
            && (this.pdfViewer.selectedItems as
                SelectorModel & { properties: { formFields: PdfFormFieldBaseModel[] } }).properties.formFields.length > 0
            && (this.pdfViewer.selectedItems as
                SelectorModel & { properties: { formFields: PdfFormFieldBaseModel[] } }).properties.formFields[0].id === formField.id)) {
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
            if (!isNullOrUndefined(this.pdfViewer.toolbarModule)) {
                this.pdfViewer.toolbarModule.updateInteractionItems();
            }
        }
    }

    private enableDisableFormFieldsInteraction(enableDesignerMode: boolean): void {
        const collections: PdfFormFieldBaseModel[] = this.pdfViewer.formFieldCollection;
        if (collections && collections.length > 0) {
            for (let i: number = 0; i < collections.length; i++) {
                const element: HTMLElement = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element');
                const designerName: HTMLElement = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_designer_name');
                if (element) {
                    if (enableDesignerMode) {
                        this.pdfViewer.designerMode = true;
                        element.style.pointerEvents = 'none';
                        // Fields are movable in designer mode; reflect it on the cursor.
                        element.style.cursor = 'move';
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
                        case 'BarcodeField':
                        case 'RadioButton': {
                            const inputElement: Element = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild;
                            (inputElement as HTMLElement).style.pointerEvents = 'none';
                            break;
                        }
                        case 'Checkbox': {
                            const checkboxDivElement: Element = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
                            (checkboxDivElement as HTMLElement).style.pointerEvents = 'none';
                            break;
                        }
                        }
                    } else {
                        this.pdfViewer.designerMode = false;
                        element.style.pointerEvents = 'all';
                        // Fill mode: fields are interactive, not movable — clear the move cursor.
                        element.style.cursor = 'default';
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
                        case 'BarcodeField':
                        case 'RadioButton': {
                            const inputElement: Element = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild;
                            (inputElement as HTMLElement).style.pointerEvents = collections[parseInt(i.toString(), 10)].isReadonly ? (collections[parseInt(i.toString(), 10)].isMultiline ? 'auto' : 'none') : 'auto';
                            break;
                        }
                        case 'Checkbox': {
                            const checkboxDivElement: Element = document.getElementById(collections[parseInt(i.toString(), 10)].id + '_content_html_element').firstElementChild.firstElementChild.lastElementChild;
                            (checkboxDivElement as HTMLElement).style.pointerEvents = collections[parseInt(i.toString(), 10)].isReadonly ? (collections[parseInt(i.toString(), 10)].isMultiline ? 'auto' : 'none') : 'auto';
                            break;
                        }
                        }
                        this.pdfViewer.clearSelection(collections[parseInt(i.toString(), 10)].pageIndex);
                    }
                }
            }
        }
    }

    private getAnnotationsFromAnnotationCollections(annotationId: string): PdfFormFieldBaseModel | null {
        const collections: PdfFormFieldBaseModel[] = this.pdfViewer.formFieldCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[parseInt(i.toString(), 10)].id === annotationId) {
                    return collections[parseInt(i.toString(), 10)];
                }
            }
        }
        return null;
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
                (this.pdfViewer.nameTable[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id.split('_')[0]] as PdfFormFieldBaseModel).value = '';
                (this.pdfViewer.nameTable[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id] as PdfFormFieldBaseModel).value = '';
                this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.signatureType = '';
                (this.pdfViewer.nameTable[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id.split('_')[0]] as PdfFormFieldBaseModel).signatureType = '';
                (this.pdfViewer.nameTable[this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField.id] as PdfFormFieldBaseModel).signatureType = '';
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
        let  sessionformFields: PdfRenderedFields[];
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
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_shape');
        if (storeObject) {
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, this.pdfViewerBase.currentPageNumber - 1);
            if ( index != null && storeObject[parseInt(index.toString(), 10)]) {
                for (let m: number = 0; m < storeObject[parseInt(index.toString(), 10)].annotations.length; m++) {
                    if (annotationId === storeObject[parseInt(index.toString(), 10)].annotations[parseInt(m.toString(), 10)].id) {
                        storeObject[parseInt(index.toString(), 10)].annotations.splice(m, 1);
                        break;
                    }
                }
                this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_shape', storeObject);
            }
        }
        const collections: PdfFormFieldBaseModel[] = this.pdfViewer.formFieldCollection;
        if (collections && annotationId) {
            for (let i: number = 0; i < collections.length; i++) {
                if ((collections[parseInt(i.toString(), 10)] as { formFieldId?: string }).formFieldId === annotationId) {
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
            const lastFormField: FormFieldModel = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.length - 1];
            // eslint-disable-next-line
            const match: RegExpMatchArray | null = lastFormField && lastFormField.name ? lastFormField.name.match(/\d+/) : null;
            const lastFormFieldIndex: number | null = lastFormField && lastFormField.name ? (match && !isNaN(parseInt(match[0], 10))
                ? parseInt(match[0], 10)
                : this.pdfViewer.formFieldCollections.length) : null;
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
        const fieldIndex: number = this.setFormFieldIndex();
        const textboxModel: PdfFormFieldBaseModel = {
            formFieldAnnotationType: formFieldType,
            name: (this.isDateTimeToolPlacement ? 'DateTime' : 'Textbox') + fieldIndex, value: '', fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black',
            backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030', alignment: 'left', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', customData: '' as any, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        if (this.isDateTimeToolPlacement) {
            textboxModel.isDateField = true;
            textboxModel.isMultiline = false;
            textboxModel.actions = {
                format: { script: FormDesigner.defaultDateTimeFormatScript } as JavaScriptActionModel
            };
        } else {
            textboxModel.isDateField = false;
            textboxModel.actions = null;
        }
        (this.pdfViewer.drawingObject as PdfFormFieldBaseModel) = textboxModel;
        this.pdfViewer.tool = 'DrawTool';
    }

    /**
     * Arms the draw tool with a QR Code barcode field.
     * @param {FormFieldAnnotationType} formFieldType - The barcode annotation type.
     * @returns {void}
     */
    private activateBarcodeElement(formFieldType: FormFieldAnnotationType): void {
        const barcodeModel: PdfFormFieldBaseModel = {
            formFieldAnnotationType: formFieldType,
            name: 'Barcode' + this.setFormFieldIndex(), value: '', fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black',
            backgroundColor: '#ffffffff', thickness: 1, borderColor: '#303030', alignment: 'left', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', customData: '' as any, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        const barcodeSettings: BarcodeFieldSettingsModel = this.pdfViewer.barcodeFieldSettings;
        barcodeModel.symbology = barcodeSettings.symbology ? barcodeSettings.symbology : BarcodeSymbology.PDF417;
        barcodeModel.xDimension = !isNullOrUndefined(barcodeSettings.xDimension) ? barcodeSettings.xDimension : 4;
        barcodeModel.errorCorrectionLevel = barcodeSettings.errorCorrectionLevel ?
            barcodeSettings.errorCorrectionLevel : Pdf417ErrorCorrectionLevel.Level5;
        barcodeModel.valueFormat = barcodeSettings.valueFormat ? barcodeSettings.valueFormat : BarcodeValueFormat.TabDelimited;
        barcodeModel.includeFieldNames = !isNullOrUndefined(barcodeSettings.includeFieldNames) ?
            barcodeSettings.includeFieldNames : true;
        barcodeModel.fields = barcodeSettings.fields ? barcodeSettings.fields : [];
        barcodeModel.caption = barcodeSettings.caption ? barcodeSettings.caption :
            (this.pdfViewer && this.pdfViewer.fileName ? this.pdfViewer.fileName : '');
        barcodeModel.compressData = !isNullOrUndefined(barcodeSettings.compressData) ? barcodeSettings.compressData : false;
        barcodeModel.customValue = barcodeSettings.customValue ? barcodeSettings.customValue : '';
        if (!isNullOrUndefined(barcodeSettings.name) && barcodeSettings.name !== '') {
            barcodeModel.name = barcodeSettings.name;
        }
        if (!isNullOrUndefined(barcodeSettings.tooltip) && barcodeSettings.tooltip !== '') {
            barcodeModel.tooltip = barcodeSettings.tooltip;
        }
        (this.pdfViewer.drawingObject as PdfFormFieldBaseModel) = barcodeModel;
        this.pdfViewer.tool = 'DrawTool';
    }

    /**
     * Restores a barcode field to its default appearance and value.
     * @param {PdfFormFieldBaseModel} obj - The barcode field to reset.
     * @returns {void}
     */
    private resetBarcodeProperties(obj: PdfFormFieldBaseModel): void {
        const inputElement: Element = document.getElementById(obj.id + '_content_html_element').firstElementChild;
        if (inputElement) {
            obj.name = 'Barcode';
            obj.value = '';
            obj.symbology = BarcodeSymbology.PDF417;
            obj.fontFamily = 'Helvetica';
            obj.fontSize = 10;
            obj.fontStyle = 'None';
            obj.color = 'black';
            obj.backgroundColor = '#ffffffff';
            obj.borderColor = '#303030';
            obj.thickness = 1;
            obj.isRequired = false;
            obj.isReadonly = false;
            obj.tooltip = '';
            obj.isPrint = true;
            obj.visibility = 'visible';
            obj.xDimension = 4;
            obj.errorCorrectionLevel = Pdf417ErrorCorrectionLevel.Level5;
            obj.valueFormat = BarcodeValueFormat.TabDelimited;
            obj.includeFieldNames = true;
            obj.fields = [];
            obj.caption = '';
            obj.compressData = false;
            obj.customValue = '';
            this.updateBarcodeFieldProperties(obj, inputElement as HTMLElement);
        }
    }

    /**
     * Copies the property dialog values onto the selected barcode field.
     * @param {any} selectedItem - The selected form field node.
     * @param {boolean} isUndoRedo - is Undo or Redo.
     * @private
     * @returns {void}
     */
    public updateBarcodeFormDesignerProperties(selectedItem: any, isUndoRedo?: boolean): void {
        if (!isUndoRedo) {
            // Live dialog apply: read UI controls onto the model.
            selectedItem.name = this.formFieldName.value;
            selectedItem.tooltip = this.formFieldTooltip.value;
            selectedItem.symbology = this.barcodeSymbologyDropDown ? (this.barcodeSymbologyDropDown.value as string) : 'PDF417';
            selectedItem.caption = (this.barcodeCaptionTextBox && this.barcodeCaptionTextBox.value) || '';
            selectedItem.xDimension = (this.barcodeXDimensionInput && this.barcodeXDimensionInput.value) || 4;
            selectedItem.errorCorrectionLevel = (this.barcodeErrorCorrectionDropDown && this.barcodeErrorCorrectionDropDown.value as string) || selectedItem.errorCorrectionLevel || 'Level5';
            selectedItem.valueFormat = (this.barcodeValueFormatDropDown && this.barcodeValueFormatDropDown.value as string) || 'TabDelimited';
            selectedItem.includeFieldNames = this.barcodeIncludeFieldNamesCheck ?
                this.barcodeIncludeFieldNamesCheck.checked === true : true;
            selectedItem.compressData = this.barcodeCompressDataCheck ? this.barcodeCompressDataCheck.checked === true : false;
            selectedItem.customValue = (this.barcodeCustomValueTextBox && this.barcodeCustomValueTextBox.value) || '';
            const sourceFields: any = this.barcodeSourceFieldsMultiSelect && this.barcodeSourceFieldsMultiSelect.value;
            selectedItem.fields = (Array.isArray(sourceFields) ? sourceFields : []) as string[];
            if (selectedItem.valueFormat === 'CustomValue') {
                selectedItem.value = '';
            } else if (selectedItem.fields.length === 0) {
                selectedItem.value = selectedItem.value || '';
            } else {
                selectedItem.value = '';
            }
        }
        // Sync the (possibly mutated) model to the live nameTable, session storage, and formFieldCollection.
        const nameKey: string = selectedItem.id ? selectedItem.id.split('_')[0] : '';
        const index: number = nameKey ? this.getFormFiledIndex(nameKey) : -1;
        if (index > -1 && this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)] &&
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField) {
            const liveFF: any = this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField;
            liveFF.name = selectedItem.name;
            liveFF.tooltip = selectedItem.tooltip;
            liveFF.symbology = selectedItem.symbology;
            liveFF.xDimension = selectedItem.xDimension;
            liveFF.errorCorrectionLevel = selectedItem.errorCorrectionLevel;
            liveFF.valueFormat = selectedItem.valueFormat;
            liveFF.includeFieldNames = selectedItem.includeFieldNames;
            liveFF.fields = selectedItem.fields;
            liveFF.caption = selectedItem.caption;
            liveFF.compressData = selectedItem.compressData;
            liveFF.customValue = selectedItem.customValue;
            liveFF.value = selectedItem.value;
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
        }
        if (nameKey && this.pdfViewer.nameTable[nameKey as string]) {
            const live: any = this.pdfViewer.nameTable[nameKey as string];
            live.name = selectedItem.name;
            live.tooltip = selectedItem.tooltip;
            live.symbology = selectedItem.symbology;
            live.xDimension = selectedItem.xDimension;
            live.errorCorrectionLevel = selectedItem.errorCorrectionLevel;
            live.valueFormat = selectedItem.valueFormat;
            live.includeFieldNames = selectedItem.includeFieldNames;
            live.fields = selectedItem.fields;
            live.caption = selectedItem.caption;
            live.compressData = selectedItem.compressData;
            live.customValue = selectedItem.customValue;
            live.value = selectedItem.value;
        }
        const inputElement: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild as HTMLElement;
        if (inputElement) {
            this.updateBarcodeFieldProperties(selectedItem, inputElement);
        }
    }

    /**
     * Redraws the barcode field content from its current value.
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @param {HTMLElement} inputElement - The field content element.
     * @returns {void}
     */
    private updateBarcodeFieldProperties(obj: PdfFormFieldBaseModel, inputElement: HTMLElement): void {
        let bounds: { width: number, height: number };
        if (obj.bounds) {
            bounds = { width: obj.bounds.width, height: obj.bounds.height };
        } else {
            const fieldId: string = obj.id.replace('_content', '');
            const field: FormFieldModel = this.pdfViewer.formFieldCollections.find(
                (el: FormFieldModel): boolean => el.id === fieldId);
            if (field && field.bounds) {
                bounds = { width: (field.bounds as any).width, height: (field.bounds as any).height };
            } else {
                bounds = { width: 200, height: 80 };
            }
            obj.bounds = { width: bounds.width, height: bounds.height };
        }
        const glyphBounds: { width: number, height: number } =
            this.getZoomedBarcodeBounds(bounds, this.pdfViewerBase.getZoomFactor());
        const host: HTMLElement = (inputElement.querySelector('[data-barcode-wrapper]')) ? inputElement :
            ((inputElement.parentElement && inputElement.parentElement.classList.contains('foreign-object')) ?
                inputElement.parentElement : inputElement);
        const previous: any = (host as any).__barcodeGenerator;
        if (previous) {
            try { previous.destroy(); } catch (e) { /* ignore */ }
            (host as any).__barcodeGenerator = null;
            (host as any).__barcodeSymbology = null;
        }
        const valueFormat: string = (obj.valueFormat as string) || 'TabDelimited';
        const resolvedFromValue: string | null = this.resolveBarcodeValue(obj);
        const resolved: string = (resolvedFromValue === null || resolvedFromValue === undefined) ? '' : resolvedFromValue;
        const symbology: string = (obj.symbology as string) || 'PDF417';
        const wrapper: HTMLElement = renderBarcodeField(resolved, glyphBounds, {
            symbology: symbology,
            errorCorrection: obj.errorCorrectionLevel as string
        });
        wrapper.style.position = 'absolute';
        const existingWrapper: HTMLElement = host.querySelector('[data-barcode-wrapper]') as HTMLElement;
        if (existingWrapper) {
            existingWrapper.replaceWith(wrapper);
        } else {
            host.appendChild(wrapper);
        }
        mountBarcodeGenerator(wrapper, resolved, glyphBounds, {
            symbology: symbology,
            errorCorrection: obj.errorCorrectionLevel as string,
            caption: obj.caption,
            xDimension: obj.xDimension,
            compressData: obj.compressData === true
        });
        const designerNameId: string = obj.id.split('_')[0] + '_designer_name';
        const divElement: HTMLElement = (host.querySelector('#' + designerNameId) as HTMLElement) ||
            ((host.parentElement && host.parentElement.querySelector('#' + designerNameId)) as HTMLElement);
        if (divElement) {
            divElement.style.fontSize = this.defaultFontSize + 'px';
            if (this.pdfViewer.designerMode) {
                divElement.innerHTML = obj.name;
                divElement.style.position = 'absolute';
            } else {
                divElement.innerHTML = '';
                divElement.style.position = 'initial';
            }
        } else {
            const newDivElement: HTMLElement = document.createElement('div');
            newDivElement.id = designerNameId;
            newDivElement.style.fontSize = this.defaultFontSize + 'px';
            newDivElement.className = 'e-pv-show-designer-name';
            if (this.pdfViewer.designerMode) {
                newDivElement.innerHTML = obj.name;
                newDivElement.style.position = 'absolute';
            } else {
                newDivElement.innerHTML = '';
                newDivElement.style.position = 'initial';
            }
            host.appendChild(newDivElement);
        }
        if (!this.isDrawHelper && !isNullOrUndefined(obj.tooltip) && obj.tooltip !== '') {
            this.setToolTip(obj.tooltip, wrapper);
        }
        const inner: any = (wrapper as any).__barcodeGenerator;
        if (inner) {
            (host as any).__barcodeGenerator = inner;
            (host as any).__barcodeSymbology = (wrapper as any).__barcodeSymbology;
        }
        void valueFormat;
    }

    /**
     * Resolves the live value to encode for a barcode field.
     * `CustomValue` returns `customValue`. `TabDelimited` and `Xml` build the
     * payload from the named `fields` against the current form-field values.
     * Returns the resolved string, or `null` when nothing should be rendered.
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @returns {string | null} The resolved payload, or null when no payload is available.
     */
    private resolveBarcodeValue(obj: PdfFormFieldBaseModel): string | null {
        const valueFormat: string = obj.valueFormat || 'TabDelimited';
        if (valueFormat === 'CustomValue') {
            return obj.customValue as string;
        }
        if (!Array.isArray(obj.fields) || obj.fields.length === 0) {
            return obj.value as string;
        }
        const includeNames: boolean = obj.includeFieldNames !== false;
        const names: string[] = [];
        const values: string[] = [];
        for (let i: number = 0; i < obj.fields.length; i++) {
            const name: string = obj.fields[parseInt(i.toString(), 10)];
            if (!name) { continue; }
            if (includeNames) { names.push(name); }
            values.push(this.getLinkedFormFieldValue(name));
        }
        if (valueFormat === 'Xml') {
            return this.buildBarcodeXmlPayload(obj, names, values, includeNames);
        }
        if (values.length === 0 || values.every((s: string) => s === '')) {
            return includeNames ? names.join('\t') : '';
        }
        return this.buildBarcodeTabPayload(names, values, includeNames);
    }

    /**
     * Resolves the current value of a linked form field by name.
     * The primary source is `formFieldCollections`; during undo/redo that
     * collection may not be re-synced yet, so `formFieldCollection` and
     * `nameTable` are used as fallbacks so the fresh value wins.
     * @param {string} name - The linked form field name.
     * @returns {string} The resolved value ('' when the field is unknown).
     */
    private getLinkedFormFieldValue(name: string): string {
        let field: any = Object.keys(this.pdfViewer.nameTable || {})
            .map((key: string) => this.pdfViewer.nameTable[key as string])
            .find((x: any) => x && x.name === name);
        if (!field) {
            field = ((this.pdfViewerBase.formFieldCollection || [])
                .map((x: IFormFieldCollection) => x && x.FormField)
                .find((x: any) => x && x.name === name));
        }
        if (!field) {
            field = (this.pdfViewer.formFieldCollections || []).find(
                (x: FormFieldModel) => x.name === name);
        }
        if (!field) { return ''; }
        return this.getFormFieldValue(field);
    }

    /**
     * Resolves the live value of a single form field model.
     * @param {any} field - The form field model.
     * @returns {string} The resolved value.
     */
    private getFormFieldValue(field: any): string {
        const fieldType: string = field.type || field.formFieldAnnotationType;
        if (fieldType === 'CheckBox' || fieldType === 'Checkbox') {
            return field.isChecked ? (field.value || 'Yes') : 'No';
        }
        if (fieldType === 'RadioButton') {
            return this.getRadioButtonGroupValue(field.name);
        }
        if (fieldType === 'DropDown' || fieldType === 'DropdownList' || fieldType === 'ListBox') {
            return this.getSelectedOptionValues(field);
        }
        if (field.value !== undefined && field.value !== null) {
            return String(field.value);
        }
        return '';
    }

    /**
     * Resolves the selected value of a radio button group. When no kid of the
     * group is selected the export value is `Off`.
     * @param {string} groupName - The shared radio button name.
     * @returns {string} The selected export value, or `Off`.
     */
    private getRadioButtonGroupValue(groupName: string): string {
        if (!groupName) { return 'Off'; }
        let selected: any = Object.keys(this.pdfViewer.nameTable || {})
            .map((key: string) => this.pdfViewer.nameTable[key as string])
            .filter((x: any) => x && x.formFieldAnnotationType === 'RadioButton' && x.name === groupName)
            .find((x: any): boolean => Boolean(x.isSelected && x.value));
        if (!selected) {
            selected = (this.pdfViewer.formFieldCollections || []).filter(
                (x: FormFieldModel) => x.type === 'RadioButton' && x.name === groupName).find(
                (x: FormFieldModel): boolean => Boolean(x.isSelected && x.value));
        }
        if (!selected) {
            selected = ((this.pdfViewerBase.formFieldCollection || [])
                .map((x: IFormFieldCollection) => x && x.FormField)
                .filter((x: any) => x && x.type === 'RadioButton' && x.name === groupName)
                .find((x: any): boolean => Boolean(x.isSelected && x.value)));
        }
        return selected ? String(selected.value) : 'Off';
    }

    /**
     * Resolves the exported values of the selected items of a DropDown/ListBox field.
     * @param {any} field - The DropDown or ListBox form field model.
     * @returns {string} The comma-joined selected item values.
     */
    private getSelectedOptionValues(field: any): string {
        const indices: number[] = field.selectedIndex || [];
        const items: ItemModel[] = field.options || [];
        const labels: string[] = [];
        for (let j: number = 0; j < indices.length; j++) {
            const item: ItemModel = items[parseInt(indices[parseInt(j.toString(), 10)].toString(), 10)];
            if (item && !isNullOrUndefined(item.itemValue)) {
                labels.push(item.itemValue);
            }
        }
        return labels.join(',');
    }

    /**
     * Builds the XFDF payload for `Xml` value formats.
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @param {string[]} names - The linked field names.
     * @param {string[]} values - The linked field values.
     * @param {boolean} includeNames - Whether field names are part of the payload.
     * @returns {string} The XFDF payload.
     */
    private buildBarcodeXmlPayload(obj: PdfFormFieldBaseModel, names: string[], values: string[],
                                   includeNames: boolean): string {
        let xml: string =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">\n' +
            '<f href="' + this.escapeXml(obj.caption || '') + '"/>\n' +
            '<fields>\n';
        if (values.length === 0 || values.every((s: string) => s === '')) {
            names.forEach((name: string) => {
                xml += '<field name="' + this.escapeXml(name) +
                    '"><value></value></field>\n';
            });
        } else {
            values.forEach((value: string, index: number) => {
                const fieldName: string = includeNames
                    ? names[index as number]
                    : ('Field' + (index + 1));
                xml += '<field name="' + this.escapeXml(fieldName) +
                    '"><value>' + this.escapeXml(value) + '</value></field>\n';
            });
        }
        return xml + '</fields>\n</xfdf>\n';
    }

    /**
     * Builds the tab-delimited payload for `TabDelimited` value formats.
     * @param {string[]} names - The linked field names.
     * @param {string[]} values - The linked field values.
     * @param {boolean} includeNames - Whether field names are part of the payload.
     * @returns {string} The tab-delimited payload.
     */
    private buildBarcodeTabPayload(names: string[], values: string[], includeNames: boolean): string {
        const row: string = values.join('\t');
        return includeNames ? names.join('\t') + '\r' + row : row;
    }

    private escapeXml(value: string): string {
        return value.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }


    /**
     * Refreshes the visible barcode glyph for a single barcode field in place.
     * When the symbology changes the old generator is destroyed and a fresh
     * one is appended; otherwise the existing generator is mutated so the
     * new value / colors / EC level take effect without recreating the host.
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @param {HTMLElement} [host] - Optional explicit host element. When omitted,
     *     the function looks up the field's `_content_html_element`.
     * @returns {void}
     */
    private refreshBarcodeGlyph(obj: PdfFormFieldBaseModel, host?: HTMLElement): void {
        if (!obj || obj.formFieldAnnotationType !== 'BarcodeField') { return; }
        const inputElement: HTMLElement = host || this.getBarcodeGlyphHost(obj);
        if (!inputElement) { return; }
        this.updateBarcodeFieldProperties(obj, inputElement);
        if (this.hasValidBarcodeGlyph(inputElement)) {
            this.barcodeLastRenderableState = this.captureBarcodeState(obj);
        }
    }

    /**
     * Resolves the element that hosts the barcode glyph for a field. Committed
     * fields keep their glyph in `<id>_content_html_element`.
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @returns {HTMLElement} The glyph host element, or null.
     */
    private getBarcodeGlyphHost(obj: PdfFormFieldBaseModel): HTMLElement {
        const elementId: string = obj.id.includes('_') ? obj.id : `${obj.id}_content`;
        return document.getElementById(elementId + '_html_element') as HTMLElement;
    }

    private getBarcodeResizeStartBounds(): { x: number, y: number, width: number, height: number } {
        return this.barcodeResizeStartState && this.barcodeResizeStartState.bounds
            ? this.barcodeResizeStartState.bounds : null;
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - The resized barcode form field.
     * @returns {void}
     * @private
     */
    public revertBarcodeResizeIfReduced(obj: PdfFormFieldBaseModel): void {
        if (!obj || obj.formFieldAnnotationType !== 'BarcodeField') { return; }
        const startBounds: { x: number, y: number, width: number, height: number } = this.getBarcodeResizeStartBounds();
        const isBoundsReduced: boolean = !!(startBounds && obj.bounds &&
            (obj.bounds.width < startBounds.width || obj.bounds.height < startBounds.height));
        if (isBoundsReduced && !this.isBarcodeRenderableAtBounds(obj)) {
            this.revertBarcodeResize(obj);
        }
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @returns {void}
     * @private
     */
    public revertBarcodeResize(obj: PdfFormFieldBaseModel): void {
        if (!obj) { return; }
        const fieldId: string = obj.id.split('_')[0];
        const startState: IBarcodeResizeState = this.barcodeResizeStartState;
        const lastState: IBarcodeResizeState = this.barcodeLastRenderableState;
        let snapshot: IBarcodeResizeState = null;
        if (startState && startState.fieldId === fieldId) {
            snapshot = startState;
        } else if (lastState && lastState.fieldId === fieldId) {
            snapshot = lastState;
        }
        this.barcodeResizeStartState = null;
        this.barcodeLastRenderableState = null;
        if (!snapshot) { return; }
        this.revertBarcodeToSnapshot(obj, snapshot);
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @returns {void}
     * @private
     */
    public beginBarcodeResizeTracking(obj: PdfFormFieldBaseModel): void {
        if (!obj || obj.formFieldAnnotationType !== 'BarcodeField') { return; }
        this.barcodeResizeStartState = this.captureBarcodeState(obj);
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @returns {IBarcodeResizeState} The captured bounds and glyph markup.
     */
    private captureBarcodeState(obj: PdfFormFieldBaseModel): IBarcodeResizeState {
        const child: DrawingElement = obj.wrapper && obj.wrapper.children ? obj.wrapper.children[0] : null;
        const elementId: string = obj.id.includes('_') ? obj.id : `${obj.id}_content`;
        const htmlElement: HTMLElement = document.getElementById(elementId + '_html_element') as HTMLElement;
        const glyphHost: HTMLElement = htmlElement ?
            (htmlElement.querySelector('[data-barcode-wrapper]') as HTMLElement) : null;
        return {
            fieldId: obj.id.split('_')[0],
            bounds: obj.bounds ? { x: obj.bounds.x, y: obj.bounds.y, width: obj.bounds.width, height: obj.bounds.height } : null,
            wrapperBounds: obj.wrapper && obj.wrapper.bounds ?
                new Rect(obj.wrapper.bounds.x, obj.wrapper.bounds.y,
                         obj.wrapper.bounds.width, obj.wrapper.bounds.height) : null,
            wrapperOffset: obj.wrapper ?
                { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY } : null,
            actualSize: child && child.actualSize ?
                { width: child.actualSize.width, height: child.actualSize.height } : null,
            offset: child ? { x: child.offsetX, y: child.offsetY } : null,
            glyphHTML: glyphHost ? glyphHost.innerHTML : ''
        };
    }

    /**
     * @param {HTMLElement} htmlElement - The field's html element wrapper.
     * @returns {boolean} True when a valid barcode SVG is present.
     */
    private hasValidBarcodeGlyph(htmlElement: HTMLElement): boolean {
        if (!htmlElement) { return false; }
        const svg: SVGElement = htmlElement.querySelector('svg') as SVGElement;
        return !isNullOrUndefined(svg) && svg.clientWidth > 60 && svg.clientHeight > 60 && svg.childNodes.length > 0;
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @param {IBarcodeResizeState} snapshot - The state captured before the resize refresh.
     * @returns {void}
     * @private
     */
    private revertBarcodeToSnapshot(obj: PdfFormFieldBaseModel, snapshot: IBarcodeResizeState): void {
        if (!obj || !snapshot) { return; }
        if (snapshot.bounds) {
            obj.bounds = { x: snapshot.bounds.x, y: snapshot.bounds.y,
                width: snapshot.bounds.width, height: snapshot.bounds.height };
        }
        const child: DrawingElement = obj.wrapper && obj.wrapper.children ? obj.wrapper.children[0] : null;
        if (snapshot.wrapperBounds && obj.wrapper) {
            obj.wrapper.bounds = snapshot.wrapperBounds;
            obj.wrapper.offsetX = snapshot.wrapperOffset.x;
            obj.wrapper.offsetY = snapshot.wrapperOffset.y;
            if (obj.wrapper.actualSize) {
                obj.wrapper.actualSize.width = snapshot.wrapperBounds.width;
                obj.wrapper.actualSize.height = snapshot.wrapperBounds.height;
            }
        }
        const baseField: PdfFormFieldBaseModel = this.pdfViewer.nameTable[obj.id.split('_')[0]] as PdfFormFieldBaseModel;
        if (baseField && baseField !== obj && snapshot.bounds) {
            baseField.bounds = { x: snapshot.bounds.x, y: snapshot.bounds.y,
                width: snapshot.bounds.width, height: snapshot.bounds.height };
        }
        if (snapshot.actualSize && child && child.actualSize) {
            child.actualSize.width = snapshot.actualSize.width;
            child.actualSize.height = snapshot.actualSize.height;
        }
        if (snapshot.offset && child) {
            child.offsetX = snapshot.offset.x;
            child.offsetY = snapshot.offset.y;
        }
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        if (snapshot.actualSize && child) {
            const elementId: string = obj.id.includes('_') ? obj.id : `${obj.id}_content`;
            const htmlElement: HTMLElement = document.getElementById(elementId + '_html_element') as HTMLElement;
            if (htmlElement) {
                const point: PointModel = cornersPointsBeforeRotation(child).topLeft;
                htmlElement.style.cssText = `height: ${snapshot.actualSize.height * zoomValue}px;
                    width: ${snapshot.actualSize.width * zoomValue}px;left: ${point.x * zoomValue}px;top: ${point.y * zoomValue}px;
                    position: absolute;transform: rotate(${child.rotateAngle + child.parentTransform}deg);
                    pointer-events: ${this.pdfViewer.designerMode ? 'none' : 'all'};visibility: ${child.visible ? 'visible' : 'hidden'};
                    opacity: ${child.style.opacity};`;
                const glyphHost: HTMLElement =
                    htmlElement.querySelector('[data-barcode-wrapper]') as HTMLElement;
                if (glyphHost && snapshot.glyphHTML) {
                    glyphHost.innerHTML = snapshot.glyphHTML;
                }
            }
        }
        this.pdfViewer.drawing.nodePropertyChange(obj, {
            bounds: {
                x: snapshot.wrapperOffset ? snapshot.wrapperOffset.x : obj.wrapper.offsetX,
                y: snapshot.wrapperOffset ? snapshot.wrapperOffset.y : obj.wrapper.offsetY,
                width: snapshot.bounds ? snapshot.bounds.width : obj.bounds.width,
                height: snapshot.bounds ? snapshot.bounds.height : obj.bounds.height
            }
        });
    }

    private getBarcodeBounds(obj: PdfFormFieldBaseModel): { width: number, height: number } {
        const fallback: { width: number, height: number } = { width: 200, height: 80 };
        const base: { width: number, height: number } = obj.bounds ?
            { width: obj.bounds.width, height: obj.bounds.height } : fallback;
        return this.getZoomedBarcodeBounds(base, this.pdfViewerBase.getZoomFactor());
    }

    /**
     * @param {PdfFormFieldBaseModel} obj - The barcode field.
     * @returns {boolean} True when the barcode renders at the current bounds.
     * @private
     */
    public isBarcodeRenderableAtBounds(obj: PdfFormFieldBaseModel): boolean {
        if (!obj || obj.formFieldAnnotationType !== 'BarcodeField') { return true; }
        const resolvedFromValue: string | null = this.resolveBarcodeValue(obj);
        const resolved: string = (resolvedFromValue === null || resolvedFromValue === undefined) ? '' : resolvedFromValue;
        const base: { width: number, height: number } = obj.bounds ?
            { width: obj.bounds.width, height: obj.bounds.height } : { width: 200, height: 80 };
        return isBarcodeRenderableAt(resolved, base, {
            symbology: (obj.symbology as string) || 'PDF417',
            errorCorrection: obj.errorCorrectionLevel as string,
            caption: obj.caption,
            xDimension: obj.xDimension,
            compressData: obj.compressData === true
        });
    }

    private getZoomedBarcodeBounds(bounds: { width: number, height: number },
                                   zoomValue: number): { width: number, height: number } {
        return {
            width: bounds.width * zoomValue,
            height: bounds.height * zoomValue
        };
    }

    /**
     * Walks the document for any BarcodeField that links to `fieldName` and
     * refreshes its glyph. Called whenever a form field's value changes so
     * the encoded payload stays in sync with the underlying field values.
     * @param {string} fieldName - The name of the form field that just changed.
     * @returns {void}
     * @private
     */
    public refreshBarcodeGlyphsForLinkedField(fieldName: string): void {
        if (!fieldName || !this.pdfViewerBase) { return; }
        const barcodeFields: PdfFormFieldBaseModel[] = this.getBarcodeFieldsLinkedTo(fieldName);
        for (let i: number = 0; i < barcodeFields.length; i++) {
            this.refreshBarcodeGlyph(barcodeFields[parseInt(i.toString(), 10)]);
        }
    }

    /**
     * Collects every BarcodeField whose linked `fields` list contains `fieldName`.
     * Lookup uses the same resolution order as the value binding
     * (`formFieldCollection`, then `nameTable`) so undo/redo and programmatic
     * updates resolve the same field object the value was written to.
     * `CustomValue` barcodes never depend on other fields and are skipped.
     * @param {string} fieldName - The name of the form field that just changed.
     * @returns {PdfFormFieldBaseModel[]} The barcode fields to refresh.
     */
    private getBarcodeFieldsLinkedTo(fieldName: string): PdfFormFieldBaseModel[] {
        const barcodeFields: PdfFormFieldBaseModel[] = [];
        const seen: { [key: string]: boolean } = {};
        const addIfLinked: (ff: PdfFormFieldBaseModel) => void = (ff: PdfFormFieldBaseModel): void => {
            if (!ff || ff.formFieldAnnotationType !== 'BarcodeField') { return; }
            if (ff.valueFormat === 'CustomValue') { return; }
            if (!Array.isArray(ff.fields) || ff.fields.indexOf(fieldName) === -1) { return; }
            if (seen[ff.name]) { return; }
            seen[ff.name] = true;
            barcodeFields.push(ff);
        };
        const collection: IFormFieldCollection[] = this.pdfViewerBase.formFieldCollection || [];
        for (let i: number = 0; i < collection.length; i++) {
            const ff: PdfFormFieldBaseModel = collection[parseInt(i.toString(), 10)] &&
                collection[parseInt(i.toString(), 10)].FormField as PdfFormFieldBaseModel;
            addIfLinked(ff);
        }
        const nameTable: Record<string, PdfAnnotationBaseModel | PdfFormFieldBaseModel> = this.pdfViewer.nameTable || {};
        const keys: string[] = Object.keys(nameTable);
        for (let i: number = 0; i < keys.length; i++) {
            addIfLinked(nameTable[keys[parseInt(i.toString(), 10)]] as PdfFormFieldBaseModel);
        }
        return barcodeFields;
    }

    private activatePasswordField(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as PdfFormFieldBaseModel) = {
            formFieldAnnotationType: formFieldType,
            name: 'Password' + this.setFormFieldIndex(), value: '', fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black',
            alignment: 'left', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        };
        this.pdfViewer.drawingObject.customData = '' as unknown as object;
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateCheckboxElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as PdfFormFieldBaseModel) = {
            formFieldAnnotationType: formFieldType,
            name: 'Check Box' + this.setFormFieldIndex(), isChecked: false, fontSize: this.defaultFontSize, backgroundColor: '#daeaf7ff', color: 'black', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: 'visible', isPrint: true, rotateAngle: 0, tooltip: ''
        };
        this.pdfViewer.drawingObject.customData = '' as unknown as object;
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateRadioButtonElement(formFieldType: FormFieldAnnotationType): void {
        (this.pdfViewer.drawingObject as PdfFormFieldBaseModel) = {
            formFieldAnnotationType: formFieldType,
            name: 'Radio Button' + this.setFormFieldIndex(), isSelected: false, fontSize: this.defaultFontSize, backgroundColor: '#daeaf7ff', color: 'black', thickness: 1, borderColor: '#303030', isReadonly: false, visibility: 'visible', isPrint: true, rotateAngle: 0, tooltip: ''
        };
        this.pdfViewer.drawingObject.customData = '' as unknown as object;
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateDropDownListElement(formFieldType: FormFieldAnnotationType, dropDownOptions: Item[]): void {
        (this.pdfViewer.drawingObject as PdfAnnotationBaseModel) = {
            formFieldAnnotationType: formFieldType,
            name: 'Dropdown' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030',
            alignment: 'left', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '',
            options: dropDownOptions, isMultiSelect: false, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        } as PdfAnnotationBaseModel & PdfFormFieldBaseModel;
        this.pdfViewer.drawingObject.customData = '' as unknown as object;
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateListboxElement(formFieldType: FormFieldAnnotationType, listBoxOptions: Item[]): void {
        this.pdfViewer.drawingObject = {
            formFieldAnnotationType: formFieldType,
            name: 'List Box' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', thickness: 1, borderColor: '#303030',
            alignment: 'left', isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '',
            options: listBoxOptions, isMultiSelect: true, font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        } as PdfAnnotationBaseModel & PdfFormFieldBaseModel;
        this.pdfViewer.drawingObject.customData = '' as unknown as object;
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateButtonElement(formFieldType: FormFieldAnnotationType): void {
        this.pdfViewer.drawingObject = {
            formFieldAnnotationType: formFieldType,
            name: 'Button' + this.setFormFieldIndex(),
            value: 'Button',
            fontFamily: 'Helvetica',
            fontSize: this.defaultFontSize,
            fontStyle: 'None',
            color: 'black',
            backgroundColor: '#daeaf7ff',
            thickness: 1,
            borderColor: '#303030',
            alignment: 'center',
            isReadonly: false,
            visibility: 'visible',
            isRequired: false,
            isPrint: true,
            rotateAngle: 0,
            tooltip: '',
            font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false }
        } as PdfAnnotationBaseModel & PdfFormFieldBaseModel;
        const buttonDrawingObject: PdfFormFieldBaseModel = this.pdfViewer.drawingObject as PdfFormFieldBaseModel;
        buttonDrawingObject.actions = undefined;
        this.pdfViewer.drawingObject.customData =  '' as unknown as object;
        this.pdfViewer.tool = 'DrawTool';
    }

    private activateSignatureBoxElement(formFieldType: FormFieldAnnotationType): void {
        let propertyValues: SignatureIndicatorSettingsModel = { opacity: 1, backgroundColor: 'rgba(255, 228, 133, 0.35)', width: 19, height: 10, fontSize: this.defaultFontSize, text: null, color: 'black' };
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
        this.pdfViewer.drawingObject = {
            formFieldAnnotationType: formFieldType,
            name: formFieldType === 'InitialField' || this.pdfViewer.isInitialFieldToolbarSelection ? 'Initial' + this.setFormFieldIndex() : 'Signature' + this.setFormFieldIndex(), fontFamily: 'Helvetica', fontSize: this.defaultFontSize, fontStyle: 'None', color: 'black', backgroundColor: '#daeaf7ff', alignment: 'left',
            isReadonly: false, visibility: 'visible', isRequired: false, isPrint: true, rotateAngle: 0, tooltip: '', font: { isItalic: false, isBold: false, isStrikeout: false, isUnderline: false },
            isInitialField: formFieldType === 'InitialField' || this.pdfViewer.isInitialFieldToolbarSelection , signatureIndicatorSettings: { opacity: propertyValues.opacity, backgroundColor: propertyValues.backgroundColor , width: propertyValues.width, height: propertyValues.height, fontSize: propertyValues.fontSize, text: propertyValues.text, color: propertyValues.color }
        } as PdfAnnotationBaseModel & PdfFormFieldBaseModel;
        this.pdfViewer.drawingObject.customData = '' as unknown as object;
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
        // When called with composite wrapper, style chrome on wrapper and text child.
        const isComposite: boolean = !!(inputElement && inputElement.classList &&
            inputElement.classList.contains('e-pv-datetime-composite'));
        const compositeWrapper: HTMLElement = isComposite ? inputElement : null;
        const textTarget: HTMLElement = isComposite
            ? ((inputElement.querySelector('.e-pv-formfield-input') as HTMLElement) || inputElement)
            : inputElement;
        const chromeTarget: HTMLElement = compositeWrapper || textTarget;
        (textTarget as IFormFieldProperty).name = obj.name ? obj.name : 'Textbox' + this.setFormFieldIndex();
        (textTarget as IFormFieldProperty).value = obj.value ? obj.value : '';
        this.applyProgrammaticAfValue(textTarget as HTMLElement, obj);
        const zoomValue: number = isPrint ? this.defaultZoomValue : this.pdfViewerBase.getZoomFactor();
        if (obj.insertSpaces){
            const font: number = ((obj.bounds.width * zoomValue / obj.maxLength) - (obj.fontSize * zoomValue / 2)) - (0.6 * zoomValue);
            textTarget.style.letterSpacing = '' + font + 'px';
            textTarget.style.fontFamily = 'monospace';
            textTarget.style.paddingLeft = (font / 2) + 'px';
        }else{
            textTarget.style.fontFamily = obj.fontFamily ? obj.fontFamily : 'Helvetica';
        }
        textTarget.style.fontSize = obj.fontSize ? (obj.fontSize * zoomValue) + 'px' : (10 * zoomValue) + 'px';
        if (isComposite) {
            const fieldHeightPx: number = obj.bounds && obj.bounds.height ? obj.bounds.height * zoomValue : 0;
            const textFontPx: number = parseFloat(textTarget.style.fontSize) || 0;
            this.pdfViewerBase.scaleDateTimePickerIcon(chromeTarget, fieldHeightPx > 0 ? fieldHeightPx : textFontPx);
        }
        if (obj.font.isBold) {
            textTarget.style.fontWeight = 'bold';
        }
        if (obj.font.isItalic) {
            textTarget.style.fontStyle = 'italic';
        }
        if (obj.font.isUnderline && obj.font.isStrikeout) {
            textTarget.style.textDecoration = 'underline line-through';
        }
        else if (obj.font.isStrikeout) {
            textTarget.style.textDecoration = 'line-through';
        }
        else if (obj.font.isUnderline) {
            textTarget.style.textDecoration = 'underline';
        }
        if (obj.isTransparent && obj.borderColor === '#ffffffff') {
            chromeTarget.style.backgroundColor = 'transparent';
            chromeTarget.style.borderColor = 'transparent';
        }
        else {
            chromeTarget.style.backgroundColor = obj.backgroundColor as string ? obj.backgroundColor as string : '#daeaf7ff';
            chromeTarget.style.borderColor = obj.borderColor as string ? obj.borderColor as string : '#303030';
        }
        textTarget.style.color = obj.color ? obj.color : 'black';
        chromeTarget.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (isComposite) {
            chromeTarget.style.borderStyle = 'solid';
            chromeTarget.style.boxSizing = 'border-box';
            // Single outer chrome: text input has no own border.
            textTarget.style.border = 'none';
            textTarget.style.borderWidth = '0';
            textTarget.style.backgroundColor = 'transparent';
            textTarget.style.outline = 'none';
            textTarget.style.boxShadow = 'none';
            const pickerBtn: HTMLElement = chromeTarget.querySelector('.e-pv-datetime-picker-btn') as HTMLElement;
            if (pickerBtn) {
                pickerBtn.style.borderLeftColor = obj.borderColor ? obj.borderColor as string : '#303030';
                pickerBtn.style.pointerEvents = obj.isReadonly ? 'none' : 'auto';
                pickerBtn.tabIndex = obj.isReadonly ? -1 : 0;
                // R2-FIX-09: re-assert 100% height so the button tracks the wrapper after resize.
                pickerBtn.style.height = '100%';
            }
        }
        textTarget.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        textTarget.style.direction = this.pdfViewer.enableRtl ? 'rtl' : '';
        chromeTarget.style.visibility = obj.visibility ? obj.visibility : 'visible';
        textTarget.style.pointerEvents = obj.isReadonly ? (obj.isMultiline ? 'default' : 'none') : 'default';
        textTarget.style.resize = obj.isMultiline && !this.pdfViewer.isFormDesignerToolbarVisible ?  'none' : 'default';
        if (obj.isReadonly) {
            (textTarget as HTMLInputElement).disabled = true;
            textTarget.style.cursor = 'default';
            chromeTarget.style.backgroundColor = obj.backgroundColor as string !== fillColor ? obj.backgroundColor as string : 'transparent';
        }
        if (obj.isRequired) {
            (textTarget as HTMLInputElement).required = true;
            chromeTarget.style.border = '1px solid red';
            chromeTarget.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        }
        if (!isNullOrUndefined(obj.maxLength)) {
            (textTarget as HTMLInputElement).maxLength = obj.maxLength === 0 ? 524288 : obj.maxLength;
        }
        textTarget.tabIndex = this.formFieldIndex;
        textTarget.setAttribute('aria-label', this.pdfViewer.element.id + 'formfilldesigner');
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
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor as string : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor as string : '#303030';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.direction = this.pdfViewer.enableRtl ? 'rtl' : '';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor as string : 'transparent';
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
            inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor as string : '#daeaf7ff';
            inputElement.style.borderColor = obj.borderColor ? obj.borderColor as string : '#303030';
        }
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor as string : 'transparent';
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
        if (!obj.isUnisonSelected) {
            (inputElement as IFormFieldProperty).name = obj.name ? obj.name : 'Radio Button' + this.setFormFieldIndex();
        }
        (inputElement as IElement).checked = obj.isSelected ? true : false;
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor as string : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor as string : '#303030';
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
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor as string : 'transparent';
            labelElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor as string : 'transparent';
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
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor as string : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor as string : '#303030';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor as string : 'transparent';
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
        inputElement.style.backgroundColor = obj.backgroundColor ? obj.backgroundColor as string : '#daeaf7ff';
        inputElement.style.borderColor = obj.borderColor ? obj.borderColor as string : '#303030';
        inputElement.style.textAlign = obj.alignment ? obj.alignment.toLowerCase() : 'left';
        inputElement.style.visibility = obj.visibility ? obj.visibility : 'visible';
        inputElement.style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        inputElement.style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
        if (obj.isReadonly) {
            (inputElement as HTMLInputElement).disabled = true;
            inputElement.style.cursor = 'default';
            inputElement.style.backgroundColor = obj.backgroundColor !== fillColor ? obj.backgroundColor as string : 'transparent';
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
        let background: string = obj.backgroundColor ? obj.backgroundColor as string : '#FFE48559';
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
            inputElement.style.borderColor = obj.borderColor ? obj.borderColor as string : '#303030';
            if (inputElement.firstElementChild) {
                (inputElement.firstElementChild as HTMLElement).style.borderColor = obj.borderColor ? obj.borderColor as string : '#303030';
            }
        }
        if (inputElement.firstElementChild) {
            (inputElement.firstElementChild as HTMLElement).style.borderWidth = !isNullOrUndefined(obj.thickness) ? obj.thickness + 'px' : '1px';
            (inputElement.firstElementChild as HTMLElement).style.pointerEvents = obj.isReadonly ? 'none' : 'default';
        }
        if (obj.isReadonly) {
            if (!isNullOrUndefined(inputElement.firstElementChild)){
                (inputElement.firstElementChild as HTMLInputElement).disabled = true;
                inputElement.style.backgroundColor = 'transparent';
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

    private setAttributeHtml(element: HTMLElement, attributes: object): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[parseInt(i.toString(), 10)] !== 'style') {
                element.setAttribute(keys[parseInt(i.toString(), 10)], (attributes as Record<string, string>)[keys[parseInt(i.toString(),
                                                                                                                            10)]]);
            } else {
                this.applyStyleAgainstCsp(element, (attributes as Record<string, string>)[keys[parseInt(i.toString(), 10)]]);
            }
        }
    }

    private applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void {
        const keys: string[] = attributes.split(';');
        for (let i: number = 0; i < keys.length; i++) {
            const attribute: string[] = keys[parseInt(i.toString(), 10)].split(':');
            if (attribute.length === 2) {
                (svg.style as unknown as { [key: string]: string })[attribute[0].trim()] = attribute[1].trim();
            }
        }
    }

    private getFieldBounds(bound: IFormFieldBound | PdfBoundsModel, pageIndex: number): IFormFieldBound {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        bound = { X: (bound as IFormFieldBound).X ? (bound as IFormFieldBound).X : (bound as PdfBoundsModel).x,
            Y: (bound as IFormFieldBound).Y ? (bound as IFormFieldBound).Y : (bound as PdfBoundsModel).y,
            Width: (bound as IFormFieldBound).Width ? (bound as IFormFieldBound).Width : (bound as PdfBoundsModel).width,
            Height: (bound as IFormFieldBound).Height ? (bound as IFormFieldBound).Height : (bound as PdfBoundsModel).height };
        let bounds: IFormFieldBound;
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
                const currentData: IFormField = formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField;
                if (!isNullOrUndefined(currentData)) {
                    if (this.pdfViewer.printModule && this.pdfViewer.printModule.canPrint && currentData.isPrint === false) {
                        formFieldsData.splice(parseInt(i.toString(), 10), 1);
                        i--;
                        continue;
                    }
                    if ((currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') && (isNullOrUndefined(currentData.signatureBound))) {
                        let filteredField: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(function (
                            field: FormFieldModel): boolean {
                            return field.id === currentData.id.split('_')[0];
                        });
                        if (isNullOrUndefined(filteredField)) {
                            filteredField = this.pdfViewer.formFieldCollections.filter(function (field: FormFieldModel): boolean {
                                return field.id === currentData.id.replace(/_content$/, '');
                            });
                        }
                        if (!isNullOrUndefined(currentData.signatureType) && currentData.signatureType === '') {
                            currentData.signatureType = filteredField[0].signatureType as unknown as string;
                        }
                        if (!isNullOrUndefined(currentData.value) && currentData.value === '') {
                            currentData.value = filteredField[0].value;
                        }
                        if (currentData.signatureType === 'Image') {
                            const imageUrl: string = (currentData.value.toString()).split(',')[1];
                            let image: PdfBitmap = new PdfBitmap(imageUrl);
                            const boundsObjects: PdfBoundsModel = {
                                x: currentData.lineBound.X, y: currentData.lineBound.Y,
                                width: currentData.lineBound.Width, height: currentData.lineBound.Height
                            };
                            //Draw image in page graphics
                            if (this.pdfViewer.signatureFitMode === 'Default') {
                                const padding: number =
                                Math.min(boundsObjects.height / this.pdfViewerBase.signatureModule.paddingDifferenceValue,
                                         boundsObjects.width / this.pdfViewerBase.signatureModule.paddingDifferenceValue);
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
                        else if (currentData.signatureType === 'Path' || currentData.signatureType === 'Draw') {
                            let boundsObjects: PdfBoundsModel = {
                                x: currentData.lineBound.X, y: currentData.lineBound.Y,
                                width: currentData.lineBound.Width, height: currentData.lineBound.Height
                            };
                            if (this.pdfViewer.signatureFitMode === 'Default') {
                                const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                                (currentData as unknown as PdfRenderedFields).LineBounds =
                                {X: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.X),
                                    Y: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.Y),
                                    Width: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.Width),
                                    Height: PdfViewerUtils.convertPixelToPoint(currentData.lineBound.Height)};
                                if (typeof filteredField[0].value === 'string' && filteredField[0].value.trim().startsWith('[')) {
                                    filteredField[0].value = this.pdfViewerBase.signatureValue(filteredField[0].value);
                                }
                                const signatureBounds: { left: number, top: number, width: number,
                                    height: number } = this.pdfViewerBase.signatureModule.
                                    updateSignatureAspectRatio(filteredField[0].value, false, null, currentData);
                                if (this.pdfViewer.formFieldsModule) {
                                    boundsObjects = this.pdfViewerBase.signatureModule.
                                        getSignBounds(i, currentData.rotation, currentData.pageNumber,
                                                      zoomvalue, currentData.lineBound.X, currentData.lineBound.Y,
                                                      signatureBounds.width, signatureBounds.height, true);
                                }
                                boundsObjects.x = boundsObjects.x + signatureBounds.left;
                                boundsObjects.y = boundsObjects.y + signatureBounds.top;
                            }
                            currentData.signatureBound = boundsObjects;
                            if (currentData.signatureType === 'Draw') {
                                this.pdfViewer.formFieldCollections.some((field: FormFieldModel) => {
                                    if (field.name === currentData.name && (field.type === 'SignatureField' || field.type === 'InitialField')) {
                                        currentData.signatureBound = (field as FormFieldModel & { signatureBounds: PdfBoundsModel }).
                                            signatureBounds;
                                        return true;
                                    }
                                    return false;
                                });
                            }
                            const collectionData: Object[] = processPathData(filteredField[0].value);
                            const csData: Object[] = splitArrayCollection(collectionData);
                            currentData.value = JSON.stringify(csData);
                        }
                        else if (currentData.signatureType === 'Type' || currentData.signatureType === 'Text') {
                            const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
                            if (this.pdfViewer.formFieldsModule) {
                                let bounds: PdfBoundsModel = this.pdfViewerBase.signatureModule.
                                    getSignBounds(i, currentData.rotation, currentData.pageNumber, zoomvalue, currentData.lineBound.X,
                                                  currentData.lineBound.Y, currentData.lineBound.Width, currentData.lineBound.Height);
                                if (this.pdfViewer.signatureFitMode === 'Default') {
                                    bounds = this.pdfViewerBase.signatureModule.getDefaultBoundsforSign(bounds);
                                }
                                currentData.signatureBound = bounds;
                                currentData.signatureType = 'Text';
                                const fontSize: number = bounds.height / this.pdfViewerBase.signatureModule.signatureFontSizeConstent;
                                const textWidth: number = this.pdfViewer.viewerBase.
                                    getTextWidth(currentData.value, fontSize, currentData.fontFamily);
                                let widthRatio: number = 1;
                                if (textWidth > bounds.width) {
                                    widthRatio = bounds.width / textWidth;
                                }
                                currentData.fontSize = this.pdfViewer.viewerBase.getFontSize(Math.floor((fontSize * widthRatio)));
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
                            this.pdfViewerBase.nonFillableFields[currentData.name] = `${currentData.selectedIndex}`;
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
                            this.getTextToImage(currentData as IFormField & { value: string });
                        }
                        if (this.pdfViewerBase.clientSideRendering && currentData.signatureType === 'Image') {
                            (formFieldsData[parseInt(i.toString(), 10)].FormField as IFormField).signatureBound =
                                this.getBoundsForSignatureImage((formFieldsData[parseInt(i.toString(), 10)].FormField as
                                IFormField).signatureBound,
                                                                formFieldsData[parseInt(i.toString(), 10)].FormField.pageNumber - 1) as
                                                                PdfBoundsModel;
                        }
                    }
                }
            }
            return (JSON.stringify(formFieldsData));
        } else {
            return null;
        }
    }
    private getBoundsForSignatureImage (bound: IFormFieldBound | PdfBoundsModel, pageIndex: number): IFormFieldBound | PdfBoundsModel {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { x: (bound as PdfBoundsModel).x + (bound as PdfBoundsModel).width - (bound as PdfBoundsModel).height,
                    y: (bound as PdfBoundsModel).y, width: (bound as PdfBoundsModel).height, height: (bound as PdfBoundsModel).width };
            }
            else if (pageDetails.rotation === 3) {
                return { x: (bound as PdfBoundsModel).x, y: (bound as PdfBoundsModel).y - (bound as PdfBoundsModel).width + (
                    bound as PdfBoundsModel).height, width: (bound as PdfBoundsModel).height, height: (bound as PdfBoundsModel).width };
            }
            else {
                return bound;
            }
        }
        else {
            return bound;
        }
    }
    /**
     * @private
     * @param {IFormFieldCollection[]} formFieldsData - It describes about the fields in session
     * @returns {void}
     */
    public updateMissingFormFields(formFieldsData: IFormFieldCollection[]): void {
        if (formFieldsData && formFieldsData.length !== this.pdfViewer.formFieldCollections.length) {
            const formFieldNotContains: FormFieldModel[] = this.pdfViewer.formFieldCollections.filter(
                ({ id: id1 }: { id: string }) =>
                    !this.pdfViewer.formFieldCollection.some(
                        ({ id: id2 }: { id: string }) => id2 === id1
                    )
            );
            for (let k: number = 0; k < formFieldNotContains.length; k++) {
                const items: IFormField = this.pdfViewer.formDesignerModule.loadedFormFieldValue(
                    formFieldNotContains[parseInt(k.toString(), 10)]
                );
                if (items.formFieldAnnotationType === 'RadioButton') {
                    if ((formFieldNotContains[parseInt(k.toString(), 10)] as FormFieldModel & IFormField).isUnisonSelected) {
                        const unison: boolean = (formFieldNotContains[parseInt(k.toString(), 10)] as
                        FormFieldModel & IFormField).isUnisonSelected;
                        items.radiobuttonItem[0].isUnisonSelected = unison;
                    }
                    const index: number = formFieldsData.findIndex(
                        (field: IFormFieldCollection) => field.FormField.name === items.name
                    );
                    if (index && index >= 0) {
                        ((formFieldsData[parseInt(index.toString(), 10)].FormField as unknown as IFormField).radiobuttonItem as
                        IRadiobuttonItem[]).push(items as IRadiobuttonItem);
                    } else {
                        formFieldsData.push({ Key: items.id + '_content', FormField: items });
                    }
                } else {
                    formFieldsData.push({ Key: items.id + '_content', FormField: items });
                }
            }
        }
    }

    private getTextToImage(currentData: IFormField & { value: string }): void {
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
     * @param {FormFieldModel} currentData - It describes about the current data
     * @private
     * @returns {IFormField} - IFormField
     */
    public loadedFormFieldValue(currentData: FormFieldModel): IFormField {
        const backgroundColor: { r: number; g: number; b: number, a: number } = !isNullOrUndefined(
            currentData.backgroundColor) ? this.getRgbCode(currentData.backgroundColor) as { r: number; g: number; b: number,
                a: number } : null;
        const bounds: IFormFieldBound = currentData.bounds;
        const backColor: { r: number; g: number; b: number, a: number } = currentData.backgroundColor ? { r: backgroundColor.r,
            g: backgroundColor.g,
            b: backgroundColor.b, a: backgroundColor.a } : { r: 218, g: 234, b: 247, a: 100 };
        const fontColor: number[] = this.hexToRgb(currentData.color);
        const foreColor: { r: number; g: number; b: number, a: number } = currentData.color ? { r: fontColor[0], g: fontColor[1],
            b: fontColor[2], a: 100 } :
            { r: 0, g: 0, b: 0, a: 100 };
        const borderColor: number[] = this.hexToRgb(currentData.borderColor);
        const borderRGB: { r: number; g: number; b: number, a: number } = currentData.borderColor ? { r: borderColor[0], g: borderColor[1],
            b: borderColor[2], a: 100 } :
            { r: 48, g: 48, b: 48, a: 100 };
        let value: string;
        const options: ItemModel[]  = [];
        let dropListoptions: [] = [];
        const selectedIndex: number[] = [];
        let finalSignBounds : { x: number, y: number, width: number, height: number };
        let signType: string = '';
        this.data = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        if (!isNullOrUndefined(this.data)) {
            this.formFieldsData = JSON.parse(this.data);
            if ((currentData.type === 'DropDown' || currentData.type === 'ListBox')){
                const dropListData: PdfRenderedFields[] = (this.formFieldsData as PdfRenderedFields[]).filter( (
                    fieldData: PdfRenderedFields) => (currentData.name === fieldData.FieldName) );
                if (dropListData.length > 0) {
                    dropListoptions = dropListData[0].TextList as [];
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
                    this.formFieldsData = JSON.parse(this.formFieldsData as string);
                }
                const signData: PdfRenderedFields[] = (this.formFieldsData as PdfRenderedFields[]).filter((
                    signfieldName: PdfRenderedFields) => (currentData.name === signfieldName.FieldName) );
                if (signData.length > 0) {
                    const boundsData: PdfRenderedFields[] = (this.formFieldsData as PdfRenderedFields[]).filter((datafieldName: PdfRenderedFields) => (datafieldName.Name === 'ink' || datafieldName.Name === 'SignatureField' || datafieldName.Name === 'SignatureImage' || datafieldName.Name === 'SignatureText') && (signData[0].FieldName === datafieldName.FieldName.split('_')[0]) );
                    for (let i: number = 0; i < boundsData.length; i++){
                        if ((signData[0].FieldName !== boundsData[parseInt(i.toString(), 10)].FieldName)){
                            value = boundsData[parseInt(i.toString(), 10)].Value;
                            currentData.fontFamily = boundsData[parseInt(i.toString(), 10)].FontFamily;
                            currentData.fontSize = boundsData[parseInt(i.toString(), 10)].FontSize;
                            if (!signData[0].Bounds) {
                                const signBounds: IFormFieldBound | PdfBoundsModel = boundsData[parseInt(i.toString(), 10)].LineBounds;
                                let currentLeft: number = void 0;
                                let currentTop: number = void 0;
                                let currentWidth: number = void 0;
                                let currentHeight: number = void 0;
                                const currentPage: number = boundsData[parseInt(i.toString(), 10)].PageIndex;
                                if ((signBounds as PdfBoundsModel).x || (signBounds as PdfBoundsModel).y
                                    || (signBounds as PdfBoundsModel).width || (signBounds as PdfBoundsModel).height) {
                                    currentLeft = (signBounds as PdfBoundsModel).x;
                                    currentTop = (signBounds as PdfBoundsModel).y;
                                    currentWidth = (signBounds as PdfBoundsModel).width;
                                    currentHeight = (signBounds as PdfBoundsModel).height;
                                }
                                else {
                                    if (this.pdfViewer.formFieldsModule) {
                                        currentLeft = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.X);
                                        currentTop = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.Y);
                                        currentWidth = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.Width);
                                        currentHeight = this.pdfViewer.formFieldsModule.ConvertPointToPixel(signBounds.Height);
                                    }
                                }
                                const bound: PdfBoundsModel = { left: currentLeft, top: currentTop, width: currentWidth,
                                    height: currentHeight };
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
        const fieldProperties: IFormField = {
            lineBound: { X: (bounds as PdfBoundsModel).x, Y: (bounds as PdfBoundsModel).y,
                Width: (bounds as PdfBoundsModel).width, Height: (bounds as PdfBoundsModel).height },
            pageNumber: currentData.pageIndex + 1, name: currentData.name, tooltip: currentData.tooltip,
            value: value ? value : currentData.value, radiobuttonItem: [],
            signatureType: currentData.signatureType ? currentData.signatureType as unknown as string : signType, id: currentData.id,
            insertSpaces: currentData.insertSpaces ? currentData.insertSpaces : false,
            isChecked: currentData.isChecked ? currentData.isChecked : false,
            isPrint: currentData.isPrint ? currentData.isPrint : false,
            isSelected: currentData.isSelected ? currentData.isSelected : false, fontFamily: currentData.fontFamily,
            fontStyle: currentData.fontStyle as unknown as string, backgroundColor: backColor as RGBA, fontColor: foreColor as RGBA,
            borderColor: borderRGB as RGBA,
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
            const field: IRadiobuttonItem = {
                lineBound: { X: bounds.X, Y: bounds.Y, Width: bounds.Width, Height: bounds.Height },
                pageNumber: currentData.pageIndex + 1, name: currentData.name, tooltip: currentData.tooltip,
                value: currentData.value, id: currentData.id,
                isChecked: currentData.isChecked ? currentData.isChecked : false, isSelected: currentData.isSelected ?
                    currentData.isSelected : false,
                fontFamily: currentData.fontFamily, fontStyle: currentData.fontStyle as unknown as string,
                backgroundColor: backColor as RGBA,
                fontColor: foreColor as RGBA, borderColor: borderRGB as RGBA, thickness: currentData.thickness,
                fontSize: currentData.fontSize, rotation: 0,
                isReadonly: currentData.isReadOnly ? currentData.isReadOnly : false, isRequired: currentData.isRequired ?
                    currentData.isRequired : false,
                isPrint: currentData.isPrint ? currentData.isPrint : false,
                textAlign: currentData.alignment, formFieldAnnotationType: currentData.type, zoomValue: 1,
                maxLength: currentData.maxLength ? currentData.maxLength : 0, visibility: currentData.visibility,
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
            this.updateAnnotationCanvas(canvas as HTMLCanvasElement, pageWidth, pageHeight, pageNumber);
            return canvas;
        } else {
            const annotationCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' }) as HTMLCanvasElement;
            this.updateAnnotationCanvas(annotationCanvas, pageWidth, pageHeight, pageNumber);
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
            const pageDetails: ISize = this.pdfViewerBase.pageSize[Number.parseInt(String(pageNumber), 10)];
            if (pageDetails && this.pdfViewerBase.getAnnotationCanvasMetrics) {
                const metrics: any = this.pdfViewerBase.getAnnotationCanvasMetrics(pageDetails.width, pageDetails.height);
                (canvas as HTMLCanvasElement).width = metrics.canvasWidth;
                (canvas as HTMLCanvasElement).height = metrics.canvasHeight;
                canvas.style.width = metrics.styleWidth + 'px';
                canvas.style.height = metrics.styleHeight + 'px';
            } else {
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
            }
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
            eventTarget = eventTarget.closest('.e-pv-text-layer') as HTMLElement;
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
        case 'Button':
            return this.pdfViewer.localeObj.getConstant('Button');
        case 'BarcodeField':
            return this.pdfViewer.localeObj.getConstant('Barcode');
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
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'BarcodeField') {
            propertyWinMinHeight = '505px';
        } else if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'DropdownList' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'ListBox') {
            propertyWinMinHeight = '430px';
        } else {
            propertyWinMinHeight = '505px';
        }
        const selectedForHeader: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        let headerTypeLabel: string = this.getPropertyPanelHeaderContent(selectedForHeader.formFieldAnnotationType);
        if (selectedForHeader && selectedForHeader.isDateField) {
            const dateTimeLocale: string = this.pdfViewer.localeObj.getConstant('Date Time');
            headerTypeLabel = (dateTimeLocale && dateTimeLocale !== '') ? dateTimeLocale : 'DateTime';
        }
        this.propertiesDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: '<div class="e-pv-form-field-property-header"> ' + headerTypeLabel + ' ' + this.pdfViewer.localeObj.getConstant('Properties') + '</div>',
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

    private onOkClicked(args: Event): void {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        const clonedItem: Object = cloneObject(selectedItem);
        this.isAddFormFieldProgrammatically = false;
        if (selectedItem) {
            switch (selectedItem.formFieldAnnotationType) {
            case 'Textbox':
            case 'PasswordField': {
                if (this.formFieldMultiline && this.formFieldMultiline.checked && selectedItem.formFieldAnnotationType === 'Textbox' && this.multilineCheckboxCheckedState) {
                    this.renderMultilineText(selectedItem);
                } else if (selectedItem.formFieldAnnotationType === 'Textbox' && this.multilineCheckboxCheckedState && !selectedItem.isDateField) {
                    this.renderTextbox(selectedItem);
                }
                if (selectedItem.formFieldAnnotationType === 'PasswordField') {
                    this.updateTextboxFormDesignerProperties(selectedItem);
                }
                if (selectedItem.formFieldAnnotationType === 'Textbox') {
                    const textboxCollection: PdfFormFieldBaseModel[] = this.checkTextboxName(selectedItem);
                    if (textboxCollection && textboxCollection.length > 0) {
                        for (let i: number = 0; i < textboxCollection.length; i++) {
                            const item: PdfFormFieldBaseModel = textboxCollection[parseInt(i.toString(), 10)];
                            if (item.id === selectedItem.id) {
                                if (selectedItem.isMultiline) {
                                    this.renderMultilineText(item);
                                } else if (!selectedItem.isDateField) {
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
            case 'BarcodeField': {
                this.updateBarcodeFormDesignerProperties(selectedItem);
                const barcodePoint: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(barcodePoint, selectedItem.wrapper.children[0] as DiagramHtmlElement,
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
            case 'Button': {
                this.updateButtonFormDesignerProperties(selectedItem);
                const point6: PointModel = cornersPointsBeforeRotation(selectedItem.wrapper.children[0]).topLeft;
                this.updateFormDesignerFieldInSessionStorage(point6, selectedItem.wrapper.children[0] as DiagramHtmlElement,
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
        // Keep the dialog open when Custom format validation failed so the
        // user can correct the pattern. Clear the flag for the next attempt.
        if (this.isDateTimeCustomFormatCommitBlocked) {
            this.isDateTimeCustomFormatCommitBlocked = false;
            return;
        }
        this.propertiesDialog.hide();
    }

    /**
     * Update the form fields properties to the collection while rendering the page
     *
     * @param {PdfFormFieldBaseModel} item - It describes about the item
     * @returns {void}
     */
    private updateFormFieldPropertiesInCollections(item: PdfFormFieldBaseModel): void {
        const formFieldCollection: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        const itemIdPrefix: string = item && item.id ? item.id.split('_')[0] : '';
        for (let i: number = 0; i < formFieldCollection.length; i++) {
            const currentData: FormFieldModel = formFieldCollection[parseInt(i.toString(), 10)];
            // Collection id is usually the designer node prefix; node id may be prefix_content / full element id.
            const idMatched: boolean = currentData.id === item.id ||
                (!!itemIdPrefix && currentData.id === itemIdPrefix);
            if (idMatched && currentData.name === item.name) {
                if (this.formFieldName && this.formFieldName.value) {
                    currentData.name = this.formFieldName.value;
                }
                if (this.formFieldValue && (item.value !== this.formFieldValue.value)) {
                    currentData.value = this.formFieldValue.value;
                }
                if (this.formFieldAlign && (item.alignment !== this.formFieldAlign)) {
                    currentData.alignment = this.formFieldAlign as TextAlignment;
                }
                if (this.formFieldPrinting && (item.isPrint !== this.formFieldPrinting.checked)) {
                    currentData.isPrint = this.formFieldPrinting.checked;
                }
                if (this.formFieldTooltip && (item.tooltip !== this.formFieldTooltip.value)) {
                    currentData.tooltip = this.formFieldTooltip.value;
                }
                if (this.formFieldVisibility && (item.visibility !== this.formFieldVisibility.value)) {
                    currentData.visibility = this.formFieldVisibility as unknown as Visibility;
                }
                if (this.formFieldFontFamily && this.formFieldFontFamily.value) {
                    currentData.fontFamily = this.formFieldFontFamily.value as string;
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
                    currentData.fontStyle = this.pdfViewer.formFieldCollection[i - 1].fontStyle as unknown as FontStyle;
                } else {
                    currentData.fontStyle = this.pdfViewer.formFieldCollection[i + 1].fontStyle as unknown as FontStyle;
                }
                // ButtonField: keep AA (GoTo) actions on collection when property dialog / API syncs general props.
                // item.id may be designer node id (prefix_content); collection id is usually the prefix.
                if (item.formFieldAnnotationType === 'Button' || currentData.type === 'ButtonField' ||
                    (currentData.type as string) === 'Button') {
                    if (!isNullOrUndefined(item.actions)) {
                        currentData.actions = item.actions;
                    }
                }
                const formFieldIndex: number =
                this.pdfViewer.formFieldCollections.findIndex(function (el: FormFieldModel): boolean { return el.id === item.id; });
                if (formFieldIndex > -1) {
                    this.pdfViewer.formFieldCollections[parseInt(formFieldIndex.toString(), 10)] = currentData;
                } else {
                    const nameKey: string = item.id ? item.id.split('_')[0] : '';
                    const prefixIndex: number = nameKey ?
                        this.pdfViewer.formFieldCollections.findIndex(function (el: FormFieldModel): boolean {
                            return el.id === nameKey;
                        }) : -1;
                    if (prefixIndex > -1) {
                        this.pdfViewer.formFieldCollections[parseInt(prefixIndex.toString(), 10)] = currentData;
                    }
                }
            }

        }
    }

    private checkTextboxName(selectedItem: PdfFormFieldBaseModel): PdfFormFieldBaseModel[] {
        const textboxObjectCollection: PdfFormFieldBaseModel[] = [];
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            const item: PdfFormFieldBaseModel = this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)];
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
        if (selectedItem) {
            const wrapperElement: DiagramHtmlElement = selectedItem.wrapper.children[0] as DiagramHtmlElement;
            selectedItem.isMultiline = isMultiline;
            if (document.getElementById(wrapperElement.id + '_html_element')) {
                const htmlElement: Element = document.getElementById(wrapperElement.id + '_html_element').children[0];
                const textAreaId: string = htmlElement.children[0].id;
                document.getElementById(htmlElement.children[0].id).remove();
                if (className.indexOf('e-pv-formfield-textarea') !== -1) {
                    const inputElement: HTMLElement = this.createTextboxElement(textAreaId);
                    inputElement.style.backgroundColor = selectedItem.backgroundColor as string;
                    wrapperElement.template = htmlElement.appendChild(inputElement);
                } else {
                    const textArea: HTMLElement = this.createTextAreaElement(textAreaId);
                    textArea.style.backgroundColor = selectedItem.backgroundColor as string;
                    (textArea as HTMLTextAreaElement).value = selectedItem.value;
                    wrapperElement.template = htmlElement.appendChild(textArea);
                }
                const index: number = this.getFormFiledIndex(selectedItem.id.split('_')[0]);
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isMultiline = selectedItem.isMultiline;
                (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isMultiline = selectedItem.isMultiline;
            }
        }
    }

    /**
     * DateTime fields render text inside a composite wrapper. Appearance styles
     * (font, color, alignment) must target the inner text input, not the wrapper.
     * Border and background stay on the wrapper. Other field types are unchanged.
     *
     * @param {HTMLElement} element - element passed by the properties dialog
     * @returns {HTMLElement} - text input for DateTime fields, otherwise the original element
     */
    private getDateTimeTextAppearanceTarget(element: HTMLElement): HTMLElement {
        if (element && element.classList && element.classList.contains('e-pv-datetime-composite')) {
            const textInput: HTMLElement = element.querySelector('.e-pv-formfield-input') as HTMLElement;
            if (textInput) {
                return textInput;
            }
        }
        return element;
    }

    private reRenderMultilineTextbox(selectedItem: PdfFormFieldBaseModel, className: string): void {
        const wrapperElement: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element');
        if (wrapperElement) {
            const textareaElement: Element = wrapperElement.firstElementChild.firstElementChild;
            const textareaId: string = textareaElement.id;
            textareaElement.remove();
            if (className.indexOf('e-pv-formfield-textarea') !== -1) {
                const textboxElement: HTMLElement = this.createTextboxElement(textareaId);
                wrapperElement.firstElementChild.appendChild(textboxElement);
            } else {
                const textboxElement: HTMLElement = this.createTextAreaElement(textareaId);
                wrapperElement.firstElementChild.appendChild(textboxElement);
            }
        }
    }

    private createTextAreaElement(id: string): HTMLElement {
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
        (inputElement as IElement).autocomplete = this.pdfViewer.enableAutoComplete ? 'on' : 'off';
        inputElement.style.width = '100%';
        inputElement.style.height = '100%';
        inputElement.style.position = 'absolute';
        inputElement.style.borderStyle = 'solid';
        inputElement.addEventListener('click', this.inputElementClick.bind(this));
        inputElement.addEventListener('change', this.getTextboxValue.bind(this));
        inputElement.addEventListener('focus', this.focusFormField.bind(this));
        inputElement.addEventListener('blur', this.blurFormField.bind(this));
        inputElement.addEventListener('keydown', this.onAfKeyDown.bind(this));
        inputElement.addEventListener('input', this.onAfInput.bind(this));
        return inputElement;
    }

    /**
     * Ensures host datetime-local support is detected once and cached on the viewer.
     *
     * @private
     * @returns {boolean} - whether datetime-local is supported
     */
    private supportsDateTimeLocal(): boolean {
        const viewerAny: { _supportsDateTimeLocal?: boolean } = this.pdfViewer as unknown as { _supportsDateTimeLocal?: boolean };
        if (typeof viewerAny._supportsDateTimeLocal === 'boolean') {
            this._supportsDateTimeLocal = viewerAny._supportsDateTimeLocal;
            return this._supportsDateTimeLocal;
        }
        if (typeof this._supportsDateTimeLocal === 'boolean') {
            viewerAny._supportsDateTimeLocal = this._supportsDateTimeLocal;
            return this._supportsDateTimeLocal;
        }
        let supported: boolean = false;
        try {
            const testInput: HTMLInputElement = document.createElement('input');
            testInput.setAttribute('type', 'datetime-local');
            supported = testInput.type === 'datetime-local';
        } catch (e) {
            supported = false;
        }
        this._supportsDateTimeLocal = supported;
        viewerAny._supportsDateTimeLocal = supported;
        return supported;
    }

    /**
     * Parses format pattern from AFDate/AFTime script string.
     *
     * @param {PdfFormFieldBaseModel} obj - field model
     * @private
     * @returns {string} - format pattern
     */
    private parseDateTimeFormatPattern(obj: PdfFormFieldBaseModel): string {
        const actions: PdfFormFieldBaseModel['actions'] = obj && obj.actions;
        const script: string = this.pdfViewerBase.getActionsFormatScript(actions);
        if (!script) {
            return 'm/d/yy';
        }
        const match: RegExpMatchArray | null = script.match(/AF(?:Date|Time)_Format(?:Ex)?\s*\(\s*["']([^"']+)["']\s*\)/i);
        if (match && match[1]) {
            return match[1];
        }
        return 'm/d/yy';
    }

    /**
     * Infers native picker family from type + format tokens.
     *
     * @param {PdfFormFieldBaseModel} obj - field model
     * @private
     * @returns {'date' | 'time' | 'datetime-local'} - native input type
     */
    private inferNativeDateTimePicker(obj: PdfFormFieldBaseModel): 'date' | 'time' | 'datetime-local' {
        // Derive date/time sub-type from the format script only; the legacy `type` field has been removed.
        const sourceScript: string = (obj && obj.actions) ? this.pdfViewerBase.getActionsFormatScript(obj.actions) : '';
        const isTimeField: boolean = !!(sourceScript && /AFTime_Format(?:Ex)?\s*\(/i.test(sourceScript));
        if (isTimeField) {
            return 'time';
        }
        const pattern: string = this.parseDateTimeFormatPattern(obj);
        // Date+time patterns include hour markers or am/pm.
        const hasHour: boolean = /h{1,2}|H{1,2}|tt/i.test(pattern);
        if (hasHour) {
            return this.supportsDateTimeLocal() ? 'datetime-local' : 'date';
        }
        return 'date';
    }

    /**
     * Builds composite (text + trailing picker button) for isDateField textboxes.
     *
     * @param {string} id - field content id
     * @param {PdfFormFieldBaseModel} drawingObject - field model
     * @private
     * @returns {HTMLElement} - composite wrapper
     */
    private createDateTimeCompositeElement(id: string, drawingObject: PdfFormFieldBaseModel): HTMLElement {
        const wrapper: HTMLElement = createElement('div');
        wrapper.id = id + '_datetime_composite';
        wrapper.className = 'e-pv-datetime-composite';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.position = 'absolute';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'row';
        wrapper.style.alignItems = 'stretch';
        wrapper.style.boxSizing = 'border-box';
        wrapper.style.overflow = 'hidden';
        const textInput: HTMLElement = this.createTextboxElement(id);
        textInput.style.position = 'relative';
        textInput.style.flex = '1 1 auto';
        textInput.style.width = 'auto';
        textInput.style.minWidth = '0';
        // R-FIX-DTP-NATIVE-LOOK: drop the solid border so the datetime composite
        // matches the native browser <input type="date|time|datetime-local"> look
        // (no visible box, no inner outline/box-shadow).
        textInput.style.border = 'none';
        textInput.style.outline = 'none';
        textInput.style.boxShadow = 'none';
        textInput.style.background = 'transparent';
        textInput.classList.add('e-pv-datetime-text');
        // R-FIX-DTP-02-c: set the stable logical id (FieldName) on the text
        // input so DateTime last-valid-value recovery can key off `name` and
        // survive rerender / zoom / property updates that change page-indexed
        // DOM ids.
        if (drawingObject && drawingObject.name) {
            textInput.setAttribute('name', drawingObject.name);
        }
        // R-FIX-DTP-02: surface the resolved format as placeholder when value is empty.
        const dateTimePattern: string = this.parseDateTimeFormatPattern(drawingObject) || 'm/d/yy';
        textInput.setAttribute('placeholder', dateTimePattern);
        // Do not open native picker on text focus (SoT picker rules).
        textInput.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                (textInput as HTMLInputElement).blur();
            }
        });
        // R2-FIX-02: double-click selects all text inside the input.
        textInput.addEventListener('dblclick', (e: Event) => {
            e.stopPropagation();
            (textInput as HTMLInputElement).select();
        });
        const pickerBtn: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        pickerBtn.type = 'button';
        pickerBtn.id = id + '_datetime_picker_btn';
        pickerBtn.className = 'e-pv-datetime-picker-btn';
        pickerBtn.setAttribute('aria-label', 'Open date time picker');
        pickerBtn.tabIndex = 0;
        pickerBtn.style.flex = '0 0 auto';
        // Width is finalized in updateTextboxProperties from the zoomed field height.
        pickerBtn.style.width = '28px';
        pickerBtn.style.minWidth = '0';
        pickerBtn.style.height = '100%';
        pickerBtn.style.padding = '0';
        pickerBtn.style.margin = '0';
        pickerBtn.style.border = 'none';
        pickerBtn.style.outline = 'none';
        pickerBtn.style.background = 'transparent';
        pickerBtn.style.cursor = 'pointer';
        pickerBtn.style.display = 'flex';
        pickerBtn.style.alignItems = 'center';
        pickerBtn.style.justifyContent = 'center';
        pickerBtn.style.boxSizing = 'border-box';
        // Derive date/time sub-type from the format script only; the legacy `type` field has been removed.
        const sourceScript: string = (drawingObject && drawingObject.actions) ?
            this.pdfViewerBase.getActionsFormatScript(drawingObject.actions) : '';
        const isTimeField: boolean = !!(sourceScript && /AFTime_Format(?:Ex)?\s*\(/i.test(sourceScript));
        const iconSpan: HTMLElement = createElement('span');
        iconSpan.className = isTimeField
            ? 'e-pv-datetime-clock-icon e-pv-icon'
            : 'e-pv-datetime-calendar-icon e-pv-icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.style.pointerEvents = 'none';
        iconSpan.style.display = 'inline-block';
        iconSpan.style.width = '16px';
        iconSpan.style.height = '16px';
        pickerBtn.appendChild(iconSpan);
        // Hidden native picker driven only by button activation.
        const nativeType: 'date' | 'time' | 'datetime-local' = this.inferNativeDateTimePicker(drawingObject);
        const nativePicker: HTMLInputElement = createElement('input') as HTMLInputElement;
        nativePicker.type = nativeType;
        nativePicker.id = id + '_datetime_native';
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
        nativePicker.style.padding = '0';
        nativePicker.style.margin = '0';
        // Inert picker affordance while designer layout mode is active.
        if (this.pdfViewer.designerMode) {
            pickerBtn.style.cursor = 'default';
            pickerBtn.setAttribute('aria-disabled', 'true');
        }
        const openNativePicker: () => void = () => {
            if (drawingObject && drawingObject.isReadonly) {
                return;
            }
            // R-FIX-09: no-op while form designer layout mode is on.
            if (this.pdfViewer.designerMode) {
                return;
            }
            const pattern: string = this.parseDateTimeFormatPattern(drawingObject);
            // Read nativePicker.type at click-time so the seed format stays in sync with
            // applyDateTimeFormatFromDialog, which may have reassigned nativePicker.type.
            const liveNativeType: 'date' | 'time' | 'datetime-local' =
                (nativePicker.type === 'date' || nativePicker.type === 'time' || nativePicker.type === 'datetime-local')
                    ? nativePicker.type
                    : nativeType;
            const seedIso: string = this.parseDateTimeTextToISO(
                (textInput as HTMLInputElement).value || '', pattern, liveNativeType);
            if (seedIso) {
                nativePicker.value = seedIso;
            } else {
                nativePicker.value = '';
            }
            try {
                if (typeof (nativePicker as HTMLInputElement & { showPicker?: () => void }).showPicker === 'function') {
                    (nativePicker as HTMLInputElement & { showPicker?: () => void }).showPicker();
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
            if (this.pdfViewer.readOnlySettings.formFields) {
                return;
            }
            openNativePicker();
        });
        pickerBtn.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                openNativePicker();
            }
        });
        nativePicker.addEventListener('change', () => {
            const formatted: string = this.formatNativeDateTimeValue(nativePicker.value, drawingObject);
            (textInput as HTMLInputElement).value = formatted;
            // Keep text editable after picker commit (readonly only when model says so).
            if (!(drawingObject && drawingObject.isReadonly)) {
                (textInput as HTMLInputElement).disabled = false;
                (textInput as HTMLInputElement).readOnly = false;
            }
            // Reuse textbox change pipeline so model/session/events stay consistent.
            const changeEvent: Event = document.createEvent('Event');
            changeEvent.initEvent('change', true, true);
            Object.defineProperty(changeEvent, 'target', { writable: false, value: textInput });
            this.getTextboxValue(changeEvent);
        });
        // Stacked fallback host exists when datetime-local unsupported and format needs both.
        if (nativeType === 'date' && !this.supportsDateTimeLocal() &&
            /h{1,2}|H{1,2}|tt/i.test(this.parseDateTimeFormatPattern(drawingObject))) {
            wrapper.setAttribute('data-datetime-fallback', 'stacked');
        }
        wrapper.appendChild(textInput);
        wrapper.appendChild(pickerBtn);
        wrapper.appendChild(nativePicker);
        return wrapper;
    }

    /**
     * Parses display text against pattern into a Date (best-effort).
     *
     * @param {string} text - field display text
     * @param {string} pattern - active format pattern
     * @private
     * @returns {Date} - parsed date or invalid Date
     */
    private parseDateTimeTextToDate(text: string, pattern: string): Date {
        const raw: string = (text || '').trim();
        if (!raw) {
            return new Date(NaN);
        }
        const parsedMs: number = Date.parse(raw);
        if (!isNaN(parsedMs)) {
            // R-FIX-DTP-03: V8/Chromium returns year 2001 when Date.parse consumes
            // a year-less input like "9/25" or "Sep-26" — the input has fewer than
            // three separator-delimited parts so there is nowhere to encode a year.
            // The display text for patterns such as m/d, mm/yy, d-mmm, mmm-yy
            // strips the year, so re-opening the picker must not seed it with
            // 2001. Substitute the current year only when the parsed result
            // carries the V8 quirk (no separator-encoded year); legitimate 2-digit
            // years (e.g. m/d/yy "9/25/01") still pass through because V8 returns
            // 2001 from a 3-part input, which is preserved here.
            const parsedDate: Date = new Date(parsedMs);
            const separatorCount: number = (raw.match(/[/.\-\s]/g) || []).length;
            if (parsedDate.getFullYear() === 2001 && separatorCount < 2) {
                const now: Date = new Date();
                return new Date(
                    now.getFullYear(),
                    parsedDate.getMonth(),
                    parsedDate.getDate(),
                    parsedDate.getHours(),
                    parsedDate.getMinutes(),
                    parsedDate.getSeconds(),
                    parsedDate.getMilliseconds()
                );
            }
            return parsedDate;
        }
        // Numeric slash/dash forms: try m/d/y and y-m-d loosely.
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
            const d: Date = new Date(year, month - 1, day, hours, minutes, seconds);
            if (!isNaN(d.getTime())) {
                return d;
            }
        }
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
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
        }
        void pattern;
        return new Date(NaN);
    }

    /**
     * Converts field display text to a native picker ISO-like value.
     *
     * @param {string} text - field text
     * @param {string} pattern - format pattern
     * @param {string} nativeType - date | time | datetime-local
     * @private
     * @returns {string} - ISO-like value or empty
     */
    private parseDateTimeTextToISO(text: string, pattern: string, nativeType: string): string {
        const date: Date = this.parseDateTimeTextToDate(text, pattern);
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
     * Formats a native picker ISO-like value into the field display pattern (best-effort).
     *
     * @param {string} nativeValue - value from native input
     * @param {PdfFormFieldBaseModel} obj - field model
     * @private
     * @returns {string} - display string
     */
    private formatNativeDateTimeValue(nativeValue: string, obj: PdfFormFieldBaseModel): string {
        if (!nativeValue) {
            return '';
        }
        const pattern: string = this.parseDateTimeFormatPattern(obj);
        let date: Date = null;
        // datetime-local: yyyy-MM-ddTHH:mm ; date: yyyy-MM-dd ; time: HH:mm[:ss]
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
            return nativeValue;
        }
        return this.applyDateTimePattern(date, pattern);
    }
    /**
     * Validates a Custom DateTime format pattern against the same token set
     * actually honored by {@link applyDateTimePattern} / the predefined catalogs.
     *
     * Rejects empty, whitespace-only, and unrecognized patterns so users cannot
     * commit arbitrary strings such as "abcd". Type-aware: Date must contain a
     * date-relevant token, Time must contain a time-relevant token.
     *
     * @private
     * @param {string} pattern - candidate custom pattern
     * @param {string} fieldType - 'date' | 'time'
     * @returns {boolean} - true when pattern is fully understood by the formatter
     */
    private isValidDateTimeCustomFormat(pattern: string, fieldType: string): boolean {
        if (!pattern) {
            return false;
        }
        const trimmed: string = String(pattern).trim();
        if (!trimmed) {
            return false;
        }
        // Allowed separators between tokens. By the custom date/time format
        // specification there are no arbitrary letter/digit literals — only
        // these separator characters may appear outside a token. Any run of
        // letters or digits that is not a recognized token is invalid (this
        // is what rejects inputs like "aad", "aah", "abcH", etc.).
        const separators: string = '/\\-,:. \t';
        // Token list mirrors applyDateTimePattern. Order matters: longest
        // first so multi-char tokens (yyyy, mmmm, mm, ...) are consumed
        // before single-char (m, d, h, H, M, s, t). For "HH"/"hh"/"MM"/
        // "ss"/"tt" — both single-letter H and double-letter HH are valid
        // tokens; longest-match consumed first disambiguates HH from H.
        const tokens: string[] = [
            'yyyy', 'yyy', 'mmmm', 'mmm',
            'mm', 'dd', 'HH', 'hh', 'ss',
            'yy', 'MM', 'tt',
            'm', 'd', 'h', 'H', 'M', 's', 't'
        ];
        // Position-aware scan: at every cursor position we either consume a
        // token (longest match wins) or accept exactly one allowed separator
        // character. Anything else is invalid. The scan runs exactly once
        // along the input, so a stray letter run cannot be carried along by
        // a later valid token (this is what was broken before).
        const matchedTokens: string[] = [];
        let i: number = 0;
        const len: number = trimmed.length;
        while (i < len) {
            const ch: string = trimmed.charAt(i);
            // Allowed separator — consume one character and continue.
            if (separators.indexOf(ch) !== -1) {
                i++;
                continue;
            }
            // Try longest-token-first match at this position.
            let matched: string = '';
            for (let k: number = 0; k < tokens.length; k++) {
                const tok: string = tokens[parseInt(k.toString(), 10)];
                if (trimmed.substr(i, tok.length) === tok) {
                    matched = tok;
                    break;
                }
            }
            if (matched) {
                matchedTokens.push(matched);
                i += matched.length;
                continue;
            }
            // Unrecognized character (e.g. 'a', 'b', '#', '@', ...). Reject.
            return false;
        }
        // At least one recognized token must appear, otherwise the input is
        // empty of meaning (rejects purely-separator inputs like "::" or "-").
        if (matchedTokens.length === 0) {
            return false;
        }
        // Type relevance — Date requires date tokens; Time requires time tokens.
        const isTime: boolean = String(fieldType || '').toLowerCase() === 'time';
        if (isTime) {
            // No date-only tokens (m, d, y, mmm, mmmm) allowed for Time.
            for (let j: number = 0; j < matchedTokens.length; j++) {
                const t: string = matchedTokens[parseInt(j.toString(), 10)];
                if (t === 'm' || t === 'd' || t === 'yy' || t === 'yyy' ||
                    t === 'yyyy' || t === 'mmm' || t === 'mmmm') {
                    return false;
                }
            }
            // Require at least one time token (h, H, M, s, t, HH, hh, MM, ss, tt).
            const hasTimeToken: boolean = matchedTokens.some((t: string) =>
                t === 'h' || t === 'H' || t === 'M' || t === 's' || t === 't' ||
                t === 'HH' || t === 'hh' || t === 'MM' || t === 'ss' || t === 'tt'
            );
            return hasTimeToken;
        }
        // Date type: require at least one date token (m, d, y, mmm, mmmm, mm, dd).
        const hasDateToken: boolean = matchedTokens.some((t: string) =>
            t === 'm' || t === 'd' || t === 'yy' || t === 'yyy' ||
            t === 'yyyy' || t === 'mmm' || t === 'mmmm' || t === 'mm' || t === 'dd'
        );
        return hasDateToken;
    }
    /**
     * Returns a concise validation message for a Custom DateTime pattern.
     *
     * @private
     * @param {string} fieldType - 'date' | 'time'
     * @returns {string} - validation message
     */
    private getDateTimeCustomFormatValidationMessage(fieldType: string): string {
        if (String(fieldType || '').toLowerCase() === 'time') {
            return 'Enter a valid custom time format.';
        }
        return 'Enter a valid custom date format.';
    }
    /**
     * Toggles the e-error styling on the Custom format input + wrapper and
     * shows/hides the validation message element accordingly.
     *
     * @private
     * @param {boolean} isValid - whether the active pattern is valid
     * @param {string} fieldType - 'date' | 'time'
     * @returns {void}
     */
    private setDateTimeCustomFormatValidationUi(isValid: boolean, fieldType: string): void {
        this.isDateTimeCustomFormatValid = isValid;
        const inputElement: HTMLInputElement = this.formFieldDateTimeCustom
            ? (this.formFieldDateTimeCustom.element as HTMLInputElement) : null;
        if (inputElement) {
            const group: HTMLElement = inputElement.closest('.e-input-group') as HTMLElement
                || inputElement.parentElement;
            if (isValid) {
                inputElement.classList.remove('e-error');
                if (group) {
                    group.classList.remove('e-error');
                }
            } else {
                inputElement.classList.add('e-error');
                if (group) {
                    group.classList.add('e-error');
                }
            }
        }
        if (this.formFieldDateTimeCustomError) {
            if (isValid) {
                this.formFieldDateTimeCustomError.style.display = 'none';
                this.formFieldDateTimeCustomError.textContent = '';
            } else {
                this.formFieldDateTimeCustomError.style.display = '';
                this.formFieldDateTimeCustomError.textContent =
                    this.getDateTimeCustomFormatValidationMessage(fieldType);
            }
        }
    }
    /**
     * Applies a limited Acrobat-like pattern to a Date (preview/commit helper).
     *
     * @param {Date} date - date value
     * @param {string} pattern - format pattern
     * @private
     * @returns {string} - formatted string
     */
    private applyDateTimePattern(date: Date, pattern: string): string {
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
        let result: string = pattern;
        // Longer tokens first.
        result = result.replace(/yyyy/g, String(yyyy));
        result = result.replace(/yyy/g, String(yyyy));
        result = result.replace(/yy/g, yy);
        result = result.replace(/mmmm/gi, monthsLong[date.getMonth()]);
        result = result.replace(/mmm/gi, monthsShort[date.getMonth()]);
        result = result.replace(/mm/g, pad(m));
        result = result.replace(/\bm\b/g, String(m));
        result = result.replace(/dd/g, pad(d));
        result = result.replace(/\bd\b/g, String(d));
        // 24-hour unpadded (H) must precede 24-hour padded (HH), matching the
        // longest-first ordering used by the rest of this formatter.
        result = result.replace(/\bH\b/g, String(H));
        result = result.replace(/HH/g, pad(H));
        result = result.replace(/h:MM:ss tt/g, h12 + ':' + pad(M) + ':' + pad(s) + ' ' + tt);
        result = result.replace(/h:MM tt/g, h12 + ':' + pad(M) + ' ' + tt);
        result = result.replace(/HH:MM:ss/g, pad(H) + ':' + pad(M) + ':' + pad(s));
        result = result.replace(/HH:MM/g, pad(H) + ':' + pad(M));
        result = result.replace(/MM/g, pad(M));
        result = result.replace(/ss/g, pad(s));
        result = result.replace(/\btt\b/gi, tt);
        // 12-hour padded (hh) must precede 12-hour unpadded (h) so the longer
        // token is consumed first; matches the longest-first ordering above.
        result = result.replace(/hh/g, pad(h12));
        result = result.replace(/\bh\b/g, String(h12));
        return result;
    }

    /**
     * @param {PdfFormFieldBaseModel} formFieldObject - It describes about the form field object
     * @private
     * @returns {void}
     */
    public updateFormFieldCollections(formFieldObject: PdfFormFieldBaseModel): void {
        const rawType: string = (formFieldObject as IFormField).type ?
            (formFieldObject as IFormField).type as string : formFieldObject.formFieldAnnotationType as string;
        const formField: FormFieldModel & { isUnisonSelected?: boolean } = {
            id: formFieldObject.id.split('_')[0], name: (formFieldObject as PdfFormFieldBaseModel).name, value: (formFieldObject as PdfFormFieldBaseModel).value,
            type: this.getPublicFormFieldType(rawType), isReadOnly: formFieldObject.isReadonly,
            fontFamily: formFieldObject.fontFamily, isMultiline: formFieldObject.isMultiline,
            fontSize: formFieldObject.fontSize, fontStyle: formFieldObject.fontStyle as unknown as FontStyle, color: (formFieldObject as PdfFormFieldBaseModel).color ? (formFieldObject as PdfFormFieldBaseModel).color : this.convertRgbToHex((formFieldObject as IFormField).fontColor as unknown as { r: number; g: number; b: number}), backgroundColor: typeof (formFieldObject as PdfFormFieldBaseModel).backgroundColor === 'string' ? (formFieldObject as PdfFormFieldBaseModel).backgroundColor as string : (formFieldObject as PdfFormFieldBaseModel).backgroundColor as string,
            alignment: (formFieldObject as PdfFormFieldBaseModel).alignment ?
                (formFieldObject as PdfFormFieldBaseModel).alignment as TextAlign : (formFieldObject as IFormField).textAlign as TextAlign,
            visibility: (formFieldObject as PdfFormFieldBaseModel).visibility,
            maxLength: (formFieldObject as PdfFormFieldBaseModel).maxLength,
            isRequired: (formFieldObject as PdfFormFieldBaseModel).isRequired,
            isPrint: formFieldObject.isPrint, isSelected: formFieldObject.isSelected, isChecked: formFieldObject.isChecked,
            tooltip: (formFieldObject as PdfFormFieldBaseModel).tooltip,
            bounds: formFieldObject.bounds as IFormFieldBound ? formFieldObject.bounds as IFormFieldBound : (
                formFieldObject as IFormField).lineBound as IFormFieldBound,
            thickness: formFieldObject.thickness,
            borderColor: typeof (formFieldObject as PdfFormFieldBaseModel).borderColor === 'string' ?
                (formFieldObject as PdfFormFieldBaseModel).borderColor as string :
                this.convertRgbToHex((formFieldObject as IFormField).borderColor as unknown as { r: number; g: number; b: number}),
            pageIndex: !isNullOrUndefined(formFieldObject.pageNumber) ? formFieldObject.pageNumber - 1 : formFieldObject.pageIndex,
            insertSpaces: (formFieldObject as PdfFormFieldBaseModel).insertSpaces,
            isTransparent: (formFieldObject as PdfFormFieldBaseModel).isTransparent ?
                (formFieldObject as PdfFormFieldBaseModel).isTransparent : false,
            options: (formFieldObject as IFormField).option ? (formFieldObject as IFormField).option :
                (formFieldObject as PdfFormFieldBaseModel).options, pageNumber: (formFieldObject as PdfFormFieldBaseModel).pageNumber,
            rotateAngle: !isNullOrUndefined((formFieldObject as PdfFormFieldBaseModel).rotateAngle) ?
                (formFieldObject as PdfFormFieldBaseModel).rotateAngle : (formFieldObject as IFormField).rotation as number,
            selectedIndex: (formFieldObject as PdfFormFieldBaseModel).selectedIndex,
            signatureIndicatorSettings: (formFieldObject as PdfFormFieldBaseModel).signatureIndicatorSettings,
            signatureType: (formFieldObject as PdfFormFieldBaseModel).signatureType as unknown as SignatureType[],
            zIndex: (formFieldObject as PdfFormFieldBaseModel).zIndex,
            customData: (formFieldObject as PdfFormFieldBaseModel).customData,
            isUnisonSelected: (formFieldObject as PdfFormFieldBaseModel).isUnisonSelected
        };
        this.applyButtonCollectionExtras(formField, formFieldObject);
        this.applyBarcodeCollectionExtras(formField, formFieldObject);
        let collectionIndex: number = this.pdfViewer.formFieldCollections.findIndex((el: FormFieldModel) => el.id === formField.id);
        if (collectionIndex < 0 && formField.id) {
            const prefix: string = formField.id.split('_')[0];
            collectionIndex = this.pdfViewer.formFieldCollections.findIndex((el: FormFieldModel) => el.id ===
            prefix);
        }
        if (collectionIndex > -1) {
            this.pdfViewer.formFieldCollections[collectionIndex as number] = formField;
        }
    }

    /**
     * Maps internal drawing annotation type to public FormFieldType (Button → ButtonField).
     *
     * @param {string} annotationType - internal formFieldAnnotationType
     * @returns {FormFieldType} public form field type
     */
    private getPublicFormFieldType(annotationType: string): FormFieldType {
        if (annotationType === 'Button') {
            return 'ButtonField';
        }
        if (annotationType === 'BarcodeField') {
            return 'Barcode';
        }
        return annotationType as FormFieldType;
    }

    /**
     * Copies button-only collection properties (actions) onto FormFieldModel.
     *
     * @param {FormFieldModel} formField - collection entry
     * @param {PdfFormFieldBaseModel} node - drawing / designer model
     * @returns {void}
     */
    private applyButtonCollectionExtras(formField: FormFieldModel, node: PdfFormFieldBaseModel): void {
        if (formField.type !== 'ButtonField' && node.formFieldAnnotationType !== 'Button') {
            return;
        }
        formField.actions = !isNullOrUndefined(node.actions) ? node.actions : formField.actions;
    }

    private applyBarcodeCollectionExtras(formField: FormFieldModel, node: PdfFormFieldBaseModel): void {
        if (formField.type !== 'Barcode' && node.formFieldAnnotationType !== 'BarcodeField') {
            return;
        }
        formField.symbology = !isNullOrUndefined(node.symbology) ? node.symbology as BarcodeSymbology : formField.symbology;
        formField.xDimension = !isNullOrUndefined(node.xDimension) ? node.xDimension : formField.xDimension;
        formField.errorCorrectionLevel = !isNullOrUndefined(node.errorCorrectionLevel) ?
            node.errorCorrectionLevel as Pdf417ErrorCorrectionLevel | QRErrorCorrectionLevel : formField.errorCorrectionLevel;
        formField.valueFormat = !isNullOrUndefined(node.valueFormat) ? node.valueFormat as BarcodeValueFormat : formField.valueFormat;
        formField.fields = !isNullOrUndefined(node.fields) ? node.fields : formField.fields;
        formField.includeFieldNames = !isNullOrUndefined(node.includeFieldNames) ? node.includeFieldNames : formField.includeFieldNames;
        formField.compressData = !isNullOrUndefined(node.compressData) ? node.compressData : formField.compressData;
        formField.customValue = !isNullOrUndefined(node.customValue) ? node.customValue : formField.customValue;
        formField.caption = !isNullOrUndefined(node.caption) ? node.caption : formField.caption;
    }

    /**
     * Get the Hex value from the RGB value.
     *
     * @param {any} color - It describes about the color
     * @deprecated - This API is obsolete. Use `convertRgbToHex` instead.
     * @returns {void}
     */
    public getRgbToHex(color: any): string {
        return ('#' + this.hex(color.r) + this.hex(color.g) + this.hex(color.b));
    }

    /**
     * Get the Hex value from the RGB value.
     *
     * @param {string} color - It describes about the color
     * @returns {void}
     */
    public convertRgbToHex(color: { r: number; g: number; b: number }): string {
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
            this.updateDropDownListDataSource(selectedItem, dropdownElement as HTMLElement);
            selectedItem.selectedIndex = [];
            if (index > -1) {
                (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).option = selectedItem.options;
                (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                IFormField).option = selectedItem.options;
                if (!isNullOrUndefined(selectedItem.options) && selectedItem.options.length > 0) {
                    if (formFieldsData[parseInt(index.toString(), 10)] &&
                        formFieldsData[parseInt(index.toString(), 10)].FormField.value) {
                        const selectedIndex: number = selectedItem.options.findIndex((x: ItemModel) =>
                            x.itemValue === formFieldsData[parseInt(index.toString(), 10)].FormField.value);
                        selectedItem.selectedIndex.push(selectedIndex);
                    } else {
                        selectedItem.selectedIndex.push(0);
                    }
                }
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).options = selectedItem.options;
            if (selectedItem.formFieldAnnotationType === 'DropdownList') {
                for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                    const formField: PdfFormFieldBaseModel =
                        this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
                    if ((formField.formFieldAnnotationType === 'DropdownList') && formField.name === selectedItem.name &&
                        formField.id !== selectedItem.id) {
                        formField.options = selectedItem.options;
                        (this.pdfViewer.nameTable[formField.id.split('_')[0]] as PdfFormFieldBaseModel).options = selectedItem.options;
                        const groupedFieldIndex: number = this.getFormFiledIndex(formField.id.split('_')[0]);
                        if (groupedFieldIndex > -1) {
                            (formFieldsData[parseInt(groupedFieldIndex.toString(), 10)].FormField as
                            IFormField).option = selectedItem.options;
                            (this.pdfViewerBase.formFieldCollection[parseInt(groupedFieldIndex.toString(), 10)
                            ].FormField as IFormField).option = selectedItem.options;
                        }
                        const groupedElement: Element = document.getElementById(formField.id + '_content_html_element');
                        if (groupedElement && groupedElement.firstElementChild && groupedElement.firstElementChild.firstElementChild) {
                            this.updateDropDownListDataSource(formField, groupedElement.firstElementChild.firstElementChild as HTMLElement);
                        }
                    }
                }
            }
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
            const previousOptions: ItemModel[] = JSON.parse(JSON.stringify(selectedItem.options || []));
            selectedItem.options = this.createDropdownDataSource(selectedItem);
            this.updateDropDownListDataSource(selectedItem, dropdownElement as HTMLElement);
            selectedItem.selectedIndex = [];
            if (index > -1) {
                (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).option = selectedItem.options;
                (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                IFormField).option = selectedItem.options;
                if (!isNullOrUndefined(selectedItem.options) && selectedItem.options.length > 0) {
                    if (formFieldsData[parseInt(index.toString(), 10)] && formFieldsData[parseInt(index.toString(), 10)].FormField.value) {
                        selectedItem.selectedIndex.push(selectedItem.options.findIndex(function (x: ItemModel): boolean {
                            return x.itemValue === formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                        }));
                    } else {
                        selectedItem.selectedIndex.push(0);
                    }
                }
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).options = selectedItem.options;
            if ((this.formFieldName && this.formFieldName.value) || isUndoRedo) {
                this.updateNamePropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData, previousOptions);
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
            if (!isNullOrUndefined(this.formFieldBorderWidth) || isUndoRedo) {
                this.updateBorderThicknessPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldReadOnly || isUndoRedo) {
                this.updateIsReadOnlyPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }
            if (this.formFieldRequired || isUndoRedo) {
                this.updateIsRequiredPropertyChange(selectedItem, dropdownElement, isUndoRedo, index, formFieldsData);
            }

            const groupedListBoxes: IFormFieldCollection[] = formFieldsData.filter(function (fieldData: IFormFieldCollection): boolean {
                return fieldData && fieldData.FormField &&
                    (fieldData.FormField as IFormField).formFieldAnnotationType === 'ListBox' &&
                    fieldData.FormField.name === selectedItem.name &&
                    fieldData.FormField.id !== selectedItem.id;
            });

            for (let i: number = 0; i < groupedListBoxes.length; i++) {
                const groupedField: IFormFieldCollection = groupedListBoxes[parseInt(i.toString(), 10)];
                (groupedField.FormField as IFormField).option = selectedItem.options;

                const groupedIdBase: string = (groupedField.FormField.id || '').split('_')[0];
                const groupedIndex: number = this.getFormFiledIndex(groupedIdBase);

                if (groupedIndex > -1) {
                    (this.pdfViewerBase.formFieldCollection[groupedIndex as number].FormField as IFormField).option = selectedItem.options;
                }

                if (this.pdfViewer.nameTable && this.pdfViewer.nameTable[groupedIdBase as string]) {
                    (this.pdfViewer.nameTable[groupedIdBase as string] as PdfFormFieldBaseModel).options = selectedItem.options;
                }

                const groupedDropdownRoot: HTMLElement = document.getElementById(groupedField.FormField.id + '_html_element');

                if (groupedDropdownRoot) {
                    const groupedSelect: Element =
                        groupedDropdownRoot.querySelector('select.e-pv-formfield-listbox, select.e-pv-formfield-dropdown') ||
                        (groupedDropdownRoot.firstElementChild &&
                            groupedDropdownRoot.firstElementChild.firstElementChild);

                    if (groupedSelect) {
                        this.updateDropDownListDataSource(selectedItem, groupedSelect as HTMLElement);
                    }
                }
            }

            if (!isUndoRedo) {
                this.pdfViewerBase.setItemInSessionStorage(formFieldsData, '_formDesigner');
            }

            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).options = selectedItem.options;
            if (isUndoRedo) {
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
    }

    private updateDropDownListDataSource(selectedItem: PdfFormFieldBaseModel, dropdownElement: HTMLElement): void {
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
                const name: string = (liItem.textContent || '').trim();
                const value: string = (liItem.getAttribute('data-value') || name).trim();
                this.formFieldListItemDataSource.push({ itemName: name, itemValue: value });
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
            const formField: PdfFormFieldBaseModel = this.pdfViewer.nameTable[selectedItem.id.split('_')[0]];
            const point2: PointModel = cornersPointsBeforeRotation(formField.wrapper.children[0]).topLeft;
            this.updateFormDesignerFieldInSessionStorage(point2, formField.wrapper.children[0] as DiagramHtmlElement,
                                                         formField.formFieldAnnotationType, formField);
        }
    }

    /**
     * Applies Properties-dialog (and undo/redo) updates for Button fields in one place:
     * general designer properties plus Actions/GoTo settings, keeping model, UI, nameTable,
     * formFieldCollections, and session-backed collections in sync.
     *
     * @param {PdfFormFieldBaseModel} selectedItem - Button field being updated
     * @param {boolean} isUndoRedo - When true, property path uses model values (undo/redo)
     * @private
     * @returns {void}
     */
    public updateButtonFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        this.updateTextboxFormDesignerProperties(selectedItem, isUndoRedo);
        // Preserve focusability after property refresh (does not alter global Tab navigation logic).
        try {
            const htmlHost: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element') ||
                document.getElementById(selectedItem.id + '_html_element');
            const buttonInput: HTMLInputElement = htmlHost &&
                htmlHost.querySelector('input[type="button"], input.e-pv-buttonItem') as HTMLInputElement;
            if (buttonInput && (buttonInput.tabIndex < 0 || buttonInput.tabIndex === undefined)) {
                buttonInput.tabIndex = this.formFieldIndex;
            }
        } catch (e) {
            // Property panel may run before DOM attach; create path still sets tabIndex.
        }
        if (!isUndoRedo) {
            this.applyButtonActionSettingsToField(selectedItem);
        } else if (selectedItem && selectedItem.actions) {
            const nameKey: string = selectedItem.id ? selectedItem.id.split('_')[0] : '';
            if (nameKey && this.pdfViewer.nameTable[nameKey as string]) {
                (this.pdfViewer.nameTable[nameKey as string] as PdfFormFieldBaseModel).actions = selectedItem.actions;
            }
            const collectionIndex: number = this.pdfViewer.formFieldCollections.findIndex(
                (field: FormFieldModel) => field.id === nameKey || field.id === selectedItem.id);
            if (collectionIndex > -1) {
                this.pdfViewer.formFieldCollections[collectionIndex as number].actions = selectedItem.actions;
            }
        }
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @private
     * @returns {void}
     */
    public updateTextboxFormDesignerProperties(selectedItem: PdfFormFieldBaseModel, isUndoRedo?: boolean): void {
        let inputElement: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild as HTMLElement;
        let isMaxLengthChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
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
            // DateTime text lives on the inner input; styling the composite wrapper is not visible.
            if (selectedItem.isDateField) {
                inputElement = this.getDateTimeTextAppearanceTarget(inputElement);
            }
            if ((this.isAddFormFieldProgrammatically ? selectedItem.fontFamily : this.formFieldFontFamily &&
                 this.formFieldFontFamily.value) || isUndoRedo) {
                this.updateFontFamilyPropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            if ((this.isAddFormFieldProgrammatically ? selectedItem.fontSize : this.formFieldFontSize &&
                this.formFieldFontSize.value) || isUndoRedo) {
                this.updateFontSizePropertyChange(selectedItem, inputElement, isUndoRedo, index, formFieldsData);
            }
            // Format tab: persist the Format Type selection (Number / Percentage / Special / Date / Time / None)
            // for non-multiline textboxes. The dialog has a Format Type dropdown whenever the
            // tab is shown; the legacy DateTime path runs in addition when the field is a date field.
            if (!selectedItem.isMultiline && selectedItem.formFieldAnnotationType === 'Textbox'
                && this.formFieldFormatType && !isUndoRedo) {
                const formatApplied: boolean = this.applyFormatFromDialog(selectedItem, index, formFieldsData);
                if (!formatApplied) {
                    return;
                }
            }
            // DateTime Format tab: write type + actions.format and reformat the existing value.
            if (selectedItem.isDateField && !isUndoRedo) {
                // Capture the prior format pattern BEFORE applyDateTimeFormatFromDialog
                // overwrites selectedItem.actions, so we can interpret the existing
                // display value with the pattern the user typed it under.
                const priorValue: string = selectedItem.value;
                const priorPattern: string = this.parseDateTimeFormatPattern(selectedItem);
                const applied: boolean = this.applyDateTimeFormatFromDialog(selectedItem, index, formFieldsData);
                if (!applied) {
                    // Custom format validation failed — keep the dialog open, skip
                    // the reformat pass so an invalid pattern is never persisted.
                    return;
                }
                // Reformat the displayed value with the newly selected Type/Format so it
                // reflects the change immediately (no further picker interaction required).
                // Strategy: parse the prior display value using the prior pattern (NOT
                // an ISO hint — the value was user-visible text in the prior format,
                // e.g. "15-Jan-26", "January 15, 2026", "1/15/26 2:30 PM"), then emit it
                // in the new pattern. Fall back to the existing raw value if parsing
                // fails so user-typed values are not destroyed when the new pattern is
                // incompatible.
                if (typeof priorValue === 'string' && priorValue.length > 0) {
                    const newPattern: string = this.parseDateTimeFormatPattern(selectedItem);
                    const parsedPrior: Date = this.parseDateTimeTextToDate(priorValue, priorPattern);
                    let reformatted: string = '';
                    if (parsedPrior && !isNaN(parsedPrior.getTime()) && newPattern) {
                        reformatted = this.applyDateTimePattern(parsedPrior, newPattern);
                    }
                    if (reformatted && reformatted !== priorValue) {
                        selectedItem.value = reformatted;
                        const textInput: HTMLInputElement = document.getElementById(selectedItem.id) as HTMLInputElement;
                        if (textInput && ((textInput.classList && textInput.classList.contains('e-pv-formfield-input')) ||
                            (textInput.parentElement && textInput.parentElement.classList &&
                                textInput.parentElement.classList.contains('e-pv-datetime-composite')))) {
                            textInput.value = reformatted;
                        }
                        if (index > -1 && formFieldsData && formFieldsData[parseInt(index.toString(), 10)] &&
                            formFieldsData[parseInt(index.toString(), 10)].FormField) {
                            formFieldsData[parseInt(index.toString(), 10)].FormField.value = reformatted;
                        }
                        const baseCollection: IFormFieldCollection = this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)];
                        if (baseCollection && baseCollection.FormField) {
                            baseCollection.FormField.value = reformatted;
                        }
                        const nameKey: string = selectedItem.id ? selectedItem.id.split('_')[0] : '';
                        // eslint-disable-next-line security/detect-object-injection
                        if (nameKey && this.pdfViewer.nameTable[nameKey]) {
                            // eslint-disable-next-line security/detect-object-injection
                            (this.pdfViewer.nameTable[nameKey] as PdfFormFieldBaseModel).value = reformatted;
                        }
                    }
                }
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
                        (inputElement as HTMLInputElement).maxLength = selectedItem.maxLength;
                    } else {
                        (inputElement as HTMLInputElement).maxLength = maxLength;
                        selectedItem.maxLength = this.maxLengthItem.value;
                    }
                    const currentValue: string = selectedItem.value;
                    if ((inputElement as HTMLInputElement).maxLength > 0 && currentValue
                        && currentValue.length > (inputElement as HTMLInputElement).maxLength) {
                        const newValue: string = currentValue.substring(0, (inputElement as HTMLInputElement).maxLength);
                        (inputElement as HTMLInputElement).value = newValue;
                        selectedItem.value = newValue;
                    }
                }
                if (index > -1) {
                    formFieldsData[parseInt(index.toString(), 10)].FormField.maxLength = selectedItem.maxLength;
                    this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.maxLength = selectedItem.maxLength;
                }
                (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).maxLength = selectedItem.maxLength;
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
                const visibleItem: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.firstElementChild as HTMLElement;
                visibleItem.style.visibility = selectedItem.visibility;
            }
        }
        this.updateFormFieldCollections(selectedItem);
        if (isUndoRedo)
        {this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner'); }
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {Element} element - It describes about the element
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @param {number} index - It describes about the index
     * @param {IFormFieldCollection[]} formFieldsData - It describes about the form fields data
     * @private
     * @returns {void}
     */
    public updateIsCheckedPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                         formFieldsData: IFormFieldCollection[]): void {
        if (this.pdfViewer.designerMode || isUndoRedo) {
            let isValueChanged: boolean = false;
            let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
            number[] | object;
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
                formFieldsData[parseInt(index.toString(), 10)].FormField.isSelected = selectedItem.isChecked;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isChecked = selectedItem.isChecked;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isSelected = selectedItem.isChecked;
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isChecked = selectedItem.isChecked;
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isSelected = selectedItem.isChecked;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, isValueChanged, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, oldValue, newValue);
            }
            if (isUndoRedo) {
                const groupedCheckbox: IFormFieldCollection[] = formFieldsData.filter((sameNameCheckboxField: IFormFieldCollection) => (sameNameCheckboxField.FormField.name === selectedItem.name) && (sameNameCheckboxField.FormField as PdfFormFieldBaseModel).formFieldAnnotationType === 'Checkbox' && sameNameCheckboxField.FormField.value === selectedItem.value);
                for (let i: number = 0; i < groupedCheckbox.length; i++) {
                    const currentFieldData: IFormFieldCollection = groupedCheckbox[parseInt(i.toString(), 10)];
                    const currentChecked: boolean = selectedItem.isChecked;
                    (this.pdfViewer.nameTable[currentFieldData.Key.split('_')[0]] as PdfFormFieldBaseModel).isChecked = currentChecked;
                    (this.pdfViewer.nameTable[currentFieldData.Key.split('_')[0]] as PdfFormFieldBaseModel).isSelected = currentChecked;
                    currentFieldData.FormField.isChecked = currentChecked;
                    currentFieldData.FormField.isSelected = currentChecked;
                    const FormFieldIndex: number = formFieldsData.findIndex(function (f: IFormFieldCollection): boolean {
                        return f.Key === currentFieldData.Key;
                    });
                    if (FormFieldIndex > -1) {
                        const collectionItem: IFormFieldCollection = this.pdfViewerBase.formFieldCollection.find(function (
                            col: IFormFieldCollection): boolean {
                            return col && col.Key === currentFieldData.Key;
                        });
                        if (collectionItem && collectionItem.FormField) {
                            collectionItem.FormField.isChecked = currentChecked;
                            collectionItem.FormField.isSelected = currentChecked;
                        }
                    }
                    const currentDivCheckbox: HTMLElement = document.getElementById(currentFieldData.Key.split('_')[0] + '_input');
                    if (currentDivCheckbox) {
                        const currentCheckbox: Element = currentDivCheckbox.firstElementChild;
                        if (currentChecked) {
                            if (currentCheckbox.classList.contains('e-pv-cb-uncheck')) {
                                currentCheckbox.classList.remove('e-pv-cb-uncheck');
                            }
                            currentCheckbox.classList.add('e-pv-cb-check');
                            const tickSvg: HTMLElement | null = currentCheckbox.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null;
                            if (tickSvg) {
                                tickSvg.style.display = 'block';
                            }
                        } else {
                            if (currentCheckbox.classList.contains('e-pv-cb-check')) {
                                currentCheckbox.classList.remove('e-pv-cb-check');
                            }
                            currentCheckbox.classList.add('e-pv-cb-uncheck');
                            const tickSvg: HTMLElement | null = currentCheckbox.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null;
                            if (tickSvg) {
                                tickSvg.style.display = 'none';
                            }
                        }
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                this.updateFormFieldSessions(selectedItem);
            }
            else {
                const groupedCheckbox: IFormFieldCollection[] = formFieldsData.filter((sameNameCheckboxField: IFormFieldCollection) => (sameNameCheckboxField.FormField.name === selectedItem.name) && (sameNameCheckboxField.FormField as PdfFormFieldBaseModel).formFieldAnnotationType === 'Checkbox');
                for (let i: number = 0; i < groupedCheckbox.length; i++) {
                    const currentFieldData: IFormFieldCollection = groupedCheckbox[parseInt(i.toString(), 10)];
                    let currentChecked: boolean = selectedItem.isChecked;
                    if (selectedItem.isChecked && selectedItem.value !== currentFieldData.FormField.value) {
                        currentChecked = false;
                    }
                    (this.pdfViewer.nameTable[currentFieldData.Key.split('_')[0]] as PdfFormFieldBaseModel).isChecked = currentChecked;
                    (this.pdfViewer.nameTable[currentFieldData.Key.split('_')[0]] as PdfFormFieldBaseModel).isSelected = currentChecked;
                    currentFieldData.FormField.isChecked = currentChecked;
                    currentFieldData.FormField.isSelected = currentChecked;
                    const FormFieldIndex: number = formFieldsData.findIndex(function (f: IFormFieldCollection): boolean {
                        return f.Key === currentFieldData.Key;
                    });
                    if (FormFieldIndex > -1) {
                        const collectionItem: IFormFieldCollection = this.pdfViewerBase.formFieldCollection.find(function (
                            col: IFormFieldCollection): boolean {
                            return col && col.Key === currentFieldData.Key;
                        });
                        if (collectionItem && collectionItem.FormField) {
                            collectionItem.FormField.isChecked = currentChecked;
                            collectionItem.FormField.isSelected = currentChecked;
                        }
                    }
                    const currentDivCheckbox: HTMLElement = document.getElementById(currentFieldData.Key.split('_')[0] + '_input');
                    if (currentDivCheckbox) {
                        const currentCheckbox: Element = currentDivCheckbox.firstElementChild;
                        if (currentChecked) {
                            if (currentCheckbox.classList.contains('e-pv-cb-uncheck')) {
                                currentCheckbox.classList.remove('e-pv-cb-uncheck');
                            }
                            currentCheckbox.classList.add('e-pv-cb-check');
                            const tickSvg: HTMLElement | null = currentCheckbox.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null;
                            if (tickSvg) {
                                tickSvg.style.display = 'block';
                            }
                        } else {
                            if (currentCheckbox.classList.contains('e-pv-cb-check')) {
                                currentCheckbox.classList.remove('e-pv-cb-check');
                            }
                            currentCheckbox.classList.add('e-pv-cb-uncheck');
                            const tickSvg: HTMLElement | null = currentCheckbox.querySelector('.e-pv-checkbox-tick-svg') as HTMLElement | null;
                            if (tickSvg) {
                                tickSvg.style.display = 'none';
                            }
                        }
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
                this.updateFormFieldSessions(selectedItem);
            }
        }
    }
    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {Element} element - It describes about the element
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @param {number} index - It describes about the index
     * @param {IFormFieldCollection[]} formFieldsData - It describes about the form fields data
     * @private
     * @returns {void}
     */
    public updateIsSelectedPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                          formFieldsData: IFormFieldCollection[]): void {
        if (this.pdfViewer.designerMode || isUndoRedo) {
            let isValueChanged: boolean = false;
            let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
            number[] | object;
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
                for (let i: number = 0; i < (formFieldsData[parseInt(index.toString(), 10)].FormField as
                IFormField).radiobuttonItem.length; i++) {
                    if ((formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0] === selectedItem.id.split('_')[0]) {
                        (formFieldsData[parseInt(index.toString(), 10)].FormField as
                        IFormField).radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                        (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                        IFormField).radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                    }
                }
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isSelected = selectedItem.isSelected;
            if (isValueChanged) {
                this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, isValueChanged, false, false,
                                                      false, false, false, false, false, false, false, false,
                                                      false, false, false, false, false, oldValue, newValue);
            }
            (element as HTMLInputElement).checked = selectedItem.isSelected;
        }
        if (!this.pdfViewer.designerMode || isUndoRedo) {
            (element as HTMLInputElement).checked = selectedItem.isSelected;
            if (index > -1) {
                formFieldsData[parseInt(index.toString(), 10)].FormField.isSelected = selectedItem.isSelected;
                this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.isSelected = selectedItem.isSelected;
                for (let i: number = 0; i < (formFieldsData[parseInt(index.toString(), 10)].FormField as
                IFormField).radiobuttonItem.length; i++) {
                    if ((formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0] === selectedItem.id.split('_')[0]) {
                        (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).
                            radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                        (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                        IFormField).radiobuttonItem[parseInt(i.toString(), 10)].isSelected = selectedItem.isSelected;
                    }
                }
            }
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isSelected = selectedItem.isSelected;
        }
    }

    /**
     * @param {PdfFormFieldBaseModel} selectedItem - It describes about the selected item
     * @param {Element} element - It describes about the element
     * @param {boolean} isUndoRedo - It describes about the isUndoRedo
     * @param {number} index - It describes about the index
     * @param {IFormFieldCollection[]} formFieldsData - It describes about the form fields data
     * @param {boolean} updateValue - It describes about the update value
     * @private
     * @returns {void}
     */
    public updateValuePropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                     formFieldsData: IFormFieldCollection[],
                                     updateValue?: boolean): void {
        let isValueChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
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
            (element as HTMLInputElement).value = selectedItem.value;
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
                    (element as HTMLInputElement).value = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                } else {
                    (element as HTMLInputElement).value = this.formFieldValue ? this.formFieldValue.value : selectedItem.value;
                }
            }
            // EJ2-856550 - to get select item while add multiline programatically.
            else{
                if (selectedItem.formFieldAnnotationType === 'DropdownList') {
                    selectedItem.value = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                }
                if (selectedItem.formFieldAnnotationType === 'DropdownList') {
                    (element as HTMLInputElement).value = formFieldsData[parseInt(index.toString(), 10)].FormField.value;
                } else {
                    (element as HTMLInputElement).value = selectedItem.value;
                }
            }
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.value = selectedItem.value;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.value = selectedItem.value;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).value = selectedItem.value;
        if (isUndoRedo && selectedItem.name) {
            this.refreshBarcodeGlyphsForLinkedField(selectedItem.name);
        }
        if (isValueChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, isValueChanged, false, false,
                                                  false, false, false, false, false, false, false, false, false,
                                                  false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontStylePropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                          formFieldsData: IFormFieldCollection[]): void {
        let isFontStyleChanged: boolean = false;
        let oldValue: string = '';
        let newValue: string = '';
        const result: [boolean, string, string] = this.updateFontStyle((element as HTMLElement), selectedItem, isUndoRedo, index,
                                                                       formFieldsData);
        isFontStyleChanged = result[0];
        oldValue = result[1];
        newValue = result[2];
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.fontStyle = selectedItem.fontStyle;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.fontStyle = selectedItem.fontStyle;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).fontStyle = selectedItem.fontStyle;
        if (isFontStyleChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  isFontStyleChanged, false, false, false, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBorderThicknessPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                                formFieldsData: IFormFieldCollection[]): void {
        let isBorderWidthChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
        const borderWidth: number = parseInt(this.formFieldBorderWidth, 10);
        if (selectedItem.thickness !== borderWidth) {
            isBorderWidthChanged = true;
            oldValue = selectedItem.thickness;
            newValue = borderWidth ? borderWidth : selectedItem.thickness;
        }
        if (isUndoRedo) {
            (element as HTMLElement).style.borderWidth = selectedItem.thickness.toString();
        } else {
            (element as HTMLElement).style.borderWidth = this.formFieldBorderWidth ? this.formFieldBorderWidth + 'px' : selectedItem.thickness + 'px';
            selectedItem.thickness = borderWidth;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.thickness = selectedItem.thickness;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.thickness = selectedItem.thickness;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).thickness = selectedItem.thickness;
        if (isBorderWidthChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, isBorderWidthChanged, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBorderColorPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                            formFieldsData: IFormFieldCollection[]): void {
        let isBorderColorChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
        if (selectedItem.borderColor !== this.borderColorValue) {
            isBorderColorChanged = true;
            oldValue = selectedItem.borderColor;
            newValue = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
        }
        if (this.pdfViewer.enableHtmlSanitizer && this.borderColorValue){
            this.borderColorValue = SanitizeHtmlHelper.sanitize(this.borderColorValue);
        }
        if (isUndoRedo) {
            (element as HTMLInputElement).style.borderColor = selectedItem.borderColor as string;
        } else {
            (element as HTMLInputElement).style.borderColor = this.borderColorValue ? this.borderColorValue as string :
                selectedItem.borderColor as string;
            selectedItem.borderColor = this.borderColorValue ? this.borderColorValue : selectedItem.borderColor;
        }
        if (selectedItem.formFieldAnnotationType === 'RadioButton')
        {(element as HTMLInputElement).parentElement.style.boxShadow = this.borderColorValue + ' 0px 0px 0px ' + selectedItem.thickness + 'px'; }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.borderColor = this.getRgbCode(
                selectedItem.borderColor as string) as unknown as string;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.borderColor =
            this.getRgbCode(selectedItem.borderColor as string) as unknown as string;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).borderColor = selectedItem.borderColor;
        if (isBorderColorChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, isBorderColorChanged, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateBackgroundColorPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                                formFieldsData: IFormFieldCollection[]): void {
        let isBackgroundColorChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
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
            {(element as HTMLInputElement).parentElement.style.background = selectedItem.backgroundColor as string; }
            else
            {(element as HTMLInputElement).style.background = selectedItem.backgroundColor as string; }
        } else {
            if (selectedItem.formFieldAnnotationType === 'RadioButton')
            {(element as HTMLInputElement).parentElement.style.background = this.backgroundColorValue ?
                this.backgroundColorValue as string : selectedItem.backgroundColor as string; }
            else
            {(element as HTMLInputElement).style.background = this.backgroundColorValue ? this.backgroundColorValue as string :
                selectedItem.backgroundColor as string; }
            selectedItem.backgroundColor = this.backgroundColorValue ? this.backgroundColorValue : selectedItem.backgroundColor;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.backgroundColor = this.getRgbCode(
                selectedItem.backgroundColor as string) as unknown as string;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.backgroundColor =
            this.getRgbCode(selectedItem.backgroundColor as string) as unknown as string;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).backgroundColor = selectedItem.backgroundColor;
        if (isBackgroundColorChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, isBackgroundColorChanged, false, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateColorPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                      formFieldsData: IFormFieldCollection[]): void {
        let isColorChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
        if (selectedItem.color !== this.fontColorValue) {
            isColorChanged = true;
            oldValue = selectedItem.color;
            newValue = this.fontColorValue ? this.fontColorValue : selectedItem.color;
        }
        if (this.pdfViewer.enableHtmlSanitizer && this.fontColorValue){
            this.fontColorValue = SanitizeHtmlHelper.sanitize(this.fontColorValue);
        }
        if (isUndoRedo) {
            (element as HTMLInputElement).style.color = selectedItem.color;
        } else {
            (element as HTMLInputElement).style.color = this.fontColorValue ? this.fontColorValue : selectedItem.color;
            selectedItem.color = this.fontColorValue ? this.fontColorValue : selectedItem.color;
        }
        if (index > -1) {
            (formFieldsData[parseInt(index.toString(), 10)].FormField as PdfFormFieldBaseModel).color = this.getRgbCode(
                selectedItem.color) as unknown as string;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.color = this.getRgbCode(
                selectedItem.color) as unknown as string;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).color = selectedItem.color;
        if (isColorChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, isColorChanged, false, false, false, false,
                                                  false, false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateAlignmentPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                          formFieldsData: IFormFieldCollection[]): void {
        let isAlignmentChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
        if (selectedItem.alignment !== this.formFieldAlign) {
            isAlignmentChanged = true;
            oldValue = selectedItem.alignment;
            newValue = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
        }
        if (isUndoRedo) {
            (element as HTMLInputElement).style.textAlign = selectedItem.alignment;
            if ((selectedItem.formFieldAnnotationType === 'ListBox' || selectedItem.formFieldAnnotationType === 'DropdownList') && element.children.length > 0) {
                (element as HTMLInputElement).style.textAlignLast = selectedItem.alignment;
                for (let i: number = 0; i < element.children.length; i++) {
                    const dropDownChild: HTMLElement = element.children[parseInt(i.toString(), 10)] as HTMLElement;
                    dropDownChild.style.textAlignLast = selectedItem.alignment;
                    dropDownChild.style.textAlign = selectedItem.alignment;
                }
            }
        } else {
            (element as HTMLInputElement).style.textAlign = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
            selectedItem.alignment = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
            if ((selectedItem.formFieldAnnotationType === 'ListBox' || selectedItem.formFieldAnnotationType === 'DropdownList') && element.children.length > 0) {
                (element as HTMLInputElement).style.textAlignLast = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                for (let i: number = 0; i < element.children.length; i++) {
                    const dropDownChild: HTMLElement = element.children[parseInt(i.toString(), 10)] as HTMLElement;
                    dropDownChild.style.textAlignLast = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                    dropDownChild.style.textAlign = this.formFieldAlign ? this.formFieldAlign : selectedItem.alignment;
                }
            }
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.alignment = selectedItem.alignment;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.alignment = selectedItem.alignment;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).alignment = selectedItem.alignment;
        if (isAlignmentChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, isAlignmentChanged, false,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontSizePropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                         formFieldsData: IFormFieldCollection[]): void {
        let isFontSizeChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
        const zoomValue: number = this.pdfViewerBase.getZoomFactor();
        const fontSize: number = this.formFieldFontSize ? parseInt(this.formFieldFontSize.value.toString(), 10) :
            (selectedItem && selectedItem.fontSize) ? parseInt(selectedItem.fontSize.toString(), 10) : 10;
        const selectedFontSize: number = selectedItem.fontSize;
        if (selectedFontSize !== fontSize) {
            isFontSizeChanged = true;
            oldValue = selectedItem.fontSize;
            newValue = fontSize;
        }
        if (isUndoRedo) {
            (element as HTMLInputElement).style.fontSize = (selectedItem.fontSize * zoomValue) + 'px'.toString();
        } else {
            selectedItem.fontSize = fontSize;
            (element as HTMLInputElement).style.fontSize = this.formFieldFontSize ? (parseInt(this.formFieldFontSize.value.toString(), 10)  + 'px') : parseInt(selectedItem.fontSize.toString(), 10) + 'px';
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.fontSize = selectedItem.fontSize;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.fontSize = selectedItem.fontSize;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).fontSize = selectedItem.fontSize;
        if (isFontSizeChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, isFontSizeChanged,
                                                  false, false, false, false, false, false, false,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateFontFamilyPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                           formFieldsData: IFormFieldCollection[]): void {
        let isFontFamilyChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
        let fontFamily: string = this.pdfViewer.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(this.formFieldFontFamily ? this.formFieldFontFamily.value.toString() : '') : (this.formFieldFontFamily ? this.formFieldFontFamily.value.toString() : '');
        if (selectedItem.fontFamily !== fontFamily) {
            isFontFamilyChanged = true;
            oldValue = selectedItem.fontFamily;
            newValue = fontFamily;
        }
        if (isUndoRedo) {
            (element as HTMLInputElement).style.fontFamily = selectedItem.fontFamily;
        }
        // EJ2-856550 - to ge selectItem fontfamily when font family empty string in add multiline programattically.
        else if (fontFamily === '')
        {
            fontFamily = selectedItem.fontFamily;
            (element as HTMLInputElement).style.fontFamily = fontFamily;
        }
        else {
            selectedItem.fontFamily = fontFamily;
            (element as HTMLInputElement).style.fontFamily = fontFamily;
        }
        if (index > -1) {
            formFieldsData[parseInt(index.toString(), 10)].FormField.fontFamily = selectedItem.fontFamily;
            this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField.fontFamily = selectedItem.fontFamily;
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).fontFamily = selectedItem.fontFamily;
        if (isFontFamilyChanged) {
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, isFontFamilyChanged, false,
                                                  false, false, false, false, false, false, false,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateVisibilityPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                           formFieldsData: IFormFieldCollection[]): void {
        let isVisibilityChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
        if (this.formFieldVisibility && (selectedItem.visibility !== this.formFieldVisibility.value)) {
            isVisibilityChanged = true;
            oldValue = selectedItem.visibility;
            newValue = this.formFieldVisibility.value;
        }
        if (!isUndoRedo) {
            selectedItem.visibility = this.formFieldVisibility.value as Visibility;
        }
        (element as HTMLInputElement).style.visibility = selectedItem.visibility;
        if (selectedItem.formFieldAnnotationType === 'RadioButton' || selectedItem.formFieldAnnotationType === 'ListBox' ||
            selectedItem.formFieldAnnotationType === 'DropdownList') {
            element.parentElement.style.visibility = selectedItem.visibility;
        }
        if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
            const signElement: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element').firstElementChild.children[1] as HTMLElement;
            signElement.style.visibility = selectedItem.visibility;
            signElement.parentElement.style.visibility = selectedItem.visibility;
            const annotation: PdfAnnotationBaseModel = this.pdfViewer.nameTable[selectedItem.id.split('_')[0] + '_content'];
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
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).visibility = selectedItem.visibility;
        if (isVisibilityChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false,
                                                  false, isVisibilityChanged, false, false, false, false, false, oldValue, newValue);
        }
    }

    private hideSignatureValue(selectedItem: PdfFormFieldBaseModel, annotation: PdfAnnotationBaseModel, index: number,
                               formFieldsData: IFormFieldCollection[]): void {
        selectedItem.wrapper.children.splice(selectedItem.wrapper.children.indexOf(annotation.wrapper.children[0]), 1);
        this.pdfViewer.remove(annotation);
        this.pdfViewer.renderDrawing();
    }

    private showSignatureValue(selectedItem: PdfFormFieldBaseModel, oldValue: string | number | boolean | string[] | number[] | object,
                               annotation: PdfAnnotationBaseModel, index: number, formFieldsData: IFormFieldCollection[]): void {
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
        (selectedItem as IFormField).signatureBound = (annotation as unknown as IFormField).signatureBound;
        if (oldValue === 'hidden') {
            this.pdfViewer.add(annotation as PdfAnnotationBase);
            selectedItem.wrapper.children.push(annotation.wrapper);
            const canvass: HTMLCanvasElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', selectedItem.pageIndex) as HTMLCanvasElement;
            this.pdfViewer.renderDrawing(canvass, selectedItem.pageIndex);
        }
        this.pdfViewer.renderDrawing();
    }

    private updateTooltipPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                        formFieldsData: IFormFieldCollection[]): void {
        let isToolTipChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
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
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).tooltip = this.formFieldTooltip.value;
        if (!isNullOrUndefined(this.formFieldTooltip.value) && this.formFieldTooltip.value !== '') {
            this.setToolTip(this.formFieldTooltip.value, selectedItem.formFieldAnnotationType === 'RadioButton' ? (element as HTMLInputElement).parentElement : element);
        }
        if (isToolTipChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false,
                                                  false, false, false, false, false, isToolTipChanged, false, oldValue, newValue);
        }
    }

    private updateNamePropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                     formFieldsData: IFormFieldCollection[],
                                     previousOptions?: ItemModel[]): void {
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
        let oldFieldName: string;
        if (index > -1) {
            let oldValue: string | number | boolean | string[] | number[] | object;
            let newValue: string | number | boolean | string[] | number[] | object;
            const optionsLength: number = selectedItem.options.length;
            oldValue = optionsLength > 1 ? selectedItem.options.slice(0, optionsLength - 1) : '';
            newValue = selectedItem.options[optionsLength - 1];
            if (((formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).formFieldAnnotationType === 'DropdownList' || (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).formFieldAnnotationType === 'ListBox') && (formFieldsData[parseInt(index.toString(), 10)].FormField.name === selectedItem.name) && (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).option.length > 0) {
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
        (element as HTMLInputElement).name = selectedItem.name;
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).name = selectedItem.name;
        if (selectedItem.formFieldAnnotationType === 'DropdownList') {
            for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
                const formField: PdfFormFieldBaseModel =
                this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
                if ((formField.formFieldAnnotationType === 'DropdownList') && formField.name === selectedItem.name && formField.id !== selectedItem.id) {
                    selectedItem.options = formField.options;
                    this.updateDropDownListDataSource(selectedItem, element as HTMLElement);
                    break;
                }
            }
        }

        if (selectedItem.formFieldAnnotationType === 'ListBox') {
            if (oldFieldName !== selectedItem.name) {
                const currentOptions: ItemModel[] = selectedItem.options || [];
                const isOptionEdited: boolean =
                    JSON.stringify(currentOptions) !== JSON.stringify(previousOptions || []);
                if (isOptionEdited) {
                    return;
                }
                const sourceField: IFormFieldCollection = formFieldsData.find(function (fieldData: IFormFieldCollection,
                                                                                        i: number): boolean {
                    return fieldData &&
                        fieldData.FormField &&
                        (fieldData.FormField as IFormField).formFieldAnnotationType === 'ListBox' &&
                        fieldData.FormField.name === selectedItem.name &&
                        fieldData.FormField.id !== selectedItem.id &&
                        (fieldData.FormField as IFormField).option &&
                        (fieldData.FormField as IFormField).option.length > 0 &&
                        i !== index;
                });

                if (sourceField) {
                    selectedItem.options = JSON.parse(JSON.stringify((sourceField.FormField as IFormField).option));
                    if (index > -1) {
                        (formFieldsData[index as number].FormField as IFormField).option = selectedItem.options;
                        (this.pdfViewerBase.formFieldCollection[index as number].FormField as IFormField).option = selectedItem.options;
                    }
                    const selectedElement: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element');

                    if (selectedElement &&
                        selectedElement.firstElementChild &&
                        selectedElement.firstElementChild.firstElementChild) {

                        this.updateDropDownListDataSource(
                            selectedItem,
                            selectedElement.firstElementChild.firstElementChild as HTMLElement
                        );
                    }

                    (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).options = selectedItem.options;

                    return;
                }
            }
            if (!selectedItem.options || selectedItem.options.length === 0) {
                const sameSource: IFormFieldCollection = formFieldsData.find(function (fieldData: IFormFieldCollection): boolean {
                    return fieldData &&
                        fieldData.FormField &&
                        (fieldData.FormField as IFormField).formFieldAnnotationType === 'ListBox' &&
                        fieldData.FormField.name === selectedItem.name &&
                        fieldData.FormField.id !== selectedItem.id &&
                        (fieldData.FormField as IFormField).option &&
                        (fieldData.FormField as IFormField).option.length > 0;
                });
                if (sameSource) {
                    selectedItem.options = JSON.parse(JSON.stringify((sameSource.FormField as IFormField).option));
                    if (index > -1) {
                        (formFieldsData[index as number].FormField as IFormField).option = selectedItem.options;
                        (this.pdfViewerBase.formFieldCollection[index as number].FormField as IFormField).option = selectedItem.options;
                    }
                    const selectedElement: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element');
                    if (selectedElement &&
                        selectedElement.firstElementChild &&
                        selectedElement.firstElementChild.firstElementChild) {
                        this.updateDropDownListDataSource(
                            selectedItem,
                            selectedElement.firstElementChild.firstElementChild as HTMLElement
                        );
                    }
                    (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).options = selectedItem.options;
                }
            }
        }
    }

    // Implemented this method to set the "ReadOnly" in the grouping elements. Task: 855079.
    private setReadOnlyProperty(selectedItem: PdfFormFieldBaseModel | IFormField, element: Element | HTMLElement): void {
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isReadonly = selectedItem.isReadonly;
        this.setReadOnlyToElement((selectedItem as PdfFormFieldBaseModel), element, selectedItem.isReadonly);
        this.setReadOnlyToFormField((selectedItem as PdfFormFieldBaseModel), selectedItem.isReadonly);
    }

    private updateIsReadOnlyPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                           formFieldsData: IFormFieldCollection[]): void {
        let isReadOnlyChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
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
            (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).isReadonly = selectedItem.isReadonly;
            (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).isReadonly = selectedItem.
                isReadonly;
            if ((this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem) {
                for (let i: number = 0; i < (this.pdfViewerBase.
                    formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem.length; i++) {
                    (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                    IFormField).radiobuttonItem[parseInt(i.toString(), 10)].isReadonly = selectedItem.isReadonly;
                    (this.pdfViewer.nameTable[(this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0]] as PdfFormFieldBaseModel).isReadonly = selectedItem.isReadonly;
                    const currentElement: HTMLElement = document.getElementById((this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0]);
                    const currentItem: IRadiobuttonItem = (this.pdfViewerBase.
                        formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem[parseInt(i.toString(),
                                                                                                                              10)];
                    this.setReadOnlyProperty(currentItem as IFormField, currentElement);
                    if (isReadOnlyChanged) {
                        (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                        IFormField).radiobuttonItem[parseInt(i.toString(), 10)].backgroundColor =
                            typeof(currentItem.backgroundColor) === 'string' ? this.getRgbCode(currentItem.backgroundColor) as unknown as RGBA : currentItem.backgroundColor;
                    }
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
        if (isReadOnlyChanged) {
            this.setReadOnlyProperty(selectedItem, element);
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false, isReadOnlyChanged,
                                                  false, false, false, false, false, false, oldValue, newValue);
        }
    }

    private updateIsRequiredPropertyChange(selectedItem: PdfFormFieldBaseModel, element: Element, isUndoRedo: boolean, index: number,
                                           formFieldsData: IFormFieldCollection[]): void {
        let isRequiredChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
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
            if ((this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem) {
                for (let i: number = 0; i < (this.pdfViewerBase.
                    formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem.length; i++) {
                    (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                    IFormField).radiobuttonItem[parseInt(i.toString(), 10)].isRequired = selectedItem.isRequired;
                    (this.pdfViewer.nameTable[(this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as IFormField).radiobuttonItem[parseInt(i.toString(), 10)].id.split('_')[0]] as PdfFormFieldBaseModel).isRequired = selectedItem.isRequired;
                }
                this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            }
        }
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isRequired = selectedItem.isRequired;
        this.setRequiredToElement(selectedItem, element, selectedItem.isRequired);
        this.setRequiredToFormField(selectedItem, selectedItem.isRequired);
        if (isRequiredChanged) {
            this.pdfViewerBase.setItemInSessionStorage(this.pdfViewerBase.formFieldCollection, '_formDesigner');
            this.updateFormFieldPropertiesChanges('formFieldPropertiesChange', selectedItem, false, false, false,
                                                  false, false, false, false, false, false, false,
                                                  false, false, isRequiredChanged, false, false, false, oldValue, newValue);
        }
    }

    private updateIsPrintPropertyChange(selectedItem: PdfFormFieldBaseModel, isUndoRedo: boolean, index: number,
                                        formFieldsData: IFormFieldCollection[]): void {
        let isPrintChanged: boolean = false;
        let oldValue: string | number | boolean | string[] | number[] | object; let newValue: string | number | boolean | string[] |
        number[] | object;
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
        (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).isPrint = selectedItem.isPrint;
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
    public getFormFiledIndex(id: string): number {
        if (this.pdfViewerBase.formFieldCollection == null || this.pdfViewerBase.formFieldCollection.length === 0)
        {return -1; }
        const index: number = this.pdfViewerBase.formFieldCollection.findIndex((el: IFormFieldCollection) => el.Key.split('_')[0] === id);
        if (index > -1) {
            return index;
        } else {
            for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
                if ((this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as PdfFormFieldBaseModel).formFieldAnnotationType === 'RadioButton' && (this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).radiobuttonItem) {
                    for (let k: number = 0; k < (this.pdfViewerBase.
                        formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).radiobuttonItem.length; k++) {
                        if ((this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)].FormField as IFormField).
                            radiobuttonItem[parseInt(k.toString(), 10)].id.split('_')[0] === id) {
                            return i;
                        }
                    }
                }
            }
        }
        return -1;
    }

    private updateFontStyle(inputElement: HTMLElement, selectedItem: PdfFormFieldBaseModel, isUndoRedo: boolean, index: number,
                            formFieldsData: IFormFieldCollection[]): [boolean, string, string] {
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
        if (oldValue === newValue) {
            isFontStyleChanged = false;
        }
        return [isFontStyleChanged, oldValue, newValue];
    }

    private setFontStyleValues(selectedItem: PdfFormFieldBaseModel, selectedItemFontStyle: string, fontStyleType: string,
                               inputElement: HTMLElement, isFontStyleEnabled: boolean, fontStyleValue: string, index: number,
                               formFieldsData: IFormFieldCollection[]): void {
        if (fontStyleType === 'bold') {
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isBold = isFontStyleEnabled;
            inputElement.style.fontWeight = fontStyleValue;
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            if (index > -1) {
                (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).font.isBold = isFontStyleEnabled;
                (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                PdfFormFieldBaseModel).font.isBold = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).font.isBold = isFontStyleEnabled;
        } else if (fontStyleType === 'italic') {
            inputElement.style.fontStyle = fontStyleValue;
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isItalic = isFontStyleEnabled;
            if (index > -1) {
                (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).font.isItalic = isFontStyleEnabled;
                (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                PdfFormFieldBaseModel).font.isItalic = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).font.isItalic = isFontStyleEnabled;
        } else if (fontStyleType === 'underline') {
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            inputElement.style.textDecoration = fontStyleValue;
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isUnderline = isFontStyleEnabled;
            if (index > -1) {
                (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).font.isUnderline = isFontStyleEnabled;
                (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                PdfFormFieldBaseModel).font.isUnderline = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).font.isUnderline = isFontStyleEnabled;
        } else if (fontStyleType === 'line-through') {
            this.setDropdownFontStyleValue(inputElement, fontStyleType, fontStyleValue);
            if (!(this.formFieldUnderline === 'underline') || (this.formFieldUnderline === 'underline' && isFontStyleEnabled)) {
                inputElement.style.textDecoration = fontStyleValue;
            }
            selectedItem.fontStyle = selectedItemFontStyle;
            selectedItem.font.isStrikeout = isFontStyleEnabled;
            if (index > -1) {
                (formFieldsData[parseInt(index.toString(), 10)].FormField as IFormField).font.isStrikeout = isFontStyleEnabled;
                (this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)].FormField as
                PdfFormFieldBaseModel).font.isStrikeout = isFontStyleEnabled;
            }
            (this.pdfViewer.nameTable[selectedItem.id.split('_')[0]] as PdfFormFieldBaseModel).font.isStrikeout = isFontStyleEnabled;
        }
    }

    private setDropdownFontStyleValue(dropdownElement: HTMLElement, fontStyleType: string, value: string): void {
        const dropdownElements: HTMLElement[] = Array.from(dropdownElement.children) as HTMLElement[];
        if (dropdownElements.length > 0) {
            for (let i: number = 0; i < dropdownElements.length; i++) {
                if (fontStyleType === 'bold') {
                    dropdownElements[parseInt(i.toString(), 10)].style.fontWeight = value;
                } else if (fontStyleType === 'italic') {
                    dropdownElements[parseInt(i.toString(), 10)].style.fontStyle = value;
                } else if (fontStyleType === 'underline') {
                    dropdownElements[parseInt(i.toString(), 10)].style.textDecoration = value;
                } else if (fontStyleType === 'line-through') {
                    dropdownElements[parseInt(i.toString(), 10)].style.textDecoration = value;
                } else if (fontStyleType === 'none') {
                    dropdownElements[parseInt(i.toString(), 10)].style.fontWeight = value;
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
     * @param {string | number | boolean | string[] | number[] | object} oldValue - It describes about the old value
     * @param {string | number | boolean | string[] | number[] | object} newValue - It describes about the new value
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
                                            oldValue: string | number | boolean | string[] | number[] | object,
                                            newValue: string | number | boolean | string[] | number[] | object, isNamechanged?: boolean,
                                            previousName?: string): void {
        if (isValueChanged && selectedItem && selectedItem.name) {
            this.refreshBarcodeGlyphsForLinkedField(selectedItem.name);
        }
        const field: IFormField = {
            name: selectedItem.name, id: selectedItem.id, value: selectedItem.value,
            fontFamily: selectedItem.fontFamily, fontSize: selectedItem.fontSize,
            fontStyle: selectedItem.fontStyle,
            color: selectedItem.color, backgroundColor: selectedItem.backgroundColor as RGBA,
            alignment: selectedItem.alignment, isReadonly: selectedItem.isReadonly,
            visibility: selectedItem.visibility,
            maxLength: selectedItem.maxLength, isRequired: selectedItem.isRequired,
            isPrint: selectedItem.isPrint, rotation: selectedItem.rotateAngle,
            tooltip: selectedItem.tooltip, options: selectedItem.options,
            isChecked: selectedItem.isChecked, isSelected: selectedItem.isSelected,
            previousName: previousName, currentName: selectedItem.name, customData: selectedItem.customData
        };
        this.pdfViewer.fireFormFieldPropertiesChangeEvent('formFieldPropertiesChange', field, selectedItem.pageIndex, isValueChanged, isFontFamilyChanged, isFontSizeChanged,
                                                          isFontStyleChanged, isColorChanged, isBackgroundColorChanged,
                                                          isBorderColorChanged, isBorderWidthChanged, isAlignmentChanged,
                                                          isReadOnlyChanged, isVisibilityChanged,
                                                          isMaxLengthChanged, isRequiredChanged, isPrintChanged,
                                                          isToolTipChanged, isCustomDataChanged,
                                                          oldValue as string, newValue as string, isNamechanged);
        if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formFieldsModule.isCollaborativeImport) {
            let fields: FormFieldModel = {
                name: selectedItem.name, id: selectedItem.id, value: selectedItem.value,
                fontFamily: selectedItem.fontFamily, fontSize: selectedItem.fontSize,
                fontStyle: selectedItem.fontStyle as unknown as FontStyle, borderColor: selectedItem.borderColor as string,
                color: selectedItem.color, backgroundColor: selectedItem.backgroundColor as string,
                alignment:  selectedItem.alignment as TextAlign,
                isReadOnly: selectedItem.isReadonly,
                maxLength: selectedItem.maxLength, isRequired: selectedItem.isRequired,
                isPrint: selectedItem.isPrint, bounds: selectedItem.bounds as IFormFieldBound,
                tooltip: selectedItem.tooltip, options: selectedItem.options,
                isChecked: selectedItem.isChecked, customData: selectedItem.customData,
                type: selectedItem.formFieldAnnotationType as FormFieldType, insertSpaces: selectedItem.insertSpaces,
                isMultiline: selectedItem.isMultiline, isSelected: selectedItem.isSelected,
                isTransparent: selectedItem.isTransparent, pageIndex: selectedItem.pageIndex,
                pageNumber: selectedItem.pageNumber, rotateAngle: selectedItem.rotateAngle,
                selectedIndex: selectedItem.selectedIndex,
                signatureIndicatorSettings: selectedItem.signatureIndicatorSettings,
                signatureType: selectedItem.signatureType ? [selectedItem.signatureType as SignatureType] : [],
                thickness: selectedItem.thickness,
                visibility: selectedItem.visibility
            };
            (fields as unknown as IFormField).lineBound = (selectedItem as IFormField).lineBound;
            (fields as unknown as IFormField).signatureBound = (selectedItem as IFormField).signatureBound;
            (fields as unknown as PdfFormFieldBaseModel).font = selectedItem.font;
            if (fields.type === 'RadioButton') {
                fields = this.updateRadioButtonItem(fields);
            }
            this.pdfViewer.fireFormFieldChangedEvent(EditAction.Modify, fields);
        }
    }

    private onCancelClicked(): void {
        this.propertiesDialog.hide();
    }

    private select(e: SelectEventArgs): void {
        if (e.isSwiped) {
            e.cancel = true; // Prevent swiping between tab items
        }
    }

    private createAppearanceTab(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const appearanceDiv: HTMLElement = createElement('div', { id: elementID + '_properties_appearance' });
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'BarcodeField' || (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'DropdownList' && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'ListBox')) {
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
        } else if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'Button') {
            // Product lock UI-ACTIONS: Button property panel = General | Appearance | Actions only.
            this.tabControl = new Tab({
                items: [
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Appearance') + '</div>' }, content: this.createAppearanceProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Actions').toUpperCase() + '</div>' }, content: this.createButtonGoToProperties(this.pdfViewer.selectedItems.formFields[0])
                    }
                ],
                selecting: this.select
            }, tabContainer);
        } else if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'BarcodeField') {
            this.tabControl = new Tab({
                items: [
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Options') + '</div>' }, content: this.createBarcodeProperties()
                    },
                    {
                        header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('ValueTitle') + '</div>' }, content: this.createBarcodeOptionsProperties()
                    }
                ],
                selecting: this.select
            }, tabContainer);

        } else {
            const tabItems: object[] = [
                {
                    header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('General') + '</div>' }, content: this.createGeneralProperties()
                },
                {
                    header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Appearance') + '</div>' }, content: this.createAppearanceProperties()
                }
            ];
            // Textbox (single-line, non-password, standalone): Format tab.
            if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.formFields[0] &&
                this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'Textbox' &&
                !this.pdfViewer.selectedItems.formFields[0].isMultiline &&
                !this.pdfViewer.serviceUrl) {
                tabItems.push({
                    header: { 'text': '<div class="e-pv-form-field-property-header-general"> ' + this.pdfViewer.localeObj.getConstant('Format') + '</div>' },
                    content: this.createFormatProperties()
                });
            }
            this.tabControl = new Tab({
                items: tabItems,
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
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'PasswordField') {
            this.formFieldValue = new TextBox({ type: 'password', floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Value'), value: selectedItem.value, cssClass: 'e-pv-properties-formfield-value' }, (formFieldValueContainer as HTMLInputElement));
        } else {
            this.formFieldValue = new TextBox({ type: 'text', floatLabelType: 'Always', placeholder: this.pdfViewer.localeObj.getConstant('Value'), value: selectedItem.value, cssClass: 'e-pv-properties-formfield-value' }, (formFieldValueContainer as HTMLInputElement));
        }
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'Textbox' &&
            this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'PasswordField' &&
            this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'RadioButton' &&
            this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'Checkbox' &&
            this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'Button' &&
			this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType !== 'BarcodeField') {
            this.formFieldValue.enabled = false;
            this.formFieldValue.value = '';
        }
        if (this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType === 'BarcodeField') {
            this.formFieldValue.enabled = true;
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
        // Barcode General tab keeps only Name and Tooltip; hide the Value / Visibility / checkbox rows for barcode only.
        if (selectedItem.formFieldAnnotationType === 'BarcodeField') {
            visibilityContainer.style.display = 'none';
        }
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
            // UI lock only for date fields — do not force-mutate model.
            if (selectedItem.isDateField) {
                this.formFieldMultiline.disabled = true;
            }
        }
        generalPropertiesDiv.appendChild(checkboxMainDiv);
        // Barcode General tab keeps only Name and Tooltip; hide the checkbox row for barcode only.
        if (selectedItem.formFieldAnnotationType === 'BarcodeField') {
            checkboxMainDiv.style.display = 'none';
        }
        return generalPropertiesDiv;
    }

    /**
     * Actions tab for Button: six AA slots, action-type dropdown, and a per-type editor host
     * (RSD §4.3 UI-ACTIONS, scalable to additional action types).
     *
     * @param {PdfFormFieldBaseModel} selectedItem - selected button field
     * @returns {HTMLElement} Actions tab root
     */
    private createButtonGoToProperties(selectedItem: PdfFormFieldBaseModel): HTMLElement {
        this.buttonActionPanelField = selectedItem;
        // I3: resolve initial slot.
        // Priority: lastButtonActionSlot if it still has an action configured; else
        // the most recently configured slot in selectedItem.actions; else 'mouseUp'.
        this.buttonActionSelectedSlot = this.resolveInitialButtonActionSlot(selectedItem);
        this.lastButtonActionSlot = this.buttonActionSelectedSlot;
        // Ensure GoTo property editors are shown (Action Type currently only supports GoTo).
        this.buttonActionSelectedType = 'GoTo';
        const goToContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-button-goto-prop' });
        const slotItems: { text: string; value: string }[] = [
            { text: this.pdfViewer.localeObj.getConstant('Mouse Up'), value: 'mouseUp' },
            { text: this.pdfViewer.localeObj.getConstant('Mouse Down'), value: 'mouseDown' },
            { text: this.pdfViewer.localeObj.getConstant('Mouse Enter'), value: 'mouseEnter' },
            { text: this.pdfViewer.localeObj.getConstant('Mouse Leave'), value: 'mouseLeave' },
            { text: this.pdfViewer.localeObj.getConstant('Got Focus'), value: 'gotFocus' },
            { text: this.pdfViewer.localeObj.getConstant('Lost Focus'), value: 'lostFocus' }
        ];
        // Figma: Actions + Action Type side-by-side. Layout via .e-pv-properties-button-* theme rules.
        const actionsRow: HTMLElement = createElement('div', { className: 'e-pv-properties-button-actions-row' });

        const slotDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-button-action-slot' });
        const slotInput: HTMLElement = createElement('input', { className: 'e-pv-properties-button-action-slot-input' });
        slotDiv.appendChild(slotInput);
        actionsRow.appendChild(slotDiv);
        this.buttonActionSlotDropDown = new DropDownList({
            dataSource: slotItems,
            fields: { text: 'text', value: 'value' },
            value: this.buttonActionSelectedSlot,
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Actions'),
            width: '100%',
            change: (args: { value?: string }): void => {
                this.commitCurrentSlotGoToFromEditors();
                this.buttonActionSelectedSlot = args && args.value ? String(args.value) : 'mouseUp';
                // I3: track the slot the user most recently selected.
                this.lastButtonActionSlot = this.buttonActionSelectedSlot;
                this.loadButtonActionSlotIntoEditors(this.buttonActionSelectedSlot);
            }
        }, slotInput as HTMLInputElement);
        // Action Type dropdown — extensible. Future action types append to this dataSource
        // and add a matching branch in renderActionEditorsForType / load / commit.
        const actionTypeItems: { text: string; value: string }[] = [
            { text: this.pdfViewer.localeObj.getConstant('Go To Action'), value: 'GoTo' }
        ];
        const actionTypeDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-button-action-type' });
        const actionTypeInput: HTMLElement = createElement('input', { className: 'e-pv-properties-button-action-type-input' });
        actionTypeDiv.appendChild(actionTypeInput);
        actionsRow.appendChild(actionTypeDiv);
        goToContainer.appendChild(actionsRow);
        this.buttonActionTypeDropDown = new DropDownList({
            dataSource: actionTypeItems,
            fields: { text: 'text', value: 'value' },
            value: 'GoTo',
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Action Type'),
            width: '100%',
            change: (args: { value?: string }): void => {
                const nextType: string = args && args.value ? String(args.value) : 'None';
                // Leaving GoTo: commit current editors first so other slots are not lost.
                if (this.buttonActionSelectedType === 'GoTo' && nextType !== 'GoTo') {
                    this.commitCurrentSlotGoToFromEditors();
                }
                this.buttonActionSelectedType = nextType;
                if (nextType === 'None') {
                    this.clearSelectedButtonActionSlot();
                }
                this.renderActionEditorsForType(this.buttonActionSelectedType, this.buttonActionEditorHost);
                if (nextType !== 'None') {
                    this.loadButtonActionSlotIntoEditors(this.buttonActionSelectedSlot);
                }
            }
        }, actionTypeInput as HTMLInputElement);
        // Host for action-specific editors; populated by renderActionEditorsForType.
        this.buttonActionEditorHost = createElement('div', { className: 'e-pv-properties-button-action-editor-host' });
        goToContainer.appendChild(this.buttonActionEditorHost);
        this.renderActionEditorsForType(this.buttonActionSelectedType, this.buttonActionEditorHost);
        this.loadButtonActionSlotIntoEditors(this.buttonActionSelectedSlot);
        return goToContainer;
    }

    /**
     * I5: apply a per-slot delta (old/new value map) captured by addAction.
     * The delta uses the same per-slot snapshot shape produced in
     * applyButtonActionSettingsToField: { [slot]: action | null }.
     *
     * @param {PdfFormFieldBaseModel} field - button field
     * @param {object} delta - per-slot snapshot { [slot]: action | null }
     * @private
     * @returns {void}
     */
    public applyButtonActionSlotDelta(field: PdfFormFieldBaseModel, delta: { [key: string]: unknown }): void {
        if (isNullOrUndefined(field) || isNullOrUndefined(delta)) {
            return;
        }
        const actions: ActionsSettingsModel = (field.actions
            ? { ...(field.actions as ActionsSettingsModel) }
            : {} as ActionsSettingsModel);
        for (const slot in delta) {
            if (!Object.prototype.hasOwnProperty.call(delta, slot)) {
                continue;
            }
            // Only AA slots, defensive.
            if (slot !== 'mouseUp' && slot !== 'mouseDown' && slot !== 'mouseEnter' &&
                slot !== 'mouseLeave' && slot !== 'gotFocus' && slot !== 'lostFocus') {
                continue;
            }
            type ActionSlot =
                'mouseUp' |
                'mouseDown' |
                'mouseEnter' |
                'mouseLeave' |
                'gotFocus' |
                'lostFocus';
            const actionSlot: ActionSlot = slot as ActionSlot;
            switch (actionSlot) {
            case 'mouseUp':
                if (isNullOrUndefined(delta.mouseUp)) {
                    delete actions.mouseUp;
                } else {
                    actions.mouseUp = (delta as ActionsSettingsModel).mouseUp;
                }
                break;
            case 'mouseDown':
                if (isNullOrUndefined(delta.mouseDown)) {
                    delete actions.mouseDown;
                } else {
                    actions.mouseDown = (delta as ActionsSettingsModel).mouseDown;
                }
                break;
            case 'mouseEnter':
                if (isNullOrUndefined(delta.mouseEnter)) {
                    delete actions.mouseEnter;
                } else {
                    actions.mouseEnter = (delta as ActionsSettingsModel).mouseEnter;
                }
                break;
            case 'mouseLeave':
                if (isNullOrUndefined(delta.mouseLeave)) {
                    delete actions.mouseLeave;
                } else {
                    actions.mouseLeave = (delta as ActionsSettingsModel).mouseLeave;
                }
                break;
            case 'gotFocus':
                if (isNullOrUndefined(delta.gotFocus)) {
                    delete actions.gotFocus;
                } else {
                    actions.gotFocus = (delta as ActionsSettingsModel).gotFocus;
                }
                break;
            case 'lostFocus':
                if (isNullOrUndefined(delta.lostFocus)) {
                    delete actions.lostFocus;
                } else {
                    actions.lostFocus = (delta as ActionsSettingsModel).lostFocus;
                }
                break;
            }
        }
        field.actions = actions;
        // Mirror to nameTable and formFieldCollections.
        const nameKey: string = field.id ? field.id.split('_')[0] : '';
        if (nameKey && this.pdfViewer.nameTable[nameKey as string]) {
            (this.pdfViewer.nameTable[nameKey as string] as PdfFormFieldBaseModel).actions = actions;
        }
        const collectionIndex: number = this.pdfViewer.formFieldCollections.findIndex(
            (f: FormFieldModel) => f.id === nameKey || f.id === field.id);
        if (collectionIndex > -1) {
            this.pdfViewer.formFieldCollections[collectionIndex as number].actions = actions;
        }
    }

    /**
     * I3: resolve the slot to display when the Actions tab is opened.
     * Priority: lastButtonActionSlot if it still has an action; else the last slot present in
     * selectedItem.actions (insertion order); else 'mouseUp'.
     *
     * @param {PdfFormFieldBaseModel} selectedItem - selected button field
     * @returns {string} initial slot name
     */
    private resolveInitialButtonActionSlot(selectedItem: PdfFormFieldBaseModel): string {
        const knownSlots: string[] = ['mouseUp', 'mouseDown', 'mouseEnter', 'mouseLeave', 'gotFocus', 'lostFocus'];
        if (selectedItem && selectedItem.actions) {
            const actionsMap: { [key: string]: unknown } = selectedItem.actions as { [key: string]: unknown };
            if (!isNullOrUndefined(actionsMap[this.lastButtonActionSlot])) {
                return this.lastButtonActionSlot;
            }
            for (let i: number = knownSlots.length - 1; i >= 0; i--) {
                if (!isNullOrUndefined(actionsMap[knownSlots[parseInt(i.toString(), 10)]])) {
                    return knownSlots[parseInt(i.toString(), 10)];
                }
            }
        }
        return this.lastButtonActionSlot || 'mouseUp';
    }

    /**
     * Render per-action-type editors into the host. Tier 1 reuse: a single registry per type
     * so adding a new action type requires only a new entry — no UI redesign.
     *
     * @param {string} type - Action kind (for example `'GoTo'`)
     * @param {HTMLElement} host - Container that hosts the editors
     * @returns {void}
     */
    private renderActionEditorsForType(type: string, host: HTMLElement): void {
        if (!host) { return; }
        while (host.firstChild) {
            host.removeChild(host.firstChild);
        }
        // Dispose previous GoTo editors before re-render.
        if (this.buttonDestinationPageItem) {
            this.buttonDestinationPageItem.destroy();
        }
        if (this.buttonDestinationXItem) {
            this.buttonDestinationXItem.destroy();
        }
        if (this.buttonDestinationYItem) {
            this.buttonDestinationYItem.destroy();
        }
        if (this.buttonZoomValueItem) {
            this.buttonZoomValueItem.destroy();
        }
        this.buttonDestinationPageItem = null;
        this.buttonDestinationXItem = null;
        this.buttonDestinationYItem = null;
        this.buttonZoomValueItem = null;
        if (type === 'GoTo') {
            // Actions tab GoTo editors: float labels match Actions / Action Type (floatLabelType Always).
            // Page (full width) → Position (X/Y) + Zoom side-by-side with shared vertical rhythm.
            const elementID: string = this.pdfViewer.element.id;

            const propertiesHeading: HTMLElement = createElement('div', {
                className: 'e-pv-link-dialog-section-title e-pv-properties-button-goto-section-title'
            });
            propertiesHeading.textContent = this.pdfViewer.localeObj.getConstant('Properties');
            host.appendChild(propertiesHeading);

            const pageFieldDiv: HTMLElement = createElement('div', {
                className: 'e-pv-properties-button-goto-page-field'
            });
            const pageInputEl: HTMLElement = createElement('input', {
                id: elementID + '_button_goto_page_input',
                className: 'e-pv-properties-button-goto-page-input'
            });
            pageFieldDiv.appendChild(pageInputEl);
            host.appendChild(pageFieldDiv);
            const pageCount: number = this.pdfViewer.pageCount > 0 ? this.pdfViewer.pageCount : 1;
            this.buttonDestinationPageItem = new NumericTextBox({
                value: 1,
                format: 'n0',
                min: 1,
                max: pageCount,
                step: 1,
                showSpinButton: true,
                floatLabelType: 'Always',
                placeholder: this.pdfViewer.localeObj.getConstant('Enter the Page number'),
                cssClass: 'e-pv-properties-button-goto-page-ntb',
                width: '100%'
            }, pageInputEl as HTMLInputElement);

            const propertiesRow: HTMLElement = createElement('div', {
                className: 'e-pv-properties-button-goto-properties-row'
            });

            const positionContainer: HTMLElement = createElement('div', {
                className: 'e-pv-properties-button-goto-position-container'
            });
            // Hierarchy: position-container > label + position-row (X/Y). Static label (not e-label-top)
            // so it does not absolute-overlap Zoom. Reuse e-pv-properties-formfield-label for the same
            // font-size / family / weight as other form-field property labels (and float labels theme).
            const positionLabel: HTMLElement = createElement('label', {
                className: 'e-pv-properties-formfield-label e-pv-properties-button-goto-field-label'
            });
            positionLabel.textContent = this.pdfViewer.localeObj.getConstant('Position');
            positionContainer.appendChild(positionLabel);

            const positionRow: HTMLElement = createElement('div', {
                className: 'e-pv-properties-button-goto-position-row'
            });

            const xGroup: HTMLElement = createElement('div', {
                className: 'e-pv-properties-button-goto-field-group e-pv-properties-button-goto-x-group'
            });
            const xPrefix: HTMLElement = createElement('span', {
                className: 'e-pv-properties-button-goto-axis-prefix'
            });
            xPrefix.textContent = 'X:';
            xGroup.appendChild(xPrefix);
            const xInputEl: HTMLElement = createElement('input', {
                id: elementID + '_button_goto_x_input',
                className: 'e-pv-properties-button-goto-x-input'
            });
            xGroup.appendChild(xInputEl);
            this.buttonDestinationXItem = new TextBox({
                type: 'text',
                value: '0',
                cssClass: 'e-pv-properties-button-goto-xy-textbox',
                width: '100%'
            }, xInputEl as HTMLInputElement);
            positionRow.appendChild(xGroup);

            const yGroup: HTMLElement = createElement('div', {
                className: 'e-pv-properties-button-goto-field-group e-pv-properties-button-goto-y-group'
            });
            const yPrefix: HTMLElement = createElement('span', {
                className: 'e-pv-properties-button-goto-axis-prefix'
            });
            yPrefix.textContent = 'Y:';
            yGroup.appendChild(yPrefix);
            const yInputEl: HTMLElement = createElement('input', {
                id: elementID + '_button_goto_y_input',
                className: 'e-pv-properties-button-goto-y-input'
            });
            yGroup.appendChild(yInputEl);
            this.buttonDestinationYItem = new TextBox({
                type: 'text',
                value: '0',
                cssClass: 'e-pv-properties-button-goto-xy-textbox',
                width: '100%'
            }, yInputEl as HTMLInputElement);
            positionRow.appendChild(yGroup);
            positionContainer.appendChild(positionRow);

            const zoomRow: HTMLElement = createElement('div', {
                className: 'e-pv-properties-button-goto-zoom-row'
            });
            const zoomSelectEl: HTMLElement = createElement('input', {
                id: elementID + '_button_goto_zoom_input',
                attrs: { type: 'text' }
            });
            zoomRow.appendChild(zoomSelectEl);
            // Zoom dropdown stores percent labels; model zoomValue is factor (percent/100).
            // floatLabelType Always matches Actions / Action Type label styling.
            this.buttonZoomValueItem = new DropDownList({
                dataSource: [
                    { text: '10%', value: 10 }, { text: '25%', value: 25 }, { text: '50%', value: 50 },
                    { text: '75%', value: 75 }, { text: '100%', value: 100 }, { text: '125%', value: 125 },
                    { text: '150%', value: 150 }, { text: '200%', value: 200 }, { text: '400%', value: 400 }
                ],
                fields: { text: 'text', value: 'value' },
                value: 100,
                floatLabelType: 'Always',
                placeholder: this.pdfViewer.localeObj.getConstant('Zoom'),
                cssClass: 'e-pv-properties-button-goto-zoom-ddl',
                popupHeight: '200px',
                width: '100%'
            }, zoomSelectEl as HTMLInputElement);

            propertiesRow.appendChild(positionContainer);
            propertiesRow.appendChild(zoomRow);
            host.appendChild(propertiesRow);
        }
    }

    /**
     * Read GoTo triad for the given AA slot into property editors.
     * Empty/missing slot still shows GoTo editors with defaults (page 1, x/y 0, zoom 100%).
     *
     * @param {string} slot - AA slot key (mouseUp, mouseDown, ...)
     * @returns {void}
     */
    private loadButtonActionSlotIntoEditors(slot: string): void {
        const field: PdfFormFieldBaseModel = this.buttonActionPanelField ||
            (this.pdfViewer.selectedItems.formFields ? this.pdfViewer.selectedItems.formFields[0] : null);
        const existingActions: ActionsSettingsModel = field && field.actions ? field.actions as ActionsSettingsModel : null;
        // Flat GoToAction on the slot; legacy nested goToAction still accepted on read.
        const slotAction: ButtonRuntimeAction = existingActions ?
            existingActions[slot as keyof ActionsSettingsModel] as ButtonRuntimeAction : null;
        // Action Type dropdown only lists GoTo; keep editors visible for empty slots too.
        let detectedType: string = 'GoTo';
        if (slotAction) {
            const kind: string = !isNullOrUndefined((slotAction as GoToActionModel).action) ? (slotAction as GoToActionModel).action :
                (!isNullOrUndefined(slotAction.actionType) ? slotAction.actionType : 'GoTo');
            detectedType = kind === 'goto' ? 'GoTo' : (kind || 'GoTo');
            if (detectedType !== 'GoTo') {
                detectedType = 'GoTo';
            }
        }
        this.buttonActionSelectedType = detectedType;
        if (this.buttonActionTypeDropDown) {
            this.buttonActionTypeDropDown.value = detectedType;
            this.buttonActionTypeDropDown.dataBind();
            this.renderActionEditorsForType(this.buttonActionSelectedType, this.buttonActionEditorHost);
        }
        if (this.buttonActionSelectedType !== 'GoTo') {
            return;
        }
        const existingGoTo: GoToActionModel | ButtonRuntimeAction = slotAction
            ? (!isNullOrUndefined(slotAction.goToAction) ? slotAction.goToAction : slotAction)
            : {};
        if (this.buttonDestinationPageItem) {
            // Prefer 1-based destinationPageNumber; legacy destinationPageIndex was 0-based.
            let pageNumber: number = 1;
            if (!isNullOrUndefined((existingGoTo as GoToActionModel).destinationPageNumber) &&
                !isNaN(Number((existingGoTo as GoToActionModel).destinationPageNumber))) {
                pageNumber = Number((existingGoTo as GoToActionModel).destinationPageNumber);
            }
            const pageCount: number = this.pdfViewer.pageCount > 0 ? this.pdfViewer.pageCount : 1;
            if (pageNumber < 1) {
                pageNumber = 1;
            } else if (pageNumber > pageCount) {
                pageNumber = pageCount;
            }
            this.buttonDestinationPageItem.value = pageNumber;
            this.buttonDestinationPageItem.dataBind();
        }
        if (this.buttonDestinationXItem) {
            const xVal: number = (existingGoTo as GoToActionModel).destinationLocation &&
                !isNullOrUndefined((existingGoTo as GoToActionModel).destinationLocation.x) ?
                Number((existingGoTo as GoToActionModel).destinationLocation.x) : 0;
            this.buttonDestinationXItem.value = String(!isNaN(xVal) ? xVal : 0);
            this.buttonDestinationXItem.dataBind();
        }
        if (this.buttonDestinationYItem) {
            const yVal: number = (existingGoTo as GoToActionModel).destinationLocation &&
                !isNullOrUndefined((existingGoTo as GoToActionModel).destinationLocation.y) ?
                Number((existingGoTo as GoToActionModel).destinationLocation.y) : 0;
            this.buttonDestinationYItem.value = String(!isNaN(yVal) ? yVal : 0);
            this.buttonDestinationYItem.dataBind();
        }
        if (this.buttonZoomValueItem) {
            let zoomPercent: number = 100;
            if (!isNullOrUndefined((existingGoTo as GoToActionModel).zoomValue) &&
            !isNaN(Number((existingGoTo as GoToActionModel).zoomValue))) {
                const z: number = Number((existingGoTo as GoToActionModel).zoomValue);
                // Model stores factor; dropdown uses percent.
                zoomPercent = z > 0 && z <= 10 ? Math.round(z * 100) : Math.round(z);
            }
            this.buttonZoomValueItem.value = zoomPercent;
            this.buttonZoomValueItem.dataBind();
        }
    }

    private commitCurrentSlotGoToFromEditors(): void {
        if (!this.buttonDestinationPageItem && !this.buttonDestinationXItem &&
            !this.buttonDestinationYItem && !this.buttonZoomValueItem) {
            return;
        }
        if (this.buttonActionSelectedType !== 'GoTo') {
            return;
        }
        const field: PdfFormFieldBaseModel = this.buttonActionPanelField ||
            (this.pdfViewer.selectedItems.formFields ? this.pdfViewer.selectedItems.formFields[0] : null);
        if (!field) {
            return;
        }
        const slot: string = this.buttonActionSelectedSlot || 'mouseUp';
        const pageCount: number = this.pdfViewer.pageCount > 0 ? this.pdfViewer.pageCount : 1;
        let pageNumber: number = this.buttonDestinationPageItem &&
            !isNullOrUndefined(this.buttonDestinationPageItem.value) ?
            Number(this.buttonDestinationPageItem.value) : 1;
        if (isNaN(pageNumber) || pageNumber < 1) {
            pageNumber = 1;
        } else if (pageNumber > pageCount) {
            pageNumber = pageCount;
        }
        // Round to whole page number for consistent 1-based navigation.
        pageNumber = Math.round(pageNumber);
        const x: number = this.buttonDestinationXItem && !isNullOrUndefined(this.buttonDestinationXItem.value)
            ? Number(this.buttonDestinationXItem.value) : 0;
        const y: number = this.buttonDestinationYItem && !isNullOrUndefined(this.buttonDestinationYItem.value)
            ? Number(this.buttonDestinationYItem.value) : 0;
        const zoomPercent: number = this.buttonZoomValueItem && !isNullOrUndefined(this.buttonZoomValueItem.value)
            ? Number(this.buttonZoomValueItem.value) : 100;
        // Persist zoom as factor (dropdown percent / 100), same as link annotation apply path.
        const zoom: number = !isNaN(zoomPercent) && zoomPercent > 0 ? zoomPercent / 100 : 1;
        const actions: ActionsSettingsModel = field.actions
            ? { ...(field.actions as ActionsSettingsModel) } : {} as ActionsSettingsModel;
        (actions as { [key: string]: unknown })[slot as string] = {
            action: 'GoTo',
            destinationPageNumber: pageNumber,
            destinationLocation: {
                x: !isNaN(x) ? x : 0,
                y: !isNaN(y) ? y : 0
            },
            zoomValue: zoom
        };
        field.actions = actions;
        this.buttonActionPanelField = field;
    }

    /**
     * Clear GoTo action for the currently selected AA slot and reset editors.
     *
     * Note: removed from UI per product spec — slot actions are managed via the action-type
     * dropdown (choose `GoTo` to attach, switch to a different supported type or remove the
     * action via existing form-field delete workflows). Retained for backward callers only.
     *
     * @returns {void}
     */
    private clearSelectedButtonActionSlot(): void {
        const field: PdfFormFieldBaseModel = this.buttonActionPanelField ||
            (this.pdfViewer.selectedItems.formFields ? this.pdfViewer.selectedItems.formFields[0] : null);
        if (!field) {
            return;
        }
        const slot: string = this.buttonActionSelectedSlot || 'mouseUp';
        const actions: ActionsSettingsModel = field.actions
            ? { ...(field.actions as ActionsSettingsModel) } : {} as ActionsSettingsModel;
        // I2: delete the slot key (not set null) so other slots stay independent. The
        // per-slot undo capture sees the slot as removed and restore writes it back.
        delete (actions as { [key: string]: unknown })[slot as string];
        // If all six slots are gone, drop the actions object entirely.
        if (Object.keys(actions).length === 0) {
            field.actions = undefined;
        } else {
            field.actions = actions;
        }
        this.buttonActionPanelField = field;
        if (this.buttonDestinationPageItem) {
            this.buttonDestinationPageItem.value = 1;
            this.buttonDestinationPageItem.dataBind();
        }
        if (this.buttonDestinationXItem) {
            this.buttonDestinationXItem.value = '0';
            this.buttonDestinationXItem.dataBind();
        }
        if (this.buttonDestinationYItem) {
            this.buttonDestinationYItem.value = '0';
            this.buttonDestinationYItem.dataBind();
        }
        if (this.buttonZoomValueItem) {
            this.buttonZoomValueItem.value = 100;
            this.buttonZoomValueItem.dataBind();
        }
    }

    /**
     * Commit GoTo editors into the working field model and sync nameTable + collections.
     * I2: None clears only the selected slot. I3: lastButtonActionSlot. I5: undo only if slot changed.
     *
     * @param {PdfFormFieldBaseModel} selectedItem - selected button field
     * @returns {void}
     */
    private applyButtonActionSettingsToField(selectedItem: PdfFormFieldBaseModel): void {
        if (!selectedItem || selectedItem.formFieldAnnotationType !== 'Button') {
            return;
        }
        // Prefer the panel working copy when present so editor commits stay consistent.
        if (this.buttonActionPanelField) {
            selectedItem = this.buttonActionPanelField;
        }
        const slot: string = this.buttonActionSelectedSlot || 'mouseUp';
        const beforeSlot: { [key: string]: unknown } = {};
        const beforeActions: ActionsSettingsModel = selectedItem.actions as ActionsSettingsModel;
        if (beforeActions && !isNullOrUndefined((beforeActions as { [key: string]: unknown })[slot as string])) {
            beforeSlot[slot as string] =
                JSON.parse(JSON.stringify((beforeActions as { [key: string]: unknown })[slot as string]));
        }
        // I3: track the slot the most recent programmatic write touched so re-opening the
        // dialog lands on the same slot.
        this.lastButtonActionSlot = slot;
        // I2: None means delete this slot only; do not re-commit GoTo from editors.
        if (this.buttonActionSelectedType === 'None') {
            this.clearSelectedButtonActionSlot();
        } else {
            this.commitCurrentSlotGoToFromEditors();
        }
        // After commit/clear, selectedItem.actions may now hold the new slot state.
        // I5: per-slot undo capture only when the selected slot actually changed.
        const afterSlot: { [key: string]: unknown } = {};
        const afterActions: ActionsSettingsModel = selectedItem.actions as ActionsSettingsModel;
        if (afterActions && !isNullOrUndefined((afterActions as { [key: string]: unknown })[slot as string])) {
            afterSlot[slot as string] = (afterActions as { [key: string]: unknown })[slot as string];
        }
        const slotChanged: boolean = JSON.stringify(beforeSlot) !== JSON.stringify(afterSlot);
        try {
            if (this.pdfViewer.annotation && slotChanged) {
                const pageNumber: number = !isNullOrUndefined(selectedItem.pageIndex)
                    ? Number(selectedItem.pageIndex) + 1
                    : (this.pdfViewerBase && this.pdfViewerBase.currentPageNumber
                        ? this.pdfViewerBase.currentPageNumber : 1);
                this.pdfViewer.annotation.addAction(
                    pageNumber,
                    null,
                    selectedItem,
                    'FormDesigner Properties Change',
                    'buttonAction:' + slot,
                    beforeSlot,
                    afterSlot
                );
            }
        } catch (e) {
            // fail-silent: undo capture is best-effort
        }
        const actions: ActionsSettingsModel = selectedItem.actions
            ? { ...(selectedItem.actions as ActionsSettingsModel) }
            : (this.buttonActionPanelField && this.buttonActionPanelField.actions
                ? { ...(this.buttonActionPanelField.actions as ActionsSettingsModel) } : {} as ActionsSettingsModel);
        selectedItem.actions = (actions && Object.keys(actions).length > 0) ? actions : undefined;
        // I6/I7: prefer full field id (and content id) over name prefix so duplicate FieldName widgets stay independent.
        const idCandidates: string[] = [];
        if (selectedItem.id) {
            idCandidates.push(selectedItem.id);
            idCandidates.push(selectedItem.id.split('_')[0]);
            if (selectedItem.id.indexOf('_content') === -1) {
                idCandidates.push(selectedItem.id + '_content');
            }
        }
        for (let n: number = 0; n < idCandidates.length; n++) {
            const nameKey: string = idCandidates[parseInt(n.toString(), 10)];
            if (nameKey && this.pdfViewer.nameTable[nameKey as string]) {
                (this.pdfViewer.nameTable[nameKey as string] as PdfFormFieldBaseModel).actions = selectedItem.actions;
            }
        }
        const collectionIndex: number = this.pdfViewer.formFieldCollections.findIndex(
            (field: FormFieldModel) => field.id === selectedItem.id ||
                (selectedItem.id && field.id === selectedItem.id.split('_')[0]));
        if (collectionIndex > -1) {
            this.pdfViewer.formFieldCollections[collectionIndex as number].actions = selectedItem.actions;
        }
    }

    private checkBoxChange(args: CheckBoxChangeEventArgs): void {
        this.checkboxCheckedState = args.checked;
    }

    private multilineCheckboxChange(args: Event): void {
        this.multilineCheckboxCheckedState = true;
    }

    private setToolTip(tooltipContent: string, targetElement: HTMLElement | Element): void {
        //initialize tooltip component
        const tooltip: Tooltip = new Tooltip({
            content: initializeCSPTemplate(
                function (): string { return tooltipContent; }
            )
        });
        const isTextInput: boolean = targetElement && (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA');
        targetElement = isTextInput && targetElement.parentElement ? targetElement.parentElement : targetElement;
        // render initialized tooltip
        tooltip.appendTo(targetElement as HTMLElement);
        tooltip.beforeOpen = this.tooltipBeforeOpen.bind(this);
        this.formFieldTooltips.push(tooltip);
    }

    private tooltipBeforeOpen(args: TooltipEventArgs): void {
        const currentFormField: PdfFormFieldBaseModel = this.pdfViewer.nameTable[args.target.id.split('_')[0] !== '' ? args.target.id.split('_')[0] : !isNullOrUndefined(args.target.firstElementChild) ? args.target.firstElementChild.id.split('_')[0] : ''];
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
        const selectedFontSize: string = selectedItem.fontSize + 'px';
        if (fontSizeItems.indexOf(selectedFontSize) === -1) {
            fontSizeItems.push(selectedFontSize);
            fontSizeItems.sort((a: string, b: string) => parseInt(a, 10) - parseInt(b, 10));
        }
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
        let textFont: Record<string, unknown>;
        if (this.pdfViewer.pdfRenderer) {
            textFont = this.pdfViewer.pdfRenderer.FallbackFontCollection;
        }
        const isDefaultFont: boolean = this.getFontFamily(selectedItem.fontFamily);
        if (!isDefaultFont && !isNullOrUndefined(textFont) && Object.keys(textFont).length > 0) {
            fontFamilyItems.push(selectedItem.fontFamily);
        }
        let fontFamily: string;
        if (fontFamilyItems.indexOf(selectedItem.fontFamily) !== -1) {
            fontFamily = selectedItem.fontFamily;
        }
        this.formFieldFontFamily = new DropDownList({ dataSource: fontFamilyItems, value: fontFamily || 'Helvetica', cssClass: 'e-pv-properties-formfield-fontfamily' }, formatdropdownContainer);
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
        this.maxLengthItem = new NumericTextBox({ format: 'n', value: selectedItem.maxLength !== 0 ? selectedItem.maxLength : 0, min: 0 }, maxLengthItemDropdown as HTMLInputElement);
        fontColorContainer.appendChild(maxLengthGroup);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Max Length'), this.maxLengthItem.element);
        if (selectedItem.formFieldAnnotationType !== 'Textbox' && selectedItem.formFieldAnnotationType !== 'PasswordField') {
            this.maxLengthItem.enabled = false;
            maxLengthContainer.style.pointerEvents = 'none';
        }
        // UI lock only for date fields — Max Length disabled in Format dialog.
        if (selectedItem.isDateField) {
            this.maxLengthItem.enabled = false;
            maxLengthContainer.style.pointerEvents = 'none';
            maxLengthGroup.style.opacity = '0.5';
        }
        appearancePropertiesDiv.appendChild(fontColorContainer);
        const colorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-color-container-style-prop' });
        const backgroundColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-fill-color-style-prop' });
        appearancePropertiesDiv.appendChild(backgroundColorContainer);
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Fill'), backgroundColorContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_fontcolor');
        this.colorDropDownElement = createElement('div', { className: 'e-pv-formfield-fontcolor-icon', id: this.pdfViewer.element.id + 'formField_fontColor' });
        this.colorDropDownElement.setAttribute('role', 'combobox');
        this.colorPalette = this.createColorPicker(this.colorDropDownElement.id, selectedItem.backgroundColor as string);
        this.colorPalette.change = this.onColorPickerChange.bind(this);
        this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Fill Color'), this.colorDropDown.element);
        backgroundColorContainer.appendChild(this.colorDropDownElement);
        colorContainer.appendChild(backgroundColorContainer);
        this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.selectedItems.formFields[0].backgroundColor as string);
        const strokeColorContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-stroke-color-style-prop' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Border'), strokeColorContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_strokecolor');
        this.strokeDropDownElement = createElement('div', { className: 'e-pv-formfield-strokecolor-icon', id: this.pdfViewer.element.id + 'formField_strokeColor' });
        this.strokeDropDownElement.setAttribute('role', 'combobox');
        this.strokeColorPicker = this.createColorPicker(this.strokeDropDownElement.id, selectedItem.borderColor as string);
        this.strokeColorPicker.change = this.onStrokePickerChange.bind(this);
        this.strokeDropDown = this.createDropDownButton(this.strokeDropDownElement, 'e-pv-annotation-stroke-icon', this.strokeColorPicker.element.parentElement);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Border Color'), this.strokeDropDown.element);
        strokeColorContainer.appendChild(this.strokeDropDownElement);
        colorContainer.appendChild(strokeColorContainer);
        this.updateColorInIcon(this.strokeDropDownElement, this.pdfViewer.selectedItems.formFields[0].borderColor as string);
        const strokeThicknessContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-stroke-thickness-style-prop' });
        this.createLabelElement(this.pdfViewer.localeObj.getConstant('Thickness'), strokeThicknessContainer, true, 'e-pv-properties-formfield-label', elementID + '_properties_formfield_strokethickness');
        this.thicknessElement = createElement('div', { className: 'e-pv-formfield-strokethickness-icon', id: this.pdfViewer.element.id + 'formField_strokethickness' });
        this.thicknessElement.setAttribute('role', 'combobox');
        const thicknessContainer: HTMLElement = this.createThicknessSlider(this.thicknessElement.id);
        this.thicknessDropDown = this.createDropDownButton(this.thicknessElement, 'e-pv-annotation-thickness-icon', thicknessContainer);
        this.thicknessDropDown.beforeOpen = this.thicknessDropDownBeforeOpen.bind(this);
        this.thicknessDropDown.open = this.thicknessPropertyDropDownOpen.bind(this);
        this.setToolTip(this.pdfViewer.localeObj.getConstant('Thickness'), this.thicknessDropDown.element);
        this.thicknessSlider.change = this.thicknessChange.bind(this);
        this.thicknessSlider.changed = this.thicknessChange.bind(this);
        strokeThicknessContainer.appendChild(this.thicknessElement);
        colorContainer.appendChild(strokeThicknessContainer);
        appearancePropertiesDiv.appendChild(colorContainer);
        return appearancePropertiesDiv;
    }

    /**
     * Builds DateTime Format tab content (Format + Custom only).
     *
     * The shared read-only Preview textbox lives on Row 1 of the Format tab
     * (rendered by createFormatProperties) so Date / Time no longer own their own
     * Preview row. Layout:
     *   Row 1: Format | Custom
     *
     * @private
     * @returns {HTMLElement} - format tab content
     */
    private createDateTimeFormatProperties(): HTMLElement {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields
            ? this.pdfViewer.selectedItems.formFields[0] : null;
        const elementID: string = this.pdfViewer.element.id;
        // Derive date/time sub-type from the format script only; the legacy `type` field has been removed.
        const sourceScript: string = (selectedItem && selectedItem.actions) ?
            this.pdfViewerBase.getActionsFormatScript(selectedItem.actions) : '';
        const isTimeField: boolean = !!(sourceScript && /AFTime_Format(?:Ex)?\s*\(/i.test(sourceScript));
        const typeValue: string = isTimeField ? 'time' : 'date';
        const catalog: string[] = typeValue === 'time'
            ? FormDesigner.timeFormatCatalog : FormDesigner.dateFormatCatalog;
        const pattern: string = this.parseDateTimeFormatPattern(selectedItem);
        const catalogIndex: number = catalog.indexOf(pattern);
        const isCustomInitial: boolean = catalogIndex < 0;

        const formatDiv: HTMLElement = createElement('div', { id: elementID + '_datetime_format_prop' });

        // Row 1 — Format | Custom share the format-tab row class. Custom cell stays hidden until
        // the user picks `Custom` (visibility toggled via onDateTimeFormatChanged / onDateTimeCustomInput).
        const row: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-row' });
        const formatMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-properties-format-tab-type-main-div'
        });
        const formatEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-edit-prop' });
        const formatInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-tab-format e-input' });
        formatEditDiv.appendChild(formatInput);
        formatMainDiv.appendChild(formatEditDiv);
        row.appendChild(formatMainDiv);
        // Custom cell keeps the stable hook for onDateTimeCustomInput / onDateTimeFormatChanged show-hide.
        const customRow: HTMLElement = createElement('div', {
            className: 'e-pv-properties-format-tab-preview-main-div e-pv-properties-format-tab-custom-row'
        });
        const customEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-custom-edit-prop' });
        const customInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-tab-custom e-input' });
        customEditDiv.appendChild(customInput);
        customRow.appendChild(customEditDiv);
        const customError: HTMLElement = createElement('label', {
            id: elementID + '_formField_dateTimeCustomError'
        });
        customError.className = 'e-error e-pv-properties-format-tab-custom-error';
        customError.setAttribute('role', 'alert');
        customError.setAttribute('aria-live', 'polite');
        customError.style.display = 'none';
        customRow.appendChild(customError);
        customRow.style.visibility = isCustomInitial ? 'visible' : 'hidden';
        row.appendChild(customRow);
        formatDiv.appendChild(row);

        const formatDataSource: { text: string; value: string }[] = catalog.map((p: string) => {
            return { text: p, value: p };
        });
        formatDataSource.push({ text: FormDesigner.customFormatLabel, value: FormDesigner.customFormatLabel });
        const initialFormatValue: string = catalogIndex >= 0 ? pattern : FormDesigner.customFormatLabel;

        this.formFieldDateTimeFormat = new DropDownList({
            dataSource: formatDataSource,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Format Pattern'),
            value: initialFormatValue,
            cssClass: 'e-pv-properties-formfield-format-tab-format',
            change: this.onDateTimeFormatChanged.bind(this)
        }, formatInput as HTMLInputElement);

        this.formFieldDateTimeCustom = new TextBox({
            type: 'text',
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Custom'),
            value: isCustomInitial ? pattern : '',
            enabled: isCustomInitial,
            cssClass: 'e-pv-properties-formfield-format-tab-custom',
            input: this.onDateTimeCustomInput.bind(this),
            change: this.onDateTimeCustomInput.bind(this)
        }, customInput as HTMLInputElement);
        this.formFieldDateTimeCustomError = customError;
        // Initialize validation UI from the initial value so an existing
        // custom pattern that is invalid is flagged immediately, while a
        // known-valid pattern (e.g. loaded from actions.format) stays clean.
        const initialValidity: boolean = isCustomInitial
            ? this.isValidDateTimeCustomFormat(String(pattern || ''), typeValue)
            : true;
        this.setDateTimeCustomFormatValidationUi(initialValidity, typeValue);
        // No Preview textbox here — the shared Preview on Row 1 (formFieldFormatPreview) is used.
        return formatDiv;
    }

    /**
     * Resolves active format pattern from Format tab controls.
     *
     * @private
     * @returns {string} - format pattern
     */
    private resolveDateTimeFormatPatternFromUi(): string {
        if (!this.formFieldDateTimeFormat) {
            return 'm/d/yy';
        }
        const selected: string = String(this.formFieldDateTimeFormat.value || '');
        if (selected === FormDesigner.customFormatLabel) {
            const custom: string = this.formFieldDateTimeCustom
                ? String(this.formFieldDateTimeCustom.value || '').trim() : '';
            if (custom) {
                return custom;
            }
            // Custom selected but empty — fall back to a pattern that matches the active Type
            // so the Preview reflects a time-only value when Type=Time.
            return this.isDateTimeTypeTime() ? FormDesigner.timeFormatCatalog[0] : FormDesigner.dateFormatCatalog[0];
        }
        return selected || (this.isDateTimeTypeTime() ? FormDesigner.timeFormatCatalog[0] : FormDesigner.dateFormatCatalog[0]);
    }

    /**
     * Returns true when the active Format-tab Type is set to 'time'.
     *
     * The outer Format Type dropdown owns the Date / Time selection; the date/time
     * subsection no longer renders a second Type control.
     *
     * @private
     * @returns {boolean} - whether Type=Time
     */
    private isDateTimeTypeTime(): boolean {
        const typeValue: string = String(this.formFieldFormatType
            ? this.formFieldFormatType.value || '' : '').toLowerCase();
        return typeValue === 'time';
    }

    /**
     * Builds AFDate/AFTime script for current Type + pattern.
     *
     * @param {string} pattern - format pattern
     * @param {string} fieldType - date | time
     * @private
     * @returns {string} - JS format script
     */
    private buildDateTimeFormatScript(pattern: string, fieldType: string): string {
        const safePattern: string = (pattern || '').replace(/"/g, '');
        if (fieldType === 'time') {
            return 'AFTime_FormatEx("' + safePattern + '")';
        }
        return 'AFDate_FormatEx("' + safePattern + '")';
    }

    /**
     * Sample preview string for the active pattern.
     *
     * @param {string} pattern - format pattern
     * @private
     * @returns {string} - preview text
     */
    private buildDateTimeFormatPreview(pattern: string): string {
        try {
            const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields
                ? this.pdfViewer.selectedItems.formFields[0] : null;
            const fieldValue: string = selectedItem && selectedItem.value ? String(selectedItem.value).trim() : '';
            let sample: Date = new Date();
            if (fieldValue) {
                const parsed: Date = this.parseDateTimeTextToDate(fieldValue, pattern || 'm/d/yy');
                if (parsed && !isNaN(parsed.getTime())) {
                    sample = parsed;
                }
            }
            return this.applyDateTimePattern(sample, pattern || 'm/d/yy');
        } catch (e) {
            return '';
        }
    }

    /**
     * Type dropdown change — swap Format catalog Date/Time.
     *
     * @param {object} args - dropdown change args
     * @private
     * @returns {void}
     */
    private onDateTimeTypeChanged(args: { value?: string }): void {
        if (!this.formFieldDateTimeFormat) {
            return;
        }
        const typeValue: string = args && args.value ? String(args.value) : 'date';
        const catalog: string[] = typeValue === 'time'
            ? FormDesigner.timeFormatCatalog : FormDesigner.dateFormatCatalog;
        const formatDataSource: { text: string; value: string }[] = catalog.map((p: string) => {
            return { text: p, value: p };
        });
        formatDataSource.push({ text: FormDesigner.customFormatLabel, value: FormDesigner.customFormatLabel });
        this.formFieldDateTimeFormat.dataSource = formatDataSource;
        this.formFieldDateTimeFormat.value = catalog[0];
        this.formFieldDateTimeFormat.dataBind();
        if (this.formFieldDateTimeCustom) {
            this.formFieldDateTimeCustom.enabled = false;
            this.formFieldDateTimeCustom.value = '';
            const customElement: HTMLElement = this.formFieldDateTimeCustom.element
                ? (this.formFieldDateTimeCustom.element.closest('.e-pv-properties-format-tab-custom-row') as HTMLElement) : null;
            if (customElement) {
                customElement.style.visibility = 'hidden';
            }
        }
        // Reset validation state and refresh the preview for the new Type.
        this.setDateTimeCustomFormatValidationUi(true, typeValue);
        this.refreshDateTimeFormatPreview();
    }

    /**
     * Format dropdown change — show Custom only when Custom selected.
     *
     * @param {object} args - dropdown change args
     * @private
     * @returns {void}
     */
    private onDateTimeFormatChanged(args: { value?: string }): void {
        const selected: string = args && args.value ? String(args.value) : '';
        const isCustom: boolean = selected === FormDesigner.customFormatLabel;
        if (this.formFieldDateTimeCustom) {
            this.formFieldDateTimeCustom.enabled = isCustom;
            if (!isCustom) {
                this.formFieldDateTimeCustom.value = '';
            }
            const customElement: HTMLElement = this.formFieldDateTimeCustom.element
                ? (this.formFieldDateTimeCustom.element.closest('.e-pv-properties-format-tab-custom-row') as HTMLElement) : null;
            if (customElement) {
                customElement.style.visibility = isCustom ? 'visible' : 'hidden';
            }
        }
        // Switching away from Custom always clears any previous invalid state.
        if (!isCustom) {
            this.setDateTimeCustomFormatValidationUi(true, this.isDateTimeTypeTime() ? 'time' : 'date');
        }
        this.refreshDateTimeFormatPreview();
    }

    /**
     * Custom pattern input — refresh shared Preview and validation UI.
     *
     * During 'input' (live typing), Syncfusion TextBox does not sync its
     * `.value` property until 'change' (blur/commit). Reading the live
     * DOM input keeps the Preview accurate on every keystroke.
     *
     * @private
     * @returns {void}
     */
    private onDateTimeCustomInput(): void {
        if (!this.formFieldDateTimeCustom || !this.formFieldDateTimeCustom.element) {
            return;
        }
        const liveCustom: string = String((this.formFieldDateTimeCustom.element as HTMLInputElement).value || '').trim();
        const fieldType: string = this.isDateTimeTypeTime() ? 'time' : 'date';
        // Treat empty as valid at input-time so the user can clear the field
        // without a red error flashing; OK-time validation still rejects empty.
        const isValid: boolean = !liveCustom ? true : this.isValidDateTimeCustomFormat(liveCustom, fieldType);
        this.setDateTimeCustomFormatValidationUi(isValid, fieldType);
        if (!this.formFieldFormatPreview) {
            return;
        }
        const selected: string = this.formFieldDateTimeFormat
            ? String(this.formFieldDateTimeFormat.value || '') : '';
        const usingCustom: boolean = selected === FormDesigner.customFormatLabel;
        if (usingCustom && !isValid) {
            // Suppress a misleading Preview when the pattern is invalid.
            this.formFieldFormatPreview.value = '';
            return;
        }
        const pattern: string = (usingCustom && liveCustom)
            ? liveCustom
            : (selected || (this.isDateTimeTypeTime()
                ? FormDesigner.timeFormatCatalog[0] : FormDesigner.dateFormatCatalog[0]));
        this.formFieldFormatPreview.value = this.buildDateTimeFormatPreview(pattern);
    }

    /**
     * Updates the shared Row 1 Preview from the current Format UI state.
     *
     * When Format = Custom and the typed value is invalid, the Preview is
     * intentionally cleared so users are not misled by a sample rendered
     * against an unsupported pattern.
     *
     * @private
     * @returns {void}
     */
    private refreshDateTimeFormatPreview(): void {
        if (!this.formFieldFormatPreview || !this.formFieldDateTimeFormat) {
            return;
        }
        const fieldType: string = this.isDateTimeTypeTime() ? 'time' : 'date';
        const selected: string = String(this.formFieldDateTimeFormat.value || '');
        const usingCustom: boolean = selected === FormDesigner.customFormatLabel;
        if (usingCustom) {
            const liveCustom: string = this.formFieldDateTimeCustom && this.formFieldDateTimeCustom.element
                ? String((this.formFieldDateTimeCustom.element as HTMLInputElement).value || '').trim() : '';
            const isValid: boolean = !liveCustom
                ? true
                : this.isValidDateTimeCustomFormat(liveCustom, fieldType);
            this.setDateTimeCustomFormatValidationUi(isValid, fieldType);
            if (!isValid) {
                this.formFieldFormatPreview.value = '';
                return;
            }
        } else {
            // Reset Custom validation state when switching back to a catalog entry.
            this.setDateTimeCustomFormatValidationUi(true, fieldType);
        }
        this.formFieldFormatPreview.value = this.buildDateTimeFormatPreview(
            this.resolveDateTimeFormatPatternFromUi());
    }

    /**
     * Builds the Format tab content for single-line Textbox fields.
     *
     * The tab is shared across all six categories. A Format Type dropdown at the top
     * switches between the Number / Percentage / Special subsections, the existing
     * DateTime subsection (re-used verbatim for Date and Time), and an empty subsection
     * for None. The shared read-only Preview textbox sits on the same row as the Format
     * Type dropdown so it stays visible while the subsection below swaps.
     *
     * @private
     * @returns {HTMLElement} - format tab content root
     */
    private createFormatProperties(): HTMLElement {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields ?
            this.pdfViewer.selectedItems.formFields[0] : null;
        const elementID: string = this.pdfViewer.element.id;
        const formatDiv: HTMLElement = createElement('div', { id: elementID + '_format_prop' });
        formatDiv.classList.add('e-pv-properties-format-tab');
        // Row 1 — Format Type + Preview always render on the same row, regardless of subsection.
        const firstRow: HTMLElement = createElement('div', {
            className: 'e-pv-properties-format-tab-row'
        });
        const typeMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-properties-format-tab-type-main-div'
        });
        const typeEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const typeInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-tab-type e-input' });
        typeEditDiv.appendChild(typeInput);
        typeMainDiv.appendChild(typeEditDiv);
        firstRow.appendChild(typeMainDiv);
        const previewMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-properties-format-tab-preview-main-div'
        });
        this.formFieldFormatPreviewWrapper = previewMainDiv;
        const previewEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-preview-edit-prop' });
        const previewInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-tab-preview e-input' });
        previewEditDiv.appendChild(previewInput);
        previewMainDiv.appendChild(previewEditDiv);
        firstRow.appendChild(previewMainDiv);
        formatDiv.appendChild(firstRow);
        // Subsection container hosts Number / Percentage / Special / DateTime controls only.
        this.formFieldFormatSubsection = createElement('div', { className: 'e-pv-properties-format-tab-subsection' });
        // Read the current category from the field model so the dialog opens on
        // the matching subsection with its previous selections.
        const config: AfFormatConfig = fieldConfig(selectedItem);
        const initialKind: AfFormatKind = this.resolveFormatTypeFromConfig(config, selectedItem);
        // Seed the Preview cell visibility from the opening category so the cell is
        // already in its final state before the Format Type dropdown is created.
        this.formFieldFormatPreviewWrapper.style.visibility = (initialKind === 'none') ? 'hidden' : 'visible';
        this.buildNumberSubsection();
        this.buildPercentSubsection();
        this.buildSpecialSubsection();
        this.buildDateTimeSubsection();
        formatDiv.appendChild(this.formFieldFormatSubsection);
        // Seed the subsection controls from the parsed config so a field with existing
        // Number / Percentage / Special scripts opens with the right values.
        this.seedFormatSubsectionControls(config);
        // Format Type dropdown options in the order the spec mandates:
        // None, Number, Percentage, Date, Time, Special.
        this.formFieldFormatType = new DropDownList({
            dataSource: [
                { text: this.pdfViewer.localeObj.getConstant('None'), value: 'none' },
                { text: this.pdfViewer.localeObj.getConstant('Number'), value: 'number' },
                { text: this.pdfViewer.localeObj.getConstant('Percentage'), value: 'percent' },
                { text: this.pdfViewer.localeObj.getConstant('Date'), value: 'date' },
                { text: this.pdfViewer.localeObj.getConstant('Time'), value: 'time' },
                { text: this.pdfViewer.localeObj.getConstant('Special'), value: 'special' }
            ],
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Type'),
            value: initialKind,
            cssClass: 'e-pv-properties-formfield-format-tab-type',
            change: this.onFormatTypeChanged.bind(this)
        }, typeInput as HTMLInputElement);
        this.formFieldFormatPreview = new TextBox({
            type: 'text',
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Preview'),
            value: '',
            readonly: true,
            cssClass: 'e-pv-properties-formfield-format-tab-preview'
        }, previewInput as HTMLInputElement);
        // Seed the tracker with the opening category so the seeded catalog / pattern
        // are NOT rebuilt by the bootstrap call below (matches the pre-regression intent).
        this.previousFormatTypeKind = initialKind;
        this.onFormatTypeChanged({ value: initialKind });
        return formatDiv;
    }
    /**
     * Resolves the dialog Format Type id from a parsed AF config and the selected field.
     *
     * The legacy `isDateField` flag and the parsed AF kind both contribute. A field
     * marked `isDateField` always opens on Date or Time (matching the previous behavior);
     * non-date fields open on the kind parsed from their actions scripts.
     *
     * @private
     * @param {AfFormatConfig} config - parsed AF config
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @returns {AfFormatKind} - dialog category id ('none' | 'number' | 'percent' | 'date' | 'time' | 'special')
     */
    private resolveFormatTypeFromConfig(config: AfFormatConfig, selectedItem: PdfFormFieldBaseModel): AfFormatKind {
        if (selectedItem && selectedItem.isDateField) {
            return config && config.kind === 'time' ? 'time' : 'date';
        }
        if (config && (config.kind === 'number' || config.kind === 'percent' || config.kind === 'special'
            || config.kind === 'date' || config.kind === 'time')) {
            return config.kind;
        }
        return 'none';
    }
    /**
     * Builds the Number subsection host with all controls. The host is appended to the
     * Format tab subsection container; it is shown only when Format Type = Number.
     *
     * @private
     * @returns {void}
     */
    private buildNumberSubsection(): void {
        const subsection: HTMLElement = createElement('div', { className: 'e-pv-properties-format-number-subsection' });
        this.formFieldNumberSubsection = subsection;
        // Row 1: Decimal Places + Separator Style.
        const rowOne: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-row' });
        const decimalsMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-type-main-div' });
        const decimalsEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const decimalsInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-number-decimals e-input' });
        decimalsEditDiv.appendChild(decimalsInput);
        decimalsMainDiv.appendChild(decimalsEditDiv);
        rowOne.appendChild(decimalsMainDiv);
        const separatorMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-preview-main-div' });
        const separatorEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const separatorInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-number-separator e-input' });
        separatorEditDiv.appendChild(separatorInput);
        separatorMainDiv.appendChild(separatorEditDiv);
        rowOne.appendChild(separatorMainDiv);
        subsection.appendChild(rowOne);
        // Row 2: Currency Symbol + Symbol Location.
        const rowTwo: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-row' });
        const currencyMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-type-main-div' });
        const currencyEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const currencyInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-number-currency e-input' });
        currencyEditDiv.appendChild(currencyInput);
        currencyMainDiv.appendChild(currencyEditDiv);
        rowTwo.appendChild(currencyMainDiv);
        const locationMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-preview-main-div' });
        const locationEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const locationInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-number-location e-input' });
        locationEditDiv.appendChild(locationInput);
        locationMainDiv.appendChild(locationEditDiv);
        rowTwo.appendChild(locationMainDiv);
        subsection.appendChild(rowTwo);
        // Row 3: Negative Number Style checkboxes — placed side-by-side like the other
        // rows so the "Show parentheses " and "Use red text" checkboxes align with the
        // column rhythm defined by Type | Preview and Currency Symbol | Symbol Location.
        // The column wrappers reuse the same format-tab-type-main-div / format-tab-preview-main-div
        // classes as the dropdown rows so each checkbox column participates in the same
        // vertical rhythm as the dropdown columns above it (no extra top whitespace).
        const negativeRow: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-row' });
        const parensMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-type-main-div' });
        const parensEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const parensHost: HTMLElement = createElement('input', { className: 'e-pv-properties-format-number-parens e-input' });
        parensEditDiv.appendChild(parensHost);
        parensMainDiv.appendChild(parensEditDiv);
        negativeRow.appendChild(parensMainDiv);
        const redMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-preview-main-div' });
        const redEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const redHost: HTMLElement = createElement('input', { className: 'e-pv-properties-format-number-red e-input' });
        redEditDiv.appendChild(redHost);
        redMainDiv.appendChild(redEditDiv);
        negativeRow.appendChild(redMainDiv);
        subsection.appendChild(negativeRow);
        this.formFieldFormatSubsection.appendChild(subsection);
        // Build the Syncfusion controls now that the DOM hosts exist.
        const decimalsOptions: { text: string, value: string }[] = [];
        for (let i: number = 0; i <= 10; i++) {
            decimalsOptions.push({ text: String(i), value: String(i) });
        }
        this.formFieldNumberDecimals = new DropDownList({
            dataSource: decimalsOptions,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Decimal Places'),
            value: String(DEFAULT_DECIMALS),
            cssClass: 'e-pv-properties-formfield-format-number-decimals',
            change: this.onFormatNumberChanged.bind(this)
        }, decimalsInput as HTMLInputElement);
        const separatorOptions: { text: string, value: string }[] = SEPARATOR_STYLE_CATALOG.map(
            (entry: { id: string, sample: string }) => ({ text: entry.sample, value: entry.id }));
        this.formFieldNumberSeparator = new DropDownList({
            dataSource: separatorOptions,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Separator Style'),
            value: separatorIdOf(0),
            cssClass: 'e-pv-properties-formfield-format-number-separator',
            change: this.onFormatNumberChanged.bind(this)
        }, separatorInput as HTMLInputElement);
        const currencyOptions: { text: string, value: string }[] = CURRENCY_SYMBOL_CATALOG.map(
            (entry: { id: string, text: string }) => ({ text: entry.text, value: entry.id }));
        this.formFieldNumberCurrency = new DropDownList({
            dataSource: currencyOptions,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Currency Symbol'),
            value: 'none',
            cssClass: 'e-pv-properties-formfield-format-number-currency',
            change: this.onFormatNumberChanged.bind(this)
        }, currencyInput as HTMLInputElement);
        const locationOptions: { text: string, value: string }[] = CURRENCY_LOCATION_CATALOG.map(
            (entry: { id: string, label: string }) => ({ text: entry.label, value: entry.id }));
        this.formFieldNumberLocation = new DropDownList({
            dataSource: locationOptions,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Symbol Location'),
            value: 'beforeSpace',
            cssClass: 'e-pv-properties-formfield-format-number-location',
            enabled: false,
            change: this.onFormatNumberChanged.bind(this)
        }, locationInput as HTMLInputElement);
        this.formFieldNumberParens = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Show parentheses'),
            cssClass: 'e-pv-properties-form-field-checkbox',
            change: this.onFormatNumberChanged.bind(this)
        }, parensHost as HTMLInputElement);
        this.formFieldNumberRed = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Use red text'),
            cssClass: 'e-pv-properties-form-field-checkbox',
            change: this.onFormatNumberChanged.bind(this)
        }, redHost as HTMLInputElement);
    }
    /**
     * Builds the Percentage subsection host.
     *
     * @private
     * @returns {void}
     */
    private buildPercentSubsection(): void {
        const subsection: HTMLElement = createElement('div', { className: 'e-pv-properties-format-percent-subsection' });
        this.formFieldPercentSubsection = subsection;
        const rowOne: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-row' });
        const decimalsMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-type-main-div' });
        const decimalsEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const decimalsInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-percent-decimals e-input' });
        decimalsEditDiv.appendChild(decimalsInput);
        decimalsMainDiv.appendChild(decimalsEditDiv);
        rowOne.appendChild(decimalsMainDiv);
        const separatorMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-preview-main-div' });
        const separatorEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const separatorInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-percent-separator e-input' });
        separatorEditDiv.appendChild(separatorInput);
        separatorMainDiv.appendChild(separatorEditDiv);
        rowOne.appendChild(separatorMainDiv);
        subsection.appendChild(rowOne);
        this.formFieldFormatSubsection.appendChild(subsection);
        const decimalsOptions: { text: string, value: string }[] = [];
        for (let i: number = 0; i <= 10; i++) {
            decimalsOptions.push({ text: String(i), value: String(i) });
        }
        this.formFieldPercentDecimals = new DropDownList({
            dataSource: decimalsOptions,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Decimal Places'),
            value: String(DEFAULT_DECIMALS),
            cssClass: 'e-pv-properties-formfield-format-percent-decimals',
            change: this.onFormatPercentChanged.bind(this)
        }, decimalsInput as HTMLInputElement);
        const separatorOptions: { text: string, value: string }[] = SEPARATOR_STYLE_CATALOG.map(
            (entry: { id: string, sample: string }) => ({ text: entry.sample, value: entry.id }));
        this.formFieldPercentSeparator = new DropDownList({
            dataSource: separatorOptions,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Separator Style'),
            value: separatorIdOf(0),
            cssClass: 'e-pv-properties-formfield-format-percent-separator',
            change: this.onFormatPercentChanged.bind(this)
        }, separatorInput as HTMLInputElement);
    }
    /**
     * Builds the Special subsection host.
     *
     * @private
     * @returns {void}
     */
    private buildSpecialSubsection(): void {
        const subsection: HTMLElement = createElement('div', { className: 'e-pv-properties-format-special-subsection' });
        this.formFieldSpecialSubsection = subsection;
        // Single row mirroring the date/time Format | Custom layout:
        //   Special Type (left, type-main-div) | Mask (right, preview-main-div)
        // The Mask cell uses visibility: hidden / visible so the right-hand
        // column's grid space stays reserved even when the Mask field is not
        // in use (same pattern as the date Custom cell). The Mask column uses
        // the preview-main-div class so the theme's column widths for
        // Format | Custom apply to Special Type | Mask.
        const row: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-row' });
        const typeMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-format-tab-type-main-div' });
        const typeEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const typeInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-special-type e-input' });
        typeEditDiv.appendChild(typeInput);
        typeMainDiv.appendChild(typeEditDiv);
        row.appendChild(typeMainDiv);
        const maskMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-properties-format-tab-preview-main-div e-pv-properties-format-tab-special-mask-cell'
        });
        const maskEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-type-edit-prop' });
        const maskInput: HTMLElement = createElement('input', { className: 'e-pv-properties-format-special-mask e-input' });
        maskEditDiv.appendChild(maskInput);
        maskMainDiv.appendChild(maskEditDiv);
        row.appendChild(maskMainDiv);
        subsection.appendChild(row);
        this.formFieldFormatSubsection.appendChild(subsection);
        const typeOptions: { text: string, value: string }[] = SPECIAL_TYPE_CATALOG.map(
            (entry: { id: string, label: string }) => ({ text: entry.label, value: entry.id }));
        this.formFieldSpecialType = new DropDownList({
            dataSource: typeOptions,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Special Type'),
            value: 'zip',
            cssClass: 'e-pv-properties-formfield-format-special-type',
            change: this.onFormatSpecialChanged.bind(this)
        }, typeInput as HTMLInputElement);
        this.formFieldSpecialMask = new TextBox({
            type: 'text',
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Mask'),
            value: '',
            cssClass: 'e-pv-properties-formfield-format-special-mask',
            enabled: false,
            input: this.onFormatSpecialChanged.bind(this),
            change: this.onFormatSpecialChanged.bind(this)
        }, maskInput as HTMLInputElement);
        // Visibility: hidden keeps the right-hand column's space reserved.
        maskMainDiv.style.visibility = 'hidden';
    }
    /**
     * Builds the DateTime subsection host by reusing the existing date/time controls.
     *
     * @private
     * @returns {void}
     */
    private buildDateTimeSubsection(): void {
        const subsection: HTMLElement = createElement('div', { className: 'e-pv-properties-format-datetime-subsection' });
        this.formFieldFormatDateTimeSubsection = subsection;
        this.formFieldFormatDateTimeSubsection.appendChild(this.createDateTimeFormatProperties());
        this.formFieldFormatSubsection.appendChild(subsection);
        // The outer Format Type dropdown covers date vs time, so the date/time subsection
        // does not render its own Type column. The Format Type dropdown drives the format
        // catalog through onFormatTypeChanged, so both stay in sync.
    }
    /**
     * Format Type dropdown change handler.
     *
     * Shows or hides the matching subsection and refreshes the Preview textbox.
     * Date and Time delegate to the existing date/time handlers so the Custom
     * validation UI and the live date preview stay in sync.
     *
     * @private
     * @param {Object} args - dropdown change args
     * @param {string} [args.value] - dropdown value
     * @returns {void}
     */
    private onFormatTypeChanged(args: { value?: string }): void {
        const kind: string = args && args.value ? String(args.value) : 'none';
        if (this.formFieldNumberSubsection) {
            this.formFieldNumberSubsection.style.display = (kind === 'number') ? '' : 'none';
        }
        if (this.formFieldPercentSubsection) {
            this.formFieldPercentSubsection.style.display = (kind === 'percent') ? '' : 'none';
        }
        if (this.formFieldSpecialSubsection) {
            this.formFieldSpecialSubsection.style.display = (kind === 'special') ? '' : 'none';
        }
        if (this.formFieldFormatDateTimeSubsection) {
            this.formFieldFormatDateTimeSubsection.style.display = (kind === 'date' || kind === 'time') ? '' : 'none';
        }
        if (this.formFieldFormatPreviewWrapper) {
            // 'None' applies no format, so there is no sample to preview and the
            // Preview cell is hidden. visibility keeps the column space reserved
            // (same pattern as the Date Custom cell), so the Format Type dropdown
            // does not shift when the type changes.
            this.formFieldFormatPreviewWrapper.style.visibility = (kind === 'none') ? 'hidden' : 'visible';
        }
        if (this.formFieldNumberLocation) {
            const currencyId: string = this.formFieldNumberCurrency && this.formFieldNumberCurrency.value
                ? String(this.formFieldNumberCurrency.value) : 'none';
            this.formFieldNumberLocation.enabled = currencyId !== 'none';
        }
        if (kind === 'date' || kind === 'time') {
            // The Format Type dropdown owns the Date / Time selection, so it drives the
            // format catalog swap to keep Format / Custom aligned. The guard compares
            // against the previously-rendered kind (not the live dropdown value, which
            // Syncfusion already updated before this `change` event fires) so a real
            // Date↔Time switch triggers the catalog rebuild and the seeded pattern on dialog
            // open is preserved.
            if (this.previousFormatTypeKind !== kind) {
                this.onDateTimeTypeChanged({ value: kind });
            }
            // Date / Time share the Row 1 Preview with every other kind.
            this.refreshDateTimeFormatPreview();
        } else {
            // The Preview textbox on Row 1 is visible for every Format Type except
            // 'None'; refresh its value so the sample matches the selection.
            this.refreshFormatPreview();
        }
        // Track the kind this handler actually rendered for so the next `change`
        // event can tell Date↔Time apart from a no-op (e.g. bootstrap call above).
        // `kind` is a plain string here; it is one of the six AfFormatKind literals at
        // runtime (the dropdown dataSource, the bootstrap default `'none'`, and the
        // AfFormatKind union keep this honest).
        this.previousFormatTypeKind = kind as AfFormatKind;
    }
    /**
     * Number subsection change handler. Refreshes the Preview.
     *
     * @private
     * @returns {void}
     */
    private onFormatNumberChanged(): void {
        if (this.formFieldNumberLocation) {
            const currencyId: string = this.formFieldNumberCurrency && this.formFieldNumberCurrency.value
                ? String(this.formFieldNumberCurrency.value) : 'none';
            this.formFieldNumberLocation.enabled = currencyId !== 'none';
        }
        this.refreshFormatPreview();
    }
    /**
     * Percentage subsection change handler. Refreshes the Preview.
     *
     * @private
     * @returns {void}
     */
    private onFormatPercentChanged(): void {
        this.refreshFormatPreview();
    }
    /**
     * Special subsection change handler. Shows the Mask row only when Arbitrary Mask is
     * selected, then refreshes the Preview.
     *
     * @private
     * @returns {void}
     */
    private onFormatSpecialChanged(): void {
        if (this.formFieldSpecialType && this.formFieldSpecialMask) {
            const specialId: string = String(this.formFieldSpecialType.value || 'zip');
            const info: { value: number, isMask: boolean } = specialInfoOf(specialId);
            const maskCell: HTMLElement = this.formFieldSpecialMask.element
                ? (this.formFieldSpecialMask.element.closest('.e-pv-properties-format-tab-special-mask-cell') as HTMLElement)
                : null;
            if (maskCell) {
                maskCell.style.visibility = info.isMask ? 'visible' : 'hidden';
            }
            this.formFieldSpecialMask.enabled = info.isMask;
            if (!info.isMask) {
                this.formFieldSpecialMask.value = '';
            }
        }
        this.refreshFormatPreview();
    }
    /**
     * Recomputes the Preview textbox from the active subsection.
     *
     * @private
     * @returns {void}
     */
    private refreshFormatPreview(): void {
        if (!this.formFieldFormatPreview || !this.formFieldFormatType) {
            return;
        }
        const kind: string = String(this.formFieldFormatType.value || 'none');
        // The color is recomputed on every refresh so a color from the previous
        // selection is never left behind on the Preview.
        this.setFormatPreviewColor('');
        if (kind === 'none') {
            this.formFieldFormatPreview.value = '';
            return;
        }
        const config: AfFormatConfig = this.buildConfigFromDialog(kind);
        if (kind === 'date' || kind === 'time') {
            // Date / Time delegate to the date/time preview path so the Custom validation
            // and the existing sample rendering stay authoritative.
            this.refreshDateTimeFormatPreview();
            return;
        }
        if (!config) {
            this.formFieldFormatPreview.value = '';
            return;
        }
        const sample: string = previewSampleValue(config);
        const formatted: { text: string, color?: string } = formatValue(config, sample);
        this.formFieldFormatPreview.value = formatted.text;
        // The Negative Number Style "Use red text" option colors the Preview the same
        // way the field colors its negative values.
        this.setFormatPreviewColor(formatted.color || '');
    }
    /**
     * Applies the text color of the Format tab Preview textbox.
     *
     * An empty color removes the inline color so the Preview falls back to the
     * theme default instead of keeping the color of the previous selection.
     *
     * @private
     * @param {string} color - CSS color for the Preview text
     * @returns {void}
     */
    private setFormatPreviewColor(color: string): void {
        if (!this.formFieldFormatPreview || !this.formFieldFormatPreview.element) {
            return;
        }
        this.formFieldFormatPreview.element.style.color = color;
    }
    /**
     * Reads the mask the user typed into the Special | Mask textbox.
     *
     * Syncfusion TextBox does not update its `.value` property during the 'input'
     * event; the live keystroke value lives only on the DOM input element until
     * 'change' fires (on blur/commit). Reading the live DOM input keeps the Preview
     * accurate on every keystroke instead of only after the field loses focus.
     *
     * @private
     * @returns {string} the mask the user typed
     */
    private getSpecialMaskInputValue(): string {
        if (!this.formFieldSpecialMask) {
            return '';
        }
        const element: HTMLInputElement = this.formFieldSpecialMask.element as HTMLInputElement;
        if (element && element.value != null) {
            return String(element.value);
        }
        return String(this.formFieldSpecialMask.value || '');
    }
    /**
     * Builds an AF config from the current subsection UI selections.
     *
     * @private
     * @param {string} kind - subsection kind (number | percent | special)
     * @returns {AfFormatConfig} parsed config matching the dialog selections
     */
    private buildConfigFromDialog(kind: string): AfFormatConfig {
        const base: AfFormatConfig = {
            kind: 'none', decimals: 0, separator: 0, negative: 0, currency: '', prepend: false,
            specialType: -1, mask: '', formatScript: '', keystrokeScript: '', currencySpacing: 'none'
        };
        if (kind === 'number') {
            const decimals: number = parseInt(String((this.formFieldNumberDecimals && this.formFieldNumberDecimals.value)
                || String(DEFAULT_DECIMALS)), 10);
            const separator: number = separatorValueOf(String((this.formFieldNumberSeparator && this.formFieldNumberSeparator.value)
                || 'commaPeriod'));
            const currencyId: string = String((this.formFieldNumberCurrency && this.formFieldNumberCurrency.value) || 'none');
            const currency: string = currencyTextOf(currencyId);
            const locationId: string = String((this.formFieldNumberLocation && this.formFieldNumberLocation.value) || 'beforeSpace');
            const location: { prepend: boolean, spacing: 'none' | 'space' } = currencyLocationOf(locationId);
            const parens: boolean = !!(this.formFieldNumberParens && this.formFieldNumberParens.checked);
            const red: boolean = !!(this.formFieldNumberRed && this.formFieldNumberRed.checked);
            const negative: number = (parens && red) ? 3 : (parens ? 2 : (red ? 1 : 0));
            return {
                ...base, kind: 'number', decimals: isNaN(decimals) ? DEFAULT_DECIMALS : decimals, separator: separator,
                negative: negative, currency: currency, prepend: location.prepend, currencySpacing: location.spacing
            };
        }
        if (kind === 'percent') {
            const decimals: number = parseInt(String((this.formFieldPercentDecimals && this.formFieldPercentDecimals.value)
                || String(DEFAULT_DECIMALS)), 10);
            const separator: number = separatorValueOf(String((this.formFieldPercentSeparator && this.formFieldPercentSeparator.value)
                || 'commaPeriod'));
            return { ...base, kind: 'percent', decimals: isNaN(decimals) ? DEFAULT_DECIMALS : decimals, separator: separator };
        }
        if (kind === 'special') {
            const specialId: string = String((this.formFieldSpecialType && this.formFieldSpecialType.value) || 'zip');
            const info: { value: number, isMask: boolean } = specialInfoOf(specialId);
            if (info.isMask) {
                const mask: string = this.getSpecialMaskInputValue();
                return { ...base, kind: 'special', specialType: -1, mask: mask };
            }
            return { ...base, kind: 'special', specialType: info.value };
        }
        return base;
    }
    /**
     * Seeds Number / Percentage / Special subsection controls from the parsed AF config.
     *
     * Called once when the dialog opens. The dropdowns default to the catalog defaults
     * (Decimal Places = 2, Separator Style = commaPeriod, Currency = None, Symbol Location =
     * Before with space, Negative Style = minus / not red, Special Type = Zip Code); this
     * helper only overrides them when the field carries a recognized AF script.
     *
     * @private
     * @param {AfFormatConfig} config - parsed AF config
     * @returns {void}
     */
    private seedFormatSubsectionControls(config: AfFormatConfig): void {
        if (!config) {
            return;
        }
        if (config.kind === 'number') {
            if (this.formFieldNumberDecimals) {
                this.formFieldNumberDecimals.value = String(config.decimals != null ? config.decimals : DEFAULT_DECIMALS);
            }
            if (this.formFieldNumberSeparator) {
                this.formFieldNumberSeparator.value = separatorIdOf(config.separator || 0);
            }
            if (this.formFieldNumberCurrency) {
                this.formFieldNumberCurrency.value = currencyIdOf(config.currency || '');
            }
            if (this.formFieldNumberLocation) {
                this.formFieldNumberLocation.value = currencyLocationIdOf(
                    !!config.prepend, config.currencySpacing === 'space' ? 'space' : 'none');
                this.formFieldNumberLocation.enabled = !!config.currency;
            }
            if (this.formFieldNumberParens) {
                this.formFieldNumberParens.checked = config.negative === 2 || config.negative === 3;
            }
            if (this.formFieldNumberRed) {
                this.formFieldNumberRed.checked = config.negative === 1 || config.negative === 3;
            }
            return;
        }
        if (config.kind === 'percent') {
            if (this.formFieldPercentDecimals) {
                this.formFieldPercentDecimals.value = String(config.decimals != null ? config.decimals : DEFAULT_DECIMALS);
            }
            if (this.formFieldPercentSeparator) {
                this.formFieldPercentSeparator.value = separatorIdOf(config.separator || 0);
            }
            return;
        }
        if (config.kind === 'special') {
            if (this.formFieldSpecialType) {
                this.formFieldSpecialType.value = config.mask
                    ? 'arbitraryMask'
                    : specialIdOf(config.specialType, false);
            }
            if (this.formFieldSpecialMask) {
                this.formFieldSpecialMask.value = config.mask || '';
                this.formFieldSpecialMask.enabled = !!config.mask;
                const maskCell: HTMLElement = this.formFieldSpecialMask.element
                    ? (this.formFieldSpecialMask.element.closest('.e-pv-properties-format-tab-special-mask-cell') as HTMLElement)
                    : null;
                if (maskCell) {
                    maskCell.style.visibility = config.mask ? 'visible' : 'hidden';
                }
            }
        }
    }

    /**
     * Applies Format tab Type/actions.format on OK for isDateField textboxes.
     * Preserves value string verbatim (no auto-reformat).
     *
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @param {number} index - session form field index
     * @param {any} formFieldsData - session JSON array
     * @private
     * @returns {boolean} - true when commit succeeded; false when blocked by validation
     */
    private applyFormatFromDialog(selectedItem: PdfFormFieldBaseModel, index: number, formFieldsData: any): boolean {
        if (!selectedItem || !this.formFieldFormatType) {
            return true;
        }
        const kind: string = String(this.formFieldFormatType.value || 'none');
        // The format kind decides the field's *shape*: Date / Time render a datetime
        // composite (text + picker), every other kind renders a plain textbox. The
        // element is built once, at creation time, from `isDateField` — so a kind
        // change has to rebuild it, otherwise the field keeps rendering (and
        // behaving) as its previous kind.
        const wasDateField: boolean = selectedItem.isDateField === true;
        const willBeDateField: boolean = kind === 'date' || kind === 'time';
        // Date / Time delegate to the existing applyDateTimeFormatFromDialog so the Custom
        // validation, format pattern and picker type all stay authoritative. The Format Type
        // dropdown is the source of truth; the legacy Type dropdown inside the date/time
        // subsection was already synced by onFormatTypeChanged.
        if (willBeDateField) {
            selectedItem.isDateField = true;
            const applied: boolean = this.applyDateTimeFormatFromDialog(selectedItem, index, formFieldsData);
            if (!applied) {
                // Custom format validation failed — keep the flag as it was so the
                // field is not left half-converted.
                selectedItem.isDateField = wasDateField;
                return false;
            }
            this.syncDateFieldFlag(selectedItem, index, formFieldsData, true);
            if (wasDateField !== true) {
                this.rebuildTextboxElementForFormat(selectedItem, true);
            }
            return true;
        }
        // Non-date categories always clear the date flag. The isDateField path is owned by
        // the DateTime subsystem and only its OK path is allowed to write its triad.
        selectedItem.isDateField = false;
        if (kind === 'none') {
            this.persistFormatActions(selectedItem, index, formFieldsData, null, null, 'none');
            this.syncDateFieldFlag(selectedItem, index, formFieldsData, false);
            if (wasDateField === true) {
                this.rebuildTextboxElementForFormat(selectedItem, false);
            }
            return true;
        }
        const config: AfFormatConfig = this.buildConfigFromDialog(kind);
        if (!config) {
            return true;
        }
        const built: { format: string | null, keyPressed: string | null } = buildScripts(config);
        this.persistFormatActions(selectedItem, index, formFieldsData,
                                  built.format, built.keyPressed, kind === 'special' && config.mask ? 'mask' : kind);
        this.syncDateFieldFlag(selectedItem, index, formFieldsData, false);
        if (wasDateField === true) {
            this.rebuildTextboxElementForFormat(selectedItem, false);
        }
        return true;
    }
    /**
     * Fans the `isDateField` flag out to the session row, the base collection row and
     * the name table, mirroring what `persistFormatActions` does for `actions`. Without
     * this the flag lives only on the in-memory object, so the field reverts to its
     * previous kind as soon as the field model is re-hydrated (dialog reopen, page
     * navigation, session restore).
     *
     * @private
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @param {number} index - session form field index
     * @param {any} formFieldsData - session JSON array
     * @param {boolean} isDateField - the new date/time flag value
     * @returns {void}
     */
    private syncDateFieldFlag(selectedItem: PdfFormFieldBaseModel, index: number,
                              formFieldsData: any, isDateField: boolean): void {
        if (!selectedItem) {
            return;
        }
        selectedItem.isDateField = isDateField;
        if (index > -1 && formFieldsData && formFieldsData[parseInt(index.toString(), 10)]) {
            const sessionFormField: Record<string, any> =
                formFieldsData[parseInt(index.toString(), 10)].FormField as Record<string, any>;
            sessionFormField['isDateField'] = isDateField;
            const baseCollection: any = this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)];
            if (baseCollection && baseCollection.FormField) {
                const collectionFormField: Record<string, any> = baseCollection.FormField as Record<string, any>;
                collectionFormField['isDateField'] = isDateField;
            }
        }
        const nameKey: string = selectedItem.id ? selectedItem.id.split('_')[0] : '';
        // eslint-disable-next-line security/detect-object-injection
        if (nameKey && (this.pdfViewer.nameTable as any)[nameKey]) {
            // eslint-disable-next-line security/detect-object-injection
            ((this.pdfViewer.nameTable as any)[nameKey] as PdfFormFieldBaseModel).isDateField = isDateField;
        }
    }
    /**
     * Rebuilds a textbox field's element so it matches the field's current kind.
     * A datetime field is a composite (text input + picker button + hidden native
     * picker); every other kind is a plain text input. The element is created once,
     * at field-creation time, so switching the Format Type has to swap it here.
     *
     * @private
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @param {boolean} isDateField - true builds the datetime composite, false a plain textbox
     * @returns {void}
     */
    private rebuildTextboxElementForFormat(selectedItem: PdfFormFieldBaseModel, isDateField: boolean): void {
        if (!selectedItem) {
            return;
        }
        // `updateTextboxFormDesignerProperties` resolves the field element as
        // `<id>_content_html_element` -> first child -> first child.
        const contentRoot: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element') as HTMLElement;
        if (!contentRoot || !contentRoot.firstElementChild) {
            return;
        }
        const hostElement: HTMLElement = contentRoot.firstElementChild.firstElementChild as HTMLElement;
        if (!hostElement) {
            return;
        }
        // Nothing to swap when the field already has the right shape.
        const hasComposite: boolean = !!(hostElement.classList &&
            hostElement.classList.contains('e-pv-datetime-composite'));
        if (isDateField === hasComposite) {
            return;
        }
        const elementId: string = hostElement.id;
        const currentValue: string = selectedItem.value ? String(selectedItem.value) :
            ((hostElement as HTMLInputElement).value || '');
        hostElement.remove();
        let newElement: HTMLElement;
        if (isDateField) {
            newElement = this.createDateTimeCompositeElement(elementId, selectedItem);
        } else {
            newElement = this.createTextboxElement(elementId);
        }
        newElement.style.backgroundColor = selectedItem.backgroundColor as string;
        contentRoot.firstElementChild.appendChild(newElement);
        // Re-apply font / border / alignment / readonly / required chrome, which the
        // element factory does not carry over from the element it replaces.
        this.updateTextboxProperties(selectedItem, newElement);
        if (currentValue) {
            (newElement as HTMLInputElement).value = currentValue;
        }
    }
    /**
     * Writes the format / keyPressed scripts back onto the selected field, the session
     * JSON row, the base collection row and the name table. The viewer-side
     * `_afCurrencySpacing` marker is preserved on the field model so reopening the dialog
     * restores the user's location/space selection. The marker's lifetime is the in-memory
     * field model; the AF scripts emitted on save do not carry the marker (matches the
     * apostrophe-separator approach).
     *
     * @private
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @param {number} index - session form field index
     * @param {any} formFieldsData - session JSON array
     * @param {string | null} formatScript - format script to persist
     * @param {string | null} keyScript - keystroke script to persist
     * @param {string} kindTag - subsection tag (number | percent | special | mask | none)
     * @returns {void}
     */
    private persistFormatActions(selectedItem: PdfFormFieldBaseModel, index: number,
                                 formFieldsData: any, formatScript: string | null,
                                 keyScript: string | null, kindTag: string): void {
        const actions: { format?: { script: string }, keyPressed?: { script: string } } = {};
        if (formatScript) {
            actions.format = { script: formatScript };
        }
        if (keyScript) {
            actions.keyPressed = { script: keyScript };
        }
        const spacing: 'none' | 'space' = (kindTag === 'number' && this.formFieldNumberLocation)
            ? currencyLocationOf(String(this.formFieldNumberLocation.value || 'beforeSpace')).spacing
            : 'none';
        // Apostrophe separator (1'234.56): the AF script carries separator 4, so the
        // saved field keeps the grouping. The `_afSeparator` marker is kept alongside
        // `_afCurrencySpacing` so a field that carries the choice without a script
        // (for example a field restored from an older session) still recognises it.
        const sepMarkerValue: number = (kindTag === 'number' && this.formFieldNumberSeparator)
            ? separatorValueOf(String(this.formFieldNumberSeparator.value || 'commaPeriod'))
            : (kindTag === 'percent' && this.formFieldPercentSeparator)
                ? separatorValueOf(String(this.formFieldPercentSeparator.value || 'commaPeriod'))
                : 0;
        const sepMarker: { kind: 'number' | 'percent', value: 4 } | null =
            (kindTag === 'number' || kindTag === 'percent') && sepMarkerValue === 4
                ? { kind: kindTag, value: 4 }
                : null;
        // Viewer-side marker; AF scripts do not encode spacing so it survives only inside
        // the in-memory field model.
        (selectedItem as any)._afCurrencySpacing = spacing;
        (selectedItem as any)._afSeparator = sepMarker;
        const actionsPayload: any = (formatScript || keyScript) ? actions : null;
        selectedItem.actions = actionsPayload;
        if (index > -1 && formFieldsData && formFieldsData[parseInt(index.toString(), 10)]) {
            const sessionFormField: Record<string, any> =
                formFieldsData[parseInt(index.toString(), 10)].FormField as Record<string, any>;
            sessionFormField['actions'] = actionsPayload;
            (sessionFormField as any)._afCurrencySpacing = spacing;
            (sessionFormField as any)._afSeparator = sepMarker;
            const baseCollection: any = this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)];
            if (baseCollection && baseCollection.FormField) {
                const collectionFormField: Record<string, any> = baseCollection.FormField as Record<string, any>;
                collectionFormField['actions'] = actionsPayload;
                (collectionFormField as any)._afCurrencySpacing = spacing;
                (collectionFormField as any)._afSeparator = sepMarker;
            }
        }
        const nameKey: string = selectedItem.id ? selectedItem.id.split('_')[0] : '';
        // eslint-disable-next-line security/detect-object-injection
        if (nameKey && (this.pdfViewer.nameTable as any)[nameKey]) {
            // eslint-disable-next-line security/detect-object-injection
            ((this.pdfViewer.nameTable as any)[nameKey] as PdfFormFieldBaseModel).actions = actionsPayload;
            // eslint-disable-next-line security/detect-object-injection
            ((this.pdfViewer.nameTable as any)[nameKey] as any)._afCurrencySpacing = spacing;
            // eslint-disable-next-line security/detect-object-injection
            ((this.pdfViewer.nameTable as any)[nameKey] as any)._afSeparator = sepMarker;
        }
        // Same-name peers: re-render each peer's displayed value against the new scripts.
        this.refreshSameNameFormatPeers(selectedItem);
        // Re-render the selected field's own input so the displayed value reflects the new
        // scripts (e.g. switching None -> Number must repaint any existing value in the new
        // format). The afDisplay dataset is reset so the next blur rebuilds the formatted text.
        this.refreshSelectedFieldDisplay(selectedItem);
    }
    /**
     * Re-renders the selected field's input against the current format scripts.
     *
     * The dialog commit replaces the actions on the field model; the runtime only formats the
     * displayed value on render or on blur. This helper triggers the same re-format as a fresh
     * `updateTextboxProperties` call, without the full property-update pass.
     *
     * @private
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @returns {void}
     */
    private refreshSelectedFieldDisplay(selectedItem: PdfFormFieldBaseModel): void {
        if (!selectedItem) {
            return;
        }
        let target: HTMLElement = document.getElementById(selectedItem.id) as HTMLElement;
        if (!target) {
            return;
        }
        if (target.classList && target.classList.contains('e-pv-datetime-composite')) {
            target = (target.querySelector('.e-pv-formfield-input') as HTMLElement) || target;
        }
        // Reset af cache so the next blur rebuilds; the rendered value updates immediately.
        delete (target as any).dataset.afLast;
        delete (target as any).dataset.afDisplay;
        this.applyProgrammaticAfValue(target, selectedItem);
    }
    /**
     * Re-applies the current format to every other field that shares `selectedItem.name`.
     *
     * The runtime formats the visible value on render via `applyProgrammaticAfValue`; this
     * helper only triggers a re-render so the peers pick up the new actions on the field
     * model.
     *
     * @private
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @returns {void}
     */
    private refreshSameNameFormatPeers(selectedItem: PdfFormFieldBaseModel): void {
        if (!selectedItem || !this.pdfViewer.nameTable) {
            return;
        }
        const name: string = selectedItem.name;
        if (!name) {
            return;
        }
        const table: Record<string, PdfAnnotationBaseModel | PdfFormFieldBaseModel> = this.pdfViewer.nameTable;
        for (const key in table) {
            if (Object.prototype.hasOwnProperty.call(table, key)) {
                // The key comes from the own keys of the name table, so the lookup
                // cannot reach a property outside the table.
                // eslint-disable-next-line security/detect-object-injection
                const peer: any = table[key];
                if (peer && peer.name === name && peer !== selectedItem) {
                    // Resolve the actual text input: peer.id points to the input for plain
                    // text boxes but to the composite wrapper for date/time fields. Drill
                    // through the wrapper so applyProgrammaticAfValue sees a real input.
                    let target: HTMLElement = document.getElementById(peer.id) as HTMLElement;
                    if (target && target.classList && target.classList.contains('e-pv-datetime-composite')) {
                        target = (target.querySelector('.e-pv-formfield-input') as HTMLElement) || target;
                    }
                    if (target) {
                        this.applyProgrammaticAfValue(target, peer);
                    }
                }
            }
        }
    }
    /**
     * Applies Format tab Type/actions.format on OK for isDateField textboxes.
     *
     * @param {PdfFormFieldBaseModel} selectedItem - selected field
     * @param {number} index - session form field index
     * @param {any} formFieldsData - session JSON array
     * @private
     * @returns {boolean} - true when commit succeeded; false when blocked by validation
     */
    private applyDateTimeFormatFromDialog(selectedItem: PdfFormFieldBaseModel, index: number, formFieldsData: any): boolean {
        if (!selectedItem || !selectedItem.isDateField) {
            return true;
        }
        const fieldType: string = this.isDateTimeTypeTime() ? 'time' : 'date';
        // Validate Custom format before persisting. Empty / invalid patterns
        // must not be committed; the dialog stays open so the user can fix it.
        const selectedFormat: string = this.formFieldDateTimeFormat
            ? String(this.formFieldDateTimeFormat.value || '') : '';
        if (selectedFormat === FormDesigner.customFormatLabel) {
            const custom: string = this.formFieldDateTimeCustom && this.formFieldDateTimeCustom.element
                ? String((this.formFieldDateTimeCustom.element as HTMLInputElement).value || '').trim() : '';
            if (!this.isValidDateTimeCustomFormat(custom, fieldType)) {
                // Surface the validation UI in case the user clicked OK without
                // blurring the Custom input (and therefore missed the live flag).
                this.setDateTimeCustomFormatValidationUi(false, fieldType);
                this.isDateTimeCustomFormatCommitBlocked = true;
                return false;
            }
        }
        this.isDateTimeCustomFormatCommitBlocked = false;
        const pattern: string = this.resolveDateTimeFormatPatternFromUi();
        const script: string = this.buildDateTimeFormatScript(pattern, fieldType);
        // The legacy `type` field has been removed; the format script alone
        // is the source of truth for date vs time, so only actions need to
        // be persisted on selectedItem.
        selectedItem.actions = {
            format: { script: script }
        } as PdfFormFieldBaseModel['actions'];
        if (index > -1 && formFieldsData && formFieldsData[parseInt(index.toString(), 10)]) {
            const sessionFormField: Record<string, any> =
                formFieldsData[parseInt(index.toString(), 10)].FormField as Record<string, any>;
            sessionFormField['actions'] = selectedItem.actions;
            const baseCollection: IFormFieldCollection = this.pdfViewerBase.formFieldCollection[parseInt(index.toString(), 10)];
            if (baseCollection && baseCollection.FormField) {
                const collectionFormField: Record<string, any> = baseCollection.FormField as Record<string, any>;
                collectionFormField['actions'] = selectedItem.actions;
            }
        }
        const nameKey: string = selectedItem.id ? selectedItem.id.split('_')[0] : '';
        // eslint-disable-next-line security/detect-object-injection
        if (nameKey && this.pdfViewer.nameTable[nameKey]) {
            // eslint-disable-next-line security/detect-object-injection
            (this.pdfViewer.nameTable[nameKey] as PdfFormFieldBaseModel).actions = selectedItem.actions;
        }
        // Refresh picker icon/native type when composite is present; keep value string.
        const contentRoot: HTMLElement = document.getElementById(selectedItem.id + '_content_html_element');
        if (contentRoot) {
            const icon: HTMLElement = contentRoot.querySelector('.e-pv-datetime-calendar-icon, .e-pv-datetime-clock-icon') as HTMLElement;
            if (icon) {
                icon.className = fieldType === 'time'
                    ? 'e-pv-datetime-clock-icon e-pv-icon'
                    : 'e-pv-datetime-calendar-icon e-pv-icon';
            }
            const nativePicker: HTMLInputElement = contentRoot.querySelector('.e-pv-datetime-native-picker') as HTMLInputElement;
            if (nativePicker) {
                try {
                    nativePicker.type = this.inferNativeDateTimePicker(selectedItem) as string;
                } catch (e) {
                    // Keep previous native type if browser rejects switch.
                }
            }
            // R-FIX-DTP-02: keep placeholder in sync with the format the user just chose.
            const textInput: HTMLInputElement | null =
                contentRoot.querySelector('.e-pv-datetime-text') as HTMLInputElement;
            if (textInput) {
                const livePattern: string =
                    this.parseDateTimeFormatPattern(selectedItem) || 'm/d/yy';
                textInput.setAttribute('placeholder', livePattern);
            }
        }
        return true;
    }

    private thicknessPropertyDropDownOpen(args: OpenCloseMenuEventArgs): void {
        this.calculatePropertiesPopupPosition(args);
    }

    private calculatePropertiesPopupPosition(args: OpenCloseMenuEventArgs): void {
        const popup: HTMLElement = args.element.parentElement as HTMLElement;
        const dialogRect: DOMRect = ((document.getElementById(this.pdfViewer.element.id + '_properties_window') as HTMLElement).getBoundingClientRect()) as DOMRect;
        const popupRect: DOMRect = popup.getBoundingClientRect() as DOMRect;
        if (popupRect.right > dialogRect.right - 10) {
            popup.style.left = (parseFloat(popup.style.left) - (popupRect.right - dialogRect.right + 10)) + 'px';
        }
    }

    private thicknessChange(args: ChangeEventArgs): void {
        if (this.pdfViewer.selectedItems.formFields.length === 1) {
            this.formFieldBorderWidth = args.value.toString();
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
            const nameText: string = (args.target as HTMLInputElement).value;
            this.formFieldListItemName.value = nameText;
            if (this.formFieldExportValueBox) {
                this.formFieldExportValueBox.value = nameText;
                this.formFieldExportValueBox.dataBind();
            }
            if (nameText) {
                if (this.formFieldListItemCollection.length > 0) {
                    let exists: boolean = false;
                    for (let i: number = 0; i < this.formFieldListItemCollection.length; i++) {
                        if (this.formFieldListItemCollection[i as number] === nameText) { exists = true; break; }
                    }
                    this.formFieldAddButton.disabled = exists;
                    this.formFieldAddButton.dataBind();
                } else {
                    this.formFieldAddButton.disabled = false;
                    this.formFieldAddButton.dataBind();
                }
            }
        });
        formFieldListItemDiv.appendChild(formFieldListItemContainer);
        formFieldListItemMainDiv.appendChild(formFieldListItemDiv);
        this.formFieldListItemName = new TextBox({ type: 'text', cssClass: 'e-pv-properties-formfield-listitem' }, formFieldListItemContainer as HTMLInputElement);
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
        this.formFieldExportValueBox = new TextBox({ type: 'text', cssClass: 'e-pv-properties-formfield-exportvalue' }, formFieldExportItemContainer as HTMLInputElement);
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

    /**
     * Builds the Barcode tab for the property dialog.
     * Layout: Barcode Type (full row), Foreground/Background colors (row),
     * X Dimension (row), Border / Thickness (row), Error Correction (row).
     * @private
     * @returns {HTMLElement} - barcode tab content host
     */
    private createBarcodeProperties(): HTMLElement {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields
            ? this.pdfViewer.selectedItems.formFields[0] : null;
        const elementID: string = this.pdfViewer.element.id;
        const barcodeDiv: HTMLElement = createElement('div', { id: elementID + '_barcode_prop_appearance' });
        const styleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-style-prop' });
        barcodeDiv.appendChild(styleContainer);

        const typeMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-barcode-type-main-div' });
        const typeEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-type-edit-prop' });
        const typeInput: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-type e-input' });
        typeEditDiv.appendChild(typeInput);
        typeMainDiv.appendChild(typeEditDiv);
        styleContainer.appendChild(typeMainDiv);
        const currentType: string = (selectedItem && selectedItem.symbology) ? selectedItem.symbology : 'PDF417';
        const typeDataSource: { [key: string]: Object }[] = [
            { text: this.pdfViewer.localeObj.getConstant('PDF417'), value: 'PDF417' },
            { text: this.pdfViewer.localeObj.getConstant('QRCode'), value: 'QRCode' },
            { text: this.pdfViewer.localeObj.getConstant('DataMatrix'), value: 'DataMatrix' }
        ];
        this.barcodeSymbologyDropDown = new DropDownList({
            dataSource: typeDataSource,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Barcode Type'),
            value: currentType,
            cssClass: 'e-pv-properties-formfield-barcodetype',
            change: this.onBarcodeSymbologyChange.bind(this)
        }, typeInput as HTMLInputElement);
        const barcodeStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-edit-prop' });
        styleContainer.appendChild(barcodeStyleContainer);
        const xDimensionMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-xdimension-main-div' });
        const xDimensionEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-xdimension-edit-prop' });
        const xDimensionInput: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-xdimension e-input' });
        xDimensionEditDiv.appendChild(xDimensionInput);
        xDimensionMainDiv.appendChild(xDimensionEditDiv);
        barcodeStyleContainer.appendChild(xDimensionMainDiv);
        const xDimValue: number = (selectedItem && !isNullOrUndefined(selectedItem.xDimension)) ? selectedItem.xDimension : 4;
        this.barcodeXDimensionInput = new NumericTextBox({
            format: 'n',
            value: xDimValue,
            min: 1,
            max: 12,
            step: 1,
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('X Dimension'),
            cssClass: 'e-pv-properties-formfield-barcodedimension'
        }, xDimensionInput as HTMLInputElement);
        const ecMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-eclevel-main-div' });
        const ecEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-eclevel-edit-prop' });
        const ecInput: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-eclevel e-input' });
        ecEditDiv.appendChild(ecInput);
        ecMainDiv.appendChild(ecEditDiv);
        barcodeStyleContainer.appendChild(ecMainDiv);
        const symbologyForEc: string = (selectedItem && selectedItem.symbology) ? selectedItem.symbology : 'PDF417';
        const isQr: boolean = symbologyForEc === 'QRCode';
        const ecDataSource: { text: string, value: string }[] = isQr ? [
            { text: this.pdfViewer.localeObj.getConstant('Low'), value: 'Low' },
            { text: this.pdfViewer.localeObj.getConstant('Medium'), value: 'Medium' },
            { text: this.pdfViewer.localeObj.getConstant('Quartile'), value: 'Quartile' },
            { text: this.pdfViewer.localeObj.getConstant('High'), value: 'High' }
        ] : this.getBarcodeLevelDataSource();
        const storedEc: string = (selectedItem && selectedItem.errorCorrectionLevel) ? selectedItem.errorCorrectionLevel : '';
        const initialEc: string = storedEc || (isQr ? 'Medium' : 'Level5');
        this.barcodeErrorCorrectionDropDown = new DropDownList({
            dataSource: ecDataSource,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Error Correction Level'),
            value: initialEc,
            enabled: !isQr && symbologyForEc === 'DataMatrix' ? false : true,
            cssClass: 'e-pv-properties-formfield-barcodeec'
        }, ecInput as HTMLInputElement);

        const compressMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-barcode-compress-main-div' });
        const compressContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-compress-checkbox' });
        compressMainDiv.appendChild(compressContainer);
        styleContainer.appendChild(compressMainDiv);
        this.barcodeCompressDataCheck = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Compress Data Before Encoding to Barcode'),
            checked: !!(selectedItem && selectedItem.compressData === true),
            cssClass: 'e-pv-properties-formfield-barcodecompress'
        }, compressContainer as HTMLInputElement);

        return barcodeDiv;
    }

    private getBarcodeLevelDataSource(): { text: string; value: string }[] {
        const levelText: string = this.pdfViewer.localeObj.getConstant('Level');

        return Array.from({ length: 9 }, (_item: unknown, index: number) => ({
            text: levelText + index,
            value: 'Level' + index
        }));
    }

    /**
     * Builds the Options tab for the barcode property dialog.
     *
     * Layout: Value Format (TabDelimited / Xml / CustomValue), Source Fields
     * multi-select, Custom Value text box, Include Field Names and Compress Data.
     * @private
     * @returns {HTMLElement} - barcode options tab content host
     */
    private createBarcodeOptionsProperties(): HTMLElement {
        const selectedItem: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields
            ? this.pdfViewer.selectedItems.formFields[0] : null;
        const elementID: string = this.pdfViewer.element.id;
        const optionDiv: HTMLElement = createElement('div', { id: elementID + '_barcode_option_prop_appearance' });
        const styleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-option-prop' });
        optionDiv.appendChild(styleContainer);

        const formatMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-barcode-value-source-main-div' });
        const formatEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-value-source-edit-prop' });
        const formatInput: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-value-format e-input' });
        formatEditDiv.appendChild(formatInput);
        formatMainDiv.appendChild(formatEditDiv);
        styleContainer.appendChild(formatMainDiv);
        this.barcodeValueFormatHost = formatMainDiv;
        const formatDataSource: { text: string, value: string }[] = [
            { text: this.pdfViewer.localeObj.getConstant('Tab Delimited'), value: 'TabDelimited' },
            { text: this.pdfViewer.localeObj.getConstant('Xml'), value: 'Xml' },
            { text: this.pdfViewer.localeObj.getConstant('Custom Value'), value: 'CustomValue' }
        ];
        const initialValueFormat: string = (selectedItem && selectedItem.valueFormat) ? selectedItem.valueFormat : 'TabDelimited';
        this.barcodeValueFormatDropDown = new DropDownList({
            dataSource: formatDataSource,
            fields: { text: 'text', value: 'value' },
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Encode'),
            value: initialValueFormat,
            cssClass: 'e-pv-properties-formfield-barcodevaluesource',
            change: this.onBarcodeValueFormatChange.bind(this)
        }, formatInput as HTMLInputElement);

        const linkedMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-barcode-linkedfields-main-div' });
        const linkedEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-linkedfields-edit-prop' });
        const linkedInput: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-sourcefields e-input' });
        linkedEditDiv.appendChild(linkedInput);
        linkedMainDiv.appendChild(linkedEditDiv);
        styleContainer.appendChild(linkedMainDiv);
        const sourceFieldNames: string[] = (this.collectAvailableFormFieldNames() || []).filter((name: string) => {
            return !isNullOrUndefined(name) && name !== '';
        });
        const initialFields: string[] = (selectedItem && Array.isArray(selectedItem.fields)) ? selectedItem.fields : [];
        this.barcodeSourceFieldsMultiSelect = new MultiSelect({
            dataSource: sourceFieldNames,
            value: initialFields,
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Select Field for Calculation'),
            mode: 'CheckBox',
            cssClass: 'e-pv-properties-formfield-barcodesourcefields',
            showSelectAll: true,
            allowFiltering: false
        }, linkedInput as HTMLInputElement);
        this.barcodeSourceFieldsHost = linkedMainDiv;

        const customValueMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-barcode-value-main-div' });
        const customValueEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-value-edit-prop' });
        const customValueInput: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-customvalue e-input' });
        customValueEditDiv.appendChild(customValueInput);
        customValueMainDiv.appendChild(customValueEditDiv);
        styleContainer.appendChild(customValueMainDiv);
        const initialCustomValue: string = (selectedItem && selectedItem.customValue) ? selectedItem.customValue : '';
        this.barcodeCustomValueTextBox = new TextBox({
            type: 'text',
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Custom Value'),
            value: initialCustomValue,
            cssClass: 'e-pv-properties-formfield-barcodecustomvalue'
        }, customValueInput as HTMLInputElement);
        this.barcodeCustomValueHost = customValueMainDiv;

        const includeNamesMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-barcode-includenames-main-div' });
        const includeNamesContainer: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-includenames-checkbox' });
        includeNamesMainDiv.appendChild(includeNamesContainer);
        styleContainer.appendChild(includeNamesMainDiv);
        this.barcodeIncludeFieldNamesHost = includeNamesMainDiv;
        this.barcodeIncludeFieldNamesCheck = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Include Field Names'),
            checked: !selectedItem || selectedItem.includeFieldNames !== false,
            cssClass: 'e-pv-properties-formfield-barcodeincludenames'
        }, includeNamesContainer as HTMLInputElement);

        // Reference (PDF file name default) — bound to the caption setting.
        const referenceMainDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-form-field-barcode-reference-main-div' });
        const referenceEditDiv: HTMLElement = createElement('div', { className: 'e-pv-properties-barcode-reference-edit-prop' });
        const referenceInput: HTMLElement = createElement('input', { className: 'e-pv-properties-barcode-reference e-input' });
        referenceEditDiv.appendChild(referenceInput);
        referenceMainDiv.appendChild(referenceEditDiv);
        styleContainer.appendChild(referenceMainDiv);
        const initialReference: string = (selectedItem && !isNullOrUndefined(selectedItem.caption)) ? selectedItem.caption : '';
        this.barcodeCaptionTextBox = new TextBox({
            type: 'text',
            floatLabelType: 'Always',
            placeholder: this.pdfViewer.localeObj.getConstant('Reference'),
            value: initialReference,
            cssClass: 'e-pv-properties-formfield-barcodecaption'
        }, referenceInput as HTMLInputElement);

        this.applyBarcodeValueFormatState(initialValueFormat);

        return optionDiv;
    }

    private applyBarcodeValueFormatState(format: string): void {
        const isCustom: boolean = format === 'CustomValue';
        const isXml: boolean = format === 'Xml';
        this.setBarcodeHostEnabled(this.barcodeCustomValueHost, isCustom);
        this.setBarcodeHostEnabled(this.barcodeSourceFieldsHost, !isCustom);
        this.setBarcodeHostEnabled(this.barcodeIncludeFieldNamesHost, !isCustom);
        if (this.barcodeCustomValueTextBox) {
            this.barcodeCustomValueTextBox.enabled = isCustom;
        }
        if (this.barcodeSourceFieldsMultiSelect) {
            this.barcodeSourceFieldsMultiSelect.enabled = !isCustom;
        }
        if (this.barcodeIncludeFieldNamesCheck) {
            // Xml forces Include Field Names to true (and disables the control).
            // TabDelimited keeps the default (checked + enabled).
            // CustomValue hides the host entirely.
            this.barcodeIncludeFieldNamesCheck.disabled = isCustom || isXml;
            this.barcodeIncludeFieldNamesCheck.checked = !isCustom;
        }
    }

    private setBarcodeHostEnabled(host: HTMLElement, visible: boolean): void {
        if (!host) {
            return;
        }
        host.style.display = visible ? 'block' : 'none';
        host.style.opacity = visible ? '1' : '0.5';
        host.style.pointerEvents = visible ? 'auto' : 'none';
    }

    private onBarcodeValueFormatChange(args: any): void {
        const value: string = args && args.value ? args.value : (this.barcodeValueFormatDropDown &&
            this.barcodeValueFormatDropDown.value as string);
        this.applyBarcodeValueFormatState(value);
    }

    private onBarcodeSymbologyChange(args: any): void {
        const symbology: string = args && args.value ? args.value
            : (this.barcodeSymbologyDropDown && this.barcodeSymbologyDropDown.value as string);
        if (!this.barcodeErrorCorrectionDropDown) {
            return;
        }
        if (symbology === 'QRCode') {
            this.barcodeErrorCorrectionDropDown.dataSource = [
                { text: this.pdfViewer.localeObj.getConstant('Low'), value: 'Low' },
                { text: this.pdfViewer.localeObj.getConstant('Medium'), value: 'Medium' },
                { text: this.pdfViewer.localeObj.getConstant('Quartile'), value: 'Quartile' },
                { text: this.pdfViewer.localeObj.getConstant('High'), value: 'High' }
            ];
            this.barcodeErrorCorrectionDropDown.enabled = true;
            this.barcodeErrorCorrectionDropDown.value = 'Medium';
        } else if (symbology === 'DataMatrix') {
            this.barcodeErrorCorrectionDropDown.enabled = false;
        } else {
            this.barcodeErrorCorrectionDropDown.enabled = true;
            this.barcodeErrorCorrectionDropDown.dataSource = this.getBarcodeLevelDataSource();
            this.barcodeErrorCorrectionDropDown.value = 'Level5';
        }
        this.barcodeErrorCorrectionDropDown.dataBind();
    }

    private collectAvailableFormFieldNames(): string[] {
        const names: string[] = [];
        if (this.pdfViewerBase && this.pdfViewerBase.formFieldCollection) {
            const current: any = this.pdfViewer.selectedItems
                && this.pdfViewer.selectedItems.formFields ? this.pdfViewer.selectedItems.formFields[0] : null;
            const currentName: string = current ? current.name : '';
            // Barcode, signature, and initial fields carry no user-entered value and
            // must not appear as a source of the barcode multi-box.
            const allowedFieldTypes: string[] = ['Textbox', 'PasswordField', 'Checkbox', 'RadioButton', 'DropdownList', 'ListBox'];
            for (let i: number = 0; i < this.pdfViewerBase.formFieldCollection.length; i++) {
                const entry: any = this.pdfViewerBase.formFieldCollection[parseInt(i.toString(), 10)];
                const fieldName: string = entry && entry.FormField ? entry.FormField.name : '';
                const fieldType: string = entry && entry.FormField ? entry.FormField.formFieldAnnotationType : '';
                if (fieldName && fieldName !== currentName && allowedFieldTypes.indexOf(fieldType) !== -1) {
                    names.push(fieldName);
                }
            }
        }
        return names;
    }

    private addListItemOnClick(): void {
        const itemName: string = (this.formFieldListItemName && this.formFieldListItemName.value || '').trim();
        const itemValue: string = (this.formFieldExportValueBox && this.formFieldExportValueBox.value || itemName).trim();
        if (!itemName) { return; }
        this.formFieldListItemCollection.push(itemName);
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
        createLiElement.innerHTML = itemName;
        createLiElement.setAttribute('data-value', itemValue);
        createLiElement.classList.add('e-pv-li-select');
        ulElement.appendChild(createLiElement);
        this.formFieldDeleteButton.disabled = false;
        this.formFieldAddButton.disabled = true;
        if (createLiElement.previousElementSibling) {
            this.formFieldUpButton.disabled = false;
            this.formFieldUpButton.dataBind();
        }
        if (!createLiElement.nextElementSibling) {
            this.formFieldDownButton.disabled = true;
            this.formFieldDownButton.dataBind();
        }
        this.formFieldAddButton.dataBind();
        this.formFieldDeleteButton.dataBind();
    }

    private listItemOnClick(args: Event): void {
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
            (args.target as HTMLElement).classList.add('e-pv-li-select');
        }
        if ((args.target as HTMLElement).nextElementSibling) {
            this.formFieldDownButton.disabled = false;
        } else {
            this.formFieldDownButton.disabled = true;
        }
        if ((args.target as HTMLElement).previousElementSibling) {
            this.formFieldUpButton.disabled = false;
        } else {
            this.formFieldUpButton.disabled = true;
        }
        this.formFieldDownButton.dataBind();
        this.formFieldUpButton.dataBind();
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
                            this.formFieldUpButton.dataBind();
                        }
                    }
                    else if (element.nextElementSibling) {
                        element.nextElementSibling.classList.add('e-pv-li-select');
                        if (!element.nextElementSibling.nextElementSibling) {
                            this.formFieldDownButton.disabled = true;
                            this.formFieldDownButton.dataBind();
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
        this.formFieldDeleteButton.dataBind();
        this.formFieldUpButton.dataBind();
        this.formFieldDownButton.dataBind();
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
                    this.formFieldUpButton.dataBind();
                    if (element.nextElementSibling) {
                        this.formFieldDownButton.disabled = false;
                        this.formFieldDownButton.dataBind();
                    }
                }
            }
        }
    }

    private moveDownListItem(): void {
        let element: HTMLElement;
        const ulElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_ul_list_item');
        if (ulElement.children && ulElement.children.length > 0) {
            for (let i: number = 0; i < ulElement.children.length; i++) {
                element = ulElement.children[parseInt(i.toString(), 10)] as HTMLElement;
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
            this.formFieldDownButton.dataBind();
        }
        if (element.previousElementSibling) {
            this.formFieldUpButton.disabled = false;
            this.formFieldUpButton.dataBind();
        }
    }

    private createListElement(ulElement: HTMLElement): number {
        const selectedElement: PdfFormFieldBaseModel = this.pdfViewer.selectedItems.formFields[0];
        if (selectedElement) {
            if (selectedElement.options && selectedElement.options.length > 0) {
                for (let i: number = 0; i < selectedElement.options.length; i++) {
                    const opt: ItemModel = selectedElement.options[parseInt(i.toString(), 10)];
                    const createLiElement: HTMLElement = createElement('li', { className: 'e-pv-formfield-li-element' });
                    createLiElement.addEventListener('click', this.listItemOnClick.bind(this));
                    createLiElement.addEventListener('focus', this.focusFormField.bind(this));
                    createLiElement.addEventListener('blur', this.blurFormField.bind(this));
                    createLiElement.innerHTML = opt.itemName;
                    createLiElement.setAttribute('data-value', opt.itemValue);
                    ulElement.appendChild(createLiElement);
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

    private fontStyleClicked(args: Event): void {
        if (args.target as HTMLElement) {
            if ((args.target as HTMLElement).id.indexOf('formField_bold') !== -1) {
                const item: HTMLElement = ((args.target as HTMLElement).id.indexOf('formField_bold_div') !== -1) ? (args.target as HTMLElement) : (args.target as HTMLElement).parentElement;
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
            } else if ((args.target as HTMLElement).id.indexOf('formField_italic') !== -1) {
                const item: HTMLElement = ((args.target as HTMLElement).id.indexOf('formField_italic_div') !== -1) ? (args.target as HTMLElement) : (args.target as HTMLElement).parentElement;
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
            } else if ((args.target as HTMLElement).id.indexOf('formField_underline') !== -1) {
                const item: HTMLElement = ((args.target as HTMLElement).id.indexOf('formField_underline_textinput_div') !== -1) ? (args.target as HTMLElement) : (args.target as HTMLElement).parentElement;
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
            } else if ((args.target as HTMLElement).id.indexOf('formField_strikeout') !== -1) {
                const item: HTMLElement = ((args.target as HTMLElement).id.indexOf('formField_strikeout_div') !== -1) ? (args.target as HTMLElement) : (args.target as HTMLElement).parentElement;
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

    private fontAlignClicked(args: Event): void {
        if (args.target as HTMLElement) {
            (args.target as HTMLElement).classList.remove('e-pv-li-select');
            if ((args.target as HTMLElement).id.indexOf('_formField_left_align') !== -1) {
                const item: HTMLElement = ((args.target as HTMLElement).id.indexOf('_formField_left_align_div') !== -1) ? (args.target as HTMLElement) : (args.target as HTMLElement).parentElement;
                this.formFieldAlign = 'left';
                this.clearFontAlignIconSelection(args.currentTarget as HTMLElement);
                item.classList.add('e-pv-li-select');
            } else if ((args.target as HTMLElement).id.indexOf('_formField_right_align') !== -1) {
                const item: HTMLElement = ((args.target as HTMLElement).id.indexOf('_formField_right_align_div') !== -1) ? (args.target as HTMLElement) : (args.target as HTMLElement).parentElement;
                this.formFieldAlign = 'right';
                this.clearFontAlignIconSelection(args.currentTarget as HTMLElement);
                item.classList.add('e-pv-li-select');
            } else {
                const item: HTMLElement = ((args.target as HTMLElement).id.indexOf('_formField_center_align_div') !== -1) ? (args.target as HTMLElement) : (args.target as HTMLElement).parentElement;
                this.formFieldAlign = 'center';
                this.clearFontAlignIconSelection(args.currentTarget as HTMLElement);
                item.classList.add('e-pv-li-select');

            }
        }
    }

    private onFontColorChange(args: ColorPickerEventArgs): void {
        this.fontColorValue = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        this.updateColorInIcon(this.fontColorElement, this.fontColorValue);
        this.fontColorDropDown.toggle();
    }

    private onColorPickerChange(args: ColorPickerEventArgs): void {
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

    private onStrokePickerChange(args: ColorPickerEventArgs): void {
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

    private setReadOnlyToFormField(selectedItem: PdfFormFieldBaseModel, isReadOnly: boolean): void {
        for (let i: number = 0; i < this.pdfViewer.formFieldCollection.length; i++) {
            const formField: PdfFormFieldBaseModel =
            this.pdfViewer.formFieldCollection[parseInt(i.toString(), 10)] as PdfFormFieldBaseModel;
            if (formField.formFieldAnnotationType === selectedItem.formFieldAnnotationType &&
                formField.name === selectedItem.name && (formField.id === selectedItem.id || formField.id + '_content' === selectedItem.id)) {
                formField.isReadonly = isReadOnly;
                switch (formField.formFieldAnnotationType) {
                case 'Textbox':
                case 'PasswordField':
                case 'DropdownList':
                case 'ListBox':
                case 'SignatureField':
                case 'InitialField':
                case 'BarcodeField':
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
                case 'Button': {
                    // I1: designer Read Only must reach button DOM the same way as other types.
                    let buttonElement: Element = null;
                    const buttonHtmlHost: HTMLElement = document.getElementById(formField.id + '_content_html_element');
                    if (buttonHtmlHost) {
                        buttonElement = buttonHtmlHost.querySelector('input.e-pv-buttonItem, input[type="button"], button') as Element;
                        if (!buttonElement && buttonHtmlHost.firstElementChild) {
                            buttonElement = buttonHtmlHost.firstElementChild.firstElementChild;
                        }
                    }
                    if (buttonElement) {
                        this.setReadOnlyToElement(formField, buttonElement, isReadOnly);
                    }
                    break;
                }
                }
            }
        }
    }

    /**
     * @param {FormFieldModel[]} signatureFieldCollection - It describes about the signature field collection
     * @private
     * @returns {FormFieldModel[]} - FormFieldModel[]
     */
    public getFormDesignerSignField(signatureFieldCollection: FormFieldModel[]): FormFieldModel[] {
        const collectiondata: FormFieldModel[] = this.pdfViewer.formFieldCollections;
        let dataCollection: FormFieldType;
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
                case 'InitialField':
                case 'BarcodeField': {
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
    private isTransparentBackground(backgroundColor: string): boolean {
        if (typeof (backgroundColor) === 'object') {
            backgroundColor = JSON.stringify(backgroundColor);
        }
        return backgroundColor === '#00000000' || backgroundColor === 'transparent' || backgroundColor === 'rgba(0,0,0,0)' || backgroundColor === '{"r":0,"g":0,"b":0,"a":0}';
    }

    private setReadOnlyToElement(selectedItem: PdfFormFieldBaseModel, inputElement: Element, isReadOnly: boolean): void {
        const fillColor: string = '#daeaf7ff';
        const color: {r: number, g: number, b: number, a: number} = {r: 218, g: 234, b: 247, a: 100};
        if (selectedItem.formFieldAnnotationType === 'DropdownList' || selectedItem.formFieldAnnotationType === 'ListBox') {
            (inputElement as HTMLInputElement).parentElement.style.backgroundColor = (
                inputElement as HTMLInputElement).style.backgroundColor;
        }
        if (!isReadOnly && (inputElement as HTMLInputElement).disabled) {
            (inputElement as HTMLInputElement).disabled = false;
        }
        if (isReadOnly) {
            (inputElement as HTMLInputElement).disabled = true;
        }
        if (isReadOnly) {
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                (inputElement as HTMLInputElement).parentElement.style.cursor = 'default';
            }
            else if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
                const thickness: number = !isNullOrUndefined(selectedItem.thickness) ? 1 : selectedItem.thickness;
                (inputElement as HTMLInputElement).parentElement.style.borderWidth = `${thickness}px`;
            }
            else {
                (inputElement as HTMLInputElement).style.cursor = 'default';
            }
        }
        if (isReadOnly && this.isAddFormFieldProgrammatically) {
            this.previousBackgroundColor = selectedItem.backgroundColor as string;
        }
        if (selectedItem.formFieldAnnotationType === 'RadioButton') {
            (inputElement as HTMLInputElement).style.backgroundColor = selectedItem.isReadonly ?
                ((selectedItem.backgroundColor !== fillColor &&
                JSON.stringify(selectedItem.backgroundColor) !== JSON.stringify(color)) ? selectedItem.backgroundColor as string : 'transparent') :
                (this.isTransparentBackground(selectedItem.backgroundColor as string) ?
                    fillColor as string : selectedItem.backgroundColor as string);
        }
        else if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
            if (!isNullOrUndefined(selectedItem) && selectedItem.value === '') {
                const background: string = selectedItem.backgroundColor ? selectedItem.backgroundColor as string : '#FFE48559';
                (inputElement as HTMLInputElement).parentElement.style.backgroundColor = isReadOnly ?
                    background as string : PdfViewerUtils.setTransparencyToHex(background) as string;
            }
        }
        else {
            (inputElement as HTMLInputElement).style.backgroundColor = selectedItem.isReadonly ? (selectedItem.backgroundColor !== fillColor ? selectedItem.backgroundColor as string : 'transparent') : (this.isTransparentBackground(selectedItem.backgroundColor as string) ? fillColor : (selectedItem.backgroundColor !== this.previousBackgroundColor) ? selectedItem.backgroundColor as string : this.previousBackgroundColor as string);
        }
        // Have configured the backgroundColor of the selectedItem to ensure that transparency is maintained when downloading and loading in the viewer. Task: 855151
        selectedItem.backgroundColor = selectedItem.isReadonly ?
            ((selectedItem.backgroundColor !== fillColor && JSON.stringify(selectedItem.backgroundColor) !== JSON.stringify(color)) ? selectedItem.backgroundColor : 'transparent') :
            (this.isTransparentBackground(selectedItem.backgroundColor as string) ?
                fillColor : (selectedItem.backgroundColor !== this.previousBackgroundColor) ?
                    selectedItem.backgroundColor : this.previousBackgroundColor);
    }

    private setRequiredToElement(selectedItem: PdfFormFieldBaseModel, inputElement: Element, isRequired: boolean): void {
        if (isRequired) {
            (inputElement as HTMLInputElement).required = true;
            (inputElement as HTMLInputElement).style.border = '1px solid red';
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                const thickness: number = selectedItem.thickness === 0 ? 1 : selectedItem.thickness;
                (inputElement as HTMLInputElement).parentElement.style.boxShadow = 'red 0px 0px 0px ' + thickness + 'px';
            }
            else if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
                const thickness: number = (selectedItem.thickness > 0) ? selectedItem.thickness : 1;
                (inputElement as HTMLInputElement).style.border = thickness + 'px solid red';
            }
        } else {
            (inputElement as HTMLInputElement).required = false;
            if (selectedItem.formFieldAnnotationType === 'SignatureField' || selectedItem.formFieldAnnotationType === 'InitialField') {
                (inputElement as HTMLInputElement).style.borderWidth = `${selectedItem.thickness}px`;
            }
            else {
                (inputElement as HTMLInputElement).style.borderWidth = selectedItem.thickness + 'px';
            }
            (inputElement as HTMLInputElement).style.borderColor = selectedItem.borderColor as string;
            if (selectedItem.formFieldAnnotationType === 'RadioButton') {
                (inputElement as HTMLInputElement).parentElement.style.boxShadow = selectedItem.borderColor + ' 0px 0px 0px ' + selectedItem.thickness + 'px';
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
        this.formFieldMaxLengthGroup = null;
        if (this.barcodeSymbologyDropDown) { this.barcodeSymbologyDropDown.destroy(); this.barcodeSymbologyDropDown = null; }
        if (this.barcodeXDimensionInput) { this.barcodeXDimensionInput.destroy(); this.barcodeXDimensionInput = null; }
        if (this.barcodeErrorCorrectionDropDown) {
            this.barcodeErrorCorrectionDropDown.destroy();
            this.barcodeErrorCorrectionDropDown = null;
        }
        this.barcodeSymbologyDropDown = null;
        if (this.barcodeValueFormatDropDown) { this.barcodeValueFormatDropDown.destroy(); this.barcodeValueFormatDropDown = null; }
        this.barcodeValueFormatHost = null;
        if (this.barcodeValueTextBox) { this.barcodeValueTextBox.destroy(); this.barcodeValueTextBox = null; }
        if (this.barcodeIncludeFieldNamesCheck) { this.barcodeIncludeFieldNamesCheck.destroy(); this.barcodeIncludeFieldNamesCheck = null; }
        if (this.barcodeCompressDataCheck) { this.barcodeCompressDataCheck.destroy(); this.barcodeCompressDataCheck = null; }
        if (this.barcodeCustomValueTextBox) { this.barcodeCustomValueTextBox.destroy(); this.barcodeCustomValueTextBox = null; }
        this.barcodeCustomValueHost = null;
        if (this.barcodeSourceFieldsMultiSelect) {
            this.barcodeSourceFieldsMultiSelect.destroy();
            this.barcodeSourceFieldsMultiSelect = null;
        }
        this.barcodeSourceFieldsHost = null;
        this.barcodeIncludeFieldNamesHost = null;
        if (this.formFieldDateTimeFormat) {
            this.formFieldDateTimeFormat.destroy();
            this.formFieldDateTimeFormat = null;
        }
        if (this.formFieldDateTimeCustom) {
            this.formFieldDateTimeCustom.destroy();
            this.formFieldDateTimeCustom = null;
        }
        this.formFieldDateTimeCustomError = null;
        this.isDateTimeCustomFormatValid = true;
        this.barcodeResizeStartState = null;
        this.barcodeLastRenderableState = null;
        this.isDateTimeCustomFormatCommitBlocked = false;
        this.previousFormatTypeKind = null;
        // Format tab controls (must be torn down after the legacy date/time ones so the
        // dropdowns do not leak listeners when the dialog is reopened).
        this.destroyFormatTabControls();
        const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_properties_window');
        if (dialogElement) {
            dialogElement.parentElement.removeChild(dialogElement);
        }
    }

    /**
     * Destroys the Format tab Syncfusion controls and clears DOM references.
     *
     * The legacy date/time controls are torn down above; this helper only handles the new
     * Format tab controls (Format Type, Number / Percentage / Special dropdowns, Preview).
     *
     * @private
     * @returns {void}
     */
    private destroyFormatTabControls(): void {
        const dropdowns: (DropDownList | null)[] = [
            this.formFieldFormatType,
            this.formFieldNumberDecimals,
            this.formFieldNumberSeparator,
            this.formFieldNumberCurrency,
            this.formFieldNumberLocation,
            this.formFieldPercentDecimals,
            this.formFieldPercentSeparator,
            this.formFieldSpecialType
        ];
        for (const d of dropdowns) {
            if (d) {
                d.destroy();
            }
        }
        const checkboxes: (CheckBox | null)[] = [this.formFieldNumberParens, this.formFieldNumberRed];
        for (const cb of checkboxes) {
            if (cb) {
                cb.destroy();
            }
        }
        const textBoxes: (TextBox | null)[] = [this.formFieldSpecialMask, this.formFieldFormatPreview];
        for (const tb of textBoxes) {
            if (tb) {
                tb.destroy();
            }
        }
        this.formFieldFormatType = null;
        this.formFieldNumberDecimals = null;
        this.formFieldNumberSeparator = null;
        this.formFieldNumberCurrency = null;
        this.formFieldNumberLocation = null;
        this.formFieldNumberParens = null;
        this.formFieldNumberRed = null;
        this.formFieldPercentDecimals = null;
        this.formFieldPercentSeparator = null;
        this.formFieldSpecialType = null;
        this.formFieldSpecialMask = null;
        this.formFieldFormatPreview = null;
        this.formFieldFormatPreviewWrapper = null;
        this.formFieldFormatSubsection = null;
        this.formFieldNumberSubsection = null;
        this.formFieldPercentSubsection = null;
        this.formFieldSpecialSubsection = null;
        this.formFieldFormatDateTimeSubsection = null;
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

    private updateAnnotationCanvas(canvas: HTMLCanvasElement, pageWidth: number, pageHeight: number, pageNumber: number): void {
        const ratio: number = this.pdfViewerBase.getZoomRatio();
        canvas.width = pageWidth * ratio;
        canvas.height = pageHeight * ratio;
        canvas.style.width = pageWidth + 'px';
        canvas.style.height = pageHeight + 'px';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '1';
        this.pdfViewerBase.applyElementStyles(canvas, pageNumber);
    }

    private getFontFamily(fontFamily: string): boolean {
        const fontFamilyNames: string[] = ['Helvetica', 'Courier', 'Times New Roman', 'Symbol', 'ZapfDingbats'];
        return fontFamilyNames.indexOf(fontFamily) > -1 ? true : false;
    }

    private updateTextFieldSettingProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean,
                                             isSetFormFieldMode: boolean): void {
        const textFieldSettings: TextFieldSettingsModel = this.pdfViewer.textFieldSettings;
        if (!isNullOrUndefined(textFieldSettings.isReadOnly) && this.textFieldPropertyChanged.isReadOnlyChanged &&
        textFieldSettings.isReadOnly !== false) {
            drawingObject.isReadonly = textFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(textFieldSettings.isRequired) && this.textFieldPropertyChanged.isRequiredChanged &&
        textFieldSettings.isRequired !== false) {
            drawingObject.isRequired = textFieldSettings.isRequired;
        }
        if (textFieldSettings.value && this.textFieldPropertyChanged.isValueChanged) {
            const newValue: string = textFieldSettings.value;
            const max: number = (!isNullOrUndefined(textFieldSettings.maxLength) && textFieldSettings.maxLength !== 0)
                ? textFieldSettings.maxLength
                : 0;
            const finalValue: string = (max > 0 && newValue && newValue.length > max)
                ? newValue.substring(0, max)
                : newValue;
            drawingObject.value = this.pdfViewer.enableHtmlSanitizer
                ? SanitizeHtmlHelper.sanitize(finalValue)
                : finalValue;
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
            drawingObject.fontStyle = this.getFontStyleName(textFieldSettings.fontStyle, drawingObject);
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
        if (textFieldSettings.maxLength && this.textFieldPropertyChanged.isMaxLengthChanged && textFieldSettings.maxLength !== 0) {
            drawingObject.maxLength = textFieldSettings.maxLength;
        }
        if (textFieldSettings.visibility && this.textFieldPropertyChanged.isVisibilityChanged && textFieldSettings.visibility !== 'visible') {
            drawingObject.visibility = textFieldSettings.visibility;
        }
        if (!isNullOrUndefined(textFieldSettings.isPrint) && this.textFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = textFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(textFieldSettings.isMultiline) && this.textFieldPropertyChanged.isMultilineChanged &&
        textFieldSettings.isMultiline !== false) {
            drawingObject.isMultiline = textFieldSettings.isMultiline;
        }
        if (!isNullOrUndefined(textFieldSettings.customData) && this.textFieldPropertyChanged.isCustomDataChanged &&
        (textFieldSettings.customData as unknown as string) !== '') {
            drawingObject.customData = applyCustomData(drawingObject as unknown as FormFieldModel,
                                                       textFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
        }
    }

    private updateButtonFieldSettingProperties(drawingObject: PdfFormFieldBaseModel, isFormDesignerToolbarVisible: boolean,
                                               isSetFormFieldMode: boolean): void {
        const buttonFieldSettings: ButtonFieldSettingsModel = this.pdfViewer.buttonFieldSettings;
        if (!isNullOrUndefined(buttonFieldSettings.isReadOnly) && this.buttonFieldPropertyChanged.isReadOnlyChanged &&
        buttonFieldSettings.isReadOnly !== false) {
            drawingObject.isReadonly = buttonFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(buttonFieldSettings.isRequired) && this.buttonFieldPropertyChanged.isRequiredChanged &&
        buttonFieldSettings.isRequired !== false) {
            drawingObject.isRequired = buttonFieldSettings.isRequired;
        }
        if (this.buttonFieldPropertyChanged.isValueChanged) {
            // Prefer text, then value; skip empty strings so designer defaults do not
            // wipe the auto-generated caption (ButtonN) set in activateButtonElement.
            const caption: string = (!isNullOrUndefined(buttonFieldSettings.text) && buttonFieldSettings.text !== '') ?
                buttonFieldSettings.text :
                ((!isNullOrUndefined(buttonFieldSettings.value) && buttonFieldSettings.value !== '') ?
                    buttonFieldSettings.value : undefined);
            if (!isNullOrUndefined(caption) && caption !== '') {
                drawingObject.value = this.pdfViewer.enableHtmlSanitizer ?
                    SanitizeHtmlHelper.sanitize(caption) : caption;
            }
        }
        if ((buttonFieldSettings.backgroundColor && buttonFieldSettings.backgroundColor !== 'white' &&
            buttonFieldSettings.backgroundColor !== '#daeaf7ff') &&
        this.buttonFieldPropertyChanged.isBackgroundColorChanged) {
            drawingObject.backgroundColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(buttonFieldSettings.backgroundColor) : buttonFieldSettings.backgroundColor;
        }
        if ((buttonFieldSettings.borderColor && buttonFieldSettings.borderColor !== 'black') &&
        this.buttonFieldPropertyChanged.isBorderColorChanged) {
            drawingObject.borderColor = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(buttonFieldSettings.borderColor) : buttonFieldSettings.borderColor;
        }
        if ((buttonFieldSettings.alignment && buttonFieldSettings.alignment !== 'Left') &&
        this.buttonFieldPropertyChanged.isAlignmentChanged) {
            drawingObject.alignment = buttonFieldSettings.alignment;
        }
        if ((buttonFieldSettings.color && buttonFieldSettings.color !== 'black') &&
        this.buttonFieldPropertyChanged.isColorChanged) {
            drawingObject.color = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(buttonFieldSettings.color) : buttonFieldSettings.color;
        }
        if ((buttonFieldSettings.fontFamily && buttonFieldSettings.fontFamily !== 'Helvetica') &&
        this.buttonFieldPropertyChanged.isFontFamilyChanged) {
            drawingObject.fontFamily = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(buttonFieldSettings.fontFamily) : buttonFieldSettings.fontFamily;
        }
        if ((buttonFieldSettings.fontSize && buttonFieldSettings.fontSize !== 10) &&
        this.buttonFieldPropertyChanged.isFontSizeChanged) {
            drawingObject.fontSize = buttonFieldSettings.fontSize;
        }
        if (buttonFieldSettings.fontStyle && this.buttonFieldPropertyChanged.isFontStyleChanged) {
            drawingObject.fontStyle = this.getFontStyleName(buttonFieldSettings.fontStyle, drawingObject);
        }
        if (buttonFieldSettings.name && buttonFieldSettings.name !== '' && this.buttonFieldPropertyChanged.isNameChanged) {
            drawingObject.name = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(buttonFieldSettings.name) : buttonFieldSettings.name;
        }
        if (buttonFieldSettings.tooltip && this.buttonFieldPropertyChanged.isToolTipChanged) {
            drawingObject.tooltip = this.pdfViewer.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(buttonFieldSettings.tooltip) : buttonFieldSettings.tooltip;
        }
        if ((buttonFieldSettings.thickness && buttonFieldSettings.thickness !== 1) &&
        this.buttonFieldPropertyChanged.isThicknessChanged) {
            drawingObject.thickness = buttonFieldSettings.thickness;
        }
        if (buttonFieldSettings.visibility && this.buttonFieldPropertyChanged.isVisibilityChanged &&
            buttonFieldSettings.visibility !== 'visible') {
            drawingObject.visibility = buttonFieldSettings.visibility;
        }
        if (!isNullOrUndefined(buttonFieldSettings.isPrint) && this.buttonFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = buttonFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(buttonFieldSettings.customData) && this.buttonFieldPropertyChanged.isCustomDataChanged &&
        (buttonFieldSettings.customData as unknown as string) !== '') {
            drawingObject.customData = applyCustomData(drawingObject as unknown as FormFieldModel,
                                                       buttonFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
        }
        if (!isNullOrUndefined(buttonFieldSettings.actions) && this.buttonFieldPropertyChanged.isActionsChanged) {
            drawingObject.actions = buttonFieldSettings.actions as ActionsSettingsModel;
        }
    }

    private updatePasswordFieldSettingProperties(drawingObject: PdfFormFieldBaseModel,
                                                 isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const passwordFieldSettings: PasswordFieldSettingsModel = this.pdfViewer.passwordFieldSettings;
        if (!isNullOrUndefined(passwordFieldSettings.isReadOnly) && this.passwordFieldPropertyChanged.isReadOnlyChanged &&
        passwordFieldSettings.isReadOnly !== false) {
            drawingObject.isReadonly = passwordFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(passwordFieldSettings.isRequired) && this.passwordFieldPropertyChanged.isRequiredChanged &&
        passwordFieldSettings.isRequired !== false) {
            drawingObject.isRequired = passwordFieldSettings.isRequired;
        }
        if (passwordFieldSettings.value && this.passwordFieldPropertyChanged.isValueChanged) {
            const newValue: string = passwordFieldSettings.value;
            const max: number = (!isNullOrUndefined(passwordFieldSettings.maxLength) && passwordFieldSettings.maxLength !== 0)
                ? passwordFieldSettings.maxLength
                : 0;
            if (max > 0 && newValue && newValue.length > max) {
                drawingObject.value = newValue.substring(0, max);
            } else {
                drawingObject.value = newValue;
            }
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
            drawingObject.fontStyle = this.getFontStyleName(passwordFieldSettings.fontStyle, drawingObject);
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
        if (passwordFieldSettings.maxLength && this.passwordFieldPropertyChanged.isMaxLengthChanged &&
            passwordFieldSettings.maxLength !== 0) {
            drawingObject.maxLength = passwordFieldSettings.maxLength;
        }
        if (passwordFieldSettings.visibility && this.passwordFieldPropertyChanged.isVisibilityChanged &&
            passwordFieldSettings.visibility !== 'visible') {
            drawingObject.visibility = passwordFieldSettings.visibility;
        }
        if (!isNullOrUndefined(passwordFieldSettings.isPrint) && this.passwordFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = passwordFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(passwordFieldSettings.customData) && this.passwordFieldPropertyChanged.isCustomDataChanged &&
        (passwordFieldSettings.customData as unknown as string) !== '') {
            drawingObject.customData = applyCustomData(drawingObject as unknown as FormFieldModel,
                                                       passwordFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
        }
    }

    private updateCheckBoxFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel,
                                                  isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const checkBoxFieldSettings: CheckBoxFieldSettingsModel = this.pdfViewer.checkBoxFieldSettings;
        if (!isNullOrUndefined(checkBoxFieldSettings.isReadOnly) && this.checkBoxFieldPropertyChanged.isReadOnlyChanged &&
        checkBoxFieldSettings.isReadOnly !== false) {
            drawingObject.isReadonly = checkBoxFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.isRequired) && this.checkBoxFieldPropertyChanged.isRequiredChanged &&
        checkBoxFieldSettings.isRequired !== false) {
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
        if (checkBoxFieldSettings.visibility && this.checkBoxFieldPropertyChanged.isVisibilityChanged &&
            checkBoxFieldSettings.visibility !== 'visible') {
            drawingObject.visibility = checkBoxFieldSettings.visibility;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.isPrint) && this.checkBoxFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = checkBoxFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.isChecked) && this.checkBoxFieldPropertyChanged.isCheckedChanged &&
        checkBoxFieldSettings.isChecked !== false) {
            drawingObject.isChecked = checkBoxFieldSettings.isChecked;
        }
        if (!isNullOrUndefined(checkBoxFieldSettings.customData) && this.checkBoxFieldPropertyChanged.isCustomDataChanged &&
        (checkBoxFieldSettings.customData as unknown as string) !== '') {
            drawingObject.customData = applyCustomData(drawingObject as unknown as FormFieldModel,
                                                       checkBoxFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
        }
    }

    private updateRadioButtonFieldSettingProperties(drawingObject: PdfFormFieldBaseModel,
                                                    isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const radioButtonFieldSettings: RadioButtonFieldSettingsModel = this.pdfViewer.radioButtonFieldSettings;
        if (!isNullOrUndefined(radioButtonFieldSettings.isReadOnly) && this.radioButtonFieldPropertyChanged.isReadOnlyChanged &&
        radioButtonFieldSettings.isReadOnly !== false) {
            drawingObject.isReadonly = radioButtonFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.isRequired) && this.radioButtonFieldPropertyChanged.isRequiredChanged &&
        radioButtonFieldSettings.isRequired !== false) {
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
        if (radioButtonFieldSettings.visibility && this.radioButtonFieldPropertyChanged.isVisibilityChanged &&
            radioButtonFieldSettings.visibility !== 'visible') {
            drawingObject.visibility = radioButtonFieldSettings.visibility;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.isPrint) && this.radioButtonFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = radioButtonFieldSettings.isPrint;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.isSelected) && this.radioButtonFieldPropertyChanged.isSelectedChanged &&
        radioButtonFieldSettings.isSelected !== false) {
            drawingObject.isSelected = radioButtonFieldSettings.isSelected;
        }
        if (!isNullOrUndefined(radioButtonFieldSettings.customData) && this.radioButtonFieldPropertyChanged.isCustomDataChanged &&
        (radioButtonFieldSettings.customData as unknown as string) !== '') {
            drawingObject.customData = applyCustomData(drawingObject as unknown as FormFieldModel,
                                                       radioButtonFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
        }
    }

    private updateDropdownFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel,
                                                  isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const dropdownFieldSettings: DropdownFieldSettingsModel = this.pdfViewer.DropdownFieldSettings;
        if (!isNullOrUndefined(dropdownFieldSettings.isReadOnly) && this.dropdownFieldPropertyChanged.isReadOnlyChanged &&
        dropdownFieldSettings.isReadOnly !== false) {
            drawingObject.isReadonly = dropdownFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(dropdownFieldSettings.isRequired) && this.dropdownFieldPropertyChanged.isRequiredChanged &&
        dropdownFieldSettings.isRequired !== false) {
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
            drawingObject.fontStyle = this.getFontStyleName(dropdownFieldSettings.fontStyle, drawingObject);
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
        if (dropdownFieldSettings.visibility && this.dropdownFieldPropertyChanged.isVisibilityChanged &&
            dropdownFieldSettings.visibility !== 'visible') {
            drawingObject.visibility = dropdownFieldSettings.visibility;
        }
        if (!isNullOrUndefined(dropdownFieldSettings.isPrint) && this.dropdownFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = dropdownFieldSettings.isPrint;
        }
        if (dropdownFieldSettings.options && dropdownFieldSettings.options.length > 0) {
            if (isNullOrUndefined(drawingObject.selectedIndex)) {
                drawingObject.selectedIndex = [0];
            }
            if (this.dropdownFieldPropertyChanged.isOptionChanged) {
                drawingObject.options = drawingObject.options && drawingObject.options.length > 0 ?
                    drawingObject.options : dropdownFieldSettings.options;
            }
        }
        if (!isNullOrUndefined(dropdownFieldSettings.customData) && this.dropdownFieldPropertyChanged.isCustomDataChanged &&
        (dropdownFieldSettings.customData as unknown as string) !== '') {
            drawingObject.customData = applyCustomData(drawingObject as unknown as FormFieldModel,
                                                       dropdownFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
        }
    }

    private updatelistBoxFieldSettingsProperties(drawingObject: PdfFormFieldBaseModel,
                                                 isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const listBoxFieldSettings: ListBoxFieldSettingsModel = this.pdfViewer.listBoxFieldSettings;
        if (!isNullOrUndefined(listBoxFieldSettings.isReadOnly) && this.listBoxFieldPropertyChanged.isReadOnlyChanged &&
        listBoxFieldSettings.isReadOnly !== false) {
            drawingObject.isReadonly = listBoxFieldSettings.isReadOnly;
        }
        if (!isNullOrUndefined(listBoxFieldSettings.isRequired) && this.listBoxFieldPropertyChanged.isRequiredChanged &&
        listBoxFieldSettings.isRequired !== false) {
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
            drawingObject.fontStyle = this.getFontStyleName(listBoxFieldSettings.fontStyle, drawingObject);
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
        if (listBoxFieldSettings.visibility && this.listBoxFieldPropertyChanged.isVisibilityChanged &&
            listBoxFieldSettings.visibility !== 'visible') {
            drawingObject.visibility = listBoxFieldSettings.visibility;
        }
        if (!isNullOrUndefined(listBoxFieldSettings.isPrint) && this.listBoxFieldPropertyChanged.isPrintChanged) {
            drawingObject.isPrint = listBoxFieldSettings.isPrint;
        }
        if (listBoxFieldSettings.options && listBoxFieldSettings.options.length > 0) {
            if (isNullOrUndefined(drawingObject.selectedIndex)) {
                drawingObject.selectedIndex = [0];
            }
            if (this.listBoxFieldPropertyChanged.isOptionChanged) {
                drawingObject.options = drawingObject.options && drawingObject.options.length > 0 ?
                    drawingObject.options : listBoxFieldSettings.options;
            }
        }
        if (!isNullOrUndefined((listBoxFieldSettings as { customData?: object }).customData)
            && this.listBoxFieldPropertyChanged.isCustomDataChanged &&
        (listBoxFieldSettings as { customData?: object }).customData as unknown as string !== '') {
            drawingObject.customData = applyCustomData(drawingObject as unknown as FormFieldModel,
                                                       (listBoxFieldSettings as { customData?: object }).customData,
                                                       this.pdfViewer.enableCollaborativeEditing);
        }
    }

    private updateSignInitialFieldProperties(signatureField: PdfFormFieldBaseModel, isInitialField: boolean,
                                             isFormDesignerToolbarVisible: boolean, isSetFormFieldMode: boolean): void {
        const initialFieldSettings: InitialFieldSettingsModel = this.pdfViewer.initialFieldSettings;
        const signatureFieldSettings: SignatureFieldSettingsModel = this.pdfViewer.signatureFieldSettings;
        if (isInitialField) {
            if (!isNullOrUndefined(initialFieldSettings.isReadOnly) && this.initialFieldPropertyChanged.isReadOnlyChanged &&
            initialFieldSettings.isReadOnly !== false) {
                signatureField.isReadonly = initialFieldSettings.isReadOnly;
            }
            if (!isNullOrUndefined(initialFieldSettings.isRequired) &&
            this.initialFieldPropertyChanged.isRequiredChanged && !this.pdfViewer.magnificationModule.isFormFieldPageZoomed &&
            initialFieldSettings.isRequired !== false) {
                signatureField.isRequired = initialFieldSettings.isRequired;
            }
            if (initialFieldSettings.visibility && this.initialFieldPropertyChanged.isVisibilityChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed && initialFieldSettings.visibility !== 'visible') {
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
            if (!isNullOrUndefined(initialFieldSettings.customData) && this.initialFieldPropertyChanged.isCustomDataChanged &&
            (initialFieldSettings.customData as unknown as string) !== '') {
                signatureField.customData = applyCustomData(signatureField as unknown as FormFieldModel,
                                                            initialFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
            }
        }
        else {
            if (!isNullOrUndefined(signatureFieldSettings.isReadOnly) && this.signatureFieldPropertyChanged.isReadOnlyChanged &&
            signatureFieldSettings.isReadOnly !== false) {
                signatureField.isReadonly = signatureFieldSettings.isReadOnly;
            }
            if (!isNullOrUndefined(signatureFieldSettings.isRequired) &&
            this.signatureFieldPropertyChanged.isRequiredChanged && !this.pdfViewer.magnificationModule.isFormFieldPageZoomed &&
            signatureFieldSettings.isRequired !== false) {
                signatureField.isRequired = signatureFieldSettings.isRequired;
            }
            if (signatureFieldSettings.visibility && this.signatureFieldPropertyChanged.isVisibilityChanged &&
                !this.pdfViewer.magnificationModule.isFormFieldPageZoomed && signatureFieldSettings.visibility !== 'visible') {
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
            if (!isNullOrUndefined(signatureFieldSettings.customData) && this.signatureFieldPropertyChanged.isCustomDataChanged &&
            (signatureFieldSettings.customData as unknown as string) !== '') {
                signatureField.customData = applyCustomData(signatureField as unknown as FormFieldModel,
                                                            signatureFieldSettings.customData, this.pdfViewer.enableCollaborativeEditing);
            }
        }
    }

    /**
     * @param {SignatureFieldSettings} newSignatureFieldSettings - It describes about the new signature field settings
     * @param {boolean} isInitialField - It describes about the isInitialField
     * @private
     * @returns {void}
     */
    public updateSignatureSettings(newSignatureFieldSettings: SignatureFieldSettings | InitialFieldSettings,
                                   isInitialField : boolean): void {
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
     * @param {TextFieldSettings} textFieldSettings - It describes about the text field settings
     * @private
     * @returns {void}
     */
    public updateTextFieldSettings(textFieldSettings: TextFieldSettings): void {
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
     * @param {ButtonFieldSettings} buttonFieldSettings - It describes about the button field settings
     * @private
     * @returns {void}
     */
    public updateButtonFieldSettings(buttonFieldSettings: ButtonFieldSettings): void {
        this.buttonFieldPropertyChanged.isReadOnlyChanged = !isNullOrUndefined(buttonFieldSettings.isReadOnly);
        this.buttonFieldPropertyChanged.isRequiredChanged = !isNullOrUndefined(buttonFieldSettings.isRequired);
        // Nested buttonFieldSettings always has framework defaults ('' name/value, '#daeaf7'/white bg).
        // Only treat non-default values as intentional property overrides.
        const bg: string = buttonFieldSettings.backgroundColor as string;
        this.buttonFieldPropertyChanged.isBackgroundColorChanged = !isNullOrUndefined(bg) && bg !== '' &&
            bg.toLowerCase() !== 'white' && bg.toLowerCase() !== '#ffffff' && bg.toLowerCase() !== '#fff' &&
            bg.toLowerCase() !== '#daeaf7ff';
        this.buttonFieldPropertyChanged.isBorderColorChanged = !isNullOrUndefined(buttonFieldSettings.borderColor);
        this.buttonFieldPropertyChanged.isAlignmentChanged = !isNullOrUndefined(buttonFieldSettings.alignment);
        this.buttonFieldPropertyChanged.isColorChanged = !isNullOrUndefined(buttonFieldSettings.color);
        this.buttonFieldPropertyChanged.isFontFamilyChanged = !isNullOrUndefined(buttonFieldSettings.fontFamily);
        this.buttonFieldPropertyChanged.isFontSizeChanged = !isNullOrUndefined(buttonFieldSettings.fontSize);
        this.buttonFieldPropertyChanged.isFontStyleChanged = !isNullOrUndefined(buttonFieldSettings.fontStyle);
        this.buttonFieldPropertyChanged.isNameChanged = !isNullOrUndefined(buttonFieldSettings.name) &&
            buttonFieldSettings.name !== '';
        this.buttonFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(buttonFieldSettings.tooltip);
        this.buttonFieldPropertyChanged.isThicknessChanged = !isNullOrUndefined(buttonFieldSettings.thickness);
        this.buttonFieldPropertyChanged.isVisibilityChanged = !isNullOrUndefined(buttonFieldSettings.visibility);
        this.buttonFieldPropertyChanged.isPrintChanged = !isNullOrUndefined(buttonFieldSettings.isPrint);
        this.buttonFieldPropertyChanged.isValueChanged =
            (!isNullOrUndefined(buttonFieldSettings.value) && buttonFieldSettings.value !== '') ||
            (!isNullOrUndefined(buttonFieldSettings.text) && buttonFieldSettings.text !== '');
        this.buttonFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined(buttonFieldSettings.customData);
        this.buttonFieldPropertyChanged.isActionsChanged = !isNullOrUndefined(buttonFieldSettings.actions);
    }

    /**
     * @param {PasswordFieldSettings} passwordFieldSettings - It describes about the password field settings
     * @private
     * @returns {void}
     */
    public updatePasswordFieldSettings(passwordFieldSettings: PasswordFieldSettings): void {
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
     * @param {CheckBoxFieldSettings} checkBoxFieldSettings - It describes about the checkbox field settings
     * @private
     * @returns {void}
     */
    public updateCheckBoxFieldSettings(checkBoxFieldSettings: CheckBoxFieldSettings): void {
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
     * @param {RadioButtonFieldSettings} radioButtonFieldSettings - It describes about the radio button field settings
     * @private
     * @returns {void}
     */
    public updateRadioButtonFieldSettings(radioButtonFieldSettings: RadioButtonFieldSettings): void {
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
     * @param {DropdownFieldSettings} dropdownFieldSettings - It describes about the dropdown field settings
     * @private
     * @returns {void}
     */
    public updateDropDownFieldSettings(dropdownFieldSettings: DropdownFieldSettings): void {
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
     * @param {ListBoxFieldSettings} listBoxFieldSettings - It describes about the listBoxField settings
     * @private
     * @returns {void}
     */
    public updateListBoxFieldSettings(listBoxFieldSettings: ListBoxFieldSettings): void {
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
        this.listBoxFieldPropertyChanged.isCustomDataChanged = !isNullOrUndefined((listBoxFieldSettings as FormFieldModel).customData);
    }

    /**
     * Applies bold/italic/underline/strikeout from drawingObject.font onto a button input.
     * Mirrors updateTextboxFieldProperties so reload restores caption font styles.
     *
     * @param {HTMLElement} inputElement - Button input element.
     * @param {PdfFormFieldBaseModel} drawingObject - Field model with font flags.
     * @returns {void}
     */
    private applyButtonFontStyleFromModel(inputElement: HTMLElement, drawingObject: PdfFormFieldBaseModel): void {
        const font: PdfFontModel = drawingObject && drawingObject.font;
        if (isNullOrUndefined(font)) {
            return;
        }
        inputElement.style.fontWeight = font.isBold ? 'bold' : '';
        inputElement.style.fontStyle = font.isItalic ? 'italic' : '';
        if (font.isUnderline && font.isStrikeout) {
            inputElement.style.textDecoration = 'underline line-through';
        } else if (font.isStrikeout) {
            inputElement.style.textDecoration = 'line-through';
        } else if (font.isUnderline) {
            inputElement.style.textDecoration = 'underline';
        } else {
            inputElement.style.textDecoration = '';
        }
    }

    /**
     * @param {BarcodeFieldSettings} barcodeFieldSettings - It describes about the barcode field settings
     * @private
     * @returns {void}
     */
    public updateBarcodeFieldSettings(barcodeFieldSettings: BarcodeFieldSettings): void {
        this.barcodeFieldPropertyChanged.isNameChanged = !isNullOrUndefined(barcodeFieldSettings.name);
        this.barcodeFieldPropertyChanged.isToolTipChanged = !isNullOrUndefined(barcodeFieldSettings.tooltip);
        this.barcodeFieldPropertyChanged.isSymbologyChanged = !isNullOrUndefined(barcodeFieldSettings.symbology);
        this.barcodeFieldPropertyChanged.isXDimensionChanged = !isNullOrUndefined(barcodeFieldSettings.xDimension);
        this.barcodeFieldPropertyChanged.isErrorCorrectionLevelChanged = !isNullOrUndefined(barcodeFieldSettings.errorCorrectionLevel);
        this.barcodeFieldPropertyChanged.isValueFormatChanged = !isNullOrUndefined(barcodeFieldSettings.valueFormat);
        this.barcodeFieldPropertyChanged.isFieldsChanged = !isNullOrUndefined(barcodeFieldSettings.fields);
        this.barcodeFieldPropertyChanged.isIncludeFieldNamesChanged = !isNullOrUndefined(barcodeFieldSettings.includeFieldNames);
        this.barcodeFieldPropertyChanged.isCompressDataChanged = !isNullOrUndefined(barcodeFieldSettings.compressData);
        this.barcodeFieldPropertyChanged.isCustomValueChanged = !isNullOrUndefined(barcodeFieldSettings.customValue);
        this.barcodeFieldPropertyChanged.isCaptionChanged = !isNullOrUndefined(barcodeFieldSettings.caption);
    }

    /**
     * Applies the supplied barcode settings onto an existing barcode field.
     * Only the supplied properties are changed; the remaining ones keep their value.
     * @param {PdfFormFieldBaseModel} formFieldObject - The barcode field to update.
     * @param {BarcodeFieldSettings} options - The barcode settings to apply.
     * @param {HTMLElement} htmlElement - The barcode content element.
     * @returns {void}
     */
    private applyBarcodeFieldSettings(formFieldObject: PdfFormFieldBaseModel, options: BarcodeFieldSettings,
                                      htmlElement: HTMLElement): void {
        if (!isNullOrUndefined(options)) {
            if (!isNullOrUndefined(options.symbology)) {
                formFieldObject.symbology = options.symbology;
            }
            if (!isNullOrUndefined(options.xDimension)) {
                formFieldObject.xDimension = options.xDimension;
            }
            if (!isNullOrUndefined(options.errorCorrectionLevel)) {
                formFieldObject.errorCorrectionLevel = options.errorCorrectionLevel;
            }
            if (!isNullOrUndefined(options.valueFormat)) {
                formFieldObject.valueFormat = options.valueFormat;
            }
            if (!isNullOrUndefined(options.fields)) {
                formFieldObject.fields = options.fields;
            }
            if (!isNullOrUndefined(options.includeFieldNames)) {
                formFieldObject.includeFieldNames = options.includeFieldNames;
            }
            if (!isNullOrUndefined(options.compressData)) {
                formFieldObject.compressData = options.compressData;
            }
            if (!isNullOrUndefined(options.customValue)) {
                formFieldObject.customValue = options.customValue;
            }
            if (!isNullOrUndefined(options.caption)) {
                formFieldObject.caption = options.caption;
            }
            this.updateBarcodeFieldProperties(formFieldObject, htmlElement);
        }
    }


    private getFontStyleName(fontStyle: FontStyle | number, drawingObject: PdfFormFieldBaseModel): string {
        let fontStyleName: string = 'None';
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

    private getFontStyle(font: PdfFontModel): void {
        if (font.isBold) {
            this.formFieldBold = 'bold';
        }
        else {
            this.formFieldBold = 'normal';
        }
        if (font.isItalic) {
            this.formFieldItalic = 'italic';
        }
        else {
            this.formFieldItalic = 'normal';
        }
        if (font.isUnderline) {
            this.formFieldUnderline = 'underline';
        }
        else {
            this.formFieldUnderline = 'none';
        }
        if (font.isStrikeout) {
            this.formFieldStrikeOut = 'line-through';
        }
        else {
            this.formFieldStrikeOut = 'none';
        }
    }

    /**
     * Reads customData.collaborationId from a form field payload.
     *
     * @param {FormFieldModel} formField - Form field payload
     * @returns {string} collaboration id, or an empty string when missing
     */
    private getCollaborationId(formField: FormFieldModel): string {
        const customData: { collaborationId?: string } = formField && formField.customData as { collaborationId?: string };
        return customData && !isNullOrUndefined(customData.collaborationId) ? customData.collaborationId : '';
    }

    /**
     * Finds the local form field that shares the remote collaboration id.
     * Falls back to field id so older payloads still resolve.
     *
     * @param {FormFieldModel} formField - Remote form field payload
     * @returns {PdfFormFieldBaseModel} matching local field, or undefined
     */
    private findFieldByCollaborationId(formField: FormFieldModel): PdfFormFieldBaseModel {
        const collaborationId: string = this.getCollaborationId(formField);
        const collections: PdfFormFieldBaseModel[] = this.pdfViewer.formFieldCollection || [];
        if (collaborationId) {
            const matched: PdfFormFieldBaseModel = collections.find((field: PdfFormFieldBaseModel) => {
                const fieldData: { collaborationId?: string } = field.customData as { collaborationId?: string };
                return fieldData && fieldData.collaborationId === collaborationId;
            });
            if (matched) {
                return matched;
            }
            const publicMatch: FormFieldModel = (this.pdfViewer.formFieldCollections || []).find((field: FormFieldModel) => {
                const fieldData: { collaborationId?: string } = field.customData as { collaborationId?: string };
                return fieldData && fieldData.collaborationId === collaborationId;
            });
            if (publicMatch) {
                return collections.find((field: PdfFormFieldBaseModel) => field.id === publicMatch.id);
            }
        }
        if (formField && formField.id) {
            return collections.find((field: PdfFormFieldBaseModel) => field.id === formField.id);
        }
        return undefined;
    }

    /**
     * Adds a remote form field to the viewer.
     * Called when a collaborator creates a new form field.
     *
     * @private
     * @param {FormFieldModel} formField - Form field object to add
     * @returns {void}
     */
    public addRemoteFormField(formField: FormFieldModel): void {
        try {
            if (!formField || !formField.type) {
                console.warn('[FormDesigner] Invalid form field object for add');
                return;
            }
            // Convert form field object to settings object expected by addFormField
            const normalizedBounds: IFormFieldBound = this.pdfViewer.formFieldsModule.normalizeBounds(formField.bounds);
            const settings: FormFieldModel = {
                bounds: normalizedBounds || {
                    X: 0,
                    Y: 0,
                    Width: 100,
                    Height: 20
                },
                name: formField.name,
                value: formField.value,
                pageNumber: formField.pageNumber || formField.pageIndex + 1,
                fontFamily: formField.fontFamily,
                fontSize: formField.fontSize,
                fontStyle: formField.fontStyle,
                color: formField.color,
                backgroundColor: formField.backgroundColor,
                isReadOnly: (formField as unknown as IFormField).isReadonly,
                alignment: formField.alignment,
                visibility: formField.visibility,
                isRequired: formField.isRequired,
                isPrint: formField.isPrint,
                tooltip: formField.tooltip,
                customData: formField.customData,
                borderColor: formField.borderColor,
                thickness: formField.thickness
            };
            // Add type-specific properties
            if (formField.type === 'Textbox') {
                settings.isMultiline = formField.isMultiline || false;
                settings.maxLength = formField.maxLength;
                settings.insertSpaces = formField.insertSpaces;
            } else if (formField.type === 'Password') {
                settings.maxLength = formField.maxLength;
            } else if ((formField as unknown as IFormField).type === 'DropdownList') {
                settings.options = formField.options || [];
                settings.selectedIndex = formField.selectedIndex || [0];
            } else if ((formField as unknown as IFormField).type === 'ListBox') {
                settings.options = formField.options || [];
                settings.selectedIndex = formField.selectedIndex || [0];
            } else if ((formField as unknown as IFormField).type === 'Checkbox') {
                settings.isChecked = formField.isChecked || false;
            } else if (formField.type === 'RadioButton') {
                settings.isSelected = formField.isSelected || false;
            } else if (formField.type === 'SignatureField') {
                settings.signatureIndicatorSettings = formField.signatureIndicatorSettings;
            } else if (formField.type === 'ButtonField' ||
                (formField as unknown as { type?: string }).type === 'Button') {
                if (!isNullOrUndefined(formField.actions)) {
                    settings.actions = formField.actions;
                }
            }
            if (this.pdfViewer.enableCollaborativeEditing) {
                ensureCollaborationId(settings);
            }
            this.addFormField(formField.type, settings, false);
        } catch (error) {
            console.error('[FormDesigner] Error adding remote form field:', error);
        }
    }

    /**
     * Updates a remote form field in the viewer.
     * Called when a collaborator modifies a form field.
     * Uses the public updateFormField API to apply changes.
     *
     * @private
     * @param {FormFieldModel} formField - Remote form field object with updated properties
     * @returns {void}
     */
    public updateRemoteFormField(formField: FormFieldModel): void {
        try {
            const localField: PdfFormFieldBaseModel = this.findFieldByCollaborationId(formField);
            if (!formField || (!formField.id && !localField)) {
                console.warn('[FormDesigner] Invalid form field object for update');
                return;
            }
            const targetId: string = localField ? localField.id : formField.id;
            // Build update options from the remote form field data
            const updateOptions: FormFieldModel = {};
            // Add properties that changed
            if (!isNullOrUndefined(formField.name)) {
                updateOptions.name = formField.name;
            }
            if (!isNullOrUndefined(formField.value)) {
                updateOptions.value = formField.value;
            }
            if (!isNullOrUndefined(formField.bounds)) {
                updateOptions.bounds = {
                    X: (formField.bounds as PdfBoundsModel).x ? (formField.bounds as PdfBoundsModel).x : formField.bounds.X,
                    Y: (formField.bounds as PdfBoundsModel).y ? (formField.bounds as PdfBoundsModel).y : formField.bounds.Y,
                    Width: (formField.bounds as PdfBoundsModel).width ? (formField.bounds as PdfBoundsModel).width : formField.bounds.Width,
                    Height: (formField.bounds as PdfBoundsModel).height ? (formField.bounds as PdfBoundsModel).height : formField.bounds.
                        Height
                };
            }
            if (!isNullOrUndefined(formField.fontFamily)) {
                updateOptions.fontFamily = formField.fontFamily;
            }
            if (!isNullOrUndefined(formField.fontSize)) {
                updateOptions.fontSize = formField.fontSize;
            }
            if (!isNullOrUndefined(formField.fontStyle)) {
                updateOptions.fontStyle = formField.fontStyle;
                if ((formField as unknown as PdfFormFieldBaseModel).font.isBold) {
                    updateOptions.fontStyle = FontStyle.Bold;
                } else if ((formField as unknown as PdfFormFieldBaseModel).font.isItalic) {
                    updateOptions.fontStyle = FontStyle.Italic;
                } else if ((formField as unknown as PdfFormFieldBaseModel).font.isUnderline) {
                    updateOptions.fontStyle = FontStyle.Underline;
                } else if ((formField as unknown as PdfFormFieldBaseModel).font.isStrikeout) {
                    updateOptions.fontStyle = FontStyle.Strikethrough;
                }
            }
            if (!isNullOrUndefined(formField.color)) {
                updateOptions.color = formField.color;
            }
            if (!isNullOrUndefined(formField.backgroundColor)) {
                updateOptions.backgroundColor = formField.backgroundColor;
            }
            if (!isNullOrUndefined(formField.borderColor)) {
                updateOptions.borderColor = formField.borderColor;
            }
            if (!isNullOrUndefined(formField.thickness)) {
                updateOptions.thickness = formField.thickness;
            }
            if (!isNullOrUndefined(formField.alignment)) {
                updateOptions.alignment = formField.alignment;
            }
            if (!isNullOrUndefined((formField as unknown as PdfFormFieldBaseModel).isReadonly)) {
                updateOptions.isReadOnly = (formField as unknown as PdfFormFieldBaseModel).isReadonly;
            }
            if (!isNullOrUndefined(formField.isPrint)) {
                updateOptions.isPrint = formField.isPrint;
            }
            if (!isNullOrUndefined(formField.tooltip)) {
                updateOptions.tooltip = formField.tooltip;
            }
            if (!isNullOrUndefined(formField.isRequired)) {
                updateOptions.isRequired = formField.isRequired;
            }
            if (!isNullOrUndefined(formField.isMultiline)) {
                updateOptions.isMultiline = formField.isMultiline;
            }
            if (!isNullOrUndefined(formField.insertSpaces)) {
                updateOptions.insertSpaces = formField.insertSpaces;
            }
            if (!isNullOrUndefined(formField.maxLength)) {
                updateOptions.maxLength = formField.maxLength;
            }
            if (!isNullOrUndefined(formField.visibility)) {
                updateOptions.visibility = formField.visibility;
            }
            if (!isNullOrUndefined(formField.isChecked)) {
                updateOptions.isChecked = formField.isChecked;
            }
            if (!isNullOrUndefined(formField.isSelected)) {
                updateOptions.isSelected = formField.isSelected;
            }
            if (!isNullOrUndefined(formField.options)) {
                updateOptions.options = formField.options;
            }
            if (!isNullOrUndefined(formField.selectedIndex)) {
                updateOptions.selectedIndex = formField.selectedIndex;
            }
            if (!isNullOrUndefined(formField.signatureType)) {
                updateOptions.signatureType = formField.signatureType;
            }
            if (!isNullOrUndefined(formField.signatureIndicatorSettings)) {
                updateOptions.signatureIndicatorSettings = formField.signatureIndicatorSettings;
            }
            // Public FormFieldType is 'ButtonField'; designer annotation type is 'Button'.
            if ((formField.type === 'ButtonField' ||
                (formField as unknown as PdfFormFieldBaseModel).formFieldAnnotationType === 'Button') &&
                !isNullOrUndefined(formField.actions)) {
                updateOptions.actions = formField.actions;
            }
            const currentdField: PdfFormFieldBaseModel = localField || this.pdfViewer.formFieldCollection.find(
                (field: PdfFormFieldBaseModel) => field.id === targetId
            );
            if (currentdField && currentdField.value !== formField.value && (formField.type === 'SignatureField' || (formField as unknown as PdfFormFieldBaseModel).formFieldAnnotationType === 'SignatureField' ||
                formField.type === 'InitialField' || (formField as unknown as PdfFormFieldBaseModel).formFieldAnnotationType === 'InitialField')) {
                const signatureField: FormFieldModel = Object.assign({}, formField, { id: targetId });
                if (formField.value !== '') {
                    this.pdfViewer.updateFormFieldValue(signatureField);
                } else {
                    this.pdfViewer.formFieldsModule.clearFormField(signatureField);
                }
            } else {
                // Use the public updateFormField API to apply all changes
                this.updateFormField(targetId, updateOptions);
            }
        } catch (error) {
            console.error('[FormDesigner] Error updating remote form field:', error);
        }
    }

    /**
     * Deletes a remote form field from the viewer.
     * Called when a collaborator deletes a form field.
     *
     * @private
     * @param {FormFieldModel} formField - Form field object to delete
     * @returns {void}
     */
    public deleteRemoteFormField(formField: FormFieldModel): void {
        try {
            const localField: PdfFormFieldBaseModel = this.findFieldByCollaborationId(formField);
            if (!formField || (!formField.id && !localField)) {
                console.warn('[FormDesigner] Invalid form field object for delete');
                return;
            }
            this.deleteFormField({ id: localField ? localField.id : formField.id }, false);
        } catch (error) {
            console.error('[FormDesigner] Error deleting remote form field:', error);
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
 * Common flags available for most form fields
 *
 * @hidden
 */
interface BaseFieldPropertyChanged {
    isReadOnlyChanged: boolean;
    isRequiredChanged: boolean;
    isNameChanged: boolean;
    isToolTipChanged: boolean;
    isThicknessChanged: boolean;
    isVisibilityChanged: boolean;
    isPrintChanged: boolean;
}

/**
 * Signature/Initial fields
 *
 * @hidden
 */
interface SignatureFieldPropertyChanged extends BaseFieldPropertyChanged {
    isTooltipChanged: boolean;
    isCustomDataChanged: boolean;
}

/**
 * Fields that support styling
 *
 * @hidden
 */
interface StyledFieldPropertyChanged extends BaseFieldPropertyChanged {
    isBackgroundColorChanged: boolean;
    isBorderColorChanged: boolean;
    isAlignmentChanged: boolean;
    isFontSizeChanged: boolean;
    isFontFamilyChanged: boolean;
    isColorChanged: boolean;
    isFontStyleChanged: boolean;
}

/**
 * Text and Password fields
 *
 * @hidden
 */
interface TextFieldPropertyChanged extends StyledFieldPropertyChanged {
    isValueChanged: boolean;
    isSelected: boolean;
    isFontStyle: boolean;
    isMaXLength: boolean;
    isMultilineChanged?: boolean;
    isCustomDataChanged: boolean;
    isMaxLengthChanged: boolean;
}

/**
 * Checkbox fields
 *
 * @hidden
 */
interface CheckBoxFieldPropertyChanged extends BaseFieldPropertyChanged {
    isBackgroundColorChanged: boolean;
    isBorderColorChanged: boolean;
    isCheckedChanged: boolean;
    isValueChanged: boolean;
    isCustomDataChanged: boolean;
}

/**
 * Radio button fields
 *
 * @hidden
 */
interface RadioButtonFieldPropertyChanged extends BaseFieldPropertyChanged {
    isBackgroundColorChanged: boolean;
    isBorderColorChanged: boolean;
    isSelectedChanged: boolean;
    isValueChanged: boolean;
    isCustomDataChanged: boolean;
}

/**
 * Dropdown/Listbox fields
 *
 * @hidden
 */
interface ChoiceFieldPropertyChanged extends StyledFieldPropertyChanged {
    isOptionChanged: boolean;
    isCustomDataChanged: boolean;
    isSelected: boolean;
    isValueChanged: boolean;
    isFontStyle: boolean;
}

/**
 * Button fields
 *
 * @hidden
 */
interface ButtonFieldPropertyChanged extends StyledFieldPropertyChanged {
    isValueChanged: boolean;
    isCustomDataChanged: boolean;
    isActionsChanged: boolean;
}

/**
 * Barcode fields
 *
 * @hidden
 */
interface BarcodeFieldPropertyChanged {
    isNameChanged: boolean;
    isToolTipChanged: boolean;
    isSymbologyChanged: boolean;
    isXDimensionChanged: boolean;
    isErrorCorrectionLevelChanged: boolean;
    isValueFormatChanged: boolean;
    isFieldsChanged: boolean;
    isIncludeFieldNamesChanged: boolean;
    isCompressDataChanged: boolean;
    isCustomValueChanged: boolean;
    isCaptionChanged: boolean;
}

/** * Describes the options passed to updateSignatureandInitialIndicator
 *
 * @hidden
 */
interface ISignatureIndicatorOptions {
    height: number;
    width: number;
    signatureIndicatorSettings?: SignatureIndicatorSettingsModel;
    initialIndicatorSettings?: SignatureIndicatorSettingsModel;
}

/**
 * @hidden
 */
interface IBarcodeResizeState {
    fieldId: string;
    bounds: { x: number, y: number, width: number, height: number };
    wrapperBounds: Rect;
    wrapperOffset: { x: number, y: number };
    actualSize: { width: number, height: number };
    offset: { x: number, y: number };
    glyphHTML: string;
}

/**
 * Describes a single entry parsed from the _formfields session storage
 *
 * @hidden
 */
export interface IFormFieldSessionData {
    ActualFieldName?: string;
    Name?: string;
    Value?: string;
    Selected?: boolean;
    IsUnisonSelected?: boolean;
    isUnisonSelected?: boolean;
    name?: string;
    value?: string;
    uniqueID?: string;
}

/**
 * Defines the common properties of Radiobutton Item
 *
 * @hidden
 */
export interface IRadiobuttonItem {
    id?: string;
    lineBound: IFormFieldBound;
    pageNumber: number;
    formFieldAnnotationType: string;
    name: string;
    value: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: string | FontStyle;
    fontColor: RGBA;
    backgroundColor: RGBA;
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
    borderColor?: RGBA;
    thickness?: number;
    isMultiline?: boolean;
    isTransparent?: boolean;
    zIndex?: number;
    insertSpaces?: boolean;
    customData?: object;
    isUnisonSelected?: boolean;
    bounds?: IFormFieldBound;
}
/**
 * Defines the common properties of Form Fields Item
 *
 * @hidden
 */
export interface IFormField {
    id?: string;
    lineBound?: IFormFieldBound;
    bounds?: Rectangle | PdfBoundsModel;
    pageNumber?: number;
    pageIndex?: number;
    zoomValue?: number;
    formFieldAnnotationType?: string;
    name?: string;
    value?: string;
    option?: ItemModel[];
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    fontColor?: RGBA;
    color?: string;
    backgroundColor: RGBA;
    textAlign?: string;
    alignment?: string;
    isReadonly?: boolean;
    visibility?: string;
    maxLength?: number;
    isRequired?: boolean;
    isMultiline?: boolean;
    isDateField?: boolean;
    isPrint?: boolean;
    rotation?: number;
    tooltip?: string;
    isChecked?: boolean;
    isSelected?: boolean;
    radiobuttonItem?: IRadiobuttonItem[];
    selectedIndex?: number[];
    options?: ItemModel[];
    borderColor?: RGBA;
    thickness?: number;
    font?: PdfFontModel;
    signatureBound?: PdfBoundsModel;
    signatureType?: string;
    type?: string;
    actions?: ActionsSettingsModel | object;
    currentName?: string;
    previousName?: string;
    insertSpaces?: boolean;
    isTransparent?: boolean;
    zIndex?: number;
    customData?: object;
    isUnisonSelected?: boolean;
    Multiline?: boolean;
    isReadOnly?: boolean;
    symbology?: BarcodeSymbology;
    xDimension?: number;
    errorCorrectionLevel?: string;
    valueFormat?: 'TabDelimited' | 'Xml' | 'CustomValue';
    fields?: string[];
    includeFieldNames?: boolean;
    compressData?: boolean;
    customValue?: string;
    caption?: string;
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
    selectedOptions: HTMLCollectionOf<HTMLOptionElement>;
    autocomplete: string;
    type: string;
}

/**
 * Slot action that may be a flat GoTo or a legacy nested wrapper.
 *
 * @hidden
 */
export interface ButtonRuntimeAction {
    actionType?: string;
    goToAction?: GoToActionModel;
}
