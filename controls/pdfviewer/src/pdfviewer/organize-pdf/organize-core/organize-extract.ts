import { TextBox } from '@syncfusion/ej2-inputs';
import { Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PageOrganizer } from '../organize-pdf';
import { ItemModel, Toolbar } from '@syncfusion/ej2-navigations';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { selectTile, clearSelection } from './tile-interaction';
import { isOrganizeDialogRendered } from './organize-initialization';
import { enableDisableToolbarItems, enableToolbarItem, updateSelectAllCheckbox } from './organize-toolbar';
/**
 * @private
 * @returns { void }
 */
export function onToolbarExtractButtonClick(): void {
    // eslint-disable-next-line
    const proxy: PageOrganizer = this;
    // Allow extract only in client-side rendering mode
    if (!proxy.pdfViewerBase || !proxy.pdfViewerBase.clientSideRendering) {
        return;
    }
    const elementID: string = proxy.pdfViewer.element.id;
    const extractBtn: HTMLElement | null = document.getElementById(elementID + '_extract_pages');
    // Toggle secondary extract toolbar
    if (proxy.isExtractToolbarVisible) {
        destroySecondaryExtractToolbar.call(proxy);
        setOrganizeFooterForExtract.call(proxy, false);
        updateTileAreaHeightForSecondaryToolbar.call(proxy, false);
        proxy.isExtractToolbarVisible = false;
        if (extractBtn) { extractBtn.classList.remove('e-pv-select'); }
    } else {
        createSecondaryExtractToolbar.call(proxy);
        setOrganizeFooterForExtract.call(proxy, true);
        updateTileAreaHeightForSecondaryToolbar.call(proxy, true);
        proxy.isExtractToolbarVisible = true;
        if (extractBtn) { extractBtn.classList.add('e-pv-select'); }
    }
}

/**
 * @private
 * @returns { void }
 */
