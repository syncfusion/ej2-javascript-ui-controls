
import { isNullOrUndefined as isNOU, detach, createElement, addClass, updateCSSText } from '@syncfusion/ej2-base';
import { IPasteCleanupOptions, ListItemProperties } from '../../../common/interface';
import { BlockManager } from '../../base/block-manager';
import { WordListConverter } from './ms-list-converter';

/**
 * Handles cleanup of pasted content for the Block Editor.
 */
export class ClipboardCleanupModule {
    private parent: BlockManager;
    public listConverter: WordListConverter;
    private static inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    private static ignorableNodes: string[] = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
        'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
        'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
        'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
        'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
        'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
        'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
    /** List of HTML block node names */
    private static blockNode: string[] = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
    private static removableElements: string[] = ['o:p', 'style', 'w:sdt', 'xml', 'script', 'meta', 'link'];
    private static msWordPatterns: RegExp[] = [
        /class='?Mso|style='[^ ]*\bmso-/i,
        /class="?Mso|style="[^ ]*\bmso-/i,
        /(class="?Mso|class='?Mso|class="?Xl|class='?Xl|class=Xl|style="[^"]*\bmso-|style='[^']*\bmso-|w:WordDocument)/gi,
        /style='mso-width-source:/i,

        // New Office 365 patterns
        /\bOutlineElement\b/i,
        /\bSCXW\d+\b/i,  // e.g., SCXW218690740
        /\bBCX\d+\b/i,   // e.g., BCX0
        /\bTextRun\b/i,
        /\bEOP\b/i,
        /\bpara(id|eid)=/i,  // e.g., paraid="292866517"
        /data-ccp-/i,        // e.g., data-ccp-parastyle
        /\bWACImageContainer\b/i  // Word's image container
    ];

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.listConverter = new WordListConverter(this);
    }

    /**
     * Handles the paste cleanup process.
     * It checks if the paste content is plain text or from MS Word and processes accordingly.
     *
     * @param {IPasteCleanupOptions} args - The arguments for paste cleanup.
     * @returns {string} - The cleaned HTML content.
     * @hidden
     */
    public cleanupPaste(args: IPasteCleanupOptions): string {
        const { html, plainText }: IPasteCleanupOptions = args;
        if (this.parent.pasteCleanupSettings.plainText) {
            return this.plainFormatting(plainText);
        }

        const isFromMsWord: boolean = this.isFromMsWord(html);
        if (isFromMsWord) {
            return this.cleanMsWordContent(html);
        }

        return this.cleanupHtml(html, this.parent.pasteCleanupSettings.keepFormat);
    }

    private isFromMsWord(html: string): boolean {
        return ClipboardCleanupModule.msWordPatterns.some((pattern: RegExp) => pattern.test(html));
    }

    private cleanMsWordContent(html: string): string {
        const tempDiv: HTMLElement = createElement('div') as HTMLElement;
        tempDiv.innerHTML = html;
        let listNodes: Element[] = [];

        this.addListClass(tempDiv);
        listNodes = this.listCleanUp(tempDiv, listNodes);
        if (!isNOU(listNodes[0]) && listNodes[0].parentElement.tagName !== 'UL' &&
            listNodes[0].parentElement.tagName !== 'OL') {
            this.listConverter.convertListNodes(listNodes);
        }

        // Remove Word-specific elements
        this.removeUnwantedElements(tempDiv);

        // Clean up lists
        this.cleanupLists(tempDiv);

        // Process tables
        this.processTables(tempDiv);

        // Remove Word-specific classes
        this.removeWordClasses(tempDiv);

        // Clean up styles
        this.cleanupStyles(tempDiv, this.parent.pasteCleanupSettings.allowedStyles);

        // Remove empty elements
        this.removeEmptyElements(tempDiv);

        // Remove comments
        this.removeComments(tempDiv);

        // Process images
        this.processImages(tempDiv);

        return tempDiv.innerHTML;
    }

    private addListClass(elm: HTMLElement): void {
        const allNodes: NodeListOf<Element> = elm.querySelectorAll('*');
        for (let index: number = 0; index < allNodes.length; index++) {
            if (!isNOU(allNodes[index as number].getAttribute('style')) && allNodes[index as number].getAttribute('style').replace(/ /g, '').replace('\n', '').indexOf('mso-list:l') >= 0 &&
                (allNodes[index as number] as Element).className.toLowerCase().indexOf('msolistparagraph') === -1 &&
                allNodes[index as number].tagName.charAt(0) !== 'H' && allNodes[index as number].tagName !== 'LI' &&
                allNodes[index as number].tagName !== 'OL' && allNodes[index as number].tagName !== 'UL') {
                allNodes[index as number].classList.add('msolistparagraph');
            }
        }
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
        const isNotInIgnorableList: boolean = ClipboardCleanupModule.ignorableNodes.indexOf(element.nodeName) === -1;
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
        return ClipboardCleanupModule.blockNode.indexOf(element.nodeName.toLowerCase()) !== -1;
    }

    private cleanupHtml(html: string, keepFormat: boolean): string {
        const tempDiv: HTMLElement = createElement('div') as HTMLElement;
        tempDiv.innerHTML = html;

        this.removeUnwantedElements(tempDiv);

        // Normalize and sanitize any tables in generic HTML (non-Word)
        this.processTables(tempDiv);

        if (!keepFormat) {
            this.deniedAttributes(tempDiv, true);
        } else if (this.parent.pasteCleanupSettings.deniedTags && this.parent.pasteCleanupSettings.deniedTags.length > 0) {
            this.deniedAttributes(tempDiv, false);
        }

        if (this.parent.pasteCleanupSettings.allowedStyles && this.parent.pasteCleanupSettings.allowedStyles.length > 0) {
            this.allowedStyle(tempDiv);
        }

        if (this.parent.pasteCleanupSettings.deniedTags && this.parent.pasteCleanupSettings.deniedTags.length > 0) {
            this.deniedTags(tempDiv);
        }

        this.removeEmptyElements(tempDiv);

        this.removeComments(tempDiv);

        this.processImages(tempDiv);

        this.cleanupCssPatterns(tempDiv);

        return tempDiv.innerHTML;
    }

    private plainFormatting(html: string): string {
        const tempDiv: HTMLElement = createElement('div') as HTMLElement;
        tempDiv.innerHTML = html;

        this.detachInlineElements(tempDiv);

        this.getTextContent(tempDiv);

        this.removeEmptyElements(tempDiv);

        this.removeComments(tempDiv);

        return tempDiv.innerHTML;
    }

    public removeUnwantedElements(element: HTMLElement): void {
        this.removeStyleElements(element);
        let innerElement: string = element.innerHTML;
        for (let i: number = 0; i < ClipboardCleanupModule.removableElements.length; i++) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regExpStartElem: RegExp = new RegExp('<' + ClipboardCleanupModule.removableElements[i as number] + '\\s*[^>]*>', 'g');
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regExpEndElem: RegExp = new RegExp('</' + ClipboardCleanupModule.removableElements[i as number] + '>', 'g');
            innerElement = innerElement.replace(regExpStartElem, '');
            innerElement = innerElement.replace(regExpEndElem, '');
        }
        element.innerHTML = innerElement;
    }

