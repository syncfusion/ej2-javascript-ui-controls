/**
 * Defines common util methods used by Rich Text Editor.
 */
import { isNullOrUndefined, Browser, removeClass, closest, createElement, detach } from '../../../base'; /*externalscript*/
import { IToolbarStatus } from './interface';
import { CLS_AUD_FOCUS, CLS_IMG_FOCUS, CLS_RESIZE, CLS_RTE_DRAG_IMAGE, CLS_TABLE_MULTI_CELL, CLS_TABLE_SEL, CLS_TABLE_SEL_END, CLS_VID_FOCUS } from './constant';
import { IsFormatted } from '../editor-manager/plugin/isformatted';

/**
 * @returns {boolean} - returns boolean value
 * @hidden
 */
export function isIDevice(): boolean {
    let result: boolean = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}

/**
 * @param {Element} editableElement - specifies the editable element.
 * @param {string} selector - specifies the string values.
 * @returns {void}
 * @hidden
 */
export function setEditFrameFocus(editableElement: Element, selector: string): void {
    if (editableElement.nodeName === 'BODY' && !isNullOrUndefined(selector)) {
        const iframe: HTMLIFrameElement = <HTMLIFrameElement>top.window.document.querySelector(selector);
        if (!isNullOrUndefined(iframe)) {
            iframe.contentWindow.focus();
        }
    }
}

/**
 * @param {string} value - specifies the string value
 * @returns {void}
 * @hidden
 */
export function updateTextNode(value: string): string {
    const resultElm: HTMLElement = document.createElement('div');
    resultElm.innerHTML = value;
    const tableElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('table');
    for (let i: number = 0; i < tableElm.length; i++) {
        if (tableElm[i as number].classList.length > 0 &&
        !tableElm[i as number].classList.contains('e-rte-table') && !tableElm[i as number].classList.contains('e-rte-custom-table')) {
            tableElm[i as number].classList.add('e-rte-paste-table');
            if (tableElm[i as number].classList.contains('e-rte-paste-word-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-word-table');
                continue; // Skiping the removal of the border if the source is from word.
            } else if (tableElm[i as number].classList.contains('e-rte-paste-excel-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-excel-table');
                if (tableElm[i as number].getAttribute('border') === '0') {
                    tableElm[i as number].removeAttribute('border');
                }
                const tdElm: NodeListOf<HTMLElement> = tableElm[i as number].querySelectorAll('td');
                for (let j: number = 0; j < tdElm.length; j++) {
                    if (tdElm[j as number].style.borderLeft === 'none') {
                        tdElm[j as number].style.removeProperty('border-left');
                    }
                    if (tdElm[j as number].style.borderRight === 'none') {
                        tdElm[j as number].style.removeProperty('border-right');
                    }
                    if (tdElm[j as number].style.borderBottom === 'none') {
                        tdElm[j as number].style.removeProperty('border-bottom');
                    }
                    if (tdElm[j as number].style.borderTop === 'none') {
                        tdElm[j as number].style.removeProperty('border-top');
                    }
                    if (tdElm[j as number].style.border === 'none') {
                        tdElm[j as number].style.removeProperty('border');
                    }
                }
            } else if (tableElm[i as number].classList.contains('e-rte-paste-onenote-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-onenote-table');
                continue;
            } else if (tableElm[i as number].classList.contains('e-rte-paste-html-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-html-table');
                continue;
            }
        }
    }
    const imageElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('img');
    for (let i: number = 0; i < imageElm.length; i++) {
        if ((imageElm[i as number] as HTMLImageElement).classList.contains('e-rte-image-unsupported')) {
            continue; // Should not add the class if the image is Broken.
        }
        if (!imageElm[i as number].classList.contains('e-rte-image')) {
            imageElm[i as number].classList.add('e-rte-image');
        }
        if (!(imageElm[i as number].classList.contains('e-imginline') ||
        imageElm[i as number].classList.contains('e-imgbreak'))) {
            imageElm[i as number].classList.add('e-imginline');
        }
    }
    return resultElm.innerHTML;
}

/**
 * @param {Node} startChildNodes - specifies the node
 * @returns {void}
 * @hidden
 */
export function getLastTextNode(startChildNodes: Node): Node {
    let finalNode: Node = startChildNodes;
    do {
        if (finalNode.childNodes.length > 0) {
            finalNode = finalNode.childNodes[0];
        }
    }
    while (finalNode.childNodes.length > 0);
    return finalNode;
}

/**
 * @returns {void}
 * @hidden
 */