function createSecondaryExtractToolbar(): void {
    if (!this.pdfViewerBase || !this.pdfViewerBase.clientSideRendering) { return; }
    const elementID: string = this.pdfViewer.element.id;
    const toolbarHost: HTMLElement = document.getElementById(elementID + '_toolbar_appearance');
    // ensure button shows selected (bg) when opened
    const extractBtn: HTMLElement | null = document.getElementById(elementID + '_extract_pages');
    if (extractBtn) { extractBtn.classList.add('e-pv-select'); }
    if (!toolbarHost) {
        console.error('Toolbar host not found:', elementID + '_toolbar_appearance');
        return;
    }
    // Create container for secondary toolbar
    const secondaryDiv: HTMLElement = createElement('div', { id: `${elementID}_extract_toolbar`, className: 'e-pv-extract-toolbar' });
    if (toolbarHost.parentElement) {
        // If nextSibling is null, insertBefore behaves like appendChild
        toolbarHost.parentElement.insertBefore(secondaryDiv, toolbarHost.nextSibling);
    } else {
        toolbarHost.appendChild(secondaryDiv);
    }
    function pageInputTemplate(): string {
        const inputElement: HTMLElement = createElement('input', { id: `${elementID}_page_input`, attrs: { type: 'text' } });
        return inputElement.outerHTML;
    }
    function deleteCheckTemplate(): string {
        const checkboxElement: HTMLElement = createElement('input', { id: `${elementID}_extract_delete`, attrs: { type: 'checkbox' } });
        return checkboxElement.outerHTML;
    }
    function separateCheckTemplate(): string{
        const checkboxElement: HTMLElement = createElement('input', { id: `${elementID}_extract_separate`, attrs: { type: 'checkbox' } });
        return checkboxElement.outerHTML;
    }
    // Toolbar items
    const items: ItemModel[] = [
        { id: `${elementID}_extract_pages_input_item`, type: 'Input', template: pageInputTemplate(), align: 'Center' },
        { type: 'Separator', align: 'Center' },
        { id: `${elementID}_extract_delete_cb_item`, template: deleteCheckTemplate(), align: 'Center' },
        { id: `${elementID}_extract_separate_cb_item`, template: separateCheckTemplate(), align: 'Center' }
    ];
    const secondaryToolbar: Toolbar = new Toolbar({
        items: items,
        overflowMode: 'Scrollable'
    });
    secondaryToolbar.appendTo(secondaryDiv);
    // Ensure overflow calculations are correct at first paint (prevents item overlap)
    if (secondaryToolbar.refreshOverflow) {
        try { secondaryToolbar.refreshOverflow(); } catch (e) { /* no-op */ }
    }
    // Also keep it responsive on window resize
    function resizeHandler(): void {
        if (secondaryToolbar.refreshOverflow) {
            try { secondaryToolbar.refreshOverflow(); } catch (e) { /* no-op */ }
        }
    }
    window.addEventListener('resize', resizeHandler);
    (this as any).extractToolbarResizeHandler = resizeHandler;

    // Force proper centering of the middle group items
    const centerGroup: HTMLElement | null = secondaryDiv.querySelector('.e-toolbar-center') as HTMLElement;
    const centerItems: HTMLElement | null = secondaryDiv.querySelector('.e-toolbar-center .e-toolbar-items') as HTMLElement;
    if (centerGroup) {
        centerGroup.classList.add('e-pv-center-group-style');
    }
    if (centerItems) {
        centerItems.classList.add('e-pv-center-items-style');
    }
    const leftGroup: HTMLElement | null = secondaryDiv.querySelector('.e-toolbar-left') as HTMLElement;
    const rightGroup: HTMLElement | null = secondaryDiv.querySelector('.e-toolbar-right') as HTMLElement;
    // Ensure side groups don't reserve unexpected space
    if (leftGroup) { leftGroup.style.flex = '0 0 auto'; }
    if (rightGroup) { rightGroup.style.flex = '0 0 auto'; }

    // Provide comfortable spacing and left alignment within center group
    const centerToolbarItems: NodeListOf<HTMLElement> = secondaryDiv.querySelectorAll('.e-toolbar-center .e-toolbar-item');
    centerToolbarItems.forEach((el: HTMLElement) => {
        // Skip separators for spacing
        if (!el.classList.contains('e-separator')) {
            el.style.marginRight = '12px';
        }
    });
    const inputHost: HTMLInputElement = document.getElementById(elementID + '_page_input') as HTMLInputElement;
    if (inputHost) {
        const textBox: TextBox = new TextBox({
            placeholder: this.pdfViewer.localeObj.getConstant('Example: 1,3,5-12'),
            floatLabelType: 'Never',
            width: Browser.isDevice ? '140px' : '220px'
        });
        textBox.appendTo(inputHost);
        this.extractPagesInput = textBox;
        if (secondaryToolbar.refreshOverflow) {
            try { secondaryToolbar.refreshOverflow(); } catch (e) { /* no-op */ }
        }
    }
    const separateHost: HTMLInputElement = document.getElementById(elementID + '_extract_separate') as HTMLInputElement;
    if (separateHost) {
        const seperateCheckboxLabel: string = (this.pdfViewer.localeObj && this.pdfViewer.localeObj.getConstant('Extract Pages As Separate Files'));
        const separateCheckbox: CheckBox = new CheckBox({
            label: seperateCheckboxLabel,
            checked: false
        });
        separateCheckbox.appendTo(separateHost);
        const wrap: HTMLElement = separateHost.closest('.e-toolbar-item') as HTMLElement;
        if (wrap) { wrap.style.overflow = 'visible'; }
        if (secondaryToolbar.refreshOverflow) {
            try { secondaryToolbar.refreshOverflow(); } catch (e) { /* no-op */ }
        }
    }

    const deleteHost: HTMLInputElement = document.getElementById(elementID + '_extract_delete') as HTMLInputElement;
    if (deleteHost) {
        const deleteCheckboxLabel: string = (this.pdfViewer.localeObj && this.pdfViewer.localeObj.getConstant('Delete Pages After Extracting'));
        const deleteCheckbox: CheckBox = new CheckBox({
            label: deleteCheckboxLabel,
            checked: false
        });
        deleteCheckbox.appendTo(deleteHost);
        const wrap: HTMLElement = deleteHost.closest('.e-toolbar-item') as HTMLElement;
        if (wrap) { wrap.classList.add('extract_delete_center_div'); wrap.style.overflow = 'visible'; }
        if (secondaryToolbar.refreshOverflow) {
            try { secondaryToolbar.refreshOverflow(); } catch (e) { /* no-op */ }
        }
    }
    if (!isNullOrUndefined(this.extractPagesInput)) {
        inputTextboxUpdate.call(this);
        updateExtractOkButtonState.call(this);
        initExtractEventListeners.call(this);
    }
    const seperateElementss: HTMLCollectionOf<Element> = secondaryDiv.getElementsByClassName('e-separator');
    for (let i: number = 0; i < seperateElementss.length; i++) {
        const element: HTMLElement = seperateElementss[parseInt(i.toString(), 10)] as HTMLElement;
        if (element) {
            element.setAttribute('tabindex', '0');
            element.setAttribute('data-tabindex', '0');
        }
    }
    this.extractSecondaryToolbar = secondaryToolbar;
}

