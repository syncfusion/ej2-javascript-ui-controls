import { createElement, Browser, isNullOrUndefined, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { OrganizeDetails, PageOrganizer } from '../organize-pdf';
import { ISize } from '../../base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { Tooltip } from '@syncfusion/ej2-popups';
import { handleImageContainerClick } from './organize-initialization';
import { copyButtonClick, deleteButtonClick, insertLeftButtonClick, insertRightButtonClick, movePages } from './organize-utils';
import { onSelectClick } from './tile-interaction';
import { onTooltipBeforeOpen } from './organize-toolbar';
import { rotateButtonClick, rotateLeftButtonClick } from './organizepages-editor';
import { getImageZoomFactor, getRotatedAngle } from './organize-math-utils';

/**
 * @private
 * @returns { void }
 */
export function renderThumbnailImage(): void {
    this.organizePagesCollection = [];
    for (let i: number = 0; i < this.pdfViewer.pageCount; i++) {
        this.tileImageRender(i);
        this.organizePagesCollection.
            push(new OrganizeDetails(i, i, null, false,
                                     false, false, false, false, false,
                                     getRotatedAngle.call(this,
                                                          this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].rotation.toString()),
                                     this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)], false, null, null, null));
    }
    this.tempOrganizePagesCollection = JSON.parse(JSON.stringify(this.organizePagesCollection));
}

/**
 * @param {number} pageIndex - It describes about the page index
 * @param {number} subIndex - It describes about the sub index
 * @param {number} pageOrder - It describes about the page order
 * @param {HTMLElement} targetElement - It describes about the target element
 * @param {boolean} isNewPage - It describes about the isNewPage
 * @param {boolean} isBefore - It describes about the isBefore
 * @param {boolean} isEmptyPage - It describes about the isEmptyPage
 * @param {boolean} isImportedPage - It describes about the isImportedPage
 * @param {string} documentName - It describes about the documentName
 * @private
 * @returns {void}
 */