export function getDefaultHtmlTbStatus(): IToolbarStatus {
    return {
        bold: false,
        italic: false,
        subscript: false,
        superscript: false,
        strikethrough: false,
        orderedlist: false,
        unorderedlist: false,
        numberFormatList: false,
        bulletFormatList: false,
        underline: false,
        alignments: null,
        backgroundcolor: null,
        fontcolor: null,
        fontname: null,
        fontsize: null,
        formats: null,
        createlink: false,
        insertcode: false,
        blockquote: false,
        inlinecode: false,
        isCodeBlock: false
    };
}

/**
 * @returns {void}
 * @hidden
 */
export function getDefaultMDTbStatus(): IToolbarStatus {
    return {
        bold: false,
        italic: false,
        subscript: false,
        superscript: false,
        strikethrough: false,
        orderedlist: false,
        uppercase: false,
        lowercase: false,
        inlinecode: false,
        unorderedlist: false,
        formats: null
    };
}

/**
 * Checks if the node has any formatting
 *
 * @param {Node} node - specifies the node.
 * @param {IsFormatted} isFormatted - specifies the IsFormatted instance.
 * @returns {boolean} - returns whether the node has any formatting
 */
export function hasAnyFormatting(node: Node, isFormatted: IsFormatted = null): boolean {
    if (!node) {
        return false;
    }

    const nodeName: string = node.nodeName.toUpperCase();
    if (['TABLE', 'IMG', 'VIDEO', 'AUDIO'].indexOf(nodeName) !== -1) {
        return false;
    }

    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).hasAttribute('style')) {
        return true;
    }

    if (!isFormatted) {
        isFormatted = new IsFormatted();
    }

    const semanticFormats: string[] = [
        'bold', 'italic', 'underline', 'strikethrough',
        'superscript', 'subscript', 'fontcolor', 'fontname',
        'fontsize', 'backgroundcolor', 'inlinecode'
    ];

    for (const format of semanticFormats) {
        if (isFormatted.isFormattedNode(node, format)) {
            return true;
        }
    }

    for (let i: number = 0; i < node.childNodes.length; i++) {
        if (hasAnyFormatting(node.childNodes[i as number], isFormatted)) {
            return true;
        }
    }
    return false;
}

/**
 * @param {Range} range - specifies the range
 * @param {Node} parentNode - specifies the parent node
 * @returns {void}
 * @hidden
 */