/**
 * @private
 * @returns {number[]} - selected tile nodes in organize window.
 */
export function selectedNodesInOrganizeWindow(): number[] {
    const selectedNodes: NodeListOf<Element> = this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring');
    const selectedPages: number[] = [];
    selectedNodes.forEach(function (selectedElement: Element): void {
        const mainTileElement: HTMLElement = (selectedElement as HTMLElement).closest('.e-pv-organize-anchor-node') as HTMLElement;
        if (mainTileElement) {
            const pageOrderAttr: string = mainTileElement.getAttribute('data-page-order');
            if (pageOrderAttr !== null) {
                selectedPages.push(parseInt(pageOrderAttr, 10) + 1);
            }
        }
    });
    return selectedPages;
}

/**
 * @private
 * @returns { void }
 */
function destroySecondaryExtractToolbar(): void {
    // Unwire extract-specific listeners first
    try { removeExtractEventListeners.call(this); } catch (e) { /* no-op */ }
    const elementID: string = this.pdfViewer.element.id;
    const secondaryDiv: HTMLElement = document.getElementById(`${elementID}_extract_toolbar`);
    const toolbar: Toolbar = this.extractSecondaryToolbar;
    const extractBtn: HTMLElement | null = document.getElementById(elementID + '_extract_pages');
    if (extractBtn) { extractBtn.classList.remove('e-pv-select'); }
    // Remove resize listener if attached
    const resizeHandler: any = (this as any).extractToolbarResizeHandler;
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        (this as any).extractToolbarResizeHandler = null;
    }
    if (toolbar) { toolbar.destroy(); this.extractSecondaryToolbar = null; }
    if (secondaryDiv && secondaryDiv.parentElement) { secondaryDiv.parentElement.removeChild(secondaryDiv); }
    this.extractPagesInput = null;
}

/**
 * @private
 * @param {boolean} showExtract - Whether to show extract footer buttons.
 * @returns { void }
 */
