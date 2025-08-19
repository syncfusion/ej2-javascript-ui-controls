import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { SelectionSectionFormat } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WColumnFormat, WSectionFormat } from './../../implementation/format/index';
import { Tab, TabItemModel } from '@syncfusion/ej2-navigations';
import { DocumentHelper } from '../viewer';
import { HelperMethods } from '../editor/editor-helper';
import { DialogUtility } from '@syncfusion/ej2-popups';

/**
 * The Page setup dialog is used to modify formatting of selected sections.
 */
export class PageSetupDialog {
    private target: HTMLElement;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    /**
     * @private
     */
    public topMarginBox: NumericTextBox;
    /**
     * @private
     */
    public bottomMarginBox: NumericTextBox;
    /**
     * @private
     */
    public leftMarginBox: NumericTextBox;
    /**
     * @private
     */
    public rightMarginBox: NumericTextBox;
    /**
     * @private
     */
    public widthBox: NumericTextBox;
    /**
     * @private
     */
    public heightBox: NumericTextBox;
    /**
     * @private
     */
    public headerBox: NumericTextBox;
    /**
     * @private
     */
    public footerBox: NumericTextBox;
    private paperSize: DropDownList;
    private checkBox1: CheckBox;
    private checkBox2: CheckBox;
    private landscape: RadioButton;
    private portrait: RadioButton;
    private isPortrait: boolean = true;

    private marginTab: HTMLDivElement;
    private paperTab: HTMLDivElement;
    private layoutTab: HTMLDivElement;

    private ejtabContainer: HTMLDivElement;
    private ejtab: HTMLDivElement;
    private headerContainer: HTMLDivElement;
    private marginHeader: HTMLDivElement;
    private paperHeader: HTMLDivElement;
    private layoutHeader: HTMLDivElement;
    private marginContent: HTMLDivElement;
    private paperContent: HTMLDivElement;
    private layoutContent: HTMLDivElement;
    private marginDiv: HTMLDivElement;
    private leftMarginDiv: HTMLDivElement;
    private rightMarginDiv: HTMLDivElement;
    private topTextBox: HTMLInputElement;
    private bottomTextBox: HTMLInputElement;
    private topContainer: HTMLDivElement;
    private bottomContainer: HTMLDivElement;
    private leftTextBox: HTMLInputElement;
    private rightTextBox: HTMLInputElement;
    private leftContainer: HTMLDivElement;
    private rightContainer: HTMLDivElement;
    private orientationDiv: HTMLDivElement;
    private orientationLabeldiv: HTMLElement;
    private orientationPropDiv: HTMLDivElement;
    private portraitDiv: HTMLDivElement;
    private landscapeDiv: HTMLDivElement;
    private sizeDiv: HTMLDivElement;
    private leftSizeDiv: HTMLDivElement;
    private rightSizeDiv: HTMLDivElement;
    private widthTextBox: HTMLInputElement;
    private heightTextBox: HTMLInputElement;
    private paperSizeDiv: HTMLDivElement;
    private layoutDiv: HTMLDivElement;
    private firstPageDiv: HTMLDivElement;
    private oddOrEvenDiv: HTMLDivElement;
    private textLabelDiv: HTMLDivElement;
    private textLabel: HTMLLabelElement;
    private propertyDiv: HTMLDivElement;
    private leftLayoutDiv: HTMLDivElement;
    private rightLayoutDiv: HTMLDivElement;
    private dialogElement: HTMLElement;

