import { isNullOrUndefined, Browser, createElement } from '@syncfusion/ej2-base';
import { OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ChangeEventArgs, Slider } from '@syncfusion/ej2-inputs';
import { PageOrganizerSettingsModel } from '../../index';
import { isOrganizeDialogRendered } from './organize-initialization';
import { shrinkElement } from './organize-toolbar';
import { getImageZoomFactor } from './organize-math-utils';

/**
 * @private
 * @returns { void }
 */
export function updatePageZoomPopup(): void {
    if (this.isPageZoomPopupOpen && (this.pageZoomSlider.value !== this.currentPageZoomSliderValue)) {
        this.pageZoomSlider.value = this.currentPageZoomSliderValue;
        this.pageZoomSlider.reposition();
    }
    handlePageZoomButtonsVisibility.call(this, this.currentPageZoomSliderValue);
}

/**
 * @private
 * @returns { number } - It's describe about a minimum zoom value.
 */
export function getImageZoomMin(): number {
    let currentMinSize: number = this.pdfViewer.pageOrganizerSettings.imageZoomMin;
    if (isNullOrUndefined(currentMinSize)) {
        this.pdfViewer.pageOrganizerSettings.imageZoomMin = 1;
        currentMinSize = 1;
    }
    const possibleMinSize: number = 1;
    if (!Number.isInteger(currentMinSize)) {
        currentMinSize = Math.floor(currentMinSize);
        this.pdfViewer.pageOrganizerSettings.imageZoomMin = currentMinSize;
    }
    if (currentMinSize < possibleMinSize) {
        this.pdfViewer.pageOrganizerSettings.imageZoomMin = possibleMinSize;
    }
    return this.pdfViewer.pageOrganizerSettings.imageZoomMin;
}

/**
 * @private
 * @returns { number } - It's describe about a maximum zoom value.
 */
export function getImageZoomMax(): number {
    let currentMaxSize: number = this.pdfViewer.pageOrganizerSettings.imageZoomMax;
    if (isNullOrUndefined(currentMaxSize)) {
        this.pdfViewer.pageOrganizerSettings.imageZoomMax = 5;
        currentMaxSize = 5;
    }
    const possibleMaxSize: number = 5;
    if (!Number.isInteger(currentMaxSize)) {
        currentMaxSize = Math.floor(currentMaxSize);
        this.pdfViewer.pageOrganizerSettings.imageZoomMax = currentMaxSize;
    }
    if (currentMaxSize > possibleMaxSize) {
        this.pdfViewer.pageOrganizerSettings.imageZoomMax = possibleMaxSize;
    }
    return this.pdfViewer.pageOrganizerSettings.imageZoomMax;
}

/**
 * @private
 * @returns { void }
 */
export function modifyThumbnailContainer(): void {
    /* eslint-disable security/detect-object-injection */
    const organizeNodes: HTMLCollection = this.tileAreaDiv.children;
    const imageSizeFactor: number = getImageZoomFactor.call(this, organizeNodes[0].cloneNode(true) as HTMLDivElement);
    for (let index: number = 0; index < organizeNodes.length; index++) {
        const imageContainer: HTMLDivElement = organizeNodes[index] as HTMLDivElement;
        imageContainer.style.width = 140 * imageSizeFactor + 'px';
        imageContainer.style.height = 140 * imageSizeFactor + 'px';
        blurImageContainer.call(this, true, imageContainer);
    }
    /* eslint-enable security/detect-object-injection */
}

/**
 * @private
 * @returns { void }
 */
export function setThumbnailImage(): void {
    /* eslint-disable security/detect-object-injection */
    const organizeNodes: HTMLCollection = this.tileAreaDiv.children;
    for (let index: number = 0; index < organizeNodes.length; index++) {
        const imageContainer: HTMLDivElement = organizeNodes[index] as HTMLDivElement;
        const imageElement: HTMLImageElement = imageContainer.querySelector('.e-pv-organize-image');
        imageElement.src = this.dataDetails[parseInt(index.toString(), 10)].image;
        blurImageContainer.call(this, false, imageContainer);
    }
    /* eslint-enable security/detect-object-injection */
}