function setOrganizeFooterForExtract(showExtract: boolean): void {
    if (!this.organizeDialog) { return; }
    const dlgEle: HTMLElement = this.organizeDialog.element as HTMLElement;
    const isMobileUI: boolean = Browser.isDevice;

    if (showExtract) {
        // When extract toolbar is visible, always show Cancel/Extract
        this.organizeDialog.buttons = [
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: () => { destroySecondaryExtractToolbar.call(this); setOrganizeFooterForExtract.call(this, false); updateTileAreaHeightForSecondaryToolbar.call(this, false); this.isExtractToolbarVisible = false; } },
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Extract'), isPrimary: true, cssClass: 'e-pv-extractbtn', disabled: !(this.extractPagesInput && this.extractPagesInput.value && this.extractPagesInput.value.trim() !== '') }, click: onExtractConfirmClick.bind(this) }
        ];
    } else {
        if (isMobileUI) {
            // No footer on mobile when extract toolbar is hidden
            this.organizeDialog.buttons = [];
        } else {
            const pagecount: number = this.pdfViewerBase.pageCount;
            this.organizeDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save As'), isPrimary: true }, click: this.onSaveasClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save'), isPrimary: true }, click: this.onSaveClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Total') + ' ' + pagecount.toString() + ' ' + this.pdfViewer.localeObj.getConstant('Pages'), cssClass: 'e-pv-organize-total-page-button', disabled: true } }
            ];
        }
    }
    this.organizeDialog.dataBind();
    // Ensure the footer DOM is actually hidden/shown as required
    const footerContent: HTMLElement | null = dlgEle.querySelector('.e-footer-content') as HTMLElement;
    const footerBar: HTMLElement | null = dlgEle.querySelector('.e-dlg-footer') as HTMLElement;
    // Add a strong CSS rule once to reliably hide footer on mobile when needed
    const HIDE_CLASS: string = 'e-pv-hide-footer';
    const STYLE_ID: string = 'e-pv-hide-footer-style';
    if (!document.getElementById(STYLE_ID)) {
        const styleEl: HTMLElement = document.createElement('style');
        styleEl.id = STYLE_ID;
        styleEl.textContent = `
            .e-dialog.${HIDE_CLASS} .e-footer-content,
            .e-dialog.${HIDE_CLASS} .e-dlg-footer { display: none !important; }
        `;
        document.head.appendChild(styleEl);
    }

    if (showExtract) {
        // Ensure footer exists and is visible for Cancel/Extract
        if (footerBar) { footerBar.style.display = ''; }
        if (footerContent) { footerContent.style.display = ''; }
        dlgEle.classList.remove(HIDE_CLASS);
        dlgEle.removeAttribute('data-hide-footer');
    } else if (isMobileUI) {
        // Hide and remove footer entirely on mobile when extract toolbar is hidden
        if (footerContent && footerContent.parentElement) {
            footerContent.parentElement.removeChild(footerContent);
        }
        if (footerBar && footerBar.parentElement) {
            footerBar.parentElement.removeChild(footerBar);
        }
        dlgEle.classList.add(HIDE_CLASS);
        dlgEle.setAttribute('data-hide-footer', 'true');
    } else {
        // Desktop: keep footer visible
        if (footerBar) { footerBar.style.display = ''; }
        if (footerContent) { footerContent.style.display = ''; }
        dlgEle.classList.remove(HIDE_CLASS);
        dlgEle.removeAttribute('data-hide-footer');
    }
}

/**
 * @private
 * @param {boolean} show - Whether to adjust tile area height for secondary toolbar.
 * @returns { void }
 */
function updateTileAreaHeightForSecondaryToolbar(show: boolean): void {
    if (this.tileAreaWrapper) {
        this.tileAreaWrapper.style.height = show ? 'calc(100% - 96px)' : 'calc(100% - 48px)';
    }
}

/**
 * @private
 * @returns { void }
 */
function updateExtractOkButtonState(): void {
    const inputValue: string = this.extractPagesInput ? this.extractPagesInput.value.trim() : '';
    const createBtn: HTMLButtonElement = document.getElementsByClassName('e-pv-extractbtn')[0] as HTMLButtonElement;
    if (createBtn) {
        createBtn.disabled = inputValue === '';
    }
}

/**
 * @private
 * @param {string} input - extract pages input string.
 * @param {number} pageCount - total number of tiles in the organize window.
 * @returns { string } - Formatted page ranges.
 */
