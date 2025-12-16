import { PageDetails, PdfPageRotateAngle } from '../organize-pdf';
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';


/**
 * @private
 * @param { string } rotate - It's describe about a rotate angle in string.
 * @returns { number } - It's describe a rotation angle.
 */
export function getRotatedAngle(rotate: string): number {
    switch (rotate.trim()) {
    case '0':
        return 0;
    case '90':
    case '1':
        return 90;
    case '180':
    case '2':
        return 180;
    case '270':
    case '3':
        return 270;
    case '360':
    case '4':
        return 0;
    default:
        return 0;
    }
}

/**
 * @private
 * @param { string } rotateAngle - It's describe about a rotate angle in string.
 * @returns { number } - It's describe about a rotation value.
 */
export function getRotation(rotateAngle: string): number {
    switch (rotateAngle.trim()) {
    case '0':
        return 0;
    case '90':
        return 1;
    case '180':
        return 2;
    case '270':
        return 3;
    case '360':
        return 0;
    default:
        return 0;
    }
}

/**
 * @private
 * @param { number } pageIndex - It's describe about a current page index.
 * @param { number } pageWidth - It's describe about a page width.
 * @param { number } pageHeight - It's describe about a page height.
 * @returns {void}
 */
export function updatePageSize(pageIndex: number, pageWidth: number, pageHeight: number): void {
    if (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)]) {
        this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width = pageWidth;
        this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height = pageHeight;
        if (this.pdfViewerBase.highestWidth < pageWidth) {
            this.pdfViewerBase.highestWidth = pageWidth;
        }
        this.pdfViewerBase.isMixedSizeDocument = true;
    }
    for (let i: number = pageIndex; i < this.pdfViewerBase.pageSize.length; i++) {
        if (!this.pdfViewerBase.pageSize[parseInt((i - 1).toString(), 10)] && i - 1 < 0) {
            this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].top = this.pdfViewerBase.pageGap;
        }
        else {
            this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].top =
                this.pdfViewerBase.pageSize[parseInt((i - 1).toString(), 10)].top +
                this.pdfViewerBase.pageSize[parseInt((i - 1).toString(), 10)].height + this.pdfViewerBase.pageGap;
        }

    }
}

/**
 * @private
 * @param { HTMLElement } parentElement - It's describe about a page html element.
 * @param { number } parentPageIndex - It's describe about a parent page index.
 * @returns { number } - It's describe about a next page index.
 */
export function getNextSubIndex(parentElement: HTMLElement, parentPageIndex: number): number {
    const elementsWithAnchorId: any = parentElement.querySelectorAll(`[id^='anchor_page_${parentPageIndex}']`);
    // Find the largest subindex among the existing elements
    let maxSubIndex: number = -1;
    elementsWithAnchorId.forEach((element: any) => {
        const [pageIndex, subIndex] = element.id.split('_').slice(2);
        if (Number(subIndex) > maxSubIndex) {
            maxSubIndex = Number(subIndex);
        }
    });
    return maxSubIndex + 1;
}

/**
 * @private
 * @param { number[] } pageNumbers - It's describe about a document page numbers collection.
 * @returns { void }
 */
export function rotateClockwise(pageNumbers: number[]): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        // Iterate through the provided page numbers
        for (const pageIndex of pageNumbers) {
            // Find the index of the page in the rotationDetail array
            const index: number = this.organizePagesCollection.findIndex((item: PageDetails) => item.pageIndex === pageIndex);
            // Check if the page is already in the rotationDetail array
            if (index !== -1) {
                // If the pageIndex is found in the array, update the rotation angle
                this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle =
                    (this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle + 90 + 360) % 360;
            }
        }
    }
}

/**
 * @private
 * @param { number[] } pageNumbers - It's describe about a document page numbers collection.
 * @returns { void }
 */
export function rotateCounterclockwise(pageNumbers: number[]): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        // Iterate through the provided page numbers
        for (const pageIndex of pageNumbers) {
            // Find the index of the page in the rotationDetail array
            const index: number = this.organizePagesCollection.findIndex((item: PageDetails) => item.pageIndex === pageIndex);
            // Check if the page is already in the rotationDetail array
            if (index !== -1) {
                // If the pageIndex is found in the array, update the rotation angle
                this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle =
                    (this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle - 90 + 360) % 360;
            }
        }
    }
}

/**
 * @private
 * @param { HTMLDivElement } imageContainer - It's describe about a tile image container.
 * @returns { number } - It's describe about a image zoom factor.
 */
