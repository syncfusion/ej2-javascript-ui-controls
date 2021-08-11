import { NumericTextBox, ChangeEventArgs as NumericChangeArgs } from '@syncfusion/ej2-inputs';
import { LayoutViewer } from '../index';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { SelectionParagraphFormat } from '../index';
import { Selection } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-dropdowns';
import { WParagraphFormat } from '../index';
import { TextAlignment, LineSpacingType } from '../../base/types';
import { RadioButton, ChangeArgs, CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { DocumentHelper } from '../viewer';
import { Tab, TabItemModel } from '@syncfusion/ej2-navigations';

/**
 * The Paragraph dialog is used to modify formatting of selected paragraphs.
 */
export class ParagraphDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
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
    private rtlButton: RadioButton;
    private ltrButton: RadioButton;
    private contextSpacing: CheckBox;
    private keepWithNext: CheckBox;
    private keepLinesTogether: CheckBox;

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
    private bidi: boolean = undefined;
    private contextualSpacing: boolean = undefined;
    public isStyleDialog: boolean = false;
    private directionDiv: HTMLElement = undefined;
    public keepWithNextValue: boolean = undefined;
    public keepLineTogetherValue: boolean = undefined;
    private tabObj: Tab = undefined;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private get owner(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    /**
     * @private
     * @returns {string} Returns module name
     */
    public getModuleName(): string {
        return 'ParagraphDialog';
    }
    /* eslint-disable */
    /**
     * @private
     * @param {L10n} locale - Specifies the locale.
     * @returns {void}
     */
    public initParagraphDialog(locale: L10n): void {
        let tabContainer: HTMLElement = <HTMLDivElement>createElement('div');
        const ejtab: HTMLDivElement = <HTMLDivElement>createElement('div');
        let instance: ParagraphDialog = this;
        let ownerId: string = this.documentHelper.owner.containerId;
        let id: string = ownerId + '_paragraph_dialog';
        let indentContainer: HTMLElement = createElement('div', { id: id, className: 'e-de-para-dlg-container' });
        this.target = tabContainer;
        tabContainer.appendChild(ejtab);
        let div: HTMLDivElement = createElement('div', { id: 'property_div', styles: 'width:400px;' }) as HTMLDivElement;
        let generalDiv: HTMLDivElement = createElement('div', { id: 'genral_div', className: 'e-de-para-dlg-sub-container' }) as HTMLDivElement;

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
        let dirLabel: HTMLElement = createElement('div', {
            id: ownerId + '_DirLabel',
            className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Direction')
        });
        this.directionDiv = createElement('div', { id: ownerId + '_DirDiv', styles: 'display:flex' });
        let rtlDiv: HTMLElement = createElement('div', { id: ownerId + '_DirDiv', className: 'e-de-rtl-btn-div' });
        let rtlInputELe: HTMLElement = createElement('input', { id: ownerId + '_rtlEle' });
        rtlDiv.appendChild(rtlInputELe);
        this.directionDiv.appendChild(rtlDiv)
        let isRtl: boolean = this.documentHelper.owner.enableRtl;
        if (isRtl) {
            rtlDiv.classList.add('e-de-rtl');
        }
        let ltrDiv: HTMLElement = createElement('div', { id: ownerId + '_DirDiv', className: 'e-de-ltr-btn-div' });
        let ltrInputELe: HTMLElement = createElement('input', { id: ownerId + '_ltrEle' });
        ltrDiv.appendChild(ltrInputELe);
        this.directionDiv.appendChild(ltrDiv)
        generalDiv.appendChild(dirLabel);
        generalDiv.appendChild(this.directionDiv);
        this.rtlButton = new RadioButton({
            label: locale.getConstant('Right-to-left'), enableRtl: isRtl,
            value: 'rtl', cssClass: 'e-small', change: this.changeBidirectional
        });
        this.rtlButton.appendTo(rtlInputELe);
        this.ltrButton = new RadioButton({
            label: locale.getConstant('Left-to-right'), enableRtl: isRtl,
            value: 'ltr', cssClass: 'e-small', change: this.changeBidirectional
        });
        this.ltrButton.appendTo(ltrInputELe);

        let indentionDiv: HTMLDivElement = createElement('div', { id: 'indention_div', styles: 'width: 400px;', className: 'e-de-para-dlg-sub-container e-para-dlg-sub-height' }) as HTMLDivElement;
        
        let indentLabel: HTMLLabelElement = createElement('div', {
            id: ownerId + '_indentLabel', className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('Indentation'), styles: 'float:top;position:relative'
        }) as HTMLLabelElement;
        indentionDiv.appendChild(indentLabel);
        let leftIndentionDiv: HTMLDivElement = createElement('div', { id: 'left_indention', styles: 'float:left;position:relative;' }) as HTMLDivElement;
        indentionDiv.appendChild(leftIndentionDiv);

        let rightIndentionDiv: HTMLDivElement = createElement('div', { className: 'e-de-para-dlg-right-sub-container', styles: 'float:right;position:relative;' }) as HTMLDivElement;
        indentionDiv.appendChild(rightIndentionDiv);

        let spacingDiv: HTMLDivElement = createElement('div', { id: 'spacing_div' }) as HTMLDivElement;
        let leftSpacingDiv: HTMLDivElement = createElement('div', { id: 'left_spacing', styles: 'position:relative;' }) as HTMLDivElement;
        spacingDiv.appendChild(leftSpacingDiv);
        let contextSpacingStyles: string = 'float:left';
        if (isRtl) {
            contextSpacingStyles = 'float:right;';
        }
        let contextSpacingDiv: HTMLDivElement = createElement('div',
            { id: 'context_spacing', styles: contextSpacingStyles + 'position:relative;' }) as HTMLDivElement;
        spacingDiv.appendChild(contextSpacingDiv);

        let rightSpacingDiv: HTMLDivElement = createElement('div', { styles: 'display:inline-flex;' }) as HTMLDivElement;
        spacingDiv.appendChild(rightSpacingDiv);

        let contextInputEle: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' },
            id: ownerId + '_contextSpacing'
        }) as HTMLInputElement;
        contextSpacingDiv.appendChild(contextInputEle);


        let beforeTextLabel: HTMLLabelElement = createElement('div', {
            id: ownerId + '_bfTextLabel',
            className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Before text')
        }) as HTMLLabelElement;

        let leftIndent: HTMLInputElement = createElement('input', { id: ownerId + '_leftIndent', attrs: { 'type': 'text' } }) as HTMLInputElement;
        let specialLabel: HTMLLabelElement = createElement('div', { id: ownerId + '_specialLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Special') }) as HTMLLabelElement;
        let special: HTMLElement = createElement('select', {
            id: ownerId + '_special',
            innerHTML: '<option value="None">' + locale.getConstant('None') +
                '</option><option value="First Line">' + locale.getConstant('First line') +
                '</option><option value="Hanging">' + locale.getConstant('Hanging') + '</option> '
        }) as HTMLSelectElement;
        leftIndentionDiv.appendChild(beforeTextLabel);
        leftIndentionDiv.appendChild(leftIndent);
        leftIndentionDiv.appendChild(specialLabel);
        leftIndentionDiv.appendChild(special);

        let afterTextLabel: HTMLLabelElement = createElement('div', { id: ownerId + '_afTextLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('After text') }) as HTMLLabelElement;
        let rightIndent: HTMLInputElement = createElement('input', { id: ownerId + '_rightIndent', attrs: { 'type': 'text' } }) as HTMLInputElement;

        let byLabel: HTMLLabelElement = createElement('label', { id: ownerId + '_byLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('By') }) as HTMLLabelElement;
        let by: HTMLInputElement = createElement('input', { id: ownerId + '_By', attrs: { 'type': 'text' } }) as HTMLInputElement;
        rightIndentionDiv.appendChild(afterTextLabel);
        rightIndentionDiv.appendChild(rightIndent);
        rightIndentionDiv.appendChild(byLabel);
        rightIndentionDiv.appendChild(by);


        let spaceLabel: HTMLLabelElement = createElement('div', { innerHTML: locale.getConstant('Spacing'), className: 'e-de-para-dlg-heading', id: ownerId + '_spaceLabel' }) as HTMLLabelElement;
        let spacingWholeDiv: HTMLElement = createElement('div', { id: ownerId + '_spacingWholeDiv', styles: 'display:inline-flex;' }) as HTMLElement;
        let beforeSpacingWholeDiv: HTMLElement = createElement('div', { id: ownerId + '_beforeSpacingWholeDiv' }) as HTMLElement;

        let beforeLabel: HTMLLabelElement = createElement('div', { className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Before'), id: ownerId + '_beforeLabel' }) as HTMLLabelElement;

        let beforeSpacing: HTMLInputElement = createElement('input', { id: ownerId + '_beforeSpacing', attrs: { 'type': 'text' } }) as HTMLInputElement;
        let afterSpacingWholeDiv: HTMLElement = createElement('div', { id: ownerId + '_afterSpacingWholeDiv', className: 'e-de-para-dlg-spacing-div' }) as HTMLElement;

        let afterLabel: HTMLLabelElement = createElement('div', { innerHTML: locale.getConstant('After'), className: 'e-de-dlg-sub-header', id: ownerId + '_afterLabel' }) as HTMLLabelElement;
        let afterSpacing: HTMLInputElement = createElement('input', { id: ownerId + '_afterSpacing', attrs: { 'type': 'text' } }) as HTMLInputElement;
        leftSpacingDiv.appendChild(spaceLabel);
        leftSpacingDiv.appendChild(spacingWholeDiv);
        beforeSpacingWholeDiv.appendChild(beforeLabel);
        beforeSpacingWholeDiv.appendChild(beforeSpacing);
        spacingWholeDiv.appendChild(beforeSpacingWholeDiv);
        afterSpacingWholeDiv.appendChild(afterLabel);
        afterSpacingWholeDiv.appendChild(afterSpacing);
        spacingWholeDiv.appendChild(afterSpacingWholeDiv);
        let lineSpacingDiv: HTMLElement = createElement('div', { id: ownerId + '_lineSpacingWholeDiv' }) as HTMLElement;

        let lineSpaceLabel: HTMLLabelElement = createElement('div', { id: ownerId + '_lineSpaceLabel', className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Line Spacing') }) as HTMLLabelElement;

        let lineSpacing: HTMLElement = createElement('select', {
            id: ownerId + '_lineSpacing', styles: 'width:180px;',
            innerHTML: '<option value="At least">' + locale.getConstant('At least') +
                '</option><option value="Exactly">' + locale.getConstant('Exactly') +
                '</option><option value="Multiple">' + locale.getConstant('Multiple') + '</option>'
        }) as HTMLSelectElement;

        let lineTypeDiv: HTMLElement = createElement('div', { id: ownerId + '_lineTypeWholeDiv', className: 'e-de-para-dlg-spacing-div' }) as HTMLElement;

        let atLabel: HTMLLabelElement = createElement('div', { innerHTML: locale.getConstant('At'), id: ownerId + '_atLabel', className: 'e-de-dlg-sub-header' }) as HTMLLabelElement;
        let lineSpacingAt: HTMLInputElement = createElement('input', { id: ownerId + '_lineSpacingAt', attrs: { 'type': 'text' } }) as HTMLInputElement;
        lineSpacingDiv.appendChild(lineSpaceLabel);
        lineSpacingDiv.appendChild(lineSpacing);
        rightSpacingDiv.appendChild(lineSpacingDiv);
        lineTypeDiv.appendChild(atLabel);
        lineTypeDiv.appendChild(lineSpacingAt);
        rightSpacingDiv.appendChild(lineTypeDiv);
        div.appendChild(generalDiv);
        div.appendChild(indentionDiv);
        div.appendChild(spacingDiv);
        indentContainer.appendChild(div);
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
        this.special = new DropDownList({ change: this.changeByValue, width: 180, enableRtl: isRtl });
        this.special.appendTo(special);
        this.lineSpacing = new DropDownList({ change: this.changeBySpacing, width: '180px', enableRtl: isRtl });
        this.lineSpacing.appendTo(lineSpacing);
        this.alignment = new DropDownList({ width: 180, change: this.changeByTextAlignment, enableRtl: isRtl });
        this.alignment.appendTo(alignment);
        this.atIn.appendTo(lineSpacingAt);
        this.contextSpacing = new CheckBox({
            change: this.changeContextualSpacing,
            label: locale.getConstant("Contextual Spacing"),
            enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.contextSpacing.appendTo(contextInputEle);
        indentContainer.addEventListener('keyup', instance.keyUpParagraphSettings);
        if (isRtl) {
            afterSpacingWholeDiv.classList.add('e-de-rtl');
            lineTypeDiv.classList.add('e-de-rtl');
        }
        let lineBreakContainer: HTMLDivElement = createElement('div') as HTMLDivElement;
        let paginationDiv: HTMLDivElement = createElement('div', { className: 'e-de-para-dlg-sub-container' }) as HTMLDivElement;

        let paginationLabel: HTMLElement = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('Pagination') });
        paginationDiv.appendChild(paginationLabel);

        let keepNextContainer: HTMLElement = createElement('div', { styles: 'display:block' });
        paginationDiv.appendChild(keepNextContainer);
        let keepLines: HTMLElement = createElement('div', { styles: 'display:block' });
        paginationDiv.appendChild(keepLines);
        let keepWithNext: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' },
        }) as HTMLInputElement;
        keepNextContainer.appendChild(keepWithNext);

        this.keepWithNext = new CheckBox({
            change: this.changeKeepWithNext,
            label: locale.getConstant('Keep With Next'),
            enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.keepWithNext.appendTo(keepWithNext);

        let keepLinesTogether: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' },
        }) as HTMLInputElement;
        keepLines.appendChild(keepLinesTogether);

        this.keepLinesTogether = new CheckBox({
            change: this.changeKeepLinesTogether,
            label: locale.getConstant('Keep Lines Together'),
            enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.keepLinesTogether.appendTo(keepLinesTogether);

        lineBreakContainer.appendChild(paginationDiv);
        const items: TabItemModel[] = [
            { header: { text: locale.getConstant('Indents and Spacing') }, content: indentContainer },
            { header: { text: locale.getConstant('Line and Page breaks') }, content: lineBreakContainer }];
        this.tabObj = new Tab({ items: items, enableRtl: isRtl }, ejtab);
        this.tabObj.isStringTemplate = true;
    }
    /**
     * @private
     * @param {KeyboardEvent} event - Specifies the event args.
     * @returns {void}
     */
    public keyUpParagraphSettings = (event: KeyboardEvent): void => {
        if (event.keyCode === 13) {
            this.applyParagraphFormat();
        }
    }
    /**
     * @private
     * @param {KeyboardEvent} event - Specifies the event args.
     * @returns {void}
     */
    private changeBeforeSpacing = (event: NumericChangeArgs): void => {
        this.beforeSpacing = event.value;
    }
    /**
     * @private
     * @param {NumericChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeAfterSpacing = (event: NumericChangeArgs): void => {
        this.afterSpacing = event.value as number;
    }
    /**
     * @private
     * @param {NumericChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeLeftIndent = (event: NumericChangeArgs): void => {
        this.leftIndent = event.value as number;
    }
    /**
     * @private
     * @param {NumericChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeRightIndent = (event: NumericChangeArgs): void => {
        this.rightIndent = event.value as number;
    }
    /**
     * @private
     * @param {NumericChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeLineSpacingValue = (event: NumericChangeArgs): void => {
        this.lineSpacingIn = event.value as number;
    }
    /**
     * @private
     * @param {NumericChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeFirstLineIndent = (event: NumericChangeArgs): void => {
        this.firstLineIndent = event.value as number;
        if (this.special.index === 2) {
            this.firstLineIndent = -(this.firstLineIndent);
            this.leftIndent = this.leftIndentIn.value + event.value as number;
        }
    }
    /**
     * @private
     * @param {DropDownChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeByTextAlignment = (args: DropDownChangeArgs): void => {
        this.textAlignment = args.value as TextAlignment;
    }
    /**
     * @private
     * @param {ChangeArgs} event - Specifies change event args.
     * @returns {void}
     */
    private changeBidirectional = (event: ChangeArgs): void => {
        if (event.value === 'ltr') {
            this.rtlButton.checked = !this.ltrButton.checked;
            this.bidi = false;

        } else {
            this.ltrButton.checked = !this.rtlButton.checked;
            this.bidi = true;
        }
        this.changeAlignmentByBidi();
    };
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies change event args.
     * @returns {void}
     */
    private changeContextualSpacing = (args: ChangeEventArgs): void => {
        this.contextualSpacing = args.checked;
    };

    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies change event args.
     * @returns {void}
     */
    private changeKeepWithNext = (args: ChangeEventArgs): void => {
        this.keepWithNextValue = args.checked;
    };

    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies change event args.
     * @returns {void}
     */
    private changeKeepLinesTogether = (args: ChangeEventArgs): void => {
        this.keepLineTogetherValue = args.checked;
    };

    private changeAlignmentByBidi(): void {
        if (this.textAlignment === 'Left') {
            this.textAlignment = 'Right';
        } else if (this.textAlignment === 'Right') {
            this.textAlignment = 'Left';
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            this.alignment.index = this.getAlignmentValue(this.textAlignment);
        } else {
            if (this.alignment.index === 0) {
                this.textAlignment = 'Center';
            } else {
                this.textAlignment = 'Justify';
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public changeByValue = (): void => {
        let paragraphFormat: SelectionParagraphFormat = this.documentHelper.selection.paragraphFormat;
        switch (this.special.index) {
            case 0:
                if (paragraphFormat.firstLineIndent !== 0) {
                    this.byIn.value = 0;
                    this.leftIndent = this.leftIndentIn.value;
                }
                break;
            case 1:
                if (paragraphFormat.firstLineIndent === 0 || isNullOrUndefined(paragraphFormat.firstLineIndent)) {
                    this.byIn.value = 0.1;
                } else if (paragraphFormat.firstLineIndent < 0) {
                    this.byIn.value = -(paragraphFormat.firstLineIndent);
                    if (Math.abs(paragraphFormat.firstLineIndent) <= this.leftIndent) {
                    this.leftIndent = paragraphFormat.firstLineIndent + this.leftIndent;
                    }
                }
                break;
            case 2:
                if (paragraphFormat.firstLineIndent === 0 || isNullOrUndefined(paragraphFormat.firstLineIndent)) {
                    paragraphFormat.firstLineIndent = -0.1;
                } else if (paragraphFormat.firstLineIndent > 0) {
                    this.byIn.value = (paragraphFormat.firstLineIndent);
                    if (!isNullOrUndefined(this.leftIndent)) {
                        this.leftIndent = this.leftIndent + paragraphFormat.firstLineIndent;
                    } else {
                        this.leftIndent = paragraphFormat.firstLineIndent;
                    }
                }
                break;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public changeBySpacing = (): void => {
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
    /* eslint-enable */
    /**
     * @private
     * @returns {void}
     */
    public loadParagraphDialog = (): void => {
        if (this.isStyleDialog) {
            this.directionDiv.classList.add('e-de-disabledbutton');
        } else {
            this.directionDiv.classList.remove('e-de-disabledbutton');
        }
        let selectionFormat: SelectionParagraphFormat | WParagraphFormat;
        if (this.paragraphFormat) {
            selectionFormat = this.paragraphFormat;
        } else {
            selectionFormat = this.documentHelper.selection.paragraphFormat;
        }
        const alignValue: number = this.getAlignmentValue(selectionFormat.textAlignment);
        this.alignment.index = alignValue;
        this.beforeSpacingIn.value = selectionFormat.beforeSpacing;
        this.afterSpacingIn.value = selectionFormat.afterSpacing;
        this.leftIndentIn.value = selectionFormat.leftIndent;
        this.rightIndentIn.value = selectionFormat.rightIndent;
        this.byIn.value = Math.abs(selectionFormat.firstLineIndent);
        let lineSpaceValue: number = this.lineSpacing.index;
        this.keepWithNextValue = undefined;
        this.keepLineTogetherValue = undefined;

        if (selectionFormat.firstLineIndent > 0) {
            this.special.index = 1;
        } else if (selectionFormat.firstLineIndent < 0) {
            this.special.index = 2;
            this.leftIndentIn.value = selectionFormat.leftIndent - this.byIn.value;
        }
        if (selectionFormat.lineSpacingType === 'AtLeast') {
            lineSpaceValue = 0;
        } else if (selectionFormat.lineSpacingType === 'Exactly') {
            lineSpaceValue = 1;
        } else {
            lineSpaceValue = 2;
        }
        this.lineSpacing.index = lineSpaceValue;
        this.atIn.value = selectionFormat.lineSpacing;
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        if (selectionFormat.bidi) {
            this.rtlButton.checked = true;
            this.ltrButton.checked = false;
        } else {
            this.ltrButton.checked = true;
            this.rtlButton.checked = false;
        }
        if (isNullOrUndefined(this.keepWithNext)) {
            this.keepWithNext.indeterminate = true;
        } else {
            this.keepWithNext.checked = selectionFormat.keepWithNext;
        }
        if (isNullOrUndefined(this.keepLinesTogether)) {
            this.keepLinesTogether.indeterminate = true;
        } else {
            this.keepLinesTogether.checked = selectionFormat.keepLinesTogether;
        }

        this.contextSpacing.checked = selectionFormat.contextualSpacing;
    };

    private getAlignmentValue(textAlignment: TextAlignment): number {
        let alignValue: number;
        if (textAlignment === 'Center') {
            alignValue = 0;
        } else if (textAlignment === 'Left') {
            alignValue = 1;
        } else if (textAlignment === 'Right') {
            alignValue = 2;
        } else {
            alignValue = 3;
        }
        return alignValue;
    }

    /**
     * @private
     * @returns {void}
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
            paraFormat.firstLineIndent = Math.abs(this.firstLineIndent);
            if (this.special.index === 2) {
                paraFormat.firstLineIndent = -paraFormat.firstLineIndent;
            }
        }
        if (!isNullOrUndefined(this.bidi)) {
            paraFormat.bidi = this.bidi;
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            paraFormat.textAlignment = this.textAlignment;
        }
        if (!isNullOrUndefined(this.contextualSpacing)) {
            paraFormat.contextualSpacing = this.contextualSpacing;
        }
        if (!isNullOrUndefined(this.keepWithNextValue)) {
            paraFormat.keepWithNext = this.keepWithNextValue;
        } else if (this.documentHelper.selection.paragraphFormat.keepWithNext) {
            paraFormat.keepWithNext = this.documentHelper.selection.paragraphFormat.keepWithNext;
        }
        if (!isNullOrUndefined(this.keepLineTogetherValue)) {
            paraFormat.keepLinesTogether = this.keepLineTogetherValue;
        } else if (this.documentHelper.selection.paragraphFormat.keepLinesTogether) {
            paraFormat.keepLinesTogether = this.documentHelper.selection.paragraphFormat.keepLinesTogether;
        }

        if (isApply) {
            this.onParagraphFormat(paraFormat);
        } else {
            this.documentHelper.owner.styleDialogModule.updateParagraphFormat();
        }
        this.documentHelper.hideDialog();
    };
    /**
     * Applies Paragraph Format
     *
     * @private
     * @param {WParagraphFormat} paragraphFormat - Specifies the paragraph format.
     * @returns {void}
     */
    public onParagraphFormat(paragraphFormat: WParagraphFormat): void {
        const selection: Selection = this.documentHelper.selection;
        const isListBidi: boolean = paragraphFormat.bidi && selection.paragraphFormat.listId !== -1;
        if (!isListBidi) {
            this.documentHelper.layout.isBidiReLayout = true;
        }
        this.documentHelper.owner.editor.setPreviousBlockToLayout();
        this.documentHelper.owner.editorModule.initHistory('ParagraphFormat');
        this.documentHelper.owner.isShiftingEnabled = true;
        if (this.documentHelper.selection.isEmpty) {
            this.documentHelper.owner.editorModule.applyParaFormatProperty(selection.start.paragraph, undefined, paragraphFormat, false);
            this.documentHelper.owner.editor.layoutItemBlock(selection.start.paragraph, false);
        } else {
            this.documentHelper.owner.editorModule.updateSelectionParagraphFormatting('ParagraphFormat', paragraphFormat, false);
        }
        this.documentHelper.owner.editorModule.reLayout(selection);
        if (!isListBidi) {
            this.documentHelper.layout.isBidiReLayout = false;
        }
    }
    /**
     * @private
     * @returns {void}
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
        this.documentHelper.hideDialog();
    };
    /**
     * @private
     * @param {WParagraphFormat} paragraphFormat - Specifies the paragraph format.
     * @returns {void}
     */
    public show(paragraphFormat?: WParagraphFormat): void {
        if (paragraphFormat) {
            this.isStyleDialog = true;
            this.paragraphFormat = paragraphFormat;
        } else {
            this.isStyleDialog = false;
        }
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initParagraphDialog(local);
        }
        this.loadParagraphDialog();
        this.documentHelper.dialog.header = local.getConstant('Paragraph');
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.buttons = [{
            click: this.applyParagraphFormat,
            buttonModel: { content: local.getConstant('Ok'), cssClass: 'e-flat e-para-okay', isPrimary: true }
        },
        {
            click: this.closeParagraphDialog,
            buttonModel: { content: local.getConstant('Cancel'), cssClass: 'e-flat e-para-cancel' }
        }];
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     * @returns {void}
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
        if (this.special) {
            this.special.destroy();
            this.special = undefined;
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
        this.documentHelper = undefined;
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