export function formatPageRanges(input: string, pageCount: number): string {
    const validPages: number[] = [];
    if (input) {
        const parts: string[] = input.split(',');
        for (let part of parts) {
            part = part.trim();
            if (/^\d+$/.test(part)) {
                const value: number = parseInt(part, 10);
                if (value >= 1 && value <= pageCount) { validPages.push(value); }
            } else if (/^\d+-\d+$/.test(part)) {
                const [start, end]: number[] = part.split('-').map((n: string) => parseInt(n, 10));
                if (start >= 1 && end <= pageCount && start <= end) {
                    for (let i: number = start; i <= end; i++) { validPages.push(i); }
                }
            }
        }
        validPages.sort((a: number, b: number): number => a - b);
        const uniquePages: number[] = Array.from(new Set(validPages));
        const ranges: string[] = [];
        let start: number = uniquePages[0];
        let end: number = start;
        for (let i: number = 1; i < uniquePages.length; i++) {
            if (uniquePages[parseInt(i.toString(), 10)] === end + 1) {
                end = uniquePages[parseInt(i.toString(), 10)];
            } else {
                ranges.push(start === end ? `${start}` : `${start}-${end}`);
                start = uniquePages[parseInt(i.toString(), 10)];
                end = start;
            }
        }
        if (start !== undefined) {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
        }
        let output: string = '';
        if (ranges.length > 0) {
            output = ranges[0];
            for (let i: number = 1; i < ranges.length; i++) {
                const prevIsRange: boolean = ranges[parseInt(i.toString(), 10) - 1].indexOf('-') !== -1;
                const currIsRange: boolean = ranges[parseInt(i.toString(), 10)].indexOf('-') !== -1;
                const sep: string = (prevIsRange && currIsRange) ? ',' : ', ';
                output += sep + ranges[parseInt(i.toString(), 10)];
            }
        }
        return output;
    }
    return '';
}

/**
 * @private
 * @returns { void }
 */
