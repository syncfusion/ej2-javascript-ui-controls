import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { LayoutViewer } from '../index';
import { createElement, L10n, setCulture } from '@syncfusion/ej2-base';
import { SelectionParagraphFormat } from '../index';
import { Selection } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { WParagraphFormat } from '../index';
import { TextAlignment, LineSpacingType } from '../../base/types';

/**
 * The Paragraph dialog is used to modify formatting of selected paragraphs.
 */
export class ParagraphDialog {
    /**
     * @private
     */
    public owner: LayoutViewer;
    private target: HTMLElement;
    private alignment: DropDownList;
    private lineSpacing: DropDownList;
    private special: DropDownList;
    private leftIndentIn: NumericTextBox;
    private rightIndentIn: NumericTextBox;
    private byIn: NumericTextBox;
    private beforeSpacingIn: NumericTextBox;
    private afterSpacingIn: NumericTextBox;
    private atIn: NumericTextBox;
    //paragraph Format properties

    private leftIndent: number = undefined;
    private rightIndent: number = undefined;
    private beforeSpacing: number = undefined;
    private afterSpacing: number = undefined;
    private textAlignment: TextAlignment = undefined;
    private firstLineIndent: number = undefined;
    private lineSpacingIn: number = undefined;
    private lineSpacingType: LineSpacingType = undefined;
    private paragraphFormat: WParagraphFormat = undefined;
    /**
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'ParagraphDialog';
    }
    /*tslint:disable max-func-body-length*/
    /**
     * @private
     */
    public initParagraphDialog(locale: L10n): void {
        let instance: ParagraphDialog = this;
        let ownerId: string = this.owner.owner.containerId;
        let id: string = ownerId + '_paragraph_dialog';
        this.target = createElement('div', { id: id, className: 'e-de-para-dlg-container' });
        // tslint:disable-next-line:max-line-length
        let div: HTMLDivElement = createElement('div', { id: 'property_div', styles: 'width:400px;' }) as HTMLDivElement;
        let generalDiv: HTMLDivElement = createElement('div', { id: 'genral_div', styles: 'width:200px;height:85px;', className: 'e-de-para-dlg-sub-container' }) as HTMLDivElement;
        // tslint:disable-next-line:max-line-length
        let genLabel: HTMLElement = createElement('div', { id: ownerId + '_genLabel', className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('General') });
        let alignLabel: HTMLElement = createElement('div', { id: ownerId + '_AlignLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Alignment') });
        let alignment: HTMLElement = createElement('select', {
            id: ownerId + '_Alignment',
            innerHTML: '<option value="Center">' + locale.getConstant('Center') +
                '</option><option value="Left">' + locale.getConstant('Left') +
                '</option><option value="Right">' + locale.getConstant('Right') +
                '</option><option value="Justify">' + locale.getConstant('Justify') + '</option>'
        }) as HTMLSelectElement;
        generalDiv.appendChild(genLabel);
        generalDiv.appendChild(alignLabel);
        generalDiv.appendChild(alignment);
        // tslint:disable-next-line:max-line-length
        let indentionDiv: HTMLDivElement = createElement('div', { id: 'indention_div', styles: 'width: 400px;height: 150px;', className: 'e-de-para-dlg-sub-container' }) as HTMLDivElement;
        let leftIndentionDiv: HTMLDivElement = createElement('div', { id: 'left_indention', styles: 'float:left;position:relative;' }) as HTMLDivElement;
        indentionDiv.appendChild(leftIndentionDiv);
        // tslint:disable-next-line:max-line-length
        let rightIndentionDiv: HTMLDivElement = createElement('div', { className: 'e-de-para-dlg-right-sub-container', styles: 'float:right;position:relative;' }) as HTMLDivElement;
        indentionDiv.appendChild(rightIndentionDiv);
        // tslint:disable-next-line:max-line-length
        let spacingDiv: HTMLDivElement = createElement('div', { id: 'spacing_div', styles: 'width: 400px;height: 150px;', className: 'e-de-para-dlg-sub-container' }) as HTMLDivElement;
        let leftSpacingDiv: HTMLDivElement = createElement('div', { id: 'left_spacing', styles: 'float:left;position:relative;' }) as HTMLDivElement;
        spacingDiv.appendChild(leftSpacingDiv);
        // tslint:disable-next-line:max-line-length
        let rightSpacingDiv: HTMLDivElement = createElement('div', { className: 'e-de-para-dlg-right-sub-container', styles: 'float:right;position:relative;' }) as HTMLDivElement;
        spacingDiv.appendChild(rightSpacingDiv);

