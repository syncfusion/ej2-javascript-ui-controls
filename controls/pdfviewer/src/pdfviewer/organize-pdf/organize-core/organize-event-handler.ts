import { isNullOrUndefined, DragEventArgs, DropEventArgs } from '@syncfusion/ej2-base';
import { clearSelection, deselectTile, selectAllTiles, selectRange } from './tile-interaction';
import { enableDisableToolbarItems, updateSelectAllCheckbox } from './organize-toolbar';
import { importDocument } from './organize-importaction';

/**
 * @private
 * @returns { void }
 */
export function initEventListeners(): void {
    this.boundOnTileAreaMouseDown = onTileAreaMouseDown.bind(this);
    this.boundOnTileAreaKeyDown = onTileAreaKeyDown.bind(this);
    this.boundOnTileAreaKeyUp = onTileAreaKeyUp.bind(this);
    this.boundPageOrganizerOnScroll = pageOrganizerOnScroll.bind(this);

    this.dialogDivElement.addEventListener('wheel', this.boundPageOrganizerOnScroll);
    this.tileAreaDiv.addEventListener('mousedown', this.boundOnTileAreaMouseDown);
    document.addEventListener('keydown', this.boundOnTileAreaKeyDown);
    document.addEventListener('keyup', this.boundOnTileAreaKeyUp);
}

/**
 * @private
 * @returns { void }
 */
export function removeEventListeners(): void {
    if (!isNullOrUndefined(this.dialogDivElement)) {
        this.dialogDivElement.removeEventListener('wheel', this.boundPageOrganizerOnScroll);
    }
    if (!isNullOrUndefined(this.tileAreaDiv)) {
        this.tileAreaDiv.removeEventListener('mousedown', this.boundOnTileAreaMouseDown);
    }
    document.removeEventListener('keydown', this.boundOnTileAreaKeyDown);
    document.removeEventListener('keyup', this.boundOnTileAreaKeyUp);
}

/**
 * @private
 * @param { WheelEvent } event - It's describe about the page organizer scroll data.
 * @returns { void }
 */
export function pageOrganizerOnScroll(event: WheelEvent): void {
    if (this.ctrlKey) {
        event.preventDefault();
        const imageZoom: number = this.getImageZoomValue();
        const imageZoomMin: number = this.getImageZoomMin();
        const imageZoomMax: number = this.getImageZoomMax();
        if (event.deltaY < 0 && (imageZoom < imageZoomMax)) {
            if (imageZoom + this.pageZoomSliderStep < imageZoomMax) {
                this.handlePageZoomChange(imageZoom + this.pageZoomSliderStep, imageZoom);
            }
            else if (imageZoom + this.pageZoomSliderStep > imageZoomMax && imageZoom !== imageZoomMax) {
                this.handlePageZoomChange(imageZoomMax, imageZoom);
            }
        }
        else if (event.deltaY > 0 && (imageZoom > imageZoomMin)) {
            if (imageZoom - this.pageZoomSliderStep > imageZoomMin) {
                this.handlePageZoomChange(imageZoom - this.pageZoomSliderStep, imageZoom);
            }
            else if (imageZoom - this.pageZoomSliderStep < imageZoomMin && imageZoom !== imageZoomMin) {
                this.handlePageZoomChange(imageZoomMin, imageZoom);
            }
        }
    }
}

/**
 * @private
 * @param { MouseEvent } event - It's describe about the page organizer tile data on mouse down action.
 * @returns { void }
 */
export function onTileAreaMouseDown(event: MouseEvent): void {
    if (event.target && (event.target as HTMLElement).parentElement && (event.target as HTMLElement).parentElement.firstElementChild &&
        (event.target as HTMLElement).parentElement.firstElementChild.classList.contains('e-pv-organize-tile-checkbox')) {
        this.isClickedOnCheckBox = true;
    } else {
        this.isClickedOnCheckBox = false;
    }

    if ((event.target as HTMLElement).closest('.e-pv-organize-anchor-node')) {
        const targetTile: HTMLElement = event.target as HTMLElement;
        const tiles: any = Array.from(this.tileAreaDiv.children);
        if (this.shiftKey && this.startTile) {
            // Shift key selection logic
            const currentIndex: number = Array.from(this.tileAreaDiv.children).indexOf(targetTile.closest('.e-pv-organize-anchor-node'));
            if (this.startTile) {
                const startIndex: number = Array.from(this.tileAreaDiv.children).indexOf(this.startTile.closest('.e-pv-organize-anchor-node'));
                selectRange.call(this, startIndex, currentIndex);
                tiles.forEach((tile: HTMLElement, index: number) => {
                    if (index < Math.min(startIndex, currentIndex) || index > Math.max(startIndex, currentIndex)) {
                        deselectTile.call(this, tile);
                    }
                });
            }
        } else if (!this.ctrlKey) {
            this.startTile = targetTile;
        }
    } else {
        if (!this.ctrlKey && !this.shiftKey) {
            clearSelection.call(this);
            this.startTile = null;
        }
    }
    updateSelectAllCheckbox.call(this);
    enableDisableToolbarItems.call(this);
}