export function onExtractConfirmClick(): void {
    if (!this.pdfViewerBase || !this.pdfViewerBase.clientSideRendering) { return; }
    const value: string = this.extractPagesInput ? this.extractPagesInput.value.trim() : '';
    const fileName: string = this.pdfViewer.fileName;
    const downloadFileName: string = this.pdfViewer.downloadFileName;
    const elementID: string = this.pdfViewer.element.id;
    const isSeparateChecked: boolean = document.getElementById(elementID + '_extract_separate') ?
        (document.getElementById(elementID + '_extract_separate') as any).checked : false;
    const isDeleteChecked: boolean = document.getElementById(elementID + '_extract_delete') ?
        (document.getElementById(elementID + '_extract_delete') as any).checked : false;
    if (!value) { return; }
    const pageList: number[] = parsePageList.call(this, value);
    this.pdfViewerBase.extractAction = true;
    const selectedPages: number[] = selectedNodesInOrganizeWindow.call(this);
    // Case 1: Combined PDF download
    if (!isSeparateChecked && !isDeleteChecked) {
        const byteArray: Uint8Array = this.pdfViewer.extractPages(value);
        if (byteArray) {
            this.pdfViewerBase.fileDownload(byteArray, this.pdfViewerBase, false, true);
        }
    }
    // Case 2: Delete pages after extracting (combined PDF)
    else if (isDeleteChecked && !isSeparateChecked) {
        const byteArray: Uint8Array = this.pdfViewer.extractPages(value);
        if (byteArray && byteArray.length > 0) {
            this.pdfViewerBase.fileDownload(byteArray, this.pdfViewerBase, false, true);
            if (selectedPages.length === this.tileAreaDiv.childElementCount) {
                this.pdfViewer.loadDocInternally(this.pdfViewerBase.currentDocumentByteArray, this.pdfViewer.pdfRendererModule.password,
                                                 false);
            } else {
                const remainingPages: Uint8Array = this.pdfViewer.importPagesFromRange(!isNullOrUndefined(this.deleteExtractValue) &&
                    this.deleteExtractValue !== '' ? this.deleteExtractValue : value, this.pdfViewerBase.currentDocumentByteArray, true);
                this.pdfViewer.loadDocInternally(remainingPages, this.pdfViewer.pdfRendererModule.password, false);
            }
        }
        this.isOrganizeWindowOpen = false;
        this.pdfViewer.isPageOrganizerOpen = false;
        this.deleteExtractValue = '';
    }
    // Case 3: Separate PDFs
    else if (isSeparateChecked && !isDeleteChecked) {
        pageList.forEach((pageNum: number) => {
            const singlePageByteArray: Uint8Array = this.pdfViewer.extractPages(pageNum.toString());
            if (singlePageByteArray) {
                this.pdfViewerBase.fileDownload(singlePageByteArray, this.pdfViewerBase, false, true);
            }
        });
    }
    // Case 4: Separate PDFs + delete pages
    else if (isSeparateChecked && isDeleteChecked) {
        pageList.forEach((pageNum: number) => {
            const singlePageByteArray: Uint8Array = this.pdfViewer.extractPages(pageNum.toString());
            if (singlePageByteArray) {
                this.pdfViewerBase.fileDownload(singlePageByteArray, this.pdfViewerBase, false, true);
            }
        });
        if (selectedPages.length === this.tileAreaDiv.childElementCount) {
            this.pdfViewer.loadDocInternally(this.pdfViewerBase.currentDocumentByteArray, this.pdfViewer.pdfRendererModule.password, false);
        } else {
            const remainingPages: Uint8Array = this.pdfViewer.importPagesFromRange(!isNullOrUndefined(this.deleteExtractValue) &&
                this.deleteExtractValue !== '' ? this.deleteExtractValue : value, this.pdfViewerBase.currentDocumentByteArray, true);
            this.pdfViewer.loadDocInternally(remainingPages, this.pdfViewer.pdfRendererModule.password, false);
        }
        this.isOrganizeWindowOpen = false;
        this.pdfViewer.isPageOrganizerOpen = false;
        this.deleteExtractValue = '';
    }
    this.pdfViewer.fileName = fileName;
    this.pdfViewer.downloadFileName = downloadFileName || fileName;
    this.pdfViewerBase.currentDocumentByteArray = new Uint8Array(0);
    if (this.extractDialog) {
        this.extractDialog.hide();
    }
    // If secondary toolbar mode is active, close it and restore footer/buttons
    if (this.isExtractToolbarVisible) {
        destroySecondaryExtractToolbar.call(this);
        setOrganizeFooterForExtract.call(this, false);
        updateTileAreaHeightForSecondaryToolbar.call(this, false);
        this.isExtractToolbarVisible = false;
    }
}

/**
 * @private
 * @param {string} value - extract pages input string.
 * @returns { number[] } - parsed page list.
 */
function parsePageList(value: string): number[] {
    const parts: string[] = value.split(',');
    const pageList: number[] = [];
    for (const part of parts) {
        const trimmed: string = part.trim();
        if (trimmed.includes('-')) {
            const [startStr, endStr] = trimmed.split('-');
            const start: number = parseInt(startStr, 10);
            const end: number = parseInt(endStr, 10);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i: number = start; i <= end; i++) {
                    pageList.push(i);
                }
            }
        } else {
            const num: number = parseInt(trimmed, 10);
            if (!isNaN(num)) {
                pageList.push(num);
            }
        }
    }
    return pageList;
}

/**
 * @private
 * @param {boolean} isInitialState - Whether it's the initial toolbar state.
 * @param {ItemModel[]} toolbarItems - Toolbar items array.
 * @returns { void }
 */
export function addExtractionIcon(isInitialState: boolean, toolbarItems: ItemModel[]): void {
    if (isInitialState) {
        // Remove extract icon if setting is disabled or not client-side rendering
        if (!this.pdfViewer.pageOrganizerSettings.showExtractPagesOption || !this.pdfViewerBase.clientSideRendering) {
            const extractIndex: number = toolbarItems.findIndex(
                (item: ItemModel) => item.id === this.pdfViewer.element.id + '_extract_pages');
            if (extractIndex !== -1) {
                toolbarItems.splice(extractIndex, 1);
            }
        }

    }
}

