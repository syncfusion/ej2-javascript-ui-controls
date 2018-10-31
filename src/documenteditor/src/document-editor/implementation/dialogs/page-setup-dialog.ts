import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { LayoutViewer } from '../index';
import { createElement, L10n, setCulture } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { CheckBox, RadioButton, ChangeArgs } from '@syncfusion/ej2-buttons';
import { SelectionSectionFormat } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WSectionFormat } from './../../implementation/format/index';
import { Tab } from '@syncfusion/ej2-navigations';

/**
 * The Page setup dialog is used to modify formatting of selected sections.
 */
export class PageSetupDialog {
    private target: HTMLElement;
    /**
     * @private
     */
    public owner: LayoutViewer;
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
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
    }

    private getModuleName(): string {
        return 'PageSetupDialog';
    }
    /**
     * @private
     */
    public initPageSetupDialog(locale: L10n): void {
        let id: string = this.owner.owner.containerId + '_pagesetup_dialog';
        this.target = createElement('div', { id: id, className: 'e-de-pagesetup-dlg-container' });
        this.owner.owner.element.appendChild(this.target);
        let ejtabContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_MarginTabContainer' });
        this.target.appendChild(ejtabContainer);
        this.marginTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_marginPropertyTab', styles: 'position: relative;width:400px;'
        });
        this.paperTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_paperSizePropertyTab', styles: 'position: relative;width:400px;'
        });
        this.layoutTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_CellPropertiesDialogTab', styles: 'position: relative;width:400px;'
        });
        // tslint:disable-next-line:max-line-length
        let ejtab: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_PageSetupDialogTab', className: 'e-de-page-setup-ppty-tab' });
        let headerContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-tab-header' });
        let marginHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_marginHeader', innerHTML: locale.getConstant('Margin')
        });
        let paperHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_paperHeader', innerHTML: locale.getConstant('Paper')
        });
        let layoutHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_layoutHeader', innerHTML: locale.getConstant('Layout')
        });
        headerContainer.appendChild(marginHeader); headerContainer.appendChild(paperHeader);
        headerContainer.appendChild(layoutHeader);
        let contentContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-content' });
        let marginContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_marginContent' });
        let paperContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_paperContent' });
        let layoutContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_layoutContent' });
        marginContent.appendChild(this.marginTab); paperContent.appendChild(this.paperTab);
        layoutContent.appendChild(this.layoutTab); contentContainer.appendChild(marginContent);
        contentContainer.appendChild(paperContent); contentContainer.appendChild(layoutContent);
        ejtab.appendChild(headerContainer); ejtab.appendChild(contentContainer);
        ejtabContainer.appendChild(ejtab);
        this.initMarginProperties(this.marginTab, locale);
        this.initPaperSizeProperties(this.paperTab, locale);
        this.initLayoutProperties(this.layoutTab, locale);
        let tabObj: Tab = new Tab({}, ejtab);
        this.target.addEventListener('keyup', this.keyUpInsertPageSettings);
        let marginTabHeader: HTMLElement = tabObj.element.getElementsByClassName('e-item e-toolbar-item')[0] as HTMLElement;
        let marginTabHeaderItem: HTMLElement = marginTabHeader.getElementsByClassName('e-tab-wrap')[0] as HTMLElement;
        marginTabHeaderItem.classList.add('e-de-page-setup-dlg-margin-tab-header');
    }

    /**
     * @private
     */
    public initMarginProperties(element: HTMLDivElement, locale: L10n): void {
        let marginDiv: HTMLDivElement = createElement('div', {
            id: 'margin_div',
            className: 'e-de-page-setup-dlg-sub-container', styles: 'height:135px;'
        }) as HTMLDivElement;
        // tslint:disable-next-line:max-line-length
        let leftMarginDiv: HTMLDivElement = createElement('div', { id: 'left_margin', className: 'e-de-page-setup-dlg-left-sub-container' }) as HTMLDivElement;
        marginDiv.appendChild(leftMarginDiv);
        // tslint:disable-next-line:max-line-length
        let rightMarginDiv: HTMLDivElement = createElement('div', { className: 'e-de-page-setup-dlg-right-sub-container' }) as HTMLDivElement;
        marginDiv.appendChild(rightMarginDiv);

        let topLabel: HTMLLabelElement = createElement('label', {
            innerHTML: locale.getConstant('Top'), className: 'e-de-page-setup-dlg-sub-header',
            id: this.target.id + '_TopLabel', styles: 'padding-top:0px;width:190px;'
        }) as HTMLLabelElement;
        let topTextBox: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_Top'
        }) as HTMLInputElement;
        let bottomBoxLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Bottom'),
            className: 'e-de-page-setup-dlg-sub-title-header', id: this.target.id + '_bottomLabel'
        });
        let bottomTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' },
            id: this.target.id + '_bottom'
        });
        leftMarginDiv.appendChild(topLabel);
        leftMarginDiv.appendChild(topTextBox);
        leftMarginDiv.appendChild(bottomBoxLabel);
        leftMarginDiv.appendChild(bottomTextBox);
        let leftBoxLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Left'), className: 'e-de-page-setup-dlg-sub-header', styles: 'padding-top:0px;width:190px;',
            id: this.target.id + '_leftLabel'
        });
        let leftTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_left'
        });
        let rightLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Right'),
            id: this.target.id + '_rightLabel', className: 'e-de-page-setup-dlg-sub-title-header'
        });
        let rightTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
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

        // tslint:disable-next-line:max-line-length
        let orientationDiv: HTMLDivElement = createElement('div', { id: 'orientation_div', className: 'e-de-page-setup-dlg-sub-container-port' }) as HTMLDivElement;
        // tslint:disable-next-line:max-line-length
        let orientationLabeldiv: HTMLElement = createElement('div', { id: '_orientationLabelDiv', className: 'e-de-page-setup-dlg-sub-label', innerHTML: locale.getConstant('Orientation') });
        let orientationPropDiv: HTMLDivElement = createElement('div', { id: '_orientationPropDiv', styles: 'display: flex;', className: 'e-de-page-setup-dlg-orientation-prop' }) as HTMLDivElement;
        let portraitDiv: HTMLDivElement = createElement('div', { id: '_portraitDiv', styles: 'padding-right: 30px;' }) as HTMLDivElement;
        let portrait: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }, id: this.target.id + '_portrait'
        });
        let landscapeDiv: HTMLDivElement = createElement('div', { id: '_landscapeDiv' }) as HTMLDivElement;
        let landscape: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }, id: this.target.id + '_landscape'
        });
        portraitDiv.appendChild(portrait); landscapeDiv.appendChild(landscape);
        orientationPropDiv.appendChild(portraitDiv); orientationPropDiv.appendChild(landscapeDiv);
        orientationDiv.appendChild(orientationLabeldiv);
        orientationDiv.appendChild(orientationPropDiv);

        this.portrait = new RadioButton({ label: locale.getConstant('Portrait'), checked: true, change: this.onPortrait });
        this.landscape = new RadioButton({ label: locale.getConstant('Landscape'), change: this.onLandscape });
        this.portrait.appendTo(portrait); this.landscape.appendTo(landscape);
        element.appendChild(orientationDiv);
    }
    /**
     * @private
     */
    public initPaperSizeProperties(element: HTMLDivElement, locale: L10n): void {
        let sizeDiv: HTMLDivElement = createElement('div', {
            id: 'size_div',
            className: 'e-de-page-setup-dlg-sub-size-container'
        }) as HTMLDivElement;
        // tslint:disable-next-line:max-line-length
        let leftSizeDiv: HTMLDivElement = createElement('div', { id: 'left_size', className: 'e-de-page-setup-dlg-left-sub-container' }) as HTMLDivElement;
        sizeDiv.appendChild(leftSizeDiv);
        // tslint:disable-next-line:max-line-length
        let rightSizeDiv: HTMLDivElement = createElement('div', { className: 'e-de-page-setup-dlg-right-sub-container' }) as HTMLDivElement;
        sizeDiv.appendChild(rightSizeDiv);

        let widthLabel: HTMLLabelElement = createElement('label', {
            innerHTML: locale.getConstant('Width'), className: 'e-de-page-setup-dlg-sub-header',
            id: this.target.id + '_widthLabel', styles: 'padding-top:0px;width:190px;'
        }) as HTMLLabelElement;
        let widthTextBox: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_Width'
        }) as HTMLInputElement;

        leftSizeDiv.appendChild(widthLabel);
        leftSizeDiv.appendChild(widthTextBox);

        let heightLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Height'), className: 'e-de-page-setup-dlg-sub-header', styles: 'padding-top:0px;width:190px;',
            id: this.target.id + '_heightLabel'
        });
        let heightTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_height'
        });
        rightSizeDiv.appendChild(heightLabel);
        rightSizeDiv.appendChild(heightTextBox);
        element.appendChild(sizeDiv);

        this.widthBox = new NumericTextBox({ value: 612, width: 170, decimals: 2 });
        this.widthBox.appendTo(widthTextBox);
        this.heightBox = new NumericTextBox({ value: 792, width: 170, decimals: 2 });
        this.heightBox.appendTo(heightTextBox);

        // tslint:disable-next-line:max-line-length
        let paperSizeDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { id: '_paperSizeDiv', styles: 'height:37px;', className: 'e-de-page-setup-dlg-sub-container' });
        let paperSize: HTMLElement = createElement('select', {
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
        this.paperSize = new DropDownList({ change: this.changeByPaperSize, width: '170px' });
        this.paperSize.appendTo(paperSize);
        element.appendChild(paperSizeDiv);
    }
    /**
     * @private
     */
    public initLayoutProperties(element: HTMLDivElement, locale: L10n): void {
        // tslint:disable-next-line:max-line-length
        let layoutDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { id: '_layoutDiv', className: 'e-de-page-setup-dlg-layout-sub-container', });
        // tslint:disable-next-line:max-line-length
        let firstPageDiv: HTMLDivElement = createElement('div', { id: '_firstPageDiv', styles: 'height: 27px;', className: 'e-de-page-setup-dlg-first-page-prop' }) as HTMLDivElement;
        let checkBox1: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_oddoreven'
        });
        firstPageDiv.appendChild(checkBox1);
        // tslint:disable-next-line:max-line-length
        let oddOrEvenDiv: HTMLDivElement = createElement('div', { id: '_oddOrEvenDiv', styles: 'height: 27px;', className: 'e-de-page-setup-dlg-odd-or-even-prop' }) as HTMLDivElement;
        let checkBox2: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_even'
        });
        oddOrEvenDiv.appendChild(checkBox2);
        layoutDiv.appendChild(firstPageDiv); layoutDiv.appendChild(oddOrEvenDiv);

        this.checkBox1 = new CheckBox({ label: locale.getConstant('Different odd and even') });
        this.checkBox2 = new CheckBox({ label: locale.getConstant('Different first page') });
        this.checkBox1.appendTo(checkBox1); this.checkBox2.appendTo(checkBox2);
        element.appendChild(layoutDiv);

        // tslint:disable-next-line:max-line-length
        let textLabelDiv: HTMLDivElement = createElement('div', { id: '_textLabelDiv', className: 'e-de-page-setup-dlg-sub-label' }) as HTMLDivElement;
        let textLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('From edge'), id: this.target.id + '_textLabel'
        });
        textLabelDiv.appendChild(textLabel);
        element.appendChild(textLabelDiv);

        // tslint:disable-next-line:max-line-length
        let propertyDiv: HTMLDivElement = createElement('div', { id: '_headerFooeterPropDiv', className: 'e-de-page-setup-dlg-sub-container', styles: 'height: 65px;' }) as HTMLDivElement;
        // tslint:disable-next-line:max-line-length
        let leftLayoutDiv: HTMLDivElement = createElement('div', { id: '_leftLayoutDiv', className: 'e-de-page-setup-dlg-left-layout-container' }) as HTMLDivElement;
        propertyDiv.appendChild(leftLayoutDiv);
        // tslint:disable-next-line:max-line-length
        let rightLayoutDiv: HTMLDivElement = createElement('div', { className: 'e-de-page-setup-dlg-right-layout-container' }) as HTMLDivElement;
        propertyDiv.appendChild(rightLayoutDiv);

        let headerLabel: HTMLLabelElement = createElement('label', {
            innerHTML: locale.getConstant('Header'), className: 'e-de-page-setup-dlg-sub-header',
            id: this.target.id + '_headerLabel', styles: 'padding-top:0px;width:190px;'
        }) as HTMLLabelElement;
        let headerBox: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_header'
        }) as HTMLInputElement;

        leftLayoutDiv.appendChild(headerLabel);
        leftLayoutDiv.appendChild(headerBox);

        let footerLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Footer'), className: 'e-de-page-setup-dlg-sub-header', styles: 'padding-top:0px;width:190px;',
            id: this.target.id + '_footerLabel'
        });
        let footerBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
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
     */
    public show(): void {
        let localValue: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        localValue.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initPageSetupDialog(localValue);
        }
        this.owner.dialog.header = localValue.getConstant('Page Setup');
        this.owner.dialog.width = 'auto';
        this.owner.dialog.height = 'auto';
        this.owner.dialog.content = this.target;
        this.owner.dialog.beforeOpen = this.loadPageSetupDialog;
        this.owner.dialog.close = this.closePageSetupDialog;

        this.owner.dialog.buttons = [{
            click: this.applyPageSetupProperties,
            buttonModel: { content: localValue.getConstant('Ok'), cssClass: 'e-flat e-layout-ppty-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-layout-ppty-cancel' }
        }];
        this.owner.dialog.dataBind();
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public loadPageSetupDialog = (): void => {
        this.owner.updateFocus();
        let sectionFormat: SelectionSectionFormat = this.owner.selection.sectionFormat;
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
    }
    /**
     * @private
     */
    public closePageSetupDialog = (): void => {
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
    public keyUpInsertPageSettings = (event: KeyboardEvent): void => {
        if (event.keyCode === 13) {
            this.applyPageSetupProperties();
        }
    }
    /**
     * @private
     */
    public applyPageSetupProperties = (): void => {
        let sectionFormat: WSectionFormat = new WSectionFormat();
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
        this.owner.owner.editorModule.onApplySectionFormat(undefined, sectionFormat);
        this.owner.dialog.hide();
    }
    /**
     * @private
     */
    public changeByPaperSize = (event: ChangeEventArgs): void => {
        let value: string = event.value as string;
        let sectionFormat: SelectionSectionFormat = this.owner.selection.sectionFormat;
        let width: number = sectionFormat.pageWidth;
        let height: number = sectionFormat.pageHeight;
        if (this.owner.selection.sectionFormat.pageWidth > this.owner.selection.sectionFormat.pageHeight || this.landscape.checked) {
            this.isPortrait = false;
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
                this.widthBox.value = 515.9;
                this.heightBox.value = 728.5;
            } else {
                this.widthBox.value = 728.5;
                this.heightBox.value = 515.9;
            }
        }
    }
    /**
     * @private
     */
    public onPortrait = (event: ChangeArgs): void => {
        this.landscape.checked = false;
        let width: number = this.widthBox.value;
        let height: number = this.heightBox.value;
        if (width > height) {
            this.widthBox.value = height;
            this.heightBox.value = width;
        }
    }
    /**
     * @private
     */
    public onLandscape = (event: ChangeArgs): void => {
        this.portrait.checked = false;
        let width: number = this.widthBox.value;
        let height: number = this.heightBox.value;
        if (width < height) {
            this.widthBox.value = height;
            this.heightBox.value = width;
        }
    }
    /**
     * @private
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
    }
    /**
     * @private
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
        this.owner = undefined;
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