export function nestedListCleanUp(range: Range , parentNode: Node): void {
    if (range.startContainer.parentElement.closest('ol,ul') !== null && range.endContainer.parentElement.closest('ol,ul') !== null) {
        range.extractContents();
        const liElem: NodeListOf<HTMLLIElement> = (range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('li');
        if (liElem.length > 0) {
            liElem.forEach((item: HTMLLIElement) => {
                if (!isNullOrUndefined(item.firstChild) && (item.firstChild.nodeName === 'OL' || item.firstChild.nodeName === 'UL')){
                    item.style.listStyleType = 'none';
                }
                if (item.innerHTML.trim() === '' && item !== parentNode) {
                    item.remove();
                }
                const parentLi: Element = parentNode.nodeName === 'LI' ? parentNode as HTMLElement : closest(parentNode as HTMLElement, 'li');
                // Only remove if the list item is empty and not the parent's list item
                if (item.textContent.trim() === '' && item !== parentLi) {
                    item.remove();
                }
            });
        }
    }
}

/**
 * Method to scroll the content to the cursor position
 *
 * @param {Document} document - specifies the document.
 * @param {HTMLElement | HTMLBodyElement} inputElement - specifies the input element.
 * @returns {void}
 */
export function scrollToCursor(
    document: Document, inputElement: HTMLElement | HTMLBodyElement) : void {
    const rootElement: HTMLElement = inputElement.nodeName === 'BODY' ?
        inputElement.ownerDocument.defaultView.frameElement.closest('.e-richtexteditor') as HTMLElement :
        inputElement.closest('.e-richtexteditor') as HTMLElement;
    const height: string = rootElement.style.height;
    if (document.getSelection().rangeCount === 0) {
        return;
    }
    const range: Range = document.getSelection().getRangeAt(0);
    const finalFocusElement: HTMLElement = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement as HTMLElement :
        range.startContainer as HTMLElement;
    const rect: DOMRect = finalFocusElement.getBoundingClientRect() as DOMRect;
    const cursorTop: number = rect.top;
    const cursorBottom: number = rect.bottom;
    const rootRect : DOMRect = rootElement.getBoundingClientRect() as DOMRect;
    const hasMargin: boolean = rootElement.querySelectorAll('.e-count-enabled, .e-resize-enabled').length > 0;
    if (inputElement.nodeName === 'BODY') {
        if (height === 'auto') {
            if (window.innerHeight < cursorTop) {
                finalFocusElement.scrollIntoView(false);
            }
        } else {
            if (cursorTop > inputElement.getBoundingClientRect().height || cursorBottom > rootRect.bottom) {
                finalFocusElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
        }
    } else {
        if (height === 'auto') {
            if (window.innerHeight < cursorTop) {
                finalFocusElement.scrollIntoView({ block: 'end', inline: 'nearest' });
            }
        } else {
            if (cursorBottom > rootRect.bottom) {
                rootElement.querySelector('.e-rte-content').scrollTop += (cursorBottom - rootRect.bottom) + (hasMargin ? 20 : 0);
            }
        }
    }
    const scrollVal: HTMLElement = inputElement.closest('div[style*="overflow-y: scroll"]') as HTMLElement;
    if (!isNullOrUndefined(scrollVal)) {
        const parentRect: DOMRect = scrollVal.getBoundingClientRect() as DOMRect;
        if (cursorBottom > parentRect.bottom) {
            scrollVal.scrollTop += (cursorBottom - parentRect.bottom);
        }
    }
}

/**
 * Inserts items at a specific index in an array.
 *
 * @template T
 * @param {Array<T>} oldArray - Specifies the old array.
 * @param {Array<T>} newArray - Specifies the elements to insert.
 * @param {number} indexToInsert - Specifies the index to insert.
 * @returns {Array<T>} - Returns the array after inserting the elements.
 */
export function insertItemsAtIndex<T>(oldArray: Array<T>, newArray: Array<T>, indexToInsert: number): Array<T> {
    // This is a work around for ES6 ...spread operator usage.
    // Usecase: When a new array is inserted into an existing array at a specific index.
    for (let i: number = 0; i < newArray.length; i++) {
        if (i === 0) {
            oldArray.splice(indexToInsert + i, 1, newArray[i as number]);
        } else {
            oldArray.splice(indexToInsert + i, 0, newArray[i as number]);
        }
    }
    return oldArray;
}

/**
 * Wrapper function to remove a class from the element and remove the attribute if the class is empty.
 *
 * @param  {Element[]|NodeList} elements - An array of elements that need to remove a list of classes
 * @param  {string|string[]} classes - String or array of string that need to add an individual element as a class
 *
 * @returns {Element[]|NodeList} - Returns the array of elements after removing the class.
 * @private
 */
export function removeClassWithAttr(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
    removeClass(elements, classes);
    for (let i: number = 0; i < elements.length; i++) {
        if ((elements[i as number] as Element).classList.length === 0 && (elements[i as number] as Element).getAttribute('class')) {
            (elements[i as number] as Element).removeAttribute('class');
        }
    }
    return elements;
}

/**
 * Creates a two-dimensional array mapping the logical structure of a table.
 *
 * @private
 * @param  {HTMLTableElement} table - The HTMLTableElement to process.
 * @returns {Array.<Array.<HTMLElement>>} A 2D matrix of table cells accounting for colspan and rowspan.
 * @hidden
 */
export function getCorrespondingColumns(table: HTMLTableElement): HTMLElement[][] {
    const elementArray: HTMLElement[][] = [];
    const allRows: HTMLCollectionOf<HTMLTableRowElement> = table.rows;
    for (let i: number = 0; i <= allRows.length - 1; i++) {
        const currentRow: HTMLElement = allRows[i as number];
        let columnIndex: number = 0;
        for (let j: number = 0; j <= currentRow.children.length - 1; j++) {
            const currentCell: Element = currentRow.children[j as number];
            const cellColspan: number = parseInt(currentCell.getAttribute('colspan'), 10) || 1;
            const cellRowspan: number = parseInt(currentCell.getAttribute('rowspan'), 10) || 1;
            columnIndex = mapCellToMatrixPositions(
                elementArray,
                currentCell as HTMLElement,
                i,
                columnIndex,
                cellColspan,
                cellRowspan
            );
            columnIndex += cellColspan;
        }
    }
    return elementArray;
}

/**
 * Maps a cell to all its positions in the logical table matrix.
 *
 * @param {Array.<Array.<HTMLElement>>} matrix - The 2D matrix being constructed.
 * @param {HTMLElement} cell - The current cell being placed.
 * @param {number} startRow - The row index where the cell starts.
 * @param  {number} startCol - The column index where the cell starts.
 * @param {number} colspan - The number of columns the cell spans.
 * @param {number} rowspan - The number of rows the cell spans.
 * @returns {number} - The adjusted starting column index for the next cell in the row.
 * @hidden
 */
export function mapCellToMatrixPositions(
    matrix: HTMLElement[][],
    cell: HTMLElement,
    startRow: number,
    startCol: number,
    colspan: number,
    rowspan: number
): number {
    for (let rowIndex: number = startRow; rowIndex < startRow + rowspan; rowIndex++) {
        if (!matrix[rowIndex as number]) {
            matrix[rowIndex as number] = [];
        }
        for (let colIndex: number = startCol; colIndex < startCol + colspan; colIndex++) {
            if (matrix[rowIndex as number][colIndex as number]) {
                startCol++;
            } else {
                matrix[rowIndex as number][colIndex as number] = cell;
            }
        }
    }
    return startCol;
}

/**
 * Finds the position of a specific cell element in the table matrix.
 *
 * @param {HTMLElement} cell - The HTML element to find in the table
 * @param {Array.<Array.<HTMLElement>>} allCells - The 2D array representing the table structure
 * @returns {number[]} An array containing the row and column indices [rowIndex, columnIndex], or empty array if not found
 * @hidden
 */
export function getCorrespondingIndex(cell: HTMLElement, allCells: HTMLElement[][]): number[] {
    for (let i: number = 0; i < allCells.length; i++) {
        for (let j: number = 0; j < allCells[i as number].length; j++) {
            if (allCells[i as number][j as number] === cell) {
                return [i, j];
            }
        }
    }
    return [];
}

/**
 * Inserts a <colgroup> with calculated sizes to the table.
 * This function analyzes the table structure and adds appropriate column definitions
 * with width values based on the current table layout.
 *
 * @param {HTMLTableElement} curTable - The table element to add colgroup to table.
 * @param {boolean} hasUpdate - Flag indicating whether to update existing colgroup (default: false)
 * @returns {void}
 * @hidden
 */
export function insertColGroupWithSizes(curTable: HTMLTableElement, hasUpdate: boolean = false): void {
    if (!curTable) {
        return;
    }
    const colGroup: HTMLTableColElement | null = getColGroup(curTable);
    if (!colGroup || hasUpdate) {
        const cellCount: number = getMaxCellCount(curTable);
        const sizes: number[] = new Array(cellCount);
        const colGroupEle: HTMLElement = createElement('colgroup');
        const rowSpanCells: Map<string, HTMLTableDataCellElement> = new Map();
        for (let i: number = 0; i < curTable.rows.length; i++) {
            let currentColIndex: number = 0;
            for (let k: number = 0; k < curTable.rows[i as number].cells.length; k++) {
                for (let l: number = 1; l < curTable.rows[i as number].cells[k as number].rowSpan; l++) {
                    const key: string = '' + (i + l) + currentColIndex;
                    rowSpanCells.set(key, curTable.rows[i as number].cells[k as number]);
                }
                const cellIndex: number = getCellIndex(rowSpanCells, i, k);
                if (cellIndex > currentColIndex) {
                    currentColIndex = cellIndex;
                }
                const width: number = curTable.rows[i as number].cells[k as number].offsetWidth;
                if (!sizes[currentColIndex as number] || width < sizes[currentColIndex as number]) {
                    sizes[currentColIndex as number] = width;
                }
                currentColIndex += 1 + curTable.rows[i as number].cells[k as number].colSpan - 1;
            }
        }
        for (let size: number = 0; size < sizes.length; size++) {
            const cell: HTMLElement = createElement('col');
            cell.appendChild(createElement('br'));
            cell.style.width = convertPixelToPercentage(sizes[size as number], parseInt(getComputedStyle(curTable).width, 10)) + '%';
            colGroupEle.appendChild(cell);
        }
        if (hasUpdate) {
            const colGroup: HTMLTableColElement | null = getColGroup(curTable);
            if (colGroup) {
                detach(colGroup);
            }
        }
        curTable.insertBefore(colGroupEle, curTable.firstChild);
        for (let rowIndex: number = 0; rowIndex < curTable.rows.length; rowIndex++) {
            const row: HTMLTableRowElement = curTable.rows[rowIndex as number];
            for (let cellIndex: number = 0; cellIndex < row.cells.length; cellIndex++) {
                const cell: HTMLTableCellElement = row.cells[cellIndex as number];
                cell.style.width = '';
            }
        }
        if (isNullOrUndefined((curTable as HTMLElement).style.width) || (curTable as HTMLElement).style.width === '') {
            (curTable as HTMLElement).style.width = (curTable as HTMLElement).offsetWidth + 'px';
        }
    }
}

/**
 * Gets the colgroup element from a table
 *
 * @param {HTMLTableElement} table - The table element to search in
 * @returns {HTMLTableColElement | null} The colgroup element or null if not found
 * @hidden
 */
export function getColGroup(table: HTMLTableElement): HTMLTableColElement | null {
    if (!table || !table.children) {
        return null;
    }

    const colGroup: HTMLTableColElement | undefined = Array.from(table.children).find(
        (child: Element) => child.tagName === 'COLGROUP'
    ) as HTMLTableColElement | undefined;

    return colGroup || null;
}

/**
 * Gets the maximum cell count in a table, accounting for colspan attributes.
 * This function calculates the effective number of columns by examining all rows
 * and considering the colspan attribute of each cell.
 *
 * @param {HTMLTableElement} table - The table element to analyze
 * @returns {number} - The maximum number of cells/columns in the table
 * @hidden
 */
export function getMaxCellCount(table: HTMLTableElement): number {
    if (!table || !table.rows || table.rows.length === 0) {
        return 0;
    }
    const cellColl: HTMLCollectionOf<HTMLTableDataCellElement> = table.rows[0].cells;
    let cellCount: number = 0;
    for (let cell: number = 0; cell < cellColl.length; cell++) {
        cellCount += cellColl[cell as number].colSpan;
    }
    return cellCount;
}

/**
 * Recursively finds the correct column index for a cell, accounting for rowspan cells.
 * This function adjusts the column index by checking if there are any rowspan cells
 * from previous rows that occupy the current position.
 *
 * @param {Map<string, HTMLTableDataCellElement>} rowSpanCells - Map of rowspan cells with their positions
 * @param {number} rowIndex - Current row index
 * @param {number} colIndex - Initial column index to check
 * @returns {number} - The adjusted column index accounting for rowspan cells
 * @hidden
 */
export function getCellIndex(rowSpanCells: Map<string, HTMLTableDataCellElement>, rowIndex: number, colIndex: number): number {
    const cellKey: string = `${rowIndex}${colIndex}`;
    const spannedCell: HTMLTableDataCellElement = rowSpanCells.get(cellKey);
    if (spannedCell) {
        return getCellIndex(rowSpanCells, rowIndex, colIndex + spannedCell.colSpan);
    } else {
        return colIndex;
    }
}

/**
 * Converts a pixel measurement to a percentage relative to a container's width.
 * Used to maintain proper proportions when splitting cells.
 *
 * @param {number} value - The pixel value to convert
 * @param {number} offsetValue - The container width in pixels
 * @returns {number} The equivalent percentage value
 * @hidden
 */
export function convertPixelToPercentage(value: number, offsetValue: number): number {
    // Avoid division by zero
    if (offsetValue === 0) {
        return 0;
    }
    return (value / offsetValue) * 100;
}

/**
 * @param {string} value - specifies the string value
 * @param {string} editorMode - specifies the string value
 * @returns {string} - returns the string value
 * @hidden
 */
export function resetContentEditableElements(value: string, editorMode: string): string {
    if (editorMode && editorMode === 'HTML' && value) {
        const valueElementWrapper: HTMLElement = document.createElement('div');
        valueElementWrapper.innerHTML = value;
        valueElementWrapper.querySelectorAll('.e-img-inner').forEach((el: Element) => {
            el.setAttribute('contenteditable', 'true');
        });
        value = valueElementWrapper.innerHTML;
        valueElementWrapper.remove();
    }
    return value;
}

/**
 * @param {string} value - specifies the string value
 * @param {string} editorMode - specifies the string value
 * @returns {string} - returns the string value
 * @hidden
 */
export function cleanupInternalElements(value: string, editorMode: string): string {
    if (value && editorMode) {
        const valueElementWrapper: HTMLElement = document.createElement('div');
        if (editorMode === 'HTML') {
            valueElementWrapper.innerHTML = value;
            valueElementWrapper.querySelectorAll('.e-img-inner').forEach((el: Element) => {
                el.setAttribute('contenteditable', 'false');
            });
            const item: NodeListOf<Element> = valueElementWrapper.querySelectorAll('.e-column-resize, .e-row-resize, .e-table-box, .e-table-rhelper, .e-img-resize, .e-vid-resize');
            if (item.length > 0) {
                for (let i: number = 0; i < item.length; i++) {
                    detach(item[i as number]);
                }
            }
            removeSelectionClassStates(valueElementWrapper);
        } else {
            valueElementWrapper.textContent = value;
        }
        return (editorMode === 'Markdown') ? valueElementWrapper.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : valueElementWrapper.innerHTML;
    }
    return value;
}

/**
 * @param {HTMLElement} element - specifies the element
 * @returns {void}
 * @hidden
 */
export function removeSelectionClassStates(element: HTMLElement): void {
    const classNames: string[] = [CLS_IMG_FOCUS, CLS_TABLE_SEL,
        CLS_TABLE_MULTI_CELL, CLS_TABLE_SEL_END, CLS_VID_FOCUS,
        CLS_AUD_FOCUS, CLS_RESIZE, CLS_RTE_DRAG_IMAGE];
    for (let i: number = 0; i < classNames.length; i++) {
        const item: NodeListOf<Element> = element.querySelectorAll('.' + classNames[i as number]);
        removeClass(item, classNames[i as number]);
        if (item.length === 0) { continue; }
        for (let j: number = 0; j < item.length; j++) {
            if (item[j as number].classList.length === 0) {
                item[j as number].removeAttribute('class');
            }
            if ((item[j as number].nodeName === 'IMG' || item[j as number].nodeName === 'VIDEO') &&
                (item[j as number] as HTMLElement).style.outline !== '') {
                (item[j as number] as HTMLElement).style.outline = '';
            }
        }
    }
    element.querySelectorAll('[class=""]').forEach((el: Element) => {
        el.removeAttribute('class');
    });
}


/**
 * Processes the given inner HTML value and returns a structured HTML string.
 *
 * @param {string} innerValue - The inner HTML content to be processed.
 * @param {string} enterKey - The key used for inserting line breaks.
 * @param {boolean} enableHtmlEncode - A flag indicating whether HTML encoding should be enabled.
 * @returns {string} - The structured HTML string.
 */
export function getStructuredHtml(innerValue: string, enterKey: string, enableHtmlEncode: boolean): string {
    // Early return for special cases
    if (enableHtmlEncode || enterKey.toLowerCase() === 'br' || isNullOrUndefined(innerValue)) {
        return innerValue;
    }
    // Create a safe wrapper element for HTML manipulation
    const tempDiv: HTMLDivElement = document.createElement('div');
    tempDiv.innerHTML = innerValue;
    // Get parent element tag from configuration - whitelist for safety
    const allowedTags: string[] = ['div', 'p'];
    const parentElementLower: string = enterKey.toLowerCase();
    const parentElement: string = allowedTags.indexOf(parentElementLower) >= 0 ? parentElementLower : 'div';
    // Apply processing to the temporary div
    wrapTextAndInlineNodes(tempDiv, parentElement);
    // Extract and return processed HTML
    const value: string = tempDiv.innerHTML;
    tempDiv.remove();
    return value;
}
/**
 *
 * checks if tag is in set
 *
 * @param {Set<string>} set - The set to check for the tag.
 * @param {string} value - The tag to check for.
 *
 * @returns {boolean} - True if the tag is in the set, false otherwise.
 */
export function isInSet (set: Set<string>, value: string): boolean {
    const iterator: Iterator<string> = set.values();
    let current: IteratorResult<string> = iterator.next();
    while (!current.done) {
        if (current.value === value) {
            return true;
        }
        current = iterator.next();
    }
    return false;
}

/**
 *
 * Wraps text and inline nodes within a given node to ensure proper HTML structure.
 *
 * @param {Node} node - The DOM node whose child nodes are to be wrapped.
 * @param {string} parentElement - The parent element tag to use for wrapping.
 * @returns {void} - This function does not return anything.
 */
export function wrapTextAndInlineNodes(node: Node, parentElement: string): void {
    // Define HTML tag categories
    const recursiveBlockTags: Set<string> = new Set([
        'DIV', 'TH', 'TD', 'LI', 'BLOCKQUOTE', 'OL', 'UL',
        'TABLE', 'TBODY', 'TR', 'THEAD', 'TFOOT'
    ]);
    const blockTags: Set<string> = new Set([
        'DIV', 'P', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'ASIDE', 'NAV',
        'MAIN', 'FIGURE', 'FIGCAPTION', 'BLOCKQUOTE', 'OL', 'UL', 'LI', 'TABLE',
        'TBODY', 'TR', 'TD', 'TH', 'THEAD', 'TFOOT', 'H1', 'H2', 'H3', 'H4',
        'H5', 'H6', 'SVG', 'PRE', 'COLGROUP'
    ]);
    const inlineBlockTags: Set<string> = new Set([
        'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IMG', 'LABEL', 'IFRAME', 'VIDEO',
        'AUDIO', 'OBJECT', 'EMBED', 'CANVAS', 'METER', 'PROGRESS', 'OBJECT'
    ]);
    const nonWrappableTags: Set<string> = new Set(['BASE', 'AREA', 'LINK']);
    const nodes: Node[] = Array.from(node.childNodes);
    let currentWrapper: HTMLElement | null = null;
    for (const child of nodes) {
        let needTowrap: boolean = true;
        if (child.parentElement && child.parentElement.nodeName === 'LI') {
            needTowrap = needToWrapLiChild(child.parentElement, blockTags);
        }
        // Process text nodes
        if (child.nodeType === Node.TEXT_NODE) {
            if (child.nodeValue && child.nodeValue.trim() && needTowrap) {
                if (!currentWrapper) {
                    currentWrapper = document.createElement(parentElement);
                    node.insertBefore(currentWrapper, child);
                }
                currentWrapper.appendChild(child);
            }
        }
        // Process element nodes
        else if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement: HTMLElement = child as HTMLElement;
            const tagName: string = childElement.tagName.toUpperCase();
            // Handle block elements
            if (isInSet(blockTags, tagName) && !isInSet(inlineBlockTags, tagName)) {
                currentWrapper = null;
                const childElements: Element[] = Array.from(childElement.childNodes) as Element[];
                // Check if has block children (safe alternative to Array.some())
                let hasBlock: boolean = false;
                childElements.forEach((node: Element) => {
                    const nodeName: string = node.tagName;
                    if (node.nodeType === Node.ELEMENT_NODE && isInSet(blockTags, nodeName)) {
                        hasBlock = true;
                        // Can't break from forEach, but we can use other patterns
                    }
                });
                if (isInSet(recursiveBlockTags, tagName) && childElements.length > 0 && hasBlock) {
                    wrapTextAndInlineNodes(childElement, parentElement);
                }
            }
            // Handle inline elements
            else if (!isInSet(blockTags, tagName) && !isInSet(inlineBlockTags, tagName) && !nonWrappableTags.has(tagName) && tagName !== 'HR') {
                if (child.parentNode && needTowrap && child.parentNode.childNodes.length > 1) {
                    if (!currentWrapper) {
                        currentWrapper = document.createElement(parentElement);
                        node.insertBefore(currentWrapper, child);
                    }
                    currentWrapper.appendChild(child);
                }
            }
        }
        // Flatten nested structures
        if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement: HTMLElement = child as HTMLElement;
            const tagName: string = childElement.tagName.toUpperCase();
            // Check if tag is in blockTags
            let isBlockTag: boolean = false;
            const blockIterator: Iterator<string> = blockTags.values();
            let current: IteratorResult<string> = blockIterator.next();
            while (!current.done) {
                if (current.value === tagName) {
                    isBlockTag = true;
                    break;
                }
                current = blockIterator.next();
            }
            if (isBlockTag) {
                if (childElement.childNodes.length === 1 &&
                    childElement.firstChild &&
                    childElement.firstChild.nodeType === Node.ELEMENT_NODE &&
                    (childElement.firstChild.nodeName === 'P' && childElement.nodeName !== 'DIV') &&
                    (childElement.firstChild as HTMLElement).childNodes.length === 1 &&
                    childElement.firstChild.firstChild &&
                    (childElement.firstChild as HTMLElement).firstChild.nodeType !== Node.ELEMENT_NODE &&
                    (childElement.firstChild as HTMLElement).attributes.length === 0) {
                    childElement.replaceChild(
                        (childElement.firstChild as HTMLElement).firstChild,
                        childElement.firstChild
                    );
                } else if (childElement.nodeName === 'P' && childElement.parentElement && childElement.parentElement.nodeName === 'LI' && !needTowrap && (childElement as HTMLElement).attributes.length === 0) {
                    let isEmptyText: boolean;
                    const next: Node = getNextMeaningfulSibling(childElement.nextSibling);
                    const prev: Node = getPreviousMeaningfulSibling(childElement.previousSibling);
                    if (!next && !prev) {
                        isEmptyText = true;
                    }
                    if (isEmptyText) {
                        while (childElement.firstChild) {
                            childElement.parentElement.insertBefore(childElement.firstChild, childElement); // Move each child before the <p>
                        }
                        childElement.parentElement.removeChild(childElement); // Remove the empty <p>
                    }
                }
            }
        }
    }
}

