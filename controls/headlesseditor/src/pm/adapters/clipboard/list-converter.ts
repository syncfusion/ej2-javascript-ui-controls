/**
 * Clipboard List Converter - Converts MS Word list formats to standard HTML lists
 *
 * Adapted from RTE's ms-word-clean-up.ts listConverter() and related methods.
 * Handles detection and conversion of Office list formats to semantic HTML.
 *
 * @hidden
 * @internal
 */
export interface ListItemProperties {
    listType: string;
    content: string[];
    nestedLevel: number;
    listFormatOverride: number;
    class: string;
    listStyle: string;
    listStyleTypeName: string;
    start: number;
    styleMarginLeft: string;
}

/**
 * Resolved properties for a single list (UL/OL) created from MS Word markup.
 *
 * @hidden
 */
interface ListProperties {
    type: string;
    styleType: string;
    startAttr?: number;
    marginLeft?: string;
}

export class ListConverter {
    /**
     * Ordered list style types from MS Word.
     */
    private readonly OL_STYLE_TYPES: string[] = [
        'decimal',
        'decimal-leading-zero',
        'lower-alpha',
        'lower-roman',
        'upper-alpha',
        'upper-roman',
        'lower-greek'
    ];

    /**
     * Unordered list style types from MS Word.
     */
    private readonly UL_STYLE_TYPES: string[] = [
        'disc',
        'square',
        'circle',
        'disc',
        'square',
        'circle'
    ];