    private removeStyleElements(element: HTMLElement): void {
        const styleElement: HTMLElement = element.querySelector('style');
        if (!isNOU(styleElement)) {
            detach(styleElement);
        }
    }

    public removeComments(element: HTMLElement): void {
        let innerElement: string = element.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        element.innerHTML = innerElement;
    }

    private removeEmptyElements(element: HTMLElement): void {
        const emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            if (emptyElements[(i as number)].tagName !== 'IMG' &&
                emptyElements[(i as number)].tagName !== 'BR' &&
                emptyElements[(i as number)].tagName !== 'IFRAME' &&
                emptyElements[(i as number)].tagName !== 'TD' &&
                emptyElements[(i as number)].tagName !== 'HR'
            ) {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[(i as number)]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    }

    private findDetachEmptyElem(element: Element): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            const hasNbsp: boolean = element.parentElement.textContent.length > 0 &&
                element.parentElement.textContent.match(/\u00a0/g) &&
                element.parentElement.textContent.match(/\u00a0/g).length > 0;
            if (!hasNbsp && element.parentElement.textContent.trim() === '' &&
                isNOU(element.parentElement.querySelector('img'))) {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            } else {
                removableElement = element as HTMLElement;
            }
        } else {
            removableElement = null;
        }
        return removableElement;
    }

    private removeWordClasses(element: HTMLElement): void {
        const elementsWithClass: NodeListOf<HTMLElement> = element.querySelectorAll('*[class]') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < elementsWithClass.length; i++) {
            const classList: DOMTokenList = elementsWithClass[(i as number)].classList;
            const classesToRemove: string[] = [];

            for (let j: number = 0; j < classList.length; j++) {
                if (classList[(j as number)].indexOf('Mso') === 0) {
                    classesToRemove.push(classList[(j as number)]);
                }
            }

            classesToRemove.forEach((className: string) => {
                elementsWithClass[(i as number)].classList.remove(className);
            });

            if (elementsWithClass[(i as number)].classList.length === 0) {
                elementsWithClass[(i as number)].removeAttribute('class');
            }
        }
    }

    private cleanupStyles(element: HTMLElement, allowedStyles: string[]): void {
        const elementsWithStyle: NodeListOf<HTMLElement> = element.querySelectorAll('*[style]') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < elementsWithStyle.length; i++) {
            const styleAttr: string = elementsWithStyle[(i as number)].getAttribute('style');
            if (!styleAttr) { continue; }

            const styles: string[] = styleAttr.split(';');
            let newStyles: string = '';

            for (let j: number = 0; j < styles.length; j++) {
                const style: string = styles[(j as number)].trim();
                if (!style) { continue; }

                const [property, value]: string[] = style.split(':').map((s: string) => s.trim());

                if (property.indexOf('mso-') === 0) { continue; }

                if (allowedStyles.indexOf(property) !== -1) {
                    newStyles += `${property}: ${value}; `;
                }
            }

            if (newStyles) {
                elementsWithStyle[(i as number)].setAttribute('style', newStyles.trim());
            } else {
                elementsWithStyle[(i as number)].removeAttribute('style');
            }
        }
    }

    private processTables(element: HTMLElement): void {
        const tables: NodeListOf<HTMLTableElement> = element.querySelectorAll('table') as NodeListOf<HTMLTableElement>;
        for (let i: number = 0; i < tables.length; i++) {
            this.sanitizeTableElement(tables[i as number]);
        }
    }

    private sanitizeTableElement(table: HTMLTableElement): void {
        table.classList.add('e-blockeditor-table');
        // Remove unwanted attributes
        const attrs: string[] = ['border', 'cellpadding', 'cellspacing', 'width', 'height', 'style'];
        attrs.forEach((attr: string) => { if (table.hasAttribute(attr)) { table.removeAttribute(attr); } });

        // Remove colgroup/col sizing; our TableService will manage widths
        const colgroups: NodeListOf<HTMLElement> = table.querySelectorAll('colgroup, col') as any;
        for (let i: number = 0; i < colgroups.length; i++) { colgroups[i as number].parentElement.removeChild(colgroups[i as number]); }

        const cells: NodeListOf<HTMLTableCellElement> = table.querySelectorAll('td, th') as NodeListOf<HTMLTableCellElement>;
        for (let j: number = 0; j < cells.length; j++) {
            const cell: HTMLTableCellElement = cells[j as number];
            // Remove spans unsupported by editor
            cell.removeAttribute('rowspan');
            cell.removeAttribute('colspan');
            // Remove unwanted attributes/styles
            ['width', 'height', 'style'].forEach((attr: string) => { if (cell.hasAttribute(attr)) { cell.removeAttribute(attr); } });
            // Ensure minimal content wrapper
            if (cell.textContent.trim() === '' && !cell.querySelector('img') && !cell.querySelector('.e-table-cell-host')) {
                cell.innerHTML = '<p><br/></p>';
            }
        }
    }

    private cleanupLists(element: HTMLElement): void {
        this.cleanList(element, 'UL');

        this.cleanList(element, 'OL');

        this.convertWordListParagraphs(element);
    }

    private cleanList(element: HTMLElement, listTag: string): void {
        const replacableElem: NodeListOf<HTMLElement> = element.querySelectorAll(`${listTag} div`) as NodeListOf<HTMLElement>;
        for (let j: number = replacableElem.length - 1; j >= 0; j--) {
            const parentElem: Node = replacableElem[(j as number)].parentNode;
            while (replacableElem[(j as number)].firstChild) {
                parentElem.insertBefore(replacableElem[(j as number)].firstChild, replacableElem[(j as number)]);
            }
            const closestListElem: HTMLElement = this.findClosestListElem(replacableElem[(j as number)]);
            if (closestListElem) {
                this.insertAfter(replacableElem[(j as number)], closestListElem);
            }
        }
    }

    private findClosestListElem(listElem: HTMLElement): HTMLElement {
        let closestListElem: HTMLElement;
        while (!isNOU(listElem)) {
            listElem = !isNOU(listElem.closest('ul')) && listElem.tagName !== 'UL'
                ? listElem.closest('ul')
                : (listElem.tagName !== 'OL' ? listElem.closest('ol') : null);
            closestListElem = !isNOU(listElem) ? listElem : closestListElem;
        }
        return closestListElem;
    }

    private insertAfter(newNode: Element, referenceNode: Element): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    private convertWordListParagraphs(element: HTMLElement): void {
        const listParagraphs: NodeListOf<HTMLElement> = element.querySelectorAll('p[style*="mso-list"]') as NodeListOf<HTMLElement>;
        if (listParagraphs.length === 0) { return; }

        let currentList: HTMLElement = null;
        let currentListType: string = null;
        let currentLevel: number = 0;

        for (let i: number = 0; i < listParagraphs.length; i++) {
            const paragraph: HTMLElement = listParagraphs[(i as number)] as HTMLElement;

            let listType: string = 'ul';
            const textContent: string = paragraph.textContent.trim();
            if (/^\d+\./.test(textContent) || /^[a-zA-Z]\./.test(textContent) || /^[ivxIVX]+\./.test(textContent)) {
                listType = 'ol';
            }

            let level: number = 1;
            const styleAttr: string = paragraph.getAttribute('style');
            if (styleAttr) {
                const levelMatch: RegExpMatchArray = styleAttr.match(/level(\d+)/);
                if (levelMatch) {
                    level = parseInt(levelMatch[1], 10);
                }
            }
            let content: string = paragraph.innerHTML;
            content = content.replace(/^[\s\u00A0]*(?:\d+\.|\w\.|\u2022|\u25CF|\u25CB|\u25A0|\u25A1)[\s\u00A0]+/, '');

            if (!currentList || currentListType !== listType || level < currentLevel) {
                currentList = document.createElement(listType);
                currentListType = listType;
                paragraph.parentNode.insertBefore(currentList, paragraph);
            }

            const listItem: HTMLElement = document.createElement('li');
            listItem.innerHTML = content;
            currentList.appendChild(listItem);

            currentLevel = level;
            paragraph.parentNode.removeChild(paragraph);
        }
    }

    private processImages(element: HTMLElement): void {
        const images: NodeListOf<HTMLImageElement> = element.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
        for (let i: number = 0; i < images.length; i++) {
            const img: HTMLImageElement = images[(i as number)];

            img.classList.add('e-blockeditor-pasted-img');

            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', 'Pasted image');
            }
        }
    }

    private cleanupCssPatterns(root: HTMLElement): void {
        const walker: TreeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node: Text) => {
                const text: string = node.textContent.trim();
                const isInlineStyle: RegExpMatchArray = text.match(/^\s*(ol|ul|li)[\s\S]*?\{[\s\S]*?\}/i);
                return isInlineStyle ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });

        const nodesToRemove: Text[] = [];
        while (walker.nextNode()) {
            const node: Text = walker.currentNode as Text;
            nodesToRemove.push(node);
        }

        for (const node of nodesToRemove) {
            node.remove();
        }
    }

    private deniedTags(element: HTMLElement): HTMLElement {
        const deniedTags: string[] = this.parent.pasteCleanupSettings.deniedTags;

        for (let i: number = 0; i < deniedTags.length; i++) {
            const removableElements: NodeListOf<HTMLElement> = element.querySelectorAll(deniedTags[i as number]) as NodeListOf<HTMLElement>;

            for (let j: number = removableElements.length - 1; j >= 0; j--) {
                const parentElem: Node = removableElements[(j as number)].parentNode;

                while (removableElements[(j as number)].firstChild) {
                    parentElem.insertBefore(removableElements[(j as number)].firstChild, removableElements[(j as number)]);
                }

                parentElem.removeChild(removableElements[(j as number)]);
            }
        }

        return element;
    }

    private deniedAttributes(element: HTMLElement, clean: boolean): HTMLElement {
        const deniedAttrs: string[] = clean ? ['style', 'class'] : this.parent.pasteCleanupSettings.deniedTags;

        for (let i: number = 0; i < deniedAttrs.length; i++) {
            const elementsWithAttr: NodeListOf<HTMLElement> = (element
                .querySelectorAll(`[${deniedAttrs[(i as number)]}]`) as NodeListOf<HTMLElement>);
            for (let j: number = 0; j < elementsWithAttr.length; j++) {
                elementsWithAttr[(j as number)].removeAttribute(deniedAttrs[(i as number)]);
            }
        }

        return element;
    }

    private allowedStyle(element: HTMLElement): HTMLElement {
        const allowedStyles: string[] = this.parent.pasteCleanupSettings.allowedStyles;
        const styleElements: NodeListOf<HTMLElement> = element.querySelectorAll('[style]') as NodeListOf<HTMLElement>;

        for (let i: number = 0; i < styleElements.length; i++) {
            let allowedStyleValue: string = '';
            const styleValue: string[] = styleElements[(i as number)].getAttribute('style').split(';');

            for (let j: number = 0; j < styleValue.length; j++) {
                const stylePair: string = styleValue[(j as number)].trim();
                if (!stylePair) { continue; }

                const [property]: string[] = stylePair.split(':').map((s: string) => s.trim());

                if (allowedStyles.indexOf(property) !== -1) {
                    allowedStyleValue += stylePair + ';';
                }
            }

            styleElements[(i as number)].removeAttribute('style');
            if (allowedStyleValue) {
                styleElements[(i as number)].setAttribute('style', allowedStyleValue);
            }
        }

        return element;
    }

    private detachInlineElements(element: HTMLElement): void {
        for (let i: number = 0; i < ClipboardCleanupModule.inlineNode.length; i++) {
            const inlineElements: NodeListOf<HTMLElement> = element.querySelectorAll(
                ClipboardCleanupModule.inlineNode[(i as number)]
            ) as NodeListOf<HTMLElement>;

            for (let j: number = 0; j < inlineElements.length; j++) {
                const parentElem: HTMLElement = inlineElements[(j as number)].parentElement;

                if (!parentElem) { continue; }

                while (inlineElements[(j as number)].firstChild) {
                    parentElem.insertBefore(inlineElements[(j as number)].firstChild, inlineElements[(j as number)]);
                }

                parentElem.removeChild(inlineElements[(j as number)]);
            }
        }
    }

    private getTextContent(element: HTMLElement): void {
        for (let i: number = 0; i < ClipboardCleanupModule.blockNode.length; i++) {
            const blockElements: NodeListOf<HTMLElement> = element.querySelectorAll(
                ClipboardCleanupModule.blockNode[(i as number)]
            ) as NodeListOf<HTMLElement>;

            for (let j: number = 0; j < blockElements.length; j++) {
                const paragraph: HTMLElement = document.createElement('p');
                paragraph.textContent = blockElements[(j as number)].textContent;
                blockElements[(j as number)].parentNode.replaceChild(paragraph, blockElements[(j as number)]);
            }
        }
        const allElements: NodeListOf<HTMLElement> = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < allElements.length; i++) {
            const attributes: NamedNodeMap = allElements[(i as number)].attributes;
            for (let j: number = attributes.length - 1; j >= 0; j--) {
                allElements[(i as number)].removeAttribute(attributes[(j as number)].name);
            }
        }
    }
}