/**
 *
 * Returns the next meaningful sibling of the given node.
 *
 * @param {Node} node - The DOM node whose child nodes are to be wrapped.
 * @returns {Node | null} - Returns a node or null.
 */
export function getNextMeaningfulSibling (node: Node | null): Node | null {
    while (node) {
        if ((node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') || (node.nodeName === 'OL' || node.nodeName === 'UL')) {
            node = node.nextSibling;
        } else {
            return node;
        }
    }
    return null;
}
/**
 *
 * Returns the previous meaningful sibling of the given node.
 *
 * @param {Node} node - The DOM node whose child nodes are to be wrapped.
 * @returns {Node | null} - Returns a node or null.
 */
export function getPreviousMeaningfulSibling (node: Node | null): Node | null {
    while (node) {
        if ((node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') || (node.nodeName === 'OL' || node.nodeName === 'UL')) {
            node = node.previousSibling;
        } else {
            return node;
        }
    }
    return null;
}

/**
 *
 * Checks if the given node is need to be wrapped.
 *
 * @param {Node} node - The DOM node whose child nodes are to be wrapped.
 * @param {Set<string>} blockTags - The set of block tags.
 * @returns {boolean} - Returns a boolean value.
 */
export function needToWrapLiChild(node: Node, blockTags: Set<string>): boolean {
    let hasBlockElement: boolean = false;
    let hasNonBlockContent: boolean = false;
    const liElement: HTMLElement = node as HTMLElement;

    liElement.childNodes.forEach((child: Node) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            const tag: string = child.nodeName;

            if (blockTags.has(tag) && tag !== 'OL' && tag !== 'UL') {
                const next: Node = child.nextSibling;
                const isFollowedByList: boolean = next && ['UL', 'OL'].indexOf(next.nodeName) !== -1;
                if (!isFollowedByList) {
                    hasBlockElement = true;
                }
            } else if (['OL', 'UL'].indexOf(tag) !== -1) {
                const prev: Node = child.previousSibling;
                const next: Node = child.nextSibling;
                const isSurroundedByContent: boolean = prev && blockTags.has(prev.nodeName) && next && next.nodeType === Node.TEXT_NODE &&
                next.textContent.trim().length > 0;
                if (isSurroundedByContent) {
                    hasBlockElement = true;
                }
            } else if (!blockTags.has(tag) && tag !== 'LI') {
                const next: Node = child.nextSibling;
                const isFollowedByList: boolean = next && ['UL', 'OL'].indexOf(next.nodeName) !== -1;
                if (!isFollowedByList) {
                    hasNonBlockContent = true;
                }
            }
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
            hasNonBlockContent = true;
        }
    });
    return hasBlockElement && hasNonBlockContent;
}