/**
 * @private
 * @param { KeyboardEvent } event - It's describe about the page organizer tile data on key down action.
 * @returns { void }
 */
export function onTileAreaKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        this.ctrlKey = true;
        const keyCode: number = this.pdfViewerBase.getLegacyKeyCode(event);
        if (this.isOrganizeWindowOpen) {
            if (keyCode === 65) {
                event.preventDefault();
                selectAllTiles.call(this);
            }
            if (keyCode === 90) {
                event.preventDefault();
                this.undo();
            }
            else if (keyCode === 89) {
                event.preventDefault();
                this.redo();
            }
        }
    }
    if (event.shiftKey) {
        this.shiftKey = true;
    }
}

/**
 * @private
 * @param { KeyboardEvent } event - It's describe about the page organizer tile data on key up action.
 * @returns { void }
 */
export function onTileAreaKeyUp(event: KeyboardEvent): void {
    if (!(event.ctrlKey || event.metaKey)) {
        this.ctrlKey = false;
    }
    if (!event.shiftKey) {
        this.shiftKey = false;
    }
}

/**
 * @private
 * @param { any } event - It's describe about the page organizer select all checkbox data.
 * @returns { void }
 */
export function onSelectAllClick(event: any): void {
    if (event.checked) {
        selectAllTiles.call(this);
    } else {
        clearSelection.call(this);
    }
}

/**
 * @private
 * @param { DragEventArgs } e - It's describe about auto scroll data.
 * @returns { void }
 */
export function autoScroll(e: DragEventArgs): void {
    // eslint-disable-next-line
    const proxy = this;
    const viewportY: any = e.event.type === 'touchmove' ? e.event.touches[0].clientY : e.event.clientY;
    const edgeSize: number = 10;
    this.autoScrollInterval = null;
    const viewportHeight: number = window.innerHeight;
    let edgeTop: number = edgeSize;
    let edgeBottom: number = (viewportHeight - edgeSize);
    const toolbarBottom: number = document.getElementById(this.pdfViewer.element.id + '_toolbar_appearance').getBoundingClientRect().bottom + edgeSize;
    const footer: any = this.organizeDialog.element.getElementsByClassName('e-footer-content');
    let footerBounds: any;
    if (!isNullOrUndefined(footer) && footer.length > 0) {
        footerBounds = footer[0].getBoundingClientRect();
    }
    const footerTop: number = !isNullOrUndefined(footerBounds) ? (footerBounds.top - edgeSize) :
        (this.tileAreaDiv.getBoundingClientRect().bottom - edgeSize);
    edgeTop = parseFloat(Math.max(edgeTop, toolbarBottom).toFixed(2));
    edgeBottom = Math.min(edgeBottom, footerTop);
    if (this.virtualEle.getBoundingClientRect().height >= this.tileAreaDiv.getBoundingClientRect().height) {
        clearTimeout(this.autoScrollInterval);
        proxy.autoScrollInterval = null;
        return;
    }
    const isInTopEdge: boolean = (parseFloat(this.virtualEle.getBoundingClientRect().top.toFixed(2)) <= edgeTop);
    const isInBottomEdge: boolean = (this.virtualEle.getBoundingClientRect().bottom >= edgeBottom);
    // If the mouse is not in the viewport edge, there's no need to calculate anything else.
    if (!(isInTopEdge || isInBottomEdge)) {
        clearTimeout(this.autoScrollInterval);
        proxy.autoScrollInterval = null;
        return;
    }
    const maxScrollY: number = (this.tileAreaDiv.scrollHeight - this.tileAreaDiv.clientHeight);
    (function checkForWindowScroll(): void {
        clearTimeout(proxy.autoScrollInterval);
        proxy.autoScrollInterval = null;
        if (adjustWindowScroll()) {
            proxy.autoScrollInterval = window.setTimeout(checkForWindowScroll, 30);
        }
        // eslint-disable-next-line
    })();
    function adjustWindowScroll(): boolean {
        proxy.tileAreaDiv.onscroll = function (): void {
            const outerBorder: HTMLElement = document.querySelector('.e-pv-organize-outer-border') as HTMLElement;
            if (!isNullOrUndefined(outerBorder)) {
                outerBorder.style.display = 'none';
            }
        };
        const elementBounds: any = proxy.virtualEle.getBoundingClientRect();
        const dragDownDiffrence: number = elementBounds.bottom - (proxy.previousClientY + elementBounds.height);
        const dragUpDiffrence: number = elementBounds.top - proxy.previousClientY;
        proxy.previousClientY = elementBounds.top;
        const currentScrollY: number = proxy.tileAreaDiv.scrollTop;
        const canScrollUp: boolean = (currentScrollY > 0 && dragUpDiffrence <= 0);
        const canScrollDown: boolean = (currentScrollY < maxScrollY && dragDownDiffrence >= 0);
        let nextScrollY: number = currentScrollY;
        const maxStep: number = 10;
        // Should we scroll up?
        if (isInTopEdge && canScrollUp) {
            const intensity: number = ((edgeTop - proxy.virtualEle.getBoundingClientRect().top) / edgeSize);
            nextScrollY = (nextScrollY - (maxStep * intensity));
            // Should we scroll down?
        } else if (isInBottomEdge && canScrollDown) {
            const intensity: number = ((proxy.virtualEle.getBoundingClientRect().bottom - edgeBottom) / edgeSize);
            nextScrollY = (nextScrollY + (maxStep * intensity));
        }
        nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));
        if (nextScrollY !== currentScrollY) {
            proxy.tileAreaDiv.scrollTop = nextScrollY;
            return (true);
        } else {
            return (false);
        }
    }
}