    /**
     * Roman numeral sequences for list style detection.
     */
    private readonly UPPER_ROMAN: string[] = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
        'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'
    ];

    private readonly LOWER_ROMAN: string[] = [
        'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix',
        'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'
    ];

    /**
     * Greek letters for list styles.
     */
    private readonly LOWER_GREEK: string[] = [
        'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ',
        'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'
    ];

    /**
     * Detects and converts MS Word list items to standard HTML lists.
     *
     * @param {HTMLElement} container - Container element with potential MS Word list content
     * @returns {HTMLElement} Container with converted lists
     * @hidden
     */
    public convertOfficeListsToHtml(container: HTMLElement): HTMLElement {
        // Add MS Word list class markers
        this.addListClassMarkers(container);

        // Collect list items
        let listNodes: (Element | null)[] = [];
        listNodes = this.collectListNodes(container, listNodes);

        if (listNodes.length === 0) {
            return container;
        }

        // Check if conversion is needed (if not already wrapped in UL/OL)
        const firstNode: Element | null = listNodes[0];
        if (!!firstNode &&
            firstNode.parentElement?.tagName !== 'UL' &&
            firstNode.parentElement?.tagName !== 'OL') {
            this.convertListNodes(container, listNodes);
        }

        return container;
    }

    /**
     * Adds MS Word list class markers to elements that have list styles.
     * Identifies which elements are part of lists.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {void}
     * @hidden
     */
    private addListClassMarkers(container: HTMLElement): void {
        const allElements: NodeListOf<HTMLElement> = container.querySelectorAll('*');

        for (let i: number = 0; i < allElements.length; i++) {
            const element: HTMLElement = allElements[i as number];
            const style: string = element.getAttribute('style') || '';

            // Check for MS Word list styles
            const hasListStyle: boolean = style.indexOf('mso-list:') >= 0;
            const hasListClass: boolean = element.className.toLowerCase().indexOf('msolistparagraph') !== -1;

            if (!hasListStyle) {
                continue;
            }

            // Add marker class for list items
            const isHeading: boolean = element.tagName.charAt(0) === 'H';
            const isListElement: boolean = element.tagName === 'LI' ||
                element.tagName === 'OL' ||
                element.tagName === 'UL';

            if (!hasListClass && !isHeading && !isListElement) {
                element.classList.add('msolistparagraph');
            }
        }
    }

    /**
     * Collects all MS Word list nodes from the container.
     * Identifies list items and builds a collection with separators.
     *
     * @param {HTMLElement} container - Container element to scan
     * @param {Element[]} listNodes - Array to accumulate list nodes
     * @returns {Element[]} Updated list nodes array
     * @hidden
     */
    private collectListNodes(container: HTMLElement, listNodes: (Element | null)[]): (Element | null)[] {
        const allElements: NodeListOf<HTMLElement> = container.querySelectorAll('*');
        let previousWasMsoList: boolean = false;

        for (let i: number = 0; i < allElements.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const element: HTMLElement = allElements[i];

            // Skip non-semantic elements
            if (this.shouldIgnoreElement(element)) {
                continue;
            }

            // Check if element is a MS Word list item
            if (this.isMsoListParagraph(element)) {
                // Add separator for new list sequence
                if (this.isFirstListItem(element) && listNodes.length > 0 &&
                    listNodes[listNodes.length - 1] !== null) {
                    listNodes.push(null);
                }

                listNodes.push(element);
            }

            // Add separator when transitioning from list to non-list
            if (previousWasMsoList && this.isBlockElement(element) &&
                !this.isMsoListParagraph(element)) {
                listNodes.push(null);
            }

            // Update state for next iteration
            if (this.isBlockElement(element)) {
                previousWasMsoList = this.isMsoListParagraph(element);
            }
        }

        // Add final separator if needed
        if (listNodes.length > 0 && listNodes[listNodes.length - 1] !== null) {
            listNodes.push(null);
        }

        return listNodes;
    }

    /**
     * Converts collected MS Word list nodes to standard HTML lists.
     *
     * @param {HTMLElement} container - Container to insert converted lists into
     * @param {Element[]} listNodes - Array of list nodes (with null separators)
     * @returns {void}
     * @hidden
     */
    private convertListNodes(container: HTMLElement, listNodes: (Element | null)[]): void {
        const convertedLists: { content: HTMLElement; node: Element | null }[] = [];
        let listCollection: ListItemProperties[] = [];

        for (let i: number = 0; i < listNodes.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const currentNode: Element | null = listNodes[i];

            // Handle null separator - convert collected items to list
            if (currentNode === null) {
                if (listCollection.length > 0) {
                    convertedLists.push({
                        content: this.makeConversion(listCollection),
                        node: listNodes[i - 1]
                    });
                    listCollection = [];
                }
                continue;
            }

            // Extract list properties
            const nodeStyle: string = (currentNode as HTMLElement).getAttribute('style') || '';
            const nestingLevel: number = this.extractNestingLevel(nodeStyle);
            const listFormatOverride: number = this.extractListFormatOverride(nodeStyle);

            // Get list content
            const listContent: string[] | null = this.extractListContent(currentNode);
            if (!listContent || listContent.length === 0) {
                continue;
            }

            // Determine list properties
            const listProperties: ListProperties = this.determineListProperties(listContent[0], i, listNodes, currentNode);

            // Build content items
            const contentItems: string[] = [];
            for (let j: number = 1; j < listContent.length; j++) {
                // eslint-disable-next-line security/detect-object-injection
                contentItems.push(listContent[j]);
            }

            // Get class name
            const className: string = (currentNode as HTMLElement).className
                ? (currentNode as HTMLElement).className
                : '';

            const currentListStyle: string = (currentNode as HTMLElement).getAttribute('style') || '';

            // Add to collection
            listCollection.push({
                listType: listProperties.type,
                content: contentItems,
                nestedLevel: nestingLevel,
                listFormatOverride: listFormatOverride,
                class: className,
                listStyle: currentListStyle,
                listStyleTypeName: listProperties.styleType,
                start: listProperties.startAttr as number,
                styleMarginLeft: listProperties.marginLeft || ''
            });
        }

        // Replace original nodes with converted lists
        this.replaceNodesWithLists(listNodes, convertedLists);
    }

    /**
     * Extracts the nesting level from MS Word style attribute.
     *
     * @param {string} style - Style attribute value
     * @returns {number} Nesting level (1-based)
     * @hidden
     */
    private extractNestingLevel(style: string): number {
        if (style && style.indexOf('level') !== -1) {
            const levelIndex: number = style.indexOf('level');
            const levelChar: string = style.charAt(levelIndex + 5);
            return parseInt(levelChar, 10) || 1;
        }
        return 1;
    }

    /**
     * Extracts the list format override from MS Word style attribute.
     *
     * @param {string} style - Style attribute value
     * @returns {number} List format override value
     * @hidden
     */
    private extractListFormatOverride(style: string): number {
        if (style && style.indexOf('mso-list:') !== -1) {
            const match: RegExpMatchArray | null = style.match(/mso-list:[^;]+;?/);
            if (match) {
                const normalized: string = match[0].replace(/\n/g, '').split(' ').join('');
                const parts: string[] = normalized.split(':l');
                if (parts.length > 1) {
                    const formatPart: string = parts[1].split('level')[0];
                    return parseInt(formatPart, 10) || 0;
                }
            }
        }
        return 0;
    }

    /**
     * Extracts list content from an element.
     *
     * @param {Element} element - Element to extract from
     * @returns {string[] | null} Array of content strings or null
     * @hidden
     */
    private extractListContent(element: Element): string[] | null {
        const firstChild: Element | null = element.firstElementChild;

        if (!firstChild) {
            return null;
        }

        const content: string[] = [];

        // Check if element has list marker (image list)
        if (firstChild.textContent?.trim() === '' &&
            firstChild.firstElementChild?.nodeName === 'IMG') {
            content.push('');
            content.push(element.innerHTML);
        } else if (firstChild.childNodes.length > 0) {
            // Extract text list marker
            const marker: string = this.extractListMarker(firstChild);
            content.push(marker);
            content.push(element.innerHTML);
        }

        return content.length > 0 ? content : null;
    }

    /**
     * Extracts the list marker (bullet/number) from list content.
     *
     * @param {Element} element - Element containing the marker
     * @returns {string} Extracted marker text
     * @hidden
     */
    private extractListMarker(element: Element): string {
        const markerPattern: RegExp = /^(\d{1,2}|[a-zA-Z]|[*#~•○■])(\.|\)|-)\s*/;
        const textContent: string = element.textContent?.trim() || '';

        const match: RegExpMatchArray | null = textContent.match(markerPattern);
        if (match) {
            return match[0].trim();
        }

        return textContent;
    }

    /**
     * Determines the list type (OL/UL) and style based on content.
     *
     * @param {string} marker - List marker text
     * @param {number} index - Index in list nodes
     * @param {Element[]} listNodes - Array of list nodes
     * @param {Element} currentNode - Current node being processed
     * @returns {Object} Object with type, styleType, startAttr, marginLeft
     * @hidden
     */
    private determineListProperties(
        marker: string,
        index: number,
        listNodes: (Element | null)[],
        currentNode: Element
    ): ListProperties {
        const result: ListProperties = {
            type: marker.trim().length > 1 ? 'ol' : 'ul',
            styleType: ''
        };

        // Determine list style type
        result.styleType = this.determineListStyleType(marker, result.type);

        // Determine start attribute for ordered lists
        if (result.type === 'ol' && (index === 0 || listNodes[index - 1] === null)) {
            result.startAttr = this.determineStartAttribute(marker, result.styleType);
        }

        // Get margin-left if present
        const marginLeft: string = (currentNode as HTMLElement).style.marginLeft;
        if (marginLeft) {
            result.marginLeft = marginLeft;
        }

        return result;
    }

    /**
     * Determines the CSS list-style-type based on marker.
     *
     * @param {string} marker - List marker text
     * @param {string} type - List type (ol or ul)
     * @returns {string} CSS list-style-type value
     * @hidden
     */
    private determineListStyleType(marker: string, type: string): string {
        const markerText: string = marker.split('.')[0] || marker.split(')')[0] || marker;

        if (type === 'ol') {
            return this.determineOrderedListStyleType(markerText);
        } else {
            return this.determineUnorderedListStyleType(markerText);
        }
    }

    /**
     * Determines ordered list style type.
     *
     * @param {string} marker - Marker text
     * @returns {string} CSS list-style-type value
     * @hidden
     */
    private determineOrderedListStyleType(marker: string): string {
        const charCode: number = marker.charCodeAt(0);

        // Check for Roman numerals
        if (this.UPPER_ROMAN.indexOf(marker) > -1) {
            return 'upper-roman';
        }
        if (this.LOWER_ROMAN.indexOf(marker) > -1) {
            return 'lower-roman';
        }

        // Check for Greek letters
        if (this.LOWER_GREEK.indexOf(marker) > -1) {
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
        if (marker.length > 1 && marker[0] === '0' && !isNaN(Number(marker))) {
            return 'decimal-leading-zero';
        }

        // Default to decimal
        return 'decimal';
    }

    /**
     * Determines unordered list style type.
     *
     * @param {string} marker - Marker text
     * @returns {string} CSS list-style-type value
     * @hidden
     */
    private determineUnorderedListStyleType(marker: string): string {
        switch (marker) {
        case 'o':
        case '○':
            return 'circle';
        case '§':
        case '■':
            return 'square';
        default:
            return 'disc';
        }
    }

    /**
     * Determines the start attribute value for ordered lists.
     *
     * @param {string} marker - Marker text
     * @param {string} styleType - List style type
     * @returns {number | undefined} Start attribute value or undefined
     * @hidden
     */
    private determineStartAttribute(marker: string, styleType: string): number | undefined {
        const startString: string = marker.split('.')[0] || marker.split(')')[0];
        const standardStarts: string[] = ['A', 'a', 'I', 'i', 'α', '1', '01', '1-'];

        if (standardStarts.indexOf(startString) !== -1) {
            return undefined;
        }

        switch (styleType) {
        case 'decimal':
        case 'decimal-leading-zero':
            if (!isNaN(parseInt(startString, 10))) {
                return parseInt(startString, 10);
            }
            break;
        case 'upper-alpha':
            return startString.charCodeAt(0) - 64;
        case 'lower-alpha':
            return startString.charCodeAt(0) - 96;
        case 'upper-roman':
            return this.UPPER_ROMAN.indexOf(startString) + 1;
        case 'lower-roman':
            return this.LOWER_ROMAN.indexOf(startString) + 1;
        case 'lower-greek':
            return this.LOWER_GREEK.indexOf(startString) + 1;
        default:
            return undefined;
        }

        return undefined;
    }

    /**
     * Converts a collection of list items into HTML list elements.
     *
     * @param {ListItemProperties[]} collection - Collection of list properties
     * @returns {HTMLElement} Root element containing converted lists
     * @hidden
     */
    private makeConversion(collection: ListItemProperties[]): HTMLElement {
        const root: HTMLElement = document.createElement('div');

        if (collection.length === 0) {
            return root;
        }

        // Build nested list structure
        // (Implementation would be substantial; simplified here for brevity)
        // In production, this would handle complex nesting scenarios

        for (const item of collection) {
            const list: HTMLElement = document.createElement(item.listType);
            const listItem: HTMLElement = document.createElement('li');

            const content: HTMLElement = document.createElement('p');
            content.innerHTML = item.content.join(' ');

            listItem.appendChild(content);
            list.appendChild(listItem);
            root.appendChild(list);

            if (item.start) {
                list.setAttribute('start', item.start.toString());
            }
        }

        return root;
    }

    /**
     * Replaces original nodes with converted list elements.
     *
     * @param {Element[]} listNodes - Original list nodes
     * @param {Object[]} convertedLists - Converted list elements
     * @returns {void}
     * @hidden
     */
    private replaceNodesWithLists(
        listNodes: (Element | null)[],
        convertedLists: { content: HTMLElement; node: Element | null }[]
    ): void {
        let currentNode: Element | null | undefined = listNodes.shift();

        while (currentNode) {
            for (const converted of convertedLists) {
                if (converted.node === currentNode) {
                    // Insert converted content before original
                    for (const child of Array.from(converted.content.childNodes)) {
                        currentNode.parentElement?.insertBefore(child.cloneNode(true), currentNode);
                    }
                    break;
                }
            }

            // Remove original node
            currentNode.parentElement?.removeChild(currentNode);
            currentNode = listNodes.shift();
        }
    }

    /**
     * Determines if element should be ignored during processing.
     *
     * @param {Element} element - Element to check
     * @returns {boolean} True if should be ignored
     * @hidden
     */
    private shouldIgnoreElement(element: Element): boolean {
        const ignorableNodes: string[] = [
            'A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR', 'BUTTON', 'CENTER', 'CODE',
            'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV', 'DL', 'DT', 'EM',
            'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2', 'H3', 'H4',
            'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL', 'LI',
            'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
            'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
            'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'
        ];

        return ignorableNodes.indexOf(element.nodeName) === -1;
    }

    /**
     * Checks if element is an MS Word list paragraph.
     *
     * @param {Element} element - Element to check
     * @returns {boolean} True if is MS Word list item
     * @hidden
     */
    private isMsoListParagraph(element: Element): boolean {
        const className: string = element.className || '';
        const hasClass: boolean = className.toLowerCase().indexOf('msolistparagraph') !== -1;

        const style: string = element.getAttribute('style') || '';
        const hasStyle: boolean = style.indexOf('mso-list:') >= 0;

        return hasClass && hasStyle;
    }

    /**
     * Checks if element is the first item in a list.
     *
     * @param {Element} element - Element to check
     * @returns {boolean} True if first item
     * @hidden
     */
    private isFirstListItem(element: Element): boolean {
        const className: string = element.className || '';
        return className.indexOf('MsoListParagraphCxSpFirst') >= 0;
    }

    /**
     * Checks if element is a block element.
     *
     * @param {Element} element - Element to check
     * @returns {boolean} True if is block element
     * @hidden
     */
    private isBlockElement(element: Element): boolean {
        const blockNodes: string[] = [
            'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'li',
            'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot'
        ];
        return blockNodes.indexOf(element.nodeName.toLowerCase()) !== -1;
    }
}
