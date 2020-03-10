/**
 * Represents document editor header and footer.
 */

import { createElement, KeyboardEventArgs, L10n, classList } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { Toolbar } from '../tool-bar/tool-bar';
import { DocumentEditorContainer } from '../document-editor-container';
import { DocumentEditor } from '../../document-editor/document-editor';
/** 
 * @private
 */
export class HeaderFooterProperties {
    public element: HTMLElement;
    private container: DocumentEditorContainer;
    private firstPage: CheckBox;
    private oddOrEven: CheckBox;
    private pageNumber: CheckBox;
    private pageCount: CheckBox;
    private headerFromTop: NumericTextBox;
    private footerFromTop: NumericTextBox;
    private isHeaderTopApply: boolean = false;
    private isFooterTopApply: boolean = false;
    private isRtl: boolean;

    /**
     * @private
     */
    get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    get toolbar(): Toolbar {
        return this.container.toolbarModule;
    }
    /**
     * @private
     */
    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }
    constructor(container: DocumentEditorContainer, isRtl?: boolean) {
        this.container = container;
        this.isRtl = isRtl;
        this.initHeaderFooterPane();
        this.wireEvents();
    }
    public initHeaderFooterPane(): void {
        this.initializeHeaderFooter();
        this.element.style.display = 'none';
        this.container.propertiesPaneContainer.appendChild(this.element);
    }
    public showHeaderFooterPane(isShow: boolean): void {
        if (isShow) {
            if (this.toolbar) {
                this.toolbar.enableDisablePropertyPaneButton(false);
            }
            this.onSelectionChange();
        }
        if (!isShow && this.element.style.display === 'none' || (isShow && this.element.style.display === 'block')) {
            return;
        }
        this.element.style.display = isShow ? 'block' : 'none';
        this.documentEditor.resize();
    }
    // tslint:disable-next-line:max-func-body-length
    private initializeHeaderFooter(): void {
        let localObj: L10n = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        let elementId: string = 'header_footer_properties';
        // tslint:disable-next-line:max-line-length
        this.element = createElement('div', { id: this.documentEditor.element.id + elementId, className: 'e-de-prop-pane' });
        let headerDiv: HTMLElement = this.createDivTemplate('_header_footer', this.element, 'padding-bottom:0');
        classList(headerDiv, ['e-de-cntr-pane-padding'], []);
        let headerLabel: HTMLElement = createElement('label', { className: 'e-de-prop-header-label' });
        headerLabel.innerHTML = localObj.getConstant('Header And Footer');
        let closeButtonFloat: string;
        let optionsLabelDivPadding: string;
        let positionLabelDivPadding: string;
        if (!this.isRtl) {
            closeButtonFloat = 'float:right;';
            optionsLabelDivPadding = 'padding-left: 14px';
            positionLabelDivPadding = 'padding-left: 14px;';
        } else {
            closeButtonFloat = 'float:left;';
            optionsLabelDivPadding = 'padding-right: 14px';
            positionLabelDivPadding = 'padding-right: 14px;';
        }
        let closeIcon: HTMLElement = createElement('span', {
            id: '_header_footer_close',
            className: 'e-de-ctnr-close e-de-close-icon e-icons',
            styles: 'display:inline-block;cursor:pointer;' + closeButtonFloat
        });
        closeIcon.addEventListener('click', (): void => { this.onClose(); });
        headerDiv.appendChild(headerLabel);
        headerDiv.appendChild(closeIcon);
        let optionsLabelDiv: HTMLElement = this.createDivTemplate(elementId + '_options', this.element);
        classList(optionsLabelDiv, ['e-de-cntr-pane-padding', 'e-de-prop-separator-line'], []);
        let optionsLabel: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label', styles: 'height:20px;' });
        optionsLabel.innerHTML = localObj.getConstant('Options');
        optionsLabelDiv.appendChild(optionsLabel);
        let optionsDiv: HTMLElement = this.createDivTemplate(elementId + '_optionsDiv', optionsLabelDiv);
        let firstPageDiv: HTMLElement = this.createDivTemplate(elementId + '_firstPageDiv', optionsDiv, 'margin-bottom:10px;');
        let firstPage: HTMLInputElement = createElement('input', { id: 'firstPage', className: 'e-de-prop-sub-label' }) as HTMLInputElement;
        firstPageDiv.appendChild(firstPage);
        // tslint:disable-next-line:max-line-length
        this.firstPage = new CheckBox({ label: localObj.getConstant('Different First Page'), change: this.changeFirstPageOptions, cssClass: 'e-de-prop-sub-label', enableRtl: this.isRtl });
        this.firstPage.appendTo(firstPage);
        // tslint:disable-next-line:max-line-length
        firstPageDiv.children[0].setAttribute('title', localObj.getConstant('Different header and footer for first page'));
        let oddOrEvenDiv: HTMLElement = this.createDivTemplate(elementId + '_oddOrEvenDiv', optionsDiv);
        let oddOrEven: HTMLInputElement = createElement('input', { id: 'oddOrEven', className: 'e-de-sub-prop-label' }) as HTMLInputElement;
        oddOrEvenDiv.appendChild(oddOrEven);
        // tslint:disable-next-line:max-line-length
        this.oddOrEven = new CheckBox({ label: localObj.getConstant('Different Odd And Even Pages'), change: this.changeoddOrEvenOptions, cssClass: 'e-de-prop-sub-label', enableRtl: this.isRtl });
        this.oddOrEven.appendTo(oddOrEven);
        // tslint:disable-next-line:max-line-length
        oddOrEvenDiv.children[0].setAttribute('title', localObj.getConstant('Different header and footer for odd and even pages'));
        // tslint:disable-next-line:max-line-length
        // let autoFieldLabelDiv: HTMLElement = this.createDivTemplate(element + '_autoFieldLabelDiv', div, 'padding-top:10px;padding-left: 10px;');
        // let autoFieldLabel: HTMLElement = createElement('label', { className: 'e-de-header-prop-label', styles: 'height:20px;' });
        // autoFieldLabel.innerHTML = 'Insert Autofield';
        // autoFieldLabelDiv.appendChild(autoFieldLabel);
        // let autofieldDiv: HTMLElement = this.createDivTemplate(element + '_autofieldDiv', autoFieldLabelDiv, 'display:inline-flex;');
        // let pageNumberDiv: HTMLElement = this.createDivTemplate(element + '_pageNumberDiv', autofieldDiv, 'margin-right:8px;');
        // let pageNumber: HTMLInputElement = createElement('input', { id: 'pageNumber' }) as HTMLInputElement;
        // pageNumberDiv.appendChild(pageNumber);
        // this.pageNumber = new CheckBox({ label: 'Page Number', change: this.changePageNumber });
        // this.pageNumber.appendTo(pageNumber);
        // let pageCountDiv: HTMLElement = this.createDivTemplate(element + '_pageCountDiv', autofieldDiv);
        // let pageCount: HTMLInputElement = createElement('input', { id: 'pageCount' }) as HTMLInputElement;
        // pageCountDiv.appendChild(pageCount);
        // this.pageCount = new CheckBox({ label: 'Page Count', change: this.changePageCount });
        // this.pageCount.appendTo(pageCount);

        // let autoFieldLine: HTMLElement = createElement('div', { className: 'e-de-prop-separator-line', styles: 'margin-top:7px;' });
        // autoFieldLabelDiv.appendChild(autoFieldLine);

        // tslint:disable-next-line:max-line-length
        let positionLabelDiv: HTMLElement = this.createDivTemplate(elementId + '_positionLabelDiv', this.element);
        classList(positionLabelDiv, ['e-de-cntr-pane-padding', 'e-de-prop-separator-line'], []);
        let positionLabel: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label', styles: 'height:20px;' });
        positionLabel.innerHTML = localObj.getConstant('Position');
        positionLabelDiv.appendChild(positionLabel);
        let positionDiv: HTMLElement = this.createDivTemplate(elementId + '_positionDiv', positionLabelDiv);
        let width: string;
        let headerFooterDivMargin: string;
        if (!this.isRtl) {
            width = 'width: 128px;';
            headerFooterDivMargin = 'margin-right:8px;';
        } else {
            width = 'width: 150px;';
            headerFooterDivMargin = 'margin-left:8px;';
        }
        // tslint:disable-next-line:max-line-length
        let headerTopDiv: HTMLElement = this.createDivTemplate(elementId + '_headerTopDiv', positionDiv, 'margin-bottom:14px;');
        // tslint:disable-next-line:max-line-length
        let headerTopLabel: HTMLElement = createElement('label', { className: 'e-de-prop-sub-label', styles: 'display:block' });
        headerTopLabel.innerHTML = localObj.getConstant('Header from Top');
        headerTopDiv.appendChild(headerTopLabel);
        // tslint:disable-next-line:max-line-length
        let headerFromTop: HTMLInputElement = createElement('input', { id: 'headerFromTop', className: 'e-de-prop-sub-label' }) as HTMLInputElement;
        headerTopDiv.appendChild(headerFromTop);
        // tslint:disable-next-line:max-line-length
        this.headerFromTop = new NumericTextBox({
            value: 36, cssClass: 'e-de-prop-header-numeric',
            showSpinButton: false, format: 'n0', decimals: 2, max: 1584, min: 0, enableRtl: this.isRtl
        });
        this.headerFromTop.appendTo(headerFromTop);
        // tslint:disable-next-line:max-line-length
        this.headerFromTop.element.parentElement.setAttribute('title', localObj.getConstant('Distance from top of the page to top of the header'));
        // tslint:disable-next-line:max-line-length
        let footerBottomDiv: HTMLElement = this.createDivTemplate(elementId + '_footerBottomDiv', positionDiv);
        // tslint:disable-next-line:max-line-length
        let footerBottomLabel: HTMLElement = createElement('label', { className: 'e-de-prop-sub-label', styles: 'display:block' });
        footerBottomLabel.innerHTML = localObj.getConstant('Footer from Bottom');
        footerBottomDiv.appendChild(footerBottomLabel);
        // tslint:disable-next-line:max-line-length
        let footerFromTop: HTMLInputElement = createElement('input', { id: 'footerFromTop', className: 'e-de-prop-sub-label' }) as HTMLInputElement;
        footerBottomDiv.appendChild(footerFromTop);
        // tslint:disable-next-line:max-line-length
        this.footerFromTop = new NumericTextBox({
            value: 36, cssClass: 'e-de-prop-header-numeric',
            showSpinButton: false, format: 'n0', decimals: 2, max: 1584, min: 0, enableRtl: this.isRtl
        });
        this.footerFromTop.appendTo(footerFromTop);
        // tslint:disable-next-line:max-line-length
        this.footerFromTop.element.parentElement.setAttribute('title', localObj.getConstant('Distance from bottom of the page to bottom of the footer'));
    }
    private createDivTemplate(id: string, parentDiv: HTMLElement, style?: string): HTMLElement {
        let divElement: HTMLElement;
        if (style) {
            divElement = createElement('div', { id: id, styles: style });
        } else {
            divElement = createElement('div', { id: id });
        }
        parentDiv.appendChild(divElement);
        return divElement;
    }
    private wireEvents = (): void => {
        this.headerFromTop.element.addEventListener('click', (): void => { this.isHeaderTopApply = true; });
        this.footerFromTop.element.addEventListener('click', (): void => { this.isFooterTopApply = true; });
        this.headerFromTop.element.addEventListener('keydown', this.onHeaderValue);
        this.footerFromTop.element.addEventListener('keydown', this.onFooterValue);
        this.headerFromTop.element.addEventListener('blur', (): void => { this.changeHeaderValue(); this.isHeaderTopApply = false; });
        this.footerFromTop.element.addEventListener('blur', (): void => { this.changeFooterValue(); this.isFooterTopApply = false; });
    }
    private onClose = (): void => {
        this.container.showHeaderProperties = true;
        this.container.documentEditor.selection.closeHeaderFooter();
    }
    private changeFirstPageOptions = (): void => {
        if (!this.documentEditor.isReadOnly) {
            this.documentEditor.selection.sectionFormat.differentFirstPage = this.firstPage.checked;
            setTimeout((): void => { this.documentEditor.focusIn(); }, 10);
        }
    }
    private changeoddOrEvenOptions = (): void => {
        if (!this.documentEditor.isReadOnly) {
            this.documentEditor.selection.sectionFormat.differentOddAndEvenPages = this.oddOrEven.checked;
            setTimeout((): void => { this.documentEditor.focusIn(); }, 10);
        }
    }
    private changeHeaderValue = (): void => {
        if (!this.isHeaderTopApply) {
            return;
        }
        if (!this.documentEditor.isReadOnly) {
            let headerTop: number = this.headerFromTop.value;
            if (headerTop > this.headerFromTop.max) {
                headerTop = this.headerFromTop.max;
            }
            this.documentEditor.selection.sectionFormat.headerDistance = headerTop;
        }
    }
    private onHeaderValue = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.changeHeaderValue(); this.isHeaderTopApply = false; }, 30);
        }
    }
    private onFooterValue = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.changeFooterValue(); this.isFooterTopApply = false; }, 30);
        }
    }
    private changeFooterValue = (): void => {
        if (!this.isFooterTopApply) {
            return;
        }
        if (!this.documentEditor.isReadOnly) {
            let footerTop: number = this.footerFromTop.value;
            if (footerTop > this.footerFromTop.max) {
                footerTop = this.footerFromTop.max;
            }
            this.documentEditor.selection.sectionFormat.footerDistance = footerTop;
        }
    }
    public onSelectionChange(): void {
        this.headerFromTop.value = this.documentEditor.selection.sectionFormat.headerDistance;
        this.footerFromTop.value = this.documentEditor.selection.sectionFormat.footerDistance;
        if (this.documentEditor.selection.sectionFormat.differentFirstPage) {
            this.firstPage.checked = true;
        } else {
            this.firstPage.checked = false;
        }
        if (this.documentEditor.selection.sectionFormat.differentOddAndEvenPages) {
            this.oddOrEven.checked = true;
        } else {
            this.oddOrEven.checked = false;
        }
    }
    public destroy(): void {
        if (this.headerFromTop) {
            this.headerFromTop.destroy();
            this.headerFromTop = undefined;
        }
        if (this.footerFromTop) {
            this.footerFromTop.destroy();
            this.footerFromTop = undefined;
        }
    }
}