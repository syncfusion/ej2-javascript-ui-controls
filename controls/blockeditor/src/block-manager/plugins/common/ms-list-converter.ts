import { createElement, isNullOrUndefined as isNOU, detach, addClass, Browser } from '@syncfusion/ej2-base';
import { ClipboardCleanupModule } from './clipboard-cleanup';

/**
 * List item properties for the list conversion in MS Word cleanup
 *
 * @private
 * @hidden
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

export class WordListConverter {
    private parent: ClipboardCleanupModule;
    private upperRomanNumber: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
        'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
    private lowerRomanNumber: string[] = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix',
        'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];
    private lowerGreekNumber: string[] = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ',
        'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
    private listContents: string[] = [];

    constructor(cleanupModule: ClipboardCleanupModule) {
        this.parent = cleanupModule;
    }

    /**
     * Converts MS Word list nodes to standard HTML lists
     *
     * @param {Element[]} listNodes - Array of list nodes to convert
     * @returns {void} - No return value
     * @hidden
     */
    public convertListNodes(listNodes: Element[]): void {
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
        if (firstChild.childNodes.length > 0) {
            //Add to support separate list which looks like same list and also to add all tags as it is inside list
            this.handleTextList(element, firstChild);
        }
        this.listContents.push(element.innerHTML);
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
        listOrderElement = isEmptyMarkerSpan ? firstChild : listOrderElement;
        if (!isNOU(listOrderElement)) {
            let textContent: string = listOrderElement.textContent.trim();
            if (isEmptyMarkerSpan) {
                textContent = this.extractBulletMarker(listOrderElement, textContent);
            }
            this.listContents.push(textContent);
            if (!isEmptyMarkerSpan) {
                detach(listOrderElement);
            }
            this.parent.removeComments(element as HTMLElement);
            this.parent.removeUnwantedElements(element as HTMLElement);
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

}