/**
 * @private
 * @returns { void }
 */
export function handlePageZoomPopupMobile(): void {
    const pageZoomButton: HTMLElement = this.pdfViewerBase.getElement('_page_zoom');
    if (pageZoomButton && pageZoomButton.parentElement.classList.contains('e-toolbar-popup')) {
        (pageZoomButton.children[0] as HTMLElement).style.padding = '0 5px';
        (pageZoomButton.children[0] as HTMLElement).style.minWidth = '0';
    }
}

/**
 * @private
 * @param {OpenCloseMenuEventArgs} args - It's describe about a event.
 * @returns { void }
 */
export function pageZoomDropDownOpen(args: OpenCloseMenuEventArgs): void {
    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
        const pageZoomButton: HTMLElement = this.pdfViewerBase.getElement('_page_zoom');
        args.element.parentElement.style.left = '0px';
        if (args.element.parentElement.clientWidth > this.pdfViewer.element.getBoundingClientRect().width) {
            shrinkElement.call(this, args.element.parentElement as HTMLElement);
        }
        const pageZoomContainerRect: DOMRect = args.element.parentElement.getBoundingClientRect() as DOMRect;
        if (pageZoomButton && pageZoomButton.parentElement.classList.contains('e-toolbar-popup')) {
            args.element.parentElement.style.left = (this.pdfViewer.element.getBoundingClientRect().left +
                // eslint-disable-next-line @typescript-eslint/indent
                Math.max(((this.pdfViewer.element.getBoundingClientRect().width - pageZoomContainerRect.width) / 2), 0)) + 'px';
        }
        else {
            const pageZoomButtonRect: DOMRect = pageZoomButton.getBoundingClientRect() as DOMRect;
            args.element.parentElement.style.left = Math.max((pageZoomButtonRect.right - pageZoomContainerRect.width),
                // eslint-disable-next-line @typescript-eslint/indent
                this.pdfViewer.element.getBoundingClientRect().left) + 'px';
        }
        args.element.parentElement.style.top = this.pdfViewerBase.getElement('_toolbar_appearance').getBoundingClientRect().bottom + 'px';
    }
    else {
        if (args.element && args.element.parentElement) {
            const leftValue: number = parseFloat(args.element.parentElement.style.left);
            const width: number = args.element.parentElement.offsetWidth;
            if ((leftValue + width) > (this.pdfViewer.element.getBoundingClientRect().left +
                this.pdfViewer.element.offsetWidth + 10)) {
                args.element.parentElement.style.left = (leftValue - width) + 'px';
            }
        }
    }
    this.isPageZoomPopupOpen = true;
    updatePageZoomPopup.call(this);
    requestAnimationFrame(() => {
        if (this.pageZoomDecreaseButton.disabled) {
            (this.pageZoomSlider.element.querySelector('.e-handle') as HTMLElement).focus();
        }
        else {
            this.pageZoomDecreaseButton.focus();
        }
    });
}

/**
 * @private
 * @returns { void }
 */
export function pageZoomDropDownClose(): void {
    requestAnimationFrame(() => {
        this.pageZoomDropDown.focusIn();
    });
    this.isPageZoomPopupOpen = false;
}

/**
 * @private
 * @param {ChangeEventArgs} args - It's describe about a event.
 * @returns { void }
 */
export function pageZoomChange(args: ChangeEventArgs): void {
    if (args.isInteracted && args.previousValue !== args.value) {
        this.pageZoomSlider.element.querySelector('.e-handle').classList.remove('e-large-thumb-size');
        this.handlePageZoomChange(args.value, args.previousValue);
    }
}

/**
 * @private
 * @param {boolean} canBlur - It's describe about a blur the container or not.
 * @param {HTMLElement} container - It's describe about a container.
 * @returns { void }
 */
export function blurImageContainer(canBlur: boolean, container: HTMLElement): void {
    if (!isNullOrUndefined(container)) {
        container.style.filter = canBlur ? 'blur(5px)' : '';
    }
}