    private keyUpInsertPageSettingsClickHandler: EventListenerOrEventListenerObject = this.onKeyUpInsertPageSettingsClick.bind(this);

    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private getModuleName(): string {
        return 'PageSetupDialog';
    }
    /**
     * @private
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initPageSetupDialog(locale: L10n, isRtl?: boolean): void {
        this.target = createElement('div');
        this.ejtabContainer = <HTMLDivElement>createElement('div');
        this.target.appendChild(this.ejtabContainer);
        this.marginTab = <HTMLDivElement>createElement('div', {
            styles: 'position: relative;', className: 'e-de-dlg-tab-first-child'
        });
        this.paperTab = <HTMLDivElement>createElement('div', {
            styles: 'position: relative;', className: 'e-de-dlg-tab-first-child'
        });
        this.layoutTab = <HTMLDivElement>createElement('div', {
            styles: 'position: relative;', className: 'e-de-dlg-tab-first-child'
        });
        this.ejtab = <HTMLDivElement>createElement('div', { className: 'e-de-page-setup-ppty-tab' });
        this.headerContainer = <HTMLDivElement>createElement('div', { className: 'e-tab-header' });
        this.marginHeader = <HTMLDivElement>createElement('div', {
            innerHTML: locale.getConstant('Margin')
        });
        this.paperHeader = <HTMLDivElement>createElement('div', {
            innerHTML: locale.getConstant('Paper')
        });
        this.layoutHeader = <HTMLDivElement>createElement('div', {
            innerHTML: locale.getConstant('Layout')
        });
        this.headerContainer.appendChild(this.marginHeader);
        this.headerContainer.appendChild(this.paperHeader);
        this.headerContainer.appendChild(this.layoutHeader);

        this.marginContent = <HTMLDivElement>createElement('div');
        this.paperContent = <HTMLDivElement>createElement('div');
        this.layoutContent = <HTMLDivElement>createElement('div');
        this.marginContent.appendChild(this.marginTab);
        this.paperContent.appendChild(this.paperTab);
        this.layoutContent.appendChild(this.layoutTab);
        this.ejtabContainer.appendChild(this.ejtab);
        this.initMarginProperties(this.marginTab, locale, isRtl);
        this.initPaperSizeProperties(this.paperTab, locale, isRtl);
        this.initLayoutProperties(this.layoutTab, locale, isRtl);
        const items: TabItemModel[] = [
            { header: { text: this.marginHeader }, content: this.marginContent },
            { header: { text: this.paperHeader }, content: this.paperContent },
            { header: { text: this.layoutHeader }, content: this.layoutContent }];
        const tabObj: Tab = new Tab({ items: items, enableRtl: isRtl }, this.ejtab);
        tabObj.isStringTemplate = true;
        this.target.addEventListener('keyup', this.keyUpInsertPageSettingsClickHandler);
    }

    /**
     * @private
     * @param {HTMLDivElement} element - Specifies the div element
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initMarginProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void {
        this.marginDiv = createElement('div') as HTMLDivElement;
        this.leftMarginDiv = createElement('div', { className: 'e-de-container-row' }) as HTMLDivElement;
        this.marginDiv.appendChild(this.leftMarginDiv);
        this.rightMarginDiv = createElement('div', { className: 'e-de-container-row' }) as HTMLDivElement;
        this.marginDiv.appendChild(this.rightMarginDiv);
        if (isRtl) {
            this.leftMarginDiv.classList.add('e-de-rtl');
            this.rightMarginDiv.classList.add('e-de-rtl');
        }

        this.topTextBox = createElement('input', {
            attrs: { 'type': 'text' }
        }) as HTMLInputElement;

        this.bottomTextBox = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });
        this.topContainer = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLDivElement;
        this.topContainer.appendChild(this.topTextBox);
        this.leftMarginDiv.appendChild(this.topContainer);
        this.bottomContainer = createElement('div', { className: 'e-de-subcontainer-right' }) as HTMLDivElement;
        this.bottomContainer.appendChild(this.bottomTextBox);
        this.leftMarginDiv.appendChild(this.bottomContainer);

        this.leftTextBox = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_left'
        });

        this.rightTextBox = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });

        this.leftContainer = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLDivElement;
        this.leftContainer.appendChild(this.leftTextBox);
        this.rightMarginDiv.appendChild(this.leftContainer);
        this.rightContainer = createElement('div', { className: 'e-de-subcontainer-right' }) as HTMLDivElement;
        this.rightContainer.appendChild(this.rightTextBox);
        this.rightMarginDiv.appendChild(this.rightContainer);
        element.appendChild(this.marginDiv);

        this.topMarginBox = new NumericTextBox({ value: 71, max: 1584, min: -1584, width: 170, decimals: 2, floatLabelType: 'Always', placeholder: locale.getConstant('Top') });
        this.topMarginBox.appendTo(this.topTextBox);
        this.leftMarginBox = new NumericTextBox({ value: 73, max: 1584, min: 0, width: 170, decimals: 2, floatLabelType: 'Always', placeholder: locale.getConstant('Left') });
        this.leftMarginBox.appendTo(this.leftTextBox);
        this.bottomMarginBox = new NumericTextBox({ value: 72, max: 1584, min: -1584, width: 170, decimals: 2, floatLabelType: 'Always', placeholder: locale.getConstant('Bottom') });
        this.bottomMarginBox.appendTo(this.bottomTextBox);
        this.rightMarginBox = new NumericTextBox({ value: 74, max: 1584, min: 0, width: 170, decimals: 2, floatLabelType: 'Always', placeholder: locale.getConstant('Right') });
        this.rightMarginBox.appendTo(this.rightTextBox);

        this.orientationDiv = createElement('div') as HTMLDivElement;
        this.orientationLabeldiv = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('Orientation') });
        this.orientationPropDiv = createElement('div', { styles: 'display: flex;' }) as HTMLDivElement;
        this.topTextBox.setAttribute('aria-labelledby', locale.getConstant('Top'));
        this.bottomTextBox.setAttribute('aria-labelledby', locale.getConstant('Bottom'));
        this.leftTextBox.setAttribute('aria-labelledby', locale.getConstant('Left'));
        this.rightTextBox.setAttribute('aria-labelledby', locale.getConstant('Right'));
        let portraitDivStyles: string;
        if (isRtl) {
            portraitDivStyles = 'padding-left: 30px;';
        } else {
            portraitDivStyles = 'padding-right: 30px;';
        }
        this.portraitDiv = createElement('div', { id: '_portraitDiv', styles: portraitDivStyles }) as HTMLDivElement;
        const portrait: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        this.landscapeDiv = createElement('div', { id: '_landscapeDiv' }) as HTMLDivElement;
        const landscape: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        this.portraitDiv.appendChild(portrait); this.landscapeDiv.appendChild(landscape);
        this.orientationPropDiv.appendChild(this.portraitDiv); this.orientationPropDiv.appendChild(this.landscapeDiv);
        this.orientationDiv.appendChild(this.orientationLabeldiv);
        this.orientationDiv.appendChild(this.orientationPropDiv);
        this.portrait = new RadioButton({ label: locale.getConstant('Portrait'), checked: true, enableRtl: isRtl, change: this.onPortrait });
        this.landscape = new RadioButton({ label: locale.getConstant('Landscape'), enableRtl: isRtl, change: this.onLandscape });
        this.portrait.appendTo(portrait); this.landscape.appendTo(landscape);
        element.appendChild(this.orientationDiv);
        portrait.setAttribute('aria-label', locale.getConstant('Portrait'));
        landscape.setAttribute('aria-label', locale.getConstant('Landscape'));
    }
    /**
     * @private
     * @param {HTMLDivElement} element - Specifies the div element
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initPaperSizeProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void {
        this.sizeDiv = createElement('div', {
            className: 'e-de-container-row'
        }) as HTMLDivElement;
        this.leftSizeDiv = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLDivElement;
        this.sizeDiv.appendChild(this.leftSizeDiv);
        this.rightSizeDiv = createElement('div', { className: 'e-de-subcontainer-right' }) as HTMLDivElement;
        this.sizeDiv.appendChild(this.rightSizeDiv);
        if (isRtl) {
            this.leftSizeDiv.classList.add('e-de-rtl');
            this.rightSizeDiv.classList.add('e-de-rtl');
        }

        // const widthLabel: HTMLLabelElement = createElement('label', {
        //     innerHTML: locale.getConstant('Width'), className: 'e-de-page-setup-dlg-sub-header',
        //     id: this.target.id + '_widthLabel', styles: 'padding-top:0px;'
        // }) as HTMLLabelElement;
        this.widthTextBox = createElement('input', {
            attrs: { 'type': 'text' }
        }) as HTMLInputElement;

        //leftSizeDiv.appendChild(widthLabel);
        this.leftSizeDiv.appendChild(this.widthTextBox);

        // const heightLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
        //     innerHTML: locale.getConstant('Height'), className: 'e-de-page-setup-dlg-sub-header', styles: 'padding-top:0px;',
        //     id: this.target.id + '_heightLabel'
        // });
        this.heightTextBox = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });
        //rightSizeDiv.appendChild(heightLabel);
        this.rightSizeDiv.appendChild(this.heightTextBox);
        element.appendChild(this.sizeDiv);

        this.widthBox = new NumericTextBox({ value: 612, width: 170, decimals: 2, floatLabelType: 'Always', placeholder:  locale.getConstant('Width')});
        this.widthBox.appendTo(this.widthTextBox);
        this.heightBox = new NumericTextBox({ value: 792, width: 170, decimals: 2,  floatLabelType: 'Always', placeholder:  locale.getConstant('Height') });
        this.heightBox.appendTo(this.heightTextBox);
        this.widthTextBox.setAttribute('arial-label', locale.getConstant('Width'));
        this.heightTextBox.setAttribute('arial-label', locale.getConstant('Height'));
        this.paperSizeDiv = <HTMLDivElement>createElement('div');
        const paperSize: HTMLElement = createElement('select', {
            styles: 'width:170px;padding-bottom: 20px;',
            innerHTML: '<option value="letter">' + locale.getConstant('Letter') +
                '</option><option value="tabloid">' + locale.getConstant('Tabloid') +
                '</option><option value="legal">' + locale.getConstant('Legal') +
                '</option><option value="statement">' + locale.getConstant('Statement') +
                '</option><option value="executive">' + locale.getConstant('Executive') +
                '</option><option value="a3">' + locale.getConstant('A3') +
                '</option><option value="a4">' + locale.getConstant('A4') +
                '</option><option value="a5">' + locale.getConstant('A5') +
                '</option><option value="b4">' + locale.getConstant('B4') +
                '</option><option value="b5">' + locale.getConstant('B5') +
                '</option><option value="customsize">' + locale.getConstant('Custom Size') + '</option>'
        }) as HTMLSelectElement;
        this.paperSizeDiv.appendChild(paperSize);
        this.paperSize = new DropDownList({ change: this.changeByPaperSize, width: '170px', enableRtl: isRtl });
        this.paperSize.appendTo(paperSize);
        this.paperSize.htmlAttributes = { 'aria-labelledby': 'PaperSize', 'aria-describedby': 'PaperSize' };
        element.appendChild(this.paperSizeDiv);
    }
    /**
     * @private
     * @param {HTMLDivElement} element - Specifies the div element
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initLayoutProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void {
        this.layoutDiv = <HTMLDivElement>createElement('div', { className: 'e-de-dlg-container' });
        this.firstPageDiv = createElement('div', { styles: 'height: 27px;' }) as HTMLDivElement;
        const checkBox1: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }
        });
        this.firstPageDiv.appendChild(checkBox1);
        this.oddOrEvenDiv = createElement('div', { styles: 'height: 27px;' }) as HTMLDivElement;
        const checkBox2: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }
        });
        this.firstPageDiv.setAttribute('aria-label', locale.getConstant('Different first page'));
        this.oddOrEvenDiv.setAttribute('aria-label', locale.getConstant('Different odd and even'));
        this.oddOrEvenDiv.appendChild(checkBox2);
        this.layoutDiv.appendChild(this.firstPageDiv); this.layoutDiv.appendChild(this.oddOrEvenDiv);

        this.checkBox1 = new CheckBox({ label: locale.getConstant('Different odd and even'), enableRtl: isRtl });
        this.checkBox2 = new CheckBox({ label: locale.getConstant('Different first page'), enableRtl: isRtl });
        this.checkBox1.appendTo(checkBox1); this.checkBox2.appendTo(checkBox2);
        element.appendChild(this.layoutDiv);

        this.textLabelDiv = createElement('div') as HTMLDivElement;
        this.textLabel = <HTMLLabelElement>createElement('label', { className: 'e-de-para-dlg-heading', innerHTML: locale.getConstant('From edge')
        });
        this.textLabelDiv.appendChild(this.textLabel);
        element.appendChild(this.textLabelDiv);

        this.propertyDiv = createElement('div', { className: 'e-de-dlg-row' }) as HTMLDivElement;
        this.leftLayoutDiv = createElement('div', { className: 'e-de-subcontainer-left' }) as HTMLDivElement;
        this.propertyDiv.appendChild(this.leftLayoutDiv);
        this.rightLayoutDiv = createElement('div', { className: 'e-de-subcontainer-right' }) as HTMLDivElement;
        this.propertyDiv.appendChild(this.rightLayoutDiv);
        if (isRtl) {
            this.rightLayoutDiv.classList.add('e-de-rtl');
            this.leftLayoutDiv.classList.add('e-de-rtl');
        }

        const headerBox: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text' }
        }) as HTMLInputElement;

        this.leftLayoutDiv.appendChild(headerBox);

        const footerBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });
        this.rightLayoutDiv.appendChild(footerBox);
        element.appendChild(this.propertyDiv);

        this.headerBox = new NumericTextBox({ value: 612, width: 170, decimals: 2, floatLabelType: 'Always', placeholder: locale.getConstant('Header') });
        this.headerBox.appendTo(headerBox);
        this.footerBox = new NumericTextBox({ value: 792, width: 170, decimals: 2, floatLabelType: 'Always', placeholder: locale.getConstant('Footer') });
        this.footerBox.appendTo(footerBox);
        headerBox.setAttribute('aria-labelledby', locale.getConstant('Header'));
        footerBox.setAttribute('aria-labelledby', locale.getConstant('Footer'));
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initPageSetupDialog(localValue, this.documentHelper.owner.enableRtl);
        }
        this.documentHelper.dialog.header = localValue.getConstant('Page Setup');
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.loadPageSetupDialog;
        this.documentHelper.dialog.close = this.closePageSetupDialog;

        this.documentHelper.dialog.buttons = [{
            click: this.applyPageSetupProperties,
            buttonModel: { content: localValue.getConstant('Ok'), cssClass: 'e-flat e-layout-ppty-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-layout-ppty-cancel' }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
        this.dialogElement = this.documentHelper.dialog.element;
        if (this.dialogElement) {
            this.documentHelper.updateDialogTabHeight(this.dialogElement, this.target);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public loadPageSetupDialog = (): void => {
        this.documentHelper.updateFocus();
        const sectionFormat: SelectionSectionFormat = this.documentHelper.selection.sectionFormat;
        this.topMarginBox.value = sectionFormat.topMargin;
        this.leftMarginBox.value = sectionFormat.leftMargin;
        this.bottomMarginBox.value = sectionFormat.bottomMargin;
        this.rightMarginBox.value = sectionFormat.rightMargin;
        this.widthBox.value = sectionFormat.pageWidth;
        this.heightBox.value = sectionFormat.pageHeight;
        this.checkBox1.checked = sectionFormat.differentOddAndEvenPages;
        this.checkBox2.checked = sectionFormat.differentFirstPage;
        this.headerBox.value = sectionFormat.headerDistance;
        this.footerBox.value = sectionFormat.footerDistance;
        if (this.widthBox.value > this.heightBox.value) {
            this.landscape.checked = true;
        } else {
            this.portrait.checked = true;
        }
        /* eslint-disable-next-line max-len */
        this.setPageSize(this.portrait.checked, parseFloat(sectionFormat.pageWidth.toFixed(1)), parseFloat(sectionFormat.pageHeight.toFixed(1)));
    };
    private setPageSize(isPortrait: boolean, width: number, height: number): void {
        if ((isPortrait && width === 612 && height === 792)
            || (!isPortrait && width === 792 && height === 612)) {
            this.paperSize.value = 'letter';
        } else if ((isPortrait && width === 792 && height === 1224)
            || (!isPortrait && width === 1224 && height === 792)) {
            this.paperSize.value = 'tabloid';
        } else if ((isPortrait && width === 612 && height === 1008)
            || (!isPortrait && width === 1008 && height === 612)) {
            this.paperSize.value = 'legal';
        } else if ((isPortrait && width === 392 && height === 612)
            || (!isPortrait && width === 392 && height === 612)) {
            this.paperSize.value = 'statement';
        } else if ((isPortrait && width === 522 && height === 756)
            || (!isPortrait && width === 756 && height === 522)) {
            this.paperSize.value = 'executive';
        } else if ((isPortrait && width === 841.9 && height === 1190.5)
            || (!isPortrait && width === 1190.5 && height === 841.9)) {
            this.paperSize.value = 'a3';
        } else if ((isPortrait && width === 595.3 && height === 841.9)
            || (!isPortrait && width === 841.9 && height === 595.3)) {
            this.paperSize.value = 'a4';
        } else if ((isPortrait && width === 419.6 && height === 595.3)
            || (!isPortrait && width === 595.3 && height === 419.6)) {
            this.paperSize.value = 'a5';
        } else if ((isPortrait && width === 728.5 && height === 1031.8)
            || (!isPortrait && width === 1031.8 && height === 728.5)) {
            this.paperSize.value = 'b4';
        } else if ((isPortrait && width === 515.9 && height === 728.5)
            || (!isPortrait && width === 728.5 && height === 515.9)) {
            this.paperSize.value = 'b5';
        } else {
            this.paperSize.value = 'customsize';
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public closePageSetupDialog = (): void => {
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
    private onKeyUpInsertPageSettingsClick(event: KeyboardEvent): void {
        this.keyUpInsertPageSettings(event);
    }
    /**
     * @private
     * @param {KeyboardEvent} event - Specifies the event args.
     * @returns {void}
     */
    public keyUpInsertPageSettings = (event: KeyboardEvent): void => {
        if (event.keyCode === 13) {
            this.applyPageSetupProperties();
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public applyPageSetupProperties = (): void => {
        const sectionFormat: WSectionFormat = new WSectionFormat();
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        const currentSectionFormat: SelectionSectionFormat = this.documentHelper.selection.sectionFormat;
        sectionFormat.bottomMargin = this.bottomMarginBox.value;
        sectionFormat.topMargin = this.topMarginBox.value;
        sectionFormat.leftMargin = this.leftMarginBox.value;
        sectionFormat.rightMargin = this.rightMarginBox.value;
        sectionFormat.pageWidth = this.widthBox.value;
        sectionFormat.pageHeight = this.heightBox.value;
        sectionFormat.differentOddAndEvenPages = this.checkBox1.checked;
        sectionFormat.differentFirstPage = this.checkBox2.checked;
        sectionFormat.headerDistance = this.headerBox.value;
        sectionFormat.footerDistance = this.footerBox.value;
        if (this.widthBox.value < (this.leftMarginBox.value + this.rightMarginBox.value)) {
            DialogUtility.alert(localValue.getConstant('Left and right margins.'));
            return;
        }
        if (this.widthBox.value < (this.leftMarginBox.value + this.rightMarginBox.value + 36)) {
            DialogUtility.alert(localValue.getConstant('Column width cannot be less than 36 pt.'));
            return;
        }
        if (Math.abs((this.topMarginBox.value + this.bottomMarginBox.value)) > this.heightBox.value) {
            DialogUtility.alert(localValue.getConstant('The top/bottom margins are too large for the page height in some sections.'));
            return;
        }
        sectionFormat.numberOfColumns = currentSectionFormat.numberOfColumns;
        sectionFormat.equalWidth = currentSectionFormat.equalWidth;
        sectionFormat.lineBetweenColumns = currentSectionFormat.lineBetweenColumns;
        const cols: WColumnFormat[] = [];
        const pageWidth: number = HelperMethods.convertPointToPixel(
            sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
        for (let i: number = 0; i < currentSectionFormat.columns.length; i++) {
            const colFormat: WColumnFormat = new WColumnFormat();
            let width: number = HelperMethods.convertPointToPixel(currentSectionFormat.columns[parseInt(i.toString(), 10)].width);
            const space: number = HelperMethods.convertPointToPixel(currentSectionFormat.columns[parseInt(i.toString(), 10)].space);
            const totalSpace: number = (currentSectionFormat.numberOfColumns - 1) * space;
            if ((currentSectionFormat.equalWidth || width === 0) && !isNullOrUndefined(pageWidth)) {
                width = (pageWidth - totalSpace) / currentSectionFormat.numberOfColumns;
            }
            colFormat.width = width;
            colFormat.space = space;
            colFormat.index = i;
            cols.push(colFormat);
        }
        sectionFormat.columns = cols;
        if (currentSectionFormat.pageHeight === sectionFormat.pageHeight && currentSectionFormat.pageWidth === sectionFormat.pageWidth) {
            sectionFormat.breakCode = currentSectionFormat.breakCode;
        }
        this.documentHelper.owner.editorModule.onApplySectionFormat(undefined, sectionFormat);
        this.documentHelper.hideDialog();
    };
    /**
     * @private
     * @param {ChangeEventArgs} event - Specifies the event args.
     * @returns {void}
     */
    public changeByPaperSize = (event: ChangeEventArgs): void => {
        const value: string = event.value as string;
        // const sectionFormat: SelectionSectionFormat = this.documentHelper.selection.sectionFormat;
        // const width: number = sectionFormat.pageWidth;
        // const height: number = sectionFormat.pageHeight;
        /* eslint-disable-next-line max-len */
        if (this.documentHelper.selection.sectionFormat.pageWidth > this.documentHelper.selection.sectionFormat.pageHeight || this.landscape.checked) {
            this.isPortrait = false; this.portrait.checked = false;
        } else {
            this.isPortrait = true;
        }
        if (value === 'letter') {
            if (this.isPortrait) {
                this.widthBox.value = 612;
                this.heightBox.value = 792;
            } else {
                this.widthBox.value = 792;
                this.heightBox.value = 612;
            }
        } else if (value === 'tabloid') {
            if (this.isPortrait) {
                this.widthBox.value = 792;
                this.heightBox.value = 1224;
            } else {
                this.widthBox.value = 1224;
                this.heightBox.value = 792;
            }
        } else if (value === 'legal') {
            if (this.isPortrait) {
                this.widthBox.value = 612;
                this.heightBox.value = 1008;
            } else {
                this.widthBox.value = 1008;
                this.heightBox.value = 612;
            }
        } else if (value === 'statement') {
            if (this.isPortrait) {
                this.widthBox.value = 392;
                this.heightBox.value = 612;
            } else {
                this.widthBox.value = 612;
                this.heightBox.value = 392;
            }
        } else if (value === 'executive') {
            if (this.isPortrait) {
                this.widthBox.value = 522;
                this.heightBox.value = 756;
            } else {
                this.widthBox.value = 756;
                this.heightBox.value = 522;
            }
        } else if (value === 'a3') {
            if (this.isPortrait) {
                this.widthBox.value = 841.9;
                this.heightBox.value = 1190.55;
            } else {
                this.widthBox.value = 1190.55;
                this.heightBox.value = 841.9;
            }
        } else if (value === 'a4') {
            if (this.isPortrait) {
                this.widthBox.value = 595.3;
                this.heightBox.value = 841.9;
            } else {
                this.widthBox.value = 841.9;
                this.heightBox.value = 595.3;
            }
        } else if (value === 'a5') {
            if (this.isPortrait) {
                this.widthBox.value = 419.55;
                this.heightBox.value = 595.3;
            } else {
                this.widthBox.value = 595.3;
                this.heightBox.value = 419.55;
            }
        } else if (value === 'b4') {
            if (this.isPortrait) {
                this.widthBox.value = 728.5;
                this.heightBox.value = 1031.8;
            } else {
                this.widthBox.value = 1031.8;
                this.heightBox.value = 728.5;
            }
        } else if (value === 'b5') {
            if (this.isPortrait) {
                this.widthBox.value = 515.9;
                this.heightBox.value = 728.5;
            } else {
                this.widthBox.value = 728.5;
                this.heightBox.value = 515.9;
            }
        } else if (value === 'customsize') {
            if (this.isPortrait) {
                this.widthBox.value = this.documentHelper.selection.sectionFormat.pageWidth;
                this.heightBox.value = this.documentHelper.selection.sectionFormat.pageHeight;
            } else {
                this.widthBox.value = this.documentHelper.selection.sectionFormat.pageWidth;
                this.heightBox.value =  this.documentHelper.selection.sectionFormat.pageHeight;
            }
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public onPortrait = (): void => {
        this.landscape.checked = false;
        const width: number = this.widthBox.value;
        const height: number = this.heightBox.value;
        if (width > height) {
            this.widthBox.value = height;
            this.heightBox.value = width;
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public onLandscape = (): void => {
        this.portrait.checked = false;
        const width: number = this.widthBox.value;
        const height: number = this.heightBox.value;
        if (width < height) {
            this.widthBox.value = height;
            this.heightBox.value = width;
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public unWireEventsAndBindings = (): void => {
        this.paperSize.value = undefined;
        this.topMarginBox.value = undefined;
        this.bottomMarginBox.value = undefined;
        this.leftMarginBox.value = undefined;
        this.rightMarginBox.value = undefined;
        this.headerBox.value = undefined;
        this.footerBox.value = undefined;
        this.widthBox.value = undefined;
        this.heightBox.value = undefined;
        this.checkBox1.checked = false;
        this.checkBox2.checked = false;
        this.portrait.checked = false;
        this.landscape.checked = false;
    };
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.topMarginBox) {
            this.topMarginBox.destroy();
            this.topMarginBox = undefined;
        }
        if (this.leftMarginBox) {
            this.leftMarginBox.destroy();
            this.leftMarginBox = undefined;
        }
        if (this.bottomMarginBox) {
            this.bottomMarginBox.destroy();
            this.bottomMarginBox = undefined;
        }
        if (this.rightMarginBox) {
            this.rightMarginBox.destroy();
            this.rightMarginBox = undefined;
        }
        if (this.headerBox) {
            this.headerBox.destroy();
            this.headerBox = undefined;
        }
        if (this.footerBox) {
            this.footerBox.destroy();
            this.footerBox = undefined;
        }
        if (this.widthBox) {
            this.widthBox.destroy();
            this.widthBox = undefined;
        }
        if (this.heightBox) {
            this.heightBox.destroy();
            this.heightBox = undefined;
        }
        if (this.paperSize) {
            this.paperSize.destroy();
            this.paperSize = undefined;
        }
        if (this.checkBox1) {
            this.checkBox1.destroy();
            this.checkBox1 = undefined;
        }
        if (this.checkBox2) {
            this.checkBox2.destroy();
            this.checkBox2 = undefined;
        }
        if (this.portrait) {
            this.portrait.destroy();
            this.portrait = undefined;
        }
        if (this.landscape) {
            this.landscape.destroy();
            this.landscape = undefined;
        }
        this.documentHelper = undefined;
        this.removeEvents();
        this.removeElements();
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let s: number = 0; s < this.target.childNodes.length; s++) {
                this.target.removeChild(this.target.childNodes[parseInt(s.toString(), 10)]);
                s--;
            }
            this.target = undefined;
        }
    }
    private removeEvents(): void {
        if (this.target) {
            this.target.removeEventListener('keyup', this.keyUpInsertPageSettingsClickHandler);
        }
    }
    private removeElements(): void {
        if (this.ejtabContainer) {
            this.ejtabContainer.remove();
            this.ejtabContainer = undefined;
        }
        if (this.marginTab) {
            this.marginTab.remove();
            this.marginTab = undefined;
        }
        if (this.paperTab) {
            this.paperTab.remove();
            this.paperTab = undefined;
        }
        if (this.layoutTab) {
            this.layoutTab.remove();
            this.layoutTab = undefined;
        }
        if (this.ejtab) {
            this.ejtab.remove();
            this.ejtab = undefined;
        }
        if (this.headerContainer) {
            this.headerContainer.remove();
            this.headerContainer = undefined;
        }
        if (this.marginHeader) {
            this.marginHeader.remove();
            this.marginHeader = undefined;
        }
        if (this.paperHeader) {
            this.paperHeader.remove();
            this.paperHeader = undefined;
        }
        if (this.layoutHeader) {
            this.layoutHeader.remove();
            this.layoutHeader = undefined;
        }
        if (this.marginContent) {
            this.marginContent.remove();
            this.marginContent = undefined;
        }
        if (this.paperContent) {
            this.paperContent.remove();
            this.paperContent = undefined;
        }
        if (this.layoutContent) {
            this.layoutContent.remove();
            this.layoutContent = undefined;
        }
        if (this.marginDiv) {
            this.marginDiv.remove();
            this.marginDiv = undefined;
        }
        if (this.leftMarginDiv) {
            this.leftMarginDiv.remove();
            this.leftMarginDiv = undefined;
        }
        if (this.rightMarginDiv) {
            this.rightMarginDiv.remove();
            this.rightMarginDiv = undefined;
        }
        if (this.topTextBox) {
            this.topTextBox.remove();
            this.topTextBox = undefined;
        }
        if (this.bottomTextBox) {
            this.bottomTextBox.remove();
            this.bottomTextBox = undefined;
        }
        if (this.topContainer) {
            this.topContainer.remove();
            this.topContainer = undefined;
        }
        if (this.bottomContainer) {
            this.bottomContainer.remove();
            this.bottomContainer = undefined;
        }
        if (this.leftTextBox) {
            this.leftTextBox.remove();
            this.leftTextBox = undefined;
        }
        if (this.rightTextBox) {
            this.rightTextBox.remove();
            this.rightTextBox = undefined;
        }
        if (this.leftContainer) {
            this.leftContainer.remove();
            this.leftContainer = undefined;
        }
        if (this.rightContainer) {
            this.rightContainer.remove();
            this.rightContainer = undefined;
        }
        if (this.orientationDiv) {
            this.orientationDiv.remove();
            this.orientationDiv = undefined;
        }
        if (this.orientationLabeldiv) {
            this.orientationLabeldiv.remove();
            this.orientationLabeldiv = undefined;
        }
        if (this.orientationPropDiv) {
            this.orientationPropDiv.remove();
            this.orientationPropDiv = undefined;
        }
        if (this.portraitDiv) {
            this.portraitDiv.remove();
            this.portraitDiv = undefined;
        }
        if (this.landscapeDiv) {
            this.landscapeDiv.remove();
            this.landscapeDiv = undefined;
        }
        if (this.portrait) {
            this.portrait.destroy();
            this.portrait = undefined;
        }
        if (this.landscape) {
            this.landscape.destroy();
            this.landscape = undefined;
        }
        if (this.sizeDiv) {
            this.sizeDiv.remove();
            this.sizeDiv = undefined;
        }
        if (this.leftSizeDiv) {
            this.leftSizeDiv.remove();
            this.leftSizeDiv = undefined;
        }
        if (this.rightSizeDiv) {
            this.rightSizeDiv.remove();
            this.rightSizeDiv = undefined;
        }
        if (this.widthTextBox) {
            this.widthTextBox.remove();
            this.widthTextBox = undefined;
        }
        if (this.heightTextBox) {
            this.heightTextBox.remove();
            this.heightTextBox = undefined;
        }
        if (this.sizeDiv) {
            this.sizeDiv.remove();
            this.sizeDiv = undefined;
        }
        if (this.paperSizeDiv) {
            this.paperSizeDiv.remove();
            this.paperSizeDiv = undefined;
        }
        if (this.layoutDiv) {
            this.layoutDiv.remove();
            this.layoutDiv = undefined;
        }
        if (this.firstPageDiv) {
            this.firstPageDiv.remove();
            this.firstPageDiv = undefined;
        }
        if (this.oddOrEvenDiv) {
            this.oddOrEvenDiv.remove();
            this.oddOrEvenDiv = undefined;
        }
        if (this.textLabelDiv) {
            this.textLabelDiv.remove();
            this.textLabelDiv = undefined;
        }
        if (this.propertyDiv) {
            this.propertyDiv.remove();
            this.propertyDiv = undefined;
        }
        if (this.leftLayoutDiv) {
            this.leftLayoutDiv.remove();
            this.leftLayoutDiv = undefined;
        }
        if (this.rightLayoutDiv) {
            this.rightLayoutDiv.remove();
            this.rightLayoutDiv = undefined;
        }
        if (this.dialogElement) {
            this.dialogElement.remove();
            this.dialogElement = undefined;
        }
    }
}