        // tslint:disable-next-line:max-line-length
        let indentLabel: HTMLLabelElement = createElement('div', {
            id: ownerId + '_indentLabel', className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('Indentation')
        }) as HTMLLabelElement;
        let beforeTextLabel: HTMLLabelElement = createElement('div', {
            id: ownerId + '_bfTextLabel',
            className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Before text')
        }) as HTMLLabelElement;
        // tslint:disable-next-line:max-line-length
        let leftIndent: HTMLInputElement = createElement('input', { id: ownerId + '_leftIndent', attrs: { 'type': 'text' } }) as HTMLInputElement;
        let specialLabel: HTMLLabelElement = createElement('div', { id: ownerId + '_specialLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Special') }) as HTMLLabelElement;
        let special: HTMLElement = createElement('select', {
            id: ownerId + '_special',
            innerHTML: '<option value="None">' + locale.getConstant('None') +
                '</option><option value="First Line">' + locale.getConstant('First line') +
                '</option><option value="Hanging">' + locale.getConstant('Hanging') + '</option> '
        }) as HTMLSelectElement;
        leftIndentionDiv.appendChild(indentLabel);
        leftIndentionDiv.appendChild(beforeTextLabel);
        leftIndentionDiv.appendChild(leftIndent);
        leftIndentionDiv.appendChild(specialLabel);
        leftIndentionDiv.appendChild(special);
        // tslint:disable-next-line:max-line-length
        let afterTextLabel: HTMLLabelElement = createElement('div', { id: ownerId + '_afTextLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('After text') }) as HTMLLabelElement;
        let rightIndent: HTMLInputElement = createElement('input', { id: ownerId + '_rightIndent', attrs: { 'type': 'text' } }) as HTMLInputElement;
        // tslint:disable-next-line:max-line-length
        let byLabel: HTMLLabelElement = createElement('label', { id: ownerId + '_byLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('By') }) as HTMLLabelElement;
        let by: HTMLInputElement = createElement('input', { id: ownerId + '_By', attrs: { 'type': 'text' } }) as HTMLInputElement;
        rightIndentionDiv.appendChild(afterTextLabel);
        rightIndentionDiv.appendChild(rightIndent);
        rightIndentionDiv.appendChild(byLabel);
        rightIndentionDiv.appendChild(by);

        // tslint:disable-next-line:max-line-length
        let spaceLabel: HTMLLabelElement = createElement('div', { innerHTML: locale.getConstant('Spacing'), className: 'e-de-para-dlg-heading', id: ownerId + '_spaceLabel' }) as HTMLLabelElement;
        let beforeLabel: HTMLLabelElement = createElement('div', { className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Before'), id: ownerId + '_beforeLabel' }) as HTMLLabelElement;
        // tslint:disable-next-line:max-line-length
        let beforeSpacing: HTMLInputElement = createElement('input', { id: ownerId + '_beforeSpacing', attrs: { 'type': 'text' } }) as HTMLInputElement;
        let lineSpaceLabel: HTMLLabelElement = createElement('div', { id: ownerId + '_lineSpaceLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Line Spacing') }) as HTMLLabelElement;
        // tslint:disable-next-line:max-line-length
        let lineSpacing: HTMLElement = createElement('select', {
            id: ownerId + '_lineSpacing', styles: 'width:180px;',
            innerHTML: '<option value="At least">' + locale.getConstant('At least') +
                '</option><option value="Exactly">' + locale.getConstant('Exactly') +
                '</option><option value="Multiple">' + locale.getConstant('Multiple') + '</option>'
        }) as HTMLSelectElement;
        leftSpacingDiv.appendChild(spaceLabel);
        leftSpacingDiv.appendChild(beforeLabel);
        leftSpacingDiv.appendChild(beforeSpacing);
        leftSpacingDiv.appendChild(lineSpaceLabel);
        leftSpacingDiv.appendChild(lineSpacing);
        // tslint:disable-next-line:max-line-length
        let afterLabel: HTMLLabelElement = createElement('div', { innerHTML: locale.getConstant('After'), className: 'e-de-dlg-sub-header', id: ownerId + '_afterLabel' }) as HTMLLabelElement;
        let afterSpacing: HTMLInputElement = createElement('input', { id: ownerId + '_afterSpacing', attrs: { 'type': 'text' } }) as HTMLInputElement;
        // tslint:disable-next-line:max-line-length
        let atLabel: HTMLLabelElement = createElement('div', { innerHTML: locale.getConstant('At'), id: ownerId + '_atLabel', className: 'e-de-dlg-sub-header' }) as HTMLLabelElement;
        let lineSpacingAt: HTMLInputElement = createElement('input', { id: ownerId + '_lineSpacingAt', attrs: { 'type': 'text' } }) as HTMLInputElement;
        rightSpacingDiv.appendChild(afterLabel);
        rightSpacingDiv.appendChild(afterSpacing);
        rightSpacingDiv.appendChild(atLabel);
        rightSpacingDiv.appendChild(lineSpacingAt);
        div.appendChild(generalDiv);
        div.appendChild(indentionDiv);
        div.appendChild(spacingDiv);
        this.target.appendChild(div);
        this.leftIndentIn = new NumericTextBox({
            format: 'n1', value: 0, min: -1584, max: 1584, width: 180, enablePersistence: false, change: this.changeLeftIndent
        });
        this.leftIndentIn.appendTo(leftIndent);
        this.rightIndentIn = new NumericTextBox({
            format: 'n1', value: 0, min: -1584, max: 1584, width: 180, enablePersistence: false, change: this.changeRightIndent
        });
        this.rightIndentIn.appendTo(rightIndent);
        this.byIn = new NumericTextBox({
            format: 'n1', value: 0, min: 0, max: 1584, width: 180, enablePersistence: false, change: this.changeFirstLineIndent
        });
        this.byIn.appendTo(by);
        this.beforeSpacingIn = new NumericTextBox({
            format: 'n1', value: 0, min: 0, max: 1584, width: 180, step: 6, enablePersistence: false,
            change: this.changeBeforeSpacing
        });
        this.beforeSpacingIn.appendTo(beforeSpacing);
        this.afterSpacingIn = new NumericTextBox({
            format: 'n1', value: 0, min: 0, max: 1584, width: 180, step: 6, enablePersistence: false,
            change: this.changeAfterSpacing
        });
        this.afterSpacingIn.appendTo(afterSpacing);
        this.atIn = new NumericTextBox({
            format: 'n1', value: 0, min: 1, max: 1584, width: 180, step: 0.5, enablePersistence: false, change: this.changeLineSpacingValue
        });
        this.special = new DropDownList({ change: this.changeByValue, width: 180 });
        this.special.appendTo(special);
        this.lineSpacing = new DropDownList({ change: this.changeBySpacing, width: '180px' });
        this.lineSpacing.appendTo(lineSpacing);
        this.alignment = new DropDownList({ width: 180, change: this.changeByTextAlignment });
        this.alignment.appendTo(alignment);
        this.atIn.appendTo(lineSpacingAt);
        this.target.addEventListener('keyup', instance.keyUpParagraphSettings);
    }
    /**
     * @private
     */
    public keyUpParagraphSettings = (event: KeyboardEvent): void => {
        if (event.keyCode === 13) {
            this.applyParagraphFormat();
        }
    }
    private changeBeforeSpacing = (event: any): void => {
        this.beforeSpacing = event.value;
    }
    private changeAfterSpacing = (event: any): void => {
        this.afterSpacing = event.value as number;
    }
    private changeLeftIndent = (event: any): void => {
        this.leftIndent = event.value as number;
    }
    private changeRightIndent = (event: any): void => {
        this.rightIndent = event.value as number;
    }
    private changeLineSpacingValue = (event: any): void => {
        this.lineSpacingIn = event.value as number;
    }
    private changeFirstLineIndent = (event: any): void => {
        this.firstLineIndent = event.value as number;
    }
    private changeByTextAlignment = (args: any) => {
        this.textAlignment = args.value;
    }
    /**
     * @private
     */
    public changeByValue = (event: ChangeEventArgs): void => {
        let paragraphFormat: SelectionParagraphFormat = this.owner.selection.paragraphFormat;
        switch (this.special.index) {
            case 0:
                if (paragraphFormat.firstLineIndent !== 0) {
                    this.byIn.value = 0;
                }
                break;
            case 1:
                if (paragraphFormat.firstLineIndent === 0 || isNullOrUndefined(paragraphFormat.firstLineIndent)) {
                    this.byIn.value = 0.1;
                } else if (paragraphFormat.firstLineIndent < 0) {
                    this.byIn.value = -(paragraphFormat.firstLineIndent);
                }
                break;
            case 2:
                if (paragraphFormat.firstLineIndent === 0 || isNullOrUndefined(paragraphFormat.firstLineIndent)) {
                    paragraphFormat.firstLineIndent = -0.1;
                } else if (paragraphFormat.firstLineIndent > 0) {
                    this.byIn.value = -(paragraphFormat.firstLineIndent);
                }
                break;
        }
    }
    /**
     * @private
     */
    public changeBySpacing = (event: ChangeEventArgs): void => {
        if (isNullOrUndefined(this.lineSpacing)) {
            return;
        }
        switch (this.lineSpacing.index) {
            case 0:
                this.lineSpacingType = 'AtLeast';
                this.atIn.value = 12;
                break;
            case 1:
                this.lineSpacingType = 'Exactly';
                this.atIn.value = 12;
                break;
            case 2:
                this.lineSpacingType = 'Multiple';
                this.atIn.value = 1;
                break;
        }
    }
    /* tslint:enable */
    /**
     * @private
     */
    public loadParagraphDialog = (): void => {
        let selectionFormat: SelectionParagraphFormat | WParagraphFormat;
        if (this.paragraphFormat) {
            selectionFormat = this.paragraphFormat;
        } else {
            selectionFormat = this.owner.selection.paragraphFormat;
        }
        let alignValue: number = this.alignment.index;
        if (selectionFormat.textAlignment === 'Center') {
            alignValue = 0;
        } else if (selectionFormat.textAlignment === 'Left') {
            alignValue = 1;
        } else if (selectionFormat.textAlignment === 'Right') {
            alignValue = 2;
        } else {
            alignValue = 3;
        }
        this.alignment.index = alignValue;
        this.beforeSpacingIn.value = selectionFormat.beforeSpacing;
        this.afterSpacingIn.value = selectionFormat.afterSpacing;
        this.leftIndentIn.value = selectionFormat.leftIndent;
        this.rightIndentIn.value = selectionFormat.rightIndent;
        this.byIn.value = selectionFormat.firstLineIndent;
        let lineSpaceValue: number = this.lineSpacing.index;
        if (selectionFormat.lineSpacingType === 'AtLeast') {
            lineSpaceValue = 0;
        } else if (selectionFormat.lineSpacingType === 'Exactly') {
            lineSpaceValue = 1;
        } else {
            lineSpaceValue = 2;
        }
        this.lineSpacing.index = lineSpaceValue;
        this.atIn.value = selectionFormat.lineSpacing;
        if (this.owner.selection.caret.style.display !== 'none') {
            this.owner.selection.caret.style.display = 'none';
        }
    }

    /**
     * @private
     */
    public applyParagraphFormat = (): void => {
        let paraFormat: WParagraphFormat;
        let isApply: boolean;
        if (this.paragraphFormat) {
            paraFormat = this.paragraphFormat;
            isApply = false;
        } else {
            paraFormat = new WParagraphFormat();
            isApply = true;
        }
        if (!isNullOrUndefined(this.beforeSpacing)) {
            paraFormat.beforeSpacing = this.beforeSpacing;
        }
        if (!isNullOrUndefined(this.afterSpacing)) {
            paraFormat.afterSpacing = this.afterSpacing;
        }
        if (!isNullOrUndefined(this.lineSpacingType)) {
            paraFormat.lineSpacingType = this.lineSpacingType;
        }
        if (!isNullOrUndefined(this.leftIndent)) {
            paraFormat.leftIndent = this.leftIndent;
        }
        if (!isNullOrUndefined(this.rightIndent)) {
            paraFormat.rightIndent = this.rightIndent;
        }
        if (!isNullOrUndefined(this.lineSpacingIn)) {
            paraFormat.lineSpacing = this.lineSpacingIn;
        }
        if (!isNullOrUndefined(this.firstLineIndent)) {
            paraFormat.firstLineIndent = this.firstLineIndent;
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            paraFormat.textAlignment = this.textAlignment;
        }

        if (isApply) {
            this.onParagraphFormat(paraFormat);
        } else {
            this.owner.owner.styleDialogModule.updateParagraphFormat();
        }
        this.owner.dialog.hide();
    }
    /**
     * Applies Paragraph Format 
     * @param  {WParagraphFormat} paragraphFormat
     * @private
     */
    public onParagraphFormat(paragraphFormat: WParagraphFormat): void {
        this.owner.owner.editorModule.initHistory('ParagraphFormat');
        let selection: Selection = this.owner.selection;
        this.owner.owner.isShiftingEnabled = true;
        if (this.owner.selection.isEmpty) {
            this.owner.owner.editorModule.applyParaFormatProperty(selection.start.paragraph, undefined, paragraphFormat, false);
            this.owner.owner.editor.layoutItemBlock(selection.start.paragraph, false);
        } else {
            this.owner.owner.editorModule.updateSelectionParagraphFormatting('ParagraphFormat', paragraphFormat, false);
        }
        this.owner.owner.editorModule.reLayout(selection);
    }
    /**
     * @private
     */
    public closeParagraphDialog = (): void => {
        this.leftIndent = undefined;
        this.afterSpacing = undefined;
        this.beforeSpacing = undefined;
        this.firstLineIndent = undefined;
        this.textAlignment = undefined;
        this.rightIndent = undefined;
        this.lineSpacingIn = undefined;
        this.lineSpacingType = undefined;
        this.paragraphFormat = undefined;
        this.owner.dialog.hide();
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public show(paragraphFormat?: WParagraphFormat): void {
        if (paragraphFormat) {
            this.paragraphFormat = paragraphFormat;
        }
        let local: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        local.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initParagraphDialog(local);
        }
        this.loadParagraphDialog();
        this.owner.dialog.header = 'Paragraph';
        this.owner.dialog.content = this.target;
        this.owner.dialog.height = 'auto';
        this.owner.dialog.width = 'auto';
        this.owner.dialog.buttons = [{
            click: this.applyParagraphFormat,
            buttonModel: { content: local.getConstant('Ok'), cssClass: 'e-flat e-para-okay', isPrimary: true }
        },
        {
            click: this.closeParagraphDialog,
            buttonModel: { content: local.getConstant('Cancel'), cssClass: 'e-flat e-para-cancel' }
        }];
        this.owner.dialog.beforeOpen = this.owner.updateFocus;
        this.owner.dialog.close = this.owner.updateFocus;
        this.owner.dialog.dataBind();
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public destroy(): void {
        if (this.afterSpacingIn) {
            this.afterSpacingIn.destroy();
            this.afterSpacingIn = undefined;
        }
        if (this.beforeSpacingIn) {
            this.beforeSpacingIn.destroy();
            this.beforeSpacingIn = undefined;
        }
        if (this.leftIndentIn) {
            this.leftIndentIn.destroy();
            this.leftIndentIn = undefined;
        }
        if (this.rightIndentIn) {
            this.rightIndentIn.destroy();
            this.rightIndentIn = undefined;
        }
        if (this.byIn) {
            this.byIn.destroy();
            this.byIn = undefined;
        }
        if (this.atIn) {
            this.atIn.destroy();
            this.atIn = undefined;
        }
        if (this.alignment) {
            this.alignment.change = undefined;
            this.alignment.destroy();
        }
        this.alignment = undefined;
        if (this.lineSpacing) {
            this.lineSpacing.change = undefined;
            this.lineSpacing.destroy();
        }
        this.lineSpacing = undefined;
        if (this.special) {
            this.special.change = undefined;
            this.special.destroy();
        }
        this.special = undefined;
        this.owner = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let q: number = 0; q < this.target.childNodes.length; q++) {
                this.target.removeChild(this.target.childNodes[q]);
                q--;
            }
            this.target = undefined;
        }
    }
}