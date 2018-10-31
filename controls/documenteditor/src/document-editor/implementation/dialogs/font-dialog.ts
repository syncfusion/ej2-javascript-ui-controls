import { SelectionCharacterFormat } from '../index';
import { Selection } from '../index';
import { LayoutViewer } from '../index';
import { createElement, isNullOrUndefined, L10n, setCulture } from '@syncfusion/ej2-base';
import { DropDownList, ComboBox } from '@syncfusion/ej2-dropdowns';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { WCharacterFormat } from '../format/character-format';
import { Underline, Strikethrough, BaselineAlignment } from '../../base/types';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';

/**
 * The Font dialog is used to modify formatting of selected text.
 */
/* tslint:disable:no-any */
export class FontDialog {
    private fontStyleInternal: string = undefined;
    private owner: LayoutViewer;
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
    //Character Format Property
    private bold: boolean = undefined;
    private italic: boolean = undefined;
    private underline: Underline = undefined;
    private strikethrough: Strikethrough = undefined;
    private baselineAlignment: BaselineAlignment = undefined;
    private fontSize: number = undefined;
    private fontFamily: string = undefined;
    private fontColor: string = undefined;
    /**
     * @private
     */
    public characterFormat: WCharacterFormat = undefined;
    /**
     * @private
     */
    get fontStyle(): string {
        return this.fontStyleInternal;
    }
    /**
     * @private
     */
    set fontStyle(value: string) {
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
     * @private
     */
    constructor(layoutViewer: LayoutViewer) {
        this.owner = layoutViewer;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'FontDialog';
    }
    private createInputElement(type: string, id: string, className: string): HTMLInputElement {
        let element: HTMLInputElement = createElement('input', {
            attrs: { type: type },
            id: id,
            className: className
        }) as HTMLInputElement;
        return element;
    }
    /**
     * @private
     */
    public initFontDialog(locale: L10n): void {
        let instance: FontDialog = this;

        let effectLabel: HTMLElement;
        let strikeThroughElement: HTMLInputElement;
        let superScriptElement: HTMLInputElement;
        let subScriptElement: HTMLInputElement;
        let doubleStrikeThroughElement: HTMLInputElement;
        let id: string = this.owner.owner.containerId;
        this.target = createElement('div', { id: id + '_insertFontDialog', className: 'e-de-font-dlg' });
        let fontDiv: HTMLElement = this.getFontDiv(locale);
        this.target.appendChild(fontDiv);
        let sizeDiv: HTMLElement = this.getFontSizeDiv(locale);
        this.target.appendChild(sizeDiv);
        let colorDiv: HTMLElement = createElement('div', { id: id + '_fontColor', styles: 'margin-top:15px;' });
        this.fontColorDiv = createElement('div', { id: id + '_fontColorDiv', className: 'e-de-font-dlg-display' });
        let fontColorLabel: HTMLElement = createElement('label', {
            className: 'e-de-font-dlg-header-font-color e-de-font-color-margin', innerHTML: locale.getConstant('Font color')
        });
        this.fontColorDiv.appendChild(fontColorLabel);
        let fontColorElement: HTMLElement = this.createInputElement('color', this.target.id + '_ColorDiv', 'e-de-font-dlg-color');
        this.fontColorDiv.appendChild(fontColorElement);
        colorDiv.appendChild(this.fontColorDiv);
        this.target.appendChild(colorDiv);
        let fontEffectsDiv: HTMLElement = createElement('div', { id: id + '_fontEffectsDiv' });
        let fontEffectSubDiv1: HTMLElement = createElement('div', {
            className: 'e-de-font-color-label e-de-font-dlg-display',
            id: this.target.id + '_fontEffectsSubDiv1'
        });
        effectLabel = createElement('label', { className: 'e-de-font-dlg-header-effects', innerHTML: locale.getConstant('Effects') });
        fontEffectSubDiv1.appendChild(effectLabel);
        strikeThroughElement = this.createInputElement('checkbox', this.target.id + '_strikeThrough', '') as HTMLInputElement;
        fontEffectSubDiv1.appendChild(strikeThroughElement);
        superScriptElement = this.createInputElement('checkbox', this.target.id + '_superScript', '') as HTMLInputElement;
        fontEffectSubDiv1.appendChild(superScriptElement);
        fontEffectsDiv.appendChild(fontEffectSubDiv1);
        let fontEffectSubDiv2: HTMLElement = createElement('div', { className: 'e-de-font-checkbox', id: id + '_fontEffectsSubDiv2' });
        subScriptElement = this.createInputElement('checkbox', this.target.id + '_subScript', '') as HTMLInputElement;
        fontEffectSubDiv2.appendChild(subScriptElement);
        doubleStrikeThroughElement = this.createInputElement('checkbox', this.target.id + '_doubleStrikeThrough', '') as HTMLInputElement;
        fontEffectSubDiv2.appendChild(doubleStrikeThroughElement);
        fontEffectsDiv.appendChild(fontEffectSubDiv2);
        this.target.appendChild(fontEffectsDiv);
        this.owner.owner.element.appendChild(this.target);
        this.colorPicker = new ColorPicker({
            change: this.fontColorUpdate, value: '#000000',
        });
        this.colorPicker.appendTo(fontColorElement);
        this.strikethroughBox = new CheckBox({
            change: this.singleStrikeUpdate,
            cssClass: 'e-de-font-content-label',
            label: locale.getConstant('Strikethrough')
        });
        this.strikethroughBox.appendTo(strikeThroughElement);
        this.doublestrikethrough = new CheckBox({
            change: this.doubleStrikeUpdate,
            cssClass: 'e-de-font-content-checkbox-label',
            label: locale.getConstant('Double strikethrough')
        });
        this.doublestrikethrough.appendTo(doubleStrikeThroughElement);
        this.subscript = new CheckBox({
            label: locale.getConstant('Subscript'),
            change: this.subscriptUpdate
        });
        this.subscript.appendTo(subScriptElement);
        this.superscript = new CheckBox({
            label: locale.getConstant('Superscript'),
            cssClass: 'e-de-font-content-label', change: this.superscriptUpdate
        });
        this.superscript.appendTo(superScriptElement);
    }
    private getFontSizeDiv(locale: L10n): HTMLElement {
        let fontSize: HTMLSelectElement;
        let sizeDiv: HTMLElement;
        let id: string = this.owner.owner.containerId;
        sizeDiv = createElement('div', { id: id + '_fontSizeAndUnderlineDiv', className: 'e-de-font-dlg-padding e-de-font-dlg-display' });
        let sizeSubDiv1: HTMLElement = createElement('div', { id: id + '_fontSizeAndUnderlineSubDiv1' });
        let sizeLabel: HTMLElement = createElement('label', { className: 'e-de-font-dlg-header', innerHTML: locale.getConstant('Size') });
        let styles: string = 'font-family:Roboto;font-size:14px;opacity:0.8;';
        fontSize = createElement('select', { id: this.target.id + '_fontSize', styles: styles }) as HTMLSelectElement;
        fontSize.innerHTML = '<option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>' +
            '<option>14</option><option>16</option><option>18</option><option>20</option><option>24</option><option>26</option>' +
            '<option>28</option><option>36</option><option>48</option><option>72</option><option>96</option>';
        sizeSubDiv1.appendChild(sizeLabel);
        sizeSubDiv1.appendChild(fontSize);
        sizeDiv.appendChild(sizeSubDiv1);
        let sizeSubDiv2: HTMLElement = createElement('div', {
            className: 'e-de-font-dlg-cb-right',
            id: id + '_fontSizeAndUnderlineSubDiv2'
        });
        let html: string = locale.getConstant('Underline style');
        let underlineLabel: HTMLElement = createElement('label', { className: 'e-de-font-dlg-header', innerHTML: html });
        let underlineElement: HTMLSelectElement;
        underlineElement = createElement('select', { id: this.target.id + '_underLine', styles: styles }) as HTMLSelectElement;
        underlineElement.innerHTML = '<option>' + locale.getConstant('None') + '</option><option>________</option>';
        sizeSubDiv2.appendChild(underlineLabel);
        sizeSubDiv2.appendChild(underlineElement);
        sizeDiv.appendChild(sizeSubDiv2);
        this.fontSizeText = new ComboBox({ change: this.fontSizeUpdate, popupHeight: '170px', width: '170px' });
        this.fontSizeText.showClearButton = false;
        this.fontSizeText.appendTo(fontSize);
        this.underlineDrop = new DropDownList({ change: this.underlineUpdate, popupHeight: '100px', width: '170px' });
        this.underlineDrop.appendTo(underlineElement);
        return sizeDiv;
    }
    private getFontDiv(locale: L10n): HTMLElement {
        let id: string = this.owner.owner.containerId;
        let fontDiv: HTMLElement = createElement('div', { id: id + '_fontDiv', className: 'e-de-font-dlg-display' });
        let fontSubDiv1: HTMLElement = createElement('div', { id: id + '_fontSubDiv1' });
        let fontNameLabel: HTMLElement = createElement('label', {
            className: 'e-de-font-dlg-header',
            innerHTML: locale.getConstant('Font')
        });
        let fontNameValues: HTMLSelectElement = createElement('select', { id: this.target.id + '_fontName' }) as HTMLSelectElement;
        fontNameValues.innerHTML = '<option>Arial</option><option>Calibri</option><option>Candara</option><option>Comic Sans MS</option>' +
            '<option>Consolas</option><option>Constantia</option><option>Corbel</option>' +
            '<option>Courier New</option><option>Ebrima</option><option>Franklin Gothic</option>' +
            '<option>Gabriola</option><option>Gadugi</option><option>Georgia</option><option>Impact</option>' +
            '<option>Javanese Text</option><option>Microsoft Sans Serif</option><option>MS Gothic</option><option>MS UI Gothic</option>' +
            '<option>Segoe Print</option><option>Times New Roman</option><option>Verdana</option><option>Segoe UI</option>' +
            '<option>Algerian</option><option>Cambria</option><option>Georgia</option><option>Consolas</option>';
        fontSubDiv1.appendChild(fontNameLabel);
        fontSubDiv1.appendChild(fontNameValues);
        fontDiv.appendChild(fontSubDiv1);
        let fontSubDiv2: HTMLElement;
        let fontStyleLabel: HTMLElement;
        let fontStyleValues: HTMLSelectElement;
        fontSubDiv2 = createElement('div', { className: 'e-de-font-dlg-cb-right', id: id + '_fontSubDiv2', styles: 'float:right;' });
        fontStyleLabel = createElement('label', { className: 'e-de-font-dlg-header', innerHTML: locale.getConstant('Font style') });
        let fontStyle: string = 'font-family:Roboto;font-size:14px;opacity:0.8;';
        fontStyleValues = createElement('select', { id: this.target.id + '_fontStyle', styles: fontStyle }) as HTMLSelectElement;
        fontStyleValues.innerHTML = '<option>' +
            locale.getConstant('Regular') + '</option><option>' + locale.getConstant('Bold') + '</option><option>' +
            locale.getConstant('Italic') + '</option><option>' + locale.getConstant('Bold') + locale.getConstant('Italic') + '</option>';
        fontSubDiv2.appendChild(fontStyleLabel);
        fontSubDiv2.appendChild(fontStyleValues);
        fontDiv.appendChild(fontSubDiv2);
        this.fontNameList = new ComboBox({ change: this.fontFamilyUpdate, popupHeight: '200px', width: '170px' });
        this.fontNameList.showClearButton = false;
        this.fontNameList.appendTo(fontNameValues);
        this.fontStyleText = new DropDownList({ change: this.fontStyleUpdate, popupHeight: '170px', width: '170px' });
        this.fontStyleText.appendTo(fontStyleValues);
        return fontDiv;
    }
    /**
     * @private
     */
    public showFontDialog(characterFormat?: WCharacterFormat): void {
        if (characterFormat) {
            this.characterFormat = characterFormat;
        }
        let locale: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        locale.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initFontDialog(locale);
        }
        this.owner.dialog.header = locale.getConstant('Font');
        this.owner.dialog.width = 'auto';
        this.owner.dialog.height = 'auto';
        this.owner.dialog.content = this.target;
        this.owner.dialog.beforeOpen = this.loadFontDialog;
        this.owner.dialog.close = this.closeFontDialog;
        this.owner.dialog.buttons = [{
            click: this.onInsertFontFormat,
            buttonModel: { content: locale.getConstant('Ok'), cssClass: 'e-flat e-font-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: locale.getConstant('Cancel'), cssClass: 'e-flat e-font-cancel' }
        }];
        this.owner.dialog.dataBind();
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public loadFontDialog = (): void => {
        this.owner.updateFocus();
        let characterFormat: WCharacterFormat | SelectionCharacterFormat;
        if (this.characterFormat) {
            characterFormat = this.characterFormat;
        } else {
            characterFormat = this.owner.owner.selection.characterFormat;
        }
        this.fontNameList.value = characterFormat.fontFamily;
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
                let items: Element[] = this.fontSizeText.getItems();
                if (characterFormat.fontSize.toString() === items[i].innerHTML) {
                    this.fontSizeText.value = characterFormat.fontSize;
                    this.fontSizeText.index = i;
                    break;
                }
            }
        }
        if (!isNullOrUndefined(characterFormat.fontColor)) {
            this.colorPicker.value = characterFormat.fontColor;
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
        if (this.owner.selection.caret.style.display !== 'none') {
            this.owner.selection.caret.style.display = 'none';
        }
    }
    /**
     * @private
     */
    public closeFontDialog = (): void => {
        this.unWireEventsAndBindings();
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public onCancelButtonClick = (): void => {
        this.owner.dialog.hide();
        this.unWireEventsAndBindings();
    }
    /**
     * @private
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
        if (!this.characterFormat) {
            this.onCharacterFormat(this.owner.selection, format);
        } else {
            this.owner.owner.styleDialogModule.updateCharacterFormat();
        }
        this.owner.dialog.hide();
    }
    /**
     * Applies character format 
     * @param  {Selection} selection
     * @param  {WCharacterFormat} format
     * @private
     */
    public onCharacterFormat(selection: Selection, format: WCharacterFormat): void {
        this.owner.owner.editorModule.initHistory('CharacterFormat');
        if (selection.isEmpty) {
            if (selection.start.offset === selection.getParagraphLength(selection.start.paragraph)) {
                // tslint:disable-next-line:max-line-length
                this.owner.owner.editorModule.applyCharFormatValueInternal(selection, selection.start.paragraph.characterFormat, undefined, format);
                this.owner.owner.editorModule.reLayout(selection);
            }
            this.owner.updateFocus();
            return;
        } else {
            //Iterate and update formating.
            this.owner.owner.editorModule.setOffsetValue(this.owner.selection);
            this.owner.owner.editorModule.updateSelectionCharacterFormatting('CharacterFormat', format, false);
        }
    }
    /**
     * @private
     */
    public enableCheckBoxProperty(args: any): void {
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
    private fontSizeUpdate = (args: any): void => {
        this.fontSize = args.value;
    }
    private fontStyleUpdate = (args: any): void => {
        this.fontStyle = args.value;
    }
    private fontFamilyUpdate = (args: any): void => {
        this.fontFamily = args.value;
    }
    private underlineUpdate = (args: any): void => {
        this.underline = args.value;
    }
    private fontColorUpdate = (args: ColorPickerEventArgs): void => {
        if (!isNullOrUndefined(args.currentValue)) {
            this.fontColor = args.currentValue.hex;
        }
    }
    private singleStrikeUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.strikethrough = 'SingleStrike';
        } else {
            this.strikethrough = 'None';
        }
    }
    private doubleStrikeUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.strikethrough = 'DoubleStrike';
        } else {
            this.strikethrough = 'None';
        }
    }
    private superscriptUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.baselineAlignment = 'Superscript';
        } else {
            this.baselineAlignment = 'Normal';
        }
    }
    private subscriptUpdate = (args: any): void => {
        this.enableCheckBoxProperty(args);
        if (args.checked) {
            this.baselineAlignment = 'Subscript';
        } else {
            this.baselineAlignment = 'Normal';
        }

    }
    /**
     * @private
     */
    public unWireEventsAndBindings(): void {
        this.fontNameList.value = '';
        this.fontSizeText.value = '';
        this.fontStyleText.value = '';
        this.strikethroughBox.checked = false;
        this.doublestrikethrough.checked = false;
        this.superscript.checked = false;
        this.subscript.checked = false;
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
     */
    public destroy(): void {
        this.owner = undefined;
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
    }
}
/* tslint:enable:no-any */