/**
 * @private
 * @param {boolean} showExtractPagesOption - Whether to show or remove extract icon.
 * @returns { void }
 */
export function showRemoveExtractIcon(showExtractPagesOption: boolean): void {
    const elementID: string = this.pdfViewer.element.id;
    const extractIconId: string = elementID + '_extract_pages';
    if (!isOrganizeDialogRendered.call(this)) {
        return;
    }
    // If not client-side rendering, treat as not visible
    if (!showExtractPagesOption || !this.pdfViewerBase.clientSideRendering) {
        const extractIndex: number = this.toolbar.items.findIndex(
            function (item: ItemModel): boolean {
                return item.id === extractIconId;
            }
        );
        if (extractIndex !== -1) {
            const iconElement: HTMLElement = this.pdfViewerBase.getElement('_extract_pages');
            if (iconElement && iconElement.parentElement) {
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.toolbar.hideItem(iconElement.parentElement, true);
                } else {
                    this.toolbar.removeItems(iconElement.parentElement);
                }
            }
        }
        // If extract toolbar is open, close it and restore default footer/layout
        if (this.isExtractToolbarVisible) {
            destroySecondaryExtractToolbar.call(this);
            setOrganizeFooterForExtract.call(this, false);
            updateTileAreaHeightForSecondaryToolbar.call(this, false);
            this.isExtractToolbarVisible = false;
        }
        // Clean up any previously attached desktop click handler reference to avoid duplicates
        detachExtractButtonHandler.call(this);
    } else {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            const extractIndex: number = this.toolbar.items.findIndex(
                function (item: ItemModel): boolean {
                    return item.id === extractIconId;
                }
            );
            if (extractIndex !== -1) {
                this.toolbar.hideItem(this.pdfViewerBase.getElement('_extract_pages').parentElement, false);
            } else {

                const moreIndex: number = this.toolbar.items.findIndex(
                    (item: ItemModel): boolean => item.id === (elementID + '_organize_more_button')
                );
                const insertIndex: number = moreIndex > -1 ? moreIndex : this.toolbar.items.length;
                const itemsToAdd: ItemModel[] = [];
                itemsToAdd.push({
                    visible: true,
                    cssClass: 'e-pv-extract-pages',
                    prefixIcon: 'e-pv-extract-page-icon e-pv-icon',
                    id: extractIconId,
                    align: 'Right'
                });
                this.toolbar.addItems(itemsToAdd, insertIndex);
            }
        }
        else {
            const insertIndex: number = this.toolbar.items.findIndex(
                function (item: ItemModel): boolean {
                    return item.cssClass === 'e-pv-import-pages';
                }
            );
            const itemsToAdd: ItemModel[] = [];
            if (insertIndex > 0 && this.toolbar.items[insertIndex - 1].type !== 'Separator') {
                itemsToAdd.push({ type: 'Separator', align: 'Center' });
            }
            itemsToAdd.push({
                visible: true,
                cssClass: 'e-pv-extract-pages',
                prefixIcon: 'e-pv-extract-page-icon e-pv-icon',
                id: extractIconId,
                align: 'Center'
            });
            this.toolbar.addItems(itemsToAdd, insertIndex);
        }
        const extractButton: HTMLElement = document.getElementById(extractIconId);
        if (extractButton && !Browser.isDevice) {
            attachExtractButtonHandler.call(this, extractButton);
        }
        if (!this.pdfViewer.pageOrganizerSettings.canExtractPages || !this.pdfViewerBase.clientSideRendering) {
            enableToolbarItem.call(this, this.pdfViewer.element.id + '_extract_pages', false);
        }
    }
}

/**
 * @private
 * @param {boolean} canExtractPages - Whether to enable or disable extract icon.
 * @returns { void }
 */
