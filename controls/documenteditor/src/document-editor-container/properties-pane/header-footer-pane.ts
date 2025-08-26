/**
 * Represents document editor header and footer.
 */

import { createElement, KeyboardEventArgs, L10n, classList } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { Toolbar } from '../tool-bar/tool-bar';
import { DocumentEditorContainer } from '../document-editor-container';
import { DocumentEditor } from '../../document-editor/document-editor';
import { HeaderFooterWidget } from '../../document-editor/implementation/viewer';
import { HeaderFooterType } from '../../document-editor/base';
import { TableCellWidget } from '../../document-editor/index';
/**
 * @private
 */
export class HeaderFooterProperties {
    private container: DocumentEditorContainer;
    private firstPage: CheckBox;
    private oddOrEven: CheckBox;
    private linkToPrevious: CheckBox;
    private pageNumber: CheckBox;
    private pageCount: CheckBox;
    private headerFromTop: NumericTextBox;
    private footerFromTop: NumericTextBox;
    private isHeaderTopApply: boolean = false;
    private isFooterTopApply: boolean = false;
    private isRtl: boolean;
    private localObj : L10n;
    private elementId : string;

    //HTML Elements
    public element: HTMLElement;
    private headerDiv: HTMLElement;
    private headerLabel: HTMLElement;
    private closeIcon: HTMLElement;
    private optionsLabelDiv: HTMLElement;
    private optionsLabel: HTMLElement;
    private optionsDiv: HTMLElement;
    private firstPageDiv: HTMLElement;
    private oddOrEvenDiv: HTMLElement;
    private linkToPreviousDiv: HTMLElement;
    private positionLabelDiv: HTMLElement;
    private positionLabel: HTMLElement;
    private positionDiv: HTMLElement;
    private headerTopDiv: HTMLElement;
    private headerTopLabel: HTMLElement;
    private footerBottomDiv: HTMLElement;
    private footerBottomLabel: HTMLElement;
    private divElement: HTMLElement;

