import { SelectionCharacterFormat } from '../index';
import { Selection } from '../index';
import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { DropDownList, ComboBox } from '@syncfusion/ej2-dropdowns';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { WCharacterFormat } from '../format/character-format';
import { Underline, Strikethrough, BaselineAlignment } from '../../base/types';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { DocumentHelper } from '../viewer';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
/* eslint-disable */
/**
 * The Font dialog is used to modify formatting of selected text.
 */
export class FontDialog {
    private fontStyleInternal: string = undefined;
    public documentHelper: DocumentHelper;
    private target: HTMLElement;
    private fontNameList: ComboBox = undefined;
    private fontStyleText: DropDownList = undefined;
    private fontSizeText: ComboBox = undefined;
    private colorPicker: ColorPicker = undefined;
    private fontColorDiv: HTMLElement;
    private underlineDrop: DropDownList = undefined;
    private strikethroughBox: CheckBox = undefined;
    private doublestrikethrough: CheckBox = undefined;
    private superscript: CheckBox = undefined;
    private subscript: CheckBox = undefined;
    private allcaps: CheckBox = undefined;
    //Character Format Property
    private bold: boolean = undefined;
    private italic: boolean = undefined;
    private underline: Underline = undefined;
    private strikethrough: Strikethrough = undefined;
    private baselineAlignment: BaselineAlignment = undefined;
    private fontSize: number = undefined;
    private fontFamily: string = undefined;
    private fontColor: string = undefined;
    private allCaps: boolean = undefined;
    private isListDialog: boolean = false;


    private effectLabel: HTMLElement;
    private strikeThroughElement: HTMLInputElement;
    private superScriptElement: HTMLInputElement;
    private subScriptElement: HTMLInputElement;
    private doubleStrikeThroughElement: HTMLInputElement;
    private allCapsElement: HTMLInputElement;
    private fontEffectSubDiv1: HTMLElement;
    private fontDiv: HTMLElement;
    private colorDiv: HTMLElement;
    private fontColorLabel: HTMLElement;
    private fontColorElement: HTMLElement;
    private fontEffectsDiv: HTMLElement;
    private effectsProperties: HTMLElement;
    private fontEffectSubDiv2: HTMLElement;
    private checkBoxDiv: HTMLElement;
    private fontEffectSubDiv3: HTMLElement;
    
    private sizeSubDiv1: HTMLElement;
    private sizeSubDiv2: HTMLElement;
    private getFontSize: HTMLSelectElement;
    private getSizeDiv: HTMLElement;
    private underlineElement: HTMLSelectElement;
    private fontNameValues: HTMLSelectElement;
    private fontSubDiv2: HTMLElement;
    private fontStyleValues: HTMLSelectElement;
    private fontSubDiv1: HTMLElement;
    /**
     * @private
     */
    public characterFormat: WCharacterFormat = undefined;

