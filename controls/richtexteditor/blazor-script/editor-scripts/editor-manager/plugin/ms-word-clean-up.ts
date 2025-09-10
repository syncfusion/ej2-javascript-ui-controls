import { EditorManager } from '../base/editor-manager';
import * as EVENTS from '../../common/constant';
import { ListItemProperties, NotifyArgs } from '../../common/interface';
import { createElement, isNullOrUndefined as isNOU, detach, addClass, Browser } from '../../../../base'; /*externalscript*/
import { PASTE_SOURCE } from '../base/constant';
import { InsertMethods } from './insert-methods';
/**
 * PasteCleanup for MsWord content
 *
 * @hidden
 * @deprecated
 */
export class MsWordPaste {
    private parent: EditorManager;
    /**
     * Initializes a new instance of the MsWordPaste class
     *
     * @param {EditorManager} parent - The parent editor manager instance
     * @returns {void} - No return value
     */
    public constructor(parent?: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }

    private olData: string[] = [
        'decimal',
        'decimal-leading-zero',
        'lower-alpha',
        'lower-roman',
        'upper-alpha',
        'upper-roman',
        'lower-greek'
    ];
    private ulData: string[] = [
        'disc',
        'square',
        'circle',
        'disc',
        'square',
        'circle'
    ];
    /** List of HTML node names that should not be ignored during cleanup */
    private ignorableNodes: string[] = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
        'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
        'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
        'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
        'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
        'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
        'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
    /** List of HTML block node names */
    private blockNode: string[] = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
    private borderStyle: string[] = ['border-top', 'border-right', 'border-bottom', 'border-left'];
    private upperRomanNumber: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
        'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
    private lowerRomanNumber: string[] = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix',
        'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];
    private lowerGreekNumber: string[] = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ',
        'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
    private removableElements: string[] = ['o:p', 'style', 'w:sdt'];
    private listContents: string[] = [];
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.MS_WORD_CLEANUP_PLUGIN, this.wordCleanup, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.MS_WORD_CLEANUP_PLUGIN, this.wordCleanup);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);

    }
    private cropImageDimensions: { [key: string]: string | boolean | number }[] = [];

    /* Cleans up MS Word content from clipboard data */
    private wordCleanup(notifyArgs: NotifyArgs): void {
        const wordPasteStyleConfig: string[] = !isNOU(notifyArgs.allowedStylePropertiesArray) ?
            notifyArgs.allowedStylePropertiesArray : [];
        let listNodes: Element[] = [];
        let clipboardHtmlContent: string = (notifyArgs.args as ClipboardEvent).clipboardData.getData('text/HTML');
        const rtfData: string = (notifyArgs.args as ClipboardEvent).clipboardData.getData('text/rtf');

        const clipboardDataElement: HTMLElement = createElement('p') as HTMLElement;
        clipboardDataElement.setAttribute('id', 'MSWord-Content');
        clipboardDataElement.innerHTML = clipboardHtmlContent;
        this.addDoubleBr(clipboardDataElement);

        const msoClassSingleQuotePattern: RegExp = /class='?Mso|style='[^ ]*\bmso-/i;
        const msoClassDoubleQuotePattern: RegExp = /class="?Mso|style="[^ ]*\bmso-/i;
        const msoComplexPattern: RegExp =
            /(class="?Mso|class='?Mso|class="?Xl|class='?Xl|class=Xl|style="[^"]*\bmso-|style='[^']*\bmso-|w:WordDocument)/gi;
        const msoWidthSourcePattern: RegExp = /style='mso-width-source:/i;
        const contentSource: string = this.findSource(clipboardDataElement);

        if (msoClassSingleQuotePattern.test(clipboardHtmlContent) || msoClassDoubleQuotePattern.test(clipboardHtmlContent) ||
            msoComplexPattern.test(clipboardHtmlContent) || msoWidthSourcePattern.test(clipboardHtmlContent)) {
            clipboardHtmlContent = clipboardHtmlContent.replace(/<img[^>]+>/i, '');
            this.addListClass(clipboardDataElement);
            listNodes = this.listCleanUp(clipboardDataElement, listNodes);
            if (!isNOU(listNodes[0]) && listNodes[0].parentElement.tagName !== 'UL' &&
                listNodes[0].parentElement.tagName !== 'OL') {
                this.listConverter(listNodes);
            }

            this.imageConversion(clipboardDataElement, rtfData);
            this.cleanList(clipboardDataElement, 'UL');
            this.cleanList(clipboardDataElement, 'OL');
            this.styleCorrection(clipboardDataElement, wordPasteStyleConfig);
            this.removingComments(clipboardDataElement);
            this.removeUnwantedElements(clipboardDataElement);
            this.removeEmptyElements(clipboardDataElement);
            this.removeEmptyAnchorTag(clipboardDataElement);
            this.breakLineAddition(clipboardDataElement);
            this.processMargin(clipboardDataElement);
            this.removeClassName(clipboardDataElement);

            if (msoWidthSourcePattern.test(clipboardHtmlContent)) {
                this.addTableBorderClass(clipboardDataElement);
            }
            notifyArgs.callBack(clipboardDataElement.innerHTML, this.cropImageDimensions, contentSource);
        } else {
            if (contentSource === PASTE_SOURCE[2]) {
                this.handleOneNoteContent(clipboardDataElement);
            }
            this.removeEmptyMetaTags(clipboardDataElement);
            notifyArgs.callBack(clipboardDataElement.innerHTML, null, contentSource);
        }
    }

    /* Adds double line breaks for Apple-interchange-newline elements in Chrome. */
    private addDoubleBr(clipboardDataElement: HTMLElement): void {
        const newlineElement: HTMLElement = clipboardDataElement.querySelector('.Apple-interchange-newline');
        const isValidNewline: boolean = !isNOU(newlineElement) && Browser.userAgent.indexOf('Chrome') !== -1 &&
            newlineElement.parentElement.nodeName === 'P' && clipboardDataElement !== newlineElement.parentElement;
        if (isValidNewline) {
            for (let i: number = 0; i < clipboardDataElement.childNodes.length; i++) {
                const currentNode: Node = clipboardDataElement.childNodes[i as number];
                const isStartFragment: boolean = currentNode.nodeType === Node.COMMENT_NODE &&
                    currentNode.nodeValue.indexOf('StartFragment') !== -1;
                if (isStartFragment) {
                    const paragraphElement: HTMLElement = createElement('p');
                    paragraphElement.innerHTML = '<br>';
                    const parentStyles: string = newlineElement.parentElement.style.cssText;
                    const currentStyles: string = paragraphElement.getAttribute('style') || '';
                    const combinedStyles: string = currentStyles + parentStyles;
                    paragraphElement.style.cssText = combinedStyles;
                    clipboardDataElement.insertBefore(paragraphElement, currentNode.nextSibling);
                    detach(newlineElement);
                    break;
                }
            }
        }
    }

    /* Cleans list elements by removing div elements and restructuring the list */
    private cleanList(clipboardDataElement: HTMLElement, listTagName: string): void {
        const divElements: NodeListOf<Element> = clipboardDataElement.querySelectorAll(listTagName + ' div');
        for (let i: number = divElements.length - 1; i >= 0; i--) {
            const currentDiv: Element = divElements[i as number];
            const parentNode: Node = currentDiv.parentNode;
            // Move all children of the div to its parent
            while (currentDiv.firstChild) {
                parentNode.insertBefore(currentDiv.firstChild, currentDiv);
            }
            // Find the closest list element and insert the div after it
            const closestListElement: Element = this.findClosestListElem(currentDiv);
            if (closestListElement) {
                this.insertAfter(currentDiv, closestListElement);
            }
        }
    }

    /* Inserts a node after a reference node */
    private insertAfter(newNode: Element, referenceNode: Element): void {
        if (referenceNode.parentNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }

    /* Finds the closest list element (UL or OL) to the given element */
    private findClosestListElem(currentElement: Element): Element {
        let closestListElement: Element;
        while (!isNOU(currentElement)) {
            const hasUlParent: boolean = !isNOU(currentElement.closest('ul')) && currentElement.tagName !== 'UL';
            const hasOlParent: boolean = currentElement.tagName !== 'OL' && !isNOU(currentElement.closest('ol'));
            if (hasUlParent) {
                currentElement = currentElement.closest('ul');
            } else if (hasOlParent) {
                currentElement = currentElement.closest('ol');
            } else {
                currentElement = null;
            }
            closestListElement = !isNOU(currentElement) ? currentElement : closestListElement;
        }
        return closestListElement;
    }

    /* Adds 'msolistparagraph' class to elements that have MS Word list styles */
    private addListClass(clipboardDataElement: HTMLElement): void {
        const allElements: NodeListOf<Element> = clipboardDataElement.querySelectorAll('*');
        for (let i: number = 0; i < allElements.length; i++) {
            const currentElement: Element = allElements[i as number];
            const elementStyle: string = currentElement.getAttribute('style');
            if (isNOU(elementStyle)) {
                continue;
            }
            // Remove all spaces and the first newline character from the elementStyle string
            const normalizedStyle: string = elementStyle.replace(/ /g, '').replace('\n', '');
            const hasMsoListStyle: boolean = normalizedStyle.indexOf('mso-list:l') >= 0;
            const hasNoMsoListClass: boolean = currentElement.className.toLowerCase().indexOf('msolistparagraph') === -1;
            const isNotHeading: boolean = currentElement.tagName.charAt(0) !== 'H';
            const isNotListElement: boolean = currentElement.tagName !== 'LI' &&
                currentElement.tagName !== 'OL' && currentElement.tagName !== 'UL';
            if (hasMsoListStyle && hasNoMsoListClass && isNotHeading && isNotListElement) {
                currentElement.classList.add('msolistparagraph');
            }
        }
    }

    /* Adds 'e-rte-table-border' class to tables that have border styles */
    private addTableBorderClass(containerElement: HTMLElement): void {
        const tableElements: NodeListOf<HTMLElement> = containerElement.querySelectorAll('table');
        let hasBorderStyle: boolean = false;
        for (let i: number = 0; i < tableElements.length; i++) {
            for (let j: number = 0; j < this.borderStyle.length; j++) {
                if (tableElements[i as number].innerHTML.indexOf(this.borderStyle[j as number]) >= 0) {
                    hasBorderStyle = true;
                    break;
                }
            }
            if (hasBorderStyle) {
                tableElements[i as number].classList.add('e-rte-table-border');
                hasBorderStyle = false;  // Reset for the next table
            }
        }
    }

    /* Converts images from MS Word to appropriate formats */
    private imageConversion(clipboardDataElement: HTMLElement, rtfData: string): void {
        this.checkVShape(clipboardDataElement);
        // First pass: Mark unsupported images and remove v:shapes attribute
        let imageElements: NodeListOf<HTMLImageElement> = clipboardDataElement.querySelectorAll('img');
        this.markUnsupportedImages(imageElements);
        // Second pass: Process supported images
        imageElements = clipboardDataElement.querySelectorAll('img');
        if (imageElements.length === 0) {
            return;
        }
        const imageSources: string[] = [];
        const base64Sources: { [key: string]: string | boolean }[] = [];
        const imageNames: string[] = [];
        // Extract image sources and names
        this.extractImageInfo(imageElements, imageSources, imageNames);
        // Convert hex data to base64
        const hexValues: { [key: string]: string | boolean | number }[] = this.hexConversion(rtfData);
        this.processHexValues(hexValues, base64Sources);
        // Update image sources
        this.updateImageSources(clipboardDataElement, imageSources, base64Sources, imageNames);
        // Clean up unsupported images
        this.cleanUnsupportedImages(clipboardDataElement);
    }

    /* Marks unsupported images and removes v:shapes attribute */
    private markUnsupportedImages(imageElements: NodeListOf<HTMLImageElement>): void {
        for (let i: number = 0; i < imageElements.length; i++) {
            const currentImage: HTMLImageElement = imageElements[i as number];
            const shapesAttribute: string = currentImage.getAttribute('v:shapes');
            if (!isNOU(shapesAttribute)) {
                const isUnsupported: boolean = this.isUnsupportedImageShape(shapesAttribute);
                if (isUnsupported) {
                    currentImage.classList.add('e-rte-image-unsupported');
                }
                currentImage.removeAttribute('v:shapes');
            }
        }
    }

    /* Determines if an image shape is unsupported */
    private isUnsupportedImageShape(shapesValue: string): boolean {
        const supportedShapes: string[] = [
            'Picture', 'Chart', '圖片', 'Grafik', 'image', 'Graphic',
            '_x0000_s', '_x0000_i', 'img1', 'Immagine'
        ];
        for (let i: number = 0; i < supportedShapes.length; i++) {
            const shape: string = supportedShapes[i as number];
            if (shape === 'image') {
                if (shapesValue.toLowerCase().indexOf(shape) >= 0) {
                    return false;
                }
            } else if (shapesValue.indexOf(shape) >= 0) {
                return false;
            }
        }
        return true;
    }

    /* Extracts image information from image elements */
    private extractImageInfo(imageElements: NodeListOf<HTMLImageElement>, imageSources: string[], imageNames: string[]): void {
        for (let i: number = 0; i < imageElements.length; i++) {
            const currentImage: HTMLImageElement = imageElements[i as number];
            if (!currentImage.classList.contains('e-rte-image-unsupported')) {
                const src: string = currentImage.getAttribute('src');
                imageSources.push(src);
                const srcParts: string[] = src.split('/');
                const lastPart: string = srcParts[srcParts.length - 1];
                const imageName: string = lastPart.split('.')[0] + i;
                imageNames.push(imageName);
            }
        }
    }

    /* Processes hex values and converts them to base64 */
    private processHexValues(
        hexValues: { [key: string]: string | boolean | number }[],
        base64Sources: { [key: string]: string | boolean }[]
    ): void {
        for (let i: number = 0; i < hexValues.length; i++) {
            const currentHex: { [key: string]: string | boolean | number } = hexValues[i as number];
            base64Sources.push({
                base64Data: !isNOU(currentHex.hex) ? this.convertToBase64(currentHex) as string : null,
                isCroppedImage: currentHex.isCroppedImage as boolean
            });
            if (currentHex.isCroppedImage) {
                this.cropImageDimensions.push({
                    goalWidth: (currentHex.goalWidth as number),
                    goalHeight: (currentHex.goalHeight as number),
                    cropLength: (currentHex.cropLength as number),
                    cropTop: (currentHex.cropTop as number),
                    cropR: (currentHex.cropR as number),
                    cropB: (currentHex.cropB as number)
                });
            }
        }
    }

    /* Updates image sources with base64 data or marks as unsupported */
    private updateImageSources(
        clipboardDataElement: HTMLElement,
        imageSources: string[],
        base64Sources: { [key: string]: string | boolean }[],
        imageNames: string[]
    ): void {
        // 1. http://, https://
        // 2. www.
        // 3. blob:
        // 4. data:image/...;base64,...
        // eslint-disable-next-line
        const linkRegex: RegExp = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.)|(blob\:))|(data:image\/[a-zA-Z]+;base64,[\w+/=]+)(\S+))/gi);
        const imageElements: NodeListOf<HTMLImageElement> = clipboardDataElement.querySelectorAll('img:not(.e-rte-image-unsupported)');
        for (let i: number = 0; i < imageElements.length; i++) {
            const currentImage: HTMLImageElement = imageElements[i as number];
            const currentSource: string = imageSources[i as number];
            if (currentSource.match(linkRegex)) {
                currentImage.setAttribute('src', currentSource);
            } else {
                const currentBase64: { [key: string]: string | boolean } = base64Sources[i as number];
                if (!isNOU(currentBase64) && !isNOU(currentBase64.base64Data)) {
                    currentImage.setAttribute('src', currentBase64.base64Data as string);
                } else {
                    currentImage.removeAttribute('src');
                    currentImage.classList.add('e-rte-image-unsupported');
                }
                if (!isNOU(currentBase64) && currentBase64.isCroppedImage as boolean) {
                    currentImage.classList.add('e-img-cropped');
                }
            }
            currentImage.setAttribute('id', 'msWordImg-' + imageNames[i as number]);
        }
    }

    /* Removes src attribute from unsupported images */
    private cleanUnsupportedImages(clipboardDataElement: HTMLElement): void {
        const unsupportedImages: NodeListOf<HTMLImageElement> = clipboardDataElement.querySelectorAll('.e-rte-image-unsupported');
        for (let i: number = 0; i < unsupportedImages.length; i++) {
            unsupportedImages[i as number].removeAttribute('src');
        }
    }

    /* Processes V:SHAPE elements and converts them to standard image elements */
    private checkVShape(clipboardDataElement: HTMLElement): void {
        const allElements: NodeListOf<Element> = clipboardDataElement.querySelectorAll('*');
        for (let i: number = 0; i < allElements.length; i++) {
            const currentElement: Element = allElements[i as number];
            const elementNodeName: string = currentElement.nodeName;
            switch (elementNodeName) {
            case 'V:SHAPETYPE':
                detach(currentElement);
                break;
            case 'V:SHAPE':
                this.processVShapeElement(currentElement);
                break;
            }
        }
    }

    /* Processes a V:SHAPE element and converts it to a standard image if it contains image data */
    private processVShapeElement(shapeElement: Element): void {
        const firstChild: Element = shapeElement.firstElementChild;
        if (firstChild && firstChild.nodeName === 'V:IMAGEDATA') {
            const imageSrc: string = (firstChild as HTMLElement).getAttribute('src');
            const imageElement: HTMLElement = createElement('img') as HTMLElement;
            imageElement.setAttribute('src', imageSrc);
            // Insert the new image before the V:SHAPE element
            shapeElement.parentElement.insertBefore(imageElement, shapeElement);
            // Remove the original V:SHAPE element
            detach(shapeElement);
        }
    }

    /* Converts hex value to base64 string */
    private convertToBase64(hexValue: { [key: string]: string | boolean | number }): string {
        const byteArr: number[] = this.conHexStringToBytes(hexValue.hex as string);
        const base64String: string = this.conBytesToBase64(byteArr);
        const mimeType: string = hexValue.type as string;
        const dataUri: string = mimeType ? 'data:' + mimeType + ';base64,' + base64String : null;
        return dataUri;
    }

    /* Converts byte array to base64 string */
    private conBytesToBase64(byteArray: number[]): string {
        let base64String: string = '';
        const base64Chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const byteArrayLength: number = byteArray.length;
        // Process bytes in groups of 3
        for (let i: number = 0; i < byteArrayLength; i += 3) {
            // Get a slice of 3 bytes (or fewer at the end)
            const threeBytes: number[] = byteArray.slice(i, i + 3);
            const threeBytesLength: number = threeBytes.length;
            const fourChars: number[] = [];
            // Pad the array if needed
            if (threeBytesLength < 3) {
                for (let j: number = threeBytesLength; j < 3; j++) {
                    threeBytes[j as number] = 0;
                }
            }
            // Convert 3 bytes (24 bits) into 4 base64 characters (6 bits each)
            fourChars[0] = (threeBytes[0] & 0xFC) >> 2;
            fourChars[1] = ((threeBytes[0] & 0x03) << 4) | (threeBytes[1] >> 4);
            fourChars[2] = ((threeBytes[1] & 0x0F) << 2) | ((threeBytes[2] & 0xC0) >> 6);
            fourChars[3] = threeBytes[2] & 0x3F;
            // Convert indices to base64 characters
            for (let j: number = 0; j < 4; j++) {
                // Add padding '=' for incomplete byte groups
                if (j <= threeBytesLength) {
                    base64String += base64Chars.charAt(fourChars[j as number]);
                } else {
                    base64String += '=';
                }
            }
        }
        return base64String;
    }

    /* Converts a hexadecimal string to an array of bytes */
    private conHexStringToBytes(hexString: string): number[] {
        const byteArray: number[] = [];
        const byteCount: number = hexString.length / 2;
        for (let i: number = 0; i < byteCount; i++) {
            const hexByte: string = hexString.substr(i * 2, 2);
            const byte: number = parseInt(hexByte, 16);
            byteArray.push(byte);
        }
        return byteArray;
    }

    /* Converts RTF data to hex values for image processing */
    private hexConversion(rtfData: string): { [key: string]: string | boolean | number }[] {
        const regExp: RegExpConstructor = RegExp;
        const pictureHeaderPattern: RegExp = new regExp('\\{\\\\pict[\\s\\S]+?\\\\bliptag-?\\d+(\\\\blipupi-?\\d+)?(\\{\\\\\\*\\\\blipuid\\s?[\\da-fA-F]+)?[\\s\\}]*?');
        const picturePattern: RegExp = new regExp('(?:(' + pictureHeaderPattern.source + '))([\\da-fA-F\\s]+)\\}', 'g');
        const matchedImages: RegExpMatchArray = rtfData.match(picturePattern);
        const result: { [key: string]: string | boolean | number }[] = [];
        if (isNOU(matchedImages)) {
            return result;
        }
        for (let i: number = 0; i < matchedImages.length; i++) {
            const currentImage: string = matchedImages[i as number];
            // Skip bullet images
            if (currentImage.indexOf('fIsBullet') !== -1 && currentImage.indexOf('wzName') === -1) {
                continue;
            }
            if (!pictureHeaderPattern.test(currentImage)) {
                continue;
            }
            const imageData: { [key: string]: string | boolean | number } = this.extractImageData(currentImage, pictureHeaderPattern);
            if (imageData) {
                result.push(imageData);
            }
        }
        return result;
    }

    /* Extracts image data from RTF picture content */
    private extractImageData(imageContent: string, pictureHeaderPattern: RegExp): { [key: string]: string | boolean | number } {
        let imageType: string = null;
        // Determine image type
        if (imageContent.indexOf('\\pngblip') !== -1) {
            imageType = 'image/png';
        } else if (imageContent.indexOf('\\jpegblip') !== -1) {
            imageType = 'image/jpeg';
        } else if (imageContent.indexOf('\\emfblip') !== -1) {
            imageType = null;
        } else {
            return null;
        }
        // Check if image is cropped
        const isCroppedImage: boolean = this.isImageCropped(imageContent);
        const cropData: { [key: string]: number } = {
            goalWidth: 0,
            goalHeight: 0,
            cropLength: 0,
            cropTop: 0,
            cropR: 0,
            cropB: 0
        };
        if (isCroppedImage) {
            cropData.goalWidth = this.extractCropValue('wgoal', imageContent);
            cropData.goalHeight = this.extractCropValue('hgoal', imageContent);
            cropData.cropLength = this.extractCropValue('cropl', imageContent);
            cropData.cropTop = this.extractCropValue('cropt', imageContent);
            cropData.cropR = this.extractCropValue('cropr', imageContent);
            cropData.cropB = this.extractCropValue('cropb', imageContent);
        }
        return {
            hex: imageType ? imageContent.replace(pictureHeaderPattern, '').replace(/[^\da-fA-F]/g, '') : null,
            type: imageType,
            isCroppedImage: isCroppedImage,
            goalWidth: cropData.goalWidth,
            goalHeight: cropData.goalHeight,
            cropLength: cropData.cropLength,
            cropTop: cropData.cropTop,
            cropR: cropData.cropR,
            cropB: cropData.cropB
        };
    }

    /* Determines if an image is cropped based on crop values */
    private isImageCropped(rtfData: string): boolean {
        const hasLeftTopCrop: boolean = this.extractCropValue('cropl', rtfData) > 0 &&
            this.extractCropValue('cropt', rtfData) > 0;
        const hasRightCrop: boolean = this.extractCropValue('cropr', rtfData) > 0;
        const hasBottomCrop: boolean = this.extractCropValue('cropb', rtfData) > 0;
        return hasLeftTopCrop || hasRightCrop || hasBottomCrop;
    }

    /* Extracts crop value from RTF data for a specific crop property */
    private extractCropValue(cropProperty: string, rtfData: string): number {
        // Normalize RTF data by handling line breaks
        const normalizedRtfData: string = rtfData
            .replace(/\r\n\\/g, '\\')
            .replace(/\n/g, '\\');
        const regExp: RegExpConstructor = RegExp;
        const cropPattern: RegExp = new regExp('\\\\pic' + cropProperty + '(\\-?\\d+)\\\\');
        // Execute the pattern against the normalized RTF data
        const matchResult: RegExpExecArray = cropPattern.exec(normalizedRtfData);
        // Return 0 if no match found or match doesn't have the expected format
        if (!matchResult || matchResult.length < 2) {
            return 0;
        }
        return parseInt(matchResult[1], 10);
    }

    /* Removes class attributes from elements except for specific classes */
    private removeClassName(clipboardDataElement: HTMLElement): void {
        const elementsWithClass: NodeListOf<Element> = clipboardDataElement.querySelectorAll(
            '*[class]:not(.e-img-cropped):not(.e-rte-image-unsupported)'
        );
        for (let i: number = 0; i < elementsWithClass.length; i++) {
            elementsWithClass[i as number].removeAttribute('class');
        }
    }
    /* Adds line breaks in place of empty elements with &nbsp; */
    private breakLineAddition(clipboardDataElement: HTMLElement): void {
        const allElements: NodeListOf<Element> = clipboardDataElement.querySelectorAll('*');
        for (let i: number = 0; i < allElements.length; i++) {
            const currentElement: Element = allElements[i as number];
            if (this.isReplacableWithBreak(currentElement)) {
                const detachableElement: HTMLElement = this.findDetachElem(currentElement);
                const brElement: HTMLElement = createElement('br') as HTMLElement;
                const hasNbsp: boolean = this.hasNonBreakingSpace(detachableElement);
                if (!hasNbsp && !isNOU(detachableElement.parentElement)) {
                    detachableElement.parentElement.insertBefore(brElement, detachableElement);
                    detach(detachableElement);
                }
            }
        }
    }

    /* Determines if an element should be replaced with a line break */
    private isReplacableWithBreak(element: Element): boolean {
        const hasNoChildren: boolean = element.children.length === 0;
        const hasNbspContent: boolean = element.innerHTML === '&nbsp;';
        const isNotInListItem: boolean = !element.closest('li');
        const isNotInTableCell: boolean = !element.closest('td');
        const isNotSpan: boolean = element.nodeName !== 'SPAN';
        const isIsolatedSpan: boolean = element.nodeName === 'SPAN' &&
            isNOU(element.previousElementSibling) && isNOU(element.nextElementSibling);
        return hasNoChildren && hasNbspContent && isNotInListItem &&
            isNotInTableCell && (isNotSpan || isIsolatedSpan);
    }

    /* Checks if an element contains non-breaking space characters */
    private hasNonBreakingSpace(element: HTMLElement): boolean {
        const hasText: boolean = element.textContent.length > 0;
        const nbspMatches: RegExpMatchArray = element.textContent.match(/\u00a0/g);
        const hasNbspMatches: boolean = nbspMatches !== null && nbspMatches.length > 0;
        return hasText && hasNbspMatches;
    }

    /* Finds the topmost empty parent element that should be removed */
    private findDetachElem(element: Element): HTMLElement {
        const parent: Element = element.parentElement;
        if (isNOU(parent)) {
            return element as HTMLElement;
        }
        const isEmptyParent: boolean = parent.textContent.trim() === '';
        const isNotTableCell: boolean = parent.tagName !== 'TD' && parent.tagName !== 'TH';
        const hasNoImages: boolean = isNOU(parent.querySelector('img'));
        if (isEmptyParent && isNotTableCell && hasNoImages) {
            return this.findDetachElem(parent);
        }
        return element as HTMLElement;
    }

    /* Removes unwanted elements from the HTML content */
    private removeUnwantedElements(clipboardDataElement: HTMLElement): void {
        // Remove style elements
        this.removeStyleElements(clipboardDataElement);
        // Remove elements by tag name using regex
        this.removeElementsByTagName(clipboardDataElement);
    }

    /* Removes style elements from the container */
    private removeStyleElements(clipboardDataElement: HTMLElement): void {
        const styleElement: HTMLElement = clipboardDataElement.querySelector('style');
        if (!isNOU(styleElement)) {
            detach(styleElement);
        }
    }

    /* Removes elements by tag name using regex */
    private removeElementsByTagName(clipboardDataElement: HTMLElement): void {
        let htmlContent: string = clipboardDataElement.innerHTML;
        const regExpConstructor: RegExpConstructor = RegExp;
        for (let i: number = 0; i < this.removableElements.length; i++) {
            const tagName: string = this.removableElements[i as number];
            const startTagPattern: RegExp = new regExpConstructor('<' + tagName + '\\s*[^>]*>', 'g');
            const endTagPattern: RegExp = new regExpConstructor('</' + tagName + '>', 'g');
            htmlContent = htmlContent.replace(startTagPattern, '');
            htmlContent = htmlContent.replace(endTagPattern, '');
        }
        clipboardDataElement.innerHTML = htmlContent;
        clipboardDataElement.querySelectorAll(':empty');
    }

    /* Finds the topmost empty parent element that should be removed */
    private findDetachEmptyElem(element: Element): HTMLElement {
        if (isNOU(element.parentElement)) {
            return null;
        }
        const parentElement: Element = element.parentElement;
        // Check if parent has non-breaking spaces
        const hasNbsp: boolean = this.hasNonBreakingSpace(parentElement as HTMLElement);
        // Check if parent is empty and not a special element
        const isEmptyParent: boolean = !hasNbsp && parentElement.textContent.trim() === '';
        const isNotMsWordContent: boolean = parentElement.getAttribute('id') !== 'MSWord-Content';
        const isNotMsoListParagraph: boolean = !this.hasParentWithClass(element as HTMLElement, 'MsoListParagraph');
        const hasNoImages: boolean = isNOU(parentElement.querySelector('img'));
        if (isEmptyParent && isNotMsWordContent && isNotMsoListParagraph && hasNoImages) {
            return this.findDetachEmptyElem(parentElement);
        }
        return element as HTMLElement;
    }

    /* Checks if an element has a parent with the specified class */
    private hasParentWithClass(element: HTMLElement, className: string): boolean {
        let currentParentElem: HTMLElement = element.parentElement;
        while (!isNOU(currentParentElem)) {
            if (currentParentElem.classList.contains(className)) {
                return true;
            }
            currentParentElem = currentParentElem.parentElement;
        }
        return false;
    }

    /* Removes empty elements from the HTML content */
    private removeEmptyElements(containerElement: HTMLElement): void {
        const emptyElements: NodeListOf<Element> = containerElement.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            const currentElement: Element = emptyElements[i as number];
            // Handle empty cells with MsoNormal class
            if (this.isEmptyCellWithMsoNormal(currentElement)) {
                currentElement.innerHTML = '-';
            }
            // Check if div has border
            const isDivWithoutBorder: boolean = this.isDivWithoutBorder(currentElement);
            // Skip certain elements that should remain empty
            if (this.shouldRemoveEmptyElement(currentElement, isDivWithoutBorder)) {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(currentElement);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    }

    /* Checks if an element is an empty cell with MsoNormal class */
    private isEmptyCellWithMsoNormal(element: Element): boolean {
        const parentCell: Element = element.closest('td');
        return !isNOU(parentCell) && !isNOU(parentCell.querySelector('.MsoNormal'));
    }

    /* Checks if a div element has no border */
    private isDivWithoutBorder(element: Element): boolean {
        if (element.tagName !== 'DIV') {
            return true;
        }
        const borderBottom: string = (element as HTMLElement).style.borderBottom;
        return borderBottom === 'none' || borderBottom === '';
    }

    /* Determines if an empty element should be removed */
    private shouldRemoveEmptyElement(element: Element, isDivWithoutBorder: boolean): boolean {
        const preservedTags: string[] = ['IMG', 'BR', 'IFRAME', 'TD', 'TH', 'HR'];
        return preservedTags.indexOf(element.tagName) === -1 && isDivWithoutBorder;
    }

    /* Removes empty meta tags from the HTML content */
    private removeEmptyMetaTags(clipboardDataElement: HTMLElement): void {
        const emptyMetaTags: NodeListOf<HTMLMetaElement> = clipboardDataElement.querySelectorAll('meta:empty');
        // Process in reverse order to avoid index issues when removing elements
        for (let i: number = emptyMetaTags.length - 1; i >= 0; i--) {
            const metaTag: Element = emptyMetaTags[i as number] as Element;
            if (metaTag.textContent === '') {
                detach(metaTag);
            }
        }
    }

    /* Corrects styles in the HTML content based on Word paste style configuration */
    private styleCorrection(clipboardDataElement: HTMLElement, allowedStyleProperties: string[]): void {
        const styleElements: NodeListOf<HTMLStyleElement> = clipboardDataElement.querySelectorAll('style');
        let styleRules: string[] = [];
        if (styleElements.length === 0) {
            return;
        }
        // Extract style rules from the first or second style element
        const styleRulePattern: RegExp = /[\S ]+\s+{[\s\S]+?}/gi;
        if (!isNOU(styleElements[0].innerHTML.match(styleRulePattern))) {
            styleRules = styleElements[0].innerHTML.match(styleRulePattern);
        } else if (styleElements.length > 1) {
            styleRules = styleElements[1].innerHTML.match(styleRulePattern);
        }
        // Convert style rules to a structured object
        const styleClassObject: { [key: string]: string } = !isNOU(styleRules) ? this.findStyleObject(styleRules) : null;
        if (isNOU(styleClassObject)) {
            return;
        }
        // Process style rules
        const selectors: string[] = this.sortSelectors(Object.keys(styleClassObject));
        let styleValues: string[] = selectors.map((selector: string) => {
            return styleClassObject[`${selector}`];
        });
        // Remove unwanted styles and filter existing styles
        styleValues = this.removeUnwantedStyle(styleValues, allowedStyleProperties);
        this.filterStyles(clipboardDataElement, allowedStyleProperties);
        // Apply styles to matching elements
        this.applyStylesToElements(clipboardDataElement, selectors, styleValues);
        // Process list-specific styles
        this.processListStyles(clipboardDataElement, selectors, styleValues);
    }

    // Sorts CSS selectors to ensure a specific application order: classes and then other elements.
    private sortSelectors(selectors: string[]): string[] {
        return selectors.sort((a: string, b: string) =>
            (a.trim().startsWith('.') ? 0 : 1) - (b.trim().startsWith('.') ? 0 : 1)
        );
    }

    /* Filters inline styles to keep only allowed style properties */
    private filterStyles(clipboardDataElement: HTMLElement, allowedStyleProperties: string[]): void {
        const elementsWithStyle: NodeListOf<Element> = clipboardDataElement.querySelectorAll('*[style]');
        for (let i: number = 0; i < elementsWithStyle.length; i++) {
            const currentElement: Element = elementsWithStyle[i as number];
            const styleDeclarations: string[] = currentElement.getAttribute('style').split(';');
            let filteredStyle: string = '';
            // Process each style declaration
            for (let j: number = 0; j < styleDeclarations.length; j++) {
                const declaration: string = styleDeclarations[j as number];
                const propertyName: string = declaration.split(':')[0].trim();
                // Keep only allowed style properties
                if (allowedStyleProperties.indexOf(propertyName) >= 0) {
                    filteredStyle += declaration + ';';
                }
            }
            // Apply filtered styles back to the element
            (currentElement as HTMLElement).style.cssText = filteredStyle;
        }
    }


    /* Applies styles to elements matching the selectors */
    private applyStylesToElements(clipboardDataElement: HTMLElement, selectors: string[], styleValues: string[]): void {
        let matchedElements: HTMLCollectionOf<Element> | NodeListOf<Element>;
        let isClassSelector: boolean = false;
        const specialSelectorPattern: RegExp = /^(p|div|li)\.(1|10|11)$/;
        for (let i: number = 0; i < selectors.length; i++) {
            const currentSelector: string = selectors[i as number];
            const selectorParts: string[] = currentSelector.split('.');
            const baseSelector: string = selectorParts[0];
            // Determine how to select elements based on the selector format
            if (baseSelector === '') {
                // Class selector (className)
                const className: string = selectorParts[1];
                matchedElements = clipboardDataElement.getElementsByClassName(className);
                isClassSelector = true;
            } else if ((selectorParts.length === 1 && baseSelector.indexOf('@') >= 0) ||
                (specialSelectorPattern.test(currentSelector))) {
                // Skip special selectors
                continue;
            } else if (selectorParts.length === 1 && baseSelector.indexOf('@') < 0) {
                // Tag selector (tagName)
                matchedElements = clipboardDataElement.getElementsByTagName(baseSelector);
            } else {
                // Complex selector (tag.class, etc.)
                matchedElements = clipboardDataElement.querySelectorAll(currentSelector);
            }
            // Apply styles to each matching element
            this.applyStyleToElementCollection(
                matchedElements, currentSelector,
                styleValues[i as number], isClassSelector
            );
            isClassSelector = false;
        }
    }

    /* Applies styles to a collection of elements */
    private applyStyleToElementCollection(
        elements: HTMLCollectionOf<Element> | NodeListOf<Element>,
        selector: string,  styleValue: string, isClassSelector: boolean
    ): void {
        for (let j: number = 0; j < elements.length; j++) {
            const currentElement: Element = elements[j as number];
            // Skip paragraph elements inside list items
            if (currentElement.closest('li') && selector === 'p') {
                continue;
            }
            const existingStyle: string = currentElement.getAttribute('style');
            const hasExistingStyle: boolean = !isNOU(existingStyle) && existingStyle.trim() !== '';
            if (hasExistingStyle) {
                // Process existing style
                const styleDeclarations: string[] = styleValue.split(';');
                this.removeBorderNoneStyles(styleDeclarations);
                if (!isClassSelector) {
                    this.removeOverlappingStyles(styleDeclarations, existingStyle);
                }
                const combinedStyle: string = styleDeclarations.join(';') + ';' + existingStyle;
                (currentElement as HTMLElement).style.cssText = combinedStyle;
            } else {
                // Apply clean style
                styleValue = styleValue
                    .replace(/text-indent:-.*?;?/g, '') // Remove 'text-indent'
                    .replace(/border:\s*none;?/g, '') // Remove 'border:none'
                    .trim();
                (currentElement as HTMLElement).style.cssText = styleValue;
            }
        }
    }

    /* Removes 'border: none' styles from the style array */
    private removeBorderNoneStyles(styleDeclarations: string[]): void {
        for (let i: number = 0; i < styleDeclarations.length; i++) {
            const declarationParts: string[] = styleDeclarations[i as number].split(':');
            if (declarationParts[0] === 'border' && declarationParts[1] === 'none') {
                styleDeclarations.splice(i, 1);
                i--;
            }
        }
    }

    /* Removes styles that would overlap with existing inline styles */
    private removeOverlappingStyles(styleDeclarations: string[], existingStyle: string): void {
        for (let i: number = 0; i < styleDeclarations.length; i++) {
            const propertyName: string = styleDeclarations[i as number].split(':')[0];
            if (existingStyle.indexOf(propertyName + ':') >= 0) {
                styleDeclarations.splice(i, 1);
                i--;
            }
        }
    }

    /* Processes list-specific styles */
    private processListStyles(containerElement: HTMLElement, selectors: string[], styleValues: string[]): void {
        const listClasses: string[] = [
            'MsoListParagraphCxSpFirst',
            'MsoListParagraphCxSpMiddle',
            'MsoListParagraphCxSpLast'
        ];
        for (let i: number = 0; i < listClasses.length; i++) {
            const listClassName: string = listClasses[i as number];
            const listSelector: string = 'li.' + listClassName;
            const selectorIndex: number = selectors.indexOf(listSelector);
            if (selectorIndex > -1) {
                const listElements: NodeListOf<Element> = containerElement.querySelectorAll(
                    'ol.' + listClassName + ', ul.' + listClassName
                );
                this.adjustListMargins(listElements, styleValues[selectorIndex as number]);
            }
        }
    }

    /* Adjusts margins for list elements */
    private adjustListMargins(listElements: NodeListOf<Element>, styleValue: string): void {
        for (let j: number = 0; j < listElements.length; j++) {
            const listElement: HTMLElement = listElements[j as number] as HTMLElement;
            const existingStyle: string = listElement.getAttribute('style');
            const hasValidStyle: boolean = !isNOU(existingStyle) &&
                existingStyle.trim() !== '' && listElement.style.marginLeft !== '';
            if (hasValidStyle) {
                const styleDeclarations: string[] = styleValue.split(';');
                for (let k: number = 0; k < styleDeclarations.length; k++) {
                    const declaration: string = styleDeclarations[k as number];
                    const propertyName: string = declaration.split(':')[0];
                    if ('margin-left'.indexOf(propertyName) >= 0) {
                        this.adjustMarginLeftValue(listElement, declaration);
                    }
                }
            }
        }
    }

    /* Adjusts the margin-left value for a list element */
    private adjustMarginLeftValue(element: HTMLElement, marginDeclaration: string): void {
        const declarationParts: string[] = marginDeclaration.split(':');
        const marginValue: string = declarationParts[1];
        const elementMargin: string = element.style.marginLeft;
        const hasInchUnits: boolean = !isNOU(marginValue) &&
            marginValue.indexOf('in') >= 0 && elementMargin.indexOf('in') >= 0;
        if (hasInchUnits) {
            const classStyleValue: number = parseFloat(marginValue.split('in')[0]);
            const inlineStyleValue: number = parseFloat(elementMargin.split('in')[0]);
            element.style.marginLeft = (inlineStyleValue - classStyleValue) + 'in';
        }
    }

    /* Filters style values to keep only allowed style properties */
    private removeUnwantedStyle(styleValues: string[], allowedStyleProperties: string[]): string[] {
        const filteredValues: string[] = [];
        for (let i: number = 0; i < styleValues.length; i++) {
            const styleDeclarations: string[] =  styleValues[i as number].split(';');
            let filteredDeclarations: string = '';
            for (let j: number = 0; j < styleDeclarations.length; j++) {
                const declaration: string = styleDeclarations[j as number];
                const propertyName: string = declaration.split(':')[0];
                // Keep only allowed style properties
                if (allowedStyleProperties.indexOf(propertyName) >= 0) {
                    filteredDeclarations += declaration + ';';
                }
            }
            filteredValues[i as number] = filteredDeclarations;
        }
        return filteredValues;
    }

    /* Converts CSS rule strings into a structured object mapping selectors to style declarations */
    private findStyleObject(styleRules: string[]): { [key: string]: string } {
        const styleClassObject: { [key: string]: string } = {};
        for (let i: number = 0; i < styleRules.length; i++) {
            const currentRule: string = styleRules[i as number];
            // Extract selector and style parts from the rule
            let selectorText: string = currentRule.replace(/([\S ]+\s+){[\s\S]+?}/gi, '$1');
            let styleText: string = currentRule.replace(/[\S ]+\s+{([\s\S]+?)}/gi, '$1');
            // Clean up whitespace and line breaks
            selectorText = this.cleanupStyleText(selectorText);
            styleText = this.cleanupStyleText(styleText);
            // Map each selector to the style declarations
            const selectors: string[] = selectorText.split(', ');
            for (let j: number = 0; j < selectors.length; j++) {
                styleClassObject[selectors[j as number]] = styleText;
            }
        }
        return styleClassObject;
    }

    /* Cleans up style text by removing whitespace and line breaks */
    private cleanupStyleText(text: string): string {
        let cleanedText: string = text;
        // Remove leading and trailing whitespace
        cleanedText = cleanedText.replace(/^[\s]|[\s]$/gm, '');
        // Remove line breaks
        cleanedText = cleanedText.replace(/\n|\r|\n\r/g, '');
        return cleanedText;
    }

    /* Removes HTML comments from an element */
    private removingComments(clipboardDataElement: HTMLElement): void {
        const htmlContent: string = clipboardDataElement.innerHTML;
        const commentPattern: RegExp = /<!--[\s\S]*?-->/g;
        const cleanedContent: string = htmlContent.replace(commentPattern, '');
        clipboardDataElement.innerHTML = cleanedContent;
    }

    /* Cleans up HTML content and identifies list nodes for conversion */
    private listCleanUp(containerElement: HTMLElement, listNodes: Element[]): Element[] {
        const nodesToRemove: Element[] = [];
        let previousWasMsoList: boolean = false;
        const allElements: NodeListOf<Element> = containerElement.querySelectorAll('*');
        for (let i: number = 0; i < allElements.length; i++) {
            const currentElement: Element = allElements[i as number];
            // Check if element should be ignored
            if (this.shouldIgnoreElement(currentElement)) {
                nodesToRemove.push(currentElement);
                continue;
            }
            // Check if element is an MS Word list paragraph
            if (this.isMsoListParagraph(currentElement)) {
                // Add a null separator for new list if needed
                if (this.isFirstListItem(currentElement) && listNodes.length > 0 &&
                    listNodes[listNodes.length - 1] !== null) {
                    listNodes.push(null);
                }
                // Add the list node
                listNodes.push(currentElement);
            }
            // Add a null separator when transitioning from list to non-list block
            if (this.shouldAddListSeparator(previousWasMsoList, currentElement)) {
                listNodes.push(null);
            }

            // Update previous state flag for next iteration
            if (this.isBlockElement(currentElement)) {
                previousWasMsoList = this.isMsoListParagraph(currentElement);
            }
        }
        // Add a final null separator if needed
        if (listNodes.length > 0 && listNodes[listNodes.length - 1] !== null) {
            listNodes.push(null);
        }
        return listNodes;
    }

    /* Determines if an element should be ignored during cleanup */
    private shouldIgnoreElement(element: Element): boolean {
        const isNotInIgnorableList: boolean = this.ignorableNodes.indexOf(element.nodeName) === -1;
        const isEmptyTextNode: boolean = element.nodeType === 3 && element.textContent.trim() === '';
        return isNotInIgnorableList || isEmptyTextNode;
    }

    /* Determines if an element is an MS Word list paragraph */
    private isMsoListParagraph(element: Element): boolean {
        const elementClass: string = element.className;
        const hasClassName: boolean = elementClass && elementClass.toLowerCase().indexOf('msolistparagraph') !== -1;
        const elementStyles: string = element.getAttribute('style');
        const hasMsoListStyle: boolean = !isNOU(elementStyles) && elementStyles.indexOf('mso-list:') >= 0;
        return hasClassName && hasMsoListStyle;
    }

    /* Determines if an element is the first item in a list */
    private isFirstListItem(element: Element): boolean {
        return element.className.indexOf('MsoListParagraphCxSpFirst') >= 0;
    }

    /* Determines if a list separator should be added */
    private shouldAddListSeparator(previousWasMsoList: boolean, currentElement: Element): boolean {
        return previousWasMsoList &&
            this.isBlockElement(currentElement) && !this.isMsoListParagraph(currentElement);
    }

    /* Determines if an element is a block element */
    private isBlockElement(element: Element): boolean {
        return this.blockNode.indexOf(element.nodeName.toLowerCase()) !== -1;
    }

    /**
     * Converts MS Word list nodes to standard HTML lists
     *
     * @param {Element[]} listNodes - Array of list nodes to convert
     * @returns {void} - No return value
     * @private
     */
    private listConverter(listNodes: Element[]): void {
        const convertedLists: { content: HTMLElement; node: Element }[] = [];
        const listCollection: {
            listType: string;
            content: string[];
            nestedLevel: number;
            listFormatOverride: number;
            class: string;
            listStyle: string;
            listStyleTypeName: string;
            start: number;
            styleMarginLeft: string
        }[] = [];
        const currentListStyle: string = '';
        // Process list nodes and build collection
        this.processListNodes(listNodes, convertedLists, listCollection, currentListStyle);
        // Replace original nodes with converted lists
        this.replaceNodesWithLists(listNodes, convertedLists);
    }

    /* Processes list nodes and builds collection of list data */
    private processListNodes(
        listNodes: Element[],
        convertedLists: { content: HTMLElement; node: Element }[],
        listCollection: ListItemProperties[],
        currentListStyle: string
    ): void {
        let listFormatOverride: number;
        for (let i: number = 0; i < listNodes.length; i++) {
            const currentNode: Element = listNodes[i as number];
            // Handle null separator - convert collected items to list
            if (currentNode === null) {
                convertedLists.push({
                    content: this.makeConversion(listCollection),
                    node: listNodes[i - 1]
                });
                listCollection = [];
                continue;
            }
            // Fix outline level in style
            this.fixOutlineLevel(currentNode);
            // Extract list properties
            const nodeStyle: string = currentNode.getAttribute('style') || '';
            const nestingLevel: number = this.extractNestingLevel(nodeStyle);
            listFormatOverride = this.extractListFormatOverride(nodeStyle, listFormatOverride);
            // Process list content
            this.listContents = [];
            this.getListContent(currentNode);
            // Skip if no list content
            if (isNOU(this.listContents[0])) {
                continue;
            }
            // Determine list properties
            const listProperties: {
                type: string;
                styleType: string;
                startAttr?: number;
                marginLeft?: string;
            } = this.determineListProperties(this.listContents[0], i, listNodes, currentNode);
            // Collect content items
            const contentItems: string[] = [];
            for (let j: number = 1; j < this.listContents.length; j++) {
                contentItems.push(this.listContents[j as number]);
            }
            // Get class name and update style
            const className: string = !isNOU(currentNode.className) ? currentNode.className : '';
            currentListStyle = this.updateNodeStyle(currentNode, nodeStyle);
            // Add to collection
            listCollection.push({
                listType: listProperties.type,
                content: contentItems,
                nestedLevel: nestingLevel,
                listFormatOverride: listFormatOverride,
                class: className,
                listStyle: currentListStyle,
                listStyleTypeName: listProperties.styleType,
                start: listProperties.startAttr,
                styleMarginLeft: listProperties.marginLeft
            });
        }
    }

    /* Fixes outline level in style attribute */
    private fixOutlineLevel(node: Element): void {
        const style: string = node.getAttribute('style');
        if (style && style.indexOf('mso-outline-level') !== -1) {
            (node as HTMLElement).style.cssText = style.replace('mso-outline-level', 'mso-outline');
        }
    }

    /* Extracts nesting level from style */
    private extractNestingLevel(style: string): number {
        if (style && style.indexOf('level') !== -1) {
            // eslint-disable-next-line
            return parseInt(style.charAt(style.indexOf('level') + 5), null);
        }
        return 1;
    }

    /* Extracts list format override from style */
    private extractListFormatOverride(style: string, listFormatOverride: number): number {
        if (style && style.indexOf('mso-list:') !== -1) {
            if (style.match(/mso-list:[^;]+;?/)) {
                const normalizedStyle: string = style.replace(new RegExp('\\n', 'g'), '').split(' ').join('');
                const msoListValue: string[] = normalizedStyle.match(/mso-list:[^;]+;?/)[0].split(':l');
                return isNOU(msoListValue) ? null : parseInt(msoListValue[1].split('level')[0], 10);
            } else {
                return null;
            }
        }
        return listFormatOverride;
    }

    /* Determines list properties based on content */
    private determineListProperties(
        listContent: string,
        index: number,
        listNodes: Element[],
        currentNode: Element
    ): { type: string; styleType: string; startAttr?: number; marginLeft?: string } {
        const result: {
            type: string;
            styleType: string;
            startAttr?: number;
            marginLeft?: string
        } = {
            type: listContent.trim().length > 1 ? 'ol' : 'ul',
            styleType: ''
        };
        // Determine list style type
        result.styleType = this.getlistStyleType(listContent, result.type);
        // Determine start attribute for ordered lists
        if (result.type === 'ol' && (index === 0 || listNodes[index - 1] === null)) {
            result.startAttr = this.determineStartAttribute(listContent, result.styleType);
        }
        // Get margin-left if present
        if ((currentNode as HTMLElement).style.marginLeft !== '') {
            result.marginLeft = (currentNode as HTMLElement).style.marginLeft;
        }
        return result;
    }

    /* Determines start attribute for ordered lists */
    private determineStartAttribute(listContent: string, listStyleType: string): number {
        const startString: string = listContent.split('.')[0];
        const standardListTypes: string[] = ['A', 'a', 'I', 'i', 'α', '1', '01', '1-']; // Add '1-' for rare list type
        if (standardListTypes.indexOf(startString) !== -1) {
            return undefined;
        }
        switch (listStyleType) {
        case 'decimal':
        case 'decimal-leading-zero':
            if (!isNaN(parseInt(startString, 10))) {
                return parseInt(startString, 10);
            }
            break;
        case 'upper-alpha':
            return startString.split('.')[0].charCodeAt(0) - 64;
        case 'lower-alpha':
            return startString.split('.')[0].charCodeAt(0) - 96;
        case 'upper-roman':
            return this.upperRomanNumber.indexOf(startString.split('.')[0]) + 1;
        case 'lower-roman':
            return this.lowerRomanNumber.indexOf(startString.split('.')[0]) + 1;
        case 'lower-greek':
            return this.lowerGreekNumber.indexOf(startString.split('.')[0]) + 1;
        default:
            return undefined;
        }
        return undefined;
    }

    /* Updates node style */
    private updateNodeStyle(node: Element, style: string): string {
        if (!isNOU(node.getAttribute('style'))) {
            (node as HTMLElement).style.cssText = style.replace('text-align:start;', '');
            (node as HTMLElement).style.textIndent = '';
            return node.getAttribute('style');
        }
        return '';
    }

    /* Replaces original nodes with converted lists */
    private replaceNodesWithLists(
        listNodes: Element[],
        convertedLists: { content: HTMLElement; node: Element }[]
    ): void {
        let currentNode: Element = listNodes.shift();
        while (currentNode) {
            const elementsToInsert: Element[] = [];
            // Find matching converted list
            for (let i: number = 0; i < convertedLists.length; i++) {
                if (convertedLists[i as number].node === currentNode) {
                    const convertedContent: HTMLElement = convertedLists[i as number].content;
                    // Collect all child nodes
                    for (let j: number = 0; j < convertedContent.childNodes.length; j++) {
                        elementsToInsert.push(convertedContent.childNodes[j as number] as HTMLElement);
                    }
                    // Insert before the original node
                    for (let j: number = 0; j < elementsToInsert.length; j++) {
                        currentNode.parentElement.insertBefore(elementsToInsert[j as number], currentNode);
                    }
                    break;
                }
            }
            // Remove the original node
            currentNode.remove();
            // Get next node
            currentNode = listNodes.shift();
            if (!currentNode) {
                currentNode = listNodes.shift();
            }
        }
    }

    /* Determines the CSS list-style-type based on list content and type */
    private getlistStyleType(listContent: string, listType: string): string {
        // Extract the marker text before any period
        const markerText: string = listContent.split('.')[0];
        if (listType === 'ol') {
            return this.getOrderedListStyleType(markerText);
        } else {
            return this.getUnorderedListStyleType(markerText);
        }
    }

    /* Determines the CSS list-style-type for ordered lists */
    private getOrderedListStyleType(markerText: string): string {
        const charCode: number = markerText.charCodeAt(0);
        // Check for Roman numerals
        if (this.upperRomanNumber.indexOf(markerText) > -1) {
            return 'upper-roman';
        }
        if (this.lowerRomanNumber.indexOf(markerText) > -1) {
            return 'lower-roman';
        }
        // Check for Greek letters
        if (this.lowerGreekNumber.indexOf(markerText) > -1) {
            return 'lower-greek';
        }
        // Check for uppercase letters (A-Z)
        if (charCode > 64 && charCode < 91) {
            return 'upper-alpha';
        }
        // Check for lowercase letters (a-z)
        if (charCode > 96 && charCode < 123) {
            return 'lower-alpha';
        }
        // Check for leading zero numbers (01, 02, etc.)
        const isLeadingZeroNumber: boolean = markerText.length > 1 &&
            markerText[0] === '0' && !isNaN(Number(markerText));
        if (isLeadingZeroNumber) {
            return 'decimal-leading-zero';
        }
        // Default to decimal
        return 'decimal';
    }

    /* Determines the CSS list-style-type for unordered lists */
    private getUnorderedListStyleType(markerText: string): string {
        switch (markerText) {
        case 'o':
            return 'circle';
        case '§':
            return 'square';
        default:
            return 'disc';
        }
    }

    /* Converts a collection of MSWord list items into HTML list elements */
    private makeConversion(collection: ListItemProperties[]): HTMLElement {
        const rootElement: HTMLElement = createElement('div');
        const CURRENT_ITEM_CLASS: string = 'e-current-list-item';
        if (collection.length === 0) {
            return rootElement;
        }
        let currentListElement: HTMLElement;
        let currentNestingLevel: number = 1;
        let currentListItem: HTMLElement;
        let listItemCount: number = 0;
        let currentFormatOverride: number = collection[0].listFormatOverride;
        for (let i: number = 0; i < collection.length; i++) {
            const currentItem: ListItemProperties = collection[i as number];
            const isStandardList: boolean = this.isStandardListType(currentItem.class);
            // Remove tracking class from previous item
            if (currentListItem) {
                currentListItem.classList.remove(CURRENT_ITEM_CLASS);
            }
            // Reset previous list item if list type changes
            if (this.shouldResetListItem(currentListItem, i, collection, isStandardList)) {
                currentListItem = null;
            }
            // Create paragraph element with content
            const paragraphElement: Element = this.createParagraphWithContent(currentItem);
            // Handle different nesting scenarios
            if (this.isNewRootList(currentItem, listItemCount, currentFormatOverride)) {
                // Create new root list
                currentListElement = this.createRootList(rootElement, currentItem, paragraphElement);
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else if (this.isSameLevelList(currentItem, currentNestingLevel, currentFormatOverride)) {
                // Add item to same level list
                currentListElement = this.addToSameLevelList(
                    currentItem, currentListElement, paragraphElement, currentListItem, rootElement
                );
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else if (this.isDeeperNestedList(currentItem, currentNestingLevel)) {
                // Create deeper nested list
                currentListElement = this.createNestedList(
                    currentItem, currentListItem, paragraphElement, isStandardList, rootElement, currentNestingLevel
                );
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else if (this.isTopLevelList(currentItem)) {
                // Create or use existing top-level list
                currentListElement = this.handleTopLevelList(currentItem, rootElement, paragraphElement);
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else {
                // Handle other nesting scenarios
                this.handleOtherNestingScenarios(currentItem, currentListItem, paragraphElement, currentFormatOverride);
                currentListItem = rootElement.querySelector('.' + CURRENT_ITEM_CLASS);
            }
            // Apply styles and attributes to list item
            this.applyListItemStyles(currentListItem, currentItem);
            // Update state for next iteration
            currentNestingLevel = currentItem.nestedLevel;
            currentFormatOverride = currentItem.listFormatOverride;
            listItemCount++;
            // Set start attribute if needed
            this.setStartAttributeIfNeeded(currentListElement, currentItem);
        }
        // Clean up - remove tracking class from any remaining elements
        const trackedItems: NodeListOf<Element> = rootElement.querySelectorAll('.' + CURRENT_ITEM_CLASS);
        for (let i: number = 0; i < trackedItems.length; i++) {
            trackedItems[i as number].classList.remove(CURRENT_ITEM_CLASS);
            if (trackedItems[i as number].className === '') {
                trackedItems[i as number].removeAttribute('class');
            }
        }
        return rootElement;
    }

    /* Checks if the list item is a standard list type */
    private isStandardListType(className: string): boolean {
        const standardListClasses: string[] = [
            'MsoListParagraphCxSpFirst',
            'MsoListParagraphCxSpMiddle',
            'MsoListParagraphCxSpLast'
        ];
        for (let i: number = 0; i < standardListClasses.length; i++) {
            if (!isNOU(className) && standardListClasses[i as number].indexOf(className) >= 0) {
                return true;
            }
        }
        return false;
    }

    /* Determines if the list item should be reset */
    private shouldResetListItem(
        listItem: HTMLElement,
        index: number,
        collection: ListItemProperties[],
        isStandardList: boolean
    ): boolean {
        return !isNOU(listItem) &&
            index !== 0 &&
            collection[index - 1].listType !== collection[index as number].listType &&
            !isStandardList;
    }

    /* Creates a paragraph element with content */
    private createParagraphWithContent(item: ListItemProperties): Element {
        const paragraphElement: Element = createElement('p', { className: 'MsoNoSpacing' });
        paragraphElement.innerHTML = item.content.join(' ');
        return paragraphElement;
    }

    /* Checks if this is a new root list */
    private isNewRootList(item: ListItemProperties, listCount: number, formatOverride: number): boolean {
        return item.nestedLevel === 1 &&
            (listCount === 0 || formatOverride !== item.listFormatOverride) &&
            item.content.length > 0;
    }

    /* Creates a root list element */
    private createRootList(rootElement: HTMLElement, item: ListItemProperties, paragraphElement: Element): HTMLElement {
        const listElement: HTMLElement = createElement(item.listType, { className: item.class });
        const listItem: HTMLElement = createElement('li');
        listItem.appendChild(paragraphElement);
        listElement.appendChild(listItem);
        rootElement.appendChild(listElement);
        listElement.setAttribute('level', item.nestedLevel.toString());
        if (item.class !== 'msolistparagraph') {
            listElement.style.marginLeft = item.styleMarginLeft;
        } else {
            addClass([listElement], 'marginLeftIgnore');
        }
        listElement.style.listStyleType = item.listStyleTypeName;
        listItem.classList.add('e-current-list-item');
        return listElement;
    }

    /* Checks if this is a same level list item */
    private isSameLevelList(item: ListItemProperties, currentLevel: number, formatOverride: number): boolean {
        return item.nestedLevel === currentLevel && formatOverride === item.listFormatOverride;
    }

    /* Adds an item to a same level list */
    private addToSameLevelList(
        item: ListItemProperties,
        listElement: HTMLElement,
        paragraphElement: Element,
        listItem: HTMLElement,
        rootElement: HTMLElement
    ): HTMLElement {
        if (!isNOU(listItem) && !isNOU(listItem.parentElement) &&
            listItem.parentElement.tagName.toLowerCase() === item.listType) {
            // Add to existing list
            const newListItem: HTMLElement = createElement('li');
            newListItem.classList.add('e-current-list-item');
            newListItem.appendChild(paragraphElement);
            listItem.parentElement.appendChild(newListItem);
            return listItem.parentElement;
        } else if (isNOU(listItem)) {
            // Create new list
            const newListElement: HTMLElement = createElement(item.listType);
            newListElement.style.listStyleType = item.listStyleTypeName;
            const newListItem: HTMLElement = createElement('li');
            newListItem.classList.add('e-current-list-item');
            newListItem.appendChild(paragraphElement);
            newListElement.appendChild(newListItem);
            newListElement.setAttribute('level', item.nestedLevel.toString());
            rootElement.appendChild(newListElement);
            return newListElement;
        } else {
            // Create new list at parent level
            const newListElement: HTMLElement = createElement(item.listType);
            newListElement.style.listStyleType = item.listStyleTypeName;
            const newListItem: HTMLElement = createElement('li');
            newListItem.classList.add('e-current-list-item');
            newListItem.appendChild(paragraphElement);
            newListElement.appendChild(newListItem);
            newListElement.setAttribute('level', item.nestedLevel.toString());
            listItem.parentElement.parentElement.appendChild(newListElement);
            return newListElement;
        }
    }

    /* Checks if this is a deeper nested list */
    private isDeeperNestedList(item: ListItemProperties, currentLevel: number): boolean {
        return item.nestedLevel > currentLevel;
    }

    /* Creates a nested list */
    private createNestedList(
        item: ListItemProperties,
        listItem: HTMLElement,
        paragraphElement: Element,
        isStandardList: boolean,
        rootElement: HTMLElement,
        currentNestingLevel: number
    ): HTMLElement {
        let listElement: HTMLElement;
        if (!isNOU(listItem)) {
            // Create nested list inside existing list item
            const levelDifference: number = item.nestedLevel - currentNestingLevel;
            for (let j: number = 0; j < levelDifference; j++) {
                listElement = createElement(item.listType);
                listItem.appendChild(listElement);
                listItem = createElement('li');
                // Set list-style-type: none for intermediate levels
                if (j !== levelDifference - 1 && levelDifference > 1) {
                    listItem.style.listStyleType = 'none';
                }
                listElement.appendChild(listItem);
            }
            listItem.classList.add('e-current-list-item');
            listItem.appendChild(paragraphElement);
            listElement.setAttribute('level', item.nestedLevel.toString());
            listElement.style.listStyleType = item.listStyleTypeName;
            return listElement;
        } else if (isStandardList) {
            // Create nested list for standard list type
            return this.createStandardNestedList(item, paragraphElement, rootElement);
        } else {
            // Create new root list with nesting level
            return this.createRootList(rootElement, item, paragraphElement);
        }
    }

    /* Creates a standard nested list */
    private createStandardNestedList(
        item: ListItemProperties,
        paragraphElement: Element,
        rootElement: HTMLElement
    ): HTMLElement {
        const initialNode: HTMLElement = createElement(item.listType);
        let listItem: HTMLElement = createElement('li');
        let listElement: HTMLElement;
        initialNode.appendChild(listItem);
        initialNode.style.listStyleType = 'none';
        for (let j: number = 0; j < item.nestedLevel - 1; j++) {
            listElement = createElement(item.listType);
            listItem.appendChild(listElement);
            listItem = createElement('li');
            listElement.appendChild(listItem);
            listElement.style.listStyleType = 'none';
        }
        listItem.classList.add('e-current-list-item');
        listItem.appendChild(paragraphElement);
        rootElement.appendChild(initialNode);
        listElement.setAttribute('level', item.nestedLevel.toString());
        listElement.style.listStyleType = item.listStyleTypeName;
        return listElement;
    }

    /* Gets the last list item from a list element */
    private getLastListItem(listElement: HTMLElement): HTMLElement {
        return listElement.querySelector('li:last-child');
    }

    /* Checks if this is a top-level list */
    private isTopLevelList(item: ListItemProperties): boolean {
        return item.nestedLevel === 1;
    }

    /* Handles top-level list creation or reuse */
    private handleTopLevelList(
        item: ListItemProperties,
        rootElement: HTMLElement,
        paragraphElement: Element
    ): HTMLElement {
        let listElement: HTMLElement;
        const lastChild: HTMLElement = rootElement.lastChild as HTMLElement;
        if (lastChild && lastChild.tagName.toLowerCase() === item.listType) {
            // Reuse existing list
            listElement = lastChild;
        } else {
            // Create new list
            listElement = createElement(item.listType);
            listElement.style.listStyleType = item.listStyleTypeName;
            rootElement.appendChild(listElement);
        }
        const listItem: HTMLElement = createElement('li');
        listItem.appendChild(paragraphElement);
        listElement.appendChild(listItem);
        listElement.setAttribute('level', item.nestedLevel.toString());
        listItem.classList.add('e-current-list-item');
        return listElement;
    }

    /* Handles other nesting scenarios */
    private handleOtherNestingScenarios(
        item: ListItemProperties,
        listItem: HTMLElement,
        paragraphElement: Element,
        currentFormatOverride: number
    ): void {
        let currentElement: HTMLElement = listItem;
        let listElement: HTMLElement;
        while (currentElement.parentElement) {
            currentElement = currentElement.parentElement;
            const levelAttribute: Attr = currentElement.attributes.getNamedItem('level');
            if (levelAttribute) {
                const elementLevel: number = parseInt(levelAttribute.textContent, 10);
                if (elementLevel === item.nestedLevel && currentFormatOverride === item.listFormatOverride) {
                    // Same level and format - add to existing list
                    const newListItem: HTMLElement = createElement('li');
                    newListItem.appendChild(paragraphElement);
                    currentElement.appendChild(newListItem);
                    newListItem.classList.add('e-current-list-item');
                    break;
                } else if (elementLevel === item.nestedLevel && currentFormatOverride !== item.listFormatOverride) {
                    // Same level but different format - create new list
                    this.createDifferentFormatList(item, currentElement, paragraphElement);
                    break;
                } else if (item.nestedLevel > elementLevel) {
                    // Deeper level - create nested list
                    listElement = createElement(item.listType);
                    const newListItem: HTMLElement = createElement('li');
                    newListItem.appendChild(paragraphElement);
                    listElement.appendChild(newListItem);
                    currentElement.appendChild(listElement);
                    listElement.setAttribute('level', item.nestedLevel.toString());
                    listElement.style.listStyleType = item.listStyleTypeName;
                    newListItem.classList.add('e-current-list-item');
                    break;
                }
            }
        }
    }

    /* Creates a list with different format override */
    private createDifferentFormatList(
        item: ListItemProperties,
        parentElement: HTMLElement,
        paragraphElement: Element
    ): void {
        let listElement: HTMLElement = createElement(item.listType);
        let listItem: HTMLElement = createElement('li');
        listElement.appendChild(listItem);
        if (item.nestedLevel > 1) {
            for (let k: number = 0; k < item.nestedLevel - 1; k++) {
                listItem.appendChild(listElement = createElement(item.listType));
                listItem = createElement('li');
                listElement.appendChild(listItem);
                listElement.style.listStyleType = 'none';
            }
        }
        listItem.appendChild(paragraphElement);
        listItem.classList.add('e-current-list-item');
        parentElement.appendChild(listElement);
        listElement.setAttribute('level', item.nestedLevel.toString());
        listElement.style.listStyleType = item.listStyleTypeName;
    }

    /* Applies styles and attributes to a list item */
    private applyListItemStyles(listItem: HTMLElement, item: ListItemProperties): void {
        if (isNOU(listItem)) {
            return;
        }
        listItem.setAttribute('class', item.class);
        listItem.style.cssText = !isNOU(item.listStyle) ? item.listStyle : '';
    }

    /* Sets start attribute if needed */
    private setStartAttributeIfNeeded(listElement: HTMLElement, item: ListItemProperties): void {
        const needsStartAttribute: boolean = !isNOU(item.start) &&
            item.start !== 1 && item.listType === 'ol';
        if (needsStartAttribute) {
            listElement.setAttribute('start', item.start.toString());
        }
    }

    /* Extracts list content from an element */
    private getListContent(element: Element): void {
        const firstChild: Element = element.firstElementChild;
        if (this.isImageList(firstChild)) {
            this.handleImageList(element);
        } else if (firstChild.childNodes.length > 0) {
            //Add to support separate list which looks like same list and also to add all tags as it is inside list
            this.handleTextList(element, firstChild);
        }
        this.listContents.push(element.innerHTML);
    }

    /* Checks if this is an image list */
    private isImageList(firstChild: Element): boolean {
        return firstChild.textContent.trim() === '' &&
            !isNOU(firstChild.firstElementChild) &&
            firstChild.firstElementChild.nodeName === 'IMG';
    }

    /* Handles image list content */
    private handleImageList(element: Element): void {
        const content: string = element.innerHTML.trim();
        this.listContents.push('');
        this.listContents.push(content);
    }

    /* Handles text list content */
    private handleTextList(element: Element, firstChild: Element): void {
        // Clean up list ignore tags
        this.cleanupListIgnoreTags(firstChild);
        // Clean up list order
        const listOrderElement: Element = this.cleanupListOrder(firstChild);
        this.processListOrderElement(element, firstChild, listOrderElement);
    }

    /* Cleans up list ignore tags */
    private cleanupListIgnoreTags(firstChild: Element): void {
        const listIgnoreTags: NodeListOf<Element> = firstChild.querySelectorAll('[style*="mso-list"]');
        for (let i: number = 0; i < listIgnoreTags.length; i++) {
            const tag: Element = listIgnoreTags[i as number];
            const style: string = tag.getAttribute('style').replace(/\n/g, '');
            tag.setAttribute('style', style);
        }
    }

    /* Cleans up list order element */
    private cleanupListOrder(firstChild: Element): Element {
        const listOrderCleanup: Element = firstChild.querySelector('span[style*="mso-list"]');
        if (listOrderCleanup) {
            let style: string = listOrderCleanup.getAttribute('style');
            if (style) {
                style = style.replace(/\s*:\s*/g, ':');
                listOrderCleanup.setAttribute('style', style);
            }
        }
        return firstChild.querySelector('span[style="mso-list:Ignore"]');
    }

    /* Processes list order element */
    private processListOrderElement(element: Element, firstChild: Element, listOrderElement: Element): void {
        const isEmptyMarkerSpan: boolean = isNOU(listOrderElement);
        listOrderElement =  isEmptyMarkerSpan ? firstChild : listOrderElement;
        if (!isNOU(listOrderElement)) {
            let textContent: string = listOrderElement.textContent.trim();
            if (isEmptyMarkerSpan) {
                textContent = this.extractBulletMarker(listOrderElement, textContent);
            }
            this.listContents.push(textContent);
            if (!isEmptyMarkerSpan) {
                detach(listOrderElement);
            }
            this.removingComments(element as HTMLElement);
            this.removeUnwantedElements(element as HTMLElement);
        }
    }

    /* Extracts bullet marker from text content */
    private extractBulletMarker(listOrderElement: Element, textContent: string): string {
        const bulletPattern: RegExp = /^(\d{1,2}|[a-zA-Z]|[*#~•○■])(\.|\)|-)\s*/;
        const textContentMatch: RegExpMatchArray | null = textContent.match(bulletPattern);
        if (!isNOU(textContentMatch)) {
            const markerText: string = textContentMatch[0].trim();
            listOrderElement.textContent = listOrderElement.textContent.trim().substring(markerText.length).trim();
            return markerText;
        }
        return textContent;
    }

    /* Processes margins for different element types in the document */
    private processMargin(clipboardDataElement: HTMLElement): void {
        this.processListItemMargins(clipboardDataElement);
        this.processTableMargins(clipboardDataElement);
        this.processIgnoredNodeMargins(clipboardDataElement);
    }

    /* Processes margins for list items */
    private processListItemMargins(clipboardDataElement: HTMLElement): void {
        const listItems: NodeListOf<HTMLLIElement> = clipboardDataElement.querySelectorAll('li');
        for (let i: number = 0; i < listItems.length; i++) {
            const listItem: HTMLLIElement = listItems[i as number];
            // Clear margin-left for list items unless parent has 'marginLeftIgnore' class
            if (!isNOU(listItem.style.marginLeft) && !listItem.parentElement.classList.contains('marginLeftIgnore')) {
                listItem.style.marginLeft = '';
            }
        }
    }

    /* Processes margins for tables */
    private processTableMargins(clipboardDataElement: HTMLElement): void {
        const tables: NodeListOf<HTMLTableElement> = clipboardDataElement.querySelectorAll('table');
        for (let i: number = 0; i < tables.length; i++) {
            const table: HTMLTableElement = tables[i as number];
            const marginLeft: string = table.style.marginLeft;
            // Clear negative margin-left values for tables
            if (!isNOU(marginLeft) && marginLeft.indexOf('-') >= 0) {
                table.style.marginLeft = '';
            }
        }
    }

    /* Processes margins for nodes with 'marginLeftIgnore' class */
    private processIgnoredNodeMargins(clipboardDataElement: HTMLElement): void {
        const ignoredNodes: NodeListOf<HTMLElement> = clipboardDataElement.querySelectorAll('.marginLeftIgnore li');
        for (let i: number = 0; i < ignoredNodes.length; i++) {
            const node: HTMLElement = ignoredNodes[i as number];
            const marginLeft: string = node.style.marginLeft;
            // Adjust margin-left for ignored nodes
            if (!isNOU(marginLeft) && marginLeft !== '') {
                const marginValue: number = parseFloat(marginLeft.split('in')[0]);
                const adjustedValue: number = marginValue - 0.5;
                node.style.marginLeft = adjustedValue.toString() + 'in';
            }
        }
    }

    private removeEmptyAnchorTag1(element: HTMLElement): void {
        const removableElement: NodeListOf<Element> = element.querySelectorAll('a:not([href])');
        for (let j: number = removableElement.length - 1; j >= 0; j--) {
            const parentElem: Node = removableElement[j as number].parentNode;
            while (removableElement[j as number].firstChild) {
                parentElem.insertBefore(removableElement[j as number].firstChild, removableElement[j as number]);
            }
            parentElem.removeChild(removableElement[j as number]);
        }
    }

    /* Removes empty anchor tags and preserves their contents */
    private removeEmptyAnchorTag(clipboardDataElement: HTMLElement): void {
        // Select anchor tags without href attribute
        const emptyAnchors: NodeListOf<Element> = clipboardDataElement.querySelectorAll('a:not([href])');
        // Process in reverse order to avoid index issues when removing elements
        for (let i: number = emptyAnchors.length - 1; i >= 0; i--) {
            const anchor: Element = emptyAnchors[i as number];
            const parentNode: Node = anchor.parentNode;
            // Move all children of the anchor to its parent
            while (anchor.firstChild) {
                parentNode.insertBefore(anchor.firstChild, anchor);
            }
            parentNode.removeChild(anchor);
        }
    }

    /* Determines the source of the clipboard content based on meta tags */
    private findSource(containerElement: HTMLElement): string {
        const metaTags: NodeListOf<Element> = containerElement.querySelectorAll('meta');
        for (let i: number = 0; i < metaTags.length; i++) {
            const metaTag: Element = metaTags[i as number];
            const contentAttribute: string = metaTag.getAttribute('content');
            const nameAttribute: string = metaTag.getAttribute('name');
            const isMicrosoftGenerator: boolean = nameAttribute &&
                nameAttribute.toLowerCase().indexOf('generator') >= 0 &&
                contentAttribute && contentAttribute.toLowerCase().indexOf('microsoft') >= 0;
            if (isMicrosoftGenerator) {
                // Check against known paste sources
                for (let j: number = 0; j < PASTE_SOURCE.length; j++) {
                    const source: string = PASTE_SOURCE[j as number];
                    if (contentAttribute.toLowerCase().indexOf(source) >= 0) {
                        return source;
                    }
                }
            }
        }
        return 'html';
    }

    /* Handles OneNote-specific content by unwrapping empty list elements */
    private handleOneNoteContent(clipboardDataElement: HTMLElement): void {
        const listElements: NodeListOf<HTMLElement> = clipboardDataElement.querySelectorAll('ul, ol') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < listElements.length; i++) {
            const listElement: HTMLElement = listElements[i as number];
            const hasNoListItems: boolean = listElement.querySelectorAll('li').length === 0;
            const hasChildNodes: boolean = listElement.childNodes.length > 0;
            // Unwrap list elements that have no list items but have other content
            if (hasNoListItems && hasChildNodes) {
                InsertMethods.unwrap(listElement);
            }
        }
    }

    /**
     * Cleans up resources when the component is destroyed
     *
     * @returns {void} - No return value
     * @public
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