    //Events Hook Constants
    private HeaderTopApplyClickHook: EventListenerOrEventListenerObject = this.headerTopApply.bind(this);
    private FooterTopApplyClickHook: EventListenerOrEventListenerObject = this.footerTopapply.bind(this);
    private OnHeaderValueKeyDownHook: EventListenerOrEventListenerObject = this.onHeaderValue.bind(this);
    private OnFooterValueKeyDownHook: EventListenerOrEventListenerObject = this.onFooterValue.bind(this);
    private ChangeHeaderBlurHook: EventListenerOrEventListenerObject = this.changeHeaderBlur.bind(this);
    private ChangeFooterBlurHook: EventListenerOrEventListenerObject = this.changeFooterBlur.bind(this);

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    private get toolbar(): Toolbar {
        return this.container.toolbarModule;
    }
    /**
     * @private
     * @param {boolean} enable - enable/disable header footer pane.
     * @returns {void}
     */
    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }
    public constructor(container: DocumentEditorContainer, isRtl?: boolean) {
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

    private initializeHeaderFooter(): void {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.elementId = 'header_footer_properties';
        this.element = createElement('div', { id: this.documentEditor.element.id + this.elementId, className: 'e-de-prop-pane' });
        this.headerDiv = this.createDivTemplate('_header_footer', this.element, 'padding-bottom:0');
        classList(this.headerDiv, ['e-de-cntr-pane-padding'], []);
        this.headerLabel = createElement('label', { className: 'e-de-prop-header-label' });
        this.headerLabel.innerHTML = this.localObj.getConstant('Header And Footer');
        let closeButtonFloat: string;
        //let optionsLabelDivPadding: string;
        //let positionLabelDivPadding: string;
        if (!this.isRtl) {
            closeButtonFloat = 'float:right;';
            //optionsLabelDivPadding = 'padding-left: 14px';
            //positionLabelDivPadding = 'padding-left: 14px;';
        } else {
            closeButtonFloat = 'float:left;';
            //optionsLabelDivPadding = 'padding-right: 14px';
            //positionLabelDivPadding = 'padding-right: 14px;';
        }
        this.closeIcon = createElement('span', {
            id: '_header_footer_close',
            className: 'e-de-ctnr-close e-de-close-icon e-icons',
            styles: 'display:inline-block;cursor:pointer;' + closeButtonFloat
        });
        this.closeIcon.addEventListener('click', (): void => {
            this.onClose();
        });
        this.headerDiv.appendChild(this.headerLabel);
        this.headerDiv.appendChild(this.closeIcon);
        this.optionsLabelDiv = this.createDivTemplate(this.elementId + '_options', this.element);
        classList(this.optionsLabelDiv, ['e-de-cntr-pane-padding', 'e-de-prop-separator-line'], []);
        this.optionsLabel = createElement('label', { className: 'e-de-ctnr-prop-label', styles: 'height:20px;' });
        this.optionsLabel.innerHTML = this.localObj.getConstant('Options');
        this.optionsLabelDiv.appendChild(this.optionsLabel);
        this.optionsDiv = this.createDivTemplate(this.elementId + '_optionsDiv', this.optionsLabelDiv);
        this.firstPageDiv = this.createDivTemplate(this.elementId + '_firstPageDiv', this.optionsDiv);
        classList(this.firstPageDiv, ['e-de-hdr-ftr-frst-div'], []);
        const firstPage: HTMLInputElement = createElement('input', { id: 'firstPage', className: 'e-de-prop-sub-label' }) as HTMLInputElement;
        this.firstPageDiv.appendChild(firstPage);
        this.firstPage = new CheckBox({ label: this.localObj.getConstant('Different First Page'), change: this.changeFirstPageOptions.bind(this), cssClass: 'e-de-prop-sub-label', enableRtl: this.isRtl });
        this.firstPage.appendTo(firstPage);
        this.firstPageDiv.children[0].setAttribute('title', this.localObj.getConstant('Different header and footer for first page'));
        this.oddOrEvenDiv = this.createDivTemplate(this.elementId + '_oddOrEvenDiv', this.optionsDiv);
        classList(this.oddOrEvenDiv, ['e-de-hdr-ftr-frst-div'], []);
        const oddOrEven: HTMLInputElement = createElement('input', { id: 'oddOrEven', className: 'e-de-sub-prop-label' }) as HTMLInputElement;
        this.oddOrEvenDiv.appendChild(oddOrEven);
        this.oddOrEven = new CheckBox({ label: this.localObj.getConstant('Different Odd And Even Pages'), change: this.changeoddOrEvenOptions.bind(this), cssClass: 'e-de-prop-sub-label', enableRtl: this.isRtl });
        this.oddOrEven.appendTo(oddOrEven);
        this.oddOrEvenDiv.children[0].setAttribute('title', this.localObj.getConstant('Different header and footer for odd and even pages'));
        this.linkToPreviousDiv = this.createDivTemplate(this.elementId + '_linkToPreviousDiv', this.optionsDiv);
        const linkToPrevious: HTMLInputElement = createElement('input', { id: 'linkToPrevious', className: 'e-de-sub-prop-label' }) as HTMLInputElement;
        this.linkToPreviousDiv.appendChild(linkToPrevious);
        this.linkToPrevious = new CheckBox({ label: this.localObj.getConstant('Link to Previous'), change: this.changeLinkToPreviousOptions.bind(this), cssClass: 'e-de-prop-sub-label', enableRtl: this.isRtl, checked: true });
        this.linkToPrevious.appendTo(linkToPrevious);
        this.linkToPreviousDiv.children[0].setAttribute('title', this.localObj.getConstant('Link to the previous Title'));
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

        this.positionLabelDiv = this.createDivTemplate(this.elementId + '_positionLabelDiv', this.element);
        classList(this.positionLabelDiv, ['e-de-cntr-pane-padding', 'e-de-prop-separator-line'], []);
        this.positionLabel = createElement('label', { className: 'e-de-ctnr-prop-label', styles: 'height:20px;' });
        this.positionLabel.innerHTML = this.localObj.getConstant('Position');
        this.positionLabelDiv.appendChild(this.positionLabel);
        this.positionDiv = this.createDivTemplate(this.elementId + '_positionDiv', this.positionLabelDiv);
        //let width: string;
        //let headerFooterDivMargin: string;
        //if (!this.isRtl) {
        //width = 'width: 128px;';
        //headerFooterDivMargin = 'margin-right:8px;';
        //} else {
        //width = 'width: 150px;';
        //headerFooterDivMargin = 'margin-left:8px;';
        //}
        this.headerTopDiv = this.createDivTemplate(this.elementId + '_headerTopDiv', this.positionDiv);
        classList(this.headerTopDiv, ['e-de-hdr-ftr-top-div'], []);
        this.headerTopLabel = createElement('label', { className: 'e-de-prop-sub-label', styles: 'display:block' });
        this.headerTopLabel.innerHTML = this.localObj.getConstant('Header from Top');
        this.headerTopDiv.appendChild(this.headerTopLabel);
        const headerFromTop: HTMLInputElement = createElement('input', { id: this.documentEditor.element.id + '_headerFromTop', className: 'e-de-prop-sub-label' }) as HTMLInputElement;
        headerFromTop.setAttribute('aria-label', this.localObj.getConstant('Header from Top'));
        this.headerTopDiv.appendChild(headerFromTop);
        this.headerFromTop = new NumericTextBox({
            value: 36, cssClass: 'e-de-prop-header-numeric',
            showSpinButton: false, format: 'n0', decimals: 2, max: 1584, min: 0, enableRtl: this.isRtl
        });
        this.headerFromTop.appendTo(headerFromTop);
        this.headerFromTop.element.parentElement.setAttribute('title', this.localObj.getConstant('Distance from top of the page to top of the header'));
        this.footerBottomDiv = this.createDivTemplate(this.elementId + '_footerBottomDiv', this.positionDiv);
        this.footerBottomLabel = createElement('label', { className: 'e-de-prop-sub-label', styles: 'display:block' });
        this.footerBottomLabel.innerHTML = this.localObj.getConstant('Footer from Bottom');
        this.footerBottomDiv.appendChild(this.footerBottomLabel);
        const footerFromTop: HTMLInputElement = createElement('input', { id: this.documentEditor.element.id + '_footerFromTop', className: 'e-de-prop-sub-label' }) as HTMLInputElement;
        footerFromTop.setAttribute('aria-label', this.localObj.getConstant('Footer from Bottom'));
        this.footerBottomDiv.appendChild(footerFromTop);
        this.footerFromTop = new NumericTextBox({
            value: 36, cssClass: 'e-de-prop-header-numeric',
            showSpinButton: false, format: 'n0', decimals: 2, max: 1584, min: 0, enableRtl: this.isRtl
        });
        this.footerFromTop.appendTo(footerFromTop);
        this.footerFromTop.element.parentElement.setAttribute('title', this.localObj.getConstant('Distance from bottom of the page to bottom of the footer'));
    }
    private createDivTemplate(id: string, parentDiv: HTMLElement, style?: string): HTMLElement {
        if (style) {
            this.divElement = createElement('div', { id: id, styles: style });
        } else {
            this.divElement = createElement('div', { id: id });
        }
        parentDiv.appendChild(this.divElement);
        return this.divElement;
    }
    private wireEvents(): void {
        this.headerFromTop.element.addEventListener('click', this.HeaderTopApplyClickHook);
        this.footerFromTop.element.addEventListener('click', this.FooterTopApplyClickHook);
        this.headerFromTop.element.addEventListener('keydown', this.OnHeaderValueKeyDownHook);
        this.footerFromTop.element.addEventListener('keydown', this.OnFooterValueKeyDownHook);
        this.headerFromTop.element.addEventListener('blur', this.ChangeHeaderBlurHook);
        this.footerFromTop.element.addEventListener('blur', this.ChangeFooterBlurHook);
    }
    private headerTopApply() : void{
        this.isHeaderTopApply = true;
    }
    private footerTopapply() : void{
        this.isFooterTopApply = true;
    }
    private changeHeaderBlur() : void{
        this.changeHeaderValue(); this.isHeaderTopApply = false;
    }
    private changeFooterBlur() : void{
        this.changeFooterValue(); this.isFooterTopApply = false;
    }

    private onClose(): void {
        this.container.showHeaderProperties = true;
        this.container.documentEditor.selectionModule.closeHeaderFooter();
    }
    private changeFirstPageOptions(): void {
        if (!this.documentEditor.isReadOnly) {
            this.documentEditor.selectionModule.sectionFormat.differentFirstPage = this.firstPage.checked;
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 10);
        }
    }
    private changeoddOrEvenOptions(): void {
        if (!this.documentEditor.isReadOnly) {
            this.documentEditor.selectionModule.sectionFormat.differentOddAndEvenPages = this.oddOrEven.checked;
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 10);
        }
    }
    private changeLinkToPreviousOptions(): void {
        if (!this.documentEditor.isReadOnly) {
            const headerFooterType: HeaderFooterType = (
                (this.documentEditor.selectionModule.start.paragraph.containerWidget) as HeaderFooterWidget).headerFooterType;
            const value: boolean = this.linkToPrevious.checked;
            switch (headerFooterType) {
            case 'OddHeader':
                this.documentEditor.selectionModule.sectionFormat.oddPageHeader.linkToPrevious = value;
                break;
            case 'OddFooter':
                this.documentEditor.selectionModule.sectionFormat.oddPageFooter.linkToPrevious = value;
                break;
            case 'EvenHeader':
                this.documentEditor.selectionModule.sectionFormat.evenPageHeader.linkToPrevious = value;
                break;
            case 'EvenFooter':
                this.documentEditor.selectionModule.sectionFormat.evenPageFooter.linkToPrevious = value;
                break;
            case 'FirstPageHeader':
                this.documentEditor.selectionModule.sectionFormat.firstPageHeader.linkToPrevious = value;
                break;
            case 'FirstPageFooter':
                this.documentEditor.selectionModule.sectionFormat.firstPageFooter.linkToPrevious = value;
                break;

            }
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 10);
        }
    }
    private changeHeaderValue(): void {
        if (!this.isHeaderTopApply) {
            return;
        }
        if (!this.documentEditor.isReadOnly) {
            let headerTop: number = this.headerFromTop.value;
            if (headerTop > this.headerFromTop.max) {
                headerTop = this.headerFromTop.max;
            }
            this.documentEditor.selectionModule.sectionFormat.headerDistance = headerTop;
        }
    }
    private onHeaderValue(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.changeHeaderValue(); this.isHeaderTopApply = false;
            }, 30);
        }
    }
    private onFooterValue(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.changeFooterValue(); this.isFooterTopApply = false;
            }, 30);
        }
    }
    private changeFooterValue(): void {
        if (!this.isFooterTopApply) {
            return;
        }
        if (!this.documentEditor.isReadOnly) {
            let footerTop: number = this.footerFromTop.value;
            if (footerTop > this.footerFromTop.max) {
                footerTop = this.footerFromTop.max;
            }
            this.documentEditor.selectionModule.sectionFormat.footerDistance = footerTop;
        }
    }
    public onSelectionChange(): void {
        this.headerFromTop.value = this.documentEditor.selectionModule.sectionFormat.headerDistance;
        this.footerFromTop.value = this.documentEditor.selectionModule.sectionFormat.footerDistance;
        if (this.documentEditor.selectionModule.sectionFormat.differentFirstPage) {
            this.firstPage.checked = true;
        } else {
            this.firstPage.checked = false;
        }
        if (this.documentEditor.selectionModule.sectionFormat.differentOddAndEvenPages) {
            this.oddOrEven.checked = true;
        } else {
            this.oddOrEven.checked = false;
        }
        if (this.documentEditor.selectionModule.start.paragraph.bodyWidget.sectionIndex === 0) {
            this.linkToPrevious.disabled = true;
        } else {
            this.linkToPrevious.disabled = false;
            let headerFooterWidget: HeaderFooterWidget;
            if (this.documentEditor.selectionModule.start.paragraph.containerWidget instanceof TableCellWidget) {
                /* eslint-disable-next-line max-len */
                headerFooterWidget = this.documentEditor.selectionModule.getContainerWidget(this.documentEditor.selectionModule.start.paragraph.containerWidget) as HeaderFooterWidget;
            }
            else {
                headerFooterWidget = this.documentEditor.selectionModule.start.paragraph.containerWidget as HeaderFooterWidget;
            }
            const headerFooterType: HeaderFooterType = headerFooterWidget.headerFooterType;
            switch (headerFooterType) {
            case 'OddHeader':
                this.linkToPrevious.checked = this.documentEditor.selectionModule.sectionFormat.oddPageHeader.linkToPrevious;
                break;
            case 'OddFooter':
                this.linkToPrevious.checked = this.documentEditor.selectionModule.sectionFormat.oddPageFooter.linkToPrevious;
                break;
            case 'EvenHeader':
                this.linkToPrevious.checked = this.documentEditor.selectionModule.sectionFormat.evenPageHeader.linkToPrevious;
                break;
            case 'EvenFooter':
                this.linkToPrevious.checked = this.documentEditor.selectionModule.sectionFormat.evenPageFooter.linkToPrevious;
                break;
            case 'FirstPageHeader':
                this.linkToPrevious.checked = this.documentEditor.selectionModule.sectionFormat.firstPageHeader.linkToPrevious;
                break;
            case 'FirstPageFooter':
                this.linkToPrevious.checked = this.documentEditor.selectionModule.sectionFormat.firstPageFooter.linkToPrevious;
                break;
            }
        }
    }
    public destroy(): void {

        this.unWireEvents();
        this.removeHTMLDOM();
        if (this.element) {
            this.element.innerHTML = '';
            if (this.element.parentElement) {
                this.element.parentElement.removeChild(this.element);
            }
        }
        this.element = undefined;
        if (this.firstPage) {
            this.firstPage.destroy();
        }
        this.firstPage = undefined;
        if (this.oddOrEven) {
            this.oddOrEven.destroy();
        }
        this.oddOrEven = undefined;
        if (this.linkToPrevious) {
            this.linkToPrevious.destroy();
        }
        this.linkToPrevious = undefined;
        if (this.headerFromTop) {
            this.headerFromTop.destroy();
            this.headerFromTop = undefined;
        }
        if (this.footerFromTop) {
            this.footerFromTop.destroy();
            this.footerFromTop = undefined;
        }
        this.container = undefined;
        this.localObj = undefined;
        this.elementId = undefined;
    }

    private unWireEvents(): void {
        this.headerFromTop.element.removeEventListener('click', this.HeaderTopApplyClickHook);
        this.footerFromTop.element.removeEventListener('click', this.FooterTopApplyClickHook);
        this.headerFromTop.element.removeEventListener('keydown', this.OnHeaderValueKeyDownHook);
        this.footerFromTop.element.removeEventListener('keydown', this.OnFooterValueKeyDownHook);
        this.headerFromTop.element.removeEventListener('blur', this.ChangeHeaderBlurHook);
        this.footerFromTop.element.removeEventListener('blur', this.ChangeFooterBlurHook);

        this.HeaderTopApplyClickHook = undefined;
        this.FooterTopApplyClickHook = undefined;
        this.OnHeaderValueKeyDownHook = undefined;
        this.OnFooterValueKeyDownHook = undefined;
        this.ChangeHeaderBlurHook = undefined;
        this.ChangeFooterBlurHook = undefined;
    }

    private removeHTMLDOM(): void {
        this.headerDiv.remove();
        this.headerLabel.remove();
        this.closeIcon.remove();
        this.optionsLabelDiv.remove();
        this.optionsLabel.remove();
        this.optionsDiv.remove();
        this.firstPageDiv.remove();
        this.oddOrEvenDiv.remove();
        this.linkToPreviousDiv.remove();
        this.positionLabelDiv.remove();
        this.positionLabel.remove();
        this.positionDiv.remove();
        this.headerTopDiv.remove();
        this.headerTopLabel.remove();
        this.footerBottomDiv.remove();
        this.footerBottomLabel.remove();
        this.divElement.remove();
    }
}