/**
 * @private
 * @param { DropEventArgs } e - It's describe about drop event data.
 * @param { DOMRect } tileRect - It's describe about tile rect bounds.
 * @param { number } gapBetweenDivs - It's describe about gap between divs
 * @param { HTMLElement } outerBorder - It's describe about border html element
 * @returns { void }
 */
export function handlePageMove(e: DropEventArgs, tileRect: DOMRect, gapBetweenDivs: number,
                               outerBorder: HTMLElement): void {
    const isRightInsertion: boolean = isTileRightInsertion(e);
    if (!isNullOrUndefined(isTileRightInsertion)) {
        const offset: number = isRightInsertion ? (tileRect['width'] + gapBetweenDivs / 2) : (-gapBetweenDivs / 2);
        const parentBound: DOMRect = outerBorder.parentElement.getBoundingClientRect() as DOMRect;
        outerBorder.style.left = (tileRect['x'] + offset - parentBound.x) + 'px';
        outerBorder.style.top = (tileRect['top'] - parentBound.y) + 'px';
        outerBorder.style.height = tileRect['height'] + 'px';
        this.isRightInsertion = isRightInsertion;
    }
}

/**
 * @private
 * @param { DropEventArgs } e - It's describe about drop event data.
 * @returns { boolean } - It's describe about right tile insert or not.
 */
export function isTileRightInsertion(e: DropEventArgs): boolean {
    const mainTileElement: HTMLElement = !isNullOrUndefined(e.target) ? (e.target.closest('.e-pv-organize-anchor-node') as HTMLElement) : null;
    if (!isNullOrUndefined(mainTileElement)) {
        const tileRect: DOMRect = mainTileElement.getBoundingClientRect() as DOMRect;
        const virtualElementClientX: number = e.event.type === 'mousemove' ? e.event.clientX : e.event.touches[0].clientX;
        return virtualElementClientX > tileRect['x'] + (tileRect['width'] / 2);
    }
    return null;
}

/**
 * @private
 * @returns { void }
 */
export function importDocWireEvent(): void {
    if (this.importDocInputElement) {
        this.boundImportDocument = importDocument.bind(this);
        this.importDocInputElement.addEventListener('change', this.boundImportDocument);
    }
}

/**
 * @private
 * @returns { void }
 */
export function importDocUnWireEvent(): void {
    if (this.importDocInputElement) {
        this.boundImportDocument = null;
        this.importDocInputElement.removeEventListener('change', this.boundImportDocument);
    }
}
