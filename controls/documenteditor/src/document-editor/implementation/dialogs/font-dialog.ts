import { SelectionCharacterFormat } from '../index';
import { Selection } from '../index';
import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { DropDownList, ComboBox } from '@syncfusion/ej2-dropdowns';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { WCharacterFormat } from '../format/character-format';
import { Underline, Strikethrough, BaselineAlignment } from '../../base/types';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { DocumentHelper } from '../viewer';
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

        let effectLabel: HTMLElement;
        let strikeThroughElement: HTMLInputElement;
        let superScriptElement: HTMLInputElement;
        let subScriptElement: HTMLInputElement;
        let doubleStrikeThroughElement: HTMLInputElement;
        let allCapsElement: HTMLInputElement;
        const id: string = this.documentHelper.owner.containerId;
        this.target = createElement('div', { id: id + '_insertFontDialog', className: 'e-de-font-dlg' });
        const fontDiv: HTMLElement = this.getFontDiv(locale, isRtl);
        this.target.appendChild(fontDiv);
        const sizeDiv: HTMLElement = this.getFontSizeDiv(locale, isRtl);
        this.target.appendChild(sizeDiv);
        const colorDiv: HTMLElement = createElement('div', { id: id + '_fontColor', className: 'e-de-font-clr-div' });
        this.fontColorDiv = createElement('div', { id: id + '_fontColorDiv', className: 'e-de-font-dlg-display' });
        const fontColorLabel: HTMLElement = createElement('label', {
            className: 'e-de-font-dlg-header-font-color e-de-font-color-margin',
            innerHTML: locale.getConstant('Font color'), styles: 'width:63px'
        });
        if (isRtl) {
            fontColorLabel.classList.add('e-de-rtl');
        }
        this.fontColorDiv.appendChild(fontColorLabel);
        const fontColorElement: HTMLElement = this.createInputElement('color', this.target.id + '_ColorDiv', 'e-de-font-dlg-color');
        this.fontColorDiv.appendChild(fontColorElement);
        colorDiv.appendChild(this.fontColorDiv);
        this.target.appendChild(colorDiv);
        const fontEffectsDiv: HTMLElement = createElement('div', { id: id + '_fontEffectsDiv' });
        const fontEffectSubDiv1: HTMLElement = createElement('div', {
            className: 'e-de-font-color-label e-de-font-dlg-display',
            id: this.target.id + '_fontEffectsSubDiv1'
        });
        effectLabel = createElement('label', {
            className: 'e-de-font-dlg-header-effects',
            innerHTML: locale.getConstant('Effects'), styles: 'width:58px'
        });
        fontEffectSubDiv1.appendChild(effectLabel);
        strikeThroughElement = this.createInputElement('checkbox', this.target.id + '_strikeThrough', '') as HTMLInputElement;
        fontEffectSubDiv1.appendChild(strikeThroughElement);
        superScriptElement = this.createInputElement('checkbox', this.target.id + '_superScript', '') as HTMLInputElement;
        fontEffectSubDiv1.appendChild(superScriptElement);
        fontEffectsDiv.appendChild(fontEffectSubDiv1);
        const fontEffectSubDiv2: HTMLElement = createElement('div', { className: 'e-de-font-checkbox', id: id + '_fontEffectsSubDiv2' });
        subScriptElement = this.createInputElement('checkbox', this.target.id + '_subScript', '') as HTMLInputElement;
        fontEffectSubDiv2.appendChild(subScriptElement);
        doubleStrikeThroughElement = this.createInputElement('checkbox', this.target.id + '_doubleStrikeThrough', '') as HTMLInputElement;
        fontEffectSubDiv2.appendChild(doubleStrikeThroughElement);
        fontEffectsDiv.appendChild(fontEffectSubDiv2);
        const fontEffectSubDiv3: HTMLElement = createElement('div', { className: 'e-de-font-checkbox-transform-label e-de-font-checkbox-transform', id: id + '_fontEffectsSubDiv3' });
        allCapsElement = this.createInputElement('checkbox', this.target.id + '_allCaps', '') as HTMLInputElement;
        fontEffectSubDiv3.appendChild(allCapsElement);
        fontEffectsDiv.appendChild(fontEffectSubDiv3);
        this.target.appendChild(fontEffectsDiv);
        this.colorPicker = new ColorPicker({
            change: this.fontColorUpdate, value: '#000000', enableRtl: isRtl, locale: this.documentHelper.owner.locale
        });
        this.colorPicker.appendTo(fontColorElement);
        this.strikethroughBox = new CheckBox({
            change: this.singleStrikeUpdate,
            cssClass: 'e-de-font-content-label',
            label: locale.getConstant('Strikethrough'),
            enableRtl: isRtl
        });
        this.strikethroughBox.appendTo(strikeThroughElement);
        this.doublestrikethrough = new CheckBox({
            change: this.doubleStrikeUpdate,
            cssClass: 'e-de-font-content-checkbox-label',
            label: locale.getConstant('Double strikethrough'),
            enableRtl: isRtl
        });
        this.doublestrikethrough.appendTo(doubleStrikeThroughElement);
        this.subscript = new CheckBox({
            label: locale.getConstant('Subscript'),
            cssClass: 'e-de-font-content-label-width',
            change: this.subscriptUpdate,
            enableRtl: isRtl
        });
        this.subscript.appendTo(subScriptElement);
        this.superscript = new CheckBox({
            label: locale.getConstant('Superscript'),
            cssClass: 'e-de-font-content-label', change: this.superscriptUpdate,
            enableRtl: isRtl
        });
        this.superscript.appendTo(superScriptElement);
        this.allcaps = new CheckBox({
            label: locale.getConstant('All caps'),
            cssClass: 'e-de-font-content-label-caps',
            change: this.allcapsUpdate,
            enableRtl: isRtl
        });
        this.allcaps.appendTo(allCapsElement);
        if (isRtl) {
            fontEffectSubDiv2.classList.add('e-de-rtl');
            fontEffectSubDiv3.classList.add('e-de-rtl');
            this.doublestrikethrough.cssClass = 'e-de-font-content-checkbox-label-rtl';
        }
    }
    private getFontSizeDiv(locale: L10n, isRtl?: boolean): HTMLElement {
        let fontSize: HTMLSelectElement;
        let sizeDiv: HTMLElement;
        const id: string = this.documentHelper.owner.containerId;
        sizeDiv = createElement('div', { id: id + '_fontSizeAndUnderlineDiv', className: 'e-de-font-dlg-padding e-de-font-dlg-display' });
        const sizeSubDiv1: HTMLElement = createElement('div', { id: id + '_fontSizeAndUnderlineSubDiv1' });
        const sizeLabel: HTMLElement = createElement('label', { className: 'e-de-font-dlg-header', innerHTML: locale.getConstant('Size') });
        const styles: string = 'font-family:Roboto;font-size:14px;opacity:0.8;';
        fontSize = createElement('select', { id: this.target.id + '_fontSize', styles: styles }) as HTMLSelectElement;
        fontSize.innerHTML = '<option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>' +
            '<option>14</option><option>16</option><option>18</option><option>20</option><option>24</option><option>26</option>' +
            '<option>28</option><option>36</option><option>48</option><option>72</option><option>96</option>';
        sizeSubDiv1.appendChild(sizeLabel);
        sizeSubDiv1.appendChild(fontSize);
        sizeDiv.appendChild(sizeSubDiv1);
        const sizeSubDiv2: HTMLElement = createElement('div', {
            className: 'e-de-font-dlg-cb-right',
            id: id + '_fontSizeAndUnderlineSubDiv2'
        });
        if (isRtl) {
            sizeSubDiv2.classList.add('e-de-rtl');
        }
        const html: string = locale.getConstant('Underline style');
        const underlineLabel: HTMLElement = createElement('label', { className: 'e-de-font-dlg-header', innerHTML: html });
        let underlineElement: HTMLSelectElement;
        underlineElement = createElement('select', { id: this.target.id + '_underLine', styles: styles }) as HTMLSelectElement;
        underlineElement.innerHTML = '<option value="None">' + locale.getConstant('None') + '</option><option value="Single">________</option>';
        sizeSubDiv2.appendChild(underlineLabel);
        sizeSubDiv2.appendChild(underlineElement);
        sizeDiv.appendChild(sizeSubDiv2);
        this.fontSizeText = new ComboBox({ change: this.fontSizeUpdate, popupHeight: '170px', width: '170px', enableRtl: isRtl });
        this.fontSizeText.showClearButton = false;
        this.fontSizeText.appendTo(fontSize);
        this.underlineDrop = new DropDownList({ change: this.underlineUpdate, popupHeight: '100px', width: '170px', enableRtl: isRtl });
        this.underlineDrop.appendTo(underlineElement);
        return sizeDiv;
    }
    private getFontDiv(locale: L10n, isRtl?: boolean): HTMLElement {
        const id: string = this.documentHelper.owner.containerId;
        const fontDiv: HTMLElement = createElement('div', { id: id + '_fontDiv', className: 'e-de-font-dlg-display' });
        const fontSubDiv1: HTMLElement = createElement('div', { id: id + '_fontSubDiv1' });
        const fontNameLabel: HTMLElement = createElement('label', {
            className: 'e-de-font-dlg-header',
            innerHTML: locale.getConstant('Font')
        });
        const fontNameValues: HTMLSelectElement = createElement('select', { id: this.target.id + '_fontName' }) as HTMLSelectElement;
        const fontValues: string[] = this.documentHelper.owner.documentEditorSettings.fontFamilies;
        for (let i: number = 0; i < fontValues.length; i++) {
            fontNameValues.innerHTML += '<option>' + fontValues[i] + '</option>';
        }
        fontSubDiv1.appendChild(fontNameLabel);
        fontSubDiv1.appendChild(fontNameValues);
        fontDiv.appendChild(fontSubDiv1);
        let fontSubDiv2: HTMLElement;
        let fontStyleLabel: HTMLElement;
        let fontStyleValues: HTMLSelectElement;
        fontSubDiv2 = createElement('div', { className: 'e-de-font-dlg-cb-right', id: id + '_fontSubDiv2', styles: 'float:right;' });
        if (isRtl) {
            fontSubDiv2.classList.add('e-de-rtl');
        }
        fontStyleLabel = createElement('label', { className: 'e-de-font-dlg-header', innerHTML: locale.getConstant('Font style') });
        const fontStyle: string = 'font-family:Roboto;font-size:14px;opacity:0.8;';
        fontStyleValues = createElement('select', { id: this.target.id + '_fontStyle', styles: fontStyle }) as HTMLSelectElement;
        fontStyleValues.innerHTML = '<option value="Regular">' +
            locale.getConstant('Regular') + '</option><option value="Bold">' + locale.getConstant('Bold') + '</option><option value="Italic">' +
            locale.getConstant('Italic') + '</option><option value="BoldItalic">' + locale.getConstant('Bold') + locale.getConstant('Italic') + '</option>';
        fontSubDiv2.appendChild(fontStyleLabel);
        fontSubDiv2.appendChild(fontStyleValues);
        fontDiv.appendChild(fontSubDiv2);
        this.fontNameList = new ComboBox({ change: this.fontFamilyUpdate, popupHeight: '200px', width: '170px', enableRtl: isRtl });
        this.fontNameList.showClearButton = false;
        this.fontNameList.appendTo(fontNameValues);
        this.fontStyleText = new DropDownList({ change: this.fontStyleUpdate, popupHeight: '170px', width: '170px', enableRtl: isRtl });
        this.fontStyleText.appendTo(fontStyleValues);
        return fontDiv;
    }
    /**
     * @param characterFormat
     * @private
     */
    public showFontDialog(characterFormat?: WCharacterFormat): void {
        if (characterFormat) {
            this.characterFormat = characterFormat;
        }
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
            characterFormat = this.documentHelper.owner.selection.characterFormat;
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
            for (let i: number = 0; i <= 15; i++) {
                const items: Element[] = this.fontSizeText.getItems();
                if (characterFormat.fontSize.toString() === items[i].innerHTML) {
                    this.fontSizeText.value = characterFormat.fontSize;
                    this.fontSizeText.index = i;
                    break;
                }
            }
        }
        if (!isNullOrUndefined(characterFormat.fontColor)) {
            let fontColor: string = characterFormat.fontColor;
            if (fontColor === '#00000000') {
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
            format = new WCharacterFormat(undefined);
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
            format.fontFamily = this.fontFamily;
        }
        if (!isNullOrUndefined(this.allCaps)) {
            format.allCaps = this.allCaps;
        }
        if (!this.characterFormat) {
            this.onCharacterFormat(this.documentHelper.selection, format);
        } else {
            this.documentHelper.owner.styleDialogModule.updateCharacterFormat();
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
            if (args.event.currentTarget.id === this.target.id + '_doubleStrikeThrough') {
                this.doublestrikethrough.checked = true;
            } else {
                this.strikethroughBox.checked = true;
            }
        }
        if (this.superscript.checked && this.subscript.checked) {
            this.subscript.checked = false;
            this.superscript.checked = false;
            if (args.event.currentTarget.id === this.target.id + '_subScript') {
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
}
/* eslint-enable @typescript-eslint/no-explicit-any */