/**
 * @private
 * @param {string} idString - It's describe about slider id.
 * @returns { HTMLElement } - It's describe about zoom slider container
 */
export function createPageZoomSlider(idString: string): HTMLElement {
    const outerContainer: HTMLElement = createElement('div', { className: 'e-pv-page-zoom-popup-container' });
    document.body.appendChild(outerContainer);
    this.pageZoomDecreaseButton = createElement('button', {
        id: idString + '_decrease', attrs:
            { 'aria-label': this.pdfViewer.localeObj.getConstant('Decrease Page Zoom'), 'tabindex': '0' }
    }) as HTMLButtonElement;
    this.pageZoomDecreaseButton.className = 'e-btn e-pv-page-zoom-decrease e-flat';
    this.pageZoomDecreaseButton.setAttribute('type', 'button');
    const pageZoomDecreaseButtonSpan: HTMLSpanElement = createElement('span', {
        id: idString + '_decrease_icon',
        className: 'e-pv-page-zoom-decrease-icon e-btn-icon e-icons e-pv-icon'
    }) as HTMLSpanElement;
    this.pageZoomDecreaseButton.appendChild(pageZoomDecreaseButtonSpan);
    this.pageZoomIncreaseButton = createElement('button', {
        id: idString + '_increase', attrs:
            { 'aria-label': this.pdfViewer.localeObj.getConstant('Increase Page Zoom'), 'tabindex': '0' }
    }) as HTMLButtonElement;
    this.pageZoomIncreaseButton.className = 'e-btn e-pv-page-zoom-increase e-flat';
    this.pageZoomIncreaseButton.setAttribute('type', 'button');
    const pageZoomIncreaseButtonSpan: HTMLSpanElement = createElement('span', {
        id: idString + '_decrease_icon',
        className: 'e-pv-page-zoom-increase-icon e-btn-icon e-icons e-pv-icon'
    }) as HTMLSpanElement;
    this.pageZoomIncreaseButton.appendChild(pageZoomIncreaseButtonSpan);
    const sliderElement: HTMLElement = createElement('div', { id: idString + '_slider' });
    this.pageZoomSlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-page-zoom-slider', max: this.getImageZoomMax(), min: this.getImageZoomMin(), step: this.pageZoomSliderStep });
    if (!this.pdfViewer.enableRtl) {
        outerContainer.appendChild(this.pageZoomDecreaseButton);
        outerContainer.appendChild(sliderElement);
        this.pageZoomSlider.appendTo(sliderElement);
        outerContainer.appendChild(this.pageZoomIncreaseButton);
    } else {
        outerContainer.appendChild(this.pageZoomIncreaseButton);
        outerContainer.appendChild(sliderElement);
        this.pageZoomSlider.enableRtl = true;
        this.pageZoomSlider.appendTo(sliderElement);
        outerContainer.appendChild(this.pageZoomDecreaseButton);
    }
    this.pageZoomSlider.element.parentElement.classList.add('e-pv-page-zoom-slider-container');
    return outerContainer;
}

/**
 * @private
 * @param {number} currentZoomValue - It's describe about current zoom value.
 * @returns { void }
 */
export function handlePageZoomButtonsVisibility(currentZoomValue: number): void {
    if (currentZoomValue === this.getImageZoomMin()) {
        enablePageZoomButtons.call(this, false, false);
        enablePageZoomButtons.call(this, true, true);
    }
    else if (currentZoomValue === this.getImageZoomMax()) {
        enablePageZoomButtons.call(this, false, true);
        enablePageZoomButtons.call(this, true, false);
    }
    else {
        enablePageZoomButtons.call(this, true, true);
        enablePageZoomButtons.call(this, true, false);
    }
}

/**
 * @private
 * @param {boolean} isEnable - It's describe about a enable or disable zoom button.
 * @param {boolean} isIncrease - It's describe about a zoom increase or not.
 * @returns { void }
 */
