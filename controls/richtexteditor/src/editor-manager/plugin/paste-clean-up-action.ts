import * as EVENTS from '../../common/constant';
import { pasteCleanupGroupingTags } from '../../common/config';
import { createElement, isNullOrUndefined as isNOU, detach, Browser, extend, getUniqueID } from '@syncfusion/ej2-base';
import { convertToBlob } from '../../common/util';
import { FileInfo, IEditorModel, IPasteModel, NotifyArgs } from '../../common/interface';

/**
 * PasteCleanup common action
 *
 * @hidden
 */
export class PasteCleanupAction {
    private parent: IEditorModel;
    private pasteModel: IPasteModel;
    private iframeUploadTime: number;

    public constructor(parent: IEditorModel, pasteModel: IPasteModel) {
        this.parent = parent;
        this.pasteModel = pasteModel;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    /**
     * Updates the paste cleanup object with refreshed editor configuration and callback methods
     *
     * @param {IPasteModel} updatedPasteModel - The updated paste model with latest configuration
     * @returns {void} - This method does not return a value
     * @public
     * @hidden
     */
    public updatePasteCleanupModel(updatedPasteModel: IPasteModel): void {
        this.pasteModel = updatedPasteModel;
    }

    /**
     * Extracts file from clipboard data if available
     *
     * @param {NotifyArgs} e - The notification arguments containing clipboard data
     * @returns {File} The extracted file from clipboard
     * @public
     * @hidden
     */
    public extractFileFromClipboard(e: NotifyArgs): File {
        if (!e || !e.args || !(e.args as ClipboardEvent).clipboardData ||
            (e.args as ClipboardEvent).clipboardData.items.length === 0) {
            return null;
        }
        const items: DataTransferItemList = (e.args as ClipboardEvent).clipboardData.items;
        const file: File = items[0].getAsFile();
        if (file !== null) {
            return file;
        }
        return !isNOU(items[1]) ? items[1].getAsFile() : null;
    }

    /**
     * Splits text by double line breaks and formats it according to editor's enter key configuration
     *
     * @param {string} value - The text value to be split and formatted
     * @returns {string} The formatted text with proper line breaks
     * @public
     * @hidden
     */
    public splitBreakLine(value: string): string {
        const enterSplitText: string[] = value.split(/\r\n\r\n|\n\n/g);
        let finalText: string = '';
        const startNode: string = this.getHtmlNode(true);
        const endNode: string = this.getHtmlNode(false);
        const isBrFormat: boolean = this.pasteModel.enterKey === 'BR';
        for (let i: number = 0; i < enterSplitText.length; i++) {
            const content: string = enterSplitText[i as number];
            const contentWithSpace: string = this.normalizeSpacesForHtml(content);
            const contentWithLineBreak: string = contentWithSpace.replace(/\r\n|\n/g, '<br>');
            if (i === 0) {
                if (isBrFormat && (i !== enterSplitText.length - 1 || contentWithLineBreak.endsWith('<br>'))) {
                    if (i !== enterSplitText.length - 1) {
                        finalText += (contentWithLineBreak + endNode + endNode);
                    } else {
                        finalText += (contentWithLineBreak + endNode);
                    }
                }
                else {
                    finalText += contentWithLineBreak; // In order to merge the content in current line. No P/Div tag is added.
                }
            } else {
                if (isBrFormat) {
                    if (contentWithLineBreak.endsWith('<br>') || (contentWithLineBreak === '' && i === enterSplitText.length - 1)) {
                        finalText += (contentWithLineBreak + endNode);
                    }
                    else if (i === enterSplitText.length - 1) {
                        finalText += contentWithLineBreak;
                    } else {
                        finalText += (contentWithLineBreak + endNode + endNode);
                    }
                } else {
                    if (contentWithLineBreak.trim() === '') {
                        finalText += '<br>';
                    }
                    finalText += startNode + contentWithLineBreak + endNode;
                }
            }
        }
        return finalText;
    }

    /**
     * Gets HTML node tag based on enterKey settings and whether it's start or end tag
     *
     * @param {boolean} isStartTag - Indicates whether to return start tag (true) or end tag (false)
     * @returns {string} The HTML node tag string
     * @public
     * @hidden
     */
    public getHtmlNode(isStartTag: boolean): string {
        if (this.pasteModel.enterKey === 'P') {
            return isStartTag ? '<p>' : '</p>';
        } else if (this.pasteModel.enterKey === 'DIV') {
            return isStartTag ? '<div>' : '</div>';
        }
        return isStartTag ? '' : '<br>';
    }

    /**
     * Converts spaces and tabs in text to HTML space entities.
     *
     * @param {string} text - The input text containing spaces and tabs to be converted
     * @returns {string} The text with spaces and tabs converted to HTML entities
     * @public
     * @hidden
     */
    public normalizeSpacesForHtml(text: string): string {
        let spacedContent: string = '';
        if (text === '') {
            return text;
        }
        const lineBreakSplitText: string[] = text.split(' ');
        for (let i: number = 0; i < lineBreakSplitText.length; i++) {
            const currentText: string = lineBreakSplitText[i as number];
            if (currentText === '') {
                spacedContent += '&nbsp;';
            } else if (currentText === '\t') {
                spacedContent += '&nbsp;&nbsp;&nbsp;&nbsp;';
            } else {
                if (i > 0 && i < lineBreakSplitText.length) {
                    spacedContent += ' ';
                }
                spacedContent += currentText;
            }
        }
        spacedContent = spacedContent.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
        spacedContent = spacedContent.replace(/&nbsp;&nbsp;/g, '&nbsp; ');
        return spacedContent;
    }

    /**
     * Converts base64 into file data.
     *
     * @param {string} base64 - The base64 encoded string to convert
     * @param {string} filename - The name for the resulting file
     * @returns {File} The converted file object
     * @public
     * @hidden
     */
    public base64ToFile(base64: string, filename: string): File {
        const baseStr: string[] = base64.split(',');
        const typeStr: string = baseStr[0].match(/:(.*?);/)[1];
        const extension: string = typeStr.split('/')[1];
        const decodeStr: string = atob(baseStr[1]);
        let strLen: number = decodeStr.length;
        const decodeArr: Uint8Array = new Uint8Array(strLen);
        while (strLen--) {
            decodeArr[strLen as number] = decodeStr.charCodeAt(strLen);
        }
        if (Browser.isIE || navigator.appVersion.indexOf('Edge') > -1) {
            const blob: Blob = new Blob([decodeArr], { type: extension });
            extend(blob, { name: filename + '.' + (!isNOU(extension) ? extension : '') });
            return blob as File;
        } else {
            return new File([decodeArr], filename + '.' + (!isNOU(extension) ? extension : ''), { type: extension });
        }
    }

    /**
     * Sets the image opacity to indicate upload in progress.
     *
     * @param {Element} imgElem - The image element to modify opacity for
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public setImageOpacity(imgElem: Element): void {
        (imgElem as HTMLElement).style.opacity = '0.5';
    }

    /**
     * Creates the popup element for upload progress.
     *
     * @returns {HTMLElement} The created popup element for displaying upload progress
     * @public
     * @hidden
     */
    public createPopupElement(): HTMLElement {
        const popupEle: HTMLElement = createElement('div');
        this.pasteModel.rootContainer.appendChild(popupEle);
        return popupEle;
    }

    /**
     * Converts base64 image sources to blob URLs.
     *
     * @param {NodeListOf<HTMLImageElement>} allImgElm - Collection of image elements to process
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public getBlob(allImgElm: NodeListOf<HTMLImageElement>): void {
        for (let i: number = 0; i < allImgElm.length; i++) {
            const imgSrc: string = allImgElm[i as number].getAttribute('src');
            if (!isNOU(imgSrc) && imgSrc.split(',')[0].indexOf('base64') >= 0) {
                const blobUrl: string = URL.createObjectURL(convertToBlob(imgSrc));
                allImgElm[i as number].setAttribute('src', blobUrl);
            }
        }
    }

    /**
     * Removes Apple-specific line break elements from the HTML content.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing clipboard content to clean
     * @returns {HTMLElement} The cleaned HTML element with Apple-specific line breaks removed
     * @public
     * @hidden
     */
    public cleanAppleClass (clipBoardElem: HTMLElement): HTMLElement {
        const appleClassElem: NodeListOf<Element> = clipBoardElem.querySelectorAll('br.Apple-interchange-newline');
        for (let i : number = 0; i < appleClassElem.length; i++) {
            detach(appleClassElem[i as number]);
        }
        return clipBoardElem;
    }

    /**
     * Removes denied tags and attributes as configured by paste cleanup settings.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing clipboard content to clean
     * @param {boolean} clean - Flag indicating whether cleanup should be performed
     * @returns {HTMLElement} The cleaned HTML element with denied tags and attributes removed
     * @public
     * @hidden
     */
    public cleanupDeniedTagsAndAttributes(clipBoardElem: HTMLElement, clean: boolean): HTMLElement {
        if (this.pasteModel.pasteCleanupSettings.deniedTags !== null) {
            clipBoardElem = this.deniedTags(clipBoardElem);
        }
        if (clean) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        } else if (this.pasteModel.pasteCleanupSettings.deniedAttrs !== null) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        }
        return clipBoardElem;
    }

    /**
     * Removes elements matching denied tags (with or without attribute selectors) from the provided clipboard element.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing clipboard content to process
     * @returns {HTMLElement} The cleaned HTML element with denied tags removed
     * @public
     * @hidden
     */
    public deniedTags(clipBoardElem: HTMLElement): HTMLElement {
        let deniedTags: string[] = isNOU(this.pasteModel.pasteCleanupSettings.deniedTags) ? [] :
            [...this.pasteModel.pasteCleanupSettings.deniedTags];
        deniedTags = this.attributesfilter(deniedTags);
        deniedTags = this.tagGrouping(deniedTags);
        for (let i: number = 0; i < deniedTags.length; i++) {
            const removableElement: NodeListOf<Element> = clipBoardElem.querySelectorAll(
                deniedTags[i as number]
            );
            for (let j: number = removableElement.length - 1; j >= 0; j--) {
                const elementToRemove: Element = removableElement[j as number];
                const parentElem: Node = elementToRemove.parentNode;
                while (elementToRemove.firstChild) {
                    parentElem.insertBefore(elementToRemove.firstChild, elementToRemove);
                }
                parentElem.removeChild(elementToRemove);
            }
        }
        return clipBoardElem;
    }

    /**
     * Parses denied tags array and filters attributes, supporting allowed and denied (! prefix) attributes.
     *
     * @param {string[]} deniedTags - Array of denied tag strings to parse and filter
     * @returns {string[]} The filtered array of attribute strings
     * @public
     * @hidden
     */
    public attributesfilter(deniedTags: string[]): string[] {
        for (let i: number = 0; i < deniedTags.length; i++) {
            const currentDeniedTag: string = deniedTags[i as number];
            if (currentDeniedTag.split('[').length > 1) {
                const userAttributes: string[] = currentDeniedTag.split('[')[1].split(']')[0].split(',');
                const allowedAttributeArray: string[] = [];
                const deniedAttributeArray: string[] = [];
                for (let j: number = 0; j < userAttributes.length; j++) {
                    const currentUserAttrs: string = userAttributes[j as number];
                    if (userAttributes[j as number].indexOf('!') < 0) {
                        allowedAttributeArray.push(currentUserAttrs.trim());
                    } else {
                        deniedAttributeArray.push(currentUserAttrs.split('!')[1].trim());
                    }
                }
                const allowedAttribute: string = allowedAttributeArray.length > 1 ?
                    (allowedAttributeArray.join('][')) : (allowedAttributeArray.join());
                const deniedAttribute: string = deniedAttributeArray.length > 1 ?
                    deniedAttributeArray.join('][') : (deniedAttributeArray.join());
                if (deniedAttribute.length > 0) {
                    const select: string = allowedAttribute !== '' ? currentDeniedTag.split('[')[0] +
                        '[' + allowedAttribute + ']' : currentDeniedTag.split('[')[0];
                    deniedTags[i as number] = select + ':not([' + deniedAttribute + '])';
                } else {
                    deniedTags[i as number] = currentDeniedTag.split('[')[0] + '[' + allowedAttribute + ']';
                }
            }
        }
        return deniedTags;
    }

    /**
     * Expands denied tag list by including related tags based on grouping definitions.
     *
     * @param {string[]} deniedTags - Array of denied tag strings to expand
     * @returns {string[]} The expanded array of denied tags including related tags
     * @public
     * @hidden
     */
    public tagGrouping(deniedTags: string[]): string[] {
        const groupingTags: string[] = [...deniedTags];
        const keys: string[] = Object.keys(pasteCleanupGroupingTags);
        const values: string[][] = keys.map((key: string) => {
            return pasteCleanupGroupingTags[`${key}`];
        });
        const addTags: string[] = [];
        for (let i: number = 0; i < groupingTags.length; i++) {
            let currrentGroupTag: string = groupingTags[i as number];
            const groupIndex: number = keys.indexOf(currrentGroupTag);
            //The value split using '[' because to retrieve the tag name from the user given format which may contain tag with attributes
            if (currrentGroupTag.split('[').length > 1) {
                currrentGroupTag = currrentGroupTag.split('[')[0].trim();
            }
            if (keys.indexOf(groupingTags[i as number]) > -1) {
                for (let j: number = 0; j < values[groupIndex as number].length; j++) {
                    if (groupingTags.indexOf(values[groupIndex as number][j as number]) < 0 &&
                        addTags.indexOf(values[groupIndex as number][j as number]) < 0) {
                        addTags.push(values[groupIndex as number][j as number]);
                    }
                }
            }
        }
        return deniedTags = deniedTags.concat(addTags);
    }

    /**
     * Removes denied attributes from all elements in the provided clipboard element.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing clipboard content to process
     * @param {boolean} clean - Flag indicating whether cleanup should be performed
     * @returns {HTMLElement} The cleaned HTML element with denied attributes removed
     * @public
     * @hidden
     */
    public deniedAttributes(clipBoardElem: HTMLElement, clean: boolean): HTMLElement {
        const deniedAttrs: string[] = isNOU(this.pasteModel.pasteCleanupSettings.deniedAttrs) ? [] :
            [...this.pasteModel.pasteCleanupSettings.deniedAttrs];
        if (clean) {
            deniedAttrs.push('style');
        }
        for (let i: number = 0; i < deniedAttrs.length; i++) {
            const currentDeniedAttr: string = deniedAttrs[i as number];
            const removableAttrElement: NodeListOf<HTMLElement> = clipBoardElem.
                querySelectorAll('[' + currentDeniedAttr + ']');
            for (let j: number = 0; j < removableAttrElement.length; j++) {
                removableAttrElement[j as number].removeAttribute(currentDeniedAttr);
            }
        }
        return clipBoardElem;
    }

    /**
     * Filters the inline 'style' attribute on all elements within the clipboard root element, leaving only allowed CSS style properties.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing clipboard content to process
     * @returns {HTMLElement} The processed HTML element with filtered style attributes
     * @public
     * @hidden
     */
    public allowedStyle(clipBoardElem: HTMLElement): HTMLElement {
        const allowedStyleProps: string[] = isNOU(this.pasteModel.pasteCleanupSettings.allowedStyleProps) ? [] :
            [...this.pasteModel.pasteCleanupSettings.allowedStyleProps];
        allowedStyleProps.push('list-style-type', 'list-style');
        const elementsWithStyle: NodeListOf<HTMLElement> = clipBoardElem.querySelectorAll('[style]');
        for (let i: number = 0; i < elementsWithStyle.length; i++) {
            const currentStyleElem: HTMLElement = elementsWithStyle[i as number];
            let allowedStyleValue: string = '';
            const allowedStyleValueArray: string[] = [];
            const styleValue: string[] = currentStyleElem.getAttribute('style').split(';');
            for (let k: number = 0; k < styleValue.length; k++) {
                if (allowedStyleProps.indexOf(styleValue[k as number].split(':')[0].trim()) >= 0) {
                    allowedStyleValueArray.push(styleValue[k as number]);
                }
            }
            currentStyleElem.removeAttribute('style');
            allowedStyleValue = allowedStyleValueArray.join(';').trim() === '' ?
                allowedStyleValueArray.join(';') : allowedStyleValueArray.join(';') + ';';
            if (allowedStyleValue) {
                currentStyleElem.style.cssText += allowedStyleValue;
            }
        }
        return clipBoardElem;
    }

    /**
     * Adds paste class to images and applies image properties.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing clipboard content with images to process
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public setImageClassAndProps(clipBoardElem: HTMLElement): void {
        const allImg: HTMLCollectionOf<HTMLImageElement> = clipBoardElem.getElementsByTagName('img');
        for (let i: number = 0, len: number = allImg.length; i < len; i++) {
            if (allImg[i as number].getAttribute('src') !== null) {
                allImg[i as number].className += ' pasteContent_Img';
            }
            this.setImageProperties(allImg[i as number]);
        }
        this.addTempClass(clipBoardElem);
    }

    /**
     * Sets width, height, and min/max styles for inserted images based on editor settings.
     *
     * @param {HTMLImageElement} allImg - The image element to apply properties to
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public setImageProperties(allImg: HTMLImageElement): void {
        if (this.pasteModel.insertImageSettings.width !== 'auto') {
            allImg.setAttribute('width', this.pasteModel.insertImageSettings.width);
        }
        if (this.pasteModel.insertImageSettings.minWidth !== '0' && this.pasteModel.insertImageSettings.minWidth !== 0) {
            allImg.style.minWidth = this.pasteModel.insertImageSettings.minWidth.toString();
        }
        if (this.pasteModel.insertImageSettings.maxWidth !== null) {
            allImg.style.maxWidth = this.pasteModel.getInsertImgMaxWidth().toString();
        }
        if (this.pasteModel.insertImageSettings.height !== 'auto') {
            allImg.setAttribute('height', this.pasteModel.insertImageSettings.height);
        }
        if (this.pasteModel.insertImageSettings.minHeight !== '0' && this.pasteModel.insertImageSettings.minHeight !== 0) {
            allImg.style.minHeight = this.pasteModel.insertImageSettings.minHeight.toString();
        }
        if (this.pasteModel.insertImageSettings.maxHeight !== null) {
            allImg.style.maxHeight = this.pasteModel.insertImageSettings.maxHeight.toString();
        }
    }

    /**
     * Temporarily adds a CSS class to all children of the clipboard element.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing clipboard content to add temporary classes to
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public addTempClass(clipBoardElem: HTMLElement): void {
        const allChild: HTMLCollection = clipBoardElem.children;
        for (let i: number = 0; i < allChild.length; i++) {
            allChild[i as number].classList.add('pasteContent_RTE');
        }
    }

    /**
     * Checks if there is any <picture> element present.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element to check for picture elements
     * @returns {boolean} True if picture element is found, false otherwise
     * @public
     * @hidden
     */
    public hasPictureElement(clipBoardElem: HTMLElement): boolean {
        return clipBoardElem.getElementsByTagName('picture').length > 0;
    }

    /**
     * Processes all <picture> elements to resolve relative srcset attributes in <source> tags
     * using the base URI or the origin of the image source.
     *
     * @param {HTMLElement} clipBoardElem - The HTML element containing picture elements to process
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public processPictureElement(clipBoardElem: HTMLElement): void {
        const pictureElems: NodeListOf<HTMLElement> = clipBoardElem.querySelectorAll('picture');
        const base: string = this.pasteModel.getDocument().baseURI;
        for (let i: number = 0; i < pictureElems.length; i++) {
            const imgElem: HTMLImageElement | null = pictureElems[i as number].querySelector('img');
            const sourceElems: NodeListOf<HTMLSourceElement> = pictureElems[i as number].querySelectorAll('source');
            if (imgElem && imgElem.getAttribute('src')) {
                const srcValue: string = (imgElem as HTMLElement).getAttribute('src');
                const url: URL = srcValue.indexOf('http') > -1 ? new URL(srcValue) : new URL(srcValue, base);
                for (let j: number = 0; j < sourceElems.length; j++) {
                    const srcset: string | null = sourceElems[j as number].getAttribute('srcset');
                    if (srcset) {
                        if (srcset.indexOf('http') === -1) {
                            const fullPath: string = url.origin + srcset;
                            sourceElems[j as number].setAttribute('srcset', fullPath);
                        }
                    }
                }
            }
        }
    }

    /**
     * Returns true if node has any content (text, images, or table).
     *
     * @param {HTMLElement} clipBoardElem - The HTML element to check for content
     * @returns {boolean} True if the element has content, false otherwise
     * @public
     * @hidden
     */
    public hasContentToPaste(clipBoardElem: HTMLElement): boolean {
        const hasText: boolean = (clipBoardElem.textContent !== '') && (clipBoardElem.textContent.replace(/\u200B/g, '').trim() !== '');
        const hasImg: boolean = clipBoardElem.getElementsByTagName('img').length > 0;
        const hasTable: boolean = clipBoardElem.getElementsByTagName('table').length > 0;
        const hasBr: boolean = clipBoardElem.getElementsByTagName('br').length > 0;
        return hasText || hasImg || hasTable || hasBr;
    }

    /**
     * Extracts base64-encoded images from the HTML content and converts them to File objects for upload.
     *
     * @param {HTMLElement} tempWrapperElem - The HTML element containing base64 images to extract
     * @returns {FileInfo[]} Array of FileInfo objects containing the converted file data
     * @public
     * @hidden
     */
    public collectBase64ImageFiles(tempWrapperElem: HTMLElement): FileInfo[] {
        const filesData: FileInfo[] = [];
        if (!isNOU(tempWrapperElem.querySelector('img'))) {
            const imgElem: NodeListOf<HTMLImageElement> = tempWrapperElem.querySelectorAll('img');
            const base64Src: string[] = [];
            const imgName: string[] = [];
            const uploadImg: Element[] = [];
            for (let i: number = 0; i < imgElem.length; i++) {
                const src: string = imgElem[i as number].getAttribute('src');
                if (src && src.split(',')[0].indexOf('base64') >= 0) {
                    base64Src.push(src);
                    imgName.push(getUniqueID('rte_image'));
                    uploadImg.push(imgElem[i as number]);
                }
            }
            const fileList: File[] = [];
            let currentData: FileInfo;
            for (let i: number = 0; i < base64Src.length; i++) {
                fileList.push(this.base64ToFile(base64Src[i as number], imgName[i as number]));
                currentData = {
                    name: fileList[i as number].name,
                    rawFile: fileList[i as number],
                    size: fileList[i as number].size,
                    type: fileList[i as number].type,
                    status: '',
                    validationMessages: { minSize: '', maxSize: '' },
                    statusCode: '1'
                };
                filesData.push(currentData);
            }
        }
        return filesData;
    }

    /**
     * Adds appropriate class names to tables in the pasted content for formatting or standardization.
     *
     * @param {HTMLElement} element - The HTML element containing tables to add classes to
     * @param {string} [source] - Optional source parameter for context-specific formatting
     * @returns {HTMLElement} The processed HTML element with table classes added
     * @public
     * @hidden
     */
    public addTableClass(element: HTMLElement, source?: string): HTMLElement {
        const tableElements: NodeListOf<HTMLTableElement> = element.querySelectorAll('table');
        for (let i: number = 0; i < tableElements.length; i++) {
            const table: HTMLTableElement = tableElements[i as number];
            const tableParentElement: HTMLElement | null = table.parentElement;
            const isMSTeamsTable: boolean = tableParentElement &&
                (tableParentElement.nodeName === 'FIGURE');
            const hasCustomClass: boolean = table.classList.length > 0 &&
                table.classList.contains('e-rte-custom-table');
            if (hasCustomClass) {
                continue; // Skip the custom table class
            }
            if (this.pasteModel.pasteCleanupSettings.keepFormat && source && !isMSTeamsTable) {
                table.classList.add('e-rte-paste-' + source + '-table');
            } else if (!table.classList.contains('e-rte-table')) {
                table.classList.add('e-rte-table');
            }
            // Remove empty next sibling node (if any)
            const tableNextSibling: Node = table.nextSibling;
            const shouldRemoveNextSibling: boolean = isNOU(table.nextElementSibling) &&
                tableNextSibling && tableNextSibling.textContent.trim() === '';
            if (shouldRemoveNextSibling) {
                detach(tableNextSibling);
            }
        }
        return element;
    }

    /**
     * Removes the temporary CSS class from elements and their class attribute if empty.
     *
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public removeTempClass(): void {
        const classElm: NodeListOf<Element> = this.pasteModel.getEditPanel().querySelectorAll('.pasteContent_RTE');
        for (let i: number = 0; i < classElm.length; i++) {
            classElm[i as number].classList.remove('pasteContent_RTE');
            if (classElm[i as number].getAttribute('class') === '') {
                classElm[i as number].removeAttribute('class');
            }
        }
    }

    /**
     * Handles image cropping and blob-to-base64 conversion for images within the provided element.
     *
     * @param {HTMLElement} element - The HTML element containing images to be processed.
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public cropImageHandler(element: HTMLElement): void {
        const croppedImgs: NodeListOf<HTMLImageElement> = element.querySelectorAll('.e-img-cropped');
        if (croppedImgs.length > 0) {
            this.processCroppedImages(croppedImgs);
        } else {
            this.handleBlobOrUpload();
        }
    }

    /**
     * Processes all images marked for cropping within the editor element using a for loop.
     *
     * @param {NodeListOf<HTMLImageElement>} croppedImgs - A NodeList of HTML image elements that are marked for cropping.
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public processCroppedImages(croppedImgs: NodeListOf<HTMLImageElement>): void {
        for (let i: number = 0; i < croppedImgs.length; i++) {
            const currentImage: HTMLImageElement = croppedImgs[i as number];
            const src: string | null = currentImage.getAttribute('src');
            if (src && src.split(',')[0].indexOf('base64') >= 0) {
                const cropData: { [key: string]: number } = this.pasteModel.getCropImageData()[i as number] as { [key: string]: number };
                const tempImage: HTMLImageElement = new Image();
                tempImage.src = src;
                tempImage.onload = (): void => {
                    const wRatio: number = cropData.goalWidth / tempImage.naturalWidth;
                    const hRatio: number = cropData.goalHeight / tempImage.naturalHeight;
                    const cropLeft: number = cropData.cropLength / wRatio;
                    const cropTop: number = cropData.cropTop / hRatio;
                    const cropWidth: number = (
                        cropData.goalWidth - cropData.cropLength - cropData.cropR
                    ) / wRatio;
                    const cropHeight: number = (
                        cropData.goalHeight - cropData.cropTop - cropData.cropB
                    ) / hRatio;
                    const canvas: HTMLCanvasElement = document.createElement('canvas');
                    canvas.width = cropWidth;
                    canvas.height = cropHeight;
                    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
                    if (ctx) {
                        // Draw the cropped portion of the image onto the canvas
                        ctx.drawImage(
                            tempImage, cropLeft, cropTop,
                            cropWidth, cropHeight, 0, 0,
                            cropWidth, cropHeight
                        );
                        // Update the image source with the cropped image data
                        currentImage.setAttribute('src', canvas.toDataURL('image/png'));
                        currentImage.classList.remove('e-img-cropped');
                        this.pasteModel.imageUpload();
                        if (this.pasteModel.iframeSettings.enable) {
                            this.pasteModel.updateValue();
                        }
                    }
                };
            }
        }
    }

    /**
     * Handles blob image conversion to base64 (based on clipboard content) or the general image upload/updateValue logic.
     *
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public handleBlobOrUpload(): void {
        const inputElement: Element = this.pasteModel.getEditPanel();
        const inputImgs: NodeListOf<HTMLImageElement> = inputElement.querySelectorAll('img');
        const needsBlobConversion: boolean = inputImgs.length > 0 &&
            inputImgs[0].src.startsWith('blob') &&
            !isNOU(this.pasteModel.insertImageSettings.saveUrl) &&
            !isNOU(this.pasteModel.insertImageSettings.path);
        if (needsBlobConversion) {
            // Based on the information in your clipboard, convert blob src 'img' elements to base64 if needed
            this.convertBlobToBase64(inputElement as HTMLElement);
            this.iframeUploadTime = setTimeout(() => {
                this.pasteModel.imageUpload();
                if (this.pasteModel.iframeSettings.enable) {
                    this.pasteModel.updateValue();
                }
            }, 20);
        } else {
            this.pasteModel.imageUpload();
            if (this.pasteModel.iframeSettings.enable && !this.pasteModel.enableXhtml) {
                this.pasteModel.updateValue();
            }
        }
    }

    /**
     * Converts all <img> elements with a blob URL source inside the provided element to base64.
     *
     * @param {HTMLElement} element - The HTML element containing image elements to be converted from blob URLs to base64.
     * @returns {void} Nothing is returned
     * @public
     * @hidden
     */
    public convertBlobToBase64(element: HTMLElement): void {
        const imgElem: NodeListOf<HTMLImageElement> = element.querySelectorAll('img');
        for (let i: number = 0; i < imgElem.length; i++) {
            const imgUrl: string = imgElem[i as number].getAttribute('src');
            if (imgUrl && imgUrl.startsWith('blob')) {
                const tempImage: HTMLImageElement = new Image();
                // Once the blob image is loaded, draw it on a canvas and get the base64 string
                const onImageLoadEvent: () => void = () => {
                    const canvas: HTMLCanvasElement = document.createElement('canvas');
                    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                    canvas.width = tempImage.width;
                    canvas.height = tempImage.height;
                    ctx.drawImage(tempImage, 0, 0);
                    const base64String: string = canvas.toDataURL('image/png');
                    // Replace the <img> src with the base64
                    (imgElem[i as number] as HTMLImageElement).src = base64String;
                    tempImage.removeEventListener('load', onImageLoadEvent);
                };
                tempImage.src = imgUrl;
                tempImage.addEventListener('load', onImageLoadEvent);
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
        if (this.iframeUploadTime) { clearTimeout(this.iframeUploadTime); this.iframeUploadTime = null; }
        this.removeEventListener();
    }
    // Paste Cleanup Module Logics End
}