export function tileImageRender(pageIndex: number, subIndex?: number, pageOrder?: number, targetElement?: HTMLElement,
                                isNewPage?: boolean, isBefore?: boolean, isEmptyPage?: boolean, isImportedPage?: boolean,
                                documentName?: string): void {
    const base64Image: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD5Ip3+AAAAC0lEQVQIHWP4DwQACfsD/Qy7W+cAAAAASUVORK5CYII=';
    this.pageLink = createElement('div', { id: 'anchor_page_' + pageIndex, className: 'e-pv-organize-anchor-node' }) as HTMLElement;
    const imageZoomFactor: number = getImageZoomFactor.call(this, this.pageLink.cloneNode(true) as HTMLDivElement);
    if (isNewPage) {
        this.pageLink.id = this.pageLink.id + '_' + subIndex;
        this.pageLink.setAttribute('data-page-order', pageOrder.toString());
    }
    else {
        this.pageLink.setAttribute('data-page-order', pageIndex.toString());
    }
    this.pageLink.style.width = 140 * imageZoomFactor + 'px';
    this.pageLink.style.height = 140 * imageZoomFactor + 'px';
    this.thumbnail = createElement('div', { id: this.pdfViewer.element.id + '_organize_page_' + pageIndex, className: 'e-pv-organize-tile e-pv-thumbnail-column' });
    if (isNewPage) {
        this.thumbnail.id = this.thumbnail.id + '_' + subIndex;
    }
    this.imageContainer = createElement('div', { id: this.pdfViewer.element.id + '_container_image_' + pageIndex, className: 'e-pv-image-container' });
    if (isNewPage) {
        this.imageContainer.id = this.imageContainer.id + '_' + subIndex;
    }
    let pageSize: ISize;
    if (!isNewPage && !isEmptyPage) {
        pageSize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
    }
    else {
        pageSize = this.tempOrganizePagesCollection.find((item: OrganizeDetails) => {
            return item.currentPageIndex === pageOrder; }).pageSize;
        if (isBefore && pageOrder - 1 >= 0) {
            pageSize = this.tempOrganizePagesCollection.find(function (item: OrganizeDetails): boolean {
                return item.currentPageIndex === pageOrder - 1; }).pageSize;
        }
    }
    this.thumbnailImage = createElement('img', { id: this.pdfViewer.element.id + '_organize_image_' + pageIndex,
        className: 'e-pv-organize-image' }) as HTMLImageElement;
    if (isNewPage) {
        this.thumbnailImage.id = this.thumbnailImage.id + '_' + subIndex;
    }
    let width: number;
    let height: number;
    if (pageSize.height > pageSize.width) {
        width = 100 * pageSize.width / pageSize.height;
        height = 100;
    }
    else {
        width = 100;
        height = 100 * pageSize.height / pageSize.width;
    }
    this.thumbnailImage.style.width = width + '%';
    this.thumbnailImage.style.height = height + '%';
    if (isEmptyPage) {
        this.thumbnailImage.src = base64Image;
    }
    else if (pageOrder && pageOrder !== null) {
        const pageDetail: OrganizeDetails = this.tempOrganizePagesCollection.find((item: OrganizeDetails) => {
            return item.currentPageIndex === pageOrder; });
        if (pageDetail && pageDetail.pageIndex !== -1) {
            this.thumbnailImage.src = this.dataDetails[parseInt(pageDetail.pageIndex.toString(), 10)].image;
        }
        else if (pageDetail && pageDetail.copiedPageIndex !== null && pageDetail.copiedPageIndex >= 0) {
            this.thumbnailImage.src = this.dataDetails[parseInt(pageDetail.copiedPageIndex.toString(), 10)].image;
        }
        else {
            this.thumbnailImage.src = base64Image;
        }
    }
    else {
        this.thumbnailImage.src = this.dataDetails[parseInt(pageIndex.toString(), 10)].image;
    }
    this.imageContainer.addEventListener('click', (e: any) => {
        handleImageContainerClick.call(this, e);
    });
    this.thumbnailImage.alt = this.pdfViewer.element.id + '_organize_page_' + pageIndex;
    if (isNewPage) {
        this.thumbnailImage.alt = this.pdfViewer.element.id + '_organize_page_' + pageOrder;
    }
    if (isImportedPage) {
        const importDownloadIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_organize_import_download_icon_' + pageIndex, className: 'e-pv-organize-import-download-icon e-pv-import-icon e-pv-icon' });
        this.importImageWrapper = createElement('div', { id: this.pdfViewer.element.id + '_organize_import_image_wrapper_' + pageIndex, className: 'e-pv-organize-import-image-wrapper' });
        this.importImageWrapper.appendChild(importDownloadIcon);
        this.imageContainer.appendChild(this.importImageWrapper);
    } else {
        this.imageContainer.appendChild(this.thumbnailImage);
    }
    let rotateAngle: number = 0;
    if (isNewPage && !isNullOrUndefined(this.tempOrganizePagesCollection.find((item: OrganizeDetails): boolean =>
    { return item.currentPageIndex === pageOrder; }))) {
        rotateAngle = this.tempOrganizePagesCollection.find((item: OrganizeDetails): boolean =>
        { return item.currentPageIndex === pageOrder; }).rotateAngle;
        this.imageContainer.style.transform = 'rotate(' + rotateAngle + 'deg)';
    }
    this.thumbnail.appendChild(this.imageContainer);
    const thumbnailPageNumber: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_tile_pagenumber_' + pageIndex, className: 'e-pv-tile-number' });
    if (isNewPage) {
        thumbnailPageNumber.id = thumbnailPageNumber.id + '_' + subIndex;
    }
    if (isImportedPage) {
        thumbnailPageNumber.textContent = documentName;
    }
    else if (isNewPage) {
        thumbnailPageNumber.textContent = (pageOrder + 1).toString();
    }
    else {
        thumbnailPageNumber.textContent = (pageIndex + 1).toString();
    }
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'e-pv-organize-tile-checkbox';
    input.id = 'checkboxdiv_page_' + pageIndex;
    if (isNewPage) {
        input.id = input.id + '_' + subIndex;
    }
    this.thumbnail.appendChild(input);
    const checkBoxObj: CheckBox = new CheckBox({ disabled: false, checked: false, change: onSelectClick.bind(this) });
    checkBoxObj.appendTo(input);
    input.parentElement.style.height = '100%';
    input.parentElement.style.width = '100%';
    input.parentElement.style.display = 'none';
    const buttondiv: any = createElement('div', { id: this.pdfViewer.element.id + '_organize_buttondiv_' + pageIndex, className: 'e-pv-organize-buttondiv' });
    if (isNewPage) {
        buttondiv.id = buttondiv.id + '_' + subIndex;
    }
    this.deleteButton = createElement('button', { id: this.pdfViewer.element.id + '_delete_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Delete Page'), 'tabindex': '-1' } }) as HTMLButtonElement;
    if (isNewPage) {
        this.deleteButton.id = this.deleteButton.id + '_' + subIndex;
    }
    this.deleteButton.className = 'e-pv-tbar-btn e-pv-delete-button e-btn e-pv-organize-pdf-tile-btn';
    this.deleteButton.setAttribute('type', 'button');
    const deleteButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_delete' + '_icon', className: 'e-pv-delete-icon e-pv-icon' });
    this.deleteButton.appendChild(deleteButtonSpan);
    const deleteButtonTooltip: Tooltip = new Tooltip({
        content: initializeCSPTemplate(
            function (): string { return this.pdfViewer.localeObj.getConstant('Delete Page'); }, this
        ), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
    });
    deleteButtonTooltip.appendTo(this.deleteButton);
    this.rotateRightButton = createElement('button', { id: this.pdfViewer.element.id + '_rotate_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Rotate Right'), 'tabindex': '-1' } }) as HTMLButtonElement;
    if (isNewPage) {
        this.rotateRightButton.id = this.rotateRightButton.id + '_' + subIndex;
    }
    this.rotateRightButton.className = 'e-pv-tbar-btn e-pv-rotate-right-button e-btn e-pv-organize-pdf-tile-btn';
    this.rotateRightButton.setAttribute('type', 'button');
    const rotateButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_rotate-right' + '_icon', className: 'e-pv-rotate-right-icon e-pv-icon' });
    this.rotateRightButton.appendChild(rotateButtonSpan);
    const rotateButtonTooltip: Tooltip = new Tooltip({
        content: initializeCSPTemplate(
            function (): string { return this.pdfViewer.localeObj.getConstant('Rotate Right'); }, this
        ), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
    });
    rotateButtonTooltip.appendTo(this.rotateRightButton);
    this.rotateLeftButton = createElement('button', { id: this.pdfViewer.element.id + '_rotate_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Rotate Left'), 'tabindex': '-1' } }) as HTMLButtonElement;
    if (isNewPage) {
        this.rotateLeftButton.id = this.rotateLeftButton.id + '_' + subIndex;
    }
    this.rotateLeftButton.className = 'e-pv-tbar-btn e-pv-rotate-left-button e-btn e-pv-organize-pdf-tile-btn';
    this.rotateLeftButton.setAttribute('type', 'button');
    const rotateLeftButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_rotate_left' + '_icon', className: 'e-pv-rotate-left-icon e-pv-icon' });
    this.rotateLeftButton.appendChild(rotateLeftButtonSpan);
    const rotateLeftButtonTooltip: Tooltip = new Tooltip({
        content: initializeCSPTemplate(
            function (): string { return this.pdfViewer.localeObj.getConstant('Rotate Left'); }, this
        ), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
    });
    rotateLeftButtonTooltip.appendTo(this.rotateLeftButton);
    this.copyButton = createElement('button', { id: this.pdfViewer.element.id + '_copy_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Copy Page'), 'tabindex': '-1' } }) as HTMLButtonElement;
    if (isNewPage) {
        this.copyButton.id = this.copyButton.id + '_' + subIndex;
    }
    this.copyButton.className = 'e-pv-tbar-btn e-pv-copy-button e-btn e-pv-organize-pdf-tile-btn';
    this.copyButton.setAttribute('type', 'button');
    const copyButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_copy' + '_icon', className: 'e-pv-copy-icon e-pv-icon' });
    this.copyButton.appendChild(copyButtonSpan);
    const copyButtonTooltip: Tooltip = new Tooltip({
        content: initializeCSPTemplate(
            function (): string { return this.pdfViewer.localeObj.getConstant('Copy Page'); }, this
        ), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
    });
    copyButtonTooltip.appendTo(this.copyButton);
    this.insertRightButton = createElement('button', { id: this.pdfViewer.element.id + '_insert_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Insert Right'), 'tabindex': '-1' } }) as HTMLButtonElement;
    if (isNewPage) {
        this.insertRightButton.id = this.insertRightButton.id + '_' + subIndex;
    }
    this.insertRightButton.className = 'e-pv-tbar-btn e-pv-insert-right-button e-btn e-pv-organize-pdf-tile-btn';
    this.insertRightButton.setAttribute('type', 'button');
    const insertRightButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_insert_right' + '_icon', className: 'e-icons e-plus' });
    this.insertRightButton.appendChild(insertRightButtonSpan);
    const insertRightButtonTooltip: Tooltip = new Tooltip({
        content: initializeCSPTemplate(function (): any { return this.pdfViewer.localeObj.getConstant('Insert Right'); }, this), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
    });
    insertRightButtonTooltip.appendTo(this.insertRightButton);
    this.insertLeftButton = createElement('button', { id: this.pdfViewer.element.id + '_insert_page_' + pageIndex, attrs: { 'aria-label': this.pdfViewer.localeObj.getConstant('Insert Left'), 'tabindex': '-1' } }) as HTMLButtonElement;
    if (isNewPage) {
        this.insertLeftButton.id = this.insertLeftButton.id + '_' + subIndex;
    }
    this.insertLeftButton.className = 'e-pv-tbar-btn e-pv-insert-left-button e-btn e-pv-organize-pdf-tile-btn';
    this.insertLeftButton.setAttribute('type', 'button');
    const insertLeftButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_insert_left' + '_icon', className: 'e-icons e-plus' });
    this.insertLeftButton.appendChild(insertLeftButtonSpan);
    const insertLeftButtonTooltip: Tooltip = new Tooltip({
        content: initializeCSPTemplate(function (): any { return this.pdfViewer.localeObj.getConstant('Insert Left'); }, this), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
    });
    insertLeftButtonTooltip.appendTo(this.insertLeftButton);
    if (!this.pdfViewer.pageOrganizerSettings.canInsert) {
        this.insertLeftButton.setAttribute('disabled', 'disabled');
        this.insertLeftButton.firstElementChild.classList.add('e-disabled');
        this.insertRightButton.setAttribute('disabled', 'disabled');
        this.insertRightButton.firstElementChild.classList.add('e-disabled');
    }
    if (!this.pdfViewer.pageOrganizerSettings.canRotate) {
        this.rotateLeftButton.setAttribute('disabled', 'disabled');
        this.rotateLeftButton.firstElementChild.classList.add('e-disabled');
        this.rotateRightButton.setAttribute('disabled', 'disabled');
        this.rotateRightButton.firstElementChild.classList.add('e-disabled');
    }
    if (!this.pdfViewer.pageOrganizerSettings.canDelete) {
        this.deleteButton.setAttribute('disabled', 'disabled');
        this.deleteButton.firstElementChild.classList.add('e-disabled');
    }
    if (!this.pdfViewer.pageOrganizerSettings.canCopy) {
        this.copyButton.setAttribute('disabled', 'disabled');
        this.copyButton.firstElementChild.classList.add('e-disabled');
    }
    buttondiv.appendChild(this.insertLeftButton);
    if (!isImportedPage) {
        buttondiv.appendChild(this.rotateLeftButton);
        buttondiv.appendChild(this.rotateRightButton);
        buttondiv.appendChild(this.copyButton);
    }
    buttondiv.appendChild(this.deleteButton);
    buttondiv.appendChild(this.insertRightButton);
    this.thumbnail.appendChild(buttondiv);
    buttondiv.style.display = 'none';
    this.pageLink.appendChild(this.thumbnail);
    this.tileAreaDiv.appendChild(this.pageLink);
    this.pageLink.appendChild(thumbnailPageNumber);
    this.rotateRightButton.addEventListener('click', rotateButtonClick.bind(this));
    this.rotateLeftButton.addEventListener('click', rotateLeftButtonClick.bind(this));
    this.insertRightButton.addEventListener('click', insertRightButtonClick.bind(this));
    this.insertLeftButton.addEventListener('click', insertLeftButtonClick.bind(this));
    this.deleteButton.addEventListener('click', deleteButtonClick.bind(this));
    this.copyButton.addEventListener('click', copyButtonClick.bind(this));
    this.pageLink.addEventListener('mouseover', thumbnailMouseOver.bind(this));
    this.pageLink.addEventListener('mouseleave', thumbnailMouseLeave.bind(this));
    movePages.call(this);
    if (isNewPage) {
        if (isBefore) {
            this.tileAreaDiv.insertBefore(this.pageLink, targetElement);
        }
        else {
            this.tileAreaDiv.insertBefore(this.pageLink, targetElement.nextSibling);
        }
    }
}