export function enablePageZoomButtons(isEnable: boolean, isIncrease: boolean): void {
    let buttonToModify: HTMLButtonElement;
    if (isIncrease) {
        buttonToModify = this.pageZoomIncreaseButton;
    }
    else {
        buttonToModify = this.pageZoomDecreaseButton;
    }
    if (!isNullOrUndefined(buttonToModify)) {
        if (isEnable) {
            buttonToModify.removeAttribute('disabled');
            buttonToModify.firstElementChild.classList.remove('e-disabled');
        }
        else {
            buttonToModify.setAttribute('disabled', 'disabled');
            buttonToModify.firstElementChild.classList.add('e-disabled');
        }
    }
}

/**
 * @private
 * @param {PageOrganizerSettingsModel} newProp - It's describe about a zoom properties.
 * @returns { void }
 */
export function handleImageSizeBoundsChange(newProp: PageOrganizerSettingsModel): void {
    if (!isNullOrUndefined(newProp.imageZoomMin)) {
        this.pdfViewer.pageOrganizerSettings.imageZoomMin = newProp.imageZoomMin;
    }
    if (!isNullOrUndefined(newProp.imageZoomMax)) {
        this.pdfViewer.pageOrganizerSettings.imageZoomMax = newProp.imageZoomMax;
    }
    if (!isNullOrUndefined(this.pageZoomSlider)) {
        this.pageZoomSlider.min = this.getImageZoomMin();
        this.pageZoomSlider.max = this.getImageZoomMax();
    }
}

/**
 * @private
 * @returns { void }
 */
export function pageZoomWireEvents(): void {
    if (!isNullOrUndefined(this.pageZoomDropDown)) {
        this.boundPageZoomDropDownOpen = pageZoomDropDownOpen.bind(this);
        this.boundPageZoomDropDownClose = pageZoomDropDownClose.bind(this);

        this.pageZoomDropDown.open = this.boundPageZoomDropDownOpen;
        this.pageZoomDropDown.close = this.boundPageZoomDropDownClose;
    }
    if (!isNullOrUndefined(this.pageZoomDecreaseButton)) {
        this.boundDecreasePageZoom = decreasePageZoom.bind(this);
        this.pageZoomDecreaseButton.addEventListener('click', this.boundDecreasePageZoom);
    }
    if (!isNullOrUndefined(this.pageZoomIncreaseButton)) {
        this.boundIncreasePageZoom = increasePageZoom.bind(this);
        this.pageZoomIncreaseButton.addEventListener('click', this.boundIncreasePageZoom);
    }
}

/**
 * @private
 * @returns { void }
 */
