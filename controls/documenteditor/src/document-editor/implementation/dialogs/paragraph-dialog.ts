import { NumericTextBox, ChangeEventArgs as NumericChangeArgs, NumericFocusEventArgs, NumericBlurEventArgs } from '@syncfusion/ej2-inputs';
import { LayoutViewer } from '../index';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { SelectionParagraphFormat } from '../index';
import { Selection } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-dropdowns';
import { WParagraphFormat } from '../index';
import { TextAlignment, LineSpacingType, OutlineLevel } from '../../base/types';
import { RadioButton, ChangeArgs, CheckBox, ChangeEventArgs, ClickEventArgs } from '@syncfusion/ej2-buttons';
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
    private outlineLevel: DropDownList;
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
    private widowControlIn: CheckBox;

    //paragraph Format properties

    private leftIndent: number = undefined;
    private rightIndent: number = undefined;
    private beforeSpacing: number = undefined;
    private afterSpacing: number = undefined;
    private spaceBeforeAuto: boolean = false;
    private spaceAfterAuto: boolean = false;
    private textAlignment: TextAlignment = undefined;
    private paraOutlineLevel: OutlineLevel = undefined;
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
    public widowControlValue: boolean = undefined;
    private tabObj: Tab = undefined;
    private paginationDiv: HTMLElement;

    private ejtab: HTMLDivElement;
    private div: HTMLDivElement;
    private generalDiv: HTMLDivElement;
    private genLabel: HTMLElement;
    private alignmentWholeDiv: HTMLDivElement;
    private alignmentDiv: HTMLDivElement;
    private dirLabel: HTMLElement;
    private rtlDiv: HTMLElement;
    private rtlInputELe: HTMLElement;
    private ltrDiv: HTMLElement;
    private ltrInputELe: HTMLElement;
    private indentionWholeDiv: HTMLDivElement;
    private indentLabel: HTMLLabelElement;
    private indentionSubDiv1: HTMLDivElement;
    private indentionSubDiv2: HTMLDivElement;
    private beforeTextDiv: HTMLDivElement;
    private afterTextDiv: HTMLDivElement;
    private specialDiv: HTMLDivElement;
    private byDiv: HTMLDivElement;
    private by: HTMLInputElement;
    private spacingDiv: HTMLDivElement;
    private leftSpacingDiv: HTMLDivElement;
    private contextSpacingDiv: HTMLDivElement;
    private rightSpacingDiv: HTMLDivElement;
    private contextInputEle: HTMLInputElement;
    private spaceLabel: HTMLLabelElement;
    private spacingWholeDiv: HTMLElement;
    private beforeSpacingWholeDiv: HTMLElement;
    private afterSpacingWholeDiv: HTMLElement;
    private lineSpacingDiv: HTMLElement;
    private lineTypeDiv: HTMLElement;
    private lineSpacingAt: HTMLInputElement;
    private lineBreakContainer: HTMLDivElement;
    private paginationLabel: HTMLElement;
    private widowContorlContainer: HTMLElement;
    private keepNextContainer: HTMLElement;
    private keepLines: HTMLElement;
    private widowControl: HTMLInputElement;
    private keepWithNext1: HTMLInputElement;
    private keepLinesTogether1: HTMLInputElement;
    private instance: ParagraphDialog;
    private beforeSpacingSpinDown: Element;
    private afterSpacingSpinDown: Element;
    private indentContainer: HTMLElement;

    private clickBeforeSpacingClickHandler: EventListenerOrEventListenerObject = this.onClickBeforeSpacingClick.bind(this);
    private clickAfterSpacingClickHandler: EventListenerOrEventListenerObject = this.onClickAfterSpacingClick.bind(this);
    private keyUpParagraphSettingsClickHandler: EventListenerOrEventListenerObject = this.onKeyUpParagraphSettingsClick.bind(this);
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
        this.ejtab = <HTMLDivElement>createElement('div');
        this.instance = this;
        let ownerId: string = this.documentHelper.owner.containerId;
        //let id: string = ownerId + '_paragraph_dialog';
        this.indentContainer = createElement('div', { className: 'e-de-dlg-tab-first-child e-de-para-dlg-container' });
        this.target = tabContainer;
        tabContainer.appendChild(this.ejtab);
        this.div = createElement('div', { styles: 'width:400px;' }) as HTMLDivElement;
        this.generalDiv = createElement('div') as HTMLDivElement;

        this.genLabel = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('General') });
        this.generalDiv.appendChild(this.genLabel);

        this.alignmentWholeDiv = createElement('div', { className: 'e-de-container-row' }) as HTMLDivElement;
        this.generalDiv.appendChild(this.alignmentWholeDiv)

        this.alignmentDiv = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLDivElement;
        this.alignmentWholeDiv.appendChild(this.alignmentDiv)

        let alignment: HTMLElement = createElement('select', {
            id: ownerId + '_Alignment',
            innerHTML: '<option value="Center">' + locale.getConstant('Center') +
                '</option><option value="Left">' + locale.getConstant('Left') +
                '</option><option value="Right">' + locale.getConstant('Right') +
                '</option><option value="Justify">' + locale.getConstant('Justify') + '</option>'
        }) as HTMLSelectElement;

        let outlineLevel: HTMLElement = createElement('select', {
            id: ownerId + '_Outline',
            innerHTML: '<option value="BodyText">' + locale.getConstant('BodyText') +
                '</option><option value="Level1">' + locale.getConstant('Level1') +
                '</option><option value="Level2">' + locale.getConstant('Level2') +
                '</option><option value="Level3">' + locale.getConstant('Level3') +
                '</option><option value="Level4">' + locale.getConstant('Level4') +
                '</option><option value="Level5">' + locale.getConstant('Level5') +
                '</option><option value="Level6">' + locale.getConstant('Level6') +
                '</option><option value="Level7">' + locale.getConstant('Level7') +
                '</option><option value="Level8">' + locale.getConstant('Level8') +
                '</option><option value="Level9">' + locale.getConstant('Level9') + '</option>'
        }) as HTMLSelectElement;

        this.alignmentDiv.appendChild(alignment);
        this.alignmentDiv.setAttribute('aria-labelledby',alignment.innerText);
        this.alignmentDiv.appendChild(outlineLevel);
        this.alignmentDiv.setAttribute('aria-labelledby',outlineLevel.innerText);
        this.dirLabel = createElement('div', {
            className: 'e-de-dlg-sub-header', innerHTML: locale.getConstant('Direction')
        });
        this.directionDiv = createElement('div', { className:'e-de-container-row' });
        this.rtlDiv = createElement('div', { className: 'e-de-rtl-btn-div' });
        this.rtlInputELe = createElement('input', { id: ownerId + '_rtlEle' });
        this.rtlDiv.appendChild(this.rtlInputELe);
        this.directionDiv.appendChild(this.rtlDiv)
        let isRtl: boolean = this.documentHelper.owner.enableRtl;
        if (isRtl) {
            this.rtlDiv.classList.add('e-de-rtl');
        }
        this.ltrDiv = createElement('div', { className: 'e-de-ltr-btn-div' });
        this.ltrInputELe = createElement('input', { id: ownerId + '_ltrEle' });
        this.ltrDiv.appendChild(this.ltrInputELe);
        this.directionDiv.appendChild(this.ltrDiv)
        this.generalDiv.appendChild(this.dirLabel);
        this.generalDiv.appendChild(this.directionDiv);
        this.rtlButton = new RadioButton({
            label: locale.getConstant('Right-to-left'), enableRtl: isRtl,
            value: 'rtl', cssClass: 'e-small', change: this.changeBidirectional
        });
        this.rtlButton.appendTo(this.rtlInputELe);
        this.rtlInputELe.setAttribute('aria-label',locale.getConstant('Right-to-left'))
        this.ltrButton = new RadioButton({
            label: locale.getConstant('Left-to-right'), enableRtl: isRtl,
            value: 'ltr', cssClass: 'e-small', change: this.changeBidirectional
        });
        this.ltrButton.appendTo(this.ltrInputELe);
        this.ltrInputELe.setAttribute('aria-label',locale.getConstant('Left-to-right'))
        this.indentionWholeDiv = createElement('div') as HTMLDivElement;
        
        this.indentLabel = createElement('div', { className: 'e-de-para-dlg-heading',
            innerHTML: locale.getConstant('Indentation')
        }) as HTMLLabelElement;
        this.indentionWholeDiv.appendChild(this.indentLabel);
        this.indentionSubDiv1 = createElement('div', { className:'e-de-container-row' }) as HTMLDivElement;
        this.indentionWholeDiv.appendChild(this.indentionSubDiv1);

        this.indentionSubDiv2 = createElement('div', { className: 'e-de-container-row'}) as HTMLDivElement;
        this.indentionWholeDiv.appendChild(this.indentionSubDiv2);

        this.beforeTextDiv = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLDivElement;
        this.indentionSubDiv1.appendChild(this.beforeTextDiv);

        this.afterTextDiv = createElement('div', { className: 'e-de-subcontainer-right' }) as HTMLDivElement;
        this.indentionSubDiv1.appendChild(this.afterTextDiv);

        this.specialDiv = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLDivElement;
        this.indentionSubDiv2.appendChild(this.specialDiv);
        this.byDiv = createElement('div', { className: 'e-de-subcontainer-right'}) as HTMLDivElement;
        this.indentionSubDiv2.appendChild(this.byDiv);

        this.spacingDiv = createElement('div') as HTMLDivElement;
        this.leftSpacingDiv = createElement('div') as HTMLDivElement;
        this.spacingDiv.appendChild(this.leftSpacingDiv);
        // let contextSpacingStyles: string = 'float:left';
        // if (isRtl) {
        //     contextSpacingStyles = 'float:right;';
        // }
        this.contextSpacingDiv = createElement('div', { className:'e-de-container-row'}) as HTMLDivElement;
        this.spacingDiv.appendChild(this.contextSpacingDiv);

        this.rightSpacingDiv = createElement('div', { className:'e-de-container-row'}) as HTMLDivElement;
        this.spacingDiv.appendChild(this.rightSpacingDiv);

        this.contextInputEle = createElement('input', {
            attrs: { type: 'checkbox' },
            id: ownerId + '_contextSpacing'
        }) as HTMLInputElement;
        this.contextSpacingDiv.appendChild(this.contextInputEle);

        let leftIndent: HTMLInputElement = createElement('input', { id: ownerId + '_leftIndent', attrs: { 'type': 'text' } }) as HTMLInputElement;

        let rightIndent: HTMLInputElement = createElement('input', { id: ownerId + '_rightIndent', attrs: { 'type': 'text' } }) as HTMLInputElement;

        this.beforeTextDiv.appendChild(leftIndent);
        this.beforeTextDiv.setAttribute('aria-labelledby',locale.getConstant('Indent from left'));
        this.afterTextDiv.appendChild(rightIndent);
        this.afterTextDiv.setAttribute('aria-labelledby',locale.getConstant('Indent from right'))

        let special: HTMLElement = createElement('select', {
            id: ownerId + '_special',
            innerHTML: '<option value="None">' + locale.getConstant('None') +
                '</option><option value="First Line">' + locale.getConstant('First line') +
                '</option><option value="Hanging">' + locale.getConstant('Hanging') + '</option> '
        }) as HTMLSelectElement;

        this.by = createElement('input', { id: ownerId + '_By', attrs: { 'type': 'text' } }) as HTMLInputElement;

        this.specialDiv.setAttribute('aria-labelledby','Special');
        this.specialDiv.appendChild(special);

        this.byDiv.appendChild(this.by);
        this.byDiv.setAttribute('aria-labelledby','By')

        this.spaceLabel = createElement('div', { className: 'e-de-para-dlg-heading',innerHTML: locale.getConstant('Spacing')}) as HTMLLabelElement;
        this.spacingWholeDiv = createElement('div', { className: 'e-de-container-row'}) as HTMLElement;
        this.beforeSpacingWholeDiv = createElement('div', { className: 'e-de-subcontainer-left'}) as HTMLElement;

        let beforeSpacing: HTMLInputElement = createElement('input', { id: ownerId + '_beforeSpacing', attrs: { 'type': 'text' } }) as HTMLInputElement;
        this.afterSpacingWholeDiv = createElement('div', { className: 'e-de-subcontainer-right' }) as HTMLElement;

        let afterSpacing: HTMLInputElement = createElement('input', { id: ownerId + '_afterSpacing', attrs: { 'type': 'text' } }) as HTMLInputElement;
        this.leftSpacingDiv.appendChild(this.spaceLabel);
        this.leftSpacingDiv.appendChild(this.spacingWholeDiv);
        
        this.beforeSpacingWholeDiv.appendChild(beforeSpacing);
        this.spacingWholeDiv.appendChild(this.beforeSpacingWholeDiv);
        
        this.afterSpacingWholeDiv.appendChild(afterSpacing);
        this.spacingWholeDiv.appendChild(this.afterSpacingWholeDiv);
        this.lineSpacingDiv = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLElement;

        let lineSpacing: HTMLElement = createElement('select', {
            id: ownerId + '_lineSpacing',
            innerHTML: '<option value="At least">' + locale.getConstant('At least') +
                '</option><option value="Exactly">' + locale.getConstant('Exactly') +
                '</option><option value="Multiple">' + locale.getConstant('Multiple') + '</option>'
        }) as HTMLSelectElement;

        this.lineTypeDiv = createElement('div', { className: 'e-de-subcontainer-right' }) as HTMLElement;

        this.lineSpacingAt = createElement('input', { id: ownerId + '_lineSpacingAt', attrs: { 'type': 'text' } }) as HTMLInputElement;
        this.lineSpacingDiv.appendChild(lineSpacing);
        this.rightSpacingDiv.appendChild(this.lineSpacingDiv);

        this.lineTypeDiv.appendChild(this.lineSpacingAt);
        this.rightSpacingDiv.appendChild(this.lineTypeDiv);
        this.div.appendChild(this.generalDiv);
        this.div.appendChild(this.indentionWholeDiv);
        this.div.appendChild(this.spacingDiv);
        this.indentContainer.appendChild(this.div);
        this.leftIndentIn = new NumericTextBox({
            format: 'n1', value: 0, min: -1584, max: 1584,enablePersistence: false, floatLabelType:'Always', placeholder:locale.getConstant('Before text'), change: this.changeLeftIndent
        });
        this.leftIndentIn.appendTo(leftIndent);
        this.rightIndentIn = new NumericTextBox({
            format: 'n1', value: 0, min: -1584, max: 1584, enablePersistence: false, floatLabelType:'Always', placeholder:locale.getConstant('After text'), change: this.changeRightIndent
        });
        this.rightIndentIn.appendTo(rightIndent);
        this.byIn = new NumericTextBox({
            format: 'n1', value: 0, min: 0, max: 1584, enablePersistence: false, floatLabelType:'Always', placeholder:locale.getConstant('By'), change: this.changeFirstLineIndent
        });
        this.byIn.appendTo(this.by);
        this.beforeSpacingIn = new NumericTextBox({
            format: 'n1', value: 0, min: -1, max: 1584, step: 6, enablePersistence: false, floatLabelType:'Always', placeholder:locale.getConstant('Before'),
            change: this.changeBeforeSpacing,
            focus: this.focusBeforeSpacing,
            blur: this.blurBeforeSpacing,
        });
        this.beforeSpacingIn.appendTo(beforeSpacing);
        this.beforeSpacingSpinDown = this.beforeSpacingWholeDiv.getElementsByClassName("e-input-group-icon e-spin-down")[0];
        this.beforeSpacingSpinDown.addEventListener('click', this.clickBeforeSpacingClickHandler);
        this.afterSpacingIn = new NumericTextBox({
            format: 'n1', value: 0, min: -1, max: 1584, step: 6, enablePersistence: false, floatLabelType:'Always', placeholder:locale.getConstant('After'),
            change: this.changeAfterSpacing,
            focus: this.focusAfterSpacing,
            blur: this.blurAfterSpacing
        });
        this.afterSpacingIn.appendTo(afterSpacing);
        this.afterSpacingSpinDown = this.afterSpacingWholeDiv.getElementsByClassName("e-input-group-icon e-spin-down")[0];
        this.afterSpacingSpinDown.addEventListener('click', this.clickAfterSpacingClickHandler);
        this.atIn = new NumericTextBox({
            format: 'n1', value: 0, min: 1, max: 1584, step: 0.5, enablePersistence: false,floatLabelType: 'Always', placeholder: locale.getConstant('At'), change: this.changeLineSpacingValue
        });
        this.special = new DropDownList({ change: this.changeByValue, enableRtl: isRtl, floatLabelType:'Always', placeholder:locale.getConstant('Special')});
        this.special.appendTo(special);
        this.lineSpacing = new DropDownList({ change: this.changeBySpacing, enableRtl: isRtl, floatLabelType: 'Always', placeholder: locale.getConstant('Line Spacing'),htmlAttributes:{'aria-labelledby':locale.getConstant('Line Spacing')}});
        this.lineSpacing.appendTo(lineSpacing);
        this.alignment = new DropDownList({ change: this.changeByTextAlignment, enableRtl: isRtl ,floatLabelType: 'Always', placeholder: locale.getConstant('Alignment'),htmlAttributes:{'aria-labelledby':locale.getConstant('Alignment')}});
        this.alignment.appendTo(alignment);
        this.outlineLevel= new DropDownList({ change: this.changeByOutlineLevel, enableRtl: isRtl ,floatLabelType: 'Always', placeholder: locale.getConstant('OutlineLevel'),htmlAttributes:{'aria-labelledby':locale.getConstant('OutlineLevel')}});
        this.outlineLevel.appendTo(outlineLevel);
        this.atIn.appendTo(this.lineSpacingAt);
        this.contextSpacing = new CheckBox({
            change: this.changeContextualSpacing,
            label: locale.getConstant("Contextual Spacing"),
            enableRtl: isRtl
        });
        this.contextSpacing.appendTo(this.contextInputEle);
        this.contextInputEle.setAttribute('aria-labelledby',locale.getConstant("Contextual Spacing"));
        this.indentContainer.addEventListener('keyup', this.instance.keyUpParagraphSettingsClickHandler);
        if (isRtl) {
            this.afterSpacingWholeDiv.classList.add('e-de-rtl');
            this.lineTypeDiv.classList.add('e-de-rtl');
        }
        this.lineBreakContainer = createElement('div', {className: 'e-de-dlg-tab-first-child'}) as HTMLDivElement;

        let paginationDiv: HTMLDivElement = createElement('div', { className: 'e-de-para-dlg-sub-container' }) as HTMLDivElement;
        this.paginationDiv = paginationDiv;
        this.paginationLabel = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('Pagination') });
        paginationDiv.appendChild(this.paginationLabel);

        
        this.widowContorlContainer = createElement('div', { styles: 'display:block'});
        paginationDiv.appendChild(this.widowContorlContainer);
        this.keepNextContainer = createElement('div', { styles: 'display:block' });
        paginationDiv.appendChild(this.keepNextContainer);
        this.keepLines = createElement('div', { styles: 'display:block' });
        paginationDiv.appendChild(this.keepLines);
        this.keepWithNext1 = createElement('input', {
            attrs: { type: 'checkbox' },
        }) as HTMLInputElement;
        this.keepNextContainer.appendChild(this.keepWithNext1);
        this.keepWithNext = new CheckBox({
            change: this.changeKeepWithNext,
            label: locale.getConstant('Keep With Next'),
            enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.keepWithNext.appendTo(this.keepWithNext1);
        this.keepWithNext1.setAttribute('aria-label',locale.getConstant('Keep With Next'));
        this.keepLinesTogether1 = createElement('input', {
            attrs: { type: 'checkbox' },
        }) as HTMLInputElement;
        this.keepLines.appendChild(this.keepLinesTogether1);

        this.keepLinesTogether = new CheckBox({
            change: this.changeKeepLinesTogether,
            label: locale.getConstant('Keep Lines Together'),
            enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.keepLinesTogether.appendTo(this.keepLinesTogether1);
        this.keepLinesTogether1.setAttribute('aria-label',locale.getConstant('Keep Lines Together'));
        this.widowControl = createElement('input', {
            attrs: { type: 'checkbox' },
        }) as HTMLInputElement;
        this.widowContorlContainer.appendChild(this.widowControl);

        this.widowControlIn = new CheckBox({
            change: this.changeWidowControl,
            label: locale.getConstant('WidowControl'),
            enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.widowControlIn.appendTo(this.widowControl);
        this.widowControl.setAttribute('aria-label',locale.getConstant('WidowControl'));
        this.lineBreakContainer.appendChild(paginationDiv);
        const items: TabItemModel[] = [
            { header: { text: locale.getConstant('Indents and Spacing') }, content: this.indentContainer },
            { header: { text: locale.getConstant('Line and Page Breaks') }, content: this.lineBreakContainer }];
        this.tabObj = new Tab({ items: items, enableRtl: isRtl, animation: { previous: { effect: 'None' }, next: { effect: 'None' } } }, this.ejtab);
        this.tabObj.isStringTemplate = true;
    }
    private onKeyUpParagraphSettingsClick(event: KeyboardEvent): void {
        this.keyUpParagraphSettings(event);
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
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (event.value === -1) {
            this.beforeSpacingIn.element.value = local.getConstant('Auto');
            this.beforeSpacingIn.step = 1;
            this.spaceBeforeAuto = true;
            this.beforeSpacing = 5;
        }
        else {
            this.beforeSpacing = event.value as number;
            this.beforeSpacingIn.step = 6;
            this.spaceBeforeAuto = false;
        }
    }
    /**
     * @private
     * @param {NumericFocusEventArgs} event - Specifies the event args.
     * @returns {void}
     */
    private focusBeforeSpacing = (event: NumericFocusEventArgs): void => {
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (event.value === -1) {
            this.beforeSpacingIn.element.value = local.getConstant('Auto');
        }
    }
    /**
     * @private
     * @param {NumericFocusEventArgs} event - Specifies the event args.
     * @returns {void}
     */
    private blurBeforeSpacing = (event: NumericFocusEventArgs): void => {
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (event.value === -1) {
            let proxy: NumericTextBox = this.beforeSpacingIn;
            setTimeout((): void => {
                proxy.element.value = local.getConstant('Auto');
            }, 0);
        }
    }
    private onClickBeforeSpacingClick(): void {
        this.clickBeforeSpacing();
    }
    /**
    * @private
    * @param {ClickEventArgs} event - Specifies the event args.
    * @returns {void}
    */
    private clickBeforeSpacing = (): void => {
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (this.beforeSpacingIn.element.value === '-1.0')
            this.beforeSpacingIn.element.value = local.getConstant('Auto');
    }
    /**
     * @private
     * @param {NumericChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeAfterSpacing = (event: NumericChangeArgs): void => {
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (event.value === -1) {
            this.afterSpacingIn.element.value = local.getConstant('Auto');
            this.afterSpacingIn.step = 1;
            this.spaceAfterAuto = true;
            this.afterSpacing = 5;
        }
        else {
            this.afterSpacing = event.value as number;
            this.afterSpacingIn.step = 6;
            this.spaceAfterAuto = false;
        }
    }
    /**
     * @private
     * @param {NumericFocusEventArgs} event - Specifies the event args.
     * @returns {void}
     */
    private focusAfterSpacing = (event: NumericFocusEventArgs): void => {
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (event.value === -1) {
            this.afterSpacingIn.element.value = local.getConstant('Auto');
        }
    }
    /**
     * @private
     * @param {NumericFocusEventArgs} event - Specifies the event args.
     * @returns {void}
     */
    private blurAfterSpacing = (event: NumericFocusEventArgs): void => {
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (event.value === -1) {
            let proxy: NumericTextBox = this.afterSpacingIn;
            setTimeout((): void => {
                proxy.element.value = local.getConstant('Auto');
            }, 0);
        }
    }
    private onClickAfterSpacingClick(): void {
        this.clickAfterSpacing();
    }
    /**
    * @private
    * @param {ClickEventArgs} event - Specifies the event args.
    * @returns {void}
    */
    private clickAfterSpacing = (): void => {
        const local: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        local.setLocale(this.documentHelper.owner.locale);
        if (this.afterSpacingIn.element.value === '-1.0')
            this.afterSpacingIn.element.value = local.getConstant('Auto');
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
     * @param {DropDownChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    private changeByOutlineLevel = (args: DropDownChangeArgs): void => {
        this.paraOutlineLevel=args.value as OutlineLevel;
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
    
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies change event args.
     * @returns {void}
     */
    private changeWidowControl= (args: ChangeEventArgs): void => {
        this.widowControlValue = args.checked;
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
        const outlineValue: number = this.getOutlineValue(selectionFormat.outlineLevel);
        this.outlineLevel.index = outlineValue;
        if (this.isHeadingStyle()){
            this.outlineLevel.readonly = true;
        }else{
            this.outlineLevel.readonly = false;
        }
        if (selectionFormat.spaceBeforeAuto) {
            this.beforeSpacingIn.value = -1;
        }
        else {
            if (selectionFormat.beforeSpacing === -1) {
                this.beforeSpacingIn.value = undefined;
            }
            else {
                this.beforeSpacingIn.value = selectionFormat.beforeSpacing;
            }
        }
        if (selectionFormat.spaceAfterAuto) {
            this.afterSpacingIn.value = -1;
        }
        else {
            if (selectionFormat.afterSpacing === -1) {
                this.afterSpacingIn.value = undefined;
            }
            else {
                this.afterSpacingIn.value = selectionFormat.afterSpacing;
            }
        }
        this.leftIndentIn.value = selectionFormat.leftIndent;
        this.rightIndentIn.value = selectionFormat.rightIndent;
        this.byIn.value = Math.abs(selectionFormat.firstLineIndent);
        let lineSpaceValue: number = this.lineSpacing.index;
        this.keepWithNextValue = undefined;
        this.keepLineTogetherValue = undefined;
        this.widowControlValue = undefined;

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
        if (isNullOrUndefined(selectionFormat.keepWithNext)) {
            this.keepWithNext.indeterminate = true;
        } else {
            this.keepWithNext.checked = selectionFormat.keepWithNext;
        }
        if (isNullOrUndefined(selectionFormat.keepLinesTogether)) {
            this.keepLinesTogether.indeterminate = true;
        } else {
            this.keepLinesTogether.checked = selectionFormat.keepLinesTogether;
        }
        if (isNullOrUndefined(selectionFormat.widowControl)) {
            this.widowControlIn.indeterminate = true;
        } else {
            this.widowControlIn.checked = selectionFormat.widowControl;
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

    private isHeadingStyle(): boolean{
        const parastyle: string = this.documentHelper.selection.paragraphFormat.styleName;
        if (parastyle === 'Heading 1' || parastyle === 'Heading 2' || parastyle === 'Heading 3' || parastyle === 'Heading 4' || parastyle === 'Heading 5' || parastyle === 'Heading 6' || parastyle === 'Heading 7' || parastyle === 'Heading 8' || parastyle === 'Heading 9' )
        {
            return true;
        }else{
            return false;
        }
    }

    private getOutlineValue(outlineLevel: OutlineLevel): number {
        let alignValue: number;
        if (outlineLevel === 'BodyText') {
            alignValue = 0;
        } else if (outlineLevel === 'Level1') {
            alignValue = 1;
        } else if (outlineLevel === 'Level2') {
            alignValue = 2;
        } else if (outlineLevel === 'Level3') {
            alignValue = 3;
        } else if (outlineLevel === 'Level4') {
            alignValue = 4;
        } else if (outlineLevel === 'Level5') {
            alignValue = 5;
        } else if (outlineLevel === 'Level6') {
            alignValue = 6;
        } else if (outlineLevel === 'Level7') {
            alignValue = 7;
        } else if (outlineLevel === 'Level8') {
            alignValue = 8;
        } else {
            alignValue = 9;
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
            paraFormat.borders = undefined;
            isApply = true;
        }
        if (!isNullOrUndefined(this.beforeSpacing)) {
            paraFormat.beforeSpacing = this.beforeSpacing;
        }
        if (!isNullOrUndefined(this.afterSpacing)) {
            paraFormat.afterSpacing = this.afterSpacing;
        }
        if (!isNullOrUndefined(this.spaceBeforeAuto)) {
            paraFormat.spaceBeforeAuto = this.spaceBeforeAuto;
        }
        if (!isNullOrUndefined(this.spaceAfterAuto)) {
            paraFormat.spaceAfterAuto = this.spaceAfterAuto;
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
                paraFormat.leftIndent = this.leftIndentIn.value + this.byIn.value;
            }
        }
        if (!isNullOrUndefined(this.paraOutlineLevel)) {
            paraFormat.outlineLevel = this.paraOutlineLevel;
        }
        if (!isNullOrUndefined(this.bidi)) {
            paraFormat.bidi = this.bidi;
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            let textAlignment: TextAlignment = this.textAlignment;
            if (paraFormat.bidi) {
                if (textAlignment === 'Right') {
                    textAlignment = 'Left';
                } else if (textAlignment === 'Left') {
                    textAlignment = 'Right';
                }
            }
            paraFormat.textAlignment = textAlignment;
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
        if (!isNullOrUndefined(this.widowControlValue)) {
            paraFormat.widowControl = this.widowControlValue;
        } else if (this.documentHelper.selection.paragraphFormat.widowControl) {
            paraFormat.widowControl = this.documentHelper.selection.paragraphFormat.widowControl;
        }
        if (isApply) {
            this.onParagraphFormat(paraFormat);
        } else {
            this.documentHelper.owner.styleDialogModule.updateParagraphFormat();
        }
        this.documentHelper.hideDialog();
    };
    /**
     * @private
     * @returns {void}
     */
    public openTabDialog = (): void => {
        this.documentHelper.hideDialog();
        this.documentHelper.owner.tabDialogModule.show();
    }
    /**
     * Applies Paragraph Format
     *
     * @private
     * @param {WParagraphFormat} paragraphFormat - Specifies the paragraph format.
     * @returns {void}
     */
    public onParagraphFormat(paragraphFormat: WParagraphFormat): void {
        const selection: Selection = this.documentHelper.selection;
        if (!isNullOrUndefined(selection) && selection.checkContentControlLocked(true)) {
            return;
        }
        const isListBidi: boolean = paragraphFormat.bidi && selection.paragraphFormat.listId !== -1;
        if (!isListBidi) {
            this.documentHelper.layout.isBidiReLayout = true;
        }
        this.documentHelper.owner.editorModule.setPreviousBlockToLayout();
        this.documentHelper.owner.editorModule.initHistory('ParagraphFormat');
        this.documentHelper.owner.isShiftingEnabled = true;
        if (this.documentHelper.selection.isEmpty) {
            this.documentHelper.owner.editorModule.applyParaFormatProperty(selection.start.paragraph, undefined, paragraphFormat, false);
            this.documentHelper.owner.editorModule.isMeasureParaWidth = true;
            this.documentHelper.owner.editorModule.layoutItemBlock(selection.start.paragraph, false);
            this.documentHelper.owner.editorModule.isMeasureParaWidth = true;
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
        this.paraOutlineLevel = undefined;
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
        this.documentHelper.dialog.buttons = [
            {
                click: this.openTabDialog,
                buttonModel: { content: local.getConstant('Tabs') + '....', cssClass: 'e-flat e-de-para-tab', enableRtl: this.documentHelper.owner.enableRtl }
            },
            {
                click: this.applyParagraphFormat,
                buttonModel: { content: local.getConstant('Ok'), cssClass: 'e-flat e-para-okay', isPrimary: true }
            },
            {
                click: this.closeParagraphDialog,
                buttonModel: { content: local.getConstant('Cancel'), cssClass: 'e-flat e-para-cancel' }
            }
        ];
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.dataBind();
        this.alignment.focusIn();
        this.documentHelper.dialog.show();
        const dialogElement: HTMLElement = this.documentHelper.dialog.element;
        if (dialogElement) {
            const width: number = this.documentHelper.updateDialogTabHeight(dialogElement, this.target);
            this.paginationDiv.style.width = width.toString() + 'px';
        }

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
        if (this.outlineLevel){
            this.outlineLevel.change = undefined;
            this.outlineLevel.destroy();
        }
        this.outlineLevel = undefined;
        if (this.lineSpacing) {
            this.lineSpacing.change = undefined;
            this.lineSpacing.destroy();
        }
        this.lineSpacing = undefined;
        if (this.special) {
            this.special.change = undefined;
            this.special.destroy();
        }
        this.removeEvents();
        this.removeElements();
        this.special = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let q: number = 0; q < this.target.childNodes.length; q++) {
                this.target.removeChild(this.target.childNodes[parseInt(q.toString(), 10)]);
                q--;
            }
            this.target = undefined;
            if (this.paragraphFormat) {
                this.paragraphFormat.destroy();
                this.paragraphFormat = undefined;
            }
            this.documentHelper = undefined;
        }
    }
    private removeEvents(): void {
        if (this.beforeSpacingSpinDown)  {
            this.beforeSpacingSpinDown.removeEventListener('click', this.clickBeforeSpacingClickHandler);
        }
        if (this.afterSpacingSpinDown) {
            this.afterSpacingSpinDown.removeEventListener('click', this.clickAfterSpacingClickHandler);
        }
        if (this.indentContainer) {
            this.indentContainer.removeEventListener('keyup', this.instance.keyUpParagraphSettingsClickHandler);
        }
    }
    private removeElements(): void {
        if (this.ejtab) {
            this.ejtab.remove();
            this.ejtab = undefined;
        }
        if (this.div) {
            this.div.remove();
            this.div = undefined;
        }
        if (this.generalDiv) {
            this.generalDiv.remove();
            this.generalDiv = undefined;
        }
        if (this.genLabel) {
            this.genLabel.remove();
            this.genLabel = undefined;
        }
        if (this.alignmentWholeDiv) {
            this.alignmentWholeDiv.remove();
            this.alignmentWholeDiv = undefined;
        }
        if (this.alignmentDiv) {
            this.alignmentDiv.remove();
            this.alignmentDiv = undefined;
        }
        if (this.dirLabel) {
            this.dirLabel.remove();
            this.dirLabel = undefined;
        }
        if (this.rtlDiv) {
            this.rtlDiv.remove();
            this.rtlDiv = undefined;
        }
        if (this.rtlInputELe) {
            this.rtlInputELe.remove();
            this.rtlInputELe = undefined;
        }
        if (this.ltrDiv) {
            this.ltrDiv.remove();
            this.ltrDiv = undefined;
        }
        if (this.ltrInputELe) {
            this.ltrInputELe.remove();
            this.ltrInputELe = undefined;
        }
        if (this.indentionWholeDiv) {
            this.indentionWholeDiv.remove();
            this.indentionWholeDiv = undefined;
        }
        if (this.indentLabel) {
            this.indentLabel.remove();
            this.indentLabel = undefined;
        }
        if (this.indentionSubDiv1) {
            this.indentionSubDiv1.remove();
            this.indentionSubDiv1 = undefined;
        }
        if (this.indentionSubDiv2) {
            this.indentionSubDiv2.remove();
            this.indentionSubDiv2 = undefined;
        }
        if (this.beforeTextDiv) {
            this.beforeTextDiv.remove();
            this.beforeTextDiv = undefined;
        }
        if (this.afterTextDiv) {
            this.afterTextDiv.remove();
            this.afterTextDiv = undefined;
        }
        if (this.specialDiv) {
            this.specialDiv.remove();
            this.specialDiv = undefined;
        }
        if (this.byDiv) {
            this.byDiv.remove();
            this.byDiv = undefined;
        }
        if (this.by) {
            this.by.remove();
            this.by = undefined;
        }
        if (this.spacingDiv) {
            this.spacingDiv.remove();
            this.spacingDiv = undefined;
        }
        if (this.leftSpacingDiv) {
            this.leftSpacingDiv.remove();
            this.leftSpacingDiv = undefined;
        }
        if (this.contextSpacingDiv) {
            this.contextSpacingDiv.remove();
            this.contextSpacingDiv = undefined;
        }
        if (this.rightSpacingDiv) {
            this.rightSpacingDiv.remove();
            this.rightSpacingDiv = undefined;
        }
        if (this.contextInputEle) {
            this.contextInputEle.remove();
            this.contextInputEle = undefined;
        }
        if (this.spaceLabel) {
            this.spaceLabel.remove();
            this.spaceLabel = undefined;
        }
        if (this.spacingWholeDiv) {
            this.spacingWholeDiv.remove();
            this.spacingWholeDiv = undefined;
        }
        if (this.beforeSpacingWholeDiv) {
            this.beforeSpacingWholeDiv.remove();
            this.beforeSpacingWholeDiv = undefined;
        }
        if (this.afterSpacingWholeDiv) {
            this.afterSpacingWholeDiv.remove();
            this.afterSpacingWholeDiv = undefined;
        }
        if (this.lineSpacingDiv) {
            this.lineSpacingDiv.remove();
            this.lineSpacingDiv = undefined;
        }
        if (this.lineTypeDiv) {
            this.lineTypeDiv.remove();
            this.lineTypeDiv = undefined;
        }
        if (this.lineSpacingAt) {
            this.lineSpacingAt.remove();
            this.lineSpacingAt = undefined;
        }
        if (this.lineBreakContainer) {
            this.lineBreakContainer.remove();
            this.lineBreakContainer = undefined;
        }
        if (this.paginationLabel) {
            this.paginationLabel.remove();
            this.paginationLabel = undefined;
        }
        if (this.widowContorlContainer) {
            this.widowContorlContainer.remove();
            this.widowContorlContainer = undefined;
        }
        if (this.keepNextContainer) {
            this.keepNextContainer.remove();
            this.keepNextContainer = undefined;
        }
        if (this.keepLines) {
            this.keepLines.remove();
            this.keepLines = undefined;
        }
        if (this.widowControl) {
            this.widowControl.remove();
            this.widowControl = undefined;
        }
        if (this.keepWithNext1) {
            this.keepWithNext1.remove();
            this.keepWithNext1 = undefined;
        }
        if (this.keepLinesTogether1) {
            this.keepLinesTogether1.remove();
            this.keepLinesTogether1 = undefined;
        }
        if (this.beforeSpacingSpinDown)  {
            this.beforeSpacingSpinDown.remove();
            this.beforeSpacingSpinDown = undefined;
        }
        if (this.afterSpacingSpinDown) {
            this.afterSpacingSpinDown.remove();
            this.afterSpacingSpinDown = undefined;
        }
        if (this.indentContainer) {
            this.indentContainer.remove();
            this.indentContainer = undefined;
        }
    }
}