/**
 * Removes all newlines from a string and replaces consecutive spaces between tags with a single space.
 *
 * @param {string} htmlString - The string value from which newlines will be removed.
 * @param {Element} editNode - The editable element.
 * @returns {string} - Returns the modified string without newline characters.
 * @hidden
 */
export function cleanHTMLString(htmlString: string, editNode: Element): string {
    let isPreLine: boolean = false;
    if (getComputedStyle(editNode).whiteSpace === 'pre-wrap' || getComputedStyle(editNode).whiteSpace === 'pre') {
        return htmlString;
    } else if (getComputedStyle(editNode).whiteSpace === 'pre-line') {
        isPreLine = true;
    }
    /**
     * Checks if the given HTML element has the 'pre-line' style.
     *
     * @param {HTMLElement} node - The HTML element to check.
     * @returns {boolean} - True if the element has the 'pre-line' style, false otherwise.
     */
    function hasPreLineStyle(node: HTMLElement): boolean {
        if (node.style.whiteSpace === 'pre-line') {
            return true;
        }
        return false;
    }
    /**
     * Checks if the given HTML element is a preformatted text element ('<pre>').
     *
     * @param {HTMLElement} node - The HTML element to check.
     * @returns {boolean} - True if the element is a '<pre>' tag, false otherwise.
     */
    function hasPre(node: HTMLElement): boolean {
        if (node.tagName === 'PRE') {
            return true;
        }
        if (node.style.whiteSpace === 'pre' || node.style.whiteSpace === 'pre-wrap') {
            return true;
        }
        return false;
    }
    /**
     * Cleans the text content of a given node by processing its child nodes.
     *
     * @param {Node} node - The DOM node whose text content needs to be cleaned.
     * @param {boolean} hasPreLine - Indicates whether the node has the 'pre-line' style.
     * @returns {void}
     */
    function cleanTextContent(node: Node, hasPreLine: boolean = false): void {
        if (node == null) {
            return;
        }
        let child: Node | null = node.firstChild;
        while (child != null) {
            if (child.nodeType === 3) {
                if (hasPreLine) {
                    child.nodeValue = child.nodeValue.replace(/[\t]/g, ' ');
                    child.nodeValue = child.nodeValue.replace(/[ ]{2,}/g, ' ');
                } else {
                    child.nodeValue = child.nodeValue.replace(/[\n\r\t]/g, ' ');
                    child.nodeValue = child.nodeValue.replace(/[ ]{2,}/g, ' ');
                }
            } else if (child.nodeType === 1) {
                if (!hasPre(child as HTMLElement) && !hasPreLineStyle(child as HTMLElement)) {
                    cleanTextContent(child, hasPreLine);
                }
                if (hasPreLineStyle(child as HTMLElement)) {
                    cleanTextContent(child, true);
                }
            }
            child = child.nextSibling;
        }
    }
    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = htmlString;
    cleanTextContent(container, isPreLine);
    return container.innerHTML;
}

/**
 * Converting the base64 url to blob
 *
 * @param {string} dataUrl - specifies the string value
 * @returns {Blob} - returns the blob
 * @hidden
 */
export function convertToBlob(dataUrl: string): Blob {
    const arr: string[] = dataUrl.split(',');
    const mime: string = arr[0].match(/:(.*?);/)[1];
    const bstr: string = atob(arr[1]);
    let n: number = bstr.length;
    const u8arr: Uint8Array = new Uint8Array(n);
    while (n--) {
        u8arr[n as number] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