export function increasePageZoom(): void {
    if (this.pageZoomSlider.value as number + this.pageZoomSliderStep <= this.getImageZoomMax()) {
        this.handlePageZoomChange(
            this.pageZoomSlider.value as number + this.pageZoomSliderStep, this.pageZoomSlider.value as number);
    }
    else {
        if (this.pageZoomSlider.value as number !== this.getImageZoomMax()) {
            this.handlePageZoomChange(this.getImageZoomMax(), this.pageZoomSlider.value as number);
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function decreasePageZoom(): void {
    if (this.pageZoomSlider.value as number - this.pageZoomSliderStep >= this.getImageZoomMin()) {
        this.handlePageZoomChange(
            this.pageZoomSlider.value as number - this.pageZoomSliderStep, this.pageZoomSlider.value as number);
    }
    else {
        if (this.pageZoomSlider.value as number !== this.getImageZoomMin()) {
            this.handlePageZoomChange(this.getImageZoomMin(), this.pageZoomSlider.value as number);
        }
    }
}

/**
 * @private
 * @param {number} currentValue - It's describe about current zoom value.
 * @param {number} previousValue - It's describe about previous zoom value.
 * @returns { void }
 */
export function handlePageZoomChange(currentValue: number, previousValue: number): void {
    this.currentPageZoomSliderValue = currentValue;
    this.pdfViewer.pageOrganizerSettings.imageZoom = currentValue;
    updatePageZoomPopup.call(this);
    if (this.previouslyRequestedImageZoom < Math.round(currentValue)) {
        this.previouslyRequestedImageZoom = Math.round(currentValue);
        this.updateOrganizePageImageSize(Math.round(currentValue));
        this.previousImageZoom = previousValue;
    }
    else {
        const organizeNodes: HTMLCollection = this.tileAreaDiv.children;
        const imageSizeFactor: number = getImageZoomFactor.call(this, organizeNodes[0].cloneNode(true) as HTMLDivElement);
        /* eslint-disable security/detect-object-injection */
        for (let index: number = 0; index < organizeNodes.length; index++) {
            const imageContainer: HTMLDivElement = organizeNodes[index] as HTMLDivElement;
            imageContainer.style.width = 140 * imageSizeFactor + 'px';
            imageContainer.style.height = 140 * imageSizeFactor + 'px';
        }
        /* eslint-enable security/detect-object-injection */
        if (this.pdfViewerBase.getElement('_organizeLoadingIndicator').style.display !== 'block') {
            this.currentImageZoom = currentValue;
            this.previousImageZoom = previousValue;
            if (this.currentImageZoom !== this.previousImageZoom) {
                this.pdfViewer.firePageOrganizerZoomChanged(this.previousImageZoom, this.currentImageZoom);
            }
        }
    }
    handlePageZoomButtonsVisibility.call(this, currentValue);
}

/**
 * @private
 * @returns { void }
 */
export function pageZoomUnWireEvents(): void {
    if (!isNullOrUndefined(this.pageZoomDropDown)) {
        this.pageZoomDropDown.removeEventListener('open', this.boundPageZoomDropDownOpen);
        this.pageZoomDropDown.removeEventListener('close', this.boundPageZoomDropDownClose);
    }
    if (!isNullOrUndefined(this.pageZoomDecreaseButton)) {
        this.pageZoomDecreaseButton.removeEventListener('click', this.boundDecreasePageZoom);
    }
    if (!isNullOrUndefined(this.pageZoomIncreaseButton)) {
        this.pageZoomIncreaseButton.removeEventListener('click', this.boundIncreasePageZoom);
    }
}

/**
 * @private
 * @returns { void }
 */
export function pageZoomSliderWireEvents(): void {
    if (!isNullOrUndefined(this.pageZoomSlider)) {
        this.boundPageZoomChange = pageZoomChange.bind(this);
        this.pageZoomSlider.change = this.boundPageZoomChange;
        this.pageZoomSlider.changed = this.boundPageZoomChange;
    }
}

/**
 * @private
 * @returns { void }
 */
export function pageZoomSliderUnwireEvents(): void {
    if (!isNullOrUndefined(this.pageZoomSlider)) {
        this.pageZoomSlider.removeEventListener('change', this.boundPageZoomChange);
        this.pageZoomSlider.removeEventListener('changed', this.boundPageZoomChange);
    }
}

/**
 * @private
 * @param {number} newSize - It's describe about new image size.
 * @param {number} oldSize - It's describe about old image size.
 * @returns { void }
 */
export function updateOrganizePageImageSize(newSize: number, oldSize?: number): void {
    if (!isNullOrUndefined(oldSize)) {
        if (oldSize === newSize) {
            return;
        }
    }
    if (this.pdfViewerBase.clientSideRendering) {
        this.pdfViewerBase.pdfViewerRunner.removePreviewImageTasks(newSize);
    }
    this.lastRequestedPageIndex = 0;
    this.dataDetails = [];
    this.isPageZoomChanged = true;
    if (!this.isOrganizeWindowOpen) {
        if (!isNullOrUndefined(this.pdfViewerBase.navigationPane)) {
            this.pdfViewerBase.navigationPane.enableOrganizeButton(false);
        }
        if (!isNullOrUndefined(this.toolbar)) {
            this.pdfViewer.toolbar.enableToolbarItem(['OrganizePagesTool'], false);
        }
        if (isOrganizeDialogRendered.call(this)) {
            modifyThumbnailContainer.call(this);
        }
    }
    else {
        this.showOrganizeLoadingIndicator(true);
        modifyThumbnailContainer.call(this);
        if (this.isPageZoomPopupOpen) {
            updatePageZoomPopup.call(this);
        }
    }
    this.isAllImagesReceived = false;
    this.createRequestForPreview();
}
