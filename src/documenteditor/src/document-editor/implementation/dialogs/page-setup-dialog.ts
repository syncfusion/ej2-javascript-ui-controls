import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { SelectionSectionFormat } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WSectionFormat } from './../../implementation/format/index';
import { Tab, TabItemModel } from '@syncfusion/ej2-navigations';
import { DocumentHelper } from '../viewer';

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
        const id: string = this.documentHelper.owner.containerId + '_pagesetup_dialog';
        this.target = createElement('div', { id: id, className: 'e-de-pagesetup-dlg-container' });
        const ejtabContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_MarginTabContainer' });
        this.target.appendChild(ejtabContainer);
        this.marginTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_marginPropertyTab', styles: 'position: relative;'
        });
        this.paperTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_paperSizePropertyTab', styles: 'position: relative;'
        });
        this.layoutTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_CellPropertiesDialogTab', styles: 'position: relative;'
        });
        const ejtab: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_PageSetupDialogTab', className: 'e-de-page-setup-ppty-tab' });
        const headerContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-tab-header' });
        const marginHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_marginHeader', innerHTML: locale.getConstant('Margin')
        });
        const paperHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_paperHeader', innerHTML: locale.getConstant('Paper')
        });
        const layoutHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_layoutHeader', innerHTML: locale.getConstant('Layout')
        });
        headerContainer.appendChild(marginHeader);
        headerContainer.appendChild(paperHeader);
        headerContainer.appendChild(layoutHeader);

        const marginContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_marginContent' });
        const paperContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_paperContent' });
        const layoutContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_layoutContent' });
        marginContent.appendChild(this.marginTab);
        paperContent.appendChild(this.paperTab);
        layoutContent.appendChild(this.layoutTab);
        ejtabContainer.appendChild(ejtab);
        this.initMarginProperties(this.marginTab, locale, isRtl);
        this.initPaperSizeProperties(this.paperTab, locale, isRtl);
        this.initLayoutProperties(this.layoutTab, locale, isRtl);
        const items: TabItemModel[] = [
            { header: { text: marginHeader }, content: marginContent },
            { header: { text: paperHeader }, content: paperContent },
            { header: { text: layoutHeader }, content: layoutContent }];
        const tabObj: Tab = new Tab({ items: items, enableRtl: isRtl }, ejtab);
        tabObj.isStringTemplate = true;
        this.target.addEventListener('keyup', this.keyUpInsertPageSettings);
    }

    /**
     * @private
     * @param {HTMLDivElement} element - Specifies the div element
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initMarginProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void {
        const marginDiv: HTMLDivElement = createElement('div', {
            id: 'margin_div',
            className: 'e-de-page-setup-dlg-sub-container', styles: 'height:135px;'
        }) as HTMLDivElement;
        const leftMarginDiv: HTMLDivElement = createElement('div', { id: 'left_margin', className: 'e-de-page-setup-dlg-left-sub-container' }) as HTMLDivElement;
        marginDiv.appendChild(leftMarginDiv);
        const rightMarginDiv: HTMLDivElement = createElement('div', { className: 'e-de-page-setup-dlg-right-sub-container' }) as HTMLDivElement;
        marginDiv.appendChild(rightMarginDiv);
        if (isRtl) {
            leftMarginDiv.classList.add('e-de-rtl');
            rightMarginDiv.classList.add('e-de-rtl');
        }

        const topLabel: HTMLLabelElement = createElement('label', {
            innerHTML: locale.getConstant('Top'), className: 'e-de-page-setup-dlg-sub-header',
            id: this.target.id + '_TopLabel', styles: 'padding-top:0px;'
        }) as HTMLLabelElement;
        const topTextBox: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_Top'
        }) as HTMLInputElement;
        const bottomBoxLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Bottom'),
            className: 'e-de-page-setup-dlg-sub-title-header', id: this.target.id + '_bottomLabel'
        });
        const bottomTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' },
            id: this.target.id + '_bottom'
        });
        leftMarginDiv.appendChild(topLabel);
        leftMarginDiv.appendChild(topTextBox);
        leftMarginDiv.appendChild(bottomBoxLabel);
        leftMarginDiv.appendChild(bottomTextBox);
        const leftBoxLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Left'), className: 'e-de-page-setup-dlg-sub-header', styles: 'padding-top:0px;',
            id: this.target.id + '_leftLabel'
        });
        const leftTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_left'
        });
        const rightLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Right'),
            id: this.target.id + '_rightLabel', className: 'e-de-page-setup-dlg-sub-title-header'
        });
        const rightTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' },
            id: this.target.id + '_right'
        });
        rightMarginDiv.appendChild(leftBoxLabel);
        rightMarginDiv.appendChild(leftTextBox);
        rightMarginDiv.appendChild(rightLabel);
        rightMarginDiv.appendChild(rightTextBox);
        element.appendChild(marginDiv);

        this.topMarginBox = new NumericTextBox({ value: 71, width: 170, decimals: 2 });
        this.topMarginBox.appendTo(topTextBox);
        this.leftMarginBox = new NumericTextBox({ value: 73, width: 170, decimals: 2 });
        this.leftMarginBox.appendTo(leftTextBox);
        this.bottomMarginBox = new NumericTextBox({ value: 72, width: 170, decimals: 2 });
        this.bottomMarginBox.appendTo(bottomTextBox);
        this.rightMarginBox = new NumericTextBox({ value: 74, width: 170, decimals: 2 });
        this.rightMarginBox.appendTo(rightTextBox);

        const orientationDiv: HTMLDivElement = createElement('div', { id: 'orientation_div', className: 'e-de-page-setup-dlg-sub-container-port' }) as HTMLDivElement;
        const orientationLabeldiv: HTMLElement = createElement('div', { id: '_orientationLabelDiv', className: 'e-de-page-setup-dlg-sub-label', innerHTML: locale.getConstant('Orientation') });
        const orientationPropDiv: HTMLDivElement = createElement('div', { id: '_orientationPropDiv', styles: 'display: flex;', className: 'e-de-page-setup-dlg-orientation-prop' }) as HTMLDivElement;
        let portraitDivStyles: string;
        if (isRtl) {
            portraitDivStyles = 'padding-left: 30px;';
        } else {
            portraitDivStyles = 'padding-right: 30px;';
        }
        const portraitDiv: HTMLDivElement = createElement('div', { id: '_portraitDiv', styles: portraitDivStyles }) as HTMLDivElement;
        const portrait: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }, id: this.target.id + '_portrait'
        });
        const landscapeDiv: HTMLDivElement = createElement('div', { id: '_landscapeDiv' }) as HTMLDivElement;
        const landscape: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }, id: this.target.id + '_landscape'
        });
        portraitDiv.appendChild(portrait); landscapeDiv.appendChild(landscape);
        orientationPropDiv.appendChild(portraitDiv); orientationPropDiv.appendChild(landscapeDiv);
        orientationDiv.appendChild(orientationLabeldiv);
        orientationDiv.appendChild(orientationPropDiv);
        this.portrait = new RadioButton({ label: locale.getConstant('Portrait'), checked: true, enableRtl: isRtl, change: this.onPortrait });
        this.landscape = new RadioButton({ label: locale.getConstant('Landscape'), enableRtl: isRtl, change: this.onLandscape });
        this.portrait.appendTo(portrait); this.landscape.appendTo(landscape);
        element.appendChild(orientationDiv);
    }
    /**
     * @private
     * @param {HTMLDivElement} element - Specifies the div element
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initPaperSizeProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void {
        const sizeDiv: HTMLDivElement = createElement('div', {
            id: 'size_div',
            className: 'e-de-page-setup-dlg-sub-size-container'
        }) as HTMLDivElement;
        const leftSizeDiv: HTMLDivElement = createElement('div', { id: 'left_size', className: 'e-de-page-setup-dlg-left-sub-container' }) as HTMLDivElement;
        sizeDiv.appendChild(leftSizeDiv);
        const rightSizeDiv: HTMLDivElement = createElement('div', { className: 'e-de-page-setup-dlg-right-sub-container' }) as HTMLDivElement;
        sizeDiv.appendChild(rightSizeDiv);
        if (isRtl) {
            leftSizeDiv.classList.add('e-de-rtl');
            rightSizeDiv.classList.add('e-de-rtl');
        }

        const widthLabel: HTMLLabelElement = createElement('label', {
            innerHTML: locale.getConstant('Width'), className: 'e-de-page-setup-dlg-sub-header',
            id: this.target.id + '_widthLabel', styles: 'padding-top:0px;'
        }) as HTMLLabelElement;
        const widthTextBox: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_Width'
        }) as HTMLInputElement;

        leftSizeDiv.appendChild(widthLabel);
        leftSizeDiv.appendChild(widthTextBox);

        const heightLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Height'), className: 'e-de-page-setup-dlg-sub-header', styles: 'padding-top:0px;',
            id: this.target.id + '_heightLabel'
        });
        const heightTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_height'
        });
        rightSizeDiv.appendChild(heightLabel);
        rightSizeDiv.appendChild(heightTextBox);
        element.appendChild(sizeDiv);

        this.widthBox = new NumericTextBox({ value: 612, width: 170, decimals: 2 });
        this.widthBox.appendTo(widthTextBox);
        this.heightBox = new NumericTextBox({ value: 792, width: 170, decimals: 2 });
        this.heightBox.appendTo(heightTextBox);
        const paperSizeDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { id: '_paperSizeDiv', styles: 'height:37px;', className: 'e-de-page-setup-dlg-sub-container' });
        const paperSize: HTMLElement = createElement('select', {
            id: this.target.id + '_papersize', styles: 'width:170px;padding-bottom: 20px;',
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
        paperSizeDiv.appendChild(paperSize);
        this.paperSize = new DropDownList({ change: this.changeByPaperSize, width: '170px', enableRtl: isRtl });
        this.paperSize.appendTo(paperSize);
        element.appendChild(paperSizeDiv);
    }
    /**
     * @private
     * @param {HTMLDivElement} element - Specifies the div element
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initLayoutProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void {
        const layoutDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { id: '_layoutDiv', className: 'e-de-page-setup-dlg-layout-sub-container' });
        const firstPageDiv: HTMLDivElement = createElement('div', { id: '_firstPageDiv', styles: 'height: 27px;', className: 'e-de-page-setup-dlg-first-page-prop' }) as HTMLDivElement;
        const checkBox1: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_oddoreven'
        });
        firstPageDiv.appendChild(checkBox1);
        const oddOrEvenDiv: HTMLDivElement = createElement('div', { id: '_oddOrEvenDiv', styles: 'height: 27px;', className: 'e-de-page-setup-dlg-odd-or-even-prop' }) as HTMLDivElement;
        const checkBox2: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_even'
        });
        oddOrEvenDiv.appendChild(checkBox2);
        layoutDiv.appendChild(firstPageDiv); layoutDiv.appendChild(oddOrEvenDiv);

        this.checkBox1 = new CheckBox({ label: locale.getConstant('Different odd and even'), enableRtl: isRtl });
        this.checkBox2 = new CheckBox({ label: locale.getConstant('Different first page'), enableRtl: isRtl });
        this.checkBox1.appendTo(checkBox1); this.checkBox2.appendTo(checkBox2);
        element.appendChild(layoutDiv);

        const textLabelDiv: HTMLDivElement = createElement('div', { id: '_textLabelDiv', className: 'e-de-page-setup-dlg-sub-label' }) as HTMLDivElement;
        const textLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('From edge'), id: this.target.id + '_textLabel'
        });
        textLabelDiv.appendChild(textLabel);
        element.appendChild(textLabelDiv);

        const propertyDiv: HTMLDivElement = createElement('div', { id: '_headerFooeterPropDiv', className: 'e-de-page-setup-dlg-sub-container', styles: 'height: 65px;' }) as HTMLDivElement;
        const leftLayoutDiv: HTMLDivElement = createElement('div', { id: '_leftLayoutDiv', className: 'e-de-page-setup-dlg-left-layout-container' }) as HTMLDivElement;
        propertyDiv.appendChild(leftLayoutDiv);
        const rightLayoutDiv: HTMLDivElement = createElement('div', { className: 'e-de-page-setup-dlg-right-layout-container' }) as HTMLDivElement;
        propertyDiv.appendChild(rightLayoutDiv);
        if (isRtl) {
            rightLayoutDiv.classList.add('e-de-rtl');
            leftLayoutDiv.classList.add('e-de-rtl');
        }

        const headerLabel: HTMLLabelElement = createElement('label', {
            innerHTML: locale.getConstant('Header'), className: 'e-de-page-setup-dlg-sub-header',
            id: this.target.id + '_headerLabel', styles: 'padding-top:0px;'
        }) as HTMLLabelElement;
        const headerBox: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_header'
        }) as HTMLInputElement;

        leftLayoutDiv.appendChild(headerLabel);
        leftLayoutDiv.appendChild(headerBox);

        const footerLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Footer'), className: 'e-de-page-setup-dlg-sub-header', styles: 'padding-top:0px;',
            id: this.target.id + '_footerLabel'
        });
        const footerBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_footer'
        });
        rightLayoutDiv.appendChild(footerLabel);
        rightLayoutDiv.appendChild(footerBox);
        element.appendChild(propertyDiv);

        this.headerBox = new NumericTextBox({ value: 612, width: 170, decimals: 2 });
        this.headerBox.appendTo(headerBox);
        this.footerBox = new NumericTextBox({ value: 792, width: 170, decimals: 2 });
        this.footerBox.appendTo(footerBox);
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
            this.paperSize.value = 'letter';
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
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let s: number = 0; s < this.target.childNodes.length; s++) {
                this.target.removeChild(this.target.childNodes[s]);
                s--;
            }
            this.target = undefined;
        }
    }
}