export function showHideExtractIcon(canExtractPages: boolean): void {
    if (!isOrganizeDialogRendered.call(this)) {
        return;
    }
    const enable: boolean = canExtractPages && this.pdfViewerBase.clientSideRendering;
    enableToolbarItem.call(this, this.pdfViewer.element.id + '_extract_pages', enable);
    // If disabling while the extract toolbar is open, close and restore footer/layout
    if (!enable && this.isExtractToolbarVisible) {
        destroySecondaryExtractToolbar.call(this);
        setOrganizeFooterForExtract.call(this, false);
        updateTileAreaHeightForSecondaryToolbar.call(this, false);
        this.isExtractToolbarVisible = false;
    }
}

/**
 * @private
 * @returns { void }
 */
export function inputTextboxUpdate(): void {
    const selectedPages: number[] = selectedNodesInOrganizeWindow.call(this);
    if (!isNullOrUndefined(this.extractPagesInput)) {
        const formatted: string = formatPageRanges(selectedPages.join(','), this.tileAreaDiv.childElementCount);
        // Update component value
        this.extractPagesInput.value = formatted;
        this.extractPagesInput.dataBind();
        // Also ensure the native input reflects the latest value
        if (this.extractPagesInput.element) {
            this.extractPagesInput.element.value = formatted;
        }
        // Update Extract button enable state
        try { updateExtractOkButtonState.call(this); } catch (_) { /* no-op */ }
    }
}

/**
 * @private
 * @returns { void }
 */
function initExtractEventListeners(): void {
    if (this.boundExtractInputChange) { return; }
    if (!this.extractPagesInput || !this.extractPagesInput.element) { return; }
    // Capture PageOrganizer context using an arrow function and add explicit typedef for lint compliance
    const changeHandler: () => void = () => {
        // Normalize user input to valid formatted ranges
        this.extractPagesInput.value = formatPageRanges.call(this, this.extractPagesInput.value, this.tileAreaDiv.childElementCount);
        const pagesToSelect: number[] = parsePageList.call(this, this.extractPagesInput.value);
        clearSelection.call(this);
        pagesToSelect.forEach((pageNum: number) => {
            const index: number = pageNum - 1; // data-page-order is zero-based
            const tile: HTMLElement = this.tileAreaDiv.querySelector(`[data-page-order="${index}"]`) as HTMLElement;
            if (tile) { selectTile.call(this, tile); }
        });
        updateExtractOkButtonState.call(this);
        try { updateSelectAllCheckbox.call(this); } catch (_) { /* no-op */ }
        try { enableDisableToolbarItems.call(this); } catch (_) { /* no-op */ }
    };

    this.boundExtractInputChange = changeHandler;
    this.extractPagesInput.element.addEventListener('change', changeHandler);
}

/**
 * @private
 * @returns { void }
 */
function removeExtractEventListeners(): void {
    const bound: () => void = this.boundExtractInputChange;
    if (this.extractPagesInput && this.extractPagesInput.element && bound) {
        this.extractPagesInput.element.removeEventListener('change', bound);
    }
    this.boundExtractInputChange = null;
}

/**
 * @private
 * @param {HTMLElement} button - Extract toolbar button element.
 * @returns { void }
 */
function attachExtractButtonHandler(button: HTMLElement): void {
    // Unbind any existing first to avoid duplicates
    detachExtractButtonHandler.call(this);
    const handler: () => void = onToolbarExtractButtonClick.bind(this);
    this.extractButtonClickHandler = handler;
    this.extractButtonElement = button;
    button.addEventListener('click', handler);
}

/**
 * @private
 * @returns { void }
 */
function detachExtractButtonHandler(): void {
    if (this.extractButtonClickHandler && this.extractButtonElement) {
        this.extractButtonElement.removeEventListener('click', this.extractButtonClickHandler);
    }
    this.extractButtonClickHandler = null;
    this.extractButtonElement = null;
}