/**
 * @param {MouseEvent} event - It describes about the event
 * @private
 * @returns {void}
 */
export function thumbnailMouseOver(event: MouseEvent): void {
    // eslint-disable-next-line
    const proxy: PageOrganizer = this;
    if (event.currentTarget instanceof HTMLElement) {
        // Convert HTMLCollection to an array
        const childrenArray: Element[] = Array.from(event.currentTarget.children);
        // Iterate over the array
        for (const subchild of childrenArray) {
            const childArray: any[] = Array.from(subchild.children);
            for (const child of childArray) {
                // Exclude the image by checking its type
                if (!(child.classList.contains('e-pv-image-container'))) {
                    // Set the display style property to "none" for other children
                    (child as HTMLElement).style.display = 'flex';
                    if (child.classList.contains('e-checkbox-wrapper')) {
                        (child.children[0] as HTMLElement).style.display = 'block';
                    }
                    else if (child.classList.contains('e-pv-organize-buttondiv') && child.childElementCount > 0) {
                        const childelementArray: Element[] = Array.from(child.children);
                        for (const childelement of childelementArray) {
                            if (proxy.totalCheckedCount > 1) {
                                if (childelement.id.split('_')[1] === 'insert') {
                                    (childelement as HTMLElement).style.display = 'flex';
                                }
                                else {
                                    (childelement as HTMLElement).style.display = 'none';
                                }
                            } else {
                                (childelement as HTMLElement).style.display = 'flex';
                            }
                            const targetClassList: DOMTokenList = childelement.classList;
                            if (targetClassList.contains('e-pv-insert-left-button') || targetClassList.contains('e-pv-insert-right-button')) {
                                (childelement as HTMLElement).style.top = '-' + (parseFloat(this.pageLink.style.height.replace('px', '')) / 2) + 'px';
                            }
                            setTileButtonEnableState.call(this, childelement as HTMLElement);
                        }
                    }
                }
            }
        }
    }
}