    /**
     * @private
     * @returns {string} returns font style
     */
    public  get fontStyle(): string {
        return this.fontStyleInternal;
    }
    /**
     * @private
     * @param {string} value Specifies font style
     */
    public set fontStyle(value: string) {
        this.fontStyleInternal = value;
        switch (this.fontStyle) {
        case 'Bold':
            this.bold = true;
            this.italic = false;
            break;
        case 'Italic':
            this.bold = false;
            this.italic = true;
            break;
        case 'BoldItalic':
            this.bold = true;
            this.italic = true;
            break;
        case 'Regular':
            this.bold = false;
            this.italic = false;
            break;
        }
    }
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    /**
     * @private
     * @returns {string} Returns module name
     */
    public getModuleName(): string {
        return 'FontDialog';
    }
    private createInputElement(type: string, id: string, className: string): HTMLInputElement {
        const element: HTMLInputElement = createElement('input', {
            attrs: { type: type },
            id: id,
            className: className
        }) as HTMLInputElement;
        return element;
    }
    /**
     * @private
     * @param {L10n} locale - Specifies the locale.
     * @param {boolean} isRtl - Specifies is rtl.
     * @returns {void}
     */
    public initFontDialog(locale: L10n, isRtl?: boolean): void {

        const id: string = this.documentHelper.owner.containerId;
        this.target = createElement('div', { className: 'e-de-font-dlg' });
        const fontDiv: HTMLElement = this.getFontDiv(locale, isRtl);
        this.target.appendChild(fontDiv);
        const sizeDiv: HTMLElement = this.getFontSizeDiv(locale, isRtl);
        this.target.appendChild(sizeDiv);
        this.colorDiv = createElement('div', { className: 'e-de-container-row' });
        this.fontColorDiv = createElement('div', { className: 'e-de-font-dlg-display' });
        this.fontColorLabel = createElement('label', {
            className: 'e-de-font-dlg-header-font-color e-de-font-color-margin',
            innerHTML: locale.getConstant('Font color')
        });
        if (isRtl) {
            this.fontColorLabel.classList.add('e-de-rtl');
        }
        this.fontColorDiv.appendChild(this.fontColorLabel);
        this.fontColorElement = this.createInputElement('color', this.target.id + '_ColorDiv', 'e-de-font-dlg-color');
        this.fontColorDiv.appendChild(this.fontColorElement);
        this.colorDiv.appendChild(this.fontColorDiv);
        this.target.appendChild(this.colorDiv);
        this.fontEffectsDiv = createElement('div');        
        this.fontEffectSubDiv1 = createElement('div');
        this.effectLabel = createElement('div', {
            className: 'e-de-para-dlg-heading',
            innerHTML: locale.getConstant('Effects'),
        });
        this.fontEffectSubDiv1.appendChild(this.effectLabel);
        this.fontEffectsDiv.appendChild(this.fontEffectSubDiv1);
        this.target.appendChild(this.fontEffectsDiv);

        this.effectsProperties = createElement('div', { className: 'e-de-container-row'});
        this.fontEffectSubDiv2 = createElement('div', { className: 'e-de-subcontainer-left' });
        
        this.strikeThroughElement = this.createInputElement('checkbox', this.target.id + '_strikeThrough', '') as HTMLInputElement;
        this.fontEffectSubDiv2.appendChild(this.strikeThroughElement);

        this.checkBoxDiv = createElement('div', { className: 'e-de-font-checkbox' });
        this.subScriptElement = this.createInputElement('checkbox', this.target.id + '_subScript', '') as HTMLInputElement;
        this.checkBoxDiv.appendChild(this.subScriptElement)
        this.fontEffectSubDiv2.appendChild(this.checkBoxDiv);

        this.checkBoxDiv = createElement('div', { className: 'e-de-font-checkbox' });
        this.allCapsElement = this.createInputElement('checkbox', this.target.id + '_allCaps', '') as HTMLInputElement;
        this.checkBoxDiv.appendChild(this.allCapsElement)
        this.fontEffectSubDiv2.appendChild(this.checkBoxDiv);

        this.effectsProperties.appendChild(this.fontEffectSubDiv2);

        this.fontEffectSubDiv3 = createElement('div', { className: 'e-de-subcontainer-right' });
        
        this.superScriptElement = this.createInputElement('checkbox', this.target.id + '_superScript', '') as HTMLInputElement;
        this.fontEffectSubDiv3.appendChild(this.superScriptElement);
        
        this.checkBoxDiv = createElement('div', { className: 'e-de-font-checkbox' });
        this.doubleStrikeThroughElement = this.createInputElement('checkbox', this.target.id + '_doubleStrikeThrough', '') as HTMLInputElement;
        this.checkBoxDiv.appendChild(this.doubleStrikeThroughElement)
        this.fontEffectSubDiv3.appendChild(this.checkBoxDiv);

        this.effectsProperties.appendChild(this.fontEffectSubDiv3);
        this.target.appendChild(this.effectsProperties);
        const {columns , createPopupOnClick , cssClass , disabled , enablePersistence , inline , mode , modeSwitcher , noColor , presetColors , showButtons } = this.documentHelper.owner.documentEditorSettings.colorPickerSettings;
        this.colorPicker = new ColorPicker({
            change: this.fontColorUpdate, value: '#000000', enableRtl: isRtl, locale: this.documentHelper.owner.locale, enableOpacity: false, mode:mode , modeSwitcher:modeSwitcher , showButtons: showButtons , columns:columns , createPopupOnClick : createPopupOnClick , cssClass : cssClass , disabled : disabled , enablePersistence : enablePersistence , inline : inline , noColor : noColor , presetColors : presetColors
        });
      
        this.colorPicker.appendTo(this.fontColorElement);
        this.strikethroughBox = new CheckBox({
            change: this.singleStrikeUpdate,
            cssClass: 'e-de-font-content-label',
            label: locale.getConstant('Strikethrough'),
            enableRtl: isRtl
        });
        this.documentHelper.colorPicker = this.colorPicker;
        this.strikethroughBox.appendTo(this.strikeThroughElement);
        this.doublestrikethrough = new CheckBox({
            change: this.doubleStrikeUpdate,
            label: locale.getConstant('Double strikethrough'),
            enableRtl: isRtl
        });
        this.doublestrikethrough.appendTo(this.doubleStrikeThroughElement);
        this.subscript = new CheckBox({
            label: locale.getConstant('Subscript'),
            cssClass: 'e-de-font-content-label-width',
            change: this.subscriptUpdate,
            enableRtl: isRtl
        });
        this.subscript.appendTo(this.subScriptElement);
        this.superscript = new CheckBox({
            label: locale.getConstant('Superscript'),
            cssClass: 'e-de-font-content-label', change: this.superscriptUpdate,
            enableRtl: isRtl
        });
        this.superscript.appendTo(this.superScriptElement);
        this.allcaps = new CheckBox({
            label: locale.getConstant('All caps'),
            cssClass: 'e-de-font-content-label-caps',
            change: this.allcapsUpdate,
            enableRtl: isRtl
        });
        this.allcaps.appendTo(this.allCapsElement);
        if (isRtl) {
            this.fontEffectSubDiv2.classList.add('e-de-rtl');
            this.fontEffectSubDiv3.classList.add('e-de-rtl');
            this.fontEffectSubDiv1.classList.remove('e-de-font-content-checkbox-label');
        }
    }
    private getFontSizeDiv(locale: L10n, isRtl?: boolean): HTMLElement {
        const id: string = this.documentHelper.owner.containerId;
        this.getSizeDiv = createElement('div', { className: 'e-de-container-row' });
        this.sizeSubDiv1 = createElement('div', { className: 'e-de-subcontainer-left'});
        const sizeLabel : string = locale.getConstant('Size');
        this.getFontSize = createElement('select', { id: this.target.id + '_fontSize'}) as HTMLSelectElement;
        this.getFontSize.innerHTML = '<option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>' +
            '<option>14</option><option>16</option><option>18</option><option>20</option><option>24</option><option>26</option>' +
            '<option>28</option><option>36</option><option>48</option><option>72</option><option>96</option>';
        this.sizeSubDiv1.appendChild(this.getFontSize);
        this.getSizeDiv.appendChild(this.sizeSubDiv1);
        this.sizeSubDiv2 = createElement('div', {
            className: 'e-de-subcontainer-right',
        });
        if (isRtl) {
            this.sizeSubDiv2.classList.add('e-de-rtl');
        }
        const html: string = locale.getConstant('Underline style');
        this.underlineElement = createElement('select', { id: this.target.id + '_underLine' }) as HTMLSelectElement;
        this.underlineElement.innerHTML = '<option value="None">' + locale.getConstant('None') + '</option><option value="Single">________</option>';
        this.sizeSubDiv2.appendChild(this.underlineElement);
        this.getSizeDiv.appendChild(this.sizeSubDiv2);
        this.fontSizeText = new ComboBox({ change: this.fontSizeUpdate, allowCustom: true, showClearButton:false, enableRtl: isRtl, floatLabelType: 'Always', placeholder: sizeLabel,htmlAttributes:{'aria-labelledby':sizeLabel} });
        this.fontSizeText.appendTo(this.getFontSize);
        this.underlineDrop = new DropDownList({ change: this.underlineUpdate, enableRtl: isRtl, floatLabelType : 'Always', placeholder: html,htmlAttributes:{'aria-labelledby':html}  });
        this.underlineDrop.appendTo(this.underlineElement);
        return this.getSizeDiv;
    }
    private getFontDiv(locale: L10n, isRtl?: boolean): HTMLElement {
        const id: string = this.documentHelper.owner.containerId;
        this.fontDiv = createElement('div', { className: 'e-de-container-row' });
        this.fontSubDiv1 = createElement('div', { className: 'e-de-subcontainer-left' });
        const fontLabel : string = locale.getConstant('Font');
        this.fontNameValues = createElement('select', { id: this.target.id + '_fontName' }) as HTMLSelectElement;
        const fontValues: string[] = this.documentHelper.owner.documentEditorSettings.fontFamilies;
        for (let i: number = 0; i < fontValues.length; i++) {
            this.fontNameValues.innerHTML += '<option>' + fontValues[i] + '</option>';
        }
        this.fontSubDiv1.appendChild(this.fontNameValues);
        this.fontDiv.appendChild(this.fontSubDiv1);
        this.fontSubDiv2 = createElement('div', { className: 'e-de-subcontainer-right' });
        if (isRtl) {
            this.fontSubDiv2.classList.add('e-de-rtl');
        }
        const fontStyleLabel : string = locale.getConstant('Font style');
        this.fontStyleValues = createElement('select', { id: this.target.id + '_fontStyle' }) as HTMLSelectElement;
        this.fontStyleValues.innerHTML = '<option value="Regular">' +
            locale.getConstant('Regular') + '</option><option value="Bold">' + locale.getConstant('Bold') + '</option><option value="Italic">' +
            locale.getConstant('Italic') + '</option><option value="BoldItalic">' + locale.getConstant('Bold') + locale.getConstant('Italic') + '</option>';
        this.fontSubDiv2.appendChild(this.fontStyleValues);
        this.fontDiv.appendChild(this.fontSubDiv2);
        this.fontNameList = new ComboBox({ change: this.fontFamilyUpdate, enableRtl: isRtl, floatLabelType: 'Always', placeholder: fontLabel});
        this.fontNameList.showClearButton = false;
        this.fontNameList.appendTo(this.fontNameValues);
        this.fontStyleText = new DropDownList({ change: this.fontStyleUpdate, enableRtl: isRtl, floatLabelType: 'Always', placeholder: fontStyleLabel });
        this.fontStyleText.appendTo(this.fontStyleValues);
        return this.fontDiv;
    }
    /**
     * @param characterFormat
     * @private
     */
    public showFontDialog(characterFormat?: WCharacterFormat, isListDialog?: boolean): void {
        if (characterFormat) {
            this.characterFormat = characterFormat;
        }
        this.isListDialog = isListDialog;
        const locale: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        locale.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initFontDialog(locale, this.documentHelper.owner.enableRtl);
        }
        this.documentHelper.dialog.header = locale.getConstant('Font');
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.loadFontDialog;
        this.documentHelper.dialog.close = this.closeFontDialog;
        this.documentHelper.dialog.buttons = [{
            click: this.onInsertFontFormat,
            buttonModel: { content: locale.getConstant('Ok'), cssClass: 'e-flat e-font-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: locale.getConstant('Cancel'), cssClass: 'e-flat e-font-cancel' }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public loadFontDialog = (): void => {
        this.documentHelper.updateFocus();
        let characterFormat: WCharacterFormat | SelectionCharacterFormat;
        if (this.characterFormat) {
            characterFormat = this.characterFormat;
        } else {
            characterFormat = this.documentHelper.owner.selectionModule.characterFormat;
        }
        this.fontNameList.value = characterFormat.fontFamily;
        this.fontNameList.dataBind();
        if (!characterFormat.bold && !characterFormat.italic) {
            this.fontStyleText.value = this.fontSizeText.value;
            this.fontStyleText.index = 0;
        } else if (characterFormat.bold && !characterFormat.italic) {
            this.fontStyleText.value = this.fontSizeText.value;
            this.fontStyleText.index = 1;
        } else if (!characterFormat.bold && characterFormat.italic) {
            this.fontStyleText.value = this.fontSizeText.value;
            this.fontStyleText.index = 2;
        } else if (characterFormat.bold && characterFormat.italic) {
            this.fontStyleText.value = this.fontSizeText.value;
            this.fontStyleText.index = 3;
        }
        if (!isNullOrUndefined(characterFormat.fontSize)) {           
            this.fontSizeText.value = characterFormat.fontSize;
        }
        if (!isNullOrUndefined(characterFormat.fontColor)) {
            let fontColor: string = characterFormat.fontColor;
            // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
            if (fontColor === 'empty' || fontColor === '#00000000') {
                fontColor = '#000000';
            }
            this.colorPicker.value = fontColor;
        } else {
            this.colorPicker.value = '#000000';
        }
        if (characterFormat.underline === 'None') {
            this.underlineDrop.index = 0;
        } else if (characterFormat.underline === 'Single') {
            this.underlineDrop.index = 1;
        }
        if (characterFormat.strikethrough === 'SingleStrike') {
            this.strikethroughBox.checked = true;
        } else if (characterFormat.strikethrough === 'DoubleStrike') {
            this.doublestrikethrough.checked = true;
        } else {
            this.strikethroughBox.checked = false;
            this.doublestrikethrough.checked = false;
        }
        if (characterFormat.baselineAlignment === 'Superscript') {
            this.superscript.checked = true;
        } else if (characterFormat.baselineAlignment === 'Subscript') {
            this.subscript.checked = true;
        } else {
            this.superscript.checked = false;
            this.subscript.checked = false;
        }
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        if (characterFormat.allCaps) {
            this.allcaps.checked = true;
        } else {
            this.allcaps.checked = false;
            this.allCaps = false;
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public closeFontDialog = (): void => {
        this.unWireEventsAndBindings();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
        this.unWireEventsAndBindings();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public onInsertFontFormat = (): void => {
        let format: WCharacterFormat;
        if (this.characterFormat) {
            format = this.characterFormat;
        } else {
            format = new WCharacterFormat(undefined, this.documentHelper.owner);
        }
        if (!isNullOrUndefined(this.bold)) {
            format.bold = this.bold;
        }
        if (!isNullOrUndefined(this.italic)) {
            format.italic = this.italic;
        }
        if (!isNullOrUndefined(this.fontSize) && this.fontSize > 0) {
            format.fontSize = this.fontSize;
        }
        if (!isNullOrUndefined(this.fontColor)) {
            format.fontColor = this.fontColor;
        }
        if (!isNullOrUndefined(this.baselineAlignment)) {
            format.baselineAlignment = this.baselineAlignment;
        }
        if (!isNullOrUndefined(this.strikethrough)) {
            format.strikethrough = this.strikethrough;
        }
        if (!isNullOrUndefined(this.underline)) {
            format.underline = this.underline;
        }
        if (!isNullOrUndefined(this.fontFamily)) {
            let fontFamily :string = SanitizeHtmlHelper.sanitize(this.fontFamily)
            format.fontFamily = fontFamily;
            format.fontFamilyAscii = fontFamily;
            format.fontFamilyFarEast = fontFamily;
            format.fontFamilyNonFarEast = fontFamily;
            format.fontFamilyBidi =  fontFamily;
        }
        if (!isNullOrUndefined(this.allCaps)) {
            format.allCaps = this.allCaps;
        }
        if (!this.characterFormat) {
            this.onCharacterFormat(this.documentHelper.selection, format);
        } else {
            if(this.isListDialog) {
                 this.documentHelper.owner.listDialogModule.updateCharacterFormat(format);
            } else {
                this.documentHelper.owner.styleDialogModule.updateCharacterFormat();
            }
        }
        this.documentHelper.hideDialog();
    };

    /**
     * @private
     * @param {Selection} selection Specifies the selection
     * @param {WCharacterFormat} format Specifies the character format
     * @returns {void}
     */
    public onCharacterFormat(selection: Selection, format: WCharacterFormat): void {
        if (!isNullOrUndefined(selection) && selection.checkContentControlLocked(true)) {
            return;
        }
        this.documentHelper.owner.editorModule.initHistory('CharacterFormat');
        if (selection.isEmpty) {
            if (selection.start.offset === selection.getParagraphLength(selection.start.paragraph)) {
                this.documentHelper.owner.editorModule.applyCharFormatValueInternal(selection, selection.start.paragraph.characterFormat, undefined, format);
                this.documentHelper.owner.editorModule.reLayout(selection);
            }
            this.documentHelper.updateFocus();
            return;
        } else {
            //Iterate and update formating.
            this.documentHelper.owner.editorModule.setOffsetValue(this.documentHelper.selection);
            this.documentHelper.owner.editorModule.updateSelectionCharacterFormatting('CharacterFormat', format, false);
        }
    }

    private enableCheckBoxProperty(args: any): void {
        if (this.strikethroughBox.checked && this.doublestrikethrough.checked) {
            this.strikethroughBox.checked = false;
            this.doublestrikethrough.checked = false;
            if (args.event.currentTarget.innerText === this.target.id + 'Double strikethrough') {
                this.doublestrikethrough.checked = true;
            } else {
                this.strikethroughBox.checked = true;
            }
        }
        if (this.superscript.checked && this.subscript.checked) {
            this.subscript.checked = false;
            this.superscript.checked = false;
            if (args.event.currentTarget.innerText === this.target.id + 'Subscript') {
                this.subscript.checked = true;
            } else {
                this.superscript.checked = true;
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private fontSizeUpdate = (args: any): void => {
        this.fontSize = args.value;
    };
    /**
     * @private
     * @returns {void}
     */
    private fontStyleUpdate = (args: any): void => {
        this.fontStyle = args.value;
    };
    /**
     * @private
     * @returns {void}
     */
    private fontFamilyUpdate = (args: any): void => {
        this.fontFamily = args.value;
    };
    /**
     * @private
     * @returns {void}
     */
    private underlineUpdate = (args: any): void => {
        this.underline = args.value;
    };
    /**
     * @private
     * @returns {void}
     */
    private fontColorUpdate = (args: ColorPickerEventArgs): void => {
        if (!isNullOrUndefined(args.currentValue)) {
            this.fontColor = args.currentValue.hex;
        }
    };
    /**
     * @private
     * @returns {void}
     */
    private singleStrikeUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.strikethrough = 'SingleStrike';
        } else {
            this.strikethrough = 'None';
        }
    };
    /**
     * @private
     * @returns {void}
     */
    private doubleStrikeUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.strikethrough = 'DoubleStrike';
        } else {
            this.strikethrough = 'None';
        }
    };
    /**
     * @private
     * @returns {void}
     */
    private superscriptUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.baselineAlignment = 'Superscript';
        } else {
            this.baselineAlignment = 'Normal';
        }
    };
    /**
     * @private
     * @returns {void}
     */
    private subscriptUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.baselineAlignment = 'Subscript';
        } else {
            this.baselineAlignment = 'Normal';
        }

    };
    /**
     * @private
     * @returns {void}
     */
    private allcapsUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.allCaps = true;
        } else {
            this.allCaps = false;
        }

    };
    /**
     * @private
     * @returns {void}
     */
    public unWireEventsAndBindings(): void {
        this.fontNameList.value = '';
        this.fontSizeText.value = '';
        this.fontStyleText.value = '';
        this.strikethroughBox.checked = false;
        this.doublestrikethrough.checked = false;
        this.superscript.checked = false;
        this.subscript.checked = false;
        this.allcaps.checked = false;
        this.bold = undefined;
        this.italic = undefined;
        this.underline = undefined;
        this.strikethrough = undefined;
        this.baselineAlignment = undefined;
        this.fontColor = undefined;
        this.fontSize = undefined;
        this.fontFamily = undefined;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.documentHelper = undefined;
        if (this.characterFormat) {
            this.characterFormat.destroy();
            this.characterFormat = undefined;
        }
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let m: number = 0; m < this.target.childNodes.length; m++) {
                this.target.removeChild(this.target.childNodes[m]);
                m--;
            }
            this.target = undefined;
        }
        this.removeElements();
        if (this.fontNameList) {
            this.fontNameList.destroy();
        }
        this.fontNameList = undefined;
        if (this.fontStyleText) {
            this.fontStyleText.destroy();
        }
        this.fontStyleText = undefined;
        if (this.fontSizeText) {
            this.fontSizeText.destroy();
        }
        this.fontSizeText = undefined;
        if (this.colorPicker) {
            this.colorPicker.destroy();
        }
        this.colorPicker = undefined;
        if (this.underlineDrop) {
            this.underlineDrop.destroy();
        }
        this.underlineDrop = undefined;
        if (this.strikethroughBox) {
            this.strikethroughBox.destroy();
        }
        this.strikethroughBox = undefined;
        if (this.doublestrikethrough) {
            this.doublestrikethrough.destroy();
        }
        this.doublestrikethrough = undefined;
        if (this.superscript) {
            this.superscript.destroy();
        }
        this.superscript = undefined;
        if (this.subscript) {
            this.subscript.destroy();
        }
        this.subscript = undefined;
        if (this.allcaps) {
            this.allcaps.destroy();
        }
        this.allcaps = undefined;
    }
    private removeElements(): void {
        if (this.effectLabel) {
            this.effectLabel.remove();
            this.effectLabel = undefined;
        }
        if (this.strikeThroughElement) {
            this.strikeThroughElement.remove();
            this.strikeThroughElement = undefined;
        }
        if (this.superScriptElement) {
            this.superScriptElement.remove();
            this.superScriptElement = undefined;
        }
        if (this.subScriptElement) {
            this.subScriptElement.remove();
            this.subScriptElement = undefined;
        }
        if (this.doubleStrikeThroughElement) {
            this.doubleStrikeThroughElement.remove();
            this.doubleStrikeThroughElement = undefined;
        }
        if (this.allCapsElement) {
            this.allCapsElement.remove();
            this.allCapsElement = undefined;
        }
        if (this.fontEffectSubDiv1) {
            this.fontEffectSubDiv1.remove();
            this.fontEffectSubDiv1 = undefined;
        }
        if (this.fontDiv) {
            this.fontDiv.remove();
            this.fontDiv = undefined;
        }
        if (this.colorDiv) {
            this.colorDiv.remove();
            this.colorDiv = undefined;
        }
        if (this.fontColorLabel) {
            this.fontColorLabel.remove();
            this.fontColorLabel = undefined;
        }
        if (this.fontColorElement) {
            this.fontColorElement.remove();
            this.fontColorElement = undefined;
        }
        if (this.fontEffectsDiv) {
            this.fontEffectsDiv.remove();
            this.fontEffectsDiv = undefined;
        }
        if (this.effectsProperties) {
            this.effectsProperties.remove();
            this.effectsProperties = undefined;
        }
        if (this.fontEffectSubDiv2) {
            this.fontEffectSubDiv2.remove();
            this.fontEffectSubDiv2 = undefined;
        }
        if (this.checkBoxDiv) {
            this.checkBoxDiv.remove();
            this.checkBoxDiv = undefined;
        }
        if (this.fontEffectSubDiv3) {
            this.fontEffectSubDiv3.remove();
            this.fontEffectSubDiv3 = undefined;
        }
        if (this.getSizeDiv) {
            this.getSizeDiv.remove();
            this.getSizeDiv = undefined;
        }
        if (this.sizeSubDiv1) {
            this.sizeSubDiv1.remove();
            this.sizeSubDiv1 = undefined;
        }
        if (this.sizeSubDiv2) {
            this.sizeSubDiv2.remove();
            this.sizeSubDiv2 = undefined;
        }
        if (this.getFontSize) {
            this.getFontSize.remove();
            this.getFontSize = undefined;
        }
        if (this.underlineElement) {
            this.underlineElement.remove();
            this.underlineElement = undefined;
        }
        if (this.fontNameValues) {
            this.fontNameValues.remove();
            this.fontNameValues = undefined;
        }
        if (this.fontSubDiv2) {
            this.fontSubDiv2.remove();
            this.fontSubDiv2 = undefined;
        }
        if (this.fontStyleValues) {
            this.fontStyleValues.remove();
            this.fontStyleValues = undefined;
        }
        if (this.fontSubDiv1) {
            this.fontSubDiv1.remove();
            this.fontSubDiv1 = undefined;
        }
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
