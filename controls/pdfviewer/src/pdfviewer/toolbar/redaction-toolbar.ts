import { Browser, createElement, initializeCSPTemplate, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Toolbar as Tool, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase, ISelection, IPageAnnotationBounds, TextAlignment, Toolbar, ISize, ITextMarkupAnnotation, IRectangle, InputElement } from '../index';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { Dialog, Tooltip } from '@syncfusion/ej2-popups';
import { Tab } from '@syncfusion/ej2-navigations';
import { ColorPicker, Slider, TextBox } from '@syncfusion/ej2-inputs';
import { Button, CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { ComboBox, DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';


/**
 * @hidden
 */
export interface IRedactionSettings {
    markerFillColor: string,
    markerBorderColor: string,
    markerOpacity: number,
    overlayText: string,
    fontSize: number,
    fontFamily: string,
    fontColor: string,
    fillColor: string,
    textAlignment: TextAlignment,
    isRepeat: boolean,
    useOverlayText: boolean,
}

/**
 * Redaction Toolbar module
 */
export class RedactionToolbar {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public primaryToolbar: Toolbar;
    private readonly defaultRedactionSettings: IRedactionSettings = {
        markerFillColor: '',
        markerBorderColor: '',
        markerOpacity: 0,
        overlayText: '',
        fontSize: 0,
        fontFamily: '',
        fontColor: '',
        fillColor: '',
        textAlignment: 'Left',
        isRepeat: false,
        useOverlayText: false
    };
    private updatedProperties: IRedactionSettings = {...this.defaultRedactionSettings};
    /**
     * @private
     */
    public toolbarElement: HTMLElement;
    private markForRedactionItem: HTMLElement;
    private redactPagesItem: HTMLElement;
    private redactTextItem: HTMLElement;
    private redactionPanelItem: HTMLElement;
    private redactItem: HTMLElement;
    private deleteItem: HTMLElement;
    private commentItem: HTMLElement;
    private closeItem: HTMLElement;
    private tabControl: Tab;
    /**
     * @private
     */
    public toolbar: Tool;
    private propertiesDialog: Dialog;
    private pageDialog: Dialog;
    /**
     * @private
     */
    public redactDialogObj: Dialog;
    private useOverlayTextCheck: CheckBox;
    private repeatOverlayTextCheck: CheckBox;
    private overlayTextBox: TextBox;
    private pageRangeTextBox: TextBox;
    private opacitySlider: Slider;
    private fillOpacityValue: HTMLElement;
    private pageRangeDiv: HTMLElement;
    private redactionPropertiesContainer: HTMLElement;
    private redactionPagePanelContainer: HTMLElement;
    private redactionContentContainer: HTMLElement;
    private overlayMainDiv: HTMLElement;
    private overlaySections: HTMLElement[];
    private fontFamilyMainDiv: HTMLElement;
    private fontSizeMainDiv: HTMLElement;
    private fontColorMainDiv: HTMLElement;
    private fontAlignMainDiv: HTMLElement;
    private repeatOverlayMainDiv: HTMLElement;
    private isPageRangeValid: boolean;
    private overlayTextMainDiv: HTMLElement;
    /**
     * @private
     */
    public isToolbarHidden: boolean = false;
    /**
     * @private
     */
    public isPropertyDialogOpen: boolean = false;
    /**
     * @private
     */
    public isTextRedactMode: boolean = false;
    /**
     * @private
     */
    public isTextRedact: boolean = false;
    /**
     * @private
     */
    public isPageDialogOpen: boolean = false;
    /**
     * @private
     */
    public toolbarCreated: boolean;


    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase, toolbar: Toolbar) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
        this.primaryToolbar = toolbar;
    }

    /**
     * @private
     * @returns {void}
     */
    public initializeRedactionToolbar(): void {
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_redaction_toolbar', className: 'e-pv-redaction-toolbar' });
        if (this.pdfViewer.isInsertBefore) {
            const toolbarContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotation_toolbar') as HTMLElement;
            if (toolbarContainer && toolbarContainer.parentNode === this.pdfViewerBase.viewerMainContainer) {
                this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, toolbarContainer.nextSibling);
            }
        } else {
            this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        }
        this.toolbar = new Tool({
            width: '', height: '', overflowMode: 'Popup', cssClass: 'e-pv-toolbar-scroll',
            items: this.createToolbarItems(), clicked: this.onToolbarClicked.bind(this)
        });
        this.toolbar.isStringTemplate = true;
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.appendTo(this.toolbarElement);
        this.afterToolbarCreation();
        this.showRedactionToolbar(null, true);
        this.toolbarElement.setAttribute('aria-label', 'Redaction Toolbar');
    }

    private createToolbarItems(): any[] {
        const items: any[] = [];
        items.push({ prefixIcon: 'e-pv-text-redact-icon e-pv-icon', className: 'e-pv-mark-for-redaction-container', id: this.pdfViewer.element.id + '_markForRedaction', align: 'Left', tabIndex: '0' });
        items.push({ prefixIcon: 'e-pv-redact-pages-icon e-pv-icon', className: 'e-pv-redact-pages-container', id: this.pdfViewer.element.id + '_redactPages', align: 'Left', tabIndex: '0' });
        items.push({ prefixIcon: 'e-pv-redaction-panel-icon e-pv-icon', className: 'e-pv-redaction-panel-container', id: this.pdfViewer.element.id + '_redactionPanel', align: 'Left', tabIndex: '0' });
        items.push({ prefixIcon: 'e-pv-redaction-icon e-pv-icon', className: 'e-pv-redaction-container', id: this.pdfViewer.element.id + '_redact', align: 'Left', tabIndex: '0' });
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_redaction_delete', align: 'Left', tabIndex: '0' });
        items.push({ prefixIcon: 'e-pv-comment-panel-icon e-pv-icon', className: 'e-pv-comment-panel-icon-container', id: this.pdfViewer.element.id + '_redaction_commentPanel', align: 'Right', tabIndex: '0' });
        items.push({ prefixIcon: 'e-pv-annotation-tools-close-icon e-pv-icon', className: 'e-pv-annotation-tools-close-container', id: this.pdfViewer.element.id + '_redaction_close', align: 'Right', tabIndex: '0' });
        return items;
    }

    private onToolbarClicked(args: ClickEventArgs): void {
        const targetId: string = (args.originalEvent.target as HTMLElement).parentElement.id;
        const isKeyBoardEvent: boolean = args.originalEvent && (args.originalEvent as any).pointerType !== 'mouse' && (args.originalEvent as any).pointerType !== 'touch';
        switch (targetId) {
        case this.pdfViewer.element.id + '_markForRedaction':
        case this.pdfViewer.element.id + '_markForRedactionIcon':
        case this.pdfViewer.element.id + '_markForRedactionContainer':
            this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
            this.handleMarkForRedaction();
            break;
        case this.pdfViewer.element.id + '_redactPages':
        case this.pdfViewer.element.id + '_redactPagesIcon':
        case this.pdfViewer.element.id + '_redactPagesContainer':
            this.pdfViewer.tool = '';
            this.isTextRedactMode = false;
            this.pdfViewer.toolbarModule.deSelectItem(this.markForRedactionItem);
            this.createRedactPagesWindow();
            break;
        case this.pdfViewer.element.id + '_redactionPanel':
        case this.pdfViewer.element.id + '_redactionPanelIcon':
        case this.pdfViewer.element.id + '_redactionPanelContainer':
            this.pdfViewer.tool = '';
            this.isTextRedactMode = false;
            this.pdfViewer.toolbarModule.deSelectItem(this.markForRedactionItem);
            this.createPropertiesWindow();
            break;
        case this.pdfViewer.element.id + '_redact':
        case this.pdfViewer.element.id + '_redactIcon':
        case this.pdfViewer.element.id + '_redactContainer':
        {
            this.pdfViewer.tool = '';
            this.isTextRedactMode = false;
            this.pdfViewer.toolbarModule.deSelectItem(this.markForRedactionItem);
            if (!this.pdfViewer.redactionSettings.disableConfirmationPopup) {
                this.createRedactDialog();
            } else {
                this.pdfViewer.annotationModule.handleRedact(args);
            }
            break;
        }
        case this.pdfViewer.element.id + '_redaction_delete':
        case this.pdfViewer.element.id + '_redaction_deleteIcon':
        case this.pdfViewer.element.id + '_redaction_deleteContainer':
            this.pdfViewer.toolbarModule.deSelectItem(this.markForRedactionItem);
            this.pdfViewer.annotationModule.deleteAnnotation();
            this.pdfViewer.toolbarModule.annotationToolbarModule.resetFreeTextAnnot();
            break;
        case this.pdfViewer.element.id + '_redaction_commentPanel':
        case this.pdfViewer.element.id + '_redaction_commentPanelIcon':
        case this.pdfViewer.element.id + '_redaction_commentPanelContainer': {
            this.pdfViewer.toolbarModule.deSelectItem(this.markForRedactionItem);
            const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            if (commentPanel.style.display === 'block') {
                this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
            } else {
                this.pdfViewer.annotationModule.showCommentsPanel();
                if (isKeyBoardEvent && !isNullOrUndefined(commentPanel.firstElementChild) &&
                        !isNullOrUndefined(commentPanel.firstElementChild.lastElementChild) &&
                        commentPanel.firstElementChild.lastElementChild instanceof HTMLButtonElement) {
                    commentPanel.firstElementChild.lastElementChild.focus();
                }
            }
            break;
        }
        case this.pdfViewer.element.id + '_redaction_close':
        case this.pdfViewer.element.id + '_redaction_closeIcon':
        case this.pdfViewer.element.id + '_redaction_closeContainer': {
            const commentsPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentsPanel.style.display === 'block') {
                this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
            }
            this.showRedactionToolbar(this.primaryToolbar.redactionItem);
            break;
        }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public handleRedactions(): void {
        if (!this.pdfViewer.redactionSettings.disableConfirmationPopup) {
            this.createRedactDialog();
        } else {
            this.pdfViewer.annotationModule.handleRedact();
        }
    }

    /**
     * @param {boolean} isEnable - isEnable
     * @private
     * @returns {void}
     */
    public showHideDeleteIcon(isEnable: boolean): void {
        if (this.toolbar){
            this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
            this.deleteItem.setAttribute('tabindex', isEnable ? '0' : '-1');
            this.deleteItem.setAttribute('data-tabindex', isEnable ? '0' : '-1');

        }
    }

    /**
     * @param {boolean} isEnable - isEnable
     * @private
     * @returns {void}
     */
    public showHideRedactIcon(isEnable: boolean): void {
        if (this.toolbar){
            this.toolbar.enableItems(this.redactItem.parentElement, isEnable);
            this.redactItem.setAttribute('tabindex', isEnable ? '0' : '-1');
            this.redactItem.setAttribute('data-tabindex', isEnable ? '0' : '-1');
        }
    }

    private createRedactDialog(): void {
        const elementID: string = this.pdfViewer.element.id;
        const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_dialog', className: 'e-pv-redaction-confirmation-popup' });
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        this.redactDialogObj = new Dialog({
            header: this.pdfViewer.localeObj.getConstant('Apply Redaction'),
            showCloseIcon: true,
            content:  '<span class="e-pv-redaction-confirmation-text">' + this.pdfViewer.localeObj.getConstant('Redact Content') + '</span>',
            target: this.pdfViewer.element,
            isModal: true,
            animationSettings: { effect: 'None' },
            buttons: [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Apply'), isPrimary: true }, click: this.pdfViewer.annotationModule.handleRedact.bind(this) }
            ],
            close: () => {
                this.destroyRedactWindow();
            }
        });
        this.redactDialogObj.appendTo(dialogDiv);
    }

    private createRedactPagesWindow(): void {
        const elementID: string = this.pdfViewer.element.id;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_dialog', className: 'e-dialog e-lib e-pv-redaction-page-mark-dialog e-dlg-modal e-popup e-control e-popup-open' });
            const pageTab: HTMLElement = this.createPageTab();
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            this.pageDialog = new Dialog({
                showCloseIcon: true, closeOnEscape: true, isModal: true, header: this.pdfViewer.localeObj.getConstant('Mark Page Range'),
                width: '400px', target: this.pdfViewer.element, content: pageTab, beforeOpen: () => {
                    this.isPageDialogOpen = true;
                }, allowDragging: true, close: () => {
                    this.destroyPageWindow();
                    this.isPageDialogOpen = false;
                }
            });
            this.pageDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onPageMarkCancelClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save'), isPrimary: true }, click: this.OnsavePageMarkSettings.bind(this) }
            ];
            if (this.pdfViewer.enableRtl) {
                this.pageDialog.enableRtl = true;
            }
            this.pageDialog.appendTo(dialogDiv);
        } else {
            this.redactionPagePanelContainer = createElement('div', { id: this.pdfViewer.element.id + '_pagePanel', className: 'e-pv-redaction-page-mark-panel' });
            this.pdfViewerBase.mainContainer.appendChild(this.redactionPagePanelContainer);
            if (this.pdfViewer.enableRtl) {
                this.redactionPagePanelContainer.style.left = 0 + 'px';
            } else {
                this.redactionPagePanelContainer.style.right = 0 + 'px';
            }
            this.redactionPagePanelContainer.style.bottom = 0 + 'px';
            this.redactionPagePanelContainer.style.zIndex = '1001';
            this.createPagePanelTitleContainer();
            this.redactionPagePanelContainer.style.display = 'block';
            this.redactionContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentscontentcontainer', className: 'e-pv-redaction-content-container' });
            this.redactionPagePanelContainer.appendChild(this.redactionContentContainer);
            this.redactionContentContainer.appendChild(this.createPageTab());
            const viewer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerMainContainer');
            viewer.insertBefore(this.redactionPagePanelContainer,
                                this.pdfViewer.toolbarModule.toolbarElement);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public createPropertiesWindow(): void {
        const elementID: string = this.pdfViewer.element.id;
        this.updatedProperties = this.redactionSettingsInitialValues();
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const height: string = '520px';
            const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_dialog', className: 'e-dialog e-lib e-pv-redaction-properties-dialog e-dlg-modal e-popup e-control e-popup-open' });
            const appearanceTab: HTMLElement = this.createAppearanceTab();
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            this.propertiesDialog = new Dialog({
                showCloseIcon: true, closeOnEscape: true, isModal: true, header: this.getPropertyPanelHeaderContent() + ' ' + this.pdfViewer.localeObj.getConstant('Properties'),
                minHeight: height, width: '370px', target: this.pdfViewer.element, content: appearanceTab, beforeOpen: () => {
                    this.isPropertyDialogOpen = true;
                }, allowDragging: true, close: () => {
                    this.destroyPropertiesWindow();
                    this.isPropertyDialogOpen = false;
                }
            });
            this.propertiesDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save'), isPrimary: true }, click: this.onSaveClicked.bind(this) }
            ];
            if (this.pdfViewer.enableRtl) {
                this.propertiesDialog.enableRtl = true;
            }
            this.propertiesDialog.appendTo(dialogDiv);
        } else {
            this.redactionPropertiesContainer = createElement('div', { id: this.pdfViewer.element.id + '_redactPanel', className: 'e-pv-redaction-property-panel e-pv-blazor-redaction-property-panel-mobile e-pv-block' });
            this.pdfViewerBase.mainContainer.appendChild(this.redactionPropertiesContainer);
            if (this.pdfViewer.enableRtl) {
                this.redactionPropertiesContainer.style.left = 0 + 'px';
            } else {
                this.redactionPropertiesContainer.style.right = 0 + 'px';
            }
            this.redactionPropertiesContainer.style.bottom = 0 + 'px';
            this.redactionPropertiesContainer.style.zIndex = '1001';
            this.createRedactionPanelTitleContainer();
            this.redactionPropertiesContainer.style.display = 'block';
            this.redactionContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentscontentcontainer', className: 'e-pv-redaction-content-container' });
            this.redactionPropertiesContainer.appendChild(this.redactionContentContainer);
            this.redactionContentContainer.appendChild(this.createAppearanceTabForMobile());
            const viewer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerMainContainer');
            viewer.insertBefore(this.redactionPropertiesContainer,
                                this.pdfViewer.toolbarModule.toolbarElement);
        }
    }


    private createRedactionPanelTitleContainer(): void {
        const commentPanelTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitleContainer', className: 'e-pv-redaction-panel-title-container' });
        const commentpanelTilte: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitle', className: 'e-pv-comment-panel-title', attrs: { 'tabindex': '-1' } });
        commentpanelTilte.innerText = this.pdfViewer.localeObj.getConstant('Redaction') + ' ' + this.pdfViewer.localeObj.getConstant('Properties');
        const saveButton: HTMLElement = createElement('button', { className: 'e-pv-save-button e-pv-blazor-save-button e-primary' });
        saveButton.setAttribute('type', 'button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', this.onSaveClicked.bind(this));
        const button: Button = new Button({ isPrimary: true });
        button.appendTo(saveButton);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && !isBlazor()) {
            const commentCloseIconDiv: HTMLElement = createElement('button');
            commentCloseIconDiv.setAttribute('aria-label', 'annotation button');
            commentCloseIconDiv.setAttribute('type', 'button');
            commentCloseIconDiv.style.borderColor = 'transparent';
            commentCloseIconDiv.style.paddingTop = '11px';
            commentCloseIconDiv.style.paddingBottom = '11px';
            commentCloseIconDiv.style.backgroundColor = 'transparent';
            commentCloseIconDiv.addEventListener('click', this.closeRedactionPanelContainer.bind(this));
            commentpanelTilte.style.left = '37px';
            const commentCloseIcon: HTMLElement = createElement('span', { className: 'e-pv-annotation-tools-close-icon e-pv-icon' });
            commentCloseIconDiv.appendChild(commentCloseIcon);
            commentPanelTitleContainer.appendChild(commentCloseIconDiv);
        }
        commentPanelTitleContainer.appendChild(commentpanelTilte);
        commentPanelTitleContainer.appendChild(saveButton);
        this.redactionPropertiesContainer.appendChild(commentPanelTitleContainer);
    }

    private createPagePanelTitleContainer(): void {
        const commentPanelTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_pageMarkPanelTitleContainer', className: 'e-pv-redaction-panel-title-container' });
        const commentpanelTilte: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitle', className: 'e-pv-comment-panel-title', attrs: { 'tabindex': '-1' } });
        commentpanelTilte.innerText = this.pdfViewer.localeObj.getConstant('Mark Page Range');
        const saveButton: HTMLElement = createElement('button', { className: 'e-pv-save-button e-pv-blazor-save-button e-primary' });
        saveButton.setAttribute('type', 'button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', this.OnsavePageMarkSettings.bind(this));
        const button: Button = new Button({ isPrimary: true });
        button.appendTo(saveButton);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && !isBlazor()) {
            const commentCloseIconDiv: HTMLElement = createElement('button');
            commentCloseIconDiv.setAttribute('aria-label', 'annotation button');
            commentCloseIconDiv.setAttribute('type', 'button');
            commentCloseIconDiv.style.borderColor = 'transparent';
            commentCloseIconDiv.style.paddingTop = '11px';
            commentCloseIconDiv.style.paddingBottom = '11px';
            commentCloseIconDiv.style.backgroundColor = 'transparent';
            commentCloseIconDiv.addEventListener('click', this.closePagePanelContainer.bind(this));
            commentpanelTilte.style.left = '37px';
            const commentCloseIcon: HTMLElement = createElement('span', { className: 'e-pv-annotation-tools-close-icon e-pv-icon' });
            commentCloseIconDiv.appendChild(commentCloseIcon);
            commentPanelTitleContainer.appendChild(commentCloseIconDiv);
        }
        commentPanelTitleContainer.appendChild(commentpanelTilte);
        commentPanelTitleContainer.appendChild(saveButton);
        this.redactionPagePanelContainer.appendChild(commentPanelTitleContainer);
    }

    /**
     * @private
     * @returns {void}
     */
    public closeRedactionPanelContainer(): void {
        let proxy: RedactionToolbar = null;
        // eslint-disable-next-line
        proxy = this;
        const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_redactPanel');
        if (commentPanel) {
            commentPanel.style.display = 'none';
            commentPanel.remove();
            if (proxy.pdfViewerBase) {
                proxy.pdfViewerBase.updateZoomValue();
            }
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            if (Browser.isDevice && !isBlazor()) {
                if (this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar) {
                    this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar.element.style.display = 'block';
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public closePagePanelContainer(): void {
        let proxy: RedactionToolbar = null;
        // eslint-disable-next-line
        proxy = this;
        const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pagePanel');
        if (commentPanel) {
            commentPanel.style.display = 'none';
            commentPanel.remove();
            if (proxy.pdfViewerBase) {
                proxy.pdfViewerBase.updateZoomValue();
            }
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            if (Browser.isDevice && !isBlazor()) {
                if (this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar) {
                    this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar.element.style.display = 'block';
                }
            }
        }
    }

    private getPropertyPanelHeaderContent(): string {
        return this.pdfViewer.localeObj.getConstant('Redaction');
    }

    private createPageTab(): HTMLElement {
        const pageTabMainDiv: HTMLElement = createElement('div', { className: 'e-pv-redaction-page-mark-content' });
        // Create and append radio options
        pageTabMainDiv.appendChild(this.createRadioOption('radioCurrentPage', 'CurrentPage', 'Current Page'));
        pageTabMainDiv.appendChild(this.createRadioOption('radioOddPages', 'OddPages', 'Odd Pages Only'));
        pageTabMainDiv.appendChild(this.createRadioOption('radioEvenPages', 'EvenPages', 'Even Pages Only'));
        pageTabMainDiv.appendChild(this.createRadioOption('radioSpecificPages', 'SpecificPages', 'Specific Pages'));
        // Create and append the page range div (initially hidden)
        this.pageRangeDiv = createElement('div', {
            className: 'e-pv-page-range-row',
            styles: 'display: none;' // Hide initially
        });
        const labelDiv: HTMLElement = createElement('div', { className: 'e-pv-page-range-label' });
        labelDiv.textContent = this.pdfViewer.localeObj.getConstant('Page Range');
        this.pageRangeDiv.appendChild(labelDiv);
        this.isPageRangeValid = true;
        const clsName: string = (!Browser.isDevice || this.pdfViewer.enableDesktopMode) ?
            'e-pv-page-range-input' : 'e-pv-redaction-mobile-page-range-input';
        const inputWrapper: HTMLElement = createElement('div', { className: clsName });
        const inputElement: HTMLInputElement = createElement('input', { attrs: { type: 'text' } }) as HTMLInputElement;
        // Attach blur event for validation
        inputElement.addEventListener('blur', () => {
            const pageRangeValue: string = inputElement.value.trim();
            const pageCount: number = this.pdfViewer.pageCount; // Assuming this is available
            const result: any = this.checkValidation(pageRangeValue, pageCount);
            inputElement.className = result.textBoxCssClass;

            // Optional: show error message if needed
            if (!this.isPageRangeValid) {
                if (!document.getElementById('pageRangeError')) {
                    const errorLabel: any = createElement('label', {
                        className: 'e-error',
                        id: 'pageRangeError'
                    });
                    errorLabel.textContent = this.pdfViewer.localeObj.getConstant('Invalid page range');
                    inputWrapper.appendChild(errorLabel);
                }
            } else {
                const errorLabel: any = document.getElementById('pageRangeError');
                if (errorLabel) {
                    errorLabel.remove();
                }
            }
        });
        inputWrapper.appendChild(inputElement);
        this.pageRangeTextBox = new TextBox({
            placeholder: this.getEnterPageRangeContent()
        });
        this.pageRangeTextBox.appendTo(inputElement);
        this.pageRangeDiv.appendChild(inputWrapper);
        pageTabMainDiv.appendChild(this.pageRangeDiv);
        return pageTabMainDiv;
    }

    private checkValidation(pageRangeValue: string, pageCount: number): { textBoxCssClass: string } {
        const isValid: boolean = this.isValidPageRangeFormat(pageRangeValue, pageCount);
        this.isPageRangeValid = isValid;
        return {
            textBoxCssClass: isValid ? '' : 'e-control e-textbox e-lib e-input'
        };
    }

    private isValidPageRangeFormat(value: string, pageCount: number): boolean {
        if (!value || value.trim() === '') {
            return false;
        }

        // eslint-disable-next-line
        const regex: any = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;
        if (!regex.test(value)) {
            return false;
        }

        const ranges: string[] = value.split(',').map((r: any) => r.trim());
        for (const range of ranges) {
            const parts: number[] = range.split('-').map((p: any) => parseInt(p.trim(), 10));

            if (parts.length === 1) {
                const page: any = parts[0];
                if (isNaN(page) || page < 1 || page > pageCount) {
                    return false;
                }
            } else if (parts.length === 2) {
                const start: number = parts[0];
                const end: number = parts[1];
                if (
                    isNaN(start) || isNaN(end) ||
                    start < 1 || end < 1 ||
                    start > end || end > pageCount
                ) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    private createRadioOption(id: string, value: string, labelText: string): HTMLElement {
        const mainDiv: HTMLElement = createElement('div', { className: 'e-pv-redaction-radio-option' });
        const radioWrapper: HTMLElement = createElement('div', { className: 'e-radio-wrapper e-wrapper' });
        const input: HTMLElement = document.createElement('input');
        input.id = id;
        radioWrapper.appendChild(input);
        const radioButton: RadioButton = new RadioButton({
            label: labelText,
            name: 'pageSelection',
            value: value,
            checked: false,
            change: (args: any) => this.pageOptionChanged(args)
        });
        if (value === 'CurrentPage') {
            radioButton.checked = true;
        }
        radioButton.appendTo(input);
        mainDiv.appendChild(radioWrapper);
        return mainDiv;
    }

    private getEnterPageRangeContent(): string {
        const pageCount: number = this.pdfViewer.pageCount;
        if (pageCount > 0) {
            if (pageCount > 3) {
                return `1, 2, 1-${pageCount}`;
            } else {
                return `1-${pageCount}`;
            }
        }
        return '1-60'; // Default fallback value
    }



    private createAppearanceTab(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const appearanceDiv: HTMLElement = createElement('div', { className: 'e-control e-tab e-lib e-pv-default-tab e-keyboard' });
        this.tabControl = new Tab({
            items: [
                {
                    header: { 'text': this.pdfViewer.localeObj.getConstant('General') }, content: this.createGeneralProperties()
                },
                {
                    header: { 'text': this.pdfViewer.localeObj.getConstant('Appearance') }, content: this.createAppearanceProperties()
                }
            ],
            selecting: this.select,
            selected: this.onOpacityChange.bind(this)
        }, appearanceDiv);
        (appearanceDiv.children[1] as HTMLElement).style.height = '100%';
        return appearanceDiv;
    }

    private createAppearanceTabForMobile(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const appearanceDiv: HTMLElement = createElement('div', { className: 'e-control e-tab e-lib e-pv-default-tab e-keyboard' });
        this.tabControl = new Tab({
            items: [
                {
                    header: { 'text': this.pdfViewer.localeObj.getConstant('General') }, content: this.createGeneralPropertiesForMobile()
                },
                {
                    header: { 'text': this.pdfViewer.localeObj.getConstant('Appearance') }, content: this.createAppearancePropertiesForMobile()
                }
            ],
            selecting: this.select,
            selected: this.onOpacityChange.bind(this)
        }, appearanceDiv);
        (appearanceDiv.children[1] as HTMLElement).style.height = '100%';
        return appearanceDiv;
    }


    private createGeneralProperties(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        // Create the main container div
        const generalPropertiesMainDiv: HTMLElement = createElement('div');
        // Create child elements and append them
        const table: HTMLElement = createElement('table', { className: 'e-pv-redaction-table' });
        const tr1: HTMLElement = document.createElement('tr');
        tr1.className = 'e-pv-tr';
        const td1: HTMLElement = document.createElement('td');
        td1.className = 'e-pv-redaction-table-tr';
        const fillColorLabel: HTMLElement = createElement('span', {
            className: 'e-pv-redaction-property-panel-text e-pv-redaction-fill-text',
            id: elementID + '_properties_formfield_fillcolor_label'
        });
        fillColorLabel.textContent = 'Fill Color';
        td1.appendChild(fillColorLabel);
        // Create color picker container
        const colorPickerContainer: HTMLElement = createElement('div', {
            className: 'e-colorpicker-container e-hide-opacity e-pv-redaction-fill-color'
        });
        const inputElement: HTMLElement = createElement('input');
        colorPickerContainer.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            mode: 'Picker', enableOpacity: false, value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.fillColor)), showButtons: false, modeSwitcher: false, change: this.fillColorChanged.bind(this)
        });
        colorPicker.appendTo(inputElement);
        td1.appendChild(colorPickerContainer);
        // Create useOverlayText div
        const overlayTextCheckboxWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-properties-form-field-use-overlay-text e-pv-redaction-overlay-text e-pv-overlaytext'
        });
        this.useOverlayTextCheck = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Use Overlay Text'), cssClass: 'e-pv-properties-form-field-use-overlay-text e-pv-redaction-overlay-text e-pv-overlaytext', checked: this.updatedProperties.useOverlayText, change: this.onUseOverlayTextClick.bind(this) });
        td1.appendChild(overlayTextCheckboxWrapper);
        // Append the checkbox to the wrapper
        this.useOverlayTextCheck.appendTo(overlayTextCheckboxWrapper);
        tr1.appendChild(td1);
        table.appendChild(tr1);
        generalPropertiesMainDiv.appendChild(table);
        // overlay main div element
        this.overlayMainDiv = createElement('div', {
            className: 'e-pv-redaction-can-overlay e-item e-overlay'
        });
        // Create child elements and append them
        const fontTable: HTMLElement = createElement('table', { className: 'e-pv-redaction-font-table' });
        const fontTr1: HTMLElement = document.createElement('tr');
        const fontTd1: HTMLElement = document.createElement('td');
        fontTd1.textContent = 'Font Style';
        fontTd1.setAttribute('colspan', '2');
        fontTr1.appendChild(fontTd1);
        fontTable.appendChild(fontTr1);
        //tr2
        const fontTr2: HTMLElement = document.createElement('tr');
        fontTr2.className = 'e-pv-tr';
        const fontTd2: HTMLElement = document.createElement('td');
        //tr2 div1
        const fontFamilyMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-redaction-font-family'
        });
        const fontStyle: { [key: string]: Object }[] = [{ FontName: 'Helvetica' },
            { FontName: 'Courier' }, { FontName: 'Symbol' }, { FontName: 'Times New Roman' }];
        // Create the select element dynamically
        const selectElement: HTMLElement = document.createElement('input');
        selectElement.id = 'fontFamilyDropdown';
        fontFamilyMainDiv.appendChild(selectElement);
        // Initialize the DropDownList
        const fontFamilyDropDown: DropDownList = new DropDownList({
            dataSource: fontStyle,
            query: new Query().select(['FontName']),
            fields: { text: 'FontName', value: 'FontName' },
            value: this.updatedProperties.fontFamily,
            placeholder: 'Select a font family',
            change: this.onFontFamilyChange.bind(this),
            cssClass: 'e-pv-properties-formfield-font-family' // Equivalent to @inputName
        });
        // Append to the DOM
        fontFamilyDropDown.appendTo(selectElement);
        fontTd2.appendChild(fontFamilyMainDiv);
        //tr2 div2
        const fontSizeMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-redaction-font-size'
        });
        // font size input
        const fontSizeInputElement: HTMLElement = document.createElement('input');
        fontSizeInputElement.id = 'fontSizeDropdown';
        fontSizeMainDiv.appendChild(fontSizeInputElement);
        // Define the font size list
        const fontSizes: string[] = [
            '6px', '8px', '10px', '12px', '14px', '16px',
            '18px', '20px', '24px', '28px', '32px', '36px', '40px'
        ];
        // Initialize the ComboBox
        const fontSizeDropDown: ComboBox = new ComboBox({
            dataSource: fontSizes,
            value: this.updatedProperties.fontSize + 'px',
            showClearButton: false,
            change: this.onFontSizeChange.bind(this),
            cssClass: 'e-pv-properties-formfield-font-size' // Replace with your @inputName if needed
        });
        // Append ComboBox to the input element
        fontSizeDropDown.appendTo(fontSizeInputElement);
        fontTd2.appendChild(fontSizeMainDiv);
        fontTr2.appendChild(fontTd2);
        fontTable.appendChild(fontTr2);
        //tr3
        const fontTr3: HTMLElement = document.createElement('tr');
        fontTr3.className = 'e-pv-tr';
        const fontTd3: HTMLElement = document.createElement('td');
        const fontColorSpan: HTMLElement = createElement('span', { className: 'e-pv-redaction-property-panel-text e-pv-redaction-font-color-text' });
        fontColorSpan.id = elementID + '_properties_formfield_fontcolor_label';
        fontColorSpan.textContent = 'Font Color';
        fontTd3.appendChild(fontColorSpan);
        const fontColrPickerMainDiv: HTMLElement = createElement('div', {
            className: 'e-colorpicker-container e-hide-opacity e-pv-properties-form-field-font-color e-pv-redaction-font-color'
        });
        const inputElement1: HTMLElement = createElement('input');
        fontColrPickerMainDiv.appendChild(inputElement1);
        const fontColorPicker: ColorPicker = new ColorPicker({
            mode: 'Picker', enableOpacity: false, value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.fontColor)), showButtons: false, modeSwitcher: false, change: this.fontColorChanged.bind(this)
        });
        fontColorPicker.appendTo(inputElement1);
        fontTd3.appendChild(fontColrPickerMainDiv);
        const fontAlignMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-properties-form-field-font-align e-pv-redaction-text-align'
        });
        // Enum for text alignment
        enum TextAlignment {
            Left = 'Left',
            Center = 'Center',
            Right = 'Right'
        }
        // Create alignment buttons
        const alignments: { type: TextAlignment; iconClass: string; divClass: string; tooltip: string }[] = [
            { type: TextAlignment.Left, iconClass: 'e-pv-left-align-icon', divClass: 'e-pv-left-align-icon-div', tooltip: 'Align Left' },
            { type: TextAlignment.Center, iconClass: 'e-pv-center-align-icon', divClass: 'e-pv-center-align-icon-div', tooltip: 'Align Center' },
            { type: TextAlignment.Right, iconClass: 'e-pv-right-align-icon', divClass: 'e-pv-right-align-icon-div', tooltip: 'Align Right' }
        ];
        alignments.forEach((alignment: any) => {
            const div: HTMLElement = createElement('div', {
                id: `redaction_${alignment.type.toLowerCase()}_align_div`,
                className: `${alignment.divClass} e-pv-form-field-tooltip`,
                attrs: { title: alignment.tooltip }
            });
            const span: HTMLElement = createElement('span', {
                id: `redaction_${alignment.type.toLowerCase()}_align_span`,
                className: `${alignment.iconClass} e-pv-icon`
            });
            if (alignment.type === this.updatedProperties.textAlignment ||
                alignment.type.toLowerCase() === this.updatedProperties.textAlignment) {
                div.classList.add('e-pv-li-select');
            }
            div.appendChild(span);
            div.onclick = () => this.toggleAlignment(alignment.type);
            fontAlignMainDiv.appendChild(div);
        });
        fontTd3.appendChild(fontAlignMainDiv);
        fontTr3.appendChild(fontTd3);
        fontTable.appendChild(fontTr3);
        //tr4
        const fontTr4: HTMLElement = document.createElement('tr');
        fontTr4.className = 'e-pv-tr';
        const fontTd4: HTMLElement = document.createElement('td');
        const repeatTextMainDiv: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-properties-form-field-repeat-text'
        });
        this.repeatOverlayTextCheck = new CheckBox({ label: this.pdfViewer.localeObj.getConstant('Repeat Overlay Text'), cssClass: 'e-pv-properties-form-field-repeat-text', checked: this.updatedProperties.isRepeat, change: this.onRepeatOverlayTextClick.bind(this) });
        fontTd4.appendChild(repeatTextMainDiv);
        this.repeatOverlayTextCheck.appendTo(repeatTextMainDiv);
        fontTr4.appendChild(fontTd4);
        fontTable.appendChild(fontTr4);
        //tr5
        const fontTr5: HTMLElement = document.createElement('tr');
        fontTr5.className = 'e-pv-tr';
        const fontTd5: HTMLElement = document.createElement('td');
        const overlayTextSpan1: HTMLElement = createElement('span', { className: 'e-pv-redaction-property-panel-text e-pv-redaction-overlay-text' });
        overlayTextSpan1.id = elementID + '_properties_formfield_overlaytext_label';
        overlayTextSpan1.textContent = 'Overlay Text';
        fontTd5.appendChild(overlayTextSpan1);
        const overlayTextMainDiv: HTMLElement = createElement('div', {
            className: 'e-pv-redaction-overlat-input'
        });
        fontTd5.appendChild(overlayTextMainDiv);
        // Create a input container for the TextBox
        const overlayTextBoxContainer: HTMLElement = createElement('input');
        overlayTextMainDiv.appendChild(overlayTextBoxContainer);
        // overlay textbox
        this.overlayTextBox = new TextBox({ type: 'text', floatLabelType: 'Never', placeholder: this.pdfViewer.localeObj.getConstant('REDACTED'), cssClass: 'e-pv-properties-formfield-overlay-text',
            change: this.overlayTextValueChanged.bind(this)});
        if (this.updatedProperties.overlayText !== '') {
            this.overlayTextBox.value = this.updatedProperties.overlayText;
        }
        this.overlayTextBox.appendTo(overlayTextBoxContainer);
        fontTr5.appendChild(fontTd5);
        fontTable.appendChild(fontTr5);
        this.overlayMainDiv.appendChild(fontTable);
        generalPropertiesMainDiv.appendChild(this.overlayMainDiv);
        if (this.useOverlayTextCheck.checked) {
            this.overlayMainDiv.className = 'e-pv-redaction-can-overlay';
        }
        return generalPropertiesMainDiv;
    }

    private createGeneralPropertiesForMobile(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        // Create the main container div
        const generalPropertiesMainDiv: HTMLElement = createElement('div', { className: 'e-pv-general-tab-content-mobile' });
        const fillColorMainDiv: HTMLElement = createElement('div', { className: 'e-pv-fill-prop-group-mobile'});
        const fillColorLabel: HTMLElement = createElement('div', {
            className: 'e-pv-fill-prop-lable-mobile'
        });
        fillColorLabel.textContent = 'Fill Color';
        fillColorMainDiv.appendChild(fillColorLabel);
        const colorPickerContainer: HTMLElement = createElement('div', {
            className: 'e-pv-fill-prop-mobile'
        });
        const inputElement: HTMLElement = createElement('input');
        colorPickerContainer.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.fillColor)),
            showButtons: false,
            modeSwitcher: false,
            change: this.fillColorChanged.bind(this)
        });
        colorPicker.appendTo(inputElement);
        fillColorMainDiv.appendChild(colorPickerContainer);
        generalPropertiesMainDiv.appendChild(fillColorMainDiv);
        const useOverlayTextMainDiv: HTMLElement = createElement('div', { className: 'e-pv-use-overlay-text-prop-mobile'});
        const overlayTextCheckboxWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-properties-form-field-use-overlay-text'
        });
        this.useOverlayTextCheck = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Use Overlay Text'),
            cssClass: 'e-pv-properties-form-field-use-overlay-text e-pv-redaction-overlay-mobile-text e-pv-mobile-overlaytext',
            checked: this.updatedProperties.useOverlayText,
            change: this.onUseOverlayTextClickForMobile.bind(this)
        });
        useOverlayTextMainDiv.appendChild(overlayTextCheckboxWrapper);
        this.useOverlayTextCheck.appendTo(overlayTextCheckboxWrapper);
        generalPropertiesMainDiv.appendChild(useOverlayTextMainDiv);
        this.overlayMainDiv = createElement('div', {
            className: 'e-pv-redaction-can-overlay e-item e-overlay'
        });
        this.fontFamilyMainDiv = createElement('div', { className: 'e-pv-font-family-prop-group-mobile e-item e-overlay'});
        const fontFamilyLabel: HTMLElement = createElement('div', {
            className: 'e-pv-font-family-prop-lable-mobile'
        });
        fontFamilyLabel.textContent = 'Font Family';
        this.fontFamilyMainDiv.appendChild(fontFamilyLabel);
        //Font Family
        const fontFamilyDiv: HTMLElement = createElement('div', {
            className: 'e-pv-font-family-prop-mobile e-pv-blazor-font-family-prop-mobile'
        });
        const fontStyle: { [key: string]: Object }[] = [{ FontName: 'Helvetica' },
            { FontName: 'Courier' }, { FontName: 'Symbol' }, { FontName: 'Times New Roman' }];
        // Create the select element dynamically
        const selectElement: HTMLElement = document.createElement('input');
        selectElement.id = 'fontFamilyDropdown';
        fontFamilyDiv.appendChild(selectElement);
        // Initialize the DropDownList
        const fontFamilyDropDown: DropDownList = new DropDownList({
            dataSource: fontStyle,
            query: new Query().select(['FontName']),
            fields: { text: 'FontName', value: 'FontName' },
            value: this.updatedProperties.fontFamily,
            placeholder: 'Select a font family',
            change: this.onFontFamilyChange.bind(this),
            cssClass: 'e-pv-properties-formfield-font-family' // Equivalent to @inputName
        });
        // Append to the DOM
        fontFamilyDropDown.appendTo(selectElement);
        this.fontFamilyMainDiv.appendChild(fontFamilyDiv);
        // tr3.appendChild(td33);
        generalPropertiesMainDiv.appendChild(this.fontFamilyMainDiv);
        this.fontSizeMainDiv = createElement('div', { className: 'e-pv-font-size-prop-group-mobile e-item e-overlay'});
        const fontSizeLabel: HTMLElement = createElement('div', {
            className: 'e-pv-font-size-prop-group-mobile e-item'
            // id: elementID + '_properties_formfield_fillcolor_label'
        });
        fontSizeLabel.textContent = 'Font Size';
        this.fontSizeMainDiv.appendChild(fontSizeLabel);
        // font size input
        const fontSizeDiv: HTMLElement = createElement('div', {
            className: 'e-pv-font-size-prop-mobile e-pv-blazor-font-size-prop-mobile'
        });
        const fontSizeInputElement: HTMLElement = document.createElement('input');
        fontSizeInputElement.id = 'fontSizeDropdown';
        fontSizeDiv.appendChild(fontSizeInputElement);
        // Define the font size list
        const fontSizes: string[] = [
            '6px', '8px', '10px', '12px', '14px', '16px',
            '18px', '20px', '24px', '28px', '32px', '36px', '40px'
        ];
        // Initialize the ComboBox
        const fontSizeDropDown: ComboBox = new ComboBox({
            dataSource: fontSizes,
            value: this.updatedProperties.fontSize + 'px',
            showClearButton: false,
            change: this.onFontSizeChange.bind(this),
            cssClass: 'e-pv-properties-formfield-font-size' // Replace with your @inputName if needed
        });
        // Append ComboBox to the input element
        fontSizeDropDown.appendTo(fontSizeInputElement);
        this.fontSizeMainDiv.appendChild(fontSizeDiv);
        // tr4.appendChild(td44);
        generalPropertiesMainDiv.appendChild(this.fontSizeMainDiv);
        this.fontColorMainDiv = createElement('div', { className: 'e-pv-font-color-prop-group-mobile e-item e-overlay'});
        const fontColorLabel: HTMLElement = createElement('div', {
            className: 'e-pv-font-color-prop-group-mobile e-item'
        });
        fontColorLabel.textContent = 'Font Color';
        this.fontColorMainDiv.appendChild(fontColorLabel);
        const colorPickerContainer1: HTMLElement = createElement('div', {
            className: 'e-pv-font-color-prop-mobile'
        });
        const inputElement1: HTMLElement = createElement('input');
        colorPickerContainer1.appendChild(inputElement1);
        const colorPicker1: ColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.fontColor)),
            showButtons: false,
            modeSwitcher: false,
            change: this.fillColorChanged.bind(this)
        });
        colorPicker1.appendTo(inputElement1);
        this.fontColorMainDiv.appendChild(colorPickerContainer1);
        generalPropertiesMainDiv.appendChild(this.fontColorMainDiv);

        this.fontAlignMainDiv = createElement('div', { className: 'e-pv-font-align-prop-group-mobile e-item e-overlay'});
        const textAlignLabel: HTMLElement = createElement('div', {
            className: 'e-pv-font-align-prop-lable-mobile'
        });
        textAlignLabel.textContent = 'Text Align';
        this.fontAlignMainDiv.appendChild(textAlignLabel);
        const fontAlign: HTMLElement = createElement('div', {className: 'e-pv-font-align-prop-mobile'});
        const fontAlignDiv: HTMLElement = createElement('div', {
            className: 'e-pv-properties-form-field-font-align'
        });
        // Enum for text alignment
        enum TextAlignment {
            Left = 'Left',
            Center = 'Center',
            Right = 'Right'
        }
        // Create alignment buttons
        const alignments: { type: TextAlignment; iconClass: string; divClass: string; tooltip: string }[] = [
            { type: TextAlignment.Left, iconClass: 'e-pv-left-align-icon', divClass: 'e-pv-left-align-icon-div', tooltip: 'Align Left' },
            { type: TextAlignment.Center, iconClass: 'e-pv-center-align-icon', divClass: 'e-pv-center-align-icon-div', tooltip: 'Align Center' },
            { type: TextAlignment.Right, iconClass: 'e-pv-right-align-icon', divClass: 'e-pv-right-align-icon-div', tooltip: 'Align Right' }
        ];
        alignments.forEach((alignment: any) => {
            const div: HTMLElement = createElement('div', {
                id: `redaction_${alignment.type.toLowerCase()}_align_div`,
                className: `${alignment.divClass} e-pv-form-field-tooltip`,
                attrs: { title: alignment.tooltip }
            });
            const span: HTMLElement = createElement('span', {
                id: `redaction_${alignment.type.toLowerCase()}_align_span`,
                className: `${alignment.iconClass} e-pv-icon`
            });
            if (alignment.type === this.updatedProperties.textAlignment ||
                alignment.type.toLowerCase() === this.updatedProperties.textAlignment) {
                div.classList.add('e-pv-li-select');
            }
            div.appendChild(span);
            div.onclick = () => this.toggleAlignment(alignment.type);
            fontAlignDiv.appendChild(div);
        });
        fontAlign.appendChild(fontAlignDiv);
        this.fontAlignMainDiv.appendChild(fontAlign);
        generalPropertiesMainDiv.appendChild(this.fontAlignMainDiv);
        this.repeatOverlayMainDiv = createElement('div', { className: 'e-pv-repeat-text-prop-mobile e-item e-overlay'});
        const repeatTextMainDiv: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-properties-form-field-repeat-text'
        });
        this.repeatOverlayTextCheck = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Repeat Overlay Text'),
            cssClass: 'e-pv-properties-form-field-repeat-text',
            checked: this.updatedProperties.isRepeat,
            change: this.onRepeatOverlayTextClick.bind(this)
        });
        this.repeatOverlayMainDiv.appendChild(repeatTextMainDiv);
        this.repeatOverlayTextCheck.appendTo(repeatTextMainDiv);
        generalPropertiesMainDiv.appendChild(this.repeatOverlayMainDiv);
        this.overlayTextMainDiv = createElement('div', { className: 'e-pv-overlay-text-prop-group-mobile e-item e-overlay'});
        const overlayTextSpan1: HTMLElement = createElement('div', { className: 'e-pv-overlay-text-prop-lable-mobile' });
        overlayTextSpan1.textContent = 'Overlay Text';
        this.overlayTextMainDiv.appendChild(overlayTextSpan1);
        const overlayTextDiv: HTMLElement = createElement('div', {
            className: 'e-pv-overlay-text-prop-mobile'
        });
        this.overlayTextMainDiv.appendChild(overlayTextDiv);
        // Create a input container for the TextBox
        const overlayTextBoxContainer: HTMLElement = createElement('input');
        overlayTextDiv.appendChild(overlayTextBoxContainer);
        // overlay textbox
        this.overlayTextBox = new TextBox({ type: 'text', floatLabelType: 'Never', placeholder: this.pdfViewer.localeObj.getConstant('REDACTED'), cssClass: 'e-pv-properties-formfield-overlay-text',
            change: this.overlayTextValueChanged.bind(this)});
        if (this.updatedProperties.overlayText !== '') {
            this.overlayTextBox.value = this.updatedProperties.overlayText;
        }
        this.overlayTextBox.appendTo(overlayTextBoxContainer);
        generalPropertiesMainDiv.appendChild(this.overlayTextMainDiv);
        generalPropertiesMainDiv.appendChild(this.overlayMainDiv);
        this.overlaySections = [
            this.fontFamilyMainDiv,
            this.fontSizeMainDiv,
            this.fontColorMainDiv,
            this.fontAlignMainDiv,
            this.repeatOverlayMainDiv,
            this.overlayTextMainDiv
        ];
        if (this.useOverlayTextCheck.checked) {
            this.enableOrdisableOverlayDiv(true);
        }
        return generalPropertiesMainDiv;
    }


    private createAppearanceProperties(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const table: HTMLElement = createElement('table', { className: 'e-pv-redaction-table' });
        const tr1: HTMLElement = document.createElement('tr');
        tr1.className = 'e-pv-tr';
        const td1: HTMLElement = document.createElement('td');
        td1.className = 'e-pv-redaction-table-tr';
        // Outline Color
        const outlineColorLabel: HTMLElement = createElement('span', {
            className: 'e-pv-redaction-property-panel-text e-pv-redaction-outline-text'
        });
        outlineColorLabel.textContent = 'Outline Color';
        td1.appendChild(outlineColorLabel);
        // Create color picker container
        const colorPickerContainerOutline: HTMLElement = createElement('div', {
            className: 'e-pv-redaction-color-picker'
        });
        const inputElement: HTMLElement = createElement('input');
        colorPickerContainerOutline.appendChild(inputElement);
        const outlineColorPickerMainDiv: ColorPicker = new ColorPicker({
            mode: 'Picker', enableOpacity: false, value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.markerBorderColor)), showButtons: false, modeSwitcher: false, change: this.outlineColorChanged.bind(this)
        });
        outlineColorPickerMainDiv.appendTo(inputElement);
        td1.appendChild(colorPickerContainerOutline);
        // Fill Color
        const fillColorLabel: HTMLElement = createElement('span', {
            className: 'e-pv-redaction-property-panel-text e-pv-redaction-mark-fill-text'
        });
        fillColorLabel.textContent = 'Fill Color';
        td1.appendChild(fillColorLabel);
        // Create color picker container
        const colorPickerContainer: HTMLElement = createElement('div', {
            className: 'e-pv-redaction-color-picker'
        });
        const inputElement1: HTMLElement = createElement('input');
        colorPickerContainer.appendChild(inputElement1);
        const fillColorPickerMainDiv: ColorPicker = new ColorPicker({
            mode: 'Picker', enableOpacity: false, value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.markerFillColor)),
            showButtons: false, modeSwitcher: false, change: this.outlineFillColorChanged.bind(this)
        });
        fillColorPickerMainDiv.appendTo(inputElement1);
        td1.appendChild(colorPickerContainer);
        tr1.appendChild(td1);
        table.appendChild(tr1);
        const tr2: HTMLElement = document.createElement('tr');
        tr1.className = 'e-pv-tr';
        const td2: HTMLElement = document.createElement('td');
        td2.className = 'e-pv-redaction-opacity-container';
        // Fill Color
        const fillOpacityLabel: HTMLElement = createElement('span', {
            className: 'e-pv-redaction-property-panel-text e-pv-redaction-opacity-text'
        });
        fillOpacityLabel.textContent = 'Fill Opacity';
        td2.appendChild(fillOpacityLabel);
        this.fillOpacityValue = createElement('span', {
            className: 'e-pv-redaction-opactity-value'
        });
        this.fillOpacityValue.textContent = parseInt(Math.round(this.updatedProperties.markerOpacity as number).toString(), 10) + '%';
        td2.appendChild(this.fillOpacityValue);
        // Create the container for the opacity slider
        const opacityContainer: HTMLElement = createElement('div', {
            className: 'e-pv-redaction-opacity-container'
        });
        td2.appendChild(opacityContainer);
        // Initialize the slider
        this.opacitySlider = new Slider({
            type: 'MinRange',
            min: 0,
            max: 100,
            change: (args: any) => {
                this.updateOpacityIndicator(args); // Make sure this method exists
            }
        });
        // Append the slider to the container
        this.opacitySlider.appendTo(opacityContainer);
        tr2.appendChild(td2);
        table.appendChild(tr2);
        return table;
    }

    private createAppearancePropertiesForMobile(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const mainDiv: HTMLElement = createElement('div', {className: 'e-pv-appearance-tab-content-mobile'});
        const outlineColorMainDiv: HTMLElement = createElement('div', { className: 'e-pv-fill-prop-group-mobile'});
        const outlineColorLabel: HTMLElement = createElement('div', {
            className: 'e-pv-fill-prop-lable-mobile'
        });
        outlineColorLabel.textContent = 'Outline Color';
        outlineColorMainDiv.appendChild(outlineColorLabel);
        const colorPickerContainer1: HTMLElement = createElement('div', {
            className: 'e-pv-fill-prop-mobile'
        });
        const inputElement1: HTMLElement = createElement('input');
        colorPickerContainer1.appendChild(inputElement1);
        const colorPicker1: ColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.markerBorderColor)),
            showButtons: false,
            modeSwitcher: false,
            change: this.outlineColorChanged.bind(this)
        });
        colorPicker1.appendTo(inputElement1);
        outlineColorMainDiv.appendChild(colorPickerContainer1);
        mainDiv.appendChild(outlineColorMainDiv);
        const fillColorMainDiv: HTMLElement = createElement('div', { className: 'e-pv-fill-prop-group-mobile'});
        const fillColorLabel: HTMLElement = createElement('div', {
            className: 'e-pv-fill-prop-lable-mobile'
        });
        fillColorLabel.textContent = 'Fill Color';
        fillColorMainDiv.appendChild(fillColorLabel);
        const colorPickerContainer: HTMLElement = createElement('div', {
            className: 'e-pv-fill-prop-mobile'
        });
        const inputElement: HTMLElement = createElement('input');
        colorPickerContainer.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: this.rgbaToHex(this.getRgbCode(this.updatedProperties.markerFillColor)),
            showButtons: false,
            modeSwitcher: false,
            change: this.outlineFillColorChanged.bind(this)
        });
        colorPicker.appendTo(inputElement);
        fillColorMainDiv.appendChild(colorPickerContainer);
        mainDiv.appendChild(fillColorMainDiv);
        const opacityMainDiv: HTMLElement = createElement('div', { className: 'e-pv-fill-opacity-prop-group-mobile'});
        const fillOpacityLabel: HTMLElement = createElement('div', {
            className: 'e-pv-fill-opacity-prop-lable-mobile'
        });
        fillOpacityLabel.textContent = 'Fill Opacity';
        this.fillOpacityValue = createElement('span', {
            className: 'e-pv-redaction-opactity-value'
        });
        this.fillOpacityValue.textContent = parseInt(Math.round(this.updatedProperties.markerOpacity as number).toString(), 10) + '%';
        fillOpacityLabel.appendChild(this.fillOpacityValue);
        opacityMainDiv.appendChild(fillOpacityLabel);
        // opacity slider
        const opacityDiv: HTMLElement = document.createElement('div');
        opacityDiv.className = 'e-pv-fill-opacity-prop-mobile';
        // Create the container for the opacity slider
        const opacityContainer: HTMLElement = createElement('div', {
            className: 'e-pv-redaction-mobile-opacity-container'
        });
        opacityDiv.appendChild(opacityContainer);
        // Initialize the slider
        this.opacitySlider = new Slider({
            type: 'MinRange',
            min: 0,
            max: 100,
            change: (args: any) => {
                this.updateOpacityIndicator(args); // Make sure this method exists
            }
        });
        // Append the slider to the container
        this.opacitySlider.appendTo(opacityContainer);
        opacityMainDiv.appendChild(opacityDiv);
        mainDiv.appendChild(opacityMainDiv);
        return mainDiv;
    }

    // Function to toggle alignment
    private toggleAlignment(alignment: TextAlignment): void {
        // Create a list of alignment IDs
        const alignmentDivIds: any = [
            'redaction_left_align_div',
            'redaction_right_align_div',
            'redaction_center_align_div'
        ];
        // Remove 'e-pv-li-select' class from all alignment divs
        alignmentDivIds.forEach((id: any) => {
            const alignmentDiv: HTMLElement = document.getElementById(id);
            if (alignmentDiv.classList.contains('e-pv-li-select')) {
                alignmentDiv.classList.remove('e-pv-li-select');
            }
        });
        // Add 'e-pv-li-select' class to the selected alignment div
        const selectedAlignmentDiv: HTMLElement = document.getElementById(`redaction_${alignment.toLowerCase()}_align_div`);
        selectedAlignmentDiv.classList.add('e-pv-li-select');
        this.updatedProperties.textAlignment = alignment;
    }

    private pageOptionChanged(args: any): void {
        if (args.value === 'SpecificPages') {
            this.pageRangeDiv.style.display = 'flex';
        } else {
            this.pageRangeDiv.style.display = 'none';
        }
    }

    private redactionSettingsInitialValues(): IRedactionSettings {
        let settings: any;
        if (this.pdfViewer.selectedItems.annotations.length > 0) {
            settings = this.pdfViewer.selectedItems.annotations[0];
        } else if (this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            settings = this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else {
            settings = this.pdfViewer.redactionSettings;
        }
        this.updatedProperties.markerBorderColor = settings.markerBorderColor;
        this.updatedProperties.markerFillColor = settings.markerFillColor;
        this.updatedProperties.markerOpacity = (settings.markerOpacity <= 1) ? (settings.markerOpacity * 100) : settings.markerOpacity;
        this.updatedProperties.fillColor = settings.fillColor;
        this.updatedProperties.fontFamily = settings.fontFamily;
        this.updatedProperties.fontColor = settings.fontColor;
        this.updatedProperties.fontSize = settings.fontSize;
        this.updatedProperties.textAlignment = settings.textAlign ? settings.textAlign : settings.textAlignment;
        this.updatedProperties.overlayText = settings.overlayText;
        this.updatedProperties.isRepeat = settings.isRepeat;
        const textAlign: string = settings.textAlign ? settings.textAlign : settings.textAlignment;
        if (settings.isRepeat === true || settings.fontFamily !== 'Helvetica' || (settings.fontColor !== '#ff0000' && settings.fontColor !== 'rgba(255, 0, 0, 1.00)' &&
            settings.fontColor !== 'rgba(255, 0, 0, 1)') || textAlign !== 'center' || settings.overlayText !== '') {
            this.updatedProperties.useOverlayText = true;
        } else {
            this.updatedProperties.useOverlayText = false;
        }
        return this.updatedProperties;
    }

    private getRgbCode(colorString: string): any {
        // eslint-disable-next-line
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        const stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
        }
        return colorString;
    }

    private rgbaToHex(str: string): string {
        if (str.includes('rgba')) {
            // eslint-disable-next-line security/detect-unsafe-regex
            const match: RegExpMatchArray = str.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
            if (!match) {
                return str;
            }
            const r: number = parseInt(match[1], 10);
            const g: number = parseInt(match[2], 10);
            const b: number = parseInt(match[3], 10);
            let a: number = match[4] !== undefined ? parseFloat(match[4]) : 1;
            // Clamp alpha to [0, 1] range if input uses 0–255 scale
            if (a > 1) {
                a = Math.min(a / 255, 1);
            }
            // Manual padding for hex
            const toHex: any = (num: number): string => {
                const hex: string = num.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            const rHex: any = toHex(r);
            const gHex: any = toHex(g);
            const bHex: any = toHex(b);
            const aHex: any = toHex(Math.round(a * 255));
            return `#${rHex}${gHex}${bHex}${aHex}`;
        }
        return str; // return original if not rgba
    }


    private updateOpacityIndicator(args: any): void {
        this.fillOpacityValue.textContent = (args.value) + '%';
        this.updatedProperties.markerOpacity = args.value as number;
    }

    private onOpacityChange(args: any): void {
        this.opacitySlider.value = this.updatedProperties.markerOpacity;
    }

    private fillColorChanged(args: any): void {
        this.updatedProperties.fillColor = args.currentValue.hex;
    }

    private outlineColorChanged(args: any): void {
        this.updatedProperties.markerBorderColor = args.currentValue.hex;
    }

    private outlineFillColorChanged(args: any): void {
        this.updatedProperties.markerFillColor = args.currentValue.hex;
    }

    private fontColorChanged(args: any): void {
        this.updatedProperties.fontColor = args.currentValue.hex;
    }

    private onFontFamilyChange(args: any): void {
        let currentValue: string;
        if (!isBlazor()) {
            currentValue = (args && args.value) ? args.value : '';
        } else {
            currentValue = args;
        }
        if (currentValue != null)
        {
            this.updatedProperties.fontFamily = currentValue;
        }
    }

    private onFontSizeChange(args: any, isInteracted: boolean): void {
        let currentValue: string;
        if (!isBlazor()) {
            currentValue = (args && args.value) ? args.value : '';
        } else {
            currentValue = args;
        }
        let fontSize: any = currentValue;
        if (fontSize != null)
        {
            fontSize = parseInt(fontSize.replace('px', ''), 10);
            this.updatedProperties.fontSize = fontSize;
        }
    }

    private onCancelClicked(args: any): void {
        this.propertiesDialog.hide();
    }

    private onPageMarkCancelClicked(args: any): void {
        this.pageDialog.hide();
    }

    private select(e: any): void {
        if (e.isSwiped) {
            e.cancel = true; // Prevent swiping between tab items
        }
    }

    private OnsavePageMarkSettings(): void {
        const selectedRadio: HTMLInputElement = document.querySelector('input[name="pageSelection"]:checked') as HTMLInputElement;
        const pages: number[] = [];
        if (!selectedRadio) {
            console.warn('No page selection option selected.');
            return;
        }
        const selectedValue: string = selectedRadio.value;
        const totalPages: number = this.pdfViewer.pageCount;
        const currentPage: number = this.pdfViewer.currentPageNumber - 1;
        switch (selectedValue) {
        case 'CurrentPage':
            pages.push(currentPage);
            break;

        case 'OddPages':
            for (let i: number = 0; i < totalPages; i += 2) {
                pages.push(i);
            }
            break;

        case 'EvenPages':
            for (let i: number = 1; i < totalPages; i += 2) {
                pages.push(i);
            }
            break;

        case 'SpecificPages':
            // eslint-disable-next-line no-case-declarations
            const pageRange: string = this.pageRangeTextBox.value;
            if (pageRange && pageRange.trim() !== '') {
                const parsedPages: number[] = this.parsePageRange(pageRange, totalPages);
                pages.push(...parsedPages);
            }
            break;
        }
        if (pages.length > 0 && this.isPageRangeValid) {
            this.pdfViewerBase.redactPages(pages);
        }
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) && this.isPageRangeValid) {
            this.pageDialog.hide(); // Close the dialog
        } else {
            if (this.isPageRangeValid) {
                this.closePagePanelContainer();
            }
        }
    }

    private parsePageRange(range: string, maxPage: number): number[] {
        const pages: Set<number> = new Set<number>();
        const parts: string[] = range.split(',');
        for (const part of parts) {
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-').map((p: any) => parseInt(p.trim(), 10));
                if (!isNaN(startStr) && !isNaN(endStr)) {
                    for (let i: number = startStr; i <= endStr; i++) {
                        if (i >= 1 && i <= maxPage) {
                            pages.add(i - 1); // Convert to 0-based index
                        }
                    }
                }
            } else {
                const page: number = parseInt(part.trim(), 10);
                if (!isNaN(page) && page >= 1 && page <= maxPage) {
                    pages.add(page - 1); // Convert to 0-based index
                }
            }
        }
        return Array.from(pages).sort((a: number, b: number) => a - b);
    }



    private onSaveClicked(): void {
        if (this.pdfViewer.selectedItems.annotations.length > 0) {
            this.pdfViewerBase.updateRedactionAnnotation(this.updatedProperties);
        } else if (this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            this.pdfViewerBase.updateRedactionAnnotation(this.updatedProperties);
        } else {
            this.pdfViewer.redactionSettings.fillColor = this.updatedProperties.fillColor;
            this.pdfViewer.redactionSettings.markerBorderColor = this.updatedProperties.markerBorderColor;
            this.pdfViewer.redactionSettings.markerFillColor = this.updatedProperties.markerFillColor;
            this.pdfViewer.redactionSettings.markerOpacity = this.updatedProperties.markerOpacity;
            this.pdfViewer.redactionSettings.fontColor = this.updatedProperties.fontColor;
            this.pdfViewer.redactionSettings.fontSize = this.updatedProperties.fontSize;
            this.pdfViewer.redactionSettings.fontSize = this.updatedProperties.fontSize;
            this.pdfViewer.redactionSettings.fontFamily = this.updatedProperties.fontFamily;
            this.pdfViewer.redactionSettings.isRepeat = this.updatedProperties.isRepeat;
            this.pdfViewer.redactionSettings.overlayText = this.updatedProperties.overlayText;
            this.pdfViewer.redactionSettings.textAlignment = this.updatedProperties.textAlignment;
        }
        this.updatedProperties = {...this.defaultRedactionSettings};
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.propertiesDialog.hide();
        } else {
            this.closeRedactionPanelContainer();
        }
    }

    private handleMarkForRedaction(): void {
        if (this.isTextRedactMode) {
            this.isTextRedactMode = false;
            this.pdfViewer.tool = '';
            this.pdfViewer.toolbarModule.deSelectItem(this.markForRedactionItem);
        } else {
            this.isTextRedactMode = true;
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.pdfViewer.toolbarModule.deSelectItem(this.redactPagesItem);
                this.pdfViewer.toolbarModule.deSelectItem(this.redactItem);
                this.pdfViewer.toolbarModule.deSelectItem(this.redactionPanelItem);
                this.pdfViewer.toolbarModule.selectItem(this.markForRedactionItem);
            }
            const selectionObject: ISelection[] = this.pdfViewer.textSelectionModule ?
                this.pdfViewer.textSelectionModule.selectionRangeArray : [];
            if (selectionObject.length > 0 && !this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained) {
                this.handleTextRedact();
            }
            this.pdfViewer.annotationModule.redactionAnnotationModule.setAnnotationType('Redaction');
            this.pdfViewer.toolbarModule.annotationToolbarModule.onRedactionDrawSelection();
        }
    }


    /**
     * @private
     * @returns {void}
     */
    public handleTextRedact(): void {
        let isDrawn: boolean = false;
        this.isTextRedact = true;
        const isCleared: boolean = true;
        const selectionObject: ISelection[] = this.pdfViewer.textSelectionModule ?
            this.pdfViewer.textSelectionModule.selectionRangeArray : [];
        if (selectionObject.length > 0 && !this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained) {
            isDrawn = true;
            this.convertSelectionToRedactText('Redaction', selectionObject, this.pdfViewerBase.getZoomFactor());
            this.showHideRedactIcon(true);
            this.showHideDeleteIcon(true);
        }
        const selection: Selection = window.getSelection();
        let targetElement: any;
        if (selection && selection.anchorNode) {
            targetElement = selection.anchorNode.parentElement;
        }
        if (window.getSelection().toString()  && !isDrawn) {
            const pageBounds: IPageAnnotationBounds[] = this.pdfViewer.annotation.textMarkupAnnotationModule.getDrawnBounds();
            const isMultiSelect: boolean = false;
            if (pageBounds.length > 0) {
                for (let i: number = 0; i < pageBounds.length; i++) {
                    this.pdfViewer.annotation.redactionAnnotationModule.drawTextRedact('Redaction', pageBounds[parseInt(i.toString(), 10)].bounds,
                                                                                       pageBounds[parseInt(i.toString(), 10)].pageIndex,
                                                                                       pageBounds[parseInt(i.toString(), 10)].rect,
                                                                                       this.pdfViewerBase.getZoomFactor(),
                                                                                       pageBounds[parseInt(i.toString(), 10)].textContent,
                                                                                       pageBounds[parseInt(i.toString(), 10)].startIndex,
                                                                                       pageBounds[parseInt(i.toString(), 10)].endIndex,
                                                                                       isMultiSelect, targetElement);
                }
            }
            this.showHideRedactIcon(true);
            this.showHideDeleteIcon(true);
        }
        if (!isNullOrUndefined(this.pdfViewer.annotation) && !isNullOrUndefined(this.pdfViewer.annotation.textMarkupAnnotationModule)) {
            this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
        }
        if (isCleared && this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        this.isTextRedact = false;
    }

    private convertSelectionToRedactText(type: string, selectionObject: ISelection[], factor: number): void {
        let isMultiSelect: boolean = false;
        for (let i: number = 0; i < selectionObject.length; i++) {
            const textValue: string = selectionObject[parseInt(i.toString(), 10)].textContent;
            let indexes: any;
            if (selectionObject[parseInt(i.toString(), 10)].startNode === selectionObject[parseInt(i.toString(), 10)].endNode) {
                const parentText: string = document.getElementById(selectionObject[parseInt(i.toString(), 10)].startNode).textContent;
                // eslint-disable-next-line max-len
                indexes = this.pdfViewer.annotation.textMarkupAnnotationModule.getIndexNumbers(selectionObject[parseInt(i.toString(), 10)].pageNumber, textValue, parentText);
            } else {
                // eslint-disable-next-line max-len
                indexes = this.pdfViewer.annotation.textMarkupAnnotationModule.getIndexNumbers(selectionObject[parseInt(i.toString(), 10)].pageNumber, textValue);
            }
            if (!isMultiSelect) {
                for (let n: number = 1; n < selectionObject.length; n++) {
                    if (selectionObject[parseInt(n.toString(), 10)].pageNumber !== selectionObject[0].pageNumber) {
                        isMultiSelect = true;
                        break;
                    }
                }
            }
            this.pdfViewer.annotation.redactionAnnotationModule.drawTextRedact('Redaction',
                                                                               selectionObject[parseInt(i.toString(), 10)].rectangleBounds,
                                                                               selectionObject[parseInt(i.toString(), 10)].pageNumber,
                                                                               selectionObject[parseInt(i.toString(), 10)].bound,
                                                                               factor, textValue, indexes.startIndex, indexes.endIndex,
                                                                               isMultiSelect,
                                                                               // eslint-disable-next-line max-len
                                                                               document.getElementById(selectionObject[parseInt(i.toString(), 10)].startNode));
        }
    }

    //Events
    private onUseOverlayTextClick(event: any): void {
        if (event.checked) {
            this.useOverlayTextCheck.checked = true;
            this.overlayMainDiv.className = 'e-pv-redaction-can-overlay';
        } else {
            this.useOverlayTextCheck.checked = false;
            this.overlayMainDiv.className = 'e-pv-redaction-can-overlay e-item e-overlay';
        }
    }

    private onUseOverlayTextClickForMobile(event: any): void {
        if (event.checked) {
            this.useOverlayTextCheck.checked = true;
            this.enableOrdisableOverlayDiv(true);
        } else {
            this.useOverlayTextCheck.checked = false;
            this.enableOrdisableOverlayDiv(false);
        }
    }

    private enableOrdisableOverlayDiv(enable: boolean): void {
        if (!this.overlaySections) {return; } // Protect against early use
        for (const section of this.overlaySections) {
            if (enable) {
                section.classList.remove('e-overlay');
            } else {
                section.classList.add('e-overlay');
            }
        }
    }

    private onRepeatOverlayTextClick(event: any): void {
        if (event.checked) {
            this.repeatOverlayTextCheck.checked = true;
        } else {
            this.repeatOverlayTextCheck.checked = false;
        }
        this.updatedProperties.isRepeat = this.repeatOverlayTextCheck.checked;
    }

    private overlayTextValueChanged(args: any): void {
        const newValue: any = args.value;
        this.updatedProperties.overlayText = newValue;
    }

    private afterToolbarCreation(): void {
        const isMac: boolean = /ipad|iphone|ipod|mac/.test(navigator.userAgent.toLowerCase()) ? true : false;
        // Add classes and aria-labels for the toolbar items
        this.markForRedactionItem = this.primaryToolbar.addClassToolbarItem('_markForRedaction', 'e-pv-mark-for-redaction', this.pdfViewer.localeObj.getConstant('Mark for Redaction'));
        this.redactPagesItem = this.primaryToolbar.addClassToolbarItem('_redactPages', 'e-pv-redact-pages', this.pdfViewer.localeObj.getConstant('Redact Pages'));
        this.redactionPanelItem = this.primaryToolbar.addClassToolbarItem('_redactionPanel', 'e-pv-redaction-panel', this.pdfViewer.localeObj.getConstant('Redaction Panel'));
        this.redactItem = this.primaryToolbar.addClassToolbarItem('_redact', 'e-pv-redaction', this.pdfViewer.localeObj.getConstant('Redact'));
        this.deleteItem = this.primaryToolbar.addClassToolbarItem('_redaction_delete', 'e-pv-annotation-delete', this.pdfViewer.localeObj.getConstant('Delete') + (' (delete)'));
        this.commentItem = this.primaryToolbar.addClassToolbarItem('_redaction_commentPanel', 'e-pv-annotation-comment-panel', this.pdfViewer.localeObj.getConstant('Comment Panel') + (isMac ? ' (⌘+⌥+0)' : ' (Ctrl+Alt+0)'));
        this.closeItem = this.primaryToolbar.addClassToolbarItem('_redaction_close', 'e-pv-annotation-tools-close', this.pdfViewer.localeObj.getConstant('Close'));
        this.pdfViewerBase.getElement('_redaction_close').setAttribute('aria-label', 'Close Annotation Toolbar');
        this.showHideDeleteIcon(false);
        if (Browser.isDevice || !this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewer && this.pdfViewer.annotationCollection && this.pdfViewer.annotationCollection.length > 0) {
                const annotationsArray: any = this.pdfViewer.annotationCollection;
                const hasRedaction: boolean = annotationsArray.some(
                    (annot: any) => annot.shapeAnnotationType === 'Redaction'
                );
                if (!hasRedaction) {
                    this.showHideRedactIcon(false);
                }
            } else {
                this.showHideRedactIcon(false);
            }
        } else {
            this.showHideRedactIcon(false);
        }
    }

    /**
     * @private
     * @param {HTMLElement} element - element
     * @param {boolean} isInitialLoading - isInitialLoading
     * @param {boolean} isShow - isShow
     * @returns {void}
     */
    public showRedactionToolbar(element?: HTMLElement, isInitialLoading?: boolean, isShow?: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!this.isToolbarHidden) {
                if (element) {
                    this.primaryToolbar.deSelectItem(element);
                    this.isTextRedactMode = false;
                    this.pdfViewer.tool = '';
                    this.isTextRedact = false;
                } else {
                    if (this.pdfViewer.enableToolbar) {
                        this.primaryToolbar.deSelectItem(this.primaryToolbar.redactionItem);
                    }
                }
                this.adjustViewer(false);
                this.toolbarElement.style.display = 'none';
                if (!isInitialLoading) {
                    this.pdfViewer.isRedactionToolbarVisible = false;
                }
            } else {
                let toolBarInitialStatus: string;
                if (this.toolbarElement) {
                    toolBarInitialStatus = this.toolbarElement.style.display;
                    this.toolbarElement.style.display = 'block';
                }
                if (!isInitialLoading) {
                    this.pdfViewer.isRedactionToolbarVisible = true;
                }
                if (element) {
                    this.primaryToolbar.selectItem(element);
                } else {
                    if (this.pdfViewer.enableToolbar) {
                        this.primaryToolbar.selectItem(this.primaryToolbar.redactionItem);
                    }
                }
                if (toolBarInitialStatus === 'none') {
                    this.adjustViewer(true);
                }
            }
            if (this.pdfViewer.magnification && this.pdfViewer.magnification.fitType === 'fitToPage') {
                this.pdfViewer.magnification.fitToPage();
            }
            this.isToolbarHidden = !this.isToolbarHidden;
        }
        else {
            const editIconId: string = this.pdfViewer.element.id + '_redactionIcon';
            const editIcon: HTMLElement = document.getElementById(editIconId);
            if (editIcon.parentElement.classList.contains('e-pv-select') && !isShow || (!editIcon.parentElement.classList.contains('e-pv-select') && isShow)) {
                this.createRedactionToolbarForMobile(editIconId);
                this.pdfViewer.isRedactionToolbarVisible = isShow;
            }
        }
    }

    /**
     * @param {string} id - It discribe the annotation id.
     * @private
     * @returns {any} - any
     */
    public createRedactionToolbarForMobile(id: string): any[] {
        let hideToolbar: boolean;
        if (id) {
            const editIcon: HTMLElement = document.getElementById(id);
            if (editIcon.parentElement.classList.contains('e-pv-select')) {
                hideToolbar = true;
                editIcon.parentElement.classList.remove('e-pv-select');
            } else {
                hideToolbar = false;
                this.pdfViewer.toolbarModule.selectItem(editIcon.parentElement);
            }
        }
        if (hideToolbar) {
            this.toolbarCreated = false;
            this.adjustMobileViewer();
            if (this.toolbar) {
                this.toolbar.destroy();
            }
            const mobileAnnotationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_mobileRedactionToolbar');
            if (mobileAnnotationToolbar) {
                mobileAnnotationToolbar.style.display = 'none';
            }
            this.pdfViewer.isRedactionToolbarVisible = !hideToolbar;
            return [];
        } else {
            if (this.toolbarElement) {
                this.toolbarElement.parentElement.removeChild(this.toolbarElement);
            }
            this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_mobileRedactionToolbar', className: 'e-pv-mobile-redaction-toolbar e-pv-redaction-toolbar', styles: 'bottom: 0px; position: absolute; width: 100%; float: left;' });
            this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
            const items: any[] = [
                ({ prefixIcon: 'e-pv-text-redact-icon e-pv-icon', className: 'e-pv-mark-for-redaction-container', id: this.pdfViewer.element.id + '_markForRedaction', align: 'Left', tabIndex: '0' }),
                ({ prefixIcon: 'e-pv-redact-pages-icon e-pv-icon', className: 'e-pv-redact-pages-container', id: this.pdfViewer.element.id + '_redactPages', align: 'Left', tabIndex: '0' }),
                ({ prefixIcon: 'e-pv-redaction-panel-icon e-pv-icon', className: 'e-pv-redaction-panel-container', id: this.pdfViewer.element.id + '_redactionPanel', align: 'Left', tabIndex: '0' }),
                ({ prefixIcon: 'e-pv-redaction-icon e-pv-icon', className: 'e-pv-redaction-container', id: this.pdfViewer.element.id + '_redact', align: 'Left', tabIndex: '0' }),
                ({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_redaction_delete', align: 'Left', tabIndex: '0' }),
                ({ prefixIcon: 'e-pv-comment-panel-icon e-pv-icon', className: 'e-pv-comment-panel-icon-container', id: this.pdfViewer.element.id + '_annotation_commentPanel', align: 'Right', tabIndex: '0' }),
                ({ prefixIcon: 'e-pv-annotation-tools-close-icon e-pv-icon', className: 'e-pv-annotation-tools-close-container', id: this.pdfViewer.element.id + '_annotation_close', align: 'Right', tabIndex: '0' })
            ];
            if (this.toolbarCreated && this.toolbar) {
                this.toolbar.destroy();
                this.toolbarCreated = false;
                this.adjustMobileViewer();
            } else {
                this.toolbar = new Tool({ items: items, width: '', height: '', overflowMode: 'Scrollable', clicked: this.onToolbarClicked.bind(this) });
                if (this.pdfViewer.enableRtl) {
                    this.toolbar.enableRtl = true;
                }
                this.toolbar.isStringTemplate = true;
                this.toolbar.appendTo(this.toolbarElement);
                this.afterToolbarCreation();
                this.toolbarCreated = true;
                this.adjustMobileViewer();
            }
            this.pdfViewer.isRedactionToolbarVisible = !hideToolbar;
            return items;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public adjustMobileViewer(): void {
        let toolbarHeight: number;
        if (this.toolbarElement) {
            toolbarHeight = this.toolbarElement.clientHeight;
        }
        const isPrimaryTool: boolean = false;
        if (this.pdfViewer.enableToolbar && this.toolbarCreated) {
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (toolbarHeight + toolbarHeight)) + 'px';
        } else {
            if (!isPrimaryTool) {
                if (this.pdfViewerBase.viewerContainer.style.height.split('%').length > 1) {
                    this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (-toolbarHeight)) + 'px';
                } else {
                    this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (toolbarHeight)) + 'px';
                }
            }
        }
    }

    private resetViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return viewerHeight + toolbarHeight;
    }

    /**
     * @private
     * @returns {void}
     */
    public resetToolbar(): void {
        if (this.pdfViewer.isRedactionToolbarVisible) {
            this.adjustViewer(false);
            this.toolbarElement.style.display = '';
            this.isToolbarHidden = false;
            this.adjustViewer(true);
            this.primaryToolbar.selectItem(this.primaryToolbar.redactionItem);
            this.pdfViewer.isRedactionToolbarVisible = true;
        }
        else {
            this.toolbarElement.style.display = 'none';
            this.isToolbarHidden = true;
            this.primaryToolbar.deSelectItem(this.primaryToolbar.redactionItem);
            this.pdfViewer.isRedactionToolbarVisible = false;
        }
    }

    /**
     * @private
     * @param {boolean} isAdjust - isAdjust
     * @returns {void}
     */
    public adjustViewer(isAdjust: boolean): void {
        let splitterElement: HTMLElement;
        let toolbarContainer: HTMLElement;
        let annotationToolbarHeight: number;
        if (isBlazor()) {
            splitterElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            toolbarContainer = this.pdfViewer.element.querySelector('.e-pv-toolbar');
            const annotationToolbarContainer: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-annotation-toolbar');
            annotationToolbarHeight = this.getToolbarHeight(annotationToolbarContainer);
        } else {
            splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
            toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
            annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        }
        let toolbarHeight: number = this.getToolbarHeight(toolbarContainer);
        const sideBarToolbar: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbar;
        const sideBarContentContainer: HTMLElement = this.pdfViewerBase.navigationPane.sideBarContentContainer;
        const commentsContainer: HTMLElement = this.pdfViewerBase.navigationPane.commentPanelContainer;
        const commentPanelResizer: HTMLElement = this.pdfViewerBase.navigationPane.commentPanelResizer;
        let newToolbarHeight: string = '';
        if (isAdjust) {
            if (this.pdfViewer.enableToolbar) {
                if (!isNullOrUndefined(sideBarToolbar)) {
                    sideBarToolbar.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(sideBarContentContainer)) {
                    sideBarContentContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(splitterElement)) {
                    splitterElement.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(commentsContainer)) {
                    commentsContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                } if (!isNullOrUndefined(commentPanelResizer)) {
                    commentPanelResizer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                }
            } else {
                sideBarToolbar.style.top = (annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (annotationToolbarHeight) + 'px';
                splitterElement.style.top = (annotationToolbarHeight) + 'px';
                commentsContainer.style.top = (annotationToolbarHeight) + 'px';
                commentPanelResizer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (annotationToolbarHeight + toolbarHeight)) + 'px';
            newToolbarHeight = this.getNavigationToolbarHeight(annotationToolbarHeight + toolbarHeight);
            if (!isNullOrUndefined(sideBarToolbar)) {
                sideBarToolbar.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(splitterElement)) {
                splitterElement.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(commentPanelResizer)) {
                commentPanelResizer.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(sideBarContentContainer)) {
                sideBarContentContainer.style.height = newToolbarHeight;
            }
        } else {
            if (this.pdfViewer.enableToolbar) {
                sideBarToolbar.style.top = toolbarHeight + 'px';
                sideBarContentContainer.style.top = toolbarHeight + 'px';
                splitterElement.style.top = toolbarHeight + 'px';
                commentsContainer.style.top = toolbarHeight + 'px';
                commentPanelResizer.style.top = toolbarHeight + 'px';
            } else {
                sideBarToolbar.style.top = 1 + 'px';
                sideBarToolbar.style.height = '100%';
                sideBarContentContainer.style.top = 1 + 'px';
                sideBarContentContainer.style.height = '100%';
                splitterElement.style.top = 1 + 'px';
                splitterElement.style.height = '100%';
                commentsContainer.style.top = 1 + 'px';
                commentsContainer.style.height = '100%';
                commentPanelResizer.style.top = 1 + 'px';
                commentPanelResizer.style.height = '100%';
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), annotationToolbarHeight) + 'px';
            newToolbarHeight = this.getNavigationToolbarHeight(toolbarHeight);
            if (!isNullOrUndefined(sideBarToolbar)) {
                sideBarToolbar.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(splitterElement)) {
                splitterElement.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(commentPanelResizer)) {
                commentPanelResizer.style.height = newToolbarHeight;
            } if (!isNullOrUndefined(sideBarContentContainer)) {
                sideBarContentContainer.style.height = newToolbarHeight;
            }
            if (this.pdfViewerBase.viewerContainer.style.height === '0px') {
                this.pdfViewerBase.viewerContainer.style.height = (parseInt(this.pdfViewer.element.style.height, 10) - parseInt(sideBarToolbar.style.top, 10)) + 'px';
            }
        }
    }

    private getNavigationToolbarHeight(toolbarHeight: number): string {
        const height: number = this.pdfViewer.element.getBoundingClientRect().height;
        return (height !== 0) ? height - toolbarHeight + 'px' : '';
    }

    private updateViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return this.getElementHeight(this.pdfViewer.element) - toolbarHeight;
    }

    private getToolbarHeight(element: HTMLElement): number {
        let toolbarHeight: number = element.getBoundingClientRect().height;
        if (toolbarHeight === 0 && element === this.pdfViewerBase.getElement('_toolbarContainer')) {
            toolbarHeight = parseFloat(window.getComputedStyle(element)['height']);
        }
        return toolbarHeight;
    }

    private getElementHeight(element: HTMLElement): number {
        try {
            return element.getBoundingClientRect().height;
        } catch (error) {
            return 0;
        }
    }

    private destroyRedactWindow(): void {
        if (this.redactDialogObj != null)
        {
            this.redactDialogObj.destroy();
            this.redactDialogObj = null!;
        }
        this.pdfViewerBase.isDocumentModified = false;
    }

    private destroyPageWindow(): void {
        if (this.pageDialog != null)
        {
            this.pageDialog.destroy();
            this.pageDialog = null!;
        }
    }

    private destroyPropertiesWindow(): void {
        if (this.propertiesDialog != null)
        {
            this.propertiesDialog.destroy();
            this.propertiesDialog = null!;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        this.isTextRedactMode = false;
        this.pdfViewer.tool = '';
        this.isTextRedact = false;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.pdfViewer.toolbarModule.deSelectItem(this.redactPagesItem);
            this.pdfViewer.toolbarModule.deSelectItem(this.redactItem);
            this.pdfViewer.toolbarModule.deSelectItem(this.redactionPanelItem);
            this.pdfViewer.toolbarModule.deSelectItem(this.markForRedactionItem);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        const componentElement: HTMLElement[] = [this.markForRedactionItem, this.redactPagesItem, this.redactTextItem,
            this.redactionPanelItem, this.redactItem, this.deleteItem, this.commentItem, this.closeItem];
        for (let i: number = 0; i < componentElement.length; i++) {
            if (componentElement[parseInt(i.toString(), 10)]) {
                this.destroyDependentComponent(componentElement[parseInt(i.toString(), 10)]);
            }
        }
        this.isTextRedactMode = false;
        this.pdfViewer.tool = '';
        this.isTextRedact = false;
    }

    private destroyDependentComponent(component: any): void {
        if (component.ej2_instances) {
            for (let i: number = component.ej2_instances.length - 1; i >= 0; i--) {
                component.ej2_instances[parseInt(i.toString(), 10)].destroy();
            }
        }
    }
}