/**
 * @param {HTMLElement} button - It describes about the button.
 * @private
 * @returns {void}
 */
export function setTileButtonEnableState(button: HTMLElement): void {
    if (isNullOrUndefined(button)) {
        return;
    }
    const buttonClassList: DOMTokenList = button.classList;
    const firstChildClassList: DOMTokenList = button.firstElementChild ? button.firstElementChild.classList : buttonClassList;
    if (buttonClassList.contains('e-pv-insert-left-button') || buttonClassList.contains('e-pv-insert-right-button')) {
        if (!this.pdfViewer.pageOrganizerSettings.canInsert) {
            firstChildClassList.add('e-disabled');
            button.setAttribute('disabled', 'disabled');
        } else {
            firstChildClassList.remove('e-disabled');
            button.removeAttribute('disabled');
        }
    } else if (buttonClassList.contains('e-pv-rotate-left-button') || buttonClassList.contains('e-pv-rotate-right-button')) {
        if (!this.pdfViewer.pageOrganizerSettings.canRotate) {
            firstChildClassList.add('e-disabled');
            button.setAttribute('disabled', 'disabled');
        } else {
            firstChildClassList.remove('e-disabled');
            button.removeAttribute('disabled');
        }
    } else if (buttonClassList.contains('e-pv-copy-button')) {
        const emptyImage: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD5Ip3+AAAAC0lEQVQIHWP4DwQACfsD/Qy7W+cAAAAASUVORK5CYII=';
        const splitArray: string[] = (button.id as string).split('_copy_page_');
        let suffixID: string = '';
        let isEmptyPage: boolean = false;
        if (splitArray.length > 0) {
            suffixID = splitArray[1];
            const imageElement: HTMLImageElement = document.getElementById(this.pdfViewer.element.id + '_organize_image_' + suffixID) as HTMLImageElement;
            if (imageElement && imageElement.currentSrc === emptyImage) {
                isEmptyPage = true;
            }
        }
        if (!this.pdfViewer.pageOrganizerSettings.canCopy || isEmptyPage) {
            firstChildClassList.add('e-disabled');
            button.setAttribute('disabled', 'disabled');
        } else {
            firstChildClassList.remove('e-disabled');
            button.removeAttribute('disabled');
        }
    } else if (buttonClassList.contains('e-pv-delete-button')) {
        if (!this.pdfViewer.pageOrganizerSettings.canDelete) {
            firstChildClassList.add('e-disabled');
            button.setAttribute('disabled', 'disabled');
        } else {
            firstChildClassList.remove('e-disabled');
            button.removeAttribute('disabled');
        }
    }
}

/**
 * @param {MouseEvent} event - It describes about the event
 * @private
 * @returns {void}
 */
export function thumbnailMouseLeave(event: MouseEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
        // Convert HTMLCollection to an array
        const childrenArray: Element[] = Array.from(event.currentTarget.children);
        // Iterate over the array
        for (const subchild of childrenArray) {
            const childArray: Element[] = Array.from(subchild.children);
            for (const child of childArray) {
                // Exclude the image by checking its type
                if (!(child.classList.contains('e-pv-image-container'))) {
                    if (event.currentTarget.classList.contains('e-pv-organize-node-selection-ring')) {
                        if (child.classList.contains('e-checkbox-wrapper')) {
                            (child as HTMLElement).style.display = 'block';
                        }
                        else {
                            (child as HTMLElement).style.display = 'none';
                        }
                    } else {
                        // Set the display style property to "none" for other children
                        (child as HTMLElement).style.display = 'none';
                    }

                }
            }
        }
    }
}