export function getImageZoomFactor(imageContainer: HTMLDivElement): number {
    const minValue: number = this.getImageZoomMin();
    if (!this.pdfViewer.enablePageOrganizer || isNullOrUndefined(this.pdfViewer.pageOrganizerSettings)) {
        return minValue;
    }
    const size: number = this.getImageZoomValue();
    if (isNullOrUndefined(size)) {
        return minValue;
    }
    const maxValue: number = this.getImageZoomMax();
    if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
        return this.getImageZoomValue();
    }
    else {
        const viewportWidth: number = this.pdfViewer.element.clientWidth;
        const imageContainerWidth: number = 140;
        imageContainer.style.position = 'absolute';
        document.body.appendChild(imageContainer);
        const computedStyle: CSSStyleDeclaration = window.getComputedStyle(imageContainer);
        const margin: number = parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight);
        document.body.removeChild(imageContainer);
        if ((imageContainerWidth * maxValue) <= (viewportWidth - margin)) {
            return this.getImageZoomValue();
        }
        else {
            const maxFactor: number = (viewportWidth - margin) / imageContainerWidth;
            const factor: number = (maxFactor - minValue) / (maxValue - minValue);
            if (size < minValue) {
                return minValue;
            }
            if (size > maxValue) {
                return (minValue + ((maxValue - minValue) * factor));
            }
            return (minValue + ((size - minValue) * factor));
        }
    }
}

/**
 * @private
 * @param { boolean } isImageRequest - It's describe about a is image request or not.
 * @param { number } size - It's describe about a tile image container.
 * @returns { number } - It's describe about a image zoom value.
 */
export function getImageZoomValue(isImageRequest?: boolean, size?: number): number {
    const minValue: number = this.getImageZoomMin();
    if (!this.pdfViewer.enablePageOrganizer || isNullOrUndefined(this.pdfViewer.pageOrganizerSettings)) {
        return minValue;
    }
    if (isNullOrUndefined(size)) {
        size = this.pdfViewer.pageOrganizerSettings.imageZoom;
        if (isNullOrUndefined(size)) {
            return minValue;
        }
    }
    const maxValue: number = this.getImageZoomMax();
    if (size < minValue) {
        return minValue;
    }
    if (size > maxValue) {
        return maxValue;
    }
    if (isImageRequest) {
        return Math.round(size);
    }
    return size;
}

/**
 * @private
 * @param { number[] } pageIndexes - It's describe about a is image request or not.
 * @param { PdfPageRotateAngle } pageRotateAngle - It's describe about a tile image container.
 * @returns { void }
 */
export function processRotation(pageIndexes: number[], pageRotateAngle: PdfPageRotateAngle): void {
    if (this.pdfViewer.pageOrganizerSettings.canRotate) {
        // Iterate through the provided page numbers
        for (const pageIndex of pageIndexes) {
            const rotateAngle: number = pdfRotateAngle(pageRotateAngle);
            // Find the index of the page in the rotationDetail array
            const index: number = this.organizePagesCollection.findIndex((item: PageDetails) => item.pageIndex === pageIndex);
            // Check if the page is already in the rotationDetail array
            if (index !== -1) {
                // If the pageIndex is found in the array, update the rotation angle
                this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle =
                    (this.organizePagesCollection[parseInt(index.toString(), 10)].rotateAngle + rotateAngle + 360) % 360;
            }
        }
    }
}

/**
 * @private
 * @param { PdfPageRotateAngle } rotateAngle - It's describe about a tile image rotation.
 * @returns { void }
 */
export function pdfRotateAngle(rotateAngle: PdfPageRotateAngle): number {
    let angle: number = 0;
    if (rotateAngle === PdfPageRotateAngle.RotateAngle0) {
        angle = 0;
    }
    else if (rotateAngle === PdfPageRotateAngle.RotateAngle90) {
        angle = 90;
    }
    else if (rotateAngle === PdfPageRotateAngle.RotateAngle180) {
        angle = 180;
    }
    else if (rotateAngle === PdfPageRotateAngle.RotateAngle270) {
        angle = 270;
    }
    else if (rotateAngle === PdfPageRotateAngle.RotateAngle360) {
        angle = 0;
    }
    return angle;
}

/**
 * @private
 * @param { any } a - It's describe about a start page index.
 * @param { any } b - It's describe about a end page index.
 * @returns { number } - It's describe about a current page index.
 */
export function sorting(a: any, b: any): number {
    a = !isNullOrUndefined(a) ? parseInt(a.toString(), 10) : -1;
    b = !isNullOrUndefined(b) ? parseInt(b.toString(), 10) : -1;
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
}
